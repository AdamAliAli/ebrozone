import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

// Shared across Student/Teacher/Admin dashboards —
// docs/product-design/{student,teacher,admin}-dashboard/05-components.md
// all list "Section Header" in their shared-component set.
export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-heading font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-small text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
