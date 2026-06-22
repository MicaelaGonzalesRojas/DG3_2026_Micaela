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
     5. Héroes de la montaña — clonado del track para el marquee infinito
        El DOM accesible conserva solo las 4 tarjetas reales (tabulables,
        sin aria-hidden). Los clones existen únicamente para el efecto
        visual continuo y quedan invisibles al árbol de accesibilidad.
     ------------------------------------------------------------------ */
  const heroesTrack = document.getElementById('heroesTrack');
  if (heroesTrack) {
    const originalCards = Array.from(heroesTrack.children);
    originalCards.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('[tabindex]').forEach((el) => el.setAttribute('tabindex', '-1'));
      const innerCard = clone.querySelector('.heroes-card');
      if (innerCard) innerCard.classList.add('is-clone');
      heroesTrack.appendChild(clone);
    });
  }

/**
 * Componente: Estadísticas de Autoridad — "La comunidad sigue subiendo"
 * Vanilla JS, sin dependencias externas. Autocontenido en un IIFE para
 * no filtrar variables globales al integrarse en cualquier página.
 *
 * Lógica:
 * 1. Si el navegador no respeta "prefers-reduced-motion: reduce", todas
 *    las ruedas numéricas se reinician a 0 al cargar el script (estado
 *    de "pre-giro"). El valor final real ya vive en el atributo
 *    data-digit y, como fallback sin JS, en el style="--target-digit"
 *    de cada .digit-strip en el HTML.
 * 2. Un IntersectionObserver dispara la animación de "Ridge Reveal" del
 *    título y el giro mecánico de cada dígito hasta su valor final,
 *    una sola vez, cuando la sección entra en el viewport.
 * 3. Si prefiere movimiento reducido, no se toca el estado inicial: el
 *    valor correcto ya está visible desde el primer milisegundo, sin
 *    animación.
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
  const timelineTriggers = document.querySelectorAll('.timeline-trigger');
  timelineTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      timelineTriggers.forEach((other) => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          document.getElementById(other.getAttribute('aria-controls')).hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!isExpanded));
      panel.hidden = isExpanded;
      if (!isExpanded) panel.scrollIntoView({ block: 'nearest', behavior: motionIsReduced() ? 'auto' : 'smooth' });
    });
  });

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
  const testimoniosTrack = document.getElementById('testimoniosTrack');
  if (testimoniosTrack) {
    const items = Array.from(testimoniosTrack.querySelectorAll('.testimonio'));
    const dotsWrap = document.getElementById('testimonioDots');
    let current = 0;

    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ver testimonio ${i + 1} de ${items.length}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goToTestimonio(i));
      dotsWrap.appendChild(dot);
    });

    function goToTestimonio(i) {
      items[current].classList.remove('is-active');
      items[current].setAttribute('aria-hidden', 'true');
      current = (i + items.length) % items.length;
      items[current].classList.add('is-active');
      items[current].setAttribute('aria-hidden', 'false');
      Array.from(dotsWrap.children).forEach((dot, idx) =>
        dot.setAttribute('aria-selected', String(idx === current))
      );
    }

    document.getElementById('testimonioPrev').addEventListener('click', () => goToTestimonio(current - 1));
    document.getElementById('testimonioNext').addEventListener('click', () => goToTestimonio(current + 1));
  }

  /* ------------------------------------------------------------------
     9. Expediciones — patrón de pestañas (tabs) accesible + crossfade
        de imagen. Dos <img> superpuestas (#expImageA / #expImageB) se
        turnan el rol de "actual" para lograr un crossfade real sin
        flash ni recarga visible.
     ------------------------------------------------------------------ */
  const expTabs = Array.from(document.querySelectorAll('.exp-tab'));
  const expPanel = document.getElementById('expPanel');
  const expLiveRegion = document.getElementById('expLiveRegion');

  if (expTabs.length && expPanel) {
    let expCurrentImg = document.getElementById('expImageA');
    let expNextImg = document.getElementById('expImageB');

    function swapExpeditionImage(src, alt) {
      const incoming = expNextImg;
      const outgoing = expCurrentImg;

      function reveal() {
        incoming.classList.add('is-current');
        incoming.removeAttribute('aria-hidden');
        outgoing.classList.remove('is-current');
        outgoing.setAttribute('aria-hidden', 'true');
        expCurrentImg = incoming;
        expNextImg = outgoing;
      }

      incoming.alt = alt;
      if (incoming.getAttribute('src') === src && incoming.complete) {
        reveal();
      } else {
        incoming.addEventListener('load', reveal, { once: true });
        incoming.src = src;
      }
    }

    function activateExpTab(index, { focus = true } = {}) {
      expTabs.forEach((tab, i) => {
        const selected = i === index;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', String(selected));
        tab.setAttribute('tabindex', selected ? '0' : '-1');
      });

      const tab = expTabs[index];
      if (focus) tab.focus();

      swapExpeditionImage(tab.dataset.image, tab.dataset.imageAlt);
      expPanel.setAttribute('aria-labelledby', tab.id);
      if (expLiveRegion) expLiveRegion.textContent = `Expedición seleccionada: ${tab.dataset.name}.`;
    }

    expTabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activateExpTab(i, { focus: false }));
      tab.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowDown') newIndex = (i + 1) % expTabs.length;
        else if (e.key === 'ArrowUp') newIndex = (i - 1 + expTabs.length) % expTabs.length;
        else if (e.key === 'Home') newIndex = 0;
        else if (e.key === 'End') newIndex = expTabs.length - 1;
        if (newIndex !== null) {
          e.preventDefault();
          activateExpTab(newIndex);
        }
      });
    });
  }

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
