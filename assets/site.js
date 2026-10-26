// Enquiry form. Posts to the practice's Google Sheet; without one set up,
// it opens the visitor's email app with the enquiry written out.
(function () {
  var form = document.getElementById('enquiry-form');
  if (!form) return;
  var sent = document.getElementById('enquiry-sent');
  var detail = document.getElementById('enquiry-sent-detail');
  var button = form.querySelector('button[type="submit"]');
  function value(id) { return document.getElementById(id).value.trim(); }
  function check(id, message) {
    var input = document.getElementById(id);
    var error = document.getElementById(id + '-error');
    var bad = !input.value.trim();
    input.setAttribute('aria-invalid', String(bad));
    error.textContent = bad ? message : '';
    error.hidden = !bad;
    return bad ? input : null;
  }
  function done(title, message) {
    if (title) document.getElementById('enquiry-sent-title').textContent = title;
    if (message) detail.textContent = message;
    form.hidden = true;
    sent.hidden = false;
    sent.focus();
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var nameBad = check('enquiry-name', 'Please add your name so we know who to ask for.');
    var phoneBad = check('enquiry-phone', 'Please add a phone number so reception can call you back.');
    var firstBad = nameBad || phoneBad;
    if (firstBad) { firstBad.focus(); return; }

    var fields = {
      name: value('enquiry-name'), phone: value('enquiry-phone'), email: value('enquiry-email'),
      about: value('enquiry-about'), clinic: value('enquiry-clinic'), message: value('enquiry-message')
    };
    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) {
      var body = 'Name: ' + fields.name + '\nPhone: ' + fields.phone + '\nEmail: ' + fields.email +
        '\nAbout: ' + fields.about + '\nPreferred clinic: ' + fields.clinic + '\n\n' + fields.message;
      window.location.href = 'mailto:' + form.getAttribute('data-email') +
        '?subject=' + encodeURIComponent('Website enquiry from ' + fields.name) +
        '&body=' + encodeURIComponent(body);
      done('Almost done.', 'Your email app should open with your enquiry written out. Press send there, or call us instead.');
      return;
    }
    button.disabled = true;
    button.textContent = 'Sending…';
    fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(fields) })
      .then(function () { done(); })
      .catch(function () {
        button.disabled = false;
        button.textContent = 'Send enquiry';
        var error = document.getElementById('enquiry-phone-error');
        error.textContent = 'The enquiry did not send. Please check your connection and try again, or call us.';
        error.hidden = false;
      });
  });
})();
