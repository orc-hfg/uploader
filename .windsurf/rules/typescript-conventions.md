---
trigger: glob
globs: **/*.{ts,vue}
---

# TypeScript Patterns & Best Practices

## 1. TypeScript Fundamentals

- **Use TypeScript** throughout the codebase; prefer **interfaces** over `type` aliases for extendability.
- **Avoid enums**; use objects/maps for improved type safety.
- **Use functional components** over class-based components.
- **Use type-fest** if you need advanced utility types. (https://github.com/sindresorhus/type-fest)

## 2. Vue-specific TypeScript Patterns

- Type `ref()` values explicitly if needed: `const myVar = ref<string>('')`.
- Type event handlers with appropriate event types (`MouseEvent`, `KeyboardEvent`, etc.).
- Use `PropType` for complex prop types in runtime declarations.
- Return explicitly typed objects from composables.
- Use generics for reusable composables that work with different data types.

## 3. TypeScript Best Practices

- Keep **dedicated type files** in `/types`, organized by domain (e.g., `user.ts`, `post.ts`, `auth.ts`).
- Use **barrel exports** (e.g., `/types/index.ts`) to simplify imports.
- Define **API response types** matching your backend contracts.
- Use `readonly` for immutable properties.
- Use `Record<K, V>` for typed dictionaries instead of `{ [key: string]: T }`.
- **Never** use `"as any"`—it defeats type checking.
- Prefer explicit type guards, type predicates, or narrowing with `instanceof`, `in`, or discriminated unions.
- Only use type assertions after thorough runtime checks, e.g. `as unknown as Type` if absolutely necessary.
- Avoid overusing comments—aim for **self-documenting code**.

## 4. API Types & Validations

- Maintain separate request and response interfaces:
- Suffix request interfaces with `Request` (e.g., `CreatePostRequest`).
- Suffix response interfaces with `Response` (e.g., `PostResponse`).
- Keep them in a subdirectory of `/types` if your app is large (e.g., `/types/api`).
