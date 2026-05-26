/**
 * arch/render.js — draws the architecture graph with D3: SVG edges plus HTML
 * cards inside <foreignObject> nodes, with enter/update/exit transitions.
 * Attaches NS.render to window.ArchGraph.
 */
window.ArchGraph = window.ArchGraph || {};
(function (NS) {
  'use strict';

  const DUR = 420; // transition duration (ms)

  /**
   * Render one frame into the viewport <g>.
   * @param root - d3 selection of <g id="viewport">
   * @param model - {nodes, edges, byId}
   * @param frame - {visible} from NS.layout
   * @param expanded - Set of expanded L3 node ids
   * @param onToggle - (widgetNodeId: string) => void, fired by widget chips
   */
  NS.render = function (root, model, frame, expanded, onToggle) {
    const visIds = new Set(frame.visible.map(n => n.id));
    drawEdges(sublayer(root, 'edges'), model, visIds);
    if (showCrossEdges()) drawCrossEdges(sublayer(root, 'cross-edges'), model, visIds);
    else sublayer(root, 'cross-edges').selectAll('*').remove();
    drawNodes(sublayer(root, 'nodes'), frame.visible, expanded, onToggle);
  };

  /** L5 binding → L4 view cross-edges default on; disable with `?bindings=off`. */
  function showCrossEdges() {
    const p = new URLSearchParams(window.location.search);
    return p.get('bindings') !== 'off';
  }

  /** Get-or-create a named child <g> of the viewport. */
  function sublayer(root, cls) {
    let g = root.select('g.' + cls);
    if (g.empty()) g = root.append('g').attr('class', cls);
    return g;
  }

  function drawEdges(g, model, visIds) {
    const edges = model.edges.filter(e => visIds.has(e.from) && visIds.has(e.to));
    const sel = g.selectAll('path.edge').data(edges, e => e.id);
    sel.exit().transition().duration(DUR).style('opacity', 0).remove();
    sel
      .enter()
      .append('path')
      .attr('class', e => 'edge edge-l' + e.layer)
      .attr('d', e => edgePath(model.byId.get(e.from), model.byId.get(e.to)))
      .style('opacity', 0)
      .merge(sel)
      .transition()
      .duration(DUR)
      .style('opacity', 1)
      .attr('d', e => edgePath(model.byId.get(e.from), model.byId.get(e.to)));
  }

  /** Dashed binding → view cross-edges; idempotent with the same enter/exit pattern. */
  function drawCrossEdges(g, model, visIds) {
    const links = [];
    for (const n of model.nodes) {
      if (n.layer !== 5 || !visIds.has(n.id)) continue;
      const view = model.byId.get(n.data.viewId);
      if (view && visIds.has(view.id)) links.push({ id: n.id + '~' + view.id, from: n, to: view });
    }
    const sel = g.selectAll('path.edge-bind').data(links, e => e.id);
    sel.exit().transition().duration(DUR).style('opacity', 0).remove();
    sel
      .enter()
      .append('path')
      .attr('class', 'edge edge-bind')
      .attr('d', e => edgePath(e.from, e.to))
      .style('opacity', 0)
      .merge(sel)
      .transition()
      .duration(DUR)
      .style('opacity', 1)
      .attr('d', e => edgePath(e.from, e.to));
  }

  function drawNodes(g, visible, expanded, onToggle) {
    const sel = g.selectAll('g.node').data(visible, n => n.id);
    sel.exit().transition().duration(DUR).style('opacity', 0).remove();
    const entered = sel
      .enter()
      .append('g')
      .attr('class', n => 'node node-l' + n.layer)
      .attr('transform', xf)
      .style('opacity', 0);
    entered.append('foreignObject');
    entered
      .merge(sel)
      .each(function (n) {
        d3.select(this)
          .select('foreignObject')
          .attr('width', n.w)
          .attr('height', n.h)
          .html(NS.card(n, expanded));
        wireChips(this, n, onToggle);
      })
      .transition()
      .duration(DUR)
      .style('opacity', 1)
      .attr('transform', xf);
  }

  /** Attach click handlers to a wrapper card's widget chips. */
  function wireChips(gEl, n, onToggle) {
    if (n.kind !== 'wrapper') return;
    d3.select(gEl)
      .selectAll('button.chip')
      .on('click', function () {
        onToggle(n.id + '::' + this.dataset.key);
      });
  }

  /** SVG transform for a node's position. */
  function xf(n) {
    return 'translate(' + n.x + ',' + n.y + ')';
  }

  /** Cubic-bezier path from a parent card's bottom-centre to a child's top-centre. */
  function edgePath(a, b) {
    const sx = a.x + a.w / 2;
    const sy = a.y + a.h;
    const tx = b.x + b.w / 2;
    const ty = b.y;
    const my = (sy + ty) / 2;
    return 'M' + sx + ',' + sy + ' C' + sx + ',' + my + ' ' + tx + ',' + my + ' ' + tx + ',' + ty;
  }
})(window.ArchGraph);
