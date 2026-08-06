# Multilingual Architecture

> This document defines how multilingual support works throughout EbroZone Version 1.

EbroZone is designed as a multilingual platform from the beginning. Every part of the application should support localization without requiring structural changes in the future.

Version 1 supports the following languages:

- English (en)
- Arabic (ar)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Persian (fa)
- French (fr)

---

# Goals

The multilingual architecture should:

- Support multiple languages consistently.
- Provide an excellent experience for both LTR and RTL languages.
- Keep translations easy to manage.
- Allow future languages to be added without changing the application structure.

---

# Localization Strategy

The application uses locale-based routing.

Examples:

```
/en
/ar
/ja
/zh
```

Every page should exist under a language prefix.

---

# Default Language

Default language:

English (en)

Users can change their preferred language at any time.

---

# RTL Support

The application must fully support:

- Arabic
- Persian

When an RTL language is selected:

- Text direction changes to RTL.
- Layout adapts automatically.
- Navigation and spacing remain visually balanced.

No separate RTL design should be created.

The design system should support both directions naturally.

---

# Translation Structure

Translations should be organized by locale.

Example:

```
messages/

    en.json

    ar.json

    ja.json

    zh.json

    ko.json

    fr.json

    fa.json
```

Each file contains only translated text.

---

# Translation Rules

Every user-facing string must come from translation files.

Hardcoded text inside components is not allowed.

Examples:

Buttons

Navigation

Forms

Validation Messages

Notifications

Emails

Dashboard Labels

---

# Language Switcher

Users can change their language from:

- Navigation Bar
- User Settings

Changing the language should not affect application data.

---

# Database Strategy

Application content remains language-independent.

Store:

- User Data
- Bookings
- Lessons
- Homework

Translate only the interface.

Future versions may support multilingual course content if required.

---

# User Preferences

Each user profile stores:

- Preferred Language
- Time Zone

The platform automatically loads the preferred language after login.

---

# Dates & Time

Dates and times should be formatted according to the selected locale while preserving the user's selected time zone.

---

# Validation Messages

All validation messages must be translated.

Users should never receive system messages in a language different from the selected interface language.

---

# Future Expansion

The architecture should support:

- Additional languages
- Regional variations
- Localized course content
- AI-generated multilingual content

without requiring architectural changes.

---

# Success Criteria

A successful multilingual architecture ensures that:

- Every supported language provides the same experience.
- RTL languages work correctly.
- New languages can be added easily.
- The platform feels native regardless of the selected language.
