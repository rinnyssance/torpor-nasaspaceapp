# TORPOR: GitHub and research walkthrough

## 1. Connect or check GitHub
1. In Lovable, open **Project settings → Git** (or the **+** menu beside chat → **Project → GitHub**).
2. If already connected, check the repository and synced branch on that screen. The project documentation names `rinnyssance/torpor-nasaspaceapp`; the connection status has not been independently verified.
3. If not connected, choose GitHub, authorize your account, select the account or organization, then connect. Lovable creates a **new private repository**; it cannot attach Git sync to an existing repository.
4. Only a workspace/project owner or admin can connect the project. GitHub access must separately permit writing to the repository.
5. Wait for the initial sync, then open the repository on GitHub. Look for `README.md`, `src/`, `scripts/`, and `AGENTS.md`.

**Do not disconnect a working connection just to refresh it:** reconnecting creates a new repository rather than relinking the old one.

## 2. Find your way around the repository
- `README.md`: research scope, scientific limitations and local development overview.
- `docs/GITHUB_WALKTHROUGH.md`: this walkthrough.
- `src/routes/`: directly addressable TORPOR research screens.
- `src/components/research/`: dashboard, dataset browser, plots, notebook, measurement framework and roadmap.
- `src/lib/`: validation and scientific rules.
- `src/test/`: scientific threshold, identifier mapping and import tests.
- `scripts/README.md` and `scripts/schemas.md`: reproducible source preparation and supported import formats.
- `drizzle/migrations/`: application schema history, not a backup of research records.
- `AGENTS.md`: project architecture and generated-file boundaries.

## 3. Safely collaborate
1. On GitHub, open an **Issue** describing the desired change and its acceptance criteria.
2. Create a working branch from the branch shown as synced in Lovable.
3. Make the change and run the existing tests. Do not edit generated files or change managed database schema outside Lovable.
4. Open a **Pull request** back to the synced branch. Review numerical behavior, source provenance, private-record access and scientific caveats.
5. Merge only once the checks pass. Changes on a different branch do not appear in Lovable unless merged into the synced branch or that branch is selected in Lovable.
6. Open the Lovable preview and check the changed flow.

Avoid force pushes or rewriting published history. If Lovable reports divergence, merge its newest `lovable-sync*` branch into the synced branch on GitHub. Do not assume reconnecting will recover missing work.

## 4. Run locally (for a developer)
```sh
git clone <the repository URL shown in your Git settings>
cd <the cloned repository folder>
bun install
bun run dev
bunx vitest run
```
Use the local URL printed by the development server. A clone does **not** contain your hosted private records or a database snapshot. Configure approved environment values securely; never commit private keys, session tokens, passwords or personal research exports. Ask a project maintainer for the correct local environment, not a shared login.

## 5. Sync is not publishing or a data backup
- Saving code to GitHub does not publish the new website version.
- To update the public app, use Lovable’s **Publish** control after checking the preview.
- The public app is `https://torpor-nasaspaceapp.lovable.app`.
- Database records and uploaded research are separate from the repository. Export them separately through the app or Lovable Cloud as appropriate.
- Migration files do not apply themselves through Git sync; request database changes in Lovable.

## 6. Walk through TORPOR

### Research Overview
Select **OSD-238** or **OSD-324**, then the available contrast. Change adjusted-p and absolute log2 fold-change thresholds. The metrics and volcano plot use actual imported results. Click a gene or a table row, inspect its source annotation, and export the displayed CSV.

Default thresholds are adjusted p < 0.05 and |log2FC| ≥ 1. The displayed source extracts contain 2,000 units per study: skin has 120 threshold-passing units and the selected bone contrast has zero. These are not full-transcriptome counts.

### NASA Dataset Explorer
Search an accession, inspect its study, and open **Experimental Design**, **Data Availability** and **Source Information**. Keep organism, sample design, assay, source files and retrieval dates with the results. A verified metadata label does not validate a biological interpretation.

### Molecular Pathways
Select a gene analysis for the volcano and searchable result table, or a GO analysis for enrichment. Search GO terms, inspect adjusted p-values, select a term and inspect source-annotated genes. Export the analysis with provenance. Only a source-normalized expression analysis supports the sample heatmap; fold changes cannot stand in for sample measurements.

### Tissue Comparison
Inspect the independent bone and skin studies side by side. Explore mapped identifiers and GO terms while retaining the source contrast directions. OSD-324 is a 2-day osteocytic cell microarray contrast, flight minus ground; OSD-238 is mouse dorsal-skin RNA sequencing, ground minus flight. Models, assays, exposure durations and backgrounds differ. Shared identifiers do not establish a shared response or matched tissue effects.

### Research Findings
Sign in to create a private finding. Record the research question, dataset/analysis identifier, method, numerical evidence, thresholds, interpretation, limitations, sources and follow-up questions separately. Save, reload and confirm the finding returns. Search by identifiers or citations and filter by information type. Editing curated research elsewhere creates a personal copy rather than changing the public source.

### Measurement Readiness Lab
Review the five cited measurement hypotheses. Each is assessed separately for biological relevance, technical feasibility, validation evidence and mission practicality. There is no composite readiness score. Add a validation task only when its reference method and required evidence are explicit.

### Wearable Roadmap and Library
Search the 25 curated research tasks, filter by status and expand evidence/completion details. These are planned milestones, not completed research. Use the library to inspect original publications and NASA sources; export records as needed.

## Scientific boundary checklist
- Gene-expression change is not evidence of tissue damage.
- GO over-representation is not pathway activation or direction.
- Mouse/cell-model results are not direct human astronaut physiology.
- Independent experiments are not matched tissue measurements.
- Imported subsets, source statistics, computed results, interpretation and hypotheses must remain visibly separate.
- TORPOR is exploratory research software, not a clinical or real-time astronaut monitoring product.
