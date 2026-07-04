import { Users, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Lead } from "@/types";

interface StatsCardsProps {
  leads: Lead[];
}

export function StatsCards({ leads }: StatsCardsProps) {
  const total = leads.length;
  const qualified = leads.filter((l) => l.qualification_status === "qualified").length;
  const notQualified = leads.filter((l) => l.qualification_status === "not_qualified").length;
  const booked = leads.filter((l) => l.booking_status === "booked").length;
  const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;

  const stats = [
    {
      label: "Total leads",
      value: total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Qualified",
      value: qualified,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      sub: `${conversionRate}% conversion`,
    },
    {
      label: "Not qualified",
      value: notQualified,
      icon: XCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Appointments booked",
      value: booked,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {stat.sub && (
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
