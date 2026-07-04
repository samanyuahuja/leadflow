"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { LeadFormData, Lead } from "@/types";
import type { BusinessConfig } from "@/types";

interface LeadFormProps {
  businessConfig: BusinessConfig;
  onLeadCreated: (lead: Lead) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service_needed?: string;
  general?: string;
}

function validateForm(data: LeadFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (data.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a valid phone number";
  }

  if (!data.service_needed) {
    errors.service_needed = "Please select a service";
  }

  return errors;
}

export function LeadForm({ businessConfig, onLeadCreated }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    service_needed: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const serviceOptions = businessConfig.services.map((s) => ({ value: s, label: s }));

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrors({ general: json.error || "Something went wrong. Please try again." });
        return;
      }

      onLeadCreated(json.data);
    } catch {
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          placeholder="Jane Smith"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service needed</Label>
        <Select
          id="service"
          placeholder="Select a service..."
          options={serviceOptions}
          value={formData.service_needed}
          onChange={(e) => handleChange("service_needed", e.target.value)}
          aria-invalid={!!errors.service_needed}
        />
        {errors.service_needed && (
          <p className="text-sm text-destructive">{errors.service_needed}</p>
        )}
      </div>

      {errors.general && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errors.general}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-11 text-base"
      >
        {loading ? "Starting your session..." : "Book Your Consultation →"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        No spam. We only use your info to book your appointment.
      </p>
    </div>
  );
}
