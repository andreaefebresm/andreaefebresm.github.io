document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initAboutPanel();
  fetch('projects.json')
    .then(res => res.json())
    .then(projects => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('slug');
      if (slug) {
        buildProject(projects.find(p => p.slug === slug), projects);
      } else {
        buildIndex(projects);
      }
    })
    .catch(err => console.error(err));
});

function setCurrentYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = year);
}

function initAboutPanel() {
  const trigger = document.getElementById('about-trigger');
  const panel = document.getElementById('about-panel');
  const overlay = document.getElementById('about-overlay');
  const close = document.getElementById('about-close');
  if (!trigger || !panel) return;

  function open() {
    panel.classList.add('open');
    overlay.classList.add('open');
  }
  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
  }

  trigger.addEventListener('click', open);
  close.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);
}

const SECTION_DESCRIPTIONS = {
  "Experience Design": "What I find most interesting about this kind of work is the gap between how something is supposed to work and how people actually use it. I start from there, mapping real flows, asking real questions, and design around what I find.",
  "Data Visualization": "Data is rarely the problem. The problem is what gets lost in translation. I work on making complex information readable without making it simple, keeping the nuance while finding the form.",
  "Web Design": "A website is a commitment to content, to identity, to whoever will use it over time. I try to build things that don't need to be redone every two years."
};

let activeSection = "Experience Design";

function buildIndex(projects) {
  const list = document.getElementById('project-list');
  const desc = document.getElementById('section-desc');

  desc.textContent = SECTION_DESCRIPTIONS[activeSection];
  renderProjects(projects, list);

  document.querySelectorAll('.fsec').forEach(el => {
    el.addEventListener('click', () => {
      activeSection = el.dataset.section;
      document.querySelectorAll('.fsec').forEach(b => {
        b.className = 'fsec ' + (b === el ? 'active' : 'inactive');
      });
      desc.textContent = SECTION_DESCRIPTIONS[activeSection];
      renderProjects(projects, list);
    });
  });
}

function renderProjects(projects, container) {
  const filtered = projects.filter(p => p.section === activeSection);
  container.innerHTML = filtered.map(project => {
    const arrow = project.type === 'case-study' ? '↘' : '↗';
    const href = project.type === 'case-study'
      ? `project.html?slug=${project.slug}`
      : project.externalLink;
    const target = project.type !== 'case-study' ? 'target="_blank"' : '';
    const thumb = project.image
      ? `<img src="${project.image}" alt="${project.title}">`
      : `<div class="proj-thumb-placeholder"></div>`;

    return `<a class="proj-row" href="${href}" ${target}>
      <div class="proj-thumb">${thumb}</div>
      <div class="proj-body">
        <div>
          <div class="proj-title">${project.title}</div>
          ${project.subtitle ? `<div class="proj-sub">${project.subtitle}</div>` : ''}
        </div>
        <div class="proj-year">${project.year}</div>
      </div>
      <div class="proj-arrow">${arrow}</div>
    </a>`;
  }).join('');
}

/* ---- Project page ---- */
function buildProject(project, projects) {
  if (!project) return;
  document.title = `AEFM | ${project.title}`;

  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) breadcrumb.innerHTML = `<a href="index.html">← Back</a> / ${project.title}`;

  document.getElementById('project-title').textContent = project.title;
  if (project.subtitle) {
    document.getElementById('project-subtitle').textContent = project.subtitle;
  }
  document.getElementById('project-year').textContent = project.year;

  const desc = document.getElementById('project-description');
  if (project.context || project.problem || project.process || project.outcome) {
    desc.innerHTML = [
      project.context  ? `<div class="cs-block"><h3>Context</h3><p>${project.context}</p></div>` : '',
      project.problem  ? `<div class="cs-block"><h3>Problem</h3>${formatDescription(project.problem)}</div>` : '',
      project.role     ? `<div class="cs-block"><h3>My role</h3><p>${project.role}</p></div>` : '',
      project.process  ? `<div class="cs-block"><h3>Process</h3>${formatDescription(project.process)}</div>` : '',
      project.outcome  ? `<div class="cs-block"><h3>Outcome</h3><p>${project.outcome}</p></div>` : '',
    ].join('');
  } else if (project.description) {
    desc.innerHTML = formatDescription(project.description);
  }

  const linkDiv = document.getElementById('project-link');
  if (project.externalLink) {
    linkDiv.innerHTML = `<a class="ext-link" href="${project.externalLink}" target="_blank">Visit project ↗</a>`;
  }

  setProjectNavigation(project, projects);

  const images = project.gallery || [];
  const mainImage = document.getElementById('mainImage');
  let current = 0;
  if (images.length) mainImage.src = images[0];

  function change(dir) {
    if (!images.length) return;
    current = (current + dir + images.length) % images.length;
    mainImage.src = images[current];
  }
  const arrowL = document.querySelector('.arrow-left');
  const arrowR = document.querySelector('.arrow-right');
  if (arrowL) arrowL.addEventListener('click', () => change(-1));
  if (arrowR) arrowR.addEventListener('click', () => change(1));
}

function formatDescription(text) {
  if (!text) return '';
  return text.split(/\n\s*\n/).map(p => `<p class="description">${p.trim()}</p>`).join('');
}

const PROJECT_ORDER = [
  'field-service','courier','codici','doublecheck','interconnected',
  'dataviz-collection','design-economy','iperborea-the-passenger','milano-oltre-il-visibile','antarctic-resolution',
  'cfs-lab','discojournal','veroamaro'
];

function setProjectNavigation(project, projects) {
  const prevLink = document.getElementById('prev-project');
  const nextLink = document.getElementById('next-project');
  if (!prevLink || !nextLink) return;

  const idx = PROJECT_ORDER.indexOf(project.slug);
  const prevProject = idx > 0 ? projects.find(p => p.slug === PROJECT_ORDER[idx - 1]) : null;
  const nextProject = idx < PROJECT_ORDER.length - 1 ? projects.find(p => p.slug === PROJECT_ORDER[idx + 1]) : null;

  if (prevProject) {
    prevLink.href = `project.html?slug=${prevProject.slug}`;
    prevLink.textContent = `← ${prevProject.title}`;
    prevLink.style.visibility = 'visible';
  } else {
    prevLink.style.visibility = 'hidden';
  }

  if (nextProject) {
    nextLink.href = `project.html?slug=${nextProject.slug}`;
    nextLink.textContent = `${nextProject.title} →`;
    nextLink.style.visibility = 'visible';
  } else {
    nextLink.style.visibility = 'hidden';
  }
}
