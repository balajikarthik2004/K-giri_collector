# Krishnagiri District Collectorate — Command Portal

An executive decision portal for the District Collector: fifteen review modules, every
figure drillable down to the officer holding the file, in Tamil **or** English.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle
npm run lint
```

## Modules

| Group | Module | Covers |
| --- | --- | --- |
| Command | My day | Diary, VIP visits, court deadlines, overnight escalations, weather & rainfall, law-and-order flash |
| Command | Action queue | One list of SLA breaches, court directions, VIP references, red flags and files awaiting signature |
| Command | Map & drill-down | Any metric at taluk / block / panchayat / ward, click through to the responsible officer |
| Administration | Revenue & land | Patta and FMB pendency by taluk, SRO collection vs target, encroachment, land acquisition |
| Administration | Grievances & CM cell | CM Cell, Ungaludan Stalin, Makkaludan Mudhalvar, CPGRAMS, Grievance Day; ageing heatmap by department |
| Administration | Finance & audit | Budget utilisation by department, UCs pending, treasury bills, open audit paras |
| Administration | Staff & attendance | Cadre strength, biometric attendance, disciplinary cases |
| Administration | Elections & civic | SSR claims, EPIC pendency, polling station facility gaps |
| Development | Schemes & DBT | Flagship schemes, disbursement, MGNREGS person-days, Aadhaar-seeding and ghost-beneficiary flags |
| Development | Agriculture & water | Block rainfall vs normal, reservoir storage, sown area, mango/tomato/coconut prices |
| Development | Industry & jobs | SIPCOT allotment, single-window pipeline, placements, credit-linked schemes |
| Development | Water & infrastructure | Supply LPCD and tankers, works with photo evidence, property tax, solid waste |
| Human development | Health | Fever surveillance, maternal indicators, staffing, live bed availability |
| Human development | Education | Enrolment, dropout, breakfast scheme, infrastructure gaps, board results |
| Safety | Law, order & disaster | Crime heatmap, sensitive locations, NH-44 road safety, relief readiness, contact tree |

## Cross-cutting behaviour

- **One language at a time.** Every string is a `Bi = { en, ta }` pair resolved by `useI18n().t()`.
  The header toggle switches the whole page and persists to `localStorage` — the UI is never
  bilingual on screen. See [src/i18n/](src/i18n/).
- **Role-based views.** Collector / RDO / BDO / Tahsildar / HoD. Each role sees only its
  sections; switching role redirects out of anything outside the new jurisdiction and the
  scope strip names the jurisdiction. See [src/app/sections.ts](src/app/sections.ts).
- **Drill-down with a call button.** Any row opens a side sheet carrying the record's facts,
  the officer holding it (with `tel:` dial), and an audit trail naming the source system.
  See [src/components/ui/Drawer.tsx](src/components/ui/Drawer.tsx).
- **Review packs.** "Print review pack" produces an A4 layout — chrome hidden, panels kept
  whole across page breaks (`@media print` in [src/index.css](src/index.css)). Every table
  also exports CSV.
- **Mobile-first, 4G-friendly.** Tables collapse to cards below `md`, off-canvas navigation,
  a bottom quick bar, and no charting library — all visuals are hand-rolled inline SVG.

## Data visualisation

Charts live in [src/components/ui/Charts.tsx](src/components/ui/Charts.tsx): column, bar list,
donut, sparkline and heatmap, each with a hover layer and direct labels.

The categorical palette (`#2a78d6`, `#eb6834`, `#1baf7a`, `#eda100`) was validated against the
white chart surface for the lightness band, chroma floor, colour-vision-deficiency separation,
normal-vision floor and contrast. Slots are assigned in fixed order and never cycled; donuts
cap at three slices plus "Other" (the all-pairs limit). Magnitude uses a single-hue blue ramp;
`good / warning / serious / critical` are reserved status colours and always ship with an icon
and label, so nothing is ever encoded by colour alone.

## Structure

```
src/
  app/        shell, navigation registry, routing + role store
  components/ui/  panels, stat tiles, tables, drawer, charts
  data/       shared reference data (taluks, blocks, designations, source systems)
  i18n/       bilingual string plumbing + UI dictionary
  pages/      one file per module, each owning its own data
```

All figures are representative sample data. Point the modules at the real feeds — Star 2.0,
CM Cell portal, PFMS, EMIS, IFHRMS, CCTNS, ERONET — named per record in each drill-down's
audit trail.
