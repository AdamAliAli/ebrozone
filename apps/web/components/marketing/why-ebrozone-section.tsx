import { MessageSquareText, Globe2, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { SectionHeader } from "../ui/section-header";

interface Feature {
  title: string;
  description: string;
  icon: typeof MessageSquareText;
}

// docs/product/HOMEPAGE_STORYBOARD.md Section 4 ("Why EbroZone") +
// docs/BRAND_DNA.md's Learning Philosophy / Brand Values — every line here
// paraphrases a documented principle, nothing invented.
const FEATURES: Feature[] = [
  {
    title: "Confidence-First Learning",
    description:
      "Communication comes before perfect grammar. Every lesson helps you speak with confidence, not just pass a test.",
    icon: MessageSquareText,
  },
  {
    title: "Real-Life Communication",
    description:
      "Practice the English you'll actually use — real conversations, interviews, travel, and everyday life.",
    icon: Globe2,
  },
  {
    title: "Personal, One-to-One Guidance",
    description:
      "Live sessions with your teacher, built around your own goals — not a generic curriculum.",
    icon: Users,
  },
  {
    title: "A Safe Place to Practice",
    description:
      "Mistakes are part of learning. EbroZone is a space where you're encouraged to try, speak, and grow.",
    icon: ShieldCheck,
  },
];

export function WhyEbroZoneSection() {
  return (
    <section id="why-ebrozone" className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
      <SectionHeader
        title="Why EbroZone"
        description="A different approach to learning English."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="flex flex-col gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-secondary">
                <feature.icon size={20} aria-hidden="true" />
              </span>
              <h3 className="text-card-title font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-body text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
