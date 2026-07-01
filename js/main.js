/*
 * InsightFlux Analytics - main.js
 * Interactive logic and premium UI mechanics
 */

// --- Immediate Theme Check (Prevents Layout Flash) ---
(function() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // --- Query Parameter Pre-filling ---
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramService = urlParams.get('service');
    const paramPlan = urlParams.get('plan');
    const paramEvent = urlParams.get('event');

    const contactServiceSelect = document.getElementById('service');
    const contactMessageTextarea = document.getElementById('message');

    if (contactServiceSelect) {
      if (paramEvent) {
        contactServiceSelect.value = "Workshop Registration";
        const eventMapping = {
          'bootcamp-july': 'Data Analytics Bootcamp for Beginners',
          'ai-webinar-july': 'AI in Business: Real-World Automation Use Cases',
          'powerbi-masterclass': 'Power BI Masterclass: Build a Live Sales Dashboard',
          'datathon-2026': 'InsightFlux DataThon 2026 — 24-Hour Hackathon',
          'panel-sep': 'Future of Work: AI, Analytics & Career Transitions',
          'launch-sep': 'InsightFlux AI Dashboard Suite — Grand Launch'
        };
        const eventName = eventMapping[paramEvent] || paramEvent;
        if (contactMessageTextarea) {
          contactMessageTextarea.value = `I would like to register for the upcoming event: ${eventName}.`;
        }
      } else if (paramService) {
        const serviceMapping = {
          'data-analytics': 'Data Analytics & BI',
          'powerbi': 'Power BI Dashboards',
          'ai-automation': 'AI Automations & Integrations',
          'web-dev': 'Website Development',
          'portfolio': 'Portfolio Development',
          'strategy': 'Business Growth Strategy',
          'gbp': 'Google Business Profiles',
          'marketing': 'Digital Marketing Solutions',
          'chatbots': 'AI Chatbots & Automations',
          'ecommerce': 'E-Commerce Solutions',
          'social-media': 'Social Media Management',
          'uiux': 'UI/UX Design',
          'seo': 'SEO & Growth Optimization',
          'lead-gen': 'Lead Generation Solutions',
          'branding': 'Branding & Identity',
          'consulting': 'Consulting & Support'
        };
        const serviceVal = serviceMapping[paramService];
        if (serviceVal) {
          contactServiceSelect.value = serviceVal;
        }
      } else if (paramPlan) {
        contactServiceSelect.value = 'Consulting & Support';
        if (contactMessageTextarea) {
          contactMessageTextarea.value = `Inquiry regarding the ${paramPlan.charAt(0).toUpperCase() + paramPlan.slice(1)} Pricing Plan.`;
        }
      }
    }
  } catch (err) {
    console.error("Query param parse error:", err);
  }

  // --- Sticky Header Scroll Effect ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Hamburger Menu ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });

    // Close menu when clicking outside the drawer
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      }
    });


  }

  // --- Active Navigation Highlighting ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  if (revealElements.length > 0) {
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealOnScroll.observe(el));
  }

  // --- Parallax Scrolling Elements (Meltano Style) ---
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // 1. Move background parallax blobs
    const blobs = document.querySelectorAll('.parallax-blob');
    blobs.forEach(blob => {
      const speed = parseFloat(blob.getAttribute('data-speed')) || 0.1;
      blob.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // 2. Parallax effect for Hero content (fade and slight translate)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.innerWidth > 768) {
      const heroShift = scrolled * 0.22;
      const heroOpacity = Math.max(0, 1 - (scrolled / 550));
      heroContent.style.transform = `translateY(${heroShift}px)`;
      heroContent.style.opacity = heroOpacity;
    }

    // 3. Zoom / open screen animation on scroll
    const eventsSec = document.querySelector('.events-section');
    if (eventsSec) {
      const rect = eventsSec.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the events section is through the viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const scrolledFraction = (viewportHeight - rect.top) / (viewportHeight + rect.height * 0.5); 
        const progress = Math.min(1, Math.max(0, scrolledFraction)); // Clamp between 0 and 1
        
        // Progress goes from 0 (starts entering screen) to 1 (fully in screen)
        // Scale from 0.90 to 1.0
        const scaleVal = 0.90 + (progress * 0.10);
        // Rotation from 12deg to 0deg
        const rotateVal = 12 * (1 - progress);
        
        eventsSec.style.setProperty('--events-scale', scaleVal);
        eventsSec.style.setProperty('--events-rotate', `${rotateVal}deg`);
      }
    }

    // 4. Move Hero Parallax Office Background (Meltano style zoom & offset)
    if (window.innerWidth > 768 && scrolled < 900) {
      const layers = document.querySelectorAll('.hero-parallax-layer');
      layers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0.1;
        
        if (layer.classList.contains('layer-office')) {
          // The office background zooms in slightly and pans down to create an immersive camera scale
          const scaleVal = 1 + (scrolled * 0.0003);
          const shiftY = scrolled * speed;
          layer.style.transform = `translateY(${shiftY}px) scale(${scaleVal})`;
        }
      });
    }
  }, { passive: true });

  // --- Services Category Filtering (Homepage) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  if (filterButtons.length > 0 && serviceCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        serviceCards.forEach(card => {
          const cardCategories = card.getAttribute('data-categories').split(' ');
          if (category === 'all' || cardCategories.includes(category)) {
            card.style.display = 'flex';
            card.style.animation = 'none';
            // Trigger reflow to restart animation
            void card.offsetWidth;
            card.style.animation = 'fadeInCard 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Portfolio Category Filtering (Homepage) ---
  const portfolioFilterBtns = document.querySelectorAll('.p-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  if (portfolioFilterBtns.length > 0 && portfolioCards.length > 0) {
    portfolioFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        portfolioFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = 'fadeInCard 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Careers Accordion ---
  const accordionTriggers = document.querySelectorAll('.role-trigger');
  if (accordionTriggers.length > 0) {
    accordionTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const accordion = trigger.parentElement;
        const content = trigger.nextElementSibling;
        const isActive = accordion.classList.contains('active');

        // Close other accordions
        document.querySelectorAll('.role-accordion').forEach(acc => {
          acc.classList.remove('active');
          acc.querySelector('.role-content').style.maxHeight = null;
        });

        // Toggle clicked
        if (!isActive) {
          accordion.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // --- Careers Application Modal ---
  const modalOverlay = document.getElementById('apply-modal');
  const openModalBtns = document.querySelectorAll('.btn-apply');
  const closeModalBtn = document.querySelector('.modal-close');
  const roleInput = document.getElementById('apply-role');

  if (modalOverlay) {
    // Open modal
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const roleName = btn.getAttribute('data-role');
        if (roleInput && roleName) {
          roleInput.value = roleName;
        }
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal via Close button
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }

    // Close modal via clicking overlay background
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Handle Application Form Submission
    const applyForm = document.getElementById('apply-form');
    if (applyForm) {
      applyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const role = roleInput ? roleInput.value : 'Data & AI Team';
        const name = document.getElementById('apply-name').value.trim();
        const email = document.getElementById('apply-email').value.trim();
        const phone = document.getElementById('apply-phone').value.trim();
        const portfolio = document.getElementById('apply-portfolio').value.trim();
        const message = document.getElementById('apply-message').value.trim();

        if (!name || !email || !phone || !message) {
          alert('Please fill out all required fields (Name, Email, Phone, and Motivation).');
          return;
        }

        // Save to LocalStorage for Admin Portal
        try {
          const apps = JSON.parse(localStorage.getItem('insightflux_applications') || '[]');
          apps.unshift({
            id: Date.now(),
            name,
            email,
            phone,
            role,
            portfolio: portfolio || 'N/A',
            message,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          });
          localStorage.setItem('insightflux_applications', JSON.stringify(apps));
        } catch (err) {
          console.error("LocalStorage save error:", err);
        }

        // Simple visual feedback
        const submitBtn = applyForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Opening Mail Client...';

        // Construct mailto link
        const subject = encodeURIComponent(`Job Application: ${role} - ${name}`);
        const body = encodeURIComponent(`Hello InsightFlux Analytics Team,\n\nI would like to apply for the position of "${role}".\n\nHere are my application details:\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone}\n- Portfolio/LinkedIn: ${portfolio || 'N/A'}\n\nWhy I want to join:\n${message}\n\nSincerely,\n${name}`);
        
        const mailtoUrl = `mailto:insightfluxa@gmail.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
          // Open mail client
          window.location.href = mailtoUrl;

          // Success Alert
          alert(`Thank you, ${name}! Your email client will now open to send your application details directly to insightfluxa@gmail.com. Please click "Send" in your email app.`);
          
          applyForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          modalOverlay.classList.remove('active');
          document.body.style.overflow = 'auto';
        }, 1000);
      });
    }
  }

  // --- Contact Form Submission & Validation ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Client side form validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const company = document.getElementById('company').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields (Name, Email, and Message).');
        return;
      }

      // Save to LocalStorage for Admin Portal
      try {
        if (service === "Workshop Registration") {
          const regs = JSON.parse(localStorage.getItem('insightflux_workshop_registrations') || '[]');
          regs.unshift({
            id: Date.now(),
            name,
            email,
            phone: phone || 'N/A',
            company: company || 'N/A',
            eventName: message.replace('I would like to register for the upcoming event:', '').trim(),
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          });
          localStorage.setItem('insightflux_workshop_registrations', JSON.stringify(regs));
        } else {
          const contacts = JSON.parse(localStorage.getItem('insightflux_contacts') || '[]');
          contacts.unshift({
            id: Date.now(),
            name,
            email,
            phone: phone || 'N/A',
            company: company || 'N/A',
            service,
            message,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          });
          localStorage.setItem('insightflux_contacts', JSON.stringify(contacts));
        }
      } catch (err) {
        console.error("LocalStorage save error:", err);
      }

      // Visual feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Opening Mail Client...';

      // Automatically construct the mailto link and redirect
      const subject = encodeURIComponent(`Consultation Booking: ${service} - ${company || name}`);
      const body = encodeURIComponent(`Hello InsightFlux Analytics Team,\n\nI would like to book a free consultation for "${service}".\n\nHere are my contact details:\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone || 'N/A'}\n- Company: ${company || 'N/A'}\n\nProject Brief:\n${message}\n\nSincerely,\n${name}`);
      
      const mailtoUrl = `mailto:insightfluxa@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        // Trigger mail client
        window.location.href = mailtoUrl;

        // Success Alert
        alert(`Thank you, ${name}! Your email client will now open to send this consultation brief directly to insightfluxa@gmail.com. Please click "Send" in your email app.`);
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1000);
    });
  }

  // --- Theme Toggle Button Click Listener ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
  }

  // --- Workshop Video Lightbox ---
  const workshopCard   = document.getElementById('workshop-card');
  const videoModal     = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const modalVideo     = document.getElementById('workshop-modal-video');

  function openVideoModal() {
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (modalVideo) {
      modalVideo.currentTime = 0;
      modalVideo.play();
    }
  }

  function closeVideoModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (modalVideo) {
      modalVideo.pause();
    }
  }

  if (workshopCard && videoModal) {
    // Open on card click
    workshopCard.addEventListener('click', openVideoModal);

    // Close via × button
    if (videoModalClose) {
      videoModalClose.addEventListener('click', closeVideoModal);
    }

    // Close by clicking the dark backdrop
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
      }
    });
  }

  // --- Workshop Registration Modal ---
  const registerModal = document.getElementById('register-modal');
  const registerModalClose = document.getElementById('register-modal-close');
  const registerForm = document.getElementById('register-form');
  const registerEventNameInput = document.getElementById('register-event-name');
  const registerModalSubtitle = document.getElementById('register-modal-subtitle');

  function openRegisterModal(eventName) {
    if (!registerModal) return;
    registerEventNameInput.value = eventName;
    if (registerModalSubtitle) {
      registerModalSubtitle.textContent = `Registering for: ${eventName}`;
    }
    registerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeRegisterModal() {
    if (!registerModal) return;
    registerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Bind all register buttons
  document.addEventListener('click', (e) => {
    const registerBtn = e.target.closest('.btn-register-event');
    if (registerBtn) {
      e.preventDefault();
      const eventName = registerBtn.getAttribute('data-event') || 'Live Event';
      openRegisterModal(eventName);
    }
  });

  if (registerModalClose) {
    registerModalClose.addEventListener('click', closeRegisterModal);
  }

  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) closeRegisterModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && registerModal.classList.contains('active')) {
        closeRegisterModal();
      }
    });
  }

  // Handle registration submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventName = registerEventNameInput.value;
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const whatsapp = document.getElementById('register-whatsapp').value.trim();
      const company = document.getElementById('register-company').value.trim();

      if (!name || !email || !whatsapp || !company) {
        alert('Please fill out all required fields.');
        return;
      }

      // Save to LocalStorage for Admin Portal
      try {
        const regs = JSON.parse(localStorage.getItem('insightflux_workshop_registrations') || '[]');
        regs.unshift({
          id: Date.now(),
          name,
          email,
          whatsapp,
          company,
          eventName,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        });
        localStorage.setItem('insightflux_workshop_registrations', JSON.stringify(regs));
      } catch (err) {
        console.error("LocalStorage save error:", err);
      }

      // Visual feedback
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';

      // Automatically construct the mailto link and redirect
      const subject = encodeURIComponent(`Workshop Registration: ${eventName} - ${name}`);
      const body = encodeURIComponent(`Hello InsightFlux Analytics Team,\n\nI would like to register for the workshop: "${eventName}".\n\nHere are my registration details:\n- Name: ${name}\n- Email: ${email}\n- WhatsApp: ${whatsapp}\n- Institution/Company: ${company}\n\nSincerely,\n${name}`);
      
      const mailtoUrl = `mailto:insightfluxa@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        // Trigger mail client
        window.location.href = mailtoUrl;

        // Success Alert
        alert(`Thank you, ${name}! Your registration for "${eventName}" has been captured. Your email client will now open to submit your details directly to insightfluxa@gmail.com.`);
        
        registerForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        closeRegisterModal();
      }, 1000);
    });
  }

  // ============================================================
  // EVENT COUNTDOWN TIMERS
  // ============================================================
  (function initEventCountdowns() {
    const countdowns = document.querySelectorAll('.event-countdown[data-date]');
    if (!countdowns.length) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown(el) {
      const target = new Date(el.getAttribute('data-date')).getTime();
      const now    = Date.now();
      const diff   = target - now;

      const daysEl  = el.querySelector('[data-unit="days"]');
      const hoursEl = el.querySelector('[data-unit="hours"]');
      const minsEl  = el.querySelector('[data-unit="mins"]');

      if (diff <= 0) {
        if (daysEl)  daysEl.textContent  = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl)  minsEl.textContent  = '00';
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const days  = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins  = Math.floor((totalSecs % 3600)  / 60);

      if (daysEl)  daysEl.textContent  = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl)  minsEl.textContent  = pad(mins);
    }

    // Initial render
    countdowns.forEach(updateCountdown);

    // Update every minute
    setInterval(() => countdowns.forEach(updateCountdown), 60000);
  })();

});
