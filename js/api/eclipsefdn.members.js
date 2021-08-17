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
              resolve(members);
            }
          })
          .catch(reject);
      })
      .catch(reject)
  );
}

export default getMembers;

// @todo: This is currently being called on every page load for testing.
// This is an example and will not be included in the final contribution
getMembers('https://api.eclipse.org/public/member')
  .then((members) => {
    // all members have been loaded
    members.sort((a, b) => a.name.localeCompare(b.name));
    const template = require('./templates/member.mustache');
    members.map((p) => {
      const rendered = template(p);
      if (document.getElementById('wg-members-' + p.membership_level.level)) {
        document.getElementById(
          'wg-members-' + p.membership_level.level
        ).innerHTML += rendered;
      }
    });
    return members;
  })
  .then(() => {
    // match-height
    $('body').trigger('shown.ef.news');
  })
  .catch(console.error);


