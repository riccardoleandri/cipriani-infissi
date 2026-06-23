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

/* selettore realizzazioni: click espande, secondo click ingrandisce */
var opts = Array.prototype.slice.call(document.querySelectorAll('.sel-opt'));
opts.forEach(function (o) {
  function act() {
    if (o.classList.contains('active') && o.dataset.lbi) { openLb(o.dataset.lbi, o.dataset.cap); return; }
    opts.forEach(function (x) { x.classList.remove('active'); });
    o.classList.add('active');
  }
  o.addEventListener('click', act);
  o.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
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
