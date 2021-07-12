/*!
 * Copyright (c) 2020 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *   Eric Poirier <eric.poirier@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import jquery from 'jquery';

const eclipseFdnEventTracker = (function ($, document) {
  // Infra 2791 - Send events to Google Analytics
  $('a[href]').click(function () {
    if (typeof ga === 'function' && typeof ga.getAll === 'function') {
      // Get the file name out of the href attribute
      var fileName = $(this).attr('href').split('/').pop();

      // Get the file extension
      var fileExtension = fileName.split('.').pop();

      // Quit here if the extension of the clicked file isn't part of the
      // following list
      // and if the Google Analytics is not loaded
      var tracker = ga.getAll()[0].get('name');
      if (
        tracker &&
        $.inArray(fileExtension, [
          'pdf',
          'jpg',
          'png',
          'zip',
          'dmg',
          'gz',
          'exe',
          'doc',
          'odt',
          'rtf',
          '7z',
          'arj',
          'deb',
          'pkg',
          'rar',
          'rpm',
          'z',
          'tar',
          'xml',
          'csv',
          'xls',
          'xlr',
          'ods',
          'rss',
        ]) !== -1
      ) {
        // Send the event to Google Analytics
        ga(tracker + '.send', 'event', {
          eventCategory: 'solstice-event-tracker',
          eventAction: window.location.href,
          eventLabel: fileName,
        });
      }
    }
  });
})(jQuery, document);

export default eclipseFdnEventTracker;
