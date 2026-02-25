document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  fetch('projects.json')
    .then(res => res.json())
    .then(projects => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('slug');
      if (slug) {
        const project = projects.find(p => p.slug === slug);
        buildProject(project, projects);
      } else {
        buildIndex(projects);
      }
    })
    .catch(err => console.error(err));
});

function setCurrentYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = year;
  });
}

/* ─── INDEX ─── */
function buildIndex(projects) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = projects.map(project => `
    <a href="project.html?slug=${project.slug}">
      <div class="image-container">
        <img
          src="${project.image}"
          data-hover="${project.hoverImage}"
          data-title="${project.title}"
          alt="${project.title}">
        <div class="project-tags-overlay">
          ${renderTags(project).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    </a>
  `).join('');
  setupInteractions();
}

function setupInteractions() {
  document.querySelectorAll('.images img').forEach(img => img.classList.add('show'));

  const tooltip = document.getElementById('tooltip');
  document.querySelectorAll('.image-container img').forEach(image => {
    image.addEventListener('mouseenter', () => {
      tooltip.textContent = image.dataset.title || image.alt || '';
      tooltip.style.opacity = 1;
    });
    image.addEventListener('mousemove', e => {
      tooltip.style.left = e.pageX + 10 + 'px';
      tooltip.style.top  = e.pageY + 10 + 'px';
    });
    image.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0;
    });
  });

  const originalSrcMap = new Map();
  let lastHovered = null;
  document.querySelectorAll('.image-container img').forEach(img => {
    originalSrcMap.set(img, img.src);
    img.addEventListener('mouseover', () => {
      if (lastHovered !== img) {
        if (lastHovered) lastHovered.src = originalSrcMap.get(lastHovered);
        img.src = img.dataset.hover || originalSrcMap.get(img);
        lastHovered = img;
      }
    });
    img.addEventListener('mouseout', () => {
      if (lastHovered === img) {
        img.src = originalSrcMap.get(img);
        lastHovered = null;
      }
    });
  });
}

/* ─── PROJECT ─── */
function buildProject(project, projects) {
  if (!project) return;
  document.title = `AEFM | ${project.title}`;

  if (project.type === 'ux') {
    buildUXProject(project, projects);
  } else {
    buildEditorialProject(project, projects);
  }
}

/* ── UX layout ── */
function buildUXProject(project, projects) {
  document.getElementById('layout-ux').style.display = 'block';
  document.body.classList.add('is-ux');

  // breadcrumb
  document.getElementById('breadcrumb-ux').innerHTML =
    `<a href="index.html">← Back to projects</a>`;

  // meta tags
  const tags = renderTags(project);
  const yearTags = project.year ? [project.year, ...tags] : tags;
  document.getElementById('ux-meta').innerHTML =
    yearTags.map(t => `<span class="tag">${t}</span>`).join('');

  // title
  document.getElementById('ux-title').textContent = project.title;

  // external link
  const linkDiv = document.getElementById('ux-link');
  linkDiv.innerHTML = project.externalLink
    ? `<a href="${project.externalLink}" target="_blank"><button>External link</button></a>`
    : '';

  // hero — first gallery image
  const heroImg = document.getElementById('ux-hero-img');
  const heroSrc = (project.gallery && project.gallery[0]) || project.image;
  if (heroSrc) {
    heroImg.src = heroSrc;
    heroImg.alt = project.title;
  }

  // overview
  document.getElementById('ux-description').innerHTML = formatDescription(project.description);

  // nested sub-projects (e.g. ongoing consultancy)
  const processSection = document.getElementById('ux-process-section');
  const processSteps = document.getElementById('ux-process-steps');

  if (project.projects && project.projects.length) {
    // render each sub-project as its own block
    processSection.style.display = 'block';
    processSteps.innerHTML = project.projects.map(sub => `
      <div class="sub-project">
        <h2 class="sub-project-title">${sub.title}</h2>
        <p class="ux-text" style="margin-bottom:1rem;">${sub.description}</p>
        ${sub.process && sub.process.length ? sub.process.map((step, i) => `
          <div class="process-step">
            <span class="step-number">${String(i + 1).padStart(2, '0')}</span>
            <div class="step-content">
              <strong>${step.label}</strong>
              ${step.text}
            </div>
          </div>
        `).join('') : ''}
        ${sub.keyDecision ? `
          <div class="sub-key-decision">
            <p class="ux-section-label" style="margin-top:1.25rem;">Key decision</p>
            <p class="ux-text">${sub.keyDecision}</p>
          </div>
        ` : ''}
        ${sub.processGallery && sub.processGallery.length ? `
          <div class="process-grid" style="margin-top:1rem;">
            ${sub.processGallery.map((item, i) => `
              <div class="process-item ${i === 0 && sub.processGallery.length > 2 ? 'process-item-wide' : ''}">
                <img src="${typeof item === 'string' ? item : item.src}" alt="">
                ${typeof item === 'object' && item.caption ? `<div class="caption">${item.caption}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join('<div class="sub-project-divider"></div>');
  } else if (project.process && project.process.length) {
    // single project with flat process array
    processSection.style.display = 'block';
    processSteps.innerHTML = project.process.map((step, i) => `
      <div class="process-step">
        <span class="step-number">${String(i + 1).padStart(2, '0')}</span>
        <div class="step-content">
          <strong>${step.label}</strong>
          ${step.text}
        </div>
      </div>
    `).join('');
  }

  // process artifacts (processGallery) — only for flat projects
  const artifactsSection = document.getElementById('ux-artifacts-section');
  const artifactsGrid = document.getElementById('ux-process-grid');
  if (!project.projects && project.processGallery && project.processGallery.length) {
    artifactsSection.style.display = 'block';
    artifactsGrid.innerHTML = project.processGallery.map((item, i) => `
      <div class="process-item ${i === 0 && project.processGallery.length > 2 ? 'process-item-wide' : ''}">
        <img src="${typeof item === 'string' ? item : item.src}" alt="${typeof item === 'object' ? item.caption || '' : ''}">
        ${typeof item === 'object' && item.caption
          ? `<div class="caption">${item.caption}</div>`
          : ''}
      </div>
    `).join('');
  }

  // key decision — only for flat projects
  const decisionSection = document.getElementById('ux-decision-section');
  const decisionDiv = document.getElementById('ux-key-decision');
  if (!project.projects && project.keyDecision) {
    decisionSection.style.display = 'block';
    decisionDiv.innerHTML = `<p>${project.keyDecision}</p>`;
  }

  // output gallery (gallery minus hero)
  const outputSection = document.getElementById('ux-output-section');
  const outputGrid = document.getElementById('ux-output-grid');
  const outputImages = (project.gallery || []).slice(1);
  if (outputImages.length) {
    outputSection.style.display = 'block';
    outputGrid.innerHTML = outputImages.map(src => `
      <div class="process-item">
        <img src="${src}" alt="${project.title}">
      </div>
    `).join('');
  }

  // navigation
  setNavigation(project, projects, 'ux-prev', 'ux-next');
}

/* ── Editorial layout ── */
function buildEditorialProject(project, projects) {
  document.getElementById('layout-editorial').style.display = 'block';
  document.body.classList.add('is-editorial');

  document.getElementById('breadcrumb-ed').innerHTML =
    `<a href="index.html">← Back to projects</a>`;

  const tags = renderTags(project);
  const yearTags = project.year ? [project.year, ...tags] : tags;
  document.getElementById('ed-meta').innerHTML =
    yearTags.map(t => `<span class="tag">${t}</span>`).join('');

  document.getElementById('ed-title').textContent = project.title;
  document.getElementById('ed-description').innerHTML = formatDescription(project.description);

  const linkDiv = document.getElementById('ed-link');
  linkDiv.innerHTML = project.externalLink
    ? `<a href="${project.externalLink}" target="_blank"><button>External link</button></a>`
    : '';

  // gallery
  const gallery = document.getElementById('ed-gallery');
  gallery.innerHTML = (project.gallery || []).map(src => `
    <img class="editorial-gallery-img" src="${src}" alt="${project.title}">
  `).join('');

  // navigation
  setNavigation(project, projects, 'ed-prev', 'ed-next');
}

/* ─── SHARED HELPERS ─── */
const projectOrder = [
  'ongoing-projects',
  'design-economy',
  'milano-oltre-il-visibile',
  'antarctic-resolution',
  'cfs-lab',
  'discojournal',
  'superforma',
  'doublecheck',
  'data-visualization-works'
];

function setNavigation(project, projects, prevId, nextId) {
  const prevLink = document.getElementById(prevId);
  const nextLink = document.getElementById(nextId);
  if (!prevLink || !nextLink) return;

  const currentIndex = projectOrder.indexOf(project.slug);
  if (currentIndex === -1) {
    prevLink.hidden = true;
    nextLink.hidden = true;
    return;
  }

  const prevProject = projects.find(p => p.slug === projectOrder[currentIndex - 1]);
  const nextProject = projects.find(p => p.slug === projectOrder[currentIndex + 1]);

  if (prevProject) {
    prevLink.style.visibility = 'visible';
    prevLink.href = `project.html?slug=${prevProject.slug}`;
    prevLink.textContent = `← ${prevProject.title}`;
  } else {
    prevLink.style.visibility = 'hidden';
  }

  if (nextProject) {
    nextLink.style.visibility = 'visible';
    nextLink.href = `project.html?slug=${nextProject.slug}`;
    nextLink.textContent = `${nextProject.title} →`;
  } else {
    nextLink.style.visibility = 'hidden';
  }
}

function renderTags(project) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const mapped = Array.from(new Set(tags.map(mapTag)));
  return project.selected ? [...mapped, 'S'] : mapped;
}

function mapTag(tag) {
  const n = String(tag).toLowerCase();
  if (n === 'ux/ui') return 'UX/UI';
  if (n.includes('data viz') || n.includes('cartography')) return 'Data Viz';
  if (n.includes('editorial')) return 'Editorial';
  if (['product','platform','service','systems','enterprise','ia'].some(k => n.includes(k))) return 'Product';
  return tag;
}

function formatDescription(description) {
  if (!description) return '';
  return description
    .split(/\n\s*\n/)
    .map(p => `<p class="description">${p.trim()}</p>`)
    .join('');
}
