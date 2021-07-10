/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
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

const eclipseFdnBootstrapToggle = (function($, document) {

  // Toggle Text of an HTML element
  var view_more_button_text = $('.toggle-text').html();
  $('.toggle-text').click(function() {
    if ($(this).hasClass('toggle-text-close')) {
      $(this).removeClass('toggle-text-close').html(view_more_button_text);
    } else {
      $(this).addClass('toggle-text-close').html($(this).attr('data-toggle-text'));
    }
  });

})(jQuery, document);

export default eclipseFdnBootstrapToggle;