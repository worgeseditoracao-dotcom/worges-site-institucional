// Menu mobile
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('mainNav');
      if (toggle && nav) {
          toggle.addEventListener('click', function () {
                nav.classList.toggle('is-open');
                    });
                      }

                        // Filtro do catálogo (se existir na página)
                          var filterBtns = document.querySelectorAll('.filter-btn');
                            var books = document.querySelectorAll('.book-card');
                              if (filterBtns.length && books.length) {
                                  filterBtns.forEach(function (btn) {
                                        btn.addEventListener('click', function () {
                                                filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
                                                        btn.classList.add('is-active');
                                                                var filter = btn.getAttribute('data-filter');
                                                                        books.forEach(function (card) {
                                                                                  if (filter === 'todos' || card.getAttribute('data-type') === filter) {
                                                                                              card.style.display = '';
                                                                                                        } else {
                                                                                                                    card.style.display = 'none';
                                                                                                                              }
                                                                                                                                      });
                                                                                                                                            });
                                                                                                                                                });
                                                                                                                                                  }
                                                                                                                                                  
                                                                                                                                                  });
                                                                                                                                                  
