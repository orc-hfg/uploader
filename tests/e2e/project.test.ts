import { expect, test } from './fixtures/accessibility';
import { expectRedirectToSignIn } from './helpers/authentication';
import { expectPageLoadedWithHeadingAndTitle } from './helpers/page-assertions';
import { getChip } from './helpers/ui-components';

const SECTIONS = {
	BASIC_METADATA: 0,
	ALTERNATIVE_LOCALE_METADATA: 1,
	ADDITIONAL_METADATA: 2,
} as const;

const BASIC_METADATA = {
	AUTHOR: 0,
	TITLE: 1,
	SUBTITLE: 2,
	DESCRIPTION: 3,
} as const;

const ALTERNATIVE_LOCALE_METADATA = {
	TITLE: 0,
	SUBTITLE: 1,
	DESCRIPTION: 2,
} as const;

const ADDITIONAL_METADATA = {
	PORTRAYED_OBJECT_DATE: 0,
	PROJECT_CATEGORY: 1,
	KEYWORDS: 2,
	SEMESTER: 3,
	PROGRAM_OF_STUDY: 4,
	OTHER_CREATIVE_PARTICIPANTS: 5,
	MATERIAL: 6,
	DIMENSION: 7,
	DURATION: 8,
	FORMAT: 9,
} as const;

test.describe('Project page', () => {
	test('should show project page correctly', async ({ page, makeAxeBuilder }) => {
		await page.goto('/uploader/de/projekt/collection-id-3');

		await expectPageLoadedWithHeadingAndTitle(
			page,
			'Test collectionId collection-id-3 / metaKeyId madek_core:title Content',
			'Test collectionId collection-id-3 / metaKeyId madek_core:title Content – Uploader',
		);

		await expect(page.getByRole('button', { name: 'Alle Daten anzeigen' })).toBeVisible();

		// Test accessibility of projects page
		const results = await makeAxeBuilder().analyze();

		expect(results.violations).toStrictEqual([]);
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should require authentication to access project page', async ({ page, context }) => {
		await expectRedirectToSignIn(page, context, '/uploader/de/projekt/collection-id-3', 'de');
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should display project in collapsed state correctly', async ({ page }) => {
		await page.goto('/uploader/de/projekt/collection-id-3');

		/*
		 * Note: Using toBeInViewport() instead of toBeVisible() because:
		 * - The container has overflow: hidden with max-height
		 * - toBeVisible() only checks DOM presence and CSS visibility/display
		 * - toBeInViewport() respects overflow clipping and checks actual user visibility
		 */

		/*
		 * Verify collapsed state: some data visible, some hidden
		 * Note: Not testing section assignment here - that's covered in expanded state tests
		 */
		await expect(getChip(page, 'author_1_first_name author_1_last_name')).toBeInViewport();
		await expect(getChip(page, 'author_2_first_name author_2_last_name')).toBeInViewport();
		await expect(page.getByRole('term').filter({ hasText: /^Titel$/u })).toBeInViewport();
		await expect(page.getByRole('definition').filter({ hasText: /^Test collectionId collection-id-3 \/ metaKeyId madek_core:title Content$/u })).toBeInViewport();

		// These (and others) should be hidden in collapsed state
		await expect(page.getByRole('term').filter({ hasText: /^Beschreibung$/u })).not.toBeInViewport();
		await expect(page.getByRole('definition').filter({ hasText: /^Test collectionId collection-id-3 \/ metaKeyId madek_core:description Content/u })).not.toBeInViewport();
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should display first section (basic metadata) in expanded state correctly', async ({ page }) => {
		await page.goto('/uploader/de/projekt/collection-id-3');
		await page.getByRole('button', { name: 'Alle Daten anzeigen' }).click();

		// Select first section by position (content validation below ensures it's the correct section)
		// eslint-disable-next-line playwright/no-raw-locators, playwright/no-nth-methods -- Intentionally testing section position as part of requirements
		const basicMetadataSection = page.locator('dl').nth(SECTIONS.BASIC_METADATA);

		// Autor/in - MUST be first metadata field (position is part of requirements)
		await expect(basicMetadataSection.getByRole('term').filter({ hasText: /^Autor\/in$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const authorDefinitionElement = basicMetadataSection.getByRole('definition').nth(BASIC_METADATA.AUTHOR);

		await expect(getChip(page, 'author_1_first_name author_1_last_name', undefined, authorDefinitionElement)).toBeVisible();
		await expect(getChip(page, 'author_2_first_name author_2_last_name', undefined, authorDefinitionElement)).toBeVisible();

		// Title - MUST be second metadata field (position is part of requirements)
		await expect(basicMetadataSection.getByRole('term').filter({ hasText: /^Titel$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const titleDefinitionElement = basicMetadataSection.getByRole('definition').nth(BASIC_METADATA.TITLE);

		await expect(titleDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId madek_core:title Content');

		// Subtitle - MUST be third metadata field (position is part of requirements)
		await expect(basicMetadataSection.getByRole('term').filter({ hasText: /^Untertitel$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const subtitleDefinitionElement = basicMetadataSection.getByRole('definition').nth(BASIC_METADATA.SUBTITLE);

		await expect(subtitleDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId madek_core:subtitle Content');

		// Description - MUST be fourth metadata field (position is part of requirements)
		await expect(basicMetadataSection.getByRole('term').filter({ hasText: /^Beschreibung$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const descriptionDefinitionElement = basicMetadataSection.getByRole('definition').nth(BASIC_METADATA.DESCRIPTION);

		await expect(descriptionDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId madek_core:description Content');

		await expect(basicMetadataSection.getByRole('term')).toHaveCount(4);
		await expect(basicMetadataSection.getByRole('definition')).toHaveCount(4);
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should display second section (alternative locale metadata) in expanded state correctly', async ({ page }) => {
		await page.goto('/uploader/de/projekt/collection-id-3');
		await page.getByRole('button', { name: 'Alle Daten anzeigen' }).click();

		// Select second section by position (content validation below ensures it's the correct section)
		// eslint-disable-next-line playwright/no-raw-locators, playwright/no-nth-methods -- Intentionally testing section position as part of requirements
		const alternativeLocaleMetadataSection = page.locator('dl').nth(SECTIONS.ALTERNATIVE_LOCALE_METADATA);

		// Title alternative locale - MUST be first field in second section (position is part of requirements)
		await expect(alternativeLocaleMetadataSection.getByRole('term').filter({ hasText: /^Titel \(en\)$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const titleAlternativeLocaleDefinitionElement = alternativeLocaleMetadataSection.getByRole('definition').nth(ALTERNATIVE_LOCALE_METADATA.TITLE);

		await expect(titleAlternativeLocaleDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId creative_work:title_en Content');

		// Subtitle alternative locale - MUST be second field in second section (position is part of requirements)
		await expect(alternativeLocaleMetadataSection.getByRole('term').filter({ hasText: /^Untertitel \(en\)$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const subtitleAlternativeLocaleDefinitionElement = alternativeLocaleMetadataSection.getByRole('definition').nth(ALTERNATIVE_LOCALE_METADATA.SUBTITLE);

		await expect(subtitleAlternativeLocaleDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId creative_work:subtitle_en Content');

		// Description alternative locale - MUST be third field in second section (position is part of requirements)
		await expect(alternativeLocaleMetadataSection.getByRole('term').filter({ hasText: /^Beschreibung \(en\)$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const descriptionAlternativeLocaleDefinitionElement = alternativeLocaleMetadataSection.getByRole('definition').nth(ALTERNATIVE_LOCALE_METADATA.DESCRIPTION);

		await expect(descriptionAlternativeLocaleDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId creative_work:description_en Content');

		await expect(alternativeLocaleMetadataSection.getByRole('term')).toHaveCount(3);
		await expect(alternativeLocaleMetadataSection.getByRole('definition')).toHaveCount(3);
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should display third section (additional metadata) in expanded state correctly', async ({ page }) => {
		await page.goto('/uploader/de/projekt/collection-id-3');
		await page.getByRole('button', { name: 'Alle Daten anzeigen' }).click();

		// Select third section by position (content validation below ensures it's the correct section)
		// eslint-disable-next-line playwright/no-raw-locators, playwright/no-nth-methods -- Intentionally testing section position as part of requirements
		const additionalMetadataSection = page.locator('dl').nth(SECTIONS.ADDITIONAL_METADATA);

		// Portrayed Object Date - MUST be first field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Datierung$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const portrayedObjectDateDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.PORTRAYED_OBJECT_DATE);

		await expect(portrayedObjectDateDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId madek_core:portrayed_object_date Content');

		// Project Category - MUST be second field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Kategorie$/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const projectCategoryDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.PROJECT_CATEGORY);

		await expect(getChip(page, 'project_category_1', undefined, projectCategoryDefinitionElement)).toBeVisible();
		await expect(getChip(page, 'project_category_2', undefined, projectCategoryDefinitionElement)).toBeVisible();

		// Keywords - MUST be third field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Schlagworte/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const keywordsDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.KEYWORDS);

		await expect(getChip(page, 'keyword_1', undefined, keywordsDefinitionElement)).toBeVisible();
		await expect(getChip(page, 'keyword_2', undefined, keywordsDefinitionElement)).toBeVisible();

		// Semester - MUST be fourth field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Semester/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const semesterDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.SEMESTER);

		await expect(getChip(page, 'semester_1', undefined, semesterDefinitionElement)).toBeVisible();
		await expect(getChip(page, 'semester_2', undefined, semesterDefinitionElement)).toBeVisible();

		// Program of study - MUST be fifth field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Studiengang/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const programOfStudyDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.PROGRAM_OF_STUDY);

		await expect(getChip(page, 'program_of_study_1', undefined, programOfStudyDefinitionElement)).toBeVisible();
		await expect(getChip(page, 'program_of_study_2', undefined, programOfStudyDefinitionElement)).toBeVisible();

		// Other creative participants - MUST be sixth field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Mitwirkende \/ weitere Personen/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const otherCreativeParticipantsDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.OTHER_CREATIVE_PARTICIPANTS);

		await expect(getChip(page, 'person_id_1_first_name person_id_1_last_name', 'role_1_DE', otherCreativeParticipantsDefinitionElement)).toBeVisible();
		await expect(getChip(page, 'person_id_2_first_name person_id_2_last_name', 'role_2_DE', otherCreativeParticipantsDefinitionElement)).toBeVisible();

		// Material - MUST be seventh field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Material/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const materialDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.MATERIAL);

		await expect(getChip(page, 'material_1', undefined, materialDefinitionElement)).toBeVisible();
		await expect(getChip(page, 'material_2', undefined, materialDefinitionElement)).toBeVisible();

		// Dimension - MUST be eighth field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Abmessungen/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const dimensionDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.DIMENSION);

		await expect(dimensionDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId creative_work:dimension Content');

		// Duration - MUST be ninth field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Dauer/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const durationDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.DURATION);

		await expect(durationDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId creative_work:duration Content');

		// Format - MUST be tenth field in third section (position is part of requirements)
		await expect(additionalMetadataSection.getByRole('term').filter({ hasText: /^Technik\/Verfahren\/Formate/u })).toBeVisible();

		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const formatDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.FORMAT);

		await expect(formatDefinitionElement).toContainText('Test collectionId collection-id-3 / metaKeyId creative_work:format Content');

		await expect(additionalMetadataSection.getByRole('term')).toHaveCount(10);
		await expect(additionalMetadataSection.getByRole('definition')).toHaveCount(10);
	});

	// No accessibility check needed – testing fallback behavior for missing data
	// eslint-disable-next-line no-restricted-syntax
	test('should display fallbacks correctly for missing data', async ({ page }) => {
		await page.goto('/uploader/de/projekt/collection-id-1');
		const projectTitle = 'Test collectionId collection-id-1 / metaKeyId madek_core:title Content';

		await expectPageLoadedWithHeadingAndTitle(page, projectTitle, `${projectTitle} – Uploader`);

		await page.getByRole('button', { name: 'Alle Daten anzeigen' }).click();

		// eslint-disable-next-line playwright/no-raw-locators, playwright/no-nth-methods -- Intentionally testing section position as part of requirements
		const basicMetadataSection = page.locator('dl').nth(SECTIONS.BASIC_METADATA);

		/*
		 * Test 1: Empty subtitle (LabeledInputText component)
		 * Tests that simple text fields display the en-dash placeholder when empty
		 * This validates the Value.vue fallback behavior for LabeledInputText
		 */
		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const subtitleDefinitionElement = basicMetadataSection.getByRole('definition').nth(BASIC_METADATA.SUBTITLE);

		await expect(subtitleDefinitionElement).toHaveText('–');

		// eslint-disable-next-line playwright/no-raw-locators, playwright/no-nth-methods -- Intentionally testing section position as part of requirements
		const additionalMetadataSection = page.locator('dl').nth(SECTIONS.ADDITIONAL_METADATA);

		/*
		 * Test 2: Empty category (LabeledChipList component)
		 * Tests that chip list fields display the en-dash placeholder when no chips are present
		 * This validates the Value.vue fallback behavior for LabeledChipList
		 */
		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const categoryDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.PROJECT_CATEGORY);

		await expect(categoryDefinitionElement).toHaveText('–');
	});

	test('should display no entries message correctly', async ({ page, makeAxeBuilder }) => {
		await page.goto('/uploader/de/projekt/collection-id-2');

		/*
		 * Verify that empty state displays correctly when no media entries exist
		 * Testing: empty state message visibility
		 */

		await expect(page.getByText('Es sind noch keine Medien vorhanden.')).toBeVisible();

		// Test accessibility of empty state
		const results = await makeAxeBuilder().analyze();

		expect(results.violations).toStrictEqual([]);

		const mediaEntryRows = page.getByRole('row');

		await expect(mediaEntryRows).toHaveCount(0);

		const editButtons = page.getByRole('button', { name: 'Mediendatei bearbeiten' });

		await expect(editButtons).toHaveCount(0);
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should display two media entries correctly', async ({ page }) => {
		await page.goto('/uploader/de/projekt/collection-id-1');

		const mediaEntryRows = page.getByRole('row');

		await expect(mediaEntryRows).toHaveCount(2);

		await expect(mediaEntryRows.getByRole('img', { name: 'Test mediaEntryId entry-id-1 / metaKeyId madek_core:title Content' })).toBeVisible();
		await expect(mediaEntryRows.getByRole('img', { name: 'Test mediaEntryId entry-id-2 / metaKeyId madek_core:title Content' })).toBeVisible();

		await expect(mediaEntryRows.getByText('Test mediaEntryId entry-id-1 / metaKeyId madek_core:title Content')).toBeVisible();
		await expect(mediaEntryRows.getByText('Test mediaEntryId entry-id-2 / metaKeyId madek_core:title Content')).toBeVisible();

		const editButtons = mediaEntryRows.getByRole('button', { name: 'Mediendatei bearbeiten' });

		await expect(editButtons).toHaveCount(2);
	});

	// No accessibility check needed – testing fallback behavior for missing media entry title
	// eslint-disable-next-line no-restricted-syntax
	test('should display placeholder for media entry without title', async ({ page }) => {
		await page.goto('/uploader/de/projekt/collection-id-3');

		/*
		 * Verify that media entries without a title display the en-dash placeholder
		 * This tests the fallback behavior when madek_core:title is empty
		 */

		const mediaEntryRows = page.getByRole('row');

		await expect(mediaEntryRows).toHaveCount(1);

		await expect(mediaEntryRows.getByText('–')).toBeVisible();

		await expect(mediaEntryRows.getByRole('button', { name: 'Mediendatei bearbeiten' })).toBeVisible();
	});
});

test.describe('Project page (English locale)', () => {
	/*
	 * Smoke test for English locale
	 * Business logic and edge cases are tested in German locale
	 * These tests only verify that routing and translations work correctly
	 */
	// No accessibility check needed – same project page as German locale test
	// eslint-disable-next-line no-restricted-syntax
	test('should show project page with English translations and routing', async ({ page }) => {
		await page.goto('/uploader/en/project/collection-id-3');

		const projectTitle = 'Test collectionId collection-id-3 / metaKeyId creative_work:title_en Content';

		await expectPageLoadedWithHeadingAndTitle(page, projectTitle, `${projectTitle} – Uploader`);

		await page.getByRole('button', { name: 'Show all data' }).click();

		// eslint-disable-next-line playwright/no-raw-locators, playwright/no-nth-methods -- Intentionally testing section position as part of requirements
		const basicMetadataSection = page.locator('dl').nth(SECTIONS.BASIC_METADATA);

		// Test 1: Title (en) - verify English metaKeyId is used
		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const titleDefinitionElement = basicMetadataSection.getByRole('definition').nth(BASIC_METADATA.TITLE);

		await expect(titleDefinitionElement).toContainText(projectTitle);

		// eslint-disable-next-line playwright/no-raw-locators, playwright/no-nth-methods -- Intentionally testing section position as part of requirements
		const additionalMetadataSection = page.locator('dl').nth(SECTIONS.ADDITIONAL_METADATA);

		// Test 2: One chip field (keywords) - verify chip loading works with English locale
		// eslint-disable-next-line playwright/no-nth-methods -- Position testing required
		const keywordsDefinitionElement = additionalMetadataSection.getByRole('definition').nth(ADDITIONAL_METADATA.KEYWORDS);

		await expect(getChip(page, 'keyword_1', undefined, keywordsDefinitionElement)).toBeVisible();
	});

	// No accessibility check needed – testing translations only
	// eslint-disable-next-line no-restricted-syntax
	test('should display media entries with English translations', async ({ page }) => {
		await page.goto('/uploader/en/project/collection-id-3');

		const mediaEntryRows = page.getByRole('row');

		await expect(mediaEntryRows).toHaveCount(1);

		await expect(mediaEntryRows.getByRole('button', { name: 'Edit media entry' })).toBeVisible();
	});

	// No accessibility check needed – testing empty state translation
	// eslint-disable-next-line no-restricted-syntax
	test('should display empty state with English translation', async ({ page }) => {
		await page.goto('/uploader/en/project/collection-id-2');

		await expect(page.getByText('No media available yet.')).toBeVisible();
	});
});
