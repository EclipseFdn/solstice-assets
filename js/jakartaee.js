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
(function($, document) {
  $(document).ready(function() {
    $('.testimonial-container').html(
      $(".testimonial-item").sort(function(){
        return .5 - Math.random()
      }).slice(0,3).slideDown("slow")
    );
  });
})(jQuery, document);