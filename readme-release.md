# Release Management

## Semantische Versionierung

Das Projekt verwendet semantische Versionierung und bietet sichere Skripte für die automatisierte Erstellung von Releases.

## Release-Skripte

Für die automatisierte Erstellung von Releases stehen folgende npm-Skripte zur Verfügung:

```bash
# Patch-Release (1.0.0 -> 1.0.1): Bugfixes und kleine Änderungen
npm run release:patch

# Minor-Release (1.0.0 -> 1.1.0): Neue Features, die abwärtskompatibel sind
npm run release:minor

# Major-Release (1.0.0 -> 2.0.0): Breaking Changes
npm run release:major
```

Diese Skripte führen automatisch folgende Aktionen aus:
1. Inkrementieren der Versionsnummer in package.json
2. Erstellen eines Git-Commits mit der neuen Version
3. Erstellen eines Git-Tags für die neue Version
4. Pushen der Änderungen zum Remote-Repository

## Berechtigungen und Branch-Protection

**Wichtig:** Der main-Branch ist durch Branch-Protection-Regeln geschützt:

- **Repository Admins** können Releases direkt vom main Branch erstellen (Bypass-Berechtigung)
- **Andere Contributors** benötigen Admin-Rechte oder müssen zur Bypass-Liste hinzugefügt werden
- Bei fehlenden Berechtigungen schlägt `npm run release:*` mit einem Branch Protection Fehler fehl

**Für neue Team-Mitglieder**: Falls Release-Erstellung fehlschlägt, kontaktiere einen Repository Admin zur Berechtigung.

## Release-Strategie

- **Nicht jeder PR = Release**: Zusammengehörige Änderungen sammeln
- **Batch-Releases**: Mehrere kleine Änderungen in einem Release
- **Bewusste Entscheidungen**: Überlegen, ob der aktuelle Stand deployment-ready ist

## Manuelles Release über GitHub

Zusätzlich zur automatisierten Erstellung kann ein Release auch manuell über die GitHub-Oberfläche erstellt werden:

1. **Release-Sektion aufrufen**
   Gehe im Repository in den Abschnitt **„Releases"**.

2. **Neues Release erstellen**
   Klicke auf **„Draft a new release"**

3. **Tag auswählen**
   Wähle den vorher erstellten Tag (z.B. `1.1.0`) aus der Dropdown-Liste aus.

4. **Release Details**
   Gib einen Titel (z.B. `1.1.0`) ein und ergänze bei Bedarf Release Notes.

5. **Veröffentlichen**
   Klicke auf **„Publish release"**.

## Deployment

Der GitHub Actions Workflow in diesem Projekt ist für Qualitätssicherung und Testing konzipiert, nicht für Deployment. Die CI-Pipeline führt folgende Schritte aus:

1. Code-Qualitätsprüfungen (Linting, Type-Checking, Erkennung ungenutzten Codes)
2. Unit-Tests
3. E2E-Tests mit Playwright
4. Build-Verifizierung

### Deployment-Skripte

Für das manuelle Deployment stehen separate Skripte zur Verfügung:

```bash
# Deployment in die Entwicklungsumgebung
npm run deploy:development

# Deployment in die Staging-Umgebung
npm run deploy:staging
```

### Was passiert beim Deployment?

Das Deployment-Skript führt folgende Schritte aus:

1. Überprüfung der erforderlichen Umgebungsvariablen
2. Bereinigung und Installation der Abhängigkeiten (`npm ci`)
3. Build der Anwendung (`npm run build`)
4. Übertragung der Build-Artefakte auf den entsprechenden Server via rsync
5. Neustart des jeweiligen Services auf dem Server

**Wichtige Hinweise:**

- Deployments sollten nur von getesteten Code-Ständen durchgeführt werden
- Alle CI/CD-Tests müssen erfolgreich durchgelaufen sein

## Entscheidung gegen automatisierte GitHub Releases

In diesem Projekt werden bewusst keine automatisierten GitHub Releases verwendet, sondern primär Git-Tags und npm-Skripte für das Release-Management. Die Gründe hierfür sind:

1. **Einfachheit und Kontrolle**: Git-Tags bieten eine einfache, robuste Möglichkeit der Versionierung ohne zusätzliche Abhängigkeiten oder Workflows
2. **Workflow-Integration**: Die npm-Release-Skripte integrieren sich nahtlos in den vorhandenen Entwicklungsworkflow
3. **Reduzierte Komplexität**: Kein Bedarf an zusätzlichen GitHub Actions oder anderen CI/CD-Mechanismen für Release-Erstellung
4. **Direktes Deployment**: Das Deployment erfolgt manuell und gezielt per Skript, nicht automatisch bei Release-Erstellung
5. **Team-Größe**: Bei der aktuellen Teamgröße und Projektstruktur bieten automatisierte GitHub Releases keinen signifikanten Mehrwert

GitHub Releases können weiterhin manuell erstellt werden, wie im Abschnitt "Manuelles Release über GitHub" beschrieben, sind aber optional und nicht Teil des Standardprozesses.
