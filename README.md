# TORPOR computational biology workspace

Research question: How does spaceflight alter molecular pathways involved in tissue maintenance and repair in bone and skin, and what could inform future measurement hypotheses?

## Repository and structure
Target research repository: `rinnyssance/torpor-nasaspaceapp`. Git sync is configured in Lovable Project settings → Git; app commits do not publish the website.

- `src/`: TanStack Start application, owner-protected findings/imports, public scientific catalog, source-linked charts.
- `scripts/`: reproducible Python source preparation, requirements and methods.
- `drizzle/migrations/`: managed schema history; not research data snapshots.
- `src/test/`: threshold, mapping, import and evidence tests.

## Research data and limitations
NASA OSD-324: Ocy454 osteocytic cell microarray, selected 2-day flight−ground contrast. NASA OSD-238: mouse dorsal-skin bulk RNA-seq, ground−flight standard-chow contrast. Original statistics are retained; TORPOR does not fit raw sequencing models in the browser. Displayed 2,000-row differential-expression subsets and top-100 GO outputs are explicitly incomplete transcriptomes. GO over-representation is Python Fisher exact with BH correction and complete valid-result background. Independent experiments cannot establish matched tissue effects, pathway activation, damage, or human astronaut physiology.

The OSD-238 sample matrix contains six selected source genes and six actual normalized biological samples. Counts are not fabricated from fold changes. Refer to `scripts/README.md` for sources and processing.

## Application development
```sh
bun install
bun run dev
bunx vitest run
```
Configure credentials through hosted secret management; never commit private keys, sessions or restricted data. No editable research is stored in browser storage. Private research persists through owner-protected records.

## Import and export
Prepared result arrays are imported as gene, pathway or normalized-expression analyses. The import dialog records study, source URL, method and import date; user imports remain explicitly unverified. Scientific exports include source/method information. CSV is provided alongside a provenance-bearing JSON export. Research Findings saves numerical evidence separately from interpretation, limitations and follow-up questions.

See `scripts/schemas.md` for supported file shapes. All research is exploratory, not clinical diagnosis or operational astronaut monitoring.
