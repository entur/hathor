# Post-refinements (pass 2)

Follows the initial MUI migration (pass 1) which converted structural layout to MUI `Paper`, `Stack`, `Box`, and `Typography`.

## What changed

### Native `<select>` replaced with MUI `TextField select`

- 4 top-level selects (TransportMode, PropulsionType, FuelType, TypeOfFuel) now use `<TextField label select size="small" fullWidth SelectProps={{ native: true }}>`, replacing the `<Box>` + `<Typography>` + `<select>` triplet.
- 1 sub-row select (fareClass in PassengerCapacityStructureRow) uses the same pattern without a label, with `sx={{ minWidth: 120 }}` for compact layout.
- The `<option>` children are unchanged (native mode).
- Empty-value placeholder dashes (`--`) removed; MUI's floating label serves that role.

### Native `<input>` replaced with MUI `TextField`

- 20 top-level text/number inputs converted from `<Typography label>` + `<input className="vte-input">` to `<TextField label size="small" fullWidth>`.
- Number fields retain `type="number"`.
- Sub-row inputs (inside `TextTypeRow`, `PrivateCodeStructureRow`, `PassengerCapacityStructureRow`, etc.) are **not** converted -- they remain native with placeholder text.

### CSS cleanup

- Removed `.vte-select`, `.vte-select:focus`, and `.vte-select--sub` rules from `Editor.css`.
- `.vte-input` and `.vte-input--sub` rules kept (still used by sub-row inputs).

## What remains native

- Sub-row `<input>` elements (placeholder-based, no label)
- Checkboxes (`<input type="checkbox">`)
- Buttons (`<button>` for Add/Remove)
