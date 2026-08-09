"use client";

import { useEffect } from "react";
import { Button } from "../../components/ui/button";

// docs/product-design/teacher-dashboard/06-interactions.md — "display a
// friendly error message, allow retry, keep unaffected sections usable."
export default function TeacherDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h2 className="text-heading font-semibold text-foreground">
        We couldn&apos;t load your dashboard
      </h2>
      <p className="max-w-sm text-body text-muted-foreground">
        Something went wrong while loading your dashboard. Please try again.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
