import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (msg: string, details?: unknown) => {
  console.log(`[CHECK-SUBSCRIPTION] ${msg}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Use service role key to bypass RLS for writes
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No Authorization header provided");
    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User email is required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Optional body with session_id from success URL
    let body: any = {};
    try { body = await req.json(); } catch (_) {}
    const sessionId: string | undefined = body?.session_id || body?.sessionId;
    log("Incoming body", { hasSessionId: Boolean(sessionId) });

    // Try to retrieve data from Stripe Checkout Session if provided
    let sessionCustomerId: string | undefined;
    let sessionSubscriptionId: string | undefined;
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        sessionCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        sessionSubscriptionId = typeof session.subscription === 'string' ? session.subscription : (session.subscription as any)?.id;
        log("Retrieved checkout session", { sessionId, sessionCustomerId, sessionSubscriptionId });
      } catch (e) {
        log("Failed retrieving checkout session", { sessionId, error: (e as Error).message });
      }
    }

    // Also try existing profile's customer id and previous status
    const { data: prof } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, subscription_status, plan_type, monthly_limit, current_period_end')
      .eq('user_id', user.id)
      .maybeSingle();

    // Fallback: lookup by email
    let emailCustomerId: string | undefined;
    if (!sessionCustomerId) {
      try {
        const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
        emailCustomerId = customers.data[0]?.id;
      } catch (e) {
        log("Stripe customers.list failed", { error: (e as Error).message });
      }
    }

    const customerId = sessionCustomerId || prof?.stripe_customer_id || emailCustomerId;

    if (!customerId) {
      log("No Stripe customer found; preserving previous state if any");

      if (prof) {
        const wasActive = prof.subscription_status === 'active';
        return new Response(JSON.stringify({
          subscribed: wasActive,
          plan_type: prof.plan_type ?? 'none',
          planType: prof.plan_type ?? 'none',
          subscription_tier: prof.plan_type ?? null,
          current_period_end: prof.current_period_end ?? null,
          subscription_end: prof.current_period_end ?? null,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // No previous profile state to rely on → treat as unsubscribed (but avoid DB writes)
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Determine active subscription
    let activeSub: Stripe.Subscription | null = null;

    // If we have the subscription id from the session, use it first
    if (sessionSubscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(sessionSubscriptionId);
        if (['active', 'trialing', 'past_due'].includes(sub.status)) {
          activeSub = sub as any;
        }
      } catch (e) {
        log("Failed retrieving subscription from session", { error: (e as Error).message });
      }
    }

    // Otherwise list subscriptions and pick an eligible one
    if (!activeSub) {
      const subs = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
      activeSub = subs.data.find((s) => ['active', 'trialing'].includes(s.status)) || null;
    }

    let hasActive = Boolean(activeSub);
    let planType: 'starter' | 'pro' | 'agency' | 'none' = 'none';
    let monthlyLimit = 0; // No usage without subscription
    let subscriptionId: string | null = null;
    let periodEnd: string | null = null;

    if (activeSub) {
      subscriptionId = activeSub.id;
      periodEnd = new Date(activeSub.current_period_end * 1000).toISOString();

      const price: any = activeSub.items.data[0]?.price;
      const lookupKey: string | undefined = price?.lookup_key ?? undefined;
      const amount = price?.unit_amount || 0;

      if (lookupKey) {
        const key = lookupKey.toLowerCase();
        if (key.includes('starter')) { planType = 'starter'; monthlyLimit = 25; }
        else if (key.includes('pro')) { planType = 'pro'; monthlyLimit = 150; }
        else if (key.includes('agency') || key.includes('business')) { planType = 'agency'; monthlyLimit = 500; }
        else {
          if (amount <= 1300) { planType = 'starter'; monthlyLimit = 25; }
          else if (amount <= 3400) { planType = 'pro'; monthlyLimit = 150; }
          else { planType = 'agency'; monthlyLimit = 500; }
        }
      } else {
        if (amount <= 1300) { planType = 'starter'; monthlyLimit = 25; }
        else if (amount <= 3400) { planType = 'pro'; monthlyLimit = 150; }
        else { planType = 'agency'; monthlyLimit = 500; }
      }
    }

    // Update profile
    await supabase.from('profiles').update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status: hasActive ? 'active' : 'inactive',
      plan_type: hasActive ? planType : 'none',
      monthly_limit: hasActive ? monthlyLimit : 0,
      current_period_end: periodEnd,
    }).eq('user_id', user.id);

    log("Profile updated", { hasActive, planType, customerId, subscriptionId });

    return new Response(JSON.stringify({
      subscribed: hasActive,
      // Backward + forward compatible keys
      plan_type: planType,
      planType: planType,
      subscription_tier: planType,
      current_period_end: periodEnd,
      subscription_end: periodEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[CHECK-SUBSCRIPTION] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
