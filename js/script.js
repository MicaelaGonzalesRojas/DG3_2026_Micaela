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
     5. Línea de tiempo del proceso de preparación (acordeón exclusivo)
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
     6. Cursos — cada tarjeta se expande de forma independiente
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
     7. Testimonios — carrusel con fundido, controles y puntos accesibles
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
     8. Expediciones — carrusel deslizable + tilt 3D suave
     ------------------------------------------------------------------ */
  const expTrack = document.getElementById('expedicionesTrack');
  if (expTrack) {
    const scrollAmount = 280;
    document.getElementById('expPrev').addEventListener('click', () => {
      expTrack.scrollBy({ left: -scrollAmount, behavior: motionIsReduced() ? 'auto' : 'smooth' });
    });
    document.getElementById('expNext').addEventListener('click', () => {
      expTrack.scrollBy({ left: scrollAmount, behavior: motionIsReduced() ? 'auto' : 'smooth' });
    });

    document.querySelectorAll('.expedicion-card-inner').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        if (motionIsReduced()) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     9. Galería del equipo — carga automática desde /assets/imagN.png
         Probá la cantidad real de fotos: si agregás o quitás archivos
         en /assets siguiendo el patrón imag1.png, imag2.png, imag3.png...
         la galería se ajusta sola, sin tocar este código.
     ------------------------------------------------------------------ */
  const gallery = document.getElementById('equipoGallery');
  const galleryFallback = document.getElementById('galleryFallback');
  if (gallery) {
    const MAX_ATTEMPTS = 24;
    const MAX_CONSECUTIVE_ERRORS = 4;
    let loadedCount = 0;
    let consecutiveErrors = 0;

    const galleryRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            galleryRevealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    function tryLoad(i) {
      if (i > MAX_ATTEMPTS || consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        if (loadedCount === 0) galleryFallback.classList.remove('visually-hidden');
        return;
      }
      const img = new Image();
      img.alt = `Foto del equipo y la comunidad de Cúspide en terreno (${i})`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => {
        consecutiveErrors = 0;
        loadedCount += 1;
        gallery.appendChild(img);
        galleryRevealObserver.observe(img);
        tryLoad(i + 1);
      });
      img.addEventListener('error', () => {
        consecutiveErrors += 1;
        tryLoad(i + 1);
      });
      img.src = `assets/imag${i}.png`;
    }
    tryLoad(1);
  }

  /* ------------------------------------------------------------------
     10. Formulario de contacto (Campamento Base)
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
