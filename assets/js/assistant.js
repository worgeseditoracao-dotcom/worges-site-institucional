(function () {
    var chatBody = document.getElementById('chatBody');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var uploadRow = document.getElementById('uploadRow');
    var fileInput = document.getElementById('fileInput');

   chatInput.disabled = true;
    chatSend.disabled = true;

   var PRICES = {
         ebook_sem: { label: 'E-book sem diagramação', fixed: 249.90 },
         ebook_com: { label: 'E-book com diagramação', 60: 269.90, 150: 329.90, 300: 349.90 },
         impressao: { label: 'Arquivo para impressão', 60: 289.90, 150: 339.90, 300: 379.90 },
         completo: { label: 'Pacote Completo (e-book + impressão)', 60: 329.90, 150: 349.90, 300: 389.90 }
   };

   function fmt(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }
    function nowStr() {
          var d = new Date();
          return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }
    function scrollDown() { chatBody.scrollTop = chatBody.scrollHeight; }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

   function addBubble(text, who) {
         var row = document.createElement('div');
         row.className = 'bubble-row ' + who;
         var b = document.createElement('div');
         b.className = 'bubble';
         b.innerHTML = text + '<span class="time">' + nowStr() + '</span>';
         row.appendChild(b);
         chatBody.appendChild(row);
         scrollDown();
         return row;
   }

   async function bot(lines) {
         if (typeof lines === 'string') lines = [lines];
         for (var i = 0; i < lines.length; i++) {
                 var typingRow = document.createElement('div');
                 typingRow.className = 'bubble-row bot typing-row';
                 typingRow.innerHTML = '<div class="typing-bubble"><span></span><span></span><span></span></div>';
                 chatBody.appendChild(typingRow);
                 scrollDown();
                 await wait(600 + Math.min(lines[i].length * 12, 1200));
                 typingRow.remove();
                 addBubble(lines[i], 'bot');
                 await wait(150);
         }
   }

   function user(text) { addBubble(text, 'user'); }

   function quickReplies(options) {
         return new Promise(function (resolve) {
                 var wrap = document.createElement('div');
                 wrap.className = 'quick-replies';
                 options.forEach(function (opt) {
                           var btn = document.createElement('button');
                           btn.className = 'quick-btn';
                           btn.textContent = opt;
                           btn.addEventListener('click', function () {
                                       Array.from(wrap.children).forEach(function (c) { c.disabled = true; });
                                       wrap.style.opacity = '.5';
                                       user(opt);
                                       resolve(opt);
                           });
                           wrap.appendChild(btn);
                 });
                 chatBody.appendChild(wrap);
                 scrollDown();
         });
   }

   function textInput(placeholder) {
         return new Promise(function (resolve) {
                 chatInput.disabled = false;
                 chatSend.disabled = false;
                 chatInput.placeholder = placeholder;
                 chatInput.focus();

                                  function submit() {
                                            var val = chatInput.value.trim();
                                            if (!val) return;
                                            chatInput.removeEventListener('keydown', onKey);
                                            chatSend.removeEventListener('click', submit);
                                            chatInput.value = '';
                                            chatInput.disabled = true;
                                            chatSend.disabled = true;
                                            chatInput.placeholder = 'Digite sua mensagem...';
                                            user(val);
                                            resolve(val);
                                  }
                 function onKey(e) { if (e.key === 'Enter') submit(); }

                                  chatInput.addEventListener('keydown', onKey);
                 chatSend.addEventListener('click', submit);
         });
   }

   function showUpload() {
         return new Promise(function (resolve) {
                 uploadRow.style.display = 'block';
                 fileInput.value = '';
                 fileInput.onchange = function () {
                           if (fileInput.files && fileInput.files[0]) {
                                       uploadRow.style.display = 'none';
                                       resolve(fileInput.files[0]);
                           }
                 };
         });
   }

   function pageBucket(pages) {
         if (pages <= 60) return 60;
         if (pages <= 150) return 150;
         return 300;
   }

   function priceFor(pkgKey, bucket) {
         var p = PRICES[pkgKey];
         return p.fixed !== undefined ? p.fixed : p[bucket];
   }

   async function extractPdfPages(file) {
         try {
                 var buf = await file.arrayBuffer();
                 var pdf = await window['pdfjsLib'].getDocument({ data: buf }).promise;
                 return pdf.numPages;
         } catch (e) { return null; }
   }

   async function extractDocxPages(file) {
         try {
                 var buf = await file.arrayBuffer();
                 var result = await window.mammoth.extractRawText({ arrayBuffer: buf });
                 var words = result.value.trim().split(/\s+/).filter(Boolean).length;
                 return Math.max(1, Math.round(words / 250));
         } catch (e) { return null; }
   }

   function paymentAction(pkgLabel, price) {
         var row = document.createElement('div');
         row.className = 'bubble-row bot';
         row.innerHTML =
                 '<div class="bubble" style="max-width:88%;">' +
                 '<strong>' + pkgLabel + '</strong><br>Valor: ' + fmt(price) +
                 '<br><br><button class="btn btn--gold" style="width:100%; justify-content:center;" id="payBtn">Gerar link de pagamento</button>' +
                 '</div>';
         chatBody.appendChild(row);
         scrollDown();
         document.getElementById('payBtn').addEventListener('click', function () {
                 alert('Aqui entraria o link de pagamento real do Mercado Pago (integração da próxima fase do projeto).');
         });
   }

   async function leadCapture(pkgKey, price, emailOnly) {
         var pkgLabel = PRICES[pkgKey].label;
         await bot(['Que alegria! 🎉', 'Pra eu deixar isso certinho, preciso de alguns dados rapidinho.']);
         var name = await textInput('Seu nome...');
         await bot(['Prazer, ' + name.split(' ')[0] + '! 😊', 'Qual o título da sua obra (ou uma ideia de título)?']);
         var title = await textInput('Título da obra...');
         await bot(['Show! E o seu e-mail?']);
         var email = await textInput('seuemail@exemplo.com');
         await bot(['E um telefone/WhatsApp com DDD, pra qualquer contato rápido:']);
         var phone = await textInput('(00) 00000-0000');

      await bot(['Perfeito, anotei tudo aqui! ✅']);

      if (emailOnly) {
              await bot(['Vou te enviar esse orçamento (' + pkgLabel + ' — ' + fmt(price) + ') no e-mail ' + email + '.', 'Assim que quiser seguir, é só voltar aqui comigo, tá bom? 😊']);
      } else {
              await bot(['Aqui está o resumo do seu orçamento:']);
              paymentAction(pkgLabel, price);
              await bot(['Assim que o pagamento for confirmado, já te mando o questionário editorial e a gente começa o processo do seu livro!', 'Qualquer dúvida durante o caminho, pode falar comigo por aqui, viu? Vou acompanhar você em cada etapa. 💛']);
      }
   }

   async function objectionThenLead(pkgKey, price) {
         var choice = await quickReplies(['Quero fechar agora!', 'Quero pensar um pouco']);
         if (choice === 'Quero pensar um pouco') {
                 await bot(['Entendo super! Só um detalhe: esse valor é válido só por hoje, porque nossos preços são reajustados periodicamente.', 'Mas fica tranquilo(a), não precisa decidir agora. Posso te mandar esse orçamento por e-mail, pra você analisar com calma?']);
                 var wantsEmail = await quickReplies(['Sim, me manda por e-mail', 'Não, por enquanto não']);
                 if (wantsEmail === 'Sim, me manda por e-mail') {
                           await leadCapture(pkgKey, price, true);
                 } else {
                           await bot(['Sem problema! Qualquer coisa é só voltar aqui, tá bom? 😊']);
                 }
         } else {
                 await leadCapture(pkgKey, price, false);
         }
   }

   async function askPackage() {
         await bot('Qual desses pacotes combina mais com o que você imagina pro seu livro?');
         var pkgLabelToKey = {
                 'E-book sem diagramação (já tenho o arquivo pronto)': 'ebook_sem',
                 'E-book com diagramação': 'ebook_com',
                 'Arquivo para impressão': 'impressao',
                 'Pacote Completo (e-book + impressão)': 'completo'
         };
         var choice = await quickReplies(Object.keys(pkgLabelToKey));
         return pkgLabelToKey[choice];
   }

   async function flowNoFile() {
         await bot(['Sem problema, isso é super comum por aqui! 😉']);
         var pkgKey = await askPackage();

      if (PRICES[pkgKey].fixed !== undefined) {
              var price = PRICES[pkgKey].fixed;
              await bot(['Esse pacote tem valor fixo: ' + fmt(price) + ' 📌', 'Já inclui ISBN digital, ficha catalográfica, capa profissional, QR Code e conselho editorial.']);
              await objectionThenLead(pkgKey, price);
              return;
      }

      await bot(['Você tem uma ideia de mais ou menos quantas páginas sua obra deve ter quando estiver pronta?']);
         var range = await quickReplies(['Até 60 páginas', 'Até 150 páginas', '300 páginas ou mais']);
         var bucket = range.indexOf('60') > -1 ? 60 : (range.indexOf('150') > -1 ? 150 : 300);
         var price2 = priceFor(pkgKey, bucket);
         await bot(['Com base nessa faixa, o investimento fica em torno de ' + fmt(price2) + ' 📌', 'Esse valor é uma estimativa — assim que você tiver o arquivo final em Word, a gente confirma certinho, sem surpresas.']);
         await objectionThenLead(pkgKey, price2);
   }

   async function flowWithFile() {
         await bot(['Ótimo! Pode anexar o arquivo aqui mesmo — aceito Word (.docx) ou PDF. 📎']);
         var file = await showUpload();
         user('📎 ' + file.name);

      var isPdf = /\.pdf$/i.test(file.name);
         var isDocx = /\.docx$/i.test(file.name);

      if (isPdf) {
              await bot(['Recebi seu arquivo, obrigada! 📄']);
              var pages = await extractPdfPages(file);
              if (pages) await bot(['Encontrei ' + pages + ' páginas nesse PDF.']);
              await bot([
                        'Só um detalhe importante: consigo usar esse PDF pra te dar uma estimativa de valor, mas quando formos pra produção mesmo, vamos precisar do arquivo em Word.',
                        'Isso porque no Word a gente reconhece capítulos e subtítulos certinho — faz toda diferença na hora da diagramação.',
                        'Se quiser, te mando um modelo já formatado depois, é só colar seu texto lá. 😉'
                      ]);
              var pkgKey = await askPackage();
              var bucket = pages ? pageBucket(pages) : 150;
              var price = priceFor(pkgKey, bucket);
              await bot(['Com base nisso, o valor estimado fica em ' + fmt(price) + ' 📌', 'Esse valor é uma estimativa até chegar o arquivo em Word.']);
              await objectionThenLead(pkgKey, price);

      } else if (isDocx) {
              await bot(['Perfeito, recebi seu arquivo em Word! ✅']);
              var pages2 = await extractDocxPages(file);
              if (pages2) await bot(['Encontrei aproximadamente ' + pages2 + ' páginas.']);
              var pkgKey2 = await askPackage();
              var bucket2 = pages2 ? pageBucket(pages2) : 150;
              var price2 = priceFor(pkgKey2, bucket2);
              await bot(['Baseado nisso, o valor fica em ' + fmt(price2) + ' 📌', 'Esse já é bem próximo do valor final — na virada pra produção, nossa equipe só confirma certinho na diagramação.']);
              await objectionThenLead(pkgKey2, price2);

      } else {
              await bot(['Hmm, esse formato eu não consigo ler por aqui. Pode mandar em Word (.docx) ou PDF?']);
              await flowWithFile();
      }
   }

   async function start() {
         await bot(['Oi! Tudo bem? 😊', 'Que bom que você chegou até aqui — sou a Larissa, consultora editorial da Worges.']);
         await bot('Me conta uma coisa: você já tem o texto do seu livro pronto, ou ainda está organizando as ideias?');
         var choice = await quickReplies(['Já tenho o arquivo pronto', 'Ainda não tenho o arquivo']);
         if (choice === 'Já tenho o arquivo pronto') await flowWithFile();
         else await flowNoFile();
   }

   start();
})();
