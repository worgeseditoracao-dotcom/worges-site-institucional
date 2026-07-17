document.addEventListener('DOMContentLoaded', function () {
    var prices = {
          ebook_sem: { fixed: 249.90 },
          ebook_com: { 60: 269.90, 150: 329.90, 300: 349.90 },
          impressao: { 60: 289.90, 150: 339.90, 300: 379.90 },
          completo: { 60: 329.90, 150: 349.90, 300: 389.90 }
    };

                            var pkgBtns = document.querySelectorAll('#packageOptions .range-btn');
    var rangeBtns = document.querySelectorAll('#rangeOptions .range-btn');
    var rangeWrapper = document.getElementById('rangeWrapper');
    var resultBox = document.getElementById('estimatorResult');
    var resultValue = document.getElementById('estimatorValue');

                            var currentPkg = 'ebook_sem';
    var currentRange = '60';

                            function formatBRL(v) {
                                  return 'R$ ' + v.toFixed(2).replace('.', ',');
                            }

                            function update() {
                                  var pkgData = prices[currentPkg];

      if (pkgData.fixed !== undefined) {
              rangeWrapper.style.opacity = '0.4';
              rangeWrapper.style.pointerEvents = 'none';
              resultValue.textContent = formatBRL(pkgData.fixed) + ' (valor fixo, não varia por página)';
      } else {
              rangeWrapper.style.opacity = '1';
              rangeWrapper.style.pointerEvents = 'auto';
              var value = pkgData[currentRange];
              resultValue.textContent = formatBRL(value);
      }
                                  resultBox.classList.add('is-visible');
                            }

                            pkgBtns.forEach(function (btn) {
                                  btn.addEventListener('click', function () {
                                          pkgBtns.forEach(function (b) { b.classList.remove('is-active'); });
                                          btn.classList.add('is-active');
                                          currentPkg = btn.getAttribute('data-pkg');
                                          update();
                                  });
                            });

                            rangeBtns.forEach(function (btn) {
                                  btn.addEventListener('click', function () {
                                          rangeBtns.forEach(function (b) { b.classList.remove('is-active'); });
                                          btn.classList.add('is-active');
                                          currentRange = btn.getAttribute('data-range');
                                          update();
                                  });
                            });
});
