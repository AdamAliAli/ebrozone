import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Forgot Password | EbroZone",
  description: "Reset the password for your EbroZone account.",
};

// docs/specifications/AUTHENTICATION_AND_ACCOUNTS.md — "Users can request
// a password reset. The system sends a secure password reset link to the
// registered email address." Backend already supports this
// (POST /auth/forgot-password); this is the minimal page needed so the
// login page's existing "Forgot password?" link isn't a dead 404.
export default function ForgotPasswordPage() {
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
        <section className={styles.formSection} aria-labelledby="forgot-password-heading">
          <div className={styles.card}>
            <h1 id="forgot-password-heading" className={styles.cardTitle}>
              Reset Your Password
            </h1>
            <p className={styles.cardDescription}>
              Enter your email address and we&apos;ll send you a link to
              reset your password.
            </p>
            <ForgotPasswordForm />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <nav className={styles.footerNav} aria-label="Footer">
          <Link href="/login">Login</Link>
        </nav>
      </footer>
    </div>
  );
}
