// Public-site data bridge. The document remains readable without JavaScript, then
// this module replaces its CMS-controlled fields with the live API response.
(() => {
  const text = (selector, value) => {
    const node = document.querySelector(selector);
    if (node && value) node.textContent = value;
  };
  const escape = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const renderServices = (services) => {
    const list = document.querySelector('.rows');
    if (!list || !Array.isArray(services)) return;
    list.innerHTML = services.map((service, index) => `
      <a class="row reveal is-in" href="/services/${encodeURIComponent(service.slug)}/" data-cursor="OPEN">
        <span class="label">${String(index + 1).padStart(2, '0')}</span>
        <h3 class="display t-md">${escape(service.title)}</h3>
        <p>${escape(service.summary)}</p><span class="row__go" aria-hidden="true">↗</span>
      </a>`).join('');
  };
  const renderProjects = (projects, showEmpty = false) => {
    if (!Array.isArray(projects)) return;
    const stage = document.querySelector('.stage');
    if (!stage) return;
    if (!projects.length) {
      if (showEmpty) {
        const message = document.createElement('p');
        message.className = 'lead';
        message.textContent = 'No projects published yet.';
        stage.closest('.stage-track')?.replaceWith(message);
      }
      return;
    }
    const visible = projects.slice(0, 6);
    const cards = visible.map((project, index) => `
      <article class="slide${index === 0 ? ' is-active' : ''}" aria-label="Project ${index + 1} of ${visible.length}">
        <img class="slide__img" src="${escape(project.featuredImage || project.image || '/assets/img/work-1.jpg')}" alt="" width="390" height="532" loading="lazy">
        <div class="slide__body"><p class="label label--on">PROJECT_${String(index + 1).padStart(2, '0')}</p>
        <h3 class="display t-xl slide__title">${escape(project.title)}</h3><div class="slide__meta label"><span>CASE STUDY</span><span>${escape(project.status || 'published').toUpperCase()}</span></div>
        <a class="btn" href="/portfolio/${encodeURIComponent(project.slug)}/">View case study <span class="arrow" aria-hidden="true">→</span></a></div>
      </article>`).join('');
    const rail = visible.map((_, index) => `<button type="button" aria-label="Show project ${index + 1}">${String(index + 1).padStart(2, '0')}</button>`).join('');
    const controls = stage.querySelector('.stage__arrows')?.outerHTML || '';
    const replacement = stage.cloneNode(false);
    replacement.innerHTML = `${cards}<div class="stage__rail">${rail}</div>${visible.length > 1 ? controls : ''}`;
    const track = stage.closest('.stage-track');
    stage.replaceWith(replacement);
    track?.dispatchEvent(new Event('puvin:projects-updated'));
  };
  const request = (path) => fetch('/api/v1/public/' + path, { headers: { Accept: 'application/json' } })
    .then((response) => response.ok ? response.json() : Promise.reject(response));

  function renderTitle(value) {
    const title = document.querySelector('.hero__title');
    const current = title?.textContent.trim().replace(/\s+/g, ' ');
    if (!title || !value || value.trim() === current) return;
    const mask = document.createElement('span');
    const line = document.createElement('span');
    mask.className = 'mask is-in';
    line.textContent = value;
    mask.append(line);
    title.replaceChildren(mask);
  }

  request('site')
    .then(({ data }) => {
      if (data.profile && data.home && data.branding) {
        const { profile, home, branding, seo } = data;
        document.title = seo.siteTitle;
        document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
        document.querySelector('meta[name="robots"]')?.setAttribute('content', seo.indexable ? 'index, follow' : 'noindex, nofollow');
        if (branding.brandName !== 'PUVIN') {
          document.querySelectorAll('.brand').forEach((node) => {
            node.textContent = branding.brandName;
            node.setAttribute('aria-label', branding.brandName + ' home');
          });
        }
        text('[data-cms-brand]', branding.brandName);
        text('[data-cms-role]', profile.headline);
        text('.hero__intro .label', `${profile.displayName} — [ ${profile.headline} ]`);
        const availability = profile.availability.available ? profile.availability.label : 'Currently unavailable';
        document.querySelectorAll('[data-cms-availability]').forEach((node) => { node.textContent = availability; });
        document.querySelectorAll('.status .dot, .menu__aside .dot').forEach((node) => { node.hidden = !profile.availability.available; });
        const primary = document.querySelector('[data-cms-primary]');
        if (primary && home.primaryCta) {
          primary.textContent = home.primaryCta.label;
          primary.closest('a').href = home.primaryCta.href;
        }
        const secondary = document.querySelector('[data-cms-secondary]');
        if (secondary && home.secondaryCta &&
            !(home.secondaryCta.href === '#services' && home.secondaryCta.label === 'View Services')) {
          secondary.textContent = home.secondaryCta.label;
          secondary.href = home.secondaryCta.href;
        }
        // Preserve the authored three-line hero when opening a database seeded by the earlier starter.
        if (home.heroHeadline !== 'Building Powerful Digital Experiences with Modern Web Technologies.') renderTitle(home.heroHeadline);
        text('#intro .lead', profile.aboutSummary?.[0]);
        renderServices(data.services);
        document.documentElement.dataset.cms = 'connected';
        request('projects').then(({ data: projects }) => renderProjects(projects, true))
          .catch(() => renderProjects([], true));
        return;
      }
      const settings = data.settings || {};
      document.documentElement.style.setProperty('--lime', settings.accent || '#b7ff3c');
      document.title = `${settings.siteName || 'PUVIN.IN'} — ${settings.headline || 'Developer'}`;
      text('.brand', settings.siteName);
      document.querySelectorAll('.status, .menu__aside .label--on').forEach((node) => {
        if (settings.availability && node.textContent.includes('AVAILABLE')) node.textContent = settings.availability.toUpperCase();
      });
      text('.hero__intro .label', `${settings.owner || 'Poornima Thanaraju'} — [ ${settings.headline || 'Full Stack Developer'} ]`);
      text('.hero__intro .lead', settings.heroLead);
      renderTitle(settings.heroTitle);
      text('#intro .lead', settings.about);
      renderServices(data.services);
      renderProjects(data.projects);
      document.documentElement.dataset.cms = 'connected';
    })
    .catch(() => { document.documentElement.dataset.cms = 'offline'; });
})();
