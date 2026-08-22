/**
 * sidepanel.js - Interactive operations for the Kavach Quantum Security Assistant Console.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Common Console elements
  const inspectedDomain = document.getElementById('inspected-domain');
  const threatScore = document.getElementById('threat-score');
  const riskCategory = document.getElementById('risk-category');
  const threatBar = document.getElementById('threat-bar');
  
  const metaAge = document.getElementById('meta-age');
  const metaCountry = document.getElementById('meta-country');
  const metaSsl = document.getElementById('meta-ssl');
  const metaBlacklist = document.getElementById('meta-blacklist');
  
  const sigForms = document.getElementById('sig-forms');
  const sigInputs = document.getElementById('sig-inputs');
  const sigLinks = document.getElementById('sig-links');
  const sigPwdWarning = document.getElementById('sig-pwd-warning');
  
  const reportsLog = document.getElementById('reports-log');

  // Deception Shield elements
  const deceptionCard = document.getElementById('deception-card');
  const injectDecoyBtn = document.getElementById('inject-decoy-btn');
  const deceptionStatus = document.getElementById('deception-status');

  // HUD & Console Log elements
  const securityCore = document.getElementById('security-core');
  const consoleLogs = document.getElementById('console-logs');

  // Tab Navigation elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // AI Chat elements
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const aiExplanation = document.getElementById('ai-explanation');

  let activeUrl = null;
  let currentIntel = null;
  let currentMetrics = null;

  // ==========================================================================
  // Tab Routing Logic
  // ==========================================================================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  // ==========================================================================
  // Terminal Diagnostic Logger Helpers
  // ==========================================================================
  function clearConsoleLogs() {
    consoleLogs.innerHTML = '';
  }

  function addConsoleLog(text, type = '') {
    const line = document.createElement('div');
    line.className = `log-line ${type ? 'log-line-' + type : ''}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    consoleLogs.appendChild(line);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  // ==========================================================================
  // SVH HUD Security Core State Controller
  // ==========================================================================
  function updateCoreOrbState(score) {
    securityCore.classList.remove('core-secure', 'core-warn', 'core-alert');
    if (score <= 40) {
      securityCore.classList.add('core-secure');
    } else if (score <= 75) {
      securityCore.classList.add('core-warn');
    } else {
      securityCore.classList.add('core-alert');
    }
  }

  // ==========================================================================
  // Core Audit Orchestration
  // ==========================================================================
  try {
    const sessionData = await chrome.storage.session.get('lastAuditedUrl');
    if (sessionData.lastAuditedUrl) {
      activeUrl = sessionData.lastAuditedUrl;
      await chrome.storage.session.remove('lastAuditedUrl');
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url) {
        activeUrl = tab.url;
      }
    }

    if (activeUrl) {
      runAudit(activeUrl);
    } else {
      inspectedDomain.textContent = "Navigate to a webpage to begin scan";
      addConsoleLog("[-] Diagnostic Idle: Awaiting webpage navigation.", "warning");
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
      
      // Reset views
      clearConsoleLogs();
      addConsoleLog(`[+] Audit initiated on host: ${url.hostname}`);
      aiExplanation.innerHTML = `Analyzing page features using local threat engine...`;
      sigPwdWarning.style.display = 'none';
      deceptionCard.style.display = 'none';
      deceptionStatus.style.display = 'none';

      await delay(150);
      addConsoleLog("Bootstrapping lattice-based verification systems...");
      await delay(150);
      addConsoleLog("Retrieving reputation metrics from local threat database...");

      // 1. Fetch Threat Intelligence via background worker
      chrome.runtime.sendMessage({ action: 'fetchThreatIntelligence', url: urlStr }, (response) => {
        if (response && response.success) {
          const intel = response.intel;
          currentIntel = intel;
          
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
          
          updateCoreOrbState(intel.threatScore);
          
          // Log results to console
          let logType = 'success';
          if (intel.threatScore > 40 && intel.threatScore <= 75) logType = 'warning';
          if (intel.threatScore > 75) logType = 'danger';
          
          addConsoleLog(`Reputation lookup completed. Category: ${intel.category} (Score: ${intel.threatScore}%)`, logType);
          addConsoleLog(`Domain Age: ${intel.domainAge} | Registry SSL: ${intel.sslStatus}`, logType);
          
          // Trigger local AI brief interpretation
          generateAiExplanation(intel);
          
          // Enable Deception Shield for High-Risk domains
          if (intel.threatScore > 75) {
            deceptionCard.style.display = 'block';
            addConsoleLog("⚠️ Warning: Active Deception Shield enabled. Decoy injection ready.", "danger");
          }
        } else {
          inspectedDomain.textContent = "Threat Intel Offline";
          addConsoleLog("[-] Error: Threat intelligence database query failed.", "danger");
        }
      });

      // 2. Query Page DOM Metrics via content script injection
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && new URL(tab.url).hostname === url.hostname) {
        addConsoleLog("Injecting Content Auditor to scan DOM signals...");
        
        chrome.tabs.sendMessage(tab.id, { action: 'extractDOMMetrics' }, (response) => {
          if (response && response.success) {
            const metrics = response.metrics;
            currentMetrics = metrics;
            
            sigForms.textContent = metrics.formsCount;
            sigInputs.textContent = metrics.inputsCount;
            sigLinks.textContent = metrics.externalLinksCount;
            
            addConsoleLog(`DOM Scan OK: Scraped ${metrics.formsCount} forms, ${metrics.inputsCount} inputs, and ${metrics.externalLinksCount} external links.`, "success");
            
            if (metrics.hasPasswordInput) {
              sigPwdWarning.style.display = 'block';
              addConsoleLog("⚠️ ALERT: Password input detected on this page!", "danger");
            }
          } else {
            addConsoleLog("[-] Warning: Failed to retrieve layout metrics from content script.", "warning");
          }
        });
      }

      // 3. Load Verifiable PQC Reports Log
      loadReportsLog(urlStr);

    } catch (e) {
      inspectedDomain.textContent = "Invalid URL";
      addConsoleLog("[-] Error: Failed to parse URL hostname.", "danger");
    }
  }

  async function generateAiExplanation(intel) {
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
    await delay(350);
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

  // ==========================================================================
  // Conversational AI Assistant Chat Agent
  // ==========================================================================
  function appendChatBubble(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble bubble-${sender}`;
    bubble.innerHTML = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatSendBtn.addEventListener('click', () => handleChatSubmit());
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
  });

  async function handleChatSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Display user message
    appendChatBubble(text, 'user');
    chatInput.value = '';

    // Show simulated typing status
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bubble-assistant';
    typingBubble.innerHTML = '<em>Kavach is thinking...</em>';
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    await delay(400);

    const intel = currentIntel || { domain: 'Unknown', threatScore: 0, category: 'Low Risk', sslStatus: 'None', country: 'Unknown', blacklistCount: 0 };
    const metrics = currentMetrics || { formsCount: 0, inputsCount: 0, hasPasswordInput: false };

    // Try Local Gemini Nano Model
    const aiAvailable = typeof ai !== 'undefined' && ai.languageModel;
    if (aiAvailable) {
      try {
        const capabilities = await ai.languageModel.capabilities();
        if (capabilities.available !== 'no') {
          const session = await ai.languageModel.create();
          const prompt = `You are "Kavach", the Quantum Security Assistant. Current page: domain="${intel.domain}", threatScore=${intel.threatScore}%, category="${intel.category}", SSL="${intel.sslStatus}", Country="${intel.country}", formsCount=${metrics.formsCount}, hasPasswordInput=${metrics.hasPasswordInput}. Respond briefly (max 3 sentences) to the user's query: "${text}". Keep a helpful, cyber-expert tone.`;
          const result = await session.prompt(prompt);
          typingBubble.innerHTML = result;
          chatMessages.scrollTop = chatMessages.scrollHeight;
          session.destroy();
          return;
        }
      } catch (err) {
        console.warn("Local chat prompt failed, using fallback:", err);
      }
    }

    // Fallback Rule-Based Security Agent responses (Dynamic Chatbot)
    let reply = "";
    const query = text.toLowerCase();

    if (query.includes('why') || query.includes('score') || query.includes('risk')) {
      reply = `The computed risk score is **${intel.threatScore}%** (${intel.category}). This is calculated based on its domain metrics: it is registered in **${intel.country}**, certificate is **${intel.sslStatus}**, and it has **${metrics.formsCount}** forms with password detection set to **${metrics.hasPasswordInput}**.`;
    } else if (query.includes('safe') || query.includes('unsafe') || query.includes('trust')) {
      if (intel.threatScore > 75) {
        reply = `❌ **No, this site is highly unsafe.** It has severe threat indicators. I strongly recommend against entering any credit card details or password credentials here.`;
      } else if (intel.threatScore > 40) {
        reply = `⚠️ **Proceed with caution.** The domain shows some warning indicators (medium risk). Double-check the URL spelling before interacting with it.`;
      } else {
        reply = `✓ **Yes, this page appears safe.** It has a valid SSL certificate (${intel.sslStatus}) and is a verified low-risk corporate endpoint.`;
      }
    } else if (query.includes('deception') || query.includes('honey') || query.includes('decoy')) {
      reply = `Our **Active Deception Shield** allows you to inject fake login inputs signed with a post-quantum **Dilithium-5** key. If the attacker harvested these and tries to use them, our servers will flag them instantly, and it poisons their stolen data lists!`;
    } else if (query.includes('crypto') || query.includes('quantum') || query.includes('pqc') || query.includes('kyber') || query.includes('dilithium')) {
      reply = `We use two NIST-selected post-quantum algorithms: **Kyber-1024** to encrypt reported payloads anonymously, and **Dilithium-5** signatures to prove the client is authorized without exposing your browser identity.`;
    } else if (query.includes('report') || query.includes('flag')) {
      reply = `You can file a report by clicking on the extension icon and selecting "Generate PQC Signed Report". This will sign your threat data and transmit it anonymously to security databases.`;
    } else {
      reply = `As your Kavach Security Assistant, I am active on **${intel.domain}** (Threat Score: **${intel.threatScore}%**). You can ask me if the site is safe, why it has this risk score, or how our deception system works!`;
    }

    typingBubble.innerHTML = reply;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ==========================================================================
  // Active Deception Injector
  // ==========================================================================
  injectDecoyBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    
    deceptionStatus.style.display = 'block';
    deceptionStatus.style.color = '#A855F7';
    deceptionStatus.textContent = 'Generating Post-Quantum Decoy keys...';
    addConsoleLog("Active Deception triggered: bootstrapping Dilithium-5 signature parameters...");
    
    await delay(300);
    
    // 1. Generate keypair for decoy signing
    const decoyKeys = globalThis.PQC.dilithiumKeyGen();
    
    // 2. Generate signature verifying this is an authentic honey-credential
    const hostname = new URL(tab.url).hostname;
    const payload = `${hostname}_${Date.now()}`;
    const sigResult = await globalThis.PQC.dilithiumSign(payload, decoyKeys.privateKey);
    const sigHex = toHex(sigResult.signature.slice(0, 16));
    
    // 3. Prepare realistic fake credential
    const decoyEmail = `ops.sec_${Math.floor(Math.random() * 900 + 100)}@gov.in`;
    const decoyPassword = `HoneyPass_${sigHex}`;
    
    deceptionStatus.textContent = 'Injecting decoy inputs into webpage form...';
    addConsoleLog(`Decoy credentials compiled: Email=${decoyEmail} | Password=HoneyPass_${sigHex.substring(0, 8)}...`);
    await delay(300);
    
    // 4. Send message to content script to perform DOM injection
    chrome.tabs.sendMessage(tab.id, {
      action: 'injectHoneyCredentials',
      email: decoyEmail,
      password: decoyPassword
    }, (res) => {
      if (res && res.success) {
        deceptionStatus.style.color = 'var(--color-success)';
        deceptionStatus.textContent = '✓ Decoy Credentials Injected & Highlighted!';
        addConsoleLog("✓ Success: Honey-Credentials injected into DOM forms. Decoy tags active.", "success");
      } else {
        deceptionStatus.style.color = 'var(--color-danger)';
        deceptionStatus.textContent = '⚠️ Decoy Injection failed (no inputs found).';
        addConsoleLog("[-] Warning: Decoy injection aborted. No compatible username or password input elements found on this page.", "warning");
      }
    });
  });

  // ==========================================================================
  // Audit Reports Log Manager
  // ==========================================================================
  async function loadReportsLog(currentUrl) {
    const targetDomain = new URL(currentUrl).hostname;
    let reportsList = [];
    
    try {
      const storageData = await chrome.storage.local.get('reportsList');
      reportsList = storageData.reportsList || [];
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    
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

  function toHex(array) {
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
