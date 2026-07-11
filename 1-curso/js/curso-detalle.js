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
/* ===============================
   REVEAL
================================== */

const revealObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

document
.querySelectorAll(".reveal-media, .reveal-content")
.forEach(el=>revealObserver.observe(el));


/* ===============================
   CLASE ACTIVA
================================== */

const lessonBlocks = document.querySelectorAll(
".cuspide-class-schedule__lesson-block"
);

const lessonObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            lessonBlocks.forEach(item=>{

                item.classList.remove("active");

            });

            entry.target.classList.add("active");

        }

    });

},{
    rootMargin:"-45% 0px -45% 0px",
    threshold:0
});

lessonBlocks.forEach(block=>lessonObserver.observe(block));

/* ======================================================
   CÚSPIDE CHECKOUT PRICING
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const pricingSection = document.querySelector(".cuspide-checkout-pricing");

    if (!pricingSection) return;

    const observer = new IntersectionObserver(

        (entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                pricingSection.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        },

        {
            threshold: 0.25,
            rootMargin: "0px 0px -80px 0px"
        }

    );

    observer.observe(pricingSection);

});



const breaker = document.querySelector(".cuspide-course-breaker");

if(breaker){

    const title = breaker.querySelector(".cuspide-course-breaker__manifesto");
    const pills = breaker.querySelectorAll(".cuspide-course-breaker__spec-pill");

    const observer = new IntersectionObserver(entries=>{

        if(entries[0].isIntersecting){

            title.classList.add("is-visible");

            pills.forEach((pill,index)=>{

                setTimeout(()=>{

                    pill.classList.add("is-visible");

                },index*90);

            });

            observer.disconnect();

        }

    },{
        threshold:.25
    });

    observer.observe(breaker);

}

 /* ──────────────────────────────────────────────────────────────────
     INFOO
  ────────────────────────────────────────────────────────────────── */
const painSection = document.querySelector(".cuspide-pain-agitation");

if(painSection){

    const image = painSection.querySelector(".cuspide-pain-agitation__frame");
    const content = painSection.querySelector(".cuspide-pain-agitation__content");

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                image.classList.add("is-visible");
                content.classList.add("is-visible");

            }

        });

    },{

        threshold:0.25

    });

    observer.observe(painSection);

}



(function cuspideSyllabusInit() {

  'use strict';

  /* ──────────────────────────────────────────────────────────────────
     0. Referencias DOM
  ────────────────────────────────────────────────────────────────── */
  var section  = document.getElementById('cuspide-syllabus-immersion');
  if (!section) return; // sale limpiamente si la sección no está

  var title    = section.querySelector('.cuspide-syllabus-immersion__title');
  var cards    = Array.from(section.querySelectorAll('.cuspide-syllabus-immersion__card'));
  var bgLayers = Array.from(section.querySelectorAll('.cuspide-syllabus-immersion__bg-layer'));

  /* ──────────────────────────────────────────────────────────────────
     1. Activación de tarjeta + cambio de fondo
        Solo opacity y transform — sin recálculo de layout.
  ────────────────────────────────────────────────────────────────── */
  function activateCard(targetCard) {
    var cardId = targetCard.dataset.card;
    var btn    = targetCard.querySelector('.cuspide-syllabus-immersion__card-btn');

    // Desactiva todas las tarjetas y sus botones aria
    cards.forEach(function(card) {
      card.classList.remove('is-active');
      var b = card.querySelector('.cuspide-syllabus-immersion__card-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });

    // Activa la tarjeta seleccionada
    targetCard.classList.add('is-active');
    if (btn) btn.setAttribute('aria-expanded', 'true');

    // Cambia la capa de fondo: solo opacity (GPU-only)
    bgLayers.forEach(function(layer) {
      layer.classList.remove('is-active');
    });
    var targetLayer = section.querySelector(
      '.cuspide-syllabus-immersion__bg-layer[data-card="' + cardId + '"]'
    );
    if (targetLayer) {
      targetLayer.classList.add('is-active');
    } else {
      // Fallback a capa base si no hay imagen específica
      var baseLayer = section.querySelector(
        '.cuspide-syllabus-immersion__bg-layer[data-card="0"]'
      );
      if (baseLayer) baseLayer.classList.add('is-active');
    }
  }

  /* ──────────────────────────────────────────────────────────────────
     2. Detección de mobile (< 768px)
        Usamos matchMedia para no leer el DOM en cada evento.
  ────────────────────────────────────────────────────────────────── */
  var mobileQuery = window.matchMedia('(max-width: 768px)');

  /* ──────────────────────────────────────────────────────────────────
     3. Listeners por tarjeta
        Desktop: mouseenter activa la tarjeta
        Mobile:  click/tap activa la tarjeta (hover no existe)
        El listener de mouseenter queda registrado siempre, pero
        el check de mobileQuery.matches lo hace inoperante en mobile.
  ────────────────────────────────────────────────────────────────── */
  cards.forEach(function(card) {

    // DESKTOP — hover
    card.addEventListener('mouseenter', function() {
      if (!mobileQuery.matches) {
        activateCard(card);
      }
    });

    // MOBILE + accesibilidad de teclado — click/tap
    var btn = card.querySelector('.cuspide-syllabus-immersion__card-btn');
    if (btn) {
      btn.addEventListener('click', function() {
        // En mobile siempre activa por tap.
        // En desktop: el click es accesible por teclado (Enter/Space).
        activateCard(card);
      });
    }

  });

  /* Cuando se sale del deck entero (desktop), no hace nada —
     la última tarjeta activada permanece activa (UX más estable). */

  /* ──────────────────────────────────────────────────────────────────
     4. IntersectionObserver — Reveal de entrada
        El título y las tarjetas entran desde abajo al llegar
        a la viewport. Stagger manual por índice (sin transition-delay
        en CSS — la diferencia de tiempo la pone el JS).
        Solo opacity + transform (GPU).
  ────────────────────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {

    /* 4a. Título */
    var titleObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            titleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (title) titleObserver.observe(title);

    /* 4b. Tarjetas — stagger por índice via setTimeout (NO transition-delay) */
    var deckObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;

          var deckEl = entry.target; // el __deck completo
          deckObserver.unobserve(deckEl);

          cards.forEach(function(card, i) {
            // Stagger: cada tarjeta entra 60ms después de la anterior
            setTimeout(function() {
              card.classList.add('is-entered');
            }, i * 60);
          });
        });
      },
      { threshold: 0.15 }
    );

    var deck = section.querySelector('.cuspide-syllabus-immersion__deck');
    if (deck) deckObserver.observe(deck);

  } else {
    /* Fallback sin IntersectionObserver: todo visible de inmediato */
    if (title) title.classList.add('is-visible');
    cards.forEach(function(card) { card.classList.add('is-entered'); });
  }

  /* ──────────────────────────────────────────────────────────────────
     5. prefers-reduced-motion — si está activo, mostramos todo
        inmediatamente sin animaciones de entrada.
  ────────────────────────────────────────────────────────────────── */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) {
    if (title) title.classList.add('is-visible');
    cards.forEach(function(card) { card.classList.add('is-entered'); });
  }

  /* ──────────────────────────────────────────────────────────────────
     6. Estado inicial: tarjeta 1 activa al cargar
  ────────────────────────────────────────────────────────────────── */
  var defaultCard = section.querySelector('.cuspide-syllabus-immersion__card[data-card="1"]');
  if (defaultCard) activateCard(defaultCard);

})(); // fin cuspideSyllabusInit


/*==========================================================
  CÚSPIDE INSTRUCTOR SPOTLIGHT
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const spotlight = document.querySelector(
        ".cuspide-instructor-spotlight"
    );

    if (!spotlight) return;

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                spotlight.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        },

        {
            threshold: 0.25
        }

    );

    observer.observe(spotlight);

    /*=========================================
      TAP PARA MÓVILES
    =========================================*/

    const frame = spotlight.querySelector(
        ".cuspide-instructor-spotlight__frame"
    );

    if (!frame) return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");

    function enableTouchOverlay() {

        if (!mediaQuery.matches) return;

        frame.addEventListener("click", function () {

            frame.classList.toggle("is-touch-active");

        });

    }

    enableTouchOverlay();

    mediaQuery.addEventListener("change", () => {

        frame.classList.remove("is-touch-active");

    });

});

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
  
  
/*====================================

MAS CURSOS

====================================*/

(function cuspideCrossSellInit() {

  'use strict';

  var section = document.getElementById('cuspide-cross-sell');
  if (!section) return;

  var title = section.querySelector('.cuspide-cross-sell__title');
  var cards = Array.from(section.querySelectorAll('.cuspide-cross-sell__card'));

  /* Respeta preferencia de movimiento reducido:
     marca todo visible de inmediato sin transición */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) {
    if (title) title.classList.add('is-visible');
    cards.forEach(function(card) { card.classList.add('is-visible'); });
    return; /* no registra observers */
  }

  if (!('IntersectionObserver' in window)) {
    /* Fallback para navegadores sin soporte */
    if (title) title.classList.add('is-visible');
    cards.forEach(function(card) { card.classList.add('is-visible'); });
    return;
  }

  /* ── 1. Observer del título ──────────────────────────────────── */
  var titleObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        titleObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  if (title) titleObserver.observe(title);

  /* ── 2. Observer de las tarjetas — aparecen simultáneas ─────── */
  /* Observamos el grid completo: cuando entra en viewport,
     las dos tarjetas reciben is-visible al mismo tiempo.
     Sin stagger — el brief pide "simultáneas". */
  var grid = section.querySelector('.cuspide-cross-sell__grid');

  var gridObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        cards.forEach(function(card) {
          card.classList.add('is-visible');
        });
        gridObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  if (grid) gridObserver.observe(grid);

})();


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


