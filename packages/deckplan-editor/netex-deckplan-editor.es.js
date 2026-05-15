// @__NO_SIDE_EFFECTS__
function Je(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(',')) t[r] = 1;
  return r => r in t;
}
const q = process.env.NODE_ENV !== 'production' ? Object.freeze({}) : {},
  kt = process.env.NODE_ENV !== 'production' ? Object.freeze([]) : [],
  re = () => {},
  po = () => !1,
  dr = e =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 && // uppercase letter
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  Ir = e => e.startsWith('onUpdate:'),
  G = Object.assign,
  Bn = (e, t) => {
    const r = e.indexOf(t);
    r > -1 && e.splice(r, 1);
  },
  Xs = Object.prototype.hasOwnProperty,
  j = (e, t) => Xs.call(e, t),
  V = Array.isArray,
  vt = e => Xr(e) === '[object Map]',
  go = e => Xr(e) === '[object Set]',
  I = e => typeof e == 'function',
  Y = e => typeof e == 'string',
  ut = e => typeof e == 'symbol',
  X = e => e !== null && typeof e == 'object',
  qn = e => (X(e) || I(e)) && I(e.then) && I(e.catch),
  mo = Object.prototype.toString,
  Xr = e => mo.call(e),
  Xn = e => Xr(e).slice(8, -1),
  zr = e => Xr(e) === '[object Object]',
  zn = e => Y(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
  Jt = /* @__PURE__ */ Je(
    // the leading comma is intentional so empty string "" is also included
    ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
  ),
  zs = /* @__PURE__ */ Je(
    'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo'
  ),
  Kr = e => {
    const t = /* @__PURE__ */ Object.create(null);
    return r => t[r] || (t[r] = e(r));
  },
  Ks = /-\w/g,
  ve = Kr(e => e.replace(Ks, t => t.slice(1).toUpperCase())),
  Gs = /\B([A-Z])/g,
  ye = Kr(e => e.replace(Gs, '-$1').toLowerCase()),
  Gr = Kr(e => e.charAt(0).toUpperCase() + e.slice(1)),
  pt = Kr(e => (e ? `on${Gr(e)}` : '')),
  bt = (e, t) => !Object.is(e, t),
  Ut = (e, ...t) => {
    for (let r = 0; r < e.length; r++) e[r](...t);
  },
  Pr = (e, t, r, n = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: n,
      value: r,
    });
  },
  Ys = e => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  },
  bi = e => {
    const t = Y(e) ? Number(e) : NaN;
    return isNaN(t) ? e : t;
  };
let _i;
const fr = () =>
  _i ||
  (_i =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {});
function Kn(e) {
  if (V(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r],
        i = Y(n) ? ea(n) : Kn(n);
      if (i) for (const o in i) t[o] = i[o];
    }
    return t;
  } else if (Y(e) || X(e)) return e;
}
const Js = /;(?![^(]*\))/g,
  Zs = /:([^]+)/,
  Qs = /\/\*[^]*?\*\//g;
function ea(e) {
  const t = {};
  return (
    e
      .replace(Qs, '')
      .split(Js)
      .forEach(r => {
        if (r) {
          const n = r.split(Zs);
          n.length > 1 && (t[n[0].trim()] = n[1].trim());
        }
      }),
    t
  );
}
function Tt(e) {
  let t = '';
  if (Y(e)) t = e;
  else if (V(e))
    for (let r = 0; r < e.length; r++) {
      const n = Tt(e[r]);
      n && (t += n + ' ');
    }
  else if (X(e)) for (const r in e) e[r] && (t += r + ' ');
  return t.trim();
}
const ta =
    'html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot',
  ra =
    'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view',
  na =
    'annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics',
  ia = /* @__PURE__ */ Je(ta),
  oa = /* @__PURE__ */ Je(ra),
  sa = /* @__PURE__ */ Je(na),
  aa = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
  ca = /* @__PURE__ */ Je(aa);
function vo(e) {
  return !!e || e === '';
}
const bo = e => !!(e && e.__v_isRef === !0),
  _o = e =>
    Y(e)
      ? e
      : e == null
        ? ''
        : V(e) || (X(e) && (e.toString === mo || !I(e.toString)))
          ? bo(e)
            ? _o(e.value)
            : JSON.stringify(e, yo, 2)
          : String(e),
  yo = (e, t) =>
    bo(t)
      ? yo(e, t.value)
      : vt(t)
        ? {
            [`Map(${t.size})`]: [...t.entries()].reduce(
              (r, [n, i], o) => ((r[ln(n, o) + ' =>'] = i), r),
              {}
            ),
          }
        : go(t)
          ? {
              [`Set(${t.size})`]: [...t.values()].map(r => ln(r)),
            }
          : ut(t)
            ? ln(t)
            : X(t) && !V(t) && !zr(t)
              ? String(t)
              : t,
  ln = (e, t = '') => {
    var r;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      ut(e) ? `Symbol(${(r = e.description) != null ? r : t})` : e
    );
  };
function Ve(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let ge;
class la {
  constructor(t = !1) {
    ((this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = ge),
      !t && ge && (this.index = (ge.scopes || (ge.scopes = [])).push(this) - 1));
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
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
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
      const r = ge;
      try {
        return ((ge = this), t());
      } finally {
        ge = r;
      }
    } else process.env.NODE_ENV !== 'production' && Ve('cannot run an inactive effect scope.');
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && ((this.prevScope = ge), (ge = this));
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && ((ge = this.prevScope), (this.prevScope = void 0));
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let r, n;
      for (r = 0, n = this.effects.length; r < n; r++) this.effects[r].stop();
      for (this.effects.length = 0, r = 0, n = this.cleanups.length; r < n; r++) this.cleanups[r]();
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
function ua() {
  return ge;
}
let W;
const un = /* @__PURE__ */ new WeakSet();
class wo {
  constructor(t) {
    ((this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      ge && ge.active && ge.effects.push(this));
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && ((this.flags &= -65), un.has(this) && (un.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || No(this);
  }
  run() {
    if (!(this.flags & 1)) return this.fn();
    ((this.flags |= 2), yi(this), xo(this));
    const t = W,
      r = ke;
    ((W = this), (ke = !0));
    try {
      return this.fn();
    } finally {
      (process.env.NODE_ENV !== 'production' &&
        W !== this &&
        Ve('Active effect was not restored correctly - this is likely a Vue internal bug.'),
        So(this),
        (W = t),
        (ke = r),
        (this.flags &= -3));
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) Jn(t);
      ((this.deps = this.depsTail = void 0),
        yi(this),
        this.onStop && this.onStop(),
        (this.flags &= -2));
    }
  }
  trigger() {
    this.flags & 64 ? un.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Sn(this) && this.run();
  }
  get dirty() {
    return Sn(this);
  }
}
let Eo = 0,
  Zt,
  Qt;
function No(e, t = !1) {
  if (((e.flags |= 8), t)) {
    ((e.next = Qt), (Qt = e));
    return;
  }
  ((e.next = Zt), (Zt = e));
}
function Gn() {
  Eo++;
}
function Yn() {
  if (--Eo > 0) return;
  if (Qt) {
    let t = Qt;
    for (Qt = void 0; t; ) {
      const r = t.next;
      ((t.next = void 0), (t.flags &= -9), (t = r));
    }
  }
  let e;
  for (; Zt; ) {
    let t = Zt;
    for (Zt = void 0; t; ) {
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
function xo(e) {
  for (let t = e.deps; t; t = t.nextDep)
    ((t.version = -1), (t.prevActiveLink = t.dep.activeLink), (t.dep.activeLink = t));
}
function So(e) {
  let t,
    r = e.depsTail,
    n = r;
  for (; n; ) {
    const i = n.prevDep;
    (n.version === -1 ? (n === r && (r = i), Jn(n), da(n)) : (t = n),
      (n.dep.activeLink = n.prevActiveLink),
      (n.prevActiveLink = void 0),
      (n = i));
  }
  ((e.deps = t), (e.depsTail = r));
}
function Sn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (
      t.dep.version !== t.version ||
      (t.dep.computed && (Oo(t.dep.computed) || t.dep.version !== t.version))
    )
      return !0;
  return !!e._dirty;
}
function Oo(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === ir) ||
    ((e.globalVersion = ir), !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !Sn(e)))
  )
    return;
  e.flags |= 2;
  const t = e.dep,
    r = W,
    n = ke;
  ((W = e), (ke = !0));
  try {
    xo(e);
    const i = e.fn(e._value);
    (t.version === 0 || bt(i, e._value)) && ((e.flags |= 128), (e._value = i), t.version++);
  } catch (i) {
    throw (t.version++, i);
  } finally {
    ((W = r), (ke = n), So(e), (e.flags &= -3));
  }
}
function Jn(e, t = !1) {
  const { dep: r, prevSub: n, nextSub: i } = e;
  if (
    (n && ((n.nextSub = i), (e.prevSub = void 0)),
    i && ((i.prevSub = n), (e.nextSub = void 0)),
    process.env.NODE_ENV !== 'production' && r.subsHead === e && (r.subsHead = i),
    r.subs === e && ((r.subs = n), !n && r.computed))
  ) {
    r.computed.flags &= -5;
    for (let o = r.computed.deps; o; o = o.nextDep) Jn(o, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function da(e) {
  const { prevDep: t, nextDep: r } = e;
  (t && ((t.nextDep = r), (e.prevDep = void 0)), r && ((r.prevDep = t), (e.nextDep = void 0)));
}
let ke = !0;
const Co = [];
function Ae() {
  (Co.push(ke), (ke = !1));
}
function Ie() {
  const e = Co.pop();
  ke = e === void 0 ? !0 : e;
}
function yi(e) {
  const { cleanup: t } = e;
  if (((e.cleanup = void 0), t)) {
    const r = W;
    W = void 0;
    try {
      t();
    } finally {
      W = r;
    }
  }
}
let ir = 0;
class fa {
  constructor(t, r) {
    ((this.sub = t),
      (this.dep = r),
      (this.version = r.version),
      (this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0));
  }
}
class ko {
  // TODO isolatedDeclarations "__v_skip"
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
    if (!W || !ke || W === this.computed) return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== W)
      ((r = this.activeLink = new fa(W, this)),
        W.deps
          ? ((r.prevDep = W.depsTail), (W.depsTail.nextDep = r), (W.depsTail = r))
          : (W.deps = W.depsTail = r),
        To(r));
    else if (r.version === -1 && ((r.version = this.version), r.nextDep)) {
      const n = r.nextDep;
      ((n.prevDep = r.prevDep),
        r.prevDep && (r.prevDep.nextDep = n),
        (r.prevDep = W.depsTail),
        (r.nextDep = void 0),
        (W.depsTail.nextDep = r),
        (W.depsTail = r),
        W.deps === r && (W.deps = n));
    }
    return (
      process.env.NODE_ENV !== 'production' &&
        W.onTrack &&
        W.onTrack(
          G(
            {
              effect: W,
            },
            t
          )
        ),
      r
    );
  }
  trigger(t) {
    (this.version++, ir++, this.notify(t));
  }
  notify(t) {
    Gn();
    try {
      if (process.env.NODE_ENV !== 'production')
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger &&
            !(r.sub.flags & 8) &&
            r.sub.onTrigger(
              G(
                {
                  effect: r.sub,
                },
                t
              )
            );
      for (let r = this.subs; r; r = r.prevSub) r.sub.notify() && r.sub.dep.notify();
    } finally {
      Yn();
    }
  }
}
function To(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep) To(n);
    }
    const r = e.dep.subs;
    (r !== e && ((e.prevSub = r), r && (r.nextSub = e)),
      process.env.NODE_ENV !== 'production' && e.dep.subsHead === void 0 && (e.dep.subsHead = e),
      (e.dep.subs = e));
  }
}
const On = /* @__PURE__ */ new WeakMap(),
  _t = /* @__PURE__ */ Symbol(process.env.NODE_ENV !== 'production' ? 'Object iterate' : ''),
  Cn = /* @__PURE__ */ Symbol(process.env.NODE_ENV !== 'production' ? 'Map keys iterate' : ''),
  or = /* @__PURE__ */ Symbol(process.env.NODE_ENV !== 'production' ? 'Array iterate' : '');
function te(e, t, r) {
  if (ke && W) {
    let n = On.get(e);
    n || On.set(e, (n = /* @__PURE__ */ new Map()));
    let i = n.get(r);
    (i || (n.set(r, (i = new ko())), (i.map = n), (i.key = r)),
      process.env.NODE_ENV !== 'production'
        ? i.track({
            target: e,
            type: t,
            key: r,
          })
        : i.track());
  }
}
function Ue(e, t, r, n, i, o) {
  const a = On.get(e);
  if (!a) {
    ir++;
    return;
  }
  const s = c => {
    c &&
      (process.env.NODE_ENV !== 'production'
        ? c.trigger({
            target: e,
            type: t,
            key: r,
            newValue: n,
            oldValue: i,
            oldTarget: o,
          })
        : c.trigger());
  };
  if ((Gn(), t === 'clear')) a.forEach(s);
  else {
    const c = V(e),
      f = c && zn(r);
    if (c && r === 'length') {
      const l = Number(n);
      a.forEach((u, p) => {
        (p === 'length' || p === or || (!ut(p) && p >= l)) && s(u);
      });
    } else
      switch (((r !== void 0 || a.has(void 0)) && s(a.get(r)), f && s(a.get(or)), t)) {
        case 'add':
          c ? f && s(a.get('length')) : (s(a.get(_t)), vt(e) && s(a.get(Cn)));
          break;
        case 'delete':
          c || (s(a.get(_t)), vt(e) && s(a.get(Cn)));
          break;
        case 'set':
          vt(e) && s(a.get(_t));
          break;
      }
  }
  Yn();
}
function xt(e) {
  const t = $(e);
  return t === e ? t : (te(t, 'iterate', or), be(e) ? t : t.map(Ye));
}
function Yr(e) {
  return (te((e = $(e)), 'iterate', or), e);
}
function rt(e, t) {
  return Be(e) ? (at(e) ? Pt(Ye(t)) : Pt(t)) : Ye(t);
}
const ha = {
  __proto__: null,
  [Symbol.iterator]() {
    return dn(this, Symbol.iterator, e => rt(this, e));
  },
  concat(...e) {
    return xt(this).concat(...e.map(t => (V(t) ? xt(t) : t)));
  },
  entries() {
    return dn(this, 'entries', e => ((e[1] = rt(this, e[1])), e));
  },
  every(e, t) {
    return ze(this, 'every', e, t, void 0, arguments);
  },
  filter(e, t) {
    return ze(this, 'filter', e, t, r => r.map(n => rt(this, n)), arguments);
  },
  find(e, t) {
    return ze(this, 'find', e, t, r => rt(this, r), arguments);
  },
  findIndex(e, t) {
    return ze(this, 'findIndex', e, t, void 0, arguments);
  },
  findLast(e, t) {
    return ze(this, 'findLast', e, t, r => rt(this, r), arguments);
  },
  findLastIndex(e, t) {
    return ze(this, 'findLastIndex', e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return ze(this, 'forEach', e, t, void 0, arguments);
  },
  includes(...e) {
    return fn(this, 'includes', e);
  },
  indexOf(...e) {
    return fn(this, 'indexOf', e);
  },
  join(e) {
    return xt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return fn(this, 'lastIndexOf', e);
  },
  map(e, t) {
    return ze(this, 'map', e, t, void 0, arguments);
  },
  pop() {
    return Ht(this, 'pop');
  },
  push(...e) {
    return Ht(this, 'push', e);
  },
  reduce(e, ...t) {
    return wi(this, 'reduce', e, t);
  },
  reduceRight(e, ...t) {
    return wi(this, 'reduceRight', e, t);
  },
  shift() {
    return Ht(this, 'shift');
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return ze(this, 'some', e, t, void 0, arguments);
  },
  splice(...e) {
    return Ht(this, 'splice', e);
  },
  toReversed() {
    return xt(this).toReversed();
  },
  toSorted(e) {
    return xt(this).toSorted(e);
  },
  toSpliced(...e) {
    return xt(this).toSpliced(...e);
  },
  unshift(...e) {
    return Ht(this, 'unshift', e);
  },
  values() {
    return dn(this, 'values', e => rt(this, e));
  },
};
function dn(e, t, r) {
  const n = Yr(e),
    i = n[t]();
  return (
    n !== e &&
      !be(e) &&
      ((i._next = i.next),
      (i.next = () => {
        const o = i._next();
        return (o.done || (o.value = r(o.value)), o);
      })),
    i
  );
}
const pa = Array.prototype;
function ze(e, t, r, n, i, o) {
  const a = Yr(e),
    s = a !== e && !be(e),
    c = a[t];
  if (c !== pa[t]) {
    const u = c.apply(e, o);
    return s ? Ye(u) : u;
  }
  let f = r;
  a !== e &&
    (s
      ? (f = function (u, p) {
          return r.call(this, rt(e, u), p, e);
        })
      : r.length > 2 &&
        (f = function (u, p) {
          return r.call(this, u, p, e);
        }));
  const l = c.call(a, f, n);
  return s && i ? i(l) : l;
}
function wi(e, t, r, n) {
  const i = Yr(e);
  let o = r;
  return (
    i !== e &&
      (be(e)
        ? r.length > 3 &&
          (o = function (a, s, c) {
            return r.call(this, a, s, c, e);
          })
        : (o = function (a, s, c) {
            return r.call(this, a, rt(e, s), c, e);
          })),
    i[t](o, ...n)
  );
}
function fn(e, t, r) {
  const n = $(e);
  te(n, 'iterate', or);
  const i = n[t](...r);
  return (i === -1 || i === !1) && Mr(r[0]) ? ((r[0] = $(r[0])), n[t](...r)) : i;
}
function Ht(e, t, r = []) {
  (Ae(), Gn());
  const n = $(e)[t].apply(e, r);
  return (Yn(), Ie(), n);
}
const ga = /* @__PURE__ */ Je('__proto__,__v_isRef,__isVue'),
  Vo = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol)
      .filter(e => e !== 'arguments' && e !== 'caller')
      .map(e => Symbol[e])
      .filter(ut)
  );
function ma(e) {
  ut(e) || (e = String(e));
  const t = $(this);
  return (te(t, 'has', e), t.hasOwnProperty(e));
}
class Ao {
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
      return n === (i ? (o ? $o : Ro) : o ? Lo : Mo).get(t) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(t) === Object.getPrototypeOf(n)
        ? t
        : void 0;
    const a = V(t);
    if (!i) {
      let c;
      if (a && (c = ha[r])) return c;
      if (r === 'hasOwnProperty') return ma;
    }
    const s = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      ne(t) ? t : n
    );
    if ((ut(r) ? Vo.has(r) : ga(r)) || (i || te(t, 'get', r), o)) return s;
    if (ne(s)) {
      const c = a && zn(r) ? s : s.value;
      return i && X(c) ? Tn(c) : c;
    }
    return X(s) ? (i ? Tn(s) : sr(s)) : s;
  }
}
class Io extends Ao {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, n, i) {
    let o = t[r];
    const a = V(t) && zn(r);
    if (!this._isShallow) {
      const f = Be(o);
      if ((!be(n) && !Be(n) && ((o = $(o)), (n = $(n))), !a && ne(o) && !ne(n)))
        return f
          ? (process.env.NODE_ENV !== 'production' &&
              Ve(`Set operation on key "${String(r)}" failed: target is readonly.`, t[r]),
            !0)
          : ((o.value = n), !0);
    }
    const s = a ? Number(r) < t.length : j(t, r),
      c = Reflect.set(t, r, n, ne(t) ? t : i);
    return (t === $(i) && (s ? bt(n, o) && Ue(t, 'set', r, n, o) : Ue(t, 'add', r, n)), c);
  }
  deleteProperty(t, r) {
    const n = j(t, r),
      i = t[r],
      o = Reflect.deleteProperty(t, r);
    return (o && n && Ue(t, 'delete', r, void 0, i), o);
  }
  has(t, r) {
    const n = Reflect.has(t, r);
    return ((!ut(r) || !Vo.has(r)) && te(t, 'has', r), n);
  }
  ownKeys(t) {
    return (te(t, 'iterate', V(t) ? 'length' : _t), Reflect.ownKeys(t));
  }
}
class Po extends Ao {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, r) {
    return (
      process.env.NODE_ENV !== 'production' &&
        Ve(`Set operation on key "${String(r)}" failed: target is readonly.`, t),
      !0
    );
  }
  deleteProperty(t, r) {
    return (
      process.env.NODE_ENV !== 'production' &&
        Ve(`Delete operation on key "${String(r)}" failed: target is readonly.`, t),
      !0
    );
  }
}
const va = /* @__PURE__ */ new Io(),
  ba = /* @__PURE__ */ new Po(),
  _a = /* @__PURE__ */ new Io(!0),
  ya = /* @__PURE__ */ new Po(!0),
  kn = e => e,
  yr = e => Reflect.getPrototypeOf(e);
function wa(e, t, r) {
  return function (...n) {
    const i = this.__v_raw,
      o = $(i),
      a = vt(o),
      s = e === 'entries' || (e === Symbol.iterator && a),
      c = e === 'keys' && a,
      f = i[e](...n),
      l = r ? kn : t ? Pt : Ye;
    return (
      !t && te(o, 'iterate', c ? Cn : _t),
      {
        // iterator protocol
        next() {
          const { value: u, done: p } = f.next();
          return p
            ? { value: u, done: p }
            : {
                value: s ? [l(u[0]), l(u[1])] : l(u),
                done: p,
              };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function wr(e) {
  return function (...t) {
    if (process.env.NODE_ENV !== 'production') {
      const r = t[0] ? `on key "${t[0]}" ` : '';
      Ve(`${Gr(e)} operation ${r}failed: target is readonly.`, $(this));
    }
    return e === 'delete' ? !1 : e === 'clear' ? void 0 : this;
  };
}
function Ea(e, t) {
  const r = {
    get(i) {
      const o = this.__v_raw,
        a = $(o),
        s = $(i);
      e || (bt(i, s) && te(a, 'get', i), te(a, 'get', s));
      const { has: c } = yr(a),
        f = t ? kn : e ? Pt : Ye;
      if (c.call(a, i)) return f(o.get(i));
      if (c.call(a, s)) return f(o.get(s));
      o !== a && o.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return (!e && te($(i), 'iterate', _t), i.size);
    },
    has(i) {
      const o = this.__v_raw,
        a = $(o),
        s = $(i);
      return (
        e || (bt(i, s) && te(a, 'has', i), te(a, 'has', s)),
        i === s ? o.has(i) : o.has(i) || o.has(s)
      );
    },
    forEach(i, o) {
      const a = this,
        s = a.__v_raw,
        c = $(s),
        f = t ? kn : e ? Pt : Ye;
      return (!e && te(c, 'iterate', _t), s.forEach((l, u) => i.call(o, f(l), f(u), a)));
    },
  };
  return (
    G(
      r,
      e
        ? {
            add: wr('add'),
            set: wr('set'),
            delete: wr('delete'),
            clear: wr('clear'),
          }
        : {
            add(i) {
              !t && !be(i) && !Be(i) && (i = $(i));
              const o = $(this);
              return (yr(o).has.call(o, i) || (o.add(i), Ue(o, 'add', i, i)), this);
            },
            set(i, o) {
              !t && !be(o) && !Be(o) && (o = $(o));
              const a = $(this),
                { has: s, get: c } = yr(a);
              let f = s.call(a, i);
              f
                ? process.env.NODE_ENV !== 'production' && Ei(a, s, i)
                : ((i = $(i)), (f = s.call(a, i)));
              const l = c.call(a, i);
              return (
                a.set(i, o),
                f ? bt(o, l) && Ue(a, 'set', i, o, l) : Ue(a, 'add', i, o),
                this
              );
            },
            delete(i) {
              const o = $(this),
                { has: a, get: s } = yr(o);
              let c = a.call(o, i);
              c
                ? process.env.NODE_ENV !== 'production' && Ei(o, a, i)
                : ((i = $(i)), (c = a.call(o, i)));
              const f = s ? s.call(o, i) : void 0,
                l = o.delete(i);
              return (c && Ue(o, 'delete', i, void 0, f), l);
            },
            clear() {
              const i = $(this),
                o = i.size !== 0,
                a =
                  process.env.NODE_ENV !== 'production'
                    ? vt(i)
                      ? new Map(i)
                      : new Set(i)
                    : void 0,
                s = i.clear();
              return (o && Ue(i, 'clear', void 0, void 0, a), s);
            },
          }
    ),
    ['keys', 'values', 'entries', Symbol.iterator].forEach(i => {
      r[i] = wa(i, e, t);
    }),
    r
  );
}
function Jr(e, t) {
  const r = Ea(e, t);
  return (n, i, o) =>
    i === '__v_isReactive'
      ? !e
      : i === '__v_isReadonly'
        ? e
        : i === '__v_raw'
          ? n
          : Reflect.get(j(r, i) && i in n ? r : n, i, o);
}
const Na = {
    get: /* @__PURE__ */ Jr(!1, !1),
  },
  xa = {
    get: /* @__PURE__ */ Jr(!1, !0),
  },
  Sa = {
    get: /* @__PURE__ */ Jr(!0, !1),
  },
  Oa = {
    get: /* @__PURE__ */ Jr(!0, !0),
  };
function Ei(e, t, r) {
  const n = $(r);
  if (n !== r && t.call(e, n)) {
    const i = Xn(e);
    Ve(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === 'Map' ? ' as keys' : ''}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Mo = /* @__PURE__ */ new WeakMap(),
  Lo = /* @__PURE__ */ new WeakMap(),
  Ro = /* @__PURE__ */ new WeakMap(),
  $o = /* @__PURE__ */ new WeakMap();
function Ca(e) {
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
function ka(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Ca(Xn(e));
}
function sr(e) {
  return Be(e) ? e : Zr(e, !1, va, Na, Mo);
}
function Ta(e) {
  return Zr(e, !1, _a, xa, Lo);
}
function Tn(e) {
  return Zr(e, !0, ba, Sa, Ro);
}
function He(e) {
  return Zr(e, !0, ya, Oa, $o);
}
function Zr(e, t, r, n, i) {
  if (!X(e))
    return (
      process.env.NODE_ENV !== 'production' &&
        Ve(`value cannot be made ${t ? 'readonly' : 'reactive'}: ${String(e)}`),
      e
    );
  if (e.__v_raw && !(t && e.__v_isReactive)) return e;
  const o = ka(e);
  if (o === 0) return e;
  const a = i.get(e);
  if (a) return a;
  const s = new Proxy(e, o === 2 ? n : r);
  return (i.set(e, s), s);
}
function at(e) {
  return Be(e) ? at(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Be(e) {
  return !!(e && e.__v_isReadonly);
}
function be(e) {
  return !!(e && e.__v_isShallow);
}
function Mr(e) {
  return e ? !!e.__v_raw : !1;
}
function $(e) {
  const t = e && e.__v_raw;
  return t ? $(t) : e;
}
function Va(e) {
  return (!j(e, '__v_skip') && Object.isExtensible(e) && Pr(e, '__v_skip', !0), e);
}
const Ye = e => (X(e) ? sr(e) : e),
  Pt = e => (X(e) ? Tn(e) : e);
function ne(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function Do(e) {
  return ne(e) ? e.value : e;
}
const Aa = {
  get: (e, t, r) => (t === '__v_raw' ? e : Do(Reflect.get(e, t, r))),
  set: (e, t, r, n) => {
    const i = e[t];
    return ne(i) && !ne(r) ? ((i.value = r), !0) : Reflect.set(e, t, r, n);
  },
};
function Fo(e) {
  return at(e) ? e : new Proxy(e, Aa);
}
class Ia {
  constructor(t, r, n) {
    ((this.fn = t),
      (this.setter = r),
      (this._value = void 0),
      (this.dep = new ko(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = ir - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !r),
      (this.isSSR = n));
  }
  /**
   * @internal
   */
  notify() {
    if (
      ((this.flags |= 16),
      !(this.flags & 8) && // avoid infinite self recursion
        W !== this)
    )
      return (No(this, !0), !0);
    process.env.NODE_ENV;
  }
  get value() {
    const t =
      process.env.NODE_ENV !== 'production'
        ? this.dep.track({
            target: this,
            type: 'get',
            key: 'value',
          })
        : this.dep.track();
    return (Oo(this), t && (t.version = this.dep.version), this._value);
  }
  set value(t) {
    this.setter
      ? this.setter(t)
      : process.env.NODE_ENV !== 'production' &&
        Ve('Write operation failed: computed value is readonly');
  }
}
function Pa(e, t, r = !1) {
  let n, i;
  I(e) ? (n = e) : ((n = e.get), (i = e.set));
  const o = new Ia(n, i, r);
  return (process.env.NODE_ENV, o);
}
const Er = {},
  Lr = /* @__PURE__ */ new WeakMap();
let gt;
function Ma(e, t = !1, r = gt) {
  if (r) {
    let n = Lr.get(r);
    (n || Lr.set(r, (n = [])), n.push(e));
  } else
    process.env.NODE_ENV !== 'production' &&
      !t &&
      Ve('onWatcherCleanup() was called when there was no active watcher to associate with.');
}
function La(e, t, r = q) {
  const { immediate: n, deep: i, once: o, scheduler: a, augmentJob: s, call: c } = r,
    f = k => {
      (r.onWarn || Ve)(
        'Invalid watch source: ',
        k,
        'A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.'
      );
    },
    l = k => (i ? k : be(k) || i === !1 || i === 0 ? st(k, 1) : st(k));
  let u,
    p,
    m,
    C,
    N = !1,
    L = !1;
  if (
    (ne(e)
      ? ((p = () => e.value), (N = be(e)))
      : at(e)
        ? ((p = () => l(e)), (N = !0))
        : V(e)
          ? ((L = !0),
            (N = e.some(k => at(k) || be(k))),
            (p = () =>
              e.map(k => {
                if (ne(k)) return k.value;
                if (at(k)) return l(k);
                if (I(k)) return c ? c(k, 2) : k();
                process.env.NODE_ENV !== 'production' && f(k);
              })))
          : I(e)
            ? t
              ? (p = c ? () => c(e, 2) : e)
              : (p = () => {
                  if (m) {
                    Ae();
                    try {
                      m();
                    } finally {
                      Ie();
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
            : ((p = re), process.env.NODE_ENV !== 'production' && f(e)),
    t && i)
  ) {
    const k = p,
      z = i === !0 ? 1 / 0 : i;
    p = () => st(k(), z);
  }
  const R = ua(),
    P = () => {
      (u.stop(), R && R.active && Bn(R.effects, u));
    };
  if (o && t) {
    const k = t;
    t = (...z) => {
      (k(...z), P());
    };
  }
  let D = L ? new Array(e.length).fill(Er) : Er;
  const Z = k => {
    if (!(!(u.flags & 1) || (!u.dirty && !k)))
      if (t) {
        const z = u.run();
        if (i || N || (L ? z.some((ie, oe) => bt(ie, D[oe])) : bt(z, D))) {
          m && m();
          const ie = gt;
          gt = u;
          try {
            const oe = [
              z,
              // pass undefined as the old value when it's changed for the first time
              D === Er ? void 0 : L && D[0] === Er ? [] : D,
              C,
            ];
            ((D = z),
              c
                ? c(t, 3, oe)
                : // @ts-expect-error
                  t(...oe));
          } finally {
            gt = ie;
          }
        }
      } else u.run();
  };
  return (
    s && s(Z),
    (u = new wo(p)),
    (u.scheduler = a ? () => a(Z, !1) : Z),
    (C = k => Ma(k, !1, u)),
    (m = u.onStop =
      () => {
        const k = Lr.get(u);
        if (k) {
          if (c) c(k, 4);
          else for (const z of k) z();
          Lr.delete(u);
        }
      }),
    process.env.NODE_ENV !== 'production' && ((u.onTrack = r.onTrack), (u.onTrigger = r.onTrigger)),
    t ? (n ? Z(!0) : (D = u.run())) : a ? a(Z.bind(null, !0), !0) : u.run(),
    (P.pause = u.pause.bind(u)),
    (P.resume = u.resume.bind(u)),
    (P.stop = P),
    P
  );
}
function st(e, t = 1 / 0, r) {
  if (t <= 0 || !X(e) || e.__v_skip || ((r = r || /* @__PURE__ */ new Map()), (r.get(e) || 0) >= t))
    return e;
  if ((r.set(e, t), t--, ne(e))) st(e.value, t, r);
  else if (V(e)) for (let n = 0; n < e.length; n++) st(e[n], t, r);
  else if (go(e) || vt(e))
    e.forEach(n => {
      st(n, t, r);
    });
  else if (zr(e)) {
    for (const n in e) st(e[n], t, r);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && st(e[n], t, r);
  }
  return e;
}
const yt = [];
function Nr(e) {
  yt.push(e);
}
function xr() {
  yt.pop();
}
let hn = !1;
function x(e, ...t) {
  if (hn) return;
  ((hn = !0), Ae());
  const r = yt.length ? yt[yt.length - 1].component : null,
    n = r && r.appContext.config.warnHandler,
    i = Ra();
  if (n)
    Rt(n, r, 11, [
      // eslint-disable-next-line no-restricted-syntax
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
      i.map(({ vnode: o }) => `at <${vr(r, o.type)}>`).join(`
`),
      i,
    ]);
  else {
    const o = [`[Vue warn]: ${e}`, ...t];
    (i.length &&
      o.push(
        `
`,
        ...$a(i)
      ),
      console.warn(...o));
  }
  (Ie(), (hn = !1));
}
function Ra() {
  let e = yt[yt.length - 1];
  if (!e) return [];
  const t = [];
  for (; e; ) {
    const r = t[0];
    r && r.vnode === e
      ? r.recurseCount++
      : t.push({
          vnode: e,
          recurseCount: 0,
        });
    const n = e.component && e.component.parent;
    e = n && n.vnode;
  }
  return t;
}
function $a(e) {
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
        ...Da(r)
      );
    }),
    t
  );
}
function Da({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : '',
    n = e.component ? e.component.parent == null : !1,
    i = ` at <${vr(e.component, e.type, n)}`,
    o = '>' + r;
  return e.props ? [i, ...Fa(e.props), o] : [i + o];
}
function Fa(e) {
  const t = [],
    r = Object.keys(e);
  return (
    r.slice(0, 3).forEach(n => {
      t.push(...jo(n, e[n]));
    }),
    r.length > 3 && t.push(' ...'),
    t
  );
}
function jo(e, t, r) {
  return Y(t)
    ? ((t = JSON.stringify(t)), r ? t : [`${e}=${t}`])
    : typeof t == 'number' || typeof t == 'boolean' || t == null
      ? r
        ? t
        : [`${e}=${t}`]
      : ne(t)
        ? ((t = jo(e, $(t.value), !0)), r ? t : [`${e}=Ref<`, t, '>'])
        : I(t)
          ? [`${e}=fn${t.name ? `<${t.name}>` : ''}`]
          : ((t = $(t)), r ? t : [`${e}=`, t]);
}
const Zn = {
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
function Rt(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (i) {
    hr(i, t, r);
  }
}
function qe(e, t, r, n) {
  if (I(e)) {
    const i = Rt(e, t, r, n);
    return (
      i &&
        qn(i) &&
        i.catch(o => {
          hr(o, t, r);
        }),
      i
    );
  }
  if (V(e)) {
    const i = [];
    for (let o = 0; o < e.length; o++) i.push(qe(e[o], t, r, n));
    return i;
  } else
    process.env.NODE_ENV !== 'production' &&
      x(`Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`);
}
function hr(e, t, r, n = !0) {
  const i = t ? t.vnode : null,
    { errorHandler: o, throwUnhandledErrorInProduction: a } = (t && t.appContext.config) || q;
  if (t) {
    let s = t.parent;
    const c = t.proxy,
      f =
        process.env.NODE_ENV !== 'production'
          ? Zn[r]
          : `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; s; ) {
      const l = s.ec;
      if (l) {
        for (let u = 0; u < l.length; u++) if (l[u](e, c, f) === !1) return;
      }
      s = s.parent;
    }
    if (o) {
      (Ae(), Rt(o, null, 10, [e, c, f]), Ie());
      return;
    }
  }
  ja(e, r, i, n, a);
}
function ja(e, t, r, n = !0, i = !1) {
  if (process.env.NODE_ENV !== 'production') {
    const o = Zn[t];
    if ((r && Nr(r), x(`Unhandled error${o ? ` during execution of ${o}` : ''}`), r && xr(), n))
      throw e;
    console.error(e);
  } else {
    if (i) throw e;
    console.error(e);
  }
}
const le = [];
let De = -1;
const Vt = [];
let nt = null,
  Ct = 0;
const Uo = /* @__PURE__ */ Promise.resolve();
let Rr = null;
const Ua = 100;
function Ho(e) {
  const t = Rr || Uo;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Ha(e) {
  let t = De + 1,
    r = le.length;
  for (; t < r; ) {
    const n = (t + r) >>> 1,
      i = le[n],
      o = ar(i);
    o < e || (o === e && i.flags & 2) ? (t = n + 1) : (r = n);
  }
  return t;
}
function Qr(e) {
  if (!(e.flags & 1)) {
    const t = ar(e),
      r = le[le.length - 1];
    (!r || // fast path when the job id is larger than the tail
    (!(e.flags & 2) && t >= ar(r))
      ? le.push(e)
      : le.splice(Ha(t), 0, e),
      (e.flags |= 1),
      Wo());
  }
}
function Wo() {
  Rr || (Rr = Uo.then(Xo));
}
function Bo(e) {
  (V(e)
    ? Vt.push(...e)
    : nt && e.id === -1
      ? nt.splice(Ct + 1, 0, e)
      : e.flags & 1 || (Vt.push(e), (e.flags |= 1)),
    Wo());
}
function Ni(e, t, r = De + 1) {
  for (
    process.env.NODE_ENV !== 'production' && (t = t || /* @__PURE__ */ new Map());
    r < le.length;
    r++
  ) {
    const n = le[r];
    if (n && n.flags & 2) {
      if ((e && n.id !== e.uid) || (process.env.NODE_ENV !== 'production' && Qn(t, n))) continue;
      (le.splice(r, 1), r--, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2));
    }
  }
}
function qo(e) {
  if (Vt.length) {
    const t = [...new Set(Vt)].sort((r, n) => ar(r) - ar(n));
    if (((Vt.length = 0), nt)) {
      nt.push(...t);
      return;
    }
    for (
      nt = t, process.env.NODE_ENV !== 'production' && (e = e || /* @__PURE__ */ new Map()), Ct = 0;
      Ct < nt.length;
      Ct++
    ) {
      const r = nt[Ct];
      (process.env.NODE_ENV !== 'production' && Qn(e, r)) ||
        (r.flags & 4 && (r.flags &= -2), r.flags & 8 || r(), (r.flags &= -2));
    }
    ((nt = null), (Ct = 0));
  }
}
const ar = e => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
function Xo(e) {
  process.env.NODE_ENV !== 'production' && (e = e || /* @__PURE__ */ new Map());
  const t = process.env.NODE_ENV !== 'production' ? r => Qn(e, r) : re;
  try {
    for (De = 0; De < le.length; De++) {
      const r = le[De];
      if (r && !(r.flags & 8)) {
        if (process.env.NODE_ENV !== 'production' && t(r)) continue;
        (r.flags & 4 && (r.flags &= -2), Rt(r, r.i, r.i ? 15 : 14), r.flags & 4 || (r.flags &= -2));
      }
    }
  } finally {
    for (; De < le.length; De++) {
      const r = le[De];
      r && (r.flags &= -2);
    }
    ((De = -1), (le.length = 0), qo(e), (Rr = null), (le.length || Vt.length) && Xo(e));
  }
}
function Qn(e, t) {
  const r = e.get(t) || 0;
  if (r > Ua) {
    const n = t.i,
      i = n && Cs(n.type);
    return (
      hr(
        `Maximum recursive updates exceeded${i ? ` in component <${i}>` : ''}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      ),
      !0
    );
  }
  return (e.set(t, r + 1), !1);
}
let We = !1;
const Sr = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== 'production' &&
  (fr().__VUE_HMR_RUNTIME__ = {
    createRecord: pn(zo),
    rerender: pn(qa),
    reload: pn(Xa),
  });
const Et = /* @__PURE__ */ new Map();
function Wa(e) {
  const t = e.type.__hmrId;
  let r = Et.get(t);
  (r || (zo(t, e.type), (r = Et.get(t))), r.instances.add(e));
}
function Ba(e) {
  Et.get(e.type.__hmrId).instances.delete(e);
}
function zo(e, t) {
  return Et.has(e)
    ? !1
    : (Et.set(e, {
        initialDef: $r(t),
        instances: /* @__PURE__ */ new Set(),
      }),
      !0);
}
function $r(e) {
  return ks(e) ? e.__vccOpts : e;
}
function qa(e, t) {
  const r = Et.get(e);
  r &&
    ((r.initialDef.render = t),
    [...r.instances].forEach(n => {
      (t && ((n.render = t), ($r(n.type).render = t)),
        (n.renderCache = []),
        (We = !0),
        n.job.flags & 8 || n.update(),
        (We = !1));
    }));
}
function Xa(e, t) {
  const r = Et.get(e);
  if (!r) return;
  ((t = $r(t)), xi(r.initialDef, t));
  const n = [...r.instances];
  for (let i = 0; i < n.length; i++) {
    const o = n[i],
      a = $r(o.type);
    let s = Sr.get(a);
    (s || (a !== r.initialDef && xi(a, t), Sr.set(a, (s = /* @__PURE__ */ new Set()))),
      s.add(o),
      o.appContext.propsCache.delete(o.type),
      o.appContext.emitsCache.delete(o.type),
      o.appContext.optionsCache.delete(o.type),
      o.ceReload
        ? (s.add(o), o.ceReload(t.styles), s.delete(o))
        : o.parent
          ? Qr(() => {
              o.job.flags & 8 || ((We = !0), o.parent.update(), (We = !1), s.delete(o));
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
  Bo(() => {
    Sr.clear();
  });
}
function xi(e, t) {
  G(e, t);
  for (const r in e) r !== '__file' && !(r in t) && delete e[r];
}
function pn(e) {
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
let Ce,
  Gt = [],
  Vn = !1;
function pr(e, ...t) {
  Ce ? Ce.emit(e, ...t) : Vn || Gt.push({ event: e, args: t });
}
function ei(e, t) {
  var r, n;
  ((Ce = e),
    Ce
      ? ((Ce.enabled = !0), Gt.forEach(({ event: i, args: o }) => Ce.emit(i, ...o)), (Gt = []))
      : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window <
            'u' && // some envs mock window but not fully
          window.HTMLElement && // also exclude jsdom
          // eslint-disable-next-line no-restricted-syntax
          !(
            (n = (r = window.navigator) == null ? void 0 : r.userAgent) != null &&
            n.includes('jsdom')
          )
        ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push(o => {
            ei(o, t);
          }),
          setTimeout(() => {
            Ce || ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null), (Vn = !0), (Gt = []));
          }, 3e3))
        : ((Vn = !0), (Gt = [])));
}
function za(e, t) {
  pr('app:init', e, t, {
    Fragment: Ne,
    Text: gr,
    Comment: Te,
    Static: kr,
  });
}
function Ka(e) {
  pr('app:unmount', e);
}
const Ga = /* @__PURE__ */ ti(
    'component:added'
    /* COMPONENT_ADDED */
  ),
  Ko = /* @__PURE__ */ ti(
    'component:updated'
    /* COMPONENT_UPDATED */
  ),
  Ya = /* @__PURE__ */ ti(
    'component:removed'
    /* COMPONENT_REMOVED */
  ),
  Ja = e => {
    Ce &&
      typeof Ce.cleanupBuffer == 'function' && // remove the component if it wasn't buffered
      !Ce.cleanupBuffer(e) &&
      Ya(e);
  };
// @__NO_SIDE_EFFECTS__
function ti(e) {
  return t => {
    pr(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : void 0, t);
  };
}
const Za = /* @__PURE__ */ Go(
    'perf:start'
    /* PERFORMANCE_START */
  ),
  Qa = /* @__PURE__ */ Go(
    'perf:end'
    /* PERFORMANCE_END */
  );
function Go(e) {
  return (t, r, n) => {
    pr(e, t.appContext.app, t.uid, t, r, n);
  };
}
function ec(e, t, r) {
  pr('component:emit', e.appContext.app, e, t, r);
}
let we = null,
  Yo = null;
function Dr(e) {
  const t = we;
  return ((we = e), (Yo = (e && e.type.__scopeId) || null), t);
}
function tc(e, t = we, r) {
  if (!t || e._n) return e;
  const n = (...i) => {
    n._d && Fi(-1);
    const o = Dr(t);
    let a;
    try {
      a = e(...i);
    } finally {
      (Dr(o), n._d && Fi(1));
    }
    return (process.env.NODE_ENV !== 'production' && Ko(t), a);
  };
  return ((n._n = !0), (n._c = !0), (n._d = !0), n);
}
function Jo(e) {
  zs(e) && x('Do not use built-in directive ids as custom directive id: ' + e);
}
function dt(e, t, r, n) {
  const i = e.dirs,
    o = t && t.dirs;
  for (let a = 0; a < i.length; a++) {
    const s = i[a];
    o && (s.oldValue = o[a].value);
    let c = s.dir[n];
    c && (Ae(), qe(c, r, 8, [e.el, s, e, t]), Ie());
  }
}
const rc = /* @__PURE__ */ Symbol('_vte'),
  nc = e => e.__isTeleport,
  ic = /* @__PURE__ */ Symbol('_leaveCb');
function ri(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), ri(e.component.subTree, t))
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)),
        (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t);
}
// @__NO_SIDE_EFFECTS__
function Zo(e, t) {
  return I(e)
    ? // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      G({ name: e.name }, t, { setup: e })
    : e;
}
function Qo(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + '-', 0, 0];
}
const Si = /* @__PURE__ */ new WeakSet(),
  Fr = /* @__PURE__ */ new WeakMap();
function er(e, t, r, n, i = !1) {
  if (V(e)) {
    e.forEach((N, L) => er(N, t && (V(t) ? t[L] : t), r, n, i));
    return;
  }
  if (tr(n) && !i) {
    n.shapeFlag & 512 &&
      n.type.__asyncResolved &&
      n.component.subTree.component &&
      er(e, t, r, n.component.subTree);
    return;
  }
  const o = n.shapeFlag & 4 ? li(n.component) : n.el,
    a = i ? null : o,
    { i: s, r: c } = e;
  if (process.env.NODE_ENV !== 'production' && !s) {
    x(
      'Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.'
    );
    return;
  }
  const f = t && t.r,
    l = s.refs === q ? (s.refs = {}) : s.refs,
    u = s.setupState,
    p = $(u),
    m =
      u === q
        ? po
        : N =>
            process.env.NODE_ENV !== 'production' &&
            (j(p, N) &&
              !ne(p[N]) &&
              x(
                `Template ref "${N}" used on a non-ref value. It will not work in the production build.`
              ),
            Si.has(p[N]))
              ? !1
              : j(p, N),
    C = N => process.env.NODE_ENV === 'production' || !Si.has(N);
  if (f != null && f !== c) {
    if ((Oi(t), Y(f))) ((l[f] = null), m(f) && (u[f] = null));
    else if (ne(f)) {
      C(f) && (f.value = null);
      const N = t;
      N.k && (l[N.k] = null);
    }
  }
  if (I(c)) Rt(c, s, 12, [a, l]);
  else {
    const N = Y(c),
      L = ne(c);
    if (N || L) {
      const R = () => {
        if (e.f) {
          const P = N ? (m(c) ? u[c] : l[c]) : C(c) || !e.k ? c.value : l[e.k];
          if (i) V(P) && Bn(P, o);
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
          (R(), Fr.delete(e));
        };
        ((P.id = -1), Fr.set(e, P), _e(P, r));
      } else (Oi(e), R());
    } else
      process.env.NODE_ENV !== 'production' && x('Invalid template ref type:', c, `(${typeof c})`);
  }
}
function Oi(e) {
  const t = Fr.get(e);
  t && ((t.flags |= 8), Fr.delete(e));
}
fr().requestIdleCallback;
fr().cancelIdleCallback;
const tr = e => !!e.type.__asyncLoader,
  ni = e => e.type.__isKeepAlive;
function oc(e, t) {
  es(e, 'a', t);
}
function sc(e, t) {
  es(e, 'da', t);
}
function es(e, t, r = ee) {
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
  if ((en(t, n, r), r)) {
    let i = r.parent;
    for (; i && i.parent; ) (ni(i.parent.vnode) && ac(n, t, r, i), (i = i.parent));
  }
}
function ac(e, t, r, n) {
  const i = en(
    t,
    e,
    n,
    !0
    /* prepend */
  );
  ts(() => {
    Bn(n[t], i);
  }, r);
}
function en(e, t, r = ee, n = !1) {
  if (r) {
    const i = r[e] || (r[e] = []),
      o =
        t.__weh ||
        (t.__weh = (...a) => {
          Ae();
          const s = mr(r),
            c = qe(t, r, e, a);
          return (s(), Ie(), c);
        });
    return (n ? i.unshift(o) : i.push(o), o);
  } else if (process.env.NODE_ENV !== 'production') {
    const i = pt(Zn[e].replace(/ hook$/, ''));
    x(
      `${i} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const Ze =
    e =>
    (t, r = ee) => {
      (!lr || e === 'sp') && en(e, (...n) => t(...n), r);
    },
  cc = Ze('bm'),
  lc = Ze('m'),
  uc = Ze('bu'),
  dc = Ze('u'),
  fc = Ze('bum'),
  ts = Ze('um'),
  hc = Ze('sp'),
  pc = Ze('rtg'),
  gc = Ze('rtc');
function mc(e, t = ee) {
  en('ec', e, t);
}
const vc = /* @__PURE__ */ Symbol.for('v-ndc');
function Ci(e, t, r, n) {
  let i;
  const o = r,
    a = V(e);
  if (a || Y(e)) {
    const s = a && at(e);
    let c = !1,
      f = !1;
    (s && ((c = !be(e)), (f = Be(e)), (e = Yr(e))), (i = new Array(e.length)));
    for (let l = 0, u = e.length; l < u; l++)
      i[l] = t(c ? (f ? Pt(Ye(e[l])) : Ye(e[l])) : e[l], l, void 0, o);
  } else if (typeof e == 'number') {
    (process.env.NODE_ENV !== 'production' &&
      !Number.isInteger(e) &&
      x(`The v-for range expect an integer value but got ${e}.`),
      (i = new Array(e)));
    for (let s = 0; s < e; s++) i[s] = t(s + 1, s, void 0, o);
  } else if (X(e))
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
const An = e => (e ? (Ss(e) ? li(e) : An(e.parent)) : null),
  wt =
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ G(/* @__PURE__ */ Object.create(null), {
      $: e => e,
      $el: e => e.vnode.el,
      $data: e => e.data,
      $props: e => (process.env.NODE_ENV !== 'production' ? He(e.props) : e.props),
      $attrs: e => (process.env.NODE_ENV !== 'production' ? He(e.attrs) : e.attrs),
      $slots: e => (process.env.NODE_ENV !== 'production' ? He(e.slots) : e.slots),
      $refs: e => (process.env.NODE_ENV !== 'production' ? He(e.refs) : e.refs),
      $parent: e => An(e.parent),
      $root: e => An(e.root),
      $host: e => e.ce,
      $emit: e => e.emit,
      $options: e => is(e),
      $forceUpdate: e =>
        e.f ||
        (e.f = () => {
          Qr(e.update);
        }),
      $nextTick: e => e.n || (e.n = Ho.bind(e.proxy)),
      $watch: e => Ic.bind(e),
    }),
  ii = e => e === '_' || e === '$',
  gn = (e, t) => e !== q && !e.__isScriptSetup && j(e, t),
  rs = {
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
          if (gn(n, t)) return ((a[t] = 1), n[t]);
          if (i !== q && j(i, t)) return ((a[t] = 2), i[t]);
          if (j(o, t)) return ((a[t] = 3), o[t]);
          if (r !== q && j(r, t)) return ((a[t] = 4), r[t]);
          In && (a[t] = 0);
        }
      }
      const f = wt[t];
      let l, u;
      if (f)
        return (
          t === '$attrs'
            ? (te(e.attrs, 'get', ''), process.env.NODE_ENV !== 'production' && Ur())
            : process.env.NODE_ENV !== 'production' && t === '$slots' && te(e, 'get', t),
          f(e)
        );
      if (
        // css module (injected by vue-loader)
        (l = s.__cssModules) &&
        (l = l[t])
      )
        return l;
      if (r !== q && j(r, t)) return ((a[t] = 4), r[t]);
      if (
        // global properties
        ((u = c.config.globalProperties), j(u, t))
      )
        return u[t];
      process.env.NODE_ENV !== 'production' &&
        we &&
        (!Y(t) || // #1091 avoid internal isRef/isVNode checks on component instance leading
          // to infinite warning loop
          t.indexOf('__v') !== 0) &&
        (i !== q && ii(t[0]) && j(i, t)
          ? x(
              `Property ${JSON.stringify(
                t
              )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
            )
          : e === we &&
            x(
              `Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`
            ));
    },
    set({ _: e }, t, r) {
      const { data: n, setupState: i, ctx: o } = e;
      return gn(i, t)
        ? ((i[t] = r), !0)
        : process.env.NODE_ENV !== 'production' && i.__isScriptSetup && j(i, t)
          ? (x(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1)
          : n !== q && j(n, t)
            ? ((n[t] = r), !0)
            : j(e.props, t)
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
                    ? Object.defineProperty(o, t, {
                        enumerable: !0,
                        configurable: !0,
                        value: r,
                      })
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
        (e !== q && s[0] !== '$' && j(e, s)) ||
        gn(t, s) ||
        j(o, s) ||
        j(n, s) ||
        j(wt, s) ||
        j(i.config.globalProperties, s) ||
        ((c = a.__cssModules) && c[s])
      );
    },
    defineProperty(e, t, r) {
      return (
        r.get != null ? (e._.accessCache[t] = 0) : j(r, 'value') && this.set(e, t, r.value, null),
        Reflect.defineProperty(e, t, r)
      );
    },
  };
process.env.NODE_ENV !== 'production' &&
  (rs.ownKeys = e => (
    x(
      'Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.'
    ),
    Reflect.ownKeys(e)
  ));
function bc(e) {
  const t = {};
  return (
    Object.defineProperty(t, '_', {
      configurable: !0,
      enumerable: !1,
      get: () => e,
    }),
    Object.keys(wt).forEach(r => {
      Object.defineProperty(t, r, {
        configurable: !0,
        enumerable: !1,
        get: () => wt[r](e),
        // intercepted by the proxy so no need for implementation,
        // but needed to prevent set errors
        set: re,
      });
    }),
    t
  );
}
function _c(e) {
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
        set: re,
      });
    });
}
function yc(e) {
  const { ctx: t, setupState: r } = e;
  Object.keys($(r)).forEach(n => {
    if (!r.__isScriptSetup) {
      if (ii(n[0])) {
        x(
          `setup() return property ${JSON.stringify(
            n
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(t, n, {
        enumerable: !0,
        configurable: !0,
        get: () => r[n],
        set: re,
      });
    }
  });
}
function ki(e) {
  return V(e) ? e.reduce((t, r) => ((t[r] = null), t), {}) : e;
}
function wc() {
  const e = /* @__PURE__ */ Object.create(null);
  return (t, r) => {
    e[r] ? x(`${t} property "${r}" is already defined in ${e[r]}.`) : (e[r] = t);
  };
}
let In = !0;
function Ec(e) {
  const t = is(e),
    r = e.proxy,
    n = e.ctx;
  ((In = !1), t.beforeCreate && Ti(t.beforeCreate, e, 'bc'));
  const {
      // state
      data: i,
      computed: o,
      methods: a,
      watch: s,
      provide: c,
      inject: f,
      // lifecycle
      created: l,
      beforeMount: u,
      mounted: p,
      beforeUpdate: m,
      updated: C,
      activated: N,
      deactivated: L,
      beforeDestroy: R,
      beforeUnmount: P,
      destroyed: D,
      unmounted: Z,
      render: k,
      renderTracked: z,
      renderTriggered: ie,
      errorCaptured: oe,
      serverPrefetch: ue,
      // public API
      expose: Xe,
      inheritAttrs: Qe,
      // assets
      components: Se,
      directives: br,
      filters: hi,
    } = t,
    et = process.env.NODE_ENV !== 'production' ? wc() : null;
  if (process.env.NODE_ENV !== 'production') {
    const [U] = e.propsOptions;
    if (U) for (const F in U) et('Props', F);
  }
  if ((f && Nc(f, n, et), a))
    for (const U in a) {
      const F = a[U];
      I(F)
        ? (process.env.NODE_ENV !== 'production'
            ? Object.defineProperty(n, U, {
                value: F.bind(r),
                configurable: !0,
                enumerable: !0,
                writable: !0,
              })
            : (n[U] = F.bind(r)),
          process.env.NODE_ENV !== 'production' && et('Methods', U))
        : process.env.NODE_ENV !== 'production' &&
          x(
            `Method "${U}" has type "${typeof F}" in the component definition. Did you reference the function correctly?`
          );
    }
  if (i) {
    process.env.NODE_ENV !== 'production' &&
      !I(i) &&
      x('The data option must be a function. Plain object usage is no longer supported.');
    const U = i.call(r, r);
    if (
      (process.env.NODE_ENV !== 'production' &&
        qn(U) &&
        x(
          'data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.'
        ),
      !X(U))
    )
      process.env.NODE_ENV !== 'production' && x('data() should return an object.');
    else if (((e.data = sr(U)), process.env.NODE_ENV !== 'production'))
      for (const F in U)
        (et('Data', F),
          ii(F[0]) ||
            Object.defineProperty(n, F, {
              configurable: !0,
              enumerable: !0,
              get: () => U[F],
              set: re,
            }));
  }
  if (((In = !0), o))
    for (const U in o) {
      const F = o[U],
        Pe = I(F) ? F.bind(r, r) : I(F.get) ? F.get.bind(r, r) : re;
      process.env.NODE_ENV !== 'production' &&
        Pe === re &&
        x(`Computed property "${U}" has no getter.`);
      const sn =
          !I(F) && I(F.set)
            ? F.set.bind(r)
            : process.env.NODE_ENV !== 'production'
              ? () => {
                  x(`Write operation failed: computed property "${U}" is readonly.`);
                }
              : re,
        $t = Vr({
          get: Pe,
          set: sn,
        });
      (Object.defineProperty(n, U, {
        enumerable: !0,
        configurable: !0,
        get: () => $t.value,
        set: Nt => ($t.value = Nt),
      }),
        process.env.NODE_ENV !== 'production' && et('Computed', U));
    }
  if (s) for (const U in s) ns(s[U], n, r, U);
  if (c) {
    const U = I(c) ? c.call(r) : c;
    Reflect.ownKeys(U).forEach(F => {
      Tc(F, U[F]);
    });
  }
  l && Ti(l, e, 'c');
  function de(U, F) {
    V(F) ? F.forEach(Pe => U(Pe.bind(r))) : F && U(F.bind(r));
  }
  if (
    (de(cc, u),
    de(lc, p),
    de(uc, m),
    de(dc, C),
    de(oc, N),
    de(sc, L),
    de(mc, oe),
    de(gc, z),
    de(pc, ie),
    de(fc, P),
    de(ts, Z),
    de(hc, ue),
    V(Xe))
  )
    if (Xe.length) {
      const U = e.exposed || (e.exposed = {});
      Xe.forEach(F => {
        Object.defineProperty(U, F, {
          get: () => r[F],
          set: Pe => (r[F] = Pe),
          enumerable: !0,
        });
      });
    } else e.exposed || (e.exposed = {});
  (k && e.render === re && (e.render = k),
    Qe != null && (e.inheritAttrs = Qe),
    Se && (e.components = Se),
    br && (e.directives = br),
    ue && Qo(e));
}
function Nc(e, t, r = re) {
  V(e) && (e = Pn(e));
  for (const n in e) {
    const i = e[n];
    let o;
    (X(i)
      ? 'default' in i
        ? (o = Or(i.from || n, i.default, !0))
        : (o = Or(i.from || n))
      : (o = Or(i)),
      ne(o)
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
function Ti(e, t, r) {
  qe(V(e) ? e.map(n => n.bind(t.proxy)) : e.bind(t.proxy), t, r);
}
function ns(e, t, r, n) {
  let i = n.includes('.') ? as(r, n) : () => r[n];
  if (Y(e)) {
    const o = t[e];
    I(o)
      ? mn(i, o)
      : process.env.NODE_ENV !== 'production' &&
        x(`Invalid watch handler specified by key "${e}"`, o);
  } else if (I(e)) mn(i, e.bind(r));
  else if (X(e))
    if (V(e)) e.forEach(o => ns(o, t, r, n));
    else {
      const o = I(e.handler) ? e.handler.bind(r) : t[e.handler];
      I(o)
        ? mn(i, o, e)
        : process.env.NODE_ENV !== 'production' &&
          x(`Invalid watch handler specified by key "${e.handler}"`, o);
    }
  else process.env.NODE_ENV !== 'production' && x(`Invalid watch option: "${n}"`, e);
}
function is(e) {
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
        : ((c = {}), i.length && i.forEach(f => jr(c, f, a, !0)), jr(c, t, a)),
    X(t) && o.set(t, c),
    c
  );
}
function jr(e, t, r, n = !1) {
  const { mixins: i, extends: o } = t;
  (o && jr(e, o, r, !0), i && i.forEach(a => jr(e, a, r, !0)));
  for (const a in t)
    if (n && a === 'expose')
      process.env.NODE_ENV !== 'production' &&
        x(
          '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
        );
    else {
      const s = xc[a] || (r && r[a]);
      e[a] = s ? s(e[a], t[a]) : t[a];
    }
  return e;
}
const xc = {
  data: Vi,
  props: Ai,
  emits: Ai,
  // objects
  methods: Yt,
  computed: Yt,
  // lifecycle
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
  // assets
  components: Yt,
  directives: Yt,
  // watch
  watch: Oc,
  // provide / inject
  provide: Vi,
  inject: Sc,
};
function Vi(e, t) {
  return t
    ? e
      ? function () {
          return G(I(e) ? e.call(this, this) : e, I(t) ? t.call(this, this) : t);
        }
      : t
    : e;
}
function Sc(e, t) {
  return Yt(Pn(e), Pn(t));
}
function Pn(e) {
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
function Yt(e, t) {
  return e ? G(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ai(e, t) {
  return e
    ? V(e) && V(t)
      ? [.../* @__PURE__ */ new Set([...e, ...t])]
      : G(/* @__PURE__ */ Object.create(null), ki(e), ki(t ?? {}))
    : t;
}
function Oc(e, t) {
  if (!e) return t;
  if (!t) return e;
  const r = G(/* @__PURE__ */ Object.create(null), e);
  for (const n in t) r[n] = ae(e[n], t[n]);
  return r;
}
function os() {
  return {
    app: null,
    config: {
      isNativeTag: po,
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
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap(),
  };
}
let Cc = 0;
function kc(e, t) {
  return function (n, i = null) {
    (I(n) || (n = G({}, n)),
      i != null &&
        !X(i) &&
        (process.env.NODE_ENV !== 'production' &&
          x('root props passed to app.mount() must be an object.'),
        (i = null)));
    const o = os(),
      a = /* @__PURE__ */ new WeakSet(),
      s = [];
    let c = !1;
    const f = (o.app = {
      _uid: Cc++,
      _component: n,
      _props: i,
      _container: null,
      _context: o,
      _instance: null,
      version: Wi,
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
                  x('A plugin must either be a function or an object with an "install" function.'),
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
          process.env.NODE_ENV !== 'production' && Dn(l, o.config),
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
          process.env.NODE_ENV !== 'production' && Jo(l),
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
          const m = f._ceVNode || ct(n, i);
          return (
            (m.appContext = o),
            p === !0 ? (p = 'svg') : p === !1 && (p = void 0),
            process.env.NODE_ENV !== 'production' &&
              (o.reload = () => {
                const C = lt(m);
                ((C.el = null), e(C, l, p));
              }),
            e(m, l, p),
            (c = !0),
            (f._container = l),
            (l.__vue_app__ = f),
            process.env.NODE_ENV !== 'production' && ((f._instance = m.component), za(f, Wi)),
            li(m.component)
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
          ? (qe(s, f._instance, 16),
            e(null, f._container),
            process.env.NODE_ENV !== 'production' && ((f._instance = null), Ka(f)),
            delete f._container.__vue_app__)
          : process.env.NODE_ENV !== 'production' &&
            x('Cannot unmount an app that is not mounted.');
      },
      provide(l, u) {
        return (
          process.env.NODE_ENV !== 'production' &&
            l in o.provides &&
            (j(o.provides, l)
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
        const u = At;
        At = f;
        try {
          return l();
        } finally {
          At = u;
        }
      },
    });
    return f;
  };
}
let At = null;
function Tc(e, t) {
  if (
    (process.env.NODE_ENV !== 'production' &&
      (!ee || ee.isMounted) &&
      x('provide() can only be used inside setup().'),
    ee)
  ) {
    let r = ee.provides;
    const n = ee.parent && ee.parent.provides;
    (n === r && (r = ee.provides = Object.create(n)), (r[e] = t));
  }
}
function Or(e, t, r = !1) {
  const n = xs();
  if (n || At) {
    let i = At
      ? At._context.provides
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
const Vc = /* @__PURE__ */ Symbol.for('v-scx'),
  Ac = () => {
    {
      const e = Or(Vc);
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
function mn(e, t, r) {
  return (
    process.env.NODE_ENV !== 'production' &&
      !I(t) &&
      x(
        '`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature.'
      ),
    ss(e, t, r)
  );
}
function ss(e, t, r = q) {
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
  if (lr) {
    if (o === 'sync') {
      const m = Ac();
      f = m.__watcherHandles || (m.__watcherHandles = []);
    } else if (!c) {
      const m = () => {};
      return ((m.stop = re), (m.resume = re), (m.pause = re), m);
    }
  }
  const l = ee;
  s.call = (m, C, N) => qe(m, l, C, N);
  let u = !1;
  (o === 'post'
    ? (s.scheduler = m => {
        _e(m, l && l.suspense);
      })
    : o !== 'sync' &&
      ((u = !0),
      (s.scheduler = (m, C) => {
        C ? m() : Qr(m);
      })),
    (s.augmentJob = m => {
      (t && (m.flags |= 4), u && ((m.flags |= 2), l && ((m.id = l.uid), (m.i = l))));
    }));
  const p = La(e, t, s);
  return (lr && (f ? f.push(p) : c && p()), p);
}
function Ic(e, t, r) {
  const n = this.proxy,
    i = Y(e) ? (e.includes('.') ? as(n, e) : () => n[e]) : e.bind(n, n);
  let o;
  I(t) ? (o = t) : ((o = t.handler), (r = t));
  const a = mr(this),
    s = ss(i, o.bind(n), r);
  return (a(), s);
}
function as(e, t) {
  const r = t.split('.');
  return () => {
    let n = e;
    for (let i = 0; i < r.length && n; i++) n = n[r[i]];
    return n;
  };
}
const Pc = (e, t) =>
  t === 'modelValue' || t === 'model-value'
    ? e.modelModifiers
    : e[`${t}Modifiers`] || e[`${ve(t)}Modifiers`] || e[`${ye(t)}Modifiers`];
function Mc(e, t, ...r) {
  if (e.isUnmounted) return;
  const n = e.vnode.props || q;
  if (process.env.NODE_ENV !== 'production') {
    const {
      emitsOptions: l,
      propsOptions: [u],
    } = e;
    if (l)
      if (!(t in l))
        (!u || !(pt(ve(t)) in u)) &&
          x(
            `Component emitted event "${t}" but it is neither declared in the emits option nor as an "${pt(ve(t))}" prop.`
          );
      else {
        const p = l[t];
        I(p) &&
          (p(...r) || x(`Invalid event arguments: event validation failed for event "${t}".`));
      }
  }
  let i = r;
  const o = t.startsWith('update:'),
    a = o && Pc(n, t.slice(7));
  if (
    (a && (a.trim && (i = r.map(l => (Y(l) ? l.trim() : l))), a.number && (i = r.map(Ys))),
    process.env.NODE_ENV !== 'production' && ec(e, t, i),
    process.env.NODE_ENV !== 'production')
  ) {
    const l = t.toLowerCase();
    l !== t &&
      n[pt(l)] &&
      x(
        `Event "${l}" is emitted in component ${vr(
          e,
          e.type
        )} but the handler is registered for "${t}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${ye(
          t
        )}" instead of "${t}".`
      );
  }
  let s,
    c =
      n[(s = pt(t))] || // also try camelCase event handler (#2249)
      n[(s = pt(ve(t)))];
  (!c && o && (c = n[(s = pt(ye(t)))]), c && qe(c, e, 6, i));
  const f = n[s + 'Once'];
  if (f) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[s]) return;
    ((e.emitted[s] = !0), qe(f, e, 6, i));
  }
}
const Lc = /* @__PURE__ */ new WeakMap();
function cs(e, t, r = !1) {
  const n = r ? Lc : t.emitsCache,
    i = n.get(e);
  if (i !== void 0) return i;
  const o = e.emits;
  let a = {},
    s = !1;
  if (!I(e)) {
    const c = f => {
      const l = cs(f, t, !0);
      l && ((s = !0), G(a, l));
    };
    (!r && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c));
  }
  return !o && !s
    ? (X(e) && n.set(e, null), null)
    : (V(o) ? o.forEach(c => (a[c] = null)) : G(a, o), X(e) && n.set(e, a), a);
}
function tn(e, t) {
  return !e || !dr(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, '')),
      j(e, t[0].toLowerCase() + t.slice(1)) || j(e, ye(t)) || j(e, t));
}
let Mn = !1;
function Ur() {
  Mn = !0;
}
function Ii(e) {
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
  let R, P;
  process.env.NODE_ENV !== 'production' && (Mn = !1);
  try {
    if (r.shapeFlag & 4) {
      const k = i || n,
        z =
          process.env.NODE_ENV !== 'production' && m.__isScriptSetup
            ? new Proxy(k, {
                get(ie, oe, ue) {
                  return (
                    x(
                      `Property '${String(
                        oe
                      )}' was accessed via 'this'. Avoid using 'this' in templates.`
                    ),
                    Reflect.get(ie, oe, ue)
                  );
                },
              })
            : k;
      ((R = Oe(f.call(z, k, l, process.env.NODE_ENV !== 'production' ? He(u) : u, m, p, C))),
        (P = s));
    } else {
      const k = t;
      (process.env.NODE_ENV !== 'production' && s === u && Ur(),
        (R = Oe(
          k.length > 1
            ? k(
                process.env.NODE_ENV !== 'production' ? He(u) : u,
                process.env.NODE_ENV !== 'production'
                  ? {
                      get attrs() {
                        return (Ur(), He(s));
                      },
                      slots: a,
                      emit: c,
                    }
                  : { attrs: s, slots: a, emit: c }
              )
            : k(process.env.NODE_ENV !== 'production' ? He(u) : u, null)
        )),
        (P = t.props ? s : Rc(s)));
    }
  } catch (k) {
    ((rr.length = 0), hr(k, e, 1), (R = ct(Te)));
  }
  let D = R,
    Z;
  if (
    (process.env.NODE_ENV !== 'production' &&
      R.patchFlag > 0 &&
      R.patchFlag & 2048 &&
      ([D, Z] = ls(R)),
    P && N !== !1)
  ) {
    const k = Object.keys(P),
      { shapeFlag: z } = D;
    if (k.length) {
      if (z & 7) (o && k.some(Ir) && (P = $c(P, o)), (D = lt(D, P, !1, !0)));
      else if (process.env.NODE_ENV !== 'production' && !Mn && D.type !== Te) {
        const ie = Object.keys(s),
          oe = [],
          ue = [];
        for (let Xe = 0, Qe = ie.length; Xe < Qe; Xe++) {
          const Se = ie[Xe];
          dr(Se) ? Ir(Se) || oe.push(Se[2].toLowerCase() + Se.slice(3)) : ue.push(Se);
        }
        (ue.length &&
          x(
            `Extraneous non-props attributes (${ue.join(', ')}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
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
        !Pi(D) &&
        x(
          'Runtime directive used on component with non-element root node. The directives will not function as intended.'
        ),
      (D = lt(D, null, !1, !0)),
      (D.dirs = D.dirs ? D.dirs.concat(r.dirs) : r.dirs)),
    r.transition &&
      (process.env.NODE_ENV !== 'production' &&
        !Pi(D) &&
        x('Component inside <Transition> renders non-element root node that cannot be animated.'),
      ri(D, r.transition)),
    process.env.NODE_ENV !== 'production' && Z ? Z(D) : (R = D),
    Dr(L),
    R
  );
}
const ls = e => {
  const t = e.children,
    r = e.dynamicChildren,
    n = oi(t, !1);
  if (n) {
    if (process.env.NODE_ENV !== 'production' && n.patchFlag > 0 && n.patchFlag & 2048)
      return ls(n);
  } else return [e, void 0];
  const i = t.indexOf(n),
    o = r ? r.indexOf(n) : -1,
    a = s => {
      ((t[i] = s), r && (o > -1 ? (r[o] = s) : s.patchFlag > 0 && (e.dynamicChildren = [...r, s])));
    };
  return [Oe(n), a];
};
function oi(e, t = !0) {
  let r;
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    if (rn(i)) {
      if (i.type !== Te || i.children === 'v-if') {
        if (r) return;
        if (
          ((r = i),
          process.env.NODE_ENV !== 'production' && t && r.patchFlag > 0 && r.patchFlag & 2048)
        )
          return oi(r.children);
      }
    } else return;
  }
  return r;
}
const Rc = e => {
    let t;
    for (const r in e) (r === 'class' || r === 'style' || dr(r)) && ((t || (t = {}))[r] = e[r]);
    return t;
  },
  $c = (e, t) => {
    const r = {};
    for (const n in e) (!Ir(n) || !(n.slice(9) in t)) && (r[n] = e[n]);
    return r;
  },
  Pi = e => e.shapeFlag & 7 || e.type === Te;
function Dc(e, t, r) {
  const { props: n, children: i, component: o } = e,
    { props: a, children: s, patchFlag: c } = t,
    f = o.emitsOptions;
  if ((process.env.NODE_ENV !== 'production' && (i || s) && We) || t.dirs || t.transition)
    return !0;
  if (r && c >= 0) {
    if (c & 1024) return !0;
    if (c & 16) return n ? Mi(n, a, f) : !!a;
    if (c & 8) {
      const l = t.dynamicProps;
      for (let u = 0; u < l.length; u++) {
        const p = l[u];
        if (a[p] !== n[p] && !tn(f, p)) return !0;
      }
    }
  } else
    return (i || s) && (!s || !s.$stable) ? !0 : n === a ? !1 : n ? (a ? Mi(n, a, f) : !0) : !!a;
  return !1;
}
function Mi(e, t, r) {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length) return !0;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    if (t[o] !== e[o] && !tn(r, o)) return !0;
  }
  return !1;
}
function Fc({ vnode: e, parent: t }, r) {
  for (; t; ) {
    const n = t.subTree;
    if ((n.suspense && n.suspense.activeBranch === e && (n.el = e.el), n === e))
      (((e = t.vnode).el = r), (t = t.parent));
    else break;
  }
}
const us = {},
  ds = () => Object.create(us),
  fs = e => Object.getPrototypeOf(e) === us;
function jc(e, t, r, n = !1) {
  const i = {},
    o = ds();
  ((e.propsDefaults = /* @__PURE__ */ Object.create(null)), hs(e, t, i, o));
  for (const a in e.propsOptions[0]) a in i || (i[a] = void 0);
  (process.env.NODE_ENV !== 'production' && gs(t || {}, i, e),
    r ? (e.props = n ? i : Ta(i)) : e.type.props ? (e.props = i) : (e.props = o),
    (e.attrs = o));
}
function Uc(e) {
  for (; e; ) {
    if (e.type.__hmrId) return !0;
    e = e.parent;
  }
}
function Hc(e, t, r, n) {
  const {
      props: i,
      attrs: o,
      vnode: { patchFlag: a },
    } = e,
    s = $(i),
    [c] = e.propsOptions;
  let f = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !(process.env.NODE_ENV !== 'production' && Uc(e)) &&
    (n || a > 0) &&
    !(a & 16)
  ) {
    if (a & 8) {
      const l = e.vnode.dynamicProps;
      for (let u = 0; u < l.length; u++) {
        let p = l[u];
        if (tn(e.emitsOptions, p)) continue;
        const m = t[p];
        if (c)
          if (j(o, p)) m !== o[p] && ((o[p] = m), (f = !0));
          else {
            const C = ve(p);
            i[C] = Ln(c, s, C, m, e, !1);
          }
        else m !== o[p] && ((o[p] = m), (f = !0));
      }
    }
  } else {
    hs(e, t, i, o) && (f = !0);
    let l;
    for (const u in s)
      (!t || // for camelCase
        (!j(t, u) && // it's possible the original props was passed in as kebab-case
          // and converted to camelCase (#955)
          ((l = ye(u)) === u || !j(t, l)))) &&
        (c
          ? r && // for camelCase
            (r[u] !== void 0 || // for kebab-case
              r[l] !== void 0) &&
            (i[u] = Ln(c, s, u, void 0, e, !0))
          : delete i[u]);
    if (o !== s) for (const u in o) (!t || !j(t, u)) && (delete o[u], (f = !0));
  }
  (f && Ue(e.attrs, 'set', ''), process.env.NODE_ENV !== 'production' && gs(t || {}, i, e));
}
function hs(e, t, r, n) {
  const [i, o] = e.propsOptions;
  let a = !1,
    s;
  if (t)
    for (let c in t) {
      if (Jt(c)) continue;
      const f = t[c];
      let l;
      i && j(i, (l = ve(c)))
        ? !o || !o.includes(l)
          ? (r[l] = f)
          : ((s || (s = {}))[l] = f)
        : tn(e.emitsOptions, c) || ((!(c in n) || f !== n[c]) && ((n[c] = f), (a = !0)));
    }
  if (o) {
    const c = $(r),
      f = s || q;
    for (let l = 0; l < o.length; l++) {
      const u = o[l];
      r[u] = Ln(i, c, u, f[u], e, !j(f, u));
    }
  }
  return a;
}
function Ln(e, t, r, n, i, o) {
  const a = e[r];
  if (a != null) {
    const s = j(a, 'default');
    if (s && n === void 0) {
      const c = a.default;
      if (a.type !== Function && !a.skipFactory && I(c)) {
        const { propsDefaults: f } = i;
        if (r in f) n = f[r];
        else {
          const l = mr(i);
          ((n = f[r] = c.call(null, t)), l());
        }
      } else n = c;
      i.ce && i.ce._setProp(r, n);
    }
    a[0] &&
    /* shouldCast */
      (o && !s
        ? (n = !1)
        : a[1] &&
          /* shouldCastTrue */
          (n === '' || n === ye(r)) &&
          (n = !0));
  }
  return n;
}
const Wc = /* @__PURE__ */ new WeakMap();
function ps(e, t, r = !1) {
  const n = r ? Wc : t.propsCache,
    i = n.get(e);
  if (i) return i;
  const o = e.props,
    a = {},
    s = [];
  let c = !1;
  if (!I(e)) {
    const l = u => {
      c = !0;
      const [p, m] = ps(u, t, !0);
      (G(a, p), m && s.push(...m));
    };
    (!r && t.mixins.length && t.mixins.forEach(l),
      e.extends && l(e.extends),
      e.mixins && e.mixins.forEach(l));
  }
  if (!o && !c) return (X(e) && n.set(e, kt), kt);
  if (V(o))
    for (let l = 0; l < o.length; l++) {
      process.env.NODE_ENV !== 'production' &&
        !Y(o[l]) &&
        x('props must be strings when using array syntax.', o[l]);
      const u = ve(o[l]);
      Li(u) && (a[u] = q);
    }
  else if (o) {
    process.env.NODE_ENV !== 'production' && !X(o) && x('invalid props options', o);
    for (const l in o) {
      const u = ve(l);
      if (Li(u)) {
        const p = o[l],
          m = (a[u] = V(p) || I(p) ? { type: p } : G({}, p)),
          C = m.type;
        let N = !1,
          L = !0;
        if (V(C))
          for (let R = 0; R < C.length; ++R) {
            const P = C[R],
              D = I(P) && P.name;
            if (D === 'Boolean') {
              N = !0;
              break;
            } else D === 'String' && (L = !1);
          }
        else N = I(C) && C.name === 'Boolean';
        ((m[0] =
        /* shouldCast */
          N),
          (m[1] =
          /* shouldCastTrue */
            L),
          (N || j(m, 'default')) && s.push(u));
      }
    }
  }
  const f = [a, s];
  return (X(e) && n.set(e, f), f);
}
function Li(e) {
  return e[0] !== '$' && !Jt(e)
    ? !0
    : (process.env.NODE_ENV !== 'production' &&
        x(`Invalid prop name: "${e}" is a reserved property.`),
      !1);
}
function Bc(e) {
  return e === null
    ? 'null'
    : typeof e == 'function'
      ? e.name || ''
      : (typeof e == 'object' && e.constructor && e.constructor.name) || '';
}
function gs(e, t, r) {
  const n = $(t),
    i = r.propsOptions[0],
    o = Object.keys(e).map(a => ve(a));
  for (const a in i) {
    let s = i[a];
    s != null && qc(a, n[a], s, process.env.NODE_ENV !== 'production' ? He(n) : n, !o.includes(a));
  }
}
function qc(e, t, r, n, i) {
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
        const { valid: m, expectedType: C } = zc(t, l[p]);
        (u.push(C || ''), (f = m));
      }
      if (!f) {
        x(Kc(e, t, u));
        return;
      }
    }
    s && !s(t, n) && x('Invalid prop: custom validator check failed for prop "' + e + '".');
  }
}
const Xc = /* @__PURE__ */ Je('String,Number,Boolean,Function,Symbol,BigInt');
function zc(e, t) {
  let r;
  const n = Bc(t);
  if (n === 'null') r = e === null;
  else if (Xc(n)) {
    const i = typeof e;
    ((r = i === n.toLowerCase()), !r && i === 'object' && (r = e instanceof t));
  } else n === 'Object' ? (r = X(e)) : n === 'Array' ? (r = V(e)) : (r = e instanceof t);
  return {
    valid: r,
    expectedType: n,
  };
}
function Kc(e, t, r) {
  if (r.length === 0)
    return `Prop type [] for prop "${e}" won't match anything. Did you mean to use type Array instead?`;
  let n = `Invalid prop: type check failed for prop "${e}". Expected ${r.map(Gr).join(' | ')}`;
  const i = r[0],
    o = Xn(t),
    a = Ri(t, i),
    s = Ri(t, o);
  return (
    r.length === 1 && $i(i) && !Gc(i, o) && (n += ` with value ${a}`),
    (n += `, got ${o} `),
    $i(o) && (n += `with value ${s}.`),
    n
  );
}
function Ri(e, t) {
  return t === 'String' ? `"${e}"` : t === 'Number' ? `${Number(e)}` : `${e}`;
}
function $i(e) {
  return ['string', 'number', 'boolean'].some(r => e.toLowerCase() === r);
}
function Gc(...e) {
  return e.some(t => t.toLowerCase() === 'boolean');
}
const si = e => e === '_' || e === '_ctx' || e === '$stable',
  ai = e => (V(e) ? e.map(Oe) : [Oe(e)]),
  Yc = (e, t, r) => {
    if (t._n) return t;
    const n = tc(
      (...i) => (
        process.env.NODE_ENV !== 'production' &&
          ee &&
          !(r === null && we) &&
          !(r && r.root !== ee.root) &&
          x(
            `Slot "${e}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
          ),
        ai(t(...i))
      ),
      r
    );
    return ((n._c = !1), n);
  },
  ms = (e, t, r) => {
    const n = e._ctx;
    for (const i in e) {
      if (si(i)) continue;
      const o = e[i];
      if (I(o)) t[i] = Yc(i, o, n);
      else if (o != null) {
        process.env.NODE_ENV !== 'production' &&
          x(
            `Non-function value encountered for slot "${i}". Prefer function slots for better performance.`
          );
        const a = ai(o);
        t[i] = () => a;
      }
    }
  },
  vs = (e, t) => {
    process.env.NODE_ENV !== 'production' &&
      !ni(e.vnode) &&
      x(
        'Non-function value encountered for default slot. Prefer function slots for better performance.'
      );
    const r = ai(t);
    e.slots.default = () => r;
  },
  Rn = (e, t, r) => {
    for (const n in t) (r || !si(n)) && (e[n] = t[n]);
  },
  Jc = (e, t, r) => {
    const n = (e.slots = ds());
    if (e.vnode.shapeFlag & 32) {
      const i = t._;
      i ? (Rn(n, t, r), r && Pr(n, '_', i, !0)) : ms(t, n);
    } else t && vs(e, t);
  },
  Zc = (e, t, r) => {
    const { vnode: n, slots: i } = e;
    let o = !0,
      a = q;
    if (n.shapeFlag & 32) {
      const s = t._;
      (s
        ? process.env.NODE_ENV !== 'production' && We
          ? (Rn(i, t, r), Ue(e, 'set', '$slots'))
          : r && s === 1
            ? (o = !1)
            : Rn(i, t, r)
        : ((o = !t.$stable), ms(t, i)),
        (a = t));
    } else t && (vs(e, t), (a = { default: 1 }));
    if (o) for (const s in i) !si(s) && a[s] == null && delete i[s];
  };
let Wt, Ge;
function St(e, t) {
  (e.appContext.config.performance && Hr() && Ge.mark(`vue-${t}-${e.uid}`),
    process.env.NODE_ENV !== 'production' && Za(e, t, Hr() ? Ge.now() : Date.now()));
}
function Ot(e, t) {
  if (e.appContext.config.performance && Hr()) {
    const r = `vue-${t}-${e.uid}`,
      n = r + ':end',
      i = `<${vr(e, e.type)}> ${t}`;
    (Ge.mark(n), Ge.measure(i, r, n), Ge.clearMeasures(i), Ge.clearMarks(r), Ge.clearMarks(n));
  }
  process.env.NODE_ENV !== 'production' && Qa(e, t, Hr() ? Ge.now() : Date.now());
}
function Hr() {
  return (
    Wt !== void 0 ||
      (typeof window < 'u' && window.performance
        ? ((Wt = !0), (Ge = window.performance))
        : (Wt = !1)),
    Wt
  );
}
function Qc() {
  const e = [];
  if (process.env.NODE_ENV !== 'production' && e.length) {
    const t = e.length > 1;
    console.warn(
      `Feature flag${t ? 's' : ''} ${e.join(', ')} ${t ? 'are' : 'is'} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
    );
  }
}
const _e = il;
function el(e) {
  return tl(e);
}
function tl(e, t) {
  Qc();
  const r = fr();
  ((r.__VUE__ = !0),
    process.env.NODE_ENV !== 'production' && ei(r.__VUE_DEVTOOLS_GLOBAL_HOOK__, r));
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
      setScopeId: m = re,
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
      w = process.env.NODE_ENV !== 'production' && We ? !1 : !!h.dynamicChildren
    ) => {
      if (d === h) return;
      (d && !Xt(d, h) && ((y = _r(d)), tt(d, v, b, !0), (d = null)),
        h.patchFlag === -2 && ((w = !1), (h.dynamicChildren = null)));
      const { type: _, ref: A, shapeFlag: O } = h;
      switch (_) {
        case gr:
          L(d, h, g, y);
          break;
        case Te:
          R(d, h, g, y);
          break;
        case kr:
          d == null ? P(h, g, y, S) : process.env.NODE_ENV !== 'production' && D(d, h, g, S);
          break;
        case Ne:
          br(d, h, g, y, v, b, S, E, w);
          break;
        default:
          O & 1
            ? z(d, h, g, y, v, b, S, E, w)
            : O & 6
              ? hi(d, h, g, y, v, b, S, E, w)
              : O & 64 || O & 128
                ? _.process(d, h, g, y, v, b, S, E, w, Ft)
                : process.env.NODE_ENV !== 'production' &&
                  x('Invalid VNode type:', _, `(${typeof _})`);
      }
      A != null && v
        ? er(A, d && d.ref, b, h || d, !h)
        : A == null && d && d.ref != null && er(d.ref, null, b, d, !0);
    },
    L = (d, h, g, y) => {
      if (d == null) n((h.el = s(h.children)), g, y);
      else {
        const v = (h.el = d.el);
        h.children !== d.children && f(v, h.children);
      }
    },
    R = (d, h, g, y) => {
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
          (_ && _._beginPatch(), Xe(d, h, v, b, S, E, w));
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
        O & 8 ? l(w, d.children) : O & 16 && ue(d.children, w, null, y, v, vn(d, b), S, E),
        M && dt(d, null, y, 'created'),
        oe(w, d, d.scopeId, S, y),
        A)
      ) {
        for (const K in A) K !== 'value' && !Jt(K) && o(w, K, null, A[K], b, y);
        ('value' in A && o(w, 'value', null, A.value, b),
          (_ = A.onVnodeBeforeMount) && $e(_, y, d));
      }
      (process.env.NODE_ENV !== 'production' &&
        (Pr(w, '__vnode', d, !0), Pr(w, '__vueParentComponent', y, !0)),
        M && dt(d, null, y, 'beforeMount'));
      const H = rl(v, T);
      (H && T.beforeEnter(w),
        n(w, h, g),
        ((_ = A && A.onVnodeMounted) || H || M) &&
          _e(() => {
            (_ && $e(_, y, d), H && T.enter(w), M && dt(d, null, y, 'mounted'));
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
            (b = oi(b.children) || b),
          h === b || (_s(b.type) && (b.ssContent === h || b.ssFallback === h)))
        ) {
          const S = v.vnode;
          oe(d, S, S.scopeId, S.slotScopeIds, v.parent);
        }
      }
    },
    ue = (d, h, g, y, v, b, S, E, w = 0) => {
      for (let _ = w; _ < d.length; _++) {
        const A = (d[_] = E ? it(d[_]) : Oe(d[_]));
        N(null, A, h, g, y, v, b, S, E);
      }
    },
    Xe = (d, h, g, y, v, b, S) => {
      const E = (h.el = d.el);
      process.env.NODE_ENV !== 'production' && (E.__vnode = h);
      let { patchFlag: w, dynamicChildren: _, dirs: A } = h;
      w |= d.patchFlag & 16;
      const O = d.props || q,
        T = h.props || q;
      let M;
      if (
        (g && ft(g, !1),
        (M = T.onVnodeBeforeUpdate) && $e(M, g, h, d),
        A && dt(h, d, g, 'beforeUpdate'),
        g && ft(g, !0),
        process.env.NODE_ENV !== 'production' && We && ((w = 0), (S = !1), (_ = null)),
        ((O.innerHTML && T.innerHTML == null) || (O.textContent && T.textContent == null)) &&
          l(E, ''),
        _
          ? (Qe(d.dynamicChildren, _, E, g, y, vn(h, v), b),
            process.env.NODE_ENV !== 'production' && Cr(d, h))
          : S || Pe(d, h, E, null, g, y, vn(h, v), b, !1),
        w > 0)
      ) {
        if (w & 16) Se(E, O, T, g, v);
        else if (
          (w & 2 && O.class !== T.class && o(E, 'class', null, T.class, v),
          w & 4 && o(E, 'style', O.style, T.style, v),
          w & 8)
        ) {
          const H = h.dynamicProps;
          for (let K = 0; K < H.length; K++) {
            const B = H[K],
              fe = O[B],
              he = T[B];
            (he !== fe || B === 'value') && o(E, B, fe, he, v, g);
          }
        }
        w & 1 && d.children !== h.children && l(E, h.children);
      } else !S && _ == null && Se(E, O, T, g, v);
      ((M = T.onVnodeUpdated) || A) &&
        _e(() => {
          (M && $e(M, g, h, d), A && dt(h, d, g, 'updated'));
        }, y);
    },
    Qe = (d, h, g, y, v, b, S) => {
      for (let E = 0; E < h.length; E++) {
        const w = d[E],
          _ = h[E],
          A =
            // oldVNode may be an errored async setup() component inside Suspense
            // which will not have a mounted element
            w.el && // - In the case of a Fragment, we need to provide the actual parent
            // of the Fragment itself so it can move its children.
            (w.type === Ne || // - In the case of different nodes, there is going to be a replacement
              // which also requires the correct parent container
              !Xt(w, _) || // - In the case of a component, it could contain anything.
              w.shapeFlag & 198)
              ? u(w.el)
              : // In other cases, the parent container is not actually used so we
                // just pass the block element here to avoid a DOM parentNode call.
                g;
        N(w, _, A, null, y, v, b, S, !0);
      }
    },
    Se = (d, h, g, y, v) => {
      if (h !== g) {
        if (h !== q) for (const b in h) !Jt(b) && !(b in g) && o(d, b, h[b], null, v, y);
        for (const b in g) {
          if (Jt(b)) continue;
          const S = g[b],
            E = h[b];
          S !== E && b !== 'value' && o(d, b, E, S, v, y);
        }
        'value' in g && o(d, 'value', h.value, g.value, v);
      }
    },
    br = (d, h, g, y, v, b, S, E, w) => {
      const _ = (h.el = d ? d.el : s('')),
        A = (h.anchor = d ? d.anchor : s(''));
      let { patchFlag: O, dynamicChildren: T, slotScopeIds: M } = h;
      (process.env.NODE_ENV !== 'production' && // #5523 dev root fragment may inherit directives
        (We || O & 2048) &&
        ((O = 0), (w = !1), (T = null)),
        M && (E = E ? E.concat(M) : M),
        d == null
          ? (n(_, g, y),
            n(A, g, y),
            ue(
              // #10007
              // such fragment like `<></>` will be compiled into
              // a fragment which doesn't have a children.
              // In this case fallback to an empty array
              h.children || [],
              g,
              A,
              v,
              b,
              S,
              E,
              w
            ))
          : O > 0 &&
              O & 64 &&
              T && // #2715 the previous fragment could've been a BAILed one as a result
              // of renderSlot() with no valid children
              d.dynamicChildren
            ? (Qe(d.dynamicChildren, T, g, v, b, S, E),
              process.env.NODE_ENV !== 'production'
                ? Cr(d, h)
                : // #2080 if the stable fragment has a key, it's a <template v-for> that may
                  //  get moved around. Make sure all root level vnodes inherit el.
                  // #2134 or if it's a component root, it may also get moved around
                  // as the component is being moved.
                  (h.key != null || (v && h === v.subTree)) &&
                  Cr(
                    d,
                    h,
                    !0
                    /* shallow */
                  ))
            : Pe(d, h, g, A, v, b, S, E, w));
    },
    hi = (d, h, g, y, v, b, S, E, w) => {
      ((h.slotScopeIds = E),
        d == null
          ? h.shapeFlag & 512
            ? v.ctx.activate(h, g, y, S, w)
            : et(h, g, y, v, b, S, w)
          : de(d, h, w));
    },
    et = (d, h, g, y, v, b, S) => {
      const E = (d.component = fl(d, y, v));
      if (
        (process.env.NODE_ENV !== 'production' && E.type.__hmrId && Wa(E),
        process.env.NODE_ENV !== 'production' && (Nr(d), St(E, 'mount')),
        ni(d) && (E.ctx.renderer = Ft),
        process.env.NODE_ENV !== 'production' && St(E, 'init'),
        pl(E, !1, S),
        process.env.NODE_ENV !== 'production' && Ot(E, 'init'),
        process.env.NODE_ENV !== 'production' && We && (d.el = null),
        E.asyncDep)
      ) {
        if ((v && v.registerDep(E, U, S), !d.el)) {
          const w = (E.subTree = ct(Te));
          (R(null, w, h, g), (d.placeholder = w.el));
        }
      } else U(E, d, h, g, v, b, S);
      process.env.NODE_ENV !== 'production' && (xr(), Ot(E, 'mount'));
    },
    de = (d, h, g) => {
      const y = (h.component = d.component);
      if (Dc(d, h, g))
        if (y.asyncDep && !y.asyncResolved) {
          (process.env.NODE_ENV !== 'production' && Nr(h),
            F(y, h, g),
            process.env.NODE_ENV !== 'production' && xr());
          return;
        } else ((y.next = h), y.update());
      else ((h.el = d.el), (y.vnode = h));
    },
    U = (d, h, g, y, v, b, S) => {
      const E = () => {
        if (d.isMounted) {
          let { next: O, bu: T, u: M, parent: H, vnode: K } = d;
          {
            const Le = bs(d);
            if (Le) {
              (O && ((O.el = K.el), F(d, O, S)),
                Le.asyncDep.then(() => {
                  d.isUnmounted || E();
                }));
              return;
            }
          }
          let B = O,
            fe;
          (process.env.NODE_ENV !== 'production' && Nr(O || d.vnode),
            ft(d, !1),
            O ? ((O.el = K.el), F(d, O, S)) : (O = K),
            T && Ut(T),
            (fe = O.props && O.props.onVnodeBeforeUpdate) && $e(fe, H, O, K),
            ft(d, !0),
            process.env.NODE_ENV !== 'production' && St(d, 'render'));
          const he = Ii(d);
          process.env.NODE_ENV !== 'production' && Ot(d, 'render');
          const Me = d.subTree;
          ((d.subTree = he),
            process.env.NODE_ENV !== 'production' && St(d, 'patch'),
            N(
              Me,
              he,
              // parent may have changed if it's in a teleport
              u(Me.el),
              // anchor may have changed if it's in a fragment
              _r(Me),
              d,
              v,
              b
            ),
            process.env.NODE_ENV !== 'production' && Ot(d, 'patch'),
            (O.el = he.el),
            B === null && Fc(d, he.el),
            M && _e(M, v),
            (fe = O.props && O.props.onVnodeUpdated) && _e(() => $e(fe, H, O, K), v),
            process.env.NODE_ENV !== 'production' && Ko(d),
            process.env.NODE_ENV !== 'production' && xr());
        } else {
          let O;
          const { el: T, props: M } = h,
            { bm: H, m: K, parent: B, root: fe, type: he } = d,
            Me = tr(h);
          (ft(d, !1), H && Ut(H), !Me && (O = M && M.onVnodeBeforeMount) && $e(O, B, h), ft(d, !0));
          {
            (fe.ce && // @ts-expect-error _def is private
              fe.ce._def.shadowRoot !== !1 &&
              fe.ce._injectChildStyle(he),
              process.env.NODE_ENV !== 'production' && St(d, 'render'));
            const Le = (d.subTree = Ii(d));
            (process.env.NODE_ENV !== 'production' && Ot(d, 'render'),
              process.env.NODE_ENV !== 'production' && St(d, 'patch'),
              N(null, Le, g, y, d, v, b),
              process.env.NODE_ENV !== 'production' && Ot(d, 'patch'),
              (h.el = Le.el));
          }
          if ((K && _e(K, v), !Me && (O = M && M.onVnodeMounted))) {
            const Le = h;
            _e(() => $e(O, B, Le), v);
          }
          ((h.shapeFlag & 256 || (B && tr(B.vnode) && B.vnode.shapeFlag & 256)) &&
            d.a &&
            _e(d.a, v),
            (d.isMounted = !0),
            process.env.NODE_ENV !== 'production' && Ga(d),
            (h = g = y = null));
        }
      };
      d.scope.on();
      const w = (d.effect = new wo(E));
      d.scope.off();
      const _ = (d.update = w.run.bind(w)),
        A = (d.job = w.runIfDirty.bind(w));
      ((A.i = d),
        (A.id = d.uid),
        (w.scheduler = () => Qr(A)),
        ft(d, !0),
        process.env.NODE_ENV !== 'production' &&
          ((w.onTrack = d.rtc ? O => Ut(d.rtc, O) : void 0),
          (w.onTrigger = d.rtg ? O => Ut(d.rtg, O) : void 0)),
        _());
    },
    F = (d, h, g) => {
      h.component = d;
      const y = d.vnode.props;
      ((d.vnode = h),
        (d.next = null),
        Hc(d, h.props, y, g),
        Zc(d, h.children, g),
        Ae(),
        Ni(d),
        Ie());
    },
    Pe = (d, h, g, y, v, b, S, E, w = !1) => {
      const _ = d && d.children,
        A = d ? d.shapeFlag : 0,
        O = h.children,
        { patchFlag: T, shapeFlag: M } = h;
      if (T > 0) {
        if (T & 128) {
          $t(_, O, g, y, v, b, S, E, w);
          return;
        } else if (T & 256) {
          sn(_, O, g, y, v, b, S, E, w);
          return;
        }
      }
      M & 8
        ? (A & 16 && Dt(_, v, b), O !== _ && l(g, O))
        : A & 16
          ? M & 16
            ? $t(_, O, g, y, v, b, S, E, w)
            : Dt(_, v, b, !0)
          : (A & 8 && l(g, ''), M & 16 && ue(O, g, y, v, b, S, E, w));
    },
    sn = (d, h, g, y, v, b, S, E, w) => {
      ((d = d || kt), (h = h || kt));
      const _ = d.length,
        A = h.length,
        O = Math.min(_, A);
      let T;
      for (T = 0; T < O; T++) {
        const M = (h[T] = w ? it(h[T]) : Oe(h[T]));
        N(d[T], M, g, null, v, b, S, E, w);
      }
      _ > A ? Dt(d, v, b, !0, !1, O) : ue(h, g, y, v, b, S, E, w, O);
    },
    $t = (d, h, g, y, v, b, S, E, w) => {
      let _ = 0;
      const A = h.length;
      let O = d.length - 1,
        T = A - 1;
      for (; _ <= O && _ <= T; ) {
        const M = d[_],
          H = (h[_] = w ? it(h[_]) : Oe(h[_]));
        if (Xt(M, H)) N(M, H, g, null, v, b, S, E, w);
        else break;
        _++;
      }
      for (; _ <= O && _ <= T; ) {
        const M = d[O],
          H = (h[T] = w ? it(h[T]) : Oe(h[T]));
        if (Xt(M, H)) N(M, H, g, null, v, b, S, E, w);
        else break;
        (O--, T--);
      }
      if (_ > O) {
        if (_ <= T) {
          const M = T + 1,
            H = M < A ? h[M].el : y;
          for (; _ <= T; ) (N(null, (h[_] = w ? it(h[_]) : Oe(h[_])), g, H, v, b, S, E, w), _++);
        }
      } else if (_ > T) for (; _ <= O; ) (tt(d[_], v, b, !0), _++);
      else {
        const M = _,
          H = _,
          K = /* @__PURE__ */ new Map();
        for (_ = H; _ <= T; _++) {
          const se = (h[_] = w ? it(h[_]) : Oe(h[_]));
          se.key != null &&
            (process.env.NODE_ENV !== 'production' &&
              K.has(se.key) &&
              x(
                'Duplicate keys found during update:',
                JSON.stringify(se.key),
                'Make sure keys are unique.'
              ),
            K.set(se.key, _));
        }
        let B,
          fe = 0;
        const he = T - H + 1;
        let Me = !1,
          Le = 0;
        const jt = new Array(he);
        for (_ = 0; _ < he; _++) jt[_] = 0;
        for (_ = M; _ <= O; _++) {
          const se = d[_];
          if (fe >= he) {
            tt(se, v, b, !0);
            continue;
          }
          let Re;
          if (se.key != null) Re = K.get(se.key);
          else
            for (B = H; B <= T; B++)
              if (jt[B - H] === 0 && Xt(se, h[B])) {
                Re = B;
                break;
              }
          Re === void 0
            ? tt(se, v, b, !0)
            : ((jt[Re - H] = _ + 1),
              Re >= Le ? (Le = Re) : (Me = !0),
              N(se, h[Re], g, null, v, b, S, E, w),
              fe++);
        }
        const gi = Me ? nl(jt) : kt;
        for (B = gi.length - 1, _ = he - 1; _ >= 0; _--) {
          const se = H + _,
            Re = h[se],
            mi = h[se + 1],
            vi =
              se + 1 < A
                ? // #13559, fallback to el placeholder for unresolved async component
                  mi.el || mi.placeholder
                : y;
          jt[_] === 0
            ? N(null, Re, g, vi, v, b, S, E, w)
            : Me && (B < 0 || _ !== gi[B] ? Nt(Re, g, vi, 2) : B--);
        }
      }
    },
    Nt = (d, h, g, y, v = null) => {
      const { el: b, type: S, transition: E, children: w, shapeFlag: _ } = d;
      if (_ & 6) {
        Nt(d.component.subTree, h, g, y);
        return;
      }
      if (_ & 128) {
        d.suspense.move(h, g, y);
        return;
      }
      if (_ & 64) {
        S.move(d, h, g, Ft);
        return;
      }
      if (S === Ne) {
        n(b, h, g);
        for (let O = 0; O < w.length; O++) Nt(w[O], h, g, y);
        n(d.anchor, h, g);
        return;
      }
      if (S === kr) {
        Z(d, h, g);
        return;
      }
      if (y !== 2 && _ & 1 && E)
        if (y === 0) (E.beforeEnter(b), n(b, h, g), _e(() => E.enter(b), v));
        else {
          const { leave: O, delayLeave: T, afterLeave: M } = E,
            H = () => {
              d.ctx.isUnmounted ? i(b) : n(b, h, g);
            },
            K = () => {
              (b._isLeaving &&
                b[ic](
                  !0
                  /* cancelled */
                ),
                O(b, () => {
                  (H(), M && M());
                }));
            };
          T ? T(b, H, K) : K();
        }
      else n(b, h, g);
    },
    tt = (d, h, g, y = !1, v = !1) => {
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
        E != null && (Ae(), er(E, null, g, d, !0), Ie()),
        M != null && (h.renderCache[M] = void 0),
        A & 256)
      ) {
        h.ctx.deactivate(d);
        return;
      }
      const H = A & 1 && T,
        K = !tr(d);
      let B;
      if ((K && (B = S && S.onVnodeBeforeUnmount) && $e(B, h, d), A & 6)) qs(d.component, g, y);
      else {
        if (A & 128) {
          d.suspense.unmount(g, y);
          return;
        }
        (H && dt(d, null, h, 'beforeUnmount'),
          A & 64
            ? d.type.remove(d, h, g, Ft, y)
            : _ && // #5154
                // when v-once is used inside a block, setBlockTracking(-1) marks the
                // parent block with hasOnce: true
                // so that it doesn't take the fast path during unmount - otherwise
                // components nested in v-once are never unmounted.
                !_.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
                (b !== Ne || (O > 0 && O & 64))
              ? Dt(_, h, g, !1, !0)
              : ((b === Ne && O & 384) || (!v && A & 16)) && Dt(w, h, g),
          y && an(d));
      }
      ((K && (B = S && S.onVnodeUnmounted)) || H) &&
        _e(() => {
          (B && $e(B, h, d), H && dt(d, null, h, 'unmounted'));
        }, g);
    },
    an = d => {
      const { type: h, el: g, anchor: y, transition: v } = d;
      if (h === Ne) {
        process.env.NODE_ENV !== 'production' &&
        d.patchFlag > 0 &&
        d.patchFlag & 2048 &&
        v &&
        !v.persisted
          ? d.children.forEach(S => {
              S.type === Te ? i(S.el) : an(S);
            })
          : Bs(g, y);
        return;
      }
      if (h === kr) {
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
    Bs = (d, h) => {
      let g;
      for (; d !== h; ) ((g = p(d)), i(d), (d = g));
      i(h);
    },
    qs = (d, h, g) => {
      process.env.NODE_ENV !== 'production' && d.type.__hmrId && Ba(d);
      const { bum: y, scope: v, job: b, subTree: S, um: E, m: w, a: _ } = d;
      (Di(w),
        Di(_),
        y && Ut(y),
        v.stop(),
        b && ((b.flags |= 8), tt(S, d, h, g)),
        E && _e(E, h),
        _e(() => {
          d.isUnmounted = !0;
        }, h),
        process.env.NODE_ENV !== 'production' && Ja(d));
    },
    Dt = (d, h, g, y = !1, v = !1, b = 0) => {
      for (let S = b; S < d.length; S++) tt(d[S], h, g, y, v);
    },
    _r = d => {
      if (d.shapeFlag & 6) return _r(d.component.subTree);
      if (d.shapeFlag & 128) return d.suspense.next();
      const h = p(d.anchor || d.el),
        g = h && h[rc];
      return g ? p(g) : h;
    };
  let cn = !1;
  const pi = (d, h, g) => {
      (d == null
        ? h._vnode && tt(h._vnode, null, null, !0)
        : N(h._vnode || null, d, h, null, null, null, g),
        (h._vnode = d),
        cn || ((cn = !0), Ni(), qo(), (cn = !1)));
    },
    Ft = {
      p: N,
      um: tt,
      m: Nt,
      r: an,
      mt: et,
      mc: ue,
      pc: Pe,
      pbc: Qe,
      n: _r,
      o: e,
    };
  return {
    render: pi,
    hydrate: void 0,
    createApp: kc(pi),
  };
}
function vn({ type: e, props: t }, r) {
  return (r === 'svg' && e === 'foreignObject') ||
    (r === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html'))
    ? void 0
    : r;
}
function ft({ effect: e, job: t }, r) {
  r ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function rl(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function Cr(e, t, r = !1) {
  const n = e.children,
    i = t.children;
  if (V(n) && V(i))
    for (let o = 0; o < n.length; o++) {
      const a = n[o];
      let s = i[o];
      (s.shapeFlag & 1 &&
        !s.dynamicChildren &&
        ((s.patchFlag <= 0 || s.patchFlag === 32) && ((s = i[o] = it(i[o])), (s.el = a.el)),
        !r && s.patchFlag !== -2 && Cr(a, s)),
        s.type === gr && // avoid cached text nodes retaining detached dom nodes
          s.patchFlag !== -1 &&
          (s.el = a.el),
        s.type === Te && !s.el && (s.el = a.el),
        process.env.NODE_ENV !== 'production' && s.el && (s.el.__vnode = s));
    }
}
function nl(e) {
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
function bs(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : bs(t);
}
function Di(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
const _s = e => e.__isSuspense;
function il(e, t) {
  t && t.pendingBranch ? (V(e) ? t.effects.push(...e) : t.effects.push(e)) : Bo(e);
}
const Ne = /* @__PURE__ */ Symbol.for('v-fgt'),
  gr = /* @__PURE__ */ Symbol.for('v-txt'),
  Te = /* @__PURE__ */ Symbol.for('v-cmt'),
  kr = /* @__PURE__ */ Symbol.for('v-stc'),
  rr = [];
let Ee = null;
function Bt(e = !1) {
  rr.push((Ee = e ? null : []));
}
function ol() {
  (rr.pop(), (Ee = rr[rr.length - 1] || null));
}
let cr = 1;
function Fi(e, t = !1) {
  ((cr += e), e < 0 && Ee && t && (Ee.hasOnce = !0));
}
function sl(e) {
  return ((e.dynamicChildren = cr > 0 ? Ee || kt : null), ol(), cr > 0 && Ee && Ee.push(e), e);
}
function qt(e, t, r, n, i, o) {
  return sl(Fe(e, t, r, n, i, o, !0));
}
function rn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Xt(e, t) {
  if (process.env.NODE_ENV !== 'production' && t.shapeFlag & 6 && e.component) {
    const r = Sr.get(t.type);
    if (r && r.has(e.component)) return ((e.shapeFlag &= -257), (t.shapeFlag &= -513), !1);
  }
  return e.type === t.type && e.key === t.key;
}
const al = (...e) => ws(...e),
  ys = ({ key: e }) => e ?? null,
  Tr = ({ ref: e, ref_key: t, ref_for: r }) => (
    typeof e == 'number' && (e = '' + e),
    e != null ? (Y(e) || ne(e) || I(e) ? { i: we, r: e, k: t, f: !!r } : e) : null
  );
function Fe(e, t = null, r = null, n = 0, i = null, o = e === Ne ? 0 : 1, a = !1, s = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ys(t),
    ref: t && Tr(t),
    scopeId: Yo,
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
    s ? (ci(c, r), o & 128 && e.normalize(c)) : r && (c.shapeFlag |= Y(r) ? 8 : 16),
    process.env.NODE_ENV !== 'production' &&
      c.key !== c.key &&
      x('VNode created with invalid key (NaN). VNode type:', c.type),
    cr > 0 && // avoid a block node from tracking itself
      !a && // has current parent block
      Ee && // presence of a patch flag indicates this node needs patching on updates.
      // component nodes also should always be patched, because even if the
      // component doesn't need to update, it needs to persist the instance on to
      // the next vnode so that it can be properly unmounted later.
      (c.patchFlag > 0 || o & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
      // vnode should not be considered dynamic due to handler caching.
      c.patchFlag !== 32 &&
      Ee.push(c),
    c
  );
}
const ct = process.env.NODE_ENV !== 'production' ? al : ws;
function ws(e, t = null, r = null, n = 0, i = null, o = !1) {
  if (
    ((!e || e === vc) &&
      (process.env.NODE_ENV !== 'production' &&
        !e &&
        x(`Invalid vnode type when creating vnode: ${e}.`),
      (e = Te)),
    rn(e))
  ) {
    const s = lt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return (
      r && ci(s, r),
      cr > 0 && !o && Ee && (s.shapeFlag & 6 ? (Ee[Ee.indexOf(e)] = s) : Ee.push(s)),
      (s.patchFlag = -2),
      s
    );
  }
  if ((ks(e) && (e = e.__vccOpts), t)) {
    t = cl(t);
    let { class: s, style: c } = t;
    (s && !Y(s) && (t.class = Tt(s)),
      X(c) && (Mr(c) && !V(c) && (c = G({}, c)), (t.style = Kn(c))));
  }
  const a = Y(e) ? 1 : _s(e) ? 128 : nc(e) ? 64 : X(e) ? 4 : I(e) ? 2 : 0;
  return (
    process.env.NODE_ENV !== 'production' &&
      a & 4 &&
      Mr(e) &&
      ((e = $(e)),
      x(
        'Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.',
        `
Component that was made reactive: `,
        e
      )),
    Fe(e, t, r, n, i, a, o, !0)
  );
}
function cl(e) {
  return e ? (Mr(e) || fs(e) ? G({}, e) : e) : null;
}
function lt(e, t, r = !1, n = !1) {
  const { props: i, ref: o, patchFlag: a, children: s, transition: c } = e,
    f = t ? Ns(i || {}, t) : i,
    l = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: f,
      key: f && ys(f),
      ref:
        t && t.ref
          ? // #2078 in the case of <component :is="vnode" ref="extra"/>
            // if the vnode itself already has a ref, cloneVNode will need to merge
            // the refs so the single vnode can be set on multiple refs
            r && o
            ? V(o)
              ? o.concat(Tr(t))
              : [o, Tr(t)]
            : Tr(t)
          : o,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: process.env.NODE_ENV !== 'production' && a === -1 && V(s) ? s.map(Es) : s,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: t && e.type !== Ne ? (a === -1 ? 16 : a | 16) : a,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: c,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && lt(e.ssContent),
      ssFallback: e.ssFallback && lt(e.ssFallback),
      placeholder: e.placeholder,
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce,
    };
  return (c && n && ri(l, c.clone(l)), l);
}
function Es(e) {
  const t = lt(e);
  return (V(e.children) && (t.children = e.children.map(Es)), t);
}
function ll(e = ' ', t = 0) {
  return ct(gr, null, e, t);
}
function Oe(e) {
  return e == null || typeof e == 'boolean'
    ? ct(Te)
    : V(e)
      ? ct(
          Ne,
          null,
          // #3666, avoid reference pollution when reusing vnode
          e.slice()
        )
      : rn(e)
        ? it(e)
        : ct(gr, null, String(e));
}
function it(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : lt(e);
}
function ci(e, t) {
  let r = 0;
  const { shapeFlag: n } = e;
  if (t == null) t = null;
  else if (V(t)) r = 16;
  else if (typeof t == 'object')
    if (n & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), ci(e, i()), i._c && (i._d = !0));
      return;
    } else {
      r = 32;
      const i = t._;
      !i && !fs(t)
        ? (t._ctx = we)
        : i === 3 && we && (we.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    I(t)
      ? ((t = { default: t, _ctx: we }), (r = 32))
      : ((t = String(t)), n & 64 ? ((r = 16), (t = [ll(t)])) : (r = 8));
  ((e.children = t), (e.shapeFlag |= r));
}
function Ns(...e) {
  const t = {};
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    for (const i in n)
      if (i === 'class') t.class !== n.class && (t.class = Tt([t.class, n.class]));
      else if (i === 'style') t.style = Kn([t.style, n.style]);
      else if (dr(i)) {
        const o = t[i],
          a = n[i];
        a && o !== a && !(V(o) && o.includes(a)) && (t[i] = o ? [].concat(o, a) : a);
      } else i !== '' && (t[i] = n[i]);
  }
  return t;
}
function $e(e, t, r, n = null) {
  qe(e, t, 7, [r, n]);
}
const ul = os();
let dl = 0;
function fl(e, t, r) {
  const n = e.type,
    i = (t ? t.appContext : e.appContext) || ul,
    o = {
      uid: dl++,
      vnode: e,
      type: n,
      parent: t,
      appContext: i,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new la(
        !0
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(i.provides),
      ids: t ? t.ids : ['', 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: ps(n, i),
      emitsOptions: cs(n, i),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: q,
      // inheritAttrs
      inheritAttrs: n.inheritAttrs,
      // state
      ctx: q,
      data: q,
      props: q,
      attrs: q,
      slots: q,
      refs: q,
      setupState: q,
      setupContext: null,
      // suspense related
      suspense: r,
      suspenseId: r ? r.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      // lifecycle hooks
      // not using enums here because it results in computed properties
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
    process.env.NODE_ENV !== 'production' ? (o.ctx = bc(o)) : (o.ctx = { _: o }),
    (o.root = t ? t.root : o),
    (o.emit = Mc.bind(null, o)),
    e.ce && e.ce(o),
    o
  );
}
let ee = null;
const xs = () => ee || we;
let Wr, $n;
{
  const e = fr(),
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
  ((Wr = t('__VUE_INSTANCE_SETTERS__', r => (ee = r))),
    ($n = t('__VUE_SSR_SETTERS__', r => (lr = r))));
}
const mr = e => {
    const t = ee;
    return (
      Wr(e),
      e.scope.on(),
      () => {
        (e.scope.off(), Wr(t));
      }
    );
  },
  ji = () => {
    (ee && ee.scope.off(), Wr(null));
  },
  hl = /* @__PURE__ */ Je('slot,component');
function Dn(e, { isNativeTag: t }) {
  (hl(e) || t(e)) && x('Do not use built-in or reserved HTML elements as component id: ' + e);
}
function Ss(e) {
  return e.vnode.shapeFlag & 4;
}
let lr = !1;
function pl(e, t = !1, r = !1) {
  t && $n(t);
  const { props: n, children: i } = e.vnode,
    o = Ss(e);
  (jc(e, n, o, t), Jc(e, i, r || t));
  const a = o ? gl(e, t) : void 0;
  return (t && $n(!1), a);
}
function gl(e, t) {
  const r = e.type;
  if (process.env.NODE_ENV !== 'production') {
    if ((r.name && Dn(r.name, e.appContext.config), r.components)) {
      const i = Object.keys(r.components);
      for (let o = 0; o < i.length; o++) Dn(i[o], e.appContext.config);
    }
    if (r.directives) {
      const i = Object.keys(r.directives);
      for (let o = 0; o < i.length; o++) Jo(i[o]);
    }
    r.compilerOptions &&
      ml() &&
      x(
        '"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.'
      );
  }
  ((e.accessCache = /* @__PURE__ */ Object.create(null)),
    (e.proxy = new Proxy(e.ctx, rs)),
    process.env.NODE_ENV !== 'production' && _c(e));
  const { setup: n } = r;
  if (n) {
    Ae();
    const i = (e.setupContext = n.length > 1 ? bl(e) : null),
      o = mr(e),
      a = Rt(n, e, 0, [process.env.NODE_ENV !== 'production' ? He(e.props) : e.props, i]),
      s = qn(a);
    if ((Ie(), o(), (s || e.sp) && !tr(e) && Qo(e), s)) {
      if ((a.then(ji, ji), t))
        return a
          .then(c => {
            Ui(e, c, t);
          })
          .catch(c => {
            hr(c, e, 0);
          });
      if (((e.asyncDep = a), process.env.NODE_ENV !== 'production' && !e.suspense)) {
        const c = vr(e, r);
        x(
          `Component <${c}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
        );
      }
    } else Ui(e, a, t);
  } else Os(e, t);
}
function Ui(e, t, r) {
  (I(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : X(t)
      ? (process.env.NODE_ENV !== 'production' &&
          rn(t) &&
          x('setup() should not return VNodes directly - return a render function instead.'),
        process.env.NODE_ENV !== 'production' && (e.devtoolsRawSetupState = t),
        (e.setupState = Fo(t)),
        process.env.NODE_ENV !== 'production' && yc(e))
      : process.env.NODE_ENV !== 'production' &&
        t !== void 0 &&
        x(`setup() should return an object. Received: ${t === null ? 'null' : typeof t}`),
    Os(e, r));
}
const ml = () => !0;
function Os(e, t, r) {
  const n = e.type;
  e.render || (e.render = n.render || re);
  {
    const i = mr(e);
    Ae();
    try {
      Ec(e);
    } finally {
      (Ie(), i());
    }
  }
  process.env.NODE_ENV !== 'production' &&
    !n.render &&
    e.render === re &&
    !t &&
    (n.template
      ? x(
          'Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".'
        )
      : x('Component is missing template or render function: ', n));
}
const Hi =
  process.env.NODE_ENV !== 'production'
    ? {
        get(e, t) {
          return (Ur(), te(e, 'get', ''), e[t]);
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
          return (te(e, 'get', ''), e[t]);
        },
      };
function vl(e) {
  return new Proxy(e.slots, {
    get(t, r) {
      return (te(e, 'get', '$slots'), t[r]);
    },
  });
}
function bl(e) {
  const t = r => {
    if (
      process.env.NODE_ENV !== 'production' &&
      (e.exposed && x('expose() should be called only once per setup().'), r != null)
    ) {
      let n = typeof r;
      (n === 'object' && (V(r) ? (n = 'array') : ne(r) && (n = 'ref')),
        n !== 'object' && x(`expose() should be passed a plain object, received ${n}.`));
    }
    e.exposed = r || {};
  };
  if (process.env.NODE_ENV !== 'production') {
    let r, n;
    return Object.freeze({
      get attrs() {
        return r || (r = new Proxy(e.attrs, Hi));
      },
      get slots() {
        return n || (n = vl(e));
      },
      get emit() {
        return (i, ...o) => e.emit(i, ...o);
      },
      expose: t,
    });
  } else
    return {
      attrs: new Proxy(e.attrs, Hi),
      slots: e.slots,
      emit: e.emit,
      expose: t,
    };
}
function li(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(Fo(Va(e.exposed)), {
          get(t, r) {
            if (r in t) return t[r];
            if (r in wt) return wt[r](e);
          },
          has(t, r) {
            return r in t || r in wt;
          },
        }))
    : e.proxy;
}
const _l = /(?:^|[-_])\w/g,
  yl = e => e.replace(_l, t => t.toUpperCase()).replace(/[-_]/g, '');
function Cs(e, t = !0) {
  return I(e) ? e.displayName || e.name : e.name || (t && e.__name);
}
function vr(e, t, r = !1) {
  let n = Cs(t);
  if (!n && t.__file) {
    const i = t.__file.match(/([^/\\]+)\.\w+$/);
    i && (n = i[1]);
  }
  if (!n && e) {
    const i = o => {
      for (const a in o) if (o[a] === t) return a;
    };
    n = i(e.components) || (e.parent && i(e.parent.type.components)) || i(e.appContext.components);
  }
  return n ? yl(n) : r ? 'App' : 'Anonymous';
}
function ks(e) {
  return I(e) && '__vccOpts' in e;
}
const Vr = (e, t) => {
  const r = Pa(e, t, lr);
  if (process.env.NODE_ENV !== 'production') {
    const n = xs();
    n && n.appContext.config.warnRecursiveComputed && (r._warnRecursive = !0);
  }
  return r;
};
function wl() {
  if (process.env.NODE_ENV === 'production' || typeof window > 'u') return;
  const e = { style: 'color:#3ba776' },
    t = { style: 'color:#1677ff' },
    r = { style: 'color:#f5222d' },
    n = { style: 'color:#eb2f96' },
    i = {
      __vue_custom_formatter: !0,
      header(u) {
        if (!X(u)) return null;
        if (u.__isVue) return ['div', e, 'VueInstance'];
        if (ne(u)) {
          Ae();
          const p = u.value;
          return (Ie(), ['div', {}, ['span', e, l(u)], '<', s(p), '>']);
        } else {
          if (at(u))
            return [
              'div',
              {},
              ['span', e, be(u) ? 'ShallowReactive' : 'Reactive'],
              '<',
              s(u),
              `>${Be(u) ? ' (readonly)' : ''}`,
            ];
          if (Be(u))
            return ['div', {}, ['span', e, be(u) ? 'ShallowReadonly' : 'Readonly'], '<', s(u), '>'];
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
    (u.type.props && u.props && p.push(a('props', $(u.props))),
      u.setupState !== q && p.push(a('setup', u.setupState)),
      u.data !== q && p.push(a('data', $(u.data))));
    const m = c(u, 'computed');
    m && p.push(a('computed', m));
    const C = c(u, 'inject');
    return (
      C && p.push(a('injected', C)),
      p.push([
        'div',
        {},
        [
          'span',
          {
            style: n.style + ';opacity:0.66',
          },
          '$ (internal): ',
        ],
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
            [
              'div',
              {
                style: 'color:#476582',
              },
              u,
            ],
            [
              'div',
              {
                style: 'padding-left:1.25em',
              },
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
          : X(u)
            ? ['object', { object: p ? $(u) : u }]
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
      (X(C) && p in C) ||
      (u.extends && f(u.extends, p, m)) ||
      (u.mixins && u.mixins.some(N => f(N, p, m)))
    )
      return !0;
  }
  function l(u) {
    return be(u) ? 'ShallowRef' : u.effect ? 'ComputedRef' : 'Ref';
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(i) : (window.devtoolsFormatters = [i]);
}
const Wi = '3.5.25',
  xe = process.env.NODE_ENV !== 'production' ? x : re;
process.env.NODE_ENV;
process.env.NODE_ENV;
let Fn;
const Bi = typeof window < 'u' && window.trustedTypes;
if (Bi)
  try {
    Fn = /* @__PURE__ */ Bi.createPolicy('vue', {
      createHTML: e => e,
    });
  } catch (e) {
    process.env.NODE_ENV !== 'production' && xe(`Error creating trusted types policy: ${e}`);
  }
const Ts = Fn ? e => Fn.createHTML(e) : e => e,
  El = 'http://www.w3.org/2000/svg',
  Nl = 'http://www.w3.org/1998/Math/MathML',
  Ke = typeof document < 'u' ? document : null,
  qi = Ke && /* @__PURE__ */ Ke.createElement('template'),
  xl = {
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
          ? Ke.createElementNS(El, e)
          : t === 'mathml'
            ? Ke.createElementNS(Nl, e)
            : r
              ? Ke.createElement(e, { is: r })
              : Ke.createElement(e);
      return (
        e === 'select' && n && n.multiple != null && i.setAttribute('multiple', n.multiple),
        i
      );
    },
    createText: e => Ke.createTextNode(e),
    createComment: e => Ke.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: e => e.parentNode,
    nextSibling: e => e.nextSibling,
    querySelector: e => Ke.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, '');
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(e, t, r, n, i, o) {
      const a = r ? r.previousSibling : t.lastChild;
      if (i && (i === o || i.nextSibling))
        for (; t.insertBefore(i.cloneNode(!0), r), !(i === o || !(i = i.nextSibling)); );
      else {
        qi.innerHTML = Ts(
          n === 'svg' ? `<svg>${e}</svg>` : n === 'mathml' ? `<math>${e}</math>` : e
        );
        const s = qi.content;
        if (n === 'svg' || n === 'mathml') {
          const c = s.firstChild;
          for (; c.firstChild; ) s.appendChild(c.firstChild);
          s.removeChild(c);
        }
        t.insertBefore(s, r);
      }
      return [
        // first
        a ? a.nextSibling : t.firstChild,
        // last
        r ? r.previousSibling : t.lastChild,
      ];
    },
  },
  Sl = /* @__PURE__ */ Symbol('_vtc');
function Ol(e, t, r) {
  const n = e[Sl];
  (n && (t = (t ? [t, ...n] : [...n]).join(' ')),
    t == null ? e.removeAttribute('class') : r ? e.setAttribute('class', t) : (e.className = t));
}
const Xi = /* @__PURE__ */ Symbol('_vod'),
  Cl = /* @__PURE__ */ Symbol('_vsh'),
  kl = /* @__PURE__ */ Symbol(process.env.NODE_ENV !== 'production' ? 'CSS_VAR_TEXT' : ''),
  Tl = /(?:^|;)\s*display\s*:/;
function Vl(e, t, r) {
  const n = e.style,
    i = Y(r);
  let o = !1;
  if (r && !i) {
    if (t)
      if (Y(t))
        for (const a of t.split(';')) {
          const s = a.slice(0, a.indexOf(':')).trim();
          r[s] == null && Ar(n, s, '');
        }
      else for (const a in t) r[a] == null && Ar(n, a, '');
    for (const a in r) (a === 'display' && (o = !0), Ar(n, a, r[a]));
  } else if (i) {
    if (t !== r) {
      const a = n[kl];
      (a && (r += ';' + a), (n.cssText = r), (o = Tl.test(r)));
    }
  } else t && e.removeAttribute('style');
  Xi in e && ((e[Xi] = o ? n.display : ''), e[Cl] && (n.display = 'none'));
}
const Al = /[^\\];\s*$/,
  zi = /\s*!important$/;
function Ar(e, t, r) {
  if (V(r)) r.forEach(n => Ar(e, t, n));
  else if (
    (r == null && (r = ''),
    process.env.NODE_ENV !== 'production' &&
      Al.test(r) &&
      xe(`Unexpected semicolon at the end of '${t}' style value: '${r}'`),
    t.startsWith('--'))
  )
    e.setProperty(t, r);
  else {
    const n = Il(e, t);
    zi.test(r) ? e.setProperty(ye(n), r.replace(zi, ''), 'important') : (e[n] = r);
  }
}
const Ki = ['Webkit', 'Moz', 'ms'],
  bn = {};
function Il(e, t) {
  const r = bn[t];
  if (r) return r;
  let n = ve(t);
  if (n !== 'filter' && n in e) return (bn[t] = n);
  n = Gr(n);
  for (let i = 0; i < Ki.length; i++) {
    const o = Ki[i] + n;
    if (o in e) return (bn[t] = o);
  }
  return t;
}
const Gi = 'http://www.w3.org/1999/xlink';
function Yi(e, t, r, n, i, o = ca(t)) {
  n && t.startsWith('xlink:')
    ? r == null
      ? e.removeAttributeNS(Gi, t.slice(6, t.length))
      : e.setAttributeNS(Gi, t, r)
    : r == null || (o && !vo(r))
      ? e.removeAttribute(t)
      : e.setAttribute(t, o ? '' : ut(r) ? String(r) : r);
}
function Ji(e, t, r, n, i) {
  if (t === 'innerHTML' || t === 'textContent') {
    r != null && (e[t] = t === 'innerHTML' ? Ts(r) : r);
    return;
  }
  const o = e.tagName;
  if (
    t === 'value' &&
    o !== 'PROGRESS' && // custom elements may use _value internally
    !o.includes('-')
  ) {
    const s = o === 'OPTION' ? e.getAttribute('value') || '' : e.value,
      c =
        r == null
          ? // #11647: value should be set as empty string for null and undefined,
            // but <input type="checkbox"> should be set as 'on'.
            e.type === 'checkbox'
            ? 'on'
            : ''
          : String(r);
    ((s !== c || !('_value' in e)) && (e.value = c),
      r == null && e.removeAttribute(t),
      (e._value = r));
    return;
  }
  let a = !1;
  if (r === '' || r == null) {
    const s = typeof e[t];
    s === 'boolean'
      ? (r = vo(r))
      : r == null && s === 'string'
        ? ((r = ''), (a = !0))
        : s === 'number' && ((r = 0), (a = !0));
  }
  try {
    e[t] = r;
  } catch (s) {
    process.env.NODE_ENV !== 'production' &&
      !a &&
      xe(`Failed setting prop "${t}" on <${o.toLowerCase()}>: value ${r} is invalid.`, s);
  }
  a && e.removeAttribute(i || t);
}
function Pl(e, t, r, n) {
  e.addEventListener(t, r, n);
}
function Ml(e, t, r, n) {
  e.removeEventListener(t, r, n);
}
const Zi = /* @__PURE__ */ Symbol('_vei');
function Ll(e, t, r, n, i = null) {
  const o = e[Zi] || (e[Zi] = {}),
    a = o[t];
  if (n && a) a.value = process.env.NODE_ENV !== 'production' ? eo(n, t) : n;
  else {
    const [s, c] = Rl(t);
    if (n) {
      const f = (o[t] = Fl(process.env.NODE_ENV !== 'production' ? eo(n, t) : n, i));
      Pl(e, s, f, c);
    } else a && (Ml(e, s, a, c), (o[t] = void 0));
  }
}
const Qi = /(?:Once|Passive|Capture)$/;
function Rl(e) {
  let t;
  if (Qi.test(e)) {
    t = {};
    let n;
    for (; (n = e.match(Qi)); )
      ((e = e.slice(0, e.length - n[0].length)), (t[n[0].toLowerCase()] = !0));
  }
  return [e[2] === ':' ? e.slice(3) : ye(e.slice(2)), t];
}
let _n = 0;
const $l = /* @__PURE__ */ Promise.resolve(),
  Dl = () => _n || ($l.then(() => (_n = 0)), (_n = Date.now()));
function Fl(e, t) {
  const r = n => {
    if (!n._vts) n._vts = Date.now();
    else if (n._vts <= r.attached) return;
    qe(jl(n, r.value), t, 5, [n]);
  };
  return ((r.value = e), (r.attached = Dl()), r);
}
function eo(e, t) {
  return I(e) || V(e)
    ? e
    : (xe(
        `Wrong type passed as event handler to ${t} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof e}.`
      ),
      re);
}
function jl(e, t) {
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
const to = e =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 && // lowercase letter
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  Ul = (e, t, r, n, i, o) => {
    const a = i === 'svg';
    t === 'class'
      ? Ol(e, n, a)
      : t === 'style'
        ? Vl(e, r, n)
        : dr(t)
          ? Ir(t) || Ll(e, t, r, n, o)
          : (
                t[0] === '.'
                  ? ((t = t.slice(1)), !0)
                  : t[0] === '^'
                    ? ((t = t.slice(1)), !1)
                    : Hl(e, t, n, a)
              )
            ? (Ji(e, t, n),
              !e.tagName.includes('-') &&
                (t === 'value' || t === 'checked' || t === 'selected') &&
                Yi(e, t, n, a, o, t !== 'value'))
            : /* #11081 force set props for possible async custom element */ e._isVueCE &&
                (/[A-Z]/.test(t) || !Y(n))
              ? Ji(e, ve(t), n, o, t)
              : (t === 'true-value'
                  ? (e._trueValue = n)
                  : t === 'false-value' && (e._falseValue = n),
                Yi(e, t, n, a));
  };
function Hl(e, t, r, n) {
  if (n) return !!(t === 'innerHTML' || t === 'textContent' || (t in e && to(t) && I(r)));
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
  return to(t) && Y(r) ? !1 : t in e;
}
const ro = {};
// @__NO_SIDE_EFFECTS__
function Wl(e, t, r) {
  let n = /* @__PURE__ */ Zo(e, t);
  zr(n) && (n = G({}, n, t));
  class i extends ui {
    constructor(a) {
      super(n, a, r);
    }
  }
  return ((i.def = n), i);
}
const Bl = typeof HTMLElement < 'u' ? HTMLElement : class {};
class ui extends Bl {
  constructor(t, r = {}, n = io) {
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
      (this._styleChildren = /* @__PURE__ */ new WeakSet()),
      (this._ob = null),
      this.shadowRoot && n !== io
        ? (this._root = this.shadowRoot)
        : (process.env.NODE_ENV !== 'production' &&
            this.shadowRoot &&
            xe(
              'Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use `defineSSRCustomElement`.'
            ),
          t.shadowRoot !== !1
            ? (this.attachShadow(
                G({}, t.shadowRootOptions, {
                  mode: 'open',
                })
              ),
              (this._root = this.shadowRoot))
            : (this._root = this)));
  }
  connectedCallback() {
    if (!this.isConnected) return;
    (!this.shadowRoot && !this._resolved && this._parseSlots(), (this._connected = !0));
    let t = this;
    for (; (t = t && (t.parentNode || t.host)); )
      if (t instanceof ui) {
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
      Ho(() => {
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
  /**
   * resolve inner component definition (handle possible async component)
   */
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
              (c in this._props && (this._props[c] = bi(this._props[c])),
              ((s || (s = /* @__PURE__ */ Object.create(null)))[ve(c)] = !0));
          }
        ((this._numberProps = s),
          this._resolveProps(n),
          this.shadowRoot
            ? this._applyStyles(a)
            : process.env.NODE_ENV !== 'production' &&
              a &&
              xe('Custom element style injection is not supported when using shadowRoot: false'),
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
        j(this, n)
          ? process.env.NODE_ENV !== 'production' &&
            xe(`Exposed property "${n}" already exists on custom element.`)
          : Object.defineProperty(this, n, {
              // unwrap ref to be consistent with public instance behavior
              get: () => Do(r[n]),
            });
  }
  _resolveProps(t) {
    const { props: r } = t,
      n = V(r) ? r : Object.keys(r || {});
    for (const i of Object.keys(this)) i[0] !== '_' && n.includes(i) && this._setProp(i, this[i]);
    for (const i of n.map(ve))
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
    let n = r ? this.getAttribute(t) : ro;
    const i = ve(t);
    (r && this._numberProps && this._numberProps[i] && (n = bi(n)), this._setProp(i, n, !1, !0));
  }
  /**
   * @internal
   */
  _getProp(t) {
    return this._props[t];
  }
  /**
   * @internal
   */
  _setProp(t, r, n = !0, i = !1) {
    if (
      r !== this._props[t] &&
      ((this._dirty = !0),
      r === ro
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
    (this._app && (t.appContext = this._app._context), Kl(t, this._root));
  }
  _createVNode() {
    const t = {};
    this.shadowRoot || (t.onVnodeMounted = t.onVnodeUpdated = this._renderSlots.bind(this));
    const r = ct(this._def, G(t, this._props));
    return (
      this._instance ||
        (r.ce = n => {
          ((this._instance = n),
            (n.ce = this),
            (n.isCE = !0),
            process.env.NODE_ENV !== 'production' &&
              (n.ceReload = o => {
                (this._styles &&
                  (this._styles.forEach(a => this._root.removeChild(a)), (this._styles.length = 0)),
                  this._applyStyles(o),
                  (this._instance = null),
                  this._update());
              }));
          const i = (o, a) => {
            this.dispatchEvent(
              new CustomEvent(o, zr(a[0]) ? G({ detail: a }, a[0]) : { detail: a })
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
            this._childStyles || (this._childStyles = /* @__PURE__ */ new Map());
            let a = this._childStyles.get(r.__hmrId);
            (a || this._childStyles.set(r.__hmrId, (a = [])), a.push(o));
          }
        } else (this._styles || (this._styles = [])).push(o);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const t = (this._slots = {});
    let r;
    for (; (r = this.firstChild); ) {
      const n = (r.nodeType === 1 && r.getAttribute('slot')) || 'default';
      ((t[n] || (t[n] = [])).push(r), this.removeChild(r));
    }
  }
  /**
   * Only called when shadowRoot is false
   */
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
  /**
   * @internal
   */
  _getSlots() {
    const t = [this];
    this._teleportTargets && t.push(...this._teleportTargets);
    const r = /* @__PURE__ */ new Set();
    for (const n of t) {
      const i = n.querySelectorAll('slot');
      for (let o = 0; o < i.length; o++) r.add(i[o]);
    }
    return Array.from(r);
  }
  /**
   * @internal
   */
  _injectChildStyle(t) {
    this._applyStyles(t.styles, t);
  }
  /**
   * @internal
   */
  _beginPatch() {
    ((this._patching = !0), (this._dirty = !1));
  }
  /**
   * @internal
   */
  _endPatch() {
    ((this._patching = !1), this._dirty && this._instance && this._update());
  }
  /**
   * @internal
   */
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
const ql = ['ctrl', 'shift', 'alt', 'meta'],
  Xl = {
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
    exact: (e, t) => ql.some(r => e[`${r}Key`] && !t.includes(r)),
  },
  yn = (e, t) => {
    const r = e._withMods || (e._withMods = {}),
      n = t.join('.');
    return (
      r[n] ||
      (r[n] = (i, ...o) => {
        for (let a = 0; a < t.length; a++) {
          const s = Xl[t[a]];
          if (s && s(i, t)) return;
        }
        return e(i, ...o);
      })
    );
  },
  zl = /* @__PURE__ */ G({ patchProp: Ul }, xl);
let no;
function Vs() {
  return no || (no = el(zl));
}
const Kl = (...e) => {
    Vs().render(...e);
  },
  io = (...e) => {
    const t = Vs().createApp(...e);
    process.env.NODE_ENV !== 'production' && (Yl(t), Jl(t));
    const { mount: r } = t;
    return (
      (t.mount = n => {
        const i = Zl(n);
        if (!i) return;
        const o = t._component;
        (!I(o) && !o.render && !o.template && (o.template = i.innerHTML),
          i.nodeType === 1 && (i.textContent = ''));
        const a = r(i, !1, Gl(i));
        return (
          i instanceof Element && (i.removeAttribute('v-cloak'), i.setAttribute('data-v-app', '')),
          a
        );
      }),
      t
    );
  };
function Gl(e) {
  if (e instanceof SVGElement) return 'svg';
  if (typeof MathMLElement == 'function' && e instanceof MathMLElement) return 'mathml';
}
function Yl(e) {
  Object.defineProperty(e.config, 'isNativeTag', {
    value: t => ia(t) || oa(t) || sa(t),
    writable: !1,
  });
}
function Jl(e) {
  {
    const t = e.config.isCustomElement;
    Object.defineProperty(e.config, 'isCustomElement', {
      get() {
        return t;
      },
      set() {
        xe(
          'The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead.'
        );
      },
    });
    const r = e.config.compilerOptions,
      n =
        'The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader\'s `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc';
    Object.defineProperty(e.config, 'compilerOptions', {
      get() {
        return (xe(n), r);
      },
      set() {
        xe(n);
      },
    });
  }
}
function Zl(e) {
  if (Y(e)) {
    const t = document.querySelector(e);
    return (
      process.env.NODE_ENV !== 'production' &&
        !t &&
        xe(`Failed to mount app: mount target selector "${e}" returned null.`),
      t
    );
  }
  return (
    process.env.NODE_ENV !== 'production' &&
      window.ShadowRoot &&
      e instanceof window.ShadowRoot &&
      e.mode === 'closed' &&
      xe('mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs'),
    e
  );
}
function Ql() {
  wl();
}
process.env.NODE_ENV !== 'production' && Ql();
const eu =
  '@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-50:oklch(97.1% .013 17.38);--color-red-500:oklch(63.7% .237 25.331);--color-white:#fff;--spacing:.25rem;--container-3xl:48rem;--container-6xl:72rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75/1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2/1.5);--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-tight:-.025em;--tracking-wide:.025em;--tracking-wider:.05em;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-ott-accent:#68a691;--color-ott-accent-light:#ecfff9;--color-ott-text-primary:#2f2f2f;--color-ott-text-secondary:#a1a1a1;--color-ott-text-white:#fff;--color-ott-bg-primary:#fff;--color-ott-bg-secondary:#f3f3f3;--color-ott-bg-darkened:#f4f6f6;--color-ott-bg-dark:#d3d3d3}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-none{pointer-events:none}.visible{visibility:visible}.absolute{position:absolute}.relative{position:relative}.static{position:static}.inset-0{inset:calc(var(--spacing)*0)}.-top-0\\.5{top:calc(var(--spacing)*-.5)}.right-0{right:calc(var(--spacing)*0)}.-bottom-0\\.5{bottom:calc(var(--spacing)*-.5)}.left-0{left:calc(var(--spacing)*0)}.z-20{z-index:20}.col-span-2{grid-column:span 2/span 2}.col-span-full{grid-column:1/-1}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.m-0\\!{margin:calc(var(--spacing)*0)!important}.m-2{margin:calc(var(--spacing)*2)}.m-4{margin:calc(var(--spacing)*4)}.mx-auto{margin-inline:auto}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-4{margin-top:calc(var(--spacing)*4)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-8{margin-bottom:calc(var(--spacing)*8)}.ml-4{margin-left:calc(var(--spacing)*4)}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.inline{display:inline}.inline-block{display:inline-block}.h-1{height:calc(var(--spacing)*1)}.h-4{height:calc(var(--spacing)*4)}.h-8{height:calc(var(--spacing)*8)}.h-21{height:calc(var(--spacing)*21)}.h-full{height:100%}.max-h-48{max-height:calc(var(--spacing)*48)}.max-h-screen{max-height:100vh}.min-h-0{min-height:calc(var(--spacing)*0)}.min-h-5{min-height:calc(var(--spacing)*5)}.min-h-full{min-height:100%}.w-0\\.5{width:calc(var(--spacing)*.5)}.w-4{width:calc(var(--spacing)*4)}.w-8{width:calc(var(--spacing)*8)}.w-64{width:calc(var(--spacing)*64)}.w-100{width:calc(var(--spacing)*100)}.w-150{width:calc(var(--spacing)*150)}.w-fit{width:fit-content}.w-full{width:100%}.w-max{width:max-content}.max-w-3xl{max-width:var(--container-3xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-full{max-width:100%}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-full{min-width:100%}.flex-1{flex:1}.shrink-0{flex-shrink:0}.scale-90{--tw-scale-x:90%;--tw-scale-y:90%;--tw-scale-z:90%;scale:var(--tw-scale-x)var(--tw-scale-y)}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.transform-\\[rotate\\(90deg\\)\\]{transform:rotate(90deg)}.cursor-col-resize{cursor:col-resize}.cursor-grab{cursor:grab}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.resize-none{resize:none}.appearance-none{appearance:none}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.content-start{align-content:flex-start}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-start{justify-content:flex-start}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-3{gap:calc(var(--spacing)*3)}.gap-4{gap:calc(var(--spacing)*4)}.gap-6{gap:calc(var(--spacing)*6)}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*4)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-y-reverse)))}.gap-x-6{column-gap:calc(var(--spacing)*6)}.gap-y-4{row-gap:calc(var(--spacing)*4)}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-ott-bg-dark>:not(:last-child)){border-color:var(--color-ott-bg-dark)}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-ott-accent{border-color:var(--color-ott-accent)}.border-ott-bg-dark{border-color:var(--color-ott-bg-dark)}.border-ott-bg-dark\\/50{border-color:#d3d3d380}@supports (color:color-mix(in lab,red,red)){.border-ott-bg-dark\\/50{border-color:color-mix(in oklab,var(--color-ott-bg-dark)50%,transparent)}}.border-ott-bg-secondary{border-color:var(--color-ott-bg-secondary)}.border-ott-text-primary{border-color:var(--color-ott-text-primary)}.border-transparent{border-color:#0000}.border-transparent\\!{border-color:#0000!important}.border-t-ott-bg-dark{border-top-color:var(--color-ott-bg-dark)}.bg-ott-accent{background-color:var(--color-ott-accent)}.bg-ott-accent\\!{background-color:var(--color-ott-accent)!important}.bg-ott-accent-light{background-color:var(--color-ott-accent-light)}.bg-ott-accent\\/5{background-color:#68a6910d}@supports (color:color-mix(in lab,red,red)){.bg-ott-accent\\/5{background-color:color-mix(in oklab,var(--color-ott-accent)5%,transparent)}}.bg-ott-accent\\/20{background-color:#68a69133}@supports (color:color-mix(in lab,red,red)){.bg-ott-accent\\/20{background-color:color-mix(in oklab,var(--color-ott-accent)20%,transparent)}}.bg-ott-bg-dark{background-color:var(--color-ott-bg-dark)}.bg-ott-bg-dark\\/20{background-color:#d3d3d333}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-dark\\/20{background-color:color-mix(in oklab,var(--color-ott-bg-dark)20%,transparent)}}.bg-ott-bg-primary{background-color:var(--color-ott-bg-primary)}.bg-ott-bg-secondary{background-color:var(--color-ott-bg-secondary)}.bg-ott-bg-secondary\\/10{background-color:#f3f3f31a}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-secondary\\/10{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)10%,transparent)}}.bg-ott-bg-secondary\\/20{background-color:#f3f3f333}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-secondary\\/20{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)20%,transparent)}}.bg-ott-bg-secondary\\/30{background-color:#f3f3f34d}@supports (color:color-mix(in lab,red,red)){.bg-ott-bg-secondary\\/30{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)30%,transparent)}}.bg-white{background-color:var(--color-white)}.p-1{padding:calc(var(--spacing)*1)}.p-1\\.5{padding:calc(var(--spacing)*1.5)}.p-2{padding:calc(var(--spacing)*2)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.p-5{padding:calc(var(--spacing)*5)}.p-6{padding:calc(var(--spacing)*6)}.p-8{padding:calc(var(--spacing)*8)}.p-12{padding:calc(var(--spacing)*12)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-5{padding-inline:calc(var(--spacing)*5)}.px-6{padding-inline:calc(var(--spacing)*6)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-1{padding-block:calc(var(--spacing)*1)}.py-2{padding-block:calc(var(--spacing)*2)}.py-8{padding-block:calc(var(--spacing)*8)}.pt-2{padding-top:calc(var(--spacing)*2)}.pt-4{padding-top:calc(var(--spacing)*4)}.pr-4{padding-right:calc(var(--spacing)*4)}.pb-0{padding-bottom:calc(var(--spacing)*0)}.pb-4{padding-bottom:calc(var(--spacing)*4)}.pl-2{padding-left:calc(var(--spacing)*2)}.text-center{text-align:center}.text-right{text-align:right}.font-mono{font-family:var(--font-mono)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.tracking-wider{--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider)}.whitespace-nowrap{white-space:nowrap}.whitespace-pre{white-space:pre}.text-ott-accent{color:var(--color-ott-accent)}.text-ott-bg-dark{color:var(--color-ott-bg-dark)}.text-ott-bg-primary\\!{color:var(--color-ott-bg-primary)!important}.text-ott-text-primary{color:var(--color-ott-text-primary)}.text-ott-text-secondary{color:var(--color-ott-text-secondary)}.text-ott-text-secondary\\/30{color:#a1a1a14d}@supports (color:color-mix(in lab,red,red)){.text-ott-text-secondary\\/30{color:color-mix(in oklab,var(--color-ott-text-secondary)30%,transparent)}}.text-ott-text-secondary\\/50{color:#a1a1a180}@supports (color:color-mix(in lab,red,red)){.text-ott-text-secondary\\/50{color:color-mix(in oklab,var(--color-ott-text-secondary)50%,transparent)}}.text-ott-text-white{color:var(--color-ott-text-white)}.text-white{color:var(--color-white)}.uppercase{text-transform:uppercase}.italic{font-style:italic}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.opacity-0{opacity:0}.opacity-20{opacity:.2}.opacity-50{opacity:.5}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_0_8px_rgba\\(var\\(--ott-accent-rgb\\)\\,0\\.5\\)\\]{--tw-shadow:0 0 8px var(--tw-shadow-color,rgba(var(--ott-accent-rgb),.5));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-2{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-ott-accent{--tw-ring-color:var(--color-ott-accent)}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.ring-inset{--tw-ring-inset:inset}@media(hover:hover){.group-hover\\:text-ott-accent:is(:where(.group):hover *){color:var(--color-ott-accent)}.group-hover\\:text-ott-text-secondary:is(:where(.group):hover *){color:var(--color-ott-text-secondary)}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}.group-hover\\/section\\:text-ott-accent:is(:where(.group\\/section):hover *){color:var(--color-ott-accent)}}.last\\:border-0:last-child{border-style:var(--tw-border-style);border-width:0}.last\\:pr-0:last-child{padding-right:calc(var(--spacing)*0)}@media(hover:hover){.hover\\:border-ott-accent:hover{border-color:var(--color-ott-accent)}.hover\\:border-ott-bg-dark:hover{border-color:var(--color-ott-bg-dark)}.hover\\:bg-ott-accent:hover{background-color:var(--color-ott-accent)}.hover\\:bg-ott-accent\\/90:hover{background-color:#68a691e6}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-ott-accent\\/90:hover{background-color:color-mix(in oklab,var(--color-ott-accent)90%,transparent)}}.hover\\:bg-ott-bg-darkened:hover{background-color:var(--color-ott-bg-darkened)}.hover\\:bg-ott-bg-secondary:hover{background-color:var(--color-ott-bg-secondary)}.hover\\:bg-ott-bg-secondary\\/5:hover{background-color:#f3f3f30d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-ott-bg-secondary\\/5:hover{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)5%,transparent)}}.hover\\:bg-ott-bg-secondary\\/50:hover{background-color:#f3f3f380}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-ott-bg-secondary\\/50:hover{background-color:color-mix(in oklab,var(--color-ott-bg-secondary)50%,transparent)}}.hover\\:bg-red-50:hover{background-color:var(--color-red-50)}.hover\\:text-ott-accent:hover{color:var(--color-ott-accent)}.hover\\:text-ott-text-primary:hover{color:var(--color-ott-text-primary)}.hover\\:text-red-500:hover{color:var(--color-red-500)}}.focus\\:border-ott-accent:focus{border-color:var(--color-ott-accent)}.focus\\:bg-white:focus{background-color:var(--color-white)}.focus\\:ring-ott-accent:focus{--tw-ring-color:var(--color-ott-accent)}.active\\:cursor-grabbing:active{cursor:grabbing}.disabled\\:text-ott-bg-dark:disabled{color:var(--color-ott-bg-dark)}@media(min-width:48rem){.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}}html,body,#app{background-color:var(--color-ott-bg-secondary);width:100%;height:100%;color:var(--color-ott-text-primary);font-family:Poppins,sans-serif;font-style:normal;font-weight:400}button{cursor:pointer}h1{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height));--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}h2{margin-block:calc(var(--spacing)*4);font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height));--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}main{width:100%;height:100%;max-height:100vh;display:block;overflow:auto}.ott-button{cursor:pointer;justify-content:center;align-items:center;gap:calc(var(--spacing)*5);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-text-primary);height:fit-content;padding-inline:calc(var(--spacing)*4);padding-block:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);color:var(--color-ott-text-primary);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));display:flex}@media(hover:hover){.ott-button:hover{background-color:var(--color-ott-bg-secondary)}}.ott-button:disabled{cursor:default;border-color:var(--color-ott-bg-dark);color:var(--color-ott-bg-dark)}.ott-button--accent{cursor:pointer;align-items:center;gap:calc(var(--spacing)*5);border-radius:var(--radius-lg);border-color:var(--color-ott-accent);background-color:var(--color-ott-accent);height:fit-content;padding-inline:calc(var(--spacing)*4);padding-block:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);color:var(--color-ott-text-white);display:flex}.ott-button--accent:disabled{cursor:default;background-color:var(--color-ott-text-secondary)}input,.ott-input{border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-bg-dark);background-color:var(--color-white);padding-inline:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*1);font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));border-radius:.25rem}:is(input,.ott-input):focus{border-color:var(--color-ott-accent);--tw-outline-style:none;outline-style:none}.scrollbar-thin::-webkit-scrollbar{width:4px}.scrollbar-thin::-webkit-scrollbar-track{background:0 0}.scrollbar-thin::-webkit-scrollbar-thumb{background-color:var(--color-ott-bg-dark);border-radius:3.40282e38px}.ott-tool-btn{align-items:center;gap:calc(var(--spacing)*3);border-radius:var(--radius-md);border-style:var(--tw-border-style);width:100%;padding:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));cursor:pointer;font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);border-width:1px;border-color:#0000;display:flex}@media(hover:hover){.ott-tool-btn:hover{background-color:var(--color-ott-bg-secondary)}}.ott-tool-btn.active{border-color:var(--color-ott-accent);background-color:var(--color-ott-accent-light);color:var(--color-ott-accent)}.ott-sub-tool-btn{cursor:pointer;border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-bg-dark);padding:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));background-color:var(--color-ott-bg-secondary);border-radius:3.40282e38px}@media(hover:hover){.ott-sub-tool-btn:hover{border-color:var(--color-ott-accent);background-color:var(--color-white);color:var(--color-ott-accent)}}.ott-sub-tool-btn.active{border-color:var(--color-ott-accent);background-color:var(--color-ott-accent);color:var(--color-white)}.ott-section-header{margin-bottom:calc(var(--spacing)*4);border-bottom-style:var(--tw-border-style);border-bottom-width:1px;border-color:var(--color-ott-bg-dark);padding-bottom:calc(var(--spacing)*1);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold);--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider);color:var(--color-ott-text-secondary);text-transform:uppercase}.ott-expandable-item{border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-ott-bg-dark);background-color:var(--color-ott-bg-primary);transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));overflow:hidden}.ott-item-header{cursor:pointer;align-items:center;gap:calc(var(--spacing)*3);padding:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));display:flex}@media(hover:hover){.ott-item-header:hover{background-color:var(--color-ott-bg-secondary)}}.ott-item-header.active{border-bottom-style:var(--tw-border-style);border-bottom-width:1px;border-color:var(--color-ott-bg-dark);background-color:var(--color-ott-bg-secondary)}.ott-item-content{background-color:var(--color-white)}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}';
class wn {
  attr_id;
  attr_version;
  Label;
  constructor({ Label: t, attr_id: r, attr_version: n }) {
    ((this.attr_id = r), (this.attr_version = n), (this.Label = t));
  }
  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Label: this.Label,
    };
  }
}
class oo {
  attr_ref;
  attr_version;
  constructor({ attr_ref: t, attr_version: r }) {
    ((this.attr_ref = t), (this.attr_version = r));
  }
  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
  }
}
class As {
  value;
  constructor(t) {
    this.value = t?.text_value;
  }
  toXML() {
    return { text_value: this.value };
  }
}
function Q(e, t) {
  return e ? (Array.isArray(e) ? e.map(r => new t(r)) : [new t(e)]) : [];
}
function Mt(e) {
  return e.map(t => t.toXML());
}
function je(e) {
  const t = {};
  return (
    e.forEach(r => {
      const i = r.constructor.xmlTagName ?? r.constructor.name;
      (t[i] || (t[i] = []), t[i].push(r.toXML()));
    }),
    t
  );
}
class tu {
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
class ru extends tu {
  constructor(t) {
    super(t);
  }
}
class nu extends ru {
  Fixed;
  constructor(t) {
    (super(t), (this.Fixed = t.Fixed === 'true' || t.Fixed === !0));
  }
  toXML() {
    return {
      ...super.toXML(),
      Fixed: this.Fixed,
    };
  }
}
class nn extends nu {
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
class iu {
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
      (this.Name = n ? new As(n) : void 0),
      (this.actualVehicleEquipments = a ? Q(a.ActualVehicleEquipment, nn) : []),
      (this.PublicUse = i?.text_value),
      (this.TotalCapacity = o?.text_value));
  }
  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name?.toXML,
    };
  }
}
class Lt {
  x;
  y;
  constructor(t, r) {
    ((this.x = t), (this.y = r));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromXML(t) {
    const r = t?.Location?.pos;
    if (typeof r == 'string') {
      const [n, i] = r.split(' ').map(Number);
      if (typeof n == 'number' && typeof i == 'number') return new Lt(n, i);
    } else return new Lt(0, 0);
  }
  toXML() {
    return {
      Location: {
        pos: `${this.x} ${this.y}`,
      },
    };
  }
}
class ou {
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
  //   sensorInEntrance: SensorInEntrance[]
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
    // sensorInEntrance,
  }) {
    ((this.attr_id = t),
      (this.attr_version = r),
      (this.Name = n ? new As(n) : void 0),
      (this.Label = i?.text_value),
      (this.Width = o?.text_value),
      (this.Height = a?.text_value),
      (this.actualVehicleEquipments = Q(s?.ActualVehicleEquipment, nn)),
      (this.PublicUse = c?.text_value),
      (this.VehicleSide = f?.text_value),
      (this.SequenceFromFront = l?.text_value),
      (this.HeightFromGround = u?.text_value),
      (this.DeckEntranceType = p?.text_value),
      (this.IsEmergencyExit = m?.text_value),
      (this.HasDoor = C?.text_value),
      (this.IsAutomatic = N?.text_value),
      (this.Centroid = L ? Lt.fromXML(L) : void 0));
  }
  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name?.toXML(),
      Label: this.Label,
      Width: this.Width,
      Height: this.Height,
      actualVehicleEquipments: {
        ActualVehicleEquipment: Mt(this.actualVehicleEquipments),
      },
      PublicUse: this.PublicUse,
      VehicleSide: this.VehicleSide,
      SequenceFromFront: this.SequenceFromFront,
      HeightFromGround: this.HeightFromGround,
      DeckEntranceType: this.DeckEntranceType,
      IsEmergencyExit: this.IsEmergencyExit,
      HasDoor: this.HasDoor,
      IsAutomatic: this.IsAutomatic,
      Centroid: this.Centroid?.toXML(),
      //   sensorInEntrance: {SensorInEntrance: serializeElements(this.sensorInEntrance)},
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
class so {
  attr_ref;
  attr_version;
  constructor({ attr_ref: t, attr_version: r }) {
    ((this.attr_ref = t), (this.attr_version = r));
  }
  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
  }
}
class su {
  attr_ref;
  attr_version;
  FromDeckEntranceRef;
  ToDeckEntranceRef;
  constructor({ attr_ref: t, attr_version: r, FromDeckEntranceRef: n, ToDeckEntranceRef: i }) {
    ((this.attr_ref = t),
      (this.attr_version = r),
      (this.FromDeckEntranceRef = new so(n)),
      (this.ToDeckEntranceRef = new so(i)));
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
class au {
  attr_id;
  attr_version;
  Name;
  constructor({ attr_id: t, attr_version: r, Name: n }) {
    ((this.attr_id = t), (this.attr_version = r), (this.Name = n));
  }
  toXML() {
    return {
      attr_id: this.attr_id,
      Name: this.Name,
      attr_version: this.attr_version,
    };
  }
}
class cu {
  attr_ref;
  attr_version;
  constructor({ attr_ref: t, attr_version: r }) {
    ((this.attr_ref = t), (this.attr_version = r));
  }
  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
  }
}
class lu {
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
          c === 'ValidityConditionRef' && f.map(l => new cu(l)),
          c === 'ValidityCondition' && f.map(l => new au(l)),
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
      validityConditions: je(this.validityConditions),
      Name: this.Name,
      EntranceUsageType: this.EntranceUsageType,
      EntranceSetting: this.EntranceSetting,
      ControlledLocking: this.ControlledLocking,
    };
  }
}
class uu {
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
class du {
  attr_id;
  label;
  constructor({ attr_id: t, Label: r }) {
    ((this.attr_id = t), (this.label = r));
  }
  toXML() {
    return {
      attr_id: this.attr_id,
      label: this.label,
    };
  }
}
class fu {
  attr_ref;
  attr_version;
  constructor({ attr_ref: t, attr_version: r }) {
    ((this.attr_ref = t), (this.attr_version = r));
  }
  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
  }
}
class hu {
  attr_id;
  label;
  constructor({ attr_id: t, Label: r }) {
    ((this.attr_id = t), (this.label = r));
  }
  toXML() {
    return {
      attr_id: this.attr_id,
      label: this.label,
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
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
  }
}
class Is {
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
      (this.actualVehicleEquipments = o ? Q(o, nn) : []),
      (this.SpotColumnRef = a ? new fu(a) : void 0),
      (this.SpotRowRef = s ? new pu(s) : void 0));
  }
}
class gu extends Is {
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
      actualVehicleEquipments: {
        ActualVehicleEquipment: Mt(this.actualVehicleEquipments),
      },
      SpotColumnRef: this.SpotColumnRef?.toXML(),
      SpotRowRef: this.SpotRowRef?.toXML(),
    };
  }
}
class mu {
  attr_ref;
  attr_version;
  constructor({ attr_ref: t, attr_version: r }) {
    ((this.attr_ref = t), (this.attr_version = r));
  }
  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
  }
}
var jn = /* @__PURE__ */ (e => (
  (e.Occupied = 'Occupied'),
  (e.Selected = 'Selected'),
  (e.Filtered = 'Filtered'),
  (e.Defect = 'Defect'),
  (e.Undefined = 'Undefined'),
  e
))(jn || {});
class Ps extends Is {
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
    Length: R,
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
      (this.Centroid = N ? Lt.fromXML(N) : void 0),
      (this.Width = L || 0.5),
      (this.Length = R || 0.5));
  }
  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Label: this.Label ? { text_value: this.Label } : void 0,
      Orientation: this.Orientation ? { text_value: this.Orientation } : void 0,
      actualVehicleEquipments: this.actualVehicleEquipments
        ? je(this.actualVehicleEquipments)
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
class vu {
  attr_ref;
  attr_version;
  constructor({ attr_ref: t, attr_version: r }) {
    ((this.attr_ref = t), (this.attr_version = r));
  }
  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
  }
}
class Ms {
  value;
  constructor(t) {
    this.value = t;
  }
  toXML() {
    return this.value;
  }
}
class bu {
  attr_ref;
  attr_version;
  constructor({ attr_ref: t, attr_version: r }) {
    ((this.attr_ref = t), (this.attr_version = r));
  }
  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    };
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
  // passengerVehicleSpots: (PassengerVehicleSpot | PassengerVehicleSpotRef)[]
  deckEntrances;
  deckEntranceUsage;
  deckEntranceCouples;
  deckSpaceCapacities;
  actualVehicleEquipments;
  ServiceFacilitySetRef;
  // spotAffinities: SpotAffinity[] | undefined
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
    // spotAffinities,
    Centroid: N,
    Polygon: L,
    PublicUse: R,
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
            k === 'PassengerSpot' ? Q(z, Ps) : k === 'PassengerSpotRef' ? Q(z, vu) : []
          )
        : []),
      (this.luggageSpots = c
        ? Object.entries(c).flatMap(([k, z]) =>
            k === 'LuggageSpot' ? Q(z, gu) : k === 'LuggageSpotRef' ? Q(z, mu) : []
          )
        : []),
      (this.deckEntrances = Q(f?.PassengerEntrance, ou)),
      (this.deckEntranceUsage = Q(l?.DeckEntranceUsage, lu)),
      (this.deckEntranceCouples = Q(u?.DeckEntranceCouple, su)),
      (this.deckSpaceCapacities = Q(p?.DeckSpaceCapacity, uu)),
      (this.actualVehicleEquipments = Q(m?.ActualVehicleEquipment, nn)),
      (this.ServiceFacilitySetRef = C ? new bu(C) : void 0),
      (this.Centroid = N ? Lt.fromXML(N) : void 0),
      (this.Polygon = L ? new Ms(L) : void 0),
      (this.PublicUse = R?.text_value),
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
      passengerSpots: this.passengerSpots ? je(this.passengerSpots) : '',
      luggageSpots: this.luggageSpots ? je(this.luggageSpots) : void 0,
      deckEntrances: this.deckEntrances ? je(this.deckEntrances) : void 0,
      deckEntranceUsage: this.deckEntranceUsage ? je(this.deckEntranceUsage) : void 0,
      deckEntranceCouples: this.deckEntranceCouples ? je(this.deckEntranceCouples) : void 0,
      deckSpaceCapacities: this.deckSpaceCapacities ? je(this.deckSpaceCapacities) : void 0,
      actualVehicleEquipments: this.actualVehicleEquipments
        ? je(this.actualVehicleEquipments)
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
class nr {
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
      (this.polygon = c ? new Ms(c) : void 0),
      (this.DeckLevelRef = a ? new oo(a) : void 0),
      (this.Width = f ?? 2.825),
      (this.Length = l ?? 26.4),
      (this.deckspaces = n
        ? Object.entries(n).flatMap(([u, p]) =>
            u === 'OtherDeckSpace' ? Q(p, iu) : u === 'PassengerSpace' ? Q(p, ur) : []
          )
        : []),
      (this.spotRows = Q(i?.SpotRow, hu)),
      (this.spotColumns = Q(o?.SpotColumn, du)));
  }
  static empty(t) {
    return new nr({
      attr_id: crypto.randomUUID(),
      attr_version: '1.0',
      deckSpaces: { OtherDeckSpace: [], PassengerSpace: [] },
      spotRows: {
        SpotRow: [
          {
            attr_id: 'spot_row_1',
            Label: '1',
          },
          {
            attr_id: 'spot_row_2',
            Label: '2',
          },
        ],
      },
      spotColumns: {
        SpotColumn: [
          {
            attr_id: 'spot_column_1',
            Label: '1',
          },
          {
            attr_id: 'spot_column_2',
            Label: '2',
          },
        ],
      },
      DeckLevelRef: new oo({
        attr_ref: t.attr_id,
        attr_version: '1.0',
      }),
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
      spotRows: { SpotRow: Mt(this.spotRows) },
      spotColumns: { SpotColumn: Mt(this.spotColumns) },
      deckSpaces: je(this.deckspaces),
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
class di {
  attr_id;
  attr_version;
  deckLevels;
  decks;
  constructor({ attr_id: t, attr_version: r, decks: n = void 0, deckLevels: i = void 0 }) {
    ((this.attr_id = t),
      (this.attr_version = r),
      (this.deckLevels = Q(i?.DeckLevel, wn)),
      (this.decks = Q(n?.Deck, nr)));
  }
  static empty() {
    const t = new wn({
        Label: 'Level 1',
        attr_id: 'deck_level_0',
        attr_version: '1.0',
      }),
      r = new di({
        attr_id: crypto.randomUUID(),
        attr_version: '1.0',
        decks: { Deck: [] },
        deckLevels: {
          DeckLevel: [t],
        },
      });
    return (r.decks.push(nr.empty(t)), r);
  }
  addDeckLevel() {
    const t = new wn({
      attr_id: `deck_level_${this.deckLevels.length}`,
      attr_version: '1.0',
      Label: `Level ${this.deckLevels.length + 1}`,
    });
    (this.deckLevels.push(t), this.decks.push(nr.empty(t)));
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
        decks: { Deck: Mt(this.decks) },
        deckLevels: { DeckLevel: Mt(this.deckLevels) },
      },
    };
  }
}
const Ls =
    ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD',
  _u = Ls + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040',
  yu = '[' + Ls + '][' + _u + ']*',
  wu = new RegExp('^' + yu + '$');
function Rs(e, t) {
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
const on = function (e) {
  const t = wu.exec(e);
  return !(t === null || typeof t > 'u');
};
function Eu(e) {
  return typeof e < 'u';
}
const fi = [
    // '__proto__',
    // 'constructor',
    // 'prototype',
    'hasOwnProperty',
    'toString',
    'valueOf',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
  ],
  $s = ['__proto__', 'constructor', 'prototype'],
  Nu = {
    allowBooleanAttributes: !1,
    //A tag can have attributes without any value
    unpairedTags: [],
  };
function xu(e, t) {
  t = Object.assign({}, Nu, t);
  const r = [];
  let n = !1,
    i = !1;
  e[0] === '\uFEFF' && (e = e.substr(1));
  for (let o = 0; o < e.length; o++)
    if (e[o] === '<' && e[o + 1] === '?') {
      if (((o += 2), (o = co(e, o)), o.err)) return o;
    } else if (e[o] === '<') {
      let a = o;
      if ((o++, e[o] === '!')) {
        o = lo(e, o);
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
          !Iu(c))
        ) {
          let u;
          return (
            c.trim().length === 0
              ? (u = "Invalid space after '<'.")
              : (u = "Tag '" + c + "' is an invalid name."),
            J('InvalidTag', u, ce(e, o))
          );
        }
        const f = Cu(e, o);
        if (f === !1)
          return J('InvalidAttr', "Attributes for '" + c + "' have open quote.", ce(e, o));
        let l = f.value;
        if (((o = f.index), l[l.length - 1] === '/')) {
          const u = o - l.length;
          l = l.substring(0, l.length - 1);
          const p = uo(l, t);
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
          const u = uo(l, t);
          if (u !== !0) return J(u.err.code, u.err.msg, ce(e, o - l.length + u.err.line));
          if (i === !0) return J('InvalidXml', 'Multiple possible root nodes found.', ce(e, o));
          (t.unpairedTags.indexOf(c) !== -1 || r.push({ tagName: c, tagStartPos: a }), (n = !0));
        }
        for (o++; o < e.length; o++)
          if (e[o] === '<')
            if (e[o + 1] === '!') {
              (o++, (o = lo(e, o)));
              continue;
            } else if (e[o + 1] === '?') {
              if (((o = co(e, ++o)), o.err)) return o;
            } else break;
          else if (e[o] === '&') {
            const u = Vu(e, o);
            if (u == -1) return J('InvalidChar', "char '&' is not expected.", ce(e, o));
            o = u;
          } else if (i === !0 && !ao(e[o]))
            return J('InvalidXml', 'Extra text at the end', ce(e, o));
        e[o] === '<' && o--;
      }
    } else {
      if (ao(e[o])) continue;
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
function ao(e) {
  return (
    e === ' ' ||
    e === '	' ||
    e ===
      `
` ||
    e === '\r'
  );
}
function co(e, t) {
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
function lo(e, t) {
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
const Su = '"',
  Ou = "'";
function Cu(e, t) {
  let r = '',
    n = '',
    i = !1;
  for (; t < e.length; t++) {
    if (e[t] === Su || e[t] === Ou) n === '' ? (n = e[t]) : n !== e[t] || (n = '');
    else if (e[t] === '>' && n === '') {
      i = !0;
      break;
    }
    r += e[t];
  }
  return n !== ''
    ? !1
    : {
        value: r,
        index: t,
        tagClosed: i,
      };
}
const ku = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, 'g');
function uo(e, t) {
  const r = Rs(e, ku),
    n = {};
  for (let i = 0; i < r.length; i++) {
    if (r[i][1].length === 0)
      return J('InvalidAttr', "Attribute '" + r[i][2] + "' has no space in starting.", zt(r[i]));
    if (r[i][3] !== void 0 && r[i][4] === void 0)
      return J('InvalidAttr', "Attribute '" + r[i][2] + "' is without value.", zt(r[i]));
    if (r[i][3] === void 0 && !t.allowBooleanAttributes)
      return J('InvalidAttr', "boolean attribute '" + r[i][2] + "' is not allowed.", zt(r[i]));
    const o = r[i][2];
    if (!Au(o)) return J('InvalidAttr', "Attribute '" + o + "' is an invalid name.", zt(r[i]));
    if (!Object.prototype.hasOwnProperty.call(n, o)) n[o] = 1;
    else return J('InvalidAttr', "Attribute '" + o + "' is repeated.", zt(r[i]));
  }
  return !0;
}
function Tu(e, t) {
  let r = /\d/;
  for (e[t] === 'x' && (t++, (r = /[\da-fA-F]/)); t < e.length; t++) {
    if (e[t] === ';') return t;
    if (!e[t].match(r)) break;
  }
  return -1;
}
function Vu(e, t) {
  if ((t++, e[t] === ';')) return -1;
  if (e[t] === '#') return (t++, Tu(e, t));
  let r = 0;
  for (; t < e.length; t++, r++)
    if (!(e[t].match(/\w/) && r < 20)) {
      if (e[t] === ';') break;
      return -1;
    }
  return t;
}
function J(e, t, r) {
  return {
    err: {
      code: e,
      msg: t,
      line: r.line || r,
      col: r.col,
    },
  };
}
function Au(e) {
  return on(e);
}
function Iu(e) {
  return on(e);
}
function ce(e, t) {
  const r = e.substring(0, t).split(/\r?\n/);
  return {
    line: r.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: r[r.length - 1].length + 1,
  };
}
function zt(e) {
  return e.startIndex + e[1].length;
}
const Pu = {
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
  Ds = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    quot: '"',
  },
  Mu = {
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
  Lu = new Set('!?\\\\/[]$%{}^&*()<>|+');
function fo(e) {
  if (e[0] === '#')
    throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${e}"`);
  for (const t of e)
    if (Lu.has(t))
      throw new Error(`[EntityReplacer] Invalid character '${t}' in entity name: "${e}"`);
  return e;
}
function En(...e) {
  const t = /* @__PURE__ */ Object.create(null);
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
const mt = 'external',
  Br = 'base',
  Un = 'all';
function Ru(e) {
  return !e || e === mt
    ? /* @__PURE__ */ new Set([mt])
    : e === Un
      ? /* @__PURE__ */ new Set([Un])
      : e === Br
        ? /* @__PURE__ */ new Set([Br])
        : Array.isArray(e)
          ? new Set(e)
          : /* @__PURE__ */ new Set([mt]);
}
const me = Object.freeze({ allow: 0, leave: 1, remove: 2, throw: 3 }),
  $u = /* @__PURE__ */ new Set([9, 10, 13]);
function Du(e) {
  if (!e) return { xmlVersion: 1, onLevel: me.allow, nullLevel: me.remove };
  const t = e.xmlVersion === 1.1 ? 1.1 : 1,
    r = me[e.onNCR] ?? me.allow,
    n = me[e.nullNCR] ?? me.remove,
    i = Math.max(n, me.remove);
  return { xmlVersion: t, onLevel: r, nullLevel: i };
}
class Fu {
  /**
   * @param {object} [options]
   * @param {object|null}  [options.namedEntities]        — extra named entities merged into base map
   * @param {object}  [options.limit]                 — security limits
   * @param {number}       [options.limit.maxTotalExpansions=0]  — 0 = unlimited
   * @param {number}       [options.limit.maxExpandedLength=0]   — 0 = unlimited
   * @param {'external'|'base'|'all'|string[]} [options.limit.applyLimitsTo='external']
   *   Which entity tiers count against the security limits:
   *   - 'external' (default) — only input/runtime + persistent external entities
   *   - 'base'               — only DEFAULT_XML_ENTITIES + namedEntities
   *   - 'all'                — every entity regardless of tier
   *   - string[]             — explicit combination, e.g. ['external', 'base']
   * @param {((resolved: string, original: string) => string)|null} [options.postCheck=null]
   * @param {string[]} [options.remove=[]] — entity names (e.g. ['nbsp', '#13']) to delete (replace with empty string)
   * @param {string[]} [options.leave=[]]  — entity names to keep as literal (unchanged in output)
   * @param {object}   [options.ncr]       — Numeric Character Reference controls
   * @param {1.0|1.1}  [options.ncr.xmlVersion=1.0]
   *   XML version governing which codepoint ranges are restricted:
   *   - 1.0 — C0 controls U+0001–U+001F (except U+0009/000A/000D) are prohibited
   *   - 1.1 — C0 controls are allowed when written as NCRs; C1 (U+007F–U+009F) decoded as-is
   * @param {'allow'|'leave'|'remove'|'throw'} [options.ncr.onNCR='allow']
   *   Base action for numeric references. Severity order: allow < leave < remove < throw.
   *   For codepoint ranges that carry a minimum level (surrogates → remove, XML 1.0 C0 → remove),
   *   the effective action is max(onNCR, rangeMinimum).
   * @param {'remove'|'throw'} [options.ncr.nullNCR='remove']
   *   Action for U+0000 (null). 'allow' and 'leave' are clamped to 'remove' since null is never safe.
   */
  constructor(t = {}) {
    ((this._limit = t.limit || {}),
      (this._maxTotalExpansions = this._limit.maxTotalExpansions || 0),
      (this._maxExpandedLength = this._limit.maxExpandedLength || 0),
      (this._postCheck = typeof t.postCheck == 'function' ? t.postCheck : n => n),
      (this._limitTiers = Ru(this._limit.applyLimitsTo ?? mt)),
      (this._numericAllowed = t.numericAllowed ?? !0),
      (this._baseMap = En(Ds, t.namedEntities || null)),
      (this._externalMap = /* @__PURE__ */ Object.create(null)),
      (this._inputMap = /* @__PURE__ */ Object.create(null)),
      (this._totalExpansions = 0),
      (this._expandedLength = 0),
      (this._removeSet = new Set(t.remove && Array.isArray(t.remove) ? t.remove : [])),
      (this._leaveSet = new Set(t.leave && Array.isArray(t.leave) ? t.leave : [])));
    const r = Du(t.ncr);
    ((this._ncrXmlVersion = r.xmlVersion),
      (this._ncrOnLevel = r.onLevel),
      (this._ncrNullLevel = r.nullLevel));
  }
  // -------------------------------------------------------------------------
  // Persistent external entity registration
  // -------------------------------------------------------------------------
  /**
   * Replace the full set of persistent external entities.
   * All keys are validated — throws on invalid characters.
   * @param {Record<string, string | { regex?: RegExp, val: string }>} map
   */
  setExternalEntities(t) {
    if (t) for (const r of Object.keys(t)) fo(r);
    this._externalMap = En(t);
  }
  /**
   * Add a single persistent external entity.
   * @param {string} key
   * @param {string} value
   */
  addExternalEntity(t, r) {
    (fo(t), typeof r == 'string' && r.indexOf('&') === -1 && (this._externalMap[t] = r));
  }
  // -------------------------------------------------------------------------
  // Input / runtime entity registration (per document)
  // -------------------------------------------------------------------------
  /**
   * Inject DOCTYPE entities for the current document.
   * Also resets per-document expansion counters.
   * @param {Record<string, string | { regx?: RegExp, regex?: RegExp, val: string }>} map
   */
  addInputEntities(t) {
    ((this._totalExpansions = 0), (this._expandedLength = 0), (this._inputMap = En(t)));
  }
  // -------------------------------------------------------------------------
  // Per-document reset
  // -------------------------------------------------------------------------
  /**
   * Wipe input/runtime entities and reset counters.
   * Call this before processing each new document.
   * @returns {this}
   */
  reset() {
    return (
      (this._inputMap = /* @__PURE__ */ Object.create(null)),
      (this._totalExpansions = 0),
      (this._expandedLength = 0),
      this
    );
  }
  // -------------------------------------------------------------------------
  // XML version (can be set after construction, e.g. once parser reads <?xml?>)
  // -------------------------------------------------------------------------
  /**
   * Update the XML version used for NCR classification.
   * Call this as soon as the document's `<?xml version="...">` declaration is parsed.
   * @param {1.0|1.1|number} version
   */
  setXmlVersion(t) {
    this._ncrXmlVersion = t === 1.1 ? 1.1 : 1;
  }
  // -------------------------------------------------------------------------
  // Primary API
  // -------------------------------------------------------------------------
  /**
   * Replace all entity references in `str` in a single pass.
   *
   * @param {string} str
   * @returns {string}
   */
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
      if (this._removeSet.has(p)) ((m = ''), C === void 0 && (C = mt));
      else if (this._leaveSet.has(p)) {
        a++;
        continue;
      } else if (p.charCodeAt(0) === 35) {
        const N = this._resolveNCR(p);
        if (N === void 0) {
          a++;
          continue;
        }
        ((m = N), (C = Br));
      } else {
        const N = this._resolveName(p);
        ((m = N?.value), (C = N?.tier));
      }
      if (m === void 0) {
        a++;
        continue;
      }
      if (
        (a > o && n.push(t.slice(o, a)), n.push(m), (o = u + 1), (a = o), f && this._tierCounts(C))
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
  // -------------------------------------------------------------------------
  // Private: limit tier check
  // -------------------------------------------------------------------------
  /**
   * Returns true if a resolved entity of the given tier should count
   * against the expansion/length limits.
   * @param {string} tier  — LIMIT_TIER_EXTERNAL | LIMIT_TIER_BASE
   * @returns {boolean}
   */
  _tierCounts(t) {
    return this._limitTiers.has(Un) ? !0 : this._limitTiers.has(t);
  }
  // -------------------------------------------------------------------------
  // Private: entity resolution
  // -------------------------------------------------------------------------
  /**
   * Resolve a named entity token (without & and ;).
   * Priority: inputMap > externalMap > baseMap
   * Returns the resolved value tagged with its limit tier.
   *
   * @param {string} name
   * @returns {{ value: string, tier: string }|undefined}
   */
  _resolveName(t) {
    if (t in this._inputMap) return { value: this._inputMap[t], tier: mt };
    if (t in this._externalMap) return { value: this._externalMap[t], tier: mt };
    if (t in this._baseMap) return { value: this._baseMap[t], tier: Br };
  }
  /**
   * Classify a codepoint and return the minimum action level that must be applied.
   * Returns -1 when no minimum is imposed (normal allow path).
   *
   * Ranges checked (in priority order):
   *   1. U+0000            — null, governed by nullNCR (always ≥ remove)
   *   2. U+D800–U+DFFF     — surrogates, always prohibited (min: remove)
   *   3. U+0001–U+001F \ {0x09,0x0A,0x0D}  — XML 1.0 restricted C0 (min: remove)
   *      (skipped in XML 1.1 — C0 controls are allowed when written as NCRs)
   *
   * @param {number} cp  — codepoint
   * @returns {number}   — minimum NCR_LEVEL value, or -1 for no restriction
   */
  _classifyNCR(t) {
    return t === 0
      ? this._ncrNullLevel
      : (t >= 55296 && t <= 57343) || (this._ncrXmlVersion === 1 && t >= 1 && t <= 31 && !$u.has(t))
        ? me.remove
        : -1;
  }
  /**
   * Execute a resolved NCR action.
   *
   * @param {number} action   — NCR_LEVEL value
   * @param {string} token    — raw token (e.g. '#38') for error messages
   * @param {number} cp       — codepoint, used only for error messages
   * @returns {string|undefined}
   *   - decoded character string  → 'allow'
   *   - ''                        → 'remove'
   *   - undefined                 → 'leave' (caller must skip past '&' only)
   *   - throws Error              → 'throw'
   */
  _applyNCRAction(t, r, n) {
    switch (t) {
      case me.allow:
        return String.fromCodePoint(n);
      case me.remove:
        return '';
      case me.leave:
        return;
      // signal: keep literal
      case me.throw:
        throw new Error(
          `[EntityDecoder] Prohibited numeric character reference &${r}; (U+${n.toString(16).toUpperCase().padStart(4, '0')})`
        );
      default:
        return String.fromCodePoint(n);
    }
  }
  /**
   * Full NCR resolution pipeline for a numeric token.
   *
   * Steps:
   *   1. Parse the codepoint (decimal or hex).
   *   2. Validate the raw codepoint range (NaN, <0, >0x10FFFF).
   *   3. If numericAllowed is false and no minimum restriction applies → leave as-is.
   *   4. Classify the codepoint to find the minimum required action level.
   *   5. Resolve effective action = max(onNCR, minimum).
   *   6. Apply and return.
   *
   * @param {string} token  — e.g. '#38', '#x26', '#X26'
   * @returns {string|undefined}
   *   - string (incl. '')  — replacement ('' = remove)
   *   - undefined          — leave original &token; as-is
   */
  _resolveNCR(t) {
    const r = t.charCodeAt(1);
    let n;
    if (
      (r === 120 || r === 88 ? (n = parseInt(t.slice(2), 16)) : (n = parseInt(t.slice(1), 10)),
      Number.isNaN(n) || n < 0 || n > 1114111)
    )
      return;
    const i = this._classifyNCR(n);
    if (!this._numericAllowed && i < me.remove) return;
    const o = i === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, i);
    return this._applyNCRAction(o, t, n);
  }
}
const Fs = e => (fi.includes(e) ? '__' + e : e),
  ju = {
    preserveOrder: !1,
    attributeNamePrefix: '@_',
    attributesGroupName: !1,
    textNodeName: '#text',
    ignoreAttributes: !0,
    removeNSPrefix: !1,
    // remove NS from tag name or attribute name if true
    allowBooleanAttributes: !1,
    //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: !0,
    parseAttributeValue: !1,
    trimValues: !0,
    //Trim string values of tag and attributes
    cdataPropName: !1,
    numberParseOptions: {
      hex: !0,
      leadingZeros: !0,
      eNotation: !0,
    },
    tagValueProcessor: function (e, t) {
      return t;
    },
    attributeValueProcessor: function (e, t) {
      return t;
    },
    stopNodes: [],
    //nested tags will not be parsed even for errors
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
    // skipEmptyListItem: false
    captureMetaData: !1,
    maxNestedTags: 100,
    strictReservedNames: !0,
    jPath: !0,
    // if true, pass jPath string to callbacks; if false, pass matcher instance
    onDangerousProperty: Fs,
  };
function Uu(e, t) {
  if (typeof e != 'string') return;
  const r = e.toLowerCase();
  if (fi.some(n => r === n.toLowerCase()))
    throw new Error(
      `[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  if ($s.some(n => r === n.toLowerCase()))
    throw new Error(
      `[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
}
function js(e, t) {
  return typeof e == 'boolean'
    ? {
        enabled: e,
        // true or false
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
      : js(!0);
}
const Hu = function (e) {
  const t = Object.assign({}, ju, e),
    r = [
      { value: t.attributeNamePrefix, name: 'attributeNamePrefix' },
      { value: t.attributesGroupName, name: 'attributesGroupName' },
      { value: t.textNodeName, name: 'textNodeName' },
      { value: t.cdataPropName, name: 'cdataPropName' },
      { value: t.commentPropName, name: 'commentPropName' },
    ];
  for (const { value: n, name: i } of r) n && Uu(n, i);
  return (
    t.onDangerousProperty === null && (t.onDangerousProperty = Fs),
    (t.processEntities = js(t.processEntities, t.htmlEntities)),
    (t.unpairedTagsSet = new Set(t.unpairedTags)),
    t.stopNodes &&
      Array.isArray(t.stopNodes) &&
      (t.stopNodes = t.stopNodes.map(n =>
        typeof n == 'string' && n.startsWith('*.') ? '..' + n.substring(2) : n
      )),
    t
  );
};
let qr;
typeof Symbol != 'function'
  ? (qr = '@@xmlMetadata')
  : (qr = /* @__PURE__ */ Symbol('XML Node Metadata'));
class ot {
  constructor(t) {
    ((this.tagname = t), (this.child = []), (this[':@'] = /* @__PURE__ */ Object.create(null)));
  }
  add(t, r) {
    (t === '__proto__' && (t = '#__proto__'), this.child.push({ [t]: r }));
  }
  addChild(t, r) {
    (t.tagname === '__proto__' && (t.tagname = '#__proto__'),
      t[':@'] && Object.keys(t[':@']).length > 0
        ? this.child.push({ [t.tagname]: t.child, ':@': t[':@'] })
        : this.child.push({ [t.tagname]: t.child }),
      r !== void 0 && (this.child[this.child.length - 1][qr] = { startIndex: r }));
  }
  /** symbol used for metadata */
  static getMetaDataSymbol() {
    return qr;
  }
}
class Wu {
  constructor(t) {
    ((this.suppressValidationErr = !t), (this.options = t));
  }
  readDocType(t, r) {
    const n = /* @__PURE__ */ Object.create(null);
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
          if (a && ht(t, '!ENTITY', r)) {
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
          } else if (a && ht(t, '!ELEMENT', r)) {
            r += 8;
            const { index: f } = this.readElementExp(t, r + 1);
            r = f;
          } else if (a && ht(t, '!ATTLIST', r)) r += 8;
          else if (a && ht(t, '!NOTATION', r)) {
            r += 9;
            const { index: f } = this.readNotationExp(t, r + 1, this.suppressValidationErr);
            r = f;
          } else if (ht(t, '!--', r)) s = !0;
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
    if ((Kt(i), (r = pe(t, r)), !this.suppressValidationErr)) {
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
    (!this.suppressValidationErr && Kt(i), (r = pe(t, r)));
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
    if (!this.suppressValidationErr && !on(i)) throw new Error(`Invalid element name: "${i}"`);
    r = pe(t, r);
    let o = '';
    if (t[r] === 'E' && ht(t, 'MPTY', r)) r += 4;
    else if (t[r] === 'A' && ht(t, 'NY', r)) r += 2;
    else if (t[r] === '(') {
      r++;
      const a = r;
      for (; r < t.length && t[r] !== ')'; ) r++;
      if (((o = t.substring(a, r)), t[r] !== ')')) throw new Error('Unterminated content model');
    } else if (!this.suppressValidationErr)
      throw new Error(`Invalid Element Expression, found "${t[r]}"`);
    return {
      elementName: i,
      contentModel: o.trim(),
      index: r,
    };
  }
  readAttlistExp(t, r) {
    r = pe(t, r);
    let n = r;
    for (; r < t.length && !/\s/.test(t[r]); ) r++;
    let i = t.substring(n, r);
    for (Kt(i), r = pe(t, r), n = r; r < t.length && !/\s/.test(t[r]); ) r++;
    let o = t.substring(n, r);
    if (!Kt(o)) throw new Error(`Invalid attribute name: "${o}"`);
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
        if (((l = l.trim()), !Kt(l))) throw new Error(`Invalid notation name: "${l}"`);
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
      {
        elementName: i,
        attributeName: o,
        attributeType: a,
        defaultValue: s,
        index: r,
      }
    );
  }
}
const pe = (e, t) => {
  for (; t < e.length && /\s/.test(e[t]); ) t++;
  return t;
};
function ht(e, t, r) {
  for (let n = 0; n < t.length; n++) if (t[n] !== e[r + n + 1]) return !1;
  return !0;
}
function Kt(e) {
  if (on(e)) return e;
  throw new Error(`Invalid entity name ${e}`);
}
const Bu = /^[-+]?0x[a-fA-F0-9]+$/,
  qu = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,
  Xu = {
    hex: !0,
    // oct: false,
    leadingZeros: !0,
    decimalPoint: '.',
    eNotation: !0,
    //skipLike: /regex/,
    infinity: 'original',
    // "null", "infinity" (Infinity type), "string" ("Infinity" (the string literal))
  };
function zu(e, t = {}) {
  if (((t = Object.assign({}, Xu, t)), !e || typeof e != 'string')) return e;
  let r = e.trim();
  if (r.length === 0) return e;
  if (t.skipLike !== void 0 && t.skipLike.test(r)) return e;
  if (r === '0') return 0;
  if (t.hex && Bu.test(r)) return Ju(r, 16);
  if (isFinite(r)) {
    if (r.includes('e') || r.includes('E')) return Gu(e, r, t);
    {
      const n = qu.exec(r);
      if (n) {
        const i = n[1] || '',
          o = n[2];
        let a = Yu(n[3]);
        const s = i
          ? // 0., -00., 000.
            e[o.length + 1] === '.'
          : e[o.length] === '.';
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
  } else return Zu(e, Number(r), t);
}
const Ku = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function Gu(e, t, r) {
  if (!r.eNotation) return e;
  const n = t.match(Ku);
  if (n) {
    let i = n[1] || '';
    const o = n[3].indexOf('e') === -1 ? 'E' : 'e',
      a = n[2],
      s = i
        ? // 0E.
          e[a.length + 1] === o
        : e[a.length] === o;
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
function Yu(e) {
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
function Ju(e, t) {
  if (parseInt) return parseInt(e, t);
  if (Number.parseInt) return Number.parseInt(e, t);
  if (window && window.parseInt) return window.parseInt(e, t);
  throw new Error('parseInt, Number.parseInt, window.parseInt are not supported');
}
function Zu(e, t, r) {
  const n = t === 1 / 0;
  switch (r.infinity.toLowerCase()) {
    case 'null':
      return null;
    case 'infinity':
      return t;
    // Return Infinity or -Infinity
    case 'string':
      return n ? 'Infinity' : '-Infinity';
    default:
      return e;
  }
}
function Qu(e) {
  return typeof e == 'function'
    ? e
    : Array.isArray(e)
      ? t => {
          for (const r of e)
            if ((typeof r == 'string' && t === r) || (r instanceof RegExp && r.test(t))) return !0;
        }
      : () => !1;
}
class ho {
  /**
   * Create a new Expression
   * @param {string} pattern - Pattern string (e.g., "root.users.user", "..user[id]")
   * @param {Object} options - Configuration options
   * @param {string} options.separator - Path separator (default: '.')
   */
  constructor(t, r = {}, n) {
    ((this.pattern = t),
      (this.separator = r.separator || '.'),
      (this.segments = this._parse(t)),
      (this.data = n),
      (this._hasDeepWildcard = this.segments.some(i => i.type === 'deep-wildcard')),
      (this._hasAttributeCondition = this.segments.some(i => i.attrName !== void 0)),
      (this._hasPositionSelector = this.segments.some(i => i.position !== void 0)));
  }
  /**
   * Parse pattern string into segments
   * @private
   * @param {string} pattern - Pattern to parse
   * @returns {Array} Array of segment objects
   */
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
  /**
   * Parse a single segment
   * @private
   * @param {string} part - Segment string (e.g., "user", "ns::user", "user[id]", "ns::user:first")
   * @returns {Object} Segment object
   */
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
  /**
   * Get the number of segments
   * @returns {number}
   */
  get length() {
    return this.segments.length;
  }
  /**
   * Check if expression contains deep wildcard
   * @returns {boolean}
   */
  hasDeepWildcard() {
    return this._hasDeepWildcard;
  }
  /**
   * Check if expression has attribute conditions
   * @returns {boolean}
   */
  hasAttributeCondition() {
    return this._hasAttributeCondition;
  }
  /**
   * Check if expression has position selectors
   * @returns {boolean}
   */
  hasPositionSelector() {
    return this._hasPositionSelector;
  }
  /**
   * Get string representation
   * @returns {string}
   */
  toString() {
    return this.pattern;
  }
}
class ed {
  constructor() {
    ((this._byDepthAndTag = /* @__PURE__ */ new Map()),
      (this._wildcardByDepth = /* @__PURE__ */ new Map()),
      (this._deepWildcards = []),
      (this._patterns = /* @__PURE__ */ new Set()),
      (this._sealed = !1));
  }
  /**
   * Add an Expression to the set.
   * Duplicate patterns (same pattern string) are silently ignored.
   *
   * @param {import('./Expression.js').default} expression - A pre-constructed Expression instance
   * @returns {this} for chaining
   * @throws {TypeError} if called after seal()
   *
   * @example
   * set.add(new Expression('root.users.user'));
   * set.add(new Expression('..script'));
   */
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
  /**
   * Add multiple expressions at once.
   *
   * @param {import('./Expression.js').default[]} expressions - Array of Expression instances
   * @returns {this} for chaining
   *
   * @example
   * set.addAll([
   *   new Expression('root.users.user'),
   *   new Expression('root.config.setting'),
   * ]);
   */
  addAll(t) {
    for (const r of t) this.add(r);
    return this;
  }
  /**
   * Check whether a pattern string is already present in the set.
   *
   * @param {import('./Expression.js').default} expression
   * @returns {boolean}
   */
  has(t) {
    return this._patterns.has(t.pattern);
  }
  /**
   * Number of expressions in the set.
   * @type {number}
   */
  get size() {
    return this._patterns.size;
  }
  /**
   * Seal the set against further modifications.
   * Useful to prevent accidental mutations after config is built.
   * Calling add() or addAll() on a sealed set throws a TypeError.
   *
   * @returns {this}
   */
  seal() {
    return ((this._sealed = !0), this);
  }
  /**
   * Whether the set has been sealed.
   * @type {boolean}
   */
  get isSealed() {
    return this._sealed;
  }
  /**
   * Test whether the matcher's current path matches any expression in the set.
   *
   * Evaluation order (cheapest → most expensive):
   *  1. Exact depth + tag bucket  — O(1) lookup, typically 0–2 expressions
   *  2. Depth-only wildcard bucket — O(1) lookup, rare
   *  3. Deep-wildcard list         — always checked, but usually small
   *
   * @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
   * @returns {boolean} true if any expression matches the current path
   *
   * @example
   * if (stopNodes.matchesAny(matcher)) {
   *   // handle stop node
   * }
   */
  matchesAny(t) {
    return this.findMatch(t) !== null;
  }
  /**
   * Find and return the first Expression that matches the matcher's current path.
   *
   * Uses the same evaluation order as matchesAny (cheapest → most expensive):
   *  1. Exact depth + tag bucket
   *  2. Depth-only wildcard bucket
   *  3. Deep-wildcard list
   *
   * @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
   * @returns {import('./Expression.js').default | null} the first matching Expression, or null
   *
   * @example
   * const expr = stopNodes.findMatch(matcher);
   * if (expr) {
   *   // access expr.config, expr.pattern, etc.
   * }
   */
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
class td {
  /**
   * @param {Matcher} matcher - The parent Matcher instance to read from.
   */
  constructor(t) {
    this._matcher = t;
  }
  /**
   * Get the path separator used by the parent matcher.
   * @returns {string}
   */
  get separator() {
    return this._matcher.separator;
  }
  /**
   * Get current tag name.
   * @returns {string|undefined}
   */
  getCurrentTag() {
    const t = this._matcher.path;
    return t.length > 0 ? t[t.length - 1].tag : void 0;
  }
  /**
   * Get current namespace.
   * @returns {string|undefined}
   */
  getCurrentNamespace() {
    const t = this._matcher.path;
    return t.length > 0 ? t[t.length - 1].namespace : void 0;
  }
  /**
   * Get current node's attribute value.
   * @param {string} attrName
   * @returns {*}
   */
  getAttrValue(t) {
    const r = this._matcher.path;
    if (r.length !== 0) return r[r.length - 1].values?.[t];
  }
  /**
   * Check if current node has an attribute.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAttr(t) {
    const r = this._matcher.path;
    if (r.length === 0) return !1;
    const n = r[r.length - 1];
    return n.values !== void 0 && t in n.values;
  }
  /**
   * Get current node's sibling position (child index in parent).
   * @returns {number}
   */
  getPosition() {
    const t = this._matcher.path;
    return t.length === 0 ? -1 : (t[t.length - 1].position ?? 0);
  }
  /**
   * Get current node's repeat counter (occurrence count of this tag name).
   * @returns {number}
   */
  getCounter() {
    const t = this._matcher.path;
    return t.length === 0 ? -1 : (t[t.length - 1].counter ?? 0);
  }
  /**
   * Get current node's sibling index (alias for getPosition).
   * @returns {number}
   * @deprecated Use getPosition() or getCounter() instead
   */
  getIndex() {
    return this.getPosition();
  }
  /**
   * Get current path depth.
   * @returns {number}
   */
  getDepth() {
    return this._matcher.path.length;
  }
  /**
   * Get path as string.
   * @param {string} [separator] - Optional separator (uses default if not provided)
   * @param {boolean} [includeNamespace=true]
   * @returns {string}
   */
  toString(t, r = !0) {
    return this._matcher.toString(t, r);
  }
  /**
   * Get path as array of tag names.
   * @returns {string[]}
   */
  toArray() {
    return this._matcher.path.map(t => t.tag);
  }
  /**
   * Match current path against an Expression.
   * @param {Expression} expression
   * @returns {boolean}
   */
  matches(t) {
    return this._matcher.matches(t);
  }
  /**
   * Match any expression in the given set against the current path.
   * @param {ExpressionSet} exprSet
   * @returns {boolean}
   */
  matchesAny(t) {
    return t.matchesAny(this._matcher);
  }
}
class rd {
  /**
   * Create a new Matcher.
   * @param {Object} [options={}]
   * @param {string} [options.separator='.'] - Default path separator
   */
  constructor(t = {}) {
    ((this.separator = t.separator || '.'),
      (this.path = []),
      (this.siblingStacks = []),
      (this._pathStringCache = null),
      (this._view = new td(this)));
  }
  /**
   * Push a new tag onto the path.
   * @param {string} tagName
   * @param {Object|null} [attrValues=null]
   * @param {string|null} [namespace=null]
   */
  push(t, r = null, n = null) {
    ((this._pathStringCache = null),
      this.path.length > 0 && (this.path[this.path.length - 1].values = void 0));
    const i = this.path.length;
    this.siblingStacks[i] || (this.siblingStacks[i] = /* @__PURE__ */ new Map());
    const o = this.siblingStacks[i],
      a = n ? `${n}:${t}` : t,
      s = o.get(a) || 0;
    let c = 0;
    for (const l of o.values()) c += l;
    o.set(a, s + 1);
    const f = {
      tag: t,
      position: c,
      counter: s,
    };
    (n != null && (f.namespace = n), r != null && (f.values = r), this.path.push(f));
  }
  /**
   * Pop the last tag from the path.
   * @returns {Object|undefined} The popped node
   */
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
  /**
   * Update current node's attribute values.
   * Useful when attributes are parsed after push.
   * @param {Object} attrValues
   */
  updateCurrent(t) {
    if (this.path.length > 0) {
      const r = this.path[this.path.length - 1];
      t != null && (r.values = t);
    }
  }
  /**
   * Get current tag name.
   * @returns {string|undefined}
   */
  getCurrentTag() {
    return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
  }
  /**
   * Get current namespace.
   * @returns {string|undefined}
   */
  getCurrentNamespace() {
    return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
  }
  /**
   * Get current node's attribute value.
   * @param {string} attrName
   * @returns {*}
   */
  getAttrValue(t) {
    if (this.path.length !== 0) return this.path[this.path.length - 1].values?.[t];
  }
  /**
   * Check if current node has an attribute.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAttr(t) {
    if (this.path.length === 0) return !1;
    const r = this.path[this.path.length - 1];
    return r.values !== void 0 && t in r.values;
  }
  /**
   * Get current node's sibling position (child index in parent).
   * @returns {number}
   */
  getPosition() {
    return this.path.length === 0 ? -1 : (this.path[this.path.length - 1].position ?? 0);
  }
  /**
   * Get current node's repeat counter (occurrence count of this tag name).
   * @returns {number}
   */
  getCounter() {
    return this.path.length === 0 ? -1 : (this.path[this.path.length - 1].counter ?? 0);
  }
  /**
   * Get current node's sibling index (alias for getPosition).
   * @returns {number}
   * @deprecated Use getPosition() or getCounter() instead
   */
  getIndex() {
    return this.getPosition();
  }
  /**
   * Get current path depth.
   * @returns {number}
   */
  getDepth() {
    return this.path.length;
  }
  /**
   * Get path as string.
   * @param {string} [separator] - Optional separator (uses default if not provided)
   * @param {boolean} [includeNamespace=true]
   * @returns {string}
   */
  toString(t, r = !0) {
    const n = t || this.separator;
    if (n === this.separator && r === !0) {
      if (this._pathStringCache !== null) return this._pathStringCache;
      const o = this.path.map(a => (a.namespace ? `${a.namespace}:${a.tag}` : a.tag)).join(n);
      return ((this._pathStringCache = o), o);
    }
    return this.path.map(o => (r && o.namespace ? `${o.namespace}:${o.tag}` : o.tag)).join(n);
  }
  /**
   * Get path as array of tag names.
   * @returns {string[]}
   */
  toArray() {
    return this.path.map(t => t.tag);
  }
  /**
   * Reset the path to empty.
   */
  reset() {
    ((this._pathStringCache = null), (this.path = []), (this.siblingStacks = []));
  }
  /**
   * Match current path against an Expression.
   * @param {Expression} expression
   * @returns {boolean}
   */
  matches(t) {
    const r = t.segments;
    return r.length === 0
      ? !1
      : t.hasDeepWildcard()
        ? this._matchWithDeepWildcard(r)
        : this._matchSimple(r);
  }
  /**
   * @private
   */
  _matchSimple(t) {
    if (this.path.length !== t.length) return !1;
    for (let r = 0; r < t.length; r++)
      if (!this._matchSegment(t[r], this.path[r], r === this.path.length - 1)) return !1;
    return !0;
  }
  /**
   * @private
   */
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
  /**
   * @private
   */
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
  /**
   * Match any expression in the given set against the current path.
   * @param {ExpressionSet} exprSet
   * @returns {boolean}
   */
  matchesAny(t) {
    return t.matchesAny(this);
  }
  /**
   * Create a snapshot of current state.
   * @returns {Object}
   */
  snapshot() {
    return {
      path: this.path.map(t => ({ ...t })),
      siblingStacks: this.siblingStacks.map(t => new Map(t)),
    };
  }
  /**
   * Restore state from snapshot.
   * @param {Object} snapshot
   */
  restore(t) {
    ((this._pathStringCache = null),
      (this.path = t.path.map(r => ({ ...r }))),
      (this.siblingStacks = t.siblingStacks.map(r => new Map(r))));
  }
  /**
   * Return the read-only {@link MatcherView} for this matcher.
   *
   * The same instance is returned on every call — no allocation occurs.
   * It always reflects the current parser state and is safe to pass to
   * user callbacks without risk of accidental mutation.
   *
   * @returns {MatcherView}
   *
   * @example
   * const view = matcher.readOnly();
   * // pass view to callbacks — it stays in sync automatically
   * view.matches(expr);       // ✓
   * view.getCurrentTag();     // ✓
   * // view.push(...)         // ✗ method does not exist — caught by TypeScript
   */
  readOnly() {
    return this._view;
  }
}
function nd(e, t) {
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
function id(e) {
  if (!e || typeof e != 'string') return;
  const t = e.indexOf(':');
  if (t !== -1 && t > 0) {
    const r = e.substring(0, t);
    if (r !== 'xmlns') return r;
  }
}
class od {
  constructor(t, r) {
    ((this.options = t),
      (this.currentNode = null),
      (this.tagsNodeStack = []),
      (this.parseXml = ud),
      (this.parseTextData = sd),
      (this.resolveNameSpace = ad),
      (this.buildAttributesMap = ld),
      (this.isItStopNode = pd),
      (this.replaceEntitiesValue = fd),
      (this.readStopNodeData = vd),
      (this.saveTextToParentTag = hd),
      (this.addChild = dd),
      (this.ignoreAttributesFn = Qu(this.options.ignoreAttributes)),
      (this.entityExpansionCount = 0),
      (this.currentExpandedLength = 0));
    let n = { ...Ds };
    (this.options.entityDecoder
      ? (this.entityDecoder = this.options.entityDecoder)
      : (typeof this.options.htmlEntities == 'object'
          ? (n = this.options.htmlEntities)
          : this.options.htmlEntities === !0 && (n = { ...Mu, ...Pu }),
        (this.entityDecoder = new Fu({
          namedEntities: { ...n, ...r },
          numericAllowed: this.options.htmlEntities,
          limit: {
            maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
            maxExpandedLength: this.options.processEntities.maxExpandedLength,
            applyLimitsTo: this.options.processEntities.appliesTo,
          },
          //postCheck: resolved => resolved
        }))),
      (this.matcher = new rd()),
      (this.readonlyMatcher = this.matcher.readOnly()),
      (this.isCurrentNodeStopNode = !1),
      (this.stopNodeExpressionsSet = new ed()));
    const i = this.options.stopNodes;
    if (i && i.length > 0) {
      for (let o = 0; o < i.length; o++) {
        const a = i[o];
        typeof a == 'string'
          ? this.stopNodeExpressionsSet.add(new ho(a))
          : a instanceof ho && this.stopNodeExpressionsSet.add(a);
      }
      this.stopNodeExpressionsSet.seal();
    }
  }
}
function sd(e, t, r, n, i, o, a) {
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
          ? Wn(e, s.parseTagValue, s.numberParseOptions)
          : e;
  }
}
function ad(e) {
  if (this.options.removeNSPrefix) {
    const t = e.split(':'),
      r = e.charAt(0) === '/' ? '/' : '';
    if (t[0] === 'xmlns') return '';
    t.length === 2 && (e = r + t[1]);
  }
  return e;
}
const cd = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, 'gm');
function ld(e, t, r, n = !1) {
  const i = this.options;
  if (n === !0 || (i.ignoreAttributes !== !0 && typeof e == 'string')) {
    const o = Rs(e, cd),
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
          (N = Us(N, i)),
          o[m][4] !== void 0)
        ) {
          const L = c[m],
            R = i.attributeValueProcessor(C, L, u);
          (R == null
            ? (s[N] = L)
            : typeof R != typeof L || R !== L
              ? (s[N] = R)
              : (s[N] = Wn(L, i.parseAttributeValue, i.numberParseOptions)),
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
const ud = function (e) {
  e = e.replace(
    /\r\n?/g,
    `
`
  );
  const t = new ot('!xml');
  let r = t,
    n = '';
  (this.matcher.reset(),
    this.entityDecoder.reset(),
    (this.entityExpansionCount = 0),
    (this.currentExpandedLength = 0));
  const i = this.options,
    o = new Wu(i.processEntities),
    a = e.length;
  for (let s = 0; s < a; s++)
    if (e[s] === '<') {
      const f = e.charCodeAt(s + 1);
      if (f === 47) {
        const l = It(e, '>', s, 'Closing Tag is not closed.');
        let u = e.substring(s + 2, l).trim();
        if (i.removeNSPrefix) {
          const m = u.indexOf(':');
          m !== -1 && (u = u.substr(m + 1));
        }
        ((u = Nn(i.transformTagName, u, '', i).tagName),
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
        let l = Hn(e, s, !1, '?>');
        if (!l) throw new Error('Pi Tag is not closed.');
        n = this.saveTextToParentTag(n, r, this.readonlyMatcher);
        const u = this.buildAttributesMap(l.tagExp, this.matcher, l.tagName, !0);
        if (u) {
          const p = u[this.options.attributeNamePrefix + 'version'];
          this.entityDecoder.setXmlVersion(Number(p) || 1);
        }
        if (!((i.ignoreDeclaration && l.tagName === '?xml') || i.ignorePiTags)) {
          const p = new ot(l.tagName);
          (p.add(i.textNodeName, ''),
            l.tagName !== l.tagExp &&
              l.attrExpPresent &&
              i.ignoreAttributes !== !0 &&
              (p[':@'] = u),
            this.addChild(r, p, this.readonlyMatcher, s));
        }
        s = l.closeIndex + 1;
      } else if (f === 33 && e.charCodeAt(s + 2) === 45 && e.charCodeAt(s + 3) === 45) {
        const l = It(e, '-->', s + 4, 'Comment is not closed.');
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
        const l = It(e, ']]>', s, 'CDATA is not closed.') - 2,
          u = e.substring(s + 9, l);
        n = this.saveTextToParentTag(n, r, this.readonlyMatcher);
        let p = this.parseTextData(u, r.tagname, this.readonlyMatcher, !0, !1, !0, !0);
        (p == null && (p = ''),
          i.cdataPropName
            ? r.add(i.cdataPropName, [{ [i.textNodeName]: u }])
            : r.add(i.textNodeName, p),
          (s = l + 2));
      } else {
        let l = Hn(e, s, i.removeNSPrefix);
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
          (({ tagName: u, tagExp: m } = Nn(i.transformTagName, u, m, i)),
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
        let R = !1;
        m.length > 0 &&
          m.lastIndexOf('/') === m.length - 1 &&
          ((R = !0),
          u[u.length - 1] === '/'
            ? ((u = u.substr(0, u.length - 1)), (m = u))
            : (m = m.substr(0, m.length - 1)),
          (C = u !== m));
        let P = null,
          D;
        ((D = id(p)),
          u !== t.tagname && this.matcher.push(u, {}, D),
          u !== m && C && ((P = this.buildAttributesMap(m, this.matcher, u)), P && nd(P, i)),
          u !== t.tagname && (this.isCurrentNodeStopNode = this.isItStopNode()));
        const Z = s;
        if (this.isCurrentNodeStopNode) {
          let k = '';
          if (R) s = l.closeIndex;
          else if (i.unpairedTagsSet.has(u)) s = l.closeIndex;
          else {
            const ie = this.readStopNodeData(e, p, N + 1);
            if (!ie) throw new Error(`Unexpected end of ${p}`);
            ((s = ie.i), (k = ie.tagContent));
          }
          const z = new ot(u);
          (P && (z[':@'] = P),
            z.add(i.textNodeName, k),
            this.matcher.pop(),
            (this.isCurrentNodeStopNode = !1),
            this.addChild(r, z, this.readonlyMatcher, Z));
        } else {
          if (R) {
            ({ tagName: u, tagExp: m } = Nn(i.transformTagName, u, m, i));
            const k = new ot(u);
            (P && (k[':@'] = P),
              this.addChild(r, k, this.readonlyMatcher, Z),
              this.matcher.pop(),
              (this.isCurrentNodeStopNode = !1));
          } else if (i.unpairedTagsSet.has(u)) {
            const k = new ot(u);
            (P && (k[':@'] = P),
              this.addChild(r, k, this.readonlyMatcher, Z),
              this.matcher.pop(),
              (this.isCurrentNodeStopNode = !1),
              (s = l.closeIndex));
            continue;
          } else {
            const k = new ot(u);
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
function dd(e, t, r, n) {
  this.options.captureMetaData || (n = void 0);
  const i = this.options.jPath ? r.toString() : r,
    o = this.options.updateTag(t.tagname, i, t[':@']);
  o === !1 || (typeof o == 'string' && (t.tagname = o), e.addChild(t, n));
}
function fd(e, t, r) {
  const n = this.options.processEntities;
  if (!n || !n.enabled) return e;
  if (n.allowedTags) {
    const i = this.options.jPath ? r.toString() : r;
    if (!(Array.isArray(n.allowedTags) ? n.allowedTags.includes(t) : n.allowedTags(t, i))) return e;
  }
  if (n.tagFilter) {
    const i = this.options.jPath ? r.toString() : r;
    if (!n.tagFilter(t, i)) return e;
  }
  return this.entityDecoder.decode(e);
}
function hd(e, t, r, n) {
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
function pd() {
  return this.stopNodeExpressionsSet.size === 0
    ? !1
    : this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
function gd(e, t, r = '>') {
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
function It(e, t, r, n) {
  const i = e.indexOf(t, r);
  if (i === -1) throw new Error(n);
  return i + t.length - 1;
}
function md(e, t, r, n) {
  const i = e.indexOf(t, r);
  if (i === -1) throw new Error(n);
  return i;
}
function Hn(e, t, r, n = '>') {
  const i = gd(e, t + 1, n);
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
  return {
    tagName: c,
    tagExp: o,
    closeIndex: a,
    attrExpPresent: f,
    rawTagName: l,
  };
}
function vd(e, t, r) {
  const n = r;
  let i = 1;
  const o = e.length;
  for (; r < o; r++)
    if (e[r] === '<') {
      const a = e.charCodeAt(r + 1);
      if (a === 47) {
        const s = md(e, '>', r, `${t} is not closed`);
        if (e.substring(r + 2, s).trim() === t && (i--, i === 0))
          return {
            tagContent: e.substring(n, r),
            i: s,
          };
        r = s;
      } else if (a === 63) r = It(e, '?>', r + 1, 'StopNode is not closed.');
      else if (a === 33 && e.charCodeAt(r + 2) === 45 && e.charCodeAt(r + 3) === 45)
        r = It(e, '-->', r + 3, 'StopNode is not closed.');
      else if (a === 33 && e.charCodeAt(r + 2) === 91)
        r = It(e, ']]>', r, 'StopNode is not closed.') - 2;
      else {
        const s = Hn(e, r, '>');
        s &&
          ((s && s.tagName) === t && s.tagExp[s.tagExp.length - 1] !== '/' && i++,
          (r = s.closeIndex));
      }
    }
}
function Wn(e, t, r) {
  if (t && typeof e == 'string') {
    const n = e.trim();
    return n === 'true' ? !0 : n === 'false' ? !1 : zu(e, r);
  } else return Eu(e) ? e : '';
}
function Nn(e, t, r, n) {
  if (e) {
    const i = e(t);
    (r === t && (r = i), (t = i));
  }
  return ((t = Us(t, n)), { tagName: t, tagExp: r });
}
function Us(e, t) {
  if ($s.includes(e))
    throw new Error(
      `[SECURITY] Invalid name: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  return fi.includes(e) ? t.onDangerousProperty(e) : e;
}
const xn = ot.getMetaDataSymbol();
function bd(e, t) {
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
function _d(e, t, r, n) {
  return Hs(e, t, r, n);
}
function Hs(e, t, r, n) {
  let i;
  const o = {};
  for (let a = 0; a < e.length; a++) {
    const s = e[a],
      c = yd(s);
    if (c !== void 0 && c !== t.textNodeName) {
      const f = bd(s[':@'] || {}, t.attributeNamePrefix);
      r.push(c, f);
    }
    if (c === t.textNodeName) i === void 0 ? (i = s[c]) : (i += '' + s[c]);
    else {
      if (c === void 0) continue;
      if (s[c]) {
        let f = Hs(s[c], t, r, n);
        const l = Ed(f, t);
        if (
          (s[':@']
            ? wd(f, s[':@'], n, t)
            : Object.keys(f).length === 1 && f[t.textNodeName] !== void 0 && !t.alwaysCreateTextNode
              ? (f = f[t.textNodeName])
              : Object.keys(f).length === 0 &&
                (t.alwaysCreateTextNode ? (f[t.textNodeName] = '') : (f = '')),
          s[xn] !== void 0 && typeof f == 'object' && f !== null && (f[xn] = s[xn]),
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
function yd(e) {
  const t = Object.keys(e);
  for (let r = 0; r < t.length; r++) {
    const n = t[r];
    if (n !== ':@') return n;
  }
}
function wd(e, t, r, n) {
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
function Ed(e, t) {
  const { textNodeName: r } = t,
    n = Object.keys(e).length;
  return !!(n === 0 || (n === 1 && (e[r] || typeof e[r] == 'boolean' || e[r] === 0)));
}
class Nd {
  constructor(t) {
    ((this.externalEntities = {}), (this.options = Hu(t)));
  }
  /**
   * Parse XML dats to JS object
   * @param {string|Uint8Array} xmlData
   * @param {boolean|Object} validationOption
   */
  parse(t, r) {
    if (typeof t != 'string' && t.toString) t = t.toString();
    else if (typeof t != 'string')
      throw new Error('XML data is accepted in String or Bytes[] form.');
    if (r) {
      r === !0 && (r = {});
      const o = xu(t, r);
      if (o !== !0) throw Error(`${o.err.msg}:${o.err.line}:${o.err.col}`);
    }
    const n = new od(this.options, this.externalEntities),
      i = n.parseXml(t);
    return this.options.preserveOrder || i === void 0
      ? i
      : _d(i, this.options, n.matcher, n.readonlyMatcher);
  }
  /**
   * Add Entity which is not by default supported by this library
   * @param {string} key
   * @param {string} value
   */
  addEntity(t, r) {
    if (r.indexOf('&') !== -1) throw new Error("Entity value can't have '&'");
    if (t.indexOf('&') !== -1 || t.indexOf(';') !== -1)
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    if (r === '&') throw new Error("An entity with value '&' is not permitted");
    this.externalEntities[t] = r;
  }
  /**
   * Returns a Symbol that can be used to access the metadata
   * property on a node.
   *
   * If Symbol is not available in the environment, an ordinary property is used
   * and the name of the property is here returned.
   *
   * The XMLMetaData property is only present when `captureMetaData`
   * is true in the options.
   */
  static getMetaDataSymbol() {
    return ot.getMetaDataSymbol();
  }
}
const xd = e => {
    const r = new Nd({
      ignoreAttributes: !1,
      attributeNamePrefix: 'attr_',
      removeNSPrefix: !0,
    }).parse(e);
    return Q(
      r.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan,
      di
    );
  },
  Sd = ['width', 'height'],
  Od = ['transform'],
  Cd = ['transform', 'onClick'],
  kd = ['transform'],
  Td = ['width', 'height'],
  Vd = ['x', 'width', 'height'],
  Ad = ['transform'],
  Id = ['x', 'y', 'font-size'],
  Pd = ['transform', 'onClick'],
  Md = ['width', 'height'],
  Ld = /* @__PURE__ */ Zo({
    __name: 'DeckRendering',
    props: {
      deck: { type: Object, required: !0 },
      scale: { type: Number, required: !0 },
      availability: {
        type: Object,
      },
      vertical: { type: Boolean, default: !1 },
    },
    emits: ['select'],
    setup(e, { emit: t }) {
      const r = e,
        n = sr(/* @__PURE__ */ new Map()),
        i = sr(/* @__PURE__ */ new Map()),
        o = t,
        a = Vr(
          () =>
            r.deck.deckspaces
              ?.flatMap(l =>
                l instanceof ur ? l.passengerSpots?.filter(u => u instanceof Ps) || [] : []
              )
              .map(
                l => (
                  (l.availability =
                    r.availability && l.attr_id
                      ? jn[r.availability[l.attr_id] ?? 'Undefined']
                      : jn.Undefined),
                  l
                )
              ) || []
        ),
        s = Vr(
          () =>
            r.deck.deckspaces?.flatMap(l => (l instanceof ur ? (l.deckEntrances ?? []) : [])) ?? []
        ),
        c = Vr(() => {
          const { width: l, height: u } = r.deck.getBoundingBox();
          return {
            width: l * r.scale + 10,
            height: u * r.scale + 10,
          };
        });
      function f(l, u) {
        o('select', { element: u, ctrlKey: l.ctrlKey || l.metaKey });
      }
      return (l, u) => (
        Bt(),
        qt(
          'svg',
          {
            width: e.vertical ? c.value.height : c.value.width,
            height: e.vertical ? c.value.width : c.value.height,
            class: 'vehicle-frame',
            style: { 'user-select': 'none' },
          },
          [
            Fe(
              'g',
              {
                transform: `rotate(
        ${e.vertical ? 90 : 0},
        ${c.value.height / 2},
        ${c.value.height / 2}
      )`,
              },
              [
                Fe(
                  'rect',
                  Ns(
                    { ...e.deck.getShape(e.scale), y: 5 },
                    {
                      onClick: u[0] || (u[0] = yn(p => f(p, e.deck), ['stop'])),
                      class: 'vehicle-deck',
                    }
                  ),
                  null,
                  16
                ),
                (Bt(!0),
                qt(
                  Ne,
                  null,
                  Ci(
                    a.value,
                    (p, m) => (
                      Bt(),
                      qt(
                        'g',
                        {
                          key: `seat-${m}`,
                          transform: `translate(${n.get(p)?.x ?? p.getShape(e.scale).x},
                              ${n.get(p)?.y ?? p.getShape(e.scale).y})`,
                          onClick: yn(C => f(C, p), ['stop']),
                          class: Tt(`seat ${p.getClasses()}`),
                        },
                        [
                          Fe(
                            'g',
                            {
                              class: 'seat__container',
                              transform: `rotate(  ${p.Orientation === 'forwards' ? 180 : 0},  ${p.getShape(e.scale).width / 2}, ${p.getShape(e.scale).height / 2})`,
                            },
                            [
                              Fe(
                                'rect',
                                {
                                  width: p.getShape(e.scale).width,
                                  height: p.getShape(e.scale).height,
                                  class: Tt('seat__base'),
                                },
                                null,
                                8,
                                Td
                              ),
                              Fe(
                                'rect',
                                {
                                  x: p.getShape(e.scale).width * 0.9,
                                  y: '0',
                                  width: p.getShape(e.scale).width * 0.2,
                                  height: p.getShape(e.scale).height,
                                  rx: '6',
                                  ry: '6',
                                  class: Tt(['seat__backrest', 'seat__backrest']),
                                  'pointer-events': 'none',
                                },
                                null,
                                8,
                                Vd
                              ),
                            ],
                            8,
                            kd
                          ),
                          Fe(
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
                              Fe(
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
                                _o(p.Label),
                                9,
                                Id
                              ),
                            ],
                            8,
                            Ad
                          ),
                        ],
                        10,
                        Cd
                      )
                    )
                  ),
                  128
                )),
                (Bt(!0),
                qt(
                  Ne,
                  null,
                  Ci(
                    s.value,
                    (p, m) => (
                      Bt(),
                      qt(
                        'g',
                        {
                          key: `entrance-${m}`,
                          transform: `translate(${i.get(p)?.x ?? p.getShape(e.scale, e.deck.Length, e.deck.Width).x},
                              ${i.get(p)?.y ?? p.getShape(e.scale, e.deck.Length, e.deck.Width).y})`,
                          onClick: yn(C => f(C, p), ['stop']),
                        },
                        [
                          Fe(
                            'rect',
                            {
                              width: p.getShape(e.scale, e.deck.Length, e.deck.Width).width,
                              height: p.getShape(e.scale, e.deck.Length, e.deck.Width).height,
                              class: 'door',
                            },
                            null,
                            8,
                            Md
                          ),
                        ],
                        8,
                        Pd
                      )
                    )
                  ),
                  128
                )),
              ],
              8,
              Od
            ),
          ],
          8,
          Sd
        )
      );
    },
  }),
  Rd =
    '.vehicle-frame{background-color:#f0f0f0;border:1px solid #ccc}.vehicle-deck{fill:#fff;stroke:#68a691;rx:5px;stroke-width:2px}.seat .seat__base{fill:#4caf50}.seat-occupied .seat__base{fill:#f44336}.seat-selected .seat__base,.seat-filtered .seat__base{fill:#ff9800}.seat-undefined .seat__base{fill:#9e9e9e}.seat .seat__base{fill:#d9d9d9;stroke:#7c7c7c;stroke-width:1px;cursor:pointer;rx:5px}.seat .seat__backrest{fill:#7c7c7c}.seat__text{stroke:#7c7c7c;pointer-events:none}.door{fill:#dedede;stroke:#dedede;stroke-width:1px;cursor:pointer}',
  $d = (e, t) => {
    const r = e.__vccOpts || e;
    for (const [n, i] of t) r[n] = i;
    return r;
  },
  Dd = /* @__PURE__ */ $d(Ld, [['styles', [Rd]]]),
  Ws = /* @__PURE__ */ Wl(Dd, {
    shadowRoot: !0,
    styles: [eu],
  });
typeof customElements < 'u' &&
  (customElements.get('deck-rendering') || customElements.define('deck-rendering', Ws));
const jd = {
  DeckRenderingElement: Ws,
  parseNeTEx: xd,
};
export { jd as default };
