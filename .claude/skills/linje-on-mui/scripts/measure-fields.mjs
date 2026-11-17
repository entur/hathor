// Dump the computed geometry and colours of every MUI text field (filled = form size, outlined = small)
// in one or more Storybook stories.
// Usage: node measure-fields.mjs <story-id> [...story-id]   (env: SB=http://127.0.0.1:6006, OUT=<dir for screenshots>)
// One JSON line per field: label rect/transform/colour, root height/radius/padding, input padding and
// offsets, notch border, outline, chip count, Select text box vs arrow (selectOverlapPx > 0 = text runs under the arrow), helper text placement.
import { chromium } from '/home/kdm/entur/hathor/node_modules/playwright/index.mjs';

const SB = process.env.SB ?? 'http://127.0.0.1:6006',
  OUT = process.env.OUT,
  SETTLE_MS = 2500; // story render + label colour transition (200 ms) with margin

const ids = process.argv.slice(2);
if (!ids.length) {
  console.error('usage: node measure-fields.mjs <story-id> [...]');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
for (const id of ids) {
  await page.goto(`${SB}/iframe.html?id=${id}&viewMode=story`);
  await page.waitForTimeout(SETTLE_MS);
  if (OUT) await page.screenshot({ path: `${OUT}/${id}.png`, fullPage: true });
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('.MuiFormControl-root')].flatMap(fc => {
      const root = fc.querySelector('.MuiFilledInput-root, .MuiOutlinedInput-root');
      if (!root) return [];
      const r = root.getBoundingClientRect(),
        cs = getComputedStyle(root);
      // MUI 9 renders a Select's label as a <div>, so match the class, not the <label> tag.
      const lab = fc.querySelector('.MuiInputLabel-root');
      const inp = root.querySelector('.MuiInputBase-input');
      const variant = root.classList.contains('MuiFilledInput-root') ? 'filled' : 'outlined';
      const notchEl = root.querySelector('.MuiOutlinedInput-notchedOutline'),
        notch = notchEl && getComputedStyle(notchEl);
      const sel = root.querySelector('.MuiSelect-select'),
        icon = root.querySelector('.MuiSelect-icon');
      const help = fc.querySelector('.MuiFormHelperText-root');
      const rel = el => {
        const b = el.getBoundingClientRect();
        return `x${Math.round(b.left - r.left)} y${(b.top - r.top).toFixed(1)}-${(b.bottom - r.top).toFixed(1)}`;
      };
      const ls = lab && getComputedStyle(lab),
        is = inp && getComputedStyle(inp);
      return [
        {
          label: lab?.textContent?.slice(0, 24),
          variant,
          state: root.className.match(/Mui-(focused|disabled|error|readOnly)|sizeSmall|multiline/g)?.join(','),
          root: `h${r.height.toFixed(1)} radius ${cs.borderRadius} pad ${cs.padding} bg ${cs.backgroundColor}`,
          lab: lab && `${rel(lab)} ${ls.transform} ${ls.color}${lab.classList.contains('MuiInputLabel-shrink') ? ' shrink' : ''}${lab.scrollWidth > lab.clientWidth ? ' ELLIPSIS' : ''}`,
          inp: inp && `${rel(inp)} pad ${is.padding} color ${is.color} fill ${is.webkitTextFillColor}`,
          // Filled fields draw their border as an inset box-shadow (`edge()`); outlined ones in the notch.
          border: notch
            ? `notch ${notch.borderWidth} ${notch.borderColor} legend ${getComputedStyle(notchEl.querySelector('legend')).maxWidth}`
            : `shadow ${cs.boxShadow}`,
          outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} offset ${cs.outlineOffset}`,
          chips: [...root.querySelectorAll('.MuiChip-root')].map(rel).join(' | ') || undefined,
          selectOverlapPx: sel && icon ? Math.round(sel.getBoundingClientRect().right - parseFloat(getComputedStyle(sel).paddingRight) - icon.getBoundingClientRect().left) : undefined,
          helper: help && `${rel(help)} ${getComputedStyle(help).color}`,
        },
      ];
    })
  );
  console.log(`## ${id}`);
  rows.forEach(row => console.log(JSON.stringify(row)));
}
await browser.close();
