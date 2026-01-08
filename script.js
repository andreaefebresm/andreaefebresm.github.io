document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
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
  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = year;
  });
}

function buildIndex(projects) {
  const gallery = document.getElementById('gallery');
  const renderProjects = items => items.map(project => `
    <a href="project.html?slug=${project.slug}">
      <div class="image-container">
        <img src="${project.image}" data-hover="${project.hoverImage}" data-category="${project.category}" data-title="${project.title}" alt="${project.title}">
        <div class="project-tags-overlay">
          ${renderTags(project).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    </a>
  `).join('');
  gallery.innerHTML = renderProjects(projects);
  setupInteractions();
}

function setupInteractions() {
  const images = document.querySelectorAll('.images img');
  images.forEach(img => img.classList.add('show'));

  const tooltip = document.getElementById('tooltip');
  const imagestool = document.querySelectorAll('.image-container img');
  imagestool.forEach(image => {
    const container = image.parentElement;
    image.addEventListener('mouseenter', () => {
      const text = image.dataset.title || image.alt || '';
      tooltip.textContent = text;
      tooltip.style.opacity = 1;
    });
    image.addEventListener('mousemove', e => {
      tooltip.style.left = e.pageX + 10 + 'px';
      tooltip.style.top = e.pageY + 10 + 'px';
    });
    image.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0;
    });
  });

  const galleryImages = document.querySelectorAll('.image-container img');
  const originalSrcMap = new Map();
  galleryImages.forEach(img => originalSrcMap.set(img, img.src));
  let lastHoveredImage = null;
  galleryImages.forEach(img => {
    img.addEventListener('mouseover', () => {
      if (lastHoveredImage !== img) {
        if (lastHoveredImage) {
          lastHoveredImage.src = originalSrcMap.get(lastHoveredImage);
        }
        img.src = img.dataset.hover || originalSrcMap.get(img);
        lastHoveredImage = img;
      }
    });
    img.addEventListener('mouseout', () => {
      if (lastHoveredImage === img) {
        img.src = originalSrcMap.get(img);
        lastHoveredImage = null;
      }
    });
  });
}

function buildProject(project, projects) {
  if (!project) return;
  document.title = `AEFM | ${project.title}`;
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-sub').innerHTML = project.sub || '';
  document.getElementById('project-description').innerHTML = formatDescription(project.description);
  setProjectBreadcrumb(project);
  setProjectNavigation(project, projects);
  renderProjectTags(project);
  const linkDiv = document.getElementById('project-link');
  if (project.externalLink) {
    linkDiv.innerHTML = `<a href="${project.externalLink}" target="_blank"><button>External link</button></a>`;
  } else {
    linkDiv.innerHTML = '';
  }

  const images = project.gallery || [];
  const mainImage = document.getElementById('mainImage');
  let current = 0;
  if (images.length) {
    mainImage.src = images[0];
  }
  function change(direction) {
    if (!images.length) return;
    current = (current + direction + images.length) % images.length;
    mainImage.src = images[current];
  }
  document.querySelector('.arrow-left').addEventListener('click', () => change(-1));
  document.querySelector('.arrow-right').addEventListener('click', () => change(1));
}

function renderTags(project) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const mappedTags = Array.from(new Set(tags.map(mapTag)));
  return project.selected ? [...mappedTags, 'S'] : mappedTags;
}

function mapTag(tag) {
  const normalized = String(tag).toLowerCase();
  if (normalized === 'ux/ui') return 'UX/UI';
  if (normalized.includes('data viz') || normalized.includes('cartography')) {
    return 'Data Viz';
  }
  if (normalized.includes('editorial')) return 'Editorial';
  if (
    normalized.includes('product') ||
    normalized.includes('platform') ||
    normalized.includes('service') ||
    normalized.includes('systems') ||
    normalized.includes('enterprise') ||
    normalized.includes('ia')
  ) {
    return 'Product';
  }
  return tag;
}

function renderProjectTags(project) {
  const tagContainer = document.getElementById('project-tags');
  if (!tagContainer) return;
  const tags = renderTags(project);
  const yearTag = project.year ? [project.year, ...tags] : tags;
  tagContainer.innerHTML = yearTag
    .map(tag => `<span class="tag">${tag}</span>`)
    .join('');
}

function formatDescription(description) {
  if (!description) return '';
  return description
    .split(/\n\s*\n/)
    .map(paragraph => `<p class="description">${paragraph}</p>`)
    .join('');
}

const projectOrder = [
  'enterprise-ux-systems',
  'design-economy',
  'milano-oltre-il-visibile',
  'antarctic-resolution',
  'cfs-lab',
  'discojournal',
  'superforma',
  'doublecheck',
  'data-visualization-studies'
];

function setProjectBreadcrumb(project) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;
  breadcrumb.innerHTML = `<a href="index.html">Back to projects</a> / ${project.title}`;
}

function setProjectNavigation(project, projects) {
  const prevLink = document.getElementById('prev-project');
  const nextLink = document.getElementById('next-project');
  if (!prevLink || !nextLink) return;

  const currentIndex = projectOrder.indexOf(project.slug);
  if (currentIndex === -1) {
    prevLink.hidden = true;
    nextLink.hidden = true;
    return;
  }

  const prevSlug = projectOrder[currentIndex - 1];
  const nextSlug = projectOrder[currentIndex + 1];
  const prevProject = projects.find(item => item.slug === prevSlug);
  const nextProject = projects.find(item => item.slug === nextSlug);

  if (prevProject) {
    prevLink.hidden = false;
    prevLink.href = `project.html?slug=${prevProject.slug}`;
    prevLink.textContent = `← Previous: ${prevProject.title}`;
  } else {
    prevLink.hidden = true;
  }

  if (nextProject) {
    nextLink.hidden = false;
    nextLink.href = `project.html?slug=${nextProject.slug}`;
    nextLink.textContent = `Next: ${nextProject.title} →`;
  } else {
    nextLink.hidden = true;
  }
}
