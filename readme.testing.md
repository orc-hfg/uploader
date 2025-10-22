# Testing

## Überblick

Dieses Projekt verwendet eine mehrschichtige Quality-Assurance-Strategie:

**Statische Analyse (Compile-Zeit):**
- TypeScript Type Checking
- ESLint (Code Quality & Architektur-Patterns)
- Knip (Dead Code Detection)

**Dynamische Tests (Runtime):**
- E2E-Tests (Frontend-Integration & User-Flows)
- Unit-Tests (Business Logic im `madek-api-nuxt-layer`)

**Test-Infrastruktur:**
- Mock-API-System für E2E-Tests
- Authentication Development Plugin
- Vitest für Unit-Tests

## Unit-Tests

### Fokus & Scope

Diese Applikation hat **eigene Unit-Tests** für Frontend-Business-Logic:

**Was wird getestet:**
- ✅ **Composables** - Frontend-spezifische Business Logic (`useAuthentication`, etc.)
- ✅ **App-Utilities** - Helper-Funktionen für Frontend (falls vorhanden)
- ✅ **Store-Logic** - Komplexe Pinia-Store-Logik (falls vorhanden)

**Was NICHT getestet wird:**
- ❌ **Service-Layer** - Wird durch Layer-Tests abgedeckt
- ❌ **API-Normalisierung** - Wird durch Layer-Tests abgedeckt
- ❌ **UI-Komponenten** - Werden durch E2E-Tests abgedeckt

### Unterschied zu Layer-Tests

```
Uploader Unit-Tests:
  → Composables (z.B. useAuthentication)
  → Frontend-spezifische Business Logic
  → Client-Side Utilities

Layer Unit-Tests:
  → Service-Layer (z.B. mergeRoles, normalizePeople)
  → API-Client-Logik
  → Server-Side Utilities
```

### Tests ausführen

```bash
# Alle Unit-Tests (Uploader + Layer)
npm run test
```

### Beispiel: useAuthentication Composable

**Was getestet wird:**
- Validierung der CSRF-Token-Präsenz
- Korrekte Parameter-Übergabe an Repository
- Error-Handling bei API-Fehlern
- Korrekte URL-Konstruktion für Auth-Endpoints

**Test-Datei:** `app/composables/useAuthentication.nuxt.test.ts`

### Wann sollte ich Unit-Tests schreiben?

**JA - Schreibe Tests für:**

1. **Composables mit komplexer Logik**
   ```typescript
   // ✅ Test schreiben
   export function useAuthentication() {
     // CSRF-Validierung, API-Calls, Error-Handling
   }
   ```

2. **Frontend-Utilities mit Edge-Cases**
   ```typescript
   // ✅ Test schreiben
   export function formatUserDisplayName(user) {
     // Null-Handling, Formatting, Locale-Awareness
   }
   ```

3. **Store-Actions mit Business Logic**
   ```typescript
   // ✅ Test schreiben
   export const useProjectStore = defineStore('project', () => {
     function processProjectData(data) {
       // Komplexe Daten-Transformation
     }
   });
   ```

**NEIN - Keine Tests für:**

1. **Einfache Getter/Setter**
   ```typescript
   // ❌ KEIN Test nötig
   export function useSimpleState() {
     const value = ref('');
     return { value };
   }
   ```

2. **UI-Komponenten**
   ```vue
   <!-- ❌ KEIN Unit-Test nötig - E2E-Tests decken ab -->
   <template>
     <button @click="handleClick">Click</button>
   </template>
   ```

3. **Triviale Wrapper ohne Logik**
   ```typescript
   // ❌ KEIN Test nötig
   export function useMyRepository() {
     return getMyRepository();
   }
   ```

### Best Practices

**1. Test-Dateien neben Composables**
```
app/composables/
├── useAuthentication.ts
└── useAuthentication.nuxt.test.ts
```

**2. Nutze Nuxt Test Utils für Mocking**
```typescript
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

beforeEach(() => {
  mockNuxtImport('useRuntimeConfig', () => getRuntimeConfigMock);
  mockNuxtImport('useCookie', () => getCookieMock);
});
```

> **Siehe auch:** Layer-Tests für Service-Layer-Logik: [Layer Testing Documentation](../madek-api-nuxt-layer/readme.testing.md)

## End-to-End-Tests

### Fokus & Scope

**Frontend-Integration-Tests mit Playwright**

E2E-Tests in dieser Applikation sind **Frontend-Integration-Tests** mit Mock-Daten:

**Was getestet wird:**
- ✅ **Frontend-Logik** - UI-Komponenten und View-Layer
- ✅ **User-Flows** - Navigation, Interaktionen, Formular-Validierung
- ✅ **App-Services** - Client-Side Business Logic (Pinia Stores)
- ✅ **Routing** - Lokalisierte Routen, Navigation Guards
- ✅ **Authentifizierung** - Login/Logout-Flows mit Development Plugin

**Bewusst NICHT getestet:**
- ❌ **Echte API-Integration** - Tests laufen gegen Mock-Daten
- ❌ **Service-Layer-Normalisierung** - Wird durch Layer-Unit-Tests abgedeckt
- ❌ **API-Format-Kompatibilität** - Mock-Daten sind bereits normalisiert
- ❌ **Cookie-Handling mit echter API** - Development Plugin simuliert Auth

### Testumgebung

**Playwright-Konfiguration:**
```bash
# E2E-Tests ausführen
npm run test:e2e
```

**Authentication Development Plugin:**

Die E2E-Tests verwenden das `server/plugins/authentication-development.ts` Plugin:

- Stellt realistische Authentifizierungsendpoints bereit
- Nutzt gemeinsame Test-Konstanten (TEST_USER_LOGIN, TEST_USER_PASSWORD)
- Simuliert Session-Cookies und CSRF-Token-Handling
- Nur aktiv in Development/Test-Umgebung

**Architektur:**
```typescript
E2E-Test (Playwright)
  ↓
Authentication Development Plugin
  → /auth/auth-systems (Session-Init)
  → /auth/sign-in (Login)
  → /auth/sign-out (Logout)
  ↓
Mock-API-System (madek-api-nuxt-layer)
  → Vorgefertigte, normalisierte Test-Daten
  ↓
App-Services & Stores (Pinia)
  → Frontend Business Logic
  ↓
UI-Komponenten (Vue)
```

## Mock-API-System

### Architektur & Funktionsweise

**Wichtig:** Die Mock-Daten sind **Development Fixtures**, keine klassischen Mocks.

**Architektur-Unterschied:**

```typescript
// Echte Produktion (mit echter API)
Real API Response → Service Layer → Normalisierung → App → UI

// E2E-Tests (mit Mock-API)
Development Fixture (bereits normalisiert) → App → UI
                     ↑
          Service-Layer wird übersprungen!
```

### Konsequenzen für Tests

**1. Mock-Daten müssen bereits normalisiert sein**

```typescript
// ❌ Falsch - rohes API-Format (würde in Tests nicht funktionieren)
const mockData = {
  md_roles: [...],
  roles: [...],
};

// ✅ Richtig - bereits gemerged und normalisiert
const mockData = {
  roles: [{ person_id, role_id, labels }],
};
```

**2. Service-Layer-Normalisierung wird im Mock-Modus übersprungen**

Funktionen wie `mergeRoles()`, `normalizePeople()`, `normalizeKeywords()` werden NICHT ausgeführt, wenn Mock-Daten verwendet werden.

- ✅ Diese Funktionen werden durch **Unit-Tests im Layer** abgedeckt
- ✅ E2E-Tests fokussieren auf **Frontend-Logik mit bereits normalisierten Daten**

### Trade-offs & Risiken

| **Vorteil** | **Nachteil** |
|-------------|-------------|
| ✅ Schnelle Entwicklung ohne Backend | ❌ Service-Layer nicht in E2E getestet |
| ✅ Keine Auth-Credentials in CI nötig | ❌ API-Breaking-Changes werden nicht erkannt |
| ✅ Volle Kontrolle über Test-Daten | ❌ Mock-Drift-Risiko |
| ✅ Frontend-Tests unabhängig von API | ❌ Integration-Bugs können durchrutschen |
| ✅ Stabile, deterministische Tests | ❌ Manuelle Tests vor Release nötig |

### Risiko-Minimierung

**1. Unit-Tests decken Service-Layer ab**
- ✅ Alle Normalisierungs-Funktionen haben umfassende Tests im Layer
- ✅ Edge Cases, Null-Handling, Whitespace-Trimming getestet

**2. Manuelle explorative Tests vor Releases**
```bash
# Lokal gegen echte Dev-API entwickeln
npm run dev

# Kritische User-Flows manuell durchklicken:
# - Login/Logout
# - Projekt-Liste laden
# - Projekt-Details anzeigen
# - API-Integration visuell verifizieren
```

**Hinweis:** Playwright-Tests können NICHT gegen echte API laufen:
- Erwarten Mock-Daten-Format
- Keine echte API-Authentifizierung konfiguriert
- Für echte API-Tests wäre separates Test-Setup nötig

**3. Code-Reviews achten auf Mock-Konsistenz**
- Mock-Daten müssen dem normalisierten Format entsprechen
- Bei API-Änderungen Mock UND Service-Layer aktualisieren
- Mock-Daten-Struktur muss TypeScript-Interfaces entsprechen

### Akzeptierte Coverage-Lücke

**Bewusst nicht getestet:**
- ❌ Echte API-Integration im vollständigen Flow
- ❌ Service-Layer-Normalisierung mit echten API-Daten
- ❌ API-Format-Kompatibilität und Breaking Changes
- ❌ Authentication-Flow mit echter Madek-API

**Warum akzeptabel:**
- ✅ Unit-Tests im Layer decken Service-Logic vollständig ab
- ✅ E2E-Tests decken Frontend-Logic und User-Flows ab
- ✅ Manuelle explorative Tests vor Releases fangen Integration-Probleme
- ✅ TypeScript-Types helfen, API-Änderungen früh zu erkennen

## Statische Code-Analyse

Das Projekt verwendet mehrere Tools für statische Code-Analyse als zusätzliche Quality-Assurance-Schicht.

### TypeScript - Type Safety

```bash
# Type-Checking ausführen
npm run type-check
```

**Integration:**
```
Development-Zeit:
  IDE zeigt Type-Errors sofort an
         ↓
Pre-Commit (optional):
  Kann in husky/lint-staged integriert werden
         ↓
CI/CD (GitHub Actions):
  npm run type-check → Pipeline bricht bei Fehlern ab
```

**Nutzen:**
- ✅ Fängt ~70% der API-Breaking-Changes
- ✅ Verbessert IDE-Autocomplete und Refactoring
- ✅ Dokumentiert Datenstrukturen im Code

### ESLint - Code Quality & Architektur

```bash
# Linting ausführen
npm run lint

# Auto-Fix wo möglich
npm run lint:fix
```

**Was ESLint u.a. prüft:**
- Code-Style und Formatierung
- Potenzielle Bugs (unused variables, etc.)
- Architektur-Patterns (import restrictions, etc.)
- Vue-spezifische Best Practices
- TypeScript-spezifische Rules

### Knip - Dead Code Detection

```bash
# Ungenutzten Code finden
npm run check:unused
```

**Was Knip u.a. erkennt:**
- ✅ Ungenutzte Dateien und Exporte
- ✅ Nicht importierte Funktionen und Komponenten
- ✅ Ungenutzte Dependencies in `package.json`
- ✅ Ungenutzte TypeScript-Types und Interfaces
- ✅ Duplicate Exports

**Nutzen:**
- Hält Codebase schlank und wartbar
- Verhindert tote Dependencies (Security-Risiko)
- Zeigt vergessene Refactorings
- Reduziert Bundle-Size

### Zusammenspiel aller Quality-Gates

```
Statische Analyse:
  1. TypeScript     → Typ-Sicherheit (70% API-Breaking-Changes)
  2. ESLint         → Code-Quality + Architektur-Patterns
  3. Knip           → Dead Code Detection
         ↓
Dynamische Tests:
  4. E2E-Tests      → Frontend-Flows und Integration
  5. Unit-Tests     → Service-Layer-Logik (im Layer)
         ↓
Manuelle Tests:
  6. Explorative Tests → API-Integration vor Release
```

## CI/CD Pipeline

### GitHub Actions Workflow

Die CI-Pipeline ist für **Qualitätssicherung und Testing** konzipiert, NICHT für Deployment.

**Pipeline-Schritte:**

1. **Code-Qualitätsprüfungen**
   - `npm run lint` - ESLint
   - `npm run type-check` - TypeScript
   - `npm run check:unused` - Knip

2. **Unit-Tests** (im Layer)
   - Führt Vitest-Tests im madek-api-nuxt-layer aus

3. **E2E-Tests**
   - Startet Nuxt-App im Preview-Modus
   - Führt Playwright-Tests aus
   - Generiert Test-Reports

4. **Build-Verifizierung**
   - Stellt sicher, dass Produktions-Build funktioniert
   - Keine Deployment-Aktionen

### Quality Gates

Bei der Entwicklung neuer Features oder Änderungen sollten folgende Quality Gates bestanden werden:

```bash
# 1. Type Safety
npm run type-check

# 2. Code Quality
npm run lint

# 3. Dead Code Detection
npm run check:unused

# 4. Unit-Tests (im Layer)
npm run test

# 5. E2E-Tests
npm run test:e2e

# Alle Checks auf einmal
npm run check:issues
```

### Pre-Release Checkliste

**Automatisiert (CI/CD):**
- ✅ TypeScript Type-Checking
- ✅ ESLint ohne Fehler
- ✅ Keine ungenutzten Dependencies
- ✅ Alle Unit-Tests bestanden
- ✅ Alle E2E-Tests bestanden
- ✅ Build erfolgreich

**Manuell vor Release:**
- 🔍 Applikation lokal gegen echte Dev-API starten
- 🔍 Kritische User-Flows manuell durchklicken:
  - Login/Logout
  - Projekt-Liste laden
  - Projekt-Details anzeigen
  - Mehrsprachigkeit testen
- 🔍 API-Integration visuell verifizieren
- 🔍 Browser-Console auf Fehler prüfen

### Test-Daten verwalten

**Mock-Daten befinden sich im Layer:**
```
madek-api-nuxt-layer/
  server/
    madek-api-mock/
      data.ts  ← Test-Fixtures hier pflegen
```

**Bei Änderungen an Mock-Daten:**
- Mock-Daten im Layer aktualisieren
- Sicherstellen, dass Daten bereits normalisiert sind
- Layer-Version in Uploader aktualisieren
- E2E-Tests ausführen und anpassen

### Debugging-Tipps

**Playwright UI Mode nutzen:**
```bash
npm run test:e2e:ui
```
- Interaktive Test-Ausführung
- Time-Travel-Debugging
- Screenshot-Vergleich
- Network-Request-Inspektion

**Browser Developer Tools:**
```bash
# Playwright öffnet Browser mit DevTools
npm run test:e2e:debug
```
