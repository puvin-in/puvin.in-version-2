// PUVIN.IN shared behaviour: performance modes, boot screen, menu, motion, project stage and forms.
(() => {
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* private mode: the choice just lasts for this page */
      }
    },
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const config = window.PUVIN_CONFIG || {};

  /* ---------- Performance modes ---------- */

  const webglAvailable = (() => {
    try {
      const test = document.createElement('canvas');
      return !!(test.getContext('webgl2') || test.getContext('webgl'));
    } catch {
      return false;
    }
  })();

  function autoPerf() {
    if (navigator.connection && navigator.connection.saveData) return 'saver';
    if (!webglAvailable || reducedMotion.matches) return 'saver';
    const lowEnd = (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency || 8) < 4;
    if (lowEnd) return 'saver';
    return window.matchMedia('(max-width: 720px)').matches ? 'medium' : config.defaultPerformance || 'high';
  }

  let perf = store.get('puvin-perf') || autoPerf();

  function setPerf(next, remember = true) {
    perf = next;
    root.dataset.perf = next;
    if (remember) store.set('puvin-perf', next);
    $$('[data-perf-set]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.perfSet === next));
    });
    document.dispatchEvent(new CustomEvent('puvin:perf'));
  }
  root.dataset.perf = perf;
  $$('[data-perf-set]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.perfSet === perf));
    button.addEventListener('click', () => setPerf(button.dataset.perfSet));
  });

  /* ---------- Hero scenes ---------- */

  const stage = $('.hero__stage');
  const scenes = (config.enabledScenes || ['particles']).filter(Boolean);
  let scene = store.get('puvin-scene');
  if (!scenes.includes(scene)) scene = config.defaultScene || scenes[0];
  let destroyScene = null;
  let mountToken = 0;
  const heroEngine = { promise: null };

  function wantsWebgl() {
    return webglAvailable && perf !== 'saver' && !reducedMotion.matches;
  }

  async function mountScene() {
    const token = ++mountToken;
    if (destroyScene) {
      destroyScene();
      destroyScene = null;
    }
    if (!stage || !wantsWebgl()) return false;
    try {
      heroEngine.promise = heroEngine.promise || import('/assets/js/hero.js');
      const { mountHero } = await heroEngine.promise;
      const destroy = await mountHero(stage, { variant: scene, perf, pointerArea: $('.hero') });
      if (token !== mountToken) {
        destroy();
        return false;
      }
      destroyScene = destroy;
      return true;
    } catch (error) {
      // The static portrait stays on screen; the site is fully usable without the effect.
      console.warn('PUVIN: 3D scene unavailable, showing the static portrait.', error);
      return false;
    }
  }

  function syncSceneButtons() {
    $$('[data-scene-set]').forEach((button) => {
      const available = wantsWebgl();
      button.disabled = !available;
      button.setAttribute('aria-pressed', String(available && button.dataset.sceneSet === scene));
    });
    $$('[data-scene-panel]').forEach((panel) => {
      panel.hidden = scenes.length < 2 || !wantsWebgl();
    });
  }

  if (stage) {
    $$('[data-scene-set]').forEach((button) => {
      button.addEventListener('click', () => {
        scene = button.dataset.sceneSet;
        store.set('puvin-scene', scene);
        syncSceneButtons();
        mountScene();
      });
    });
    syncSceneButtons();
    document.addEventListener('puvin:perf', () => {
      syncSceneButtons();
      if (!root.classList.contains('booting')) mountScene();
    });
    window.addEventListener('pagehide', () => destroyScene && destroyScene());
  }

  /* ---------- Boot screen ---------- */

  function enterSite() {
    root.classList.add('entered');
  }

  function runBoot() {
    const boot = $('.boot');
    if (!boot || !root.classList.contains('booting')) {
      enterSite();
      if (stage) mountScene();
      return;
    }
    const enter = $('[data-boot-enter]', boot);
    const statusText = $('[data-boot-status]', boot);
    const meter = $('.boot__meter i', boot);
    const tasks = $$('[data-task]', boot);
    let finished = 0;
    let closed = false;
    let touched = false;

    const close = () => {
      if (closed) return;
      closed = true;
      try {
        sessionStorage.setItem('puvin-booted', '1');
      } catch {
        /* ignore */
      }
      root.classList.add('boot-out');
      enterSite();
      setTimeout(() => {
        root.classList.remove('booting', 'boot-out');
        const trigger = $('.menu-trigger');
        if (trigger && document.activeElement === enter) trigger.focus({ preventScroll: true });
      }, reducedMotion.matches ? 0 : 900);
      if (!destroyScene) mountScene();
    };

    const allDone = () => {
      root.classList.add('boot-ready');
      statusText.textContent = 'READY TO EXPLORE';
      enter.querySelector('[data-boot-label]').textContent = 'ENTER WEBSITE';
      // Never hold anyone at the door: carry on unless they are choosing a mode
      setTimeout(() => {
        if (!touched) close();
      }, 4000);
    };

    const settle = (name, ok) => {
      const item = tasks.find((task) => task.dataset.task === name);
      if (item) item.classList.add(ok ? 'done' : 'fail');
      finished += 1;
      // A real count of finished jobs, not a made-up percentage
      meter.style.transform = `scaleX(${finished / tasks.length})`;
      if (finished === tasks.length) allDone();
    };

    enter.addEventListener('click', close);
    boot.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
    $$('.perf button', boot).forEach((button) =>
      button.addEventListener('click', () => {
        touched = true;
      }),
    );
    enter.focus({ preventScroll: true });

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => settle('fonts', true));
    const portrait = new Image();
    portrait.onload = () => settle('portrait', true);
    portrait.onerror = () => settle('portrait', false);
    portrait.src = '/assets/img/portrait.png';

    if (wantsWebgl()) {
      mountScene().then((ok) => settle('webgl', ok));
    } else {
      settle('webgl', false);
    }
    // Absolute limit: a stuck download must never block the site
    setTimeout(() => {
      if (!touched) close();
    }, 9000);
  }

  /* ---------- Full-screen menu ---------- */

  const menu = $('#menu');
  const trigger = $('.menu-trigger');
  if (menu && trigger) {
    const closeButton = $('[data-menu-close]', menu);
    const focusable = () =>
      $$('a[href], button:not([disabled])', menu).filter((element) => element.offsetParent !== null);

    const open = () => {
      menu.inert = false;
      menu.removeAttribute('aria-hidden');
      root.classList.add('menu-open');
      trigger.setAttribute('aria-expanded', 'true');
      setTimeout(() => closeButton.focus({ preventScroll: true }), 60);
    };
    const close = () => {
      root.classList.remove('menu-open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.inert = true;
      menu.setAttribute('aria-hidden', 'true');
      trigger.focus({ preventScroll: true });
    };

    menu.inert = true;
    trigger.addEventListener('click', open);
    closeButton.addEventListener('click', close);
    $$('a', menu).forEach((link) => link.addEventListener('click', () => root.classList.contains('menu-open') && close()));
    document.addEventListener('keydown', (event) => {
      if (!root.classList.contains('menu-open')) return;
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'Tab') {
        const items = focusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------- Reveals, counters and masked headlines ---------- */

  function revealAll() {
    $$('.reveal, .mask').forEach((element) => element.classList.add('is-in'));
  }

  function animateCount(element) {
    const end = Number(element.dataset.count);
    const pad = element.textContent.trim().length;
    if (reducedMotion.matches || perf === 'saver' || !end) return;
    const started = performance.now();
    const tick = (now) => {
      const t = Math.min((now - started) / 1200, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      element.textContent = String(Math.round(end * eased)).padStart(pad, '0');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && !navigator.webdriver) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          if (entry.target.dataset.count) animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    // The hero's own text waits for the boot screen to lift, so it isn't watched here
    $$('.reveal, .mask, [data-count]')
      .filter((element) => !element.closest('.hero'))
      .forEach((element) => observer.observe(element));
  } else {
    revealAll();
  }

  /* ---------- Scroll progress and parallax ---------- */

  const progress = $('.progress');
  const parallax = $$('[data-parallax]');
  let ticking = false;
  const onScrollFrame = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    if (!reducedMotion.matches && perf !== 'saver') {
      parallax.forEach((element) => {
        const box = element.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > window.innerHeight) return;
        const amount = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
        element.style.transform = `translate3d(0, ${(amount * Number(element.dataset.parallax)).toFixed(1)}px, 0)`;
      });
    }
    syncTracks();
    syncToc();
  };
  const requestFrame = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  };
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame, { passive: true });

  /* ---------- Project stage ---------- */

  const tracks = new Map();

  function setupStage(track) {
    tracks.delete(track);
    const slides = $$('.slide', track);
    if (!slides.length) return;
    const stageEl = $('.stage', track);
    const rail = $$('.stage__rail button', track);
    const scrollDriven = track.hasAttribute('data-scroll');
    let active = 0;

    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === active);
        slide.inert = i !== active;
      });
      rail.forEach((button, i) => {
        if (i === active) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
    };

    const go = (index) => {
      const next = (index + slides.length) % slides.length;
      if (!scrollDriven) {
        show(next);
        return;
      }
      const step = (track.offsetHeight - stageEl.offsetHeight) / Math.max(slides.length - 1, 1);
      window.scrollTo({
        top: track.getBoundingClientRect().top + window.scrollY + step * next,
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    };

    rail.forEach((button, i) => button.addEventListener('click', () => go(i)));
    const previous = $('[data-stage-prev]', track);
    const next = $('[data-stage-next]', track);
    if (previous) previous.addEventListener('click', () => go(active - 1));
    if (next) next.addEventListener('click', () => go(active + 1));

    stageEl.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        go(active + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        go(active - 1);
      }
    });

    let swipeX = null;
    stageEl.addEventListener('pointerdown', (event) => {
      swipeX = event.pointerType === 'mouse' ? null : event.clientX;
    }, { passive: true });
    stageEl.addEventListener('pointerup', (event) => {
      if (swipeX === null) return;
      const moved = event.clientX - swipeX;
      swipeX = null;
      if (Math.abs(moved) > 45) go(active + (moved < 0 ? 1 : -1));
    }, { passive: true });

    show(0);
    if (scrollDriven) {
      track.style.height = `${(slides.length - 1) * 70 + 100}svh`;
      tracks.set(track, () => {
        const box = track.getBoundingClientRect();
        const travel = track.offsetHeight - stageEl.offsetHeight;
        const ratio = Math.max(0, Math.min(1, -box.top / Math.max(travel, 1)));
        const index = Math.min(slides.length - 1, Math.round(ratio * (slides.length - 1)));
        if (index !== active) show(index);
      });
    }
  }

  function syncTracks() {
    tracks.forEach((sync, track) => {
      if (track.isConnected) sync();
      else tracks.delete(track);
    });
  }
  $$('.stage-track').forEach((track) => {
    setupStage(track);
    track.addEventListener('puvin:projects-updated', () => setupStage(track));
  });

  /* ---------- Project index preview ---------- */

  const preview = $('.index-preview');
  if (preview && window.matchMedia('(pointer: fine)').matches) {
    const previewImg = $('img', preview);
    $$('[data-preview]').forEach((row) => {
      row.addEventListener('pointerenter', () => {
        previewImg.src = row.dataset.preview;
        preview.classList.add('is-on');
      });
      row.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
      row.addEventListener('pointermove', (event) => {
        preview.style.transform = `translate3d(${event.clientX + 24}px, ${event.clientY - 150}px, 0)`;
      }, { passive: true });
    });
  }

  /* ---------- Custom cursor ---------- */

  const cursor = $('.cursor');
  function setupCursor() {
    if (!cursor || config.cursor === false) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion.matches) return;
    const label = $('b', cursor);
    const at = { x: -100, y: -100, tx: -100, ty: -100 };
    let running = false;
    const follow = () => {
      at.x += (at.tx - at.x) * 0.2;
      at.y += (at.ty - at.y) * 0.2;
      cursor.style.transform = `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0)`;
      if (Math.abs(at.tx - at.x) + Math.abs(at.ty - at.y) > 0.3 && !document.hidden) {
        requestAnimationFrame(follow);
      } else {
        running = false;
      }
    };
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || perf === 'saver') {
        root.classList.remove('has-cursor');
        return;
      }
      root.classList.add('has-cursor');
      at.tx = event.clientX;
      at.ty = event.clientY;
      if (!running) {
        running = true;
        requestAnimationFrame(follow);
      }
      const target = event.target.closest ? event.target.closest('a, button, [data-cursor], input, textarea') : null;
      cursor.classList.toggle('is-hover', !!target);
      const text = target && target.dataset ? target.dataset.cursor : '';
      cursor.classList.toggle('has-label', !!text);
      label.textContent = text || '';
    }, { passive: true });
  }
  setupCursor();

  /* ---------- Local time ---------- */

  const clocks = $$('[data-clock]');
  if (clocks.length) {
    const zone = (() => {
      try {
        const name = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        return (name.split('/').pop() || '').replace(/_/g, ' ');
      } catch {
        return '';
      }
    })();
    const paint = () => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      clocks.forEach((clock) => {
        clock.textContent = zone ? `${time} / ${zone}` : time;
      });
    };
    paint();
    setInterval(paint, 30000);
  }

  /* ---------- Article contents highlight ---------- */

  const tocLinks = $$('.toc a');
  const tocTargets = tocLinks.map((link) => $(link.getAttribute('href')));
  function syncToc() {
    if (!tocLinks.length) return;
    let current = 0;
    tocTargets.forEach((target, i) => {
      if (target && target.getBoundingClientRect().top < window.innerHeight * 0.35) current = i;
    });
    tocLinks.forEach((link, i) => link.classList.toggle('is-on', i === current));
  }

  /* ---------- Forms ---------- */

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $$('form[data-contact]').forEach((form) => {
    const status = $('.form__status', form);
    const submit = $('button[type="submit"]', form);
    const startedAt = Date.now();

    const setSending = (sending) => {
      form.setAttribute('aria-busy', String(sending));
      submit.disabled = sending;
      submit.setAttribute('aria-disabled', String(sending));
    };

    const showFieldError = (field, message) => {
      const wrap = field.closest('.field');
      const hint = $('.field__error', wrap);
      wrap.classList.toggle('has-error', !!message);
      field.setAttribute('aria-invalid', String(!!message));
      hint.textContent = message;
    };

    const check = () => {
      let firstBad = null;
      $$('input[required], textarea[required], input[type="email"]', form).forEach((field) => {
        const value = field.value.trim();
        let message = '';
        if (field.required && !value) message = 'Required.';
        else if (field.type === 'email' && value && !emailPattern.test(value)) message = 'Enter a valid email address.';
        showFieldError(field, message);
        if (message && !firstBad) firstBad = field;
      });
      return firstBad;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const bad = check();
      if (bad) {
        status.className = 'form__status is-error';
        status.textContent = 'Please fix the highlighted fields.';
        bad.focus();
        return;
      }
      setSending(true);
      status.className = 'form__status';
      status.textContent = 'Sending your message…';
      const data = Object.fromEntries(new FormData(form).entries());
      data.elapsedMs = Date.now() - startedAt;
      try {
        const response = await fetch(form.dataset.endpoint || '/api/v1/public/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const isJson = (response.headers.get('content-type') || '').includes('application/json');
        const payload = isJson ? await response.json() : null;
        if (!response.ok || payload?.success === false) throw new Error(`status ${response.status}`);
        form.reset();
        $$('input, textarea', form).forEach((field) => showFieldError(field, ''));
        status.className = 'form__status is-ok';
        status.textContent = 'Message received. Thank you — I will reply soon.';
      } catch {
        // Honest failure: nothing was sent, so the words stay in the form to try again later
        status.className = 'form__status is-error';
        status.textContent = "YOUR MESSAGE WASN'T SENT: THE MESSAGE SERVICE ISN'T CONNECTED YET. PLEASE TRY AGAIN LATER.";
      } finally {
        setSending(false);
      }
    });
  });

  /* ---------- Start ---------- */

  onScrollFrame();
  runBoot();
})();
