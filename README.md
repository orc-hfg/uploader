# Uploader

## Dependency Updates

### 1. Node-Version aktualisieren (auf aktuelle LTS-Version)

Die aktuelle Node-LTS-Version herausfinden (https://github.com/nodejs/Release?tab=readme-ov-file#release-schedule) und in den folgenden Dateien entsprechend anpassen:

- `.nvmrc`
- `package.json` im Abschnitt "engines"
- `nvm use && npm install` ausführen, damit die definierte Node-Version (`.nvmrc`) in der aktuellen Shell aktiviert wird und die Abhängigkeiten für diese installiert werden (`package-lock.json`)

### 2. Externe Abhängigkeiten aktualisieren

`npm run check-updates` verwenden, Updates installieren und währenddessen immer wieder die Funktionalität testen.

### 3. Aufgaben für das nächste Dependency Update bearbeiten und ggf. neue erstellen
