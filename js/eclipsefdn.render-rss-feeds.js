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
  $(document).ready(function() {
    // render RSS feeds if they exist
    renderRSSFeeds();
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