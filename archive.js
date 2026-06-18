document.addEventListener('DOMContentLoaded', () => {
  fetch('archive.json')
    .then(res => res.json())
    .then(items => buildArchive(items))
    .catch(err => console.error(err));
});

function buildArchive(items) {
  const grid = document.getElementById('archive-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  grid.innerHTML = items.map((item, i) => `
    <div class="archive-item" data-index="${i}">
      <div class="archive-thumb">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="archive-title">${item.title}</div>
      <div class="archive-caption">${item.caption}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.archive-item').forEach(el => {
    const item = items[el.dataset.index];
    el.addEventListener('click', () => {
      if (item.externalLink) {
        window.open(item.externalLink, '_blank');
      } else {
        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;
        lightbox.classList.add('open');
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
