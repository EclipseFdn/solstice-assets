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
import 'bootstrap';

import './bootstrap'
import '../api/jquery.eclipsefdn.api';

const eclipseFdnSolstice = (function ($, document) {
  // This code will prevent unexpected menu close when
  // using some components (like accordion, forms, etc).
  $(document).on('click', '.yamm .dropdown-menu', function (e) {
    e.stopPropagation();
  });

  // Initialize featured-footer
  $('.eclipsefdn-featured-footer').eclipseFdnApi({
    type: 'featuredFooter',
  });

  // Initialize featured-story
  $('.eclipsefdn-featured-story').eclipseFdnApi({
    type: 'featuredStory',
  });

  // See sidebar blocks of Eclipse Marketplace for an example
  $('.solstice-collapse').click(function () {
    $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
  });

  // Focus on the Google search bar when dropdown menu is being shown
  $('.main-menu-search').on('shown.bs.dropdown', function () {
    $('.gsc-input').focus();
  });

  // Hide search on ESC key.
  // @todo: Find a way to make it work when focus is on an input field.
  $(document).bind('keydown', '27', function (e) {
    $('.eclipse-search a').dropdown('toggle');
  });

  feather.replace();
})(jQuery, document);

export default eclipseFdnSolstice;
