# Executive Summary: Quantum Phish Shield
### *A Non-Technical Guide to Quantum-Safe, Privacy-Preserving Threat Protection*

Welcome to **Quantum Phish Shield**! This guide explains what this browser extension is, why it is unique, and how it protects people in real-world scenarios—written in plain, everyday language.

---

## 1. The Core Problem We Are Solving

When you visit websites, cybercriminals often try to trick you using **phishing pages**—fake websites that look exactly like your bank, email, or company login page to steal your passwords.

If you use traditional security tools to report these fake sites:
1. **You lose your privacy**: The report sends your details (like your IP address, browser type, and location) to a central database. Hackers monitoring the network can see *who* reported them.
2. **Future Quantum Threats**: Right now, governments and hackers are capturing encrypted internet data and storing it. When powerful **quantum computers** are built in the future, they will decrypt this stored data retrospectively. This is called a **"Store Now, Decrypt Later"** threat.

---

## 2. Our "Novelty": Why Quantum Phish Shield is Different

Quantum Phish Shield introduces three main layers of protection that make it unique in the security industry:

### 🛡️ Layer 1: Post-Quantum Armor
We use next-generation mathematics approved by the U.S. National Institute of Standards and Technology (NIST)—specifically **Kyber-1024** and **Dilithium-5**. This math is designed to be completely secure even against future supercomputers and quantum computers. Any report you file today is safe forever.

### 🎭 Layer 2: Verified Anonymity
Traditionally, to block spam, systems require you to sign in to report a threat. QPS solves this paradox:
* It proves to the database that you are an **authorized, trusted reporter** (using secure signatures).
* But it **hides your identity**, so no one—not even the database owner—knows *which* specific person sent the report.

### 🧠 Layer 3: On-Device AI Guard
Instead of sending the contents of the page you are viewing to a cloud server to analyze it (which could leak private information), the extension uses an AI model (**Gemini Nano**) running **directly on your computer**. It audits pages locally and explains risks privately.

### 🕸️ Layer 4: Active Cyber Deception (Honey-Credentials)
Instead of just passively warning you to leave a high-risk phishing page, QPS lets you actively fight back. With a single click, it generates a high-value fake email (e.g. `ops.sec@gov.in`) and a password cryptographically signed with your post-quantum key. It automatically injects these into the phishing login forms, poisoning the attacker's harvested database and turning their stolen credentials list into a trap.

---

## 3. Real-World Scenario Use Cases

Here are three scenarios showing how Quantum Phish Shield protects different users:

### Scenario A: The Diplomat / High-Value Target (Targeted Attacks)
* **The Situation**: A government diplomat receives a highly targeted SMS text message claiming their office account has been locked, containing a link to a fake login page.
* **The Risk**: If they open it and report it using a standard browser tool, state-sponsored hackers monitoring the database will see that a diplomat at a specific embassy flagged their link, alerting the hackers that they were detected.
* **The QPS Solution**: The diplomat opens the page. The extension flags it as a threat. The diplomat submits an anonymous report. The threat registry receives a verified report, but the hackers cannot track it back to the diplomat or the embassy.

### Scenario B: The Power Grid Operator (Critical Infrastructure Deception)
* **The Situation**: An operator at a power station is browsing internal monitoring dashboards and external technical forums, and clicks a phishing link that opens a fake utility portal.
* **The Risk**: Entering credentials would compromise the utility network, but simply closing the tab leaves the attacker's infrastructure active and unmonitored.
* **The QPS Solution**: The operator's extension instantly turns red (**`RISK`**). Instead of just closing the tab, the operator clicks **"Inject Honey-Credentials"**. QPS injects decoy credentials with a hidden post-quantum signed signature. When the attacker harvests these and tries to use them on the real utility network later, the internal security servers immediately detect the decoy signature, automatically blacklist the attacker's connection, alert the security operations center, and trace their source.

### Scenario C: The Anti-Phishing Registry Administrator
* **The Situation**: An administrator manages a national database of blacklisted phishing domains.
* **The Risk**: Cybercriminals try to flood the registry with millions of fake reports to overwhelm the system, or to report legitimate government websites as "phishing" to get them blocked (sabotage).
* **The QPS Solution**: The registry only accepts reports signed with the extension's **Dilithium-5** digital signatures. Fake reports from automated bots are immediately blocked, while legitimate, anonymous reports from verified users are logged instantly.
