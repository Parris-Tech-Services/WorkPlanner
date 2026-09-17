# WorkPlanner — Beautiful Code Standard Audit

**Audit date:** 17 September 2026  
**Repository tier:** Critical / relied-upon work-planning app  
**Standard:** The Beautiful Code Standard

## Overall finding

WorkPlanner is relatively small and already separates its planner core and podcast dock/bank. It has CI and a podcast-bank test, which is a useful baseline. The main gaps are broader behavioural coverage and clear ownership of the `DCSCensusAvance` gitlink/submodule relationship to the separate Work project.

## Priorities

1. Expand CI beyond the podcast bank to cover planner-core rules and a real browser smoke test for the work-planning flow.
2. Add a regression smoke test for the podcast dock because media controls have been a real failure mode across the portfolio.
3. Document why `DCSCensusAvance` is linked as a separate repository/submodule and which repo owns shared work-plan truth; avoid duplicating the same plan in the text file and linked app.
4. Test PWA/service-worker updates so stale cached code does not hide fixes.
5. Keep `planner-core.js` coherent; split only when real planning responsibilities diverge.
6. Add dependency/security and secret scanning if work-related APIs/data are introduced.

## Bottom line

**WorkPlanner has a sensible small shape. Broaden the tests around the actual planner and make cross-repo ownership explicit.**
