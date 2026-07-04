import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lead_id = searchParams.get("lead_id");

    const supabase = createServerClient();

    let query = supabase
      .from("bookings")
      .select(`
        *,
        leads (
          name,
          email,
          phone,
          service_needed
        )
      `)
      .order("booking_date", { ascending: true });

    if (lead_id) {
      query = query.eq("lead_id", lead_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
