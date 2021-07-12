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
import feather from 'feather-icons';

const eclipseFdnSolstice = (function ($, document) {
  // This code will prevent unexpected menu close when
  // using some components (like accordion, forms, etc).
  $(document).on('click', '.yamm .dropdown-menu', function (e) {
    e.stopPropagation();
  });

  // See sidebar blocks of Eclipse Marketplace for an example
  $('.solstice-collapse').click(function () {
    $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
  });

  feather.replace();
})(jQuery, document);

export default eclipseFdnSolstice;
