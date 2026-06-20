import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite-Konfiguration für semblox_theme.
 *
 * Build-Strategie (konsistent mit semblox_dashboard):
 * - Eingänge: SCSS und JS-Files in src/scss/ bzw. src/js/
 * - Ausgang: dist/ (Subdir-Struktur dist/css/ und dist/js/)
 * - Drupal-Library zeigt auf dist/css/*.css und dist/js/*.js
 *
 * dist/ ist gitignored — wird beim Deployment via npm run build erzeugt.
 */
export default defineConfig({
  root: '.',
  base: '/themes/custom/semblox_theme/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        'global-css': resolve(__dirname, 'src/scss/main.scss'),
        'bootstrap-css': resolve(__dirname, 'src/scss/vendors/bootstrap.scss'),
        'global-js': resolve(__dirname, 'src/js/global.js'),
        'bootstrap-js': resolve(__dirname, 'src/js/bootstrap-bundle.js'),
      },
      output: {
        // CSS landet in dist/css/{global,bootstrap}.css
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            const baseName = assetInfo.name
              .replace(/\.css$/, '')
              .replace(/-css$/, '');
            return `css/${baseName}.css`;
          }
          return 'assets/[name][extname]';
        },
        // JS landet in dist/js/{global,bootstrap.bundle}.js
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'global-js') return 'js/global.js';
          if (chunkInfo.name === 'bootstrap-js') return 'js/bootstrap.bundle.js';
          // CSS-Eingänge erzeugen leere JS-Files; in einem _temp-Ordner verstecken
          if (chunkInfo.name === 'global-css' || chunkInfo.name === 'bootstrap-css') {
            return 'js/_temp/[name].js';
          }
          return 'js/[name].js';
        },
        chunkFileNames: 'js/chunks/[name]-[hash].js',
      },
    },
    sourcemap: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        quietDeps: true,
        silenceDeprecations: ['color-functions', 'global-builtin', 'import'],
      },
    },
  },
});
