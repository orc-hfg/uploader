# Release Management

## Überblick

Das Release-Management in diesem Projekt basiert auf **Git-Tags** zur Versionierung. Im Gegensatz zum dazugehörigen [Nuxt-Layer-Projekt](https://github.com/orc-hfg/madek-api-nuxt-layer) werden **keine automatischen GitHub Releases** erstellt.

**Wichtig:** Release-Management (Versionierung) und Deployment sind getrennte Prozesse. Siehe [Deployment](./readme.deployment.md) für Informationen zum Server-Deployment.

### Git-Tags vs. GitHub Releases

✅ **Was wird automatisch erstellt:**
- Versionsnummer in package.json wird erhöht
- Git-Commit wird erstellt
- Git-Tag wird erstellt und gepusht
- Versionierung im Repository ist sichtbar

❌ **Was nicht automatisch erstellt wird:**
- Keine automatische Release-Erstellung in GitHub
- Kein Package Publishing
- Keine automatischen Release Notes

**Warum Git-Tags ausreichend sind:**
- **Uploader**: Interne Anwendung → Git-Tags genügen für Versionierung
- **Nuxt-Layer**: Wird als Package konsumiert → braucht Distribution-Mechanismus

GitHub Releases können bei Bedarf manuell erstellt werden (siehe Abschnitt weiter unten), sind aber nicht Teil des Standard-Workflows.

---

## Semantische Versionierung

Das Projekt verwendet semantische Versionierung und bietet sichere Skripte für die automatisierte Erstellung von Git-Tags.

## Release-Skripte

Für die Erstellung von versionierten Git-Tags stehen folgende npm-Skripte zur Verfügung:

```bash
# Patch-Release (1.0.0 -> 1.0.1): Bugfixes und kleine Änderungen
npm run release:patch

# Minor-Release (1.0.0 -> 1.1.0): Neue Features, die abwärtskompatibel sind
npm run release:minor

# Major-Release (1.0.0 -> 2.0.0): Breaking Changes
npm run release:major
```

### Was passiert bei `npm run release:*`?

Diese Skripte führen automatisch folgende Aktionen aus:

1. ✅ **Pre-Flight Checks**: Branch-Prüfung, Working Directory Check, Git Pull
2. ✅ **Lokale Quality Assurance Tests**: Komplette Test-Suite läuft lokal (~4 Minuten)
   - Linting (ESLint)
   - Type Checking (TypeScript)
   - Unused Code Detection (Knip)
   - Unit Tests (Vitest)
   - E2E Tests (Playwright)
3. ✅ **Version erhöhen**: Versionsnummer in package.json wird inkrementiert
4. ✅ **Git-Commit**: Commit mit Nachricht `chore: release X.X.X` wird erstellt
5. ✅ **Git-Tag**: Tag mit neuer Versionsnummer wird erstellt
6. ✅ **Push**: Commit und Tag werden zum Remote-Repository gepusht
7. ⚡ **GitHub Actions**: Workflow läuft, aber überspringt Tests (bereits lokal durchgeführt)

### Warum lokale Tests vor dem Push?

**Sicherheit**: Die lokalen Tests stellen sicher, dass kein ungetesteter Code in den main Branch gepusht wird:
- ❌ Wenn Tests fehlschlagen → Kein Push, kein Tag, keine Änderung
- ✅ Wenn Tests erfolgreich → Release wird erstellt und gepusht

**Effizienz**: CI-Tests werden bei Release-Commits übersprungen, weil sie bereits lokal liefen:
- Lokale Tests: ~4 Minuten (VOR dem Push)
- CI bei Release: ~30 Sekunden (nur Commit-Erkennung)
- Normale Commits/PRs: ~4 Minuten (volle CI-Test-Suite)

### Was passiert NICHT?

❌ **Keine GitHub Release-Erstellung**: Kein automatischer GitHub Release
❌ **Kein Package Publishing**: Kein Upload zu Package Registry

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

## Optionale GitHub Releases (manuell)

**Hinweis:** GitHub Releases sind für dieses Projekt optional und nicht Teil des Standard-Workflows.

Falls du trotzdem einen GitHub Release erstellen möchtest (z.B. für bessere Sichtbarkeit oder Release Notes), kannst du dies manuell tun:

1. **Release-Sektion aufrufen**
   Gehe im Repository in den Abschnitt **„Releases"**.

2. **Neues Release erstellen**
   Klicke auf **„Draft a new release"**

3. **Tag auswählen**
   Wähle den vorher erstellten Git-Tag (z.B. `v1.1.0`) aus der Dropdown-Liste aus.

4. **Release Details**
   Gib einen Titel (z.B. `1.1.0`) ein und ergänze bei Bedarf Release Notes.

5. **Veröffentlichen**
   Klicke auf **„Publish release"**.

**Wichtig:** Dies ist ein rein optionaler Schritt für bessere Dokumentation. Die Versionierung funktioniert auch ohne GitHub Releases über Git-Tags.

## Nächste Schritte

Nach einem erfolgreichen Release kann das Deployment durchgeführt werden:

- [Deployment-Dokumentation](./readme.deployment.md) – Server-Deployment, Monitoring und Tracking
