
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

import 'jquery';
import 'jquery-match-height';
import getMembers from '../api/eclipsefdn.members'

const EclipseFdnMembersList = (function (document, $) {
  document.addEventListener('DOMContentLoaded', function () {
    $('.eclipsefdn-members-list').each(function (index, element) {
      var level = $(element).attr('data-ml-level');
      if (level) {
        getMembers(
          'https://api.eclipse.org/public/member?level=' +
            level +
            '&pagesize=100'
        )
          .then((members) => {
            const template = require('./templates/member.mustache');
            this.innerHTML = template({
              items: members,
            });
          })
          .then(() => {
            $.fn.matchHeight._applyDataApi();
          })
          .catch(console.error);
      }
    });
  });
})(document, $);

export default EclipseFdnMembersList;
