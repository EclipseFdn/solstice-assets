/*!
 * Copyright (c) 2019 Eclipse Foundation, Inc.
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

class EclipseFdnUserProfile {
  precompiledRegex = /<([^>]*?)>;(\s?[\w-]*?="(?:\\"|[^"])*";){0,}\s?rel="next"/;
  // Default settings
  default_options = {
    username: '',
    src_root: 'https://api.eclipse.org/account/profile',
  };

  getMergedOptions(options) {
      // Default settings copy
      var opts = JSON.parse(JSON.stringify(this.default_options));
  
      // Go through the parameters of Options if its defined and is an object
      if (typeof (options) !== 'undefined' && typeof (options) === 'object') {
        for (var optionName in this.default_options) {
          if (typeof (options[optionName]) === 'undefined' || (typeof (options[optionName]) !== 'string' && typeof (options[optionName]) !== 'boolean')) {
            continue;
          }
          opts[optionName] = options[optionName];
        }
      }
      return opts;
  }

  /**
   * Replace the adopters container
   * @public
   * @param {Object} options Videos attributes
   */

  getData = function(options) {
      
    var t = this;
    var opts = this.getMergedOptions(options);
    
    this.fireCall(opts, function(response) {
      t.createUserProfileBlock(response, opts, document.querySelectorAll(opts.selector));
    });
  }

  fireCall(opts, callback, currentData = []) {
    var t = this;
    var xhttp = new XMLHttpRequest();

    // create callback on ready
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // merge new data with current
        var json = JSON.parse(this.responseText);
        if (Array.isArray(currentData) || currentData.length) {
          json = currentData.concat(json);
        }
        callback(json);
      } else if (this.readyState == 4) {
        console.log('Error while retrieving adopters data, could not complete operation');
      }
    };

    // get the URL to call, using the 'next' url if set, otherwise building from original option set
    var url;
    url = opts.src_root;
    if (opts.username !== undefined && opts.username.trim() !== '') {
      url += '/' + opts.username;
    }

    // send request to get JSON data
    xhttp.open('GET', url, true);
    xhttp.send();
  }

  createUserProfileBlock(json_object, opts, el) {
      const div = document.createElement('div');

      if (typeof json_object !== 'undefined') {
        for (const user_profile of json_object) {

          if (opts.username !== user_profile.name) {
            continue;
          }

          if (typeof user_profile.picture !== 'undefined' && user_profile.picture !== null) {
              let img = document.createElement('img');
              img.setAttribute('src', user_profile.picture);
              document.getElementById(user_profile.name).appendChild(img);
          }

          var fullName = "";
          if (typeof user_profile.full_name !== 'undefined' && user_profile.full_name !== null) {
              fullName = document.createTextNode(user_profile.full_name);
          }
          else {
              fullName = document.createTextNode(user_profile.name);
          }
          if (fullName !== "") {
              let h3 = document.createElement('h3');
              h3.appendChild(fullName);
              document.getElementById(user_profile.name).appendChild(h3);
          }

          var job_org = "";
          if (typeof user_profile.job_title !== 'undefined' && user_profile.job_title !== null && user_profile.job_title !== "") {
              job_org = user_profile.job_title + ", ";
          }
          if (typeof user_profile.org !== 'undefined' && user_profile.org !== null) {
              job_org += user_profile.org;
          }
          if (job_org !== "") {
              const org = document.createTextNode(job_org);
              let h4 = document.createElement('h4');
              h4.appendChild(org);
              document.getElementById(user_profile.name).appendChild(h4);
          }

          if (typeof user_profile.bio !== 'undefined' && user_profile.bio !== null) {
              let p = document.createElement('p');
              const bio = document.createTextNode(user_profile.bio);
              p.appendChild(bio);
              document.getElementById(user_profile.name).appendChild(p);
          }
        }
      }
    }

}
var eclipseFdnUserProfile = new EclipseFdnUserProfile();