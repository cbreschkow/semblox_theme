# Semblox Theme

Bootstrap-5-basiertes Drupal-Theme als Standard für Semblox-Projekte. Dient als Grundlage für kundenspezifische Child-Themes.

## Voraussetzungen

- Drupal 10 oder 11
- Node.js v18 oder neuer (für den SCSS/JS-Build)
- npm v9 oder neuer

## Installation

### 1. Code in den Drupal-Tree

Theme nach `themes/custom/semblox_theme/` legen.

### 2. Frontend bauen

Die kompilierten Dateien (`dist/`) sind nicht im Repo. Beim Klonen oder Pullen:

```bash
cd themes/custom/semblox_theme
npm install
npm run build
```

Erzeugt:

- `dist/css/global.css` — Theme-Styles
- `dist/css/bootstrap.css` — Bootstrap 5 mit überschriebenen Variablen
- `dist/js/global.js` — Theme-JavaScript
- `dist/js/bootstrap.bundle.js` — Bootstrap-JavaScript

### 3. Theme aktivieren

```bash
ddev drush theme:enable semblox_theme
ddev drush config:set system.theme default semblox_theme -y
ddev drush cr
```

## Entwicklung

### Build-Modus

```bash
npm run build      # einmaliger Production-Build
npm run watch      # rebuild bei jeder Datei-Änderung
```

### Architektur

#### SCSS (7-1 Pattern)

```
src/scss/
├── abstracts/    # Variablen, Mixins, Funktionen
├── base/         # Reset, Typografie, globale HTML-Defaults
├── components/   # Wiederverwendbare UI-Bausteine
├── layouts/      # Page-Wrapper, Grid, Header/Footer
├── pages/        # Page-spezifische Styles
├── themes/       # Theming-Schichten (Light/Dark, Marken-Akzente)
├── vendors/      # Externe Libraries (Bootstrap)
└── main.scss     # Hauptdatei
```

#### Theming-Strategie

CSS-Variablen sind die primäre Theming-Schicht. Definiert in
`src/scss/abstracts/_variables.scss` als `:root`-Block:

```scss
:root {
  --semblox-primary: #2E75B6;
  --semblox-secondary: #6c757d;
  // ...
}
```

SCSS-Variablen (für Bootstrap-Build) leiten ab:

```scss
$primary: #2E75B6 !default;
```

**Runtime-Theming** (z. B. Marken-Wechsel, Admin-Settings) → CSS-Variablen
überschreiben. Kein Build nötig.

**Build-Time-Theming** (z. B. Spacing, Komponenten-Varianten) → SCSS-Variablen
überschreiben + rebuild.

### Regions

| Region | Zweck |
|---|---|
| `header` | Logo, Hauptmenü |
| `primary_menu` | Hauptnavigation |
| `breadcrumb` | Brotkrumen |
| `highlighted` | Hinweise |
| `hero` | Marketing-Banner (optional) |
| `content` | Hauptinhalt |
| `sidebar_left` | Linke Sidebar (optional, default deaktiviert) |
| `sidebar_right` | Rechte Sidebar |
| `footer_top` | Footer oben |
| `footer_bottom` | Footer unten |

## Child-Themes

### Variante A: Manuell (volle Kontrolle)

```yaml
# themes/custom/mein_theme/mein_theme.info.yml
name: 'Mein Theme'
type: theme
description: 'Branding für Kunde X'
core_version_requirement: ^10 || ^11
base theme: semblox_theme
package: 'Semblox'

regions:
  # Regions vom Parent erben automatisch.
  # Hier nur überschreiben falls nötig.
```

Dann eigenes SCSS in `src/scss/_brand.scss`:

```scss
:root {
  --semblox-primary: #ff6600;  // Marke X
}
```

Build entweder eigener Vite-Setup, oder per Live-CSS-Override nur via
CSS-Variablen ohne Build.

### Variante B: Drush Starterkit (schnelle Generierung)

```bash
drush theme:generate \
  --name="Kunde X Theme" \
  --machine-name=kunde_x_theme \
  --base-theme=semblox_theme
```

## Deployment

`dist/` wird bei jedem Deployment frisch gebaut:

```bash
git pull
cd themes/custom/semblox_theme
npm ci
npm run build
ddev drush cr
```

### CI-Beispiel (GitLab)

```yaml
build_theme:
  image: node:20
  script:
    - cd themes/custom/semblox_theme
    - npm ci
    - npm run build
  artifacts:
    paths:
      - themes/custom/semblox_theme/dist/
    expire_in: 1 hour
```

## Lizenz

eLeDia GmbH, intern.
