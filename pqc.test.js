/**
 * pqc.test.js - Unit tests for Production Crystals-Kyber (ML-KEM-1024)
 * and Crystals-Dilithium (ML-DSA-87) Cryptographic Implementations.
 */

const PQC = require('./pqc');

describe('Production Crystals Post-Quantum Cryptography (PQC) Suite', () => {

  describe('Kyber-1024 (ML-KEM-1024) Key Encapsulation Mechanism', () => {
    let keys;

    beforeEach(() => {
      keys = PQC.kyberKeyGen();
    });

    test('Key Generation creates valid FIPS-203 public and private keys', () => {
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

      // Verify FIPS-203 standardized byte sizes for ML-KEM-1024
      expect(keys.publicKey.matrix).toBeInstanceOf(Uint8Array);
      expect(keys.publicKey.matrix.length).toBe(1568);
      
      expect(keys.privateKey.matrix).toBeInstanceOf(Uint8Array);
      expect(keys.privateKey.matrix.length).toBe(3168);
    });

    test('Encapsulation generates a 32-byte shared secret and standard ciphertext', () => {
      const kem = PQC.kyberEncapsulate(keys.publicKey);
      
      expect(kem).toHaveProperty('sharedSecret');
      expect(kem).toHaveProperty('ciphertext');
      
      expect(kem.sharedSecret).toBeInstanceOf(Uint8Array);
      expect(kem.sharedSecret.length).toBe(32);
      
      expect(kem.ciphertext.algorithm).toBe('Kyber-1024');
      expect(kem.ciphertext.data).toBeInstanceOf(Uint8Array);
      expect(kem.ciphertext.data.length).toBe(1568);
    });
  });

  describe('Dilithium-5 (ML-DSA-87) Digital Signature Scheme', () => {
    let keys;
    const testMessage = 'Quantum Phish Shield Anonymous Threat Report Payload';

    beforeEach(() => {
      keys = PQC.dilithiumKeyGen();
    });

    test('Key Generation creates valid FIPS-204 verification and signing keys', () => {
      expect(keys).toHaveProperty('publicKey');
      expect(keys).toHaveProperty('privateKey');
      
      expect(keys.publicKey).toHaveProperty('t');
      expect(keys.publicKey.algorithm).toBe('Dilithium-5');

      expect(keys.privateKey).toHaveProperty('s1');
      expect(keys.privateKey.algorithm).toBe('Dilithium-5');

      // Verify FIPS-204 standardized byte sizes for ML-DSA-87
      expect(keys.publicKey.t).toBeInstanceOf(Uint8Array);
      expect(keys.publicKey.t.length).toBe(2592);
      
      expect(keys.privateKey.s1).toBeInstanceOf(Uint8Array);
      expect(keys.privateKey.s1.length).toBe(4896);
    });

    test('Signature generation and verification succeeds on valid message', async () => {
      const signatureResult = await PQC.dilithiumSign(testMessage, keys.privateKey);
      
      expect(signatureResult).toHaveProperty('signature');
      expect(signatureResult).toHaveProperty('hash');
      expect(signatureResult.algorithm).toBe('Dilithium-5');

      expect(signatureResult.signature).toBeInstanceOf(Uint8Array);
      expect(signatureResult.signature.length).toBe(4627);

      expect(signatureResult.hash).toBeInstanceOf(Uint8Array);
      expect(signatureResult.hash.length).toBe(32); // SHA-256

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
