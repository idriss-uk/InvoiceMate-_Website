/**
 * InvoiceMate Global — Dynamic Single-Source Versioning
 * Centralized configuration to keep all version badges, announcement banners,
 * hero pills, and CTA links synchronized across the website.
 */
const APP_VERSION_CONFIG = {
  version: "v1.4.9",
  releaseDate: "October 2026",
  highlights: "Full 6-Language RTL Localization & Native Date Pickers",
  bannerHtml: '🚀 <strong>InvoiceMate Global v1.4.9 Released!</strong> Experience full 6-language RTL localization &amp; native date pickers.',
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.invoicemateglobal"
};

function applyVersionConfig(config = APP_VERSION_CONFIG) {
  // 1. Synchronize Top Announcement Banners
  document.querySelectorAll('.announcement-bar, .update-banner').forEach(el => {
    const textSpan = el.querySelector('span');
    if (textSpan) {
      textSpan.innerHTML = config.bannerHtml;
    }
    const storeLink = el.querySelector('a');
    if (storeLink) {
      storeLink.href = config.playStoreUrl;
    }
  });

  // 2. Synchronize Hero Feature Pill
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    const textSpan = heroBadge.querySelector('span:not(.dot)');
    if (textSpan) {
      textSpan.innerHTML = `✨ What's New in ${config.version}: ${config.highlights} &rarr;`;
    }
  }

  // 3. Synchronize "What's New" Section Header & Subtitle
  const versionBadge = document.querySelector('#whats-new .version-badge');
  if (versionBadge) {
    versionBadge.innerHTML = `<span class="dot"></span> ${config.version} • Released ${config.releaseDate}`;
  }

  const whatsNewSubtitle = document.querySelector('#whats-new .section-subtitle');
  if (whatsNewSubtitle) {
    whatsNewSubtitle.innerHTML = `Version ${config.version.replace(/^v/, '')} — ${config.highlights} &amp; Payment Tracking`;
  }

  // 4. Synchronize CTA Buttons with Version
  document.querySelectorAll('#whats-new .whats-new-cta a.btn-primary span, [data-version-cta]').forEach(el => {
    el.textContent = `Download ${config.version} on Google Play`;
  });

  // 5. Synchronize Any Specific Elements Marked with data-app-version
  document.querySelectorAll('[data-app-version]').forEach(el => {
    el.textContent = config.version;
  });
}

// Execute immediately when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyVersionConfig());
} else {
  applyVersionConfig();
}

// Support Node/CommonJS export for testing environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_VERSION_CONFIG, applyVersionConfig };
}
