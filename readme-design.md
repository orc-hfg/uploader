# Design System

Dieses Projekt verwendet PrimeVue als Komponenten-Framework, welches durch ein Design-Token-System mit der Figma-Design-Umgebung synchronisiert wird.

## Design-Token-System

Alle relevanten Design-Dateien (PrimeVue Theme) befinden sich im Verzeichnis `app/theme/`. Die wichtigsten Dateien sind:

- `primevue-theme-original.ts`: Enthält den kompletten, unveränderten Stand des PrimeVue-Aura-Themes. Diese Datei wird nicht verändert und durch die App verwendet, sie dient nur zur Dokumentation.

- `primevue-theme-designer.ts`: Enthält den aktuellen kompletten Stand der Design-Tokens für das PrimeVue-Aura-Theme, das wir gezielt manuell überschreiben. In dieser Datei arbeiten die Designer. Sie wird allerdings nicht verwendet, sondern dient nur als Referenz für den angepassten Stand des PrimeVue-Aura-Themes.

- `primevue-theme-application.ts`: Diese Datei wird verwendet, um die PrimeVue-Komponenten an das spezifische Design der Anwendung anpassen. Hier werden gezielt die Überschreibungen des Themes vorgenommen. Diese Datei wird durch die App verwendet.

## Workflow für Designer

1. **Figma-Design-System**: Designer arbeiten in Figma mit einer Komponentenbibliothek, die auf den PrimeVue-Komponenten basiert (PrimeVue Figma UI Kit). Die Design-Tokens (Farben, Abstände, Typografie) sind in Figma als Variablen definiert.

2. **Token-Synchronisation**: Werden im Design Änderungen vorgenommen, müssen die entsprechenden Token-Werte in den Theme-Dateien aktualisiert werden:
   - Neue Anpassungen werden in der Datei `primevue-theme-designer.ts` durch die Designer vorgenommen
   - Neue Anpassungen werden in der Datei `primevue-theme-application.ts` durch die Entwickler vorgenommen

## Tipps für die Zusammenarbeit

- Bei Designänderungen sollte immer ein Abgleich zwischen Figma-Variablen und den Theme-Dateien stattfinden
- Um neue Komponenten anzulegen, sollten die Designer auf bestehende PrimeVue-Komponenten zurückgreifen
- Für eine erfolgreiche Zusammenarbeit ist es wichtig, dass Designer und Entwickler den gleichen Stand der Theme-Dateien haben
