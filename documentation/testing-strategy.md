autoscale: true
footer: HfG Karlsruhe Uploader - Testing Strategy
slidenumbers: true
slide-transition: true

# Testing-Strategie & Automatisierung
### HfG Karlsruhe Uploader & Madek API Layer

---

# Überblick

1. Warum testen wir?
2. Unser Testing-Ansatz
3. Testing Trophy vs. Testing Pyramide
4. Playwright Integration Tests & Accessibility
5. Unit Tests für kritische Logik
6. Mock-System
7. Automatisierung & CI/CD
8. Praktische Beispiele
9. Erfolg & Nächste Schritte

---

# 1. Warum testen wir?

- **Sicherheit**: Änderungen am Code beschädigen nicht die Funktionalität
- **Vertrauen**: Code funktioniert wie erwartet
- **Geschwindigkeit**: Schnellere Entwicklung
- **Qualität**: Weniger Bugs in Produktion

*Tests sind unser Sicherheitsnetz für kontinuierliche Entwicklung*

---

# 2. Unser Testing-Ansatz
## Pragmatisch & Effizient

**Fokus auf das, was wirklich wichtig ist**

- Weniger komplexe Tests
- Mehr realistische Szenarien
- Schnelles Feedback für Entwickler
- Integration über Isolation

*Prinzip: “Write tests. Not too many. Mostly integration.”*

---

# 3. Testing Trophy vs. Testing Pyramide

---

# 3.1 Die Testing-Pyramide
## Traditioneller Ansatz

```
    🔺 E2E Tests (langsam, teuer)
   🔺🔺 Integration Tests
  🔺🔺🔺 Unit Tests (schnell, viele)
 🔺🔺🔺🔺 Static Analysis
```

*Problem: Viele Unit Tests, aber wenig Vertrauen in das Gesamtsystem*

---

# 3.2 Unser Ansatz
## Testing Trophy (Kent C. Dodds)

```
    🔺 Minimal E2E
   🔺🔺 Integration Tests ← FOKUS
  🔺🔺🔺 Gezielte Unit Tests
 🔺🔺🔺🔺 Static Analysis
```

*Vorteil: Höheres Vertrauen in das Gesamtsystem bei weniger Aufwand*

---

# 4. Playwright Integration Tests

- **Kernaufgabe**: Simulation echter Benutzer-Interaktionen
- **Komponenten**: Browser-Automation, Mock Backend, User Journeys
- **Vorteile**: Realistische Tests, hohe Vertrauenswürdigkeit, einfache Wartung
- **Bonus**: Automatische Accessibility-Tests inklusive

---

# 4.1 Architektur: Integration Tests

```
Playwright Browser
          |
          v
+------------------------------------------+
|          Frontend Application            |
|                                          |
| +--------------------------------------+ |
| |            UI Components             | |
| | +---------------+    +-------------+ | |
| | |   Pages       |<-->|Composables  | | |
| | +---------------+    +-------------+ | |
| +--------------------------------------+ |
|                   |                      |
|                   v                      |
| +--------------------------------------+ |
| |         Authentication Mock          | |
| | +--------------+   +--------------+  | |
| | |Mock Endpoints|   |Mock Responses|  | |
| | +--------------+   +--------------+  | |
| +--------------------------------------+ |
+------------------------------------------+
          |
          v
    Accessibility Check
```

---

# 4.2 Snippet: Playwright Test

```typescript
test('should login successfully with valid credentials', async ({ page }) => {
  await loginAsValidUser(page);

  await expect(page).toHaveURL('/uploader/de/projekte');
  await expect(page).toHaveTitle('Projekte – Uploader');
});

test('should show error with invalid credentials', async ({ page }) => {
  await loginAsInvalidUser(page);

  const errorMessage = page.getByTestId('login-error');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Die Anmeldedaten sind ungültig.');
});
```

*Testet echte User Journeys*

---

# 4.3 Accessibility Testing

### Warum Accessibility-Tests?
- Sicherstellt, dass unsere Anwendung für alle Benutzer zugänglich ist
- Erfüllt rechtliche Anforderungen (WCAG 2.1 AA)
- Verbessert die Benutzererfahrung für alle
- Verhindert Accessibility-Regressionen

*Jeder E2E-Test sollte Accessibility-Prüfungen enthalten!*

---

# 4.4 Verwendung in Tests

```typescript
// Playwright fördert Accessibility durch semantische Selektoren
test('should have accessible login form', async ({ page, makeAxeBuilder }) => {
  await page.goto('/uploader/de/anmeldung');

  // Diese Selektoren ZWINGEN zu accessible Markup:
  await expect(page.getByLabel('E-Mail-Adresse oder Login')).toBeVisible();
  //                     ↑ Benötigt <label> oder aria-label

  await expect(page.getByLabel('Passwort')).toBeVisible();
  //                     ↑ Benötigt korrekte Label-Zuordnung

  await expect(page.getByRole('button', { name: 'Anmelden' })).toBeVisible();
  //                     ↑ Benötigt semantisches <button> Element

  // Accessibility-Check nicht vergessen
  const results = await makeAxeBuilder().analyze();
  expect(results.violations).toStrictEqual([]);
});
```

*Playwright's semantische Selektoren fördern accessible Markup*

---

# 4.5 Automatische Erinnerung durch ESLint

ESLint warnt automatisch, wenn `makeAxeBuilder` in E2E-Tests fehlt:

```
⚠️  E2E tests should include accessibility testing using makeAxeBuilder().
   Add accessibility checks to ensure inclusive user experience.
```

---

# 4.6 Zwei-Ebenen-Accessibility-Ansatz

*1. Implizite Accessibility (durch semantische Selektoren):*

```typescript
// Diese Selektoren funktionieren NUR bei accessible HTML:
await page.getByLabel('E-Mail-Adresse oder Login').fill('test@example.com');
await page.getByRole('button', { name: 'Anmelden' }).click();
```

*2. Explizite Accessibility (durch axe-core):*

```typescript
// Vollständige WCAG-Compliance-Prüfung:
const results = await makeAxeBuilder().analyze();
expect(results.violations).toStrictEqual([]);
```

---

# 4.7 Erweiterte Accessibility-Tests (Optional)

```typescript
// 1. Keyboard Navigation Tests
test('should support keyboard navigation', async ({ page, makeAxeBuilder }) => {
  await page.goto('/uploader/de/anmeldung');

  await page.keyboard.press('Tab'); // Email-Feld
  await page.keyboard.press('Tab'); // Passwort-Feld
  await page.keyboard.press('Tab'); // Anmelden-Button
  await page.keyboard.press('Enter'); // Login ausführen

  // Accessibility-Check nicht vergessen
  const results = await makeAxeBuilder().analyze();
  expect(results.violations).toStrictEqual([]);
});
```

---

# 4.7.1 Erweiterte Accessibility-Tests (Optional)

```typescript
// 2. Spezifische WCAG-Regeln testen
test('should meet specific WCAG criteria', async ({ page, makeAxeBuilder }) => {
  await page.goto('/uploader/de/anmeldung');

  const results = await makeAxeBuilder()
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toStrictEqual([]);
});
```

---

# 4.7.2 Erweiterte Accessibility-Tests (Optional)

```typescript
// 3. Farbkontrast-Tests (wenn aktiviert)
test('should have sufficient color contrast', async ({ page, makeAxeBuilder }) => {
  await page.goto('/uploader/de/anmeldung');

  const results = await makeAxeBuilder()
    .withRules(['color-contrast'])
    .analyze();

  expect(results.violations).toStrictEqual([]);
});
```

---

# 4.8 Ausnahmen
Nur in sehr seltenen Fällen kann auf Accessibility-Tests verzichtet werden:
- Tests für reine API-Funktionalität ohne UI
- Tests für Entwickler-Tools oder interne Utilities

In diesen Fällen verwende `import { test } from '@playwright/test'` statt dem Accessibility-Fixture.

---

# 5. Unit Tests für kritische Logik

- **Kernkonzept**: Isolierte Tests für komplexe Geschäftslogik
- **Integration**: Ergänzt Integration Tests für Edge Cases

---

# 5.1 Snippet: Unit Test

```typescript
// useAuthentication.nuxt.test.ts
describe('validateAuthentication', () => {
  it('should return false when CSRF token is null', async () => {
    vi.mocked(getCookieMock).mockReturnValue({ value: null });

    const authentication = useAuthentication();
    const result = await authentication.validateAuthentication();

    expect(result).toBe(false);
  });
});
```

*Testet Edge Cases, die schwer zu simulieren sind*

---

# 6. Mock-System & Automatisierung

---

# 6.1 Unser Mock-System
## Kontrollierte Backend-Simulation

- **Authentication Mock Plugin**
- **Realistische API-Responses**
- **Keine echter Server nötig**
- **Schnell und zuverlässig**

*Vorteil: Tests laufen deterministisch und schnell*

---

# 6.2 Automatisierung
## GitHub Actions CI/CD

Bei jedem Code-Change:

1. **Static Analysis** (TypeScript, ESLint)
2. **Unit Tests** (Vitest)
3. **Integration Tests** (Playwright)
4. **Build Verification**

*Kein Code geht live ohne Tests*

---

# 7. Automatisierung & CI/CD

## 7.1 Quality Assurance Workflow

```yaml
# Bei jedem Push/PR auf main:
name: Quality Assurance & End-to-End Tests

jobs:
  quality-assurance:
    steps:
      - name: Run linting
      - name: Type check
      - name: Check for unused code & dependencies
      - name: Run unit tests
      - name: Build application

  end-to-end-tests:
    steps:
      - name: Install Playwright browsers
      - name: Build application for end-to-end tests
      - name: Run end-to-end tests
      - name: Upload Playwright report
```

→ Kein Code geht live ohne Tests

---

# 7.2 Release & Publish Workflow
*(Madek API Nuxt Layer Package)*

```yaml
# Bei Git Tags (v1.2.3):
name: Release & Publish Package

jobs:
  release-and-publish:
    steps:
      - name: Validate package version vs. release tag
      - name: Run linting
      - name: Type check
      - name: Check for unused code & dependencies
      - name: Run unit tests
      - name: Build application
      - name: Create Release
      - name: Publish package to GitHub Packages
```

→ Vollautomatische Releases mit Qualitätssicherung

---

# 8. Praktische Beispiele

---

# 8.1 Authentication Flow

**Ohne Tests**:
- Manuelle Tests nach jeder Änderung
- Risiko von Login-Problemen in Produktion

**Mit unseren Tests**:
- Automatische Validierung bei jeder Änderung
- Sofortiges Feedback bei Problemen
- Vertrauen in Deployment

---

# 8.2 Test-Abdeckung

```
Client Apps ---> Integration Tests ---> Mock Backend
     ^                                      |
     |                                      v
     |                                 Realistische
     |                                  Responses
     |                                      |
     +--------------------------------------+
               Unit Tests für Edge Cases
```

→ Vollständige Abdeckung der User Journeys

---

# 9. Erfolg & Nächste Schritte

---

# 9.1 Aktuelle Metriken

**Abdeckung**:
- **Unit Tests**: Kritische Funktionen
- **Integration Tests**: Alle User Journeys
- **CI/CD**: 100% automatisiert

**Ergebnisse**:
- Weniger manuelle Tests nötig
- Schnellere Feature-Entwicklung
- Höheres Vertrauen bei Deployments

---

# 9.2 Warum dieser Ansatz funktioniert

**Einfacher zu schreiben**
- Weniger komplexe Mock-Setups
- Natürliche Test-Szenarien

**Höheres Vertrauen**
- Testet echte User Journeys
- Findet Integration-Probleme

**Wartbarer**
- Tests schlagen seltener fehl bei Refactoring
- Weniger Test-Code zu pflegen

---

# 9.3 Mögliche nächste Schritte

1. **Erweitern**: Mehr Playwright Tests für neue Features
2. **Dokumentieren**: Test-Guidelines für Team
3. **Metriken**: Test-Coverage und Performance-Monitoring

---

# Takeaways

- **Integration Tests** sind unser Hauptfokus
- **Playwright** simuliert echte Benutzer-Interaktionen
- **Mock-System** ermöglicht kontrollierte Tests
- **Automatisierung** verhindert menschliche Fehler
- **Pragmatischer Ansatz** spart Zeit und Kosten

*Tests geben uns die Sicherheit, kontinuierlich zu entwickeln*
