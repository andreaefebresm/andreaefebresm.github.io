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
    document.querySelectorAll('[data-current-year]').forEach(el => {
        el.textContent = year;
    });
}

/* ---------------------------------------- */
/* INDEX */
/* ---------------------------------------- */
const SECTIONS = ['Experience Design', 'Data Visualization', 'Web Design'];

function buildIndex(projects) {
    const container = document.getElementById('projects-list');
    if (!container) return;

    SECTIONS.forEach(section => {
        const sectionProjects = projects.filter(p => p.section === section);
        if (!sectionProjects.length) return;

        // Section header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `<span class="section-title">${section}</span>`;
        container.appendChild(header);

        // Project rows
        sectionProjects.forEach(project => {
            const row = buildProjectRow(project);
            container.appendChild(row);
        });
    });
}

function buildProjectRow(project) {
    const isCaseStudy = project.type === 'case-study';
    const isExternal = project.type === 'external' || project.type === 'dataviz';

    const el = document.createElement('a');
    el.className = 'project-row';

    if (isCaseStudy) {
        el.href = `project.html?slug=${project.slug}`;
    } else if (project.externalLink) {
        el.href = project.externalLink;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
    } else {
        el.href = '#';
    }

    const tags = Array.isArray(project.tags) ? project.tags : [];
    const tagsHtml = tags.map(t => `<span class="tag">${t}</span>`).join('');

    const typeLabel = isCaseStudy
        ? '<span class="project-row-type">→ Case study</span>'
        : project.externalLink
            ? '<span class="project-row-type">↗ External link</span>'
            : '';

    el.innerHTML = `
        <div class="project-row-image">
            <img
                src="${project.image}"
                data-hover="${project.hoverImage || project.image}"
                alt="${project.title}"
            >
        </div>
        <div class="project-row-body">
            <span class="project-row-title">${project.title}</span>
            <div class="project-row-tags">${tagsHtml}</div>
            ${typeLabel}
        </div>
        <div class="project-row-year">${project.year}</div>
    `;

    // Hover image swap
    const img = el.querySelector('img');
    const originalSrc = project.image;
    const hoverSrc = project.hoverImage || project.image;

    img.addEventListener('mouseenter', () => { img.src = hoverSrc; });
    img.addEventListener('mouseleave', () => { img.src = originalSrc; });

    return el;
}

/* ---------------------------------------- */
/* PROJECT PAGE */
/* ---------------------------------------- */
const PROJECT_ORDER = [
    'btw',
    'ovo-sode',
    'codici',
    'doublecheck',
    'interconnected',
    'design-economy',
    'iperborea-the-passenger',
    'milano-oltre-il-visibile',
    'antarctic-resolution',
    'cfs-lab',
    'discojournal',
    'veroamaro'
];

function buildProject(project, projects) {
    if (!project) return;

    document.title = `AEFM | ${project.title}`;

    // Breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="index.html">← Back</a>`;
    }

    // Title
    const titleEl = document.getElementById('project-title');
    if (titleEl) titleEl.textContent = project.title;

    // Tags + year
    const tagsEl = document.getElementById('project-tags');
    if (tagsEl) {
        const tags = Array.isArray(project.tags) ? project.tags : [];
        const all = project.year ? [project.year, ...tags] : tags;
        tagsEl.innerHTML = all.map(t => `<span class="tag">${t}</span>`).join('');
    }

    // External link
    const linkDiv = document.getElementById('project-link');
    if (linkDiv) {
        linkDiv.innerHTML = project.externalLink
            ? `<a href="${project.externalLink}" target="_blank"><button>External link ↗</button></a>`
            : '';
    }

    // Description / case study sections
    const descEl = document.getElementById('project-description');
    if (descEl) {
        if (project.type === 'case-study') {
            descEl.innerHTML = buildCaseSections(project);
        } else {
            descEl.innerHTML = project.description
                ? `<p class="case-section-text">${project.description}</p>`
                : '';
        }
    }

    // Navigation
    setProjectNavigation(project, projects);

    // Gallery
    const images = project.gallery || (project.image ? [project.image] : []);
    const mainImage = document.getElementById('mainImage');
    let current = 0;

    if (mainImage && images.length) {
        mainImage.src = images[0];
    }

    function change(direction) {
        if (!images.length || !mainImage) return;
        current = (current + direction + images.length) % images.length;
        mainImage.src = images[current];
    }

    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    if (arrowLeft) arrowLeft.addEventListener('click', () => change(-1));
    if (arrowRight) arrowRight.addEventListener('click', () => change(1));

    // Hide arrows if only one image
    if (images.length <= 1) {
        if (arrowLeft) arrowLeft.style.display = 'none';
        if (arrowRight) arrowRight.style.display = 'none';
    }
}

function buildCaseSections(project) {
    const sections = [
        { key: 'context', label: 'Context' },
        { key: 'problem', label: 'Problem' },
        { key: 'role', label: 'My role' },
        { key: 'process', label: 'Process' },
        { key: 'outcome', label: 'Outcome' }
    ];

    return sections
        .filter(s => project[s.key])
        .map(s => {
            const paragraphs = project[s.key]
                .split(/\n\s*\n/)
                .map(p => `<p>${p.trim()}</p>`)
                .join('');
            return `
                <div class="case-section">
                    <div class="case-section-label">${s.label}</div>
                    <div class="case-section-text">${paragraphs}</div>
                </div>
            `;
        })
        .join('');
}

function setProjectNavigation(project, projects) {
    const prevLink = document.getElementById('prev-project');
    const nextLink = document.getElementById('next-project');
    if (!prevLink || !nextLink) return;

    const currentIndex = PROJECT_ORDER.indexOf(project.slug);
    if (currentIndex === -1) {
        prevLink.hidden = true;
        nextLink.hidden = true;
        return;
    }

    const prevSlug = PROJECT_ORDER[currentIndex - 1];
    const nextSlug = PROJECT_ORDER[currentIndex + 1];
    const prevProject = projects.find(p => p.slug === prevSlug);
    const nextProject = projects.find(p => p.slug === nextSlug);

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
