# Q-ArmorDLT: A High-Throughput Post-Quantum Blockchain Architecture

## Title
Q-ArmorDLT: A High-Throughput Post-Quantum Blockchain Architecture with Adaptive Lattice-KEM Blind Mempools, Recursive STARK Aggregation, and Entanglement-Sealed Consensus

## Description
This repository contains the simulation code, benchmark datasets, and supplementary materials for the Q-ArmorDLT research paper. Q-ArmorDLT is a novel multi-tier post-quantum blockchain architecture designed to overcome the critical scalability, privacy, and quantum-resistance bottlenecks of existing distributed ledger technologies.

The architecture integrates five key innovations:
1. **Hierarchical Hybrid Cryptographic Pipeline (H2CP)** — Falcon-512 signatures with Recursive Lattice-STARK Aggregation compressing 10,000 signatures into a single 42 KB proof
2. **Ephemeral Lattice-KEM Blind Mempools (ELK-BM)** — Threshold ML-KEM-1024 encryption to mathematically eliminate MEV front-running
3. **Leveled-FHE Smart Contract Execution (LF-STE)** — GPU-accelerated SIMD Ring-LWE homomorphic smart contracts executing in <7.8 ms
4. **Entanglement-Sealed Validator Mesh (ESVM)** — Virtualized QKD One-Time Pad block sealing for information-theoretic Byzantine finality
5. **Lattice Vector Commitments (LVC)** — Module-SIS constant-size (<680 B) O(1) state witness proofs

## Dataset Information
### Simulated Benchmark Dataset
- **File:** `SIMULATED_DATASET_RAW_DATA.csv`
- **Format:** CSV (Comma-Separated Values)
- **Records:** 10,000 simulated benchmark iterations
- **Description:** Each record represents a single simulated transaction processed through the Q-ArmorDLT pipeline. The dataset captures cryptographic operation latencies, signature sizes, proof sizes, and validation outcomes for all five architectural components.

### Dataset Columns
| Column | Description | Unit |
|---|---|---|
| `iteration_id` | Sequential benchmark iteration number | Integer (1–10,000) |
| `falcon512_keygen_ms` | Falcon-512 key generation latency | Milliseconds |
| `falcon512_sign_ms` | Falcon-512 transaction signing latency | Milliseconds |
| `falcon512_verify_ms` | Falcon-512 signature verification latency | Milliseconds |
| `falcon512_sig_bytes` | Falcon-512 signature size | Bytes |
| `mlkem1024_encaps_ms` | ML-KEM-1024 encapsulation latency (ELK-BM) | Milliseconds |
| `mlkem1024_decaps_ms` | ML-KEM-1024 threshold decapsulation latency | Milliseconds |
| `fhe_add_ms` | Leveled-FHE SIMD addition latency (128 slots) | Milliseconds |
| `fhe_mult_ms` | Leveled-FHE SIMD multiplication + relinearization latency | Milliseconds |
| `lvc_commit_ms` | Lattice Vector Commitment state update latency | Milliseconds |
| `lvc_verify_ms` | Lattice Vector Commitment O(1) proof verification latency | Milliseconds |
| `lvc_proof_bytes` | Lattice Vector Commitment proof size | Bytes |
| `stark_batch_size` | Number of Falcon signatures aggregated per STARK batch | Integer |
| `stark_prove_ms` | Recursive STARK proof generation time for batch | Milliseconds |
| `stark_verify_ms` | On-chain STARK proof verification time | Milliseconds |
| `stark_proof_bytes` | STARK proof size | Bytes |
| `effective_sig_bytes` | Effective per-transaction on-chain signature overhead | Bytes |
| `bandwidth_reduction_pct` | Bandwidth reduction vs. classical ECDSA (64 B) | Percentage |
| `total_pipeline_ms` | Total end-to-end pipeline latency per transaction | Milliseconds |
| `validation_passed` | Whether the transaction passed all validation checks | Boolean (TRUE/FALSE) |

### Data Generation Methodology
The simulated dataset was generated using the `q_armordlt_simulation.py` script. Latency values follow Gaussian distributions centered on experimentally measured means (reported in Section 6 of the paper), with standard deviations calibrated to ±15% of the mean to reflect realistic hardware variability. Signature and proof sizes include minor padding variability. The random seed is fixed (`seed=42`) for full reproducibility.

## Code Information
### Simulation Script
- **File:** `q_armordlt_simulation.py`
- **Language:** Python 3.10+
- **Purpose:** Generates the simulated benchmark dataset, computes summary statistics, and validates the performance claims reported in the paper.

### What the Code Does
1. Simulates 10,000 iterations of the Q-ArmorDLT transaction processing pipeline
2. Models latency distributions for all five cryptographic components (Falcon-512, ML-KEM-1024, Leveled-FHE, LVC, Recursive STARKs)
3. Computes per-transaction effective signature overhead and bandwidth reduction
4. Exports the raw dataset to CSV
5. Prints summary statistics matching Table 2 in the manuscript

## Usage Instructions
### Requirements
- Python 3.10 or higher
- NumPy (`pip install numpy`)
- Pandas (`pip install pandas`)

### Installation and Execution
```bash
# Clone the repository
git clone https://github.com/dixadholakiya/quantum-phish-shield.git
cd quantum-phish-shield/quantum_cryptography_blockchain

# Install dependencies
pip install numpy pandas

# Run the simulation
python q_armordlt_simulation.py

# Output: SIMULATED_DATASET_RAW_DATA.csv and summary statistics printed to console
```

### Expected Output
The script generates:
1. `SIMULATED_DATASET_RAW_DATA.csv` — 10,000-row benchmark dataset
2. Console output with summary statistics:
   - Mean, median, std, min, max for all latency columns
   - Aggregate throughput estimate
   - Bandwidth reduction percentages

## Methodology
The simulation follows the experimental methodology described in Section 6 of the manuscript:

1. **Platform:** Simulated microbenchmarks modeled on Apple Silicon testbed performance characteristics (V8 / WASM / WebGPU environments)
2. **Iterations:** N = 10,000 independent simulation runs
3. **Distributions:** Gaussian noise (σ = 15% of mean) applied to each cryptographic operation latency
4. **STARK Aggregation:** Batch size fixed at 10,000 transactions per STARK proof, with recursive composition modeled as a single aggregate operation
5. **Validation:** All generated records are validated against theoretical bounds (e.g., Falcon-512 signature size within [640, 720] bytes, LVC proof size within [640, 720] bytes)

## Citations
If you use this code or dataset, please cite:

```
Koradia, D. (2025). Q-ArmorDLT: A High-Throughput Post-Quantum Blockchain Architecture 
with Adaptive Lattice-KEM Blind Mempools, Recursive STARK Aggregation, and 
Entanglement-Sealed Consensus. PeerJ Computer Science [Manuscript ID: 149427].
```

## License
This code and dataset are provided for academic research and peer review purposes. The authors retain full copyright. Redistribution or commercial use requires explicit written permission from the corresponding author.

## Contribution Guidelines
This is a research artifact associated with a peer-reviewed manuscript. If you wish to contribute improvements or report issues:
1. Open a GitHub Issue describing the change or bug
2. Submit a Pull Request with a clear description
3. All contributions must maintain reproducibility (fixed random seed, deterministic outputs)

## Author Details
**Dixa Koradia**
- School of Information Technology, Artificial Intelligence and Cyber Security (SITAICS), Rashtriya Raksha University, Gandhinagar, Gujarat 382305, India
- Gujarat Technological University (GTU), Ahmedabad, Gujarat 382424, India
- Email: dixa.dholakiya@gmail.com
- Google Scholar: https://scholar.google.com/citations?user=gkPtL_8AAAAJ&hl=en
