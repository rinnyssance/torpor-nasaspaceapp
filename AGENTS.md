<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Research workspace architecture
- Keep content screens as distinct TanStack leaf routes sharing a persistent workspace shell; navigation stays directly addressable.
- Load public study references through a publishable server function and route Query loader; private workspace reads use the browser client after session hydration with owner RLS.
- Store imported gene/pathway arrays atomically in an analysis JSONB record with provenance; schema-validate each row before persisting to avoid partial imports.
- Store structured candidate, reference, roadmap and note fields in owner-protected JSONB records; never persist editable research in browser storage.
- Keep statistical parsing and evidence rules in pure research utilities with focused tests; charts only render imported records.
- Public curated records live in the read-only research catalog and merge with owner-private records; editing a curated item creates a personal copy.
- Extract source statistics with the versioned Python preparation script and retain hashes, contrast direction, subset selection and enrichment background; never treat mapped symbols as original identifiers.
- Save structured findings as owner-private research-note records tagged by record type and linked to source analyses, so interpretation stays separate from numerical evidence.
- Render sample heatmaps only from validated normalized-expression records with consistent source sample identifiers; never synthesize sample values from effect sizes.
- Keep expression schema validation independent from gene statistics utilities to prevent circular scientific imports.

- Compose the overview from browser-safe research panels using existing validated analyses; shared semantic CSS tokens and a persisted display-only theme keep research data out of browser storage.
