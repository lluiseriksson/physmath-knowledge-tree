# Verifiable route bundles

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

## Security boundary

The SHA-256 fields detect accidental or deliberate modification and bind the route to a particular canonical graph projection. They are not a digital signature and do not establish an author identity. Authenticity still requires a trusted transport, release asset, signed commit or another authenticated channel.
