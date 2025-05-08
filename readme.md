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
  GITHUB_TOKEN=Token_einfügen
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
- ggf. kann Dependency `@primevue/forms` wieder entfernt werden, wenn dieses Problem gelöst ist: https://github.com/primefaces/primevue/issues/7434
- wird inzwischen Tailwind CSS 4 durch `eslint-plugin-tailwindcss` unterstützt? https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/384
