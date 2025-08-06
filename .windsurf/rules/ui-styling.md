---
trigger: glob
globs: app/**/*.{vue,css}
---

# UI & Styling Guidelines

## 1. Core UI Principles

- **Use PrimeVue** plus **Tailwind CSS**; avoid inline styles.
- **Mobile-first responsive design** approach.
- Rely on existing components in Nuxt UI / Tailwind if possible; only create new ones if necessary.
- If a file already uses Tailwind, **continue with Tailwind**.

## 2. CSS Usage

- **Use `<style>`** sections only for:
  - Complex animations/transitions
  - Advanced selectors/pseudo-elements
  - Custom scrollbar styling
  - CSS variables for theming
  - Keyframe animations

## 3. Accessibility

- Ensure proper ARIA attributes on interactive elements.
- Maintain keyboard navigation support.
- Use semantic HTML elements.

## 4. CSS Best Practices

- Prefer Tailwind utility classes for most styling needs
- Use component libraries like PrimeVue for complex UI components
- Maintain consistent spacing and layout patterns
- Follow the project's color palette and design system
- Use CSS variables for themes and dynamic styling
