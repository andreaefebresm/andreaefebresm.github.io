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
    document.querySelectorAll('[data-current-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}

/* ---------------------------------------- */
/* INDEX */
/* ---------------------------------------- */
const SECTIONS = ['Experience Design', 'Data Visualization', 'Web Design'];

const SECTION_DESCRIPTIONS = {
    'Experience Design': 'What I find most interesting about this kind of work is the gap between how something is supposed to work and how people actually use it. I start from there, mapping real flows, asking real questions, and design around what I find.',
    'Data Visualization': 'Data is rarely the problem. The problem is what gets lost in translation. I work on making complex information readable without making it simple, keeping the nuance while finding the form.',
    'Web Design': 'A website is a commitment to content, to identity, to whoever will use it over time. I try to build things that don\'t need to be redone every two years.'
};

let activeSection = SECTIONS[0];

function buildIndex(projects) {
    const nav = document.getElementById('section-nav');
    const list = document.getElementById('projects-list');
    if (!nav || !list) return;

    SECTIONS.forEach(section => {
        const btn = document.createElement('button');
        btn.className = 'section-nav-btn' + (section === activeSection ? ' active' : '');
        btn.textContent = section;
        btn.addEventListener('click', () => {
            activeSection = section;
            document.querySelectorAll('.section-nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDescription();
            renderProjects(projects, list);
        });
        nav.appendChild(btn);
    });

    // Description element
    const desc = document.createElement('p');
    desc.className = 'section-description';
    desc.id = 'section-description';
    desc.textContent = SECTION_DESCRIPTIONS[activeSection];
    nav.parentElement.insertBefore(desc, nav.nextSibling);

    renderProjects(projects, list);
}

function updateDescription() {
    const desc = document.getElementById('section-description');
    if (desc) desc.textContent = SECTION_DESCRIPTIONS[activeSection];
}

function renderProjects(projects, container) {
    const filtered = projects.filter(p => p.section === activeSection);
    container.innerHTML = '';
    filtered.forEach(project => {
        container.appendChild(buildProjectRow(project));
    });
}

function buildProjectRow(project) {
    const isCaseStudy = project.type === 'case-study';
    const hasExternal = !!project.externalLink;

    const el = document.createElement('a');
    el.className = 'project-row';

    if (isCaseStudy) {
        el.href = `project.html?slug=${project.slug}`;
    } else if (hasExternal) {
        el.href = project.externalLink;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
    } else {
        el.removeAttribute('href');
        el.style.cursor = 'default';
    }

    const arrow = isCaseStudy ? '↘' : hasExternal ? '↗' : '';
    const imageHtml = project.image
        ? `<img src="${project.image}" data-hover="${project.hoverImage || project.image}" alt="${project.title}">`
        : '';

    const subtitleHtml = project.subtitle
        ? `<span class="project-row-subtitle">${project.subtitle}</span>`
        : '';

    el.innerHTML = `
        <div class="project-row-image">${imageHtml}</div>
        <div class="project-row-body">
            <div>
                <span class="project-row-title">${project.title}</span>
                ${subtitleHtml}
            </div>
            <span class="project-row-year">${project.year}</span>
        </div>
        <div class="project-row-arrow">${arrow}</div>
    `;

    if (project.image && project.hoverImage) {
        const img = el.querySelector('img');
        if (img) {
            img.addEventListener('mouseenter', () => { img.src = project.hoverImage; });
            img.addEventListener('mouseleave', () => { img.src = project.image; });
        }
    }

    return el;
}

/* ---------------------------------------- */
/* PROJECT PAGE */
/* ---------------------------------------- */
const PROJECT_ORDER = [
    'btw', 'ovo-sode', 'codici', 'doublecheck', 'interconnected',
    'design-economy', 'iperborea-the-passenger', 'milano-oltre-il-visibile',
    'antarctic-resolution', 'cfs-lab', 'discojournal', 'veroamaro'
];

function buildProject(project, projects) {
    if (!project) return;

    document.title = `AEFM | ${project.title}`;

    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) breadcrumb.innerHTML = `<a href="index.html">← Back</a>`;

    const titleEl = document.getElementById('project-title');
    if (titleEl) titleEl.textContent = project.title;

    const tagsEl = document.getElementById('project-tags');
    if (tagsEl) {
        const tags = project.tags || [];
        const all = project.year ? [project.year, ...tags] : tags;
        tagsEl.innerHTML = all.map(t => `<span class="tag">${t}</span>`).join('');
    }

    const linkDiv = document.getElementById('project-link');
    if (linkDiv) {
        linkDiv.innerHTML = project.externalLink
            ? `<a href="${project.externalLink}" target="_blank"><button>External link ↗</button></a>`
            : '';
    }

    const descEl = document.getElementById('project-description');
    if (descEl) {
        descEl.innerHTML = project.type === 'case-study'
            ? buildCaseSections(project)
            : project.description
                ? `<div class="case-section-text"><p>${project.description}</p></div>`
                : '';
    }

    setProjectNavigation(project, projects);

    const images = project.gallery && project.gallery.length
        ? project.gallery
        : project.image ? [project.image] : [];

    const mainImage = document.getElementById('mainImage');
    let current = 0;

    if (mainImage && images.length) mainImage.src = images[0];

    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');

    if (images.length <= 1) {
        if (arrowLeft) arrowLeft.style.display = 'none';
        if (arrowRight) arrowRight.style.display = 'none';
    } else {
        if (arrowLeft) arrowLeft.addEventListener('click', () => {
            current = (current - 1 + images.length) % images.length;
            mainImage.src = images[current];
        });
        if (arrowRight) arrowRight.addEventListener('click', () => {
            current = (current + 1) % images.length;
            mainImage.src = images[current];
        });
    }
}

function buildCaseSections(project) {
    const sections = [
        { key: 'context', label: 'Context' },
        { key: 'problem', label: 'Problem' },
        { key: 'role', label: 'My role' },
        { key: 'process', label: 'Process' },
        { key: 'outcome', label: 'Outcome' },
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
                </div>`;
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

    const prevProject = projects.find(p => p.slug === PROJECT_ORDER[currentIndex - 1]);
    const nextProject = projects.find(p => p.slug === PROJECT_ORDER[currentIndex + 1]);

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
