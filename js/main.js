/* =====================================================================
   TRANSPORTES LUCAS — COMPORTAMENTO DO SITE
   Depende de js/config.js (objeto global window.TL).
   Vanilla JS, sem dependências.
   ===================================================================== */
(function () {
  'use strict';

  var TL = window.TL;
  if (!TL) { console.error('[TL] js/config.js não carregou.'); return; }

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  var SEM_MOVIMENTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     WHATSAPP
     =================================================================== */
  function linkZap(texto) {
    var num = String(TL.contato.whatsappLink || '').replace(/\D/g, '');
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(texto || TL.mensagens.padrao);
  }

  function abrirZap(texto) {
    window.open(linkZap(texto), '_blank', 'noopener');
  }

  /* ===================================================================
     NÚMEROS — faixa "Nossa estrutura"
     =================================================================== */
  function montarNumeros() {
    var ul = $('#listaNumeros');
    if (!ul) return;

    (TL.numeros || []).forEach(function (n) {
      var li = document.createElement('li');
      li.className = 'num';
      li.innerHTML =
        '<span class="num__v" data-alvo="' + n.valor + '" data-sufixo="' + (n.sufixo || '') + '">' +
        n.valor + (n.sufixo || '') + '</span>' +
        '<span class="num__r">' + n.rotulo + '</span>' +
        (n.nota ? '<span class="num__n">' + n.nota + '</span>' : '');
      ul.appendChild(li);
    });

    if (SEM_MOVIMENTO || !('IntersectionObserver' in window)) return;

    var obs = new IntersectionObserver(function (ens, o) {
      ens.forEach(function (en) {
        if (!en.isIntersecting) return;
        o.unobserve(en.target);
        contar(en.target);
      });
    }, { threshold: .5 });
    $$('.num__v', ul).forEach(function (el) { obs.observe(el); });
  }

  function contar(el) {
    var alvo = parseInt(el.dataset.alvo, 10);
    var suf = el.dataset.sufixo || '';
    if (isNaN(alvo)) return;
    var dur = 1300, t0 = null;

    function passo(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);                 // easeOutCubic
      el.textContent = Math.round(alvo * e) + suf;
      if (p < 1) requestAnimationFrame(passo);
      // ao terminar, nada de transform/opacity fica no elemento
    }
    el.textContent = '0' + suf;
    requestAnimationFrame(passo);
  }

  /* ===================================================================
     FROTA — lista de modalidades troca a foto do palco
     =================================================================== */
  function montarFrota() {
    var lista = $('#frotaLista');
    var foto = $('#frotaFoto');
    var nome = $('#frotaNome');
    var selo = $('#frotaSelo');
    var contador = $('#frotaContador');
    var itens = TL.frota || [];
    if (!lista || !foto || !itens.length) return;

    function doisDigitos(n) { return (n < 10 ? '0' : '') + n; }

    function selecionar(i) {
      var m = itens[i];
      foto.src = m.foto;
      foto.alt = m.alt;
      nome.textContent = m.nome;
      selo.textContent = m.selo;
      contador.textContent = doisDigitos(i + 1) + '/' + doisDigitos(itens.length);
      $$('.fcard', lista).forEach(function (c, j) {
        c.setAttribute('aria-selected', String(j === i));
        c.tabIndex = j === i ? 0 : -1;
      });
    }

    itens.forEach(function (m, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'presentation');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fcard';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === 0));
      b.tabIndex = i === 0 ? 0 : -1;
      b.innerHTML =
        '<span class="fcard__n">' + doisDigitos(i + 1) + '</span>' +
        '<span class="fcard__h">' + m.nome + '</span>' +
        '<span class="fcard__p">' + m.resumo + '</span>';
      b.addEventListener('click', function () { selecionar(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        var prox = (i + (e.key === 'ArrowDown' ? 1 : -1) + itens.length) % itens.length;
        selecionar(prox);
        $$('.fcard', lista)[prox].focus();
      });
      li.appendChild(b);
      lista.appendChild(li);
    });

    selecionar(0);
  }

  /* ===================================================================
     COBERTURA — lista de estados + mapa
     =================================================================== */
  // Centros visuais dos estados no viewBox "0 0 1000 972" do SVG do mapa.
  var CENTROS = {
    SP: [632, 696], MG: [698, 589], RJ: [736, 688], PR: [547, 752], SC: [557, 805],
    RS: [499, 877], MT: [422, 492], MS: [448, 635], BA: [768, 460], PE: [865, 341]
  };

  function montarCobertura() {
    var lista = $('#listaUfs');
    var svg = $('#mapaBrasil');
    var pinos = $('#mapaPinos');
    var estados = TL.estados || [];

    if (lista) {
      estados.forEach(function (e) {
        var li = document.createElement('li');
        li.className = 'uf-item';
        li.dataset.uf = e.uf;
        li.innerHTML =
          '<span class="uf-item__sig">' + e.uf + '</span>' +
          '<span class="uf-item__nome">' + e.nome + '</span>';
        lista.appendChild(li);
      });
    }

    if (!svg) return;

    estados.forEach(function (e) {
      var path = svg.querySelector('#uf-' + e.uf);
      if (!path) { console.warn('[TL] estado sem path no mapa: ' + e.uf); return; }
      path.classList.add('on');

      var t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      t.textContent = e.nome;
      path.appendChild(t);

      var c = CENTROS[e.uf];
      if (c && pinos) {
        var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', c[0]);
        txt.setAttribute('y', c[1] + 9);
        txt.textContent = e.uf;
        pinos.appendChild(txt);
      }
    });

    function realce(uf, on) {
      var p = svg.querySelector('#uf-' + uf);
      var i = lista && lista.querySelector('[data-uf="' + uf + '"]');
      if (p) p.classList.toggle('realce', on);
      if (i) i.classList.toggle('ativo', on);
    }

    $$('.uf-item', lista).forEach(function (item) {
      var uf = item.dataset.uf;
      item.addEventListener('mouseenter', function () { realce(uf, true); });
      item.addEventListener('mouseleave', function () { realce(uf, false); });
    });

    estados.forEach(function (e) {
      var p = svg.querySelector('#uf-' + e.uf);
      if (!p) return;
      p.addEventListener('mouseenter', function () { realce(e.uf, true); });
      p.addEventListener('mouseleave', function () { realce(e.uf, false); });
      p.addEventListener('click', function () { abrirModal('Consulta de rota — ' + e.nome); });
    });
  }

  /* ===================================================================
     UNIDADES
     =================================================================== */
  function linkMapa(u) {
    var q = [u.logradouro, u.bairro, u.cidade + ' - ' + u.uf, u.cep]
      .filter(Boolean).join(', ');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  function montarUnidades() {
    var ul = $('#listaUnidades');
    if (!ul) return;
    var c = TL.contato;

    (TL.unidades || []).forEach(function (u) {
      var li = document.createElement('div');
      li.className = 'uni';

      var linhas = '';

      if (u.logradouro) {
        linhas += '<p class="uni__l"><svg class="ic" aria-hidden="true"><use href="#i-local"/></svg>' +
          '<span><a href="' + linkMapa(u) + '" target="_blank" rel="noopener">' +
          u.logradouro + '<br>' + u.bairro + ' · ' + u.cidade + '/' + u.uf +
          '<br>CEP ' + u.cep + '</a></span></p>';
      } else {
        // sem logradouro no config: não repete a cidade, que já está no título
        linhas += '<p class="uni__l"><svg class="ic" aria-hidden="true"><use href="#i-local"/></svg>' +
          '<span><em>Endereço completo a confirmar</em></span></p>';
      }

      if (u.principal) {
        linhas += '<p class="uni__l"><svg class="ic" aria-hidden="true"><use href="#i-atendimento"/></svg>' +
          '<span><a href="tel:' + c.telefoneFixoLink + '">' + c.telefoneFixo + '</a></span></p>';
        linhas += '<p class="uni__l"><svg class="ic" aria-hidden="true"><use href="#i-relogio"/></svg>' +
          '<span>' + (TL.horario.linhas || []).join('<br>') + '</span></p>';
      }

      if (u.observacao) {
        linhas += '<p class="uni__l"><svg class="ic" aria-hidden="true"><use href="#i-rota"/></svg>' +
          '<span>' + u.observacao + '</span></p>';
      }

      li.innerHTML =
        '<span class="uni__tag">' + u.tipo + '</span>' +
        '<h3 class="uni__h3">' + u.cidade + '/' + u.uf + '</h3>' + linhas;
      ul.appendChild(li);
    });
  }

  /* ===================================================================
     CONTATO
     =================================================================== */
  function bloco(icone, rotulo, valorHtml) {
    return '<li class="info">' +
      '<span class="info__ic"><svg class="ic" aria-hidden="true"><use href="#' + icone + '"/></svg></span>' +
      '<div class="info__cnt"><p class="info__r">' + rotulo + '</p><p class="info__v">' + valorHtml + '</p></div>' +
      '</li>';
  }

  // canais diretos da seção Contato (telefone, WhatsApp, e-mail)
  function canal(icone, rotulo, valorHtml) {
    return '<li class="canal">' +
      '<span class="canal__ic"><svg class="ic" aria-hidden="true"><use href="#' + icone + '"/></svg></span>' +
      '<div class="canal__cnt"><p class="canal__r">' + rotulo + '</p><p class="canal__v">' + valorHtml + '</p></div>' +
      '</li>';
  }

  function montarContatos() {
    var c = TL.contato;
    var matriz = (TL.unidades || []).filter(function (u) { return u.principal; })[0];

    var emails = (c.emails || []).map(function (e) {
      return '<a href="mailto:' + e + '">' + e + '</a>';
    }).join('<br>');

    var endereco = '';
    if (matriz) {
      endereco = '<a href="' + linkMapa(matriz) + '" target="_blank" rel="noopener">' +
        matriz.logradouro + '<br>' + matriz.bairro + ' · ' + matriz.cidade + '/' + matriz.uf +
        '<br>CEP ' + matriz.cep + '</a>';
    }

    var canais = $('#listaCanais');
    if (canais) {
      canais.innerHTML =
        canal('i-atendimento', 'Telefone', '<a href="tel:' + c.telefoneFixoLink + '">' + c.telefoneFixo + '</a>') +
        canal('i-whats', 'WhatsApp',
          '<a href="' + linkZap(TL.mensagens.padrao) + '" target="_blank" rel="noopener">' + c.whatsapp + '</a>') +
        canal('i-email', 'E-mail', emails);
    }

    var rodape = $('#rodapeContato');
    if (rodape) {
      var rh = '<ul class="infos">';
      rh += bloco('i-atendimento', 'Telefone', '<a href="tel:' + c.telefoneFixoLink + '">' + c.telefoneFixo + '</a>');
      rh += bloco('i-whats', 'WhatsApp',
        '<a href="' + linkZap(TL.mensagens.padrao) + '" target="_blank" rel="noopener">' + c.whatsapp + '</a>');
      rh += bloco('i-email', 'E-mail', emails);
      if (matriz) rh += bloco('i-local', 'Endereço', endereco);
      rh += bloco('i-relogio', 'Horário', (TL.horario.linhas || []).join('<br>'));
      rh += '</ul>';
      rodape.innerHTML = rodape.innerHTML + rh;
    }
  }

  function montarRedes() {
    var ul = $('#redesSociais');
    if (!ul) return;
    var mapa = { instagram: 'i-instagram', facebook: 'i-facebook', linkedin: 'i-linkedin' };
    var nomes = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn' };
    var html = '';
    Object.keys(mapa).forEach(function (k) {
      var url = (TL.redes || {})[k];
      if (!url) return;
      html += '<li><a href="' + url + '" target="_blank" rel="noopener" aria-label="' + nomes[k] + '">' +
        '<svg class="ic" aria-hidden="true"><use href="#' + mapa[k] + '"/></svg></a></li>';
    });
    ul.innerHTML = html;
    if (!html) ul.remove();
  }

  /* ===================================================================
     HEADER
     =================================================================== */
  function header() {
    var topo = $('#topo');
    var hamb = $('#hamb');
    var menu = $('#menu');

    var aoRolar = function () { topo.classList.toggle('rolou', window.scrollY > 24); };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });

    function fecharMenu() {
      menu.classList.remove('aberto');
      hamb.setAttribute('aria-expanded', 'false');
      hamb.setAttribute('aria-label', 'Abrir menu');
      document.body.classList.remove('trava');
    }

    hamb.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      hamb.setAttribute('aria-expanded', String(aberto));
      hamb.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('trava', aberto);
    });

    $$('#menu a').forEach(function (a) { a.addEventListener('click', fecharMenu); });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) { fecharMenu(); hamb.focus(); }
    });
    window.matchMedia('(min-width: 981px)').addEventListener('change', fecharMenu);

    var links = $$('#menu .menu__lista a');
    var secoes = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if (!secoes.length || !('IntersectionObserver' in window)) return;

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('ativo', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secoes.forEach(function (s) { obs.observe(s); });
  }

  /* ===================================================================
     ANIMAÇÕES DE ENTRADA
     =================================================================== */
  function revelar() {
    var alvos = $$('.anim');

    if (SEM_MOVIMENTO || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.remove('anim'); });
      return;
    }

    // Depois que a transição termina, tiramos .anim/.vis do elemento.
    // Sem opacity nem transform ele sai da camada composta do Chrome e volta
    // ao antialiasing subpixel — é o que mantém o texto nítido.
    function limpar(el) {
      el.classList.remove('anim', 'vis');
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
    }

    var obs = new IntersectionObserver(function (ens, o) {
      ens.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        o.unobserve(el);
        el.classList.add('vis');

        var feito = false;
        var fim = function () {
          if (feito) return;
          feito = true;
          el.removeEventListener('transitionend', fim);
          limpar(el);
        };
        el.addEventListener('transitionend', fim);
        // rede de segurança caso o transitionend não dispare (aba em segundo plano)
        setTimeout(fim, 1100);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ===================================================================
     CARROSSEL DE SERVIÇOS
     =================================================================== */
  function carrossel() {
    var trilho = $('#trilhoServicos');
    if (!trilho) return;
    var botoes = $$('[data-carro]');

    function passo() {
      var card = trilho.querySelector('.serv');
      if (!card) return trilho.clientWidth * .8;
      var gap = parseFloat(getComputedStyle(trilho).columnGap || '16') || 16;
      return card.getBoundingClientRect().width + gap;
    }

    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = b.dataset.carro === 'prox' ? 1 : -1;
        trilho.scrollBy({ left: dir * passo(), behavior: SEM_MOVIMENTO ? 'auto' : 'smooth' });
      });
    });

    function estado() {
      var max = trilho.scrollWidth - trilho.clientWidth - 2;
      var ant = botoes.filter(function (b) { return b.dataset.carro === 'ant'; })[0];
      var prox = botoes.filter(function (b) { return b.dataset.carro === 'prox'; })[0];
      if (ant) ant.disabled = trilho.scrollLeft <= 2;
      if (prox) prox.disabled = trilho.scrollLeft >= max;
    }
    estado();
    trilho.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado);

    trilho.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      trilho.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * passo(), behavior: 'smooth' });
    });
  }

  /* ===================================================================
     MODAIS
     =================================================================== */
  var modalAberto = null;
  var focoAnterior = null;

  function focaveis(caixa) {
    return $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', caixa)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function abrir(modal, aoAbrir) {
    if (modalAberto) fechar();
    focoAnterior = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('trava');
    modalAberto = modal;
    if (aoAbrir) aoAbrir();
    var alvo = focaveis($('.modal__caixa', modal))[1] || $('.modal__x', modal);
    if (alvo) alvo.focus();
  }

  function fechar() {
    if (!modalAberto) return;
    modalAberto.hidden = true;
    modalAberto = null;
    document.body.classList.remove('trava');
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
  }

  function abrirModal(servico) {
    var modal = $('#modalOrcamento');
    abrir(modal, function () {
      var sel = $('#m-servico');
      if (servico && sel) {
        var achou = Array.prototype.some.call(sel.options, function (o) {
          if (o.value === servico || o.textContent === servico) { sel.value = o.value || o.textContent; return true; }
          return false;
        });
        if (!achou) {
          var msg = $('#m-mensagem');
          if (msg && !msg.value) msg.value = servico;
        }
      }
    });
  }

  function modais() {
    document.addEventListener('click', function (e) {
      var alvo = e.target.closest('[data-orcamento]');
      if (alvo) { e.preventDefault(); abrirModal(alvo.dataset.servico || ''); return; }
      var zap = e.target.closest('[data-whats]');
      if (zap) { e.preventDefault(); abrirZap(TL.mensagens.padrao); return; }
      if (e.target.closest('[data-fechar-modal]')) { e.preventDefault(); fechar(); }
    });

    var priv = $('#abrirPrivacidade');
    if (priv) priv.addEventListener('click', function () { abrir($('#modalPrivacidade')); });

    document.addEventListener('keydown', function (e) {
      if (!modalAberto) return;
      if (e.key === 'Escape') { fechar(); return; }
      if (e.key !== 'Tab') return;

      var itens = focaveis($('.modal__caixa', modalAberto));
      if (!itens.length) return;
      var primeiro = itens[0], ultimo = itens[itens.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });
  }

  /* ===================================================================
     FORMULÁRIOS
     =================================================================== */
  function mascaraTelefone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function erroDe(campo) {
    var v = campo.value.trim();
    if (campo.required && !v) return 'Preencha este campo.';
    if (campo.type === 'tel' && v) {
      if (v.replace(/\D/g, '').length < 10) return 'Informe DDD + número.';
    }
    if (campo.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      return 'E-mail inválido.';
    }
    return '';
  }

  function valida(campo) {
    var msg = erroDe(campo);
    var caixa = campo.closest('.campo');
    var saida = caixa && caixa.querySelector('.campo__erro');
    if (caixa) caixa.classList.toggle('erro', !!msg);
    if (saida) saida.textContent = msg;
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function mensagemZap(d) {
    var L = [];
    L.push('*Pedido de orçamento — site Transportes Lucas*');
    L.push('');
    L.push('*Nome:* ' + d.nome);
    if (d.empresa) L.push('*Empresa:* ' + d.empresa);
    L.push('*Telefone:* ' + d.telefone);
    if (d.email) L.push('*E-mail:* ' + d.email);
    L.push('*Tipo de serviço:* ' + d.servico);
    L.push('*Origem:* ' + d.origem);
    L.push('*Destino:* ' + d.destino);
    if (d.mensagem) { L.push(''); L.push('*Detalhes da carga:*'); L.push(d.mensagem); }
    return L.join('\n');
  }

  function avisar(texto) {
    var el = $('#aviso');
    if (el) { el.textContent = ''; setTimeout(function () { el.textContent = texto; }, 50); }
  }

  function formularios() {
    $$('.form').forEach(function (form) {

      $$('input[type="tel"]', form).forEach(function (tel) {
        tel.addEventListener('input', function () { tel.value = mascaraTelefone(tel.value); });
      });

      $$('input, select, textarea', form).forEach(function (campo) {
        campo.addEventListener('blur', function () {
          if (campo.value.trim() || campo.required) valida(campo);
        });
        campo.addEventListener('input', function () {
          var caixa = campo.closest('.campo');
          if (caixa && caixa.classList.contains('erro')) valida(campo);
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var campos = $$('input, select, textarea', form);
        var ok = true, primeiroErro = null;
        campos.forEach(function (c) {
          if (!valida(c)) { ok = false; if (!primeiroErro) primeiroErro = c; }
        });

        if (!ok) {
          avisar('Há campos a corrigir no formulário.');
          if (primeiroErro) {
            primeiroErro.focus();
            primeiroErro.scrollIntoView({ block: 'center', behavior: SEM_MOVIMENTO ? 'auto' : 'smooth' });
          }
          return;
        }

        var d = {};
        campos.forEach(function (c) { if (c.name) d[c.name] = c.value.trim(); });

        avisar('Abrindo o WhatsApp com a sua mensagem.');
        abrirZap(mensagemZap(d));

        form.reset();
        if (modalAberto) fechar();
      });
    });
  }

  /* ===================================================================
     DIVERSOS
     =================================================================== */
  function diversos() {
    var zap = $('#zapFlutuante');
    if (zap) zap.href = linkZap(TL.mensagens.botaoFlutuante);

    var ano = new Date().getFullYear();
    var a1 = $('#anoAtual'); if (a1) a1.textContent = '© ' + ano;
    var a2 = $('#privData'); if (a2) a2.textContent = 'novembro de ' + ano;

    if (SEM_MOVIMENTO) {
      $$('.hero__video').forEach(function (v) { v.pause(); v.removeAttribute('autoplay'); });
    } else {
      $$('.hero__video').forEach(function (v) {
        var tocar = function () {
          var p = v.play();
          if (p && p.catch) p.catch(function () { /* fica no poster */ });
        };
        tocar();
        document.addEventListener('visibilitychange', function () { if (!document.hidden) tocar(); });
      });
    }

    // rolagem suave compensando o header fixo
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#' || a.hasAttribute('data-orcamento') || a.hasAttribute('data-whats')) return;
      var alvo = document.querySelector(id);
      if (!alvo) return;
      e.preventDefault();
      var topo = $('#topo');
      var desloc = topo ? topo.offsetHeight : 0;
      var y = alvo.getBoundingClientRect().top + window.scrollY - desloc + 1;
      window.scrollTo({ top: y, behavior: SEM_MOVIMENTO ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  }

  /* ===================================================================
     INÍCIO
     =================================================================== */
  function iniciar() {
    montarNumeros();
    montarFrota();
    montarCobertura();
    montarUnidades();
    montarContatos();
    montarRedes();
    header();
    carrossel();
    modais();
    formularios();
    diversos();
    revelar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

})();
