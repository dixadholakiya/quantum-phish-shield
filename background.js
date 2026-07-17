/**
 * background.js - Service worker to orchestrate menus, storage, and side panel events.
 */

// Initialize extension components on installation
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for link-specific audits
  chrome.contextMenus.create({
    id: "analyze-phishing-link",
    title: "Verify Link for Phishing Threat",
    contexts: ["link"]
  });
  console.log("Quantum Phish Shield context menus initialized.");
});

// Configure Side Panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch(error => console.error("Error setting side panel behavior:", error));

// Handle Context Menu Actions
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "analyze-phishing-link") {
    const targetUrl = info.linkUrl;
    try {
      // Store the clicked link URL to session state for sidepanel loading
      await chrome.storage.session.set({ lastAuditedUrl: targetUrl });
      
      // Open the side panel inside the user's active window
      await chrome.sidePanel.open({ windowId: tab.windowId });
      
      // Notify the side panel to trigger link analysis
      chrome.runtime.sendMessage({ action: "auditExternalLink", url: targetUrl })
        .catch(() => {
          // If sidepanel isn't loaded yet, it will read from session storage on mount
        });
    } catch (err) {
      console.error("Error handling context menu audit:", err);
    }
  }
});

// Handle incoming messages from popup or sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchThreatIntelligence') {
    (async () => {
      try {
        const urlStr = message.url;
        const urlObj = new URL(urlStr);
        const domain = urlObj.hostname;

        // Fetch simulated but realistic Threat Intelligence data
        const threatIntel = generateThreatIntel(domain);
        sendResponse({ success: true, intel: threatIntel });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true; // Keep channel open
  }
});

/**
 * Generates structured, deterministic reputation data for a domain.
 */
function generateThreatIntel(domain) {
  // Deterministic seed generation based on domain characters
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }

  const isSuspiciousWord = /signin|login|verify|security|bank|update|account|secure/i.test(domain);
  const isSuspiciousTld = /\.(xyz|top|cc|net|biz|info|live|ru)$/i.test(domain);
  
  // Calculate deterministic metrics
  let threatScore = Math.abs(hash % 100);
  if (isSuspiciousWord) threatScore = Math.min(100, threatScore + 30);
  if (isSuspiciousTld) threatScore = Math.min(100, threatScore + 20);
  if (domain.includes('google') || domain.includes('github') || domain.includes('cisco')) {
    // Whitelist simulated correction
    threatScore = Math.max(0, threatScore - 60);
  }

  // Deterministic age in days
  const ageDays = Math.abs((hash * 17) % 7300); // Up to 20 years
  
  // Deterministic country code
  const countries = ["US", "DE", "CN", "RU", "NL", "SG", "IE", "BR"];
  const country = countries[Math.abs(hash % countries.length)];

  // Deterministic SSL registration age
  const sslDays = Math.abs((hash * 3) % 365);

  let category = "Low Risk";
  let color = "#10B981"; // Emerald
  if (threatScore > 40 && threatScore <= 75) {
    category = "Suspicious Activity";
    color = "#F59E0B"; // Amber
  } else if (threatScore > 75) {
    category = "High-Risk Threat";
    color = "#EF4444"; // Rose
  }

  return {
    domain,
    threatScore,
    category,
    color,
    country,
    domainAge: formatAge(ageDays),
    sslStatus: sslDays > 30 ? "Valid (ECC 256)" : "Self-Signed/Expired",
    blacklistCount: threatScore > 70 ? Math.abs(hash % 5) + 1 : 0
  };
}

function formatAge(days) {
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years, ${Math.floor((days % 365) / 30)} months`;
}
