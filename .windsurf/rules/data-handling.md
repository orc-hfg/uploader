---
trigger: glob
globs: **/*.{ts,vue}
---

# Data Binding & Fetching Patterns

## 1. Data Fetching Approaches

- **Use `useFetch` for standard SSR-based data fetching** in components (caching, reactivity, SSR benefits).
- **Use `$fetch`** for **imperative** client-side requests (often inside event handlers).
- **Use `useAsyncData`** for more complex fetching scenarios (multiple APIs, custom caching, error handling).

## 2. Configuration Options

- `server: false` in `useFetch` or `useAsyncData` when data should only be fetched on the client.
- `lazy: true` in `useFetch` or `useAsyncData` to defer non-essential data fetching until after the initial render.

## 3. Implementation Best Practices

- **In Nuxt**:
  - Always put `useFetch` or `useAsyncData` at the **top level** of `<script setup>` (never inside functions or lifecycle hooks).
  - Prefer destructuring the return object:
    ```
    const { data, status, error, refresh, clear } = await useAsyncData(
      'mountains',
      () => $fetch('[https://api.nuxtjs.dev/mountains')](https://api.nuxtjs.dev/mountains'))
    )
    ```
  - **Status** values: `'idle' | 'pending' | 'success' | 'error'` (do not use deprecated `pending` property).
  - Always handle all data fetching states in the template:
    ```
    <template>
      <div v-if="status === 'pending'">Loading…</div>
      <div v-else-if="status === 'error'">Error: {{ error }}</div>
      <div v-else>{{ data }}</div>
    </template>
    ```
