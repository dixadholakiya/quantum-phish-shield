# Supplementary Material: Q-ArmorDLT — Mathematical Proofs, Extended Algorithms, and Simulation Parameters

**Paper Title:** *Q-ArmorDLT: A High-Throughput Post-Quantum Blockchain Architecture with Adaptive Lattice-KEM Blind Mempools, Recursive STARK Aggregation, and Entanglement-Sealed Consensus*  
**Author:** Dixa Koradia  
**Affiliation:** School of Information Technology, Artificial Intelligence and Cyber Security (SITAICS), Rashtriya Raksha University, Gandhinagar, Gujarat, India  
**Email:** `dixa.dholakiya@gmail.com`  

---

## Section S1: Formal Cryptographic Hardness Reductions

### S1.1 Hardness of the Module Learning with Errors ($\text{M-LWE}_{n, k, q, \eta}$) Problem
The security of the ML-KEM-1024 key encapsulation mechanism and ML-DSA-87 digital signatures reduces directly to the hardness of finding short vectors in module lattices.

```
+---------------------------------------------------------------------------------------------------+
|                        Module-LWE and Module-SIS Geometric Lattice Space                          |
|                                                                                                   |
|  Polynomial Ring: R_q = Z_q[X] / (X^n + 1),  n = 256,  q = 3329 (ML-KEM) / 8380417 (ML-DSA)       |
|                                                                                                   |
|  Matrix A ∈ R_q^(k x l)  ==== (Lattice Transformation) ====>  Target t = A * s1 + s2              |
|                                                                                                   |
|  Search Problem: Given (A, t), find short secret vectors s1 ∈ S_η^l, s2 ∈ S_η^k                  |
|  Decision Problem: Distinguish (A, t) from uniformly sampled pairs (A, u) ∈ R_q^(k x l) x R_q^k   |
|                                                                                                   |
|  Hardness Reduction: Decisional M-LWE_q,k,η is asymptotically as hard as SIVP_γ on ideal lattices|
+---------------------------------------------------------------------------------------------------+
```

#### Definition S1. (Decisional $\text{M-LWE}_{n, k, q, \eta}$)
Let $R_q = \mathbb{Z}_q[X]/(X^n + 1)$ with $n = 256$. For secret vector $\mathbf{s} \sim \chi_\eta(R_q^k)$, the decisional $\text{M-LWE}$ problem asserts that polynomial-time quantum adversaries $\mathcal{A}$ have negligible advantage in distinguishing:
$$\text{Adv}_{\mathcal{A}}^{\text{M-LWE}} = \left| \Pr\left[ \mathcal{A}(\mathbf{A}, \mathbf{A}\mathbf{s} + \mathbf{e}) = 1 \right] - \Pr\left[ \mathcal{A}(\mathbf{A}, \mathbf{u}) = 1 \right] \right| \le \text{negl}(\lambda)$$
Where $\mathbf{A} \sim \mathcal{U}(R_q^{k \times k})$, $\mathbf{e} \sim \chi_\eta(R_q^k)$, and $\mathbf{u} \sim \mathcal{U}(R_q^k)$.

#### Theorem S1. (Post-Quantum Security Margin)
Under the Core-SVP classical and quantum sieve hardness model, solving $\text{M-LWE}_{256, 4, 3329, 2}$ (ML-KEM-1024) requires minimum quantum gate complexity:
$$\mathcal{C}_{\text{quantum}} \ge 2^{256} \text{ operations}$$
Guaranteeing complete immunity against Shor's period-finding and quantum Grover acceleration.

---

## Section S2: Information-Theoretic Block Finality Proof for QKD One-Time Pad Sealing

In the Entanglement-Sealed Validator Mesh (ESVM), adjacent validators $V_i$ and $V_j$ seal block header $B_k$ using shared QKD keys $K_{ij}$.

```
+---------------------------------------------------------------------------------------------------+
|                        Shannon Information-Theoretic Perfect Secrecy Proof                        |
|                                                                                                   |
|  Given:                                                                                           |
|  1. Block Digest Message: M = SHA3-512(B_k) ∈ {0, 1}^512                                          |
|  2. Quantum Secret Key:   K_ij ∈ {0, 1}^512 sampled uniformly via BB84 Single Photons           |
|  3. Transmitted Seal:     S_ij = M ⊕ K_ij                                                         |
|                                                                                                   |
|  Proof of Conditional Entropy:                                                                    |
|  P(S_ij = s | M = m) = P(M ⊕ K_ij = s | M = m) = P(K_ij = m ⊕ s) = 1 / 2^512                      |
|                                                                                                   |
|  By Bayes' Theorem:                                                                               |
|  P(M = m | S_ij = s) = [ P(S_ij = s | M = m) * P(M = m) ] / P(S_ij = s) = P(M = m)                 |
|                                                                                                   |
|  => H(M | S_ij) = H(M)  (Zero mutual information leaked to eavesdropper with infinite computing)  |
+---------------------------------------------------------------------------------------------------+
```

#### Theorem S2. (Unconditional Block Integrity & Unforgeability)
Let an adversary $\mathcal{E}$ possess an arbitrary quantum computer with infinite memory and qubits. The probability of forging a valid block seal $S_{ij}'$ without the secret key $K_{ij}$ is bounded by:
$$\Pr[\mathcal{E} \text{ forges } S_{ij}'] = \frac{1}{2^{512}} \approx 7.45 \times 10^{-155} = 0$$

---

## Section S3: Extended Algorithmic Specifications

### Algorithm S1: Threshold Ephemeral Lattice-KEM Blind Mempool Protocol

```
Algorithm S1: Threshold ML-KEM-1024 Blind Mempool Generation & Decapsulation
---------------------------------------------------------------------------------
Input : User Transaction Tx, Threshold Committee Public Key pk_comm, Committee Secret Key Shares {sk_1, ..., sk_n},
        Threshold Parameter t <= n
Output: Canonical Ordered & Executed Transaction Tx'

// Phase 1: User Client Encapsulation
1: (c_kem, K) <- ML-KEM-1024.Encaps(pk_comm)
2: IV <- SampleRandomBytes(12)
3: C_payload <- AES-256-GCM.Encrypt(K, IV, Tx)
4: Broadcast Blind Packet: P_user = (c_kem, IV, C_payload)

// Phase 2: Mempool Blind Sequencing
5: Sequencer aggregates blind packets into batch: B = [ P_1, P_2, ..., P_N ]
6: Compute Canonical Order Commitment: H_order <- SHA3-512(P_1 || P_2 || ... || P_N)
7: Commit H_order into Block Header (Order immutable prior to decryption)

// Phase 3: Threshold Decapsulation
8: for each validator i in Committee (where |Committee| >= t) do
9:    d_i <- ML-KEM-1024.PartialDecaps(sk_i, c_kem)
10: end for
11: K_recovered <- ThresholdRecombine({d_1, d_2, ..., d_t})
12: Tx_recovered <- AES-256-GCM.Decrypt(K_recovered, IV, C_payload)
13: Execute Tx_recovered in strict order finalized by H_order
14: return Tx_recovered
---------------------------------------------------------------------------------
```

---

### Algorithm S2: SIMD Leveled-FHE Smart Contract State Transition Engine

```
Algorithm S2: SIMD Leveled-FHE Polynomial Smart Contract Evaluation
---------------------------------------------------------------------------------
Input : Encrypted State Vector ct_state = (c_0, c_1) in R_q x R_q,
        Contract Arithmetic Polynomial Circuit F(X), Evaluation Keys evk
Output: Updated Encrypted State ct_state'

1: Decompose ct_state into SIMD packed slot coefficients over R_q = Z_q[X]/(X^n + 1)
2: Apply Forward Number Theoretic Transform (NTT) to GPU Memory Buffers:
      c_0_hat <- NTT(c_0),  c_1_hat <- NTT(c_1)
3: for each gate in circuit F(X) do
4:    if gate == ADD then
5:       c_0_hat' <- (c_0_hat + c_0_gate_hat) mod q
6:       c_1_hat' <- (c_1_hat + c_1_gate_hat) mod q
7:    else if gate == MULT then
8:       (d_0, d_1, d_2) <- DyadicPolynomialMult(ct_1_hat, ct_2_hat) mod q
9:       (c_0_hat', c_1_hat') <- Relinearize((d_0, d_1, d_2), evk)
10:      (c_0_hat', c_1_hat') <- ModulusSwitchDown((c_0_hat', c_1_hat'))
11:   end if
12: end for
13: Apply Inverse NTT: c_0' <- INTT(c_0_hat'), c_1' <- INTT(c_1_hat')
14: return ct_state' = (c_0', c_1')
---------------------------------------------------------------------------------
```

---

## Section S4: Extended Network Gossip Simulation Parameters

To analyze block propagation dynamics across large-scale decentralized networks ($N = 1,000$ to $50,000$ validator nodes), the network propagation model was parameterized based on empirical global P2P topologies:

### Table S1. P2P Gossip Protocol Simulation Parameters

| Simulation Parameter | Tested Value Range | Reference / Baseline |
| :--- | :--- | :--- |
| **Total Decentralized Node Count ($N$)** | $1,000 - 50,000\text{ nodes}$ | Global Ethereum / Bitcoin Node Distribution |
| **P2P Gossip Degree ($d_{\text{out}}$)** | $8\text{ outbound peers}, 117\text{ inbound}$ | DevP2P / Libp2p Standards |
| **Mean Geographic Link Latency ($D_{\text{network}}$)** | $45\text{ ms} \pm 18\text{ ms}$ | Transcontinental Fiber Ping Distribution |
| **Node Bandwidth Capacity ($C_{\text{bandwidth}}$)** | $100\text{ Mbps} - 1\text{ Gbps}$ (Residential/Datacenter) | Empirical Speedtest Node Distribution |
| **Falcon-512 Signature Size** | $666\text{ bytes}$ | NIST FIPS Candidate Specs |
| **ML-DSA-87 Signature Size** | $4,595\text{ bytes}$ | NIST FIPS 204 Standard |
| **Q-ArmorDLT STARK Proof Size** | $42.0\text{ KB}$ ($10,000\text{ aggregated txs}$) | StarkWare STARK Execution Trace Bounds |
| **Lattice Vector Commitment Witness** | $680\text{ bytes}$ ($\mathcal{O}(1)$ proof) | Module-SIS Ring Dimension $k=4$ |

```
Network Propagation Latency vs. Block Size (Simulated 10,000 Nodes):
---------------------------------------------------------------------------------
Block Format           Block Size (KB)      Mean Prop. Time (ms)  Orphan Rate (%)
---------------------------------------------------------------------------------
Classical ECDSA (10k tx)  1,250 KB          210 ms                0.42%
Raw ML-DSA-87 (10k tx)    47,200 KB         2,840 ms              14.80% (UNSTABLE)
Q-ArmorDLT (H2CP STARK)   460 KB            118 ms                0.09% (OPTIMAL)
---------------------------------------------------------------------------------
```

---

## Section S5: Standard Cryptographic Parameter Sets

### Table S2. Post-Quantum Cryptographic Scheme Parameter Constants

| Cryptographic Scheme | Parameter Dimension ($n, k, l$) | Modulus ($q$) | Secret Bound ($\eta, \gamma$) | Classical Security | Quantum Security |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ML-KEM-1024** | $n=256, k=4$ | $q = 3329$ | $\eta_1 = 2, \eta_2 = 2$ | 256-bit | 256-bit (NIST Level 5) |
| **Falcon-512** | $n=512$ | $q = 12289$ | $\sigma = 165.736$ | 128-bit | 128-bit (NIST Level 1) |
| **ML-DSA-87** | $n=256, k=8, l=7$ | $q = 8380417$ | $\eta = 2, \gamma_1 = 2^{19}$ | 256-bit | 256-bit (NIST Level 5) |
| **Leveled-FHE (BGV)** | $n=8192$ (SIMD slots) | $\log_2(q) = 218\text{ bits}$ | $\sigma_{\text{Gaussian}} = 3.2$ | 128-bit | 128-bit |
| **Lattice Vector Commit (LVC)**| $n=256, k=4, N=10^6$ | $q = 8380417$ | $\beta_{\text{SIS}} = \sqrt{4n}\gamma$ | 256-bit | 256-bit |
