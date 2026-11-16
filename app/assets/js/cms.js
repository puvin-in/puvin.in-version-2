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
    if (!list || !services?.length) return;
    list.innerHTML = services.map((service, index) => `
      <a class="row reveal is-in" href="/services/${encodeURIComponent(service.slug)}/" data-cursor="OPEN">
        <span class="label">${String(index + 1).padStart(2, '0')}</span>
        <h3 class="display t-md">${escape(service.title)}</h3>
        <p>${escape(service.summary)}</p><span class="row__go" aria-hidden="true">↗</span>
      </a>`).join('');
  };
  const renderProjects = (projects) => {
    if (!projects?.length) return;
    const stage = document.querySelector('.stage');
    if (!stage) return;
    const cards = projects.slice(0, 6).map((project, index) => `
      <article class="slide${index === 0 ? ' is-active' : ''}" aria-label="Project ${index + 1} of ${projects.length}">
        <img class="slide__img" src="${escape(project.image || '/assets/img/work-1.jpg')}" alt="" width="390" height="532" loading="lazy">
        <div class="slide__body"><p class="label label--on">PROJECT_${String(index + 1).padStart(2, '0')}</p>
        <h3 class="display t-xl slide__title">${escape(project.title)}</h3><div class="slide__meta label"><span>CASE STUDY</span><span>${escape(project.status || 'published').toUpperCase()}</span></div>
        <a class="btn" href="/portfolio/${encodeURIComponent(project.slug)}/">View case study <span class="arrow" aria-hidden="true">→</span></a></div>
      </article>`).join('');
    const rail = projects.slice(0, 6).map((_, index) => `<button type="button" aria-label="Show project ${index + 1}">${String(index + 1).padStart(2, '0')}</button>`).join('');
    const controls = stage.querySelector('.stage__arrows')?.outerHTML || '';
    stage.innerHTML = `${cards}<div class="stage__rail">${rail}</div>${controls}`;
  };
  fetch('/api/v1/public/site', { headers: { Accept: 'application/json' } })
    .then((response) => response.ok ? response.json() : Promise.reject(response))
    .then(({ data }) => {
      const settings = data.settings || {};
      document.documentElement.style.setProperty('--lime', settings.accent || '#b7ff3c');
      document.title = `${settings.siteName || 'PUVIN.IN'} — ${settings.headline || 'Developer'}`;
      text('.brand', settings.siteName);
      document.querySelectorAll('.status, .menu__aside .label--on').forEach((node) => {
        if (settings.availability && node.textContent.includes('AVAILABLE')) node.textContent = settings.availability.toUpperCase();
      });
      text('.hero__intro .label', `${settings.owner || 'Poornima Thanaraju'} — [ ${settings.headline || 'Full Stack Developer'} ]`);
      text('.hero__intro .lead', settings.heroLead);
      const title = document.querySelector('.hero__title');
      if (title && settings.heroTitle) title.innerHTML = settings.heroTitle.split(/\s+(?=\S+(?:\s+\S+){0,2}$)/).map((line) => `<span class="mask is-in"><span>${escape(line)}</span></span>`).join('');
      text('#intro .lead', settings.about);
      renderServices(data.services);
      renderProjects(data.projects);
      document.documentElement.dataset.cms = 'connected';
    })
    .catch(() => { document.documentElement.dataset.cms = 'offline'; });
})();
