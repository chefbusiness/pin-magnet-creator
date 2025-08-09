import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple logger
const log = (msg: string, details?: unknown) => {
  console.log(`[CREATE-CHECKOUT] ${msg}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized: missing Authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user?.email) {
      return new Response(JSON.stringify({ error: `Unauthorized: ${userError?.message ?? 'invalid user'}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const user = userData.user;

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });

    // Determine plan from request body
    const { plan } = await req.json().catch(() => ({ plan: 'starter' }));
    const planKey = String(plan || 'starter').toLowerCase();

    // Map plan to Stripe Price lookup_key (LIVE)
    const lookupMap: Record<string, string> = {
      starter: 'pincraft_starter_monthly_eur',
      pro: 'pincraft_pro_monthly_eur',
      agency: 'pincraft_agency_monthly_eur',
    };

    const selectedLookup = lookupMap[planKey] ?? lookupMap.starter;

    // Try to find existing Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    const existingCustomer = customers.data[0];

    // Resolve Price by lookup_key (safer than hardcoding price IDs)
    const prices = await stripe.prices.list({
      lookup_keys: [selectedLookup],
      active: true,
      expand: ['data.product']
    });
    const price = prices.data[0];
    if (!price) {
      throw new Error(`Stripe Price not found for lookup_key=${selectedLookup}`);
    }

    const origin = req.headers.get('origin') || 'https://pincraft.pro';

    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      success_url: `${origin}/billing/success`,
      cancel_url: `${origin}/billing/canceled`,
      allow_promotion_codes: true,
    };

    if (existingCustomer?.id) {
      params.customer = existingCustomer.id;
      params.customer_update = { name: 'auto', address: 'auto', shipping: 'auto' };
    } else {
      params.customer_email = user.email!;
    }

    const session = await stripe.checkout.sessions.create(params);

    log("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[CREATE-CHECKOUT] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
