# Wartung und Dependency Updates

## Node-Version aktualisieren

Die Node-Version sollte regelmäßig auf die aktuelle LTS-Version aktualisiert werden:

### Node-LTS-Version herausfinden

Per Skript:
- `npm run check:node`

Manuell:
- `nvm ls-remote --lts | tail -n 1` ausführen
- Falls der Node Version Manager (`nvm`) nicht verfügbar ist, hier nachschauen: https://github.com/nodejs/Release?tab=readme-ov-file#release-schedule

### Aktualisierungsprozess

Folgende Dateien entsprechend anpassen:
- `.nvmrc`
- `package.json` im Abschnitt "engines"
- `nvm use && npm install` ausführen, damit die definierte Node-Version (`.nvmrc`) in der aktuellen Shell aktiviert wird und die Abhängigkeiten für diese installiert werden (`package-lock.json`)

## Externe Abhängigkeiten aktualisieren

- `npm run upgrade` ausführen, um Nuxt zu updaten.
- `npm run check:updates` verwenden, Updates installieren und währenddessen immer wieder die Funktionalität testen.

### Überprüfen der offenen Wartungsaufgaben

- [Wartungsaufgaben](./readme.maintenance-todo.md)
