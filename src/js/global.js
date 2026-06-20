/**
 * @file
 * Globale Theme-Skripte.
 */

(function (Drupal, once) {
  'use strict';

  /**
   * Beispiel-Behavior. Mehr werden hier ergänzt wenn nötig.
   */
  Drupal.behaviors.sembloxThemeInit = {
    attach(context) {
      once('semblox-theme-init', 'body', context).forEach(() => {
        // Initialisierung — bleibt vorerst leer.
      });
    },
  };
})(Drupal, once);
