$(function () {

    $('.eclipsefdn-promo-content').each(function (index, element) {
  
      const formats = {};
      if ($(element).attr('data-ad-format').indexOf(",")) {
        const format_array = $(element).attr('data-ad-format').split(",");
        $(format_array).each(function(item, format){
          formats[format] = "1";
        });
      }
      else {
        formats[$(element).attr('data-ad-format')] = "1";
      }
      
      const params = {
        host: window.location.host,
        source: window.location.pathname,
        publish_to: $(element).attr('data-ad-publish-to'),
        format: formats
      };
  
      $.ajax('https://newsroom.eclipse.org/api/ads/', {
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(params),
        success: function (data) {
          for (var i = 0; i < data.length; i++) {
            const url = data[i].url;
            const campaign_name = data[i].campaign_name;
            const image = data[i].image;
            if (url && campaign_name && image) {
              $(element).prepend(
                '<a href="' + url + '" rel="nofollow"><img alt="' + campaign_name + '" src="' + image +'" class="img-responsive center-block"></a>'
              );
            }
          }
        },
        error: function () {
          console.log('Could not load eclipsefdn-promo-content content.');
        },
      });
    });
});
  