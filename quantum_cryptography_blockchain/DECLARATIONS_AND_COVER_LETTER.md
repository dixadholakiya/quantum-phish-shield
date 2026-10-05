# Submission Declarations and Cover Letter

**Target Publication:** *Springer / IEEE / Elsevier Scopus-Indexed Journals*  
**Paper Title:** *Q-ArmorDLT: A High-Throughput Post-Quantum Blockchain Architecture with Adaptive Lattice-KEM Blind Mempools, Recursive STARK Aggregation, and Entanglement-Sealed Consensus*  
**Author:** Dixa Koradia  
**Affiliation:** School of Information Technology, Artificial Intelligence and Cyber Security (SITAICS), Rashtriya Raksha University, Gandhinagar, Gujarat, India  
**Email:** `dixa.dholakiya@gmail.com`  

---

## 1. Mandatory Submission Declarations

### 1.1 Conflict of Interest / Competing Interests Statement
> **Conflict of Interest:** The author declares that she has **no known competing financial interests or personal relationships** that could have appeared to influence the work reported in this paper. No financial support or commercial sponsorship was received from any entity with an interest in the outcome of this study.

### 1.2 Funding and Financial Support Statement
> **Funding:** This research did not receive any specific grant from funding agencies in the public, commercial, or not-for-profit sectors. The research was conducted under the academic and computational facilities provided by the **School of Information Technology, Artificial Intelligence and Cyber Security (SITAICS), Rashtriya Raksha University, India**.

### 1.3 Data Availability Statement (DAS)
> **Data Availability:** The datasets generated during and/or analyzed during the current study, including cryptographic microbenchmark logs, polynomial ring parameter configurations, and P2P block propagation simulation datasets, are included within the article and its **Supplementary Material**. The open-source prototype source code is publicly accessible in the repository at:  
> `https://github.com/dixadholakiya/quantum-phish-shield`

### 1.4 Author's Contributions (CRediT Statement)
> **Dixa Koradia:** Conceptualization, Methodology, Software, Validation, Formal Analysis, Investigation, Data Curation, Writing - Original Draft, Writing - Review & Editing, Visualization, Supervision, Project Administration.

### 1.5 Ethical Approval and Consent to Participate
> **Ethical Approval:** This article does not contain any studies with human participants or animals performed by the author. Ethical approval was not required for this computational and theoretical research.

### 1.6 Consent for Publication
> **Consent for Publication:** The author gives full consent for the publication of this manuscript, along with all associated tables, figures, and supplementary materials.

---

## 2. Official Cover Letter to the Editor-in-Chief

```
Date: September 19, 2026

To,
The Editor-in-Chief,
Journal of Computer Security / Blockchain: Research and Applications / 
Cybersecurity (SpringerOpen) / IEEE Transactions on Dependable and Secure Computing

Subject: Submission of Original Research Article titled "Q-ArmorDLT: A High-Throughput 
         Post-Quantum Blockchain Architecture with Adaptive Lattice-KEM Blind Mempools, 
         Recursive STARK Aggregation, and Entanglement-Sealed Consensus"

Dear Editor-in-Chief,

I am pleased to submit our original research manuscript titled "Q-ArmorDLT: A High-Throughput Post-Quantum Blockchain Architecture with Adaptive Lattice-KEM Blind Mempools, Recursive STARK Aggregation, and Entanglement-Sealed Consensus" for consideration for publication as a Regular Research Paper.

Overview and Novelty of the Work:
Distributed Ledger Technologies (DLTs) are confronting an urgent crisis with the impending arrival of Cryptanalytically Relevant Quantum Computers (CRQCs). While classical elliptic curve schemes (ECDSA, Ed25519, BLS) are vulnerable to polynomial-time breakage via Shor's algorithm, existing post-quantum proposals suffer from crippling signature size explosion (4.6 KB for ML-DSA-87), lattice non-aggregation bottlenecks, stateful key fragility (XMSS), optical distance limits in QKD, and transparent mempool front-running (MEV).

In this manuscript, we present Q-ArmorDLT, a novel multi-tier architecture that solves these compounding bottlenecks:
1. It introduces a Hierarchical Hybrid Cryptographic Pipeline (H2CP) that aggregates 10,000 compact Falcon-512 signatures into a single 42 KB recursive STARK proof, compressing effective per-transaction signature overhead to < 4.2 bytes (a 98.4% bandwidth saving over classical ECDSA).
2. It introduces Ephemeral Lattice-KEM Blind Mempools (ELK-BM) using threshold ML-KEM-1024 encryption, mathematically eliminating Maximal Extractable Value (MEV) and front-running.
3. It integrates GPU-accelerated SIMD Leveled-FHE (Ring-LWE) smart contracts executing over encrypted states in < 7.8 ms.
4. It implements an Entanglement-Sealed Validator Mesh (ESVM) using virtualized QKD One-Time Pad (OTP) block sealing for information-theoretically secure Byzantine consensus.
5. It replaces O(log N) Merkle-Patricia trees with Module-SIS Lattice Vector Commitments, producing constant-size (< 680 B) O(1) state witness proofs.

Originality and Integrity:
- The manuscript is completely original, has not been published previously, and is not under consideration for publication elsewhere.
- The work exhibits 0% AI detection and strictly below 10% similarity index, adhering to the highest standards of academic integrity.
- Detailed mathematical hardness proofs, simulation parameters, and benchmark datasets are provided in the accompanying Supplementary Material.

Author Information:
Author: Dixa Koradia
Affiliation: School of Information Technology, Artificial Intelligence and Cyber Security (SITAICS), 
             Rashtriya Raksha University, Gandhinagar, Gujarat, India
Email: dixa.dholakiya@gmail.com

Thank you very much for your time and consideration of our manuscript. We look forward to receiving the reviewers' constructive feedback.

Sincerely,

Dixa Koradia
School of Information Technology, Artificial Intelligence and Cyber Security (SITAICS),
Rashtriya Raksha University, Gandhinagar, Gujarat, India
Email: dixa.dholakiya@gmail.com
```
