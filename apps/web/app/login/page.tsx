import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAccessToken } from "../../lib/auth/cookies";
import { decodeAccessToken, isAccessTokenExpired } from "../../lib/auth/jwt";
import type { Role } from "../../lib/auth/types";
import { LoginForm } from "./LoginForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign In | EbroZone",
  description: "Sign in to access your EbroZone learning dashboard.",
};

const ROLE_HOME: Record<Role, string> = {
  STUDENT: "/student",
  TEACHER: "/teacher",
  ADMINISTRATOR: "/admin",
};

export default async function LoginPage() {
  // docs/product-design/student-authentication/08-developer-notes.md:
  // "Prevent authenticated users from accessing the login page again."
  const accessToken = await getAccessToken();
  const payload = accessToken ? decodeAccessToken(accessToken) : null;
  if (payload && !isAccessTokenExpired(payload)) {
    redirect(ROLE_HOME[payload.role]);
  }

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link href="/" className={styles.logoLink} aria-label="EbroZone home">
          <Image
            src="/logo.png"
            alt="EbroZone"
            width={140}
            height={44}
            priority
            style={{ height: "auto" }}
          />
        </Link>
        <Link href="/" className={styles.backLink}>
          ← Back to Website
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.welcome}>
          <h1 className={styles.welcomeHeading}>Welcome Back</h1>
          <p className={styles.welcomeDescription}>
            Sign in to continue your learning journey with Ebro.
          </p>
        </section>

        <section className={styles.formSection} aria-labelledby="login-heading">
          <div className={styles.card}>
            <h2 id="login-heading" className={styles.cardTitle}>
              Sign In
            </h2>
            <LoginForm />
          </div>
        </section>
      </main>

      <section className={styles.help}>
        <h2 className={styles.helpHeading}>Need Help?</h2>
        <p className={styles.helpText}>
          If you can&apos;t access your account, reach out to Ebro for
          assistance.
        </p>
      </section>

      <footer className={styles.footer}>
        <nav className={styles.footerNav} aria-label="Footer">
          <Link href="/">Contact</Link>
        </nav>
      </footer>
    </div>
  );
}
