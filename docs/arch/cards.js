/**
 * arch/cards.js — HTML templates for each architecture node card
 * (App / wrapper / widget / view). Attaches NS.card to window.ArchGraph.
 */
window.ArchGraph = window.ArchGraph || {};
(function (NS) {
  'use strict';

  /**
   * Inner HTML for a node card.
   * @param n - a model node {kind, data, ...}
   * @param expanded - Set of expanded L3 node ids (drives chip highlight)
   */
  NS.card = function (n, expanded) {
    if (n.kind === 'app') return appCard(n.data);
    if (n.kind === 'wrapper') return wrapperCard(n, expanded);
    if (n.kind === 'widget') return widgetCard(n.data);
    if (n.kind === 'binding') return bindingCard(n.data);
    return viewCard(n.data);
  };

  function appCard(a) {
    return (
      '<div class="card c1">' +
      '<div class="ttl">' +
      esc(a.file.split('/').pop()) +
      '</div>' +
      '<div class="path">' +
      esc(a.file) +
      '</div>' +
      '<div class="meta-row">' +
      pill(a.routeCount + ' routes') +
      pill(a.protectedCount + ' protected') +
      pill(a.publicCount + ' public') +
      '</div>' +
      '<div class="lbl">app shell</div>' +
      '<div class="shell">' +
      a.shell.map(tag).join('') +
      '</div>' +
      '</div>'
    );
  }

  function wrapperCard(n, expanded) {
    const w = n.data;
    const structural = w.widgets.filter(x => x.structural);
    const optional = w.widgets.filter(x => !x.structural);
    return (
      '<div class="card c2">' +
      '<div class="ttl">' +
      esc(w.name) +
      '</div>' +
      '<div class="path">' +
      esc(w.file) +
      '</div>' +
      '<div class="summary">' +
      esc(w.summary) +
      '</div>' +
      '<div class="lbl">always on</div>' +
      '<ul class="on-list">' +
      w.alwaysOn.map(s => '<li>' + esc(s) + '</li>').join('') +
      '</ul>' +
      chipSection(n, expanded, 'structural slots — every view fills these', structural) +
      chipSection(n, expanded, 'opt-in widgets — click to expand', optional) +
      '</div>'
    );
  }

  /** A labelled row of widget chips, only emitted when non-empty. */
  function chipSection(n, expanded, label, widgets) {
    if (!widgets.length) return '';
    const chips = widgets
      .map(function (x) {
        const on = expanded.has(n.id + '::' + x.key) ? ' on' : '';
        const sx = x.structural ? ' structural' : '';
        return (
          '<button class="chip' +
          on +
          sx +
          '" data-key="' +
          esc(x.key) +
          '">' +
          esc(x.key) +
          '</button>'
        );
      })
      .join('');
    return '<div class="lbl">' + esc(label) + '</div><div class="chips">' + chips + '</div>';
  }

  function widgetCard(x) {
    const used =
      x.usedBy && x.usedBy.length
        ? x.usedBy.map(tag).join('')
        : '<span class="none">not detected in any view</span>';
    return (
      '<div class="card c3">' +
      '<div class="ttl mono">' +
      esc(x.key) +
      '</div>' +
      '<div class="type">' +
      esc(x.type) +
      '</div>' +
      '<div class="desc">' +
      esc(x.desc) +
      '</div>' +
      '<div class="lbl">used by</div>' +
      '<div class="shell">' +
      used +
      '</div>' +
      '</div>'
    );
  }

  function bindingCard(b) {
    const fileLine = b.file ? '<div class="path">' + esc(b.file) + '</div>' : '';
    return (
      '<div class="card c5">' +
      '<div class="ttl mono">' +
      esc(b.value) +
      '</div>' +
      '<div class="kind kind-' +
      esc(b.kind) +
      '">' +
      esc(b.kind) +
      '</div>' +
      fileLine +
      '<div class="for-view">→ ' +
      esc(b.viewId) +
      '</div>' +
      '</div>'
    );
  }

  function viewCard(v) {
    const routes = v.routes
      .map(r => '<span class="rt">' + esc(r.path) + (r.protected ? '' : ' · public') + '</span>')
      .join('');
    const via = v.wrapperId ? 'renders ' + v.wrapperId : 'leaf — renders no generic wrapper';
    return (
      '<div class="card c4">' +
      '<div class="ttl">' +
      esc(v.name) +
      '</div>' +
      '<div class="path">' +
      esc(v.file) +
      '</div>' +
      '<div class="routes">' +
      routes +
      '</div>' +
      '<div class="via">' +
      esc(via) +
      '</div>' +
      '</div>'
    );
  }

  function pill(t) {
    return '<span class="pill">' + esc(t) + '</span>';
  }
  function tag(t) {
    return '<span class="sx">' + esc(t) + '</span>';
  }
  function esc(s) {
    return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  }
})(window.ArchGraph);
