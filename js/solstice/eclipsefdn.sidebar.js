/*!
 * Copyright (c) 2018 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *   Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import jQuery from 'jquery';

const eclipseFdnSolsticeSidebar = (function ($, document) {
  $(document).ready(function () {
    var href_hash = window.location.hash;
    // Add a class if right column is non-existant.
    if ($('#rightcolumn').length == 0) {
      $('#midcolumn').attr('class', 'no-right-sidebar');
      if (href_hash) {
        window.location.hash = href_hash;
      }
    }
    // add a class if left column is non-existant.
    if ($('#main-sidebar').length == 0) {
      $('#midcolumn').attr('class', 'no-left-nav');
      if (href_hash) {
        window.location.hash = href_hash;
      }
    }
  });
})(jQuery, document);

export default eclipseFdnSolsticeSidebar;
