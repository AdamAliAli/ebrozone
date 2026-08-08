import { Badge } from "../ui/badge";
import type { HomeworkResponse } from "../../lib/api/types";

const STATUS_LABEL: Record<HomeworkResponse["submissionStatus"], string> = {
  NOT_SUBMITTED: "Not Submitted",
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
};

const STATUS_VARIANT: Record<
  HomeworkResponse["submissionStatus"],
  "outline" | "secondary" | "default"
> = {
  NOT_SUBMITTED: "outline",
  SUBMITTED: "secondary",
  REVIEWED: "default",
};

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// Bound to HomeworkResponse — reusable wherever homework needs to be
// displayed (Student's Homework section now; Teacher's homework-review
// list later, since both consume the same backend DTO).
export function HomeworkListItem({ homework }: { homework: HomeworkResponse }) {
  return (
    <li className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-body text-foreground">
          {homework.instructions}
        </p>
        <p className="mt-1 text-small text-muted-foreground">
          Due {formatDueDate(homework.dueDate)}
        </p>
      </div>
      <Badge variant={STATUS_VARIANT[homework.submissionStatus]} className="shrink-0">
        {STATUS_LABEL[homework.submissionStatus]}
      </Badge>
    </li>
  );
}
