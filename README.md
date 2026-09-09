# concept-sandbox/

Throwaway visual POCs hosted as static HTML. Iterates outside the React app so
design moves can be sketched fast.

## Production mirrors

Some chunks of this directory are **upstream of production code**. Edits to
either side need to be mirrored:

| Source in this dir | Mirrored to (production) |
|---|---|
| `claude-design.html` — `<svg style="display:none">` sprite block (lines ≈ 2079–2167 on the `ui-sandboxing` branch) | `src/components/icons/TransportModeSprite.tsx` |

See `FORK_DECISIONS.md` → "Transport-mode icon strategy" for the rationale and
the rules around adding new transport-mode glyphs.
