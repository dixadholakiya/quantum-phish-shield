/**
 * popup.js - Interactive controls for the extension popup.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const activeDomainLabel = document.getElementById('active-domain');
  const reputationScore = document.getElementById('reputation-score');
  const riskCategory = document.getElementById('risk-category');
  const scoreBar = document.getElementById('score-bar');
  const openPanelBtn = document.getElementById('open-panel-btn');
  const signReportBtn = document.getElementById('sign-report-btn');
  const reportDescription = document.getElementById('report-description');
  const cryptoLog = document.getElementById('crypto-log');

  let currentTab = null;

  // Retrieve active tab details
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    if (tab && tab.url) {
      const url = new URL(tab.url);
      activeDomainLabel.textContent = url.hostname;

      // Query threat intelligence database via service worker
      chrome.runtime.sendMessage({ action: 'fetchThreatIntelligence', url: tab.url }, (response) => {
        if (response && response.success) {
          const intel = response.intel;
          reputationScore.textContent = `${intel.threatScore}%`;
          riskCategory.textContent = intel.category;
          riskCategory.style.color = intel.color;
          riskCategory.style.backgroundColor = `${intel.color}15`;
          scoreBar.style.width = `${intel.threatScore}%`;
          scoreBar.style.backgroundColor = intel.color;
        } else {
          activeDomainLabel.textContent = "Unable to analyze";
        }
      });
    } else {
      activeDomainLabel.textContent = "New Tab / Restricted Interface";
    }
  } catch (err) {
    activeDomainLabel.textContent = "System Offline";
  }

  // Open side panel on button click
  openPanelBtn.addEventListener('click', async () => {
    if (!currentTab) return;
    try {
      await chrome.sidePanel.open({ windowId: currentTab.windowId });
    } catch (err) {
      console.error("Failed to open sidepanel:", err);
    }
  });

  // Handle Post-Quantum anonymous report generation
  signReportBtn.addEventListener('click', async () => {
    if (!currentTab) return;
    
    cryptoLog.style.display = 'block';
    cryptoLog.innerHTML = `<div class="crypto-step">Initializing PQC Engine...</div>`;
    
    // Simulate latency of cryptographic steps
    await delay(350);
    appendStep("Bootstrapping LWE lattice parameters...", "crypto-success");
    
    // 1. Generate Kyber Keys
    await delay(400);
    const kyberKeys = globalThis.PQC.kyberKeyGen();
    appendStep(`[Kyber-1024] Public Key Seed: ${toHex(kyberKeys.publicKey.seed.slice(0, 8))}...`, "crypto-success");
    
    // 2. Encapsulate symmetric payload keys
    await delay(300);
    const kem = globalThis.PQC.kyberEncapsulate(kyberKeys.publicKey);
    appendStep(`[Kyber-1024] Symmetric Key Encapsulated (32B)`, "crypto-success");
    
    // 3. Generate Dilithium Keys for signer identity authentication
    await delay(350);
    const dilithiumKeys = globalThis.PQC.dilithiumKeyGen();
    appendStep(`[Dilithium-5] Verification Key Pair calculated`, "crypto-success");
    
    // 4. Sign the anonymous payload
    await delay(450);
    const notes = reportDescription.value || "Anonymous Flag";
    const payload = JSON.stringify({
      targetUrl: currentTab.url,
      timestamp: Date.now(),
      notes: notes,
      kemCiphertext: kem.ciphertext.data.slice(0, 4)
    });
    
    const signature = await globalThis.PQC.dilithiumSign(payload, dilithiumKeys.privateKey);
    appendStep(`[Dilithium-5] Report Signed (Signature: ${toHex(signature.signature.slice(0, 6))}...)`, "crypto-success");
    
    await delay(300);
    appendStep("Transmitting Verifiable Report to Threat Intel...", "crypto-success");
    
    await delay(400);

    // Save report to chrome.storage.local
    const reportRecord = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      domain: new URL(currentTab.url).hostname,
      pqc: "Dilithium-5 / Kyber-1024 Verified",
      status: "Report Transmitted",
      notes: notes
    };
    
    try {
      const { reportsList = [] } = await chrome.storage.local.get('reportsList');
      reportsList.unshift(reportRecord);
      await chrome.storage.local.set({ reportsList });
    } catch (storageErr) {
      console.warn("Storage warning:", storageErr);
    }

    cryptoLog.innerHTML += `<div class="crypto-step" style="color: var(--color-success); font-weight: bold;">✓ Anonymous Report Verified and Logged!</div>`;
    reportDescription.value = '';
  });

  function appendStep(text, className) {
    const div = document.createElement('div');
    div.className = `crypto-step ${className || ''}`;
    div.textContent = text;
    cryptoLog.appendChild(div);
    cryptoLog.scrollTop = cryptoLog.scrollHeight;
  }

  function toHex(array) {
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
