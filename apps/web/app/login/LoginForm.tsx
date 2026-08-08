"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "../../lib/auth/types";
import styles from "./LoginForm.module.css";

const ROLE_HOME: Record<Role, string> = {
  STUDENT: "/student",
  TEACHER: "/teacher",
  ADMINISTRATOR: "/admin",
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextFieldErrors: FieldErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      nextFieldErrors.email = "Enter your email address.";
    } else if (!isValidEmail(trimmedEmail)) {
      nextFieldErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextFieldErrors.password = "Enter your password.";
    }
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        // docs .../06-interactions.md: preserve the entered email, let the
        // student try again immediately.
        setFormError(body?.message ?? "Unable to sign in. Please try again.");
        setPassword("");
        setIsSubmitting(false);
        return;
      }

      const role: Role | undefined = body?.user?.role;
      router.push(role ? ROLE_HOME[role] : "/");
      router.refresh();
    } catch {
      setFormError(
        "Something went wrong. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
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
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          disabled={isSubmitting}
        />
        {fieldErrors.email ? (
          <p id="email-error" className={styles.fieldError}>
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.passwordRow}>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={styles.input}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            disabled={isSubmitting}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isSubmitting}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {fieldErrors.password ? (
          <p id="password-error" className={styles.fieldError}>
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div className={styles.optionsRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isSubmitting}
          />
          Remember me
        </label>
        <a href="/forgot-password" className={styles.forgotLink}>
          Forgot password?
        </a>
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
