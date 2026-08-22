/**
 * pqc.test.js - Unit tests for Simulated Post-Quantum Cryptographic Algorithms
 */

const PQC = require('./pqc');

describe('Simulated Post-Quantum Cryptography (PQC) Suite', () => {

  describe('Helper Functions', () => {
    test('Polynomial multiplication with modulus', () => {
      // Test basic multiplication with simulated ring structure
      const polyA = [1, 2, 3];
      const polyB = [4, 5, 6];
      const mod = 17;
      
      const result = PQC._polynomialMultiply(polyA, polyB, mod);
      
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(3); // Result size matches max size
      // Coefficients should be within [0, mod-1]
      result.forEach(coeff => {
        expect(coeff).toBeGreaterThanOrEqual(0);
        expect(coeff).toBeLessThan(mod);
      });
    });
  });

  describe('Kyber-1024 Key Encapsulation Mechanism (KEM)', () => {
    let keys;

    beforeEach(() => {
      keys = PQC.kyberKeyGen();
    });

    test('Key Generation creates valid public and private keys', () => {
      expect(keys).toHaveProperty('publicKey');
      expect(keys).toHaveProperty('privateKey');
      
      expect(keys.publicKey).toHaveProperty('seed');
      expect(keys.publicKey).toHaveProperty('matrix');
      expect(keys.publicKey.algorithm).toBe('Kyber-1024');

      expect(keys.privateKey).toHaveProperty('seed');
      expect(keys.privateKey).toHaveProperty('matrix');
      expect(keys.privateKey.algorithm).toBe('Kyber-1024');
      
      expect(keys.publicKey.seed.length).toBe(16);
      expect(keys.privateKey.seed.length).toBe(16);
      expect(keys.publicKey.matrix.length).toBe(16);
      expect(keys.privateKey.matrix.length).toBe(16);
    });

    test('Encapsulation generates a 32-byte shared secret and ciphertext', () => {
      const kem = PQC.kyberEncapsulate(keys.publicKey);
      
      expect(kem).toHaveProperty('sharedSecret');
      expect(kem).toHaveProperty('ciphertext');
      
      expect(kem.sharedSecret.length).toBe(32);
      expect(kem.ciphertext.algorithm).toBe('Kyber-1024');
      expect(kem.ciphertext.data.length).toBe(16);
    });
  });

  describe('Dilithium-5 Digital Signature Scheme', () => {
    let keys;
    const testMessage = 'Quantum Phish Shield Anonymous Threat Report Payload';

    beforeEach(() => {
      keys = PQC.dilithiumKeyGen();
    });

    test('Key Generation creates valid verification and signing keys', () => {
      expect(keys).toHaveProperty('publicKey');
      expect(keys).toHaveProperty('privateKey');
      
      expect(keys.publicKey).toHaveProperty('t');
      expect(keys.publicKey.algorithm).toBe('Dilithium-5');

      expect(keys.privateKey).toHaveProperty('s1');
      expect(keys.privateKey).toHaveProperty('s2');
      expect(keys.privateKey.algorithm).toBe('Dilithium-5');

      expect(keys.publicKey.t.length).toBe(16);
      expect(keys.privateKey.s1.length).toBe(16);
      expect(keys.privateKey.s2.length).toBe(16);
    });

    test('Signature generation and verification succeeds on valid message', async () => {
      const signatureResult = await PQC.dilithiumSign(testMessage, keys.privateKey);
      
      expect(signatureResult).toHaveProperty('signature');
      expect(signatureResult).toHaveProperty('hash');
      expect(signatureResult.algorithm).toBe('Dilithium-5');
      expect(signatureResult.signature.length).toBe(16);

      const isValid = await PQC.dilithiumVerify(testMessage, signatureResult, keys.publicKey);
      expect(isValid).toBe(true);
    });

    test('Signature verification fails when message is tampered with', async () => {
      const signatureResult = await PQC.dilithiumSign(testMessage, keys.privateKey);
      
      const tamperedMessage = testMessage + ' [modified]';
      const isValid = await PQC.dilithiumVerify(tamperedMessage, signatureResult, keys.publicKey);
      
      expect(isValid).toBe(false);
    });
  });
});
