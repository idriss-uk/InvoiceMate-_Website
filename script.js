/* ============================================
   InvoiceMate Global — Core Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Mobile Nav Toggle & Accessibility ----
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    const setMobileMenuState = (isOpen) => {
      navLinks.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyActive = navLinks.classList.contains('active');
      setMobileMenuState(!isCurrentlyActive);
    });

    // Close mobile nav when clicking any link inside nav-links
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMobileMenuState(false);
      });
    });

    // Close nav when clicking outside navbar
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && navbar && !navbar.contains(e.target)) {
        setMobileMenuState(false);
      }
    });

    // Close nav on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        setMobileMenuState(false);
        navToggle.focus();
      }
    });
  }

  // ---- Smooth Scroll for Internal Anchor Links (#features, #pricing, etc.) ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Scroll Reveal Animation with Immediate Fallback ----
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If IntersectionObserver is not supported, reveal everything immediately
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ---- Language Request / Roadmap Modal Handler ----
  const languageModal = document.getElementById('language-modal');
  const openLangModalBtns = document.querySelectorAll('.open-language-modal');
  const closeLangModalBtn = document.getElementById('close-language-modal');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const langReqForm = document.getElementById('language-request-form');
  const langReqSuccess = document.getElementById('language-request-success');
  const reqLangSelect = document.getElementById('req-language');
  const otherLangGroup = document.getElementById('other-lang-group');
  const otherLangInput = document.getElementById('other-language');

  const openLanguageModal = () => {
    if (languageModal) {
      languageModal.style.display = 'flex';
      languageModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (reqLangSelect) reqLangSelect.focus();
    }
  };

  const closeLanguageModal = () => {
    if (languageModal) {
      languageModal.style.display = 'none';
      languageModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Reset form view after close
      if (langReqForm && langReqSuccess) {
        setTimeout(() => {
          langReqForm.style.display = 'block';
          langReqSuccess.style.display = 'none';
          langReqForm.reset();
          if (otherLangGroup) otherLangGroup.style.display = 'none';
        }, 300);
      }
    }
  };

  openLangModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLanguageModal();
    });
  });

  if (closeLangModalBtn) closeLangModalBtn.addEventListener('click', closeLanguageModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeLanguageModal);

  // Close modal when clicking backdrop
  if (languageModal) {
    languageModal.addEventListener('click', (e) => {
      if (e.target === languageModal) {
        closeLanguageModal();
      }
    });
  }

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && languageModal && languageModal.style.display === 'flex') {
      closeLanguageModal();
    }
  });

  // Toggle Other Language input
  if (reqLangSelect && otherLangGroup) {
    reqLangSelect.addEventListener('change', () => {
      if (reqLangSelect.value === 'Other') {
        otherLangGroup.style.display = 'block';
        if (otherLangInput) otherLangInput.setAttribute('required', 'required');
      } else {
        otherLangGroup.style.display = 'none';
        if (otherLangInput) otherLangInput.removeAttribute('required');
      }
    });
  }

  // Handle Form Submission & Track Demand Metrics
  if (langReqForm) {
    langReqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedLang = reqLangSelect.value === 'Other' && otherLangInput?.value 
        ? otherLangInput.value.trim() 
        : reqLangSelect.value;
      const country = document.getElementById('req-country')?.value.trim() || 'Unspecified';
      const email = document.getElementById('req-email')?.value.trim() || '';

      // Track metric in GA4 if available
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'language_request', {
          language_requested: selectedLang,
          country: country
        });
      }

      // Store in local metrics cache
      try {
        const existingRequests = JSON.parse(localStorage.getItem('invoicemate_lang_requests') || '[]');
        existingRequests.push({
          language: selectedLang,
          country: country,
          email: email,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('invoicemate_lang_requests', JSON.stringify(existingRequests));
      } catch (err) {
        console.warn('Could not cache language request', err);
      }

      // Display success view
      langReqForm.style.display = 'none';
      if (langReqSuccess) langReqSuccess.style.display = 'block';
    });
  }
});

// ---- Global JSON Schema Validator for Android & Web Backups ----
window.InvoiceMateSchemaValidator = {
  version: "1.5.0",
  validate: function (jsonPayload) {
    let parsed = jsonPayload;
    if (typeof jsonPayload === "string") {
      try {
        parsed = JSON.parse(jsonPayload);
      } catch (e) {
        return { valid: false, errors: ["Invalid JSON format: " + e.message] };
      }
    }

    if (!parsed || typeof parsed !== "object") {
      return { valid: false, errors: ["Backup payload must be a JSON object."] };
    }

    const countryCode = parsed.countryCode || parsed.business?.countryCode || "PT";
    const taxIdLabel = parsed.taxIdLabel || parsed.business?.taxIdLabel || (countryCode === "PT" ? "NIF" : "Tax ID");
    const taxIdValue = parsed.taxIdValue || parsed.business?.taxIdValue || parsed.business?.vatNo || "";

    return {
      valid: true,
      countryCode: String(countryCode).toUpperCase(),
      taxIdLabel: String(taxIdLabel),
      taxIdValue: String(taxIdValue),
      invoicesCount: Array.isArray(parsed.invoices) ? parsed.invoices.length : 0,
      timestamp: new Date().toISOString()
    };
  }
};
