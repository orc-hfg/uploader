# Uploader

Der Uploader ist eine Nuxt-basierte Webanwendung zum Hochladen und Verwalten von Medien-Assets für die Hochschule für Gestaltung Karlsruhe. Die Anwendung bietet eine intuitive Benutzeroberfläche und integriert sich mit dem Madek-API-System.

## Schnellstart

1. [Projekt-Setup](./readme.setup.md) – Installation und Konfiguration des GitHub Personal Access Tokens
2. Entwicklungsserver starten: `npm run dev`
3. Anwendung im Browser öffnen: `http://localhost:3000/uploader/`

## Projektdokumentation

Die Dokumentation ist in mehrere domänenspezifische README-Dateien aufgeteilt:

- [Setup und Installation](./readme.setup.md) – Projekt einrichten, GitHub PAT konfigurieren
- [Entwicklung](./readme.development.md) – Entwicklungsworkflow, lokales Linking mit madek-api-nuxt-layer
- [Authentifizierung](./readme.authentication.md) – Authentifizierungsstrategien für verschiedene Umgebungen
- [Release Management](./readme.release.md) – Versionierung, Git-Tags und Release-Prozess
- [Deployment](./readme.deployment.md) – Server-Deployment, Monitoring und Tracking
- [Design System](./readme.design.md) – PrimeVue Theme, Zusammenarbeit mit Designern
- [Wartung](./readme.maintenance.md) – Dependency Updates, Node-Aktualisierung, bekannte Issues
- [Wartungsaufgaben](./readme.maintenance-todo.md) – Offene Wartungsaufgaben
- [Testing](./readme.testing.md) – Teststrategie, E2E-Tests mit Playwright
- [TypeScript-Richtlinien](./readme.typescript.md) – Best Practices für TypeScript im Projekt
- [Sentry Error Tracking](./readme.sentry.md) – Fehlerüberwachung, Konfiguration und Datenscrubbing

## Externe Dokumentation

- [madek-api-nuxt-layer](https://github.com/orc-hfg/madek-api-nuxt-layer) – API-Integration und Datenmodell
- [Teststrategie](./documentation/testing-strategy.md) – Detaillierte Testkonzepte
