document.addEventListener('DOMContentLoaded', function () {
    // Abas do painel administrativo
                            var tabs = document.querySelectorAll('.panel-tab');
    if (tabs.length) {
          tabs.forEach(function (tab) {
                  tab.addEventListener('click', function () {
                            tabs.forEach(function (t) { t.classList.remove('is-active'); });
                            tab.classList.add('is-active');
                            var target = tab.getAttribute('data-tab');
                            document.querySelectorAll('.tab-panel').forEach(function (panel) {
                                        panel.style.display = (panel.id === 'tab-' + target) ? '' : 'none';
                            });
                  });
          });
    }

                            // Seleção de visibilidade da obra (perfil do autor)
                            var visOptions = document.querySelectorAll('.vis-option');
    if (visOptions.length) {
          visOptions.forEach(function (opt) {
                  opt.addEventListener('click', function () {
                            visOptions.forEach(function (o) { o.classList.remove('is-selected'); });
                            opt.classList.add('is-selected');
                  });
          });
    }
});
