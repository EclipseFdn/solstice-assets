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
(function($, document) {

  $(window).on("load", function() {
    if (window.location.hash && $(window.location.hash).hasClass("tab-pane")) {
      window.scrollTo(0, 0);
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 1);
    }
  });

  $(document).ready(function() {

    var href_hash = window.location.hash;
    // Add a class if right column is non-existant.
    if ($("#rightcolumn").length == 0) {
      $("#midcolumn").attr("class", "no-right-sidebar");
      if (href_hash) {
        window.location.hash = href_hash;
      }
    }
    // add a class if left column is non-existant.
    if ($('#main-sidebar').length == 0) {
      $("#midcolumn").attr("class", "no-left-nav");
      if (href_hash) {
        window.location.hash = href_hash;
      }
    }

    $('#showalltabs').click(function() {
      $('.tabs li').each(function(i, t) {
        $(this).removeClass('active');
      });
      $('.tab-pane').each(function(i, t) {
        $(this).addClass('active');
      });
    });

    href_hash && $('ul.nav a[href="' + href_hash + '"]').tab('show');

    // render RSS feeds if they exist
    renderRSSFeeds();
    // render each of the sliders, using optional data attributes for settings
    $(".solstice-slider").each(function() {
    	var $t = $(this);
    	$t.owlCarousel({
	      responsive: {
	        0: {
	          items: $t.data('slider-xs-count') || 1
	        },
	        768: {
	          items: $t.data('slider-sm-count') || 2
	        },
	        992: {
	          items: $t.data('slider-md-count') || 3
	        },
	        1170: {
	          items: $t.data('slider-lg-count') || 3
	        }
	      },
	      pagination: true,
	      responsiveRefreshRate: 100
	    });
    });
  });

  // This code will prevent unexpected menu close when
  // using some components (like accordion, forms, etc).
  $(document).on("click", ".yamm .dropdown-menu", function(e) {
    e.stopPropagation()
  });

  // scroll button.
  $(window).on("load resize scroll", function() {
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
  $('.scrollup').click(function() {
    $("html, body").animate({
      scrollTop: 0
    }, 600);
    return false;
  });

  $('.nav-tabs a').click(function(e) {
    $(this).tab('show');
    history.pushState({}, "", this.href);
    $('.alert:not(.stay-visible)').remove();
  });

  $("a[data-tab-destination]").on('click', function() {
    var tab = $(this).attr('data-tab-destination');
    $("#" + tab).click();
  });

  $('.solstice-collapse').click(function() {
    $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
  });

  feather.replace();


  function matchHeightItems() {
    $('.match-height-item-by-row').matchHeight();
    $('.match-height-item').matchHeight({
      byRow: false
    });
  }
  matchHeightItems();
  
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
    blockSumaryItem();
  })

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

  eclipseFdnVideos.replace();

  // Toggle Text of an HTML element
  var view_more_button_text = $('.toggle-text').html();
  $('.toggle-text').click(function() {
    if ($(this).hasClass('toggle-text-close')) {
      $(this).removeClass('toggle-text-close').html(view_more_button_text);
    } else {
      $(this).addClass('toggle-text-close').html($(this).attr('data-toggle-text'));
    }
  });
  
  $("a.alt-tab-toggle").click(function(e) {
    // get current element that triggered update
    var $t = $(e.target);
    console.log($t)
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

  // Infra 2791 - Send events to Google Analytics
  $('a[href]').click(function() {
    if (typeof ga === "function") {
      // Get the file name out of the href attribute
      var fileName = $(this).attr('href').split('/').pop();

      // Get the file extension
      var fileExtension = fileName.split('.').pop();

      // Quit here if the extension of the clicked file isn't part of the
      // following list
      // and if the Google Analytics is not loaded
      var tracker = ga.getAll()[0].get('name');
      if (tracker && $.inArray(fileExtension, ['pdf', 'jpg', 'png', 'zip', 'dmg', 'gz', 'exe', 'doc', 'odt', 'rtf', '7z', 'arj', 'deb', 'pkg', 'rar', 'rpm', 'z', 'tar', 'xml', 'csv', 'xls', 'xlr', 'ods', 'rss']) !== -1) {
        // Send the event to Google Analytics
        ga(tracker + '.send', 'event', {
          'eventCategory': 'solstice-event-tracker',
          'eventAction': window.location.href,
          'eventLabel': fileName
        });
      }
    }
  });
  async function renderRSSFeeds() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $('.solstice-rss-feed').each(function(item) {
      var $t = $(this);
      $.ajax({
        type: "GET",
        url: $t.attr('data-src'),
        dataType: "xml",
        success: async function(data) {
          var rssLimit = $t.attr('data-limit');
          if (rssLimit < 0) {
            // set max to a high number to stop long page
            // unresponsiveness
            rssLimit = 100;
          }
          // get container and ensure is empty
          var $container = $t.find('ul');
          $container.empty();

          // build the list using the entries retrieved from the
          // atom-based feed
          var $template = $t.find('.template li').first();
          var rssCount = 0;
          $(data).find("entry").each(function() {
            // convert XML to HTML element for ease of consumption
            var $el = $(this);
            // validate item has a proper heading
            var itemTitle = $el.find("> title").text().trim();
            if (itemTitle == "") {
              return;
            }
            // stop if we reach the limit
            if (rssCount++ >= rssLimit) {
              return false;
            }
            // create a copy of template to use as base of rss item
            var $item = $template.clone();
            // update the title el of the rss item
            var $title = $item.find('p a');
            $title.attr('href', $el.find("> link").attr('href'));
            $title.text(itemTitle);

            // add the date of the RSS item post
            var d = new Date($el.find("> updated").text());
            $item.find('p small').text(months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' ' + d.toLocaleTimeString());

            // add the item to the RSS feed container
            $container.append($item);
          });
          // remove loading image
          $t.find('p.solstice-loading').remove();
          // display the updated container
          $container.show();
        }
      });
    });
  }
})(jQuery, document);