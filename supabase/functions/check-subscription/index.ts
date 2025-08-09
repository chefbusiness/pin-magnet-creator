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

    // Find Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    if (customers.data.length === 0) {
      log("No Stripe customer found; marking profile inactive");
      await supabase.from('profiles').update({
        subscription_status: 'inactive',
        stripe_customer_id: null,
        stripe_subscription_id: null,
      }).eq('user_id', user.id);

      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
      expand: ["data.items.data.price"],
    });

    const hasActive = subscriptions.data.length > 0;
    let planType: 'free' | 'starter' | 'pro' | 'business' = 'free';
    let monthlyLimit = 5;
    let subscriptionId: string | null = null;
    let periodEnd: string | null = null;

    if (hasActive) {
      const sub = subscriptions.data[0];
      subscriptionId = sub.id;
      periodEnd = new Date(sub.current_period_end * 1000).toISOString();

      const price: any = sub.items.data[0].price;
      const lookupKey: string | undefined = price?.lookup_key ?? undefined;
      if (lookupKey) {
        const key = lookupKey.toLowerCase();
        if (key.includes('starter')) { planType = 'starter'; monthlyLimit = 25; }
        else if (key.includes('pro')) { planType = 'pro'; monthlyLimit = 150; }
        else if (key.includes('agency') || key.includes('business')) { planType = 'business'; monthlyLimit = 500; }
        else {
          const amount = price?.unit_amount || 0;
          if (amount <= 1300) { planType = 'starter'; monthlyLimit = 25; }
          else if (amount <= 3400) { planType = 'pro'; monthlyLimit = 150; }
          else { planType = 'business'; monthlyLimit = 500; }
        }
      } else {
        const amount = price?.unit_amount || 0;
        if (amount <= 1300) { planType = 'starter'; monthlyLimit = 25; }
        else if (amount <= 3400) { planType = 'pro'; monthlyLimit = 150; }
        else { planType = 'business'; monthlyLimit = 500; }
      }
    }

    await supabase.from('profiles').update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status: hasActive ? 'active' : 'inactive',
      plan_type: hasActive ? planType : 'free',
      monthly_limit: hasActive ? monthlyLimit : 5,
      current_period_end: periodEnd,
    }).eq('user_id', user.id);

    log("Profile updated", { hasActive, planType });

    return new Response(JSON.stringify({
      subscribed: hasActive,
      plan_type: planType,
      current_period_end: periodEnd,
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
