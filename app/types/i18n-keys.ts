import type { Paths } from 'type-fest';

type MessageSchema = typeof import('@@/i18n/locales/de.json');

/**
 * Module augmentation for vue-i18n
 * Extends the built-in DefineLocaleMessage interface with our MessageSchema
 * to provide auto-completion for translation keys when using functions like t() from useI18n()
 * Note: This mainly provides editor suggestions but not proper type checking at compile time
 * For full type checking, explicit types like TranslationKeyPath should be used in function parameters
 */
declare module 'vue-i18n' {
	export interface DefineLocaleMessage extends MessageSchema {}
}

/**
 * Type for translation keys
 * Generated using type-fest's Paths utility type
 * This type represents all possible paths to leaf nodes in the MessageSchema
 * which can be used as valid translation keys
 */
type TranslationKeyPath = Paths<MessageSchema, { leavesOnly: true }>;

/**
 * Type for page title translation keys
 * Only allows keys under the pages.title namespace
 */
export type PageTitleKeyPath = Extract<TranslationKeyPath, `pages.title.${string}`>;
