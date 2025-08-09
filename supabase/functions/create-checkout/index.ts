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
    if (!authHeader) throw new Error("No Authorization header provided");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User email is required");

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });

    // Determine plan from request body
    const { plan } = await req.json().catch(() => ({ plan: "starter" }));
    const planKey = String(plan || "starter").toLowerCase();

    // Temporary test pricing (EUR, monthly). Replace with real price IDs later.
    const priceMap: Record<string, { amount: number; name: string }> = {
      starter: { amount: 1300, name: "PinCraft Starter" },
      pro: { amount: 3400, name: "PinCraft Pro" },
      agency: { amount: 11200, name: "PinCraft Agency" },
    };

    const selected = priceMap[planKey] ?? priceMap.starter;

    // Try to find existing Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    const existingCustomer = customers.data[0];

    const session = await stripe.checkout.sessions.create({
      customer: existingCustomer?.id,
      customer_email: existingCustomer ? undefined : user.email!,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: selected.name },
            unit_amount: selected.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      success_url: `${req.headers.get("origin")}/dashboard?checkout=success`,
      cancel_url: `${req.headers.get("origin")}/#pricing?checkout=cancel`,
      allow_promotion_codes: true,
    });

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
