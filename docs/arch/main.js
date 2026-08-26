/**
 * arch/main.js — boots the architecture doc: builds the model, wires zoom/pan
 * and the widget expand/collapse interaction, renders and fits each frame.
 */
(function () {
  'use strict';
  const NS = window.ArchGraph;
  const data = window.ARCH_DATA;
  const meta = document.getElementById('meta');
  const stamp = document.getElementById('genstamp');

  if (!data) {
    meta.textContent = 'architecture-data.js missing or empty — run: npm run gen:arch';
    return;
  }

  let model;
  try {
    model = NS.buildModel(data);
  } catch (err) {
    meta.textContent = 'architecture-data.js is malformed — ' + err.message;
    return;
  }
  const expanded = new Set();

  const svg = d3.select('#canvas');
  const viewport = d3.select('#viewport');
  const zoom = d3
    .zoom()
    .scaleExtent([0.2, 2.5])
    .on('zoom', e => viewport.attr('transform', e.transform));
  svg.call(zoom);

  meta.innerHTML =
    '<b>' +
    data.app.routeCount +
    '</b> routes &middot; <b>' +
    data.views.length +
    '</b> feature views &middot; <b>' +
    data.wrappers.length +
    '</b> generic wrappers';
  stamp.textContent = 'generated ' + new Date(data.generatedAt).toLocaleString();

  let lastBox = null;

  /** Render the current frame; optionally re-fit the viewport to it. */
  function draw(refit) {
    const frame = NS.layout(model, expanded);
    lastBox = frame.box;
    NS.render(viewport, model, frame, expanded, onToggle);
    if (refit) fit();
  }

  /** Toggle one L3 widget node open/closed, then re-render and re-fit. */
  function onToggle(widgetNodeId) {
    if (expanded.has(widgetNodeId)) expanded.delete(widgetNodeId);
    else expanded.add(widgetNodeId);
    draw(true);
  }

  /**
   * Centre and scale the graph to fit the canvas. Uses the layout's computed
   * box — not live getBBox — so a fit fired mid-transition still targets the
   * final extent.
   */
  function fit() {
    const sw = svg.node().clientWidth;
    const sh = svg.node().clientHeight;
    if (!lastBox || !sw || !sh) return;
    const { x, y, w, h } = lastBox;
    const k = Math.min(sw / (w + 80), sh / (h + 80), 1.4);
    const tx = (sw - w * k) / 2 - x * k;
    const ty = (sh - h * k) / 2 - y * k;
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
  }

  try {
    draw(true);
  } catch (err) {
    meta.textContent = 'could not render the architecture graph — ' + err.message;
    return;
  }
  window.addEventListener('resize', fit);
})();
