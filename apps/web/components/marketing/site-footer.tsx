import Image from "next/image";
import Link from "next/link";

// docs/product-design/landing-page/04-high-fidelity.md's Footer spec lists
// Privacy Policy / Terms & Conditions / social links, but the project has
// no real legal copy or confirmed social handles yet — inventing either
// would violate the "no fake data" rule, so only real, working links
// appear (logo home-link + Login).
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center lg:px-6">
        <Link href="/" aria-label="EbroZone home">
          <Image
            src="/logo.png"
            alt="EbroZone"
            width={100}
            height={32}
            style={{ height: "auto" }}
          />
        </Link>
        <p className="text-small text-muted-foreground">
          Confidence-first English learning with Ebro.
        </p>
        <Link
          href="/login"
          className="text-small font-medium text-secondary hover:underline"
        >
          Login
        </Link>
      </div>
    </footer>
  );
}
