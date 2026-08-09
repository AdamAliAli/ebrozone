import { Badge } from "../ui/badge";
import type { ConsultationRequestResponse } from "../../lib/api/types";

const STATUS_LABEL: Record<ConsultationRequestResponse["status"], string> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  DECLINED: "Declined",
};

const STATUS_VARIANT: Record<
  ConsultationRequestResponse["status"],
  "outline" | "secondary" | "default" | "destructive"
> = {
  PENDING: "secondary",
  CONTACTED: "outline",
  CONVERTED: "default",
  DECLINED: "destructive",
};

function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// Bound to ConsultationRequestResponse — Admin's New Consultation Requests
// list. Read-only: docs/product-design/admin-dashboard/04-high-fidelity.md
// mentions a "Review button", but there is no consultation-management page
// yet to route it to, and a non-functional control is worse than none.
export function ConsultationRequestListItem({
  request,
}: {
  request: ConsultationRequestResponse;
}) {
  const detail = [request.currentEnglishLevel, request.learningGoal]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-body font-medium text-foreground">
          {request.fullName}
        </p>
        <p className="mt-1 truncate text-small text-muted-foreground">
          {request.phone}
          {request.email ? ` · ${request.email}` : ""}
        </p>
        {detail ? (
          <p className="mt-1 truncate text-small text-muted-foreground">
            {detail}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge variant={STATUS_VARIANT[request.status]}>
          {STATUS_LABEL[request.status]}
        </Badge>
        <span className="text-small text-muted-foreground">
          {formatSubmittedAt(request.createdAt)}
        </span>
      </div>
    </li>
  );
}
