/**
 * arch/model.js — builds the node/edge graph from window.ARCH_DATA and lays it
 * out as four top-down layers. Attaches buildModel + layout to window.ArchGraph.
 *
 * Layers: L1 App root, L2 generic wrappers, L3 opt-in widgets (hidden until
 * expanded), L4 feature views. L2 -> L4 edges visibly skip the L3 rank.
 */
window.ArchGraph = window.ArchGraph || {};
(function (NS) {
  'use strict';

  // ---- layout constants (px) ----
  const CARD_W = { 1: 300, 2: 340, 3: 244, 4: 220 };
  const CARD_H = { 1: 192, 2: 374, 3: 198, 4: 150 };
  const COL_GAP = 26; // horizontal gap between L4 cards
  const WIDGET_GAP = 16; // horizontal gap between expanded L3 cards
  const BAND_GAP = 92; // vertical gap between layer bands
  const MARGIN = 48;

  /**
   * Build the full node + edge model. L3 widget nodes are created here but
   * shown only once their id is expanded.
   * @returns {{nodes:object[], edges:object[], byId:Map<string,object>}}
   */
  NS.buildModel = function (data) {
    const nodes = [{ id: 'app', layer: 1, kind: 'app', parent: null, data: data.app }];
    for (const w of data.wrappers)
      nodes.push({ id: w.id, layer: 2, kind: 'wrapper', parent: 'app', data: w });
    for (const v of data.views)
      nodes.push({ id: v.id, layer: 4, kind: 'view', parent: v.wrapperId || 'app', data: v });
    for (const w of data.wrappers)
      for (const widget of w.widgets)
        nodes.push({
          id: w.id + '::' + widget.key,
          layer: 3,
          kind: 'widget',
          parent: w.id,
          data: widget,
        });
    const byId = new Map(nodes.map(n => [n.id, n]));
    const edges = nodes
      .filter(n => n.parent)
      .map(n => ({ id: n.parent + '->' + n.id, from: n.parent, to: n.id, layer: n.layer }));
    return { nodes, edges, byId };
  };

  /**
   * Position every visible node. L3 widget nodes are included only when their
   * id is in `expanded`.
   * @returns {{visible:object[], box:{x:number,y:number,w:number,h:number}}}
   */
  NS.layout = function (model, expanded) {
    const vis = model.nodes.filter(n => n.layer !== 3 || expanded.has(n.id));
    const l2 = vis.filter(n => n.layer === 2);
    const l3 = vis.filter(n => n.layer === 3);
    const l4 = vis.filter(n => n.layer === 4);
    const app = model.byId.get('app');

    // L4 — spread evenly, bucketed by parent so siblings sit together.
    l4.sort((a, b) => bucket(a) - bucket(b) || a.id.localeCompare(b.id));
    l4.forEach((n, i) => {
      n.w = CARD_W[4];
      n.x = MARGIN + i * (CARD_W[4] + COL_GAP);
    });
    // L2 — centred over their view children (fallback: own slot).
    l2.forEach((n, i) => {
      n.w = CARD_W[2];
      const kids = l4.filter(c => c.parent === n.id);
      n.x = centre(kids, CARD_W[2]) ?? MARGIN + i * (CARD_W[2] + COL_GAP);
    });
    // L1 — centred over the wrappers.
    app.w = CARD_W[1];
    app.x = centre(l2, CARD_W[1]) ?? MARGIN;
    // L3 — expanded widgets, centred under their wrapper.
    for (const [pid, kids] of groupBy(l3, n => n.parent)) {
      const p = model.byId.get(pid);
      const span = kids.length * CARD_W[3] + (kids.length - 1) * WIDGET_GAP;
      let x = p.x + CARD_W[2] / 2 - span / 2;
      for (const k of kids) {
        k.w = CARD_W[3];
        k.x = x;
        x += CARD_W[3] + WIDGET_GAP;
      }
    }
    // Y bands — the L3 band collapses to nothing when no widget is expanded.
    const y1 = MARGIN;
    const y2 = y1 + CARD_H[1] + BAND_GAP;
    const y3 = y2 + CARD_H[2] + BAND_GAP;
    const y4 = l3.length ? y3 + CARD_H[3] + BAND_GAP : y2 + CARD_H[2] + BAND_GAP;
    app.y = y1;
    l2.forEach(n => (n.y = y2));
    l3.forEach(n => (n.y = y3));
    l4.forEach(n => (n.y = y4));
    vis.forEach(n => (n.h = CARD_H[n.layer]));

    const minX = Math.min(...vis.map(n => n.x));
    const maxX = Math.max(...vis.map(n => n.x + n.w));
    const maxY = Math.max(...vis.map(n => n.y + n.h));
    return { visible: vis, box: { x: minX, y: app.y, w: maxX - minX, h: maxY - app.y } };
  };

  // ---- helpers ----
  /** Centre offset so a width-`w` box sits over the extent of `group`. */
  function centre(group, w) {
    if (!group.length) return null;
    const lo = Math.min(...group.map(n => n.x));
    const hi = Math.max(...group.map(n => n.x + n.w));
    return (lo + hi) / 2 - w / 2;
  }
  /** Group a list into a Map keyed by `keyFn`. */
  function groupBy(list, keyFn) {
    const m = new Map();
    for (const x of list) {
      const k = keyFn(x);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(x);
    }
    return m;
  }
  /** L4 ordering bucket: data-view children, then details children, then leaves. */
  function bucket(n) {
    if (n.parent === 'app') return 9;
    return n.parent === 'GenericDataViewPage' ? 0 : 1;
  }
})(window.ArchGraph);
