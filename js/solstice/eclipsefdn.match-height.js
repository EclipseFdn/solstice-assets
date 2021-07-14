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
import 'jquery-match-height'

const eclipseFdnMatchHeight = (function($, document) {

  const matchHeightItems = () => {
    $('.match-height-item-by-row').matchHeight();
    $('.match-height-item').matchHeight({
      byRow: false
    });
  }

  $(window).on("load", function() {
    // run matchheight after images are loaded
    matchHeightItems();
  });

  $("body").on("shown.ef.news", function(e) {
    matchHeightItems();
    // For news with data-mh
    $.fn.matchHeight._applyDataApi();
  })

})(jQuery, document);

export default eclipseFdnMatchHeight;