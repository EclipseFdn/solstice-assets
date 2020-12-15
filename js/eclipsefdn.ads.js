$(document).ready(function() {
  $(".eclipsefnd-ad-js-plugin").eclipseFdnApi({
    type: "singlePromo"
  });

  $("body").on("shown.ef.ads", function(e) {
    $(".match-height-item-by-row-home").matchHeight();
    $.fn.matchHeight._applyDataApi();
  })
});