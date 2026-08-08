interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
}

// Shared across Student/Teacher dashboards (docs list "Progress Bar" as a
// shared component). Only ever bound to a real, known numerator/denominator
// — never used to represent an invented "level" or score.
export function ProgressBar({ label, value, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-small">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {value} / {max}
        </span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-secondary transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-standard)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
