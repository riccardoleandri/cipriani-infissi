/* Cipriani — Fabbrica Infissi · main.js (v10) */

/* header: sfondo allo scroll, nascondi in discesa (solo desktop) */
var hdr = document.getElementById('hdr');
var lastY = 0;
var isMobile = window.matchMedia('(max-width:980px)');
function onScroll() {
  var y = window.scrollY;
  hdr.classList.toggle('lite', y > 60);
  if (isMobile.matches && burgerEl) {
    burgerEl.classList.toggle('scrolled', y > 60);
  }
  if (!isMobile.matches) {
    hdr.classList.toggle('hide', y > 500 && y > lastY);
  }
  lastY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
/* su mobile sposto nav e burger fuori dall'header nel body,
   altrimenti position:fixed dentro un altro fixed non copre tutto lo schermo su Safari iOS,
   e il burger finirebbe sotto il nav overlay */
var navEl = document.getElementById('nav');
var burgerEl = document.getElementById('burger');
if (isMobile.matches) {
  document.body.appendChild(navEl);
  document.body.appendChild(burgerEl);
}
document.getElementById('burger').addEventListener('click', function () {
  document.body.classList.toggle('menu-open');
});

/* fallback foto remote: se un URL esterno muore, subentra la foto locale */
document.querySelectorAll('img[data-fb]').forEach(function (im) {
  im.addEventListener('error', function () { im.src = 'img/' + im.dataset.fb + '.jpg'; }, { once: true });
});

/* precarico gli sfondi CTA per evitare il pop progressivo allo scroll */
document.querySelectorAll('.bgp').forEach(function (b) {
  var m = (b.getAttribute('style') || '').match(/url\('?"?([^'")]+)/);
  if (m) { var i = new Image(); i.src = m[1]; }
});

/* sfondi del selettore dalle foto locali */
document.querySelectorAll('[data-bg]').forEach(function (el) {
  el.style.backgroundImage = 'url(img/' + el.dataset.bg + '.jpg)';
});

var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

/* hero slideshow (solo home) */
var hero = document.getElementById('hero');
if (hero) {
  var slides = Array.prototype.slice.call(hero.querySelectorAll('.slide'));
  var sCount = document.getElementById('sCount');
  var cur = 0;
  hero.classList.add('run');
  function show(n) {
    slides[cur].classList.remove('on');
    cur = n % slides.length;
    slides[cur].classList.add('on');
    sCount.textContent = String(cur + 1).padStart(2, '0') + ' — ' + String(slides.length).padStart(2, '0');
    hero.classList.remove('run'); void hero.offsetWidth; hero.classList.add('run');
  }
  if (!reduceMotion) setInterval(function () { show(cur + 1); }, 7000);
}

/* lightbox */
var lb = document.getElementById('lb');
function openLb(key, cap) {
  if (!lb) return;
  document.getElementById('lbImg').src = 'img/' + key + '.jpg';
  document.getElementById('lbCap').textContent = cap || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
if (lb) {
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  lb.addEventListener('click', closeLb);
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  document.querySelectorAll('[data-lbi]:not(.sel-opt)').forEach(function (c) {
    c.addEventListener('click', function () { openLb(c.dataset.lbi, c.dataset.cap); });
  });
}

/* selettore realizzazioni: click espande, click su icona apre lightbox */
var opts = Array.prototype.slice.call(document.querySelectorAll('.sel-opt'));
opts.forEach(function (o) {
  function act() {
    if (o.classList.contains('active')) return;
    opts.forEach(function (x) { x.classList.remove('active'); });
    o.classList.add('active');
  }
  o.addEventListener('click', act);
  o.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  var ico = o.querySelector('.ico');
  if (ico && o.dataset.lbi) {
    ico.style.pointerEvents = 'auto';
    ico.style.cursor = 'zoom-in';
    ico.addEventListener('click', function (e) {
      if (o.classList.contains('active')) {
        e.stopPropagation();
        openLb(o.dataset.lbi, o.dataset.cap);
      }
    });
  }
});

/* carosello recensioni (solo home) */
var qs = Array.prototype.slice.call(document.querySelectorAll('.q-item'));
if (qs.length) {
  var dots = Array.prototype.slice.call(document.querySelectorAll('#qDots button'));
  var qi = 0;
  function setQ(n) {
    qs[qi].classList.remove('on'); dots[qi].classList.remove('on');
    qi = n % qs.length;
    qs[qi].classList.add('on'); dots[qi].classList.add('on');
  }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { setQ(i); }); });
  if (!reduceMotion) setInterval(function () { setQ(qi + 1); }, 6000);
}

/* form preventivo (solo contatti) — demo lato client */
var qform = document.getElementById('qform');
if (qform) {
  qform.querySelectorAll('.fld input, .fld textarea').forEach(function (i) {
    function f() { i.closest('.fld').classList.toggle('up', i.value !== '' || document.activeElement === i); }
    i.addEventListener('focus', f); i.addEventListener('blur', f); i.addEventListener('input', f);
  });
  qform.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    qform.querySelectorAll('input[required]').forEach(function (i) {
      i.closest('.fld').style.borderBottomColor = i.value ? '' : '#A4502F';
      if (!i.value) ok = false;
    });
    if (!ok) return;
    document.getElementById('formOk').style.display = 'block';
    qform.querySelectorAll('input,textarea').forEach(function (i) {
      i.value = ''; i.closest('.fld').classList.remove('up');
    });
  });
}

/* ===================== v11 ===================== */

/* ===================== v14 — modale dettaglio prodotto ===================== */
(function () {
  var dm = document.getElementById('dmodal');
  if (!dm) return;

  var products = {
    'mar45': {
      name: 'MAR45', sup: '',
      chip: '', kick: 'Sistema a taglio freddo',
      desc: 'MAR45 è il sistema a "camera standard" che permette la realizzazione di finestre, portefinestre, wasistas, bilici, sporgere, anta-ribalta, monoblocchi, portoncini a una o più ante, moduli fissi, porte a vento, scorrevoli paralleli, aperture esterne, porte automatiche, soluzioni ad imbotte per nastri con compensazione muri da 160 a 250 mm e porte interne per pareti spesse dai 90 a 160 mm.',
      img: 'img/prodotti/mar45.jpg',
      line: 'taglio freddo',
      specs: [
        ['Profondità telaio', '45 mm'],
        ['Profondità anta', '45 a 63,5 mm'],
        ['Larghezza nodo laterale', '82 a 150 mm'],
        ['Larghezza nodo centrale', '138 a 185 mm'],
        ['Vetrazioni', 'max 32 mm'],
        ['Trasmittanza Uw', 'fino a 2,33 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/mar45-1.jpg', 'img/prodotti/dettagli/mar45-2.jpg']
    },
    'mas60': {
      name: 'MAS60', sup: '',
      chip: '', kick: 'Sistema a taglio freddo',
      desc: 'MAS60 è lo scorrevole non isolato, semplice nell\'estetica ma all\'alta funzionalità. Con profili leggeri, MAS60 rende possibile la realizzazione di finestre e portefinestre scorrevoli a 2 o più ante vetrate o pannellate, soluzioni miste scorrevoli/battenti grazie ad apposito profilo di abbinamento con sistema MAR45, nonché soluzioni a 90°. Ideale per ambienti non riscaldati, il sistema si presta per spazi pubblici quali: bar, ristoranti e similari.',
      img: 'img/prodotti/mas60.jpg',
      line: 'taglio freddo',
      specs: [
        ['Profondità telaio', '53 a 102 mm'],
        ['Profondità anta', '28 mm'],
        ['Larghezza nodo laterale', '102 mm'],
        ['Larghezza nodo centrale', '67 - 138 mm'],
        ['Vetrazioni', 'max 24 mm'],
        ['Trasmittanza Uw', 'fino a 2,72 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/mas60.jpg']
    },
    'persiana-battente': {
      name: 'Persiana a battente', sup: '',
      chip: '', kick: 'Oscurante · battente',
      desc: 'Il sistema permette la realizzazione di oscuranti battenti ad 1 o più ante con lamelle fisse ed orientabili disegnate a seconda della cava anta e assiemate a mezzo selle o profili asolati (fix). La varietà dei profili rende possibile molteplici soluzioni rendendo il prodotto versatile per ogni tipo di richiesta.',
      img: 'img/prodotti/persiana-battente.jpg',
      line: 'taglio freddo',
      specs: [
        ['Profondità telaio', '45 mm'],
        ['Profondità anta', '45 a 58 mm'],
        ['Larghezza nodo laterale', '79 a 92 mm'],
        ['Larghezza nodo centrale', '132 a 144 mm'],
        ['Oscuramento', 'lamelle fisse ed orientabili']
      ],
      profili: ['img/prodotti/dettagli/persiana-battente.jpg']
    },
    'scurone': {
      name: 'Scurone', sup: '',
      chip: '', kick: 'Oscurante · doghe',
      desc: 'Il sistema permette la realizzazione di scuri a 1 o 2 ante con doghe fisse componibili a scatto, con telaio o ancoraggio diretto a muro a mezzo cardini e bandelle. Il meccanismo di chiusura è caratterizzato da spagnolette o cremonesi.',
      img: 'img/prodotti/scurone.jpg',
      line: 'taglio freddo',
      specs: [
        ['Profondità telaio', '49 mm'],
        ['Profondità anta', '58 mm'],
        ['Larghezza nodo laterale', '51 a 82 mm'],
        ['Larghezza nodo centrale', '130 mm'],
        ['Oscuramento', 'doghe a scatto']
      ],
      profili: ['img/prodotti/dettagli/scurone.jpg']
    },
    'persiana-scorrevole': {
      name: 'Persiana scorrevole', sup: '',
      chip: '', kick: 'Oscurante · scorrevole',
      desc: 'Il sistema permette la realizzazione di persiane scorrevoli a 1 o 2 ante con lamelle fisse ed orientabili. È possibile prevedere l\'assenza del telaio a terra per eliminare del tutto la presenza di barriere architettoniche.',
      img: 'img/prodotti/persiana-scorrevole.jpg',
      line: 'taglio freddo',
      specs: [
        ['Profondità telaio', '87 mm'],
        ['Profondità anta', '45 mm'],
        ['Larghezza nodo laterale', '73 a 94 mm'],
        ['Larghezza nodo centrale', '149 mm'],
        ['Oscuramento', 'lamelle fisse ed orientabili']
      ],
      profili: ['img/prodotti/dettagli/persiana-scorrevole.jpg']
    },
    'mar60tt': {
      name: 'MAR60TT', sup: '',
      chip: 'Taglio termico', kick: 'Sistema a taglio termico',
      desc: 'MAR60TT è il sistema a "camera standard" che permette la realizzazione di finestre e portefinestre a una o più ante, wasistas, bilici, sporgere, anta-ribalta, monoblocchi, portoncini a una o più ante, fissi, oblo\', scorribalta, soluzioni cieche con doghe in alluminio a taglio termico, soglie ribassate e soluzioni a 90° con angolare a taglio termico.',
      img: 'img/prodotti/mar60tt.jpg',
      line: 'taglio termico',
      specs: [
        ['Taglio', 'Termico'],
        ['Profondità telaio', '59 a 63,5 mm'],
        ['Profondità anta', '67 a 77 mm'],
        ['Larghezza nodo laterale', '92 a 140 mm'],
        ['Larghezza nodo centrale', '148 a 196 mm'],
        ['Vetrazioni', 'max 46 mm'],
        ['Trasmittanza Uw', 'fino a 1,08 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/mar60tt.jpg']
    },
    'ma72hp': {
      name: 'MA72HP', sup: 'anche Slim',
      chip: 'Taglio termico', kick: 'Sistema a taglio termico',
      desc: 'MA72HP è il sistema a "camera europea" che permette con i suoi numerosi profili la realizzazione delle più svariate tipologie di serramento: finestre e portefinestre a 1 o più ante con apertura interna ed esterna, wasistas, bilici, sporgere, anta-ribalta, monoblocchi, portoncini ad una o più ante, moduli fissi, ante a scomparsa, linea complanare, scorrevole parallelo, soluzioni a 90°. Il sistema dispone di certificazione per porte su vie di esodo.',
      img: 'img/prodotti/ma72hp.jpg',
      line: 'taglio termico',
      specs: [
        ['Taglio', 'Termico'],
        ['Profondità telaio Standard', '72 a 84 mm'],
        ['Profondità anta Standard', '80 a 90 mm'],
        ['Vetrazioni Standard', 'max 66 mm'],
        ['Trasmittanza Standard', 'fino a 0,90 W/m²K', true],
        ['Profondità telaio Slim', '72 mm'],
        ['Profondità anta Slim', '80 mm'],
        ['Vetrazioni Slim', 'max 43 mm'],
        ['Trasmittanza Slim', 'fino a 1,2 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/ma72hp.jpg']
    },
    'mas65tt': {
      name: 'MAS65TT', sup: '',
      chip: 'Taglio termico', kick: 'Scorrevole a taglio termico',
      desc: 'Il sistema permette la realizzazione di finestre e portefinestre scorrevoli a 1 o più ante, soluzioni a scomparsa ad anta singola o doppia, tre vie, con presenza di zanzariere, abbinamento con sistema a battente MAR60TT per soluzioni combinate con parti vetrate fisse o apribili, soluzioni a 90° con profilo d\'angolo dedicato.',
      img: 'img/prodotti/mas65tt.jpg',
      line: 'taglio termico',
      specs: [
        ['Taglio', 'Termico'],
        ['Profondità telaio', '65 - 112 mm'],
        ['Profondità anta', '35 mm'],
        ['Larghezza nodo laterale', '119 mm'],
        ['Larghezza nodo centrale', '85 - 157 mm'],
        ['Vetrazioni', 'max 31 mm'],
        ['Trasmittanza Uw', 'fino a 1,92 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/mas65tt.jpg']
    },
    'mas106tt': {
      name: 'MAS106TT', sup: '',
      chip: 'Taglio termico', kick: 'Alza-scorrere a taglio termico',
      desc: 'MAS106TT è lo scorrevole con sistema alza-scorrere dallo straordinario meccanismo per il drenaggio delle acque. Tale peculiarità lo rendono al pari di un battente altamente da un punto di vista della tenuta. Il prodotto, disponibile anche nella versione solo scorrevole, può essere impiegato per la realizzazione di finestre e portefinestre scorrevoli 2 o più ante, soluzioni con zanzariere, a 90°, a scrigno, a 2 e 3 vie.',
      img: 'img/prodotti/mas106tt.jpg',
      line: 'taglio termico',
      specs: [
        ['Taglio', 'Termico'],
        ['Profondità telaio', '90 a 167 mm'],
        ['Profondità anta', '45 mm'],
        ['Larghezza nodo laterale', '82/116 mm'],
        ['Larghezza nodo centrale', '90/166 mm'],
        ['Vetrazioni', 'max 39 mm'],
        ['Trasmittanza Uw', 'fino a 1,54 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/mas106tt.jpg']
    },
    'mas129tt': {
      name: 'MAS129TT', sup: '',
      chip: 'Taglio termico', kick: 'Alza-scorri a taglio termico',
      desc: 'Il sistema MAS129TT permette la realizzazione di finestre scorrevoli con sistema alza-scorri o semplicemente scorrevoli, ad 2 o più ante, soluzioni a scrigno, con soglia ribassata. La portata dei carrelli consente di ricoprire grosse pecchiature rendendo il prodotto di forte impatto visivo e attuale nel design.',
      img: 'img/prodotti/mas129tt.jpg',
      line: 'taglio termico',
      specs: [
        ['Taglio', 'Termico'],
        ['Profondità telaio', '129 - 150 mm'],
        ['Profondità anta', '58 - 59,8 mm'],
        ['Larghezza nodo laterale', '107 - 133 mm'],
        ['Larghezza nodo centrale', '116,5 - 213,5 mm'],
        ['Vetrazioni', 'max 46 mm'],
        ['Trasmittanza Uw', 'fino a 1,38 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/mas129tt.jpg']
    },
    'mas170tt': {
      name: 'MAS170TT', sup: '',
      chip: 'Taglio termico', kick: 'Alza-scorri grandi luci',
      desc: 'Il sistema permette la realizzazione di portefinestre scorrevoli con sistema alza-scorri a 2 o più ante a mezzo telai a 1, 2 e 3 vie, nonché soluzioni a scrigno a 1 o più ante, telaio a pavimento ribassato per ridurre al minimo gli ingombri architettonici (telaio ribassato da 22 mm e soglia da 9 mm). MAS170TT grazie a profili dedicati consente la realizzazione di moduli combinati scorrevoli/fissi/battenti con carterizzazione dedicata, in modo da garantire sempre il massimo comfort funzionale ed estetico.',
      img: 'img/prodotti/mas170tt.jpg',
      line: 'taglio termico',
      specs: [
        ['Taglio', 'Termico'],
        ['Profondità telaio', '170 a 260 mm'],
        ['Profondità anta', '72 mm'],
        ['Larghezza nodo laterale', '107/140 mm'],
        ['Larghezza nodo centrale', '116/205 mm'],
        ['Vetrazioni', 'max 59 mm'],
        ['Trasmittanza Uw', 'fino a 1,16 W/m²K', true]
      ],
      profili: ['img/prodotti/dettagli/mas170tt.jpg']
    }
  };

  var dmImg = document.getElementById('dmImg');
  var dmChip = document.getElementById('dmChip');
  var dmKick = document.getElementById('dmKick');
  var dmTitle = document.getElementById('dmTitle');
  var dmDesc = document.getElementById('dmDesc');
  var dmSpecs = document.getElementById('dmSpecs');
  var dmProfGrid = document.getElementById('dmProfGrid');
  var dmCta = document.getElementById('dmCta');

  function openDetail(key) {
    var p = products[key];
    if (!p) return;
    dmImg.src = p.img;
    dmImg.alt = p.name;
    if (p.chip) { dmChip.textContent = p.chip; dmChip.style.display = ''; } else { dmChip.style.display = 'none'; }
    dmKick.textContent = p.kick;
    dmTitle.innerHTML = p.name + (p.sup ? '<sup>' + p.sup + '</sup>' : '');
    dmDesc.textContent = p.desc;
    dmSpecs.innerHTML = p.specs.map(function (s) {
      return '<li' + (s[2] ? ' class="hot"' : '') + '><i>' + s[0] + '</i><b>' + s[1] + '</b></li>';
    }).join('');
    dmProfGrid.innerHTML = p.profili.map(function (src) {
      return '<img src="' + src + '" alt="Profili ' + p.name + '" loading="lazy" data-lbi-detail="' + src + '">';
    }).join('');
    dmCta.dataset.prod = p.name;
    dmCta.dataset.line = p.line;
    dm.classList.add('open');
    dm.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    dm.querySelector('.dmodal-card').scrollTop = 0;
  }

  function closeDetail() {
    dm.classList.remove('open');
    dm.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* click sulla card immagine apre il dettaglio */
  document.querySelectorAll('[data-detail]').forEach(function (card) {
    var media = card.querySelector('.sys-media');
    if (media) {
      media.addEventListener('click', function () { openDetail(card.dataset.detail); });
    }
  });

  /* click su immagine profilo nel dettaglio → lightbox */
  dmProfGrid.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG' && typeof openLb === 'function') {
      var src = e.target.src;
      document.getElementById('lbImg').src = src;
      document.getElementById('lbCap').textContent = 'Profili ' + dmTitle.textContent;
      document.getElementById('lb').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  /* chiudi dettaglio quando clicco CTA (si apre rmodal sopra) */
  dmCta.addEventListener('click', function () { closeDetail(); });

  dm.querySelectorAll('[data-dclose]').forEach(function (x) { x.addEventListener('click', closeDetail); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dm.classList.contains('open')) closeDetail(); });
})();

/* reveal allo scroll — sicuro: senza JS o senza IO i .rv restano visibili */
(function () {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.rv');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.remove('pre'); e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  els.forEach(function (el) { el.classList.add('pre'); io.observe(el); });
})();

/* tabs prodotti */
(function () {
  var tabs = document.querySelectorAll('.ptab');
  if (!tabs.length) return;
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var id = t.dataset.tab;
      document.querySelectorAll('.ptab').forEach(function (x) {
        var on = x === t; x.classList.toggle('active', on); x.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      document.querySelectorAll('.ppanel').forEach(function (p) { p.classList.toggle('active', p.id === 'pan-' + id); });
    });
  });
})();

/* modale "richiedi informazioni" per singolo prodotto */
(function () {
  var modal = document.getElementById('rmodal');
  if (!modal) return;
  var titleEl = document.getElementById('rmTitle');
  var subEl = document.getElementById('rmSub');
  var prodEl = document.getElementById('rmProd');
  var msgEl = document.getElementById('rm-msg');
  var okEl = document.getElementById('rmOk');
  var form = document.getElementById('rmForm');

  form.querySelectorAll('.fld input, .fld textarea').forEach(function (i) {
    function f() { i.closest('.fld').classList.toggle('up', i.value !== '' || document.activeElement === i); }
    i.addEventListener('focus', f); i.addEventListener('blur', f); i.addEventListener('input', f);
  });

  function open(prod, line) {
    okEl.style.display = 'none';
    if (line === 'finiture su specifica') {
      titleEl.textContent = 'Finitura su misura';
      subEl.textContent = 'Finiture su specifica · fattibilità e tempi';
      prodEl.value = 'Finitura fuori catalogo';
      msgEl.value = 'Vorrei informazioni su una finitura fuori catalogo (verniciatura / sublimazione su specifica). ';
    } else if (line === 'varie') {
      titleEl.textContent = prod;
      subEl.textContent = 'Soluzione su misura · fuori catalogo';
      prodEl.value = prod;
      msgEl.value = 'Vorrei una soluzione su misura fuori catalogo. ';
    } else {
      titleEl.textContent = prod;
      subEl.textContent = 'Linea ' + line + ' · disponibilità, scheda tecnica e tempi';
      prodEl.value = prod + ' (' + line + ')';
      msgEl.value = 'Vorrei ricevere informazioni e la disponibilità sul sistema ' + prod + ' (' + line + '). ';
    }
    msgEl.closest('.fld').classList.add('up');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = form.querySelector('input:not([type=hidden])');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function close() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

  document.querySelectorAll('.sys-btn').forEach(function (b) {
    b.addEventListener('click', function () { open(b.dataset.prod, b.dataset.line || ''); });
  });
  modal.querySelectorAll('[data-close]').forEach(function (x) { x.addEventListener('click', close); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('input[required]').forEach(function (i) {
      i.closest('.fld').style.borderBottomColor = i.value ? '' : '#A4502F';
      if (!i.value) ok = false;
    });
    if (!ok) return;
    okEl.style.display = 'block';
    form.querySelectorAll('input,textarea').forEach(function (i) {
      if (i.type !== 'hidden') { i.value = ''; i.closest('.fld').classList.remove('up'); }
    });
  });
})();
