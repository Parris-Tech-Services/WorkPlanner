# Podcast Integration TODO

**Decision:** Implemented — small, calm bank only.  
**Topic bank:** work transitions, focus, boundaries, workload, decision-making, work-life balance.

## Completed
- [x] Curate a smaller bank of 12 verified Spotify episodes rather than filling space with generic recommendations.
- [x] Add a collapsed bottom dock: **🎧 Listen to a work-transition podcast**.
- [x] One tap selects another episode; recent choices persist locally and immediate repeats are avoided.
- [x] Use Spotify embed/deep links without assuming autoplay.
- [x] Keep agenda, milestones, workload pulse and calendar actions visually primary.
- [x] Do not add noisy recommendations or autoplay to this calm planning tool.
- [x] Add mobile/a11y support and deterministic selection/persistence tests.

## Implementation notes
- The dock is collapsed by default and remembers its open/closed state on the current device.
- Podcast failure is non-fatal: the planner core still loads and remains usable.
- The service worker caches the dock assets for repeat/offline use; Spotify itself still requires network access.
- `npm test` checks syntax, bank integrity, repeat avoidance, and recent-history behaviour.
