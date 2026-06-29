/* ====================================================================
   CÚSPIDE — interacciones
   Vanilla JS, sin dependencias. Todo respeta [data-motion="reduced"]
   y la preferencia de sistema prefers-reduced-motion.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

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
  document.querySelectorAll('.limits-card').forEach((card) => {
    function setExpanded(value) {
      card.setAttribute('aria-expanded', String(value));
    }
    card.addEventListener('mouseenter', () => setExpanded(true));
    card.addEventListener('mouseleave', () => setExpanded(false));
    card.addEventListener('focus', () => setExpanded(true));
    card.addEventListener('blur', () => setExpanded(false));
  });

/* ------------------------------------------------------------------
   HEROES DE LA MONTAÑA
   ------------------------------------------------------------------ */

(() => {

    const athletes = [

        {
            name: "JOHN CAMERON",
            condition: "Discapacidad visual",
            summit: "Monte Everest",
            image: "assets/heroes/everest.jpg"
        },

        {
            name: "ELENA ROSTOVA",
            condition: "Amputación bilateral",
            summit: "Aconcagua",
            image: "assets/heroes/aconcagua.jpg"
        },

        {
            name: "MATEO BENAVIDEZ",
            condition: "Lesión medular",
            summit: "Denali",
            image: "assets/heroes/denali.jpg"
        },

        {
            name: "SOFIA GRIEG",
            condition: "Amputación femoral",
            summit: "Mont Blanc",
            image: "assets/heroes/montblanc.jpg"
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
  document.querySelectorAll('.curso-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isExpanded));
      panel.hidden = isExpanded;
    });
  });

  /* ------------------------------------------------------------------
     8. Testimonios — carrusel con fundido, controles y puntos accesibles
     ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
   TESTIMONIOS V2
   ------------------------------------------------------------------ */

(() => {

    const testimonials = [

        {
            name: "HECTOR AGUIRRE",
            role: "Baja visión",
            avatar: "assets/hector.jpg",
            quote:
            "Aquí no hay concesiones ni compasión. Lo que se gana no es una foto en la cima, es la certeza de haber vencido tus propios límites."
        },

        {
            name: "AMBAR ZHENG",
            role: "Amputación Femoral",
            avatar: "assets/ambar.jpg",
            quote:
            "El viento blanco a 6,000 metros te exige precisión absoluta. Las prótesis no fallan si el entrenamiento de ingeniería biomecánica previo fue implacable."
        },

        {
            name: "JULIÁN SASTRE",
            role: "Ceguera Cortical",
            avatar: "assets/julian.jpg",
            quote:
            "La montaña no se ve, se escucha y se siente bajo los crampones. Aprendí a mapear el hielo mediante ecosonido táctil; la cumbre fue el resultado lógico."
        },

        {
            name: "VALERIE DUPONT",
            role: "Paraplejía T12",
            avatar: "assets/valerie.jpg",
            quote:
            "Adaptamos el trineo de tracción para pendientes del 45%. Dijeron que era logísticamente imposible; nuestro laboratorio técnico demostró lo contrario en el glaciar."
        }
    ];

    const bubble = document.getElementById('testimonialBubble');

    const quote = document.getElementById('testimonialQuote');
    const name = document.getElementById('testimonialName');
    const role = document.getElementById('testimonialRole');
    const avatar = document.getElementById('testimonialAvatar');

    const prev = document.getElementById('testimonialPrev');
    const next = document.getElementById('testimonialNext');

    let current = 0;

    function render(index){

        bubble.classList.add('is-leaving');

        setTimeout(() => {

            const item = testimonials[index];

            quote.textContent = `“${item.quote}”`;
            name.textContent = item.name;
            role.textContent = item.role;

            avatar.src = item.avatar;
            avatar.alt = item.name;

            bubble.classList.remove('is-leaving');

            bubble.classList.add('is-entering');

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    bubble.classList.remove(
                        'is-entering'
                    );
                });
            });

        },200);
    }

    next.addEventListener('click', () => {

        current =
            (current + 1)
            % testimonials.length;

        render(current);
    });

    prev.addEventListener('click', () => {

        current =
            (current - 1 + testimonials.length)
            % testimonials.length;

        render(current);
    });

    /* PARALLAX 3D */

    bubble.addEventListener('mousemove', e => {

        if(window.innerWidth < 1024) return;

        const rect =
            bubble.getBoundingClientRect();

        const x =
            (e.clientX - rect.left)
            / rect.width;

        const y =
            (e.clientY - rect.top)
            / rect.height;

        const rotateY =
            (x - .5) * 6;

        const rotateX =
            (0.5 - y) * 6;

        bubble.style.transform =
            `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            `;
    });

    bubble.addEventListener('mouseleave', () => {

        bubble.style.transform =
            'rotateX(0deg) rotateY(0deg)';
    });

    /* SWIPE MOBILE */

    let startX = 0;

    bubble.addEventListener(
        'pointerdown',
        e => startX = e.clientX
    );

    bubble.addEventListener(
        'pointerup',
        e => {

            const delta =
                e.clientX - startX;

            if(delta > 60){

                prev.click();
            }

            if(delta < -60){

                next.click();
            }
        }
    );

    render(0);

})();

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
            nombre:'MONTE ACONCAGUA',
            dificultad:'DIFICULTAD MEDIA',
            duracion:'2 SEMANAS',
            fondo:'assets/aconcagua.jpg',
            descripcion:'La montaña más alta de América exige resistencia física sostenida y adaptación progresiva a la altura.'
        },

        {
            nombre:'EVEREST',
            dificultad:'DIFICULTAD EXTREMA',
            duracion:'8 SEMANAS',
            fondo:'assets/everest.jpg',
            descripcion:'La cima más alta del planeta. Hipoxia severa, temperaturas letales y exposición continua.'
        },

        {
            nombre:'KILIMANJARO',
            dificultad:'DIFICULTAD MODERADA',
            duracion:'10 DÍAS',
            fondo:'assets/kilimanjaro.jpg',
            descripcion:'Ascenso progresivo donde la gestión del oxígeno y el ritmo son determinantes.'
        },

        {
            nombre:'MONT BLANC',
            dificultad:'DIFICULTAD ALTA',
            duracion:'1 SEMANA',
            fondo:'assets/montblanc.jpg',
            descripcion:'Glaciares dinámicos, grietas ocultas y progresión alpina técnica.'
        },

        {
            nombre:'DENALI',
            dificultad:'DIFICULTAD EXTREMA',
            duracion:'3 SEMANAS',
            fondo:'assets/denali.jpg',
            descripcion:'La montaña más dura de Norteamérica por clima, aislamiento y carga logística.'
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

                        <svg class="expedicion-icon" viewBox="0 0 100 100">
                            <path d="M10 80 L40 30 L55 55 L75 20 L90 80" fill="none" stroke="currentColor" stroke-width="4"/>
                        </svg>

                        <h3 class="expedicion-name">
                            ${exp.nombre}
                        </h3>

                        <div class="expedicion-meta">
                            ${exp.dificultad}
                            <br>
                            ${exp.duracion}
                        </div>

                    </div>

                    <div class="expedicion-face expedicion-face--back">

                        <p class="expedicion-copy">
                            ${exp.descripcion}
                        </p>

                        <button class="expedicion-cta">
                            ACEPTAR EL DESAFÍO
                        </button>

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

    track.addEventListener(
        'pointerdown',
        e => startX = e.clientX
    );

    track.addEventListener(
        'pointerup',
        e => {

            if(
                Math.abs(
                    e.clientX - startX
                ) > 50
            ){
                nextCard();
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

  /* ------------------------------------------------------------------
     11. Formulario de contacto (Campamento Base)
         NOTA: esto es un envío simulado en el cliente. Reemplazar el
         bloque marcado por la integración real (fetch a tu backend,
         servicio de email transaccional, Google Sheets, CRM, etc.).
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const status = document.getElementById('formStatus');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // --- INTEGRACIÓN REAL VA AQUÍ ---
      // fetch('/api/contacto', { method: 'POST', body: new FormData(contactForm) })

      status.textContent = 'Gracias. Recibimos tu mensaje y te vamos a contactar a la brevedad.';
      contactForm.reset();
    });
  }
});
