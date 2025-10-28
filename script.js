/* ===========================================
   DANIEL ORTIZ - PORTFOLIO ULTRA INSTINCT
   Script Principal CORREGIDO - Proyectos Visibles
   =========================================== */

const COSMIC_CONFIG = {
  powerLevel: 8900,
  superSayayanMode: false,
  cosmicParticles: 50,
  animationSpeed: 1.0
};

class CosmicPortfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initCosmicParticles();
    this.initProjects();      // ← PRIMERO los proyectos
    this.initAnimations();    // ← LUEGO las animaciones
    this.initTypeWriter();
    
    // Forzar visibilidad después de un pequeño delay
    setTimeout(() => {
      this.forceVisibility();
    }, 100);
    
    console.log('🚀 Portfolio Cósmico inicializado - Proyectos VISIBLES!');
  }

  setupEventListeners() {
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupSmoothScroll();
    this.setupFormHandling();
    this.setupScrollEffects();
    this.setupEasterEggs();
    this.setupCvDownload();
    this.setupSpecialEffects();
  }

  /* ========= NAV ========= */
  setupNavigation() {
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');

    menuToggle?.addEventListener('click', (e) => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('responsive');
      this.playCosmicSound('click');
      this.createRippleEffect(menuToggle, e);
    });

    nav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('responsive');
        menuToggle?.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('scroll', () => {
      const header = document.querySelector('.contenedor-header');
      if (window.scrollY > 100) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  /* ===== THEME ===== */
  setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('cosmic-theme');
    if (savedTheme === 'light') document.body.classList.add('modo-claro');

    themeBtn?.addEventListener('click', (e) => {
      document.body.classList.toggle('modo-claro');
      const isLight = document.body.classList.contains('modo-claro');
      localStorage.setItem('cosmic-theme', isLight ? 'light' : 'dark');
      this.playCosmicSound('theme');
      this.createRippleEffect(themeBtn, e); 
    });
  }

  /* ===== SMOOTH SCROLL ===== */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerHeight = document.querySelector('.contenedor-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        this.playCosmicSound('scroll');
      });
    });
  }

  /* ===== PARTICLES ===== */
  initCosmicParticles() {
    const container = document.getElementById('cosmicParticles');
    if (!container) return;
    for (let i = 0; i < COSMIC_CONFIG.cosmicParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 1;
      const duration = Math.random() * 30 + 20;
      const delay = Math.random() * 10;
      particle.style.cssText = `
        --duration: ${duration}s;
        --delay: ${delay}s;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
      container.appendChild(particle);
    }
  }

  /* ===== TYPEWRITER ===== */
  initTypeWriter() {
    const title = document.querySelector('.power-level');
    if (!title || title.dataset.typed) return;
    const originalText = title.textContent.trim();
    title.textContent = '';
    title.dataset.typed = 'true';
    let i = 0;
    const type = () => {
      if (i < originalText.length) {
        title.textContent += originalText.charAt(i);
        i++;
        if (i % 3 === 0) this.playCosmicSound('type');
        setTimeout(type, 80 + Math.random() * 40);
      } else {
        title.classList.add('typed-complete');
      }
    };
    setTimeout(type, 500);
  }

  /* ===== FORZAR VISIBILIDAD ===== */
  forceVisibility() {
    const criticalElements = [
      '.cosmic-grid',
      '#galeria', 
      '.proyecto',
      '.cosmic-filters',
      '.projects-counter',
      '.cosmic-skills',
      '.cosmic-timeline'
    ];
    
    criticalElements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
    });
  }

  /* ===== APARICIÓN ON-SCROLL (VERSIÓN CORREGIDA) ===== */
  initAnimations() {
    // Primero hacer visible todo el contenido inmediatamente
    document.querySelectorAll('.item, .cosmic-skill, .cosmic-interest, .stack-item, .proyecto')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.visibility = 'visible';
      });

    // Luego inicializar el observer para animaciones suaves
    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('cosmic-skill')) {
            this.animateSkillBar(entry.target);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observar elementos existentes
    document.querySelectorAll('.item, .cosmic-skill, .cosmic-interest, .stack-item')
      .forEach(el => this.revealObserver.observe(el));

    this.initSkillAnimations();
  }

  /* ===== SKILLS BARS ===== */
  initSkillAnimations() {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skill = entry.target;
          const percentElement = skill.querySelector('.skill-percent');
          const progressBar = skill.querySelector('.cosmic-progress');
          if (percentElement && progressBar) {
            const targetPercent = parseInt(percentElement.dataset.target);
            this.animateCounter(percentElement, targetPercent);
            progressBar.style.setProperty('--target-width', `${targetPercent}%`);
            progressBar.classList.add('animating');
            setTimeout(() => progressBar.classList.remove('animating'), 2000);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.cosmic-skill').forEach(skill => skillObserver.observe(skill));
  }

  animateSkillBar(skillElement) {
    skillElement.style.transform = 'scale(1.02)';
    setTimeout(() => { skillElement.style.transform = 'scale(1)'; }, 300);
  }

  animateCounter(element, target, duration = 1500) {
    let current = 0;
    const steps = 50;
    const increment = target / steps;
    const stepTime = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      element.textContent = `${Math.round(current)}%`;
    }, stepTime);
  }

  /* ===== PROYECTOS - VERSIÓN CORREGIDA ===== */
  initProjects() {
    this.projects = this.getCosmicProjects();
    this.visibleProjects = 6;
    this.currentFilter = 'all';
    this.renderProjects();
    this.setupProjectFilters();
    this.setupLoadMore();
  }

  getCosmicProjects() {
    return [
      { title: "Pokedex App", desc: "Interactive Pokemon database with search and filters", category: "featured frontend", tech: ["HTML","CSS","JavaScript","API"], status: "completed", powerLevel: 88, github: "https://github.com/danidanidani2/Pokedex", demo: "https://pokeddex-pokedex.netlify.app/" },
      { title: "Password Generator", desc: "Secure password generator with customization", category: "frontend practice", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 82, github: "https://github.com/danidanidani2/Password-generator", demo: "https://glistening-pithivier-6ba3b9.netlify.app/" },
      { title: "Movie Database", desc: "Movie search app with TMDB API integration", category: "featured frontend", tech: ["HTML","CSS","JavaScript","API"], status: "completed", powerLevel: 86, github: "https://github.com/danidanidani2/Movie-App", demo: "https://moviie-appp.netlify.app/" },
      { title: "Drink Water Tracker", desc: "Hydration tracking application with goals", category: "frontend practice", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 79, github: "https://github.com/danidanidani2/Drink-Water", demo: "http://drinkwat.netlify.app/" },
      { title: "Weather Application", desc: "Real-time weather forecast with location", category: "frontend", tech: ["HTML","CSS","JavaScript","API"], status: "completed", powerLevel: 84, github: "https://github.com/danidanidani2/weather-website", demo: "https://weather-webbsite.netlify.app/" },
      { title: "Task Manager Pro", desc: "Advanced task management with categories", category: "featured frontend", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 87, github: "https://github.com/danidanidani2/Tasks-Manager", demo: "https://tasks-mana.netlify.app/" },
      { title: "Cosmic Analytics", desc: "Dashboard with analytics and charts", category: "featured frontend ai", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 89, github: "https://github.com/danidanidani2/Cosmic-Analytics", demo: "https://cosmic-analytics.netlify.app/" },
      { title: "Nebula Store", desc: "E-commerce platform with shopping cart", category: "frontend", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 85, github: "https://github.com/danidanidani2/NebulaStore", demo: "https://onlineeshoppingg.netlify.app/" },
      { title: "Split Landing", desc: "Interactive split-screen landing page", category: "frontend practice", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 81, github: "https://github.com/danidanidani2/split-landing", demo: "https://daniswebsite.netlify.app/" },
      { title: "Quantum Loading", desc: "Collection of modern loading animations", category: "frontend practice", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 78, github: "https://github.com/danidanidani2/Quantum-Loading", demo: "https://quantum-loading.netlify.app/" },
      { title: "Payment Roll System", desc: "Animated payment receipt interface", category: "frontend", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 83, github: "https://github.com/danidanidani2/Payment-roll", demo: "https://snazzy-pastelito-904c3a.netlify.app/" },
      { title: "ULTRA Todo List", desc: "Advanced todo app with Dragon Ball Z theme", category: "featured frontend", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 90, github: "https://github.com/danidanidani2/To-Do-Lists-ULTRA-SAYAYIN", demo: "https://glistening-pithivier-6ba3b9.netlify.app/" },
      { title: "Expanding Cards", desc: "Interactive card expansion interface", category: "frontend practice", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 80, github: "https://github.com/danidanidani2/Expanding-cards", demo: "https://expading-cardss.netlify.app/" },
      { title: "Progress Steps", desc: "Multi-step progress indicator", category: "frontend practice", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 77, github: "https://github.com/danidanidani2/Progress-Steps", demo: "https://glistening-pithivier-6ba3b9.netlify.app/" },
      { title: "Hidden Search Widget", desc: "Animated search bar with expand effect", category: "frontend practice", tech: ["HTML","CSS","JavaScript"], status: "completed", powerLevel: 76, github: "https://github.com/danidanidani2/Hidden-Search", demo: "https://glistening-pithivier-6ba3b9.netlify.app/" }
    ];
  }

  setupProjectFilters() {
    const filters = document.querySelectorAll('.cosmic-filter');
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        this.currentFilter = filter.dataset.filter;
        this.visibleProjects = 6;
        this.renderProjects();
        this.playCosmicSound('filter');
      });
    });
  }

  setupLoadMore() {
    const loadBtn = document.getElementById('ver-mas-proyectos');
    loadBtn?.addEventListener('click', () => {
      this.visibleProjects += 6;
      this.renderProjects();
      loadBtn.classList.add('loading');
      setTimeout(() => {
        loadBtn.classList.remove('loading');
        loadBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
      this.playCosmicSound('load');
    });
  }

  renderProjects() {
    const gallery = document.getElementById('galeria');
    if (!gallery) {
      console.error('❌ No se encontró el contenedor de proyectos');
      return;
    }

    // FORZAR VISIBILIDAD DEL CONTENEDOR
    gallery.style.opacity = '1';
    gallery.style.visibility = 'visible';
    gallery.style.display = 'grid';

    const filtered = this.currentFilter === 'all'
      ? this.projects
      : this.projects.filter(p => p.category.split(' ').includes(this.currentFilter));

    const slice = filtered.slice(0, this.visibleProjects);
    
    console.log(`🎯 Mostrando ${slice.length} proyectos de ${filtered.length} totales`);
    
    gallery.innerHTML = '';

    slice.forEach((p, index) => {
      const card = this.createProjectCard(p);
      gallery.appendChild(card);
      
      // Forzar visibilidad inmediata de cada proyecto
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      card.style.transform = 'translateY(0)';
      
      // Observar para animaciones (pero ya visible)
      this.revealObserver && this.revealObserver.observe(card);
    });

    // Mostrar/ocultar botón "Load More"
    const btn = document.getElementById('ver-mas-proyectos');
    if (btn) {
      btn.style.display = filtered.length > this.visibleProjects ? 'inline-flex' : 'none';
      btn.style.opacity = '1';
    }

    this.updateProjectsCounter(filtered.length);
  }

  createProjectCard(project) {
    const el = document.createElement('article');
    el.className = 'proyecto visible'; // ← AGREGAR 'visible' DIRECTAMENTE
    el.setAttribute('data-category', project.category);
    el.setAttribute('data-power', project.powerLevel);

    const thumbnail = this.generateProjectThumbnail(project.title);

    el.innerHTML = `
      <img src="${thumbnail}" alt="${project.title}" loading="lazy" />
      <div class="overlay">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <div class="project-meta">
          <div class="tech-tags">
            ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div class="power-level"><i class="fa-solid fa-bolt"></i>${project.powerLevel}</div>
        </div>
        <div class="proyecto-links">
          <a href="${project.demo}" target="_blank" rel="noopener noreferrer" title="Live Demo" onclick="event.stopPropagation()">
            <i class="fa-solid fa-eye"></i>
          </a>
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" title="Source Code" onclick="event.stopPropagation()">
            <i class="fa-brands fa-github"></i>
          </a>
        </div>
      </div>
      <div class="project-badge ${project.status}">
        <i class="fa-solid ${this.getStatusIcon(project.status)}"></i>${project.status}
      </div>
    `;

    // Agregar interacciones
    this.addProjectInteractions(el);
    return el;
  }

  generateProjectThumbnail(title) {
    const initials = title.split(' ').map(w => w[0]).join('').slice(0,3).toUpperCase();
    const colors = ['#00E5A8', '#8B5CF6', '#F59E0B', '#EF4444'];
    const c1 = colors[Math.floor(Math.random()*colors.length)];
    const c2 = colors[Math.floor(Math.random()*colors.length)];
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="400" height="250" fill="#0B1120"/>
        <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#grad)" stroke-width="3" filter="url(#glow)"/>
        <circle cx="300" cy="60" r="40" fill="url(#grad)" opacity="0.3"/>
        <circle cx="100" cy="180" r="30" fill="url(#grad)" opacity="0.3"/>
        <text x="50%" y="55%" text-anchor="middle" fill="url(#grad)" font-size="48" font-weight="900" font-family="Work Sans, sans-serif">${initials}</text>
      </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  getStatusIcon(status) {
    return ({ 'completed': 'fa-check-circle', 'in-progress': 'fa-spinner', 'planned': 'fa-clock' }[status] || 'fa-code');
  }

  addProjectInteractions(projectElement) {
    // Prevenir que el clic en el proyecto abra los enlaces
    projectElement.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        this.createRippleEffect(projectElement, e);
      }
    });

    // Efectos hover
    projectElement.addEventListener('mouseenter', () => {
      projectElement.style.transform = 'translateY(-10px) scale(1.02)';
    });

    projectElement.addEventListener('mouseleave', () => {
      projectElement.style.transform = 'translateY(0) scale(1)';
    });
  }

  updateProjectsCounter(total) {
    const counter = document.querySelector('.counter-number');
    if (!counter) return;
    let start = parseInt(counter.textContent) || 0;
    const end = total;
    const duration = 600, steps = 20, step = (end - start) / steps, time = duration / steps;
    const id = setInterval(() => {
      start += step;
      if ((step > 0 && start >= end) || (step < 0 && start <= end)) { start = end; clearInterval(id); }
      counter.textContent = String(Math.round(start));
    }, time);
  }

  /* ===== NETLIFY FORM ===== */
  setupFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
        return;
      }
      this.showFormSuccess(form);
    });
    this.setupFormInteractions(form);
  }

  setupFormInteractions(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => { input.parentElement.classList.add('focused'); this.playCosmicSound('focus'); });
      input.addEventListener('blur', () => { if (!input.value) input.parentElement.classList.remove('focused'); });
      input.addEventListener('input', () => { input.parentElement.classList.toggle('has-value', !!input.value); });
    });
  }

  validateForm(form) {
    let ok = true;
    const reqs = form.querySelectorAll('[required]');
    reqs.forEach(i => {
      if (!i.value.trim()) { this.showValidationError(i, 'This field is required'); ok = false; }
      else this.clearValidationError(i);
      if (i.type === 'email' && i.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(i.value)) { this.showValidationError(i, 'Please enter a valid email'); ok = false; }
      }
    });
    return ok;
  }

  showValidationError(input, msg) {
    this.clearValidationError(input);
    const err = document.createElement('div');
    err.className = 'validation-error';
    err.textContent = msg;
    err.style.cssText = `color:#EF4444;font-size:.8rem;margin-top:5px;animation:slideDown .3s ease;`;
    input.parentElement.appendChild(err);
    input.style.borderBottomColor = '#EF4444';
    this.playCosmicSound('error');
  }

  clearValidationError(input) {
    input.parentElement.querySelector('.validation-error')?.remove();
    input.style.borderBottomColor = '';
  }

  showFormSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...`;
    btn.disabled = true;
    setTimeout(() => {
      this.showNotification("Message sent successfully! 🚀 I'll get back to you soon.", 'success');
      btn.innerHTML = original;
      btn.disabled = false;
    }, 1200);
  }

  /* ===== SCROLL FX ===== */
  setupScrollEffects() {
    let lastY = window.scrollY;
    const floaters = document.querySelectorAll('.floating-particles .particle');
    window.addEventListener('scroll', () => {
      const dy = window.scrollY - lastY;
      floaters.forEach(p => {
        const speed = parseFloat(p.style.getPropertyValue('--duration')) || 20;
        const move = dy * (speed / 1000);
        const current = parseFloat(p.style.transform?.match(/translateY\(([^)]+)px\)/)?.[1] || 0);
        p.style.transform = `translateY(${current + move}px)`;
      });
      lastY = window.scrollY;
    });
  }

  /* ===== EASTER EGGS ===== */
  setupEasterEggs() {
    this.setupKonamiCode();
    this.setupConsoleMessages();
  }

  setupKonamiCode() {
    const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
    let idx = 0;
    document.addEventListener('keydown', (e) => {
      if (e.code === code[idx]) {
        idx++;
        this.showKonamiProgress(idx, code.length);
        if (idx === code.length) { this.activateSuperSayayanMode(); idx = 0; }
      } else { idx = 0; this.hideKonamiProgress(); }
    });
  }

  showKonamiProgress(cur, tot) {
    let p = document.getElementById('konami-progress');
    if (!p) {
      p = document.createElement('div');
      p.id = 'konami-progress';
      p.style.cssText = `position:fixed;top:20px;right:20px;background:rgba(0,0,0,.8);color:#00E5A8;padding:10px 15px;border-radius:10px;font-family:monospace;z-index:10000;border:2px solid #00E5A8;`;
      document.body.appendChild(p);
    }
    p.textContent = `Konami: ${cur}/${tot}`;
  }
  hideKonamiProgress(){ document.getElementById('konami-progress')?.remove(); }

  activateSuperSayayanMode() {
    COSMIC_CONFIG.superSayayanMode = true;
    document.body.classList.add('super-sayayan-active');
    this.playCosmicSound('transformation');
    for (let i=0;i<20;i++) setTimeout(()=>this.createGoldenParticle(), i*100);
    this.showNotification('SUPER SAYAYÍN MODE ACTIVATED! 🐉 POWER LEVEL OVER 9000!', 'super-sayayan');
    setTimeout(()=>this.deactivateSuperSayayanMode(), 10000);
  }
  deactivateSuperSayayanMode(){ COSMIC_CONFIG.superSayayanMode=false; document.body.classList.remove('super-sayayan-active'); this.showNotification('Power level returning to normal...', 'info'); }
  createGoldenParticle() {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;width:6px;height:6px;background:#F59E0B;border-radius:50%;pointer-events:none;z-index:1000;top:${Math.random()*100}vh;left:${Math.random()*100}vw;animation:goldenFloat 2s ease-out forwards;`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),2000);
  }

  setupConsoleMessages() {
    const msgs = [
      "🚀 Portfolio cósmico cargado - 15 Proyectos VISIBLES!",
      "🐉 ¡El modo Super Sayayín está disponible! (Konami Code: ↑↑↓↓←→←→BA)",
      "💫 15 proyectos reales conectados con GitHub y Netlify",
      "🎨 Diseñado con la energía del Universo 7",
      "⚡ ¡Tu búsqueda de desarrollador frontend termina aquí!",
      "🌟 Portfolio nivel Ultra Instinct - ¡OVER 9000!"
    ];
    console.log(`%c${msgs[Math.floor(Math.random()*msgs.length)]}`, 
      'background: linear-gradient(135deg, #00E5A8, #8B5CF6); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');
  }

  /* ===== CV ===== */
  setupCvDownload() {
    const cvBtn = document.getElementById('cvBtn');
    cvBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showNotification('Preparing CV download...', 'info');
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'Daniel_Ortiz.pdf';
        link.download = 'Daniel_Ortiz.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showNotification('CV downloaded successfully!', 'success');
      }, 1000);
    });
  }

  /* ===== EFECTOS ESPECIALES ===== */
  setupSpecialEffects() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cosmic-btn, .cosmic-download, .cosmic-submit');
      if (btn) {
        this.createRippleEffect(btn, e);
      }
    });
  }

  createRippleEffect(element, evt) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = evt ? (evt.clientX - rect.left - size / 2) : (rect.width / 2 - size / 2);
    const y = evt ? (evt.clientY - rect.top - size / 2) : (rect.height / 2 - size / 2);

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  playCosmicSound(type) {
    const sounds = { click:'🔊', theme:'🎵', scroll:'📜', type:'⌨️', hover:'✨', filter:'🔍', load:'🔄', focus:'🎯', error:'❌', transformation:'🐉' };
    if (sounds[type]) console.log(sounds[type] + ` Cosmic sound: ${type}`);
  }

  showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `cosmic-notification ${type}`;
    n.textContent = message;
    n.style.cssText = `
      position:fixed;top:20px;right:20px;background:${this.getNotificationColor(type)};
      color:white;padding:15px 20px;border-radius:10px;z-index:10000;
      transform:translateX(400px);transition:transform .3s ease;font-weight:600;
      max-width:400px;box-shadow: 0 20px 60px rgba(0,0,0,.5);`;
    document.body.appendChild(n);
    setTimeout(()=>{ n.style.transform = 'translateX(0)'; },100);
    setTimeout(()=>{ n.style.transform='translateX(400px)'; setTimeout(()=>n.remove(),300); },5000);
  }

  getNotificationColor(type) {
    const map = {
      success:'linear-gradient(135deg,#00E5A8,#10B981)',
      error:'linear-gradient(135deg,#EF4444,#DC2626)',
      info:'linear-gradient(135deg,#3B82F6,#2563EB)',
      warning:'linear-gradient(135deg,#F59E0B,#D97706)',
      'super-sayayan':'linear-gradient(135deg,#F59E0B,#EF4444)'
    };
    return map[type] || map.info;
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  window.cosmicPortfolio = new CosmicPortfolio();
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
    @keyframes goldenFloat { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(-100px) rotate(360deg);opacity:0} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
    .typed-complete { animation: pulse-glow 2s ease-in-out; }
    @keyframes pulse-glow { 0%,100%{ text-shadow:0 0 20px rgba(0,229,168,.5)} 50%{ text-shadow:0 0 30px rgba(0,229,168,.8), 0 0 40px rgba(0,229,168,.6)} }
  `;
  document.head.appendChild(style);
});

/* ===== GLOBAL ERRORS ===== */
window.addEventListener('error', (e) => {
  console.error('🚨 Error cósmico detectado:', e.error);
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CosmicPortfolio;
}