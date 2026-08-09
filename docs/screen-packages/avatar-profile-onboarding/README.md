# Avatar Profile Onboarding

Status: preserved runtime spike; owner-contract decisions required
Owner: user identity/profile lane

This package preserves the July 2026 photo-guided avatar and Registrar-profile
runtime experiment without activating it in production code.

The spike is implementation evidence only. Durable behavior remains owned by
`docs/specs/**`. Do not restore it to `apps/**` until the privacy, consent,
retention, moderation, minors, storage, provider, and route-ownership decisions
listed in `instruction-packet.md` are locked.

## Contents

- `instruction-packet.md`: authority and stop conditions.
- `source-map.md`: founder, art, spec, and preserved-code references.
- `implementation/runtime-spike/`: exact experimental source files, migrations,
  tests, and tracked integration patch removed from live runtime on 2026-08-01.

## Recovery Checkpoint

The complete pre-normalization checkout is also preserved at:

- WSL: `/mnt/c/Users/baris/uprise-agent-artifacts/uprise-shared-checkout-pre-normalization`
- Windows: `C:\Users\baris\uprise-agent-artifacts\uprise-shared-checkout-pre-normalization`
