// Enquiry form. Nothing is sent from the prototype; the live site posts to reception.
(function () {
  var form = document.getElementById('enquiry-form');
  if (!form) return;
  var sent = document.getElementById('enquiry-sent');
  function check(id, message) {
    var input = document.getElementById(id);
    var error = document.getElementById(id + '-error');
    var bad = !input.value.trim();
    input.setAttribute('aria-invalid', String(bad));
    error.textContent = bad ? message : '';
    error.hidden = !bad;
    return bad ? input : null;
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var nameBad = check('enquiry-name', 'Please add your name so we know who to ask for.');
    var phoneBad = check('enquiry-phone', 'Please add a phone number so reception can call you back.');
    var firstBad = nameBad || phoneBad;
    if (firstBad) { firstBad.focus(); return; }
    form.hidden = true;
    sent.hidden = false;
    sent.focus();
  });
})();
