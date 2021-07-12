/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 */

const eclipseFdnIgc = (function ($, window, document, undefined) {
  'use strict';
  var pluginName = 'eclipseFdnIgc',
    defaults = {
      // connecting client should identify itself so that storage is separated in
      // multi-client configurations
      clientName: 'unknown',
      // authorization URL. i.e. https://accounts.eclipse.org
      authUrl: 'https://accounts.eclipse.org',
      // URL to API.  i.e. https://api.eclipse.org
      apiUrl: 'https://api.eclipse.org',
      // It should always come back to current site but path may change in the future
      redirectUri: [
        location.protocol,
        '//',
        location.host,
        '/site_login/implicit_grant/authorized',
      ].join(''),
      // its now unnecessary for the connecting client to set storage name, clientID is appended to avoid multi-client collisions
      baseStorageName: 'eclipseIGC',
      // redirect back to originating page after validation. Only disable for debugging validation flow
      redirectIfValid: true,
      // validate token issued to logged in user.  extra validation step. Disabled by default.
      // tklanding will fill this in based on settings
      validateUser: true,
      // base64 encode stored items.
      encodeStorage: true,
      // used only by tklanding to validate token is for the current user, if validateUser enabled
      // tklanding will fill this in.
      username: '',
      // set to false to not store and complete the request after authorization
      completeOnAuthorization: true,
    };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    /**
     * requests a token from oauth2 server using implicit grant flow
     */
    authorizeClient: function () {
      if (this.settings.authUrl.length === 0) {
        // can't continue without it. consider throwing error
        var error = {
          error: 400,
          error_description: 'authorization end-point not defined',
          error_from: 'authorizeClient',
        };
        this.storeItem('error_msg', error);
      }
      // store the "return to" address
      this.storeItem('return_location', {
        prevLoc: window.location.href,
      });

      var state = this.getNewState();
      var authURI =
        this.settings.authUrl +
        '/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=' +
        this.request.cid +
        '&redirect_uri=' +
        encodeURIComponent(this.settings.redirectUri) +
        '&scope=' +
        encodeURIComponent(this.request.scope) +
        '&state=' +
        state;
      self.location = authURI;
    },

    /**
     * retrieves stored action delayed by authorization request
     */
    getDelayedAction: function () {
      // in default standard mode, retrieve it from storage
      return this.getStoredItem('request', true);
    },

    /**
     * Generates and stores a randomized string for verifying the token request
     * was expected and originated from us
     */
    getNewState: function () {
      // generates a random string
      var rand = function () {
        return Math.random().toString(36).substr(2);
      };
      // generate a double-length string to use to validate the state (i.e., the request came from us)
      var newState = rand() + rand();
      // store it for later.
      this.storeItem('state', {
        state: newState,
      });
      return newState;
    },

    /**
     * reads item from storage and returns it
     */
    getStoredItem: function (itemName, burnAfterReading) {
      // add suffix based on item type
      var self = this;
      var storeName = this.getStoreName(itemName);
      if (typeof burnAfterReading === 'undefined') {
        burnAfterReading = false;
      }
      var storedItem = null;
      switch (this.storage) {
        case 'local':
          storedItem = localStorage.getItem(storeName);
          if (storedItem === null) {
            break;
          }
          var date = new Date();
          // parse it and check if it's expired
          storedItem = decodeAndParse(storedItem);
          if (storedItem.expires_time <= date.getTime()) {
            // it's expired, remove it and pretend it doesn't exist
            this.removeStoredItem(itemName);
            storedItem = null;
          }
          break;
        case 'cookie':
          var name = storeName + '=';
          var stored = document.cookie.split(';');
          for (var i = 0; i < stored.length; i++) {
            var c = stored[i];
            c = c.trim();
            if (c.indexOf(name) === 0) {
              storedItem = c.substring(name.length, c.length);
              storedItem = decodeAndParse(storedItem);
            }
          }
          break;
      }
      // remove the item from storage before returning the value, if specified
      if (burnAfterReading) {
        this.removeStoredItem(itemName);
      }
      return storedItem;

      function decodeAndParse(item) {
        var retrievedItem;
        try {
          retrievedItem = self.settings.encodeStorage
            ? JSON.parse(atob(item))
            : JSON.parse(item);
          return retrievedItem;
        } catch (e) {
          //Setting may have been changed while we still had stuff
          if (e instanceof DOMException) {
            // item was expected to be base64 encoded but isn't.
            return JSON.parse(item);
          }
          if (e instanceof SyntaxError) {
            // item was expected to be JSON encoded but isn't.
            return JSON.parse(atob(item));
          }
        }
      }
    },

    /**
     * formats the storage name using the base name and appending an identifier
     * based on item type
     */
    getStoreName: function (itemName) {
      if (typeof itemName === 'undefined') {
        itemName = '';
      }
      var baseName = this.settings.baseStorageName + '_';
      // clientName is used to store settings individually per client
      baseName = baseName + this.settings.clientName;

      switch (itemName) {
        case 'token':
          baseName = baseName + '_tk';
          break;
        case 'state':
          // generated state string for validation
          baseName = baseName + '_st';
          break;
        // "return to" location
        case 'return_location':
          baseName = baseName + '_cloc';
          break;
        // delayed request due to requiring authorization
        case 'request':
          baseName = baseName + '_req';
          break;
        // delayed respone from action completed after authorization
        case 'delayed_response':
          baseName = baseName + '_dlresp';
          break;
        // delayed error from attempted action after authorization
        case 'delayed_error':
          baseName = baseName + '_dlerr';
          break;
        // This is not currently used, as we now trigger an event on auth return.
        case 'feedback_msg':
          baseName = baseName + '_fbm';
          break;
        // Typically for validation errors and such, event triggers on final redirect back.
        case 'error_msg':
          baseName = baseName + '_err';
          break;
        case 'lastAuthReq':
          baseName = this.settings.baseStorageName + '_lreq';
          break;
        default:
          // we shouldn't be here, give it a name anyways
          baseName = baseName + '_' + itemName;
      }
      return baseName;
    },
    /**
     * checks storage and returns bool if a token is already in storage.
     */
    haveToken: function () {
      if (this.getStoredItem('token') !== null) {
        return true;
      }
      return false;
    },

    /**
     * Initialize function for plugin
     */
    init: function () {
      var self = this;
      // expose responseHandler for tklanding page
      $.fn[this._name].responseHandler = function (value) {
        self.responseHandler(value);
      };
      // we may want to expand this for additional callbacks / promises
      $.fn[this._name].makeRequest = function (requestOptions) {
        self.makeRequest(requestOptions);
      };
      // expose storage save item to connecting clients
      $.fn[this._name].saveItem = function (itemName, item, expiresIn) {
        // check for reserved names and bail if they attempt it
        if (!isItemNameReserved(itemName)) {
          self.storeItem(itemName, item, expiresIn);
          return true;
        }
        return false;
      };
      // expose storage retrieve item to connecting clients
      $.fn[this._name].retrieveItem = function (itemName, burnAfterReading) {
        // check for reserved names and bail if they attempt it
        if (!isItemNameReserved(itemName)) {
          return self.getStoredItem(itemName, burnAfterReading);
        }
        return false;
      };
      // expose storage remove item to connecting clients
      $.fn[this._name].removeItem = function (itemName) {
        // check for reserved names and bail if they attempt it
        if (!isItemNameReserved(itemName)) {
          return self.removeStoredItem(itemName);
        }
        return false;
      };
      // determine supported storage method
      this.storage = 'none';
      if (this.settings.baseStorageName.length === 0) {
        // we don't have a baseStorageName for some reason
        this.settings.baseStorageName = 'eclipseIGC';
      }

      // check if browser supports localStorage
      if (typeof Storage !== 'undefined') {
        this.storage = 'local';
      } else if (navigator.cookieEnabled) {
        // if not, maybe cookies are enabled
        this.storage = 'cookie';
      }
      // without some kind of storage, we need to authenticate on each page
      // and lose what we get by the time we've finished authorizing / validating.
      // we currently do not support a non-storage workflow*
      // *the only way this could work is with open-window method and storing in vars
      // if no storage is available, we could throw feedback_msg that this would work better
      // with a modern browser/cookies enabled

      // check for any delayed action stored and send the results in an event
      var delayedResponse = this.getStoredItem('delayed_response', true);
      if (delayedResponse != null) {
        $(document).trigger('igcRequestComplete', delayedResponse);
        return;
      }
      var delayedError = this.getStoredItem('delayed_error', true);
      if (delayedError != null) {
        $(document).trigger('igcRequestFailed', delayedError);
        return;
      }
      var authError = this.getStoredItem('error_msg', true);
      if (authError != null) {
        $(document).trigger('igcAuthFailed', authError);
        return;
      }

      // check if the user is even logged in, if not we need to clear out tokens to prevent multi-user collisions
      $(document).ready(function () {
        // instead of calling Drupal.settings directly,
        // let's expect username to be filled and make this system agnostic.
        if (
          typeof self.settings.username === 'undefined' ||
          self.settings.username.length === 0
        ) {
          // clean-up
          self.removeStoredItem('token');
          return;
        }
        // do we have a last user?
        var lastUser = self.getStoredItem('session_user');
        if (lastUser !== null && lastUser.username !== self.settings.username) {
          // we had a change of users.
          self.removeStoredItem('token');
          // set the new user
          self.storeItem(
            'session_user',
            { username: self.settings.username },
            3600
          );
          return;
        }
        if (lastUser === null) {
          // new user
          self.storeItem(
            'session_user',
            { username: self.settings.username },
            3600
          );
        }
      });

      /**
       * Checks if connecting client is trying to store an item using a reserved store name
       *
       * @param name
       * @returns boolean
       */
      function isItemNameReserved(name) {
        var reservedList = [
          'token',
          'state',
          'return_location',
          'request',
          'delayed_response',
          'delayed_error',
          'feedback_msg',
          'error_msg',
        ];
        if (typeof name === 'undefined') {
          name = '';
        }
        name = name.toLowerCase();
        if (reservedList.indexOf(name) > -1) {
          return true;
        }
        return false;
      }
    },

    /**
     * Public method - if token is stored, makes the request.
     * If not, stores the request and fetches new token via implicit grant flow
     * request and callback should be completed on return
     */
    makeRequest: function (requestOptions, wasDelayed) {
      var self = this;
      if (typeof wasDelayed === 'undefined') {
        wasDelayed = false;
      }

      if (this.haveToken()) {
        // do the request
        var defaultOptions = {
          path: '/',
          method: 'GET',
          // default contentTypes don't play nice, even if we aren't sending data
          contentType: 'application/json',
          context: $(document),
          successCallback: null,
          errorCallback: null,
        };
        var theOptions = $.extend({}, defaultOptions, requestOptions);
        $.ajax({
          url: this.settings.apiUrl + theOptions.path,
          context: theOptions.context,
          method: theOptions.method,
          contentType: theOptions.contentType,
          beforeSend: function (xhr) {
            var token = self.getStoredItem('token');
            xhr.setRequestHeader(
              'Authorization',
              'Bearer ' + token.access_token
            );
          },
        })
          .done(function (data, textStatus, jqXHR) {
            // make sure callback exists, if so call it.
            if (typeof theOptions.successCallback === 'function') {
              theOptions.successCallback(data, textStatus, jqXHR);
              return;
            }
            // if this was a delayed action, the callback would have been lost.
            // store the relevant data so that an event can be triggered on redirect finish
            if (wasDelayed) {
              // combine the requestOptions with data so caller can figure out what they did
              // include the response headers as the functions get stripped from the object on save.
              var combined = {
                clientName: self.settings.clientName,
                data: data,
                textStatus: textStatus,
                responseHeaders: jqXHR.getAllResponseHeaders(),
                requestOptions: theOptions,
              };
              self.storeItem('delayed_response', combined);
              self.redirectToStart();
            }
          })
          .fail(function (jqHXR) {
            // although our token *should* expire when it's due,
            // we need to trigger a re-auth in the event that it's not found and we're no longer authorized
            // or maybe we have the wrong one.
            if (jqHXR.status === 401) {
              triggerAuthorization();
              return;
            }
            // if callback is defined, call it.
            if (typeof theOptions.errorCallback === 'function') {
              requestOptions.errorCallback(jqHXR);
              return;
            }
            // if this was a delayed action, the callback was lost in the flow
            // save some relevant info to trigger an event on redirect finish.
            if (wasDelayed) {
              // combine the requestOptions with data so caller can figure out what they did
              var combined = {
                clientName: self.settings.clientName,
                requestOptions: theOptions,
                jqXHR: jqHXR,
              };
              self.storeItem('delayed_error', combined);
              self.redirectToStart();
            }
          });
        return;
      }
      triggerAuthorization();

      /**
       * saves the current request and triggers a authorization
       * only needed within the makeRequest scope
       */
      function triggerAuthorization() {
        if (self.settings.completeOnAuthorization) {
          // remove the context to prevent "converting circular stucture to json" error
          requestOptions.context = null;
          // store the request to process on completion.
          self.storeItem('request', requestOptions);
        }
        // we'll need this information for the authorization request and to validate
        // the authorization response when it comes back
        self.request = {
          clientName: self.settings.clientName,
          cid: requestOptions.cid,
          scope: requestOptions.scope,
        };
        self.storeItem('lastAuthReq', self.request);
        self.authorizeClient();
      }
    },

    /**
     * pops the authorization into a new window - retains handle and context
     * but may be blocked by browser which breaks the asssociation
     */
    openWindow: function (url) {
      // set window size to pop in new window, login fits ok but auth screen doesn't fit well in smaller window
      // so using default - new tab
      var dialog = window.open(url, 'Authorize', 'height=720, width=1280');
      if (window.focus && dialog) {
        dialog.focus();
      }
    },

    /**
     * redirects the browser back to the users starting point, if known
     * if not then it will go to home of current domain
     */
    redirectToStart: function () {
      // get the location the user left off on and go back
      if (this.settings.redirectIfValid === false) {
        // configured not to redirect and to stay on the landing page
        // there's no good reason for this aside from debugging purposes.
        return;
      }
      var prevLocation = this.getStoredItem('return_location', true);
      if (prevLocation === null) {
        // return them to home page then
        prevLocation = {
          prevLoc: [location.protocol, '//', location.host].join(''),
        };
      }
      window.location.replace(prevLocation.prevLoc);
    },

    /**
     * removes an item from storage
     */
    removeStoredItem: function (itemName) {
      var storeName = this.getStoreName(itemName);
      switch (this.storage) {
        case 'local':
          localStorage.removeItem(storeName);
          break;
        case 'cookie':
          var expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          document.cookie = storeName + '=;' + expires + '; path=/';
          break;
      }
    },

    /**
     * Public method - parses response, validates token if present and stores token in supported storage method
     *
     */
    responseHandler: function (hashValue) {
      var self = this;
      var nothingToDo = true;

      if (typeof hashValue === 'undefined') {
        hashValue = '';
      }
      if (typeof this.settings.redirectIfValid !== 'boolean') {
        this.settings.redirectIfValid = true;
      }

      // parse the response
      var responseParts = parseResponse(hashValue);
      if (!$.isEmptyObject(responseParts)) {
        // check if there's a token in the response
        if (typeof responseParts.access_token !== 'undefined') {
          this.request = this.getStoredItem('lastAuthReq', true);
          if (this.request == null) {
            // this is unexpected, we don't have a pending auth request
            this.redirectToStart();
            return;
          }
          // restore the clientName so we can retrieve items stored for it
          this.settings.clientName = this.request.clientName;
          // check if we already have one
          if (this.haveToken()) {
            // We already have a token. This probably didn't come from a request
            this.redirectToStart();
            return;
          }
          // we have something to do
          nothingToDo = false;
          // check for errors and validate it
          this.validateToken(responseParts, function (success, msg) {
            if (typeof success !== 'boolean') {
              success = false;
            }
            // if validation passes, store it.  Otherwise toss it away and don't even kick the callback (if specified)
            if (success === true) {
              self.storeItem('token', responseParts);
              // retrieve stored action and finalize
              var requestOptions = self.getDelayedAction();
              if (requestOptions != null) {
                // will call redirect when it's done
                self.makeRequest(requestOptions, true);
                return;
              }
            } else {
              // remove the stored request
              self.removeStoredItem('request');
              // store error message, if any, to display on the return
              if (typeof msg !== 'undefined' && msg !== null) {
                // msgs passed back from validation, triggers event after final redirect back.
                self.storeItem('error_msg', msg);
              }
            }
            self.redirectToStart();
          });
        }

        if (typeof responseParts.error !== 'undefined') {
          // access was denied, and likely because someone pressed cancel on the authorization page
          // or an invalid scope was requested
          this.removeStoredItem('request');
          this.removeStoredItem('state');
          this.storeItem('error_msg', responseParts);
        }
      }
      // nothing to do - redirect back to where they were and away from landing
      if (nothingToDo) {
        self.redirectToStart();
      }

      /**
       * parse the response taken from the URI
       *
       * local to responseHandler method scope.
       *
       * @param response
       *
       * @returns object
       */
      function parseResponse(response) {
        // current implementation only checks/gets token and processes the rest if it needs to
        // we gain more in error conditions if we just parse the lot into a keyed array
        var values = {};
        var hashString = response.substring(response.indexOf('?'));
        // don't process if there is no "query" string in the passed in response
        if (hashString) {
          var paramPattern = /([^#?&=]+)=([^&]*)/g;
          var param;
          // break it down, param[1] is name, param[2] is value
          while ((param = paramPattern.exec(hashString)) !== null) {
            values[decodeURIComponent(param[1])] = decodeURIComponent(param[2]);
          }
        }
        return values;
      }
    },

    /**
     * store the token for use later, either in cookie or localStorage
     *
     */
    storeItem: function (itemName, item, expiresIn) {
      var storeName = this.getStoreName(itemName);
      var date;
      var expiry;
      if (typeof item === 'undefined') {
        // nothing really we can do with this
        return;
      }
      switch (itemName) {
        case 'token':
          // token will have expiry as part of response
          expiresIn = parseInt(item.expires_in) - 1;
          date = new Date();
          expiry = expiresIn * 1000;
          break;
        default:
          // set an expiry for everything else
          // default to 5min if not specified.
          if (typeof expiresIn !== 'number' || expiresIn < 1) {
            expiresIn = 3600;
          }
          date = new Date();
          expiry = expiresIn * 1000;
          if (typeof item !== 'object') {
            // this item is not an object, convert for consistent json storage
            item = {
              itemName: item,
            };
          }
      }
      date.setTime(date.getTime() + expiry);
      if (this.storage === 'local') {
        item.expires_time = date.getTime();
      }
      // prep the item
      var jsonItem = this.settings.encodeStorage
        ? btoa(JSON.stringify(item))
        : JSON.stringify(item);

      switch (this.storage) {
        case 'local':
          // add the expiry timestamp

          // we'll store the json string of the response here
          // consider only storing portion we need instead of response
          localStorage.setItem(storeName, jsonItem);
          break;
        case 'cookie':
          // we're going to store the entire response, and set the cookie auto expiry.
          var expires = '; expires=' + date.toUTCString();
          document.cookie = storeName + '=' + jsonItem + expires + '; path=/';
          break;
      }
    },

    /**
     * validates the token and token request client ID against the authorizing agent
     * returns bool on validation result
     */
    validateToken: function (tokenResponseParts, onValidated) {
      var self = this;
      // hopefully we have a state to compare if we have storage
      if (this.storage !== 'none') {
        var storedState = this.getStoredItem('state', true);
        if (
          storedState === null ||
          storedState.state !== tokenResponseParts.state
        ) {
          if (onValidated && typeof onValidated === 'function') {
            onValidated(false);
          }
          return;
        }
      }

      $.ajax({
        url:
          this.settings.authUrl +
          '/oauth2/tokens/' +
          tokenResponseParts.access_token,
      })
        .done(function (data) {
          // does the client ID and scope match ours?
          var valid = true;
          var msg = null;

          if (self.request.cid !== data.client_id) {
            valid = false;
            msg = {
              clientName: self.settings.clientName,
              error: 400,
              error_description:
                'Received token issued to unrecognized Client ID',
              error_from: 'oauth2/tokens',
            };
          }
          // so far so good, check the scopes
          if (valid) {
            // token response separates multi-scopes with '+'
            var grantedScopes = tokenResponseParts.scope.split('+');
            var requestedScopes = self.request.scope.split(' ');
            var flaggedScope = [];
            $(grantedScopes).each(function () {
              if (requestedScopes.indexOf(this) === -1) {
                // the granted scope is not in the list of expected scopes
                valid = false;
                flaggedScope.push(this);
              }
              if (!valid) {
                msg = {
                  clientName: self.settings.clientName,
                  error: 400,
                  error_description:
                    'Granted scope ' +
                    flaggedScope.join(' ') +
                    'is not in the list of expected scopes',
                  error_from: 'oauth2/tokens',
                };
              }
            });
          }
          if (
            self.settings.validateUser &&
            self.settings.username.length > 0 &&
            valid
          ) {
            var tokenUID;
            if (typeof data.user_id !== 'undefined') {
              tokenUID = data.user_id;
            }
            // one more call, which will kick the callback for us
            validateTheUserID(tokenUID, onValidated);
          } else {
            // call the onValidated callback
            if (onValidated && typeof onValidated === 'function') {
              onValidated(valid, msg);
            }
          }
        })
        .fail(function (jqXHR) {
          // error, we can assume it's no good but in case we want to log the attempt somewhere
          // 404's mean the token wasn't found on the authorizing system.
          var msg = {
            clientName: self.settings.clientName,
            error: jqXHR.status,
            error_description: 'Error validating authorization response.',
            error_from: 'validateToken',
          };

          if (onValidated && typeof onValidated === 'function') {
            onValidated(false, msg);
          }
        });

      function validateTheUserID(tokenUID, onValidated) {
        // quick test against what api/account/profile returns
        var account =
          self.settings.apiUrl + '/account/profile/' + self.settings.username;
        $.ajax({
          url: account,
        })
          .done(function (data) {
            var isValid = true;
            var msg = null;
            if (typeof data.name !== 'undefined') {
              // these should match
              if (data.uid !== tokenUID) {
                // hmm, the token's user_id and the logged in user_id do not match.
                msg = {
                  clientName: self.settings.clientName,
                  error: 400,
                  error_description:
                    'Authorizing account does not match the current logged in account on this site',
                  error_from: 'account/profile',
                };
                isValid = false;
              }
            }
            // call the onValidated callback
            if (onValidated && typeof onValidated === 'function') {
              onValidated(isValid, msg);
            }
          })
          .fail(function (jqXHR) {
            var msg = {
              clientName: self.settings.clientName,
              error: jqXHR.status,
              error_description: jqXHR.statusText,
              error_from: 'account/profile',
            };
            if (onValidated && typeof onValidated === 'function') {
              onValidated(false, msg);
            }
          });
      }
    },
  });
  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);

export default eclipseFdnIgc;
