(function() {
  if (typeof document.querySelectorAll === "undefined") {
    return;
  }
  
  window.addEventListener('beforeunload', function(e) {
    findUnsubmittedForms().forEach(function(it) {
      if (typeof ga === "function") {
        var tracker = ga.getAll()[0].get('name');
        ga(tracker + '.send', 'event', {
          'event' : 'formAbandonment',
          'eventCategory': 'form-abandonment-tracker',
          'eventAction': window.location.href,
          'eventLabel': it.id + ": " + it.history.join(" > ")
        });
      }
    });
  });

  var history = {}

  window.addEventListener("load", function() {
    document.addEventListener("change", function(e) {
      var target = e.target
      if (target && target.tagName && (target.tagName.toUpperCase() == "INPUT" || target.tagName.toUpperCase() == "TEXTAREA" || target.tagName.toUpperCase() == "SELECT")) {
        var inputName = target.getAttribute("name")
        var form = target.form
        if (form && inputName) {
          var formIdentifier = form.getAttribute("id");
          if (!formIdentifier) {
            formIdentifier = form.getAttribute("name");
          }
          if (formIdentifier) {
            if (typeof history[formIdentifier] == "undefined") {
              history[formIdentifier] = [];
            }
            if (history[formIdentifier].slice(-1) != inputName) {
              var inputName = inputName.replace(/\[und\]/i, "");
              history[formIdentifier].push(inputName);
            }
          }
        }
      }
    });
  });

  function findUnsubmittedForms() {
    return Object.keys(history).filter(hasNoFormSubmitEvent(window.dataLayer)).map(findFormFromHistory).filter(notEmpty);
  }

  function hasNoFormSubmitEvent(dataLayer) {
    return function(id) {
      return dataLayer.filter(isFormSubmitEvent).map(getFormName).indexOf(id) == -1;
    }
  }

  function isFormSubmitEvent(e) {
    return e.event === 'gtm.formSubmit';
  }

  function getFormName(e) {
    return e['gtm.element'].name;
  }

  function findFormFromHistory(id) {
    return {
      id: id,
      history: (history[id] || [])
    }
  }

  function notEmpty(form) {
    return form.history.length > 0;
  }

})()