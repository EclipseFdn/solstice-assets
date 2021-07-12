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

// 3rd-party Dependencies
import jQuery from 'jquery';
import '../api/jquery.eclipsefdn.api';

const eclipseFdnFeaturedStories = (function ($, document) {

  // Initialize featured-footer
  $('.eclipsefdn-featured-footer').eclipseFdnApi({
    type: 'featuredFooter',
  });

  // Initialize featured-story
  $('.eclipsefdn-featured-story').eclipseFdnApi({
    type: 'featuredStory',
  });

})(jQuery, document);

export default eclipseFdnFeaturedStories;
