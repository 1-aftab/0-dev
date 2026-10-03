/* ============================================================
   AFTAB PORTFOLIO — EXISTING SITE ENHANCEMENTS
   GitHub projects remain dynamic; business demos are easy to extend.
   ============================================================ */

const GITHUB_USERNAME = "1-aftab";
const CONTACT_EMAIL = "aftablone100@gmail.com";

// Optional: add your WhatsApp number in international format, e.g. "9198XXXXXXXX"
// Leave blank until you have a number/link you want published.
const WHATSAPP_NUMBER = "";

const EXCLUDED_REPOS = [];

const CUSTOM_REPOS = {
    "Chatty": {
        description: "A real-time chat application for instant messaging with a clean, modern UI.",
        category: "app", featured: true, icon: "fas fa-comments"
    },
    "seven-deadly-duel": {
        description: "An interactive browser-based duel game inspired by the Seven Deadly Sins — pick your sin and fight!",
        category: "game", featured: true, icon: "fas fa-gamepad"
    },
    "Seven Deadly Duel": {
        description: "An interactive browser-based duel game inspired by the Seven Deadly Sins — pick your sin and fight!",
        category: "game", featured: true, icon: "fas fa-gamepad"
    },
    "0-Dev": {
        description: "A developer-focused project exploring practical tools, experiments and web experiences.",
        category: "web", featured: true, icon: "fas fa-terminal"
    },
    "0-dev": {
        description: "A developer-focused project exploring practical tools, experiments and web experiences.",
        category: "web", featured: true, icon: "fas fa-terminal"
    },
    "Before We Left": {
        description: "A visual web project built around a personal story and interactive presentation.",
        category: "web", featured: true, icon: "fas fa-book-open"
    },
    "before-we-left": {
        description: "A visual web project built around a personal story and interactive presentation.",
        category: "web", featured: true, icon: "fas fa-book-open"
    },
    "SystemFiles": {
        description: "A collection of system-level utilities and file management tools for productivity.",
        category: "tool", featured: true, icon: "fas fa-server"
    }
};

const BUSINESS_DEMOS = [
    {
        title: "Café / Restaurant",
        description: "A warm, modern concept for a local café with menu highlights, location, opening hours and a direct contact CTA.",
        tags: ["Demo Concept", "Responsive", "Menu"],
        category: "business",
        icon: "fas fa-mug-hot",
        language: "HTML / CSS",
        languageColor: "#e34c26"
    },
    {
        title: "Barbershop / Salon",
        description: "A clean booking-focused concept for a salon or barbershop with services, pricing, gallery space and contact details.",
        tags: ["Demo Concept", "Services", "Mobile"],
        category: "business",
        icon: "fas fa-scissors",
        language: "HTML / CSS",
        languageColor: "#563d7c"
    },
    {
        title: "Gym / Fitness",
        description: "A bold landing-page concept for a local gym with plans, facilities, timings and an easy enquiry path.",
        tags: ["Demo Concept", "Landing Page", "CTA"],
        category: "business",
        icon: "fas fa-dumbbell",
        language: "HTML / CSS",
        languageColor: "#6c63ff"
    },
    {
        title: "Hotel / Guest House",
        description: "A polished stay-focused concept with rooms, amenities, location and enquiry sections for a local property.",
        tags: ["Demo Concept", "Hospitality", "Responsive"],
        category: "business",
        icon: "fas fa-hotel",
        language: "HTML / CSS",
        languageColor: "#9f7aea"
    },
    {
        title: "Local Service Business",
        description: "A flexible concept for electricians, tutors, repair services, photographers and other local professionals.",
        tags: ["Demo Concept", "Services", "Contact"],
        category: "business",
        icon: "fas fa-briefcase",
        language: "HTML / CSS",
        languageColor: "#c084fc"
    }
];

const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26",
    CSS: "#563d7c", Python: "#3572A5", Java: "#b07219",
    "C++": "#f34b7d", C: "#555555", "C#": "#178600",
    PHP: "#4F5D95", Ruby: "#701516", Go: "#00ADD8",
    Rust: "#dea584", Dart: "#00B4AB", Kotlin: "#A97BFF",
    Swift: "#F05138", Shell: "#89e051", Vue: "#41b883",
    Jupyter_Notebook: "#DA5B0B", Default: "#6c63ff"
};

const CATEGORY_ICONS = {
    web: "fas fa-globe",
    app: "fas fa-mobile-screen-button",
    tool: "fas fa-wrench",
    game: "fas fa-gamepad",
    other: "fas fa-cube",
    featured: "fas fa-star",
    business: "fas fa-store"
};

const TECH_STACK = [
    { name: "JavaScript", icon: "fab fa-js-square" },
    { name: "Python", icon: "fab fa-python" },
    { name: "HTML5", icon: "fab fa-html5" },
    { name: "CSS3", icon: "fab fa-css3-alt" },
    { name: "React", icon: "fab fa-react" },
    { name: "Node.js", icon: "fab fa-node-js" },
    { name: "Git", icon: "fab fa-git-alt" },
    { name: "GitHub", icon: "fab fa-github" },
    { name: "Linux", icon: "fab fa-linux" },
    { name: "Java", icon: "fab fa-java" }
];

let allProjects = [];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const navbar = $('#navbar');
const navToggle = $('#navToggle');
const mobileMenu = $('#mobileMenu');
const projectsGrid = $('#projectsGrid');
const projectsEmpty = $('#projectsEmpty');
const scrollTopBtn = $('#scrollTop');
const cursorGlow = $('#cursorGlow');
const particlesBox = $('#particles');
const techTagsBox = $('#techTags');

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderTechStack();
    setupNav();
    setupFilters();
    setupScroll();
    setupCursor();
    setYear();
    setupReveal();
    setupContactForm();
    setupBusinessDemoLink();
    loadPortfolio();
    setupCardHover();
    setupWhatsApp();
});

/* ============================================================
   PROJECT DATA
   ============================================================ */
async function loadPortfolio() {
    projectsGrid.innerHTML = `
        <div class="loading-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
            <div style="font-size:2.5rem;color:var(--accent-1);margin-bottom:16px"><i class="fas fa-circle-notch fa-spin"></i></div>
            <p style="font-size:0.95rem">Loading projects from GitHub...</p>
        </div>`;

    try {
        const reposRes = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );
        if (!reposRes.ok) throw new Error("Failed to fetch repositories");

        const repos = await reposRes.json();

        const githubProjects = repos
            .filter(r => !r.fork && !EXCLUDED_REPOS.includes(r.name))
            .map(repo => {
                const custom = CUSTOM_REPOS[repo.name] || {};
                const lang = (repo.language || "").toLowerCase();
                const topics = repo.topics || [];

                let category = custom.category || "other";
                if (!custom.category) {
                    if (topics.includes("game") || topics.includes("gaming")) category = "game";
                    else if (topics.includes("app") || topics.includes("android") || topics.includes("mobile")) category = "app";
                    else if (["javascript","typescript","html","css","vue","react","svelte"].includes(lang) ||
                             topics.includes("web") || topics.includes("website")) category = "web";
                    else if (["python","go","rust","shell","c","c++","java"].includes(lang) ||
                             topics.includes("tool") || topics.includes("cli")) category = "tool";
                }

                return {
                    title: formatTitle(repo.name),
                    rawName: repo.name,
                    description: custom.description || repo.description || "No description yet — check the repository for details.",
                    repoUrl: repo.html_url,
                    liveUrl: repo.homepage || "",
                    tags: topics.length ? topics : [repo.language || "Code"],
                    language: repo.language || "Misc",
                    languageColor: LANG_COLORS[repo.language] || LANG_COLORS.Default,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    category,
                    featured: custom.featured || repo.stargazers_count > 0 || topics.includes("featured"),
                    icon: custom.icon || CATEGORY_ICONS[category] || CATEGORY_ICONS.other,
                    isDemo: false
                };
            });

        allProjects = [...BUSINESS_DEMOS.map(d => ({
            ...d, repoUrl: "", liveUrl: "", stars: 0, forks: 0, featured: true, isDemo: true
        })), ...githubProjects];

        animateCounter($('#statRepos'), githubProjects.length);
        renderProjects('all');
    } catch (err) {
        console.error("GitHub fetch error:", err);
        allProjects = BUSINESS_DEMOS.map(d => ({
            ...d, repoUrl: "", liveUrl: "", stars: 0, forks: 0, featured: true, isDemo: true
        }));
        renderProjects('all');

        const note = document.createElement('p');
        note.className = 'project-api-note';
        note.innerHTML = '<i class="fas fa-circle-info"></i> GitHub projects could not be loaded right now; business demo concepts are still available below.';
        projectsGrid.parentElement.appendChild(note);
    }
}

/* ============================================================
   RENDER PROJECTS
   ============================================================ */
function renderProjects(filter) {
    let filtered = allProjects;

    if (filter === 'featured') filtered = allProjects.filter(p => p.featured);
    else if (filter !== 'all') filtered = allProjects.filter(p => p.category === filter);

    if (!filtered.length) {
        projectsGrid.style.display = 'none';
        projectsEmpty.style.display = 'block';
        return;
    }

    projectsGrid.style.display = 'grid';
    projectsEmpty.style.display = 'none';

    projectsGrid.innerHTML = filtered.map((p, i) => {
        const action = p.isDemo
            ? `<button class="project-action project-action-disabled" type="button" disabled title="Demo concept — live preview will be added when the concept is built">
                   <i class="fas fa-eye"></i><span>Live Demo · Coming soon</span>
               </button>`
            : `<div class="project-links">
                   <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-link" title="Source Code"><i class="fab fa-github"></i></a>
                   ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
               </div>`;

        const meta = p.isDemo
            ? `<span class="project-demo-badge"><i class="fas fa-flask"></i> Fictional demo concept</span>`
            : `<div class="project-meta-item"><span class="lang-dot" style="background:${p.languageColor}"></span><span>${escapeHtml(p.language)}</span></div>
               <div class="project-meta-item"><i class="far fa-star"></i> <span>${p.stars}</span></div>
               <div class="project-meta-item"><i class="fas fa-code-branch"></i> <span>${p.forks}</span></div>`;

        return `
            <article class="project-card ${p.isDemo ? 'project-card-demo' : ''}" style="animation-delay:${i * 0.045}s">
                <div class="project-header">
                    <div class="project-icon"><i class="${p.icon}"></i></div>
                    ${action}
                </div>
                <h3 class="project-title">${escapeHtml(p.title)}</h3>
                <p class="project-description">${escapeHtml(p.description)}</p>
                <div class="project-tags">${p.tags.slice(0, 4).map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}</div>
                <div class="project-meta">${meta}</div>
            </article>`;
    }).join('');

    setupCardHover();
}

/* ============================================================
   FILTERS
   ============================================================ */
function setupFilters() {
    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });
}

function setupBusinessDemoLink() {
    const link = $('#businessDemoLink');
    if (!link) return;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const businessBtn = document.querySelector('.filter-btn[data-filter="business"]');
        if (businessBtn) businessBtn.click();
        setTimeout(() => $('#projectsGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
    });
}

/* ============================================================
   CARD INTERACTION
   ============================================================ */
function setupCardHover() {
    $$('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

/* ============================================================
   CONTACT
   ============================================================ */
function setupContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const subject = `Website enquiry from ${data.get('name') || 'a potential client'}`;
        const body = [
            `Name: ${data.get('name') || ''}`,
            `Business: ${data.get('business') || ''}`,
            `Business type: ${data.get('type') || ''}`,
            `Contact: ${data.get('contact') || ''}`,
            '',
            'What I need:',
            data.get('message') || ''
        ].join('\n');

        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

function setupWhatsApp() {
    if (!WHATSAPP_NUMBER) return;
    const box = document.querySelector('.whatsapp-note');
    if (!box) return;

    box.classList.add('whatsapp-ready');
    box.innerHTML = `<a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-whatsapp"></i><span><strong>Prefer WhatsApp?</strong> Message me directly <i class="fas fa-arrow-up-right-from-square"></i></span>
    </a>`;
}

/* ============================================================
   UTILITIES
   ============================================================ */
function formatTitle(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

function animateCounter(el, target) {
    if (!el) return;
    if (target === 0) { el.textContent = '0'; return; }

    let current = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else el.textContent = current;
    }, 28);
}

/* ============================================================
   EXISTING BACKGROUND EFFECTS
   ============================================================ */
function createParticles() {
    if (!particlesBox) return;
    const count = window.innerWidth < 768 ? 18 : 40;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 14 + 8) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        const size = (Math.random() * 2.5 + 1) + 'px';
        p.style.width = size;
        p.style.height = size;
        particlesBox.appendChild(p);
    }
}

function setupCursor() {
    if (!cursorGlow || window.innerWidth < 768) return;
    let raf;
    document.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('visible');
        });
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('visible'));
}

function setupNav() {
    if (!navToggle || !mobileMenu) return;

    navToggle.addEventListener('click', () => {
        const open = navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    $$('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.pageYOffset >= s.offsetTop - 120) current = s.id;
        });
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + current) l.classList.add('active');
        });
    }, { passive: true });
}

function setupScroll() {
    window.addEventListener('scroll', () => {
        const y = window.pageYOffset;
        navbar?.classList.toggle('scrolled', y > 50);
        scrollTopBtn?.classList.toggle('visible', y > 400);
    }, { passive: true });

    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = $(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function renderTechStack() {
    if (!techTagsBox) return;
    techTagsBox.innerHTML = TECH_STACK.map(t => `<span class="tech-tag"><i class="${t.icon}"></i> ${t.name}</span>`).join('');
}

function setupReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });

    els.forEach(el => observer.observe(el));
}

function setYear() {
    const el = $('#currentYear');
    if (el) el.textContent = new Date().getFullYear();
}
