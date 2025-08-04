# Projekt-Setup

## GitHub Personal Access Token konfigurieren

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

## Bekannte Probleme und Lösungen

### npm install schlägt fehl mit 401 Unauthorized für GitHub Packages

Wenn der npm install mit 401 Unauthorized für GitHub Packages (@orc-hfg) fehlschlägt, prüfe Folgendes:

**Ungültiger/abgelaufener Token**: Teste mit curl: `curl -H "Authorization: token YOUR_TOKEN" https://npm.pkg.github.com/@orc-hfg/package-name`

**Komplette Lösung:**
1. Generiere einen neuen GitHub PAT mit `read:packages` Berechtigung
2. Aktualisiere GITHUB_PAT in der .env-Datei
3. Führe `npm run setup-npmrc` aus, um die .npmrc neu zu generieren
4. Führe `npm install` aus
