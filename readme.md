# Uploader

## Weiterführende Dokumentation

- [Testing-Strategie](./documentation/testing-strategy.md)
- [Details zur Architektur und dem madek-api-nuxt-layer](https://github.com/orc-hfg/madek-api-nuxt-layer?tab=readme-ov-file#madek-api-nuxt-layer)

## Projekt installieren und Konfiguration des GitHub Personal Access Tokens

Für den Zugriff auf die @orc-hfg GitHub Packages (z.B. für die Installation des Packages @orc-hfg/madek-api-nuxt-layer) wird ein GitHub Personal Access Token benötigt:

### 1. GitHub Personal Access Token erstellen

- GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) öffnen
- einen neuen Token mit der Berechtigung `read:packages` erstellen
- den Token kopieren

### 2. Token lokal einrichten

- eine neue `.env` Datei im Projekt-Root (an `.env.example` orientieren) erstellen
- Den generierten GitHub Token einfügen:
  ```
  GITHUB_PAT=Token_einfügen
  ```
- `npm run setup-npmrc` ausführen, um die `.npmrc` Datei zu erstellen
- anschließend `npm install` ausführen, um die Packages zu installieren

**Hinweis:** Die Dateien `.env` und `.npmrc` sind in `.gitignore` aufgeführt und werden nicht im Repository gespeichert, um den Token privat zu halten.

## Entwicklung mit dem madek-api-nuxt-layer (lokales Linking)
Damit Änderungen am Nuxt-Layer lokal entwickelt und getestet werden können, ohne jedes Mal eine neue Version zu veröffentlichen, empfiehlt sich das Vorgehen über `npm link` (https://docs.npmjs.com/cli/v9/commands/npm-link):

### 1. Zum Layer-Projekt wechseln
In den Ordner des Nuxt-Layers wechseln (z.B. madek-api-nuxt-layer) und das Package global per Symlink verlinken:

```
cd /pfad/zu/madek-api-nuxt-layer
npm link
```

### 2. Link im Hauptprojekt aktivieren
In das Hauptprojekt wechseln (z.B. Ordner dieses Repositories):

```
cd /pfad/zum/hauptprojekt
npm link @orc-hfg/madek-api-nuxt-layer
```

Jetzt wird der lokal verlinkte Nuxt-Layer (aus Schritt 1) anstelle der in der package.json angegebenen (veröffentlichten) Version verwendet.

**Hinweis:** Im Hauptprojekt stehen zwei Skripte in der `package.json` bereit, damit die Link/Unlink-Befehle nicht manuell eingegeben werden müssen:
- Link aktivieren: `npm run madek-api-nuxt-layer:link`
Das führt intern `npm link @orc-hfg/madek-api-nuxt-layer` aus.

- Link auflösen: `npm run madek-api-nuxt-layer:unlink`
Dabei werden der Symlink entfernt und anschließend automatisch wieder die reguläre (publizierte) Paketversion installiert.

### 3. Lokale Entwicklung
Jetzt kann wie gewohnt am Layer-Projekt gearbeitet werden. Werden Dateien geändert, wird das Hauptprojekt beim nächsten Start/Neubau mit den aktualisierten Layer-Dateien versorgt.
Damit die Änderungen im Hauptprojekt wirksam werden, muss ggf. der Dev-Server neu gestartet bzw. auf HMR (Hot Module Replacement) gewartet werden.

### 4. Linking wieder auflösen (optional)

Wenn wieder die offizielle (z.B. auf npm oder Git referenzierte) Version verwenden werden soll:

- im Hauptprojekt das Skript `npm run madek-api-nuxt-layer:unlink` ausführen
- oder `npm install` im Hauptprojekt ausführen, dabei wird der Link automatisch aufgelöst

## Authentifizierung

### Entwicklungsumgebung (`npm run dev`)

**Strategie**: Token-basierte Authentifizierung mit Mock-Login
- **Authentifizierungs-Mock**: Aktiv - Stellt Login-Endpoints zur Verfügung
- **Auth-Info-Mock**: Inaktiv - **Nicht benötigt** bei Token-basierter Authentifizierung
- **Zweck**: Lokale Entwicklung ohne externen Authentifizierungsserver

**Ablauf**:
1. Login-Formular nutzt gemockte Login-Endpoints
2. **Direkter API-Zugriff**: Token im Header ermöglicht alle API-Aufrufe ohne Session-Validierung

### Preview/CI-Umgebung (`npm run preview`)

**Strategie**: Session-basierte Authentifizierung mit vollständigem Mock
- **Authentifizierungs-Mock**: Aktiv - Stellt Login-Endpoints zur Verfügung
- **Auth-Info-Mock**: Aktiv - **Erforderlich** für Session-Validierung
- **Zweck**: E2E-Testing ohne externe Abhängigkeiten

**Ablauf**:
1. Login-Formular nutzt gemockte Login-Endpoints
2. Nach erfolgreichem Login wird **Session-Cookie** gesetzt
3. **Session-Validierung**: Auth-Info-Endpoint validiert Session-Cookies für jeden nachfolgenden Request

## Release Management

Das Projekt verwendet semantische Versionierung und bietet sichere Skripte für die automatisierte Erstellung von Releases.

### Release-Skripte

Für die Erstellung von Releases stehen drei sichere Skripte zur Verfügung:

```bash
# Patch-Release (z.B. 1.0.0 → 1.0.1)
npm run release:patch

# Minor-Release (z.B. 1.0.0 → 1.1.0)
npm run release:minor

# Major-Release (z.B. 1.0.0 → 2.0.0)
npm run release:major
```

### Sicherheits-Features der Release-Skripte

Die Release-Skripte führen automatische **Pre-Flight-Checks** durch, um sichere Releases zu gewährleisten:

1. **Branch-Validierung**: Releases können nur vom `main`-Branch erstellt werden
2. **Working Directory Check**: Das Arbeitsverzeichnis muss sauber sein (keine uncommitted changes)
3. **Git Pull**: Automatischer Pull der neuesten Änderungen von `origin/main`
4. **Fehlerbehandlung**: Detaillierte Fehlermeldungen bei Problemen

### Branch Protection & Berechtigungen

**Wichtig**: Der main Branch ist durch Branch Protection Rules geschützt. Für die Erstellung von Releases sind spezielle Berechtigungen erforderlich:

- **Repository Admins** können Releases direkt vom main Branch erstellen (Bypass-Berechtigung)
- **Andere Contributors** benötigen Admin-Rechte oder müssen zur Bypass-Liste hinzugefügt werden
- Bei fehlenden Berechtigungen schlägt `npm run release:*` mit einem Branch Protection Fehler fehl

**Für neue Team-Mitglieder**: Falls Release-Erstellung fehlschlägt, kontaktiere einen Repository Admin zur Berechtigung.

**Alternative für Teams**: Für größere Teams kann später ein GitHub Actions Manual Workflow (`workflow_dispatch`) implementiert werden, der es allen Contributors mit Write-Zugriff ermöglicht, Releases über die GitHub UI zu erstellen, ohne lokale Branch Protection Bypass-Rechte zu benötigen.

### Wann sollten Releases erstellt werden?

Releases sollten strategisch und bewusst erstellt werden.

#### **Empfohlene Release-Zeitpunkte:**

1. **Nach wichtigen Feature-Implementierungen**
   - Neue Funktionalitäten sind vollständig implementiert und getestet
   - Mehrere zusammengehörige PRs wurden gemerged

2. **Nach Bugfix-Sammlungen**
   - Kritische Bugs wurden behoben
   - Mehrere kleinere Fixes können zu einem Patch-Release gebündelt werden

3. **Vor geplanten Deployments**
   - Koordination mit Deployment-Zyklen (Development/Staging)
   - Bewusste Vorbereitung auf Produktiv-Releases

4. **Bei Breaking Changes**
   - Major-Releases für inkompatible Änderungen
   - Klare Kommunikation über Änderungen erforderlich

#### **Release-Strategie:**

- **Nicht jeder PR = Release**: Zusammengehörige Änderungen sammeln
- **Batch-Releases**: Mehrere kleine Änderungen in einem Release
- **Bewusste Entscheidungen**: Überlegen, ob der aktuelle Stand deployment-ready ist

#### **Automatisierung vs. Manuelle Kontrolle:**

**Warum manuelle Releases?**
- Vollständige Kontrolle über Deployment-Timing
- Möglichkeit, mehrere Changes zu bündeln
- Bewusste Qualitätskontrolle vor Release
- Koordination mit Deployment-Zyklen
- **Kein Package Publishing**: Diese Anwendung wird deployed, nicht als Dependency installiert
- **Deployment-Meilensteine**: Releases markieren deployment-bereite Zustände

### Was passiert bei einem Release?

Jedes Release-Skript führt folgende Schritte automatisch aus:

1. **Pre-Flight-Checks**: Validierung von Branch, Working Directory und Git-Status
2. **Version erhöhen**: Die Versionsnummer in `package.json` wird entsprechend erhöht
3. **Git-Commit**: Ein Commit mit der Nachricht `chore: release vX.X.X` wird erstellt
4. **Git-Tag**: Ein entsprechender Git-Tag wird erstellt
5. **Push**: Sowohl Commit als auch Tag werden zum Repository gepusht

### GitHub-Release anlegen

Nach der erfolgreichen Ausführung eines Release-Skripts sind noch folgende manuelle Schritte erforderlich:

1. **Releases-Seite öffnen**
   Gehe im Repository in den Abschnitt **„Releases"**.
2. **Neues Release erstellen**
   Klicke auf **„Draft a new release"**
3. **Tag auswählen**
   Wähle den eben erstellten Tag (z.B. `1.1.0`) aus der Dropdown-Liste aus.
4. **Release Details**
   Gib einen Titel (z.B. `1.1.0`) ein und ergänze bei Bedarf Release Notes.
5. **Veröffentlichen**
   Klicke auf **„Publish release"**.

### Wichtige Hinweise

- **Nur vom main-Branch**: Releases können ausschließlich vom `main`-Branch erstellt werden
- **Sauberes Working Directory**: Alle Änderungen müssen committed sein
- **Automatische Validierung**: Die Skripte prüfen alle Voraussetzungen automatisch
- **Manuelle GitHub Releases**: GitHub Releases müssen weiterhin manuell erstellt werden
- **Separates Deployment**: Das eigentliche Deployment erfolgt über separate Skripte

## Deployment

Das Projekt lässt sich einfach auf verschiedene Umgebungen deployen. Hierfür wurde ein konsolidiertes Deployment-Skript erstellt, das wahlweise die Development- oder die Staging-Umgebung ansteuern kann.

### Wichtiger Hinweis zu Tests

**Die Deployment-Skripte führen keine Tests aus!** Tests laufen ausschließlich in der CI/CD-Pipeline (GitHub Actions).

**Dies ist eine bewusste Architektur-Entscheidung** basierend auf dem Prinzip "Separation of Concerns":
- **CI/CD-Pipeline**: Verantwortlich für Quality Assurance (Tests, Linting, Type-Checking)
- **Deployment-Scripts**: Verantwortlich für schnelle und zuverlässige Auslieferung

**Vorteile dieser Trennung:**
- Schnelle Deployments
- Keine Redundanz (Tests laufen nicht doppelt)
- Umgebungsunabhängigkeit (keine Browser-Dependencies beim Deployment)
- Klare Verantwortlichkeiten

**Daher ist es essentiell, dass Deployments nur von getesteten Code-Ständen durchgeführt werden:**
- alle CI/CD-Tests müssen erfolgreich durchgelaufen sein
- nur Code-Stände verwenden, die durch die Pipeline validiert wurden
- Bei manuellen Deployments: `npm run check:issues` ausführen

### Voraussetzungen für das Deployment

- Zugriff auf den Server via SSH (MADEK_SSH_USER muss in der `.env`-Datei konfiguriert sein)
- Eine gültige Build-Umgebung (Node.js in der korrekten Version)

### Deployment-Umgebungen

Das Projekt unterstützt zwei Deployment-Umgebungen:

1. **Development**: Für Entwicklungszwecke und Tests
   ```
   npm run deploy:development
   ```

2. **Staging**: Für Qualitätssicherung vor der Produktivschaltung
   ```
   npm run deploy:staging
   ```

### Was passiert beim Deployment?

Das Deployment-Skript führt folgende Schritte aus:

1. Überprüfung der erforderlichen Umgebungsvariablen
2. Bereinigung und Installation der Abhängigkeiten (`npm ci`)
3. Build der Anwendung (`npm run build`)
4. Übertragung der Build-Artefakte auf den entsprechenden Server via rsync
5. Neustart des jeweiligen Services auf dem Server

## Design System und Zusammenarbeit mit Designern

Dieses Projekt verwendet PrimeVue als Komponenten-Framework, welches durch ein Design-Token-System mit der Figma-Design-Umgebung synchronisiert wird.

### Design-Token-System

Alle relevanten Design-Dateien (PrimeVue Theme) befinden sich im Verzeichnis `app/theme/`. Die wichtigsten Dateien sind:

- `primevue-theme-original.ts`: Enthält den kompletten, unveränderten Stand des PrimeVue-Aura-Themes. Diese Datei wird nicht verändert und durch die App verwendet, sie dient nur zur Dokumentation.

- `primevue-theme-designer.ts`: Enthält den aktuellen kompletten Stand der Design-Tokens für das PrimeVue-Aura-Theme, das wir gezielt manuell überschreiben. In dieser Datei arbeiten die Designer. Sie wird allerdings nicht verwendet, sondern dient nur als Referenz für den angepassten Stand des PrimeVue-Aura-Themes.

- `primevue-theme-application.ts`: Diese Datei wird verwendet, um die PrimeVue-Komponenten an das spezifische Design der Anwendung anpassen. Hier werden gezielt die Überschreibungen des Themes vorgenommen. Diese Datei wird durch die App verwendet.

### Workflow für Designer

1. **Figma-Design-System**: Designer arbeiten in Figma mit einer Komponentenbibliothek, die auf den PrimeVue-Komponenten basiert (PrimeVue Figma UI Kit). Die Design-Tokens (Farben, Abstände, Typografie) sind in Figma als Variablen definiert.

2. **Token-Synchronisation**: Werden im Design Änderungen vorgenommen, müssen die entsprechenden Token-Werte in den Theme-Dateien aktualisiert werden:
- Neue Anpassungen werden in der Datei `primevue-theme-designer.ts` durch die Designer vorgenommen
- Neue Anpassungen werden in der Datei `primevue-theme-application.ts` durch die Entwickler vorgenommen

### Tipps für die Zusammenarbeit

- Bei Designänderungen sollte immer ein Abgleich zwischen Figma-Variablen und den Theme-Dateien stattfinden
- Um neue Komponenten anzulegen, sollten die Designer auf bestehende PrimeVue-Komponenten zurückgreifen

## Dependency Updates

### 1. Node-Version aktualisieren (auf aktuelle LTS-Version)

Die aktuelle Node-LTS-Version herausfinden:

Per Skript:
- `npm run check:node`

Manuell:
- `nvm ls-remote --lts | tail -n 1` ausführen
- falls der Node Version Manager (`nvm`) nicht verfügbar ist, hier nachschauen: https://github.com/nodejs/Release?tab=readme-ov-file#release-schedule

Folgende Dateien entsprechend anpassen:
- `.nvmrc`
- `package.json` im Abschnitt "engines"
- `nvm use && npm install` ausführen, damit die definierte Node-Version (`.nvmrc`) in der aktuellen Shell aktiviert wird und die Abhängigkeiten für diese installiert werden (`package-lock.json`)

### 2. Externe Abhängigkeiten aktualisieren

- `npm run upgrade` ausführen, um Nuxt zu updaten.
- `npm run check-updates` verwenden, Updates installieren und währenddessen immer wieder die Funktionalität testen.

### 3. Aufgaben für das nächste Dependency Update bearbeiten und ggf. neue erstellen
- Kann `"vitest": false` aus `knip.json` wieder entfernt werden? Läuft dann `npm run check:unused` fehlerfrei?
- `@nuxtjs/i18n > v10.0.3`: Gibt es weiterhin die Hydration Mismatches bei Verwendung von `SwitchLocalePathLink` (`app/components/Header.vue`)?
	```vue
	<SwitchLocalePathLink locale="de">Deutsch</SwitchLocalePathLink>

	const switchLocalePath = useSwitchLocalePath();
	<NuxtLink :to="switchLocalePath('de')">Deutsch</NuxtLink>
	```
- Kann Dependency `@primevue/forms` wieder entfernt werden? Also ist dieses Problem gelöst (zum Test auf Seite mit Formularelementen wechseln und Logs in CLI anschauen)? https://github.com/primefaces/primevue/issues/7434
