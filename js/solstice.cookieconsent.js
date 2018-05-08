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

window.addEventListener("load", function() {
  window.cookieconsent.initialise({
    "type": "opt-in",
    "position": "bottom",
    "revokable": true,
    "cookie": {
      "name": "eclipse_cookieconsent_status",
      "expiryDays": 30,
    },
    "palette": {
      "popup": {
        "background": "#353434",
        "text": "#ffffff"
      },
      "button": {
        "background": "#da7a08",
        "text": "#ffffff"
      }
    },
    "content": {
      "href": "https://www.eclipse.org/legal/privacy.php",
      "dismiss": "Dismiss",
      "link": "click here.",
      "message": "Some Eclipse Foundation pages use cookies to better serve you when you return to the site. You can set your browser to notify you before you receive a cookie or turn off cookies. If you do so, however, some areas of some sites may not function properly. To read Eclipse Foundation Privacy Policy"
    }
  })
});

