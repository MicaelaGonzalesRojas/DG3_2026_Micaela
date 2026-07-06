/* ====================================================================
   CÚSPIDE — Curso Supervivencia en Montaña
   JS: header on scroll, accordion, testimonial carousel, reveals
   ==================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) document.documentElement.setAttribute('data-motion', 'reduced');

  /* ---------------- HEADER ON SCROLL ---------------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- MOBILE NAV TOGGLE (si existiera botón) ---------------- */
  var navList = document.getElementById('navList');
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      navList.classList.toggle('is-open');
    });
  }

  /* ---------------- ACCORDION: ¿QUÉ VAS A APRENDER? ---------------- */
  var accordion = document.getElementById('cursoAccordion');
  if (accordion) {
    var items = accordion.querySelectorAll('.curso-accordion__item');
    items.forEach(function (item) {
      var trigger = item.querySelector('.curso-accordion__trigger');
      var sign = item.querySelector('.curso-accordion__sign');

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // cerrar todos
        items.forEach(function (other) {
          other.classList.remove('is-open');
          other.querySelector('.curso-accordion__trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.curso-accordion__sign').textContent = '+';
        });

        // abrir el clickeado si estaba cerrado
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          sign.textContent = '–';
        }
      });
    });
  }

  /* ---------------- CARRUSEL DE TESTIMONIOS ---------------- */
  var track = document.getElementById('testimoniosTrack');
  if (track) {
    var slides = Array.prototype.slice.call(track.querySelectorAll('.curso-testimonio'));
    var dotsWrap = document.getElementById('testimonioDots');
    var btnPrev = document.getElementById('testimonioPrev');
    var btnNext = document.getElementById('testimonioNext');
    var current = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function resetTimer() {
      if (timer) clearInterval(timer);
      if (!prefersReduced) {
        timer = setInterval(function () { goTo(current + 1); }, 6000);
      }
    }

    btnPrev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    btnNext.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

    resetTimer();
  }

  /* ---------------- SCROLL REVEALS ---------------- */
  var revealEls = document.querySelectorAll('.section-copy');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- SMOOTH ANCHOR SCROLL ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = id ? document.getElementById(id) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
  
  
/* ==========================================
   CÚSPIDE · CUSTOM CURSOR
========================================== */

(function () {

    if (window.innerWidth < 1024) return;

    const cursor = document.querySelector('.cuspide-cursor');

    if (!cursor) return;

    const dot = cursor.querySelector('.cuspide-cursor__dot');
    const ring = cursor.querySelector('.cuspide-cursor__ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    const LERP = 0.15;

    function animateCursor() {

        ringX += (mouseX - ringX) * LERP;
        ringY += (mouseY - ringY) * LERP;

        dot.style.transform =
            `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

        ring.style.transform =
            `translate3d(${ringX - 15}px, ${ringY - 15}px, 0)`;

        requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    /* =====================
       HOVER INTERACTIVO
    ===================== */

    const interactiveSelector = `
        a,
        button,
        input,
        textarea,
        select,
        .interactive-hover,
        [role="button"]
    `;

    
    document.addEventListener('mouseover', (e) => {

        if (e.target.closest(interactiveSelector)) {
            cursor.classList.add('is-hover');
        }

    });

    document.addEventListener('mouseout', (e) => {

        if (e.target.closest(interactiveSelector)) {
            cursor.classList.remove('is-hover');
        }

    });

    /* =====================
       CLICK
    ===================== */

    document.addEventListener('mousedown', () => {
        cursor.classList.add('is-pressed');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('is-pressed');
    });

    /* =====================
       TAB INACTIVO
    ===================== */

    document.addEventListener('visibilitychange', () => {

        if (document.hidden) {
            cursor.style.opacity = '0';
        } else {
            cursor.style.opacity = '1';
        }

    });

})();


  /* =========================
   MAGNETIC BUTTON
========================= */

const magneticBtn =
document.getElementById(
    'footerMagneticBtn'
);

if(magneticBtn){

    magneticBtn.addEventListener(
        'mousemove',
        e => {

            const rect =
                magneticBtn.getBoundingClientRect();

            const x =
                e.clientX -
                rect.left -
                rect.width / 2;

            const y =
                e.clientY -
                rect.top -
                rect.height / 2;

            magneticBtn.style.transform =
                `translate(${x * .08}px, ${y * .08}px)`;
        }
    );

    magneticBtn.addEventListener(
        'mouseleave',
        () => {

            magneticBtn.style.transform =
                'translate(0,0)';
        }
    );
}

/* =========================
   MOBILE ACCORDIONS
========================= */

document
.querySelectorAll(
    '.footer-mobile-trigger'
)
.forEach(trigger => {

    trigger.addEventListener(
        'click',
        () => {

            if(
                window.innerWidth > 768
            ) return;

            trigger
            .parentElement
            .classList
            .toggle('active');
        }
    );
});

})();


