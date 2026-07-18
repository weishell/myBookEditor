(function () {
  const u = document.createElement('link').relList;
  if (u && u.supports && u.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) l(o);
  new MutationObserver((o) => {
    for (const c of o)
      if (c.type === 'childList')
        for (const d of c.addedNodes) d.tagName === 'LINK' && d.rel === 'modulepreload' && l(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(o) {
    const c = {};
    return (
      o.integrity && (c.integrity = o.integrity),
      o.referrerPolicy && (c.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === 'use-credentials'
        ? (c.credentials = 'include')
        : o.crossOrigin === 'anonymous'
          ? (c.credentials = 'omit')
          : (c.credentials = 'same-origin'),
      c
    );
  }
  function l(o) {
    if (o.ep) return;
    o.ep = !0;
    const c = r(o);
    fetch(o.href, c);
  }
})();
var _i =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof self < 'u'
          ? self
          : {};
function Cl(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, 'default') ? n.default : n;
}
var Tf = { exports: {} },
  ul = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var _D;
function hC() {
  if (_D) return ul;
  _D = 1;
  var n = Symbol.for('react.transitional.element'),
    u = Symbol.for('react.fragment');
  function r(l, o, c) {
    var d = null;
    if ((c !== void 0 && (d = '' + c), o.key !== void 0 && (d = '' + o.key), 'key' in o)) {
      c = {};
      for (var h in o) h !== 'key' && (c[h] = o[h]);
    } else c = o;
    return ((o = c.ref), { $$typeof: n, type: l, key: d, ref: o !== void 0 ? o : null, props: c });
  }
  return ((ul.Fragment = u), (ul.jsx = r), (ul.jsxs = r), ul);
}
var GD;
function DC() {
  return (GD || ((GD = 1), (Tf.exports = hC())), Tf.exports);
}
var U = DC(),
  Rf = { exports: {} },
  we = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var YD;
function vC() {
  if (YD) return we;
  YD = 1;
  var n = Symbol.for('react.transitional.element'),
    u = Symbol.for('react.portal'),
    r = Symbol.for('react.fragment'),
    l = Symbol.for('react.strict_mode'),
    o = Symbol.for('react.profiler'),
    c = Symbol.for('react.consumer'),
    d = Symbol.for('react.context'),
    h = Symbol.for('react.forward_ref'),
    v = Symbol.for('react.suspense'),
    D = Symbol.for('react.memo'),
    p = Symbol.for('react.lazy'),
    C = Symbol.for('react.activity'),
    A = Symbol.iterator;
  function B(x) {
    return x === null || typeof x != 'object'
      ? null
      : ((x = (A && x[A]) || x['@@iterator']), typeof x == 'function' ? x : null);
  }
  var S = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    w = Object.assign,
    N = {};
  function b(x, Y, Z) {
    ((this.props = x), (this.context = Y), (this.refs = N), (this.updater = Z || S));
  }
  ((b.prototype.isReactComponent = {}),
    (b.prototype.setState = function (x, Y) {
      if (typeof x != 'object' && typeof x != 'function' && x != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, x, Y, 'setState');
    }),
    (b.prototype.forceUpdate = function (x) {
      this.updater.enqueueForceUpdate(this, x, 'forceUpdate');
    }));
  function m() {}
  m.prototype = b.prototype;
  function M(x, Y, Z) {
    ((this.props = x), (this.context = Y), (this.refs = N), (this.updater = Z || S));
  }
  var _ = (M.prototype = new m());
  ((_.constructor = M), w(_, b.prototype), (_.isPureReactComponent = !0));
  var K = Array.isArray;
  function ue() {}
  var X = { H: null, A: null, T: null, S: null },
    ie = Object.prototype.hasOwnProperty;
  function se(x, Y, Z) {
    var J = Z.ref;
    return { $$typeof: n, type: x, key: Y, ref: J !== void 0 ? J : null, props: Z };
  }
  function he(x, Y) {
    return se(x.type, Y, x.props);
  }
  function de(x) {
    return typeof x == 'object' && x !== null && x.$$typeof === n;
  }
  function W(x) {
    var Y = { '=': '=0', ':': '=2' };
    return (
      '$' +
      x.replace(/[=:]/g, function (Z) {
        return Y[Z];
      })
    );
  }
  var Q = /\/+/g;
  function ae(x, Y) {
    return typeof x == 'object' && x !== null && x.key != null ? W('' + x.key) : Y.toString(36);
  }
  function ne(x) {
    switch (x.status) {
      case 'fulfilled':
        return x.value;
      case 'rejected':
        throw x.reason;
      default:
        switch (
          (typeof x.status == 'string'
            ? x.then(ue, ue)
            : ((x.status = 'pending'),
              x.then(
                function (Y) {
                  x.status === 'pending' && ((x.status = 'fulfilled'), (x.value = Y));
                },
                function (Y) {
                  x.status === 'pending' && ((x.status = 'rejected'), (x.reason = Y));
                },
              )),
          x.status)
        ) {
          case 'fulfilled':
            return x.value;
          case 'rejected':
            throw x.reason;
        }
    }
    throw x;
  }
  function L(x, Y, Z, J, ge) {
    var Ae = typeof x;
    (Ae === 'undefined' || Ae === 'boolean') && (x = null);
    var Oe = !1;
    if (x === null) Oe = !0;
    else
      switch (Ae) {
        case 'bigint':
        case 'string':
        case 'number':
          Oe = !0;
          break;
        case 'object':
          switch (x.$$typeof) {
            case n:
            case u:
              Oe = !0;
              break;
            case p:
              return ((Oe = x._init), L(Oe(x._payload), Y, Z, J, ge));
          }
      }
    if (Oe)
      return (
        (ge = ge(x)),
        (Oe = J === '' ? '.' + ae(x, 0) : J),
        K(ge)
          ? ((Z = ''),
            Oe != null && (Z = Oe.replace(Q, '$&/') + '/'),
            L(ge, Y, Z, '', function (z) {
              return z;
            }))
          : ge != null &&
            (de(ge) &&
              (ge = he(
                ge,
                Z +
                  (ge.key == null || (x && x.key === ge.key)
                    ? ''
                    : ('' + ge.key).replace(Q, '$&/') + '/') +
                  Oe,
              )),
            Y.push(ge)),
        1
      );
    Oe = 0;
    var Xe = J === '' ? '.' : J + ':';
    if (K(x))
      for (var Ne = 0; Ne < x.length; Ne++)
        ((J = x[Ne]), (Ae = Xe + ae(J, Ne)), (Oe += L(J, Y, Z, Ae, ge)));
    else if (((Ne = B(x)), typeof Ne == 'function'))
      for (x = Ne.call(x), Ne = 0; !(J = x.next()).done;)
        ((J = J.value), (Ae = Xe + ae(J, Ne++)), (Oe += L(J, Y, Z, Ae, ge)));
    else if (Ae === 'object') {
      if (typeof x.then == 'function') return L(ne(x), Y, Z, J, ge);
      throw (
        (Y = String(x)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (Y === '[object Object]' ? 'object with keys {' + Object.keys(x).join(', ') + '}' : Y) +
            '). If you meant to render a collection of children, use an array instead.',
        )
      );
    }
    return Oe;
  }
  function V(x, Y, Z) {
    if (x == null) return x;
    var J = [],
      ge = 0;
    return (
      L(x, J, '', '', function (Ae) {
        return Y.call(Z, Ae, ge++);
      }),
      J
    );
  }
  function De(x) {
    if (x._status === -1) {
      var Y = x._result;
      ((Y = Y()),
        Y.then(
          function (Z) {
            (x._status === 0 || x._status === -1) && ((x._status = 1), (x._result = Z));
          },
          function (Z) {
            (x._status === 0 || x._status === -1) && ((x._status = 2), (x._result = Z));
          },
        ),
        x._status === -1 && ((x._status = 0), (x._result = Y)));
    }
    if (x._status === 1) return x._result.default;
    throw x._result;
  }
  var ve =
      typeof reportError == 'function'
        ? reportError
        : function (x) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var Y = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof x == 'object' && x !== null && typeof x.message == 'string'
                    ? String(x.message)
                    : String(x),
                error: x,
              });
              if (!window.dispatchEvent(Y)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', x);
              return;
            }
            console.error(x);
          },
    pe = {
      map: V,
      forEach: function (x, Y, Z) {
        V(
          x,
          function () {
            Y.apply(this, arguments);
          },
          Z,
        );
      },
      count: function (x) {
        var Y = 0;
        return (
          V(x, function () {
            Y++;
          }),
          Y
        );
      },
      toArray: function (x) {
        return (
          V(x, function (Y) {
            return Y;
          }) || []
        );
      },
      only: function (x) {
        if (!de(x))
          throw Error('React.Children.only expected to receive a single React element child.');
        return x;
      },
    };
  return (
    (we.Activity = C),
    (we.Children = pe),
    (we.Component = b),
    (we.Fragment = r),
    (we.Profiler = o),
    (we.PureComponent = M),
    (we.StrictMode = l),
    (we.Suspense = v),
    (we.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = X),
    (we.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (x) {
        return X.H.useMemoCache(x);
      },
    }),
    (we.cache = function (x) {
      return function () {
        return x.apply(null, arguments);
      };
    }),
    (we.cacheSignal = function () {
      return null;
    }),
    (we.cloneElement = function (x, Y, Z) {
      if (x == null) throw Error('The argument must be a React element, but you passed ' + x + '.');
      var J = w({}, x.props),
        ge = x.key;
      if (Y != null)
        for (Ae in (Y.key !== void 0 && (ge = '' + Y.key), Y))
          !ie.call(Y, Ae) ||
            Ae === 'key' ||
            Ae === '__self' ||
            Ae === '__source' ||
            (Ae === 'ref' && Y.ref === void 0) ||
            (J[Ae] = Y[Ae]);
      var Ae = arguments.length - 2;
      if (Ae === 1) J.children = Z;
      else if (1 < Ae) {
        for (var Oe = Array(Ae), Xe = 0; Xe < Ae; Xe++) Oe[Xe] = arguments[Xe + 2];
        J.children = Oe;
      }
      return se(x.type, ge, J);
    }),
    (we.createContext = function (x) {
      return (
        (x = {
          $$typeof: d,
          _currentValue: x,
          _currentValue2: x,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (x.Provider = x),
        (x.Consumer = { $$typeof: c, _context: x }),
        x
      );
    }),
    (we.createElement = function (x, Y, Z) {
      var J,
        ge = {},
        Ae = null;
      if (Y != null)
        for (J in (Y.key !== void 0 && (Ae = '' + Y.key), Y))
          ie.call(Y, J) && J !== 'key' && J !== '__self' && J !== '__source' && (ge[J] = Y[J]);
      var Oe = arguments.length - 2;
      if (Oe === 1) ge.children = Z;
      else if (1 < Oe) {
        for (var Xe = Array(Oe), Ne = 0; Ne < Oe; Ne++) Xe[Ne] = arguments[Ne + 2];
        ge.children = Xe;
      }
      if (x && x.defaultProps)
        for (J in ((Oe = x.defaultProps), Oe)) ge[J] === void 0 && (ge[J] = Oe[J]);
      return se(x, Ae, ge);
    }),
    (we.createRef = function () {
      return { current: null };
    }),
    (we.forwardRef = function (x) {
      return { $$typeof: h, render: x };
    }),
    (we.isValidElement = de),
    (we.lazy = function (x) {
      return { $$typeof: p, _payload: { _status: -1, _result: x }, _init: De };
    }),
    (we.memo = function (x, Y) {
      return { $$typeof: D, type: x, compare: Y === void 0 ? null : Y };
    }),
    (we.startTransition = function (x) {
      var Y = X.T,
        Z = {};
      X.T = Z;
      try {
        var J = x(),
          ge = X.S;
        (ge !== null && ge(Z, J),
          typeof J == 'object' && J !== null && typeof J.then == 'function' && J.then(ue, ve));
      } catch (Ae) {
        ve(Ae);
      } finally {
        (Y !== null && Z.types !== null && (Y.types = Z.types), (X.T = Y));
      }
    }),
    (we.unstable_useCacheRefresh = function () {
      return X.H.useCacheRefresh();
    }),
    (we.use = function (x) {
      return X.H.use(x);
    }),
    (we.useActionState = function (x, Y, Z) {
      return X.H.useActionState(x, Y, Z);
    }),
    (we.useCallback = function (x, Y) {
      return X.H.useCallback(x, Y);
    }),
    (we.useContext = function (x) {
      return X.H.useContext(x);
    }),
    (we.useDebugValue = function () {}),
    (we.useDeferredValue = function (x, Y) {
      return X.H.useDeferredValue(x, Y);
    }),
    (we.useEffect = function (x, Y) {
      return X.H.useEffect(x, Y);
    }),
    (we.useEffectEvent = function (x) {
      return X.H.useEffectEvent(x);
    }),
    (we.useId = function () {
      return X.H.useId();
    }),
    (we.useImperativeHandle = function (x, Y, Z) {
      return X.H.useImperativeHandle(x, Y, Z);
    }),
    (we.useInsertionEffect = function (x, Y) {
      return X.H.useInsertionEffect(x, Y);
    }),
    (we.useLayoutEffect = function (x, Y) {
      return X.H.useLayoutEffect(x, Y);
    }),
    (we.useMemo = function (x, Y) {
      return X.H.useMemo(x, Y);
    }),
    (we.useOptimistic = function (x, Y) {
      return X.H.useOptimistic(x, Y);
    }),
    (we.useReducer = function (x, Y, Z) {
      return X.H.useReducer(x, Y, Z);
    }),
    (we.useRef = function (x) {
      return X.H.useRef(x);
    }),
    (we.useState = function (x) {
      return X.H.useState(x);
    }),
    (we.useSyncExternalStore = function (x, Y, Z) {
      return X.H.useSyncExternalStore(x, Y, Z);
    }),
    (we.useTransition = function () {
      return X.H.useTransition();
    }),
    (we.version = '19.2.7'),
    we
  );
}
var VD;
function yc() {
  return (VD || ((VD = 1), (Rf.exports = vC())), Rf.exports);
}
var F = yc();
const xe = Cl(F);
var Mf = { exports: {} },
  nl = {},
  jf = { exports: {} },
  Nf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var PD;
function gC() {
  return (
    PD ||
      ((PD = 1),
      (function (n) {
        function u(L, V) {
          var De = L.length;
          L.push(V);
          e: for (; 0 < De;) {
            var ve = (De - 1) >>> 1,
              pe = L[ve];
            if (0 < o(pe, V)) ((L[ve] = V), (L[De] = pe), (De = ve));
            else break e;
          }
        }
        function r(L) {
          return L.length === 0 ? null : L[0];
        }
        function l(L) {
          if (L.length === 0) return null;
          var V = L[0],
            De = L.pop();
          if (De !== V) {
            L[0] = De;
            e: for (var ve = 0, pe = L.length, x = pe >>> 1; ve < x;) {
              var Y = 2 * (ve + 1) - 1,
                Z = L[Y],
                J = Y + 1,
                ge = L[J];
              if (0 > o(Z, De))
                J < pe && 0 > o(ge, Z)
                  ? ((L[ve] = ge), (L[J] = De), (ve = J))
                  : ((L[ve] = Z), (L[Y] = De), (ve = Y));
              else if (J < pe && 0 > o(ge, De)) ((L[ve] = ge), (L[J] = De), (ve = J));
              else break e;
            }
          }
          return V;
        }
        function o(L, V) {
          var De = L.sortIndex - V.sortIndex;
          return De !== 0 ? De : L.id - V.id;
        }
        if (
          ((n.unstable_now = void 0),
          typeof performance == 'object' && typeof performance.now == 'function')
        ) {
          var c = performance;
          n.unstable_now = function () {
            return c.now();
          };
        } else {
          var d = Date,
            h = d.now();
          n.unstable_now = function () {
            return d.now() - h;
          };
        }
        var v = [],
          D = [],
          p = 1,
          C = null,
          A = 3,
          B = !1,
          S = !1,
          w = !1,
          N = !1,
          b = typeof setTimeout == 'function' ? setTimeout : null,
          m = typeof clearTimeout == 'function' ? clearTimeout : null,
          M = typeof setImmediate < 'u' ? setImmediate : null;
        function _(L) {
          for (var V = r(D); V !== null;) {
            if (V.callback === null) l(D);
            else if (V.startTime <= L) (l(D), (V.sortIndex = V.expirationTime), u(v, V));
            else break;
            V = r(D);
          }
        }
        function K(L) {
          if (((w = !1), _(L), !S))
            if (r(v) !== null) ((S = !0), ue || ((ue = !0), W()));
            else {
              var V = r(D);
              V !== null && ne(K, V.startTime - L);
            }
        }
        var ue = !1,
          X = -1,
          ie = 5,
          se = -1;
        function he() {
          return N ? !0 : !(n.unstable_now() - se < ie);
        }
        function de() {
          if (((N = !1), ue)) {
            var L = n.unstable_now();
            se = L;
            var V = !0;
            try {
              e: {
                ((S = !1), w && ((w = !1), m(X), (X = -1)), (B = !0));
                var De = A;
                try {
                  t: {
                    for (_(L), C = r(v); C !== null && !(C.expirationTime > L && he());) {
                      var ve = C.callback;
                      if (typeof ve == 'function') {
                        ((C.callback = null), (A = C.priorityLevel));
                        var pe = ve(C.expirationTime <= L);
                        if (((L = n.unstable_now()), typeof pe == 'function')) {
                          ((C.callback = pe), _(L), (V = !0));
                          break t;
                        }
                        (C === r(v) && l(v), _(L));
                      } else l(v);
                      C = r(v);
                    }
                    if (C !== null) V = !0;
                    else {
                      var x = r(D);
                      (x !== null && ne(K, x.startTime - L), (V = !1));
                    }
                  }
                  break e;
                } finally {
                  ((C = null), (A = De), (B = !1));
                }
                V = void 0;
              }
            } finally {
              V ? W() : (ue = !1);
            }
          }
        }
        var W;
        if (typeof M == 'function')
          W = function () {
            M(de);
          };
        else if (typeof MessageChannel < 'u') {
          var Q = new MessageChannel(),
            ae = Q.port2;
          ((Q.port1.onmessage = de),
            (W = function () {
              ae.postMessage(null);
            }));
        } else
          W = function () {
            b(de, 0);
          };
        function ne(L, V) {
          X = b(function () {
            L(n.unstable_now());
          }, V);
        }
        ((n.unstable_IdlePriority = 5),
          (n.unstable_ImmediatePriority = 1),
          (n.unstable_LowPriority = 4),
          (n.unstable_NormalPriority = 3),
          (n.unstable_Profiling = null),
          (n.unstable_UserBlockingPriority = 2),
          (n.unstable_cancelCallback = function (L) {
            L.callback = null;
          }),
          (n.unstable_forceFrameRate = function (L) {
            0 > L || 125 < L
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (ie = 0 < L ? Math.floor(1e3 / L) : 5);
          }),
          (n.unstable_getCurrentPriorityLevel = function () {
            return A;
          }),
          (n.unstable_next = function (L) {
            switch (A) {
              case 1:
              case 2:
              case 3:
                var V = 3;
                break;
              default:
                V = A;
            }
            var De = A;
            A = V;
            try {
              return L();
            } finally {
              A = De;
            }
          }),
          (n.unstable_requestPaint = function () {
            N = !0;
          }),
          (n.unstable_runWithPriority = function (L, V) {
            switch (L) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                L = 3;
            }
            var De = A;
            A = L;
            try {
              return V();
            } finally {
              A = De;
            }
          }),
          (n.unstable_scheduleCallback = function (L, V, De) {
            var ve = n.unstable_now();
            switch (
              (typeof De == 'object' && De !== null
                ? ((De = De.delay), (De = typeof De == 'number' && 0 < De ? ve + De : ve))
                : (De = ve),
              L)
            ) {
              case 1:
                var pe = -1;
                break;
              case 2:
                pe = 250;
                break;
              case 5:
                pe = 1073741823;
                break;
              case 4:
                pe = 1e4;
                break;
              default:
                pe = 5e3;
            }
            return (
              (pe = De + pe),
              (L = {
                id: p++,
                callback: V,
                priorityLevel: L,
                startTime: De,
                expirationTime: pe,
                sortIndex: -1,
              }),
              De > ve
                ? ((L.sortIndex = De),
                  u(D, L),
                  r(v) === null && L === r(D) && (w ? (m(X), (X = -1)) : (w = !0), ne(K, De - ve)))
                : ((L.sortIndex = pe), u(v, L), S || B || ((S = !0), ue || ((ue = !0), W()))),
              L
            );
          }),
          (n.unstable_shouldYield = he),
          (n.unstable_wrapCallback = function (L) {
            var V = A;
            return function () {
              var De = A;
              A = V;
              try {
                return L.apply(this, arguments);
              } finally {
                A = De;
              }
            };
          }));
      })(Nf)),
    Nf
  );
}
var KD;
function mC() {
  return (KD || ((KD = 1), (jf.exports = gC())), jf.exports);
}
var zf = { exports: {} },
  Lt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var XD;
function pC() {
  if (XD) return Lt;
  XD = 1;
  var n = yc();
  function u(v) {
    var D = 'https://react.dev/errors/' + v;
    if (1 < arguments.length) {
      D += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var p = 2; p < arguments.length; p++) D += '&args[]=' + encodeURIComponent(arguments[p]);
    }
    return (
      'Minified React error #' +
      v +
      '; visit ' +
      D +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function r() {}
  var l = {
      d: {
        f: r,
        r: function () {
          throw Error(u(522));
        },
        D: r,
        C: r,
        L: r,
        m: r,
        X: r,
        S: r,
        M: r,
      },
      p: 0,
      findDOMNode: null,
    },
    o = Symbol.for('react.portal');
  function c(v, D, p) {
    var C = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: o,
      key: C == null ? null : '' + C,
      children: v,
      containerInfo: D,
      implementation: p,
    };
  }
  var d = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function h(v, D) {
    if (v === 'font') return '';
    if (typeof D == 'string') return D === 'use-credentials' ? D : '';
  }
  return (
    (Lt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l),
    (Lt.createPortal = function (v, D) {
      var p = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!D || (D.nodeType !== 1 && D.nodeType !== 9 && D.nodeType !== 11)) throw Error(u(299));
      return c(v, D, null, p);
    }),
    (Lt.flushSync = function (v) {
      var D = d.T,
        p = l.p;
      try {
        if (((d.T = null), (l.p = 2), v)) return v();
      } finally {
        ((d.T = D), (l.p = p), l.d.f());
      }
    }),
    (Lt.preconnect = function (v, D) {
      typeof v == 'string' &&
        (D
          ? ((D = D.crossOrigin),
            (D = typeof D == 'string' ? (D === 'use-credentials' ? D : '') : void 0))
          : (D = null),
        l.d.C(v, D));
    }),
    (Lt.prefetchDNS = function (v) {
      typeof v == 'string' && l.d.D(v);
    }),
    (Lt.preinit = function (v, D) {
      if (typeof v == 'string' && D && typeof D.as == 'string') {
        var p = D.as,
          C = h(p, D.crossOrigin),
          A = typeof D.integrity == 'string' ? D.integrity : void 0,
          B = typeof D.fetchPriority == 'string' ? D.fetchPriority : void 0;
        p === 'style'
          ? l.d.S(v, typeof D.precedence == 'string' ? D.precedence : void 0, {
              crossOrigin: C,
              integrity: A,
              fetchPriority: B,
            })
          : p === 'script' &&
            l.d.X(v, {
              crossOrigin: C,
              integrity: A,
              fetchPriority: B,
              nonce: typeof D.nonce == 'string' ? D.nonce : void 0,
            });
      }
    }),
    (Lt.preinitModule = function (v, D) {
      if (typeof v == 'string')
        if (typeof D == 'object' && D !== null) {
          if (D.as == null || D.as === 'script') {
            var p = h(D.as, D.crossOrigin);
            l.d.M(v, {
              crossOrigin: p,
              integrity: typeof D.integrity == 'string' ? D.integrity : void 0,
              nonce: typeof D.nonce == 'string' ? D.nonce : void 0,
            });
          }
        } else D == null && l.d.M(v);
    }),
    (Lt.preload = function (v, D) {
      if (typeof v == 'string' && typeof D == 'object' && D !== null && typeof D.as == 'string') {
        var p = D.as,
          C = h(p, D.crossOrigin);
        l.d.L(v, p, {
          crossOrigin: C,
          integrity: typeof D.integrity == 'string' ? D.integrity : void 0,
          nonce: typeof D.nonce == 'string' ? D.nonce : void 0,
          type: typeof D.type == 'string' ? D.type : void 0,
          fetchPriority: typeof D.fetchPriority == 'string' ? D.fetchPriority : void 0,
          referrerPolicy: typeof D.referrerPolicy == 'string' ? D.referrerPolicy : void 0,
          imageSrcSet: typeof D.imageSrcSet == 'string' ? D.imageSrcSet : void 0,
          imageSizes: typeof D.imageSizes == 'string' ? D.imageSizes : void 0,
          media: typeof D.media == 'string' ? D.media : void 0,
        });
      }
    }),
    (Lt.preloadModule = function (v, D) {
      if (typeof v == 'string')
        if (D) {
          var p = h(D.as, D.crossOrigin);
          l.d.m(v, {
            as: typeof D.as == 'string' && D.as !== 'script' ? D.as : void 0,
            crossOrigin: p,
            integrity: typeof D.integrity == 'string' ? D.integrity : void 0,
          });
        } else l.d.m(v);
    }),
    (Lt.requestFormReset = function (v) {
      l.d.r(v);
    }),
    (Lt.unstable_batchedUpdates = function (v, D) {
      return v(D);
    }),
    (Lt.useFormState = function (v, D, p) {
      return d.H.useFormState(v, D, p);
    }),
    (Lt.useFormStatus = function () {
      return d.H.useHostTransitionStatus();
    }),
    (Lt.version = '19.2.7'),
    Lt
  );
}
var QD;
function kg() {
  if (QD) return zf.exports;
  QD = 1;
  function n() {
    if (!(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    ))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (u) {
        console.error(u);
      }
  }
  return (n(), (zf.exports = pC()), zf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ZD;
function CC() {
  if (ZD) return nl;
  ZD = 1;
  var n = mC(),
    u = yc(),
    r = kg();
  function l(e) {
    var t = 'https://react.dev/errors/' + e;
    if (1 < arguments.length) {
      t += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++) t += '&args[]=' + encodeURIComponent(arguments[a]);
    }
    return (
      'Minified React error #' +
      e +
      '; visit ' +
      t +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function o(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function c(e) {
    var t = e,
      a = e;
    if (e.alternate) for (; t.return;) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (a = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? a : null;
  }
  function d(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function h(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function v(e) {
    if (c(e) !== e) throw Error(l(188));
  }
  function D(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = c(e)), t === null)) throw Error(l(188));
      return t !== e ? null : e;
    }
    for (var a = e, i = t; ;) {
      var s = a.return;
      if (s === null) break;
      var f = s.alternate;
      if (f === null) {
        if (((i = s.return), i !== null)) {
          a = i;
          continue;
        }
        break;
      }
      if (s.child === f.child) {
        for (f = s.child; f;) {
          if (f === a) return (v(s), e);
          if (f === i) return (v(s), t);
          f = f.sibling;
        }
        throw Error(l(188));
      }
      if (a.return !== i.return) ((a = s), (i = f));
      else {
        for (var g = !1, y = s.child; y;) {
          if (y === a) {
            ((g = !0), (a = s), (i = f));
            break;
          }
          if (y === i) {
            ((g = !0), (i = s), (a = f));
            break;
          }
          y = y.sibling;
        }
        if (!g) {
          for (y = f.child; y;) {
            if (y === a) {
              ((g = !0), (a = f), (i = s));
              break;
            }
            if (y === i) {
              ((g = !0), (i = f), (a = s));
              break;
            }
            y = y.sibling;
          }
          if (!g) throw Error(l(189));
        }
      }
      if (a.alternate !== i) throw Error(l(190));
    }
    if (a.tag !== 3) throw Error(l(188));
    return a.stateNode.current === a ? e : t;
  }
  function p(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null;) {
      if (((t = p(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  var C = Object.assign,
    A = Symbol.for('react.element'),
    B = Symbol.for('react.transitional.element'),
    S = Symbol.for('react.portal'),
    w = Symbol.for('react.fragment'),
    N = Symbol.for('react.strict_mode'),
    b = Symbol.for('react.profiler'),
    m = Symbol.for('react.consumer'),
    M = Symbol.for('react.context'),
    _ = Symbol.for('react.forward_ref'),
    K = Symbol.for('react.suspense'),
    ue = Symbol.for('react.suspense_list'),
    X = Symbol.for('react.memo'),
    ie = Symbol.for('react.lazy'),
    se = Symbol.for('react.activity'),
    he = Symbol.for('react.memo_cache_sentinel'),
    de = Symbol.iterator;
  function W(e) {
    return e === null || typeof e != 'object'
      ? null
      : ((e = (de && e[de]) || e['@@iterator']), typeof e == 'function' ? e : null);
  }
  var Q = Symbol.for('react.client.reference');
  function ae(e) {
    if (e == null) return null;
    if (typeof e == 'function') return e.$$typeof === Q ? null : e.displayName || e.name || null;
    if (typeof e == 'string') return e;
    switch (e) {
      case w:
        return 'Fragment';
      case b:
        return 'Profiler';
      case N:
        return 'StrictMode';
      case K:
        return 'Suspense';
      case ue:
        return 'SuspenseList';
      case se:
        return 'Activity';
    }
    if (typeof e == 'object')
      switch (e.$$typeof) {
        case S:
          return 'Portal';
        case M:
          return e.displayName || 'Context';
        case m:
          return (e._context.displayName || 'Context') + '.Consumer';
        case _:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ''),
              (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
            e
          );
        case X:
          return ((t = e.displayName || null), t !== null ? t : ae(e.type) || 'Memo');
        case ie:
          ((t = e._payload), (e = e._init));
          try {
            return ae(e(t));
          } catch {}
      }
    return null;
  }
  var ne = Array.isArray,
    L = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    V = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    De = { pending: !1, data: null, method: null, action: null },
    ve = [],
    pe = -1;
  function x(e) {
    return { current: e };
  }
  function Y(e) {
    0 > pe || ((e.current = ve[pe]), (ve[pe] = null), pe--);
  }
  function Z(e, t) {
    (pe++, (ve[pe] = e.current), (e.current = t));
  }
  var J = x(null),
    ge = x(null),
    Ae = x(null),
    Oe = x(null);
  function Xe(e, t) {
    switch ((Z(Ae, t), Z(ge, e), Z(J, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? fD(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI))) ((t = fD(t)), (e = cD(t, e)));
        else
          switch (e) {
            case 'svg':
              e = 1;
              break;
            case 'math':
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    (Y(J), Z(J, e));
  }
  function Ne() {
    (Y(J), Y(ge), Y(Ae));
  }
  function z(e) {
    e.memoizedState !== null && Z(Oe, e);
    var t = J.current,
      a = cD(t, e.type);
    t !== a && (Z(ge, e), Z(J, a));
  }
  function oe(e) {
    (ge.current === e && (Y(J), Y(ge)), Oe.current === e && (Y(Oe), (Jr._currentValue = De)));
  }
  var re, fe;
  function Ee(e) {
    if (re === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        ((re = (t && t[1]) || ''),
          (fe =
            -1 <
            a.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < a.stack.indexOf('@')
                ? '@unknown:0:0'
                : ''));
      }
    return (
      `
` +
      re +
      e +
      fe
    );
  }
  var be = !1;
  function $e(e, t) {
    if (!e || be) return '';
    be = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var te = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(te.prototype, 'props', {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(te, []);
                } catch (P) {
                  var G = P;
                }
                Reflect.construct(e, [], te);
              } else {
                try {
                  te.call();
                } catch (P) {
                  G = P;
                }
                e.call(te.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (P) {
                G = P;
              }
              (te = e()) && typeof te.catch == 'function' && te.catch(function () {});
            }
          } catch (P) {
            if (P && G && typeof P.stack == 'string') return [P.stack, G.stack];
          }
          return [null, null];
        },
      };
      i.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var s = Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot, 'name');
      s &&
        s.configurable &&
        Object.defineProperty(i.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot',
        });
      var f = i.DetermineComponentFrameRoot(),
        g = f[0],
        y = f[1];
      if (g && y) {
        var O = g.split(`
`),
          q = y.split(`
`);
        for (s = i = 0; i < O.length && !O[i].includes('DetermineComponentFrameRoot');) i++;
        for (; s < q.length && !q[s].includes('DetermineComponentFrameRoot');) s++;
        if (i === O.length || s === q.length)
          for (i = O.length - 1, s = q.length - 1; 1 <= i && 0 <= s && O[i] !== q[s];) s--;
        for (; 1 <= i && 0 <= s; i--, s--)
          if (O[i] !== q[s]) {
            if (i !== 1 || s !== 1)
              do
                if ((i--, s--, 0 > s || O[i] !== q[s])) {
                  var $ =
                    `
` + O[i].replace(' at new ', ' at ');
                  return (
                    e.displayName &&
                      $.includes('<anonymous>') &&
                      ($ = $.replace('<anonymous>', e.displayName)),
                    $
                  );
                }
              while (1 <= i && 0 <= s);
            break;
          }
      }
    } finally {
      ((be = !1), (Error.prepareStackTrace = a));
    }
    return (a = e ? e.displayName || e.name : '') ? Ee(a) : '';
  }
  function ut(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Ee(e.type);
      case 16:
        return Ee('Lazy');
      case 13:
        return e.child !== t && t !== null ? Ee('Suspense Fallback') : Ee('Suspense');
      case 19:
        return Ee('SuspenseList');
      case 0:
      case 15:
        return $e(e.type, !1);
      case 11:
        return $e(e.type.render, !1);
      case 1:
        return $e(e.type, !0);
      case 31:
        return Ee('Activity');
      default:
        return '';
    }
  }
  function _e(e) {
    try {
      var t = '',
        a = null;
      do ((t += ut(e, a)), (a = e), (e = e.return));
      while (e);
      return t;
    } catch (i) {
      return (
        `
Error generating stack: ` +
        i.message +
        `
` +
        i.stack
      );
    }
  }
  var ze = Object.prototype.hasOwnProperty,
    We = n.unstable_scheduleCallback,
    Et = n.unstable_cancelCallback,
    Ve = n.unstable_shouldYield,
    Gt = n.unstable_requestPaint,
    ct = n.unstable_now,
    cn = n.unstable_getCurrentPriorityLevel,
    Yt = n.unstable_ImmediatePriority,
    lu = n.unstable_UserBlockingPriority,
    Vt = n.unstable_NormalPriority,
    St = n.unstable_LowPriority,
    yt = n.unstable_IdlePriority,
    sr = n.log,
    Bl = n.unstable_setDisableYieldValue,
    dn = null,
    xt = null;
  function Cu(e) {
    if ((typeof sr == 'function' && Bl(e), xt && typeof xt.setStrictMode == 'function'))
      try {
        xt.setStrictMode(dn, e);
      } catch {}
  }
  var kt = Math.clz32 ? Math.clz32 : Im,
    fr = Math.log,
    bl = Math.LN2;
  function Im(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((fr(e) / bl) | 0)) | 0);
  }
  var Fl = 256,
    Sl = 262144,
    xl = 4194304;
  function Yn(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Ol(e, t, a) {
    var i = e.pendingLanes;
    if (i === 0) return 0;
    var s = 0,
      f = e.suspendedLanes,
      g = e.pingedLanes;
    e = e.warmLanes;
    var y = i & 134217727;
    return (
      y !== 0
        ? ((i = y & ~f),
          i !== 0
            ? (s = Yn(i))
            : ((g &= y), g !== 0 ? (s = Yn(g)) : a || ((a = y & ~e), a !== 0 && (s = Yn(a)))))
        : ((y = i & ~f),
          y !== 0
            ? (s = Yn(y))
            : g !== 0
              ? (s = Yn(g))
              : a || ((a = i & ~e), a !== 0 && (s = Yn(a)))),
      s === 0
        ? 0
        : t !== 0 &&
            t !== s &&
            (t & f) === 0 &&
            ((f = s & -s), (a = t & -t), f >= a || (f === 32 && (a & 4194048) !== 0))
          ? t
          : s
    );
  }
  function cr(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function e1(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Pc() {
    var e = xl;
    return ((xl <<= 1), (xl & 62914560) === 0 && (xl = 4194304), e);
  }
  function mo(e) {
    for (var t = [], a = 0; 31 > a; a++) t.push(e);
    return t;
  }
  function dr(e, t) {
    ((e.pendingLanes |= t),
      t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function t1(e, t, a, i, s, f) {
    var g = e.pendingLanes;
    ((e.pendingLanes = a),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= a),
      (e.entangledLanes &= a),
      (e.errorRecoveryDisabledLanes &= a),
      (e.shellSuspendCounter = 0));
    var y = e.entanglements,
      O = e.expirationTimes,
      q = e.hiddenUpdates;
    for (a = g & ~a; 0 < a;) {
      var $ = 31 - kt(a),
        te = 1 << $;
      ((y[$] = 0), (O[$] = -1));
      var G = q[$];
      if (G !== null)
        for (q[$] = null, $ = 0; $ < G.length; $++) {
          var P = G[$];
          P !== null && (P.lane &= -536870913);
        }
      a &= ~te;
    }
    (i !== 0 && Kc(e, i, 0),
      f !== 0 && s === 0 && e.tag !== 0 && (e.suspendedLanes |= f & ~(g & ~t)));
  }
  function Kc(e, t, a) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var i = 31 - kt(t);
    ((e.entangledLanes |= t),
      (e.entanglements[i] = e.entanglements[i] | 1073741824 | (a & 261930)));
  }
  function Xc(e, t) {
    var a = (e.entangledLanes |= t);
    for (e = e.entanglements; a;) {
      var i = 31 - kt(a),
        s = 1 << i;
      ((s & t) | (e[i] & t) && (e[i] |= t), (a &= ~s));
    }
  }
  function Qc(e, t) {
    var a = t & -t;
    return ((a = (a & 42) !== 0 ? 1 : po(a)), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a);
  }
  function po(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Co(e) {
    return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function Zc() {
    var e = V.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : ND(e.type));
  }
  function $c(e, t) {
    var a = V.p;
    try {
      return ((V.p = e), t());
    } finally {
      V.p = a;
    }
  }
  var hn = Math.random().toString(36).slice(2),
    Ot = '__reactFiber$' + hn,
    Pt = '__reactProps$' + hn,
    va = '__reactContainer$' + hn,
    Eo = '__reactEvents$' + hn,
    u1 = '__reactListeners$' + hn,
    n1 = '__reactHandles$' + hn,
    Wc = '__reactResources$' + hn,
    hr = '__reactMarker$' + hn;
  function yo(e) {
    (delete e[Ot], delete e[Pt], delete e[Eo], delete e[u1], delete e[n1]);
  }
  function ga(e) {
    var t = e[Ot];
    if (t) return t;
    for (var a = e.parentNode; a;) {
      if ((t = a[va] || a[Ot])) {
        if (((a = t.alternate), t.child !== null || (a !== null && a.child !== null)))
          for (e = pD(e); e !== null;) {
            if ((a = e[Ot])) return a;
            e = pD(e);
          }
        return t;
      }
      ((e = a), (a = e.parentNode));
    }
    return null;
  }
  function ma(e) {
    if ((e = e[Ot] || e[va])) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
    }
    return null;
  }
  function Dr(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(l(33));
  }
  function pa(e) {
    var t = e[Wc];
    return (t || (t = e[Wc] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
  }
  function bt(e) {
    e[hr] = !0;
  }
  var Jc = new Set(),
    Ic = {};
  function Vn(e, t) {
    (Ca(e, t), Ca(e + 'Capture', t));
  }
  function Ca(e, t) {
    for (Ic[e] = t, e = 0; e < t.length; e++) Jc.add(t[e]);
  }
  var a1 = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
    ),
    ed = {},
    td = {};
  function r1(e) {
    return ze.call(td, e)
      ? !0
      : ze.call(ed, e)
        ? !1
        : a1.test(e)
          ? (td[e] = !0)
          : ((ed[e] = !0), !1);
  }
  function wl(e, t, a) {
    if (r1(t))
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case 'undefined':
          case 'function':
          case 'symbol':
            e.removeAttribute(t);
            return;
          case 'boolean':
            var i = t.toLowerCase().slice(0, 5);
            if (i !== 'data-' && i !== 'aria-') {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, '' + a);
      }
  }
  function Tl(e, t, a) {
    if (a === null) e.removeAttribute(t);
    else {
      switch (typeof a) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, '' + a);
    }
  }
  function Lu(e, t, a, i) {
    if (i === null) e.removeAttribute(a);
    else {
      switch (typeof i) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          e.removeAttribute(a);
          return;
      }
      e.setAttributeNS(t, a, '' + i);
    }
  }
  function iu(e) {
    switch (typeof e) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return e;
      case 'object':
        return e;
      default:
        return '';
    }
  }
  function ud(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
  }
  function l1(e, t, a) {
    var i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (
      !e.hasOwnProperty(t) &&
      typeof i < 'u' &&
      typeof i.get == 'function' &&
      typeof i.set == 'function'
    ) {
      var s = i.get,
        f = i.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return s.call(this);
          },
          set: function (g) {
            ((a = '' + g), f.call(this, g));
          },
        }),
        Object.defineProperty(e, t, { enumerable: i.enumerable }),
        {
          getValue: function () {
            return a;
          },
          setValue: function (g) {
            a = '' + g;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Ao(e) {
    if (!e._valueTracker) {
      var t = ud(e) ? 'checked' : 'value';
      e._valueTracker = l1(e, t, '' + e[t]);
    }
  }
  function nd(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var a = t.getValue(),
      i = '';
    return (
      e && (i = ud(e) ? (e.checked ? 'true' : 'false') : e.value),
      (e = i),
      e !== a ? (t.setValue(e), !0) : !1
    );
  }
  function Rl(e) {
    if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var i1 = /[\n"\\]/g;
  function ou(e) {
    return e.replace(i1, function (t) {
      return '\\' + t.charCodeAt(0).toString(16) + ' ';
    });
  }
  function Bo(e, t, a, i, s, f, g, y) {
    ((e.name = ''),
      g != null && typeof g != 'function' && typeof g != 'symbol' && typeof g != 'boolean'
        ? (e.type = g)
        : e.removeAttribute('type'),
      t != null
        ? g === 'number'
          ? ((t === 0 && e.value === '') || e.value != t) && (e.value = '' + iu(t))
          : e.value !== '' + iu(t) && (e.value = '' + iu(t))
        : (g !== 'submit' && g !== 'reset') || e.removeAttribute('value'),
      t != null
        ? bo(e, g, iu(t))
        : a != null
          ? bo(e, g, iu(a))
          : i != null && e.removeAttribute('value'),
      s == null && f != null && (e.defaultChecked = !!f),
      s != null && (e.checked = s && typeof s != 'function' && typeof s != 'symbol'),
      y != null && typeof y != 'function' && typeof y != 'symbol' && typeof y != 'boolean'
        ? (e.name = '' + iu(y))
        : e.removeAttribute('name'));
  }
  function ad(e, t, a, i, s, f, g, y) {
    if (
      (f != null &&
        typeof f != 'function' &&
        typeof f != 'symbol' &&
        typeof f != 'boolean' &&
        (e.type = f),
      t != null || a != null)
    ) {
      if (!((f !== 'submit' && f !== 'reset') || t != null)) {
        Ao(e);
        return;
      }
      ((a = a != null ? '' + iu(a) : ''),
        (t = t != null ? '' + iu(t) : a),
        y || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((i = i ?? s),
      (i = typeof i != 'function' && typeof i != 'symbol' && !!i),
      (e.checked = y ? e.checked : !!i),
      (e.defaultChecked = !!i),
      g != null &&
        typeof g != 'function' &&
        typeof g != 'symbol' &&
        typeof g != 'boolean' &&
        (e.name = g),
      Ao(e));
  }
  function bo(e, t, a) {
    (t === 'number' && Rl(e.ownerDocument) === e) ||
      e.defaultValue === '' + a ||
      (e.defaultValue = '' + a);
  }
  function Ea(e, t, a, i) {
    if (((e = e.options), t)) {
      t = {};
      for (var s = 0; s < a.length; s++) t['$' + a[s]] = !0;
      for (a = 0; a < e.length; a++)
        ((s = t.hasOwnProperty('$' + e[a].value)),
          e[a].selected !== s && (e[a].selected = s),
          s && i && (e[a].defaultSelected = !0));
    } else {
      for (a = '' + iu(a), t = null, s = 0; s < e.length; s++) {
        if (e[s].value === a) {
          ((e[s].selected = !0), i && (e[s].defaultSelected = !0));
          return;
        }
        t !== null || e[s].disabled || (t = e[s]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function rd(e, t, a) {
    if (t != null && ((t = '' + iu(t)), t !== e.value && (e.value = t), a == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = a != null ? '' + iu(a) : '';
  }
  function ld(e, t, a, i) {
    if (t == null) {
      if (i != null) {
        if (a != null) throw Error(l(92));
        if (ne(i)) {
          if (1 < i.length) throw Error(l(93));
          i = i[0];
        }
        a = i;
      }
      (a == null && (a = ''), (t = a));
    }
    ((a = iu(t)),
      (e.defaultValue = a),
      (i = e.textContent),
      i === a && i !== '' && i !== null && (e.value = i),
      Ao(e));
  }
  function ya(e, t) {
    if (t) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var o1 = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' ',
    ),
  );
  function id(e, t, a) {
    var i = t.indexOf('--') === 0;
    a == null || typeof a == 'boolean' || a === ''
      ? i
        ? e.setProperty(t, '')
        : t === 'float'
          ? (e.cssFloat = '')
          : (e[t] = '')
      : i
        ? e.setProperty(t, a)
        : typeof a != 'number' || a === 0 || o1.has(t)
          ? t === 'float'
            ? (e.cssFloat = a)
            : (e[t] = ('' + a).trim())
          : (e[t] = a + 'px');
  }
  function od(e, t, a) {
    if (t != null && typeof t != 'object') throw Error(l(62));
    if (((e = e.style), a != null)) {
      for (var i in a)
        !a.hasOwnProperty(i) ||
          (t != null && t.hasOwnProperty(i)) ||
          (i.indexOf('--') === 0
            ? e.setProperty(i, '')
            : i === 'float'
              ? (e.cssFloat = '')
              : (e[i] = ''));
      for (var s in t) ((i = t[s]), t.hasOwnProperty(s) && a[s] !== i && id(e, s, i));
    } else for (var f in t) t.hasOwnProperty(f) && id(e, f, t[f]);
  }
  function Fo(e) {
    if (e.indexOf('-') === -1) return !1;
    switch (e) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var s1 = new Map([
      ['acceptCharset', 'accept-charset'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
      ['crossOrigin', 'crossorigin'],
      ['accentHeight', 'accent-height'],
      ['alignmentBaseline', 'alignment-baseline'],
      ['arabicForm', 'arabic-form'],
      ['baselineShift', 'baseline-shift'],
      ['capHeight', 'cap-height'],
      ['clipPath', 'clip-path'],
      ['clipRule', 'clip-rule'],
      ['colorInterpolation', 'color-interpolation'],
      ['colorInterpolationFilters', 'color-interpolation-filters'],
      ['colorProfile', 'color-profile'],
      ['colorRendering', 'color-rendering'],
      ['dominantBaseline', 'dominant-baseline'],
      ['enableBackground', 'enable-background'],
      ['fillOpacity', 'fill-opacity'],
      ['fillRule', 'fill-rule'],
      ['floodColor', 'flood-color'],
      ['floodOpacity', 'flood-opacity'],
      ['fontFamily', 'font-family'],
      ['fontSize', 'font-size'],
      ['fontSizeAdjust', 'font-size-adjust'],
      ['fontStretch', 'font-stretch'],
      ['fontStyle', 'font-style'],
      ['fontVariant', 'font-variant'],
      ['fontWeight', 'font-weight'],
      ['glyphName', 'glyph-name'],
      ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
      ['glyphOrientationVertical', 'glyph-orientation-vertical'],
      ['horizAdvX', 'horiz-adv-x'],
      ['horizOriginX', 'horiz-origin-x'],
      ['imageRendering', 'image-rendering'],
      ['letterSpacing', 'letter-spacing'],
      ['lightingColor', 'lighting-color'],
      ['markerEnd', 'marker-end'],
      ['markerMid', 'marker-mid'],
      ['markerStart', 'marker-start'],
      ['overlinePosition', 'overline-position'],
      ['overlineThickness', 'overline-thickness'],
      ['paintOrder', 'paint-order'],
      ['panose-1', 'panose-1'],
      ['pointerEvents', 'pointer-events'],
      ['renderingIntent', 'rendering-intent'],
      ['shapeRendering', 'shape-rendering'],
      ['stopColor', 'stop-color'],
      ['stopOpacity', 'stop-opacity'],
      ['strikethroughPosition', 'strikethrough-position'],
      ['strikethroughThickness', 'strikethrough-thickness'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
      ['strokeLinecap', 'stroke-linecap'],
      ['strokeLinejoin', 'stroke-linejoin'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeOpacity', 'stroke-opacity'],
      ['strokeWidth', 'stroke-width'],
      ['textAnchor', 'text-anchor'],
      ['textDecoration', 'text-decoration'],
      ['textRendering', 'text-rendering'],
      ['transformOrigin', 'transform-origin'],
      ['underlinePosition', 'underline-position'],
      ['underlineThickness', 'underline-thickness'],
      ['unicodeBidi', 'unicode-bidi'],
      ['unicodeRange', 'unicode-range'],
      ['unitsPerEm', 'units-per-em'],
      ['vAlphabetic', 'v-alphabetic'],
      ['vHanging', 'v-hanging'],
      ['vIdeographic', 'v-ideographic'],
      ['vMathematical', 'v-mathematical'],
      ['vectorEffect', 'vector-effect'],
      ['vertAdvY', 'vert-adv-y'],
      ['vertOriginX', 'vert-origin-x'],
      ['vertOriginY', 'vert-origin-y'],
      ['wordSpacing', 'word-spacing'],
      ['writingMode', 'writing-mode'],
      ['xmlnsXlink', 'xmlns:xlink'],
      ['xHeight', 'x-height'],
    ]),
    f1 =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ml(e) {
    return f1.test('' + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function Hu() {}
  var So = null;
  function xo(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var Aa = null,
    Ba = null;
  function sd(e) {
    var t = ma(e);
    if (t && (e = t.stateNode)) {
      var a = e[Pt] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case 'input':
          if (
            (Bo(
              e,
              a.value,
              a.defaultValue,
              a.defaultValue,
              a.checked,
              a.defaultChecked,
              a.type,
              a.name,
            ),
            (t = a.name),
            a.type === 'radio' && t != null)
          ) {
            for (a = e; a.parentNode;) a = a.parentNode;
            for (
              a = a.querySelectorAll('input[name="' + ou('' + t) + '"][type="radio"]'), t = 0;
              t < a.length;
              t++
            ) {
              var i = a[t];
              if (i !== e && i.form === e.form) {
                var s = i[Pt] || null;
                if (!s) throw Error(l(90));
                Bo(
                  i,
                  s.value,
                  s.defaultValue,
                  s.defaultValue,
                  s.checked,
                  s.defaultChecked,
                  s.type,
                  s.name,
                );
              }
            }
            for (t = 0; t < a.length; t++) ((i = a[t]), i.form === e.form && nd(i));
          }
          break e;
        case 'textarea':
          rd(e, a.value, a.defaultValue);
          break e;
        case 'select':
          ((t = a.value), t != null && Ea(e, !!a.multiple, t, !1));
      }
    }
  }
  var Oo = !1;
  function fd(e, t, a) {
    if (Oo) return e(t, a);
    Oo = !0;
    try {
      var i = e(t);
      return i;
    } finally {
      if (
        ((Oo = !1),
        (Aa !== null || Ba !== null) &&
          (Ci(), Aa && ((t = Aa), (e = Ba), (Ba = Aa = null), sd(t), e)))
      )
        for (t = 0; t < e.length; t++) sd(e[t]);
    }
  }
  function vr(e, t) {
    var a = e.stateNode;
    if (a === null) return null;
    var i = a[Pt] || null;
    if (i === null) return null;
    a = i[t];
    e: switch (t) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ((i = !i.disabled) ||
          ((e = e.type),
          (i = !(e === 'button' || e === 'input' || e === 'select' || e === 'textarea'))),
          (e = !i));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (a && typeof a != 'function') throw Error(l(231, t, typeof a));
    return a;
  }
  var Uu = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    wo = !1;
  if (Uu)
    try {
      var gr = {};
      (Object.defineProperty(gr, 'passive', {
        get: function () {
          wo = !0;
        },
      }),
        window.addEventListener('test', gr, gr),
        window.removeEventListener('test', gr, gr));
    } catch {
      wo = !1;
    }
  var Dn = null,
    To = null,
    jl = null;
  function cd() {
    if (jl) return jl;
    var e,
      t = To,
      a = t.length,
      i,
      s = 'value' in Dn ? Dn.value : Dn.textContent,
      f = s.length;
    for (e = 0; e < a && t[e] === s[e]; e++);
    var g = a - e;
    for (i = 1; i <= g && t[a - i] === s[f - i]; i++);
    return (jl = s.slice(e, 1 < i ? 1 - i : void 0));
  }
  function Nl(e) {
    var t = e.keyCode;
    return (
      'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function zl() {
    return !0;
  }
  function dd() {
    return !1;
  }
  function Kt(e) {
    function t(a, i, s, f, g) {
      ((this._reactName = a),
        (this._targetInst = s),
        (this.type = i),
        (this.nativeEvent = f),
        (this.target = g),
        (this.currentTarget = null));
      for (var y in e) e.hasOwnProperty(y) && ((a = e[y]), (this[y] = a ? a(f) : f[y]));
      return (
        (this.isDefaultPrevented = (
          f.defaultPrevented != null ? f.defaultPrevented : f.returnValue === !1
        )
          ? zl
          : dd),
        (this.isPropagationStopped = dd),
        this
      );
    }
    return (
      C(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a &&
            (a.preventDefault
              ? a.preventDefault()
              : typeof a.returnValue != 'unknown' && (a.returnValue = !1),
            (this.isDefaultPrevented = zl));
        },
        stopPropagation: function () {
          var a = this.nativeEvent;
          a &&
            (a.stopPropagation
              ? a.stopPropagation()
              : typeof a.cancelBubble != 'unknown' && (a.cancelBubble = !0),
            (this.isPropagationStopped = zl));
        },
        persist: function () {},
        isPersistent: zl,
      }),
      t
    );
  }
  var Pn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Ll = Kt(Pn),
    mr = C({}, Pn, { view: 0, detail: 0 }),
    c1 = Kt(mr),
    Ro,
    Mo,
    pr,
    Hl = C({}, mr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: No,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return 'movementX' in e
          ? e.movementX
          : (e !== pr &&
              (pr && e.type === 'mousemove'
                ? ((Ro = e.screenX - pr.screenX), (Mo = e.screenY - pr.screenY))
                : (Mo = Ro = 0),
              (pr = e)),
            Ro);
      },
      movementY: function (e) {
        return 'movementY' in e ? e.movementY : Mo;
      },
    }),
    hd = Kt(Hl),
    d1 = C({}, Hl, { dataTransfer: 0 }),
    h1 = Kt(d1),
    D1 = C({}, mr, { relatedTarget: 0 }),
    jo = Kt(D1),
    v1 = C({}, Pn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    g1 = Kt(v1),
    m1 = C({}, Pn, {
      clipboardData: function (e) {
        return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
      },
    }),
    p1 = Kt(m1),
    C1 = C({}, Pn, { data: 0 }),
    Dd = Kt(C1),
    E1 = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    y1 = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    A1 = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function B1(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = A1[e]) ? !!t[e] : !1;
  }
  function No() {
    return B1;
  }
  var b1 = C({}, mr, {
      key: function (e) {
        if (e.key) {
          var t = E1[e.key] || e.key;
          if (t !== 'Unidentified') return t;
        }
        return e.type === 'keypress'
          ? ((e = Nl(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
          : e.type === 'keydown' || e.type === 'keyup'
            ? y1[e.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: No,
      charCode: function (e) {
        return e.type === 'keypress' ? Nl(e) : 0;
      },
      keyCode: function (e) {
        return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === 'keypress'
          ? Nl(e)
          : e.type === 'keydown' || e.type === 'keyup'
            ? e.keyCode
            : 0;
      },
    }),
    F1 = Kt(b1),
    S1 = C({}, Hl, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    vd = Kt(S1),
    x1 = C({}, mr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: No,
    }),
    O1 = Kt(x1),
    w1 = C({}, Pn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    T1 = Kt(w1),
    R1 = C({}, Hl, {
      deltaX: function (e) {
        return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return 'deltaY' in e
          ? e.deltaY
          : 'wheelDeltaY' in e
            ? -e.wheelDeltaY
            : 'wheelDelta' in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    M1 = Kt(R1),
    j1 = C({}, Pn, { newState: 0, oldState: 0 }),
    N1 = Kt(j1),
    z1 = [9, 13, 27, 32],
    zo = Uu && 'CompositionEvent' in window,
    Cr = null;
  Uu && 'documentMode' in document && (Cr = document.documentMode);
  var L1 = Uu && 'TextEvent' in window && !Cr,
    gd = Uu && (!zo || (Cr && 8 < Cr && 11 >= Cr)),
    md = ' ',
    pd = !1;
  function Cd(e, t) {
    switch (e) {
      case 'keyup':
        return z1.indexOf(t.keyCode) !== -1;
      case 'keydown':
        return t.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function Ed(e) {
    return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
  }
  var ba = !1;
  function H1(e, t) {
    switch (e) {
      case 'compositionend':
        return Ed(t);
      case 'keypress':
        return t.which !== 32 ? null : ((pd = !0), md);
      case 'textInput':
        return ((e = t.data), e === md && pd ? null : e);
      default:
        return null;
    }
  }
  function U1(e, t) {
    if (ba)
      return e === 'compositionend' || (!zo && Cd(e, t))
        ? ((e = cd()), (jl = To = Dn = null), (ba = !1), e)
        : null;
    switch (e) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case 'compositionend':
        return gd && t.locale !== 'ko' ? null : t.data;
      default:
        return null;
    }
  }
  var k1 = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function yd(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === 'input' ? !!k1[e.type] : t === 'textarea';
  }
  function Ad(e, t, a, i) {
    (Aa ? (Ba ? Ba.push(i) : (Ba = [i])) : (Aa = i),
      (t = Si(t, 'onChange')),
      0 < t.length &&
        ((a = new Ll('onChange', 'change', null, a, i)), e.push({ event: a, listeners: t })));
  }
  var Er = null,
    yr = null;
  function q1(e) {
    aD(e, 0);
  }
  function Ul(e) {
    var t = Dr(e);
    if (nd(t)) return e;
  }
  function Bd(e, t) {
    if (e === 'change') return t;
  }
  var bd = !1;
  if (Uu) {
    var Lo;
    if (Uu) {
      var Ho = 'oninput' in document;
      if (!Ho) {
        var Fd = document.createElement('div');
        (Fd.setAttribute('oninput', 'return;'), (Ho = typeof Fd.oninput == 'function'));
      }
      Lo = Ho;
    } else Lo = !1;
    bd = Lo && (!document.documentMode || 9 < document.documentMode);
  }
  function Sd() {
    Er && (Er.detachEvent('onpropertychange', xd), (yr = Er = null));
  }
  function xd(e) {
    if (e.propertyName === 'value' && Ul(yr)) {
      var t = [];
      (Ad(t, yr, e, xo(e)), fd(q1, t));
    }
  }
  function _1(e, t, a) {
    e === 'focusin'
      ? (Sd(), (Er = t), (yr = a), Er.attachEvent('onpropertychange', xd))
      : e === 'focusout' && Sd();
  }
  function G1(e) {
    if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return Ul(yr);
  }
  function Y1(e, t) {
    if (e === 'click') return Ul(t);
  }
  function V1(e, t) {
    if (e === 'input' || e === 'change') return Ul(t);
  }
  function P1(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var It = typeof Object.is == 'function' ? Object.is : P1;
  function Ar(e, t) {
    if (It(e, t)) return !0;
    if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
    var a = Object.keys(e),
      i = Object.keys(t);
    if (a.length !== i.length) return !1;
    for (i = 0; i < a.length; i++) {
      var s = a[i];
      if (!ze.call(t, s) || !It(e[s], t[s])) return !1;
    }
    return !0;
  }
  function Od(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }
  function wd(e, t) {
    var a = Od(e);
    e = 0;
    for (var i; a;) {
      if (a.nodeType === 3) {
        if (((i = e + a.textContent.length), e <= t && i >= t)) return { node: a, offset: t - e };
        e = i;
      }
      e: {
        for (; a;) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = Od(a);
    }
  }
  function Td(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Td(e, t.parentNode)
            : 'contains' in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Rd(e) {
    e =
      e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = Rl(e.document); t instanceof e.HTMLIFrameElement;) {
      try {
        var a = typeof t.contentWindow.location.href == 'string';
      } catch {
        a = !1;
      }
      if (a) e = t.contentWindow;
      else break;
      t = Rl(e.document);
    }
    return t;
  }
  function Uo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === 'input' &&
        (e.type === 'text' ||
          e.type === 'search' ||
          e.type === 'tel' ||
          e.type === 'url' ||
          e.type === 'password')) ||
        t === 'textarea' ||
        e.contentEditable === 'true')
    );
  }
  var K1 = Uu && 'documentMode' in document && 11 >= document.documentMode,
    Fa = null,
    ko = null,
    Br = null,
    qo = !1;
  function Md(e, t, a) {
    var i = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    qo ||
      Fa == null ||
      Fa !== Rl(i) ||
      ((i = Fa),
      'selectionStart' in i && Uo(i)
        ? (i = { start: i.selectionStart, end: i.selectionEnd })
        : ((i = ((i.ownerDocument && i.ownerDocument.defaultView) || window).getSelection()),
          (i = {
            anchorNode: i.anchorNode,
            anchorOffset: i.anchorOffset,
            focusNode: i.focusNode,
            focusOffset: i.focusOffset,
          })),
      (Br && Ar(Br, i)) ||
        ((Br = i),
        (i = Si(ko, 'onSelect')),
        0 < i.length &&
          ((t = new Ll('onSelect', 'select', null, t, a)),
          e.push({ event: t, listeners: i }),
          (t.target = Fa))));
  }
  function Kn(e, t) {
    var a = {};
    return (
      (a[e.toLowerCase()] = t.toLowerCase()),
      (a['Webkit' + e] = 'webkit' + t),
      (a['Moz' + e] = 'moz' + t),
      a
    );
  }
  var Sa = {
      animationend: Kn('Animation', 'AnimationEnd'),
      animationiteration: Kn('Animation', 'AnimationIteration'),
      animationstart: Kn('Animation', 'AnimationStart'),
      transitionrun: Kn('Transition', 'TransitionRun'),
      transitionstart: Kn('Transition', 'TransitionStart'),
      transitioncancel: Kn('Transition', 'TransitionCancel'),
      transitionend: Kn('Transition', 'TransitionEnd'),
    },
    _o = {},
    jd = {};
  Uu &&
    ((jd = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete Sa.animationend.animation,
      delete Sa.animationiteration.animation,
      delete Sa.animationstart.animation),
    'TransitionEvent' in window || delete Sa.transitionend.transition);
  function Xn(e) {
    if (_o[e]) return _o[e];
    if (!Sa[e]) return e;
    var t = Sa[e],
      a;
    for (a in t) if (t.hasOwnProperty(a) && a in jd) return (_o[e] = t[a]);
    return e;
  }
  var Nd = Xn('animationend'),
    zd = Xn('animationiteration'),
    Ld = Xn('animationstart'),
    X1 = Xn('transitionrun'),
    Q1 = Xn('transitionstart'),
    Z1 = Xn('transitioncancel'),
    Hd = Xn('transitionend'),
    Ud = new Map(),
    Go =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' ',
      );
  Go.push('scrollEnd');
  function Eu(e, t) {
    (Ud.set(e, t), Vn(t, [e]));
  }
  var kl =
      typeof reportError == 'function'
        ? reportError
        : function (e) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var t = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == 'object' && e !== null && typeof e.message == 'string'
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', e);
              return;
            }
            console.error(e);
          },
    su = [],
    xa = 0,
    Yo = 0;
  function ql() {
    for (var e = xa, t = (Yo = xa = 0); t < e;) {
      var a = su[t];
      su[t++] = null;
      var i = su[t];
      su[t++] = null;
      var s = su[t];
      su[t++] = null;
      var f = su[t];
      if (((su[t++] = null), i !== null && s !== null)) {
        var g = i.pending;
        (g === null ? (s.next = s) : ((s.next = g.next), (g.next = s)), (i.pending = s));
      }
      f !== 0 && kd(a, s, f);
    }
  }
  function _l(e, t, a, i) {
    ((su[xa++] = e),
      (su[xa++] = t),
      (su[xa++] = a),
      (su[xa++] = i),
      (Yo |= i),
      (e.lanes |= i),
      (e = e.alternate),
      e !== null && (e.lanes |= i));
  }
  function Vo(e, t, a, i) {
    return (_l(e, t, a, i), Gl(e));
  }
  function Qn(e, t) {
    return (_l(e, null, null, t), Gl(e));
  }
  function kd(e, t, a) {
    e.lanes |= a;
    var i = e.alternate;
    i !== null && (i.lanes |= a);
    for (var s = !1, f = e.return; f !== null;)
      ((f.childLanes |= a),
        (i = f.alternate),
        i !== null && (i.childLanes |= a),
        f.tag === 22 && ((e = f.stateNode), e === null || e._visibility & 1 || (s = !0)),
        (e = f),
        (f = f.return));
    return e.tag === 3
      ? ((f = e.stateNode),
        s &&
          t !== null &&
          ((s = 31 - kt(a)),
          (e = f.hiddenUpdates),
          (i = e[s]),
          i === null ? (e[s] = [t]) : i.push(t),
          (t.lane = a | 536870912)),
        f)
      : null;
  }
  function Gl(e) {
    if (50 < Pr) throw ((Pr = 0), (Is = null), Error(l(185)));
    for (var t = e.return; t !== null;) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var Oa = {};
  function $1(e, t, a, i) {
    ((this.tag = e),
      (this.key = a),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = i),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function eu(e, t, a, i) {
    return new $1(e, t, a, i);
  }
  function Po(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function ku(e, t) {
    var a = e.alternate;
    return (
      a === null
        ? ((a = eu(e.tag, t, e.key, e.mode)),
          (a.elementType = e.elementType),
          (a.type = e.type),
          (a.stateNode = e.stateNode),
          (a.alternate = e),
          (e.alternate = a))
        : ((a.pendingProps = t),
          (a.type = e.type),
          (a.flags = 0),
          (a.subtreeFlags = 0),
          (a.deletions = null)),
      (a.flags = e.flags & 65011712),
      (a.childLanes = e.childLanes),
      (a.lanes = e.lanes),
      (a.child = e.child),
      (a.memoizedProps = e.memoizedProps),
      (a.memoizedState = e.memoizedState),
      (a.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (a.sibling = e.sibling),
      (a.index = e.index),
      (a.ref = e.ref),
      (a.refCleanup = e.refCleanup),
      a
    );
  }
  function qd(e, t) {
    e.flags &= 65011714;
    var a = e.alternate;
    return (
      a === null
        ? ((e.childLanes = 0),
          (e.lanes = t),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = a.childLanes),
          (e.lanes = a.lanes),
          (e.child = a.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = a.memoizedProps),
          (e.memoizedState = a.memoizedState),
          (e.updateQueue = a.updateQueue),
          (e.type = a.type),
          (t = a.dependencies),
          (e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
      e
    );
  }
  function Yl(e, t, a, i, s, f) {
    var g = 0;
    if (((i = e), typeof e == 'function')) Po(e) && (g = 1);
    else if (typeof e == 'string')
      g = tC(e, a, J.current) ? 26 : e === 'html' || e === 'head' || e === 'body' ? 27 : 5;
    else
      e: switch (e) {
        case se:
          return ((e = eu(31, a, t, s)), (e.elementType = se), (e.lanes = f), e);
        case w:
          return Zn(a.children, s, f, t);
        case N:
          ((g = 8), (s |= 24));
          break;
        case b:
          return ((e = eu(12, a, t, s | 2)), (e.elementType = b), (e.lanes = f), e);
        case K:
          return ((e = eu(13, a, t, s)), (e.elementType = K), (e.lanes = f), e);
        case ue:
          return ((e = eu(19, a, t, s)), (e.elementType = ue), (e.lanes = f), e);
        default:
          if (typeof e == 'object' && e !== null)
            switch (e.$$typeof) {
              case M:
                g = 10;
                break e;
              case m:
                g = 9;
                break e;
              case _:
                g = 11;
                break e;
              case X:
                g = 14;
                break e;
              case ie:
                ((g = 16), (i = null));
                break e;
            }
          ((g = 29), (a = Error(l(130, e === null ? 'null' : typeof e, ''))), (i = null));
      }
    return ((t = eu(g, a, t, s)), (t.elementType = e), (t.type = i), (t.lanes = f), t);
  }
  function Zn(e, t, a, i) {
    return ((e = eu(7, e, i, t)), (e.lanes = a), e);
  }
  function Ko(e, t, a) {
    return ((e = eu(6, e, null, t)), (e.lanes = a), e);
  }
  function _d(e) {
    var t = eu(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function Xo(e, t, a) {
    return (
      (t = eu(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = a),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  var Gd = new WeakMap();
  function fu(e, t) {
    if (typeof e == 'object' && e !== null) {
      var a = Gd.get(e);
      return a !== void 0 ? a : ((t = { value: e, source: t, stack: _e(t) }), Gd.set(e, t), t);
    }
    return { value: e, source: t, stack: _e(t) };
  }
  var wa = [],
    Ta = 0,
    Vl = null,
    br = 0,
    cu = [],
    du = 0,
    vn = null,
    xu = 1,
    Ou = '';
  function qu(e, t) {
    ((wa[Ta++] = br), (wa[Ta++] = Vl), (Vl = e), (br = t));
  }
  function Yd(e, t, a) {
    ((cu[du++] = xu), (cu[du++] = Ou), (cu[du++] = vn), (vn = e));
    var i = xu;
    e = Ou;
    var s = 32 - kt(i) - 1;
    ((i &= ~(1 << s)), (a += 1));
    var f = 32 - kt(t) + s;
    if (30 < f) {
      var g = s - (s % 5);
      ((f = (i & ((1 << g) - 1)).toString(32)),
        (i >>= g),
        (s -= g),
        (xu = (1 << (32 - kt(t) + s)) | (a << s) | i),
        (Ou = f + e));
    } else ((xu = (1 << f) | (a << s) | i), (Ou = e));
  }
  function Qo(e) {
    e.return !== null && (qu(e, 1), Yd(e, 1, 0));
  }
  function Zo(e) {
    for (; e === Vl;) ((Vl = wa[--Ta]), (wa[Ta] = null), (br = wa[--Ta]), (wa[Ta] = null));
    for (; e === vn;)
      ((vn = cu[--du]),
        (cu[du] = null),
        (Ou = cu[--du]),
        (cu[du] = null),
        (xu = cu[--du]),
        (cu[du] = null));
  }
  function Vd(e, t) {
    ((cu[du++] = xu), (cu[du++] = Ou), (cu[du++] = vn), (xu = t.id), (Ou = t.overflow), (vn = e));
  }
  var wt = null,
    nt = null,
    qe = !1,
    gn = null,
    hu = !1,
    $o = Error(l(519));
  function mn(e) {
    var t = Error(
      l(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', ''),
    );
    throw (Fr(fu(t, e)), $o);
  }
  function Pd(e) {
    var t = e.stateNode,
      a = e.type,
      i = e.memoizedProps;
    switch (((t[Ot] = e), (t[Pt] = i), a)) {
      case 'dialog':
        (He('cancel', t), He('close', t));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        He('load', t);
        break;
      case 'video':
      case 'audio':
        for (a = 0; a < Xr.length; a++) He(Xr[a], t);
        break;
      case 'source':
        He('error', t);
        break;
      case 'img':
      case 'image':
      case 'link':
        (He('error', t), He('load', t));
        break;
      case 'details':
        He('toggle', t);
        break;
      case 'input':
        (He('invalid', t),
          ad(t, i.value, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name, !0));
        break;
      case 'select':
        He('invalid', t);
        break;
      case 'textarea':
        (He('invalid', t), ld(t, i.value, i.defaultValue, i.children));
    }
    ((a = i.children),
      (typeof a != 'string' && typeof a != 'number' && typeof a != 'bigint') ||
      t.textContent === '' + a ||
      i.suppressHydrationWarning === !0 ||
      oD(t.textContent, a)
        ? (i.popover != null && (He('beforetoggle', t), He('toggle', t)),
          i.onScroll != null && He('scroll', t),
          i.onScrollEnd != null && He('scrollend', t),
          i.onClick != null && (t.onclick = Hu),
          (t = !0))
        : (t = !1),
      t || mn(e, !0));
  }
  function Kd(e) {
    for (wt = e.return; wt;)
      switch (wt.tag) {
        case 5:
        case 31:
        case 13:
          hu = !1;
          return;
        case 27:
        case 3:
          hu = !0;
          return;
        default:
          wt = wt.return;
      }
  }
  function Ra(e) {
    if (e !== wt) return !1;
    if (!qe) return (Kd(e), (qe = !0), !1);
    var t = e.tag,
      a;
    if (
      ((a = t !== 3 && t !== 27) &&
        ((a = t === 5) &&
          ((a = e.type), (a = !(a !== 'form' && a !== 'button') || vf(e.type, e.memoizedProps))),
        (a = !a)),
      a && nt && mn(e),
      Kd(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(l(317));
      nt = mD(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(l(317));
      nt = mD(e);
    } else
      t === 27
        ? ((t = nt), Rn(e.type) ? ((e = Ef), (Ef = null), (nt = e)) : (nt = t))
        : (nt = wt ? vu(e.stateNode.nextSibling) : null);
    return !0;
  }
  function $n() {
    ((nt = wt = null), (qe = !1));
  }
  function Wo() {
    var e = gn;
    return (e !== null && ($t === null ? ($t = e) : $t.push.apply($t, e), (gn = null)), e);
  }
  function Fr(e) {
    gn === null ? (gn = [e]) : gn.push(e);
  }
  var Jo = x(null),
    Wn = null,
    _u = null;
  function pn(e, t, a) {
    (Z(Jo, t._currentValue), (t._currentValue = a));
  }
  function Gu(e) {
    ((e._currentValue = Jo.current), Y(Jo));
  }
  function Io(e, t, a) {
    for (; e !== null;) {
      var i = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), i !== null && (i.childLanes |= t))
          : i !== null && (i.childLanes & t) !== t && (i.childLanes |= t),
        e === a)
      )
        break;
      e = e.return;
    }
  }
  function es(e, t, a, i) {
    var s = e.child;
    for (s !== null && (s.return = e); s !== null;) {
      var f = s.dependencies;
      if (f !== null) {
        var g = s.child;
        f = f.firstContext;
        e: for (; f !== null;) {
          var y = f;
          f = s;
          for (var O = 0; O < t.length; O++)
            if (y.context === t[O]) {
              ((f.lanes |= a),
                (y = f.alternate),
                y !== null && (y.lanes |= a),
                Io(f.return, a, e),
                i || (g = null));
              break e;
            }
          f = y.next;
        }
      } else if (s.tag === 18) {
        if (((g = s.return), g === null)) throw Error(l(341));
        ((g.lanes |= a), (f = g.alternate), f !== null && (f.lanes |= a), Io(g, a, e), (g = null));
      } else g = s.child;
      if (g !== null) g.return = s;
      else
        for (g = s; g !== null;) {
          if (g === e) {
            g = null;
            break;
          }
          if (((s = g.sibling), s !== null)) {
            ((s.return = g.return), (g = s));
            break;
          }
          g = g.return;
        }
      s = g;
    }
  }
  function Ma(e, t, a, i) {
    e = null;
    for (var s = t, f = !1; s !== null;) {
      if (!f) {
        if ((s.flags & 524288) !== 0) f = !0;
        else if ((s.flags & 262144) !== 0) break;
      }
      if (s.tag === 10) {
        var g = s.alternate;
        if (g === null) throw Error(l(387));
        if (((g = g.memoizedProps), g !== null)) {
          var y = s.type;
          It(s.pendingProps.value, g.value) || (e !== null ? e.push(y) : (e = [y]));
        }
      } else if (s === Oe.current) {
        if (((g = s.alternate), g === null)) throw Error(l(387));
        g.memoizedState.memoizedState !== s.memoizedState.memoizedState &&
          (e !== null ? e.push(Jr) : (e = [Jr]));
      }
      s = s.return;
    }
    (e !== null && es(t, e, a, i), (t.flags |= 262144));
  }
  function Pl(e) {
    for (e = e.firstContext; e !== null;) {
      if (!It(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function Jn(e) {
    ((Wn = e), (_u = null), (e = e.dependencies), e !== null && (e.firstContext = null));
  }
  function Tt(e) {
    return Xd(Wn, e);
  }
  function Kl(e, t) {
    return (Wn === null && Jn(e), Xd(e, t));
  }
  function Xd(e, t) {
    var a = t._currentValue;
    if (((t = { context: t, memoizedValue: a, next: null }), _u === null)) {
      if (e === null) throw Error(l(308));
      ((_u = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
    } else _u = _u.next = t;
    return a;
  }
  var W1 =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var e = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (a, i) {
                  e.push(i);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                e.forEach(function (a) {
                  return a();
                }));
            };
          },
    J1 = n.unstable_scheduleCallback,
    I1 = n.unstable_NormalPriority,
    gt = {
      $$typeof: M,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function ts() {
    return { controller: new W1(), data: new Map(), refCount: 0 };
  }
  function Sr(e) {
    (e.refCount--,
      e.refCount === 0 &&
        J1(I1, function () {
          e.controller.abort();
        }));
  }
  var xr = null,
    us = 0,
    ja = 0,
    Na = null;
  function ep(e, t) {
    if (xr === null) {
      var a = (xr = []);
      ((us = 0),
        (ja = rf()),
        (Na = {
          status: 'pending',
          value: void 0,
          then: function (i) {
            a.push(i);
          },
        }));
    }
    return (us++, t.then(Qd, Qd), t);
  }
  function Qd() {
    if (--us === 0 && xr !== null) {
      Na !== null && (Na.status = 'fulfilled');
      var e = xr;
      ((xr = null), (ja = 0), (Na = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function tp(e, t) {
    var a = [],
      i = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (s) {
          a.push(s);
        },
      };
    return (
      e.then(
        function () {
          ((i.status = 'fulfilled'), (i.value = t));
          for (var s = 0; s < a.length; s++) (0, a[s])(t);
        },
        function (s) {
          for (i.status = 'rejected', i.reason = s, s = 0; s < a.length; s++) (0, a[s])(void 0);
        },
      ),
      i
    );
  }
  var Zd = L.S;
  L.S = function (e, t) {
    ((Mh = ct()),
      typeof t == 'object' && t !== null && typeof t.then == 'function' && ep(e, t),
      Zd !== null && Zd(e, t));
  };
  var In = x(null);
  function ns() {
    var e = In.current;
    return e !== null ? e : tt.pooledCache;
  }
  function Xl(e, t) {
    t === null ? Z(In, In.current) : Z(In, t.pool);
  }
  function $d() {
    var e = ns();
    return e === null ? null : { parent: gt._currentValue, pool: e };
  }
  var za = Error(l(460)),
    as = Error(l(474)),
    Ql = Error(l(542)),
    Zl = { then: function () {} };
  function Wd(e) {
    return ((e = e.status), e === 'fulfilled' || e === 'rejected');
  }
  function Jd(e, t, a) {
    switch (
      ((a = e[a]), a === void 0 ? e.push(t) : a !== t && (t.then(Hu, Hu), (t = a)), t.status)
    ) {
      case 'fulfilled':
        return t.value;
      case 'rejected':
        throw ((e = t.reason), e0(e), e);
      default:
        if (typeof t.status == 'string') t.then(Hu, Hu);
        else {
          if (((e = tt), e !== null && 100 < e.shellSuspendCounter)) throw Error(l(482));
          ((e = t),
            (e.status = 'pending'),
            e.then(
              function (i) {
                if (t.status === 'pending') {
                  var s = t;
                  ((s.status = 'fulfilled'), (s.value = i));
                }
              },
              function (i) {
                if (t.status === 'pending') {
                  var s = t;
                  ((s.status = 'rejected'), (s.reason = i));
                }
              },
            ));
        }
        switch (t.status) {
          case 'fulfilled':
            return t.value;
          case 'rejected':
            throw ((e = t.reason), e0(e), e);
        }
        throw ((ta = t), za);
    }
  }
  function ea(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (a) {
      throw a !== null && typeof a == 'object' && typeof a.then == 'function' ? ((ta = a), za) : a;
    }
  }
  var ta = null;
  function Id() {
    if (ta === null) throw Error(l(459));
    var e = ta;
    return ((ta = null), e);
  }
  function e0(e) {
    if (e === za || e === Ql) throw Error(l(483));
  }
  var La = null,
    Or = 0;
  function $l(e) {
    var t = Or;
    return ((Or += 1), La === null && (La = []), Jd(La, e, t));
  }
  function wr(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function Wl(e, t) {
    throw t.$$typeof === A
      ? Error(l(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(
          l(
            31,
            e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e,
          ),
        ));
  }
  function t0(e) {
    function t(H, R) {
      if (e) {
        var k = H.deletions;
        k === null ? ((H.deletions = [R]), (H.flags |= 16)) : k.push(R);
      }
    }
    function a(H, R) {
      if (!e) return null;
      for (; R !== null;) (t(H, R), (R = R.sibling));
      return null;
    }
    function i(H) {
      for (var R = new Map(); H !== null;)
        (H.key !== null ? R.set(H.key, H) : R.set(H.index, H), (H = H.sibling));
      return R;
    }
    function s(H, R) {
      return ((H = ku(H, R)), (H.index = 0), (H.sibling = null), H);
    }
    function f(H, R, k) {
      return (
        (H.index = k),
        e
          ? ((k = H.alternate),
            k !== null
              ? ((k = k.index), k < R ? ((H.flags |= 67108866), R) : k)
              : ((H.flags |= 67108866), R))
          : ((H.flags |= 1048576), R)
      );
    }
    function g(H) {
      return (e && H.alternate === null && (H.flags |= 67108866), H);
    }
    function y(H, R, k, I) {
      return R === null || R.tag !== 6
        ? ((R = Ko(k, H.mode, I)), (R.return = H), R)
        : ((R = s(R, k)), (R.return = H), R);
    }
    function O(H, R, k, I) {
      var Be = k.type;
      return Be === w
        ? $(H, R, k.props.children, I, k.key)
        : R !== null &&
            (R.elementType === Be ||
              (typeof Be == 'object' && Be !== null && Be.$$typeof === ie && ea(Be) === R.type))
          ? ((R = s(R, k.props)), wr(R, k), (R.return = H), R)
          : ((R = Yl(k.type, k.key, k.props, null, H.mode, I)), wr(R, k), (R.return = H), R);
    }
    function q(H, R, k, I) {
      return R === null ||
        R.tag !== 4 ||
        R.stateNode.containerInfo !== k.containerInfo ||
        R.stateNode.implementation !== k.implementation
        ? ((R = Xo(k, H.mode, I)), (R.return = H), R)
        : ((R = s(R, k.children || [])), (R.return = H), R);
    }
    function $(H, R, k, I, Be) {
      return R === null || R.tag !== 7
        ? ((R = Zn(k, H.mode, I, Be)), (R.return = H), R)
        : ((R = s(R, k)), (R.return = H), R);
    }
    function te(H, R, k) {
      if ((typeof R == 'string' && R !== '') || typeof R == 'number' || typeof R == 'bigint')
        return ((R = Ko('' + R, H.mode, k)), (R.return = H), R);
      if (typeof R == 'object' && R !== null) {
        switch (R.$$typeof) {
          case B:
            return ((k = Yl(R.type, R.key, R.props, null, H.mode, k)), wr(k, R), (k.return = H), k);
          case S:
            return ((R = Xo(R, H.mode, k)), (R.return = H), R);
          case ie:
            return ((R = ea(R)), te(H, R, k));
        }
        if (ne(R) || W(R)) return ((R = Zn(R, H.mode, k, null)), (R.return = H), R);
        if (typeof R.then == 'function') return te(H, $l(R), k);
        if (R.$$typeof === M) return te(H, Kl(H, R), k);
        Wl(H, R);
      }
      return null;
    }
    function G(H, R, k, I) {
      var Be = R !== null ? R.key : null;
      if ((typeof k == 'string' && k !== '') || typeof k == 'number' || typeof k == 'bigint')
        return Be !== null ? null : y(H, R, '' + k, I);
      if (typeof k == 'object' && k !== null) {
        switch (k.$$typeof) {
          case B:
            return k.key === Be ? O(H, R, k, I) : null;
          case S:
            return k.key === Be ? q(H, R, k, I) : null;
          case ie:
            return ((k = ea(k)), G(H, R, k, I));
        }
        if (ne(k) || W(k)) return Be !== null ? null : $(H, R, k, I, null);
        if (typeof k.then == 'function') return G(H, R, $l(k), I);
        if (k.$$typeof === M) return G(H, R, Kl(H, k), I);
        Wl(H, k);
      }
      return null;
    }
    function P(H, R, k, I, Be) {
      if ((typeof I == 'string' && I !== '') || typeof I == 'number' || typeof I == 'bigint')
        return ((H = H.get(k) || null), y(R, H, '' + I, Be));
      if (typeof I == 'object' && I !== null) {
        switch (I.$$typeof) {
          case B:
            return ((H = H.get(I.key === null ? k : I.key) || null), O(R, H, I, Be));
          case S:
            return ((H = H.get(I.key === null ? k : I.key) || null), q(R, H, I, Be));
          case ie:
            return ((I = ea(I)), P(H, R, k, I, Be));
        }
        if (ne(I) || W(I)) return ((H = H.get(k) || null), $(R, H, I, Be, null));
        if (typeof I.then == 'function') return P(H, R, k, $l(I), Be);
        if (I.$$typeof === M) return P(H, R, k, Kl(R, I), Be);
        Wl(R, I);
      }
      return null;
    }
    function me(H, R, k, I) {
      for (
        var Be = null, Ge = null, Ce = R, je = (R = 0), ke = null;
        Ce !== null && je < k.length;
        je++
      ) {
        Ce.index > je ? ((ke = Ce), (Ce = null)) : (ke = Ce.sibling);
        var Ye = G(H, Ce, k[je], I);
        if (Ye === null) {
          Ce === null && (Ce = ke);
          break;
        }
        (e && Ce && Ye.alternate === null && t(H, Ce),
          (R = f(Ye, R, je)),
          Ge === null ? (Be = Ye) : (Ge.sibling = Ye),
          (Ge = Ye),
          (Ce = ke));
      }
      if (je === k.length) return (a(H, Ce), qe && qu(H, je), Be);
      if (Ce === null) {
        for (; je < k.length; je++)
          ((Ce = te(H, k[je], I)),
            Ce !== null &&
              ((R = f(Ce, R, je)), Ge === null ? (Be = Ce) : (Ge.sibling = Ce), (Ge = Ce)));
        return (qe && qu(H, je), Be);
      }
      for (Ce = i(Ce); je < k.length; je++)
        ((ke = P(Ce, H, je, k[je], I)),
          ke !== null &&
            (e && ke.alternate !== null && Ce.delete(ke.key === null ? je : ke.key),
            (R = f(ke, R, je)),
            Ge === null ? (Be = ke) : (Ge.sibling = ke),
            (Ge = ke)));
      return (
        e &&
          Ce.forEach(function (Ln) {
            return t(H, Ln);
          }),
        qe && qu(H, je),
        Be
      );
    }
    function Se(H, R, k, I) {
      if (k == null) throw Error(l(151));
      for (
        var Be = null, Ge = null, Ce = R, je = (R = 0), ke = null, Ye = k.next();
        Ce !== null && !Ye.done;
        je++, Ye = k.next()
      ) {
        Ce.index > je ? ((ke = Ce), (Ce = null)) : (ke = Ce.sibling);
        var Ln = G(H, Ce, Ye.value, I);
        if (Ln === null) {
          Ce === null && (Ce = ke);
          break;
        }
        (e && Ce && Ln.alternate === null && t(H, Ce),
          (R = f(Ln, R, je)),
          Ge === null ? (Be = Ln) : (Ge.sibling = Ln),
          (Ge = Ln),
          (Ce = ke));
      }
      if (Ye.done) return (a(H, Ce), qe && qu(H, je), Be);
      if (Ce === null) {
        for (; !Ye.done; je++, Ye = k.next())
          ((Ye = te(H, Ye.value, I)),
            Ye !== null &&
              ((R = f(Ye, R, je)), Ge === null ? (Be = Ye) : (Ge.sibling = Ye), (Ge = Ye)));
        return (qe && qu(H, je), Be);
      }
      for (Ce = i(Ce); !Ye.done; je++, Ye = k.next())
        ((Ye = P(Ce, H, je, Ye.value, I)),
          Ye !== null &&
            (e && Ye.alternate !== null && Ce.delete(Ye.key === null ? je : Ye.key),
            (R = f(Ye, R, je)),
            Ge === null ? (Be = Ye) : (Ge.sibling = Ye),
            (Ge = Ye)));
      return (
        e &&
          Ce.forEach(function (dC) {
            return t(H, dC);
          }),
        qe && qu(H, je),
        Be
      );
    }
    function et(H, R, k, I) {
      if (
        (typeof k == 'object' &&
          k !== null &&
          k.type === w &&
          k.key === null &&
          (k = k.props.children),
        typeof k == 'object' && k !== null)
      ) {
        switch (k.$$typeof) {
          case B:
            e: {
              for (var Be = k.key; R !== null;) {
                if (R.key === Be) {
                  if (((Be = k.type), Be === w)) {
                    if (R.tag === 7) {
                      (a(H, R.sibling), (I = s(R, k.props.children)), (I.return = H), (H = I));
                      break e;
                    }
                  } else if (
                    R.elementType === Be ||
                    (typeof Be == 'object' &&
                      Be !== null &&
                      Be.$$typeof === ie &&
                      ea(Be) === R.type)
                  ) {
                    (a(H, R.sibling), (I = s(R, k.props)), wr(I, k), (I.return = H), (H = I));
                    break e;
                  }
                  a(H, R);
                  break;
                } else t(H, R);
                R = R.sibling;
              }
              k.type === w
                ? ((I = Zn(k.props.children, H.mode, I, k.key)), (I.return = H), (H = I))
                : ((I = Yl(k.type, k.key, k.props, null, H.mode, I)),
                  wr(I, k),
                  (I.return = H),
                  (H = I));
            }
            return g(H);
          case S:
            e: {
              for (Be = k.key; R !== null;) {
                if (R.key === Be)
                  if (
                    R.tag === 4 &&
                    R.stateNode.containerInfo === k.containerInfo &&
                    R.stateNode.implementation === k.implementation
                  ) {
                    (a(H, R.sibling), (I = s(R, k.children || [])), (I.return = H), (H = I));
                    break e;
                  } else {
                    a(H, R);
                    break;
                  }
                else t(H, R);
                R = R.sibling;
              }
              ((I = Xo(k, H.mode, I)), (I.return = H), (H = I));
            }
            return g(H);
          case ie:
            return ((k = ea(k)), et(H, R, k, I));
        }
        if (ne(k)) return me(H, R, k, I);
        if (W(k)) {
          if (((Be = W(k)), typeof Be != 'function')) throw Error(l(150));
          return ((k = Be.call(k)), Se(H, R, k, I));
        }
        if (typeof k.then == 'function') return et(H, R, $l(k), I);
        if (k.$$typeof === M) return et(H, R, Kl(H, k), I);
        Wl(H, k);
      }
      return (typeof k == 'string' && k !== '') || typeof k == 'number' || typeof k == 'bigint'
        ? ((k = '' + k),
          R !== null && R.tag === 6
            ? (a(H, R.sibling), (I = s(R, k)), (I.return = H), (H = I))
            : (a(H, R), (I = Ko(k, H.mode, I)), (I.return = H), (H = I)),
          g(H))
        : a(H, R);
    }
    return function (H, R, k, I) {
      try {
        Or = 0;
        var Be = et(H, R, k, I);
        return ((La = null), Be);
      } catch (Ce) {
        if (Ce === za || Ce === Ql) throw Ce;
        var Ge = eu(29, Ce, null, H.mode);
        return ((Ge.lanes = I), (Ge.return = H), Ge);
      } finally {
      }
    };
  }
  var ua = t0(!0),
    u0 = t0(!1),
    Cn = !1;
  function rs(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function ls(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        }));
  }
  function En(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function yn(e, t, a) {
    var i = e.updateQueue;
    if (i === null) return null;
    if (((i = i.shared), (Pe & 2) !== 0)) {
      var s = i.pending;
      return (
        s === null ? (t.next = t) : ((t.next = s.next), (s.next = t)),
        (i.pending = t),
        (t = Gl(e)),
        kd(e, null, a),
        t
      );
    }
    return (_l(e, i, t, a), Gl(e));
  }
  function Tr(e, t, a) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (a & 4194048) !== 0))) {
      var i = t.lanes;
      ((i &= e.pendingLanes), (a |= i), (t.lanes = a), Xc(e, a));
    }
  }
  function is(e, t) {
    var a = e.updateQueue,
      i = e.alternate;
    if (i !== null && ((i = i.updateQueue), a === i)) {
      var s = null,
        f = null;
      if (((a = a.firstBaseUpdate), a !== null)) {
        do {
          var g = { lane: a.lane, tag: a.tag, payload: a.payload, callback: null, next: null };
          (f === null ? (s = f = g) : (f = f.next = g), (a = a.next));
        } while (a !== null);
        f === null ? (s = f = t) : (f = f.next = t);
      } else s = f = t;
      ((a = {
        baseState: i.baseState,
        firstBaseUpdate: s,
        lastBaseUpdate: f,
        shared: i.shared,
        callbacks: i.callbacks,
      }),
        (e.updateQueue = a));
      return;
    }
    ((e = a.lastBaseUpdate),
      e === null ? (a.firstBaseUpdate = t) : (e.next = t),
      (a.lastBaseUpdate = t));
  }
  var os = !1;
  function Rr() {
    if (os) {
      var e = Na;
      if (e !== null) throw e;
    }
  }
  function Mr(e, t, a, i) {
    os = !1;
    var s = e.updateQueue;
    Cn = !1;
    var f = s.firstBaseUpdate,
      g = s.lastBaseUpdate,
      y = s.shared.pending;
    if (y !== null) {
      s.shared.pending = null;
      var O = y,
        q = O.next;
      ((O.next = null), g === null ? (f = q) : (g.next = q), (g = O));
      var $ = e.alternate;
      $ !== null &&
        (($ = $.updateQueue),
        (y = $.lastBaseUpdate),
        y !== g && (y === null ? ($.firstBaseUpdate = q) : (y.next = q), ($.lastBaseUpdate = O)));
    }
    if (f !== null) {
      var te = s.baseState;
      ((g = 0), ($ = q = O = null), (y = f));
      do {
        var G = y.lane & -536870913,
          P = G !== y.lane;
        if (P ? (Ue & G) === G : (i & G) === G) {
          (G !== 0 && G === ja && (os = !0),
            $ !== null &&
              ($ = $.next =
                { lane: 0, tag: y.tag, payload: y.payload, callback: null, next: null }));
          e: {
            var me = e,
              Se = y;
            G = t;
            var et = a;
            switch (Se.tag) {
              case 1:
                if (((me = Se.payload), typeof me == 'function')) {
                  te = me.call(et, te, G);
                  break e;
                }
                te = me;
                break e;
              case 3:
                me.flags = (me.flags & -65537) | 128;
              case 0:
                if (
                  ((me = Se.payload),
                  (G = typeof me == 'function' ? me.call(et, te, G) : me),
                  G == null)
                )
                  break e;
                te = C({}, te, G);
                break e;
              case 2:
                Cn = !0;
            }
          }
          ((G = y.callback),
            G !== null &&
              ((e.flags |= 64),
              P && (e.flags |= 8192),
              (P = s.callbacks),
              P === null ? (s.callbacks = [G]) : P.push(G)));
        } else
          ((P = { lane: G, tag: y.tag, payload: y.payload, callback: y.callback, next: null }),
            $ === null ? ((q = $ = P), (O = te)) : ($ = $.next = P),
            (g |= G));
        if (((y = y.next), y === null)) {
          if (((y = s.shared.pending), y === null)) break;
          ((P = y),
            (y = P.next),
            (P.next = null),
            (s.lastBaseUpdate = P),
            (s.shared.pending = null));
        }
      } while (!0);
      ($ === null && (O = te),
        (s.baseState = O),
        (s.firstBaseUpdate = q),
        (s.lastBaseUpdate = $),
        f === null && (s.shared.lanes = 0),
        (Sn |= g),
        (e.lanes = g),
        (e.memoizedState = te));
    }
  }
  function n0(e, t) {
    if (typeof e != 'function') throw Error(l(191, e));
    e.call(t);
  }
  function a0(e, t) {
    var a = e.callbacks;
    if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) n0(a[e], t);
  }
  var Ha = x(null),
    Jl = x(0);
  function r0(e, t) {
    ((e = Wu), Z(Jl, e), Z(Ha, t), (Wu = e | t.baseLanes));
  }
  function ss() {
    (Z(Jl, Wu), Z(Ha, Ha.current));
  }
  function fs() {
    ((Wu = Jl.current), Y(Ha), Y(Jl));
  }
  var tu = x(null),
    Du = null;
  function An(e) {
    var t = e.alternate;
    (Z(Dt, Dt.current & 1),
      Z(tu, e),
      Du === null && (t === null || Ha.current !== null || t.memoizedState !== null) && (Du = e));
  }
  function cs(e) {
    (Z(Dt, Dt.current), Z(tu, e), Du === null && (Du = e));
  }
  function l0(e) {
    e.tag === 22 ? (Z(Dt, Dt.current), Z(tu, e), Du === null && (Du = e)) : Bn();
  }
  function Bn() {
    (Z(Dt, Dt.current), Z(tu, tu.current));
  }
  function uu(e) {
    (Y(tu), Du === e && (Du = null), Y(Dt));
  }
  var Dt = x(0);
  function Il(e) {
    for (var t = e; t !== null;) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && ((a = a.dehydrated), a === null || pf(a) || Cf(a))) return t;
      } else if (
        t.tag === 19 &&
        (t.memoizedProps.revealOrder === 'forwards' ||
          t.memoizedProps.revealOrder === 'backwards' ||
          t.memoizedProps.revealOrder === 'unstable_legacy-backwards' ||
          t.memoizedProps.revealOrder === 'together')
      ) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Yu = 0,
    Me = null,
    Je = null,
    mt = null,
    ei = !1,
    Ua = !1,
    na = !1,
    ti = 0,
    jr = 0,
    ka = null,
    up = 0;
  function dt() {
    throw Error(l(321));
  }
  function ds(e, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < e.length; a++) if (!It(e[a], t[a])) return !1;
    return !0;
  }
  function hs(e, t, a, i, s, f) {
    return (
      (Yu = f),
      (Me = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (L.H = e === null || e.memoizedState === null ? Y0 : Os),
      (na = !1),
      (f = a(i, s)),
      (na = !1),
      Ua && (f = o0(t, a, i, s)),
      i0(e),
      f
    );
  }
  function i0(e) {
    L.H = Lr;
    var t = Je !== null && Je.next !== null;
    if (((Yu = 0), (mt = Je = Me = null), (ei = !1), (jr = 0), (ka = null), t)) throw Error(l(300));
    e === null || pt || ((e = e.dependencies), e !== null && Pl(e) && (pt = !0));
  }
  function o0(e, t, a, i) {
    Me = e;
    var s = 0;
    do {
      if ((Ua && (ka = null), (jr = 0), (Ua = !1), 25 <= s)) throw Error(l(301));
      if (((s += 1), (mt = Je = null), e.updateQueue != null)) {
        var f = e.updateQueue;
        ((f.lastEffect = null),
          (f.events = null),
          (f.stores = null),
          f.memoCache != null && (f.memoCache.index = 0));
      }
      ((L.H = V0), (f = t(a, i)));
    } while (Ua);
    return f;
  }
  function np() {
    var e = L.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == 'function' ? Nr(t) : t),
      (e = e.useState()[0]),
      (Je !== null ? Je.memoizedState : null) !== e && (Me.flags |= 1024),
      t
    );
  }
  function Ds() {
    var e = ti !== 0;
    return ((ti = 0), e);
  }
  function vs(e, t, a) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~a));
  }
  function gs(e) {
    if (ei) {
      for (e = e.memoizedState; e !== null;) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      ei = !1;
    }
    ((Yu = 0), (mt = Je = Me = null), (Ua = !1), (jr = ti = 0), (ka = null));
  }
  function qt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (mt === null ? (Me.memoizedState = mt = e) : (mt = mt.next = e), mt);
  }
  function vt() {
    if (Je === null) {
      var e = Me.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Je.next;
    var t = mt === null ? Me.memoizedState : mt.next;
    if (t !== null) ((mt = t), (Je = e));
    else {
      if (e === null) throw Me.alternate === null ? Error(l(467)) : Error(l(310));
      ((Je = e),
        (e = {
          memoizedState: Je.memoizedState,
          baseState: Je.baseState,
          baseQueue: Je.baseQueue,
          queue: Je.queue,
          next: null,
        }),
        mt === null ? (Me.memoizedState = mt = e) : (mt = mt.next = e));
    }
    return mt;
  }
  function ui() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Nr(e) {
    var t = jr;
    return (
      (jr += 1),
      ka === null && (ka = []),
      (e = Jd(ka, e, t)),
      (t = Me),
      (mt === null ? t.memoizedState : mt.next) === null &&
        ((t = t.alternate), (L.H = t === null || t.memoizedState === null ? Y0 : Os)),
      e
    );
  }
  function ni(e) {
    if (e !== null && typeof e == 'object') {
      if (typeof e.then == 'function') return Nr(e);
      if (e.$$typeof === M) return Tt(e);
    }
    throw Error(l(438, String(e)));
  }
  function ms(e) {
    var t = null,
      a = Me.updateQueue;
    if ((a !== null && (t = a.memoCache), t == null)) {
      var i = Me.alternate;
      i !== null &&
        ((i = i.updateQueue),
        i !== null &&
          ((i = i.memoCache),
          i != null &&
            (t = {
              data: i.data.map(function (s) {
                return s.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      a === null && ((a = ui()), (Me.updateQueue = a)),
      (a.memoCache = t),
      (a = t.data[t.index]),
      a === void 0)
    )
      for (a = t.data[t.index] = Array(e), i = 0; i < e; i++) a[i] = he;
    return (t.index++, a);
  }
  function Vu(e, t) {
    return typeof t == 'function' ? t(e) : t;
  }
  function ai(e) {
    var t = vt();
    return ps(t, Je, e);
  }
  function ps(e, t, a) {
    var i = e.queue;
    if (i === null) throw Error(l(311));
    i.lastRenderedReducer = a;
    var s = e.baseQueue,
      f = i.pending;
    if (f !== null) {
      if (s !== null) {
        var g = s.next;
        ((s.next = f.next), (f.next = g));
      }
      ((t.baseQueue = s = f), (i.pending = null));
    }
    if (((f = e.baseState), s === null)) e.memoizedState = f;
    else {
      t = s.next;
      var y = (g = null),
        O = null,
        q = t,
        $ = !1;
      do {
        var te = q.lane & -536870913;
        if (te !== q.lane ? (Ue & te) === te : (Yu & te) === te) {
          var G = q.revertLane;
          if (G === 0)
            (O !== null &&
              (O = O.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: q.action,
                  hasEagerState: q.hasEagerState,
                  eagerState: q.eagerState,
                  next: null,
                }),
              te === ja && ($ = !0));
          else if ((Yu & G) === G) {
            ((q = q.next), G === ja && ($ = !0));
            continue;
          } else
            ((te = {
              lane: 0,
              revertLane: q.revertLane,
              gesture: null,
              action: q.action,
              hasEagerState: q.hasEagerState,
              eagerState: q.eagerState,
              next: null,
            }),
              O === null ? ((y = O = te), (g = f)) : (O = O.next = te),
              (Me.lanes |= G),
              (Sn |= G));
          ((te = q.action), na && a(f, te), (f = q.hasEagerState ? q.eagerState : a(f, te)));
        } else
          ((G = {
            lane: te,
            revertLane: q.revertLane,
            gesture: q.gesture,
            action: q.action,
            hasEagerState: q.hasEagerState,
            eagerState: q.eagerState,
            next: null,
          }),
            O === null ? ((y = O = G), (g = f)) : (O = O.next = G),
            (Me.lanes |= te),
            (Sn |= te));
        q = q.next;
      } while (q !== null && q !== t);
      if (
        (O === null ? (g = f) : (O.next = y),
        !It(f, e.memoizedState) && ((pt = !0), $ && ((a = Na), a !== null)))
      )
        throw a;
      ((e.memoizedState = f), (e.baseState = g), (e.baseQueue = O), (i.lastRenderedState = f));
    }
    return (s === null && (i.lanes = 0), [e.memoizedState, i.dispatch]);
  }
  function Cs(e) {
    var t = vt(),
      a = t.queue;
    if (a === null) throw Error(l(311));
    a.lastRenderedReducer = e;
    var i = a.dispatch,
      s = a.pending,
      f = t.memoizedState;
    if (s !== null) {
      a.pending = null;
      var g = (s = s.next);
      do ((f = e(f, g.action)), (g = g.next));
      while (g !== s);
      (It(f, t.memoizedState) || (pt = !0),
        (t.memoizedState = f),
        t.baseQueue === null && (t.baseState = f),
        (a.lastRenderedState = f));
    }
    return [f, i];
  }
  function s0(e, t, a) {
    var i = Me,
      s = vt(),
      f = qe;
    if (f) {
      if (a === void 0) throw Error(l(407));
      a = a();
    } else a = t();
    var g = !It((Je || s).memoizedState, a);
    if (
      (g && ((s.memoizedState = a), (pt = !0)),
      (s = s.queue),
      As(d0.bind(null, i, s, e), [e]),
      s.getSnapshot !== t || g || (mt !== null && mt.memoizedState.tag & 1))
    ) {
      if (
        ((i.flags |= 2048),
        qa(9, { destroy: void 0 }, c0.bind(null, i, s, a, t), null),
        tt === null)
      )
        throw Error(l(349));
      f || (Yu & 127) !== 0 || f0(i, t, a);
    }
    return a;
  }
  function f0(e, t, a) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: a }),
      (t = Me.updateQueue),
      t === null
        ? ((t = ui()), (Me.updateQueue = t), (t.stores = [e]))
        : ((a = t.stores), a === null ? (t.stores = [e]) : a.push(e)));
  }
  function c0(e, t, a, i) {
    ((t.value = a), (t.getSnapshot = i), h0(t) && D0(e));
  }
  function d0(e, t, a) {
    return a(function () {
      h0(t) && D0(e);
    });
  }
  function h0(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var a = t();
      return !It(e, a);
    } catch {
      return !0;
    }
  }
  function D0(e) {
    var t = Qn(e, 2);
    t !== null && Wt(t, e, 2);
  }
  function Es(e) {
    var t = qt();
    if (typeof e == 'function') {
      var a = e;
      if (((e = a()), na)) {
        Cu(!0);
        try {
          a();
        } finally {
          Cu(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vu,
        lastRenderedState: e,
      }),
      t
    );
  }
  function v0(e, t, a, i) {
    return ((e.baseState = a), ps(e, Je, typeof i == 'function' ? i : Vu));
  }
  function ap(e, t, a, i, s) {
    if (ii(e)) throw Error(l(485));
    if (((e = t.action), e !== null)) {
      var f = {
        payload: s,
        action: e,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (g) {
          f.listeners.push(g);
        },
      };
      (L.T !== null ? a(!0) : (f.isTransition = !1),
        i(f),
        (a = t.pending),
        a === null
          ? ((f.next = t.pending = f), g0(t, f))
          : ((f.next = a.next), (t.pending = a.next = f)));
    }
  }
  function g0(e, t) {
    var a = t.action,
      i = t.payload,
      s = e.state;
    if (t.isTransition) {
      var f = L.T,
        g = {};
      L.T = g;
      try {
        var y = a(s, i),
          O = L.S;
        (O !== null && O(g, y), m0(e, t, y));
      } catch (q) {
        ys(e, t, q);
      } finally {
        (f !== null && g.types !== null && (f.types = g.types), (L.T = f));
      }
    } else
      try {
        ((f = a(s, i)), m0(e, t, f));
      } catch (q) {
        ys(e, t, q);
      }
  }
  function m0(e, t, a) {
    a !== null && typeof a == 'object' && typeof a.then == 'function'
      ? a.then(
          function (i) {
            p0(e, t, i);
          },
          function (i) {
            return ys(e, t, i);
          },
        )
      : p0(e, t, a);
  }
  function p0(e, t, a) {
    ((t.status = 'fulfilled'),
      (t.value = a),
      C0(t),
      (e.state = a),
      (t = e.pending),
      t !== null &&
        ((a = t.next), a === t ? (e.pending = null) : ((a = a.next), (t.next = a), g0(e, a))));
  }
  function ys(e, t, a) {
    var i = e.pending;
    if (((e.pending = null), i !== null)) {
      i = i.next;
      do ((t.status = 'rejected'), (t.reason = a), C0(t), (t = t.next));
      while (t !== i);
    }
    e.action = null;
  }
  function C0(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function E0(e, t) {
    return t;
  }
  function y0(e, t) {
    if (qe) {
      var a = tt.formState;
      if (a !== null) {
        e: {
          var i = Me;
          if (qe) {
            if (nt) {
              t: {
                for (var s = nt, f = hu; s.nodeType !== 8;) {
                  if (!f) {
                    s = null;
                    break t;
                  }
                  if (((s = vu(s.nextSibling)), s === null)) {
                    s = null;
                    break t;
                  }
                }
                ((f = s.data), (s = f === 'F!' || f === 'F' ? s : null));
              }
              if (s) {
                ((nt = vu(s.nextSibling)), (i = s.data === 'F!'));
                break e;
              }
            }
            mn(i);
          }
          i = !1;
        }
        i && (t = a[0]);
      }
    }
    return (
      (a = qt()),
      (a.memoizedState = a.baseState = t),
      (i = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: E0,
        lastRenderedState: t,
      }),
      (a.queue = i),
      (a = q0.bind(null, Me, i)),
      (i.dispatch = a),
      (i = Es(!1)),
      (f = xs.bind(null, Me, !1, i.queue)),
      (i = qt()),
      (s = { state: t, dispatch: null, action: e, pending: null }),
      (i.queue = s),
      (a = ap.bind(null, Me, s, f, a)),
      (s.dispatch = a),
      (i.memoizedState = e),
      [t, a, !1]
    );
  }
  function A0(e) {
    var t = vt();
    return B0(t, Je, e);
  }
  function B0(e, t, a) {
    if (
      ((t = ps(e, t, E0)[0]),
      (e = ai(Vu)[0]),
      typeof t == 'object' && t !== null && typeof t.then == 'function')
    )
      try {
        var i = Nr(t);
      } catch (g) {
        throw g === za ? Ql : g;
      }
    else i = t;
    t = vt();
    var s = t.queue,
      f = s.dispatch;
    return (
      a !== t.memoizedState &&
        ((Me.flags |= 2048), qa(9, { destroy: void 0 }, rp.bind(null, s, a), null)),
      [i, f, e]
    );
  }
  function rp(e, t) {
    e.action = t;
  }
  function b0(e) {
    var t = vt(),
      a = Je;
    if (a !== null) return B0(t, a, e);
    (vt(), (t = t.memoizedState), (a = vt()));
    var i = a.queue.dispatch;
    return ((a.memoizedState = e), [t, i, !1]);
  }
  function qa(e, t, a, i) {
    return (
      (e = { tag: e, create: a, deps: i, inst: t, next: null }),
      (t = Me.updateQueue),
      t === null && ((t = ui()), (Me.updateQueue = t)),
      (a = t.lastEffect),
      a === null
        ? (t.lastEffect = e.next = e)
        : ((i = a.next), (a.next = e), (e.next = i), (t.lastEffect = e)),
      e
    );
  }
  function F0() {
    return vt().memoizedState;
  }
  function ri(e, t, a, i) {
    var s = qt();
    ((Me.flags |= e),
      (s.memoizedState = qa(1 | t, { destroy: void 0 }, a, i === void 0 ? null : i)));
  }
  function li(e, t, a, i) {
    var s = vt();
    i = i === void 0 ? null : i;
    var f = s.memoizedState.inst;
    Je !== null && i !== null && ds(i, Je.memoizedState.deps)
      ? (s.memoizedState = qa(t, f, a, i))
      : ((Me.flags |= e), (s.memoizedState = qa(1 | t, f, a, i)));
  }
  function S0(e, t) {
    ri(8390656, 8, e, t);
  }
  function As(e, t) {
    li(2048, 8, e, t);
  }
  function lp(e) {
    Me.flags |= 4;
    var t = Me.updateQueue;
    if (t === null) ((t = ui()), (Me.updateQueue = t), (t.events = [e]));
    else {
      var a = t.events;
      a === null ? (t.events = [e]) : a.push(e);
    }
  }
  function x0(e) {
    var t = vt().memoizedState;
    return (
      lp({ ref: t, nextImpl: e }),
      function () {
        if ((Pe & 2) !== 0) throw Error(l(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function O0(e, t) {
    return li(4, 2, e, t);
  }
  function w0(e, t) {
    return li(4, 4, e, t);
  }
  function T0(e, t) {
    if (typeof t == 'function') {
      e = e();
      var a = t(e);
      return function () {
        typeof a == 'function' ? a() : t(null);
      };
    }
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function R0(e, t, a) {
    ((a = a != null ? a.concat([e]) : null), li(4, 4, T0.bind(null, t, e), a));
  }
  function Bs() {}
  function M0(e, t) {
    var a = vt();
    t = t === void 0 ? null : t;
    var i = a.memoizedState;
    return t !== null && ds(t, i[1]) ? i[0] : ((a.memoizedState = [e, t]), e);
  }
  function j0(e, t) {
    var a = vt();
    t = t === void 0 ? null : t;
    var i = a.memoizedState;
    if (t !== null && ds(t, i[1])) return i[0];
    if (((i = e()), na)) {
      Cu(!0);
      try {
        e();
      } finally {
        Cu(!1);
      }
    }
    return ((a.memoizedState = [i, t]), i);
  }
  function bs(e, t, a) {
    return a === void 0 || ((Yu & 1073741824) !== 0 && (Ue & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = a), (e = Nh()), (Me.lanes |= e), (Sn |= e), a);
  }
  function N0(e, t, a, i) {
    return It(a, t)
      ? a
      : Ha.current !== null
        ? ((e = bs(e, a, i)), It(e, t) || (pt = !0), e)
        : (Yu & 42) === 0 || ((Yu & 1073741824) !== 0 && (Ue & 261930) === 0)
          ? ((pt = !0), (e.memoizedState = a))
          : ((e = Nh()), (Me.lanes |= e), (Sn |= e), t);
  }
  function z0(e, t, a, i, s) {
    var f = V.p;
    V.p = f !== 0 && 8 > f ? f : 8;
    var g = L.T,
      y = {};
    ((L.T = y), xs(e, !1, t, a));
    try {
      var O = s(),
        q = L.S;
      if (
        (q !== null && q(y, O), O !== null && typeof O == 'object' && typeof O.then == 'function')
      ) {
        var $ = tp(O, i);
        zr(e, t, $, ru(e));
      } else zr(e, t, i, ru(e));
    } catch (te) {
      zr(e, t, { then: function () {}, status: 'rejected', reason: te }, ru());
    } finally {
      ((V.p = f), g !== null && y.types !== null && (g.types = y.types), (L.T = g));
    }
  }
  function ip() {}
  function Fs(e, t, a, i) {
    if (e.tag !== 5) throw Error(l(476));
    var s = L0(e).queue;
    z0(
      e,
      s,
      t,
      De,
      a === null
        ? ip
        : function () {
            return (H0(e), a(i));
          },
    );
  }
  function L0(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: De,
      baseState: De,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vu,
        lastRenderedState: De,
      },
      next: null,
    };
    var a = {};
    return (
      (t.next = {
        memoizedState: a,
        baseState: a,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Vu,
          lastRenderedState: a,
        },
        next: null,
      }),
      (e.memoizedState = t),
      (e = e.alternate),
      e !== null && (e.memoizedState = t),
      t
    );
  }
  function H0(e) {
    var t = L0(e);
    (t.next === null && (t = e.alternate.memoizedState), zr(e, t.next.queue, {}, ru()));
  }
  function Ss() {
    return Tt(Jr);
  }
  function U0() {
    return vt().memoizedState;
  }
  function k0() {
    return vt().memoizedState;
  }
  function op(e) {
    for (var t = e.return; t !== null;) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = ru();
          e = En(a);
          var i = yn(t, e, a);
          (i !== null && (Wt(i, t, a), Tr(i, t, a)), (t = { cache: ts() }), (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function sp(e, t, a) {
    var i = ru();
    ((a = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      ii(e) ? _0(t, a) : ((a = Vo(e, t, a, i)), a !== null && (Wt(a, e, i), G0(a, t, i))));
  }
  function q0(e, t, a) {
    var i = ru();
    zr(e, t, a, i);
  }
  function zr(e, t, a, i) {
    var s = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (ii(e)) _0(t, s);
    else {
      var f = e.alternate;
      if (
        e.lanes === 0 &&
        (f === null || f.lanes === 0) &&
        ((f = t.lastRenderedReducer), f !== null)
      )
        try {
          var g = t.lastRenderedState,
            y = f(g, a);
          if (((s.hasEagerState = !0), (s.eagerState = y), It(y, g)))
            return (_l(e, t, s, 0), tt === null && ql(), !1);
        } catch {
        } finally {
        }
      if (((a = Vo(e, t, s, i)), a !== null)) return (Wt(a, e, i), G0(a, t, i), !0);
    }
    return !1;
  }
  function xs(e, t, a, i) {
    if (
      ((i = {
        lane: 2,
        revertLane: rf(),
        gesture: null,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      ii(e))
    ) {
      if (t) throw Error(l(479));
    } else ((t = Vo(e, a, i, 2)), t !== null && Wt(t, e, 2));
  }
  function ii(e) {
    var t = e.alternate;
    return e === Me || (t !== null && t === Me);
  }
  function _0(e, t) {
    Ua = ei = !0;
    var a = e.pending;
    (a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)), (e.pending = t));
  }
  function G0(e, t, a) {
    if ((a & 4194048) !== 0) {
      var i = t.lanes;
      ((i &= e.pendingLanes), (a |= i), (t.lanes = a), Xc(e, a));
    }
  }
  var Lr = {
    readContext: Tt,
    use: ni,
    useCallback: dt,
    useContext: dt,
    useEffect: dt,
    useImperativeHandle: dt,
    useLayoutEffect: dt,
    useInsertionEffect: dt,
    useMemo: dt,
    useReducer: dt,
    useRef: dt,
    useState: dt,
    useDebugValue: dt,
    useDeferredValue: dt,
    useTransition: dt,
    useSyncExternalStore: dt,
    useId: dt,
    useHostTransitionStatus: dt,
    useFormState: dt,
    useActionState: dt,
    useOptimistic: dt,
    useMemoCache: dt,
    useCacheRefresh: dt,
  };
  Lr.useEffectEvent = dt;
  var Y0 = {
      readContext: Tt,
      use: ni,
      useCallback: function (e, t) {
        return ((qt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: Tt,
      useEffect: S0,
      useImperativeHandle: function (e, t, a) {
        ((a = a != null ? a.concat([e]) : null), ri(4194308, 4, T0.bind(null, t, e), a));
      },
      useLayoutEffect: function (e, t) {
        return ri(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        ri(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var a = qt();
        t = t === void 0 ? null : t;
        var i = e();
        if (na) {
          Cu(!0);
          try {
            e();
          } finally {
            Cu(!1);
          }
        }
        return ((a.memoizedState = [i, t]), i);
      },
      useReducer: function (e, t, a) {
        var i = qt();
        if (a !== void 0) {
          var s = a(t);
          if (na) {
            Cu(!0);
            try {
              a(t);
            } finally {
              Cu(!1);
            }
          }
        } else s = t;
        return (
          (i.memoizedState = i.baseState = s),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: s,
          }),
          (i.queue = e),
          (e = e.dispatch = sp.bind(null, Me, e)),
          [i.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = qt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = Es(e);
        var t = e.queue,
          a = q0.bind(null, Me, t);
        return ((t.dispatch = a), [e.memoizedState, a]);
      },
      useDebugValue: Bs,
      useDeferredValue: function (e, t) {
        var a = qt();
        return bs(a, e, t);
      },
      useTransition: function () {
        var e = Es(!1);
        return ((e = z0.bind(null, Me, e.queue, !0, !1)), (qt().memoizedState = e), [!1, e]);
      },
      useSyncExternalStore: function (e, t, a) {
        var i = Me,
          s = qt();
        if (qe) {
          if (a === void 0) throw Error(l(407));
          a = a();
        } else {
          if (((a = t()), tt === null)) throw Error(l(349));
          (Ue & 127) !== 0 || f0(i, t, a);
        }
        s.memoizedState = a;
        var f = { value: a, getSnapshot: t };
        return (
          (s.queue = f),
          S0(d0.bind(null, i, f, e), [e]),
          (i.flags |= 2048),
          qa(9, { destroy: void 0 }, c0.bind(null, i, f, a, t), null),
          a
        );
      },
      useId: function () {
        var e = qt(),
          t = tt.identifierPrefix;
        if (qe) {
          var a = Ou,
            i = xu;
          ((a = (i & ~(1 << (32 - kt(i) - 1))).toString(32) + a),
            (t = '_' + t + 'R_' + a),
            (a = ti++),
            0 < a && (t += 'H' + a.toString(32)),
            (t += '_'));
        } else ((a = up++), (t = '_' + t + 'r_' + a.toString(32) + '_'));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: Ss,
      useFormState: y0,
      useActionState: y0,
      useOptimistic: function (e) {
        var t = qt();
        t.memoizedState = t.baseState = e;
        var a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return ((t.queue = a), (t = xs.bind(null, Me, !0, a)), (a.dispatch = t), [e, t]);
      },
      useMemoCache: ms,
      useCacheRefresh: function () {
        return (qt().memoizedState = op.bind(null, Me));
      },
      useEffectEvent: function (e) {
        var t = qt(),
          a = { impl: e };
        return (
          (t.memoizedState = a),
          function () {
            if ((Pe & 2) !== 0) throw Error(l(440));
            return a.impl.apply(void 0, arguments);
          }
        );
      },
    },
    Os = {
      readContext: Tt,
      use: ni,
      useCallback: M0,
      useContext: Tt,
      useEffect: As,
      useImperativeHandle: R0,
      useInsertionEffect: O0,
      useLayoutEffect: w0,
      useMemo: j0,
      useReducer: ai,
      useRef: F0,
      useState: function () {
        return ai(Vu);
      },
      useDebugValue: Bs,
      useDeferredValue: function (e, t) {
        var a = vt();
        return N0(a, Je.memoizedState, e, t);
      },
      useTransition: function () {
        var e = ai(Vu)[0],
          t = vt().memoizedState;
        return [typeof e == 'boolean' ? e : Nr(e), t];
      },
      useSyncExternalStore: s0,
      useId: U0,
      useHostTransitionStatus: Ss,
      useFormState: A0,
      useActionState: A0,
      useOptimistic: function (e, t) {
        var a = vt();
        return v0(a, Je, e, t);
      },
      useMemoCache: ms,
      useCacheRefresh: k0,
    };
  Os.useEffectEvent = x0;
  var V0 = {
    readContext: Tt,
    use: ni,
    useCallback: M0,
    useContext: Tt,
    useEffect: As,
    useImperativeHandle: R0,
    useInsertionEffect: O0,
    useLayoutEffect: w0,
    useMemo: j0,
    useReducer: Cs,
    useRef: F0,
    useState: function () {
      return Cs(Vu);
    },
    useDebugValue: Bs,
    useDeferredValue: function (e, t) {
      var a = vt();
      return Je === null ? bs(a, e, t) : N0(a, Je.memoizedState, e, t);
    },
    useTransition: function () {
      var e = Cs(Vu)[0],
        t = vt().memoizedState;
      return [typeof e == 'boolean' ? e : Nr(e), t];
    },
    useSyncExternalStore: s0,
    useId: U0,
    useHostTransitionStatus: Ss,
    useFormState: b0,
    useActionState: b0,
    useOptimistic: function (e, t) {
      var a = vt();
      return Je !== null ? v0(a, Je, e, t) : ((a.baseState = e), [e, a.queue.dispatch]);
    },
    useMemoCache: ms,
    useCacheRefresh: k0,
  };
  V0.useEffectEvent = x0;
  function ws(e, t, a, i) {
    ((t = e.memoizedState),
      (a = a(i, t)),
      (a = a == null ? t : C({}, t, a)),
      (e.memoizedState = a),
      e.lanes === 0 && (e.updateQueue.baseState = a));
  }
  var Ts = {
    enqueueSetState: function (e, t, a) {
      e = e._reactInternals;
      var i = ru(),
        s = En(i);
      ((s.payload = t),
        a != null && (s.callback = a),
        (t = yn(e, s, i)),
        t !== null && (Wt(t, e, i), Tr(t, e, i)));
    },
    enqueueReplaceState: function (e, t, a) {
      e = e._reactInternals;
      var i = ru(),
        s = En(i);
      ((s.tag = 1),
        (s.payload = t),
        a != null && (s.callback = a),
        (t = yn(e, s, i)),
        t !== null && (Wt(t, e, i), Tr(t, e, i)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var a = ru(),
        i = En(a);
      ((i.tag = 2),
        t != null && (i.callback = t),
        (t = yn(e, i, a)),
        t !== null && (Wt(t, e, a), Tr(t, e, a)));
    },
  };
  function P0(e, t, a, i, s, f, g) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == 'function'
        ? e.shouldComponentUpdate(i, f, g)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Ar(a, i) || !Ar(s, f)
          : !0
    );
  }
  function K0(e, t, a, i) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(a, i),
      typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
        t.UNSAFE_componentWillReceiveProps(a, i),
      t.state !== e && Ts.enqueueReplaceState(t, t.state, null));
  }
  function aa(e, t) {
    var a = t;
    if ('ref' in t) {
      a = {};
      for (var i in t) i !== 'ref' && (a[i] = t[i]);
    }
    if ((e = e.defaultProps)) {
      a === t && (a = C({}, a));
      for (var s in e) a[s] === void 0 && (a[s] = e[s]);
    }
    return a;
  }
  function X0(e) {
    kl(e);
  }
  function Q0(e) {
    console.error(e);
  }
  function Z0(e) {
    kl(e);
  }
  function oi(e, t) {
    try {
      var a = e.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (i) {
      setTimeout(function () {
        throw i;
      });
    }
  }
  function $0(e, t, a) {
    try {
      var i = e.onCaughtError;
      i(a.value, { componentStack: a.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (s) {
      setTimeout(function () {
        throw s;
      });
    }
  }
  function Rs(e, t, a) {
    return (
      (a = En(a)),
      (a.tag = 3),
      (a.payload = { element: null }),
      (a.callback = function () {
        oi(e, t);
      }),
      a
    );
  }
  function W0(e) {
    return ((e = En(e)), (e.tag = 3), e);
  }
  function J0(e, t, a, i) {
    var s = a.type.getDerivedStateFromError;
    if (typeof s == 'function') {
      var f = i.value;
      ((e.payload = function () {
        return s(f);
      }),
        (e.callback = function () {
          $0(t, a, i);
        }));
    }
    var g = a.stateNode;
    g !== null &&
      typeof g.componentDidCatch == 'function' &&
      (e.callback = function () {
        ($0(t, a, i),
          typeof s != 'function' && (xn === null ? (xn = new Set([this])) : xn.add(this)));
        var y = i.stack;
        this.componentDidCatch(i.value, { componentStack: y !== null ? y : '' });
      });
  }
  function fp(e, t, a, i, s) {
    if (((a.flags |= 32768), i !== null && typeof i == 'object' && typeof i.then == 'function')) {
      if (((t = a.alternate), t !== null && Ma(t, a, s, !0), (a = tu.current), a !== null)) {
        switch (a.tag) {
          case 31:
          case 13:
            return (
              Du === null ? Ei() : a.alternate === null && ht === 0 && (ht = 3),
              (a.flags &= -257),
              (a.flags |= 65536),
              (a.lanes = s),
              i === Zl
                ? (a.flags |= 16384)
                : ((t = a.updateQueue),
                  t === null ? (a.updateQueue = new Set([i])) : t.add(i),
                  uf(e, i, s)),
              !1
            );
          case 22:
            return (
              (a.flags |= 65536),
              i === Zl
                ? (a.flags |= 16384)
                : ((t = a.updateQueue),
                  t === null
                    ? ((t = { transitions: null, markerInstances: null, retryQueue: new Set([i]) }),
                      (a.updateQueue = t))
                    : ((a = t.retryQueue), a === null ? (t.retryQueue = new Set([i])) : a.add(i)),
                  uf(e, i, s)),
              !1
            );
        }
        throw Error(l(435, a.tag));
      }
      return (uf(e, i, s), Ei(), !1);
    }
    if (qe)
      return (
        (t = tu.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = s),
            i !== $o && ((e = Error(l(422), { cause: i })), Fr(fu(e, a))))
          : (i !== $o && ((t = Error(l(423), { cause: i })), Fr(fu(t, a))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (s &= -s),
            (e.lanes |= s),
            (i = fu(i, a)),
            (s = Rs(e.stateNode, i, s)),
            is(e, s),
            ht !== 4 && (ht = 2)),
        !1
      );
    var f = Error(l(520), { cause: i });
    if (((f = fu(f, a)), Vr === null ? (Vr = [f]) : Vr.push(f), ht !== 4 && (ht = 2), t === null))
      return !0;
    ((i = fu(i, a)), (a = t));
    do {
      switch (a.tag) {
        case 3:
          return (
            (a.flags |= 65536),
            (e = s & -s),
            (a.lanes |= e),
            (e = Rs(a.stateNode, i, e)),
            is(a, e),
            !1
          );
        case 1:
          if (
            ((t = a.type),
            (f = a.stateNode),
            (a.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == 'function' ||
                (f !== null &&
                  typeof f.componentDidCatch == 'function' &&
                  (xn === null || !xn.has(f)))))
          )
            return (
              (a.flags |= 65536),
              (s &= -s),
              (a.lanes |= s),
              (s = W0(s)),
              J0(s, e, a, i),
              is(a, s),
              !1
            );
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var Ms = Error(l(461)),
    pt = !1;
  function Rt(e, t, a, i) {
    t.child = e === null ? u0(t, null, a, i) : ua(t, e.child, a, i);
  }
  function I0(e, t, a, i, s) {
    a = a.render;
    var f = t.ref;
    if ('ref' in i) {
      var g = {};
      for (var y in i) y !== 'ref' && (g[y] = i[y]);
    } else g = i;
    return (
      Jn(t),
      (i = hs(e, t, a, g, f, s)),
      (y = Ds()),
      e !== null && !pt
        ? (vs(e, t, s), Pu(e, t, s))
        : (qe && y && Qo(t), (t.flags |= 1), Rt(e, t, i, s), t.child)
    );
  }
  function eh(e, t, a, i, s) {
    if (e === null) {
      var f = a.type;
      return typeof f == 'function' && !Po(f) && f.defaultProps === void 0 && a.compare === null
        ? ((t.tag = 15), (t.type = f), th(e, t, f, i, s))
        : ((e = Yl(a.type, null, i, t, t.mode, s)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((f = e.child), !qs(e, s))) {
      var g = f.memoizedProps;
      if (((a = a.compare), (a = a !== null ? a : Ar), a(g, i) && e.ref === t.ref))
        return Pu(e, t, s);
    }
    return ((t.flags |= 1), (e = ku(f, i)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function th(e, t, a, i, s) {
    if (e !== null) {
      var f = e.memoizedProps;
      if (Ar(f, i) && e.ref === t.ref)
        if (((pt = !1), (t.pendingProps = i = f), qs(e, s))) (e.flags & 131072) !== 0 && (pt = !0);
        else return ((t.lanes = e.lanes), Pu(e, t, s));
    }
    return js(e, t, a, i, s);
  }
  function uh(e, t, a, i) {
    var s = i.children,
      f = e !== null ? e.memoizedState : null;
    if (
      (e === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      i.mode === 'hidden')
    ) {
      if ((t.flags & 128) !== 0) {
        if (((f = f !== null ? f.baseLanes | a : a), e !== null)) {
          for (i = t.child = e.child, s = 0; i !== null;)
            ((s = s | i.lanes | i.childLanes), (i = i.sibling));
          i = s & ~f;
        } else ((i = 0), (t.child = null));
        return nh(e, t, f, a, i);
      }
      if ((a & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && Xl(t, f !== null ? f.cachePool : null),
          f !== null ? r0(t, f) : ss(),
          l0(t));
      else return ((i = t.lanes = 536870912), nh(e, t, f !== null ? f.baseLanes | a : a, a, i));
    } else
      f !== null
        ? (Xl(t, f.cachePool), r0(t, f), Bn(), (t.memoizedState = null))
        : (e !== null && Xl(t, null), ss(), Bn());
    return (Rt(e, t, s, a), t.child);
  }
  function Hr(e, t) {
    return (
      (e !== null && e.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function nh(e, t, a, i, s) {
    var f = ns();
    return (
      (f = f === null ? null : { parent: gt._currentValue, pool: f }),
      (t.memoizedState = { baseLanes: a, cachePool: f }),
      e !== null && Xl(t, null),
      ss(),
      l0(t),
      e !== null && Ma(e, t, i, !0),
      (t.childLanes = s),
      null
    );
  }
  function si(e, t) {
    return (
      (t = ci({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function ah(e, t, a) {
    return (
      ua(t, e.child, null, a),
      (e = si(t, t.pendingProps)),
      (e.flags |= 2),
      uu(t),
      (t.memoizedState = null),
      e
    );
  }
  function cp(e, t, a) {
    var i = t.pendingProps,
      s = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (qe) {
        if (i.mode === 'hidden') return ((e = si(t, i)), (t.lanes = 536870912), Hr(null, e));
        if (
          (cs(t),
          (e = nt)
            ? ((e = gD(e, hu)),
              (e = e !== null && e.data === '&' ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: vn !== null ? { id: xu, overflow: Ou } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (a = _d(e)),
                (a.return = t),
                (t.child = a),
                (wt = t),
                (nt = null)))
            : (e = null),
          e === null)
        )
          throw mn(t);
        return ((t.lanes = 536870912), null);
      }
      return si(t, i);
    }
    var f = e.memoizedState;
    if (f !== null) {
      var g = f.dehydrated;
      if ((cs(t), s))
        if (t.flags & 256) ((t.flags &= -257), (t = ah(e, t, a)));
        else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(l(558));
      else if ((pt || Ma(e, t, a, !1), (s = (a & e.childLanes) !== 0), pt || s)) {
        if (((i = tt), i !== null && ((g = Qc(i, a)), g !== 0 && g !== f.retryLane)))
          throw ((f.retryLane = g), Qn(e, g), Wt(i, e, g), Ms);
        (Ei(), (t = ah(e, t, a)));
      } else
        ((e = f.treeContext),
          (nt = vu(g.nextSibling)),
          (wt = t),
          (qe = !0),
          (gn = null),
          (hu = !1),
          e !== null && Vd(t, e),
          (t = si(t, i)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (e = ku(e.child, { mode: i.mode, children: i.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function fi(e, t) {
    var a = t.ref;
    if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != 'function' && typeof a != 'object') throw Error(l(284));
      (e === null || e.ref !== a) && (t.flags |= 4194816);
    }
  }
  function js(e, t, a, i, s) {
    return (
      Jn(t),
      (a = hs(e, t, a, i, void 0, s)),
      (i = Ds()),
      e !== null && !pt
        ? (vs(e, t, s), Pu(e, t, s))
        : (qe && i && Qo(t), (t.flags |= 1), Rt(e, t, a, s), t.child)
    );
  }
  function rh(e, t, a, i, s, f) {
    return (
      Jn(t),
      (t.updateQueue = null),
      (a = o0(t, i, a, s)),
      i0(e),
      (i = Ds()),
      e !== null && !pt
        ? (vs(e, t, f), Pu(e, t, f))
        : (qe && i && Qo(t), (t.flags |= 1), Rt(e, t, a, f), t.child)
    );
  }
  function lh(e, t, a, i, s) {
    if ((Jn(t), t.stateNode === null)) {
      var f = Oa,
        g = a.contextType;
      (typeof g == 'object' && g !== null && (f = Tt(g)),
        (f = new a(i, f)),
        (t.memoizedState = f.state !== null && f.state !== void 0 ? f.state : null),
        (f.updater = Ts),
        (t.stateNode = f),
        (f._reactInternals = t),
        (f = t.stateNode),
        (f.props = i),
        (f.state = t.memoizedState),
        (f.refs = {}),
        rs(t),
        (g = a.contextType),
        (f.context = typeof g == 'object' && g !== null ? Tt(g) : Oa),
        (f.state = t.memoizedState),
        (g = a.getDerivedStateFromProps),
        typeof g == 'function' && (ws(t, a, g, i), (f.state = t.memoizedState)),
        typeof a.getDerivedStateFromProps == 'function' ||
          typeof f.getSnapshotBeforeUpdate == 'function' ||
          (typeof f.UNSAFE_componentWillMount != 'function' &&
            typeof f.componentWillMount != 'function') ||
          ((g = f.state),
          typeof f.componentWillMount == 'function' && f.componentWillMount(),
          typeof f.UNSAFE_componentWillMount == 'function' && f.UNSAFE_componentWillMount(),
          g !== f.state && Ts.enqueueReplaceState(f, f.state, null),
          Mr(t, i, f, s),
          Rr(),
          (f.state = t.memoizedState)),
        typeof f.componentDidMount == 'function' && (t.flags |= 4194308),
        (i = !0));
    } else if (e === null) {
      f = t.stateNode;
      var y = t.memoizedProps,
        O = aa(a, y);
      f.props = O;
      var q = f.context,
        $ = a.contextType;
      ((g = Oa), typeof $ == 'object' && $ !== null && (g = Tt($)));
      var te = a.getDerivedStateFromProps;
      (($ = typeof te == 'function' || typeof f.getSnapshotBeforeUpdate == 'function'),
        (y = t.pendingProps !== y),
        $ ||
          (typeof f.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof f.componentWillReceiveProps != 'function') ||
          ((y || q !== g) && K0(t, f, i, g)),
        (Cn = !1));
      var G = t.memoizedState;
      ((f.state = G),
        Mr(t, i, f, s),
        Rr(),
        (q = t.memoizedState),
        y || G !== q || Cn
          ? (typeof te == 'function' && (ws(t, a, te, i), (q = t.memoizedState)),
            (O = Cn || P0(t, a, O, i, G, q, g))
              ? ($ ||
                  (typeof f.UNSAFE_componentWillMount != 'function' &&
                    typeof f.componentWillMount != 'function') ||
                  (typeof f.componentWillMount == 'function' && f.componentWillMount(),
                  typeof f.UNSAFE_componentWillMount == 'function' &&
                    f.UNSAFE_componentWillMount()),
                typeof f.componentDidMount == 'function' && (t.flags |= 4194308))
              : (typeof f.componentDidMount == 'function' && (t.flags |= 4194308),
                (t.memoizedProps = i),
                (t.memoizedState = q)),
            (f.props = i),
            (f.state = q),
            (f.context = g),
            (i = O))
          : (typeof f.componentDidMount == 'function' && (t.flags |= 4194308), (i = !1)));
    } else {
      ((f = t.stateNode),
        ls(e, t),
        (g = t.memoizedProps),
        ($ = aa(a, g)),
        (f.props = $),
        (te = t.pendingProps),
        (G = f.context),
        (q = a.contextType),
        (O = Oa),
        typeof q == 'object' && q !== null && (O = Tt(q)),
        (y = a.getDerivedStateFromProps),
        (q = typeof y == 'function' || typeof f.getSnapshotBeforeUpdate == 'function') ||
          (typeof f.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof f.componentWillReceiveProps != 'function') ||
          ((g !== te || G !== O) && K0(t, f, i, O)),
        (Cn = !1),
        (G = t.memoizedState),
        (f.state = G),
        Mr(t, i, f, s),
        Rr());
      var P = t.memoizedState;
      g !== te || G !== P || Cn || (e !== null && e.dependencies !== null && Pl(e.dependencies))
        ? (typeof y == 'function' && (ws(t, a, y, i), (P = t.memoizedState)),
          ($ =
            Cn ||
            P0(t, a, $, i, G, P, O) ||
            (e !== null && e.dependencies !== null && Pl(e.dependencies)))
            ? (q ||
                (typeof f.UNSAFE_componentWillUpdate != 'function' &&
                  typeof f.componentWillUpdate != 'function') ||
                (typeof f.componentWillUpdate == 'function' && f.componentWillUpdate(i, P, O),
                typeof f.UNSAFE_componentWillUpdate == 'function' &&
                  f.UNSAFE_componentWillUpdate(i, P, O)),
              typeof f.componentDidUpdate == 'function' && (t.flags |= 4),
              typeof f.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
            : (typeof f.componentDidUpdate != 'function' ||
                (g === e.memoizedProps && G === e.memoizedState) ||
                (t.flags |= 4),
              typeof f.getSnapshotBeforeUpdate != 'function' ||
                (g === e.memoizedProps && G === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = i),
              (t.memoizedState = P)),
          (f.props = i),
          (f.state = P),
          (f.context = O),
          (i = $))
        : (typeof f.componentDidUpdate != 'function' ||
            (g === e.memoizedProps && G === e.memoizedState) ||
            (t.flags |= 4),
          typeof f.getSnapshotBeforeUpdate != 'function' ||
            (g === e.memoizedProps && G === e.memoizedState) ||
            (t.flags |= 1024),
          (i = !1));
    }
    return (
      (f = i),
      fi(e, t),
      (i = (t.flags & 128) !== 0),
      f || i
        ? ((f = t.stateNode),
          (a = i && typeof a.getDerivedStateFromError != 'function' ? null : f.render()),
          (t.flags |= 1),
          e !== null && i
            ? ((t.child = ua(t, e.child, null, s)), (t.child = ua(t, null, a, s)))
            : Rt(e, t, a, s),
          (t.memoizedState = f.state),
          (e = t.child))
        : (e = Pu(e, t, s)),
      e
    );
  }
  function ih(e, t, a, i) {
    return ($n(), (t.flags |= 256), Rt(e, t, a, i), t.child);
  }
  var Ns = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function zs(e) {
    return { baseLanes: e, cachePool: $d() };
  }
  function Ls(e, t, a) {
    return ((e = e !== null ? e.childLanes & ~a : 0), t && (e |= au), e);
  }
  function oh(e, t, a) {
    var i = t.pendingProps,
      s = !1,
      f = (t.flags & 128) !== 0,
      g;
    if (
      ((g = f) || (g = e !== null && e.memoizedState === null ? !1 : (Dt.current & 2) !== 0),
      g && ((s = !0), (t.flags &= -129)),
      (g = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (qe) {
        if (
          (s ? An(t) : Bn(),
          (e = nt)
            ? ((e = gD(e, hu)),
              (e = e !== null && e.data !== '&' ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: vn !== null ? { id: xu, overflow: Ou } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (a = _d(e)),
                (a.return = t),
                (t.child = a),
                (wt = t),
                (nt = null)))
            : (e = null),
          e === null)
        )
          throw mn(t);
        return (Cf(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var y = i.children;
      return (
        (i = i.fallback),
        s
          ? (Bn(),
            (s = t.mode),
            (y = ci({ mode: 'hidden', children: y }, s)),
            (i = Zn(i, s, a, null)),
            (y.return = t),
            (i.return = t),
            (y.sibling = i),
            (t.child = y),
            (i = t.child),
            (i.memoizedState = zs(a)),
            (i.childLanes = Ls(e, g, a)),
            (t.memoizedState = Ns),
            Hr(null, i))
          : (An(t), Hs(t, y))
      );
    }
    var O = e.memoizedState;
    if (O !== null && ((y = O.dehydrated), y !== null)) {
      if (f)
        t.flags & 256
          ? (An(t), (t.flags &= -257), (t = Us(e, t, a)))
          : t.memoizedState !== null
            ? (Bn(), (t.child = e.child), (t.flags |= 128), (t = null))
            : (Bn(),
              (y = i.fallback),
              (s = t.mode),
              (i = ci({ mode: 'visible', children: i.children }, s)),
              (y = Zn(y, s, a, null)),
              (y.flags |= 2),
              (i.return = t),
              (y.return = t),
              (i.sibling = y),
              (t.child = i),
              ua(t, e.child, null, a),
              (i = t.child),
              (i.memoizedState = zs(a)),
              (i.childLanes = Ls(e, g, a)),
              (t.memoizedState = Ns),
              (t = Hr(null, i)));
      else if ((An(t), Cf(y))) {
        if (((g = y.nextSibling && y.nextSibling.dataset), g)) var q = g.dgst;
        ((g = q),
          (i = Error(l(419))),
          (i.stack = ''),
          (i.digest = g),
          Fr({ value: i, source: null, stack: null }),
          (t = Us(e, t, a)));
      } else if ((pt || Ma(e, t, a, !1), (g = (a & e.childLanes) !== 0), pt || g)) {
        if (((g = tt), g !== null && ((i = Qc(g, a)), i !== 0 && i !== O.retryLane)))
          throw ((O.retryLane = i), Qn(e, i), Wt(g, e, i), Ms);
        (pf(y) || Ei(), (t = Us(e, t, a)));
      } else
        pf(y)
          ? ((t.flags |= 192), (t.child = e.child), (t = null))
          : ((e = O.treeContext),
            (nt = vu(y.nextSibling)),
            (wt = t),
            (qe = !0),
            (gn = null),
            (hu = !1),
            e !== null && Vd(t, e),
            (t = Hs(t, i.children)),
            (t.flags |= 4096));
      return t;
    }
    return s
      ? (Bn(),
        (y = i.fallback),
        (s = t.mode),
        (O = e.child),
        (q = O.sibling),
        (i = ku(O, { mode: 'hidden', children: i.children })),
        (i.subtreeFlags = O.subtreeFlags & 65011712),
        q !== null ? (y = ku(q, y)) : ((y = Zn(y, s, a, null)), (y.flags |= 2)),
        (y.return = t),
        (i.return = t),
        (i.sibling = y),
        (t.child = i),
        Hr(null, i),
        (i = t.child),
        (y = e.child.memoizedState),
        y === null
          ? (y = zs(a))
          : ((s = y.cachePool),
            s !== null
              ? ((O = gt._currentValue), (s = s.parent !== O ? { parent: O, pool: O } : s))
              : (s = $d()),
            (y = { baseLanes: y.baseLanes | a, cachePool: s })),
        (i.memoizedState = y),
        (i.childLanes = Ls(e, g, a)),
        (t.memoizedState = Ns),
        Hr(e.child, i))
      : (An(t),
        (a = e.child),
        (e = a.sibling),
        (a = ku(a, { mode: 'visible', children: i.children })),
        (a.return = t),
        (a.sibling = null),
        e !== null &&
          ((g = t.deletions), g === null ? ((t.deletions = [e]), (t.flags |= 16)) : g.push(e)),
        (t.child = a),
        (t.memoizedState = null),
        a);
  }
  function Hs(e, t) {
    return ((t = ci({ mode: 'visible', children: t }, e.mode)), (t.return = e), (e.child = t));
  }
  function ci(e, t) {
    return ((e = eu(22, e, null, t)), (e.lanes = 0), e);
  }
  function Us(e, t, a) {
    return (
      ua(t, e.child, null, a),
      (e = Hs(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function sh(e, t, a) {
    e.lanes |= t;
    var i = e.alternate;
    (i !== null && (i.lanes |= t), Io(e.return, t, a));
  }
  function ks(e, t, a, i, s, f) {
    var g = e.memoizedState;
    g === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: i,
          tail: a,
          tailMode: s,
          treeForkCount: f,
        })
      : ((g.isBackwards = t),
        (g.rendering = null),
        (g.renderingStartTime = 0),
        (g.last = i),
        (g.tail = a),
        (g.tailMode = s),
        (g.treeForkCount = f));
  }
  function fh(e, t, a) {
    var i = t.pendingProps,
      s = i.revealOrder,
      f = i.tail;
    i = i.children;
    var g = Dt.current,
      y = (g & 2) !== 0;
    if (
      (y ? ((g = (g & 1) | 2), (t.flags |= 128)) : (g &= 1),
      Z(Dt, g),
      Rt(e, t, i, a),
      (i = qe ? br : 0),
      !y && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) e.memoizedState !== null && sh(e, a, t);
        else if (e.tag === 19) sh(e, a, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    switch (s) {
      case 'forwards':
        for (a = t.child, s = null; a !== null;)
          ((e = a.alternate), e !== null && Il(e) === null && (s = a), (a = a.sibling));
        ((a = s),
          a === null ? ((s = t.child), (t.child = null)) : ((s = a.sibling), (a.sibling = null)),
          ks(t, !1, s, a, f, i));
        break;
      case 'backwards':
      case 'unstable_legacy-backwards':
        for (a = null, s = t.child, t.child = null; s !== null;) {
          if (((e = s.alternate), e !== null && Il(e) === null)) {
            t.child = s;
            break;
          }
          ((e = s.sibling), (s.sibling = a), (a = s), (s = e));
        }
        ks(t, !0, a, null, f, i);
        break;
      case 'together':
        ks(t, !1, null, null, void 0, i);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Pu(e, t, a) {
    if (
      (e !== null && (t.dependencies = e.dependencies), (Sn |= t.lanes), (a & t.childLanes) === 0)
    )
      if (e !== null) {
        if ((Ma(e, t, a, !1), (a & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(l(153));
    if (t.child !== null) {
      for (e = t.child, a = ku(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null;)
        ((e = e.sibling), (a = a.sibling = ku(e, e.pendingProps)), (a.return = t));
      a.sibling = null;
    }
    return t.child;
  }
  function qs(e, t) {
    return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && Pl(e)));
  }
  function dp(e, t, a) {
    switch (t.tag) {
      case 3:
        (Xe(t, t.stateNode.containerInfo), pn(t, gt, e.memoizedState.cache), $n());
        break;
      case 27:
      case 5:
        z(t);
        break;
      case 4:
        Xe(t, t.stateNode.containerInfo);
        break;
      case 10:
        pn(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), cs(t), null);
        break;
      case 13:
        var i = t.memoizedState;
        if (i !== null)
          return i.dehydrated !== null
            ? (An(t), (t.flags |= 128), null)
            : (a & t.child.childLanes) !== 0
              ? oh(e, t, a)
              : (An(t), (e = Pu(e, t, a)), e !== null ? e.sibling : null);
        An(t);
        break;
      case 19:
        var s = (e.flags & 128) !== 0;
        if (
          ((i = (a & t.childLanes) !== 0),
          i || (Ma(e, t, a, !1), (i = (a & t.childLanes) !== 0)),
          s)
        ) {
          if (i) return fh(e, t, a);
          t.flags |= 128;
        }
        if (
          ((s = t.memoizedState),
          s !== null && ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
          Z(Dt, Dt.current),
          i)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), uh(e, t, a, t.pendingProps));
      case 24:
        pn(t, gt, e.memoizedState.cache);
    }
    return Pu(e, t, a);
  }
  function ch(e, t, a) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) pt = !0;
      else {
        if (!qs(e, a) && (t.flags & 128) === 0) return ((pt = !1), dp(e, t, a));
        pt = (e.flags & 131072) !== 0;
      }
    else ((pt = !1), qe && (t.flags & 1048576) !== 0 && Yd(t, br, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var i = t.pendingProps;
          if (((e = ea(t.elementType)), (t.type = e), typeof e == 'function'))
            Po(e)
              ? ((i = aa(e, i)), (t.tag = 1), (t = lh(null, t, e, i, a)))
              : ((t.tag = 0), (t = js(null, t, e, i, a)));
          else {
            if (e != null) {
              var s = e.$$typeof;
              if (s === _) {
                ((t.tag = 11), (t = I0(null, t, e, i, a)));
                break e;
              } else if (s === X) {
                ((t.tag = 14), (t = eh(null, t, e, i, a)));
                break e;
              }
            }
            throw ((t = ae(e) || e), Error(l(306, t, '')));
          }
        }
        return t;
      case 0:
        return js(e, t, t.type, t.pendingProps, a);
      case 1:
        return ((i = t.type), (s = aa(i, t.pendingProps)), lh(e, t, i, s, a));
      case 3:
        e: {
          if ((Xe(t, t.stateNode.containerInfo), e === null)) throw Error(l(387));
          i = t.pendingProps;
          var f = t.memoizedState;
          ((s = f.element), ls(e, t), Mr(t, i, null, a));
          var g = t.memoizedState;
          if (
            ((i = g.cache),
            pn(t, gt, i),
            i !== f.cache && es(t, [gt], a, !0),
            Rr(),
            (i = g.element),
            f.isDehydrated)
          )
            if (
              ((f = { element: i, isDehydrated: !1, cache: g.cache }),
              (t.updateQueue.baseState = f),
              (t.memoizedState = f),
              t.flags & 256)
            ) {
              t = ih(e, t, i, a);
              break e;
            } else if (i !== s) {
              ((s = fu(Error(l(424)), t)), Fr(s), (t = ih(e, t, i, a)));
              break e;
            } else {
              switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === 'HTML' ? e.ownerDocument.body : e;
              }
              for (
                nt = vu(e.firstChild),
                  wt = t,
                  qe = !0,
                  gn = null,
                  hu = !0,
                  a = u0(t, null, i, a),
                  t.child = a;
                a;
              )
                ((a.flags = (a.flags & -3) | 4096), (a = a.sibling));
            }
          else {
            if (($n(), i === s)) {
              t = Pu(e, t, a);
              break e;
            }
            Rt(e, t, i, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          fi(e, t),
          e === null
            ? (a = AD(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = a)
              : qe ||
                ((a = t.type),
                (e = t.pendingProps),
                (i = xi(Ae.current).createElement(a)),
                (i[Ot] = t),
                (i[Pt] = e),
                Mt(i, a, e),
                bt(i),
                (t.stateNode = i))
            : (t.memoizedState = AD(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
          null
        );
      case 27:
        return (
          z(t),
          e === null &&
            qe &&
            ((i = t.stateNode = CD(t.type, t.pendingProps, Ae.current)),
            (wt = t),
            (hu = !0),
            (s = nt),
            Rn(t.type) ? ((Ef = s), (nt = vu(i.firstChild))) : (nt = s)),
          Rt(e, t, t.pendingProps.children, a),
          fi(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            qe &&
            ((s = i = nt) &&
              ((i = Gp(i, t.type, t.pendingProps, hu)),
              i !== null
                ? ((t.stateNode = i), (wt = t), (nt = vu(i.firstChild)), (hu = !1), (s = !0))
                : (s = !1)),
            s || mn(t)),
          z(t),
          (s = t.type),
          (f = t.pendingProps),
          (g = e !== null ? e.memoizedProps : null),
          (i = f.children),
          vf(s, f) ? (i = null) : g !== null && vf(s, g) && (t.flags |= 32),
          t.memoizedState !== null && ((s = hs(e, t, np, null, null, a)), (Jr._currentValue = s)),
          fi(e, t),
          Rt(e, t, i, a),
          t.child
        );
      case 6:
        return (
          e === null &&
            qe &&
            ((e = a = nt) &&
              ((a = Yp(a, t.pendingProps, hu)),
              a !== null ? ((t.stateNode = a), (wt = t), (nt = null), (e = !0)) : (e = !1)),
            e || mn(t)),
          null
        );
      case 13:
        return oh(e, t, a);
      case 4:
        return (
          Xe(t, t.stateNode.containerInfo),
          (i = t.pendingProps),
          e === null ? (t.child = ua(t, null, i, a)) : Rt(e, t, i, a),
          t.child
        );
      case 11:
        return I0(e, t, t.type, t.pendingProps, a);
      case 7:
        return (Rt(e, t, t.pendingProps, a), t.child);
      case 8:
        return (Rt(e, t, t.pendingProps.children, a), t.child);
      case 12:
        return (Rt(e, t, t.pendingProps.children, a), t.child);
      case 10:
        return ((i = t.pendingProps), pn(t, t.type, i.value), Rt(e, t, i.children, a), t.child);
      case 9:
        return (
          (s = t.type._context),
          (i = t.pendingProps.children),
          Jn(t),
          (s = Tt(s)),
          (i = i(s)),
          (t.flags |= 1),
          Rt(e, t, i, a),
          t.child
        );
      case 14:
        return eh(e, t, t.type, t.pendingProps, a);
      case 15:
        return th(e, t, t.type, t.pendingProps, a);
      case 19:
        return fh(e, t, a);
      case 31:
        return cp(e, t, a);
      case 22:
        return uh(e, t, a, t.pendingProps);
      case 24:
        return (
          Jn(t),
          (i = Tt(gt)),
          e === null
            ? ((s = ns()),
              s === null &&
                ((s = tt),
                (f = ts()),
                (s.pooledCache = f),
                f.refCount++,
                f !== null && (s.pooledCacheLanes |= a),
                (s = f)),
              (t.memoizedState = { parent: i, cache: s }),
              rs(t),
              pn(t, gt, s))
            : ((e.lanes & a) !== 0 && (ls(e, t), Mr(t, null, null, a), Rr()),
              (s = e.memoizedState),
              (f = t.memoizedState),
              s.parent !== i
                ? ((s = { parent: i, cache: i }),
                  (t.memoizedState = s),
                  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = s),
                  pn(t, gt, i))
                : ((i = f.cache), pn(t, gt, i), i !== s.cache && es(t, [gt], a, !0))),
          Rt(e, t, t.pendingProps.children, a),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(l(156, t.tag));
  }
  function Ku(e) {
    e.flags |= 4;
  }
  function _s(e, t, a, i, s) {
    if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
      if (((e.flags |= 16777216), (s & 335544128) === s))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Uh()) e.flags |= 8192;
        else throw ((ta = Zl), as);
    } else e.flags &= -16777217;
  }
  function dh(e, t) {
    if (t.type !== 'stylesheet' || (t.state.loading & 4) !== 0) e.flags &= -16777217;
    else if (((e.flags |= 16777216), !xD(t)))
      if (Uh()) e.flags |= 8192;
      else throw ((ta = Zl), as);
  }
  function di(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 && ((t = e.tag !== 22 ? Pc() : 536870912), (e.lanes |= t), (Va |= t)));
  }
  function Ur(e, t) {
    if (!qe)
      switch (e.tailMode) {
        case 'hidden':
          t = e.tail;
          for (var a = null; t !== null;) (t.alternate !== null && (a = t), (t = t.sibling));
          a === null ? (e.tail = null) : (a.sibling = null);
          break;
        case 'collapsed':
          a = e.tail;
          for (var i = null; a !== null;) (a.alternate !== null && (i = a), (a = a.sibling));
          i === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (i.sibling = null);
      }
  }
  function at(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      a = 0,
      i = 0;
    if (t)
      for (var s = e.child; s !== null;)
        ((a |= s.lanes | s.childLanes),
          (i |= s.subtreeFlags & 65011712),
          (i |= s.flags & 65011712),
          (s.return = e),
          (s = s.sibling));
    else
      for (s = e.child; s !== null;)
        ((a |= s.lanes | s.childLanes),
          (i |= s.subtreeFlags),
          (i |= s.flags),
          (s.return = e),
          (s = s.sibling));
    return ((e.subtreeFlags |= i), (e.childLanes = a), t);
  }
  function hp(e, t, a) {
    var i = t.pendingProps;
    switch ((Zo(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (at(t), null);
      case 1:
        return (at(t), null);
      case 3:
        return (
          (a = t.stateNode),
          (i = null),
          e !== null && (i = e.memoizedState.cache),
          t.memoizedState.cache !== i && (t.flags |= 2048),
          Gu(gt),
          Ne(),
          a.pendingContext && ((a.context = a.pendingContext), (a.pendingContext = null)),
          (e === null || e.child === null) &&
            (Ra(t)
              ? Ku(t)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), Wo())),
          at(t),
          null
        );
      case 26:
        var s = t.type,
          f = t.memoizedState;
        return (
          e === null
            ? (Ku(t), f !== null ? (at(t), dh(t, f)) : (at(t), _s(t, s, null, i, a)))
            : f
              ? f !== e.memoizedState
                ? (Ku(t), at(t), dh(t, f))
                : (at(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps), e !== i && Ku(t), at(t), _s(t, s, e, i, a)),
          null
        );
      case 27:
        if ((oe(t), (a = Ae.current), (s = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== i && Ku(t);
        else {
          if (!i) {
            if (t.stateNode === null) throw Error(l(166));
            return (at(t), null);
          }
          ((e = J.current), Ra(t) ? Pd(t) : ((e = CD(s, i, a)), (t.stateNode = e), Ku(t)));
        }
        return (at(t), null);
      case 5:
        if ((oe(t), (s = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== i && Ku(t);
        else {
          if (!i) {
            if (t.stateNode === null) throw Error(l(166));
            return (at(t), null);
          }
          if (((f = J.current), Ra(t))) Pd(t);
          else {
            var g = xi(Ae.current);
            switch (f) {
              case 1:
                f = g.createElementNS('http://www.w3.org/2000/svg', s);
                break;
              case 2:
                f = g.createElementNS('http://www.w3.org/1998/Math/MathML', s);
                break;
              default:
                switch (s) {
                  case 'svg':
                    f = g.createElementNS('http://www.w3.org/2000/svg', s);
                    break;
                  case 'math':
                    f = g.createElementNS('http://www.w3.org/1998/Math/MathML', s);
                    break;
                  case 'script':
                    ((f = g.createElement('div')),
                      (f.innerHTML = '<script><\/script>'),
                      (f = f.removeChild(f.firstChild)));
                    break;
                  case 'select':
                    ((f =
                      typeof i.is == 'string'
                        ? g.createElement('select', { is: i.is })
                        : g.createElement('select')),
                      i.multiple ? (f.multiple = !0) : i.size && (f.size = i.size));
                    break;
                  default:
                    f =
                      typeof i.is == 'string'
                        ? g.createElement(s, { is: i.is })
                        : g.createElement(s);
                }
            }
            ((f[Ot] = t), (f[Pt] = i));
            e: for (g = t.child; g !== null;) {
              if (g.tag === 5 || g.tag === 6) f.appendChild(g.stateNode);
              else if (g.tag !== 4 && g.tag !== 27 && g.child !== null) {
                ((g.child.return = g), (g = g.child));
                continue;
              }
              if (g === t) break e;
              for (; g.sibling === null;) {
                if (g.return === null || g.return === t) break e;
                g = g.return;
              }
              ((g.sibling.return = g.return), (g = g.sibling));
            }
            t.stateNode = f;
            e: switch ((Mt(f, s, i), s)) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                i = !!i.autoFocus;
                break e;
              case 'img':
                i = !0;
                break e;
              default:
                i = !1;
            }
            i && Ku(t);
          }
        }
        return (at(t), _s(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a), null);
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== i && Ku(t);
        else {
          if (typeof i != 'string' && t.stateNode === null) throw Error(l(166));
          if (((e = Ae.current), Ra(t))) {
            if (((e = t.stateNode), (a = t.memoizedProps), (i = null), (s = wt), s !== null))
              switch (s.tag) {
                case 27:
                case 5:
                  i = s.memoizedProps;
              }
            ((e[Ot] = t),
              (e = !!(
                e.nodeValue === a ||
                (i !== null && i.suppressHydrationWarning === !0) ||
                oD(e.nodeValue, a)
              )),
              e || mn(t, !0));
          } else ((e = xi(e).createTextNode(i)), (e[Ot] = t), (t.stateNode = e));
        }
        return (at(t), null);
      case 31:
        if (((a = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((i = Ra(t)), a !== null)) {
            if (e === null) {
              if (!i) throw Error(l(318));
              if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
                throw Error(l(557));
              e[Ot] = t;
            } else ($n(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (at(t), (e = !1));
          } else
            ((a = Wo()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a),
              (e = !0));
          if (!e) return t.flags & 256 ? (uu(t), t) : (uu(t), null);
          if ((t.flags & 128) !== 0) throw Error(l(558));
        }
        return (at(t), null);
      case 13:
        if (
          ((i = t.memoizedState),
          e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((s = Ra(t)), i !== null && i.dehydrated !== null)) {
            if (e === null) {
              if (!s) throw Error(l(318));
              if (((s = t.memoizedState), (s = s !== null ? s.dehydrated : null), !s))
                throw Error(l(317));
              s[Ot] = t;
            } else ($n(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (at(t), (s = !1));
          } else
            ((s = Wo()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = s),
              (s = !0));
          if (!s) return t.flags & 256 ? (uu(t), t) : (uu(t), null);
        }
        return (
          uu(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = a), t)
            : ((a = i !== null),
              (e = e !== null && e.memoizedState !== null),
              a &&
                ((i = t.child),
                (s = null),
                i.alternate !== null &&
                  i.alternate.memoizedState !== null &&
                  i.alternate.memoizedState.cachePool !== null &&
                  (s = i.alternate.memoizedState.cachePool.pool),
                (f = null),
                i.memoizedState !== null &&
                  i.memoizedState.cachePool !== null &&
                  (f = i.memoizedState.cachePool.pool),
                f !== s && (i.flags |= 2048)),
              a !== e && a && (t.child.flags |= 8192),
              di(t, t.updateQueue),
              at(t),
              null)
        );
      case 4:
        return (Ne(), e === null && ff(t.stateNode.containerInfo), at(t), null);
      case 10:
        return (Gu(t.type), at(t), null);
      case 19:
        if ((Y(Dt), (i = t.memoizedState), i === null)) return (at(t), null);
        if (((s = (t.flags & 128) !== 0), (f = i.rendering), f === null))
          if (s) Ur(i, !1);
          else {
            if (ht !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null;) {
                if (((f = Il(e)), f !== null)) {
                  for (
                    t.flags |= 128,
                      Ur(i, !1),
                      e = f.updateQueue,
                      t.updateQueue = e,
                      di(t, e),
                      t.subtreeFlags = 0,
                      e = a,
                      a = t.child;
                    a !== null;
                  )
                    (qd(a, e), (a = a.sibling));
                  return (Z(Dt, (Dt.current & 1) | 2), qe && qu(t, i.treeForkCount), t.child);
                }
                e = e.sibling;
              }
            i.tail !== null &&
              ct() > mi &&
              ((t.flags |= 128), (s = !0), Ur(i, !1), (t.lanes = 4194304));
          }
        else {
          if (!s)
            if (((e = Il(f)), e !== null)) {
              if (
                ((t.flags |= 128),
                (s = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                di(t, e),
                Ur(i, !0),
                i.tail === null && i.tailMode === 'hidden' && !f.alternate && !qe)
              )
                return (at(t), null);
            } else
              2 * ct() - i.renderingStartTime > mi &&
                a !== 536870912 &&
                ((t.flags |= 128), (s = !0), Ur(i, !1), (t.lanes = 4194304));
          i.isBackwards
            ? ((f.sibling = t.child), (t.child = f))
            : ((e = i.last), e !== null ? (e.sibling = f) : (t.child = f), (i.last = f));
        }
        return i.tail !== null
          ? ((e = i.tail),
            (i.rendering = e),
            (i.tail = e.sibling),
            (i.renderingStartTime = ct()),
            (e.sibling = null),
            (a = Dt.current),
            Z(Dt, s ? (a & 1) | 2 : a & 1),
            qe && qu(t, i.treeForkCount),
            e)
          : (at(t), null);
      case 22:
      case 23:
        return (
          uu(t),
          fs(),
          (i = t.memoizedState !== null),
          e !== null
            ? (e.memoizedState !== null) !== i && (t.flags |= 8192)
            : i && (t.flags |= 8192),
          i
            ? (a & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (at(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : at(t),
          (a = t.updateQueue),
          a !== null && di(t, a.retryQueue),
          (a = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (a = e.memoizedState.cachePool.pool),
          (i = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (i = t.memoizedState.cachePool.pool),
          i !== a && (t.flags |= 2048),
          e !== null && Y(In),
          null
        );
      case 24:
        return (
          (a = null),
          e !== null && (a = e.memoizedState.cache),
          t.memoizedState.cache !== a && (t.flags |= 2048),
          Gu(gt),
          at(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(l(156, t.tag));
  }
  function Dp(e, t) {
    switch ((Zo(t), t.tag)) {
      case 1:
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 3:
        return (
          Gu(gt),
          Ne(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 26:
      case 27:
      case 5:
        return (oe(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((uu(t), t.alternate === null)) throw Error(l(340));
          $n();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 13:
        if ((uu(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(l(340));
          $n();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (Y(Dt), null);
      case 4:
        return (Ne(), null);
      case 10:
        return (Gu(t.type), null);
      case 22:
      case 23:
        return (
          uu(t),
          fs(),
          e !== null && Y(In),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (Gu(gt), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function hh(e, t) {
    switch ((Zo(t), t.tag)) {
      case 3:
        (Gu(gt), Ne());
        break;
      case 26:
      case 27:
      case 5:
        oe(t);
        break;
      case 4:
        Ne();
        break;
      case 31:
        t.memoizedState !== null && uu(t);
        break;
      case 13:
        uu(t);
        break;
      case 19:
        Y(Dt);
        break;
      case 10:
        Gu(t.type);
        break;
      case 22:
      case 23:
        (uu(t), fs(), e !== null && Y(In));
        break;
      case 24:
        Gu(gt);
    }
  }
  function kr(e, t) {
    try {
      var a = t.updateQueue,
        i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var s = i.next;
        a = s;
        do {
          if ((a.tag & e) === e) {
            i = void 0;
            var f = a.create,
              g = a.inst;
            ((i = f()), (g.destroy = i));
          }
          a = a.next;
        } while (a !== s);
      }
    } catch (y) {
      Ze(t, t.return, y);
    }
  }
  function bn(e, t, a) {
    try {
      var i = t.updateQueue,
        s = i !== null ? i.lastEffect : null;
      if (s !== null) {
        var f = s.next;
        i = f;
        do {
          if ((i.tag & e) === e) {
            var g = i.inst,
              y = g.destroy;
            if (y !== void 0) {
              ((g.destroy = void 0), (s = t));
              var O = a,
                q = y;
              try {
                q();
              } catch ($) {
                Ze(s, O, $);
              }
            }
          }
          i = i.next;
        } while (i !== f);
      }
    } catch ($) {
      Ze(t, t.return, $);
    }
  }
  function Dh(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var a = e.stateNode;
      try {
        a0(t, a);
      } catch (i) {
        Ze(e, e.return, i);
      }
    }
  }
  function vh(e, t, a) {
    ((a.props = aa(e.type, e.memoizedProps)), (a.state = e.memoizedState));
    try {
      a.componentWillUnmount();
    } catch (i) {
      Ze(e, t, i);
    }
  }
  function qr(e, t) {
    try {
      var a = e.ref;
      if (a !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var i = e.stateNode;
            break;
          case 30:
            i = e.stateNode;
            break;
          default:
            i = e.stateNode;
        }
        typeof a == 'function' ? (e.refCleanup = a(i)) : (a.current = i);
      }
    } catch (s) {
      Ze(e, t, s);
    }
  }
  function wu(e, t) {
    var a = e.ref,
      i = e.refCleanup;
    if (a !== null)
      if (typeof i == 'function')
        try {
          i();
        } catch (s) {
          Ze(e, t, s);
        } finally {
          ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
        }
      else if (typeof a == 'function')
        try {
          a(null);
        } catch (s) {
          Ze(e, t, s);
        }
      else a.current = null;
  }
  function gh(e) {
    var t = e.type,
      a = e.memoizedProps,
      i = e.stateNode;
    try {
      e: switch (t) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          a.autoFocus && i.focus();
          break e;
        case 'img':
          a.src ? (i.src = a.src) : a.srcSet && (i.srcset = a.srcSet);
      }
    } catch (s) {
      Ze(e, e.return, s);
    }
  }
  function Gs(e, t, a) {
    try {
      var i = e.stateNode;
      (Lp(i, e.type, a, t), (i[Pt] = t));
    } catch (s) {
      Ze(e, e.return, s);
    }
  }
  function mh(e) {
    return (
      e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && Rn(e.type)) || e.tag === 4
    );
  }
  function Ys(e) {
    e: for (;;) {
      for (; e.sibling === null;) {
        if (e.return === null || mh(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if ((e.tag === 27 && Rn(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
          continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Vs(e, t, a) {
    var i = e.tag;
    if (i === 5 || i === 6)
      ((e = e.stateNode),
        t
          ? (a.nodeType === 9
              ? a.body
              : a.nodeName === 'HTML'
                ? a.ownerDocument.body
                : a
            ).insertBefore(e, t)
          : ((t = a.nodeType === 9 ? a.body : a.nodeName === 'HTML' ? a.ownerDocument.body : a),
            t.appendChild(e),
            (a = a._reactRootContainer),
            a != null || t.onclick !== null || (t.onclick = Hu)));
    else if (
      i !== 4 &&
      (i === 27 && Rn(e.type) && ((a = e.stateNode), (t = null)), (e = e.child), e !== null)
    )
      for (Vs(e, t, a), e = e.sibling; e !== null;) (Vs(e, t, a), (e = e.sibling));
  }
  function hi(e, t, a) {
    var i = e.tag;
    if (i === 5 || i === 6) ((e = e.stateNode), t ? a.insertBefore(e, t) : a.appendChild(e));
    else if (i !== 4 && (i === 27 && Rn(e.type) && (a = e.stateNode), (e = e.child), e !== null))
      for (hi(e, t, a), e = e.sibling; e !== null;) (hi(e, t, a), (e = e.sibling));
  }
  function ph(e) {
    var t = e.stateNode,
      a = e.memoizedProps;
    try {
      for (var i = e.type, s = t.attributes; s.length;) t.removeAttributeNode(s[0]);
      (Mt(t, i, a), (t[Ot] = e), (t[Pt] = a));
    } catch (f) {
      Ze(e, e.return, f);
    }
  }
  var Xu = !1,
    Ct = !1,
    Ps = !1,
    Ch = typeof WeakSet == 'function' ? WeakSet : Set,
    Ft = null;
  function vp(e, t) {
    if (((e = e.containerInfo), (hf = Ni), (e = Rd(e)), Uo(e))) {
      if ('selectionStart' in e) var a = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          a = ((a = e.ownerDocument) && a.defaultView) || window;
          var i = a.getSelection && a.getSelection();
          if (i && i.rangeCount !== 0) {
            a = i.anchorNode;
            var s = i.anchorOffset,
              f = i.focusNode;
            i = i.focusOffset;
            try {
              (a.nodeType, f.nodeType);
            } catch {
              a = null;
              break e;
            }
            var g = 0,
              y = -1,
              O = -1,
              q = 0,
              $ = 0,
              te = e,
              G = null;
            t: for (;;) {
              for (
                var P;
                te !== a || (s !== 0 && te.nodeType !== 3) || (y = g + s),
                  te !== f || (i !== 0 && te.nodeType !== 3) || (O = g + i),
                  te.nodeType === 3 && (g += te.nodeValue.length),
                  (P = te.firstChild) !== null;
              )
                ((G = te), (te = P));
              for (;;) {
                if (te === e) break t;
                if (
                  (G === a && ++q === s && (y = g),
                  G === f && ++$ === i && (O = g),
                  (P = te.nextSibling) !== null)
                )
                  break;
                ((te = G), (G = te.parentNode));
              }
              te = P;
            }
            a = y === -1 || O === -1 ? null : { start: y, end: O };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Df = { focusedElem: e, selectionRange: a }, Ni = !1, Ft = t; Ft !== null;)
      if (((t = Ft), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (Ft = e));
      else
        for (; Ft !== null;) {
          switch (((t = Ft), (f = t.alternate), (e = t.flags), t.tag)) {
            case 0:
              if (
                (e & 4) !== 0 &&
                ((e = t.updateQueue), (e = e !== null ? e.events : null), e !== null)
              )
                for (a = 0; a < e.length; a++) ((s = e[a]), (s.ref.impl = s.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && f !== null) {
                ((e = void 0),
                  (a = t),
                  (s = f.memoizedProps),
                  (f = f.memoizedState),
                  (i = a.stateNode));
                try {
                  var me = aa(a.type, s);
                  ((e = i.getSnapshotBeforeUpdate(me, f)),
                    (i.__reactInternalSnapshotBeforeUpdate = e));
                } catch (Se) {
                  Ze(a, a.return, Se);
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (((e = t.stateNode.containerInfo), (a = e.nodeType), a === 9)) mf(e);
                else if (a === 1)
                  switch (e.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      mf(e);
                      break;
                    default:
                      e.textContent = '';
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(l(163));
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (Ft = e));
            break;
          }
          Ft = t.return;
        }
  }
  function Eh(e, t, a) {
    var i = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        (Zu(e, a), i & 4 && kr(5, a));
        break;
      case 1:
        if ((Zu(e, a), i & 4))
          if (((e = a.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (g) {
              Ze(a, a.return, g);
            }
          else {
            var s = aa(a.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(s, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (g) {
              Ze(a, a.return, g);
            }
          }
        (i & 64 && Dh(a), i & 512 && qr(a, a.return));
        break;
      case 3:
        if ((Zu(e, a), i & 64 && ((e = a.updateQueue), e !== null))) {
          if (((t = null), a.child !== null))
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            a0(e, t);
          } catch (g) {
            Ze(a, a.return, g);
          }
        }
        break;
      case 27:
        t === null && i & 4 && ph(a);
      case 26:
      case 5:
        (Zu(e, a), t === null && i & 4 && gh(a), i & 512 && qr(a, a.return));
        break;
      case 12:
        Zu(e, a);
        break;
      case 31:
        (Zu(e, a), i & 4 && Bh(e, a));
        break;
      case 13:
        (Zu(e, a),
          i & 4 && bh(e, a),
          i & 64 &&
            ((e = a.memoizedState),
            e !== null && ((e = e.dehydrated), e !== null && ((a = bp.bind(null, a)), Vp(e, a)))));
        break;
      case 22:
        if (((i = a.memoizedState !== null || Xu), !i)) {
          ((t = (t !== null && t.memoizedState !== null) || Ct), (s = Xu));
          var f = Ct;
          ((Xu = i),
            (Ct = t) && !f ? $u(e, a, (a.subtreeFlags & 8772) !== 0) : Zu(e, a),
            (Xu = s),
            (Ct = f));
        }
        break;
      case 30:
        break;
      default:
        Zu(e, a);
    }
  }
  function yh(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), yh(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && yo(t)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  var lt = null,
    Xt = !1;
  function Qu(e, t, a) {
    for (a = a.child; a !== null;) (Ah(e, t, a), (a = a.sibling));
  }
  function Ah(e, t, a) {
    if (xt && typeof xt.onCommitFiberUnmount == 'function')
      try {
        xt.onCommitFiberUnmount(dn, a);
      } catch {}
    switch (a.tag) {
      case 26:
        (Ct || wu(a, t),
          Qu(e, t, a),
          a.memoizedState
            ? a.memoizedState.count--
            : a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a)));
        break;
      case 27:
        Ct || wu(a, t);
        var i = lt,
          s = Xt;
        (Rn(a.type) && ((lt = a.stateNode), (Xt = !1)),
          Qu(e, t, a),
          Zr(a.stateNode),
          (lt = i),
          (Xt = s));
        break;
      case 5:
        Ct || wu(a, t);
      case 6:
        if (((i = lt), (s = Xt), (lt = null), Qu(e, t, a), (lt = i), (Xt = s), lt !== null))
          if (Xt)
            try {
              (lt.nodeType === 9
                ? lt.body
                : lt.nodeName === 'HTML'
                  ? lt.ownerDocument.body
                  : lt
              ).removeChild(a.stateNode);
            } catch (f) {
              Ze(a, t, f);
            }
          else
            try {
              lt.removeChild(a.stateNode);
            } catch (f) {
              Ze(a, t, f);
            }
        break;
      case 18:
        lt !== null &&
          (Xt
            ? ((e = lt),
              DD(
                e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e,
                a.stateNode,
              ),
              Ja(e))
            : DD(lt, a.stateNode));
        break;
      case 4:
        ((i = lt),
          (s = Xt),
          (lt = a.stateNode.containerInfo),
          (Xt = !0),
          Qu(e, t, a),
          (lt = i),
          (Xt = s));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (bn(2, a, t), Ct || bn(4, a, t), Qu(e, t, a));
        break;
      case 1:
        (Ct ||
          (wu(a, t), (i = a.stateNode), typeof i.componentWillUnmount == 'function' && vh(a, t, i)),
          Qu(e, t, a));
        break;
      case 21:
        Qu(e, t, a);
        break;
      case 22:
        ((Ct = (i = Ct) || a.memoizedState !== null), Qu(e, t, a), (Ct = i));
        break;
      default:
        Qu(e, t, a);
    }
  }
  function Bh(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
    ) {
      e = e.dehydrated;
      try {
        Ja(e);
      } catch (a) {
        Ze(t, t.return, a);
      }
    }
  }
  function bh(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate),
      e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        Ja(e);
      } catch (a) {
        Ze(t, t.return, a);
      }
  }
  function gp(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new Ch()), t);
      case 22:
        return (
          (e = e.stateNode),
          (t = e._retryCache),
          t === null && (t = e._retryCache = new Ch()),
          t
        );
      default:
        throw Error(l(435, e.tag));
    }
  }
  function Di(e, t) {
    var a = gp(e);
    t.forEach(function (i) {
      if (!a.has(i)) {
        a.add(i);
        var s = Fp.bind(null, e, i);
        i.then(s, s);
      }
    });
  }
  function Qt(e, t) {
    var a = t.deletions;
    if (a !== null)
      for (var i = 0; i < a.length; i++) {
        var s = a[i],
          f = e,
          g = t,
          y = g;
        e: for (; y !== null;) {
          switch (y.tag) {
            case 27:
              if (Rn(y.type)) {
                ((lt = y.stateNode), (Xt = !1));
                break e;
              }
              break;
            case 5:
              ((lt = y.stateNode), (Xt = !1));
              break e;
            case 3:
            case 4:
              ((lt = y.stateNode.containerInfo), (Xt = !0));
              break e;
          }
          y = y.return;
        }
        if (lt === null) throw Error(l(160));
        (Ah(f, g, s),
          (lt = null),
          (Xt = !1),
          (f = s.alternate),
          f !== null && (f.return = null),
          (s.return = null));
      }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) (Fh(t, e), (t = t.sibling));
  }
  var yu = null;
  function Fh(e, t) {
    var a = e.alternate,
      i = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (Qt(t, e), Zt(e), i & 4 && (bn(3, e, e.return), kr(3, e), bn(5, e, e.return)));
        break;
      case 1:
        (Qt(t, e),
          Zt(e),
          i & 512 && (Ct || a === null || wu(a, a.return)),
          i & 64 &&
            Xu &&
            ((e = e.updateQueue),
            e !== null &&
              ((i = e.callbacks),
              i !== null &&
                ((a = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = a === null ? i : a.concat(i))))));
        break;
      case 26:
        var s = yu;
        if ((Qt(t, e), Zt(e), i & 512 && (Ct || a === null || wu(a, a.return)), i & 4)) {
          var f = a !== null ? a.memoizedState : null;
          if (((i = e.memoizedState), a === null))
            if (i === null)
              if (e.stateNode === null) {
                e: {
                  ((i = e.type), (a = e.memoizedProps), (s = s.ownerDocument || s));
                  t: switch (i) {
                    case 'title':
                      ((f = s.getElementsByTagName('title')[0]),
                        (!f ||
                          f[hr] ||
                          f[Ot] ||
                          f.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          f.hasAttribute('itemprop')) &&
                          ((f = s.createElement(i)),
                          s.head.insertBefore(f, s.querySelector('head > title'))),
                        Mt(f, i, a),
                        (f[Ot] = e),
                        bt(f),
                        (i = f));
                      break e;
                    case 'link':
                      var g = FD('link', 'href', s).get(i + (a.href || ''));
                      if (g) {
                        for (var y = 0; y < g.length; y++)
                          if (
                            ((f = g[y]),
                            f.getAttribute('href') ===
                              (a.href == null || a.href === '' ? null : a.href) &&
                              f.getAttribute('rel') === (a.rel == null ? null : a.rel) &&
                              f.getAttribute('title') === (a.title == null ? null : a.title) &&
                              f.getAttribute('crossorigin') ===
                                (a.crossOrigin == null ? null : a.crossOrigin))
                          ) {
                            g.splice(y, 1);
                            break t;
                          }
                      }
                      ((f = s.createElement(i)), Mt(f, i, a), s.head.appendChild(f));
                      break;
                    case 'meta':
                      if ((g = FD('meta', 'content', s).get(i + (a.content || '')))) {
                        for (y = 0; y < g.length; y++)
                          if (
                            ((f = g[y]),
                            f.getAttribute('content') ===
                              (a.content == null ? null : '' + a.content) &&
                              f.getAttribute('name') === (a.name == null ? null : a.name) &&
                              f.getAttribute('property') ===
                                (a.property == null ? null : a.property) &&
                              f.getAttribute('http-equiv') ===
                                (a.httpEquiv == null ? null : a.httpEquiv) &&
                              f.getAttribute('charset') === (a.charSet == null ? null : a.charSet))
                          ) {
                            g.splice(y, 1);
                            break t;
                          }
                      }
                      ((f = s.createElement(i)), Mt(f, i, a), s.head.appendChild(f));
                      break;
                    default:
                      throw Error(l(468, i));
                  }
                  ((f[Ot] = e), bt(f), (i = f));
                }
                e.stateNode = i;
              } else SD(s, e.type, e.stateNode);
            else e.stateNode = bD(s, i, e.memoizedProps);
          else
            f !== i
              ? (f === null
                  ? a.stateNode !== null && ((a = a.stateNode), a.parentNode.removeChild(a))
                  : f.count--,
                i === null ? SD(s, e.type, e.stateNode) : bD(s, i, e.memoizedProps))
              : i === null && e.stateNode !== null && Gs(e, e.memoizedProps, a.memoizedProps);
        }
        break;
      case 27:
        (Qt(t, e),
          Zt(e),
          i & 512 && (Ct || a === null || wu(a, a.return)),
          a !== null && i & 4 && Gs(e, e.memoizedProps, a.memoizedProps));
        break;
      case 5:
        if ((Qt(t, e), Zt(e), i & 512 && (Ct || a === null || wu(a, a.return)), e.flags & 32)) {
          s = e.stateNode;
          try {
            ya(s, '');
          } catch (me) {
            Ze(e, e.return, me);
          }
        }
        (i & 4 &&
          e.stateNode != null &&
          ((s = e.memoizedProps), Gs(e, s, a !== null ? a.memoizedProps : s)),
          i & 1024 && (Ps = !0));
        break;
      case 6:
        if ((Qt(t, e), Zt(e), i & 4)) {
          if (e.stateNode === null) throw Error(l(162));
          ((i = e.memoizedProps), (a = e.stateNode));
          try {
            a.nodeValue = i;
          } catch (me) {
            Ze(e, e.return, me);
          }
        }
        break;
      case 3:
        if (
          ((Ti = null),
          (s = yu),
          (yu = Oi(t.containerInfo)),
          Qt(t, e),
          (yu = s),
          Zt(e),
          i & 4 && a !== null && a.memoizedState.isDehydrated)
        )
          try {
            Ja(t.containerInfo);
          } catch (me) {
            Ze(e, e.return, me);
          }
        Ps && ((Ps = !1), Sh(e));
        break;
      case 4:
        ((i = yu), (yu = Oi(e.stateNode.containerInfo)), Qt(t, e), Zt(e), (yu = i));
        break;
      case 12:
        (Qt(t, e), Zt(e));
        break;
      case 31:
        (Qt(t, e),
          Zt(e),
          i & 4 && ((i = e.updateQueue), i !== null && ((e.updateQueue = null), Di(e, i))));
        break;
      case 13:
        (Qt(t, e),
          Zt(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) != (a !== null && a.memoizedState !== null) &&
            (gi = ct()),
          i & 4 && ((i = e.updateQueue), i !== null && ((e.updateQueue = null), Di(e, i))));
        break;
      case 22:
        s = e.memoizedState !== null;
        var O = a !== null && a.memoizedState !== null,
          q = Xu,
          $ = Ct;
        if (((Xu = q || s), (Ct = $ || O), Qt(t, e), (Ct = $), (Xu = q), Zt(e), i & 8192))
          e: for (
            t = e.stateNode,
              t._visibility = s ? t._visibility & -2 : t._visibility | 1,
              s && (a === null || O || Xu || Ct || ra(e)),
              a = null,
              t = e;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                O = a = t;
                try {
                  if (((f = O.stateNode), s))
                    ((g = f.style),
                      typeof g.setProperty == 'function'
                        ? g.setProperty('display', 'none', 'important')
                        : (g.display = 'none'));
                  else {
                    y = O.stateNode;
                    var te = O.memoizedProps.style,
                      G = te != null && te.hasOwnProperty('display') ? te.display : null;
                    y.style.display = G == null || typeof G == 'boolean' ? '' : ('' + G).trim();
                  }
                } catch (me) {
                  Ze(O, O.return, me);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                O = t;
                try {
                  O.stateNode.nodeValue = s ? '' : O.memoizedProps;
                } catch (me) {
                  Ze(O, O.return, me);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                O = t;
                try {
                  var P = O.stateNode;
                  s ? vD(P, !0) : vD(O.stateNode, !1);
                } catch (me) {
                  Ze(O, O.return, me);
                }
              }
            } else if (
              ((t.tag !== 22 && t.tag !== 23) || t.memoizedState === null || t === e) &&
              t.child !== null
            ) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null;) {
              if (t.return === null || t.return === e) break e;
              (a === t && (a = null), (t = t.return));
            }
            (a === t && (a = null), (t.sibling.return = t.return), (t = t.sibling));
          }
        i & 4 &&
          ((i = e.updateQueue),
          i !== null && ((a = i.retryQueue), a !== null && ((i.retryQueue = null), Di(e, a))));
        break;
      case 19:
        (Qt(t, e),
          Zt(e),
          i & 4 && ((i = e.updateQueue), i !== null && ((e.updateQueue = null), Di(e, i))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (Qt(t, e), Zt(e));
    }
  }
  function Zt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var a, i = e.return; i !== null;) {
          if (mh(i)) {
            a = i;
            break;
          }
          i = i.return;
        }
        if (a == null) throw Error(l(160));
        switch (a.tag) {
          case 27:
            var s = a.stateNode,
              f = Ys(e);
            hi(e, f, s);
            break;
          case 5:
            var g = a.stateNode;
            a.flags & 32 && (ya(g, ''), (a.flags &= -33));
            var y = Ys(e);
            hi(e, y, g);
            break;
          case 3:
          case 4:
            var O = a.stateNode.containerInfo,
              q = Ys(e);
            Vs(e, q, O);
            break;
          default:
            throw Error(l(161));
        }
      } catch ($) {
        Ze(e, e.return, $);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Sh(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null;) {
        var t = e;
        (Sh(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling));
      }
  }
  function Zu(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null;) (Eh(e, t.alternate, t), (t = t.sibling));
  }
  function ra(e) {
    for (e = e.child; e !== null;) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (bn(4, t, t.return), ra(t));
          break;
        case 1:
          wu(t, t.return);
          var a = t.stateNode;
          (typeof a.componentWillUnmount == 'function' && vh(t, t.return, a), ra(t));
          break;
        case 27:
          Zr(t.stateNode);
        case 26:
        case 5:
          (wu(t, t.return), ra(t));
          break;
        case 22:
          t.memoizedState === null && ra(t);
          break;
        case 30:
          ra(t);
          break;
        default:
          ra(t);
      }
      e = e.sibling;
    }
  }
  function $u(e, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null;) {
      var i = t.alternate,
        s = e,
        f = t,
        g = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          ($u(s, f, a), kr(4, f));
          break;
        case 1:
          if (($u(s, f, a), (i = f), (s = i.stateNode), typeof s.componentDidMount == 'function'))
            try {
              s.componentDidMount();
            } catch (q) {
              Ze(i, i.return, q);
            }
          if (((i = f), (s = i.updateQueue), s !== null)) {
            var y = i.stateNode;
            try {
              var O = s.shared.hiddenCallbacks;
              if (O !== null)
                for (s.shared.hiddenCallbacks = null, s = 0; s < O.length; s++) n0(O[s], y);
            } catch (q) {
              Ze(i, i.return, q);
            }
          }
          (a && g & 64 && Dh(f), qr(f, f.return));
          break;
        case 27:
          ph(f);
        case 26:
        case 5:
          ($u(s, f, a), a && i === null && g & 4 && gh(f), qr(f, f.return));
          break;
        case 12:
          $u(s, f, a);
          break;
        case 31:
          ($u(s, f, a), a && g & 4 && Bh(s, f));
          break;
        case 13:
          ($u(s, f, a), a && g & 4 && bh(s, f));
          break;
        case 22:
          (f.memoizedState === null && $u(s, f, a), qr(f, f.return));
          break;
        case 30:
          break;
        default:
          $u(s, f, a);
      }
      t = t.sibling;
    }
  }
  function Ks(e, t) {
    var a = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (a = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (e = t.memoizedState.cachePool.pool),
      e !== a && (e != null && e.refCount++, a != null && Sr(a)));
  }
  function Xs(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && Sr(e)));
  }
  function Au(e, t, a, i) {
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) (xh(e, t, a, i), (t = t.sibling));
  }
  function xh(e, t, a, i) {
    var s = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Au(e, t, a, i), s & 2048 && kr(9, t));
        break;
      case 1:
        Au(e, t, a, i);
        break;
      case 3:
        (Au(e, t, a, i),
          s & 2048 &&
            ((e = null),
            t.alternate !== null && (e = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== e && (t.refCount++, e != null && Sr(e))));
        break;
      case 12:
        if (s & 2048) {
          (Au(e, t, a, i), (e = t.stateNode));
          try {
            var f = t.memoizedProps,
              g = f.id,
              y = f.onPostCommit;
            typeof y == 'function' &&
              y(g, t.alternate === null ? 'mount' : 'update', e.passiveEffectDuration, -0);
          } catch (O) {
            Ze(t, t.return, O);
          }
        } else Au(e, t, a, i);
        break;
      case 31:
        Au(e, t, a, i);
        break;
      case 13:
        Au(e, t, a, i);
        break;
      case 23:
        break;
      case 22:
        ((f = t.stateNode),
          (g = t.alternate),
          t.memoizedState !== null
            ? f._visibility & 2
              ? Au(e, t, a, i)
              : _r(e, t)
            : f._visibility & 2
              ? Au(e, t, a, i)
              : ((f._visibility |= 2), _a(e, t, a, i, (t.subtreeFlags & 10256) !== 0 || !1)),
          s & 2048 && Ks(g, t));
        break;
      case 24:
        (Au(e, t, a, i), s & 2048 && Xs(t.alternate, t));
        break;
      default:
        Au(e, t, a, i);
    }
  }
  function _a(e, t, a, i, s) {
    for (s = s && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null;) {
      var f = e,
        g = t,
        y = a,
        O = i,
        q = g.flags;
      switch (g.tag) {
        case 0:
        case 11:
        case 15:
          (_a(f, g, y, O, s), kr(8, g));
          break;
        case 23:
          break;
        case 22:
          var $ = g.stateNode;
          (g.memoizedState !== null
            ? $._visibility & 2
              ? _a(f, g, y, O, s)
              : _r(f, g)
            : (($._visibility |= 2), _a(f, g, y, O, s)),
            s && q & 2048 && Ks(g.alternate, g));
          break;
        case 24:
          (_a(f, g, y, O, s), s && q & 2048 && Xs(g.alternate, g));
          break;
        default:
          _a(f, g, y, O, s);
      }
      t = t.sibling;
    }
  }
  function _r(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null;) {
        var a = e,
          i = t,
          s = i.flags;
        switch (i.tag) {
          case 22:
            (_r(a, i), s & 2048 && Ks(i.alternate, i));
            break;
          case 24:
            (_r(a, i), s & 2048 && Xs(i.alternate, i));
            break;
          default:
            _r(a, i);
        }
        t = t.sibling;
      }
  }
  var Gr = 8192;
  function Ga(e, t, a) {
    if (e.subtreeFlags & Gr) for (e = e.child; e !== null;) (Oh(e, t, a), (e = e.sibling));
  }
  function Oh(e, t, a) {
    switch (e.tag) {
      case 26:
        (Ga(e, t, a),
          e.flags & Gr && e.memoizedState !== null && uC(a, yu, e.memoizedState, e.memoizedProps));
        break;
      case 5:
        Ga(e, t, a);
        break;
      case 3:
      case 4:
        var i = yu;
        ((yu = Oi(e.stateNode.containerInfo)), Ga(e, t, a), (yu = i));
        break;
      case 22:
        e.memoizedState === null &&
          ((i = e.alternate),
          i !== null && i.memoizedState !== null
            ? ((i = Gr), (Gr = 16777216), Ga(e, t, a), (Gr = i))
            : Ga(e, t, a));
        break;
      default:
        Ga(e, t, a);
    }
  }
  function wh(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function Yr(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var i = t[a];
          ((Ft = i), Rh(i, e));
        }
      wh(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (Th(e), (e = e.sibling));
  }
  function Th(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Yr(e), e.flags & 2048 && bn(9, e, e.return));
        break;
      case 3:
        Yr(e);
        break;
      case 12:
        Yr(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), vi(e))
          : Yr(e);
        break;
      default:
        Yr(e);
    }
  }
  function vi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var i = t[a];
          ((Ft = i), Rh(i, e));
        }
      wh(e);
    }
    for (e = e.child; e !== null;) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          (bn(8, t, t.return), vi(t));
          break;
        case 22:
          ((a = t.stateNode), a._visibility & 2 && ((a._visibility &= -3), vi(t)));
          break;
        default:
          vi(t);
      }
      e = e.sibling;
    }
  }
  function Rh(e, t) {
    for (; Ft !== null;) {
      var a = Ft;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          bn(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var i = a.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          Sr(a.memoizedState.cache);
      }
      if (((i = a.child), i !== null)) ((i.return = a), (Ft = i));
      else
        e: for (a = e; Ft !== null;) {
          i = Ft;
          var s = i.sibling,
            f = i.return;
          if ((yh(i), i === a)) {
            Ft = null;
            break e;
          }
          if (s !== null) {
            ((s.return = f), (Ft = s));
            break e;
          }
          Ft = f;
        }
    }
  }
  var mp = {
      getCacheForType: function (e) {
        var t = Tt(gt),
          a = t.data.get(e);
        return (a === void 0 && ((a = e()), t.data.set(e, a)), a);
      },
      cacheSignal: function () {
        return Tt(gt).controller.signal;
      },
    },
    pp = typeof WeakMap == 'function' ? WeakMap : Map,
    Pe = 0,
    tt = null,
    Le = null,
    Ue = 0,
    Qe = 0,
    nu = null,
    Fn = !1,
    Ya = !1,
    Qs = !1,
    Wu = 0,
    ht = 0,
    Sn = 0,
    la = 0,
    Zs = 0,
    au = 0,
    Va = 0,
    Vr = null,
    $t = null,
    $s = !1,
    gi = 0,
    Mh = 0,
    mi = 1 / 0,
    pi = null,
    xn = null,
    At = 0,
    On = null,
    Pa = null,
    Ju = 0,
    Ws = 0,
    Js = null,
    jh = null,
    Pr = 0,
    Is = null;
  function ru() {
    return (Pe & 2) !== 0 && Ue !== 0 ? Ue & -Ue : L.T !== null ? rf() : Zc();
  }
  function Nh() {
    if (au === 0)
      if ((Ue & 536870912) === 0 || qe) {
        var e = Sl;
        ((Sl <<= 1), (Sl & 3932160) === 0 && (Sl = 262144), (au = e));
      } else au = 536870912;
    return ((e = tu.current), e !== null && (e.flags |= 32), au);
  }
  function Wt(e, t, a) {
    (((e === tt && (Qe === 2 || Qe === 9)) || e.cancelPendingCommit !== null) &&
      (Ka(e, 0), wn(e, Ue, au, !1)),
      dr(e, a),
      ((Pe & 2) === 0 || e !== tt) &&
        (e === tt && ((Pe & 2) === 0 && (la |= a), ht === 4 && wn(e, Ue, au, !1)), Tu(e)));
  }
  function zh(e, t, a) {
    if ((Pe & 6) !== 0) throw Error(l(327));
    var i = (!a && (t & 127) === 0 && (t & e.expiredLanes) === 0) || cr(e, t),
      s = i ? yp(e, t) : tf(e, t, !0),
      f = i;
    do {
      if (s === 0) {
        Ya && !i && wn(e, t, 0, !1);
        break;
      } else {
        if (((a = e.current.alternate), f && !Cp(a))) {
          ((s = tf(e, t, !1)), (f = !1));
          continue;
        }
        if (s === 2) {
          if (((f = t), e.errorRecoveryDisabledLanes & f)) var g = 0;
          else
            ((g = e.pendingLanes & -536870913), (g = g !== 0 ? g : g & 536870912 ? 536870912 : 0));
          if (g !== 0) {
            t = g;
            e: {
              var y = e;
              s = Vr;
              var O = y.current.memoizedState.isDehydrated;
              if ((O && (Ka(y, g).flags |= 256), (g = tf(y, g, !1)), g !== 2)) {
                if (Qs && !O) {
                  ((y.errorRecoveryDisabledLanes |= f), (la |= f), (s = 4));
                  break e;
                }
                ((f = $t), ($t = s), f !== null && ($t === null ? ($t = f) : $t.push.apply($t, f)));
              }
              s = g;
            }
            if (((f = !1), s !== 2)) continue;
          }
        }
        if (s === 1) {
          (Ka(e, 0), wn(e, t, 0, !0));
          break;
        }
        e: {
          switch (((i = e), (f = s), f)) {
            case 0:
            case 1:
              throw Error(l(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              wn(i, t, au, !Fn);
              break e;
            case 2:
              $t = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(l(329));
          }
          if ((t & 62914560) === t && ((s = gi + 300 - ct()), 10 < s)) {
            if ((wn(i, t, au, !Fn), Ol(i, 0, !0) !== 0)) break e;
            ((Ju = t),
              (i.timeoutHandle = dD(
                Lh.bind(null, i, a, $t, pi, $s, t, au, la, Va, Fn, f, 'Throttled', -0, 0),
                s,
              )));
            break e;
          }
          Lh(i, a, $t, pi, $s, t, au, la, Va, Fn, f, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Tu(e);
  }
  function Lh(e, t, a, i, s, f, g, y, O, q, $, te, G, P) {
    if (
      ((e.timeoutHandle = -1), (te = t.subtreeFlags), te & 8192 || (te & 16785408) === 16785408)
    ) {
      ((te = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Hu,
      }),
        Oh(t, f, te));
      var me = (f & 62914560) === f ? gi - ct() : (f & 4194048) === f ? Mh - ct() : 0;
      if (((me = nC(te, me)), me !== null)) {
        ((Ju = f),
          (e.cancelPendingCommit = me(Vh.bind(null, e, t, f, a, i, s, g, y, O, $, te, null, G, P))),
          wn(e, f, g, !q));
        return;
      }
    }
    Vh(e, t, f, a, i, s, g, y, O);
  }
  function Cp(e) {
    for (var t = e; ;) {
      var a = t.tag;
      if (
        (a === 0 || a === 11 || a === 15) &&
        t.flags & 16384 &&
        ((a = t.updateQueue), a !== null && ((a = a.stores), a !== null))
      )
        for (var i = 0; i < a.length; i++) {
          var s = a[i],
            f = s.getSnapshot;
          s = s.value;
          try {
            if (!It(f(), s)) return !1;
          } catch {
            return !1;
          }
        }
      if (((a = t.child), t.subtreeFlags & 16384 && a !== null)) ((a.return = t), (t = a));
      else {
        if (t === e) break;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function wn(e, t, a, i) {
    ((t &= ~Zs),
      (t &= ~la),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      i && (e.warmLanes |= t),
      (i = e.expirationTimes));
    for (var s = t; 0 < s;) {
      var f = 31 - kt(s),
        g = 1 << f;
      ((i[f] = -1), (s &= ~g));
    }
    a !== 0 && Kc(e, a, t);
  }
  function Ci() {
    return (Pe & 6) === 0 ? (Kr(0), !1) : !0;
  }
  function ef() {
    if (Le !== null) {
      if (Qe === 0) var e = Le.return;
      else ((e = Le), (_u = Wn = null), gs(e), (La = null), (Or = 0), (e = Le));
      for (; e !== null;) (hh(e.alternate, e), (e = e.return));
      Le = null;
    }
  }
  function Ka(e, t) {
    var a = e.timeoutHandle;
    (a !== -1 && ((e.timeoutHandle = -1), kp(a)),
      (a = e.cancelPendingCommit),
      a !== null && ((e.cancelPendingCommit = null), a()),
      (Ju = 0),
      ef(),
      (tt = e),
      (Le = a = ku(e.current, null)),
      (Ue = t),
      (Qe = 0),
      (nu = null),
      (Fn = !1),
      (Ya = cr(e, t)),
      (Qs = !1),
      (Va = au = Zs = la = Sn = ht = 0),
      ($t = Vr = null),
      ($s = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var i = e.entangledLanes;
    if (i !== 0)
      for (e = e.entanglements, i &= t; 0 < i;) {
        var s = 31 - kt(i),
          f = 1 << s;
        ((t |= e[s]), (i &= ~f));
      }
    return ((Wu = t), ql(), a);
  }
  function Hh(e, t) {
    ((Me = null),
      (L.H = Lr),
      t === za || t === Ql
        ? ((t = Id()), (Qe = 3))
        : t === as
          ? ((t = Id()), (Qe = 4))
          : (Qe =
              t === Ms
                ? 8
                : t !== null && typeof t == 'object' && typeof t.then == 'function'
                  ? 6
                  : 1),
      (nu = t),
      Le === null && ((ht = 1), oi(e, fu(t, e.current))));
  }
  function Uh() {
    var e = tu.current;
    return e === null
      ? !0
      : (Ue & 4194048) === Ue
        ? Du === null
        : (Ue & 62914560) === Ue || (Ue & 536870912) !== 0
          ? e === Du
          : !1;
  }
  function kh() {
    var e = L.H;
    return ((L.H = Lr), e === null ? Lr : e);
  }
  function qh() {
    var e = L.A;
    return ((L.A = mp), e);
  }
  function Ei() {
    ((ht = 4),
      Fn || ((Ue & 4194048) !== Ue && tu.current !== null) || (Ya = !0),
      ((Sn & 134217727) === 0 && (la & 134217727) === 0) || tt === null || wn(tt, Ue, au, !1));
  }
  function tf(e, t, a) {
    var i = Pe;
    Pe |= 2;
    var s = kh(),
      f = qh();
    ((tt !== e || Ue !== t) && ((pi = null), Ka(e, t)), (t = !1));
    var g = ht;
    e: do
      try {
        if (Qe !== 0 && Le !== null) {
          var y = Le,
            O = nu;
          switch (Qe) {
            case 8:
              (ef(), (g = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              tu.current === null && (t = !0);
              var q = Qe;
              if (((Qe = 0), (nu = null), Xa(e, y, O, q), a && Ya)) {
                g = 0;
                break e;
              }
              break;
            default:
              ((q = Qe), (Qe = 0), (nu = null), Xa(e, y, O, q));
          }
        }
        (Ep(), (g = ht));
        break;
      } catch ($) {
        Hh(e, $);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (_u = Wn = null),
      (Pe = i),
      (L.H = s),
      (L.A = f),
      Le === null && ((tt = null), (Ue = 0), ql()),
      g
    );
  }
  function Ep() {
    for (; Le !== null;) _h(Le);
  }
  function yp(e, t) {
    var a = Pe;
    Pe |= 2;
    var i = kh(),
      s = qh();
    tt !== e || Ue !== t ? ((pi = null), (mi = ct() + 500), Ka(e, t)) : (Ya = cr(e, t));
    e: do
      try {
        if (Qe !== 0 && Le !== null) {
          t = Le;
          var f = nu;
          t: switch (Qe) {
            case 1:
              ((Qe = 0), (nu = null), Xa(e, t, f, 1));
              break;
            case 2:
            case 9:
              if (Wd(f)) {
                ((Qe = 0), (nu = null), Gh(t));
                break;
              }
              ((t = function () {
                ((Qe !== 2 && Qe !== 9) || tt !== e || (Qe = 7), Tu(e));
              }),
                f.then(t, t));
              break e;
            case 3:
              Qe = 7;
              break e;
            case 4:
              Qe = 5;
              break e;
            case 7:
              Wd(f) ? ((Qe = 0), (nu = null), Gh(t)) : ((Qe = 0), (nu = null), Xa(e, t, f, 7));
              break;
            case 5:
              var g = null;
              switch (Le.tag) {
                case 26:
                  g = Le.memoizedState;
                case 5:
                case 27:
                  var y = Le;
                  if (g ? xD(g) : y.stateNode.complete) {
                    ((Qe = 0), (nu = null));
                    var O = y.sibling;
                    if (O !== null) Le = O;
                    else {
                      var q = y.return;
                      q !== null ? ((Le = q), yi(q)) : (Le = null);
                    }
                    break t;
                  }
              }
              ((Qe = 0), (nu = null), Xa(e, t, f, 5));
              break;
            case 6:
              ((Qe = 0), (nu = null), Xa(e, t, f, 6));
              break;
            case 8:
              (ef(), (ht = 6));
              break e;
            default:
              throw Error(l(462));
          }
        }
        Ap();
        break;
      } catch ($) {
        Hh(e, $);
      }
    while (!0);
    return (
      (_u = Wn = null),
      (L.H = i),
      (L.A = s),
      (Pe = a),
      Le !== null ? 0 : ((tt = null), (Ue = 0), ql(), ht)
    );
  }
  function Ap() {
    for (; Le !== null && !Ve();) _h(Le);
  }
  function _h(e) {
    var t = ch(e.alternate, e, Wu);
    ((e.memoizedProps = e.pendingProps), t === null ? yi(e) : (Le = t));
  }
  function Gh(e) {
    var t = e,
      a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = rh(a, t, t.pendingProps, t.type, void 0, Ue);
        break;
      case 11:
        t = rh(a, t, t.pendingProps, t.type.render, t.ref, Ue);
        break;
      case 5:
        gs(t);
      default:
        (hh(a, t), (t = Le = qd(t, Wu)), (t = ch(a, t, Wu)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? yi(e) : (Le = t));
  }
  function Xa(e, t, a, i) {
    ((_u = Wn = null), gs(t), (La = null), (Or = 0));
    var s = t.return;
    try {
      if (fp(e, s, t, a, Ue)) {
        ((ht = 1), oi(e, fu(a, e.current)), (Le = null));
        return;
      }
    } catch (f) {
      if (s !== null) throw ((Le = s), f);
      ((ht = 1), oi(e, fu(a, e.current)), (Le = null));
      return;
    }
    t.flags & 32768
      ? (qe || i === 1
          ? (e = !0)
          : Ya || (Ue & 536870912) !== 0
            ? (e = !1)
            : ((Fn = e = !0),
              (i === 2 || i === 9 || i === 3 || i === 6) &&
                ((i = tu.current), i !== null && i.tag === 13 && (i.flags |= 16384))),
        Yh(t, e))
      : yi(t);
  }
  function yi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Yh(t, Fn);
        return;
      }
      e = t.return;
      var a = hp(t.alternate, t, Wu);
      if (a !== null) {
        Le = a;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        Le = t;
        return;
      }
      Le = t = e;
    } while (t !== null);
    ht === 0 && (ht = 5);
  }
  function Yh(e, t) {
    do {
      var a = Dp(e.alternate, e);
      if (a !== null) {
        ((a.flags &= 32767), (Le = a));
        return;
      }
      if (
        ((a = e.return),
        a !== null && ((a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)),
        !t && ((e = e.sibling), e !== null))
      ) {
        Le = e;
        return;
      }
      Le = e = a;
    } while (e !== null);
    ((ht = 6), (Le = null));
  }
  function Vh(e, t, a, i, s, f, g, y, O) {
    e.cancelPendingCommit = null;
    do Ai();
    while (At !== 0);
    if ((Pe & 6) !== 0) throw Error(l(327));
    if (t !== null) {
      if (t === e.current) throw Error(l(177));
      if (
        ((f = t.lanes | t.childLanes),
        (f |= Yo),
        t1(e, a, f, g, y, O),
        e === tt && ((Le = tt = null), (Ue = 0)),
        (Pa = t),
        (On = e),
        (Ju = a),
        (Ws = f),
        (Js = s),
        (jh = i),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            Sp(Vt, function () {
              return (Zh(), null);
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (i = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || i)
      ) {
        ((i = L.T), (L.T = null), (s = V.p), (V.p = 2), (g = Pe), (Pe |= 4));
        try {
          vp(e, t, a);
        } finally {
          ((Pe = g), (V.p = s), (L.T = i));
        }
      }
      ((At = 1), Ph(), Kh(), Xh());
    }
  }
  function Ph() {
    if (At === 1) {
      At = 0;
      var e = On,
        t = Pa,
        a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        ((a = L.T), (L.T = null));
        var i = V.p;
        V.p = 2;
        var s = Pe;
        Pe |= 4;
        try {
          Fh(t, e);
          var f = Df,
            g = Rd(e.containerInfo),
            y = f.focusedElem,
            O = f.selectionRange;
          if (g !== y && y && y.ownerDocument && Td(y.ownerDocument.documentElement, y)) {
            if (O !== null && Uo(y)) {
              var q = O.start,
                $ = O.end;
              if (($ === void 0 && ($ = q), 'selectionStart' in y))
                ((y.selectionStart = q), (y.selectionEnd = Math.min($, y.value.length)));
              else {
                var te = y.ownerDocument || document,
                  G = (te && te.defaultView) || window;
                if (G.getSelection) {
                  var P = G.getSelection(),
                    me = y.textContent.length,
                    Se = Math.min(O.start, me),
                    et = O.end === void 0 ? Se : Math.min(O.end, me);
                  !P.extend && Se > et && ((g = et), (et = Se), (Se = g));
                  var H = wd(y, Se),
                    R = wd(y, et);
                  if (
                    H &&
                    R &&
                    (P.rangeCount !== 1 ||
                      P.anchorNode !== H.node ||
                      P.anchorOffset !== H.offset ||
                      P.focusNode !== R.node ||
                      P.focusOffset !== R.offset)
                  ) {
                    var k = te.createRange();
                    (k.setStart(H.node, H.offset),
                      P.removeAllRanges(),
                      Se > et
                        ? (P.addRange(k), P.extend(R.node, R.offset))
                        : (k.setEnd(R.node, R.offset), P.addRange(k)));
                  }
                }
              }
            }
            for (te = [], P = y; (P = P.parentNode);)
              P.nodeType === 1 && te.push({ element: P, left: P.scrollLeft, top: P.scrollTop });
            for (typeof y.focus == 'function' && y.focus(), y = 0; y < te.length; y++) {
              var I = te[y];
              ((I.element.scrollLeft = I.left), (I.element.scrollTop = I.top));
            }
          }
          ((Ni = !!hf), (Df = hf = null));
        } finally {
          ((Pe = s), (V.p = i), (L.T = a));
        }
      }
      ((e.current = t), (At = 2));
    }
  }
  function Kh() {
    if (At === 2) {
      At = 0;
      var e = On,
        t = Pa,
        a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        ((a = L.T), (L.T = null));
        var i = V.p;
        V.p = 2;
        var s = Pe;
        Pe |= 4;
        try {
          Eh(e, t.alternate, t);
        } finally {
          ((Pe = s), (V.p = i), (L.T = a));
        }
      }
      At = 3;
    }
  }
  function Xh() {
    if (At === 4 || At === 3) {
      ((At = 0), Gt());
      var e = On,
        t = Pa,
        a = Ju,
        i = jh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (At = 5)
        : ((At = 0), (Pa = On = null), Qh(e, e.pendingLanes));
      var s = e.pendingLanes;
      if (
        (s === 0 && (xn = null),
        Co(a),
        (t = t.stateNode),
        xt && typeof xt.onCommitFiberRoot == 'function')
      )
        try {
          xt.onCommitFiberRoot(dn, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (i !== null) {
        ((t = L.T), (s = V.p), (V.p = 2), (L.T = null));
        try {
          for (var f = e.onRecoverableError, g = 0; g < i.length; g++) {
            var y = i[g];
            f(y.value, { componentStack: y.stack });
          }
        } finally {
          ((L.T = t), (V.p = s));
        }
      }
      ((Ju & 3) !== 0 && Ai(),
        Tu(e),
        (s = e.pendingLanes),
        (a & 261930) !== 0 && (s & 42) !== 0 ? (e === Is ? Pr++ : ((Pr = 0), (Is = e))) : (Pr = 0),
        Kr(0));
    }
  }
  function Qh(e, t) {
    (e.pooledCacheLanes &= t) === 0 &&
      ((t = e.pooledCache), t != null && ((e.pooledCache = null), Sr(t)));
  }
  function Ai() {
    return (Ph(), Kh(), Xh(), Zh());
  }
  function Zh() {
    if (At !== 5) return !1;
    var e = On,
      t = Ws;
    Ws = 0;
    var a = Co(Ju),
      i = L.T,
      s = V.p;
    try {
      ((V.p = 32 > a ? 32 : a), (L.T = null), (a = Js), (Js = null));
      var f = On,
        g = Ju;
      if (((At = 0), (Pa = On = null), (Ju = 0), (Pe & 6) !== 0)) throw Error(l(331));
      var y = Pe;
      if (
        ((Pe |= 4),
        Th(f.current),
        xh(f, f.current, g, a),
        (Pe = y),
        Kr(0, !1),
        xt && typeof xt.onPostCommitFiberRoot == 'function')
      )
        try {
          xt.onPostCommitFiberRoot(dn, f);
        } catch {}
      return !0;
    } finally {
      ((V.p = s), (L.T = i), Qh(e, t));
    }
  }
  function $h(e, t, a) {
    ((t = fu(a, t)),
      (t = Rs(e.stateNode, t, 2)),
      (e = yn(e, t, 2)),
      e !== null && (dr(e, 2), Tu(e)));
  }
  function Ze(e, t, a) {
    if (e.tag === 3) $h(e, e, a);
    else
      for (; t !== null;) {
        if (t.tag === 3) {
          $h(t, e, a);
          break;
        } else if (t.tag === 1) {
          var i = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == 'function' ||
            (typeof i.componentDidCatch == 'function' && (xn === null || !xn.has(i)))
          ) {
            ((e = fu(a, e)),
              (a = W0(2)),
              (i = yn(t, a, 2)),
              i !== null && (J0(a, i, t, e), dr(i, 2), Tu(i)));
            break;
          }
        }
        t = t.return;
      }
  }
  function uf(e, t, a) {
    var i = e.pingCache;
    if (i === null) {
      i = e.pingCache = new pp();
      var s = new Set();
      i.set(t, s);
    } else ((s = i.get(t)), s === void 0 && ((s = new Set()), i.set(t, s)));
    s.has(a) || ((Qs = !0), s.add(a), (e = Bp.bind(null, e, t, a)), t.then(e, e));
  }
  function Bp(e, t, a) {
    var i = e.pingCache;
    (i !== null && i.delete(t),
      (e.pingedLanes |= e.suspendedLanes & a),
      (e.warmLanes &= ~a),
      tt === e &&
        (Ue & a) === a &&
        (ht === 4 || (ht === 3 && (Ue & 62914560) === Ue && 300 > ct() - gi)
          ? (Pe & 2) === 0 && Ka(e, 0)
          : (Zs |= a),
        Va === Ue && (Va = 0)),
      Tu(e));
  }
  function Wh(e, t) {
    (t === 0 && (t = Pc()), (e = Qn(e, t)), e !== null && (dr(e, t), Tu(e)));
  }
  function bp(e) {
    var t = e.memoizedState,
      a = 0;
    (t !== null && (a = t.retryLane), Wh(e, a));
  }
  function Fp(e, t) {
    var a = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var i = e.stateNode,
          s = e.memoizedState;
        s !== null && (a = s.retryLane);
        break;
      case 19:
        i = e.stateNode;
        break;
      case 22:
        i = e.stateNode._retryCache;
        break;
      default:
        throw Error(l(314));
    }
    (i !== null && i.delete(t), Wh(e, a));
  }
  function Sp(e, t) {
    return We(e, t);
  }
  var Bi = null,
    Qa = null,
    nf = !1,
    bi = !1,
    af = !1,
    Tn = 0;
  function Tu(e) {
    (e !== Qa && e.next === null && (Qa === null ? (Bi = Qa = e) : (Qa = Qa.next = e)),
      (bi = !0),
      nf || ((nf = !0), Op()));
  }
  function Kr(e, t) {
    if (!af && bi) {
      af = !0;
      do
        for (var a = !1, i = Bi; i !== null;) {
          if (e !== 0) {
            var s = i.pendingLanes;
            if (s === 0) var f = 0;
            else {
              var g = i.suspendedLanes,
                y = i.pingedLanes;
              ((f = (1 << (31 - kt(42 | e) + 1)) - 1),
                (f &= s & ~(g & ~y)),
                (f = f & 201326741 ? (f & 201326741) | 1 : f ? f | 2 : 0));
            }
            f !== 0 && ((a = !0), tD(i, f));
          } else
            ((f = Ue),
              (f = Ol(
                i,
                i === tt ? f : 0,
                i.cancelPendingCommit !== null || i.timeoutHandle !== -1,
              )),
              (f & 3) === 0 || cr(i, f) || ((a = !0), tD(i, f)));
          i = i.next;
        }
      while (a);
      af = !1;
    }
  }
  function xp() {
    Jh();
  }
  function Jh() {
    bi = nf = !1;
    var e = 0;
    Tn !== 0 && Up() && (e = Tn);
    for (var t = ct(), a = null, i = Bi; i !== null;) {
      var s = i.next,
        f = Ih(i, t);
      (f === 0
        ? ((i.next = null), a === null ? (Bi = s) : (a.next = s), s === null && (Qa = a))
        : ((a = i), (e !== 0 || (f & 3) !== 0) && (bi = !0)),
        (i = s));
    }
    ((At !== 0 && At !== 5) || Kr(e), Tn !== 0 && (Tn = 0));
  }
  function Ih(e, t) {
    for (
      var a = e.suspendedLanes,
        i = e.pingedLanes,
        s = e.expirationTimes,
        f = e.pendingLanes & -62914561;
      0 < f;
    ) {
      var g = 31 - kt(f),
        y = 1 << g,
        O = s[g];
      (O === -1
        ? ((y & a) === 0 || (y & i) !== 0) && (s[g] = e1(y, t))
        : O <= t && (e.expiredLanes |= y),
        (f &= ~y));
    }
    if (
      ((t = tt),
      (a = Ue),
      (a = Ol(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      (i = e.callbackNode),
      a === 0 || (e === t && (Qe === 2 || Qe === 9)) || e.cancelPendingCommit !== null)
    )
      return (i !== null && i !== null && Et(i), (e.callbackNode = null), (e.callbackPriority = 0));
    if ((a & 3) === 0 || cr(e, a)) {
      if (((t = a & -a), t === e.callbackPriority)) return t;
      switch ((i !== null && Et(i), Co(a))) {
        case 2:
        case 8:
          a = lu;
          break;
        case 32:
          a = Vt;
          break;
        case 268435456:
          a = yt;
          break;
        default:
          a = Vt;
      }
      return (
        (i = eD.bind(null, e)),
        (a = We(a, i)),
        (e.callbackPriority = t),
        (e.callbackNode = a),
        t
      );
    }
    return (
      i !== null && i !== null && Et(i),
      (e.callbackPriority = 2),
      (e.callbackNode = null),
      2
    );
  }
  function eD(e, t) {
    if (At !== 0 && At !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var a = e.callbackNode;
    if (Ai() && e.callbackNode !== a) return null;
    var i = Ue;
    return (
      (i = Ol(e, e === tt ? i : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      i === 0
        ? null
        : (zh(e, i, t),
          Ih(e, ct()),
          e.callbackNode != null && e.callbackNode === a ? eD.bind(null, e) : null)
    );
  }
  function tD(e, t) {
    if (Ai()) return null;
    zh(e, t, !0);
  }
  function Op() {
    qp(function () {
      (Pe & 6) !== 0 ? We(Yt, xp) : Jh();
    });
  }
  function rf() {
    if (Tn === 0) {
      var e = ja;
      (e === 0 && ((e = Fl), (Fl <<= 1), (Fl & 261888) === 0 && (Fl = 256)), (Tn = e));
    }
    return Tn;
  }
  function uD(e) {
    return e == null || typeof e == 'symbol' || typeof e == 'boolean'
      ? null
      : typeof e == 'function'
        ? e
        : Ml('' + e);
  }
  function nD(e, t) {
    var a = t.ownerDocument.createElement('input');
    return (
      (a.name = t.name),
      (a.value = t.value),
      e.id && a.setAttribute('form', e.id),
      t.parentNode.insertBefore(a, t),
      (e = new FormData(e)),
      a.parentNode.removeChild(a),
      e
    );
  }
  function wp(e, t, a, i, s) {
    if (t === 'submit' && a && a.stateNode === s) {
      var f = uD((s[Pt] || null).action),
        g = i.submitter;
      g &&
        ((t = (t = g[Pt] || null) ? uD(t.formAction) : g.getAttribute('formAction')),
        t !== null && ((f = t), (g = null)));
      var y = new Ll('action', 'action', null, i, s);
      e.push({
        event: y,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (i.defaultPrevented) {
                if (Tn !== 0) {
                  var O = g ? nD(s, g) : new FormData(s);
                  Fs(a, { pending: !0, data: O, method: s.method, action: f }, null, O);
                }
              } else
                typeof f == 'function' &&
                  (y.preventDefault(),
                  (O = g ? nD(s, g) : new FormData(s)),
                  Fs(a, { pending: !0, data: O, method: s.method, action: f }, f, O));
            },
            currentTarget: s,
          },
        ],
      });
    }
  }
  for (var lf = 0; lf < Go.length; lf++) {
    var of = Go[lf],
      Tp = of.toLowerCase(),
      Rp = of[0].toUpperCase() + of.slice(1);
    Eu(Tp, 'on' + Rp);
  }
  (Eu(Nd, 'onAnimationEnd'),
    Eu(zd, 'onAnimationIteration'),
    Eu(Ld, 'onAnimationStart'),
    Eu('dblclick', 'onDoubleClick'),
    Eu('focusin', 'onFocus'),
    Eu('focusout', 'onBlur'),
    Eu(X1, 'onTransitionRun'),
    Eu(Q1, 'onTransitionStart'),
    Eu(Z1, 'onTransitionCancel'),
    Eu(Hd, 'onTransitionEnd'),
    Ca('onMouseEnter', ['mouseout', 'mouseover']),
    Ca('onMouseLeave', ['mouseout', 'mouseover']),
    Ca('onPointerEnter', ['pointerout', 'pointerover']),
    Ca('onPointerLeave', ['pointerout', 'pointerover']),
    Vn('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    Vn(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    ),
    Vn('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Vn('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    Vn(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    ),
    Vn(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    ));
  var Xr =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' ',
      ),
    Mp = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(Xr),
    );
  function aD(e, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var i = e[a],
        s = i.event;
      i = i.listeners;
      e: {
        var f = void 0;
        if (t)
          for (var g = i.length - 1; 0 <= g; g--) {
            var y = i[g],
              O = y.instance,
              q = y.currentTarget;
            if (((y = y.listener), O !== f && s.isPropagationStopped())) break e;
            ((f = y), (s.currentTarget = q));
            try {
              f(s);
            } catch ($) {
              kl($);
            }
            ((s.currentTarget = null), (f = O));
          }
        else
          for (g = 0; g < i.length; g++) {
            if (
              ((y = i[g]),
              (O = y.instance),
              (q = y.currentTarget),
              (y = y.listener),
              O !== f && s.isPropagationStopped())
            )
              break e;
            ((f = y), (s.currentTarget = q));
            try {
              f(s);
            } catch ($) {
              kl($);
            }
            ((s.currentTarget = null), (f = O));
          }
      }
    }
  }
  function He(e, t) {
    var a = t[Eo];
    a === void 0 && (a = t[Eo] = new Set());
    var i = e + '__bubble';
    a.has(i) || (rD(t, e, 2, !1), a.add(i));
  }
  function sf(e, t, a) {
    var i = 0;
    (t && (i |= 4), rD(a, e, i, t));
  }
  var Fi = '_reactListening' + Math.random().toString(36).slice(2);
  function ff(e) {
    if (!e[Fi]) {
      ((e[Fi] = !0),
        Jc.forEach(function (a) {
          a !== 'selectionchange' && (Mp.has(a) || sf(a, !1, e), sf(a, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Fi] || ((t[Fi] = !0), sf('selectionchange', !1, t));
    }
  }
  function rD(e, t, a, i) {
    switch (ND(t)) {
      case 2:
        var s = lC;
        break;
      case 8:
        s = iC;
        break;
      default:
        s = Ff;
    }
    ((a = s.bind(null, t, a, e)),
      (s = void 0),
      !wo || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (s = !0),
      i
        ? s !== void 0
          ? e.addEventListener(t, a, { capture: !0, passive: s })
          : e.addEventListener(t, a, !0)
        : s !== void 0
          ? e.addEventListener(t, a, { passive: s })
          : e.addEventListener(t, a, !1));
  }
  function cf(e, t, a, i, s) {
    var f = i;
    if ((t & 1) === 0 && (t & 2) === 0 && i !== null)
      e: for (;;) {
        if (i === null) return;
        var g = i.tag;
        if (g === 3 || g === 4) {
          var y = i.stateNode.containerInfo;
          if (y === s) break;
          if (g === 4)
            for (g = i.return; g !== null;) {
              var O = g.tag;
              if ((O === 3 || O === 4) && g.stateNode.containerInfo === s) return;
              g = g.return;
            }
          for (; y !== null;) {
            if (((g = ga(y)), g === null)) return;
            if (((O = g.tag), O === 5 || O === 6 || O === 26 || O === 27)) {
              i = f = g;
              continue e;
            }
            y = y.parentNode;
          }
        }
        i = i.return;
      }
    fd(function () {
      var q = f,
        $ = xo(a),
        te = [];
      e: {
        var G = Ud.get(e);
        if (G !== void 0) {
          var P = Ll,
            me = e;
          switch (e) {
            case 'keypress':
              if (Nl(a) === 0) break e;
            case 'keydown':
            case 'keyup':
              P = F1;
              break;
            case 'focusin':
              ((me = 'focus'), (P = jo));
              break;
            case 'focusout':
              ((me = 'blur'), (P = jo));
              break;
            case 'beforeblur':
            case 'afterblur':
              P = jo;
              break;
            case 'click':
              if (a.button === 2) break e;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              P = hd;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              P = h1;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              P = O1;
              break;
            case Nd:
            case zd:
            case Ld:
              P = g1;
              break;
            case Hd:
              P = T1;
              break;
            case 'scroll':
            case 'scrollend':
              P = c1;
              break;
            case 'wheel':
              P = M1;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              P = p1;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              P = vd;
              break;
            case 'toggle':
            case 'beforetoggle':
              P = N1;
          }
          var Se = (t & 4) !== 0,
            et = !Se && (e === 'scroll' || e === 'scrollend'),
            H = Se ? (G !== null ? G + 'Capture' : null) : G;
          Se = [];
          for (var R = q, k; R !== null;) {
            var I = R;
            if (
              ((k = I.stateNode),
              (I = I.tag),
              (I !== 5 && I !== 26 && I !== 27) ||
                k === null ||
                H === null ||
                ((I = vr(R, H)), I != null && Se.push(Qr(R, I, k))),
              et)
            )
              break;
            R = R.return;
          }
          0 < Se.length && ((G = new P(G, me, null, a, $)), te.push({ event: G, listeners: Se }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((G = e === 'mouseover' || e === 'pointerover'),
            (P = e === 'mouseout' || e === 'pointerout'),
            G && a !== So && (me = a.relatedTarget || a.fromElement) && (ga(me) || me[va]))
          )
            break e;
          if (
            (P || G) &&
            ((G =
              $.window === $
                ? $
                : (G = $.ownerDocument)
                  ? G.defaultView || G.parentWindow
                  : window),
            P
              ? ((me = a.relatedTarget || a.toElement),
                (P = q),
                (me = me ? ga(me) : null),
                me !== null &&
                  ((et = c(me)), (Se = me.tag), me !== et || (Se !== 5 && Se !== 27 && Se !== 6)) &&
                  (me = null))
              : ((P = null), (me = q)),
            P !== me)
          ) {
            if (
              ((Se = hd),
              (I = 'onMouseLeave'),
              (H = 'onMouseEnter'),
              (R = 'mouse'),
              (e === 'pointerout' || e === 'pointerover') &&
                ((Se = vd), (I = 'onPointerLeave'), (H = 'onPointerEnter'), (R = 'pointer')),
              (et = P == null ? G : Dr(P)),
              (k = me == null ? G : Dr(me)),
              (G = new Se(I, R + 'leave', P, a, $)),
              (G.target = et),
              (G.relatedTarget = k),
              (I = null),
              ga($) === q &&
                ((Se = new Se(H, R + 'enter', me, a, $)),
                (Se.target = k),
                (Se.relatedTarget = et),
                (I = Se)),
              (et = I),
              P && me)
            )
              t: {
                for (Se = jp, H = P, R = me, k = 0, I = H; I; I = Se(I)) k++;
                I = 0;
                for (var Be = R; Be; Be = Se(Be)) I++;
                for (; 0 < k - I;) ((H = Se(H)), k--);
                for (; 0 < I - k;) ((R = Se(R)), I--);
                for (; k--;) {
                  if (H === R || (R !== null && H === R.alternate)) {
                    Se = H;
                    break t;
                  }
                  ((H = Se(H)), (R = Se(R)));
                }
                Se = null;
              }
            else Se = null;
            (P !== null && lD(te, G, P, Se, !1),
              me !== null && et !== null && lD(te, et, me, Se, !0));
          }
        }
        e: {
          if (
            ((G = q ? Dr(q) : window),
            (P = G.nodeName && G.nodeName.toLowerCase()),
            P === 'select' || (P === 'input' && G.type === 'file'))
          )
            var Ge = Bd;
          else if (yd(G))
            if (bd) Ge = V1;
            else {
              Ge = G1;
              var Ce = _1;
            }
          else
            ((P = G.nodeName),
              !P || P.toLowerCase() !== 'input' || (G.type !== 'checkbox' && G.type !== 'radio')
                ? q && Fo(q.elementType) && (Ge = Bd)
                : (Ge = Y1));
          if (Ge && (Ge = Ge(e, q))) {
            Ad(te, Ge, a, $);
            break e;
          }
          (Ce && Ce(e, G, q),
            e === 'focusout' &&
              q &&
              G.type === 'number' &&
              q.memoizedProps.value != null &&
              bo(G, 'number', G.value));
        }
        switch (((Ce = q ? Dr(q) : window), e)) {
          case 'focusin':
            (yd(Ce) || Ce.contentEditable === 'true') && ((Fa = Ce), (ko = q), (Br = null));
            break;
          case 'focusout':
            Br = ko = Fa = null;
            break;
          case 'mousedown':
            qo = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((qo = !1), Md(te, a, $));
            break;
          case 'selectionchange':
            if (K1) break;
          case 'keydown':
          case 'keyup':
            Md(te, a, $);
        }
        var je;
        if (zo)
          e: {
            switch (e) {
              case 'compositionstart':
                var ke = 'onCompositionStart';
                break e;
              case 'compositionend':
                ke = 'onCompositionEnd';
                break e;
              case 'compositionupdate':
                ke = 'onCompositionUpdate';
                break e;
            }
            ke = void 0;
          }
        else
          ba
            ? Cd(e, a) && (ke = 'onCompositionEnd')
            : e === 'keydown' && a.keyCode === 229 && (ke = 'onCompositionStart');
        (ke &&
          (gd &&
            a.locale !== 'ko' &&
            (ba || ke !== 'onCompositionStart'
              ? ke === 'onCompositionEnd' && ba && (je = cd())
              : ((Dn = $), (To = 'value' in Dn ? Dn.value : Dn.textContent), (ba = !0))),
          (Ce = Si(q, ke)),
          0 < Ce.length &&
            ((ke = new Dd(ke, e, null, a, $)),
            te.push({ event: ke, listeners: Ce }),
            je ? (ke.data = je) : ((je = Ed(a)), je !== null && (ke.data = je)))),
          (je = L1 ? H1(e, a) : U1(e, a)) &&
            ((ke = Si(q, 'onBeforeInput')),
            0 < ke.length &&
              ((Ce = new Dd('onBeforeInput', 'beforeinput', null, a, $)),
              te.push({ event: Ce, listeners: ke }),
              (Ce.data = je))),
          wp(te, e, q, a, $));
      }
      aD(te, t);
    });
  }
  function Qr(e, t, a) {
    return { instance: e, listener: t, currentTarget: a };
  }
  function Si(e, t) {
    for (var a = t + 'Capture', i = []; e !== null;) {
      var s = e,
        f = s.stateNode;
      if (
        ((s = s.tag),
        (s !== 5 && s !== 26 && s !== 27) ||
          f === null ||
          ((s = vr(e, a)),
          s != null && i.unshift(Qr(e, s, f)),
          (s = vr(e, t)),
          s != null && i.push(Qr(e, s, f))),
        e.tag === 3)
      )
        return i;
      e = e.return;
    }
    return [];
  }
  function jp(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function lD(e, t, a, i, s) {
    for (var f = t._reactName, g = []; a !== null && a !== i;) {
      var y = a,
        O = y.alternate,
        q = y.stateNode;
      if (((y = y.tag), O !== null && O === i)) break;
      ((y !== 5 && y !== 26 && y !== 27) ||
        q === null ||
        ((O = q),
        s
          ? ((q = vr(a, f)), q != null && g.unshift(Qr(a, q, O)))
          : s || ((q = vr(a, f)), q != null && g.push(Qr(a, q, O)))),
        (a = a.return));
    }
    g.length !== 0 && e.push({ event: t, listeners: g });
  }
  var Np = /\r\n?/g,
    zp = /\u0000|\uFFFD/g;
  function iD(e) {
    return (typeof e == 'string' ? e : '' + e)
      .replace(
        Np,
        `
`,
      )
      .replace(zp, '');
  }
  function oD(e, t) {
    return ((t = iD(t)), iD(e) === t);
  }
  function Ie(e, t, a, i, s, f) {
    switch (a) {
      case 'children':
        typeof i == 'string'
          ? t === 'body' || (t === 'textarea' && i === '') || ya(e, i)
          : (typeof i == 'number' || typeof i == 'bigint') && t !== 'body' && ya(e, '' + i);
        break;
      case 'className':
        Tl(e, 'class', i);
        break;
      case 'tabIndex':
        Tl(e, 'tabindex', i);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        Tl(e, a, i);
        break;
      case 'style':
        od(e, i, f);
        break;
      case 'data':
        if (t !== 'object') {
          Tl(e, 'data', i);
          break;
        }
      case 'src':
      case 'href':
        if (i === '' && (t !== 'a' || a !== 'href')) {
          e.removeAttribute(a);
          break;
        }
        if (i == null || typeof i == 'function' || typeof i == 'symbol' || typeof i == 'boolean') {
          e.removeAttribute(a);
          break;
        }
        ((i = Ml('' + i)), e.setAttribute(a, i));
        break;
      case 'action':
      case 'formAction':
        if (typeof i == 'function') {
          e.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof f == 'function' &&
            (a === 'formAction'
              ? (t !== 'input' && Ie(e, t, 'name', s.name, s, null),
                Ie(e, t, 'formEncType', s.formEncType, s, null),
                Ie(e, t, 'formMethod', s.formMethod, s, null),
                Ie(e, t, 'formTarget', s.formTarget, s, null))
              : (Ie(e, t, 'encType', s.encType, s, null),
                Ie(e, t, 'method', s.method, s, null),
                Ie(e, t, 'target', s.target, s, null)));
        if (i == null || typeof i == 'symbol' || typeof i == 'boolean') {
          e.removeAttribute(a);
          break;
        }
        ((i = Ml('' + i)), e.setAttribute(a, i));
        break;
      case 'onClick':
        i != null && (e.onclick = Hu);
        break;
      case 'onScroll':
        i != null && He('scroll', e);
        break;
      case 'onScrollEnd':
        i != null && He('scrollend', e);
        break;
      case 'dangerouslySetInnerHTML':
        if (i != null) {
          if (typeof i != 'object' || !('__html' in i)) throw Error(l(61));
          if (((a = i.__html), a != null)) {
            if (s.children != null) throw Error(l(60));
            e.innerHTML = a;
          }
        }
        break;
      case 'multiple':
        e.multiple = i && typeof i != 'function' && typeof i != 'symbol';
        break;
      case 'muted':
        e.muted = i && typeof i != 'function' && typeof i != 'symbol';
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        break;
      case 'autoFocus':
        break;
      case 'xlinkHref':
        if (i == null || typeof i == 'function' || typeof i == 'boolean' || typeof i == 'symbol') {
          e.removeAttribute('xlink:href');
          break;
        }
        ((a = Ml('' + i)), e.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', a));
        break;
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        i != null && typeof i != 'function' && typeof i != 'symbol'
          ? e.setAttribute(a, '' + i)
          : e.removeAttribute(a);
        break;
      case 'inert':
      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        i && typeof i != 'function' && typeof i != 'symbol'
          ? e.setAttribute(a, '')
          : e.removeAttribute(a);
        break;
      case 'capture':
      case 'download':
        i === !0
          ? e.setAttribute(a, '')
          : i !== !1 && i != null && typeof i != 'function' && typeof i != 'symbol'
            ? e.setAttribute(a, i)
            : e.removeAttribute(a);
        break;
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        i != null && typeof i != 'function' && typeof i != 'symbol' && !isNaN(i) && 1 <= i
          ? e.setAttribute(a, i)
          : e.removeAttribute(a);
        break;
      case 'rowSpan':
      case 'start':
        i == null || typeof i == 'function' || typeof i == 'symbol' || isNaN(i)
          ? e.removeAttribute(a)
          : e.setAttribute(a, i);
        break;
      case 'popover':
        (He('beforetoggle', e), He('toggle', e), wl(e, 'popover', i));
        break;
      case 'xlinkActuate':
        Lu(e, 'http://www.w3.org/1999/xlink', 'xlink:actuate', i);
        break;
      case 'xlinkArcrole':
        Lu(e, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', i);
        break;
      case 'xlinkRole':
        Lu(e, 'http://www.w3.org/1999/xlink', 'xlink:role', i);
        break;
      case 'xlinkShow':
        Lu(e, 'http://www.w3.org/1999/xlink', 'xlink:show', i);
        break;
      case 'xlinkTitle':
        Lu(e, 'http://www.w3.org/1999/xlink', 'xlink:title', i);
        break;
      case 'xlinkType':
        Lu(e, 'http://www.w3.org/1999/xlink', 'xlink:type', i);
        break;
      case 'xmlBase':
        Lu(e, 'http://www.w3.org/XML/1998/namespace', 'xml:base', i);
        break;
      case 'xmlLang':
        Lu(e, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', i);
        break;
      case 'xmlSpace':
        Lu(e, 'http://www.w3.org/XML/1998/namespace', 'xml:space', i);
        break;
      case 'is':
        wl(e, 'is', i);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < a.length) || (a[0] !== 'o' && a[0] !== 'O') || (a[1] !== 'n' && a[1] !== 'N')) &&
          ((a = s1.get(a) || a), wl(e, a, i));
    }
  }
  function df(e, t, a, i, s, f) {
    switch (a) {
      case 'style':
        od(e, i, f);
        break;
      case 'dangerouslySetInnerHTML':
        if (i != null) {
          if (typeof i != 'object' || !('__html' in i)) throw Error(l(61));
          if (((a = i.__html), a != null)) {
            if (s.children != null) throw Error(l(60));
            e.innerHTML = a;
          }
        }
        break;
      case 'children':
        typeof i == 'string'
          ? ya(e, i)
          : (typeof i == 'number' || typeof i == 'bigint') && ya(e, '' + i);
        break;
      case 'onScroll':
        i != null && He('scroll', e);
        break;
      case 'onScrollEnd':
        i != null && He('scrollend', e);
        break;
      case 'onClick':
        i != null && (e.onclick = Hu);
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'innerHTML':
      case 'ref':
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        if (!Ic.hasOwnProperty(a))
          e: {
            if (
              a[0] === 'o' &&
              a[1] === 'n' &&
              ((s = a.endsWith('Capture')),
              (t = a.slice(2, s ? a.length - 7 : void 0)),
              (f = e[Pt] || null),
              (f = f != null ? f[a] : null),
              typeof f == 'function' && e.removeEventListener(t, f, s),
              typeof i == 'function')
            ) {
              (typeof f != 'function' &&
                f !== null &&
                (a in e ? (e[a] = null) : e.hasAttribute(a) && e.removeAttribute(a)),
                e.addEventListener(t, i, s));
              break e;
            }
            a in e ? (e[a] = i) : i === !0 ? e.setAttribute(a, '') : wl(e, a, i);
          }
    }
  }
  function Mt(e, t, a) {
    switch (t) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'img':
        (He('error', e), He('load', e));
        var i = !1,
          s = !1,
          f;
        for (f in a)
          if (a.hasOwnProperty(f)) {
            var g = a[f];
            if (g != null)
              switch (f) {
                case 'src':
                  i = !0;
                  break;
                case 'srcSet':
                  s = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(l(137, t));
                default:
                  Ie(e, t, f, g, a, null);
              }
          }
        (s && Ie(e, t, 'srcSet', a.srcSet, a, null), i && Ie(e, t, 'src', a.src, a, null));
        return;
      case 'input':
        He('invalid', e);
        var y = (f = g = s = null),
          O = null,
          q = null;
        for (i in a)
          if (a.hasOwnProperty(i)) {
            var $ = a[i];
            if ($ != null)
              switch (i) {
                case 'name':
                  s = $;
                  break;
                case 'type':
                  g = $;
                  break;
                case 'checked':
                  O = $;
                  break;
                case 'defaultChecked':
                  q = $;
                  break;
                case 'value':
                  f = $;
                  break;
                case 'defaultValue':
                  y = $;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if ($ != null) throw Error(l(137, t));
                  break;
                default:
                  Ie(e, t, i, $, a, null);
              }
          }
        ad(e, f, y, O, q, g, s, !1);
        return;
      case 'select':
        (He('invalid', e), (i = g = f = null));
        for (s in a)
          if (a.hasOwnProperty(s) && ((y = a[s]), y != null))
            switch (s) {
              case 'value':
                f = y;
                break;
              case 'defaultValue':
                g = y;
                break;
              case 'multiple':
                i = y;
              default:
                Ie(e, t, s, y, a, null);
            }
        ((t = f),
          (a = g),
          (e.multiple = !!i),
          t != null ? Ea(e, !!i, t, !1) : a != null && Ea(e, !!i, a, !0));
        return;
      case 'textarea':
        (He('invalid', e), (f = s = i = null));
        for (g in a)
          if (a.hasOwnProperty(g) && ((y = a[g]), y != null))
            switch (g) {
              case 'value':
                i = y;
                break;
              case 'defaultValue':
                s = y;
                break;
              case 'children':
                f = y;
                break;
              case 'dangerouslySetInnerHTML':
                if (y != null) throw Error(l(91));
                break;
              default:
                Ie(e, t, g, y, a, null);
            }
        ld(e, i, s, f);
        return;
      case 'option':
        for (O in a)
          if (a.hasOwnProperty(O) && ((i = a[O]), i != null))
            switch (O) {
              case 'selected':
                e.selected = i && typeof i != 'function' && typeof i != 'symbol';
                break;
              default:
                Ie(e, t, O, i, a, null);
            }
        return;
      case 'dialog':
        (He('beforetoggle', e), He('toggle', e), He('cancel', e), He('close', e));
        break;
      case 'iframe':
      case 'object':
        He('load', e);
        break;
      case 'video':
      case 'audio':
        for (i = 0; i < Xr.length; i++) He(Xr[i], e);
        break;
      case 'image':
        (He('error', e), He('load', e));
        break;
      case 'details':
        He('toggle', e);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (He('error', e), He('load', e));
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (q in a)
          if (a.hasOwnProperty(q) && ((i = a[q]), i != null))
            switch (q) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(l(137, t));
              default:
                Ie(e, t, q, i, a, null);
            }
        return;
      default:
        if (Fo(t)) {
          for ($ in a)
            a.hasOwnProperty($) && ((i = a[$]), i !== void 0 && df(e, t, $, i, a, void 0));
          return;
        }
    }
    for (y in a) a.hasOwnProperty(y) && ((i = a[y]), i != null && Ie(e, t, y, i, a, null));
  }
  function Lp(e, t, a, i) {
    switch (t) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'input':
        var s = null,
          f = null,
          g = null,
          y = null,
          O = null,
          q = null,
          $ = null;
        for (P in a) {
          var te = a[P];
          if (a.hasOwnProperty(P) && te != null)
            switch (P) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                O = te;
              default:
                i.hasOwnProperty(P) || Ie(e, t, P, null, i, te);
            }
        }
        for (var G in i) {
          var P = i[G];
          if (((te = a[G]), i.hasOwnProperty(G) && (P != null || te != null)))
            switch (G) {
              case 'type':
                f = P;
                break;
              case 'name':
                s = P;
                break;
              case 'checked':
                q = P;
                break;
              case 'defaultChecked':
                $ = P;
                break;
              case 'value':
                g = P;
                break;
              case 'defaultValue':
                y = P;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (P != null) throw Error(l(137, t));
                break;
              default:
                P !== te && Ie(e, t, G, P, i, te);
            }
        }
        Bo(e, g, y, O, q, $, f, s);
        return;
      case 'select':
        P = g = y = G = null;
        for (f in a)
          if (((O = a[f]), a.hasOwnProperty(f) && O != null))
            switch (f) {
              case 'value':
                break;
              case 'multiple':
                P = O;
              default:
                i.hasOwnProperty(f) || Ie(e, t, f, null, i, O);
            }
        for (s in i)
          if (((f = i[s]), (O = a[s]), i.hasOwnProperty(s) && (f != null || O != null)))
            switch (s) {
              case 'value':
                G = f;
                break;
              case 'defaultValue':
                y = f;
                break;
              case 'multiple':
                g = f;
              default:
                f !== O && Ie(e, t, s, f, i, O);
            }
        ((t = y),
          (a = g),
          (i = P),
          G != null
            ? Ea(e, !!a, G, !1)
            : !!i != !!a && (t != null ? Ea(e, !!a, t, !0) : Ea(e, !!a, a ? [] : '', !1)));
        return;
      case 'textarea':
        P = G = null;
        for (y in a)
          if (((s = a[y]), a.hasOwnProperty(y) && s != null && !i.hasOwnProperty(y)))
            switch (y) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                Ie(e, t, y, null, i, s);
            }
        for (g in i)
          if (((s = i[g]), (f = a[g]), i.hasOwnProperty(g) && (s != null || f != null)))
            switch (g) {
              case 'value':
                G = s;
                break;
              case 'defaultValue':
                P = s;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (s != null) throw Error(l(91));
                break;
              default:
                s !== f && Ie(e, t, g, s, i, f);
            }
        rd(e, G, P);
        return;
      case 'option':
        for (var me in a)
          if (((G = a[me]), a.hasOwnProperty(me) && G != null && !i.hasOwnProperty(me)))
            switch (me) {
              case 'selected':
                e.selected = !1;
                break;
              default:
                Ie(e, t, me, null, i, G);
            }
        for (O in i)
          if (((G = i[O]), (P = a[O]), i.hasOwnProperty(O) && G !== P && (G != null || P != null)))
            switch (O) {
              case 'selected':
                e.selected = G && typeof G != 'function' && typeof G != 'symbol';
                break;
              default:
                Ie(e, t, O, G, i, P);
            }
        return;
      case 'img':
      case 'link':
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (var Se in a)
          ((G = a[Se]),
            a.hasOwnProperty(Se) && G != null && !i.hasOwnProperty(Se) && Ie(e, t, Se, null, i, G));
        for (q in i)
          if (((G = i[q]), (P = a[q]), i.hasOwnProperty(q) && G !== P && (G != null || P != null)))
            switch (q) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (G != null) throw Error(l(137, t));
                break;
              default:
                Ie(e, t, q, G, i, P);
            }
        return;
      default:
        if (Fo(t)) {
          for (var et in a)
            ((G = a[et]),
              a.hasOwnProperty(et) &&
                G !== void 0 &&
                !i.hasOwnProperty(et) &&
                df(e, t, et, void 0, i, G));
          for ($ in i)
            ((G = i[$]),
              (P = a[$]),
              !i.hasOwnProperty($) ||
                G === P ||
                (G === void 0 && P === void 0) ||
                df(e, t, $, G, i, P));
          return;
        }
    }
    for (var H in a)
      ((G = a[H]),
        a.hasOwnProperty(H) && G != null && !i.hasOwnProperty(H) && Ie(e, t, H, null, i, G));
    for (te in i)
      ((G = i[te]),
        (P = a[te]),
        !i.hasOwnProperty(te) || G === P || (G == null && P == null) || Ie(e, t, te, G, i, P));
  }
  function sD(e) {
    switch (e) {
      case 'css':
      case 'script':
      case 'font':
      case 'img':
      case 'image':
      case 'input':
      case 'link':
        return !0;
      default:
        return !1;
    }
  }
  function Hp() {
    if (typeof performance.getEntriesByType == 'function') {
      for (
        var e = 0, t = 0, a = performance.getEntriesByType('resource'), i = 0;
        i < a.length;
        i++
      ) {
        var s = a[i],
          f = s.transferSize,
          g = s.initiatorType,
          y = s.duration;
        if (f && y && sD(g)) {
          for (g = 0, y = s.responseEnd, i += 1; i < a.length; i++) {
            var O = a[i],
              q = O.startTime;
            if (q > y) break;
            var $ = O.transferSize,
              te = O.initiatorType;
            $ && sD(te) && ((O = O.responseEnd), (g += $ * (O < y ? 1 : (y - q) / (O - q))));
          }
          if ((--i, (t += (8 * (f + g)) / (s.duration / 1e3)), e++, 10 < e)) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && ((e = navigator.connection.downlink), typeof e == 'number')
      ? e
      : 5;
  }
  var hf = null,
    Df = null;
  function xi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function fD(e) {
    switch (e) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function cD(e, t) {
    if (e === 0)
      switch (t) {
        case 'svg':
          return 1;
        case 'math':
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === 'foreignObject' ? 0 : e;
  }
  function vf(e, t) {
    return (
      e === 'textarea' ||
      e === 'noscript' ||
      typeof t.children == 'string' ||
      typeof t.children == 'number' ||
      typeof t.children == 'bigint' ||
      (typeof t.dangerouslySetInnerHTML == 'object' &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var gf = null;
  function Up() {
    var e = window.event;
    return e && e.type === 'popstate' ? (e === gf ? !1 : ((gf = e), !0)) : ((gf = null), !1);
  }
  var dD = typeof setTimeout == 'function' ? setTimeout : void 0,
    kp = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    hD = typeof Promise == 'function' ? Promise : void 0,
    qp =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof hD < 'u'
          ? function (e) {
              return hD.resolve(null).then(e).catch(_p);
            }
          : dD;
  function _p(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Rn(e) {
    return e === 'head';
  }
  function DD(e, t) {
    var a = t,
      i = 0;
    do {
      var s = a.nextSibling;
      if ((e.removeChild(a), s && s.nodeType === 8))
        if (((a = s.data), a === '/$' || a === '/&')) {
          if (i === 0) {
            (e.removeChild(s), Ja(t));
            return;
          }
          i--;
        } else if (a === '$' || a === '$?' || a === '$~' || a === '$!' || a === '&') i++;
        else if (a === 'html') Zr(e.ownerDocument.documentElement);
        else if (a === 'head') {
          ((a = e.ownerDocument.head), Zr(a));
          for (var f = a.firstChild; f;) {
            var g = f.nextSibling,
              y = f.nodeName;
            (f[hr] ||
              y === 'SCRIPT' ||
              y === 'STYLE' ||
              (y === 'LINK' && f.rel.toLowerCase() === 'stylesheet') ||
              a.removeChild(f),
              (f = g));
          }
        } else a === 'body' && Zr(e.ownerDocument.body);
      a = s;
    } while (a);
    Ja(t);
  }
  function vD(e, t) {
    var a = e;
    e = 0;
    do {
      var i = a.nextSibling;
      if (
        (a.nodeType === 1
          ? t
            ? ((a._stashedDisplay = a.style.display), (a.style.display = 'none'))
            : ((a.style.display = a._stashedDisplay || ''),
              a.getAttribute('style') === '' && a.removeAttribute('style'))
          : a.nodeType === 3 &&
            (t
              ? ((a._stashedText = a.nodeValue), (a.nodeValue = ''))
              : (a.nodeValue = a._stashedText || '')),
        i && i.nodeType === 8)
      )
        if (((a = i.data), a === '/$')) {
          if (e === 0) break;
          e--;
        } else (a !== '$' && a !== '$?' && a !== '$~' && a !== '$!') || e++;
      a = i;
    } while (a);
  }
  function mf(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
      var a = t;
      switch (((t = t.nextSibling), a.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (mf(a), yo(a));
          continue;
        case 'SCRIPT':
        case 'STYLE':
          continue;
        case 'LINK':
          if (a.rel.toLowerCase() === 'stylesheet') continue;
      }
      e.removeChild(a);
    }
  }
  function Gp(e, t, a, i) {
    for (; e.nodeType === 1;) {
      var s = a;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!i && (e.nodeName !== 'INPUT' || e.type !== 'hidden')) break;
      } else if (i) {
        if (!e[hr])
          switch (t) {
            case 'meta':
              if (!e.hasAttribute('itemprop')) break;
              return e;
            case 'link':
              if (
                ((f = e.getAttribute('rel')),
                f === 'stylesheet' && e.hasAttribute('data-precedence'))
              )
                break;
              if (
                f !== s.rel ||
                e.getAttribute('href') !== (s.href == null || s.href === '' ? null : s.href) ||
                e.getAttribute('crossorigin') !== (s.crossOrigin == null ? null : s.crossOrigin) ||
                e.getAttribute('title') !== (s.title == null ? null : s.title)
              )
                break;
              return e;
            case 'style':
              if (e.hasAttribute('data-precedence')) break;
              return e;
            case 'script':
              if (
                ((f = e.getAttribute('src')),
                (f !== (s.src == null ? null : s.src) ||
                  e.getAttribute('type') !== (s.type == null ? null : s.type) ||
                  e.getAttribute('crossorigin') !==
                    (s.crossOrigin == null ? null : s.crossOrigin)) &&
                  f &&
                  e.hasAttribute('async') &&
                  !e.hasAttribute('itemprop'))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === 'input' && e.type === 'hidden') {
        var f = s.name == null ? null : '' + s.name;
        if (s.type === 'hidden' && e.getAttribute('name') === f) return e;
      } else return e;
      if (((e = vu(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function Yp(e, t, a) {
    if (t === '') return null;
    for (; e.nodeType !== 3;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !a) ||
        ((e = vu(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function gD(e, t) {
    for (; e.nodeType !== 8;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !t) ||
        ((e = vu(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function pf(e) {
    return e.data === '$?' || e.data === '$~';
  }
  function Cf(e) {
    return e.data === '$!' || (e.data === '$?' && e.ownerDocument.readyState !== 'loading');
  }
  function Vp(e, t) {
    var a = e.ownerDocument;
    if (e.data === '$~') e._reactRetry = t;
    else if (e.data !== '$?' || a.readyState !== 'loading') t();
    else {
      var i = function () {
        (t(), a.removeEventListener('DOMContentLoaded', i));
      };
      (a.addEventListener('DOMContentLoaded', i), (e._reactRetry = i));
    }
  }
  function vu(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = e.data),
          t === '$' ||
            t === '$!' ||
            t === '$?' ||
            t === '$~' ||
            t === '&' ||
            t === 'F!' ||
            t === 'F')
        )
          break;
        if (t === '/$' || t === '/&') return null;
      }
    }
    return e;
  }
  var Ef = null;
  function mD(e) {
    e = e.nextSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === '/$' || a === '/&') {
          if (t === 0) return vu(e.nextSibling);
          t--;
        } else (a !== '$' && a !== '$!' && a !== '$?' && a !== '$~' && a !== '&') || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function pD(e) {
    e = e.previousSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === '$' || a === '$!' || a === '$?' || a === '$~' || a === '&') {
          if (t === 0) return e;
          t--;
        } else (a !== '/$' && a !== '/&') || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function CD(e, t, a) {
    switch (((t = xi(a)), e)) {
      case 'html':
        if (((e = t.documentElement), !e)) throw Error(l(452));
        return e;
      case 'head':
        if (((e = t.head), !e)) throw Error(l(453));
        return e;
      case 'body':
        if (((e = t.body), !e)) throw Error(l(454));
        return e;
      default:
        throw Error(l(451));
    }
  }
  function Zr(e) {
    for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
    yo(e);
  }
  var gu = new Map(),
    ED = new Set();
  function Oi(e) {
    return typeof e.getRootNode == 'function'
      ? e.getRootNode()
      : e.nodeType === 9
        ? e
        : e.ownerDocument;
  }
  var Iu = V.d;
  V.d = { f: Pp, r: Kp, D: Xp, C: Qp, L: Zp, m: $p, X: Jp, S: Wp, M: Ip };
  function Pp() {
    var e = Iu.f(),
      t = Ci();
    return e || t;
  }
  function Kp(e) {
    var t = ma(e);
    t !== null && t.tag === 5 && t.type === 'form' ? H0(t) : Iu.r(e);
  }
  var Za = typeof document > 'u' ? null : document;
  function yD(e, t, a) {
    var i = Za;
    if (i && typeof t == 'string' && t) {
      var s = ou(t);
      ((s = 'link[rel="' + e + '"][href="' + s + '"]'),
        typeof a == 'string' && (s += '[crossorigin="' + a + '"]'),
        ED.has(s) ||
          (ED.add(s),
          (e = { rel: e, crossOrigin: a, href: t }),
          i.querySelector(s) === null &&
            ((t = i.createElement('link')), Mt(t, 'link', e), bt(t), i.head.appendChild(t))));
    }
  }
  function Xp(e) {
    (Iu.D(e), yD('dns-prefetch', e, null));
  }
  function Qp(e, t) {
    (Iu.C(e, t), yD('preconnect', e, t));
  }
  function Zp(e, t, a) {
    Iu.L(e, t, a);
    var i = Za;
    if (i && e && t) {
      var s = 'link[rel="preload"][as="' + ou(t) + '"]';
      t === 'image' && a && a.imageSrcSet
        ? ((s += '[imagesrcset="' + ou(a.imageSrcSet) + '"]'),
          typeof a.imageSizes == 'string' && (s += '[imagesizes="' + ou(a.imageSizes) + '"]'))
        : (s += '[href="' + ou(e) + '"]');
      var f = s;
      switch (t) {
        case 'style':
          f = $a(e);
          break;
        case 'script':
          f = Wa(e);
      }
      gu.has(f) ||
        ((e = C(
          { rel: 'preload', href: t === 'image' && a && a.imageSrcSet ? void 0 : e, as: t },
          a,
        )),
        gu.set(f, e),
        i.querySelector(s) !== null ||
          (t === 'style' && i.querySelector($r(f))) ||
          (t === 'script' && i.querySelector(Wr(f))) ||
          ((t = i.createElement('link')), Mt(t, 'link', e), bt(t), i.head.appendChild(t)));
    }
  }
  function $p(e, t) {
    Iu.m(e, t);
    var a = Za;
    if (a && e) {
      var i = t && typeof t.as == 'string' ? t.as : 'script',
        s = 'link[rel="modulepreload"][as="' + ou(i) + '"][href="' + ou(e) + '"]',
        f = s;
      switch (i) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          f = Wa(e);
      }
      if (
        !gu.has(f) &&
        ((e = C({ rel: 'modulepreload', href: e }, t)), gu.set(f, e), a.querySelector(s) === null)
      ) {
        switch (i) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (a.querySelector(Wr(f))) return;
        }
        ((i = a.createElement('link')), Mt(i, 'link', e), bt(i), a.head.appendChild(i));
      }
    }
  }
  function Wp(e, t, a) {
    Iu.S(e, t, a);
    var i = Za;
    if (i && e) {
      var s = pa(i).hoistableStyles,
        f = $a(e);
      t = t || 'default';
      var g = s.get(f);
      if (!g) {
        var y = { loading: 0, preload: null };
        if ((g = i.querySelector($r(f)))) y.loading = 5;
        else {
          ((e = C({ rel: 'stylesheet', href: e, 'data-precedence': t }, a)),
            (a = gu.get(f)) && yf(e, a));
          var O = (g = i.createElement('link'));
          (bt(O),
            Mt(O, 'link', e),
            (O._p = new Promise(function (q, $) {
              ((O.onload = q), (O.onerror = $));
            })),
            O.addEventListener('load', function () {
              y.loading |= 1;
            }),
            O.addEventListener('error', function () {
              y.loading |= 2;
            }),
            (y.loading |= 4),
            wi(g, t, i));
        }
        ((g = { type: 'stylesheet', instance: g, count: 1, state: y }), s.set(f, g));
      }
    }
  }
  function Jp(e, t) {
    Iu.X(e, t);
    var a = Za;
    if (a && e) {
      var i = pa(a).hoistableScripts,
        s = Wa(e),
        f = i.get(s);
      f ||
        ((f = a.querySelector(Wr(s))),
        f ||
          ((e = C({ src: e, async: !0 }, t)),
          (t = gu.get(s)) && Af(e, t),
          (f = a.createElement('script')),
          bt(f),
          Mt(f, 'link', e),
          a.head.appendChild(f)),
        (f = { type: 'script', instance: f, count: 1, state: null }),
        i.set(s, f));
    }
  }
  function Ip(e, t) {
    Iu.M(e, t);
    var a = Za;
    if (a && e) {
      var i = pa(a).hoistableScripts,
        s = Wa(e),
        f = i.get(s);
      f ||
        ((f = a.querySelector(Wr(s))),
        f ||
          ((e = C({ src: e, async: !0, type: 'module' }, t)),
          (t = gu.get(s)) && Af(e, t),
          (f = a.createElement('script')),
          bt(f),
          Mt(f, 'link', e),
          a.head.appendChild(f)),
        (f = { type: 'script', instance: f, count: 1, state: null }),
        i.set(s, f));
    }
  }
  function AD(e, t, a, i) {
    var s = (s = Ae.current) ? Oi(s) : null;
    if (!s) throw Error(l(446));
    switch (e) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof a.precedence == 'string' && typeof a.href == 'string'
          ? ((t = $a(a.href)),
            (a = pa(s).hoistableStyles),
            (i = a.get(t)),
            i || ((i = { type: 'style', instance: null, count: 0, state: null }), a.set(t, i)),
            i)
          : { type: 'void', instance: null, count: 0, state: null };
      case 'link':
        if (
          a.rel === 'stylesheet' &&
          typeof a.href == 'string' &&
          typeof a.precedence == 'string'
        ) {
          e = $a(a.href);
          var f = pa(s).hoistableStyles,
            g = f.get(e);
          if (
            (g ||
              ((s = s.ownerDocument || s),
              (g = {
                type: 'stylesheet',
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              f.set(e, g),
              (f = s.querySelector($r(e))) && !f._p && ((g.instance = f), (g.state.loading = 5)),
              gu.has(e) ||
                ((a = {
                  rel: 'preload',
                  as: 'style',
                  href: a.href,
                  crossOrigin: a.crossOrigin,
                  integrity: a.integrity,
                  media: a.media,
                  hrefLang: a.hrefLang,
                  referrerPolicy: a.referrerPolicy,
                }),
                gu.set(e, a),
                f || eC(s, e, a, g.state))),
            t && i === null)
          )
            throw Error(l(528, ''));
          return g;
        }
        if (t && i !== null) throw Error(l(529, ''));
        return null;
      case 'script':
        return (
          (t = a.async),
          (a = a.src),
          typeof a == 'string' && t && typeof t != 'function' && typeof t != 'symbol'
            ? ((t = Wa(a)),
              (a = pa(s).hoistableScripts),
              (i = a.get(t)),
              i || ((i = { type: 'script', instance: null, count: 0, state: null }), a.set(t, i)),
              i)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(l(444, e));
    }
  }
  function $a(e) {
    return 'href="' + ou(e) + '"';
  }
  function $r(e) {
    return 'link[rel="stylesheet"][' + e + ']';
  }
  function BD(e) {
    return C({}, e, { 'data-precedence': e.precedence, precedence: null });
  }
  function eC(e, t, a, i) {
    e.querySelector('link[rel="preload"][as="style"][' + t + ']')
      ? (i.loading = 1)
      : ((t = e.createElement('link')),
        (i.preload = t),
        t.addEventListener('load', function () {
          return (i.loading |= 1);
        }),
        t.addEventListener('error', function () {
          return (i.loading |= 2);
        }),
        Mt(t, 'link', a),
        bt(t),
        e.head.appendChild(t));
  }
  function Wa(e) {
    return '[src="' + ou(e) + '"]';
  }
  function Wr(e) {
    return 'script[async]' + e;
  }
  function bD(e, t, a) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case 'style':
          var i = e.querySelector('style[data-href~="' + ou(a.href) + '"]');
          if (i) return ((t.instance = i), bt(i), i);
          var s = C({}, a, {
            'data-href': a.href,
            'data-precedence': a.precedence,
            href: null,
            precedence: null,
          });
          return (
            (i = (e.ownerDocument || e).createElement('style')),
            bt(i),
            Mt(i, 'style', s),
            wi(i, a.precedence, e),
            (t.instance = i)
          );
        case 'stylesheet':
          s = $a(a.href);
          var f = e.querySelector($r(s));
          if (f) return ((t.state.loading |= 4), (t.instance = f), bt(f), f);
          ((i = BD(a)),
            (s = gu.get(s)) && yf(i, s),
            (f = (e.ownerDocument || e).createElement('link')),
            bt(f));
          var g = f;
          return (
            (g._p = new Promise(function (y, O) {
              ((g.onload = y), (g.onerror = O));
            })),
            Mt(f, 'link', i),
            (t.state.loading |= 4),
            wi(f, a.precedence, e),
            (t.instance = f)
          );
        case 'script':
          return (
            (f = Wa(a.src)),
            (s = e.querySelector(Wr(f)))
              ? ((t.instance = s), bt(s), s)
              : ((i = a),
                (s = gu.get(f)) && ((i = C({}, a)), Af(i, s)),
                (e = e.ownerDocument || e),
                (s = e.createElement('script')),
                bt(s),
                Mt(s, 'link', i),
                e.head.appendChild(s),
                (t.instance = s))
          );
        case 'void':
          return null;
        default:
          throw Error(l(443, t.type));
      }
    else
      t.type === 'stylesheet' &&
        (t.state.loading & 4) === 0 &&
        ((i = t.instance), (t.state.loading |= 4), wi(i, a.precedence, e));
    return t.instance;
  }
  function wi(e, t, a) {
    for (
      var i = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        s = i.length ? i[i.length - 1] : null,
        f = s,
        g = 0;
      g < i.length;
      g++
    ) {
      var y = i[g];
      if (y.dataset.precedence === t) f = y;
      else if (f !== s) break;
    }
    f
      ? f.parentNode.insertBefore(e, f.nextSibling)
      : ((t = a.nodeType === 9 ? a.head : a), t.insertBefore(e, t.firstChild));
  }
  function yf(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function Af(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var Ti = null;
  function FD(e, t, a) {
    if (Ti === null) {
      var i = new Map(),
        s = (Ti = new Map());
      s.set(a, i);
    } else ((s = Ti), (i = s.get(a)), i || ((i = new Map()), s.set(a, i)));
    if (i.has(e)) return i;
    for (i.set(e, null), a = a.getElementsByTagName(e), s = 0; s < a.length; s++) {
      var f = a[s];
      if (
        !(f[hr] || f[Ot] || (e === 'link' && f.getAttribute('rel') === 'stylesheet')) &&
        f.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var g = f.getAttribute(t) || '';
        g = e + g;
        var y = i.get(g);
        y ? y.push(f) : i.set(g, [f]);
      }
    }
    return i;
  }
  function SD(e, t, a) {
    ((e = e.ownerDocument || e),
      e.head.insertBefore(a, t === 'title' ? e.querySelector('head > title') : null));
  }
  function tC(e, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
    switch (e) {
      case 'meta':
      case 'title':
        return !0;
      case 'style':
        if (typeof t.precedence != 'string' || typeof t.href != 'string' || t.href === '') break;
        return !0;
      case 'link':
        if (
          typeof t.rel != 'string' ||
          typeof t.href != 'string' ||
          t.href === '' ||
          t.onLoad ||
          t.onError
        )
          break;
        switch (t.rel) {
          case 'stylesheet':
            return ((e = t.disabled), typeof t.precedence == 'string' && e == null);
          default:
            return !0;
        }
      case 'script':
        if (
          t.async &&
          typeof t.async != 'function' &&
          typeof t.async != 'symbol' &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == 'string'
        )
          return !0;
    }
    return !1;
  }
  function xD(e) {
    return !(e.type === 'stylesheet' && (e.state.loading & 3) === 0);
  }
  function uC(e, t, a, i) {
    if (
      a.type === 'stylesheet' &&
      (typeof i.media != 'string' || matchMedia(i.media).matches !== !1) &&
      (a.state.loading & 4) === 0
    ) {
      if (a.instance === null) {
        var s = $a(i.href),
          f = t.querySelector($r(s));
        if (f) {
          ((t = f._p),
            t !== null &&
              typeof t == 'object' &&
              typeof t.then == 'function' &&
              (e.count++, (e = Ri.bind(e)), t.then(e, e)),
            (a.state.loading |= 4),
            (a.instance = f),
            bt(f));
          return;
        }
        ((f = t.ownerDocument || t),
          (i = BD(i)),
          (s = gu.get(s)) && yf(i, s),
          (f = f.createElement('link')),
          bt(f));
        var g = f;
        ((g._p = new Promise(function (y, O) {
          ((g.onload = y), (g.onerror = O));
        })),
          Mt(f, 'link', i),
          (a.instance = f));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(a, t),
        (t = a.state.preload) &&
          (a.state.loading & 3) === 0 &&
          (e.count++,
          (a = Ri.bind(e)),
          t.addEventListener('load', a),
          t.addEventListener('error', a)));
    }
  }
  var Bf = 0;
  function nC(e, t) {
    return (
      e.stylesheets && e.count === 0 && ji(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (a) {
            var i = setTimeout(function () {
              if ((e.stylesheets && ji(e, e.stylesheets), e.unsuspend)) {
                var f = e.unsuspend;
                ((e.unsuspend = null), f());
              }
            }, 6e4 + t);
            0 < e.imgBytes && Bf === 0 && (Bf = 62500 * Hp());
            var s = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1),
                  e.count === 0 && (e.stylesheets && ji(e, e.stylesheets), e.unsuspend))
                ) {
                  var f = e.unsuspend;
                  ((e.unsuspend = null), f());
                }
              },
              (e.imgBytes > Bf ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = a),
              function () {
                ((e.unsuspend = null), clearTimeout(i), clearTimeout(s));
              }
            );
          }
        : null
    );
  }
  function Ri() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) ji(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        ((this.unsuspend = null), e());
      }
    }
  }
  var Mi = null;
  function ji(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++, (Mi = new Map()), t.forEach(aC, e), (Mi = null), Ri.call(e)));
  }
  function aC(e, t) {
    if (!(t.state.loading & 4)) {
      var a = Mi.get(e);
      if (a) var i = a.get(null);
      else {
        ((a = new Map()), Mi.set(e, a));
        for (
          var s = e.querySelectorAll('link[data-precedence],style[data-precedence]'), f = 0;
          f < s.length;
          f++
        ) {
          var g = s[f];
          (g.nodeName === 'LINK' || g.getAttribute('media') !== 'not all') &&
            (a.set(g.dataset.precedence, g), (i = g));
        }
        i && a.set(null, i);
      }
      ((s = t.instance),
        (g = s.getAttribute('data-precedence')),
        (f = a.get(g) || i),
        f === i && a.set(null, s),
        a.set(g, s),
        this.count++,
        (i = Ri.bind(this)),
        s.addEventListener('load', i),
        s.addEventListener('error', i),
        f
          ? f.parentNode.insertBefore(s, f.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(s, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var Jr = {
    $$typeof: M,
    Provider: null,
    Consumer: null,
    _currentValue: De,
    _currentValue2: De,
    _threadCount: 0,
  };
  function rC(e, t, a, i, s, f, g, y, O) {
    ((this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = mo(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = mo(0)),
      (this.hiddenUpdates = mo(null)),
      (this.identifierPrefix = i),
      (this.onUncaughtError = s),
      (this.onCaughtError = f),
      (this.onRecoverableError = g),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = O),
      (this.incompleteTransitions = new Map()));
  }
  function OD(e, t, a, i, s, f, g, y, O, q, $, te) {
    return (
      (e = new rC(e, t, a, g, O, q, $, te, y)),
      (t = 1),
      f === !0 && (t |= 24),
      (f = eu(3, null, null, t)),
      (e.current = f),
      (f.stateNode = e),
      (t = ts()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (f.memoizedState = { element: i, isDehydrated: a, cache: t }),
      rs(f),
      e
    );
  }
  function wD(e) {
    return e ? ((e = Oa), e) : Oa;
  }
  function TD(e, t, a, i, s, f) {
    ((s = wD(s)),
      i.context === null ? (i.context = s) : (i.pendingContext = s),
      (i = En(t)),
      (i.payload = { element: a }),
      (f = f === void 0 ? null : f),
      f !== null && (i.callback = f),
      (a = yn(e, i, t)),
      a !== null && (Wt(a, e, t), Tr(a, e, t)));
  }
  function RD(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function bf(e, t) {
    (RD(e, t), (e = e.alternate) && RD(e, t));
  }
  function MD(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Qn(e, 67108864);
      (t !== null && Wt(t, e, 67108864), bf(e, 67108864));
    }
  }
  function jD(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = ru();
      t = po(t);
      var a = Qn(e, t);
      (a !== null && Wt(a, e, t), bf(e, t));
    }
  }
  var Ni = !0;
  function lC(e, t, a, i) {
    var s = L.T;
    L.T = null;
    var f = V.p;
    try {
      ((V.p = 2), Ff(e, t, a, i));
    } finally {
      ((V.p = f), (L.T = s));
    }
  }
  function iC(e, t, a, i) {
    var s = L.T;
    L.T = null;
    var f = V.p;
    try {
      ((V.p = 8), Ff(e, t, a, i));
    } finally {
      ((V.p = f), (L.T = s));
    }
  }
  function Ff(e, t, a, i) {
    if (Ni) {
      var s = Sf(i);
      if (s === null) (cf(e, t, i, zi, a), zD(e, i));
      else if (sC(s, e, t, a, i)) i.stopPropagation();
      else if ((zD(e, i), t & 4 && -1 < oC.indexOf(e))) {
        for (; s !== null;) {
          var f = ma(s);
          if (f !== null)
            switch (f.tag) {
              case 3:
                if (((f = f.stateNode), f.current.memoizedState.isDehydrated)) {
                  var g = Yn(f.pendingLanes);
                  if (g !== 0) {
                    var y = f;
                    for (y.pendingLanes |= 2, y.entangledLanes |= 2; g;) {
                      var O = 1 << (31 - kt(g));
                      ((y.entanglements[1] |= O), (g &= ~O));
                    }
                    (Tu(f), (Pe & 6) === 0 && ((mi = ct() + 500), Kr(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((y = Qn(f, 2)), y !== null && Wt(y, f, 2), Ci(), bf(f, 2));
            }
          if (((f = Sf(i)), f === null && cf(e, t, i, zi, a), f === s)) break;
          s = f;
        }
        s !== null && i.stopPropagation();
      } else cf(e, t, i, null, a);
    }
  }
  function Sf(e) {
    return ((e = xo(e)), xf(e));
  }
  var zi = null;
  function xf(e) {
    if (((zi = null), (e = ga(e)), e !== null)) {
      var t = c(e);
      if (t === null) e = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (((e = d(t)), e !== null)) return e;
          e = null;
        } else if (a === 31) {
          if (((e = h(t)), e !== null)) return e;
          e = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ((zi = e), null);
  }
  function ND(e) {
    switch (e) {
      case 'beforetoggle':
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'toggle':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 2;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 8;
      case 'message':
        switch (cn()) {
          case Yt:
            return 2;
          case lu:
            return 8;
          case Vt:
          case St:
            return 32;
          case yt:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Of = !1,
    Mn = null,
    jn = null,
    Nn = null,
    Ir = new Map(),
    el = new Map(),
    zn = [],
    oC =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' ',
      );
  function zD(e, t) {
    switch (e) {
      case 'focusin':
      case 'focusout':
        Mn = null;
        break;
      case 'dragenter':
      case 'dragleave':
        jn = null;
        break;
      case 'mouseover':
      case 'mouseout':
        Nn = null;
        break;
      case 'pointerover':
      case 'pointerout':
        Ir.delete(t.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        el.delete(t.pointerId);
    }
  }
  function tl(e, t, a, i, s, f) {
    return e === null || e.nativeEvent !== f
      ? ((e = {
          blockedOn: t,
          domEventName: a,
          eventSystemFlags: i,
          nativeEvent: f,
          targetContainers: [s],
        }),
        t !== null && ((t = ma(t)), t !== null && MD(t)),
        e)
      : ((e.eventSystemFlags |= i),
        (t = e.targetContainers),
        s !== null && t.indexOf(s) === -1 && t.push(s),
        e);
  }
  function sC(e, t, a, i, s) {
    switch (t) {
      case 'focusin':
        return ((Mn = tl(Mn, e, t, a, i, s)), !0);
      case 'dragenter':
        return ((jn = tl(jn, e, t, a, i, s)), !0);
      case 'mouseover':
        return ((Nn = tl(Nn, e, t, a, i, s)), !0);
      case 'pointerover':
        var f = s.pointerId;
        return (Ir.set(f, tl(Ir.get(f) || null, e, t, a, i, s)), !0);
      case 'gotpointercapture':
        return ((f = s.pointerId), el.set(f, tl(el.get(f) || null, e, t, a, i, s)), !0);
    }
    return !1;
  }
  function LD(e) {
    var t = ga(e.target);
    if (t !== null) {
      var a = c(t);
      if (a !== null) {
        if (((t = a.tag), t === 13)) {
          if (((t = d(a)), t !== null)) {
            ((e.blockedOn = t),
              $c(e.priority, function () {
                jD(a);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = h(a)), t !== null)) {
            ((e.blockedOn = t),
              $c(e.priority, function () {
                jD(a);
              }));
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Li(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
      var a = Sf(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var i = new a.constructor(a.type, a);
        ((So = i), a.target.dispatchEvent(i), (So = null));
      } else return ((t = ma(a)), t !== null && MD(t), (e.blockedOn = a), !1);
      t.shift();
    }
    return !0;
  }
  function HD(e, t, a) {
    Li(e) && a.delete(t);
  }
  function fC() {
    ((Of = !1),
      Mn !== null && Li(Mn) && (Mn = null),
      jn !== null && Li(jn) && (jn = null),
      Nn !== null && Li(Nn) && (Nn = null),
      Ir.forEach(HD),
      el.forEach(HD));
  }
  function Hi(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      Of || ((Of = !0), n.unstable_scheduleCallback(n.unstable_NormalPriority, fC)));
  }
  var Ui = null;
  function UD(e) {
    Ui !== e &&
      ((Ui = e),
      n.unstable_scheduleCallback(n.unstable_NormalPriority, function () {
        Ui === e && (Ui = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t],
            i = e[t + 1],
            s = e[t + 2];
          if (typeof i != 'function') {
            if (xf(i || a) === null) continue;
            break;
          }
          var f = ma(a);
          f !== null &&
            (e.splice(t, 3),
            (t -= 3),
            Fs(f, { pending: !0, data: s, method: a.method, action: i }, i, s));
        }
      }));
  }
  function Ja(e) {
    function t(O) {
      return Hi(O, e);
    }
    (Mn !== null && Hi(Mn, e),
      jn !== null && Hi(jn, e),
      Nn !== null && Hi(Nn, e),
      Ir.forEach(t),
      el.forEach(t));
    for (var a = 0; a < zn.length; a++) {
      var i = zn[a];
      i.blockedOn === e && (i.blockedOn = null);
    }
    for (; 0 < zn.length && ((a = zn[0]), a.blockedOn === null);)
      (LD(a), a.blockedOn === null && zn.shift());
    if (((a = (e.ownerDocument || e).$$reactFormReplay), a != null))
      for (i = 0; i < a.length; i += 3) {
        var s = a[i],
          f = a[i + 1],
          g = s[Pt] || null;
        if (typeof f == 'function') g || UD(a);
        else if (g) {
          var y = null;
          if (f && f.hasAttribute('formAction')) {
            if (((s = f), (g = f[Pt] || null))) y = g.formAction;
            else if (xf(s) !== null) continue;
          } else y = g.action;
          (typeof y == 'function' ? (a[i + 1] = y) : (a.splice(i, 3), (i -= 3)), UD(a));
        }
      }
  }
  function kD() {
    function e(f) {
      f.canIntercept &&
        f.info === 'react-transition' &&
        f.intercept({
          handler: function () {
            return new Promise(function (g) {
              return (s = g);
            });
          },
          focusReset: 'manual',
          scroll: 'manual',
        });
    }
    function t() {
      (s !== null && (s(), (s = null)), i || setTimeout(a, 20));
    }
    function a() {
      if (!i && !navigation.transition) {
        var f = navigation.currentEntry;
        f &&
          f.url != null &&
          navigation.navigate(f.url, {
            state: f.getState(),
            info: 'react-transition',
            history: 'replace',
          });
      }
    }
    if (typeof navigation == 'object') {
      var i = !1,
        s = null;
      return (
        navigation.addEventListener('navigate', e),
        navigation.addEventListener('navigatesuccess', t),
        navigation.addEventListener('navigateerror', t),
        setTimeout(a, 100),
        function () {
          ((i = !0),
            navigation.removeEventListener('navigate', e),
            navigation.removeEventListener('navigatesuccess', t),
            navigation.removeEventListener('navigateerror', t),
            s !== null && (s(), (s = null)));
        }
      );
    }
  }
  function wf(e) {
    this._internalRoot = e;
  }
  ((ki.prototype.render = wf.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(l(409));
      var a = t.current,
        i = ru();
      TD(a, i, e, t, null, null);
    }),
    (ki.prototype.unmount = wf.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (TD(e.current, 2, null, e, null, null), Ci(), (t[va] = null));
        }
      }));
  function ki(e) {
    this._internalRoot = e;
  }
  ki.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = Zc();
      e = { blockedOn: null, target: e, priority: t };
      for (var a = 0; a < zn.length && t !== 0 && t < zn[a].priority; a++);
      (zn.splice(a, 0, e), a === 0 && LD(e));
    }
  };
  var qD = u.version;
  if (qD !== '19.2.7') throw Error(l(527, qD, '19.2.7'));
  V.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == 'function'
        ? Error(l(188))
        : ((e = Object.keys(e).join(',')), Error(l(268, e)));
    return ((e = D(t)), (e = e !== null ? p(e) : null), (e = e === null ? null : e.stateNode), e);
  };
  var cC = {
    bundleType: 0,
    version: '19.2.7',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: L,
    reconcilerVersion: '19.2.7',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var qi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!qi.isDisabled && qi.supportsFiber)
      try {
        ((dn = qi.inject(cC)), (xt = qi));
      } catch {}
  }
  return (
    (nl.createRoot = function (e, t) {
      if (!o(e)) throw Error(l(299));
      var a = !1,
        i = '',
        s = X0,
        f = Q0,
        g = Z0;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (a = !0),
          t.identifierPrefix !== void 0 && (i = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (s = t.onUncaughtError),
          t.onCaughtError !== void 0 && (f = t.onCaughtError),
          t.onRecoverableError !== void 0 && (g = t.onRecoverableError)),
        (t = OD(e, 1, !1, null, null, a, i, null, s, f, g, kD)),
        (e[va] = t.current),
        ff(e),
        new wf(t)
      );
    }),
    (nl.hydrateRoot = function (e, t, a) {
      if (!o(e)) throw Error(l(299));
      var i = !1,
        s = '',
        f = X0,
        g = Q0,
        y = Z0,
        O = null;
      return (
        a != null &&
          (a.unstable_strictMode === !0 && (i = !0),
          a.identifierPrefix !== void 0 && (s = a.identifierPrefix),
          a.onUncaughtError !== void 0 && (f = a.onUncaughtError),
          a.onCaughtError !== void 0 && (g = a.onCaughtError),
          a.onRecoverableError !== void 0 && (y = a.onRecoverableError),
          a.formState !== void 0 && (O = a.formState)),
        (t = OD(e, 1, !0, t, a ?? null, i, s, O, f, g, y, kD)),
        (t.context = wD(null)),
        (a = t.current),
        (i = ru()),
        (i = po(i)),
        (s = En(i)),
        (s.callback = null),
        yn(a, s, i),
        (a = i),
        (t.current.lanes = a),
        dr(t, a),
        Tu(t),
        (e[va] = t.current),
        ff(e),
        new ki(t)
      );
    }),
    (nl.version = '19.2.7'),
    nl
  );
}
var $D;
function EC() {
  if ($D) return Mf.exports;
  $D = 1;
  function n() {
    if (!(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    ))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (u) {
        console.error(u);
      }
  }
  return (n(), (Mf.exports = CC()), Mf.exports);
}
var yC = EC();
/**
 * react-router v7.18.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ var Ac = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,
  qg = /^[\\/]{2}/;
function AC(n, u) {
  return u + n.replace(/\\/g, '/');
}
var WD = 'popstate';
function JD(n) {
  return (
    typeof n == 'object' &&
    n != null &&
    'pathname' in n &&
    'search' in n &&
    'hash' in n &&
    'state' in n &&
    'key' in n
  );
}
function BC(n = {}) {
  function u(l, o) {
    var D;
    let c = (D = o.state) == null ? void 0 : D.masked,
      { pathname: d, search: h, hash: v } = c || l.location;
    return oc(
      '',
      { pathname: d, search: h, hash: v },
      (o.state && o.state.usr) || null,
      (o.state && o.state.key) || 'default',
      c
        ? { pathname: l.location.pathname, search: l.location.search, hash: l.location.hash }
        : void 0,
    );
  }
  function r(l, o) {
    return typeof o == 'string' ? o : dl(o);
  }
  return FC(u, r, null, n);
}
function ft(n, u) {
  if (n === !1 || n === null || typeof n > 'u') throw new Error(u);
}
function Nu(n, u) {
  if (!n) {
    typeof console < 'u' && console.warn(u);
    try {
      throw new Error(u);
    } catch {}
  }
}
function bC() {
  return Math.random().toString(36).substring(2, 10);
}
function ID(n, u) {
  return {
    usr: n.state,
    key: n.key,
    idx: u,
    masked: n.mask ? { pathname: n.pathname, search: n.search, hash: n.hash } : void 0,
  };
}
function oc(n, u, r = null, l, o) {
  return {
    pathname: typeof n == 'string' ? n : n.pathname,
    search: '',
    hash: '',
    ...(typeof u == 'string' ? lr(u) : u),
    state: r,
    key: (u && u.key) || l || bC(),
    mask: o,
  };
}
function dl({ pathname: n = '/', search: u = '', hash: r = '' }) {
  return (
    u && u !== '?' && (n += u.charAt(0) === '?' ? u : '?' + u),
    r && r !== '#' && (n += r.charAt(0) === '#' ? r : '#' + r),
    n
  );
}
function lr(n) {
  let u = {};
  if (n) {
    let r = n.indexOf('#');
    r >= 0 && ((u.hash = n.substring(r)), (n = n.substring(0, r)));
    let l = n.indexOf('?');
    (l >= 0 && ((u.search = n.substring(l)), (n = n.substring(0, l))), n && (u.pathname = n));
  }
  return u;
}
function FC(n, u, r, l = {}) {
  let { window: o = document.defaultView, v5Compat: c = !1 } = l,
    d = o.history,
    h = 'POP',
    v = null,
    D = p();
  D == null && ((D = 0), d.replaceState({ ...d.state, idx: D }, ''));
  function p() {
    return (d.state || { idx: null }).idx;
  }
  function C() {
    h = 'POP';
    let N = p(),
      b = N == null ? null : N - D;
    ((D = N), v && v({ action: h, location: w.location, delta: b }));
  }
  function A(N, b) {
    h = 'PUSH';
    let m = JD(N) ? N : oc(w.location, N, b);
    D = p() + 1;
    let M = ID(m, D),
      _ = w.createHref(m.mask || m);
    try {
      d.pushState(M, '', _);
    } catch (K) {
      if (K instanceof DOMException && K.name === 'DataCloneError') throw K;
      o.location.assign(_);
    }
    c && v && v({ action: h, location: w.location, delta: 1 });
  }
  function B(N, b) {
    h = 'REPLACE';
    let m = JD(N) ? N : oc(w.location, N, b);
    D = p();
    let M = ID(m, D),
      _ = w.createHref(m.mask || m);
    (d.replaceState(M, '', _), c && v && v({ action: h, location: w.location, delta: 0 }));
  }
  function S(N) {
    return SC(o, N);
  }
  let w = {
    get action() {
      return h;
    },
    get location() {
      return n(o, d);
    },
    listen(N) {
      if (v) throw new Error('A history only accepts one active listener');
      return (
        o.addEventListener(WD, C),
        (v = N),
        () => {
          (o.removeEventListener(WD, C), (v = null));
        }
      );
    },
    createHref(N) {
      return u(o, N);
    },
    createURL: S,
    encodeLocation(N) {
      let b = S(N);
      return { pathname: b.pathname, search: b.search, hash: b.hash };
    },
    push: A,
    replace: B,
    go(N) {
      return d.go(N);
    },
  };
  return w;
}
function SC(n, u, r = !1) {
  let l = 'http://localhost';
  (n && (l = n.location.origin !== 'null' ? n.location.origin : n.location.href),
    ft(l, 'No window.location.(origin|href) available to create URL'));
  let o = typeof u == 'string' ? u : dl(u);
  return ((o = o.replace(/ $/, '%20')), !r && qg.test(o) && (o = l + o), new URL(o, l));
}
function _g(n, u, r = '/') {
  return xC(n, u, r, !1);
}
function xC(n, u, r, l, o) {
  let c = typeof u == 'string' ? lr(u) : u,
    d = an(c.pathname || '/', r);
  if (d == null) return null;
  let h = OC(n),
    v = null,
    D = kC(d);
  for (let p = 0; v == null && p < h.length; ++p) v = UC(h[p], D, l);
  return v;
}
function OC(n) {
  let u = Gg(n);
  return (wC(u), u);
}
function Gg(n, u = [], r = [], l = '', o = !1) {
  let c = (d, h, v = o, D) => {
    let p = {
      relativePath: D === void 0 ? d.path || '' : D,
      caseSensitive: d.caseSensitive === !0,
      childrenIndex: h,
      route: d,
    };
    if (p.relativePath.startsWith('/')) {
      if (!p.relativePath.startsWith(l) && v) return;
      (ft(
        p.relativePath.startsWith(l),
        `Absolute route path "${p.relativePath}" nested under path "${l}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (p.relativePath = p.relativePath.slice(l.length)));
    }
    let C = Su([l, p.relativePath]),
      A = r.concat(p);
    (d.children &&
      d.children.length > 0 &&
      (ft(
        d.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${C}".`,
      ),
      Gg(d.children, u, A, C, v)),
      !(d.path == null && !d.index) &&
        u.push({
          path: C,
          score: LC(C, d.index),
          routesMeta: A.map((B, S) => {
            let [w, N] = Pg(B.relativePath, B.caseSensitive, S === A.length - 1);
            return { ...B, matcher: w, compiledParams: N };
          }),
        }));
  };
  return (
    n.forEach((d, h) => {
      var v;
      if (d.path === '' || !((v = d.path) != null && v.includes('?'))) c(d, h);
      else for (let D of Yg(d.path)) c(d, h, !0, D);
    }),
    u
  );
}
function Yg(n) {
  let u = n.split('/');
  if (u.length === 0) return [];
  let [r, ...l] = u,
    o = r.endsWith('?'),
    c = r.replace(/\?$/, '');
  if (l.length === 0) return o ? [c, ''] : [c];
  let d = Yg(l.join('/')),
    h = [];
  return (
    h.push(...d.map((v) => (v === '' ? c : [c, v].join('/')))),
    o && h.push(...d),
    h.map((v) => (n.startsWith('/') && v === '' ? '/' : v))
  );
}
function wC(n) {
  n.sort((u, r) =>
    u.score !== r.score
      ? r.score - u.score
      : HC(
          u.routesMeta.map((l) => l.childrenIndex),
          r.routesMeta.map((l) => l.childrenIndex),
        ),
  );
}
var TC = /^:[\w-]+$/,
  RC = 3,
  MC = 2,
  jC = 1,
  NC = 10,
  zC = -2,
  ev = (n) => n === '*';
function LC(n, u) {
  let r = n.split('/'),
    l = r.length;
  return (
    r.some(ev) && (l += zC),
    u && (l += MC),
    r.filter((o) => !ev(o)).reduce((o, c) => o + (TC.test(c) ? RC : c === '' ? jC : NC), l)
  );
}
function HC(n, u) {
  return n.length === u.length && n.slice(0, -1).every((l, o) => l === u[o])
    ? n[n.length - 1] - u[u.length - 1]
    : 0;
}
function UC(n, u, r = !1) {
  let { routesMeta: l } = n,
    o = {},
    c = '/',
    d = [];
  for (let h = 0; h < l.length; ++h) {
    let v = l[h],
      D = h === l.length - 1,
      p = c === '/' ? u : u.slice(c.length) || '/',
      C = { path: v.relativePath, caseSensitive: v.caseSensitive, end: D },
      A = v.matcher && v.compiledParams ? Vg(C, p, v.matcher, v.compiledParams) : ao(C, p),
      B = v.route;
    if (
      (!A &&
        D &&
        r &&
        !l[l.length - 1].route.index &&
        (A = ao({ path: v.relativePath, caseSensitive: v.caseSensitive, end: !1 }, p)),
      !A)
    )
      return null;
    (Object.assign(o, A.params),
      d.push({
        params: o,
        pathname: Su([c, A.pathname]),
        pathnameBase: GC(Su([c, A.pathnameBase])),
        route: B,
      }),
      A.pathnameBase !== '/' && (c = Su([c, A.pathnameBase])));
  }
  return d;
}
function ao(n, u) {
  typeof n == 'string' && (n = { path: n, caseSensitive: !1, end: !0 });
  let [r, l] = Pg(n.path, n.caseSensitive, n.end);
  return Vg(n, u, r, l);
}
function Vg(n, u, r, l) {
  let o = u.match(r);
  if (!o) return null;
  let c = o[0],
    d = c.replace(/(.)\/+$/, '$1'),
    h = o.slice(1);
  return {
    params: l.reduce((D, { paramName: p, isOptional: C }, A) => {
      if (p === '*') {
        let S = h[A] || '';
        d = c.slice(0, c.length - S.length).replace(/(.)\/+$/, '$1');
      }
      const B = h[A];
      return (C && !B ? (D[p] = void 0) : (D[p] = (B || '').replace(/%2F/g, '/')), D);
    }, {}),
    pathname: c,
    pathnameBase: d,
    pattern: n,
  };
}
function Pg(n, u = !1, r = !0) {
  Nu(
    n === '*' || !n.endsWith('*') || n.endsWith('/*'),
    `Route path "${n}" will be treated as if it were "${n.replace(/\*$/, '/*')}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${n.replace(/\*$/, '/*')}".`,
  );
  let l = [],
    o =
      '^' +
      n
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(/\/:([\w-]+)(\?)?/g, (d, h, v, D, p) => {
          if ((l.push({ paramName: h, isOptional: v != null }), v)) {
            let C = p.charAt(D + d.length);
            return C && C !== '/' ? '/([^\\/]*)' : '(?:/([^\\/]*))?';
          }
          return '/([^\\/]+)';
        })
        .replace(/\/([\w-]+)\?(\/|$)/g, '(/$1)?$2');
  return (
    n.endsWith('*')
      ? (l.push({ paramName: '*' }), (o += n === '*' || n === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : r
        ? (o += '\\/*$')
        : n !== '' && n !== '/' && (o += '(?:(?=\\/|$))'),
    [new RegExp(o, u ? void 0 : 'i'), l]
  );
}
function kC(n) {
  try {
    return n
      .split('/')
      .map((u) => decodeURIComponent(u).replace(/\//g, '%2F'))
      .join('/');
  } catch (u) {
    return (
      Nu(
        !1,
        `The URL path "${n}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${u}).`,
      ),
      n
    );
  }
}
function an(n, u) {
  if (u === '/') return n;
  if (!n.toLowerCase().startsWith(u.toLowerCase())) return null;
  let r = u.endsWith('/') ? u.length - 1 : u.length,
    l = n.charAt(r);
  return l && l !== '/' ? null : n.slice(r) || '/';
}
function qC(n, u = '/') {
  let { pathname: r, search: l = '', hash: o = '' } = typeof n == 'string' ? lr(n) : n,
    c;
  return (
    r ? ((r = Xg(r)), r.startsWith('/') ? (c = tv(r.substring(1), '/')) : (c = tv(r, u))) : (c = u),
    { pathname: c, search: YC(l), hash: VC(o) }
  );
}
function tv(n, u) {
  let r = ro(u).split('/');
  return (
    n.split('/').forEach((o) => {
      o === '..' ? r.length > 1 && r.pop() : o !== '.' && r.push(o);
    }),
    r.length > 1 ? r.join('/') : '/'
  );
}
function Lf(n, u, r, l) {
  return `Cannot include a '${n}' character in a manually specified \`to.${u}\` field [${JSON.stringify(l)}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function _C(n) {
  return n.filter((u, r) => r === 0 || (u.route.path && u.route.path.length > 0));
}
function Kg(n) {
  let u = _C(n);
  return u.map((r, l) => (l === u.length - 1 ? r.pathname : r.pathnameBase));
}
function Bc(n, u, r, l = !1) {
  let o;
  typeof n == 'string'
    ? (o = lr(n))
    : ((o = { ...n }),
      ft(!o.pathname || !o.pathname.includes('?'), Lf('?', 'pathname', 'search', o)),
      ft(!o.pathname || !o.pathname.includes('#'), Lf('#', 'pathname', 'hash', o)),
      ft(!o.search || !o.search.includes('#'), Lf('#', 'search', 'hash', o)));
  let c = n === '' || o.pathname === '',
    d = c ? '/' : o.pathname,
    h;
  if (d == null) h = r;
  else {
    let C = u.length - 1;
    if (!l && d.startsWith('..')) {
      let A = d.split('/');
      for (; A[0] === '..';) (A.shift(), (C -= 1));
      o.pathname = A.join('/');
    }
    h = C >= 0 ? u[C] : '/';
  }
  let v = qC(o, h),
    D = d && d !== '/' && d.endsWith('/'),
    p = (c || d === '.') && r.endsWith('/');
  return (!v.pathname.endsWith('/') && (D || p) && (v.pathname += '/'), v);
}
var Xg = (n) => n.replace(/[\\/]{2,}/g, '/'),
  Su = (n) => Xg(n.join('/')),
  ro = (n) => n.replace(/\/+$/, ''),
  GC = (n) => ro(n).replace(/^\/*/, '/'),
  YC = (n) => (!n || n === '?' ? '' : n.startsWith('?') ? n : '?' + n),
  VC = (n) => (!n || n === '#' ? '' : n.startsWith('#') ? n : '#' + n),
  PC = class {
    constructor(n, u, r, l = !1) {
      ((this.status = n),
        (this.statusText = u || ''),
        (this.internal = l),
        r instanceof Error ? ((this.data = r.toString()), (this.error = r)) : (this.data = r));
    }
  };
function KC(n) {
  return (
    n != null &&
    typeof n.status == 'number' &&
    typeof n.statusText == 'string' &&
    typeof n.internal == 'boolean' &&
    'data' in n
  );
}
function XC(n) {
  let u = n.map((r) => r.route.path).filter(Boolean);
  return Su(u) || '/';
}
var Qg =
  typeof window < 'u' && typeof window.document < 'u' && typeof window.document.createElement < 'u';
function Zg(n, u) {
  let r = n;
  if (typeof r != 'string' || !Ac.test(r)) return { absoluteURL: void 0, isExternal: !1, to: r };
  let l = r,
    o = !1;
  if (Qg)
    try {
      let c = new URL(window.location.href),
        d = qg.test(r) ? new URL(AC(r, c.protocol)) : new URL(r),
        h = an(d.pathname, u);
      d.origin === c.origin && h != null ? (r = h + d.search + d.hash) : (o = !0);
    } catch {
      Nu(
        !1,
        `<Link to="${r}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: l, isExternal: o, to: r };
}
Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
var $g = ['POST', 'PUT', 'PATCH', 'DELETE'];
new Set($g);
var QC = ['GET', ...$g];
new Set(QC);
var ZC = [
  'about:',
  'blob:',
  'chrome:',
  'chrome-untrusted:',
  'content:',
  'data:',
  'devtools:',
  'file:',
  'filesystem:',
  'javascript:',
];
function $C(n) {
  try {
    return ZC.includes(new URL(n).protocol);
  } catch {
    return !1;
  }
}
var ir = F.createContext(null);
ir.displayName = 'DataRouter';
var ho = F.createContext(null);
ho.displayName = 'DataRouterState';
var Wg = F.createContext(!1);
function WC() {
  return F.useContext(Wg);
}
var Jg = F.createContext({ isTransitioning: !1 });
Jg.displayName = 'ViewTransition';
var JC = F.createContext(new Map());
JC.displayName = 'Fetchers';
var IC = F.createContext(null);
IC.displayName = 'Await';
var pu = F.createContext(null);
pu.displayName = 'Navigation';
var El = F.createContext(null);
El.displayName = 'Location';
var on = F.createContext({ outlet: null, matches: [], isDataRoute: !1 });
on.displayName = 'Route';
var bc = F.createContext(null);
bc.displayName = 'RouteError';
var Ig = 'REACT_ROUTER_ERROR',
  eE = 'REDIRECT',
  tE = 'ROUTE_ERROR_RESPONSE';
function uE(n) {
  if (n.startsWith(`${Ig}:${eE}:{`))
    try {
      let u = JSON.parse(n.slice(28));
      if (
        typeof u == 'object' &&
        u &&
        typeof u.status == 'number' &&
        typeof u.statusText == 'string' &&
        typeof u.location == 'string' &&
        typeof u.reloadDocument == 'boolean' &&
        typeof u.replace == 'boolean'
      )
        return u;
    } catch {}
}
function nE(n) {
  if (n.startsWith(`${Ig}:${tE}:{`))
    try {
      let u = JSON.parse(n.slice(40));
      if (
        typeof u == 'object' &&
        u &&
        typeof u.status == 'number' &&
        typeof u.statusText == 'string'
      )
        return new PC(u.status, u.statusText, u.data);
    } catch {}
}
function aE(n, { relative: u } = {}) {
  ft(yl(), 'useHref() may be used only in the context of a <Router> component.');
  let { basename: r, navigator: l } = F.useContext(pu),
    { hash: o, pathname: c, search: d } = Al(n, { relative: u }),
    h = c;
  return (
    r !== '/' && (h = c === '/' ? r : Su([r, c])),
    l.createHref({ pathname: h, search: d, hash: o })
  );
}
function yl() {
  return F.useContext(El) != null;
}
function sn() {
  return (
    ft(yl(), 'useLocation() may be used only in the context of a <Router> component.'),
    F.useContext(El).location
  );
}
var em =
  'You should call navigate() in a React.useEffect(), not when your component is first rendered.';
function tm(n) {
  F.useContext(pu).static || F.useLayoutEffect(n);
}
function rE() {
  let { isDataRoute: n } = F.useContext(on);
  return n ? pE() : lE();
}
function lE() {
  ft(yl(), 'useNavigate() may be used only in the context of a <Router> component.');
  let n = F.useContext(ir),
    { basename: u, navigator: r } = F.useContext(pu),
    { matches: l } = F.useContext(on),
    { pathname: o } = sn(),
    c = JSON.stringify(Kg(l)),
    d = F.useRef(!1);
  return (
    tm(() => {
      d.current = !0;
    }),
    F.useCallback(
      (v, D = {}) => {
        if ((Nu(d.current, em), !d.current)) return;
        if (typeof v == 'number') {
          r.go(v);
          return;
        }
        let p = Bc(v, JSON.parse(c), o, D.relative === 'path');
        (n == null && u !== '/' && (p.pathname = p.pathname === '/' ? u : Su([u, p.pathname])),
          (D.replace ? r.replace : r.push)(p, D.state, D));
      },
      [u, r, c, o, n],
    )
  );
}
F.createContext(null);
function Al(n, { relative: u } = {}) {
  let { matches: r } = F.useContext(on),
    { pathname: l } = sn(),
    o = JSON.stringify(Kg(r));
  return F.useMemo(() => Bc(n, JSON.parse(o), l, u === 'path'), [n, o, l, u]);
}
function iE(n, u) {
  return um(n, u);
}
function um(n, u, r) {
  var N;
  ft(yl(), 'useRoutes() may be used only in the context of a <Router> component.');
  let { navigator: l } = F.useContext(pu),
    { matches: o } = F.useContext(on),
    c = o[o.length - 1],
    d = c ? c.params : {},
    h = c ? c.pathname : '/',
    v = c ? c.pathnameBase : '/',
    D = c && c.route;
  {
    let b = (D && D.path) || '';
    am(
      h,
      !D || b.endsWith('*') || b.endsWith('*?'),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${h}" (under <Route path="${b}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${b}"> to <Route path="${b === '/' ? '*' : `${b}/*`}">.`,
    );
  }
  let p = sn(),
    C;
  if (u) {
    let b = typeof u == 'string' ? lr(u) : u;
    (ft(
      v === '/' || ((N = b.pathname) == null ? void 0 : N.startsWith(v)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${v}" but pathname "${b.pathname}" was given in the \`location\` prop.`,
    ),
      (C = b));
  } else C = p;
  let A = C.pathname || '/',
    B = A;
  if (v !== '/') {
    let b = v.replace(/^\//, '').split('/');
    B = '/' + A.replace(/^\//, '').split('/').slice(b.length).join('/');
  }
  let S =
    r && r.state.matches.length
      ? r.state.matches.map((b) => Object.assign(b, { route: r.manifest[b.route.id] || b.route }))
      : _g(n, { pathname: B });
  (Nu(D || S != null, `No routes matched location "${C.pathname}${C.search}${C.hash}" `),
    Nu(
      S == null ||
        S[S.length - 1].route.element !== void 0 ||
        S[S.length - 1].route.Component !== void 0 ||
        S[S.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${C.pathname}${C.search}${C.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    ));
  let w = dE(
    S &&
      S.map((b) =>
        Object.assign({}, b, {
          params: Object.assign({}, d, b.params),
          pathname: Su([
            v,
            l.encodeLocation
              ? l.encodeLocation(
                  b.pathname.replace(/%/g, '%25').replace(/\?/g, '%3F').replace(/#/g, '%23'),
                ).pathname
              : b.pathname,
          ]),
          pathnameBase:
            b.pathnameBase === '/'
              ? v
              : Su([
                  v,
                  l.encodeLocation
                    ? l.encodeLocation(
                        b.pathnameBase
                          .replace(/%/g, '%25')
                          .replace(/\?/g, '%3F')
                          .replace(/#/g, '%23'),
                      ).pathname
                    : b.pathnameBase,
                ]),
        }),
      ),
    o,
    r,
  );
  return u && w
    ? F.createElement(
        El.Provider,
        {
          value: {
            location: {
              pathname: '/',
              search: '',
              hash: '',
              state: null,
              key: 'default',
              mask: void 0,
              ...C,
            },
            navigationType: 'POP',
          },
        },
        w,
      )
    : w;
}
function oE() {
  let n = mE(),
    u = KC(n) ? `${n.status} ${n.statusText}` : n instanceof Error ? n.message : JSON.stringify(n),
    r = n instanceof Error ? n.stack : null,
    l = 'rgba(200,200,200, 0.5)',
    o = { padding: '0.5rem', backgroundColor: l },
    c = { padding: '2px 4px', backgroundColor: l },
    d = null;
  return (
    console.error('Error handled by React Router default ErrorBoundary:', n),
    (d = F.createElement(
      F.Fragment,
      null,
      F.createElement('p', null, '💿 Hey developer 👋'),
      F.createElement(
        'p',
        null,
        'You can provide a way better UX than this when your app throws errors by providing your own ',
        F.createElement('code', { style: c }, 'ErrorBoundary'),
        ' or',
        ' ',
        F.createElement('code', { style: c }, 'errorElement'),
        ' prop on your route.',
      ),
    )),
    F.createElement(
      F.Fragment,
      null,
      F.createElement('h2', null, 'Unexpected Application Error!'),
      F.createElement('h3', { style: { fontStyle: 'italic' } }, u),
      r ? F.createElement('pre', { style: o }, r) : null,
      d,
    )
  );
}
var sE = F.createElement(oE, null),
  nm = class extends F.Component {
    constructor(n) {
      (super(n),
        (this.state = { location: n.location, revalidation: n.revalidation, error: n.error }));
    }
    static getDerivedStateFromError(n) {
      return { error: n };
    }
    static getDerivedStateFromProps(n, u) {
      return u.location !== n.location || (u.revalidation !== 'idle' && n.revalidation === 'idle')
        ? { error: n.error, location: n.location, revalidation: n.revalidation }
        : {
            error: n.error !== void 0 ? n.error : u.error,
            location: u.location,
            revalidation: n.revalidation || u.revalidation,
          };
    }
    componentDidCatch(n, u) {
      this.props.onError
        ? this.props.onError(n, u)
        : console.error('React Router caught the following error during render', n);
    }
    render() {
      let n = this.state.error;
      if (
        this.context &&
        typeof n == 'object' &&
        n &&
        'digest' in n &&
        typeof n.digest == 'string'
      ) {
        const r = nE(n.digest);
        r && (n = r);
      }
      let u =
        n !== void 0
          ? F.createElement(
              on.Provider,
              { value: this.props.routeContext },
              F.createElement(bc.Provider, { value: n, children: this.props.component }),
            )
          : this.props.children;
      return this.context ? F.createElement(fE, { error: n }, u) : u;
    }
  };
nm.contextType = Wg;
var Hf = new WeakMap();
function fE({ children: n, error: u }) {
  let { basename: r } = F.useContext(pu);
  if (typeof u == 'object' && u && 'digest' in u && typeof u.digest == 'string') {
    let l = uE(u.digest);
    if (l) {
      let o = Hf.get(u);
      if (o) throw o;
      let c = Zg(l.location, r),
        d = c.absoluteURL || c.to;
      if ($C(d)) throw new Error('Invalid redirect location');
      if (Qg && !Hf.get(u))
        if (c.isExternal || l.reloadDocument) window.location.href = d;
        else {
          const h = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(c.to, { replace: l.replace }),
          );
          throw (Hf.set(u, h), h);
        }
      return F.createElement('meta', { httpEquiv: 'refresh', content: `0;url=${d}` });
    }
  }
  return n;
}
function cE({ routeContext: n, match: u, children: r }) {
  let l = F.useContext(ir);
  return (
    l &&
      l.static &&
      l.staticContext &&
      (u.route.errorElement || u.route.ErrorBoundary) &&
      (l.staticContext._deepestRenderedBoundaryId = u.route.id),
    F.createElement(on.Provider, { value: n }, r)
  );
}
function dE(n, u = [], r) {
  let l = r == null ? void 0 : r.state;
  if (n == null) {
    if (!l) return null;
    if (l.errors) n = l.matches;
    else if (u.length === 0 && !l.initialized && l.matches.length > 0) n = l.matches;
    else return null;
  }
  let o = n,
    c = l == null ? void 0 : l.errors;
  if (c != null) {
    let p = o.findIndex((C) => C.route.id && (c == null ? void 0 : c[C.route.id]) !== void 0);
    (ft(
      p >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(c).join(',')}`,
    ),
      (o = o.slice(0, Math.min(o.length, p + 1))));
  }
  let d = !1,
    h = -1;
  if (r && l) {
    d = l.renderFallback;
    for (let p = 0; p < o.length; p++) {
      let C = o[p];
      if (((C.route.HydrateFallback || C.route.hydrateFallbackElement) && (h = p), C.route.id)) {
        let { loaderData: A, errors: B } = l,
          S = C.route.loader && !A.hasOwnProperty(C.route.id) && (!B || B[C.route.id] === void 0);
        if (C.route.lazy || S) {
          (r.isStatic && (d = !0), h >= 0 ? (o = o.slice(0, h + 1)) : (o = [o[0]]));
          break;
        }
      }
    }
  }
  let v = r == null ? void 0 : r.onError,
    D =
      l && v
        ? (p, C) => {
            var A, B;
            v(p, {
              location: l.location,
              params:
                ((B = (A = l.matches) == null ? void 0 : A[0]) == null ? void 0 : B.params) ?? {},
              pattern: XC(l.matches),
              errorInfo: C,
            });
          }
        : void 0;
  return o.reduceRight((p, C, A) => {
    let B,
      S = !1,
      w = null,
      N = null;
    l &&
      ((B = c && C.route.id ? c[C.route.id] : void 0),
      (w = C.route.errorElement || sE),
      d &&
        (h < 0 && A === 0
          ? (am(
              'route-fallback',
              !1,
              'No `HydrateFallback` element provided to render during initial hydration',
            ),
            (S = !0),
            (N = null))
          : h === A && ((S = !0), (N = C.route.hydrateFallbackElement || null))));
    let b = u.concat(o.slice(0, A + 1)),
      m = () => {
        let M;
        return (
          B
            ? (M = w)
            : S
              ? (M = N)
              : C.route.Component
                ? (M = F.createElement(C.route.Component, null))
                : C.route.element
                  ? (M = C.route.element)
                  : (M = p),
          F.createElement(cE, {
            match: C,
            routeContext: { outlet: p, matches: b, isDataRoute: l != null },
            children: M,
          })
        );
      };
    return l && (C.route.ErrorBoundary || C.route.errorElement || A === 0)
      ? F.createElement(nm, {
          location: l.location,
          revalidation: l.revalidation,
          component: w,
          error: B,
          children: m(),
          routeContext: { outlet: null, matches: b, isDataRoute: !0 },
          onError: D,
        })
      : m();
  }, null);
}
function Fc(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function hE(n) {
  let u = F.useContext(ir);
  return (ft(u, Fc(n)), u);
}
function DE(n) {
  let u = F.useContext(ho);
  return (ft(u, Fc(n)), u);
}
function vE(n) {
  let u = F.useContext(on);
  return (ft(u, Fc(n)), u);
}
function Sc(n) {
  let u = vE(n),
    r = u.matches[u.matches.length - 1];
  return (ft(r.route.id, `${n} can only be used on routes that contain a unique "id"`), r.route.id);
}
function gE() {
  return Sc('useRouteId');
}
function mE() {
  var l;
  let n = F.useContext(bc),
    u = DE('useRouteError'),
    r = Sc('useRouteError');
  return n !== void 0 ? n : (l = u.errors) == null ? void 0 : l[r];
}
function pE() {
  let { router: n } = hE('useNavigate'),
    u = Sc('useNavigate'),
    r = F.useRef(!1);
  return (
    tm(() => {
      r.current = !0;
    }),
    F.useCallback(
      async (o, c = {}) => {
        (Nu(r.current, em),
          r.current &&
            (typeof o == 'number'
              ? await n.navigate(o)
              : await n.navigate(o, { fromRouteId: u, ...c })));
      },
      [n, u],
    )
  );
}
var uv = {};
function am(n, u, r) {
  !u && !uv[n] && ((uv[n] = !0), Nu(!1, r));
}
F.memo(CE);
function CE({ routes: n, manifest: u, future: r, state: l, isStatic: o, onError: c }) {
  return um(n, void 0, { manifest: u, state: l, isStatic: o, onError: c });
}
function sc(n) {
  ft(
    !1,
    'A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.',
  );
}
function EE({
  basename: n = '/',
  children: u = null,
  location: r,
  navigationType: l = 'POP',
  navigator: o,
  static: c = !1,
  useTransitions: d,
}) {
  ft(
    !yl(),
    'You cannot render a <Router> inside another <Router>. You should never have more than one in your app.',
  );
  let h = n.replace(/^\/*/, '/'),
    v = F.useMemo(
      () => ({ basename: h, navigator: o, static: c, useTransitions: d, future: {} }),
      [h, o, c, d],
    );
  typeof r == 'string' && (r = lr(r));
  let {
      pathname: D = '/',
      search: p = '',
      hash: C = '',
      state: A = null,
      key: B = 'default',
      mask: S,
    } = r,
    w = F.useMemo(() => {
      let N = an(D, h);
      return N == null
        ? null
        : {
            location: { pathname: N, search: p, hash: C, state: A, key: B, mask: S },
            navigationType: l,
          };
    }, [h, D, p, C, A, B, l, S]);
  return (
    Nu(
      w != null,
      `<Router basename="${h}"> is not able to match the URL "${D}${p}${C}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    w == null
      ? null
      : F.createElement(
          pu.Provider,
          { value: v },
          F.createElement(El.Provider, { children: u, value: w }),
        )
  );
}
function yE({ children: n, location: u }) {
  return iE(fc(n), u);
}
function fc(n, u = []) {
  let r = [];
  return (
    F.Children.forEach(n, (l, o) => {
      if (!F.isValidElement(l)) return;
      let c = [...u, o];
      if (l.type === F.Fragment) {
        r.push.apply(r, fc(l.props.children, c));
        return;
      }
      (ft(
        l.type === sc,
        `[${typeof l.type == 'string' ? l.type : l.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
      ),
        ft(!l.props.index || !l.props.children, 'An index route cannot have child routes.'));
      let d = {
        id: l.props.id || c.join('-'),
        caseSensitive: l.props.caseSensitive,
        element: l.props.element,
        Component: l.props.Component,
        index: l.props.index,
        path: l.props.path,
        middleware: l.props.middleware,
        loader: l.props.loader,
        action: l.props.action,
        hydrateFallbackElement: l.props.hydrateFallbackElement,
        HydrateFallback: l.props.HydrateFallback,
        errorElement: l.props.errorElement,
        ErrorBoundary: l.props.ErrorBoundary,
        hasErrorBoundary:
          l.props.hasErrorBoundary === !0 ||
          l.props.ErrorBoundary != null ||
          l.props.errorElement != null,
        shouldRevalidate: l.props.shouldRevalidate,
        handle: l.props.handle,
        lazy: l.props.lazy,
      };
      (l.props.children && (d.children = fc(l.props.children, c)), r.push(d));
    }),
    r
  );
}
var Ii = 'get',
  eo = 'application/x-www-form-urlencoded';
function Do(n) {
  return typeof HTMLElement < 'u' && n instanceof HTMLElement;
}
function AE(n) {
  return Do(n) && n.tagName.toLowerCase() === 'button';
}
function BE(n) {
  return Do(n) && n.tagName.toLowerCase() === 'form';
}
function bE(n) {
  return Do(n) && n.tagName.toLowerCase() === 'input';
}
function FE(n) {
  return !!(n.metaKey || n.altKey || n.ctrlKey || n.shiftKey);
}
function SE(n, u) {
  return n.button === 0 && (!u || u === '_self') && !FE(n);
}
var Gi = null;
function xE() {
  if (Gi === null)
    try {
      (new FormData(document.createElement('form'), 0), (Gi = !1));
    } catch {
      Gi = !0;
    }
  return Gi;
}
var OE = new Set(['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']);
function Uf(n) {
  return n != null && !OE.has(n)
    ? (Nu(
        !1,
        `"${n}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${eo}"`,
      ),
      null)
    : n;
}
function wE(n, u) {
  let r, l, o, c, d;
  if (BE(n)) {
    let h = n.getAttribute('action');
    ((l = h ? an(h, u) : null),
      (r = n.getAttribute('method') || Ii),
      (o = Uf(n.getAttribute('enctype')) || eo),
      (c = new FormData(n)));
  } else if (AE(n) || (bE(n) && (n.type === 'submit' || n.type === 'image'))) {
    let h = n.form;
    if (h == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let v = n.getAttribute('formaction') || h.getAttribute('action');
    if (
      ((l = v ? an(v, u) : null),
      (r = n.getAttribute('formmethod') || h.getAttribute('method') || Ii),
      (o = Uf(n.getAttribute('formenctype')) || Uf(h.getAttribute('enctype')) || eo),
      (c = new FormData(h, n)),
      !xE())
    ) {
      let { name: D, type: p, value: C } = n;
      if (p === 'image') {
        let A = D ? `${D}.` : '';
        (c.append(`${A}x`, '0'), c.append(`${A}y`, '0'));
      } else D && c.append(D, C);
    }
  } else {
    if (Do(n))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">',
      );
    ((r = Ii), (l = null), (o = eo), (d = n));
  }
  return (
    c && o === 'text/plain' && ((d = c), (c = void 0)),
    { action: l, method: r.toLowerCase(), encType: o, formData: c, body: d }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function xc(n, u) {
  if (n === !1 || n === null || typeof n > 'u') throw new Error(u);
}
function rm(n, u, r, l) {
  let o =
    typeof n == 'string'
      ? new URL(n, typeof window > 'u' ? 'server://singlefetch/' : window.location.origin)
      : n;
  return (
    r
      ? o.pathname.endsWith('/')
        ? (o.pathname = `${o.pathname}_.${l}`)
        : (o.pathname = `${o.pathname}.${l}`)
      : o.pathname === '/'
        ? (o.pathname = `_root.${l}`)
        : u && an(o.pathname, u) === '/'
          ? (o.pathname = `${ro(u)}/_root.${l}`)
          : (o.pathname = `${ro(o.pathname)}.${l}`),
    o
  );
}
async function TE(n, u) {
  if (n.id in u) return u[n.id];
  try {
    let r = await import(n.module);
    return ((u[n.id] = r), r);
  } catch (r) {
    return (
      console.error(`Error loading route module \`${n.module}\`, reloading page...`),
      console.error(r),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function RE(n) {
  return n == null
    ? !1
    : n.href == null
      ? n.rel === 'preload' && typeof n.imageSrcSet == 'string' && typeof n.imageSizes == 'string'
      : typeof n.rel == 'string' && typeof n.href == 'string';
}
async function ME(n, u, r) {
  let l = await Promise.all(
    n.map(async (o) => {
      let c = u.routes[o.route.id];
      if (c) {
        let d = await TE(c, r);
        return d.links ? d.links() : [];
      }
      return [];
    }),
  );
  return LE(
    l
      .flat(1)
      .filter(RE)
      .filter((o) => o.rel === 'stylesheet' || o.rel === 'preload')
      .map((o) =>
        o.rel === 'stylesheet' ? { ...o, rel: 'prefetch', as: 'style' } : { ...o, rel: 'prefetch' },
      ),
  );
}
function nv(n, u, r, l, o, c) {
  let d = (v, D) => (r[D] ? v.route.id !== r[D].route.id : !0),
    h = (v, D) => {
      var p;
      return (
        r[D].pathname !== v.pathname ||
        (((p = r[D].route.path) == null ? void 0 : p.endsWith('*')) &&
          r[D].params['*'] !== v.params['*'])
      );
    };
  return c === 'assets'
    ? u.filter((v, D) => d(v, D) || h(v, D))
    : c === 'data'
      ? u.filter((v, D) => {
          var C;
          let p = l.routes[v.route.id];
          if (!p || !p.hasLoader) return !1;
          if (d(v, D) || h(v, D)) return !0;
          if (v.route.shouldRevalidate) {
            let A = v.route.shouldRevalidate({
              currentUrl: new URL(o.pathname + o.search + o.hash, window.origin),
              currentParams: ((C = r[0]) == null ? void 0 : C.params) || {},
              nextUrl: new URL(n, window.origin),
              nextParams: v.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof A == 'boolean') return A;
          }
          return !0;
        })
      : [];
}
function jE(n, u, { includeHydrateFallback: r } = {}) {
  return NE(
    n
      .map((l) => {
        let o = u.routes[l.route.id];
        if (!o) return [];
        let c = [o.module];
        return (
          o.clientActionModule && (c = c.concat(o.clientActionModule)),
          o.clientLoaderModule && (c = c.concat(o.clientLoaderModule)),
          r && o.hydrateFallbackModule && (c = c.concat(o.hydrateFallbackModule)),
          o.imports && (c = c.concat(o.imports)),
          c
        );
      })
      .flat(1),
  );
}
function NE(n) {
  return [...new Set(n)];
}
function zE(n) {
  let u = {},
    r = Object.keys(n).sort();
  for (let l of r) u[l] = n[l];
  return u;
}
function LE(n, u) {
  let r = new Set();
  return (
    new Set(u),
    n.reduce((l, o) => {
      let c = JSON.stringify(zE(o));
      return (r.has(c) || (r.add(c), l.push({ key: c, link: o })), l);
    }, [])
  );
}
function Oc() {
  let n = F.useContext(ir);
  return (xc(n, 'You must render this element inside a <DataRouterContext.Provider> element'), n);
}
function HE() {
  let n = F.useContext(ho);
  return (
    xc(n, 'You must render this element inside a <DataRouterStateContext.Provider> element'),
    n
  );
}
var wc = F.createContext(void 0);
wc.displayName = 'FrameworkContext';
function vo() {
  let n = F.useContext(wc);
  return (xc(n, 'You must render this element inside a <HydratedRouter> element'), n);
}
function UE(n, u) {
  let r = F.useContext(wc),
    [l, o] = F.useState(!1),
    [c, d] = F.useState(!1),
    { onFocus: h, onBlur: v, onMouseEnter: D, onMouseLeave: p, onTouchStart: C } = u,
    A = F.useRef(null);
  (F.useEffect(() => {
    if ((n === 'render' && d(!0), n === 'viewport')) {
      let w = (b) => {
          b.forEach((m) => {
            d(m.isIntersecting);
          });
        },
        N = new IntersectionObserver(w, { threshold: 0.5 });
      return (
        A.current && N.observe(A.current),
        () => {
          N.disconnect();
        }
      );
    }
  }, [n]),
    F.useEffect(() => {
      if (l) {
        let w = setTimeout(() => {
          d(!0);
        }, 100);
        return () => {
          clearTimeout(w);
        };
      }
    }, [l]));
  let B = () => {
      o(!0);
    },
    S = () => {
      (o(!1), d(!1));
    };
  return r
    ? n !== 'intent'
      ? [c, A, {}]
      : [
          c,
          A,
          {
            onFocus: al(h, B),
            onBlur: al(v, S),
            onMouseEnter: al(D, B),
            onMouseLeave: al(p, S),
            onTouchStart: al(C, B),
          },
        ]
    : [!1, A, {}];
}
function al(n, u) {
  return (r) => {
    (n && n(r), r.defaultPrevented || u(r));
  };
}
function kE({ page: n, ...u }) {
  let r = WC(),
    { nonce: l } = vo(),
    { router: o } = Oc(),
    c = F.useMemo(() => _g(o.routes, n, o.basename), [o.routes, n, o.basename]);
  return c
    ? (u.nonce == null && l && (u = { ...u, nonce: l }),
      r
        ? F.createElement(_E, { page: n, matches: c, ...u })
        : F.createElement(GE, { page: n, matches: c, ...u }))
    : null;
}
function qE(n) {
  let { manifest: u, routeModules: r } = vo(),
    [l, o] = F.useState([]);
  return (
    F.useEffect(() => {
      let c = !1;
      return (
        ME(n, u, r).then((d) => {
          c || o(d);
        }),
        () => {
          c = !0;
        }
      );
    }, [n, u, r]),
    l
  );
}
function _E({ page: n, matches: u, ...r }) {
  let l = sn(),
    { future: o } = vo(),
    { basename: c } = Oc(),
    d = F.useMemo(() => {
      if (n === l.pathname + l.search + l.hash) return [];
      let h = rm(n, c, o.v8_trailingSlashAwareDataRequests, 'rsc'),
        v = !1,
        D = [];
      for (let p of u)
        typeof p.route.shouldRevalidate == 'function' ? (v = !0) : D.push(p.route.id);
      return (
        v && D.length > 0 && h.searchParams.set('_routes', D.join(',')),
        [h.pathname + h.search]
      );
    }, [c, o.v8_trailingSlashAwareDataRequests, n, l, u]);
  return F.createElement(
    F.Fragment,
    null,
    d.map((h) => F.createElement('link', { key: h, rel: 'prefetch', as: 'fetch', href: h, ...r })),
  );
}
function GE({ page: n, matches: u, ...r }) {
  let l = sn(),
    { future: o, manifest: c, routeModules: d } = vo(),
    { basename: h } = Oc(),
    { loaderData: v, matches: D } = HE(),
    p = F.useMemo(() => nv(n, u, D, c, l, 'data'), [n, u, D, c, l]),
    C = F.useMemo(() => nv(n, u, D, c, l, 'assets'), [n, u, D, c, l]),
    A = F.useMemo(() => {
      if (n === l.pathname + l.search + l.hash) return [];
      let w = new Set(),
        N = !1;
      if (
        (u.forEach((m) => {
          var _;
          let M = c.routes[m.route.id];
          !M ||
            !M.hasLoader ||
            ((!p.some((K) => K.route.id === m.route.id) &&
              m.route.id in v &&
              (_ = d[m.route.id]) != null &&
              _.shouldRevalidate) ||
            M.hasClientLoader
              ? (N = !0)
              : w.add(m.route.id));
        }),
        w.size === 0)
      )
        return [];
      let b = rm(n, h, o.v8_trailingSlashAwareDataRequests, 'data');
      return (
        N &&
          w.size > 0 &&
          b.searchParams.set(
            '_routes',
            u
              .filter((m) => w.has(m.route.id))
              .map((m) => m.route.id)
              .join(','),
          ),
        [b.pathname + b.search]
      );
    }, [h, o.v8_trailingSlashAwareDataRequests, v, l, c, p, u, n, d]),
    B = F.useMemo(() => jE(C, c), [C, c]),
    S = qE(C);
  return F.createElement(
    F.Fragment,
    null,
    A.map((w) => F.createElement('link', { key: w, rel: 'prefetch', as: 'fetch', href: w, ...r })),
    B.map((w) => F.createElement('link', { key: w, rel: 'modulepreload', href: w, ...r })),
    S.map(({ key: w, link: N }) =>
      F.createElement('link', {
        key: w,
        nonce: r.nonce,
        ...N,
        crossOrigin: N.crossOrigin ?? r.crossOrigin,
      }),
    ),
  );
}
function YE(...n) {
  return (u) => {
    n.forEach((r) => {
      typeof r == 'function' ? r(u) : r != null && (r.current = u);
    });
  };
}
var VE =
  typeof window < 'u' && typeof window.document < 'u' && typeof window.document.createElement < 'u';
try {
  VE && (window.__reactRouterVersion = '7.18.1');
} catch {}
function PE({ basename: n, children: u, useTransitions: r, window: l }) {
  let o = F.useRef();
  o.current == null && (o.current = BC({ window: l, v5Compat: !0 }));
  let c = o.current,
    [d, h] = F.useState({ action: c.action, location: c.location }),
    v = F.useCallback(
      (D) => {
        r === !1 ? h(D) : F.startTransition(() => h(D));
      },
      [r],
    );
  return (
    F.useLayoutEffect(() => c.listen(v), [c, v]),
    F.createElement(EE, {
      basename: n,
      children: u,
      location: d.location,
      navigationType: d.action,
      navigator: c,
      useTransitions: r,
    })
  );
}
var Tc = F.forwardRef(function (
  {
    onClick: u,
    discover: r = 'render',
    prefetch: l = 'none',
    relative: o,
    reloadDocument: c,
    replace: d,
    mask: h,
    state: v,
    target: D,
    to: p,
    preventScrollReset: C,
    viewTransition: A,
    defaultShouldRevalidate: B,
    ...S
  },
  w,
) {
  let { basename: N, navigator: b, useTransitions: m } = F.useContext(pu),
    M = typeof p == 'string' && Ac.test(p),
    _ = Zg(p, N);
  p = _.to;
  let K = aE(p, { relative: o }),
    ue = sn(),
    X = null;
  if (h) {
    let ne = Bc(h, [], ue.mask ? ue.mask.pathname : '/', !0);
    (N !== '/' && (ne.pathname = ne.pathname === '/' ? N : Su([N, ne.pathname])),
      (X = b.createHref(ne)));
  }
  let [ie, se, he] = UE(l, S),
    de = ZE(p, {
      replace: d,
      mask: h,
      state: v,
      target: D,
      preventScrollReset: C,
      relative: o,
      viewTransition: A,
      defaultShouldRevalidate: B,
      useTransitions: m,
    });
  function W(ne) {
    (u && u(ne), ne.defaultPrevented || de(ne));
  }
  let Q = !(_.isExternal || c),
    ae = F.createElement('a', {
      ...S,
      ...he,
      href: (Q ? X : void 0) || _.absoluteURL || K,
      onClick: Q ? W : u,
      ref: YE(w, se),
      target: D,
      'data-discover': !M && r === 'render' ? 'true' : void 0,
    });
  return ie && !M ? F.createElement(F.Fragment, null, ae, F.createElement(kE, { page: K })) : ae;
});
Tc.displayName = 'Link';
var KE = F.forwardRef(function (
  {
    'aria-current': u = 'page',
    caseSensitive: r = !1,
    className: l = '',
    end: o = !1,
    style: c,
    to: d,
    viewTransition: h,
    children: v,
    ...D
  },
  p,
) {
  let C = Al(d, { relative: D.relative }),
    A = sn(),
    B = F.useContext(ho),
    { navigator: S, basename: w } = F.useContext(pu),
    N = B != null && ey(C) && h === !0,
    b = S.encodeLocation ? S.encodeLocation(C).pathname : C.pathname,
    m = A.pathname,
    M = B && B.navigation && B.navigation.location ? B.navigation.location.pathname : null;
  (r || ((m = m.toLowerCase()), (M = M ? M.toLowerCase() : null), (b = b.toLowerCase())),
    M && w && (M = an(M, w) || M));
  const _ = b !== '/' && b.endsWith('/') ? b.length - 1 : b.length;
  let K = m === b || (!o && m.startsWith(b) && m.charAt(_) === '/'),
    ue = M != null && (M === b || (!o && M.startsWith(b) && M.charAt(b.length) === '/')),
    X = { isActive: K, isPending: ue, isTransitioning: N },
    ie = K ? u : void 0,
    se;
  typeof l == 'function'
    ? (se = l(X))
    : (se = [l, K ? 'active' : null, ue ? 'pending' : null, N ? 'transitioning' : null]
        .filter(Boolean)
        .join(' '));
  let he = typeof c == 'function' ? c(X) : c;
  return F.createElement(
    Tc,
    { ...D, 'aria-current': ie, className: se, ref: p, style: he, to: d, viewTransition: h },
    typeof v == 'function' ? v(X) : v,
  );
});
KE.displayName = 'NavLink';
var XE = F.forwardRef(
  (
    {
      discover: n = 'render',
      fetcherKey: u,
      navigate: r,
      reloadDocument: l,
      replace: o,
      state: c,
      method: d = Ii,
      action: h,
      onSubmit: v,
      relative: D,
      preventScrollReset: p,
      viewTransition: C,
      defaultShouldRevalidate: A,
      ...B
    },
    S,
  ) => {
    let { useTransitions: w } = F.useContext(pu),
      N = JE(),
      b = IE(h, { relative: D }),
      m = d.toLowerCase() === 'get' ? 'get' : 'post',
      M = typeof h == 'string' && Ac.test(h),
      _ = (K) => {
        if ((v && v(K), K.defaultPrevented)) return;
        K.preventDefault();
        let ue = K.nativeEvent.submitter,
          X = (ue == null ? void 0 : ue.getAttribute('formmethod')) || d,
          ie = () =>
            N(ue || K.currentTarget, {
              fetcherKey: u,
              method: X,
              navigate: r,
              replace: o,
              state: c,
              relative: D,
              preventScrollReset: p,
              viewTransition: C,
              defaultShouldRevalidate: A,
            });
        w && r !== !1 ? F.startTransition(() => ie()) : ie();
      };
    return F.createElement('form', {
      ref: S,
      method: m,
      action: b,
      onSubmit: l ? v : _,
      ...B,
      'data-discover': !M && n === 'render' ? 'true' : void 0,
    });
  },
);
XE.displayName = 'Form';
function QE(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function lm(n) {
  let u = F.useContext(ir);
  return (ft(u, QE(n)), u);
}
function ZE(
  n,
  {
    target: u,
    replace: r,
    mask: l,
    state: o,
    preventScrollReset: c,
    relative: d,
    viewTransition: h,
    defaultShouldRevalidate: v,
    useTransitions: D,
  } = {},
) {
  let p = rE(),
    C = sn(),
    A = Al(n, { relative: d });
  return F.useCallback(
    (B) => {
      if (SE(B, u)) {
        B.preventDefault();
        let S = r !== void 0 ? r : dl(C) === dl(A),
          w = () =>
            p(n, {
              replace: S,
              mask: l,
              state: o,
              preventScrollReset: c,
              relative: d,
              viewTransition: h,
              defaultShouldRevalidate: v,
            });
        D ? F.startTransition(() => w()) : w();
      }
    },
    [C, p, A, r, l, o, u, n, c, d, h, v, D],
  );
}
var $E = 0,
  WE = () => `__${String(++$E)}__`;
function JE() {
  let { router: n } = lm('useSubmit'),
    { basename: u } = F.useContext(pu),
    r = gE(),
    l = n.fetch,
    o = n.navigate;
  return F.useCallback(
    async (c, d = {}) => {
      let { action: h, method: v, encType: D, formData: p, body: C } = wE(c, u);
      if (d.navigate === !1) {
        let A = d.fetcherKey || WE();
        await l(A, r, d.action || h, {
          defaultShouldRevalidate: d.defaultShouldRevalidate,
          preventScrollReset: d.preventScrollReset,
          formData: p,
          body: C,
          formMethod: d.method || v,
          formEncType: d.encType || D,
          flushSync: d.flushSync,
        });
      } else
        await o(d.action || h, {
          defaultShouldRevalidate: d.defaultShouldRevalidate,
          preventScrollReset: d.preventScrollReset,
          formData: p,
          body: C,
          formMethod: d.method || v,
          formEncType: d.encType || D,
          replace: d.replace,
          state: d.state,
          fromRouteId: r,
          flushSync: d.flushSync,
          viewTransition: d.viewTransition,
        });
    },
    [l, o, u, r],
  );
}
function IE(n, { relative: u } = {}) {
  let { basename: r } = F.useContext(pu),
    l = F.useContext(on);
  ft(l, 'useFormAction must be used inside a RouteContext');
  let [o] = l.matches.slice(-1),
    c = { ...Al(n || '.', { relative: u }) },
    d = sn();
  if (n == null) {
    c.search = d.search;
    let h = new URLSearchParams(c.search),
      v = h.getAll('index');
    if (v.some((p) => p === '')) {
      (h.delete('index'), v.filter((C) => C).forEach((C) => h.append('index', C)));
      let p = h.toString();
      c.search = p ? `?${p}` : '';
    }
  }
  return (
    (!n || n === '.') &&
      o.route.index &&
      (c.search = c.search ? c.search.replace(/^\?/, '?index&') : '?index'),
    r !== '/' && (c.pathname = c.pathname === '/' ? r : Su([r, c.pathname])),
    dl(c)
  );
}
function ey(n, { relative: u } = {}) {
  let r = F.useContext(Jg);
  ft(
    r != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: l } = lm('useViewTransitionState'),
    o = Al(n, { relative: u });
  if (!r.isTransitioning) return !1;
  let c = an(r.currentLocation.pathname, l) || r.currentLocation.pathname,
    d = an(r.nextLocation.pathname, l) || r.nextLocation.pathname;
  return ao(o.pathname, d) != null || ao(o.pathname, c) != null;
}
var ty = kg();
const uy = Cl(ty);
var ny = {
    transform(n, u) {
      var { current: r, affinity: l } = n;
      if (r != null) {
        var o = T.transform(r, u, { affinity: l });
        ((n.current = o), o == null && n.unref());
      }
    },
  },
  ay = {
    transform(n, u) {
      var { current: r, affinity: l } = n;
      if (r != null) {
        var o = Ke.transform(r, u, { affinity: l });
        ((n.current = o), o == null && n.unref());
      }
    },
  },
  ry = {
    transform(n, u) {
      var { current: r, affinity: l } = n;
      if (r != null) {
        var o = ee.transform(r, u, { affinity: l });
        ((n.current = o), o == null && n.unref());
      }
    },
  },
  lo = new WeakMap(),
  io = new WeakMap(),
  ll = new WeakMap(),
  im = new WeakMap(),
  av = new WeakMap(),
  rv = new WeakMap(),
  lv = new WeakMap(),
  T = {
    ancestors(n) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        { reverse: r = !1 } = u,
        l = T.levels(n, u);
      return (r ? (l = l.slice(1)) : (l = l.slice(0, -1)), l);
    },
    common(n, u) {
      for (var r = [], l = 0; l < n.length && l < u.length; l++) {
        var o = n[l],
          c = u[l];
        if (typeof o != 'number' || typeof c != 'number')
          throw new Error('Got non-numeric path index');
        if (o !== c) break;
        r.push(o);
      }
      return r;
    },
    compare(n, u) {
      for (var r = Math.min(n.length, u.length), l = 0; l < r; l++) {
        if (n[l] < u[l]) return -1;
        if (n[l] > u[l]) return 1;
      }
      return 0;
    },
    endsAfter(n, u) {
      var r = n.length - 1,
        l = n.slice(0, r),
        o = u.slice(0, r),
        c = n[r],
        d = u[r];
      return T.equals(l, o) && c > d;
    },
    endsAt(n, u) {
      var r = n.length,
        l = n.slice(0, r),
        o = u.slice(0, r);
      return T.equals(l, o);
    },
    endsBefore(n, u) {
      var r = n.length - 1,
        l = n.slice(0, r),
        o = u.slice(0, r),
        c = n[r],
        d = u[r];
      return T.equals(l, o) && c < d;
    },
    equals(n, u) {
      return n.length === u.length && n.every((r, l) => r === u[l]);
    },
    hasPrevious(n) {
      return n[n.length - 1] > 0;
    },
    isAfter(n, u) {
      return T.compare(n, u) === 1;
    },
    isAncestor(n, u) {
      return n.length < u.length && T.compare(n, u) === 0;
    },
    isBefore(n, u) {
      return T.compare(n, u) === -1;
    },
    isChild(n, u) {
      return n.length === u.length + 1 && T.compare(n, u) === 0;
    },
    isCommon(n, u) {
      return n.length <= u.length && T.compare(n, u) === 0;
    },
    isDescendant(n, u) {
      return n.length > u.length && T.compare(n, u) === 0;
    },
    isParent(n, u) {
      return n.length + 1 === u.length && T.compare(n, u) === 0;
    },
    isPath(n) {
      return Array.isArray(n) && n.every((u) => typeof u == 'number');
    },
    isSibling(n, u) {
      if (n.length !== u.length) return !1;
      var r = n.slice(0, -1),
        l = u.slice(0, -1),
        o = n[n.length - 1],
        c = u[u.length - 1];
      return o !== c && T.equals(r, l);
    },
    levels(n) {
      for (
        var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
          { reverse: r = !1 } = u,
          l = [],
          o = 0;
        o <= n.length;
        o++
      )
        l.push(n.slice(0, o));
      return (r && l.reverse(), l);
    },
    next(n) {
      if (n.length === 0)
        throw new Error(
          'Cannot get the next path of a root path ['.concat(n, '], because it has no next index.'),
        );
      var u = n[n.length - 1];
      return n.slice(0, -1).concat(u + 1);
    },
    operationCanTransformPath(n) {
      switch (n.type) {
        case 'insert_node':
        case 'remove_node':
        case 'merge_node':
        case 'split_node':
        case 'move_node':
          return !0;
        default:
          return !1;
      }
    },
    parent(n) {
      if (n.length === 0)
        throw new Error('Cannot get the parent path of the root path ['.concat(n, '].'));
      return n.slice(0, -1);
    },
    previous(n) {
      if (n.length === 0)
        throw new Error(
          'Cannot get the previous path of a root path ['.concat(
            n,
            '], because it has no previous index.',
          ),
        );
      var u = n[n.length - 1];
      if (u <= 0)
        throw new Error(
          'Cannot get the previous path of a first child path ['.concat(
            n,
            '] because it would result in a negative index.',
          ),
        );
      return n.slice(0, -1).concat(u - 1);
    },
    relative(n, u) {
      if (!T.isAncestor(u, n) && !T.equals(n, u))
        throw new Error(
          'Cannot get the relative path of ['
            .concat(n, '] inside ancestor [')
            .concat(u, '], because it is not above or equal to the path.'),
        );
      return n.slice(u.length);
    },
    transform(n, u) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (!n) return null;
      var l = [...n],
        { affinity: o = 'forward' } = r;
      if (n.length === 0) return l;
      switch (u.type) {
        case 'insert_node': {
          var { path: c } = u;
          (T.equals(c, l) || T.endsBefore(c, l) || T.isAncestor(c, l)) && (l[c.length - 1] += 1);
          break;
        }
        case 'remove_node': {
          var { path: d } = u;
          if (T.equals(d, l) || T.isAncestor(d, l)) return null;
          T.endsBefore(d, l) && (l[d.length - 1] -= 1);
          break;
        }
        case 'merge_node': {
          var { path: h, position: v } = u;
          T.equals(h, l) || T.endsBefore(h, l)
            ? (l[h.length - 1] -= 1)
            : T.isAncestor(h, l) && ((l[h.length - 1] -= 1), (l[h.length] += v));
          break;
        }
        case 'split_node': {
          var { path: D, position: p } = u;
          if (T.equals(D, l)) {
            if (o === 'forward') l[l.length - 1] += 1;
            else if (o !== 'backward') return null;
          } else
            T.endsBefore(D, l)
              ? (l[D.length - 1] += 1)
              : T.isAncestor(D, l) &&
                n[D.length] >= p &&
                ((l[D.length - 1] += 1), (l[D.length] -= p));
          break;
        }
        case 'move_node': {
          var { path: C, newPath: A } = u;
          if (T.equals(C, A)) return l;
          if (T.isAncestor(C, l) || T.equals(C, l)) {
            var B = A.slice();
            return (
              T.endsBefore(C, A) && C.length < A.length && (B[C.length - 1] -= 1),
              B.concat(l.slice(C.length))
            );
          } else
            T.isSibling(C, A) && (T.isAncestor(A, l) || T.equals(A, l))
              ? T.endsBefore(C, l)
                ? (l[C.length - 1] -= 1)
                : (l[C.length - 1] += 1)
              : T.endsBefore(A, l) || T.equals(A, l) || T.isAncestor(A, l)
                ? (T.endsBefore(C, l) && (l[C.length - 1] -= 1), (l[A.length - 1] += 1))
                : T.endsBefore(C, l) &&
                  (T.equals(A, l) && (l[A.length - 1] += 1), (l[C.length - 1] -= 1));
          break;
        }
      }
      return l;
    },
  };
function hl(n) {
  '@babel/helpers - typeof';
  return (
    (hl =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (u) {
            return typeof u;
          }
        : function (u) {
            return u &&
              typeof Symbol == 'function' &&
              u.constructor === Symbol &&
              u !== Symbol.prototype
              ? 'symbol'
              : typeof u;
          }),
    hl(n)
  );
}
function ly(n, u) {
  if (hl(n) !== 'object' || n === null) return n;
  var r = n[Symbol.toPrimitive];
  if (r !== void 0) {
    var l = r.call(n, u);
    if (hl(l) !== 'object') return l;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (u === 'string' ? String : Number)(n);
}
function iy(n) {
  var u = ly(n, 'string');
  return hl(u) === 'symbol' ? u : String(u);
}
function zt(n, u, r) {
  return (
    (u = iy(u)),
    u in n
      ? Object.defineProperty(n, u, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (n[u] = r),
    n
  );
}
function oy(n, u) {
  if (n == null) return {};
  var r = {},
    l = Object.keys(n),
    o,
    c;
  for (c = 0; c < l.length; c++) ((o = l[c]), !(u.indexOf(o) >= 0) && (r[o] = n[o]));
  return r;
}
function rn(n, u) {
  if (n == null) return {};
  var r = oy(n, u),
    l,
    o;
  if (Object.getOwnPropertySymbols) {
    var c = Object.getOwnPropertySymbols(n);
    for (o = 0; o < c.length; o++)
      ((l = c[o]),
        !(u.indexOf(l) >= 0) && Object.prototype.propertyIsEnumerable.call(n, l) && (r[l] = n[l]));
  }
  return r;
}
var sy = ['anchor', 'focus'];
function iv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function fy(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? iv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : iv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var ee = {
    edges(n) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        { reverse: r = !1 } = u,
        { anchor: l, focus: o } = n;
      return ee.isBackward(n) === r ? [l, o] : [o, l];
    },
    end(n) {
      var [, u] = ee.edges(n);
      return u;
    },
    equals(n, u) {
      return Ke.equals(n.anchor, u.anchor) && Ke.equals(n.focus, u.focus);
    },
    surrounds(n, u) {
      var r = ee.intersection(n, u);
      return r ? ee.equals(r, u) : !1;
    },
    includes(n, u) {
      if (Re.isRange(u)) {
        if (ee.includes(n, u.anchor) || ee.includes(n, u.focus)) return !0;
        var [r, l] = ee.edges(n),
          [o, c] = ee.edges(u);
        return Ke.isBefore(r, o) && Ke.isAfter(l, c);
      }
      var [d, h] = ee.edges(n),
        v = !1,
        D = !1;
      return (
        Re.isPoint(u)
          ? ((v = Ke.compare(u, d) >= 0), (D = Ke.compare(u, h) <= 0))
          : ((v = T.compare(u, d.path) >= 0), (D = T.compare(u, h.path) <= 0)),
        v && D
      );
    },
    intersection(n, u) {
      var { anchor: r, focus: l } = n,
        o = rn(n, sy),
        [c, d] = ee.edges(n),
        [h, v] = ee.edges(u),
        D = Ke.isBefore(c, h) ? h : c,
        p = Ke.isBefore(d, v) ? d : v;
      return Ke.isBefore(p, D) ? null : fy({ anchor: D, focus: p }, o);
    },
    isBackward(n) {
      var { anchor: u, focus: r } = n;
      return Ke.isAfter(u, r);
    },
    isCollapsed(n) {
      var { anchor: u, focus: r } = n;
      return Ke.equals(u, r);
    },
    isExpanded(n) {
      return !ee.isCollapsed(n);
    },
    isForward(n) {
      return !ee.isBackward(n);
    },
    isRange(n) {
      return Ht(n) && Ke.isPoint(n.anchor) && Ke.isPoint(n.focus);
    },
    *points(n) {
      (yield [n.anchor, 'anchor'], yield [n.focus, 'focus']);
    },
    start(n) {
      var [u] = ee.edges(n);
      return u;
    },
    transform(n, u) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n === null) return null;
      var { affinity: l = 'inward' } = r,
        o,
        c;
      if (l === 'inward') {
        var d = ee.isCollapsed(n);
        ee.isForward(n)
          ? ((o = 'forward'), (c = d ? o : 'backward'))
          : ((o = 'backward'), (c = d ? o : 'forward'));
      } else
        l === 'outward'
          ? ee.isForward(n)
            ? ((o = 'backward'), (c = 'forward'))
            : ((o = 'forward'), (c = 'backward'))
          : ((o = l), (c = l));
      var h = Ke.transform(n.anchor, u, { affinity: o }),
        v = Ke.transform(n.focus, u, { affinity: c });
      return !h || !v ? null : { anchor: h, focus: v };
    },
  },
  ov = function (u) {
    var { deep: r = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!Ht(u)) return !1;
    var l = typeof u.apply == 'function';
    if (l) return !1;
    var o = r ? j.isNodeList(u.children) : Array.isArray(u.children);
    return o;
  },
  ur = {
    isAncestor(n) {
      var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return Ht(n) && j.isNodeList(n.children, { deep: u });
    },
    isElement: ov,
    isElementList(n) {
      var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return Array.isArray(n) && n.every((r) => ur.isElement(r, { deep: u }));
    },
    isElementProps(n) {
      return n.children !== void 0;
    },
    isElementType: function (u, r) {
      var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'type';
      return ov(u) && u[l] === r;
    },
    matches(n, u) {
      for (var r in u) if (r !== 'children' && n[r] !== u[r]) return !1;
      return !0;
    },
  },
  cy = ['text'],
  dy = ['children'];
function sv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Yi(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? sv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : sv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var j = {
  ancestor(n, u) {
    var r = j.get(n, u);
    if (j.isText(r))
      throw new Error(
        'Cannot get the ancestor node at path ['
          .concat(u, '] because it refers to a text node instead: ')
          .concat(Bt.stringify(r)),
      );
    return r;
  },
  ancestors(n, u) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (function* () {
      for (var l of T.ancestors(u, r)) {
        var o = j.ancestor(n, l),
          c = [o, l];
        yield c;
      }
    })();
  },
  child(n, u) {
    if (j.isText(n))
      throw new Error('Cannot get the child of a text node: '.concat(Bt.stringify(n)));
    if (typeof u != 'number') throw new Error('Expected index to be a number');
    var r = n.children[u];
    if (r == null)
      throw new Error(
        'Cannot get child at index `'.concat(u, '` in node: ').concat(Bt.stringify(n)),
      );
    return r;
  },
  children(n, u) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (function* () {
      for (
        var { reverse: l = !1 } = r,
          o = j.ancestor(n, u),
          { children: c } = o,
          d = l ? c.length - 1 : 0;
        l ? d >= 0 : d < c.length;
      ) {
        var h = j.child(o, d),
          v = u.concat(d);
        (yield [h, v], (d = l ? d - 1 : d + 1));
      }
    })();
  },
  common(n, u, r) {
    var l = T.common(u, r),
      o = j.get(n, l);
    return [o, l];
  },
  descendant(n, u) {
    var r = j.get(n, u);
    if (j.isEditor(r))
      throw new Error(
        'Cannot get the descendant node at path ['
          .concat(u, '] because it refers to the root editor node instead: ')
          .concat(Bt.stringify(r)),
      );
    return r;
  },
  descendants(n) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [r, l] of j.nodes(n, u)) l.length !== 0 && (yield [r, l]);
    })();
  },
  elements(n) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [r, l] of j.nodes(n, u)) j.isElement(r) && (yield [r, l]);
    })();
  },
  extractProps(n) {
    if (j.isText(n)) {
      var { text: u } = n,
        r = rn(n, cy);
      return r;
    } else {
      var { children: l } = n,
        r = rn(n, dy);
      return r;
    }
  },
  first(n, u) {
    for (var r = u.slice(), l = j.get(n, r); l && !(j.isText(l) || l.children.length === 0);)
      ((l = l.children[0]), r.push(0));
    return [l, r];
  },
  fragment(n, u) {
    var r = { children: n.children },
      [l, o] = ee.edges(u),
      c = j.nodes(r, {
        reverse: !0,
        pass: (v) => {
          var [, D] = v;
          return !ee.includes(u, D);
        },
      }),
      d = function () {
        if (!ee.includes(u, h)) {
          var D = h[h.length - 1];
          oa(r, T.parent(h), (p) => cc(p, D, 1));
        }
        (T.equals(h, o.path) &&
          so(r, h, (p) => {
            var C = p.text.slice(0, o.offset);
            return Yi(Yi({}, p), {}, { text: C });
          }),
          T.equals(h, l.path) &&
            so(r, h, (p) => {
              var C = p.text.slice(l.offset);
              return Yi(Yi({}, p), {}, { text: C });
            }));
      };
    for (var [, h] of c) d();
    return r.children;
  },
  get(n, u) {
    var r = j.getIf(n, u);
    if (r === void 0)
      throw new Error(
        'Cannot find a descendant at path ['.concat(u, '] in node: ').concat(Bt.stringify(n)),
      );
    return r;
  },
  getIf(n, u) {
    for (var r = n, l = 0; l < u.length; l++) {
      var o = u[l];
      if (typeof o != 'number') throw new Error('Got non-numeric path index');
      if (j.isText(r) || !r.children[o]) return;
      r = r.children[o];
    }
    return r;
  },
  has(n, u) {
    for (var r = n, l = 0; l < u.length; l++) {
      var o = u[l];
      if (typeof o != 'number') throw new Error('Got non-numeric path index');
      if (j.isText(r) || !r.children[o]) return !1;
      r = r.children[o];
    }
    return !0;
  },
  isAncestor(n) {
    return !j.isText(n);
  },
  isEditor(n) {
    return typeof n.apply == 'function';
  },
  isElement(n) {
    return Array.isArray(n.children) && typeof n.apply != 'function';
  },
  isNode(n) {
    var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return nn.isText(n) || ur.isElement(n, { deep: u }) || E.isEditor(n, { deep: u });
  },
  isNodeList(n) {
    var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Array.isArray(n) && n.every((r) => j.isNode(r, { deep: u }));
  },
  isText(n) {
    return typeof n.text == 'string';
  },
  last(n, u) {
    for (var r = u.slice(), l = j.get(n, r); l && !(j.isText(l) || l.children.length === 0);) {
      var o = l.children.length - 1;
      ((l = l.children[o]), r.push(o));
    }
    return [l, r];
  },
  leaf(n, u) {
    var r = j.get(n, u);
    if (!j.isText(r))
      throw new Error(
        'Cannot get the leaf node at path ['
          .concat(u, '] because it refers to a non-leaf node: ')
          .concat(Bt.stringify(r)),
      );
    return r;
  },
  levels(n, u) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (function* () {
      for (var l of T.levels(u, r)) {
        var o = j.get(n, l);
        yield [o, l];
      }
    })();
  },
  matches(n, u) {
    return (
      (j.isElement(n) && ur.isElementProps(u) && ur.matches(n, u)) ||
      (j.isText(n) && nn.isTextProps(u) && nn.matches(n, u))
    );
  },
  nodes(n) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (
        var { pass: r, reverse: l = !1 } = u,
          { from: o = [], to: c } = u,
          d = new Set(),
          h = [],
          v = n;
        !(c && (l ? T.isBefore(h, c) : T.isAfter(h, c)));
      ) {
        if (
          (d.has(v) || (yield [v, h]),
          !d.has(v) && !j.isText(v) && v.children.length !== 0 && (r == null || r([v, h]) === !1))
        ) {
          d.add(v);
          var D = l ? v.children.length - 1 : 0;
          (T.isAncestor(h, o) && (D = o[h.length]), (h = h.concat(D)), (v = j.get(n, h)));
          continue;
        }
        if (h.length === 0) break;
        if (!l) {
          var p = T.next(h);
          if (j.has(n, p)) {
            ((h = p), (v = j.get(n, h)));
            continue;
          }
        }
        if (l && h[h.length - 1] !== 0) {
          var C = T.previous(h);
          ((h = C), (v = j.get(n, h)));
          continue;
        }
        ((h = T.parent(h)), (v = j.get(n, h)), d.add(v));
      }
    })();
  },
  parent(n, u) {
    var r = T.parent(u),
      l = j.get(n, r);
    if (j.isText(l))
      throw new Error(
        'Cannot get the parent of path ['.concat(u, '] because it does not exist in the root.'),
      );
    return l;
  },
  string(n) {
    return j.isText(n) ? n.text : n.children.map(j.string).join('');
  },
  texts(n) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [r, l] of j.nodes(n, u)) j.isText(r) && (yield [r, l]);
    })();
  },
};
function fv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function it(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? fv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : fv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var qn = {
    isNodeOperation(n) {
      return qn.isOperation(n) && n.type.endsWith('_node');
    },
    isOperation(n) {
      if (!Ht(n)) return !1;
      switch (n.type) {
        case 'insert_node':
          return T.isPath(n.path) && j.isNode(n.node);
        case 'insert_text':
          return typeof n.offset == 'number' && typeof n.text == 'string' && T.isPath(n.path);
        case 'merge_node':
          return typeof n.position == 'number' && T.isPath(n.path) && Ht(n.properties);
        case 'move_node':
          return T.isPath(n.path) && T.isPath(n.newPath);
        case 'remove_node':
          return T.isPath(n.path) && j.isNode(n.node);
        case 'remove_text':
          return typeof n.offset == 'number' && typeof n.text == 'string' && T.isPath(n.path);
        case 'set_node':
          return T.isPath(n.path) && Ht(n.properties) && Ht(n.newProperties);
        case 'set_selection':
          return (
            (n.properties === null && ee.isRange(n.newProperties)) ||
            (n.newProperties === null && ee.isRange(n.properties)) ||
            (Ht(n.properties) && Ht(n.newProperties))
          );
        case 'split_node':
          return T.isPath(n.path) && typeof n.position == 'number' && Ht(n.properties);
        default:
          return !1;
      }
    },
    isOperationList(n) {
      return Array.isArray(n) && n.every((u) => qn.isOperation(u));
    },
    isSelectionOperation(n) {
      return qn.isOperation(n) && n.type.endsWith('_selection');
    },
    isTextOperation(n) {
      return qn.isOperation(n) && n.type.endsWith('_text');
    },
    inverse(n) {
      switch (n.type) {
        case 'insert_node':
          return it(it({}, n), {}, { type: 'remove_node' });
        case 'insert_text':
          return it(it({}, n), {}, { type: 'remove_text' });
        case 'merge_node':
          return it(it({}, n), {}, { type: 'split_node', path: T.previous(n.path) });
        case 'move_node': {
          var { newPath: u, path: r } = n;
          if (T.equals(u, r)) return n;
          if (T.isSibling(r, u)) return it(it({}, n), {}, { path: u, newPath: r });
          var l = T.transform(r, n),
            o = T.transform(T.next(r), n);
          return it(it({}, n), {}, { path: l, newPath: o });
        }
        case 'remove_node':
          return it(it({}, n), {}, { type: 'insert_node' });
        case 'remove_text':
          return it(it({}, n), {}, { type: 'insert_text' });
        case 'set_node': {
          var { properties: c, newProperties: d } = n;
          return it(it({}, n), {}, { properties: d, newProperties: c });
        }
        case 'set_selection': {
          var { properties: h, newProperties: v } = n;
          return h == null
            ? it(it({}, n), {}, { properties: v, newProperties: null })
            : v == null
              ? it(it({}, n), {}, { properties: null, newProperties: h })
              : it(it({}, n), {}, { properties: v, newProperties: h });
        }
        case 'split_node':
          return it(it({}, n), {}, { type: 'merge_node', path: T.next(n.path) });
      }
    },
  },
  Ht = (n) => typeof n == 'object' && n !== null,
  om = (n, u) => {
    for (var r in n) {
      var l = Object.hasOwn(n, r) ? n[r] : void 0,
        o = Object.hasOwn(u, r) ? u[r] : void 0;
      if (Array.isArray(l) && Array.isArray(o)) {
        if (l.length !== o.length) return !1;
        for (var c = 0; c < l.length; c++) if (l[c] !== o[c]) return !1;
      } else if (Ht(l) && Ht(o)) {
        if (!om(l, o)) return !1;
      } else if (l !== o) return !1;
    }
    for (var d in u) if (n[d] === void 0 && u[d] !== void 0) return !1;
    return !0;
  },
  Rc = (n) => (n.selection ? n.selection : n.children.length > 0 ? E.end(n, []) : [0]),
  or = (n, u) => {
    var [r] = E.node(n, u);
    return (l) => l === r;
  },
  Mc = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
      l = !r,
      o = r ? py(u) : u,
      c = Fe.None,
      d = Fe.None,
      h = 0,
      v = null,
      D = null,
      p = null;
    for (var C of o) {
      var A = C.codePointAt(0);
      if (!A) break;
      var B = jy(C, A);
      if (
        (([c, d] = l ? [d, B] : [B, c]),
        (Un(c, Fe.ZWJ) &&
          Un(d, Fe.ExtPict) &&
          (l ? (v = cv(u.substring(0, h))) : (v = cv(u.substring(0, u.length - h))), !v)) ||
          (Un(c, Fe.RI) &&
            Un(d, Fe.RI) &&
            (D !== null ? (D = !D) : l ? (D = !0) : (D = ky(u.substring(0, u.length - h))), !D)) ||
          (Un(c, Fe.InCBLinker | Fe.InCBExtend) &&
            Un(d, Fe.InCBConsonant) &&
            (l ? (p = dv(u.substring(0, h))) : (p = dv(u.substring(0, u.length - h))), !p)) ||
          (c !== Fe.None && d !== Fe.None && zy(c, d)))
      )
        break;
      h += C.length;
    }
    return h || 1;
  },
  hy = /\s/,
  Dy =
    /[\u002B\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/,
  vy = /['\u2018\u2019]/,
  gy = function (u) {
    for (
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, l = 0, o = !1;
      u.length > 0;
    ) {
      var c = Mc(u, r),
        [d, h] = jc(u, c, r);
      if (my(d, h, r)) ((o = !0), (l += c));
      else if (!o) l += c;
      else break;
      u = h;
    }
    return l;
  },
  jc = (n, u, r) => {
    if (r) {
      var l = n.length - u;
      return [n.slice(l, n.length), n.slice(0, l)];
    }
    return [n.slice(0, u), n.slice(u)];
  },
  my = function n(u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    if (hy.test(u)) return !1;
    if (vy.test(u)) {
      var o = Mc(r, l),
        [c, d] = jc(r, o, l);
      if (n(c, d, l)) return !0;
    }
    return !Dy.test(u);
  },
  py = function* (u) {
    for (var r = u.length - 1, l = 0; l < u.length; l++) {
      var o = u.charAt(r - l);
      if (Ey(o.charCodeAt(0))) {
        var c = u.charAt(r - l - 1);
        if (Cy(c.charCodeAt(0))) {
          (yield c + o, l++);
          continue;
        }
      }
      yield o;
    }
  },
  Cy = (n) => n >= 55296 && n <= 56319,
  Ey = (n) => n >= 56320 && n <= 57343,
  Fe;
(function (n) {
  ((n[(n.None = 0)] = 'None'),
    (n[(n.Extend = 1)] = 'Extend'),
    (n[(n.ZWJ = 2)] = 'ZWJ'),
    (n[(n.RI = 4)] = 'RI'),
    (n[(n.Prepend = 8)] = 'Prepend'),
    (n[(n.SpacingMark = 16)] = 'SpacingMark'),
    (n[(n.L = 32)] = 'L'),
    (n[(n.V = 64)] = 'V'),
    (n[(n.T = 128)] = 'T'),
    (n[(n.LV = 256)] = 'LV'),
    (n[(n.LVT = 512)] = 'LVT'),
    (n[(n.ExtPict = 1024)] = 'ExtPict'),
    (n[(n.Any = 2048)] = 'Any'),
    (n[(n.InCBConsonant = 4096)] = 'InCBConsonant'),
    (n[(n.InCBExtend = 8192)] = 'InCBExtend'),
    (n[(n.InCBLinker = 16384)] = 'InCBLinker'));
})(Fe || (Fe = {}));
var yy =
    /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/,
  Ay =
    /^(?:[\u0600-\u0605\u06DD\u070F\u0890\u0891\u08E2\u0D4E]|\uD804[\uDCBD\uDCCD\uDDC2\uDDC3]|\uD806[\uDD3F\uDD41\uDE3A\uDE84-\uDE89]|\uD807\uDD46)$/,
  By =
    /^(?:[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BF\u09C0\u09C7\u09C8\u09CB\u09CC\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0\u0CC1\u0CC3\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0D02\u0D03\u0D3F\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D82\u0D83\u0DD0\u0DD1\u0DD8-\u0DDE\u0DF2\u0DF3\u0E33\u0EB3\u0F3E\u0F3F\u0F7F\u1031\u103B\u103C\u1056\u1057\u1084\u1715\u1734\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A6D-\u1A72\u1B04\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF7\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDDCE\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB1\uDCB2\uDCB9\uDCBB\uDCBC\uDCBE\uDCC1\uDDB0\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDD31-\uDD35\uDD37\uDD38\uDD3D\uDD40\uDD42\uDDD1-\uDDD3\uDDDC-\uDDDF\uDDE4\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF87\uDFF0\uDFF1]|\uD834[\uDD66\uDD6D])$/,
  by = /^[\u1100-\u115F\uA960-\uA97C]$/,
  Fy = /^[\u1160-\u11A7\uD7B0-\uD7C6]$/,
  Sy = /^[\u11A8-\u11FF\uD7CB-\uD7FB]$/,
  xy =
    /^[\uAC00\uAC1C\uAC38\uAC54\uAC70\uAC8C\uACA8\uACC4\uACE0\uACFC\uAD18\uAD34\uAD50\uAD6C\uAD88\uADA4\uADC0\uADDC\uADF8\uAE14\uAE30\uAE4C\uAE68\uAE84\uAEA0\uAEBC\uAED8\uAEF4\uAF10\uAF2C\uAF48\uAF64\uAF80\uAF9C\uAFB8\uAFD4\uAFF0\uB00C\uB028\uB044\uB060\uB07C\uB098\uB0B4\uB0D0\uB0EC\uB108\uB124\uB140\uB15C\uB178\uB194\uB1B0\uB1CC\uB1E8\uB204\uB220\uB23C\uB258\uB274\uB290\uB2AC\uB2C8\uB2E4\uB300\uB31C\uB338\uB354\uB370\uB38C\uB3A8\uB3C4\uB3E0\uB3FC\uB418\uB434\uB450\uB46C\uB488\uB4A4\uB4C0\uB4DC\uB4F8\uB514\uB530\uB54C\uB568\uB584\uB5A0\uB5BC\uB5D8\uB5F4\uB610\uB62C\uB648\uB664\uB680\uB69C\uB6B8\uB6D4\uB6F0\uB70C\uB728\uB744\uB760\uB77C\uB798\uB7B4\uB7D0\uB7EC\uB808\uB824\uB840\uB85C\uB878\uB894\uB8B0\uB8CC\uB8E8\uB904\uB920\uB93C\uB958\uB974\uB990\uB9AC\uB9C8\uB9E4\uBA00\uBA1C\uBA38\uBA54\uBA70\uBA8C\uBAA8\uBAC4\uBAE0\uBAFC\uBB18\uBB34\uBB50\uBB6C\uBB88\uBBA4\uBBC0\uBBDC\uBBF8\uBC14\uBC30\uBC4C\uBC68\uBC84\uBCA0\uBCBC\uBCD8\uBCF4\uBD10\uBD2C\uBD48\uBD64\uBD80\uBD9C\uBDB8\uBDD4\uBDF0\uBE0C\uBE28\uBE44\uBE60\uBE7C\uBE98\uBEB4\uBED0\uBEEC\uBF08\uBF24\uBF40\uBF5C\uBF78\uBF94\uBFB0\uBFCC\uBFE8\uC004\uC020\uC03C\uC058\uC074\uC090\uC0AC\uC0C8\uC0E4\uC100\uC11C\uC138\uC154\uC170\uC18C\uC1A8\uC1C4\uC1E0\uC1FC\uC218\uC234\uC250\uC26C\uC288\uC2A4\uC2C0\uC2DC\uC2F8\uC314\uC330\uC34C\uC368\uC384\uC3A0\uC3BC\uC3D8\uC3F4\uC410\uC42C\uC448\uC464\uC480\uC49C\uC4B8\uC4D4\uC4F0\uC50C\uC528\uC544\uC560\uC57C\uC598\uC5B4\uC5D0\uC5EC\uC608\uC624\uC640\uC65C\uC678\uC694\uC6B0\uC6CC\uC6E8\uC704\uC720\uC73C\uC758\uC774\uC790\uC7AC\uC7C8\uC7E4\uC800\uC81C\uC838\uC854\uC870\uC88C\uC8A8\uC8C4\uC8E0\uC8FC\uC918\uC934\uC950\uC96C\uC988\uC9A4\uC9C0\uC9DC\uC9F8\uCA14\uCA30\uCA4C\uCA68\uCA84\uCAA0\uCABC\uCAD8\uCAF4\uCB10\uCB2C\uCB48\uCB64\uCB80\uCB9C\uCBB8\uCBD4\uCBF0\uCC0C\uCC28\uCC44\uCC60\uCC7C\uCC98\uCCB4\uCCD0\uCCEC\uCD08\uCD24\uCD40\uCD5C\uCD78\uCD94\uCDB0\uCDCC\uCDE8\uCE04\uCE20\uCE3C\uCE58\uCE74\uCE90\uCEAC\uCEC8\uCEE4\uCF00\uCF1C\uCF38\uCF54\uCF70\uCF8C\uCFA8\uCFC4\uCFE0\uCFFC\uD018\uD034\uD050\uD06C\uD088\uD0A4\uD0C0\uD0DC\uD0F8\uD114\uD130\uD14C\uD168\uD184\uD1A0\uD1BC\uD1D8\uD1F4\uD210\uD22C\uD248\uD264\uD280\uD29C\uD2B8\uD2D4\uD2F0\uD30C\uD328\uD344\uD360\uD37C\uD398\uD3B4\uD3D0\uD3EC\uD408\uD424\uD440\uD45C\uD478\uD494\uD4B0\uD4CC\uD4E8\uD504\uD520\uD53C\uD558\uD574\uD590\uD5AC\uD5C8\uD5E4\uD600\uD61C\uD638\uD654\uD670\uD68C\uD6A8\uD6C4\uD6E0\uD6FC\uD718\uD734\uD750\uD76C\uD788]$/,
  Oy =
    /^[\uAC01-\uAC1B\uAC1D-\uAC37\uAC39-\uAC53\uAC55-\uAC6F\uAC71-\uAC8B\uAC8D-\uACA7\uACA9-\uACC3\uACC5-\uACDF\uACE1-\uACFB\uACFD-\uAD17\uAD19-\uAD33\uAD35-\uAD4F\uAD51-\uAD6B\uAD6D-\uAD87\uAD89-\uADA3\uADA5-\uADBF\uADC1-\uADDB\uADDD-\uADF7\uADF9-\uAE13\uAE15-\uAE2F\uAE31-\uAE4B\uAE4D-\uAE67\uAE69-\uAE83\uAE85-\uAE9F\uAEA1-\uAEBB\uAEBD-\uAED7\uAED9-\uAEF3\uAEF5-\uAF0F\uAF11-\uAF2B\uAF2D-\uAF47\uAF49-\uAF63\uAF65-\uAF7F\uAF81-\uAF9B\uAF9D-\uAFB7\uAFB9-\uAFD3\uAFD5-\uAFEF\uAFF1-\uB00B\uB00D-\uB027\uB029-\uB043\uB045-\uB05F\uB061-\uB07B\uB07D-\uB097\uB099-\uB0B3\uB0B5-\uB0CF\uB0D1-\uB0EB\uB0ED-\uB107\uB109-\uB123\uB125-\uB13F\uB141-\uB15B\uB15D-\uB177\uB179-\uB193\uB195-\uB1AF\uB1B1-\uB1CB\uB1CD-\uB1E7\uB1E9-\uB203\uB205-\uB21F\uB221-\uB23B\uB23D-\uB257\uB259-\uB273\uB275-\uB28F\uB291-\uB2AB\uB2AD-\uB2C7\uB2C9-\uB2E3\uB2E5-\uB2FF\uB301-\uB31B\uB31D-\uB337\uB339-\uB353\uB355-\uB36F\uB371-\uB38B\uB38D-\uB3A7\uB3A9-\uB3C3\uB3C5-\uB3DF\uB3E1-\uB3FB\uB3FD-\uB417\uB419-\uB433\uB435-\uB44F\uB451-\uB46B\uB46D-\uB487\uB489-\uB4A3\uB4A5-\uB4BF\uB4C1-\uB4DB\uB4DD-\uB4F7\uB4F9-\uB513\uB515-\uB52F\uB531-\uB54B\uB54D-\uB567\uB569-\uB583\uB585-\uB59F\uB5A1-\uB5BB\uB5BD-\uB5D7\uB5D9-\uB5F3\uB5F5-\uB60F\uB611-\uB62B\uB62D-\uB647\uB649-\uB663\uB665-\uB67F\uB681-\uB69B\uB69D-\uB6B7\uB6B9-\uB6D3\uB6D5-\uB6EF\uB6F1-\uB70B\uB70D-\uB727\uB729-\uB743\uB745-\uB75F\uB761-\uB77B\uB77D-\uB797\uB799-\uB7B3\uB7B5-\uB7CF\uB7D1-\uB7EB\uB7ED-\uB807\uB809-\uB823\uB825-\uB83F\uB841-\uB85B\uB85D-\uB877\uB879-\uB893\uB895-\uB8AF\uB8B1-\uB8CB\uB8CD-\uB8E7\uB8E9-\uB903\uB905-\uB91F\uB921-\uB93B\uB93D-\uB957\uB959-\uB973\uB975-\uB98F\uB991-\uB9AB\uB9AD-\uB9C7\uB9C9-\uB9E3\uB9E5-\uB9FF\uBA01-\uBA1B\uBA1D-\uBA37\uBA39-\uBA53\uBA55-\uBA6F\uBA71-\uBA8B\uBA8D-\uBAA7\uBAA9-\uBAC3\uBAC5-\uBADF\uBAE1-\uBAFB\uBAFD-\uBB17\uBB19-\uBB33\uBB35-\uBB4F\uBB51-\uBB6B\uBB6D-\uBB87\uBB89-\uBBA3\uBBA5-\uBBBF\uBBC1-\uBBDB\uBBDD-\uBBF7\uBBF9-\uBC13\uBC15-\uBC2F\uBC31-\uBC4B\uBC4D-\uBC67\uBC69-\uBC83\uBC85-\uBC9F\uBCA1-\uBCBB\uBCBD-\uBCD7\uBCD9-\uBCF3\uBCF5-\uBD0F\uBD11-\uBD2B\uBD2D-\uBD47\uBD49-\uBD63\uBD65-\uBD7F\uBD81-\uBD9B\uBD9D-\uBDB7\uBDB9-\uBDD3\uBDD5-\uBDEF\uBDF1-\uBE0B\uBE0D-\uBE27\uBE29-\uBE43\uBE45-\uBE5F\uBE61-\uBE7B\uBE7D-\uBE97\uBE99-\uBEB3\uBEB5-\uBECF\uBED1-\uBEEB\uBEED-\uBF07\uBF09-\uBF23\uBF25-\uBF3F\uBF41-\uBF5B\uBF5D-\uBF77\uBF79-\uBF93\uBF95-\uBFAF\uBFB1-\uBFCB\uBFCD-\uBFE7\uBFE9-\uC003\uC005-\uC01F\uC021-\uC03B\uC03D-\uC057\uC059-\uC073\uC075-\uC08F\uC091-\uC0AB\uC0AD-\uC0C7\uC0C9-\uC0E3\uC0E5-\uC0FF\uC101-\uC11B\uC11D-\uC137\uC139-\uC153\uC155-\uC16F\uC171-\uC18B\uC18D-\uC1A7\uC1A9-\uC1C3\uC1C5-\uC1DF\uC1E1-\uC1FB\uC1FD-\uC217\uC219-\uC233\uC235-\uC24F\uC251-\uC26B\uC26D-\uC287\uC289-\uC2A3\uC2A5-\uC2BF\uC2C1-\uC2DB\uC2DD-\uC2F7\uC2F9-\uC313\uC315-\uC32F\uC331-\uC34B\uC34D-\uC367\uC369-\uC383\uC385-\uC39F\uC3A1-\uC3BB\uC3BD-\uC3D7\uC3D9-\uC3F3\uC3F5-\uC40F\uC411-\uC42B\uC42D-\uC447\uC449-\uC463\uC465-\uC47F\uC481-\uC49B\uC49D-\uC4B7\uC4B9-\uC4D3\uC4D5-\uC4EF\uC4F1-\uC50B\uC50D-\uC527\uC529-\uC543\uC545-\uC55F\uC561-\uC57B\uC57D-\uC597\uC599-\uC5B3\uC5B5-\uC5CF\uC5D1-\uC5EB\uC5ED-\uC607\uC609-\uC623\uC625-\uC63F\uC641-\uC65B\uC65D-\uC677\uC679-\uC693\uC695-\uC6AF\uC6B1-\uC6CB\uC6CD-\uC6E7\uC6E9-\uC703\uC705-\uC71F\uC721-\uC73B\uC73D-\uC757\uC759-\uC773\uC775-\uC78F\uC791-\uC7AB\uC7AD-\uC7C7\uC7C9-\uC7E3\uC7E5-\uC7FF\uC801-\uC81B\uC81D-\uC837\uC839-\uC853\uC855-\uC86F\uC871-\uC88B\uC88D-\uC8A7\uC8A9-\uC8C3\uC8C5-\uC8DF\uC8E1-\uC8FB\uC8FD-\uC917\uC919-\uC933\uC935-\uC94F\uC951-\uC96B\uC96D-\uC987\uC989-\uC9A3\uC9A5-\uC9BF\uC9C1-\uC9DB\uC9DD-\uC9F7\uC9F9-\uCA13\uCA15-\uCA2F\uCA31-\uCA4B\uCA4D-\uCA67\uCA69-\uCA83\uCA85-\uCA9F\uCAA1-\uCABB\uCABD-\uCAD7\uCAD9-\uCAF3\uCAF5-\uCB0F\uCB11-\uCB2B\uCB2D-\uCB47\uCB49-\uCB63\uCB65-\uCB7F\uCB81-\uCB9B\uCB9D-\uCBB7\uCBB9-\uCBD3\uCBD5-\uCBEF\uCBF1-\uCC0B\uCC0D-\uCC27\uCC29-\uCC43\uCC45-\uCC5F\uCC61-\uCC7B\uCC7D-\uCC97\uCC99-\uCCB3\uCCB5-\uCCCF\uCCD1-\uCCEB\uCCED-\uCD07\uCD09-\uCD23\uCD25-\uCD3F\uCD41-\uCD5B\uCD5D-\uCD77\uCD79-\uCD93\uCD95-\uCDAF\uCDB1-\uCDCB\uCDCD-\uCDE7\uCDE9-\uCE03\uCE05-\uCE1F\uCE21-\uCE3B\uCE3D-\uCE57\uCE59-\uCE73\uCE75-\uCE8F\uCE91-\uCEAB\uCEAD-\uCEC7\uCEC9-\uCEE3\uCEE5-\uCEFF\uCF01-\uCF1B\uCF1D-\uCF37\uCF39-\uCF53\uCF55-\uCF6F\uCF71-\uCF8B\uCF8D-\uCFA7\uCFA9-\uCFC3\uCFC5-\uCFDF\uCFE1-\uCFFB\uCFFD-\uD017\uD019-\uD033\uD035-\uD04F\uD051-\uD06B\uD06D-\uD087\uD089-\uD0A3\uD0A5-\uD0BF\uD0C1-\uD0DB\uD0DD-\uD0F7\uD0F9-\uD113\uD115-\uD12F\uD131-\uD14B\uD14D-\uD167\uD169-\uD183\uD185-\uD19F\uD1A1-\uD1BB\uD1BD-\uD1D7\uD1D9-\uD1F3\uD1F5-\uD20F\uD211-\uD22B\uD22D-\uD247\uD249-\uD263\uD265-\uD27F\uD281-\uD29B\uD29D-\uD2B7\uD2B9-\uD2D3\uD2D5-\uD2EF\uD2F1-\uD30B\uD30D-\uD327\uD329-\uD343\uD345-\uD35F\uD361-\uD37B\uD37D-\uD397\uD399-\uD3B3\uD3B5-\uD3CF\uD3D1-\uD3EB\uD3ED-\uD407\uD409-\uD423\uD425-\uD43F\uD441-\uD45B\uD45D-\uD477\uD479-\uD493\uD495-\uD4AF\uD4B1-\uD4CB\uD4CD-\uD4E7\uD4E9-\uD503\uD505-\uD51F\uD521-\uD53B\uD53D-\uD557\uD559-\uD573\uD575-\uD58F\uD591-\uD5AB\uD5AD-\uD5C7\uD5C9-\uD5E3\uD5E5-\uD5FF\uD601-\uD61B\uD61D-\uD637\uD639-\uD653\uD655-\uD66F\uD671-\uD68B\uD68D-\uD6A7\uD6A9-\uD6C3\uD6C5-\uD6DF\uD6E1-\uD6FB\uD6FD-\uD717\uD719-\uD733\uD735-\uD74F\uD751-\uD76B\uD76D-\uD787\uD789-\uD7A3]$/,
  wy =
    /^(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])$/,
  Ty =
    /^(?:[\u0915-\u0939\u0958-\u095F\u0978-\u097F\u0995-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF\u09F0\u09F1\u0A95-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0AF9\u0B15-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B5C\u0B5D\u0B5F\u0B71\u0C15-\u0C28\u0C2A-\u0C39\u0C58-\u0C5A\u0D15-\u0D3A\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1780-\u17B3\u1A20-\u1A54\u1B0B\u1B0C\u1B13-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBB-\u1BBD\uA989-\uA98B\uA98F-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA60-\uAA6F\uAA71-\uAA73\uAA7A\uAA7E\uAA7F\uAAE0-\uAAEA\uABC0-\uABDA]|\uD802[\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35]|\uD804[\uDD03-\uDD26\uDD44\uDD47\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5]|\uD806[\uDD00-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDE00\uDE0B-\uDE32\uDE50\uDE5C-\uDE83]|\uD807[\uDF04-\uDF10\uDF12-\uDF33])$/,
  Ry =
    /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC0\u0CC2\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D1\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B03\u1B34-\u1B3D\u1B42\u1B43\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8-\u1BAA\u1BAC\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF3\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200D\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA953\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD69-\uDD6D\uDEAB\uDEAC\uDEFA-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD32\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC0\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34-\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF4D\uDF57\uDF66-\uDF6C\uDF70-\uDF74\uDFB8\uDFBB-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFC9\uDFCE\uDFCF\uDFD2\uDFE1\uDFE2]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB7\uDF1D\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B-\uDD3D\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDF60\uDF62-\uDF64\uDF66]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF41\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD29\uDD2D-\uDD2F]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF\uDDEE\uDDEF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/,
  My =
    /^(?:[\u094D\u09CD\u0ACD\u0B4D\u0C4D\u0D4D\u1039\u17D2\u1A60\u1B44\u1BAB\uA9C0\uAAF6]|\uD802\uDE3F|\uD804[\uDD33\uDFD0]|\uD806[\uDD3E\uDE47\uDE99]|\uD807\uDF42)$/,
  jy = (n, u) => {
    var r = Fe.Any;
    return (
      n.search(yy) !== -1 && (r |= Fe.Extend),
      u === 8205 && (r |= Fe.ZWJ),
      u >= 127462 && u <= 127487 && (r |= Fe.RI),
      n.search(Ay) !== -1 && (r |= Fe.Prepend),
      n.search(By) !== -1 && (r |= Fe.SpacingMark),
      n.search(by) !== -1 && (r |= Fe.L),
      n.search(Fy) !== -1 && (r |= Fe.V),
      n.search(Sy) !== -1 && (r |= Fe.T),
      n.search(xy) !== -1 && (r |= Fe.LV),
      n.search(Oy) !== -1 && (r |= Fe.LVT),
      n.search(wy) !== -1 && (r |= Fe.ExtPict),
      n.search(Ty) !== -1 && (r |= Fe.InCBConsonant),
      n.search(Ry) !== -1 && (r |= Fe.InCBExtend),
      n.search(My) !== -1 && (r |= Fe.InCBLinker),
      r
    );
  };
function Un(n, u) {
  return (n & u) !== 0;
}
var Ny = [
  [Fe.L, Fe.L | Fe.V | Fe.LV | Fe.LVT],
  [Fe.LV | Fe.V, Fe.V | Fe.T],
  [Fe.LVT | Fe.T, Fe.T],
  [Fe.Any, Fe.Extend | Fe.ZWJ],
  [Fe.Any, Fe.SpacingMark],
  [Fe.Prepend, Fe.Any],
  [Fe.InCBLinker | Fe.InCBExtend, Fe.InCBConsonant],
  [Fe.ZWJ, Fe.ExtPict],
  [Fe.RI, Fe.RI],
];
function zy(n, u) {
  return Ny.findIndex((r) => Un(n, r[0]) && Un(u, r[1])) === -1;
}
var Ly =
    /(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])*\u200D$/,
  cv = (n) => n.search(Ly) !== -1,
  Hy =
    /(?:[\u0915-\u0939\u0958-\u095F\u0978-\u097F\u0995-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF\u09F0\u09F1\u0A95-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0AF9\u0B15-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B5C\u0B5D\u0B5F\u0B71\u0C15-\u0C28\u0C2A-\u0C39\u0C58-\u0C5A\u0D15-\u0D3A\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1780-\u17B3\u1A20-\u1A54\u1B0B\u1B0C\u1B13-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBB-\u1BBD\uA989-\uA98B\uA98F-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA60-\uAA6F\uAA71-\uAA73\uAA7A\uAA7E\uAA7F\uAAE0-\uAAEA\uABC0-\uABDA]|\uD802[\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35]|\uD804[\uDD03-\uDD26\uDD44\uDD47\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5]|\uD806[\uDD00-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDE00\uDE0B-\uDE32\uDE50\uDE5C-\uDE83]|\uD807[\uDF04-\uDF10\uDF12-\uDF33])(?:(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC0\u0CC2\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B03\u1B34-\u1B3D\u1B42-\u1B44\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF3\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200D\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA953\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9C0\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD69-\uDD6D\uDEAB\uDEAC\uDEFA-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC0\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34-\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF4D\uDF57\uDF66-\uDF6C\uDF70-\uDF74\uDFB8\uDFBB-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFC9\uDFCE-\uDFD0\uDFD2\uDFE1\uDFE2]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB7\uDF1D\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B-\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99\uDF60\uDF62-\uDF64\uDF66]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40-\uDF42\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD29\uDD2D-\uDD2F]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF\uDDEE\uDDEF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF]))*(?:[\u094D\u09CD\u0ACD\u0B4D\u0C4D\u0D4D\u1039\u17D2\u1A60\u1B44\u1BAB\uA9C0\uAAF6]|\uD802\uDE3F|\uD804[\uDD33\uDFD0]|\uD806[\uDD3E\uDE47\uDE99]|\uD807\uDF42)(?:(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC0\u0CC2\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B03\u1B34-\u1B3D\u1B42-\u1B44\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF3\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200D\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA953\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9C0\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD69-\uDD6D\uDEAB\uDEAC\uDEFA-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC0\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34-\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF4D\uDF57\uDF66-\uDF6C\uDF70-\uDF74\uDFB8\uDFBB-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFC9\uDFCE-\uDFD0\uDFD2\uDFE1\uDFE2]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB7\uDF1D\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B-\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99\uDF60\uDF62-\uDF64\uDF66]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40-\uDF42\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD29\uDD2D-\uDD2F]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF\uDDEE\uDDEF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF]))*$/,
  dv = (n) => n.search(Hy) !== -1,
  Uy = /(?:\uD83C[\uDDE6-\uDDFF])+$/g,
  ky = (n) => {
    var u = n.match(Uy);
    if (u === null) return !1;
    var r = u[0].length / 2;
    return r % 2 === 1;
  },
  qy = function (u) {
    var { deep: r = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!Ht(u)) return !1;
    var l =
      typeof u.above == 'function' &&
      typeof u.addMark == 'function' &&
      typeof u.after == 'function' &&
      typeof u.apply == 'function' &&
      typeof u.before == 'function' &&
      typeof u.collapse == 'function' &&
      typeof u.delete == 'function' &&
      typeof u.deleteBackward == 'function' &&
      typeof u.deleteForward == 'function' &&
      typeof u.deleteFragment == 'function' &&
      typeof u.deselect == 'function' &&
      typeof u.edges == 'function' &&
      typeof u.elementReadOnly == 'function' &&
      typeof u.end == 'function' &&
      typeof u.first == 'function' &&
      typeof u.fragment == 'function' &&
      typeof u.getDirtyPaths == 'function' &&
      typeof u.getFragment == 'function' &&
      typeof u.getMarks == 'function' &&
      typeof u.hasBlocks == 'function' &&
      typeof u.hasInlines == 'function' &&
      typeof u.hasPath == 'function' &&
      typeof u.hasTexts == 'function' &&
      typeof u.insertBreak == 'function' &&
      typeof u.insertFragment == 'function' &&
      typeof u.insertNode == 'function' &&
      typeof u.insertNodes == 'function' &&
      typeof u.insertSoftBreak == 'function' &&
      typeof u.insertText == 'function' &&
      typeof u.isBlock == 'function' &&
      typeof u.isEdge == 'function' &&
      typeof u.isElementReadOnly == 'function' &&
      typeof u.isEmpty == 'function' &&
      typeof u.isEnd == 'function' &&
      typeof u.isInline == 'function' &&
      typeof u.isNormalizing == 'function' &&
      typeof u.isSelectable == 'function' &&
      typeof u.isStart == 'function' &&
      typeof u.isVoid == 'function' &&
      typeof u.last == 'function' &&
      typeof u.leaf == 'function' &&
      typeof u.levels == 'function' &&
      typeof u.liftNodes == 'function' &&
      typeof u.markableVoid == 'function' &&
      typeof u.mergeNodes == 'function' &&
      typeof u.move == 'function' &&
      typeof u.moveNodes == 'function' &&
      typeof u.next == 'function' &&
      typeof u.node == 'function' &&
      typeof u.nodes == 'function' &&
      typeof u.normalize == 'function' &&
      typeof u.normalizeNode == 'function' &&
      typeof u.onChange == 'function' &&
      typeof u.parent == 'function' &&
      typeof u.path == 'function' &&
      typeof u.pathRef == 'function' &&
      typeof u.pathRefs == 'function' &&
      typeof u.point == 'function' &&
      typeof u.pointRef == 'function' &&
      typeof u.pointRefs == 'function' &&
      typeof u.positions == 'function' &&
      typeof u.previous == 'function' &&
      typeof u.range == 'function' &&
      typeof u.rangeRef == 'function' &&
      typeof u.rangeRefs == 'function' &&
      typeof u.removeMark == 'function' &&
      typeof u.removeNodes == 'function' &&
      typeof u.select == 'function' &&
      typeof u.setNodes == 'function' &&
      typeof u.setNormalizing == 'function' &&
      typeof u.setPoint == 'function' &&
      typeof u.setSelection == 'function' &&
      typeof u.shouldMergeNodesRemovePrevNode == 'function' &&
      typeof u.shouldNormalize == 'function' &&
      typeof u.splitNodes == 'function' &&
      typeof u.start == 'function' &&
      typeof u.string == 'function' &&
      typeof u.unhangRange == 'function' &&
      typeof u.unsetNodes == 'function' &&
      typeof u.unwrapNodes == 'function' &&
      typeof u.void == 'function' &&
      typeof u.withoutNormalizing == 'function' &&
      typeof u.wrapNodes == 'function' &&
      (u.marks === null || Ht(u.marks)) &&
      (u.selection === null || ee.isRange(u.selection)) &&
      (r
        ? j.isNodeList(u.children) && qn.isOperationList(u.operations)
        : Array.isArray(u.children) && Array.isArray(u.operations));
    return l;
  },
  E = {
    above(n, u) {
      return n.above(u);
    },
    addMark(n, u, r) {
      n.addMark(u, r);
    },
    after(n, u, r) {
      return n.after(u, r);
    },
    before(n, u, r) {
      return n.before(u, r);
    },
    deleteBackward(n) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        { unit: r = 'character' } = u;
      n.deleteBackward(r);
    },
    deleteForward(n) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        { unit: r = 'character' } = u;
      n.deleteForward(r);
    },
    deleteFragment(n, u) {
      n.deleteFragment(u);
    },
    edges(n, u) {
      return n.edges(u);
    },
    elementReadOnly(n) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return n.elementReadOnly(u);
    },
    end(n, u) {
      return n.end(u);
    },
    first(n, u) {
      return n.first(u);
    },
    fragment(n, u) {
      return n.fragment(u);
    },
    hasBlocks(n, u) {
      return n.hasBlocks(u);
    },
    hasInlines(n, u) {
      return n.hasInlines(u);
    },
    hasPath(n, u) {
      return n.hasPath(u);
    },
    hasTexts(n, u) {
      return n.hasTexts(u);
    },
    insertBreak(n) {
      n.insertBreak();
    },
    insertFragment(n, u, r) {
      n.insertFragment(u, r);
    },
    insertNode(n, u) {
      n.insertNode(u);
    },
    insertSoftBreak(n) {
      n.insertSoftBreak();
    },
    insertText(n, u) {
      n.insertText(u);
    },
    isBlock(n, u) {
      return n.isBlock(u);
    },
    isEdge(n, u, r) {
      return n.isEdge(u, r);
    },
    isEditor: qy,
    isElementReadOnly(n, u) {
      return n.isElementReadOnly(u);
    },
    isEmpty(n, u) {
      return n.isEmpty(u);
    },
    isEnd(n, u, r) {
      return n.isEnd(u, r);
    },
    isInline(n, u) {
      return n.isInline(u);
    },
    isNormalizing(n) {
      return n.isNormalizing();
    },
    isSelectable(n, u) {
      return n.isSelectable(u);
    },
    isStart(n, u, r) {
      return n.isStart(u, r);
    },
    isVoid(n, u) {
      return n.isVoid(u);
    },
    last(n, u) {
      return n.last(u);
    },
    leaf(n, u, r) {
      return n.leaf(u, r);
    },
    levels(n, u) {
      return n.levels(u);
    },
    marks(n) {
      return n.getMarks();
    },
    next(n, u) {
      return n.next(u);
    },
    node(n, u, r) {
      return n.node(u, r);
    },
    nodes(n, u) {
      return n.nodes(u);
    },
    normalize(n, u) {
      n.normalize(u);
    },
    parent(n, u, r) {
      return n.parent(u, r);
    },
    path(n, u, r) {
      return n.path(u, r);
    },
    pathRef(n, u, r) {
      return n.pathRef(u, r);
    },
    pathRefs(n) {
      return n.pathRefs();
    },
    point(n, u, r) {
      return n.point(u, r);
    },
    pointRef(n, u, r) {
      return n.pointRef(u, r);
    },
    pointRefs(n) {
      return n.pointRefs();
    },
    positions(n, u) {
      return n.positions(u);
    },
    previous(n, u) {
      return n.previous(u);
    },
    range(n, u, r) {
      return n.range(u, r);
    },
    rangeRef(n, u, r) {
      return n.rangeRef(u, r);
    },
    rangeRefs(n) {
      return n.rangeRefs();
    },
    removeMark(n, u) {
      n.removeMark(u);
    },
    setNormalizing(n, u) {
      n.setNormalizing(u);
    },
    start(n, u) {
      return n.start(u);
    },
    string(n, u, r) {
      return n.string(u, r);
    },
    unhangRange(n, u, r) {
      return n.unhangRange(u, r);
    },
    void(n, u) {
      return n.void(u);
    },
    withoutNormalizing(n, u) {
      n.withoutNormalizing(u);
    },
    shouldMergeNodesRemovePrevNode: (n, u, r) => n.shouldMergeNodesRemovePrevNode(u, r),
  },
  Re = {
    isLocation(n) {
      return T.isPath(n) || Ke.isPoint(n) || ee.isRange(n);
    },
    isPath(n) {
      return Array.isArray(n);
    },
    isPoint(n) {
      return 'offset' in n;
    },
    isRange(n) {
      return 'anchor' in n;
    },
    isSpan(n) {
      return Array.isArray(n) && Array.isArray(n[0]);
    },
  };
function hv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Dv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? hv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : hv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Ke = {
    compare(n, u) {
      var r = T.compare(n.path, u.path);
      return r === 0 ? (n.offset < u.offset ? -1 : n.offset > u.offset ? 1 : 0) : r;
    },
    isAfter(n, u) {
      return Ke.compare(n, u) === 1;
    },
    isBefore(n, u) {
      return Ke.compare(n, u) === -1;
    },
    equals(n, u) {
      return n.offset === u.offset && T.equals(n.path, u.path);
    },
    isPoint(n) {
      return Ht(n) && typeof n.offset == 'number' && T.isPath(n.path);
    },
    transform(n, u) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n === null) return null;
      var { affinity: l = 'forward' } = r,
        { path: o, offset: c } = n;
      switch (u.type) {
        case 'insert_node':
        case 'move_node': {
          o = T.transform(o, u, r);
          break;
        }
        case 'insert_text': {
          T.equals(u.path, o) &&
            (u.offset < c || (u.offset === c && l === 'forward')) &&
            (c += u.text.length);
          break;
        }
        case 'merge_node': {
          (T.equals(u.path, o) && (c += u.position), (o = T.transform(o, u, r)));
          break;
        }
        case 'remove_text': {
          T.equals(u.path, o) && u.offset <= c && (c -= Math.min(c - u.offset, u.text.length));
          break;
        }
        case 'remove_node': {
          if (T.equals(u.path, o) || T.isAncestor(u.path, o)) return null;
          o = T.transform(o, u, r);
          break;
        }
        case 'split_node': {
          if (T.equals(u.path, o)) {
            if (u.position === c && l == null) return null;
            (u.position < c || (u.position === c && l === 'forward')) &&
              ((c -= u.position),
              (o = T.transform(o, u, Dv(Dv({}, r), {}, { affinity: 'forward' }))));
          } else o = T.transform(o, u, r);
          break;
        }
        default:
          return n;
      }
      return { path: o, offset: c };
    },
  },
  vv = void 0,
  Bt = {
    setScrubber(n) {
      vv = n;
    },
    stringify(n) {
      return JSON.stringify(n, vv);
    },
  },
  _y = ['text'],
  Gy = ['anchor', 'focus', 'merge'];
function gv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function en(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? gv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : gv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var nn = {
  equals(n, u) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { loose: l = !1 } = r;
    function o(c) {
      var { text: d } = c,
        h = rn(c, _y);
      return h;
    }
    return om(l ? o(n) : n, l ? o(u) : u);
  },
  isText(n) {
    return Ht(n) && typeof n.text == 'string';
  },
  isTextList(n) {
    return Array.isArray(n) && n.every((u) => nn.isText(u));
  },
  isTextProps(n) {
    return n.text !== void 0;
  },
  matches(n, u) {
    for (var r in u) if (r !== 'text' && (!n.hasOwnProperty(r) || n[r] !== u[r])) return !1;
    return !0;
  },
  decorations(n, u) {
    var r = [{ leaf: en({}, n) }];
    for (var l of u) {
      var { anchor: o, focus: c, merge: d } = l,
        h = rn(l, Gy),
        [v, D] = ee.edges(l),
        p = [],
        C = 0,
        A = v.offset,
        B = D.offset,
        S = d ?? Object.assign;
      for (var { leaf: w } of r) {
        var { length: N } = w.text,
          b = C;
        if (((C += N), A <= b && C <= B)) {
          (S(w, h), p.push({ leaf: w }));
          continue;
        }
        if ((A !== B && (A === C || B === b)) || A > C || B < b || (B === b && b !== 0)) {
          p.push({ leaf: w });
          continue;
        }
        var m = w,
          M = void 0,
          _ = void 0;
        if (B < C) {
          var K = B - b;
          ((_ = { leaf: en(en({}, m), {}, { text: m.text.slice(K) }) }),
            (m = en(en({}, m), {}, { text: m.text.slice(0, K) })));
        }
        if (A > b) {
          var ue = A - b;
          ((M = { leaf: en(en({}, m), {}, { text: m.text.slice(0, ue) }) }),
            (m = en(en({}, m), {}, { text: m.text.slice(ue) })));
        }
        (S(m, h), M && p.push(M), p.push({ leaf: m }), _ && p.push(_));
      }
      r = p;
    }
    if (r.length > 1) {
      var X = 0;
      for (var [ie, se] of r.entries()) {
        var he = X,
          de = he + se.leaf.text.length,
          W = { start: he, end: de };
        (ie === 0 && (W.isFirst = !0),
          ie === r.length - 1 && (W.isLast = !0),
          (se.position = W),
          (X = de));
      }
    }
    return r;
  },
};
function mv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function oo(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? mv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : mv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var pv = function (u, r) {
    for (var l = arguments.length, o = new Array(l > 2 ? l - 2 : 0), c = 2; c < l; c++)
      o[c - 2] = arguments[c];
    return [...u.slice(0, r), ...o, ...u.slice(r)];
  },
  Dl = function (u, r, l) {
    for (var o = arguments.length, c = new Array(o > 3 ? o - 3 : 0), d = 3; d < o; d++)
      c[d - 3] = arguments[d];
    return [...u.slice(0, r), ...c, ...u.slice(r + l)];
  },
  cc = Dl,
  Nc = (n, u, r) => {
    if (u.length === 0) throw new Error('Cannot modify the editor');
    for (var l = j.get(n, u), o = u.slice(), c = r(l); o.length > 1;) {
      var d = o.pop(),
        h = j.get(n, o);
      c = oo(oo({}, h), {}, { children: Dl(h.children, d, 1, c) });
    }
    var v = o.pop();
    n.children = Dl(n.children, v, 1, c);
  },
  oa = (n, u, r) => {
    u.length === 0
      ? (n.children = r(n.children))
      : Nc(n, u, (l) => {
          if (j.isText(l))
            throw new Error(
              'Cannot get the element at path ['
                .concat(u, '] because it refers to a leaf node: ')
                .concat(Bt.stringify(l)),
            );
          return oo(oo({}, l), {}, { children: r(l.children) });
        });
  },
  so = (n, u, r) =>
    Nc(n, u, (l) => {
      if (!j.isText(l))
        throw new Error(
          'Cannot get the leaf node at path ['
            .concat(u, '] because it refers to a non-leaf node: ')
            .concat(Bt.stringify(l)),
        );
      return r(l);
    });
function Cv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function jt(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Cv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Cv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var dc = ['children', 'text', ...Object.getOwnPropertyNames(Object.prototype)],
  sm = Object.getOwnPropertyNames(Object.prototype),
  Yy = {
    transform(n, u) {
      var r = !1;
      switch (u.type) {
        case 'insert_node': {
          var { path: l, node: o } = u;
          (oa(n, T.parent(l), (z) => {
            var oe = l[l.length - 1];
            if (oe > z.length)
              throw new Error(
                'Cannot apply an "insert_node" operation at path ['.concat(
                  l,
                  '] because the destination is past the end of the node.',
                ),
              );
            return pv(z, oe, o);
          }),
            (r = !0));
          break;
        }
        case 'insert_text': {
          var { path: c, offset: d, text: h } = u;
          if (h.length === 0) break;
          (so(n, c, (z) => {
            var oe = z.text.slice(0, d),
              re = z.text.slice(d);
            return jt(jt({}, z), {}, { text: oe + h + re });
          }),
            (r = !0));
          break;
        }
        case 'merge_node': {
          var { path: v } = u,
            D = v[v.length - 1],
            p = T.previous(v),
            C = p[p.length - 1];
          if (v.length === 0)
            throw new Error(
              'Cannot apply a "merge_node" operation at path ['.concat(
                v,
                '] because the root node cannot be merged.',
              ),
            );
          if (typeof D != 'number' || typeof C != 'number') throw new Error('Index must be number');
          (oa(n, T.parent(v), (z) => {
            var oe = z[D],
              re = z[C],
              fe;
            if (j.isText(oe) && j.isText(re)) fe = jt(jt({}, re), {}, { text: re.text + oe.text });
            else if (j.isElement(oe) && j.isElement(re))
              fe = jt(jt({}, re), {}, { children: re.children.concat(oe.children) });
            else
              throw new Error(
                'Cannot apply a "merge_node" operation at path ['
                  .concat(v, '] to nodes of different interfaces: ')
                  .concat(Bt.stringify(oe), ' ')
                  .concat(Bt.stringify(re)),
              );
            return Dl(z, C, 2, fe);
          }),
            (r = !0));
          break;
        }
        case 'move_node': {
          var { path: A, newPath: B } = u,
            S = A[A.length - 1];
          if (T.isAncestor(A, B))
            throw new Error(
              'Cannot move a path ['
                .concat(A, '] to new path [')
                .concat(B, '] because the destination is inside itself.'),
            );
          var w = j.get(n, A);
          oa(n, T.parent(A), (z) => cc(z, S, 1));
          var N = T.transform(A, u),
            b = N[N.length - 1];
          (oa(n, T.parent(N), (z) => pv(z, b, w)), (r = !0));
          break;
        }
        case 'remove_node': {
          var { path: m } = u,
            M = m[m.length - 1];
          if ((oa(n, T.parent(m), (z) => cc(z, M, 1)), n.selection)) {
            var _ = jt({}, n.selection);
            for (var [K, ue] of ee.points(_)) {
              var X = Ke.transform(K, u);
              if (_ != null && X != null) _[ue] = X;
              else {
                var ie = void 0,
                  se = void 0;
                for (var [he, de] of j.texts(n))
                  if (T.compare(de, m) === -1) ie = [he, de];
                  else {
                    se = [he, de];
                    break;
                  }
                var W = !1;
                (ie &&
                  se &&
                  (T.isSibling(ie[1], m)
                    ? (W = !1)
                    : T.equals(se[1], m)
                      ? (W = !0)
                      : (W = T.common(ie[1], m).length < T.common(se[1], m).length)),
                  ie && !W
                    ? (_[ue] = { path: ie[1], offset: ie[0].text.length })
                    : se
                      ? (_[ue] = { path: se[1], offset: 0 })
                      : (_ = null));
              }
            }
            (!_ || !ee.equals(_, n.selection)) && (n.selection = _);
          }
          break;
        }
        case 'remove_text': {
          var { path: Q, offset: ae, text: ne } = u;
          if (ne.length === 0) break;
          (so(n, Q, (z) => {
            var oe = z.text.slice(0, ae),
              re = z.text.slice(ae + ne.length);
            return jt(jt({}, z), {}, { text: oe + re });
          }),
            (r = !0));
          break;
        }
        case 'set_node': {
          var { path: L, properties: V, newProperties: De } = u;
          if (L.length === 0) throw new Error('Cannot set properties on the root node!');
          Nc(n, L, (z) => {
            var oe = jt({}, z);
            for (var re in De) {
              if (dc.includes(re))
                throw new Error('Cannot set the "'.concat(re, '" property of nodes!'));
              var fe = De[re];
              if (re === 'then' && typeof fe == 'function')
                throw new Error('Cannot set the "then" property of a node to a function');
              fe == null ? delete oe[re] : (oe[re] = fe);
            }
            for (var Ee in V) Object.hasOwn(De, Ee) || delete oe[Ee];
            return oe;
          });
          break;
        }
        case 'set_selection': {
          var { newProperties: ve } = u;
          if (ve == null) {
            n.selection = null;
            break;
          }
          if (n.selection == null) {
            if (!(ve.anchor && ve.focus))
              throw new Error(
                'Cannot apply an incomplete "set_selection" operation properties '.concat(
                  Bt.stringify(ve),
                  ' when there is no current selection.',
                ),
              );
            n.selection = jt({}, ve);
            break;
          }
          var pe = jt({}, n.selection);
          for (var x in ve) {
            if (sm.includes(x))
              throw new Error('Cannot set the "'.concat(x, '" property of the selection!'));
            var Y = ve[x];
            if (x === 'then' && typeof Y == 'function')
              throw new Error('Cannot set the "then" property of the selection to a function');
            if (Y == null) {
              if (x === 'anchor' || x === 'focus')
                throw new Error('Cannot remove the "'.concat(x, '" selection property'));
              delete pe[x];
            } else pe[x] = Y;
          }
          n.selection = pe;
          break;
        }
        case 'split_node': {
          var { path: Z, position: J, properties: ge } = u,
            Ae = Z[Z.length - 1];
          if (Z.length === 0)
            throw new Error(
              'Cannot apply a "split_node" operation at path ['.concat(
                Z,
                '] because the root node cannot be split.',
              ),
            );
          if (typeof Ae != 'number') throw new Error('Index must be number');
          (oa(n, T.parent(Z), (z) => {
            var oe = z[Ae],
              re,
              fe;
            if (j.isText(oe)) {
              var Ee = oe.text.slice(0, J),
                be = oe.text.slice(J);
              ((re = jt(jt({}, oe), {}, { text: Ee })), (fe = { text: be }));
            } else {
              var $e = oe.children.slice(0, J),
                ut = oe.children.slice(J);
              ((re = jt(jt({}, oe), {}, { children: $e })), (fe = { children: ut }));
            }
            for (var _e in ge) {
              if (dc.includes(_e))
                throw new Error('Cannot set the "'.concat(_e, '" property of nodes!'));
              var ze = ge[_e];
              if (_e === 'then' && typeof ze == 'function')
                throw new Error('Cannot set the "then" property of a node to a function');
              ze != null && (fe[_e] = ze);
            }
            return Dl(z, Ae, 1, re, fe);
          }),
            (r = !0));
          break;
        }
      }
      if (r && n.selection) {
        var Oe = jt({}, n.selection);
        for (var [Xe, Ne] of ee.points(Oe)) Oe[Ne] = Ke.transform(Xe, u);
        ee.equals(Oe, n.selection) || (n.selection = Oe);
      }
    },
  },
  Vy = {
    insertNodes(n, u, r) {
      n.insertNodes(u, r);
    },
    liftNodes(n, u) {
      n.liftNodes(u);
    },
    mergeNodes(n, u) {
      n.mergeNodes(u);
    },
    moveNodes(n, u) {
      n.moveNodes(u);
    },
    removeNodes(n, u) {
      n.removeNodes(u);
    },
    setNodes(n, u, r) {
      n.setNodes(u, r);
    },
    splitNodes(n, u) {
      n.splitNodes(u);
    },
    unsetNodes(n, u, r) {
      n.unsetNodes(u, r);
    },
    unwrapNodes(n, u) {
      n.unwrapNodes(u);
    },
    wrapNodes(n, u, r) {
      n.wrapNodes(u, r);
    },
  },
  Py = {
    collapse(n, u) {
      n.collapse(u);
    },
    deselect(n) {
      n.deselect();
    },
    move(n, u) {
      n.move(u);
    },
    select(n, u) {
      n.select(u);
    },
    setPoint(n, u, r) {
      n.setPoint(u, r);
    },
    setSelection(n, u) {
      n.setSelection(u);
    },
  },
  Ky = {
    delete(n, u) {
      n.delete(u);
    },
    insertFragment(n, u, r) {
      n.insertFragment(u, r);
    },
    insertText(n, u) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      E.withoutNormalizing(n, () => {
        var { voids: l = !1 } = r,
          { at: o = Rc(n) } = r;
        if ((Re.isPath(o) && (o = E.range(n, o)), Re.isRange(o)))
          if (ee.isCollapsed(o)) o = o.anchor;
          else {
            var c = ee.end(o);
            if (!l && E.void(n, { at: c })) return;
            var d = ee.start(o),
              h = E.pointRef(n, d),
              v = E.pointRef(n, c);
            le.delete(n, { at: o, voids: l });
            var D = h.unref(),
              p = v.unref();
            ((o = D || p), le.setSelection(n, { anchor: o, focus: o }));
          }
        if (!((!l && E.void(n, { at: o })) || E.elementReadOnly(n, { at: o }))) {
          var { path: C, offset: A } = o;
          u.length > 0 && n.apply({ type: 'insert_text', path: C, offset: A, text: u });
        }
      });
    },
  };
function Ev(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Vi(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Ev(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Ev(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var le = Vi(Vi(Vi(Vi({}, Yy), Vy), Py), Ky),
  to = new WeakMap(),
  Xy = (n) => to.get(n) || !1,
  Qy = (n, u, r) => {
    var l = to.get(n) || !1;
    to.set(n, !0);
    try {
      (u(), r());
    } finally {
      to.set(n, l);
    }
  };
function fm(n, u, r) {
  var l = lo.get(n) || [],
    o = io.get(n) || new Set(),
    c,
    d,
    h = (C) => {
      if (C) {
        var A = C.join(',');
        d.has(A) || (d.add(A), c.push(C));
      }
    };
  if (r) {
    ((c = []), (d = new Set()));
    for (var v of l) {
      var D = r(v);
      h(D);
    }
  } else ((c = l), (d = o));
  for (var p of u) h(p);
  (lo.set(n, c), io.set(n, d));
}
var Zy = (n, u) => {
    for (var r of E.pathRefs(n)) ny.transform(r, u);
    for (var l of E.pointRefs(n)) ay.transform(l, u);
    for (var o of E.rangeRefs(n)) ry.transform(o, u);
    if (!Xy(n)) {
      var c = T.operationCanTransformPath(u) ? (d) => T.transform(d, u) : void 0;
      fm(n, n.getDirtyPaths(u), c);
    }
    (le.transform(n, u),
      n.operations.push(u),
      E.normalize(n, { operation: u }),
      u.type === 'set_selection' && (n.marks = null),
      ll.get(n) ||
        (ll.set(n, !0),
        Promise.resolve().then(() => {
          (ll.set(n, !1), n.onChange({ operation: u }), (n.operations = []));
        })));
  },
  $y = (n, u) => {
    switch (u.type) {
      case 'insert_text':
      case 'remove_text':
      case 'set_node': {
        var { path: r } = u;
        return T.levels(r);
      }
      case 'insert_node': {
        var { node: l, path: o } = u,
          c = T.levels(o),
          d = j.isText(l)
            ? []
            : Array.from(j.nodes(l), (he) => {
                var [, de] = he;
                return o.concat(de);
              });
        return [...c, ...d];
      }
      case 'merge_node': {
        var { path: h } = u,
          v = T.ancestors(h),
          D = T.previous(h);
        return [...v, D];
      }
      case 'move_node': {
        var { path: p, newPath: C } = u;
        if (T.equals(p, C)) return [];
        var A = [],
          B = [];
        for (var S of T.ancestors(p)) {
          var w = T.transform(S, u);
          A.push(w);
        }
        for (var N of T.ancestors(C)) {
          var b = T.transform(N, u);
          B.push(b);
        }
        var m = B[B.length - 1],
          M = C[C.length - 1],
          _ = m.concat(M);
        return [...A, ...B, _];
      }
      case 'remove_node': {
        var { path: K } = u,
          ue = T.ancestors(K);
        return [...ue];
      }
      case 'split_node': {
        var { path: X } = u,
          ie = T.levels(X),
          se = T.next(X);
        return [...ie, se];
      }
      default:
        return [];
    }
  },
  Wy = (n) => {
    var { selection: u } = n;
    return u ? j.fragment(n, u) : [];
  },
  Jy = (n, u, r) => {
    var [l, o] = u;
    if (!j.isText(l)) {
      'children' in l || (l.children = []);
      var c = l;
      if (c !== n && c.children.length === 0) {
        var d = { text: '' };
        (le.insertNodes(n, d, { at: o.concat(0), voids: !0 }), (c = j.get(n, o)));
      }
      var h = c !== n && (n.isInline(c) || j.isText(c.children[0]) || n.isInline(c.children[0]));
      if (h)
        for (var v = 0; v < c.children.length; v++) {
          var D = c.children[v],
            p = c.children[v - 1];
          if (j.isText(D))
            p != null &&
              j.isText(p) &&
              (D.text === ''
                ? (le.removeNodes(n, { at: o.concat(v), voids: !0 }), (c = j.get(n, o)), v--)
                : p.text === ''
                  ? (le.removeNodes(n, { at: o.concat(v - 1), voids: !0 }), (c = j.get(n, o)), v--)
                  : nn.equals(D, p, { loose: !0 }) &&
                    (le.mergeNodes(n, { at: o.concat(v), voids: !0 }), (c = j.get(n, o)), v--));
          else if (n.isInline(D)) {
            if (p == null || !j.isText(p)) {
              var C = { text: '' };
              (le.insertNodes(n, C, { at: o.concat(v), voids: !0 }), (c = j.get(n, o)), v++);
            }
            if (v === c.children.length - 1) {
              var A = { text: '' };
              (le.insertNodes(n, A, { at: o.concat(v + 1), voids: !0 }), (c = j.get(n, o)), v++);
            }
          } else (le.unwrapNodes(n, { at: o.concat(v), voids: !0 }), (c = j.get(n, o)), v--);
        }
      else
        for (var B = 0; B < c.children.length; B++) {
          var S = c.children[B];
          (j.isText(S) || n.isInline(S)) &&
            (r != null && r.fallbackElement
              ? le.wrapNodes(n, r.fallbackElement(), { at: o.concat(B), voids: !0 })
              : le.removeNodes(n, { at: o.concat(B), voids: !0 }),
            (c = j.get(n, o)),
            B--);
        }
    }
  },
  Iy = (n, u) => {
    var { iteration: r, initialDirtyPathsLength: l } = u,
      o = l * 42;
    if (r > o)
      throw new Error(
        'Could not completely normalize the editor after '.concat(
          o,
          ' iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.',
        ),
      );
    return !0;
  },
  eA = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { voids: l = !1, mode: o = 'lowest', at: c = u.selection, match: d } = r;
    if (c) {
      var h = E.path(u, c);
      if (!Re.isRange(c) || T.equals(c.focus.path, c.anchor.path)) {
        if (h.length === 0) return;
        h = T.parent(h);
      }
      var v = o === 'lowest',
        [D] = E.levels(u, { at: h, voids: l, match: d, reverse: v });
      return D;
    }
  };
function yv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Av(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? yv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : yv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var tA = (n, u, r) => {
  var { selection: l } = n;
  if (l) {
    var o = (C, A) => {
        if (!j.isText(C)) return !1;
        var [B, S] = E.parent(n, A);
        return !n.isVoid(B) || n.markableVoid(B);
      },
      c = ee.isExpanded(l),
      d = !1;
    if (!c) {
      var [h, v] = E.node(n, l);
      if (h && o(h, v)) {
        var [D] = E.parent(n, v);
        d = D && n.markableVoid(D);
      }
    }
    if (c || d) le.setNodes(n, { [u]: r }, { match: o, split: !0, voids: !0 });
    else {
      var p = Av(Av({}, E.marks(n) || {}), {}, { [u]: r });
      ((n.marks = p), ll.get(n) || n.onChange());
    }
  }
};
function Bv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function bv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Bv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Bv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var uA = function (u, r) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
    o = E.point(u, r, { edge: 'end' }),
    c = E.end(u, []),
    d = { anchor: o, focus: c },
    { distance: h = 1 } = l,
    v = 0,
    D;
  for (var p of E.positions(u, bv(bv({}, l), {}, { at: d }))) {
    if (v > h) break;
    (v !== 0 && (D = p), v++);
  }
  return D;
};
function Fv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Sv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Fv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Fv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var nA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      o = E.start(u, []),
      c = E.point(u, r, { edge: 'start' }),
      d = { anchor: o, focus: c },
      { distance: h = 1 } = l,
      v = 0,
      D;
    for (var p of E.positions(u, Sv(Sv({}, l), {}, { at: d, reverse: !0 }))) {
      if (v > h) break;
      (v !== 0 && (D = p), v++);
    }
    return D;
  },
  aA = (n, u) => {
    var { selection: r } = n;
    r && ee.isCollapsed(r) && le.delete(n, { unit: u, reverse: !0 });
  },
  rA = (n, u) => {
    var { selection: r } = n;
    r && ee.isCollapsed(r) && le.delete(n, { unit: u });
  },
  lA = function (u) {
    var { direction: r = 'forward' } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { selection: l } = u;
    l && ee.isExpanded(l) && le.delete(u, { reverse: r === 'backward' });
  },
  iA = (n, u) => [E.start(n, u), E.end(n, u)];
function xv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Ov(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? xv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : xv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var oA = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return E.above(
      u,
      Ov(Ov({}, r), {}, { match: (l) => j.isElement(l) && E.isElementReadOnly(u, l) }),
    );
  },
  sA = (n, u) => E.point(n, u, { edge: 'end' }),
  fA = (n, u) => {
    var r = E.path(n, u, { edge: 'start' });
    return E.node(n, r);
  },
  cA = (n, u) => {
    var r = E.range(n, u);
    return j.fragment(n, r);
  };
function wv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Tv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? wv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : wv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var dA = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return E.above(u, Tv(Tv({}, r), {}, { match: (l) => j.isElement(l) && E.isVoid(u, l) }));
  },
  hA = (n, u) => u.children.some((r) => j.isElement(r) && E.isBlock(n, r)),
  DA = (n, u) => u.children.some((r) => j.isText(r) || E.isInline(n, r)),
  vA = (n, u) => j.has(n, u),
  gA = (n, u) => u.children.every((r) => j.isText(r)),
  mA = (n) => {
    le.splitNodes(n, { always: !0 });
  },
  pA = (n, u, r) => {
    le.insertNodes(n, u, r);
  },
  CA = (n) => {
    le.splitNodes(n, { always: !0 });
  };
function Rv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function EA(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Rv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Rv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var yA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { selection: o, marks: c } = u;
    if (o) {
      if (c) {
        var d = EA({ text: r }, c);
        le.insertNodes(u, d, { at: l.at, voids: l.voids });
      } else le.insertText(u, r, l);
      u.marks = null;
    }
  },
  AA = (n, u) => !n.isInline(u),
  BA = (n, u, r) => E.isStart(n, u, r) || E.isEnd(n, u, r),
  bA = (n, u) => {
    var { children: r } = u,
      [l] = r;
    return r.length === 0 || (r.length === 1 && j.isText(l) && l.text === '' && !n.isVoid(u));
  },
  FA = (n, u, r) => {
    var l = E.end(n, r);
    return Ke.equals(u, l);
  },
  SA = (n) => {
    var u = im.get(n);
    return u === void 0 ? !0 : u;
  },
  xA = (n, u, r) => {
    if (u.offset !== 0) return !1;
    var l = E.start(n, r);
    return Ke.equals(u, l);
  },
  OA = (n, u) => {
    var r = E.path(n, u, { edge: 'end' });
    return E.node(n, r);
  },
  wA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      o = E.path(u, r, l),
      c = j.leaf(u, o);
    return [c, o];
  };
function TA(n) {
  var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var { at: r = n.selection, reverse: l = !1, voids: o = !1 } = u,
      { match: c } = u;
    if ((c == null && (c = () => !0), !!r)) {
      var d = [],
        h = E.path(n, r);
      for (var [v, D] of j.levels(n, h))
        if (c(v, D) && (d.push([v, D]), !o && j.isElement(v) && E.isVoid(n, v))) break;
      (l && d.reverse(), yield* d);
    }
  })();
}
var RA = ['text'],
  MA = ['text'],
  jA = function (u) {
    var { marks: r, selection: l } = u;
    if (!l) return null;
    var { anchor: o, focus: c } = l;
    if (r) return r;
    if (ee.isExpanded(l)) {
      var d = ee.isBackward(l);
      d && ([c, o] = [o, c]);
      var h = E.isEnd(u, o, o.path);
      if (h) {
        var v = E.after(u, o);
        v && (o = v);
      }
      var [D] = E.nodes(u, { match: j.isText, at: { anchor: o, focus: c } });
      if (D) {
        var [p] = D,
          { text: C } = p,
          A = rn(p, RA);
        return A;
      } else return {};
    }
    var { path: B } = o,
      [S] = E.leaf(u, B);
    if (o.offset === 0) {
      var w = E.previous(u, { at: B, match: j.isText }),
        N = E.above(u, { match: (X) => j.isElement(X) && E.isVoid(u, X) && u.markableVoid(X) });
      if (!N) {
        var b = E.above(u, { match: (X) => j.isElement(X) && E.isBlock(u, X) });
        if (w && b) {
          var [m, M] = w,
            [, _] = b;
          T.isAncestor(_, M) && (S = m);
        }
      }
    }
    var { text: K } = S,
      ue = rn(S, MA);
    return ue;
  },
  NA = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { mode: l = 'lowest', voids: o = !1 } = r,
      { match: c, at: d = u.selection } = r;
    if (d) {
      var h = E.after(u, d, { voids: o });
      if (h) {
        var [, v] = E.last(u, []),
          D = [h.path, v];
        if (Re.isPath(d) && d.length === 0)
          throw new Error('Cannot get the next node from the root node!');
        if (c == null)
          if (Re.isPath(d)) {
            var [p] = E.parent(u, d);
            c = (A) => p.children.includes(A);
          } else c = () => !0;
        var [C] = E.nodes(u, { at: D, match: c, mode: l, voids: o });
        return C;
      }
    }
  },
  zA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      o = E.path(u, r, l),
      c = j.get(u, o);
    return [c, o];
  };
function LA(n) {
  var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var {
        at: r = n.selection,
        mode: l = 'all',
        universal: o = !1,
        reverse: c = !1,
        voids: d = !1,
        pass: h,
      } = u,
      { match: v } = u;
    if ((v || (v = () => !0), !!r)) {
      var D, p;
      if (Re.isSpan(r)) ((D = r[0]), (p = r[1]));
      else {
        var C = E.path(n, r, { edge: 'start' }),
          A = E.path(n, r, { edge: 'end' });
        ((D = c ? A : C), (p = c ? C : A));
      }
      var B = j.nodes(n, {
          reverse: c,
          from: D,
          to: p,
          pass: (_) => {
            var [K, ue] = _;
            return h && h([K, ue])
              ? !0
              : j.isElement(K)
                ? !!(!d && (E.isVoid(n, K) || E.isElementReadOnly(n, K)))
                : !1;
          },
        }),
        S = [],
        w;
      for (var [N, b] of B) {
        var m = w && T.compare(b, w[1]) === 0;
        if (!(l === 'highest' && m)) {
          if (!v(N, b)) {
            if (o && !m && j.isText(N)) return;
            continue;
          }
          if (l === 'lowest' && m) {
            w = [N, b];
            continue;
          }
          var M = l === 'lowest' ? w : [N, b];
          (M && (o ? S.push(M) : yield M), (w = [N, b]));
        }
      }
      (l === 'lowest' && w && (o ? S.push(w) : yield w), o && (yield* S));
    }
  })();
}
var HA = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { force: l = !1, operation: o } = r,
      c = (p) => lo.get(p) || [],
      d = (p) => io.get(p) || new Set(),
      h = (p) => {
        var C = c(p).pop(),
          A = C.join(',');
        return (d(p).delete(A), C);
      };
    if (E.isNormalizing(u)) {
      if (l) {
        var v = Array.from(j.nodes(u), (p) => {
            var [, C] = p;
            return C;
          }),
          D = new Set(v.map((p) => p.join(',')));
        (lo.set(u, v), io.set(u, D));
      }
      c(u).length !== 0 &&
        E.withoutNormalizing(u, () => {
          for (var p of c(u))
            if (j.has(u, p)) {
              var C = E.node(u, p),
                [A, B] = C;
              j.isElement(A) &&
                A.children.length === 0 &&
                u.normalizeNode(C, { operation: o, force: l });
            }
          for (var S = c(u), w = S.length, N = 0; S.length !== 0;) {
            if (
              !u.shouldNormalize({
                dirtyPaths: S,
                iteration: N,
                initialDirtyPathsLength: w,
                operation: o,
              })
            )
              return;
            var b = h(u);
            if (j.has(u, b)) {
              var m = E.node(u, b);
              u.normalizeNode(m, { operation: o, force: l });
            }
            (N++, (S = c(u)));
          }
        });
    }
  },
  UA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      o = E.path(u, r, l),
      c = T.parent(o),
      d = E.node(u, c);
    return d;
  },
  kA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { affinity: o = 'forward' } = l,
      c = {
        current: r,
        affinity: o,
        unref() {
          var { current: h } = c,
            v = E.pathRefs(u);
          return (v.delete(c), (c.current = null), h);
        },
      },
      d = E.pathRefs(u);
    return (d.add(c), c);
  },
  qA = (n) => {
    var u = av.get(n);
    return (u || ((u = new Set()), av.set(n, u)), u);
  },
  _A = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { depth: o, edge: c } = l;
    if (Re.isPath(r)) {
      if (c === 'start') {
        var [, d] = j.first(u, r);
        r = d;
      } else if (c === 'end') {
        var [, h] = j.last(u, r);
        r = h;
      }
    }
    return (
      Re.isRange(r) &&
        (c === 'start'
          ? (r = ee.start(r))
          : c === 'end'
            ? (r = ee.end(r))
            : (r = T.common(r.anchor.path, r.focus.path))),
      Re.isPoint(r) && (r = r.path),
      o != null && (r = r.slice(0, o)),
      r
    );
  },
  GA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { affinity: o = 'forward' } = l,
      c = {
        current: r,
        affinity: o,
        unref() {
          var { current: h } = c,
            v = E.pointRefs(u);
          return (v.delete(c), (c.current = null), h);
        },
      },
      d = E.pointRefs(u);
    return (d.add(c), c);
  },
  YA = (n) => {
    var u = rv.get(n);
    return (u || ((u = new Set()), rv.set(n, u)), u);
  },
  VA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { edge: o = 'start' } = l;
    if (Re.isPath(r)) {
      var c;
      if (o === 'end') {
        var [, d] = j.last(u, r);
        c = d;
      } else {
        var [, h] = j.first(u, r);
        c = h;
      }
      var v = j.get(u, c);
      if (!j.isText(v))
        throw new Error(
          'Cannot get the '
            .concat(o, ' point in the node at path [')
            .concat(r, '] because it has no ')
            .concat(o, ' text node.'),
        );
      return { path: c, offset: o === 'end' ? v.text.length : 0 };
    }
    if (Re.isRange(r)) {
      var [D, p] = ee.edges(r);
      return o === 'start' ? D : p;
    }
    return r;
  };
function PA(n) {
  var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var { at: r = n.selection, unit: l = 'offset', reverse: o = !1, voids: c = !1 } = u;
    if (!r) return;
    var d = E.range(n, r),
      [h, v] = ee.edges(d),
      D = o ? v : h,
      p = !1,
      C = '',
      A = 0,
      B = 0,
      S = 0,
      w = [],
      N = function* (ue) {
        var X = w.some((Q) => T.isAncestor(Q, ue));
        function* ie(Q) {
          X || (yield Q);
        }
        if (j.isElement(m)) {
          if (!n.isSelectable(m)) {
            if ((w.push(ue), o))
              return (T.hasPrevious(ue) && (yield* ie(E.end(n, T.previous(ue)))), 0);
            var se = T.next(ue);
            return (E.hasPath(n, se) && (yield* ie(E.start(n, se))), 0);
          }
          if (!c && (n.isVoid(m) || n.isElementReadOnly(m))) return (yield* ie(E.start(n, ue)), 0);
          if (n.isInline(m)) return 0;
          if (E.hasInlines(n, m)) {
            var he = T.isAncestor(ue, v.path) ? v : E.end(n, ue),
              de = T.isAncestor(ue, h.path) ? h : E.start(n, ue);
            ((C = E.string(n, { anchor: de, focus: he }, { voids: c })), (p = !0));
          }
        }
        if (j.isText(m)) {
          var W = T.equals(ue, D.path);
          for (
            W
              ? ((B = o ? D.offset : m.text.length - D.offset), (S = D.offset))
              : ((B = m.text.length), (S = o ? B : 0)),
              (W || p || l === 'offset') && (yield* ie({ path: ue, offset: S }), (p = !1));
            ;
          ) {
            if (A === 0) {
              if (C === '') break;
              ((A = _(C, l, o)), (C = jc(C, A, o)[1]));
            }
            if (((S = o ? S - A : S + A), (B = B - A), B < 0)) {
              A = -B;
              break;
            }
            ((A = 0), yield* ie({ path: ue, offset: S }));
          }
        }
      },
      b;
    for (var [m, M] of E.nodes(n, { at: r, reverse: o, voids: c })) b = yield* N(M);
    function _(K, ue, X) {
      return ue === 'character'
        ? Mc(K, X)
        : ue === 'word'
          ? gy(K, X)
          : ue === 'line' || ue === 'block'
            ? K.length
            : 1;
    }
  })();
}
var KA = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { mode: l = 'lowest', voids: o = !1 } = r,
      { match: c, at: d = u.selection } = r;
    if (d) {
      var h = E.before(u, d, { voids: o });
      if (h) {
        var [, v] = E.first(u, []),
          D = [h.path, v];
        if (Re.isPath(d) && d.length === 0)
          throw new Error('Cannot get the previous node from the root node!');
        if (c == null)
          if (Re.isPath(d)) {
            var [p] = E.parent(u, d);
            c = (A) => p.children.includes(A);
          } else c = () => !0;
        var [C] = E.nodes(u, { reverse: !0, at: D, match: c, mode: l, voids: o });
        return C;
      }
    }
  },
  XA = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { affinity: o = 'forward' } = l,
      c = {
        current: r,
        affinity: o,
        unref() {
          var { current: h } = c,
            v = E.rangeRefs(u);
          return (v.delete(c), (c.current = null), h);
        },
      },
      d = E.rangeRefs(u);
    return (d.add(c), c);
  },
  QA = (n) => {
    var u = lv.get(n);
    return (u || ((u = new Set()), lv.set(n, u)), u);
  },
  ZA = (n, u, r) => {
    if (Re.isRange(u) && !r) return u;
    var l = E.start(n, u),
      o = E.end(n, r || u);
    return { anchor: l, focus: o };
  };
function Mv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function $A(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Mv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Mv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var WA = (n, u) => {
    var { selection: r } = n;
    if (r) {
      var l = (p, C) => {
          if (!j.isText(p)) return !1;
          var [A, B] = E.parent(n, C);
          return !n.isVoid(A) || n.markableVoid(A);
        },
        o = ee.isExpanded(r),
        c = !1;
      if (!o) {
        var [d, h] = E.node(n, r);
        if (d && l(d, h)) {
          var [v] = E.parent(n, h);
          c = v && n.markableVoid(v);
        }
      }
      if (o || c) le.unsetNodes(n, u, { match: l, split: !0, voids: !0 });
      else {
        var D = $A({}, E.marks(n) || {});
        (delete D[u], (n.marks = D), ll.get(n) || n.onChange());
      }
    }
  },
  JA = (n, u) => {
    im.set(n, u);
  },
  IA = (n, u) => E.point(n, u, { edge: 'start' }),
  eB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { voids: o = !1 } = l,
      c = E.range(u, r),
      [d, h] = ee.edges(c),
      v = '';
    for (var [D, p] of E.nodes(u, { at: c, match: j.isText, voids: o })) {
      var C = D.text;
      (T.equals(p, h.path) && (C = C.slice(0, h.offset)),
        T.equals(p, d.path) && (C = C.slice(d.offset)),
        (v += C));
    }
    return v;
  },
  tB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { voids: o = !1 } = l,
      [c, d] = ee.edges(r);
    if (c.offset !== 0 || d.offset !== 0 || ee.isCollapsed(r) || T.hasPrevious(d.path)) return r;
    var h = E.above(u, { at: d, match: (S) => j.isElement(S) && E.isBlock(u, S), voids: o }),
      v = h ? h[1] : [],
      D = E.start(u, c),
      p = { anchor: D, focus: d },
      C = !0;
    for (var [A, B] of E.nodes(u, { at: p, match: j.isText, reverse: !0, voids: o })) {
      if (C) {
        C = !1;
        continue;
      }
      if (A.text !== '' || T.isBefore(B, v)) {
        d = { path: B, offset: A.text.length };
        break;
      }
    }
    return { anchor: c, focus: d };
  },
  uB = (n, u) => {
    var r = E.isNormalizing(n);
    E.setNormalizing(n, !1);
    try {
      u();
    } finally {
      E.setNormalizing(n, r);
    }
    E.normalize(n);
  },
  nB = (n, u, r) => {
    var [l, o] = u,
      [c, d] = r;
    return (
      (j.isElement(l) && E.isEmpty(n, l)) || (j.isText(l) && l.text === '' && o[o.length - 1] !== 0)
    );
  },
  aB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    E.withoutNormalizing(u, () => {
      var l,
        o,
        { reverse: c = !1, unit: d = 'character', distance: h = 1, voids: v = !1 } = r,
        { at: D = u.selection, hanging: p = !1 } = r;
      if (D) {
        var C = !1;
        if ((Re.isRange(D) && ee.isCollapsed(D) && ((C = !0), (D = D.anchor)), Re.isPoint(D))) {
          var A = E.void(u, { at: D, mode: 'highest' });
          if (!v && A) {
            var [, B] = A;
            D = B;
          } else {
            var S = { unit: d, distance: h },
              w = c ? E.before(u, D, S) || E.start(u, []) : E.after(u, D, S) || E.end(u, []);
            ((D = { anchor: D, focus: w }), (p = !0));
          }
        }
        if (Re.isPath(D)) {
          le.removeNodes(u, { at: D, voids: v });
          return;
        }
        if (!ee.isCollapsed(D)) {
          if (!p) {
            var [, N] = ee.edges(D),
              b = E.end(u, []);
            Ke.equals(N, b) || (D = E.unhangRange(u, D, { voids: v }));
          }
          var [m, M] = ee.edges(D),
            _ = E.above(u, { match: (Ee) => j.isElement(Ee) && E.isBlock(u, Ee), at: m, voids: v }),
            K = E.above(u, { match: (Ee) => j.isElement(Ee) && E.isBlock(u, Ee), at: M, voids: v }),
            ue = _ && K && !T.equals(_[1], K[1]),
            X = T.equals(m.path, M.path),
            ie = v
              ? null
              : (l = E.void(u, { at: m, mode: 'highest' })) !== null && l !== void 0
                ? l
                : E.elementReadOnly(u, { at: m, mode: 'highest' }),
            se = v
              ? null
              : (o = E.void(u, { at: M, mode: 'highest' })) !== null && o !== void 0
                ? o
                : E.elementReadOnly(u, { at: M, mode: 'highest' });
          if (ie) {
            var he = E.before(u, m);
            he && _ && T.isAncestor(_[1], he.path) && (m = he);
          }
          if (se) {
            var de = E.after(u, M);
            de && K && T.isAncestor(K[1], de.path) && (M = de);
          }
          var W = [],
            Q;
          for (var ae of E.nodes(u, { at: D, voids: v })) {
            var [ne, L] = ae;
            (Q && T.compare(L, Q) === 0) ||
              (((!v && j.isElement(ne) && (E.isVoid(u, ne) || E.isElementReadOnly(u, ne))) ||
                (!T.isCommon(L, m.path) && !T.isCommon(L, M.path))) &&
                (W.push(ae), (Q = L)));
          }
          var V = Array.from(W, (Ee) => {
              var [, be] = Ee;
              return E.pathRef(u, be);
            }),
            De = E.pointRef(u, m),
            ve = E.pointRef(u, M),
            pe = '';
          if (!X && !ie) {
            var x = De.current,
              [Y] = E.leaf(u, x),
              { path: Z } = x,
              { offset: J } = m,
              ge = Y.text.slice(J);
            ge.length > 0 &&
              (u.apply({ type: 'remove_text', path: Z, offset: J, text: ge }), (pe = ge));
          }
          if (
            (V.reverse()
              .map((Ee) => Ee.unref())
              .filter((Ee) => Ee !== null)
              .forEach((Ee) => le.removeNodes(u, { at: Ee, voids: v })),
            !se)
          ) {
            var Ae = ve.current,
              [Oe] = E.leaf(u, Ae),
              { path: Xe } = Ae,
              Ne = X ? m.offset : 0,
              z = Oe.text.slice(Ne, M.offset);
            z.length > 0 &&
              (u.apply({ type: 'remove_text', path: Xe, offset: Ne, text: z }), (pe = z));
          }
          (!X &&
            ue &&
            ve.current &&
            De.current &&
            le.mergeNodes(u, { at: ve.current, hanging: !0, voids: v }),
            C &&
              c &&
              d === 'character' &&
              pe.length > 1 &&
              pe.match(
                /[\u0980-\u09FF\u0E00-\u0E7F\u1000-\u109F\u0900-\u097F\u1780-\u17FF\u0D00-\u0D7F\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F]+/,
              ) &&
              le.insertText(u, pe.slice(0, pe.length - h)));
          var oe = De.unref(),
            re = ve.unref(),
            fe = c ? oe || re : re || oe;
          r.at == null && fe && le.select(u, fe);
        }
      }
    });
  },
  rB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    E.withoutNormalizing(u, () => {
      var { hanging: o = !1, voids: c = !1 } = l,
        { at: d = Rc(u), batchDirty: h = !0 } = l;
      if (r.length) {
        if (Re.isRange(d))
          if ((o || (d = E.unhangRange(u, d, { voids: c })), ee.isCollapsed(d))) d = d.anchor;
          else {
            var [, v] = ee.edges(d);
            if (!c && E.void(u, { at: v })) return;
            var D = E.pointRef(u, v);
            (le.delete(u, { at: d }), (d = D.unref()));
          }
        else Re.isPath(d) && (d = E.start(u, d));
        if (!(!c && E.void(u, { at: d }))) {
          var p = E.above(u, {
            at: d,
            match: (Z) => j.isElement(Z) && E.isInline(u, Z),
            mode: 'highest',
            voids: c,
          });
          if (p) {
            var [, C] = p;
            if (E.isEnd(u, d, C)) {
              var A = E.after(u, C);
              d = A;
            } else if (E.isStart(u, d, C)) {
              var B = E.before(u, C);
              d = B;
            }
          }
          var S = E.above(u, { match: (Z) => j.isElement(Z) && E.isBlock(u, Z), at: d, voids: c }),
            [, w] = S,
            N = E.isStart(u, d, w),
            b = E.isEnd(u, d, w),
            m = N && b,
            [, M] = j.first({ children: r }, []),
            [, _] = j.last({ children: r }, []),
            K = (Z) => {
              var [J, ge] = Z,
                Ae = ge.length === 0;
              return Ae
                ? !1
                : m
                  ? !0
                  : !(
                      (!N &&
                        T.isAncestor(ge, M) &&
                        j.isElement(J) &&
                        !u.isVoid(J) &&
                        !u.isInline(J)) ||
                      (!b &&
                        T.isAncestor(ge, _) &&
                        j.isElement(J) &&
                        !u.isVoid(J) &&
                        !u.isInline(J))
                    );
            },
            ue = !0,
            X = [],
            ie = [],
            se = [];
          for (var he of j.nodes({ children: r }, { pass: K })) {
            var [de, W] = he;
            (ue && j.isElement(de) && !u.isInline(de) && !T.isAncestor(W, M) && (ue = !1),
              K(he) &&
                (j.isElement(de) && !u.isInline(de)
                  ? ((ue = !1), ie.push(de))
                  : ue
                    ? X.push(de)
                    : se.push(de)));
          }
          var [Q] = E.nodes(u, {
              at: d,
              match: (Z) => j.isText(Z) || E.isInline(u, Z),
              mode: 'highest',
              voids: c,
            }),
            [, ae] = Q,
            ne = E.isStart(u, d, ae),
            L = E.isEnd(u, d, ae),
            V = E.pathRef(u, b && !se.length ? T.next(w) : w),
            De = E.pathRef(u, L ? T.next(ae) : ae),
            ve = se.length > 0;
          le.splitNodes(u, {
            at: d,
            match: (Z) =>
              ve ? j.isElement(Z) && E.isBlock(u, Z) : j.isText(Z) || E.isInline(u, Z),
            mode: ve ? 'lowest' : 'highest',
            always: ve && (!N || X.length > 0) && (!b || se.length > 0),
            voids: c,
          });
          var pe = E.pathRef(u, !ne || (ne && L) ? T.next(ae) : ae);
          if (
            (le.insertNodes(u, X, {
              at: pe.current,
              match: (Z) => j.isText(Z) || E.isInline(u, Z),
              mode: 'highest',
              voids: c,
              batchDirty: h,
            }),
            m && !X.length && ie.length && !se.length && le.delete(u, { at: w, voids: c }),
            le.insertNodes(u, ie, {
              at: V.current,
              match: (Z) => j.isElement(Z) && E.isBlock(u, Z),
              mode: 'lowest',
              voids: c,
              batchDirty: h,
            }),
            le.insertNodes(u, se, {
              at: De.current,
              match: (Z) => j.isText(Z) || E.isInline(u, Z),
              mode: 'highest',
              voids: c,
              batchDirty: h,
            }),
            !l.at)
          ) {
            var x;
            if (
              (se.length > 0 && De.current
                ? (x = T.previous(De.current))
                : ie.length > 0 && V.current
                  ? (x = T.previous(V.current))
                  : pe.current && (x = T.previous(pe.current)),
              x)
            ) {
              var Y = E.end(u, x);
              le.select(u, Y);
            }
          }
          (pe.unref(), V.unref(), De.unref());
        }
      }
    });
  },
  lB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { edge: l = 'anchor' } = r,
      { selection: o } = u;
    if (o) {
      if (l === 'anchor') le.select(u, o.anchor);
      else if (l === 'focus') le.select(u, o.focus);
      else if (l === 'start') {
        var [c] = ee.edges(o);
        le.select(u, c);
      } else if (l === 'end') {
        var [, d] = ee.edges(o);
        le.select(u, d);
      }
    } else return;
  },
  iB = (n) => {
    var { selection: u } = n;
    u && n.apply({ type: 'set_selection', properties: u, newProperties: null });
  },
  oB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { selection: l } = u,
      { distance: o = 1, unit: c = 'character', reverse: d = !1 } = r,
      { edge: h = null } = r;
    if (l) {
      (h === 'start' && (h = ee.isBackward(l) ? 'focus' : 'anchor'),
        h === 'end' && (h = ee.isBackward(l) ? 'anchor' : 'focus'));
      var { anchor: v, focus: D } = l,
        p = { distance: o, unit: c },
        C = {};
      if (h == null || h === 'anchor') {
        var A = d ? E.before(u, v, p) : E.after(u, v, p);
        A && (C.anchor = A);
      }
      if (h == null || h === 'focus') {
        var B = d ? E.before(u, D, p) : E.after(u, D, p);
        B && (C.focus = B);
      }
      le.setSelection(u, C);
    }
  },
  sB = (n, u) => {
    var { selection: r } = n;
    if (((u = E.range(n, u)), r)) {
      le.setSelection(n, u);
      return;
    }
    if (!Re.isRange(u))
      throw new Error(
        'When setting the selection and the current selection is `null` you must provide at least an `anchor` and `focus`, but you passed: '.concat(
          Bt.stringify(u),
        ),
      );
    n.apply({ type: 'set_selection', properties: r, newProperties: u });
  };
function jv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Nv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? jv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : jv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var fB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { selection: o } = u,
      { edge: c = 'both' } = l;
    if (o) {
      (c === 'start' && (c = ee.isBackward(o) ? 'focus' : 'anchor'),
        c === 'end' && (c = ee.isBackward(o) ? 'anchor' : 'focus'));
      var { anchor: d, focus: h } = o,
        v = c === 'anchor' ? d : h;
      le.setSelection(u, { [c === 'anchor' ? 'anchor' : 'focus']: Nv(Nv({}, v), r) });
    }
  },
  cB = (n, u) => {
    var { selection: r } = n,
      l = {},
      o = {};
    if (r) {
      for (var c in u)
        if (!sm.includes(c)) {
          var d = Object.hasOwn(r, c) ? r[c] : void 0,
            h = u[c];
          dB(c, d, h) && ((l[c] = r[c]), (o[c] = u[c]));
        }
      Object.keys(l).length > 0 &&
        n.apply({ type: 'set_selection', properties: l, newProperties: o });
    }
  };
function dB(n, u, r) {
  return (n === 'anchor' || n === 'focus') && Ke.isPoint(u) && Ke.isPoint(r)
    ? !Ke.equals(u, r)
    : u !== r;
}
var hB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    E.withoutNormalizing(u, () => {
      var { hanging: o = !1, voids: c = !1, mode: d = 'lowest', batchDirty: h = !0 } = l,
        { at: v, match: D, select: p } = l;
      if ((j.isNode(r) && (r = [r]), r.length !== 0)) {
        var [C] = r;
        if ((v || ((v = Rc(u)), p !== !1 && (p = !0)), p == null && (p = !1), Re.isRange(v)))
          if ((o || (v = E.unhangRange(u, v, { voids: c })), ee.isCollapsed(v))) v = v.anchor;
          else {
            var [, A] = ee.edges(v),
              B = E.pointRef(u, A);
            (le.delete(u, { at: v }), (v = B.unref()));
          }
        if (Re.isPoint(v)) {
          D == null &&
            (j.isText(C)
              ? (D = (he) => j.isText(he))
              : u.isInline(C)
                ? (D = (he) => j.isText(he) || E.isInline(u, he))
                : (D = (he) => j.isElement(he) && E.isBlock(u, he)));
          var [S] = E.nodes(u, { at: v.path, match: D, mode: d, voids: c });
          if (S) {
            var [, w] = S,
              N = E.pathRef(u, w),
              b = E.isEnd(u, v, w);
            le.splitNodes(u, { at: v, match: D, mode: d, voids: c });
            var m = N.unref();
            v = b ? T.next(m) : m;
          } else return;
        }
        var M = T.parent(v),
          _ = v[v.length - 1];
        if (!(!c && E.void(u, { at: M }))) {
          if (h) {
            var K = [],
              ue = T.levels(M);
            Qy(
              u,
              () => {
                var he = function () {
                  var Q = M.concat(_);
                  _++;
                  var ae = { type: 'insert_node', path: Q, node: de };
                  (u.apply(ae),
                    (v = T.next(v)),
                    K.push(ae),
                    j.isText(de)
                      ? ue.push(Q)
                      : ue.push(
                          ...Array.from(j.nodes(de), (ne) => {
                            var [, L] = ne;
                            return Q.concat(L);
                          }),
                        ));
                };
                for (var de of r) he();
              },
              () => {
                fm(u, ue, (he) => {
                  var de = he;
                  for (var W of K)
                    if (T.operationCanTransformPath(W) && ((de = T.transform(de, W)), !de))
                      return null;
                  return de;
                });
              },
            );
          } else
            for (var X of r) {
              var ie = M.concat(_);
              (_++, u.apply({ type: 'insert_node', path: ie, node: X }), (v = T.next(v)));
            }
          if (((v = T.previous(v)), p)) {
            var se = E.end(u, v);
            se && le.select(u, se);
          }
        }
      }
    });
  },
  DB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    E.withoutNormalizing(u, () => {
      var { at: l = u.selection, mode: o = 'lowest', voids: c = !1 } = r,
        { match: d } = r;
      if (l) {
        d == null && (d = Re.isPath(l) ? or(u, l) : (_) => j.isElement(_) && E.isBlock(u, _));
        var h = E.nodes(u, { at: l, match: d, mode: o, voids: c }),
          v = Array.from(h, (_) => {
            var [, K] = _;
            return E.pathRef(u, K);
          });
        for (var D of v) {
          var p = D.unref();
          if (p.length < 2)
            throw new Error(
              'Cannot lift node at a path ['.concat(
                p,
                '] because it has a depth of less than `2`.',
              ),
            );
          var C = E.node(u, T.parent(p)),
            [A, B] = C,
            S = p[p.length - 1],
            { length: w } = A.children;
          if (w === 1) {
            var N = T.next(B);
            (le.moveNodes(u, { at: p, to: N, voids: c }), le.removeNodes(u, { at: B, voids: c }));
          } else if (S === 0) le.moveNodes(u, { at: p, to: B, voids: c });
          else if (S === w - 1) {
            var b = T.next(B);
            le.moveNodes(u, { at: p, to: b, voids: c });
          } else {
            var m = T.next(p),
              M = T.next(B);
            (le.splitNodes(u, { at: m, voids: c }), le.moveNodes(u, { at: p, to: M, voids: c }));
          }
        }
      }
    });
  },
  vB = ['text'],
  gB = ['children'],
  cm = (n, u) =>
    u !== n && (j.isText(u) || E.isVoid(n, u) || (u.children.length === 1 && cm(n, u.children[0]))),
  mB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    E.withoutNormalizing(u, () => {
      var { match: l, at: o = u.selection } = r,
        { hanging: c = !1, voids: d = !1, mode: h = 'lowest' } = r;
      if (o) {
        var v = Re.isPath(o),
          D = v ? o : null,
          p = l == null && v;
        if (l == null)
          if (v) {
            var [C] = E.parent(u, o);
            l = (L) => C.children.includes(L);
          } else l = (L) => j.isElement(L) && E.isBlock(u, L);
        if ((!c && Re.isRange(o) && (o = E.unhangRange(u, o, { voids: d })), Re.isRange(o)))
          if (ee.isCollapsed(o)) o = o.anchor;
          else {
            var [, A] = ee.edges(o),
              B = E.pointRef(u, A);
            (le.delete(u, { at: o }), (o = B.unref()), r.at == null && le.select(u, o));
          }
        var [S] = E.nodes(u, { at: o, match: l, voids: d, mode: h }),
          w = p && D && T.hasPrevious(D) ? T.previous(D) : null,
          N = w ? E.node(u, w) : E.previous(u, { at: o, match: l, voids: d, mode: h });
        if (!(!S || !N)) {
          var [b, m] = S,
            [M, _] = N;
          if (!(m.length === 0 || _.length === 0)) {
            var K = T.next(_),
              ue = T.common(m, _),
              X = T.isSibling(m, _),
              ie = Array.from(E.levels(u, { at: m }), (L) => {
                var [V] = L;
                return V;
              })
                .slice(ue.length)
                .slice(0, -1),
              se = E.above(u, { at: m, mode: 'highest', match: (L) => ie.includes(L) && cm(u, L) }),
              he = se && E.pathRef(u, se[1]),
              de,
              W;
            if (j.isText(b) && j.isText(M)) {
              var { text: Q } = b,
                ae = rn(b, vB);
              ((W = M.text.length), (de = ae));
            } else if (j.isElement(b) && j.isElement(M)) {
              var { children: ne } = b,
                ae = rn(b, gB);
              ((W = M.children.length), (de = ae));
            } else
              throw new Error(
                'Cannot merge the node at path ['
                  .concat(m, '] with the previous sibling because it is not the same kind: ')
                  .concat(Bt.stringify(b), ' ')
                  .concat(Bt.stringify(M)),
              );
            (X || le.moveNodes(u, { at: m, to: K, voids: d }),
              he && le.removeNodes(u, { at: he.current, voids: d }),
              E.shouldMergeNodesRemovePrevNode(u, N, S)
                ? le.removeNodes(u, { at: _, voids: d })
                : u.apply({ type: 'merge_node', path: K, position: W, properties: de }),
              he && he.unref());
          }
        }
      }
    });
  },
  pB = (n, u) => {
    E.withoutNormalizing(n, () => {
      var { to: r, at: l = n.selection, mode: o = 'lowest', voids: c = !1 } = u,
        { match: d } = u;
      if (l) {
        d == null && (d = Re.isPath(l) ? or(n, l) : (B) => j.isElement(B) && E.isBlock(n, B));
        var h = E.pathRef(n, r),
          v = E.nodes(n, { at: l, match: d, mode: o, voids: c }),
          D = Array.from(v, (B) => {
            var [, S] = B;
            return E.pathRef(n, S);
          });
        for (var p of D) {
          var C = p.unref(),
            A = h.current;
          (C.length !== 0 && n.apply({ type: 'move_node', path: C, newPath: A }),
            h.current && T.isSibling(A, C) && T.isAfter(A, C) && (h.current = T.next(h.current)));
        }
        h.unref();
      }
    });
  },
  CB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    E.withoutNormalizing(u, () => {
      var { hanging: l = !1, voids: o = !1, mode: c = 'lowest' } = r,
        { at: d = u.selection, match: h } = r;
      if (d) {
        (h == null && (h = Re.isPath(d) ? or(u, d) : (B) => j.isElement(B) && E.isBlock(u, B)),
          !l && Re.isRange(d) && (d = E.unhangRange(u, d, { voids: o })));
        var v = E.nodes(u, { at: d, match: h, mode: c, voids: o }),
          D = Array.from(v, (B) => {
            var [, S] = B;
            return E.pathRef(u, S);
          });
        for (var p of D) {
          var C = p.unref();
          if (C) {
            var [A] = E.node(u, C);
            u.apply({ type: 'remove_node', path: C, node: A });
          }
        }
      }
    });
  },
  EB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    E.withoutNormalizing(u, () => {
      var { match: o, at: c = u.selection, compare: d, merge: h } = l,
        { hanging: v = !1, mode: D = 'lowest', split: p = !1, voids: C = !1 } = l;
      if (c) {
        if (
          (o == null && (o = Re.isPath(c) ? or(u, c) : (he) => j.isElement(he) && E.isBlock(u, he)),
          !v && Re.isRange(c) && (c = E.unhangRange(u, c, { voids: C })),
          p && Re.isRange(c))
        ) {
          if (ee.isCollapsed(c) && E.leaf(u, c.anchor)[0].text.length > 0) return;
          var A = E.rangeRef(u, c, { affinity: 'inward' }),
            [B, S] = ee.edges(c),
            w = D === 'lowest' ? 'lowest' : 'highest',
            N = E.isEnd(u, S, S.path);
          le.splitNodes(u, { at: S, match: o, mode: w, voids: C, always: !N });
          var b = E.isStart(u, B, B.path);
          (le.splitNodes(u, { at: B, match: o, mode: w, voids: C, always: !b }),
            (c = A.unref()),
            l.at == null && le.select(u, c));
        }
        d || (d = (he, de) => he !== de);
        for (var [m, M] of E.nodes(u, { at: c, match: o, mode: D, voids: C })) {
          var _ = {},
            K = {};
          if (M.length !== 0) {
            var ue = !1;
            for (var X in r)
              if (!dc.includes(X)) {
                var ie = Object.hasOwn(m, X) ? m[X] : void 0,
                  se = r[X];
                d(se, ie) &&
                  ((ue = !0),
                  Object.hasOwn(m, X) && (_[X] = ie),
                  h ? se != null && (K[X] = h(ie, se)) : se != null && (K[X] = se));
              }
            ue && u.apply({ type: 'set_node', path: M, properties: _, newProperties: K });
          }
        }
      }
    });
  },
  yB = (n, u) => {
    if (ee.isCollapsed(u)) return u.anchor;
    var [, r] = ee.edges(u),
      l = E.pointRef(n, r);
    return (le.delete(n, { at: u }), l.unref());
  },
  AB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    E.withoutNormalizing(u, () => {
      var { mode: l = 'lowest', voids: o = !1 } = r,
        { match: c, at: d = u.selection, height: h = 0, always: v = !1 } = r;
      if (
        d &&
        (c == null && (c = (ve) => j.isElement(ve) && E.isBlock(u, ve)),
        !(Re.isRange(d) && ((d = yB(u, d)), !d)))
      ) {
        if (Re.isPath(d)) {
          var D = d,
            p = E.point(u, D),
            [C] = E.parent(u, D);
          ((c = (ve) => ve === C), (h = p.path.length - D.length + 1), (d = p), (v = !0));
        }
        var A = E.pointRef(u, d, { affinity: 'backward' }),
          B;
        try {
          var [S] = E.nodes(u, { at: d, match: c, mode: l, voids: o });
          if (!S) return;
          var w = E.void(u, { at: d, mode: 'highest' }),
            N = 0;
          if (!o && w) {
            var [b, m] = w;
            if (u.isInline(b)) {
              var M = E.after(u, m);
              if (!M) {
                var _ = { text: '' },
                  K = T.next(m);
                (le.insertNodes(u, _, { at: K, voids: o }), (M = E.point(u, K)));
              }
              ((d = M), (v = !0));
            }
            var ue = d.path.length - m.length;
            ((h = ue + 1), (v = !0));
          }
          B = E.pointRef(u, d);
          var X = d.path.length - h,
            [, ie] = S,
            se = d.path.slice(0, X),
            he = h === 0 ? d.offset : d.path[X] + N;
          for (var [de, W] of E.levels(u, { at: se, reverse: !0, voids: o })) {
            var Q = !1;
            if (
              W.length < ie.length ||
              W.length === 0 ||
              (!o && j.isElement(de) && E.isVoid(u, de))
            )
              break;
            var ae = A.current,
              ne = E.isEnd(u, ae, W);
            if (v || !A || !E.isEdge(u, ae, W)) {
              Q = !0;
              var L = j.extractProps(de);
              u.apply({ type: 'split_node', path: W, position: he, properties: L });
            }
            he = W[W.length - 1] + (Q || ne ? 1 : 0);
          }
          if (r.at == null) {
            var V = B.current || E.end(u, []);
            le.select(u, V);
          }
        } finally {
          var De;
          (A.unref(), (De = B) === null || De === void 0 || De.unref());
        }
      }
    });
  },
  BB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Array.isArray(r) || (r = [r]);
    var o = {};
    for (var c of r) o[c] = null;
    le.setNodes(u, o, l);
  },
  bB = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    E.withoutNormalizing(u, () => {
      var { mode: l = 'lowest', split: o = !1, voids: c = !1 } = r,
        { at: d = u.selection, match: h } = r;
      if (d) {
        (h == null && (h = Re.isPath(d) ? or(u, d) : (B) => j.isElement(B) && E.isBlock(u, B)),
          Re.isPath(d) && (d = E.range(u, d)));
        var v = Re.isRange(d) ? E.rangeRef(u, d) : null,
          D = E.nodes(u, { at: d, match: h, mode: l, voids: c }),
          p = Array.from(D, (B) => {
            var [, S] = B;
            return E.pathRef(u, S);
          }).reverse(),
          C = function () {
            var S = A.unref(),
              [w] = E.node(u, S),
              N = E.range(u, S);
            (o && v && (N = ee.intersection(v.current, N)),
              le.liftNodes(u, {
                at: N,
                match: (b) => !j.isText(w) && w.children.includes(b),
                voids: c,
              }));
          };
        for (var A of p) C();
        v && v.unref();
      }
    });
  };
function zv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Lv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? zv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : zv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var FB = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    E.withoutNormalizing(u, () => {
      var { mode: o = 'lowest', split: c = !1, voids: d = !1 } = l,
        { match: h, at: v = u.selection } = l;
      if (v) {
        if (
          (h == null &&
            (Re.isPath(v)
              ? (h = or(u, v))
              : u.isInline(r)
                ? (h = (b) => (j.isElement(b) && E.isInline(u, b)) || j.isText(b))
                : (h = (b) => j.isElement(b) && E.isBlock(u, b))),
          c && Re.isRange(v))
        ) {
          var [D, p] = ee.edges(v),
            C = E.rangeRef(u, v, { affinity: 'inward' }),
            A = (b) => {
              var m = E.above(u, { at: b, match: (M) => j.isElement(M) && E.isBlock(u, M) });
              return m && E.isEdge(u, b, m[1]);
            };
          (le.splitNodes(u, { at: p, match: h, voids: d, always: !A(p) }),
            le.splitNodes(u, { at: D, match: h, voids: d, always: !A(D) }),
            (v = C.unref()),
            l.at == null && le.select(u, v));
        }
        var B = Array.from(
            E.nodes(u, {
              at: v,
              match: u.isInline(r)
                ? (b) => j.isElement(b) && E.isBlock(u, b)
                : (b) => j.isEditor(b),
              mode: 'lowest',
              voids: d,
            }),
          ),
          S = function () {
            var m = Re.isRange(v) ? ee.intersection(v, E.range(u, N)) : v;
            if (!m) return 0;
            var M = Array.from(E.nodes(u, { at: m, match: h, mode: o, voids: d }));
            if (M.length > 0) {
              var [_] = M,
                K = M[M.length - 1],
                [, ue] = _,
                [, X] = K;
              if (ue.length === 0 && X.length === 0) return 0;
              var ie = T.equals(ue, X) ? T.parent(ue) : T.common(ue, X),
                se = E.range(u, ue, X),
                he = E.node(u, ie),
                [de] = he,
                W = ie.length + 1,
                Q = T.next(X.slice(0, W)),
                ae = Lv(Lv({}, r), {}, { children: [] });
              (le.insertNodes(u, ae, { at: Q, voids: d }),
                le.moveNodes(u, {
                  at: se,
                  match: (ne) => !j.isText(de) && de.children.includes(ne),
                  to: Q.concat(0),
                  voids: d,
                }));
            }
          },
          w;
        for (var [, N] of B) w = S();
      }
    });
  },
  SB = () => {
    var n = {
      children: [],
      operations: [],
      selection: null,
      marks: null,
      isElementReadOnly: () => !1,
      isInline: () => !1,
      isSelectable: () => !0,
      isVoid: () => !1,
      markableVoid: () => !1,
      onChange: () => {},
      apply: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return Zy(n, ...l);
      },
      addMark: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return tA(n, ...l);
      },
      deleteBackward: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return aA(n, ...l);
      },
      deleteForward: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return rA(n, ...l);
      },
      deleteFragment: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return lA(n, ...l);
      },
      getFragment: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return Wy(n, ...l);
      },
      insertBreak: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return mA(n, ...l);
      },
      insertSoftBreak: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return CA(n, ...l);
      },
      insertFragment: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return rB(n, ...l);
      },
      insertNode: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return pA(n, ...l);
      },
      insertText: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return yA(n, ...l);
      },
      normalizeNode: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return Jy(n, ...l);
      },
      removeMark: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return WA(n, ...l);
      },
      getDirtyPaths: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return $y(n, ...l);
      },
      shouldNormalize: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return Iy(n, ...l);
      },
      above: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return eA(n, ...l);
      },
      after: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return uA(n, ...l);
      },
      before: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return nA(n, ...l);
      },
      collapse: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return lB(n, ...l);
      },
      delete: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return aB(n, ...l);
      },
      deselect: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return iB(n, ...l);
      },
      edges: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return iA(n, ...l);
      },
      elementReadOnly: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return oA(n, ...l);
      },
      end: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return sA(n, ...l);
      },
      first: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return fA(n, ...l);
      },
      fragment: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return cA(n, ...l);
      },
      getMarks: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return jA(n, ...l);
      },
      hasBlocks: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return hA(n, ...l);
      },
      hasInlines: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return DA(n, ...l);
      },
      hasPath: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return vA(n, ...l);
      },
      hasTexts: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return gA(n, ...l);
      },
      insertNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return hB(n, ...l);
      },
      isBlock: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return AA(n, ...l);
      },
      isEdge: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return BA(n, ...l);
      },
      isEmpty: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return bA(n, ...l);
      },
      isEnd: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return FA(n, ...l);
      },
      isNormalizing: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return SA(n, ...l);
      },
      isStart: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return xA(n, ...l);
      },
      last: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return OA(n, ...l);
      },
      leaf: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return wA(n, ...l);
      },
      levels: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return TA(n, ...l);
      },
      liftNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return DB(n, ...l);
      },
      mergeNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return mB(n, ...l);
      },
      move: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return oB(n, ...l);
      },
      moveNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return pB(n, ...l);
      },
      next: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return NA(n, ...l);
      },
      node: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return zA(n, ...l);
      },
      nodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return LA(n, ...l);
      },
      normalize: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return HA(n, ...l);
      },
      parent: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return UA(n, ...l);
      },
      path: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return _A(n, ...l);
      },
      pathRef: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return kA(n, ...l);
      },
      pathRefs: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return qA(n, ...l);
      },
      point: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return VA(n, ...l);
      },
      pointRef: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return GA(n, ...l);
      },
      pointRefs: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return YA(n, ...l);
      },
      positions: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return PA(n, ...l);
      },
      previous: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return KA(n, ...l);
      },
      range: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return ZA(n, ...l);
      },
      rangeRef: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return XA(n, ...l);
      },
      rangeRefs: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return QA(n, ...l);
      },
      removeNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return CB(n, ...l);
      },
      select: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return sB(n, ...l);
      },
      setNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return EB(n, ...l);
      },
      setNormalizing: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return JA(n, ...l);
      },
      setPoint: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return fB(n, ...l);
      },
      setSelection: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return cB(n, ...l);
      },
      splitNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return AB(n, ...l);
      },
      start: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return IA(n, ...l);
      },
      string: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return eB(n, ...l);
      },
      unhangRange: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return tB(n, ...l);
      },
      unsetNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return BB(n, ...l);
      },
      unwrapNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return bB(n, ...l);
      },
      void: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return dA(n, ...l);
      },
      withoutNormalizing: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return uB(n, ...l);
      },
      wrapNodes: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return FB(n, ...l);
      },
      shouldMergeNodesRemovePrevNode: function () {
        for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
        return nB(n, ...l);
      },
    };
    return n;
  },
  kf,
  Hv;
function xB() {
  if (Hv) return kf;
  ((Hv = 1), (kf = o));
  var n = '֑-߿יִ-﷽ﹰ-ﻼ',
    u = 'A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿',
    r = new RegExp('^[^' + u + ']*[' + n + ']'),
    l = new RegExp('^[^' + n + ']*[' + u + ']');
  function o(c) {
    return ((c = String(c || '')), r.test(c) ? 'rtl' : l.test(c) ? 'ltr' : 'neutral');
  }
  return kf;
}
var OB = xB();
const dm = Cl(OB);
var qf, Uv;
function zc() {
  if (Uv) return qf;
  Uv = 1;
  function n(u) {
    var r = typeof u;
    return u != null && (r == 'object' || r == 'function');
  }
  return ((qf = n), qf);
}
var _f, kv;
function wB() {
  if (kv) return _f;
  kv = 1;
  var n = typeof _i == 'object' && _i && _i.Object === Object && _i;
  return ((_f = n), _f);
}
var Gf, qv;
function hm() {
  if (qv) return Gf;
  qv = 1;
  var n = wB(),
    u = typeof self == 'object' && self && self.Object === Object && self,
    r = n || u || Function('return this')();
  return ((Gf = r), Gf);
}
var Yf, _v;
function TB() {
  if (_v) return Yf;
  _v = 1;
  var n = hm(),
    u = function () {
      return n.Date.now();
    };
  return ((Yf = u), Yf);
}
var Vf, Gv;
function RB() {
  if (Gv) return Vf;
  Gv = 1;
  var n = /\s/;
  function u(r) {
    for (var l = r.length; l-- && n.test(r.charAt(l)););
    return l;
  }
  return ((Vf = u), Vf);
}
var Pf, Yv;
function MB() {
  if (Yv) return Pf;
  Yv = 1;
  var n = RB(),
    u = /^\s+/;
  function r(l) {
    return l && l.slice(0, n(l) + 1).replace(u, '');
  }
  return ((Pf = r), Pf);
}
var Kf, Vv;
function Dm() {
  if (Vv) return Kf;
  Vv = 1;
  var n = hm(),
    u = n.Symbol;
  return ((Kf = u), Kf);
}
var Xf, Pv;
function jB() {
  if (Pv) return Xf;
  Pv = 1;
  var n = Dm(),
    u = Object.prototype,
    r = u.hasOwnProperty,
    l = u.toString,
    o = n ? n.toStringTag : void 0;
  function c(d) {
    var h = r.call(d, o),
      v = d[o];
    try {
      d[o] = void 0;
      var D = !0;
    } catch {}
    var p = l.call(d);
    return (D && (h ? (d[o] = v) : delete d[o]), p);
  }
  return ((Xf = c), Xf);
}
var Qf, Kv;
function NB() {
  if (Kv) return Qf;
  Kv = 1;
  var n = Object.prototype,
    u = n.toString;
  function r(l) {
    return u.call(l);
  }
  return ((Qf = r), Qf);
}
var Zf, Xv;
function zB() {
  if (Xv) return Zf;
  Xv = 1;
  var n = Dm(),
    u = jB(),
    r = NB(),
    l = '[object Null]',
    o = '[object Undefined]',
    c = n ? n.toStringTag : void 0;
  function d(h) {
    return h == null ? (h === void 0 ? o : l) : c && c in Object(h) ? u(h) : r(h);
  }
  return ((Zf = d), Zf);
}
var $f, Qv;
function LB() {
  if (Qv) return $f;
  Qv = 1;
  function n(u) {
    return u != null && typeof u == 'object';
  }
  return (($f = n), $f);
}
var Wf, Zv;
function HB() {
  if (Zv) return Wf;
  Zv = 1;
  var n = zB(),
    u = LB(),
    r = '[object Symbol]';
  function l(o) {
    return typeof o == 'symbol' || (u(o) && n(o) == r);
  }
  return ((Wf = l), Wf);
}
var Jf, $v;
function UB() {
  if ($v) return Jf;
  $v = 1;
  var n = MB(),
    u = zc(),
    r = HB(),
    l = NaN,
    o = /^[-+]0x[0-9a-f]+$/i,
    c = /^0b[01]+$/i,
    d = /^0o[0-7]+$/i,
    h = parseInt;
  function v(D) {
    if (typeof D == 'number') return D;
    if (r(D)) return l;
    if (u(D)) {
      var p = typeof D.valueOf == 'function' ? D.valueOf() : D;
      D = u(p) ? p + '' : p;
    }
    if (typeof D != 'string') return D === 0 ? D : +D;
    D = n(D);
    var C = c.test(D);
    return C || d.test(D) ? h(D.slice(2), C ? 2 : 8) : o.test(D) ? l : +D;
  }
  return ((Jf = v), Jf);
}
var If, Wv;
function vm() {
  if (Wv) return If;
  Wv = 1;
  var n = zc(),
    u = TB(),
    r = UB(),
    l = 'Expected a function',
    o = Math.max,
    c = Math.min;
  function d(h, v, D) {
    var p,
      C,
      A,
      B,
      S,
      w,
      N = 0,
      b = !1,
      m = !1,
      M = !0;
    if (typeof h != 'function') throw new TypeError(l);
    ((v = r(v) || 0),
      n(D) &&
        ((b = !!D.leading),
        (m = 'maxWait' in D),
        (A = m ? o(r(D.maxWait) || 0, v) : A),
        (M = 'trailing' in D ? !!D.trailing : M)));
    function _(Q) {
      var ae = p,
        ne = C;
      return ((p = C = void 0), (N = Q), (B = h.apply(ne, ae)), B);
    }
    function K(Q) {
      return ((N = Q), (S = setTimeout(ie, v)), b ? _(Q) : B);
    }
    function ue(Q) {
      var ae = Q - w,
        ne = Q - N,
        L = v - ae;
      return m ? c(L, A - ne) : L;
    }
    function X(Q) {
      var ae = Q - w,
        ne = Q - N;
      return w === void 0 || ae >= v || ae < 0 || (m && ne >= A);
    }
    function ie() {
      var Q = u();
      if (X(Q)) return se(Q);
      S = setTimeout(ie, ue(Q));
    }
    function se(Q) {
      return ((S = void 0), M && p ? _(Q) : ((p = C = void 0), B));
    }
    function he() {
      (S !== void 0 && clearTimeout(S), (N = 0), (p = w = C = S = void 0));
    }
    function de() {
      return S === void 0 ? B : se(u());
    }
    function W() {
      var Q = u(),
        ae = X(Q);
      if (((p = arguments), (C = this), (w = Q), ae)) {
        if (S === void 0) return K(w);
        if (m) return (clearTimeout(S), (S = setTimeout(ie, v)), _(w));
      }
      return (S === void 0 && (S = setTimeout(ie, v)), B);
    }
    return ((W.cancel = he), (W.flush = de), W);
  }
  return ((If = d), If);
}
var kB = vm();
const qB = Cl(kB);
var ec, Jv;
function _B() {
  if (Jv) return ec;
  Jv = 1;
  var n = vm(),
    u = zc(),
    r = 'Expected a function';
  function l(o, c, d) {
    var h = !0,
      v = !0;
    if (typeof o != 'function') throw new TypeError(r);
    return (
      u(d) && ((h = 'leading' in d ? !!d.leading : h), (v = 'trailing' in d ? !!d.trailing : v)),
      n(o, c, { leading: h, maxWait: c, trailing: v })
    );
  }
  return ((ec = l), ec);
}
var GB = _B();
const YB = Cl(GB),
  Iv = (n) => typeof n == 'object' && n != null && n.nodeType === 1,
  eg = (n, u) => (!u || n !== 'hidden') && n !== 'visible' && n !== 'clip',
  Pi = (n, u) => {
    if (n.clientHeight < n.scrollHeight || n.clientWidth < n.scrollWidth) {
      const r = getComputedStyle(n, null);
      return (
        eg(r.overflowY, u) ||
        eg(r.overflowX, u) ||
        ((l) => {
          const o = ((c) => {
            if (!c.ownerDocument || !c.ownerDocument.defaultView) return null;
            try {
              return c.ownerDocument.defaultView.frameElement;
            } catch {
              return null;
            }
          })(l);
          return !!o && (o.clientHeight < l.scrollHeight || o.clientWidth < l.scrollWidth);
        })(n)
      );
    }
    return !1;
  },
  Ki = (n, u, r, l, o, c, d, h) =>
    (c < n && d > u) || (c > n && d < u)
      ? 0
      : (c <= n && h <= r) || (d >= u && h >= r)
        ? c - n - l
        : (d > u && h < r) || (c < n && h > r)
          ? d - u + o
          : 0,
  VB = (n) => {
    const u = n.parentElement;
    return u ?? (n.getRootNode().host || null);
  },
  tg = (n, u) => {
    var r, l, o, c;
    if (typeof document > 'u') return [];
    const { scrollMode: d, block: h, inline: v, boundary: D, skipOverflowHiddenElements: p } = u,
      C = typeof D == 'function' ? D : (L) => L !== D;
    if (!Iv(n)) throw new TypeError('Invalid target');
    const A = document.scrollingElement || document.documentElement,
      B = [];
    let S = n;
    for (; Iv(S) && C(S);) {
      if (((S = VB(S)), S === A)) {
        B.push(S);
        break;
      }
      (S != null && S === document.body && Pi(S) && !Pi(document.documentElement)) ||
        (S != null && Pi(S, p) && B.push(S));
    }
    const w = (l = (r = window.visualViewport) == null ? void 0 : r.width) != null ? l : innerWidth,
      N = (c = (o = window.visualViewport) == null ? void 0 : o.height) != null ? c : innerHeight,
      { scrollX: b, scrollY: m } = window,
      { height: M, width: _, top: K, right: ue, bottom: X, left: ie } = n.getBoundingClientRect(),
      {
        top: se,
        right: he,
        bottom: de,
        left: W,
      } = ((L) => {
        const V = window.getComputedStyle(L);
        return {
          top: parseFloat(V.scrollMarginTop) || 0,
          right: parseFloat(V.scrollMarginRight) || 0,
          bottom: parseFloat(V.scrollMarginBottom) || 0,
          left: parseFloat(V.scrollMarginLeft) || 0,
        };
      })(n);
    let Q = h === 'start' || h === 'nearest' ? K - se : h === 'end' ? X + de : K + M / 2 - se + de,
      ae = v === 'center' ? ie + _ / 2 - W + he : v === 'end' ? ue + he : ie - W;
    const ne = [];
    for (let L = 0; L < B.length; L++) {
      const V = B[L],
        {
          height: De,
          width: ve,
          top: pe,
          right: x,
          bottom: Y,
          left: Z,
        } = V.getBoundingClientRect();
      if (
        d === 'if-needed' &&
        K >= 0 &&
        ie >= 0 &&
        X <= N &&
        ue <= w &&
        ((V === A && !Pi(V)) || (K >= pe && X <= Y && ie >= Z && ue <= x))
      )
        return ne;
      const J = getComputedStyle(V),
        ge = parseInt(J.borderLeftWidth, 10),
        Ae = parseInt(J.borderTopWidth, 10),
        Oe = parseInt(J.borderRightWidth, 10),
        Xe = parseInt(J.borderBottomWidth, 10);
      let Ne = 0,
        z = 0;
      const oe = 'offsetWidth' in V ? V.offsetWidth - V.clientWidth - ge - Oe : 0,
        re = 'offsetHeight' in V ? V.offsetHeight - V.clientHeight - Ae - Xe : 0,
        fe = 'offsetWidth' in V ? (V.offsetWidth === 0 ? 0 : ve / V.offsetWidth) : 0,
        Ee = 'offsetHeight' in V ? (V.offsetHeight === 0 ? 0 : De / V.offsetHeight) : 0;
      if (A === V)
        ((Ne =
          h === 'start'
            ? Q
            : h === 'end'
              ? Q - N
              : h === 'nearest'
                ? Ki(m, m + N, N, Ae, Xe, m + Q, m + Q + M, M)
                : Q - N / 2),
          (z =
            v === 'start'
              ? ae
              : v === 'center'
                ? ae - w / 2
                : v === 'end'
                  ? ae - w
                  : Ki(b, b + w, w, ge, Oe, b + ae, b + ae + _, _)),
          (Ne = Math.max(0, Ne + m)),
          (z = Math.max(0, z + b)));
      else {
        ((Ne =
          h === 'start'
            ? Q - pe - Ae
            : h === 'end'
              ? Q - Y + Xe + re
              : h === 'nearest'
                ? Ki(pe, Y, De, Ae, Xe + re, Q, Q + M, M)
                : Q - (pe + De / 2) + re / 2),
          (z =
            v === 'start'
              ? ae - Z - ge
              : v === 'center'
                ? ae - (Z + ve / 2) + oe / 2
                : v === 'end'
                  ? ae - x + Oe + oe
                  : Ki(Z, x, ve, ge, Oe + oe, ae, ae + _, _)));
        const { scrollLeft: be, scrollTop: $e } = V;
        ((Ne = Ee === 0 ? 0 : Math.max(0, Math.min($e + Ne / Ee, V.scrollHeight - De / Ee + re))),
          (z = fe === 0 ? 0 : Math.max(0, Math.min(be + z / fe, V.scrollWidth - ve / fe + oe))),
          (Q += $e - Ne),
          (ae += be - z));
      }
      ne.push({ el: V, top: Ne, left: z });
    }
    return ne;
  },
  PB = (n) =>
    n === !1
      ? { block: 'end', inline: 'nearest' }
      : ((u) => u === Object(u) && Object.keys(u).length !== 0)(n)
        ? n
        : { block: 'start', inline: 'nearest' };
function KB(n, u) {
  if (
    !n.isConnected ||
    !((o) => {
      let c = o;
      for (; c && c.parentNode;) {
        if (c.parentNode === document) return !0;
        c = c.parentNode instanceof ShadowRoot ? c.parentNode.host : c.parentNode;
      }
      return !1;
    })(n)
  )
    return;
  const r = ((o) => {
    const c = window.getComputedStyle(o);
    return {
      top: parseFloat(c.scrollMarginTop) || 0,
      right: parseFloat(c.scrollMarginRight) || 0,
      bottom: parseFloat(c.scrollMarginBottom) || 0,
      left: parseFloat(c.scrollMarginLeft) || 0,
    };
  })(n);
  if (((o) => typeof o == 'object' && typeof o.behavior == 'function')(u))
    return u.behavior(tg(n, u));
  const l = typeof u == 'boolean' || u == null ? void 0 : u.behavior;
  for (const { el: o, top: c, left: d } of tg(n, PB(u))) {
    const h = c - r.top + r.bottom,
      v = d - r.left + r.right;
    o.scroll({ top: h, left: v, behavior: l });
  }
}
var Bu = {},
  ug;
function XB() {
  if (ug) return Bu;
  ((ug = 1), Object.defineProperty(Bu, '__esModule', { value: !0 }));
  for (
    var n = typeof window < 'u' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform),
      u = { alt: 'altKey', control: 'ctrlKey', meta: 'metaKey', shift: 'shiftKey' },
      r = {
        add: '+',
        break: 'pause',
        cmd: 'meta',
        command: 'meta',
        ctl: 'control',
        ctrl: 'control',
        del: 'delete',
        down: 'arrowdown',
        esc: 'escape',
        ins: 'insert',
        left: 'arrowleft',
        mod: n ? 'meta' : 'control',
        opt: 'alt',
        option: 'alt',
        return: 'enter',
        right: 'arrowright',
        space: ' ',
        spacebar: ' ',
        up: 'arrowup',
        win: 'meta',
        windows: 'meta',
      },
      l = {
        backspace: 8,
        tab: 9,
        enter: 13,
        shift: 16,
        control: 17,
        alt: 18,
        pause: 19,
        capslock: 20,
        escape: 27,
        ' ': 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        arrowleft: 37,
        arrowup: 38,
        arrowright: 39,
        arrowdown: 40,
        insert: 45,
        delete: 46,
        meta: 91,
        numlock: 144,
        scrolllock: 145,
        ';': 186,
        '=': 187,
        ',': 188,
        '-': 189,
        '.': 190,
        '/': 191,
        '`': 192,
        '[': 219,
        '\\': 220,
        ']': 221,
        "'": 222,
      },
      o = 1;
    o < 20;
    o++
  )
    l['f' + o] = 111 + o;
  function c(A, B, S) {
    (B && !('byKey' in B) && ((S = B), (B = null)), Array.isArray(A) || (A = [A]));
    var w = A.map(function (m) {
        return v(m, B);
      }),
      N = function (M) {
        return w.some(function (_) {
          return D(_, M);
        });
      },
      b = S == null ? N : N(S);
    return b;
  }
  function d(A, B) {
    return c(A, B);
  }
  function h(A, B) {
    return c(A, { byKey: !0 }, B);
  }
  function v(A, B) {
    var S = B && B.byKey,
      w = {};
    A = A.replace('++', '+add');
    var N = A.split('+'),
      b = N.length;
    for (var m in u) w[u[m]] = !1;
    var M = !0,
      _ = !1,
      K = void 0;
    try {
      for (var ue = N[Symbol.iterator](), X; !(M = (X = ue.next()).done); M = !0) {
        var ie = X.value,
          se = ie.endsWith('?') && ie.length > 1;
        se && (ie = ie.slice(0, -1));
        var he = C(ie),
          de = u[he];
        if (ie.length > 1 && !de && !r[ie] && !l[he])
          throw new TypeError('Unknown modifier: "' + ie + '"');
        ((b === 1 || !de) && (S ? (w.key = he) : (w.which = p(ie))),
          de && (w[de] = se ? null : !0));
      }
    } catch (W) {
      ((_ = !0), (K = W));
    } finally {
      try {
        !M && ue.return && ue.return();
      } finally {
        if (_) throw K;
      }
    }
    return w;
  }
  function D(A, B) {
    for (var S in A) {
      var w = A[S],
        N = void 0;
      if (
        w != null &&
        (S === 'key' && B.key != null
          ? (N = B.key.toLowerCase())
          : S === 'which'
            ? (N = w === 91 && B.which === 93 ? 91 : B.which)
            : (N = B[S]),
        !(N == null && w === !1) && N !== w)
      )
        return !1;
    }
    return !0;
  }
  function p(A) {
    A = C(A);
    var B = l[A] || A.toUpperCase().charCodeAt(0);
    return B;
  }
  function C(A) {
    return ((A = A.toLowerCase()), (A = r[A] || A), A);
  }
  return (
    (Bu.default = c),
    (Bu.isHotkey = c),
    (Bu.isCodeHotkey = d),
    (Bu.isKeyHotkey = h),
    (Bu.parseHotkey = v),
    (Bu.compareHotkey = D),
    (Bu.toKeyCode = p),
    (Bu.toKeyName = C),
    Bu
  );
}
var tc = XB(),
  gm = globalThis.Node,
  QB = globalThis.Text,
  Lc = (n) => (n && n.ownerDocument && n.ownerDocument.defaultView) || null,
  ZB = (n) => Gn(n) && n.nodeType === 8,
  mu = (n) => Gn(n) && n.nodeType === 1,
  Gn = (n) => {
    var u = Lc(n);
    return !!u && n instanceof u.Node;
  },
  hc = (n) => {
    var u = n && n.anchorNode && Lc(n.anchorNode);
    return !!u && n instanceof u.Selection;
  },
  mm = (n) => Gn(n) && n.nodeType === 3,
  $B = (n) =>
    n.clipboardData &&
    n.clipboardData.getData('text/plain') !== '' &&
    n.clipboardData.types.length === 1,
  WB = (n) => {
    var [u, r] = n;
    if (mu(u) && u.childNodes.length) {
      var l = r === u.childNodes.length,
        o = l ? r - 1 : r;
      for (
        [u, o] = pm(u, o, l ? 'backward' : 'forward'), l = o < r;
        mu(u) && u.childNodes.length;
      ) {
        var c = l ? u.childNodes.length - 1 : 0;
        u = IB(u, c, l ? 'backward' : 'forward');
      }
      r = l && u.textContent != null ? u.textContent.length : 0;
    }
    return [u, r];
  },
  JB = (n) => {
    for (var u = n && n.parentNode; u;) {
      if (u.toString() === '[object ShadowRoot]') return !0;
      u = u.parentNode;
    }
    return !1;
  },
  pm = (n, u, r) => {
    if (typeof u != 'number') throw new Error('Expected index to be a number');
    for (
      var { childNodes: l } = n, o = l[u], c = u, d = !1, h = !1;
      (ZB(o) ||
        (mu(o) && o.childNodes.length === 0) ||
        (mu(o) && o.getAttribute('contenteditable') === 'false')) &&
      !(d && h);
    ) {
      if (c >= l.length) {
        ((d = !0), (c = u - 1), (r = 'backward'));
        continue;
      }
      if (c < 0) {
        ((h = !0), (c = u + 1), (r = 'forward'));
        continue;
      }
      ((o = l[c]), (u = c), (c += r === 'forward' ? 1 : -1));
    }
    return [o, u];
  },
  IB = (n, u, r) => {
    var [l] = pm(n, u, r);
    return l;
  },
  Cm = (n) => {
    var u = '';
    if (mm(n) && n.nodeValue) return n.nodeValue;
    if (mu(n)) {
      for (var r of Array.from(n.childNodes)) u += Cm(r);
      var l = getComputedStyle(n).getPropertyValue('display');
      (l === 'block' || l === 'list' || n.tagName === 'BR') &&
        (u += `
`);
    }
    return u;
  },
  eb = /data-slate-fragment="(.+?)"/m,
  tb = (n) => {
    var u = n.getData('text/html'),
      [, r] = u.match(eb) || [];
    return r;
  },
  il = (n) => (n.getSelection != null ? n.getSelection() : document.getSelection()),
  Hc = (n, u, r) => {
    var { target: l } = u;
    if (mu(l) && l.matches('[contentEditable="false"]')) return !1;
    var { document: o } = Te.getWindow(n);
    if (ca(o, l)) return Te.hasDOMNode(n, l, { editable: !0 });
    var c = r.find((d) => {
      var { addedNodes: h, removedNodes: v } = d;
      for (var D of h) if (D === l || ca(D, l)) return !0;
      for (var p of v) if (p === l || ca(p, l)) return !0;
    });
    return !c || c === u ? !1 : Hc(n, c, r);
  },
  ub = () => {
    for (
      var n = document.activeElement;
      (u = n) !== null &&
      u !== void 0 &&
      u.shadowRoot &&
      (r = n.shadowRoot) !== null &&
      r !== void 0 &&
      r.activeElement;
    ) {
      var u, r, l;
      n =
        (l = n) === null || l === void 0 || (l = l.shadowRoot) === null || l === void 0
          ? void 0
          : l.activeElement;
    }
    return n;
  },
  ng = (n, u) => !!(n.compareDocumentPosition(u) & gm.DOCUMENT_POSITION_PRECEDING),
  nb = (n, u) => !!(n.compareDocumentPosition(u) & gm.DOCUMENT_POSITION_FOLLOWING),
  ag = (n, u) => {
    if (!n) return null;
    for (var r = n; r;) {
      if (r.matches && r.matches(u)) return r;
      if (r.parentElement) r = r.parentElement;
      else if (r.parentNode && 'host' in r.parentNode) r = r.parentNode.host;
      else return null;
    }
    return null;
  },
  ca = (n, u) => {
    if (!n || !u) return !1;
    if (n.contains(u)) return !0;
    for (var r = u; r;) {
      if (r === n) return !0;
      if (r.parentNode) 'host' in r.parentNode ? (r = r.parentNode.host) : (r = r.parentNode);
      else return !1;
    }
    return !1;
  },
  uc,
  nc,
  ab =
    typeof navigator < 'u' &&
    typeof window < 'u' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream,
  rg = typeof navigator < 'u' && /Mac OS X/.test(navigator.userAgent),
  Ut = typeof navigator < 'u' && /Android/.test(navigator.userAgent),
  er = typeof navigator < 'u' && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent),
  sa = typeof navigator < 'u' && /AppleWebKit(?!.*Chrome)/i.test(navigator.userAgent),
  rb =
    typeof navigator < 'u' && /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent),
  Uc = typeof navigator < 'u' && /Chrome/i.test(navigator.userAgent),
  Em =
    typeof navigator < 'u' && /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent),
  lb = Ut && typeof navigator < 'u' && /Chrome?\/(?:[0-5]?\d)(?:\.)/i.test(navigator.userAgent),
  ib =
    typeof navigator < 'u' &&
    /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(navigator.userAgent),
  ob = typeof navigator < 'u' && /.*UCBrowser/.test(navigator.userAgent),
  sb =
    typeof navigator < 'u' &&
    /.*Wechat/.test(navigator.userAgent) &&
    !/.*MacWechat/.test(navigator.userAgent) &&
    (!Uc || Em),
  uo =
    typeof window < 'u' &&
    typeof window.document < 'u' &&
    typeof window.document.createElement < 'u';
typeof navigator < 'u' &&
  /Safari/.test(navigator.userAgent) &&
  /Version\/(\d+)/.test(navigator.userAgent) &&
  (uc = navigator.userAgent.match(/Version\/(\d+)/)) !== null &&
  uc !== void 0 &&
  uc[1] &&
  parseInt(
    (nc = navigator.userAgent.match(/Version\/(\d+)/)) === null || nc === void 0 ? void 0 : nc[1],
    10,
  ) < 17;
var Hn =
  (!Em || !lb) &&
  !rb &&
  typeof globalThis < 'u' &&
  globalThis.InputEvent &&
  typeof globalThis.InputEvent.prototype.getTargetRanges == 'function';
function vl(n) {
  '@babel/helpers - typeof';
  return (
    (vl =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (u) {
            return typeof u;
          }
        : function (u) {
            return u &&
              typeof Symbol == 'function' &&
              u.constructor === Symbol &&
              u !== Symbol.prototype
              ? 'symbol'
              : typeof u;
          }),
    vl(n)
  );
}
function fb(n, u) {
  if (vl(n) !== 'object' || n === null) return n;
  var r = n[Symbol.toPrimitive];
  if (r !== void 0) {
    var l = r.call(n, u);
    if (vl(l) !== 'object') return l;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (u === 'string' ? String : Number)(n);
}
function cb(n) {
  var u = fb(n, 'string');
  return vl(u) === 'symbol' ? u : String(u);
}
function kc(n, u, r) {
  return (
    (u = cb(u)),
    u in n
      ? Object.defineProperty(n, u, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (n[u] = r),
    n
  );
}
var db = 0;
class ym {
  constructor() {
    (kc(this, 'id', void 0), (this.id = ''.concat(db++)));
  }
}
var nr = new WeakMap(),
  tr = new WeakMap(),
  ol = new WeakMap(),
  Am = new WeakMap(),
  sl = new WeakMap(),
  Dc = new WeakMap(),
  gl = new WeakMap(),
  da = new WeakMap(),
  fo = new WeakMap(),
  go = new WeakMap(),
  vc = new WeakMap(),
  _n = new WeakMap(),
  fa = new WeakMap(),
  fl = new WeakMap(),
  gc = new WeakMap(),
  qc = new WeakMap(),
  Fu = new WeakMap(),
  un = new WeakMap(),
  Jt = new WeakMap(),
  kn = new WeakMap(),
  tn = new WeakMap(),
  Bm = new WeakMap(),
  rr = Symbol('placeholder'),
  bm = Symbol('mark-placeholder'),
  Te = {
    androidPendingDiffs: (n) => Jt.get(n),
    androidScheduleFlush: (n) => {
      var u;
      (u = qc.get(n)) === null || u === void 0 || u();
    },
    blur: (n) => {
      var u = Te.toDOMNode(n, n),
        r = Te.findDocumentOrShadowRoot(n);
      (_n.set(n, !1), r.activeElement === u && u.blur());
    },
    deselect: (n) => {
      var { selection: u } = n,
        r = Te.findDocumentOrShadowRoot(n),
        l = il(r);
      (l && l.rangeCount > 0 && l.removeAllRanges(), u && le.deselect(n));
    },
    findDocumentOrShadowRoot: (n) => {
      var u = Te.toDOMNode(n, n),
        r = u.getRootNode();
      return r instanceof Document || r instanceof ShadowRoot ? r : u.ownerDocument;
    },
    findEventRange: (n, u) => {
      'nativeEvent' in u && (u = u.nativeEvent);
      var { clientX: r, clientY: l, target: o } = u;
      if (r == null || l == null)
        throw new Error('Cannot resolve a Slate range from a DOM event: '.concat(u));
      var c = Te.toSlateNode(n, u.target),
        d = Te.findPath(n, c);
      if (j.isElement(c) && E.isVoid(n, c)) {
        var h = o.getBoundingClientRect(),
          v = n.isInline(c) ? r - h.left < h.left + h.width - r : l - h.top < h.top + h.height - l,
          D = E.point(n, d, { edge: v ? 'start' : 'end' }),
          p = v ? E.before(n, D) : E.after(n, D);
        if (p) {
          var C = E.range(n, p);
          return C;
        }
      }
      var A,
        { document: B } = Te.getWindow(n);
      if (B.caretRangeFromPoint) A = B.caretRangeFromPoint(r, l);
      else {
        var S = B.caretPositionFromPoint(r, l);
        S &&
          ((A = B.createRange()),
          A.setStart(S.offsetNode, S.offset),
          A.setEnd(S.offsetNode, S.offset));
      }
      if (!A) throw new Error('Cannot resolve a Slate range from a DOM event: '.concat(u));
      var w = Te.toSlateRange(n, A, { exactMatch: !1, suppressThrow: !1 });
      return w;
    },
    findKey: (n, u) => {
      var r = fo.get(u);
      return (r || ((r = new ym()), fo.set(u, r)), r);
    },
    findPath: (n, u) => {
      for (var r = [], l = u; ;) {
        var o = ol.get(l);
        if (o == null) {
          if (l === n) return r;
          break;
        }
        var c = tr.get(l);
        if (c == null) break;
        (r.unshift(c), (l = o));
      }
      throw new Error('Unable to find the path for Slate node: '.concat(Bt.stringify(u)));
    },
    focus: function (u) {
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { retries: 5 };
      if (!_n.get(u) && sl.get(u)) {
        if (r.retries <= 0)
          throw new Error('Could not set focus, editor seems stuck with pending operations');
        if (u.operations.length > 0) {
          setTimeout(() => {
            Te.focus(u, { retries: r.retries - 1 });
          }, 10);
          return;
        }
        var l = Te.toDOMNode(u, u),
          o = Te.findDocumentOrShadowRoot(u);
        if (o.activeElement !== l) {
          if (u.selection && o instanceof Document) {
            var c = il(o),
              d = Te.toDOMRange(u, u.selection);
            (c == null || c.removeAllRanges(), c == null || c.addRange(d));
          }
          (u.selection || le.select(u, E.start(u, [])),
            _n.set(u, !0),
            l.focus({ preventScroll: !0 }));
        }
      }
    },
    getWindow: (n) => {
      var u = Am.get(n);
      if (!u) throw new Error('Unable to find a host window element for this editor');
      return u;
    },
    hasDOMNode: function (u, r) {
      var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
        { editable: o = !1 } = l,
        c = Te.toDOMNode(u, u),
        d;
      try {
        d = mu(r) ? r : r.parentElement;
      } catch (h) {
        if (
          h instanceof Error &&
          !h.message.includes('Permission denied to access property "nodeType"')
        )
          throw h;
      }
      return d
        ? ag(d, '[data-slate-editor]') === c &&
            (!o || d.isContentEditable
              ? !0
              : (typeof d.isContentEditable == 'boolean' &&
                  ag(d, '[contenteditable="false"]') === c) ||
                !!d.getAttribute('data-slate-zero-width'))
        : !1;
    },
    hasEditableTarget: (n, u) => Gn(u) && Te.hasDOMNode(n, u, { editable: !0 }),
    hasRange: (n, u) => {
      var { anchor: r, focus: l } = u;
      return E.hasPath(n, r.path) && E.hasPath(n, l.path);
    },
    hasSelectableTarget: (n, u) =>
      Te.hasEditableTarget(n, u) || Te.isTargetInsideNonReadonlyVoid(n, u),
    hasTarget: (n, u) => Gn(u) && Te.hasDOMNode(n, u),
    insertData: (n, u) => {
      n.insertData(u);
    },
    insertFragmentData: (n, u) => n.insertFragmentData(u),
    insertTextData: (n, u) => n.insertTextData(u),
    isComposing: (n) => !!fa.get(n),
    isFocused: (n) => !!_n.get(n),
    isReadOnly: (n) => !!vc.get(n),
    isTargetInsideNonReadonlyVoid: (n, u) => {
      if (vc.get(n) || !Te.hasTarget(n, u)) return !1;
      var r = Te.toSlateNode(n, u);
      return j.isElement(r) && E.isVoid(n, r);
    },
    setFragmentData: (n, u, r) => n.setFragmentData(u, r),
    toDOMNode: (n, u) => {
      var r,
        l =
          u === n
            ? sl.get(n)
            : (r = go.get(n)) === null || r === void 0
              ? void 0
              : r.get(Te.findKey(n, u));
      if (!l)
        throw new Error('Cannot resolve a DOM node from Slate node: '.concat(Bt.stringify(u)));
      return l;
    },
    toDOMPoint: (n, u) => {
      var [r] = E.node(n, u.path),
        l = Te.toDOMNode(n, r),
        o;
      E.void(n, { at: u }) && (u = { path: u.path, offset: 0 });
      for (
        var c = '[data-slate-string], [data-slate-zero-width]',
          d = Array.from(l.querySelectorAll(c)),
          h = 0,
          v = 0;
        v < d.length;
        v++
      ) {
        var D = d[v],
          p = D.childNodes[0];
        if (!(p == null || p.textContent == null)) {
          var { length: C } = p.textContent,
            A = D.getAttribute('data-slate-length'),
            B = A == null ? C : parseInt(A, 10),
            S = h + B,
            w = d[v + 1];
          if (
            u.offset === S &&
            w !== null &&
            w !== void 0 &&
            w.hasAttribute('data-slate-mark-placeholder')
          ) {
            var N,
              b = w.childNodes[0];
            o = [
              b instanceof QB ? b : w,
              (N = w.textContent) !== null && N !== void 0 && N.startsWith('\uFEFF') ? 1 : 0,
            ];
            break;
          }
          if (u.offset <= S) {
            var m = Math.min(C, Math.max(0, u.offset - h));
            o = [p, m];
            break;
          }
          h = S;
        }
      }
      if (!o)
        throw new Error('Cannot resolve a DOM point from Slate point: '.concat(Bt.stringify(u)));
      return o;
    },
    toDOMRange: (n, u) => {
      var { anchor: r, focus: l } = u,
        o = ee.isBackward(u),
        c = Te.toDOMPoint(n, r),
        d = ee.isCollapsed(u) ? c : Te.toDOMPoint(n, l),
        h = Te.getWindow(n),
        v = h.document.createRange(),
        [D, p] = o ? d : c,
        [C, A] = o ? c : d,
        B = mu(D) ? D : D.parentElement,
        S = !!B.getAttribute('data-slate-zero-width'),
        w = mu(C) ? C : C.parentElement,
        N = !!w.getAttribute('data-slate-zero-width');
      return (v.setStart(D, S ? 1 : p), v.setEnd(C, N ? 1 : A), v);
    },
    toSlateNode: (n, u) => {
      var r = mu(u) ? u : u.parentElement;
      r && !r.hasAttribute('data-slate-node') && (r = r.closest('[data-slate-node]'));
      var l = r ? gl.get(r) : null;
      if (!l) throw new Error('Cannot resolve a Slate node from DOM node: '.concat(r));
      return l;
    },
    toSlatePoint: (n, u, r) => {
      var { exactMatch: l, suppressThrow: o } = r,
        [c, d] = l ? u : WB(u),
        h = c.parentNode,
        v = r.searchDirection,
        D = null,
        p = 0;
      if (h) {
        var C,
          A,
          B = Te.toDOMNode(n, n),
          S = h.closest('[data-slate-void="true"]'),
          w = S && ca(B, S) ? S : null,
          N = h.closest('[contenteditable="false"]'),
          b = N && ca(B, N) ? N : null,
          m = h.closest('[data-slate-leaf]'),
          M = null;
        if (m) {
          if (((D = m.closest('[data-slate-node="text"]')), D)) {
            var _ = Te.getWindow(n),
              K = _.document.createRange();
            (K.setStart(D, 0), K.setEnd(c, d));
            var ue = K.cloneContents(),
              X = [
                ...Array.prototype.slice.call(ue.querySelectorAll('[data-slate-zero-width]')),
                ...Array.prototype.slice.call(ue.querySelectorAll('[contenteditable=false]')),
              ];
            (X.forEach((J) => {
              if (
                Ut &&
                !l &&
                J.hasAttribute('data-slate-zero-width') &&
                J.textContent.length > 0 &&
                J.textContext !== '\uFEFF'
              ) {
                J.textContent.startsWith('\uFEFF') && (J.textContent = J.textContent.slice(1));
                return;
              }
              J.parentNode.removeChild(J);
            }),
              (p = ue.textContent.length),
              (M = D));
          }
        } else if (w) {
          for (var ie = w.querySelectorAll('[data-slate-leaf]'), se = 0; se < ie.length; se++) {
            var he = ie[se];
            if (Te.hasDOMNode(n, he)) {
              m = he;
              break;
            }
          }
          m
            ? ((D = m.closest('[data-slate-node="text"]')),
              (M = m),
              (p = M.textContent.length),
              M.querySelectorAll('[data-slate-zero-width]').forEach((J) => {
                p -= J.textContent.length;
              }))
            : (p = 1);
        } else if (b) {
          var de = (J) =>
              J
                ? J.querySelectorAll(
                    '[data-slate-leaf]:not(:scope [data-slate-editor] [data-slate-leaf])',
                  )
                : [],
            W = b.closest('[data-slate-node="element"]');
          if (v === 'backward' || !v) {
            var Q,
              ae = [...de(W == null ? void 0 : W.previousElementSibling), ...de(W)];
            ((m = (Q = ae.findLast((J) => ng(b, J))) !== null && Q !== void 0 ? Q : null),
              m && (v = 'backward'));
          }
          if (v === 'forward' || !v) {
            var ne,
              L = [...de(W), ...de(W == null ? void 0 : W.nextElementSibling)];
            ((m = (ne = L.find((J) => nb(b, J))) !== null && ne !== void 0 ? ne : null),
              m && (v = 'forward'));
          }
          m &&
            ((D = m.closest('[data-slate-node="text"]')),
            (M = m),
            v === 'forward'
              ? (p = 0)
              : ((p = M.textContent.length),
                M.querySelectorAll('[data-slate-zero-width]').forEach((J) => {
                  p -= J.textContent.length;
                })));
        }
        M &&
          p === M.textContent.length &&
          Ut &&
          M.getAttribute('data-slate-zero-width') === 'z' &&
          (C = M.textContent) !== null &&
          C !== void 0 &&
          C.startsWith('\uFEFF') &&
          (h.hasAttribute('data-slate-zero-width') ||
            (er &&
              (A = M.textContent) !== null &&
              A !== void 0 &&
              A.endsWith(`

`))) &&
          p--;
      }
      if (Ut && !D && !l) {
        var V = h.hasAttribute('data-slate-node') ? h : h.closest('[data-slate-node]');
        if (V && Te.hasDOMNode(n, V, { editable: !0 })) {
          var De = Te.toSlateNode(n, V),
            ve;
          try {
            ve = Te.findPath(n, De);
          } catch (J) {
            if (o) return null;
            throw J;
          }
          var { path: pe, offset: x } = E.start(n, ve);
          return (V.querySelector('[data-slate-leaf]') || (x = d), { path: pe, offset: x });
        }
      }
      if (!D) {
        if (o) return null;
        throw new Error('Cannot resolve a Slate point from DOM point: '.concat(u));
      }
      var Y;
      try {
        Y = Te.toSlateNode(n, D);
      } catch (J) {
        if (o) return null;
        throw J;
      }
      var Z;
      try {
        Z = Te.findPath(n, Y);
      } catch (J) {
        if (o) return null;
        throw J;
      }
      return { path: Z, offset: p };
    },
    toSlateRange: (n, u, r) => {
      var l,
        { exactMatch: o, suppressThrow: c } = r,
        d = hc(u) ? u.anchorNode : u.startContainer,
        h,
        v,
        D,
        p,
        C;
      if (d)
        if (hc(u)) {
          if (er && u.rangeCount > 1) {
            D = u.focusNode;
            var A = u.getRangeAt(0),
              B = u.getRangeAt(u.rangeCount - 1);
            if (
              D instanceof HTMLTableRowElement &&
              A.startContainer instanceof HTMLTableRowElement &&
              B.startContainer instanceof HTMLTableRowElement
            ) {
              let X = function (ie) {
                return ie.childElementCount > 0 ? X(ie.children[0]) : ie;
              };
              var ue = X,
                S = A.startContainer,
                w = B.startContainer,
                N = X(S.children[A.startOffset]),
                b = X(w.children[B.startOffset]);
              ((p = 0),
                b.childNodes.length > 0 ? (h = b.childNodes[0]) : (h = b),
                N.childNodes.length > 0 ? (D = N.childNodes[0]) : (D = N),
                b instanceof HTMLElement ? (v = b.innerHTML.length) : (v = 0));
            } else
              A.startContainer === D
                ? ((h = B.endContainer), (v = B.endOffset), (p = A.startOffset))
                : ((h = A.startContainer), (v = A.endOffset), (p = B.startOffset));
          } else ((h = u.anchorNode), (v = u.anchorOffset), (D = u.focusNode), (p = u.focusOffset));
          (Uc && JB(h)) || er
            ? (C = u.anchorNode === u.focusNode && u.anchorOffset === u.focusOffset)
            : (C = u.isCollapsed);
        } else
          ((h = u.startContainer),
            (v = u.startOffset),
            (D = u.endContainer),
            (p = u.endOffset),
            (C = u.collapsed));
      if (h == null || D == null || v == null || p == null)
        throw new Error('Cannot resolve a Slate range from DOM range: '.concat(u));
      er &&
        (l = D.textContent) !== null &&
        l !== void 0 &&
        l.endsWith(`

`) &&
        p === D.textContent.length &&
        p--;
      var m = Te.toSlatePoint(n, [h, v], { exactMatch: o, suppressThrow: c });
      if (!m) return null;
      var M = ng(h, D) || (h === D && p < v),
        _ = C
          ? m
          : Te.toSlatePoint(n, [D, p], {
              exactMatch: o,
              suppressThrow: c,
              searchDirection: M ? 'forward' : 'backward',
            });
      if (!_) return null;
      var K = { anchor: m, focus: _ };
      return (
        ee.isExpanded(K) &&
          ee.isForward(K) &&
          mu(D) &&
          E.void(n, { at: K.focus, mode: 'highest' }) &&
          (K = E.unhangRange(n, K, { voids: !0 })),
        K
      );
    },
  };
function hb(n, u) {
  var { path: r, diff: l } = u;
  if (!E.hasPath(n, r)) return !1;
  var o = j.get(n, r);
  if (!j.isText(o)) return !1;
  if (l.start !== o.text.length || l.text.length === 0)
    return o.text.slice(l.start, l.start + l.text.length) === l.text;
  var c = T.next(r);
  if (!E.hasPath(n, c)) return !1;
  var d = j.get(n, c);
  return j.isText(d) && d.text.startsWith(l.text);
}
function Fm(n) {
  for (var u = arguments.length, r = new Array(u > 1 ? u - 1 : 0), l = 1; l < u; l++)
    r[l - 1] = arguments[l];
  return r.reduce((o, c) => o.slice(0, c.start) + c.text + o.slice(c.end), n);
}
function Db(n, u) {
  for (var r = Math.min(n.length, u.length), l = 0; l < r; l++)
    if (n.charAt(l) !== u.charAt(l)) return l;
  return r;
}
function vb(n, u, r) {
  for (var l = Math.min(n.length, u.length, r), o = 0; o < l; o++)
    if (n.charAt(n.length - o - 1) !== u.charAt(u.length - o - 1)) return o;
  return l;
}
function Sm(n, u) {
  var { start: r, end: l, text: o } = u,
    c = n.slice(r, l),
    d = Db(c, o),
    h = Math.min(c.length - d, o.length - d),
    v = vb(c, o, h),
    D = { start: r + d, end: l - v, text: o.slice(d, o.length - v) };
  return D.start === D.end && D.text.length === 0 ? null : D;
}
function gb(n, u, r) {
  var l = Math.min(u.start, r.start),
    o = Math.max(0, Math.min(u.start + u.text.length, r.end) - r.start),
    c = Fm(n, u, r),
    d = Math.max(
      r.start + r.text.length,
      u.start + u.text.length + (u.start + u.text.length > r.start ? r.text.length : 0) - o,
    ),
    h = c.slice(l, d),
    v = Math.max(u.end, r.end - u.text.length + (u.end - u.start));
  return Sm(n, { start: l, end: v, text: h });
}
function mb(n) {
  var { path: u, diff: r } = n;
  return { anchor: { path: u, offset: r.start }, focus: { path: u, offset: r.end } };
}
function mc(n, u) {
  var { path: r, offset: l } = u;
  if (!E.hasPath(n, r)) return null;
  var o = j.get(n, r);
  if (!j.isText(o)) return null;
  var c = E.above(n, { match: (h) => j.isElement(h) && E.isBlock(n, h), at: r });
  if (!c) return null;
  for (; l > o.text.length;) {
    var d = E.next(n, { at: r, match: j.isText });
    if (!d || !T.isDescendant(d[1], c[1])) return null;
    ((l -= o.text.length), (o = d[0]), (r = d[1]));
  }
  return { path: r, offset: l };
}
function lg(n, u) {
  var r = mc(n, u.anchor);
  if (!r) return null;
  if (ee.isCollapsed(u)) return { anchor: r, focus: r };
  var l = mc(n, u.focus);
  return l ? { anchor: r, focus: l } : null;
}
function pc(n, u, r) {
  var l = Jt.get(n),
    o =
      l == null
        ? void 0
        : l.find((p) => {
            var { path: C } = p;
            return T.equals(C, u.path);
          });
  if (!o || u.offset <= o.diff.start) return Ke.transform(u, r, { affinity: 'backward' });
  var { diff: c } = o;
  if (u.offset <= c.start + c.text.length) {
    var d = { path: u.path, offset: c.start },
      h = Ke.transform(d, r, { affinity: 'backward' });
    return h ? { path: h.path, offset: h.offset + u.offset - c.start } : null;
  }
  var v = { path: u.path, offset: u.offset - c.text.length + c.end - c.start },
    D = Ke.transform(v, r, { affinity: 'backward' });
  return D
    ? r.type === 'split_node' &&
      T.equals(r.path, u.path) &&
      v.offset < r.position &&
      c.start < r.position
      ? D
      : { path: D.path, offset: D.offset + c.text.length - c.end + c.start }
    : null;
}
function ig(n, u, r) {
  var l = pc(n, u.anchor, r);
  if (!l) return null;
  if (ee.isCollapsed(u)) return { anchor: l, focus: l };
  var o = pc(n, u.focus, r);
  return o ? { anchor: l, focus: o } : null;
}
function pb(n, u) {
  var { path: r, diff: l, id: o } = n;
  switch (u.type) {
    case 'insert_text':
      return !T.equals(u.path, r) || u.offset >= l.end
        ? n
        : u.offset <= l.start
          ? {
              diff: { start: u.text.length + l.start, end: u.text.length + l.end, text: l.text },
              id: o,
              path: r,
            }
          : { diff: { start: l.start, end: l.end + u.text.length, text: l.text }, id: o, path: r };
    case 'remove_text':
      return !T.equals(u.path, r) || u.offset >= l.end
        ? n
        : u.offset + u.text.length <= l.start
          ? {
              diff: { start: l.start - u.text.length, end: l.end - u.text.length, text: l.text },
              id: o,
              path: r,
            }
          : { diff: { start: l.start, end: l.end - u.text.length, text: l.text }, id: o, path: r };
    case 'split_node':
      return !T.equals(u.path, r) || u.position >= l.end
        ? { diff: l, id: o, path: T.transform(r, u, { affinity: 'backward' }) }
        : u.position > l.start
          ? {
              diff: { start: l.start, end: Math.min(u.position, l.end), text: l.text },
              id: o,
              path: r,
            }
          : {
              diff: { start: l.start - u.position, end: l.end - u.position, text: l.text },
              id: o,
              path: T.transform(r, u, { affinity: 'forward' }),
            };
    case 'merge_node':
      return T.equals(u.path, r)
        ? {
            diff: { start: l.start + u.position, end: l.end + u.position, text: l.text },
            id: o,
            path: T.transform(r, u),
          }
        : { diff: l, id: o, path: T.transform(r, u) };
  }
  var c = T.transform(r, u);
  return c ? { diff: l, path: c, id: o } : null;
}
var og = (n, u) => {
    var r = (u.top + u.bottom) / 2;
    return n.top <= r && n.bottom >= r;
  },
  sg = (n, u, r) => {
    var l = Te.toDOMRange(n, u).getBoundingClientRect(),
      o = Te.toDOMRange(n, r).getBoundingClientRect();
    return og(l, o) && og(o, l);
  },
  Cb = (n, u) => {
    var r = E.range(n, ee.end(u)),
      l = Array.from(E.positions(n, { at: u })),
      o = 0,
      c = l.length,
      d = Math.floor(c / 2);
    if (sg(n, E.range(n, l[o]), r)) return E.range(n, l[o], r);
    if (l.length < 2) return E.range(n, l[l.length - 1], r);
    for (; d !== l.length && d !== o;)
      (sg(n, E.range(n, l[d]), r) ? (c = d) : (o = d), (d = Math.floor((o + c) / 2)));
    return E.range(n, l[o], r);
  };
function fg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function cg(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? fg(Object(r), !0).forEach(function (l) {
          kc(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : fg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Eb = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'x-slate-fragment',
      l = u,
      { apply: o, onChange: c, deleteBackward: d, addMark: h, removeMark: v } = l;
    return (
      go.set(l, new WeakMap()),
      (l.addMark = (D, p) => {
        var C, A;
        ((C = qc.get(l)) === null || C === void 0 || C(),
          !Fu.get(l) && (A = Jt.get(l)) !== null && A !== void 0 && A.length && Fu.set(l, null),
          un.delete(l),
          h(D, p));
      }),
      (l.removeMark = (D) => {
        var p;
        (!Fu.get(l) && (p = Jt.get(l)) !== null && p !== void 0 && p.length && Fu.set(l, null),
          un.delete(l),
          v(D));
      }),
      (l.deleteBackward = (D) => {
        if (D !== 'line') return d(D);
        if (l.selection && ee.isCollapsed(l.selection)) {
          var p = E.above(l, { match: (S) => j.isElement(S) && E.isBlock(l, S), at: l.selection });
          if (p) {
            var [, C] = p,
              A = E.range(l, C, l.selection.anchor),
              B = Cb(l, A);
            ee.isCollapsed(B) || le.delete(l, { at: B });
          }
        }
      }),
      (l.apply = (D) => {
        var p = [],
          C = [],
          A = Jt.get(l);
        if (A != null && A.length) {
          var B = A.map((ae) => pb(ae, D)).filter(Boolean);
          Jt.set(l, B);
        }
        var S = tn.get(l);
        S && tn.set(l, ig(l, S, D));
        var w = kn.get(l);
        if (w != null && w.at) {
          var N = Re.isPoint(w == null ? void 0 : w.at) ? pc(l, w.at, D) : ig(l, w.at, D);
          kn.set(l, N ? cg(cg({}, w), {}, { at: N }) : null);
        }
        switch (D.type) {
          case 'insert_text':
          case 'remove_text':
          case 'set_node':
          case 'split_node': {
            p.push(...Ia(l, D.path));
            break;
          }
          case 'set_selection': {
            var b;
            ((b = fl.get(l)) === null || b === void 0 || b.unref(), fl.delete(l));
            break;
          }
          case 'insert_node':
          case 'remove_node': {
            p.push(...Ia(l, T.parent(D.path)));
            break;
          }
          case 'merge_node': {
            var m = T.previous(D.path);
            p.push(...Ia(l, m));
            break;
          }
          case 'move_node': {
            var M = T.common(T.parent(D.path), T.parent(D.newPath));
            p.push(...Ia(l, M));
            var _;
            T.isBefore(D.path, D.newPath)
              ? (p.push(...Ia(l, T.parent(D.path))), (_ = D.newPath))
              : (p.push(...Ia(l, T.parent(D.newPath))), (_ = D.path));
            var K = j.get(u, T.parent(_)),
              ue = Te.findKey(l, K),
              X = E.pathRef(l, T.parent(_));
            C.push([X, ue]);
            break;
          }
        }
        switch ((o(D), D.type)) {
          case 'insert_node':
          case 'remove_node':
          case 'merge_node':
          case 'move_node':
          case 'split_node':
          case 'insert_text':
          case 'remove_text':
          case 'set_selection':
            nr.set(l, !0);
        }
        for (var [ie, se] of p) {
          var [he] = E.node(l, ie);
          fo.set(he, se);
        }
        for (var [de, W] of C) {
          if (de.current) {
            var [Q] = E.node(l, de.current);
            fo.set(Q, W);
          }
          de.unref();
        }
      }),
      (l.setFragmentData = (D) => {
        var { selection: p } = l;
        if (p) {
          var [C, A] = ee.edges(p),
            B = E.void(l, { at: C.path }),
            S = E.void(l, { at: A.path });
          if (!(ee.isCollapsed(p) && !B)) {
            var w = Te.toDOMRange(l, p),
              N = w.cloneContents(),
              b = N.childNodes[0];
            if (
              (N.childNodes.forEach((he) => {
                he.textContent && he.textContent.trim() !== '' && (b = he);
              }),
              S)
            ) {
              var [m] = S,
                M = w.cloneRange(),
                _ = Te.toDOMNode(l, m);
              (M.setEndAfter(_), (N = M.cloneContents()));
            }
            if (
              (B && (b = N.querySelector('[data-slate-spacer]')),
              Array.from(N.querySelectorAll('[data-slate-zero-width]')).forEach((he) => {
                var de = he.getAttribute('data-slate-zero-width') === 'n';
                he.textContent = de
                  ? `
`
                  : '';
              }),
              mm(b))
            ) {
              var K = b.ownerDocument.createElement('span');
              ((K.style.whiteSpace = 'pre'), K.appendChild(b), N.appendChild(K), (b = K));
            }
            var ue = l.getFragment(),
              X = JSON.stringify(ue),
              ie = window.btoa(encodeURIComponent(X));
            (b.setAttribute('data-slate-fragment', ie), D.setData('application/'.concat(r), ie));
            var se = N.ownerDocument.createElement('div');
            return (
              se.appendChild(N),
              se.setAttribute('hidden', 'true'),
              N.ownerDocument.body.appendChild(se),
              D.setData('text/html', se.innerHTML),
              D.setData('text/plain', Cm(se)),
              N.ownerDocument.body.removeChild(se),
              D
            );
          }
        }
      }),
      (l.insertData = (D) => {
        l.insertFragmentData(D) || l.insertTextData(D);
      }),
      (l.insertFragmentData = (D) => {
        var p = D.getData('application/'.concat(r)) || tb(D);
        if (p) {
          var C = decodeURIComponent(window.atob(p)),
            A = JSON.parse(C);
          return (l.insertFragment(A), !0);
        }
        return !1;
      }),
      (l.insertTextData = (D) => {
        var p = D.getData('text/plain');
        if (p) {
          var C = p.split(/\r\n|\r|\n/),
            A = !1;
          for (var B of C) (A && le.splitNodes(l, { always: !0 }), l.insertText(B), (A = !0));
          return !0;
        }
        return !1;
      }),
      (l.onChange = (D) => {
        var p = gc.get(l);
        (p && p(D), c(D));
      }),
      l
    );
  },
  Ia = (n, u) => {
    var r = [];
    for (var [l, o] of E.levels(n, { at: u })) {
      var c = Te.findKey(n, l);
      r.push([o, c]);
    }
    return r;
  },
  yb = 3,
  Ab = {
    bold: 'mod+b',
    compose: ['down', 'left', 'right', 'up', 'backspace', 'enter'],
    moveBackward: 'left',
    moveForward: 'right',
    moveWordBackward: 'ctrl+left',
    moveWordForward: 'ctrl+right',
    deleteBackward: 'shift?+backspace',
    deleteForward: 'shift?+delete',
    extendBackward: 'shift+left',
    extendForward: 'shift+right',
    italic: 'mod+i',
    insertSoftBreak: 'shift+enter',
    splitBlock: 'enter',
    undo: 'mod+z',
  },
  Bb = {
    moveLineBackward: 'opt+up',
    moveLineForward: 'opt+down',
    moveWordBackward: 'opt+left',
    moveWordForward: 'opt+right',
    deleteBackward: ['ctrl+backspace', 'ctrl+h'],
    deleteForward: ['ctrl+delete', 'ctrl+d'],
    deleteLineBackward: 'cmd+shift?+backspace',
    deleteLineForward: ['cmd+shift?+delete', 'ctrl+k'],
    deleteWordBackward: 'opt+shift?+backspace',
    deleteWordForward: 'opt+shift?+delete',
    extendLineBackward: 'opt+shift+up',
    extendLineForward: 'opt+shift+down',
    redo: 'cmd+shift+z',
    transposeCharacter: 'ctrl+t',
  },
  bb = {
    deleteWordBackward: 'ctrl+shift?+backspace',
    deleteWordForward: 'ctrl+shift?+delete',
    redo: ['ctrl+y', 'ctrl+shift+z'],
  },
  ot = (n) => {
    var u = Ab[n],
      r = Bb[n],
      l = bb[n],
      o = u && tc.isHotkey(u),
      c = r && tc.isHotkey(r),
      d = l && tc.isHotkey(l);
    return (h) => !!((o && o(h)) || (rg && c && c(h)) || (!rg && d && d(h)));
  },
  st = {
    isBold: ot('bold'),
    isCompose: ot('compose'),
    isMoveBackward: ot('moveBackward'),
    isMoveForward: ot('moveForward'),
    isDeleteBackward: ot('deleteBackward'),
    isDeleteForward: ot('deleteForward'),
    isDeleteLineBackward: ot('deleteLineBackward'),
    isDeleteLineForward: ot('deleteLineForward'),
    isDeleteWordBackward: ot('deleteWordBackward'),
    isDeleteWordForward: ot('deleteWordForward'),
    isExtendBackward: ot('extendBackward'),
    isExtendForward: ot('extendForward'),
    isExtendLineBackward: ot('extendLineBackward'),
    isExtendLineForward: ot('extendLineForward'),
    isItalic: ot('italic'),
    isMoveLineBackward: ot('moveLineBackward'),
    isMoveLineForward: ot('moveLineForward'),
    isMoveWordBackward: ot('moveWordBackward'),
    isMoveWordForward: ot('moveWordForward'),
    isRedo: ot('redo'),
    isSoftBreak: ot('insertSoftBreak'),
    isSplitBlock: ot('splitBlock'),
    isTransposeCharacter: ot('transposeCharacter'),
    isUndo: ot('undo'),
  };
function Fb(n, u) {
  if (n == null) return {};
  var r = {},
    l = Object.keys(n),
    o,
    c;
  for (c = 0; c < l.length; c++) ((o = l[c]), !(u.indexOf(o) >= 0) && (r[o] = n[o]));
  return r;
}
function dg(n, u) {
  if (n == null) return {};
  var r = Fb(n, u),
    l,
    o;
  if (Object.getOwnPropertySymbols) {
    var c = Object.getOwnPropertySymbols(n);
    for (o = 0; o < c.length; o++)
      ((l = c[o]),
        !(u.indexOf(l) >= 0) && Object.prototype.propertyIsEnumerable.call(n, l) && (r[l] = n[l]));
  }
  return r;
}
var Sb = ['anchor', 'focus'],
  xb = ['anchor', 'focus'];
function hg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Dg(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? hg(Object(r), !0).forEach(function (l) {
          kc(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : hg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Ob = (n, u) =>
    Object.keys(n).length === Object.keys(u).length &&
    Object.keys(n).every((r) => u.hasOwnProperty(r) && n[r] === u[r]),
  xm = (n, u) => {
    var { anchor: r, focus: l } = n,
      o = dg(n, Sb),
      { anchor: c, focus: d } = u,
      h = dg(u, xb);
    return n[rr] === u[rr] && Ob(o, h);
  },
  _c = (n, u) => {
    if (n === u) return !0;
    if (!n || !u || n.length !== u.length) return !1;
    for (var r = 0; r < n.length; r++) {
      var l = n[r],
        o = u[r];
      if (!ee.equals(l, o) || !xm(l, o)) return !1;
    }
    return !0;
  },
  Om = (n, u) => {
    if (n === u) return !0;
    if (!n || !u || n.length !== u.length) return !1;
    for (var r = 0; r < n.length; r++) {
      var l = n[r],
        o = u[r];
      if (l.anchor.offset !== o.anchor.offset || l.focus.offset !== o.focus.offset || !xm(l, o))
        return !1;
    }
    return !0;
  },
  wb = (n, u, r) => {
    var l = Array.from(u.children, () => []);
    if (r.length === 0) return l;
    var o = Te.findPath(n, u),
      c = o.length,
      d = E.range(n, o),
      h = new Array(u.children.length),
      v = (M) => {
        var _ = h[M];
        if (_) return _;
        var K = E.range(n, [...o, M]);
        return ((h[M] = K), K);
      };
    for (var D of r) {
      var p = ee.intersection(d, D);
      if (p)
        for (var [C, A] = ee.edges(p), B = C.path[c], S = A.path[c], w = B; w <= S; w++) {
          var N = l[w];
          if (N) {
            var b = v(w),
              m = ee.intersection(b, D);
            m && N.push(Dg(Dg({}, D), m));
          }
        }
    }
    return l;
  },
  ha = [],
  Tb = function () {
    return ha.some(function (n) {
      return n.activeTargets.length > 0;
    });
  },
  Rb = function () {
    return ha.some(function (n) {
      return n.skippedTargets.length > 0;
    });
  },
  vg = 'ResizeObserver loop completed with undelivered notifications.',
  Mb = function () {
    var n;
    (typeof ErrorEvent == 'function'
      ? (n = new ErrorEvent('error', { message: vg }))
      : ((n = document.createEvent('Event')), n.initEvent('error', !1, !1), (n.message = vg)),
      window.dispatchEvent(n));
  },
  ml;
(function (n) {
  ((n.BORDER_BOX = 'border-box'),
    (n.CONTENT_BOX = 'content-box'),
    (n.DEVICE_PIXEL_CONTENT_BOX = 'device-pixel-content-box'));
})(ml || (ml = {}));
var Da = function (n) {
    return Object.freeze(n);
  },
  jb = (function () {
    function n(u, r) {
      ((this.inlineSize = u), (this.blockSize = r), Da(this));
    }
    return n;
  })(),
  wm = (function () {
    function n(u, r, l, o) {
      return (
        (this.x = u),
        (this.y = r),
        (this.width = l),
        (this.height = o),
        (this.top = this.y),
        (this.left = this.x),
        (this.bottom = this.top + this.height),
        (this.right = this.left + this.width),
        Da(this)
      );
    }
    return (
      (n.prototype.toJSON = function () {
        var u = this,
          r = u.x,
          l = u.y,
          o = u.top,
          c = u.right,
          d = u.bottom,
          h = u.left,
          v = u.width,
          D = u.height;
        return { x: r, y: l, top: o, right: c, bottom: d, left: h, width: v, height: D };
      }),
      (n.fromRect = function (u) {
        return new n(u.x, u.y, u.width, u.height);
      }),
      n
    );
  })(),
  Gc = function (n) {
    return n instanceof SVGElement && 'getBBox' in n;
  },
  Tm = function (n) {
    if (Gc(n)) {
      var u = n.getBBox(),
        r = u.width,
        l = u.height;
      return !r && !l;
    }
    var o = n,
      c = o.offsetWidth,
      d = o.offsetHeight;
    return !(c || d || n.getClientRects().length);
  },
  gg = function (n) {
    var u;
    if (n instanceof Element) return !0;
    var r =
      (u = n == null ? void 0 : n.ownerDocument) === null || u === void 0 ? void 0 : u.defaultView;
    return !!(r && n instanceof r.Element);
  },
  Nb = function (n) {
    switch (n.tagName) {
      case 'INPUT':
        if (n.type !== 'image') break;
      case 'VIDEO':
      case 'AUDIO':
      case 'EMBED':
      case 'OBJECT':
      case 'CANVAS':
      case 'IFRAME':
      case 'IMG':
        return !0;
    }
    return !1;
  },
  cl = typeof window < 'u' ? window : {},
  Xi = new WeakMap(),
  mg = /auto|scroll/,
  zb = /^tb|vertical/,
  Lb = /msie|trident/i.test(cl.navigator && cl.navigator.userAgent),
  Ru = function (n) {
    return parseFloat(n || '0');
  },
  ar = function (n, u, r) {
    return (
      n === void 0 && (n = 0),
      u === void 0 && (u = 0),
      r === void 0 && (r = !1),
      new jb((r ? u : n) || 0, (r ? n : u) || 0)
    );
  },
  pg = Da({
    devicePixelContentBoxSize: ar(),
    borderBoxSize: ar(),
    contentBoxSize: ar(),
    contentRect: new wm(0, 0, 0, 0),
  }),
  Rm = function (n, u) {
    if ((u === void 0 && (u = !1), Xi.has(n) && !u)) return Xi.get(n);
    if (Tm(n)) return (Xi.set(n, pg), pg);
    var r = getComputedStyle(n),
      l = Gc(n) && n.ownerSVGElement && n.getBBox(),
      o = !Lb && r.boxSizing === 'border-box',
      c = zb.test(r.writingMode || ''),
      d = !l && mg.test(r.overflowY || ''),
      h = !l && mg.test(r.overflowX || ''),
      v = l ? 0 : Ru(r.paddingTop),
      D = l ? 0 : Ru(r.paddingRight),
      p = l ? 0 : Ru(r.paddingBottom),
      C = l ? 0 : Ru(r.paddingLeft),
      A = l ? 0 : Ru(r.borderTopWidth),
      B = l ? 0 : Ru(r.borderRightWidth),
      S = l ? 0 : Ru(r.borderBottomWidth),
      w = l ? 0 : Ru(r.borderLeftWidth),
      N = C + D,
      b = v + p,
      m = w + B,
      M = A + S,
      _ = h ? n.offsetHeight - M - n.clientHeight : 0,
      K = d ? n.offsetWidth - m - n.clientWidth : 0,
      ue = o ? N + m : 0,
      X = o ? b + M : 0,
      ie = l ? l.width : Ru(r.width) - ue - K,
      se = l ? l.height : Ru(r.height) - X - _,
      he = ie + N + K + m,
      de = se + b + _ + M,
      W = Da({
        devicePixelContentBoxSize: ar(
          Math.round(ie * devicePixelRatio),
          Math.round(se * devicePixelRatio),
          c,
        ),
        borderBoxSize: ar(he, de, c),
        contentBoxSize: ar(ie, se, c),
        contentRect: new wm(C, v, ie, se),
      });
    return (Xi.set(n, W), W);
  },
  Mm = function (n, u, r) {
    var l = Rm(n, r),
      o = l.borderBoxSize,
      c = l.contentBoxSize,
      d = l.devicePixelContentBoxSize;
    switch (u) {
      case ml.DEVICE_PIXEL_CONTENT_BOX:
        return d;
      case ml.BORDER_BOX:
        return o;
      default:
        return c;
    }
  },
  Hb = (function () {
    function n(u) {
      var r = Rm(u);
      ((this.target = u),
        (this.contentRect = r.contentRect),
        (this.borderBoxSize = Da([r.borderBoxSize])),
        (this.contentBoxSize = Da([r.contentBoxSize])),
        (this.devicePixelContentBoxSize = Da([r.devicePixelContentBoxSize])));
    }
    return n;
  })(),
  jm = function (n) {
    if (Tm(n)) return 1 / 0;
    for (var u = 0, r = n.parentNode; r;) ((u += 1), (r = r.parentNode));
    return u;
  },
  Ub = function () {
    var n = 1 / 0,
      u = [];
    ha.forEach(function (d) {
      if (d.activeTargets.length !== 0) {
        var h = [];
        (d.activeTargets.forEach(function (D) {
          var p = new Hb(D.target),
            C = jm(D.target);
          (h.push(p), (D.lastReportedSize = Mm(D.target, D.observedBox)), C < n && (n = C));
        }),
          u.push(function () {
            d.callback.call(d.observer, h, d.observer);
          }),
          d.activeTargets.splice(0, d.activeTargets.length));
      }
    });
    for (var r = 0, l = u; r < l.length; r++) {
      var o = l[r];
      o();
    }
    return n;
  },
  Cg = function (n) {
    ha.forEach(function (r) {
      (r.activeTargets.splice(0, r.activeTargets.length),
        r.skippedTargets.splice(0, r.skippedTargets.length),
        r.observationTargets.forEach(function (o) {
          o.isActive() && (jm(o.target) > n ? r.activeTargets.push(o) : r.skippedTargets.push(o));
        }));
    });
  },
  kb = function () {
    var n = 0;
    for (Cg(n); Tb();) ((n = Ub()), Cg(n));
    return (Rb() && Mb(), n > 0);
  },
  ac,
  Nm = [],
  qb = function () {
    return Nm.splice(0).forEach(function (n) {
      return n();
    });
  },
  _b = function (n) {
    if (!ac) {
      var u = 0,
        r = document.createTextNode(''),
        l = { characterData: !0 };
      (new MutationObserver(function () {
        return qb();
      }).observe(r, l),
        (ac = function () {
          r.textContent = ''.concat(u ? u-- : u++);
        }));
    }
    (Nm.push(n), ac());
  },
  Gb = function (n) {
    _b(function () {
      requestAnimationFrame(n);
    });
  },
  no = 0,
  Yb = function () {
    return !!no;
  },
  Vb = 250,
  Pb = { attributes: !0, characterData: !0, childList: !0, subtree: !0 },
  Eg = [
    'resize',
    'load',
    'transitionend',
    'animationend',
    'animationstart',
    'animationiteration',
    'keyup',
    'keydown',
    'mouseup',
    'mousedown',
    'mouseover',
    'mouseout',
    'blur',
    'focus',
  ],
  yg = function (n) {
    return (n === void 0 && (n = 0), Date.now() + n);
  },
  rc = !1,
  Kb = (function () {
    function n() {
      var u = this;
      ((this.stopped = !0),
        (this.listener = function () {
          return u.schedule();
        }));
    }
    return (
      (n.prototype.run = function (u) {
        var r = this;
        if ((u === void 0 && (u = Vb), !rc)) {
          rc = !0;
          var l = yg(u);
          Gb(function () {
            var o = !1;
            try {
              o = kb();
            } finally {
              if (((rc = !1), (u = l - yg()), !Yb())) return;
              o ? r.run(1e3) : u > 0 ? r.run(u) : r.start();
            }
          });
        }
      }),
      (n.prototype.schedule = function () {
        (this.stop(), this.run());
      }),
      (n.prototype.observe = function () {
        var u = this,
          r = function () {
            return u.observer && u.observer.observe(document.body, Pb);
          };
        document.body ? r() : cl.addEventListener('DOMContentLoaded', r);
      }),
      (n.prototype.start = function () {
        var u = this;
        this.stopped &&
          ((this.stopped = !1),
          (this.observer = new MutationObserver(this.listener)),
          this.observe(),
          Eg.forEach(function (r) {
            return cl.addEventListener(r, u.listener, !0);
          }));
      }),
      (n.prototype.stop = function () {
        var u = this;
        this.stopped ||
          (this.observer && this.observer.disconnect(),
          Eg.forEach(function (r) {
            return cl.removeEventListener(r, u.listener, !0);
          }),
          (this.stopped = !0));
      }),
      n
    );
  })(),
  Cc = new Kb(),
  Ag = function (n) {
    (!no && n > 0 && Cc.start(), (no += n), !no && Cc.stop());
  },
  Xb = function (n) {
    return !Gc(n) && !Nb(n) && getComputedStyle(n).display === 'inline';
  },
  Qb = (function () {
    function n(u, r) {
      ((this.target = u),
        (this.observedBox = r || ml.CONTENT_BOX),
        (this.lastReportedSize = { inlineSize: 0, blockSize: 0 }));
    }
    return (
      (n.prototype.isActive = function () {
        var u = Mm(this.target, this.observedBox, !0);
        return (
          Xb(this.target) && (this.lastReportedSize = u),
          this.lastReportedSize.inlineSize !== u.inlineSize ||
            this.lastReportedSize.blockSize !== u.blockSize
        );
      }),
      n
    );
  })(),
  Zb = (function () {
    function n(u, r) {
      ((this.activeTargets = []),
        (this.skippedTargets = []),
        (this.observationTargets = []),
        (this.observer = u),
        (this.callback = r));
    }
    return n;
  })(),
  Qi = new WeakMap(),
  Bg = function (n, u) {
    for (var r = 0; r < n.length; r += 1) if (n[r].target === u) return r;
    return -1;
  },
  Zi = (function () {
    function n() {}
    return (
      (n.connect = function (u, r) {
        var l = new Zb(u, r);
        Qi.set(u, l);
      }),
      (n.observe = function (u, r, l) {
        var o = Qi.get(u),
          c = o.observationTargets.length === 0;
        Bg(o.observationTargets, r) < 0 &&
          (c && ha.push(o), o.observationTargets.push(new Qb(r, l && l.box)), Ag(1), Cc.schedule());
      }),
      (n.unobserve = function (u, r) {
        var l = Qi.get(u),
          o = Bg(l.observationTargets, r),
          c = l.observationTargets.length === 1;
        o >= 0 && (c && ha.splice(ha.indexOf(l), 1), l.observationTargets.splice(o, 1), Ag(-1));
      }),
      (n.disconnect = function (u) {
        var r = this,
          l = Qi.get(u);
        (l.observationTargets.slice().forEach(function (o) {
          return r.unobserve(u, o.target);
        }),
          l.activeTargets.splice(0, l.activeTargets.length));
      }),
      n
    );
  })(),
  $b = (function () {
    function n(u) {
      if (arguments.length === 0)
        throw new TypeError(
          "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.",
        );
      if (typeof u != 'function')
        throw new TypeError(
          "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.",
        );
      Zi.connect(this, u);
    }
    return (
      (n.prototype.observe = function (u, r) {
        if (arguments.length === 0)
          throw new TypeError(
            "Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.",
          );
        if (!gg(u))
          throw new TypeError(
            "Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element",
          );
        Zi.observe(this, u, r);
      }),
      (n.prototype.unobserve = function (u) {
        if (arguments.length === 0)
          throw new TypeError(
            "Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.",
          );
        if (!gg(u))
          throw new TypeError(
            "Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element",
          );
        Zi.unobserve(this, u);
      }),
      (n.prototype.disconnect = function () {
        Zi.disconnect(this);
      }),
      (n.toString = function () {
        return 'function ResizeObserver () { [polyfill code] }';
      }),
      n
    );
  })();
function Wb(n, u) {
  if (n == null) return {};
  var r = {},
    l = Object.keys(n),
    o,
    c;
  for (c = 0; c < l.length; c++) ((o = l[c]), !(u.indexOf(o) >= 0) && (r[o] = n[o]));
  return r;
}
function co(n, u) {
  if (n == null) return {};
  var r = Wb(n, u),
    l,
    o;
  if (Object.getOwnPropertySymbols) {
    var c = Object.getOwnPropertySymbols(n);
    for (o = 0; o < c.length; o++)
      ((l = c[o]),
        !(u.indexOf(l) >= 0) && Object.prototype.propertyIsEnumerable.call(n, l) && (r[l] = n[l]));
  }
  return r;
}
function pl(n) {
  '@babel/helpers - typeof';
  return (
    (pl =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (u) {
            return typeof u;
          }
        : function (u) {
            return u &&
              typeof Symbol == 'function' &&
              u.constructor === Symbol &&
              u !== Symbol.prototype
              ? 'symbol'
              : typeof u;
          }),
    pl(n)
  );
}
function Jb(n, u) {
  if (pl(n) !== 'object' || n === null) return n;
  var r = n[Symbol.toPrimitive];
  if (r !== void 0) {
    var l = r.call(n, u);
    if (pl(l) !== 'object') return l;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (u === 'string' ? String : Number)(n);
}
function Ib(n) {
  var u = Jb(n, 'string');
  return pl(u) === 'symbol' ? u : String(u);
}
function rt(n, u, r) {
  return (
    (u = Ib(u)),
    u in n
      ? Object.defineProperty(n, u, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (n[u] = r),
    n
  );
}
var Yc = F.createContext(null),
  zu = () => {
    var n = F.useContext(Yc);
    if (!n)
      throw new Error(
        "The `useSlateStatic` hook must be used inside the <Slate> component's context.",
      );
    return n;
  },
  ce = Te;
function bg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function $i(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? bg(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : bg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var e2 = 25,
  t2 = 200,
  u2 = function () {},
  n2 = (n) => (n == null ? void 0 : n.constructor.name) === 'DataTransfer';
function a2(n) {
  var { editor: u, scheduleOnDOMSelectionChange: r, onDOMSelectionChange: l } = n,
    o = !1,
    c = null,
    d = null,
    h = null,
    v = 0,
    D = !1,
    p = () => {
      var W = tn.get(u);
      if ((tn.delete(u), W)) {
        var { selection: Q } = u,
          ae = lg(u, W);
        ae && (!Q || !ee.equals(ae, Q)) && le.select(u, ae);
      }
    },
    C = () => {
      var W = kn.get(u);
      if ((kn.delete(u), !!W)) {
        if (W.at) {
          var Q = Re.isPoint(W.at) ? mc(u, W.at) : lg(u, W.at);
          if (!Q) return;
          var ae = E.range(u, Q);
          (!u.selection || !ee.equals(u.selection, ae)) && le.select(u, Q);
        }
        W.run();
      }
    },
    A = () => {
      if ((d && (clearTimeout(d), (d = null)), h && (clearTimeout(h), (h = null)), !_() && !M())) {
        p();
        return;
      }
      (o || ((o = !0), setTimeout(() => (o = !1))), M() && (o = 'action'));
      var W = u.selection && E.rangeRef(u, u.selection, { affinity: 'forward' });
      (un.set(u, u.marks), u2('flush', kn.get(u), Jt.get(u)));
      for (var Q = _(), ae; (ae = (ne = Jt.get(u)) === null || ne === void 0 ? void 0 : ne[0]);) {
        var ne,
          L,
          V = Fu.get(u);
        (V !== void 0 && (Fu.delete(u), (u.marks = V)), V && D === !1 && (D = null));
        var De = mb(ae);
        ((!u.selection || !ee.equals(u.selection, De)) && le.select(u, De),
          ae.diff.text ? E.insertText(u, ae.diff.text) : E.deleteFragment(u),
          Jt.set(
            u,
            (L = Jt.get(u)) === null || L === void 0
              ? void 0
              : L.filter((x) => {
                  var { id: Y } = x;
                  return Y !== ae.id;
                }),
          ),
          hb(u, ae) ||
            ((Q = !1),
            kn.delete(u),
            un.delete(u),
            (o = 'action'),
            tn.delete(u),
            r.cancel(),
            l.cancel(),
            W == null || W.unref()));
      }
      var ve = W == null ? void 0 : W.unref();
      if (
        (ve && !tn.get(u) && (!u.selection || !ee.equals(ve, u.selection)) && le.select(u, ve), M())
      ) {
        C();
        return;
      }
      (Q && r(), r.flush(), l.flush(), p());
      var pe = un.get(u);
      (un.delete(u), pe !== void 0 && ((u.marks = pe), u.onChange()));
    },
    B = (W) => {
      (c && clearTimeout(c),
        (c = setTimeout(() => {
          (fa.set(u, !1), A());
        }, e2)));
    },
    S = (W) => {
      (fa.set(u, !0), c && (clearTimeout(c), (c = null)));
    },
    w = function () {
      var Q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1,
        ae = Dc.get(u);
      if (ae) {
        if (_() || Q) {
          ae.style.display = 'none';
          return;
        }
        ae.style.removeProperty('display');
      }
    },
    N = (W, Q) => {
      var ae,
        ne = (ae = Jt.get(u)) !== null && ae !== void 0 ? ae : [];
      Jt.set(u, ne);
      var L = j.leaf(u, W),
        V = ne.findIndex((pe) => T.equals(pe.path, W));
      if (V < 0) {
        var De = Sm(L.text, Q);
        (De && ne.push({ path: W, diff: Q, id: v++ }), w());
        return;
      }
      var ve = gb(L.text, ne[V].diff, Q);
      if (!ve) {
        (ne.splice(V, 1), w());
        return;
      }
      ne[V] = $i($i({}, ne[V]), {}, { diff: ve });
    },
    b = function (Q) {
      var { at: ae } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      ((D = !1),
        tn.delete(u),
        r.cancel(),
        l.cancel(),
        M() && A(),
        kn.set(u, { at: ae, run: Q }),
        (h = setTimeout(A)));
    },
    m = (W) => {
      var Q;
      if ((d && (clearTimeout(d), (d = null)), !nr.get(u))) {
        var { inputType: ae } = W,
          ne = null,
          L = W.dataTransfer || W.data || void 0;
        D !== !1 && ae !== 'insertText' && ae !== 'insertCompositionText' && (D = !1);
        var [V] = W.getTargetRanges();
        V && (ne = ce.toSlateRange(u, V, { exactMatch: !1, suppressThrow: !0 }));
        var De = ce.getWindow(u),
          ve = De.getSelection();
        if (
          (!ne &&
            ve &&
            ((V = ve), (ne = ce.toSlateRange(u, ve, { exactMatch: !1, suppressThrow: !0 }))),
          (ne = (Q = ne) !== null && Q !== void 0 ? Q : u.selection),
          !!ne)
        ) {
          var pe = !0;
          if (ae.startsWith('delete')) {
            var x = ae.endsWith('Backward') ? 'backward' : 'forward',
              [Y, Z] = ee.edges(ne),
              [J, ge] = E.leaf(u, Y.path);
            if (ee.isExpanded(ne) && J.text.length === Y.offset && Z.offset === 0) {
              var Ae = E.next(u, { at: Y.path, match: j.isText });
              Ae &&
                T.equals(Ae[1], Z.path) &&
                (x === 'backward'
                  ? ((ne = { anchor: Z, focus: Z }), (Y = Z), ([J, ge] = Ae))
                  : ((ne = { anchor: Y, focus: Y }), (Z = Y)));
            }
            var Oe = { text: '', start: Y.offset, end: Z.offset },
              Xe = Jt.get(u),
              Ne = Xe == null ? void 0 : Xe.find((lu) => T.equals(lu.path, ge)),
              z = Ne ? [Ne.diff, Oe] : [Oe],
              oe = Fm(J.text, ...z);
            if ((oe.length === 0 && (pe = !1), ee.isExpanded(ne))) {
              if (pe && T.equals(ne.anchor.path, ne.focus.path)) {
                var re = { path: ne.anchor.path, offset: Y.offset },
                  fe = E.range(u, re, re);
                return (X(fe), N(ne.anchor.path, { text: '', end: Z.offset, start: Y.offset }));
              }
              return b(() => E.deleteFragment(u, { direction: x }), { at: ne });
            }
          }
          switch (ae) {
            case 'deleteByComposition':
            case 'deleteByCut':
            case 'deleteByDrag':
              return b(() => E.deleteFragment(u), { at: ne });
            case 'deleteContent':
            case 'deleteContentForward': {
              var { anchor: Ee } = ne;
              if (pe && ee.isCollapsed(ne)) {
                var be = j.leaf(u, Ee.path);
                if (Ee.offset < be.text.length)
                  return N(Ee.path, { text: '', start: Ee.offset, end: Ee.offset + 1 });
              }
              return b(() => E.deleteForward(u), { at: ne });
            }
            case 'deleteContentBackward': {
              var $e,
                { anchor: ut } = ne,
                _e = hc(V) ? V.isCollapsed : !!(($e = V) !== null && $e !== void 0 && $e.collapsed);
              return pe && _e && ee.isCollapsed(ne) && ut.offset > 0
                ? N(ut.path, { text: '', start: ut.offset - 1, end: ut.offset })
                : b(() => E.deleteBackward(u), { at: ne });
            }
            case 'deleteEntireSoftLine':
              return b(
                () => {
                  (E.deleteBackward(u, { unit: 'line' }), E.deleteForward(u, { unit: 'line' }));
                },
                { at: ne },
              );
            case 'deleteHardLineBackward':
              return b(() => E.deleteBackward(u, { unit: 'block' }), { at: ne });
            case 'deleteSoftLineBackward':
              return b(() => E.deleteBackward(u, { unit: 'line' }), { at: ne });
            case 'deleteHardLineForward':
              return b(() => E.deleteForward(u, { unit: 'block' }), { at: ne });
            case 'deleteSoftLineForward':
              return b(() => E.deleteForward(u, { unit: 'line' }), { at: ne });
            case 'deleteWordBackward':
              return b(() => E.deleteBackward(u, { unit: 'word' }), { at: ne });
            case 'deleteWordForward':
              return b(() => E.deleteForward(u, { unit: 'word' }), { at: ne });
            case 'insertLineBreak':
              return b(() => E.insertSoftBreak(u), { at: ne });
            case 'insertParagraph':
              return b(() => E.insertBreak(u), { at: ne });
            case 'insertCompositionText':
            case 'deleteCompositionText':
            case 'insertFromComposition':
            case 'insertFromDrop':
            case 'insertFromPaste':
            case 'insertFromYank':
            case 'insertReplacementText':
            case 'insertText': {
              if (n2(L)) return b(() => ce.insertData(u, L), { at: ne });
              var ze = L ?? '';
              if (
                (Fu.get(u) && (ze = ze.replace('\uFEFF', '')),
                ae === 'insertText' && /.*\n.*\n$/.test(ze) && (ze = ze.slice(0, -1)),
                ze.includes(`
`))
              )
                return b(
                  () => {
                    var lu = ze.split(`
`);
                    lu.forEach((Vt, St) => {
                      (Vt && E.insertText(u, Vt), St !== lu.length - 1 && E.insertSoftBreak(u));
                    });
                  },
                  { at: ne },
                );
              if (T.equals(ne.anchor.path, ne.focus.path)) {
                var [We, Et] = ee.edges(ne),
                  Ve = { start: We.offset, end: Et.offset, text: ze };
                if (ze && D && ae === 'insertCompositionText') {
                  var Gt = D.start + D.text.search(/\S|$/),
                    ct = Ve.start + Ve.text.search(/\S|$/);
                  ct === Gt + 1 && Ve.end === D.start + D.text.length
                    ? ((Ve.start -= 1), (D = null), he())
                    : (D = !1);
                } else
                  ae === 'insertText'
                    ? D === null
                      ? (D = Ve)
                      : D && ee.isCollapsed(ne) && D.end + D.text.length === We.offset
                        ? (D = $i($i({}, D), {}, { text: D.text + ze }))
                        : (D = !1)
                    : (D = !1);
                if (pe) {
                  var cn = u.selection;
                  if ((N(We.path, Ve), cn)) {
                    var Yt = { path: We.path, offset: We.offset + ze.length };
                    b(
                      () => {
                        le.select(u, { anchor: Yt, focus: Yt });
                      },
                      { at: Yt },
                    );
                  }
                  return;
                }
              }
              return b(() => E.insertText(u, ze), { at: ne });
            }
          }
        }
      }
    },
    M = () => !!kn.get(u),
    _ = () => {
      var W;
      return !!((W = Jt.get(u)) !== null && W !== void 0 && W.length);
    },
    K = () => M() || _(),
    ue = () => o,
    X = (W) => {
      (tn.set(u, W), d && (clearTimeout(d), (d = null)));
      var { selection: Q } = u;
      if (W) {
        var ae = !Q || !T.equals(Q.anchor.path, W.anchor.path),
          ne = !Q || !T.equals(Q.anchor.path.slice(0, -1), W.anchor.path.slice(0, -1));
        (((ae && D) || ne) && (D = !1), (ae || _()) && (d = setTimeout(A, t2)));
      }
    },
    ie = () => {
      (M() || !_()) && A();
    },
    se = (W) => {
      _() || (w(!0), setTimeout(w));
    },
    he = () => {
      M() || (h = setTimeout(A));
    },
    de = (W) => {
      if (!(_() || M()) && W.some((ae) => Hc(u, ae, W))) {
        var Q;
        (Q = Bm.get(u)) === null || Q === void 0 || Q();
      }
    };
  return {
    flush: A,
    scheduleFlush: he,
    hasPendingDiffs: _,
    hasPendingAction: M,
    hasPendingChanges: K,
    isFlushing: ue,
    handleUserSelect: X,
    handleCompositionEnd: B,
    handleCompositionStart: S,
    handleDOMBeforeInput: m,
    handleKeyDown: se,
    handleDomMutations: de,
    handleInput: ie,
  };
}
function r2() {
  var n = F.useRef(!1);
  return (
    F.useEffect(
      () => (
        (n.current = !0),
        () => {
          n.current = !1;
        }
      ),
      [],
    ),
    n.current
  );
}
var ln = uo ? F.useLayoutEffect : F.useEffect;
function l2(n, u, r) {
  var [l] = F.useState(() => new MutationObserver(u));
  (ln(() => {
    l.takeRecords();
  }),
    F.useEffect(() => {
      if (!n.current) throw new Error('Failed to attach MutationObserver, `node` is undefined');
      return (l.observe(n.current, r), () => l.disconnect());
    }, [l, n, r]));
}
var i2 = ['node'];
function Fg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function o2(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Fg(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Fg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var s2 = { subtree: !0, childList: !0, characterData: !0 },
  f2 = Ut
    ? (n) => {
        var { node: u } = n,
          r = co(n, i2);
        if (!Ut) return null;
        var l = zu(),
          o = r2(),
          [c] = F.useState(() => a2(o2({ editor: l }, r)));
        return (l2(u, c.handleDomMutations, s2), qc.set(l, c.scheduleFlush), o && c.flush(), c);
      }
    : () => null;
function Sg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function c2(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Sg(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Sg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var d2 = (n) => {
    var { isLast: u, leaf: r, parent: l, text: o } = n,
      c = zu(),
      d = ce.findPath(c, o),
      h = T.parent(d),
      v = !!r[bm];
    return c.isVoid(l)
      ? xe.createElement(lc, { length: j.string(l).length })
      : r.text === '' &&
          l.children[l.children.length - 1] === o &&
          !c.isInline(l) &&
          E.string(c, h) === ''
        ? xe.createElement(lc, { isLineBreak: !0, isMarkPlaceholder: v })
        : r.text === ''
          ? xe.createElement(lc, { isMarkPlaceholder: v })
          : u &&
              r.text.slice(-1) ===
                `
`
            ? xe.createElement(xg, { isTrailing: !0, text: r.text })
            : xe.createElement(xg, { text: r.text });
  },
  xg = (n) => {
    var { text: u, isTrailing: r = !1 } = n,
      l = F.useRef(null),
      o = () =>
        ''.concat(u ?? '').concat(
          r
            ? `
`
            : '',
        ),
      [c] = F.useState(o);
    return (
      ln(() => {
        var d = o();
        l.current && l.current.textContent !== d && (l.current.textContent = d);
      }),
      xe.createElement(h2, { ref: l }, c)
    );
  },
  h2 = F.memo(
    F.forwardRef((n, u) =>
      xe.createElement('span', { 'data-slate-string': !0, ref: u }, n.children),
    ),
  ),
  lc = (n) => {
    var { length: u = 0, isLineBreak: r = !1, isMarkPlaceholder: l = !1 } = n,
      o = { 'data-slate-zero-width': r ? 'n' : 'z', 'data-slate-length': u };
    return (
      l && (o['data-slate-mark-placeholder'] = !0),
      xe.createElement(
        'span',
        c2({}, o),
        !Ut || !r ? '\uFEFF' : null,
        r ? xe.createElement('br', null) : null,
      )
    );
  };
function Og(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function zm(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Og(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Og(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var D2 = Ut ? 300 : 0;
function v2(n, u) {
  n.current && (n.current.disconnect(), u && (n.current = null));
}
function wg(n) {
  n.current && (clearTimeout(n.current), (n.current = null));
}
var g2 = (n) => xe.createElement(C2, zm({}, n)),
  m2 = (n) => {
    var {
        leaf: u,
        isLast: r,
        text: l,
        parent: o,
        renderPlaceholder: c,
        renderLeaf: d = g2,
        leafPosition: h,
      } = n,
      v = zu(),
      D = F.useRef(null),
      p = F.useRef(null),
      [C, A] = F.useState(!1),
      B = F.useRef(null),
      S = F.useCallback(
        (M) => {
          if ((v2(D, M == null), M == null)) {
            var _;
            (Dc.delete(v), (_ = u.onPlaceholderResize) === null || _ === void 0 || _.call(u, null));
          } else {
            if ((Dc.set(v, M), !D.current)) {
              var K = window.ResizeObserver || $b;
              D.current = new K(() => {
                var ue;
                (ue = u.onPlaceholderResize) === null || ue === void 0 || ue.call(u, M);
              });
            }
            (D.current.observe(M), (p.current = M));
          }
        },
        [p, u, v],
      ),
      w = xe.createElement(d2, { isLast: r, leaf: u, parent: o, text: l }),
      N = !!u[rr];
    if (
      (F.useEffect(
        () => (
          N
            ? B.current ||
              (B.current = setTimeout(() => {
                (A(!0), (B.current = null));
              }, D2))
            : (wg(B), A(!1)),
          () => wg(B)
        ),
        [N, A],
      ),
      N && C)
    ) {
      var b = {
        children: u.placeholder,
        attributes: {
          'data-slate-placeholder': !0,
          style: {
            position: 'absolute',
            top: 0,
            pointerEvents: 'none',
            width: '100%',
            maxWidth: '100%',
            display: 'block',
            opacity: '0.333',
            userSelect: 'none',
            textDecoration: 'none',
            WebkitUserModify: sa ? 'inherit' : void 0,
          },
          contentEditable: !1,
          ref: S,
        },
      };
      w = xe.createElement(xe.Fragment, null, w, c(b));
    }
    var m = { 'data-slate-leaf': !0 };
    return d({ attributes: m, children: w, leaf: u, text: l, leafPosition: h });
  },
  p2 = xe.memo(
    m2,
    (n, u) =>
      u.parent === n.parent &&
      u.isLast === n.isLast &&
      u.renderLeaf === n.renderLeaf &&
      u.renderPlaceholder === n.renderPlaceholder &&
      u.text === n.text &&
      nn.equals(u.leaf, n.leaf) &&
      u.leaf[rr] === n.leaf[rr],
  ),
  C2 = (n) => {
    var { attributes: u, children: r } = n;
    return xe.createElement('span', zm({}, u), r);
  };
function E2(n, u) {
  var [, r] = F.useReducer((D) => D + 1, 0),
    l = F.useRef(),
    o = F.useRef(() => null),
    c = F.useRef(null),
    d;
  try {
    if (n !== o.current || l.current) {
      var h = n();
      u(c.current, h) ? (d = c.current) : (d = h);
    } else d = c.current;
  } catch (D) {
    throw (
      l.current &&
        y2(D) &&
        (D.message += `
The error may be correlated with this previous error:
`.concat(
          l.current.stack,
          `

`,
        )),
      D
    );
  }
  ((o.current = n), (c.current = d), (l.current = void 0));
  var v = F.useCallback(() => {
    try {
      var D = o.current();
      if (u(c.current, D)) return;
      c.current = D;
    } catch (p) {
      p instanceof Error ? (l.current = p) : (l.current = new Error(String(p)));
    }
    r();
  }, []);
  return [d, v];
}
function y2(n) {
  return n instanceof Error;
}
var Lm = F.createContext({}),
  Hm = (n, u) => {
    var r = zu(),
      { decorate: l, addEventListener: o } = F.useContext(Lm),
      c = () => {
        var D = ce.findPath(r, n);
        return l([n, D]);
      },
      d = j.isText(n) ? Om : _c,
      [h, v] = E2(c, d);
    return (
      ln(() => {
        var D = o(v);
        return (v(), D);
      }, [o, v]),
      F.useMemo(() => [...h, ...u], [h, u])
    );
  },
  A2 = (n) => {
    var [, u] = F.useReducer((h) => h + 1, 0),
      r = F.useRef(new Set()),
      l = F.useRef(!1),
      o = F.useRef(n);
    ln(() => {
      if (((o.current = n), r.current.forEach((h) => h()), !l.current)) {
        l.current = !0;
        return;
      }
      u();
    }, [n]);
    var c = F.useCallback((h) => o.current(h), []),
      d = F.useCallback(
        (h) => (
          r.current.add(h),
          () => {
            r.current.delete(h);
          }
        ),
        [],
      );
    return F.useMemo(() => ({ decorate: c, addEventListener: d }), [c, d]);
  };
function Tg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Um(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Tg(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Tg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var B2 = (n) => xe.createElement(F2, Um({}, n)),
  b2 = (n) => {
    for (
      var {
          decorations: u,
          isLast: r,
          parent: l,
          renderPlaceholder: o,
          renderLeaf: c,
          renderText: d = B2,
          text: h,
        } = n,
        v = zu(),
        D = F.useRef(null),
        p = Hm(h, u),
        C = nn.decorations(h, p),
        A = ce.findKey(v, h),
        B = [],
        S = 0;
      S < C.length;
      S++
    ) {
      var { leaf: w, position: N } = C[S];
      B.push(
        xe.createElement(p2, {
          isLast: r && S === C.length - 1,
          key: ''.concat(A.id, '-').concat(S),
          renderPlaceholder: o,
          leaf: w,
          leafPosition: N,
          text: h,
          parent: l,
          renderLeaf: c,
        }),
      );
    }
    var b = F.useCallback(
        (M) => {
          var _ = go.get(v);
          (M
            ? (_ == null || _.set(A, M), da.set(h, M), gl.set(M, h))
            : (_ == null || _.delete(A), da.delete(h), D.current && gl.delete(D.current)),
            (D.current = M));
        },
        [D, v, A, h],
      ),
      m = { 'data-slate-node': 'text', ref: b };
    return d({ text: h, children: B, attributes: m });
  },
  km = xe.memo(
    b2,
    (n, u) =>
      u.parent === n.parent &&
      u.isLast === n.isLast &&
      u.renderText === n.renderText &&
      u.renderLeaf === n.renderLeaf &&
      u.renderPlaceholder === n.renderPlaceholder &&
      u.text === n.text &&
      Om(u.decorations, n.decorations),
  ),
  F2 = (n) => {
    var { attributes: u, children: r } = n;
    return xe.createElement('span', Um({}, u), r);
  };
function Rg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Ec(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Rg(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Rg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var S2 = (n) => xe.createElement(w2, Ec({}, n)),
  x2 = (n) => {
    var {
        decorations: u,
        element: r,
        renderElement: l = S2,
        renderChunk: o,
        renderPlaceholder: c,
        renderLeaf: d,
        renderText: h,
      } = n,
      v = zu(),
      D = q2(),
      p = v.isInline(r),
      C = Hm(r, u),
      A = ce.findKey(v, r),
      B = F.useCallback(
        (_) => {
          var K = go.get(v);
          _
            ? (K == null || K.set(A, _), da.set(r, _), gl.set(_, r))
            : (K == null || K.delete(A), da.delete(r));
        },
        [v, A, r],
      ),
      S = Gm({
        decorations: C,
        node: r,
        renderElement: l,
        renderChunk: o,
        renderPlaceholder: c,
        renderLeaf: d,
        renderText: h,
      }),
      w = { 'data-slate-node': 'element', ref: B };
    if ((p && (w['data-slate-inline'] = !0), !p && E.hasInlines(v, r))) {
      var N = j.string(r),
        b = dm(N);
      b === 'rtl' && (w.dir = b);
    }
    if (E.isVoid(v, r)) {
      ((w['data-slate-void'] = !0), !D && p && (w.contentEditable = !1));
      var m = p ? 'span' : 'div',
        [[M]] = j.texts(r);
      ((S = xe.createElement(
        m,
        {
          'data-slate-spacer': !0,
          style: { height: '0', color: 'transparent', outline: 'none', position: 'absolute' },
        },
        xe.createElement(km, {
          renderPlaceholder: c,
          decorations: [],
          isLast: !1,
          parent: r,
          text: M,
        }),
      )),
        tr.set(M, 0),
        ol.set(M, r));
    }
    return l({ attributes: w, children: S, element: r });
  },
  O2 = xe.memo(
    x2,
    (n, u) =>
      n.element === u.element &&
      n.renderElement === u.renderElement &&
      n.renderChunk === u.renderChunk &&
      n.renderText === u.renderText &&
      n.renderLeaf === u.renderLeaf &&
      n.renderPlaceholder === u.renderPlaceholder &&
      _c(n.decorations, u.decorations),
  ),
  w2 = (n) => {
    var { attributes: u, children: r, element: l } = n,
      o = zu(),
      c = o.isInline(l) ? 'span' : 'div';
    return xe.createElement(c, Ec(Ec({}, u), {}, { style: { position: 'relative' } }), r);
  };
class T2 {
  constructor(u, r) {
    var { chunkSize: l, debug: o } = r;
    (rt(this, 'root', void 0),
      rt(this, 'chunkSize', void 0),
      rt(this, 'debug', void 0),
      rt(this, 'reachedEnd', void 0),
      rt(this, 'pointerChunk', void 0),
      rt(this, 'pointerIndex', void 0),
      rt(this, 'pointerIndexStack', void 0),
      rt(this, 'cachedPointerNode', void 0),
      (this.root = u),
      (this.chunkSize = l),
      (this.debug = o ?? !1),
      (this.pointerChunk = u),
      (this.pointerIndex = -1),
      (this.pointerIndexStack = []),
      (this.reachedEnd = !1),
      this.validateState());
  }
  readLeaf() {
    if (this.reachedEnd) return null;
    for (;;)
      if (this.pointerIndex + 1 < this.pointerSiblings.length) {
        (this.pointerIndex++, (this.cachedPointerNode = void 0));
        break;
      } else {
        if (this.pointerChunk.type === 'root') return ((this.reachedEnd = !0), null);
        this.exitChunk();
      }
    return (this.validateState(), this.enterChunkUntilLeaf(!1), this.pointerNode);
  }
  returnToPreviousLeaf() {
    if (this.reachedEnd) {
      ((this.reachedEnd = !1), this.enterChunkUntilLeaf(!0));
      return;
    }
    for (;;)
      if (this.pointerIndex >= 1) {
        (this.pointerIndex--, (this.cachedPointerNode = void 0));
        break;
      } else if (this.pointerChunk.type === 'root') {
        this.pointerIndex = -1;
        return;
      } else this.exitChunk();
    (this.validateState(), this.enterChunkUntilLeaf(!0));
  }
  insertBefore(u) {
    (this.returnToPreviousLeaf(), this.insertAfter(u), this.readLeaf());
  }
  insertAfter(u) {
    if (u.length !== 0) {
      for (
        var r = 0, l = 0;
        this.pointerChunk.type === 'chunk' && this.pointerIndex === this.pointerSiblings.length - 1;
      ) {
        var o = this.chunkSize - this.pointerSiblings.length,
          c = Math.min(o, u.length);
        if (c > 0) {
          var d = u.splice(0, c);
          this.rawInsertAfter(d, r);
        }
        (this.exitChunk(), r++);
      }
      if (u.length !== 0) {
        var h = this.savePointer(),
          v = null;
        if (this.readLeaf())
          for (; this.pointerChunk.type === 'chunk' && this.pointerIndex === 0;) {
            var D = this.chunkSize - this.pointerSiblings.length,
              p = Math.min(D, u.length);
            if (p > 0) {
              var C = u.splice(-p, p);
              ((this.pointerIndex = -1),
                (this.cachedPointerNode = void 0),
                this.rawInsertAfter(C, l),
                v || (v = this.savePointer()));
            }
            (this.exitChunk(), l++);
          }
        this.restorePointer(h);
        var A = Math.max(r, l);
        (this.rawInsertAfter(u, A), v && this.restorePointer(v), this.validateState());
      }
    }
  }
  remove() {
    (this.pointerSiblings.splice(this.pointerIndex--, 1),
      (this.cachedPointerNode = void 0),
      this.pointerSiblings.length === 0 && this.pointerChunk.type === 'chunk'
        ? (this.exitChunk(), this.remove())
        : this.invalidateChunk(),
      this.validateState());
  }
  invalidateChunk() {
    for (var u = this.pointerChunk; u.type === 'chunk'; u = u.parent)
      this.root.modifiedChunks.add(u);
  }
  get atStart() {
    return this.pointerChunk.type === 'root' && this.pointerIndex === -1;
  }
  get pointerSiblings() {
    return this.pointerChunk.children;
  }
  getPointerNode() {
    return this.reachedEnd || this.pointerIndex === -1
      ? null
      : this.pointerSiblings[this.pointerIndex];
  }
  get pointerNode() {
    if (this.cachedPointerNode !== void 0) return this.cachedPointerNode;
    var u = this.getPointerNode();
    return ((this.cachedPointerNode = u), u);
  }
  getChunkPath(u) {
    for (var r = [], l = u; l.type === 'chunk'; l = l.parent) {
      var o = l.parent.children.indexOf(l);
      if (o === -1) return null;
      r.unshift(o);
    }
    return r;
  }
  savePointer() {
    if (this.atStart) return 'start';
    if (!this.pointerNode) throw new Error('Cannot save pointer when pointerNode is null');
    return { chunk: this.pointerChunk, node: this.pointerNode };
  }
  restorePointer(u) {
    if (u === 'start') {
      ((this.pointerChunk = this.root),
        (this.pointerIndex = -1),
        (this.pointerIndexStack = []),
        (this.reachedEnd = !1),
        (this.cachedPointerNode = void 0));
      return;
    }
    var { chunk: r, node: l } = u,
      o = r.children.indexOf(l);
    if (o === -1)
      throw new Error('Cannot restore point because saved node is no longer in saved chunk');
    var c = this.getChunkPath(r);
    if (!c)
      throw new Error('Cannot restore point because saved chunk is no longer connected to root');
    ((this.pointerChunk = r),
      (this.pointerIndex = o),
      (this.pointerIndexStack = c),
      (this.reachedEnd = !1),
      (this.cachedPointerNode = l),
      this.validateState());
  }
  enterChunk(u) {
    var r;
    if (((r = this.pointerNode) === null || r === void 0 ? void 0 : r.type) !== 'chunk')
      throw new Error('Cannot enter non-chunk');
    if (
      (this.pointerIndexStack.push(this.pointerIndex),
      (this.pointerChunk = this.pointerNode),
      (this.pointerIndex = u ? this.pointerSiblings.length - 1 : 0),
      (this.cachedPointerNode = void 0),
      this.validateState(),
      this.pointerChunk.children.length === 0)
    )
      throw new Error('Cannot enter empty chunk');
  }
  enterChunkUntilLeaf(u) {
    for (; ((r = this.pointerNode) === null || r === void 0 ? void 0 : r.type) === 'chunk';) {
      var r;
      this.enterChunk(u);
    }
  }
  exitChunk() {
    if (this.pointerChunk.type === 'root') throw new Error('Cannot exit root');
    var u = this.pointerChunk;
    ((this.pointerChunk = u.parent),
      (this.pointerIndex = this.pointerIndexStack.pop()),
      (this.cachedPointerNode = void 0),
      this.validateState());
  }
  rawInsertAfter(u, r) {
    if (u.length !== 0) {
      for (
        var l = (p, C, A) => {
            if (A === 1) return p;
            for (var B = [], S = 0; S < this.chunkSize; S++) {
              var w = p.slice(S * A, (S + 1) * A);
              if (w.length === 0) break;
              var N = { type: 'chunk', key: new ym(), parent: C, children: [] };
              ((N.children = l(w, N, A / this.chunkSize)), B.push(N));
            }
            return B;
          },
          o = this.pointerSiblings.length + u.length,
          c = 0,
          d = this.chunkSize;
        d < o;
        d *= this.chunkSize
      )
        c++;
      var h = Math.max(c, r),
        v = Math.pow(this.chunkSize, h),
        D = l(u, this.pointerChunk, v);
      (this.pointerSiblings.splice(this.pointerIndex + 1, 0, ...D),
        (this.pointerIndex += D.length),
        (this.cachedPointerNode = void 0),
        this.invalidateChunk(),
        this.validateState());
    }
  }
  validateState() {
    if (this.debug) {
      var u = (l) => {
        if (l.type === 'chunk') {
          var { parent: o, children: c } = l;
          if (!o.children.includes(l))
            throw new Error('Debug: Chunk '.concat(l.key.id, ' has an incorrect parent property'));
          c.forEach(u);
        }
      };
      if (
        (this.root.children.forEach(u),
        this.cachedPointerNode !== void 0 && this.cachedPointerNode !== this.getPointerNode())
      )
        throw new Error('Debug: The cached pointer is incorrect and has not been invalidated');
      var r = this.getChunkPath(this.pointerChunk);
      if (!r) throw new Error('Debug: The pointer chunk is not connected to the root');
      if (!T.equals(this.pointerIndexStack, r))
        throw new Error(
          'Debug: The cached index stack ['
            .concat(
              this.pointerIndexStack.join(', '),
              '] does not match the path of the pointer chunk [',
            )
            .concat(r.join(', '), ']'),
        );
    }
  }
}
class R2 {
  constructor(u, r) {
    (rt(this, 'editor', void 0),
      rt(this, 'children', void 0),
      rt(this, 'cachedKeys', void 0),
      rt(this, 'pointerIndex', void 0),
      (this.editor = u),
      (this.children = r),
      (this.cachedKeys = new Array(r.length)),
      (this.pointerIndex = 0));
  }
  read(u) {
    if (u === 1) return [this.children[this.pointerIndex++]];
    var r = this.remaining(u);
    return ((this.pointerIndex += u), r);
  }
  remaining(u) {
    return u === void 0
      ? this.children.slice(this.pointerIndex)
      : this.children.slice(this.pointerIndex, this.pointerIndex + u);
  }
  get reachedEnd() {
    return this.pointerIndex >= this.children.length;
  }
  lookAhead(u, r) {
    var l = this.children.indexOf(u, this.pointerIndex);
    if (l > -1) return l - this.pointerIndex;
    for (var o = this.pointerIndex; o < this.children.length; o++) {
      var c = this.children[o],
        d = this.findKey(c, o);
      if (d === r) return o - this.pointerIndex;
    }
    return -1;
  }
  toChunkLeaves(u, r) {
    return u.map((l, o) => ({ type: 'leaf', node: l, key: this.findKey(l, r + o), index: r + o }));
  }
  findKey(u, r) {
    var l = this.cachedKeys[r];
    if (l) return l;
    var o = ce.findKey(this.editor, u);
    return ((this.cachedKeys[r] = o), o);
  }
}
var M2 = (n, u) => {
  for (
    var {
        chunkTree: r,
        children: l,
        chunkSize: o,
        rerenderChildren: c = [],
        onInsert: d,
        onUpdate: h,
        onIndexChange: v,
        debug: D,
      } = u,
      p = new T2(r, { chunkSize: o, debug: D }),
      C = new R2(n, l),
      A,
      B = function () {
        var b = C.lookAhead(A.node, A.key),
          m = b > 0 && r.movedNodeKeys.has(A.key);
        if (b === -1 || m) return (p.remove(), 1);
        var M = C.pointerIndex,
          _ = C.read(b + 1),
          K = _.pop();
        if (_.length) {
          var ue = C.toChunkLeaves(_, M);
          (p.insertBefore(ue),
            _.forEach((ie, se) => {
              d == null || d(ie, M + se);
            }));
        }
        var X = C.pointerIndex - 1;
        (A.node !== K && ((A.node = K), p.invalidateChunk(), h == null || h(K, X)),
          A.index !== X && ((A.index = X), v == null || v(K, X)),
          c.includes(X) && p.invalidateChunk());
      };
    (A = p.readLeaf());
  )
    B();
  if (!C.reachedEnd) {
    var S = C.remaining(),
      w = C.toChunkLeaves(S, C.pointerIndex);
    (p.returnToPreviousLeaf(),
      p.insertAfter(w),
      S.forEach((N, b) => {
        d == null || d(N, C.pointerIndex + b);
      }));
  }
  r.movedNodeKeys.clear();
};
function Mg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function j2(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Mg(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Mg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var jg = new WeakMap(),
  qm = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      o = ce.findKey(u, r),
      c = jg.get(o);
    return (
      c ||
        ((c = { type: 'root', movedNodeKeys: new Set(), modifiedChunks: new Set(), children: [] }),
        jg.set(o, c)),
      l.reconcile && M2(u, j2({ chunkTree: c, children: r.children }, l.reconcile)),
      c
    );
  };
function Ng(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function N2(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Ng(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Ng(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var z2 = (n) => {
    var { children: u } = n;
    return u;
  },
  _m = (n) => {
    var { root: u, ancestor: r, renderElement: l, renderChunk: o = z2 } = n;
    return r.children.map((c) => {
      if (c.type === 'chunk') {
        var d = c.key.id,
          h = o({
            highest: r === u,
            lowest: c.children.some((D) => D.type === 'leaf'),
            attributes: { 'data-slate-chunk': !0 },
            children: xe.createElement(H2, {
              root: u,
              ancestor: c,
              renderElement: l,
              renderChunk: o,
            }),
          });
        return xe.createElement(F.Fragment, { key: d }, h);
      }
      var v = c.node;
      return l(v, c.index, c.key);
    });
  },
  L2 = (n) => (
    F.useEffect(() => {
      n.root.modifiedChunks.clear();
    }),
    xe.createElement(_m, N2({}, n))
  ),
  H2 = xe.memo(
    _m,
    (n, u) =>
      n.root === u.root &&
      n.renderElement === u.renderElement &&
      n.renderChunk === u.renderChunk &&
      !u.root.modifiedChunks.has(u.ancestor),
  ),
  U2 = F.createContext(null),
  Gm = (n) => {
    var {
        decorations: u,
        node: r,
        renderElement: l,
        renderChunk: o,
        renderPlaceholder: c,
        renderText: d,
        renderLeaf: h,
      } = n,
      v = zu();
    nr.set(v, !1);
    var D = j.isElement(r) && !v.isInline(r),
      p = D && E.hasInlines(v, r),
      C = p ? null : v.getChunkSize(r),
      A = !!C,
      { decorationsByChild: B, childrenToRedecorate: S } = k2(v, r, u);
    A ||
      r.children.forEach((m, M) => {
        (tr.set(m, M), ol.set(m, r));
      });
    var w = F.useCallback(
        (m, M, _) => {
          var K = _ ?? ce.findKey(v, m);
          return xe.createElement(
            U2.Provider,
            { key: 'provider-'.concat(K.id), value: m },
            xe.createElement(O2, {
              decorations: B[M],
              element: m,
              key: K.id,
              renderElement: l,
              renderChunk: o,
              renderPlaceholder: c,
              renderLeaf: h,
              renderText: d,
            }),
          );
        },
        [v, B, l, o, c, h, d],
      ),
      N = (m, M) => {
        var _ = ce.findKey(v, m);
        return xe.createElement(km, {
          decorations: B[M],
          key: _.id,
          isLast: M === r.children.length - 1,
          parent: r,
          renderPlaceholder: c,
          renderLeaf: h,
          renderText: d,
          text: m,
        });
      };
    if (!A) return r.children.map((m, M) => (j.isText(m) ? N(m, M) : w(m, M)));
    var b = qm(v, r, {
      reconcile: {
        chunkSize: C,
        rerenderChildren: S,
        onInsert: (m, M) => {
          (tr.set(m, M), ol.set(m, r));
        },
        onUpdate: (m, M) => {
          (tr.set(m, M), ol.set(m, r));
        },
        onIndexChange: (m, M) => {
          tr.set(m, M);
        },
      },
    });
    return xe.createElement(L2, { root: b, ancestor: b, renderElement: w, renderChunk: o });
  },
  k2 = (n, u, r) => {
    var l = wb(n, u, r),
      o = F.useRef(l).current,
      c = [];
    o.length = l.length;
    for (var d = 0; d < l.length; d++) {
      var h,
        v = l[d],
        D = (h = o[d]) !== null && h !== void 0 ? h : null;
      _c(D, v) || ((o[d] = v), c.push(d));
    }
    return { decorationsByChild: o, childrenToRedecorate: c };
  },
  Ym = F.createContext(!1),
  q2 = () => F.useContext(Ym),
  Vc = F.createContext({});
function _2() {
  var n = F.useRef(new Set()),
    u = F.useRef(new Set()),
    r = F.useCallback(() => {
      n.current.forEach((d) => d());
    }, []),
    l = F.useCallback(() => {
      (u.current.forEach((d) => d()), u.current.clear());
    }, []),
    o = F.useCallback(function (d) {
      var { deferred: h = !1 } =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        v = h ? () => u.current.add(d) : d;
      return (
        n.current.add(v),
        () => {
          n.current.delete(v);
        }
      );
    }, []),
    c = F.useMemo(() => ({ addEventListener: o, flushDeferred: l }), [o, l]);
  return { selectorContext: c, onChange: r };
}
function G2() {
  var { flushDeferred: n } = F.useContext(Vc);
  ln(n);
}
var Vm = () => {
  var { addEventListener: n } = F.useContext(Vc),
    [, u] = F.useReducer((r) => r + 1, 0);
  if (!n)
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  return (ln(() => n(u), [n]), zu());
};
function Y2() {
  var n = zu(),
    u = F.useRef(!1),
    r = F.useRef(0),
    l = F.useCallback(() => {
      if (!u.current) {
        u.current = !0;
        var o = ce.getWindow(n);
        (o.cancelAnimationFrame(r.current),
          (r.current = o.requestAnimationFrame(() => {
            u.current = !1;
          })));
      }
    }, [n]);
  return (
    F.useEffect(() => () => cancelAnimationFrame(r.current), []),
    { receivedUserInput: u, onUserInput: l }
  );
}
var V2 = (n, u) => {
    var r = [],
      l = () => {
        r = [];
      },
      o = (d) => {
        if (u.current) {
          var h = d.filter((v) => Hc(n, v, d));
          r.push(...h);
        }
      };
    function c() {
      r.length > 0 &&
        (r.reverse().forEach((d) => {
          d.type !== 'characterData' &&
            (d.removedNodes.forEach((h) => {
              d.target.insertBefore(h, d.nextSibling);
            }),
            d.addedNodes.forEach((h) => {
              d.target.removeChild(h);
            }));
        }),
        l());
    }
    return { registerMutations: o, restoreDOM: c, clear: l };
  },
  P2 = { subtree: !0, childList: !0, characterData: !0, characterDataOldValue: !0 };
class Pm extends F.Component {
  constructor() {
    (super(...arguments),
      rt(this, 'context', null),
      rt(this, 'manager', null),
      rt(this, 'mutationObserver', null));
  }
  observe() {
    var u,
      { node: r } = this.props;
    if (!r.current) throw new Error('Failed to attach MutationObserver, `node` is undefined');
    (u = this.mutationObserver) === null || u === void 0 || u.observe(r.current, P2);
  }
  componentDidMount() {
    var { receivedUserInput: u } = this.props,
      r = this.context;
    ((this.manager = V2(r, u)),
      (this.mutationObserver = new MutationObserver(this.manager.registerMutations)),
      this.observe());
  }
  getSnapshotBeforeUpdate() {
    var u,
      r,
      l,
      o = (u = this.mutationObserver) === null || u === void 0 ? void 0 : u.takeRecords();
    if (o != null && o.length) {
      var c;
      (c = this.manager) === null || c === void 0 || c.registerMutations(o);
    }
    return (
      (r = this.mutationObserver) === null || r === void 0 || r.disconnect(),
      (l = this.manager) === null || l === void 0 || l.restoreDOM(),
      null
    );
  }
  componentDidUpdate() {
    var u;
    ((u = this.manager) === null || u === void 0 || u.clear(), this.observe());
  }
  componentWillUnmount() {
    var u;
    (u = this.mutationObserver) === null || u === void 0 || u.disconnect();
  }
  render() {
    return this.props.children;
  }
}
rt(Pm, 'contextType', Yc);
var K2 = Ut
    ? Pm
    : (n) => {
        var { children: u } = n;
        return xe.createElement(xe.Fragment, null, u);
      },
  X2 = F.createContext(!1),
  Q2 = [
    'autoFocus',
    'decorate',
    'onDOMBeforeInput',
    'placeholder',
    'readOnly',
    'renderElement',
    'renderChunk',
    'renderLeaf',
    'renderText',
    'renderPlaceholder',
    'scrollSelectionIntoView',
    'style',
    'as',
    'disableDefaultStyles',
  ],
  Z2 = ['text'];
function zg(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (o) {
        return Object.getOwnPropertyDescriptor(n, o).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Mu(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? zg(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : zg(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var $2 = (n) => xe.createElement(xe.Fragment, null, Gm(n)),
  W2 = F.forwardRef((n, u) => {
    var r = F.useCallback((z) => xe.createElement(J2, Mu({}, z)), []),
      {
        autoFocus: l,
        decorate: o = I2,
        onDOMBeforeInput: c,
        placeholder: d,
        readOnly: h = !1,
        renderElement: v,
        renderChunk: D,
        renderLeaf: p,
        renderText: C,
        renderPlaceholder: A = r,
        scrollSelectionIntoView: B = e3,
        style: S = {},
        as: w = 'div',
        disableDefaultStyles: N = !1,
      } = n,
      b = co(n, Q2),
      m = Vm(),
      [M, _] = F.useState(!1),
      K = F.useRef(null),
      ue = F.useRef([]),
      [X, ie] = F.useState(),
      se = F.useRef(!1),
      { onUserInput: he, receivedUserInput: de } = Y2(),
      [, W] = F.useReducer((z) => z + 1, 0);
    (Bm.set(m, W), vc.set(m, h));
    var Q = F.useMemo(
      () => ({
        isDraggingInternally: !1,
        isUpdatingSelection: !1,
        latestElement: null,
        hasMarkPlaceholder: !1,
      }),
      [],
    );
    F.useEffect(() => {
      K.current && l && K.current.focus();
    }, [l]);
    var ae = F.useRef(),
      ne = F.useMemo(
        () =>
          YB(() => {
            if (nr.get(m)) {
              ne();
              return;
            }
            var z = ce.toDOMNode(m, m),
              oe = z.getRootNode();
            if (!se.current && sa && oe instanceof ShadowRoot) {
              se.current = !0;
              var re = ub();
              (re ? document.execCommand('indent') : le.deselect(m), (se.current = !1));
              return;
            }
            var fe = ae.current;
            if (
              (Ut || !ce.isComposing(m)) &&
              (!Q.isUpdatingSelection || (fe != null && fe.isFlushing())) &&
              !Q.isDraggingInternally
            ) {
              var Ee = ce.findDocumentOrShadowRoot(m),
                { activeElement: be } = Ee,
                $e = ce.toDOMNode(m, m),
                ut = il(Ee);
              if ((be === $e ? ((Q.latestElement = be), _n.set(m, !0)) : _n.delete(m), !ut))
                return le.deselect(m);
              var { anchorNode: _e, focusNode: ze } = ut,
                We = ce.hasEditableTarget(m, _e) || ce.isTargetInsideNonReadonlyVoid(m, _e),
                Et = ce.hasTarget(m, ze);
              if (We && Et) {
                var Ve = ce.toSlateRange(m, ut, { exactMatch: !1, suppressThrow: !0 });
                Ve &&
                  (!ce.isComposing(m) &&
                  !(fe != null && fe.hasPendingChanges()) &&
                  !(fe != null && fe.isFlushing())
                    ? le.select(m, Ve)
                    : fe == null || fe.handleUserSelect(Ve));
              }
              h && (!We || !Et) && le.deselect(m);
            }
          }, 100),
        [m, h, Q],
      ),
      L = F.useMemo(() => qB(ne, 0), [ne]);
    ((ae.current = f2({ node: K, onDOMSelectionChange: ne, scheduleOnDOMSelectionChange: L })),
      ln(() => {
        var z, oe, re;
        K.current && (re = Lc(K.current))
          ? (Am.set(m, re), sl.set(m, K.current), da.set(m, K.current), gl.set(K.current, m))
          : da.delete(m);
        var { selection: fe } = m,
          Ee = ce.findDocumentOrShadowRoot(m),
          be = il(Ee);
        if (!(
          !be ||
          !ce.isFocused(m) ||
          ((z = ae.current) !== null && z !== void 0 && z.hasPendingAction())
        )) {
          var $e = (We) => {
            var Et = be.type !== 'None';
            if (!(!fe && !Et)) {
              var Ve = be.focusNode,
                Gt;
              if (er && be.rangeCount > 1) {
                var ct = be.getRangeAt(0),
                  cn = be.getRangeAt(be.rangeCount - 1);
                ct.startContainer === Ve ? (Gt = cn.endContainer) : (Gt = ct.startContainer);
              } else Gt = be.anchorNode;
              var Yt = sl.get(m),
                lu = !1;
              if ((ca(Yt, Gt) && ca(Yt, Ve) && (lu = !0), Et && lu && fe && !We)) {
                var Vt = ce.toSlateRange(m, be, { exactMatch: !0, suppressThrow: !0 });
                if (Vt && ee.equals(Vt, fe)) {
                  var St;
                  if (
                    !Q.hasMarkPlaceholder ||
                    ((St = Gt) !== null &&
                      St !== void 0 &&
                      (St = St.parentElement) !== null &&
                      St !== void 0 &&
                      St.hasAttribute('data-slate-mark-placeholder'))
                  )
                    return;
                }
              }
              if (fe && !ce.hasRange(m, fe)) {
                m.selection = ce.toSlateRange(m, be, { exactMatch: !1, suppressThrow: !0 });
                return;
              }
              Q.isUpdatingSelection = !0;
              var yt = null;
              try {
                yt = fe && ce.toDOMRange(m, fe);
              } catch {}
              return (
                yt
                  ? (ce.isComposing(m) && !Ut
                      ? be.collapseToEnd()
                      : ee.isBackward(fe)
                        ? be.setBaseAndExtent(
                            yt.endContainer,
                            yt.endOffset,
                            yt.startContainer,
                            yt.startOffset,
                          )
                        : be.setBaseAndExtent(
                            yt.startContainer,
                            yt.startOffset,
                            yt.endContainer,
                            yt.endOffset,
                          ),
                    B(m, yt))
                  : be.removeAllRanges(),
                yt
              );
            }
          };
          be.rangeCount <= 1 && $e();
          var ut =
            ((oe = ae.current) === null || oe === void 0 ? void 0 : oe.isFlushing()) === 'action';
          if (!Ut || !ut) {
            setTimeout(() => {
              Q.isUpdatingSelection = !1;
            });
            return;
          }
          var _e = null,
            ze = requestAnimationFrame(() => {
              if (ut) {
                var We = (Et) => {
                  try {
                    var Ve = ce.toDOMNode(m, m);
                    (Ve.focus(), $e(Et));
                  } catch {}
                };
                (We(),
                  (_e = setTimeout(() => {
                    (We(!0), (Q.isUpdatingSelection = !1));
                  })));
              }
            });
          return () => {
            (cancelAnimationFrame(ze), _e && clearTimeout(_e));
          };
        }
      }));
    var V = F.useCallback(
        (z) => {
          Lg(m, z);
          var oe = ce.toDOMNode(m, m),
            re = oe.getRootNode();
          if (se != null && se.current && sa && re instanceof ShadowRoot) {
            var fe = z.getTargetRanges(),
              Ee = fe[0],
              be = new window.Range();
            (be.setStart(Ee.startContainer, Ee.startOffset),
              be.setEnd(Ee.endContainer, Ee.endOffset));
            var $e = ce.toSlateRange(m, be, { exactMatch: !1, suppressThrow: !0 });
            ($e && le.select(m, $e), z.preventDefault(), z.stopImmediatePropagation());
            return;
          }
          if ((he(), !h && ce.hasEditableTarget(m, z.target) && !t3(z, c))) {
            var ut;
            if (ae.current) return ae.current.handleDOMBeforeInput(z);
            (L.flush(), ne.flush());
            var { selection: _e } = m,
              { inputType: ze } = z,
              We = z.dataTransfer || z.data || void 0,
              Et = ze === 'insertCompositionText' || ze === 'deleteCompositionText';
            if (Et && ce.isComposing(m)) return;
            var Ve = !1;
            if (
              ze === 'insertText' &&
              _e &&
              ee.isCollapsed(_e) &&
              z.data &&
              z.data.length === 1 &&
              /[a-z ]/i.test(z.data) &&
              _e.anchor.offset !== 0 &&
              ((Ve = !0), m.marks && (Ve = !1), !nr.get(m))
            ) {
              var Gt,
                ct,
                { anchor: cn } = _e,
                [Yt, lu] = ce.toDOMPoint(m, cn),
                Vt = (Gt = Yt.parentElement) === null || Gt === void 0 ? void 0 : Gt.closest('a'),
                St = ce.getWindow(m);
              if (Ve && Vt && ce.hasDOMNode(m, Vt)) {
                var yt,
                  sr =
                    St == null
                      ? void 0
                      : St.document.createTreeWalker(Vt, NodeFilter.SHOW_TEXT).lastChild();
                sr === Yt &&
                  ((yt = sr.textContent) === null || yt === void 0 ? void 0 : yt.length) === lu &&
                  (Ve = !1);
              }
              if (
                Ve &&
                Yt.parentElement &&
                (St == null ||
                (ct = St.getComputedStyle(Yt.parentElement)) === null ||
                ct === void 0
                  ? void 0
                  : ct.whiteSpace) === 'pre'
              ) {
                var Bl = E.above(m, {
                  at: cn.path,
                  match: (bl) => j.isElement(bl) && E.isBlock(m, bl),
                });
                Bl && j.string(Bl[0]).includes('	') && (Ve = !1);
              }
            }
            if ((!ze.startsWith('delete') || ze.startsWith('deleteBy')) && !nr.get(m)) {
              var [dn] = z.getTargetRanges();
              if (dn) {
                var xt = ce.toSlateRange(m, dn, { exactMatch: !1, suppressThrow: !0 });
                if (!xt) Ve = !1;
                else if (!_e || !ee.equals(_e, xt)) {
                  Ve = !1;
                  var Cu = !Et && m.selection && E.rangeRef(m, m.selection);
                  (le.select(m, xt), Cu && fl.set(m, Cu));
                }
              }
            }
            if (Et) return;
            if ((Ve || z.preventDefault(), _e && ee.isExpanded(_e) && ze.startsWith('delete'))) {
              var kt = ze.endsWith('Backward') ? 'backward' : 'forward';
              E.deleteFragment(m, { direction: kt });
              return;
            }
            switch (ze) {
              case 'deleteByComposition':
              case 'deleteByCut':
              case 'deleteByDrag': {
                E.deleteFragment(m);
                break;
              }
              case 'deleteContent':
              case 'deleteContentForward': {
                E.deleteForward(m);
                break;
              }
              case 'deleteContentBackward': {
                E.deleteBackward(m);
                break;
              }
              case 'deleteEntireSoftLine': {
                (E.deleteBackward(m, { unit: 'line' }), E.deleteForward(m, { unit: 'line' }));
                break;
              }
              case 'deleteHardLineBackward': {
                E.deleteBackward(m, { unit: 'block' });
                break;
              }
              case 'deleteSoftLineBackward': {
                E.deleteBackward(m, { unit: 'line' });
                break;
              }
              case 'deleteHardLineForward': {
                E.deleteForward(m, { unit: 'block' });
                break;
              }
              case 'deleteSoftLineForward': {
                E.deleteForward(m, { unit: 'line' });
                break;
              }
              case 'deleteWordBackward': {
                E.deleteBackward(m, { unit: 'word' });
                break;
              }
              case 'deleteWordForward': {
                E.deleteForward(m, { unit: 'word' });
                break;
              }
              case 'insertLineBreak':
                E.insertSoftBreak(m);
                break;
              case 'insertParagraph': {
                E.insertBreak(m);
                break;
              }
              case 'insertFromComposition':
              case 'insertFromDrop':
              case 'insertFromPaste':
              case 'insertFromYank':
              case 'insertReplacementText':
              case 'insertText': {
                (ze === 'insertFromComposition' && ce.isComposing(m) && (_(!1), fa.set(m, !1)),
                  (We == null ? void 0 : We.constructor.name) === 'DataTransfer'
                    ? ce.insertData(m, We)
                    : typeof We == 'string' &&
                      (Ve ? ue.current.push(() => E.insertText(m, We)) : E.insertText(m, We)));
                break;
              }
            }
            var fr = (ut = fl.get(m)) === null || ut === void 0 ? void 0 : ut.unref();
            (fl.delete(m), fr && (!m.selection || !ee.equals(m.selection, fr)) && le.select(m, fr));
          }
        },
        [m, ne, he, c, h, L],
      ),
      De = F.useCallback(
        (z) => {
          (z == null
            ? (ne.cancel(),
              L.cancel(),
              sl.delete(m),
              da.delete(m),
              K.current && Hn && K.current.removeEventListener('beforeinput', V))
            : Hn && z.addEventListener('beforeinput', V),
            (K.current = z),
            typeof u == 'function' ? u(z) : u && (u.current = z));
        },
        [ne, L, m, V, u],
      );
    ln(() => {
      var z = ce.getWindow(m),
        oe = (fe) => {
          var { target: Ee } = fe,
            be = Ee instanceof HTMLElement ? Ee : null,
            $e = be == null ? void 0 : be.tagName;
          $e === 'INPUT' || $e === 'TEXTAREA' || L();
        };
      z.document.addEventListener('selectionchange', oe);
      var re = () => {
        Q.isDraggingInternally = !1;
      };
      return (
        z.document.addEventListener('dragend', re),
        z.document.addEventListener('drop', re),
        () => {
          (z.document.removeEventListener('selectionchange', oe),
            z.document.removeEventListener('dragend', re),
            z.document.removeEventListener('drop', re));
        }
      );
    }, [L, Q]);
    var ve = o([m, []]),
      pe = A2(o),
      x =
        d &&
        m.children.length === 1 &&
        Array.from(j.texts(m)).length === 1 &&
        j.string(m) === '' &&
        !M,
      Y = F.useCallback(
        (z) => {
          if (z && x) {
            var oe;
            ie((oe = z.getBoundingClientRect()) === null || oe === void 0 ? void 0 : oe.height);
          } else ie(void 0);
        },
        [x],
      );
    if (x) {
      var Z = E.start(m, []);
      ve.push({ [rr]: !0, placeholder: d, onPlaceholderResize: Y, anchor: Z, focus: Z });
    }
    var { marks: J } = m;
    if (((Q.hasMarkPlaceholder = !1), m.selection && ee.isCollapsed(m.selection) && J)) {
      var { anchor: ge } = m.selection,
        Ae = j.leaf(m, ge.path),
        { text: Oe } = Ae,
        Xe = co(Ae, Z2);
      if (!nn.equals(Ae, J, { loose: !0 })) {
        Q.hasMarkPlaceholder = !0;
        var Ne = Object.fromEntries(Object.keys(Xe).map((z) => [z, null]));
        ve.push(Mu(Mu(Mu({ [bm]: !0 }, Ne), J), {}, { anchor: ge, focus: ge }));
      }
    }
    return (
      F.useEffect(() => {
        setTimeout(() => {
          var { selection: z } = m;
          if (z) {
            var { anchor: oe } = z,
              re = j.leaf(m, oe.path);
            if (J && !nn.equals(re, J, { loose: !0 })) {
              Fu.set(m, J);
              return;
            }
          }
          Fu.delete(m);
        });
      }),
      G2(),
      xe.createElement(
        Ym.Provider,
        { value: h },
        xe.createElement(
          X2.Provider,
          { value: M },
          xe.createElement(
            Lm.Provider,
            { value: pe },
            xe.createElement(
              K2,
              { node: K, receivedUserInput: de },
              xe.createElement(
                w,
                Mu(
                  Mu(
                    {
                      role: h ? void 0 : 'textbox',
                      'aria-multiline': h ? void 0 : !0,
                      translate: 'no',
                    },
                    b,
                  ),
                  {},
                  {
                    spellCheck: Hn || !uo ? b.spellCheck : !1,
                    autoCorrect: Hn || !uo ? b.autoCorrect : 'false',
                    autoCapitalize: Hn || !uo ? b.autoCapitalize : 'false',
                    'data-slate-editor': !0,
                    'data-slate-node': 'value',
                    contentEditable: !h,
                    zindex: -1,
                    suppressContentEditableWarning: !0,
                    ref: De,
                    style: Mu(
                      Mu(
                        {},
                        N
                          ? {}
                          : Mu(
                              {
                                position: 'relative',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                              },
                              X ? { minHeight: X } : {},
                            ),
                      ),
                      S,
                    ),
                    onBeforeInput: F.useCallback(
                      (z) => {
                        if (
                          !Hn &&
                          !h &&
                          !_t(z, b.onBeforeInput) &&
                          ce.hasSelectableTarget(m, z.target) &&
                          (z.preventDefault(), !ce.isComposing(m))
                        ) {
                          var oe = z.data;
                          E.insertText(m, oe);
                        }
                      },
                      [b.onBeforeInput, m, h],
                    ),
                    onInput: F.useCallback(
                      (z) => {
                        if (!_t(z, b.onInput)) {
                          if (ae.current) {
                            ae.current.handleInput();
                            return;
                          }
                          for (var oe of ue.current) oe();
                          ((ue.current = []), ce.isFocused(m) || Lg(m, z.nativeEvent));
                        }
                      },
                      [b.onInput, m],
                    ),
                    onBlur: F.useCallback(
                      (z) => {
                        if (!(
                          h ||
                          Q.isUpdatingSelection ||
                          !ce.hasSelectableTarget(m, z.target) ||
                          _t(z, b.onBlur)
                        )) {
                          var oe = ce.findDocumentOrShadowRoot(m);
                          if (Q.latestElement !== oe.activeElement) {
                            var { relatedTarget: re } = z,
                              fe = ce.toDOMNode(m, m);
                            if (re !== fe && !(mu(re) && re.hasAttribute('data-slate-spacer'))) {
                              if (re != null && Gn(re) && ce.hasDOMNode(m, re)) {
                                var Ee = ce.toSlateNode(m, re);
                                if (j.isElement(Ee) && !m.isVoid(Ee)) return;
                              }
                              if (sa) {
                                var be = il(oe);
                                be == null || be.removeAllRanges();
                              }
                              _n.delete(m);
                            }
                          }
                        }
                      },
                      [h, Q.isUpdatingSelection, Q.latestElement, m, b.onBlur],
                    ),
                    onClick: F.useCallback(
                      (z) => {
                        if (ce.hasTarget(m, z.target) && !_t(z, b.onClick) && Gn(z.target)) {
                          var oe = ce.toSlateNode(m, z.target),
                            re = ce.findPath(m, oe);
                          if (!E.hasPath(m, re) || j.get(m, re) !== oe) return;
                          if (z.detail === yb && re.length >= 1) {
                            var fe = re;
                            if (!(j.isElement(oe) && E.isBlock(m, oe))) {
                              var Ee,
                                be = E.above(m, {
                                  match: (Ve) => j.isElement(Ve) && E.isBlock(m, Ve),
                                  at: re,
                                });
                              fe =
                                (Ee = be == null ? void 0 : be[1]) !== null && Ee !== void 0
                                  ? Ee
                                  : re.slice(0, 1);
                            }
                            var $e = E.range(m, fe);
                            le.select(m, $e);
                            return;
                          }
                          if (h) return;
                          var ut = E.start(m, re),
                            _e = E.end(m, re),
                            ze = E.void(m, { at: ut }),
                            We = E.void(m, { at: _e });
                          if (ze && We && T.equals(ze[1], We[1])) {
                            var Et = E.range(m, ut);
                            le.select(m, Et);
                          }
                        }
                      },
                      [m, b.onClick, h],
                    ),
                    onCompositionEnd: F.useCallback(
                      (z) => {
                        if (!rl(z) && ce.hasSelectableTarget(m, z.target)) {
                          var oe;
                          if (
                            (ce.isComposing(m) &&
                              Promise.resolve().then(() => {
                                (_(!1), fa.set(m, !1));
                              }),
                            (oe = ae.current) === null ||
                              oe === void 0 ||
                              oe.handleCompositionEnd(z),
                            _t(z, b.onCompositionEnd) || Ut)
                          )
                            return;
                          if (!sa && !ib && !ab && !sb && !ob && z.data) {
                            var re = Fu.get(m);
                            (Fu.delete(m),
                              re !== void 0 && (un.set(m, m.marks), (m.marks = re)),
                              E.insertText(m, z.data));
                            var fe = un.get(m);
                            (un.delete(m), fe !== void 0 && (m.marks = fe));
                          }
                        }
                      },
                      [b.onCompositionEnd, m],
                    ),
                    onCompositionUpdate: F.useCallback(
                      (z) => {
                        ce.hasSelectableTarget(m, z.target) &&
                          !_t(z, b.onCompositionUpdate) &&
                          !rl(z) &&
                          (ce.isComposing(m) || (_(!0), fa.set(m, !0)));
                      },
                      [b.onCompositionUpdate, m],
                    ),
                    onCompositionStart: F.useCallback(
                      (z) => {
                        if (!rl(z) && ce.hasSelectableTarget(m, z.target)) {
                          var oe;
                          if (
                            ((oe = ae.current) === null ||
                              oe === void 0 ||
                              oe.handleCompositionStart(z),
                            _t(z, b.onCompositionStart) || Ut)
                          )
                            return;
                          _(!0);
                          var { selection: re } = m;
                          if (re && ee.isExpanded(re)) {
                            E.deleteFragment(m);
                            return;
                          }
                        }
                      },
                      [b.onCompositionStart, m],
                    ),
                    onCopy: F.useCallback(
                      (z) => {
                        ce.hasSelectableTarget(m, z.target) &&
                          !_t(z, b.onCopy) &&
                          !rl(z) &&
                          (z.preventDefault(), ce.setFragmentData(m, z.clipboardData, 'copy'));
                      },
                      [b.onCopy, m],
                    ),
                    onCut: F.useCallback(
                      (z) => {
                        if (
                          !h &&
                          ce.hasSelectableTarget(m, z.target) &&
                          !_t(z, b.onCut) &&
                          !rl(z)
                        ) {
                          (z.preventDefault(), ce.setFragmentData(m, z.clipboardData, 'cut'));
                          var { selection: oe } = m;
                          if (oe)
                            if (ee.isExpanded(oe)) E.deleteFragment(m);
                            else {
                              var re = j.parent(m, oe.anchor.path);
                              E.isVoid(m, re) && le.delete(m);
                            }
                        }
                      },
                      [h, m, b.onCut],
                    ),
                    onDragOver: F.useCallback(
                      (z) => {
                        if (ce.hasTarget(m, z.target) && !_t(z, b.onDragOver)) {
                          var oe = ce.toSlateNode(m, z.target);
                          j.isElement(oe) && E.isVoid(m, oe) && z.preventDefault();
                        }
                      },
                      [b.onDragOver, m],
                    ),
                    onDragStart: F.useCallback(
                      (z) => {
                        if (!h && ce.hasTarget(m, z.target) && !_t(z, b.onDragStart)) {
                          var oe = ce.toSlateNode(m, z.target),
                            re = ce.findPath(m, oe),
                            fe =
                              (j.isElement(oe) && E.isVoid(m, oe)) ||
                              E.void(m, { at: re, voids: !0 });
                          if (fe) {
                            var Ee = E.range(m, re);
                            le.select(m, Ee);
                          }
                          ((Q.isDraggingInternally = !0),
                            ce.setFragmentData(m, z.dataTransfer, 'drag'));
                        }
                      },
                      [h, m, b.onDragStart, Q],
                    ),
                    onDrop: F.useCallback(
                      (z) => {
                        if (!h && ce.hasTarget(m, z.target) && !_t(z, b.onDrop)) {
                          z.preventDefault();
                          var oe = m.selection,
                            re = ce.findEventRange(m, z),
                            fe = z.dataTransfer;
                          (le.select(m, re),
                            Q.isDraggingInternally &&
                              oe &&
                              !ee.equals(oe, re) &&
                              !E.void(m, { at: re, voids: !0 }) &&
                              le.delete(m, { at: oe }),
                            ce.insertData(m, fe),
                            ce.isFocused(m) || ce.focus(m));
                        }
                      },
                      [h, m, b.onDrop, Q],
                    ),
                    onDragEnd: F.useCallback(
                      (z) => {
                        !h &&
                          Q.isDraggingInternally &&
                          b.onDragEnd &&
                          ce.hasTarget(m, z.target) &&
                          b.onDragEnd(z);
                      },
                      [h, Q, b, m],
                    ),
                    onFocus: F.useCallback(
                      (z) => {
                        if (
                          !h &&
                          !Q.isUpdatingSelection &&
                          ce.hasEditableTarget(m, z.target) &&
                          !_t(z, b.onFocus)
                        ) {
                          var oe = ce.toDOMNode(m, m),
                            re = ce.findDocumentOrShadowRoot(m);
                          if (((Q.latestElement = re.activeElement), er && z.target !== oe)) {
                            oe.focus();
                            return;
                          }
                          _n.set(m, !0);
                        }
                      },
                      [h, Q, m, b.onFocus],
                    ),
                    onKeyDown: F.useCallback(
                      (z) => {
                        if (!h && ce.hasEditableTarget(m, z.target)) {
                          var oe;
                          (oe = ae.current) === null || oe === void 0 || oe.handleKeyDown(z);
                          var { nativeEvent: re } = z;
                          if (
                            (ce.isComposing(m) && re.isComposing === !1 && (fa.set(m, !1), _(!1)),
                            _t(z, b.onKeyDown) || ce.isComposing(m))
                          )
                            return;
                          var { selection: fe } = m,
                            Ee = m.children[fe !== null ? fe.focus.path[0] : 0],
                            be = dm(j.string(Ee)) === 'rtl';
                          if (st.isRedo(re)) {
                            z.preventDefault();
                            var $e = m;
                            typeof $e.redo == 'function' && $e.redo();
                            return;
                          }
                          if (st.isUndo(re)) {
                            z.preventDefault();
                            var ut = m;
                            typeof ut.undo == 'function' && ut.undo();
                            return;
                          }
                          if (st.isMoveLineBackward(re)) {
                            (z.preventDefault(), le.move(m, { unit: 'line', reverse: !0 }));
                            return;
                          }
                          if (st.isMoveLineForward(re)) {
                            (z.preventDefault(), le.move(m, { unit: 'line' }));
                            return;
                          }
                          if (st.isExtendLineBackward(re)) {
                            (z.preventDefault(),
                              le.move(m, { unit: 'line', edge: 'focus', reverse: !0 }));
                            return;
                          }
                          if (st.isExtendLineForward(re)) {
                            (z.preventDefault(), le.move(m, { unit: 'line', edge: 'focus' }));
                            return;
                          }
                          if (st.isMoveBackward(re)) {
                            (z.preventDefault(),
                              fe && ee.isCollapsed(fe)
                                ? le.move(m, { reverse: !be })
                                : le.collapse(m, { edge: be ? 'end' : 'start' }));
                            return;
                          }
                          if (st.isMoveForward(re)) {
                            (z.preventDefault(),
                              fe && ee.isCollapsed(fe)
                                ? le.move(m, { reverse: be })
                                : le.collapse(m, { edge: be ? 'start' : 'end' }));
                            return;
                          }
                          if (st.isMoveWordBackward(re)) {
                            (z.preventDefault(),
                              fe && ee.isExpanded(fe) && le.collapse(m, { edge: 'focus' }),
                              le.move(m, { unit: 'word', reverse: !be }));
                            return;
                          }
                          if (st.isMoveWordForward(re)) {
                            (z.preventDefault(),
                              fe && ee.isExpanded(fe) && le.collapse(m, { edge: 'focus' }),
                              le.move(m, { unit: 'word', reverse: be }));
                            return;
                          }
                          if (Hn) {
                            if (
                              (Uc || sa) &&
                              fe &&
                              (st.isDeleteBackward(re) || st.isDeleteForward(re)) &&
                              ee.isCollapsed(fe)
                            ) {
                              var _e = j.parent(m, fe.anchor.path);
                              if (
                                j.isElement(_e) &&
                                E.isVoid(m, _e) &&
                                (E.isInline(m, _e) || E.isBlock(m, _e))
                              ) {
                                (z.preventDefault(), E.deleteBackward(m, { unit: 'block' }));
                                return;
                              }
                            }
                          } else {
                            if (st.isBold(re) || st.isItalic(re) || st.isTransposeCharacter(re)) {
                              z.preventDefault();
                              return;
                            }
                            if (st.isSoftBreak(re)) {
                              (z.preventDefault(), E.insertSoftBreak(m));
                              return;
                            }
                            if (st.isSplitBlock(re)) {
                              (z.preventDefault(), E.insertBreak(m));
                              return;
                            }
                            if (st.isDeleteBackward(re)) {
                              (z.preventDefault(),
                                fe && ee.isExpanded(fe)
                                  ? E.deleteFragment(m, { direction: 'backward' })
                                  : E.deleteBackward(m));
                              return;
                            }
                            if (st.isDeleteForward(re)) {
                              (z.preventDefault(),
                                fe && ee.isExpanded(fe)
                                  ? E.deleteFragment(m, { direction: 'forward' })
                                  : E.deleteForward(m));
                              return;
                            }
                            if (st.isDeleteLineBackward(re)) {
                              (z.preventDefault(),
                                fe && ee.isExpanded(fe)
                                  ? E.deleteFragment(m, { direction: 'backward' })
                                  : E.deleteBackward(m, { unit: 'line' }));
                              return;
                            }
                            if (st.isDeleteLineForward(re)) {
                              (z.preventDefault(),
                                fe && ee.isExpanded(fe)
                                  ? E.deleteFragment(m, { direction: 'forward' })
                                  : E.deleteForward(m, { unit: 'line' }));
                              return;
                            }
                            if (st.isDeleteWordBackward(re)) {
                              (z.preventDefault(),
                                fe && ee.isExpanded(fe)
                                  ? E.deleteFragment(m, { direction: 'backward' })
                                  : E.deleteBackward(m, { unit: 'word' }));
                              return;
                            }
                            if (st.isDeleteWordForward(re)) {
                              (z.preventDefault(),
                                fe && ee.isExpanded(fe)
                                  ? E.deleteFragment(m, { direction: 'forward' })
                                  : E.deleteForward(m, { unit: 'word' }));
                              return;
                            }
                          }
                        }
                      },
                      [h, m, b.onKeyDown],
                    ),
                    onPaste: F.useCallback(
                      (z) => {
                        !h &&
                          ce.hasEditableTarget(m, z.target) &&
                          !_t(z, b.onPaste) &&
                          (!Hn || $B(z.nativeEvent) || sa) &&
                          (z.preventDefault(), ce.insertData(m, z.clipboardData));
                      },
                      [h, m, b.onPaste],
                    ),
                  },
                ),
                xe.createElement($2, {
                  decorations: ve,
                  node: m,
                  renderElement: v,
                  renderChunk: D,
                  renderPlaceholder: A,
                  renderLeaf: p,
                  renderText: C,
                }),
              ),
            ),
          ),
        ),
      )
    );
  }),
  J2 = (n) => {
    var { attributes: u, children: r } = n;
    return xe.createElement('span', Mu({}, u), r, Ut && xe.createElement('br', null));
  },
  I2 = () => [],
  e3 = (n, u) => {
    var r = !!n.selection && ee.isBackward(n.selection),
      l = u.cloneRange();
    if ((l.collapse(r), l.getBoundingClientRect)) {
      var o = l.startContainer.parentElement,
        c = l.getBoundingClientRect(),
        d = c.width === 0 && c.height === 0 && c.x === 0 && c.y === 0;
      if (d) {
        var h = o.getBoundingClientRect(),
          v = h.width > 0 || h.height > 0;
        if (v) return;
      }
      ((o.getBoundingClientRect = l.getBoundingClientRect.bind(l)),
        KB(o, { scrollMode: 'if-needed' }),
        delete o.getBoundingClientRect);
    }
  },
  _t = (n, u) => {
    if (!u) return !1;
    var r = u(n);
    return r ?? (n.isDefaultPrevented() || n.isPropagationStopped());
  },
  rl = (n) =>
    Gn(n.target) &&
    (n.target instanceof HTMLInputElement || n.target instanceof HTMLTextAreaElement),
  t3 = (n, u) => {
    if (!u) return !1;
    var r = u(n);
    return r ?? n.defaultPrevented;
  },
  Lg = (n, u) => {
    var r = n;
    if (u.inputType === 'historyUndo' && typeof r.undo == 'function') {
      r.undo();
      return;
    }
    if (u.inputType === 'historyRedo' && typeof r.redo == 'function') {
      r.redo();
      return;
    }
  },
  u3 = F.createContext(!1),
  Km = parseInt(xe.version.split('.')[0], 10),
  n3 = ['editor', 'children', 'onChange', 'onSelectionChange', 'onValueChange', 'initialValue'],
  a3 = (n) => {
    var {
        editor: u,
        children: r,
        onChange: l,
        onSelectionChange: o,
        onValueChange: c,
        initialValue: d,
      } = n,
      h = co(n, n3);
    xe.useState(() => {
      if (!j.isNodeList(d))
        throw new Error(
          '[Slate] initialValue is invalid! Expected a list of elements but got: '.concat(
            Bt.stringify(d),
          ),
        );
      if (!E.isEditor(u))
        throw new Error('[Slate] editor is invalid! You passed: '.concat(Bt.stringify(u)));
      ((u.children = d), Object.assign(u, h));
    });
    var { selectorContext: v, onChange: D } = _2(),
      p = F.useCallback(() => {
        (l && l(u.children),
          o && u.operations.find((B) => B.type === 'set_selection') && o(u.selection),
          c && u.operations.find((B) => B.type !== 'set_selection') && c(u.children),
          D());
      }, [u, D, l, o, c]);
    F.useEffect(
      () => (
        gc.set(u, p),
        () => {
          gc.set(u, () => {});
        }
      ),
      [u, p],
    );
    var [C, A] = F.useState(ce.isFocused(u));
    return (
      F.useEffect(() => {
        A(ce.isFocused(u));
      }, [u]),
      ln(() => {
        var B = () => A(ce.isFocused(u));
        return Km >= 17
          ? (document.addEventListener('focusin', B),
            document.addEventListener('focusout', B),
            () => {
              (document.removeEventListener('focusin', B),
                document.removeEventListener('focusout', B));
            })
          : (document.addEventListener('focus', B, !0),
            document.addEventListener('blur', B, !0),
            () => {
              (document.removeEventListener('focus', B, !0),
                document.removeEventListener('blur', B, !0));
            });
      }, [u]),
      xe.createElement(
        Vc.Provider,
        { value: v },
        xe.createElement(Yc.Provider, { value: u }, xe.createElement(u3.Provider, { value: C }, r)),
      )
    );
  },
  r3 = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'x-slate-fragment',
      l = u;
    l = Eb(l, r);
    var { onChange: o, apply: c, insertText: d } = l;
    return (
      (l.getChunkSize = () => null),
      Ut && (l.insertText = (h, v) => (tn.delete(l), d(h, v))),
      (l.onChange = (h) => {
        var v = Km < 18 ? uy.unstable_batchedUpdates : (D) => D();
        v(() => {
          o(h);
        });
      }),
      (l.apply = (h) => {
        if (h.type === 'move_node') {
          var v = j.parent(l, h.path),
            D = !!l.getChunkSize(v);
          if (D) {
            var p = j.get(l, h.path),
              C = qm(l, v),
              A = ce.findKey(l, p);
            C.movedNodeKeys.add(A);
          }
        }
        c(h);
      }),
      l
    );
  };
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */ function Hg(n) {
  return Object.prototype.toString.call(n) === '[object Object]';
}
function l3(n) {
  var u, r;
  return Hg(n) === !1
    ? !1
    : ((u = n.constructor),
      u === void 0
        ? !0
        : ((r = u.prototype), !(Hg(r) === !1 || r.hasOwnProperty('isPrototypeOf') === !1)));
}
var i3 = {
    isHistory(n) {
      return (
        l3(n) &&
        Array.isArray(n.redos) &&
        Array.isArray(n.undos) &&
        (n.redos.length === 0 || qn.isOperationList(n.redos[0].operations)) &&
        (n.undos.length === 0 || qn.isOperationList(n.undos[0].operations))
      );
    },
  },
  ic = new WeakMap(),
  ia = new WeakMap(),
  Wi = new WeakMap(),
  ju = {
    isHistoryEditor(n) {
      return i3.isHistory(n.history) && E.isEditor(n);
    },
    isMerging(n) {
      return ia.get(n);
    },
    isSplittingOnce(n) {
      return Wi.get(n);
    },
    setSplittingOnce(n, u) {
      Wi.set(n, u);
    },
    isSaving(n) {
      return ic.get(n);
    },
    redo(n) {
      n.redo();
    },
    undo(n) {
      n.undo();
    },
    withMerging(n, u) {
      var r = ju.isMerging(n);
      (ia.set(n, !0), u(), ia.set(n, r));
    },
    withNewBatch(n, u) {
      var r = ju.isMerging(n);
      (ia.set(n, !0), Wi.set(n, !0), u(), ia.set(n, r), Wi.delete(n));
    },
    withoutMerging(n, u) {
      var r = ju.isMerging(n);
      (ia.set(n, !1), u(), ia.set(n, r));
    },
    withoutSaving(n, u) {
      var r = ju.isSaving(n);
      ic.set(n, !1);
      try {
        u();
      } finally {
        ic.set(n, r);
      }
    },
  },
  o3 = (n) => {
    var u = n,
      { apply: r } = u;
    return (
      (u.history = { undos: [], redos: [] }),
      (u.redo = () => {
        var { history: l } = u,
          { redos: o } = l;
        if (o.length > 0) {
          var c = o[o.length - 1];
          (c.selectionBefore && le.setSelection(u, c.selectionBefore),
            ju.withoutSaving(u, () => {
              E.withoutNormalizing(u, () => {
                for (var d of c.operations) u.apply(d);
              });
            }),
            l.redos.pop(),
            u.writeHistory('undos', c));
        }
      }),
      (u.undo = () => {
        var { history: l } = u,
          { undos: o } = l;
        if (o.length > 0) {
          var c = o[o.length - 1];
          (ju.withoutSaving(u, () => {
            E.withoutNormalizing(u, () => {
              var d = c.operations.map(qn.inverse).reverse();
              for (var h of d) u.apply(h);
              c.selectionBefore && le.setSelection(u, c.selectionBefore);
            });
          }),
            u.writeHistory('redos', c),
            l.undos.pop());
        }
      }),
      (u.apply = (l) => {
        var { operations: o, history: c } = u,
          { undos: d } = c,
          h = d[d.length - 1],
          v = h && h.operations[h.operations.length - 1],
          D = ju.isSaving(u),
          p = ju.isMerging(u);
        if ((D == null && (D = f3(l)), D)) {
          if (
            (p == null && (h == null ? (p = !1) : o.length !== 0 ? (p = !0) : (p = s3(l, v))),
            ju.isSplittingOnce(u) && ((p = !1), ju.setSplittingOnce(u, void 0)),
            h && p)
          )
            h.operations.push(l);
          else {
            var C = { operations: [l], selectionBefore: u.selection };
            u.writeHistory('undos', C);
          }
          for (; d.length > 100;) d.shift();
          c.redos = [];
        }
        r(l);
      }),
      (u.writeHistory = (l, o) => {
        u.history[l].push(o);
      }),
      u
    );
  },
  s3 = (n, u) =>
    !!(
      (u &&
        n.type === 'insert_text' &&
        u.type === 'insert_text' &&
        n.offset === u.offset + u.text.length &&
        T.equals(n.path, u.path)) ||
      (u &&
        n.type === 'remove_text' &&
        u.type === 'remove_text' &&
        n.offset + n.text.length === u.offset &&
        T.equals(n.path, u.path))
    ),
  f3 = (n, u) => n.type !== 'set_selection';
const c3 = (n, u) => {
    d3(n, u) ? n.removeMark(u) : n.addMark(u, !0);
  },
  d3 = (n, u) => {
    const r = n.marks;
    return r ? r[u] === !0 : !1;
  },
  Ji = { BOLD: 'bold', ITALIC: 'italic', UNDERLINE: 'underline', CODE: 'code' },
  ye = {
    PARAGRAPH: 'paragraph',
    HEADING_ONE: 'heading-one',
    HEADING_TWO: 'heading-two',
    HEADING_THREE: 'heading-three',
    BLOCKQUOTE: 'blockquote',
    CODE_BLOCK: 'code-block',
    LIST_ITEM: 'list-item',
    NUMBERED_LIST: 'numbered-list',
    BULLETED_LIST: 'bulleted-list',
  },
  h3 = (n, u) => {
    const r = D3(n, u);
    le.setNodes(
      n,
      { type: r ? ye.PARAGRAPH : u },
      { match: (l) => ur.isElement(l) && n.isBlock(l) },
    );
  },
  D3 = (n, u) => {
    const { selection: r } = n;
    return r
      ? Array.from(
          n.nodes({
            at: n.unhangRange(r),
            match: (o) => !o.isEditor && ur.isElement(o) && o.type === u,
          }),
        ).length > 0
      : !1;
  },
  fn = ({ type: n, pluginId: u, children: r }) =>
    U.jsx('div', {
      'data-plugin-id': u,
      'data-block-type': n,
      style: { position: 'relative' },
      children: r,
    }),
  v3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.PARAGRAPH,
      pluginId: r,
      children: U.jsx('p', { ...n, style: { margin: '8px 0', lineHeight: '1.8' }, children: u }),
    }),
  g3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.HEADING_ONE,
      pluginId: r,
      children: U.jsx('h1', {
        ...n,
        style: { fontSize: '24px', fontWeight: 'bold', margin: '16px 0 8px' },
        children: u,
      }),
    }),
  m3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.HEADING_TWO,
      pluginId: r,
      children: U.jsx('h2', {
        ...n,
        style: { fontSize: '20px', fontWeight: 'bold', margin: '14px 0 8px' },
        children: u,
      }),
    }),
  p3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.HEADING_THREE,
      pluginId: r,
      children: U.jsx('h3', {
        ...n,
        style: { fontSize: '18px', fontWeight: 'bold', margin: '12px 0 8px' },
        children: u,
      }),
    }),
  C3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.BLOCKQUOTE,
      pluginId: r,
      children: U.jsx('blockquote', {
        ...n,
        style: {
          margin: '12px 0',
          paddingLeft: '16px',
          borderLeft: '4px solid #faad14',
          color: '#666',
          fontStyle: 'italic',
        },
        children: u,
      }),
    }),
  E3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.CODE_BLOCK,
      pluginId: r,
      children: U.jsx('pre', {
        ...n,
        style: {
          margin: '12px 0',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          overflowX: 'auto',
        },
        children: U.jsx('code', {
          style: { fontFamily: 'monospace', fontSize: '14px', color: '#333' },
          children: u,
        }),
      }),
    }),
  y3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.BULLETED_LIST,
      pluginId: r,
      children: U.jsx('ul', {
        ...n,
        style: { margin: '8px 0', paddingLeft: '24px', listStyleType: 'disc' },
        children: u,
      }),
    }),
  A3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.NUMBERED_LIST,
      pluginId: r,
      children: U.jsx('ol', { ...n, style: { margin: '8px 0', paddingLeft: '24px' }, children: u }),
    }),
  B3 = ({ attributes: n, children: u, pluginId: r }) =>
    U.jsx(fn, {
      type: ye.LIST_ITEM,
      pluginId: r,
      children: U.jsx('li', { ...n, style: { margin: '4px 0' }, children: u }),
    }),
  b3 = ({ attributes: n, children: u, leaf: r }) => {
    let l = u;
    return (
      r.bold && (l = U.jsx('strong', { children: l })),
      r.italic && (l = U.jsx('em', { children: l })),
      r.underline && (l = U.jsx('u', { children: l })),
      r.code &&
        (l = U.jsx('code', {
          style: {
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '2px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
          },
          children: l,
        })),
      U.jsx('span', { ...n, children: l })
    );
  },
  Xm = F.createContext(null),
  F3 = ({ children: n }) => {
    const [u, r] = F.useState(!1),
      [l, o] = F.useState({ x: 0, y: 0 }),
      [c, d] = F.useState(null),
      [h, v] = F.useState(!1),
      [D, p] = F.useState(null),
      C = F.useRef(null),
      A = F.useRef(!1);
    F.useEffect(() => {
      A.current = h;
    }, [h]);
    const B = F.useCallback((N, b, m) => {
        (C.current && clearTimeout(C.current), d(N), o({ x: b, y: m }), r(!0));
      }, []),
      S = F.useCallback(() => {
        (C.current && clearTimeout(C.current),
          (C.current = window.setTimeout(() => {
            A.current || (r(!1), d(null));
          }, 200)));
      }, []),
      w = F.useCallback(() => {
        (C.current && clearTimeout(C.current), r(!1), d(null));
      }, []);
    return U.jsx(Xm.Provider, {
      value: {
        visible: u,
        position: l,
        targetId: c,
        hoveringMenu: h,
        activeDocbarId: D,
        openMenu: B,
        closeMenu: S,
        forceCloseMenu: w,
        setHoveringMenu: v,
        setActiveDocbarId: p,
      },
      children: n,
    });
  },
  Qm = () => {
    const n = F.useContext(Xm);
    if (!n) throw new Error('useMenu must be used within a MenuProvider');
    return n;
  },
  Zm = F.createContext(null),
  S3 = ({ children: n }) => {
    const [u, r] = F.useState(!1);
    return (
      F.useEffect(() => {
        const l = () => {
          const o = window.getSelection();
          o && !o.isCollapsed ? r(!0) : r(!1);
        };
        return (
          document.addEventListener('selectionchange', l),
          document.addEventListener('mouseup', l),
          () => {
            (document.removeEventListener('selectionchange', l),
              document.removeEventListener('mouseup', l));
          }
        );
      }, []),
      U.jsx(Zm.Provider, { value: { hasSelection: u }, children: n })
    );
  },
  x3 = () => {
    const n = F.useContext(Zm);
    if (!n) throw new Error('useSelection must be used within a SelectionProvider');
    return n;
  },
  O3 = () => {
    const { visible: n, position: u, closeMenu: r, setHoveringMenu: l } = Qm(),
      o = F.useRef(null),
      c = F.useCallback(() => {
        if (!o.current) return;
        const h = o.current,
          v = h.getBoundingClientRect(),
          D = window.innerHeight,
          p = D - 40;
        if (
          (v.height > p
            ? ((h.style.maxHeight = `${p}px`), (h.style.overflowY = 'auto'))
            : ((h.style.maxHeight = 'none'), (h.style.overflowY = 'visible')),
          v.bottom > D)
        ) {
          const C = D - v.height - 20;
          C >= 0 && (h.style.top = `${C}px`);
        }
      }, []);
    F.useEffect(() => {
      n &&
        requestAnimationFrame(() => {
          c();
        });
    }, [n, u, c]);
    const d = (h) => {
      (console.log('Menu action:', h), r());
    };
    return n
      ? U.jsxs(U.Fragment, {
          children: [
            U.jsx('div', {
              style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 },
              onClick: r,
            }),
            U.jsxs('div', {
              ref: o,
              style: {
                position: 'fixed',
                left: u.x,
                top: u.y,
                backgroundColor: '#fff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                padding: '0',
                zIndex: 1001,
                minWidth: '180px',
              },
              onClick: (h) => h.stopPropagation(),
              onMouseEnter: () => l(!0),
              onMouseLeave: () => l(!1),
              children: [
                U.jsxs('div', {
                  style: { padding: '4px', display: 'flex', flexWrap: 'wrap', gap: '2px' },
                  children: [
                    U.jsx('button', {
                      onClick: () => d('text'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: '#1890ff',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#40a9ff'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = '#1890ff'),
                      children: 'T',
                    }),
                    U.jsx('button', {
                      onClick: () => d('h1'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: 'H1',
                    }),
                    U.jsx('button', {
                      onClick: () => d('h2'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: 'H2',
                    }),
                    U.jsx('button', {
                      onClick: () => d('h3'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: 'H3',
                    }),
                    U.jsx('button', {
                      onClick: () => d('numbered-list'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: '≡',
                    }),
                    U.jsx('button', {
                      onClick: () => d('bulleted-list'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: '≡',
                    }),
                  ],
                }),
                U.jsx('div', { style: { height: '1px', backgroundColor: '#e8e8e8' } }),
                U.jsxs('div', {
                  style: { padding: '4px', display: 'flex', flexWrap: 'wrap', gap: '2px' },
                  children: [
                    U.jsx('button', {
                      onClick: () => d('checkbox'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: '☐',
                    }),
                    U.jsx('button', {
                      onClick: () => d('code'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'monospace',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                    }),
                    U.jsx('button', {
                      onClick: () => d('quote'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: '"',
                    }),
                    U.jsx('button', {
                      onClick: () => d('code-block'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'monospace',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: '</>',
                    }),
                    U.jsx('button', {
                      onClick: () => d('link'),
                      style: {
                        width: '36px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                      children: '🔗',
                    }),
                  ],
                }),
                U.jsx('div', { style: { height: '1px', backgroundColor: '#e8e8e8' } }),
                U.jsxs('button', {
                  onClick: () => d('indent'),
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#333',
                    borderRadius: '0',
                    gap: '8px',
                  },
                  onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    U.jsx('span', { style: { fontSize: '14px' }, children: '☰' }),
                    U.jsx('span', { children: '缩进和对齐' }),
                    U.jsx('span', {
                      style: { marginLeft: 'auto', fontSize: '12px', color: '#999' },
                      children: '›',
                    }),
                  ],
                }),
                U.jsxs('button', {
                  onClick: () => d('color'),
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#333',
                    borderRadius: '0',
                    gap: '8px',
                  },
                  onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    U.jsx('span', { style: { fontSize: '14px' }, children: '🎨' }),
                    U.jsx('span', { children: '颜色' }),
                    U.jsx('span', {
                      style: { marginLeft: 'auto', fontSize: '12px', color: '#999' },
                      children: '›',
                    }),
                  ],
                }),
                U.jsx('div', { style: { height: '1px', backgroundColor: '#e8e8e8' } }),
                U.jsxs('button', {
                  onClick: () => d('comment'),
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#333',
                    borderRadius: '0',
                    gap: '8px',
                  },
                  onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    U.jsx('span', { style: { fontSize: '14px' }, children: '💬' }),
                    U.jsx('span', { children: '评论' }),
                  ],
                }),
                U.jsxs('button', {
                  onClick: () => d('cut'),
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#333',
                    borderRadius: '0',
                    gap: '8px',
                  },
                  onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    U.jsx('span', { style: { fontSize: '14px' }, children: '✂' }),
                    U.jsx('span', { children: '剪切' }),
                  ],
                }),
                U.jsxs('button', {
                  onClick: () => d('copy'),
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#333',
                    borderRadius: '0',
                    gap: '8px',
                  },
                  onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    U.jsx('span', { style: { fontSize: '14px' }, children: '📋' }),
                    U.jsx('span', { children: '复制' }),
                  ],
                }),
                U.jsxs('button', {
                  onClick: () => d('delete'),
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: '#333',
                    borderRadius: '0',
                    gap: '8px',
                  },
                  onMouseEnter: (h) => (h.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (h) => (h.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    U.jsx('span', { style: { fontSize: '14px' }, children: '🗑' }),
                    U.jsx('span', { children: '删除' }),
                  ],
                }),
              ],
            }),
          ],
        })
      : null;
  },
  $m = F.createContext(null),
  w3 = ({ children: n }) => {
    const [u, r] = F.useState(null),
      l = F.useRef(null);
    return (
      F.useEffect(() => {
        const o = (c) => {
          const d = c.target;
          if ((l.current && clearTimeout(l.current), !!d.closest('[data-docbar-area]'))) return;
          const v = d.closest('[data-plugin-id]');
          if (v) {
            const D = v.getAttribute('data-plugin-id'),
              p = v.getAttribute('data-block-type');
            if (D && p) {
              const C = v.getBoundingClientRect();
              r({ id: D, type: p, rect: C });
              return;
            }
          }
          l.current = window.setTimeout(() => {
            r(null);
          }, 300);
        };
        return (
          document.addEventListener('mousemove', o),
          () => {
            (document.removeEventListener('mousemove', o), l.current && clearTimeout(l.current));
          }
        );
      }, []),
      U.jsx($m.Provider, { value: { activeElement: u }, children: n })
    );
  },
  T3 = () => {
    const n = F.useContext($m);
    if (!n) throw new Error('useDocBar must be used within a DocBarProvider');
    return n;
  },
  R3 = ({ color: n, size: u = 14 }) =>
    U.jsx('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      children: U.jsx('text', {
        x: '12',
        y: '16',
        fontSize: '12',
        fill: n,
        textAnchor: 'middle',
        fontWeight: 'bold',
        children: 'H1',
      }),
    }),
  M3 = ({ color: n, size: u = 14 }) =>
    U.jsx('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      children: U.jsx('text', {
        x: '12',
        y: '16',
        fontSize: '11',
        fill: n,
        textAnchor: 'middle',
        fontWeight: 'bold',
        children: 'H2',
      }),
    }),
  j3 = ({ color: n, size: u = 14 }) =>
    U.jsx('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      children: U.jsx('text', {
        x: '12',
        y: '16',
        fontSize: '10',
        fill: n,
        textAnchor: 'middle',
        fontWeight: 'bold',
        children: 'H3',
      }),
    }),
  N3 = ({ color: n, size: u = 14 }) =>
    U.jsx('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      children: U.jsx('text', {
        x: '12',
        y: '16',
        fontSize: '12',
        fill: n,
        textAnchor: 'middle',
        fontWeight: 'bold',
        children: 'T',
      }),
    }),
  z3 = ({ color: n, size: u = 14 }) =>
    U.jsxs('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: n,
      strokeWidth: '2',
      children: [
        U.jsx('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
        U.jsx('polyline', { points: '14 2 14 8 20 8' }),
        U.jsx('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
        U.jsx('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
        U.jsx('polyline', { points: '10 9 9 9 8 9' }),
      ],
    }),
  L3 = ({ color: n, size: u = 14 }) =>
    U.jsxs('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: n,
      strokeWidth: '2',
      children: [
        U.jsx('polyline', { points: '16 18 22 12 16 6' }),
        U.jsx('polyline', { points: '8 6 2 12 8 18' }),
      ],
    }),
  Ug = ({ color: n, size: u = 14 }) =>
    U.jsxs('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: n,
      strokeWidth: '2',
      children: [
        U.jsx('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
        U.jsx('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
        U.jsx('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
        U.jsx('line', { x1: '3', y1: '6', x2: '3.01', y2: '6' }),
        U.jsx('line', { x1: '3', y1: '12', x2: '3.01', y2: '12' }),
        U.jsx('line', { x1: '3', y1: '18', x2: '3.01', y2: '18' }),
      ],
    }),
  H3 = ({ color: n, size: u = 14 }) =>
    U.jsxs('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: n,
      strokeWidth: '2',
      children: [
        U.jsx('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
        U.jsx('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
        U.jsx('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
        U.jsx('path', { d: 'M3 6h1v4' }),
        U.jsx('path', { d: 'M3 10h1v8' }),
      ],
    }),
  U3 = ({ color: n = '#999', size: u = 12 }) =>
    U.jsxs('svg', {
      width: u,
      height: u,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: n,
      strokeWidth: '2',
      children: [
        U.jsx('line', { x1: '9', y1: '18', x2: '15', y2: '18' }),
        U.jsx('line', { x1: '9', y1: '12', x2: '15', y2: '12' }),
        U.jsx('line', { x1: '9', y1: '6', x2: '15', y2: '6' }),
      ],
    }),
  k3 = (n) => {
    switch (n) {
      case ye.HEADING_ONE:
        return R3;
      case ye.HEADING_TWO:
        return M3;
      case ye.HEADING_THREE:
        return j3;
      case ye.BLOCKQUOTE:
        return z3;
      case ye.CODE_BLOCK:
        return L3;
      case ye.BULLETED_LIST:
        return Ug;
      case ye.NUMBERED_LIST:
        return H3;
      case ye.LIST_ITEM:
        return Ug;
      default:
        return N3;
    }
  },
  q3 = (n) => {
    switch (n) {
      case ye.HEADING_ONE:
      case ye.HEADING_TWO:
      case ye.HEADING_THREE:
      case ye.PARAGRAPH:
        return '#1890ff';
      case ye.BLOCKQUOTE:
        return '#faad14';
      case ye.CODE_BLOCK:
        return '#722ed1';
      case ye.BULLETED_LIST:
      case ye.NUMBERED_LIST:
      case ye.LIST_ITEM:
        return '#52c41a';
      default:
        return '#1890ff';
    }
  },
  _3 = () => {
    const { activeElement: n } = T3(),
      { openMenu: u, closeMenu: r, hoveringMenu: l } = Qm(),
      { hasSelection: o } = x3(),
      [c, d] = F.useState(!1),
      h = F.useRef(null),
      v = F.useRef(null);
    (F.useEffect(
      () => () => {
        h.current && clearTimeout(h.current);
      },
      [],
    ),
      F.useEffect(() => {
        o && (d(!1), r());
      }, [o, r]),
      F.useEffect(() => {
        n && (v.current = n);
      }, [n]));
    const D = F.useCallback(
        (w) => {
          var b;
          (h.current && clearTimeout(h.current), d(!0));
          const N = w.currentTarget.getBoundingClientRect();
          u(((b = v.current) == null ? void 0 : b.id) || '', N.left + N.width + 8, N.top);
        },
        [u],
      ),
      p = F.useCallback(() => {
        d(!1);
      }, []);
    F.useEffect(
      () => (
        !n &&
          !c &&
          !l &&
          (h.current = window.setTimeout(() => {
            r();
          }, 200)),
        () => {
          h.current && clearTimeout(h.current);
        }
      ),
      [n, c, l, r],
    );
    const C = (n || c || l) && !o,
      A = n || v.current;
    if (!C || !A) return null;
    const B = k3(A.type),
      S = q3(A.type);
    return U.jsxs('div', {
      'data-docbar-area': !0,
      style: {
        position: 'fixed',
        left: A.rect.left - 52,
        top: A.rect.top + 4,
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1e3,
        pointerEvents: 'auto',
      },
      onMouseEnter: D,
      onMouseLeave: p,
      children: [
        U.jsx('div', {
          style: {
            width: '24px',
            height: '24px',
            border: 'none',
            background: '#fff',
            borderRadius: '4px 0 0 4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '0',
          },
          children: U.jsx(B, { color: S }),
        }),
        U.jsx('div', {
          style: {
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0 4px 4px 0',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.15s ease',
            cursor: 'move',
          },
          children: U.jsx(U3, { color: '#999' }),
        }),
      ],
    });
  },
  Nt = [];
for (let n = 0; n < 256; ++n) Nt.push((n + 256).toString(16).slice(1));
function G3(n, u = 0) {
  return (
    Nt[n[u + 0]] +
    Nt[n[u + 1]] +
    Nt[n[u + 2]] +
    Nt[n[u + 3]] +
    '-' +
    Nt[n[u + 4]] +
    Nt[n[u + 5]] +
    '-' +
    Nt[n[u + 6]] +
    Nt[n[u + 7]] +
    '-' +
    Nt[n[u + 8]] +
    Nt[n[u + 9]] +
    '-' +
    Nt[n[u + 10]] +
    Nt[n[u + 11]] +
    Nt[n[u + 12]] +
    Nt[n[u + 13]] +
    Nt[n[u + 14]] +
    Nt[n[u + 15]]
  ).toLowerCase();
}
const Y3 = new Uint8Array(16);
function V3() {
  return crypto.getRandomValues(Y3);
}
function bu(n, u, r) {
  return crypto.randomUUID ? crypto.randomUUID() : P3(n);
}
function P3(n, u, r) {
  var o;
  n = n || {};
  const l = n.random ?? ((o = n.rng) == null ? void 0 : o.call(n)) ?? V3();
  if (l.length < 16) throw new Error('Random bytes length must be >= 16');
  return ((l[6] = (l[6] & 15) | 64), (l[8] = (l[8] & 63) | 128), G3(l));
}
const K3 = [
    { type: ye.HEADING_ONE, id: bu(), children: [{ text: '欢迎使用文档编辑器' }] },
    {
      type: ye.PARAGRAPH,
      id: bu(),
      style: { lineHeight: '1.8' },
      attrs: { customData: 'intro-content' },
      children: [
        {
          text: '这是一个基于 Slate 构建的文档编辑器。支持富文本编辑，包括标题、段落、列表、引用等功能。',
        },
      ],
    },
    { type: ye.HEADING_TWO, id: bu(), children: [{ text: '主要功能' }] },
    {
      type: ye.PARAGRAPH,
      id: bu(),
      children: [
        {
          text: '支持多种标题级别、粗体斜体下划线格式化、有序列表和无序列表、代码块和行内代码、引用块等功能。',
        },
      ],
    },
    { type: ye.HEADING_TWO, id: bu(), children: [{ text: '引用示例' }] },
    {
      type: ye.BLOCKQUOTE,
      id: bu(),
      attrs: { cite: 'https://example.com' },
      children: [{ text: '这是一段引用文字。引用功能可以用来强调重要内容或引用他人观点。' }],
    },
    { type: ye.HEADING_TWO, id: bu(), children: [{ text: '代码示例' }] },
    {
      type: ye.CODE_BLOCK,
      id: bu(),
      attrs: { language: 'javascript' },
      children: [{ text: 'console.log("Hello, World!");' }],
    },
    { type: ye.HEADING_THREE, id: bu(), children: [{ text: '小标题示例' }] },
    {
      type: ye.PARAGRAPH,
      id: bu(),
      children: [
        {
          text: '你可以使用工具栏中的按钮来格式化文本。选中文字后点击相应的格式按钮即可应用样式。',
        },
      ],
    },
  ],
  Wm = new Map([
    [ye.HEADING_ONE, ye.PARAGRAPH],
    [ye.HEADING_TWO, ye.PARAGRAPH],
    [ye.HEADING_THREE, ye.PARAGRAPH],
  ]),
  X3 = (n) => Wm.has(n),
  Q3 = (n) => Wm.get(n) || ye.PARAGRAPH,
  Jm = (n) =>
    n
      ? n.anchor.path.length === n.focus.path.length &&
        n.anchor.path.every((u, r) => u === n.focus.path[r]) &&
        n.anchor.offset === n.focus.offset
      : !1,
  Z3 = (n, u) => {
    const { selection: r } = n;
    if (!r || !Jm(r)) return !1;
    const l = E.end(n, u);
    return Ke.equals(r.anchor, l);
  },
  $3 = (n) => {
    const { selection: u } = n;
    if (!u || !Jm(u)) return !1;
    const r = E.above(n, { match: (D) => E.isBlock(n, D), mode: 'lowest' });
    if (!r) return !1;
    const [l, o] = r,
      c = l == null ? void 0 : l.type;
    if (!X3(c) || !Z3(n, o)) return !1;
    const h = { type: Q3(c), id: bu(), children: [{ text: '' }] },
      v = T.next(o);
    return (
      le.insertNodes(n, h, { at: v }),
      le.select(n, {
        anchor: { path: [...v, 0], offset: 0 },
        focus: { path: [...v, 0], offset: 0 },
      }),
      !0
    );
  },
  W3 = (n) => {
    $3(n) || n.insertBreak();
  },
  J3 = (n) => (u) => {
    if (u.key === 'Enter' && !u.shiftKey) {
      (u.preventDefault(), W3(n));
      return;
    }
  };
function I3() {
  const n = Vm(),
    [u, r] = F.useState(!1),
    [l, o] = F.useState({ x: 0, y: 0 }),
    [c, d] = F.useState(null),
    h = F.useRef(null),
    v = F.useCallback(() => {
      const C = window.getSelection();
      if (!C || C.isCollapsed) {
        r(!1);
        return;
      }
      const B = C.getRangeAt(0).getBoundingClientRect(),
        S = B.left + B.width / 2 - 180,
        w = B.top - 44;
      (o({ x: Math.max(20, Math.min(S, window.innerWidth - 380)), y: Math.max(20, w) }), r(!0));
    }, []);
  if (
    (F.useEffect(() => {
      const C = () => {
          (h.current && clearTimeout(h.current),
            (h.current = window.setTimeout(() => {
              v();
            }, 50)));
        },
        A = () => {
          const S = window.getSelection();
          (!S || S.isCollapsed) && r(!1);
        },
        B = (S) => {
          S.target.closest('.float-bar') || (r(!1), d(null));
        };
      return (
        document.addEventListener('mouseup', C),
        document.addEventListener('selectionchange', A),
        document.addEventListener('click', B),
        () => {
          (document.removeEventListener('mouseup', C),
            document.removeEventListener('selectionchange', A),
            document.removeEventListener('click', B),
            h.current && clearTimeout(h.current));
        }
      );
    }, [v]),
    !u)
  )
    return null;
  const D = (C, A) => {
      const B = window.getSelection();
      (B && !B.isCollapsed && (A ? c3(n, C) : h3(n, C)), d(null));
    },
    p = ({ icon: C, label: A, onClick: B, hasDropdown: S }) =>
      U.jsxs('button', {
        onClick: B,
        style: {
          padding: '6px 8px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          color: '#333',
        },
        onMouseEnter: (w) => (w.currentTarget.style.backgroundColor = '#f5f5f5'),
        onMouseLeave: (w) => (w.currentTarget.style.backgroundColor = 'transparent'),
        children: [
          C,
          A && U.jsx('span', { style: { fontSize: '12px' }, children: A }),
          S && U.jsx('span', { style: { fontSize: '10px', color: '#999' }, children: '▼' }),
        ],
      });
  return U.jsx('div', {
    className: 'float-bar',
    children: U.jsxs('div', {
      style: {
        position: 'fixed',
        left: l.x,
        top: l.y,
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '2px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        zIndex: 1e4,
      },
      children: [
        U.jsxs('div', {
          style: { position: 'relative' },
          children: [
            U.jsx(p, {
              icon: 'T',
              onClick: () => d(c === 'text' ? null : 'text'),
              hasDropdown: !0,
            }),
            c === 'text' &&
              U.jsxs('div', {
                style: {
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  backgroundColor: '#fff',
                  border: '1px solid #e8e8e8',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  padding: '4px',
                  minWidth: '200px',
                  zIndex: 10001,
                },
                children: [
                  U.jsx('div', {
                    style: {
                      padding: '4px 8px',
                      fontSize: '12px',
                      color: '#999',
                      fontWeight: '600',
                    },
                    children: '标题',
                  }),
                  U.jsx('button', {
                    onClick: () => {
                      (D(ye.HEADING_ONE, !1), d(null));
                    },
                    style: {
                      width: '100%',
                      padding: '6px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                    },
                    onMouseEnter: (C) => (C.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: 'H1 标题',
                  }),
                  U.jsx('button', {
                    onClick: () => {
                      (D(ye.HEADING_TWO, !1), d(null));
                    },
                    style: {
                      width: '100%',
                      padding: '6px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                    },
                    onMouseEnter: (C) => (C.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: 'H2 标题',
                  }),
                  U.jsx('button', {
                    onClick: () => {
                      (D(ye.HEADING_THREE, !1), d(null));
                    },
                    style: {
                      width: '100%',
                      padding: '6px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                    },
                    onMouseEnter: (C) => (C.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: 'H3 标题',
                  }),
                  U.jsx('div', {
                    style: { height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' },
                  }),
                  U.jsx('button', {
                    onClick: () => {
                      (D(ye.PARAGRAPH, !1), d(null));
                    },
                    style: {
                      width: '100%',
                      padding: '6px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      borderRadius: '4px',
                    },
                    onMouseEnter: (C) => (C.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: '正文',
                  }),
                ],
              }),
          ],
        }),
        U.jsxs('div', {
          style: { position: 'relative' },
          children: [
            U.jsx(p, {
              icon: '☰',
              onClick: () => d(c === 'list' ? null : 'list'),
              hasDropdown: !0,
            }),
            c === 'list' &&
              U.jsxs('div', {
                style: {
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  backgroundColor: '#fff',
                  border: '1px solid #e8e8e8',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  padding: '4px',
                  minWidth: '160px',
                  zIndex: 10001,
                },
                children: [
                  U.jsx('button', {
                    onClick: () => {
                      (D(ye.BULLETED_LIST, !1), d(null));
                    },
                    style: {
                      width: '100%',
                      padding: '6px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      borderRadius: '4px',
                    },
                    onMouseEnter: (C) => (C.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: '• 无序列表',
                  }),
                  U.jsx('button', {
                    onClick: () => {
                      (D(ye.NUMBERED_LIST, !1), d(null));
                    },
                    style: {
                      width: '100%',
                      padding: '6px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      borderRadius: '4px',
                    },
                    onMouseEnter: (C) => (C.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: '1. 有序列表',
                  }),
                ],
              }),
          ],
        }),
        U.jsx('div', {
          style: { width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' },
        }),
        U.jsx(p, {
          icon: U.jsx('span', { style: { fontWeight: 'bold' }, children: 'B' }),
          onClick: () => D(Ji.BOLD, !0),
        }),
        U.jsx(p, {
          icon: U.jsx('span', { style: { fontStyle: 'italic' }, children: 'I' }),
          onClick: () => D(Ji.ITALIC, !0),
        }),
        U.jsx(p, {
          icon: U.jsx('span', { style: { textDecoration: 'underline' }, children: 'U' }),
          onClick: () => D(Ji.UNDERLINE, !0),
        }),
        U.jsx('div', {
          style: { width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' },
        }),
        U.jsx(p, { icon: '{', onClick: () => D(Ji.CODE, !0) }),
        U.jsx(p, { icon: '“', onClick: () => D(ye.BLOCKQUOTE, !1) }),
        U.jsx(p, { icon: '</>', onClick: () => D(ye.CODE_BLOCK, !1) }),
        U.jsx('div', {
          style: { width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' },
        }),
        U.jsx(p, { icon: '🔗', onClick: () => {} }),
        U.jsx(p, { icon: '💬', onClick: () => {} }),
      ],
    }),
  });
}
const e8 = ({ element: n, attributes: u, children: r }) => {
    const l = n;
    switch (l.type) {
      case ye.HEADING_ONE:
        return U.jsx(g3, { attributes: u, children: r, pluginId: l.id });
      case ye.HEADING_TWO:
        return U.jsx(m3, { attributes: u, children: r, pluginId: l.id });
      case ye.HEADING_THREE:
        return U.jsx(p3, { attributes: u, children: r, pluginId: l.id });
      case ye.BLOCKQUOTE:
        return U.jsx(C3, { attributes: u, children: r, pluginId: l.id });
      case ye.CODE_BLOCK:
        return U.jsx(E3, { attributes: u, children: r, pluginId: l.id });
      case ye.LIST_ITEM:
        return U.jsx(B3, { attributes: u, children: r, pluginId: l.id });
      case ye.NUMBERED_LIST:
        return U.jsx(A3, { attributes: u, children: r, pluginId: l.id });
      case ye.BULLETED_LIST:
        return U.jsx(y3, { attributes: u, children: r, pluginId: l.id });
      default:
        return U.jsx(v3, { attributes: u, children: r, pluginId: l.id });
    }
  },
  t8 = (n) => U.jsx(b3, { ...n });
function u8() {
  const n = F.useMemo(() => o3(r3(SB())), []),
    u = F.useCallback(J3(n), [n]);
  return U.jsx(a3, {
    editor: n,
    initialValue: K3,
    children: U.jsx(S3, {
      children: U.jsxs(F3, {
        children: [
          U.jsx(I3, {}),
          U.jsx(O3, {}),
          U.jsxs(w3, {
            children: [
              U.jsx(_3, {}),
              U.jsx('div', {
                style: {
                  maxWidth: '800px',
                  margin: '0 auto',
                  padding: '40px 48px 40px 72px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  minHeight: '500px',
                },
                children: U.jsx(W2, {
                  renderElement: e8,
                  renderLeaf: t8,
                  placeholder: '开始编写文档...',
                  style: { minHeight: '500px', outline: 'none' },
                  onKeyDown: u,
                }),
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
function n8() {
  return U.jsxs('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    },
    children: [
      U.jsx('div', {
        style: { fontSize: '120px', fontWeight: 'bold', color: '#1890ff', marginBottom: '20px' },
        children: '404',
      }),
      U.jsx('div', {
        style: { fontSize: '24px', color: '#333', marginBottom: '10px' },
        children: '页面未找到',
      }),
      U.jsx('div', {
        style: { fontSize: '14px', color: '#999', marginBottom: '30px' },
        children: '您访问的页面不存在或已被删除',
      }),
      U.jsx(Tc, {
        to: '/',
        style: {
          padding: '10px 30px',
          backgroundColor: '#1890ff',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
        },
        children: '返回首页',
      }),
    ],
  });
}
function a8() {
  return U.jsx(PE, {
    children: U.jsxs(yE, {
      children: [
        U.jsx(sc, { path: '/', element: U.jsx(u8, {}) }),
        U.jsx(sc, { path: '*', element: U.jsx(n8, {}) }),
      ],
    }),
  });
}
yC.createRoot(document.getElementById('root')).render(
  U.jsx(F.StrictMode, { children: U.jsx(a8, {}) }),
);
