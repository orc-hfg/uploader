# Teststrategie

## E2E-Tests mit Playwright

Das Projekt verwendet Playwright für End-to-End-Tests. Diese Tests simulieren das Nutzerverhalten in einem echten Browser und testen die gesamte Anwendung einschließlich der Authentifizierung.

### Testumgebung

Die E2E-Tests verwenden den `authentication-development.ts` Plugin, der authentische Authentifizierungsendpoints für die Testumgebung bereitstellt. Die Tests in `/tests/e2e/authentication.test.ts` sind direkt von diesem Entwicklungsplugin abhängig:

- Das Entwicklungsplugin stellt realistische Authentifizierungsfunktionen bereit
- E2E-Tests können gegen dieses simulierte, aber funktionale Authentifizierungssystem laufen
- Beide nutzen gemeinsame Konstanten für Konsistenz (TEST_USER_LOGIN, TEST_USER_PASSWORD)

## CI-Pipeline

Die GitHub Actions Workflow in diesem Projekt ist für Qualitätssicherung und Testing konzipiert. Die CI-Pipeline führt folgende Schritte aus:

1. Code-Qualitätsprüfungen (Linting, Type-Checking, Erkennung ungenutzten Codes)
2. Unit-Tests
3. E2E-Tests mit Playwright
4. Build-Verifizierung

Diese Pipeline validiert, dass das Projekt funktional und bereit für manuelles Deployment ist, führt aber selbst kein Deployment durch.

## Quality Gates

Bei der Entwicklung neuer Features oder Änderungen, sollten folgende Quality Gates bestanden werden:

1. `npm run type-check` - Stellt sicher, dass alle Typendefinitionen korrekt sind
2. `npm run lint` - Überprüft den Code auf Stilregeln und potenzielle Probleme
3. `npm run test` - Führt alle Unit-Tests aus
4. `npm run test:e2e` - Führt alle E2E-Tests aus

Diese Quality Gates helfen, die Codequalität zu sichern und verhindern potenzielle Fehler, bevor der Code in die Produktion gelangt.
