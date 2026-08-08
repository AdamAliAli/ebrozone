"use client";

import { useEffect } from "react";
import { Button } from "../../components/ui/button";

// docs/product-design/student-dashboard/08-developer-notes.md — "if data
// cannot be retrieved: show a friendly message, allow retry, keep the
// interface usable." Next.js's error.tsx boundary is the idiomatic fit.
export default function StudentDashboardError({
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
