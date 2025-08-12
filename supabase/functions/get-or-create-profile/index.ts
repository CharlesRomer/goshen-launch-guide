import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use service role for secure, server-side access (bypasses RLS)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = typeof name === "string" ? name.trim() : "";

    console.log("get-or-create-profile called", { normalizedEmail });

    // Try to find existing profile by email
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (selectError) {
      console.error("Select error:", selectError);
      throw new Error("Failed to lookup profile");
    }

    if (existing) {
      return new Response(JSON.stringify({ profileId: existing.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create new profile
    const { data: created, error: insertError } = await supabase
      .from("profiles")
      .insert({ name: normalizedName, email: normalizedEmail })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to create profile");
    }

    return new Response(JSON.stringify({ profileId: created.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("get-or-create-profile error:", err);
    return new Response(
      JSON.stringify({ error: (err as any)?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
