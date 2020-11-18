/*!
 * Copyright (c) 2020 Eclipse Foundation, Inc.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 * 
 * Contributors:
 *   Martin Lowe <martin.lowe@eclipse-foundation.org>
 * 
 * SPDX-License-Identifier: EPL-2.0
 */
(function($, document) {
  $('#eclipsefdn-modal-event-session').on('show.bs.modal', function (event) {
      var $init = $(event.relatedTarget);
      var $parent = $init.parent();
      var $modal = $(this);
      $modal.find('h4.modal-title').text($init.attr('data-title'));
      $modal.find('.modal-body').html($parent.find('.modal-content')[0].innerHTML);
      $modal.find('.modal-body').prepend('<div class="alert alert-warning"><p><span id="modal-presenter">' 
      + $init.attr('data-presenter') 
      + '</span><br><span id="modal-time">' 
      + $init.attr('data-time') 
      + '</span></p></div>');
  });
})(jQuery, document);