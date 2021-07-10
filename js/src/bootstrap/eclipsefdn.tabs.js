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
const eclipseFdnBootstrapTabs = (function ($, document) {
  $('.nav-tabs a').click(function (e) {
    $(this).tab('show');
    history.pushState({}, '', this.href);
    $('.alert:not(.stay-visible)').remove();
  });

  $('a[data-tab-destination]').on('click', function () {
    var tab = $(this).attr('data-tab-destination');
    $('#' + tab).click();
  });


  $("a.alt-tab-toggle").click(function(e) {
    // get current element that triggered update
    var $t = $(e.target);
    // trigger click event on tab to properly transition
    var $tabControl = $("ul.nav.nav-tabs [aria-controls=\""+$t.attr("href").substring(1)+"\"]");
    $tabControl.trigger("click");
    // scroll to the top of the tab
    var $tgt = $($t.attr("href"));
    if ($tgt != undefined && $tgt.length != 0){
      $("html, body").animate(
        { scrollTop: $tgt.offset().top },
        800
      );
    }
  });

  // on tab navigation click
  $('li[role="presentation"] a').click(function () {
    var $t = $(this);
    if ($t.data('content-target') !== undefined) {
      if (
        $t.attr('id') === 'showalltabs' &&
        !$($t.data('content-target')).hasClass('content-nav-tab-all')
      ) {
        $($t.data('content-target')).addClass('content-nav-tab-all');
      } else if ($t.attr('id') !== 'showalltabs') {
        $($t.data('content-target')).removeClass('content-nav-tab-all');
      }
    }
    return true;
  });

  $(window).on('load', function () {
    if (window.location.hash && $(window.location.hash).hasClass('tab-pane')) {
      window.scrollTo(0, 0);
      setTimeout(function () {
        window.scrollTo(0, 0);
      }, 1);
    }
  });

  $(document).ready(function () {
    var href_hash = window.location.hash;
    href_hash && $('ul.nav a[href="' + href_hash + '"]').tab('show');

    $('#showalltabs').click(function () {
      $('.tabs li').each(function (i, t) {
        $(this).removeClass('active');
      });
      $('.tab-pane').each(function (i, t) {
        $(this).addClass('active');
      });
    });
  });
})(jQuery, document);

export default eclipseFdnBootstrapTabs;
