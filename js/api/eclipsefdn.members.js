/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
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

import parse from 'parse-link-header';

import { fetch } from 'whatwg-fetch';

function getMembers(url = '', members = []) {
  return new Promise((resolve, reject) =>
    fetch(url)
      .then((response) => {
        if (response.status !== 200) {
          throw `${response.status}: ${response.statusText}`;
        }
        response
          .json()
          .then((data) => {
            members = members.concat(data);
            const linkHeader = parse(response.headers.get('Link'));
            if (linkHeader.next) {
              const { url } = linkHeader.next;
              getMembers(url, members).then(resolve).catch(reject);
            } else {
              members.sort((a, b) => a.name.localeCompare(b.name));
              // const template = require('./templates/member.mustache');

              members.map((p) => {
                // p.render = () => template(p);
              });

              resolve(members);
            }
          })
          .catch(reject);
      })
      .catch(reject)
  );
}

export default getMembers;

// This is an implementation example and will not be included in the final
// contribution.
import 'jquery';
import 'jquery-match-height';

(function (document, $, window) {
  document.addEventListener('DOMContentLoaded', function () {
    function getMembersList(level = 'sd') {
      getMembers(
        'https://api.eclipse.org/public/member?level=' + level + '&pagesize=100'
      )
        .then((members) => {
          const template = require('./templates/member.mustache');
          document.getElementById('wg-members-' + level).innerHTML = template({
            items: members,
          });
        })
        .then(() => {
          $.fn.matchHeight._applyDataApi();
        })
        .catch(console.error);
    }
    getMembersList('sd');
    getMembersList('ap');
    getMembersList('as');
  });
})(document, $, window);
