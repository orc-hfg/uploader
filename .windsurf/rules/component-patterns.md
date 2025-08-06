---
trigger: glob
globs: app/components/**/*.vue
---

# Component Best Practices & Patterns

## 1. Component Fundamentals

- Create small, focused components for specific tasks.
- Use `defineModel` for two-way binding (parent ↔ child).
- Use **props** for passing data down to child components.
- Use **emits** for communicating events up to parent components.
- Use **composables** for shared state/logic across components.
- Use **Pinia** for global state management.
- Consider provide/inject only for special use cases (e.g., deeply nested theming).

## 2. Props & Emits

- Always use TypeScript interfaces or type aliases with `defineProps` and `defineEmits`.
- **Define complex types** in separate files in `/types`.
- Use `withDefaults` to set default prop values.
- Example:
  ```
  // @/types/card.ts
  export interface CardProps {
    title: string
    description: string
    image?: string
    variant?: 'primary' | 'secondary'
  }

  // In the Card component
  import type { CardProps } from '@/types/card'

  const props = withDefaults(defineProps<CardProps>(), {
    image: '/default.png',
    variant: 'primary',
  })

  const emit = defineEmits<{
    'update:selected': [value: boolean]
    click: [event: MouseEvent]
  }>()
