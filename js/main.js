/* ============================================================
   ⚙️ CONFIG — YOUR DATA IS ALL HERE
   ============================================================ */
const GITHUB_USERNAME = "1-aftab";

// Repos to hide (optional — the portfolio repo itself, for example)
const EXCLUDED_REPOS = [];

// Your specific highlighted repos with custom descriptions & categories
const CUSTOM_REPOS = {
    "Chatty": {
        description: "A real-time chat application for instant messaging with a clean, modern UI.",
        category: "web",
        featured: true,
        icon: "fas fa-comments"
    },
    "seven-deadly-duel": {
        description: "An interactive browser-based duel game inspired by the Seven Deadly Sins — pick your sin and fight!",
        category: "game",
        featured: true,
        icon: "fas fa-gamepad"
    },
    "SystemFiles": {
        description: "A collection of system-level utilities and file management tools for productivity.",
        category: "tool",
        featured: true,
        icon: "fas fa-server"
    }
};

// Language colors (matches GitHub)
const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26",
    CSS: "#563d7c", Python: "#3572A5", Java: "#b07219",
    "C++": "#f34b7d", C: "#555555", "C#": "#178600",
    PHP: "#4F5D95", Ruby: "#701516", Go: "#00ADD8",
    Rust: "#dea584", Dart: "#00B4AB", Kotlin: "#A97BFF",
    Swift: "#F05138", Shell: "#89e051", Vue: "#41b883",
    Jupyter_Notebook: "#DA5B0B", Default: "#6c63ff"
};

// Category icons
const CATEGORY_ICONS = {
    web: "fas fa-globe",
    tool: "fas fa-wrench",
    game: "fas fa-gamepad",
    other: "fas fa-cube",
    featured: "fas fa-star"
};

// Tech Stack
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

/* ============================================================
   STATE
   ============================================================ */
let allProjects = [];

/* ============================================================
   DOM
   ============================================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const navbar         = $('#navbar');
const navToggle      = $('#navToggle');
const mobileMenu     = $('#mobileMenu');
const projectsGrid   = $('#projectsGrid');
const projectsEmpty  = $('#projectsEmpty');
const scrollTopBtn   = $('#scrollTop');
const cursorGlow     = $('#cursorGlow');
const particlesBox   = $('#particles');
const techTagsBox    = $('#techTags');

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderTechStack();
    setupNav();
    setupFilters();
    setupScroll();
    setupCursor();
    setYear();
    setupReveal();
    loadPortfolio();
    setupCardHover();
});

/* ============================================================
   GITHUB API — AUTO LOAD ALL REPOS
   ============================================================ */
async function loadPortfolio() {
    // Loading state
    projectsGrid.innerHTML = `
        <div class="loading-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
            <div style="font-size:2.5rem;color:var(--accent-1);margin-bottom:16px">
                <i class="fas fa-circle-notch fa-spin"></i>
            </div>
            <p style="font-size:0.95rem">Loading projects from GitHub...</p>
        </div>`;

    try {
        // Fetch profile
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (userRes.ok) updateProfile(await userRes.json());

        // Fetch repos
        const reposRes = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );
        if (!reposRes.ok) throw new Error("Failed to fetch repos");

        const repos = await reposRes.json();

        allProjects = repos
            .filter(r => !r.fork && !EXCLUDED_REPOS.includes(r.name))
            .map(repo => {
                const custom = CUSTOM_REPOS[repo.name] || {};
                const lang = (repo.language || "").toLowerCase();
                const topics = repo.topics || [];

                // Determine category
                let category = custom.category || "other";
                if (!custom.category) {
                    if (topics.includes("game") || topics.includes("gaming")) category = "game";
                    else if (["javascript","typescript","html","css","vue","react","svelte"].includes(lang) || topics.includes("web") || topics.includes("website")) category = "web";
                    else if (["python","go","rust","shell","c","c++","java"].includes(lang) || topics.includes("tool") || topics.includes("cli")) category = "tool";
                }

                const isFeatured = custom.featured || repo.stargazers_count > 0 || topics.includes("featured");

                return {
                    title: formatTitle(repo.name),
                    rawName: repo.name,
                    description: custom.description || repo.description || "No description yet — check the repo for details.",
                    repoUrl: repo.html_url,
                    liveUrl: repo.homepage || "",
                    tags: topics.length > 0 ? topics : [repo.language || "Code"],
                    language: repo.language || "Misc",
                    languageColor: LANG_COLORS[repo.language] || LANG_COLORS.Default,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    category,
                    featured: isFeatured,
                    icon: custom.icon || CATEGORY_ICONS[category] || "fas fa-folder-open",
                    updatedAt: new Date(repo.updated_at)
                };
            });

        updateStats();
        renderProjects('all');

    } catch (err) {
        console.error("GitHub fetch error:", err);
        projectsGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--red)">
                <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;margin-bottom:14px;display:block;opacity:0.7"></i>
                <p>Couldn't load repositories. Try refreshing the page.</p>
                <p style="font-size:0.8rem;margin-top:8px;color:var(--text-muted)">Make sure GITHUB_USERNAME is correct in main.js</p>
            </div>`;
    }
}

function updateProfile(data) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('ghName', data.name || data.login);
    set('ghBio', data.bio || 'Developer');
    set('ghRepos', data.public_repos);
    set('ghFollowers', data.followers);
    set('ghFollowing', data.following);

    const avatar = document.getElementById('ghAvatar');
    if (avatar && data.avatar_url) avatar.src = data.avatar_url;
}

function updateStats() {
    const totalStars = allProjects.reduce((s, p) => s + p.stars, 0);
    const totalForks = allProjects.reduce((s, p) => s + p.forks, 0);

    animateCounter($('#statRepos'), allProjects.length);
    animateCounter($('#statStars'), totalStars);
    animateCounter($('#statForks'), totalForks);
}

/* ============================================================
   RENDER PROJECTS
   ============================================================ */
function renderProjects(filter) {
    let filtered = allProjects;

    if (filter === 'featured') {
        filtered = allProjects.filter(p => p.featured);
    } else if (filter !== 'all') {
        filtered = allProjects.filter(p => p.category === filter);
    }

    if (filtered.length === 0) {
        projectsGrid.style.display = 'none';
        projectsEmpty.style.display = 'block';
        return;
    }

    projectsGrid.style.display = 'grid';
    projectsEmpty.style.display = 'none';

    projectsGrid.innerHTML = filtered.map((p, i) => `
        <div class="project-card" style="animation-delay:${i * 0.06}s">
            <div class="project-header">
                <div class="project-icon">
                    <i class="${p.icon}"></i>
                </div>
                <div class="project-links">
                    <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-link" title="Source Code">
                        <i class="fab fa-github"></i>
                    </a>
                    ${p.liveUrl ? `
                    <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link" title="Live Demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : ''}
                </div>
            </div>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-description">${p.description}</p>
            <div class="project-tags">
                ${p.tags.slice(0, 4).map(t => `<span class="project-tag">${t}</span>`).join('')}
            </div>
            <div class="project-meta">
                <div class="project-meta-item">
                    <span class="lang-dot" style="background:${p.languageColor}"></span>
                    <span>${p.language}</span>
                </div>
                <div class="project-meta-item">
                    <i class="far fa-star"></i> <span>${p.stars}</span>
                </div>
                <div class="project-meta-item">
                    <i class="fas fa-code-branch"></i> <span>${p.forks}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Re-attach card hover effect
    setupCardHover();
}

/* ============================================================
   INTERACTIVE CARD HOVER GLOW
   ============================================================ */
function setupCardHover() {
    $$('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
        });
    });
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

/* ============================================================
   UTILS
   ============================================================ */
function formatTitle(name) {
    return name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
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
        } else {
            el.textContent = current;
        }
    }, 28);
}

/* ============================================================
   PARTICLES
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

/* ============================================================
   CURSOR GLOW
   ============================================================ */
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

/* ============================================================
   NAVIGATION
   ============================================================ */
function setupNav() {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    $$('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
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

/* ============================================================
   SCROLL EFFECTS
   ============================================================ */
function setupScroll() {
    window.addEventListener('scroll', () => {
        const y = window.pageYOffset;
        navbar.classList.toggle('scrolled', y > 50);
        scrollTopBtn.classList.toggle('visible', y > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Smooth anchor links
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = $(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ============================================================
   TECH STACK
   ============================================================ */
function renderTechStack() {
    if (!techTagsBox) return;
    techTagsBox.innerHTML = TECH_STACK.map(t => `
        <span class="tech-tag"><i class="${t.icon}"></i> ${t.name}</span>
    `).join('');
}

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
function setupReveal() {
    const els = $$('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
}

/* ============================================================
   YEAR
   ============================================================ */
function setYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
      }
