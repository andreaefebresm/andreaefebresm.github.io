document.addEventListener('DOMContentLoaded', () => {
  fetch('projects.json')
    .then(res => res.json())
    .then(projects => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('slug');
      if (slug) {
        buildProject(projects.find(p => p.slug === slug));
      } else {
        buildIndex(projects);
      }
    });
});

function buildIndex(projects) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = projects.map(p => `
    <a href="project.html?slug=${p.slug}">
      <div class="image-container">
        <img src="${p.image}" alt="${p.title}" data-hover="${p.hoverImage}" data-category="${p.category}">
        <div class="image-text">${p.title}</div>
      </div>
    </a>
  `).join('');
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
      const text = container.querySelector('.image-text').textContent;
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

function buildProject(project) {
  if (!project) return;
  document.title = `AEFM | ${project.title}`;
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-sub').innerHTML = project.sub || '';
  document.getElementById('project-description').innerHTML = project.description || '';
  const linkDiv = document.getElementById('project-link');
  if (project.link) {
    linkDiv.innerHTML = `<a href="${project.link}" target="_blank"><button>${project.linkLabel || 'VISIT'}</button></a>`;
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
