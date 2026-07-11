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
     0. Estado de movimiento (opcional: toggle manual si existe en el
        DOM + preferencia de sistema). El botón fue retirado del header,
        así que esto ahora sigue automáticamente prefers-reduced-motion;
        si en el futuro se reincorpora un botón con id="motionToggle"
        y span#motionToggleLabel, vuelve a funcionar sin tocar más código.
     ------------------------------------------------------------------ */
  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.getElementById('motionToggle');
  const motionLabel = document.getElementById('motionToggleLabel');
  let manualOverride = null; // null = seguir al sistema | true = forzar reducido | false = forzar completo

  function applyMotionState() {
    const reduced = manualOverride !== null ? manualOverride : prefersReducedQuery.matches;
    root.setAttribute('data-motion', reduced ? 'reduced' : 'full');

    if (motionToggle) motionToggle.setAttribute('aria-pressed', String(reduced));
    if (motionLabel) motionLabel.textContent = reduced ? 'Reanudar movimiento' : 'Pausar movimiento';
  }

  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      const currentlyReduced = root.getAttribute('data-motion') === 'reduced';
      manualOverride = !currentlyReduced;
      applyMotionState();
    });
  }
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
   HEROES DE LA MONTAÑA
   ------------------------------------------------------------------ */
(() => {
  'use strict';

  const SECTION_SELECTOR = '.cuspide-heroes-showcase';
  const ROTATE_MS = 650; // debe ser >= --dur-base para el cleanup

  /* -------------------------------------------------------------------
     1. DATOS
     ----------------------------------------------------------------- */
  const HEROES = [
    {
      id: 'hector-valvid',
      name: 'Hector Valvid',
      desc: 'Ejercicios de fuerza, resistencia y movilidad, adaptados a cada tipo de discapacidad. Se busca fortalecer el cuerpo antes de cada ascenso.',
      disability: 'Ceguera completa',
      summit: 'Monte Everest',
      img: 'assets/heroe-1.jpg',
    },
    {
      id: 'marina-fos',
      name: 'Marina Fos',
      desc: 'Rutinas de cardio en altitud y trabajo de equilibrio adaptado, diseñadas junto a su equipo médico y guías de montaña certificados.',
      disability: 'Amputación transtibial',
      summit: 'Aconcagua',
      img: 'assets/heroe-2.jpg',
    },
    {
      id: 'diego-serra',
      name: 'Diego Serra',
      desc: 'Entrenamiento de tren superior y técnica de trineo adaptado para nieve profunda, con foco en resistencia cardiovascular.',
      disability: 'Lesión medular T6',
      summit: 'Kilimanjaro',
      img: 'assets/heroe-3.jpg',
    },
    {
      id: 'lucia-andrade',
      name: 'Lucía Andrade',
      desc: 'Programa de propiocepción y fuerza funcional, adaptado para terrenos irregulares y descensos técnicos de alta exigencia.',
      disability: 'Baja visión progresiva',
      summit: 'Denali',
      img: 'assets/heroe-4.jpg',
    },
    {
      id: 'bruno-castex',
      name: 'Bruno Castex',
      desc: 'Trabajo de estabilidad de core y respiración en altura, con simulacros de descompresión progresiva antes de cada expedición.',
      disability: 'Amputación de brazo',
      summit: 'Elbrus',
      img: 'assets/per5.jpg',
    },
    {
      id: 'sofia-ibarra',
      name: 'Sofía Ibarra',
      desc: 'Entrenamiento funcional de piernas y coordinación en hielo, con foco en autonomía total durante el ascenso final.',
      disability: 'Parálisis parcial de piernas',
      summit: 'Vinson Massif',
      img: 'assets/heroe-4.jpg',
    },
  ];

  /* -------------------------------------------------------------------
     2. INICIALIZACIÓN POR INSTANCIA
     ----------------------------------------------------------------- */
  document.querySelectorAll(SECTION_SELECTOR).forEach(initHeroesShowcase);

  function initHeroesShowcase(section) {
    const gallery    = section.querySelector('.cuspide-heroes-showcase__gallery');
    const thumbSlots = Array.from(section.querySelectorAll('.cuspide-heroes-showcase__thumb-slot'));
    const mainFrame  = section.querySelector('.cuspide-heroes-showcase__main-frame');
    const bioContent = section.querySelector('.cuspide-heroes-showcase__bio-content');
    const nextBtn    = section.querySelector('.cuspide-heroes-showcase__next');
    const pool       = section.querySelector('.cuspide-heroes-showcase__pool');

    const bioFields = {
      name: bioContent.querySelector('[data-bio="name"]'),
      desc: bioContent.querySelector('[data-bio="desc"]'),
      disability: bioContent.querySelector('[data-bio="disability"]'),
      summit: bioContent.querySelector('[data-bio="summit"]'),
    };

    if (!mainFrame || thumbSlots.length === 0 || !pool) return;

    const N = HEROES.length;
    const WINDOW_SIZE = 1 + thumbSlots.length; // main + miniaturas

    const prefersReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let start = 0;        // índice del héroe actualmente en "main"
    let isAnimating = false;

    /* ---------------------------------------------------------------
       3. TARJETAS — un nodo físico persistente por héroe
       --------------------------------------------------------------- */
    const cardsById = new Map();

    HEROES.forEach((hero) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'cuspide-heroes-showcase__card cuspide-heroes-showcase__card--thumb';
      card.setAttribute('role', 'tab');
      card.setAttribute('aria-label', `Ver a ${hero.name}`);
      card.dataset.heroId = hero.id;
      card.tabIndex = -1;

      const img = document.createElement('img');
      img.className = 'cuspide-heroes-showcase__card-img';
      img.src = hero.img;
      img.alt = hero.name;
      img.loading = 'lazy';
      img.draggable = false;

      card.appendChild(img);
      card.addEventListener('click', () => selectHero(hero.id));

      cardsById.set(hero.id, card);
      pool.appendChild(card); // arrancan todas en el pool
    });

    /* ---------------------------------------------------------------
       4. HELPERS DE VENTANA CIRCULAR
       --------------------------------------------------------------- */
    function windowIds(fromStart) {
      const ids = [];
      for (let i = 0; i < WINDOW_SIZE; i++) {
        ids.push(HEROES[(fromStart + i) % N].id);
      }
      return ids; // [mainId, thumb0Id, thumb1Id, thumb2Id]
    }

    function slotElFor(i) {
      return i === 0 ? mainFrame : thumbSlots[i - 1];
    }

    function assignSlotRole(card, i) {
      const isMain = i === 0;
      card.className =
        'cuspide-heroes-showcase__card ' +
        (isMain ? 'cuspide-heroes-showcase__card--main' : 'cuspide-heroes-showcase__card--thumb');
      card.setAttribute('aria-selected', String(isMain));
      card.tabIndex = isMain ? -1 : 0;
    }

    /* ---------------------------------------------------------------
       5. MONTAJE INICIAL (sin animar)
       --------------------------------------------------------------- */
    function mountInitial() {
      const ids = windowIds(start);
      ids.forEach((id, i) => {
        const card = cardsById.get(id);
        assignSlotRole(card, i);
        slotElFor(i).appendChild(card);
      });
      writeBio(HEROES[start]);
      // El botón nunca se deshabilita: el carrusel es circular/infinito.
    }

    /* ---------------------------------------------------------------
       6. ROTACIÓN — única operación del carrusel
       --------------------------------------------------------------- */
    function rotate(steps) {
      if (isAnimating || steps === 0) return;
      isAnimating = true;

      const reduced = prefersReducedMotion();
      const oldIds = windowIds(start);
      const newStart = ((start + steps) % N + N) % N;
      const newIds = windowIds(newStart);

      const persisting = newIds.filter((id) => oldIds.includes(id));
      const entering    = newIds.filter((id) => !oldIds.includes(id));
      const exiting     = oldIds.filter((id) => !newIds.includes(id));

      // FIRST: posiciones actuales de las tarjetas que van a persistir
      const firstRects = new Map();
      persisting.forEach((id) => {
        firstRects.set(id, cardsById.get(id).getBoundingClientRect());
      });

      start = newStart;

      // LAST: mover cada tarjeta de newIds a su slot definitivo (salto de layout)
      newIds.forEach((id, i) => {
        const card = cardsById.get(id);
        assignSlotRole(card, i);
        slotElFor(i).appendChild(card);
      });

      updateBio(HEROES[newStart], { animate: !reduced });

      if (reduced) {
        exiting.forEach((id) => pool.appendChild(cardsById.get(id)));
        isAnimating = false;
        return;
      }

      // INVERT + PLAY para las persistentes
      persisting.forEach((id) => {
        const card = cardsById.get(id);
        const last = card.getBoundingClientRect();
        flipInvert(card, firstRects.get(id), last);
      });

      // Estado inicial (sin transición) para las que entran
      entering.forEach((id) => {
        const card = cardsById.get(id);
        card.style.transition = 'none';
        card.classList.add('is-entering');
      });

      // Las que salen: se animan desde donde están ahora mismo
      exiting.forEach((id) => {
        cardsById.get(id).classList.add('is-exiting');
      });

      // Forzar reflow para que el estado "FIRST" quede pintado
      void section.offsetHeight;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          persisting.forEach((id) => flipPlay(cardsById.get(id)));
          entering.forEach((id) => {
            const card = cardsById.get(id);
            card.style.transition = '';
            card.classList.remove('is-entering');
          });
        });
      });

      setTimeout(() => {
        persisting.forEach((id) => {
          const card = cardsById.get(id);
          card.style.transition = '';
          card.style.transform = '';
        });
        exiting.forEach((id) => {
          const card = cardsById.get(id);
          card.classList.remove('is-exiting');
          card.style.transition = '';
          card.style.transform = '';
          pool.appendChild(card);
        });
        isAnimating = false;
      }, ROTATE_MS);
    }

    function flipInvert(el, firstRect, lastRect) {
      const dx = firstRect.left - lastRect.left;
      const dy = firstRect.top - lastRect.top;
      const sx = firstRect.width / lastRect.width;
      const sy = firstRect.height / lastRect.height;

      el.style.transition = 'none';
      el.style.transformOrigin = 'top left';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    }

    function flipPlay(el) {
      el.style.transition = 'transform .6s cubic-bezier(.16,.84,.32,1)';
      el.style.transform = 'none';
    }

    /* ---------------------------------------------------------------
       7. SELECCIÓN — click en miniatura, siempre rota hacia adelante
       --------------------------------------------------------------- */
    function selectHero(heroId) {
      if (isAnimating) return;
      const heroGlobalIndex = HEROES.findIndex((h) => h.id === heroId);
      if (heroGlobalIndex === -1) return;

      const offset = ((heroGlobalIndex - start) % N + N) % N;
      if (offset === 0) return; // ya es la principal
      rotate(offset);
    }

    /* ---------------------------------------------------------------
       8. BIO — cross-fade puro de opacidad (sin reflow de texto)
       --------------------------------------------------------------- */
    let bioTimer = null;

    function updateBio(hero, { animate }) {
      if (!animate) {
        writeBio(hero);
        return;
      }
      clearTimeout(bioTimer);
      bioContent.classList.add('is-fading');
      bioTimer = setTimeout(() => {
        writeBio(hero);
        bioContent.classList.remove('is-fading');
      }, 220);
    }

    function writeBio(hero) {
      bioFields.name.textContent = hero.name;
      bioFields.desc.textContent = hero.desc;
      bioFields.disability.textContent = hero.disability;
      bioFields.summit.textContent = hero.summit;
    }

    /* ---------------------------------------------------------------
       9. BOTÓN ">" — avanza un paso, circular / infinito
       --------------------------------------------------------------- */
    nextBtn.addEventListener('click', () => rotate(1));

    /* ---------------------------------------------------------------
       10. TECLADO — accesibilidad sobre las miniaturas
       --------------------------------------------------------------- */
    gallery.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.cuspide-heroes-showcase__card--thumb');
      if (!card) return;
      e.preventDefault();
      selectHero(card.dataset.heroId);
    });

    /* ---------------------------------------------------------------
       11. ENTRADA POR SCROLL (IntersectionObserver)
       --------------------------------------------------------------- */
    mountInitial();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add('is-visible');
              io.unobserve(section);
            }
          });
        },
        { threshold: 0.25 }
      );
      io.observe(section);
    } else {
      section.classList.add('is-visible');
    }
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
        ubicacion: 'SANTA CRUZ, ARGENTINA',
        precio: '$800.000',
        lugares: ['Laguna de los Tres', 'Campamento Poincenot', 'Cumbre Fitz Roy']
      },
      {
        nombre: 'TRONADOR',
        dificultad: 'DIFICULTAD EXTREMA',
        duracion: '8 SEMANAS',
        fondo: 'assets/tronador-act.png',
        descripcion: 'La cima más alta del planeta. Hipoxia severa, temperaturas letales y exposición continua.',
        altura: '71 M',
        ubicacion: 'RÍO NEGRO, ARGENTINA',
        precio: '$1.450.000',
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
        duracion: '2 SEMANAS',
        fondo: 'assets/aconcagua-act.png',
        descripcion: 'Lo que se gana no es una foto en la cima, certeza de haber vencido tus propios límites.',
        altura: '71 M',
        ubicacion: 'MENDOZA, ARGENTINA',
        precio: '$950.000',
        lugares: ['Campamento Base', 'Glaciar Horcones', 'Cumbre Principal']
      },
      {
        nombre: 'SAN VALENTÍN',
        dificultad: 'DIFICULTAD EXTREMA',
        duracion: '3 SEMANAS',
        fondo: 'assets/sanvalentin-act.png',
        descripcion: 'La montaña más dura de Norteamérica por clima, aislamiento y carga .',
        altura: '85 M',
        ubicacion: 'AYSÉN, CHILE',
        precio: '$1.100.000',
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

