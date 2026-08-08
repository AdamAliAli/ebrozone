import { Skeleton } from "../../components/ui/skeleton";

// docs/design-system/ANIMATION_SYSTEM.md — "prefer skeleton loaders...
// loading should feel fast and responsive," not a spinner.
export default function StudentDashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-5 w-96 max-w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
