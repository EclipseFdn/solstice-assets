/*!
 * Copyright (c) 2018 Eclipse Foundation, Inc.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 * 
 * Contributors:
 *   Eric Poirier <eric.poirier@eclipse-foundation.org>
 * 
 * SPDX-License-Identifier: EPL-2.0
*/

class EclipseFdnVideos {
  // Default settings
  default_options = {
    selector: ".eclipsefdn-video",
    resolution: "16by9",
    cookie: {
      name: "eclipse_cookieconsent_status",
      value: "allow"
    }
  };

  /**
   * Replace some videos
   * @public
   * @param {Object} options Videos attributes
   */
  replace = function(options) {
    var t = this;
    document.onreadystatechange = function() {
      if (document.readyState == 'interactive') {

        // Go through the parameters of Options if its defined and is an object
        if (typeof (options) !== 'undefined' && typeof (options) === 'object') {
          for (var optionName in t.default_options) {
            if (optionName === "cookie" && typeof (options["cookie"]) !== "object") {
              continue;
            }
            if (typeof (options[optionName]) === 'undefined' || typeof (options[optionName]) !== 'string') {
              continue;
            }
            if (optionName === "resolution" && options["cookie"] !== "16by9" || options["cookie"] !== "4by3") {
              continue;
            }
            t.default_options[optionName] = options[optionName];
          }
        }

        // Select all the videos containing the selector Class
        this.el = document.querySelectorAll(t.default_options['selector']);

        var cookie_value = "";
        if (typeof (t.default_options['cookie']['name']) !== 'undefined') {
          // Get the cookie consent value
          var value = "; " + document.cookie;
          var parts = value.split("; " + t.default_options['cookie']['name'] + "=");
          if (parts.length >= 2) {
            cookie_value = parts.pop().split(";").shift();
          }
        }

        for (var i = 0; i < this.el.length; i++) {

          // Give the proper height to the element
          var width = this.el[i].offsetWidth;
          var resolution_sizes = t.default_options['resolution'].split("by");
          var percentage = resolution_sizes[1] / resolution_sizes[0] * 100;

          // Set the appropriate height for the video
          this.el[i].setAttribute("style", "height:" + width * percentage / 100 + "px;");

          // Making sure the url is formatted as we expect it to be
          var link = this.el[i].getAttribute("href").replace(/http(s|):\/\/(www|)(\.|)(youtube\.com\/watch\?v=|youtu\.be\/)/i, "//www.youtube.com/watch?v=");

          if (cookie_value === t.default_options['cookie']['value']) {
            // Create a div to wrap the viewo
            var video_container = document.createElement("div");
            video_container.className = "eclipsefdn-video embed-responsive embed-responsive-" + t.default_options['resolution'];
            video_container.innerHTML = '<iframe src="' + link.replace(/watch\?v\=/i, "embed/") + '"></iframe>';

            // Replace the original element with the embeded video
            this.el[i].parentNode.replaceChild(video_container, this.el[i]);
          }
          else {
            this.el[i].setAttribute("class", "eclipsefdn-video eclipsefdn-video-with-js");
            if (this.el[i].getElementsByTagName('img').length != 1) {
              var video_id = "";
              if (link.includes('//www.youtube.com/watch?v=')) {
                video_id = link.replace("//www.youtube.com/watch?v=", "");
              }
              if (link.includes('//www.youtube.com/embed/')) {
                video_id = link.replace("//www.youtube.com/embed/", "");
              }
              if (video_id !== "") {
                this.el[i].innerHTML = '<img class="img-responsive" src="//img.youtube.com/vi/' + video_id + '/maxresdefault.jpg">';
              }
            }
          }
        }
      }

    }
  }
}

// Define object
var eclipseFdnVideos = new EclipseFdnVideos();
