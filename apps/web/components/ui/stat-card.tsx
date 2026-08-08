import { Card, CardContent } from "./card";

interface StatCardProps {
  label: string;
  value: number;
}

// Shared across Student/Teacher/Admin dashboards — "Statistics Card"
// appears in all three docs' component lists. Only ever bound to a real
// count returned by the API, never an invented metric.
export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="py-4">
      <CardContent className="px-4">
        <p className="text-small text-muted-foreground">{label}</p>
        <p className="mt-1 text-page font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
