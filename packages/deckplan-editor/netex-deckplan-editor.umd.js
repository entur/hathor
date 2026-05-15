(function (_e, W) {
  typeof exports == 'object' && typeof module < 'u'
    ? (module.exports = W())
    : typeof define == 'function' && define.amd
      ? define(W)
      : ((_e = typeof globalThis < 'u' ? globalThis : _e || self),
        (_e['netex-deckplan-editor'] = W()));
})(this, function () {
  'use strict';
  function _e(e) {
    const t = Object.create(null);
    for (const r of e.split(',')) t[r] = 1;
    return r => r in t;
  }
  const W = process.env.NODE_ENV !== 'production' ? Object.freeze({}) : {},
    Nt = process.env.NODE_ENV !== 'production' ? Object.freeze([]) : [],
    Q = () => {},
    hi = () => !1,
    $t = e =>
      e.charCodeAt(0) === 111 &&
      e.charCodeAt(1) === 110 &&
      (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    br = e => e.startsWith('onUpdate:'),
    G = Object.assign,
    sn = (e, t) => {
      const r = e.indexOf(t);
      r > -1 && e.splice(r, 1);
    },
    Bs = Object.prototype.hasOwnProperty,
    F = (e, t) => Bs.call(e, t),
    V = Array.isArray,
    dt = e => _r(e) === '[object Map]',
    pi = e => _r(e) === '[object Set]',
    I = e => typeof e == 'function',
    Y = e => typeof e == 'string',
    Qe = e => typeof e == 'symbol',
    q = e => e !== null && typeof e == 'object',
    an = e => (q(e) || I(e)) && I(e.then) && I(e.catch),
    gi = Object.prototype.toString,
    _r = e => gi.call(e),
    cn = e => _r(e).slice(8, -1),
    yr = e => _r(e) === '[object Object]',
    ln = e => Y(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
    Dt = _e(
      ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
    ),
    qs = _e('bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo'),
    wr = e => {
      const t = Object.create(null);
      return r => t[r] || (t[r] = e(r));
    },
    Xs = /-\w/g,
    ue = wr(e => e.replace(Xs, t => t.slice(1).toUpperCase())),
    zs = /\B([A-Z])/g,
    ye = wr(e => e.replace(zs, '-$1').toLowerCase()),
    Er = wr(e => e.charAt(0).toUpperCase() + e.slice(1)),
    ft = wr(e => (e ? `on${Er(e)}` : '')),
    ht = (e, t) => !Object.is(e, t),
    Ft = (e, ...t) => {
      for (let r = 0; r < e.length; r++) e[r](...t);
    },
    Nr = (e, t, r, n = !1) => {
      Object.defineProperty(e, t, { configurable: !0, enumerable: !1, writable: n, value: r });
    },
    Ks = e => {
      const t = parseFloat(e);
      return isNaN(t) ? e : t;
    },
    mi = e => {
      const t = Y(e) ? Number(e) : NaN;
      return isNaN(t) ? e : t;
    };
  let vi;
  const jt = () =>
    vi ||
    (vi =
      typeof globalThis < 'u'
        ? globalThis
        : typeof self < 'u'
          ? self
          : typeof window < 'u'
            ? window
            : typeof global < 'u'
              ? global
              : {});
  function un(e) {
    if (V(e)) {
      const t = {};
      for (let r = 0; r < e.length; r++) {
        const n = e[r],
          i = Y(n) ? Zs(n) : un(n);
        if (i) for (const o in i) t[o] = i[o];
      }
      return t;
    } else if (Y(e) || q(e)) return e;
  }
  const Gs = /;(?![^(]*\))/g,
    Ys = /:([^]+)/,
    Js = /\/\*[^]*?\*\//g;
  function Zs(e) {
    const t = {};
    return (
      e
        .replace(Js, '')
        .split(Gs)
        .forEach(r => {
          if (r) {
            const n = r.split(Ys);
            n.length > 1 && (t[n[0].trim()] = n[1].trim());
          }
        }),
      t
    );
  }
  function xt(e) {
    let t = '';
    if (Y(e)) t = e;
    else if (V(e))
      for (let r = 0; r < e.length; r++) {
        const n = xt(e[r]);
        n && (t += n + ' ');
      }
    else if (q(e)) for (const r in e) e[r] && (t += r + ' ');
    return t.trim();
  }
  const Qs =
      'html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot',
    ea =
      'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view',
    ta =
      'annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics',
    ra = _e(Qs),
    na = _e(ea),
    ia = _e(ta),
    oa = _e('itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly');
  function bi(e) {
    return !!e || e === '';
  }
  const _i = e => !!(e && e.__v_isRef === !0),
    yi = e =>
      Y(e)
        ? e
        : e == null
          ? ''
          : V(e) || (q(e) && (e.toString === gi || !I(e.toString)))
            ? _i(e)
              ? yi(e.value)
              : JSON.stringify(e, wi, 2)
            : String(e),
    wi = (e, t) =>
      _i(t)
        ? wi(e, t.value)
        : dt(t)
          ? {
              [`Map(${t.size})`]: [...t.entries()].reduce(
                (r, [n, i], o) => ((r[dn(n, o) + ' =>'] = i), r),
                {}
              ),
            }
          : pi(t)
            ? { [`Set(${t.size})`]: [...t.values()].map(r => dn(r)) }
            : Qe(t)
              ? dn(t)
              : q(t) && !V(t) && !yr(t)
                ? String(t)
                : t,
    dn = (e, t = '') => {
      var r;
      return Qe(e) ? `Symbol(${(r = e.description) != null ? r : t})` : e;
    };
  function Oe(e, ...t) {
    console.warn(`[Vue warn] ${e}`, ...t);
  }
  let de;
  class sa {
    constructor(t = !1) {
      ((this.detached = t),
        (this._active = !0),
        (this._on = 0),
        (this.effects = []),
        (this.cleanups = []),
        (this._isPaused = !1),
        (this.parent = de),
        !t && de && (this.index = (de.scopes || (de.scopes = [])).push(this) - 1));
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = !0;
        let t, r;
        if (this.scopes) for (t = 0, r = this.scopes.length; t < r; t++) this.scopes[t].pause();
        for (t = 0, r = this.effects.length; t < r; t++) this.effects[t].pause();
      }
    }
    resume() {
      if (this._active && this._isPaused) {
        this._isPaused = !1;
        let t, r;
        if (this.scopes) for (t = 0, r = this.scopes.length; t < r; t++) this.scopes[t].resume();
        for (t = 0, r = this.effects.length; t < r; t++) this.effects[t].resume();
      }
    }
    run(t) {
      if (this._active) {
        const r = de;
        try {
          return ((de = this), t());
        } finally {
          de = r;
        }
      } else process.env.NODE_ENV !== 'production' && Oe('cannot run an inactive effect scope.');
    }
    on() {
      ++this._on === 1 && ((this.prevScope = de), (de = this));
    }
    off() {
      this._on > 0 && --this._on === 0 && ((de = this.prevScope), (this.prevScope = void 0));
    }
    stop(t) {
      if (this._active) {
        this._active = !1;
        let r, n;
        for (r = 0, n = this.effects.length; r < n; r++) this.effects[r].stop();
        for (this.effects.length = 0, r = 0, n = this.cleanups.length; r < n; r++)
          this.cleanups[r]();
        if (((this.cleanups.length = 0), this.scopes)) {
          for (r = 0, n = this.scopes.length; r < n; r++) this.scopes[r].stop(!0);
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !t) {
          const i = this.parent.scopes.pop();
          i && i !== this && ((this.parent.scopes[this.index] = i), (i.index = this.index));
        }
        this.parent = void 0;
      }
    }
  }
  function aa() {
    return de;
  }
  let B;
  const fn = new WeakSet();
  class Ei {
    constructor(t) {
      ((this.fn = t),
        (this.deps = void 0),
        (this.depsTail = void 0),
        (this.flags = 5),
        (this.next = void 0),
        (this.cleanup = void 0),
        (this.scheduler = void 0),
        de && de.active && de.effects.push(this));
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      this.flags & 64 && ((this.flags &= -65), fn.has(this) && (fn.delete(this), this.trigger()));
    }
    notify() {
      (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || xi(this);
    }
    run() {
      if (!(this.flags & 1)) return this.fn();
      ((this.flags |= 2), Ti(this), Si(this));
      const t = B,
        r = Ce;
      ((B = this), (Ce = !0));
      try {
        return this.fn();
      } finally {
        (process.env.NODE_ENV !== 'production' &&
          B !== this &&
          Oe('Active effect was not restored correctly - this is likely a Vue internal bug.'),
          Oi(this),
          (B = t),
          (Ce = r),
          (this.flags &= -3));
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let t = this.deps; t; t = t.nextDep) mn(t);
        ((this.deps = this.depsTail = void 0),
          Ti(this),
          this.onStop && this.onStop(),
          (this.flags &= -2));
      }
    }
    trigger() {
      this.flags & 64 ? fn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
    }
    runIfDirty() {
      gn(this) && this.run();
    }
    get dirty() {
      return gn(this);
    }
  }
  let Ni = 0,
    Ut,
    Ht;
  function xi(e, t = !1) {
    if (((e.flags |= 8), t)) {
      ((e.next = Ht), (Ht = e));
      return;
    }
    ((e.next = Ut), (Ut = e));
  }
  function hn() {
    Ni++;
  }
  function pn() {
    if (--Ni > 0) return;
    if (Ht) {
      let t = Ht;
      for (Ht = void 0; t; ) {
        const r = t.next;
        ((t.next = void 0), (t.flags &= -9), (t = r));
      }
    }
    let e;
    for (; Ut; ) {
      let t = Ut;
      for (Ut = void 0; t; ) {
        const r = t.next;
        if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
          try {
            t.trigger();
          } catch (n) {
            e || (e = n);
          }
        t = r;
      }
    }
    if (e) throw e;
  }
  function Si(e) {
    for (let t = e.deps; t; t = t.nextDep)
      ((t.version = -1), (t.prevActiveLink = t.dep.activeLink), (t.dep.activeLink = t));
  }
  function Oi(e) {
    let t,
      r = e.depsTail,
      n = r;
    for (; n; ) {
      const i = n.prevDep;
      (n.version === -1 ? (n === r && (r = i), mn(n), ca(n)) : (t = n),
        (n.dep.activeLink = n.prevActiveLink),
        (n.prevActiveLink = void 0),
        (n = i));
    }
    ((e.deps = t), (e.depsTail = r));
  }
  function gn(e) {
    for (let t = e.deps; t; t = t.nextDep)
      if (
        t.dep.version !== t.version ||
        (t.dep.computed && (Ci(t.dep.computed) || t.dep.version !== t.version))
      )
        return !0;
    return !!e._dirty;
  }
  function Ci(e) {
    if (
      (e.flags & 4 && !(e.flags & 16)) ||
      ((e.flags &= -17), e.globalVersion === Wt) ||
      ((e.globalVersion = Wt), !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !gn(e)))
    )
      return;
    e.flags |= 2;
    const t = e.dep,
      r = B,
      n = Ce;
    ((B = e), (Ce = !0));
    try {
      Si(e);
      const i = e.fn(e._value);
      (t.version === 0 || ht(i, e._value)) && ((e.flags |= 128), (e._value = i), t.version++);
    } catch (i) {
      throw (t.version++, i);
    } finally {
      ((B = r), (Ce = n), Oi(e), (e.flags &= -3));
    }
  }
  function mn(e, t = !1) {
    const { dep: r, prevSub: n, nextSub: i } = e;
    if (
      (n && ((n.nextSub = i), (e.prevSub = void 0)),
      i && ((i.prevSub = n), (e.nextSub = void 0)),
      process.env.NODE_ENV !== 'production' && r.subsHead === e && (r.subsHead = i),
      r.subs === e && ((r.subs = n), !n && r.computed))
    ) {
      r.computed.flags &= -5;
      for (let o = r.computed.deps; o; o = o.nextDep) mn(o, !0);
    }
    !t && !--r.sc && r.map && r.map.delete(r.key);
  }
  function ca(e) {
    const { prevDep: t, nextDep: r } = e;
    (t && ((t.nextDep = r), (e.prevDep = void 0)), r && ((r.prevDep = t), (e.nextDep = void 0)));
  }
  let Ce = !0;
  const ki = [];
  function ke() {
    (ki.push(Ce), (Ce = !1));
  }
  function Te() {
    const e = ki.pop();
    Ce = e === void 0 ? !0 : e;
  }
  function Ti(e) {
    const { cleanup: t } = e;
    if (((e.cleanup = void 0), t)) {
      const r = B;
      B = void 0;
      try {
        t();
      } finally {
        B = r;
      }
    }
  }
  let Wt = 0;
  class la {
    constructor(t, r) {
      ((this.sub = t),
        (this.dep = r),
        (this.version = r.version),
        (this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0));
    }
  }
  class Vi {
    constructor(t) {
      ((this.computed = t),
        (this.version = 0),
        (this.activeLink = void 0),
        (this.subs = void 0),
        (this.map = void 0),
        (this.key = void 0),
        (this.sc = 0),
        (this.__v_skip = !0),
        process.env.NODE_ENV !== 'production' && (this.subsHead = void 0));
    }
    track(t) {
      if (!B || !Ce || B === this.computed) return;
      let r = this.activeLink;
      if (r === void 0 || r.sub !== B)
        ((r = this.activeLink = new la(B, this)),
          B.deps
            ? ((r.prevDep = B.depsTail), (B.depsTail.nextDep = r), (B.depsTail = r))
            : (B.deps = B.depsTail = r),
          Ai(r));
      else if (r.version === -1 && ((r.version = this.version), r.nextDep)) {
        const n = r.nextDep;
        ((n.prevDep = r.prevDep),
          r.prevDep && (r.prevDep.nextDep = n),
          (r.prevDep = B.depsTail),
          (r.nextDep = void 0),
          (B.depsTail.nextDep = r),
          (B.depsTail = r),
          B.deps === r && (B.deps = n));
      }
      return (
        process.env.NODE_ENV !== 'production' && B.onTrack && B.onTrack(G({ effect: B }, t)),
        r
      );
    }
    trigger(t) {
      (this.version++, Wt++, this.notify(t));
    }
    notify(t) {
      hn();
      try {
        if (process.env.NODE_ENV !== 'production')
          for (let r = this.subsHead; r; r = r.nextSub)
            r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(G({ effect: r.sub }, t));
        for (let r = this.subs; r; r = r.prevSub) r.sub.notify() && r.sub.dep.notify();
      } finally {
        pn();
      }
    }
  }
  function Ai(e) {
    if ((e.dep.sc++, e.sub.flags & 4)) {
      const t = e.dep.computed;
      if (t && !e.dep.subs) {
        t.flags |= 20;
        for (let n = t.deps; n; n = n.nextDep) Ai(n);
      }
      const r = e.dep.subs;
      (r !== e && ((e.prevSub = r), r && (r.nextSub = e)),
        process.env.NODE_ENV !== 'production' && e.dep.subsHead === void 0 && (e.dep.subsHead = e),
        (e.dep.subs = e));
    }
  }
  const vn = new WeakMap(),
    pt = Symbol(process.env.NODE_ENV !== 'production' ? 'Object iterate' : ''),
    bn = Symbol(process.env.NODE_ENV !== 'production' ? 'Map keys iterate' : ''),
    Bt = Symbol(process.env.NODE_ENV !== 'production' ? 'Array iterate' : '');
  function ee(e, t, r) {
    if (Ce && B) {
      let n = vn.get(e);
      n || vn.set(e, (n = new Map()));
      let i = n.get(r);
      (i || (n.set(r, (i = new Vi())), (i.map = n), (i.key = r)),
        process.env.NODE_ENV !== 'production'
          ? i.track({ target: e, type: t, key: r })
          : i.track());
    }
  }
  function Me(e, t, r, n, i, o) {
    const a = vn.get(e);
    if (!a) {
      Wt++;
      return;
    }
    const s = c => {
      c &&
        (process.env.NODE_ENV !== 'production'
          ? c.trigger({ target: e, type: t, key: r, newValue: n, oldValue: i, oldTarget: o })
          : c.trigger());
    };
    if ((hn(), t === 'clear')) a.forEach(s);
    else {
      const c = V(e),
        f = c && ln(r);
      if (c && r === 'length') {
        const l = Number(n);
        a.forEach((u, p) => {
          (p === 'length' || p === Bt || (!Qe(p) && p >= l)) && s(u);
        });
      } else
        switch (((r !== void 0 || a.has(void 0)) && s(a.get(r)), f && s(a.get(Bt)), t)) {
          case 'add':
            c ? f && s(a.get('length')) : (s(a.get(pt)), dt(e) && s(a.get(bn)));
            break;
          case 'delete':
            c || (s(a.get(pt)), dt(e) && s(a.get(bn)));
            break;
          case 'set':
            dt(e) && s(a.get(pt));
            break;
        }
    }
    pn();
  }
  function St(e) {
    const t = R(e);
    return t === e ? t : (ee(t, 'iterate', Bt), fe(e) ? t : t.map(Ke));
  }
  function xr(e) {
    return (ee((e = R(e)), 'iterate', Bt), e);
  }
  function et(e, t) {
    return Re(e) ? (tt(e) ? Ot(Ke(t)) : Ot(t)) : Ke(t);
  }
  const ua = {
    __proto__: null,
    [Symbol.iterator]() {
      return _n(this, Symbol.iterator, e => et(this, e));
    },
    concat(...e) {
      return St(this).concat(...e.map(t => (V(t) ? St(t) : t)));
    },
    entries() {
      return _n(this, 'entries', e => ((e[1] = et(this, e[1])), e));
    },
    every(e, t) {
      return ze(this, 'every', e, t, void 0, arguments);
    },
    filter(e, t) {
      return ze(this, 'filter', e, t, r => r.map(n => et(this, n)), arguments);
    },
    find(e, t) {
      return ze(this, 'find', e, t, r => et(this, r), arguments);
    },
    findIndex(e, t) {
      return ze(this, 'findIndex', e, t, void 0, arguments);
    },
    findLast(e, t) {
      return ze(this, 'findLast', e, t, r => et(this, r), arguments);
    },
    findLastIndex(e, t) {
      return ze(this, 'findLastIndex', e, t, void 0, arguments);
    },
    forEach(e, t) {
      return ze(this, 'forEach', e, t, void 0, arguments);
    },
    includes(...e) {
      return yn(this, 'includes', e);
    },
    indexOf(...e) {
      return yn(this, 'indexOf', e);
    },
    join(e) {
      return St(this).join(e);
    },
    lastIndexOf(...e) {
      return yn(this, 'lastIndexOf', e);
    },
    map(e, t) {
      return ze(this, 'map', e, t, void 0, arguments);
    },
    pop() {
      return qt(this, 'pop');
    },
    push(...e) {
      return qt(this, 'push', e);
    },
    reduce(e, ...t) {
      return Ii(this, 'reduce', e, t);
    },
    reduceRight(e, ...t) {
      return Ii(this, 'reduceRight', e, t);
    },
    shift() {
      return qt(this, 'shift');
    },
    some(e, t) {
      return ze(this, 'some', e, t, void 0, arguments);
    },
    splice(...e) {
      return qt(this, 'splice', e);
    },
    toReversed() {
      return St(this).toReversed();
    },
    toSorted(e) {
      return St(this).toSorted(e);
    },
    toSpliced(...e) {
      return St(this).toSpliced(...e);
    },
    unshift(...e) {
      return qt(this, 'unshift', e);
    },
    values() {
      return _n(this, 'values', e => et(this, e));
    },
  };
  function _n(e, t, r) {
    const n = xr(e),
      i = n[t]();
    return (
      n !== e &&
        !fe(e) &&
        ((i._next = i.next),
        (i.next = () => {
          const o = i._next();
          return (o.done || (o.value = r(o.value)), o);
        })),
      i
    );
  }
  const da = Array.prototype;
  function ze(e, t, r, n, i, o) {
    const a = xr(e),
      s = a !== e && !fe(e),
      c = a[t];
    if (c !== da[t]) {
      const u = c.apply(e, o);
      return s ? Ke(u) : u;
    }
    let f = r;
    a !== e &&
      (s
        ? (f = function (u, p) {
            return r.call(this, et(e, u), p, e);
          })
        : r.length > 2 &&
          (f = function (u, p) {
            return r.call(this, u, p, e);
          }));
    const l = c.call(a, f, n);
    return s && i ? i(l) : l;
  }
  function Ii(e, t, r, n) {
    const i = xr(e);
    let o = r;
    return (
      i !== e &&
        (fe(e)
          ? r.length > 3 &&
            (o = function (a, s, c) {
              return r.call(this, a, s, c, e);
            })
          : (o = function (a, s, c) {
              return r.call(this, a, et(e, s), c, e);
            })),
      i[t](o, ...n)
    );
  }
  function yn(e, t, r) {
    const n = R(e);
    ee(n, 'iterate', Bt);
    const i = n[t](...r);
    return (i === -1 || i === !1) && Tr(r[0]) ? ((r[0] = R(r[0])), n[t](...r)) : i;
  }
  function qt(e, t, r = []) {
    (ke(), hn());
    const n = R(e)[t].apply(e, r);
    return (pn(), Te(), n);
  }
  const fa = _e('__proto__,__v_isRef,__isVue'),
    Pi = new Set(
      Object.getOwnPropertyNames(Symbol)
        .filter(e => e !== 'arguments' && e !== 'caller')
        .map(e => Symbol[e])
        .filter(Qe)
    );
  function ha(e) {
    Qe(e) || (e = String(e));
    const t = R(this);
    return (ee(t, 'has', e), t.hasOwnProperty(e));
  }
  class Mi {
    constructor(t = !1, r = !1) {
      ((this._isReadonly = t), (this._isShallow = r));
    }
    get(t, r, n) {
      if (r === '__v_skip') return t.__v_skip;
      const i = this._isReadonly,
        o = this._isShallow;
      if (r === '__v_isReactive') return !i;
      if (r === '__v_isReadonly') return i;
      if (r === '__v_isShallow') return o;
      if (r === '__v_raw')
        return n === (i ? (o ? Ui : ji) : o ? Fi : Di).get(t) ||
          Object.getPrototypeOf(t) === Object.getPrototypeOf(n)
          ? t
          : void 0;
      const a = V(t);
      if (!i) {
        let c;
        if (a && (c = ua[r])) return c;
        if (r === 'hasOwnProperty') return ha;
      }
      const s = Reflect.get(t, r, te(t) ? t : n);
      if ((Qe(r) ? Pi.has(r) : fa(r)) || (i || ee(t, 'get', r), o)) return s;
      if (te(s)) {
        const c = a && ln(r) ? s : s.value;
        return i && q(c) ? En(c) : c;
      }
      return q(s) ? (i ? En(s) : Xt(s)) : s;
    }
  }
  class Li extends Mi {
    constructor(t = !1) {
      super(!1, t);
    }
    set(t, r, n, i) {
      let o = t[r];
      const a = V(t) && ln(r);
      if (!this._isShallow) {
        const f = Re(o);
        if ((!fe(n) && !Re(n) && ((o = R(o)), (n = R(n))), !a && te(o) && !te(n)))
          return f
            ? (process.env.NODE_ENV !== 'production' &&
                Oe(`Set operation on key "${String(r)}" failed: target is readonly.`, t[r]),
              !0)
            : ((o.value = n), !0);
      }
      const s = a ? Number(r) < t.length : F(t, r),
        c = Reflect.set(t, r, n, te(t) ? t : i);
      return (t === R(i) && (s ? ht(n, o) && Me(t, 'set', r, n, o) : Me(t, 'add', r, n)), c);
    }
    deleteProperty(t, r) {
      const n = F(t, r),
        i = t[r],
        o = Reflect.deleteProperty(t, r);
      return (o && n && Me(t, 'delete', r, void 0, i), o);
    }
    has(t, r) {
      const n = Reflect.has(t, r);
      return ((!Qe(r) || !Pi.has(r)) && ee(t, 'has', r), n);
    }
    ownKeys(t) {
      return (ee(t, 'iterate', V(t) ? 'length' : pt), Reflect.ownKeys(t));
    }
  }
  class Ri extends Mi {
    constructor(t = !1) {
      super(!0, t);
    }
    set(t, r) {
      return (
        process.env.NODE_ENV !== 'production' &&
          Oe(`Set operation on key "${String(r)}" failed: target is readonly.`, t),
        !0
      );
    }
    deleteProperty(t, r) {
      return (
        process.env.NODE_ENV !== 'production' &&
          Oe(`Delete operation on key "${String(r)}" failed: target is readonly.`, t),
        !0
      );
    }
  }
  const pa = new Li(),
    ga = new Ri(),
    ma = new Li(!0),
    va = new Ri(!0),
    wn = e => e,
    Sr = e => Reflect.getPrototypeOf(e);
  function ba(e, t, r) {
    return function (...n) {
      const i = this.__v_raw,
        o = R(i),
        a = dt(o),
        s = e === 'entries' || (e === Symbol.iterator && a),
        c = e === 'keys' && a,
        f = i[e](...n),
        l = r ? wn : t ? Ot : Ke;
      return (
        !t && ee(o, 'iterate', c ? bn : pt),
        {
          next() {
            const { value: u, done: p } = f.next();
            return p ? { value: u, done: p } : { value: s ? [l(u[0]), l(u[1])] : l(u), done: p };
          },
          [Symbol.iterator]() {
            return this;
          },
        }
      );
    };
  }
  function Or(e) {
    return function (...t) {
      if (process.env.NODE_ENV !== 'production') {
        const r = t[0] ? `on key "${t[0]}" ` : '';
        Oe(`${Er(e)} operation ${r}failed: target is readonly.`, R(this));
      }
      return e === 'delete' ? !1 : e === 'clear' ? void 0 : this;
    };
  }
  function _a(e, t) {
    const r = {
      get(i) {
        const o = this.__v_raw,
          a = R(o),
          s = R(i);
        e || (ht(i, s) && ee(a, 'get', i), ee(a, 'get', s));
        const { has: c } = Sr(a),
          f = t ? wn : e ? Ot : Ke;
        if (c.call(a, i)) return f(o.get(i));
        if (c.call(a, s)) return f(o.get(s));
        o !== a && o.get(i);
      },
      get size() {
        const i = this.__v_raw;
        return (!e && ee(R(i), 'iterate', pt), i.size);
      },
      has(i) {
        const o = this.__v_raw,
          a = R(o),
          s = R(i);
        return (
          e || (ht(i, s) && ee(a, 'has', i), ee(a, 'has', s)),
          i === s ? o.has(i) : o.has(i) || o.has(s)
        );
      },
      forEach(i, o) {
        const a = this,
          s = a.__v_raw,
          c = R(s),
          f = t ? wn : e ? Ot : Ke;
        return (!e && ee(c, 'iterate', pt), s.forEach((l, u) => i.call(o, f(l), f(u), a)));
      },
    };
    return (
      G(
        r,
        e
          ? { add: Or('add'), set: Or('set'), delete: Or('delete'), clear: Or('clear') }
          : {
              add(i) {
                !t && !fe(i) && !Re(i) && (i = R(i));
                const o = R(this);
                return (Sr(o).has.call(o, i) || (o.add(i), Me(o, 'add', i, i)), this);
              },
              set(i, o) {
                !t && !fe(o) && !Re(o) && (o = R(o));
                const a = R(this),
                  { has: s, get: c } = Sr(a);
                let f = s.call(a, i);
                f
                  ? process.env.NODE_ENV !== 'production' && $i(a, s, i)
                  : ((i = R(i)), (f = s.call(a, i)));
                const l = c.call(a, i);
                return (
                  a.set(i, o),
                  f ? ht(o, l) && Me(a, 'set', i, o, l) : Me(a, 'add', i, o),
                  this
                );
              },
              delete(i) {
                const o = R(this),
                  { has: a, get: s } = Sr(o);
                let c = a.call(o, i);
                c
                  ? process.env.NODE_ENV !== 'production' && $i(o, a, i)
                  : ((i = R(i)), (c = a.call(o, i)));
                const f = s ? s.call(o, i) : void 0,
                  l = o.delete(i);
                return (c && Me(o, 'delete', i, void 0, f), l);
              },
              clear() {
                const i = R(this),
                  o = i.size !== 0,
                  a =
                    process.env.NODE_ENV !== 'production'
                      ? dt(i)
                        ? new Map(i)
                        : new Set(i)
                      : void 0,
                  s = i.clear();
                return (o && Me(i, 'clear', void 0, void 0, a), s);
              },
            }
      ),
      ['keys', 'values', 'entries', Symbol.iterator].forEach(i => {
        r[i] = ba(i, e, t);
      }),
      r
    );
  }
  function Cr(e, t) {
    const r = _a(e, t);
    return (n, i, o) =>
      i === '__v_isReactive'
        ? !e
        : i === '__v_isReadonly'
          ? e
          : i === '__v_raw'
            ? n
            : Reflect.get(F(r, i) && i in n ? r : n, i, o);
  }
  const ya = { get: Cr(!1, !1) },
    wa = { get: Cr(!1, !0) },
    Ea = { get: Cr(!0, !1) },
    Na = { get: Cr(!0, !0) };
  function $i(e, t, r) {
    const n = R(r);
    if (n !== r && t.call(e, n)) {
      const i = cn(e);
      Oe(
        `Reactive ${i} contains both the raw and reactive versions of the same object${i === 'Map' ? ' as keys' : ''}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
      );
    }
  }
  const Di = new WeakMap(),
    Fi = new WeakMap(),
    ji = new WeakMap(),
    Ui = new WeakMap();
  function xa(e) {
    switch (e) {
      case 'Object':
      case 'Array':
        return 1;
      case 'Map':
      case 'Set':
      case 'WeakMap':
      case 'WeakSet':
        return 2;
      default:
        return 0;
    }
  }
  function Sa(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : xa(cn(e));
  }
  function Xt(e) {
    return Re(e) ? e : kr(e, !1, pa, ya, Di);
  }
  function Oa(e) {
    return kr(e, !1, ma, wa, Fi);
  }
  function En(e) {
    return kr(e, !0, ga, Ea, ji);
  }
  function Le(e) {
    return kr(e, !0, va, Na, Ui);
  }
  function kr(e, t, r, n, i) {
    if (!q(e))
      return (
        process.env.NODE_ENV !== 'production' &&
          Oe(`value cannot be made ${t ? 'readonly' : 'reactive'}: ${String(e)}`),
        e
      );
    if (e.__v_raw && !(t && e.__v_isReactive)) return e;
    const o = Sa(e);
    if (o === 0) return e;
    const a = i.get(e);
    if (a) return a;
    const s = new Proxy(e, o === 2 ? n : r);
    return (i.set(e, s), s);
  }
  function tt(e) {
    return Re(e) ? tt(e.__v_raw) : !!(e && e.__v_isReactive);
  }
  function Re(e) {
    return !!(e && e.__v_isReadonly);
  }
  function fe(e) {
    return !!(e && e.__v_isShallow);
  }
  function Tr(e) {
    return e ? !!e.__v_raw : !1;
  }
  function R(e) {
    const t = e && e.__v_raw;
    return t ? R(t) : e;
  }
  function Ca(e) {
    return (!F(e, '__v_skip') && Object.isExtensible(e) && Nr(e, '__v_skip', !0), e);
  }
  const Ke = e => (q(e) ? Xt(e) : e),
    Ot = e => (q(e) ? En(e) : e);
  function te(e) {
    return e ? e.__v_isRef === !0 : !1;
  }
  function Hi(e) {
    return te(e) ? e.value : e;
  }
  const ka = {
    get: (e, t, r) => (t === '__v_raw' ? e : Hi(Reflect.get(e, t, r))),
    set: (e, t, r, n) => {
      const i = e[t];
      return te(i) && !te(r) ? ((i.value = r), !0) : Reflect.set(e, t, r, n);
    },
  };
  function Wi(e) {
    return tt(e) ? e : new Proxy(e, ka);
  }
  class Ta {
    constructor(t, r, n) {
      ((this.fn = t),
        (this.setter = r),
        (this._value = void 0),
        (this.dep = new Vi(this)),
        (this.__v_isRef = !0),
        (this.deps = void 0),
        (this.depsTail = void 0),
        (this.flags = 16),
        (this.globalVersion = Wt - 1),
        (this.next = void 0),
        (this.effect = this),
        (this.__v_isReadonly = !r),
        (this.isSSR = n));
    }
    notify() {
      if (((this.flags |= 16), !(this.flags & 8) && B !== this)) return (xi(this, !0), !0);
      process.env.NODE_ENV;
    }
    get value() {
      const t =
        process.env.NODE_ENV !== 'production'
          ? this.dep.track({ target: this, type: 'get', key: 'value' })
          : this.dep.track();
      return (Ci(this), t && (t.version = this.dep.version), this._value);
    }
    set value(t) {
      this.setter
        ? this.setter(t)
        : process.env.NODE_ENV !== 'production' &&
          Oe('Write operation failed: computed value is readonly');
    }
  }
  function Va(e, t, r = !1) {
    let n, i;
    I(e) ? (n = e) : ((n = e.get), (i = e.set));
    const o = new Ta(n, i, r);
    return (process.env.NODE_ENV, o);
  }
  const Vr = {},
    Ar = new WeakMap();
  let gt;
  function Aa(e, t = !1, r = gt) {
    if (r) {
      let n = Ar.get(r);
      (n || Ar.set(r, (n = [])), n.push(e));
    } else
      process.env.NODE_ENV !== 'production' &&
        !t &&
        Oe('onWatcherCleanup() was called when there was no active watcher to associate with.');
  }
  function Ia(e, t, r = W) {
    const { immediate: n, deep: i, once: o, scheduler: a, augmentJob: s, call: c } = r,
      f = k => {
        (r.onWarn || Oe)(
          'Invalid watch source: ',
          k,
          'A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.'
        );
      },
      l = k => (i ? k : fe(k) || i === !1 || i === 0 ? rt(k, 1) : rt(k));
    let u,
      p,
      m,
      C,
      N = !1,
      L = !1;
    if (
      (te(e)
        ? ((p = () => e.value), (N = fe(e)))
        : tt(e)
          ? ((p = () => l(e)), (N = !0))
          : V(e)
            ? ((L = !0),
              (N = e.some(k => tt(k) || fe(k))),
              (p = () =>
                e.map(k => {
                  if (te(k)) return k.value;
                  if (tt(k)) return l(k);
                  if (I(k)) return c ? c(k, 2) : k();
                  process.env.NODE_ENV !== 'production' && f(k);
                })))
            : I(e)
              ? t
                ? (p = c ? () => c(e, 2) : e)
                : (p = () => {
                    if (m) {
                      ke();
                      try {
                        m();
                      } finally {
                        Te();
                      }
                    }
                    const k = gt;
                    gt = u;
                    try {
                      return c ? c(e, 3, [C]) : e(C);
                    } finally {
                      gt = k;
                    }
                  })
              : ((p = Q), process.env.NODE_ENV !== 'production' && f(e)),
      t && i)
    ) {
      const k = p,
        z = i === !0 ? 1 / 0 : i;
      p = () => rt(k(), z);
    }
    const $ = aa(),
      P = () => {
        (u.stop(), $ && $.active && sn($.effects, u));
      };
    if (o && t) {
      const k = t;
      t = (...z) => {
        (k(...z), P());
      };
    }
    let D = L ? new Array(e.length).fill(Vr) : Vr;
    const Z = k => {
      if (!(!(u.flags & 1) || (!u.dirty && !k)))
        if (t) {
          const z = u.run();
          if (i || N || (L ? z.some((ie, oe) => ht(ie, D[oe])) : ht(z, D))) {
            m && m();
            const ie = gt;
            gt = u;
            try {
              const oe = [z, D === Vr ? void 0 : L && D[0] === Vr ? [] : D, C];
              ((D = z), c ? c(t, 3, oe) : t(...oe));
            } finally {
              gt = ie;
            }
          }
        } else u.run();
    };
    return (
      s && s(Z),
      (u = new Ei(p)),
      (u.scheduler = a ? () => a(Z, !1) : Z),
      (C = k => Aa(k, !1, u)),
      (m = u.onStop =
        () => {
          const k = Ar.get(u);
          if (k) {
            if (c) c(k, 4);
            else for (const z of k) z();
            Ar.delete(u);
          }
        }),
      process.env.NODE_ENV !== 'production' &&
        ((u.onTrack = r.onTrack), (u.onTrigger = r.onTrigger)),
      t ? (n ? Z(!0) : (D = u.run())) : a ? a(Z.bind(null, !0), !0) : u.run(),
      (P.pause = u.pause.bind(u)),
      (P.resume = u.resume.bind(u)),
      (P.stop = P),
      P
    );
  }
  function rt(e, t = 1 / 0, r) {
    if (t <= 0 || !q(e) || e.__v_skip || ((r = r || new Map()), (r.get(e) || 0) >= t)) return e;
    if ((r.set(e, t), t--, te(e))) rt(e.value, t, r);
    else if (V(e)) for (let n = 0; n < e.length; n++) rt(e[n], t, r);
    else if (pi(e) || dt(e))
      e.forEach(n => {
        rt(n, t, r);
      });
    else if (yr(e)) {
      for (const n in e) rt(e[n], t, r);
      for (const n of Object.getOwnPropertySymbols(e))
        Object.prototype.propertyIsEnumerable.call(e, n) && rt(e[n], t, r);
    }
    return e;
  }
  const mt = [];
  function Ir(e) {
    mt.push(e);
  }
  function Pr() {
    mt.pop();
  }
  let Nn = !1;
  function x(e, ...t) {
    if (Nn) return;
    ((Nn = !0), ke());
    const r = mt.length ? mt[mt.length - 1].component : null,
      n = r && r.appContext.config.warnHandler,
      i = Pa();
    if (n)
      Ct(n, r, 11, [
        e +
          t
            .map(o => {
              var a, s;
              return (s = (a = o.toString) == null ? void 0 : a.call(o)) != null
                ? s
                : JSON.stringify(o);
            })
            .join(''),
        r && r.proxy,
        i.map(({ vnode: o }) => `at <${lr(r, o.type)}>`).join(`
`),
        i,
      ]);
    else {
      const o = [`[Vue warn]: ${e}`, ...t];
      (i.length &&
        o.push(
          `
`,
          ...Ma(i)
        ),
        console.warn(...o));
    }
    (Te(), (Nn = !1));
  }
  function Pa() {
    let e = mt[mt.length - 1];
    if (!e) return [];
    const t = [];
    for (; e; ) {
      const r = t[0];
      r && r.vnode === e ? r.recurseCount++ : t.push({ vnode: e, recurseCount: 0 });
      const n = e.component && e.component.parent;
      e = n && n.vnode;
    }
    return t;
  }
  function Ma(e) {
    const t = [];
    return (
      e.forEach((r, n) => {
        t.push(
          ...(n === 0
            ? []
            : [
                `
`,
              ]),
          ...La(r)
        );
      }),
      t
    );
  }
  function La({ vnode: e, recurseCount: t }) {
    const r = t > 0 ? `... (${t} recursive calls)` : '',
      n = e.component ? e.component.parent == null : !1,
      i = ` at <${lr(e.component, e.type, n)}`,
      o = '>' + r;
    return e.props ? [i, ...Ra(e.props), o] : [i + o];
  }
  function Ra(e) {
    const t = [],
      r = Object.keys(e);
    return (
      r.slice(0, 3).forEach(n => {
        t.push(...Bi(n, e[n]));
      }),
      r.length > 3 && t.push(' ...'),
      t
    );
  }
  function Bi(e, t, r) {
    return Y(t)
      ? ((t = JSON.stringify(t)), r ? t : [`${e}=${t}`])
      : typeof t == 'number' || typeof t == 'boolean' || t == null
        ? r
          ? t
          : [`${e}=${t}`]
        : te(t)
          ? ((t = Bi(e, R(t.value), !0)), r ? t : [`${e}=Ref<`, t, '>'])
          : I(t)
            ? [`${e}=fn${t.name ? `<${t.name}>` : ''}`]
            : ((t = R(t)), r ? t : [`${e}=`, t]);
  }
  const xn = {
    sp: 'serverPrefetch hook',
    bc: 'beforeCreate hook',
    c: 'created hook',
    bm: 'beforeMount hook',
    m: 'mounted hook',
    bu: 'beforeUpdate hook',
    u: 'updated',
    bum: 'beforeUnmount hook',
    um: 'unmounted hook',
    a: 'activated hook',
    da: 'deactivated hook',
    ec: 'errorCaptured hook',
    rtc: 'renderTracked hook',
    rtg: 'renderTriggered hook',
    0: 'setup function',
    1: 'render function',
    2: 'watcher getter',
    3: 'watcher callback',
    4: 'watcher cleanup function',
    5: 'native event handler',
    6: 'component event handler',
    7: 'vnode hook',
    8: 'directive hook',
    9: 'transition hook',
    10: 'app errorHandler',
    11: 'app warnHandler',
    12: 'ref function',
    13: 'async component loader',
    14: 'scheduler flush',
    15: 'component update',
    16: 'app unmount cleanup function',
  };
  function Ct(e, t, r, n) {
    try {
      return n ? e(...n) : e();
    } catch (i) {
      zt(i, t, r);
    }
  }
  function $e(e, t, r, n) {
    if (I(e)) {
      const i = Ct(e, t, r, n);
      return (
        i &&
          an(i) &&
          i.catch(o => {
            zt(o, t, r);
          }),
        i
      );
    }
    if (V(e)) {
      const i = [];
      for (let o = 0; o < e.length; o++) i.push($e(e[o], t, r, n));
      return i;
    } else
      process.env.NODE_ENV !== 'production' &&
        x(`Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`);
  }
  function zt(e, t, r, n = !0) {
    const i = t ? t.vnode : null,
      { errorHandler: o, throwUnhandledErrorInProduction: a } = (t && t.appContext.config) || W;
    if (t) {
      let s = t.parent;
      const c = t.proxy,
        f =
          process.env.NODE_ENV !== 'production'
            ? xn[r]
            : `https://vuejs.org/error-reference/#runtime-${r}`;
      for (; s; ) {
        const l = s.ec;
        if (l) {
          for (let u = 0; u < l.length; u++) if (l[u](e, c, f) === !1) return;
        }
        s = s.parent;
      }
      if (o) {
        (ke(), Ct(o, null, 10, [e, c, f]), Te());
        return;
      }
    }
    $a(e, r, i, n, a);
  }
  function $a(e, t, r, n = !0, i = !1) {
    if (process.env.NODE_ENV !== 'production') {
      const o = xn[t];
      if ((r && Ir(r), x(`Unhandled error${o ? ` during execution of ${o}` : ''}`), r && Pr(), n))
        throw e;
      console.error(e);
    } else {
      if (i) throw e;
      console.error(e);
    }
  }
  const se = [];
  let De = -1;
  const kt = [];
  let nt = null,
    Tt = 0;
  const qi = Promise.resolve();
  let Mr = null;
  const Da = 100;
  function Xi(e) {
    const t = Mr || qi;
    return e ? t.then(this ? e.bind(this) : e) : t;
  }
  function Fa(e) {
    let t = De + 1,
      r = se.length;
    for (; t < r; ) {
      const n = (t + r) >>> 1,
        i = se[n],
        o = Kt(i);
      o < e || (o === e && i.flags & 2) ? (t = n + 1) : (r = n);
    }
    return t;
  }
  function Lr(e) {
    if (!(e.flags & 1)) {
      const t = Kt(e),
        r = se[se.length - 1];
      (!r || (!(e.flags & 2) && t >= Kt(r)) ? se.push(e) : se.splice(Fa(t), 0, e),
        (e.flags |= 1),
        zi());
    }
  }
  function zi() {
    Mr || (Mr = qi.then(Ji));
  }
  function Ki(e) {
    (V(e)
      ? kt.push(...e)
      : nt && e.id === -1
        ? nt.splice(Tt + 1, 0, e)
        : e.flags & 1 || (kt.push(e), (e.flags |= 1)),
      zi());
  }
  function Gi(e, t, r = De + 1) {
    for (process.env.NODE_ENV !== 'production' && (t = t || new Map()); r < se.length; r++) {
      const n = se[r];
      if (n && n.flags & 2) {
        if ((e && n.id !== e.uid) || (process.env.NODE_ENV !== 'production' && Sn(t, n))) continue;
        (se.splice(r, 1), r--, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2));
      }
    }
  }
  function Yi(e) {
    if (kt.length) {
      const t = [...new Set(kt)].sort((r, n) => Kt(r) - Kt(n));
      if (((kt.length = 0), nt)) {
        nt.push(...t);
        return;
      }
      for (
        nt = t, process.env.NODE_ENV !== 'production' && (e = e || new Map()), Tt = 0;
        Tt < nt.length;
        Tt++
      ) {
        const r = nt[Tt];
        (process.env.NODE_ENV !== 'production' && Sn(e, r)) ||
          (r.flags & 4 && (r.flags &= -2), r.flags & 8 || r(), (r.flags &= -2));
      }
      ((nt = null), (Tt = 0));
    }
  }
  const Kt = e => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
  function Ji(e) {
    process.env.NODE_ENV !== 'production' && (e = e || new Map());
    const t = process.env.NODE_ENV !== 'production' ? r => Sn(e, r) : Q;
    try {
      for (De = 0; De < se.length; De++) {
        const r = se[De];
        if (r && !(r.flags & 8)) {
          if (process.env.NODE_ENV !== 'production' && t(r)) continue;
          (r.flags & 4 && (r.flags &= -2),
            Ct(r, r.i, r.i ? 15 : 14),
            r.flags & 4 || (r.flags &= -2));
        }
      }
    } finally {
      for (; De < se.length; De++) {
        const r = se[De];
        r && (r.flags &= -2);
      }
      ((De = -1), (se.length = 0), Yi(e), (Mr = null), (se.length || kt.length) && Ji(e));
    }
  }
  function Sn(e, t) {
    const r = e.get(t) || 0;
    if (r > Da) {
      const n = t.i,
        i = n && Zo(n.type);
      return (
        zt(
          `Maximum recursive updates exceeded${i ? ` in component <${i}>` : ''}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
          null,
          10
        ),
        !0
      );
    }
    return (e.set(t, r + 1), !1);
  }
  let Fe = !1;
  const Rr = new Map();
  process.env.NODE_ENV !== 'production' &&
    (jt().__VUE_HMR_RUNTIME__ = { createRecord: On(Zi), rerender: On(Ha), reload: On(Wa) });
  const vt = new Map();
  function ja(e) {
    const t = e.type.__hmrId;
    let r = vt.get(t);
    (r || (Zi(t, e.type), (r = vt.get(t))), r.instances.add(e));
  }
  function Ua(e) {
    vt.get(e.type.__hmrId).instances.delete(e);
  }
  function Zi(e, t) {
    return vt.has(e) ? !1 : (vt.set(e, { initialDef: $r(t), instances: new Set() }), !0);
  }
  function $r(e) {
    return Qo(e) ? e.__vccOpts : e;
  }
  function Ha(e, t) {
    const r = vt.get(e);
    r &&
      ((r.initialDef.render = t),
      [...r.instances].forEach(n => {
        (t && ((n.render = t), ($r(n.type).render = t)),
          (n.renderCache = []),
          (Fe = !0),
          n.job.flags & 8 || n.update(),
          (Fe = !1));
      }));
  }
  function Wa(e, t) {
    const r = vt.get(e);
    if (!r) return;
    ((t = $r(t)), Qi(r.initialDef, t));
    const n = [...r.instances];
    for (let i = 0; i < n.length; i++) {
      const o = n[i],
        a = $r(o.type);
      let s = Rr.get(a);
      (s || (a !== r.initialDef && Qi(a, t), Rr.set(a, (s = new Set()))),
        s.add(o),
        o.appContext.propsCache.delete(o.type),
        o.appContext.emitsCache.delete(o.type),
        o.appContext.optionsCache.delete(o.type),
        o.ceReload
          ? (s.add(o), o.ceReload(t.styles), s.delete(o))
          : o.parent
            ? Lr(() => {
                o.job.flags & 8 || ((Fe = !0), o.parent.update(), (Fe = !1), s.delete(o));
              })
            : o.appContext.reload
              ? o.appContext.reload()
              : typeof window < 'u'
                ? window.location.reload()
                : console.warn(
                    '[HMR] Root or manually mounted instance modified. Full reload required.'
                  ),
        o.root.ce && o !== o.root && o.root.ce._removeChildStyle(a));
    }
    Ki(() => {
      Rr.clear();
    });
  }
  function Qi(e, t) {
    G(e, t);
    for (const r in e) r !== '__file' && !(r in t) && delete e[r];
  }
  function On(e) {
    return (t, r) => {
      try {
        return e(t, r);
      } catch (n) {
        (console.error(n),
          console.warn(
            '[HMR] Something went wrong during Vue component hot-reload. Full reload required.'
          ));
      }
    };
  }
  let Ve,
    Gt = [],
    Cn = !1;
  function Yt(e, ...t) {
    Ve ? Ve.emit(e, ...t) : Cn || Gt.push({ event: e, args: t });
  }
  function kn(e, t) {
    var r, n;
    ((Ve = e),
      Ve
        ? ((Ve.enabled = !0), Gt.forEach(({ event: i, args: o }) => Ve.emit(i, ...o)), (Gt = []))
        : typeof window < 'u' &&
            window.HTMLElement &&
            !(
              (n = (r = window.navigator) == null ? void 0 : r.userAgent) != null &&
              n.includes('jsdom')
            )
          ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push(o => {
              kn(o, t);
            }),
            setTimeout(() => {
              Ve || ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null), (Cn = !0), (Gt = []));
            }, 3e3))
          : ((Cn = !0), (Gt = [])));
  }
  function Ba(e, t) {
    Yt('app:init', e, t, { Fragment: xe, Text: tr, Comment: Ae, Static: zr });
  }
  function qa(e) {
    Yt('app:unmount', e);
  }
  const Xa = Tn('component:added'),
    eo = Tn('component:updated'),
    za = Tn('component:removed'),
    Ka = e => {
      Ve && typeof Ve.cleanupBuffer == 'function' && !Ve.cleanupBuffer(e) && za(e);
    };
  function Tn(e) {
    return t => {
      Yt(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : void 0, t);
    };
  }
  const Ga = to('perf:start'),
    Ya = to('perf:end');
  function to(e) {
    return (t, r, n) => {
      Yt(e, t.appContext.app, t.uid, t, r, n);
    };
  }
  function Ja(e, t, r) {
    Yt('component:emit', e.appContext.app, e, t, r);
  }
  let we = null,
    ro = null;
  function Dr(e) {
    const t = we;
    return ((we = e), (ro = (e && e.type.__scopeId) || null), t);
  }
  function Za(e, t = we, r) {
    if (!t || e._n) return e;
    const n = (...i) => {
      n._d && Uo(-1);
      const o = Dr(t);
      let a;
      try {
        a = e(...i);
      } finally {
        (Dr(o), n._d && Uo(1));
      }
      return (process.env.NODE_ENV !== 'production' && eo(t), a);
    };
    return ((n._n = !0), (n._c = !0), (n._d = !0), n);
  }
  function no(e) {
    qs(e) && x('Do not use built-in directive ids as custom directive id: ' + e);
  }
  function bt(e, t, r, n) {
    const i = e.dirs,
      o = t && t.dirs;
    for (let a = 0; a < i.length; a++) {
      const s = i[a];
      o && (s.oldValue = o[a].value);
      let c = s.dir[n];
      c && (ke(), $e(c, r, 8, [e.el, s, e, t]), Te());
    }
  }
  const Qa = Symbol('_vte'),
    ec = e => e.__isTeleport,
    tc = Symbol('_leaveCb');
  function Vn(e, t) {
    e.shapeFlag & 6 && e.component
      ? ((e.transition = t), Vn(e.component.subTree, t))
      : e.shapeFlag & 128
        ? ((e.ssContent.transition = t.clone(e.ssContent)),
          (e.ssFallback.transition = t.clone(e.ssFallback)))
        : (e.transition = t);
  }
  function io(e, t) {
    return I(e) ? G({ name: e.name }, t, { setup: e }) : e;
  }
  function oo(e) {
    e.ids = [e.ids[0] + e.ids[2]++ + '-', 0, 0];
  }
  const so = new WeakSet(),
    Fr = new WeakMap();
  function Jt(e, t, r, n, i = !1) {
    if (V(e)) {
      e.forEach((N, L) => Jt(N, t && (V(t) ? t[L] : t), r, n, i));
      return;
    }
    if (Zt(n) && !i) {
      n.shapeFlag & 512 &&
        n.type.__asyncResolved &&
        n.component.subTree.component &&
        Jt(e, t, r, n.component.subTree);
      return;
    }
    const o = n.shapeFlag & 4 ? Kn(n.component) : n.el,
      a = i ? null : o,
      { i: s, r: c } = e;
    if (process.env.NODE_ENV !== 'production' && !s) {
      x(
        'Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.'
      );
      return;
    }
    const f = t && t.r,
      l = s.refs === W ? (s.refs = {}) : s.refs,
      u = s.setupState,
      p = R(u),
      m =
        u === W
          ? hi
          : N =>
              process.env.NODE_ENV !== 'production' &&
              (F(p, N) &&
                !te(p[N]) &&
                x(
                  `Template ref "${N}" used on a non-ref value. It will not work in the production build.`
                ),
              so.has(p[N]))
                ? !1
                : F(p, N),
      C = N => process.env.NODE_ENV === 'production' || !so.has(N);
    if (f != null && f !== c) {
      if ((ao(t), Y(f))) ((l[f] = null), m(f) && (u[f] = null));
      else if (te(f)) {
        C(f) && (f.value = null);
        const N = t;
        N.k && (l[N.k] = null);
      }
    }
    if (I(c)) Ct(c, s, 12, [a, l]);
    else {
      const N = Y(c),
        L = te(c);
      if (N || L) {
        const $ = () => {
          if (e.f) {
            const P = N ? (m(c) ? u[c] : l[c]) : C(c) || !e.k ? c.value : l[e.k];
            if (i) V(P) && sn(P, o);
            else if (V(P)) P.includes(o) || P.push(o);
            else if (N) ((l[c] = [o]), m(c) && (u[c] = l[c]));
            else {
              const D = [o];
              (C(c) && (c.value = D), e.k && (l[e.k] = D));
            }
          } else
            N
              ? ((l[c] = a), m(c) && (u[c] = a))
              : L
                ? (C(c) && (c.value = a), e.k && (l[e.k] = a))
                : process.env.NODE_ENV !== 'production' &&
                  x('Invalid template ref type:', c, `(${typeof c})`);
        };
        if (a) {
          const P = () => {
            ($(), Fr.delete(e));
          };
          ((P.id = -1), Fr.set(e, P), Ee(P, r));
        } else (ao(e), $());
      } else
        process.env.NODE_ENV !== 'production' &&
          x('Invalid template ref type:', c, `(${typeof c})`);
    }
  }
  function ao(e) {
    const t = Fr.get(e);
    t && ((t.flags |= 8), Fr.delete(e));
  }
  (jt().requestIdleCallback, jt().cancelIdleCallback);
  const Zt = e => !!e.type.__asyncLoader,
    An = e => e.type.__isKeepAlive;
  function rc(e, t) {
    co(e, 'a', t);
  }
  function nc(e, t) {
    co(e, 'da', t);
  }
  function co(e, t, r = re) {
    const n =
      e.__wdc ||
      (e.__wdc = () => {
        let i = r;
        for (; i; ) {
          if (i.isDeactivated) return;
          i = i.parent;
        }
        return e();
      });
    if ((jr(t, n, r), r)) {
      let i = r.parent;
      for (; i && i.parent; ) (An(i.parent.vnode) && ic(n, t, r, i), (i = i.parent));
    }
  }
  function ic(e, t, r, n) {
    const i = jr(t, e, n, !0);
    lo(() => {
      sn(n[t], i);
    }, r);
  }
  function jr(e, t, r = re, n = !1) {
    if (r) {
      const i = r[e] || (r[e] = []),
        o =
          t.__weh ||
          (t.__weh = (...a) => {
            ke();
            const s = ar(r),
              c = $e(t, r, e, a);
            return (s(), Te(), c);
          });
      return (n ? i.unshift(o) : i.push(o), o);
    } else if (process.env.NODE_ENV !== 'production') {
      const i = ft(xn[e].replace(/ hook$/, ''));
      x(
        `${i} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
      );
    }
  }
  const Ge =
      e =>
      (t, r = re) => {
        (!cr || e === 'sp') && jr(e, (...n) => t(...n), r);
      },
    oc = Ge('bm'),
    sc = Ge('m'),
    ac = Ge('bu'),
    cc = Ge('u'),
    lc = Ge('bum'),
    lo = Ge('um'),
    uc = Ge('sp'),
    dc = Ge('rtg'),
    fc = Ge('rtc');
  function hc(e, t = re) {
    jr('ec', e, t);
  }
  const pc = Symbol.for('v-ndc');
  function uo(e, t, r, n) {
    let i;
    const o = r,
      a = V(e);
    if (a || Y(e)) {
      const s = a && tt(e);
      let c = !1,
        f = !1;
      (s && ((c = !fe(e)), (f = Re(e)), (e = xr(e))), (i = new Array(e.length)));
      for (let l = 0, u = e.length; l < u; l++)
        i[l] = t(c ? (f ? Ot(Ke(e[l])) : Ke(e[l])) : e[l], l, void 0, o);
    } else if (typeof e == 'number') {
      (process.env.NODE_ENV !== 'production' &&
        !Number.isInteger(e) &&
        x(`The v-for range expect an integer value but got ${e}.`),
        (i = new Array(e)));
      for (let s = 0; s < e; s++) i[s] = t(s + 1, s, void 0, o);
    } else if (q(e))
      if (e[Symbol.iterator]) i = Array.from(e, (s, c) => t(s, c, void 0, o));
      else {
        const s = Object.keys(e);
        i = new Array(s.length);
        for (let c = 0, f = s.length; c < f; c++) {
          const l = s[c];
          i[c] = t(e[l], l, c, o);
        }
      }
    else i = [];
    return i;
  }
  const In = e => (e ? (Ko(e) ? Kn(e) : In(e.parent)) : null),
    _t = G(Object.create(null), {
      $: e => e,
      $el: e => e.vnode.el,
      $data: e => e.data,
      $props: e => (process.env.NODE_ENV !== 'production' ? Le(e.props) : e.props),
      $attrs: e => (process.env.NODE_ENV !== 'production' ? Le(e.attrs) : e.attrs),
      $slots: e => (process.env.NODE_ENV !== 'production' ? Le(e.slots) : e.slots),
      $refs: e => (process.env.NODE_ENV !== 'production' ? Le(e.refs) : e.refs),
      $parent: e => In(e.parent),
      $root: e => In(e.root),
      $host: e => e.ce,
      $emit: e => e.emit,
      $options: e => mo(e),
      $forceUpdate: e =>
        e.f ||
        (e.f = () => {
          Lr(e.update);
        }),
      $nextTick: e => e.n || (e.n = Xi.bind(e.proxy)),
      $watch: e => Tc.bind(e),
    }),
    Pn = e => e === '_' || e === '$',
    Mn = (e, t) => e !== W && !e.__isScriptSetup && F(e, t),
    fo = {
      get({ _: e }, t) {
        if (t === '__v_skip') return !0;
        const {
          ctx: r,
          setupState: n,
          data: i,
          props: o,
          accessCache: a,
          type: s,
          appContext: c,
        } = e;
        if (process.env.NODE_ENV !== 'production' && t === '__isVue') return !0;
        if (t[0] !== '$') {
          const p = a[t];
          if (p !== void 0)
            switch (p) {
              case 1:
                return n[t];
              case 2:
                return i[t];
              case 4:
                return r[t];
              case 3:
                return o[t];
            }
          else {
            if (Mn(n, t)) return ((a[t] = 1), n[t]);
            if (i !== W && F(i, t)) return ((a[t] = 2), i[t]);
            if (F(o, t)) return ((a[t] = 3), o[t]);
            if (r !== W && F(r, t)) return ((a[t] = 4), r[t]);
            Ln && (a[t] = 0);
          }
        }
        const f = _t[t];
        let l, u;
        if (f)
          return (
            t === '$attrs'
              ? (ee(e.attrs, 'get', ''), process.env.NODE_ENV !== 'production' && Br())
              : process.env.NODE_ENV !== 'production' && t === '$slots' && ee(e, 'get', t),
            f(e)
          );
        if ((l = s.__cssModules) && (l = l[t])) return l;
        if (r !== W && F(r, t)) return ((a[t] = 4), r[t]);
        if (((u = c.config.globalProperties), F(u, t))) return u[t];
        process.env.NODE_ENV !== 'production' &&
          we &&
          (!Y(t) || t.indexOf('__v') !== 0) &&
          (i !== W && Pn(t[0]) && F(i, t)
            ? x(
                `Property ${JSON.stringify(t)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
              )
            : e === we &&
              x(
                `Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`
              ));
      },
      set({ _: e }, t, r) {
        const { data: n, setupState: i, ctx: o } = e;
        return Mn(i, t)
          ? ((i[t] = r), !0)
          : process.env.NODE_ENV !== 'production' && i.__isScriptSetup && F(i, t)
            ? (x(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1)
            : n !== W && F(n, t)
              ? ((n[t] = r), !0)
              : F(e.props, t)
                ? (process.env.NODE_ENV !== 'production' &&
                    x(`Attempting to mutate prop "${t}". Props are readonly.`),
                  !1)
                : t[0] === '$' && t.slice(1) in e
                  ? (process.env.NODE_ENV !== 'production' &&
                      x(
                        `Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`
                      ),
                    !1)
                  : (process.env.NODE_ENV !== 'production' &&
                    t in e.appContext.config.globalProperties
                      ? Object.defineProperty(o, t, { enumerable: !0, configurable: !0, value: r })
                      : (o[t] = r),
                    !0);
      },
      has(
        { _: { data: e, setupState: t, accessCache: r, ctx: n, appContext: i, props: o, type: a } },
        s
      ) {
        let c;
        return !!(
          r[s] ||
          (e !== W && s[0] !== '$' && F(e, s)) ||
          Mn(t, s) ||
          F(o, s) ||
          F(n, s) ||
          F(_t, s) ||
          F(i.config.globalProperties, s) ||
          ((c = a.__cssModules) && c[s])
        );
      },
      defineProperty(e, t, r) {
        return (
          r.get != null ? (e._.accessCache[t] = 0) : F(r, 'value') && this.set(e, t, r.value, null),
          Reflect.defineProperty(e, t, r)
        );
      },
    };
  process.env.NODE_ENV !== 'production' &&
    (fo.ownKeys = e => (
      x(
        'Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.'
      ),
      Reflect.ownKeys(e)
    ));
  function gc(e) {
    const t = {};
    return (
      Object.defineProperty(t, '_', { configurable: !0, enumerable: !1, get: () => e }),
      Object.keys(_t).forEach(r => {
        Object.defineProperty(t, r, {
          configurable: !0,
          enumerable: !1,
          get: () => _t[r](e),
          set: Q,
        });
      }),
      t
    );
  }
  function mc(e) {
    const {
      ctx: t,
      propsOptions: [r],
    } = e;
    r &&
      Object.keys(r).forEach(n => {
        Object.defineProperty(t, n, {
          enumerable: !0,
          configurable: !0,
          get: () => e.props[n],
          set: Q,
        });
      });
  }
  function vc(e) {
    const { ctx: t, setupState: r } = e;
    Object.keys(R(r)).forEach(n => {
      if (!r.__isScriptSetup) {
        if (Pn(n[0])) {
          x(
            `setup() return property ${JSON.stringify(n)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
          );
          return;
        }
        Object.defineProperty(t, n, { enumerable: !0, configurable: !0, get: () => r[n], set: Q });
      }
    });
  }
  function ho(e) {
    return V(e) ? e.reduce((t, r) => ((t[r] = null), t), {}) : e;
  }
  function bc() {
    const e = Object.create(null);
    return (t, r) => {
      e[r] ? x(`${t} property "${r}" is already defined in ${e[r]}.`) : (e[r] = t);
    };
  }
  let Ln = !0;
  function _c(e) {
    const t = mo(e),
      r = e.proxy,
      n = e.ctx;
    ((Ln = !1), t.beforeCreate && po(t.beforeCreate, e, 'bc'));
    const {
        data: i,
        computed: o,
        methods: a,
        watch: s,
        provide: c,
        inject: f,
        created: l,
        beforeMount: u,
        mounted: p,
        beforeUpdate: m,
        updated: C,
        activated: N,
        deactivated: L,
        beforeDestroy: $,
        beforeUnmount: P,
        destroyed: D,
        unmounted: Z,
        render: k,
        renderTracked: z,
        renderTriggered: ie,
        errorCaptured: oe,
        serverPrefetch: ge,
        expose: Ze,
        inheritAttrs: ct,
        components: Pe,
        directives: nn,
        filters: Fs,
      } = t,
      lt = process.env.NODE_ENV !== 'production' ? bc() : null;
    if (process.env.NODE_ENV !== 'production') {
      const [U] = e.propsOptions;
      if (U) for (const j in U) lt('Props', j);
    }
    if ((f && yc(f, n, lt), a))
      for (const U in a) {
        const j = a[U];
        I(j)
          ? (process.env.NODE_ENV !== 'production'
              ? Object.defineProperty(n, U, {
                  value: j.bind(r),
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                })
              : (n[U] = j.bind(r)),
            process.env.NODE_ENV !== 'production' && lt('Methods', U))
          : process.env.NODE_ENV !== 'production' &&
            x(
              `Method "${U}" has type "${typeof j}" in the component definition. Did you reference the function correctly?`
            );
      }
    if (i) {
      process.env.NODE_ENV !== 'production' &&
        !I(i) &&
        x('The data option must be a function. Plain object usage is no longer supported.');
      const U = i.call(r, r);
      if (
        (process.env.NODE_ENV !== 'production' &&
          an(U) &&
          x(
            'data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.'
          ),
        !q(U))
      )
        process.env.NODE_ENV !== 'production' && x('data() should return an object.');
      else if (((e.data = Xt(U)), process.env.NODE_ENV !== 'production'))
        for (const j in U)
          (lt('Data', j),
            Pn(j[0]) ||
              Object.defineProperty(n, j, {
                configurable: !0,
                enumerable: !0,
                get: () => U[j],
                set: Q,
              }));
    }
    if (((Ln = !0), o))
      for (const U in o) {
        const j = o[U],
          We = I(j) ? j.bind(r, r) : I(j.get) ? j.get.bind(r, r) : Q;
        process.env.NODE_ENV !== 'production' &&
          We === Q &&
          x(`Computed property "${U}" has no getter.`);
        const ui =
            !I(j) && I(j.set)
              ? j.set.bind(r)
              : process.env.NODE_ENV !== 'production'
                ? () => {
                    x(`Write operation failed: computed property "${U}" is readonly.`);
                  }
                : Q,
          pr = Jr({ get: We, set: ui });
        (Object.defineProperty(n, U, {
          enumerable: !0,
          configurable: !0,
          get: () => pr.value,
          set: Rt => (pr.value = Rt),
        }),
          process.env.NODE_ENV !== 'production' && lt('Computed', U));
      }
    if (s) for (const U in s) go(s[U], n, r, U);
    if (c) {
      const U = I(c) ? c.call(r) : c;
      Reflect.ownKeys(U).forEach(j => {
        Oc(j, U[j]);
      });
    }
    l && po(l, e, 'c');
    function me(U, j) {
      V(j) ? j.forEach(We => U(We.bind(r))) : j && U(j.bind(r));
    }
    if (
      (me(oc, u),
      me(sc, p),
      me(ac, m),
      me(cc, C),
      me(rc, N),
      me(nc, L),
      me(hc, oe),
      me(fc, z),
      me(dc, ie),
      me(lc, P),
      me(lo, Z),
      me(uc, ge),
      V(Ze))
    )
      if (Ze.length) {
        const U = e.exposed || (e.exposed = {});
        Ze.forEach(j => {
          Object.defineProperty(U, j, { get: () => r[j], set: We => (r[j] = We), enumerable: !0 });
        });
      } else e.exposed || (e.exposed = {});
    (k && e.render === Q && (e.render = k),
      ct != null && (e.inheritAttrs = ct),
      Pe && (e.components = Pe),
      nn && (e.directives = nn),
      ge && oo(e));
  }
  function yc(e, t, r = Q) {
    V(e) && (e = Rn(e));
    for (const n in e) {
      const i = e[n];
      let o;
      (q(i)
        ? 'default' in i
          ? (o = Hr(i.from || n, i.default, !0))
          : (o = Hr(i.from || n))
        : (o = Hr(i)),
        te(o)
          ? Object.defineProperty(t, n, {
              enumerable: !0,
              configurable: !0,
              get: () => o.value,
              set: a => (o.value = a),
            })
          : (t[n] = o),
        process.env.NODE_ENV !== 'production' && r('Inject', n));
    }
  }
  function po(e, t, r) {
    $e(V(e) ? e.map(n => n.bind(t.proxy)) : e.bind(t.proxy), t, r);
  }
  function go(e, t, r, n) {
    let i = n.includes('.') ? wo(r, n) : () => r[n];
    if (Y(e)) {
      const o = t[e];
      I(o)
        ? $n(i, o)
        : process.env.NODE_ENV !== 'production' &&
          x(`Invalid watch handler specified by key "${e}"`, o);
    } else if (I(e)) $n(i, e.bind(r));
    else if (q(e))
      if (V(e)) e.forEach(o => go(o, t, r, n));
      else {
        const o = I(e.handler) ? e.handler.bind(r) : t[e.handler];
        I(o)
          ? $n(i, o, e)
          : process.env.NODE_ENV !== 'production' &&
            x(`Invalid watch handler specified by key "${e.handler}"`, o);
      }
    else process.env.NODE_ENV !== 'production' && x(`Invalid watch option: "${n}"`, e);
  }
  function mo(e) {
    const t = e.type,
      { mixins: r, extends: n } = t,
      {
        mixins: i,
        optionsCache: o,
        config: { optionMergeStrategies: a },
      } = e.appContext,
      s = o.get(t);
    let c;
    return (
      s
        ? (c = s)
        : !i.length && !r && !n
          ? (c = t)
          : ((c = {}), i.length && i.forEach(f => Ur(c, f, a, !0)), Ur(c, t, a)),
      q(t) && o.set(t, c),
      c
    );
  }
  function Ur(e, t, r, n = !1) {
    const { mixins: i, extends: o } = t;
    (o && Ur(e, o, r, !0), i && i.forEach(a => Ur(e, a, r, !0)));
    for (const a in t)
      if (n && a === 'expose')
        process.env.NODE_ENV !== 'production' &&
          x(
            '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
          );
      else {
        const s = wc[a] || (r && r[a]);
        e[a] = s ? s(e[a], t[a]) : t[a];
      }
    return e;
  }
  const wc = {
    data: vo,
    props: bo,
    emits: bo,
    methods: Qt,
    computed: Qt,
    beforeCreate: ae,
    created: ae,
    beforeMount: ae,
    mounted: ae,
    beforeUpdate: ae,
    updated: ae,
    beforeDestroy: ae,
    beforeUnmount: ae,
    destroyed: ae,
    unmounted: ae,
    activated: ae,
    deactivated: ae,
    errorCaptured: ae,
    serverPrefetch: ae,
    components: Qt,
    directives: Qt,
    watch: Nc,
    provide: vo,
    inject: Ec,
  };
  function vo(e, t) {
    return t
      ? e
        ? function () {
            return G(I(e) ? e.call(this, this) : e, I(t) ? t.call(this, this) : t);
          }
        : t
      : e;
  }
  function Ec(e, t) {
    return Qt(Rn(e), Rn(t));
  }
  function Rn(e) {
    if (V(e)) {
      const t = {};
      for (let r = 0; r < e.length; r++) t[e[r]] = e[r];
      return t;
    }
    return e;
  }
  function ae(e, t) {
    return e ? [...new Set([].concat(e, t))] : t;
  }
  function Qt(e, t) {
    return e ? G(Object.create(null), e, t) : t;
  }
  function bo(e, t) {
    return e
      ? V(e) && V(t)
        ? [...new Set([...e, ...t])]
        : G(Object.create(null), ho(e), ho(t ?? {}))
      : t;
  }
  function Nc(e, t) {
    if (!e) return t;
    if (!t) return e;
    const r = G(Object.create(null), e);
    for (const n in t) r[n] = ae(e[n], t[n]);
    return r;
  }
  function _o() {
    return {
      app: null,
      config: {
        isNativeTag: hi,
        performance: !1,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {},
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap(),
    };
  }
  let xc = 0;
  function Sc(e, t) {
    return function (n, i = null) {
      (I(n) || (n = G({}, n)),
        i != null &&
          !q(i) &&
          (process.env.NODE_ENV !== 'production' &&
            x('root props passed to app.mount() must be an object.'),
          (i = null)));
      const o = _o(),
        a = new WeakSet(),
        s = [];
      let c = !1;
      const f = (o.app = {
        _uid: xc++,
        _component: n,
        _props: i,
        _container: null,
        _context: o,
        _instance: null,
        version: es,
        get config() {
          return o.config;
        },
        set config(l) {
          process.env.NODE_ENV !== 'production' &&
            x('app.config cannot be replaced. Modify individual options instead.');
        },
        use(l, ...u) {
          return (
            a.has(l)
              ? process.env.NODE_ENV !== 'production' &&
                x('Plugin has already been applied to target app.')
              : l && I(l.install)
                ? (a.add(l), l.install(f, ...u))
                : I(l)
                  ? (a.add(l), l(f, ...u))
                  : process.env.NODE_ENV !== 'production' &&
                    x(
                      'A plugin must either be a function or an object with an "install" function.'
                    ),
            f
          );
        },
        mixin(l) {
          return (
            o.mixins.includes(l)
              ? process.env.NODE_ENV !== 'production' &&
                x('Mixin has already been applied to target app' + (l.name ? `: ${l.name}` : ''))
              : o.mixins.push(l),
            f
          );
        },
        component(l, u) {
          return (
            process.env.NODE_ENV !== 'production' && zn(l, o.config),
            u
              ? (process.env.NODE_ENV !== 'production' &&
                  o.components[l] &&
                  x(`Component "${l}" has already been registered in target app.`),
                (o.components[l] = u),
                f)
              : o.components[l]
          );
        },
        directive(l, u) {
          return (
            process.env.NODE_ENV !== 'production' && no(l),
            u
              ? (process.env.NODE_ENV !== 'production' &&
                  o.directives[l] &&
                  x(`Directive "${l}" has already been registered in target app.`),
                (o.directives[l] = u),
                f)
              : o.directives[l]
          );
        },
        mount(l, u, p) {
          if (c)
            process.env.NODE_ENV !== 'production' &&
              x(
                'App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`'
              );
          else {
            process.env.NODE_ENV !== 'production' &&
              l.__vue_app__ &&
              x(
                'There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first.'
              );
            const m = f._ceVNode || it(n, i);
            return (
              (m.appContext = o),
              p === !0 ? (p = 'svg') : p === !1 && (p = void 0),
              process.env.NODE_ENV !== 'production' &&
                (o.reload = () => {
                  const C = ot(m);
                  ((C.el = null), e(C, l, p));
                }),
              e(m, l, p),
              (c = !0),
              (f._container = l),
              (l.__vue_app__ = f),
              process.env.NODE_ENV !== 'production' && ((f._instance = m.component), Ba(f, es)),
              Kn(m.component)
            );
          }
        },
        onUnmount(l) {
          (process.env.NODE_ENV !== 'production' &&
            typeof l != 'function' &&
            x(`Expected function as first argument to app.onUnmount(), but got ${typeof l}`),
            s.push(l));
        },
        unmount() {
          c
            ? ($e(s, f._instance, 16),
              e(null, f._container),
              process.env.NODE_ENV !== 'production' && ((f._instance = null), qa(f)),
              delete f._container.__vue_app__)
            : process.env.NODE_ENV !== 'production' &&
              x('Cannot unmount an app that is not mounted.');
        },
        provide(l, u) {
          return (
            process.env.NODE_ENV !== 'production' &&
              l in o.provides &&
              (F(o.provides, l)
                ? x(
                    `App already provides property with key "${String(l)}". It will be overwritten with the new value.`
                  )
                : x(
                    `App already provides property with key "${String(l)}" inherited from its parent element. It will be overwritten with the new value.`
                  )),
            (o.provides[l] = u),
            f
          );
        },
        runWithContext(l) {
          const u = Vt;
          Vt = f;
          try {
            return l();
          } finally {
            Vt = u;
          }
        },
      });
      return f;
    };
  }
  let Vt = null;
  function Oc(e, t) {
    if (
      (process.env.NODE_ENV !== 'production' &&
        (!re || re.isMounted) &&
        x('provide() can only be used inside setup().'),
      re)
    ) {
      let r = re.provides;
      const n = re.parent && re.parent.provides;
      (n === r && (r = re.provides = Object.create(n)), (r[e] = t));
    }
  }
  function Hr(e, t, r = !1) {
    const n = Xo();
    if (n || Vt) {
      let i = Vt
        ? Vt._context.provides
        : n
          ? n.parent == null || n.ce
            ? n.vnode.appContext && n.vnode.appContext.provides
            : n.parent.provides
          : void 0;
      if (i && e in i) return i[e];
      if (arguments.length > 1) return r && I(t) ? t.call(n && n.proxy) : t;
      process.env.NODE_ENV !== 'production' && x(`injection "${String(e)}" not found.`);
    } else
      process.env.NODE_ENV !== 'production' &&
        x('inject() can only be used inside setup() or functional components.');
  }
  const Cc = Symbol.for('v-scx'),
    kc = () => {
      {
        const e = Hr(Cc);
        return (
          e ||
            (process.env.NODE_ENV !== 'production' &&
              x(
                'Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.'
              )),
          e
        );
      }
    };
  function $n(e, t, r) {
    return (
      process.env.NODE_ENV !== 'production' &&
        !I(t) &&
        x(
          '`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature.'
        ),
      yo(e, t, r)
    );
  }
  function yo(e, t, r = W) {
    const { immediate: n, deep: i, flush: o, once: a } = r;
    process.env.NODE_ENV !== 'production' &&
      !t &&
      (n !== void 0 &&
        x(
          'watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'
        ),
      i !== void 0 &&
        x(
          'watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'
        ),
      a !== void 0 &&
        x(
          'watch() "once" option is only respected when using the watch(source, callback, options?) signature.'
        ));
    const s = G({}, r);
    process.env.NODE_ENV !== 'production' && (s.onWarn = x);
    const c = (t && n) || (!t && o !== 'post');
    let f;
    if (cr) {
      if (o === 'sync') {
        const m = kc();
        f = m.__watcherHandles || (m.__watcherHandles = []);
      } else if (!c) {
        const m = () => {};
        return ((m.stop = Q), (m.resume = Q), (m.pause = Q), m);
      }
    }
    const l = re;
    s.call = (m, C, N) => $e(m, l, C, N);
    let u = !1;
    (o === 'post'
      ? (s.scheduler = m => {
          Ee(m, l && l.suspense);
        })
      : o !== 'sync' &&
        ((u = !0),
        (s.scheduler = (m, C) => {
          C ? m() : Lr(m);
        })),
      (s.augmentJob = m => {
        (t && (m.flags |= 4), u && ((m.flags |= 2), l && ((m.id = l.uid), (m.i = l))));
      }));
    const p = Ia(e, t, s);
    return (cr && (f ? f.push(p) : c && p()), p);
  }
  function Tc(e, t, r) {
    const n = this.proxy,
      i = Y(e) ? (e.includes('.') ? wo(n, e) : () => n[e]) : e.bind(n, n);
    let o;
    I(t) ? (o = t) : ((o = t.handler), (r = t));
    const a = ar(this),
      s = yo(i, o.bind(n), r);
    return (a(), s);
  }
  function wo(e, t) {
    const r = t.split('.');
    return () => {
      let n = e;
      for (let i = 0; i < r.length && n; i++) n = n[r[i]];
      return n;
    };
  }
  const Vc = (e, t) =>
    t === 'modelValue' || t === 'model-value'
      ? e.modelModifiers
      : e[`${t}Modifiers`] || e[`${ue(t)}Modifiers`] || e[`${ye(t)}Modifiers`];
  function Ac(e, t, ...r) {
    if (e.isUnmounted) return;
    const n = e.vnode.props || W;
    if (process.env.NODE_ENV !== 'production') {
      const {
        emitsOptions: l,
        propsOptions: [u],
      } = e;
      if (l)
        if (!(t in l))
          (!u || !(ft(ue(t)) in u)) &&
            x(
              `Component emitted event "${t}" but it is neither declared in the emits option nor as an "${ft(ue(t))}" prop.`
            );
        else {
          const p = l[t];
          I(p) &&
            (p(...r) || x(`Invalid event arguments: event validation failed for event "${t}".`));
        }
    }
    let i = r;
    const o = t.startsWith('update:'),
      a = o && Vc(n, t.slice(7));
    if (
      (a && (a.trim && (i = r.map(l => (Y(l) ? l.trim() : l))), a.number && (i = r.map(Ks))),
      process.env.NODE_ENV !== 'production' && Ja(e, t, i),
      process.env.NODE_ENV !== 'production')
    ) {
      const l = t.toLowerCase();
      l !== t &&
        n[ft(l)] &&
        x(
          `Event "${l}" is emitted in component ${lr(e, e.type)} but the handler is registered for "${t}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${ye(t)}" instead of "${t}".`
        );
    }
    let s,
      c = n[(s = ft(t))] || n[(s = ft(ue(t)))];
    (!c && o && (c = n[(s = ft(ye(t)))]), c && $e(c, e, 6, i));
    const f = n[s + 'Once'];
    if (f) {
      if (!e.emitted) e.emitted = {};
      else if (e.emitted[s]) return;
      ((e.emitted[s] = !0), $e(f, e, 6, i));
    }
  }
  const Ic = new WeakMap();
  function Eo(e, t, r = !1) {
    const n = r ? Ic : t.emitsCache,
      i = n.get(e);
    if (i !== void 0) return i;
    const o = e.emits;
    let a = {},
      s = !1;
    if (!I(e)) {
      const c = f => {
        const l = Eo(f, t, !0);
        l && ((s = !0), G(a, l));
      };
      (!r && t.mixins.length && t.mixins.forEach(c),
        e.extends && c(e.extends),
        e.mixins && e.mixins.forEach(c));
    }
    return !o && !s
      ? (q(e) && n.set(e, null), null)
      : (V(o) ? o.forEach(c => (a[c] = null)) : G(a, o), q(e) && n.set(e, a), a);
  }
  function Wr(e, t) {
    return !e || !$t(t)
      ? !1
      : ((t = t.slice(2).replace(/Once$/, '')),
        F(e, t[0].toLowerCase() + t.slice(1)) || F(e, ye(t)) || F(e, t));
  }
  let Dn = !1;
  function Br() {
    Dn = !0;
  }
  function No(e) {
    const {
        type: t,
        vnode: r,
        proxy: n,
        withProxy: i,
        propsOptions: [o],
        slots: a,
        attrs: s,
        emit: c,
        render: f,
        renderCache: l,
        props: u,
        data: p,
        setupState: m,
        ctx: C,
        inheritAttrs: N,
      } = e,
      L = Dr(e);
    let $, P;
    process.env.NODE_ENV !== 'production' && (Dn = !1);
    try {
      if (r.shapeFlag & 4) {
        const k = i || n,
          z =
            process.env.NODE_ENV !== 'production' && m.__isScriptSetup
              ? new Proxy(k, {
                  get(ie, oe, ge) {
                    return (
                      x(
                        `Property '${String(oe)}' was accessed via 'this'. Avoid using 'this' in templates.`
                      ),
                      Reflect.get(ie, oe, ge)
                    );
                  },
                })
              : k;
        (($ = Ie(f.call(z, k, l, process.env.NODE_ENV !== 'production' ? Le(u) : u, m, p, C))),
          (P = s));
      } else {
        const k = t;
        (process.env.NODE_ENV !== 'production' && s === u && Br(),
          ($ = Ie(
            k.length > 1
              ? k(
                  process.env.NODE_ENV !== 'production' ? Le(u) : u,
                  process.env.NODE_ENV !== 'production'
                    ? {
                        get attrs() {
                          return (Br(), Le(s));
                        },
                        slots: a,
                        emit: c,
                      }
                    : { attrs: s, slots: a, emit: c }
                )
              : k(process.env.NODE_ENV !== 'production' ? Le(u) : u, null)
          )),
          (P = t.props ? s : Pc(s)));
      }
    } catch (k) {
      ((rr.length = 0), zt(k, e, 1), ($ = it(Ae)));
    }
    let D = $,
      Z;
    if (
      (process.env.NODE_ENV !== 'production' &&
        $.patchFlag > 0 &&
        $.patchFlag & 2048 &&
        ([D, Z] = xo($)),
      P && N !== !1)
    ) {
      const k = Object.keys(P),
        { shapeFlag: z } = D;
      if (k.length) {
        if (z & 7) (o && k.some(br) && (P = Mc(P, o)), (D = ot(D, P, !1, !0)));
        else if (process.env.NODE_ENV !== 'production' && !Dn && D.type !== Ae) {
          const ie = Object.keys(s),
            oe = [],
            ge = [];
          for (let Ze = 0, ct = ie.length; Ze < ct; Ze++) {
            const Pe = ie[Ze];
            $t(Pe) ? br(Pe) || oe.push(Pe[2].toLowerCase() + Pe.slice(3)) : ge.push(Pe);
          }
          (ge.length &&
            x(
              `Extraneous non-props attributes (${ge.join(', ')}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
            ),
            oe.length &&
              x(
                `Extraneous non-emits event listeners (${oe.join(', ')}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
              ));
        }
      }
    }
    return (
      r.dirs &&
        (process.env.NODE_ENV !== 'production' &&
          !So(D) &&
          x(
            'Runtime directive used on component with non-element root node. The directives will not function as intended.'
          ),
        (D = ot(D, null, !1, !0)),
        (D.dirs = D.dirs ? D.dirs.concat(r.dirs) : r.dirs)),
      r.transition &&
        (process.env.NODE_ENV !== 'production' &&
          !So(D) &&
          x('Component inside <Transition> renders non-element root node that cannot be animated.'),
        Vn(D, r.transition)),
      process.env.NODE_ENV !== 'production' && Z ? Z(D) : ($ = D),
      Dr(L),
      $
    );
  }
  const xo = e => {
    const t = e.children,
      r = e.dynamicChildren,
      n = Fn(t, !1);
    if (n) {
      if (process.env.NODE_ENV !== 'production' && n.patchFlag > 0 && n.patchFlag & 2048)
        return xo(n);
    } else return [e, void 0];
    const i = t.indexOf(n),
      o = r ? r.indexOf(n) : -1,
      a = s => {
        ((t[i] = s),
          r && (o > -1 ? (r[o] = s) : s.patchFlag > 0 && (e.dynamicChildren = [...r, s])));
      };
    return [Ie(n), a];
  };
  function Fn(e, t = !0) {
    let r;
    for (let n = 0; n < e.length; n++) {
      const i = e[n];
      if (Kr(i)) {
        if (i.type !== Ae || i.children === 'v-if') {
          if (r) return;
          if (
            ((r = i),
            process.env.NODE_ENV !== 'production' && t && r.patchFlag > 0 && r.patchFlag & 2048)
          )
            return Fn(r.children);
        }
      } else return;
    }
    return r;
  }
  const Pc = e => {
      let t;
      for (const r in e) (r === 'class' || r === 'style' || $t(r)) && ((t || (t = {}))[r] = e[r]);
      return t;
    },
    Mc = (e, t) => {
      const r = {};
      for (const n in e) (!br(n) || !(n.slice(9) in t)) && (r[n] = e[n]);
      return r;
    },
    So = e => e.shapeFlag & 7 || e.type === Ae;
  function Lc(e, t, r) {
    const { props: n, children: i, component: o } = e,
      { props: a, children: s, patchFlag: c } = t,
      f = o.emitsOptions;
    if ((process.env.NODE_ENV !== 'production' && (i || s) && Fe) || t.dirs || t.transition)
      return !0;
    if (r && c >= 0) {
      if (c & 1024) return !0;
      if (c & 16) return n ? Oo(n, a, f) : !!a;
      if (c & 8) {
        const l = t.dynamicProps;
        for (let u = 0; u < l.length; u++) {
          const p = l[u];
          if (a[p] !== n[p] && !Wr(f, p)) return !0;
        }
      }
    } else
      return (i || s) && (!s || !s.$stable) ? !0 : n === a ? !1 : n ? (a ? Oo(n, a, f) : !0) : !!a;
    return !1;
  }
  function Oo(e, t, r) {
    const n = Object.keys(t);
    if (n.length !== Object.keys(e).length) return !0;
    for (let i = 0; i < n.length; i++) {
      const o = n[i];
      if (t[o] !== e[o] && !Wr(r, o)) return !0;
    }
    return !1;
  }
  function Rc({ vnode: e, parent: t }, r) {
    for (; t; ) {
      const n = t.subTree;
      if ((n.suspense && n.suspense.activeBranch === e && (n.el = e.el), n === e))
        (((e = t.vnode).el = r), (t = t.parent));
      else break;
    }
  }
  const Co = {},
    ko = () => Object.create(Co),
    To = e => Object.getPrototypeOf(e) === Co;
  function $c(e, t, r, n = !1) {
    const i = {},
      o = ko();
    ((e.propsDefaults = Object.create(null)), Vo(e, t, i, o));
    for (const a in e.propsOptions[0]) a in i || (i[a] = void 0);
    (process.env.NODE_ENV !== 'production' && Po(t || {}, i, e),
      r ? (e.props = n ? i : Oa(i)) : e.type.props ? (e.props = i) : (e.props = o),
      (e.attrs = o));
  }
  function Dc(e) {
    for (; e; ) {
      if (e.type.__hmrId) return !0;
      e = e.parent;
    }
  }
  function Fc(e, t, r, n) {
    const {
        props: i,
        attrs: o,
        vnode: { patchFlag: a },
      } = e,
      s = R(i),
      [c] = e.propsOptions;
    let f = !1;
    if (!(process.env.NODE_ENV !== 'production' && Dc(e)) && (n || a > 0) && !(a & 16)) {
      if (a & 8) {
        const l = e.vnode.dynamicProps;
        for (let u = 0; u < l.length; u++) {
          let p = l[u];
          if (Wr(e.emitsOptions, p)) continue;
          const m = t[p];
          if (c)
            if (F(o, p)) m !== o[p] && ((o[p] = m), (f = !0));
            else {
              const C = ue(p);
              i[C] = jn(c, s, C, m, e, !1);
            }
          else m !== o[p] && ((o[p] = m), (f = !0));
        }
      }
    } else {
      Vo(e, t, i, o) && (f = !0);
      let l;
      for (const u in s)
        (!t || (!F(t, u) && ((l = ye(u)) === u || !F(t, l)))) &&
          (c
            ? r && (r[u] !== void 0 || r[l] !== void 0) && (i[u] = jn(c, s, u, void 0, e, !0))
            : delete i[u]);
      if (o !== s) for (const u in o) (!t || !F(t, u)) && (delete o[u], (f = !0));
    }
    (f && Me(e.attrs, 'set', ''), process.env.NODE_ENV !== 'production' && Po(t || {}, i, e));
  }
  function Vo(e, t, r, n) {
    const [i, o] = e.propsOptions;
    let a = !1,
      s;
    if (t)
      for (let c in t) {
        if (Dt(c)) continue;
        const f = t[c];
        let l;
        i && F(i, (l = ue(c)))
          ? !o || !o.includes(l)
            ? (r[l] = f)
            : ((s || (s = {}))[l] = f)
          : Wr(e.emitsOptions, c) || ((!(c in n) || f !== n[c]) && ((n[c] = f), (a = !0)));
      }
    if (o) {
      const c = R(r),
        f = s || W;
      for (let l = 0; l < o.length; l++) {
        const u = o[l];
        r[u] = jn(i, c, u, f[u], e, !F(f, u));
      }
    }
    return a;
  }
  function jn(e, t, r, n, i, o) {
    const a = e[r];
    if (a != null) {
      const s = F(a, 'default');
      if (s && n === void 0) {
        const c = a.default;
        if (a.type !== Function && !a.skipFactory && I(c)) {
          const { propsDefaults: f } = i;
          if (r in f) n = f[r];
          else {
            const l = ar(i);
            ((n = f[r] = c.call(null, t)), l());
          }
        } else n = c;
        i.ce && i.ce._setProp(r, n);
      }
      a[0] && (o && !s ? (n = !1) : a[1] && (n === '' || n === ye(r)) && (n = !0));
    }
    return n;
  }
  const jc = new WeakMap();
  function Ao(e, t, r = !1) {
    const n = r ? jc : t.propsCache,
      i = n.get(e);
    if (i) return i;
    const o = e.props,
      a = {},
      s = [];
    let c = !1;
    if (!I(e)) {
      const l = u => {
        c = !0;
        const [p, m] = Ao(u, t, !0);
        (G(a, p), m && s.push(...m));
      };
      (!r && t.mixins.length && t.mixins.forEach(l),
        e.extends && l(e.extends),
        e.mixins && e.mixins.forEach(l));
    }
    if (!o && !c) return (q(e) && n.set(e, Nt), Nt);
    if (V(o))
      for (let l = 0; l < o.length; l++) {
        process.env.NODE_ENV !== 'production' &&
          !Y(o[l]) &&
          x('props must be strings when using array syntax.', o[l]);
        const u = ue(o[l]);
        Io(u) && (a[u] = W);
      }
    else if (o) {
      process.env.NODE_ENV !== 'production' && !q(o) && x('invalid props options', o);
      for (const l in o) {
        const u = ue(l);
        if (Io(u)) {
          const p = o[l],
            m = (a[u] = V(p) || I(p) ? { type: p } : G({}, p)),
            C = m.type;
          let N = !1,
            L = !0;
          if (V(C))
            for (let $ = 0; $ < C.length; ++$) {
              const P = C[$],
                D = I(P) && P.name;
              if (D === 'Boolean') {
                N = !0;
                break;
              } else D === 'String' && (L = !1);
            }
          else N = I(C) && C.name === 'Boolean';
          ((m[0] = N), (m[1] = L), (N || F(m, 'default')) && s.push(u));
        }
      }
    }
    const f = [a, s];
    return (q(e) && n.set(e, f), f);
  }
  function Io(e) {
    return e[0] !== '$' && !Dt(e)
      ? !0
      : (process.env.NODE_ENV !== 'production' &&
          x(`Invalid prop name: "${e}" is a reserved property.`),
        !1);
  }
  function Uc(e) {
    return e === null
      ? 'null'
      : typeof e == 'function'
        ? e.name || ''
        : (typeof e == 'object' && e.constructor && e.constructor.name) || '';
  }
  function Po(e, t, r) {
    const n = R(t),
      i = r.propsOptions[0],
      o = Object.keys(e).map(a => ue(a));
    for (const a in i) {
      let s = i[a];
      s != null &&
        Hc(a, n[a], s, process.env.NODE_ENV !== 'production' ? Le(n) : n, !o.includes(a));
    }
  }
  function Hc(e, t, r, n, i) {
    const { type: o, required: a, validator: s, skipCheck: c } = r;
    if (a && i) {
      x('Missing required prop: "' + e + '"');
      return;
    }
    if (!(t == null && !a)) {
      if (o != null && o !== !0 && !c) {
        let f = !1;
        const l = V(o) ? o : [o],
          u = [];
        for (let p = 0; p < l.length && !f; p++) {
          const { valid: m, expectedType: C } = Bc(t, l[p]);
          (u.push(C || ''), (f = m));
        }
        if (!f) {
          x(qc(e, t, u));
          return;
        }
      }
      s && !s(t, n) && x('Invalid prop: custom validator check failed for prop "' + e + '".');
    }
  }
  const Wc = _e('String,Number,Boolean,Function,Symbol,BigInt');
  function Bc(e, t) {
    let r;
    const n = Uc(t);
    if (n === 'null') r = e === null;
    else if (Wc(n)) {
      const i = typeof e;
      ((r = i === n.toLowerCase()), !r && i === 'object' && (r = e instanceof t));
    } else n === 'Object' ? (r = q(e)) : n === 'Array' ? (r = V(e)) : (r = e instanceof t);
    return { valid: r, expectedType: n };
  }
  function qc(e, t, r) {
    if (r.length === 0)
      return `Prop type [] for prop "${e}" won't match anything. Did you mean to use type Array instead?`;
    let n = `Invalid prop: type check failed for prop "${e}". Expected ${r.map(Er).join(' | ')}`;
    const i = r[0],
      o = cn(t),
      a = Mo(t, i),
      s = Mo(t, o);
    return (
      r.length === 1 && Lo(i) && !Xc(i, o) && (n += ` with value ${a}`),
      (n += `, got ${o} `),
      Lo(o) && (n += `with value ${s}.`),
      n
    );
  }
  function Mo(e, t) {
    return t === 'String' ? `"${e}"` : t === 'Number' ? `${Number(e)}` : `${e}`;
  }
  function Lo(e) {
    return ['string', 'number', 'boolean'].some(r => e.toLowerCase() === r);
  }
  function Xc(...e) {
    return e.some(t => t.toLowerCase() === 'boolean');
  }
  const Un = e => e === '_' || e === '_ctx' || e === '$stable',
    Hn = e => (V(e) ? e.map(Ie) : [Ie(e)]),
    zc = (e, t, r) => {
      if (t._n) return t;
      const n = Za(
        (...i) => (
          process.env.NODE_ENV !== 'production' &&
            re &&
            !(r === null && we) &&
            !(r && r.root !== re.root) &&
            x(
              `Slot "${e}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
            ),
          Hn(t(...i))
        ),
        r
      );
      return ((n._c = !1), n);
    },
    Ro = (e, t, r) => {
      const n = e._ctx;
      for (const i in e) {
        if (Un(i)) continue;
        const o = e[i];
        if (I(o)) t[i] = zc(i, o, n);
        else if (o != null) {
          process.env.NODE_ENV !== 'production' &&
            x(
              `Non-function value encountered for slot "${i}". Prefer function slots for better performance.`
            );
          const a = Hn(o);
          t[i] = () => a;
        }
      }
    },
    $o = (e, t) => {
      process.env.NODE_ENV !== 'production' &&
        !An(e.vnode) &&
        x(
          'Non-function value encountered for default slot. Prefer function slots for better performance.'
        );
      const r = Hn(t);
      e.slots.default = () => r;
    },
    Wn = (e, t, r) => {
      for (const n in t) (r || !Un(n)) && (e[n] = t[n]);
    },
    Kc = (e, t, r) => {
      const n = (e.slots = ko());
      if (e.vnode.shapeFlag & 32) {
        const i = t._;
        i ? (Wn(n, t, r), r && Nr(n, '_', i, !0)) : Ro(t, n);
      } else t && $o(e, t);
    },
    Gc = (e, t, r) => {
      const { vnode: n, slots: i } = e;
      let o = !0,
        a = W;
      if (n.shapeFlag & 32) {
        const s = t._;
        (s
          ? process.env.NODE_ENV !== 'production' && Fe
            ? (Wn(i, t, r), Me(e, 'set', '$slots'))
            : r && s === 1
              ? (o = !1)
              : Wn(i, t, r)
          : ((o = !t.$stable), Ro(t, i)),
          (a = t));
      } else t && ($o(e, t), (a = { default: 1 }));
      if (o) for (const s in i) !Un(s) && a[s] == null && delete i[s];
    };
  let er, Ye;
  function At(e, t) {
    (e.appContext.config.performance && qr() && Ye.mark(`vue-${t}-${e.uid}`),
      process.env.NODE_ENV !== 'production' && Ga(e, t, qr() ? Ye.now() : Date.now()));
  }
  function It(e, t) {
    if (e.appContext.config.performance && qr()) {
      const r = `vue-${t}-${e.uid}`,
        n = r + ':end',
        i = `<${lr(e, e.type)}> ${t}`;
      (Ye.mark(n), Ye.measure(i, r, n), Ye.clearMeasures(i), Ye.clearMarks(r), Ye.clearMarks(n));
    }
    process.env.NODE_ENV !== 'production' && Ya(e, t, qr() ? Ye.now() : Date.now());
  }
  function qr() {
    return (
      er !== void 0 ||
        (typeof window < 'u' && window.performance
          ? ((er = !0), (Ye = window.performance))
          : (er = !1)),
      er
    );
  }
  function Yc() {
    const e = [];
    if (process.env.NODE_ENV !== 'production' && e.length) {
      const t = e.length > 1;
      console.warn(`Feature flag${t ? 's' : ''} ${e.join(', ')} ${t ? 'are' : 'is'} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`);
    }
  }
  const Ee = tl;
  function Jc(e) {
    return Zc(e);
  }
  function Zc(e, t) {
    Yc();
    const r = jt();
    ((r.__VUE__ = !0),
      process.env.NODE_ENV !== 'production' && kn(r.__VUE_DEVTOOLS_GLOBAL_HOOK__, r));
    const {
        insert: n,
        remove: i,
        patchProp: o,
        createElement: a,
        createText: s,
        createComment: c,
        setText: f,
        setElementText: l,
        parentNode: u,
        nextSibling: p,
        setScopeId: m = Q,
        insertStaticContent: C,
      } = e,
      N = (
        d,
        h,
        g,
        y = null,
        v = null,
        b = null,
        S = void 0,
        E = null,
        w = process.env.NODE_ENV !== 'production' && Fe ? !1 : !!h.dynamicChildren
      ) => {
        if (d === h) return;
        (d && !sr(d, h) && ((y = on(d)), ut(d, v, b, !0), (d = null)),
          h.patchFlag === -2 && ((w = !1), (h.dynamicChildren = null)));
        const { type: _, ref: A, shapeFlag: O } = h;
        switch (_) {
          case tr:
            L(d, h, g, y);
            break;
          case Ae:
            $(d, h, g, y);
            break;
          case zr:
            d == null ? P(h, g, y, S) : process.env.NODE_ENV !== 'production' && D(d, h, g, S);
            break;
          case xe:
            nn(d, h, g, y, v, b, S, E, w);
            break;
          default:
            O & 1
              ? z(d, h, g, y, v, b, S, E, w)
              : O & 6
                ? Fs(d, h, g, y, v, b, S, E, w)
                : O & 64 || O & 128
                  ? _.process(d, h, g, y, v, b, S, E, w, mr)
                  : process.env.NODE_ENV !== 'production' &&
                    x('Invalid VNode type:', _, `(${typeof _})`);
        }
        A != null && v
          ? Jt(A, d && d.ref, b, h || d, !h)
          : A == null && d && d.ref != null && Jt(d.ref, null, b, d, !0);
      },
      L = (d, h, g, y) => {
        if (d == null) n((h.el = s(h.children)), g, y);
        else {
          const v = (h.el = d.el);
          h.children !== d.children && f(v, h.children);
        }
      },
      $ = (d, h, g, y) => {
        d == null ? n((h.el = c(h.children || '')), g, y) : (h.el = d.el);
      },
      P = (d, h, g, y) => {
        [d.el, d.anchor] = C(d.children, h, g, y, d.el, d.anchor);
      },
      D = (d, h, g, y) => {
        if (h.children !== d.children) {
          const v = p(d.anchor);
          (k(d), ([h.el, h.anchor] = C(h.children, g, v, y)));
        } else ((h.el = d.el), (h.anchor = d.anchor));
      },
      Z = ({ el: d, anchor: h }, g, y) => {
        let v;
        for (; d && d !== h; ) ((v = p(d)), n(d, g, y), (d = v));
        n(h, g, y);
      },
      k = ({ el: d, anchor: h }) => {
        let g;
        for (; d && d !== h; ) ((g = p(d)), i(d), (d = g));
        i(h);
      },
      z = (d, h, g, y, v, b, S, E, w) => {
        if ((h.type === 'svg' ? (S = 'svg') : h.type === 'math' && (S = 'mathml'), d == null))
          ie(h, g, y, v, b, S, E, w);
        else {
          const _ = d.el && d.el._isVueCE ? d.el : null;
          try {
            (_ && _._beginPatch(), Ze(d, h, v, b, S, E, w));
          } finally {
            _ && _._endPatch();
          }
        }
      },
      ie = (d, h, g, y, v, b, S, E) => {
        let w, _;
        const { props: A, shapeFlag: O, transition: T, dirs: M } = d;
        if (
          ((w = d.el = a(d.type, b, A && A.is, A)),
          O & 8 ? l(w, d.children) : O & 16 && ge(d.children, w, null, y, v, Bn(d, b), S, E),
          M && bt(d, null, y, 'created'),
          oe(w, d, d.scopeId, S, y),
          A)
        ) {
          for (const K in A) K !== 'value' && !Dt(K) && o(w, K, null, A[K], b, y);
          ('value' in A && o(w, 'value', null, A.value, b),
            (_ = A.onVnodeBeforeMount) && Ue(_, y, d));
        }
        (process.env.NODE_ENV !== 'production' &&
          (Nr(w, '__vnode', d, !0), Nr(w, '__vueParentComponent', y, !0)),
          M && bt(d, null, y, 'beforeMount'));
        const H = Qc(v, T);
        (H && T.beforeEnter(w),
          n(w, h, g),
          ((_ = A && A.onVnodeMounted) || H || M) &&
            Ee(() => {
              (_ && Ue(_, y, d), H && T.enter(w), M && bt(d, null, y, 'mounted'));
            }, v));
      },
      oe = (d, h, g, y, v) => {
        if ((g && m(d, g), y)) for (let b = 0; b < y.length; b++) m(d, y[b]);
        if (v) {
          let b = v.subTree;
          if (
            (process.env.NODE_ENV !== 'production' &&
              b.patchFlag > 0 &&
              b.patchFlag & 2048 &&
              (b = Fn(b.children) || b),
            h === b || (jo(b.type) && (b.ssContent === h || b.ssFallback === h)))
          ) {
            const S = v.vnode;
            oe(d, S, S.scopeId, S.slotScopeIds, v.parent);
          }
        }
      },
      ge = (d, h, g, y, v, b, S, E, w = 0) => {
        for (let _ = w; _ < d.length; _++) {
          const A = (d[_] = E ? st(d[_]) : Ie(d[_]));
          N(null, A, h, g, y, v, b, S, E);
        }
      },
      Ze = (d, h, g, y, v, b, S) => {
        const E = (h.el = d.el);
        process.env.NODE_ENV !== 'production' && (E.__vnode = h);
        let { patchFlag: w, dynamicChildren: _, dirs: A } = h;
        w |= d.patchFlag & 16;
        const O = d.props || W,
          T = h.props || W;
        let M;
        if (
          (g && yt(g, !1),
          (M = T.onVnodeBeforeUpdate) && Ue(M, g, h, d),
          A && bt(h, d, g, 'beforeUpdate'),
          g && yt(g, !0),
          process.env.NODE_ENV !== 'production' && Fe && ((w = 0), (S = !1), (_ = null)),
          ((O.innerHTML && T.innerHTML == null) || (O.textContent && T.textContent == null)) &&
            l(E, ''),
          _
            ? (ct(d.dynamicChildren, _, E, g, y, Bn(h, v), b),
              process.env.NODE_ENV !== 'production' && Xr(d, h))
            : S || We(d, h, E, null, g, y, Bn(h, v), b, !1),
          w > 0)
        ) {
          if (w & 16) Pe(E, O, T, g, v);
          else if (
            (w & 2 && O.class !== T.class && o(E, 'class', null, T.class, v),
            w & 4 && o(E, 'style', O.style, T.style, v),
            w & 8)
          ) {
            const H = h.dynamicProps;
            for (let K = 0; K < H.length; K++) {
              const X = H[K],
                ve = O[X],
                be = T[X];
              (be !== ve || X === 'value') && o(E, X, ve, be, v, g);
            }
          }
          w & 1 && d.children !== h.children && l(E, h.children);
        } else !S && _ == null && Pe(E, O, T, g, v);
        ((M = T.onVnodeUpdated) || A) &&
          Ee(() => {
            (M && Ue(M, g, h, d), A && bt(h, d, g, 'updated'));
          }, y);
      },
      ct = (d, h, g, y, v, b, S) => {
        for (let E = 0; E < h.length; E++) {
          const w = d[E],
            _ = h[E],
            A = w.el && (w.type === xe || !sr(w, _) || w.shapeFlag & 198) ? u(w.el) : g;
          N(w, _, A, null, y, v, b, S, !0);
        }
      },
      Pe = (d, h, g, y, v) => {
        if (h !== g) {
          if (h !== W) for (const b in h) !Dt(b) && !(b in g) && o(d, b, h[b], null, v, y);
          for (const b in g) {
            if (Dt(b)) continue;
            const S = g[b],
              E = h[b];
            S !== E && b !== 'value' && o(d, b, E, S, v, y);
          }
          'value' in g && o(d, 'value', h.value, g.value, v);
        }
      },
      nn = (d, h, g, y, v, b, S, E, w) => {
        const _ = (h.el = d ? d.el : s('')),
          A = (h.anchor = d ? d.anchor : s(''));
        let { patchFlag: O, dynamicChildren: T, slotScopeIds: M } = h;
        (process.env.NODE_ENV !== 'production' &&
          (Fe || O & 2048) &&
          ((O = 0), (w = !1), (T = null)),
          M && (E = E ? E.concat(M) : M),
          d == null
            ? (n(_, g, y), n(A, g, y), ge(h.children || [], g, A, v, b, S, E, w))
            : O > 0 && O & 64 && T && d.dynamicChildren
              ? (ct(d.dynamicChildren, T, g, v, b, S, E),
                process.env.NODE_ENV !== 'production'
                  ? Xr(d, h)
                  : (h.key != null || (v && h === v.subTree)) && Xr(d, h, !0))
              : We(d, h, g, A, v, b, S, E, w));
      },
      Fs = (d, h, g, y, v, b, S, E, w) => {
        ((h.slotScopeIds = E),
          d == null
            ? h.shapeFlag & 512
              ? v.ctx.activate(h, g, y, S, w)
              : lt(h, g, y, v, b, S, w)
            : me(d, h, w));
      },
      lt = (d, h, g, y, v, b, S) => {
        const E = (d.component = ll(d, y, v));
        if (
          (process.env.NODE_ENV !== 'production' && E.type.__hmrId && ja(E),
          process.env.NODE_ENV !== 'production' && (Ir(d), At(E, 'mount')),
          An(d) && (E.ctx.renderer = mr),
          process.env.NODE_ENV !== 'production' && At(E, 'init'),
          dl(E, !1, S),
          process.env.NODE_ENV !== 'production' && It(E, 'init'),
          process.env.NODE_ENV !== 'production' && Fe && (d.el = null),
          E.asyncDep)
        ) {
          if ((v && v.registerDep(E, U, S), !d.el)) {
            const w = (E.subTree = it(Ae));
            ($(null, w, h, g), (d.placeholder = w.el));
          }
        } else U(E, d, h, g, v, b, S);
        process.env.NODE_ENV !== 'production' && (Pr(), It(E, 'mount'));
      },
      me = (d, h, g) => {
        const y = (h.component = d.component);
        if (Lc(d, h, g))
          if (y.asyncDep && !y.asyncResolved) {
            (process.env.NODE_ENV !== 'production' && Ir(h),
              j(y, h, g),
              process.env.NODE_ENV !== 'production' && Pr());
            return;
          } else ((y.next = h), y.update());
        else ((h.el = d.el), (y.vnode = h));
      },
      U = (d, h, g, y, v, b, S) => {
        const E = () => {
          if (d.isMounted) {
            let { next: O, bu: T, u: M, parent: H, vnode: K } = d;
            {
              const qe = Do(d);
              if (qe) {
                (O && ((O.el = K.el), j(d, O, S)),
                  qe.asyncDep.then(() => {
                    d.isUnmounted || E();
                  }));
                return;
              }
            }
            let X = O,
              ve;
            (process.env.NODE_ENV !== 'production' && Ir(O || d.vnode),
              yt(d, !1),
              O ? ((O.el = K.el), j(d, O, S)) : (O = K),
              T && Ft(T),
              (ve = O.props && O.props.onVnodeBeforeUpdate) && Ue(ve, H, O, K),
              yt(d, !0),
              process.env.NODE_ENV !== 'production' && At(d, 'render'));
            const be = No(d);
            process.env.NODE_ENV !== 'production' && It(d, 'render');
            const Be = d.subTree;
            ((d.subTree = be),
              process.env.NODE_ENV !== 'production' && At(d, 'patch'),
              N(Be, be, u(Be.el), on(Be), d, v, b),
              process.env.NODE_ENV !== 'production' && It(d, 'patch'),
              (O.el = be.el),
              X === null && Rc(d, be.el),
              M && Ee(M, v),
              (ve = O.props && O.props.onVnodeUpdated) && Ee(() => Ue(ve, H, O, K), v),
              process.env.NODE_ENV !== 'production' && eo(d),
              process.env.NODE_ENV !== 'production' && Pr());
          } else {
            let O;
            const { el: T, props: M } = h,
              { bm: H, m: K, parent: X, root: ve, type: be } = d,
              Be = Zt(h);
            (yt(d, !1),
              H && Ft(H),
              !Be && (O = M && M.onVnodeBeforeMount) && Ue(O, X, h),
              yt(d, !0));
            {
              (ve.ce && ve.ce._def.shadowRoot !== !1 && ve.ce._injectChildStyle(be),
                process.env.NODE_ENV !== 'production' && At(d, 'render'));
              const qe = (d.subTree = No(d));
              (process.env.NODE_ENV !== 'production' && It(d, 'render'),
                process.env.NODE_ENV !== 'production' && At(d, 'patch'),
                N(null, qe, g, y, d, v, b),
                process.env.NODE_ENV !== 'production' && It(d, 'patch'),
                (h.el = qe.el));
            }
            if ((K && Ee(K, v), !Be && (O = M && M.onVnodeMounted))) {
              const qe = h;
              Ee(() => Ue(O, X, qe), v);
            }
            ((h.shapeFlag & 256 || (X && Zt(X.vnode) && X.vnode.shapeFlag & 256)) &&
              d.a &&
              Ee(d.a, v),
              (d.isMounted = !0),
              process.env.NODE_ENV !== 'production' && Xa(d),
              (h = g = y = null));
          }
        };
        d.scope.on();
        const w = (d.effect = new Ei(E));
        d.scope.off();
        const _ = (d.update = w.run.bind(w)),
          A = (d.job = w.runIfDirty.bind(w));
        ((A.i = d),
          (A.id = d.uid),
          (w.scheduler = () => Lr(A)),
          yt(d, !0),
          process.env.NODE_ENV !== 'production' &&
            ((w.onTrack = d.rtc ? O => Ft(d.rtc, O) : void 0),
            (w.onTrigger = d.rtg ? O => Ft(d.rtg, O) : void 0)),
          _());
      },
      j = (d, h, g) => {
        h.component = d;
        const y = d.vnode.props;
        ((d.vnode = h),
          (d.next = null),
          Fc(d, h.props, y, g),
          Gc(d, h.children, g),
          ke(),
          Gi(d),
          Te());
      },
      We = (d, h, g, y, v, b, S, E, w = !1) => {
        const _ = d && d.children,
          A = d ? d.shapeFlag : 0,
          O = h.children,
          { patchFlag: T, shapeFlag: M } = h;
        if (T > 0) {
          if (T & 128) {
            pr(_, O, g, y, v, b, S, E, w);
            return;
          } else if (T & 256) {
            ui(_, O, g, y, v, b, S, E, w);
            return;
          }
        }
        M & 8
          ? (A & 16 && gr(_, v, b), O !== _ && l(g, O))
          : A & 16
            ? M & 16
              ? pr(_, O, g, y, v, b, S, E, w)
              : gr(_, v, b, !0)
            : (A & 8 && l(g, ''), M & 16 && ge(O, g, y, v, b, S, E, w));
      },
      ui = (d, h, g, y, v, b, S, E, w) => {
        ((d = d || Nt), (h = h || Nt));
        const _ = d.length,
          A = h.length,
          O = Math.min(_, A);
        let T;
        for (T = 0; T < O; T++) {
          const M = (h[T] = w ? st(h[T]) : Ie(h[T]));
          N(d[T], M, g, null, v, b, S, E, w);
        }
        _ > A ? gr(d, v, b, !0, !1, O) : ge(h, g, y, v, b, S, E, w, O);
      },
      pr = (d, h, g, y, v, b, S, E, w) => {
        let _ = 0;
        const A = h.length;
        let O = d.length - 1,
          T = A - 1;
        for (; _ <= O && _ <= T; ) {
          const M = d[_],
            H = (h[_] = w ? st(h[_]) : Ie(h[_]));
          if (sr(M, H)) N(M, H, g, null, v, b, S, E, w);
          else break;
          _++;
        }
        for (; _ <= O && _ <= T; ) {
          const M = d[O],
            H = (h[T] = w ? st(h[T]) : Ie(h[T]));
          if (sr(M, H)) N(M, H, g, null, v, b, S, E, w);
          else break;
          (O--, T--);
        }
        if (_ > O) {
          if (_ <= T) {
            const M = T + 1,
              H = M < A ? h[M].el : y;
            for (; _ <= T; ) (N(null, (h[_] = w ? st(h[_]) : Ie(h[_])), g, H, v, b, S, E, w), _++);
          }
        } else if (_ > T) for (; _ <= O; ) (ut(d[_], v, b, !0), _++);
        else {
          const M = _,
            H = _,
            K = new Map();
          for (_ = H; _ <= T; _++) {
            const le = (h[_] = w ? st(h[_]) : Ie(h[_]));
            le.key != null &&
              (process.env.NODE_ENV !== 'production' &&
                K.has(le.key) &&
                x(
                  'Duplicate keys found during update:',
                  JSON.stringify(le.key),
                  'Make sure keys are unique.'
                ),
              K.set(le.key, _));
          }
          let X,
            ve = 0;
          const be = T - H + 1;
          let Be = !1,
            qe = 0;
          const vr = new Array(be);
          for (_ = 0; _ < be; _++) vr[_] = 0;
          for (_ = M; _ <= O; _++) {
            const le = d[_];
            if (ve >= be) {
              ut(le, v, b, !0);
              continue;
            }
            let Xe;
            if (le.key != null) Xe = K.get(le.key);
            else
              for (X = H; X <= T; X++)
                if (vr[X - H] === 0 && sr(le, h[X])) {
                  Xe = X;
                  break;
                }
            Xe === void 0
              ? ut(le, v, b, !0)
              : ((vr[Xe - H] = _ + 1),
                Xe >= qe ? (qe = Xe) : (Be = !0),
                N(le, h[Xe], g, null, v, b, S, E, w),
                ve++);
          }
          const Us = Be ? el(vr) : Nt;
          for (X = Us.length - 1, _ = be - 1; _ >= 0; _--) {
            const le = H + _,
              Xe = h[le],
              Hs = h[le + 1],
              Ws = le + 1 < A ? Hs.el || Hs.placeholder : y;
            vr[_] === 0
              ? N(null, Xe, g, Ws, v, b, S, E, w)
              : Be && (X < 0 || _ !== Us[X] ? Rt(Xe, g, Ws, 2) : X--);
          }
        }
      },
      Rt = (d, h, g, y, v = null) => {
        const { el: b, type: S, transition: E, children: w, shapeFlag: _ } = d;
        if (_ & 6) {
          Rt(d.component.subTree, h, g, y);
          return;
        }
        if (_ & 128) {
          d.suspense.move(h, g, y);
          return;
        }
        if (_ & 64) {
          S.move(d, h, g, mr);
          return;
        }
        if (S === xe) {
          n(b, h, g);
          for (let O = 0; O < w.length; O++) Rt(w[O], h, g, y);
          n(d.anchor, h, g);
          return;
        }
        if (S === zr) {
          Z(d, h, g);
          return;
        }
        if (y !== 2 && _ & 1 && E)
          if (y === 0) (E.beforeEnter(b), n(b, h, g), Ee(() => E.enter(b), v));
          else {
            const { leave: O, delayLeave: T, afterLeave: M } = E,
              H = () => {
                d.ctx.isUnmounted ? i(b) : n(b, h, g);
              },
              K = () => {
                (b._isLeaving && b[tc](!0),
                  O(b, () => {
                    (H(), M && M());
                  }));
              };
            T ? T(b, H, K) : K();
          }
        else n(b, h, g);
      },
      ut = (d, h, g, y = !1, v = !1) => {
        const {
          type: b,
          props: S,
          ref: E,
          children: w,
          dynamicChildren: _,
          shapeFlag: A,
          patchFlag: O,
          dirs: T,
          cacheIndex: M,
        } = d;
        if (
          (O === -2 && (v = !1),
          E != null && (ke(), Jt(E, null, g, d, !0), Te()),
          M != null && (h.renderCache[M] = void 0),
          A & 256)
        ) {
          h.ctx.deactivate(d);
          return;
        }
        const H = A & 1 && T,
          K = !Zt(d);
        let X;
        if ((K && (X = S && S.onVnodeBeforeUnmount) && Ue(X, h, d), A & 6)) Pd(d.component, g, y);
        else {
          if (A & 128) {
            d.suspense.unmount(g, y);
            return;
          }
          (H && bt(d, null, h, 'beforeUnmount'),
            A & 64
              ? d.type.remove(d, h, g, mr, y)
              : _ && !_.hasOnce && (b !== xe || (O > 0 && O & 64))
                ? gr(_, h, g, !1, !0)
                : ((b === xe && O & 384) || (!v && A & 16)) && gr(w, h, g),
            y && di(d));
        }
        ((K && (X = S && S.onVnodeUnmounted)) || H) &&
          Ee(() => {
            (X && Ue(X, h, d), H && bt(d, null, h, 'unmounted'));
          }, g);
      },
      di = d => {
        const { type: h, el: g, anchor: y, transition: v } = d;
        if (h === xe) {
          process.env.NODE_ENV !== 'production' &&
          d.patchFlag > 0 &&
          d.patchFlag & 2048 &&
          v &&
          !v.persisted
            ? d.children.forEach(S => {
                S.type === Ae ? i(S.el) : di(S);
              })
            : Id(g, y);
          return;
        }
        if (h === zr) {
          k(d);
          return;
        }
        const b = () => {
          (i(g), v && !v.persisted && v.afterLeave && v.afterLeave());
        };
        if (d.shapeFlag & 1 && v && !v.persisted) {
          const { leave: S, delayLeave: E } = v,
            w = () => S(g, b);
          E ? E(d.el, b, w) : w();
        } else b();
      },
      Id = (d, h) => {
        let g;
        for (; d !== h; ) ((g = p(d)), i(d), (d = g));
        i(h);
      },
      Pd = (d, h, g) => {
        process.env.NODE_ENV !== 'production' && d.type.__hmrId && Ua(d);
        const { bum: y, scope: v, job: b, subTree: S, um: E, m: w, a: _ } = d;
        (Fo(w),
          Fo(_),
          y && Ft(y),
          v.stop(),
          b && ((b.flags |= 8), ut(S, d, h, g)),
          E && Ee(E, h),
          Ee(() => {
            d.isUnmounted = !0;
          }, h),
          process.env.NODE_ENV !== 'production' && Ka(d));
      },
      gr = (d, h, g, y = !1, v = !1, b = 0) => {
        for (let S = b; S < d.length; S++) ut(d[S], h, g, y, v);
      },
      on = d => {
        if (d.shapeFlag & 6) return on(d.component.subTree);
        if (d.shapeFlag & 128) return d.suspense.next();
        const h = p(d.anchor || d.el),
          g = h && h[Qa];
        return g ? p(g) : h;
      };
    let fi = !1;
    const js = (d, h, g) => {
        (d == null
          ? h._vnode && ut(h._vnode, null, null, !0)
          : N(h._vnode || null, d, h, null, null, null, g),
          (h._vnode = d),
          fi || ((fi = !0), Gi(), Yi(), (fi = !1)));
      },
      mr = { p: N, um: ut, m: Rt, r: di, mt: lt, mc: ge, pc: We, pbc: ct, n: on, o: e };
    return { render: js, hydrate: void 0, createApp: Sc(js) };
  }
  function Bn({ type: e, props: t }, r) {
    return (r === 'svg' && e === 'foreignObject') ||
      (r === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html'))
      ? void 0
      : r;
  }
  function yt({ effect: e, job: t }, r) {
    r ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
  }
  function Qc(e, t) {
    return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
  }
  function Xr(e, t, r = !1) {
    const n = e.children,
      i = t.children;
    if (V(n) && V(i))
      for (let o = 0; o < n.length; o++) {
        const a = n[o];
        let s = i[o];
        (s.shapeFlag & 1 &&
          !s.dynamicChildren &&
          ((s.patchFlag <= 0 || s.patchFlag === 32) && ((s = i[o] = st(i[o])), (s.el = a.el)),
          !r && s.patchFlag !== -2 && Xr(a, s)),
          s.type === tr && s.patchFlag !== -1 && (s.el = a.el),
          s.type === Ae && !s.el && (s.el = a.el),
          process.env.NODE_ENV !== 'production' && s.el && (s.el.__vnode = s));
      }
  }
  function el(e) {
    const t = e.slice(),
      r = [0];
    let n, i, o, a, s;
    const c = e.length;
    for (n = 0; n < c; n++) {
      const f = e[n];
      if (f !== 0) {
        if (((i = r[r.length - 1]), e[i] < f)) {
          ((t[n] = i), r.push(n));
          continue;
        }
        for (o = 0, a = r.length - 1; o < a; )
          ((s = (o + a) >> 1), e[r[s]] < f ? (o = s + 1) : (a = s));
        f < e[r[o]] && (o > 0 && (t[n] = r[o - 1]), (r[o] = n));
      }
    }
    for (o = r.length, a = r[o - 1]; o-- > 0; ) ((r[o] = a), (a = t[a]));
    return r;
  }
  function Do(e) {
    const t = e.subTree.component;
    if (t) return t.asyncDep && !t.asyncResolved ? t : Do(t);
  }
  function Fo(e) {
    if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
  }
  const jo = e => e.__isSuspense;
  function tl(e, t) {
    t && t.pendingBranch ? (V(e) ? t.effects.push(...e) : t.effects.push(e)) : Ki(e);
  }
  const xe = Symbol.for('v-fgt'),
    tr = Symbol.for('v-txt'),
    Ae = Symbol.for('v-cmt'),
    zr = Symbol.for('v-stc'),
    rr = [];
  let Ne = null;
  function nr(e = !1) {
    rr.push((Ne = e ? null : []));
  }
  function rl() {
    (rr.pop(), (Ne = rr[rr.length - 1] || null));
  }
  let ir = 1;
  function Uo(e, t = !1) {
    ((ir += e), e < 0 && Ne && t && (Ne.hasOnce = !0));
  }
  function nl(e) {
    return ((e.dynamicChildren = ir > 0 ? Ne || Nt : null), rl(), ir > 0 && Ne && Ne.push(e), e);
  }
  function or(e, t, r, n, i, o) {
    return nl(je(e, t, r, n, i, o, !0));
  }
  function Kr(e) {
    return e ? e.__v_isVNode === !0 : !1;
  }
  function sr(e, t) {
    if (process.env.NODE_ENV !== 'production' && t.shapeFlag & 6 && e.component) {
      const r = Rr.get(t.type);
      if (r && r.has(e.component)) return ((e.shapeFlag &= -257), (t.shapeFlag &= -513), !1);
    }
    return e.type === t.type && e.key === t.key;
  }
  const il = (...e) => Wo(...e),
    Ho = ({ key: e }) => e ?? null,
    Gr = ({ ref: e, ref_key: t, ref_for: r }) => (
      typeof e == 'number' && (e = '' + e),
      e != null ? (Y(e) || te(e) || I(e) ? { i: we, r: e, k: t, f: !!r } : e) : null
    );
  function je(e, t = null, r = null, n = 0, i = null, o = e === xe ? 0 : 1, a = !1, s = !1) {
    const c = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e,
      props: t,
      key: t && Ho(t),
      ref: t && Gr(t),
      scopeId: ro,
      slotScopeIds: null,
      children: r,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag: o,
      patchFlag: n,
      dynamicProps: i,
      dynamicChildren: null,
      appContext: null,
      ctx: we,
    };
    return (
      s ? (qn(c, r), o & 128 && e.normalize(c)) : r && (c.shapeFlag |= Y(r) ? 8 : 16),
      process.env.NODE_ENV !== 'production' &&
        c.key !== c.key &&
        x('VNode created with invalid key (NaN). VNode type:', c.type),
      ir > 0 && !a && Ne && (c.patchFlag > 0 || o & 6) && c.patchFlag !== 32 && Ne.push(c),
      c
    );
  }
  const it = process.env.NODE_ENV !== 'production' ? il : Wo;
  function Wo(e, t = null, r = null, n = 0, i = null, o = !1) {
    if (
      ((!e || e === pc) &&
        (process.env.NODE_ENV !== 'production' &&
          !e &&
          x(`Invalid vnode type when creating vnode: ${e}.`),
        (e = Ae)),
      Kr(e))
    ) {
      const s = ot(e, t, !0);
      return (
        r && qn(s, r),
        ir > 0 && !o && Ne && (s.shapeFlag & 6 ? (Ne[Ne.indexOf(e)] = s) : Ne.push(s)),
        (s.patchFlag = -2),
        s
      );
    }
    if ((Qo(e) && (e = e.__vccOpts), t)) {
      t = ol(t);
      let { class: s, style: c } = t;
      (s && !Y(s) && (t.class = xt(s)),
        q(c) && (Tr(c) && !V(c) && (c = G({}, c)), (t.style = un(c))));
    }
    const a = Y(e) ? 1 : jo(e) ? 128 : ec(e) ? 64 : q(e) ? 4 : I(e) ? 2 : 0;
    return (
      process.env.NODE_ENV !== 'production' &&
        a & 4 &&
        Tr(e) &&
        ((e = R(e)),
        x(
          'Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.',
          `
Component that was made reactive: `,
          e
        )),
      je(e, t, r, n, i, a, o, !0)
    );
  }
  function ol(e) {
    return e ? (Tr(e) || To(e) ? G({}, e) : e) : null;
  }
  function ot(e, t, r = !1, n = !1) {
    const { props: i, ref: o, patchFlag: a, children: s, transition: c } = e,
      f = t ? qo(i || {}, t) : i,
      l = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e.type,
        props: f,
        key: f && Ho(f),
        ref: t && t.ref ? (r && o ? (V(o) ? o.concat(Gr(t)) : [o, Gr(t)]) : Gr(t)) : o,
        scopeId: e.scopeId,
        slotScopeIds: e.slotScopeIds,
        children: process.env.NODE_ENV !== 'production' && a === -1 && V(s) ? s.map(Bo) : s,
        target: e.target,
        targetStart: e.targetStart,
        targetAnchor: e.targetAnchor,
        staticCount: e.staticCount,
        shapeFlag: e.shapeFlag,
        patchFlag: t && e.type !== xe ? (a === -1 ? 16 : a | 16) : a,
        dynamicProps: e.dynamicProps,
        dynamicChildren: e.dynamicChildren,
        appContext: e.appContext,
        dirs: e.dirs,
        transition: c,
        component: e.component,
        suspense: e.suspense,
        ssContent: e.ssContent && ot(e.ssContent),
        ssFallback: e.ssFallback && ot(e.ssFallback),
        placeholder: e.placeholder,
        el: e.el,
        anchor: e.anchor,
        ctx: e.ctx,
        ce: e.ce,
      };
    return (c && n && Vn(l, c.clone(l)), l);
  }
  function Bo(e) {
    const t = ot(e);
    return (V(e.children) && (t.children = e.children.map(Bo)), t);
  }
  function sl(e = ' ', t = 0) {
    return it(tr, null, e, t);
  }
  function Ie(e) {
    return e == null || typeof e == 'boolean'
      ? it(Ae)
      : V(e)
        ? it(xe, null, e.slice())
        : Kr(e)
          ? st(e)
          : it(tr, null, String(e));
  }
  function st(e) {
    return (e.el === null && e.patchFlag !== -1) || e.memo ? e : ot(e);
  }
  function qn(e, t) {
    let r = 0;
    const { shapeFlag: n } = e;
    if (t == null) t = null;
    else if (V(t)) r = 16;
    else if (typeof t == 'object')
      if (n & 65) {
        const i = t.default;
        i && (i._c && (i._d = !1), qn(e, i()), i._c && (i._d = !0));
        return;
      } else {
        r = 32;
        const i = t._;
        !i && !To(t)
          ? (t._ctx = we)
          : i === 3 && we && (we.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
      }
    else
      I(t)
        ? ((t = { default: t, _ctx: we }), (r = 32))
        : ((t = String(t)), n & 64 ? ((r = 16), (t = [sl(t)])) : (r = 8));
    ((e.children = t), (e.shapeFlag |= r));
  }
  function qo(...e) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r];
      for (const i in n)
        if (i === 'class') t.class !== n.class && (t.class = xt([t.class, n.class]));
        else if (i === 'style') t.style = un([t.style, n.style]);
        else if ($t(i)) {
          const o = t[i],
            a = n[i];
          a && o !== a && !(V(o) && o.includes(a)) && (t[i] = o ? [].concat(o, a) : a);
        } else i !== '' && (t[i] = n[i]);
    }
    return t;
  }
  function Ue(e, t, r, n = null) {
    $e(e, t, 7, [r, n]);
  }
  const al = _o();
  let cl = 0;
  function ll(e, t, r) {
    const n = e.type,
      i = (t ? t.appContext : e.appContext) || al,
      o = {
        uid: cl++,
        vnode: e,
        type: n,
        parent: t,
        appContext: i,
        root: null,
        next: null,
        subTree: null,
        effect: null,
        update: null,
        job: null,
        scope: new sa(!0),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: t ? t.provides : Object.create(i.provides),
        ids: t ? t.ids : ['', 0, 0],
        accessCache: null,
        renderCache: [],
        components: null,
        directives: null,
        propsOptions: Ao(n, i),
        emitsOptions: Eo(n, i),
        emit: null,
        emitted: null,
        propsDefaults: W,
        inheritAttrs: n.inheritAttrs,
        ctx: W,
        data: W,
        props: W,
        attrs: W,
        slots: W,
        refs: W,
        setupState: W,
        setupContext: null,
        suspense: r,
        suspenseId: r ? r.pendingId : 0,
        asyncDep: null,
        asyncResolved: !1,
        isMounted: !1,
        isUnmounted: !1,
        isDeactivated: !1,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null,
      };
    return (
      process.env.NODE_ENV !== 'production' ? (o.ctx = gc(o)) : (o.ctx = { _: o }),
      (o.root = t ? t.root : o),
      (o.emit = Ac.bind(null, o)),
      e.ce && e.ce(o),
      o
    );
  }
  let re = null;
  const Xo = () => re || we;
  let Yr, Xn;
  {
    const e = jt(),
      t = (r, n) => {
        let i;
        return (
          (i = e[r]) || (i = e[r] = []),
          i.push(n),
          o => {
            i.length > 1 ? i.forEach(a => a(o)) : i[0](o);
          }
        );
      };
    ((Yr = t('__VUE_INSTANCE_SETTERS__', r => (re = r))),
      (Xn = t('__VUE_SSR_SETTERS__', r => (cr = r))));
  }
  const ar = e => {
      const t = re;
      return (
        Yr(e),
        e.scope.on(),
        () => {
          (e.scope.off(), Yr(t));
        }
      );
    },
    zo = () => {
      (re && re.scope.off(), Yr(null));
    },
    ul = _e('slot,component');
  function zn(e, { isNativeTag: t }) {
    (ul(e) || t(e)) && x('Do not use built-in or reserved HTML elements as component id: ' + e);
  }
  function Ko(e) {
    return e.vnode.shapeFlag & 4;
  }
  let cr = !1;
  function dl(e, t = !1, r = !1) {
    t && Xn(t);
    const { props: n, children: i } = e.vnode,
      o = Ko(e);
    ($c(e, n, o, t), Kc(e, i, r || t));
    const a = o ? fl(e, t) : void 0;
    return (t && Xn(!1), a);
  }
  function fl(e, t) {
    const r = e.type;
    if (process.env.NODE_ENV !== 'production') {
      if ((r.name && zn(r.name, e.appContext.config), r.components)) {
        const i = Object.keys(r.components);
        for (let o = 0; o < i.length; o++) zn(i[o], e.appContext.config);
      }
      if (r.directives) {
        const i = Object.keys(r.directives);
        for (let o = 0; o < i.length; o++) no(i[o]);
      }
      r.compilerOptions &&
        hl() &&
        x(
          '"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.'
        );
    }
    ((e.accessCache = Object.create(null)),
      (e.proxy = new Proxy(e.ctx, fo)),
      process.env.NODE_ENV !== 'production' && mc(e));
    const { setup: n } = r;
    if (n) {
      ke();
      const i = (e.setupContext = n.length > 1 ? gl(e) : null),
        o = ar(e),
        a = Ct(n, e, 0, [process.env.NODE_ENV !== 'production' ? Le(e.props) : e.props, i]),
        s = an(a);
      if ((Te(), o(), (s || e.sp) && !Zt(e) && oo(e), s)) {
        if ((a.then(zo, zo), t))
          return a
            .then(c => {
              Go(e, c, t);
            })
            .catch(c => {
              zt(c, e, 0);
            });
        if (((e.asyncDep = a), process.env.NODE_ENV !== 'production' && !e.suspense)) {
          const c = lr(e, r);
          x(
            `Component <${c}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
          );
        }
      } else Go(e, a, t);
    } else Yo(e, t);
  }
  function Go(e, t, r) {
    (I(t)
      ? e.type.__ssrInlineRender
        ? (e.ssrRender = t)
        : (e.render = t)
      : q(t)
        ? (process.env.NODE_ENV !== 'production' &&
            Kr(t) &&
            x('setup() should not return VNodes directly - return a render function instead.'),
          process.env.NODE_ENV !== 'production' && (e.devtoolsRawSetupState = t),
          (e.setupState = Wi(t)),
          process.env.NODE_ENV !== 'production' && vc(e))
        : process.env.NODE_ENV !== 'production' &&
          t !== void 0 &&
          x(`setup() should return an object. Received: ${t === null ? 'null' : typeof t}`),
      Yo(e, r));
  }
  const hl = () => !0;
  function Yo(e, t, r) {
    const n = e.type;
    e.render || (e.render = n.render || Q);
    {
      const i = ar(e);
      ke();
      try {
        _c(e);
      } finally {
        (Te(), i());
      }
    }
    process.env.NODE_ENV !== 'production' &&
      !n.render &&
      e.render === Q &&
      !t &&
      (n.template
        ? x(
            'Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".'
          )
        : x('Component is missing template or render function: ', n));
  }
  const Jo =
    process.env.NODE_ENV !== 'production'
      ? {
          get(e, t) {
            return (Br(), ee(e, 'get', ''), e[t]);
          },
          set() {
            return (x('setupContext.attrs is readonly.'), !1);
          },
          deleteProperty() {
            return (x('setupContext.attrs is readonly.'), !1);
          },
        }
      : {
          get(e, t) {
            return (ee(e, 'get', ''), e[t]);
          },
        };
  function pl(e) {
    return new Proxy(e.slots, {
      get(t, r) {
        return (ee(e, 'get', '$slots'), t[r]);
      },
    });
  }
  function gl(e) {
    const t = r => {
      if (
        process.env.NODE_ENV !== 'production' &&
        (e.exposed && x('expose() should be called only once per setup().'), r != null)
      ) {
        let n = typeof r;
        (n === 'object' && (V(r) ? (n = 'array') : te(r) && (n = 'ref')),
          n !== 'object' && x(`expose() should be passed a plain object, received ${n}.`));
      }
      e.exposed = r || {};
    };
    if (process.env.NODE_ENV !== 'production') {
      let r, n;
      return Object.freeze({
        get attrs() {
          return r || (r = new Proxy(e.attrs, Jo));
        },
        get slots() {
          return n || (n = pl(e));
        },
        get emit() {
          return (i, ...o) => e.emit(i, ...o);
        },
        expose: t,
      });
    } else return { attrs: new Proxy(e.attrs, Jo), slots: e.slots, emit: e.emit, expose: t };
  }
  function Kn(e) {
    return e.exposed
      ? e.exposeProxy ||
          (e.exposeProxy = new Proxy(Wi(Ca(e.exposed)), {
            get(t, r) {
              if (r in t) return t[r];
              if (r in _t) return _t[r](e);
            },
            has(t, r) {
              return r in t || r in _t;
            },
          }))
      : e.proxy;
  }
  const ml = /(?:^|[-_])\w/g,
    vl = e => e.replace(ml, t => t.toUpperCase()).replace(/[-_]/g, '');
  function Zo(e, t = !0) {
    return I(e) ? e.displayName || e.name : e.name || (t && e.__name);
  }
  function lr(e, t, r = !1) {
    let n = Zo(t);
    if (!n && t.__file) {
      const i = t.__file.match(/([^/\\]+)\.\w+$/);
      i && (n = i[1]);
    }
    if (!n && e) {
      const i = o => {
        for (const a in o) if (o[a] === t) return a;
      };
      n =
        i(e.components) || (e.parent && i(e.parent.type.components)) || i(e.appContext.components);
    }
    return n ? vl(n) : r ? 'App' : 'Anonymous';
  }
  function Qo(e) {
    return I(e) && '__vccOpts' in e;
  }
  const Jr = (e, t) => {
    const r = Va(e, t, cr);
    if (process.env.NODE_ENV !== 'production') {
      const n = Xo();
      n && n.appContext.config.warnRecursiveComputed && (r._warnRecursive = !0);
    }
    return r;
  };
  function bl() {
    if (process.env.NODE_ENV === 'production' || typeof window > 'u') return;
    const e = { style: 'color:#3ba776' },
      t = { style: 'color:#1677ff' },
      r = { style: 'color:#f5222d' },
      n = { style: 'color:#eb2f96' },
      i = {
        __vue_custom_formatter: !0,
        header(u) {
          if (!q(u)) return null;
          if (u.__isVue) return ['div', e, 'VueInstance'];
          if (te(u)) {
            ke();
            const p = u.value;
            return (Te(), ['div', {}, ['span', e, l(u)], '<', s(p), '>']);
          } else {
            if (tt(u))
              return [
                'div',
                {},
                ['span', e, fe(u) ? 'ShallowReactive' : 'Reactive'],
                '<',
                s(u),
                `>${Re(u) ? ' (readonly)' : ''}`,
              ];
            if (Re(u))
              return [
                'div',
                {},
                ['span', e, fe(u) ? 'ShallowReadonly' : 'Readonly'],
                '<',
                s(u),
                '>',
              ];
          }
          return null;
        },
        hasBody(u) {
          return u && u.__isVue;
        },
        body(u) {
          if (u && u.__isVue) return ['div', {}, ...o(u.$)];
        },
      };
    function o(u) {
      const p = [];
      (u.type.props && u.props && p.push(a('props', R(u.props))),
        u.setupState !== W && p.push(a('setup', u.setupState)),
        u.data !== W && p.push(a('data', R(u.data))));
      const m = c(u, 'computed');
      m && p.push(a('computed', m));
      const C = c(u, 'inject');
      return (
        C && p.push(a('injected', C)),
        p.push([
          'div',
          {},
          ['span', { style: n.style + ';opacity:0.66' }, '$ (internal): '],
          ['object', { object: u }],
        ]),
        p
      );
    }
    function a(u, p) {
      return (
        (p = G({}, p)),
        Object.keys(p).length
          ? [
              'div',
              { style: 'line-height:1.25em;margin-bottom:0.6em' },
              ['div', { style: 'color:#476582' }, u],
              [
                'div',
                { style: 'padding-left:1.25em' },
                ...Object.keys(p).map(m => ['div', {}, ['span', n, m + ': '], s(p[m], !1)]),
              ],
            ]
          : ['span', {}]
      );
    }
    function s(u, p = !0) {
      return typeof u == 'number'
        ? ['span', t, u]
        : typeof u == 'string'
          ? ['span', r, JSON.stringify(u)]
          : typeof u == 'boolean'
            ? ['span', n, u]
            : q(u)
              ? ['object', { object: p ? R(u) : u }]
              : ['span', r, String(u)];
    }
    function c(u, p) {
      const m = u.type;
      if (I(m)) return;
      const C = {};
      for (const N in u.ctx) f(m, N, p) && (C[N] = u.ctx[N]);
      return C;
    }
    function f(u, p, m) {
      const C = u[m];
      if (
        (V(C) && C.includes(p)) ||
        (q(C) && p in C) ||
        (u.extends && f(u.extends, p, m)) ||
        (u.mixins && u.mixins.some(N => f(N, p, m)))
      )
        return !0;
    }
    function l(u) {
      return fe(u) ? 'ShallowRef' : u.effect ? 'ComputedRef' : 'Ref';
    }
    window.devtoolsFormatters
      ? window.devtoolsFormatters.push(i)
      : (window.devtoolsFormatters = [i]);
  }
  const es = '3.5.25',
    Se = process.env.NODE_ENV !== 'production' ? x : Q;
  (process.env.NODE_ENV, process.env.NODE_ENV);
  let Gn;
  const ts = typeof window < 'u' && window.trustedTypes;
  if (ts)
    try {
      Gn = ts.createPolicy('vue', { createHTML: e => e });
    } catch (e) {
      process.env.NODE_ENV !== 'production' && Se(`Error creating trusted types policy: ${e}`);
    }
  const rs = Gn ? e => Gn.createHTML(e) : e => e,
    _l = 'http://www.w3.org/2000/svg',
    yl = 'http://www.w3.org/1998/Math/MathML',
    Je = typeof document < 'u' ? document : null,
    ns = Je && Je.createElement('template'),
    wl = {
      insert: (e, t, r) => {
        t.insertBefore(e, r || null);
      },
      remove: e => {
        const t = e.parentNode;
        t && t.removeChild(e);
      },
      createElement: (e, t, r, n) => {
        const i =
          t === 'svg'
            ? Je.createElementNS(_l, e)
            : t === 'mathml'
              ? Je.createElementNS(yl, e)
              : r
                ? Je.createElement(e, { is: r })
                : Je.createElement(e);
        return (
          e === 'select' && n && n.multiple != null && i.setAttribute('multiple', n.multiple),
          i
        );
      },
      createText: e => Je.createTextNode(e),
      createComment: e => Je.createComment(e),
      setText: (e, t) => {
        e.nodeValue = t;
      },
      setElementText: (e, t) => {
        e.textContent = t;
      },
      parentNode: e => e.parentNode,
      nextSibling: e => e.nextSibling,
      querySelector: e => Je.querySelector(e),
      setScopeId(e, t) {
        e.setAttribute(t, '');
      },
      insertStaticContent(e, t, r, n, i, o) {
        const a = r ? r.previousSibling : t.lastChild;
        if (i && (i === o || i.nextSibling))
          for (; t.insertBefore(i.cloneNode(!0), r), !(i === o || !(i = i.nextSibling)); );
        else {
          ns.innerHTML = rs(
            n === 'svg' ? `<svg>${e}</svg>` : n === 'mathml' ? `<math>${e}</math>` : e
          );
          const s = ns.content;
          if (n === 'svg' || n === 'mathml') {
            const c = s.firstChild;
            for (; c.firstChild; ) s.appendChild(c.firstChild);
            s.removeChild(c);
          }
          t.insertBefore(s, r);
        }
        return [a ? a.nextSibling : t.firstChild, r ? r.previousSibling : t.lastChild];
      },
    },
    El = Symbol('_vtc');
  function Nl(e, t, r) {
    const n = e[El];
    (n && (t = (t ? [t, ...n] : [...n]).join(' ')),
      t == null ? e.removeAttribute('class') : r ? e.setAttribute('class', t) : (e.className = t));
  }
  const is = Symbol('_vod'),
    xl = Symbol('_vsh'),
    Sl = Symbol(process.env.NODE_ENV !== 'production' ? 'CSS_VAR_TEXT' : ''),
    Ol = /(?:^|;)\s*display\s*:/;
  function Cl(e, t, r) {
    const n = e.style,
      i = Y(r);
    let o = !1;
    if (r && !i) {
      if (t)
        if (Y(t))
          for (const a of t.split(';')) {
            const s = a.slice(0, a.indexOf(':')).trim();
            r[s] == null && Zr(n, s, '');
          }
        else for (const a in t) r[a] == null && Zr(n, a, '');
      for (const a in r) (a === 'display' && (o = !0), Zr(n, a, r[a]));
    } else if (i) {
      if (t !== r) {
        const a = n[Sl];
        (a && (r += ';' + a), (n.cssText = r), (o = Ol.test(r)));
      }
    } else t && e.removeAttribute('style');
    is in e && ((e[is] = o ? n.display : ''), e[xl] && (n.display = 'none'));
  }
  const kl = /[^\\];\s*$/,
    os = /\s*!important$/;
  function Zr(e, t, r) {
    if (V(r)) r.forEach(n => Zr(e, t, n));
    else if (
      (r == null && (r = ''),
      process.env.NODE_ENV !== 'production' &&
        kl.test(r) &&
        Se(`Unexpected semicolon at the end of '${t}' style value: '${r}'`),
      t.startsWith('--'))
    )
      e.setProperty(t, r);
    else {
      const n = Tl(e, t);
      os.test(r) ? e.setProperty(ye(n), r.replace(os, ''), 'important') : (e[n] = r);
    }
  }
  const ss = ['Webkit', 'Moz', 'ms'],
    Yn = {};
  function Tl(e, t) {
    const r = Yn[t];
    if (r) return r;
    let n = ue(t);
    if (n !== 'filter' && n in e) return (Yn[t] = n);
    n = Er(n);
    for (let i = 0; i < ss.length; i++) {
      const o = ss[i] + n;
      if (o in e) return (Yn[t] = o);
    }
    return t;
  }
  const as = 'http://www.w3.org/1999/xlink';
  function cs(e, t, r, n, i, o = oa(t)) {
    n && t.startsWith('xlink:')
      ? r == null
        ? e.removeAttributeNS(as, t.slice(6, t.length))
        : e.setAttributeNS(as, t, r)
      : r == null || (o && !bi(r))
        ? e.removeAttribute(t)
        : e.setAttribute(t, o ? '' : Qe(r) ? String(r) : r);
  }
  function ls(e, t, r, n, i) {
    if (t === 'innerHTML' || t === 'textContent') {
      r != null && (e[t] = t === 'innerHTML' ? rs(r) : r);
      return;
    }
    const o = e.tagName;
    if (t === 'value' && o !== 'PROGRESS' && !o.includes('-')) {
      const s = o === 'OPTION' ? e.getAttribute('value') || '' : e.value,
        c = r == null ? (e.type === 'checkbox' ? 'on' : '') : String(r);
      ((s !== c || !('_value' in e)) && (e.value = c),
        r == null && e.removeAttribute(t),
        (e._value = r));
      return;
    }
    let a = !1;
    if (r === '' || r == null) {
      const s = typeof e[t];
      s === 'boolean'
        ? (r = bi(r))
        : r == null && s === 'string'
          ? ((r = ''), (a = !0))
          : s === 'number' && ((r = 0), (a = !0));
    }
    try {
      e[t] = r;
    } catch (s) {
      process.env.NODE_ENV !== 'production' &&
        !a &&
        Se(`Failed setting prop "${t}" on <${o.toLowerCase()}>: value ${r} is invalid.`, s);
    }
    a && e.removeAttribute(i || t);
  }
  function Vl(e, t, r, n) {
    e.addEventListener(t, r, n);
  }
  function Al(e, t, r, n) {
    e.removeEventListener(t, r, n);
  }
  const us = Symbol('_vei');
  function Il(e, t, r, n, i = null) {
    const o = e[us] || (e[us] = {}),
      a = o[t];
    if (n && a) a.value = process.env.NODE_ENV !== 'production' ? fs(n, t) : n;
    else {
      const [s, c] = Pl(t);
      if (n) {
        const f = (o[t] = Rl(process.env.NODE_ENV !== 'production' ? fs(n, t) : n, i));
        Vl(e, s, f, c);
      } else a && (Al(e, s, a, c), (o[t] = void 0));
    }
  }
  const ds = /(?:Once|Passive|Capture)$/;
  function Pl(e) {
    let t;
    if (ds.test(e)) {
      t = {};
      let n;
      for (; (n = e.match(ds)); )
        ((e = e.slice(0, e.length - n[0].length)), (t[n[0].toLowerCase()] = !0));
    }
    return [e[2] === ':' ? e.slice(3) : ye(e.slice(2)), t];
  }
  let Jn = 0;
  const Ml = Promise.resolve(),
    Ll = () => Jn || (Ml.then(() => (Jn = 0)), (Jn = Date.now()));
  function Rl(e, t) {
    const r = n => {
      if (!n._vts) n._vts = Date.now();
      else if (n._vts <= r.attached) return;
      $e($l(n, r.value), t, 5, [n]);
    };
    return ((r.value = e), (r.attached = Ll()), r);
  }
  function fs(e, t) {
    return I(e) || V(e)
      ? e
      : (Se(`Wrong type passed as event handler to ${t} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof e}.`),
        Q);
  }
  function $l(e, t) {
    if (V(t)) {
      const r = e.stopImmediatePropagation;
      return (
        (e.stopImmediatePropagation = () => {
          (r.call(e), (e._stopped = !0));
        }),
        t.map(n => i => !i._stopped && n && n(i))
      );
    } else return t;
  }
  const hs = e =>
      e.charCodeAt(0) === 111 &&
      e.charCodeAt(1) === 110 &&
      e.charCodeAt(2) > 96 &&
      e.charCodeAt(2) < 123,
    Dl = (e, t, r, n, i, o) => {
      const a = i === 'svg';
      t === 'class'
        ? Nl(e, n, a)
        : t === 'style'
          ? Cl(e, r, n)
          : $t(t)
            ? br(t) || Il(e, t, r, n, o)
            : (
                  t[0] === '.'
                    ? ((t = t.slice(1)), !0)
                    : t[0] === '^'
                      ? ((t = t.slice(1)), !1)
                      : Fl(e, t, n, a)
                )
              ? (ls(e, t, n),
                !e.tagName.includes('-') &&
                  (t === 'value' || t === 'checked' || t === 'selected') &&
                  cs(e, t, n, a, o, t !== 'value'))
              : e._isVueCE && (/[A-Z]/.test(t) || !Y(n))
                ? ls(e, ue(t), n, o, t)
                : (t === 'true-value'
                    ? (e._trueValue = n)
                    : t === 'false-value' && (e._falseValue = n),
                  cs(e, t, n, a));
    };
  function Fl(e, t, r, n) {
    if (n) return !!(t === 'innerHTML' || t === 'textContent' || (t in e && hs(t) && I(r)));
    if (
      t === 'spellcheck' ||
      t === 'draggable' ||
      t === 'translate' ||
      t === 'autocorrect' ||
      (t === 'sandbox' && e.tagName === 'IFRAME') ||
      t === 'form' ||
      (t === 'list' && e.tagName === 'INPUT') ||
      (t === 'type' && e.tagName === 'TEXTAREA')
    )
      return !1;
    if (t === 'width' || t === 'height') {
      const i = e.tagName;
      if (i === 'IMG' || i === 'VIDEO' || i === 'CANVAS' || i === 'SOURCE') return !1;
    }
    return hs(t) && Y(r) ? !1 : t in e;
  }
  const ps = {};
  function jl(e, t, r) {
    let n = io(e, t);
    yr(n) && (n = G({}, n, t));
    class i extends Zn {
      constructor(a) {
        super(n, a, r);
      }
    }
    return ((i.def = n), i);
  }
  const Ul = typeof HTMLElement < 'u' ? HTMLElement : class {};
  class Zn extends Ul {
    constructor(t, r = {}, n = vs) {
      (super(),
        (this._def = t),
        (this._props = r),
        (this._createApp = n),
        (this._isVueCE = !0),
        (this._instance = null),
        (this._app = null),
        (this._nonce = this._def.nonce),
        (this._connected = !1),
        (this._resolved = !1),
        (this._patching = !1),
        (this._dirty = !1),
        (this._numberProps = null),
        (this._styleChildren = new WeakSet()),
        (this._ob = null),
        this.shadowRoot && n !== vs
          ? (this._root = this.shadowRoot)
          : (process.env.NODE_ENV !== 'production' &&
              this.shadowRoot &&
              Se(
                'Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use `defineSSRCustomElement`.'
              ),
            t.shadowRoot !== !1
              ? (this.attachShadow(G({}, t.shadowRootOptions, { mode: 'open' })),
                (this._root = this.shadowRoot))
              : (this._root = this)));
    }
    connectedCallback() {
      if (!this.isConnected) return;
      (!this.shadowRoot && !this._resolved && this._parseSlots(), (this._connected = !0));
      let t = this;
      for (; (t = t && (t.parentNode || t.host)); )
        if (t instanceof Zn) {
          this._parent = t;
          break;
        }
      this._instance ||
        (this._resolved
          ? this._mount(this._def)
          : t && t._pendingResolve
            ? (this._pendingResolve = t._pendingResolve.then(() => {
                ((this._pendingResolve = void 0), this._resolveDef());
              }))
            : this._resolveDef());
    }
    _setParent(t = this._parent) {
      t && ((this._instance.parent = t._instance), this._inheritParentContext(t));
    }
    _inheritParentContext(t = this._parent) {
      t && this._app && Object.setPrototypeOf(this._app._context.provides, t._instance.provides);
    }
    disconnectedCallback() {
      ((this._connected = !1),
        Xi(() => {
          this._connected ||
            (this._ob && (this._ob.disconnect(), (this._ob = null)),
            this._app && this._app.unmount(),
            this._instance && (this._instance.ce = void 0),
            (this._app = this._instance = null),
            this._teleportTargets &&
              (this._teleportTargets.clear(), (this._teleportTargets = void 0)));
        }));
    }
    _processMutations(t) {
      for (const r of t) this._setAttr(r.attributeName);
    }
    _resolveDef() {
      if (this._pendingResolve) return;
      for (let n = 0; n < this.attributes.length; n++) this._setAttr(this.attributes[n].name);
      ((this._ob = new MutationObserver(this._processMutations.bind(this))),
        this._ob.observe(this, { attributes: !0 }));
      const t = (n, i = !1) => {
          ((this._resolved = !0), (this._pendingResolve = void 0));
          const { props: o, styles: a } = n;
          let s;
          if (o && !V(o))
            for (const c in o) {
              const f = o[c];
              (f === Number || (f && f.type === Number)) &&
                (c in this._props && (this._props[c] = mi(this._props[c])),
                ((s || (s = Object.create(null)))[ue(c)] = !0));
            }
          ((this._numberProps = s),
            this._resolveProps(n),
            this.shadowRoot
              ? this._applyStyles(a)
              : process.env.NODE_ENV !== 'production' &&
                a &&
                Se('Custom element style injection is not supported when using shadowRoot: false'),
            this._mount(n));
        },
        r = this._def.__asyncLoader;
      r
        ? (this._pendingResolve = r().then(n => {
            ((n.configureApp = this._def.configureApp), t((this._def = n), !0));
          }))
        : t(this._def);
    }
    _mount(t) {
      (process.env.NODE_ENV !== 'production' && !t.name && (t.name = 'VueElement'),
        (this._app = this._createApp(t)),
        this._inheritParentContext(),
        t.configureApp && t.configureApp(this._app),
        (this._app._ceVNode = this._createVNode()),
        this._app.mount(this._root));
      const r = this._instance && this._instance.exposed;
      if (r)
        for (const n in r)
          F(this, n)
            ? process.env.NODE_ENV !== 'production' &&
              Se(`Exposed property "${n}" already exists on custom element.`)
            : Object.defineProperty(this, n, { get: () => Hi(r[n]) });
    }
    _resolveProps(t) {
      const { props: r } = t,
        n = V(r) ? r : Object.keys(r || {});
      for (const i of Object.keys(this)) i[0] !== '_' && n.includes(i) && this._setProp(i, this[i]);
      for (const i of n.map(ue))
        Object.defineProperty(this, i, {
          get() {
            return this._getProp(i);
          },
          set(o) {
            this._setProp(i, o, !0, !this._patching);
          },
        });
    }
    _setAttr(t) {
      if (t.startsWith('data-v-')) return;
      const r = this.hasAttribute(t);
      let n = r ? this.getAttribute(t) : ps;
      const i = ue(t);
      (r && this._numberProps && this._numberProps[i] && (n = mi(n)), this._setProp(i, n, !1, !0));
    }
    _getProp(t) {
      return this._props[t];
    }
    _setProp(t, r, n = !0, i = !1) {
      if (
        r !== this._props[t] &&
        ((this._dirty = !0),
        r === ps
          ? delete this._props[t]
          : ((this._props[t] = r), t === 'key' && this._app && (this._app._ceVNode.key = r)),
        i && this._instance && this._update(),
        n)
      ) {
        const o = this._ob;
        (o && (this._processMutations(o.takeRecords()), o.disconnect()),
          r === !0
            ? this.setAttribute(ye(t), '')
            : typeof r == 'string' || typeof r == 'number'
              ? this.setAttribute(ye(t), r + '')
              : r || this.removeAttribute(ye(t)),
          o && o.observe(this, { attributes: !0 }));
      }
    }
    _update() {
      const t = this._createVNode();
      (this._app && (t.appContext = this._app._context), ql(t, this._root));
    }
    _createVNode() {
      const t = {};
      this.shadowRoot || (t.onVnodeMounted = t.onVnodeUpdated = this._renderSlots.bind(this));
      const r = it(this._def, G(t, this._props));
      return (
        this._instance ||
          (r.ce = n => {
            ((this._instance = n),
              (n.ce = this),
              (n.isCE = !0),
              process.env.NODE_ENV !== 'production' &&
                (n.ceReload = o => {
                  (this._styles &&
                    (this._styles.forEach(a => this._root.removeChild(a)),
                    (this._styles.length = 0)),
                    this._applyStyles(o),
                    (this._instance = null),
                    this._update());
                }));
            const i = (o, a) => {
              this.dispatchEvent(
                new CustomEvent(o, yr(a[0]) ? G({ detail: a }, a[0]) : { detail: a })
              );
            };
            ((n.emit = (o, ...a) => {
              (i(o, a), ye(o) !== o && i(ye(o), a));
            }),
              this._setParent());
          }),
        r
      );
    }
    _applyStyles(t, r) {
      if (!t) return;
      if (r) {
        if (r === this._def || this._styleChildren.has(r)) return;
        this._styleChildren.add(r);
      }
      const n = this._nonce;
      for (let i = t.length - 1; i >= 0; i--) {
        const o = document.createElement('style');
        if (
          (n && o.setAttribute('nonce', n),
          (o.textContent = t[i]),
          this.shadowRoot.prepend(o),
          process.env.NODE_ENV !== 'production')
        )
          if (r) {
            if (r.__hmrId) {
              this._childStyles || (this._childStyles = new Map());
              let a = this._childStyles.get(r.__hmrId);
              (a || this._childStyles.set(r.__hmrId, (a = [])), a.push(o));
            }
          } else (this._styles || (this._styles = [])).push(o);
      }
    }
    _parseSlots() {
      const t = (this._slots = {});
      let r;
      for (; (r = this.firstChild); ) {
        const n = (r.nodeType === 1 && r.getAttribute('slot')) || 'default';
        ((t[n] || (t[n] = [])).push(r), this.removeChild(r));
      }
    }
    _renderSlots() {
      const t = this._getSlots(),
        r = this._instance.type.__scopeId;
      for (let n = 0; n < t.length; n++) {
        const i = t[n],
          o = i.getAttribute('name') || 'default',
          a = this._slots[o],
          s = i.parentNode;
        if (a)
          for (const c of a) {
            if (r && c.nodeType === 1) {
              const f = r + '-s',
                l = document.createTreeWalker(c, 1);
              c.setAttribute(f, '');
              let u;
              for (; (u = l.nextNode()); ) u.setAttribute(f, '');
            }
            s.insertBefore(c, i);
          }
        else for (; i.firstChild; ) s.insertBefore(i.firstChild, i);
        s.removeChild(i);
      }
    }
    _getSlots() {
      const t = [this];
      this._teleportTargets && t.push(...this._teleportTargets);
      const r = new Set();
      for (const n of t) {
        const i = n.querySelectorAll('slot');
        for (let o = 0; o < i.length; o++) r.add(i[o]);
      }
      return Array.from(r);
    }
    _injectChildStyle(t) {
      this._applyStyles(t.styles, t);
    }
    _beginPatch() {
      ((this._patching = !0), (this._dirty = !1));
    }
    _endPatch() {
      ((this._patching = !1), this._dirty && this._instance && this._update());
    }
    _removeChildStyle(t) {
      if (
        process.env.NODE_ENV !== 'production' &&
        (this._styleChildren.delete(t), this._childStyles && t.__hmrId)
      ) {
        const r = this._childStyles.get(t.__hmrId);
        r && (r.forEach(n => this._root.removeChild(n)), (r.length = 0));
      }
    }
  }
  const Hl = ['ctrl', 'shift', 'alt', 'meta'],
    Wl = {
      stop: e => e.stopPropagation(),
      prevent: e => e.preventDefault(),
      self: e => e.target !== e.currentTarget,
      ctrl: e => !e.ctrlKey,
      shift: e => !e.shiftKey,
      alt: e => !e.altKey,
      meta: e => !e.metaKey,
      left: e => 'button' in e && e.button !== 0,
      middle: e => 'button' in e && e.button !== 1,
      right: e => 'button' in e && e.button !== 2,
      exact: (e, t) => Hl.some(r => e[`${r}Key`] && !t.includes(r)),
    },
    Qn = (e, t) => {
      const r = e._withMods || (e._withMods = {}),
        n = t.join('.');
      return (
        r[n] ||
        (r[n] = (i, ...o) => {
          for (let a = 0; a < t.length; a++) {
            const s = Wl[t[a]];
            if (s && s(i, t)) return;
          }
          return e(i, ...o);
        })
      );
    },
    Bl = G({ patchProp: Dl }, wl);
  let gs;
  function ms() {
    return gs || (gs = Jc(Bl));
  }
  const ql = (...e) => {
      ms().render(...e);
    },
    vs = (...e) => {
      const t = ms().createApp(...e);
      process.env.NODE_ENV !== 'production' && (zl(t), Kl(t));
      const { mount: r } = t;
      return (
        (t.mount = n => {
          const i = Gl(n);
          if (!i) return;
          const o = t._component;
          (!I(o) && !o.render && !o.template && (o.template = i.innerHTML),
            i.nodeType === 1 && (i.textContent = ''));
          const a = r(i, !1, Xl(i));
          return (
            i instanceof Element &&
              (i.removeAttribute('v-cloak'), i.setAttribute('data-v-app', '')),
            a
          );
        }),
        t
      );
    };
  function Xl(e) {
    if (e instanceof SVGElement) return 'svg';
    if (typeof MathMLElement == 'function' && e instanceof MathMLElement) return 'mathml';
  }
  function zl(e) {
    Object.defineProperty(e.config, 'isNativeTag', {
      value: t => ra(t) || na(t) || ia(t),
      writable: !1,
    });
  }
  function Kl(e) {
    {
      const t = e.config.isCustomElement;
      Object.defineProperty(e.config, 'isCustomElement', {
        get() {
          return t;
        },
        set() {
          Se(
            'The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead.'
          );
        },
      });
      const r = e.config.compilerOptions,
        n =
          'The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader\'s `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc';
      Object.defineProperty(e.config, 'compilerOptions', {
        get() {
          return (Se(n), r);
        },
        set() {
          Se(n);
        },
      });
    }
  }
  function Gl(e) {
    if (Y(e)) {
      const t = document.querySelector(e);
      return (
        process.env.NODE_ENV !== 'production' &&
          !t &&
          Se(`Failed to mount app: mount target selector "${e}" returned null.`),
        t
      );
    }
    return (
      process.env.NODE_ENV !== 'production' &&
        window.ShadowRoot &&
        e instanceof window.ShadowRoot &&
        e.mode === 'closed' &&
        Se('mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs'),
      e
    );
  }
  function Yl() {
    bl();
  }
  process.env.NODE_ENV !== 'production' && Yl();
  const Jl =
    '@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-50:oklch(97.1% .013 17.38);--color-red-500:oklch(63.7% .237 25.331);--color-white:#fff;--spacing:.25rem;--container-3xl:48rem;--container-6xl:72rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75/1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2/1.5);--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-tight:-.025em;--tracking-wide:.025em;--tracking-wider:.05em;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-ott-accent:#68a691;--color-ott-accent-light:#ecfff9;--color-ott-text-primary:#2f2f2f;--color-ott-text-secondary:#a1a1a1;--color-ott-text-white:#fff;--color-ott-bg-primary:#fff;--color-ott-bg-secondary:#f3f3f3;--color-ott-bg-darkened:#f4f6f6;--color-ott-bg-dark:#d3d3d3}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-none{pointer-events:none}.visible{visibility:visible}.absolute{position:absolute}.relative{position:relative}.static{position:static}.inset-0{inset:calc(var(--spacing)*0)}.-top-0\\.5{top:calc(var(--spacing)*-.5)}.right-0{right:calc(var(--spacing)*0)}.-bottom-0\\.5{bottom:calc(var(--spacing)*-.5)}.left-0{left:calc(var(--spacing)*0)}.z-20{z-index:20}.col-span-2{grid-column:span 2/span 2}.col-span-full{grid-column:1/-1}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.m-0\\!{margin:calc(var(--spacing)*0)!important}.m-2{margin:calc(var(--spacing)*2)}.m-4{margin:calc(var(--spacing)*4)}.mx-auto{margin-inline:auto}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-4{margin-top:calc(var(--spacing)*4)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-8{margin-bottom:calc(var(--spacing)*8)}.ml-4{margin-left:calc(var(--spacing)*4)}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.inline{display:inline}.inline-block{display:inline-block}.h-1{height:calc(var(--spacing)*1)}.h-4{height:calc(var(--spacing)*4)}.h-8{height:calc(var(--spacing)*8)}.h-21{height:calc(var(--spacing)*21)}.h-full{height:100%}.max-h-48{max-height:calc(var(--spacing)*48)}.max-h-screen{max-height:100vh}.min-h-0{min-height:calc(var(--spacing)*0)}.min-h-5{min-height:calc(var(--spacing)*5)}.min-h-full{min-height:100%}.w-0\\.5{width:calc(var(--spacing)*.5)}.w-4{width:calc(var(--spacing)*4)}.w-8{width:calc(var(--spacing)*8)}.w-64{width:calc(var(--spacing)*64)}.w-100{width:calc(var(--spacing)*100)}.w-150{width:calc(var(--spacing)*150)}.w-fit{width:fit-content}.w-full{width:100%}.w-max{width:max-content}.max-w-3xl{max-width:var(--container-3xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-full{max-width:100%}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-full{min-width:100%}.flex-1{flex:1}.shrink-0{flex-shrink:0}.scale-90{--tw-scale-x:90%;--tw-scale-y:90%;--tw-scale-z:90%;scale:var(--tw-scale-x)var(--tw-scale-y)}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.transform-\\[rotate\\(90deg\\)\\]{transform:rotate(90deg)}.cursor-col-resize{cursor:col-resize}.cursor-grab{cursor:grab}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.resize-none{resize:none}.appearance-none{appearance:none}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.content-start{align-content:flex-start}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-start{justify-content:flex-start}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-3{gap:calc(var(--spacing)*3)}.gap-4{gap:calc(var(--spacing)*4)}.gap-6{gap:calc(var(--spacing)*6)}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*4)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-y-reverse)))}.gap-x-6{column-gap:calc(var(--spacing)*6)}.gap-y-4{row-gap:calc(var(--spacing)*4)}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-ott-bg-dark>:not(:last-child)){border-color:var(--color-ott-bg-dark)}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-ott-accent{border-color:var(--color-ott-accent)}.border-ott-bg-dark{border-color:var(--color-ott-bg-dark)}.border-ott-bg-dark\\/50{border-color:#d3d3d380}@supports (color:color-mix(in lab,red,red)){.border-ott-bg-dark\\/50{border-color:color-mix(in oklab,var(--color-ott-bg-dark)50%,transparent)}}.border-ott-bg-secondary{border-color:var(--color-ott-bg-secondary)}.border-ott-text-primary{border-color:var(--color-ott-text-primary)}.border-transparent{border-color:#0000}.border-transparent\\!{border-color:#0000!important}.border-t-ott-bg-dark{border-top-color:var(--color-ott-bg-dark)}.bg-ott-accent{background-color:var(--color-ott-accent)}.bg-ott-accent\\!{background-color:var(--color-ott-accent)!important}.bg-ott-accent-light{background-color:var(--color-ott-accent-light)}.bg-ott-accent\\/5{background-color:#68a6910d}@supports (color:color-mix(in lab,red,red)){.bg-ott-accent\\/5{background-color:color-mix(in oklab,var(--color-ott-accent)5%,transparent)}}.bg-ott-accent\\/20{background-color:#68a69133}@supports (color:color-mix(in lab,red,red)){.bg-ott-accent\\/20{background-color:color-mix(in oklab,var(--color-ott-accent)20%,transparent)}}.bg-ott-bg-dark{background-color:var(--color-ott-bg-dark)}.bg-ott-bg-dark\\/20{background-color:#d3d3d333}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-dark\\/20{background-color:color-mix(in oklab,var(--color-ott-bg-dark)20%,transparent)}}.bg-ott-bg-primary{background-color:var(--color-ott-bg-primary)}.bg-ott-bg-secondary{background-color:var(--color-ott-bg-secondary)}.bg-ott-bg-secondary\\/10{background-color:#f3f3f31a}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-secondary\\/10{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)10%,transparent)}}.bg-ott-bg-secondary\\/20{background-color:#f3f3f333}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-secondary\\/20{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)20%,transparent)}}.bg-ott-bg-secondary\\/30{background-color:#f3f3f34d}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-secondary\\/30{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)30%,transparent)}}.bg-white{background-color:var(--color-white)}.p-1{padding:calc(var(--spacing)*1)}.p-1\\.5{padding:calc(var(--spacing)*1.5)}.p-2{padding:calc(var(--spacing)*2)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.p-5{padding:calc(var(--spacing)*5)}.p-6{padding:calc(var(--spacing)*6)}.p-8{padding:calc(var(--spacing)*8)}.p-12{padding:calc(var(--spacing)*12)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-5{padding-inline:calc(var(--spacing)*5)}.px-6{padding-inline:calc(var(--spacing)*6)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-1{padding-block:calc(var(--spacing)*1)}.py-2{padding-block:calc(var(--spacing)*2)}.py-8{padding-block:calc(var(--spacing)*8)}.pt-2{padding-top:calc(var(--spacing)*2)}.pt-4{padding-top:calc(var(--spacing)*4)}.pr-4{padding-right:calc(var(--spacing)*4)}.pb-0{padding-bottom:calc(var(--spacing)*0)}.pb-4{padding-bottom:calc(var(--spacing)*4)}.pl-2{padding-left:calc(var(--spacing)*2)}.text-center{text-align:center}.text-right{text-align:right}.font-mono{font-family:var(--font-mono)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.tracking-wider{--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider)}.whitespace-nowrap{white-space:nowrap}.whitespace-pre{white-space:pre}.text-ott-accent{color:var(--color-ott-accent)}.text-ott-bg-dark{color:var(--color-ott-bg-dark)}.text-ott-bg-primary\\!{color:var(--color-ott-bg-primary)!important}.text-ott-text-primary{color:var(--color-ott-text-primary)}.text-ott-text-secondary{color:var(--color-ott-text-secondary)}.text-ott-text-secondary\\/30{color:#a1a1a14d}@supports (color:color-mix(in lab,red,red)){.text-ott-text-secondary\\/30{color:color-mix(in oklab,var(--color-ott-text-secondary)30%,transparent)}}.text-ott-text-secondary\\/50{color:#a1a1a180}@supports (color:color-mix(in lab,red,red)){.text-ott-text-secondary\\/50{color:color-mix(in oklab,var(--color-ott-text-secondary)50%,transparent)}}.text-ott-text-white{color:var(--color-ott-text-white)}.text-white{color:var(--color-white)}.uppercase{text-transform:uppercase}.italic{font-style:italic}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.opacity-0{opacity:0}.opacity-20{opacity:.2}.opacity-50{opacity:.5}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_0_8px_rgba\\(var\\(--ott-accent-rgb\\)\\,0\\.5\\)\\]{--tw-shadow:0 0 8px var(--tw-shadow-color,rgba(var(--ott-accent-rgb),.5));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-2{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-ott-accent{--tw-ring-color:var(--color-ott-accent)}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.ring-inset{--tw-ring-inset:inset}@media(hover:hover){.group-hover\\:text-ott-accent:is(:where(.group):hover *){color:var(--color-ott-accent)}.group-hover\\:text-ott-text-secondary:is(:where(.group):hover *){color:var(--color-ott-text-secondary)}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}.group-hover\\/section\\:text-ott-accent:is(:where(.group\\/section):hover *){color:var(--color-ott-accent)}}.last\\:border-0:last-child{border-style:var(--tw-border-style);border-width:0}.last\\:pr-0:last-child{padding-right:calc(var(--spacing)*0)}@media(hover:hover){.hover\\:border-ott-accent:hover{border-color:var(--color-ott-accent)}.hover\\:border-ott-bg-dark:hover{border-color:var(--color-ott-bg-dark)}.hover\\:bg-ott-accent:hover{background-color:var(--color-ott-accent)}.hover\\:bg-ott-accent\\/90:hover{background-color:#68a691e6}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-ott-accent\\/90:hover{background-color:color-mix(in oklab,var(--color-ott-accent)90%,transparent)}}.hover\\:bg-ott-bg-darkened:hover{background-color:var(--color-ott-bg-darkened)}.hover\\:bg-ott-bg-secondary:hover{background-color:var(--color-ott-bg-secondary)}.hover\\:bg-ott-bg-secondary\\/5:hover{background-color:#f3f3f30d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-ott-bg-secondary\\/5:hover{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)5%,transparent)}}.hover\\:bg-ott-bg-secondary\\/50:hover{background-color:#f3f3f380}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-ott-bg-secondary\\/50:hover{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)50%,transparent)}}.hover\\:bg-red-50:hover{background-color:var(--color-red-50)}.hover\\:text-ott-accent:hover{color:var(--color-ott-accent)}.hover\\:text-ott-text-primary:hover{color:var(--color-ott-text-primary)}.hover\\:text-red-500:hover{color:var(--color-red-500)}}.focus\\:border-ott-accent:focus{border-color:var(--color-ott-accent)}.focus\\:bg-white:focus{background-color:var(--color-white)}.focus\\:ring-ott-accent:focus{--tw-ring-color:var(--color-ott-accent)}.active\\:cursor-grabbing:active{cursor:grabbing}.disabled\\:text-ott-bg-dark:disabled{color:var(--color-ott-bg-dark)}@media(min-width:48rem){.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}}html,body,#app{background-color:var(--color-ott-bg-secondary);width:100%;height:100%;color:var(--color-ott-text-primary);font-family:Poppins,sans-serif;font-style:normal;font-weight:400}button{cursor:pointer}h1{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height));--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}h2{margin-block:calc(var(--spacing)*4);font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height));--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}main{width:100%;height:100%;max-height:100vh;display:block;overflow:auto}.ott-button{cursor:pointer;justify-content:center;align-items:center;gap:calc(var(--spacing)*5);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-text-primary);height:fit-content;padding-inline:calc(var(--spacing)*4);padding-block:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);color:var(--color-ott-text-primary);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));display:flex}@media(hover:hover){.ott-button:hover{background-color:var(--color-ott-bg-secondary)}}.ott-button:disabled{cursor:default;border-color:var(--color-ott-bg-dark);color:var(--color-ott-bg-dark)}.ott-button--accent{cursor:pointer;align-items:center;gap:calc(var(--spacing)*5);border-radius:var(--radius-lg);border-color:var(--color-ott-accent);background-color:var(--color-ott-accent);height:fit-content;padding-inline:calc(var(--spacing)*4);padding-block:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);color:var(--color-ott-text-white);display:flex}.ott-button--accent:disabled{cursor:default;background-color:var(--color-ott-text-secondary)}input,.ott-input{border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-bg-dark);background-color:var(--color-white);padding-inline:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*1);font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));border-radius:.25rem}:is(input,.ott-input):focus{border-color:var(--color-ott-accent);--tw-outline-style:none;outline-style:none}.scrollbar-thin::-webkit-scrollbar{width:4px}.scrollbar-thin::-webkit-scrollbar-track{background:0 0}.scrollbar-thin::-webkit-scrollbar-thumb{background-color:var(--color-ott-bg-dark);border-radius:3.40282e38px}.ott-tool-btn{align-items:center;gap:calc(var(--spacing)*3);border-radius:var(--radius-md);border-style:var(--tw-border-style);width:100%;padding:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));cursor:pointer;font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);border-width:1px;border-color:#0000;display:flex}@media(hover:hover){.ott-tool-btn:hover{background-color:var(--color-ott-bg-secondary)}}.ott-tool-btn.active{border-color:var(--color-ott-accent);background-color:var(--color-ott-accent-light);color:var(--color-ott-accent)}.ott-sub-tool-btn{cursor:pointer;border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-bg-dark);padding:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));background-color:var(--color-ott-bg-secondary);border-radius:3.40282e38px}@media(hover:hover){.ott-sub-tool-btn:hover{border-color:var(--color-ott-accent);background-color:var(--color-white);color:var(--color-ott-accent)}}.ott-sub-tool-btn.active{border-color:var(--color-ott-accent);background-color:var(--color-ott-accent);color:var(--color-white)}.ott-section-header{margin-bottom:calc(var(--spacing)*4);border-bottom-style:var(--tw-border-style);border-bottom-width:1px;border-color:var(--color-ott-bg-dark);padding-bottom:calc(var(--spacing)*1);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold);--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider);color:var(--color-ott-text-secondary);text-transform:uppercase}.ott-expandable-item{border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-bg-dark);background-color:var(--color-ott-bg-primary);transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));overflow:hidden}.ott-item-header{cursor:pointer;align-items:center;gap:calc(var(--spacing)*3);padding:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));display:flex}@media(hover:hover){.ott-item-header:hover{background-color:var(--color-ott-bg-secondary)}}.ott-item-header.active{border-bottom-style:var(--tw-border-style);border-bottom-width:1px;border-color:var(--color-ott-bg-dark);background-color:var(--color-ott-bg-secondary)}.ott-item-content{background-color:var(--color-white)}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}';
  class ei {
    attr_id;
    attr_version;
    Label;
    constructor({ Label: t, attr_id: r, attr_version: n }) {
      ((this.attr_id = r), (this.attr_version = n), (this.Label = t));
    }
    toXML() {
      return { attr_id: this.attr_id, attr_version: this.attr_version, Label: this.Label };
    }
  }
  class bs {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  class _s {
    value;
    constructor(t) {
      this.value = t?.text_value;
    }
    toXML() {
      return { text_value: this.value };
    }
  }
  function ne(e, t) {
    return e ? (Array.isArray(e) ? e.map(r => new t(r)) : [new t(e)]) : [];
  }
  function Pt(e) {
    return e.map(t => t.toXML());
  }
  function He(e) {
    const t = {};
    return (
      e.forEach(r => {
        const i = r.constructor.xmlTagName ?? r.constructor.name;
        (t[i] || (t[i] = []), t[i].push(r.toXML()));
      }),
      t
    );
  }
  class Zl {
    attr_id;
    attr_version;
    Name;
    Description;
    constructor(t) {
      ((this.attr_id = t.attr_id || `equipment_${Date.now()}`),
        (this.attr_version = t.attr_version || '1.0'),
        (this.Name = t.Name?.text_value || t.Name),
        (this.Description = t.Description?.text_value || t.Description));
    }
    toXML() {
      return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        Name: this.Name ? { text_value: this.Name } : void 0,
        Description: this.Description ? { text_value: this.Description } : void 0,
      };
    }
  }
  class Ql extends Zl {
    constructor(t) {
      super(t);
    }
  }
  class eu extends Ql {
    Fixed;
    constructor(t) {
      (super(t), (this.Fixed = t.Fixed === 'true' || t.Fixed === !0));
    }
    toXML() {
      return { ...super.toXML(), Fixed: this.Fixed };
    }
  }
  class Qr extends eu {
    static xmlTagName = 'ActualVehicleEquipment';
    Units;
    TicketingEquipmentRef;
    TicketValidatorEquipmentRef;
    constructor(t) {
      (super(t),
        (this.Units = t.Units || 1),
        (this.TicketingEquipmentRef = t.TicketingEquipmentRef),
        (this.TicketValidatorEquipmentRef = t.TicketValidatorEquipmentRef));
    }
    toXML() {
      return {
        ...super.toXML(),
        Units: this.Units,
        TicketingEquipmentRef: this.TicketingEquipmentRef?.toXML(),
        TicketValidatorEquipmentRef: this.TicketValidatorEquipmentRef?.toXML(),
      };
    }
  }
  class tu {
    attr_id;
    attr_version;
    Name;
    PublicUse;
    TotalCapacity;
    actualVehicleEquipments;
    constructor({
      attr_id: t,
      attr_version: r,
      Name: n,
      PublicUse: i,
      TotalCapacity: o,
      actualVehicleEquipments: a,
    }) {
      ((this.attr_id = t),
        (this.attr_version = r),
        (this.Name = n ? new _s(n) : void 0),
        (this.actualVehicleEquipments = a ? ne(a.ActualVehicleEquipment, Qr) : []),
        (this.PublicUse = i?.text_value),
        (this.TotalCapacity = o?.text_value));
    }
    toXML() {
      return { attr_id: this.attr_id, attr_version: this.attr_version, Name: this.Name?.toXML };
    }
  }
  class Mt {
    x;
    y;
    constructor(t, r) {
      ((this.x = t), (this.y = r));
    }
    static fromXML(t) {
      const r = t?.Location?.pos;
      if (typeof r == 'string') {
        const [n, i] = r.split(' ').map(Number);
        if (typeof n == 'number' && typeof i == 'number') return new Mt(n, i);
      } else return new Mt(0, 0);
    }
    toXML() {
      return { Location: { pos: `${this.x} ${this.y}` } };
    }
  }
  class ru {
    static xmlTagName = 'PassengerEntrance';
    attr_id;
    attr_version;
    Name;
    Label;
    Width;
    Height;
    actualVehicleEquipments;
    PublicUse;
    VehicleSide;
    SequenceFromFront;
    HeightFromGround;
    DeckEntranceType;
    IsEmergencyExit;
    HasDoor;
    IsAutomatic;
    Centroid;
    constructor({
      attr_id: t,
      attr_version: r,
      Name: n,
      Label: i,
      Width: o,
      Height: a,
      actualVehicleEquipments: s,
      PublicUse: c,
      VehicleSide: f,
      SequenceFromFront: l,
      HeightFromGround: u,
      DeckEntranceType: p,
      IsEmergencyExit: m,
      HasDoor: C,
      IsAutomatic: N,
      Centroid: L = void 0,
    }) {
      ((this.attr_id = t),
        (this.attr_version = r),
        (this.Name = n ? new _s(n) : void 0),
        (this.Label = i?.text_value),
        (this.Width = o?.text_value),
        (this.Height = a?.text_value),
        (this.actualVehicleEquipments = ne(s?.ActualVehicleEquipment, Qr)),
        (this.PublicUse = c?.text_value),
        (this.VehicleSide = f?.text_value),
        (this.SequenceFromFront = l?.text_value),
        (this.HeightFromGround = u?.text_value),
        (this.DeckEntranceType = p?.text_value),
        (this.IsEmergencyExit = m?.text_value),
        (this.HasDoor = C?.text_value),
        (this.IsAutomatic = N?.text_value),
        (this.Centroid = L ? Mt.fromXML(L) : void 0));
    }
    toXML() {
      return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        Name: this.Name?.toXML(),
        Label: this.Label,
        Width: this.Width,
        Height: this.Height,
        actualVehicleEquipments: { ActualVehicleEquipment: Pt(this.actualVehicleEquipments) },
        PublicUse: this.PublicUse,
        VehicleSide: this.VehicleSide,
        SequenceFromFront: this.SequenceFromFront,
        HeightFromGround: this.HeightFromGround,
        DeckEntranceType: this.DeckEntranceType,
        IsEmergencyExit: this.IsEmergencyExit,
        HasDoor: this.HasDoor,
        IsAutomatic: this.IsAutomatic,
        Centroid: this.Centroid?.toXML(),
      };
    }
    getShape(t, r, n) {
      const i = (this.Width || 0.8) * t,
        o = 0.2 * t;
      let a = i,
        s = o,
        c = 0,
        f = 0;
      if (
        ((this.VehicleSide === 'front' || this.VehicleSide === 'back') && ((a = o), (s = i)),
        this.Centroid)
      ) {
        let l = (this.Centroid?.x ?? 0) * t,
          u = (this.Centroid?.y ?? 0) * t;
        return (
          this.VehicleSide === 'leftSide'
            ? (u = (this.Centroid?.y ?? 0) * t - s / 2)
            : this.VehicleSide === 'rightSide'
              ? (u = (this.Centroid?.y ?? 0) * t + s / 2)
              : this.VehicleSide === 'front'
                ? (l = (this.Centroid?.x ?? 0) * t - a / 2)
                : this.VehicleSide === 'back' && (l = (this.Centroid?.x ?? 0) * t + a / 2),
          {
            x: l,
            y: u,
            width: a,
            height: s,
            fill: 'orange',
            stroke: 'darkorange',
            strokeWidth: 2,
            draggable: !0,
          }
        );
      }
      return (
        this.VehicleSide === 'leftSide'
          ? ((c = (this.SequenceFromFront ?? 0) * t - a / 2 + 5), (f = 5))
          : this.VehicleSide === 'rightSide'
            ? ((c = (this.SequenceFromFront ?? 0) * t - a / 2 + 5), (f = n * t + 5 - s))
            : this.VehicleSide === 'front'
              ? ((c = 5), (f = (n * t) / 2 + 5 - s / 2))
              : this.VehicleSide === 'back'
                ? ((c = r * t + 5 - a), (f = (n * t) / 2 + 5 - s / 2))
                : ((c = 5), (f = 5)),
        {
          x: c,
          y: f,
          width: a,
          height: s,
          fill: 'orange',
          stroke: 'darkorange',
          strokeWidth: 2,
          draggable: !0,
        }
      );
    }
  }
  class ys {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  class nu {
    attr_ref;
    attr_version;
    FromDeckEntranceRef;
    ToDeckEntranceRef;
    constructor({ attr_ref: t, attr_version: r, FromDeckEntranceRef: n, ToDeckEntranceRef: i }) {
      ((this.attr_ref = t),
        (this.attr_version = r),
        (this.FromDeckEntranceRef = new ys(n)),
        (this.ToDeckEntranceRef = new ys(i)));
    }
    toXML() {
      return {
        attr_ref: this.attr_ref,
        attr_version: this.attr_version,
        FromDeckEntranceRef: this.FromDeckEntranceRef.toXML(),
        ToDeckEntranceRef: this.ToDeckEntranceRef.toXML(),
      };
    }
  }
  class iu {
    attr_id;
    attr_version;
    Name;
    constructor({ attr_id: t, attr_version: r, Name: n }) {
      ((this.attr_id = t), (this.attr_version = r), (this.Name = n));
    }
    toXML() {
      return { attr_id: this.attr_id, Name: this.Name, attr_version: this.attr_version };
    }
  }
  class ou {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  class su {
    attr_ref;
    attr_version;
    validityConditions;
    Name;
    EntranceUsageType;
    EntranceSetting;
    ControlledLocking;
    constructor({
      attr_ref: t,
      attr_version: r,
      validityConditions: n,
      Name: i,
      EntranceUsageType: o,
      EntranceSetting: a,
      ControlledLocking: s,
    }) {
      ((this.attr_ref = t),
        (this.attr_version = r),
        (this.validityConditions = Object.entries(n).flatMap(
          ([c, f]) => (
            c === 'ValidityConditionRef' && f.map(l => new ou(l)),
            c === 'ValidityCondition' && f.map(l => new iu(l)),
            []
          )
        )),
        (this.Name = i),
        (this.EntranceUsageType = o),
        (this.EntranceSetting = a),
        (this.ControlledLocking = s));
    }
    toXML() {
      return {
        attr_ref: this.attr_ref,
        attr_version: this.attr_version,
        validityConditions: He(this.validityConditions),
        Name: this.Name,
        EntranceUsageType: this.EntranceUsageType,
        EntranceSetting: this.EntranceSetting,
        ControlledLocking: this.ControlledLocking,
      };
    }
  }
  class au {
    attr_ref;
    attr_version;
    LocatableSpotType;
    capacity;
    constructor({ attr_ref: t, attr_version: r, LocatableSpotType: n, capacity: i }) {
      ((this.attr_ref = t),
        (this.attr_version = r),
        (this.LocatableSpotType = n),
        (this.capacity = i));
    }
    toXML() {
      return {
        attr_ref: this.attr_ref,
        attr_version: this.attr_version,
        LocatableSpotType: this.LocatableSpotType,
        capacity: this.capacity,
      };
    }
  }
  class cu {
    attr_id;
    label;
    constructor({ attr_id: t, Label: r }) {
      ((this.attr_id = t), (this.label = r));
    }
    toXML() {
      return { attr_id: this.attr_id, label: this.label };
    }
  }
  class lu {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  class uu {
    attr_id;
    label;
    constructor({ attr_id: t, Label: r }) {
      ((this.attr_id = t), (this.label = r));
    }
    toXML() {
      return { attr_id: this.attr_id, label: this.label };
    }
  }
  class du {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  class ws {
    attr_id;
    attr_version;
    Label;
    Orientation;
    actualVehicleEquipments;
    SpotColumnRef;
    SpotRowRef;
    constructor({
      attr_id: t,
      attr_version: r,
      Label: n,
      Orientation: i,
      actualVehicleEquipments: o,
      SpotColumnRef: a,
      SpotRowRef: s,
    }) {
      ((this.attr_id = t),
        (this.attr_version = r),
        (this.Label = n),
        (this.Orientation = i),
        (this.actualVehicleEquipments = o ? ne(o, Qr) : []),
        (this.SpotColumnRef = a ? new lu(a) : void 0),
        (this.SpotRowRef = s ? new du(s) : void 0));
    }
  }
  class fu extends ws {
    constructor({
      attr_id: t,
      attr_version: r,
      Label: n,
      Orientation: i,
      actualVehicleEquipments: o,
      SpotColumnRef: a,
      SpotRowRef: s,
    }) {
      super({
        attr_id: t,
        attr_version: r,
        Label: n,
        Orientation: i,
        actualVehicleEquipments: o,
        SpotColumnRef: a,
        SpotRowRef: s,
      });
    }
    toXML() {
      return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        Label: this.Label,
        Orientation: this.Orientation,
        actualVehicleEquipments: { ActualVehicleEquipment: Pt(this.actualVehicleEquipments) },
        SpotColumnRef: this.SpotColumnRef?.toXML(),
        SpotRowRef: this.SpotRowRef?.toXML(),
      };
    }
  }
  class hu {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  var ti = (e => (
    (e.Occupied = 'Occupied'),
    (e.Selected = 'Selected'),
    (e.Filtered = 'Filtered'),
    (e.Defect = 'Defect'),
    (e.Undefined = 'Undefined'),
    e
  ))(ti || {});
  class Es extends ws {
    static xmlTagName = 'PassengerSpot';
    IsByWindow;
    IsByAisle;
    IsBetweenSeats;
    IsInFrontRow;
    IsInEndRow;
    TableType;
    HasPower;
    Centroid;
    Width;
    Length;
    availability;
    constructor({
      attr_id: t,
      attr_version: r,
      Label: n,
      Orientation: i,
      actualVehicleEquipments: o,
      SpotColumnRef: a,
      SpotRowRef: s,
      IsByWindow: c,
      IsByAisle: f,
      IsBetweenSeats: l,
      IsInFrontRow: u,
      IsInEndRow: p,
      TableType: m,
      HasPower: C,
      Centroid: N,
      Width: L,
      Length: $,
    }) {
      (super({
        attr_id: t,
        attr_version: r,
        Label: n,
        Orientation: i,
        actualVehicleEquipments: o,
        SpotColumnRef: a,
        SpotRowRef: s,
      }),
        (this.IsByWindow = c),
        (this.IsByAisle = f),
        (this.IsBetweenSeats = l),
        (this.IsInFrontRow = u),
        (this.IsInEndRow = p),
        (this.TableType = m),
        (this.HasPower = C),
        (this.Centroid = N ? Mt.fromXML(N) : void 0),
        (this.Width = L || 0.5),
        (this.Length = $ || 0.5));
    }
    toXML() {
      return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        Label: this.Label ? { text_value: this.Label } : void 0,
        Orientation: this.Orientation ? { text_value: this.Orientation } : void 0,
        actualVehicleEquipments: this.actualVehicleEquipments
          ? He(this.actualVehicleEquipments)
          : void 0,
        SpotColumnRef: this.SpotColumnRef?.toXML(),
        SpotRowRef: this.SpotRowRef?.toXML(),
        IsByWindow: this.IsByWindow ? { text_value: this.IsByWindow } : void 0,
        IsByAisle: this.IsByAisle ? { text_value: this.IsByAisle } : void 0,
        TableType: this.TableType ? { text_value: this.TableType } : void 0,
        HasPower: this.HasPower ? { text_value: this.HasPower } : void 0,
        Centroid: this.Centroid?.toXML(),
        Width: this.Width,
        Length: this.Length,
      };
    }
    getClasses() {
      const t = [];
      return (
        this.IsByWindow && t.push('seat__by-window'),
        this.IsByAisle && t.push('seat__by-aisle'),
        this.HasPower && t.push('seat__has-power'),
        this.Orientation && t.push(`seat__orientation-${this.Orientation}`),
        this.availability && t.push(`seat__availability-${this.availability.toLowerCase()}`),
        t.join(' ')
      );
    }
    getShape(t) {
      if (this.Centroid) {
        const r = this.Width * t,
          n = this.Length * t;
        return {
          x: (this.Centroid?.x ?? 1) * t - r / 2 + 5,
          y: (this.Centroid?.y ?? 1) * t - n / 2 + 5,
          width: r,
          height: n,
          fill: 'lightgray',
          stroke: 'gray',
          strokeWidth: 1,
          cornerRadius: 2,
          draggable: !0,
        };
      }
      return {
        x: 0,
        y: 0,
        width: this.Width * t,
        height: this.Length * t,
        fill: 'red',
        draggable: !0,
      };
    }
  }
  class pu {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  class Ns {
    value;
    constructor(t) {
      this.value = t;
    }
    toXML() {
      return this.value;
    }
  }
  class gu {
    attr_ref;
    attr_version;
    constructor({ attr_ref: t, attr_version: r }) {
      ((this.attr_ref = t), (this.attr_version = r));
    }
    toXML() {
      return { attr_ref: this.attr_ref, attr_version: this.attr_version };
    }
  }
  class ur {
    static xmlTagName = 'PassengerSpace';
    attr_id;
    attr_version;
    Name;
    SmokingAllowed;
    StandingAllowed;
    PassengerSpaceType;
    passengerSpots;
    luggageSpots;
    deckEntrances;
    deckEntranceUsage;
    deckEntranceCouples;
    deckSpaceCapacities;
    actualVehicleEquipments;
    ServiceFacilitySetRef;
    Centroid;
    Polygon;
    PublicUse;
    TotalCapacity;
    FareClass;
    AirConditioned;
    constructor({
      attr_id: t,
      attr_version: r,
      Name: n,
      SmokingAllowed: i,
      StandingAllowed: o,
      PassengerSpaceType: a,
      passengerSpots: s,
      luggageSpots: c,
      deckEntrances: f,
      deckEntranceUsage: l,
      deckEntranceCouples: u,
      deckSpaceCapacities: p,
      actualVehicleEquipments: m,
      ServiceFacilitySetRef: C,
      Centroid: N,
      Polygon: L,
      PublicUse: $,
      TotalCapacity: P,
      FareClass: D,
      AirConditioned: Z,
    }) {
      ((this.attr_id = t),
        (this.attr_version = r),
        (this.Name = n),
        (this.SmokingAllowed = i),
        (this.StandingAllowed = o),
        (this.PassengerSpaceType = a),
        (this.passengerSpots = s
          ? Object.entries(s).flatMap(([k, z]) =>
              k === 'PassengerSpot' ? ne(z, Es) : k === 'PassengerSpotRef' ? ne(z, pu) : []
            )
          : []),
        (this.luggageSpots = c
          ? Object.entries(c).flatMap(([k, z]) =>
              k === 'LuggageSpot' ? ne(z, fu) : k === 'LuggageSpotRef' ? ne(z, hu) : []
            )
          : []),
        (this.deckEntrances = ne(f?.PassengerEntrance, ru)),
        (this.deckEntranceUsage = ne(l?.DeckEntranceUsage, su)),
        (this.deckEntranceCouples = ne(u?.DeckEntranceCouple, nu)),
        (this.deckSpaceCapacities = ne(p?.DeckSpaceCapacity, au)),
        (this.actualVehicleEquipments = ne(m?.ActualVehicleEquipment, Qr)),
        (this.ServiceFacilitySetRef = C ? new gu(C) : void 0),
        (this.Centroid = N ? Mt.fromXML(N) : void 0),
        (this.Polygon = L ? new Ns(L) : void 0),
        (this.PublicUse = $?.text_value),
        (this.TotalCapacity = P?.text_value),
        (this.FareClass = D?.text_value),
        (this.AirConditioned = Z?.text_value));
    }
    static createDefault(t) {
      return new ur({
        attr_id: t,
        attr_version: '1.0',
        Name: { text_value: 'Default Space' },
        SmokingAllowed: !1,
        StandingAllowed: !0,
        PassengerSpaceType: 'seatingArea',
        passengerSpots: { PassengerSpot: [], PassengerSpotRef: [] },
        luggageSpots: { LuggageSpot: [], LuggageSpotRef: [] },
        deckEntrances: { PassengerEntrance: [] },
        deckEntranceUsage: { DeckEntranceUsage: [] },
        deckEntranceCouples: { DeckEntranceCouple: [] },
        deckSpaceCapacities: { DeckSpaceCapacity: [] },
        actualVehicleEquipments: { ActualVehicleEquipment: [] },
        ServiceFacilitySetRef: void 0,
        Centroid: void 0,
        Polygon: void 0,
        PublicUse: { text_value: !0 },
        TotalCapacity: { text_value: 0 },
        FareClass: { text_value: 'secondClass' },
        AirConditioned: { text_value: !0 },
      });
    }
    toXML() {
      return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        Name: this.Name,
        SmokingAllowed: this.SmokingAllowed,
        StandingAllowed: this.StandingAllowed,
        PassengerSpaceType: this.PassengerSpaceType,
        passengerSpots: this.passengerSpots ? He(this.passengerSpots) : '',
        luggageSpots: this.luggageSpots ? He(this.luggageSpots) : void 0,
        deckEntrances: this.deckEntrances ? He(this.deckEntrances) : void 0,
        deckEntranceUsage: this.deckEntranceUsage ? He(this.deckEntranceUsage) : void 0,
        deckEntranceCouples: this.deckEntranceCouples ? He(this.deckEntranceCouples) : void 0,
        deckSpaceCapacities: this.deckSpaceCapacities ? He(this.deckSpaceCapacities) : void 0,
        actualVehicleEquipments: this.actualVehicleEquipments
          ? He(this.actualVehicleEquipments)
          : void 0,
        ServiceFacilitySetRef: this.ServiceFacilitySetRef?.toXML(),
        Centroid: this.Centroid?.toXML(),
        Polygon: this.Polygon?.toXML(),
        PublicUse: this.PublicUse,
        TotalCapacity: this.TotalCapacity,
        FareClass: this.FareClass,
        AirConditioned: this.AirConditioned,
      };
    }
  }
  class dr {
    attr_id;
    attr_version;
    Name;
    polygon;
    deckspaces;
    DeckLevelRef;
    spotRows;
    spotColumns;
    Width;
    Length;
    constructor({
      attr_id: t,
      attr_version: r,
      deckSpaces: n,
      spotRows: i = void 0,
      spotColumns: o = void 0,
      DeckLevelRef: a = void 0,
      Name: s = void 0,
      polygon: c = void 0,
      Width: f = void 0,
      Length: l = void 0,
    }) {
      ((this.attr_id = t),
        (this.attr_version = r),
        (this.Name = s ?? ''),
        (this.polygon = c ? new Ns(c) : void 0),
        (this.DeckLevelRef = a ? new bs(a) : void 0),
        (this.Width = f ?? 2.825),
        (this.Length = l ?? 26.4),
        (this.deckspaces = n
          ? Object.entries(n).flatMap(([u, p]) =>
              u === 'OtherDeckSpace' ? ne(p, tu) : u === 'PassengerSpace' ? ne(p, ur) : []
            )
          : []),
        (this.spotRows = ne(i?.SpotRow, uu)),
        (this.spotColumns = ne(o?.SpotColumn, cu)));
    }
    static empty(t) {
      return new dr({
        attr_id: crypto.randomUUID(),
        attr_version: '1.0',
        deckSpaces: { OtherDeckSpace: [], PassengerSpace: [] },
        spotRows: {
          SpotRow: [
            { attr_id: 'spot_row_1', Label: '1' },
            { attr_id: 'spot_row_2', Label: '2' },
          ],
        },
        spotColumns: {
          SpotColumn: [
            { attr_id: 'spot_column_1', Label: '1' },
            { attr_id: 'spot_column_2', Label: '2' },
          ],
        },
        DeckLevelRef: new bs({ attr_ref: t.attr_id, attr_version: '1.0' }),
        Name: void 0,
        polygon: void 0,
        Length: 2,
        Width: 2,
      });
    }
    toXML() {
      return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        spotRows: { SpotRow: Pt(this.spotRows) },
        spotColumns: { SpotColumn: Pt(this.spotColumns) },
        deckSpaces: He(this.deckspaces),
        DeckLevelRef: this.DeckLevelRef?.toXML(),
        polygon: this.polygon?.toXML(),
        Name: this.Name,
        Width: this.Width,
        Length: this.Length,
      };
    }
    getBoundingBox() {
      const t = this.Length,
        r = this.Width;
      return { width: t, height: r };
    }
    getShape(t) {
      const { width: r, height: n } = this.getBoundingBox();
      return {
        x: 5,
        y: 5,
        width: r * t,
        height: n * t,
        fill: 'white',
        stroke: 'gray',
        strokeWidth: 2,
        cornerRadius: 5,
      };
    }
  }
  class ri {
    attr_id;
    attr_version;
    deckLevels;
    decks;
    constructor({ attr_id: t, attr_version: r, decks: n = void 0, deckLevels: i = void 0 }) {
      ((this.attr_id = t),
        (this.attr_version = r),
        (this.deckLevels = ne(i?.DeckLevel, ei)),
        (this.decks = ne(n?.Deck, dr)));
    }
    static empty() {
      const t = new ei({ Label: 'Level 1', attr_id: 'deck_level_0', attr_version: '1.0' }),
        r = new ri({
          attr_id: crypto.randomUUID(),
          attr_version: '1.0',
          decks: { Deck: [] },
          deckLevels: { DeckLevel: [t] },
        });
      return (r.decks.push(dr.empty(t)), r);
    }
    addDeckLevel() {
      const t = new ei({
        attr_id: `deck_level_${this.deckLevels.length}`,
        attr_version: '1.0',
        Label: `Level ${this.deckLevels.length + 1}`,
      });
      (this.deckLevels.push(t), this.decks.push(dr.empty(t)));
    }
    removeDeckLevel(t) {
      ((this.decks = this.decks.filter(r => r.DeckLevelRef?.attr_ref !== t)),
        (this.deckLevels = this.deckLevels.filter(r => r?.attr_id !== t)));
    }
    toXML() {
      return {
        DeckPlan: {
          xmlTagName: '',
          attr_id: this.attr_id,
          attr_version: this.attr_version,
          decks: { Deck: Pt(this.decks) },
          deckLevels: { DeckLevel: Pt(this.deckLevels) },
        },
      };
    }
  }
  const xs =
      ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD',
    mu = xs + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040',
    vu = '[' + xs + '][' + mu + ']*',
    bu = new RegExp('^' + vu + '$');
  function Ss(e, t) {
    const r = [];
    let n = t.exec(e);
    for (; n; ) {
      const i = [];
      i.startIndex = t.lastIndex - n[0].length;
      const o = n.length;
      for (let a = 0; a < o; a++) i.push(n[a]);
      (r.push(i), (n = t.exec(e)));
    }
    return r;
  }
  const en = function (e) {
    const t = bu.exec(e);
    return !(t === null || typeof t > 'u');
  };
  function _u(e) {
    return typeof e < 'u';
  }
  const ni = [
      'hasOwnProperty',
      'toString',
      'valueOf',
      '__defineGetter__',
      '__defineSetter__',
      '__lookupGetter__',
      '__lookupSetter__',
    ],
    Os = ['__proto__', 'constructor', 'prototype'],
    yu = { allowBooleanAttributes: !1, unpairedTags: [] };
  function wu(e, t) {
    t = Object.assign({}, yu, t);
    const r = [];
    let n = !1,
      i = !1;
    e[0] === '\uFEFF' && (e = e.substr(1));
    for (let o = 0; o < e.length; o++)
      if (e[o] === '<' && e[o + 1] === '?') {
        if (((o += 2), (o = ks(e, o)), o.err)) return o;
      } else if (e[o] === '<') {
        let a = o;
        if ((o++, e[o] === '!')) {
          o = Ts(e, o);
          continue;
        } else {
          let s = !1;
          e[o] === '/' && ((s = !0), o++);
          let c = '';
          for (
            ;
            o < e.length &&
            e[o] !== '>' &&
            e[o] !== ' ' &&
            e[o] !== '	' &&
            e[o] !==
              `
` &&
            e[o] !== '\r';
            o++
          )
            c += e[o];
          if (
            ((c = c.trim()),
            c[c.length - 1] === '/' && ((c = c.substring(0, c.length - 1)), o--),
            !Tu(c))
          ) {
            let u;
            return (
              c.trim().length === 0
                ? (u = "Invalid space after '<'.")
                : (u = "Tag '" + c + "' is an invalid name."),
              J('InvalidTag', u, ce(e, o))
            );
          }
          const f = xu(e, o);
          if (f === !1)
            return J('InvalidAttr', "Attributes for '" + c + "' have open quote.", ce(e, o));
          let l = f.value;
          if (((o = f.index), l[l.length - 1] === '/')) {
            const u = o - l.length;
            l = l.substring(0, l.length - 1);
            const p = Vs(l, t);
            if (p === !0) n = !0;
            else return J(p.err.code, p.err.msg, ce(e, u + p.err.line));
          } else if (s)
            if (f.tagClosed) {
              if (l.trim().length > 0)
                return J(
                  'InvalidTag',
                  "Closing tag '" + c + "' can't have attributes or invalid starting.",
                  ce(e, a)
                );
              if (r.length === 0)
                return J('InvalidTag', "Closing tag '" + c + "' has not been opened.", ce(e, a));
              {
                const u = r.pop();
                if (c !== u.tagName) {
                  let p = ce(e, u.tagStartPos);
                  return J(
                    'InvalidTag',
                    "Expected closing tag '" +
                      u.tagName +
                      "' (opened in line " +
                      p.line +
                      ', col ' +
                      p.col +
                      ") instead of closing tag '" +
                      c +
                      "'.",
                    ce(e, a)
                  );
                }
                r.length == 0 && (i = !0);
              }
            } else
              return J(
                'InvalidTag',
                "Closing tag '" + c + "' doesn't have proper closing.",
                ce(e, o)
              );
          else {
            const u = Vs(l, t);
            if (u !== !0) return J(u.err.code, u.err.msg, ce(e, o - l.length + u.err.line));
            if (i === !0) return J('InvalidXml', 'Multiple possible root nodes found.', ce(e, o));
            (t.unpairedTags.indexOf(c) !== -1 || r.push({ tagName: c, tagStartPos: a }), (n = !0));
          }
          for (o++; o < e.length; o++)
            if (e[o] === '<')
              if (e[o + 1] === '!') {
                (o++, (o = Ts(e, o)));
                continue;
              } else if (e[o + 1] === '?') {
                if (((o = ks(e, ++o)), o.err)) return o;
              } else break;
            else if (e[o] === '&') {
              const u = Cu(e, o);
              if (u == -1) return J('InvalidChar', "char '&' is not expected.", ce(e, o));
              o = u;
            } else if (i === !0 && !Cs(e[o]))
              return J('InvalidXml', 'Extra text at the end', ce(e, o));
          e[o] === '<' && o--;
        }
      } else {
        if (Cs(e[o])) continue;
        return J('InvalidChar', "char '" + e[o] + "' is not expected.", ce(e, o));
      }
    if (n) {
      if (r.length == 1)
        return J('InvalidTag', "Unclosed tag '" + r[0].tagName + "'.", ce(e, r[0].tagStartPos));
      if (r.length > 0)
        return J(
          'InvalidXml',
          "Invalid '" +
            JSON.stringify(
              r.map(o => o.tagName),
              null,
              4
            ).replace(/\r?\n/g, '') +
            "' found.",
          { line: 1, col: 1 }
        );
    } else return J('InvalidXml', 'Start tag expected.', 1);
    return !0;
  }
  function Cs(e) {
    return (
      e === ' ' ||
      e === '	' ||
      e ===
        `
` ||
      e === '\r'
    );
  }
  function ks(e, t) {
    const r = t;
    for (; t < e.length; t++)
      if (e[t] == '?' || e[t] == ' ') {
        const n = e.substr(r, t - r);
        if (t > 5 && n === 'xml')
          return J(
            'InvalidXml',
            'XML declaration allowed only at the start of the document.',
            ce(e, t)
          );
        if (e[t] == '?' && e[t + 1] == '>') {
          t++;
          break;
        } else continue;
      }
    return t;
  }
  function Ts(e, t) {
    if (e.length > t + 5 && e[t + 1] === '-' && e[t + 2] === '-') {
      for (t += 3; t < e.length; t++)
        if (e[t] === '-' && e[t + 1] === '-' && e[t + 2] === '>') {
          t += 2;
          break;
        }
    } else if (
      e.length > t + 8 &&
      e[t + 1] === 'D' &&
      e[t + 2] === 'O' &&
      e[t + 3] === 'C' &&
      e[t + 4] === 'T' &&
      e[t + 5] === 'Y' &&
      e[t + 6] === 'P' &&
      e[t + 7] === 'E'
    ) {
      let r = 1;
      for (t += 8; t < e.length; t++)
        if (e[t] === '<') r++;
        else if (e[t] === '>' && (r--, r === 0)) break;
    } else if (
      e.length > t + 9 &&
      e[t + 1] === '[' &&
      e[t + 2] === 'C' &&
      e[t + 3] === 'D' &&
      e[t + 4] === 'A' &&
      e[t + 5] === 'T' &&
      e[t + 6] === 'A' &&
      e[t + 7] === '['
    ) {
      for (t += 8; t < e.length; t++)
        if (e[t] === ']' && e[t + 1] === ']' && e[t + 2] === '>') {
          t += 2;
          break;
        }
    }
    return t;
  }
  const Eu = '"',
    Nu = "'";
  function xu(e, t) {
    let r = '',
      n = '',
      i = !1;
    for (; t < e.length; t++) {
      if (e[t] === Eu || e[t] === Nu) n === '' ? (n = e[t]) : n !== e[t] || (n = '');
      else if (e[t] === '>' && n === '') {
        i = !0;
        break;
      }
      r += e[t];
    }
    return n !== '' ? !1 : { value: r, index: t, tagClosed: i };
  }
  const Su = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, 'g');
  function Vs(e, t) {
    const r = Ss(e, Su),
      n = {};
    for (let i = 0; i < r.length; i++) {
      if (r[i][1].length === 0)
        return J('InvalidAttr', "Attribute '" + r[i][2] + "' has no space in starting.", fr(r[i]));
      if (r[i][3] !== void 0 && r[i][4] === void 0)
        return J('InvalidAttr', "Attribute '" + r[i][2] + "' is without value.", fr(r[i]));
      if (r[i][3] === void 0 && !t.allowBooleanAttributes)
        return J('InvalidAttr', "boolean attribute '" + r[i][2] + "' is not allowed.", fr(r[i]));
      const o = r[i][2];
      if (!ku(o)) return J('InvalidAttr', "Attribute '" + o + "' is an invalid name.", fr(r[i]));
      if (!Object.prototype.hasOwnProperty.call(n, o)) n[o] = 1;
      else return J('InvalidAttr', "Attribute '" + o + "' is repeated.", fr(r[i]));
    }
    return !0;
  }
  function Ou(e, t) {
    let r = /\d/;
    for (e[t] === 'x' && (t++, (r = /[\da-fA-F]/)); t < e.length; t++) {
      if (e[t] === ';') return t;
      if (!e[t].match(r)) break;
    }
    return -1;
  }
  function Cu(e, t) {
    if ((t++, e[t] === ';')) return -1;
    if (e[t] === '#') return (t++, Ou(e, t));
    let r = 0;
    for (; t < e.length; t++, r++)
      if (!(e[t].match(/\w/) && r < 20)) {
        if (e[t] === ';') break;
        return -1;
      }
    return t;
  }
  function J(e, t, r) {
    return { err: { code: e, msg: t, line: r.line || r, col: r.col } };
  }
  function ku(e) {
    return en(e);
  }
  function Tu(e) {
    return en(e);
  }
  function ce(e, t) {
    const r = e.substring(0, t).split(/\r?\n/);
    return { line: r.length, col: r[r.length - 1].length + 1 };
  }
  function fr(e) {
    return e.startIndex + e[1].length;
  }
  const Vu = {
      cent: '¢',
      pound: '£',
      curren: '¤',
      yen: '¥',
      euro: '€',
      dollar: '$',
      euro: '€',
      fnof: 'ƒ',
      inr: '₹',
      af: '؋',
      birr: 'ብር',
      peso: '₱',
      rub: '₽',
      won: '₩',
      yuan: '¥',
      cedil: '¸',
    },
    As = { amp: '&', apos: "'", gt: '>', lt: '<', quot: '"' },
    Au = {
      nbsp: ' ',
      copy: '©',
      reg: '®',
      trade: '™',
      mdash: '—',
      ndash: '–',
      hellip: '…',
      laquo: '«',
      raquo: '»',
      lsquo: '‘',
      rsquo: '’',
      ldquo: '“',
      rdquo: '”',
      bull: '•',
      para: '¶',
      sect: '§',
      deg: '°',
      frac12: '½',
      frac14: '¼',
      frac34: '¾',
    },
    Iu = new Set('!?\\\\/[]$%{}^&*()<>|+');
  function Is(e) {
    if (e[0] === '#')
      throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${e}"`);
    for (const t of e)
      if (Iu.has(t))
        throw new Error(`[EntityReplacer] Invalid character '${t}' in entity name: "${e}"`);
    return e;
  }
  function ii(...e) {
    const t = Object.create(null);
    for (const r of e)
      if (r)
        for (const n of Object.keys(r)) {
          const i = r[n];
          if (typeof i == 'string') t[n] = i;
          else if (i && typeof i == 'object' && i.val !== void 0) {
            const o = i.val;
            typeof o == 'string' && (t[n] = o);
          }
        }
    return t;
  }
  const wt = 'external',
    tn = 'base',
    oi = 'all';
  function Pu(e) {
    return !e || e === wt
      ? new Set([wt])
      : e === oi
        ? new Set([oi])
        : e === tn
          ? new Set([tn])
          : Array.isArray(e)
            ? new Set(e)
            : new Set([wt]);
  }
  const he = Object.freeze({ allow: 0, leave: 1, remove: 2, throw: 3 }),
    Mu = new Set([9, 10, 13]);
  function Lu(e) {
    if (!e) return { xmlVersion: 1, onLevel: he.allow, nullLevel: he.remove };
    const t = e.xmlVersion === 1.1 ? 1.1 : 1,
      r = he[e.onNCR] ?? he.allow,
      n = he[e.nullNCR] ?? he.remove,
      i = Math.max(n, he.remove);
    return { xmlVersion: t, onLevel: r, nullLevel: i };
  }
  class Ru {
    constructor(t = {}) {
      ((this._limit = t.limit || {}),
        (this._maxTotalExpansions = this._limit.maxTotalExpansions || 0),
        (this._maxExpandedLength = this._limit.maxExpandedLength || 0),
        (this._postCheck = typeof t.postCheck == 'function' ? t.postCheck : n => n),
        (this._limitTiers = Pu(this._limit.applyLimitsTo ?? wt)),
        (this._numericAllowed = t.numericAllowed ?? !0),
        (this._baseMap = ii(As, t.namedEntities || null)),
        (this._externalMap = Object.create(null)),
        (this._inputMap = Object.create(null)),
        (this._totalExpansions = 0),
        (this._expandedLength = 0),
        (this._removeSet = new Set(t.remove && Array.isArray(t.remove) ? t.remove : [])),
        (this._leaveSet = new Set(t.leave && Array.isArray(t.leave) ? t.leave : [])));
      const r = Lu(t.ncr);
      ((this._ncrXmlVersion = r.xmlVersion),
        (this._ncrOnLevel = r.onLevel),
        (this._ncrNullLevel = r.nullLevel));
    }
    setExternalEntities(t) {
      if (t) for (const r of Object.keys(t)) Is(r);
      this._externalMap = ii(t);
    }
    addExternalEntity(t, r) {
      (Is(t), typeof r == 'string' && r.indexOf('&') === -1 && (this._externalMap[t] = r));
    }
    addInputEntities(t) {
      ((this._totalExpansions = 0), (this._expandedLength = 0), (this._inputMap = ii(t)));
    }
    reset() {
      return (
        (this._inputMap = Object.create(null)),
        (this._totalExpansions = 0),
        (this._expandedLength = 0),
        this
      );
    }
    setXmlVersion(t) {
      this._ncrXmlVersion = t === 1.1 ? 1.1 : 1;
    }
    decode(t) {
      if (typeof t != 'string' || t.length === 0) return t;
      const r = t,
        n = [],
        i = t.length;
      let o = 0,
        a = 0;
      const s = this._maxTotalExpansions > 0,
        c = this._maxExpandedLength > 0,
        f = s || c;
      for (; a < i; ) {
        if (t.charCodeAt(a) !== 38) {
          a++;
          continue;
        }
        let u = a + 1;
        for (; u < i && t.charCodeAt(u) !== 59 && u - a <= 32; ) u++;
        if (u >= i || t.charCodeAt(u) !== 59) {
          a++;
          continue;
        }
        const p = t.slice(a + 1, u);
        if (p.length === 0) {
          a++;
          continue;
        }
        let m, C;
        if (this._removeSet.has(p)) ((m = ''), C === void 0 && (C = wt));
        else if (this._leaveSet.has(p)) {
          a++;
          continue;
        } else if (p.charCodeAt(0) === 35) {
          const N = this._resolveNCR(p);
          if (N === void 0) {
            a++;
            continue;
          }
          ((m = N), (C = tn));
        } else {
          const N = this._resolveName(p);
          ((m = N?.value), (C = N?.tier));
        }
        if (m === void 0) {
          a++;
          continue;
        }
        if (
          (a > o && n.push(t.slice(o, a)),
          n.push(m),
          (o = u + 1),
          (a = o),
          f && this._tierCounts(C))
        ) {
          if (s && (this._totalExpansions++, this._totalExpansions > this._maxTotalExpansions))
            throw new Error(
              `[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`
            );
          if (c) {
            const N = m.length - (p.length + 2);
            if (
              N > 0 &&
              ((this._expandedLength += N), this._expandedLength > this._maxExpandedLength)
            )
              throw new Error(
                `[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`
              );
          }
        }
      }
      o < i && n.push(t.slice(o));
      const l = n.length === 0 ? t : n.join('');
      return this._postCheck(l, r);
    }
    _tierCounts(t) {
      return this._limitTiers.has(oi) ? !0 : this._limitTiers.has(t);
    }
    _resolveName(t) {
      if (t in this._inputMap) return { value: this._inputMap[t], tier: wt };
      if (t in this._externalMap) return { value: this._externalMap[t], tier: wt };
      if (t in this._baseMap) return { value: this._baseMap[t], tier: tn };
    }
    _classifyNCR(t) {
      return t === 0
        ? this._ncrNullLevel
        : (t >= 55296 && t <= 57343) ||
            (this._ncrXmlVersion === 1 && t >= 1 && t <= 31 && !Mu.has(t))
          ? he.remove
          : -1;
    }
    _applyNCRAction(t, r, n) {
      switch (t) {
        case he.allow:
          return String.fromCodePoint(n);
        case he.remove:
          return '';
        case he.leave:
          return;
        case he.throw:
          throw new Error(
            `[EntityDecoder] Prohibited numeric character reference &${r}; (U+${n.toString(16).toUpperCase().padStart(4, '0')})`
          );
        default:
          return String.fromCodePoint(n);
      }
    }
    _resolveNCR(t) {
      const r = t.charCodeAt(1);
      let n;
      if (
        (r === 120 || r === 88 ? (n = parseInt(t.slice(2), 16)) : (n = parseInt(t.slice(1), 10)),
        Number.isNaN(n) || n < 0 || n > 1114111)
      )
        return;
      const i = this._classifyNCR(n);
      if (!this._numericAllowed && i < he.remove) return;
      const o = i === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, i);
      return this._applyNCRAction(o, t, n);
    }
  }
  const Ps = e => (ni.includes(e) ? '__' + e : e),
    $u = {
      preserveOrder: !1,
      attributeNamePrefix: '@_',
      attributesGroupName: !1,
      textNodeName: '#text',
      ignoreAttributes: !0,
      removeNSPrefix: !1,
      allowBooleanAttributes: !1,
      parseTagValue: !0,
      parseAttributeValue: !1,
      trimValues: !0,
      cdataPropName: !1,
      numberParseOptions: { hex: !0, leadingZeros: !0, eNotation: !0 },
      tagValueProcessor: function (e, t) {
        return t;
      },
      attributeValueProcessor: function (e, t) {
        return t;
      },
      stopNodes: [],
      alwaysCreateTextNode: !1,
      isArray: () => !1,
      commentPropName: !1,
      unpairedTags: [],
      processEntities: !0,
      htmlEntities: !1,
      entityDecoder: null,
      ignoreDeclaration: !1,
      ignorePiTags: !1,
      transformTagName: !1,
      transformAttributeName: !1,
      updateTag: function (e, t, r) {
        return e;
      },
      captureMetaData: !1,
      maxNestedTags: 100,
      strictReservedNames: !0,
      jPath: !0,
      onDangerousProperty: Ps,
    };
  function Du(e, t) {
    if (typeof e != 'string') return;
    const r = e.toLowerCase();
    if (ni.some(n => r === n.toLowerCase()))
      throw new Error(
        `[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`
      );
    if (Os.some(n => r === n.toLowerCase()))
      throw new Error(
        `[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`
      );
  }
  function Ms(e, t) {
    return typeof e == 'boolean'
      ? {
          enabled: e,
          maxEntitySize: 1e4,
          maxExpansionDepth: 1e4,
          maxTotalExpansions: 1 / 0,
          maxExpandedLength: 1e5,
          maxEntityCount: 1e3,
          allowedTags: null,
          tagFilter: null,
          appliesTo: 'all',
        }
      : typeof e == 'object' && e !== null
        ? {
            enabled: e.enabled !== !1,
            maxEntitySize: Math.max(1, e.maxEntitySize ?? 1e4),
            maxExpansionDepth: Math.max(1, e.maxExpansionDepth ?? 1e4),
            maxTotalExpansions: Math.max(1, e.maxTotalExpansions ?? 1 / 0),
            maxExpandedLength: Math.max(1, e.maxExpandedLength ?? 1e5),
            maxEntityCount: Math.max(1, e.maxEntityCount ?? 1e3),
            allowedTags: e.allowedTags ?? null,
            tagFilter: e.tagFilter ?? null,
            appliesTo: e.appliesTo ?? 'all',
          }
        : Ms(!0);
  }
  const Fu = function (e) {
    const t = Object.assign({}, $u, e),
      r = [
        { value: t.attributeNamePrefix, name: 'attributeNamePrefix' },
        { value: t.attributesGroupName, name: 'attributesGroupName' },
        { value: t.textNodeName, name: 'textNodeName' },
        { value: t.cdataPropName, name: 'cdataPropName' },
        { value: t.commentPropName, name: 'commentPropName' },
      ];
    for (const { value: n, name: i } of r) n && Du(n, i);
    return (
      t.onDangerousProperty === null && (t.onDangerousProperty = Ps),
      (t.processEntities = Ms(t.processEntities, t.htmlEntities)),
      (t.unpairedTagsSet = new Set(t.unpairedTags)),
      t.stopNodes &&
        Array.isArray(t.stopNodes) &&
        (t.stopNodes = t.stopNodes.map(n =>
          typeof n == 'string' && n.startsWith('*.') ? '..' + n.substring(2) : n
        )),
      t
    );
  };
  let rn;
  typeof Symbol != 'function' ? (rn = '@@xmlMetadata') : (rn = Symbol('XML Node Metadata'));
  class at {
    constructor(t) {
      ((this.tagname = t), (this.child = []), (this[':@'] = Object.create(null)));
    }
    add(t, r) {
      (t === '__proto__' && (t = '#__proto__'), this.child.push({ [t]: r }));
    }
    addChild(t, r) {
      (t.tagname === '__proto__' && (t.tagname = '#__proto__'),
        t[':@'] && Object.keys(t[':@']).length > 0
          ? this.child.push({ [t.tagname]: t.child, ':@': t[':@'] })
          : this.child.push({ [t.tagname]: t.child }),
        r !== void 0 && (this.child[this.child.length - 1][rn] = { startIndex: r }));
    }
    static getMetaDataSymbol() {
      return rn;
    }
  }
  class ju {
    constructor(t) {
      ((this.suppressValidationErr = !t), (this.options = t));
    }
    readDocType(t, r) {
      const n = Object.create(null);
      let i = 0;
      if (
        t[r + 3] === 'O' &&
        t[r + 4] === 'C' &&
        t[r + 5] === 'T' &&
        t[r + 6] === 'Y' &&
        t[r + 7] === 'P' &&
        t[r + 8] === 'E'
      ) {
        r = r + 9;
        let o = 1,
          a = !1,
          s = !1,
          c = '';
        for (; r < t.length; r++)
          if (t[r] === '<' && !s) {
            if (a && Et(t, '!ENTITY', r)) {
              r += 7;
              let f, l;
              if (
                (([f, l, r] = this.readEntityExp(t, r + 1, this.suppressValidationErr)),
                l.indexOf('&') === -1)
              ) {
                if (
                  this.options.enabled !== !1 &&
                  this.options.maxEntityCount != null &&
                  i >= this.options.maxEntityCount
                )
                  throw new Error(
                    `Entity count (${i + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
                  );
                ((n[f] = l), i++);
              }
            } else if (a && Et(t, '!ELEMENT', r)) {
              r += 8;
              const { index: f } = this.readElementExp(t, r + 1);
              r = f;
            } else if (a && Et(t, '!ATTLIST', r)) r += 8;
            else if (a && Et(t, '!NOTATION', r)) {
              r += 9;
              const { index: f } = this.readNotationExp(t, r + 1, this.suppressValidationErr);
              r = f;
            } else if (Et(t, '!--', r)) s = !0;
            else throw new Error('Invalid DOCTYPE');
            (o++, (c = ''));
          } else if (t[r] === '>') {
            if ((s ? t[r - 1] === '-' && t[r - 2] === '-' && ((s = !1), o--) : o--, o === 0)) break;
          } else t[r] === '[' ? (a = !0) : (c += t[r]);
        if (o !== 0) throw new Error('Unclosed DOCTYPE');
      } else throw new Error('Invalid Tag instead of DOCTYPE');
      return { entities: n, i: r };
    }
    readEntityExp(t, r) {
      r = pe(t, r);
      const n = r;
      for (; r < t.length && !/\s/.test(t[r]) && t[r] !== '"' && t[r] !== "'"; ) r++;
      let i = t.substring(n, r);
      if ((hr(i), (r = pe(t, r)), !this.suppressValidationErr)) {
        if (t.substring(r, r + 6).toUpperCase() === 'SYSTEM')
          throw new Error('External entities are not supported');
        if (t[r] === '%') throw new Error('Parameter entities are not supported');
      }
      let o = '';
      if (
        (([r, o] = this.readIdentifierVal(t, r, 'entity')),
        this.options.enabled !== !1 &&
          this.options.maxEntitySize != null &&
          o.length > this.options.maxEntitySize)
      )
        throw new Error(
          `Entity "${i}" size (${o.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
        );
      return (r--, [i, o, r]);
    }
    readNotationExp(t, r) {
      r = pe(t, r);
      const n = r;
      for (; r < t.length && !/\s/.test(t[r]); ) r++;
      let i = t.substring(n, r);
      (!this.suppressValidationErr && hr(i), (r = pe(t, r)));
      const o = t.substring(r, r + 6).toUpperCase();
      if (!this.suppressValidationErr && o !== 'SYSTEM' && o !== 'PUBLIC')
        throw new Error(`Expected SYSTEM or PUBLIC, found "${o}"`);
      ((r += o.length), (r = pe(t, r)));
      let a = null,
        s = null;
      if (o === 'PUBLIC')
        (([r, a] = this.readIdentifierVal(t, r, 'publicIdentifier')),
          (r = pe(t, r)),
          (t[r] === '"' || t[r] === "'") &&
            ([r, s] = this.readIdentifierVal(t, r, 'systemIdentifier')));
      else if (
        o === 'SYSTEM' &&
        (([r, s] = this.readIdentifierVal(t, r, 'systemIdentifier')),
        !this.suppressValidationErr && !s)
      )
        throw new Error('Missing mandatory system identifier for SYSTEM notation');
      return { notationName: i, publicIdentifier: a, systemIdentifier: s, index: --r };
    }
    readIdentifierVal(t, r, n) {
      let i = '';
      const o = t[r];
      if (o !== '"' && o !== "'") throw new Error(`Expected quoted string, found "${o}"`);
      r++;
      const a = r;
      for (; r < t.length && t[r] !== o; ) r++;
      if (((i = t.substring(a, r)), t[r] !== o)) throw new Error(`Unterminated ${n} value`);
      return (r++, [r, i]);
    }
    readElementExp(t, r) {
      r = pe(t, r);
      const n = r;
      for (; r < t.length && !/\s/.test(t[r]); ) r++;
      let i = t.substring(n, r);
      if (!this.suppressValidationErr && !en(i)) throw new Error(`Invalid element name: "${i}"`);
      r = pe(t, r);
      let o = '';
      if (t[r] === 'E' && Et(t, 'MPTY', r)) r += 4;
      else if (t[r] === 'A' && Et(t, 'NY', r)) r += 2;
      else if (t[r] === '(') {
        r++;
        const a = r;
        for (; r < t.length && t[r] !== ')'; ) r++;
        if (((o = t.substring(a, r)), t[r] !== ')')) throw new Error('Unterminated content model');
      } else if (!this.suppressValidationErr)
        throw new Error(`Invalid Element Expression, found "${t[r]}"`);
      return { elementName: i, contentModel: o.trim(), index: r };
    }
    readAttlistExp(t, r) {
      r = pe(t, r);
      let n = r;
      for (; r < t.length && !/\s/.test(t[r]); ) r++;
      let i = t.substring(n, r);
      for (hr(i), r = pe(t, r), n = r; r < t.length && !/\s/.test(t[r]); ) r++;
      let o = t.substring(n, r);
      if (!hr(o)) throw new Error(`Invalid attribute name: "${o}"`);
      r = pe(t, r);
      let a = '';
      if (t.substring(r, r + 8).toUpperCase() === 'NOTATION') {
        if (((a = 'NOTATION'), (r += 8), (r = pe(t, r)), t[r] !== '('))
          throw new Error(`Expected '(', found "${t[r]}"`);
        r++;
        let c = [];
        for (; r < t.length && t[r] !== ')'; ) {
          const f = r;
          for (; r < t.length && t[r] !== '|' && t[r] !== ')'; ) r++;
          let l = t.substring(f, r);
          if (((l = l.trim()), !hr(l))) throw new Error(`Invalid notation name: "${l}"`);
          (c.push(l), t[r] === '|' && (r++, (r = pe(t, r))));
        }
        if (t[r] !== ')') throw new Error('Unterminated list of notations');
        (r++, (a += ' (' + c.join('|') + ')'));
      } else {
        const c = r;
        for (; r < t.length && !/\s/.test(t[r]); ) r++;
        a += t.substring(c, r);
        const f = ['CDATA', 'ID', 'IDREF', 'IDREFS', 'ENTITY', 'ENTITIES', 'NMTOKEN', 'NMTOKENS'];
        if (!this.suppressValidationErr && !f.includes(a.toUpperCase()))
          throw new Error(`Invalid attribute type: "${a}"`);
      }
      r = pe(t, r);
      let s = '';
      return (
        t.substring(r, r + 8).toUpperCase() === '#REQUIRED'
          ? ((s = '#REQUIRED'), (r += 8))
          : t.substring(r, r + 7).toUpperCase() === '#IMPLIED'
            ? ((s = '#IMPLIED'), (r += 7))
            : ([r, s] = this.readIdentifierVal(t, r, 'ATTLIST')),
        { elementName: i, attributeName: o, attributeType: a, defaultValue: s, index: r }
      );
    }
  }
  const pe = (e, t) => {
    for (; t < e.length && /\s/.test(e[t]); ) t++;
    return t;
  };
  function Et(e, t, r) {
    for (let n = 0; n < t.length; n++) if (t[n] !== e[r + n + 1]) return !1;
    return !0;
  }
  function hr(e) {
    if (en(e)) return e;
    throw new Error(`Invalid entity name ${e}`);
  }
  const Uu = /^[-+]?0x[a-fA-F0-9]+$/,
    Hu = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,
    Wu = { hex: !0, leadingZeros: !0, decimalPoint: '.', eNotation: !0, infinity: 'original' };
  function Bu(e, t = {}) {
    if (((t = Object.assign({}, Wu, t)), !e || typeof e != 'string')) return e;
    let r = e.trim();
    if (r.length === 0) return e;
    if (t.skipLike !== void 0 && t.skipLike.test(r)) return e;
    if (r === '0') return 0;
    if (t.hex && Uu.test(r)) return Ku(r, 16);
    if (isFinite(r)) {
      if (r.includes('e') || r.includes('E')) return Xu(e, r, t);
      {
        const n = Hu.exec(r);
        if (n) {
          const i = n[1] || '',
            o = n[2];
          let a = zu(n[3]);
          const s = i ? e[o.length + 1] === '.' : e[o.length] === '.';
          if (!t.leadingZeros && (o.length > 1 || (o.length === 1 && !s))) return e;
          {
            const c = Number(r),
              f = String(c);
            if (c === 0) return c;
            if (f.search(/[eE]/) !== -1) return t.eNotation ? c : e;
            if (r.indexOf('.') !== -1) return f === '0' || f === a || f === `${i}${a}` ? c : e;
            let l = o ? a : r;
            return o ? (l === f || i + l === f ? c : e) : l === f || l === i + f ? c : e;
          }
        } else return e;
      }
    } else return Gu(e, Number(r), t);
  }
  const qu = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
  function Xu(e, t, r) {
    if (!r.eNotation) return e;
    const n = t.match(qu);
    if (n) {
      let i = n[1] || '';
      const o = n[3].indexOf('e') === -1 ? 'E' : 'e',
        a = n[2],
        s = i ? e[a.length + 1] === o : e[a.length] === o;
      return a.length > 1 && s
        ? e
        : a.length === 1 && (n[3].startsWith(`.${o}`) || n[3][0] === o)
          ? Number(t)
          : a.length > 0
            ? r.leadingZeros && !s
              ? ((t = (n[1] || '') + n[3]), Number(t))
              : e
            : Number(t);
    } else return e;
  }
  function zu(e) {
    return (
      e &&
        e.indexOf('.') !== -1 &&
        ((e = e.replace(/0+$/, '')),
        e === '.'
          ? (e = '0')
          : e[0] === '.'
            ? (e = '0' + e)
            : e[e.length - 1] === '.' && (e = e.substring(0, e.length - 1))),
      e
    );
  }
  function Ku(e, t) {
    if (parseInt) return parseInt(e, t);
    if (Number.parseInt) return Number.parseInt(e, t);
    if (window && window.parseInt) return window.parseInt(e, t);
    throw new Error('parseInt, Number.parseInt, window.parseInt are not supported');
  }
  function Gu(e, t, r) {
    const n = t === 1 / 0;
    switch (r.infinity.toLowerCase()) {
      case 'null':
        return null;
      case 'infinity':
        return t;
      case 'string':
        return n ? 'Infinity' : '-Infinity';
      default:
        return e;
    }
  }
  function Yu(e) {
    return typeof e == 'function'
      ? e
      : Array.isArray(e)
        ? t => {
            for (const r of e)
              if ((typeof r == 'string' && t === r) || (r instanceof RegExp && r.test(t)))
                return !0;
          }
        : () => !1;
  }
  class Ls {
    constructor(t, r = {}, n) {
      ((this.pattern = t),
        (this.separator = r.separator || '.'),
        (this.segments = this._parse(t)),
        (this.data = n),
        (this._hasDeepWildcard = this.segments.some(i => i.type === 'deep-wildcard')),
        (this._hasAttributeCondition = this.segments.some(i => i.attrName !== void 0)),
        (this._hasPositionSelector = this.segments.some(i => i.position !== void 0)));
    }
    _parse(t) {
      const r = [];
      let n = 0,
        i = '';
      for (; n < t.length; )
        t[n] === this.separator
          ? n + 1 < t.length && t[n + 1] === this.separator
            ? (i.trim() && (r.push(this._parseSegment(i.trim())), (i = '')),
              r.push({ type: 'deep-wildcard' }),
              (n += 2))
            : (i.trim() && r.push(this._parseSegment(i.trim())), (i = ''), n++)
          : ((i += t[n]), n++);
      return (i.trim() && r.push(this._parseSegment(i.trim())), r);
    }
    _parseSegment(t) {
      const r = { type: 'tag' };
      let n = null,
        i = t;
      const o = t.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
      if (o && ((i = o[1] + o[3]), o[2])) {
        const l = o[2].slice(1, -1);
        l && (n = l);
      }
      let a,
        s = i;
      if (i.includes('::')) {
        const l = i.indexOf('::');
        if (((a = i.substring(0, l).trim()), (s = i.substring(l + 2).trim()), !a))
          throw new Error(`Invalid namespace in pattern: ${t}`);
      }
      let c,
        f = null;
      if (s.includes(':')) {
        const l = s.lastIndexOf(':'),
          u = s.substring(0, l).trim(),
          p = s.substring(l + 1).trim();
        ['first', 'last', 'odd', 'even'].includes(p) || /^nth\(\d+\)$/.test(p)
          ? ((c = u), (f = p))
          : (c = s);
      } else c = s;
      if (!c) throw new Error(`Invalid segment pattern: ${t}`);
      if (((r.tag = c), a && (r.namespace = a), n))
        if (n.includes('=')) {
          const l = n.indexOf('=');
          ((r.attrName = n.substring(0, l).trim()), (r.attrValue = n.substring(l + 1).trim()));
        } else r.attrName = n.trim();
      if (f) {
        const l = f.match(/^nth\((\d+)\)$/);
        l ? ((r.position = 'nth'), (r.positionValue = parseInt(l[1], 10))) : (r.position = f);
      }
      return r;
    }
    get length() {
      return this.segments.length;
    }
    hasDeepWildcard() {
      return this._hasDeepWildcard;
    }
    hasAttributeCondition() {
      return this._hasAttributeCondition;
    }
    hasPositionSelector() {
      return this._hasPositionSelector;
    }
    toString() {
      return this.pattern;
    }
  }
  class Ju {
    constructor() {
      ((this._byDepthAndTag = new Map()),
        (this._wildcardByDepth = new Map()),
        (this._deepWildcards = []),
        (this._patterns = new Set()),
        (this._sealed = !1));
    }
    add(t) {
      if (this._sealed)
        throw new TypeError(
          'ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.'
        );
      if (this._patterns.has(t.pattern)) return this;
      if ((this._patterns.add(t.pattern), t.hasDeepWildcard()))
        return (this._deepWildcards.push(t), this);
      const r = t.length,
        i = t.segments[t.segments.length - 1]?.tag;
      if (!i || i === '*')
        (this._wildcardByDepth.has(r) || this._wildcardByDepth.set(r, []),
          this._wildcardByDepth.get(r).push(t));
      else {
        const o = `${r}:${i}`;
        (this._byDepthAndTag.has(o) || this._byDepthAndTag.set(o, []),
          this._byDepthAndTag.get(o).push(t));
      }
      return this;
    }
    addAll(t) {
      for (const r of t) this.add(r);
      return this;
    }
    has(t) {
      return this._patterns.has(t.pattern);
    }
    get size() {
      return this._patterns.size;
    }
    seal() {
      return ((this._sealed = !0), this);
    }
    get isSealed() {
      return this._sealed;
    }
    matchesAny(t) {
      return this.findMatch(t) !== null;
    }
    findMatch(t) {
      const r = t.getDepth(),
        n = t.getCurrentTag(),
        i = `${r}:${n}`,
        o = this._byDepthAndTag.get(i);
      if (o) {
        for (let s = 0; s < o.length; s++) if (t.matches(o[s])) return o[s];
      }
      const a = this._wildcardByDepth.get(r);
      if (a) {
        for (let s = 0; s < a.length; s++) if (t.matches(a[s])) return a[s];
      }
      for (let s = 0; s < this._deepWildcards.length; s++)
        if (t.matches(this._deepWildcards[s])) return this._deepWildcards[s];
      return null;
    }
  }
  class Zu {
    constructor(t) {
      this._matcher = t;
    }
    get separator() {
      return this._matcher.separator;
    }
    getCurrentTag() {
      const t = this._matcher.path;
      return t.length > 0 ? t[t.length - 1].tag : void 0;
    }
    getCurrentNamespace() {
      const t = this._matcher.path;
      return t.length > 0 ? t[t.length - 1].namespace : void 0;
    }
    getAttrValue(t) {
      const r = this._matcher.path;
      if (r.length !== 0) return r[r.length - 1].values?.[t];
    }
    hasAttr(t) {
      const r = this._matcher.path;
      if (r.length === 0) return !1;
      const n = r[r.length - 1];
      return n.values !== void 0 && t in n.values;
    }
    getPosition() {
      const t = this._matcher.path;
      return t.length === 0 ? -1 : (t[t.length - 1].position ?? 0);
    }
    getCounter() {
      const t = this._matcher.path;
      return t.length === 0 ? -1 : (t[t.length - 1].counter ?? 0);
    }
    getIndex() {
      return this.getPosition();
    }
    getDepth() {
      return this._matcher.path.length;
    }
    toString(t, r = !0) {
      return this._matcher.toString(t, r);
    }
    toArray() {
      return this._matcher.path.map(t => t.tag);
    }
    matches(t) {
      return this._matcher.matches(t);
    }
    matchesAny(t) {
      return t.matchesAny(this._matcher);
    }
  }
  class Qu {
    constructor(t = {}) {
      ((this.separator = t.separator || '.'),
        (this.path = []),
        (this.siblingStacks = []),
        (this._pathStringCache = null),
        (this._view = new Zu(this)));
    }
    push(t, r = null, n = null) {
      ((this._pathStringCache = null),
        this.path.length > 0 && (this.path[this.path.length - 1].values = void 0));
      const i = this.path.length;
      this.siblingStacks[i] || (this.siblingStacks[i] = new Map());
      const o = this.siblingStacks[i],
        a = n ? `${n}:${t}` : t,
        s = o.get(a) || 0;
      let c = 0;
      for (const l of o.values()) c += l;
      o.set(a, s + 1);
      const f = { tag: t, position: c, counter: s };
      (n != null && (f.namespace = n), r != null && (f.values = r), this.path.push(f));
    }
    pop() {
      if (this.path.length === 0) return;
      this._pathStringCache = null;
      const t = this.path.pop();
      return (
        this.siblingStacks.length > this.path.length + 1 &&
          (this.siblingStacks.length = this.path.length + 1),
        t
      );
    }
    updateCurrent(t) {
      if (this.path.length > 0) {
        const r = this.path[this.path.length - 1];
        t != null && (r.values = t);
      }
    }
    getCurrentTag() {
      return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
    }
    getCurrentNamespace() {
      return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
    }
    getAttrValue(t) {
      if (this.path.length !== 0) return this.path[this.path.length - 1].values?.[t];
    }
    hasAttr(t) {
      if (this.path.length === 0) return !1;
      const r = this.path[this.path.length - 1];
      return r.values !== void 0 && t in r.values;
    }
    getPosition() {
      return this.path.length === 0 ? -1 : (this.path[this.path.length - 1].position ?? 0);
    }
    getCounter() {
      return this.path.length === 0 ? -1 : (this.path[this.path.length - 1].counter ?? 0);
    }
    getIndex() {
      return this.getPosition();
    }
    getDepth() {
      return this.path.length;
    }
    toString(t, r = !0) {
      const n = t || this.separator;
      if (n === this.separator && r === !0) {
        if (this._pathStringCache !== null) return this._pathStringCache;
        const o = this.path.map(a => (a.namespace ? `${a.namespace}:${a.tag}` : a.tag)).join(n);
        return ((this._pathStringCache = o), o);
      }
      return this.path.map(o => (r && o.namespace ? `${o.namespace}:${o.tag}` : o.tag)).join(n);
    }
    toArray() {
      return this.path.map(t => t.tag);
    }
    reset() {
      ((this._pathStringCache = null), (this.path = []), (this.siblingStacks = []));
    }
    matches(t) {
      const r = t.segments;
      return r.length === 0
        ? !1
        : t.hasDeepWildcard()
          ? this._matchWithDeepWildcard(r)
          : this._matchSimple(r);
    }
    _matchSimple(t) {
      if (this.path.length !== t.length) return !1;
      for (let r = 0; r < t.length; r++)
        if (!this._matchSegment(t[r], this.path[r], r === this.path.length - 1)) return !1;
      return !0;
    }
    _matchWithDeepWildcard(t) {
      let r = this.path.length - 1,
        n = t.length - 1;
      for (; n >= 0 && r >= 0; ) {
        const i = t[n];
        if (i.type === 'deep-wildcard') {
          if ((n--, n < 0)) return !0;
          const o = t[n];
          let a = !1;
          for (let s = r; s >= 0; s--)
            if (this._matchSegment(o, this.path[s], s === this.path.length - 1)) {
              ((r = s - 1), n--, (a = !0));
              break;
            }
          if (!a) return !1;
        } else {
          if (!this._matchSegment(i, this.path[r], r === this.path.length - 1)) return !1;
          (r--, n--);
        }
      }
      return n < 0;
    }
    _matchSegment(t, r, n) {
      if (
        (t.tag !== '*' && t.tag !== r.tag) ||
        (t.namespace !== void 0 && t.namespace !== '*' && t.namespace !== r.namespace) ||
        (t.attrName !== void 0 &&
          (!n ||
            !r.values ||
            !(t.attrName in r.values) ||
            (t.attrValue !== void 0 && String(r.values[t.attrName]) !== String(t.attrValue))))
      )
        return !1;
      if (t.position !== void 0) {
        if (!n) return !1;
        const i = r.counter ?? 0;
        if (t.position === 'first' && i !== 0) return !1;
        if (t.position === 'odd' && i % 2 !== 1) return !1;
        if (t.position === 'even' && i % 2 !== 0) return !1;
        if (t.position === 'nth' && i !== t.positionValue) return !1;
      }
      return !0;
    }
    matchesAny(t) {
      return t.matchesAny(this);
    }
    snapshot() {
      return {
        path: this.path.map(t => ({ ...t })),
        siblingStacks: this.siblingStacks.map(t => new Map(t)),
      };
    }
    restore(t) {
      ((this._pathStringCache = null),
        (this.path = t.path.map(r => ({ ...r }))),
        (this.siblingStacks = t.siblingStacks.map(r => new Map(r))));
    }
    readOnly() {
      return this._view;
    }
  }
  function ed(e, t) {
    if (!e) return {};
    const r = t.attributesGroupName ? e[t.attributesGroupName] : e;
    if (!r) return {};
    const n = {};
    for (const i in r)
      if (i.startsWith(t.attributeNamePrefix)) {
        const o = i.substring(t.attributeNamePrefix.length);
        n[o] = r[i];
      } else n[i] = r[i];
    return n;
  }
  function td(e) {
    if (!e || typeof e != 'string') return;
    const t = e.indexOf(':');
    if (t !== -1 && t > 0) {
      const r = e.substring(0, t);
      if (r !== 'xmlns') return r;
    }
  }
  class rd {
    constructor(t, r) {
      ((this.options = t),
        (this.currentNode = null),
        (this.tagsNodeStack = []),
        (this.parseXml = ad),
        (this.parseTextData = nd),
        (this.resolveNameSpace = id),
        (this.buildAttributesMap = sd),
        (this.isItStopNode = dd),
        (this.replaceEntitiesValue = ld),
        (this.readStopNodeData = pd),
        (this.saveTextToParentTag = ud),
        (this.addChild = cd),
        (this.ignoreAttributesFn = Yu(this.options.ignoreAttributes)),
        (this.entityExpansionCount = 0),
        (this.currentExpandedLength = 0));
      let n = { ...As };
      (this.options.entityDecoder
        ? (this.entityDecoder = this.options.entityDecoder)
        : (typeof this.options.htmlEntities == 'object'
            ? (n = this.options.htmlEntities)
            : this.options.htmlEntities === !0 && (n = { ...Au, ...Vu }),
          (this.entityDecoder = new Ru({
            namedEntities: { ...n, ...r },
            numericAllowed: this.options.htmlEntities,
            limit: {
              maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
              maxExpandedLength: this.options.processEntities.maxExpandedLength,
              applyLimitsTo: this.options.processEntities.appliesTo,
            },
          }))),
        (this.matcher = new Qu()),
        (this.readonlyMatcher = this.matcher.readOnly()),
        (this.isCurrentNodeStopNode = !1),
        (this.stopNodeExpressionsSet = new Ju()));
      const i = this.options.stopNodes;
      if (i && i.length > 0) {
        for (let o = 0; o < i.length; o++) {
          const a = i[o];
          typeof a == 'string'
            ? this.stopNodeExpressionsSet.add(new Ls(a))
            : a instanceof Ls && this.stopNodeExpressionsSet.add(a);
        }
        this.stopNodeExpressionsSet.seal();
      }
    }
  }
  function nd(e, t, r, n, i, o, a) {
    const s = this.options;
    if (e !== void 0 && (s.trimValues && !n && (e = e.trim()), e.length > 0)) {
      a || (e = this.replaceEntitiesValue(e, t, r));
      const c = s.jPath ? r.toString() : r,
        f = s.tagValueProcessor(t, e, c, i, o);
      return f == null
        ? e
        : typeof f != typeof e || f !== e
          ? f
          : s.trimValues || e.trim() === e
            ? ai(e, s.parseTagValue, s.numberParseOptions)
            : e;
    }
  }
  function id(e) {
    if (this.options.removeNSPrefix) {
      const t = e.split(':'),
        r = e.charAt(0) === '/' ? '/' : '';
      if (t[0] === 'xmlns') return '';
      t.length === 2 && (e = r + t[1]);
    }
    return e;
  }
  const od = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, 'gm');
  function sd(e, t, r, n = !1) {
    const i = this.options;
    if (n === !0 || (i.ignoreAttributes !== !0 && typeof e == 'string')) {
      const o = Ss(e, od),
        a = o.length,
        s = {},
        c = new Array(a);
      let f = !1;
      const l = {};
      for (let m = 0; m < a; m++) {
        const C = this.resolveNameSpace(o[m][1]),
          N = o[m][4];
        if (C.length && N !== void 0) {
          let L = N;
          (i.trimValues && (L = L.trim()),
            (L = this.replaceEntitiesValue(L, r, this.readonlyMatcher)),
            (c[m] = L),
            (l[C] = L),
            (f = !0));
        }
      }
      f && typeof t == 'object' && t.updateCurrent && t.updateCurrent(l);
      const u = i.jPath ? t.toString() : this.readonlyMatcher;
      let p = !1;
      for (let m = 0; m < a; m++) {
        const C = this.resolveNameSpace(o[m][1]);
        if (this.ignoreAttributesFn(C, u)) continue;
        let N = i.attributeNamePrefix + C;
        if (C.length)
          if (
            (i.transformAttributeName && (N = i.transformAttributeName(N)),
            (N = Rs(N, i)),
            o[m][4] !== void 0)
          ) {
            const L = c[m],
              $ = i.attributeValueProcessor(C, L, u);
            ($ == null
              ? (s[N] = L)
              : typeof $ != typeof L || $ !== L
                ? (s[N] = $)
                : (s[N] = ai(L, i.parseAttributeValue, i.numberParseOptions)),
              (p = !0));
          } else i.allowBooleanAttributes && ((s[N] = !0), (p = !0));
      }
      if (!p) return;
      if (i.attributesGroupName && !i.preserveOrder) {
        const m = {};
        return ((m[i.attributesGroupName] = s), m);
      }
      return s;
    }
  }
  const ad = function (e) {
    e = e.replace(
      /\r\n?/g,
      `
`
    );
    const t = new at('!xml');
    let r = t,
      n = '';
    (this.matcher.reset(),
      this.entityDecoder.reset(),
      (this.entityExpansionCount = 0),
      (this.currentExpandedLength = 0));
    const i = this.options,
      o = new ju(i.processEntities),
      a = e.length;
    for (let s = 0; s < a; s++)
      if (e[s] === '<') {
        const f = e.charCodeAt(s + 1);
        if (f === 47) {
          const l = Lt(e, '>', s, 'Closing Tag is not closed.');
          let u = e.substring(s + 2, l).trim();
          if (i.removeNSPrefix) {
            const m = u.indexOf(':');
            m !== -1 && (u = u.substr(m + 1));
          }
          ((u = ci(i.transformTagName, u, '', i).tagName),
            r && (n = this.saveTextToParentTag(n, r, this.readonlyMatcher)));
          const p = this.matcher.getCurrentTag();
          if (u && i.unpairedTagsSet.has(u))
            throw new Error(`Unpaired tag can not be used as closing tag: </${u}>`);
          (p && i.unpairedTagsSet.has(p) && (this.matcher.pop(), this.tagsNodeStack.pop()),
            this.matcher.pop(),
            (this.isCurrentNodeStopNode = !1),
            (r = this.tagsNodeStack.pop()),
            (n = ''),
            (s = l));
        } else if (f === 63) {
          let l = si(e, s, !1, '?>');
          if (!l) throw new Error('Pi Tag is not closed.');
          n = this.saveTextToParentTag(n, r, this.readonlyMatcher);
          const u = this.buildAttributesMap(l.tagExp, this.matcher, l.tagName, !0);
          if (u) {
            const p = u[this.options.attributeNamePrefix + 'version'];
            this.entityDecoder.setXmlVersion(Number(p) || 1);
          }
          if (!((i.ignoreDeclaration && l.tagName === '?xml') || i.ignorePiTags)) {
            const p = new at(l.tagName);
            (p.add(i.textNodeName, ''),
              l.tagName !== l.tagExp &&
                l.attrExpPresent &&
                i.ignoreAttributes !== !0 &&
                (p[':@'] = u),
              this.addChild(r, p, this.readonlyMatcher, s));
          }
          s = l.closeIndex + 1;
        } else if (f === 33 && e.charCodeAt(s + 2) === 45 && e.charCodeAt(s + 3) === 45) {
          const l = Lt(e, '-->', s + 4, 'Comment is not closed.');
          if (i.commentPropName) {
            const u = e.substring(s + 4, l - 2);
            ((n = this.saveTextToParentTag(n, r, this.readonlyMatcher)),
              r.add(i.commentPropName, [{ [i.textNodeName]: u }]));
          }
          s = l;
        } else if (f === 33 && e.charCodeAt(s + 2) === 68) {
          const l = o.readDocType(e, s);
          (this.entityDecoder.addInputEntities(l.entities), (s = l.i));
        } else if (f === 33 && e.charCodeAt(s + 2) === 91) {
          const l = Lt(e, ']]>', s, 'CDATA is not closed.') - 2,
            u = e.substring(s + 9, l);
          n = this.saveTextToParentTag(n, r, this.readonlyMatcher);
          let p = this.parseTextData(u, r.tagname, this.readonlyMatcher, !0, !1, !0, !0);
          (p == null && (p = ''),
            i.cdataPropName
              ? r.add(i.cdataPropName, [{ [i.textNodeName]: u }])
              : r.add(i.textNodeName, p),
            (s = l + 2));
        } else {
          let l = si(e, s, i.removeNSPrefix);
          if (!l) {
            const k = e.substring(Math.max(0, s - 50), Math.min(a, s + 50));
            throw new Error(`readTagExp returned undefined at position ${s}. Context: "${k}"`);
          }
          let u = l.tagName;
          const p = l.rawTagName;
          let m = l.tagExp,
            C = l.attrExpPresent,
            N = l.closeIndex;
          if (
            (({ tagName: u, tagExp: m } = ci(i.transformTagName, u, m, i)),
            i.strictReservedNames &&
              (u === i.commentPropName ||
                u === i.cdataPropName ||
                u === i.textNodeName ||
                u === i.attributesGroupName))
          )
            throw new Error(`Invalid tag name: ${u}`);
          r &&
            n &&
            r.tagname !== '!xml' &&
            (n = this.saveTextToParentTag(n, r, this.readonlyMatcher, !1));
          const L = r;
          L &&
            i.unpairedTagsSet.has(L.tagname) &&
            ((r = this.tagsNodeStack.pop()), this.matcher.pop());
          let $ = !1;
          m.length > 0 &&
            m.lastIndexOf('/') === m.length - 1 &&
            (($ = !0),
            u[u.length - 1] === '/'
              ? ((u = u.substr(0, u.length - 1)), (m = u))
              : (m = m.substr(0, m.length - 1)),
            (C = u !== m));
          let P = null,
            D;
          ((D = td(p)),
            u !== t.tagname && this.matcher.push(u, {}, D),
            u !== m && C && ((P = this.buildAttributesMap(m, this.matcher, u)), P && ed(P, i)),
            u !== t.tagname && (this.isCurrentNodeStopNode = this.isItStopNode()));
          const Z = s;
          if (this.isCurrentNodeStopNode) {
            let k = '';
            if ($) s = l.closeIndex;
            else if (i.unpairedTagsSet.has(u)) s = l.closeIndex;
            else {
              const ie = this.readStopNodeData(e, p, N + 1);
              if (!ie) throw new Error(`Unexpected end of ${p}`);
              ((s = ie.i), (k = ie.tagContent));
            }
            const z = new at(u);
            (P && (z[':@'] = P),
              z.add(i.textNodeName, k),
              this.matcher.pop(),
              (this.isCurrentNodeStopNode = !1),
              this.addChild(r, z, this.readonlyMatcher, Z));
          } else {
            if ($) {
              ({ tagName: u, tagExp: m } = ci(i.transformTagName, u, m, i));
              const k = new at(u);
              (P && (k[':@'] = P),
                this.addChild(r, k, this.readonlyMatcher, Z),
                this.matcher.pop(),
                (this.isCurrentNodeStopNode = !1));
            } else if (i.unpairedTagsSet.has(u)) {
              const k = new at(u);
              (P && (k[':@'] = P),
                this.addChild(r, k, this.readonlyMatcher, Z),
                this.matcher.pop(),
                (this.isCurrentNodeStopNode = !1),
                (s = l.closeIndex));
              continue;
            } else {
              const k = new at(u);
              if (this.tagsNodeStack.length > i.maxNestedTags)
                throw new Error('Maximum nested tags exceeded');
              (this.tagsNodeStack.push(r),
                P && (k[':@'] = P),
                this.addChild(r, k, this.readonlyMatcher, Z),
                (r = k));
            }
            ((n = ''), (s = N));
          }
        }
      } else n += e[s];
    return t.child;
  };
  function cd(e, t, r, n) {
    this.options.captureMetaData || (n = void 0);
    const i = this.options.jPath ? r.toString() : r,
      o = this.options.updateTag(t.tagname, i, t[':@']);
    o === !1 || (typeof o == 'string' && (t.tagname = o), e.addChild(t, n));
  }
  function ld(e, t, r) {
    const n = this.options.processEntities;
    if (!n || !n.enabled) return e;
    if (n.allowedTags) {
      const i = this.options.jPath ? r.toString() : r;
      if (!(Array.isArray(n.allowedTags) ? n.allowedTags.includes(t) : n.allowedTags(t, i)))
        return e;
    }
    if (n.tagFilter) {
      const i = this.options.jPath ? r.toString() : r;
      if (!n.tagFilter(t, i)) return e;
    }
    return this.entityDecoder.decode(e);
  }
  function ud(e, t, r, n) {
    return (
      e &&
        (n === void 0 && (n = t.child.length === 0),
        (e = this.parseTextData(
          e,
          t.tagname,
          r,
          !1,
          t[':@'] ? Object.keys(t[':@']).length !== 0 : !1,
          n
        )),
        e !== void 0 && e !== '' && t.add(this.options.textNodeName, e),
        (e = '')),
      e
    );
  }
  function dd() {
    return this.stopNodeExpressionsSet.size === 0
      ? !1
      : this.matcher.matchesAny(this.stopNodeExpressionsSet);
  }
  function fd(e, t, r = '>') {
    let n = 0;
    const i = e.length,
      o = r.charCodeAt(0),
      a = r.length > 1 ? r.charCodeAt(1) : -1;
    let s = '',
      c = t;
    for (let f = t; f < i; f++) {
      const l = e.charCodeAt(f);
      if (n) l === n && (n = 0);
      else if (l === 34 || l === 39) n = l;
      else if (l === o)
        if (a !== -1) {
          if (e.charCodeAt(f + 1) === a) return ((s += e.substring(c, f)), { data: s, index: f });
        } else return ((s += e.substring(c, f)), { data: s, index: f });
      else l === 9 && !n && ((s += e.substring(c, f) + ' '), (c = f + 1));
    }
  }
  function Lt(e, t, r, n) {
    const i = e.indexOf(t, r);
    if (i === -1) throw new Error(n);
    return i + t.length - 1;
  }
  function hd(e, t, r, n) {
    const i = e.indexOf(t, r);
    if (i === -1) throw new Error(n);
    return i;
  }
  function si(e, t, r, n = '>') {
    const i = fd(e, t + 1, n);
    if (!i) return;
    let o = i.data;
    const a = i.index,
      s = o.search(/\s/);
    let c = o,
      f = !0;
    s !== -1 && ((c = o.substring(0, s)), (o = o.substring(s + 1).trimStart()));
    const l = c;
    if (r) {
      const u = c.indexOf(':');
      u !== -1 && ((c = c.substr(u + 1)), (f = c !== i.data.substr(u + 1)));
    }
    return { tagName: c, tagExp: o, closeIndex: a, attrExpPresent: f, rawTagName: l };
  }
  function pd(e, t, r) {
    const n = r;
    let i = 1;
    const o = e.length;
    for (; r < o; r++)
      if (e[r] === '<') {
        const a = e.charCodeAt(r + 1);
        if (a === 47) {
          const s = hd(e, '>', r, `${t} is not closed`);
          if (e.substring(r + 2, s).trim() === t && (i--, i === 0))
            return { tagContent: e.substring(n, r), i: s };
          r = s;
        } else if (a === 63) r = Lt(e, '?>', r + 1, 'StopNode is not closed.');
        else if (a === 33 && e.charCodeAt(r + 2) === 45 && e.charCodeAt(r + 3) === 45)
          r = Lt(e, '-->', r + 3, 'StopNode is not closed.');
        else if (a === 33 && e.charCodeAt(r + 2) === 91)
          r = Lt(e, ']]>', r, 'StopNode is not closed.') - 2;
        else {
          const s = si(e, r, '>');
          s &&
            ((s && s.tagName) === t && s.tagExp[s.tagExp.length - 1] !== '/' && i++,
            (r = s.closeIndex));
        }
      }
  }
  function ai(e, t, r) {
    if (t && typeof e == 'string') {
      const n = e.trim();
      return n === 'true' ? !0 : n === 'false' ? !1 : Bu(e, r);
    } else return _u(e) ? e : '';
  }
  function ci(e, t, r, n) {
    if (e) {
      const i = e(t);
      (r === t && (r = i), (t = i));
    }
    return ((t = Rs(t, n)), { tagName: t, tagExp: r });
  }
  function Rs(e, t) {
    if (Os.includes(e))
      throw new Error(
        `[SECURITY] Invalid name: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`
      );
    return ni.includes(e) ? t.onDangerousProperty(e) : e;
  }
  const li = at.getMetaDataSymbol();
  function gd(e, t) {
    if (!e || typeof e != 'object') return {};
    if (!t) return e;
    const r = {};
    for (const n in e)
      if (n.startsWith(t)) {
        const i = n.substring(t.length);
        r[i] = e[n];
      } else r[n] = e[n];
    return r;
  }
  function md(e, t, r, n) {
    return $s(e, t, r, n);
  }
  function $s(e, t, r, n) {
    let i;
    const o = {};
    for (let a = 0; a < e.length; a++) {
      const s = e[a],
        c = vd(s);
      if (c !== void 0 && c !== t.textNodeName) {
        const f = gd(s[':@'] || {}, t.attributeNamePrefix);
        r.push(c, f);
      }
      if (c === t.textNodeName) i === void 0 ? (i = s[c]) : (i += '' + s[c]);
      else {
        if (c === void 0) continue;
        if (s[c]) {
          let f = $s(s[c], t, r, n);
          const l = _d(f, t);
          if (
            (s[':@']
              ? bd(f, s[':@'], n, t)
              : Object.keys(f).length === 1 &&
                  f[t.textNodeName] !== void 0 &&
                  !t.alwaysCreateTextNode
                ? (f = f[t.textNodeName])
                : Object.keys(f).length === 0 &&
                  (t.alwaysCreateTextNode ? (f[t.textNodeName] = '') : (f = '')),
            s[li] !== void 0 && typeof f == 'object' && f !== null && (f[li] = s[li]),
            o[c] !== void 0 && Object.prototype.hasOwnProperty.call(o, c))
          )
            (Array.isArray(o[c]) || (o[c] = [o[c]]), o[c].push(f));
          else {
            const u = t.jPath ? n.toString() : n;
            t.isArray(c, u, l) ? (o[c] = [f]) : (o[c] = f);
          }
          c !== void 0 && c !== t.textNodeName && r.pop();
        }
      }
    }
    return (
      typeof i == 'string'
        ? i.length > 0 && (o[t.textNodeName] = i)
        : i !== void 0 && (o[t.textNodeName] = i),
      o
    );
  }
  function vd(e) {
    const t = Object.keys(e);
    for (let r = 0; r < t.length; r++) {
      const n = t[r];
      if (n !== ':@') return n;
    }
  }
  function bd(e, t, r, n) {
    if (t) {
      const i = Object.keys(t),
        o = i.length;
      for (let a = 0; a < o; a++) {
        const s = i[a],
          c = s.startsWith(n.attributeNamePrefix) ? s.substring(n.attributeNamePrefix.length) : s,
          f = n.jPath ? r.toString() + '.' + c : r;
        n.isArray(s, f, !0, !0) ? (e[s] = [t[s]]) : (e[s] = t[s]);
      }
    }
  }
  function _d(e, t) {
    const { textNodeName: r } = t,
      n = Object.keys(e).length;
    return !!(n === 0 || (n === 1 && (e[r] || typeof e[r] == 'boolean' || e[r] === 0)));
  }
  class yd {
    constructor(t) {
      ((this.externalEntities = {}), (this.options = Fu(t)));
    }
    parse(t, r) {
      if (typeof t != 'string' && t.toString) t = t.toString();
      else if (typeof t != 'string')
        throw new Error('XML data is accepted in String or Bytes[] form.');
      if (r) {
        r === !0 && (r = {});
        const o = wu(t, r);
        if (o !== !0) throw Error(`${o.err.msg}:${o.err.line}:${o.err.col}`);
      }
      const n = new rd(this.options, this.externalEntities),
        i = n.parseXml(t);
      return this.options.preserveOrder || i === void 0
        ? i
        : md(i, this.options, n.matcher, n.readonlyMatcher);
    }
    addEntity(t, r) {
      if (r.indexOf('&') !== -1) throw new Error("Entity value can't have '&'");
      if (t.indexOf('&') !== -1 || t.indexOf(';') !== -1)
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      if (r === '&') throw new Error("An entity with value '&' is not permitted");
      this.externalEntities[t] = r;
    }
    static getMetaDataSymbol() {
      return at.getMetaDataSymbol();
    }
  }
  const wd = e => {
      const r = new yd({
        ignoreAttributes: !1,
        attributeNamePrefix: 'attr_',
        removeNSPrefix: !0,
      }).parse(e);
      return ne(
        r.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan,
        ri
      );
    },
    Ed = ['width', 'height'],
    Nd = ['transform'],
    xd = ['transform', 'onClick'],
    Sd = ['transform'],
    Od = ['width', 'height'],
    Cd = ['x', 'width', 'height'],
    kd = ['transform'],
    Td = ['x', 'y', 'font-size'],
    Vd = ['transform', 'onClick'],
    Ad = ['width', 'height'],
    Ds = jl(
      ((e, t) => {
        const r = e.__vccOpts || e;
        for (const [n, i] of t) r[n] = i;
        return r;
      })(
        io({
          __name: 'DeckRendering',
          props: {
            deck: { type: Object, required: !0 },
            scale: { type: Number, required: !0 },
            availability: { type: Object },
            vertical: { type: Boolean, default: !1 },
          },
          emits: ['select'],
          setup(e, { emit: t }) {
            const r = e,
              n = Xt(new Map()),
              i = Xt(new Map()),
              o = t,
              a = Jr(
                () =>
                  r.deck.deckspaces
                    ?.flatMap(l =>
                      l instanceof ur ? l.passengerSpots?.filter(u => u instanceof Es) || [] : []
                    )
                    .map(
                      l => (
                        (l.availability =
                          r.availability && l.attr_id
                            ? ti[r.availability[l.attr_id] ?? 'Undefined']
                            : ti.Undefined),
                        l
                      )
                    ) || []
              ),
              s = Jr(
                () =>
                  r.deck.deckspaces?.flatMap(l =>
                    l instanceof ur ? (l.deckEntrances ?? []) : []
                  ) ?? []
              ),
              c = Jr(() => {
                const { width: l, height: u } = r.deck.getBoundingBox();
                return { width: l * r.scale + 10, height: u * r.scale + 10 };
              });
            function f(l, u) {
              o('select', { element: u, ctrlKey: l.ctrlKey || l.metaKey });
            }
            return (l, u) => (
              nr(),
              or(
                'svg',
                {
                  width: e.vertical ? c.value.height : c.value.width,
                  height: e.vertical ? c.value.width : c.value.height,
                  class: 'vehicle-frame',
                  style: { 'user-select': 'none' },
                },
                [
                  je(
                    'g',
                    {
                      transform: `rotate(
        ${e.vertical ? 90 : 0},
        ${c.value.height / 2},
        ${c.value.height / 2}
      )`,
                    },
                    [
                      je(
                        'rect',
                        qo(
                          { ...e.deck.getShape(e.scale), y: 5 },
                          {
                            onClick: u[0] || (u[0] = Qn(p => f(p, e.deck), ['stop'])),
                            class: 'vehicle-deck',
                          }
                        ),
                        null,
                        16
                      ),
                      (nr(!0),
                      or(
                        xe,
                        null,
                        uo(
                          a.value,
                          (p, m) => (
                            nr(),
                            or(
                              'g',
                              {
                                key: `seat-${m}`,
                                transform: `translate(${n.get(p)?.x ?? p.getShape(e.scale).x},
                              ${n.get(p)?.y ?? p.getShape(e.scale).y})`,
                                onClick: Qn(C => f(C, p), ['stop']),
                                class: xt(`seat ${p.getClasses()}`),
                              },
                              [
                                je(
                                  'g',
                                  {
                                    class: 'seat__container',
                                    transform: `rotate(  ${p.Orientation === 'forwards' ? 180 : 0},  ${p.getShape(e.scale).width / 2}, ${p.getShape(e.scale).height / 2})`,
                                  },
                                  [
                                    je(
                                      'rect',
                                      {
                                        width: p.getShape(e.scale).width,
                                        height: p.getShape(e.scale).height,
                                        class: xt('seat__base'),
                                      },
                                      null,
                                      8,
                                      Od
                                    ),
                                    je(
                                      'rect',
                                      {
                                        x: p.getShape(e.scale).width * 0.9,
                                        y: '0',
                                        width: p.getShape(e.scale).width * 0.2,
                                        height: p.getShape(e.scale).height,
                                        rx: '6',
                                        ry: '6',
                                        class: xt(['seat__backrest', 'seat__backrest']),
                                        'pointer-events': 'none',
                                      },
                                      null,
                                      8,
                                      Cd
                                    ),
                                  ],
                                  8,
                                  Sd
                                ),
                                je(
                                  'g',
                                  {
                                    class: 'seat__text-container',
                                    transform: `rotate(
            ${e.vertical ? -90 : 0},
            ${p.getShape(e.scale).width / 2},
            ${p.getShape(e.scale).height / 2}
          )`,
                                  },
                                  [
                                    je(
                                      'text',
                                      {
                                        x: p.getShape(e.scale).width / 2,
                                        y: p.getShape(e.scale).height / 2,
                                        'text-anchor': 'middle',
                                        'dominant-baseline': 'middle',
                                        class: 'seat__text',
                                        'font-size': Math.max(
                                          Math.min(
                                            p.getShape(e.scale).width,
                                            p.getShape(e.scale).height
                                          ) / 3,
                                          10
                                        ),
                                        'pointer-events': 'none',
                                      },
                                      yi(p.Label),
                                      9,
                                      Td
                                    ),
                                  ],
                                  8,
                                  kd
                                ),
                              ],
                              10,
                              xd
                            )
                          )
                        ),
                        128
                      )),
                      (nr(!0),
                      or(
                        xe,
                        null,
                        uo(
                          s.value,
                          (p, m) => (
                            nr(),
                            or(
                              'g',
                              {
                                key: `entrance-${m}`,
                                transform: `translate(${i.get(p)?.x ?? p.getShape(e.scale, e.deck.Length, e.deck.Width).x},
                              ${i.get(p)?.y ?? p.getShape(e.scale, e.deck.Length, e.deck.Width).y})`,
                                onClick: Qn(C => f(C, p), ['stop']),
                              },
                              [
                                je(
                                  'rect',
                                  {
                                    width: p.getShape(e.scale, e.deck.Length, e.deck.Width).width,
                                    height: p.getShape(e.scale, e.deck.Length, e.deck.Width).height,
                                    class: 'door',
                                  },
                                  null,
                                  8,
                                  Ad
                                ),
                              ],
                              8,
                              Vd
                            )
                          )
                        ),
                        128
                      )),
                    ],
                    8,
                    Nd
                  ),
                ],
                8,
                Ed
              )
            );
          },
        }),
        [
          [
            'styles',
            [
              '.vehicle-frame{background-color:#f0f0f0;border:1px solid #ccc}.vehicle-deck{fill:#fff;stroke:#68a691;rx:5px;stroke-width:2px}.seat .seat__base{fill:#4caf50}.seat-occupied .seat__base{fill:#f44336}.seat-selected .seat__base,.seat-filtered .seat__base{fill:#ff9800}.seat-undefined .seat__base{fill:#9e9e9e}.seat .seat__base{fill:#d9d9d9;stroke:#7c7c7c;stroke-width:1px;cursor:pointer;rx:5px}.seat .seat__backrest{fill:#7c7c7c}.seat__text{stroke:#7c7c7c;pointer-events:none}.door{fill:#dedede;stroke:#dedede;stroke-width:1px;cursor:pointer}',
            ],
          ],
        ]
      ),
      { shadowRoot: !0, styles: [Jl] }
    );
  return (
    typeof customElements < 'u' &&
      (customElements.get('deck-rendering') || customElements.define('deck-rendering', Ds)),
    { DeckRenderingElement: Ds, parseNeTEx: wd }
  );
});
