import { ml_kem1024 } from '@noble/post-quantum/ml-kem.js';
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa.js';

globalThis.NoblePQC = {
  ml_kem1024,
  ml_dsa87
};
