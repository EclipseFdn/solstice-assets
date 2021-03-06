/*
 *  donate.js
 *  Various functionality for the Eclipse donation forms
 *
 *  Made by Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *  Eric Poirier <eric.poirier@eclipse-foundation.org>
 *
 *  Under EPL-v2 License
 */
const eclipseFdnEclipseDonate = (function ($, document) {
  $(document).ready(function () {
    // If the page loads and the recognition checkbox is already checked
    if ($('input.recognition-checkbox').is(':checked')) {
      $('.recognition-fields').slideDown(300);
    }

    // If the recognition checkbox is clicked
    $('input.recognition-checkbox').click(function () {
      if ($(this).prop('checked') == true) {
        $('.recognition-fields').slideDown(300);
      } else if ($(this).prop('checked') == false) {
        $('.recognition-fields').slideUp(300);
      }
    });

    // When the user click on a pre-defined donation amount
    $('.btn-square').click(function () {
      $('.btn-square, .amount-body, .highlight-amount-body').removeClass(
        'active'
      );
      $(this).addClass('active');
      $('input[name=amount]').val($(this).val());
    });

    // When the user click in the custom donation amount field
    $('input[name=amount]').click(function () {
      $('input[name=amount]').bind('keyup change', function (e) {
        $('.btn-square').removeClass('active');
      });
    });

    /**
     * Create or Update a cookie
     *
     * @param string name - Name of the cookie
     * @param string value - Value of the cookie
     * @param string path - Path of the cookie
     */
    function createCookie(name, value, path) {
      document.cookie = name + '=' + escape(value) + '; path=' + path + ';';
    }

    /**
     * Fetch a specific cookie based on the name
     *
     * @param string name - Name of the cookie
     *
     * @return string
     */
    function fetchCookie(name) {
      var cookie_value = '';
      var current_cookie = '';
      var name_and_equal = name + '=';
      var all_cookies = document.cookie.split(';');
      var number_of_cookies = all_cookies.length;

      for (var i = 0; i < number_of_cookies; i++) {
        current_cookie = all_cookies[i].trim();
        if (current_cookie.indexOf(name_and_equal) == 0) {
          cookie_value = current_cookie.substring(
            name_and_equal.length,
            current_cookie.length
          );
          break;
        }
      }

      return cookie_value;
    }

    /**
     * Disable the Payment radio depending
     * if Paypal or Bitcoin is selected
     */
    function disablePaymentRadio() {
      var payment_type = $('input[name=type]:radio:checked').val();
      if (payment_type === 'paypal') {
        $('input[name=subscription]').attr('disabled', false);
      } else {
        $('input[name=subscription]').attr('disabled', true);
      }
      var credit_process_url = $('input[name=credit_process_url]').val();
      if (payment_type === 'credit' && credit_process_url) {
        $('#donation_default_eclipse_form').attr('action', credit_process_url);
      } else {
        var default_process_url = $('input[name=default_process_url]').val();
        if (default_process_url) {
          $('#donation_default_eclipse_form').attr(
            'action',
            default_process_url
          );
        }
        $('#subscription_default').prop('checked', true);
      }
    }

    // Disable the Bitcoin radio if the page loads and it is selected.
    disablePaymentRadio();

    // Make changes when the user chooses either Paypal or Bitcoin
    $('input[name=type]:radio').change(function (e) {
      disablePaymentRadio();
    });

    $('.btn-donate-close').click(function () {
      // The cookie name based on what has been set in the settings
      var cookie_name = eclipse_org_common.settings.cookies_class.name;

      // The JSON decoded value of the cookie
      // fetched based on the cookie_name variable
      var cookie = jQuery.parseJSON(unescape(fetchCookie(cookie_name)));

      // Set the path
      var path = '/';

      // Set the banner as NOT visible
      cookie.donation_banner.value.visible = 0;

      // Make a string out of the object
      cookie = JSON.stringify(cookie);

      // Create the cookie
      createCookie(cookie_name, cookie, path);

      // Make the banner slide up
      $('.donate-ad').slideUp(300);
    });
  });
})(jQuery, document);

export default eclipseFdnEclipseDonate;