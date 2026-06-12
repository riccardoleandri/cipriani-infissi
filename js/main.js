/* Cipriani — Fabbrica Infissi · main.js (v10) */

/* header: sfondo allo scroll, nascondi in discesa */
var hdr = document.getElementById('hdr');
var lastY = 0;
function onScroll() {
  var y = window.scrollY;
  hdr.classList.toggle('lite', y > 60);
  hdr.classList.toggle('hide', y > 500 && y > lastY);
  lastY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
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
