# Uploader

## Projekt installieren und Konfiguration des GitHub Personal Access Tokens

Für den Zugriff auf die @orc-hfg GitHub Packages wird ein GitHub Personal Access Token benötigt:

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

### 3. Lokale Entwicklung
Jetzt kann wie gewohnt am Layer-Projekt gearbeitet werden. Werden Dateien geändert, wird das Hauptprojekt beim nächsten Start/Neubau mit den aktualisierten Layer-Dateien versorgt.
Damit die Änderungen im Hauptprojekt wirksam werden, muss ggf. der Dev-Server neu gestartet bzw. auf HMR (Hot Module Replacement) gewartet werden.

**Hinweis:** Im Hauptprojekt stehen zwei Skripte in der `package.json` bereit, damit die Link/Unlink-Befehle nicht manuell eingegeben werden müssen:
- Link aktivieren: `npm run madek-api-nuxt-layer:link`
Das führt intern `npm link @orc-hfg/madek-api-nuxt-layer` aus.

- Link auflösen: `npm run madek-api-nuxt-layer:unlink`
Dabei werden der Symlink entfernt und anschließend automatisch wieder die reguläre (publizierte) Paketversion installiert.

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

## Deployment

Das Projekt lässt sich einfach auf verschiedene Umgebungen deployen. Hierfür wurde ein konsolidiertes Deployment-Skript erstellt, das wahlweise die Development- oder die Staging-Umgebung ansteuern kann.

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

### Manuelle Ausführung des Deployment-Skripts

Falls notwendig, kann das Deployment-Skript auch direkt aufgerufen werden:

```
sh ./deployment/uploader-deploy.sh [environment]
```

Mögliche Umgebungen sind `development` oder `staging`.

## Authentifizierung

### Entwicklungsumgebung (`npm run dev`)

**Strategie**: Token-basierte Authentifizierung mit Mock-Login
- **Authentifizierungs-Mock**: Aktiv - Stellt Login-Endpoints zur Verfügung
- **Auth-Info-Mock**: Inaktiv - **Nicht benötigt** bei Token-basierter Authentifizierung
- **Zweck**: Lokale Entwicklung ohne externen Authentifizierungsserver

**Ablauf**:
1. Login-Formular nutzt gemockte Login-Endpoints
2. Nach erfolgreichem Login wird **Authentifizierungstoken** gesetzt
3. **Direkter API-Zugriff**: Token im Header ermöglicht alle API-Aufrufe ohne Session-Validierung

### Preview/CI-Umgebung (`npm run preview:ci`)

**Strategie**: Session-basierte Authentifizierung mit vollständigem Mock
- **Authentifizierungs-Mock**: Aktiv - Stellt Login-Endpoints zur Verfügung
- **Auth-Info-Mock**: Aktiv - **Erforderlich** für Session-Validierung
- **Zweck**: E2E-Testing ohne externe Abhängigkeiten

**Ablauf**:
1. Login-Formular nutzt gemockte Login-Endpoints
2. Nach erfolgreichem Login wird **Session-Cookie** gesetzt
3. **Session-Validierung**: Auth-Info-Endpoint validiert Session-Cookies für jeden nachfolgenden Request

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
- Kann happy-dom nun aktualisiert werden? https://github.com/nuxt/test-utils/issues/1323
- Testen, ob Knip in Version ab 5.58.0 (5.61.0 ging zuletzt noch nicht) nun funktioniert und dieser Fehler nicht mehr auftritt: TypeError: Cannot assign to read only property 'defineNuxtConfig' of object '#<Object>'
- ggf. kann Dependency `@primevue/forms` wieder entfernt werden, wenn dieses Problem gelöst ist: https://github.com/primefaces/primevue/issues/7434
