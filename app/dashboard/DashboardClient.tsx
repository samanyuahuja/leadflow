"use client";

import { useState, useEffect, useCallback } from "react";
import { Bot, LayoutDashboard, ExternalLink } from "lucide-react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import type { Lead, LeadFilter } from "@/types";

export function DashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeadFilter>("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?filter=${filter}`);
      const json = await res.json();
      if (json.data) {
        setLeads(json.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchLeads, 30_000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar-style header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">Lead Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View landing page
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground mt-1">
            All leads captured and qualified by your AI receptionist.
          </p>
        </div>

        {/* Stats */}
        <StatsCards leads={leads} />

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <LeadsTable
            leads={leads}
            loading={loading}
            onRefresh={fetchLeads}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </main>
    </div>
  );
}
