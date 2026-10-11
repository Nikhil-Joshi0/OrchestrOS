# OrchestrOS sky-blue UI

## Summary

Used the Apple Design and UI UX Pro Max skills to simplify this React dashboard for people studying and operating local workloads. The screen's job is to prepare a run, trace jobs through their stages, and inspect worker capacity. The connected pipeline is the defining element: its structure reflects the actual orchestration sequence. Overall visual review: Good, based on desktop and phone browser captures and the checks below.

The earlier layout already grouped controls sensibly and exposed job details, status labels, and recorded chart values. The changes address the user's purple-theme concern, repeated decorative section badges, and small labels while preserving those useful patterns.

## Design decisions

- Sky-blue page tint, white panels, and blue primary actions. Red, amber, and green retain their operational meanings. The palette is the user's requested direction and a design judgment, rather than a claim that a particular color indicates AI authorship.
- One strong run action; workload generation and the demo have softer emphasis. Pause uses a secondary style; stopping workloads retains a red outline.
- Clear section names, shorter dropdown choices, larger labels, and sentence-case filters. A page-level heading establishes the reading hierarchy.
- Keep existing Inter for headings and body, with Roboto Mono for identifiers and resource values. Heading sizes are 28/18/15px; normal control and helper text is 13px, with 16px inputs at compact widths. Sizes use rem units for text scaling.
- Native selects, fieldsets, labels, buttons, and disclosures remain the interaction primitives. No added animation, imagery, gradients, translucent layers, or dependencies.

Regular layout:

```text
Brand                  Section links     Appearance
Workload console
Generator       Scheduling / placement       Run
Queue -> Scheduler -> Placement -> Reserve -> Execute -> Complete
Workers                                      Job details
Job queue
Activity
Monitoring
```

Compact layout stacks the control groups, workers, inspector, and monitoring cards. The pipeline uses two columns on small phones; wide data tables scroll inside their own container.

## How the skills informed the change

Apple Design was applied as web design principles, rather than native macOS conventions. Read accessibility, layout, typography, color, designing-for-macOS, cross-platform translation, buttons, lists-and-tables, entering-data, and charting-data references.

- `layout.md > Visual hierarchy`: “Group related items to clearly express related information or functions.” Retained control grouping and progressive disclosure; removed redundant colored section tags.
- `typography.md > Conveying hierarchy`: “Minimize the number of typefaces you use.” Retained the two bundled fonts and used weight and size for hierarchy.
- `color.md > Inclusive color`: “Avoid relying solely on color”. Status text, selected filters, stage labels, and chart labels accompany colors.
- `lists-and-tables.md > Best practices`: “Provide appropriate feedback when people select a list item.” Retained selected-row and selected-stage feedback.

UI UX Pro Max searches used `infrastructure dashboard minimal blue`, then a narrower `operations monitoring dashboard` query, and React guidance for `accessible forms keyboard`. The verified minimalism guidance fits a functional dashboard. Generated landing-page sections and suggested orange/green branding were excluded because this is an existing operator console with a user-selected blue direction. Recommendations informed the design; no generated marketing layout was applied.

## Palette verification

| Role | Light | Dark | Contrast against its surface |
| --- | --- | --- | --- |
| Panel | `#ffffff` | `#172935` | — |
| Main text | `#193447` | `#edf5fa` | 12.93 / 13.55 |
| Secondary text | `#526b7a` | `#a9bdcc` | 5.61 / 7.71 |
| Primary action | `#0369a1` | `#7dd3fc` | Button text 5.93 / 8.48 |
| Input boundary | `#738b9d` | `#7895a3` | 3.55 / 4.72 |
| CPU chart | `#0284c7` | `#38bdf8` | 4.10 / 6.98 |

Fifty tested text, action, status, chart, and boundary pairs pass their 4.5:1 text or 3:1 non-text thresholds. Exact values and tested backgrounds are in [verification.json](verification.json).

## Validation

- Production build and backend syntax checks passed.
- All 12 existing frontend tests passed, including stale/loading metrics, polling, health recovery, and chart semantics.
- Headless Edge rendered the live React app against the local API. Screenshots were inspected for desktop light/dark, phone controls/pipeline, and monitoring.
- No document overflow or visible controls outside the viewport at 320, 375, 768, 1024, and 1440px; monitoring tools were expanded during these checks.
- Document width remains within the viewport at 200% root text size at 375 and 1440px.
- Round Robin settings, job filters, queue selection, visible focus, persisted theme selection, system light/dark appearance, and reduced-motion behavior verified.
- Browser runtime errors: none observed. Verification did not generate, execute, cancel, or delete jobs.

Light is the default for new visitors. An existing saved Dark or System preference is respected; the header's Light option selects the white and sky-blue appearance.

These checks cover the rendered layouts and representative controls. They do not constitute a full screen-reader or physical-device accessibility audit.

## Captures

- [Desktop light](desktop-light.png)
- [Desktop dark](desktop-dark.png)
- [Phone controls](mobile-light.png)
- [Phone pipeline](mobile-pipeline.png)
- [Monitoring](desktop-monitoring.png)
