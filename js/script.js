/* ====================================================================
   CÚSPIDE — interacciones
   Vanilla JS, sin dependencias. Todo respeta [data-motion="reduced"]
   y la preferencia de sistema prefers-reduced-motion.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

const summitHero = document.getElementById("summitHero");

const manifestoElements = document.querySelectorAll(
  ".summit-center-content"
);

window.addEventListener(
  "scroll",
  () => {

    if(window.scrollY > 80){

      summitHero.classList.add("scrolled");

      manifestoElements.forEach(el => {
        el.setAttribute("aria-hidden","true");
      });

    }else{

      summitHero.classList.remove("scrolled");

      manifestoElements.forEach(el => {
        el.setAttribute("aria-hidden","false");
      });

    }

  },
  { passive:true }
);



/* ==========================================================
   CUSPIDE BUTTONS
========================================================== */

(() => {

    const buttons = document.querySelectorAll(
        '.cuspide-action-btn'
    );

    buttons.forEach(button => {

        button.addEventListener('click', () => {

            if(button.dataset.toggle === "false")
                return;

            button.classList.toggle(
                'is-cuspide-active-state'
            );

        });

    });

})();





  /* ------------------------------------------------------------------
     0. Estado de movimiento (toggle manual + preferencia de sistema)
     ------------------------------------------------------------------ */
  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.getElementById('motionToggle');
  const motionLabel = document.getElementById('motionToggleLabel');
  let manualOverride = null; // null = seguir al sistema | true = forzar reducido | false = forzar completo

  function applyMotionState() {
    const reduced = manualOverride !== null ? manualOverride : prefersReducedQuery.matches;
    root.setAttribute('data-motion', reduced ? 'reduced' : 'full');
    motionToggle.setAttribute('aria-pressed', String(reduced));
    motionLabel.textContent = reduced ? 'Reanudar movimiento' : 'Pausar movimiento';
  }

  motionToggle.addEventListener('click', () => {
    const currentlyReduced = root.getAttribute('data-motion') === 'reduced';
    manualOverride = !currentlyReduced;
    applyMotionState();
  });
  prefersReducedQuery.addEventListener('change', () => {
    if (manualOverride === null) applyMotionState();
  });
  applyMotionState();

  function motionIsReduced() {
    return root.getAttribute('data-motion') === 'reduced';
  }
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


  /* ------------------------------------------------------------------
     1. Menú móvil
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });



/* ==========================================
   CUSPIDE SUMMIT FLIP CARDS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".csp-flip-card");

    let selectedCard = null;

    cards.forEach(card => {

        /* ------------------------
           HOVER TEMPORAL
        ------------------------ */

        card.addEventListener("mouseenter", () => {

            if(window.innerWidth <= 768) return;

            if(card === selectedCard) return;

            card.classList.add("is-active");
        });

        card.addEventListener("mouseleave", () => {

            if(window.innerWidth <= 768) return;

            if(card === selectedCard) return;

            card.classList.remove("is-active");
        });

        /* ------------------------
           CLICK FIJO
        ------------------------ */

        card.addEventListener("click", () => {

            if(selectedCard === card){

                card.classList.remove("is-active");

                selectedCard = null;

                return;
            }

            cards.forEach(item => {
                item.classList.remove("is-active");
            });

            card.classList.add("is-active");

            selectedCard = card;
        });

        /* ------------------------
           TECLADO
        ------------------------ */

        card.addEventListener("keydown", (e) => {

            if(e.key === "Enter" || e.key === " "){

                e.preventDefault();

                card.click();
            }
        });

    });

});



  /* ------------------------------------------------------------------
     2. Revelado genérico al hacer scroll (secciones de texto/visual)
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('.section-copy, .limits-image');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     3. Manifiesto — transición de fondo ligada al scroll (gris → blanco)
     ------------------------------------------------------------------ */
  const manifiesto = document.querySelector('.manifiesto');
  const manifiestoLines = document.querySelectorAll('.manifiesto-copy p');

  function updateManifiesto() {
    if (!manifiesto) return;
    const rect = manifiesto.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh;
    const scrolled = vh - rect.top;
    const progress = Math.min(100, Math.max(0, (scrolled / total) * 100));
    manifiesto.style.setProperty('--mf-progress', progress.toFixed(1));

    manifiestoLines.forEach((p) => {
      const r = p.getBoundingClientRect();
      const center = r.top + r.height / 2;
      if (center < vh * 0.78) p.classList.add('is-lit');
    });
  }
  window.addEventListener('scroll', updateManifiesto, { passive: true });
  window.addEventListener('resize', updateManifiesto);
  updateManifiesto();

  /* ------------------------------------------------------------------
     4. Atrévete a desafiar los límites — tarjetas con dato técnico
        El despliegue visual lo maneja el CSS (:hover / :focus-visible),
        acá solo sincronizamos aria-expanded para lectores de pantalla.
     ------------------------------------------------------------------ */
/* ==========================================
   INTERACCIÓN DE CARDS (PILLARS + HERO)
========================================== */

/* ==========================================
   HERO FLIP CARDS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const summitCards = document.querySelectorAll(".csp-flip-card");

  summitCards.forEach(card => {
    // Click → activa el flip
    card.addEventListener("click", () => {
      card.classList.toggle("is-active");
    });

    // Teclado → Enter o Espacio también activan el flip
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-active");
      }
    });
  });
});

/* ==========================================================
   CÚSPIDE GLACIER SEPARATOR
   Scroll Reveal
========================================================== */

(() => {

    const separator = document.querySelector(
        '.cuspide-glacier-separator'
    );

    if (!separator) return;

    /* ----------------------------------------
       Reduced Motion
    ---------------------------------------- */

    const reducedMotion =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

    if (reducedMotion) {

        separator.classList.add('is-visible');

        return;

    }

    /* ----------------------------------------
       Intersection Observer
    ---------------------------------------- */

    const observer = new IntersectionObserver(

        (entries, obs) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                separator.classList.add('is-visible');

                obs.unobserve(entry.target);

            });

        },

        {
            root: null,

            threshold: 0.35,

            rootMargin: "0px 0px -8% 0px"
        }

    );

    observer.observe(separator);

})();

/* ------------------------------------------------------------------
   HEROES DE LA MONTAÑA
   ------------------------------------------------------------------ */
/* ==========================================================
   CÚSPIDE GLOBAL INSPIRATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(".cuspide-global-inspiration");
  if (!section) return;

  /* ==========================================
     DATOS
  ========================================== */
  const athletes = [
    {
      image: "img/inspiration-01.jpg",
      name: "DANIEL CORDEIRO",
      disability: "35 años · Baja visión",
      location: "Monte Everest · 2003"
    },
    {
      image: "img/inspiration-02.jpg",
      name: "CARLOS MENDOZA",
      disability: "42 años · Movilidad reducida",
      location: "Aconcagua · 2018"
    },
    {
      image: "img/inspiration-03.jpg",
      name: "LUCÍA TORRES",
      disability: "31 años · Movilidad reducida",
      location: "Kilimanjaro · 2021"
    }
  ];

  /* ==========================================
     ELEMENTOS
  ========================================== */
  const thumbs = document.querySelectorAll(".cuspide-global-inspiration__thumb-card");
  const heroImage = document.getElementById("cuspideGlobalImage");
  const heroName = document.getElementById("cuspideGlobalName");
  const heroDisability = document.getElementById("cuspideGlobalDisability");
  const heroLocation = document.getElementById("cuspideGlobalLocation");

  /* ==========================================
     SCROLL REVEAL (asegura visibilidad)
  ========================================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      section.classList.add("is-visible");
      observer.disconnect();
    });
  }, { threshold: 0.25 });

  observer.observe(section);

  // fallback: mostrar siempre si no hay animación
  section.classList.add("is-visible");

  /* ==========================================
     CAMBIO DE CASO
  ========================================== */
  function changeAthlete(index) {
    const athlete = athletes[index];

    heroImage.classList.add("is-changing");

    setTimeout(() => {
      heroImage.src = athlete.image;
      heroImage.alt = athlete.name;
      heroName.textContent = athlete.name;
      heroDisability.textContent = athlete.disability;
      heroLocation.textContent = athlete.location;

      requestAnimationFrame(() => {
        heroImage.classList.remove("is-changing");
      });
    }, 180);
  }

  /* ==========================================
     EVENTOS
  ========================================== */
  thumbs.forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      thumbs.forEach(item => item.classList.remove("is-active"));
      button.classList.add("is-active");

      changeAthlete(index);
    });
  });

  /* ==========================================
     INICIALIZACIÓN (primer atleta activo)
  ========================================== */
  if (thumbs.length > 0) {
    thumbs[0].classList.add("is-active");
    changeAthlete(0);
  }

});

 
/**
 * Componente: Estadísticas de Autoridad — "La comunidad sigue subiendo"
 */
(function () {
  'use strict';

  var section = document.querySelector('.stats-block');
  if (!section) return;

  var title = section.querySelector('.stats-title');
  var digitWindows = section.querySelectorAll('.digit-window');

  var prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Paso 1: estado de "pre-giro" (solo si hay movimiento permitido).
  if (!prefersReducedMotion) {
    digitWindows.forEach(function (win) {
      var strip = win.querySelector('.digit-strip');
      if (strip) strip.style.setProperty('--target-digit', '0');
    });
  }

  function reveal() {
    if (title) title.classList.add('is-visible');
    digitWindows.forEach(function (win) {
      var strip = win.querySelector('.digit-strip');
      var target = win.getAttribute('data-digit');
      if (strip && target !== null) {
        strip.style.setProperty('--target-digit', target);
      }
    });
  }

  // Paso 2 / 3: disparo único al entrar en viewport.
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(section);
  } else {
    // Sin soporte de IntersectionObserver: revelar de inmediato.
    reveal();
  }
  
})();



/* ------------------------------------------------------------------
     6. Línea de tiempo del proceso de preparación (acordeón exclusivo)
     ------------------------------------------------------------------ */
(() => {

   
    
    const sections =
        document.querySelectorAll(
            '.metodo-step'
        );

    const nodes =
        document.querySelectorAll(
            '.timeline-node'
        );

    const progress =
        document.getElementById(
            'timelineProgress'
        );

    const total =
        nodes.length - 1;

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if(
                        !entry.isIntersecting
                    ) return;

                    const index =
                        Number(
                            entry.target.dataset.step
                        );

                    sections.forEach(el =>
                        el.classList.remove(
                            'is-visible'
                        )
                    );

                    entry.target.classList.add(
                        'is-visible'
                    );

                    nodes.forEach(node => {

                        node.classList.remove(
                            'is-active'
                        );

                        node.removeAttribute(
                            'aria-current'
                        );
                    });

                    nodes[index]
                    .classList.add(
                        'is-active'
                    );

                    nodes[index]
                    .setAttribute(
                        'aria-current',
                        'step'
                    );

                    const percentage =
                        (index / total) * 100;

                    progress.style.height =
                        `${percentage}%`;

                });

            },

            {
                threshold: 0.55,
                rootMargin:
                "-10% 0px -20% 0px"
            }

        );

    sections.forEach(section => {

        observer.observe(section);
    });

})();



  /* ------------------------------------------------------------------
     7. Cursos — cada tarjeta se expande de forma independiente
     ------------------------------------------------------------------ */
(function () {
  'use strict';

  const SECTION_SELECTOR = '.cuspide-courses-catalog';
  const CARD_SELECTOR = '.cuspide-courses-catalog__card';
  const INDICATOR_SELECTOR = '.cuspide-courses-catalog__card-indicator';
  const ACTIVE_CLASS = 'cuspide-courses-catalog__card--active';

  function initSection(section) {
    const cards = Array.from(section.querySelectorAll(CARD_SELECTOR));
    if (!cards.length) return;

    /* ---------------------------------------------------------------
       1) Animación de entrada por scroll (Intersection Observer)
       --------------------------------------------------------------- */
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealObserver.observe(section);

    /* ---------------------------------------------------------------
       2) Activación exclusiva por el botón "+"
       --------------------------------------------------------------- */
    function setActive(card) {
      cards.forEach((c) => {
        const isTarget = c === card;
        c.classList.toggle(ACTIVE_CLASS, isTarget);
        c.setAttribute('aria-expanded', String(isTarget));
      });
    }

    cards.forEach((card) => {
      const indicator = card.querySelector(INDICATOR_SELECTOR);
      if (!indicator) return;

      indicator.addEventListener('click', (event) => {
        // Evita que el click "suba" y dispare cualquier handler de la tarjeta
        event.stopPropagation();
        setActive(card);
      });
    });
  }

  function init() {
    document.querySelectorAll(SECTION_SELECTOR).forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ------------------------------------------------------------------
     9. Expediciones — patrón de pestañas (tabs) accesible + crossfade
        de imagen. Dos <img> superpuestas (#expImageA / #expImageB) se
        turnan el rol de "actual" para lograr un crossfade real sin
        flash ni recarga visible.
     ------------------------------------------------------------------ */
(() => {

    const track =
        document.getElementById(
            'expDeckTrack'
        );

    if(!track) return;

    const backgrounds =
        document.querySelectorAll(
            '.exp-bg-layer'
        );

    const expediciones = [
      {
        nombre: 'FITZ ROY',
        dificultad: 'DIFICULTAD ALTA',
        duracion: '1 SEMANA',
        fondo: 'assets/fitzroy-act.png',
        descripcion: 'Glaciares dinámicos, grietas ocultas y progresión alpina técnica.',
        altura: '105 M',
        lugares: ['Laguna de los Tres', 'Campamento Poincenot', 'Cumbre Fitz Roy']
      },
      {
        nombre: 'TRONADOR',
        dificultad: 'DIFICULTAD EXTREMA',
        duracion: '8 SEMANAS',
        fondo: 'assets/tronador-act.png',
        descripcion: 'La cima más alta del planeta. Hipoxia severa, temperaturas letales y exposición continua.',
        altura: '71 M',
        lugares: ['Refugio Otto Meiling', 'Glaciar Blanco', 'Cumbre Internnal']
      },
      {
        nombre: 'TORRE',
        dificultad: 'DIFICULTAD MEDIA',
        duracion: '10 DÍAS',
        fondo: 'assets/torre-act.png',
        descripcion: 'El ascenso progresivo y el ritmo con el que se aprende son icre.',
        altura: '75 M',
        lugares: ['Base del Torre', 'Campamento Niponino', 'Cumbre Sur']
      },
      {
        nombre: 'ACONCAGUA',
        dificultad: 'DIFICULTAD MEDIA',
        duracion: '2 SEMANAS',
        fondo: 'assets/aconcagua-act.png',
        descripcion: 'Lo que se gana no es una foto en la cima, certeza de haber vencido tus propios límites.',
        altura: '71 M',
        lugares: ['Campamento Base', 'Glaciar Horcones', 'Cumbre Principal']
      },
      {
        nombre: 'SAN VALENTÍN',
        dificultad: 'DIFICULTAD EXTREMA',
        duracion: '3 SEMANAS',
        fondo: 'assets/sanvalentin-act.png',
        descripcion: 'La montaña más dura de Norteamérica por clima, aislamiento y carga .',
        altura: '85 M',
        lugares: ['Campamento Kahiltna', 'Campo Alto', 'Cumbre Norte']
      }
    ];


    let active = 0;
    let bgIndex = 0;

    expediciones.forEach((exp,index)=>{

        track.insertAdjacentHTML(
            'beforeend',
            `
            <article
                class="expedicion-card"
                data-index="${index}"
                aria-label="${exp.nombre}"
            >
                <div class="expedicion-card-inner">

                   <div class="expedicion-face expedicion-face--front">
                          <figure class="expedicion-photo">
                          <img src="${exp.fondo}" alt="${exp.nombre}">
                          </figure>

                          <h3 class="expedicion-name">${exp.nombre}</h3>

                          <div class="expedicion-meta">
                          <span class="expedicion-dificultad">${exp.dificultad}</span> – ${exp.altura}
                          <br>
                          <span class="expedicion-duracion">DURACIÓN: ${exp.duracion}</span>
                          </div>
                   </div>



                  <!-- Parte trasera -->
<div class="expedicion-face expedicion-face--back">
  <h3 class="expedicion-title--back">${exp.nombre}</h3>
  <div class="expedicion-meta--back"></div>
  <p class="expedicion-text--back">${exp.descripcion}</p>
  <ul class="expedicion-list--back">
    ${exp.lugares.map(lugar => `
      <li><span class="expedicion-circle--back"></span> ${lugar}</li>
    `).join('')}
  </ul>
  <button class="cuspide-action-btn cuspide-action-btn--darkabyss expedicion-btn--back">
    <span> VER MÁS </span>
  </button>
</div>


                </div>
            </article>
            `
        );
    });

    const cards =
        [...track.children];
// Evitar que el botón trasero haga flip
cards.forEach(card => {
  const btn = card.querySelector(".expedicion-btn--back");
  if (btn) {
    btn.addEventListener("click", e => {
      e.stopPropagation(); // evita que el click llegue al card
      // acá podés poner la acción del botón, por ejemplo abrir modal o link
      console.log("Botón VER MÁS presionado en:", card.dataset.index);
    });
  }
});

    function updateDeck(){

    const len = cards.length;

    cards.forEach((card,index)=>{

        // distancia con signo (camino más corto) respecto a la activa,
        // así ninguna carta "salta" al lado contrario del abanico.
        let offset = index - active;

        offset = ((offset % len) + len) % len; // normaliza a 0..len-1

        if(offset > len / 2){
            offset -= len; // pasa al rango -2..2 (para len=5)
        }

        let x = 0;
        let y = 0;
        let z = 0;
        let rotateZ = 0;
        let rotateY = 0;
        let scale = 1;

        switch(offset){

            case 0:

                x = 0;
                y = 0;
                z = 120;

                rotateZ = 0;
                rotateY = 0;

                scale = 1;

            break;

            case 1:

                x = 115;
                y = 18;
                z = 40;

                rotateZ = 12;
                rotateY = -4;

                scale = .94;

            break;

            case 2:

                x = 190;
                y = 40;
                z = -20;

                rotateZ = 20;
                rotateY = -8;

                scale = .88;

            break;

            case -1:

                x = -115;
                y = 18;
                z = 40;

                rotateZ = -12;
                rotateY = 4;

                scale = .94;

            break;

            case -2:

                x = -190;
                y = 40;
                z = -20;

                rotateZ = -20;
                rotateY = 8;

                scale = .88;

            break;
        }

        card.style.zIndex =
            100 - Math.abs(offset);

        card.style.transform = `
            translate3d(
                calc(-50% + ${x}px),
                calc(-50% + ${y}px),
                ${z}px
            )
            rotateZ(${rotateZ}deg)
            rotateY(${rotateY}deg)
            scale(${scale})
        `;
    });

    swapBackground(
        expediciones[active].fondo
    );
}

    function swapBackground(src){

        const current =
            backgrounds[bgIndex];

        bgIndex =
            bgIndex === 0 ? 1 : 0;

        const next =
            backgrounds[bgIndex];

        next.style.backgroundImage =
            `url(${src})`;

        next.classList.add(
            'is-active'
        );

        current.classList.remove(
            'is-active'
        );
    }

    function nextCard(){

        active =
            (active + 1)
            % cards.length;

        updateDeck();
    }

    function prevCard(){

        active =
            (active - 1 + cards.length)
            % cards.length;

        updateDeck();
    }

    // ------------------------------------------------------------------
    // Botones prev/next (antes no tenían listener conectado)
    // ------------------------------------------------------------------
    const nextBtn = document.querySelector(".expediciones__btn--next");
    const prevBtn = document.querySelector(".expediciones__btn--prev");

    if(nextBtn){
        nextBtn.addEventListener("click", nextCard);
    }

    if(prevBtn){
        prevBtn.addEventListener("click", prevCard);
    }

    updateDeck();

    let startX = 0;

track.addEventListener("pointerdown", e => {
  startX = e.clientX;
});

track.addEventListener("pointerup", e => {
  const delta = e.clientX - startX;

  // arrastrar hacia la izquierda → avanza (siguiente)
  // arrastrar hacia la derecha  → retrocede (anterior)
  if (delta < -50) {
    nextCard();
  } else if (delta > 50) {
    prevCard();
  }
        }
    );

    document.addEventListener(
        'keydown',
        e => {

            // Si el foco está en un <button> (p.ej. prev/next luego de
            // clickearlo), el propio botón ya dispara su "click" nativo
            // con Enter/Espacio. Sin este corte, ese mismo Enter también
            // caía en este listener y flippeaba cards[active] justo
            // cuando "active" recién había cambiado por el click del
            // botón (la carta todavía en tránsito hacia el centro) →
            // terminaba viéndose flippeada una carta que no era la
            // del medio.
            if(e.target.closest('button')) return;

            if(e.key === 'ArrowRight')
                nextCard();

            if(e.key === 'ArrowLeft')
                prevCard();

            if(e.key === 'Enter'){

                cards[active]
                .classList.toggle(
                    'is-flipped'
                );
            }
        }
    );

    cards.forEach(card=>{

        card.addEventListener(
            'click',
            () => {

                if(
                    Number(
                        card.dataset.index
                    ) === active
                ){
                    card.classList.toggle(
                        'is-flipped'
                    );
                }
            }
        );
    });

})();


  /* ------------------------------------------------------------------
     8. Testimonios — carrusel con fundido, controles y puntos accesibles
     ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
     8. Testimonios — carrusel con fundido, controles y puntos accesibles
     ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
     8. Testimonios — carrusel con fundido, controles y puntos accesibles
     ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
     8. Testimonios — carrusel con fundido, controles y puntos accesibles
     ------------------------------------------------------------------ */
const viewport = document.querySelector(".conquistadores__viewport");
const track = document.querySelector(".conquistadores__track");

const cards = [...document.querySelectorAll(".conquistadores__card")];

const nextBtn = document.querySelector(".conquistadores__btn--next");
const prevBtn = document.querySelector(".conquistadores__btn--prev");

let currentIndex = 0;

let startX = 0;
let currentTranslate = 0;
let previousTranslate = 0;
let dragging = false;

const GAP = 24;

function getStep() {
    return cards[0].offsetWidth + GAP;
}

function getMaxIndex() {
    return Math.max(
        0,
        cards.length - Math.floor(viewport.offsetWidth / getStep())
    );
}

function updateSlider() {
  const maxIndex = getMaxIndex();

  currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

  // calcular el translate
  previousTranslate = -(currentIndex * getStep());

  // límite: no mover más allá del final del track
  const maxTranslate = -(cards.length * getStep() - viewport.offsetWidth);
  if (previousTranslate < maxTranslate) {
    previousTranslate = maxTranslate;
  }

  track.style.transform = `translateX(${previousTranslate}px)`;
}


nextBtn.addEventListener("click", () => {

    currentIndex++;

    updateSlider();

});

prevBtn.addEventListener("click", () => {

    currentIndex--;

    updateSlider();

});

track.addEventListener("pointerdown", (e) => {

    if (window.innerWidth < 768) return;

    dragging = true;

    startX = e.clientX;

    currentTranslate = previousTranslate;

    track.classList.add("dragging");

    track.setPointerCapture(e.pointerId);

});

track.addEventListener("pointermove", (e) => {

    if (!dragging) return;

    const delta = e.clientX - startX;

    track.style.transform = `translateX(${currentTranslate + delta}px)`;

});

function stopDragging(e) {

    if (!dragging) return;

    dragging = false;

    track.classList.remove("dragging");

    const delta = e.clientX - startX;

    currentTranslate += delta;

    currentIndex = Math.round(Math.abs(currentTranslate) / getStep());

    updateSlider();

}

track.addEventListener("pointerup", stopDragging);
track.addEventListener("pointercancel", stopDragging);

window.addEventListener("resize", updateSlider);

updateSlider();

/* ------------------------------------------------------------------
   Animación de entrada al scroll (fade + slide-up con stagger)
   ------------------------------------------------------------------ */
(function initConquistadoresReveal() {

    const section = document.getElementById("conquistadores");
    if (!section) return;

    const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const motionOff =
        document.documentElement.dataset.motion === "reduced";

    // si el usuario prefiere movimiento reducido, no animamos nada:
    // el contenido queda visible de entrada.
    if (prefersReduced || motionOff) return;

    section.classList.add("conquistadores--will-animate");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    section.classList.add("is-visible");
                    observer.unobserve(section);
                }
            });
        },
        { threshold: 0.2 }
    );

    observer.observe(section);

})();


/* ==========================================
   CÚSPIDE · ESCUELA DE GUÍAS
========================================== */
(function () {
  'use strict';

  /* ── Elementos ─────────────────────────────────────── */
  var section     = document.querySelector('.cuspide-academy-launch');
  if (!section) return;

  var info        = section.querySelector('.cuspide-academy-launch__info');
  var thumbs      = section.querySelectorAll('.cuspide-academy-launch__thumb');
  var mainImg     = section.querySelector('.cuspide-academy-launch__main-img');
  var visualSpace = section.querySelector('.cuspide-academy-launch__visual-space');
  var bgLayer     = section.querySelector('.cuspide-academy-launch__layer--background');
  var fgLayer     = section.querySelector('.cuspide-academy-launch__layer--foreground');

  /* ── Detectar preferencia de movimiento reducido ────── */
  function motionIsReduced() {
    var htmlReduced = document.documentElement.getAttribute('data-motion') === 'reduced';
    var osReduced   = typeof window.matchMedia === 'function'
                      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return htmlReduced || osReduced;
  }

  /* ── Detectar dispositivo táctil / sin puntero fino ── */
  function isTouchDevice() {
    var noFinePointer = typeof window.matchMedia === 'function'
                        && window.matchMedia('(pointer: coarse)').matches;
    var narrowScreen = window.innerWidth < 768;
    return noFinePointer || narrowScreen;
  }

  /* ══════════════════════════════════════════════════════
     1. SCROLL REVEAL con IntersectionObserver
     ══════════════════════════════════════════════════════
     Si el usuario prefiere no tener movimiento, se marca
     todo como visible inmediatamente sin transición.
  */
  function revealAll() {
    if (info)    info.classList.add('is-visible');
    if (mainImg) mainImg.classList.add('is-visible');
    thumbs.forEach(function (t) { t.classList.add('is-visible'); });
  }

  if (motionIsReduced()) {
    /* Sin animación: estado final visible desde el inicio */
    revealAll();
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          /* 1a. Bloque de texto: fade + slide elástico */
          if (info) info.classList.add('is-visible');

          /* 1b. Miniaturas: entrada escalonada (el CSS usa --stagger-i) */
          thumbs.forEach(function (thumb) {
            thumb.classList.add('is-visible');
          });

          /* 1c. Imagen principal: se asienta con retardo (ver CSS transition-delay) */
          if (mainImg) mainImg.classList.add('is-visible');

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
  } else {
    /* Fallback sin soporte */
    revealAll();
  }

  /* ══════════════════════════════════════════════════════
     2. PARALLAX 2D — mousemove (solo desktop, sin reduced-motion)

     Factor de desplazamiento:
       BG: ±18px (miniaturas traseras — se mueven MÁS)
       FG: ± 8px (imagen frontal — se mueve MENOS y en opuesto)

     Solo se usan translateX / translateY.
     Cero perspectivas, cero rotaciones 3D.
  ══════════════════════════════════════════════════════ */
  var BG_FACTOR = 18; /* px máximos de desplazamiento del fondo */
  var FG_FACTOR =  8; /* px máximos de desplazamiento del frente */

  var rafPending = false;
  var latestDx = 0;
  var latestDy = 0;

  function applyParallax() {
    if (bgLayer) {
      bgLayer.style.transform =
        'translateX(' + (latestDx * BG_FACTOR).toFixed(2) + 'px) ' +
        'translateY(' + (latestDy * BG_FACTOR).toFixed(2) + 'px)';
    }
    if (fgLayer) {
      fgLayer.style.transform =
        /* Dirección opuesta al BG, menor magnitud */
        'translateX(' + (-latestDx * FG_FACTOR).toFixed(2) + 'px) ' +
        'translateY(' + (-latestDy * FG_FACTOR).toFixed(2) + 'px)';
    }
    rafPending = false;
  }

  function onMouseMove(e) {
    var rect = visualSpace.getBoundingClientRect();
    var cx   = rect.left + rect.width  / 2;
    var cy   = rect.top  + rect.height / 2;

    /* Normalizar a rango -1 … 1 relativo al centro del contenedor */
    latestDx = (e.clientX - cx) / (rect.width  / 2);
    latestDy = (e.clientY - cy) / (rect.height / 2);

    /* Clamp para no salirse del rango */
    latestDx = Math.max(-1, Math.min(1, latestDx));
    latestDy = Math.max(-1, Math.min(1, latestDy));

    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(applyParallax);
    }
  }

  function resetParallax() {
    latestDx = 0;
    latestDy = 0;
    if (bgLayer) bgLayer.style.transform = '';
    if (fgLayer) fgLayer.style.transform = '';
  }

  function attachParallax() {
    if (!visualSpace) return;
    if (motionIsReduced() || isTouchDevice()) return; /* guardia doble */

    visualSpace.addEventListener('mousemove', onMouseMove, { passive: true });
    visualSpace.addEventListener('mouseleave', resetParallax);
  }

  function detachParallax() {
    if (!visualSpace) return;
    visualSpace.removeEventListener('mousemove', onMouseMove);
    visualSpace.removeEventListener('mouseleave', resetParallax);
    resetParallax();
  }

  attachParallax();

  /* ── Re-evaluar parallax al cambiar el tamaño de ventana ── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (motionIsReduced() || isTouchDevice()) {
        detachParallax();
      } else {
        attachParallax();
      }
    }, 250);
  });

  /* ── Reaccionar al toggle manual de movimiento del sitio ── */
  var motionToggleBtn = document.getElementById('motionToggle');
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', function () {
      /* El toggle ya mutó data-motion antes de que llegue el evento */
      setTimeout(function () {
        if (motionIsReduced()) {
          detachParallax();
        } else {
          attachParallax();
        }
      }, 50);
    });
  }

})();


  /* ------------------------------------------------------------------
     11. Formulario de contacto (Campamento Base)
         NOTA: esto es un envío simulado en el cliente. Reemplazar el
         bloque marcado por la integración real (fetch a tu backend,
         servicio de email transaccional, Google Sheets, CRM, etc.).
     ------------------------------------------------------------------ */
const summitForm = document.getElementById("summitForm");
const formSuccess = document.getElementById("formSuccess");

summitForm.addEventListener("submit", (e) => {
  e.preventDefault(); // 👈 esta línea evita que el formulario se envíe y cambie de página

  formSuccess.classList.add("show");

  summitForm.reset();

  setTimeout(() => {
    formSuccess.classList.remove("show");
  }, 5000);
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
});
