# EbroZone Design Tokens

> This document defines the official design tokens for EbroZone Version 1.

Design tokens are the single source of truth for all visual values used throughout the platform. They ensure consistency between design, development, and AI-generated code.

All components should reference design tokens instead of hardcoded values.

---

# Design Philosophy

Every visual value should have a reusable token.

Avoid hardcoding:

- Colors
- Font sizes
- Spacing
- Border radius
- Shadows
- Animation durations

Using tokens keeps the interface consistent and simplifies future updates.

---

# Color Tokens

```css
--color-primary: #1E3A8A;
--color-secondary: #3B82F6;
--color-accent: #F59E0B;

--color-success: #22C55E;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;

--color-background: #FFFFFF;
--color-surface: #F8FAFC;
--color-border: #E2E8F0;

--color-text-primary: #0F172A;
--color-text-secondary: #475569;
--color-text-muted: #94A3B8;
```

---

# Typography Tokens

```css
--font-family: "Inter", sans-serif;

--font-size-caption: 12px;
--font-size-small: 14px;
--font-size-body: 16px;
--font-size-body-lg: 18px;
--font-size-heading: 20px;
--font-size-card-title: 24px;
--font-size-section: 32px;
--font-size-page: 40px;
--font-size-hero: 60px;
```

---

# Font Weight Tokens

```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

# Spacing Tokens

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
--spacing-4xl: 80px;
--spacing-5xl: 96px;
--spacing-section: 120px;
```

---

# Border Radius Tokens

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

# Shadow Tokens

```css
--shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08);

--shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);

--shadow-lg: 0 16px 40px rgba(15, 23, 42, 0.12);
```

Shadows should remain soft and subtle.

---

# Animation Tokens

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;

--ease-standard: ease-in-out;
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

---

# Z-Index Tokens

```css
--z-dropdown: 1000;
--z-sticky: 1100;
--z-overlay: 1200;
--z-modal: 1300;
--z-toast: 1400;
--z-tooltip: 1500;
```

---

# Layout Tokens

```css
--container-width: 1280px;
--container-wide: 1440px;

--grid-desktop: 12;
--grid-tablet: 8;
--grid-mobile: 4;
```

---

# Breakpoint Tokens

```css
--mobile: 640px;
--tablet: 1024px;
--desktop: 1440px;
```

---

# Usage Rules

Every component should reference these tokens.

Example:

```css
padding: var(--spacing-lg);
border-radius: var(--radius-lg);
color: var(--color-primary);
font-size: var(--font-size-body);
```

Hardcoded visual values should be avoided whenever possible.

---

# Future Expansion

Additional tokens may be introduced for:

- Dark Mode
- Seasonal Themes
- Marketing Themes
- Animation Presets

without changing the existing naming conventions.

---

# Success Criteria

A successful design token system ensures that:

- Design and development remain synchronized.
- Global visual updates require minimal effort.
- Components remain visually consistent.
- AI-generated code follows the same design language across the entire platform.
