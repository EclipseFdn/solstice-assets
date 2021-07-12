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

// 3rd-party Dependencies
import jQuery from 'jquery';

const eclipseFdnSearch = (function ($, document) {

  // Focus on the Google search bar when dropdown menu is being shown
  $('.main-menu-search').on('shown.bs.dropdown', function () {
    $('.gsc-input').focus();
  });

  // Hide search on ESC key.
  // @todo: Find a way to make it work when focus is on an input field.
  $(document).bind('keydown', '27', function (e) {
    $('.eclipse-search a').dropdown('toggle');
  });

})(jQuery, document);

export default eclipseFdnSearch;
