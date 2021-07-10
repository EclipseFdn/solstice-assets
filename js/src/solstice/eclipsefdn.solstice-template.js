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
import feather from 'feather-icons'

import eclipseFdnAdopters  from '../api/eclipsefdn.adopters'
import eclipseFdnApi from '../api/jquery.eclipsefdn.api'
import eclipseFdnVideos from '../privacy/eclipsefdn.videos'

const eclipseFdnSolsticeTemplate = (function($, document, window) {
  // This code will prevent unexpected menu close when
  // using some components (like accordion, forms, etc).
  $(document).on("click", ".yamm .dropdown-menu", function(e) {
    e.stopPropagation()
  });
  $(".eclipsefdn-featured-footer").eclipseFdnApi({
    type: "featuredFooter"
  });

  $(".eclipsefdn-featured-story").eclipseFdnApi({
    type: "featuredStory"
  });

  $('.solstice-collapse').click(function() {
    $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
  });

  // Focus on the Google search bar when dropdown menu is being shown
  $('.main-menu-search').on('shown.bs.dropdown', function() {
    $('.gsc-input').focus();
  });

  // Hide search on ESC key.
  // @todo: Find a way to make it work when focus is on an input field.
  $(document).bind('keydown', '27', function(e) {
    $('.eclipse-search a').dropdown("toggle");
  });

  // If the Manage Cookies button from the toolbar is clicked,
  // open the cookie consent popup.
  $('.toolbar-manage-cookies').click(function() {
    $('.cc-window').show();
    setTimeout(function() {
      $('.cc-window').removeClass('cc-invisible');
    }, 20);
  });

  feather.replace();
  window.eclipseFdnVideos.replace();
  window.eclipseFdnAdopters = eclipseFdnAdopters;

})(jQuery, document, window);

export default eclipseFdnSolsticeTemplate;