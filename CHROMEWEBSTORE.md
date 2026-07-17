# CHROMEWEBSTORE.md - Quantum Phish Shield Store Listing Details

**Extension Name**: Quantum Phish Shield  
**Subtitle**: Post-Quantum Privacy-Preserving Phishing Reporter  
**Detailed Description**:  
Quantum Phish Shield enables privacy-first, verified reporting of phishing websites using state-of-the-art Post-Quantum Cryptography (PQC) simulation. Protected by Kyber-1024 Key Encapsulation Mechanisms (KEM) and Dilithium-5 digital signature models, users can submit threat reports completely anonymously without exposing metadata or browser identities. 

The extension includes real-time domain threat intelligence auditing and on-device, private AI analysis explanations powered by Chrome's LanguageModel (Gemini Nano) API.

---

## 1. Store Permissions Justification

| Manifest Permission | Justification for Review Audit |
| :--- | :--- |
| `tabs` | Required to fetch the active tab URL hostname and title for security reputation lookup and comparison. |
| `activeTab` | Grants temporary script execution permission on the active user-selected page to scan DOM signals during click actions. |
| `scripting` | Permits runtime injection of content scripts to audit DOM nodes for password fields and external form links. |
| `storage` | Utilized to store locally verified report history and session-based transient threat intelligence lookups. |
| `sidePanel` | Provides the user with a detailed side-by-side dashboard outlining domain threat logs and AI explanations. |
| `contextMenus` | Creates context action "Verify Link for Phishing Threat" enabling users to audit hyperlinks before navigation. |
| `host_permissions: *://*/*` | Needed to dynamically check domain reputation scores against threat intelligence endpoints. |

---

## 2. Privacy Policy & Data Collection Disclosures

### Data Collection & Usage Declarations
* **Personal Data**: The extension does **NOT** collect or transmit any personally identifiable information (PII), browser history, or account credentials.
* **Encryption**: All generated phishing reports are encapsulated using simulated Kyber-1024 and signed using Dilithium-5 before transmission, rendering the client signature anonymous.
* **On-Device Processing**: AI threat explanations are generated locally on your machine using Chrome's native AI libraries. No data is sent to external cloud LLM servers.
