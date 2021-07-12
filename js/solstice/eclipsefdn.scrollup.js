/*!
 * Copyright (c) 2020 Eclipse Foundation, Inc.
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

const eclipseFdnScrollUp = (function ($, document) {
  // scroll button.
  $(window).on('load resize scroll', function () {
    if ($(window).width() < 1270) {
      $('.scrollup').hide();
      return false;
    }

    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });

  // scroll back to the top of the page.
  $('.scrollup').click(function () {
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      600
    );
    return false;
  });
})(jQuery, document);

export default eclipseFdnScrollUp;
