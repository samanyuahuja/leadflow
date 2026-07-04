import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { LeadFilter } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get("filter") as LeadFilter) || "all";
    const search = searchParams.get("search") || "";

    const supabase = createServerClient();

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filter === "qualified") {
      query = query.eq("qualification_status", "qualified");
    } else if (filter === "not_qualified") {
      query = query.eq("qualification_status", "not_qualified");
    } else if (filter === "booked") {
      query = query.eq("booking_status", "booked");
    } else if (filter === "pending") {
      query = query.eq("qualification_status", "pending");
    }

    // Apply search
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching leads:", error);
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
