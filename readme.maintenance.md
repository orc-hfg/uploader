# Wartung und Dependency Updates

## 1. Node-Version aktualisieren

Die Node-Version sollte regelmäßig auf die aktuelle LTS-Version aktualisiert werden.

> **Wichtig:** Vor dem Update der Node-Version in der Haupt-App sollte der Nuxt Layer (`@orc-hfg/madek-api-nuxt-layer`) ebenfalls auf die neue Node-Version aktualisiert und eine neue Version veröffentlicht werden. Die Node-Version im Layer muss kompatibel sein mit der in der App verwendeten Version, um EBADENGINE-Warnings zu vermeiden.

### Automatischer Update-Prozess

1. **Prüfen und Aktualisieren:**
   ```bash
   npm run check:node
   ```

   Das Skript:
   - Ermittelt die aktuelle Node.js LTS-Version
   - Aktualisiert automatisch `.nvmrc` und `package.json`
   - Zeigt die nächsten Schritte an

2. **Installation durchführen:**
   ```bash
   nvm install && nvm use && npm install
   ```

   Dies installiert die neue Node-Version, aktiviert sie in der aktuellen Shell und aktualisiert die `package-lock.json` mit der neuen Node-Version.

### Manuelle Prüfung (optional)

- `nvm ls-remote --lts | tail -n 1` - Aktuelle LTS-Version anzeigen
- https://github.com/nodejs/Release#release-schedule - Offizielle Release-Informationen


## 2. Externe Abhängigkeiten aktualisieren

- **Bei Minor/Major Updates**: Change Logs der jeweiligen Packages prüfen (Breaking Changes, neue Features, Deprecations)
- `npm run upgrade` ausführen, um Nuxt zu updaten.
- `npm run check:updates` verwenden, Updates installieren und währenddessen immer wieder die Funktionalität testen.
- Nuxt compatibility date in `nuxt.config.ts` aktualisieren (https://nuxt.com/docs/4.x/api/nuxt-config#compatibilitydate)

## 3. Überprüfen der offenen Wartungsaufgaben

- [Wartungsaufgaben](./readme.maintenance-todo.md)
