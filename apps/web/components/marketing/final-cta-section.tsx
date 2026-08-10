import Link from "next/link";
import { Button } from "../ui/button";

// docs/product-design/landing-page/03-wireframe.md Section 12 (Final CTA).
export function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-6 lg:py-24">
      <h2 className="text-page font-bold text-foreground">Ready to Begin?</h2>
      <p className="mt-4 text-body-lg text-muted-foreground">
        Enrolled students and teachers can access their dashboard anytime.
      </p>
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg">
          <Link href="/login">Login to EbroZone</Link>
        </Button>
      </div>
    </section>
  );
}
