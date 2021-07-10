/*!
 * Copyright (c) 2020 Eclipse Foundation, Inc.
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
import jQuery from 'jquery';
import 'owl.carousel';

const eclipseFdnSolsticeSlider = (function ($, document) {
  $(document).ready(function() {
    // render each of the sliders, using optional data attributes for settings
    $(".solstice-slider").each(function() {
    	var $t = $(this);
    	$t.owlCarousel({
	      responsive: {
	        0: {
	          items: $t.data('slider-xs-count') || 1
	        },
	        768: {
	          items: $t.data('slider-sm-count') || 2
	        },
	        992: {
	          items: $t.data('slider-md-count') || 3
	        },
	        1170: {
	          items: $t.data('slider-lg-count') || 3
	        }
	      },
	      pagination: true,
	      responsiveRefreshRate: 100
	    });
    });
  });
})(jQuery, document);

export default eclipseFdnSolsticeSlider;
