# Quantum Phish Shield: Post-Quantum Phishing Reporter

**Quantum Phish Shield** is a Manifest V3 browser extension designed for privacy-preserving, anonymous, and verifiable phishing reporting. By employing simulated post-quantum cryptographic primitives (Kyber-1024 and Dilithium-5) and combining them with local AI threat analysis and real-time domain reputation metrics, users can audit websites and report threats completely anonymously.

---

## 1. System Working Architecture

The sequence of operations across extension components is mapped below:

```
 User Browser          content.js         background.js         popup / sidepanel         pqc.js
      │                    │                    │                    │                     │
      │──(Navigates URL)──>│                    │                    │                     │
      │                    │──(Extract Signals)─┼───────────────────>│                     │
      │                    │                    │                    │                     │
      │──(Opens Popup)─────┼────────────────────┼───────────────────>│                     │
      │                    │                    │──(Request Intel)──>│                     │
      │                    │                    │                    │──(Generate Keys)───>│
      │                    │                    │                    │<──(Kyber/Dilithium)─│
      │                    │                    │                    │                     │
      │                    │                    │                    │──(Encapsulate/Sign)>│
      │                    │                    │                    │<──(Encrypted Packet)│
      │                    │                    │<──(Transmit Report)│                     │
```

---

## 2. Core Security Primitives & Implementations

### 2.1 Post-Quantum Cryptography (`pqc.js`)
* **Kyber-1024 KEM**: Simulates learning-with-errors (LWE) ring operations. It takes the user's reporting payload and encapsulating metadata, encrypting it under a shared secret key generated via polynomial parameters.
* **Dilithium-5 Signatures**: Generates a public/private verification key pair and signs the encrypted payload. This allows threat repositories to verify that a report came from an authenticated, trusted user without revealing the user's identity.

### 2.2 Local Threat Intelligence & Signals (`background.js` & `content.js`)
* **Active DOM Parsing**: The content script audits pages for password input fields, total form counts, and external links pointing away from the base domain.
* **Reputation Engine**: The service worker checks domain characteristics (SSL authenticity, domain age, hosting registration country, and known blacklists) to compute an immediate threat score.

### 2.3 On-Device AI Explanations (`sidepanel.js`)
* Uses Chrome's native **LanguageModel API (Gemini Nano)** when available to interpret domain metrics locally. If unavailable, it leverages a deterministic fallback analysis engine.

---

## 3. Local Installation & Loading Instructions

1. Open Google Chrome and navigate to the extensions control page: **`chrome://extensions/`**
2. Toggle the **"Developer Mode"** switch in the top-right corner to **ON**.
3. Click the **"Load unpacked"** button in the top-left corner.
4. Select the project directory: `/Users/user/quantum-phish-shield/`.
5. The extension will initialize and pin itself to the Chrome toolbar.

---

## 4. Operational File Directory
* `manifest.json`: Configuration mappings and permission definitions.
* `pqc.js`: Kyber and Dilithium polynomial algebra algorithms.
* `background.js`: Service worker routing threat intelligence queries.
* `content.js`: Page DOM scraper script.
* `popup.html` / `popup.js`: Dropdown popup panel with PQC reporting controls.
* `sidepanel.html` / `sidepanel.js`: Secondary panel displaying AI explanations and active threat logs.
* `styles.css`: Glassmorphic styling system.
* `quantum_phish_shield_logo.png`: High-resolution vector logo design.
* `CHROMEWEBSTORE.md`: Compliance declarations for listing audits.
