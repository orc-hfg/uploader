import type de from '../i18n/locales/de.json';

export type MessageSchema = typeof de;

declare module 'vue-i18n' {
	export interface DefineLocaleMessage extends MessageSchema {}
}
