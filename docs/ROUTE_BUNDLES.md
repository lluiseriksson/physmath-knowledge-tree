# Verifiable route bundles and attestations

Route bundles make an evidence-aware graph route portable without asking a recipient to trust a screenshot or copied list of node IDs.

## Create a bundle

```bash
npm run route:bundle -- domain.number_theory problem.riemann_hypothesis \
  --policy strongest --allow formal,literature \
  --output riemann-route.json
```

The command accepts the same direction, evidence, edge-budget and state-budget options as `route:plan`. A bundle represents one policy; `--compare` is intentionally rejected.

## Verify a bundle

```bash
npm run route:verify -- riemann-route.json
npm run route:verify -- riemann-route.json --json
```

Verification checks the payload SHA-256, canonical graph SHA-256, application version, graph-schema version, deterministic route recalculation and evidence-summary recalculation. Any mismatch is fatal.

## Add author authenticity

A payload hash can detect modification but cannot identify who produced it. Round 5 therefore adds optional Ed25519 attestation wrappers without weakening or replacing canonical route verification.

Generate a local keypair:

```bash
npm run route:keygen
```

The command writes a private and public JWK below `.route-keys/`. That directory is ignored by Git. Existing key files are never overwritten. Keep the private file offline and distribute the public file or its printed fingerprint through an authenticated channel.

Create an attestation only after the bundle has been recalculated successfully against the current graph:

```bash
npm run route:attest -- riemann-route.json \
  --private-key .route-keys/route-signing.private.jwk.json \
  --output riemann-route.attestation.json
```

The wrapper signs the complete route bundle together with the Ed25519 public key, its SHA-256 fingerprint and a canonical signing timestamp. An explicit `--output` path is created exclusively and is never overwritten.

## Verify signature and trust separately

A signature made by the embedded key is cryptographically valid, but the embedded key is not automatically a trusted identity. `--trust-key` accepts public JWKs only, preventing accidental use of a private key file as a trust input.

```bash
# Signature valid; signer identity not pinned.
npm run route:verify -- riemann-route.attestation.json

# Pin a public JWK and fail unless it signed the wrapper.
npm run route:verify -- riemann-route.attestation.json \
  --trust-key trusted-route-signer.public.jwk.json \
  --require-trusted

# Fingerprints can be pinned directly by CI or another authenticated channel.
npm run route:verify -- riemann-route.attestation.json \
  --trust-fingerprint sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef \
  --require-trusted --json
```

Use `--require-signed` when unsigned bundles must be rejected. Use `--require-trusted` when both a valid signature and a pinned signer are mandatory.

## Security boundary

The route verifier always recalculates the route and evidence summary against the repository's canonical graph. Ed25519 proves control of a particular private key; trust still depends on how the public key or fingerprint was authenticated. Neither a bundle nor an attestation is a mathematical proof, a promotion of confidence labels, or evidence that an edge's underlying scientific claim is true.
