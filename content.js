/**
 * content.js - Extracts security signals and DOM metrics for phishing analysis.
 */

(() => {
  // Extract key signals from the document DOM
  const extractSignals = () => {
    const forms = document.querySelectorAll('form');
    const inputFields = document.querySelectorAll('input');
    const links = document.querySelectorAll('a');
    const scripts = document.querySelectorAll('script');
    
    // Check for password inputs
    let hasPasswordInput = false;
    inputFields.forEach(input => {
      if (input.type === 'password') {
        hasPasswordInput = true;
      }
    });

    // Extract links pointing to external domains
    const currentDomain = window.location.hostname;
    let externalLinksCount = 0;
    links.forEach(link => {
      try {
        const url = new URL(link.href);
        if (url.hostname && url.hostname !== currentDomain) {
          externalLinksCount++;
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    });

    // Check script sources
    const externalScriptOrigins = new Set();
    scripts.forEach(script => {
      if (script.src) {
        try {
          const url = new URL(script.src);
          if (url.hostname && url.hostname !== currentDomain) {
            externalScriptOrigins.add(url.hostname);
          }
        } catch (e) {
          // Ignore
        }
      }
    });

    return {
      domain: currentDomain,
      url: window.location.href,
      title: document.title,
      hasPasswordInput,
      formsCount: forms.length,
      inputsCount: inputFields.length,
      linksCount: links.length,
      externalLinksCount,
      externalScriptOrigins: Array.from(externalScriptOrigins)
    };
  };

  // Listen for analysis queries from popup or side panel
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractDOMMetrics') {
      try {
        const metrics = extractSignals();
        sendResponse({ success: true, metrics });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    }
    return true; // Keep message channel open for async response
  });
})();
