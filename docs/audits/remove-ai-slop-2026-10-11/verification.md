# Applied fixes and verification

All eight findings from the [initial audit](report.md) were implemented on 11 October 2026, following the user's instruction to apply them. The optional pause explanation was also added alongside the related Round Robin copy repair.

| Finding | Result |
| --- | --- |
| Q1 | Global job/stage/reservation/arrival totals and worker activity are read from a repeatable MySQL snapshot. Only recent table rows are limited. All running jobs remain available for selection in the inspector. |
| Q2 | Missing metrics show “—” and a loading/unavailable message. A measured zero remains zero. Failed refreshes preserve saved values and identify the last successful read. |
| Q3 | Round Robin describes ordering by scheduling rounds and explains that the recorded quantum does not pause or resume containers. |
| Q4 | Chart positions use capture timestamps. The chart names reserved capacity, shows a percentage scale and actual start/end labels, explains unmeasured intervals, supports a single sample, and offers a numerical sample table. |
| Q5 | The empty-history message refers to the query window and directs users to Save snapshot without assuming automatic sampling is active. Failed history reads have separate recovery guidance. |
| Q6 | Health checks repeat ten seconds after each completed check, with a ten-second request timeout, cleanup on unmount, and a last-checked time. Failed checks override old healthy data; recovery clears the error. |
| Q7 | Architecture copy describes independently refreshed database reads without guaranteeing that all displayed numbers agree simultaneously. |
| Q8 | The README lists recovery of untracked executions as implemented and preserves the distinction from planned worker failover/preemption. |

The API and flow guides describe the updated aggregation scope, running-job records, monitoring states and chart semantics. The original console palette, typography, status badges, filters, focus styles, reduced-motion handling, stage sequence and local-worker explanation were preserved.

## Checks completed

- `npm run build`: backend syntax checks and frontend production build passed.
- `npm test` with database/container flags disabled: **108 backend tests and 12 frontend tests passed**. The standard suite skipped 36 integration tests, as configured.
- Real MySQL verification: created a fresh isolated database, deployed the committed migration, and ran `orchestrator.integration.test.js` with database tests enabled. **Eight tests passed**, including the new regression covering running and scheduled jobs outside the 120 recent rows. The Docker-specific test was skipped. The isolated database was removed afterward.
- Regression checks cover global totals and stage splits, a hidden running job's worker/inspector data, actual timestamp spacing, zero/single-sample charts, missing versus measured-zero metrics, retained values after failure, health failure/recovery, request timeout, non-overlapping polls and unmount cleanup.
- [Updated copy captures](copy-captures-after.json): rerendered the same **35 component/state fixtures** used by the initial audit, including Round Robin, running/cleanup controls, job details, filters, chart history and failed metric reads. The failed metric fixture now supplies the new per-channel failure metadata. The extraction contains 1,241 text-node instances, 101 accessible-label/title instances and 293 distinct strings including fixture values. These are extraction counts, not a complete count of unique authored messages.
- Old Round Robin, automatic-sampler and absolute-number-agreement phrases were removed from application source. No confirmed hard copy bans emerged from the repeated state review. Section-label repetition remains justified by its operational role; no new marketing template or visual motif was introduced.

## Verification limits

The browser connector still exposes no browsers. Static React rendering confirms component content and SVG output, not layout, computed contrast, scrolling, focus interaction or responsive screenshots. Existing focus/reduced-motion rules remain intact but their browser behavior was not rechecked. Docker execution was not rerun because these fixes change dashboard reads, presentation and documentation, rather than container execution. The initial audit captures and service reproduction remain historical evidence of the pre-fix behavior; the new tests and updated captures verify the repairs. A full visual-clean verdict is still withheld.
