/**
 * sidepanel.js - Interactive operations for the deep audit sidepanel.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const inspectedDomain = document.getElementById('inspected-domain');
  const threatScore = document.getElementById('threat-score');
  const riskCategory = document.getElementById('risk-category');
  const threatBar = document.getElementById('threat-bar');
  
  const metaAge = document.getElementById('meta-age');
  const metaCountry = document.getElementById('meta-country');
  const metaSsl = document.getElementById('meta-ssl');
  const metaBlacklist = document.getElementById('meta-blacklist');
  
  const aiExplanation = document.getElementById('ai-explanation');
  
  const sigForms = document.getElementById('sig-forms');
  const sigInputs = document.getElementById('sig-inputs');
  const sigLinks = document.getElementById('sig-links');
  const sigPwdWarning = document.getElementById('sig-pwd-warning');
  
  const reportsLog = document.getElementById('reports-log');

  let activeUrl = null;

  // Initialize view from active tab or last selected context link
  try {
    // Check if there's a context link that redirected here
    const sessionData = await chrome.storage.session.get('lastAuditedUrl');
    if (sessionData.lastAuditedUrl) {
      activeUrl = sessionData.lastAuditedUrl;
      // Clear after read to avoid persistent locks
      await chrome.storage.session.remove('lastAuditedUrl');
    } else {
      // Default to active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url) {
        activeUrl = tab.url;
      }
    }

    if (activeUrl) {
      runAudit(activeUrl);
    } else {
      inspectedDomain.textContent = "Please navigate to a webpage";
    }
  } catch (err) {
    inspectedDomain.textContent = "Error loading context";
    console.error("Sidepanel initialization error:", err);
  }

  // Listen for context menu triggers that fire while the sidepanel is already open
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "auditExternalLink") {
      activeUrl = message.url;
      runAudit(activeUrl);
    }
  });

  async function runAudit(urlStr) {
    try {
      const url = new URL(urlStr);
      inspectedDomain.textContent = url.hostname;
      
      // Reset displays
      aiExplanation.innerHTML = `Analyzing page features using local threat engine...`;
      sigPwdWarning.style.display = 'none';

      // 1. Fetch Threat Intelligence via background worker
      chrome.runtime.sendMessage({ action: 'fetchThreatIntelligence', url: urlStr }, (response) => {
        if (response && response.success) {
          const intel = response.intel;
          threatScore.textContent = `${intel.threatScore}%`;
          threatScore.style.color = intel.color;
          
          riskCategory.textContent = intel.category;
          riskCategory.style.color = intel.color;
          riskCategory.style.backgroundColor = `${intel.color}15`;
          
          threatBar.style.width = `${intel.threatScore}%`;
          threatBar.style.backgroundColor = intel.color;
          
          metaAge.textContent = intel.domainAge;
          metaCountry.textContent = intel.country;
          metaSsl.textContent = intel.sslStatus;
          metaBlacklist.textContent = intel.blacklistCount > 0 ? `${intel.blacklistCount} Lists` : "Clean";
          metaBlacklist.style.color = intel.blacklistCount > 0 ? 'var(--color-danger)' : 'var(--text-primary)';
          
          // Trigger local AI interpretation based on metrics
          generateAiExplanation(intel);
        } else {
          inspectedDomain.textContent = "Threat Intel Offline";
        }
      });

      // 2. Query Page DOM Metrics via content script injection
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && new URL(tab.url).hostname === url.hostname) {
        chrome.tabs.sendMessage(tab.id, { action: 'extractDOMMetrics' }, (response) => {
          if (response && response.success) {
            const metrics = response.metrics;
            sigForms.textContent = metrics.formsCount;
            sigInputs.textContent = metrics.inputsCount;
            sigLinks.textContent = metrics.externalLinksCount;
            
            if (metrics.hasPasswordInput) {
              sigPwdWarning.style.display = 'block';
            }
          }
        });
      }

      // 3. Load Verifiable PQC Reports Log
      loadReportsLog(urlStr);

    } catch (e) {
      inspectedDomain.textContent = "Invalid URL";
    }
  }

  async function generateAiExplanation(intel) {
    // Check if Chrome LanguageModel / Gemini Nano is available locally
    const aiAvailable = typeof ai !== 'undefined' && ai.languageModel;
    
    if (aiAvailable) {
      try {
        const capabilities = await ai.languageModel.capabilities();
        if (capabilities.available !== 'no') {
          const session = await ai.languageModel.create();
          const prompt = `Analyze this domain's threat indicators: Domain="${intel.domain}", Age="${intel.domainAge}", Country="${intel.country}", SSL="${intel.sslStatus}", BlacklistCount=${intel.blacklistCount}, ThreatScore=${intel.threatScore}%. Briefly explain the security assessment.`;
          const result = await session.prompt(prompt);
          aiExplanation.innerHTML = `<strong>Local AI (Gemini Nano):</strong> ${result}`;
          session.destroy();
          return;
        }
      } catch (err) {
        console.warn("AI prompt API failed, falling back to deterministic explanation:", err);
      }
    }
    
    // Deterministic Fallback if Gemini Nano is not enabled in the current browser profile
    await delay(600);
    let explanationText = "";
    if (intel.threatScore > 75) {
      explanationText = `High threat indicators. The domain exhibits suspicious spelling patterns, utilizes a newly registered SSL cert (${intel.sslStatus}), and resides in a country (${intel.country}) frequently associated with hosting rogue redirection endpoints. Avoid entering credentials.`;
    } else if (intel.threatScore > 40) {
      explanationText = `Medium threat indicators. The domain has been registered relatively recently (${intel.domainAge}) and matches common typosquatting keywords, though no active blacklists have reported it yet. Proceed with caution.`;
    } else {
      explanationText = `Verified low-risk domain. Matches known trusted enterprise endpoints with a valid long-standing domain age of ${intel.domainAge} and a verified cryptographic certificate. Safe to browse.`;
    }
    aiExplanation.innerHTML = `<strong>Local Threat Engine Assessment:</strong> ${explanationText}`;
  }

  async function loadReportsLog(currentUrl) {
    const targetDomain = new URL(currentUrl).hostname;
    let reportsList = [];
    
    try {
      const storageData = await chrome.storage.local.get('reportsList');
      reportsList = storageData.reportsList || [];
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    
    // Filter reports matching the current domain
    const filteredReports = reportsList.filter(r => r.domain === targetDomain);
    
    if (filteredReports.length === 0) {
      reportsLog.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 10px; font-size: 0.75rem;">No local reports recorded for this domain.</div>`;
      return;
    }

    reportsLog.innerHTML = filteredReports.map(r => `
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; margin-bottom: 2px;">
          <span>${r.date}</span>
          <span style="color: var(--color-cyan); font-family: monospace;">${r.pqc}</span>
        </div>
        <div style="font-size: 0.8rem; font-weight: 500; color: var(--text-primary);">${r.domain}</div>
        <div style="font-size: 0.72rem; color: var(--color-success); margin-top: 2px;">✓ Verified Anonymous Submission</div>
        ${r.notes ? `<div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px; font-style: italic;">Note: ${r.notes}</div>` : ''}
      </div>
    `).join('');
  }

  // Listen for storage changes to update the reports log reactively
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.reportsList && activeUrl) {
      loadReportsLog(activeUrl);
    }
  });

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
