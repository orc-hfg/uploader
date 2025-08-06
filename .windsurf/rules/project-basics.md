---
trigger: always_on
---

# Project Architecture

## 1. Project Architecture

This application is built as a main Nuxt application that integrates with and depends on the following Nuxt Layer:
https://github.com/orc-hfg/madek-api-nuxt-layer

## 2. Language

- **Use German language** for changes in **readme.md** files.
- **Use English** in all other files (comments, code, etc.).

## 3. Directory Structure & Imports

- All TypeScript interfaces, types, and enums must be in the `/types` directory.
- Organize types by domain: `user.ts`, `post.ts`, `auth.ts`, etc.

## 4. Context Awareness

- Always operate within the **correct project context**.
- **File paths** should be relative to the project root; do not reference other projects unless explicitly told.
- If multiple project contexts exist, clarify which one you are working in before changes.

## 5. Nuxt Directory Structure

- **Nuxt compatibility**:
  - Place your code in the root-level `/app` directory, which contains `/components`, `/layouts`, `/pages`, `/store`, `/types`, `/utils`, `/composables`, plus a top-level `app.vue`.
