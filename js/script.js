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

  /* ------------------------------------------------------------------
carrusel
     ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  // Duplica solo el contenido interno, no el contenedor
  const content = track.innerHTML;
  track.innerHTML += content;
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
    { threshold: 0.2 }
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
   CUSPIDE PILLARS
========================================== */

const cuspidePillarCards = document.querySelectorAll(
    ".cuspide-pillar-card"
);

const isTouchDevice =
    window.matchMedia("(max-width: 768px)").matches ||
    ("ontouchstart" in window);

if (isTouchDevice) {

    cuspidePillarCards.forEach(card => {

        card.addEventListener("click", () => {

            const expanded =
                card.classList.contains("is-flipped");

            card.classList.toggle("is-flipped");

            card.setAttribute(
                "aria-expanded",
                expanded ? "false" : "true"
            );
        });

        card.addEventListener("keydown", (e) => {

            if (
                e.key === "Enter" ||
                e.key === " "
            ) {

                e.preventDefault();

                const expanded =
                    card.classList.contains("is-flipped");

                card.classList.toggle("is-flipped");

                card.setAttribute(
                    "aria-expanded",
                    expanded ? "false" : "true"
                );
            }
        });
    });
}
/* ------------------------------------------------------------------
   HEROES DE LA MONTAÑA
   ------------------------------------------------------------------ */

(() => {

    const athletes = [

        {
            name: "JOHN CAMERON",
            condition: "Discapacidad visual",
            summit: "Monte Everest",
            image: "assets/heroe-2.jpg"
        },

        {
            name: "ELENA ROSTOVA",
            condition: "Amputación bilateral",
            summit: "Aconcagua",
            image: "assets/heroe-1.jpg"
        },

        {
            name: "MATEO BENAVIDEZ",
            condition: "Lesión medular",
            summit: "Denali",
            image: "assets/heroe-3.jpg"
        },

        {
            name: "SOFIA GRIEG",
            condition: "Amputación femoral",
            summit: "Mont Blanc",
            image: "assets/heroe-4.jpg"
        }
    ];

    const track =
        document.getElementById(
            'heroesTrack'
        );

    if(!track) return;

    function createCards(){

        const duplicated =
            [...athletes, ...athletes];

        duplicated.forEach(hero => {

            track.insertAdjacentHTML(
                'beforeend',
                `
                <article
                    class="hero-card"
                    tabindex="0"
                >

                    <img
                        src="${hero.image}"
                        alt="${hero.name}"
                        loading="lazy"
                    >

                    <div
                        class="hero-overlay"
                    >

                        <div
                            class="hero-content"
                        >

                            <div
                                class="hero-name"
                            >
                                ${hero.name}
                            </div>

                            <div
                                class="hero-condition"
                            >
                                ${hero.condition}
                            </div>

                            <div
                                class="hero-mountain"
                            >
                                ${hero.summit}
                            </div>

                        </div>

                    </div>

                </article>
                `
            );
        });
    }

    createCards();

    const marquee =
        document.getElementById(
            'heroesMarquee'
        );

    marquee.addEventListener(
        'mouseenter',
        () => {

            marquee.setAttribute(
                'aria-live',
                'polite'
            );
        }
    );

    marquee.addEventListener(
        'mouseleave',
        () => {

            marquee.setAttribute(
                'aria-live',
                'off'
            );
        }
    );

})();
 
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
const cursoCards = document.querySelectorAll(".curso-card");

let selectedCard =
    document.querySelector(".curso-card.is-selected") ||
    cursoCards[0];

function activateCard(card) {

    cursoCards.forEach(item => {

        item.classList.remove("is-active");

        item.setAttribute(
            "aria-expanded",
            "false"
        );
    });

    card.classList.add("is-active");

    card.setAttribute(
        "aria-expanded",
        "true"
    );
}
function activateCard(card) {

    const current =
        document.querySelector(".curso-card.is-active");

    if (current === card) return;

    if (current) {

        current.classList.add("is-leaving");

        setTimeout(() => {

            current.classList.remove(
                "is-active",
                "is-leaving"
            );

            current.setAttribute(
                "aria-expanded",
                "false"
            );

            card.classList.add("is-active");

            card.setAttribute(
                "aria-expanded",
                "true"
            );

        }, 180);

    } else {

        card.classList.add("is-active");

        card.setAttribute(
            "aria-expanded",
            "true"
        );
    }
}
/* ---------- Hover ---------- */

cursoCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        if (window.innerWidth < 768) return;

        if (selectedCard) return;

        activateCard(card);
    });

    card.addEventListener("mouseleave", () => {

        if (window.innerWidth < 768) return;

        if (selectedCard) return;

        activateCard(cursoCards[0]);
    });

});

/* ---------- Click ---------- */

cursoCards.forEach(card => {

    card.addEventListener("click", () => {

        cursoCards.forEach(item =>
            item.classList.remove("is-selected")
        );

        card.classList.add("is-selected");

        selectedCard = card;

        activateCard(card);
    });

});

/* ---------- Teclado ---------- */

cursoCards.forEach(card => {

    card.addEventListener("keydown", e => {

        if (
            e.key === "Enter" ||
            e.key === " "
        ) {

            e.preventDefault();

            card.click();
        }
    });

});

/* ---------- Inicial ---------- */

activateCard(selectedCard);
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

    currentIndex = Math.max(
        0,
        Math.min(currentIndex, getMaxIndex())
    );

    previousTranslate = -(currentIndex * getStep());

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
     9. Expediciones — patrón de pestañas (tabs) accesible + crossfade
        de imagen. Dos <img> superpuestas (#expImageA / #expImageB) se
        turnan el rol de "actual" para lograr un crossfade real sin
        flash ni recarga visible.
     ------------------------------------------------------------------ */
/* ==========================================================
   EXPEDICIONES SELECTOR
   ========================================================== */

/* ------------------------------------------------------------------
   EXPEDICIONES DECK 3D
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
            <div class="expedicion-meta--back">
            </div>
            <p class="expedicion-text--back">${exp.descripcion}</p>
            <ul class="expedicion-list--back">
              ${exp.lugares.map(lugar => `
                <li><span class="expedicion-circle--back"></span> ${lugar}</li>
              `).join('')}
            </ul>
            <button class="expedicion-btn--back">VER MÁS</button>
          </div>


                </div>
            </article>
            `
        );
    });

    const cards =
        [...track.children];

    function updateDeck(){

    cards.forEach((card,index)=>{

        let offset = index - active;

        if(offset < 0){
            offset += cards.length;
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

            case 3:

                x = -190;
                y = 40;
                z = -20;

                rotateZ = -20;
                rotateY = 8;

                scale = .88;

            break;

            case 4:

                x = -115;
                y = 18;
                z = 40;

                rotateZ = -12;
                rotateY = 4;

                scale = .94;

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

    updateDeck();

    let startX = 0;

track.addEventListener("pointerdown", e => {
  startX = e.clientX;
});

track.addEventListener("pointerup", e => {
  const delta = e.clientX - startX;

  if (delta > 50) {
    // swipe derecha → siguiente
    active = (active + 1) % cards.length;
    updateDeck();
  } else if (delta < -50) {
    // swipe izquierda → anterior
    active = (active - 1 + cards.length) % cards.length;
    updateDeck();
  }
        }
    );

    document.addEventListener(
        'keydown',
        e => {

            if(e.key === 'ArrowRight')
                nextCard();

            if(e.key === 'ArrowLeft'){

                active =
                    (active - 1 + cards.length)
                    % cards.length;

                updateDeck();
            }

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


/* ==========================================
   CÚSPIDE · ESCUELA DE GUÍAS
========================================== */
document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector("#hero-guides");

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if(entry.isIntersecting){

                    section.classList.add("is-visible");

                }

            });

        },

        {
            threshold:0.25
        }

    );

    observer.observe(section);

});


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
