import { Badge } from "../ui/badge";
import type { MessageResponse } from "../../lib/api/types";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Bound to MessageResponse — reusable wherever a message preview needs to
// be displayed (Teacher's Recent Messages now; Student's/Admin's message
// lists later, since all consume the same backend DTO). No sender/
// recipient name is shown — the backend has no name field on User at all.
export function MessagePreview({ message }: { message: MessageResponse }) {
  const isUnread = message.readAt === null;

  return (
    <li className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0">
        <p
          className={
            isUnread
              ? "truncate text-body font-semibold text-foreground"
              : "truncate text-body text-foreground"
          }
        >
          {message.body}
        </p>
        <p className="mt-1 text-small text-muted-foreground">
          {formatTimestamp(message.createdAt)}
        </p>
      </div>
      {isUnread ? (
        <Badge variant="secondary" className="shrink-0">
          Unread
        </Badge>
      ) : null}
    </li>
  );
}
