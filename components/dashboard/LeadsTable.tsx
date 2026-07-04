"use client";

import { useState } from "react";
import { Search, RefreshCw, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QualificationBadge, BookingBadge } from "./StatusBadge";
import { LeadDetailModal } from "./LeadDetailModal";
import type { Lead, LeadFilter } from "@/types";
import { formatDate, formatPhone } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onRefresh: () => void;
  filter: LeadFilter;
  onFilterChange: (f: LeadFilter) => void;
}

const FILTER_OPTIONS: { label: string; value: LeadFilter }[] = [
  { label: "All leads", value: "all" },
  { label: "Qualified", value: "qualified" },
  { label: "Not qualified", value: "not_qualified" },
  { label: "Booked", value: "booked" },
  { label: "Pending", value: "pending" },
];

export function LeadsTable({
  leads,
  loading,
  onRefresh,
  filter,
  onFilterChange,
}: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === opt.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Service</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Booking</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Loading leads...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    {search ? "No leads match your search." : "No leads yet. Share your landing page to start collecting leads."}
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{lead.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {formatPhone(lead.phone)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-[160px] truncate">
                      {lead.service_needed}
                    </td>
                    <td className="px-4 py-3">
                      <QualificationBadge status={lead.qualification_status} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <BookingBadge status={lead.booking_status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        aria-label={`View details for ${lead.name}`}
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        Showing {filtered.length} of {leads.length} lead{leads.length !== 1 ? "s" : ""}
      </p>

      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}
