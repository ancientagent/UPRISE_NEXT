## Summary
- What changed and why?

## Checklist
- [ ] No secrets or API keys in diffs
- [ ] No committed bundles/logs (e.g., index.android.bundle)
- [ ] Updated docs (CHANGELOG/specs) for navigation/onboarding/service changes
- [ ] Ran smokes where applicable (non-destructive)
- [ ] Added/updated tests (unit or snapshot)

## Verification Steps
- [ ] Login routing: (Auth → CommunitySetup/HomeSceneRegistry) when missing community
- [ ] Discovery/Radio requests include `community_key`

