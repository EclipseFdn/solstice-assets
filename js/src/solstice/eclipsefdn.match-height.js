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

import jquery from 'jquery';
import matchHeight from 'jquery-match-height'

const eclipseFdnMatchHeight = (function($, document) {

  function matchHeightItems() {
    $('.match-height-item-by-row').matchHeight();
    $('.match-height-item').matchHeight({
      byRow: false
    });
  }

  $(window).on("load", function() {
    // run matchheight after images are loaded
    matchHeightItems();
  });

  function blockSumaryItem() {
    // Make the whole block-list clickable
    $('.block-summary-item').click(function() {
      $link = $(this).find('h4 a');
      if (typeof $link !== 'undefined') {
        $link[0].click();
      }
    });
  }
  blockSumaryItem();

  $("body").on("shown.ef.news", function(e) {
    matchHeightItems();

    // For news with data-mh
    $.fn.matchHeight._applyDataApi();

    blockSumaryItem();
  })

})(jQuery, document);

export default eclipseFdnMatchHeight;