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

import $ from 'jquery';
import 'jquery-match-height';
import getMembers from '../api/eclipsefdn.members';
import template from './templates/member.mustache';

const EclipseFdnMembersList = (() => {
  $('.eclipsefdn-members-list').each(function (index, element) {
    let url = 'https://api.eclipse.org/public/member?pagesize=100';

    const level = $(element).attr('data-ml-level');
    if (level) {
      url += '&level=' + level;
    }

    const wg = $(element).attr('data-ml-wg');
    if (wg) {
      url += '&working_group=' + wg;
    }

    getMembers(url)
      .then((members) => {
        this.innerHTML = template({
          items: members,
        });
        $.fn.matchHeight._applyDataApi();
      })
      .catch(console.error);
  });
})();

export default EclipseFdnMembersList;
