// ../../../../NeTEx-Deckplan-Editor/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), te = 1e4, ne = (e) => {
	let t = /* @__PURE__ */ Object.create(null), n = 0;
	return ((r) => {
		let i = t[r];
		return i === void 0 ? (++n > te && (t = /* @__PURE__ */ Object.create(null), n = 1), t[r] = e(r)) : i;
	});
}, re = /-\w/g, T = /* @__PURE__ */ ne((e) => e.replace(re, (e) => e.slice(1).toUpperCase())), ie = /\B([A-Z])/g, E = /* @__PURE__ */ ne((e) => e.replace(ie, "-$1").toLowerCase()), ae = /* @__PURE__ */ ne((e) => e.charAt(0).toUpperCase() + e.slice(1)), oe = /* @__PURE__ */ ne((e) => e ? `on${ae(e)}` : ""), D = (e, t) => !Object.is(e, t), O = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, se = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ce = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, le = (e) => {
	let t = g(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ue, de = () => ue ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function fe(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? ge(r) : fe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var pe = /;(?![^(]*\))/g, me = /:([^]+)/, he = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ge(e) {
	let t = {};
	return e.replace(he, (e) => e.startsWith("/*") ? "" : e).split(pe).forEach((e) => {
		if (e) {
			let n = e.split(me);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function _e(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = _e(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ve = /* @__PURE__ */ e("itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function ye(e) {
	return !!e || e === "";
}
function be(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = we(e[i], t[i], n);
	return r;
}
function xe(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && we(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Se(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? xe(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = u(e, r), a = u(t, r);
		if (i && !a || !i && a || !we(e[r], t[r], n)) return !1;
	}
	return Te(e) === Te(t);
}
function Ce(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function we(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? Ce(e, t, n, be) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : Ce(e, t, n, Se) : String(e) === String(t))));
}
function Te(e) {
	return Object.getPrototypeOf(e) === null && e[Symbol.toPrimitive] == null && typeof e.toString != "function" && typeof e.valueOf != "function" ? x(e) : String(e);
}
var Ee = (e) => !!(e && e.__v_isRef === !0), De = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Ee(e) ? De(e.value) : JSON.stringify(e, Oe, 2) : String(e), Oe = (e, t) => Ee(t) ? Oe(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ke(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ke(e)) } : _(t) ? ke(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ke = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, k, Ae = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && k && (k.active ? (this.parent = k, this.index = (k.scopes || (k.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = k;
			try {
				return k = this, e();
			} finally {
				k = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = k, k = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (k === this) k = this.prevScope;
			else {
				let e = k;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function je() {
	return k;
}
var A, Me = /* @__PURE__ */ new WeakSet(), Ne = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, k && (k.active ? k.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Me.has(this) && (Me.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Le(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Xe(this), Be(this);
		let e = A, t = Ke;
		A = this, Ke = !0;
		try {
			return this.fn();
		} finally {
			Ve(this), A = e, Ke = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) We(e);
			this.deps = this.depsTail = void 0, Xe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Me.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		He(this) && this.run();
	}
	get dirty() {
		return He(this);
	}
}, Pe = 0, Fe, Ie;
function Le(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ie, Ie = e) : (e.next = Fe, Fe = e);
}
function Re() {
	Pe++;
}
function ze() {
	if (--Pe > 0) return;
	if (Ie) {
		let e = Ie;
		for (Ie = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Fe;) {
		let t = Fe;
		for (Fe = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Be(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ve(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), We(r), Ge(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function He(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ue(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ue(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ze) || (e.globalVersion = Ze, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !He(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = A, r = Ke;
	A = e, Ke = !0;
	try {
		Be(e);
		let n = e.fn(e._value);
		(t.version === 0 || D(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		A = n, Ke = r, Ve(e), e.flags &= -3;
	}
}
function We(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) We(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ge(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ke = !0, qe = [];
function Je() {
	qe.push(Ke), Ke = !1;
}
function Ye() {
	let e = qe.pop();
	Ke = e === void 0 || e;
}
function Xe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = A;
		A = void 0;
		try {
			t();
		} finally {
			A = e;
		}
	}
}
var Ze = 0, Qe = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, $e = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!A || !Ke || A === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== A) t = this.activeLink = new Qe(A, this), A.deps ? (t.prevDep = A.depsTail, A.depsTail.nextDep = t, A.depsTail = t) : A.deps = A.depsTail = t, et(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = A.depsTail, t.nextDep = void 0, A.depsTail.nextDep = t, A.depsTail = t, A.deps === t && (A.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ze++, this.notify(e);
	}
	notify(e) {
		Re();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			ze();
		}
	}
};
function et(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) et(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var tt = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ Symbol(""), rt = /* @__PURE__ */ Symbol(""), it = /* @__PURE__ */ Symbol("");
function j(e, t, n) {
	if (Ke && A) {
		let t = tt.get(e);
		t || tt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new $e()), r.map = t, r.key = n), r.track();
	}
}
function at(e, t, n, r, i, a) {
	let o = tt.get(e);
	if (!o) {
		Ze++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Re(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === it || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(it)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(nt)), f(e) && s(o.get(rt)));
				break;
			case "delete":
				i || (s(o.get(nt)), f(e) && s(o.get(rt)));
				break;
			case "set": f(e) && s(o.get(nt));
		}
	}
	ze();
}
function ot(e) {
	let t = /* @__PURE__ */ N(e);
	return t === e || (j(t, "iterate", it), /* @__PURE__ */ M(e)) ? t : /* @__PURE__ */ Gt(e) ? /* @__PURE__ */ Wt(e) ? t.map((e) => Jt(P(e))) : t.map(Jt) : t.map(P);
}
function st(e) {
	return j(e = /* @__PURE__ */ N(e), "iterate", it), e;
}
function ct(e, t) {
	return /* @__PURE__ */ Gt(e) ? Jt(/* @__PURE__ */ Wt(e) ? P(t) : t) : P(t);
}
var lt = {
	__proto__: null,
	[Symbol.iterator]() {
		return ut(this, Symbol.iterator, (e) => ct(this, e));
	},
	concat(...e) {
		return ot(this).concat(...e.map((e) => d(e) ? ot(e) : e));
	},
	entries() {
		return ut(this, "entries", (e) => (e[1] = ct(this, e[1]), e));
	},
	every(e, t) {
		return pt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return pt(this, "filter", e, t, (e) => e.map((e) => ct(this, e)), arguments);
	},
	find(e, t) {
		return pt(this, "find", e, t, (e) => ct(this, e), arguments);
	},
	findIndex(e, t) {
		return pt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return pt(this, "findLast", e, t, (e) => ct(this, e), arguments);
	},
	findLastIndex(e, t) {
		return pt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return pt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ht(this, "includes", e);
	},
	indexOf(...e) {
		return ht(this, "indexOf", e);
	},
	join(e) {
		return ot(this).join(e);
	},
	lastIndexOf(...e) {
		return ht(this, "lastIndexOf", e);
	},
	map(e, t) {
		return pt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return gt(this, "pop");
	},
	push(...e) {
		return gt(this, "push", e);
	},
	reduce(e, ...t) {
		return mt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return mt(this, "reduceRight", e, t);
	},
	shift() {
		return gt(this, "shift");
	},
	some(e, t) {
		return pt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return gt(this, "splice", e);
	},
	toReversed() {
		return ot(this).toReversed();
	},
	toSorted(e) {
		return ot(this).toSorted(e);
	},
	toSpliced(...e) {
		return ot(this).toSpliced(...e);
	},
	unshift(...e) {
		return gt(this, "unshift", e);
	},
	values() {
		return ut(this, "values", (e) => ct(this, e));
	}
};
function ut(e, t, n) {
	let r = st(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ M(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => dt(a.next(), n), i !== ft[t] && Object.defineProperties(e, {
				return: { get() {
					let e = a.return;
					return typeof e == "function" ? e.bind(a) : e;
				} },
				throw: { get() {
					let e = a.throw;
					return typeof e == "function" ? e.bind(a) : e;
				} }
			}), e;
		}
		a._next = a.next, a.next = () => dt(a._next(), n);
	}
	return a;
}
function dt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var ft = Array.prototype;
function pt(e, t, n, r, i, a) {
	let o = st(e), s = o !== e && !/* @__PURE__ */ M(e), c = o[t];
	if (c !== ft[t]) {
		let t = c.apply(e, a);
		return s ? P(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, ct(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function mt(e, t, n, r) {
	let i = st(e), a = i !== e && !/* @__PURE__ */ M(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = ct(e, t)), n.call(this, t, ct(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? ct(e, c) : c;
}
function ht(e, t, n) {
	let r = /* @__PURE__ */ N(e);
	j(r, "iterate", it);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Kt(n[0]) ? (n[0] = /* @__PURE__ */ N(n[0]), r[t](...n)) : i;
}
function gt(e, t, n = []) {
	Je(), Re();
	let r = (/* @__PURE__ */ N(e))[t].apply(e, n);
	return ze(), Ye(), r;
}
var _t = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), vt = /* @__PURE__ */ new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function yt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ N(this);
	return j(t, "has", e), t.hasOwnProperty(e);
}
var bt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Rt : Lt : i ? It : Ft).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = lt[t])) return e;
			if (t === "hasOwnProperty") return yt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ F(e) ? e : n);
		if ((_(t) ? vt.has(t) : _t(t)) || (r || j(e, "get", t), i)) return o;
		if (/* @__PURE__ */ F(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Ht(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Ht(o) : /* @__PURE__ */ Bt(o) : o;
	}
}, xt = class extends bt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Gt(i);
			if (!/* @__PURE__ */ M(n) && !/* @__PURE__ */ Gt(n) && (i = /* @__PURE__ */ N(i), n = /* @__PURE__ */ N(n)), !a && /* @__PURE__ */ F(i) && !/* @__PURE__ */ F(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ F(e) ? e : r);
		return e === /* @__PURE__ */ N(r) && s && (o ? D(n, i) && at(e, "set", t, n, i) : at(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && at(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && vt.has(t) || j(e, "has", t), n;
	}
	ownKeys(e) {
		return j(e, "iterate", d(e) ? "length" : nt), Reflect.ownKeys(e);
	}
}, St = class extends bt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Ct = /* @__PURE__ */ new xt(), wt = /* @__PURE__ */ new St(), Tt = /* @__PURE__ */ new xt(!0), Et = (e) => e, Dt = (e) => Reflect.getPrototypeOf(e);
function Ot(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ N(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? Et : t ? Jt : P;
		return !t && j(a, "iterate", l ? rt : nt), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function kt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function At(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ N(r), a = /* @__PURE__ */ N(n);
			e || (D(n, a) && j(i, "get", n), j(i, "get", a));
			let { has: o } = Dt(i), s = t ? Et : e ? Jt : P;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && j(/* @__PURE__ */ N(t), "iterate", nt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ N(n), i = /* @__PURE__ */ N(t);
			return e || (D(t, i) && j(r, "has", t), j(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ N(a), s = t ? Et : e ? Jt : P;
			return !e && j(o, "iterate", nt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: kt("add"),
		set: kt("set"),
		delete: kt("delete"),
		clear: kt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ N(this), r = Dt(n), i = /* @__PURE__ */ N(e), a = !t && !/* @__PURE__ */ M(e) && !/* @__PURE__ */ Gt(e) ? i : e;
			return r.has.call(n, a) || D(e, a) && r.has.call(n, e) || D(i, a) && r.has.call(n, i) || (n.add(a), at(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ M(n) || /* @__PURE__ */ Gt(n) || (n = /* @__PURE__ */ N(n));
			let r = /* @__PURE__ */ N(this), { has: i, get: a } = Dt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ N(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? D(n, s) && at(r, "set", e, n, s) : at(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ N(this), { has: n, get: r } = Dt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ N(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && at(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ N(this), t = e.size !== 0, n = e.clear();
			return t && at(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ot(r, e, t);
	}), n;
}
function jt(e, t) {
	let n = At(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
}
var Mt = { get: /* @__PURE__ */ jt(!1, !1) }, Nt = { get: /* @__PURE__ */ jt(!1, !0) }, Pt = { get: /* @__PURE__ */ jt(!0, !1) }, Ft = /* @__PURE__ */ new WeakMap(), It = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap();
function zt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return /* @__PURE__ */ Gt(e) ? e : Ut(e, !1, Ct, Mt, Ft);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return Ut(e, !1, Tt, Nt, It);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return Ut(e, !0, wt, Pt, Lt);
}
function Ut(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = zt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return /* @__PURE__ */ Gt(e) ? /* @__PURE__ */ Wt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ N(t) : e;
}
function qt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && se(e, "__v_skip", !0), e;
}
var P = (e) => v(e) ? /* @__PURE__ */ Bt(e) : e, Jt = (e) => v(e) ? /* @__PURE__ */ Ht(e) : e;
// @__NO_SIDE_EFFECTS__
function F(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return Xt(e, !1);
}
function Xt(e, t) {
	return /* @__PURE__ */ F(e) ? e : new Zt(e, t);
}
var Zt = class {
	constructor(e, t) {
		this.dep = new $e(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ N(e), this._value = t ? e : P(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ M(e) || /* @__PURE__ */ Gt(e);
		e = n ? e : /* @__PURE__ */ N(e), D(e, t) && (this._rawValue = e, this._value = n ? e : P(e), this.dep.trigger());
	}
};
function Qt(e) {
	return /* @__PURE__ */ F(e) ? e.value : e;
}
var $t = {
	get: (e, t, n) => t === "__v_raw" ? e : Qt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ F(i) && !/* @__PURE__ */ F(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function en(e) {
	return /* @__PURE__ */ Wt(e) ? e : new Proxy(e, $t);
}
var tn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new $e(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ze - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && A !== this) return Le(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ue(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function nn(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new tn(r, i, n);
}
var rn = {}, an = /* @__PURE__ */ new WeakMap(), on = void 0;
function sn(e, t = !1, n = on) {
	if (n) {
		let t = an.get(n);
		t || an.set(n, t = []), t.push(e);
	}
}
function cn(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ M(e) || o === !1 || o === 0 ? ln(e, 1) : ln(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ F(e) ? (g = () => e.value, y = /* @__PURE__ */ M(e)) : /* @__PURE__ */ Wt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Wt(e) || /* @__PURE__ */ M(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ F(e)) return e.value;
		if (/* @__PURE__ */ Wt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Je();
			try {
				_();
			} finally {
				Ye();
			}
		}
		let t = on;
		on = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			on = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => ln(e(), t);
	}
	let x = je(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			try {
				return e(...t);
			} finally {
				S();
			}
		};
	}
	let C = b ? Array(e.length).fill(rn) : rn, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => D(e, C[t])) : D(t, C))) {
					let e = on;
					Je();
					try {
						_ && _(), on = m;
						let e = [
							t,
							C === rn ? void 0 : b && C[0] === rn ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						on = e, Ye();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Ne(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => sn(e, !1, m), _ = m.onStop = () => {
		let e = an.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			an.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function ln(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ F(e)) ln(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) ln(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		ln(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) ln(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && ln(e[r], t, n);
	}
	return e;
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function un(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		dn(e, t, n);
	}
}
function I(e, t, n, r) {
	if (h(e)) {
		let i = un(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			dn(e, t, n, void 0, !0);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(I(e[a], t, n, r));
		return i;
	}
}
function dn(e, n, r, i = !0, a = !1) {
	let o = n ? n.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: c } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, o = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n && !t.isUnmounted && (!a || t.scope.active)) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, o) === !1) return;
			}
			t = t.parent;
		}
		if (s) {
			Je(), un(s, null, 10, [
				e,
				i,
				o
			]), Ye();
			return;
		}
	}
	fn(e, r, o, i, c);
}
function fn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var L = [], R = -1, pn = [], mn = null, hn = 0, gn = /* @__PURE__ */ Promise.resolve(), _n = null;
function vn(e) {
	let t = _n || gn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function yn(e) {
	let t = R + 1, n = L.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = L[r], a = Dn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function bn(e) {
	if (!(e.flags & 1)) {
		let t = Dn(e), n = L[L.length - 1];
		!n || !(e.flags & 2) && t >= Dn(n) ? L.push(e) : L.splice(yn(t), 0, e), e.flags |= 1, xn();
	}
}
function xn() {
	_n ||= gn.then(On);
}
function Sn(e) {
	if (!d(e)) mn && e.id === -1 ? mn.splice(hn + 1, 0, e) : e.flags & 1 || (pn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) pn.push(e[t]);
	xn();
}
function Cn(e, t, n, r = R + 1) {
	for (; r < L.length; r++) {
		let n = L[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			L.splice(r, 1), r = e ? r - 1 : R, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function wn(e, t, n = 0) {
	if (pn.length) {
		let e = pn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < pn.length; i++) {
				let a = pn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? pn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Dn(e) - Dn(t));
		if (pn.length = r, mn) {
			for (let e = 0; e < i.length; e++) mn.push(i[e]);
			return;
		}
		for (mn = i, hn = 0; hn < mn.length; hn++) {
			let e = mn[hn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		mn = null, hn = 0;
	}
}
var Tn = !1;
function En(e, t) {
	if (Tn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(pn);
	e(), Tn = !0;
	try {
		Cn(void 0, t), wn(void 0, n, t);
	} finally {
		Tn = !1;
	}
}
var Dn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function On(e) {
	try {
		for (R = 0; R < L.length; R++) {
			let e = L[R];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), un(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; R < L.length; R++) {
			let e = L[R];
			e && (e.flags &= -2);
		}
		R = -1, L.length = 0, wn(e), _n = null, (L.length || pn.length) && On(e);
	}
}
var z = null, kn = null;
function An(e) {
	let t = z;
	return z = e, kn = e && e.type.__scopeId || null, t;
}
function jn(e, t = z, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Bi(-1);
		let i = An(t), a = Li.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Li.length; e > a; e--) Ri();
			An(i), r._d && Bi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Mn(e, t, n, r) {
	let i = e;
	if (r === "beforeMount") e._mount = e;
	else if (r === "beforeUpdate") {
		let n = t && t._mount;
		n && (n._latest = e, e._mount = n);
	} else if (r === "mounted") {
		let t = e._latest;
		e._mount = e._latest = void 0, t && (i = t, t._mount = void 0);
	}
	let a = i.dirs, o = t && t.dirs;
	for (let c = 0; c < a.length; c++) {
		let l = a[c];
		o ? l.oldValue = o[c].value : r === "mounted" && l.oldValue !== void 0 && (l = s({}, l, { oldValue: void 0 }));
		let u = l.dir[r];
		u && (Je(), I(u, n, 8, [
			e.el,
			l,
			i,
			t
		]), Ye());
	}
}
function Nn(e, t) {
	if (q) {
		let n = q.provides, r = q.parent && q.parent.provides;
		r === n && (n = q.provides = Object.create(r)), n[e] = t;
	}
}
function Pn(e, t, n = !1) {
	let r = la();
	if (r || Wr) {
		let i = Wr ? Wr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Fn = /* @__PURE__ */ Symbol.for("v-scx"), In = () => Pn(Fn);
function Ln(e, t, n) {
	return Rn(e, t, n);
}
function Rn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (ha) {
		if (c === "sync") {
			let e = In();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = q;
	u.call = (e, t, n) => I(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, V(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : bn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = cn(e, n, u);
	return ha && (f ? f.push(h) : d && h()), h;
}
function zn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Bn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = fa(this), s = Rn(i, a.bind(r), n);
	return o(), s;
}
function Bn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Vn = /* @__PURE__ */ Symbol("_vte"), Hn = (e) => e.__isTeleport, Un = /* @__PURE__ */ Symbol("_leaveCb");
function Wn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== U) {
			t = n;
			break;
		}
	}
	return t;
}
function Gn(e) {
	if (!tr(e)) return Hn(e.type) && e.children ? Wn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Kn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Kn(Hn(n.type) && Gn(n) || n, t);
	} else if (e.shapeFlag & 128) {
		let n = e.suspense;
		if (n) {
			let e = n.isHydrating ? n.pendingBranch : n.activeBranch;
			e && Kn(e, t.clone(e));
		} else e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	} else if (e.transition = t, e.type === H && d(e.children)) {
		let n = Zr(e.children, !1);
		n && Kn(n, t);
	}
}
function qn(e) {
	if (e.component) return qn(e.component.subTree);
	if (e.type === H) {
		let t = d(e.children) && Zr(e.children, !1);
		return t ? qn(t) : void 0;
	}
	if (e.type !== U) return e;
}
// @__NO_SIDE_EFFECTS__
function Jn(e, t) {
	return h(e) ? /* @__PURE__ */ s({ name: e.name }, t, { setup: e }) : e;
}
function Yn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Xn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Zn = /* @__PURE__ */ new WeakMap();
function Qn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Qn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (er(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Qn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Ca(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ N(v), b = v === t ? i : (e) => !Xn(_, e) && u(y, e), x = (e, t) => !(t && Xn(_, t));
	if (m != null && m !== p) {
		if ($n(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ F(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) un(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ F(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), Zn.delete(e);
				};
				t.id = -1, Zn.set(e, t), V(t, r);
			} else $n(e), i();
		}
	}
}
function $n(e) {
	let t = Zn.get(e);
	t && (t.flags |= 8, Zn.delete(e));
}
de().requestIdleCallback, de().cancelIdleCallback;
var er = (e) => !!e.type.__asyncLoader, tr = (e) => e.type.__isKeepAlive;
function nr(e, t) {
	ir(e, "a", t);
}
function rr(e, t) {
	ir(e, "da", t);
}
function ir(e, t, n = q) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (or(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) tr(e.parent.vnode) && ar(r, t, n, e), e = e.parent;
	}
}
function ar(e, t, n, r) {
	let i = or(t, e, r, !0), a = or("um", () => c(r[t], i), n);
	a.flags = 16;
}
function or(e, t, n = q, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Je();
			let i = fa(n), a = I(t, n, e, r);
			return i(), Ye(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var sr = (e) => (t, n = q) => {
	ha && e !== "sp" || or(e, (...e) => t(...e), n);
}, cr = sr("bm"), lr = sr("m"), ur = sr("bu"), dr = sr("u"), fr = sr("bum"), pr = sr("um"), mr = sr("sp"), hr = sr("rtg"), gr = sr("rtc");
function _r(e, t = q) {
	or("ec", e, t);
}
var vr = /* @__PURE__ */ Symbol.for("v-ndc");
function yr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Wt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ M(e), s = /* @__PURE__ */ Gt(e), e = st(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Jt(P(e[n])) : P(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (v(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
function br(e, t, n, r, i, a) {
	if (n ??= {}, z.ce || z.parent && er(z.parent) && z.parent.ce) {
		let e = a != null && n.key == null ? s({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), G(), Ui(H, null, [K("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let c = Li.length;
	G();
	let l;
	try {
		let i = o && xr(o(n)), s = n.key || a || i && i.key;
		l = Ui(H, { key: (s && !_(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Li.length; e > c; e--) Ri();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), l;
}
function xr(e) {
	return e.some((e) => !Wi(e) || !(e.type === U || e.type === H && !xr(e.children))) ? e : null;
}
var Sr = (e) => e ? ma(e) ? Ca(e) : Sr(e.parent) : null, Cr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Sr(e.parent),
	$root: (e) => Sr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Mr(e),
	$forceUpdate: (e) => e.f ||= () => {
		bn(e.update);
	},
	$nextTick: (e) => e.n ||= vn.bind(e.proxy),
	$watch: (e) => zn.bind(e)
}), wr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), Tr = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (wr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else Dr && (s[n] = 0);
		}
		let d = Cr[n], f, p;
		if (d) return n === "$attrs" && j(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return wr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || wr(n, c) || u(o, c) || u(i, c) || u(Cr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Er(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Dr = !0;
function Or(e) {
	let t = Mr(e), n = e.proxy, i = e.ctx;
	Dr = !1, t.beforeCreate && Ar(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: re, serverPrefetch: T, expose: ie, inheritAttrs: E, components: ae, directives: oe, filters: D } = t;
	if (u && kr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Bt(t));
	}
	if (Dr = !0, o) for (let e in o) {
		let t = o[e], a = Ta({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) jr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Nn(t, e[t]);
		});
	}
	f && Ar(f, e, "c");
	function O(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(cr, p), O(lr, m), O(ur, g), O(dr, _), O(nr, y), O(rr, b), O(_r, re), O(gr, te), O(hr, ne), O(fr, S), O(pr, w), O(mr, T), d(ie)) {
		if (ie.length) {
			let t = e.exposed ||= {};
			ie.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	ee && e.render === r && (e.render = ee), E != null && (e.inheritAttrs = E), ae && (e.components = ae), oe && (e.directives = oe), T && Yn(e);
}
function kr(e, t, n = r) {
	d(e) && (e = Lr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? Pn(r.from || n, r.default, !0) : Pn(r.from || n) : Pn(r), /* @__PURE__ */ F(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Ar(e, t, n) {
	I(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function jr(e, t, n, r) {
	let i = r.includes(".") ? Bn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Ln(i, n);
	} else if (h(e)) Ln(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => jr(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) && Ln(i, r, e);
		}
	}
}
function Mr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Nr(c, e, o, !0)), Nr(c, t, o)), v(t) && a.set(t, c), c;
}
function Nr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Nr(e, a, n, !0), i && i.forEach((t) => Nr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Pr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Pr = {
	data: Fr,
	props: zr,
	emits: zr,
	methods: Rr,
	computed: Rr,
	beforeCreate: B,
	created: B,
	beforeMount: B,
	mounted: B,
	beforeUpdate: B,
	updated: B,
	beforeDestroy: B,
	beforeUnmount: B,
	destroyed: B,
	unmounted: B,
	activated: B,
	deactivated: B,
	errorCaptured: B,
	serverPrefetch: B,
	components: Rr,
	directives: Rr,
	watch: Br,
	provide: Fr,
	inject: Ir
};
function Fr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function Ir(e, t) {
	return Rr(Lr(e), Lr(t));
}
function Lr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function B(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Rr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function zr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), Er(e), Er(t ?? {})) : t;
}
function Br(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = B(e[r], t[r]);
	return n;
}
function Vr() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Hr = 0;
function Ur(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Vr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Hr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Da,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || K(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Ca(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (I(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Wr;
				Wr = l;
				try {
					return e();
				} finally {
					Wr = t;
				}
			}
		};
		return l;
	};
}
var Wr = null, Gr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${T(t)}Modifiers`] || e[`${E(t)}Modifiers`];
function Kr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Gr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(ce)));
	let c, l = i[c = oe(n)] || i[c = oe(T(n))];
	!l && o && (l = i[c = oe(E(n))]), l && I(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, I(u, e, 6, a);
	}
}
var qr = /* @__PURE__ */ new WeakMap();
function Jr(e, t, n = !1) {
	let r = n ? qr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Jr(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Yr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, E(t)) || u(e, t));
}
function Xr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = An(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = ea(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = ea(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Qr(c);
		}
	} catch (t) {
		Li.length = 0, dn(t, e, 1), v = K(U);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = $r(y, a)), b = Zi(b, y, !1, !0));
	}
	return n.dirs && (b = Zi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Kn(Hn(b.type) && Gn(b) || b, n.transition), v = b, An(_), v;
}
function Zr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Wi(r)) {
			if (r.type !== U || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Qr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, $r = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function ei(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ti(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ni(o, r, n) && !Yr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ti(r, o, l) : !!o;
	return !1;
}
function ti(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!u(e, a) || ni(t, e, a) && !Yr(n, a)) return !0;
	}
	return !1;
}
function ni(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !we(r, i) : r !== i;
}
function ri({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ii = {}, ai = () => Object.create(ii), oi = (e) => Object.getPrototypeOf(e) === ii;
function si(e, t, n, r = !1) {
	let i = {}, a = ai();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), li(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Vt(i) : e.type.props ? i : a, e.attrs = a;
}
function ci(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ N(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Yr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = T(o);
						i[t] = ui(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		li(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = E(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ui(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && at(e.attrs, "set", "");
}
function li(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = T(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Yr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ N(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = ui(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function ui(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = fa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === E(n)) && (r = !0));
	}
	return r;
}
var di = /* @__PURE__ */ new WeakMap();
function fi(e, r, i = !1) {
	let a = i ? di : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = fi(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = T(c[e]);
		pi(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = T(e);
		if (pi(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function pi(e) {
	return e[0] !== "$" && !ee(e);
}
var mi = (e) => e === "_" || e === "_ctx" || e === "$stable", hi = (e) => d(e) ? e.map(ea) : [ea(e)], gi = (e, t, n) => {
	if (t._n) return t;
	let r = jn((...e) => hi(t(...e)), n);
	return r._c = !1, r;
}, _i = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (mi(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = gi(n, i, r);
		else if (i != null) {
			let e = hi(i);
			t[n] = () => e;
		}
	}
}, vi = (e, t) => {
	let n = hi(t);
	e.slots.default = () => n;
}, yi = (e, t, n) => {
	for (let r in t) (n || !mi(r)) && (e[r] = t[r]);
}, bi = (e, t, n) => {
	let r = e.slots = ai();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (yi(r, t, n), n && se(r, "_", e, !0)) : _i(t, r);
	} else t && vi(e, t);
}, xi = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : yi(a, n, r) : (o = !n.$stable, _i(n, a)), s = n;
	} else n && (vi(e, n), s = { default: 1 });
	if (o) for (let e in a) !mi(e) && s[e] == null && delete a[e];
}, V = Pi;
function Si(e) {
	return Ci(e);
}
function Ci(e, i) {
	let a = de();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Gi(e, t) && (i = be(e), he(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Fi:
				y(e, t, r, i);
				break;
			case U:
				b(e, t, r, i);
				break;
			case Ii:
				e ?? x(t, r, i, s);
				break;
			case H:
				ae(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? oe(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, Se);
		}
		d != null && a ? Qn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Qn(e.ref, null, o, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) te(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), T(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, te = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && re(e.children, d, null, r, i, wi(e, a), s, u), _ && Mn(e, null, r, "created"), ne(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && ia(f, r, e);
		}
		_ && Mn(e, null, r, "beforeMount");
		let v = Ei(i, g);
		v ? g.beforeEnter(d) : g && !g.persisted && (d[Ni] = !0), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && V(() => {
			try {
				f && ia(f, r, e), v && g.enter(d), _ && Mn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ne = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Mi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, re = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ta(e[l]) : ea(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, T = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Ti(r, !1), (g = h.onVnodeBeforeUpdate) && ia(g, r, n, e), f && Mn(n, e, r, "beforeUpdate"), r && Ti(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? ie(e.dynamicChildren, d, l, r, i, wi(n, a), o) : s || ue(e, n, l, null, r, i, wi(n, a), o, !1), u > 0) {
			if (u & 16) E(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && E(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && V(() => {
			g && ia(g, r, n, e), f && Mn(n, e, r, "updated");
		}, i);
	}, ie = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || ji(c), d = u && (c.type === H || !Gi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, E = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ae = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), re(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ie(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Di(e, t, !0)) : ue(e, t, n, f, i, a, s, c, l);
	}, oe = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : D(t, n, r, i, a, o, c) : se(e, t, c);
	}, D = (e, t, n, r, i, a, o) => {
		let s = e.component = ca(e, r, i);
		if (tr(e) && (s.ctx.renderer = Se), ga(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o, a), !e.el) {
				let r = s.subTree = K(U);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (ei(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ki(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							let t = () => {
								e.job.flags & 8 || (i && i.pendingBranch ? V(t, i) : l());
							};
							t.flags = 48, V(t, i);
						});
						return;
					}
				}
				let u = t, d;
				Ti(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && O(n), (d = t.props && t.props.onVnodeBeforeUpdate) && ia(d, s, t, c), Ti(e, !0);
				let f = Xr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el || ji(p)), be(p), e, i, a), t.el = f.el, u === null && ri(e, f.el), r && V(r, i), (d = t.props && t.props.onVnodeUpdated) && V(() => ia(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = er(t);
				if (Ti(e, !1), l && O(l), !m && (o = c && c.onVnodeBeforeMount) && ia(o, d, t), Ti(e, !0), s && we) {
					let t = () => {
						e.subTree = Xr(e), we(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Xr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && V(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					V(() => ia(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && er(d.vnode) && d.vnode.shapeFlag & 256) && e.a && V(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ne(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => bn(u), Ti(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ci(e, t.props, r, n), xi(e, t.children, n), Je(), Cn(e), Ye();
	}, ue = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ye(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ye(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && re(d, n, r, i, a, o, s, c));
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? ta(t[p]) : ea(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ye(e, a, o, !0, !1, f) : re(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? ta(t[u]) : ea(t[u]);
			if (Gi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? ta(t[p]) : ea(t[p]);
			if (Gi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? ta(t[u]) : ea(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) he(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? ta(t[u]) : ea(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					he(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Gi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? he(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Oi(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || ji(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? me(n, r, p, 2) : _--);
			}
		}
	}, me = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) me(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, Se);
		else if (c === H) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === Ii) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Un] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), V(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Un];
					a._isLeaving && a[Un](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, he = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Je(), Qn(s, null, n, e, !0), Ye()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256 && t.ctx.deactivate(e)) return;
		let h = u & 1 && f, g = !er(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ia(_, t, e), u & 6) ve(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Mn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Se, r) : l && !l.hasOnce && (a !== H || d > 0 && d & 64) ? ye(l, t, n, !1, !0) : (a === H && d & 384 || !i && u & 16) && ye(c, t, n), r && ge(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && V(() => {
			_ && ia(_, t, e), h && Mn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ge = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === H;
		if (a && !i) {
			_e(n, r);
			return;
		}
		if (t === Ii) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? qn(e) : e, c = () => {
			a ? m(n) && _e(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, _e = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ve = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ai(c), Ai(l), r && O(r), i.stop(), a ? (a.flags |= 8, he(o, e, t, n)) : o && (o.transition = e.vnode.transition, he(o, e, t, n)), s && V(s, t);
		let u = () => {
			e.isUnmounted = !0;
		};
		u.flags = 16, V(u, t);
	}, ye = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) he(e[o], t, n, r, i);
	}, be = (e) => {
		if (e.shapeFlag & 6) return be(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Vn];
		return n ? h(n) : t;
	}, xe = (e, t, n) => {
		En(() => {
			e == null ? t._vnode && he(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : sa());
	}, Se = {
		p: v,
		um: he,
		m: me,
		r: ge,
		mt: D,
		mc: re,
		pc: ue,
		pbc: ie,
		n: be,
		o: e
	}, Ce, we;
	return i && ([Ce, we] = i(Se)), {
		render: xe,
		hydrate: Ce,
		createApp: Ur(xe, Ce)
	};
}
function wi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ti({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ei(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Di(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ta(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Di(t, a)), a.type === Fi && (a.patchFlag === -1 && (a = i[e] = ta(a)), a.el = t.el), a.type === U && !a.el && (a.el = t.el);
	}
}
function Oi(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function ki(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ki(t);
}
function Ai(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function ji(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	if (t) return ji(t.subTree);
	let n = e.suspense;
	return n && n.activeBranch ? ji(n.activeBranch) : null;
}
var Mi = (e) => e.__isSuspense, Ni = /* @__PURE__ */ Symbol("_deferredEnter");
function Pi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : Sn(e);
}
var H = /* @__PURE__ */ Symbol.for("v-fgt"), Fi = /* @__PURE__ */ Symbol.for("v-txt"), U = /* @__PURE__ */ Symbol.for("v-cmt"), Ii = /* @__PURE__ */ Symbol.for("v-stc"), Li = [], W = null;
function G(e = !1) {
	Li.push(W = e ? null : []);
}
function Ri() {
	Li.pop(), W = Li[Li.length - 1] || null;
}
var zi = 1;
function Bi(e, t = !1) {
	zi += e, e < 0 && W && t && (W.hasOnce = !0);
}
function Vi(e) {
	return e.dynamicChildren = zi > 0 ? W || n : null, Ri(), zi > 0 && W && W.push(e), e;
}
function Hi(e, t, n, r, i, a) {
	return Vi(Ji(e, t, n, r, i, a, !0));
}
function Ui(e, t, n, r, i) {
	return Vi(K(e, t, n, r, i, !0));
}
function Wi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Gi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Ki = ({ key: e }) => e ?? null, qi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ F(e) || h(e) ? {
	i: z,
	r: e,
	k: t,
	f: !!n
} : e);
function Ji(e, t = null, n = null, r = 0, i = null, a = e === H ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Ki(t),
		ref: t && qi(t),
		scopeId: kn,
		slotScopeIds: null,
		children: n,
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
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: z
	};
	return s ? (na(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), zi > 0 && !o && W && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && W.push(c), c;
}
var K = Yi;
function Yi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== vr || (e = U), Wi(e)) {
		let r = Zi(e, t, !0);
		return n && na(r, n), zi > 0 && !a && W && (r.shapeFlag & 6 ? W[W.indexOf(e)] = r : W.push(r)), r.patchFlag = -2, r;
	}
	if (wa(e) && (e = e.__vccOpts), t) {
		t = Xi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = _e(e)), v(n) && (/* @__PURE__ */ Kt(n) && !d(n) && (n = s({}, n)), t.style = fe(n));
	}
	let o = g(e) ? 1 : Mi(e) ? 128 : Hn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Ji(e, t, n, r, i, o, a, !0);
}
function Xi(e) {
	return e ? /* @__PURE__ */ Kt(e) ? s({}, e) : oi(e) ? s({}, e[ba] || e) : e : null;
}
function Zi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ra(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Ki(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(qi(t)) : [a, qi(t)] : qi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== H ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Zi(e.ssContent),
		ssFallback: e.ssFallback && Zi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Kn(u, c.clone(u)), u;
}
function Qi(e = " ", t = 0) {
	return K(Fi, null, e, t);
}
function $i(e = "", t = !1) {
	return t ? (G(), Ui(U, null, e)) : K(U, null, e);
}
function ea(e) {
	return e == null || typeof e == "boolean" ? K(U) : d(e) ? K(H, null, e.slice()) : Wi(e) ? ta(e) : K(Fi, null, String(e));
}
function ta(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Zi(e);
}
function na(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), na(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !oi(t) ? t._ctx = z : r === 3 && z && (z.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			na(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: z
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Qi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ra(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = _e([t.class, r.class]));
		else if (e === "style") t.style = fe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ia(e, t, n, r = null) {
	I(e, t, 7, [n, r]);
}
var aa = /* @__PURE__ */ Vr(), oa = 0;
function sa() {
	return oa;
}
function ca(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || aa, o = {
		uid: oa++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Ae(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: fi(i, a),
		emitsOptions: Jr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
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
		sp: null
	};
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Kr.bind(null, o), e.ce && e.ce(o), o;
}
var q = null, la = () => q || z, ua, da;
{
	let e = de(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ua = t("__VUE_INSTANCE_SETTERS__", (e) => q = e), da = t("__VUE_SSR_SETTERS__", (e) => ha = e);
}
var fa = (e) => {
	let t = q;
	return ua(e), e.scope.on(), () => {
		e.scope.off(), ua(t);
	};
}, pa = () => {
	q && q.scope.off(), ua(null);
};
function ma(e) {
	return e.vnode.shapeFlag & 4;
}
var ha = !1;
function ga(e, t = !1, n = !1) {
	t && da(t);
	let { props: r, children: i } = e.vnode, a = ma(e);
	si(e, r, a, t), bi(e, i, n || t);
	let o = a ? _a(e, t) : void 0;
	return t && da(!1), o;
}
function _a(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Tr);
	let { setup: r } = n;
	if (r) {
		Je();
		let n = e.setupContext = r.length > 1 ? Sa(e) : null, i = fa(e), a = un(r, e, 0, [e.props, n]), o = y(a);
		if (Ye(), i(), (o || e.sp) && !er(e) && Yn(e), o) {
			if (a.then(pa, pa), t) return a.then((n) => {
				da(!0);
				try {
					va(e, n, t);
				} finally {
					da(!1);
				}
			}).catch((t) => {
				dn(t, e, 0, void 0, !0), e.ssrRender = (e, t) => t("<!---->");
			});
			e.asyncDep = a;
		} else va(e, a, t);
	} else ya(e, t);
}
function va(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = en(t)), ya(e, n);
}
function ya(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = fa(e);
		Je();
		try {
			Or(e);
		} finally {
			Ye(), t();
		}
	}
}
var ba = /* @__PURE__ */ Symbol(), xa = { get(e, t) {
	return j(e, "get", ""), t === ba ? e : e[t];
} };
function Sa(e) {
	return {
		attrs: new Proxy(e.attrs, xa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ca(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(en(qt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Cr) return Cr[n](e);
		},
		has(e, t) {
			return t in e || t in Cr;
		}
	}) : e.proxy;
}
function wa(e) {
	return h(e) && "__vccOpts" in e;
}
var Ta = (e, t) => /* @__PURE__ */ nn(e, t, ha);
function Ea(e, t, n) {
	try {
		Bi(-1);
		let r = arguments.length;
		return r === 2 ? v(t) && !d(t) ? Wi(t) ? K(e, null, [t]) : K(e, t) : K(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Wi(n) && (n = [n]), K(e, t, n));
	} finally {
		Bi(1);
	}
}
var Da = "3.5.46", Oa = void 0, ka = typeof window < "u" && window.trustedTypes;
if (ka) try {
	Oa = /* @__PURE__ */ ka.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Aa = Oa ? (e) => Oa.createHTML(e) : (e) => e, ja = "http://www.w3.org/2000/svg", Ma = "http://www.w3.org/1998/Math/MathML", Na = typeof document < "u" ? document : null, Pa = Na && /* @__PURE__ */ Na.createElement("template"), Fa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Na.createElementNS(ja, e) : t === "mathml" ? Na.createElementNS(Ma, e) : n ? Na.createElement(e, { is: n }) : Na.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Na.createTextNode(e),
	createComment: (e) => Na.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Na.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Pa.innerHTML = Aa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Pa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ia = /* @__PURE__ */ Symbol("_vtc");
function La(e, t, n) {
	let r = e[Ia];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Ra = /* @__PURE__ */ Symbol("_vod"), za = /* @__PURE__ */ Symbol("_vsh"), Ba = /* @__PURE__ */ Symbol(""), Va = /(?:^|;)\s*display\s*:/;
function Ha(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Wa(r, t, "");
			}
			else for (let e in t) n[e] ?? Wa(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Wa(r, i, "") : Ja(e, i, !g(t) && t ? t[i] : void 0, o) || Wa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Ba];
			e && (n += ";" + e), r.cssText = n, a = Va.test(n);
		}
	} else t && e.removeAttribute("style");
	Ra in e && (i && t === n || (e[Ra] = a ? r.display : ""), e[za] && (r.display = "none"));
}
var Ua = /\s*!important$/;
function Wa(e, t, n) {
	if (d(n)) n.forEach((n) => Wa(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ua.test(n) ? e.setProperty(t, n.replace(Ua, ""), "important") : e.setProperty(t, n);
	else {
		let r = qa(e, t);
		Ua.test(n) ? e.setProperty(E(r), n.replace(Ua, ""), "important") : e[r] = n;
	}
}
var Ga = [
	"Webkit",
	"Moz",
	"ms"
], Ka = {};
function qa(e, t) {
	let n = Ka[t];
	if (n) return n;
	let r = T(t);
	if (r !== "filter" && r in e) return Ka[t] = r;
	r = ae(r);
	for (let n = 0; n < Ga.length; n++) {
		let i = Ga[n] + r;
		if (i in e) return Ka[t] = i;
	}
	return t;
}
function Ja(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Ya = "http://www.w3.org/1999/xlink";
function Xa(e, t, n, r, i, a = ve(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ya, t.slice(6, t.length)) : e.setAttributeNS(Ya, t, n) : n == null || a && !ye(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Za(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Aa(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		r === i && "_value" in e || (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ye(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Qa(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function $a(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var eo = /* @__PURE__ */ Symbol("_vei");
function to(e, t, n, r, i = null) {
	let a = e[eo] || (e[eo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = io(t);
		r ? Qa(e, n, a[t] = co(r, i), s) : o && ($a(e, n, o, s), a[t] = void 0);
	}
}
var no = /(Once|Passive|Capture)$/, ro = /^on:?(?:Once|Passive|Capture)$/;
function io(e) {
	let t, n;
	for (; (n = e.match(no)) && !ro.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : E(e.slice(2)), t];
}
var ao = 0, oo = /* @__PURE__ */ Promise.resolve(), so = () => ao ||= (oo.then(() => ao = 0), Date.now());
function co(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && I(e, t, 5, a);
			}
		} else I(r, t, 5, [e]);
	};
	return n.value = e, n.attached = so(), n;
}
var lo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, uo = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? La(e, r, c) : t === "style" ? Ha(e, n, r) : a(t) ? o(t) || to(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : fo(e, t, r, c)) ? (Za(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || Xa(e, t, r, c, s, t !== "value")) : e._isVueCE && (po(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Za(e, T(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Xa(e, t, r, c));
};
function fo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && lo(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return lo(t) && g(n) ? !1 : t in e;
}
function po(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = T(t);
	return Array.isArray(n) ? n.some((e) => T(e) === r) : Object.keys(n).some((e) => T(e) === r);
}
var mo = {};
// @__NO_SIDE_EFFECTS__
function ho(e, t, n) {
	let r = /* @__PURE__ */ Jn(e, t);
	C(r) && (r = s({}, r, t));
	class i extends _o {
		constructor(e) {
			super(r, e, n);
		}
	}
	return i.def = r, i;
}
var go = typeof HTMLElement < "u" ? HTMLElement : class {}, _o = class e extends go {
	constructor(e, t = {}, n = So) {
		super(), this._def = e, this._props = t, this._createApp = n, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._styleAnchors = /* @__PURE__ */ new WeakMap(), this._ob = null, this.shadowRoot && n !== So ? this._root = this.shadowRoot : e.shadowRoot === !1 ? this._root = this : (this.attachShadow(s({}, e.shadowRootOptions, { mode: "open" })), this._root = this.shadowRoot);
	}
	connectedCallback() {
		if (!this.isConnected) return;
		!this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
		let t = this;
		for (; t &&= t.assignedSlot || t.parentNode || t.host;) if (t instanceof e) {
			this._parent = t;
			break;
		}
		this._instance || (this._resolved ? this._mount(this._def) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
			if (this._pendingResolve = void 0, this.isConnected) return this._resolveDef();
		}) : this._resolveDef());
	}
	_setParent(e = this._parent) {
		e && (this._instance.parent = e._instance, this._inheritParentContext(e));
	}
	_inheritParentContext(e = this._parent) {
		e && this._app && Object.setPrototypeOf(this._app._context.provides, e._instance.provides);
	}
	disconnectedCallback() {
		this._connected = !1, vn(() => {
			this._connected || (this._ob &&= (this._ob.disconnect(), null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets &&= (this._teleportTargets.clear(), void 0));
		});
	}
	_processMutations(e) {
		for (let t of e) this._setAttr(t.attributeName);
	}
	_resolveDef() {
		if (this._pendingResolve) return this._pendingResolve;
		for (let e = 0; e < this.attributes.length; e++) this._setAttr(this.attributes[e].name);
		this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
		let e = (e, t = !1) => {
			this._resolved = !0, this._pendingResolve = void 0;
			let { props: n, styles: r } = e, i;
			if (n && !d(n)) for (let e in n) {
				let t = n[e];
				(t === Number || t && t.type === Number) && (e in this._props && (this._props[e] = le(this._props[e])), (i ||= /* @__PURE__ */ Object.create(null))[T(e)] = !0);
			}
			this._numberProps = i, this._resolveProps(e), this.shadowRoot && this._applyStyles(r), this._connected && this._mount(e);
		}, t = this._def.__asyncLoader;
		if (t) return this._pendingResolve = t().then((t) => {
			t.configureApp = this._def.configureApp, e(this._def = t, !0);
		}), this._pendingResolve;
		e(this._def);
	}
	_mount(e) {
		this._app = this._createApp(e), this._inheritParentContext(), e.configureApp && e.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
		let t = this._instance && this._instance.exposed;
		if (t) for (let e in t) u(this, e) || Object.defineProperty(this, e, { get: () => Qt(t[e]) });
	}
	_resolveProps(e) {
		let { props: t } = e, n = d(t) ? t : Object.keys(t || {});
		for (let e of Object.keys(this)) e[0] !== "_" && n.includes(e) && this._setProp(e, this[e]);
		for (let e of n.map(T)) Object.defineProperty(this, e, {
			get() {
				return this._getProp(e);
			},
			set(t) {
				this._setProp(e, t, !0, !this._patching);
			}
		});
	}
	_setAttr(e) {
		if (e.startsWith("data-v-")) return;
		let t = this.hasAttribute(e), n = t ? this.getAttribute(e) : mo, r = T(e);
		t && this._numberProps && this._numberProps[r] && (n = le(n)), this._setProp(r, n, !1, !0);
	}
	_getProp(e) {
		return this._props[e];
	}
	_setProp(e, t, n = !0, r = !1) {
		if (t !== this._props[e] && (this._dirty = !0, t === mo ? delete this._props[e] : (this._props[e] = t, e === "key" && this._app && (this._app._ceVNode.key = t)), r && this._instance && this._update(), n)) {
			let n = this._ob;
			n && (this._processMutations(n.takeRecords()), n.disconnect()), t === !0 ? this.setAttribute(E(e), "") : typeof t == "string" || typeof t == "number" ? this.setAttribute(E(e), t + "") : t || this.removeAttribute(E(e)), n && n.observe(this, { attributes: !0 });
		}
	}
	_update() {
		let e = this._createVNode();
		this._app && (e.appContext = this._app._context), xo(e, this._root);
	}
	_createVNode() {
		let e = {};
		this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
		let t = K(this._def, s(e, this._props));
		return this._instance || (t.ce = (e) => {
			this._instance = e, e.ce = this, e.isCE = !0;
			let t = (e, t) => {
				this.dispatchEvent(new CustomEvent(e, C(t[0]) ? s({ detail: t }, t[0]) : { detail: t }));
			};
			e.emit = (e, ...n) => {
				t(e, n), E(e) !== e && t(E(e), n);
			}, this._setParent();
		}), t;
	}
	_applyStyles(e, t, n) {
		if (!e) return;
		if (t) {
			if (t === this._def || this._styleChildren.has(t)) return;
			this._styleChildren.add(t);
		}
		let r = this._nonce, i = this.shadowRoot, a = n ? this._getStyleAnchor(n) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(i), o = null;
		for (let s = e.length - 1; s >= 0; s--) {
			let c = document.createElement("style");
			r && c.setAttribute("nonce", r), c.textContent = e[s], i.insertBefore(c, o || a), o = c, s === 0 && (n || this._styleAnchors.set(this._def, c), t && this._styleAnchors.set(t, c));
		}
	}
	_getStyleAnchor(e) {
		if (!e) return null;
		let t = this._styleAnchors.get(e);
		return t && t.parentNode === this.shadowRoot ? t : (t && this._styleAnchors.delete(e), null);
	}
	_getRootStyleInsertionAnchor(e) {
		for (let t = 0; t < e.childNodes.length; t++) {
			let n = e.childNodes[t];
			if (!(n instanceof HTMLStyleElement)) return n;
		}
		return null;
	}
	_parseSlots() {
		let e = this._slots = {}, t;
		for (; t = this.firstChild;) {
			let n = t.nodeType === 1 && t.getAttribute("slot") || "default";
			(e[n] || (e[n] = [])).push(t), this.removeChild(t);
		}
	}
	_renderSlots() {
		let e = this._getSlots(), t = this._instance.type.__scopeId;
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = r.getAttribute("name") || "default", a = this._slots[i], o = r.parentNode;
			if (a) for (let e of a) {
				if (t && e.nodeType === 1) {
					let n = t + "-s", r = document.createTreeWalker(e, 1);
					e.setAttribute(n, "");
					let i;
					for (; i = r.nextNode();) i.setAttribute(n, "");
				}
				o.insertBefore(e, r);
			}
			else for (; r.firstChild;) o.insertBefore(r.firstChild, r);
			o.removeChild(r);
		}
	}
	_getSlots() {
		let e = [this];
		this._teleportTargets && e.push(...this._teleportTargets);
		let t = /* @__PURE__ */ new Set();
		for (let n of e) {
			let e = n.querySelectorAll("slot");
			for (let n = 0; n < e.length; n++) t.add(e[n]);
		}
		return Array.from(t);
	}
	_injectChildStyle(e, t) {
		this._applyStyles(e.styles, e, t);
	}
	_beginPatch() {
		this._patching = !0, this._dirty = !1;
	}
	_endPatch() {
		this._patching = !1, this._dirty && this._instance && this._update();
	}
	_hasShadowRoot() {
		return this._def.shadowRoot !== !1;
	}
	_removeChildStyle(e) {}
}, vo = /* @__PURE__ */ s({ patchProp: uo }, Fa), yo;
function bo() {
	return yo ||= Si(vo);
}
var xo = ((...e) => {
	bo().render(...e);
}), So = ((...e) => {
	let t = bo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = wo(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Co(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Co(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function wo(e) {
	return g(e) ? document.querySelector(e) : e;
}
// ../../../../NeTEx-Deckplan-Editor/library/src/model/netex/passengerEquipment.ts
var To = class {
	attr_id;
	attr_version;
	Name;
	Description;
	constructor(e) {
		this.attr_id = e.attr_id || `equipment_${Date.now()}`, this.attr_version = e.attr_version || "1.0", this.Name = e.Name?.text_value || e.Name, this.Description = e.Description?.text_value || e.Description;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Name: this.Name ? { text_value: this.Name } : void 0,
			Description: this.Description ? { text_value: this.Description } : void 0
		};
	}
}, Eo = class extends To {
	constructor(e) {
		super(e);
	}
}, Do = class extends Eo {
	Fixed;
	constructor(e) {
		super(e), this.Fixed = e.Fixed === "true" || e.Fixed === !0;
	}
	toXML() {
		return {
			...super.toXML(),
			Fixed: this.Fixed
		};
	}
}, Oo = class extends Do {
	static xmlTagName = "ActualVehicleEquipment";
	Units;
	TicketingEquipmentRef;
	TicketValidatorEquipmentRef;
	constructor(e) {
		super(e), this.Units = e.Units || 1, this.TicketingEquipmentRef = e.TicketingEquipmentRef, this.TicketValidatorEquipmentRef = e.TicketValidatorEquipmentRef;
	}
	toXML() {
		return {
			...super.toXML(),
			Units: this.Units,
			TicketingEquipmentRef: this.TicketingEquipmentRef?.toXML(),
			TicketValidatorEquipmentRef: this.TicketValidatorEquipmentRef?.toXML()
		};
	}
}, ko = class e {
	x;
	y;
	constructor(e, t) {
		this.x = e, this.y = t;
	}
	static fromXML(t) {
		let n = t?.Location?.pos;
		if (typeof n == "string") {
			let [t, r] = n.split(" ").map(Number);
			if (typeof t == "number" && typeof r == "number") return new e(t, r);
		} else return new e(0, 0);
	}
	toXML() {
		return { Location: { pos: `${this.x} ${this.y}` } };
	}
};
// ../../../../NeTEx-Deckplan-Editor/library/src/model/netex/general.ts
function J(e, t) {
	return e ? Array.isArray(e) ? e.map((e) => new t(e)) : [new t(e)] : [];
}
function Ao(e) {
	return e.map((e) => e.toXML());
}
function jo(e) {
	let t = {};
	return e.forEach((e) => {
		let n = e.constructor.xmlTagName ?? e.constructor.name;
		t[n] || (t[n] = []), t[n].push(e.toXML());
	}), t;
}
// ../../../../NeTEx-Deckplan-Editor/library/src/model/netex/deckplan/deck/deckspace/entrance/passengerEntrance.ts
var Mo = class {
	static xmlTagName = "PassengerEntrance";
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
	constructor({ attr_id: e, attr_version: t, Name: n, Label: r, Width: i, Height: a, actualVehicleEquipments: o, PublicUse: s, VehicleSide: c, SequenceFromFront: l, HeightFromGround: u, DeckEntranceType: d, IsEmergencyExit: f, HasDoor: p, IsAutomatic: m, Centroid: h = void 0 }) {
		this.attr_id = e, this.attr_version = t, this.Name = n, this.Label = r, this.Width = i, this.Height = a, this.actualVehicleEquipments = J(o?.ActualVehicleEquipment, Oo), this.PublicUse = s, this.VehicleSide = c, this.SequenceFromFront = l, this.HeightFromGround = u, this.DeckEntranceType = d, this.IsEmergencyExit = f, this.HasDoor = p, this.IsAutomatic = m, this.Centroid = h ? ko.fromXML(h) : void 0;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Name: this.Name,
			Label: this.Label,
			Width: this.Width,
			Height: this.Height,
			actualVehicleEquipments: { ActualVehicleEquipment: Ao(this.actualVehicleEquipments) },
			PublicUse: this.PublicUse,
			VehicleSide: this.VehicleSide,
			SequenceFromFront: this.SequenceFromFront,
			HeightFromGround: this.HeightFromGround,
			DeckEntranceType: this.DeckEntranceType,
			IsEmergencyExit: this.IsEmergencyExit,
			HasDoor: this.HasDoor,
			IsAutomatic: this.IsAutomatic,
			Centroid: this.Centroid?.toXML()
		};
	}
	getShape(e, t, n) {
		let r = (this.Width || .8) * e, i = .2 * e, a = r, o = i, s = 0, c = 0;
		if ((this.VehicleSide === "front" || this.VehicleSide === "back") && (a = i, o = r), this.Centroid) {
			let t = (this.Centroid?.x ?? 0) * e, n = (this.Centroid?.y ?? 0) * e;
			return this.VehicleSide === "leftSide" || this.VehicleSide === "rightSide" ? n = (this.Centroid?.y ?? 0) * e - o / 2 : (this.VehicleSide === "front" || this.VehicleSide === "back") && (t = (this.Centroid?.x ?? 0) * e - a / 2), {
				x: t,
				y: n,
				width: a,
				height: o,
				fill: "white",
				stroke: "black",
				strokeWidth: 2,
				draggable: !0
			};
		}
		return this.VehicleSide === "leftSide" ? (s = (this.SequenceFromFront ?? 0) * e - a / 2 + 5, c = 5) : this.VehicleSide === "rightSide" ? (s = (this.SequenceFromFront ?? 0) * e - a / 2 + 5, c = n * e + 5 - o) : this.VehicleSide === "front" ? (s = 5, c = n * e / 2 + 5 - o / 2) : this.VehicleSide === "back" ? (s = t * e + 5 - a, c = n * e / 2 + 5 - o / 2) : (s = 5, c = 5), {
			x: s,
			y: c,
			width: a,
			height: o,
			fill: "orange",
			stroke: "darkorange",
			strokeWidth: 2,
			draggable: !0
		};
	}
}, No = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, Po = class {
	attr_ref;
	attr_version;
	FromDeckEntranceRef;
	ToDeckEntranceRef;
	constructor({ attr_ref: e, attr_version: t, FromDeckEntranceRef: n, ToDeckEntranceRef: r }) {
		this.attr_ref = e, this.attr_version = t, this.FromDeckEntranceRef = new No(n), this.ToDeckEntranceRef = new No(r);
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version,
			FromDeckEntranceRef: this.FromDeckEntranceRef.toXML(),
			ToDeckEntranceRef: this.ToDeckEntranceRef.toXML()
		};
	}
}, Fo = class {
	attr_id;
	attr_version;
	Name;
	constructor({ attr_id: e, attr_version: t, Name: n }) {
		this.attr_id = e, this.attr_version = t, this.Name = n;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			Name: this.Name,
			attr_version: this.attr_version
		};
	}
}, Io = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, Lo = class {
	attr_ref;
	attr_version;
	validityConditions;
	Name;
	EntranceUsageType;
	EntranceSetting;
	ControlledLocking;
	constructor({ attr_ref: e, attr_version: t, validityConditions: n, Name: r, EntranceUsageType: i, EntranceSetting: a, ControlledLocking: o }) {
		this.attr_ref = e, this.attr_version = t, this.validityConditions = Object.entries(n).flatMap(([e, t]) => (e === "ValidityConditionRef" && t.map((e) => new Io(e)), e === "ValidityCondition" && t.map((e) => new Fo(e)), [])), this.Name = r, this.EntranceUsageType = i, this.EntranceSetting = a, this.ControlledLocking = o;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version,
			validityConditions: jo(this.validityConditions),
			Name: this.Name,
			EntranceUsageType: this.EntranceUsageType,
			EntranceSetting: this.EntranceSetting,
			ControlledLocking: this.ControlledLocking
		};
	}
}, Ro = class {
	attr_id;
	label;
	constructor({ attr_id: e, Label: t }) {
		this.attr_id = e, this.label = t;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			label: this.label
		};
	}
}, zo = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, Bo = class {
	attr_id;
	label;
	constructor({ attr_id: e, Label: t }) {
		this.attr_id = e, this.label = t;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			label: this.label
		};
	}
}, Vo = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, Ho = class {
	attr_id;
	attr_version;
	Label;
	Orientation;
	actualVehicleEquipments;
	SpotColumnRef;
	SpotRowRef;
	constructor({ attr_id: e, attr_version: t, Label: n, Orientation: r, actualVehicleEquipments: i, SpotColumnRef: a, SpotRowRef: o }) {
		this.attr_id = e, this.attr_version = t, this.Label = n, this.Orientation = r, this.actualVehicleEquipments = i ? J(i, Oo) : [], this.SpotColumnRef = a ? new zo(a) : void 0, this.SpotRowRef = o ? new Vo(o) : void 0;
	}
}, Uo = class extends Ho {
	constructor({ attr_id: e, attr_version: t, Label: n, Orientation: r, actualVehicleEquipments: i, SpotColumnRef: a, SpotRowRef: o }) {
		super({
			attr_id: e,
			attr_version: t,
			Label: n,
			Orientation: r,
			actualVehicleEquipments: i,
			SpotColumnRef: a,
			SpotRowRef: o
		});
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Label: this.Label,
			Orientation: this.Orientation,
			actualVehicleEquipments: { ActualVehicleEquipment: Ao(this.actualVehicleEquipments) },
			SpotColumnRef: this.SpotColumnRef?.toXML(),
			SpotRowRef: this.SpotRowRef?.toXML()
		};
	}
}, Wo = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, Go = class extends Ho {
	static xmlTagName = "PassengerSpot";
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
	constructor({ attr_id: e, attr_version: t, Label: n, Orientation: r, actualVehicleEquipments: i, SpotColumnRef: a, SpotRowRef: o, IsByWindow: s, IsByAisle: c, IsBetweenSeats: l, IsInFrontRow: u, IsInEndRow: d, TableType: f, HasPower: p, Centroid: m, Width: h, Length: g }) {
		super({
			attr_id: e,
			attr_version: t,
			Label: n,
			Orientation: r,
			actualVehicleEquipments: i,
			SpotColumnRef: a,
			SpotRowRef: o
		}), this.IsByWindow = s, this.IsByAisle = c, this.IsBetweenSeats = l, this.IsInFrontRow = u, this.IsInEndRow = d, this.TableType = f, this.HasPower = p, this.Centroid = m ? ko.fromXML(m) : void 0, this.Width = h || .5, this.Length = g || .5;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Label: this.Label ? { text_value: this.Label } : void 0,
			Orientation: this.Orientation ? { text_value: this.Orientation } : void 0,
			actualVehicleEquipments: this.actualVehicleEquipments ? jo(this.actualVehicleEquipments) : void 0,
			SpotColumnRef: this.SpotColumnRef?.toXML(),
			SpotRowRef: this.SpotRowRef?.toXML(),
			IsByWindow: this.IsByWindow ? { text_value: this.IsByWindow } : void 0,
			IsByAisle: this.IsByAisle ? { text_value: this.IsByAisle } : void 0,
			TableType: this.TableType ? { text_value: this.TableType } : void 0,
			HasPower: this.HasPower ? { text_value: this.HasPower } : void 0,
			Centroid: this.Centroid?.toXML(),
			Width: this.Width,
			Length: this.Length
		};
	}
	getClasses() {
		let e = [];
		return this.IsByWindow && e.push("seat__by-window"), this.IsByAisle && e.push("seat__by-aisle"), this.HasPower && e.push("seat__has-power"), this.Orientation && e.push(`seat__orientation-${this.Orientation}`), this.availability && e.push(`seat__availability-${this.availability.toLowerCase()}`), e.join(" ");
	}
	getShape(e) {
		if (this.Centroid) {
			let t = this.Width * e, n = this.Length * e;
			return {
				x: (this.Centroid?.x ?? 1) * e - t / 2 + 5,
				y: (this.Centroid?.y ?? 1) * e - n / 2 + 5,
				width: t,
				height: n,
				fill: "#ffffff",
				stroke: "#000000",
				strokeWidth: 1,
				cornerRadius: 4,
				draggable: !0
			};
		}
		return {
			x: 0,
			y: 0,
			width: this.Width * e,
			height: this.Length * e,
			fill: "red",
			strokeWidth: 1,
			cornerRadius: 4,
			draggable: !0
		};
	}
}, Ko = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, qo = class {
	attr_ref;
	attr_version;
	LocatableSpotType;
	capacity;
	constructor({ attr_ref: e, attr_version: t, LocatableSpotType: n, capacity: r }) {
		this.attr_ref = e, this.attr_version = t, this.LocatableSpotType = n, this.capacity = r;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version,
			LocatableSpotType: this.LocatableSpotType,
			capacity: this.capacity
		};
	}
}, Jo = class {
	attr_id;
	attr_version;
	Name;
	PublicUse;
	TotalCapacity;
	actualVehicleEquipments;
	constructor({ attr_id: e, attr_version: t, Name: n, PublicUse: r, TotalCapacity: i, actualVehicleEquipments: a }) {
		this.attr_id = e, this.attr_version = t, this.Name = n, this.actualVehicleEquipments = a ? J(a.ActualVehicleEquipment, Oo) : [], this.PublicUse = r, this.TotalCapacity = i;
	}
	getName() {
		return this.Name;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Name: this.Name,
			PublicUse: this.PublicUse,
			TotalCapacity: this.TotalCapacity
		};
	}
}, Yo = class e {
	value;
	constructor(e) {
		this.value = e;
	}
	get points() {
		let e = this.value.exterior?.LinearRing?.posList, t = typeof e == "string" ? e : e?.["#text"] ?? e?.text_value;
		if (!t) return [];
		let n = t.trim().split(/\s+/).map(Number);
		if (n.length < 2 || n.length % 2 != 0 || n.some(isNaN)) return [];
		let r = [];
		for (let e = 0; e < n.length; e += 2) r.push({
			x: n[e],
			y: n[e + 1]
		});
		let i = r[0], a = r[r.length - 1];
		if (i.x !== a.x || i.y !== a.y) throw Error("Polygon must start and end at the same point");
		return r;
	}
	getBoundingBox() {
		let e = this.points;
		if (e.length === 0) return;
		let t = e.map((e) => e.x), n = e.map((e) => e.y), r = Math.min(...t), i = Math.max(...t), a = Math.min(...n), o = Math.max(...n);
		return {
			minX: r,
			maxX: i,
			minY: a,
			maxY: o,
			length: i - r,
			width: o - a,
			center: {
				x: (r + i) / 2,
				y: (a + o) / 2
			}
		};
	}
	transform(t) {
		let n = this.getBoundingBox();
		if (!n || n.length <= 0 || n.width <= 0) throw Error("Polygon should have positive dimensions");
		if (t.length <= 0 || t.width <= 0) throw Error("Target polygon should have positive dimensions");
		let r = t.length / n.length, i = t.width / n.width, a = this.points.map((e) => ({
			x: t.center.x + (e.x - n.center.x) * r,
			y: t.center.y + (e.y - n.center.y) * i
		})).map((e) => `${e.x} ${e.y}`).join(" "), o = this.value.exterior?.LinearRing, s = o?.posList, c = typeof s == "object" ? {
			...s,
			..."text_value" in s ? { text_value: a } : { "#text": a }
		} : a;
		return new e({
			...this.value,
			exterior: {
				...this.value.exterior,
				LinearRing: {
					...o,
					posList: c
				}
			}
		});
	}
	toXML() {
		return this.value;
	}
}, Xo = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, Zo = class {
	attr_id;
	attr_version;
	Label;
	SpotColumnRef;
	SpotRowRef;
	constructor({ attr_id: e, attr_version: t, Label: n, SpotColumnRef: r, SpotRowRef: i }) {
		this.attr_id = e, this.attr_version = t, this.Label = n, this.SpotColumnRef = r ? new zo(r) : void 0, this.SpotRowRef = i ? new Vo(i) : void 0;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Label: this.Label,
			SpotColumnRef: this.SpotColumnRef?.toXML(),
			SpotRowRef: this.SpotRowRef?.toXML()
		};
	}
}, Qo = class e {
	static xmlTagName = "PassengerSpace";
	attr_id;
	attr_version;
	Name;
	SmokingAllowed;
	StandingAllowed;
	PassengerSpaceType;
	passengerSpots;
	luggageSpots;
	deckEntrances;
	deckEntranceUsages;
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
	gridMarkers;
	constructor({ attr_id: e, attr_version: t, Name: n, SmokingAllowed: r, StandingAllowed: i, PassengerSpaceType: a, passengerSpots: o, luggageSpots: s, deckEntrances: c, deckEntranceUsages: l, deckEntranceCouples: u, deckSpaceCapacities: d, actualVehicleEquipments: f, ServiceFacilitySetRef: p, Centroid: m, Polygon: h, PublicUse: g, TotalCapacity: _, FareClass: v, AirConditioned: y, gridMarkers: b }) {
		this.attr_id = e, this.attr_version = t, this.Name = typeof n == "string" ? n : n?.["#text"], this.SmokingAllowed = r, this.StandingAllowed = i, this.PassengerSpaceType = a, this.passengerSpots = o ? Object.entries(o).flatMap(([e, t]) => e === "PassengerSpot" ? J(t, Go) : e === "PassengerSpotRef" ? J(t, Ko) : []) : [], this.luggageSpots = s ? Object.entries(s).flatMap(([e, t]) => e === "LuggageSpot" ? J(t, Uo) : e === "LuggageSpotRef" ? J(t, Wo) : []) : [], this.deckEntrances = J(c?.PassengerEntrance, Mo), this.deckEntranceUsages = J(l?.DeckEntranceUsages, Lo), this.deckEntranceCouples = J(u?.DeckEntranceCouple, Po), this.deckSpaceCapacities = J(d?.DeckSpaceCapacity, qo), this.actualVehicleEquipments = J(f?.ActualVehicleEquipment, Oo), this.ServiceFacilitySetRef = p ? new Xo(p) : void 0, this.Centroid = m ? ko.fromXML(m) : void 0, this.Polygon = h ? new Yo(h) : void 0, this.PublicUse = g, this.TotalCapacity = _, this.FareClass = v, this.AirConditioned = y, this.gridMarkers = J(b?.GridMarker, Zo);
	}
	static createDefault(t) {
		return new e({
			attr_id: t,
			attr_version: "1.0",
			Name: "Default Space",
			SmokingAllowed: !1,
			StandingAllowed: !0,
			PassengerSpaceType: "seatingArea",
			passengerSpots: {
				PassengerSpot: [],
				PassengerSpotRef: []
			},
			luggageSpots: {
				LuggageSpot: [],
				LuggageSpotRef: []
			},
			deckEntrances: { PassengerEntrance: [] },
			deckEntranceUsages: { DeckEntranceUsages: [] },
			deckEntranceCouples: { DeckEntranceCouple: [] },
			deckSpaceCapacities: { DeckSpaceCapacity: [] },
			actualVehicleEquipments: { ActualVehicleEquipment: [] },
			ServiceFacilitySetRef: void 0,
			Centroid: void 0,
			Polygon: void 0,
			PublicUse: !0,
			TotalCapacity: 0,
			FareClass: "Standard",
			AirConditioned: !0
		});
	}
	getName() {
		return this.Name;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Name: this.Name,
			SmokingAllowed: this.SmokingAllowed,
			StandingAllowed: this.StandingAllowed,
			PassengerSpaceType: this.PassengerSpaceType,
			passengerSpots: this.passengerSpots ? jo(this.passengerSpots) : "",
			luggageSpots: this.luggageSpots ? jo(this.luggageSpots) : void 0,
			deckEntrances: this.deckEntrances ? jo(this.deckEntrances) : void 0,
			deckEntranceUsage: this.deckEntranceUsages ? jo(this.deckEntranceUsages) : void 0,
			deckEntranceCouples: this.deckEntranceCouples ? jo(this.deckEntranceCouples) : void 0,
			deckSpaceCapacities: this.deckSpaceCapacities ? jo(this.deckSpaceCapacities) : void 0,
			actualVehicleEquipments: this.actualVehicleEquipments ? jo(this.actualVehicleEquipments) : void 0,
			ServiceFacilitySetRef: this.ServiceFacilitySetRef?.toXML(),
			Centroid: this.Centroid?.toXML(),
			Polygon: this.Polygon?.toXML(),
			PublicUse: this.PublicUse,
			TotalCapacity: this.TotalCapacity,
			FareClass: this.FareClass,
			AirConditioned: this.AirConditioned,
			gridMarkers: { GridMarker: this.gridMarkers.map((e) => e.toXML()) }
		};
	}
}, $o = class {
	attr_id;
	attr_version;
	Label;
	constructor({ Label: e, attr_id: t, attr_version: n }) {
		this.attr_id = t, this.attr_version = n, this.Label = e;
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			Label: this.Label
		};
	}
}, es = class {
	attr_ref;
	attr_version;
	constructor({ attr_ref: e, attr_version: t }) {
		this.attr_ref = e, this.attr_version = t;
	}
	toXML() {
		return {
			attr_ref: this.attr_ref,
			attr_version: this.attr_version
		};
	}
}, ts = class e {
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
	constructor({ attr_id: e, attr_version: t, deckSpaces: n, spotRows: r = void 0, spotColumns: i = void 0, DeckLevelRef: a = void 0, Name: o = void 0, Polygon: s = void 0, polygon: c = void 0, Width: l = void 0, Length: u = void 0 }) {
		this.attr_id = e, this.attr_version = t, this.Name = o ?? "";
		let d = s ?? c;
		this.polygon = d ? new Yo(d) : void 0, this.DeckLevelRef = a ? new es(a) : void 0, this.Width = l ?? 2.825, this.Length = u ?? 26.4, this.deckspaces = n ? Object.entries(n).flatMap(([e, t]) => e === "OtherDeckSpace" ? J(t, Jo) : e === "PassengerSpace" ? J(t, Qo) : []) : [], this.spotRows = J(r?.SpotRow, Bo), this.spotColumns = J(i?.SpotColumn, Ro);
	}
	static empty(t) {
		return new e({
			attr_id: crypto.randomUUID(),
			attr_version: "1.0",
			deckSpaces: {
				OtherDeckSpace: [],
				PassengerSpace: []
			},
			spotRows: { SpotRow: [{
				attr_id: "spot_row_1",
				Label: "1"
			}, {
				attr_id: "spot_row_2",
				Label: "2"
			}] },
			spotColumns: { SpotColumn: [{
				attr_id: "spot_column_1",
				Label: "1"
			}, {
				attr_id: "spot_column_2",
				Label: "2"
			}] },
			DeckLevelRef: new es({
				attr_ref: t.attr_id,
				attr_version: "1.0"
			}),
			Name: void 0,
			polygon: void 0,
			Length: 2,
			Width: 2
		});
	}
	toXML() {
		return {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			spotRows: { SpotRow: Ao(this.spotRows) },
			spotColumns: { SpotColumn: Ao(this.spotColumns) },
			deckSpaces: jo(this.deckspaces),
			DeckLevelRef: this.DeckLevelRef?.toXML(),
			polygon: this.polygon?.toXML(),
			Name: this.Name,
			Width: this.Width,
			Length: this.Length
		};
	}
	getTotalSeatCount() {
		return this.deckspaces.reduce((e, t) => t instanceof Qo ? e + (t.passengerSpots ?? []).filter((e) => e instanceof Go).length : e, 0);
	}
	getBoundingBox() {
		return {
			width: this.Length,
			height: this.Width
		};
	}
	getShape(e) {
		let { width: t, height: n } = this.getBoundingBox();
		return {
			x: 5,
			y: 5,
			width: t * e,
			height: n * e,
			fill: "white",
			stroke: "gray",
			strokeWidth: 2,
			cornerRadius: 5
		};
	}
}, ns = class e {
	attr_id;
	attr_version;
	deckLevels;
	decks;
	constructor({ attr_id: e, attr_version: t, decks: n = void 0, deckLevels: r = void 0 }) {
		this.attr_id = e, this.attr_version = t, this.deckLevels = J(r?.DeckLevel, $o), this.decks = J(n?.Deck, ts);
	}
	static empty() {
		let t = new $o({
			Label: "Level 1",
			attr_id: "deck_level_0",
			attr_version: "1.0"
		}), n = new e({
			attr_id: crypto.randomUUID(),
			attr_version: "1.0",
			decks: { Deck: [] },
			deckLevels: { DeckLevel: [t] }
		});
		return n.decks.push(ts.empty(t)), n;
	}
	addDeckLevel() {
		let e = new $o({
			attr_id: `deck_level_${this.deckLevels.length}`,
			attr_version: "1.0",
			Label: `Level ${this.deckLevels.length + 1}`
		});
		this.deckLevels.push(e), this.decks.push(ts.empty(e));
	}
	removeDeckLevel(e) {
		this.decks = this.decks.filter((t) => t.DeckLevelRef?.attr_ref !== e), this.deckLevels = this.deckLevels.filter((t) => t?.attr_id !== e);
	}
	toXML() {
		return { DeckPlan: {
			attr_id: this.attr_id,
			attr_version: this.attr_version,
			decks: { Deck: Ao(this.decks) },
			deckLevels: { DeckLevel: Ao(this.deckLevels) }
		} };
	}
}, rs = /* @__PURE__ */ RegExp("^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
function is(e, t) {
	let n = [], r = t.exec(e);
	for (; r;) {
		let i = [];
		i.startIndex = t.lastIndex - r[0].length;
		let a = r.length;
		for (let e = 0; e < a; e++) i.push(r[e]);
		n.push(i), r = t.exec(e);
	}
	return n;
}
var as = function(e) {
	return rs.exec(e) != null;
};
function os(e) {
	return e !== void 0;
}
var ss = [
	"hasOwnProperty",
	"toString",
	"valueOf",
	"__defineGetter__",
	"__defineSetter__",
	"__lookupGetter__",
	"__lookupSetter__"
], cs = [
	"__proto__",
	"constructor",
	"prototype"
], ls = {
	allowBooleanAttributes: !1,
	unpairedTags: []
};
function us(e, t) {
	t = Object.assign({}, ls, t);
	let n = [], r = !1, i = !1;
	e[0] === "﻿" && (e = e.substr(1));
	for (let a = 0; a < e.length; a++) if (e[a] === "<" && e[a + 1] === "?") {
		if (a += 2, a = fs(e, a), a.err) return a;
	} else if (e[a] === "<") {
		let o = a;
		if (a++, e[a] === "!") {
			a = ps(e, a);
			continue;
		}
		{
			let s = !1;
			e[a] === "/" && (s = !0, a++);
			let c = "";
			for (; a < e.length && e[a] !== ">" && e[a] !== " " && e[a] !== "	" && e[a] !== "\n" && e[a] !== "\r"; a++) c += e[a];
			if (c = c.trim(), c[c.length - 1] === "/" && (c = c.substring(0, c.length - 1), a--), !Ss(c)) {
				let t;
				return t = c.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + c + "' is an invalid name.", Y("InvalidTag", t, X(e, a));
			}
			let l = gs(e, a);
			if (l === !1) return Y("InvalidAttr", "Attributes for '" + c + "' have open quote.", X(e, a));
			let u = l.value;
			if (a = l.index, u[u.length - 1] === "/") {
				let n = a - u.length;
				u = u.substring(0, u.length - 1);
				let i = vs(u, t);
				if (i === !0) r = !0;
				else return Y(i.err.code, i.err.msg, X(e, n + i.err.line));
			} else if (s) {
				if (!l.tagClosed) return Y("InvalidTag", "Closing tag '" + c + "' doesn't have proper closing.", X(e, a));
				if (u.trim().length > 0) return Y("InvalidTag", "Closing tag '" + c + "' can't have attributes or invalid starting.", X(e, o));
				if (n.length === 0) return Y("InvalidTag", "Closing tag '" + c + "' has not been opened.", X(e, o));
				{
					let t = n.pop();
					if (c !== t.tagName) {
						let n = X(e, t.tagStartPos);
						return Y("InvalidTag", "Expected closing tag '" + t.tagName + "' (opened in line " + n.line + ", col " + n.col + ") instead of closing tag '" + c + "'.", X(e, o));
					}
					n.length == 0 && (i = !0);
				}
			} else {
				let s = vs(u, t);
				if (s !== !0) return Y(s.err.code, s.err.msg, X(e, a - u.length + s.err.line));
				if (i === !0) return Y("InvalidXml", "Multiple possible root nodes found.", X(e, a));
				t.unpairedTags.indexOf(c) !== -1 || n.push({
					tagName: c,
					tagStartPos: o
				}), r = !0;
			}
			for (a++; a < e.length; a++) if (e[a] === "<") {
				if (e[a + 1] === "!") {
					a++, a = ps(e, a);
					continue;
				}
				if (e[a + 1] === "?") {
					if (a = fs(e, ++a), a.err) return a;
				} else break;
			} else if (e[a] === "&") {
				let t = bs(e, a);
				if (t == -1) return Y("InvalidChar", "char '&' is not expected.", X(e, a));
				a = t;
			} else if (i === !0 && !ds(e[a])) return Y("InvalidXml", "Extra text at the end", X(e, a));
			e[a] === "<" && a--;
		}
	} else {
		if (ds(e[a])) continue;
		return Y("InvalidChar", "char '" + e[a] + "' is not expected.", X(e, a));
	}
	return r ? n.length == 1 ? Y("InvalidTag", "Unclosed tag '" + n[0].tagName + "'.", X(e, n[0].tagStartPos)) : n.length > 0 ? Y("InvalidXml", "Invalid '" + JSON.stringify(n.map((e) => e.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
		line: 1,
		col: 1
	}) : !0 : Y("InvalidXml", "Start tag expected.", 1);
}
function ds(e) {
	return e === " " || e === "	" || e === "\n" || e === "\r";
}
function fs(e, t) {
	let n = t;
	for (; t < e.length; t++) if (e[t] == "?" || e[t] == " ") {
		let r = e.substr(n, t - n);
		if (t > 5 && r === "xml") return Y("InvalidXml", "XML declaration allowed only at the start of the document.", X(e, t));
		if (e[t] == "?" && e[t + 1] == ">") {
			t++;
			break;
		}
		continue;
	}
	return t;
}
function ps(e, t) {
	if (e.length > t + 5 && e[t + 1] === "-" && e[t + 2] === "-") {
		for (t += 3; t < e.length; t++) if (e[t] === "-" && e[t + 1] === "-" && e[t + 2] === ">") {
			t += 2;
			break;
		}
	} else if (e.length > t + 8 && e[t + 1] === "D" && e[t + 2] === "O" && e[t + 3] === "C" && e[t + 4] === "T" && e[t + 5] === "Y" && e[t + 6] === "P" && e[t + 7] === "E") {
		let n = 1;
		for (t += 8; t < e.length; t++) if (e[t] === "<") n++;
		else if (e[t] === ">" && (n--, n === 0)) break;
	} else if (e.length > t + 9 && e[t + 1] === "[" && e[t + 2] === "C" && e[t + 3] === "D" && e[t + 4] === "A" && e[t + 5] === "T" && e[t + 6] === "A" && e[t + 7] === "[") {
		for (t += 8; t < e.length; t++) if (e[t] === "]" && e[t + 1] === "]" && e[t + 2] === ">") {
			t += 2;
			break;
		}
	}
	return t;
}
var ms = "\"", hs = "'";
function gs(e, t) {
	let n = "", r = "", i = !1;
	for (; t < e.length; t++) {
		if (e[t] === ms || e[t] === hs) r === "" ? r = e[t] : r !== e[t] || (r = "");
		else if (e[t] === ">" && r === "") {
			i = !0;
			break;
		}
		n += e[t];
	}
	return r === "" && {
		value: n,
		index: t,
		tagClosed: i
	};
}
function _s(e) {
	let t = [], n = e.length, r = 0;
	for (; r < n;) {
		let i = r;
		for (; r < n && ds(e[r]);) r++;
		if (r >= n) break;
		if (e[r] === "=") {
			r++;
			continue;
		}
		let a = e.slice(i, r), o = r;
		for (; r < n && !ds(e[r]) && e[r] !== "=";) r++;
		let s = e.slice(o, r), c, l = r;
		for (; l < n && ds(e[l]);) l++;
		l < n && e[l] === "=" && (c = e.slice(r, l + 1), r = l + 1);
		let u, d, f = r;
		for (; f < n && ds(e[f]);) f++;
		if (f < n && (e[f] === "\"" || e[f] === "'")) {
			let t = f + 1, n = e.indexOf(e[f], t);
			n !== -1 && (u = e[f], d = e.slice(t, n), r = n + 1);
		}
		let p = { startIndex: i };
		p[1] = a, p[2] = s, p[3] = c, p[4] = u !== void 0 || void 0, p[5] = u, p[6] = d, t.push(p);
	}
	return t;
}
function vs(e, t) {
	let n = _s(e), r = {};
	for (let e = 0; e < n.length; e++) {
		if (n[e][1].length === 0) return Y("InvalidAttr", "Attribute '" + n[e][2] + "' has no space in starting.", Cs(n[e]));
		if (n[e][3] !== void 0 && n[e][4] === void 0) return Y("InvalidAttr", "Attribute '" + n[e][2] + "' is without value.", Cs(n[e]));
		if (n[e][3] === void 0 && !t.allowBooleanAttributes) return Y("InvalidAttr", "boolean attribute '" + n[e][2] + "' is not allowed.", Cs(n[e]));
		let i = n[e][2];
		if (!xs(i)) return Y("InvalidAttr", "Attribute '" + i + "' is an invalid name.", Cs(n[e]));
		if (!Object.prototype.hasOwnProperty.call(r, i)) r[i] = 1;
		else return Y("InvalidAttr", "Attribute '" + i + "' is repeated.", Cs(n[e]));
	}
	return !0;
}
function ys(e, t) {
	let n = /\d/;
	for (e[t] === "x" && (t++, n = /[\da-fA-F]/); t < e.length; t++) {
		if (e[t] === ";") return t;
		if (!e[t].match(n)) break;
	}
	return -1;
}
function bs(e, t) {
	if (t++, e[t] === ";") return -1;
	if (e[t] === "#") return t++, ys(e, t);
	let n = 0;
	for (; t < e.length; t++, n++) if (!(e[t].match(/\w/) && n < 20)) {
		if (e[t] === ";") break;
		return -1;
	}
	return t;
}
function Y(e, t, n) {
	return { err: {
		code: e,
		msg: t,
		line: n.line || n,
		col: n.col
	} };
}
function xs(e) {
	return as(e);
}
function Ss(e) {
	return as(e);
}
function X(e, t) {
	let n = e.substring(0, t).split(/\r?\n/);
	return {
		line: n.length,
		col: n[n.length - 1].length + 1
	};
}
function Cs(e) {
	return e.startIndex + e[1].length;
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/@nodable/entities/src/entities.js
var ws = {
	cent: "¢",
	pound: "£",
	curren: "¤",
	yen: "¥",
	euro: "€",
	dollar: "$",
	fnof: "ƒ",
	inr: "₹",
	af: "؋",
	birr: "ብር",
	peso: "₱",
	rub: "₽",
	won: "₩",
	yuan: "¥",
	cedil: "¸"
}, Ts = {
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	quot: "\""
}, Es = {
	nbsp: "\xA0",
	copy: "©",
	reg: "®",
	trade: "™",
	mdash: "—",
	ndash: "–",
	hellip: "…",
	laquo: "«",
	raquo: "»",
	lsquo: "‘",
	rsquo: "’",
	ldquo: "“",
	rdquo: "”",
	bull: "•",
	para: "¶",
	sect: "§",
	deg: "°",
	frac12: "½",
	frac14: "¼",
	frac34: "¾"
}, Ds = Object.freeze({
	ALLOW: "allow",
	BLOCK: "block",
	THROW: "throw"
}), Os = /* @__PURE__ */ new Set("!?\\\\/[]$%{}^&*()<>|+");
function ks(e) {
	if (e[0] === "#") throw Error(`[EntityReplacer] Invalid character '#' in entity name: "${e}"`);
	for (let t of e) if (Os.has(t)) throw Error(`[EntityReplacer] Invalid character '${t}' in entity name: "${e}"`);
	return e;
}
function As(...e) {
	let t = Object.create(null);
	for (let n of e) if (n) for (let e of Object.keys(n)) {
		let r = n[e];
		if (typeof r == "string") t[e] = r;
		else if (r && typeof r == "object" && r.val !== void 0) {
			let n = r.val;
			typeof n == "string" && (t[e] = n);
		}
	}
	return t;
}
var js = "external", Ms = "base", Ns = "all";
function Ps(e) {
	return !e || e === js ? /* @__PURE__ */ new Set([js]) : e === Ns ? /* @__PURE__ */ new Set([Ns]) : e === Ms ? /* @__PURE__ */ new Set([Ms]) : Array.isArray(e) ? new Set(e) : /* @__PURE__ */ new Set([js]);
}
var Z = Object.freeze({
	allow: 0,
	leave: 1,
	remove: 2,
	throw: 3
}), Fs = /* @__PURE__ */ new Set([
	9,
	10,
	13
]);
function Is(e) {
	if (!e) return {
		xmlVersion: 1,
		onLevel: Z.allow,
		nullLevel: Z.remove
	};
	let t = e.xmlVersion === 1.1 ? 1.1 : 1, n = Z[e.onNCR] ?? Z.allow, r = Z[e.nullNCR] ?? Z.remove;
	return {
		xmlVersion: t,
		onLevel: n,
		nullLevel: Math.max(r, Z.remove)
	};
}
var Ls = class {
	constructor(e = {}) {
		this._limit = e.limit || {}, this._maxTotalExpansions = this._limit.maxTotalExpansions || 0, this._maxExpandedLength = this._limit.maxExpandedLength || 0, this._postCheck = typeof e.postCheck == "function" ? e.postCheck : (e) => e, this._limitTiers = Ps(this._limit.applyLimitsTo ?? js), this._numericAllowed = e.numericAllowed ?? !0, this._baseMap = As(Ts, e.namedEntities || null), this._externalMap = Object.create(null), this._inputMap = Object.create(null), this._totalExpansions = 0, this._expandedLength = 0, this._removeSet = new Set(e.remove && Array.isArray(e.remove) ? e.remove : []), this._leaveSet = new Set(e.leave && Array.isArray(e.leave) ? e.leave : []);
		let t = Is(e.ncr);
		this._ncrXmlVersion = t.xmlVersion, this._ncrOnLevel = t.onLevel, this._ncrNullLevel = t.nullLevel, this._onExternalEntity = typeof e.onExternalEntity == "function" ? e.onExternalEntity : null, this._onInputEntity = typeof e.onInputEntity == "function" ? e.onInputEntity : null;
	}
	_applyRegistrationHook(e, t, n, r) {
		if (!e) return !0;
		let i = e(t, n);
		if (i === Ds.BLOCK) return !1;
		if (i === Ds.THROW) throw Error(`[EntityDecoder] Registration of ${r} entity "&${t};" was rejected by hook`);
		return !0;
	}
	setExternalEntities(e) {
		if (e) for (let t of Object.keys(e)) ks(t);
		if (!this._onExternalEntity) {
			this._externalMap = As(e);
			return;
		}
		let t = As(e), n = Object.create(null);
		for (let [e, r] of Object.entries(t)) this._applyRegistrationHook(this._onExternalEntity, e, r, "external") && (n[e] = r);
		this._externalMap = n;
	}
	addExternalEntity(e, t) {
		ks(e), typeof t == "string" && t.indexOf("&") === -1 && this._applyRegistrationHook(this._onExternalEntity, e, t, "external") && (this._externalMap[e] = t);
	}
	addInputEntities(e) {
		if (this._totalExpansions = 0, this._expandedLength = 0, !this._onInputEntity) {
			this._inputMap = As(e);
			return;
		}
		let t = As(e), n = Object.create(null);
		for (let [e, r] of Object.entries(t)) this._applyRegistrationHook(this._onInputEntity, e, r, "input") && (n[e] = r);
		this._inputMap = n;
	}
	reset() {
		return this._inputMap = Object.create(null), this._totalExpansions = 0, this._expandedLength = 0, this;
	}
	setXmlVersion(e) {
		this._ncrXmlVersion = e === 1.1 ? 1.1 : 1;
	}
	decode(e) {
		if (typeof e != "string" || e.length === 0 || e.indexOf("&") === -1) return e;
		let t = e, n = [], r = e.length, i = 0, a = 0, o = this._maxTotalExpansions > 0, s = this._maxExpandedLength > 0, c = o || s;
		for (; a < r;) {
			if (e.charCodeAt(a) !== 38) {
				a++;
				continue;
			}
			let t = a + 1;
			for (; t < r && e.charCodeAt(t) !== 59 && t - a <= 32;) t++;
			if (t >= r || e.charCodeAt(t) !== 59) {
				a++;
				continue;
			}
			let l = e.slice(a + 1, t);
			if (l.length === 0) {
				a++;
				continue;
			}
			let u, d;
			if (this._removeSet.has(l)) u = "", d === void 0 && (d = js);
			else if (this._leaveSet.has(l)) {
				a++;
				continue;
			} else if (l.charCodeAt(0) === 35) {
				let e = this._resolveNCR(l);
				if (e === void 0) {
					a++;
					continue;
				}
				u = e, d = Ms;
			} else {
				let e = this._resolveName(l);
				u = e?.value, d = e?.tier;
			}
			if (u === void 0) a++;
			else if (a > i && n.push(e.slice(i, a)), n.push(u), i = t + 1, a = i, c && this._tierCounts(d)) {
				if (o && (this._totalExpansions++, this._totalExpansions > this._maxTotalExpansions)) throw Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);
				if (s) {
					let e = u.length - (l.length + 2);
					if (e > 0 && (this._expandedLength += e, this._expandedLength > this._maxExpandedLength)) throw Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`);
				}
			}
		}
		i < r && n.push(e.slice(i));
		let l = n.length === 0 ? e : n.join("");
		return this._postCheck(l, t);
	}
	_tierCounts(e) {
		return this._limitTiers.has(Ns) ? !0 : this._limitTiers.has(e);
	}
	_resolveName(e) {
		if (e in this._inputMap) return {
			value: this._inputMap[e],
			tier: js
		};
		if (e in this._externalMap) return {
			value: this._externalMap[e],
			tier: js
		};
		if (e in this._baseMap) return {
			value: this._baseMap[e],
			tier: Ms
		};
	}
	_classifyNCR(e) {
		return e === 0 ? this._ncrNullLevel : e >= 55296 && e <= 57343 || this._ncrXmlVersion === 1 && e >= 1 && e <= 31 && !Fs.has(e) ? Z.remove : -1;
	}
	_applyNCRAction(e, t, n) {
		switch (e) {
			case Z.allow: return String.fromCodePoint(n);
			case Z.remove: return "";
			case Z.leave: return;
			case Z.throw: throw Error(`[EntityDecoder] Prohibited numeric character reference &${t}; (U+${n.toString(16).toUpperCase().padStart(4, "0")})`);
			default: return String.fromCodePoint(n);
		}
	}
	_resolveNCR(e) {
		let t = e.charCodeAt(1), n;
		if (n = t === 120 || t === 88 ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10), Number.isNaN(n) || n < 0 || n > 1114111) return;
		let r = this._classifyNCR(n);
		if (!this._numericAllowed && r < Z.remove) return;
		let i = r === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, r);
		return this._applyNCRAction(i, e, n);
	}
}, Rs = (e) => ss.includes(e) ? "__" + e : e, zs = {
	preserveOrder: !1,
	attributeNamePrefix: "@_",
	attributesGroupName: !1,
	textNodeName: "#text",
	ignoreAttributes: !0,
	removeNSPrefix: !1,
	allowBooleanAttributes: !1,
	parseTagValue: !0,
	parseAttributeValue: !1,
	trimValues: !0,
	cdataPropName: !1,
	numberParseOptions: {
		hex: !0,
		leadingZeros: !0,
		eNotation: !0,
		unicode: !1
	},
	tagValueProcessor: function(e, t) {
		return t;
	},
	attributeValueProcessor: function(e, t) {
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
	updateTag: function(e, t, n) {
		return e;
	},
	captureMetaData: !1,
	maxNestedTags: 100,
	strictReservedNames: !0,
	jPath: !0,
	onDangerousProperty: Rs
};
function Bs(e, t) {
	if (typeof e != "string") return;
	let n = e.toLowerCase();
	if (ss.some((e) => n === e.toLowerCase()) || cs.some((e) => n === e.toLowerCase())) throw Error(`[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);
}
function Vs(e, t) {
	return typeof e == "boolean" ? {
		enabled: e,
		maxEntitySize: 1e4,
		maxExpansionDepth: 1e4,
		maxTotalExpansions: Infinity,
		maxExpandedLength: 1e5,
		maxEntityCount: 1e3,
		allowedTags: null,
		tagFilter: null,
		appliesTo: "all"
	} : typeof e == "object" && e ? {
		enabled: e.enabled !== !1,
		maxEntitySize: Math.max(1, e.maxEntitySize ?? 1e4),
		maxExpansionDepth: Math.max(1, e.maxExpansionDepth ?? 1e4),
		maxTotalExpansions: Math.max(1, e.maxTotalExpansions ?? Infinity),
		maxExpandedLength: Math.max(1, e.maxExpandedLength ?? 1e5),
		maxEntityCount: Math.max(1, e.maxEntityCount ?? 1e3),
		allowedTags: e.allowedTags ?? null,
		tagFilter: e.tagFilter ?? null,
		appliesTo: e.appliesTo ?? "all"
	} : Vs(!0);
}
var Hs = function(e) {
	let t = Object.assign({}, zs, e), n = [
		{
			value: t.attributeNamePrefix,
			name: "attributeNamePrefix"
		},
		{
			value: t.attributesGroupName,
			name: "attributesGroupName"
		},
		{
			value: t.textNodeName,
			name: "textNodeName"
		},
		{
			value: t.cdataPropName,
			name: "cdataPropName"
		},
		{
			value: t.commentPropName,
			name: "commentPropName"
		}
	];
	for (let { value: e, name: t } of n) e && Bs(e, t);
	return t.onDangerousProperty === null && (t.onDangerousProperty = Rs), t.processEntities = Vs(t.processEntities, t.htmlEntities), t.unpairedTagsSet = new Set(t.unpairedTags), t.stopNodes && Array.isArray(t.stopNodes) && (t.stopNodes = t.stopNodes.map((e) => typeof e == "string" && e.startsWith("*.") ? ".." + e.substring(2) : e)), t;
}, Us = typeof Symbol == "function" ? Symbol("XML Node Metadata") : "@@xmlMetadata", Ws = class {
	constructor(e) {
		this.tagname = e, this.child = [], this[":@"] = Object.create(null);
	}
	add(e, t) {
		e === "__proto__" && (e = "#__proto__"), this.child.push({ [e]: t });
	}
	addChild(e, t) {
		e.tagname === "__proto__" && (e.tagname = "#__proto__"), e[":@"] && Object.keys(e[":@"]).length > 0 ? this.child.push({
			[e.tagname]: e.child,
			":@": e[":@"]
		}) : this.child.push({ [e.tagname]: e.child }), this.addStartIndex(t);
	}
	addStartIndex(e) {
		e !== void 0 && (this.child[this.child.length - 1][Us] = { startIndex: e });
	}
	addEndIndex(e) {
		let t = this.child[this.child.length - 1];
		t !== void 0 && t[Us] !== void 0 && t[Us].endIndex === void 0 && (t[Us].endIndex = e);
	}
	static getMetaDataSymbol() {
		return Us;
	}
}, Gs = ":A-Za-z_À-ÖØ-öø-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�", Ks = Gs + "\\-\\.\\d·̀-ͯ‿-⁀", qs = ":A-Za-z_À-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�𐀀-󯿿", Js = qs + "\\-\\.\\d·̀-ͯ҇‿-⁀", Ys = (e, t, n = "") => {
	let r = `[${e.replace(":", "")}][${t.replace(":", "")}]*`;
	return {
		name: RegExp(`^[${e}][${t}]*$`, n),
		ncName: RegExp(`^${r}$`, n),
		qName: RegExp(`^${r}(?::${r})?$`, n),
		nmToken: RegExp(`^[${t}]+$`, n),
		nmTokens: RegExp(`^[${t}]+(?:\\s+[${t}]+)*$`, n)
	};
}, Xs = Ys(Gs, Ks), Zs = Ys(qs, Js, "u"), Qs = Ys(":A-Za-z_", ":A-Za-z_\\-\\.\\d"), $s = (e = "1.0", t = !1) => t ? Qs : e === "1.1" ? Zs : Xs, ec = (e, { xmlVersion: t = "1.0", asciiOnly: n = !1 } = {}) => $s(t, n).qName.test(e), tc = class {
	constructor(e, t) {
		this.suppressValidationErr = !e, this.options = e, this.xmlVersion = t || 1;
	}
	setXmlVersion(e = 1) {
		this.xmlVersion = e;
	}
	readDocType(e, t) {
		let n = Object.create(null), r = 0;
		if (e[t + 3] === "O" && e[t + 4] === "C" && e[t + 5] === "T" && e[t + 6] === "Y" && e[t + 7] === "P" && e[t + 8] === "E") {
			t += 9;
			let i = 1, a = !1, o = !1, s = null, c = "";
			for (; t < e.length; t++) if (s !== null) e[t] === s && (s = null), c += e[t];
			else if (!a && !o && (e[t] === "\"" || e[t] === "'")) s = e[t], c += e[t];
			else if (e[t] === "<" && !o) {
				if (a && nc(e, "!ENTITY", t)) {
					t += 7;
					let i, a;
					if ([i, a, t] = this.readEntityExp(e, t + 1, this.suppressValidationErr), a.indexOf("&") === -1) {
						if (this.options.enabled !== !1 && this.options.maxEntityCount != null && r >= this.options.maxEntityCount) throw Error(`Entity count (${r + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
						n[i] = a, r++;
					}
				} else if (a && nc(e, "!ELEMENT", t)) {
					t += 8;
					let { index: n } = this.readElementExp(e, t + 1);
					t = n;
				} else if (a && nc(e, "!ATTLIST", t)) t += 8;
				else if (a && nc(e, "!NOTATION", t)) {
					t += 9;
					let { index: n } = this.readNotationExp(e, t + 1, this.suppressValidationErr);
					t = n;
				} else if (nc(e, "!--", t)) o = !0;
				else throw Error("Invalid DOCTYPE");
				i++, c = "";
			} else if (e[t] === ">") {
				if (o ? e[t - 1] === "-" && e[t - 2] === "-" && (o = !1, i--) : i--, i === 0) break;
			} else e[t] === "[" ? a = !0 : c += e[t];
			if (s !== null || i !== 0) throw Error("Unclosed DOCTYPE");
		} else throw Error("Invalid Tag instead of DOCTYPE");
		return {
			entities: n,
			i: t
		};
	}
	readEntityExp(e, t) {
		t = Q(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]) && e[t] !== "\"" && e[t] !== "'";) t++;
		let r = e.substring(n, t);
		if (rc(r, { xmlVersion: this.xmlVersion }), t = Q(e, t), !this.suppressValidationErr) {
			if (e.substring(t, t + 6).toUpperCase() === "SYSTEM") throw Error("External entities are not supported");
			if (e[t] === "%") throw Error("Parameter entities are not supported");
		}
		let i = "";
		if ([t, i] = this.readIdentifierVal(e, t, "entity"), this.options.enabled !== !1 && this.options.maxEntitySize != null && i.length > this.options.maxEntitySize) throw Error(`Entity "${r}" size (${i.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
		return t--, [
			r,
			i,
			t
		];
	}
	readNotationExp(e, t) {
		t = Q(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]);) t++;
		let r = e.substring(n, t);
		!this.suppressValidationErr && rc(r, { xmlVersion: this.xmlVersion }), t = Q(e, t);
		let i = e.substring(t, t + 6).toUpperCase();
		if (!this.suppressValidationErr && i !== "SYSTEM" && i !== "PUBLIC") throw Error(`Expected SYSTEM or PUBLIC, found "${i}"`);
		t += i.length, t = Q(e, t);
		let a = null, o = null;
		if (i === "PUBLIC") [t, a] = this.readIdentifierVal(e, t, "publicIdentifier"), t = Q(e, t), (e[t] === "\"" || e[t] === "'") && ([t, o] = this.readIdentifierVal(e, t, "systemIdentifier"));
		else if (i === "SYSTEM" && ([t, o] = this.readIdentifierVal(e, t, "systemIdentifier"), !this.suppressValidationErr && !o)) throw Error("Missing mandatory system identifier for SYSTEM notation");
		return {
			notationName: r,
			publicIdentifier: a,
			systemIdentifier: o,
			index: --t
		};
	}
	readIdentifierVal(e, t, n) {
		let r = "", i = e[t];
		if (i !== "\"" && i !== "'") throw Error(`Expected quoted string, found "${i}"`);
		t++;
		let a = t;
		for (; t < e.length && e[t] !== i;) t++;
		if (r = e.substring(a, t), e[t] !== i) throw Error(`Unterminated ${n} value`);
		return t++, [t, r];
	}
	readElementExp(e, t) {
		t = Q(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]);) t++;
		let r = e.substring(n, t);
		if (!this.suppressValidationErr && !ec(r, { xmlVersion: this.xmlVersion })) throw Error(`Invalid element name: "${r}"`);
		t = Q(e, t);
		let i = "";
		if (e[t] === "E" && nc(e, "MPTY", t)) t += 4;
		else if (e[t] === "A" && nc(e, "NY", t)) t += 2;
		else if (e[t] === "(") {
			t++;
			let n = t;
			for (; t < e.length && e[t] !== ")";) t++;
			if (i = e.substring(n, t), e[t] !== ")") throw Error("Unterminated content model");
		} else if (!this.suppressValidationErr) throw Error(`Invalid Element Expression, found "${e[t]}"`);
		return {
			elementName: r,
			contentModel: i.trim(),
			index: t
		};
	}
	readAttlistExp(e, t) {
		t = Q(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]);) t++;
		let r = e.substring(n, t);
		for (rc(r, { xmlVersion: this.xmlVersion }), t = Q(e, t), n = t; t < e.length && !/\s/.test(e[t]);) t++;
		let i = e.substring(n, t);
		if (!rc(i, { xmlVersion: this.xmlVersion })) throw Error(`Invalid attribute name: "${i}"`);
		t = Q(e, t);
		let a = "";
		if (e.substring(t, t + 8).toUpperCase() === "NOTATION") {
			if (a = "NOTATION", t += 8, t = Q(e, t), e[t] !== "(") throw Error(`Expected '(', found "${e[t]}"`);
			t++;
			let n = [];
			for (; t < e.length && e[t] !== ")";) {
				let r = t;
				for (; t < e.length && e[t] !== "|" && e[t] !== ")";) t++;
				let i = e.substring(r, t);
				if (i = i.trim(), !rc(i, { xmlVersion: this.xmlVersion })) throw Error(`Invalid notation name: "${i}"`);
				n.push(i), e[t] === "|" && (t++, t = Q(e, t));
			}
			if (e[t] !== ")") throw Error("Unterminated list of notations");
			t++, a += " (" + n.join("|") + ")";
		} else {
			let n = t;
			for (; t < e.length && !/\s/.test(e[t]);) t++;
			if (a += e.substring(n, t), !this.suppressValidationErr && ![
				"CDATA",
				"ID",
				"IDREF",
				"IDREFS",
				"ENTITY",
				"ENTITIES",
				"NMTOKEN",
				"NMTOKENS"
			].includes(a.toUpperCase())) throw Error(`Invalid attribute type: "${a}"`);
		}
		t = Q(e, t);
		let o = "";
		return e.substring(t, t + 8).toUpperCase() === "#REQUIRED" ? (o = "#REQUIRED", t += 8) : e.substring(t, t + 7).toUpperCase() === "#IMPLIED" ? (o = "#IMPLIED", t += 7) : [t, o] = this.readIdentifierVal(e, t, "ATTLIST"), {
			elementName: r,
			attributeName: i,
			attributeType: a,
			defaultValue: o,
			index: t
		};
	}
}, Q = (e, t) => {
	for (; t < e.length && /\s/.test(e[t]);) t++;
	return t;
};
function nc(e, t, n) {
	for (let r = 0; r < t.length; r++) if (t[r] !== e[n + r + 1]) return !1;
	return !0;
}
function rc(e, t) {
	if (ec(e, { xmlVersion: t })) return e;
	throw Error(`Invalid entity name ${e}`);
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/anynum/digitTable.js
var ic = [
	48,
	1632,
	1776,
	2406,
	2534,
	2662,
	2790,
	2918,
	3046,
	3174,
	3302,
	3430,
	3558,
	3664,
	3792,
	3872,
	4160,
	4240,
	6112,
	6160,
	6470,
	6608,
	6784,
	6800,
	6992,
	7088,
	7232,
	7248,
	65296,
	120782,
	120792,
	120802,
	120812,
	120822,
	66720,
	68912,
	69734,
	69872,
	69942,
	70096,
	70384,
	70736,
	70864,
	71248,
	71360,
	71472,
	71904,
	72016,
	72688,
	72784,
	73040,
	73120,
	73552,
	92768,
	92864,
	93008,
	123200,
	123632,
	124144,
	125264,
	130032
], ac = /* @__PURE__ */ new Map(), oc = 65535, sc = 1632, cc = (/* @__PURE__ */ new Uint8Array(63904)).fill(255);
for (let e of ic) for (let t = 0; t < 10; t++) {
	let n = e + t;
	n <= oc ? cc[n - sc] = t : ac.set(n, t);
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/anynum/anynum.js
var lc = 48, uc = 57, dc = 45, fc = /* @__PURE__ */ new Set([
	8722,
	65293,
	65123
]);
function pc(e) {
	if (typeof e != "string") return e;
	let t = e.length;
	if (t === 0) return e;
	let n = -1;
	for (let r = 0; r < t; r++) {
		let i = e.charCodeAt(r);
		if (!(i >= lc && i <= uc || i === dc)) {
			if (i < 1632) {
				if (fc.has(i)) {
					n = r;
					break;
				}
			} else if (i >= 55296 && i <= 56319) {
				if (r + 1 < t) {
					let t = e.charCodeAt(r + 1);
					if (t >= 56320 && t <= 57343) {
						let e = 65536 + (i - 55296 << 10) + (t - 56320);
						if (ac.has(e)) {
							n = r;
							break;
						}
					}
				}
			} else if (cc[i - 1632] !== 255 || fc.has(i)) {
				n = r;
				break;
			}
		}
	}
	if (n === -1) return e;
	let r = [];
	n > 0 && r.push(e.slice(0, n));
	for (let i = n; i < t; i++) {
		let n = e.charCodeAt(i);
		if (n >= lc && n <= uc || n === dc) {
			r.push(e[i]);
			continue;
		}
		if (n < 1632) {
			r.push(fc.has(n) ? "-" : e[i]);
			continue;
		}
		if (n >= 55296 && n <= 56319) {
			if (i + 1 < t) {
				let t = e.charCodeAt(i + 1);
				if (t >= 56320 && t <= 57343) {
					let e = 65536 + (n - 55296 << 10) + (t - 56320), a = ac.get(e);
					if (a !== void 0) {
						r.push(String.fromCharCode(a + 48)), i++;
						continue;
					}
				}
			}
			r.push(e[i]);
			continue;
		}
		if (fc.has(n)) {
			r.push("-");
			continue;
		}
		let a = cc[n - sc];
		r.push(a === 255 ? e[i] : String.fromCharCode(a + 48));
	}
	return r.join("");
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/strnum/strnum.js
var mc = /^[-+]?0x[a-fA-F0-9]+$/, hc = /^0b[01]+$/, gc = /^0o[0-7]+$/, _c = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, vc = {
	hex: !0,
	binary: !1,
	octal: !1,
	leadingZeros: !0,
	decimalPoint: ".",
	eNotation: !0,
	infinity: "original",
	unicode: !1
};
function yc(e, t = {}) {
	if (t = Object.assign({}, vc, t), !e || typeof e != "string") return e;
	let n = e.trim();
	if (n.length === 0 || t.skipLike !== void 0 && t.skipLike.test(n)) return e;
	if (n === "0" || t.unicode && (n = pc(n), n === "0")) return 0;
	if (t.hex && mc.test(n)) return Cc(n, 16);
	if (t.binary && hc.test(n)) return Cc(n, 2);
	if (t.octal && gc.test(n)) return Cc(n, 8);
	if (!isFinite(n)) {
		let r = Number(n);
		return Number.isNaN(r) ? e : wc(e, r, t);
	}
	if (n.includes("e") || n.includes("E")) return xc(e, n, t);
	{
		let r = _c.exec(n);
		if (r) {
			let i = r[1] || "", a = r[2], o = Sc(r[3]), s = i ? n[a.length + 1] === "." : n[a.length] === ".";
			if (!t.leadingZeros && (a.length > 1 || a.length === 1 && !s)) return e;
			{
				let r = Number(n), s = String(r);
				if (r === 0) return r;
				if (s.search(/[eE]/) !== -1) return t.eNotation ? r : e;
				if (n.indexOf(".") !== -1) return s === "0" || s === o || s === `${i}${o}` ? r : e;
				let c = a ? o : n;
				return a ? c === s || i + c === s ? r : e : c === s || c === i + s ? r : e;
			}
		}
		return e;
	}
}
var bc = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function xc(e, t, n) {
	if (!n.eNotation) return e;
	let r = t.match(bc);
	if (r) {
		let i = r[1] || "", a = r[3].indexOf("e") === -1 ? "E" : "e", o = r[2], s = i ? t[o.length + 1] === a : t[o.length] === a;
		return o.length > 1 && s ? e : o.length === 1 && (r[3].startsWith(`.${a}`) || r[3][0] === a) ? Number(t) : o.length > 0 ? n.leadingZeros && !s ? Number(t) : e : Number(t);
	}
	return e;
}
function Sc(e) {
	if (e && e.indexOf(".") !== -1) {
		let t = e.length;
		for (; t > 0 && e.charCodeAt(t - 1) === 48;) t--;
		return e = e.slice(0, t), e === "." ? e = "0" : e[0] === "." ? e = "0" + e : e[e.length - 1] === "." && (e = e.substring(0, e.length - 1)), e;
	}
	return e;
}
function Cc(e, t) {
	let n = e.trim();
	if ((t === 2 || t === 8) && (e = n.substring(2)), parseInt) return parseInt(e, t);
	if (Number.parseInt) return Number.parseInt(e, t);
	if (window && window.parseInt) return window.parseInt(e, t);
	throw Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
function wc(e, t, n) {
	let r = t === Infinity;
	switch (n.infinity.toLowerCase()) {
		case "null": return null;
		case "infinity": return t;
		case "string": return r ? "Infinity" : "-Infinity";
		default: return e;
	}
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/fast-xml-parser/src/ignoreAttributes.js
function Tc(e) {
	return typeof e == "function" ? e : Array.isArray(e) ? (t) => {
		for (let n of e) if (typeof n == "string" && t === n || n instanceof RegExp && n.test(t)) return !0;
	} : () => !1;
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/path-expression-matcher/src/Expression.js
var Ec = class {
	constructor(e, t = {}, n) {
		this.pattern = e, this.separator = t.separator || ".", this.segments = this._parse(e), this.data = n, this._hasDeepWildcard = this.segments.some((e) => e.type === "deep-wildcard"), this._hasAttributeCondition = this.segments.some((e) => e.attrName !== void 0), this._hasPositionSelector = this.segments.some((e) => e.position !== void 0);
	}
	_parse(e) {
		let t = [], n = 0, r = "";
		for (; n < e.length;) e[n] === this.separator ? n + 1 < e.length && e[n + 1] === this.separator ? (r.trim() && (t.push(this._parseSegment(r.trim())), r = ""), t.push({ type: "deep-wildcard" }), n += 2) : (r.trim() && t.push(this._parseSegment(r.trim())), r = "", n++) : (r += e[n], n++);
		return r.trim() && t.push(this._parseSegment(r.trim())), t;
	}
	_parseSegment(e) {
		let t = { type: "tag" }, n = null, r = e, i = e.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
		if (i && (r = i[1] + i[3], i[2])) {
			let e = i[2].slice(1, -1);
			e && (n = e);
		}
		let a, o = r;
		if (r.includes("::")) {
			let t = r.indexOf("::");
			if (a = r.substring(0, t).trim(), o = r.substring(t + 2).trim(), !a) throw Error(`Invalid namespace in pattern: ${e}`);
		}
		let s, c = null;
		if (o.includes(":")) {
			let e = o.lastIndexOf(":"), t = o.substring(0, e).trim(), n = o.substring(e + 1).trim();
			[
				"first",
				"last",
				"odd",
				"even"
			].includes(n) || /^nth\(\d+\)$/.test(n) ? (s = t, c = n) : s = o;
		} else s = o;
		if (!s) throw Error(`Invalid segment pattern: ${e}`);
		if (t.tag = s, a && (t.namespace = a), n) {
			if (n.includes("=")) {
				let e = n.indexOf("=");
				t.attrName = n.substring(0, e).trim(), t.attrValue = n.substring(e + 1).trim();
			} else t.attrName = n.trim();
		}
		if (c) {
			let e = c.match(/^nth\((\d+)\)$/);
			e ? (t.position = "nth", t.positionValue = parseInt(e[1], 10)) : t.position = c;
		}
		return t;
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
}, Dc = class {
	constructor() {
		this._byDepthAndTag = /* @__PURE__ */ new Map(), this._wildcardByDepth = /* @__PURE__ */ new Map(), this._deepWildcards = [], this._deepByTerminalTag = /* @__PURE__ */ new Map(), this._patterns = /* @__PURE__ */ new Set(), this._sealed = !1;
	}
	add(e) {
		if (this._sealed) throw TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");
		if (this._patterns.has(e.pattern)) return this;
		if (this._patterns.add(e.pattern), e.hasDeepWildcard()) {
			let t = e.segments[e.segments.length - 1];
			if (t && t.type !== "deep-wildcard" && t.tag !== "*") {
				let n = t.tag;
				this._deepByTerminalTag.has(n) || this._deepByTerminalTag.set(n, []), this._deepByTerminalTag.get(n).push(e);
			} else this._deepWildcards.push(e);
			return this;
		}
		let t = e.length, n = e.segments[e.segments.length - 1]?.tag;
		if (!n || n === "*") this._wildcardByDepth.has(t) || this._wildcardByDepth.set(t, []), this._wildcardByDepth.get(t).push(e);
		else {
			let r = `${t}:${n}`;
			this._byDepthAndTag.has(r) || this._byDepthAndTag.set(r, []), this._byDepthAndTag.get(r).push(e);
		}
		return this;
	}
	addAll(e) {
		for (let t of e) this.add(t);
		return this;
	}
	has(e) {
		return this._patterns.has(e.pattern);
	}
	get size() {
		return this._patterns.size;
	}
	seal() {
		return this._sealed = !0, this;
	}
	get isSealed() {
		return this._sealed;
	}
	matchesAny(e) {
		return this.findMatch(e) !== null;
	}
	findMatch(e) {
		let t = e.getDepth(), n = e.getCurrentTag(), r = `${t}:${n}`, i = this._byDepthAndTag.get(r);
		if (i) {
			for (let t = 0; t < i.length; t++) if (e.matches(i[t])) return i[t];
		}
		let a = this._wildcardByDepth.get(t);
		if (a) {
			for (let t = 0; t < a.length; t++) if (e.matches(a[t])) return a[t];
		}
		let o = this._deepByTerminalTag.get(n);
		if (o) {
			for (let t = 0; t < o.length; t++) if (e.matches(o[t])) return o[t];
		}
		for (let t = 0; t < this._deepWildcards.length; t++) if (e.matches(this._deepWildcards[t])) return this._deepWildcards[t];
		return null;
	}
}, Oc = class {
	constructor(e) {
		this._matcher = e;
	}
	get separator() {
		return this._matcher.separator;
	}
	getCurrentTag() {
		let e = this._matcher.path;
		return e.length > 0 ? e[e.length - 1].tag : void 0;
	}
	getCurrentNamespace() {
		let e = this._matcher.path;
		return e.length > 0 ? e[e.length - 1].namespace : void 0;
	}
	getAttrValue(e) {
		let t = this._matcher.path;
		if (t.length !== 0) return t[t.length - 1].values?.[e];
	}
	hasAttr(e) {
		let t = this._matcher.path;
		if (t.length === 0) return !1;
		let n = t[t.length - 1];
		return n.values !== void 0 && e in n.values;
	}
	getAnyParentAttr(e) {
		return this._matcher.getAnyParentAttr(e);
	}
	hasAnyParentAttr(e) {
		return this._matcher.hasAnyParentAttr(e);
	}
	getPosition() {
		let e = this._matcher.path;
		return e.length === 0 ? -1 : e[e.length - 1].position ?? 0;
	}
	getCounter() {
		let e = this._matcher.path;
		return e.length === 0 ? -1 : e[e.length - 1].counter ?? 0;
	}
	getIndex() {
		return this.getPosition();
	}
	getDepth() {
		return this._matcher.path.length;
	}
	toString(e, t = !0) {
		return this._matcher.toString(e, t);
	}
	toArray() {
		return this._matcher.path.map((e) => e.tag);
	}
	matches(e) {
		return this._matcher.matches(e);
	}
	matchesAny(e) {
		return e.matchesAny(this._matcher);
	}
}, kc = class {
	constructor(e = {}) {
		this.separator = e.separator || ".", this.path = [], this.siblingStacks = [], this._pathStringCache = null, this._view = new Oc(this), this._keptAttrs = [];
	}
	push(e, t = null, n = null, r = null) {
		this._pathStringCache = null, this.path.length > 0 && (this.path[this.path.length - 1].values = void 0);
		let i = this.path.length, a = this.siblingStacks[i];
		a || (a = {
			counts: /* @__PURE__ */ new Map(),
			total: 0
		}, this.siblingStacks[i] = a);
		let o = n ? `${n}:${e}` : e, s = a.counts.get(o) || 0, c = a.total;
		a.counts.set(o, s + 1), a.total++;
		let l = {
			tag: e,
			position: c,
			counter: s
		};
		n != null && (l.namespace = n), t != null && (l.values = t), this.path.push(l);
		let u = this.path.length, d = r === null ? null : r.keep;
		if (d != null && d.length > 0 && t) for (let e = 0; e < d.length; e++) {
			let n = d[e];
			t[n] !== void 0 && this._keptAttrs.push({
				depth: u,
				name: n,
				value: t[n]
			});
		}
	}
	pop() {
		if (this.path.length === 0) return;
		this._pathStringCache = null;
		let e = this.path.pop();
		this.siblingStacks.length > this.path.length + 1 && (this.siblingStacks.length = this.path.length + 1);
		let t = this.path.length + 1;
		for (; this._keptAttrs.length > 0 && this._keptAttrs[this._keptAttrs.length - 1].depth >= t;) this._keptAttrs.pop();
		return e;
	}
	updateCurrent(e) {
		if (this.path.length > 0) {
			let t = this.path[this.path.length - 1];
			e != null && (t.values = e);
		}
	}
	getCurrentTag() {
		return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
	}
	getCurrentNamespace() {
		return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
	}
	getAttrValue(e) {
		if (this.path.length !== 0) return this.path[this.path.length - 1].values?.[e];
	}
	hasAttr(e) {
		if (this.path.length === 0) return !1;
		let t = this.path[this.path.length - 1];
		return t.values !== void 0 && e in t.values;
	}
	getAnyParentAttr(e) {
		let t = this._keptAttrs;
		for (let n = t.length - 1; n >= 0; n--) if (t[n].name === e) return t[n].value;
	}
	hasAnyParentAttr(e) {
		let t = this._keptAttrs;
		for (let n = t.length - 1; n >= 0; n--) if (t[n].name === e) return !0;
		return !1;
	}
	getPosition() {
		return this.path.length === 0 ? -1 : this.path[this.path.length - 1].position ?? 0;
	}
	getCounter() {
		return this.path.length === 0 ? -1 : this.path[this.path.length - 1].counter ?? 0;
	}
	getIndex() {
		return this.getPosition();
	}
	getDepth() {
		return this.path.length;
	}
	toString(e, t = !0) {
		let n = e || this.separator;
		if (n === this.separator && t === !0) {
			if (this._pathStringCache !== null) return this._pathStringCache;
			let e = this.path.map((e) => e.namespace ? `${e.namespace}:${e.tag}` : e.tag).join(n);
			return this._pathStringCache = e, e;
		}
		return this.path.map((e) => t && e.namespace ? `${e.namespace}:${e.tag}` : e.tag).join(n);
	}
	toArray() {
		return this.path.map((e) => e.tag);
	}
	reset() {
		this._pathStringCache = null, this.path = [], this.siblingStacks = [], this._keptAttrs = [];
	}
	matches(e) {
		let t = e.segments;
		return t.length === 0 ? !1 : e.hasDeepWildcard() ? this._matchWithDeepWildcard(t) : this._matchSimple(t);
	}
	_matchSimple(e) {
		if (this.path.length !== e.length) return !1;
		for (let t = 0; t < e.length; t++) if (!this._matchSegment(e[t], this.path[t], t === this.path.length - 1)) return !1;
		return !0;
	}
	_matchWithDeepWildcard(e) {
		let t = this.path.length - 1, n = e.length - 1;
		for (; n >= 0 && t >= 0;) {
			let r = e[n];
			if (r.type === "deep-wildcard") {
				if (n--, n < 0) return !0;
				let r = e[n], i = !1;
				for (let e = t; e >= 0; e--) if (this._matchSegment(r, this.path[e], e === this.path.length - 1)) {
					t = e - 1, n--, i = !0;
					break;
				}
				if (!i) return !1;
			} else {
				if (!this._matchSegment(r, this.path[t], t === this.path.length - 1)) return !1;
				t--, n--;
			}
		}
		return n < 0;
	}
	_matchSegment(e, t, n) {
		if (e.tag !== "*" && e.tag !== t.tag || e.namespace !== void 0 && e.namespace !== "*" && e.namespace !== t.namespace || e.attrName !== void 0 && (!n || !t.values || !(e.attrName in t.values) || e.attrValue !== void 0 && String(t.values[e.attrName]) !== String(e.attrValue))) return !1;
		if (e.position !== void 0) {
			if (!n) return !1;
			let r = t.counter ?? 0;
			if (e.position === "first" && r !== 0 || e.position === "odd" && r % 2 != 1 || e.position === "even" && r % 2 != 0 || e.position === "nth" && r !== e.positionValue) return !1;
		}
		return !0;
	}
	matchesAny(e) {
		return e.matchesAny(this);
	}
	snapshot() {
		return {
			path: this.path.map((e) => ({ ...e })),
			siblingStacks: this.siblingStacks.map((e) => e && {
				counts: new Map(e.counts),
				total: e.total
			}),
			keptAttrs: this._keptAttrs.map((e) => ({ ...e }))
		};
	}
	restore(e) {
		this._pathStringCache = null, this.path = e.path.map((e) => ({ ...e })), this.siblingStacks = e.siblingStacks.map((e) => e && {
			counts: new Map(e.counts),
			total: e.total
		}), this._keptAttrs = (e.keptAttrs || []).map((e) => ({ ...e }));
	}
	readOnly() {
		return this._view;
	}
}, Ac = [
	{
		id: "html-script-open",
		description: "<script opening tag",
		pattern: /<script[\s>/]/i
	},
	{
		id: "html-script-close",
		description: "<\/script closing tag",
		pattern: /<\/script[\s>]/i
	},
	{
		id: "html-javascript-protocol",
		description: "javascript: URI scheme (with optional whitespace/encoding)",
		pattern: /j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i
	},
	{
		id: "html-vbscript-protocol",
		description: "vbscript: URI scheme",
		pattern: /vbscript[\t\n\r ]*:/i
	},
	{
		id: "html-data-html",
		description: "data:text/html URI — can execute scripts in browsers",
		pattern: /data[\t\n\r ]*:[\t\n\r ]*text\/html/i
	},
	{
		id: "html-data-xhtml",
		description: "data:application/xhtml+xml URI",
		pattern: /data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i
	},
	{
		id: "html-data-svg",
		description: "data:image/svg+xml URI — can execute scripts",
		pattern: /data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i
	},
	{
		id: "html-inline-event-handler",
		description: "Inline event handler attributes: onclick=, onerror=, onload=, etc.",
		pattern: /\bon\w{1,30}\s*=/i
	},
	{
		id: "html-entity-obfuscated-script",
		description: "HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)",
		pattern: /(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i
	},
	{
		id: "html-entity-obfuscated-javascript",
		description: "HTML-entity-encoded javascript: (partial — catches common &#106; or &#x6a; for \"j\")",
		pattern: /(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i
	},
	{
		id: "html-style-expression",
		description: "CSS expression() — IE-era code execution in style attributes",
		pattern: /style[\s\S]{0,20}expression\s*\(/i
	},
	{
		id: "html-object-embed",
		description: "<object or <embed tags that can load active content",
		pattern: /<(?:object|embed)[\s>/]/i
	},
	{
		id: "html-base-tag",
		description: "<base href= — can hijack all relative URLs on a page",
		pattern: /<base[\s>]/i
	},
	{
		id: "html-meta-refresh",
		description: "<meta http-equiv=\"refresh\" — can redirect users",
		pattern: /<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i
	},
	{
		id: "html-srcdoc",
		description: "srcdoc= attribute on iframes — embeds HTML that can run scripts",
		pattern: /srcdoc\s*=/i
	},
	{
		id: "html-iframe",
		description: "<iframe tag",
		pattern: /<iframe[\s>/]/i
	},
	{
		id: "html-form",
		description: "<form tag — can be used for phishing / credential harvesting injection",
		pattern: /<form[\s>/]/i
	}
], jc = [
	{
		id: "xml-cdata-injection",
		description: "CDATA section injection: <![CDATA[ breaks out of text node context",
		pattern: /<!\[CDATA\[/i
	},
	{
		id: "xml-cdata-close",
		description: "CDATA close sequence: ]]> can terminate an enclosing CDATA section",
		pattern: /\]\]>/
	},
	{
		id: "xml-processing-instruction",
		description: "XML processing instruction: <?xml-stylesheet or <?php etc.",
		pattern: /<\?(?:xml[\- ]|php|asp)/i
	},
	{
		id: "xml-doctype-injection",
		description: "DOCTYPE declaration embedded in content — can define entities",
		pattern: /<!DOCTYPE(?:[\s[]|$)/i
	},
	{
		id: "xml-entity-system",
		description: "SYSTEM keyword — used in external entity declarations (XXE)",
		pattern: /\bSYSTEM\s+["']/i
	},
	{
		id: "xml-entity-public",
		description: "PUBLIC keyword — used in external entity declarations (XXE)",
		pattern: /\bPUBLIC\s+["']/i
	},
	{
		id: "xml-entity-declaration",
		description: "<!ENTITY declaration — defines entities, potential XXE or entity expansion",
		pattern: /<!ENTITY[\s%]/i
	},
	{
		id: "xml-billion-laughs",
		description: "Entity reference chaining / billion laughs: repeated &eX; style references",
		pattern: /(?:&\w{1,20};){3,}/
	},
	{
		id: "xml-namespace-confusion",
		description: "xmlns: attribute injection — can redefine namespaces to confuse parsers",
		pattern: /\bxmlns(?::\w{1,40})?\s*=/i
	},
	{
		id: "xml-comment-injection",
		description: "<!-- comment injection — can hide content from some parsers",
		pattern: /<!--/
	},
	{
		id: "xml-comment-close",
		description: "--> closes an enclosing XML comment",
		pattern: /-->/
	},
	{
		id: "xml-pi-close",
		description: "?> closes an enclosing processing instruction",
		pattern: /\?>/
	}
], Mc = [
	{
		id: "svg-script-element",
		description: "<script element inside SVG executes JavaScript",
		pattern: /<script[\s>/]/i
	},
	{
		id: "svg-xlink-href-javascript",
		description: "xlink:href with javascript: — classic SVG XSS via <a> or <use>",
		pattern: /xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i
	},
	{
		id: "svg-href-javascript",
		description: "href= with javascript: in SVG context (<a>, <animate>, etc.)",
		pattern: /href\s*=\s*["']?\s*javascript\s*:/i
	},
	{
		id: "svg-foreignobject",
		description: "<foreignObject embeds HTML inside SVG — can execute scripts",
		pattern: /<foreignObject[\s>/]/i
	},
	{
		id: "svg-use-external",
		description: "<use xlink:href or href pointing to external resource (non-fragment URL)",
		pattern: /<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i
	},
	{
		id: "svg-animate-href",
		description: "<animate attributeName=\"href\" — can dynamically change href to javascript:",
		pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i
	},
	{
		id: "svg-animate-xlinkhref",
		description: "<animate attributeName=\"xlink:href\"",
		pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i
	},
	{
		id: "svg-set-javascript",
		description: "<set to=\"javascript:...\" — sets an attribute to a javascript: URI",
		pattern: /<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i
	},
	{
		id: "svg-event-handler",
		description: "SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.",
		pattern: /\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i
	},
	{
		id: "svg-handler-generic",
		description: "Generic on* handler catch-all for SVG attributes",
		pattern: /\bon\w{1,30}\s*=/i
	},
	{
		id: "svg-filter-feimage",
		description: "<feImage href= — filter primitive that can load external resources",
		pattern: /<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i
	},
	{
		id: "svg-image-external",
		description: "<image xlink:href with http/https or javascript protocol",
		pattern: /<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i
	},
	{
		id: "svg-style-javascript",
		description: "style= attribute containing javascript: (e.g. background:url(javascript:...))",
		pattern: /style\s*=[\s\S]{0,60}javascript\s*:/i
	}
], Nc = [
	{
		id: "sql-block-comment-open",
		description: "SQL block comment open: /* ... */ — unusual in legitimate user text",
		pattern: /\/\*/
	},
	{
		id: "sql-union-select",
		description: "UNION SELECT — most common SQL injection aggregation attack",
		pattern: /\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i
	},
	{
		id: "sql-drop-table",
		description: "DROP TABLE — destructive DDL injection",
		pattern: /\bDROP\s{1,20}TABLE\b/i
	},
	{
		id: "sql-drop-database",
		description: "DROP DATABASE — destructive DDL injection",
		pattern: /\bDROP\s{1,20}DATABASE\b/i
	},
	{
		id: "sql-insert-into",
		description: "INSERT INTO — data injection",
		pattern: /\bINSERT\s{1,20}INTO\b/i
	},
	{
		id: "sql-delete-from",
		description: "DELETE FROM — data deletion injection",
		pattern: /\bDELETE\s{1,20}FROM\b/i
	},
	{
		id: "sql-update-set",
		description: "UPDATE ... SET — data modification injection",
		pattern: /\bUPDATE\b[\s\S]{1,60}\bSET\b/i
	},
	{
		id: "sql-exec-xp",
		description: "EXEC xp_ — MSSQL extended stored procedure execution",
		pattern: /\bEXEC(?:UTE)?\s{1,20}xp_/i
	},
	{
		id: "sql-tautology-string",
		description: "Classic string tautology: ' OR '1'='1 or \" OR \"1\"=\"1\"",
		pattern: /'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i
	},
	{
		id: "sql-tautology-numeric",
		description: "Numeric tautology: OR 1=1",
		pattern: /\bOR\s{1,10}1\s*=\s*1\b/i
	},
	{
		id: "sql-always-true-zero",
		description: "Numeric tautology: OR 0=0",
		pattern: /\bOR\s{1,10}0\s*=\s*0\b/i
	},
	{
		id: "sql-sleep-benchmark",
		description: "Time-based blind injection: SLEEP() or BENCHMARK()",
		pattern: /\b(?:SLEEP|BENCHMARK)\s*\(/i
	},
	{
		id: "sql-waitfor-delay",
		description: "MSSQL time-based blind injection: WAITFOR DELAY",
		pattern: /\bWAITFOR\s{1,20}DELAY\b/i
	},
	{
		id: "sql-char-function",
		description: "CHAR() function — used to obfuscate injected strings",
		pattern: /\bCHAR\s*\(\s*\d{1,3}/i
	},
	{
		id: "sql-information-schema",
		description: "INFORMATION_SCHEMA — reconnaissance query for table/column enumeration",
		pattern: /\bINFORMATION_SCHEMA\b/i
	}
], Pc = [
	{
		id: "shell-path-traversal-unix",
		description: "Unix path traversal: ../  — climbing the directory tree",
		pattern: /\.\.\//
	},
	{
		id: "shell-path-traversal-windows",
		description: "Windows path traversal: ..\\ — climbing the directory tree",
		pattern: /\.\.\\/
	},
	{
		id: "shell-path-traversal-encoded",
		description: "URL-encoded path traversal: %2e%2e or %2f variants",
		pattern: /%2e%2e|%2f\.\.|\.\.%2f/i
	},
	{
		id: "shell-null-byte",
		description: "Null byte injection: \\x00 or %00 — truncates strings in C-backed functions",
		pattern: /\x00|%00/
	},
	{
		id: "shell-semicolon",
		description: "Semicolon command separator: cmd1; cmd2",
		pattern: /;/
	},
	{
		id: "shell-pipe",
		description: "Pipe operator: cmd1 | cmd2",
		pattern: /\|/
	},
	{
		id: "shell-and-operator",
		description: "AND operator: cmd1 && cmd2",
		pattern: /&&/
	},
	{
		id: "shell-or-operator",
		description: "OR operator: cmd1 || cmd2",
		pattern: /\|\|/
	},
	{
		id: "shell-backtick",
		description: "Backtick command substitution: `cmd`",
		pattern: /`/
	},
	{
		id: "shell-dollar-paren",
		description: "Dollar-paren command substitution: $(cmd)",
		pattern: /\$\(/
	},
	{
		id: "shell-dollar-brace",
		description: "Dollar-brace variable expansion: ${var} — can be abused for injection",
		pattern: /\$\{/
	},
	{
		id: "shell-redirect-out",
		description: "Output redirection: cmd > file or cmd >> file",
		pattern: />{1,2}/
	},
	{
		id: "shell-redirect-in",
		description: "Input redirection: cmd < file",
		pattern: /</
	},
	{
		id: "shell-newline-injection",
		description: "Newline injection: \\n or \\r — can inject new shell commands",
		pattern: /[\n\r]/
	},
	{
		id: "shell-glob-star",
		description: "Glob expansion: * or ? — can expand to unintended files",
		pattern: /[/\\][*?]/
	},
	{
		id: "shell-absolute-root",
		description: "Absolute root path injection: string starting with / or \\ (Windows UNC)",
		pattern: /^(?:\/|\\\\)/
	},
	{
		id: "shell-windows-drive",
		description: "Windows drive letter path injection: C:\\ or D:/",
		pattern: /^[a-zA-Z]:[/\\]/
	},
	{
		id: "shell-curl-wget",
		description: "curl/wget with URL or flags — can exfiltrate data or download payloads",
		pattern: /\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i
	}
], Fc = [
	{
		id: "redos-nested-quantifier-plus",
		description: "Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.",
		pattern: /\([^)]*\+[^)]*\)[+*]/
	},
	{
		id: "redos-nested-quantifier-star",
		description: "Nested * quantifier: (a*)* or (a*)+ — catastrophic backtracking",
		pattern: /\([^)]*\*[^)]*\)[*+]/
	},
	{
		id: "redos-nested-groups",
		description: "Doubly nested quantified groups: ((a+)+) — guaranteed catastrophic",
		pattern: /\(\([^)]{0,40}\)[+*]\)[+*]/
	},
	{
		id: "redos-alternation-overlap",
		description: "Overlapping alternation under quantifier: (a|a)+ — ambiguous NFA paths",
		pattern: /\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/
	},
	{
		id: "redos-star-plus-concat",
		description: "(x*x)+ pattern — triggers super-linear backtracking",
		pattern: /\([^)]{0,10}\*[^)]{0,10}\)[+*]/
	},
	{
		id: "redos-dot-star-greedy",
		description: "(.*){n,} or (.+){n,} — repeated greedy dot quantifiers",
		pattern: /\(\.[*+]\)\{?\d/
	},
	{
		id: "redos-large-repetition",
		description: "Very large fixed or range repetition count {1000,} or {1000,n} — denial of service via backtracking",
		pattern: /\{\d{4,}(?:,\d*)?\}/
	},
	{
		id: "redos-catastrophic-alternation",
		description: "Long alternation with many similar branches — polynomial backtracking risk",
		pattern: /\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/
	}
], $ = "[\"'\\s]*:", Ic = [
	{
		id: "nosql-where-operator",
		description: "$where — executes arbitrary JavaScript server-side in MongoDB",
		pattern: RegExp(`\\$where${$}`, "i")
	},
	{
		id: "nosql-ne-operator",
		description: "$ne — \"not equal\" operator used to bypass equality checks",
		pattern: RegExp(`\\$ne${$}`, "i")
	},
	{
		id: "nosql-gt-operator",
		description: "$gt — \"greater than\" used to bypass password/value checks",
		pattern: RegExp(`\\$gte?${$}`, "i")
	},
	{
		id: "nosql-lt-operator",
		description: "$lt / $lte — \"less than\" bypass variants",
		pattern: RegExp(`\\$lte?${$}`, "i")
	},
	{
		id: "nosql-regex-operator",
		description: "$regex — can be used to extract data character by character (blind injection)",
		pattern: RegExp(`\\$regex${$}`, "i")
	},
	{
		id: "nosql-or-operator",
		description: "$or — logical OR; used to create always-true conditions",
		pattern: RegExp(`\\$or${$}\\s*\\[`, "i")
	},
	{
		id: "nosql-and-operator",
		description: "$and — logical AND operator injection",
		pattern: RegExp(`\\$and${$}\\s*\\[`, "i")
	},
	{
		id: "nosql-nor-operator",
		description: "$nor — logical NOR operator injection",
		pattern: RegExp(`\\$nor${$}\\s*\\[`, "i")
	},
	{
		id: "nosql-exists-operator",
		description: "$exists — can enumerate fields to determine schema",
		pattern: RegExp(`\\$exists${$}`, "i")
	},
	{
		id: "nosql-in-operator",
		description: "$in — matches any value in a list; can enumerate values",
		pattern: RegExp(`\\$in${$}\\s*\\[`, "i")
	},
	{
		id: "nosql-expr-operator",
		description: "$expr — allows aggregation expressions in queries (MongoDB 3.6+)",
		pattern: RegExp(`\\$expr${$}`, "i")
	},
	{
		id: "nosql-function-operator",
		description: "$function — executes arbitrary JavaScript in MongoDB 4.4+",
		pattern: RegExp(`\\$function${$}`, "i")
	},
	{
		id: "nosql-accumulator-operator",
		description: "$accumulator — custom aggregation with arbitrary JS execution",
		pattern: RegExp(`\\$accumulator${$}`, "i")
	},
	{
		id: "nosql-proto-pollution",
		description: "__proto__ — prototype pollution via object key injection",
		pattern: /__proto__/
	},
	{
		id: "nosql-constructor-prototype",
		description: "constructor.prototype — alternative prototype pollution vector (dot notation or JSON key)",
		pattern: /constructor[\s"':.,{\[]*prototype/i
	},
	{
		id: "nosql-proto-bracket",
		description: "[\"__proto__\"] — bracket-notation prototype pollution",
		pattern: /\[["']__proto__["']\]/
	}
], Lc = [
	{
		id: "log-crlf-injection",
		description: "CRLF injection: literal \\r or \\n embeds fake log lines",
		pattern: /[\r\n]/
	},
	{
		id: "log-url-encoded-crlf",
		description: "URL-encoded CRLF: %0d, %0a, %0D, %0A — decoded by some log parsers",
		pattern: /%0[dDaA]/
	},
	{
		id: "log-unicode-newline",
		description: "Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)",
		pattern: /[\u2028\u2029]/
	},
	{
		id: "log-log4shell-jndi",
		description: "Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",
		pattern: /\$\{jndi\s*:/i
	},
	{
		id: "log-log4shell-obfuscated",
		description: "Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",
		pattern: /\$\{::-/
	},
	{
		id: "log-log4j-lookup",
		description: "Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} — data exfiltration",
		pattern: /\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i
	},
	{
		id: "log-ssti-double-brace",
		description: "SSTI double-brace: {{expression}} — Jinja2, Twig, Handlebars, etc.",
		pattern: /\{\{[\s\S]{0,80}\}\}/
	},
	{
		id: "log-ssti-hash-brace",
		description: "SSTI hash-brace: #{expression} — Thymeleaf, Velocity, Ruby ERB",
		pattern: /#\{[\s\S]{0,80}\}/
	},
	{
		id: "log-ssti-dollar-brace",
		description: "SSTI/EL injection: ${expression with operators or method calls} — JSP EL, Freemarker, SpEL",
		pattern: /\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i
	},
	{
		id: "log-ssti-percent-tag",
		description: "SSTI ERB/ASP tag: <%= expression %> — Ruby ERB, ASP",
		pattern: /<%=[\s\S]{0,80}%>/
	},
	{
		id: "log-null-byte",
		description: "Null byte: \\x00 or %00 — can truncate log entries in C-backed loggers",
		pattern: /\x00|%00/
	},
	{
		id: "log-ansi-escape",
		description: "ANSI escape sequence: ESC[ — can manipulate terminal output when logs are tailed",
		pattern: /\x1b\[/
	}
], Rc = [
	{
		id: "sql-line-comment",
		description: "SQL line comment: -- followed by whitespace or end of string",
		pattern: /--(?:\s|$)/
	},
	{
		id: "sql-stacked-query",
		description: "Stacked queries: semicolon immediately followed by a SQL keyword",
		pattern: /;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i
	},
	{
		id: "sql-hex-encoding",
		description: "Hex-encoded string injection: 0x41414141 style (MySQL)",
		pattern: /\b0x[0-9a-f]{4,}/i
	}
], zc = [...Nc, ...Rc], Bc = Object.freeze({
	colon: ":",
	Tab: "	",
	NewLine: "\n"
}), Vc = /&(?:#[xX]0*([0-9a-fA-F]{1,6});?|#0*([0-9]{1,7});?|([a-zA-Z][a-zA-Z0-9]{1,15});)/g;
function Hc(e) {
	return e.indexOf("&") === -1 ? e : e.replace(Vc, (e, t, n, r) => {
		if (r !== void 0) return Object.prototype.hasOwnProperty.call(Bc, r) ? Bc[r] : e;
		let i = t === void 0 ? parseInt(n, 10) : parseInt(t, 16);
		return !Number.isFinite(i) || i > 1114111 ? e : String.fromCodePoint(i);
	});
}
Ac.label = "HTML", jc.label = "XML", Mc.label = "SVG", Ac.decodeEntities = !0, jc.decodeEntities = !0, Mc.decodeEntities = !0, Nc.label = "SQL", zc.label = "SQL-STRICT", Pc.label = "SHELL", Fc.label = "REDOS", Ic.label = "NOSQL", Lc.label = "LOG", Object.freeze({
	HTML: Ac,
	XML: jc,
	SVG: Mc,
	SQL: Nc,
	"SQL-STRICT": zc,
	SHELL: Pc,
	REDOS: Fc,
	NOSQL: Ic,
	LOG: Lc
});
function Uc(e) {
	if (typeof e != "string") throw TypeError(`is-unsafe: first argument must be a string, got ${typeof e}`);
}
function Wc(e) {
	if (!(e instanceof RegExp)) {
		if (Array.isArray(e)) {
			if (e.length === 0) throw TypeError("is-unsafe: context must not be an empty array");
			if (Array.isArray(e[0])) {
				for (let t of e) if (!Array.isArray(t) || t.length === 0) throw TypeError("is-unsafe: each context in the array must be a non-empty pattern array (PatternList)");
			}
		} else throw TypeError(`is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof e}`);
	}
}
function Gc(e) {
	return e instanceof RegExp ? {
		lists: null,
		regex: e
	} : Array.isArray(e[0]) ? {
		lists: e,
		regex: null
	} : {
		lists: [e],
		regex: null
	};
}
function Kc(e, t) {
	if (!t.decodeEntities) return null;
	let n = Hc(e);
	return n === e ? null : n;
}
function qc(e, t) {
	let n = t.label ?? "CUSTOM", r = Kc(e, t);
	for (let i of t) if (i.pattern.test(e) || r !== null && i.pattern.test(r)) return {
		context: n,
		id: i.id,
		description: i.description,
		pattern: i.pattern
	};
	return null;
}
function Jc(e, t) {
	Uc(e), Wc(t);
	let { lists: n, regex: r } = Gc(t);
	if (r) return r.test(e);
	for (let t of n) if (qc(e, t) !== null) return !0;
	return !1;
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
function Yc(e, t) {
	if (!e) return {};
	let n = t.attributesGroupName ? e[t.attributesGroupName] : e;
	if (!n) return {};
	let r = {};
	for (let e in n) if (e.startsWith(t.attributeNamePrefix)) {
		let i = e.substring(t.attributeNamePrefix.length);
		r[i] = n[e];
	} else r[e] = n[e];
	return r;
}
function Xc(e) {
	if (!e || typeof e != "string") return;
	let t = e.indexOf(":");
	if (t !== -1 && t > 0) {
		let n = e.substring(0, t);
		if (n !== "xmlns") return n;
	}
}
var Zc = class {
	constructor(e, t) {
		this.options = e, this.currentNode = null, this.tagsNodeStack = [], this.parseXml = rl, this.parseTextData = Qc, this.resolveNameSpace = $c, this.buildAttributesMap = nl, this.isItStopNode = cl, this.replaceEntitiesValue = ol, this.readStopNodeData = pl, this.saveTextToParentTag = sl, this.addChild = al, this.ignoreAttributesFn = Tc(this.options.ignoreAttributes), this.entityExpansionCount = 0, this.currentExpandedLength = 0, this.doctypefound = !1;
		let n = { ...Ts };
		this.options.entityDecoder ? this.entityDecoder = this.options.entityDecoder : (typeof this.options.htmlEntities == "object" ? n = this.options.htmlEntities : this.options.htmlEntities === !0 && (n = {
			...Es,
			...ws
		}), this.entityDecoder = new Ls({
			namedEntities: {
				...n,
				...t
			},
			numericAllowed: this.options.htmlEntities,
			limit: {
				maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
				maxExpandedLength: this.options.processEntities.maxExpandedLength,
				applyLimitsTo: this.options.processEntities.appliesTo
			},
			onInputEntity: (e, t) => Jc(t, [Ac, jc]) ? Ds.BLOCK : Ds.ALLOW
		})), this.matcher = new kc(), this.readonlyMatcher = this.matcher.readOnly(), this.isCurrentNodeStopNode = !1, this.stopNodeExpressionsSet = new Dc();
		let r = this.options.stopNodes;
		if (r && r.length > 0) {
			for (let e = 0; e < r.length; e++) {
				let t = r[e];
				typeof t == "string" ? this.stopNodeExpressionsSet.add(new Ec(t)) : t instanceof Ec && this.stopNodeExpressionsSet.add(t);
			}
			this.stopNodeExpressionsSet.seal();
		}
	}
};
function Qc(e, t, n, r, i, a, o) {
	let s = this.options;
	if (e !== void 0 && (s.trimValues && !r && (e = e.trim()), e.length > 0)) {
		o || (e = this.replaceEntitiesValue(e, t, n));
		let r = s.jPath ? n.toString() : n, c = s.tagValueProcessor(t, e, r, i, a);
		return c == null ? e : typeof c != typeof e || c !== e ? c : s.trimValues || e.trim() === e ? ml(e, s.parseTagValue, s.numberParseOptions) : e;
	}
}
function $c(e) {
	if (this.options.removeNSPrefix) {
		let t = e.split(":"), n = e.charAt(0) === "/" ? "/" : "";
		if (t[0] === "xmlns") return "";
		t.length === 2 && (e = n + t[1]);
	}
	return e;
}
var el = /([^\s=]+)\s*(=\s*(?:"([^"]*)"|'([^']*)'))?/gm;
function tl(e) {
	return e[3] === void 0 ? e[4] : e[3];
}
function nl(e, t, n, r = !1) {
	let i = this.options;
	if (r === !0 || i.ignoreAttributes !== !0 && typeof e == "string") {
		let r = is(e, el), a = r.length, o = {}, s = Array(a), c = !1, l = {};
		for (let e = 0; e < a; e++) {
			let t = this.resolveNameSpace(r[e][1]), a = tl(r[e]);
			if (t.length && a !== void 0) {
				let r = a;
				i.trimValues && (r = r.trim()), r = this.replaceEntitiesValue(r, n, this.readonlyMatcher), s[e] = r, l[t] = r, c = !0;
			}
		}
		c && typeof t == "object" && t.updateCurrent && t.updateCurrent(l);
		let u = i.jPath ? t.toString() : this.readonlyMatcher, d = !1;
		for (let e = 0; e < a; e++) {
			let t = this.resolveNameSpace(r[e][1]);
			if (this.ignoreAttributesFn(t, u)) continue;
			let n = i.attributeNamePrefix + t;
			if (t.length) {
				if (i.transformAttributeName && (n = i.transformAttributeName(n)), n = gl(n, i), tl(r[e]) !== void 0) {
					let r = s[e], a = i.attributeValueProcessor(t, r, u);
					a == null ? o[n] = r : typeof a != typeof r || a !== r ? o[n] = a : o[n] = ml(r, i.parseAttributeValue, i.numberParseOptions), d = !0;
				} else i.allowBooleanAttributes && (o[n] = !0, d = !0);
			}
		}
		if (!d) return;
		if (i.attributesGroupName && !i.preserveOrder) {
			let e = {};
			return e[i.attributesGroupName] = o, e;
		}
		return o;
	}
}
var rl = function(e) {
	let t = this.options, n = t.captureMetaData ? [] : void 0;
	e = e.replace(/\r\n?/g, t.captureMetaData ? (e, t) => (e.length === 2 && n.push(t - n.length), "\n") : "\n");
	let r = new Ws("!xml"), i = r, a = "";
	this.matcher.reset(), this.entityDecoder.reset(), this.entityExpansionCount = 0, this.currentExpandedLength = 0, this.doctypefound = !1;
	let o = new tc(t.processEntities), s = e.length;
	for (let c = 0; c < s; c++) if (e[c] === "<") {
		let l = e.charCodeAt(c + 1);
		if (l === 47) {
			let o = ul(e, ">", c, "Closing Tag is not closed."), s = e.substring(c + 2, o).trim();
			if (t.removeNSPrefix) {
				let e = s.indexOf(":");
				e !== -1 && (s = s.substr(e + 1));
			}
			s = hl(t.transformTagName, s, "", t).tagName, i && (a = this.saveTextToParentTag(a, i, this.readonlyMatcher));
			let l = this.matcher.getCurrentTag();
			if (s && t.unpairedTagsSet.has(s)) throw Error(`Unpaired tag can not be used as closing tag: </${s}>`);
			l && t.unpairedTagsSet.has(l) && (this.matcher.pop(), this.tagsNodeStack.pop()), this.matcher.pop(), this.isCurrentNodeStopNode = !1, i = this.tagsNodeStack.pop() || r, t.captureMetaData && i && i.addEndIndex(il(o + 1, n)), a = "", c = o;
		} else if (l === 63) {
			let r = fl(e, c, !1, "?>");
			if (!r) throw Error("Pi Tag is not closed.");
			a = this.saveTextToParentTag(a, i, this.readonlyMatcher);
			let s = this.buildAttributesMap(r.tagExp, this.matcher, r.tagName, !0);
			if (s) {
				let e = s[this.options.attributeNamePrefix + "version"];
				this.entityDecoder.setXmlVersion(Number(e) || 1), o.setXmlVersion(Number(e) || 1);
			}
			if (!(t.ignoreDeclaration && r.tagName === "?xml" || t.ignorePiTags)) {
				let e = new Ws(r.tagName);
				e.add(t.textNodeName, ""), r.tagName !== r.tagExp && r.attrExpPresent && t.ignoreAttributes !== !0 && (e[":@"] = s);
				let a = t.captureMetaData ? il(c, n) : c;
				this.addChild(i, e, this.readonlyMatcher, a), t.captureMetaData && i.addEndIndex(il(r.closeIndex + 2, n));
			}
			c = r.closeIndex + 1;
		} else if (l === 33 && e.charCodeAt(c + 2) === 45 && e.charCodeAt(c + 3) === 45) {
			let n = ul(e, "-->", c + 4, "Comment is not closed.");
			if (t.commentPropName) {
				let r = e.substring(c + 4, n - 2);
				a = this.saveTextToParentTag(a, i, this.readonlyMatcher), i.add(t.commentPropName, [{ [t.textNodeName]: r }]);
			}
			c = n;
		} else if (l === 33 && e.charCodeAt(c + 2) === 68) {
			if (this.doctypefound) throw Error("Multiple DOCTYPE declarations found.");
			this.doctypefound = !0;
			let t = o.readDocType(e, c);
			this.entityDecoder.addInputEntities(t.entities), c = t.i;
		} else if (l === 33 && e.charCodeAt(c + 2) === 91) {
			let n = ul(e, "]]>", c, "CDATA is not closed.") - 2, r = e.substring(c + 9, n);
			a = this.saveTextToParentTag(a, i, this.readonlyMatcher);
			let o = this.parseTextData(r, i.tagname, this.readonlyMatcher, !0, !1, !0, !0);
			o ??= "", t.cdataPropName ? i.add(t.cdataPropName, [{ [t.textNodeName]: r }]) : i.add(t.textNodeName, o), c = n + 2;
		} else {
			let o = fl(e, c, t.removeNSPrefix);
			if (!o) {
				let t = e.substring(Math.max(0, c - 50), Math.min(s, c + 50));
				throw Error(`readTagExp returned undefined at position ${c}. Context: "${t}"`);
			}
			let l = o.tagName, u = o.rawTagName, d = o.tagExp, f = o.attrExpPresent, p = o.closeIndex;
			if ({tagName: l, tagExp: d} = hl(t.transformTagName, l, d, t), t.strictReservedNames && (l === t.commentPropName || l === t.cdataPropName || l === t.textNodeName || l === t.attributesGroupName)) throw Error(`Invalid tag name: ${l}`);
			i && a && i.tagname !== "!xml" && (a = this.saveTextToParentTag(a, i, this.readonlyMatcher, !1));
			let m = i;
			m && t.unpairedTagsSet.has(m.tagname) && (i = this.tagsNodeStack.pop(), this.matcher.pop());
			let h = !1;
			d.length > 0 && d.lastIndexOf("/") === d.length - 1 && (h = !0, l[l.length - 1] === "/" ? (l = l.substr(0, l.length - 1), d = l) : d = d.substr(0, d.length - 1), f = l !== d);
			let g = null, _;
			_ = Xc(u), l !== r.tagname && this.matcher.push(l, {}, _), l !== d && f && (g = this.buildAttributesMap(d, this.matcher, l), g && Yc(g, t)), l !== r.tagname && (this.isCurrentNodeStopNode = this.isItStopNode());
			let v = t.captureMetaData ? il(c, n) : c;
			if (this.isCurrentNodeStopNode) {
				let r = "";
				if (h) c = o.closeIndex;
				else if (t.unpairedTagsSet.has(l)) c = o.closeIndex;
				else {
					let t = this.readStopNodeData(e, u, p + 1);
					if (!t) throw Error(`Unexpected end of ${u}`);
					c = t.i, r = t.tagContent;
				}
				let a = new Ws(l);
				g && (a[":@"] = g), a.add(t.textNodeName, r), this.matcher.pop(), this.isCurrentNodeStopNode = !1, this.addChild(i, a, this.readonlyMatcher, v), t.captureMetaData && i.addEndIndex(il(c + 1, n));
			} else {
				if (h) {
					({tagName: l, tagExp: d} = hl(t.transformTagName, l, d, t));
					let e = new Ws(l);
					g && (e[":@"] = g), this.addChild(i, e, this.readonlyMatcher, v), t.captureMetaData && i.addEndIndex(il(p + 1, n)), this.matcher.pop(), this.isCurrentNodeStopNode = !1;
				} else if (t.unpairedTagsSet.has(l)) {
					let e = new Ws(l);
					g && (e[":@"] = g), this.addChild(i, e, this.readonlyMatcher, v), t.captureMetaData && i.addEndIndex(il(o.closeIndex + 1, n)), this.matcher.pop(), this.isCurrentNodeStopNode = !1, c = o.closeIndex;
					continue;
				} else {
					let e = new Ws(l);
					if (this.tagsNodeStack.length > t.maxNestedTags) throw Error("Maximum nested tags exceeded");
					this.tagsNodeStack.push(i), g && (e[":@"] = g), this.addChild(i, e, this.readonlyMatcher, v), i = e;
				}
				a = "", c = p;
			}
		}
	} else a += e[c];
	return r.child;
};
function il(e, t) {
	let n = 0, r = t.length;
	for (; n < r;) {
		let i = Math.floor((n + r) / 2);
		t[i] < e ? n = i + 1 : r = i;
	}
	return e + n;
}
function al(e, t, n, r) {
	this.options.captureMetaData || (r = void 0);
	let i = this.options.jPath ? n.toString() : n, a = this.options.updateTag(t.tagname, i, t[":@"]);
	a === !1 || (typeof a == "string" && (t.tagname = a), e.addChild(t, r));
}
function ol(e, t, n) {
	let r = this.options.processEntities;
	if (!r || !r.enabled) return e;
	if (r.allowedTags) {
		let i = this.options.jPath ? n.toString() : n;
		if (!(Array.isArray(r.allowedTags) ? r.allowedTags.includes(t) : r.allowedTags(t, i))) return e;
	}
	if (r.tagFilter) {
		let i = this.options.jPath ? n.toString() : n;
		if (!r.tagFilter(t, i)) return e;
	}
	return this.entityDecoder.decode(e);
}
function sl(e, t, n, r) {
	return e &&= (r === void 0 && (r = t.child.length === 0), e = this.parseTextData(e, t.tagname, n, !1, t[":@"] ? Object.keys(t[":@"]).length !== 0 : !1, r), e !== void 0 && e !== "" && t.add(this.options.textNodeName, e), ""), e;
}
function cl() {
	return this.stopNodeExpressionsSet.size !== 0 && this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
function ll(e, t, n = ">") {
	let r = e.length, i = n.charCodeAt(0), a = n.length > 1 ? n.charCodeAt(1) : -1, o = "", s = t;
	for (let n = t; n < r; n++) {
		let t = e.charCodeAt(n);
		if (t === 34 || t === 39) {
			if (n = e.indexOf(e[n], n + 1), n === -1) return;
		} else if (t === i) {
			if (a !== -1) {
				if (e.charCodeAt(n + 1) === a) return o += e.substring(s, n), {
					data: o,
					index: n
				};
			} else return o += e.substring(s, n), {
				data: o,
				index: n
			};
		} else t === 9 && (o += e.substring(s, n) + " ", s = n + 1);
	}
}
function ul(e, t, n, r) {
	let i = e.indexOf(t, n);
	if (i === -1) throw Error(r);
	return i + t.length - 1;
}
function dl(e, t, n, r) {
	let i = e.indexOf(t, n);
	if (i === -1) throw Error(r);
	return i;
}
function fl(e, t, n, r = ">") {
	let i = ll(e, t + 1, r);
	if (!i) return;
	let a = i.data, o = i.index, s = a.search(/\s/), c = a, l = !0;
	s !== -1 && (c = a.substring(0, s), a = a.substring(s + 1).trimStart());
	let u = c;
	if (n) {
		let e = c.indexOf(":");
		e !== -1 && (c = c.substr(e + 1), l = c !== i.data.substr(e + 1));
	}
	return {
		tagName: c,
		tagExp: a,
		closeIndex: o,
		attrExpPresent: l,
		rawTagName: u
	};
}
function pl(e, t, n) {
	let r = n, i = 1, a = !1, o = -1, s = e.length;
	for (; n < s; n++) if (e[n] === "<") {
		let s = e.charCodeAt(n + 1);
		if (s === 47) {
			let a = dl(e, ">", n, `${t} is not closed`);
			if (e.substring(n + 2, a).trim() === t && (i--, i === 0)) return {
				tagContent: e.substring(r, n),
				i: a
			};
			n = a;
		} else if (s === 63) n = ul(e, "?>", n + 1, "StopNode is not closed.");
		else if (s === 33 && e.charCodeAt(n + 2) === 45 && e.charCodeAt(n + 3) === 45) n = ul(e, "-->", n + 3, "StopNode is not closed.");
		else if (s === 33 && e.charCodeAt(n + 2) === 91) n = ul(e, "]]>", n, "StopNode is not closed.") - 2;
		else {
			let r = a ? void 0 : fl(e, n, !1);
			if (r) r.tagName === t && r.tagExp[r.tagExp.length - 1] !== "/" && i++, n = r.closeIndex;
			else {
				if (a = !0, o < n && (o = e.indexOf(">", n), o === -1)) return;
				let r = e.indexOf("<", n + 1);
				if (r === -1 || r > o) {
					let r = e.substring(n + 1, o), a = r.search(/\s/);
					(a === -1 ? r : r.substring(0, a)) === t && r[r.length - 1] !== "/" && i++, n = o;
				}
			}
		}
	}
}
function ml(e, t, n) {
	if (t && typeof e == "string") {
		let t = e.trim();
		return t === "true" || t !== "false" && yc(e, n);
	}
	return os(e) ? e : "";
}
function hl(e, t, n, r) {
	if (e) {
		let r = e(t);
		n === t && (n = r), t = r;
	}
	return t = gl(t, r), {
		tagName: t,
		tagExp: n
	};
}
function gl(e, t) {
	if (cs.includes(e)) throw Error(`[SECURITY] Invalid name: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);
	return ss.includes(e) ? t.onDangerousProperty(e) : e;
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/fast-xml-parser/src/xmlparser/node2json.js
var _l = Ws.getMetaDataSymbol();
function vl(e, t) {
	if (!e || typeof e != "object") return {};
	if (!t) return e;
	let n = {};
	for (let r in e) if (r.startsWith(t)) {
		let i = r.substring(t.length);
		n[i] = e[r];
	} else n[r] = e[r];
	return n;
}
function yl(e, t, n, r) {
	return bl(e, t, n, r);
}
function bl(e, t, n, r) {
	let i, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = xl(s);
		if (c !== void 0 && c !== t.textNodeName) {
			let e = vl(s[":@"] || {}, t.attributeNamePrefix);
			n.push(c, e);
		}
		if (c === t.textNodeName) i === void 0 ? i = s[c] : i += "" + s[c];
		else if (c === void 0) continue;
		else if (s[c]) {
			let e = bl(s[c], t, n, r), i = Cl(e, t);
			if (Object.keys(e).length === 0 && t.alwaysCreateTextNode && (e[t.textNodeName] = ""), s[":@"] ? Sl(e, s[":@"], r, t) : Object.keys(e).length === 1 && e[t.textNodeName] !== void 0 && !t.alwaysCreateTextNode ? e = e[t.textNodeName] : Object.keys(e).length === 0 && (t.alwaysCreateTextNode ? e[t.textNodeName] = "" : e = ""), s[_l] !== void 0 && typeof e == "object" && e && (e[_l] = s[_l]), a[c] !== void 0 && Object.prototype.hasOwnProperty.call(a, c)) Array.isArray(a[c]) || (a[c] = [a[c]]), a[c].push(e);
			else {
				let n = t.jPath ? r.toString() : r;
				a[c] = t.isArray(c, n, i) ? [e] : e;
			}
			c !== void 0 && c !== t.textNodeName && n.pop();
		}
	}
	return typeof i == "string" ? i.length > 0 && (a[t.textNodeName] = i) : i !== void 0 && (a[t.textNodeName] = i), a;
}
function xl(e) {
	let t = Object.keys(e);
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (n !== ":@") return n;
	}
}
function Sl(e, t, n, r) {
	if (t) {
		let i = Object.keys(t), a = i.length;
		for (let o = 0; o < a; o++) {
			let a = i[o], s = a.startsWith(r.attributeNamePrefix) ? a.substring(r.attributeNamePrefix.length) : a, c = r.jPath ? n.toString() + "." + s : n;
			e[a] = r.isArray(a, c, !0, !0) ? [t[a]] : t[a];
		}
	}
}
function Cl(e, t) {
	let { textNodeName: n } = t, r = Object.keys(e).length;
	return !!(r === 0 || r === 1 && (e[n] || typeof e[n] == "boolean" || e[n] === 0));
}
// ../../../../NeTEx-Deckplan-Editor/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var wl = class {
	constructor(e) {
		this.externalEntities = {}, this.options = Hs(e);
	}
	parse(e, t) {
		if (typeof e != "string" && e.toString) e = e instanceof Uint8Array && !(typeof Buffer < "u" && Buffer.isBuffer(e)) ? new TextDecoder("utf-8", { ignoreBOM: !0 }).decode(e) : e.toString();
		else if (typeof e != "string") throw Error("XML data is accepted in String or Bytes[] form.");
		if (t) {
			t === !0 && (t = {});
			let n = us(e, t);
			if (n !== !0) throw Error(`${n.err.msg}:${n.err.line}:${n.err.col}`);
		}
		let n = new Zc(this.options, this.externalEntities), r = n.parseXml(e);
		return this.options.preserveOrder || r === void 0 ? r : yl(r, this.options, n.matcher, n.readonlyMatcher);
	}
	addEntity(e, t) {
		if (t.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
		if (e.indexOf("&") !== -1 || e.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
		if (t === "&") throw Error("An entity with value '&' is not permitted");
		this.externalEntities[e] = t;
	}
	static getMetaDataSymbol() {
		return Ws.getMetaDataSymbol();
	}
}, Tl = (e) => {
	let t = new wl({
		ignoreAttributes: !1,
		attributeNamePrefix: "attr_",
		removeNSPrefix: !0
	}).parse(e);
	if (t.DeckPlan) {
		let e = J([t.DeckPlan], ns)[0];
		if (!e) throw Error("No DeckPlan found in the provided XML");
		return [e, void 0];
	}
	let n = J(t.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan, ns)[0];
	if (!n) throw Error("No DeckPlan found in the provided XML");
	return [n, t];
}, El = (e) => {
	let t = e.decks.map((e) => e.polygon?.getBoundingBox()).filter((e) => e !== void 0);
	if (t.length === 0) return;
	let n = Math.min(...t.map((e) => e.minX)), r = Math.max(...t.map((e) => e.maxX)), i = Math.min(...t.map((e) => e.minY)), a = Math.max(...t.map((e) => e.maxY));
	return {
		minX: n,
		maxX: r,
		minY: i,
		maxY: a,
		length: r - n,
		width: a - i,
		center: {
			x: (n + r) / 2,
			y: (i + a) / 2
		}
	};
}, Dl = () => {
	let e = /* @__PURE__ */ Yt(null), t = /* @__PURE__ */ Yt(0), n = /* @__PURE__ */ Yt(0), r;
	return lr(() => {
		e.value && (r = new ResizeObserver((e) => {
			let [r] = e;
			if (!r) return;
			let { width: i, height: a } = r.contentRect;
			t.value = i, n.value = a;
		}), r.observe(e.value));
	}), fr(() => {
		r?.disconnect();
	}), {
		container: e,
		containerWidth: t,
		containerHeight: n
	};
}, Ol = (e, t, n) => {
	let r = e / 2, i = t / 2, a = Math.min(e, t) * .1;
	switch (n) {
		case "backwards": return {
			x1: r - a,
			y1: -i + a,
			x2: r - a,
			y2: i - a
		};
		case "forwards": return {
			x1: -r + a,
			y1: -i + a,
			x2: -r + a,
			y2: i - a
		};
		case "leftwards": return {
			x1: -r + a,
			y1: i - a,
			x2: r - a,
			y2: i - a
		};
		case "rightwards": return {
			x1: -r + a,
			y1: -i + a,
			x2: r - a,
			y2: -i + a
		};
		default: return;
	}
}, kl = [
	"x",
	"y",
	"width",
	"height",
	"rx"
], Al = ["font-size"], jl = /* @__PURE__ */ Jn({
	__name: "Seat",
	props: {
		width: {},
		length: {},
		label: {},
		orientation: {}
	},
	setup(e) {
		let t = e, n = Ta(() => Ol(t.width, t.length, t.orientation));
		return (t, r) => (G(), Hi(H, null, [
			Ji("rect", {
				x: -e.width / 2,
				y: -e.length / 2,
				width: e.width,
				height: e.length,
				fill: "white",
				stroke: "black",
				"stroke-width": "1",
				"vector-effect": "non-scaling-stroke",
				rx: Math.min(e.width, e.length) * .15
			}, null, 8, kl),
			Ji("text", {
				x: 0,
				y: 0,
				"font-size": Math.min(e.width, e.length) * .28,
				"text-anchor": "middle",
				"dominant-baseline": "central",
				fill: "#333",
				"pointer-events": "none"
			}, De(e.label), 9, Al),
			n.value ? (G(), Hi("line", ra({ key: 0 }, n.value, {
				stroke: "black",
				"stroke-width": "2",
				"vector-effect": "non-scaling-stroke"
			}), null, 16)) : $i("v-if", !0)
		], 64));
	}
}), Ml = {
	key: 0,
	class: "grid min-h-full w-max min-w-full place-items-center"
}, Nl = [
	"viewBox",
	"width",
	"height"
], Pl = ["transform"], Fl = ["points"], Il = ["points"], Ll = ["transform"], Rl = { key: 1 }, zl = .5, Bl = /* @__PURE__ */ Jn({
	__name: "DeckExactRenderer",
	props: {
		deck: {},
		boundingBox: {},
		scaleTo: { default: "both" },
		hiddenSpacePolygonId: {}
	},
	setup(e) {
		let t = e, { container: n, containerWidth: r, containerHeight: i } = Dl(), a = Ta(() => t.boundingBox.length + zl * 2), o = Ta(() => t.boundingBox.width + zl * 2), s = Ta(() => {
			if (a.value <= 0 || o.value <= 0) return 0;
			let e = r.value / a.value, n = i.value / o.value;
			return t.scaleTo === "width" ? e : t.scaleTo === "height" ? n : Math.min(e, n);
		}), c = Ta(() => t.deck.polygon?.points.map((e) => `${e.x},${e.y}`).join(" ") ?? ""), l = Ta(() => [
			-a.value / 2,
			-o.value / 2,
			a.value,
			o.value
		].join(" ")), u = Ta(() => {
			let { x: e, y: n } = t.boundingBox.center;
			return `translate(${-e},${-n})`;
		}), d = Ta(() => t.deck.deckspaces.filter((e) => e instanceof Qo)), f = (e) => e.passengerSpots?.filter((e) => e instanceof Go && e.Centroid !== void 0);
		return (t, r) => (G(), Hi("div", {
			ref_key: "container",
			ref: n,
			class: "h-full min-h-0 w-full min-w-0 overflow-auto"
		}, [c.value ? (G(), Hi("div", Ml, [c.value ? (G(), Hi("svg", {
			key: 0,
			viewBox: l.value,
			width: a.value * s.value,
			height: o.value * s.value,
			class: "block max-w-none",
			"aria-label": "Deck outline"
		}, [Ji("g", { transform: u.value }, [
			Ji("polygon", {
				points: c.value,
				fill: "white",
				stroke: "black",
				"stroke-width": "2",
				"vector-effect": "non-scaling-stroke"
			}, null, 8, Fl),
			(G(!0), Hi(H, null, yr(d.value, (t) => (G(), Hi("g", { key: t.attr_id }, [t.Polygon?.points.length && t.attr_id !== e.hiddenSpacePolygonId ? (G(), Hi("polygon", {
				key: 0,
				points: t.Polygon?.points.map((e) => `${e.x},${e.y}`).join(" "),
				fill: "#68a691",
				"fill-opacity": "0.15",
				stroke: "#68a691",
				"stroke-width": "1",
				"vector-effect": "non-scaling-stroke"
			}, null, 8, Il)) : $i("v-if", !0), (G(!0), Hi(H, null, yr(f(t), (e) => (G(), Hi("g", {
				key: e.attr_id,
				transform: `translate(${e.Centroid.x},${e.Centroid.y})`
			}, [K(jl, {
				width: e.Width,
				length: e.Length,
				label: e.Label,
				orientation: e.Orientation
			}, null, 8, [
				"width",
				"length",
				"label",
				"orientation"
			])], 8, Ll))), 128))]))), 128)),
			br(t.$slots, "default")
		], 8, Pl)], 8, Nl)) : $i("v-if", !0)])) : (G(), Hi("p", Rl, "No deck polygon"))], 512));
	}
}), Vl = "/*! tailwindcss v4.3.5 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:block))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-space-y-reverse:0;--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid;--tw-tracking:initial}}}@layer theme{:root,:host{--font-sans:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-gray-50:oklch(98.5% .002 247.839);--color-gray-300:oklch(87.2% .01 258.338);--color-stone-50:oklch(98.5% .001 106.423);--color-stone-100:oklch(97% .001 106.424);--color-stone-200:oklch(92.3% .003 48.717);--color-stone-300:oklch(86.9% .005 56.366);--color-stone-400:oklch(70.9% .01 56.259);--color-white:#fff;--spacing:.25rem;--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--font-weight-medium:500;--tracking-tight:-.025em;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-ott-text-primary:#2f2f2f}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.col-span-2{grid-column:span 2/span 2}.container{width:100%}@media (width>=40rem){.container{max-width:40rem}}@media (width>=48rem){.container{max-width:48rem}}@media (width>=64rem){.container{max-width:64rem}}@media (width>=80rem){.container{max-width:80rem}}@media (width>=96rem){.container{max-width:96rem}}.mt-3{margin-top:calc(var(--spacing) * 3)}.mb-1{margin-bottom:var(--spacing)}.mb-2{margin-bottom:calc(var(--spacing) * 2)}.mb-3{margin-bottom:calc(var(--spacing) * 3)}.ml-3{margin-left:calc(var(--spacing) * 3)}.block{display:block}.flex{display:flex}.grid{display:grid}.h-5{height:calc(var(--spacing) * 5)}.h-8{height:calc(var(--spacing) * 8)}.h-\\[50\\%\\]{height:50%}.h-full{height:100%}.min-h-0{min-height:0}.min-h-full{min-height:100%}.w-5{width:calc(var(--spacing) * 5)}.w-\\[50\\%\\]{width:50%}.w-auto{width:auto}.w-full{width:100%}.w-max{width:max-content}.max-w-none{max-width:none}.min-w-0{min-width:0}.min-w-full{min-width:100%}.flex-1{flex:1}.shrink-0{flex-shrink:0}.cursor-crosshair{cursor:crosshair}.cursor-move{cursor:move}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-\\[auto_minmax\\(0\\,1fr\\)\\]{grid-template-columns:auto minmax(0,1fr)}.grid-cols-\\[minmax\\(220px\\,24\\%\\)_minmax\\(0\\,1fr\\)\\]{grid-template-columns:minmax(220px,24%) minmax(0,1fr)}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.place-items-center{place-items:center}.items-center{align-items:center}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(var(--spacing) * var(--tw-space-y-reverse));margin-block-end:calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))}.justify-self-start{justify-self:flex-start}.overflow-auto{overflow:auto}.rounded{border-radius:.25rem}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-gray-300{border-color:var(--color-gray-300)}.border-stone-200{border-color:var(--color-stone-200)}.border-stone-300{border-color:var(--color-stone-300)}.bg-stone-50{background-color:var(--color-stone-50)}.bg-stone-100{background-color:var(--color-stone-100)}.bg-stone-200{background-color:var(--color-stone-200)}.bg-white{background-color:var(--color-white)}.p-2{padding:calc(var(--spacing) * 2)}.p-3{padding:calc(var(--spacing) * 3)}.p-4{padding:calc(var(--spacing) * 4)}.px-1{padding-inline:var(--spacing)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-10{padding-inline:calc(var(--spacing) * 10)}.py-1{padding-block:var(--spacing)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-3{padding-block:calc(var(--spacing) * 3)}.pt-3{padding-top:calc(var(--spacing) * 3)}.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.text-stone-400{color:var(--color-stone-400)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}@media (hover:hover){.hover\\:bg-stone-200:hover{background-color:var(--color-stone-200)}}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-40:disabled{opacity:.4}}html,body,#app,#__nuxt{background-color:var(--color-gray-50);width:100%;height:100%;color:var(--color-ott-text-primary);font-family:Poppins,sans-serif;font-style:normal;font-weight:400}p{margin-inline:auto;margin-top:calc(var(--spacing) * 2);font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height));--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}@property --tw-space-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-tracking{syntax:\"*\";inherits:false}", Hl = "deck-rendering-v3", Ul = "\n  :host { display: block; width: 100%; height: 100%; container-type: size; }\n  .frame { width: 100%; height: 100%; }\n  .frame.vertical {\n    width: 100cqh; height: 100cqw;\n    transform-origin: top left; transform: translateX(100cqw) rotate(90deg);\n  }", Wl = (e) => {
	let t = e.deckspaces.filter((e) => e instanceof Qo).flatMap((e) => e.passengerSpots ?? []).filter((e) => e instanceof Go);
	return {
		placed: t.filter((e) => e.Centroid).length,
		total: t.length
	};
}, Gl = /* @__PURE__ */ Jn({
	props: {
		deck: Object,
		vertical: Boolean
	},
	styles: [Vl, Ul],
	setup(e) {
		return () => {
			let t = e.deck?.polygon?.getBoundingBox();
			return Ea("div", { class: ["frame", { vertical: e.vertical }] }, t ? Ea(Bl, {
				deck: e.deck,
				boundingBox: t
			}) : "No deck polygon");
		};
	}
});
customElements.get("deck-rendering-v3") || customElements.define(Hl, /* @__PURE__ */ ho(Gl));
export { Hl as TAG, Wl as countSeats, El as getDecksBoundingBox, Tl as loadNeTEx };
