/*!
 * Copyright (c) 2020 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *   Martin Lowe <martin.lowe@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */

// only use this code if jquery has been defined
const eclipseFdnBootstrapTables = (function ($, document) {
  // check to make sure that we have a table class to set
  if (typeof tableClasses !== 'undefined' && tableClasses != null) {
    // on document ready, inject table classes
    $(document).ready(function () {
      $('main table').each(function (index) {
        // dont add classes if there are already some set
        if ($(this).attr('class') == null) {
          $(this).addClass(tableClasses);
        }
      });
    });
  }
})(jQuery, document);

export default eclipseFdnBootstrapTables;
