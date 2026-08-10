"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./ForgotPasswordForm.module.css";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Enter your email address.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(undefined);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        setFormError("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // The backend never reveals whether the email belongs to an account
      // (docs/architecture/SECURITY.md — never expose sensitive
      // information), so the same message is shown regardless of outcome.
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch {
      setFormError(
        "Something went wrong. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className={styles.form}>
        <div className={styles.formSuccess} role="status">
          If an account exists for {email.trim()}, we&apos;ve sent a link to
          reset your password.
        </div>
        <Link href="/login" className={styles.backToLogin}>
          ← Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError ? (
        <div className={styles.formError} role="alert">
          {formError}
        </div>
      ) : null}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={styles.input}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
          disabled={isSubmitting}
        />
        {emailError ? (
          <p id="email-error" className={styles.fieldError}>
            {emailError}
          </p>
        ) : null}
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Reset Link"}
      </button>

      <Link href="/login" className={styles.backToLogin}>
        ← Back to Login
      </Link>
    </form>
  );
}
