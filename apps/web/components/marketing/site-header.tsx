import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

// docs/product-design/landing-page/03-wireframe.md's Navigation section
// lists Courses/About/Success Stories/Contact — none of those pages exist
// yet, so only real, working links appear here (logo home-link + an
// in-page anchor to the section actually built below + Login). Adding
// links to unbuilt pages would just create new 404s.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center" aria-label="EbroZone home">
          <Image
            src="/logo.png"
            alt="EbroZone"
            width={120}
            height={38}
            priority
            style={{ height: "auto" }}
          />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <a
            href="#why-ebrozone"
            className="hidden text-small font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Why EbroZone
          </a>
          <a
            href="#courses"
            className="hidden text-small font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Courses
          </a>
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
