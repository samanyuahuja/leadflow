-- ============================================================
-- LeadFlow AI — Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- Supabase Dashboard → SQL Editor → New Query → paste and run
-- ============================================================

-- Enable UUID extension (should already be enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Leads table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_needed TEXT NOT NULL,
  
  -- Qualification
  qualification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (qualification_status IN ('pending', 'in_progress', 'qualified', 'not_qualified')),
  qualification_score INTEGER,
  qualification_reason TEXT,
  
  -- Booking  
  booking_status TEXT NOT NULL DEFAULT 'none'
    CHECK (booking_status IN ('none', 'link_sent', 'booked', 'cancelled')),
  
  -- Full conversation stored as JSONB
  conversation_history JSONB NOT NULL DEFAULT '[]',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bookings table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  booking_date TIMESTAMPTZ NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (booking_status IN ('scheduled', 'completed', 'cancelled')),
  calendly_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes for performance ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_qualification_status ON leads(qualification_status);
CREATE INDEX IF NOT EXISTS idx_leads_booking_status ON leads(booking_status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ────────────────────────────────────────
-- Leads and bookings are only accessible server-side via service role key.
-- RLS is enabled but only the service role (bypass) can read/write.

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- No public access — all queries must go through API routes using service role key
-- (This means no direct client-side Supabase queries to these tables)

-- ── Verify setup ─────────────────────────────────────────────
SELECT 'Setup complete. Tables created: leads, bookings' AS status;
