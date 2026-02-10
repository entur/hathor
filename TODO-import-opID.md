# TODO: operationalID / operationalRef not passed to backend

## Summary

The `operationalID`/`operationalRef` value is collected in both the single-import and multi-import UI flows but is **never included in the NeTEx XML payload** sent to the Sobek backend. All operationalRef handling is effectively dead code as far as backend communication goes.

## Where it is collected

| File | What happens |
|------|-------------|
| `SingleImport.tsx` | `useState` stores user-entered operationalId |
| `SingleImportConfirm.tsx` | Displays operationalId in confirmation dialog |
| `MultiImportColumnMapper.tsx` | Lets user map a CSV column to operationalRef |
| `MultiImportReviewInput.tsx` | Parses `REG:OP-ID` format from manual text entry |
| `MultiImport.tsx` | Builds `ImportEntry[]` with `regNumber` + `operationalRef` |
| `types.ts` | Defines `ImportEntry.operationalRef?: string` |

## Where it is dropped

- **SingleImport `onConfirm`** — submits only the raw Autosys XML; `operationalId` is not referenced.
- **MultiImport fetch step** — extracts only `regNumbers` from entries; `operationalRef` is ignored.
- **MultiImport submit step** — merges XMLs via `pubDeliveryFromListV2()` which has no concept of operationalRef.
- **`pubDeliveryFromList.ts`** — zero references to operationalRef.
- **`vehicleImportServices.ts`** — POSTs raw XML as-is with no mechanism to inject additional data.

## Resolution options

1. **Implement it** — inject `operationalRef` into the NeTEx XML `<Vehicle>` elements before submission (requires understanding the correct NeTEx element/attribute to use and backend support in Sobek).
