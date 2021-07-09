
import Mustache from 'mustache'

import jQuery from 'jquery';
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

const eclipseFdnApi = (function($, window, document, undefined) {
  "use strict";

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn"t really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variables rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "eclipseFdnApi",
    defaults = {
      apiUrl: "https://api.eclipse.org",
      gerritUrl: "https://git.eclipse.org/r",
      eventUrl: "https://newsroom.eclipse.org/api/events",
      adsUrl: "https://newsroom.eclipse.org/api/ads",
      forumsUrl: "https://www.eclipse.org/forums",
      marketplaceUrl: "https://marketplace.eclipse.org",
      username: "cguindon",
      currentUser: "",
      contentPlaceholder: null,
      errorMsg: "<i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i> An unexpected error has occurred.",
      gerritUserNotFoundMsg: "<h2 class=\"h3\">Outgoing Reviews</h2>There are no outgoing reviews for this user.<h2 class=\"h3\">Incoming Reviews</h2>There are no incoming reviews for this account.",
      type: "",
      itemsPerPage: 10,
      accountsUrl: "https://accounts.eclipse.org",
      newsroomUrl: "https://newsroom.eclipse.org/api",
      featuredContent: {},
      featuredContentType: ""
    };
  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don"t want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function() {
      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.settings
      // you can add more functions like the one below and
      // call them like the example below
      var validTypes = [
        "mpFavorites",
        "gerritReviews",
        "recentEvents",
        "forumsMsg",
        "gerritReviewCount",
        "projectsList",
        "mailingListSubscription",
        "newsItems",
        "filteredEvents",
        "featuredStory",
        "featuredFooter",
        "customFeaturedContent",
        "allPromos",
        "singlePromo"
      ];
      if ($.type(this.settings.type) === "string" && $.inArray(this.settings.type, validTypes) !== -1) {
        this[this.settings.type]();
      }
    },
    projectsList: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      // Exit if variables are not set.
      if (!username && !api_url) {
        return false;
      }

      // Build api URI.
      var url = apiUrl + "/account/profile/" + username + "/projects";
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data) {

          var project_count = Object.keys(data).length;
          if (project_count === undefined) {
            project_count = 0;
          }

          $(this).children("strong").text(project_count + self.plurialString(" project", project_count));

          // Exit now if contentPlaceholder is not defined
          if (!(self.settings.contentPlaceholder instanceof jQuery)) {
            return false;
          }

          var container = $(self.settings.contentPlaceholder);
          var a = $("<a></a>");

          container.append($("<h2></h2>").addClass("h3").text("Eclipse Projects"));
          container.append("<p>Projects are the organizational unit for open source " +
            "development work at the Eclipse Foundation. Projects have developers " +
            "(committers), source code repositories, build servers, downloads, " +
            "and other resources. The Eclipse Foundation's open source projects " +
            "are governed by the <a href=\"https://eclipse.org/projects/dev_process/\">Eclipse Development Process</a>.</p>");

          var warning_prefix = "This user is";
          if (self.settings.currentUser === self.settings.username) {
            warning_prefix = "You are";
          }

          if (project_count === 0) {
            container.append("<div class=\"alert alert-warning\" role=\"alert\">" +
              warning_prefix + " not involved in any Eclipse Projects." +
              "</div>");
            return false;
          }

          // Create table
          var table = $("<table></table>").attr({
            "width": "100%",
            "class": "table"
          });

          var tr = $("<tr></tr>");
          var th = $("<th></th>");
          var td = $("<td></td>");

          tr.append(th.clone().text("Project").attr("width", "85%"));

          tr.append(th.clone().text("Relation").attr({
            "width": "15%",
            "class": "text-center"
          }));

          table.append(tr);
          // Insert rows in table
          $.each(data, function(index, value) {
            var roles = [];
            var projectName = "";
            var activeDate = "";
            $.each(value, function(i, v) {
              roles.push(v.Relation.Description);
              projectName = v.ProjectName;
              activeDate = v.ActiveDate;
              if (v.url !== "") {
                projectName = a.clone().attr({
                  "href": v.url
                }).text(projectName);
              }
            });
            tr = $("<tr></tr>");
            // Replies column
            tr.append(td.clone().html(projectName).append("<br/><small>Since: " + self.dateFormat(new Date(activeDate)) + "</small>"));
            tr.append(td.clone().text(roles.join(", ")).attr("class", "text-center"));
            table.append(tr);
          });

          // append table to container
          var responsive_wrapper = $("<div></div>").attr({
            "class": "table-responsive"
          });
          responsive_wrapper.append(table);
          container.append(responsive_wrapper);
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });
    },
    forumsMsg: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      // Exit if variables are not set.
      if (!username && !api_url) {
        return false;
      }

      // Build api URI.
      var url = apiUrl + "/account/profile/" + username + "/forum?page=1&pagesize=" + self.settings.itemsPerPage;
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data, textStatus, jqXHR) {
          var user_msg_count = 0;
          if (data.posted_msg_count !== undefined && data.id !== undefined) {
            user_msg_count = data.posted_msg_count;
            $(this).attr({
              "href": self.settings.forumsUrl + "/index.php/sp/" + data.id + "/",
            });
          }

          $(this).children("strong").text(user_msg_count + self.plurialString(" topic", user_msg_count));

          // Exit now if contentPlaceholder is not defined
          if (!(self.settings.contentPlaceholder instanceof jQuery)) {
            return false;
          }

          var container = $(self.settings.contentPlaceholder);
          var a = $("<a></a>");

          container.append($("<h2></h2>").addClass("h3").text("Eclipse Forums"));
          container.append($("<p></p>").append("The Eclipse forums are your way of communicating with the community " +
            "of people developing and using Eclipse-based tools hosted at Eclipse.org. " +
            "Please stick to technical issues - and remember, no confidential information - " +
            "these are public forums!"));

          var more_forums_link = a.clone().attr({
            "href": self.settings.forumsUrl,
            "class": "btn btn-primary btn-sm",
            "style": "display:block"
          }).html("<i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i> More");

          if (data.posts.length === 0) {
            container.append("<div class=\"alert alert-warning\" role=\"alert\">" +
              "This user does not have any activities on Eclipse Forums." +
              "</div>");
            container.append(more_forums_link);
            return false;
          }

          // Create table
          var table = $("<table></table>").attr({
            "width": "100%",
            "class": "table",
            "id": "forum-posts"
          });

          var tr = $("<tr></tr>");
          var th = $("<th></th>");

          if (self.settings.currentUser === self.settings.username) {
            tr.append(th.clone().attr("width", "8%"));
          }

          tr.append(th.clone().text("Topics").attr("width", "50%"));
          tr.append(th.clone().text("Replies").attr({
            "width": "8%",
            "class": "text-center"
          }));

          tr.append(th.clone().text("Views").attr({
            "width": "8%",
            "class": "text-center"
          }));

          tr.append(th.clone().text("Last message").attr({
            "class": "text-center"
          }));
          // Insert heading row in table
          table.append(tr);

          // append table to container
          var responsive_wrapper = $("<div></div>").attr({
            "class": "table-responsive"
          });
          responsive_wrapper.append(table);
          container.append(responsive_wrapper);

          // draw the inital row data
          drawForumRows(data);
          // check the link header for total pages
          var linkHeader = new self.linkHeaderParser(jqXHR.getResponseHeader("Link"));
          var lastPage = linkHeader.getLastPageNum();
          // check if itemsPerPage should be updated to returned value
          if (linkHeader.getPageSize() !== self.settings.itemsPerPage) {
            self.settings.itemsPerPage = linkHeader.getPageSize();
          }
          // set fetch posts event
          table.on("fetchPageItemsEvent", fetchForumPosts);
          // store items per page so we know how many to fetch per page
          table.data("postsPerPage", self.settings.itemsPerPage);
          // add pagination bar
          container.append(self.getPaginationBar(lastPage * self.settings.itemsPerPage, "forum-posts"));
          // get the user id
          var current_user_id = data.id;
          // update more forums link
          more_forums_link.attr({
            "href": self.settings.forumsUrl + "/index.php/sp/" + current_user_id + "/",
          });
          // append read more link
          container.append(more_forums_link);
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });

      function drawForumRows(data) {
        var forumTable = $("#forum-posts");
        $.each(data.posts, function(index, value) {
          var request_data = {
            forum_id: value.thread_forum_id,
            forum_name: value.forum_name,
            forum_cat_id: value.forum_name,
            forum_cat_name: value.cat_name,
            root_subject: value.root_msg_subject,
            current_user_last_post_timestamp: value.msg_group_post_stamp,
            current_user_last_post_subject: value.last_user_msg_subject,
            thread_id: value.msg_thread_id,
            thread_reply_count: value.thread_replies,
            thread_views_count: value.thread_views,
            thread_last_post_date: value.thread_last_post_date,
            last_message_timestamp: value.last_msg_post_stamp,
            last_message_poster_id: value.last_msg_poster_id,
            last_message_poster_alias: value.last_poster_alias,
            last_message_last_view: value.read_last_view,
            current_user_id: data.id
          };

          var tr = $("<tr></tr>");
          var td = $("<td></td>");
          var a = $("<a></a>");
          // Link to forum
          var forumLink = a.clone().attr({
            "href": self.settings.forumsUrl + "/index.php/f/" + request_data.forum_id + "/"
          }).text(request_data.forum_name);

          // Link to category
          var catLink = a.clone().attr({
            "href": self.settings.forumsUrl + "/index.php/i/" + request_data.forum_cat_id + "/"
          }).text(request_data.forum_cat_name);

          // Concatenate  category and form link
          var forum_cat_link = $("<small></small>").append("<br/>")
            .append(catLink)
            .append(" &gt; ")
            .append(forumLink)
            .append(" &gt; ")
            .append(request_data.root_subject)
            .append("<br>Posted on " + self.dateFormat(new Date(parseInt(request_data.current_user_last_post_timestamp * 1000))));
          var read_icon = "fa fa-envelope-open-o";
          // Add warning class to row if the user did not see the message
          if (self.settings.currentUser === self.settings.username &&
            request_data.last_message_last_view < request_data.thread_last_post_date &&
            request_data.last_message_poster_id !== request_data.current_user_id) {
            tr.addClass("warning");
            read_icon = "fa fa-envelope-o";
          }

          if (self.settings.currentUser === self.settings.username) {
            tr.append(td.clone().html("<i class=\"" + read_icon + "\" aria-hidden=\"true\"></i>").attr("class", "text-center"));
          }

          // Topic column
          tr.append(td.clone().html(a.clone().attr({
            "href": self.settings.forumsUrl + "/index.php/t/" + request_data.thread_id + "/"
          })
            .text(request_data.current_user_last_post_subject))
            .append(forum_cat_link)
          );
          // Replies column
          tr.append(td.clone().text(request_data.thread_reply_count).attr("class", "text-center"));

          // Views column
          tr.append(td.clone().text(request_data.thread_views_count).attr("class", "text-center"));

          // Last message column
          var last_message = $("<small></small>").append(self.dateFormat(new Date(parseInt(request_data.last_message_timestamp * 1000)))).append("<br/> By: ").append(a.clone().attr({
            "href": self.settings.forumsUrl + "/index.php/sp/" + request_data.last_message_poster_id + "/"
          }).text(request_data.last_message_poster_alias));
          tr.append(td.clone().html(last_message).attr("class", "text-center"));

          forumTable.append(tr);
        });
      }

      function fetchForumPosts(event, page, numPosts) {
        getForumPostsByPage(page, numPosts);
      }

      function getForumPostsByPage(pageNum, pageSize) {
        if (typeof (pageNum) === "undefined") {
          // default to page 1
          pageNum = 1;
        }
        if (typeof (pageSize) === "undefined") {
          // default to settings
          pageSize = self.settings.itemsPerPage;
        }

        // Build api URI.
        var url = apiUrl + "/account/profile/" + username + "/forum?page=" + pageNum + "&pagesize=" + pageSize;
        $.ajax(url, {
          context: self.element,
          success: function(data) {
            drawForumRows(data);
          },
          error: function() {
            $(this).html(self.settings.errorMsg);
          }
        });
      }
    },
    mpFavorites: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      // Exit if variables are not set.
      if (!username && !api_url) {
        return false;
      }

      // Add content if contentPlaceholder is defined
      if (self.settings.contentPlaceholder instanceof jQuery) {
        var container = $(self.settings.contentPlaceholder);
        var more_marketplace_link = $("<a></a>").attr({
          "href": self.settings.marketplaceUrl + "/user/" + username + "/favorites",
          "class": "btn btn-primary btn-sm",
          "style": "display:block"
        }).html("<i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i> More");
        container.append($("<h2></h2>").addClass("h3").text("Eclipse Marketplace Favorites"));
        container.append($("<p></p>").append("Eclipse Marketplace is the source for " +
          "Eclipse-based solutions, products and add-on features. " +
          "Thousands of developers visit Marketplace on a monthly " +
          "basis to find new and innovative solutions. Solution providers " +
          "are encouraged to list their products on Marketplace to " +
          "gain exposure to the Eclipse developer community."));
      }
      // Build api URI.
      var url = apiUrl + "/marketplace/favorites?name=" + username + "&page=1&pagesize=" + self.settings.itemsPerPage;
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data, textStatus, jqXHR) {
          $(this).children("strong").text(data.result.count + self.plurialString(" favorite", data.result.count));
          // Exit now if container is not defined
          if (typeof container === "undefined") {
            return false;
          }
          // break down the nodestr by itemsPerPage
          var nodes = [];
          $.each(data.mpc_favorites, function(k, v) {
            nodes.push(v.content_id);
          });

          if (nodes.length === 0) {
            container.append("<div class=\"alert alert-warning\" role=\"alert\">" +
              "There are no marketplace favorites for this user." +
              "</div>");
            container.append(more_marketplace_link);
            return false;
          }
          // check the link header for total pages
          var linkHeader = new self.linkHeaderParser(jqXHR.getResponseHeader("Link"));
          var lastPage = linkHeader.getLastPageNum();
          // check if itemsPerPage should be updated to returned value
          if (linkHeader.getPageSize() !== self.settings.itemsPerPage) {
            self.settings.itemsPerPage = linkHeader.getPageSize();
          }

          // set the fetch favorites as custom event
          container.on("fetchPageItemsEvent", fetchFavorites);
          container.append("<h3 id=\"mpc_list_name\">" + data.mpc_list_name + "</h3>");
          container.append("<div class=\"row\"><div class=\"col-md-17\"><div class=\"form-item form-type-textfield form-disabled\">" +
            "<label>Favorites URL <a href=\"#\" class=\"install-user-favorites\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"top\" title=\"\" data-original-title=\"How to install?\">" +
            "<i class=\"fa fa-question-circle\" aria-hidden=\"true\"></i></a> </label>" +
            "<input disabled=\"true\" class=\"form-control form-text\" type=\"text\" value=\"http://marketplace.eclipse.org/user/" + self.settings.username + "/favorites\" size=\"60\" maxlength=\"128\">" +
            "</div></div><div class=\"col-md-7 margin-top-25 text-right\"><div class=\"drag_installbutton drag_installbutton_v2 drag-install-favorites\">" +
            "<a href=\"http://marketplace.eclipse.org/user/" + self.settings.username + "/favorites\" class=\"drag\" title=\"How to install?\">" +
            "<span class=\"btn btn-default\"><i class=\"fa fa-download orange\"></i> Install Favorites</span>" +
            "<div class=\"tooltip tooltip-below-right\"><h3>Drag to Install!</h3>" +
            "Drag to your running Eclipse<sup>*</sup> workspace to install this " +
            "favorite list. <br><sup>*</sup>Requires Eclipse Marketplace Client.</div></a></div></div></div>");
          container.append("<div id=\"mpfavorites-list\"></div>");
          container.find("#mpfavorites-list").data("postsPerPage", self.settings.itemsPerPage);
          getFavoritesByNodes(nodes.join());
          container.append(self.getPaginationBar(lastPage * self.settings.itemsPerPage, "mpfavorites-list"));
          container.append(more_marketplace_link);
          // Add instructions to popover
          $("a.install-user-favorites").on("click", function(e) {
            e.preventDefault();
          });
          $("a.install-user-favorites").popover({
            html: true, content: function() {
              return $("<ol></ol>")
                .addClass("padding-left-20")
                .append("<li>Copy <strong>URL</strong> from textfield.</li>")
                .append("<li>Open Eclipse Marketplace Client (MPC).</li>")
                .append("<li>Open <strong>Favorites</strong> tab.</li>")
                .append("<li>Click on <strong>Import Favorites list</strong>.</li>")
                .append("<li>Paste <strong>URL</strong> in the textfield.</li>");
            }
          });
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });

      function getFavoritesByNodes(nodestr) {
        var url = self.settings.marketplaceUrl + "/node/" + nodestr + "/api/p";
        $.ajax(url, {
          context: self.element,
          success: function(data) {
            var listingContainer = $("#mpfavorites-list");
            var nodes = $("node", data);
            nodes.each(function(index, value) {
              // Extract relevant data from XML
              var node = $(value);
              var shortdescription = node.find("shortdescription").text();
              var title = value.getAttribute("name");
              var timestamp_lastupdated = node.find("changed").text();
              var owner = node.find("owner").text();
              var lastupdated = "Last Updated on " + self.dateFormat(new Date(parseInt(timestamp_lastupdated * 1000))) + " by " + owner;
              var nid = value.getAttribute("id");
              var listing = $("#mp-listing-template").clone().removeClass("hidden").removeAttr("id");
              var link = $("<a></a>");
              var category = $("category", value);
              var url_listing = self.settings.marketplaceUrl + "/node/" + nid;
              var image = node.find("image").text();
              var link_listing = link.clone().attr({
                "href": url_listing
              });

              category.each(function(i, v) {
                var catlink = link.clone().attr({
                  "href": v.getAttribute("url")
                }).text(v.getAttribute("name"));
                if (category.length !== (i + 1)) {
                  catlink.append(", ");
                }
                listing.find(".content-categories").append(catlink);
              });

              listing.find(".listing-image").attr({
                "href": url_listing,
                "style": "background:url('" + image + "') no-repeat center;"
              });

              listing.find(".drag").attr({
                "href": self.settings.marketplaceUrl + "/marketplace-client-intro?mpc_install=" + nid,
              });

              listing.find(".listing-title").html(link_listing.clone().text(title));
              listing.find(".content-teaser").html(shortdescription);
              listing.find(".content-last-updated").html(lastupdated);
              listingContainer.append(listing);
            });
          },
          error: function() {
            $(this).html(self.settings.errorMsg);
          }
        });
      }

      function fetchFavorites(event, page, numPosts) {
        getFavoritesListByPage(page, numPosts);
      }

      function getFavoritesListByPage(pageNum, totalItems) {
        if (typeof (pageNum) === "undefined") {
          // default to page 1
          pageNum = 1;
        }
        if (typeof (totalItems) === "undefined") {
          // default to settings
          totalItems = self.settings.itemsPerPage;
        }
        var url = apiUrl + "/marketplace/favorites?name=" + username + "&page=" + pageNum + "&pagesize=" + totalItems;
        $.ajax(url, {
          context: self.element,
          success: function(data) {
            var nodes = [];
            $.each(data.mpc_favorites, function(k, v) {
              nodes.push(v.content_id);
            });
            getFavoritesByNodes(nodes.join());
          },
          error: function() {
            $(this).html(self.settings.errorMsg);
          }
        });
      }
    },
    gerritReviewCount: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      var url = apiUrl + "/account/profile/" + username + "/gerrit";
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data) {
          var count = data.merged_changes_count;
          $(this).children("strong").text(count + self.plurialString(" review", count));
          if (count > 0) {
            $(this).attr({
              "href": self.settings.gerritUrl + "/#/q/owner:" + self.settings.username
            });
          }
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });
    },
    mailingListSubscription: function() {
      var self = this;
      var username = self.settings.username;
      var currentUser = self.settings.currentUser;
      var currentUserUid = self.settings.currentUserUid;
      var userCanEditOwnMailingList = self.settings.userCanEditOwnMailingList;
      var apiUrl = this.settings.apiUrl;
      // Exit if variables are not set.
      if (!username && !api_url) {
        return false;
      }

      var container = self.element;
      var url = apiUrl + "/account/profile/" + username + "/mailing-list";
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data) {
          var subsriptions = data.mailing_list_subscriptions;
          var p = $("<p></p>");
          var h2 = $("<h2></h2>");
          var a = $("<a></a>");
          var strong = $("<strong></strong>");

          var message_user = "This user is";
          if (currentUser === username) {
            message_user = "You are";
          }

          var link = a.clone().attr({
            "href": "/user/" + currentUserUid + "/mailing-list",
            "class": "fa fa-pencil",
            "aria-hidden": "true"
          });
          $(container).append(h2.text("Eclipse Mailing Lists ").append(link));

          if (!jQuery.isEmptyObject(subsriptions)) {
            $(container).append(p.clone().text("The Eclipse Mailing lists are another way for you to interact with your favorite Eclipse project."));
            $(container).append(p.clone().text("Below is a list of the public mailing lists that " +
              message_user.toLowerCase() + " currently  subscribed to at Eclipse.org. When posting emails " +
              "to our mailing lists, please remember that these lists are public, avoid posting ")
              .append(strong.clone().text("personal")).append(" or ").append(strong.clone().text("private information")).append("."));
            $(container).append(p.clone().text("If you are having trouble using our mailing lists, please contact ")
              .append(a.clone().attr("href", "mailto:mailman@eclipse.org").text("mailman@eclipse.org")).append("."));

            // Create table
            var table = $("<table></table>").attr({
              "width": "100%",
              "class": "table",
              "id": "aeri-reports"
            });

            var tr = $("<tr></tr>");
            var th = $("<th></th>");

            // Title Header
            tr.append(th.clone().text("Mailing List").attr("width", "30%"));
            tr.append(th.clone().text("Description").attr("width", "70%"));

            // Insert heading row in table
            table.append(tr);

            // Responsive container to wrap the table
            var responsive_wrapper = $("<div></div>").attr({
              "class": "table-responsive"
            });

            // append table to container
            responsive_wrapper.append(table);
            $(container).append(responsive_wrapper);
            $(container).append(p);
            // Add a row in the table for each Error Reports
            $.each(subsriptions, function(index, value) {
              var tr = $("<tr></tr>");
              var td = $("<td></td>");

              // Title column
              tr.append(td.clone().append(a.clone().attr("href", "/mailing-list/" + value.list_name).text(value.list_name)));

              // Description column
              tr.append(td.clone().append(value.list_description));

              table.append(tr);
            });
          }
          else {
            $(container).append(p.clone().text(message_user + " not subscribed to any Eclipse mailing list."));
          }

          if (currentUser === username && userCanEditOwnMailingList) {
            $(container).append(p.clone().append(a.clone().attr({
              "href": "/user/" + currentUserUid + "/mailing-list",
              "class": "btn btn-primary btn-xs"
            }).text("Manage your Mailing Lists")));
          }

        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });

    },
    gerritReviews: function() {
      var self = this;
      // Build gerrit url
      var gerrit_url = this.settings.gerritUrl + "/changes/?q=owner:" + this.settings.username +
        "+status:open&q=reviewer:" + this.settings.username + "+status:open+-owner:" + this.settings.username + "&pp=0";

      $(this.element).append($("<h2>Eclipse Gerrit</h2>").addClass("h3"));
      $(this.element).append("<p>Gerrit is a web based code review system, facilitating " +
        "online code reviews for projects using the Git version control system.</p>");
      // Fetch data
      gerritRequest(gerrit_url);
      function gerritRequest(url) {
        var pagesize = 100;
        var skip = 0;
        var errorCondition = false;
        var labels = [
          ["gerrit-outgoing", []],
          ["gerrit-incoming", []]
        ];

        $(self.element).on("drawTableEvent", drawOutput);
        // get all pages of data
        getAllPages(url, pagesize, skip);

        function drawOutput() {
          // table id's and to determine section title
          $.each(labels, function(index, value) {
            var title = "";
            switch (value[0]) {
              case "gerrit-outgoing":
                title = "Outgoing Reviews";
                break;
              case "gerrit-incoming":
                title = "Incoming Reviews";
                break;
            }
            var h2 = $("<h4></h4>").addClass("h4").text(title);
            $(self.element).append(h2);
            if (value[1].length === 0) {
              // this result array is empty
              $(self.element).append("<div class=\"alert alert-warning\" role=\"alert\">" +
                "There are no " + title.toLowerCase() + " for this user." +
                "</div>");
              return;
            }
            $(self.element).append(buildGerritTable(value[0], value[1]));
            $(self.element).append(self.getPaginationBar(value[1].length, value[0]));
          });

          var more_gerritlink = $("<a></a>").attr({
            "href": self.settings.gerritUrl + "/#/q/owner:" + self.settings.username,
            "class": "btn btn-primary btn-sm",
            "style": "display:block"
          }).html("<i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i> More");
          $(self.element).append(more_gerritlink);

          function buildGerritTable(id, data) {
            // Create table
            var table = $("<table></table>").attr({
              "width": "100%",
              "class": "table",
              "id": id
            });
            var tr = $("<tr></tr>");
            var th = $("<th></th>");
            var td = $("<td></td>");
            tr.append(th.clone().text("Subject").attr("width", "70%"));
            tr.append(th.clone().text("Status").attr({
              "width": "18%",
              "class": "text-center"
            }));
            tr.append(th.clone().text("Updated").attr({
              "width": "12%",
              "class": "text-center"
            }));
            table.append(tr);
            // Insert rows in table
            var a = $("<a></a>");
            $.each(data, function(index, value) {
              tr = $("<tr></tr>");
              var merge_conflict = "";
              if (value.mergeable === false) {
                merge_conflict = "Merge Conflict";
                tr.addClass("warning");
              }
              var date = value.updated.substring(0, value.updated.indexOf(" "));
              tr.append(td.clone().html(a.clone().attr({
                "href": self.settings.gerritUrl + "/" + value._number
              }).text(value.subject)).append("<br/>" + value.project));
              tr.append(td.clone().text(merge_conflict).attr("class", "text-center"));
              tr.append(td.clone().text(date).attr("class", "text-center"));
              table.append(tr);
            });

            // append table to container
            var responsive_wrapper = $("<div></div>").attr({
              "class": "table-responsive"
            });
            responsive_wrapper.append(table);
            return responsive_wrapper;
          }
        }

        function getAllPages(url, pagesize, skip) {
          pagesize = (typeof (pagesize) !== "undefined") ? pagesize : 100;
          skip = (typeof (skip) !== "undefined") ? skip : 0;
          url += "&start=" + skip + "&n=" + pagesize;

          return $.ajax(url, {
            dataType: "gerrit_XSSI",
            context: self.element,
            converters: {
              "text gerrit_XSSI": function(result) {
                var lines = result.substring(result.indexOf("\n") + 1);
                return jQuery.parseJSON(lines);
              }
            },
            success: function(data) {
              var lastElement1 = Object;
              var lastElement2 = Object;

              if (data[0].length !== 0) {
                $.merge(labels[0][1], data[0]);
                lastElement1 = data[0][data[0].length - 1];
              }
              if (data[1].length !== 0) {
                $.merge(labels[1][1], data[1]);
                lastElement2 = data[1][data[1].length - 1];
              }
              if (("_more_changes" in lastElement1 && lastElement1._more_changes === true) ||
                ("_more_changes" in lastElement2 && lastElement2._more_changes === true)) {
                getAllPages(url, pagesize, skip + pagesize);
              } else {
                $(self.element).trigger("drawTableEvent");
              }
            },
            error: function(data) {
              if (data.status === 400) {
                $(this).html(self.settings.gerritUserNotFoundMsg);
              } else {
                $(this).html(self.settings.errorMsg);
              }
              errorCondition = true;
            }
          });
        }
      }
    },
    recentEvents: function() {
      var self = this;
      // compare two dates
      function compareDates(d1, d2) {
        return (d1.dateTime - d2.dateTime);
      }

      // Execute ajax request
      $.ajax(this.settings.eventUrl, {
        context: this.element,
        success: function(data) {
          var today = new Date();
          var upcomingEvents = [];

          // Fetch only upcoming events.
          for (var i in data.events) {
            data.events[i].dateTime = new Date(data.events[i].date);
            if (data.events[i].dateTime >= today) {
              upcomingEvents.push(data.events[i]);
            }
          }

          // Sort upcoming events.
          upcomingEvents.sort(compareDates);

          // Build output
          var list = $("<ul></ul>").attr({
            "class": "nav",
            "style": "margin:0"
          });
          for (var x in upcomingEvents.slice(0, 5)) {
            var ed = upcomingEvents[x].dateTime;

            var formatedDate = self.dateFormat(ed);

            var link = $("<a>").attr({
              "href": upcomingEvents[x].infoLink
            })
              .html(upcomingEvents[x].title + "<br/><small>" + formatedDate + "</small>");
            var item = $("<li></li>").append(link);
            list.append(item);
          }

          // Remove loading
          $(this).children(".loading").remove();

          // Display events
          $(this).append(list);
          var more_link = $("<a>").attr({
            "href": "http://events.eclipse.org",
            "class": "btn btn-simple btn-sm"
          }).text("more");
          $(this).append(more_link);
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });
    },
    plurialString: function(string, count) {
      if (count > 1) {
        string += "s";
      }
      return string;
    },
    dateFormat: function(date) {
      var monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      var dayList = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      var fullYear = date.getFullYear();
      var fullMonth = monthList[date.getMonth()];
      var fullDay = dayList[date.getDay()];
      var day = date.getDate();
      var hour = ("0" + (date.getHours())).slice(-2);
      var min = ("0" + (date.getMinutes())).slice(-2);
      var time = fullDay + ", " + fullMonth + " " + day + ", " + fullYear + " - " + hour + ":" + min;
      return time;
    },
    // Class to parse and fetch values from the link header pagination
    linkHeaderParser: function(header) {
      var self = this;
      this.links = 0;
      this.getLastPageNum = function() {
        if (typeof (self.links.last) === "undefined") {
          return 0;
        }
        return getParamValue(self.links.last, "page");
      };

      this.getPageSize = function() {
        // grab pagesize from the first item
        if (typeof (self.links.first) === "undefined") {
          return 0;
        }
        // check first for pagesize, which we use
        var size = getParamValue(self.links.first, "pagesize");
        if (size === 0) {
          // it's not there, try size (used by aeri)
          return getParamValue(self.links.first, "size");
        }
        return size;
      };

      if (typeof (header) === "undefined" || header === null) {
        // nothing to do
        return;
      }

      // Split the links by comma
      var linkItem = header.split(",");
      var links = {};

      // Parse each link item
      for (var i = 0; i < linkItem.length; i++) {
        // convert any &amp; back to &
        linkItem[i] = linkItem[i].replace("&amp;", "&");
        var section = linkItem[i].split(";");
        if (section.length < 2) {
          // Missing sections from link header, skip to next item
          continue;
        }
        // store the url and query params
        var url = section[0].replace(/<(.*)>/, "$1").trim();
        // use name as index (next, prev, first, last)
        var name = section[1].replace(/rel="(.*)"/, "$1").trim();
        links[name] = url;
      }

      this.links = links;

      function getParamValue(link, param) {

        if (typeof (param) === "undefined" || typeof (link) === "undefined") {
          return 0;
        }
        var query = link.substr(link.lastIndexOf("?") + 1);
        var params = query.split("&");
        for (var i = 0; i < params.length; i++) {
          var queryItem = params[i].split("=");
          if (decodeURIComponent(queryItem[0]) === param) {
            // return query param value
            return decodeURIComponent(queryItem[1]);
          }
        }
        // no matching query param found
        return 0;
      }
    },
    /**
	 * Create and instantiate the pagination bar for content. In order to make use of this
	 * pagination bar, the given content type must have a listener for the event 'fetchPageItemsEvent'.
	 *
	 * The implementation for the fetchPageItemsEvent listener should have the parameters
	 * (pageNumber, itemsPerPage) to fetch the paged items, and inject them into the
	 * current container context. This will be called when pagination links on the bar are
	 * clicked.
	 *
	 * @param totalItems -
	 *            number of items that will be paginated over.
	 * @param elementID -
	 *            string constant representing different types of operations
	 *            that can be performed. This value should match the ID of
	 *            a container that can be acted upon within the application.
	 * @returns a jQuery element containing a navigation bar
	 */
    getPaginationBar: function(totalItems, elementID) {
      var self = this;
      if (typeof (totalItems) === "undefined") {
        totalItems = 1;
      }
      if (totalItems <= 0 || totalItems <= self.settings.itemsPerPage) {
        // nothing to do or everything fits on single page
        return;
      }
      //initialize to first page
      var activePageNum = 1;
      var pageNav = $("<nav></nav>").attr({
        "arial-label": "Page navigation",
        "id": elementID + "-pager"
      }).addClass("text-center");
      var totalPages = Math.ceil(totalItems / self.settings.itemsPerPage);
      var ul = drawPageNums(totalPages, activePageNum, elementID);
      pageNav.append(ul);
      // create cache
      if (typeof ($("#" + elementID).data("pageCache")) === "undefined") {
        cachePages();
      }
      // return the pagination bar
      return pageNav;

      /**
       * Writes each of the numbered pagination links for the pagination bar.
       * Each of the links will trigger an event to reload the section it is
       * acting on rather than reload the entire page.
       *
       * @param numPages -
       *            maximum number of pages
       * @param currentPageNum -
       *            the current page number
       * @param elementID -
       *            the ID of the element calling for an update. This is used
       *            for content matching + event triggers
       */
      function drawPageNums(numPages, currentPageNum, elementID) {
        var li = $("<li></li>");
        var ul = $("<ul></ul>").addClass("pagination");
        if (typeof (elementID) !== "undefined") {
          ul.attr({
            "data-eclipseFdnApi-elementID": elementID
          });
        }
        var showEllipses = false;
        var ellipses = "";
        var minRange = 1;
        var maxRange = numPages;
        var clickEvent = function() {
          var $this = $(this);
          var toPageNum = $this.attr("data-goto-page");
          var parentUL = $this.parents(".pagination").eq(0);
          var elementID = parentUL.data("eclipsefdnapiElementid");
          $("#" + elementID).trigger("changePageEvent", [toPageNum]);
        };

        // if num pages > 9 then set the page range
        if (numPages > 9) {
          // default to first of last 9 pages
          minRange = numPages - 8;
          if (currentPageNum <= 5) {
            maxRange = 9;
            minRange = 1;
          } else if (currentPageNum <= numPages - 4) {
            // center the page range relative to current page
            minRange = currentPageNum - 4;
            maxRange = currentPageNum + 4;
          }
          showEllipses = true;
          var span = $("<span></span>");
          ellipses = li.clone().append(
            span.clone().html("...").attr({
              "aria-hidden": "true"
            })
          ).addClass("pager-ellipses disabled");
        }

        if (currentPageNum !== 1) {
          ul.append(li.clone().addClass("pager-first").html(
            getPagerLink("First", "first page", 1, "<< first").on("click", clickEvent)
          ));
          ul.append(li.clone().html(
            getPagerLink("Previous", "previous page", currentPageNum - 1, "< previous").on("click", clickEvent)
          ));
          if (showEllipses === true && minRange > 1) {
            ul.append(ellipses.clone());
          }
        }
        // write out page #'s
        var i;
        for (i = minRange; i <= maxRange; i++) {
          var pager = li.clone();
          var pagerLink = getPagerLink("Page " + parseInt(i), "page " + parseInt(i), i).on("click", clickEvent);
          if (currentPageNum === i) {
            pager.addClass("active");
          }
          pager.html(pagerLink);
          ul.append(pager);
        }
        // close the pager if not at end of index
        if (currentPageNum < numPages) {
          if (showEllipses === true && maxRange < numPages) {
            ul.append(ellipses.clone());
          }
          ul.append(li.clone().html(
            getPagerLink("Next", "next page", currentPageNum + 1, "next >").on("click", clickEvent)
          ));
          ul.append(li.clone().addClass("pager-last").html(
            getPagerLink("Last", "last page", numPages, "last >>").on("click", clickEvent)
          ));
        }
        return ul;
      }

      /**
       * Creates the pagination link given the following attributes.
       */
      function getPagerLink(label, titlePiece, gotoPage, text) {
        if (typeof (text) === "undefined") {
          // use the page num
          text = parseInt(gotoPage);
        }
        var a = $("<a></a>");
        return a.attr({
          "aria-label": label,
          "href": "#",
          "onclick": "return false;",
          "title": "Go to " + titlePiece,
          "data-goto-page": parseInt(gotoPage)
        }).text(text);
      }

      /**
     * Builds the page cache for the current container. This will only live
     * for the current page, and will disappear when the page is left as
     * this cache lives on request rather than in-browser or elsewhere.
     */
      function cachePages() {
        var theElement = $("#" + elementID);
        var pageCache = [];
        var pageCacheType;
        // set the cache type and perform any special handling if needed
        switch (elementID) {
          case "gerrit-incoming":
          case "gerrit-outgoing":
            pageCacheType = "gerrit";
            // build out entire page cache based on existing element data
            pageCache = buildPageCache(theElement.find("tr"));
            break;
          case "mpfavorites-list":
            pageCacheType = "mpfav";
            break;
          case "forum-posts":
          case "aeri-reports":
            pageCacheType = "table";
            pageCache = buildPageCache(theElement.find("tr"));
            break;
          case "news-container":
            pageCacheType = "news";
            break;
          case "events-container":
            pageCacheType = "events";
            break;
          default:
            pageCacheType = "generic";
        }
        // setup the element data and event for changing pages
        theElement.data("pageCache", pageCache);
        theElement.data("pageCacheType", pageCacheType);
        theElement.data("pageCacheTotalPages", totalPages);
        theElement.on("changePageEvent", changePage);

        switch (pageCacheType) {
          case "gerrit":
            // trigger redraw of first page
            theElement.trigger("changePageEvent", [1]);
            break;
        }

        function buildPageCache(data) {
          var counter = 0;
          var pageNum = 0;
          var page = [];
          var theCache = [];
          // grab the heading row if this is gerrit or forum table
          switch (pageCacheType) {
            case "gerrit":
            case "table":
              // set heading row in cache
              theCache[0] = data[0];
              break;
          }
          $.each(data, function(index, value) {
            if ($(value).children().first().is("th")) {
              // don't cache table headings
              return true;
            }
            if (counter === self.settings.itemsPerPage) {
              counter = 0;
              theCache[++pageNum] = page;
              page = [];
            }
            page[counter++] = value;
          });
          // check if any remainder items in page
          if (page.length > 0) {
            // add page to the cache
            theCache[++pageNum] = page;
          }
          return theCache;
        }
      }

      /**
     * Callback for page changes events triggered by pagination links. This
     * will trigger a call to update the containers content with the next
     * pages content, as well as update the pagination bar with the new page
     * set as current. Numbers are shifted if necessary to properly display
     * the current and following pages.
     *
     * This method is internal and requires a listener function be
     * registered for the 'fetchPageItemsEvent' event. Without the listener
     * registered, this function will not be able to update content based on
     * pagination requests.
     *
     * @param event -
     *            the triggering pagination update request.
     * @param goToPageNum -
     *            the requested page number
     */
      function changePage(event, gotoPageNum) {
        var element = $(event.currentTarget);
        var pageType = element.data("pageCacheType");
        var pageCache = element.data("pageCache");
        // get the pager
        var elementID = element.attr("id");
        var nav = $("#" + elementID + "-pager");
        // get pager's current page
        var currentPage = nav.data("currentPage");
        if (typeof (currentPage) === "undefined" || currentPage === null) {
          // if it's not set, assume it's 1st page
          currentPage = 1;
        }
        if (typeof (gotoPageNum) === "undefined") {
          // something is wrong. go back to 1st page
          gotoPageNum = 1;
        }
        // comes in as string
        gotoPageNum = parseInt(gotoPageNum);
        switch (pageType) {
          case "gerrit":
            fillElementWithPage();
            break;
          default:
            addCurrentPageToCache();
            fillElementWithPage();
            break;
        }
        //Replace the pager bar with updated layout
        if (currentPage !== gotoPageNum) {
          var totalPages = element.data("pageCacheTotalPages");
          var newUL = drawPageNums(totalPages, gotoPageNum, elementID);
          nav.find("ul").replaceWith(newUL);
          nav.data("currentPage", gotoPageNum);
        }

        function fillElementWithPage() {
          // empty element first
          element.empty();
          //if not in cache
          if (typeof (pageCache[gotoPageNum]) === "undefined") {
            var params = [];
            // different params for mpc or forum / AERI
            switch (pageType) {
              case "mpfav":
              case "table":
              case "news":
              case "events":
                params.push(gotoPageNum);
                params.push(element.data("postsPerPage"));
                break;
            }
            // if table, put the heading back before triggering fetch and returning
            if (element.is("table")) {
              // this should be just the heading
              element.append(pageCache[0]);
            }
            element.trigger("fetchPageItemsEvent", params);
            return;
          }
          // fill in items from cache
          if (element.is("table")) {
            element.append(pageCache[0]);
          }
          $.each(pageCache[gotoPageNum], function(index, value) {
            element.append(value);
          });
        }

        /**
         * Creates an entry in the page cache for the current container with the
         * current page of data. This reduces outward calls while browsing between pages
         */
        function addCurrentPageToCache() {
          // only store it if current page is not currently cached
          if (typeof (pageCache[currentPage]) === "undefined") {
            var items = [];
            pageCache[currentPage] = [];
            if (element.is("table")) {
              // pull out the table rows
              items = element.find("tr");
            } else if (element.is("div")) {
              // assume mpc nodes or items
              items = element.find(".node,.item");
            }
            $.each(items, function(index, value) {
              if ($(value).children().first().is("th")) {
                // heading is already cached - skip to next
                return true;
              }
              pageCache[currentPage].push(value);
            });
            // update stored cache
            element.data("pageCache", pageCache);
          }
        }
      }
    },

    /**
	 * Injects news items into the page from the Eclipse newsroom, given a few
	 * HTML data attributes on the element this is called on. The data
	 * attributes that can be used will filter the results that are displayed on
	 * page.
     */
    newsItems: function() {
      // set up initial state and call data
      var self = this;
      var $container = $($(this)[0].element);
      // get the news item container
      var $newsContainer = $container.find("> div.news-container");
      if ($newsContainer.length === 0) {
        $newsContainer = $("<div></div>");
        $newsContainer.attr({
          "class": "news-container",
          "id": "news-container"
        });
        $container.append($newsContainer);
      }
      if ($container.data("pagination") === true) {
        $newsContainer.on("fetchPageItemsEvent", retrieveNewsItems);
      }
      retrieveNewsItemsByPage($newsContainer, 1, 5);

      /**
       * Listener callback method for fetchPageItemsEvent event.
       */
      function retrieveNewsItems(event, page, pageSize) {
        retrieveNewsItemsByPage(event.target, page, pageSize);
      }


      /**
     * Retrieves news items for the given page, injected into the element that is passed
     * as the context element. This method uses the following data attributes to filter
     * the data, allowing the use of strings or array values:
     *
     *  - data-publish-target
     *  - data-news-count
     *  - data-news-type
     *
     * The data attribute 'data-template-id' can be used to defined a new mustache script
     * template ID. This script would need to be present on the page and would be used in
     * place of the default template to generate news items.
     *
     * @param contextEl -
     *            the element that called for the news items injection
     * @param page -
     *            page of news items to retrieve
     * @param pageSize -
     *            the number of items to retrieve. This is overridden by whatever is
     *            explicitly defined in the data-news-count attribute on the parent container.
     */
      function retrieveNewsItemsByPage(contextEl, page, pageSize) {
        // get the container element for the current call
        var $newsContainer = $(contextEl);
        var $parent = $newsContainer.parent();

        // check how many to display with a default of 5
        var displayCount = $parent.data("news-count") || pageSize || 5;
        var filter = "?page=" + page;
        filter += "&pagesize=" + displayCount;

        // generate filters based on publish and type targets
        filter += convertDataToURLParameters($parent, "publish-target", "publish_to", "eclipse_org");
        filter += convertDataToURLParameters($parent, "news-type", "news_type", "");
        filter += convertDataToURLParameters($parent, "press-release", "is_press_release", "");

        // create the GET URL for news items
        var url = self.settings.newsroomUrl + "/news" + filter;
        $.ajax(url, {
          success: function(data, textStatus, jqXHR) {
            var newsItems = data["news"];
            if (newsItems.length > displayCount) {
              newsItems = newsItems.slice(0, displayCount);
            }
            // post process the date to update date format
            for (var i = 0; i < newsItems.length; i++) {
              newsItems[i].date = self.dateFormat(new Date(newsItems[i].date));
              newsItems[i].index = i;
            }
            // allow template ID to be set on a per run basis with a default.
            var templateId = $parent.data("template-id") || "template-news-items";
            var template = getTemplate(templateId);
            var rendered = Mustache.render(template, { news: newsItems });
            // clear the container before creating elements
            $newsContainer.html(rendered);

            if ($parent.data("pagination") === true && $parent.find("nav").length === 0) {
              var linkHeader = new self.linkHeaderParser(jqXHR.getResponseHeader("Link"));
              var lastPage = linkHeader.getLastPageNum();
              // check if itemsPerPage should be updated to returned value
              if (linkHeader.getPageSize() !== self.settings.itemsPerPage) {
                self.settings.itemsPerPage = linkHeader.getPageSize();
              }
              // add pagination bar
              $parent.append(self.getPaginationBar(lastPage * self.settings.itemsPerPage, $newsContainer.attr("id")));
            }
            $parent.trigger("shown.ef.news");
          },
          error: function() {
            // clear the loading placeholder
            $container.empty();
            // display an error message
            var $errorEl = $("<div></div>");
            $errorEl.attr("class", "alert alert-warning");
            $errorEl.text("Unable to load news content currently.");
            $container.append($errorEl);
          }
        });
      }


      /**
     * Returns the mustache template for generating the list of news items from
     * the JSON data.
     *
     * @param templateId -
     *            the ID of the script template to use when generating the news items
     * @returns the mustache template for generating the news list HTML
     */
      function getTemplate(templateId) {
        var newsTemplate = $("#" + templateId);
        if (newsTemplate !== undefined && newsTemplate.length !== 0) {
          return newsTemplate[0].innerHTML;
        }
        return "{{#news}}" +
          "<div class=\"item block-summary-item\" data-mh=\"group-{{ index }}\">" +
          "<p>{{ date }}</p>" +
          "<h4><a href=\"{{ link }}\">{{ title }}</a></h4>" +
          "<p>{{ body }}</p>" +
          "</div>" +
          "{{/news}}";
      }
    },

    filteredEvents: function() {
      // set up initial state and call data
      var self = this;
      var $container = $($(this)[0].element);
      // get the news item container
      var $eventsContainer = $container.find("> div.events-container");
      if ($eventsContainer.length === 0) {
        $eventsContainer = $("<div></div>");
        $eventsContainer.attr({
          "class": "events-container",
          "id": "events-container"
        });
        $container.append($eventsContainer);
      }
      if ($container.data("pagination") === true) {
        $eventsContainer.on("fetchPageItemsEvent", retrieveFilteredEvents);
      }
      retrieveFilteredEventsByPage($eventsContainer, 1, 5);

      /**
       * Listener callback method for fetchPageItemsEvent event.
       */
      function retrieveFilteredEvents(event, page, pageSize) {
        retrieveFilteredEventsByPage(event.target, page, pageSize);
      }

      /**
       * Retrieves event items for the given page, injected into the element that is passed
       * as the context element. This method uses the following data attributes to filter
       * the data, allowing the use of strings or array values:
       *
       *  - data-publish-target
       *  - data-count
       *  - data-type
       *  - data-upcoming
       *  - data-sort-order
       *  - data-sort-field
       *
       * The data attribute 'data-template-id' can be used to defined a new mustache script
       * template ID. This script would need to be present on the page and would be used in
       * place of the default template to generate event items.
       *
       * @param contextEl -
       *            the element that called for the news items injection
       * @param page -
       *            page of news items to retrieve
       * @param pageSize -
       *            the number of items to retrieve. This is overridden by whatever is
       *            explicitly defined in the data-count attribute on the parent container.
       */
      function retrieveFilteredEventsByPage(contextEl, page, pageSize) {
        // get the container element for the currentcall
        var $eventsContainer = $(contextEl);
        var $parent = $eventsContainer.parent();
        var displayCount = $parent.data("count") || pageSize || 5;

        var filter = "?page=" + page;
        filter += "&pagesize=" + displayCount;
        filter += convertDataToURLParameters($parent, "publish-target", "publish_to", undefined);
        filter += convertDataToURLParameters($parent, "type", "type", undefined);
        filter += convertDataToURLParameters($parent, "upcoming", "upcoming_only", undefined);

        // if upcoming is set to 1 (PHP true) then set default sorting
        var upcoming = $parent.data("upcoming") === 1 ? true : false;
        var sortOrder = $parent.data("sort-order") || (upcoming ? "ASC" : undefined);
        var sortField = $parent.data("sort-field") || (upcoming ? "field_event_date" : undefined);
        // special treatment for sort option
        if (sortOrder && sortField) {
          filter += "&options%5Borderby%5D%5B" + sortField + "%5D=" + sortOrder;
        }

        // create the GET URL for news items
        var url = self.settings.newsroomUrl + "/events" + filter;
        $.ajax(url, {
          success: function(data, textStatus, jqXHR) {
            var events = data["events"];
            if (events.length > displayCount) {
              events = events.slice(0, displayCount);
            }
            // post process the date to update date format
            for (var i = 0; i < events.length; i++) {
              // remove registration completely if event is in the past or link is missing
              if (Date.now() > new Date(events[i]["end-date"]) || !events[i]["registration"]) {
                delete events[i]["registration"];
              }
              if (!events[i]["infoLink"]) {
                delete events[i]["infoLink"];
              }

              events[i].date = self.dateFormat(new Date(events[i].date));
              events[i]["end-date"] = self.dateFormat(new Date(events[i]["end-date"]));
            }
            // allow template ID to be set on a per run basis with a default.
            var templateId = $parent.data("template-id") || "template-event-items";
            var isArchive = $parent.data("archive") || false;
            var template = getTemplate(templateId, isArchive);
            var rendered = Mustache.render(template, {
              "events": events
            });
            // set the container HTML to the rendered HTML
            $eventsContainer.html(rendered);

            if ($parent.data("pagination") === true && $parent.find("nav").length === 0) {
              var linkHeader = new self.linkHeaderParser(jqXHR.getResponseHeader("Link"));
              var lastPage = linkHeader.getLastPageNum();
              // check if itemsPerPage should be updated to returned value
              if (linkHeader.getPageSize() !== self.settings.itemsPerPage) {
                self.settings.itemsPerPage = linkHeader.getPageSize();
              }
              // add pagination bar
              $parent.append(self.getPaginationBar(lastPage * self.settings.itemsPerPage,
                $eventsContainer.attr("id")));
            }
            $parent.trigger("shown.ef.events");
          },
          error: function() {
            // clear the loading placeholder
            $container.empty();
            // display an error message
            var $errorEl = $("<div></div>");
            $errorEl.attr("class", "alert alert-warning");
            $errorEl.text("Unable to load events content currently.");
            $container.append($errorEl);
          }
        });
      }

      /**
       * Returns the mustache template for generating the
       * list of events from the JSON data.
       *
       * @param templateId -
       *            the ID of the script template to use
       *            when generating the events
       * @returns the mustache template for generating the
       *          events list HTML
       */
      function getTemplate(templateId, isArchive) {
        var eventsTemplate = $("#" + templateId);
        if (eventsTemplate !== undefined && eventsTemplate.length !== 0) {
          return eventsTemplate[0].innerHTML;
        }
        if (isArchive) {
          return "{{#events}}"
            + "<div class=\"item block-summary-item match-height-item\">"
            + "<h3 class=\"h4\">{{ title }}</h3>"
            + "<p>{{ locationName }}</p>"
            + "<p>{{ date }} - {{ end-date }}</p>"
            + "<p class=\"margin-bottom-0\">"
            + "{{#registration}}"
            + "<a class=\"btn btn-secondary\" href=\"{{ registration }}\">Register Now</a>"
            + "{{/registration}}"
            + "{{#infoLink}}"
            + "<a class=\"btn btn-secondary\" href=\"{{ infoLink }}\">More information</a>"
            + "{{/infoLink}}"
            + "</p>"
            + "</div>"
            + "{{/events}}";
        }
        return "{{#events}}"
          + "<div class=\"col-sm-12 col-md-6 event item match-height-item-by-row flex-column\">"
          + "<h3 class=\"h4 flex-grow\">{{ title }}</h3>"
          + "<p>{{ locationName }}</p>"
          + "<p class=\"flex-grow\">{{ date }} - {{ end-date }}</p>"
          + "<p class=\"margin-bottom-0\">"
          + "{{#infoLink}}"
          + "<a class=\"btn btn-secondary\" href=\"{{ infoLink }}\">More information</a>"
          + "{{/infoLink}}"
          + "{{^infoLink}}"
          + "{{#registration}}"
          + "<a class=\"btn btn-secondary\" href=\"{{ registration }}\">Register Now</a>"
          + "{{/registration}}"
          + "{{/infoLink}}"
          + "</p>"
          + "</div>"
          + "{{/events}}";
      }
    },
    featuredStory: function() {
      var $container = $($(this)[0].element);
      updateFeaturedContent($container, "story", this.settings);
    },
    featuredFooter: function() {
      var $container = $($(this)[0].element);
      updateFeaturedContent($container, "footer", this.settings);
    },
    customFeaturedContent: function() {
      var $container = $($(this)[0].element);
      writeFeaturedContainer(this.settings.featuredContent, $container, this.settings.featuredContentType);
    },

    /**
     Retrieves and inserts a list of promotions onto the page in the calling container. Will pass
     the publish target (if set) to target a particular sites promotions. These promotions will not
     include or create impressions as they aren't meant to be consumed in production by the public.
     */
    allPromos: function() {
      // set up the callbacks + containers for promos
      var $container = $($(this)[0].element);
      var self = this;
      // create container for promos, to enable pagination bar
      var $promosContainer = $container.find("> div.promos-container");
      if ($promosContainer.length === 0) {
        $promosContainer = $("<div></div>");
        $promosContainer.attr({
          "class": "promos-container",
          "id": "promos-container-" + getPseudoRandomNumber()
        });
        $container.append($promosContainer);
      }
      if ($container.data("pagination") === true) {
        $promosContainer.on("fetchPageItemsAd", retrievePromos);
      }
      // trigger first update of promos using first page
      retrievePromosByPage($promosContainer, 1, 10);

      /**
       * Listener callback method for fetchPageItemsAd event.
       */
      function retrievePromos(event, page, pageSize) {
        retrievePromosByPage(event.target, page, pageSize);
      }

      function retrievePromosByPage(contextEl, page, pageSize) {
        var $currentContainer = $(contextEl);
        var $parent = $currentContainer.parent();
        var displayCount = $parent.data("count") || pageSize || 10;

        // generate the URL for retrieve promotions
        var url = self.settings.adsUrl;
        var filter = "?page=" + page;
        filter += "&pagesize=" + displayCount;
        filter += convertDataToURLParameters($parent, "publish-target", "publish_to", undefined);

        // retrieve the promo data via ajax
        $.ajax(url + filter, {
          dataType: "json",
          type: "GET",
          success: function(data) {
            if (data["ads"] === undefined) {
              console.log("Could not load promotional content. AD-01");
            }
            // add the index of the ad for printing out index to all ads page
            for (var i = 0; i < data["ads"].length; i++) {
              data["ads"][i].idx = i;
            }
            // call and write the actual promo content
            writePromoContent($currentContainer, data["ads"], self.settings);

            // add the pagination bar
            if ($parent.data("pagination") === true && $parent.find("nav").length === 0) {
              var linkHeader = new self.linkHeaderParser(jqXHR.getResponseHeader("Link"));
              var lastPage = linkHeader.getLastPageNum();
              // check if itemsPerPage should be updated to returned value
              if (linkHeader.getPageSize() !== self.settings.itemsPerPage) {
                self.settings.itemsPerPage = linkHeader.getPageSize();
              }
              // add pagination bar
              $parent.append(self.getPaginationBar(lastPage * self.settings.itemsPerPage,
                $currentContainer.attr("id")));
            }
          },
          error: function() {
            console.log("Could not load promotional content. AD-02");
          }
        });
      }
    },

    /**
     Retrieves and inserts a single promotion onto the page in the calling container. Will pass
     the host, absolute URI path, and additional parameters for the publish target, and promo ID.
     With these parameters, a post request will be formed that will retrieve a promo with an impressions ID.
     */
    singlePromo: function() {
      var self = this;
      var $container = $($(self)[0].element);
      var $parent = $container.parent();
      var url = self.settings.adsUrl;
      var params = {
        "host": window.location.host,
        "source": window.location.pathname,
        "publish_to": $container.data("publish-target")
      };
      if (typeof $container.data("id")  !== "undefined") {
        url += "/" + $container.data("id");
      }
      $.ajax(url, {
        dataType: "json",
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(params),
        success: function(data) {
          if (data === undefined) {
            console.log("Could not load promotional content, bad content received. AD-03");
          }
          writePromoContent($container, data, self.settings);
          $parent.trigger("shown.ef.ads");
        },
        error: function() {
          console.log("Could not load promotional content. AD-04");
        }
      });
    }
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" +
          pluginName, new Plugin(this, options));
      }
    });
  };


  var writePromoContent = function($container, promos, settings) {
    var template = getPromoTemplate($container.data("template-id"), settings);
    $container.html(Mustache.render(template, {
      "content": promos
    }));
  }

  /**
  Centralize the fetching of promo templates to make it more transparent and easy to manage.

  @param templateId the id of the Mustache template script if it exists
  @param settings the current plugin settings
   */
  var getPromoTemplate = function(templateId, settings) {
    if (settings.type === "allPromos") {
      return getMustacheTemplate(templateId,
        "{{#content}}" +
        "<p>" +
        "<a href=\"http://www.eclipse.org/home/index.php?ad_id={{ id }}\">Ad ID: {{ id }}</a>" +
        "<span class=\"margin-left-10\">prob: {{ weight }}%</span>" +
        "<div class=\"eclipsefnd-ad ad-strategic ad-strategic-default\">" +
        "<a href=\"{{ url }}\" rel=\"nofollow\" style=\"background-image: url('{{ image }}')\">{{ member_name }}</a>" +
        "</div>" +
        "</p>" +
        "{{/content}}");
    }
    return getMustacheTemplate(templateId,
      "{{#content}}" +
      "<div class=\"eclipsefnd-ad ad-strategic ad-strategic-default\">" +
      "<a href=\"{{ url }}\" rel=\"nofollow\" style=\"background-image: url('{{ image }}')\">{{ member_name }}</a>" +
      "</div>" +
      "{{/content}}");
  }

  var updateFeaturedContent = function(container, type, settings) {
    var $container = $(container);
    var url = settings.newsroomUrl + "/featured_story";
    // get the ID of the featured story if set
    var id = $container.data("id");
    if (id !== undefined) {
      url += "/" + id;
    }
    // add parameter for publish target for featured content
    url += convertDataToURLParameters($container, "publish-target", "publish_to", undefined, true);
    $.ajax(url, {
      success: function(data) {
        if (data["featured_story"] === undefined) {
          console.log("Could not load featured content, bad content recieved");
        }
        var json = data["featured_story"].filter(function(a) {
          return new Date(a["end-date"]) > new Date() &&
            (a["start-date"] === undefined || new Date(a["start-date"]) < new Date());
        }).filter(function(a) {
          return a["type"] === type || a["type"] === "both";
        });
        // shuffle the array so that a random available data is featured
        if (json.length > 1) {
          shuffleArray(json);
        }
        // make sure we have a promotion to display
        if (json.length > 0) {
          writeFeaturedContainer(json[0], $container, type);
        }
        else {
          var default_featured_story = {
            id: "default-featured-story",
            layout: "light",
            title: "Eclipse Foundation Events",
            body: "Join the world’s leading technologists and open source leaders at Eclipse Foundation events to share ideas, learn and collaborate.",
            links: [
              {
                url: "https://events.eclipse.org",
                title: "View Events"
              }
            ],
          }
          writeFeaturedContainer(default_featured_story, $container, "both");
        }
      },
      error: function() {
        // clear the loading placeholder
        console.log("Could not load featured content!");
      }
    });
  }

  var writeFeaturedContainer = function(item, $container, type) {
    // get the content container and append the content
    var $featuredContentContainer = $container.find(".featured-container");
    $container.addClass("featured-story-nid-" + item.id);
    $container.addClass("featured-story-" + item.layout);
    // allow template ID to be set on a per run basis with a default.
    var templateId = $container.data("template-id") || "template-featured-" + type;
    var template = getMustacheTemplate(templateId,
      "{{#content}}" +
      "<h2 class=\"margin-top-30\">{{ title }}</h2>" +
      "<p>{{ body }}</p>" +
      "<ul class=\"list-inline list-inline-xs-margin\">{{#links}}<li><a class=\"btn btn-primary\" href=\"{{ url }}\">{{ title }}</a></li>{{/links}}</ul>" +
      "{{/content}}");
    var rendered = Mustache.render(template, {
      "content": item
    });
    // set the container HTML to the rendered HTML
    $featuredContentContainer.html(rendered);
  }

  var convertDataToURLParameters = function(el, name, parameterName, defaultVal, first) {
    var dataValue = el.data(name) || defaultVal;
    var filter = "";
    if (Array.isArray(dataValue)) {
      for (var dataIdx = 0; dataIdx < dataValue.length; dataIdx++) {
        if (first && dataIdx === 0) {
          filter += "?";
        } else {
          filter += "&";
        }
        filter += "parameters%5B" + parameterName + "%5D%5B%5D=" + dataValue[dataIdx];
      }
    } else if (dataValue !== undefined) {
      if (first) {
        filter += "?";
      } else {
        filter += "&";
      }
      filter += "parameters%5B" + parameterName + "%5D=" + dataValue;
    }
    return filter;
  };

  var getMustacheTemplate = function(templateId, defaultTemplate) {
    var template = $("#" + templateId);
    if (template !== undefined && template.length !== 0) {
      return template[0].innerHTML;
    }
    return defaultTemplate;
  }

  /**
   * Randomize array element order in-place. Using Durstenfeld shuffle algorithm.
   * source:
   * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   */
  var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };
})(jQuery, window, document);

export default eclipseFdnApi;
