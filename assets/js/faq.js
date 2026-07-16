document.addEventListener('DOMContentLoaded', function () {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
          var q = item.querySelector('.faq-q');
          q.addEventListener('click', function () {
                  var wasOpen = item.classList.contains('is-open');
                  items.forEach(function (i) { i.classList.remove('is-open'); });
                  if (!wasOpen) item.classList.add('is-open');
          });
    });
});
