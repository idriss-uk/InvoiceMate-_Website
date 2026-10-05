// Central Version Controller for www.invoicemateglobal.com
const APP_RELEASE = {
  version: "1.4.9",
  buildNumber: "47",
  title: "Full 6-Language RTL Localization & Native Date Pickers",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.invoicemateglobal"
};

function applyVersionConfig() {
  // 1. Update Top Banner
  const topBannerText = document.querySelector(".announcement-bar strong");
  if (topBannerText) {
    topBannerText.textContent = `InvoiceMate Global v${APP_RELEASE.version} Released!`;
  }
  const topBannerLink = document.querySelector(".announcement-bar a, .update-banner a");
  if (topBannerLink && APP_RELEASE.playStoreUrl) {
    topBannerLink.href = APP_RELEASE.playStoreUrl;
  }

  // 2. Update Hero Badge Text
  const heroBadge = document.querySelector(".hero-badge");
  if (heroBadge) {
    const textSpan = heroBadge.querySelector("span:not(.dot)");
    if (textSpan) {
      textSpan.textContent = `✨ What's New in v${APP_RELEASE.version}: ${APP_RELEASE.title} →`;
    } else {
      heroBadge.innerHTML = `<span class="dot"></span> ✨ What's New in v${APP_RELEASE.version}: ${APP_RELEASE.title} →`;
    }
    heroBadge.setAttribute("href", "#whats-new");
  }

  // 3. Sync Footer / Release Modal elements
  const versionTags = document.querySelectorAll(".app-version-tag, [data-app-version]");
  versionTags.forEach(el => el.textContent = `v${APP_RELEASE.version}`);

  // 4. Sync What's New Section if present
  const versionBadge = document.querySelector("#whats-new .badge, #whats-new .version-badge");
  if (versionBadge) {
    versionBadge.textContent = `Version ${APP_RELEASE.version} Changelog`;
  }

  // 5. Sync Play Store CTAs
  document.querySelectorAll("#whats-new .whats-new-cta a.btn-primary span, [data-version-cta]").forEach(el => {
    el.textContent = `Download v${APP_RELEASE.version} on Google Play`;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyVersionConfig);
} else {
  applyVersionConfig();
}

// Backward compatibility aliases
const APP_VERSION_CONFIG = APP_RELEASE;

if (typeof module !== "undefined" && module.exports) {
  module.exports = { APP_RELEASE, APP_VERSION_CONFIG, applyVersionConfig };
}
