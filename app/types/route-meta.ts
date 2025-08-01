import type { PageTitleKeyPath } from './i18n-keys';

declare module '#app' {
	interface PageMeta {
		pageTitleKeyPath?: PageTitleKeyPath;
	}
}
