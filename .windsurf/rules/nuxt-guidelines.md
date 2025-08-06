---
trigger: glob
globs: **/*.{ts,vue}
---

# Nuxt Patterns & Specifics

## 1. Core Nuxt Guidelines

- **Nuxt as the main framework**; prefer Composition API for Vue.
- **Pinia** for state management; **VueUse** for composition utilities.
  - Prefer `npx nuxi@latest module add` to install modules.
- **Auto imports** in Nuxt 3 remove the need to manually import:
  - Vue features (`ref`, `computed`, `watch`, etc.)
  - Components in `/components`
  - Composables in `/composables`
  - Utils in `/utils`

## 2. Key Nuxt Features

- **Color Mode**: Use `@nuxtjs/color-mode` with the `useColorMode()` function.
- **VueUse** is encouraged for performance and reactivity (except for color mode, which is handled by `@nuxtjs/color-mode`).
- **UnJS** is encouraged if tools or utilities are needed. (https://unjs.io/)
- **H3** is encouraged if tool related to a HTTP server framework are needed. (https://h3.unjs.io/)

## 3. Server & Configuration

- **Server API**: Use `server/api` for server-side tasks (database interactions, authentication, handling sensitive data).
- **useRuntimeConfig** for environment-specific config on both server and client.

## 4. SEO & Assets

- **SEO**: Use `useHead` and `useSeoMeta`.
- **Images**: Use `<NuxtImage>` or `<NuxtPicture>`.
- **Icons**: Use the Nuxt Icons module.
- **App Theme**: Configure in `app.config.ts`.
