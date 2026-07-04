import { Badge } from "@/components/ui/badge";
import type { QualificationStatus, BookingStatus } from "@/types";

export function QualificationBadge({ status }: { status: QualificationStatus }) {
  switch (status) {
    case "qualified":
      return <Badge variant="success">Qualified</Badge>;
    case "not_qualified":
      return <Badge variant="destructive">Not qualified</Badge>;
    case "in_progress":
      return <Badge variant="info">In progress</Badge>;
    case "pending":
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
}

export function BookingBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case "booked":
      return <Badge variant="success">Booked</Badge>;
    case "link_sent":
      return <Badge variant="info">Link sent</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "none":
    default:
      return <Badge variant="outline">None</Badge>;
  }
}
