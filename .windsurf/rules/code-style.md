---
trigger: always_on
---

# Code Style & Structure

## 1. General Principles

- **Write clean, maintainable, and technically accurate TypeScript code.**
- **Prefer clean, self-explanatory code** over complex logic and extraneous comments. Use descriptive names.
- **Use ES6+ features and ES modules** (`import`/`export`) over CommonJS.
- **Prefer functional and declarative programming patterns**; avoid classes.
- **Emphasize iteration and modularization** to follow DRY and reduce duplication.

## 2. Vue File Structure

- In `.vue` files, **use the Vue 3 Composition API** with `<script setup lang="ts">`.
- **Single responsibility**: Keep components focused; leverage composables for shared logic or state.
- **Functional components** over class-based components.
- **Order in `.vue` files**:
  1. `<script setup>`
  2. `<template>`
  3. `<style>`

## 3. Best Practices

- Keep components modular and reusable.
- Use **PascalCase** for `.vue` component filenames (e.g., `MyComponent.vue`).
- Use **kebab-case** for other filenames (e.g., `my-file.ts`).
- Keep files small and focused.
- Always use **@/** instead of **~/** for imports from the project root:
  // CORRECT
  import { useFooterUIStore } from '@/stores/footer-ui';

  // INCORRECT
  import { useFooterUIStore } from '~/stores/footer-ui';

## 4. Naming Conventions

- **Composables**: `use<Something>`
- **Components**: **PascalCase** filenames, e.g. `MyComponent.vue`.
- **Functions**: prefer named exports for clarity.
- **Kebab-case** for non-component files, e.g. `my-file.ts`.
- Keep the naming consistent across the project.
