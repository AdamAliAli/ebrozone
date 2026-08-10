import Link from "next/link";
import { MessageCircleHeart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

// docs/product/HOMEPAGE_STORYBOARD.md Section 1 (Hero) + Decision #003 in
// docs/DECISION_LOG.md ("Welcome Message") for the headline copy.
// docs/product-design/landing-page/04-high-fidelity.md's Hero spec calls
// for a floating dashboard-preview visual on the right — built here with
// static illustrative labels (not real booking data) and explicitly
// captioned as a preview, per the "no fake data" rule.
export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-5 lg:items-center lg:gap-8 lg:px-6 lg:py-24">
      <div className="lg:col-span-3">
        <h1 className="text-section font-bold text-foreground sm:text-page lg:text-hero">
          Welcome to the Ebro Zone.
        </h1>
        <p className="mt-4 max-w-xl text-body-lg text-muted-foreground">
          You&apos;re safe here. Learning a new language can feel
          intimidating — EbroZone is built around confidence-first, one-to-one
          English lessons, so you can speak freely, make mistakes, and grow
          at your own pace.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/login">Login to Your Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#why-ebrozone">Why EbroZone</a>
          </Button>
        </div>
      </div>

      <div className="lg:col-span-2">
        <Card className="mx-auto max-w-sm shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-card-title">
                <MessageCircleHeart
                  className="text-secondary"
                  size={20}
                  aria-hidden="true"
                />
                Live Class
              </CardTitle>
              <Badge variant="secondary">Confirmed</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-body font-medium text-foreground">
              One-to-one with your teacher
            </p>
            <p className="text-small text-muted-foreground">
              A preview of your student dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
