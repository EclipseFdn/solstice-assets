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

import 'element-closest-polyfill';

const eclipseFdnBlockSummaryItem = (function(document) {

  document.addEventListener('click', function (event) {
    // If the clicked element does not have and is not contained by an element with the .click-me class, ignore it
    if (!event.target.closest('.block-summary-item')) {
      return;
    }

    const link = event.target.closest('.block-summary-item').querySelector('h4').querySelector('a');
    if (link) {
      link.click();
    }
  }, false);

})(document);

export default eclipseFdnBlockSummaryItem;