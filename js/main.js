/*
 * InsightFlux Analytics - main.js
 * Interactive logic and premium UI mechanics
 */

// --- Immediate Theme Check (Prevents Layout Flash) ---
(function() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
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
  const revealElements = document.querySelectorAll('.reveal');
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
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealOnScroll.observe(el));
  }

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
});
