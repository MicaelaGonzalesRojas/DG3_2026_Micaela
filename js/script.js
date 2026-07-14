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




/* ---------------------------------------------------------------------
   HEADER — fondo al scrollear + auto-hide (baja=oculta, sube=reaparece)
   --------------------------------------------------------------------- */
const header = document.querySelector('.site-header');

const HIDE_THRESHOLD = 120;    // no se esconde hasta pasar este scroll
const HIDE_DISTANCE = 180;     // px continuos hacia abajo que "aguanta" visible antes de esconderse
const DELTA = 6;               // ignora micro-scrolls (evita parpadeo)

let lastScrollY = window.scrollY;
let downAccum = 0; // distancia acumulada bajando de forma continua
let ticking = false;

function updateHeader() {
  const currentY = window.scrollY;

  const navOpen = navList.classList.contains('is-open');
  const diff = currentY - lastScrollY;

  if (currentY <= HIDE_THRESHOLD) {
    downAccum = 0; // cerca del top siempre arranca "fresco"
  }

  if (!navOpen && Math.abs(diff) > DELTA) {
    if (diff > 0) {
      // bajando: acumula distancia, recién se esconde al pasar el colchón
      downAccum += diff;

      if (currentY > HIDE_THRESHOLD && downAccum > HIDE_DISTANCE) {
        header.classList.add('header--hidden');
      }
    } else {
      // subiendo: reaparece al toque y resetea el colchón
      downAccum = 0;
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentY;
  }

  ticking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  },
  { passive: true }
);

/* Toggle menú mobile */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

navToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));

  // Con el menú abierto, el header nunca debe esconderse a mitad de la interacción
  if (open) {
    header.classList.remove('header--hidden');
  }
});

navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Estado inicial correcto si la página ya carga scrolleada
updateHeader();


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

/*==================================
HOME INTRO
==================================*/

const homeIntro = document.querySelector(".cuspide-home-intro");

if(homeIntro){

let hasPlayed=false;

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting && !hasPlayed){

hasPlayed=true;

homeIntro.classList.add("is-visible");

animateCounters();

}

});

},{
threshold:.35
});

observer.observe(homeIntro);

}

/*==================================
COUNTERS
==================================*/

function animateCounters(){

const counters=document.querySelectorAll(".counter");

counters.forEach(counter=>{

const target=Number(counter.dataset.target);

const prefix=counter.dataset.prefix || "";

const duration=1800;

const start=performance.now();

function update(now){

const progress=Math.min((now-start)/duration,1);

const eased=1-Math.pow(1-progress,3);

const value=Math.floor(eased*target);

counter.textContent=prefix+value;

if(progress<1){

requestAnimationFrame(update);

}else{

counter.textContent=prefix+target;

}

}

requestAnimationFrame(update);

});

}



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

    /* ------------------------------------------------------------------
       Datos de cada etapa, leídos una sola vez desde el DOM existente
       (h3 + p dentro de cada .metodo-step). Única fuente de verdad,
       usada tanto por el desktop (ya renderizado) como por el panel
       fijo de mobile.
       ------------------------------------------------------------------ */
    const steps = Array.from(sections).map((section, i) => {
        const h3 = section.querySelector('.metodo-step__text h3');
        const p  = section.querySelector('.metodo-step__text p');
        return {
            index: i,
            number: String(i + 1).padStart(2, '0'),
            title: h3 ? h3.textContent.trim() : '',
            desc: p ? p.textContent.trim().replace(/\s+/g, ' ') : '',
        };
    });

    /* ------------------------------------------------------------------
       DESKTOP — accordion vertical con fade-in por scroll (sin cambios)
       ------------------------------------------------------------------ */
    const desktopObserver =
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

    /* ------------------------------------------------------------------
       MOBILE — scroll horizontal nativo de imágenes + panel de texto
       fijo, actualizado con una transición limpia (fade + micro-slide).
       ------------------------------------------------------------------ */
    const mobileContent  = document.getElementById('metodologiaContent');
    const mobileInfo     = document.getElementById('metodologiaMobileInfo');
    const mobileTitle    = document.getElementById('metodologiaMobileTitle');
    const mobileDesc     = document.getElementById('metodologiaMobileDesc');

    let mobileObserver = null;
    let activeMobileIndex = -1;
    let switchTimer = null;

    function writeMobileStep(index) {
        const step = steps[index];
        if (!step) return;
        mobileTitle.textContent = `${step.number} - ${step.title}`;
        mobileDesc.textContent = step.desc;
    }

    function setActiveNode(index) {
        nodes.forEach(node => {
            node.classList.remove('is-active');
            node.removeAttribute('aria-current');
        });
        if (nodes[index]) {
            nodes[index].classList.add('is-active');
            nodes[index].setAttribute('aria-current', 'step');
        }
    }

    function goToMobileStep(index, { animate }) {
        if (index === activeMobileIndex) return;
        activeMobileIndex = index;
        setActiveNode(index);

        if (!animate) {
            writeMobileStep(index);
            return;
        }

        clearTimeout(switchTimer);
        mobileInfo.classList.add('is-switching');
        switchTimer = setTimeout(() => {
            writeMobileStep(index);
            mobileInfo.classList.remove('is-switching');
        }, 220);
    }

    function initMobileObserver() {
        if (mobileObserver || !mobileContent) return;

        mobileObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const index = Number(entry.target.dataset.step);
                    goToMobileStep(index, { animate: true });
                });
            },
            {
                root: mobileContent,
                threshold: 0.6,
            }
        );

        sections.forEach(section => mobileObserver.observe(section));

        // Estado inicial sin animación (evita un fade innecesario al cargar)
        activeMobileIndex = -1;
        goToMobileStep(0, { animate: false });
    }

    function teardownMobileObserver() {
        if (!mobileObserver) return;
        mobileObserver.disconnect();
        mobileObserver = null;
    }

    const mql = window.matchMedia('(max-width: 768px)');

    function syncMode(isMobile) {
        if (isMobile) {
            desktopObserver.disconnect();
            initMobileObserver();
        } else {
            teardownMobileObserver();
            sections.forEach(section => desktopObserver.observe(section));
        }
    }

    syncMode(mql.matches);

    if (mql.addEventListener) {
        mql.addEventListener('change', e => syncMode(e.matches));
    } else if (mql.addListener) {
        // Safari viejo
        mql.addListener(e => syncMode(e.matches));
    }

})();



  /* ------------------------------------------------------------------
     7. Cursos — cada tarjeta se expande de forma independiente
     ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
     7. Cursos — activación por click en la card entera O en el botón "+"
     ------------------------------------------------------------------ */
(function () {
  'use strict';

  const SECTION_SELECTOR   = '.cuspide-courses-catalog';
  const CARD_SELECTOR      = '.cuspide-courses-catalog__card';
  const INDICATOR_SELECTOR = '.cuspide-courses-catalog__card-indicator';
  const CTA_SELECTOR       = '.cuspide-action-btn';
  const ACTIVE_CLASS       = 'cuspide-courses-catalog__card--active';

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
       2) Activación exclusiva: activa una tarjeta, desactiva el resto
       --------------------------------------------------------------- */
    function setActive(card) {
      cards.forEach((c) => {
        const isTarget = c === card;
        c.classList.toggle(ACTIVE_CLASS, isTarget);
        c.setAttribute('aria-expanded', String(isTarget));
      });
    }

    /* ---------------------------------------------------------------
       3) Listeners de click
          · Click en la card entera → activa
          · Click en el botón "+" → activa (stopPropagation para no
            disparar ambos handlers a la vez)
          · Click en el botón "Ver programa" (CTA) → NO activa/desactiva,
            deja seguir la navegación normalmente (stopPropagation)
       --------------------------------------------------------------- */
    cards.forEach((card) => {

      /* Click en la card completa */
      card.addEventListener('click', () => {
        setActive(card);
      });

      /* Click en el "+" — ya lo maneja el handler de la card,
         pero stopPropagation evita doble disparo si hay bubbling */
      const indicator = card.querySelector(INDICATOR_SELECTOR);
      if (indicator) {
        indicator.addEventListener('click', (e) => {
          e.stopPropagation();
          setActive(card);
        });
      }

      /* Click en "Ver programa" — deja navegar sin cambiar el estado */
      const cta = card.querySelector(CTA_SELECTOR);
      if (cta) {
        cta.addEventListener('click', (e) => {
          e.stopPropagation();
          /* La navegación del <a href> sigue su curso normalmente */
        });
      }
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

    // ------------------------------------------------------------------
    // Animación de entrada: al entrar la sección en pantalla, se agrega
    // 'is-visible' (dispara el CSS: headline, stage y stagger de cards).
    // Se dispara una sola vez.
    // ------------------------------------------------------------------
    const deckSection =
        document.querySelector('.expediciones-deck');

    if(deckSection && 'IntersectionObserver' in window){

        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if(!entry.isIntersecting) return;
                    deckSection.classList.add('is-visible');
                    revealObserver.unobserve(deckSection);
                });
            },
            { threshold: 0.25 }
        );

        revealObserver.observe(deckSection);

    } else if(deckSection){
        // sin soporte de IntersectionObserver: se muestra directamente
        deckSection.classList.add('is-visible');
    }

    const backgrounds =
        document.querySelectorAll(
            '.exp-bg-layer'
        );

    const expediciones = [
      {
        nombre: 'FITZ ROY',
        dificultad: 'DIFICULTAD ALTA',
        duracion: '1 SEM',
        fondo: 'assets/fitzroy-act.png',
        descripcion: 'Glaciares dinámicos, grietas ocultas y progresión alpina técnica.',
        altura: '105 M',
        ubicacion: 'SANTA CRUZ, ARGENTINA',
        precio: '$800.000',
        lugares: ['Laguna de los Tres', 'Campamento Poincenot', 'Cumbre Fitz Roy']
      },
      {
        nombre: 'TRONADOR',
        dificultad: 'DIFICULTAD ALTA',
        duracion: '8 SEM',
        fondo: 'assets/tronador-act.png',
        descripcion: 'La cima más alta del planeta. Hipoxia severa, temperaturas letales y exposición continua.',
        altura: '71 M',
        ubicacion: 'RÍO NEGRO, ARGENTINA',
        precio: '$900.000',
        lugares: ['Refugio Otto Meiling', 'Glaciar Blanco', 'Cumbre Internnal']
      },
      {
        nombre: 'TORRE',
        dificultad: 'DIFICULTAD MEDIA',
        duracion: '10 DÍAS',
        fondo: 'assets/torre-act.png',
        descripcion: 'El ascenso progresivo y el ritmo con el que se aprende son icre.',
        altura: '75 M',
        ubicacion: 'SANTA CRUZ, ARGENTINA',
        precio: '$650.000',
        lugares: ['Base del Torre', 'Campamento Niponino', 'Cumbre Sur']
      },
      {
        nombre: 'ACONCAGUA',
        dificultad: 'DIFICULTAD MEDIA',
        duracion: '2 SEM',
        fondo: 'assets/aconcagua-act.png',
        descripcion: 'Lo que se gana no es una foto en la cima, certeza de haber vencido tus propios límites.',
        altura: '71 M',
        ubicacion: 'MENDOZA, ARGENTINA',
        precio: '$950.000',
        lugares: ['Campamento Base', 'Glaciar Horcones', 'Cumbre Principal']
      },
      {
        nombre: 'SAN VALENTÍN',
        dificultad: 'DIFICULTAD ALTA',
        duracion: '3 SEM',
        fondo: 'assets/sanvalentin-act.png',
        descripcion: 'La montaña más dura de Norteamérica por clima, aislamiento y carga .',
        altura: '85 M',
        ubicacion: 'AYSÉN, CHILE',
        precio: '$950.000',
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
  <div class="expedicion-back-top">
    <h3 class="expedicion-title--back">${exp.nombre}</h3>

    <p class="expedicion-location--back">
      <svg class="expedicion-location-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="12" cy="9" r="2.3" stroke="currentColor" stroke-width="1.6"/>
      </svg>
      ${exp.ubicacion}
    </p>

    <p class="expedicion-text--back">${exp.descripcion}</p>
  </div>

  <div class="expedicion-back-bottom">
    <ul class="expedicion-meta--back">
      <li>
        <span class="expedicion-meta-label">Duración</span>
        <span class="expedicion-meta-value">${exp.duracion}</span>
      </li>
      <li>
        <span class="expedicion-meta-label">Altitud</span>
        <span class="expedicion-meta-value">${exp.altura}</span>
      </li>
      <li>
        <span class="expedicion-meta-label">Nivel</span>
        <span class="expedicion-meta-value">${exp.dificultad.replace('DIFICULTAD ', '')}</span>
      </li>
    </ul>

    <div class="expedicion-back-footer">
      <div class="expedicion-precio--back">
        <span class="expedicion-precio-label">Precio total</span>
        <span class="expedicion-precio-value">${exp.precio}</span>
      </div>

      <button class="cuspide-action-btn cuspide-action-btn--darkabyss expedicion-btn--back">
        <span>Ver más</span>
      </button>
    </div>
  </div>
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
    // Los botones prev/next se eliminaron del HTML: la navegación queda
    // cubierta por drag/swipe (pointerdown/up más abajo) y por teclado
    // (← → sobre el stage). nextCard()/prevCard() siguen existiendo tal
    // cual, sólo que ahora los dispara exclusivamente esa interacción.
    // ------------------------------------------------------------------

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

    // ------------------------------------------------------------------
    // Click sobre una card:
    //  - si NO es la activa -> la centra (primera presión = elegirla)
    //  - si YA es la activa -> se da vuelta mostrando el reverso
    //    (segunda presión sobre la misma = ver detalle)
    // Ninguna interacción anterior (drag, teclado) se modificó.
    // ------------------------------------------------------------------
    cards.forEach(card=>{

        card.addEventListener(
            'click',
            () => {

                const index =
                    Number(
                        card.dataset.index
                    );

                if(index !== active){

                    active = index;
                    updateDeck();
                    return;
                }

                card.classList.toggle(
                    'is-flipped'
                );
            }
        );
    });

})();
  /* ------------------------------------------------------------------
     8. Testimonios — carrusel con fundido, controles y puntos accesibles
     ------------------------------------------------------------------ */

(function () {
  'use strict';
 
  const SECTION_ID = 'conquistadores';
  const SPEED_PX_PER_SEC = 45;
  const CLICK_THRESHOLD_PX = 6; // por debajo de esto, se considera "click" y no "drag"
 
  /* ------------------------------------------------------------------
     Animación de entrada (una sola vez)
     ------------------------------------------------------------------ */
  function initReveal(section) {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
 
    const motionOff = document.documentElement.dataset.motion === 'reduced';
 
    if (prefersReduced || motionOff) return;
 
    section.classList.add('conquistadores--will-animate');
 
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('is-visible');
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.2 }
    );
 
    observer.observe(section);
  }
 
  /* ------------------------------------------------------------------
     Scroll infinito + pausa por click + control por drag/swipe
     ------------------------------------------------------------------ */
  function initInfiniteScroll(section) {
    const viewport = section.querySelector('.conquistadores__viewport');
    const track = section.querySelector('.conquistadores__track');
 
    if (!viewport || !track) return;
 
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
 
    let singleSetWidth = 0;
    let position = 0;
    let paused = false;
    let dragging = false;
    let moved = false;
    let dragStartX = 0;
    let dragStartPosition = 0;
    let lastTimestamp = null;
    let rafId = null;
 
    function measure() {
      // El track tiene el set real + su clon → la mitad es un set completo.
      singleSetWidth = track.scrollWidth / 2;
    }
 
    function wrap() {
      if (singleSetWidth <= 0) return;
      if (position >= singleSetWidth) position -= singleSetWidth;
      if (position < 0) position += singleSetWidth;
    }
 
    function render() {
      track.style.transform = `translateX(${-position}px)`;
    }
 
    function tick(timestamp) {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
 
      if (!paused && !dragging && !reducedQuery.matches) {
        position += (SPEED_PX_PER_SEC * delta) / 1000;
        wrap();
        render();
      }
 
      rafId = requestAnimationFrame(tick);
    }
 
    function start() {
      if (rafId !== null) return;
      lastTimestamp = null;
      rafId = requestAnimationFrame(tick);
    }
 
    function stop() {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    }
 
    /* -------------------- Drag / swipe -------------------- */
    function onPointerDown(event) {
      dragging = true;
      moved = false;
      dragStartX = event.clientX;
      dragStartPosition = position;
      viewport.classList.add('dragging');
      viewport.setPointerCapture(event.pointerId);
    }
 
    function onPointerMove(event) {
      if (!dragging) return;
 
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > CLICK_THRESHOLD_PX) moved = true;
 
      position = dragStartPosition - delta;
      wrap();
      render();
    }
 
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('dragging');
 
      if (!moved) {
        // Tap sin desplazamiento real → toggle de pausa
        paused = !paused;
        viewport.setAttribute('aria-pressed', String(paused));
      }
    }
 
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
 
    // Evita que el navegador intente iniciar un drag-select de texto/imagen
    viewport.addEventListener('dragstart', (e) => e.preventDefault());
 
    /* -------------------- Teclado (accesibilidad) -------------------- */
    viewport.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        paused = !paused;
        viewport.setAttribute('aria-pressed', String(paused));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        position += 80;
        wrap();
        render();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        position -= 80;
        wrap();
        render();
      }
    });
 
    /* -------------------- Medición / resize -------------------- */
    const resizeObserver = new ResizeObserver(() => {
      measure();
      wrap();
      render();
    });
 
    resizeObserver.observe(track);
    measure();
    render();
    start();
  }
 
  function init() {
    const section = document.getElementById(SECTION_ID);
    if (!section) return;
 
    initReveal(section);
    initInfiniteScroll(section);
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
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


/**
 * CUSPIDE — Sección FOOTER (Terminal Footer)
 * -----------------------------------------------------------------------
 * Intersection Observer: dispara la animación de entrada en cascada
 * (identidad con fade, columnas con stagger de 0.1s vía CSS nth-of-type)
 * una sola vez, cuando el footer alcanza la base de la pantalla.
 * -----------------------------------------------------------------------
 */

(function () {
  'use strict';

  const SECTION_SELECTOR = '.cuspide-terminal-footer';

  function initFooter(footer) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            footer.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealObserver.observe(footer);
  }

  function init() {
    document.querySelectorAll(SECTION_SELECTOR).forEach(initFooter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


  /* ------------------------------------------------------------------
     11. Formulario de contacto (Campamento Base)
         NOTA: esto es un envío simulado en el cliente. Reemplazar el
         bloque marcado por la integración real (fetch a tu backend,
         servicio de email transaccional, Google Sheets, CRM, etc.).
     ------------------------------------------------------------------ */
/*=========================================
CONVERSION ZONE
=========================================*/

const conversionSection = document.querySelector(".cuspide-conversion-zone");

if(conversionSection){

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

conversionSection.classList.add("is-visible");

const fields = conversionSection.querySelectorAll(".cuspide-field");

fields.forEach((field,index)=>{

field.style.transitionDelay=`${index*80}ms`;

});

}

});

},{
threshold:.25
});

observer.observe(conversionSection);

}

/*=========================================
VALIDACIÓN
=========================================*/

const form=document.querySelector(".cuspide-conversion-zone__form-block");

if(form){

form.addEventListener("submit",function(e){

e.preventDefault();

const email=form.querySelector('input[type="email"]');

const name=form.querySelector('input[type="text"]');

let valid=true;

[email,name].forEach(field=>{

field.classList.remove("is-error");

if(!field.value.trim()){

field.classList.add("is-error");
valid=false;

}

});

const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(email.value && !regex.test(email.value)){

email.classList.add("is-error");
valid=false;

}

if(valid){

form.reset();

}

});

}

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

/* =========================




  PAGINA DETALLE




========================= */
/* ====================================================================
   CÚSPIDE — Curso Supervivencia en Montaña
   JS: header on scroll, accordion, testimonial carousel, reveals
   ==================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) document.documentElement.setAttribute('data-motion', 'reduced');


/* ---------------------------------------------------------------------
   HEADER — fondo al scrollear + auto-hide (baja=oculta, sube=reaparece)
   --------------------------------------------------------------------- */
const header = document.querySelector('.site-header');

const HIDE_THRESHOLD = 120;    // no se esconde hasta pasar este scroll
const HIDE_DISTANCE = 180;     // px continuos hacia abajo que "aguanta" visible antes de esconderse
const DELTA = 6;               // ignora micro-scrolls (evita parpadeo)

let lastScrollY = window.scrollY;
let downAccum = 0; // distancia acumulada bajando de forma continua
let ticking = false;

function updateHeader() {
  const currentY = window.scrollY;

  const navOpen = navList.classList.contains('is-open');
  const diff = currentY - lastScrollY;

  if (currentY <= HIDE_THRESHOLD) {
    downAccum = 0; // cerca del top siempre arranca "fresco"
  }

  if (!navOpen && Math.abs(diff) > DELTA) {
    if (diff > 0) {
      // bajando: acumula distancia, recién se esconde al pasar el colchón
      downAccum += diff;

      if (currentY > HIDE_THRESHOLD && downAccum > HIDE_DISTANCE) {
        header.classList.add('header--hidden');
      }
    } else {
      // subiendo: reaparece al toque y resetea el colchón
      downAccum = 0;
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentY;
  }

  ticking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  },
  { passive: true }
);

/* Toggle menú mobile */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

navToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));

  // Con el menú abierto, el header nunca debe esconderse a mitad de la interacción
  if (open) {
    header.classList.remove('header--hidden');
  }
});

navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Estado inicial correcto si la página ya carga scrolleada
updateHeader();



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
   LÍNEA DE TIEMPO — el progreso se calcula en base
   a la posición real del scroll, no en saltos por bloque.
   Esto evita el desfasaje en mobile (barra de direcciones
   dinámica, scroll con inercia, etc.)
================================== */

const lessonTimeline = document.getElementById("lessonTimeline");
const lessonProgress = document.getElementById("lessonProgress");

function updateLessonProgress(){

    if(!lessonTimeline || !lessonProgress) return;

    const rect = lessonTimeline.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Punto de referencia: el centro del viewport.
    const center = viewportH * 0.5;

    // Cuánto del timeline ya "pasó" ese punto de referencia.
    const scrolled = center - rect.top;

    let percentage = (scrolled / rect.height) * 100;

    percentage = Math.max(0, Math.min(100, percentage));

    lessonProgress.style.height = `${percentage}%`;

}

let lessonTicking = false;

function onLessonScroll(){

    if(lessonTicking) return;

    lessonTicking = true;

    window.requestAnimationFrame(()=>{

        updateLessonProgress();

        lessonTicking = false;

    });

}

window.addEventListener("scroll", onLessonScroll, {passive:true});
window.addEventListener("resize", onLessonScroll);

updateLessonProgress();




document.addEventListener("DOMContentLoaded",()=>{

const section=document.querySelector(".cuspide-course-heroes");

const track=document.querySelector(".cuspide-course-heroes__track");

const prev=document.querySelector(".cuspide-course-heroes__prev");

const next=document.querySelector(".cuspide-course-heroes__next");

if(!section) return;

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

section.classList.add("cuspide-course-heroes--visible");

}

});

},{
threshold:.25
});

observer.observe(section);

let index=0;

function visibleCards(){

return window.innerWidth<768?1:3;

}

function updateSlider(){

const card=track.querySelector(".cuspide-course-heroes__card");

const gap=24;

const width=card.offsetWidth+gap;

track.style.transform=`translateX(-${index*width}px)`;

}

next.addEventListener("click",()=>{

const total=track.children.length;

const max=Math.max(0,total-visibleCards());

if(index<max){

index++;

updateSlider();

}

});

prev.addEventListener("click",()=>{

if(index>0){

index--;

updateSlider();

}

});

window.addEventListener("resize",updateSlider);

});





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



/**
 * CUSPIDE — Sección FOOTER (Terminal Footer)
 * -----------------------------------------------------------------------
 * Intersection Observer: dispara la animación de entrada en cascada
 * (identidad con fade, columnas con stagger de 0.1s vía CSS nth-of-type)
 * una sola vez, cuando el footer alcanza la base de la pantalla.
 * -----------------------------------------------------------------------
 */

(function () {
  'use strict';

  const SECTION_SELECTOR = '.cuspide-terminal-footer';

  function initFooter(footer) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            footer.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealObserver.observe(footer);
  }

  function init() {
    document.querySelectorAll(SECTION_SELECTOR).forEach(initFooter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


})();


/* ==========================================




  BIBLIOTECA UI




========================================== */
/* =====================================================================
   CÚSPIDE — UI KIT
   Scrollspy simple: resalta el link del nav de la sección visible.
   El scroll suave ya lo resuelve `html { scroll-behavior: smooth }`
   definido en style.css, así que acá sólo hace falta el highlight.
   ===================================================================== */
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

   
   (() => {
  'use strict';

  const links = Array.from(document.querySelectorAll('.cuspide-uikit__nav-link'));
  const sections = links
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const linkFor = (id) => links.find(link => link.getAttribute('href') === `#${id}`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.remove('is-active'));
        const active = linkFor(entry.target.id);
        if (active) active.classList.add('is-active');
      });
    },
    {
      rootMargin: '-45% 0px -50% 0px', // se activa cuando la sección cruza la mitad de la pantalla
      threshold: 0,
    }
  );

  sections.forEach(section => observer.observe(section));
})();
