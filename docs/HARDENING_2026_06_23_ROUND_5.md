# Hardening round 5 - authenticated route attestations

This overlay is based on commit `fac4e387a6daaddc6d00466b7197292e0e5b747e` and keeps application metadata at `2.6.0`.

## What changed

- Added portable Ed25519 JWK key generation with private files created at mode `0600` and never overwritten.
- Added a signed `evidence-route-attestation` wrapper that covers the complete verified route bundle, signer public key, key fingerprint and timestamp. Attestation outputs are exclusive-create and never overwrite existing files.
- Enhanced `route:verify` to auto-detect unsigned bundles and signed wrappers.
- Added explicit trust pinning by public JWK or SHA-256 fingerprint, while rejecting private JWK material supplied to `--trust-key`.
- Added `--require-signed` and `--require-trusted` policies for CI and research-agent workflows.
- Added `.route-keys/` to `.gitignore` to reduce accidental private-key commits.

## Trust boundary

The embedded public key proves only that the wrapper is self-consistent. Identity is established only when a recipient obtains the public key or its fingerprint through an authenticated channel and pins it during verification. Signature verification never bypasses canonical graph hashing, route recalculation or evidence-summary recalculation.

## Compatibility

Round 4 route bundles remain schema-compatible and continue to verify unchanged. Signing produces a separate wrapper, so the original bundle and its SHA-256 remain byte-for-byte stable.
