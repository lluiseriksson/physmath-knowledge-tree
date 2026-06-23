// @ts-check
import {
  ROUTE_BUNDLE_APPLICATION,
  ROUTE_BUNDLE_KIND,
  sha256Hex,
  stableStringify,
  verifyRouteBundle,
} from './route-bundle.js';

export const ROUTE_ATTESTATION_ALGORITHM = 'Ed25519';
export const ROUTE_ATTESTATION_KIND = 'evidence-route-attestation';
export const ROUTE_ATTESTATION_SCHEMA_VERSION = 1;

/** @param {unknown} value */
function isRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function subtleCrypto() {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto Ed25519 is unavailable');
  return subtle;
}

/** @param {Uint8Array} bytes */
export function encodeBase64Url(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new Error('Base64url input must be bytes');
  if (typeof globalThis.btoa !== 'function') throw new Error('Base64 encoding is unavailable');
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return globalThis.btoa(binary)
    .replace(/\+/gu, '-')
    .replace(/\//gu, '_')
    .replace(/=+$/u, '');
}

/** @param {unknown} value @param {string} [label] */
export function decodeBase64Url(value, label = 'Base64url value') {
  if (typeof value !== 'string' || !value
      || !/^[A-Za-z0-9_-]+$/u.test(value) || value.length % 4 === 1) {
    throw new Error(`${label} is not canonical base64url`);
  }
  if (typeof globalThis.atob !== 'function') throw new Error('Base64 decoding is unavailable');
  const padded = value.replace(/-/gu, '+').replace(/_/gu, '/')
    + '='.repeat((4 - (value.length % 4)) % 4);
  let binary;
  try {
    binary = globalThis.atob(padded);
  } catch {
    throw new Error(`${label} is not valid base64url`);
  }
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  if (encodeBase64Url(bytes) !== value) throw new Error(`${label} is not canonical base64url`);
  return bytes;
}

/** @param {unknown} value */
export function canonicalRoutePublicKey(value) {
  if (!isRecord(value) || value.kty !== 'OKP' || value.crv !== 'Ed25519') {
    throw new Error('Route signing public key must be an Ed25519 OKP JWK');
  }
  const x = value.x;
  if (decodeBase64Url(x, 'Route signing public key x').length !== 32) {
    throw new Error('Route signing public key x must contain 32 bytes');
  }
  return { kty: 'OKP', crv: 'Ed25519', x };
}

/** @param {unknown} value */
export function canonicalRoutePrivateKey(value) {
  const publicKey = canonicalRoutePublicKey(value);
  const d = /** @type {Record<string, unknown>} */ (value).d;
  if (decodeBase64Url(d, 'Route signing private key d').length !== 32) {
    throw new Error('Route signing private key d must contain 32 bytes');
  }
  return { ...publicKey, d };
}

/** @param {unknown} value @param {string} label @param {boolean} strict */
function canonicalTimestamp(value, label, strict) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be an ISO-compatible date`);
  }
  const normalized = new Date(value).toISOString();
  if (strict && normalized !== value) throw new Error(`${label} must use canonical ISO format`);
  return normalized;
}

/** @param {unknown} publicKey */
export async function fingerprintRoutePublicKey(publicKey) {
  const canonical = canonicalRoutePublicKey(publicKey);
  return `sha256:${await sha256Hex(stableStringify(canonical))}`;
}

/** Generate a portable Ed25519 JWK keypair. */
export async function generateRouteSigningKeyPair() {
  const subtle = subtleCrypto();
  const pair = await subtle.generateKey(
    { name: ROUTE_ATTESTATION_ALGORITHM },
    true,
    ['sign', 'verify'],
  );
  const [rawPublic, rawPrivate] = await Promise.all([
    subtle.exportKey('jwk', pair.publicKey),
    subtle.exportKey('jwk', pair.privateKey),
  ]);
  const publicKey = canonicalRoutePublicKey(rawPublic);
  const privateKey = canonicalRoutePrivateKey(rawPrivate);
  return {
    algorithm: ROUTE_ATTESTATION_ALGORITHM,
    fingerprint: await fingerprintRoutePublicKey(publicKey),
    public_key: publicKey,
    private_key: privateKey,
  };
}

/** @param {Record<string, any>} document */
function unsignedAttestation(document) {
  const { signature: _signature, ...unsigned } = document;
  return unsigned;
}

/** @param {Record<string, any>} document */
function attestationBytes(document) {
  return new TextEncoder().encode(stableStringify(unsignedAttestation(document)));
}

/** @param {Record<string, any>} privateKey */
async function importPrivateKey(privateKey) {
  return subtleCrypto().importKey(
    'jwk',
    { ...privateKey, ext: true, key_ops: ['sign'] },
    { name: ROUTE_ATTESTATION_ALGORITHM },
    false,
    ['sign'],
  );
}

/** @param {Record<string, any>} publicKey */
async function importPublicKey(publicKey) {
  return subtleCrypto().importKey(
    'jwk',
    { ...publicKey, ext: true, key_ops: ['verify'] },
    { name: ROUTE_ATTESTATION_ALGORITHM },
    false,
    ['verify'],
  );
}

/** @param {unknown} value */
export function isRouteAttestation(value) {
  return isRecord(value)
    && value.application === ROUTE_BUNDLE_APPLICATION
    && value.kind === ROUTE_ATTESTATION_KIND;
}

/**
 * Verify a route bundle before creating an Ed25519 attestation wrapper.
 * @param {unknown} bundle
 * @param {{index:Record<string,any>,nodes:Array<Record<string,any>>,edges:Array<Record<string,any>>}} canonical
 * @param {unknown} privateKeyInput
 * @param {{signedAt?:string}} [options]
 */
export async function attestRouteBundle(bundle, canonical, privateKeyInput, options = {}) {
  if (!isRecord(options)) throw new Error('Route attestation options must be an object');
  const bundleSnapshot = structuredClone(bundle);
  await verifyRouteBundle(bundleSnapshot, canonical);
  const privateKey = canonicalRoutePrivateKey(privateKeyInput);
  const publicKey = canonicalRoutePublicKey(privateKey);
  const fingerprint = await fingerprintRoutePublicKey(publicKey);
  const signedAt = canonicalTimestamp(
    options.signedAt ?? new Date().toISOString(),
    'Route attestation signedAt',
    false,
  );
  const document = {
    application: ROUTE_BUNDLE_APPLICATION,
    kind: ROUTE_ATTESTATION_KIND,
    schema_version: ROUTE_ATTESTATION_SCHEMA_VERSION,
    bundle: bundleSnapshot,
    signer: {
      algorithm: ROUTE_ATTESTATION_ALGORITHM,
      fingerprint,
      public_key: publicKey,
      signed_at: signedAt,
    },
  };
  const signingKey = await importPrivateKey(privateKey);
  const signature = new Uint8Array(await subtleCrypto().sign(
    { name: ROUTE_ATTESTATION_ALGORITHM },
    signingKey,
    attestationBytes(document),
  ));
  const attestation = {
    ...document,
    signature: { encoding: 'base64url', value: encodeBase64Url(signature) },
  };
  const verificationKey = await importPublicKey(publicKey);
  const selfCheck = await subtleCrypto().verify(
    { name: ROUTE_ATTESTATION_ALGORITHM },
    verificationKey,
    signature,
    attestationBytes(attestation),
  );
  if (!selfCheck) throw new Error('Route signing private key does not match its public key');
  return attestation;
}

/** @param {unknown} values */
function trustedFingerprintSet(values) {
  if (values === undefined) return new Set();
  if (!Array.isArray(values)) throw new Error('trustedFingerprints must be an array');
  const trusted = new Set();
  for (const value of values) {
    const fingerprint = String(value);
    if (!/^sha256:[a-f0-9]{64}$/u.test(fingerprint)) {
      throw new Error(`Invalid trusted route signer fingerprint: ${fingerprint}`);
    }
    trusted.add(fingerprint);
  }
  return trusted;
}

/**
 * Verify the wrapper signature, signer trust policy and embedded route bundle.
 * @param {unknown} input
 * @param {{index:Record<string,any>,nodes:Array<Record<string,any>>,edges:Array<Record<string,any>>}} canonical
 * @param {{trustedFingerprints?:string[],requireTrusted?:boolean}} [options]
 */
export async function verifyRouteAttestation(input, canonical, options = {}) {
  if (!isRecord(options)) throw new Error('Route attestation options must be an object');
  if (!isRouteAttestation(input)) throw new Error('Not a PhysMath evidence-route attestation');
  const document = input;
  if (document.schema_version !== ROUTE_ATTESTATION_SCHEMA_VERSION) {
    throw new Error('Unsupported route-attestation schema version');
  }
  if (!isRecord(document.bundle) || !isRecord(document.signer) || !isRecord(document.signature)) {
    throw new Error('Route attestation is structurally incomplete');
  }
  if (document.bundle.kind !== ROUTE_BUNDLE_KIND) {
    throw new Error('Route attestation does not contain a route bundle');
  }
  if (document.signer.algorithm !== ROUTE_ATTESTATION_ALGORITHM) {
    throw new Error('Route attestation algorithm is unsupported');
  }
  const publicKey = canonicalRoutePublicKey(document.signer.public_key);
  const fingerprint = await fingerprintRoutePublicKey(publicKey);
  if (document.signer.fingerprint !== fingerprint) throw new Error('Route signer fingerprint mismatch');
  const signedAt = canonicalTimestamp(document.signer.signed_at, 'Route attestation signed_at', true);
  const signatureKeys = Object.keys(document.signature).sort();
  if (stableStringify(signatureKeys) !== '["encoding","value"]') {
    throw new Error('Route signature metadata contains unsupported fields');
  }
  if (document.signature.encoding !== 'base64url') throw new Error('Route signature encoding is unsupported');
  const signature = decodeBase64Url(document.signature.value, 'Route signature');
  if (signature.length !== 64) throw new Error('Route signature must contain 64 bytes');
  const verificationKey = await importPublicKey(publicKey);
  const validSignature = await subtleCrypto().verify(
    { name: ROUTE_ATTESTATION_ALGORITHM },
    verificationKey,
    signature,
    attestationBytes(document),
  );
  if (!validSignature) throw new Error('Route attestation Ed25519 signature mismatch');

  const trustedFingerprints = trustedFingerprintSet(options.trustedFingerprints);
  const trusted = trustedFingerprints.has(fingerprint);
  if (options.requireTrusted === true && !trusted) throw new Error('Route signer is not trusted');
  const route = await verifyRouteBundle(document.bundle, canonical);
  return {
    ...route,
    artifact_kind: ROUTE_ATTESTATION_KIND,
    attestation: {
      valid: true,
      algorithm: ROUTE_ATTESTATION_ALGORITHM,
      fingerprint,
      signed_at: signedAt,
      trusted,
    },
  };
}

/**
 * Verify either an unsigned route bundle or a signed route-attestation wrapper.
 * @param {unknown} input
 * @param {{index:Record<string,any>,nodes:Array<Record<string,any>>,edges:Array<Record<string,any>>}} canonical
 * @param {{trustedFingerprints?:string[],requireSigned?:boolean,requireTrusted?:boolean}} [options]
 */
export async function verifyRouteArtifact(input, canonical, options = {}) {
  if (!isRecord(options)) throw new Error('Route artifact options must be an object');
  if (isRouteAttestation(input)) return verifyRouteAttestation(input, canonical, options);
  if (options.requireSigned === true || options.requireTrusted === true) {
    throw new Error('A signed route attestation is required');
  }
  const route = await verifyRouteBundle(input, canonical);
  return { ...route, artifact_kind: ROUTE_BUNDLE_KIND, attestation: null };
}
