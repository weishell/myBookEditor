(function () {
  const u = document.createElement('link').relList;
  if (u && u.supports && u.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) l(s);
  new MutationObserver((s) => {
    for (const c of s)
      if (c.type === 'childList')
        for (const D of c.addedNodes) D.tagName === 'LINK' && D.rel === 'modulepreload' && l(D);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(s) {
    const c = {};
    return (
      s.integrity && (c.integrity = s.integrity),
      s.referrerPolicy && (c.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (c.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (c.credentials = 'omit')
          : (c.credentials = 'same-origin'),
      c
    );
  }
  function l(s) {
    if (s.ep) return;
    s.ep = !0;
    const c = r(s);
    fetch(s.href, c);
  }
})();
var Oi =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof self < 'u'
          ? self
          : {};
function sl(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, 'default') ? n.default : n;
}
var io = { exports: {} },
  Qr = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var av;
function Im() {
  if (av) return Qr;
  av = 1;
  var n = Symbol.for('react.transitional.element'),
    u = Symbol.for('react.fragment');
  function r(l, s, c) {
    var D = null;
    if ((c !== void 0 && (D = '' + c), s.key !== void 0 && (D = '' + s.key), 'key' in s)) {
      c = {};
      for (var d in s) d !== 'key' && (c[d] = s[d]);
    } else c = s;
    return ((s = c.ref), { $$typeof: n, type: l, key: D, ref: s !== void 0 ? s : null, props: c });
  }
  return ((Qr.Fragment = u), (Qr.jsx = r), (Qr.jsxs = r), Qr);
}
var rv;
function eC() {
  return (rv || ((rv = 1), (io.exports = Im())), io.exports);
}
var X = eC(),
  so = { exports: {} },
  Te = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var lv;
function tC() {
  if (lv) return Te;
  lv = 1;
  var n = Symbol.for('react.transitional.element'),
    u = Symbol.for('react.portal'),
    r = Symbol.for('react.fragment'),
    l = Symbol.for('react.strict_mode'),
    s = Symbol.for('react.profiler'),
    c = Symbol.for('react.consumer'),
    D = Symbol.for('react.context'),
    d = Symbol.for('react.forward_ref'),
    g = Symbol.for('react.suspense'),
    h = Symbol.for('react.memo'),
    E = Symbol.for('react.lazy'),
    A = Symbol.for('react.activity'),
    B = Symbol.iterator;
  function F(y) {
    return y === null || typeof y != 'object'
      ? null
      : ((y = (B && y[B]) || y['@@iterator']), typeof y == 'function' ? y : null);
  }
  var M = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    z = Object.assign,
    V = {};
  function x(y, q, K) {
    ((this.props = y), (this.context = q), (this.refs = V), (this.updater = K || M));
  }
  ((x.prototype.isReactComponent = {}),
    (x.prototype.setState = function (y, q) {
      if (typeof y != 'object' && typeof y != 'function' && y != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, y, q, 'setState');
    }),
    (x.prototype.forceUpdate = function (y) {
      this.updater.enqueueForceUpdate(this, y, 'forceUpdate');
    }));
  function m() {}
  m.prototype = x.prototype;
  function N(y, q, K) {
    ((this.props = y), (this.context = q), (this.refs = V), (this.updater = K || M));
  }
  var _ = (N.prototype = new m());
  ((_.constructor = N), z(_, x.prototype), (_.isPureReactComponent = !0));
  var J = Array.isArray;
  function le() {}
  var P = { H: null, A: null, T: null, S: null },
    se = Object.prototype.hasOwnProperty;
  function fe(y, q, K) {
    var W = K.ref;
    return { $$typeof: n, type: y, key: q, ref: W !== void 0 ? W : null, props: K };
  }
  function ve(y, q) {
    return fe(y.type, q, y.props);
  }
  function de(y) {
    return typeof y == 'object' && y !== null && y.$$typeof === n;
  }
  function ee(y) {
    var q = { '=': '=0', ':': '=2' };
    return (
      '$' +
      y.replace(/[=:]/g, function (K) {
        return q[K];
      })
    );
  }
  var Z = /\/+/g;
  function ne(y, q) {
    return typeof y == 'object' && y !== null && y.key != null ? ee('' + y.key) : q.toString(36);
  }
  function ae(y) {
    switch (y.status) {
      case 'fulfilled':
        return y.value;
      case 'rejected':
        throw y.reason;
      default:
        switch (
          (typeof y.status == 'string'
            ? y.then(le, le)
            : ((y.status = 'pending'),
              y.then(
                function (q) {
                  y.status === 'pending' && ((y.status = 'fulfilled'), (y.value = q));
                },
                function (q) {
                  y.status === 'pending' && ((y.status = 'rejected'), (y.reason = q));
                },
              )),
          y.status)
        ) {
          case 'fulfilled':
            return y.value;
          case 'rejected':
            throw y.reason;
        }
    }
    throw y;
  }
  function R(y, q, K, W, ge) {
    var Ae = typeof y;
    (Ae === 'undefined' || Ae === 'boolean') && (y = null);
    var xe = !1;
    if (y === null) xe = !0;
    else
      switch (Ae) {
        case 'bigint':
        case 'string':
        case 'number':
          xe = !0;
          break;
        case 'object':
          switch (y.$$typeof) {
            case n:
            case u:
              xe = !0;
              break;
            case E:
              return ((xe = y._init), R(xe(y._payload), q, K, W, ge));
          }
      }
    if (xe)
      return (
        (ge = ge(y)),
        (xe = W === '' ? '.' + ne(y, 0) : W),
        J(ge)
          ? ((K = ''),
            xe != null && (K = xe.replace(Z, '$&/') + '/'),
            R(ge, q, K, '', function (w) {
              return w;
            }))
          : ge != null &&
            (de(ge) &&
              (ge = ve(
                ge,
                K +
                  (ge.key == null || (y && y.key === ge.key)
                    ? ''
                    : ('' + ge.key).replace(Z, '$&/') + '/') +
                  xe,
              )),
            q.push(ge)),
        1
      );
    xe = 0;
    var Ke = W === '' ? '.' : W + ':';
    if (J(y))
      for (var ze = 0; ze < y.length; ze++)
        ((W = y[ze]), (Ae = Ke + ne(W, ze)), (xe += R(W, q, K, Ae, ge)));
    else if (((ze = F(y)), typeof ze == 'function'))
      for (y = ze.call(y), ze = 0; !(W = y.next()).done;)
        ((W = W.value), (Ae = Ke + ne(W, ze++)), (xe += R(W, q, K, Ae, ge)));
    else if (Ae === 'object') {
      if (typeof y.then == 'function') return R(ae(y), q, K, W, ge);
      throw (
        (q = String(y)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (q === '[object Object]' ? 'object with keys {' + Object.keys(y).join(', ') + '}' : q) +
            '). If you meant to render a collection of children, use an array instead.',
        )
      );
    }
    return xe;
  }
  function G(y, q, K) {
    if (y == null) return y;
    var W = [],
      ge = 0;
    return (
      R(y, W, '', '', function (Ae) {
        return q.call(K, Ae, ge++);
      }),
      W
    );
  }
  function De(y) {
    if (y._status === -1) {
      var q = y._result;
      ((q = q()),
        q.then(
          function (K) {
            (y._status === 0 || y._status === -1) && ((y._status = 1), (y._result = K));
          },
          function (K) {
            (y._status === 0 || y._status === -1) && ((y._status = 2), (y._result = K));
          },
        ),
        y._status === -1 && ((y._status = 0), (y._result = q)));
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var he =
      typeof reportError == 'function'
        ? reportError
        : function (y) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var q = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof y == 'object' && y !== null && typeof y.message == 'string'
                    ? String(y.message)
                    : String(y),
                error: y,
              });
              if (!window.dispatchEvent(q)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', y);
              return;
            }
            console.error(y);
          },
    Ce = {
      map: G,
      forEach: function (y, q, K) {
        G(
          y,
          function () {
            q.apply(this, arguments);
          },
          K,
        );
      },
      count: function (y) {
        var q = 0;
        return (
          G(y, function () {
            q++;
          }),
          q
        );
      },
      toArray: function (y) {
        return (
          G(y, function (q) {
            return q;
          }) || []
        );
      },
      only: function (y) {
        if (!de(y))
          throw Error('React.Children.only expected to receive a single React element child.');
        return y;
      },
    };
  return (
    (Te.Activity = A),
    (Te.Children = Ce),
    (Te.Component = x),
    (Te.Fragment = r),
    (Te.Profiler = s),
    (Te.PureComponent = N),
    (Te.StrictMode = l),
    (Te.Suspense = g),
    (Te.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P),
    (Te.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (y) {
        return P.H.useMemoCache(y);
      },
    }),
    (Te.cache = function (y) {
      return function () {
        return y.apply(null, arguments);
      };
    }),
    (Te.cacheSignal = function () {
      return null;
    }),
    (Te.cloneElement = function (y, q, K) {
      if (y == null) throw Error('The argument must be a React element, but you passed ' + y + '.');
      var W = z({}, y.props),
        ge = y.key;
      if (q != null)
        for (Ae in (q.key !== void 0 && (ge = '' + q.key), q))
          !se.call(q, Ae) ||
            Ae === 'key' ||
            Ae === '__self' ||
            Ae === '__source' ||
            (Ae === 'ref' && q.ref === void 0) ||
            (W[Ae] = q[Ae]);
      var Ae = arguments.length - 2;
      if (Ae === 1) W.children = K;
      else if (1 < Ae) {
        for (var xe = Array(Ae), Ke = 0; Ke < Ae; Ke++) xe[Ke] = arguments[Ke + 2];
        W.children = xe;
      }
      return fe(y.type, ge, W);
    }),
    (Te.createContext = function (y) {
      return (
        (y = {
          $$typeof: D,
          _currentValue: y,
          _currentValue2: y,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (y.Provider = y),
        (y.Consumer = { $$typeof: c, _context: y }),
        y
      );
    }),
    (Te.createElement = function (y, q, K) {
      var W,
        ge = {},
        Ae = null;
      if (q != null)
        for (W in (q.key !== void 0 && (Ae = '' + q.key), q))
          se.call(q, W) && W !== 'key' && W !== '__self' && W !== '__source' && (ge[W] = q[W]);
      var xe = arguments.length - 2;
      if (xe === 1) ge.children = K;
      else if (1 < xe) {
        for (var Ke = Array(xe), ze = 0; ze < xe; ze++) Ke[ze] = arguments[ze + 2];
        ge.children = Ke;
      }
      if (y && y.defaultProps)
        for (W in ((xe = y.defaultProps), xe)) ge[W] === void 0 && (ge[W] = xe[W]);
      return fe(y, Ae, ge);
    }),
    (Te.createRef = function () {
      return { current: null };
    }),
    (Te.forwardRef = function (y) {
      return { $$typeof: d, render: y };
    }),
    (Te.isValidElement = de),
    (Te.lazy = function (y) {
      return { $$typeof: E, _payload: { _status: -1, _result: y }, _init: De };
    }),
    (Te.memo = function (y, q) {
      return { $$typeof: h, type: y, compare: q === void 0 ? null : q };
    }),
    (Te.startTransition = function (y) {
      var q = P.T,
        K = {};
      P.T = K;
      try {
        var W = y(),
          ge = P.S;
        (ge !== null && ge(K, W),
          typeof W == 'object' && W !== null && typeof W.then == 'function' && W.then(le, he));
      } catch (Ae) {
        he(Ae);
      } finally {
        (q !== null && K.types !== null && (q.types = K.types), (P.T = q));
      }
    }),
    (Te.unstable_useCacheRefresh = function () {
      return P.H.useCacheRefresh();
    }),
    (Te.use = function (y) {
      return P.H.use(y);
    }),
    (Te.useActionState = function (y, q, K) {
      return P.H.useActionState(y, q, K);
    }),
    (Te.useCallback = function (y, q) {
      return P.H.useCallback(y, q);
    }),
    (Te.useContext = function (y) {
      return P.H.useContext(y);
    }),
    (Te.useDebugValue = function () {}),
    (Te.useDeferredValue = function (y, q) {
      return P.H.useDeferredValue(y, q);
    }),
    (Te.useEffect = function (y, q) {
      return P.H.useEffect(y, q);
    }),
    (Te.useEffectEvent = function (y) {
      return P.H.useEffectEvent(y);
    }),
    (Te.useId = function () {
      return P.H.useId();
    }),
    (Te.useImperativeHandle = function (y, q, K) {
      return P.H.useImperativeHandle(y, q, K);
    }),
    (Te.useInsertionEffect = function (y, q) {
      return P.H.useInsertionEffect(y, q);
    }),
    (Te.useLayoutEffect = function (y, q) {
      return P.H.useLayoutEffect(y, q);
    }),
    (Te.useMemo = function (y, q) {
      return P.H.useMemo(y, q);
    }),
    (Te.useOptimistic = function (y, q) {
      return P.H.useOptimistic(y, q);
    }),
    (Te.useReducer = function (y, q, K) {
      return P.H.useReducer(y, q, K);
    }),
    (Te.useRef = function (y) {
      return P.H.useRef(y);
    }),
    (Te.useState = function (y) {
      return P.H.useState(y);
    }),
    (Te.useSyncExternalStore = function (y, q, K) {
      return P.H.useSyncExternalStore(y, q, K);
    }),
    (Te.useTransition = function () {
      return P.H.useTransition();
    }),
    (Te.version = '19.2.7'),
    Te
  );
}
var iv;
function Qo() {
  return (iv || ((iv = 1), (so.exports = tC())), so.exports);
}
var k = Qo();
const Oe = sl(k);
var fo = { exports: {} },
  Zr = {},
  oo = { exports: {} },
  co = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var sv;
function uC() {
  return (
    sv ||
      ((sv = 1),
      (function (n) {
        function u(R, G) {
          var De = R.length;
          R.push(G);
          e: for (; 0 < De;) {
            var he = (De - 1) >>> 1,
              Ce = R[he];
            if (0 < s(Ce, G)) ((R[he] = G), (R[De] = Ce), (De = he));
            else break e;
          }
        }
        function r(R) {
          return R.length === 0 ? null : R[0];
        }
        function l(R) {
          if (R.length === 0) return null;
          var G = R[0],
            De = R.pop();
          if (De !== G) {
            R[0] = De;
            e: for (var he = 0, Ce = R.length, y = Ce >>> 1; he < y;) {
              var q = 2 * (he + 1) - 1,
                K = R[q],
                W = q + 1,
                ge = R[W];
              if (0 > s(K, De))
                W < Ce && 0 > s(ge, K)
                  ? ((R[he] = ge), (R[W] = De), (he = W))
                  : ((R[he] = K), (R[q] = De), (he = q));
              else if (W < Ce && 0 > s(ge, De)) ((R[he] = ge), (R[W] = De), (he = W));
              else break e;
            }
          }
          return G;
        }
        function s(R, G) {
          var De = R.sortIndex - G.sortIndex;
          return De !== 0 ? De : R.id - G.id;
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
          var D = Date,
            d = D.now();
          n.unstable_now = function () {
            return D.now() - d;
          };
        }
        var g = [],
          h = [],
          E = 1,
          A = null,
          B = 3,
          F = !1,
          M = !1,
          z = !1,
          V = !1,
          x = typeof setTimeout == 'function' ? setTimeout : null,
          m = typeof clearTimeout == 'function' ? clearTimeout : null,
          N = typeof setImmediate < 'u' ? setImmediate : null;
        function _(R) {
          for (var G = r(h); G !== null;) {
            if (G.callback === null) l(h);
            else if (G.startTime <= R) (l(h), (G.sortIndex = G.expirationTime), u(g, G));
            else break;
            G = r(h);
          }
        }
        function J(R) {
          if (((z = !1), _(R), !M))
            if (r(g) !== null) ((M = !0), le || ((le = !0), ee()));
            else {
              var G = r(h);
              G !== null && ae(J, G.startTime - R);
            }
        }
        var le = !1,
          P = -1,
          se = 5,
          fe = -1;
        function ve() {
          return V ? !0 : !(n.unstable_now() - fe < se);
        }
        function de() {
          if (((V = !1), le)) {
            var R = n.unstable_now();
            fe = R;
            var G = !0;
            try {
              e: {
                ((M = !1), z && ((z = !1), m(P), (P = -1)), (F = !0));
                var De = B;
                try {
                  t: {
                    for (_(R), A = r(g); A !== null && !(A.expirationTime > R && ve());) {
                      var he = A.callback;
                      if (typeof he == 'function') {
                        ((A.callback = null), (B = A.priorityLevel));
                        var Ce = he(A.expirationTime <= R);
                        if (((R = n.unstable_now()), typeof Ce == 'function')) {
                          ((A.callback = Ce), _(R), (G = !0));
                          break t;
                        }
                        (A === r(g) && l(g), _(R));
                      } else l(g);
                      A = r(g);
                    }
                    if (A !== null) G = !0;
                    else {
                      var y = r(h);
                      (y !== null && ae(J, y.startTime - R), (G = !1));
                    }
                  }
                  break e;
                } finally {
                  ((A = null), (B = De), (F = !1));
                }
                G = void 0;
              }
            } finally {
              G ? ee() : (le = !1);
            }
          }
        }
        var ee;
        if (typeof N == 'function')
          ee = function () {
            N(de);
          };
        else if (typeof MessageChannel < 'u') {
          var Z = new MessageChannel(),
            ne = Z.port2;
          ((Z.port1.onmessage = de),
            (ee = function () {
              ne.postMessage(null);
            }));
        } else
          ee = function () {
            x(de, 0);
          };
        function ae(R, G) {
          P = x(function () {
            R(n.unstable_now());
          }, G);
        }
        ((n.unstable_IdlePriority = 5),
          (n.unstable_ImmediatePriority = 1),
          (n.unstable_LowPriority = 4),
          (n.unstable_NormalPriority = 3),
          (n.unstable_Profiling = null),
          (n.unstable_UserBlockingPriority = 2),
          (n.unstable_cancelCallback = function (R) {
            R.callback = null;
          }),
          (n.unstable_forceFrameRate = function (R) {
            0 > R || 125 < R
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (se = 0 < R ? Math.floor(1e3 / R) : 5);
          }),
          (n.unstable_getCurrentPriorityLevel = function () {
            return B;
          }),
          (n.unstable_next = function (R) {
            switch (B) {
              case 1:
              case 2:
              case 3:
                var G = 3;
                break;
              default:
                G = B;
            }
            var De = B;
            B = G;
            try {
              return R();
            } finally {
              B = De;
            }
          }),
          (n.unstable_requestPaint = function () {
            V = !0;
          }),
          (n.unstable_runWithPriority = function (R, G) {
            switch (R) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                R = 3;
            }
            var De = B;
            B = R;
            try {
              return G();
            } finally {
              B = De;
            }
          }),
          (n.unstable_scheduleCallback = function (R, G, De) {
            var he = n.unstable_now();
            switch (
              (typeof De == 'object' && De !== null
                ? ((De = De.delay), (De = typeof De == 'number' && 0 < De ? he + De : he))
                : (De = he),
              R)
            ) {
              case 1:
                var Ce = -1;
                break;
              case 2:
                Ce = 250;
                break;
              case 5:
                Ce = 1073741823;
                break;
              case 4:
                Ce = 1e4;
                break;
              default:
                Ce = 5e3;
            }
            return (
              (Ce = De + Ce),
              (R = {
                id: E++,
                callback: G,
                priorityLevel: R,
                startTime: De,
                expirationTime: Ce,
                sortIndex: -1,
              }),
              De > he
                ? ((R.sortIndex = De),
                  u(h, R),
                  r(g) === null && R === r(h) && (z ? (m(P), (P = -1)) : (z = !0), ae(J, De - he)))
                : ((R.sortIndex = Ce), u(g, R), M || F || ((M = !0), le || ((le = !0), ee()))),
              R
            );
          }),
          (n.unstable_shouldYield = ve),
          (n.unstable_wrapCallback = function (R) {
            var G = B;
            return function () {
              var De = B;
              B = G;
              try {
                return R.apply(this, arguments);
              } finally {
                B = De;
              }
            };
          }));
      })(co)),
    co
  );
}
var fv;
function nC() {
  return (fv || ((fv = 1), (oo.exports = uC())), oo.exports);
}
var Do = { exports: {} },
  Nt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ov;
function aC() {
  if (ov) return Nt;
  ov = 1;
  var n = Qo();
  function u(g) {
    var h = 'https://react.dev/errors/' + g;
    if (1 < arguments.length) {
      h += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var E = 2; E < arguments.length; E++) h += '&args[]=' + encodeURIComponent(arguments[E]);
    }
    return (
      'Minified React error #' +
      g +
      '; visit ' +
      h +
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
    s = Symbol.for('react.portal');
  function c(g, h, E) {
    var A = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: s,
      key: A == null ? null : '' + A,
      children: g,
      containerInfo: h,
      implementation: E,
    };
  }
  var D = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function d(g, h) {
    if (g === 'font') return '';
    if (typeof h == 'string') return h === 'use-credentials' ? h : '';
  }
  return (
    (Nt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l),
    (Nt.createPortal = function (g, h) {
      var E = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!h || (h.nodeType !== 1 && h.nodeType !== 9 && h.nodeType !== 11)) throw Error(u(299));
      return c(g, h, null, E);
    }),
    (Nt.flushSync = function (g) {
      var h = D.T,
        E = l.p;
      try {
        if (((D.T = null), (l.p = 2), g)) return g();
      } finally {
        ((D.T = h), (l.p = E), l.d.f());
      }
    }),
    (Nt.preconnect = function (g, h) {
      typeof g == 'string' &&
        (h
          ? ((h = h.crossOrigin),
            (h = typeof h == 'string' ? (h === 'use-credentials' ? h : '') : void 0))
          : (h = null),
        l.d.C(g, h));
    }),
    (Nt.prefetchDNS = function (g) {
      typeof g == 'string' && l.d.D(g);
    }),
    (Nt.preinit = function (g, h) {
      if (typeof g == 'string' && h && typeof h.as == 'string') {
        var E = h.as,
          A = d(E, h.crossOrigin),
          B = typeof h.integrity == 'string' ? h.integrity : void 0,
          F = typeof h.fetchPriority == 'string' ? h.fetchPriority : void 0;
        E === 'style'
          ? l.d.S(g, typeof h.precedence == 'string' ? h.precedence : void 0, {
              crossOrigin: A,
              integrity: B,
              fetchPriority: F,
            })
          : E === 'script' &&
            l.d.X(g, {
              crossOrigin: A,
              integrity: B,
              fetchPriority: F,
              nonce: typeof h.nonce == 'string' ? h.nonce : void 0,
            });
      }
    }),
    (Nt.preinitModule = function (g, h) {
      if (typeof g == 'string')
        if (typeof h == 'object' && h !== null) {
          if (h.as == null || h.as === 'script') {
            var E = d(h.as, h.crossOrigin);
            l.d.M(g, {
              crossOrigin: E,
              integrity: typeof h.integrity == 'string' ? h.integrity : void 0,
              nonce: typeof h.nonce == 'string' ? h.nonce : void 0,
            });
          }
        } else h == null && l.d.M(g);
    }),
    (Nt.preload = function (g, h) {
      if (typeof g == 'string' && typeof h == 'object' && h !== null && typeof h.as == 'string') {
        var E = h.as,
          A = d(E, h.crossOrigin);
        l.d.L(g, E, {
          crossOrigin: A,
          integrity: typeof h.integrity == 'string' ? h.integrity : void 0,
          nonce: typeof h.nonce == 'string' ? h.nonce : void 0,
          type: typeof h.type == 'string' ? h.type : void 0,
          fetchPriority: typeof h.fetchPriority == 'string' ? h.fetchPriority : void 0,
          referrerPolicy: typeof h.referrerPolicy == 'string' ? h.referrerPolicy : void 0,
          imageSrcSet: typeof h.imageSrcSet == 'string' ? h.imageSrcSet : void 0,
          imageSizes: typeof h.imageSizes == 'string' ? h.imageSizes : void 0,
          media: typeof h.media == 'string' ? h.media : void 0,
        });
      }
    }),
    (Nt.preloadModule = function (g, h) {
      if (typeof g == 'string')
        if (h) {
          var E = d(h.as, h.crossOrigin);
          l.d.m(g, {
            as: typeof h.as == 'string' && h.as !== 'script' ? h.as : void 0,
            crossOrigin: E,
            integrity: typeof h.integrity == 'string' ? h.integrity : void 0,
          });
        } else l.d.m(g);
    }),
    (Nt.requestFormReset = function (g) {
      l.d.r(g);
    }),
    (Nt.unstable_batchedUpdates = function (g, h) {
      return g(h);
    }),
    (Nt.useFormState = function (g, h, E) {
      return D.H.useFormState(g, h, E);
    }),
    (Nt.useFormStatus = function () {
      return D.H.useHostTransitionStatus();
    }),
    (Nt.version = '19.2.7'),
    Nt
  );
}
var cv;
function Zh() {
  if (cv) return Do.exports;
  cv = 1;
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
  return (n(), (Do.exports = aC()), Do.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var dv;
function rC() {
  if (dv) return Zr;
  dv = 1;
  var n = nC(),
    u = Qo(),
    r = Zh();
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
  function s(e) {
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
  function D(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function d(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function g(e) {
    if (c(e) !== e) throw Error(l(188));
  }
  function h(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = c(e)), t === null)) throw Error(l(188));
      return t !== e ? null : e;
    }
    for (var a = e, i = t; ;) {
      var f = a.return;
      if (f === null) break;
      var o = f.alternate;
      if (o === null) {
        if (((i = f.return), i !== null)) {
          a = i;
          continue;
        }
        break;
      }
      if (f.child === o.child) {
        for (o = f.child; o;) {
          if (o === a) return (g(f), e);
          if (o === i) return (g(f), t);
          o = o.sibling;
        }
        throw Error(l(188));
      }
      if (a.return !== i.return) ((a = f), (i = o));
      else {
        for (var v = !1, p = f.child; p;) {
          if (p === a) {
            ((v = !0), (a = f), (i = o));
            break;
          }
          if (p === i) {
            ((v = !0), (i = f), (a = o));
            break;
          }
          p = p.sibling;
        }
        if (!v) {
          for (p = o.child; p;) {
            if (p === a) {
              ((v = !0), (a = o), (i = f));
              break;
            }
            if (p === i) {
              ((v = !0), (i = o), (a = f));
              break;
            }
            p = p.sibling;
          }
          if (!v) throw Error(l(189));
        }
      }
      if (a.alternate !== i) throw Error(l(190));
    }
    if (a.tag !== 3) throw Error(l(188));
    return a.stateNode.current === a ? e : t;
  }
  function E(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null;) {
      if (((t = E(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  var A = Object.assign,
    B = Symbol.for('react.element'),
    F = Symbol.for('react.transitional.element'),
    M = Symbol.for('react.portal'),
    z = Symbol.for('react.fragment'),
    V = Symbol.for('react.strict_mode'),
    x = Symbol.for('react.profiler'),
    m = Symbol.for('react.consumer'),
    N = Symbol.for('react.context'),
    _ = Symbol.for('react.forward_ref'),
    J = Symbol.for('react.suspense'),
    le = Symbol.for('react.suspense_list'),
    P = Symbol.for('react.memo'),
    se = Symbol.for('react.lazy'),
    fe = Symbol.for('react.activity'),
    ve = Symbol.for('react.memo_cache_sentinel'),
    de = Symbol.iterator;
  function ee(e) {
    return e === null || typeof e != 'object'
      ? null
      : ((e = (de && e[de]) || e['@@iterator']), typeof e == 'function' ? e : null);
  }
  var Z = Symbol.for('react.client.reference');
  function ne(e) {
    if (e == null) return null;
    if (typeof e == 'function') return e.$$typeof === Z ? null : e.displayName || e.name || null;
    if (typeof e == 'string') return e;
    switch (e) {
      case z:
        return 'Fragment';
      case x:
        return 'Profiler';
      case V:
        return 'StrictMode';
      case J:
        return 'Suspense';
      case le:
        return 'SuspenseList';
      case fe:
        return 'Activity';
    }
    if (typeof e == 'object')
      switch (e.$$typeof) {
        case M:
          return 'Portal';
        case N:
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
        case P:
          return ((t = e.displayName || null), t !== null ? t : ne(e.type) || 'Memo');
        case se:
          ((t = e._payload), (e = e._init));
          try {
            return ne(e(t));
          } catch {}
      }
    return null;
  }
  var ae = Array.isArray,
    R = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    G = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    De = { pending: !1, data: null, method: null, action: null },
    he = [],
    Ce = -1;
  function y(e) {
    return { current: e };
  }
  function q(e) {
    0 > Ce || ((e.current = he[Ce]), (he[Ce] = null), Ce--);
  }
  function K(e, t) {
    (Ce++, (he[Ce] = e.current), (e.current = t));
  }
  var W = y(null),
    ge = y(null),
    Ae = y(null),
    xe = y(null);
  function Ke(e, t) {
    switch ((K(Ae, t), K(ge, e), K(W, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? OD(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI))) ((t = OD(t)), (e = xD(t, e)));
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
    (q(W), K(W, e));
  }
  function ze() {
    (q(W), q(ge), q(Ae));
  }
  function w(e) {
    e.memoizedState !== null && K(xe, e);
    var t = W.current,
      a = xD(t, e.type);
    t !== a && (K(ge, e), K(W, a));
  }
  function ie(e) {
    (ge.current === e && (q(W), q(ge)), xe.current === e && (q(xe), (Yr._currentValue = De)));
  }
  var ue, oe;
  function Ee(e) {
    if (ue === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        ((ue = (t && t[1]) || ''),
          (oe =
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
      ue +
      e +
      oe
    );
  }
  var ye = !1;
  function Je(e, t) {
    if (!e || ye) return '';
    ye = !0;
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
                } catch (Y) {
                  var U = Y;
                }
                Reflect.construct(e, [], te);
              } else {
                try {
                  te.call();
                } catch (Y) {
                  U = Y;
                }
                e.call(te.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (Y) {
                U = Y;
              }
              (te = e()) && typeof te.catch == 'function' && te.catch(function () {});
            }
          } catch (Y) {
            if (Y && U && typeof Y.stack == 'string') return [Y.stack, U.stack];
          }
          return [null, null];
        },
      };
      i.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var f = Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot, 'name');
      f &&
        f.configurable &&
        Object.defineProperty(i.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot',
        });
      var o = i.DetermineComponentFrameRoot(),
        v = o[0],
        p = o[1];
      if (v && p) {
        var b = v.split(`
`),
          H = p.split(`
`);
        for (f = i = 0; i < b.length && !b[i].includes('DetermineComponentFrameRoot');) i++;
        for (; f < H.length && !H[f].includes('DetermineComponentFrameRoot');) f++;
        if (i === b.length || f === H.length)
          for (i = b.length - 1, f = H.length - 1; 1 <= i && 0 <= f && b[i] !== H[f];) f--;
        for (; 1 <= i && 0 <= f; i--, f--)
          if (b[i] !== H[f]) {
            if (i !== 1 || f !== 1)
              do
                if ((i--, f--, 0 > f || b[i] !== H[f])) {
                  var Q =
                    `
` + b[i].replace(' at new ', ' at ');
                  return (
                    e.displayName &&
                      Q.includes('<anonymous>') &&
                      (Q = Q.replace('<anonymous>', e.displayName)),
                    Q
                  );
                }
              while (1 <= i && 0 <= f);
            break;
          }
      }
    } finally {
      ((ye = !1), (Error.prepareStackTrace = a));
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
        return Je(e.type, !1);
      case 11:
        return Je(e.type.render, !1);
      case 1:
        return Je(e.type, !0);
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
  var Ne = Object.prototype.hasOwnProperty,
    We = n.unstable_scheduleCallback,
    pt = n.unstable_cancelCallback,
    Ve = n.unstable_shouldYield,
    _t = n.unstable_requestPaint,
    ot = n.unstable_now,
    nn = n.unstable_getCurrentPriorityLevel,
    Gt = n.unstable_ImmediatePriority,
    ru = n.unstable_UserBlockingPriority,
    Yt = n.unstable_NormalPriority,
    Ft = n.unstable_LowPriority,
    Et = n.unstable_IdlePriority,
    er = n.log,
    fl = n.unstable_setDisableYieldValue,
    an = null,
    St = null;
  function mu(e) {
    if ((typeof er == 'function' && fl(e), St && typeof St.setStrictMode == 'function'))
      try {
        St.setStrictMode(an, e);
      } catch {}
  }
  var Ut = Math.clz32 ? Math.clz32 : qg,
    tr = Math.log,
    ol = Math.LN2;
  function qg(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((tr(e) / ol) | 0)) | 0);
  }
  var cl = 256,
    dl = 262144,
    Dl = 4194304;
  function Ln(e) {
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
  function vl(e, t, a) {
    var i = e.pendingLanes;
    if (i === 0) return 0;
    var f = 0,
      o = e.suspendedLanes,
      v = e.pingedLanes;
    e = e.warmLanes;
    var p = i & 134217727;
    return (
      p !== 0
        ? ((i = p & ~o),
          i !== 0
            ? (f = Ln(i))
            : ((v &= p), v !== 0 ? (f = Ln(v)) : a || ((a = p & ~e), a !== 0 && (f = Ln(a)))))
        : ((p = i & ~o),
          p !== 0
            ? (f = Ln(p))
            : v !== 0
              ? (f = Ln(v))
              : a || ((a = i & ~e), a !== 0 && (f = Ln(a)))),
      f === 0
        ? 0
        : t !== 0 &&
            t !== f &&
            (t & o) === 0 &&
            ((o = f & -f), (a = t & -t), o >= a || (o === 32 && (a & 4194048) !== 0))
          ? t
          : f
    );
  }
  function ur(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function kg(e, t) {
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
  function sc() {
    var e = Dl;
    return ((Dl <<= 1), (Dl & 62914560) === 0 && (Dl = 4194304), e);
  }
  function Zi(e) {
    for (var t = [], a = 0; 31 > a; a++) t.push(e);
    return t;
  }
  function nr(e, t) {
    ((e.pendingLanes |= t),
      t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function _g(e, t, a, i, f, o) {
    var v = e.pendingLanes;
    ((e.pendingLanes = a),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= a),
      (e.entangledLanes &= a),
      (e.errorRecoveryDisabledLanes &= a),
      (e.shellSuspendCounter = 0));
    var p = e.entanglements,
      b = e.expirationTimes,
      H = e.hiddenUpdates;
    for (a = v & ~a; 0 < a;) {
      var Q = 31 - Ut(a),
        te = 1 << Q;
      ((p[Q] = 0), (b[Q] = -1));
      var U = H[Q];
      if (U !== null)
        for (H[Q] = null, Q = 0; Q < U.length; Q++) {
          var Y = U[Q];
          Y !== null && (Y.lane &= -536870913);
        }
      a &= ~te;
    }
    (i !== 0 && fc(e, i, 0),
      o !== 0 && f === 0 && e.tag !== 0 && (e.suspendedLanes |= o & ~(v & ~t)));
  }
  function fc(e, t, a) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var i = 31 - Ut(t);
    ((e.entangledLanes |= t),
      (e.entanglements[i] = e.entanglements[i] | 1073741824 | (a & 261930)));
  }
  function oc(e, t) {
    var a = (e.entangledLanes |= t);
    for (e = e.entanglements; a;) {
      var i = 31 - Ut(a),
        f = 1 << i;
      ((f & t) | (e[i] & t) && (e[i] |= t), (a &= ~f));
    }
  }
  function cc(e, t) {
    var a = t & -t;
    return ((a = (a & 42) !== 0 ? 1 : Pi(a)), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a);
  }
  function Pi(e) {
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
  function Ji(e) {
    return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function dc() {
    var e = G.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : WD(e.type));
  }
  function Dc(e, t) {
    var a = G.p;
    try {
      return ((G.p = e), t());
    } finally {
      G.p = a;
    }
  }
  var rn = Math.random().toString(36).slice(2),
    Ot = '__reactFiber$' + rn,
    Vt = '__reactProps$' + rn,
    sa = '__reactContainer$' + rn,
    Wi = '__reactEvents$' + rn,
    Gg = '__reactListeners$' + rn,
    Yg = '__reactHandles$' + rn,
    vc = '__reactResources$' + rn,
    ar = '__reactMarker$' + rn;
  function $i(e) {
    (delete e[Ot], delete e[Vt], delete e[Wi], delete e[Gg], delete e[Yg]);
  }
  function fa(e) {
    var t = e[Ot];
    if (t) return t;
    for (var a = e.parentNode; a;) {
      if ((t = a[sa] || a[Ot])) {
        if (((a = t.alternate), t.child !== null || (a !== null && a.child !== null)))
          for (e = ND(e); e !== null;) {
            if ((a = e[Ot])) return a;
            e = ND(e);
          }
        return t;
      }
      ((e = a), (a = e.parentNode));
    }
    return null;
  }
  function oa(e) {
    if ((e = e[Ot] || e[sa])) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
    }
    return null;
  }
  function rr(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(l(33));
  }
  function ca(e) {
    var t = e[vc];
    return (t || (t = e[vc] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
  }
  function yt(e) {
    e[ar] = !0;
  }
  var hc = new Set(),
    gc = {};
  function Hn(e, t) {
    (da(e, t), da(e + 'Capture', t));
  }
  function da(e, t) {
    for (gc[e] = t, e = 0; e < t.length; e++) hc.add(t[e]);
  }
  var Vg = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
    ),
    mc = {},
    Cc = {};
  function Xg(e) {
    return Ne.call(Cc, e)
      ? !0
      : Ne.call(mc, e)
        ? !1
        : Vg.test(e)
          ? (Cc[e] = !0)
          : ((mc[e] = !0), !1);
  }
  function hl(e, t, a) {
    if (Xg(t))
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
  function gl(e, t, a) {
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
  function Ru(e, t, a, i) {
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
  function lu(e) {
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
  function pc(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
  }
  function Kg(e, t, a) {
    var i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (
      !e.hasOwnProperty(t) &&
      typeof i < 'u' &&
      typeof i.get == 'function' &&
      typeof i.set == 'function'
    ) {
      var f = i.get,
        o = i.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return f.call(this);
          },
          set: function (v) {
            ((a = '' + v), o.call(this, v));
          },
        }),
        Object.defineProperty(e, t, { enumerable: i.enumerable }),
        {
          getValue: function () {
            return a;
          },
          setValue: function (v) {
            a = '' + v;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Ii(e) {
    if (!e._valueTracker) {
      var t = pc(e) ? 'checked' : 'value';
      e._valueTracker = Kg(e, t, '' + e[t]);
    }
  }
  function Ec(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var a = t.getValue(),
      i = '';
    return (
      e && (i = pc(e) ? (e.checked ? 'true' : 'false') : e.value),
      (e = i),
      e !== a ? (t.setValue(e), !0) : !1
    );
  }
  function ml(e) {
    if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Qg = /[\n"\\]/g;
  function iu(e) {
    return e.replace(Qg, function (t) {
      return '\\' + t.charCodeAt(0).toString(16) + ' ';
    });
  }
  function es(e, t, a, i, f, o, v, p) {
    ((e.name = ''),
      v != null && typeof v != 'function' && typeof v != 'symbol' && typeof v != 'boolean'
        ? (e.type = v)
        : e.removeAttribute('type'),
      t != null
        ? v === 'number'
          ? ((t === 0 && e.value === '') || e.value != t) && (e.value = '' + lu(t))
          : e.value !== '' + lu(t) && (e.value = '' + lu(t))
        : (v !== 'submit' && v !== 'reset') || e.removeAttribute('value'),
      t != null
        ? ts(e, v, lu(t))
        : a != null
          ? ts(e, v, lu(a))
          : i != null && e.removeAttribute('value'),
      f == null && o != null && (e.defaultChecked = !!o),
      f != null && (e.checked = f && typeof f != 'function' && typeof f != 'symbol'),
      p != null && typeof p != 'function' && typeof p != 'symbol' && typeof p != 'boolean'
        ? (e.name = '' + lu(p))
        : e.removeAttribute('name'));
  }
  function Ac(e, t, a, i, f, o, v, p) {
    if (
      (o != null &&
        typeof o != 'function' &&
        typeof o != 'symbol' &&
        typeof o != 'boolean' &&
        (e.type = o),
      t != null || a != null)
    ) {
      if (!((o !== 'submit' && o !== 'reset') || t != null)) {
        Ii(e);
        return;
      }
      ((a = a != null ? '' + lu(a) : ''),
        (t = t != null ? '' + lu(t) : a),
        p || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((i = i ?? f),
      (i = typeof i != 'function' && typeof i != 'symbol' && !!i),
      (e.checked = p ? e.checked : !!i),
      (e.defaultChecked = !!i),
      v != null &&
        typeof v != 'function' &&
        typeof v != 'symbol' &&
        typeof v != 'boolean' &&
        (e.name = v),
      Ii(e));
  }
  function ts(e, t, a) {
    (t === 'number' && ml(e.ownerDocument) === e) ||
      e.defaultValue === '' + a ||
      (e.defaultValue = '' + a);
  }
  function Da(e, t, a, i) {
    if (((e = e.options), t)) {
      t = {};
      for (var f = 0; f < a.length; f++) t['$' + a[f]] = !0;
      for (a = 0; a < e.length; a++)
        ((f = t.hasOwnProperty('$' + e[a].value)),
          e[a].selected !== f && (e[a].selected = f),
          f && i && (e[a].defaultSelected = !0));
    } else {
      for (a = '' + lu(a), t = null, f = 0; f < e.length; f++) {
        if (e[f].value === a) {
          ((e[f].selected = !0), i && (e[f].defaultSelected = !0));
          return;
        }
        t !== null || e[f].disabled || (t = e[f]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Bc(e, t, a) {
    if (t != null && ((t = '' + lu(t)), t !== e.value && (e.value = t), a == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = a != null ? '' + lu(a) : '';
  }
  function yc(e, t, a, i) {
    if (t == null) {
      if (i != null) {
        if (a != null) throw Error(l(92));
        if (ae(i)) {
          if (1 < i.length) throw Error(l(93));
          i = i[0];
        }
        a = i;
      }
      (a == null && (a = ''), (t = a));
    }
    ((a = lu(t)),
      (e.defaultValue = a),
      (i = e.textContent),
      i === a && i !== '' && i !== null && (e.value = i),
      Ii(e));
  }
  function va(e, t) {
    if (t) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Zg = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' ',
    ),
  );
  function bc(e, t, a) {
    var i = t.indexOf('--') === 0;
    a == null || typeof a == 'boolean' || a === ''
      ? i
        ? e.setProperty(t, '')
        : t === 'float'
          ? (e.cssFloat = '')
          : (e[t] = '')
      : i
        ? e.setProperty(t, a)
        : typeof a != 'number' || a === 0 || Zg.has(t)
          ? t === 'float'
            ? (e.cssFloat = a)
            : (e[t] = ('' + a).trim())
          : (e[t] = a + 'px');
  }
  function Fc(e, t, a) {
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
      for (var f in t) ((i = t[f]), t.hasOwnProperty(f) && a[f] !== i && bc(e, f, i));
    } else for (var o in t) t.hasOwnProperty(o) && bc(e, o, t[o]);
  }
  function us(e) {
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
  var Pg = new Map([
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
    Jg =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Cl(e) {
    return Jg.test('' + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function ju() {}
  var ns = null;
  function as(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var ha = null,
    ga = null;
  function Sc(e) {
    var t = oa(e);
    if (t && (e = t.stateNode)) {
      var a = e[Vt] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case 'input':
          if (
            (es(
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
              a = a.querySelectorAll('input[name="' + iu('' + t) + '"][type="radio"]'), t = 0;
              t < a.length;
              t++
            ) {
              var i = a[t];
              if (i !== e && i.form === e.form) {
                var f = i[Vt] || null;
                if (!f) throw Error(l(90));
                es(
                  i,
                  f.value,
                  f.defaultValue,
                  f.defaultValue,
                  f.checked,
                  f.defaultChecked,
                  f.type,
                  f.name,
                );
              }
            }
            for (t = 0; t < a.length; t++) ((i = a[t]), i.form === e.form && Ec(i));
          }
          break e;
        case 'textarea':
          Bc(e, a.value, a.defaultValue);
          break e;
        case 'select':
          ((t = a.value), t != null && Da(e, !!a.multiple, t, !1));
      }
    }
  }
  var rs = !1;
  function Oc(e, t, a) {
    if (rs) return e(t, a);
    rs = !0;
    try {
      var i = e(t);
      return i;
    } finally {
      if (
        ((rs = !1),
        (ha !== null || ga !== null) &&
          (ri(), ha && ((t = ha), (e = ga), (ga = ha = null), Sc(t), e)))
      )
        for (t = 0; t < e.length; t++) Sc(e[t]);
    }
  }
  function lr(e, t) {
    var a = e.stateNode;
    if (a === null) return null;
    var i = a[Vt] || null;
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
  var zu = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    ls = !1;
  if (zu)
    try {
      var ir = {};
      (Object.defineProperty(ir, 'passive', {
        get: function () {
          ls = !0;
        },
      }),
        window.addEventListener('test', ir, ir),
        window.removeEventListener('test', ir, ir));
    } catch {
      ls = !1;
    }
  var ln = null,
    is = null,
    pl = null;
  function xc() {
    if (pl) return pl;
    var e,
      t = is,
      a = t.length,
      i,
      f = 'value' in ln ? ln.value : ln.textContent,
      o = f.length;
    for (e = 0; e < a && t[e] === f[e]; e++);
    var v = a - e;
    for (i = 1; i <= v && t[a - i] === f[o - i]; i++);
    return (pl = f.slice(e, 1 < i ? 1 - i : void 0));
  }
  function El(e) {
    var t = e.keyCode;
    return (
      'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function Al() {
    return !0;
  }
  function Tc() {
    return !1;
  }
  function Xt(e) {
    function t(a, i, f, o, v) {
      ((this._reactName = a),
        (this._targetInst = f),
        (this.type = i),
        (this.nativeEvent = o),
        (this.target = v),
        (this.currentTarget = null));
      for (var p in e) e.hasOwnProperty(p) && ((a = e[p]), (this[p] = a ? a(o) : o[p]));
      return (
        (this.isDefaultPrevented = (
          o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1
        )
          ? Al
          : Tc),
        (this.isPropagationStopped = Tc),
        this
      );
    }
    return (
      A(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a &&
            (a.preventDefault
              ? a.preventDefault()
              : typeof a.returnValue != 'unknown' && (a.returnValue = !1),
            (this.isDefaultPrevented = Al));
        },
        stopPropagation: function () {
          var a = this.nativeEvent;
          a &&
            (a.stopPropagation
              ? a.stopPropagation()
              : typeof a.cancelBubble != 'unknown' && (a.cancelBubble = !0),
            (this.isPropagationStopped = Al));
        },
        persist: function () {},
        isPersistent: Al,
      }),
      t
    );
  }
  var Un = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Bl = Xt(Un),
    sr = A({}, Un, { view: 0, detail: 0 }),
    Wg = Xt(sr),
    ss,
    fs,
    fr,
    yl = A({}, sr, {
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
      getModifierState: cs,
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
          : (e !== fr &&
              (fr && e.type === 'mousemove'
                ? ((ss = e.screenX - fr.screenX), (fs = e.screenY - fr.screenY))
                : (fs = ss = 0),
              (fr = e)),
            ss);
      },
      movementY: function (e) {
        return 'movementY' in e ? e.movementY : fs;
      },
    }),
    wc = Xt(yl),
    $g = A({}, yl, { dataTransfer: 0 }),
    Ig = Xt($g),
    e1 = A({}, sr, { relatedTarget: 0 }),
    os = Xt(e1),
    t1 = A({}, Un, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    u1 = Xt(t1),
    n1 = A({}, Un, {
      clipboardData: function (e) {
        return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
      },
    }),
    a1 = Xt(n1),
    r1 = A({}, Un, { data: 0 }),
    Mc = Xt(r1),
    l1 = {
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
    i1 = {
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
    s1 = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function f1(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = s1[e]) ? !!t[e] : !1;
  }
  function cs() {
    return f1;
  }
  var o1 = A({}, sr, {
      key: function (e) {
        if (e.key) {
          var t = l1[e.key] || e.key;
          if (t !== 'Unidentified') return t;
        }
        return e.type === 'keypress'
          ? ((e = El(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
          : e.type === 'keydown' || e.type === 'keyup'
            ? i1[e.keyCode] || 'Unidentified'
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
      getModifierState: cs,
      charCode: function (e) {
        return e.type === 'keypress' ? El(e) : 0;
      },
      keyCode: function (e) {
        return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === 'keypress'
          ? El(e)
          : e.type === 'keydown' || e.type === 'keyup'
            ? e.keyCode
            : 0;
      },
    }),
    c1 = Xt(o1),
    d1 = A({}, yl, {
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
    Rc = Xt(d1),
    D1 = A({}, sr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: cs,
    }),
    v1 = Xt(D1),
    h1 = A({}, Un, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    g1 = Xt(h1),
    m1 = A({}, yl, {
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
    C1 = Xt(m1),
    p1 = A({}, Un, { newState: 0, oldState: 0 }),
    E1 = Xt(p1),
    A1 = [9, 13, 27, 32],
    ds = zu && 'CompositionEvent' in window,
    or = null;
  zu && 'documentMode' in document && (or = document.documentMode);
  var B1 = zu && 'TextEvent' in window && !or,
    jc = zu && (!ds || (or && 8 < or && 11 >= or)),
    zc = ' ',
    Nc = !1;
  function Lc(e, t) {
    switch (e) {
      case 'keyup':
        return A1.indexOf(t.keyCode) !== -1;
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
  function Hc(e) {
    return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
  }
  var ma = !1;
  function y1(e, t) {
    switch (e) {
      case 'compositionend':
        return Hc(t);
      case 'keypress':
        return t.which !== 32 ? null : ((Nc = !0), zc);
      case 'textInput':
        return ((e = t.data), e === zc && Nc ? null : e);
      default:
        return null;
    }
  }
  function b1(e, t) {
    if (ma)
      return e === 'compositionend' || (!ds && Lc(e, t))
        ? ((e = xc()), (pl = is = ln = null), (ma = !1), e)
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
        return jc && t.locale !== 'ko' ? null : t.data;
      default:
        return null;
    }
  }
  var F1 = {
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
  function Uc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === 'input' ? !!F1[e.type] : t === 'textarea';
  }
  function qc(e, t, a, i) {
    (ha ? (ga ? ga.push(i) : (ga = [i])) : (ha = i),
      (t = di(t, 'onChange')),
      0 < t.length &&
        ((a = new Bl('onChange', 'change', null, a, i)), e.push({ event: a, listeners: t })));
  }
  var cr = null,
    dr = null;
  function S1(e) {
    AD(e, 0);
  }
  function bl(e) {
    var t = rr(e);
    if (Ec(t)) return e;
  }
  function kc(e, t) {
    if (e === 'change') return t;
  }
  var _c = !1;
  if (zu) {
    var Ds;
    if (zu) {
      var vs = 'oninput' in document;
      if (!vs) {
        var Gc = document.createElement('div');
        (Gc.setAttribute('oninput', 'return;'), (vs = typeof Gc.oninput == 'function'));
      }
      Ds = vs;
    } else Ds = !1;
    _c = Ds && (!document.documentMode || 9 < document.documentMode);
  }
  function Yc() {
    cr && (cr.detachEvent('onpropertychange', Vc), (dr = cr = null));
  }
  function Vc(e) {
    if (e.propertyName === 'value' && bl(dr)) {
      var t = [];
      (qc(t, dr, e, as(e)), Oc(S1, t));
    }
  }
  function O1(e, t, a) {
    e === 'focusin'
      ? (Yc(), (cr = t), (dr = a), cr.attachEvent('onpropertychange', Vc))
      : e === 'focusout' && Yc();
  }
  function x1(e) {
    if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return bl(dr);
  }
  function T1(e, t) {
    if (e === 'click') return bl(t);
  }
  function w1(e, t) {
    if (e === 'input' || e === 'change') return bl(t);
  }
  function M1(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var $t = typeof Object.is == 'function' ? Object.is : M1;
  function Dr(e, t) {
    if ($t(e, t)) return !0;
    if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
    var a = Object.keys(e),
      i = Object.keys(t);
    if (a.length !== i.length) return !1;
    for (i = 0; i < a.length; i++) {
      var f = a[i];
      if (!Ne.call(t, f) || !$t(e[f], t[f])) return !1;
    }
    return !0;
  }
  function Xc(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }
  function Kc(e, t) {
    var a = Xc(e);
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
      a = Xc(a);
    }
  }
  function Qc(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Qc(e, t.parentNode)
            : 'contains' in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Zc(e) {
    e =
      e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = ml(e.document); t instanceof e.HTMLIFrameElement;) {
      try {
        var a = typeof t.contentWindow.location.href == 'string';
      } catch {
        a = !1;
      }
      if (a) e = t.contentWindow;
      else break;
      t = ml(e.document);
    }
    return t;
  }
  function hs(e) {
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
  var R1 = zu && 'documentMode' in document && 11 >= document.documentMode,
    Ca = null,
    gs = null,
    vr = null,
    ms = !1;
  function Pc(e, t, a) {
    var i = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    ms ||
      Ca == null ||
      Ca !== ml(i) ||
      ((i = Ca),
      'selectionStart' in i && hs(i)
        ? (i = { start: i.selectionStart, end: i.selectionEnd })
        : ((i = ((i.ownerDocument && i.ownerDocument.defaultView) || window).getSelection()),
          (i = {
            anchorNode: i.anchorNode,
            anchorOffset: i.anchorOffset,
            focusNode: i.focusNode,
            focusOffset: i.focusOffset,
          })),
      (vr && Dr(vr, i)) ||
        ((vr = i),
        (i = di(gs, 'onSelect')),
        0 < i.length &&
          ((t = new Bl('onSelect', 'select', null, t, a)),
          e.push({ event: t, listeners: i }),
          (t.target = Ca))));
  }
  function qn(e, t) {
    var a = {};
    return (
      (a[e.toLowerCase()] = t.toLowerCase()),
      (a['Webkit' + e] = 'webkit' + t),
      (a['Moz' + e] = 'moz' + t),
      a
    );
  }
  var pa = {
      animationend: qn('Animation', 'AnimationEnd'),
      animationiteration: qn('Animation', 'AnimationIteration'),
      animationstart: qn('Animation', 'AnimationStart'),
      transitionrun: qn('Transition', 'TransitionRun'),
      transitionstart: qn('Transition', 'TransitionStart'),
      transitioncancel: qn('Transition', 'TransitionCancel'),
      transitionend: qn('Transition', 'TransitionEnd'),
    },
    Cs = {},
    Jc = {};
  zu &&
    ((Jc = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete pa.animationend.animation,
      delete pa.animationiteration.animation,
      delete pa.animationstart.animation),
    'TransitionEvent' in window || delete pa.transitionend.transition);
  function kn(e) {
    if (Cs[e]) return Cs[e];
    if (!pa[e]) return e;
    var t = pa[e],
      a;
    for (a in t) if (t.hasOwnProperty(a) && a in Jc) return (Cs[e] = t[a]);
    return e;
  }
  var Wc = kn('animationend'),
    $c = kn('animationiteration'),
    Ic = kn('animationstart'),
    j1 = kn('transitionrun'),
    z1 = kn('transitionstart'),
    N1 = kn('transitioncancel'),
    e0 = kn('transitionend'),
    t0 = new Map(),
    ps =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' ',
      );
  ps.push('scrollEnd');
  function Cu(e, t) {
    (t0.set(e, t), Hn(t, [e]));
  }
  var Fl =
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
    Ea = 0,
    Es = 0;
  function Sl() {
    for (var e = Ea, t = (Es = Ea = 0); t < e;) {
      var a = su[t];
      su[t++] = null;
      var i = su[t];
      su[t++] = null;
      var f = su[t];
      su[t++] = null;
      var o = su[t];
      if (((su[t++] = null), i !== null && f !== null)) {
        var v = i.pending;
        (v === null ? (f.next = f) : ((f.next = v.next), (v.next = f)), (i.pending = f));
      }
      o !== 0 && u0(a, f, o);
    }
  }
  function Ol(e, t, a, i) {
    ((su[Ea++] = e),
      (su[Ea++] = t),
      (su[Ea++] = a),
      (su[Ea++] = i),
      (Es |= i),
      (e.lanes |= i),
      (e = e.alternate),
      e !== null && (e.lanes |= i));
  }
  function As(e, t, a, i) {
    return (Ol(e, t, a, i), xl(e));
  }
  function _n(e, t) {
    return (Ol(e, null, null, t), xl(e));
  }
  function u0(e, t, a) {
    e.lanes |= a;
    var i = e.alternate;
    i !== null && (i.lanes |= a);
    for (var f = !1, o = e.return; o !== null;)
      ((o.childLanes |= a),
        (i = o.alternate),
        i !== null && (i.childLanes |= a),
        o.tag === 22 && ((e = o.stateNode), e === null || e._visibility & 1 || (f = !0)),
        (e = o),
        (o = o.return));
    return e.tag === 3
      ? ((o = e.stateNode),
        f &&
          t !== null &&
          ((f = 31 - Ut(a)),
          (e = o.hiddenUpdates),
          (i = e[f]),
          i === null ? (e[f] = [t]) : i.push(t),
          (t.lane = a | 536870912)),
        o)
      : null;
  }
  function xl(e) {
    if (50 < Lr) throw ((Lr = 0), (Mf = null), Error(l(185)));
    for (var t = e.return; t !== null;) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var Aa = {};
  function L1(e, t, a, i) {
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
  function It(e, t, a, i) {
    return new L1(e, t, a, i);
  }
  function Bs(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function Nu(e, t) {
    var a = e.alternate;
    return (
      a === null
        ? ((a = It(e.tag, t, e.key, e.mode)),
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
  function n0(e, t) {
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
  function Tl(e, t, a, i, f, o) {
    var v = 0;
    if (((i = e), typeof e == 'function')) Bs(e) && (v = 1);
    else if (typeof e == 'string')
      v = _m(e, a, W.current) ? 26 : e === 'html' || e === 'head' || e === 'body' ? 27 : 5;
    else
      e: switch (e) {
        case fe:
          return ((e = It(31, a, t, f)), (e.elementType = fe), (e.lanes = o), e);
        case z:
          return Gn(a.children, f, o, t);
        case V:
          ((v = 8), (f |= 24));
          break;
        case x:
          return ((e = It(12, a, t, f | 2)), (e.elementType = x), (e.lanes = o), e);
        case J:
          return ((e = It(13, a, t, f)), (e.elementType = J), (e.lanes = o), e);
        case le:
          return ((e = It(19, a, t, f)), (e.elementType = le), (e.lanes = o), e);
        default:
          if (typeof e == 'object' && e !== null)
            switch (e.$$typeof) {
              case N:
                v = 10;
                break e;
              case m:
                v = 9;
                break e;
              case _:
                v = 11;
                break e;
              case P:
                v = 14;
                break e;
              case se:
                ((v = 16), (i = null));
                break e;
            }
          ((v = 29), (a = Error(l(130, e === null ? 'null' : typeof e, ''))), (i = null));
      }
    return ((t = It(v, a, t, f)), (t.elementType = e), (t.type = i), (t.lanes = o), t);
  }
  function Gn(e, t, a, i) {
    return ((e = It(7, e, i, t)), (e.lanes = a), e);
  }
  function ys(e, t, a) {
    return ((e = It(6, e, null, t)), (e.lanes = a), e);
  }
  function a0(e) {
    var t = It(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function bs(e, t, a) {
    return (
      (t = It(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = a),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  var r0 = new WeakMap();
  function fu(e, t) {
    if (typeof e == 'object' && e !== null) {
      var a = r0.get(e);
      return a !== void 0 ? a : ((t = { value: e, source: t, stack: _e(t) }), r0.set(e, t), t);
    }
    return { value: e, source: t, stack: _e(t) };
  }
  var Ba = [],
    ya = 0,
    wl = null,
    hr = 0,
    ou = [],
    cu = 0,
    sn = null,
    yu = 1,
    bu = '';
  function Lu(e, t) {
    ((Ba[ya++] = hr), (Ba[ya++] = wl), (wl = e), (hr = t));
  }
  function l0(e, t, a) {
    ((ou[cu++] = yu), (ou[cu++] = bu), (ou[cu++] = sn), (sn = e));
    var i = yu;
    e = bu;
    var f = 32 - Ut(i) - 1;
    ((i &= ~(1 << f)), (a += 1));
    var o = 32 - Ut(t) + f;
    if (30 < o) {
      var v = f - (f % 5);
      ((o = (i & ((1 << v) - 1)).toString(32)),
        (i >>= v),
        (f -= v),
        (yu = (1 << (32 - Ut(t) + f)) | (a << f) | i),
        (bu = o + e));
    } else ((yu = (1 << o) | (a << f) | i), (bu = e));
  }
  function Fs(e) {
    e.return !== null && (Lu(e, 1), l0(e, 1, 0));
  }
  function Ss(e) {
    for (; e === wl;) ((wl = Ba[--ya]), (Ba[ya] = null), (hr = Ba[--ya]), (Ba[ya] = null));
    for (; e === sn;)
      ((sn = ou[--cu]),
        (ou[cu] = null),
        (bu = ou[--cu]),
        (ou[cu] = null),
        (yu = ou[--cu]),
        (ou[cu] = null));
  }
  function i0(e, t) {
    ((ou[cu++] = yu), (ou[cu++] = bu), (ou[cu++] = sn), (yu = t.id), (bu = t.overflow), (sn = e));
  }
  var xt = null,
    nt = null,
    ke = !1,
    fn = null,
    du = !1,
    Os = Error(l(519));
  function on(e) {
    var t = Error(
      l(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', ''),
    );
    throw (gr(fu(t, e)), Os);
  }
  function s0(e) {
    var t = e.stateNode,
      a = e.type,
      i = e.memoizedProps;
    switch (((t[Ot] = e), (t[Vt] = i), a)) {
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
        for (a = 0; a < Ur.length; a++) He(Ur[a], t);
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
          Ac(t, i.value, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name, !0));
        break;
      case 'select':
        He('invalid', t);
        break;
      case 'textarea':
        (He('invalid', t), yc(t, i.value, i.defaultValue, i.children));
    }
    ((a = i.children),
      (typeof a != 'string' && typeof a != 'number' && typeof a != 'bigint') ||
      t.textContent === '' + a ||
      i.suppressHydrationWarning === !0 ||
      FD(t.textContent, a)
        ? (i.popover != null && (He('beforetoggle', t), He('toggle', t)),
          i.onScroll != null && He('scroll', t),
          i.onScrollEnd != null && He('scrollend', t),
          i.onClick != null && (t.onclick = ju),
          (t = !0))
        : (t = !1),
      t || on(e, !0));
  }
  function f0(e) {
    for (xt = e.return; xt;)
      switch (xt.tag) {
        case 5:
        case 31:
        case 13:
          du = !1;
          return;
        case 27:
        case 3:
          du = !0;
          return;
        default:
          xt = xt.return;
      }
  }
  function ba(e) {
    if (e !== xt) return !1;
    if (!ke) return (f0(e), (ke = !0), !1);
    var t = e.tag,
      a;
    if (
      ((a = t !== 3 && t !== 27) &&
        ((a = t === 5) &&
          ((a = e.type), (a = !(a !== 'form' && a !== 'button') || Kf(e.type, e.memoizedProps))),
        (a = !a)),
      a && nt && on(e),
      f0(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(l(317));
      nt = zD(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(l(317));
      nt = zD(e);
    } else
      t === 27
        ? ((t = nt), bn(e.type) ? ((e = Wf), (Wf = null), (nt = e)) : (nt = t))
        : (nt = xt ? vu(e.stateNode.nextSibling) : null);
    return !0;
  }
  function Yn() {
    ((nt = xt = null), (ke = !1));
  }
  function xs() {
    var e = fn;
    return (e !== null && (Pt === null ? (Pt = e) : Pt.push.apply(Pt, e), (fn = null)), e);
  }
  function gr(e) {
    fn === null ? (fn = [e]) : fn.push(e);
  }
  var Ts = y(null),
    Vn = null,
    Hu = null;
  function cn(e, t, a) {
    (K(Ts, t._currentValue), (t._currentValue = a));
  }
  function Uu(e) {
    ((e._currentValue = Ts.current), q(Ts));
  }
  function ws(e, t, a) {
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
  function Ms(e, t, a, i) {
    var f = e.child;
    for (f !== null && (f.return = e); f !== null;) {
      var o = f.dependencies;
      if (o !== null) {
        var v = f.child;
        o = o.firstContext;
        e: for (; o !== null;) {
          var p = o;
          o = f;
          for (var b = 0; b < t.length; b++)
            if (p.context === t[b]) {
              ((o.lanes |= a),
                (p = o.alternate),
                p !== null && (p.lanes |= a),
                ws(o.return, a, e),
                i || (v = null));
              break e;
            }
          o = p.next;
        }
      } else if (f.tag === 18) {
        if (((v = f.return), v === null)) throw Error(l(341));
        ((v.lanes |= a), (o = v.alternate), o !== null && (o.lanes |= a), ws(v, a, e), (v = null));
      } else v = f.child;
      if (v !== null) v.return = f;
      else
        for (v = f; v !== null;) {
          if (v === e) {
            v = null;
            break;
          }
          if (((f = v.sibling), f !== null)) {
            ((f.return = v.return), (v = f));
            break;
          }
          v = v.return;
        }
      f = v;
    }
  }
  function Fa(e, t, a, i) {
    e = null;
    for (var f = t, o = !1; f !== null;) {
      if (!o) {
        if ((f.flags & 524288) !== 0) o = !0;
        else if ((f.flags & 262144) !== 0) break;
      }
      if (f.tag === 10) {
        var v = f.alternate;
        if (v === null) throw Error(l(387));
        if (((v = v.memoizedProps), v !== null)) {
          var p = f.type;
          $t(f.pendingProps.value, v.value) || (e !== null ? e.push(p) : (e = [p]));
        }
      } else if (f === xe.current) {
        if (((v = f.alternate), v === null)) throw Error(l(387));
        v.memoizedState.memoizedState !== f.memoizedState.memoizedState &&
          (e !== null ? e.push(Yr) : (e = [Yr]));
      }
      f = f.return;
    }
    (e !== null && Ms(t, e, a, i), (t.flags |= 262144));
  }
  function Ml(e) {
    for (e = e.firstContext; e !== null;) {
      if (!$t(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function Xn(e) {
    ((Vn = e), (Hu = null), (e = e.dependencies), e !== null && (e.firstContext = null));
  }
  function Tt(e) {
    return o0(Vn, e);
  }
  function Rl(e, t) {
    return (Vn === null && Xn(e), o0(e, t));
  }
  function o0(e, t) {
    var a = t._currentValue;
    if (((t = { context: t, memoizedValue: a, next: null }), Hu === null)) {
      if (e === null) throw Error(l(308));
      ((Hu = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
    } else Hu = Hu.next = t;
    return a;
  }
  var H1 =
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
    U1 = n.unstable_scheduleCallback,
    q1 = n.unstable_NormalPriority,
    ht = {
      $$typeof: N,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Rs() {
    return { controller: new H1(), data: new Map(), refCount: 0 };
  }
  function mr(e) {
    (e.refCount--,
      e.refCount === 0 &&
        U1(q1, function () {
          e.controller.abort();
        }));
  }
  var Cr = null,
    js = 0,
    Sa = 0,
    Oa = null;
  function k1(e, t) {
    if (Cr === null) {
      var a = (Cr = []);
      ((js = 0),
        (Sa = Hf()),
        (Oa = {
          status: 'pending',
          value: void 0,
          then: function (i) {
            a.push(i);
          },
        }));
    }
    return (js++, t.then(c0, c0), t);
  }
  function c0() {
    if (--js === 0 && Cr !== null) {
      Oa !== null && (Oa.status = 'fulfilled');
      var e = Cr;
      ((Cr = null), (Sa = 0), (Oa = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function _1(e, t) {
    var a = [],
      i = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (f) {
          a.push(f);
        },
      };
    return (
      e.then(
        function () {
          ((i.status = 'fulfilled'), (i.value = t));
          for (var f = 0; f < a.length; f++) (0, a[f])(t);
        },
        function (f) {
          for (i.status = 'rejected', i.reason = f, f = 0; f < a.length; f++) (0, a[f])(void 0);
        },
      ),
      i
    );
  }
  var d0 = R.S;
  R.S = function (e, t) {
    ((Pd = ot()),
      typeof t == 'object' && t !== null && typeof t.then == 'function' && k1(e, t),
      d0 !== null && d0(e, t));
  };
  var Kn = y(null);
  function zs() {
    var e = Kn.current;
    return e !== null ? e : tt.pooledCache;
  }
  function jl(e, t) {
    t === null ? K(Kn, Kn.current) : K(Kn, t.pool);
  }
  function D0() {
    var e = zs();
    return e === null ? null : { parent: ht._currentValue, pool: e };
  }
  var xa = Error(l(460)),
    Ns = Error(l(474)),
    zl = Error(l(542)),
    Nl = { then: function () {} };
  function v0(e) {
    return ((e = e.status), e === 'fulfilled' || e === 'rejected');
  }
  function h0(e, t, a) {
    switch (
      ((a = e[a]), a === void 0 ? e.push(t) : a !== t && (t.then(ju, ju), (t = a)), t.status)
    ) {
      case 'fulfilled':
        return t.value;
      case 'rejected':
        throw ((e = t.reason), m0(e), e);
      default:
        if (typeof t.status == 'string') t.then(ju, ju);
        else {
          if (((e = tt), e !== null && 100 < e.shellSuspendCounter)) throw Error(l(482));
          ((e = t),
            (e.status = 'pending'),
            e.then(
              function (i) {
                if (t.status === 'pending') {
                  var f = t;
                  ((f.status = 'fulfilled'), (f.value = i));
                }
              },
              function (i) {
                if (t.status === 'pending') {
                  var f = t;
                  ((f.status = 'rejected'), (f.reason = i));
                }
              },
            ));
        }
        switch (t.status) {
          case 'fulfilled':
            return t.value;
          case 'rejected':
            throw ((e = t.reason), m0(e), e);
        }
        throw ((Zn = t), xa);
    }
  }
  function Qn(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (a) {
      throw a !== null && typeof a == 'object' && typeof a.then == 'function' ? ((Zn = a), xa) : a;
    }
  }
  var Zn = null;
  function g0() {
    if (Zn === null) throw Error(l(459));
    var e = Zn;
    return ((Zn = null), e);
  }
  function m0(e) {
    if (e === xa || e === zl) throw Error(l(483));
  }
  var Ta = null,
    pr = 0;
  function Ll(e) {
    var t = pr;
    return ((pr += 1), Ta === null && (Ta = []), h0(Ta, e, t));
  }
  function Er(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function Hl(e, t) {
    throw t.$$typeof === B
      ? Error(l(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(
          l(
            31,
            e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e,
          ),
        ));
  }
  function C0(e) {
    function t(j, O) {
      if (e) {
        var L = j.deletions;
        L === null ? ((j.deletions = [O]), (j.flags |= 16)) : L.push(O);
      }
    }
    function a(j, O) {
      if (!e) return null;
      for (; O !== null;) (t(j, O), (O = O.sibling));
      return null;
    }
    function i(j) {
      for (var O = new Map(); j !== null;)
        (j.key !== null ? O.set(j.key, j) : O.set(j.index, j), (j = j.sibling));
      return O;
    }
    function f(j, O) {
      return ((j = Nu(j, O)), (j.index = 0), (j.sibling = null), j);
    }
    function o(j, O, L) {
      return (
        (j.index = L),
        e
          ? ((L = j.alternate),
            L !== null
              ? ((L = L.index), L < O ? ((j.flags |= 67108866), O) : L)
              : ((j.flags |= 67108866), O))
          : ((j.flags |= 1048576), O)
      );
    }
    function v(j) {
      return (e && j.alternate === null && (j.flags |= 67108866), j);
    }
    function p(j, O, L, $) {
      return O === null || O.tag !== 6
        ? ((O = ys(L, j.mode, $)), (O.return = j), O)
        : ((O = f(O, L)), (O.return = j), O);
    }
    function b(j, O, L, $) {
      var Be = L.type;
      return Be === z
        ? Q(j, O, L.props.children, $, L.key)
        : O !== null &&
            (O.elementType === Be ||
              (typeof Be == 'object' && Be !== null && Be.$$typeof === se && Qn(Be) === O.type))
          ? ((O = f(O, L.props)), Er(O, L), (O.return = j), O)
          : ((O = Tl(L.type, L.key, L.props, null, j.mode, $)), Er(O, L), (O.return = j), O);
    }
    function H(j, O, L, $) {
      return O === null ||
        O.tag !== 4 ||
        O.stateNode.containerInfo !== L.containerInfo ||
        O.stateNode.implementation !== L.implementation
        ? ((O = bs(L, j.mode, $)), (O.return = j), O)
        : ((O = f(O, L.children || [])), (O.return = j), O);
    }
    function Q(j, O, L, $, Be) {
      return O === null || O.tag !== 7
        ? ((O = Gn(L, j.mode, $, Be)), (O.return = j), O)
        : ((O = f(O, L)), (O.return = j), O);
    }
    function te(j, O, L) {
      if ((typeof O == 'string' && O !== '') || typeof O == 'number' || typeof O == 'bigint')
        return ((O = ys('' + O, j.mode, L)), (O.return = j), O);
      if (typeof O == 'object' && O !== null) {
        switch (O.$$typeof) {
          case F:
            return ((L = Tl(O.type, O.key, O.props, null, j.mode, L)), Er(L, O), (L.return = j), L);
          case M:
            return ((O = bs(O, j.mode, L)), (O.return = j), O);
          case se:
            return ((O = Qn(O)), te(j, O, L));
        }
        if (ae(O) || ee(O)) return ((O = Gn(O, j.mode, L, null)), (O.return = j), O);
        if (typeof O.then == 'function') return te(j, Ll(O), L);
        if (O.$$typeof === N) return te(j, Rl(j, O), L);
        Hl(j, O);
      }
      return null;
    }
    function U(j, O, L, $) {
      var Be = O !== null ? O.key : null;
      if ((typeof L == 'string' && L !== '') || typeof L == 'number' || typeof L == 'bigint')
        return Be !== null ? null : p(j, O, '' + L, $);
      if (typeof L == 'object' && L !== null) {
        switch (L.$$typeof) {
          case F:
            return L.key === Be ? b(j, O, L, $) : null;
          case M:
            return L.key === Be ? H(j, O, L, $) : null;
          case se:
            return ((L = Qn(L)), U(j, O, L, $));
        }
        if (ae(L) || ee(L)) return Be !== null ? null : Q(j, O, L, $, null);
        if (typeof L.then == 'function') return U(j, O, Ll(L), $);
        if (L.$$typeof === N) return U(j, O, Rl(j, L), $);
        Hl(j, L);
      }
      return null;
    }
    function Y(j, O, L, $, Be) {
      if ((typeof $ == 'string' && $ !== '') || typeof $ == 'number' || typeof $ == 'bigint')
        return ((j = j.get(L) || null), p(O, j, '' + $, Be));
      if (typeof $ == 'object' && $ !== null) {
        switch ($.$$typeof) {
          case F:
            return ((j = j.get($.key === null ? L : $.key) || null), b(O, j, $, Be));
          case M:
            return ((j = j.get($.key === null ? L : $.key) || null), H(O, j, $, Be));
          case se:
            return (($ = Qn($)), Y(j, O, L, $, Be));
        }
        if (ae($) || ee($)) return ((j = j.get(L) || null), Q(O, j, $, Be, null));
        if (typeof $.then == 'function') return Y(j, O, L, Ll($), Be);
        if ($.$$typeof === N) return Y(j, O, L, Rl(O, $), Be);
        Hl(O, $);
      }
      return null;
    }
    function me(j, O, L, $) {
      for (
        var Be = null, Ge = null, pe = O, je = (O = 0), qe = null;
        pe !== null && je < L.length;
        je++
      ) {
        pe.index > je ? ((qe = pe), (pe = null)) : (qe = pe.sibling);
        var Ye = U(j, pe, L[je], $);
        if (Ye === null) {
          pe === null && (pe = qe);
          break;
        }
        (e && pe && Ye.alternate === null && t(j, pe),
          (O = o(Ye, O, je)),
          Ge === null ? (Be = Ye) : (Ge.sibling = Ye),
          (Ge = Ye),
          (pe = qe));
      }
      if (je === L.length) return (a(j, pe), ke && Lu(j, je), Be);
      if (pe === null) {
        for (; je < L.length; je++)
          ((pe = te(j, L[je], $)),
            pe !== null &&
              ((O = o(pe, O, je)), Ge === null ? (Be = pe) : (Ge.sibling = pe), (Ge = pe)));
        return (ke && Lu(j, je), Be);
      }
      for (pe = i(pe); je < L.length; je++)
        ((qe = Y(pe, j, je, L[je], $)),
          qe !== null &&
            (e && qe.alternate !== null && pe.delete(qe.key === null ? je : qe.key),
            (O = o(qe, O, je)),
            Ge === null ? (Be = qe) : (Ge.sibling = qe),
            (Ge = qe)));
      return (
        e &&
          pe.forEach(function (Tn) {
            return t(j, Tn);
          }),
        ke && Lu(j, je),
        Be
      );
    }
    function Se(j, O, L, $) {
      if (L == null) throw Error(l(151));
      for (
        var Be = null, Ge = null, pe = O, je = (O = 0), qe = null, Ye = L.next();
        pe !== null && !Ye.done;
        je++, Ye = L.next()
      ) {
        pe.index > je ? ((qe = pe), (pe = null)) : (qe = pe.sibling);
        var Tn = U(j, pe, Ye.value, $);
        if (Tn === null) {
          pe === null && (pe = qe);
          break;
        }
        (e && pe && Tn.alternate === null && t(j, pe),
          (O = o(Tn, O, je)),
          Ge === null ? (Be = Tn) : (Ge.sibling = Tn),
          (Ge = Tn),
          (pe = qe));
      }
      if (Ye.done) return (a(j, pe), ke && Lu(j, je), Be);
      if (pe === null) {
        for (; !Ye.done; je++, Ye = L.next())
          ((Ye = te(j, Ye.value, $)),
            Ye !== null &&
              ((O = o(Ye, O, je)), Ge === null ? (Be = Ye) : (Ge.sibling = Ye), (Ge = Ye)));
        return (ke && Lu(j, je), Be);
      }
      for (pe = i(pe); !Ye.done; je++, Ye = L.next())
        ((Ye = Y(pe, j, je, Ye.value, $)),
          Ye !== null &&
            (e && Ye.alternate !== null && pe.delete(Ye.key === null ? je : Ye.key),
            (O = o(Ye, O, je)),
            Ge === null ? (Be = Ye) : (Ge.sibling = Ye),
            (Ge = Ye)));
      return (
        e &&
          pe.forEach(function ($m) {
            return t(j, $m);
          }),
        ke && Lu(j, je),
        Be
      );
    }
    function et(j, O, L, $) {
      if (
        (typeof L == 'object' &&
          L !== null &&
          L.type === z &&
          L.key === null &&
          (L = L.props.children),
        typeof L == 'object' && L !== null)
      ) {
        switch (L.$$typeof) {
          case F:
            e: {
              for (var Be = L.key; O !== null;) {
                if (O.key === Be) {
                  if (((Be = L.type), Be === z)) {
                    if (O.tag === 7) {
                      (a(j, O.sibling), ($ = f(O, L.props.children)), ($.return = j), (j = $));
                      break e;
                    }
                  } else if (
                    O.elementType === Be ||
                    (typeof Be == 'object' &&
                      Be !== null &&
                      Be.$$typeof === se &&
                      Qn(Be) === O.type)
                  ) {
                    (a(j, O.sibling), ($ = f(O, L.props)), Er($, L), ($.return = j), (j = $));
                    break e;
                  }
                  a(j, O);
                  break;
                } else t(j, O);
                O = O.sibling;
              }
              L.type === z
                ? (($ = Gn(L.props.children, j.mode, $, L.key)), ($.return = j), (j = $))
                : (($ = Tl(L.type, L.key, L.props, null, j.mode, $)),
                  Er($, L),
                  ($.return = j),
                  (j = $));
            }
            return v(j);
          case M:
            e: {
              for (Be = L.key; O !== null;) {
                if (O.key === Be)
                  if (
                    O.tag === 4 &&
                    O.stateNode.containerInfo === L.containerInfo &&
                    O.stateNode.implementation === L.implementation
                  ) {
                    (a(j, O.sibling), ($ = f(O, L.children || [])), ($.return = j), (j = $));
                    break e;
                  } else {
                    a(j, O);
                    break;
                  }
                else t(j, O);
                O = O.sibling;
              }
              (($ = bs(L, j.mode, $)), ($.return = j), (j = $));
            }
            return v(j);
          case se:
            return ((L = Qn(L)), et(j, O, L, $));
        }
        if (ae(L)) return me(j, O, L, $);
        if (ee(L)) {
          if (((Be = ee(L)), typeof Be != 'function')) throw Error(l(150));
          return ((L = Be.call(L)), Se(j, O, L, $));
        }
        if (typeof L.then == 'function') return et(j, O, Ll(L), $);
        if (L.$$typeof === N) return et(j, O, Rl(j, L), $);
        Hl(j, L);
      }
      return (typeof L == 'string' && L !== '') || typeof L == 'number' || typeof L == 'bigint'
        ? ((L = '' + L),
          O !== null && O.tag === 6
            ? (a(j, O.sibling), ($ = f(O, L)), ($.return = j), (j = $))
            : (a(j, O), ($ = ys(L, j.mode, $)), ($.return = j), (j = $)),
          v(j))
        : a(j, O);
    }
    return function (j, O, L, $) {
      try {
        pr = 0;
        var Be = et(j, O, L, $);
        return ((Ta = null), Be);
      } catch (pe) {
        if (pe === xa || pe === zl) throw pe;
        var Ge = It(29, pe, null, j.mode);
        return ((Ge.lanes = $), (Ge.return = j), Ge);
      } finally {
      }
    };
  }
  var Pn = C0(!0),
    p0 = C0(!1),
    dn = !1;
  function Ls(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Hs(e, t) {
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
  function Dn(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function vn(e, t, a) {
    var i = e.updateQueue;
    if (i === null) return null;
    if (((i = i.shared), (Xe & 2) !== 0)) {
      var f = i.pending;
      return (
        f === null ? (t.next = t) : ((t.next = f.next), (f.next = t)),
        (i.pending = t),
        (t = xl(e)),
        u0(e, null, a),
        t
      );
    }
    return (Ol(e, i, t, a), xl(e));
  }
  function Ar(e, t, a) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (a & 4194048) !== 0))) {
      var i = t.lanes;
      ((i &= e.pendingLanes), (a |= i), (t.lanes = a), oc(e, a));
    }
  }
  function Us(e, t) {
    var a = e.updateQueue,
      i = e.alternate;
    if (i !== null && ((i = i.updateQueue), a === i)) {
      var f = null,
        o = null;
      if (((a = a.firstBaseUpdate), a !== null)) {
        do {
          var v = { lane: a.lane, tag: a.tag, payload: a.payload, callback: null, next: null };
          (o === null ? (f = o = v) : (o = o.next = v), (a = a.next));
        } while (a !== null);
        o === null ? (f = o = t) : (o = o.next = t);
      } else f = o = t;
      ((a = {
        baseState: i.baseState,
        firstBaseUpdate: f,
        lastBaseUpdate: o,
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
  var qs = !1;
  function Br() {
    if (qs) {
      var e = Oa;
      if (e !== null) throw e;
    }
  }
  function yr(e, t, a, i) {
    qs = !1;
    var f = e.updateQueue;
    dn = !1;
    var o = f.firstBaseUpdate,
      v = f.lastBaseUpdate,
      p = f.shared.pending;
    if (p !== null) {
      f.shared.pending = null;
      var b = p,
        H = b.next;
      ((b.next = null), v === null ? (o = H) : (v.next = H), (v = b));
      var Q = e.alternate;
      Q !== null &&
        ((Q = Q.updateQueue),
        (p = Q.lastBaseUpdate),
        p !== v && (p === null ? (Q.firstBaseUpdate = H) : (p.next = H), (Q.lastBaseUpdate = b)));
    }
    if (o !== null) {
      var te = f.baseState;
      ((v = 0), (Q = H = b = null), (p = o));
      do {
        var U = p.lane & -536870913,
          Y = U !== p.lane;
        if (Y ? (Ue & U) === U : (i & U) === U) {
          (U !== 0 && U === Sa && (qs = !0),
            Q !== null &&
              (Q = Q.next =
                { lane: 0, tag: p.tag, payload: p.payload, callback: null, next: null }));
          e: {
            var me = e,
              Se = p;
            U = t;
            var et = a;
            switch (Se.tag) {
              case 1:
                if (((me = Se.payload), typeof me == 'function')) {
                  te = me.call(et, te, U);
                  break e;
                }
                te = me;
                break e;
              case 3:
                me.flags = (me.flags & -65537) | 128;
              case 0:
                if (
                  ((me = Se.payload),
                  (U = typeof me == 'function' ? me.call(et, te, U) : me),
                  U == null)
                )
                  break e;
                te = A({}, te, U);
                break e;
              case 2:
                dn = !0;
            }
          }
          ((U = p.callback),
            U !== null &&
              ((e.flags |= 64),
              Y && (e.flags |= 8192),
              (Y = f.callbacks),
              Y === null ? (f.callbacks = [U]) : Y.push(U)));
        } else
          ((Y = { lane: U, tag: p.tag, payload: p.payload, callback: p.callback, next: null }),
            Q === null ? ((H = Q = Y), (b = te)) : (Q = Q.next = Y),
            (v |= U));
        if (((p = p.next), p === null)) {
          if (((p = f.shared.pending), p === null)) break;
          ((Y = p),
            (p = Y.next),
            (Y.next = null),
            (f.lastBaseUpdate = Y),
            (f.shared.pending = null));
        }
      } while (!0);
      (Q === null && (b = te),
        (f.baseState = b),
        (f.firstBaseUpdate = H),
        (f.lastBaseUpdate = Q),
        o === null && (f.shared.lanes = 0),
        (pn |= v),
        (e.lanes = v),
        (e.memoizedState = te));
    }
  }
  function E0(e, t) {
    if (typeof e != 'function') throw Error(l(191, e));
    e.call(t);
  }
  function A0(e, t) {
    var a = e.callbacks;
    if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) E0(a[e], t);
  }
  var wa = y(null),
    Ul = y(0);
  function B0(e, t) {
    ((e = Qu), K(Ul, e), K(wa, t), (Qu = e | t.baseLanes));
  }
  function ks() {
    (K(Ul, Qu), K(wa, wa.current));
  }
  function _s() {
    ((Qu = Ul.current), q(wa), q(Ul));
  }
  var eu = y(null),
    Du = null;
  function hn(e) {
    var t = e.alternate;
    (K(Dt, Dt.current & 1),
      K(eu, e),
      Du === null && (t === null || wa.current !== null || t.memoizedState !== null) && (Du = e));
  }
  function Gs(e) {
    (K(Dt, Dt.current), K(eu, e), Du === null && (Du = e));
  }
  function y0(e) {
    e.tag === 22 ? (K(Dt, Dt.current), K(eu, e), Du === null && (Du = e)) : gn();
  }
  function gn() {
    (K(Dt, Dt.current), K(eu, eu.current));
  }
  function tu(e) {
    (q(eu), Du === e && (Du = null), q(Dt));
  }
  var Dt = y(0);
  function ql(e) {
    for (var t = e; t !== null;) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && ((a = a.dehydrated), a === null || Pf(a) || Jf(a))) return t;
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
  var qu = 0,
    Re = null,
    $e = null,
    gt = null,
    kl = !1,
    Ma = !1,
    Jn = !1,
    _l = 0,
    br = 0,
    Ra = null,
    G1 = 0;
  function ct() {
    throw Error(l(321));
  }
  function Ys(e, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < e.length; a++) if (!$t(e[a], t[a])) return !1;
    return !0;
  }
  function Vs(e, t, a, i, f, o) {
    return (
      (qu = o),
      (Re = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (R.H = e === null || e.memoizedState === null ? ld : rf),
      (Jn = !1),
      (o = a(i, f)),
      (Jn = !1),
      Ma && (o = F0(t, a, i, f)),
      b0(e),
      o
    );
  }
  function b0(e) {
    R.H = Or;
    var t = $e !== null && $e.next !== null;
    if (((qu = 0), (gt = $e = Re = null), (kl = !1), (br = 0), (Ra = null), t)) throw Error(l(300));
    e === null || mt || ((e = e.dependencies), e !== null && Ml(e) && (mt = !0));
  }
  function F0(e, t, a, i) {
    Re = e;
    var f = 0;
    do {
      if ((Ma && (Ra = null), (br = 0), (Ma = !1), 25 <= f)) throw Error(l(301));
      if (((f += 1), (gt = $e = null), e.updateQueue != null)) {
        var o = e.updateQueue;
        ((o.lastEffect = null),
          (o.events = null),
          (o.stores = null),
          o.memoCache != null && (o.memoCache.index = 0));
      }
      ((R.H = id), (o = t(a, i)));
    } while (Ma);
    return o;
  }
  function Y1() {
    var e = R.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == 'function' ? Fr(t) : t),
      (e = e.useState()[0]),
      ($e !== null ? $e.memoizedState : null) !== e && (Re.flags |= 1024),
      t
    );
  }
  function Xs() {
    var e = _l !== 0;
    return ((_l = 0), e);
  }
  function Ks(e, t, a) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~a));
  }
  function Qs(e) {
    if (kl) {
      for (e = e.memoizedState; e !== null;) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      kl = !1;
    }
    ((qu = 0), (gt = $e = Re = null), (Ma = !1), (br = _l = 0), (Ra = null));
  }
  function qt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (gt === null ? (Re.memoizedState = gt = e) : (gt = gt.next = e), gt);
  }
  function vt() {
    if ($e === null) {
      var e = Re.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = $e.next;
    var t = gt === null ? Re.memoizedState : gt.next;
    if (t !== null) ((gt = t), ($e = e));
    else {
      if (e === null) throw Re.alternate === null ? Error(l(467)) : Error(l(310));
      (($e = e),
        (e = {
          memoizedState: $e.memoizedState,
          baseState: $e.baseState,
          baseQueue: $e.baseQueue,
          queue: $e.queue,
          next: null,
        }),
        gt === null ? (Re.memoizedState = gt = e) : (gt = gt.next = e));
    }
    return gt;
  }
  function Gl() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fr(e) {
    var t = br;
    return (
      (br += 1),
      Ra === null && (Ra = []),
      (e = h0(Ra, e, t)),
      (t = Re),
      (gt === null ? t.memoizedState : gt.next) === null &&
        ((t = t.alternate), (R.H = t === null || t.memoizedState === null ? ld : rf)),
      e
    );
  }
  function Yl(e) {
    if (e !== null && typeof e == 'object') {
      if (typeof e.then == 'function') return Fr(e);
      if (e.$$typeof === N) return Tt(e);
    }
    throw Error(l(438, String(e)));
  }
  function Zs(e) {
    var t = null,
      a = Re.updateQueue;
    if ((a !== null && (t = a.memoCache), t == null)) {
      var i = Re.alternate;
      i !== null &&
        ((i = i.updateQueue),
        i !== null &&
          ((i = i.memoCache),
          i != null &&
            (t = {
              data: i.data.map(function (f) {
                return f.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      a === null && ((a = Gl()), (Re.updateQueue = a)),
      (a.memoCache = t),
      (a = t.data[t.index]),
      a === void 0)
    )
      for (a = t.data[t.index] = Array(e), i = 0; i < e; i++) a[i] = ve;
    return (t.index++, a);
  }
  function ku(e, t) {
    return typeof t == 'function' ? t(e) : t;
  }
  function Vl(e) {
    var t = vt();
    return Ps(t, $e, e);
  }
  function Ps(e, t, a) {
    var i = e.queue;
    if (i === null) throw Error(l(311));
    i.lastRenderedReducer = a;
    var f = e.baseQueue,
      o = i.pending;
    if (o !== null) {
      if (f !== null) {
        var v = f.next;
        ((f.next = o.next), (o.next = v));
      }
      ((t.baseQueue = f = o), (i.pending = null));
    }
    if (((o = e.baseState), f === null)) e.memoizedState = o;
    else {
      t = f.next;
      var p = (v = null),
        b = null,
        H = t,
        Q = !1;
      do {
        var te = H.lane & -536870913;
        if (te !== H.lane ? (Ue & te) === te : (qu & te) === te) {
          var U = H.revertLane;
          if (U === 0)
            (b !== null &&
              (b = b.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: H.action,
                  hasEagerState: H.hasEagerState,
                  eagerState: H.eagerState,
                  next: null,
                }),
              te === Sa && (Q = !0));
          else if ((qu & U) === U) {
            ((H = H.next), U === Sa && (Q = !0));
            continue;
          } else
            ((te = {
              lane: 0,
              revertLane: H.revertLane,
              gesture: null,
              action: H.action,
              hasEagerState: H.hasEagerState,
              eagerState: H.eagerState,
              next: null,
            }),
              b === null ? ((p = b = te), (v = o)) : (b = b.next = te),
              (Re.lanes |= U),
              (pn |= U));
          ((te = H.action), Jn && a(o, te), (o = H.hasEagerState ? H.eagerState : a(o, te)));
        } else
          ((U = {
            lane: te,
            revertLane: H.revertLane,
            gesture: H.gesture,
            action: H.action,
            hasEagerState: H.hasEagerState,
            eagerState: H.eagerState,
            next: null,
          }),
            b === null ? ((p = b = U), (v = o)) : (b = b.next = U),
            (Re.lanes |= te),
            (pn |= te));
        H = H.next;
      } while (H !== null && H !== t);
      if (
        (b === null ? (v = o) : (b.next = p),
        !$t(o, e.memoizedState) && ((mt = !0), Q && ((a = Oa), a !== null)))
      )
        throw a;
      ((e.memoizedState = o), (e.baseState = v), (e.baseQueue = b), (i.lastRenderedState = o));
    }
    return (f === null && (i.lanes = 0), [e.memoizedState, i.dispatch]);
  }
  function Js(e) {
    var t = vt(),
      a = t.queue;
    if (a === null) throw Error(l(311));
    a.lastRenderedReducer = e;
    var i = a.dispatch,
      f = a.pending,
      o = t.memoizedState;
    if (f !== null) {
      a.pending = null;
      var v = (f = f.next);
      do ((o = e(o, v.action)), (v = v.next));
      while (v !== f);
      ($t(o, t.memoizedState) || (mt = !0),
        (t.memoizedState = o),
        t.baseQueue === null && (t.baseState = o),
        (a.lastRenderedState = o));
    }
    return [o, i];
  }
  function S0(e, t, a) {
    var i = Re,
      f = vt(),
      o = ke;
    if (o) {
      if (a === void 0) throw Error(l(407));
      a = a();
    } else a = t();
    var v = !$t(($e || f).memoizedState, a);
    if (
      (v && ((f.memoizedState = a), (mt = !0)),
      (f = f.queue),
      Is(T0.bind(null, i, f, e), [e]),
      f.getSnapshot !== t || v || (gt !== null && gt.memoizedState.tag & 1))
    ) {
      if (
        ((i.flags |= 2048),
        ja(9, { destroy: void 0 }, x0.bind(null, i, f, a, t), null),
        tt === null)
      )
        throw Error(l(349));
      o || (qu & 127) !== 0 || O0(i, t, a);
    }
    return a;
  }
  function O0(e, t, a) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: a }),
      (t = Re.updateQueue),
      t === null
        ? ((t = Gl()), (Re.updateQueue = t), (t.stores = [e]))
        : ((a = t.stores), a === null ? (t.stores = [e]) : a.push(e)));
  }
  function x0(e, t, a, i) {
    ((t.value = a), (t.getSnapshot = i), w0(t) && M0(e));
  }
  function T0(e, t, a) {
    return a(function () {
      w0(t) && M0(e);
    });
  }
  function w0(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var a = t();
      return !$t(e, a);
    } catch {
      return !0;
    }
  }
  function M0(e) {
    var t = _n(e, 2);
    t !== null && Jt(t, e, 2);
  }
  function Ws(e) {
    var t = qt();
    if (typeof e == 'function') {
      var a = e;
      if (((e = a()), Jn)) {
        mu(!0);
        try {
          a();
        } finally {
          mu(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ku,
        lastRenderedState: e,
      }),
      t
    );
  }
  function R0(e, t, a, i) {
    return ((e.baseState = a), Ps(e, $e, typeof i == 'function' ? i : ku));
  }
  function V1(e, t, a, i, f) {
    if (Ql(e)) throw Error(l(485));
    if (((e = t.action), e !== null)) {
      var o = {
        payload: f,
        action: e,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (v) {
          o.listeners.push(v);
        },
      };
      (R.T !== null ? a(!0) : (o.isTransition = !1),
        i(o),
        (a = t.pending),
        a === null
          ? ((o.next = t.pending = o), j0(t, o))
          : ((o.next = a.next), (t.pending = a.next = o)));
    }
  }
  function j0(e, t) {
    var a = t.action,
      i = t.payload,
      f = e.state;
    if (t.isTransition) {
      var o = R.T,
        v = {};
      R.T = v;
      try {
        var p = a(f, i),
          b = R.S;
        (b !== null && b(v, p), z0(e, t, p));
      } catch (H) {
        $s(e, t, H);
      } finally {
        (o !== null && v.types !== null && (o.types = v.types), (R.T = o));
      }
    } else
      try {
        ((o = a(f, i)), z0(e, t, o));
      } catch (H) {
        $s(e, t, H);
      }
  }
  function z0(e, t, a) {
    a !== null && typeof a == 'object' && typeof a.then == 'function'
      ? a.then(
          function (i) {
            N0(e, t, i);
          },
          function (i) {
            return $s(e, t, i);
          },
        )
      : N0(e, t, a);
  }
  function N0(e, t, a) {
    ((t.status = 'fulfilled'),
      (t.value = a),
      L0(t),
      (e.state = a),
      (t = e.pending),
      t !== null &&
        ((a = t.next), a === t ? (e.pending = null) : ((a = a.next), (t.next = a), j0(e, a))));
  }
  function $s(e, t, a) {
    var i = e.pending;
    if (((e.pending = null), i !== null)) {
      i = i.next;
      do ((t.status = 'rejected'), (t.reason = a), L0(t), (t = t.next));
      while (t !== i);
    }
    e.action = null;
  }
  function L0(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function H0(e, t) {
    return t;
  }
  function U0(e, t) {
    if (ke) {
      var a = tt.formState;
      if (a !== null) {
        e: {
          var i = Re;
          if (ke) {
            if (nt) {
              t: {
                for (var f = nt, o = du; f.nodeType !== 8;) {
                  if (!o) {
                    f = null;
                    break t;
                  }
                  if (((f = vu(f.nextSibling)), f === null)) {
                    f = null;
                    break t;
                  }
                }
                ((o = f.data), (f = o === 'F!' || o === 'F' ? f : null));
              }
              if (f) {
                ((nt = vu(f.nextSibling)), (i = f.data === 'F!'));
                break e;
              }
            }
            on(i);
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
        lastRenderedReducer: H0,
        lastRenderedState: t,
      }),
      (a.queue = i),
      (a = nd.bind(null, Re, i)),
      (i.dispatch = a),
      (i = Ws(!1)),
      (o = af.bind(null, Re, !1, i.queue)),
      (i = qt()),
      (f = { state: t, dispatch: null, action: e, pending: null }),
      (i.queue = f),
      (a = V1.bind(null, Re, f, o, a)),
      (f.dispatch = a),
      (i.memoizedState = e),
      [t, a, !1]
    );
  }
  function q0(e) {
    var t = vt();
    return k0(t, $e, e);
  }
  function k0(e, t, a) {
    if (
      ((t = Ps(e, t, H0)[0]),
      (e = Vl(ku)[0]),
      typeof t == 'object' && t !== null && typeof t.then == 'function')
    )
      try {
        var i = Fr(t);
      } catch (v) {
        throw v === xa ? zl : v;
      }
    else i = t;
    t = vt();
    var f = t.queue,
      o = f.dispatch;
    return (
      a !== t.memoizedState &&
        ((Re.flags |= 2048), ja(9, { destroy: void 0 }, X1.bind(null, f, a), null)),
      [i, o, e]
    );
  }
  function X1(e, t) {
    e.action = t;
  }
  function _0(e) {
    var t = vt(),
      a = $e;
    if (a !== null) return k0(t, a, e);
    (vt(), (t = t.memoizedState), (a = vt()));
    var i = a.queue.dispatch;
    return ((a.memoizedState = e), [t, i, !1]);
  }
  function ja(e, t, a, i) {
    return (
      (e = { tag: e, create: a, deps: i, inst: t, next: null }),
      (t = Re.updateQueue),
      t === null && ((t = Gl()), (Re.updateQueue = t)),
      (a = t.lastEffect),
      a === null
        ? (t.lastEffect = e.next = e)
        : ((i = a.next), (a.next = e), (e.next = i), (t.lastEffect = e)),
      e
    );
  }
  function G0() {
    return vt().memoizedState;
  }
  function Xl(e, t, a, i) {
    var f = qt();
    ((Re.flags |= e),
      (f.memoizedState = ja(1 | t, { destroy: void 0 }, a, i === void 0 ? null : i)));
  }
  function Kl(e, t, a, i) {
    var f = vt();
    i = i === void 0 ? null : i;
    var o = f.memoizedState.inst;
    $e !== null && i !== null && Ys(i, $e.memoizedState.deps)
      ? (f.memoizedState = ja(t, o, a, i))
      : ((Re.flags |= e), (f.memoizedState = ja(1 | t, o, a, i)));
  }
  function Y0(e, t) {
    Xl(8390656, 8, e, t);
  }
  function Is(e, t) {
    Kl(2048, 8, e, t);
  }
  function K1(e) {
    Re.flags |= 4;
    var t = Re.updateQueue;
    if (t === null) ((t = Gl()), (Re.updateQueue = t), (t.events = [e]));
    else {
      var a = t.events;
      a === null ? (t.events = [e]) : a.push(e);
    }
  }
  function V0(e) {
    var t = vt().memoizedState;
    return (
      K1({ ref: t, nextImpl: e }),
      function () {
        if ((Xe & 2) !== 0) throw Error(l(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function X0(e, t) {
    return Kl(4, 2, e, t);
  }
  function K0(e, t) {
    return Kl(4, 4, e, t);
  }
  function Q0(e, t) {
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
  function Z0(e, t, a) {
    ((a = a != null ? a.concat([e]) : null), Kl(4, 4, Q0.bind(null, t, e), a));
  }
  function ef() {}
  function P0(e, t) {
    var a = vt();
    t = t === void 0 ? null : t;
    var i = a.memoizedState;
    return t !== null && Ys(t, i[1]) ? i[0] : ((a.memoizedState = [e, t]), e);
  }
  function J0(e, t) {
    var a = vt();
    t = t === void 0 ? null : t;
    var i = a.memoizedState;
    if (t !== null && Ys(t, i[1])) return i[0];
    if (((i = e()), Jn)) {
      mu(!0);
      try {
        e();
      } finally {
        mu(!1);
      }
    }
    return ((a.memoizedState = [i, t]), i);
  }
  function tf(e, t, a) {
    return a === void 0 || ((qu & 1073741824) !== 0 && (Ue & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = a), (e = Wd()), (Re.lanes |= e), (pn |= e), a);
  }
  function W0(e, t, a, i) {
    return $t(a, t)
      ? a
      : wa.current !== null
        ? ((e = tf(e, a, i)), $t(e, t) || (mt = !0), e)
        : (qu & 42) === 0 || ((qu & 1073741824) !== 0 && (Ue & 261930) === 0)
          ? ((mt = !0), (e.memoizedState = a))
          : ((e = Wd()), (Re.lanes |= e), (pn |= e), t);
  }
  function $0(e, t, a, i, f) {
    var o = G.p;
    G.p = o !== 0 && 8 > o ? o : 8;
    var v = R.T,
      p = {};
    ((R.T = p), af(e, !1, t, a));
    try {
      var b = f(),
        H = R.S;
      if (
        (H !== null && H(p, b), b !== null && typeof b == 'object' && typeof b.then == 'function')
      ) {
        var Q = _1(b, i);
        Sr(e, t, Q, au(e));
      } else Sr(e, t, i, au(e));
    } catch (te) {
      Sr(e, t, { then: function () {}, status: 'rejected', reason: te }, au());
    } finally {
      ((G.p = o), v !== null && p.types !== null && (v.types = p.types), (R.T = v));
    }
  }
  function Q1() {}
  function uf(e, t, a, i) {
    if (e.tag !== 5) throw Error(l(476));
    var f = I0(e).queue;
    $0(
      e,
      f,
      t,
      De,
      a === null
        ? Q1
        : function () {
            return (ed(e), a(i));
          },
    );
  }
  function I0(e) {
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
        lastRenderedReducer: ku,
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
          lastRenderedReducer: ku,
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
  function ed(e) {
    var t = I0(e);
    (t.next === null && (t = e.alternate.memoizedState), Sr(e, t.next.queue, {}, au()));
  }
  function nf() {
    return Tt(Yr);
  }
  function td() {
    return vt().memoizedState;
  }
  function ud() {
    return vt().memoizedState;
  }
  function Z1(e) {
    for (var t = e.return; t !== null;) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = au();
          e = Dn(a);
          var i = vn(t, e, a);
          (i !== null && (Jt(i, t, a), Ar(i, t, a)), (t = { cache: Rs() }), (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function P1(e, t, a) {
    var i = au();
    ((a = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Ql(e) ? ad(t, a) : ((a = As(e, t, a, i)), a !== null && (Jt(a, e, i), rd(a, t, i))));
  }
  function nd(e, t, a) {
    var i = au();
    Sr(e, t, a, i);
  }
  function Sr(e, t, a, i) {
    var f = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Ql(e)) ad(t, f);
    else {
      var o = e.alternate;
      if (
        e.lanes === 0 &&
        (o === null || o.lanes === 0) &&
        ((o = t.lastRenderedReducer), o !== null)
      )
        try {
          var v = t.lastRenderedState,
            p = o(v, a);
          if (((f.hasEagerState = !0), (f.eagerState = p), $t(p, v)))
            return (Ol(e, t, f, 0), tt === null && Sl(), !1);
        } catch {
        } finally {
        }
      if (((a = As(e, t, f, i)), a !== null)) return (Jt(a, e, i), rd(a, t, i), !0);
    }
    return !1;
  }
  function af(e, t, a, i) {
    if (
      ((i = {
        lane: 2,
        revertLane: Hf(),
        gesture: null,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Ql(e))
    ) {
      if (t) throw Error(l(479));
    } else ((t = As(e, a, i, 2)), t !== null && Jt(t, e, 2));
  }
  function Ql(e) {
    var t = e.alternate;
    return e === Re || (t !== null && t === Re);
  }
  function ad(e, t) {
    Ma = kl = !0;
    var a = e.pending;
    (a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)), (e.pending = t));
  }
  function rd(e, t, a) {
    if ((a & 4194048) !== 0) {
      var i = t.lanes;
      ((i &= e.pendingLanes), (a |= i), (t.lanes = a), oc(e, a));
    }
  }
  var Or = {
    readContext: Tt,
    use: Yl,
    useCallback: ct,
    useContext: ct,
    useEffect: ct,
    useImperativeHandle: ct,
    useLayoutEffect: ct,
    useInsertionEffect: ct,
    useMemo: ct,
    useReducer: ct,
    useRef: ct,
    useState: ct,
    useDebugValue: ct,
    useDeferredValue: ct,
    useTransition: ct,
    useSyncExternalStore: ct,
    useId: ct,
    useHostTransitionStatus: ct,
    useFormState: ct,
    useActionState: ct,
    useOptimistic: ct,
    useMemoCache: ct,
    useCacheRefresh: ct,
  };
  Or.useEffectEvent = ct;
  var ld = {
      readContext: Tt,
      use: Yl,
      useCallback: function (e, t) {
        return ((qt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: Tt,
      useEffect: Y0,
      useImperativeHandle: function (e, t, a) {
        ((a = a != null ? a.concat([e]) : null), Xl(4194308, 4, Q0.bind(null, t, e), a));
      },
      useLayoutEffect: function (e, t) {
        return Xl(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        Xl(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var a = qt();
        t = t === void 0 ? null : t;
        var i = e();
        if (Jn) {
          mu(!0);
          try {
            e();
          } finally {
            mu(!1);
          }
        }
        return ((a.memoizedState = [i, t]), i);
      },
      useReducer: function (e, t, a) {
        var i = qt();
        if (a !== void 0) {
          var f = a(t);
          if (Jn) {
            mu(!0);
            try {
              a(t);
            } finally {
              mu(!1);
            }
          }
        } else f = t;
        return (
          (i.memoizedState = i.baseState = f),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: f,
          }),
          (i.queue = e),
          (e = e.dispatch = P1.bind(null, Re, e)),
          [i.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = qt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = Ws(e);
        var t = e.queue,
          a = nd.bind(null, Re, t);
        return ((t.dispatch = a), [e.memoizedState, a]);
      },
      useDebugValue: ef,
      useDeferredValue: function (e, t) {
        var a = qt();
        return tf(a, e, t);
      },
      useTransition: function () {
        var e = Ws(!1);
        return ((e = $0.bind(null, Re, e.queue, !0, !1)), (qt().memoizedState = e), [!1, e]);
      },
      useSyncExternalStore: function (e, t, a) {
        var i = Re,
          f = qt();
        if (ke) {
          if (a === void 0) throw Error(l(407));
          a = a();
        } else {
          if (((a = t()), tt === null)) throw Error(l(349));
          (Ue & 127) !== 0 || O0(i, t, a);
        }
        f.memoizedState = a;
        var o = { value: a, getSnapshot: t };
        return (
          (f.queue = o),
          Y0(T0.bind(null, i, o, e), [e]),
          (i.flags |= 2048),
          ja(9, { destroy: void 0 }, x0.bind(null, i, o, a, t), null),
          a
        );
      },
      useId: function () {
        var e = qt(),
          t = tt.identifierPrefix;
        if (ke) {
          var a = bu,
            i = yu;
          ((a = (i & ~(1 << (32 - Ut(i) - 1))).toString(32) + a),
            (t = '_' + t + 'R_' + a),
            (a = _l++),
            0 < a && (t += 'H' + a.toString(32)),
            (t += '_'));
        } else ((a = G1++), (t = '_' + t + 'r_' + a.toString(32) + '_'));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: nf,
      useFormState: U0,
      useActionState: U0,
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
        return ((t.queue = a), (t = af.bind(null, Re, !0, a)), (a.dispatch = t), [e, t]);
      },
      useMemoCache: Zs,
      useCacheRefresh: function () {
        return (qt().memoizedState = Z1.bind(null, Re));
      },
      useEffectEvent: function (e) {
        var t = qt(),
          a = { impl: e };
        return (
          (t.memoizedState = a),
          function () {
            if ((Xe & 2) !== 0) throw Error(l(440));
            return a.impl.apply(void 0, arguments);
          }
        );
      },
    },
    rf = {
      readContext: Tt,
      use: Yl,
      useCallback: P0,
      useContext: Tt,
      useEffect: Is,
      useImperativeHandle: Z0,
      useInsertionEffect: X0,
      useLayoutEffect: K0,
      useMemo: J0,
      useReducer: Vl,
      useRef: G0,
      useState: function () {
        return Vl(ku);
      },
      useDebugValue: ef,
      useDeferredValue: function (e, t) {
        var a = vt();
        return W0(a, $e.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Vl(ku)[0],
          t = vt().memoizedState;
        return [typeof e == 'boolean' ? e : Fr(e), t];
      },
      useSyncExternalStore: S0,
      useId: td,
      useHostTransitionStatus: nf,
      useFormState: q0,
      useActionState: q0,
      useOptimistic: function (e, t) {
        var a = vt();
        return R0(a, $e, e, t);
      },
      useMemoCache: Zs,
      useCacheRefresh: ud,
    };
  rf.useEffectEvent = V0;
  var id = {
    readContext: Tt,
    use: Yl,
    useCallback: P0,
    useContext: Tt,
    useEffect: Is,
    useImperativeHandle: Z0,
    useInsertionEffect: X0,
    useLayoutEffect: K0,
    useMemo: J0,
    useReducer: Js,
    useRef: G0,
    useState: function () {
      return Js(ku);
    },
    useDebugValue: ef,
    useDeferredValue: function (e, t) {
      var a = vt();
      return $e === null ? tf(a, e, t) : W0(a, $e.memoizedState, e, t);
    },
    useTransition: function () {
      var e = Js(ku)[0],
        t = vt().memoizedState;
      return [typeof e == 'boolean' ? e : Fr(e), t];
    },
    useSyncExternalStore: S0,
    useId: td,
    useHostTransitionStatus: nf,
    useFormState: _0,
    useActionState: _0,
    useOptimistic: function (e, t) {
      var a = vt();
      return $e !== null ? R0(a, $e, e, t) : ((a.baseState = e), [e, a.queue.dispatch]);
    },
    useMemoCache: Zs,
    useCacheRefresh: ud,
  };
  id.useEffectEvent = V0;
  function lf(e, t, a, i) {
    ((t = e.memoizedState),
      (a = a(i, t)),
      (a = a == null ? t : A({}, t, a)),
      (e.memoizedState = a),
      e.lanes === 0 && (e.updateQueue.baseState = a));
  }
  var sf = {
    enqueueSetState: function (e, t, a) {
      e = e._reactInternals;
      var i = au(),
        f = Dn(i);
      ((f.payload = t),
        a != null && (f.callback = a),
        (t = vn(e, f, i)),
        t !== null && (Jt(t, e, i), Ar(t, e, i)));
    },
    enqueueReplaceState: function (e, t, a) {
      e = e._reactInternals;
      var i = au(),
        f = Dn(i);
      ((f.tag = 1),
        (f.payload = t),
        a != null && (f.callback = a),
        (t = vn(e, f, i)),
        t !== null && (Jt(t, e, i), Ar(t, e, i)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var a = au(),
        i = Dn(a);
      ((i.tag = 2),
        t != null && (i.callback = t),
        (t = vn(e, i, a)),
        t !== null && (Jt(t, e, a), Ar(t, e, a)));
    },
  };
  function sd(e, t, a, i, f, o, v) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == 'function'
        ? e.shouldComponentUpdate(i, o, v)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Dr(a, i) || !Dr(f, o)
          : !0
    );
  }
  function fd(e, t, a, i) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(a, i),
      typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
        t.UNSAFE_componentWillReceiveProps(a, i),
      t.state !== e && sf.enqueueReplaceState(t, t.state, null));
  }
  function Wn(e, t) {
    var a = t;
    if ('ref' in t) {
      a = {};
      for (var i in t) i !== 'ref' && (a[i] = t[i]);
    }
    if ((e = e.defaultProps)) {
      a === t && (a = A({}, a));
      for (var f in e) a[f] === void 0 && (a[f] = e[f]);
    }
    return a;
  }
  function od(e) {
    Fl(e);
  }
  function cd(e) {
    console.error(e);
  }
  function dd(e) {
    Fl(e);
  }
  function Zl(e, t) {
    try {
      var a = e.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (i) {
      setTimeout(function () {
        throw i;
      });
    }
  }
  function Dd(e, t, a) {
    try {
      var i = e.onCaughtError;
      i(a.value, { componentStack: a.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (f) {
      setTimeout(function () {
        throw f;
      });
    }
  }
  function ff(e, t, a) {
    return (
      (a = Dn(a)),
      (a.tag = 3),
      (a.payload = { element: null }),
      (a.callback = function () {
        Zl(e, t);
      }),
      a
    );
  }
  function vd(e) {
    return ((e = Dn(e)), (e.tag = 3), e);
  }
  function hd(e, t, a, i) {
    var f = a.type.getDerivedStateFromError;
    if (typeof f == 'function') {
      var o = i.value;
      ((e.payload = function () {
        return f(o);
      }),
        (e.callback = function () {
          Dd(t, a, i);
        }));
    }
    var v = a.stateNode;
    v !== null &&
      typeof v.componentDidCatch == 'function' &&
      (e.callback = function () {
        (Dd(t, a, i),
          typeof f != 'function' && (En === null ? (En = new Set([this])) : En.add(this)));
        var p = i.stack;
        this.componentDidCatch(i.value, { componentStack: p !== null ? p : '' });
      });
  }
  function J1(e, t, a, i, f) {
    if (((a.flags |= 32768), i !== null && typeof i == 'object' && typeof i.then == 'function')) {
      if (((t = a.alternate), t !== null && Fa(t, a, f, !0), (a = eu.current), a !== null)) {
        switch (a.tag) {
          case 31:
          case 13:
            return (
              Du === null ? li() : a.alternate === null && dt === 0 && (dt = 3),
              (a.flags &= -257),
              (a.flags |= 65536),
              (a.lanes = f),
              i === Nl
                ? (a.flags |= 16384)
                : ((t = a.updateQueue),
                  t === null ? (a.updateQueue = new Set([i])) : t.add(i),
                  zf(e, i, f)),
              !1
            );
          case 22:
            return (
              (a.flags |= 65536),
              i === Nl
                ? (a.flags |= 16384)
                : ((t = a.updateQueue),
                  t === null
                    ? ((t = { transitions: null, markerInstances: null, retryQueue: new Set([i]) }),
                      (a.updateQueue = t))
                    : ((a = t.retryQueue), a === null ? (t.retryQueue = new Set([i])) : a.add(i)),
                  zf(e, i, f)),
              !1
            );
        }
        throw Error(l(435, a.tag));
      }
      return (zf(e, i, f), li(), !1);
    }
    if (ke)
      return (
        (t = eu.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = f),
            i !== Os && ((e = Error(l(422), { cause: i })), gr(fu(e, a))))
          : (i !== Os && ((t = Error(l(423), { cause: i })), gr(fu(t, a))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (f &= -f),
            (e.lanes |= f),
            (i = fu(i, a)),
            (f = ff(e.stateNode, i, f)),
            Us(e, f),
            dt !== 4 && (dt = 2)),
        !1
      );
    var o = Error(l(520), { cause: i });
    if (((o = fu(o, a)), Nr === null ? (Nr = [o]) : Nr.push(o), dt !== 4 && (dt = 2), t === null))
      return !0;
    ((i = fu(i, a)), (a = t));
    do {
      switch (a.tag) {
        case 3:
          return (
            (a.flags |= 65536),
            (e = f & -f),
            (a.lanes |= e),
            (e = ff(a.stateNode, i, e)),
            Us(a, e),
            !1
          );
        case 1:
          if (
            ((t = a.type),
            (o = a.stateNode),
            (a.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == 'function' ||
                (o !== null &&
                  typeof o.componentDidCatch == 'function' &&
                  (En === null || !En.has(o)))))
          )
            return (
              (a.flags |= 65536),
              (f &= -f),
              (a.lanes |= f),
              (f = vd(f)),
              hd(f, e, a, i),
              Us(a, f),
              !1
            );
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var of = Error(l(461)),
    mt = !1;
  function wt(e, t, a, i) {
    t.child = e === null ? p0(t, null, a, i) : Pn(t, e.child, a, i);
  }
  function gd(e, t, a, i, f) {
    a = a.render;
    var o = t.ref;
    if ('ref' in i) {
      var v = {};
      for (var p in i) p !== 'ref' && (v[p] = i[p]);
    } else v = i;
    return (
      Xn(t),
      (i = Vs(e, t, a, v, o, f)),
      (p = Xs()),
      e !== null && !mt
        ? (Ks(e, t, f), _u(e, t, f))
        : (ke && p && Fs(t), (t.flags |= 1), wt(e, t, i, f), t.child)
    );
  }
  function md(e, t, a, i, f) {
    if (e === null) {
      var o = a.type;
      return typeof o == 'function' && !Bs(o) && o.defaultProps === void 0 && a.compare === null
        ? ((t.tag = 15), (t.type = o), Cd(e, t, o, i, f))
        : ((e = Tl(a.type, null, i, t, t.mode, f)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((o = e.child), !Cf(e, f))) {
      var v = o.memoizedProps;
      if (((a = a.compare), (a = a !== null ? a : Dr), a(v, i) && e.ref === t.ref))
        return _u(e, t, f);
    }
    return ((t.flags |= 1), (e = Nu(o, i)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function Cd(e, t, a, i, f) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (Dr(o, i) && e.ref === t.ref)
        if (((mt = !1), (t.pendingProps = i = o), Cf(e, f))) (e.flags & 131072) !== 0 && (mt = !0);
        else return ((t.lanes = e.lanes), _u(e, t, f));
    }
    return cf(e, t, a, i, f);
  }
  function pd(e, t, a, i) {
    var f = i.children,
      o = e !== null ? e.memoizedState : null;
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
        if (((o = o !== null ? o.baseLanes | a : a), e !== null)) {
          for (i = t.child = e.child, f = 0; i !== null;)
            ((f = f | i.lanes | i.childLanes), (i = i.sibling));
          i = f & ~o;
        } else ((i = 0), (t.child = null));
        return Ed(e, t, o, a, i);
      }
      if ((a & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && jl(t, o !== null ? o.cachePool : null),
          o !== null ? B0(t, o) : ks(),
          y0(t));
      else return ((i = t.lanes = 536870912), Ed(e, t, o !== null ? o.baseLanes | a : a, a, i));
    } else
      o !== null
        ? (jl(t, o.cachePool), B0(t, o), gn(), (t.memoizedState = null))
        : (e !== null && jl(t, null), ks(), gn());
    return (wt(e, t, f, a), t.child);
  }
  function xr(e, t) {
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
  function Ed(e, t, a, i, f) {
    var o = zs();
    return (
      (o = o === null ? null : { parent: ht._currentValue, pool: o }),
      (t.memoizedState = { baseLanes: a, cachePool: o }),
      e !== null && jl(t, null),
      ks(),
      y0(t),
      e !== null && Fa(e, t, i, !0),
      (t.childLanes = f),
      null
    );
  }
  function Pl(e, t) {
    return (
      (t = Wl({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function Ad(e, t, a) {
    return (
      Pn(t, e.child, null, a),
      (e = Pl(t, t.pendingProps)),
      (e.flags |= 2),
      tu(t),
      (t.memoizedState = null),
      e
    );
  }
  function W1(e, t, a) {
    var i = t.pendingProps,
      f = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (ke) {
        if (i.mode === 'hidden') return ((e = Pl(t, i)), (t.lanes = 536870912), xr(null, e));
        if (
          (Gs(t),
          (e = nt)
            ? ((e = jD(e, du)),
              (e = e !== null && e.data === '&' ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: sn !== null ? { id: yu, overflow: bu } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (a = a0(e)),
                (a.return = t),
                (t.child = a),
                (xt = t),
                (nt = null)))
            : (e = null),
          e === null)
        )
          throw on(t);
        return ((t.lanes = 536870912), null);
      }
      return Pl(t, i);
    }
    var o = e.memoizedState;
    if (o !== null) {
      var v = o.dehydrated;
      if ((Gs(t), f))
        if (t.flags & 256) ((t.flags &= -257), (t = Ad(e, t, a)));
        else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(l(558));
      else if ((mt || Fa(e, t, a, !1), (f = (a & e.childLanes) !== 0), mt || f)) {
        if (((i = tt), i !== null && ((v = cc(i, a)), v !== 0 && v !== o.retryLane)))
          throw ((o.retryLane = v), _n(e, v), Jt(i, e, v), of);
        (li(), (t = Ad(e, t, a)));
      } else
        ((e = o.treeContext),
          (nt = vu(v.nextSibling)),
          (xt = t),
          (ke = !0),
          (fn = null),
          (du = !1),
          e !== null && i0(t, e),
          (t = Pl(t, i)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (e = Nu(e.child, { mode: i.mode, children: i.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function Jl(e, t) {
    var a = t.ref;
    if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != 'function' && typeof a != 'object') throw Error(l(284));
      (e === null || e.ref !== a) && (t.flags |= 4194816);
    }
  }
  function cf(e, t, a, i, f) {
    return (
      Xn(t),
      (a = Vs(e, t, a, i, void 0, f)),
      (i = Xs()),
      e !== null && !mt
        ? (Ks(e, t, f), _u(e, t, f))
        : (ke && i && Fs(t), (t.flags |= 1), wt(e, t, a, f), t.child)
    );
  }
  function Bd(e, t, a, i, f, o) {
    return (
      Xn(t),
      (t.updateQueue = null),
      (a = F0(t, i, a, f)),
      b0(e),
      (i = Xs()),
      e !== null && !mt
        ? (Ks(e, t, o), _u(e, t, o))
        : (ke && i && Fs(t), (t.flags |= 1), wt(e, t, a, o), t.child)
    );
  }
  function yd(e, t, a, i, f) {
    if ((Xn(t), t.stateNode === null)) {
      var o = Aa,
        v = a.contextType;
      (typeof v == 'object' && v !== null && (o = Tt(v)),
        (o = new a(i, o)),
        (t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null),
        (o.updater = sf),
        (t.stateNode = o),
        (o._reactInternals = t),
        (o = t.stateNode),
        (o.props = i),
        (o.state = t.memoizedState),
        (o.refs = {}),
        Ls(t),
        (v = a.contextType),
        (o.context = typeof v == 'object' && v !== null ? Tt(v) : Aa),
        (o.state = t.memoizedState),
        (v = a.getDerivedStateFromProps),
        typeof v == 'function' && (lf(t, a, v, i), (o.state = t.memoizedState)),
        typeof a.getDerivedStateFromProps == 'function' ||
          typeof o.getSnapshotBeforeUpdate == 'function' ||
          (typeof o.UNSAFE_componentWillMount != 'function' &&
            typeof o.componentWillMount != 'function') ||
          ((v = o.state),
          typeof o.componentWillMount == 'function' && o.componentWillMount(),
          typeof o.UNSAFE_componentWillMount == 'function' && o.UNSAFE_componentWillMount(),
          v !== o.state && sf.enqueueReplaceState(o, o.state, null),
          yr(t, i, o, f),
          Br(),
          (o.state = t.memoizedState)),
        typeof o.componentDidMount == 'function' && (t.flags |= 4194308),
        (i = !0));
    } else if (e === null) {
      o = t.stateNode;
      var p = t.memoizedProps,
        b = Wn(a, p);
      o.props = b;
      var H = o.context,
        Q = a.contextType;
      ((v = Aa), typeof Q == 'object' && Q !== null && (v = Tt(Q)));
      var te = a.getDerivedStateFromProps;
      ((Q = typeof te == 'function' || typeof o.getSnapshotBeforeUpdate == 'function'),
        (p = t.pendingProps !== p),
        Q ||
          (typeof o.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof o.componentWillReceiveProps != 'function') ||
          ((p || H !== v) && fd(t, o, i, v)),
        (dn = !1));
      var U = t.memoizedState;
      ((o.state = U),
        yr(t, i, o, f),
        Br(),
        (H = t.memoizedState),
        p || U !== H || dn
          ? (typeof te == 'function' && (lf(t, a, te, i), (H = t.memoizedState)),
            (b = dn || sd(t, a, b, i, U, H, v))
              ? (Q ||
                  (typeof o.UNSAFE_componentWillMount != 'function' &&
                    typeof o.componentWillMount != 'function') ||
                  (typeof o.componentWillMount == 'function' && o.componentWillMount(),
                  typeof o.UNSAFE_componentWillMount == 'function' &&
                    o.UNSAFE_componentWillMount()),
                typeof o.componentDidMount == 'function' && (t.flags |= 4194308))
              : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308),
                (t.memoizedProps = i),
                (t.memoizedState = H)),
            (o.props = i),
            (o.state = H),
            (o.context = v),
            (i = b))
          : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308), (i = !1)));
    } else {
      ((o = t.stateNode),
        Hs(e, t),
        (v = t.memoizedProps),
        (Q = Wn(a, v)),
        (o.props = Q),
        (te = t.pendingProps),
        (U = o.context),
        (H = a.contextType),
        (b = Aa),
        typeof H == 'object' && H !== null && (b = Tt(H)),
        (p = a.getDerivedStateFromProps),
        (H = typeof p == 'function' || typeof o.getSnapshotBeforeUpdate == 'function') ||
          (typeof o.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof o.componentWillReceiveProps != 'function') ||
          ((v !== te || U !== b) && fd(t, o, i, b)),
        (dn = !1),
        (U = t.memoizedState),
        (o.state = U),
        yr(t, i, o, f),
        Br());
      var Y = t.memoizedState;
      v !== te || U !== Y || dn || (e !== null && e.dependencies !== null && Ml(e.dependencies))
        ? (typeof p == 'function' && (lf(t, a, p, i), (Y = t.memoizedState)),
          (Q =
            dn ||
            sd(t, a, Q, i, U, Y, b) ||
            (e !== null && e.dependencies !== null && Ml(e.dependencies)))
            ? (H ||
                (typeof o.UNSAFE_componentWillUpdate != 'function' &&
                  typeof o.componentWillUpdate != 'function') ||
                (typeof o.componentWillUpdate == 'function' && o.componentWillUpdate(i, Y, b),
                typeof o.UNSAFE_componentWillUpdate == 'function' &&
                  o.UNSAFE_componentWillUpdate(i, Y, b)),
              typeof o.componentDidUpdate == 'function' && (t.flags |= 4),
              typeof o.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
            : (typeof o.componentDidUpdate != 'function' ||
                (v === e.memoizedProps && U === e.memoizedState) ||
                (t.flags |= 4),
              typeof o.getSnapshotBeforeUpdate != 'function' ||
                (v === e.memoizedProps && U === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = i),
              (t.memoizedState = Y)),
          (o.props = i),
          (o.state = Y),
          (o.context = b),
          (i = Q))
        : (typeof o.componentDidUpdate != 'function' ||
            (v === e.memoizedProps && U === e.memoizedState) ||
            (t.flags |= 4),
          typeof o.getSnapshotBeforeUpdate != 'function' ||
            (v === e.memoizedProps && U === e.memoizedState) ||
            (t.flags |= 1024),
          (i = !1));
    }
    return (
      (o = i),
      Jl(e, t),
      (i = (t.flags & 128) !== 0),
      o || i
        ? ((o = t.stateNode),
          (a = i && typeof a.getDerivedStateFromError != 'function' ? null : o.render()),
          (t.flags |= 1),
          e !== null && i
            ? ((t.child = Pn(t, e.child, null, f)), (t.child = Pn(t, null, a, f)))
            : wt(e, t, a, f),
          (t.memoizedState = o.state),
          (e = t.child))
        : (e = _u(e, t, f)),
      e
    );
  }
  function bd(e, t, a, i) {
    return (Yn(), (t.flags |= 256), wt(e, t, a, i), t.child);
  }
  var df = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function Df(e) {
    return { baseLanes: e, cachePool: D0() };
  }
  function vf(e, t, a) {
    return ((e = e !== null ? e.childLanes & ~a : 0), t && (e |= nu), e);
  }
  function Fd(e, t, a) {
    var i = t.pendingProps,
      f = !1,
      o = (t.flags & 128) !== 0,
      v;
    if (
      ((v = o) || (v = e !== null && e.memoizedState === null ? !1 : (Dt.current & 2) !== 0),
      v && ((f = !0), (t.flags &= -129)),
      (v = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (ke) {
        if (
          (f ? hn(t) : gn(),
          (e = nt)
            ? ((e = jD(e, du)),
              (e = e !== null && e.data !== '&' ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: sn !== null ? { id: yu, overflow: bu } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (a = a0(e)),
                (a.return = t),
                (t.child = a),
                (xt = t),
                (nt = null)))
            : (e = null),
          e === null)
        )
          throw on(t);
        return (Jf(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var p = i.children;
      return (
        (i = i.fallback),
        f
          ? (gn(),
            (f = t.mode),
            (p = Wl({ mode: 'hidden', children: p }, f)),
            (i = Gn(i, f, a, null)),
            (p.return = t),
            (i.return = t),
            (p.sibling = i),
            (t.child = p),
            (i = t.child),
            (i.memoizedState = Df(a)),
            (i.childLanes = vf(e, v, a)),
            (t.memoizedState = df),
            xr(null, i))
          : (hn(t), hf(t, p))
      );
    }
    var b = e.memoizedState;
    if (b !== null && ((p = b.dehydrated), p !== null)) {
      if (o)
        t.flags & 256
          ? (hn(t), (t.flags &= -257), (t = gf(e, t, a)))
          : t.memoizedState !== null
            ? (gn(), (t.child = e.child), (t.flags |= 128), (t = null))
            : (gn(),
              (p = i.fallback),
              (f = t.mode),
              (i = Wl({ mode: 'visible', children: i.children }, f)),
              (p = Gn(p, f, a, null)),
              (p.flags |= 2),
              (i.return = t),
              (p.return = t),
              (i.sibling = p),
              (t.child = i),
              Pn(t, e.child, null, a),
              (i = t.child),
              (i.memoizedState = Df(a)),
              (i.childLanes = vf(e, v, a)),
              (t.memoizedState = df),
              (t = xr(null, i)));
      else if ((hn(t), Jf(p))) {
        if (((v = p.nextSibling && p.nextSibling.dataset), v)) var H = v.dgst;
        ((v = H),
          (i = Error(l(419))),
          (i.stack = ''),
          (i.digest = v),
          gr({ value: i, source: null, stack: null }),
          (t = gf(e, t, a)));
      } else if ((mt || Fa(e, t, a, !1), (v = (a & e.childLanes) !== 0), mt || v)) {
        if (((v = tt), v !== null && ((i = cc(v, a)), i !== 0 && i !== b.retryLane)))
          throw ((b.retryLane = i), _n(e, i), Jt(v, e, i), of);
        (Pf(p) || li(), (t = gf(e, t, a)));
      } else
        Pf(p)
          ? ((t.flags |= 192), (t.child = e.child), (t = null))
          : ((e = b.treeContext),
            (nt = vu(p.nextSibling)),
            (xt = t),
            (ke = !0),
            (fn = null),
            (du = !1),
            e !== null && i0(t, e),
            (t = hf(t, i.children)),
            (t.flags |= 4096));
      return t;
    }
    return f
      ? (gn(),
        (p = i.fallback),
        (f = t.mode),
        (b = e.child),
        (H = b.sibling),
        (i = Nu(b, { mode: 'hidden', children: i.children })),
        (i.subtreeFlags = b.subtreeFlags & 65011712),
        H !== null ? (p = Nu(H, p)) : ((p = Gn(p, f, a, null)), (p.flags |= 2)),
        (p.return = t),
        (i.return = t),
        (i.sibling = p),
        (t.child = i),
        xr(null, i),
        (i = t.child),
        (p = e.child.memoizedState),
        p === null
          ? (p = Df(a))
          : ((f = p.cachePool),
            f !== null
              ? ((b = ht._currentValue), (f = f.parent !== b ? { parent: b, pool: b } : f))
              : (f = D0()),
            (p = { baseLanes: p.baseLanes | a, cachePool: f })),
        (i.memoizedState = p),
        (i.childLanes = vf(e, v, a)),
        (t.memoizedState = df),
        xr(e.child, i))
      : (hn(t),
        (a = e.child),
        (e = a.sibling),
        (a = Nu(a, { mode: 'visible', children: i.children })),
        (a.return = t),
        (a.sibling = null),
        e !== null &&
          ((v = t.deletions), v === null ? ((t.deletions = [e]), (t.flags |= 16)) : v.push(e)),
        (t.child = a),
        (t.memoizedState = null),
        a);
  }
  function hf(e, t) {
    return ((t = Wl({ mode: 'visible', children: t }, e.mode)), (t.return = e), (e.child = t));
  }
  function Wl(e, t) {
    return ((e = It(22, e, null, t)), (e.lanes = 0), e);
  }
  function gf(e, t, a) {
    return (
      Pn(t, e.child, null, a),
      (e = hf(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function Sd(e, t, a) {
    e.lanes |= t;
    var i = e.alternate;
    (i !== null && (i.lanes |= t), ws(e.return, t, a));
  }
  function mf(e, t, a, i, f, o) {
    var v = e.memoizedState;
    v === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: i,
          tail: a,
          tailMode: f,
          treeForkCount: o,
        })
      : ((v.isBackwards = t),
        (v.rendering = null),
        (v.renderingStartTime = 0),
        (v.last = i),
        (v.tail = a),
        (v.tailMode = f),
        (v.treeForkCount = o));
  }
  function Od(e, t, a) {
    var i = t.pendingProps,
      f = i.revealOrder,
      o = i.tail;
    i = i.children;
    var v = Dt.current,
      p = (v & 2) !== 0;
    if (
      (p ? ((v = (v & 1) | 2), (t.flags |= 128)) : (v &= 1),
      K(Dt, v),
      wt(e, t, i, a),
      (i = ke ? hr : 0),
      !p && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) e.memoizedState !== null && Sd(e, a, t);
        else if (e.tag === 19) Sd(e, a, t);
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
    switch (f) {
      case 'forwards':
        for (a = t.child, f = null; a !== null;)
          ((e = a.alternate), e !== null && ql(e) === null && (f = a), (a = a.sibling));
        ((a = f),
          a === null ? ((f = t.child), (t.child = null)) : ((f = a.sibling), (a.sibling = null)),
          mf(t, !1, f, a, o, i));
        break;
      case 'backwards':
      case 'unstable_legacy-backwards':
        for (a = null, f = t.child, t.child = null; f !== null;) {
          if (((e = f.alternate), e !== null && ql(e) === null)) {
            t.child = f;
            break;
          }
          ((e = f.sibling), (f.sibling = a), (a = f), (f = e));
        }
        mf(t, !0, a, null, o, i);
        break;
      case 'together':
        mf(t, !1, null, null, void 0, i);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function _u(e, t, a) {
    if (
      (e !== null && (t.dependencies = e.dependencies), (pn |= t.lanes), (a & t.childLanes) === 0)
    )
      if (e !== null) {
        if ((Fa(e, t, a, !1), (a & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(l(153));
    if (t.child !== null) {
      for (e = t.child, a = Nu(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null;)
        ((e = e.sibling), (a = a.sibling = Nu(e, e.pendingProps)), (a.return = t));
      a.sibling = null;
    }
    return t.child;
  }
  function Cf(e, t) {
    return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && Ml(e)));
  }
  function $1(e, t, a) {
    switch (t.tag) {
      case 3:
        (Ke(t, t.stateNode.containerInfo), cn(t, ht, e.memoizedState.cache), Yn());
        break;
      case 27:
      case 5:
        w(t);
        break;
      case 4:
        Ke(t, t.stateNode.containerInfo);
        break;
      case 10:
        cn(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), Gs(t), null);
        break;
      case 13:
        var i = t.memoizedState;
        if (i !== null)
          return i.dehydrated !== null
            ? (hn(t), (t.flags |= 128), null)
            : (a & t.child.childLanes) !== 0
              ? Fd(e, t, a)
              : (hn(t), (e = _u(e, t, a)), e !== null ? e.sibling : null);
        hn(t);
        break;
      case 19:
        var f = (e.flags & 128) !== 0;
        if (
          ((i = (a & t.childLanes) !== 0),
          i || (Fa(e, t, a, !1), (i = (a & t.childLanes) !== 0)),
          f)
        ) {
          if (i) return Od(e, t, a);
          t.flags |= 128;
        }
        if (
          ((f = t.memoizedState),
          f !== null && ((f.rendering = null), (f.tail = null), (f.lastEffect = null)),
          K(Dt, Dt.current),
          i)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), pd(e, t, a, t.pendingProps));
      case 24:
        cn(t, ht, e.memoizedState.cache);
    }
    return _u(e, t, a);
  }
  function xd(e, t, a) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) mt = !0;
      else {
        if (!Cf(e, a) && (t.flags & 128) === 0) return ((mt = !1), $1(e, t, a));
        mt = (e.flags & 131072) !== 0;
      }
    else ((mt = !1), ke && (t.flags & 1048576) !== 0 && l0(t, hr, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var i = t.pendingProps;
          if (((e = Qn(t.elementType)), (t.type = e), typeof e == 'function'))
            Bs(e)
              ? ((i = Wn(e, i)), (t.tag = 1), (t = yd(null, t, e, i, a)))
              : ((t.tag = 0), (t = cf(null, t, e, i, a)));
          else {
            if (e != null) {
              var f = e.$$typeof;
              if (f === _) {
                ((t.tag = 11), (t = gd(null, t, e, i, a)));
                break e;
              } else if (f === P) {
                ((t.tag = 14), (t = md(null, t, e, i, a)));
                break e;
              }
            }
            throw ((t = ne(e) || e), Error(l(306, t, '')));
          }
        }
        return t;
      case 0:
        return cf(e, t, t.type, t.pendingProps, a);
      case 1:
        return ((i = t.type), (f = Wn(i, t.pendingProps)), yd(e, t, i, f, a));
      case 3:
        e: {
          if ((Ke(t, t.stateNode.containerInfo), e === null)) throw Error(l(387));
          i = t.pendingProps;
          var o = t.memoizedState;
          ((f = o.element), Hs(e, t), yr(t, i, null, a));
          var v = t.memoizedState;
          if (
            ((i = v.cache),
            cn(t, ht, i),
            i !== o.cache && Ms(t, [ht], a, !0),
            Br(),
            (i = v.element),
            o.isDehydrated)
          )
            if (
              ((o = { element: i, isDehydrated: !1, cache: v.cache }),
              (t.updateQueue.baseState = o),
              (t.memoizedState = o),
              t.flags & 256)
            ) {
              t = bd(e, t, i, a);
              break e;
            } else if (i !== f) {
              ((f = fu(Error(l(424)), t)), gr(f), (t = bd(e, t, i, a)));
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
                  xt = t,
                  ke = !0,
                  fn = null,
                  du = !0,
                  a = p0(t, null, i, a),
                  t.child = a;
                a;
              )
                ((a.flags = (a.flags & -3) | 4096), (a = a.sibling));
            }
          else {
            if ((Yn(), i === f)) {
              t = _u(e, t, a);
              break e;
            }
            wt(e, t, i, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          Jl(e, t),
          e === null
            ? (a = qD(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = a)
              : ke ||
                ((a = t.type),
                (e = t.pendingProps),
                (i = Di(Ae.current).createElement(a)),
                (i[Ot] = t),
                (i[Vt] = e),
                Mt(i, a, e),
                yt(i),
                (t.stateNode = i))
            : (t.memoizedState = qD(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
          null
        );
      case 27:
        return (
          w(t),
          e === null &&
            ke &&
            ((i = t.stateNode = LD(t.type, t.pendingProps, Ae.current)),
            (xt = t),
            (du = !0),
            (f = nt),
            bn(t.type) ? ((Wf = f), (nt = vu(i.firstChild))) : (nt = f)),
          wt(e, t, t.pendingProps.children, a),
          Jl(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            ke &&
            ((f = i = nt) &&
              ((i = xm(i, t.type, t.pendingProps, du)),
              i !== null
                ? ((t.stateNode = i), (xt = t), (nt = vu(i.firstChild)), (du = !1), (f = !0))
                : (f = !1)),
            f || on(t)),
          w(t),
          (f = t.type),
          (o = t.pendingProps),
          (v = e !== null ? e.memoizedProps : null),
          (i = o.children),
          Kf(f, o) ? (i = null) : v !== null && Kf(f, v) && (t.flags |= 32),
          t.memoizedState !== null && ((f = Vs(e, t, Y1, null, null, a)), (Yr._currentValue = f)),
          Jl(e, t),
          wt(e, t, i, a),
          t.child
        );
      case 6:
        return (
          e === null &&
            ke &&
            ((e = a = nt) &&
              ((a = Tm(a, t.pendingProps, du)),
              a !== null ? ((t.stateNode = a), (xt = t), (nt = null), (e = !0)) : (e = !1)),
            e || on(t)),
          null
        );
      case 13:
        return Fd(e, t, a);
      case 4:
        return (
          Ke(t, t.stateNode.containerInfo),
          (i = t.pendingProps),
          e === null ? (t.child = Pn(t, null, i, a)) : wt(e, t, i, a),
          t.child
        );
      case 11:
        return gd(e, t, t.type, t.pendingProps, a);
      case 7:
        return (wt(e, t, t.pendingProps, a), t.child);
      case 8:
        return (wt(e, t, t.pendingProps.children, a), t.child);
      case 12:
        return (wt(e, t, t.pendingProps.children, a), t.child);
      case 10:
        return ((i = t.pendingProps), cn(t, t.type, i.value), wt(e, t, i.children, a), t.child);
      case 9:
        return (
          (f = t.type._context),
          (i = t.pendingProps.children),
          Xn(t),
          (f = Tt(f)),
          (i = i(f)),
          (t.flags |= 1),
          wt(e, t, i, a),
          t.child
        );
      case 14:
        return md(e, t, t.type, t.pendingProps, a);
      case 15:
        return Cd(e, t, t.type, t.pendingProps, a);
      case 19:
        return Od(e, t, a);
      case 31:
        return W1(e, t, a);
      case 22:
        return pd(e, t, a, t.pendingProps);
      case 24:
        return (
          Xn(t),
          (i = Tt(ht)),
          e === null
            ? ((f = zs()),
              f === null &&
                ((f = tt),
                (o = Rs()),
                (f.pooledCache = o),
                o.refCount++,
                o !== null && (f.pooledCacheLanes |= a),
                (f = o)),
              (t.memoizedState = { parent: i, cache: f }),
              Ls(t),
              cn(t, ht, f))
            : ((e.lanes & a) !== 0 && (Hs(e, t), yr(t, null, null, a), Br()),
              (f = e.memoizedState),
              (o = t.memoizedState),
              f.parent !== i
                ? ((f = { parent: i, cache: i }),
                  (t.memoizedState = f),
                  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = f),
                  cn(t, ht, i))
                : ((i = o.cache), cn(t, ht, i), i !== f.cache && Ms(t, [ht], a, !0))),
          wt(e, t, t.pendingProps.children, a),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(l(156, t.tag));
  }
  function Gu(e) {
    e.flags |= 4;
  }
  function pf(e, t, a, i, f) {
    if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
      if (((e.flags |= 16777216), (f & 335544128) === f))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (tD()) e.flags |= 8192;
        else throw ((Zn = Nl), Ns);
    } else e.flags &= -16777217;
  }
  function Td(e, t) {
    if (t.type !== 'stylesheet' || (t.state.loading & 4) !== 0) e.flags &= -16777217;
    else if (((e.flags |= 16777216), !VD(t)))
      if (tD()) e.flags |= 8192;
      else throw ((Zn = Nl), Ns);
  }
  function $l(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 && ((t = e.tag !== 22 ? sc() : 536870912), (e.lanes |= t), (Ha |= t)));
  }
  function Tr(e, t) {
    if (!ke)
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
      for (var f = e.child; f !== null;)
        ((a |= f.lanes | f.childLanes),
          (i |= f.subtreeFlags & 65011712),
          (i |= f.flags & 65011712),
          (f.return = e),
          (f = f.sibling));
    else
      for (f = e.child; f !== null;)
        ((a |= f.lanes | f.childLanes),
          (i |= f.subtreeFlags),
          (i |= f.flags),
          (f.return = e),
          (f = f.sibling));
    return ((e.subtreeFlags |= i), (e.childLanes = a), t);
  }
  function I1(e, t, a) {
    var i = t.pendingProps;
    switch ((Ss(t), t.tag)) {
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
          Uu(ht),
          ze(),
          a.pendingContext && ((a.context = a.pendingContext), (a.pendingContext = null)),
          (e === null || e.child === null) &&
            (ba(t)
              ? Gu(t)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), xs())),
          at(t),
          null
        );
      case 26:
        var f = t.type,
          o = t.memoizedState;
        return (
          e === null
            ? (Gu(t), o !== null ? (at(t), Td(t, o)) : (at(t), pf(t, f, null, i, a)))
            : o
              ? o !== e.memoizedState
                ? (Gu(t), at(t), Td(t, o))
                : (at(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps), e !== i && Gu(t), at(t), pf(t, f, e, i, a)),
          null
        );
      case 27:
        if ((ie(t), (a = Ae.current), (f = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== i && Gu(t);
        else {
          if (!i) {
            if (t.stateNode === null) throw Error(l(166));
            return (at(t), null);
          }
          ((e = W.current), ba(t) ? s0(t) : ((e = LD(f, i, a)), (t.stateNode = e), Gu(t)));
        }
        return (at(t), null);
      case 5:
        if ((ie(t), (f = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== i && Gu(t);
        else {
          if (!i) {
            if (t.stateNode === null) throw Error(l(166));
            return (at(t), null);
          }
          if (((o = W.current), ba(t))) s0(t);
          else {
            var v = Di(Ae.current);
            switch (o) {
              case 1:
                o = v.createElementNS('http://www.w3.org/2000/svg', f);
                break;
              case 2:
                o = v.createElementNS('http://www.w3.org/1998/Math/MathML', f);
                break;
              default:
                switch (f) {
                  case 'svg':
                    o = v.createElementNS('http://www.w3.org/2000/svg', f);
                    break;
                  case 'math':
                    o = v.createElementNS('http://www.w3.org/1998/Math/MathML', f);
                    break;
                  case 'script':
                    ((o = v.createElement('div')),
                      (o.innerHTML = '<script><\/script>'),
                      (o = o.removeChild(o.firstChild)));
                    break;
                  case 'select':
                    ((o =
                      typeof i.is == 'string'
                        ? v.createElement('select', { is: i.is })
                        : v.createElement('select')),
                      i.multiple ? (o.multiple = !0) : i.size && (o.size = i.size));
                    break;
                  default:
                    o =
                      typeof i.is == 'string'
                        ? v.createElement(f, { is: i.is })
                        : v.createElement(f);
                }
            }
            ((o[Ot] = t), (o[Vt] = i));
            e: for (v = t.child; v !== null;) {
              if (v.tag === 5 || v.tag === 6) o.appendChild(v.stateNode);
              else if (v.tag !== 4 && v.tag !== 27 && v.child !== null) {
                ((v.child.return = v), (v = v.child));
                continue;
              }
              if (v === t) break e;
              for (; v.sibling === null;) {
                if (v.return === null || v.return === t) break e;
                v = v.return;
              }
              ((v.sibling.return = v.return), (v = v.sibling));
            }
            t.stateNode = o;
            e: switch ((Mt(o, f, i), f)) {
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
            i && Gu(t);
          }
        }
        return (at(t), pf(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a), null);
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== i && Gu(t);
        else {
          if (typeof i != 'string' && t.stateNode === null) throw Error(l(166));
          if (((e = Ae.current), ba(t))) {
            if (((e = t.stateNode), (a = t.memoizedProps), (i = null), (f = xt), f !== null))
              switch (f.tag) {
                case 27:
                case 5:
                  i = f.memoizedProps;
              }
            ((e[Ot] = t),
              (e = !!(
                e.nodeValue === a ||
                (i !== null && i.suppressHydrationWarning === !0) ||
                FD(e.nodeValue, a)
              )),
              e || on(t, !0));
          } else ((e = Di(e).createTextNode(i)), (e[Ot] = t), (t.stateNode = e));
        }
        return (at(t), null);
      case 31:
        if (((a = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((i = ba(t)), a !== null)) {
            if (e === null) {
              if (!i) throw Error(l(318));
              if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
                throw Error(l(557));
              e[Ot] = t;
            } else (Yn(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (at(t), (e = !1));
          } else
            ((a = xs()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a),
              (e = !0));
          if (!e) return t.flags & 256 ? (tu(t), t) : (tu(t), null);
          if ((t.flags & 128) !== 0) throw Error(l(558));
        }
        return (at(t), null);
      case 13:
        if (
          ((i = t.memoizedState),
          e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((f = ba(t)), i !== null && i.dehydrated !== null)) {
            if (e === null) {
              if (!f) throw Error(l(318));
              if (((f = t.memoizedState), (f = f !== null ? f.dehydrated : null), !f))
                throw Error(l(317));
              f[Ot] = t;
            } else (Yn(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (at(t), (f = !1));
          } else
            ((f = xs()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = f),
              (f = !0));
          if (!f) return t.flags & 256 ? (tu(t), t) : (tu(t), null);
        }
        return (
          tu(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = a), t)
            : ((a = i !== null),
              (e = e !== null && e.memoizedState !== null),
              a &&
                ((i = t.child),
                (f = null),
                i.alternate !== null &&
                  i.alternate.memoizedState !== null &&
                  i.alternate.memoizedState.cachePool !== null &&
                  (f = i.alternate.memoizedState.cachePool.pool),
                (o = null),
                i.memoizedState !== null &&
                  i.memoizedState.cachePool !== null &&
                  (o = i.memoizedState.cachePool.pool),
                o !== f && (i.flags |= 2048)),
              a !== e && a && (t.child.flags |= 8192),
              $l(t, t.updateQueue),
              at(t),
              null)
        );
      case 4:
        return (ze(), e === null && _f(t.stateNode.containerInfo), at(t), null);
      case 10:
        return (Uu(t.type), at(t), null);
      case 19:
        if ((q(Dt), (i = t.memoizedState), i === null)) return (at(t), null);
        if (((f = (t.flags & 128) !== 0), (o = i.rendering), o === null))
          if (f) Tr(i, !1);
          else {
            if (dt !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null;) {
                if (((o = ql(e)), o !== null)) {
                  for (
                    t.flags |= 128,
                      Tr(i, !1),
                      e = o.updateQueue,
                      t.updateQueue = e,
                      $l(t, e),
                      t.subtreeFlags = 0,
                      e = a,
                      a = t.child;
                    a !== null;
                  )
                    (n0(a, e), (a = a.sibling));
                  return (K(Dt, (Dt.current & 1) | 2), ke && Lu(t, i.treeForkCount), t.child);
                }
                e = e.sibling;
              }
            i.tail !== null &&
              ot() > ni &&
              ((t.flags |= 128), (f = !0), Tr(i, !1), (t.lanes = 4194304));
          }
        else {
          if (!f)
            if (((e = ql(o)), e !== null)) {
              if (
                ((t.flags |= 128),
                (f = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                $l(t, e),
                Tr(i, !0),
                i.tail === null && i.tailMode === 'hidden' && !o.alternate && !ke)
              )
                return (at(t), null);
            } else
              2 * ot() - i.renderingStartTime > ni &&
                a !== 536870912 &&
                ((t.flags |= 128), (f = !0), Tr(i, !1), (t.lanes = 4194304));
          i.isBackwards
            ? ((o.sibling = t.child), (t.child = o))
            : ((e = i.last), e !== null ? (e.sibling = o) : (t.child = o), (i.last = o));
        }
        return i.tail !== null
          ? ((e = i.tail),
            (i.rendering = e),
            (i.tail = e.sibling),
            (i.renderingStartTime = ot()),
            (e.sibling = null),
            (a = Dt.current),
            K(Dt, f ? (a & 1) | 2 : a & 1),
            ke && Lu(t, i.treeForkCount),
            e)
          : (at(t), null);
      case 22:
      case 23:
        return (
          tu(t),
          _s(),
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
          a !== null && $l(t, a.retryQueue),
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
          e !== null && q(Kn),
          null
        );
      case 24:
        return (
          (a = null),
          e !== null && (a = e.memoizedState.cache),
          t.memoizedState.cache !== a && (t.flags |= 2048),
          Uu(ht),
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
  function em(e, t) {
    switch ((Ss(t), t.tag)) {
      case 1:
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 3:
        return (
          Uu(ht),
          ze(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 26:
      case 27:
      case 5:
        return (ie(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((tu(t), t.alternate === null)) throw Error(l(340));
          Yn();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 13:
        if ((tu(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(l(340));
          Yn();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (q(Dt), null);
      case 4:
        return (ze(), null);
      case 10:
        return (Uu(t.type), null);
      case 22:
      case 23:
        return (
          tu(t),
          _s(),
          e !== null && q(Kn),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (Uu(ht), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function wd(e, t) {
    switch ((Ss(t), t.tag)) {
      case 3:
        (Uu(ht), ze());
        break;
      case 26:
      case 27:
      case 5:
        ie(t);
        break;
      case 4:
        ze();
        break;
      case 31:
        t.memoizedState !== null && tu(t);
        break;
      case 13:
        tu(t);
        break;
      case 19:
        q(Dt);
        break;
      case 10:
        Uu(t.type);
        break;
      case 22:
      case 23:
        (tu(t), _s(), e !== null && q(Kn));
        break;
      case 24:
        Uu(ht);
    }
  }
  function wr(e, t) {
    try {
      var a = t.updateQueue,
        i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var f = i.next;
        a = f;
        do {
          if ((a.tag & e) === e) {
            i = void 0;
            var o = a.create,
              v = a.inst;
            ((i = o()), (v.destroy = i));
          }
          a = a.next;
        } while (a !== f);
      }
    } catch (p) {
      Pe(t, t.return, p);
    }
  }
  function mn(e, t, a) {
    try {
      var i = t.updateQueue,
        f = i !== null ? i.lastEffect : null;
      if (f !== null) {
        var o = f.next;
        i = o;
        do {
          if ((i.tag & e) === e) {
            var v = i.inst,
              p = v.destroy;
            if (p !== void 0) {
              ((v.destroy = void 0), (f = t));
              var b = a,
                H = p;
              try {
                H();
              } catch (Q) {
                Pe(f, b, Q);
              }
            }
          }
          i = i.next;
        } while (i !== o);
      }
    } catch (Q) {
      Pe(t, t.return, Q);
    }
  }
  function Md(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var a = e.stateNode;
      try {
        A0(t, a);
      } catch (i) {
        Pe(e, e.return, i);
      }
    }
  }
  function Rd(e, t, a) {
    ((a.props = Wn(e.type, e.memoizedProps)), (a.state = e.memoizedState));
    try {
      a.componentWillUnmount();
    } catch (i) {
      Pe(e, t, i);
    }
  }
  function Mr(e, t) {
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
    } catch (f) {
      Pe(e, t, f);
    }
  }
  function Fu(e, t) {
    var a = e.ref,
      i = e.refCleanup;
    if (a !== null)
      if (typeof i == 'function')
        try {
          i();
        } catch (f) {
          Pe(e, t, f);
        } finally {
          ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
        }
      else if (typeof a == 'function')
        try {
          a(null);
        } catch (f) {
          Pe(e, t, f);
        }
      else a.current = null;
  }
  function jd(e) {
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
    } catch (f) {
      Pe(e, e.return, f);
    }
  }
  function Ef(e, t, a) {
    try {
      var i = e.stateNode;
      (Bm(i, e.type, a, t), (i[Vt] = t));
    } catch (f) {
      Pe(e, e.return, f);
    }
  }
  function zd(e) {
    return (
      e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && bn(e.type)) || e.tag === 4
    );
  }
  function Af(e) {
    e: for (;;) {
      for (; e.sibling === null;) {
        if (e.return === null || zd(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if ((e.tag === 27 && bn(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
          continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Bf(e, t, a) {
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
            a != null || t.onclick !== null || (t.onclick = ju)));
    else if (
      i !== 4 &&
      (i === 27 && bn(e.type) && ((a = e.stateNode), (t = null)), (e = e.child), e !== null)
    )
      for (Bf(e, t, a), e = e.sibling; e !== null;) (Bf(e, t, a), (e = e.sibling));
  }
  function Il(e, t, a) {
    var i = e.tag;
    if (i === 5 || i === 6) ((e = e.stateNode), t ? a.insertBefore(e, t) : a.appendChild(e));
    else if (i !== 4 && (i === 27 && bn(e.type) && (a = e.stateNode), (e = e.child), e !== null))
      for (Il(e, t, a), e = e.sibling; e !== null;) (Il(e, t, a), (e = e.sibling));
  }
  function Nd(e) {
    var t = e.stateNode,
      a = e.memoizedProps;
    try {
      for (var i = e.type, f = t.attributes; f.length;) t.removeAttributeNode(f[0]);
      (Mt(t, i, a), (t[Ot] = e), (t[Vt] = a));
    } catch (o) {
      Pe(e, e.return, o);
    }
  }
  var Yu = !1,
    Ct = !1,
    yf = !1,
    Ld = typeof WeakSet == 'function' ? WeakSet : Set,
    bt = null;
  function tm(e, t) {
    if (((e = e.containerInfo), (Vf = Ei), (e = Zc(e)), hs(e))) {
      if ('selectionStart' in e) var a = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          a = ((a = e.ownerDocument) && a.defaultView) || window;
          var i = a.getSelection && a.getSelection();
          if (i && i.rangeCount !== 0) {
            a = i.anchorNode;
            var f = i.anchorOffset,
              o = i.focusNode;
            i = i.focusOffset;
            try {
              (a.nodeType, o.nodeType);
            } catch {
              a = null;
              break e;
            }
            var v = 0,
              p = -1,
              b = -1,
              H = 0,
              Q = 0,
              te = e,
              U = null;
            t: for (;;) {
              for (
                var Y;
                te !== a || (f !== 0 && te.nodeType !== 3) || (p = v + f),
                  te !== o || (i !== 0 && te.nodeType !== 3) || (b = v + i),
                  te.nodeType === 3 && (v += te.nodeValue.length),
                  (Y = te.firstChild) !== null;
              )
                ((U = te), (te = Y));
              for (;;) {
                if (te === e) break t;
                if (
                  (U === a && ++H === f && (p = v),
                  U === o && ++Q === i && (b = v),
                  (Y = te.nextSibling) !== null)
                )
                  break;
                ((te = U), (U = te.parentNode));
              }
              te = Y;
            }
            a = p === -1 || b === -1 ? null : { start: p, end: b };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Xf = { focusedElem: e, selectionRange: a }, Ei = !1, bt = t; bt !== null;)
      if (((t = bt), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (bt = e));
      else
        for (; bt !== null;) {
          switch (((t = bt), (o = t.alternate), (e = t.flags), t.tag)) {
            case 0:
              if (
                (e & 4) !== 0 &&
                ((e = t.updateQueue), (e = e !== null ? e.events : null), e !== null)
              )
                for (a = 0; a < e.length; a++) ((f = e[a]), (f.ref.impl = f.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && o !== null) {
                ((e = void 0),
                  (a = t),
                  (f = o.memoizedProps),
                  (o = o.memoizedState),
                  (i = a.stateNode));
                try {
                  var me = Wn(a.type, f);
                  ((e = i.getSnapshotBeforeUpdate(me, o)),
                    (i.__reactInternalSnapshotBeforeUpdate = e));
                } catch (Se) {
                  Pe(a, a.return, Se);
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (((e = t.stateNode.containerInfo), (a = e.nodeType), a === 9)) Zf(e);
                else if (a === 1)
                  switch (e.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      Zf(e);
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
            ((e.return = t.return), (bt = e));
            break;
          }
          bt = t.return;
        }
  }
  function Hd(e, t, a) {
    var i = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        (Xu(e, a), i & 4 && wr(5, a));
        break;
      case 1:
        if ((Xu(e, a), i & 4))
          if (((e = a.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (v) {
              Pe(a, a.return, v);
            }
          else {
            var f = Wn(a.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(f, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (v) {
              Pe(a, a.return, v);
            }
          }
        (i & 64 && Md(a), i & 512 && Mr(a, a.return));
        break;
      case 3:
        if ((Xu(e, a), i & 64 && ((e = a.updateQueue), e !== null))) {
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
            A0(e, t);
          } catch (v) {
            Pe(a, a.return, v);
          }
        }
        break;
      case 27:
        t === null && i & 4 && Nd(a);
      case 26:
      case 5:
        (Xu(e, a), t === null && i & 4 && jd(a), i & 512 && Mr(a, a.return));
        break;
      case 12:
        Xu(e, a);
        break;
      case 31:
        (Xu(e, a), i & 4 && kd(e, a));
        break;
      case 13:
        (Xu(e, a),
          i & 4 && _d(e, a),
          i & 64 &&
            ((e = a.memoizedState),
            e !== null && ((e = e.dehydrated), e !== null && ((a = om.bind(null, a)), wm(e, a)))));
        break;
      case 22:
        if (((i = a.memoizedState !== null || Yu), !i)) {
          ((t = (t !== null && t.memoizedState !== null) || Ct), (f = Yu));
          var o = Ct;
          ((Yu = i),
            (Ct = t) && !o ? Ku(e, a, (a.subtreeFlags & 8772) !== 0) : Xu(e, a),
            (Yu = f),
            (Ct = o));
        }
        break;
      case 30:
        break;
      default:
        Xu(e, a);
    }
  }
  function Ud(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), Ud(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && $i(t)),
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
    Kt = !1;
  function Vu(e, t, a) {
    for (a = a.child; a !== null;) (qd(e, t, a), (a = a.sibling));
  }
  function qd(e, t, a) {
    if (St && typeof St.onCommitFiberUnmount == 'function')
      try {
        St.onCommitFiberUnmount(an, a);
      } catch {}
    switch (a.tag) {
      case 26:
        (Ct || Fu(a, t),
          Vu(e, t, a),
          a.memoizedState
            ? a.memoizedState.count--
            : a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a)));
        break;
      case 27:
        Ct || Fu(a, t);
        var i = lt,
          f = Kt;
        (bn(a.type) && ((lt = a.stateNode), (Kt = !1)),
          Vu(e, t, a),
          kr(a.stateNode),
          (lt = i),
          (Kt = f));
        break;
      case 5:
        Ct || Fu(a, t);
      case 6:
        if (((i = lt), (f = Kt), (lt = null), Vu(e, t, a), (lt = i), (Kt = f), lt !== null))
          if (Kt)
            try {
              (lt.nodeType === 9
                ? lt.body
                : lt.nodeName === 'HTML'
                  ? lt.ownerDocument.body
                  : lt
              ).removeChild(a.stateNode);
            } catch (o) {
              Pe(a, t, o);
            }
          else
            try {
              lt.removeChild(a.stateNode);
            } catch (o) {
              Pe(a, t, o);
            }
        break;
      case 18:
        lt !== null &&
          (Kt
            ? ((e = lt),
              MD(
                e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e,
                a.stateNode,
              ),
              Xa(e))
            : MD(lt, a.stateNode));
        break;
      case 4:
        ((i = lt),
          (f = Kt),
          (lt = a.stateNode.containerInfo),
          (Kt = !0),
          Vu(e, t, a),
          (lt = i),
          (Kt = f));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (mn(2, a, t), Ct || mn(4, a, t), Vu(e, t, a));
        break;
      case 1:
        (Ct ||
          (Fu(a, t), (i = a.stateNode), typeof i.componentWillUnmount == 'function' && Rd(a, t, i)),
          Vu(e, t, a));
        break;
      case 21:
        Vu(e, t, a);
        break;
      case 22:
        ((Ct = (i = Ct) || a.memoizedState !== null), Vu(e, t, a), (Ct = i));
        break;
      default:
        Vu(e, t, a);
    }
  }
  function kd(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
    ) {
      e = e.dehydrated;
      try {
        Xa(e);
      } catch (a) {
        Pe(t, t.return, a);
      }
    }
  }
  function _d(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate),
      e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        Xa(e);
      } catch (a) {
        Pe(t, t.return, a);
      }
  }
  function um(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new Ld()), t);
      case 22:
        return (
          (e = e.stateNode),
          (t = e._retryCache),
          t === null && (t = e._retryCache = new Ld()),
          t
        );
      default:
        throw Error(l(435, e.tag));
    }
  }
  function ei(e, t) {
    var a = um(e);
    t.forEach(function (i) {
      if (!a.has(i)) {
        a.add(i);
        var f = cm.bind(null, e, i);
        i.then(f, f);
      }
    });
  }
  function Qt(e, t) {
    var a = t.deletions;
    if (a !== null)
      for (var i = 0; i < a.length; i++) {
        var f = a[i],
          o = e,
          v = t,
          p = v;
        e: for (; p !== null;) {
          switch (p.tag) {
            case 27:
              if (bn(p.type)) {
                ((lt = p.stateNode), (Kt = !1));
                break e;
              }
              break;
            case 5:
              ((lt = p.stateNode), (Kt = !1));
              break e;
            case 3:
            case 4:
              ((lt = p.stateNode.containerInfo), (Kt = !0));
              break e;
          }
          p = p.return;
        }
        if (lt === null) throw Error(l(160));
        (qd(o, v, f),
          (lt = null),
          (Kt = !1),
          (o = f.alternate),
          o !== null && (o.return = null),
          (f.return = null));
      }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) (Gd(t, e), (t = t.sibling));
  }
  var pu = null;
  function Gd(e, t) {
    var a = e.alternate,
      i = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (Qt(t, e), Zt(e), i & 4 && (mn(3, e, e.return), wr(3, e), mn(5, e, e.return)));
        break;
      case 1:
        (Qt(t, e),
          Zt(e),
          i & 512 && (Ct || a === null || Fu(a, a.return)),
          i & 64 &&
            Yu &&
            ((e = e.updateQueue),
            e !== null &&
              ((i = e.callbacks),
              i !== null &&
                ((a = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = a === null ? i : a.concat(i))))));
        break;
      case 26:
        var f = pu;
        if ((Qt(t, e), Zt(e), i & 512 && (Ct || a === null || Fu(a, a.return)), i & 4)) {
          var o = a !== null ? a.memoizedState : null;
          if (((i = e.memoizedState), a === null))
            if (i === null)
              if (e.stateNode === null) {
                e: {
                  ((i = e.type), (a = e.memoizedProps), (f = f.ownerDocument || f));
                  t: switch (i) {
                    case 'title':
                      ((o = f.getElementsByTagName('title')[0]),
                        (!o ||
                          o[ar] ||
                          o[Ot] ||
                          o.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          o.hasAttribute('itemprop')) &&
                          ((o = f.createElement(i)),
                          f.head.insertBefore(o, f.querySelector('head > title'))),
                        Mt(o, i, a),
                        (o[Ot] = e),
                        yt(o),
                        (i = o));
                      break e;
                    case 'link':
                      var v = GD('link', 'href', f).get(i + (a.href || ''));
                      if (v) {
                        for (var p = 0; p < v.length; p++)
                          if (
                            ((o = v[p]),
                            o.getAttribute('href') ===
                              (a.href == null || a.href === '' ? null : a.href) &&
                              o.getAttribute('rel') === (a.rel == null ? null : a.rel) &&
                              o.getAttribute('title') === (a.title == null ? null : a.title) &&
                              o.getAttribute('crossorigin') ===
                                (a.crossOrigin == null ? null : a.crossOrigin))
                          ) {
                            v.splice(p, 1);
                            break t;
                          }
                      }
                      ((o = f.createElement(i)), Mt(o, i, a), f.head.appendChild(o));
                      break;
                    case 'meta':
                      if ((v = GD('meta', 'content', f).get(i + (a.content || '')))) {
                        for (p = 0; p < v.length; p++)
                          if (
                            ((o = v[p]),
                            o.getAttribute('content') ===
                              (a.content == null ? null : '' + a.content) &&
                              o.getAttribute('name') === (a.name == null ? null : a.name) &&
                              o.getAttribute('property') ===
                                (a.property == null ? null : a.property) &&
                              o.getAttribute('http-equiv') ===
                                (a.httpEquiv == null ? null : a.httpEquiv) &&
                              o.getAttribute('charset') === (a.charSet == null ? null : a.charSet))
                          ) {
                            v.splice(p, 1);
                            break t;
                          }
                      }
                      ((o = f.createElement(i)), Mt(o, i, a), f.head.appendChild(o));
                      break;
                    default:
                      throw Error(l(468, i));
                  }
                  ((o[Ot] = e), yt(o), (i = o));
                }
                e.stateNode = i;
              } else YD(f, e.type, e.stateNode);
            else e.stateNode = _D(f, i, e.memoizedProps);
          else
            o !== i
              ? (o === null
                  ? a.stateNode !== null && ((a = a.stateNode), a.parentNode.removeChild(a))
                  : o.count--,
                i === null ? YD(f, e.type, e.stateNode) : _D(f, i, e.memoizedProps))
              : i === null && e.stateNode !== null && Ef(e, e.memoizedProps, a.memoizedProps);
        }
        break;
      case 27:
        (Qt(t, e),
          Zt(e),
          i & 512 && (Ct || a === null || Fu(a, a.return)),
          a !== null && i & 4 && Ef(e, e.memoizedProps, a.memoizedProps));
        break;
      case 5:
        if ((Qt(t, e), Zt(e), i & 512 && (Ct || a === null || Fu(a, a.return)), e.flags & 32)) {
          f = e.stateNode;
          try {
            va(f, '');
          } catch (me) {
            Pe(e, e.return, me);
          }
        }
        (i & 4 &&
          e.stateNode != null &&
          ((f = e.memoizedProps), Ef(e, f, a !== null ? a.memoizedProps : f)),
          i & 1024 && (yf = !0));
        break;
      case 6:
        if ((Qt(t, e), Zt(e), i & 4)) {
          if (e.stateNode === null) throw Error(l(162));
          ((i = e.memoizedProps), (a = e.stateNode));
          try {
            a.nodeValue = i;
          } catch (me) {
            Pe(e, e.return, me);
          }
        }
        break;
      case 3:
        if (
          ((gi = null),
          (f = pu),
          (pu = vi(t.containerInfo)),
          Qt(t, e),
          (pu = f),
          Zt(e),
          i & 4 && a !== null && a.memoizedState.isDehydrated)
        )
          try {
            Xa(t.containerInfo);
          } catch (me) {
            Pe(e, e.return, me);
          }
        yf && ((yf = !1), Yd(e));
        break;
      case 4:
        ((i = pu), (pu = vi(e.stateNode.containerInfo)), Qt(t, e), Zt(e), (pu = i));
        break;
      case 12:
        (Qt(t, e), Zt(e));
        break;
      case 31:
        (Qt(t, e),
          Zt(e),
          i & 4 && ((i = e.updateQueue), i !== null && ((e.updateQueue = null), ei(e, i))));
        break;
      case 13:
        (Qt(t, e),
          Zt(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) != (a !== null && a.memoizedState !== null) &&
            (ui = ot()),
          i & 4 && ((i = e.updateQueue), i !== null && ((e.updateQueue = null), ei(e, i))));
        break;
      case 22:
        f = e.memoizedState !== null;
        var b = a !== null && a.memoizedState !== null,
          H = Yu,
          Q = Ct;
        if (((Yu = H || f), (Ct = Q || b), Qt(t, e), (Ct = Q), (Yu = H), Zt(e), i & 8192))
          e: for (
            t = e.stateNode,
              t._visibility = f ? t._visibility & -2 : t._visibility | 1,
              f && (a === null || b || Yu || Ct || $n(e)),
              a = null,
              t = e;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                b = a = t;
                try {
                  if (((o = b.stateNode), f))
                    ((v = o.style),
                      typeof v.setProperty == 'function'
                        ? v.setProperty('display', 'none', 'important')
                        : (v.display = 'none'));
                  else {
                    p = b.stateNode;
                    var te = b.memoizedProps.style,
                      U = te != null && te.hasOwnProperty('display') ? te.display : null;
                    p.style.display = U == null || typeof U == 'boolean' ? '' : ('' + U).trim();
                  }
                } catch (me) {
                  Pe(b, b.return, me);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                b = t;
                try {
                  b.stateNode.nodeValue = f ? '' : b.memoizedProps;
                } catch (me) {
                  Pe(b, b.return, me);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                b = t;
                try {
                  var Y = b.stateNode;
                  f ? RD(Y, !0) : RD(b.stateNode, !1);
                } catch (me) {
                  Pe(b, b.return, me);
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
          i !== null && ((a = i.retryQueue), a !== null && ((i.retryQueue = null), ei(e, a))));
        break;
      case 19:
        (Qt(t, e),
          Zt(e),
          i & 4 && ((i = e.updateQueue), i !== null && ((e.updateQueue = null), ei(e, i))));
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
          if (zd(i)) {
            a = i;
            break;
          }
          i = i.return;
        }
        if (a == null) throw Error(l(160));
        switch (a.tag) {
          case 27:
            var f = a.stateNode,
              o = Af(e);
            Il(e, o, f);
            break;
          case 5:
            var v = a.stateNode;
            a.flags & 32 && (va(v, ''), (a.flags &= -33));
            var p = Af(e);
            Il(e, p, v);
            break;
          case 3:
          case 4:
            var b = a.stateNode.containerInfo,
              H = Af(e);
            Bf(e, H, b);
            break;
          default:
            throw Error(l(161));
        }
      } catch (Q) {
        Pe(e, e.return, Q);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Yd(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null;) {
        var t = e;
        (Yd(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling));
      }
  }
  function Xu(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null;) (Hd(e, t.alternate, t), (t = t.sibling));
  }
  function $n(e) {
    for (e = e.child; e !== null;) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (mn(4, t, t.return), $n(t));
          break;
        case 1:
          Fu(t, t.return);
          var a = t.stateNode;
          (typeof a.componentWillUnmount == 'function' && Rd(t, t.return, a), $n(t));
          break;
        case 27:
          kr(t.stateNode);
        case 26:
        case 5:
          (Fu(t, t.return), $n(t));
          break;
        case 22:
          t.memoizedState === null && $n(t);
          break;
        case 30:
          $n(t);
          break;
        default:
          $n(t);
      }
      e = e.sibling;
    }
  }
  function Ku(e, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null;) {
      var i = t.alternate,
        f = e,
        o = t,
        v = o.flags;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          (Ku(f, o, a), wr(4, o));
          break;
        case 1:
          if ((Ku(f, o, a), (i = o), (f = i.stateNode), typeof f.componentDidMount == 'function'))
            try {
              f.componentDidMount();
            } catch (H) {
              Pe(i, i.return, H);
            }
          if (((i = o), (f = i.updateQueue), f !== null)) {
            var p = i.stateNode;
            try {
              var b = f.shared.hiddenCallbacks;
              if (b !== null)
                for (f.shared.hiddenCallbacks = null, f = 0; f < b.length; f++) E0(b[f], p);
            } catch (H) {
              Pe(i, i.return, H);
            }
          }
          (a && v & 64 && Md(o), Mr(o, o.return));
          break;
        case 27:
          Nd(o);
        case 26:
        case 5:
          (Ku(f, o, a), a && i === null && v & 4 && jd(o), Mr(o, o.return));
          break;
        case 12:
          Ku(f, o, a);
          break;
        case 31:
          (Ku(f, o, a), a && v & 4 && kd(f, o));
          break;
        case 13:
          (Ku(f, o, a), a && v & 4 && _d(f, o));
          break;
        case 22:
          (o.memoizedState === null && Ku(f, o, a), Mr(o, o.return));
          break;
        case 30:
          break;
        default:
          Ku(f, o, a);
      }
      t = t.sibling;
    }
  }
  function bf(e, t) {
    var a = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (a = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (e = t.memoizedState.cachePool.pool),
      e !== a && (e != null && e.refCount++, a != null && mr(a)));
  }
  function Ff(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && mr(e)));
  }
  function Eu(e, t, a, i) {
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) (Vd(e, t, a, i), (t = t.sibling));
  }
  function Vd(e, t, a, i) {
    var f = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Eu(e, t, a, i), f & 2048 && wr(9, t));
        break;
      case 1:
        Eu(e, t, a, i);
        break;
      case 3:
        (Eu(e, t, a, i),
          f & 2048 &&
            ((e = null),
            t.alternate !== null && (e = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== e && (t.refCount++, e != null && mr(e))));
        break;
      case 12:
        if (f & 2048) {
          (Eu(e, t, a, i), (e = t.stateNode));
          try {
            var o = t.memoizedProps,
              v = o.id,
              p = o.onPostCommit;
            typeof p == 'function' &&
              p(v, t.alternate === null ? 'mount' : 'update', e.passiveEffectDuration, -0);
          } catch (b) {
            Pe(t, t.return, b);
          }
        } else Eu(e, t, a, i);
        break;
      case 31:
        Eu(e, t, a, i);
        break;
      case 13:
        Eu(e, t, a, i);
        break;
      case 23:
        break;
      case 22:
        ((o = t.stateNode),
          (v = t.alternate),
          t.memoizedState !== null
            ? o._visibility & 2
              ? Eu(e, t, a, i)
              : Rr(e, t)
            : o._visibility & 2
              ? Eu(e, t, a, i)
              : ((o._visibility |= 2), za(e, t, a, i, (t.subtreeFlags & 10256) !== 0 || !1)),
          f & 2048 && bf(v, t));
        break;
      case 24:
        (Eu(e, t, a, i), f & 2048 && Ff(t.alternate, t));
        break;
      default:
        Eu(e, t, a, i);
    }
  }
  function za(e, t, a, i, f) {
    for (f = f && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null;) {
      var o = e,
        v = t,
        p = a,
        b = i,
        H = v.flags;
      switch (v.tag) {
        case 0:
        case 11:
        case 15:
          (za(o, v, p, b, f), wr(8, v));
          break;
        case 23:
          break;
        case 22:
          var Q = v.stateNode;
          (v.memoizedState !== null
            ? Q._visibility & 2
              ? za(o, v, p, b, f)
              : Rr(o, v)
            : ((Q._visibility |= 2), za(o, v, p, b, f)),
            f && H & 2048 && bf(v.alternate, v));
          break;
        case 24:
          (za(o, v, p, b, f), f && H & 2048 && Ff(v.alternate, v));
          break;
        default:
          za(o, v, p, b, f);
      }
      t = t.sibling;
    }
  }
  function Rr(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null;) {
        var a = e,
          i = t,
          f = i.flags;
        switch (i.tag) {
          case 22:
            (Rr(a, i), f & 2048 && bf(i.alternate, i));
            break;
          case 24:
            (Rr(a, i), f & 2048 && Ff(i.alternate, i));
            break;
          default:
            Rr(a, i);
        }
        t = t.sibling;
      }
  }
  var jr = 8192;
  function Na(e, t, a) {
    if (e.subtreeFlags & jr) for (e = e.child; e !== null;) (Xd(e, t, a), (e = e.sibling));
  }
  function Xd(e, t, a) {
    switch (e.tag) {
      case 26:
        (Na(e, t, a),
          e.flags & jr && e.memoizedState !== null && Gm(a, pu, e.memoizedState, e.memoizedProps));
        break;
      case 5:
        Na(e, t, a);
        break;
      case 3:
      case 4:
        var i = pu;
        ((pu = vi(e.stateNode.containerInfo)), Na(e, t, a), (pu = i));
        break;
      case 22:
        e.memoizedState === null &&
          ((i = e.alternate),
          i !== null && i.memoizedState !== null
            ? ((i = jr), (jr = 16777216), Na(e, t, a), (jr = i))
            : Na(e, t, a));
        break;
      default:
        Na(e, t, a);
    }
  }
  function Kd(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function zr(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var i = t[a];
          ((bt = i), Zd(i, e));
        }
      Kd(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (Qd(e), (e = e.sibling));
  }
  function Qd(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (zr(e), e.flags & 2048 && mn(9, e, e.return));
        break;
      case 3:
        zr(e);
        break;
      case 12:
        zr(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), ti(e))
          : zr(e);
        break;
      default:
        zr(e);
    }
  }
  function ti(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var i = t[a];
          ((bt = i), Zd(i, e));
        }
      Kd(e);
    }
    for (e = e.child; e !== null;) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          (mn(8, t, t.return), ti(t));
          break;
        case 22:
          ((a = t.stateNode), a._visibility & 2 && ((a._visibility &= -3), ti(t)));
          break;
        default:
          ti(t);
      }
      e = e.sibling;
    }
  }
  function Zd(e, t) {
    for (; bt !== null;) {
      var a = bt;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          mn(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var i = a.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          mr(a.memoizedState.cache);
      }
      if (((i = a.child), i !== null)) ((i.return = a), (bt = i));
      else
        e: for (a = e; bt !== null;) {
          i = bt;
          var f = i.sibling,
            o = i.return;
          if ((Ud(i), i === a)) {
            bt = null;
            break e;
          }
          if (f !== null) {
            ((f.return = o), (bt = f));
            break e;
          }
          bt = o;
        }
    }
  }
  var nm = {
      getCacheForType: function (e) {
        var t = Tt(ht),
          a = t.data.get(e);
        return (a === void 0 && ((a = e()), t.data.set(e, a)), a);
      },
      cacheSignal: function () {
        return Tt(ht).controller.signal;
      },
    },
    am = typeof WeakMap == 'function' ? WeakMap : Map,
    Xe = 0,
    tt = null,
    Le = null,
    Ue = 0,
    Ze = 0,
    uu = null,
    Cn = !1,
    La = !1,
    Sf = !1,
    Qu = 0,
    dt = 0,
    pn = 0,
    In = 0,
    Of = 0,
    nu = 0,
    Ha = 0,
    Nr = null,
    Pt = null,
    xf = !1,
    ui = 0,
    Pd = 0,
    ni = 1 / 0,
    ai = null,
    En = null,
    At = 0,
    An = null,
    Ua = null,
    Zu = 0,
    Tf = 0,
    wf = null,
    Jd = null,
    Lr = 0,
    Mf = null;
  function au() {
    return (Xe & 2) !== 0 && Ue !== 0 ? Ue & -Ue : R.T !== null ? Hf() : dc();
  }
  function Wd() {
    if (nu === 0)
      if ((Ue & 536870912) === 0 || ke) {
        var e = dl;
        ((dl <<= 1), (dl & 3932160) === 0 && (dl = 262144), (nu = e));
      } else nu = 536870912;
    return ((e = eu.current), e !== null && (e.flags |= 32), nu);
  }
  function Jt(e, t, a) {
    (((e === tt && (Ze === 2 || Ze === 9)) || e.cancelPendingCommit !== null) &&
      (qa(e, 0), Bn(e, Ue, nu, !1)),
      nr(e, a),
      ((Xe & 2) === 0 || e !== tt) &&
        (e === tt && ((Xe & 2) === 0 && (In |= a), dt === 4 && Bn(e, Ue, nu, !1)), Su(e)));
  }
  function $d(e, t, a) {
    if ((Xe & 6) !== 0) throw Error(l(327));
    var i = (!a && (t & 127) === 0 && (t & e.expiredLanes) === 0) || ur(e, t),
      f = i ? im(e, t) : jf(e, t, !0),
      o = i;
    do {
      if (f === 0) {
        La && !i && Bn(e, t, 0, !1);
        break;
      } else {
        if (((a = e.current.alternate), o && !rm(a))) {
          ((f = jf(e, t, !1)), (o = !1));
          continue;
        }
        if (f === 2) {
          if (((o = t), e.errorRecoveryDisabledLanes & o)) var v = 0;
          else
            ((v = e.pendingLanes & -536870913), (v = v !== 0 ? v : v & 536870912 ? 536870912 : 0));
          if (v !== 0) {
            t = v;
            e: {
              var p = e;
              f = Nr;
              var b = p.current.memoizedState.isDehydrated;
              if ((b && (qa(p, v).flags |= 256), (v = jf(p, v, !1)), v !== 2)) {
                if (Sf && !b) {
                  ((p.errorRecoveryDisabledLanes |= o), (In |= o), (f = 4));
                  break e;
                }
                ((o = Pt), (Pt = f), o !== null && (Pt === null ? (Pt = o) : Pt.push.apply(Pt, o)));
              }
              f = v;
            }
            if (((o = !1), f !== 2)) continue;
          }
        }
        if (f === 1) {
          (qa(e, 0), Bn(e, t, 0, !0));
          break;
        }
        e: {
          switch (((i = e), (o = f), o)) {
            case 0:
            case 1:
              throw Error(l(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Bn(i, t, nu, !Cn);
              break e;
            case 2:
              Pt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(l(329));
          }
          if ((t & 62914560) === t && ((f = ui + 300 - ot()), 10 < f)) {
            if ((Bn(i, t, nu, !Cn), vl(i, 0, !0) !== 0)) break e;
            ((Zu = t),
              (i.timeoutHandle = TD(
                Id.bind(null, i, a, Pt, ai, xf, t, nu, In, Ha, Cn, o, 'Throttled', -0, 0),
                f,
              )));
            break e;
          }
          Id(i, a, Pt, ai, xf, t, nu, In, Ha, Cn, o, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Su(e);
  }
  function Id(e, t, a, i, f, o, v, p, b, H, Q, te, U, Y) {
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
        unsuspend: ju,
      }),
        Xd(t, o, te));
      var me = (o & 62914560) === o ? ui - ot() : (o & 4194048) === o ? Pd - ot() : 0;
      if (((me = Ym(te, me)), me !== null)) {
        ((Zu = o),
          (e.cancelPendingCommit = me(iD.bind(null, e, t, o, a, i, f, v, p, b, Q, te, null, U, Y))),
          Bn(e, o, v, !H));
        return;
      }
    }
    iD(e, t, o, a, i, f, v, p, b);
  }
  function rm(e) {
    for (var t = e; ;) {
      var a = t.tag;
      if (
        (a === 0 || a === 11 || a === 15) &&
        t.flags & 16384 &&
        ((a = t.updateQueue), a !== null && ((a = a.stores), a !== null))
      )
        for (var i = 0; i < a.length; i++) {
          var f = a[i],
            o = f.getSnapshot;
          f = f.value;
          try {
            if (!$t(o(), f)) return !1;
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
  function Bn(e, t, a, i) {
    ((t &= ~Of),
      (t &= ~In),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      i && (e.warmLanes |= t),
      (i = e.expirationTimes));
    for (var f = t; 0 < f;) {
      var o = 31 - Ut(f),
        v = 1 << o;
      ((i[o] = -1), (f &= ~v));
    }
    a !== 0 && fc(e, a, t);
  }
  function ri() {
    return (Xe & 6) === 0 ? (Hr(0), !1) : !0;
  }
  function Rf() {
    if (Le !== null) {
      if (Ze === 0) var e = Le.return;
      else ((e = Le), (Hu = Vn = null), Qs(e), (Ta = null), (pr = 0), (e = Le));
      for (; e !== null;) (wd(e.alternate, e), (e = e.return));
      Le = null;
    }
  }
  function qa(e, t) {
    var a = e.timeoutHandle;
    (a !== -1 && ((e.timeoutHandle = -1), Fm(a)),
      (a = e.cancelPendingCommit),
      a !== null && ((e.cancelPendingCommit = null), a()),
      (Zu = 0),
      Rf(),
      (tt = e),
      (Le = a = Nu(e.current, null)),
      (Ue = t),
      (Ze = 0),
      (uu = null),
      (Cn = !1),
      (La = ur(e, t)),
      (Sf = !1),
      (Ha = nu = Of = In = pn = dt = 0),
      (Pt = Nr = null),
      (xf = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var i = e.entangledLanes;
    if (i !== 0)
      for (e = e.entanglements, i &= t; 0 < i;) {
        var f = 31 - Ut(i),
          o = 1 << f;
        ((t |= e[f]), (i &= ~o));
      }
    return ((Qu = t), Sl(), a);
  }
  function eD(e, t) {
    ((Re = null),
      (R.H = Or),
      t === xa || t === zl
        ? ((t = g0()), (Ze = 3))
        : t === Ns
          ? ((t = g0()), (Ze = 4))
          : (Ze =
              t === of
                ? 8
                : t !== null && typeof t == 'object' && typeof t.then == 'function'
                  ? 6
                  : 1),
      (uu = t),
      Le === null && ((dt = 1), Zl(e, fu(t, e.current))));
  }
  function tD() {
    var e = eu.current;
    return e === null
      ? !0
      : (Ue & 4194048) === Ue
        ? Du === null
        : (Ue & 62914560) === Ue || (Ue & 536870912) !== 0
          ? e === Du
          : !1;
  }
  function uD() {
    var e = R.H;
    return ((R.H = Or), e === null ? Or : e);
  }
  function nD() {
    var e = R.A;
    return ((R.A = nm), e);
  }
  function li() {
    ((dt = 4),
      Cn || ((Ue & 4194048) !== Ue && eu.current !== null) || (La = !0),
      ((pn & 134217727) === 0 && (In & 134217727) === 0) || tt === null || Bn(tt, Ue, nu, !1));
  }
  function jf(e, t, a) {
    var i = Xe;
    Xe |= 2;
    var f = uD(),
      o = nD();
    ((tt !== e || Ue !== t) && ((ai = null), qa(e, t)), (t = !1));
    var v = dt;
    e: do
      try {
        if (Ze !== 0 && Le !== null) {
          var p = Le,
            b = uu;
          switch (Ze) {
            case 8:
              (Rf(), (v = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              eu.current === null && (t = !0);
              var H = Ze;
              if (((Ze = 0), (uu = null), ka(e, p, b, H), a && La)) {
                v = 0;
                break e;
              }
              break;
            default:
              ((H = Ze), (Ze = 0), (uu = null), ka(e, p, b, H));
          }
        }
        (lm(), (v = dt));
        break;
      } catch (Q) {
        eD(e, Q);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (Hu = Vn = null),
      (Xe = i),
      (R.H = f),
      (R.A = o),
      Le === null && ((tt = null), (Ue = 0), Sl()),
      v
    );
  }
  function lm() {
    for (; Le !== null;) aD(Le);
  }
  function im(e, t) {
    var a = Xe;
    Xe |= 2;
    var i = uD(),
      f = nD();
    tt !== e || Ue !== t ? ((ai = null), (ni = ot() + 500), qa(e, t)) : (La = ur(e, t));
    e: do
      try {
        if (Ze !== 0 && Le !== null) {
          t = Le;
          var o = uu;
          t: switch (Ze) {
            case 1:
              ((Ze = 0), (uu = null), ka(e, t, o, 1));
              break;
            case 2:
            case 9:
              if (v0(o)) {
                ((Ze = 0), (uu = null), rD(t));
                break;
              }
              ((t = function () {
                ((Ze !== 2 && Ze !== 9) || tt !== e || (Ze = 7), Su(e));
              }),
                o.then(t, t));
              break e;
            case 3:
              Ze = 7;
              break e;
            case 4:
              Ze = 5;
              break e;
            case 7:
              v0(o) ? ((Ze = 0), (uu = null), rD(t)) : ((Ze = 0), (uu = null), ka(e, t, o, 7));
              break;
            case 5:
              var v = null;
              switch (Le.tag) {
                case 26:
                  v = Le.memoizedState;
                case 5:
                case 27:
                  var p = Le;
                  if (v ? VD(v) : p.stateNode.complete) {
                    ((Ze = 0), (uu = null));
                    var b = p.sibling;
                    if (b !== null) Le = b;
                    else {
                      var H = p.return;
                      H !== null ? ((Le = H), ii(H)) : (Le = null);
                    }
                    break t;
                  }
              }
              ((Ze = 0), (uu = null), ka(e, t, o, 5));
              break;
            case 6:
              ((Ze = 0), (uu = null), ka(e, t, o, 6));
              break;
            case 8:
              (Rf(), (dt = 6));
              break e;
            default:
              throw Error(l(462));
          }
        }
        sm();
        break;
      } catch (Q) {
        eD(e, Q);
      }
    while (!0);
    return (
      (Hu = Vn = null),
      (R.H = i),
      (R.A = f),
      (Xe = a),
      Le !== null ? 0 : ((tt = null), (Ue = 0), Sl(), dt)
    );
  }
  function sm() {
    for (; Le !== null && !Ve();) aD(Le);
  }
  function aD(e) {
    var t = xd(e.alternate, e, Qu);
    ((e.memoizedProps = e.pendingProps), t === null ? ii(e) : (Le = t));
  }
  function rD(e) {
    var t = e,
      a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Bd(a, t, t.pendingProps, t.type, void 0, Ue);
        break;
      case 11:
        t = Bd(a, t, t.pendingProps, t.type.render, t.ref, Ue);
        break;
      case 5:
        Qs(t);
      default:
        (wd(a, t), (t = Le = n0(t, Qu)), (t = xd(a, t, Qu)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? ii(e) : (Le = t));
  }
  function ka(e, t, a, i) {
    ((Hu = Vn = null), Qs(t), (Ta = null), (pr = 0));
    var f = t.return;
    try {
      if (J1(e, f, t, a, Ue)) {
        ((dt = 1), Zl(e, fu(a, e.current)), (Le = null));
        return;
      }
    } catch (o) {
      if (f !== null) throw ((Le = f), o);
      ((dt = 1), Zl(e, fu(a, e.current)), (Le = null));
      return;
    }
    t.flags & 32768
      ? (ke || i === 1
          ? (e = !0)
          : La || (Ue & 536870912) !== 0
            ? (e = !1)
            : ((Cn = e = !0),
              (i === 2 || i === 9 || i === 3 || i === 6) &&
                ((i = eu.current), i !== null && i.tag === 13 && (i.flags |= 16384))),
        lD(t, e))
      : ii(t);
  }
  function ii(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        lD(t, Cn);
        return;
      }
      e = t.return;
      var a = I1(t.alternate, t, Qu);
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
    dt === 0 && (dt = 5);
  }
  function lD(e, t) {
    do {
      var a = em(e.alternate, e);
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
    ((dt = 6), (Le = null));
  }
  function iD(e, t, a, i, f, o, v, p, b) {
    e.cancelPendingCommit = null;
    do si();
    while (At !== 0);
    if ((Xe & 6) !== 0) throw Error(l(327));
    if (t !== null) {
      if (t === e.current) throw Error(l(177));
      if (
        ((o = t.lanes | t.childLanes),
        (o |= Es),
        _g(e, a, o, v, p, b),
        e === tt && ((Le = tt = null), (Ue = 0)),
        (Ua = t),
        (An = e),
        (Zu = a),
        (Tf = o),
        (wf = f),
        (Jd = i),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            dm(Yt, function () {
              return (dD(), null);
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (i = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || i)
      ) {
        ((i = R.T), (R.T = null), (f = G.p), (G.p = 2), (v = Xe), (Xe |= 4));
        try {
          tm(e, t, a);
        } finally {
          ((Xe = v), (G.p = f), (R.T = i));
        }
      }
      ((At = 1), sD(), fD(), oD());
    }
  }
  function sD() {
    if (At === 1) {
      At = 0;
      var e = An,
        t = Ua,
        a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        ((a = R.T), (R.T = null));
        var i = G.p;
        G.p = 2;
        var f = Xe;
        Xe |= 4;
        try {
          Gd(t, e);
          var o = Xf,
            v = Zc(e.containerInfo),
            p = o.focusedElem,
            b = o.selectionRange;
          if (v !== p && p && p.ownerDocument && Qc(p.ownerDocument.documentElement, p)) {
            if (b !== null && hs(p)) {
              var H = b.start,
                Q = b.end;
              if ((Q === void 0 && (Q = H), 'selectionStart' in p))
                ((p.selectionStart = H), (p.selectionEnd = Math.min(Q, p.value.length)));
              else {
                var te = p.ownerDocument || document,
                  U = (te && te.defaultView) || window;
                if (U.getSelection) {
                  var Y = U.getSelection(),
                    me = p.textContent.length,
                    Se = Math.min(b.start, me),
                    et = b.end === void 0 ? Se : Math.min(b.end, me);
                  !Y.extend && Se > et && ((v = et), (et = Se), (Se = v));
                  var j = Kc(p, Se),
                    O = Kc(p, et);
                  if (
                    j &&
                    O &&
                    (Y.rangeCount !== 1 ||
                      Y.anchorNode !== j.node ||
                      Y.anchorOffset !== j.offset ||
                      Y.focusNode !== O.node ||
                      Y.focusOffset !== O.offset)
                  ) {
                    var L = te.createRange();
                    (L.setStart(j.node, j.offset),
                      Y.removeAllRanges(),
                      Se > et
                        ? (Y.addRange(L), Y.extend(O.node, O.offset))
                        : (L.setEnd(O.node, O.offset), Y.addRange(L)));
                  }
                }
              }
            }
            for (te = [], Y = p; (Y = Y.parentNode);)
              Y.nodeType === 1 && te.push({ element: Y, left: Y.scrollLeft, top: Y.scrollTop });
            for (typeof p.focus == 'function' && p.focus(), p = 0; p < te.length; p++) {
              var $ = te[p];
              (($.element.scrollLeft = $.left), ($.element.scrollTop = $.top));
            }
          }
          ((Ei = !!Vf), (Xf = Vf = null));
        } finally {
          ((Xe = f), (G.p = i), (R.T = a));
        }
      }
      ((e.current = t), (At = 2));
    }
  }
  function fD() {
    if (At === 2) {
      At = 0;
      var e = An,
        t = Ua,
        a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        ((a = R.T), (R.T = null));
        var i = G.p;
        G.p = 2;
        var f = Xe;
        Xe |= 4;
        try {
          Hd(e, t.alternate, t);
        } finally {
          ((Xe = f), (G.p = i), (R.T = a));
        }
      }
      At = 3;
    }
  }
  function oD() {
    if (At === 4 || At === 3) {
      ((At = 0), _t());
      var e = An,
        t = Ua,
        a = Zu,
        i = Jd;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (At = 5)
        : ((At = 0), (Ua = An = null), cD(e, e.pendingLanes));
      var f = e.pendingLanes;
      if (
        (f === 0 && (En = null),
        Ji(a),
        (t = t.stateNode),
        St && typeof St.onCommitFiberRoot == 'function')
      )
        try {
          St.onCommitFiberRoot(an, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (i !== null) {
        ((t = R.T), (f = G.p), (G.p = 2), (R.T = null));
        try {
          for (var o = e.onRecoverableError, v = 0; v < i.length; v++) {
            var p = i[v];
            o(p.value, { componentStack: p.stack });
          }
        } finally {
          ((R.T = t), (G.p = f));
        }
      }
      ((Zu & 3) !== 0 && si(),
        Su(e),
        (f = e.pendingLanes),
        (a & 261930) !== 0 && (f & 42) !== 0 ? (e === Mf ? Lr++ : ((Lr = 0), (Mf = e))) : (Lr = 0),
        Hr(0));
    }
  }
  function cD(e, t) {
    (e.pooledCacheLanes &= t) === 0 &&
      ((t = e.pooledCache), t != null && ((e.pooledCache = null), mr(t)));
  }
  function si() {
    return (sD(), fD(), oD(), dD());
  }
  function dD() {
    if (At !== 5) return !1;
    var e = An,
      t = Tf;
    Tf = 0;
    var a = Ji(Zu),
      i = R.T,
      f = G.p;
    try {
      ((G.p = 32 > a ? 32 : a), (R.T = null), (a = wf), (wf = null));
      var o = An,
        v = Zu;
      if (((At = 0), (Ua = An = null), (Zu = 0), (Xe & 6) !== 0)) throw Error(l(331));
      var p = Xe;
      if (
        ((Xe |= 4),
        Qd(o.current),
        Vd(o, o.current, v, a),
        (Xe = p),
        Hr(0, !1),
        St && typeof St.onPostCommitFiberRoot == 'function')
      )
        try {
          St.onPostCommitFiberRoot(an, o);
        } catch {}
      return !0;
    } finally {
      ((G.p = f), (R.T = i), cD(e, t));
    }
  }
  function DD(e, t, a) {
    ((t = fu(a, t)),
      (t = ff(e.stateNode, t, 2)),
      (e = vn(e, t, 2)),
      e !== null && (nr(e, 2), Su(e)));
  }
  function Pe(e, t, a) {
    if (e.tag === 3) DD(e, e, a);
    else
      for (; t !== null;) {
        if (t.tag === 3) {
          DD(t, e, a);
          break;
        } else if (t.tag === 1) {
          var i = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == 'function' ||
            (typeof i.componentDidCatch == 'function' && (En === null || !En.has(i)))
          ) {
            ((e = fu(a, e)),
              (a = vd(2)),
              (i = vn(t, a, 2)),
              i !== null && (hd(a, i, t, e), nr(i, 2), Su(i)));
            break;
          }
        }
        t = t.return;
      }
  }
  function zf(e, t, a) {
    var i = e.pingCache;
    if (i === null) {
      i = e.pingCache = new am();
      var f = new Set();
      i.set(t, f);
    } else ((f = i.get(t)), f === void 0 && ((f = new Set()), i.set(t, f)));
    f.has(a) || ((Sf = !0), f.add(a), (e = fm.bind(null, e, t, a)), t.then(e, e));
  }
  function fm(e, t, a) {
    var i = e.pingCache;
    (i !== null && i.delete(t),
      (e.pingedLanes |= e.suspendedLanes & a),
      (e.warmLanes &= ~a),
      tt === e &&
        (Ue & a) === a &&
        (dt === 4 || (dt === 3 && (Ue & 62914560) === Ue && 300 > ot() - ui)
          ? (Xe & 2) === 0 && qa(e, 0)
          : (Of |= a),
        Ha === Ue && (Ha = 0)),
      Su(e));
  }
  function vD(e, t) {
    (t === 0 && (t = sc()), (e = _n(e, t)), e !== null && (nr(e, t), Su(e)));
  }
  function om(e) {
    var t = e.memoizedState,
      a = 0;
    (t !== null && (a = t.retryLane), vD(e, a));
  }
  function cm(e, t) {
    var a = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var i = e.stateNode,
          f = e.memoizedState;
        f !== null && (a = f.retryLane);
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
    (i !== null && i.delete(t), vD(e, a));
  }
  function dm(e, t) {
    return We(e, t);
  }
  var fi = null,
    _a = null,
    Nf = !1,
    oi = !1,
    Lf = !1,
    yn = 0;
  function Su(e) {
    (e !== _a && e.next === null && (_a === null ? (fi = _a = e) : (_a = _a.next = e)),
      (oi = !0),
      Nf || ((Nf = !0), vm()));
  }
  function Hr(e, t) {
    if (!Lf && oi) {
      Lf = !0;
      do
        for (var a = !1, i = fi; i !== null;) {
          if (e !== 0) {
            var f = i.pendingLanes;
            if (f === 0) var o = 0;
            else {
              var v = i.suspendedLanes,
                p = i.pingedLanes;
              ((o = (1 << (31 - Ut(42 | e) + 1)) - 1),
                (o &= f & ~(v & ~p)),
                (o = o & 201326741 ? (o & 201326741) | 1 : o ? o | 2 : 0));
            }
            o !== 0 && ((a = !0), CD(i, o));
          } else
            ((o = Ue),
              (o = vl(
                i,
                i === tt ? o : 0,
                i.cancelPendingCommit !== null || i.timeoutHandle !== -1,
              )),
              (o & 3) === 0 || ur(i, o) || ((a = !0), CD(i, o)));
          i = i.next;
        }
      while (a);
      Lf = !1;
    }
  }
  function Dm() {
    hD();
  }
  function hD() {
    oi = Nf = !1;
    var e = 0;
    yn !== 0 && bm() && (e = yn);
    for (var t = ot(), a = null, i = fi; i !== null;) {
      var f = i.next,
        o = gD(i, t);
      (o === 0
        ? ((i.next = null), a === null ? (fi = f) : (a.next = f), f === null && (_a = a))
        : ((a = i), (e !== 0 || (o & 3) !== 0) && (oi = !0)),
        (i = f));
    }
    ((At !== 0 && At !== 5) || Hr(e), yn !== 0 && (yn = 0));
  }
  function gD(e, t) {
    for (
      var a = e.suspendedLanes,
        i = e.pingedLanes,
        f = e.expirationTimes,
        o = e.pendingLanes & -62914561;
      0 < o;
    ) {
      var v = 31 - Ut(o),
        p = 1 << v,
        b = f[v];
      (b === -1
        ? ((p & a) === 0 || (p & i) !== 0) && (f[v] = kg(p, t))
        : b <= t && (e.expiredLanes |= p),
        (o &= ~p));
    }
    if (
      ((t = tt),
      (a = Ue),
      (a = vl(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      (i = e.callbackNode),
      a === 0 || (e === t && (Ze === 2 || Ze === 9)) || e.cancelPendingCommit !== null)
    )
      return (i !== null && i !== null && pt(i), (e.callbackNode = null), (e.callbackPriority = 0));
    if ((a & 3) === 0 || ur(e, a)) {
      if (((t = a & -a), t === e.callbackPriority)) return t;
      switch ((i !== null && pt(i), Ji(a))) {
        case 2:
        case 8:
          a = ru;
          break;
        case 32:
          a = Yt;
          break;
        case 268435456:
          a = Et;
          break;
        default:
          a = Yt;
      }
      return (
        (i = mD.bind(null, e)),
        (a = We(a, i)),
        (e.callbackPriority = t),
        (e.callbackNode = a),
        t
      );
    }
    return (
      i !== null && i !== null && pt(i),
      (e.callbackPriority = 2),
      (e.callbackNode = null),
      2
    );
  }
  function mD(e, t) {
    if (At !== 0 && At !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var a = e.callbackNode;
    if (si() && e.callbackNode !== a) return null;
    var i = Ue;
    return (
      (i = vl(e, e === tt ? i : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      i === 0
        ? null
        : ($d(e, i, t),
          gD(e, ot()),
          e.callbackNode != null && e.callbackNode === a ? mD.bind(null, e) : null)
    );
  }
  function CD(e, t) {
    if (si()) return null;
    $d(e, t, !0);
  }
  function vm() {
    Sm(function () {
      (Xe & 6) !== 0 ? We(Gt, Dm) : hD();
    });
  }
  function Hf() {
    if (yn === 0) {
      var e = Sa;
      (e === 0 && ((e = cl), (cl <<= 1), (cl & 261888) === 0 && (cl = 256)), (yn = e));
    }
    return yn;
  }
  function pD(e) {
    return e == null || typeof e == 'symbol' || typeof e == 'boolean'
      ? null
      : typeof e == 'function'
        ? e
        : Cl('' + e);
  }
  function ED(e, t) {
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
  function hm(e, t, a, i, f) {
    if (t === 'submit' && a && a.stateNode === f) {
      var o = pD((f[Vt] || null).action),
        v = i.submitter;
      v &&
        ((t = (t = v[Vt] || null) ? pD(t.formAction) : v.getAttribute('formAction')),
        t !== null && ((o = t), (v = null)));
      var p = new Bl('action', 'action', null, i, f);
      e.push({
        event: p,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (i.defaultPrevented) {
                if (yn !== 0) {
                  var b = v ? ED(f, v) : new FormData(f);
                  uf(a, { pending: !0, data: b, method: f.method, action: o }, null, b);
                }
              } else
                typeof o == 'function' &&
                  (p.preventDefault(),
                  (b = v ? ED(f, v) : new FormData(f)),
                  uf(a, { pending: !0, data: b, method: f.method, action: o }, o, b));
            },
            currentTarget: f,
          },
        ],
      });
    }
  }
  for (var Uf = 0; Uf < ps.length; Uf++) {
    var qf = ps[Uf],
      gm = qf.toLowerCase(),
      mm = qf[0].toUpperCase() + qf.slice(1);
    Cu(gm, 'on' + mm);
  }
  (Cu(Wc, 'onAnimationEnd'),
    Cu($c, 'onAnimationIteration'),
    Cu(Ic, 'onAnimationStart'),
    Cu('dblclick', 'onDoubleClick'),
    Cu('focusin', 'onFocus'),
    Cu('focusout', 'onBlur'),
    Cu(j1, 'onTransitionRun'),
    Cu(z1, 'onTransitionStart'),
    Cu(N1, 'onTransitionCancel'),
    Cu(e0, 'onTransitionEnd'),
    da('onMouseEnter', ['mouseout', 'mouseover']),
    da('onMouseLeave', ['mouseout', 'mouseover']),
    da('onPointerEnter', ['pointerout', 'pointerover']),
    da('onPointerLeave', ['pointerout', 'pointerover']),
    Hn('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    Hn(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    ),
    Hn('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Hn('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    Hn(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    ),
    Hn(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    ));
  var Ur =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' ',
      ),
    Cm = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(Ur),
    );
  function AD(e, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var i = e[a],
        f = i.event;
      i = i.listeners;
      e: {
        var o = void 0;
        if (t)
          for (var v = i.length - 1; 0 <= v; v--) {
            var p = i[v],
              b = p.instance,
              H = p.currentTarget;
            if (((p = p.listener), b !== o && f.isPropagationStopped())) break e;
            ((o = p), (f.currentTarget = H));
            try {
              o(f);
            } catch (Q) {
              Fl(Q);
            }
            ((f.currentTarget = null), (o = b));
          }
        else
          for (v = 0; v < i.length; v++) {
            if (
              ((p = i[v]),
              (b = p.instance),
              (H = p.currentTarget),
              (p = p.listener),
              b !== o && f.isPropagationStopped())
            )
              break e;
            ((o = p), (f.currentTarget = H));
            try {
              o(f);
            } catch (Q) {
              Fl(Q);
            }
            ((f.currentTarget = null), (o = b));
          }
      }
    }
  }
  function He(e, t) {
    var a = t[Wi];
    a === void 0 && (a = t[Wi] = new Set());
    var i = e + '__bubble';
    a.has(i) || (BD(t, e, 2, !1), a.add(i));
  }
  function kf(e, t, a) {
    var i = 0;
    (t && (i |= 4), BD(a, e, i, t));
  }
  var ci = '_reactListening' + Math.random().toString(36).slice(2);
  function _f(e) {
    if (!e[ci]) {
      ((e[ci] = !0),
        hc.forEach(function (a) {
          a !== 'selectionchange' && (Cm.has(a) || kf(a, !1, e), kf(a, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ci] || ((t[ci] = !0), kf('selectionchange', !1, t));
    }
  }
  function BD(e, t, a, i) {
    switch (WD(t)) {
      case 2:
        var f = Km;
        break;
      case 8:
        f = Qm;
        break;
      default:
        f = uo;
    }
    ((a = f.bind(null, t, a, e)),
      (f = void 0),
      !ls || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (f = !0),
      i
        ? f !== void 0
          ? e.addEventListener(t, a, { capture: !0, passive: f })
          : e.addEventListener(t, a, !0)
        : f !== void 0
          ? e.addEventListener(t, a, { passive: f })
          : e.addEventListener(t, a, !1));
  }
  function Gf(e, t, a, i, f) {
    var o = i;
    if ((t & 1) === 0 && (t & 2) === 0 && i !== null)
      e: for (;;) {
        if (i === null) return;
        var v = i.tag;
        if (v === 3 || v === 4) {
          var p = i.stateNode.containerInfo;
          if (p === f) break;
          if (v === 4)
            for (v = i.return; v !== null;) {
              var b = v.tag;
              if ((b === 3 || b === 4) && v.stateNode.containerInfo === f) return;
              v = v.return;
            }
          for (; p !== null;) {
            if (((v = fa(p)), v === null)) return;
            if (((b = v.tag), b === 5 || b === 6 || b === 26 || b === 27)) {
              i = o = v;
              continue e;
            }
            p = p.parentNode;
          }
        }
        i = i.return;
      }
    Oc(function () {
      var H = o,
        Q = as(a),
        te = [];
      e: {
        var U = t0.get(e);
        if (U !== void 0) {
          var Y = Bl,
            me = e;
          switch (e) {
            case 'keypress':
              if (El(a) === 0) break e;
            case 'keydown':
            case 'keyup':
              Y = c1;
              break;
            case 'focusin':
              ((me = 'focus'), (Y = os));
              break;
            case 'focusout':
              ((me = 'blur'), (Y = os));
              break;
            case 'beforeblur':
            case 'afterblur':
              Y = os;
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
              Y = wc;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              Y = Ig;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              Y = v1;
              break;
            case Wc:
            case $c:
            case Ic:
              Y = u1;
              break;
            case e0:
              Y = g1;
              break;
            case 'scroll':
            case 'scrollend':
              Y = Wg;
              break;
            case 'wheel':
              Y = C1;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              Y = a1;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              Y = Rc;
              break;
            case 'toggle':
            case 'beforetoggle':
              Y = E1;
          }
          var Se = (t & 4) !== 0,
            et = !Se && (e === 'scroll' || e === 'scrollend'),
            j = Se ? (U !== null ? U + 'Capture' : null) : U;
          Se = [];
          for (var O = H, L; O !== null;) {
            var $ = O;
            if (
              ((L = $.stateNode),
              ($ = $.tag),
              ($ !== 5 && $ !== 26 && $ !== 27) ||
                L === null ||
                j === null ||
                (($ = lr(O, j)), $ != null && Se.push(qr(O, $, L))),
              et)
            )
              break;
            O = O.return;
          }
          0 < Se.length && ((U = new Y(U, me, null, a, Q)), te.push({ event: U, listeners: Se }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((U = e === 'mouseover' || e === 'pointerover'),
            (Y = e === 'mouseout' || e === 'pointerout'),
            U && a !== ns && (me = a.relatedTarget || a.fromElement) && (fa(me) || me[sa]))
          )
            break e;
          if (
            (Y || U) &&
            ((U =
              Q.window === Q
                ? Q
                : (U = Q.ownerDocument)
                  ? U.defaultView || U.parentWindow
                  : window),
            Y
              ? ((me = a.relatedTarget || a.toElement),
                (Y = H),
                (me = me ? fa(me) : null),
                me !== null &&
                  ((et = c(me)), (Se = me.tag), me !== et || (Se !== 5 && Se !== 27 && Se !== 6)) &&
                  (me = null))
              : ((Y = null), (me = H)),
            Y !== me)
          ) {
            if (
              ((Se = wc),
              ($ = 'onMouseLeave'),
              (j = 'onMouseEnter'),
              (O = 'mouse'),
              (e === 'pointerout' || e === 'pointerover') &&
                ((Se = Rc), ($ = 'onPointerLeave'), (j = 'onPointerEnter'), (O = 'pointer')),
              (et = Y == null ? U : rr(Y)),
              (L = me == null ? U : rr(me)),
              (U = new Se($, O + 'leave', Y, a, Q)),
              (U.target = et),
              (U.relatedTarget = L),
              ($ = null),
              fa(Q) === H &&
                ((Se = new Se(j, O + 'enter', me, a, Q)),
                (Se.target = L),
                (Se.relatedTarget = et),
                ($ = Se)),
              (et = $),
              Y && me)
            )
              t: {
                for (Se = pm, j = Y, O = me, L = 0, $ = j; $; $ = Se($)) L++;
                $ = 0;
                for (var Be = O; Be; Be = Se(Be)) $++;
                for (; 0 < L - $;) ((j = Se(j)), L--);
                for (; 0 < $ - L;) ((O = Se(O)), $--);
                for (; L--;) {
                  if (j === O || (O !== null && j === O.alternate)) {
                    Se = j;
                    break t;
                  }
                  ((j = Se(j)), (O = Se(O)));
                }
                Se = null;
              }
            else Se = null;
            (Y !== null && yD(te, U, Y, Se, !1),
              me !== null && et !== null && yD(te, et, me, Se, !0));
          }
        }
        e: {
          if (
            ((U = H ? rr(H) : window),
            (Y = U.nodeName && U.nodeName.toLowerCase()),
            Y === 'select' || (Y === 'input' && U.type === 'file'))
          )
            var Ge = kc;
          else if (Uc(U))
            if (_c) Ge = w1;
            else {
              Ge = x1;
              var pe = O1;
            }
          else
            ((Y = U.nodeName),
              !Y || Y.toLowerCase() !== 'input' || (U.type !== 'checkbox' && U.type !== 'radio')
                ? H && us(H.elementType) && (Ge = kc)
                : (Ge = T1));
          if (Ge && (Ge = Ge(e, H))) {
            qc(te, Ge, a, Q);
            break e;
          }
          (pe && pe(e, U, H),
            e === 'focusout' &&
              H &&
              U.type === 'number' &&
              H.memoizedProps.value != null &&
              ts(U, 'number', U.value));
        }
        switch (((pe = H ? rr(H) : window), e)) {
          case 'focusin':
            (Uc(pe) || pe.contentEditable === 'true') && ((Ca = pe), (gs = H), (vr = null));
            break;
          case 'focusout':
            vr = gs = Ca = null;
            break;
          case 'mousedown':
            ms = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((ms = !1), Pc(te, a, Q));
            break;
          case 'selectionchange':
            if (R1) break;
          case 'keydown':
          case 'keyup':
            Pc(te, a, Q);
        }
        var je;
        if (ds)
          e: {
            switch (e) {
              case 'compositionstart':
                var qe = 'onCompositionStart';
                break e;
              case 'compositionend':
                qe = 'onCompositionEnd';
                break e;
              case 'compositionupdate':
                qe = 'onCompositionUpdate';
                break e;
            }
            qe = void 0;
          }
        else
          ma
            ? Lc(e, a) && (qe = 'onCompositionEnd')
            : e === 'keydown' && a.keyCode === 229 && (qe = 'onCompositionStart');
        (qe &&
          (jc &&
            a.locale !== 'ko' &&
            (ma || qe !== 'onCompositionStart'
              ? qe === 'onCompositionEnd' && ma && (je = xc())
              : ((ln = Q), (is = 'value' in ln ? ln.value : ln.textContent), (ma = !0))),
          (pe = di(H, qe)),
          0 < pe.length &&
            ((qe = new Mc(qe, e, null, a, Q)),
            te.push({ event: qe, listeners: pe }),
            je ? (qe.data = je) : ((je = Hc(a)), je !== null && (qe.data = je)))),
          (je = B1 ? y1(e, a) : b1(e, a)) &&
            ((qe = di(H, 'onBeforeInput')),
            0 < qe.length &&
              ((pe = new Mc('onBeforeInput', 'beforeinput', null, a, Q)),
              te.push({ event: pe, listeners: qe }),
              (pe.data = je))),
          hm(te, e, H, a, Q));
      }
      AD(te, t);
    });
  }
  function qr(e, t, a) {
    return { instance: e, listener: t, currentTarget: a };
  }
  function di(e, t) {
    for (var a = t + 'Capture', i = []; e !== null;) {
      var f = e,
        o = f.stateNode;
      if (
        ((f = f.tag),
        (f !== 5 && f !== 26 && f !== 27) ||
          o === null ||
          ((f = lr(e, a)),
          f != null && i.unshift(qr(e, f, o)),
          (f = lr(e, t)),
          f != null && i.push(qr(e, f, o))),
        e.tag === 3)
      )
        return i;
      e = e.return;
    }
    return [];
  }
  function pm(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function yD(e, t, a, i, f) {
    for (var o = t._reactName, v = []; a !== null && a !== i;) {
      var p = a,
        b = p.alternate,
        H = p.stateNode;
      if (((p = p.tag), b !== null && b === i)) break;
      ((p !== 5 && p !== 26 && p !== 27) ||
        H === null ||
        ((b = H),
        f
          ? ((H = lr(a, o)), H != null && v.unshift(qr(a, H, b)))
          : f || ((H = lr(a, o)), H != null && v.push(qr(a, H, b)))),
        (a = a.return));
    }
    v.length !== 0 && e.push({ event: t, listeners: v });
  }
  var Em = /\r\n?/g,
    Am = /\u0000|\uFFFD/g;
  function bD(e) {
    return (typeof e == 'string' ? e : '' + e)
      .replace(
        Em,
        `
`,
      )
      .replace(Am, '');
  }
  function FD(e, t) {
    return ((t = bD(t)), bD(e) === t);
  }
  function Ie(e, t, a, i, f, o) {
    switch (a) {
      case 'children':
        typeof i == 'string'
          ? t === 'body' || (t === 'textarea' && i === '') || va(e, i)
          : (typeof i == 'number' || typeof i == 'bigint') && t !== 'body' && va(e, '' + i);
        break;
      case 'className':
        gl(e, 'class', i);
        break;
      case 'tabIndex':
        gl(e, 'tabindex', i);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        gl(e, a, i);
        break;
      case 'style':
        Fc(e, i, o);
        break;
      case 'data':
        if (t !== 'object') {
          gl(e, 'data', i);
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
        ((i = Cl('' + i)), e.setAttribute(a, i));
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
          typeof o == 'function' &&
            (a === 'formAction'
              ? (t !== 'input' && Ie(e, t, 'name', f.name, f, null),
                Ie(e, t, 'formEncType', f.formEncType, f, null),
                Ie(e, t, 'formMethod', f.formMethod, f, null),
                Ie(e, t, 'formTarget', f.formTarget, f, null))
              : (Ie(e, t, 'encType', f.encType, f, null),
                Ie(e, t, 'method', f.method, f, null),
                Ie(e, t, 'target', f.target, f, null)));
        if (i == null || typeof i == 'symbol' || typeof i == 'boolean') {
          e.removeAttribute(a);
          break;
        }
        ((i = Cl('' + i)), e.setAttribute(a, i));
        break;
      case 'onClick':
        i != null && (e.onclick = ju);
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
            if (f.children != null) throw Error(l(60));
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
        ((a = Cl('' + i)), e.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', a));
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
        (He('beforetoggle', e), He('toggle', e), hl(e, 'popover', i));
        break;
      case 'xlinkActuate':
        Ru(e, 'http://www.w3.org/1999/xlink', 'xlink:actuate', i);
        break;
      case 'xlinkArcrole':
        Ru(e, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', i);
        break;
      case 'xlinkRole':
        Ru(e, 'http://www.w3.org/1999/xlink', 'xlink:role', i);
        break;
      case 'xlinkShow':
        Ru(e, 'http://www.w3.org/1999/xlink', 'xlink:show', i);
        break;
      case 'xlinkTitle':
        Ru(e, 'http://www.w3.org/1999/xlink', 'xlink:title', i);
        break;
      case 'xlinkType':
        Ru(e, 'http://www.w3.org/1999/xlink', 'xlink:type', i);
        break;
      case 'xmlBase':
        Ru(e, 'http://www.w3.org/XML/1998/namespace', 'xml:base', i);
        break;
      case 'xmlLang':
        Ru(e, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', i);
        break;
      case 'xmlSpace':
        Ru(e, 'http://www.w3.org/XML/1998/namespace', 'xml:space', i);
        break;
      case 'is':
        hl(e, 'is', i);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < a.length) || (a[0] !== 'o' && a[0] !== 'O') || (a[1] !== 'n' && a[1] !== 'N')) &&
          ((a = Pg.get(a) || a), hl(e, a, i));
    }
  }
  function Yf(e, t, a, i, f, o) {
    switch (a) {
      case 'style':
        Fc(e, i, o);
        break;
      case 'dangerouslySetInnerHTML':
        if (i != null) {
          if (typeof i != 'object' || !('__html' in i)) throw Error(l(61));
          if (((a = i.__html), a != null)) {
            if (f.children != null) throw Error(l(60));
            e.innerHTML = a;
          }
        }
        break;
      case 'children':
        typeof i == 'string'
          ? va(e, i)
          : (typeof i == 'number' || typeof i == 'bigint') && va(e, '' + i);
        break;
      case 'onScroll':
        i != null && He('scroll', e);
        break;
      case 'onScrollEnd':
        i != null && He('scrollend', e);
        break;
      case 'onClick':
        i != null && (e.onclick = ju);
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
        if (!gc.hasOwnProperty(a))
          e: {
            if (
              a[0] === 'o' &&
              a[1] === 'n' &&
              ((f = a.endsWith('Capture')),
              (t = a.slice(2, f ? a.length - 7 : void 0)),
              (o = e[Vt] || null),
              (o = o != null ? o[a] : null),
              typeof o == 'function' && e.removeEventListener(t, o, f),
              typeof i == 'function')
            ) {
              (typeof o != 'function' &&
                o !== null &&
                (a in e ? (e[a] = null) : e.hasAttribute(a) && e.removeAttribute(a)),
                e.addEventListener(t, i, f));
              break e;
            }
            a in e ? (e[a] = i) : i === !0 ? e.setAttribute(a, '') : hl(e, a, i);
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
          f = !1,
          o;
        for (o in a)
          if (a.hasOwnProperty(o)) {
            var v = a[o];
            if (v != null)
              switch (o) {
                case 'src':
                  i = !0;
                  break;
                case 'srcSet':
                  f = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(l(137, t));
                default:
                  Ie(e, t, o, v, a, null);
              }
          }
        (f && Ie(e, t, 'srcSet', a.srcSet, a, null), i && Ie(e, t, 'src', a.src, a, null));
        return;
      case 'input':
        He('invalid', e);
        var p = (o = v = f = null),
          b = null,
          H = null;
        for (i in a)
          if (a.hasOwnProperty(i)) {
            var Q = a[i];
            if (Q != null)
              switch (i) {
                case 'name':
                  f = Q;
                  break;
                case 'type':
                  v = Q;
                  break;
                case 'checked':
                  b = Q;
                  break;
                case 'defaultChecked':
                  H = Q;
                  break;
                case 'value':
                  o = Q;
                  break;
                case 'defaultValue':
                  p = Q;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (Q != null) throw Error(l(137, t));
                  break;
                default:
                  Ie(e, t, i, Q, a, null);
              }
          }
        Ac(e, o, p, b, H, v, f, !1);
        return;
      case 'select':
        (He('invalid', e), (i = v = o = null));
        for (f in a)
          if (a.hasOwnProperty(f) && ((p = a[f]), p != null))
            switch (f) {
              case 'value':
                o = p;
                break;
              case 'defaultValue':
                v = p;
                break;
              case 'multiple':
                i = p;
              default:
                Ie(e, t, f, p, a, null);
            }
        ((t = o),
          (a = v),
          (e.multiple = !!i),
          t != null ? Da(e, !!i, t, !1) : a != null && Da(e, !!i, a, !0));
        return;
      case 'textarea':
        (He('invalid', e), (o = f = i = null));
        for (v in a)
          if (a.hasOwnProperty(v) && ((p = a[v]), p != null))
            switch (v) {
              case 'value':
                i = p;
                break;
              case 'defaultValue':
                f = p;
                break;
              case 'children':
                o = p;
                break;
              case 'dangerouslySetInnerHTML':
                if (p != null) throw Error(l(91));
                break;
              default:
                Ie(e, t, v, p, a, null);
            }
        yc(e, i, f, o);
        return;
      case 'option':
        for (b in a)
          if (a.hasOwnProperty(b) && ((i = a[b]), i != null))
            switch (b) {
              case 'selected':
                e.selected = i && typeof i != 'function' && typeof i != 'symbol';
                break;
              default:
                Ie(e, t, b, i, a, null);
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
        for (i = 0; i < Ur.length; i++) He(Ur[i], e);
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
        for (H in a)
          if (a.hasOwnProperty(H) && ((i = a[H]), i != null))
            switch (H) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(l(137, t));
              default:
                Ie(e, t, H, i, a, null);
            }
        return;
      default:
        if (us(t)) {
          for (Q in a)
            a.hasOwnProperty(Q) && ((i = a[Q]), i !== void 0 && Yf(e, t, Q, i, a, void 0));
          return;
        }
    }
    for (p in a) a.hasOwnProperty(p) && ((i = a[p]), i != null && Ie(e, t, p, i, a, null));
  }
  function Bm(e, t, a, i) {
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
        var f = null,
          o = null,
          v = null,
          p = null,
          b = null,
          H = null,
          Q = null;
        for (Y in a) {
          var te = a[Y];
          if (a.hasOwnProperty(Y) && te != null)
            switch (Y) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                b = te;
              default:
                i.hasOwnProperty(Y) || Ie(e, t, Y, null, i, te);
            }
        }
        for (var U in i) {
          var Y = i[U];
          if (((te = a[U]), i.hasOwnProperty(U) && (Y != null || te != null)))
            switch (U) {
              case 'type':
                o = Y;
                break;
              case 'name':
                f = Y;
                break;
              case 'checked':
                H = Y;
                break;
              case 'defaultChecked':
                Q = Y;
                break;
              case 'value':
                v = Y;
                break;
              case 'defaultValue':
                p = Y;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (Y != null) throw Error(l(137, t));
                break;
              default:
                Y !== te && Ie(e, t, U, Y, i, te);
            }
        }
        es(e, v, p, b, H, Q, o, f);
        return;
      case 'select':
        Y = v = p = U = null;
        for (o in a)
          if (((b = a[o]), a.hasOwnProperty(o) && b != null))
            switch (o) {
              case 'value':
                break;
              case 'multiple':
                Y = b;
              default:
                i.hasOwnProperty(o) || Ie(e, t, o, null, i, b);
            }
        for (f in i)
          if (((o = i[f]), (b = a[f]), i.hasOwnProperty(f) && (o != null || b != null)))
            switch (f) {
              case 'value':
                U = o;
                break;
              case 'defaultValue':
                p = o;
                break;
              case 'multiple':
                v = o;
              default:
                o !== b && Ie(e, t, f, o, i, b);
            }
        ((t = p),
          (a = v),
          (i = Y),
          U != null
            ? Da(e, !!a, U, !1)
            : !!i != !!a && (t != null ? Da(e, !!a, t, !0) : Da(e, !!a, a ? [] : '', !1)));
        return;
      case 'textarea':
        Y = U = null;
        for (p in a)
          if (((f = a[p]), a.hasOwnProperty(p) && f != null && !i.hasOwnProperty(p)))
            switch (p) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                Ie(e, t, p, null, i, f);
            }
        for (v in i)
          if (((f = i[v]), (o = a[v]), i.hasOwnProperty(v) && (f != null || o != null)))
            switch (v) {
              case 'value':
                U = f;
                break;
              case 'defaultValue':
                Y = f;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (f != null) throw Error(l(91));
                break;
              default:
                f !== o && Ie(e, t, v, f, i, o);
            }
        Bc(e, U, Y);
        return;
      case 'option':
        for (var me in a)
          if (((U = a[me]), a.hasOwnProperty(me) && U != null && !i.hasOwnProperty(me)))
            switch (me) {
              case 'selected':
                e.selected = !1;
                break;
              default:
                Ie(e, t, me, null, i, U);
            }
        for (b in i)
          if (((U = i[b]), (Y = a[b]), i.hasOwnProperty(b) && U !== Y && (U != null || Y != null)))
            switch (b) {
              case 'selected':
                e.selected = U && typeof U != 'function' && typeof U != 'symbol';
                break;
              default:
                Ie(e, t, b, U, i, Y);
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
          ((U = a[Se]),
            a.hasOwnProperty(Se) && U != null && !i.hasOwnProperty(Se) && Ie(e, t, Se, null, i, U));
        for (H in i)
          if (((U = i[H]), (Y = a[H]), i.hasOwnProperty(H) && U !== Y && (U != null || Y != null)))
            switch (H) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (U != null) throw Error(l(137, t));
                break;
              default:
                Ie(e, t, H, U, i, Y);
            }
        return;
      default:
        if (us(t)) {
          for (var et in a)
            ((U = a[et]),
              a.hasOwnProperty(et) &&
                U !== void 0 &&
                !i.hasOwnProperty(et) &&
                Yf(e, t, et, void 0, i, U));
          for (Q in i)
            ((U = i[Q]),
              (Y = a[Q]),
              !i.hasOwnProperty(Q) ||
                U === Y ||
                (U === void 0 && Y === void 0) ||
                Yf(e, t, Q, U, i, Y));
          return;
        }
    }
    for (var j in a)
      ((U = a[j]),
        a.hasOwnProperty(j) && U != null && !i.hasOwnProperty(j) && Ie(e, t, j, null, i, U));
    for (te in i)
      ((U = i[te]),
        (Y = a[te]),
        !i.hasOwnProperty(te) || U === Y || (U == null && Y == null) || Ie(e, t, te, U, i, Y));
  }
  function SD(e) {
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
  function ym() {
    if (typeof performance.getEntriesByType == 'function') {
      for (
        var e = 0, t = 0, a = performance.getEntriesByType('resource'), i = 0;
        i < a.length;
        i++
      ) {
        var f = a[i],
          o = f.transferSize,
          v = f.initiatorType,
          p = f.duration;
        if (o && p && SD(v)) {
          for (v = 0, p = f.responseEnd, i += 1; i < a.length; i++) {
            var b = a[i],
              H = b.startTime;
            if (H > p) break;
            var Q = b.transferSize,
              te = b.initiatorType;
            Q && SD(te) && ((b = b.responseEnd), (v += Q * (b < p ? 1 : (p - H) / (b - H))));
          }
          if ((--i, (t += (8 * (o + v)) / (f.duration / 1e3)), e++, 10 < e)) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && ((e = navigator.connection.downlink), typeof e == 'number')
      ? e
      : 5;
  }
  var Vf = null,
    Xf = null;
  function Di(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function OD(e) {
    switch (e) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function xD(e, t) {
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
  function Kf(e, t) {
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
  var Qf = null;
  function bm() {
    var e = window.event;
    return e && e.type === 'popstate' ? (e === Qf ? !1 : ((Qf = e), !0)) : ((Qf = null), !1);
  }
  var TD = typeof setTimeout == 'function' ? setTimeout : void 0,
    Fm = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    wD = typeof Promise == 'function' ? Promise : void 0,
    Sm =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof wD < 'u'
          ? function (e) {
              return wD.resolve(null).then(e).catch(Om);
            }
          : TD;
  function Om(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function bn(e) {
    return e === 'head';
  }
  function MD(e, t) {
    var a = t,
      i = 0;
    do {
      var f = a.nextSibling;
      if ((e.removeChild(a), f && f.nodeType === 8))
        if (((a = f.data), a === '/$' || a === '/&')) {
          if (i === 0) {
            (e.removeChild(f), Xa(t));
            return;
          }
          i--;
        } else if (a === '$' || a === '$?' || a === '$~' || a === '$!' || a === '&') i++;
        else if (a === 'html') kr(e.ownerDocument.documentElement);
        else if (a === 'head') {
          ((a = e.ownerDocument.head), kr(a));
          for (var o = a.firstChild; o;) {
            var v = o.nextSibling,
              p = o.nodeName;
            (o[ar] ||
              p === 'SCRIPT' ||
              p === 'STYLE' ||
              (p === 'LINK' && o.rel.toLowerCase() === 'stylesheet') ||
              a.removeChild(o),
              (o = v));
          }
        } else a === 'body' && kr(e.ownerDocument.body);
      a = f;
    } while (a);
    Xa(t);
  }
  function RD(e, t) {
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
  function Zf(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
      var a = t;
      switch (((t = t.nextSibling), a.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (Zf(a), $i(a));
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
  function xm(e, t, a, i) {
    for (; e.nodeType === 1;) {
      var f = a;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!i && (e.nodeName !== 'INPUT' || e.type !== 'hidden')) break;
      } else if (i) {
        if (!e[ar])
          switch (t) {
            case 'meta':
              if (!e.hasAttribute('itemprop')) break;
              return e;
            case 'link':
              if (
                ((o = e.getAttribute('rel')),
                o === 'stylesheet' && e.hasAttribute('data-precedence'))
              )
                break;
              if (
                o !== f.rel ||
                e.getAttribute('href') !== (f.href == null || f.href === '' ? null : f.href) ||
                e.getAttribute('crossorigin') !== (f.crossOrigin == null ? null : f.crossOrigin) ||
                e.getAttribute('title') !== (f.title == null ? null : f.title)
              )
                break;
              return e;
            case 'style':
              if (e.hasAttribute('data-precedence')) break;
              return e;
            case 'script':
              if (
                ((o = e.getAttribute('src')),
                (o !== (f.src == null ? null : f.src) ||
                  e.getAttribute('type') !== (f.type == null ? null : f.type) ||
                  e.getAttribute('crossorigin') !==
                    (f.crossOrigin == null ? null : f.crossOrigin)) &&
                  o &&
                  e.hasAttribute('async') &&
                  !e.hasAttribute('itemprop'))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === 'input' && e.type === 'hidden') {
        var o = f.name == null ? null : '' + f.name;
        if (f.type === 'hidden' && e.getAttribute('name') === o) return e;
      } else return e;
      if (((e = vu(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function Tm(e, t, a) {
    if (t === '') return null;
    for (; e.nodeType !== 3;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !a) ||
        ((e = vu(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function jD(e, t) {
    for (; e.nodeType !== 8;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !t) ||
        ((e = vu(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Pf(e) {
    return e.data === '$?' || e.data === '$~';
  }
  function Jf(e) {
    return e.data === '$!' || (e.data === '$?' && e.ownerDocument.readyState !== 'loading');
  }
  function wm(e, t) {
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
  var Wf = null;
  function zD(e) {
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
  function ND(e) {
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
  function LD(e, t, a) {
    switch (((t = Di(a)), e)) {
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
  function kr(e) {
    for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
    $i(e);
  }
  var hu = new Map(),
    HD = new Set();
  function vi(e) {
    return typeof e.getRootNode == 'function'
      ? e.getRootNode()
      : e.nodeType === 9
        ? e
        : e.ownerDocument;
  }
  var Pu = G.d;
  G.d = { f: Mm, r: Rm, D: jm, C: zm, L: Nm, m: Lm, X: Um, S: Hm, M: qm };
  function Mm() {
    var e = Pu.f(),
      t = ri();
    return e || t;
  }
  function Rm(e) {
    var t = oa(e);
    t !== null && t.tag === 5 && t.type === 'form' ? ed(t) : Pu.r(e);
  }
  var Ga = typeof document > 'u' ? null : document;
  function UD(e, t, a) {
    var i = Ga;
    if (i && typeof t == 'string' && t) {
      var f = iu(t);
      ((f = 'link[rel="' + e + '"][href="' + f + '"]'),
        typeof a == 'string' && (f += '[crossorigin="' + a + '"]'),
        HD.has(f) ||
          (HD.add(f),
          (e = { rel: e, crossOrigin: a, href: t }),
          i.querySelector(f) === null &&
            ((t = i.createElement('link')), Mt(t, 'link', e), yt(t), i.head.appendChild(t))));
    }
  }
  function jm(e) {
    (Pu.D(e), UD('dns-prefetch', e, null));
  }
  function zm(e, t) {
    (Pu.C(e, t), UD('preconnect', e, t));
  }
  function Nm(e, t, a) {
    Pu.L(e, t, a);
    var i = Ga;
    if (i && e && t) {
      var f = 'link[rel="preload"][as="' + iu(t) + '"]';
      t === 'image' && a && a.imageSrcSet
        ? ((f += '[imagesrcset="' + iu(a.imageSrcSet) + '"]'),
          typeof a.imageSizes == 'string' && (f += '[imagesizes="' + iu(a.imageSizes) + '"]'))
        : (f += '[href="' + iu(e) + '"]');
      var o = f;
      switch (t) {
        case 'style':
          o = Ya(e);
          break;
        case 'script':
          o = Va(e);
      }
      hu.has(o) ||
        ((e = A(
          { rel: 'preload', href: t === 'image' && a && a.imageSrcSet ? void 0 : e, as: t },
          a,
        )),
        hu.set(o, e),
        i.querySelector(f) !== null ||
          (t === 'style' && i.querySelector(_r(o))) ||
          (t === 'script' && i.querySelector(Gr(o))) ||
          ((t = i.createElement('link')), Mt(t, 'link', e), yt(t), i.head.appendChild(t)));
    }
  }
  function Lm(e, t) {
    Pu.m(e, t);
    var a = Ga;
    if (a && e) {
      var i = t && typeof t.as == 'string' ? t.as : 'script',
        f = 'link[rel="modulepreload"][as="' + iu(i) + '"][href="' + iu(e) + '"]',
        o = f;
      switch (i) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          o = Va(e);
      }
      if (
        !hu.has(o) &&
        ((e = A({ rel: 'modulepreload', href: e }, t)), hu.set(o, e), a.querySelector(f) === null)
      ) {
        switch (i) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (a.querySelector(Gr(o))) return;
        }
        ((i = a.createElement('link')), Mt(i, 'link', e), yt(i), a.head.appendChild(i));
      }
    }
  }
  function Hm(e, t, a) {
    Pu.S(e, t, a);
    var i = Ga;
    if (i && e) {
      var f = ca(i).hoistableStyles,
        o = Ya(e);
      t = t || 'default';
      var v = f.get(o);
      if (!v) {
        var p = { loading: 0, preload: null };
        if ((v = i.querySelector(_r(o)))) p.loading = 5;
        else {
          ((e = A({ rel: 'stylesheet', href: e, 'data-precedence': t }, a)),
            (a = hu.get(o)) && $f(e, a));
          var b = (v = i.createElement('link'));
          (yt(b),
            Mt(b, 'link', e),
            (b._p = new Promise(function (H, Q) {
              ((b.onload = H), (b.onerror = Q));
            })),
            b.addEventListener('load', function () {
              p.loading |= 1;
            }),
            b.addEventListener('error', function () {
              p.loading |= 2;
            }),
            (p.loading |= 4),
            hi(v, t, i));
        }
        ((v = { type: 'stylesheet', instance: v, count: 1, state: p }), f.set(o, v));
      }
    }
  }
  function Um(e, t) {
    Pu.X(e, t);
    var a = Ga;
    if (a && e) {
      var i = ca(a).hoistableScripts,
        f = Va(e),
        o = i.get(f);
      o ||
        ((o = a.querySelector(Gr(f))),
        o ||
          ((e = A({ src: e, async: !0 }, t)),
          (t = hu.get(f)) && If(e, t),
          (o = a.createElement('script')),
          yt(o),
          Mt(o, 'link', e),
          a.head.appendChild(o)),
        (o = { type: 'script', instance: o, count: 1, state: null }),
        i.set(f, o));
    }
  }
  function qm(e, t) {
    Pu.M(e, t);
    var a = Ga;
    if (a && e) {
      var i = ca(a).hoistableScripts,
        f = Va(e),
        o = i.get(f);
      o ||
        ((o = a.querySelector(Gr(f))),
        o ||
          ((e = A({ src: e, async: !0, type: 'module' }, t)),
          (t = hu.get(f)) && If(e, t),
          (o = a.createElement('script')),
          yt(o),
          Mt(o, 'link', e),
          a.head.appendChild(o)),
        (o = { type: 'script', instance: o, count: 1, state: null }),
        i.set(f, o));
    }
  }
  function qD(e, t, a, i) {
    var f = (f = Ae.current) ? vi(f) : null;
    if (!f) throw Error(l(446));
    switch (e) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof a.precedence == 'string' && typeof a.href == 'string'
          ? ((t = Ya(a.href)),
            (a = ca(f).hoistableStyles),
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
          e = Ya(a.href);
          var o = ca(f).hoistableStyles,
            v = o.get(e);
          if (
            (v ||
              ((f = f.ownerDocument || f),
              (v = {
                type: 'stylesheet',
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              o.set(e, v),
              (o = f.querySelector(_r(e))) && !o._p && ((v.instance = o), (v.state.loading = 5)),
              hu.has(e) ||
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
                hu.set(e, a),
                o || km(f, e, a, v.state))),
            t && i === null)
          )
            throw Error(l(528, ''));
          return v;
        }
        if (t && i !== null) throw Error(l(529, ''));
        return null;
      case 'script':
        return (
          (t = a.async),
          (a = a.src),
          typeof a == 'string' && t && typeof t != 'function' && typeof t != 'symbol'
            ? ((t = Va(a)),
              (a = ca(f).hoistableScripts),
              (i = a.get(t)),
              i || ((i = { type: 'script', instance: null, count: 0, state: null }), a.set(t, i)),
              i)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(l(444, e));
    }
  }
  function Ya(e) {
    return 'href="' + iu(e) + '"';
  }
  function _r(e) {
    return 'link[rel="stylesheet"][' + e + ']';
  }
  function kD(e) {
    return A({}, e, { 'data-precedence': e.precedence, precedence: null });
  }
  function km(e, t, a, i) {
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
        yt(t),
        e.head.appendChild(t));
  }
  function Va(e) {
    return '[src="' + iu(e) + '"]';
  }
  function Gr(e) {
    return 'script[async]' + e;
  }
  function _D(e, t, a) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case 'style':
          var i = e.querySelector('style[data-href~="' + iu(a.href) + '"]');
          if (i) return ((t.instance = i), yt(i), i);
          var f = A({}, a, {
            'data-href': a.href,
            'data-precedence': a.precedence,
            href: null,
            precedence: null,
          });
          return (
            (i = (e.ownerDocument || e).createElement('style')),
            yt(i),
            Mt(i, 'style', f),
            hi(i, a.precedence, e),
            (t.instance = i)
          );
        case 'stylesheet':
          f = Ya(a.href);
          var o = e.querySelector(_r(f));
          if (o) return ((t.state.loading |= 4), (t.instance = o), yt(o), o);
          ((i = kD(a)),
            (f = hu.get(f)) && $f(i, f),
            (o = (e.ownerDocument || e).createElement('link')),
            yt(o));
          var v = o;
          return (
            (v._p = new Promise(function (p, b) {
              ((v.onload = p), (v.onerror = b));
            })),
            Mt(o, 'link', i),
            (t.state.loading |= 4),
            hi(o, a.precedence, e),
            (t.instance = o)
          );
        case 'script':
          return (
            (o = Va(a.src)),
            (f = e.querySelector(Gr(o)))
              ? ((t.instance = f), yt(f), f)
              : ((i = a),
                (f = hu.get(o)) && ((i = A({}, a)), If(i, f)),
                (e = e.ownerDocument || e),
                (f = e.createElement('script')),
                yt(f),
                Mt(f, 'link', i),
                e.head.appendChild(f),
                (t.instance = f))
          );
        case 'void':
          return null;
        default:
          throw Error(l(443, t.type));
      }
    else
      t.type === 'stylesheet' &&
        (t.state.loading & 4) === 0 &&
        ((i = t.instance), (t.state.loading |= 4), hi(i, a.precedence, e));
    return t.instance;
  }
  function hi(e, t, a) {
    for (
      var i = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        f = i.length ? i[i.length - 1] : null,
        o = f,
        v = 0;
      v < i.length;
      v++
    ) {
      var p = i[v];
      if (p.dataset.precedence === t) o = p;
      else if (o !== f) break;
    }
    o
      ? o.parentNode.insertBefore(e, o.nextSibling)
      : ((t = a.nodeType === 9 ? a.head : a), t.insertBefore(e, t.firstChild));
  }
  function $f(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function If(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var gi = null;
  function GD(e, t, a) {
    if (gi === null) {
      var i = new Map(),
        f = (gi = new Map());
      f.set(a, i);
    } else ((f = gi), (i = f.get(a)), i || ((i = new Map()), f.set(a, i)));
    if (i.has(e)) return i;
    for (i.set(e, null), a = a.getElementsByTagName(e), f = 0; f < a.length; f++) {
      var o = a[f];
      if (
        !(o[ar] || o[Ot] || (e === 'link' && o.getAttribute('rel') === 'stylesheet')) &&
        o.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var v = o.getAttribute(t) || '';
        v = e + v;
        var p = i.get(v);
        p ? p.push(o) : i.set(v, [o]);
      }
    }
    return i;
  }
  function YD(e, t, a) {
    ((e = e.ownerDocument || e),
      e.head.insertBefore(a, t === 'title' ? e.querySelector('head > title') : null));
  }
  function _m(e, t, a) {
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
  function VD(e) {
    return !(e.type === 'stylesheet' && (e.state.loading & 3) === 0);
  }
  function Gm(e, t, a, i) {
    if (
      a.type === 'stylesheet' &&
      (typeof i.media != 'string' || matchMedia(i.media).matches !== !1) &&
      (a.state.loading & 4) === 0
    ) {
      if (a.instance === null) {
        var f = Ya(i.href),
          o = t.querySelector(_r(f));
        if (o) {
          ((t = o._p),
            t !== null &&
              typeof t == 'object' &&
              typeof t.then == 'function' &&
              (e.count++, (e = mi.bind(e)), t.then(e, e)),
            (a.state.loading |= 4),
            (a.instance = o),
            yt(o));
          return;
        }
        ((o = t.ownerDocument || t),
          (i = kD(i)),
          (f = hu.get(f)) && $f(i, f),
          (o = o.createElement('link')),
          yt(o));
        var v = o;
        ((v._p = new Promise(function (p, b) {
          ((v.onload = p), (v.onerror = b));
        })),
          Mt(o, 'link', i),
          (a.instance = o));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(a, t),
        (t = a.state.preload) &&
          (a.state.loading & 3) === 0 &&
          (e.count++,
          (a = mi.bind(e)),
          t.addEventListener('load', a),
          t.addEventListener('error', a)));
    }
  }
  var eo = 0;
  function Ym(e, t) {
    return (
      e.stylesheets && e.count === 0 && pi(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (a) {
            var i = setTimeout(function () {
              if ((e.stylesheets && pi(e, e.stylesheets), e.unsuspend)) {
                var o = e.unsuspend;
                ((e.unsuspend = null), o());
              }
            }, 6e4 + t);
            0 < e.imgBytes && eo === 0 && (eo = 62500 * ym());
            var f = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1),
                  e.count === 0 && (e.stylesheets && pi(e, e.stylesheets), e.unsuspend))
                ) {
                  var o = e.unsuspend;
                  ((e.unsuspend = null), o());
                }
              },
              (e.imgBytes > eo ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = a),
              function () {
                ((e.unsuspend = null), clearTimeout(i), clearTimeout(f));
              }
            );
          }
        : null
    );
  }
  function mi() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) pi(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        ((this.unsuspend = null), e());
      }
    }
  }
  var Ci = null;
  function pi(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++, (Ci = new Map()), t.forEach(Vm, e), (Ci = null), mi.call(e)));
  }
  function Vm(e, t) {
    if (!(t.state.loading & 4)) {
      var a = Ci.get(e);
      if (a) var i = a.get(null);
      else {
        ((a = new Map()), Ci.set(e, a));
        for (
          var f = e.querySelectorAll('link[data-precedence],style[data-precedence]'), o = 0;
          o < f.length;
          o++
        ) {
          var v = f[o];
          (v.nodeName === 'LINK' || v.getAttribute('media') !== 'not all') &&
            (a.set(v.dataset.precedence, v), (i = v));
        }
        i && a.set(null, i);
      }
      ((f = t.instance),
        (v = f.getAttribute('data-precedence')),
        (o = a.get(v) || i),
        o === i && a.set(null, f),
        a.set(v, f),
        this.count++,
        (i = mi.bind(this)),
        f.addEventListener('load', i),
        f.addEventListener('error', i),
        o
          ? o.parentNode.insertBefore(f, o.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(f, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var Yr = {
    $$typeof: N,
    Provider: null,
    Consumer: null,
    _currentValue: De,
    _currentValue2: De,
    _threadCount: 0,
  };
  function Xm(e, t, a, i, f, o, v, p, b) {
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
      (this.expirationTimes = Zi(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Zi(0)),
      (this.hiddenUpdates = Zi(null)),
      (this.identifierPrefix = i),
      (this.onUncaughtError = f),
      (this.onCaughtError = o),
      (this.onRecoverableError = v),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = b),
      (this.incompleteTransitions = new Map()));
  }
  function XD(e, t, a, i, f, o, v, p, b, H, Q, te) {
    return (
      (e = new Xm(e, t, a, v, b, H, Q, te, p)),
      (t = 1),
      o === !0 && (t |= 24),
      (o = It(3, null, null, t)),
      (e.current = o),
      (o.stateNode = e),
      (t = Rs()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (o.memoizedState = { element: i, isDehydrated: a, cache: t }),
      Ls(o),
      e
    );
  }
  function KD(e) {
    return e ? ((e = Aa), e) : Aa;
  }
  function QD(e, t, a, i, f, o) {
    ((f = KD(f)),
      i.context === null ? (i.context = f) : (i.pendingContext = f),
      (i = Dn(t)),
      (i.payload = { element: a }),
      (o = o === void 0 ? null : o),
      o !== null && (i.callback = o),
      (a = vn(e, i, t)),
      a !== null && (Jt(a, e, t), Ar(a, e, t)));
  }
  function ZD(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function to(e, t) {
    (ZD(e, t), (e = e.alternate) && ZD(e, t));
  }
  function PD(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = _n(e, 67108864);
      (t !== null && Jt(t, e, 67108864), to(e, 67108864));
    }
  }
  function JD(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = au();
      t = Pi(t);
      var a = _n(e, t);
      (a !== null && Jt(a, e, t), to(e, t));
    }
  }
  var Ei = !0;
  function Km(e, t, a, i) {
    var f = R.T;
    R.T = null;
    var o = G.p;
    try {
      ((G.p = 2), uo(e, t, a, i));
    } finally {
      ((G.p = o), (R.T = f));
    }
  }
  function Qm(e, t, a, i) {
    var f = R.T;
    R.T = null;
    var o = G.p;
    try {
      ((G.p = 8), uo(e, t, a, i));
    } finally {
      ((G.p = o), (R.T = f));
    }
  }
  function uo(e, t, a, i) {
    if (Ei) {
      var f = no(i);
      if (f === null) (Gf(e, t, i, Ai, a), $D(e, i));
      else if (Pm(f, e, t, a, i)) i.stopPropagation();
      else if (($D(e, i), t & 4 && -1 < Zm.indexOf(e))) {
        for (; f !== null;) {
          var o = oa(f);
          if (o !== null)
            switch (o.tag) {
              case 3:
                if (((o = o.stateNode), o.current.memoizedState.isDehydrated)) {
                  var v = Ln(o.pendingLanes);
                  if (v !== 0) {
                    var p = o;
                    for (p.pendingLanes |= 2, p.entangledLanes |= 2; v;) {
                      var b = 1 << (31 - Ut(v));
                      ((p.entanglements[1] |= b), (v &= ~b));
                    }
                    (Su(o), (Xe & 6) === 0 && ((ni = ot() + 500), Hr(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((p = _n(o, 2)), p !== null && Jt(p, o, 2), ri(), to(o, 2));
            }
          if (((o = no(i)), o === null && Gf(e, t, i, Ai, a), o === f)) break;
          f = o;
        }
        f !== null && i.stopPropagation();
      } else Gf(e, t, i, null, a);
    }
  }
  function no(e) {
    return ((e = as(e)), ao(e));
  }
  var Ai = null;
  function ao(e) {
    if (((Ai = null), (e = fa(e)), e !== null)) {
      var t = c(e);
      if (t === null) e = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (((e = D(t)), e !== null)) return e;
          e = null;
        } else if (a === 31) {
          if (((e = d(t)), e !== null)) return e;
          e = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ((Ai = e), null);
  }
  function WD(e) {
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
        switch (nn()) {
          case Gt:
            return 2;
          case ru:
            return 8;
          case Yt:
          case Ft:
            return 32;
          case Et:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ro = !1,
    Fn = null,
    Sn = null,
    On = null,
    Vr = new Map(),
    Xr = new Map(),
    xn = [],
    Zm =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' ',
      );
  function $D(e, t) {
    switch (e) {
      case 'focusin':
      case 'focusout':
        Fn = null;
        break;
      case 'dragenter':
      case 'dragleave':
        Sn = null;
        break;
      case 'mouseover':
      case 'mouseout':
        On = null;
        break;
      case 'pointerover':
      case 'pointerout':
        Vr.delete(t.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        Xr.delete(t.pointerId);
    }
  }
  function Kr(e, t, a, i, f, o) {
    return e === null || e.nativeEvent !== o
      ? ((e = {
          blockedOn: t,
          domEventName: a,
          eventSystemFlags: i,
          nativeEvent: o,
          targetContainers: [f],
        }),
        t !== null && ((t = oa(t)), t !== null && PD(t)),
        e)
      : ((e.eventSystemFlags |= i),
        (t = e.targetContainers),
        f !== null && t.indexOf(f) === -1 && t.push(f),
        e);
  }
  function Pm(e, t, a, i, f) {
    switch (t) {
      case 'focusin':
        return ((Fn = Kr(Fn, e, t, a, i, f)), !0);
      case 'dragenter':
        return ((Sn = Kr(Sn, e, t, a, i, f)), !0);
      case 'mouseover':
        return ((On = Kr(On, e, t, a, i, f)), !0);
      case 'pointerover':
        var o = f.pointerId;
        return (Vr.set(o, Kr(Vr.get(o) || null, e, t, a, i, f)), !0);
      case 'gotpointercapture':
        return ((o = f.pointerId), Xr.set(o, Kr(Xr.get(o) || null, e, t, a, i, f)), !0);
    }
    return !1;
  }
  function ID(e) {
    var t = fa(e.target);
    if (t !== null) {
      var a = c(t);
      if (a !== null) {
        if (((t = a.tag), t === 13)) {
          if (((t = D(a)), t !== null)) {
            ((e.blockedOn = t),
              Dc(e.priority, function () {
                JD(a);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = d(a)), t !== null)) {
            ((e.blockedOn = t),
              Dc(e.priority, function () {
                JD(a);
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
  function Bi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
      var a = no(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var i = new a.constructor(a.type, a);
        ((ns = i), a.target.dispatchEvent(i), (ns = null));
      } else return ((t = oa(a)), t !== null && PD(t), (e.blockedOn = a), !1);
      t.shift();
    }
    return !0;
  }
  function ev(e, t, a) {
    Bi(e) && a.delete(t);
  }
  function Jm() {
    ((ro = !1),
      Fn !== null && Bi(Fn) && (Fn = null),
      Sn !== null && Bi(Sn) && (Sn = null),
      On !== null && Bi(On) && (On = null),
      Vr.forEach(ev),
      Xr.forEach(ev));
  }
  function yi(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      ro || ((ro = !0), n.unstable_scheduleCallback(n.unstable_NormalPriority, Jm)));
  }
  var bi = null;
  function tv(e) {
    bi !== e &&
      ((bi = e),
      n.unstable_scheduleCallback(n.unstable_NormalPriority, function () {
        bi === e && (bi = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t],
            i = e[t + 1],
            f = e[t + 2];
          if (typeof i != 'function') {
            if (ao(i || a) === null) continue;
            break;
          }
          var o = oa(a);
          o !== null &&
            (e.splice(t, 3),
            (t -= 3),
            uf(o, { pending: !0, data: f, method: a.method, action: i }, i, f));
        }
      }));
  }
  function Xa(e) {
    function t(b) {
      return yi(b, e);
    }
    (Fn !== null && yi(Fn, e),
      Sn !== null && yi(Sn, e),
      On !== null && yi(On, e),
      Vr.forEach(t),
      Xr.forEach(t));
    for (var a = 0; a < xn.length; a++) {
      var i = xn[a];
      i.blockedOn === e && (i.blockedOn = null);
    }
    for (; 0 < xn.length && ((a = xn[0]), a.blockedOn === null);)
      (ID(a), a.blockedOn === null && xn.shift());
    if (((a = (e.ownerDocument || e).$$reactFormReplay), a != null))
      for (i = 0; i < a.length; i += 3) {
        var f = a[i],
          o = a[i + 1],
          v = f[Vt] || null;
        if (typeof o == 'function') v || tv(a);
        else if (v) {
          var p = null;
          if (o && o.hasAttribute('formAction')) {
            if (((f = o), (v = o[Vt] || null))) p = v.formAction;
            else if (ao(f) !== null) continue;
          } else p = v.action;
          (typeof p == 'function' ? (a[i + 1] = p) : (a.splice(i, 3), (i -= 3)), tv(a));
        }
      }
  }
  function uv() {
    function e(o) {
      o.canIntercept &&
        o.info === 'react-transition' &&
        o.intercept({
          handler: function () {
            return new Promise(function (v) {
              return (f = v);
            });
          },
          focusReset: 'manual',
          scroll: 'manual',
        });
    }
    function t() {
      (f !== null && (f(), (f = null)), i || setTimeout(a, 20));
    }
    function a() {
      if (!i && !navigation.transition) {
        var o = navigation.currentEntry;
        o &&
          o.url != null &&
          navigation.navigate(o.url, {
            state: o.getState(),
            info: 'react-transition',
            history: 'replace',
          });
      }
    }
    if (typeof navigation == 'object') {
      var i = !1,
        f = null;
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
            f !== null && (f(), (f = null)));
        }
      );
    }
  }
  function lo(e) {
    this._internalRoot = e;
  }
  ((Fi.prototype.render = lo.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(l(409));
      var a = t.current,
        i = au();
      QD(a, i, e, t, null, null);
    }),
    (Fi.prototype.unmount = lo.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (QD(e.current, 2, null, e, null, null), ri(), (t[sa] = null));
        }
      }));
  function Fi(e) {
    this._internalRoot = e;
  }
  Fi.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = dc();
      e = { blockedOn: null, target: e, priority: t };
      for (var a = 0; a < xn.length && t !== 0 && t < xn[a].priority; a++);
      (xn.splice(a, 0, e), a === 0 && ID(e));
    }
  };
  var nv = u.version;
  if (nv !== '19.2.7') throw Error(l(527, nv, '19.2.7'));
  G.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == 'function'
        ? Error(l(188))
        : ((e = Object.keys(e).join(',')), Error(l(268, e)));
    return ((e = h(t)), (e = e !== null ? E(e) : null), (e = e === null ? null : e.stateNode), e);
  };
  var Wm = {
    bundleType: 0,
    version: '19.2.7',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: R,
    reconcilerVersion: '19.2.7',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var Si = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Si.isDisabled && Si.supportsFiber)
      try {
        ((an = Si.inject(Wm)), (St = Si));
      } catch {}
  }
  return (
    (Zr.createRoot = function (e, t) {
      if (!s(e)) throw Error(l(299));
      var a = !1,
        i = '',
        f = od,
        o = cd,
        v = dd;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (a = !0),
          t.identifierPrefix !== void 0 && (i = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (f = t.onUncaughtError),
          t.onCaughtError !== void 0 && (o = t.onCaughtError),
          t.onRecoverableError !== void 0 && (v = t.onRecoverableError)),
        (t = XD(e, 1, !1, null, null, a, i, null, f, o, v, uv)),
        (e[sa] = t.current),
        _f(e),
        new lo(t)
      );
    }),
    (Zr.hydrateRoot = function (e, t, a) {
      if (!s(e)) throw Error(l(299));
      var i = !1,
        f = '',
        o = od,
        v = cd,
        p = dd,
        b = null;
      return (
        a != null &&
          (a.unstable_strictMode === !0 && (i = !0),
          a.identifierPrefix !== void 0 && (f = a.identifierPrefix),
          a.onUncaughtError !== void 0 && (o = a.onUncaughtError),
          a.onCaughtError !== void 0 && (v = a.onCaughtError),
          a.onRecoverableError !== void 0 && (p = a.onRecoverableError),
          a.formState !== void 0 && (b = a.formState)),
        (t = XD(e, 1, !0, t, a ?? null, i, f, b, o, v, p, uv)),
        (t.context = KD(null)),
        (a = t.current),
        (i = au()),
        (i = Pi(i)),
        (f = Dn(i)),
        (f.callback = null),
        vn(a, f, i),
        (a = i),
        (t.current.lanes = a),
        nr(t, a),
        Su(t),
        (e[sa] = t.current),
        _f(e),
        new Fi(t)
      );
    }),
    (Zr.version = '19.2.7'),
    Zr
  );
}
var Dv;
function lC() {
  if (Dv) return fo.exports;
  Dv = 1;
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
  return (n(), (fo.exports = rC()), fo.exports);
}
var iC = lC(),
  sC = {
    transform(n, u) {
      var { current: r, affinity: l } = n;
      if (r != null) {
        var s = S.transform(r, u, { affinity: l });
        ((n.current = s), s == null && n.unref());
      }
    },
  },
  fC = {
    transform(n, u) {
      var { current: r, affinity: l } = n;
      if (r != null) {
        var s = Qe.transform(r, u, { affinity: l });
        ((n.current = s), s == null && n.unref());
      }
    },
  },
  oC = {
    transform(n, u) {
      var { current: r, affinity: l } = n;
      if (r != null) {
        var s = I.transform(r, u, { affinity: l });
        ((n.current = s), s == null && n.unref());
      }
    },
  },
  _i = new WeakMap(),
  Gi = new WeakMap(),
  Jr = new WeakMap(),
  Ph = new WeakMap(),
  vv = new WeakMap(),
  hv = new WeakMap(),
  gv = new WeakMap(),
  S = {
    ancestors(n) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        { reverse: r = !1 } = u,
        l = S.levels(n, u);
      return (r ? (l = l.slice(1)) : (l = l.slice(0, -1)), l);
    },
    common(n, u) {
      for (var r = [], l = 0; l < n.length && l < u.length; l++) {
        var s = n[l],
          c = u[l];
        if (typeof s != 'number' || typeof c != 'number')
          throw new Error('Got non-numeric path index');
        if (s !== c) break;
        r.push(s);
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
        s = u.slice(0, r),
        c = n[r],
        D = u[r];
      return S.equals(l, s) && c > D;
    },
    endsAt(n, u) {
      var r = n.length,
        l = n.slice(0, r),
        s = u.slice(0, r);
      return S.equals(l, s);
    },
    endsBefore(n, u) {
      var r = n.length - 1,
        l = n.slice(0, r),
        s = u.slice(0, r),
        c = n[r],
        D = u[r];
      return S.equals(l, s) && c < D;
    },
    equals(n, u) {
      return n.length === u.length && n.every((r, l) => r === u[l]);
    },
    hasPrevious(n) {
      return n[n.length - 1] > 0;
    },
    isAfter(n, u) {
      return S.compare(n, u) === 1;
    },
    isAncestor(n, u) {
      return n.length < u.length && S.compare(n, u) === 0;
    },
    isBefore(n, u) {
      return S.compare(n, u) === -1;
    },
    isChild(n, u) {
      return n.length === u.length + 1 && S.compare(n, u) === 0;
    },
    isCommon(n, u) {
      return n.length <= u.length && S.compare(n, u) === 0;
    },
    isDescendant(n, u) {
      return n.length > u.length && S.compare(n, u) === 0;
    },
    isParent(n, u) {
      return n.length + 1 === u.length && S.compare(n, u) === 0;
    },
    isPath(n) {
      return Array.isArray(n) && n.every((u) => typeof u == 'number');
    },
    isSibling(n, u) {
      if (n.length !== u.length) return !1;
      var r = n.slice(0, -1),
        l = u.slice(0, -1),
        s = n[n.length - 1],
        c = u[u.length - 1];
      return s !== c && S.equals(r, l);
    },
    levels(n) {
      for (
        var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
          { reverse: r = !1 } = u,
          l = [],
          s = 0;
        s <= n.length;
        s++
      )
        l.push(n.slice(0, s));
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
      if (!S.isAncestor(u, n) && !S.equals(n, u))
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
        { affinity: s = 'forward' } = r;
      if (n.length === 0) return l;
      switch (u.type) {
        case 'insert_node': {
          var { path: c } = u;
          (S.equals(c, l) || S.endsBefore(c, l) || S.isAncestor(c, l)) && (l[c.length - 1] += 1);
          break;
        }
        case 'remove_node': {
          var { path: D } = u;
          if (S.equals(D, l) || S.isAncestor(D, l)) return null;
          S.endsBefore(D, l) && (l[D.length - 1] -= 1);
          break;
        }
        case 'merge_node': {
          var { path: d, position: g } = u;
          S.equals(d, l) || S.endsBefore(d, l)
            ? (l[d.length - 1] -= 1)
            : S.isAncestor(d, l) && ((l[d.length - 1] -= 1), (l[d.length] += g));
          break;
        }
        case 'split_node': {
          var { path: h, position: E } = u;
          if (S.equals(h, l)) {
            if (s === 'forward') l[l.length - 1] += 1;
            else if (s !== 'backward') return null;
          } else
            S.endsBefore(h, l)
              ? (l[h.length - 1] += 1)
              : S.isAncestor(h, l) &&
                n[h.length] >= E &&
                ((l[h.length - 1] += 1), (l[h.length] -= E));
          break;
        }
        case 'move_node': {
          var { path: A, newPath: B } = u;
          if (S.equals(A, B)) return l;
          if (S.isAncestor(A, l) || S.equals(A, l)) {
            var F = B.slice();
            return (
              S.endsBefore(A, B) && A.length < B.length && (F[A.length - 1] -= 1),
              F.concat(l.slice(A.length))
            );
          } else
            S.isSibling(A, B) && (S.isAncestor(B, l) || S.equals(B, l))
              ? S.endsBefore(A, l)
                ? (l[A.length - 1] -= 1)
                : (l[A.length - 1] += 1)
              : S.endsBefore(B, l) || S.equals(B, l) || S.isAncestor(B, l)
                ? (S.endsBefore(A, l) && (l[A.length - 1] -= 1), (l[B.length - 1] += 1))
                : S.endsBefore(A, l) &&
                  (S.equals(B, l) && (l[B.length - 1] += 1), (l[A.length - 1] -= 1));
          break;
        }
      }
      return l;
    },
  };
function ul(n) {
  '@babel/helpers - typeof';
  return (
    (ul =
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
    ul(n)
  );
}
function cC(n, u) {
  if (ul(n) !== 'object' || n === null) return n;
  var r = n[Symbol.toPrimitive];
  if (r !== void 0) {
    var l = r.call(n, u);
    if (ul(l) !== 'object') return l;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (u === 'string' ? String : Number)(n);
}
function dC(n) {
  var u = cC(n, 'string');
  return ul(u) === 'symbol' ? u : String(u);
}
function zt(n, u, r) {
  return (
    (u = dC(u)),
    u in n
      ? Object.defineProperty(n, u, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (n[u] = r),
    n
  );
}
function DC(n, u) {
  if (n == null) return {};
  var r = {},
    l = Object.keys(n),
    s,
    c;
  for (c = 0; c < l.length; c++) ((s = l[c]), !(u.indexOf(s) >= 0) && (r[s] = n[s]));
  return r;
}
function en(n, u) {
  if (n == null) return {};
  var r = DC(n, u),
    l,
    s;
  if (Object.getOwnPropertySymbols) {
    var c = Object.getOwnPropertySymbols(n);
    for (s = 0; s < c.length; s++)
      ((l = c[s]),
        !(u.indexOf(l) >= 0) && Object.prototype.propertyIsEnumerable.call(n, l) && (r[l] = n[l]));
  }
  return r;
}
var vC = ['anchor', 'focus'];
function mv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function hC(n) {
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
var I = {
    edges(n) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        { reverse: r = !1 } = u,
        { anchor: l, focus: s } = n;
      return I.isBackward(n) === r ? [l, s] : [s, l];
    },
    end(n) {
      var [, u] = I.edges(n);
      return u;
    },
    equals(n, u) {
      return Qe.equals(n.anchor, u.anchor) && Qe.equals(n.focus, u.focus);
    },
    surrounds(n, u) {
      var r = I.intersection(n, u);
      return r ? I.equals(r, u) : !1;
    },
    includes(n, u) {
      if (Me.isRange(u)) {
        if (I.includes(n, u.anchor) || I.includes(n, u.focus)) return !0;
        var [r, l] = I.edges(n),
          [s, c] = I.edges(u);
        return Qe.isBefore(r, s) && Qe.isAfter(l, c);
      }
      var [D, d] = I.edges(n),
        g = !1,
        h = !1;
      return (
        Me.isPoint(u)
          ? ((g = Qe.compare(u, D) >= 0), (h = Qe.compare(u, d) <= 0))
          : ((g = S.compare(u, D.path) >= 0), (h = S.compare(u, d.path) <= 0)),
        g && h
      );
    },
    intersection(n, u) {
      var { anchor: r, focus: l } = n,
        s = en(n, vC),
        [c, D] = I.edges(n),
        [d, g] = I.edges(u),
        h = Qe.isBefore(c, d) ? d : c,
        E = Qe.isBefore(D, g) ? D : g;
      return Qe.isBefore(E, h) ? null : hC({ anchor: h, focus: E }, s);
    },
    isBackward(n) {
      var { anchor: u, focus: r } = n;
      return Qe.isAfter(u, r);
    },
    isCollapsed(n) {
      var { anchor: u, focus: r } = n;
      return Qe.equals(u, r);
    },
    isExpanded(n) {
      return !I.isCollapsed(n);
    },
    isForward(n) {
      return !I.isBackward(n);
    },
    isRange(n) {
      return Lt(n) && Qe.isPoint(n.anchor) && Qe.isPoint(n.focus);
    },
    *points(n) {
      (yield [n.anchor, 'anchor'], yield [n.focus, 'focus']);
    },
    start(n) {
      var [u] = I.edges(n);
      return u;
    },
    transform(n, u) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n === null) return null;
      var { affinity: l = 'inward' } = r,
        s,
        c;
      if (l === 'inward') {
        var D = I.isCollapsed(n);
        I.isForward(n)
          ? ((s = 'forward'), (c = D ? s : 'backward'))
          : ((s = 'backward'), (c = D ? s : 'forward'));
      } else
        l === 'outward'
          ? I.isForward(n)
            ? ((s = 'backward'), (c = 'forward'))
            : ((s = 'forward'), (c = 'backward'))
          : ((s = l), (c = l));
      var d = Qe.transform(n.anchor, u, { affinity: s }),
        g = Qe.transform(n.focus, u, { affinity: c });
      return !d || !g ? null : { anchor: d, focus: g };
    },
  },
  Cv = function (u) {
    var { deep: r = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!Lt(u)) return !1;
    var l = typeof u.apply == 'function';
    if (l) return !1;
    var s = r ? T.isNodeList(u.children) : Array.isArray(u.children);
    return s;
  },
  Pa = {
    isAncestor(n) {
      var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return Lt(n) && T.isNodeList(n.children, { deep: u });
    },
    isElement: Cv,
    isElementList(n) {
      var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return Array.isArray(n) && n.every((r) => Pa.isElement(r, { deep: u }));
    },
    isElementProps(n) {
      return n.children !== void 0;
    },
    isElementType: function (u, r) {
      var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'type';
      return Cv(u) && u[l] === r;
    },
    matches(n, u) {
      for (var r in u) if (r !== 'children' && n[r] !== u[r]) return !1;
      return !0;
    },
  },
  gC = ['text'],
  mC = ['children'];
function pv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function xi(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? pv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : pv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var T = {
  ancestor(n, u) {
    var r = T.get(n, u);
    if (T.isText(r))
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
      for (var l of S.ancestors(u, r)) {
        var s = T.ancestor(n, l),
          c = [s, l];
        yield c;
      }
    })();
  },
  child(n, u) {
    if (T.isText(n))
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
          s = T.ancestor(n, u),
          { children: c } = s,
          D = l ? c.length - 1 : 0;
        l ? D >= 0 : D < c.length;
      ) {
        var d = T.child(s, D),
          g = u.concat(D);
        (yield [d, g], (D = l ? D - 1 : D + 1));
      }
    })();
  },
  common(n, u, r) {
    var l = S.common(u, r),
      s = T.get(n, l);
    return [s, l];
  },
  descendant(n, u) {
    var r = T.get(n, u);
    if (T.isEditor(r))
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
      for (var [r, l] of T.nodes(n, u)) l.length !== 0 && (yield [r, l]);
    })();
  },
  elements(n) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [r, l] of T.nodes(n, u)) T.isElement(r) && (yield [r, l]);
    })();
  },
  extractProps(n) {
    if (T.isText(n)) {
      var { text: u } = n,
        r = en(n, gC);
      return r;
    } else {
      var { children: l } = n,
        r = en(n, mC);
      return r;
    }
  },
  first(n, u) {
    for (var r = u.slice(), l = T.get(n, r); l && !(T.isText(l) || l.children.length === 0);)
      ((l = l.children[0]), r.push(0));
    return [l, r];
  },
  fragment(n, u) {
    var r = { children: n.children },
      [l, s] = I.edges(u),
      c = T.nodes(r, {
        reverse: !0,
        pass: (g) => {
          var [, h] = g;
          return !I.includes(u, h);
        },
      }),
      D = function () {
        if (!I.includes(u, d)) {
          var h = d[d.length - 1];
          ta(r, S.parent(d), (E) => Ho(E, h, 1));
        }
        (S.equals(d, s.path) &&
          Vi(r, d, (E) => {
            var A = E.text.slice(0, s.offset);
            return xi(xi({}, E), {}, { text: A });
          }),
          S.equals(d, l.path) &&
            Vi(r, d, (E) => {
              var A = E.text.slice(l.offset);
              return xi(xi({}, E), {}, { text: A });
            }));
      };
    for (var [, d] of c) D();
    return r.children;
  },
  get(n, u) {
    var r = T.getIf(n, u);
    if (r === void 0)
      throw new Error(
        'Cannot find a descendant at path ['.concat(u, '] in node: ').concat(Bt.stringify(n)),
      );
    return r;
  },
  getIf(n, u) {
    for (var r = n, l = 0; l < u.length; l++) {
      var s = u[l];
      if (typeof s != 'number') throw new Error('Got non-numeric path index');
      if (T.isText(r) || !r.children[s]) return;
      r = r.children[s];
    }
    return r;
  },
  has(n, u) {
    for (var r = n, l = 0; l < u.length; l++) {
      var s = u[l];
      if (typeof s != 'number') throw new Error('Got non-numeric path index');
      if (T.isText(r) || !r.children[s]) return !1;
      r = r.children[s];
    }
    return !0;
  },
  isAncestor(n) {
    return !T.isText(n);
  },
  isEditor(n) {
    return typeof n.apply == 'function';
  },
  isElement(n) {
    return Array.isArray(n.children) && typeof n.apply != 'function';
  },
  isNode(n) {
    var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Iu.isText(n) || Pa.isElement(n, { deep: u }) || C.isEditor(n, { deep: u });
  },
  isNodeList(n) {
    var { deep: u = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Array.isArray(n) && n.every((r) => T.isNode(r, { deep: u }));
  },
  isText(n) {
    return typeof n.text == 'string';
  },
  last(n, u) {
    for (var r = u.slice(), l = T.get(n, r); l && !(T.isText(l) || l.children.length === 0);) {
      var s = l.children.length - 1;
      ((l = l.children[s]), r.push(s));
    }
    return [l, r];
  },
  leaf(n, u) {
    var r = T.get(n, u);
    if (!T.isText(r))
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
      for (var l of S.levels(u, r)) {
        var s = T.get(n, l);
        yield [s, l];
      }
    })();
  },
  matches(n, u) {
    return (
      (T.isElement(n) && Pa.isElementProps(u) && Pa.matches(n, u)) ||
      (T.isText(n) && Iu.isTextProps(u) && Iu.matches(n, u))
    );
  },
  nodes(n) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (
        var { pass: r, reverse: l = !1 } = u,
          { from: s = [], to: c } = u,
          D = new Set(),
          d = [],
          g = n;
        !(c && (l ? S.isBefore(d, c) : S.isAfter(d, c)));
      ) {
        if (
          (D.has(g) || (yield [g, d]),
          !D.has(g) && !T.isText(g) && g.children.length !== 0 && (r == null || r([g, d]) === !1))
        ) {
          D.add(g);
          var h = l ? g.children.length - 1 : 0;
          (S.isAncestor(d, s) && (h = s[d.length]), (d = d.concat(h)), (g = T.get(n, d)));
          continue;
        }
        if (d.length === 0) break;
        if (!l) {
          var E = S.next(d);
          if (T.has(n, E)) {
            ((d = E), (g = T.get(n, d)));
            continue;
          }
        }
        if (l && d[d.length - 1] !== 0) {
          var A = S.previous(d);
          ((d = A), (g = T.get(n, d)));
          continue;
        }
        ((d = S.parent(d)), (g = T.get(n, d)), D.add(g));
      }
    })();
  },
  parent(n, u) {
    var r = S.parent(u),
      l = T.get(n, r);
    if (T.isText(l))
      throw new Error(
        'Cannot get the parent of path ['.concat(u, '] because it does not exist in the root.'),
      );
    return l;
  },
  string(n) {
    return T.isText(n) ? n.text : n.children.map(T.string).join('');
  },
  texts(n) {
    var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [r, l] of T.nodes(n, u)) T.isText(r) && (yield [r, l]);
    })();
  },
};
function Ev(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function it(n) {
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
var jn = {
    isNodeOperation(n) {
      return jn.isOperation(n) && n.type.endsWith('_node');
    },
    isOperation(n) {
      if (!Lt(n)) return !1;
      switch (n.type) {
        case 'insert_node':
          return S.isPath(n.path) && T.isNode(n.node);
        case 'insert_text':
          return typeof n.offset == 'number' && typeof n.text == 'string' && S.isPath(n.path);
        case 'merge_node':
          return typeof n.position == 'number' && S.isPath(n.path) && Lt(n.properties);
        case 'move_node':
          return S.isPath(n.path) && S.isPath(n.newPath);
        case 'remove_node':
          return S.isPath(n.path) && T.isNode(n.node);
        case 'remove_text':
          return typeof n.offset == 'number' && typeof n.text == 'string' && S.isPath(n.path);
        case 'set_node':
          return S.isPath(n.path) && Lt(n.properties) && Lt(n.newProperties);
        case 'set_selection':
          return (
            (n.properties === null && I.isRange(n.newProperties)) ||
            (n.newProperties === null && I.isRange(n.properties)) ||
            (Lt(n.properties) && Lt(n.newProperties))
          );
        case 'split_node':
          return S.isPath(n.path) && typeof n.position == 'number' && Lt(n.properties);
        default:
          return !1;
      }
    },
    isOperationList(n) {
      return Array.isArray(n) && n.every((u) => jn.isOperation(u));
    },
    isSelectionOperation(n) {
      return jn.isOperation(n) && n.type.endsWith('_selection');
    },
    isTextOperation(n) {
      return jn.isOperation(n) && n.type.endsWith('_text');
    },
    inverse(n) {
      switch (n.type) {
        case 'insert_node':
          return it(it({}, n), {}, { type: 'remove_node' });
        case 'insert_text':
          return it(it({}, n), {}, { type: 'remove_text' });
        case 'merge_node':
          return it(it({}, n), {}, { type: 'split_node', path: S.previous(n.path) });
        case 'move_node': {
          var { newPath: u, path: r } = n;
          if (S.equals(u, r)) return n;
          if (S.isSibling(r, u)) return it(it({}, n), {}, { path: u, newPath: r });
          var l = S.transform(r, n),
            s = S.transform(S.next(r), n);
          return it(it({}, n), {}, { path: l, newPath: s });
        }
        case 'remove_node':
          return it(it({}, n), {}, { type: 'insert_node' });
        case 'remove_text':
          return it(it({}, n), {}, { type: 'insert_text' });
        case 'set_node': {
          var { properties: c, newProperties: D } = n;
          return it(it({}, n), {}, { properties: D, newProperties: c });
        }
        case 'set_selection': {
          var { properties: d, newProperties: g } = n;
          return d == null
            ? it(it({}, n), {}, { properties: g, newProperties: null })
            : g == null
              ? it(it({}, n), {}, { properties: null, newProperties: d })
              : it(it({}, n), {}, { properties: g, newProperties: d });
        }
        case 'split_node':
          return it(it({}, n), {}, { type: 'merge_node', path: S.next(n.path) });
      }
    },
  },
  Lt = (n) => typeof n == 'object' && n !== null,
  Jh = (n, u) => {
    for (var r in n) {
      var l = Object.hasOwn(n, r) ? n[r] : void 0,
        s = Object.hasOwn(u, r) ? u[r] : void 0;
      if (Array.isArray(l) && Array.isArray(s)) {
        if (l.length !== s.length) return !1;
        for (var c = 0; c < l.length; c++) if (l[c] !== s[c]) return !1;
      } else if (Lt(l) && Lt(s)) {
        if (!Jh(l, s)) return !1;
      } else if (l !== s) return !1;
    }
    for (var D in u) if (n[D] === void 0 && u[D] !== void 0) return !1;
    return !0;
  },
  Zo = (n) => (n.selection ? n.selection : n.children.length > 0 ? C.end(n, []) : [0]),
  Ia = (n, u) => {
    var [r] = C.node(n, u);
    return (l) => l === r;
  },
  Po = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
      l = !r,
      s = r ? yC(u) : u,
      c = be.None,
      D = be.None,
      d = 0,
      g = null,
      h = null,
      E = null;
    for (var A of s) {
      var B = A.codePointAt(0);
      if (!B) break;
      var F = UC(A, B);
      if (
        (([c, D] = l ? [D, F] : [F, c]),
        (Mn(c, be.ZWJ) &&
          Mn(D, be.ExtPict) &&
          (l ? (g = Av(u.substring(0, d))) : (g = Av(u.substring(0, u.length - d))), !g)) ||
          (Mn(c, be.RI) &&
            Mn(D, be.RI) &&
            (h !== null ? (h = !h) : l ? (h = !0) : (h = VC(u.substring(0, u.length - d))), !h)) ||
          (Mn(c, be.InCBLinker | be.InCBExtend) &&
            Mn(D, be.InCBConsonant) &&
            (l ? (E = Bv(u.substring(0, d))) : (E = Bv(u.substring(0, u.length - d))), !E)) ||
          (c !== be.None && D !== be.None && kC(c, D)))
      )
        break;
      d += A.length;
    }
    return d || 1;
  },
  CC = /\s/,
  pC =
    /[\u002B\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/,
  EC = /['\u2018\u2019]/,
  AC = function (u) {
    for (
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, l = 0, s = !1;
      u.length > 0;
    ) {
      var c = Po(u, r),
        [D, d] = Jo(u, c, r);
      if (BC(D, d, r)) ((s = !0), (l += c));
      else if (!s) l += c;
      else break;
      u = d;
    }
    return l;
  },
  Jo = (n, u, r) => {
    if (r) {
      var l = n.length - u;
      return [n.slice(l, n.length), n.slice(0, l)];
    }
    return [n.slice(0, u), n.slice(u)];
  },
  BC = function n(u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    if (CC.test(u)) return !1;
    if (EC.test(u)) {
      var s = Po(r, l),
        [c, D] = Jo(r, s, l);
      if (n(c, D, l)) return !0;
    }
    return !pC.test(u);
  },
  yC = function* (u) {
    for (var r = u.length - 1, l = 0; l < u.length; l++) {
      var s = u.charAt(r - l);
      if (FC(s.charCodeAt(0))) {
        var c = u.charAt(r - l - 1);
        if (bC(c.charCodeAt(0))) {
          (yield c + s, l++);
          continue;
        }
      }
      yield s;
    }
  },
  bC = (n) => n >= 55296 && n <= 56319,
  FC = (n) => n >= 56320 && n <= 57343,
  be;
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
})(be || (be = {}));
var SC =
    /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/,
  OC =
    /^(?:[\u0600-\u0605\u06DD\u070F\u0890\u0891\u08E2\u0D4E]|\uD804[\uDCBD\uDCCD\uDDC2\uDDC3]|\uD806[\uDD3F\uDD41\uDE3A\uDE84-\uDE89]|\uD807\uDD46)$/,
  xC =
    /^(?:[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BF\u09C0\u09C7\u09C8\u09CB\u09CC\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0\u0CC1\u0CC3\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0D02\u0D03\u0D3F\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D82\u0D83\u0DD0\u0DD1\u0DD8-\u0DDE\u0DF2\u0DF3\u0E33\u0EB3\u0F3E\u0F3F\u0F7F\u1031\u103B\u103C\u1056\u1057\u1084\u1715\u1734\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A6D-\u1A72\u1B04\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF7\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDDCE\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB1\uDCB2\uDCB9\uDCBB\uDCBC\uDCBE\uDCC1\uDDB0\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDD31-\uDD35\uDD37\uDD38\uDD3D\uDD40\uDD42\uDDD1-\uDDD3\uDDDC-\uDDDF\uDDE4\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF87\uDFF0\uDFF1]|\uD834[\uDD66\uDD6D])$/,
  TC = /^[\u1100-\u115F\uA960-\uA97C]$/,
  wC = /^[\u1160-\u11A7\uD7B0-\uD7C6]$/,
  MC = /^[\u11A8-\u11FF\uD7CB-\uD7FB]$/,
  RC =
    /^[\uAC00\uAC1C\uAC38\uAC54\uAC70\uAC8C\uACA8\uACC4\uACE0\uACFC\uAD18\uAD34\uAD50\uAD6C\uAD88\uADA4\uADC0\uADDC\uADF8\uAE14\uAE30\uAE4C\uAE68\uAE84\uAEA0\uAEBC\uAED8\uAEF4\uAF10\uAF2C\uAF48\uAF64\uAF80\uAF9C\uAFB8\uAFD4\uAFF0\uB00C\uB028\uB044\uB060\uB07C\uB098\uB0B4\uB0D0\uB0EC\uB108\uB124\uB140\uB15C\uB178\uB194\uB1B0\uB1CC\uB1E8\uB204\uB220\uB23C\uB258\uB274\uB290\uB2AC\uB2C8\uB2E4\uB300\uB31C\uB338\uB354\uB370\uB38C\uB3A8\uB3C4\uB3E0\uB3FC\uB418\uB434\uB450\uB46C\uB488\uB4A4\uB4C0\uB4DC\uB4F8\uB514\uB530\uB54C\uB568\uB584\uB5A0\uB5BC\uB5D8\uB5F4\uB610\uB62C\uB648\uB664\uB680\uB69C\uB6B8\uB6D4\uB6F0\uB70C\uB728\uB744\uB760\uB77C\uB798\uB7B4\uB7D0\uB7EC\uB808\uB824\uB840\uB85C\uB878\uB894\uB8B0\uB8CC\uB8E8\uB904\uB920\uB93C\uB958\uB974\uB990\uB9AC\uB9C8\uB9E4\uBA00\uBA1C\uBA38\uBA54\uBA70\uBA8C\uBAA8\uBAC4\uBAE0\uBAFC\uBB18\uBB34\uBB50\uBB6C\uBB88\uBBA4\uBBC0\uBBDC\uBBF8\uBC14\uBC30\uBC4C\uBC68\uBC84\uBCA0\uBCBC\uBCD8\uBCF4\uBD10\uBD2C\uBD48\uBD64\uBD80\uBD9C\uBDB8\uBDD4\uBDF0\uBE0C\uBE28\uBE44\uBE60\uBE7C\uBE98\uBEB4\uBED0\uBEEC\uBF08\uBF24\uBF40\uBF5C\uBF78\uBF94\uBFB0\uBFCC\uBFE8\uC004\uC020\uC03C\uC058\uC074\uC090\uC0AC\uC0C8\uC0E4\uC100\uC11C\uC138\uC154\uC170\uC18C\uC1A8\uC1C4\uC1E0\uC1FC\uC218\uC234\uC250\uC26C\uC288\uC2A4\uC2C0\uC2DC\uC2F8\uC314\uC330\uC34C\uC368\uC384\uC3A0\uC3BC\uC3D8\uC3F4\uC410\uC42C\uC448\uC464\uC480\uC49C\uC4B8\uC4D4\uC4F0\uC50C\uC528\uC544\uC560\uC57C\uC598\uC5B4\uC5D0\uC5EC\uC608\uC624\uC640\uC65C\uC678\uC694\uC6B0\uC6CC\uC6E8\uC704\uC720\uC73C\uC758\uC774\uC790\uC7AC\uC7C8\uC7E4\uC800\uC81C\uC838\uC854\uC870\uC88C\uC8A8\uC8C4\uC8E0\uC8FC\uC918\uC934\uC950\uC96C\uC988\uC9A4\uC9C0\uC9DC\uC9F8\uCA14\uCA30\uCA4C\uCA68\uCA84\uCAA0\uCABC\uCAD8\uCAF4\uCB10\uCB2C\uCB48\uCB64\uCB80\uCB9C\uCBB8\uCBD4\uCBF0\uCC0C\uCC28\uCC44\uCC60\uCC7C\uCC98\uCCB4\uCCD0\uCCEC\uCD08\uCD24\uCD40\uCD5C\uCD78\uCD94\uCDB0\uCDCC\uCDE8\uCE04\uCE20\uCE3C\uCE58\uCE74\uCE90\uCEAC\uCEC8\uCEE4\uCF00\uCF1C\uCF38\uCF54\uCF70\uCF8C\uCFA8\uCFC4\uCFE0\uCFFC\uD018\uD034\uD050\uD06C\uD088\uD0A4\uD0C0\uD0DC\uD0F8\uD114\uD130\uD14C\uD168\uD184\uD1A0\uD1BC\uD1D8\uD1F4\uD210\uD22C\uD248\uD264\uD280\uD29C\uD2B8\uD2D4\uD2F0\uD30C\uD328\uD344\uD360\uD37C\uD398\uD3B4\uD3D0\uD3EC\uD408\uD424\uD440\uD45C\uD478\uD494\uD4B0\uD4CC\uD4E8\uD504\uD520\uD53C\uD558\uD574\uD590\uD5AC\uD5C8\uD5E4\uD600\uD61C\uD638\uD654\uD670\uD68C\uD6A8\uD6C4\uD6E0\uD6FC\uD718\uD734\uD750\uD76C\uD788]$/,
  jC =
    /^[\uAC01-\uAC1B\uAC1D-\uAC37\uAC39-\uAC53\uAC55-\uAC6F\uAC71-\uAC8B\uAC8D-\uACA7\uACA9-\uACC3\uACC5-\uACDF\uACE1-\uACFB\uACFD-\uAD17\uAD19-\uAD33\uAD35-\uAD4F\uAD51-\uAD6B\uAD6D-\uAD87\uAD89-\uADA3\uADA5-\uADBF\uADC1-\uADDB\uADDD-\uADF7\uADF9-\uAE13\uAE15-\uAE2F\uAE31-\uAE4B\uAE4D-\uAE67\uAE69-\uAE83\uAE85-\uAE9F\uAEA1-\uAEBB\uAEBD-\uAED7\uAED9-\uAEF3\uAEF5-\uAF0F\uAF11-\uAF2B\uAF2D-\uAF47\uAF49-\uAF63\uAF65-\uAF7F\uAF81-\uAF9B\uAF9D-\uAFB7\uAFB9-\uAFD3\uAFD5-\uAFEF\uAFF1-\uB00B\uB00D-\uB027\uB029-\uB043\uB045-\uB05F\uB061-\uB07B\uB07D-\uB097\uB099-\uB0B3\uB0B5-\uB0CF\uB0D1-\uB0EB\uB0ED-\uB107\uB109-\uB123\uB125-\uB13F\uB141-\uB15B\uB15D-\uB177\uB179-\uB193\uB195-\uB1AF\uB1B1-\uB1CB\uB1CD-\uB1E7\uB1E9-\uB203\uB205-\uB21F\uB221-\uB23B\uB23D-\uB257\uB259-\uB273\uB275-\uB28F\uB291-\uB2AB\uB2AD-\uB2C7\uB2C9-\uB2E3\uB2E5-\uB2FF\uB301-\uB31B\uB31D-\uB337\uB339-\uB353\uB355-\uB36F\uB371-\uB38B\uB38D-\uB3A7\uB3A9-\uB3C3\uB3C5-\uB3DF\uB3E1-\uB3FB\uB3FD-\uB417\uB419-\uB433\uB435-\uB44F\uB451-\uB46B\uB46D-\uB487\uB489-\uB4A3\uB4A5-\uB4BF\uB4C1-\uB4DB\uB4DD-\uB4F7\uB4F9-\uB513\uB515-\uB52F\uB531-\uB54B\uB54D-\uB567\uB569-\uB583\uB585-\uB59F\uB5A1-\uB5BB\uB5BD-\uB5D7\uB5D9-\uB5F3\uB5F5-\uB60F\uB611-\uB62B\uB62D-\uB647\uB649-\uB663\uB665-\uB67F\uB681-\uB69B\uB69D-\uB6B7\uB6B9-\uB6D3\uB6D5-\uB6EF\uB6F1-\uB70B\uB70D-\uB727\uB729-\uB743\uB745-\uB75F\uB761-\uB77B\uB77D-\uB797\uB799-\uB7B3\uB7B5-\uB7CF\uB7D1-\uB7EB\uB7ED-\uB807\uB809-\uB823\uB825-\uB83F\uB841-\uB85B\uB85D-\uB877\uB879-\uB893\uB895-\uB8AF\uB8B1-\uB8CB\uB8CD-\uB8E7\uB8E9-\uB903\uB905-\uB91F\uB921-\uB93B\uB93D-\uB957\uB959-\uB973\uB975-\uB98F\uB991-\uB9AB\uB9AD-\uB9C7\uB9C9-\uB9E3\uB9E5-\uB9FF\uBA01-\uBA1B\uBA1D-\uBA37\uBA39-\uBA53\uBA55-\uBA6F\uBA71-\uBA8B\uBA8D-\uBAA7\uBAA9-\uBAC3\uBAC5-\uBADF\uBAE1-\uBAFB\uBAFD-\uBB17\uBB19-\uBB33\uBB35-\uBB4F\uBB51-\uBB6B\uBB6D-\uBB87\uBB89-\uBBA3\uBBA5-\uBBBF\uBBC1-\uBBDB\uBBDD-\uBBF7\uBBF9-\uBC13\uBC15-\uBC2F\uBC31-\uBC4B\uBC4D-\uBC67\uBC69-\uBC83\uBC85-\uBC9F\uBCA1-\uBCBB\uBCBD-\uBCD7\uBCD9-\uBCF3\uBCF5-\uBD0F\uBD11-\uBD2B\uBD2D-\uBD47\uBD49-\uBD63\uBD65-\uBD7F\uBD81-\uBD9B\uBD9D-\uBDB7\uBDB9-\uBDD3\uBDD5-\uBDEF\uBDF1-\uBE0B\uBE0D-\uBE27\uBE29-\uBE43\uBE45-\uBE5F\uBE61-\uBE7B\uBE7D-\uBE97\uBE99-\uBEB3\uBEB5-\uBECF\uBED1-\uBEEB\uBEED-\uBF07\uBF09-\uBF23\uBF25-\uBF3F\uBF41-\uBF5B\uBF5D-\uBF77\uBF79-\uBF93\uBF95-\uBFAF\uBFB1-\uBFCB\uBFCD-\uBFE7\uBFE9-\uC003\uC005-\uC01F\uC021-\uC03B\uC03D-\uC057\uC059-\uC073\uC075-\uC08F\uC091-\uC0AB\uC0AD-\uC0C7\uC0C9-\uC0E3\uC0E5-\uC0FF\uC101-\uC11B\uC11D-\uC137\uC139-\uC153\uC155-\uC16F\uC171-\uC18B\uC18D-\uC1A7\uC1A9-\uC1C3\uC1C5-\uC1DF\uC1E1-\uC1FB\uC1FD-\uC217\uC219-\uC233\uC235-\uC24F\uC251-\uC26B\uC26D-\uC287\uC289-\uC2A3\uC2A5-\uC2BF\uC2C1-\uC2DB\uC2DD-\uC2F7\uC2F9-\uC313\uC315-\uC32F\uC331-\uC34B\uC34D-\uC367\uC369-\uC383\uC385-\uC39F\uC3A1-\uC3BB\uC3BD-\uC3D7\uC3D9-\uC3F3\uC3F5-\uC40F\uC411-\uC42B\uC42D-\uC447\uC449-\uC463\uC465-\uC47F\uC481-\uC49B\uC49D-\uC4B7\uC4B9-\uC4D3\uC4D5-\uC4EF\uC4F1-\uC50B\uC50D-\uC527\uC529-\uC543\uC545-\uC55F\uC561-\uC57B\uC57D-\uC597\uC599-\uC5B3\uC5B5-\uC5CF\uC5D1-\uC5EB\uC5ED-\uC607\uC609-\uC623\uC625-\uC63F\uC641-\uC65B\uC65D-\uC677\uC679-\uC693\uC695-\uC6AF\uC6B1-\uC6CB\uC6CD-\uC6E7\uC6E9-\uC703\uC705-\uC71F\uC721-\uC73B\uC73D-\uC757\uC759-\uC773\uC775-\uC78F\uC791-\uC7AB\uC7AD-\uC7C7\uC7C9-\uC7E3\uC7E5-\uC7FF\uC801-\uC81B\uC81D-\uC837\uC839-\uC853\uC855-\uC86F\uC871-\uC88B\uC88D-\uC8A7\uC8A9-\uC8C3\uC8C5-\uC8DF\uC8E1-\uC8FB\uC8FD-\uC917\uC919-\uC933\uC935-\uC94F\uC951-\uC96B\uC96D-\uC987\uC989-\uC9A3\uC9A5-\uC9BF\uC9C1-\uC9DB\uC9DD-\uC9F7\uC9F9-\uCA13\uCA15-\uCA2F\uCA31-\uCA4B\uCA4D-\uCA67\uCA69-\uCA83\uCA85-\uCA9F\uCAA1-\uCABB\uCABD-\uCAD7\uCAD9-\uCAF3\uCAF5-\uCB0F\uCB11-\uCB2B\uCB2D-\uCB47\uCB49-\uCB63\uCB65-\uCB7F\uCB81-\uCB9B\uCB9D-\uCBB7\uCBB9-\uCBD3\uCBD5-\uCBEF\uCBF1-\uCC0B\uCC0D-\uCC27\uCC29-\uCC43\uCC45-\uCC5F\uCC61-\uCC7B\uCC7D-\uCC97\uCC99-\uCCB3\uCCB5-\uCCCF\uCCD1-\uCCEB\uCCED-\uCD07\uCD09-\uCD23\uCD25-\uCD3F\uCD41-\uCD5B\uCD5D-\uCD77\uCD79-\uCD93\uCD95-\uCDAF\uCDB1-\uCDCB\uCDCD-\uCDE7\uCDE9-\uCE03\uCE05-\uCE1F\uCE21-\uCE3B\uCE3D-\uCE57\uCE59-\uCE73\uCE75-\uCE8F\uCE91-\uCEAB\uCEAD-\uCEC7\uCEC9-\uCEE3\uCEE5-\uCEFF\uCF01-\uCF1B\uCF1D-\uCF37\uCF39-\uCF53\uCF55-\uCF6F\uCF71-\uCF8B\uCF8D-\uCFA7\uCFA9-\uCFC3\uCFC5-\uCFDF\uCFE1-\uCFFB\uCFFD-\uD017\uD019-\uD033\uD035-\uD04F\uD051-\uD06B\uD06D-\uD087\uD089-\uD0A3\uD0A5-\uD0BF\uD0C1-\uD0DB\uD0DD-\uD0F7\uD0F9-\uD113\uD115-\uD12F\uD131-\uD14B\uD14D-\uD167\uD169-\uD183\uD185-\uD19F\uD1A1-\uD1BB\uD1BD-\uD1D7\uD1D9-\uD1F3\uD1F5-\uD20F\uD211-\uD22B\uD22D-\uD247\uD249-\uD263\uD265-\uD27F\uD281-\uD29B\uD29D-\uD2B7\uD2B9-\uD2D3\uD2D5-\uD2EF\uD2F1-\uD30B\uD30D-\uD327\uD329-\uD343\uD345-\uD35F\uD361-\uD37B\uD37D-\uD397\uD399-\uD3B3\uD3B5-\uD3CF\uD3D1-\uD3EB\uD3ED-\uD407\uD409-\uD423\uD425-\uD43F\uD441-\uD45B\uD45D-\uD477\uD479-\uD493\uD495-\uD4AF\uD4B1-\uD4CB\uD4CD-\uD4E7\uD4E9-\uD503\uD505-\uD51F\uD521-\uD53B\uD53D-\uD557\uD559-\uD573\uD575-\uD58F\uD591-\uD5AB\uD5AD-\uD5C7\uD5C9-\uD5E3\uD5E5-\uD5FF\uD601-\uD61B\uD61D-\uD637\uD639-\uD653\uD655-\uD66F\uD671-\uD68B\uD68D-\uD6A7\uD6A9-\uD6C3\uD6C5-\uD6DF\uD6E1-\uD6FB\uD6FD-\uD717\uD719-\uD733\uD735-\uD74F\uD751-\uD76B\uD76D-\uD787\uD789-\uD7A3]$/,
  zC =
    /^(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])$/,
  NC =
    /^(?:[\u0915-\u0939\u0958-\u095F\u0978-\u097F\u0995-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF\u09F0\u09F1\u0A95-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0AF9\u0B15-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B5C\u0B5D\u0B5F\u0B71\u0C15-\u0C28\u0C2A-\u0C39\u0C58-\u0C5A\u0D15-\u0D3A\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1780-\u17B3\u1A20-\u1A54\u1B0B\u1B0C\u1B13-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBB-\u1BBD\uA989-\uA98B\uA98F-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA60-\uAA6F\uAA71-\uAA73\uAA7A\uAA7E\uAA7F\uAAE0-\uAAEA\uABC0-\uABDA]|\uD802[\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35]|\uD804[\uDD03-\uDD26\uDD44\uDD47\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5]|\uD806[\uDD00-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDE00\uDE0B-\uDE32\uDE50\uDE5C-\uDE83]|\uD807[\uDF04-\uDF10\uDF12-\uDF33])$/,
  LC =
    /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC0\u0CC2\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D1\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B03\u1B34-\u1B3D\u1B42\u1B43\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8-\u1BAA\u1BAC\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF3\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200D\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA953\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD69-\uDD6D\uDEAB\uDEAC\uDEFA-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD32\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC0\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34-\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF4D\uDF57\uDF66-\uDF6C\uDF70-\uDF74\uDFB8\uDFBB-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFC9\uDFCE\uDFCF\uDFD2\uDFE1\uDFE2]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB7\uDF1D\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B-\uDD3D\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDF60\uDF62-\uDF64\uDF66]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF41\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD29\uDD2D-\uDD2F]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF\uDDEE\uDDEF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/,
  HC =
    /^(?:[\u094D\u09CD\u0ACD\u0B4D\u0C4D\u0D4D\u1039\u17D2\u1A60\u1B44\u1BAB\uA9C0\uAAF6]|\uD802\uDE3F|\uD804[\uDD33\uDFD0]|\uD806[\uDD3E\uDE47\uDE99]|\uD807\uDF42)$/,
  UC = (n, u) => {
    var r = be.Any;
    return (
      n.search(SC) !== -1 && (r |= be.Extend),
      u === 8205 && (r |= be.ZWJ),
      u >= 127462 && u <= 127487 && (r |= be.RI),
      n.search(OC) !== -1 && (r |= be.Prepend),
      n.search(xC) !== -1 && (r |= be.SpacingMark),
      n.search(TC) !== -1 && (r |= be.L),
      n.search(wC) !== -1 && (r |= be.V),
      n.search(MC) !== -1 && (r |= be.T),
      n.search(RC) !== -1 && (r |= be.LV),
      n.search(jC) !== -1 && (r |= be.LVT),
      n.search(zC) !== -1 && (r |= be.ExtPict),
      n.search(NC) !== -1 && (r |= be.InCBConsonant),
      n.search(LC) !== -1 && (r |= be.InCBExtend),
      n.search(HC) !== -1 && (r |= be.InCBLinker),
      r
    );
  };
function Mn(n, u) {
  return (n & u) !== 0;
}
var qC = [
  [be.L, be.L | be.V | be.LV | be.LVT],
  [be.LV | be.V, be.V | be.T],
  [be.LVT | be.T, be.T],
  [be.Any, be.Extend | be.ZWJ],
  [be.Any, be.SpacingMark],
  [be.Prepend, be.Any],
  [be.InCBLinker | be.InCBExtend, be.InCBConsonant],
  [be.ZWJ, be.ExtPict],
  [be.RI, be.RI],
];
function kC(n, u) {
  return qC.findIndex((r) => Mn(n, r[0]) && Mn(u, r[1])) === -1;
}
var _C =
    /(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])*\u200D$/,
  Av = (n) => n.search(_C) !== -1,
  GC =
    /(?:[\u0915-\u0939\u0958-\u095F\u0978-\u097F\u0995-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC\u09DD\u09DF\u09F0\u09F1\u0A95-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0AF9\u0B15-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B5C\u0B5D\u0B5F\u0B71\u0C15-\u0C28\u0C2A-\u0C39\u0C58-\u0C5A\u0D15-\u0D3A\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1780-\u17B3\u1A20-\u1A54\u1B0B\u1B0C\u1B13-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBB-\u1BBD\uA989-\uA98B\uA98F-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA60-\uAA6F\uAA71-\uAA73\uAA7A\uAA7E\uAA7F\uAAE0-\uAAEA\uABC0-\uABDA]|\uD802[\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35]|\uD804[\uDD03-\uDD26\uDD44\uDD47\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5]|\uD806[\uDD00-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDE00\uDE0B-\uDE32\uDE50\uDE5C-\uDE83]|\uD807[\uDF04-\uDF10\uDF12-\uDF33])(?:(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC0\u0CC2\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B03\u1B34-\u1B3D\u1B42-\u1B44\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF3\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200D\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA953\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9C0\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD69-\uDD6D\uDEAB\uDEAC\uDEFA-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC0\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34-\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF4D\uDF57\uDF66-\uDF6C\uDF70-\uDF74\uDFB8\uDFBB-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFC9\uDFCE-\uDFD0\uDFD2\uDFE1\uDFE2]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB7\uDF1D\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B-\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99\uDF60\uDF62-\uDF64\uDF66]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40-\uDF42\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD29\uDD2D-\uDD2F]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF\uDDEE\uDDEF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF]))*(?:[\u094D\u09CD\u0ACD\u0B4D\u0C4D\u0D4D\u1039\u17D2\u1A60\u1B44\u1BAB\uA9C0\uAAF6]|\uD802\uDE3F|\uD804[\uDD33\uDFD0]|\uD806[\uDD3E\uDE47\uDE99]|\uD807\uDF42)(?:(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC0\u0CC2\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B03\u1B34-\u1B3D\u1B42-\u1B44\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF3\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200D\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA953\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9C0\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD69-\uDD6D\uDEAB\uDEAC\uDEFA-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC0\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34-\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF4D\uDF57\uDF66-\uDF6C\uDF70-\uDF74\uDFB8\uDFBB-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFC9\uDFCE-\uDFD0\uDFD2\uDFE1\uDFE2]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB7\uDF1D\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B-\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99\uDF60\uDF62-\uDF64\uDF66]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40-\uDF42\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD29\uDD2D-\uDD2F]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF\uDDEE\uDDEF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF]))*$/,
  Bv = (n) => n.search(GC) !== -1,
  YC = /(?:\uD83C[\uDDE6-\uDDFF])+$/g,
  VC = (n) => {
    var u = n.match(YC);
    if (u === null) return !1;
    var r = u[0].length / 2;
    return r % 2 === 1;
  },
  XC = function (u) {
    var { deep: r = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!Lt(u)) return !1;
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
      (u.marks === null || Lt(u.marks)) &&
      (u.selection === null || I.isRange(u.selection)) &&
      (r
        ? T.isNodeList(u.children) && jn.isOperationList(u.operations)
        : Array.isArray(u.children) && Array.isArray(u.operations));
    return l;
  },
  C = {
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
    isEditor: XC,
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
  Me = {
    isLocation(n) {
      return S.isPath(n) || Qe.isPoint(n) || I.isRange(n);
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
function yv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function bv(n) {
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
var Qe = {
    compare(n, u) {
      var r = S.compare(n.path, u.path);
      return r === 0 ? (n.offset < u.offset ? -1 : n.offset > u.offset ? 1 : 0) : r;
    },
    isAfter(n, u) {
      return Qe.compare(n, u) === 1;
    },
    isBefore(n, u) {
      return Qe.compare(n, u) === -1;
    },
    equals(n, u) {
      return n.offset === u.offset && S.equals(n.path, u.path);
    },
    isPoint(n) {
      return Lt(n) && typeof n.offset == 'number' && S.isPath(n.path);
    },
    transform(n, u) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n === null) return null;
      var { affinity: l = 'forward' } = r,
        { path: s, offset: c } = n;
      switch (u.type) {
        case 'insert_node':
        case 'move_node': {
          s = S.transform(s, u, r);
          break;
        }
        case 'insert_text': {
          S.equals(u.path, s) &&
            (u.offset < c || (u.offset === c && l === 'forward')) &&
            (c += u.text.length);
          break;
        }
        case 'merge_node': {
          (S.equals(u.path, s) && (c += u.position), (s = S.transform(s, u, r)));
          break;
        }
        case 'remove_text': {
          S.equals(u.path, s) && u.offset <= c && (c -= Math.min(c - u.offset, u.text.length));
          break;
        }
        case 'remove_node': {
          if (S.equals(u.path, s) || S.isAncestor(u.path, s)) return null;
          s = S.transform(s, u, r);
          break;
        }
        case 'split_node': {
          if (S.equals(u.path, s)) {
            if (u.position === c && l == null) return null;
            (u.position < c || (u.position === c && l === 'forward')) &&
              ((c -= u.position),
              (s = S.transform(s, u, bv(bv({}, r), {}, { affinity: 'forward' }))));
          } else s = S.transform(s, u, r);
          break;
        }
        default:
          return n;
      }
      return { path: s, offset: c };
    },
  },
  Fv = void 0,
  Bt = {
    setScrubber(n) {
      Fv = n;
    },
    stringify(n) {
      return JSON.stringify(n, Fv);
    },
  },
  KC = ['text'],
  QC = ['anchor', 'focus', 'merge'];
function Sv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Ju(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Sv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Sv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Iu = {
  equals(n, u) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { loose: l = !1 } = r;
    function s(c) {
      var { text: D } = c,
        d = en(c, KC);
      return d;
    }
    return Jh(l ? s(n) : n, l ? s(u) : u);
  },
  isText(n) {
    return Lt(n) && typeof n.text == 'string';
  },
  isTextList(n) {
    return Array.isArray(n) && n.every((u) => Iu.isText(u));
  },
  isTextProps(n) {
    return n.text !== void 0;
  },
  matches(n, u) {
    for (var r in u) if (r !== 'text' && (!n.hasOwnProperty(r) || n[r] !== u[r])) return !1;
    return !0;
  },
  decorations(n, u) {
    var r = [{ leaf: Ju({}, n) }];
    for (var l of u) {
      var { anchor: s, focus: c, merge: D } = l,
        d = en(l, QC),
        [g, h] = I.edges(l),
        E = [],
        A = 0,
        B = g.offset,
        F = h.offset,
        M = D ?? Object.assign;
      for (var { leaf: z } of r) {
        var { length: V } = z.text,
          x = A;
        if (((A += V), B <= x && A <= F)) {
          (M(z, d), E.push({ leaf: z }));
          continue;
        }
        if ((B !== F && (B === A || F === x)) || B > A || F < x || (F === x && x !== 0)) {
          E.push({ leaf: z });
          continue;
        }
        var m = z,
          N = void 0,
          _ = void 0;
        if (F < A) {
          var J = F - x;
          ((_ = { leaf: Ju(Ju({}, m), {}, { text: m.text.slice(J) }) }),
            (m = Ju(Ju({}, m), {}, { text: m.text.slice(0, J) })));
        }
        if (B > x) {
          var le = B - x;
          ((N = { leaf: Ju(Ju({}, m), {}, { text: m.text.slice(0, le) }) }),
            (m = Ju(Ju({}, m), {}, { text: m.text.slice(le) })));
        }
        (M(m, d), N && E.push(N), E.push({ leaf: m }), _ && E.push(_));
      }
      r = E;
    }
    if (r.length > 1) {
      var P = 0;
      for (var [se, fe] of r.entries()) {
        var ve = P,
          de = ve + fe.leaf.text.length,
          ee = { start: ve, end: de };
        (se === 0 && (ee.isFirst = !0),
          se === r.length - 1 && (ee.isLast = !0),
          (fe.position = ee),
          (P = de));
      }
    }
    return r;
  },
};
function Ov(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Yi(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Ov(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Ov(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var xv = function (u, r) {
    for (var l = arguments.length, s = new Array(l > 2 ? l - 2 : 0), c = 2; c < l; c++)
      s[c - 2] = arguments[c];
    return [...u.slice(0, r), ...s, ...u.slice(r)];
  },
  nl = function (u, r, l) {
    for (var s = arguments.length, c = new Array(s > 3 ? s - 3 : 0), D = 3; D < s; D++)
      c[D - 3] = arguments[D];
    return [...u.slice(0, r), ...c, ...u.slice(r + l)];
  },
  Ho = nl,
  Wo = (n, u, r) => {
    if (u.length === 0) throw new Error('Cannot modify the editor');
    for (var l = T.get(n, u), s = u.slice(), c = r(l); s.length > 1;) {
      var D = s.pop(),
        d = T.get(n, s);
      c = Yi(Yi({}, d), {}, { children: nl(d.children, D, 1, c) });
    }
    var g = s.pop();
    n.children = nl(n.children, g, 1, c);
  },
  ta = (n, u, r) => {
    u.length === 0
      ? (n.children = r(n.children))
      : Wo(n, u, (l) => {
          if (T.isText(l))
            throw new Error(
              'Cannot get the element at path ['
                .concat(u, '] because it refers to a leaf node: ')
                .concat(Bt.stringify(l)),
            );
          return Yi(Yi({}, l), {}, { children: r(l.children) });
        });
  },
  Vi = (n, u, r) =>
    Wo(n, u, (l) => {
      if (!T.isText(l))
        throw new Error(
          'Cannot get the leaf node at path ['
            .concat(u, '] because it refers to a non-leaf node: ')
            .concat(Bt.stringify(l)),
        );
      return r(l);
    });
function Tv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Rt(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Tv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Tv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Uo = ['children', 'text', ...Object.getOwnPropertyNames(Object.prototype)],
  Wh = Object.getOwnPropertyNames(Object.prototype),
  ZC = {
    transform(n, u) {
      var r = !1;
      switch (u.type) {
        case 'insert_node': {
          var { path: l, node: s } = u;
          (ta(n, S.parent(l), (w) => {
            var ie = l[l.length - 1];
            if (ie > w.length)
              throw new Error(
                'Cannot apply an "insert_node" operation at path ['.concat(
                  l,
                  '] because the destination is past the end of the node.',
                ),
              );
            return xv(w, ie, s);
          }),
            (r = !0));
          break;
        }
        case 'insert_text': {
          var { path: c, offset: D, text: d } = u;
          if (d.length === 0) break;
          (Vi(n, c, (w) => {
            var ie = w.text.slice(0, D),
              ue = w.text.slice(D);
            return Rt(Rt({}, w), {}, { text: ie + d + ue });
          }),
            (r = !0));
          break;
        }
        case 'merge_node': {
          var { path: g } = u,
            h = g[g.length - 1],
            E = S.previous(g),
            A = E[E.length - 1];
          if (g.length === 0)
            throw new Error(
              'Cannot apply a "merge_node" operation at path ['.concat(
                g,
                '] because the root node cannot be merged.',
              ),
            );
          if (typeof h != 'number' || typeof A != 'number') throw new Error('Index must be number');
          (ta(n, S.parent(g), (w) => {
            var ie = w[h],
              ue = w[A],
              oe;
            if (T.isText(ie) && T.isText(ue)) oe = Rt(Rt({}, ue), {}, { text: ue.text + ie.text });
            else if (T.isElement(ie) && T.isElement(ue))
              oe = Rt(Rt({}, ue), {}, { children: ue.children.concat(ie.children) });
            else
              throw new Error(
                'Cannot apply a "merge_node" operation at path ['
                  .concat(g, '] to nodes of different interfaces: ')
                  .concat(Bt.stringify(ie), ' ')
                  .concat(Bt.stringify(ue)),
              );
            return nl(w, A, 2, oe);
          }),
            (r = !0));
          break;
        }
        case 'move_node': {
          var { path: B, newPath: F } = u,
            M = B[B.length - 1];
          if (S.isAncestor(B, F))
            throw new Error(
              'Cannot move a path ['
                .concat(B, '] to new path [')
                .concat(F, '] because the destination is inside itself.'),
            );
          var z = T.get(n, B);
          ta(n, S.parent(B), (w) => Ho(w, M, 1));
          var V = S.transform(B, u),
            x = V[V.length - 1];
          (ta(n, S.parent(V), (w) => xv(w, x, z)), (r = !0));
          break;
        }
        case 'remove_node': {
          var { path: m } = u,
            N = m[m.length - 1];
          if ((ta(n, S.parent(m), (w) => Ho(w, N, 1)), n.selection)) {
            var _ = Rt({}, n.selection);
            for (var [J, le] of I.points(_)) {
              var P = Qe.transform(J, u);
              if (_ != null && P != null) _[le] = P;
              else {
                var se = void 0,
                  fe = void 0;
                for (var [ve, de] of T.texts(n))
                  if (S.compare(de, m) === -1) se = [ve, de];
                  else {
                    fe = [ve, de];
                    break;
                  }
                var ee = !1;
                (se &&
                  fe &&
                  (S.isSibling(se[1], m)
                    ? (ee = !1)
                    : S.equals(fe[1], m)
                      ? (ee = !0)
                      : (ee = S.common(se[1], m).length < S.common(fe[1], m).length)),
                  se && !ee
                    ? (_[le] = { path: se[1], offset: se[0].text.length })
                    : fe
                      ? (_[le] = { path: fe[1], offset: 0 })
                      : (_ = null));
              }
            }
            (!_ || !I.equals(_, n.selection)) && (n.selection = _);
          }
          break;
        }
        case 'remove_text': {
          var { path: Z, offset: ne, text: ae } = u;
          if (ae.length === 0) break;
          (Vi(n, Z, (w) => {
            var ie = w.text.slice(0, ne),
              ue = w.text.slice(ne + ae.length);
            return Rt(Rt({}, w), {}, { text: ie + ue });
          }),
            (r = !0));
          break;
        }
        case 'set_node': {
          var { path: R, properties: G, newProperties: De } = u;
          if (R.length === 0) throw new Error('Cannot set properties on the root node!');
          Wo(n, R, (w) => {
            var ie = Rt({}, w);
            for (var ue in De) {
              if (Uo.includes(ue))
                throw new Error('Cannot set the "'.concat(ue, '" property of nodes!'));
              var oe = De[ue];
              if (ue === 'then' && typeof oe == 'function')
                throw new Error('Cannot set the "then" property of a node to a function');
              oe == null ? delete ie[ue] : (ie[ue] = oe);
            }
            for (var Ee in G) Object.hasOwn(De, Ee) || delete ie[Ee];
            return ie;
          });
          break;
        }
        case 'set_selection': {
          var { newProperties: he } = u;
          if (he == null) {
            n.selection = null;
            break;
          }
          if (n.selection == null) {
            if (!(he.anchor && he.focus))
              throw new Error(
                'Cannot apply an incomplete "set_selection" operation properties '.concat(
                  Bt.stringify(he),
                  ' when there is no current selection.',
                ),
              );
            n.selection = Rt({}, he);
            break;
          }
          var Ce = Rt({}, n.selection);
          for (var y in he) {
            if (Wh.includes(y))
              throw new Error('Cannot set the "'.concat(y, '" property of the selection!'));
            var q = he[y];
            if (y === 'then' && typeof q == 'function')
              throw new Error('Cannot set the "then" property of the selection to a function');
            if (q == null) {
              if (y === 'anchor' || y === 'focus')
                throw new Error('Cannot remove the "'.concat(y, '" selection property'));
              delete Ce[y];
            } else Ce[y] = q;
          }
          n.selection = Ce;
          break;
        }
        case 'split_node': {
          var { path: K, position: W, properties: ge } = u,
            Ae = K[K.length - 1];
          if (K.length === 0)
            throw new Error(
              'Cannot apply a "split_node" operation at path ['.concat(
                K,
                '] because the root node cannot be split.',
              ),
            );
          if (typeof Ae != 'number') throw new Error('Index must be number');
          (ta(n, S.parent(K), (w) => {
            var ie = w[Ae],
              ue,
              oe;
            if (T.isText(ie)) {
              var Ee = ie.text.slice(0, W),
                ye = ie.text.slice(W);
              ((ue = Rt(Rt({}, ie), {}, { text: Ee })), (oe = { text: ye }));
            } else {
              var Je = ie.children.slice(0, W),
                ut = ie.children.slice(W);
              ((ue = Rt(Rt({}, ie), {}, { children: Je })), (oe = { children: ut }));
            }
            for (var _e in ge) {
              if (Uo.includes(_e))
                throw new Error('Cannot set the "'.concat(_e, '" property of nodes!'));
              var Ne = ge[_e];
              if (_e === 'then' && typeof Ne == 'function')
                throw new Error('Cannot set the "then" property of a node to a function');
              Ne != null && (oe[_e] = Ne);
            }
            return nl(w, Ae, 1, ue, oe);
          }),
            (r = !0));
          break;
        }
      }
      if (r && n.selection) {
        var xe = Rt({}, n.selection);
        for (var [Ke, ze] of I.points(xe)) xe[ze] = Qe.transform(Ke, u);
        I.equals(xe, n.selection) || (n.selection = xe);
      }
    },
  },
  PC = {
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
  JC = {
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
  WC = {
    delete(n, u) {
      n.delete(u);
    },
    insertFragment(n, u, r) {
      n.insertFragment(u, r);
    },
    insertText(n, u) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      C.withoutNormalizing(n, () => {
        var { voids: l = !1 } = r,
          { at: s = Zo(n) } = r;
        if ((Me.isPath(s) && (s = C.range(n, s)), Me.isRange(s)))
          if (I.isCollapsed(s)) s = s.anchor;
          else {
            var c = I.end(s);
            if (!l && C.void(n, { at: c })) return;
            var D = I.start(s),
              d = C.pointRef(n, D),
              g = C.pointRef(n, c);
            re.delete(n, { at: s, voids: l });
            var h = d.unref(),
              E = g.unref();
            ((s = h || E), re.setSelection(n, { anchor: s, focus: s }));
          }
        if (!((!l && C.void(n, { at: s })) || C.elementReadOnly(n, { at: s }))) {
          var { path: A, offset: B } = s;
          u.length > 0 && n.apply({ type: 'insert_text', path: A, offset: B, text: u });
        }
      });
    },
  };
function wv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Ti(n) {
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
var re = Ti(Ti(Ti(Ti({}, ZC), PC), JC), WC),
  Ui = new WeakMap(),
  $C = (n) => Ui.get(n) || !1,
  IC = (n, u, r) => {
    var l = Ui.get(n) || !1;
    Ui.set(n, !0);
    try {
      (u(), r());
    } finally {
      Ui.set(n, l);
    }
  };
function $h(n, u, r) {
  var l = _i.get(n) || [],
    s = Gi.get(n) || new Set(),
    c,
    D,
    d = (A) => {
      if (A) {
        var B = A.join(',');
        D.has(B) || (D.add(B), c.push(A));
      }
    };
  if (r) {
    ((c = []), (D = new Set()));
    for (var g of l) {
      var h = r(g);
      d(h);
    }
  } else ((c = l), (D = s));
  for (var E of u) d(E);
  (_i.set(n, c), Gi.set(n, D));
}
var ep = (n, u) => {
    for (var r of C.pathRefs(n)) sC.transform(r, u);
    for (var l of C.pointRefs(n)) fC.transform(l, u);
    for (var s of C.rangeRefs(n)) oC.transform(s, u);
    if (!$C(n)) {
      var c = S.operationCanTransformPath(u) ? (D) => S.transform(D, u) : void 0;
      $h(n, n.getDirtyPaths(u), c);
    }
    (re.transform(n, u),
      n.operations.push(u),
      C.normalize(n, { operation: u }),
      u.type === 'set_selection' && (n.marks = null),
      Jr.get(n) ||
        (Jr.set(n, !0),
        Promise.resolve().then(() => {
          (Jr.set(n, !1), n.onChange({ operation: u }), (n.operations = []));
        })));
  },
  tp = (n, u) => {
    switch (u.type) {
      case 'insert_text':
      case 'remove_text':
      case 'set_node': {
        var { path: r } = u;
        return S.levels(r);
      }
      case 'insert_node': {
        var { node: l, path: s } = u,
          c = S.levels(s),
          D = T.isText(l)
            ? []
            : Array.from(T.nodes(l), (ve) => {
                var [, de] = ve;
                return s.concat(de);
              });
        return [...c, ...D];
      }
      case 'merge_node': {
        var { path: d } = u,
          g = S.ancestors(d),
          h = S.previous(d);
        return [...g, h];
      }
      case 'move_node': {
        var { path: E, newPath: A } = u;
        if (S.equals(E, A)) return [];
        var B = [],
          F = [];
        for (var M of S.ancestors(E)) {
          var z = S.transform(M, u);
          B.push(z);
        }
        for (var V of S.ancestors(A)) {
          var x = S.transform(V, u);
          F.push(x);
        }
        var m = F[F.length - 1],
          N = A[A.length - 1],
          _ = m.concat(N);
        return [...B, ...F, _];
      }
      case 'remove_node': {
        var { path: J } = u,
          le = S.ancestors(J);
        return [...le];
      }
      case 'split_node': {
        var { path: P } = u,
          se = S.levels(P),
          fe = S.next(P);
        return [...se, fe];
      }
      default:
        return [];
    }
  },
  up = (n) => {
    var { selection: u } = n;
    return u ? T.fragment(n, u) : [];
  },
  np = (n, u, r) => {
    var [l, s] = u;
    if (!T.isText(l)) {
      'children' in l || (l.children = []);
      var c = l;
      if (c !== n && c.children.length === 0) {
        var D = { text: '' };
        (re.insertNodes(n, D, { at: s.concat(0), voids: !0 }), (c = T.get(n, s)));
      }
      var d = c !== n && (n.isInline(c) || T.isText(c.children[0]) || n.isInline(c.children[0]));
      if (d)
        for (var g = 0; g < c.children.length; g++) {
          var h = c.children[g],
            E = c.children[g - 1];
          if (T.isText(h))
            E != null &&
              T.isText(E) &&
              (h.text === ''
                ? (re.removeNodes(n, { at: s.concat(g), voids: !0 }), (c = T.get(n, s)), g--)
                : E.text === ''
                  ? (re.removeNodes(n, { at: s.concat(g - 1), voids: !0 }), (c = T.get(n, s)), g--)
                  : Iu.equals(h, E, { loose: !0 }) &&
                    (re.mergeNodes(n, { at: s.concat(g), voids: !0 }), (c = T.get(n, s)), g--));
          else if (n.isInline(h)) {
            if (E == null || !T.isText(E)) {
              var A = { text: '' };
              (re.insertNodes(n, A, { at: s.concat(g), voids: !0 }), (c = T.get(n, s)), g++);
            }
            if (g === c.children.length - 1) {
              var B = { text: '' };
              (re.insertNodes(n, B, { at: s.concat(g + 1), voids: !0 }), (c = T.get(n, s)), g++);
            }
          } else (re.unwrapNodes(n, { at: s.concat(g), voids: !0 }), (c = T.get(n, s)), g--);
        }
      else
        for (var F = 0; F < c.children.length; F++) {
          var M = c.children[F];
          (T.isText(M) || n.isInline(M)) &&
            (r != null && r.fallbackElement
              ? re.wrapNodes(n, r.fallbackElement(), { at: s.concat(F), voids: !0 })
              : re.removeNodes(n, { at: s.concat(F), voids: !0 }),
            (c = T.get(n, s)),
            F--);
        }
    }
  },
  ap = (n, u) => {
    var { iteration: r, initialDirtyPathsLength: l } = u,
      s = l * 42;
    if (r > s)
      throw new Error(
        'Could not completely normalize the editor after '.concat(
          s,
          ' iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.',
        ),
      );
    return !0;
  },
  rp = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { voids: l = !1, mode: s = 'lowest', at: c = u.selection, match: D } = r;
    if (c) {
      var d = C.path(u, c);
      if (!Me.isRange(c) || S.equals(c.focus.path, c.anchor.path)) {
        if (d.length === 0) return;
        d = S.parent(d);
      }
      var g = s === 'lowest',
        [h] = C.levels(u, { at: d, voids: l, match: D, reverse: g });
      return h;
    }
  };
function Mv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Rv(n) {
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
var lp = (n, u, r) => {
  var { selection: l } = n;
  if (l) {
    var s = (A, B) => {
        if (!T.isText(A)) return !1;
        var [F, M] = C.parent(n, B);
        return !n.isVoid(F) || n.markableVoid(F);
      },
      c = I.isExpanded(l),
      D = !1;
    if (!c) {
      var [d, g] = C.node(n, l);
      if (d && s(d, g)) {
        var [h] = C.parent(n, g);
        D = h && n.markableVoid(h);
      }
    }
    if (c || D) re.setNodes(n, { [u]: r }, { match: s, split: !0, voids: !0 });
    else {
      var E = Rv(Rv({}, C.marks(n) || {}), {}, { [u]: r });
      ((n.marks = E), Jr.get(n) || n.onChange());
    }
  }
};
function jv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function zv(n) {
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
var ip = function (u, r) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
    s = C.point(u, r, { edge: 'end' }),
    c = C.end(u, []),
    D = { anchor: s, focus: c },
    { distance: d = 1 } = l,
    g = 0,
    h;
  for (var E of C.positions(u, zv(zv({}, l), {}, { at: D }))) {
    if (g > d) break;
    (g !== 0 && (h = E), g++);
  }
  return h;
};
function Nv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Lv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Nv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Nv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var sp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s = C.start(u, []),
      c = C.point(u, r, { edge: 'start' }),
      D = { anchor: s, focus: c },
      { distance: d = 1 } = l,
      g = 0,
      h;
    for (var E of C.positions(u, Lv(Lv({}, l), {}, { at: D, reverse: !0 }))) {
      if (g > d) break;
      (g !== 0 && (h = E), g++);
    }
    return h;
  },
  fp = (n, u) => {
    var { selection: r } = n;
    r && I.isCollapsed(r) && re.delete(n, { unit: u, reverse: !0 });
  },
  op = (n, u) => {
    var { selection: r } = n;
    r && I.isCollapsed(r) && re.delete(n, { unit: u });
  },
  cp = function (u) {
    var { direction: r = 'forward' } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { selection: l } = u;
    l && I.isExpanded(l) && re.delete(u, { reverse: r === 'backward' });
  },
  dp = (n, u) => [C.start(n, u), C.end(n, u)];
function Hv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Uv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Hv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Hv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Dp = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return C.above(
      u,
      Uv(Uv({}, r), {}, { match: (l) => T.isElement(l) && C.isElementReadOnly(u, l) }),
    );
  },
  vp = (n, u) => C.point(n, u, { edge: 'end' }),
  hp = (n, u) => {
    var r = C.path(n, u, { edge: 'start' });
    return C.node(n, r);
  },
  gp = (n, u) => {
    var r = C.range(n, u);
    return T.fragment(n, r);
  };
function qv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function kv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? qv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : qv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var mp = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return C.above(u, kv(kv({}, r), {}, { match: (l) => T.isElement(l) && C.isVoid(u, l) }));
  },
  Cp = (n, u) => u.children.some((r) => T.isElement(r) && C.isBlock(n, r)),
  pp = (n, u) => u.children.some((r) => T.isText(r) || C.isInline(n, r)),
  Ep = (n, u) => T.has(n, u),
  Ap = (n, u) => u.children.every((r) => T.isText(r)),
  Bp = (n) => {
    re.splitNodes(n, { always: !0 });
  },
  yp = (n, u, r) => {
    re.insertNodes(n, u, r);
  },
  bp = (n) => {
    re.splitNodes(n, { always: !0 });
  };
function _v(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Fp(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? _v(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : _v(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Sp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { selection: s, marks: c } = u;
    if (s) {
      if (c) {
        var D = Fp({ text: r }, c);
        re.insertNodes(u, D, { at: l.at, voids: l.voids });
      } else re.insertText(u, r, l);
      u.marks = null;
    }
  },
  Op = (n, u) => !n.isInline(u),
  xp = (n, u, r) => C.isStart(n, u, r) || C.isEnd(n, u, r),
  Tp = (n, u) => {
    var { children: r } = u,
      [l] = r;
    return r.length === 0 || (r.length === 1 && T.isText(l) && l.text === '' && !n.isVoid(u));
  },
  wp = (n, u, r) => {
    var l = C.end(n, r);
    return Qe.equals(u, l);
  },
  Mp = (n) => {
    var u = Ph.get(n);
    return u === void 0 ? !0 : u;
  },
  Rp = (n, u, r) => {
    if (u.offset !== 0) return !1;
    var l = C.start(n, r);
    return Qe.equals(u, l);
  },
  jp = (n, u) => {
    var r = C.path(n, u, { edge: 'end' });
    return C.node(n, r);
  },
  zp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s = C.path(u, r, l),
      c = T.leaf(u, s);
    return [c, s];
  };
function Np(n) {
  var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var { at: r = n.selection, reverse: l = !1, voids: s = !1 } = u,
      { match: c } = u;
    if ((c == null && (c = () => !0), !!r)) {
      var D = [],
        d = C.path(n, r);
      for (var [g, h] of T.levels(n, d))
        if (c(g, h) && (D.push([g, h]), !s && T.isElement(g) && C.isVoid(n, g))) break;
      (l && D.reverse(), yield* D);
    }
  })();
}
var Lp = ['text'],
  Hp = ['text'],
  Up = function (u) {
    var { marks: r, selection: l } = u;
    if (!l) return null;
    var { anchor: s, focus: c } = l;
    if (r) return r;
    if (I.isExpanded(l)) {
      var D = I.isBackward(l);
      D && ([c, s] = [s, c]);
      var d = C.isEnd(u, s, s.path);
      if (d) {
        var g = C.after(u, s);
        g && (s = g);
      }
      var [h] = C.nodes(u, { match: T.isText, at: { anchor: s, focus: c } });
      if (h) {
        var [E] = h,
          { text: A } = E,
          B = en(E, Lp);
        return B;
      } else return {};
    }
    var { path: F } = s,
      [M] = C.leaf(u, F);
    if (s.offset === 0) {
      var z = C.previous(u, { at: F, match: T.isText }),
        V = C.above(u, { match: (P) => T.isElement(P) && C.isVoid(u, P) && u.markableVoid(P) });
      if (!V) {
        var x = C.above(u, { match: (P) => T.isElement(P) && C.isBlock(u, P) });
        if (z && x) {
          var [m, N] = z,
            [, _] = x;
          S.isAncestor(_, N) && (M = m);
        }
      }
    }
    var { text: J } = M,
      le = en(M, Hp);
    return le;
  },
  qp = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { mode: l = 'lowest', voids: s = !1 } = r,
      { match: c, at: D = u.selection } = r;
    if (D) {
      var d = C.after(u, D, { voids: s });
      if (d) {
        var [, g] = C.last(u, []),
          h = [d.path, g];
        if (Me.isPath(D) && D.length === 0)
          throw new Error('Cannot get the next node from the root node!');
        if (c == null)
          if (Me.isPath(D)) {
            var [E] = C.parent(u, D);
            c = (B) => E.children.includes(B);
          } else c = () => !0;
        var [A] = C.nodes(u, { at: h, match: c, mode: l, voids: s });
        return A;
      }
    }
  },
  kp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s = C.path(u, r, l),
      c = T.get(u, s);
    return [c, s];
  };
function _p(n) {
  var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var {
        at: r = n.selection,
        mode: l = 'all',
        universal: s = !1,
        reverse: c = !1,
        voids: D = !1,
        pass: d,
      } = u,
      { match: g } = u;
    if ((g || (g = () => !0), !!r)) {
      var h, E;
      if (Me.isSpan(r)) ((h = r[0]), (E = r[1]));
      else {
        var A = C.path(n, r, { edge: 'start' }),
          B = C.path(n, r, { edge: 'end' });
        ((h = c ? B : A), (E = c ? A : B));
      }
      var F = T.nodes(n, {
          reverse: c,
          from: h,
          to: E,
          pass: (_) => {
            var [J, le] = _;
            return d && d([J, le])
              ? !0
              : T.isElement(J)
                ? !!(!D && (C.isVoid(n, J) || C.isElementReadOnly(n, J)))
                : !1;
          },
        }),
        M = [],
        z;
      for (var [V, x] of F) {
        var m = z && S.compare(x, z[1]) === 0;
        if (!(l === 'highest' && m)) {
          if (!g(V, x)) {
            if (s && !m && T.isText(V)) return;
            continue;
          }
          if (l === 'lowest' && m) {
            z = [V, x];
            continue;
          }
          var N = l === 'lowest' ? z : [V, x];
          (N && (s ? M.push(N) : yield N), (z = [V, x]));
        }
      }
      (l === 'lowest' && z && (s ? M.push(z) : yield z), s && (yield* M));
    }
  })();
}
var Gp = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { force: l = !1, operation: s } = r,
      c = (E) => _i.get(E) || [],
      D = (E) => Gi.get(E) || new Set(),
      d = (E) => {
        var A = c(E).pop(),
          B = A.join(',');
        return (D(E).delete(B), A);
      };
    if (C.isNormalizing(u)) {
      if (l) {
        var g = Array.from(T.nodes(u), (E) => {
            var [, A] = E;
            return A;
          }),
          h = new Set(g.map((E) => E.join(',')));
        (_i.set(u, g), Gi.set(u, h));
      }
      c(u).length !== 0 &&
        C.withoutNormalizing(u, () => {
          for (var E of c(u))
            if (T.has(u, E)) {
              var A = C.node(u, E),
                [B, F] = A;
              T.isElement(B) &&
                B.children.length === 0 &&
                u.normalizeNode(A, { operation: s, force: l });
            }
          for (var M = c(u), z = M.length, V = 0; M.length !== 0;) {
            if (
              !u.shouldNormalize({
                dirtyPaths: M,
                iteration: V,
                initialDirtyPathsLength: z,
                operation: s,
              })
            )
              return;
            var x = d(u);
            if (T.has(u, x)) {
              var m = C.node(u, x);
              u.normalizeNode(m, { operation: s, force: l });
            }
            (V++, (M = c(u)));
          }
        });
    }
  },
  Yp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s = C.path(u, r, l),
      c = S.parent(s),
      D = C.node(u, c);
    return D;
  },
  Vp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { affinity: s = 'forward' } = l,
      c = {
        current: r,
        affinity: s,
        unref() {
          var { current: d } = c,
            g = C.pathRefs(u);
          return (g.delete(c), (c.current = null), d);
        },
      },
      D = C.pathRefs(u);
    return (D.add(c), c);
  },
  Xp = (n) => {
    var u = vv.get(n);
    return (u || ((u = new Set()), vv.set(n, u)), u);
  },
  Kp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { depth: s, edge: c } = l;
    if (Me.isPath(r)) {
      if (c === 'start') {
        var [, D] = T.first(u, r);
        r = D;
      } else if (c === 'end') {
        var [, d] = T.last(u, r);
        r = d;
      }
    }
    return (
      Me.isRange(r) &&
        (c === 'start'
          ? (r = I.start(r))
          : c === 'end'
            ? (r = I.end(r))
            : (r = S.common(r.anchor.path, r.focus.path))),
      Me.isPoint(r) && (r = r.path),
      s != null && (r = r.slice(0, s)),
      r
    );
  },
  Qp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { affinity: s = 'forward' } = l,
      c = {
        current: r,
        affinity: s,
        unref() {
          var { current: d } = c,
            g = C.pointRefs(u);
          return (g.delete(c), (c.current = null), d);
        },
      },
      D = C.pointRefs(u);
    return (D.add(c), c);
  },
  Zp = (n) => {
    var u = hv.get(n);
    return (u || ((u = new Set()), hv.set(n, u)), u);
  },
  Pp = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { edge: s = 'start' } = l;
    if (Me.isPath(r)) {
      var c;
      if (s === 'end') {
        var [, D] = T.last(u, r);
        c = D;
      } else {
        var [, d] = T.first(u, r);
        c = d;
      }
      var g = T.get(u, c);
      if (!T.isText(g))
        throw new Error(
          'Cannot get the '
            .concat(s, ' point in the node at path [')
            .concat(r, '] because it has no ')
            .concat(s, ' text node.'),
        );
      return { path: c, offset: s === 'end' ? g.text.length : 0 };
    }
    if (Me.isRange(r)) {
      var [h, E] = I.edges(r);
      return s === 'start' ? h : E;
    }
    return r;
  };
function Jp(n) {
  var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var { at: r = n.selection, unit: l = 'offset', reverse: s = !1, voids: c = !1 } = u;
    if (!r) return;
    var D = C.range(n, r),
      [d, g] = I.edges(D),
      h = s ? g : d,
      E = !1,
      A = '',
      B = 0,
      F = 0,
      M = 0,
      z = [],
      V = function* (le) {
        var P = z.some((Z) => S.isAncestor(Z, le));
        function* se(Z) {
          P || (yield Z);
        }
        if (T.isElement(m)) {
          if (!n.isSelectable(m)) {
            if ((z.push(le), s))
              return (S.hasPrevious(le) && (yield* se(C.end(n, S.previous(le)))), 0);
            var fe = S.next(le);
            return (C.hasPath(n, fe) && (yield* se(C.start(n, fe))), 0);
          }
          if (!c && (n.isVoid(m) || n.isElementReadOnly(m))) return (yield* se(C.start(n, le)), 0);
          if (n.isInline(m)) return 0;
          if (C.hasInlines(n, m)) {
            var ve = S.isAncestor(le, g.path) ? g : C.end(n, le),
              de = S.isAncestor(le, d.path) ? d : C.start(n, le);
            ((A = C.string(n, { anchor: de, focus: ve }, { voids: c })), (E = !0));
          }
        }
        if (T.isText(m)) {
          var ee = S.equals(le, h.path);
          for (
            ee
              ? ((F = s ? h.offset : m.text.length - h.offset), (M = h.offset))
              : ((F = m.text.length), (M = s ? F : 0)),
              (ee || E || l === 'offset') && (yield* se({ path: le, offset: M }), (E = !1));
            ;
          ) {
            if (B === 0) {
              if (A === '') break;
              ((B = _(A, l, s)), (A = Jo(A, B, s)[1]));
            }
            if (((M = s ? M - B : M + B), (F = F - B), F < 0)) {
              B = -F;
              break;
            }
            ((B = 0), yield* se({ path: le, offset: M }));
          }
        }
      },
      x;
    for (var [m, N] of C.nodes(n, { at: r, reverse: s, voids: c })) x = yield* V(N);
    function _(J, le, P) {
      return le === 'character'
        ? Po(J, P)
        : le === 'word'
          ? AC(J, P)
          : le === 'line' || le === 'block'
            ? J.length
            : 1;
    }
  })();
}
var Wp = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { mode: l = 'lowest', voids: s = !1 } = r,
      { match: c, at: D = u.selection } = r;
    if (D) {
      var d = C.before(u, D, { voids: s });
      if (d) {
        var [, g] = C.first(u, []),
          h = [d.path, g];
        if (Me.isPath(D) && D.length === 0)
          throw new Error('Cannot get the previous node from the root node!');
        if (c == null)
          if (Me.isPath(D)) {
            var [E] = C.parent(u, D);
            c = (B) => E.children.includes(B);
          } else c = () => !0;
        var [A] = C.nodes(u, { reverse: !0, at: h, match: c, mode: l, voids: s });
        return A;
      }
    }
  },
  $p = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { affinity: s = 'forward' } = l,
      c = {
        current: r,
        affinity: s,
        unref() {
          var { current: d } = c,
            g = C.rangeRefs(u);
          return (g.delete(c), (c.current = null), d);
        },
      },
      D = C.rangeRefs(u);
    return (D.add(c), c);
  },
  Ip = (n) => {
    var u = gv.get(n);
    return (u || ((u = new Set()), gv.set(n, u)), u);
  },
  eE = (n, u, r) => {
    if (Me.isRange(u) && !r) return u;
    var l = C.start(n, u),
      s = C.end(n, r || u);
    return { anchor: l, focus: s };
  };
function Gv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function tE(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Gv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Gv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var uE = (n, u) => {
    var { selection: r } = n;
    if (r) {
      var l = (E, A) => {
          if (!T.isText(E)) return !1;
          var [B, F] = C.parent(n, A);
          return !n.isVoid(B) || n.markableVoid(B);
        },
        s = I.isExpanded(r),
        c = !1;
      if (!s) {
        var [D, d] = C.node(n, r);
        if (D && l(D, d)) {
          var [g] = C.parent(n, d);
          c = g && n.markableVoid(g);
        }
      }
      if (s || c) re.unsetNodes(n, u, { match: l, split: !0, voids: !0 });
      else {
        var h = tE({}, C.marks(n) || {});
        (delete h[u], (n.marks = h), Jr.get(n) || n.onChange());
      }
    }
  },
  nE = (n, u) => {
    Ph.set(n, u);
  },
  aE = (n, u) => C.point(n, u, { edge: 'start' }),
  rE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { voids: s = !1 } = l,
      c = C.range(u, r),
      [D, d] = I.edges(c),
      g = '';
    for (var [h, E] of C.nodes(u, { at: c, match: T.isText, voids: s })) {
      var A = h.text;
      (S.equals(E, d.path) && (A = A.slice(0, d.offset)),
        S.equals(E, D.path) && (A = A.slice(D.offset)),
        (g += A));
    }
    return g;
  },
  lE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { voids: s = !1 } = l,
      [c, D] = I.edges(r);
    if (c.offset !== 0 || D.offset !== 0 || I.isCollapsed(r) || S.hasPrevious(D.path)) return r;
    var d = C.above(u, { at: D, match: (M) => T.isElement(M) && C.isBlock(u, M), voids: s }),
      g = d ? d[1] : [],
      h = C.start(u, c),
      E = { anchor: h, focus: D },
      A = !0;
    for (var [B, F] of C.nodes(u, { at: E, match: T.isText, reverse: !0, voids: s })) {
      if (A) {
        A = !1;
        continue;
      }
      if (B.text !== '' || S.isBefore(F, g)) {
        D = { path: F, offset: B.text.length };
        break;
      }
    }
    return { anchor: c, focus: D };
  },
  iE = (n, u) => {
    var r = C.isNormalizing(n);
    C.setNormalizing(n, !1);
    try {
      u();
    } finally {
      C.setNormalizing(n, r);
    }
    C.normalize(n);
  },
  sE = (n, u, r) => {
    var [l, s] = u,
      [c, D] = r;
    return (
      (T.isElement(l) && C.isEmpty(n, l)) || (T.isText(l) && l.text === '' && s[s.length - 1] !== 0)
    );
  },
  fE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    C.withoutNormalizing(u, () => {
      var l,
        s,
        { reverse: c = !1, unit: D = 'character', distance: d = 1, voids: g = !1 } = r,
        { at: h = u.selection, hanging: E = !1 } = r;
      if (h) {
        var A = !1;
        if ((Me.isRange(h) && I.isCollapsed(h) && ((A = !0), (h = h.anchor)), Me.isPoint(h))) {
          var B = C.void(u, { at: h, mode: 'highest' });
          if (!g && B) {
            var [, F] = B;
            h = F;
          } else {
            var M = { unit: D, distance: d },
              z = c ? C.before(u, h, M) || C.start(u, []) : C.after(u, h, M) || C.end(u, []);
            ((h = { anchor: h, focus: z }), (E = !0));
          }
        }
        if (Me.isPath(h)) {
          re.removeNodes(u, { at: h, voids: g });
          return;
        }
        if (!I.isCollapsed(h)) {
          if (!E) {
            var [, V] = I.edges(h),
              x = C.end(u, []);
            Qe.equals(V, x) || (h = C.unhangRange(u, h, { voids: g }));
          }
          var [m, N] = I.edges(h),
            _ = C.above(u, { match: (Ee) => T.isElement(Ee) && C.isBlock(u, Ee), at: m, voids: g }),
            J = C.above(u, { match: (Ee) => T.isElement(Ee) && C.isBlock(u, Ee), at: N, voids: g }),
            le = _ && J && !S.equals(_[1], J[1]),
            P = S.equals(m.path, N.path),
            se = g
              ? null
              : (l = C.void(u, { at: m, mode: 'highest' })) !== null && l !== void 0
                ? l
                : C.elementReadOnly(u, { at: m, mode: 'highest' }),
            fe = g
              ? null
              : (s = C.void(u, { at: N, mode: 'highest' })) !== null && s !== void 0
                ? s
                : C.elementReadOnly(u, { at: N, mode: 'highest' });
          if (se) {
            var ve = C.before(u, m);
            ve && _ && S.isAncestor(_[1], ve.path) && (m = ve);
          }
          if (fe) {
            var de = C.after(u, N);
            de && J && S.isAncestor(J[1], de.path) && (N = de);
          }
          var ee = [],
            Z;
          for (var ne of C.nodes(u, { at: h, voids: g })) {
            var [ae, R] = ne;
            (Z && S.compare(R, Z) === 0) ||
              (((!g && T.isElement(ae) && (C.isVoid(u, ae) || C.isElementReadOnly(u, ae))) ||
                (!S.isCommon(R, m.path) && !S.isCommon(R, N.path))) &&
                (ee.push(ne), (Z = R)));
          }
          var G = Array.from(ee, (Ee) => {
              var [, ye] = Ee;
              return C.pathRef(u, ye);
            }),
            De = C.pointRef(u, m),
            he = C.pointRef(u, N),
            Ce = '';
          if (!P && !se) {
            var y = De.current,
              [q] = C.leaf(u, y),
              { path: K } = y,
              { offset: W } = m,
              ge = q.text.slice(W);
            ge.length > 0 &&
              (u.apply({ type: 'remove_text', path: K, offset: W, text: ge }), (Ce = ge));
          }
          if (
            (G.reverse()
              .map((Ee) => Ee.unref())
              .filter((Ee) => Ee !== null)
              .forEach((Ee) => re.removeNodes(u, { at: Ee, voids: g })),
            !fe)
          ) {
            var Ae = he.current,
              [xe] = C.leaf(u, Ae),
              { path: Ke } = Ae,
              ze = P ? m.offset : 0,
              w = xe.text.slice(ze, N.offset);
            w.length > 0 &&
              (u.apply({ type: 'remove_text', path: Ke, offset: ze, text: w }), (Ce = w));
          }
          (!P &&
            le &&
            he.current &&
            De.current &&
            re.mergeNodes(u, { at: he.current, hanging: !0, voids: g }),
            A &&
              c &&
              D === 'character' &&
              Ce.length > 1 &&
              Ce.match(
                /[\u0980-\u09FF\u0E00-\u0E7F\u1000-\u109F\u0900-\u097F\u1780-\u17FF\u0D00-\u0D7F\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F]+/,
              ) &&
              re.insertText(u, Ce.slice(0, Ce.length - d)));
          var ie = De.unref(),
            ue = he.unref(),
            oe = c ? ie || ue : ue || ie;
          r.at == null && oe && re.select(u, oe);
        }
      }
    });
  },
  oE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    C.withoutNormalizing(u, () => {
      var { hanging: s = !1, voids: c = !1 } = l,
        { at: D = Zo(u), batchDirty: d = !0 } = l;
      if (r.length) {
        if (Me.isRange(D))
          if ((s || (D = C.unhangRange(u, D, { voids: c })), I.isCollapsed(D))) D = D.anchor;
          else {
            var [, g] = I.edges(D);
            if (!c && C.void(u, { at: g })) return;
            var h = C.pointRef(u, g);
            (re.delete(u, { at: D }), (D = h.unref()));
          }
        else Me.isPath(D) && (D = C.start(u, D));
        if (!(!c && C.void(u, { at: D }))) {
          var E = C.above(u, {
            at: D,
            match: (K) => T.isElement(K) && C.isInline(u, K),
            mode: 'highest',
            voids: c,
          });
          if (E) {
            var [, A] = E;
            if (C.isEnd(u, D, A)) {
              var B = C.after(u, A);
              D = B;
            } else if (C.isStart(u, D, A)) {
              var F = C.before(u, A);
              D = F;
            }
          }
          var M = C.above(u, { match: (K) => T.isElement(K) && C.isBlock(u, K), at: D, voids: c }),
            [, z] = M,
            V = C.isStart(u, D, z),
            x = C.isEnd(u, D, z),
            m = V && x,
            [, N] = T.first({ children: r }, []),
            [, _] = T.last({ children: r }, []),
            J = (K) => {
              var [W, ge] = K,
                Ae = ge.length === 0;
              return Ae
                ? !1
                : m
                  ? !0
                  : !(
                      (!V &&
                        S.isAncestor(ge, N) &&
                        T.isElement(W) &&
                        !u.isVoid(W) &&
                        !u.isInline(W)) ||
                      (!x &&
                        S.isAncestor(ge, _) &&
                        T.isElement(W) &&
                        !u.isVoid(W) &&
                        !u.isInline(W))
                    );
            },
            le = !0,
            P = [],
            se = [],
            fe = [];
          for (var ve of T.nodes({ children: r }, { pass: J })) {
            var [de, ee] = ve;
            (le && T.isElement(de) && !u.isInline(de) && !S.isAncestor(ee, N) && (le = !1),
              J(ve) &&
                (T.isElement(de) && !u.isInline(de)
                  ? ((le = !1), se.push(de))
                  : le
                    ? P.push(de)
                    : fe.push(de)));
          }
          var [Z] = C.nodes(u, {
              at: D,
              match: (K) => T.isText(K) || C.isInline(u, K),
              mode: 'highest',
              voids: c,
            }),
            [, ne] = Z,
            ae = C.isStart(u, D, ne),
            R = C.isEnd(u, D, ne),
            G = C.pathRef(u, x && !fe.length ? S.next(z) : z),
            De = C.pathRef(u, R ? S.next(ne) : ne),
            he = fe.length > 0;
          re.splitNodes(u, {
            at: D,
            match: (K) =>
              he ? T.isElement(K) && C.isBlock(u, K) : T.isText(K) || C.isInline(u, K),
            mode: he ? 'lowest' : 'highest',
            always: he && (!V || P.length > 0) && (!x || fe.length > 0),
            voids: c,
          });
          var Ce = C.pathRef(u, !ae || (ae && R) ? S.next(ne) : ne);
          if (
            (re.insertNodes(u, P, {
              at: Ce.current,
              match: (K) => T.isText(K) || C.isInline(u, K),
              mode: 'highest',
              voids: c,
              batchDirty: d,
            }),
            m && !P.length && se.length && !fe.length && re.delete(u, { at: z, voids: c }),
            re.insertNodes(u, se, {
              at: G.current,
              match: (K) => T.isElement(K) && C.isBlock(u, K),
              mode: 'lowest',
              voids: c,
              batchDirty: d,
            }),
            re.insertNodes(u, fe, {
              at: De.current,
              match: (K) => T.isText(K) || C.isInline(u, K),
              mode: 'highest',
              voids: c,
              batchDirty: d,
            }),
            !l.at)
          ) {
            var y;
            if (
              (fe.length > 0 && De.current
                ? (y = S.previous(De.current))
                : se.length > 0 && G.current
                  ? (y = S.previous(G.current))
                  : Ce.current && (y = S.previous(Ce.current)),
              y)
            ) {
              var q = C.end(u, y);
              re.select(u, q);
            }
          }
          (Ce.unref(), G.unref(), De.unref());
        }
      }
    });
  },
  cE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { edge: l = 'anchor' } = r,
      { selection: s } = u;
    if (s) {
      if (l === 'anchor') re.select(u, s.anchor);
      else if (l === 'focus') re.select(u, s.focus);
      else if (l === 'start') {
        var [c] = I.edges(s);
        re.select(u, c);
      } else if (l === 'end') {
        var [, D] = I.edges(s);
        re.select(u, D);
      }
    } else return;
  },
  dE = (n) => {
    var { selection: u } = n;
    u && n.apply({ type: 'set_selection', properties: u, newProperties: null });
  },
  DE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { selection: l } = u,
      { distance: s = 1, unit: c = 'character', reverse: D = !1 } = r,
      { edge: d = null } = r;
    if (l) {
      (d === 'start' && (d = I.isBackward(l) ? 'focus' : 'anchor'),
        d === 'end' && (d = I.isBackward(l) ? 'anchor' : 'focus'));
      var { anchor: g, focus: h } = l,
        E = { distance: s, unit: c },
        A = {};
      if (d == null || d === 'anchor') {
        var B = D ? C.before(u, g, E) : C.after(u, g, E);
        B && (A.anchor = B);
      }
      if (d == null || d === 'focus') {
        var F = D ? C.before(u, h, E) : C.after(u, h, E);
        F && (A.focus = F);
      }
      re.setSelection(u, A);
    }
  },
  vE = (n, u) => {
    var { selection: r } = n;
    if (((u = C.range(n, u)), r)) {
      re.setSelection(n, u);
      return;
    }
    if (!Me.isRange(u))
      throw new Error(
        'When setting the selection and the current selection is `null` you must provide at least an `anchor` and `focus`, but you passed: '.concat(
          Bt.stringify(u),
        ),
      );
    n.apply({ type: 'set_selection', properties: r, newProperties: u });
  };
function Yv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Vv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Yv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Yv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var hE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      { selection: s } = u,
      { edge: c = 'both' } = l;
    if (s) {
      (c === 'start' && (c = I.isBackward(s) ? 'focus' : 'anchor'),
        c === 'end' && (c = I.isBackward(s) ? 'anchor' : 'focus'));
      var { anchor: D, focus: d } = s,
        g = c === 'anchor' ? D : d;
      re.setSelection(u, { [c === 'anchor' ? 'anchor' : 'focus']: Vv(Vv({}, g), r) });
    }
  },
  gE = (n, u) => {
    var { selection: r } = n,
      l = {},
      s = {};
    if (r) {
      for (var c in u)
        if (!Wh.includes(c)) {
          var D = Object.hasOwn(r, c) ? r[c] : void 0,
            d = u[c];
          mE(c, D, d) && ((l[c] = r[c]), (s[c] = u[c]));
        }
      Object.keys(l).length > 0 &&
        n.apply({ type: 'set_selection', properties: l, newProperties: s });
    }
  };
function mE(n, u, r) {
  return (n === 'anchor' || n === 'focus') && Qe.isPoint(u) && Qe.isPoint(r)
    ? !Qe.equals(u, r)
    : u !== r;
}
var CE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    C.withoutNormalizing(u, () => {
      var { hanging: s = !1, voids: c = !1, mode: D = 'lowest', batchDirty: d = !0 } = l,
        { at: g, match: h, select: E } = l;
      if ((T.isNode(r) && (r = [r]), r.length !== 0)) {
        var [A] = r;
        if ((g || ((g = Zo(u)), E !== !1 && (E = !0)), E == null && (E = !1), Me.isRange(g)))
          if ((s || (g = C.unhangRange(u, g, { voids: c })), I.isCollapsed(g))) g = g.anchor;
          else {
            var [, B] = I.edges(g),
              F = C.pointRef(u, B);
            (re.delete(u, { at: g }), (g = F.unref()));
          }
        if (Me.isPoint(g)) {
          h == null &&
            (T.isText(A)
              ? (h = (ve) => T.isText(ve))
              : u.isInline(A)
                ? (h = (ve) => T.isText(ve) || C.isInline(u, ve))
                : (h = (ve) => T.isElement(ve) && C.isBlock(u, ve)));
          var [M] = C.nodes(u, { at: g.path, match: h, mode: D, voids: c });
          if (M) {
            var [, z] = M,
              V = C.pathRef(u, z),
              x = C.isEnd(u, g, z);
            re.splitNodes(u, { at: g, match: h, mode: D, voids: c });
            var m = V.unref();
            g = x ? S.next(m) : m;
          } else return;
        }
        var N = S.parent(g),
          _ = g[g.length - 1];
        if (!(!c && C.void(u, { at: N }))) {
          if (d) {
            var J = [],
              le = S.levels(N);
            IC(
              u,
              () => {
                var ve = function () {
                  var Z = N.concat(_);
                  _++;
                  var ne = { type: 'insert_node', path: Z, node: de };
                  (u.apply(ne),
                    (g = S.next(g)),
                    J.push(ne),
                    T.isText(de)
                      ? le.push(Z)
                      : le.push(
                          ...Array.from(T.nodes(de), (ae) => {
                            var [, R] = ae;
                            return Z.concat(R);
                          }),
                        ));
                };
                for (var de of r) ve();
              },
              () => {
                $h(u, le, (ve) => {
                  var de = ve;
                  for (var ee of J)
                    if (S.operationCanTransformPath(ee) && ((de = S.transform(de, ee)), !de))
                      return null;
                  return de;
                });
              },
            );
          } else
            for (var P of r) {
              var se = N.concat(_);
              (_++, u.apply({ type: 'insert_node', path: se, node: P }), (g = S.next(g)));
            }
          if (((g = S.previous(g)), E)) {
            var fe = C.end(u, g);
            fe && re.select(u, fe);
          }
        }
      }
    });
  },
  pE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    C.withoutNormalizing(u, () => {
      var { at: l = u.selection, mode: s = 'lowest', voids: c = !1 } = r,
        { match: D } = r;
      if (l) {
        D == null && (D = Me.isPath(l) ? Ia(u, l) : (_) => T.isElement(_) && C.isBlock(u, _));
        var d = C.nodes(u, { at: l, match: D, mode: s, voids: c }),
          g = Array.from(d, (_) => {
            var [, J] = _;
            return C.pathRef(u, J);
          });
        for (var h of g) {
          var E = h.unref();
          if (E.length < 2)
            throw new Error(
              'Cannot lift node at a path ['.concat(
                E,
                '] because it has a depth of less than `2`.',
              ),
            );
          var A = C.node(u, S.parent(E)),
            [B, F] = A,
            M = E[E.length - 1],
            { length: z } = B.children;
          if (z === 1) {
            var V = S.next(F);
            (re.moveNodes(u, { at: E, to: V, voids: c }), re.removeNodes(u, { at: F, voids: c }));
          } else if (M === 0) re.moveNodes(u, { at: E, to: F, voids: c });
          else if (M === z - 1) {
            var x = S.next(F);
            re.moveNodes(u, { at: E, to: x, voids: c });
          } else {
            var m = S.next(E),
              N = S.next(F);
            (re.splitNodes(u, { at: m, voids: c }), re.moveNodes(u, { at: E, to: N, voids: c }));
          }
        }
      }
    });
  },
  EE = ['text'],
  AE = ['children'],
  Ih = (n, u) =>
    u !== n && (T.isText(u) || C.isVoid(n, u) || (u.children.length === 1 && Ih(n, u.children[0]))),
  BE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    C.withoutNormalizing(u, () => {
      var { match: l, at: s = u.selection } = r,
        { hanging: c = !1, voids: D = !1, mode: d = 'lowest' } = r;
      if (s) {
        var g = Me.isPath(s),
          h = g ? s : null,
          E = l == null && g;
        if (l == null)
          if (g) {
            var [A] = C.parent(u, s);
            l = (R) => A.children.includes(R);
          } else l = (R) => T.isElement(R) && C.isBlock(u, R);
        if ((!c && Me.isRange(s) && (s = C.unhangRange(u, s, { voids: D })), Me.isRange(s)))
          if (I.isCollapsed(s)) s = s.anchor;
          else {
            var [, B] = I.edges(s),
              F = C.pointRef(u, B);
            (re.delete(u, { at: s }), (s = F.unref()), r.at == null && re.select(u, s));
          }
        var [M] = C.nodes(u, { at: s, match: l, voids: D, mode: d }),
          z = E && h && S.hasPrevious(h) ? S.previous(h) : null,
          V = z ? C.node(u, z) : C.previous(u, { at: s, match: l, voids: D, mode: d });
        if (!(!M || !V)) {
          var [x, m] = M,
            [N, _] = V;
          if (!(m.length === 0 || _.length === 0)) {
            var J = S.next(_),
              le = S.common(m, _),
              P = S.isSibling(m, _),
              se = Array.from(C.levels(u, { at: m }), (R) => {
                var [G] = R;
                return G;
              })
                .slice(le.length)
                .slice(0, -1),
              fe = C.above(u, { at: m, mode: 'highest', match: (R) => se.includes(R) && Ih(u, R) }),
              ve = fe && C.pathRef(u, fe[1]),
              de,
              ee;
            if (T.isText(x) && T.isText(N)) {
              var { text: Z } = x,
                ne = en(x, EE);
              ((ee = N.text.length), (de = ne));
            } else if (T.isElement(x) && T.isElement(N)) {
              var { children: ae } = x,
                ne = en(x, AE);
              ((ee = N.children.length), (de = ne));
            } else
              throw new Error(
                'Cannot merge the node at path ['
                  .concat(m, '] with the previous sibling because it is not the same kind: ')
                  .concat(Bt.stringify(x), ' ')
                  .concat(Bt.stringify(N)),
              );
            (P || re.moveNodes(u, { at: m, to: J, voids: D }),
              ve && re.removeNodes(u, { at: ve.current, voids: D }),
              C.shouldMergeNodesRemovePrevNode(u, V, M)
                ? re.removeNodes(u, { at: _, voids: D })
                : u.apply({ type: 'merge_node', path: J, position: ee, properties: de }),
              ve && ve.unref());
          }
        }
      }
    });
  },
  yE = (n, u) => {
    C.withoutNormalizing(n, () => {
      var { to: r, at: l = n.selection, mode: s = 'lowest', voids: c = !1 } = u,
        { match: D } = u;
      if (l) {
        D == null && (D = Me.isPath(l) ? Ia(n, l) : (F) => T.isElement(F) && C.isBlock(n, F));
        var d = C.pathRef(n, r),
          g = C.nodes(n, { at: l, match: D, mode: s, voids: c }),
          h = Array.from(g, (F) => {
            var [, M] = F;
            return C.pathRef(n, M);
          });
        for (var E of h) {
          var A = E.unref(),
            B = d.current;
          (A.length !== 0 && n.apply({ type: 'move_node', path: A, newPath: B }),
            d.current && S.isSibling(B, A) && S.isAfter(B, A) && (d.current = S.next(d.current)));
        }
        d.unref();
      }
    });
  },
  bE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    C.withoutNormalizing(u, () => {
      var { hanging: l = !1, voids: s = !1, mode: c = 'lowest' } = r,
        { at: D = u.selection, match: d } = r;
      if (D) {
        (d == null && (d = Me.isPath(D) ? Ia(u, D) : (F) => T.isElement(F) && C.isBlock(u, F)),
          !l && Me.isRange(D) && (D = C.unhangRange(u, D, { voids: s })));
        var g = C.nodes(u, { at: D, match: d, mode: c, voids: s }),
          h = Array.from(g, (F) => {
            var [, M] = F;
            return C.pathRef(u, M);
          });
        for (var E of h) {
          var A = E.unref();
          if (A) {
            var [B] = C.node(u, A);
            u.apply({ type: 'remove_node', path: A, node: B });
          }
        }
      }
    });
  },
  FE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    C.withoutNormalizing(u, () => {
      var { match: s, at: c = u.selection, compare: D, merge: d } = l,
        { hanging: g = !1, mode: h = 'lowest', split: E = !1, voids: A = !1 } = l;
      if (c) {
        if (
          (s == null && (s = Me.isPath(c) ? Ia(u, c) : (ve) => T.isElement(ve) && C.isBlock(u, ve)),
          !g && Me.isRange(c) && (c = C.unhangRange(u, c, { voids: A })),
          E && Me.isRange(c))
        ) {
          if (I.isCollapsed(c) && C.leaf(u, c.anchor)[0].text.length > 0) return;
          var B = C.rangeRef(u, c, { affinity: 'inward' }),
            [F, M] = I.edges(c),
            z = h === 'lowest' ? 'lowest' : 'highest',
            V = C.isEnd(u, M, M.path);
          re.splitNodes(u, { at: M, match: s, mode: z, voids: A, always: !V });
          var x = C.isStart(u, F, F.path);
          (re.splitNodes(u, { at: F, match: s, mode: z, voids: A, always: !x }),
            (c = B.unref()),
            l.at == null && re.select(u, c));
        }
        D || (D = (ve, de) => ve !== de);
        for (var [m, N] of C.nodes(u, { at: c, match: s, mode: h, voids: A })) {
          var _ = {},
            J = {};
          if (N.length !== 0) {
            var le = !1;
            for (var P in r)
              if (!Uo.includes(P)) {
                var se = Object.hasOwn(m, P) ? m[P] : void 0,
                  fe = r[P];
                D(fe, se) &&
                  ((le = !0),
                  Object.hasOwn(m, P) && (_[P] = se),
                  d ? fe != null && (J[P] = d(se, fe)) : fe != null && (J[P] = fe));
              }
            le && u.apply({ type: 'set_node', path: N, properties: _, newProperties: J });
          }
        }
      }
    });
  },
  SE = (n, u) => {
    if (I.isCollapsed(u)) return u.anchor;
    var [, r] = I.edges(u),
      l = C.pointRef(n, r);
    return (re.delete(n, { at: u }), l.unref());
  },
  OE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    C.withoutNormalizing(u, () => {
      var { mode: l = 'lowest', voids: s = !1 } = r,
        { match: c, at: D = u.selection, height: d = 0, always: g = !1 } = r;
      if (
        D &&
        (c == null && (c = (he) => T.isElement(he) && C.isBlock(u, he)),
        !(Me.isRange(D) && ((D = SE(u, D)), !D)))
      ) {
        if (Me.isPath(D)) {
          var h = D,
            E = C.point(u, h),
            [A] = C.parent(u, h);
          ((c = (he) => he === A), (d = E.path.length - h.length + 1), (D = E), (g = !0));
        }
        var B = C.pointRef(u, D, { affinity: 'backward' }),
          F;
        try {
          var [M] = C.nodes(u, { at: D, match: c, mode: l, voids: s });
          if (!M) return;
          var z = C.void(u, { at: D, mode: 'highest' }),
            V = 0;
          if (!s && z) {
            var [x, m] = z;
            if (u.isInline(x)) {
              var N = C.after(u, m);
              if (!N) {
                var _ = { text: '' },
                  J = S.next(m);
                (re.insertNodes(u, _, { at: J, voids: s }), (N = C.point(u, J)));
              }
              ((D = N), (g = !0));
            }
            var le = D.path.length - m.length;
            ((d = le + 1), (g = !0));
          }
          F = C.pointRef(u, D);
          var P = D.path.length - d,
            [, se] = M,
            fe = D.path.slice(0, P),
            ve = d === 0 ? D.offset : D.path[P] + V;
          for (var [de, ee] of C.levels(u, { at: fe, reverse: !0, voids: s })) {
            var Z = !1;
            if (
              ee.length < se.length ||
              ee.length === 0 ||
              (!s && T.isElement(de) && C.isVoid(u, de))
            )
              break;
            var ne = B.current,
              ae = C.isEnd(u, ne, ee);
            if (g || !B || !C.isEdge(u, ne, ee)) {
              Z = !0;
              var R = T.extractProps(de);
              u.apply({ type: 'split_node', path: ee, position: ve, properties: R });
            }
            ve = ee[ee.length - 1] + (Z || ae ? 1 : 0);
          }
          if (r.at == null) {
            var G = F.current || C.end(u, []);
            re.select(u, G);
          }
        } finally {
          var De;
          (B.unref(), (De = F) === null || De === void 0 || De.unref());
        }
      }
    });
  },
  xE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Array.isArray(r) || (r = [r]);
    var s = {};
    for (var c of r) s[c] = null;
    re.setNodes(u, s, l);
  },
  TE = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    C.withoutNormalizing(u, () => {
      var { mode: l = 'lowest', split: s = !1, voids: c = !1 } = r,
        { at: D = u.selection, match: d } = r;
      if (D) {
        (d == null && (d = Me.isPath(D) ? Ia(u, D) : (F) => T.isElement(F) && C.isBlock(u, F)),
          Me.isPath(D) && (D = C.range(u, D)));
        var g = Me.isRange(D) ? C.rangeRef(u, D) : null,
          h = C.nodes(u, { at: D, match: d, mode: l, voids: c }),
          E = Array.from(h, (F) => {
            var [, M] = F;
            return C.pathRef(u, M);
          }).reverse(),
          A = function () {
            var M = B.unref(),
              [z] = C.node(u, M),
              V = C.range(u, M);
            (s && g && (V = I.intersection(g.current, V)),
              re.liftNodes(u, {
                at: V,
                match: (x) => !T.isText(z) && z.children.includes(x),
                voids: c,
              }));
          };
        for (var B of E) A();
        g && g.unref();
      }
    });
  };
function Xv(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Kv(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Xv(Object(r), !0).forEach(function (l) {
          zt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Xv(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var wE = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    C.withoutNormalizing(u, () => {
      var { mode: s = 'lowest', split: c = !1, voids: D = !1 } = l,
        { match: d, at: g = u.selection } = l;
      if (g) {
        if (
          (d == null &&
            (Me.isPath(g)
              ? (d = Ia(u, g))
              : u.isInline(r)
                ? (d = (x) => (T.isElement(x) && C.isInline(u, x)) || T.isText(x))
                : (d = (x) => T.isElement(x) && C.isBlock(u, x))),
          c && Me.isRange(g))
        ) {
          var [h, E] = I.edges(g),
            A = C.rangeRef(u, g, { affinity: 'inward' }),
            B = (x) => {
              var m = C.above(u, { at: x, match: (N) => T.isElement(N) && C.isBlock(u, N) });
              return m && C.isEdge(u, x, m[1]);
            };
          (re.splitNodes(u, { at: E, match: d, voids: D, always: !B(E) }),
            re.splitNodes(u, { at: h, match: d, voids: D, always: !B(h) }),
            (g = A.unref()),
            l.at == null && re.select(u, g));
        }
        var F = Array.from(
            C.nodes(u, {
              at: g,
              match: u.isInline(r)
                ? (x) => T.isElement(x) && C.isBlock(u, x)
                : (x) => T.isEditor(x),
              mode: 'lowest',
              voids: D,
            }),
          ),
          M = function () {
            var m = Me.isRange(g) ? I.intersection(g, C.range(u, V)) : g;
            if (!m) return 0;
            var N = Array.from(C.nodes(u, { at: m, match: d, mode: s, voids: D }));
            if (N.length > 0) {
              var [_] = N,
                J = N[N.length - 1],
                [, le] = _,
                [, P] = J;
              if (le.length === 0 && P.length === 0) return 0;
              var se = S.equals(le, P) ? S.parent(le) : S.common(le, P),
                fe = C.range(u, le, P),
                ve = C.node(u, se),
                [de] = ve,
                ee = se.length + 1,
                Z = S.next(P.slice(0, ee)),
                ne = Kv(Kv({}, r), {}, { children: [] });
              (re.insertNodes(u, ne, { at: Z, voids: D }),
                re.moveNodes(u, {
                  at: fe,
                  match: (ae) => !T.isText(de) && de.children.includes(ae),
                  to: Z.concat(0),
                  voids: D,
                }));
            }
          },
          z;
        for (var [, V] of F) z = M();
      }
    });
  },
  ME = () => {
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
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return ep(n, ...l);
      },
      addMark: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return lp(n, ...l);
      },
      deleteBackward: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return fp(n, ...l);
      },
      deleteForward: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return op(n, ...l);
      },
      deleteFragment: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return cp(n, ...l);
      },
      getFragment: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return up(n, ...l);
      },
      insertBreak: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Bp(n, ...l);
      },
      insertSoftBreak: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return bp(n, ...l);
      },
      insertFragment: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return oE(n, ...l);
      },
      insertNode: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return yp(n, ...l);
      },
      insertText: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Sp(n, ...l);
      },
      normalizeNode: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return np(n, ...l);
      },
      removeMark: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return uE(n, ...l);
      },
      getDirtyPaths: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return tp(n, ...l);
      },
      shouldNormalize: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return ap(n, ...l);
      },
      above: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return rp(n, ...l);
      },
      after: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return ip(n, ...l);
      },
      before: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return sp(n, ...l);
      },
      collapse: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return cE(n, ...l);
      },
      delete: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return fE(n, ...l);
      },
      deselect: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return dE(n, ...l);
      },
      edges: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return dp(n, ...l);
      },
      elementReadOnly: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Dp(n, ...l);
      },
      end: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return vp(n, ...l);
      },
      first: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return hp(n, ...l);
      },
      fragment: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return gp(n, ...l);
      },
      getMarks: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Up(n, ...l);
      },
      hasBlocks: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Cp(n, ...l);
      },
      hasInlines: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return pp(n, ...l);
      },
      hasPath: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Ep(n, ...l);
      },
      hasTexts: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Ap(n, ...l);
      },
      insertNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return CE(n, ...l);
      },
      isBlock: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Op(n, ...l);
      },
      isEdge: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return xp(n, ...l);
      },
      isEmpty: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Tp(n, ...l);
      },
      isEnd: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return wp(n, ...l);
      },
      isNormalizing: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Mp(n, ...l);
      },
      isStart: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Rp(n, ...l);
      },
      last: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return jp(n, ...l);
      },
      leaf: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return zp(n, ...l);
      },
      levels: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Np(n, ...l);
      },
      liftNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return pE(n, ...l);
      },
      mergeNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return BE(n, ...l);
      },
      move: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return DE(n, ...l);
      },
      moveNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return yE(n, ...l);
      },
      next: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return qp(n, ...l);
      },
      node: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return kp(n, ...l);
      },
      nodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return _p(n, ...l);
      },
      normalize: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Gp(n, ...l);
      },
      parent: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Yp(n, ...l);
      },
      path: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Kp(n, ...l);
      },
      pathRef: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Vp(n, ...l);
      },
      pathRefs: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Xp(n, ...l);
      },
      point: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Pp(n, ...l);
      },
      pointRef: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Qp(n, ...l);
      },
      pointRefs: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Zp(n, ...l);
      },
      positions: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Jp(n, ...l);
      },
      previous: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Wp(n, ...l);
      },
      range: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return eE(n, ...l);
      },
      rangeRef: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return $p(n, ...l);
      },
      rangeRefs: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return Ip(n, ...l);
      },
      removeNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return bE(n, ...l);
      },
      select: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return vE(n, ...l);
      },
      setNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return FE(n, ...l);
      },
      setNormalizing: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return nE(n, ...l);
      },
      setPoint: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return hE(n, ...l);
      },
      setSelection: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return gE(n, ...l);
      },
      splitNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return OE(n, ...l);
      },
      start: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return aE(n, ...l);
      },
      string: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return rE(n, ...l);
      },
      unhangRange: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return lE(n, ...l);
      },
      unsetNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return xE(n, ...l);
      },
      unwrapNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return TE(n, ...l);
      },
      void: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return mp(n, ...l);
      },
      withoutNormalizing: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return iE(n, ...l);
      },
      wrapNodes: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return wE(n, ...l);
      },
      shouldMergeNodesRemovePrevNode: function () {
        for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
        return sE(n, ...l);
      },
    };
    return n;
  },
  vo,
  Qv;
function RE() {
  if (Qv) return vo;
  ((Qv = 1), (vo = s));
  var n = '֑-߿יִ-﷽ﹰ-ﻼ',
    u = 'A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿',
    r = new RegExp('^[^' + u + ']*[' + n + ']'),
    l = new RegExp('^[^' + n + ']*[' + u + ']');
  function s(c) {
    return ((c = String(c || '')), r.test(c) ? 'rtl' : l.test(c) ? 'ltr' : 'neutral');
  }
  return vo;
}
var jE = RE();
const eg = sl(jE);
var ho, Zv;
function $o() {
  if (Zv) return ho;
  Zv = 1;
  function n(u) {
    var r = typeof u;
    return u != null && (r == 'object' || r == 'function');
  }
  return ((ho = n), ho);
}
var go, Pv;
function zE() {
  if (Pv) return go;
  Pv = 1;
  var n = typeof Oi == 'object' && Oi && Oi.Object === Object && Oi;
  return ((go = n), go);
}
var mo, Jv;
function tg() {
  if (Jv) return mo;
  Jv = 1;
  var n = zE(),
    u = typeof self == 'object' && self && self.Object === Object && self,
    r = n || u || Function('return this')();
  return ((mo = r), mo);
}
var Co, Wv;
function NE() {
  if (Wv) return Co;
  Wv = 1;
  var n = tg(),
    u = function () {
      return n.Date.now();
    };
  return ((Co = u), Co);
}
var po, $v;
function LE() {
  if ($v) return po;
  $v = 1;
  var n = /\s/;
  function u(r) {
    for (var l = r.length; l-- && n.test(r.charAt(l)););
    return l;
  }
  return ((po = u), po);
}
var Eo, Iv;
function HE() {
  if (Iv) return Eo;
  Iv = 1;
  var n = LE(),
    u = /^\s+/;
  function r(l) {
    return l && l.slice(0, n(l) + 1).replace(u, '');
  }
  return ((Eo = r), Eo);
}
var Ao, eh;
function ug() {
  if (eh) return Ao;
  eh = 1;
  var n = tg(),
    u = n.Symbol;
  return ((Ao = u), Ao);
}
var Bo, th;
function UE() {
  if (th) return Bo;
  th = 1;
  var n = ug(),
    u = Object.prototype,
    r = u.hasOwnProperty,
    l = u.toString,
    s = n ? n.toStringTag : void 0;
  function c(D) {
    var d = r.call(D, s),
      g = D[s];
    try {
      D[s] = void 0;
      var h = !0;
    } catch {}
    var E = l.call(D);
    return (h && (d ? (D[s] = g) : delete D[s]), E);
  }
  return ((Bo = c), Bo);
}
var yo, uh;
function qE() {
  if (uh) return yo;
  uh = 1;
  var n = Object.prototype,
    u = n.toString;
  function r(l) {
    return u.call(l);
  }
  return ((yo = r), yo);
}
var bo, nh;
function kE() {
  if (nh) return bo;
  nh = 1;
  var n = ug(),
    u = UE(),
    r = qE(),
    l = '[object Null]',
    s = '[object Undefined]',
    c = n ? n.toStringTag : void 0;
  function D(d) {
    return d == null ? (d === void 0 ? s : l) : c && c in Object(d) ? u(d) : r(d);
  }
  return ((bo = D), bo);
}
var Fo, ah;
function _E() {
  if (ah) return Fo;
  ah = 1;
  function n(u) {
    return u != null && typeof u == 'object';
  }
  return ((Fo = n), Fo);
}
var So, rh;
function GE() {
  if (rh) return So;
  rh = 1;
  var n = kE(),
    u = _E(),
    r = '[object Symbol]';
  function l(s) {
    return typeof s == 'symbol' || (u(s) && n(s) == r);
  }
  return ((So = l), So);
}
var Oo, lh;
function YE() {
  if (lh) return Oo;
  lh = 1;
  var n = HE(),
    u = $o(),
    r = GE(),
    l = NaN,
    s = /^[-+]0x[0-9a-f]+$/i,
    c = /^0b[01]+$/i,
    D = /^0o[0-7]+$/i,
    d = parseInt;
  function g(h) {
    if (typeof h == 'number') return h;
    if (r(h)) return l;
    if (u(h)) {
      var E = typeof h.valueOf == 'function' ? h.valueOf() : h;
      h = u(E) ? E + '' : E;
    }
    if (typeof h != 'string') return h === 0 ? h : +h;
    h = n(h);
    var A = c.test(h);
    return A || D.test(h) ? d(h.slice(2), A ? 2 : 8) : s.test(h) ? l : +h;
  }
  return ((Oo = g), Oo);
}
var xo, ih;
function ng() {
  if (ih) return xo;
  ih = 1;
  var n = $o(),
    u = NE(),
    r = YE(),
    l = 'Expected a function',
    s = Math.max,
    c = Math.min;
  function D(d, g, h) {
    var E,
      A,
      B,
      F,
      M,
      z,
      V = 0,
      x = !1,
      m = !1,
      N = !0;
    if (typeof d != 'function') throw new TypeError(l);
    ((g = r(g) || 0),
      n(h) &&
        ((x = !!h.leading),
        (m = 'maxWait' in h),
        (B = m ? s(r(h.maxWait) || 0, g) : B),
        (N = 'trailing' in h ? !!h.trailing : N)));
    function _(Z) {
      var ne = E,
        ae = A;
      return ((E = A = void 0), (V = Z), (F = d.apply(ae, ne)), F);
    }
    function J(Z) {
      return ((V = Z), (M = setTimeout(se, g)), x ? _(Z) : F);
    }
    function le(Z) {
      var ne = Z - z,
        ae = Z - V,
        R = g - ne;
      return m ? c(R, B - ae) : R;
    }
    function P(Z) {
      var ne = Z - z,
        ae = Z - V;
      return z === void 0 || ne >= g || ne < 0 || (m && ae >= B);
    }
    function se() {
      var Z = u();
      if (P(Z)) return fe(Z);
      M = setTimeout(se, le(Z));
    }
    function fe(Z) {
      return ((M = void 0), N && E ? _(Z) : ((E = A = void 0), F));
    }
    function ve() {
      (M !== void 0 && clearTimeout(M), (V = 0), (E = z = A = M = void 0));
    }
    function de() {
      return M === void 0 ? F : fe(u());
    }
    function ee() {
      var Z = u(),
        ne = P(Z);
      if (((E = arguments), (A = this), (z = Z), ne)) {
        if (M === void 0) return J(z);
        if (m) return (clearTimeout(M), (M = setTimeout(se, g)), _(z));
      }
      return (M === void 0 && (M = setTimeout(se, g)), F);
    }
    return ((ee.cancel = ve), (ee.flush = de), ee);
  }
  return ((xo = D), xo);
}
var VE = ng();
const XE = sl(VE);
var To, sh;
function KE() {
  if (sh) return To;
  sh = 1;
  var n = ng(),
    u = $o(),
    r = 'Expected a function';
  function l(s, c, D) {
    var d = !0,
      g = !0;
    if (typeof s != 'function') throw new TypeError(r);
    return (
      u(D) && ((d = 'leading' in D ? !!D.leading : d), (g = 'trailing' in D ? !!D.trailing : g)),
      n(s, c, { leading: d, maxWait: c, trailing: g })
    );
  }
  return ((To = l), To);
}
var QE = KE();
const ZE = sl(QE),
  fh = (n) => typeof n == 'object' && n != null && n.nodeType === 1,
  oh = (n, u) => (!u || n !== 'hidden') && n !== 'visible' && n !== 'clip',
  wi = (n, u) => {
    if (n.clientHeight < n.scrollHeight || n.clientWidth < n.scrollWidth) {
      const r = getComputedStyle(n, null);
      return (
        oh(r.overflowY, u) ||
        oh(r.overflowX, u) ||
        ((l) => {
          const s = ((c) => {
            if (!c.ownerDocument || !c.ownerDocument.defaultView) return null;
            try {
              return c.ownerDocument.defaultView.frameElement;
            } catch {
              return null;
            }
          })(l);
          return !!s && (s.clientHeight < l.scrollHeight || s.clientWidth < l.scrollWidth);
        })(n)
      );
    }
    return !1;
  },
  Mi = (n, u, r, l, s, c, D, d) =>
    (c < n && D > u) || (c > n && D < u)
      ? 0
      : (c <= n && d <= r) || (D >= u && d >= r)
        ? c - n - l
        : (D > u && d < r) || (c < n && d > r)
          ? D - u + s
          : 0,
  PE = (n) => {
    const u = n.parentElement;
    return u ?? (n.getRootNode().host || null);
  },
  ch = (n, u) => {
    var r, l, s, c;
    if (typeof document > 'u') return [];
    const { scrollMode: D, block: d, inline: g, boundary: h, skipOverflowHiddenElements: E } = u,
      A = typeof h == 'function' ? h : (R) => R !== h;
    if (!fh(n)) throw new TypeError('Invalid target');
    const B = document.scrollingElement || document.documentElement,
      F = [];
    let M = n;
    for (; fh(M) && A(M);) {
      if (((M = PE(M)), M === B)) {
        F.push(M);
        break;
      }
      (M != null && M === document.body && wi(M) && !wi(document.documentElement)) ||
        (M != null && wi(M, E) && F.push(M));
    }
    const z = (l = (r = window.visualViewport) == null ? void 0 : r.width) != null ? l : innerWidth,
      V = (c = (s = window.visualViewport) == null ? void 0 : s.height) != null ? c : innerHeight,
      { scrollX: x, scrollY: m } = window,
      { height: N, width: _, top: J, right: le, bottom: P, left: se } = n.getBoundingClientRect(),
      {
        top: fe,
        right: ve,
        bottom: de,
        left: ee,
      } = ((R) => {
        const G = window.getComputedStyle(R);
        return {
          top: parseFloat(G.scrollMarginTop) || 0,
          right: parseFloat(G.scrollMarginRight) || 0,
          bottom: parseFloat(G.scrollMarginBottom) || 0,
          left: parseFloat(G.scrollMarginLeft) || 0,
        };
      })(n);
    let Z = d === 'start' || d === 'nearest' ? J - fe : d === 'end' ? P + de : J + N / 2 - fe + de,
      ne = g === 'center' ? se + _ / 2 - ee + ve : g === 'end' ? le + ve : se - ee;
    const ae = [];
    for (let R = 0; R < F.length; R++) {
      const G = F[R],
        {
          height: De,
          width: he,
          top: Ce,
          right: y,
          bottom: q,
          left: K,
        } = G.getBoundingClientRect();
      if (
        D === 'if-needed' &&
        J >= 0 &&
        se >= 0 &&
        P <= V &&
        le <= z &&
        ((G === B && !wi(G)) || (J >= Ce && P <= q && se >= K && le <= y))
      )
        return ae;
      const W = getComputedStyle(G),
        ge = parseInt(W.borderLeftWidth, 10),
        Ae = parseInt(W.borderTopWidth, 10),
        xe = parseInt(W.borderRightWidth, 10),
        Ke = parseInt(W.borderBottomWidth, 10);
      let ze = 0,
        w = 0;
      const ie = 'offsetWidth' in G ? G.offsetWidth - G.clientWidth - ge - xe : 0,
        ue = 'offsetHeight' in G ? G.offsetHeight - G.clientHeight - Ae - Ke : 0,
        oe = 'offsetWidth' in G ? (G.offsetWidth === 0 ? 0 : he / G.offsetWidth) : 0,
        Ee = 'offsetHeight' in G ? (G.offsetHeight === 0 ? 0 : De / G.offsetHeight) : 0;
      if (B === G)
        ((ze =
          d === 'start'
            ? Z
            : d === 'end'
              ? Z - V
              : d === 'nearest'
                ? Mi(m, m + V, V, Ae, Ke, m + Z, m + Z + N, N)
                : Z - V / 2),
          (w =
            g === 'start'
              ? ne
              : g === 'center'
                ? ne - z / 2
                : g === 'end'
                  ? ne - z
                  : Mi(x, x + z, z, ge, xe, x + ne, x + ne + _, _)),
          (ze = Math.max(0, ze + m)),
          (w = Math.max(0, w + x)));
      else {
        ((ze =
          d === 'start'
            ? Z - Ce - Ae
            : d === 'end'
              ? Z - q + Ke + ue
              : d === 'nearest'
                ? Mi(Ce, q, De, Ae, Ke + ue, Z, Z + N, N)
                : Z - (Ce + De / 2) + ue / 2),
          (w =
            g === 'start'
              ? ne - K - ge
              : g === 'center'
                ? ne - (K + he / 2) + ie / 2
                : g === 'end'
                  ? ne - y + xe + ie
                  : Mi(K, y, he, ge, xe + ie, ne, ne + _, _)));
        const { scrollLeft: ye, scrollTop: Je } = G;
        ((ze = Ee === 0 ? 0 : Math.max(0, Math.min(Je + ze / Ee, G.scrollHeight - De / Ee + ue))),
          (w = oe === 0 ? 0 : Math.max(0, Math.min(ye + w / oe, G.scrollWidth - he / oe + ie))),
          (Z += Je - ze),
          (ne += ye - w));
      }
      ae.push({ el: G, top: ze, left: w });
    }
    return ae;
  },
  JE = (n) =>
    n === !1
      ? { block: 'end', inline: 'nearest' }
      : ((u) => u === Object(u) && Object.keys(u).length !== 0)(n)
        ? n
        : { block: 'start', inline: 'nearest' };
function WE(n, u) {
  if (
    !n.isConnected ||
    !((s) => {
      let c = s;
      for (; c && c.parentNode;) {
        if (c.parentNode === document) return !0;
        c = c.parentNode instanceof ShadowRoot ? c.parentNode.host : c.parentNode;
      }
      return !1;
    })(n)
  )
    return;
  const r = ((s) => {
    const c = window.getComputedStyle(s);
    return {
      top: parseFloat(c.scrollMarginTop) || 0,
      right: parseFloat(c.scrollMarginRight) || 0,
      bottom: parseFloat(c.scrollMarginBottom) || 0,
      left: parseFloat(c.scrollMarginLeft) || 0,
    };
  })(n);
  if (((s) => typeof s == 'object' && typeof s.behavior == 'function')(u))
    return u.behavior(ch(n, u));
  const l = typeof u == 'boolean' || u == null ? void 0 : u.behavior;
  for (const { el: s, top: c, left: D } of ch(n, JE(u))) {
    const d = c - r.top + r.bottom,
      g = D - r.left + r.right;
    s.scroll({ top: d, left: g, behavior: l });
  }
}
var Au = {},
  dh;
function $E() {
  if (dh) return Au;
  ((dh = 1), Object.defineProperty(Au, '__esModule', { value: !0 }));
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
      s = 1;
    s < 20;
    s++
  )
    l['f' + s] = 111 + s;
  function c(B, F, M) {
    (F && !('byKey' in F) && ((M = F), (F = null)), Array.isArray(B) || (B = [B]));
    var z = B.map(function (m) {
        return g(m, F);
      }),
      V = function (N) {
        return z.some(function (_) {
          return h(_, N);
        });
      },
      x = M == null ? V : V(M);
    return x;
  }
  function D(B, F) {
    return c(B, F);
  }
  function d(B, F) {
    return c(B, { byKey: !0 }, F);
  }
  function g(B, F) {
    var M = F && F.byKey,
      z = {};
    B = B.replace('++', '+add');
    var V = B.split('+'),
      x = V.length;
    for (var m in u) z[u[m]] = !1;
    var N = !0,
      _ = !1,
      J = void 0;
    try {
      for (var le = V[Symbol.iterator](), P; !(N = (P = le.next()).done); N = !0) {
        var se = P.value,
          fe = se.endsWith('?') && se.length > 1;
        fe && (se = se.slice(0, -1));
        var ve = A(se),
          de = u[ve];
        if (se.length > 1 && !de && !r[se] && !l[ve])
          throw new TypeError('Unknown modifier: "' + se + '"');
        ((x === 1 || !de) && (M ? (z.key = ve) : (z.which = E(se))),
          de && (z[de] = fe ? null : !0));
      }
    } catch (ee) {
      ((_ = !0), (J = ee));
    } finally {
      try {
        !N && le.return && le.return();
      } finally {
        if (_) throw J;
      }
    }
    return z;
  }
  function h(B, F) {
    for (var M in B) {
      var z = B[M],
        V = void 0;
      if (
        z != null &&
        (M === 'key' && F.key != null
          ? (V = F.key.toLowerCase())
          : M === 'which'
            ? (V = z === 91 && F.which === 93 ? 91 : F.which)
            : (V = F[M]),
        !(V == null && z === !1) && V !== z)
      )
        return !1;
    }
    return !0;
  }
  function E(B) {
    B = A(B);
    var F = l[B] || B.toUpperCase().charCodeAt(0);
    return F;
  }
  function A(B) {
    return ((B = B.toLowerCase()), (B = r[B] || B), B);
  }
  return (
    (Au.default = c),
    (Au.isHotkey = c),
    (Au.isCodeHotkey = D),
    (Au.isKeyHotkey = d),
    (Au.parseHotkey = g),
    (Au.compareHotkey = h),
    (Au.toKeyCode = E),
    (Au.toKeyName = A),
    Au
  );
}
var wo = $E(),
  ag = globalThis.Node,
  IE = globalThis.Text,
  Io = (n) => (n && n.ownerDocument && n.ownerDocument.defaultView) || null,
  eA = (n) => Nn(n) && n.nodeType === 8,
  gu = (n) => Nn(n) && n.nodeType === 1,
  Nn = (n) => {
    var u = Io(n);
    return !!u && n instanceof u.Node;
  },
  qo = (n) => {
    var u = n && n.anchorNode && Io(n.anchorNode);
    return !!u && n instanceof u.Selection;
  },
  rg = (n) => Nn(n) && n.nodeType === 3,
  tA = (n) =>
    n.clipboardData &&
    n.clipboardData.getData('text/plain') !== '' &&
    n.clipboardData.types.length === 1,
  uA = (n) => {
    var [u, r] = n;
    if (gu(u) && u.childNodes.length) {
      var l = r === u.childNodes.length,
        s = l ? r - 1 : r;
      for (
        [u, s] = lg(u, s, l ? 'backward' : 'forward'), l = s < r;
        gu(u) && u.childNodes.length;
      ) {
        var c = l ? u.childNodes.length - 1 : 0;
        u = aA(u, c, l ? 'backward' : 'forward');
      }
      r = l && u.textContent != null ? u.textContent.length : 0;
    }
    return [u, r];
  },
  nA = (n) => {
    for (var u = n && n.parentNode; u;) {
      if (u.toString() === '[object ShadowRoot]') return !0;
      u = u.parentNode;
    }
    return !1;
  },
  lg = (n, u, r) => {
    if (typeof u != 'number') throw new Error('Expected index to be a number');
    for (
      var { childNodes: l } = n, s = l[u], c = u, D = !1, d = !1;
      (eA(s) ||
        (gu(s) && s.childNodes.length === 0) ||
        (gu(s) && s.getAttribute('contenteditable') === 'false')) &&
      !(D && d);
    ) {
      if (c >= l.length) {
        ((D = !0), (c = u - 1), (r = 'backward'));
        continue;
      }
      if (c < 0) {
        ((d = !0), (c = u + 1), (r = 'forward'));
        continue;
      }
      ((s = l[c]), (u = c), (c += r === 'forward' ? 1 : -1));
    }
    return [s, u];
  },
  aA = (n, u, r) => {
    var [l] = lg(n, u, r);
    return l;
  },
  ig = (n) => {
    var u = '';
    if (rg(n) && n.nodeValue) return n.nodeValue;
    if (gu(n)) {
      for (var r of Array.from(n.childNodes)) u += ig(r);
      var l = getComputedStyle(n).getPropertyValue('display');
      (l === 'block' || l === 'list' || n.tagName === 'BR') &&
        (u += `
`);
    }
    return u;
  },
  rA = /data-slate-fragment="(.+?)"/m,
  lA = (n) => {
    var u = n.getData('text/html'),
      [, r] = u.match(rA) || [];
    return r;
  },
  Wr = (n) => (n.getSelection != null ? n.getSelection() : document.getSelection()),
  ec = (n, u, r) => {
    var { target: l } = u;
    if (gu(l) && l.matches('[contentEditable="false"]')) return !1;
    var { document: s } = we.getWindow(n);
    if (aa(s, l)) return we.hasDOMNode(n, l, { editable: !0 });
    var c = r.find((D) => {
      var { addedNodes: d, removedNodes: g } = D;
      for (var h of d) if (h === l || aa(h, l)) return !0;
      for (var E of g) if (E === l || aa(E, l)) return !0;
    });
    return !c || c === u ? !1 : ec(n, c, r);
  },
  iA = () => {
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
  Dh = (n, u) => !!(n.compareDocumentPosition(u) & ag.DOCUMENT_POSITION_PRECEDING),
  sA = (n, u) => !!(n.compareDocumentPosition(u) & ag.DOCUMENT_POSITION_FOLLOWING),
  vh = (n, u) => {
    if (!n) return null;
    for (var r = n; r;) {
      if (r.matches && r.matches(u)) return r;
      if (r.parentElement) r = r.parentElement;
      else if (r.parentNode && 'host' in r.parentNode) r = r.parentNode.host;
      else return null;
    }
    return null;
  },
  aa = (n, u) => {
    if (!n || !u) return !1;
    if (n.contains(u)) return !0;
    for (var r = u; r;) {
      if (r === n) return !0;
      if (r.parentNode) 'host' in r.parentNode ? (r = r.parentNode.host) : (r = r.parentNode);
      else return !1;
    }
    return !1;
  },
  Mo,
  Ro,
  fA =
    typeof navigator < 'u' &&
    typeof window < 'u' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream,
  hh = typeof navigator < 'u' && /Mac OS X/.test(navigator.userAgent),
  Ht = typeof navigator < 'u' && /Android/.test(navigator.userAgent),
  Qa = typeof navigator < 'u' && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent),
  ua = typeof navigator < 'u' && /AppleWebKit(?!.*Chrome)/i.test(navigator.userAgent),
  oA =
    typeof navigator < 'u' && /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent),
  tc = typeof navigator < 'u' && /Chrome/i.test(navigator.userAgent),
  sg =
    typeof navigator < 'u' && /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent),
  cA = Ht && typeof navigator < 'u' && /Chrome?\/(?:[0-5]?\d)(?:\.)/i.test(navigator.userAgent),
  dA =
    typeof navigator < 'u' &&
    /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(navigator.userAgent),
  DA = typeof navigator < 'u' && /.*UCBrowser/.test(navigator.userAgent),
  vA =
    typeof navigator < 'u' &&
    /.*Wechat/.test(navigator.userAgent) &&
    !/.*MacWechat/.test(navigator.userAgent) &&
    (!tc || sg),
  qi =
    typeof window < 'u' &&
    typeof window.document < 'u' &&
    typeof window.document.createElement < 'u';
typeof navigator < 'u' &&
  /Safari/.test(navigator.userAgent) &&
  /Version\/(\d+)/.test(navigator.userAgent) &&
  (Mo = navigator.userAgent.match(/Version\/(\d+)/)) !== null &&
  Mo !== void 0 &&
  Mo[1] &&
  parseInt(
    (Ro = navigator.userAgent.match(/Version\/(\d+)/)) === null || Ro === void 0 ? void 0 : Ro[1],
    10,
  ) < 17;
var wn =
  (!sg || !cA) &&
  !oA &&
  typeof globalThis < 'u' &&
  globalThis.InputEvent &&
  typeof globalThis.InputEvent.prototype.getTargetRanges == 'function';
function al(n) {
  '@babel/helpers - typeof';
  return (
    (al =
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
    al(n)
  );
}
function hA(n, u) {
  if (al(n) !== 'object' || n === null) return n;
  var r = n[Symbol.toPrimitive];
  if (r !== void 0) {
    var l = r.call(n, u);
    if (al(l) !== 'object') return l;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (u === 'string' ? String : Number)(n);
}
function gA(n) {
  var u = hA(n, 'string');
  return al(u) === 'symbol' ? u : String(u);
}
function uc(n, u, r) {
  return (
    (u = gA(u)),
    u in n
      ? Object.defineProperty(n, u, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (n[u] = r),
    n
  );
}
var mA = 0;
class fg {
  constructor() {
    (uc(this, 'id', void 0), (this.id = ''.concat(mA++)));
  }
}
var Ja = new WeakMap(),
  Za = new WeakMap(),
  $r = new WeakMap(),
  og = new WeakMap(),
  Ir = new WeakMap(),
  ko = new WeakMap(),
  rl = new WeakMap(),
  ra = new WeakMap(),
  Xi = new WeakMap(),
  Qi = new WeakMap(),
  _o = new WeakMap(),
  zn = new WeakMap(),
  na = new WeakMap(),
  el = new WeakMap(),
  Go = new WeakMap(),
  nc = new WeakMap(),
  Bu = new WeakMap(),
  $u = new WeakMap(),
  Wt = new WeakMap(),
  Rn = new WeakMap(),
  Wu = new WeakMap(),
  cg = new WeakMap(),
  $a = Symbol('placeholder'),
  dg = Symbol('mark-placeholder'),
  we = {
    androidPendingDiffs: (n) => Wt.get(n),
    androidScheduleFlush: (n) => {
      var u;
      (u = nc.get(n)) === null || u === void 0 || u();
    },
    blur: (n) => {
      var u = we.toDOMNode(n, n),
        r = we.findDocumentOrShadowRoot(n);
      (zn.set(n, !1), r.activeElement === u && u.blur());
    },
    deselect: (n) => {
      var { selection: u } = n,
        r = we.findDocumentOrShadowRoot(n),
        l = Wr(r);
      (l && l.rangeCount > 0 && l.removeAllRanges(), u && re.deselect(n));
    },
    findDocumentOrShadowRoot: (n) => {
      var u = we.toDOMNode(n, n),
        r = u.getRootNode();
      return r instanceof Document || r instanceof ShadowRoot ? r : u.ownerDocument;
    },
    findEventRange: (n, u) => {
      'nativeEvent' in u && (u = u.nativeEvent);
      var { clientX: r, clientY: l, target: s } = u;
      if (r == null || l == null)
        throw new Error('Cannot resolve a Slate range from a DOM event: '.concat(u));
      var c = we.toSlateNode(n, u.target),
        D = we.findPath(n, c);
      if (T.isElement(c) && C.isVoid(n, c)) {
        var d = s.getBoundingClientRect(),
          g = n.isInline(c) ? r - d.left < d.left + d.width - r : l - d.top < d.top + d.height - l,
          h = C.point(n, D, { edge: g ? 'start' : 'end' }),
          E = g ? C.before(n, h) : C.after(n, h);
        if (E) {
          var A = C.range(n, E);
          return A;
        }
      }
      var B,
        { document: F } = we.getWindow(n);
      if (F.caretRangeFromPoint) B = F.caretRangeFromPoint(r, l);
      else {
        var M = F.caretPositionFromPoint(r, l);
        M &&
          ((B = F.createRange()),
          B.setStart(M.offsetNode, M.offset),
          B.setEnd(M.offsetNode, M.offset));
      }
      if (!B) throw new Error('Cannot resolve a Slate range from a DOM event: '.concat(u));
      var z = we.toSlateRange(n, B, { exactMatch: !1, suppressThrow: !1 });
      return z;
    },
    findKey: (n, u) => {
      var r = Xi.get(u);
      return (r || ((r = new fg()), Xi.set(u, r)), r);
    },
    findPath: (n, u) => {
      for (var r = [], l = u; ;) {
        var s = $r.get(l);
        if (s == null) {
          if (l === n) return r;
          break;
        }
        var c = Za.get(l);
        if (c == null) break;
        (r.unshift(c), (l = s));
      }
      throw new Error('Unable to find the path for Slate node: '.concat(Bt.stringify(u)));
    },
    focus: function (u) {
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { retries: 5 };
      if (!zn.get(u) && Ir.get(u)) {
        if (r.retries <= 0)
          throw new Error('Could not set focus, editor seems stuck with pending operations');
        if (u.operations.length > 0) {
          setTimeout(() => {
            we.focus(u, { retries: r.retries - 1 });
          }, 10);
          return;
        }
        var l = we.toDOMNode(u, u),
          s = we.findDocumentOrShadowRoot(u);
        if (s.activeElement !== l) {
          if (u.selection && s instanceof Document) {
            var c = Wr(s),
              D = we.toDOMRange(u, u.selection);
            (c == null || c.removeAllRanges(), c == null || c.addRange(D));
          }
          (u.selection || re.select(u, C.start(u, [])),
            zn.set(u, !0),
            l.focus({ preventScroll: !0 }));
        }
      }
    },
    getWindow: (n) => {
      var u = og.get(n);
      if (!u) throw new Error('Unable to find a host window element for this editor');
      return u;
    },
    hasDOMNode: function (u, r) {
      var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
        { editable: s = !1 } = l,
        c = we.toDOMNode(u, u),
        D;
      try {
        D = gu(r) ? r : r.parentElement;
      } catch (d) {
        if (
          d instanceof Error &&
          !d.message.includes('Permission denied to access property "nodeType"')
        )
          throw d;
      }
      return D
        ? vh(D, '[data-slate-editor]') === c &&
            (!s || D.isContentEditable
              ? !0
              : (typeof D.isContentEditable == 'boolean' &&
                  vh(D, '[contenteditable="false"]') === c) ||
                !!D.getAttribute('data-slate-zero-width'))
        : !1;
    },
    hasEditableTarget: (n, u) => Nn(u) && we.hasDOMNode(n, u, { editable: !0 }),
    hasRange: (n, u) => {
      var { anchor: r, focus: l } = u;
      return C.hasPath(n, r.path) && C.hasPath(n, l.path);
    },
    hasSelectableTarget: (n, u) =>
      we.hasEditableTarget(n, u) || we.isTargetInsideNonReadonlyVoid(n, u),
    hasTarget: (n, u) => Nn(u) && we.hasDOMNode(n, u),
    insertData: (n, u) => {
      n.insertData(u);
    },
    insertFragmentData: (n, u) => n.insertFragmentData(u),
    insertTextData: (n, u) => n.insertTextData(u),
    isComposing: (n) => !!na.get(n),
    isFocused: (n) => !!zn.get(n),
    isReadOnly: (n) => !!_o.get(n),
    isTargetInsideNonReadonlyVoid: (n, u) => {
      if (_o.get(n) || !we.hasTarget(n, u)) return !1;
      var r = we.toSlateNode(n, u);
      return T.isElement(r) && C.isVoid(n, r);
    },
    setFragmentData: (n, u, r) => n.setFragmentData(u, r),
    toDOMNode: (n, u) => {
      var r,
        l =
          u === n
            ? Ir.get(n)
            : (r = Qi.get(n)) === null || r === void 0
              ? void 0
              : r.get(we.findKey(n, u));
      if (!l)
        throw new Error('Cannot resolve a DOM node from Slate node: '.concat(Bt.stringify(u)));
      return l;
    },
    toDOMPoint: (n, u) => {
      var [r] = C.node(n, u.path),
        l = we.toDOMNode(n, r),
        s;
      C.void(n, { at: u }) && (u = { path: u.path, offset: 0 });
      for (
        var c = '[data-slate-string], [data-slate-zero-width]',
          D = Array.from(l.querySelectorAll(c)),
          d = 0,
          g = 0;
        g < D.length;
        g++
      ) {
        var h = D[g],
          E = h.childNodes[0];
        if (!(E == null || E.textContent == null)) {
          var { length: A } = E.textContent,
            B = h.getAttribute('data-slate-length'),
            F = B == null ? A : parseInt(B, 10),
            M = d + F,
            z = D[g + 1];
          if (
            u.offset === M &&
            z !== null &&
            z !== void 0 &&
            z.hasAttribute('data-slate-mark-placeholder')
          ) {
            var V,
              x = z.childNodes[0];
            s = [
              x instanceof IE ? x : z,
              (V = z.textContent) !== null && V !== void 0 && V.startsWith('\uFEFF') ? 1 : 0,
            ];
            break;
          }
          if (u.offset <= M) {
            var m = Math.min(A, Math.max(0, u.offset - d));
            s = [E, m];
            break;
          }
          d = M;
        }
      }
      if (!s)
        throw new Error('Cannot resolve a DOM point from Slate point: '.concat(Bt.stringify(u)));
      return s;
    },
    toDOMRange: (n, u) => {
      var { anchor: r, focus: l } = u,
        s = I.isBackward(u),
        c = we.toDOMPoint(n, r),
        D = I.isCollapsed(u) ? c : we.toDOMPoint(n, l),
        d = we.getWindow(n),
        g = d.document.createRange(),
        [h, E] = s ? D : c,
        [A, B] = s ? c : D,
        F = gu(h) ? h : h.parentElement,
        M = !!F.getAttribute('data-slate-zero-width'),
        z = gu(A) ? A : A.parentElement,
        V = !!z.getAttribute('data-slate-zero-width');
      return (g.setStart(h, M ? 1 : E), g.setEnd(A, V ? 1 : B), g);
    },
    toSlateNode: (n, u) => {
      var r = gu(u) ? u : u.parentElement;
      r && !r.hasAttribute('data-slate-node') && (r = r.closest('[data-slate-node]'));
      var l = r ? rl.get(r) : null;
      if (!l) throw new Error('Cannot resolve a Slate node from DOM node: '.concat(r));
      return l;
    },
    toSlatePoint: (n, u, r) => {
      var { exactMatch: l, suppressThrow: s } = r,
        [c, D] = l ? u : uA(u),
        d = c.parentNode,
        g = r.searchDirection,
        h = null,
        E = 0;
      if (d) {
        var A,
          B,
          F = we.toDOMNode(n, n),
          M = d.closest('[data-slate-void="true"]'),
          z = M && aa(F, M) ? M : null,
          V = d.closest('[contenteditable="false"]'),
          x = V && aa(F, V) ? V : null,
          m = d.closest('[data-slate-leaf]'),
          N = null;
        if (m) {
          if (((h = m.closest('[data-slate-node="text"]')), h)) {
            var _ = we.getWindow(n),
              J = _.document.createRange();
            (J.setStart(h, 0), J.setEnd(c, D));
            var le = J.cloneContents(),
              P = [
                ...Array.prototype.slice.call(le.querySelectorAll('[data-slate-zero-width]')),
                ...Array.prototype.slice.call(le.querySelectorAll('[contenteditable=false]')),
              ];
            (P.forEach((W) => {
              if (
                Ht &&
                !l &&
                W.hasAttribute('data-slate-zero-width') &&
                W.textContent.length > 0 &&
                W.textContext !== '\uFEFF'
              ) {
                W.textContent.startsWith('\uFEFF') && (W.textContent = W.textContent.slice(1));
                return;
              }
              W.parentNode.removeChild(W);
            }),
              (E = le.textContent.length),
              (N = h));
          }
        } else if (z) {
          for (var se = z.querySelectorAll('[data-slate-leaf]'), fe = 0; fe < se.length; fe++) {
            var ve = se[fe];
            if (we.hasDOMNode(n, ve)) {
              m = ve;
              break;
            }
          }
          m
            ? ((h = m.closest('[data-slate-node="text"]')),
              (N = m),
              (E = N.textContent.length),
              N.querySelectorAll('[data-slate-zero-width]').forEach((W) => {
                E -= W.textContent.length;
              }))
            : (E = 1);
        } else if (x) {
          var de = (W) =>
              W
                ? W.querySelectorAll(
                    '[data-slate-leaf]:not(:scope [data-slate-editor] [data-slate-leaf])',
                  )
                : [],
            ee = x.closest('[data-slate-node="element"]');
          if (g === 'backward' || !g) {
            var Z,
              ne = [...de(ee == null ? void 0 : ee.previousElementSibling), ...de(ee)];
            ((m = (Z = ne.findLast((W) => Dh(x, W))) !== null && Z !== void 0 ? Z : null),
              m && (g = 'backward'));
          }
          if (g === 'forward' || !g) {
            var ae,
              R = [...de(ee), ...de(ee == null ? void 0 : ee.nextElementSibling)];
            ((m = (ae = R.find((W) => sA(x, W))) !== null && ae !== void 0 ? ae : null),
              m && (g = 'forward'));
          }
          m &&
            ((h = m.closest('[data-slate-node="text"]')),
            (N = m),
            g === 'forward'
              ? (E = 0)
              : ((E = N.textContent.length),
                N.querySelectorAll('[data-slate-zero-width]').forEach((W) => {
                  E -= W.textContent.length;
                })));
        }
        N &&
          E === N.textContent.length &&
          Ht &&
          N.getAttribute('data-slate-zero-width') === 'z' &&
          (A = N.textContent) !== null &&
          A !== void 0 &&
          A.startsWith('\uFEFF') &&
          (d.hasAttribute('data-slate-zero-width') ||
            (Qa &&
              (B = N.textContent) !== null &&
              B !== void 0 &&
              B.endsWith(`

`))) &&
          E--;
      }
      if (Ht && !h && !l) {
        var G = d.hasAttribute('data-slate-node') ? d : d.closest('[data-slate-node]');
        if (G && we.hasDOMNode(n, G, { editable: !0 })) {
          var De = we.toSlateNode(n, G),
            he;
          try {
            he = we.findPath(n, De);
          } catch (W) {
            if (s) return null;
            throw W;
          }
          var { path: Ce, offset: y } = C.start(n, he);
          return (G.querySelector('[data-slate-leaf]') || (y = D), { path: Ce, offset: y });
        }
      }
      if (!h) {
        if (s) return null;
        throw new Error('Cannot resolve a Slate point from DOM point: '.concat(u));
      }
      var q;
      try {
        q = we.toSlateNode(n, h);
      } catch (W) {
        if (s) return null;
        throw W;
      }
      var K;
      try {
        K = we.findPath(n, q);
      } catch (W) {
        if (s) return null;
        throw W;
      }
      return { path: K, offset: E };
    },
    toSlateRange: (n, u, r) => {
      var l,
        { exactMatch: s, suppressThrow: c } = r,
        D = qo(u) ? u.anchorNode : u.startContainer,
        d,
        g,
        h,
        E,
        A;
      if (D)
        if (qo(u)) {
          if (Qa && u.rangeCount > 1) {
            h = u.focusNode;
            var B = u.getRangeAt(0),
              F = u.getRangeAt(u.rangeCount - 1);
            if (
              h instanceof HTMLTableRowElement &&
              B.startContainer instanceof HTMLTableRowElement &&
              F.startContainer instanceof HTMLTableRowElement
            ) {
              let P = function (se) {
                return se.childElementCount > 0 ? P(se.children[0]) : se;
              };
              var le = P,
                M = B.startContainer,
                z = F.startContainer,
                V = P(M.children[B.startOffset]),
                x = P(z.children[F.startOffset]);
              ((E = 0),
                x.childNodes.length > 0 ? (d = x.childNodes[0]) : (d = x),
                V.childNodes.length > 0 ? (h = V.childNodes[0]) : (h = V),
                x instanceof HTMLElement ? (g = x.innerHTML.length) : (g = 0));
            } else
              B.startContainer === h
                ? ((d = F.endContainer), (g = F.endOffset), (E = B.startOffset))
                : ((d = B.startContainer), (g = B.endOffset), (E = F.startOffset));
          } else ((d = u.anchorNode), (g = u.anchorOffset), (h = u.focusNode), (E = u.focusOffset));
          (tc && nA(d)) || Qa
            ? (A = u.anchorNode === u.focusNode && u.anchorOffset === u.focusOffset)
            : (A = u.isCollapsed);
        } else
          ((d = u.startContainer),
            (g = u.startOffset),
            (h = u.endContainer),
            (E = u.endOffset),
            (A = u.collapsed));
      if (d == null || h == null || g == null || E == null)
        throw new Error('Cannot resolve a Slate range from DOM range: '.concat(u));
      Qa &&
        (l = h.textContent) !== null &&
        l !== void 0 &&
        l.endsWith(`

`) &&
        E === h.textContent.length &&
        E--;
      var m = we.toSlatePoint(n, [d, g], { exactMatch: s, suppressThrow: c });
      if (!m) return null;
      var N = Dh(d, h) || (d === h && E < g),
        _ = A
          ? m
          : we.toSlatePoint(n, [h, E], {
              exactMatch: s,
              suppressThrow: c,
              searchDirection: N ? 'forward' : 'backward',
            });
      if (!_) return null;
      var J = { anchor: m, focus: _ };
      return (
        I.isExpanded(J) &&
          I.isForward(J) &&
          gu(h) &&
          C.void(n, { at: J.focus, mode: 'highest' }) &&
          (J = C.unhangRange(n, J, { voids: !0 })),
        J
      );
    },
  };
function CA(n, u) {
  var { path: r, diff: l } = u;
  if (!C.hasPath(n, r)) return !1;
  var s = T.get(n, r);
  if (!T.isText(s)) return !1;
  if (l.start !== s.text.length || l.text.length === 0)
    return s.text.slice(l.start, l.start + l.text.length) === l.text;
  var c = S.next(r);
  if (!C.hasPath(n, c)) return !1;
  var D = T.get(n, c);
  return T.isText(D) && D.text.startsWith(l.text);
}
function Dg(n) {
  for (var u = arguments.length, r = new Array(u > 1 ? u - 1 : 0), l = 1; l < u; l++)
    r[l - 1] = arguments[l];
  return r.reduce((s, c) => s.slice(0, c.start) + c.text + s.slice(c.end), n);
}
function pA(n, u) {
  for (var r = Math.min(n.length, u.length), l = 0; l < r; l++)
    if (n.charAt(l) !== u.charAt(l)) return l;
  return r;
}
function EA(n, u, r) {
  for (var l = Math.min(n.length, u.length, r), s = 0; s < l; s++)
    if (n.charAt(n.length - s - 1) !== u.charAt(u.length - s - 1)) return s;
  return l;
}
function vg(n, u) {
  var { start: r, end: l, text: s } = u,
    c = n.slice(r, l),
    D = pA(c, s),
    d = Math.min(c.length - D, s.length - D),
    g = EA(c, s, d),
    h = { start: r + D, end: l - g, text: s.slice(D, s.length - g) };
  return h.start === h.end && h.text.length === 0 ? null : h;
}
function AA(n, u, r) {
  var l = Math.min(u.start, r.start),
    s = Math.max(0, Math.min(u.start + u.text.length, r.end) - r.start),
    c = Dg(n, u, r),
    D = Math.max(
      r.start + r.text.length,
      u.start + u.text.length + (u.start + u.text.length > r.start ? r.text.length : 0) - s,
    ),
    d = c.slice(l, D),
    g = Math.max(u.end, r.end - u.text.length + (u.end - u.start));
  return vg(n, { start: l, end: g, text: d });
}
function BA(n) {
  var { path: u, diff: r } = n;
  return { anchor: { path: u, offset: r.start }, focus: { path: u, offset: r.end } };
}
function Yo(n, u) {
  var { path: r, offset: l } = u;
  if (!C.hasPath(n, r)) return null;
  var s = T.get(n, r);
  if (!T.isText(s)) return null;
  var c = C.above(n, { match: (d) => T.isElement(d) && C.isBlock(n, d), at: r });
  if (!c) return null;
  for (; l > s.text.length;) {
    var D = C.next(n, { at: r, match: T.isText });
    if (!D || !S.isDescendant(D[1], c[1])) return null;
    ((l -= s.text.length), (s = D[0]), (r = D[1]));
  }
  return { path: r, offset: l };
}
function gh(n, u) {
  var r = Yo(n, u.anchor);
  if (!r) return null;
  if (I.isCollapsed(u)) return { anchor: r, focus: r };
  var l = Yo(n, u.focus);
  return l ? { anchor: r, focus: l } : null;
}
function Vo(n, u, r) {
  var l = Wt.get(n),
    s =
      l == null
        ? void 0
        : l.find((E) => {
            var { path: A } = E;
            return S.equals(A, u.path);
          });
  if (!s || u.offset <= s.diff.start) return Qe.transform(u, r, { affinity: 'backward' });
  var { diff: c } = s;
  if (u.offset <= c.start + c.text.length) {
    var D = { path: u.path, offset: c.start },
      d = Qe.transform(D, r, { affinity: 'backward' });
    return d ? { path: d.path, offset: d.offset + u.offset - c.start } : null;
  }
  var g = { path: u.path, offset: u.offset - c.text.length + c.end - c.start },
    h = Qe.transform(g, r, { affinity: 'backward' });
  return h
    ? r.type === 'split_node' &&
      S.equals(r.path, u.path) &&
      g.offset < r.position &&
      c.start < r.position
      ? h
      : { path: h.path, offset: h.offset + c.text.length - c.end + c.start }
    : null;
}
function mh(n, u, r) {
  var l = Vo(n, u.anchor, r);
  if (!l) return null;
  if (I.isCollapsed(u)) return { anchor: l, focus: l };
  var s = Vo(n, u.focus, r);
  return s ? { anchor: l, focus: s } : null;
}
function yA(n, u) {
  var { path: r, diff: l, id: s } = n;
  switch (u.type) {
    case 'insert_text':
      return !S.equals(u.path, r) || u.offset >= l.end
        ? n
        : u.offset <= l.start
          ? {
              diff: { start: u.text.length + l.start, end: u.text.length + l.end, text: l.text },
              id: s,
              path: r,
            }
          : { diff: { start: l.start, end: l.end + u.text.length, text: l.text }, id: s, path: r };
    case 'remove_text':
      return !S.equals(u.path, r) || u.offset >= l.end
        ? n
        : u.offset + u.text.length <= l.start
          ? {
              diff: { start: l.start - u.text.length, end: l.end - u.text.length, text: l.text },
              id: s,
              path: r,
            }
          : { diff: { start: l.start, end: l.end - u.text.length, text: l.text }, id: s, path: r };
    case 'split_node':
      return !S.equals(u.path, r) || u.position >= l.end
        ? { diff: l, id: s, path: S.transform(r, u, { affinity: 'backward' }) }
        : u.position > l.start
          ? {
              diff: { start: l.start, end: Math.min(u.position, l.end), text: l.text },
              id: s,
              path: r,
            }
          : {
              diff: { start: l.start - u.position, end: l.end - u.position, text: l.text },
              id: s,
              path: S.transform(r, u, { affinity: 'forward' }),
            };
    case 'merge_node':
      return S.equals(u.path, r)
        ? {
            diff: { start: l.start + u.position, end: l.end + u.position, text: l.text },
            id: s,
            path: S.transform(r, u),
          }
        : { diff: l, id: s, path: S.transform(r, u) };
  }
  var c = S.transform(r, u);
  return c ? { diff: l, path: c, id: s } : null;
}
var Ch = (n, u) => {
    var r = (u.top + u.bottom) / 2;
    return n.top <= r && n.bottom >= r;
  },
  ph = (n, u, r) => {
    var l = we.toDOMRange(n, u).getBoundingClientRect(),
      s = we.toDOMRange(n, r).getBoundingClientRect();
    return Ch(l, s) && Ch(s, l);
  },
  bA = (n, u) => {
    var r = C.range(n, I.end(u)),
      l = Array.from(C.positions(n, { at: u })),
      s = 0,
      c = l.length,
      D = Math.floor(c / 2);
    if (ph(n, C.range(n, l[s]), r)) return C.range(n, l[s], r);
    if (l.length < 2) return C.range(n, l[l.length - 1], r);
    for (; D !== l.length && D !== s;)
      (ph(n, C.range(n, l[D]), r) ? (c = D) : (s = D), (D = Math.floor((s + c) / 2)));
    return C.range(n, l[s], r);
  };
function Eh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Ah(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Eh(Object(r), !0).forEach(function (l) {
          uc(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Eh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var FA = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'x-slate-fragment',
      l = u,
      { apply: s, onChange: c, deleteBackward: D, addMark: d, removeMark: g } = l;
    return (
      Qi.set(l, new WeakMap()),
      (l.addMark = (h, E) => {
        var A, B;
        ((A = nc.get(l)) === null || A === void 0 || A(),
          !Bu.get(l) && (B = Wt.get(l)) !== null && B !== void 0 && B.length && Bu.set(l, null),
          $u.delete(l),
          d(h, E));
      }),
      (l.removeMark = (h) => {
        var E;
        (!Bu.get(l) && (E = Wt.get(l)) !== null && E !== void 0 && E.length && Bu.set(l, null),
          $u.delete(l),
          g(h));
      }),
      (l.deleteBackward = (h) => {
        if (h !== 'line') return D(h);
        if (l.selection && I.isCollapsed(l.selection)) {
          var E = C.above(l, { match: (M) => T.isElement(M) && C.isBlock(l, M), at: l.selection });
          if (E) {
            var [, A] = E,
              B = C.range(l, A, l.selection.anchor),
              F = bA(l, B);
            I.isCollapsed(F) || re.delete(l, { at: F });
          }
        }
      }),
      (l.apply = (h) => {
        var E = [],
          A = [],
          B = Wt.get(l);
        if (B != null && B.length) {
          var F = B.map((ne) => yA(ne, h)).filter(Boolean);
          Wt.set(l, F);
        }
        var M = Wu.get(l);
        M && Wu.set(l, mh(l, M, h));
        var z = Rn.get(l);
        if (z != null && z.at) {
          var V = Me.isPoint(z == null ? void 0 : z.at) ? Vo(l, z.at, h) : mh(l, z.at, h);
          Rn.set(l, V ? Ah(Ah({}, z), {}, { at: V }) : null);
        }
        switch (h.type) {
          case 'insert_text':
          case 'remove_text':
          case 'set_node':
          case 'split_node': {
            E.push(...Ka(l, h.path));
            break;
          }
          case 'set_selection': {
            var x;
            ((x = el.get(l)) === null || x === void 0 || x.unref(), el.delete(l));
            break;
          }
          case 'insert_node':
          case 'remove_node': {
            E.push(...Ka(l, S.parent(h.path)));
            break;
          }
          case 'merge_node': {
            var m = S.previous(h.path);
            E.push(...Ka(l, m));
            break;
          }
          case 'move_node': {
            var N = S.common(S.parent(h.path), S.parent(h.newPath));
            E.push(...Ka(l, N));
            var _;
            S.isBefore(h.path, h.newPath)
              ? (E.push(...Ka(l, S.parent(h.path))), (_ = h.newPath))
              : (E.push(...Ka(l, S.parent(h.newPath))), (_ = h.path));
            var J = T.get(u, S.parent(_)),
              le = we.findKey(l, J),
              P = C.pathRef(l, S.parent(_));
            A.push([P, le]);
            break;
          }
        }
        switch ((s(h), h.type)) {
          case 'insert_node':
          case 'remove_node':
          case 'merge_node':
          case 'move_node':
          case 'split_node':
          case 'insert_text':
          case 'remove_text':
          case 'set_selection':
            Ja.set(l, !0);
        }
        for (var [se, fe] of E) {
          var [ve] = C.node(l, se);
          Xi.set(ve, fe);
        }
        for (var [de, ee] of A) {
          if (de.current) {
            var [Z] = C.node(l, de.current);
            Xi.set(Z, ee);
          }
          de.unref();
        }
      }),
      (l.setFragmentData = (h) => {
        var { selection: E } = l;
        if (E) {
          var [A, B] = I.edges(E),
            F = C.void(l, { at: A.path }),
            M = C.void(l, { at: B.path });
          if (!(I.isCollapsed(E) && !F)) {
            var z = we.toDOMRange(l, E),
              V = z.cloneContents(),
              x = V.childNodes[0];
            if (
              (V.childNodes.forEach((ve) => {
                ve.textContent && ve.textContent.trim() !== '' && (x = ve);
              }),
              M)
            ) {
              var [m] = M,
                N = z.cloneRange(),
                _ = we.toDOMNode(l, m);
              (N.setEndAfter(_), (V = N.cloneContents()));
            }
            if (
              (F && (x = V.querySelector('[data-slate-spacer]')),
              Array.from(V.querySelectorAll('[data-slate-zero-width]')).forEach((ve) => {
                var de = ve.getAttribute('data-slate-zero-width') === 'n';
                ve.textContent = de
                  ? `
`
                  : '';
              }),
              rg(x))
            ) {
              var J = x.ownerDocument.createElement('span');
              ((J.style.whiteSpace = 'pre'), J.appendChild(x), V.appendChild(J), (x = J));
            }
            var le = l.getFragment(),
              P = JSON.stringify(le),
              se = window.btoa(encodeURIComponent(P));
            (x.setAttribute('data-slate-fragment', se), h.setData('application/'.concat(r), se));
            var fe = V.ownerDocument.createElement('div');
            return (
              fe.appendChild(V),
              fe.setAttribute('hidden', 'true'),
              V.ownerDocument.body.appendChild(fe),
              h.setData('text/html', fe.innerHTML),
              h.setData('text/plain', ig(fe)),
              V.ownerDocument.body.removeChild(fe),
              h
            );
          }
        }
      }),
      (l.insertData = (h) => {
        l.insertFragmentData(h) || l.insertTextData(h);
      }),
      (l.insertFragmentData = (h) => {
        var E = h.getData('application/'.concat(r)) || lA(h);
        if (E) {
          var A = decodeURIComponent(window.atob(E)),
            B = JSON.parse(A);
          return (l.insertFragment(B), !0);
        }
        return !1;
      }),
      (l.insertTextData = (h) => {
        var E = h.getData('text/plain');
        if (E) {
          var A = E.split(/\r\n|\r|\n/),
            B = !1;
          for (var F of A) (B && re.splitNodes(l, { always: !0 }), l.insertText(F), (B = !0));
          return !0;
        }
        return !1;
      }),
      (l.onChange = (h) => {
        var E = Go.get(l);
        (E && E(h), c(h));
      }),
      l
    );
  },
  Ka = (n, u) => {
    var r = [];
    for (var [l, s] of C.levels(n, { at: u })) {
      var c = we.findKey(n, l);
      r.push([s, c]);
    }
    return r;
  },
  SA = 3,
  OA = {
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
  xA = {
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
  TA = {
    deleteWordBackward: 'ctrl+shift?+backspace',
    deleteWordForward: 'ctrl+shift?+delete',
    redo: ['ctrl+y', 'ctrl+shift+z'],
  },
  st = (n) => {
    var u = OA[n],
      r = xA[n],
      l = TA[n],
      s = u && wo.isHotkey(u),
      c = r && wo.isHotkey(r),
      D = l && wo.isHotkey(l);
    return (d) => !!((s && s(d)) || (hh && c && c(d)) || (!hh && D && D(d)));
  },
  ft = {
    isBold: st('bold'),
    isCompose: st('compose'),
    isMoveBackward: st('moveBackward'),
    isMoveForward: st('moveForward'),
    isDeleteBackward: st('deleteBackward'),
    isDeleteForward: st('deleteForward'),
    isDeleteLineBackward: st('deleteLineBackward'),
    isDeleteLineForward: st('deleteLineForward'),
    isDeleteWordBackward: st('deleteWordBackward'),
    isDeleteWordForward: st('deleteWordForward'),
    isExtendBackward: st('extendBackward'),
    isExtendForward: st('extendForward'),
    isExtendLineBackward: st('extendLineBackward'),
    isExtendLineForward: st('extendLineForward'),
    isItalic: st('italic'),
    isMoveLineBackward: st('moveLineBackward'),
    isMoveLineForward: st('moveLineForward'),
    isMoveWordBackward: st('moveWordBackward'),
    isMoveWordForward: st('moveWordForward'),
    isRedo: st('redo'),
    isSoftBreak: st('insertSoftBreak'),
    isSplitBlock: st('splitBlock'),
    isTransposeCharacter: st('transposeCharacter'),
    isUndo: st('undo'),
  };
function wA(n, u) {
  if (n == null) return {};
  var r = {},
    l = Object.keys(n),
    s,
    c;
  for (c = 0; c < l.length; c++) ((s = l[c]), !(u.indexOf(s) >= 0) && (r[s] = n[s]));
  return r;
}
function Bh(n, u) {
  if (n == null) return {};
  var r = wA(n, u),
    l,
    s;
  if (Object.getOwnPropertySymbols) {
    var c = Object.getOwnPropertySymbols(n);
    for (s = 0; s < c.length; s++)
      ((l = c[s]),
        !(u.indexOf(l) >= 0) && Object.prototype.propertyIsEnumerable.call(n, l) && (r[l] = n[l]));
  }
  return r;
}
var MA = ['anchor', 'focus'],
  RA = ['anchor', 'focus'];
function yh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function bh(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? yh(Object(r), !0).forEach(function (l) {
          uc(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : yh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var jA = (n, u) =>
    Object.keys(n).length === Object.keys(u).length &&
    Object.keys(n).every((r) => u.hasOwnProperty(r) && n[r] === u[r]),
  hg = (n, u) => {
    var { anchor: r, focus: l } = n,
      s = Bh(n, MA),
      { anchor: c, focus: D } = u,
      d = Bh(u, RA);
    return n[$a] === u[$a] && jA(s, d);
  },
  ac = (n, u) => {
    if (n === u) return !0;
    if (!n || !u || n.length !== u.length) return !1;
    for (var r = 0; r < n.length; r++) {
      var l = n[r],
        s = u[r];
      if (!I.equals(l, s) || !hg(l, s)) return !1;
    }
    return !0;
  },
  gg = (n, u) => {
    if (n === u) return !0;
    if (!n || !u || n.length !== u.length) return !1;
    for (var r = 0; r < n.length; r++) {
      var l = n[r],
        s = u[r];
      if (l.anchor.offset !== s.anchor.offset || l.focus.offset !== s.focus.offset || !hg(l, s))
        return !1;
    }
    return !0;
  },
  zA = (n, u, r) => {
    var l = Array.from(u.children, () => []);
    if (r.length === 0) return l;
    var s = we.findPath(n, u),
      c = s.length,
      D = C.range(n, s),
      d = new Array(u.children.length),
      g = (N) => {
        var _ = d[N];
        if (_) return _;
        var J = C.range(n, [...s, N]);
        return ((d[N] = J), J);
      };
    for (var h of r) {
      var E = I.intersection(D, h);
      if (E)
        for (var [A, B] = I.edges(E), F = A.path[c], M = B.path[c], z = F; z <= M; z++) {
          var V = l[z];
          if (V) {
            var x = g(z),
              m = I.intersection(x, h);
            m && V.push(bh(bh({}, h), m));
          }
        }
    }
    return l;
  },
  la = [],
  NA = function () {
    return la.some(function (n) {
      return n.activeTargets.length > 0;
    });
  },
  LA = function () {
    return la.some(function (n) {
      return n.skippedTargets.length > 0;
    });
  },
  Fh = 'ResizeObserver loop completed with undelivered notifications.',
  HA = function () {
    var n;
    (typeof ErrorEvent == 'function'
      ? (n = new ErrorEvent('error', { message: Fh }))
      : ((n = document.createEvent('Event')), n.initEvent('error', !1, !1), (n.message = Fh)),
      window.dispatchEvent(n));
  },
  ll;
(function (n) {
  ((n.BORDER_BOX = 'border-box'),
    (n.CONTENT_BOX = 'content-box'),
    (n.DEVICE_PIXEL_CONTENT_BOX = 'device-pixel-content-box'));
})(ll || (ll = {}));
var ia = function (n) {
    return Object.freeze(n);
  },
  UA = (function () {
    function n(u, r) {
      ((this.inlineSize = u), (this.blockSize = r), ia(this));
    }
    return n;
  })(),
  mg = (function () {
    function n(u, r, l, s) {
      return (
        (this.x = u),
        (this.y = r),
        (this.width = l),
        (this.height = s),
        (this.top = this.y),
        (this.left = this.x),
        (this.bottom = this.top + this.height),
        (this.right = this.left + this.width),
        ia(this)
      );
    }
    return (
      (n.prototype.toJSON = function () {
        var u = this,
          r = u.x,
          l = u.y,
          s = u.top,
          c = u.right,
          D = u.bottom,
          d = u.left,
          g = u.width,
          h = u.height;
        return { x: r, y: l, top: s, right: c, bottom: D, left: d, width: g, height: h };
      }),
      (n.fromRect = function (u) {
        return new n(u.x, u.y, u.width, u.height);
      }),
      n
    );
  })(),
  rc = function (n) {
    return n instanceof SVGElement && 'getBBox' in n;
  },
  Cg = function (n) {
    if (rc(n)) {
      var u = n.getBBox(),
        r = u.width,
        l = u.height;
      return !r && !l;
    }
    var s = n,
      c = s.offsetWidth,
      D = s.offsetHeight;
    return !(c || D || n.getClientRects().length);
  },
  Sh = function (n) {
    var u;
    if (n instanceof Element) return !0;
    var r =
      (u = n == null ? void 0 : n.ownerDocument) === null || u === void 0 ? void 0 : u.defaultView;
    return !!(r && n instanceof r.Element);
  },
  qA = function (n) {
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
  tl = typeof window < 'u' ? window : {},
  Ri = new WeakMap(),
  Oh = /auto|scroll/,
  kA = /^tb|vertical/,
  _A = /msie|trident/i.test(tl.navigator && tl.navigator.userAgent),
  Ou = function (n) {
    return parseFloat(n || '0');
  },
  Wa = function (n, u, r) {
    return (
      n === void 0 && (n = 0),
      u === void 0 && (u = 0),
      r === void 0 && (r = !1),
      new UA((r ? u : n) || 0, (r ? n : u) || 0)
    );
  },
  xh = ia({
    devicePixelContentBoxSize: Wa(),
    borderBoxSize: Wa(),
    contentBoxSize: Wa(),
    contentRect: new mg(0, 0, 0, 0),
  }),
  pg = function (n, u) {
    if ((u === void 0 && (u = !1), Ri.has(n) && !u)) return Ri.get(n);
    if (Cg(n)) return (Ri.set(n, xh), xh);
    var r = getComputedStyle(n),
      l = rc(n) && n.ownerSVGElement && n.getBBox(),
      s = !_A && r.boxSizing === 'border-box',
      c = kA.test(r.writingMode || ''),
      D = !l && Oh.test(r.overflowY || ''),
      d = !l && Oh.test(r.overflowX || ''),
      g = l ? 0 : Ou(r.paddingTop),
      h = l ? 0 : Ou(r.paddingRight),
      E = l ? 0 : Ou(r.paddingBottom),
      A = l ? 0 : Ou(r.paddingLeft),
      B = l ? 0 : Ou(r.borderTopWidth),
      F = l ? 0 : Ou(r.borderRightWidth),
      M = l ? 0 : Ou(r.borderBottomWidth),
      z = l ? 0 : Ou(r.borderLeftWidth),
      V = A + h,
      x = g + E,
      m = z + F,
      N = B + M,
      _ = d ? n.offsetHeight - N - n.clientHeight : 0,
      J = D ? n.offsetWidth - m - n.clientWidth : 0,
      le = s ? V + m : 0,
      P = s ? x + N : 0,
      se = l ? l.width : Ou(r.width) - le - J,
      fe = l ? l.height : Ou(r.height) - P - _,
      ve = se + V + J + m,
      de = fe + x + _ + N,
      ee = ia({
        devicePixelContentBoxSize: Wa(
          Math.round(se * devicePixelRatio),
          Math.round(fe * devicePixelRatio),
          c,
        ),
        borderBoxSize: Wa(ve, de, c),
        contentBoxSize: Wa(se, fe, c),
        contentRect: new mg(A, g, se, fe),
      });
    return (Ri.set(n, ee), ee);
  },
  Eg = function (n, u, r) {
    var l = pg(n, r),
      s = l.borderBoxSize,
      c = l.contentBoxSize,
      D = l.devicePixelContentBoxSize;
    switch (u) {
      case ll.DEVICE_PIXEL_CONTENT_BOX:
        return D;
      case ll.BORDER_BOX:
        return s;
      default:
        return c;
    }
  },
  GA = (function () {
    function n(u) {
      var r = pg(u);
      ((this.target = u),
        (this.contentRect = r.contentRect),
        (this.borderBoxSize = ia([r.borderBoxSize])),
        (this.contentBoxSize = ia([r.contentBoxSize])),
        (this.devicePixelContentBoxSize = ia([r.devicePixelContentBoxSize])));
    }
    return n;
  })(),
  Ag = function (n) {
    if (Cg(n)) return 1 / 0;
    for (var u = 0, r = n.parentNode; r;) ((u += 1), (r = r.parentNode));
    return u;
  },
  YA = function () {
    var n = 1 / 0,
      u = [];
    la.forEach(function (D) {
      if (D.activeTargets.length !== 0) {
        var d = [];
        (D.activeTargets.forEach(function (h) {
          var E = new GA(h.target),
            A = Ag(h.target);
          (d.push(E), (h.lastReportedSize = Eg(h.target, h.observedBox)), A < n && (n = A));
        }),
          u.push(function () {
            D.callback.call(D.observer, d, D.observer);
          }),
          D.activeTargets.splice(0, D.activeTargets.length));
      }
    });
    for (var r = 0, l = u; r < l.length; r++) {
      var s = l[r];
      s();
    }
    return n;
  },
  Th = function (n) {
    la.forEach(function (r) {
      (r.activeTargets.splice(0, r.activeTargets.length),
        r.skippedTargets.splice(0, r.skippedTargets.length),
        r.observationTargets.forEach(function (s) {
          s.isActive() && (Ag(s.target) > n ? r.activeTargets.push(s) : r.skippedTargets.push(s));
        }));
    });
  },
  VA = function () {
    var n = 0;
    for (Th(n); NA();) ((n = YA()), Th(n));
    return (LA() && HA(), n > 0);
  },
  jo,
  Bg = [],
  XA = function () {
    return Bg.splice(0).forEach(function (n) {
      return n();
    });
  },
  KA = function (n) {
    if (!jo) {
      var u = 0,
        r = document.createTextNode(''),
        l = { characterData: !0 };
      (new MutationObserver(function () {
        return XA();
      }).observe(r, l),
        (jo = function () {
          r.textContent = ''.concat(u ? u-- : u++);
        }));
    }
    (Bg.push(n), jo());
  },
  QA = function (n) {
    KA(function () {
      requestAnimationFrame(n);
    });
  },
  ki = 0,
  ZA = function () {
    return !!ki;
  },
  PA = 250,
  JA = { attributes: !0, characterData: !0, childList: !0, subtree: !0 },
  wh = [
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
  Mh = function (n) {
    return (n === void 0 && (n = 0), Date.now() + n);
  },
  zo = !1,
  WA = (function () {
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
        if ((u === void 0 && (u = PA), !zo)) {
          zo = !0;
          var l = Mh(u);
          QA(function () {
            var s = !1;
            try {
              s = VA();
            } finally {
              if (((zo = !1), (u = l - Mh()), !ZA())) return;
              s ? r.run(1e3) : u > 0 ? r.run(u) : r.start();
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
            return u.observer && u.observer.observe(document.body, JA);
          };
        document.body ? r() : tl.addEventListener('DOMContentLoaded', r);
      }),
      (n.prototype.start = function () {
        var u = this;
        this.stopped &&
          ((this.stopped = !1),
          (this.observer = new MutationObserver(this.listener)),
          this.observe(),
          wh.forEach(function (r) {
            return tl.addEventListener(r, u.listener, !0);
          }));
      }),
      (n.prototype.stop = function () {
        var u = this;
        this.stopped ||
          (this.observer && this.observer.disconnect(),
          wh.forEach(function (r) {
            return tl.removeEventListener(r, u.listener, !0);
          }),
          (this.stopped = !0));
      }),
      n
    );
  })(),
  Xo = new WA(),
  Rh = function (n) {
    (!ki && n > 0 && Xo.start(), (ki += n), !ki && Xo.stop());
  },
  $A = function (n) {
    return !rc(n) && !qA(n) && getComputedStyle(n).display === 'inline';
  },
  IA = (function () {
    function n(u, r) {
      ((this.target = u),
        (this.observedBox = r || ll.CONTENT_BOX),
        (this.lastReportedSize = { inlineSize: 0, blockSize: 0 }));
    }
    return (
      (n.prototype.isActive = function () {
        var u = Eg(this.target, this.observedBox, !0);
        return (
          $A(this.target) && (this.lastReportedSize = u),
          this.lastReportedSize.inlineSize !== u.inlineSize ||
            this.lastReportedSize.blockSize !== u.blockSize
        );
      }),
      n
    );
  })(),
  eB = (function () {
    function n(u, r) {
      ((this.activeTargets = []),
        (this.skippedTargets = []),
        (this.observationTargets = []),
        (this.observer = u),
        (this.callback = r));
    }
    return n;
  })(),
  ji = new WeakMap(),
  jh = function (n, u) {
    for (var r = 0; r < n.length; r += 1) if (n[r].target === u) return r;
    return -1;
  },
  zi = (function () {
    function n() {}
    return (
      (n.connect = function (u, r) {
        var l = new eB(u, r);
        ji.set(u, l);
      }),
      (n.observe = function (u, r, l) {
        var s = ji.get(u),
          c = s.observationTargets.length === 0;
        jh(s.observationTargets, r) < 0 &&
          (c && la.push(s), s.observationTargets.push(new IA(r, l && l.box)), Rh(1), Xo.schedule());
      }),
      (n.unobserve = function (u, r) {
        var l = ji.get(u),
          s = jh(l.observationTargets, r),
          c = l.observationTargets.length === 1;
        s >= 0 && (c && la.splice(la.indexOf(l), 1), l.observationTargets.splice(s, 1), Rh(-1));
      }),
      (n.disconnect = function (u) {
        var r = this,
          l = ji.get(u);
        (l.observationTargets.slice().forEach(function (s) {
          return r.unobserve(u, s.target);
        }),
          l.activeTargets.splice(0, l.activeTargets.length));
      }),
      n
    );
  })(),
  tB = (function () {
    function n(u) {
      if (arguments.length === 0)
        throw new TypeError(
          "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.",
        );
      if (typeof u != 'function')
        throw new TypeError(
          "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.",
        );
      zi.connect(this, u);
    }
    return (
      (n.prototype.observe = function (u, r) {
        if (arguments.length === 0)
          throw new TypeError(
            "Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.",
          );
        if (!Sh(u))
          throw new TypeError(
            "Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element",
          );
        zi.observe(this, u, r);
      }),
      (n.prototype.unobserve = function (u) {
        if (arguments.length === 0)
          throw new TypeError(
            "Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.",
          );
        if (!Sh(u))
          throw new TypeError(
            "Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element",
          );
        zi.unobserve(this, u);
      }),
      (n.prototype.disconnect = function () {
        zi.disconnect(this);
      }),
      (n.toString = function () {
        return 'function ResizeObserver () { [polyfill code] }';
      }),
      n
    );
  })(),
  uB = Zh();
const nB = sl(uB);
function aB(n, u) {
  if (n == null) return {};
  var r = {},
    l = Object.keys(n),
    s,
    c;
  for (c = 0; c < l.length; c++) ((s = l[c]), !(u.indexOf(s) >= 0) && (r[s] = n[s]));
  return r;
}
function Ki(n, u) {
  if (n == null) return {};
  var r = aB(n, u),
    l,
    s;
  if (Object.getOwnPropertySymbols) {
    var c = Object.getOwnPropertySymbols(n);
    for (s = 0; s < c.length; s++)
      ((l = c[s]),
        !(u.indexOf(l) >= 0) && Object.prototype.propertyIsEnumerable.call(n, l) && (r[l] = n[l]));
  }
  return r;
}
function il(n) {
  '@babel/helpers - typeof';
  return (
    (il =
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
    il(n)
  );
}
function rB(n, u) {
  if (il(n) !== 'object' || n === null) return n;
  var r = n[Symbol.toPrimitive];
  if (r !== void 0) {
    var l = r.call(n, u);
    if (il(l) !== 'object') return l;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (u === 'string' ? String : Number)(n);
}
function lB(n) {
  var u = rB(n, 'string');
  return il(u) === 'symbol' ? u : String(u);
}
function rt(n, u, r) {
  return (
    (u = lB(u)),
    u in n
      ? Object.defineProperty(n, u, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (n[u] = r),
    n
  );
}
var lc = k.createContext(null),
  Mu = () => {
    var n = k.useContext(lc);
    if (!n)
      throw new Error(
        "The `useSlateStatic` hook must be used inside the <Slate> component's context.",
      );
    return n;
  },
  ce = we;
function zh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Ni(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? zh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : zh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var iB = 25,
  sB = 200,
  fB = function () {},
  oB = (n) => (n == null ? void 0 : n.constructor.name) === 'DataTransfer';
function cB(n) {
  var { editor: u, scheduleOnDOMSelectionChange: r, onDOMSelectionChange: l } = n,
    s = !1,
    c = null,
    D = null,
    d = null,
    g = 0,
    h = !1,
    E = () => {
      var ee = Wu.get(u);
      if ((Wu.delete(u), ee)) {
        var { selection: Z } = u,
          ne = gh(u, ee);
        ne && (!Z || !I.equals(ne, Z)) && re.select(u, ne);
      }
    },
    A = () => {
      var ee = Rn.get(u);
      if ((Rn.delete(u), !!ee)) {
        if (ee.at) {
          var Z = Me.isPoint(ee.at) ? Yo(u, ee.at) : gh(u, ee.at);
          if (!Z) return;
          var ne = C.range(u, Z);
          (!u.selection || !I.equals(u.selection, ne)) && re.select(u, Z);
        }
        ee.run();
      }
    },
    B = () => {
      if ((D && (clearTimeout(D), (D = null)), d && (clearTimeout(d), (d = null)), !_() && !N())) {
        E();
        return;
      }
      (s || ((s = !0), setTimeout(() => (s = !1))), N() && (s = 'action'));
      var ee = u.selection && C.rangeRef(u, u.selection, { affinity: 'forward' });
      ($u.set(u, u.marks), fB('flush', Rn.get(u), Wt.get(u)));
      for (var Z = _(), ne; (ne = (ae = Wt.get(u)) === null || ae === void 0 ? void 0 : ae[0]);) {
        var ae,
          R,
          G = Bu.get(u);
        (G !== void 0 && (Bu.delete(u), (u.marks = G)), G && h === !1 && (h = null));
        var De = BA(ne);
        ((!u.selection || !I.equals(u.selection, De)) && re.select(u, De),
          ne.diff.text ? C.insertText(u, ne.diff.text) : C.deleteFragment(u),
          Wt.set(
            u,
            (R = Wt.get(u)) === null || R === void 0
              ? void 0
              : R.filter((y) => {
                  var { id: q } = y;
                  return q !== ne.id;
                }),
          ),
          CA(u, ne) ||
            ((Z = !1),
            Rn.delete(u),
            $u.delete(u),
            (s = 'action'),
            Wu.delete(u),
            r.cancel(),
            l.cancel(),
            ee == null || ee.unref()));
      }
      var he = ee == null ? void 0 : ee.unref();
      if (
        (he && !Wu.get(u) && (!u.selection || !I.equals(he, u.selection)) && re.select(u, he), N())
      ) {
        A();
        return;
      }
      (Z && r(), r.flush(), l.flush(), E());
      var Ce = $u.get(u);
      ($u.delete(u), Ce !== void 0 && ((u.marks = Ce), u.onChange()));
    },
    F = (ee) => {
      (c && clearTimeout(c),
        (c = setTimeout(() => {
          (na.set(u, !1), B());
        }, iB)));
    },
    M = (ee) => {
      (na.set(u, !0), c && (clearTimeout(c), (c = null)));
    },
    z = function () {
      var Z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1,
        ne = ko.get(u);
      if (ne) {
        if (_() || Z) {
          ne.style.display = 'none';
          return;
        }
        ne.style.removeProperty('display');
      }
    },
    V = (ee, Z) => {
      var ne,
        ae = (ne = Wt.get(u)) !== null && ne !== void 0 ? ne : [];
      Wt.set(u, ae);
      var R = T.leaf(u, ee),
        G = ae.findIndex((Ce) => S.equals(Ce.path, ee));
      if (G < 0) {
        var De = vg(R.text, Z);
        (De && ae.push({ path: ee, diff: Z, id: g++ }), z());
        return;
      }
      var he = AA(R.text, ae[G].diff, Z);
      if (!he) {
        (ae.splice(G, 1), z());
        return;
      }
      ae[G] = Ni(Ni({}, ae[G]), {}, { diff: he });
    },
    x = function (Z) {
      var { at: ne } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      ((h = !1),
        Wu.delete(u),
        r.cancel(),
        l.cancel(),
        N() && B(),
        Rn.set(u, { at: ne, run: Z }),
        (d = setTimeout(B)));
    },
    m = (ee) => {
      var Z;
      if ((D && (clearTimeout(D), (D = null)), !Ja.get(u))) {
        var { inputType: ne } = ee,
          ae = null,
          R = ee.dataTransfer || ee.data || void 0;
        h !== !1 && ne !== 'insertText' && ne !== 'insertCompositionText' && (h = !1);
        var [G] = ee.getTargetRanges();
        G && (ae = ce.toSlateRange(u, G, { exactMatch: !1, suppressThrow: !0 }));
        var De = ce.getWindow(u),
          he = De.getSelection();
        if (
          (!ae &&
            he &&
            ((G = he), (ae = ce.toSlateRange(u, he, { exactMatch: !1, suppressThrow: !0 }))),
          (ae = (Z = ae) !== null && Z !== void 0 ? Z : u.selection),
          !!ae)
        ) {
          var Ce = !0;
          if (ne.startsWith('delete')) {
            var y = ne.endsWith('Backward') ? 'backward' : 'forward',
              [q, K] = I.edges(ae),
              [W, ge] = C.leaf(u, q.path);
            if (I.isExpanded(ae) && W.text.length === q.offset && K.offset === 0) {
              var Ae = C.next(u, { at: q.path, match: T.isText });
              Ae &&
                S.equals(Ae[1], K.path) &&
                (y === 'backward'
                  ? ((ae = { anchor: K, focus: K }), (q = K), ([W, ge] = Ae))
                  : ((ae = { anchor: q, focus: q }), (K = q)));
            }
            var xe = { text: '', start: q.offset, end: K.offset },
              Ke = Wt.get(u),
              ze = Ke == null ? void 0 : Ke.find((ru) => S.equals(ru.path, ge)),
              w = ze ? [ze.diff, xe] : [xe],
              ie = Dg(W.text, ...w);
            if ((ie.length === 0 && (Ce = !1), I.isExpanded(ae))) {
              if (Ce && S.equals(ae.anchor.path, ae.focus.path)) {
                var ue = { path: ae.anchor.path, offset: q.offset },
                  oe = C.range(u, ue, ue);
                return (P(oe), V(ae.anchor.path, { text: '', end: K.offset, start: q.offset }));
              }
              return x(() => C.deleteFragment(u, { direction: y }), { at: ae });
            }
          }
          switch (ne) {
            case 'deleteByComposition':
            case 'deleteByCut':
            case 'deleteByDrag':
              return x(() => C.deleteFragment(u), { at: ae });
            case 'deleteContent':
            case 'deleteContentForward': {
              var { anchor: Ee } = ae;
              if (Ce && I.isCollapsed(ae)) {
                var ye = T.leaf(u, Ee.path);
                if (Ee.offset < ye.text.length)
                  return V(Ee.path, { text: '', start: Ee.offset, end: Ee.offset + 1 });
              }
              return x(() => C.deleteForward(u), { at: ae });
            }
            case 'deleteContentBackward': {
              var Je,
                { anchor: ut } = ae,
                _e = qo(G) ? G.isCollapsed : !!((Je = G) !== null && Je !== void 0 && Je.collapsed);
              return Ce && _e && I.isCollapsed(ae) && ut.offset > 0
                ? V(ut.path, { text: '', start: ut.offset - 1, end: ut.offset })
                : x(() => C.deleteBackward(u), { at: ae });
            }
            case 'deleteEntireSoftLine':
              return x(
                () => {
                  (C.deleteBackward(u, { unit: 'line' }), C.deleteForward(u, { unit: 'line' }));
                },
                { at: ae },
              );
            case 'deleteHardLineBackward':
              return x(() => C.deleteBackward(u, { unit: 'block' }), { at: ae });
            case 'deleteSoftLineBackward':
              return x(() => C.deleteBackward(u, { unit: 'line' }), { at: ae });
            case 'deleteHardLineForward':
              return x(() => C.deleteForward(u, { unit: 'block' }), { at: ae });
            case 'deleteSoftLineForward':
              return x(() => C.deleteForward(u, { unit: 'line' }), { at: ae });
            case 'deleteWordBackward':
              return x(() => C.deleteBackward(u, { unit: 'word' }), { at: ae });
            case 'deleteWordForward':
              return x(() => C.deleteForward(u, { unit: 'word' }), { at: ae });
            case 'insertLineBreak':
              return x(() => C.insertSoftBreak(u), { at: ae });
            case 'insertParagraph':
              return x(() => C.insertBreak(u), { at: ae });
            case 'insertCompositionText':
            case 'deleteCompositionText':
            case 'insertFromComposition':
            case 'insertFromDrop':
            case 'insertFromPaste':
            case 'insertFromYank':
            case 'insertReplacementText':
            case 'insertText': {
              if (oB(R)) return x(() => ce.insertData(u, R), { at: ae });
              var Ne = R ?? '';
              if (
                (Bu.get(u) && (Ne = Ne.replace('\uFEFF', '')),
                ne === 'insertText' && /.*\n.*\n$/.test(Ne) && (Ne = Ne.slice(0, -1)),
                Ne.includes(`
`))
              )
                return x(
                  () => {
                    var ru = Ne.split(`
`);
                    ru.forEach((Yt, Ft) => {
                      (Yt && C.insertText(u, Yt), Ft !== ru.length - 1 && C.insertSoftBreak(u));
                    });
                  },
                  { at: ae },
                );
              if (S.equals(ae.anchor.path, ae.focus.path)) {
                var [We, pt] = I.edges(ae),
                  Ve = { start: We.offset, end: pt.offset, text: Ne };
                if (Ne && h && ne === 'insertCompositionText') {
                  var _t = h.start + h.text.search(/\S|$/),
                    ot = Ve.start + Ve.text.search(/\S|$/);
                  ot === _t + 1 && Ve.end === h.start + h.text.length
                    ? ((Ve.start -= 1), (h = null), ve())
                    : (h = !1);
                } else
                  ne === 'insertText'
                    ? h === null
                      ? (h = Ve)
                      : h && I.isCollapsed(ae) && h.end + h.text.length === We.offset
                        ? (h = Ni(Ni({}, h), {}, { text: h.text + Ne }))
                        : (h = !1)
                    : (h = !1);
                if (Ce) {
                  var nn = u.selection;
                  if ((V(We.path, Ve), nn)) {
                    var Gt = { path: We.path, offset: We.offset + Ne.length };
                    x(
                      () => {
                        re.select(u, { anchor: Gt, focus: Gt });
                      },
                      { at: Gt },
                    );
                  }
                  return;
                }
              }
              return x(() => C.insertText(u, Ne), { at: ae });
            }
          }
        }
      }
    },
    N = () => !!Rn.get(u),
    _ = () => {
      var ee;
      return !!((ee = Wt.get(u)) !== null && ee !== void 0 && ee.length);
    },
    J = () => N() || _(),
    le = () => s,
    P = (ee) => {
      (Wu.set(u, ee), D && (clearTimeout(D), (D = null)));
      var { selection: Z } = u;
      if (ee) {
        var ne = !Z || !S.equals(Z.anchor.path, ee.anchor.path),
          ae = !Z || !S.equals(Z.anchor.path.slice(0, -1), ee.anchor.path.slice(0, -1));
        (((ne && h) || ae) && (h = !1), (ne || _()) && (D = setTimeout(B, sB)));
      }
    },
    se = () => {
      (N() || !_()) && B();
    },
    fe = (ee) => {
      _() || (z(!0), setTimeout(z));
    },
    ve = () => {
      N() || (d = setTimeout(B));
    },
    de = (ee) => {
      if (!(_() || N()) && ee.some((ne) => ec(u, ne, ee))) {
        var Z;
        (Z = cg.get(u)) === null || Z === void 0 || Z();
      }
    };
  return {
    flush: B,
    scheduleFlush: ve,
    hasPendingDiffs: _,
    hasPendingAction: N,
    hasPendingChanges: J,
    isFlushing: le,
    handleUserSelect: P,
    handleCompositionEnd: F,
    handleCompositionStart: M,
    handleDOMBeforeInput: m,
    handleKeyDown: fe,
    handleDomMutations: de,
    handleInput: se,
  };
}
function dB() {
  var n = k.useRef(!1);
  return (
    k.useEffect(
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
var tn = qi ? k.useLayoutEffect : k.useEffect;
function DB(n, u, r) {
  var [l] = k.useState(() => new MutationObserver(u));
  (tn(() => {
    l.takeRecords();
  }),
    k.useEffect(() => {
      if (!n.current) throw new Error('Failed to attach MutationObserver, `node` is undefined');
      return (l.observe(n.current, r), () => l.disconnect());
    }, [l, n, r]));
}
var vB = ['node'];
function Nh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function hB(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Nh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Nh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var gB = { subtree: !0, childList: !0, characterData: !0 },
  mB = Ht
    ? (n) => {
        var { node: u } = n,
          r = Ki(n, vB);
        if (!Ht) return null;
        var l = Mu(),
          s = dB(),
          [c] = k.useState(() => cB(hB({ editor: l }, r)));
        return (DB(u, c.handleDomMutations, gB), nc.set(l, c.scheduleFlush), s && c.flush(), c);
      }
    : () => null;
function Lh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function CB(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Lh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Lh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var pB = (n) => {
    var { isLast: u, leaf: r, parent: l, text: s } = n,
      c = Mu(),
      D = ce.findPath(c, s),
      d = S.parent(D),
      g = !!r[dg];
    return c.isVoid(l)
      ? Oe.createElement(No, { length: T.string(l).length })
      : r.text === '' &&
          l.children[l.children.length - 1] === s &&
          !c.isInline(l) &&
          C.string(c, d) === ''
        ? Oe.createElement(No, { isLineBreak: !0, isMarkPlaceholder: g })
        : r.text === ''
          ? Oe.createElement(No, { isMarkPlaceholder: g })
          : u &&
              r.text.slice(-1) ===
                `
`
            ? Oe.createElement(Hh, { isTrailing: !0, text: r.text })
            : Oe.createElement(Hh, { text: r.text });
  },
  Hh = (n) => {
    var { text: u, isTrailing: r = !1 } = n,
      l = k.useRef(null),
      s = () =>
        ''.concat(u ?? '').concat(
          r
            ? `
`
            : '',
        ),
      [c] = k.useState(s);
    return (
      tn(() => {
        var D = s();
        l.current && l.current.textContent !== D && (l.current.textContent = D);
      }),
      Oe.createElement(EB, { ref: l }, c)
    );
  },
  EB = k.memo(
    k.forwardRef((n, u) =>
      Oe.createElement('span', { 'data-slate-string': !0, ref: u }, n.children),
    ),
  ),
  No = (n) => {
    var { length: u = 0, isLineBreak: r = !1, isMarkPlaceholder: l = !1 } = n,
      s = { 'data-slate-zero-width': r ? 'n' : 'z', 'data-slate-length': u };
    return (
      l && (s['data-slate-mark-placeholder'] = !0),
      Oe.createElement(
        'span',
        CB({}, s),
        !Ht || !r ? '\uFEFF' : null,
        r ? Oe.createElement('br', null) : null,
      )
    );
  };
function Uh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function yg(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Uh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Uh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var AB = Ht ? 300 : 0;
function BB(n, u) {
  n.current && (n.current.disconnect(), u && (n.current = null));
}
function qh(n) {
  n.current && (clearTimeout(n.current), (n.current = null));
}
var yB = (n) => Oe.createElement(SB, yg({}, n)),
  bB = (n) => {
    var {
        leaf: u,
        isLast: r,
        text: l,
        parent: s,
        renderPlaceholder: c,
        renderLeaf: D = yB,
        leafPosition: d,
      } = n,
      g = Mu(),
      h = k.useRef(null),
      E = k.useRef(null),
      [A, B] = k.useState(!1),
      F = k.useRef(null),
      M = k.useCallback(
        (N) => {
          if ((BB(h, N == null), N == null)) {
            var _;
            (ko.delete(g), (_ = u.onPlaceholderResize) === null || _ === void 0 || _.call(u, null));
          } else {
            if ((ko.set(g, N), !h.current)) {
              var J = window.ResizeObserver || tB;
              h.current = new J(() => {
                var le;
                (le = u.onPlaceholderResize) === null || le === void 0 || le.call(u, N);
              });
            }
            (h.current.observe(N), (E.current = N));
          }
        },
        [E, u, g],
      ),
      z = Oe.createElement(pB, { isLast: r, leaf: u, parent: s, text: l }),
      V = !!u[$a];
    if (
      (k.useEffect(
        () => (
          V
            ? F.current ||
              (F.current = setTimeout(() => {
                (B(!0), (F.current = null));
              }, AB))
            : (qh(F), B(!1)),
          () => qh(F)
        ),
        [V, B],
      ),
      V && A)
    ) {
      var x = {
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
            WebkitUserModify: ua ? 'inherit' : void 0,
          },
          contentEditable: !1,
          ref: M,
        },
      };
      z = Oe.createElement(Oe.Fragment, null, z, c(x));
    }
    var m = { 'data-slate-leaf': !0 };
    return D({ attributes: m, children: z, leaf: u, text: l, leafPosition: d });
  },
  FB = Oe.memo(
    bB,
    (n, u) =>
      u.parent === n.parent &&
      u.isLast === n.isLast &&
      u.renderLeaf === n.renderLeaf &&
      u.renderPlaceholder === n.renderPlaceholder &&
      u.text === n.text &&
      Iu.equals(u.leaf, n.leaf) &&
      u.leaf[$a] === n.leaf[$a],
  ),
  SB = (n) => {
    var { attributes: u, children: r } = n;
    return Oe.createElement('span', yg({}, u), r);
  };
function OB(n, u) {
  var [, r] = k.useReducer((h) => h + 1, 0),
    l = k.useRef(),
    s = k.useRef(() => null),
    c = k.useRef(null),
    D;
  try {
    if (n !== s.current || l.current) {
      var d = n();
      u(c.current, d) ? (D = c.current) : (D = d);
    } else D = c.current;
  } catch (h) {
    throw (
      l.current &&
        xB(h) &&
        (h.message += `
The error may be correlated with this previous error:
`.concat(
          l.current.stack,
          `

`,
        )),
      h
    );
  }
  ((s.current = n), (c.current = D), (l.current = void 0));
  var g = k.useCallback(() => {
    try {
      var h = s.current();
      if (u(c.current, h)) return;
      c.current = h;
    } catch (E) {
      E instanceof Error ? (l.current = E) : (l.current = new Error(String(E)));
    }
    r();
  }, []);
  return [D, g];
}
function xB(n) {
  return n instanceof Error;
}
var bg = k.createContext({}),
  Fg = (n, u) => {
    var r = Mu(),
      { decorate: l, addEventListener: s } = k.useContext(bg),
      c = () => {
        var h = ce.findPath(r, n);
        return l([n, h]);
      },
      D = T.isText(n) ? gg : ac,
      [d, g] = OB(c, D);
    return (
      tn(() => {
        var h = s(g);
        return (g(), h);
      }, [s, g]),
      k.useMemo(() => [...d, ...u], [d, u])
    );
  },
  TB = (n) => {
    var [, u] = k.useReducer((d) => d + 1, 0),
      r = k.useRef(new Set()),
      l = k.useRef(!1),
      s = k.useRef(n);
    tn(() => {
      if (((s.current = n), r.current.forEach((d) => d()), !l.current)) {
        l.current = !0;
        return;
      }
      u();
    }, [n]);
    var c = k.useCallback((d) => s.current(d), []),
      D = k.useCallback(
        (d) => (
          r.current.add(d),
          () => {
            r.current.delete(d);
          }
        ),
        [],
      );
    return k.useMemo(() => ({ decorate: c, addEventListener: D }), [c, D]);
  };
function kh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Sg(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? kh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : kh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var wB = (n) => Oe.createElement(RB, Sg({}, n)),
  MB = (n) => {
    for (
      var {
          decorations: u,
          isLast: r,
          parent: l,
          renderPlaceholder: s,
          renderLeaf: c,
          renderText: D = wB,
          text: d,
        } = n,
        g = Mu(),
        h = k.useRef(null),
        E = Fg(d, u),
        A = Iu.decorations(d, E),
        B = ce.findKey(g, d),
        F = [],
        M = 0;
      M < A.length;
      M++
    ) {
      var { leaf: z, position: V } = A[M];
      F.push(
        Oe.createElement(FB, {
          isLast: r && M === A.length - 1,
          key: ''.concat(B.id, '-').concat(M),
          renderPlaceholder: s,
          leaf: z,
          leafPosition: V,
          text: d,
          parent: l,
          renderLeaf: c,
        }),
      );
    }
    var x = k.useCallback(
        (N) => {
          var _ = Qi.get(g);
          (N
            ? (_ == null || _.set(B, N), ra.set(d, N), rl.set(N, d))
            : (_ == null || _.delete(B), ra.delete(d), h.current && rl.delete(h.current)),
            (h.current = N));
        },
        [h, g, B, d],
      ),
      m = { 'data-slate-node': 'text', ref: x };
    return D({ text: d, children: F, attributes: m });
  },
  Og = Oe.memo(
    MB,
    (n, u) =>
      u.parent === n.parent &&
      u.isLast === n.isLast &&
      u.renderText === n.renderText &&
      u.renderLeaf === n.renderLeaf &&
      u.renderPlaceholder === n.renderPlaceholder &&
      u.text === n.text &&
      gg(u.decorations, n.decorations),
  ),
  RB = (n) => {
    var { attributes: u, children: r } = n;
    return Oe.createElement('span', Sg({}, u), r);
  };
function _h(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Ko(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? _h(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : _h(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var jB = (n) => Oe.createElement(LB, Ko({}, n)),
  zB = (n) => {
    var {
        decorations: u,
        element: r,
        renderElement: l = jB,
        renderChunk: s,
        renderPlaceholder: c,
        renderLeaf: D,
        renderText: d,
      } = n,
      g = Mu(),
      h = QB(),
      E = g.isInline(r),
      A = Fg(r, u),
      B = ce.findKey(g, r),
      F = k.useCallback(
        (_) => {
          var J = Qi.get(g);
          _
            ? (J == null || J.set(B, _), ra.set(r, _), rl.set(_, r))
            : (J == null || J.delete(B), ra.delete(r));
        },
        [g, B, r],
      ),
      M = wg({
        decorations: A,
        node: r,
        renderElement: l,
        renderChunk: s,
        renderPlaceholder: c,
        renderLeaf: D,
        renderText: d,
      }),
      z = { 'data-slate-node': 'element', ref: F };
    if ((E && (z['data-slate-inline'] = !0), !E && C.hasInlines(g, r))) {
      var V = T.string(r),
        x = eg(V);
      x === 'rtl' && (z.dir = x);
    }
    if (C.isVoid(g, r)) {
      ((z['data-slate-void'] = !0), !h && E && (z.contentEditable = !1));
      var m = E ? 'span' : 'div',
        [[N]] = T.texts(r);
      ((M = Oe.createElement(
        m,
        {
          'data-slate-spacer': !0,
          style: { height: '0', color: 'transparent', outline: 'none', position: 'absolute' },
        },
        Oe.createElement(Og, {
          renderPlaceholder: c,
          decorations: [],
          isLast: !1,
          parent: r,
          text: N,
        }),
      )),
        Za.set(N, 0),
        $r.set(N, r));
    }
    return l({ attributes: z, children: M, element: r });
  },
  NB = Oe.memo(
    zB,
    (n, u) =>
      n.element === u.element &&
      n.renderElement === u.renderElement &&
      n.renderChunk === u.renderChunk &&
      n.renderText === u.renderText &&
      n.renderLeaf === u.renderLeaf &&
      n.renderPlaceholder === u.renderPlaceholder &&
      ac(n.decorations, u.decorations),
  ),
  LB = (n) => {
    var { attributes: u, children: r, element: l } = n,
      s = Mu(),
      c = s.isInline(l) ? 'span' : 'div';
    return Oe.createElement(c, Ko(Ko({}, u), {}, { style: { position: 'relative' } }), r);
  };
class HB {
  constructor(u, r) {
    var { chunkSize: l, debug: s } = r;
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
      (this.debug = s ?? !1),
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
        var s = this.chunkSize - this.pointerSiblings.length,
          c = Math.min(s, u.length);
        if (c > 0) {
          var D = u.splice(0, c);
          this.rawInsertAfter(D, r);
        }
        (this.exitChunk(), r++);
      }
      if (u.length !== 0) {
        var d = this.savePointer(),
          g = null;
        if (this.readLeaf())
          for (; this.pointerChunk.type === 'chunk' && this.pointerIndex === 0;) {
            var h = this.chunkSize - this.pointerSiblings.length,
              E = Math.min(h, u.length);
            if (E > 0) {
              var A = u.splice(-E, E);
              ((this.pointerIndex = -1),
                (this.cachedPointerNode = void 0),
                this.rawInsertAfter(A, l),
                g || (g = this.savePointer()));
            }
            (this.exitChunk(), l++);
          }
        this.restorePointer(d);
        var B = Math.max(r, l);
        (this.rawInsertAfter(u, B), g && this.restorePointer(g), this.validateState());
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
      var s = l.parent.children.indexOf(l);
      if (s === -1) return null;
      r.unshift(s);
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
      s = r.children.indexOf(l);
    if (s === -1)
      throw new Error('Cannot restore point because saved node is no longer in saved chunk');
    var c = this.getChunkPath(r);
    if (!c)
      throw new Error('Cannot restore point because saved chunk is no longer connected to root');
    ((this.pointerChunk = r),
      (this.pointerIndex = s),
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
        var l = (E, A, B) => {
            if (B === 1) return E;
            for (var F = [], M = 0; M < this.chunkSize; M++) {
              var z = E.slice(M * B, (M + 1) * B);
              if (z.length === 0) break;
              var V = { type: 'chunk', key: new fg(), parent: A, children: [] };
              ((V.children = l(z, V, B / this.chunkSize)), F.push(V));
            }
            return F;
          },
          s = this.pointerSiblings.length + u.length,
          c = 0,
          D = this.chunkSize;
        D < s;
        D *= this.chunkSize
      )
        c++;
      var d = Math.max(c, r),
        g = Math.pow(this.chunkSize, d),
        h = l(u, this.pointerChunk, g);
      (this.pointerSiblings.splice(this.pointerIndex + 1, 0, ...h),
        (this.pointerIndex += h.length),
        (this.cachedPointerNode = void 0),
        this.invalidateChunk(),
        this.validateState());
    }
  }
  validateState() {
    if (this.debug) {
      var u = (l) => {
        if (l.type === 'chunk') {
          var { parent: s, children: c } = l;
          if (!s.children.includes(l))
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
      if (!S.equals(this.pointerIndexStack, r))
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
class UB {
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
    for (var s = this.pointerIndex; s < this.children.length; s++) {
      var c = this.children[s],
        D = this.findKey(c, s);
      if (D === r) return s - this.pointerIndex;
    }
    return -1;
  }
  toChunkLeaves(u, r) {
    return u.map((l, s) => ({ type: 'leaf', node: l, key: this.findKey(l, r + s), index: r + s }));
  }
  findKey(u, r) {
    var l = this.cachedKeys[r];
    if (l) return l;
    var s = ce.findKey(this.editor, u);
    return ((this.cachedKeys[r] = s), s);
  }
}
var qB = (n, u) => {
  for (
    var {
        chunkTree: r,
        children: l,
        chunkSize: s,
        rerenderChildren: c = [],
        onInsert: D,
        onUpdate: d,
        onIndexChange: g,
        debug: h,
      } = u,
      E = new HB(r, { chunkSize: s, debug: h }),
      A = new UB(n, l),
      B,
      F = function () {
        var x = A.lookAhead(B.node, B.key),
          m = x > 0 && r.movedNodeKeys.has(B.key);
        if (x === -1 || m) return (E.remove(), 1);
        var N = A.pointerIndex,
          _ = A.read(x + 1),
          J = _.pop();
        if (_.length) {
          var le = A.toChunkLeaves(_, N);
          (E.insertBefore(le),
            _.forEach((se, fe) => {
              D == null || D(se, N + fe);
            }));
        }
        var P = A.pointerIndex - 1;
        (B.node !== J && ((B.node = J), E.invalidateChunk(), d == null || d(J, P)),
          B.index !== P && ((B.index = P), g == null || g(J, P)),
          c.includes(P) && E.invalidateChunk());
      };
    (B = E.readLeaf());
  )
    F();
  if (!A.reachedEnd) {
    var M = A.remaining(),
      z = A.toChunkLeaves(M, A.pointerIndex);
    (E.returnToPreviousLeaf(),
      E.insertAfter(z),
      M.forEach((V, x) => {
        D == null || D(V, A.pointerIndex + x);
      }));
  }
  r.movedNodeKeys.clear();
};
function Gh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function kB(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Gh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Gh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var Yh = new WeakMap(),
  xg = function (u, r) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s = ce.findKey(u, r),
      c = Yh.get(s);
    return (
      c ||
        ((c = { type: 'root', movedNodeKeys: new Set(), modifiedChunks: new Set(), children: [] }),
        Yh.set(s, c)),
      l.reconcile && qB(u, kB({ chunkTree: c, children: r.children }, l.reconcile)),
      c
    );
  };
function Vh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function _B(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Vh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Vh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var GB = (n) => {
    var { children: u } = n;
    return u;
  },
  Tg = (n) => {
    var { root: u, ancestor: r, renderElement: l, renderChunk: s = GB } = n;
    return r.children.map((c) => {
      if (c.type === 'chunk') {
        var D = c.key.id,
          d = s({
            highest: r === u,
            lowest: c.children.some((h) => h.type === 'leaf'),
            attributes: { 'data-slate-chunk': !0 },
            children: Oe.createElement(VB, {
              root: u,
              ancestor: c,
              renderElement: l,
              renderChunk: s,
            }),
          });
        return Oe.createElement(k.Fragment, { key: D }, d);
      }
      var g = c.node;
      return l(g, c.index, c.key);
    });
  },
  YB = (n) => (
    k.useEffect(() => {
      n.root.modifiedChunks.clear();
    }),
    Oe.createElement(Tg, _B({}, n))
  ),
  VB = Oe.memo(
    Tg,
    (n, u) =>
      n.root === u.root &&
      n.renderElement === u.renderElement &&
      n.renderChunk === u.renderChunk &&
      !u.root.modifiedChunks.has(u.ancestor),
  ),
  XB = k.createContext(null),
  wg = (n) => {
    var {
        decorations: u,
        node: r,
        renderElement: l,
        renderChunk: s,
        renderPlaceholder: c,
        renderText: D,
        renderLeaf: d,
      } = n,
      g = Mu();
    Ja.set(g, !1);
    var h = T.isElement(r) && !g.isInline(r),
      E = h && C.hasInlines(g, r),
      A = E ? null : g.getChunkSize(r),
      B = !!A,
      { decorationsByChild: F, childrenToRedecorate: M } = KB(g, r, u);
    B ||
      r.children.forEach((m, N) => {
        (Za.set(m, N), $r.set(m, r));
      });
    var z = k.useCallback(
        (m, N, _) => {
          var J = _ ?? ce.findKey(g, m);
          return Oe.createElement(
            XB.Provider,
            { key: 'provider-'.concat(J.id), value: m },
            Oe.createElement(NB, {
              decorations: F[N],
              element: m,
              key: J.id,
              renderElement: l,
              renderChunk: s,
              renderPlaceholder: c,
              renderLeaf: d,
              renderText: D,
            }),
          );
        },
        [g, F, l, s, c, d, D],
      ),
      V = (m, N) => {
        var _ = ce.findKey(g, m);
        return Oe.createElement(Og, {
          decorations: F[N],
          key: _.id,
          isLast: N === r.children.length - 1,
          parent: r,
          renderPlaceholder: c,
          renderLeaf: d,
          renderText: D,
          text: m,
        });
      };
    if (!B) return r.children.map((m, N) => (T.isText(m) ? V(m, N) : z(m, N)));
    var x = xg(g, r, {
      reconcile: {
        chunkSize: A,
        rerenderChildren: M,
        onInsert: (m, N) => {
          (Za.set(m, N), $r.set(m, r));
        },
        onUpdate: (m, N) => {
          (Za.set(m, N), $r.set(m, r));
        },
        onIndexChange: (m, N) => {
          Za.set(m, N);
        },
      },
    });
    return Oe.createElement(YB, { root: x, ancestor: x, renderElement: z, renderChunk: s });
  },
  KB = (n, u, r) => {
    var l = zA(n, u, r),
      s = k.useRef(l).current,
      c = [];
    s.length = l.length;
    for (var D = 0; D < l.length; D++) {
      var d,
        g = l[D],
        h = (d = s[D]) !== null && d !== void 0 ? d : null;
      ac(h, g) || ((s[D] = g), c.push(D));
    }
    return { decorationsByChild: s, childrenToRedecorate: c };
  },
  Mg = k.createContext(!1),
  QB = () => k.useContext(Mg),
  ic = k.createContext({});
function ZB() {
  var n = k.useRef(new Set()),
    u = k.useRef(new Set()),
    r = k.useCallback(() => {
      n.current.forEach((D) => D());
    }, []),
    l = k.useCallback(() => {
      (u.current.forEach((D) => D()), u.current.clear());
    }, []),
    s = k.useCallback(function (D) {
      var { deferred: d = !1 } =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        g = d ? () => u.current.add(D) : D;
      return (
        n.current.add(g),
        () => {
          n.current.delete(g);
        }
      );
    }, []),
    c = k.useMemo(() => ({ addEventListener: s, flushDeferred: l }), [s, l]);
  return { selectorContext: c, onChange: r };
}
function PB() {
  var { flushDeferred: n } = k.useContext(ic);
  tn(n);
}
var Rg = () => {
  var { addEventListener: n } = k.useContext(ic),
    [, u] = k.useReducer((r) => r + 1, 0);
  if (!n)
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  return (tn(() => n(u), [n]), Mu());
};
function JB() {
  var n = Mu(),
    u = k.useRef(!1),
    r = k.useRef(0),
    l = k.useCallback(() => {
      if (!u.current) {
        u.current = !0;
        var s = ce.getWindow(n);
        (s.cancelAnimationFrame(r.current),
          (r.current = s.requestAnimationFrame(() => {
            u.current = !1;
          })));
      }
    }, [n]);
  return (
    k.useEffect(() => () => cancelAnimationFrame(r.current), []),
    { receivedUserInput: u, onUserInput: l }
  );
}
var WB = (n, u) => {
    var r = [],
      l = () => {
        r = [];
      },
      s = (D) => {
        if (u.current) {
          var d = D.filter((g) => ec(n, g, D));
          r.push(...d);
        }
      };
    function c() {
      r.length > 0 &&
        (r.reverse().forEach((D) => {
          D.type !== 'characterData' &&
            (D.removedNodes.forEach((d) => {
              D.target.insertBefore(d, D.nextSibling);
            }),
            D.addedNodes.forEach((d) => {
              D.target.removeChild(d);
            }));
        }),
        l());
    }
    return { registerMutations: s, restoreDOM: c, clear: l };
  },
  $B = { subtree: !0, childList: !0, characterData: !0, characterDataOldValue: !0 };
class jg extends k.Component {
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
    (u = this.mutationObserver) === null || u === void 0 || u.observe(r.current, $B);
  }
  componentDidMount() {
    var { receivedUserInput: u } = this.props,
      r = this.context;
    ((this.manager = WB(r, u)),
      (this.mutationObserver = new MutationObserver(this.manager.registerMutations)),
      this.observe());
  }
  getSnapshotBeforeUpdate() {
    var u,
      r,
      l,
      s = (u = this.mutationObserver) === null || u === void 0 ? void 0 : u.takeRecords();
    if (s != null && s.length) {
      var c;
      (c = this.manager) === null || c === void 0 || c.registerMutations(s);
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
rt(jg, 'contextType', lc);
var IB = Ht
    ? jg
    : (n) => {
        var { children: u } = n;
        return Oe.createElement(Oe.Fragment, null, u);
      },
  ey = k.createContext(!1),
  ty = [
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
  uy = ['text'];
function Xh(n, u) {
  var r = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(n);
    (u &&
      (l = l.filter(function (s) {
        return Object.getOwnPropertyDescriptor(n, s).enumerable;
      })),
      r.push.apply(r, l));
  }
  return r;
}
function Tu(n) {
  for (var u = 1; u < arguments.length; u++) {
    var r = arguments[u] != null ? arguments[u] : {};
    u % 2
      ? Xh(Object(r), !0).forEach(function (l) {
          rt(n, l, r[l]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
        : Xh(Object(r)).forEach(function (l) {
            Object.defineProperty(n, l, Object.getOwnPropertyDescriptor(r, l));
          });
  }
  return n;
}
var ny = (n) => Oe.createElement(Oe.Fragment, null, wg(n)),
  ay = k.forwardRef((n, u) => {
    var r = k.useCallback((w) => Oe.createElement(ry, Tu({}, w)), []),
      {
        autoFocus: l,
        decorate: s = ly,
        onDOMBeforeInput: c,
        placeholder: D,
        readOnly: d = !1,
        renderElement: g,
        renderChunk: h,
        renderLeaf: E,
        renderText: A,
        renderPlaceholder: B = r,
        scrollSelectionIntoView: F = iy,
        style: M = {},
        as: z = 'div',
        disableDefaultStyles: V = !1,
      } = n,
      x = Ki(n, ty),
      m = Rg(),
      [N, _] = k.useState(!1),
      J = k.useRef(null),
      le = k.useRef([]),
      [P, se] = k.useState(),
      fe = k.useRef(!1),
      { onUserInput: ve, receivedUserInput: de } = JB(),
      [, ee] = k.useReducer((w) => w + 1, 0);
    (cg.set(m, ee), _o.set(m, d));
    var Z = k.useMemo(
      () => ({
        isDraggingInternally: !1,
        isUpdatingSelection: !1,
        latestElement: null,
        hasMarkPlaceholder: !1,
      }),
      [],
    );
    k.useEffect(() => {
      J.current && l && J.current.focus();
    }, [l]);
    var ne = k.useRef(),
      ae = k.useMemo(
        () =>
          ZE(() => {
            if (Ja.get(m)) {
              ae();
              return;
            }
            var w = ce.toDOMNode(m, m),
              ie = w.getRootNode();
            if (!fe.current && ua && ie instanceof ShadowRoot) {
              fe.current = !0;
              var ue = iA();
              (ue ? document.execCommand('indent') : re.deselect(m), (fe.current = !1));
              return;
            }
            var oe = ne.current;
            if (
              (Ht || !ce.isComposing(m)) &&
              (!Z.isUpdatingSelection || (oe != null && oe.isFlushing())) &&
              !Z.isDraggingInternally
            ) {
              var Ee = ce.findDocumentOrShadowRoot(m),
                { activeElement: ye } = Ee,
                Je = ce.toDOMNode(m, m),
                ut = Wr(Ee);
              if ((ye === Je ? ((Z.latestElement = ye), zn.set(m, !0)) : zn.delete(m), !ut))
                return re.deselect(m);
              var { anchorNode: _e, focusNode: Ne } = ut,
                We = ce.hasEditableTarget(m, _e) || ce.isTargetInsideNonReadonlyVoid(m, _e),
                pt = ce.hasTarget(m, Ne);
              if (We && pt) {
                var Ve = ce.toSlateRange(m, ut, { exactMatch: !1, suppressThrow: !0 });
                Ve &&
                  (!ce.isComposing(m) &&
                  !(oe != null && oe.hasPendingChanges()) &&
                  !(oe != null && oe.isFlushing())
                    ? re.select(m, Ve)
                    : oe == null || oe.handleUserSelect(Ve));
              }
              d && (!We || !pt) && re.deselect(m);
            }
          }, 100),
        [m, d, Z],
      ),
      R = k.useMemo(() => XE(ae, 0), [ae]);
    ((ne.current = mB({ node: J, onDOMSelectionChange: ae, scheduleOnDOMSelectionChange: R })),
      tn(() => {
        var w, ie, ue;
        J.current && (ue = Io(J.current))
          ? (og.set(m, ue), Ir.set(m, J.current), ra.set(m, J.current), rl.set(J.current, m))
          : ra.delete(m);
        var { selection: oe } = m,
          Ee = ce.findDocumentOrShadowRoot(m),
          ye = Wr(Ee);
        if (!(
          !ye ||
          !ce.isFocused(m) ||
          ((w = ne.current) !== null && w !== void 0 && w.hasPendingAction())
        )) {
          var Je = (We) => {
            var pt = ye.type !== 'None';
            if (!(!oe && !pt)) {
              var Ve = ye.focusNode,
                _t;
              if (Qa && ye.rangeCount > 1) {
                var ot = ye.getRangeAt(0),
                  nn = ye.getRangeAt(ye.rangeCount - 1);
                ot.startContainer === Ve ? (_t = nn.endContainer) : (_t = ot.startContainer);
              } else _t = ye.anchorNode;
              var Gt = Ir.get(m),
                ru = !1;
              if ((aa(Gt, _t) && aa(Gt, Ve) && (ru = !0), pt && ru && oe && !We)) {
                var Yt = ce.toSlateRange(m, ye, { exactMatch: !0, suppressThrow: !0 });
                if (Yt && I.equals(Yt, oe)) {
                  var Ft;
                  if (
                    !Z.hasMarkPlaceholder ||
                    ((Ft = _t) !== null &&
                      Ft !== void 0 &&
                      (Ft = Ft.parentElement) !== null &&
                      Ft !== void 0 &&
                      Ft.hasAttribute('data-slate-mark-placeholder'))
                  )
                    return;
                }
              }
              if (oe && !ce.hasRange(m, oe)) {
                m.selection = ce.toSlateRange(m, ye, { exactMatch: !1, suppressThrow: !0 });
                return;
              }
              Z.isUpdatingSelection = !0;
              var Et = null;
              try {
                Et = oe && ce.toDOMRange(m, oe);
              } catch {}
              return (
                Et
                  ? (ce.isComposing(m) && !Ht
                      ? ye.collapseToEnd()
                      : I.isBackward(oe)
                        ? ye.setBaseAndExtent(
                            Et.endContainer,
                            Et.endOffset,
                            Et.startContainer,
                            Et.startOffset,
                          )
                        : ye.setBaseAndExtent(
                            Et.startContainer,
                            Et.startOffset,
                            Et.endContainer,
                            Et.endOffset,
                          ),
                    F(m, Et))
                  : ye.removeAllRanges(),
                Et
              );
            }
          };
          ye.rangeCount <= 1 && Je();
          var ut =
            ((ie = ne.current) === null || ie === void 0 ? void 0 : ie.isFlushing()) === 'action';
          if (!Ht || !ut) {
            setTimeout(() => {
              Z.isUpdatingSelection = !1;
            });
            return;
          }
          var _e = null,
            Ne = requestAnimationFrame(() => {
              if (ut) {
                var We = (pt) => {
                  try {
                    var Ve = ce.toDOMNode(m, m);
                    (Ve.focus(), Je(pt));
                  } catch {}
                };
                (We(),
                  (_e = setTimeout(() => {
                    (We(!0), (Z.isUpdatingSelection = !1));
                  })));
              }
            });
          return () => {
            (cancelAnimationFrame(Ne), _e && clearTimeout(_e));
          };
        }
      }));
    var G = k.useCallback(
        (w) => {
          Kh(m, w);
          var ie = ce.toDOMNode(m, m),
            ue = ie.getRootNode();
          if (fe != null && fe.current && ua && ue instanceof ShadowRoot) {
            var oe = w.getTargetRanges(),
              Ee = oe[0],
              ye = new window.Range();
            (ye.setStart(Ee.startContainer, Ee.startOffset),
              ye.setEnd(Ee.endContainer, Ee.endOffset));
            var Je = ce.toSlateRange(m, ye, { exactMatch: !1, suppressThrow: !0 });
            (Je && re.select(m, Je), w.preventDefault(), w.stopImmediatePropagation());
            return;
          }
          if ((ve(), !d && ce.hasEditableTarget(m, w.target) && !sy(w, c))) {
            var ut;
            if (ne.current) return ne.current.handleDOMBeforeInput(w);
            (R.flush(), ae.flush());
            var { selection: _e } = m,
              { inputType: Ne } = w,
              We = w.dataTransfer || w.data || void 0,
              pt = Ne === 'insertCompositionText' || Ne === 'deleteCompositionText';
            if (pt && ce.isComposing(m)) return;
            var Ve = !1;
            if (
              Ne === 'insertText' &&
              _e &&
              I.isCollapsed(_e) &&
              w.data &&
              w.data.length === 1 &&
              /[a-z ]/i.test(w.data) &&
              _e.anchor.offset !== 0 &&
              ((Ve = !0), m.marks && (Ve = !1), !Ja.get(m))
            ) {
              var _t,
                ot,
                { anchor: nn } = _e,
                [Gt, ru] = ce.toDOMPoint(m, nn),
                Yt = (_t = Gt.parentElement) === null || _t === void 0 ? void 0 : _t.closest('a'),
                Ft = ce.getWindow(m);
              if (Ve && Yt && ce.hasDOMNode(m, Yt)) {
                var Et,
                  er =
                    Ft == null
                      ? void 0
                      : Ft.document.createTreeWalker(Yt, NodeFilter.SHOW_TEXT).lastChild();
                er === Gt &&
                  ((Et = er.textContent) === null || Et === void 0 ? void 0 : Et.length) === ru &&
                  (Ve = !1);
              }
              if (
                Ve &&
                Gt.parentElement &&
                (Ft == null ||
                (ot = Ft.getComputedStyle(Gt.parentElement)) === null ||
                ot === void 0
                  ? void 0
                  : ot.whiteSpace) === 'pre'
              ) {
                var fl = C.above(m, {
                  at: nn.path,
                  match: (ol) => T.isElement(ol) && C.isBlock(m, ol),
                });
                fl && T.string(fl[0]).includes('	') && (Ve = !1);
              }
            }
            if ((!Ne.startsWith('delete') || Ne.startsWith('deleteBy')) && !Ja.get(m)) {
              var [an] = w.getTargetRanges();
              if (an) {
                var St = ce.toSlateRange(m, an, { exactMatch: !1, suppressThrow: !0 });
                if (!St) Ve = !1;
                else if (!_e || !I.equals(_e, St)) {
                  Ve = !1;
                  var mu = !pt && m.selection && C.rangeRef(m, m.selection);
                  (re.select(m, St), mu && el.set(m, mu));
                }
              }
            }
            if (pt) return;
            if ((Ve || w.preventDefault(), _e && I.isExpanded(_e) && Ne.startsWith('delete'))) {
              var Ut = Ne.endsWith('Backward') ? 'backward' : 'forward';
              C.deleteFragment(m, { direction: Ut });
              return;
            }
            switch (Ne) {
              case 'deleteByComposition':
              case 'deleteByCut':
              case 'deleteByDrag': {
                C.deleteFragment(m);
                break;
              }
              case 'deleteContent':
              case 'deleteContentForward': {
                C.deleteForward(m);
                break;
              }
              case 'deleteContentBackward': {
                C.deleteBackward(m);
                break;
              }
              case 'deleteEntireSoftLine': {
                (C.deleteBackward(m, { unit: 'line' }), C.deleteForward(m, { unit: 'line' }));
                break;
              }
              case 'deleteHardLineBackward': {
                C.deleteBackward(m, { unit: 'block' });
                break;
              }
              case 'deleteSoftLineBackward': {
                C.deleteBackward(m, { unit: 'line' });
                break;
              }
              case 'deleteHardLineForward': {
                C.deleteForward(m, { unit: 'block' });
                break;
              }
              case 'deleteSoftLineForward': {
                C.deleteForward(m, { unit: 'line' });
                break;
              }
              case 'deleteWordBackward': {
                C.deleteBackward(m, { unit: 'word' });
                break;
              }
              case 'deleteWordForward': {
                C.deleteForward(m, { unit: 'word' });
                break;
              }
              case 'insertLineBreak':
                C.insertSoftBreak(m);
                break;
              case 'insertParagraph': {
                C.insertBreak(m);
                break;
              }
              case 'insertFromComposition':
              case 'insertFromDrop':
              case 'insertFromPaste':
              case 'insertFromYank':
              case 'insertReplacementText':
              case 'insertText': {
                (Ne === 'insertFromComposition' && ce.isComposing(m) && (_(!1), na.set(m, !1)),
                  (We == null ? void 0 : We.constructor.name) === 'DataTransfer'
                    ? ce.insertData(m, We)
                    : typeof We == 'string' &&
                      (Ve ? le.current.push(() => C.insertText(m, We)) : C.insertText(m, We)));
                break;
              }
            }
            var tr = (ut = el.get(m)) === null || ut === void 0 ? void 0 : ut.unref();
            (el.delete(m), tr && (!m.selection || !I.equals(m.selection, tr)) && re.select(m, tr));
          }
        },
        [m, ae, ve, c, d, R],
      ),
      De = k.useCallback(
        (w) => {
          (w == null
            ? (ae.cancel(),
              R.cancel(),
              Ir.delete(m),
              ra.delete(m),
              J.current && wn && J.current.removeEventListener('beforeinput', G))
            : wn && w.addEventListener('beforeinput', G),
            (J.current = w),
            typeof u == 'function' ? u(w) : u && (u.current = w));
        },
        [ae, R, m, G, u],
      );
    tn(() => {
      var w = ce.getWindow(m),
        ie = (oe) => {
          var { target: Ee } = oe,
            ye = Ee instanceof HTMLElement ? Ee : null,
            Je = ye == null ? void 0 : ye.tagName;
          Je === 'INPUT' || Je === 'TEXTAREA' || R();
        };
      w.document.addEventListener('selectionchange', ie);
      var ue = () => {
        Z.isDraggingInternally = !1;
      };
      return (
        w.document.addEventListener('dragend', ue),
        w.document.addEventListener('drop', ue),
        () => {
          (w.document.removeEventListener('selectionchange', ie),
            w.document.removeEventListener('dragend', ue),
            w.document.removeEventListener('drop', ue));
        }
      );
    }, [R, Z]);
    var he = s([m, []]),
      Ce = TB(s),
      y =
        D &&
        m.children.length === 1 &&
        Array.from(T.texts(m)).length === 1 &&
        T.string(m) === '' &&
        !N,
      q = k.useCallback(
        (w) => {
          if (w && y) {
            var ie;
            se((ie = w.getBoundingClientRect()) === null || ie === void 0 ? void 0 : ie.height);
          } else se(void 0);
        },
        [y],
      );
    if (y) {
      var K = C.start(m, []);
      he.push({ [$a]: !0, placeholder: D, onPlaceholderResize: q, anchor: K, focus: K });
    }
    var { marks: W } = m;
    if (((Z.hasMarkPlaceholder = !1), m.selection && I.isCollapsed(m.selection) && W)) {
      var { anchor: ge } = m.selection,
        Ae = T.leaf(m, ge.path),
        { text: xe } = Ae,
        Ke = Ki(Ae, uy);
      if (!Iu.equals(Ae, W, { loose: !0 })) {
        Z.hasMarkPlaceholder = !0;
        var ze = Object.fromEntries(Object.keys(Ke).map((w) => [w, null]));
        he.push(Tu(Tu(Tu({ [dg]: !0 }, ze), W), {}, { anchor: ge, focus: ge }));
      }
    }
    return (
      k.useEffect(() => {
        setTimeout(() => {
          var { selection: w } = m;
          if (w) {
            var { anchor: ie } = w,
              ue = T.leaf(m, ie.path);
            if (W && !Iu.equals(ue, W, { loose: !0 })) {
              Bu.set(m, W);
              return;
            }
          }
          Bu.delete(m);
        });
      }),
      PB(),
      Oe.createElement(
        Mg.Provider,
        { value: d },
        Oe.createElement(
          ey.Provider,
          { value: N },
          Oe.createElement(
            bg.Provider,
            { value: Ce },
            Oe.createElement(
              IB,
              { node: J, receivedUserInput: de },
              Oe.createElement(
                z,
                Tu(
                  Tu(
                    {
                      role: d ? void 0 : 'textbox',
                      'aria-multiline': d ? void 0 : !0,
                      translate: 'no',
                    },
                    x,
                  ),
                  {},
                  {
                    spellCheck: wn || !qi ? x.spellCheck : !1,
                    autoCorrect: wn || !qi ? x.autoCorrect : 'false',
                    autoCapitalize: wn || !qi ? x.autoCapitalize : 'false',
                    'data-slate-editor': !0,
                    'data-slate-node': 'value',
                    contentEditable: !d,
                    zindex: -1,
                    suppressContentEditableWarning: !0,
                    ref: De,
                    style: Tu(
                      Tu(
                        {},
                        V
                          ? {}
                          : Tu(
                              {
                                position: 'relative',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                              },
                              P ? { minHeight: P } : {},
                            ),
                      ),
                      M,
                    ),
                    onBeforeInput: k.useCallback(
                      (w) => {
                        if (
                          !wn &&
                          !d &&
                          !kt(w, x.onBeforeInput) &&
                          ce.hasSelectableTarget(m, w.target) &&
                          (w.preventDefault(), !ce.isComposing(m))
                        ) {
                          var ie = w.data;
                          C.insertText(m, ie);
                        }
                      },
                      [x.onBeforeInput, m, d],
                    ),
                    onInput: k.useCallback(
                      (w) => {
                        if (!kt(w, x.onInput)) {
                          if (ne.current) {
                            ne.current.handleInput();
                            return;
                          }
                          for (var ie of le.current) ie();
                          ((le.current = []), ce.isFocused(m) || Kh(m, w.nativeEvent));
                        }
                      },
                      [x.onInput, m],
                    ),
                    onBlur: k.useCallback(
                      (w) => {
                        if (!(
                          d ||
                          Z.isUpdatingSelection ||
                          !ce.hasSelectableTarget(m, w.target) ||
                          kt(w, x.onBlur)
                        )) {
                          var ie = ce.findDocumentOrShadowRoot(m);
                          if (Z.latestElement !== ie.activeElement) {
                            var { relatedTarget: ue } = w,
                              oe = ce.toDOMNode(m, m);
                            if (ue !== oe && !(gu(ue) && ue.hasAttribute('data-slate-spacer'))) {
                              if (ue != null && Nn(ue) && ce.hasDOMNode(m, ue)) {
                                var Ee = ce.toSlateNode(m, ue);
                                if (T.isElement(Ee) && !m.isVoid(Ee)) return;
                              }
                              if (ua) {
                                var ye = Wr(ie);
                                ye == null || ye.removeAllRanges();
                              }
                              zn.delete(m);
                            }
                          }
                        }
                      },
                      [d, Z.isUpdatingSelection, Z.latestElement, m, x.onBlur],
                    ),
                    onClick: k.useCallback(
                      (w) => {
                        if (ce.hasTarget(m, w.target) && !kt(w, x.onClick) && Nn(w.target)) {
                          var ie = ce.toSlateNode(m, w.target),
                            ue = ce.findPath(m, ie);
                          if (!C.hasPath(m, ue) || T.get(m, ue) !== ie) return;
                          if (w.detail === SA && ue.length >= 1) {
                            var oe = ue;
                            if (!(T.isElement(ie) && C.isBlock(m, ie))) {
                              var Ee,
                                ye = C.above(m, {
                                  match: (Ve) => T.isElement(Ve) && C.isBlock(m, Ve),
                                  at: ue,
                                });
                              oe =
                                (Ee = ye == null ? void 0 : ye[1]) !== null && Ee !== void 0
                                  ? Ee
                                  : ue.slice(0, 1);
                            }
                            var Je = C.range(m, oe);
                            re.select(m, Je);
                            return;
                          }
                          if (d) return;
                          var ut = C.start(m, ue),
                            _e = C.end(m, ue),
                            Ne = C.void(m, { at: ut }),
                            We = C.void(m, { at: _e });
                          if (Ne && We && S.equals(Ne[1], We[1])) {
                            var pt = C.range(m, ut);
                            re.select(m, pt);
                          }
                        }
                      },
                      [m, x.onClick, d],
                    ),
                    onCompositionEnd: k.useCallback(
                      (w) => {
                        if (!Pr(w) && ce.hasSelectableTarget(m, w.target)) {
                          var ie;
                          if (
                            (ce.isComposing(m) &&
                              Promise.resolve().then(() => {
                                (_(!1), na.set(m, !1));
                              }),
                            (ie = ne.current) === null ||
                              ie === void 0 ||
                              ie.handleCompositionEnd(w),
                            kt(w, x.onCompositionEnd) || Ht)
                          )
                            return;
                          if (!ua && !dA && !fA && !vA && !DA && w.data) {
                            var ue = Bu.get(m);
                            (Bu.delete(m),
                              ue !== void 0 && ($u.set(m, m.marks), (m.marks = ue)),
                              C.insertText(m, w.data));
                            var oe = $u.get(m);
                            ($u.delete(m), oe !== void 0 && (m.marks = oe));
                          }
                        }
                      },
                      [x.onCompositionEnd, m],
                    ),
                    onCompositionUpdate: k.useCallback(
                      (w) => {
                        ce.hasSelectableTarget(m, w.target) &&
                          !kt(w, x.onCompositionUpdate) &&
                          !Pr(w) &&
                          (ce.isComposing(m) || (_(!0), na.set(m, !0)));
                      },
                      [x.onCompositionUpdate, m],
                    ),
                    onCompositionStart: k.useCallback(
                      (w) => {
                        if (!Pr(w) && ce.hasSelectableTarget(m, w.target)) {
                          var ie;
                          if (
                            ((ie = ne.current) === null ||
                              ie === void 0 ||
                              ie.handleCompositionStart(w),
                            kt(w, x.onCompositionStart) || Ht)
                          )
                            return;
                          _(!0);
                          var { selection: ue } = m;
                          if (ue && I.isExpanded(ue)) {
                            C.deleteFragment(m);
                            return;
                          }
                        }
                      },
                      [x.onCompositionStart, m],
                    ),
                    onCopy: k.useCallback(
                      (w) => {
                        ce.hasSelectableTarget(m, w.target) &&
                          !kt(w, x.onCopy) &&
                          !Pr(w) &&
                          (w.preventDefault(), ce.setFragmentData(m, w.clipboardData, 'copy'));
                      },
                      [x.onCopy, m],
                    ),
                    onCut: k.useCallback(
                      (w) => {
                        if (
                          !d &&
                          ce.hasSelectableTarget(m, w.target) &&
                          !kt(w, x.onCut) &&
                          !Pr(w)
                        ) {
                          (w.preventDefault(), ce.setFragmentData(m, w.clipboardData, 'cut'));
                          var { selection: ie } = m;
                          if (ie)
                            if (I.isExpanded(ie)) C.deleteFragment(m);
                            else {
                              var ue = T.parent(m, ie.anchor.path);
                              C.isVoid(m, ue) && re.delete(m);
                            }
                        }
                      },
                      [d, m, x.onCut],
                    ),
                    onDragOver: k.useCallback(
                      (w) => {
                        if (ce.hasTarget(m, w.target) && !kt(w, x.onDragOver)) {
                          var ie = ce.toSlateNode(m, w.target);
                          T.isElement(ie) && C.isVoid(m, ie) && w.preventDefault();
                        }
                      },
                      [x.onDragOver, m],
                    ),
                    onDragStart: k.useCallback(
                      (w) => {
                        if (!d && ce.hasTarget(m, w.target) && !kt(w, x.onDragStart)) {
                          var ie = ce.toSlateNode(m, w.target),
                            ue = ce.findPath(m, ie),
                            oe =
                              (T.isElement(ie) && C.isVoid(m, ie)) ||
                              C.void(m, { at: ue, voids: !0 });
                          if (oe) {
                            var Ee = C.range(m, ue);
                            re.select(m, Ee);
                          }
                          ((Z.isDraggingInternally = !0),
                            ce.setFragmentData(m, w.dataTransfer, 'drag'));
                        }
                      },
                      [d, m, x.onDragStart, Z],
                    ),
                    onDrop: k.useCallback(
                      (w) => {
                        if (!d && ce.hasTarget(m, w.target) && !kt(w, x.onDrop)) {
                          w.preventDefault();
                          var ie = m.selection,
                            ue = ce.findEventRange(m, w),
                            oe = w.dataTransfer;
                          (re.select(m, ue),
                            Z.isDraggingInternally &&
                              ie &&
                              !I.equals(ie, ue) &&
                              !C.void(m, { at: ue, voids: !0 }) &&
                              re.delete(m, { at: ie }),
                            ce.insertData(m, oe),
                            ce.isFocused(m) || ce.focus(m));
                        }
                      },
                      [d, m, x.onDrop, Z],
                    ),
                    onDragEnd: k.useCallback(
                      (w) => {
                        !d &&
                          Z.isDraggingInternally &&
                          x.onDragEnd &&
                          ce.hasTarget(m, w.target) &&
                          x.onDragEnd(w);
                      },
                      [d, Z, x, m],
                    ),
                    onFocus: k.useCallback(
                      (w) => {
                        if (
                          !d &&
                          !Z.isUpdatingSelection &&
                          ce.hasEditableTarget(m, w.target) &&
                          !kt(w, x.onFocus)
                        ) {
                          var ie = ce.toDOMNode(m, m),
                            ue = ce.findDocumentOrShadowRoot(m);
                          if (((Z.latestElement = ue.activeElement), Qa && w.target !== ie)) {
                            ie.focus();
                            return;
                          }
                          zn.set(m, !0);
                        }
                      },
                      [d, Z, m, x.onFocus],
                    ),
                    onKeyDown: k.useCallback(
                      (w) => {
                        if (!d && ce.hasEditableTarget(m, w.target)) {
                          var ie;
                          (ie = ne.current) === null || ie === void 0 || ie.handleKeyDown(w);
                          var { nativeEvent: ue } = w;
                          if (
                            (ce.isComposing(m) && ue.isComposing === !1 && (na.set(m, !1), _(!1)),
                            kt(w, x.onKeyDown) || ce.isComposing(m))
                          )
                            return;
                          var { selection: oe } = m,
                            Ee = m.children[oe !== null ? oe.focus.path[0] : 0],
                            ye = eg(T.string(Ee)) === 'rtl';
                          if (ft.isRedo(ue)) {
                            w.preventDefault();
                            var Je = m;
                            typeof Je.redo == 'function' && Je.redo();
                            return;
                          }
                          if (ft.isUndo(ue)) {
                            w.preventDefault();
                            var ut = m;
                            typeof ut.undo == 'function' && ut.undo();
                            return;
                          }
                          if (ft.isMoveLineBackward(ue)) {
                            (w.preventDefault(), re.move(m, { unit: 'line', reverse: !0 }));
                            return;
                          }
                          if (ft.isMoveLineForward(ue)) {
                            (w.preventDefault(), re.move(m, { unit: 'line' }));
                            return;
                          }
                          if (ft.isExtendLineBackward(ue)) {
                            (w.preventDefault(),
                              re.move(m, { unit: 'line', edge: 'focus', reverse: !0 }));
                            return;
                          }
                          if (ft.isExtendLineForward(ue)) {
                            (w.preventDefault(), re.move(m, { unit: 'line', edge: 'focus' }));
                            return;
                          }
                          if (ft.isMoveBackward(ue)) {
                            (w.preventDefault(),
                              oe && I.isCollapsed(oe)
                                ? re.move(m, { reverse: !ye })
                                : re.collapse(m, { edge: ye ? 'end' : 'start' }));
                            return;
                          }
                          if (ft.isMoveForward(ue)) {
                            (w.preventDefault(),
                              oe && I.isCollapsed(oe)
                                ? re.move(m, { reverse: ye })
                                : re.collapse(m, { edge: ye ? 'start' : 'end' }));
                            return;
                          }
                          if (ft.isMoveWordBackward(ue)) {
                            (w.preventDefault(),
                              oe && I.isExpanded(oe) && re.collapse(m, { edge: 'focus' }),
                              re.move(m, { unit: 'word', reverse: !ye }));
                            return;
                          }
                          if (ft.isMoveWordForward(ue)) {
                            (w.preventDefault(),
                              oe && I.isExpanded(oe) && re.collapse(m, { edge: 'focus' }),
                              re.move(m, { unit: 'word', reverse: ye }));
                            return;
                          }
                          if (wn) {
                            if (
                              (tc || ua) &&
                              oe &&
                              (ft.isDeleteBackward(ue) || ft.isDeleteForward(ue)) &&
                              I.isCollapsed(oe)
                            ) {
                              var _e = T.parent(m, oe.anchor.path);
                              if (
                                T.isElement(_e) &&
                                C.isVoid(m, _e) &&
                                (C.isInline(m, _e) || C.isBlock(m, _e))
                              ) {
                                (w.preventDefault(), C.deleteBackward(m, { unit: 'block' }));
                                return;
                              }
                            }
                          } else {
                            if (ft.isBold(ue) || ft.isItalic(ue) || ft.isTransposeCharacter(ue)) {
                              w.preventDefault();
                              return;
                            }
                            if (ft.isSoftBreak(ue)) {
                              (w.preventDefault(), C.insertSoftBreak(m));
                              return;
                            }
                            if (ft.isSplitBlock(ue)) {
                              (w.preventDefault(), C.insertBreak(m));
                              return;
                            }
                            if (ft.isDeleteBackward(ue)) {
                              (w.preventDefault(),
                                oe && I.isExpanded(oe)
                                  ? C.deleteFragment(m, { direction: 'backward' })
                                  : C.deleteBackward(m));
                              return;
                            }
                            if (ft.isDeleteForward(ue)) {
                              (w.preventDefault(),
                                oe && I.isExpanded(oe)
                                  ? C.deleteFragment(m, { direction: 'forward' })
                                  : C.deleteForward(m));
                              return;
                            }
                            if (ft.isDeleteLineBackward(ue)) {
                              (w.preventDefault(),
                                oe && I.isExpanded(oe)
                                  ? C.deleteFragment(m, { direction: 'backward' })
                                  : C.deleteBackward(m, { unit: 'line' }));
                              return;
                            }
                            if (ft.isDeleteLineForward(ue)) {
                              (w.preventDefault(),
                                oe && I.isExpanded(oe)
                                  ? C.deleteFragment(m, { direction: 'forward' })
                                  : C.deleteForward(m, { unit: 'line' }));
                              return;
                            }
                            if (ft.isDeleteWordBackward(ue)) {
                              (w.preventDefault(),
                                oe && I.isExpanded(oe)
                                  ? C.deleteFragment(m, { direction: 'backward' })
                                  : C.deleteBackward(m, { unit: 'word' }));
                              return;
                            }
                            if (ft.isDeleteWordForward(ue)) {
                              (w.preventDefault(),
                                oe && I.isExpanded(oe)
                                  ? C.deleteFragment(m, { direction: 'forward' })
                                  : C.deleteForward(m, { unit: 'word' }));
                              return;
                            }
                          }
                        }
                      },
                      [d, m, x.onKeyDown],
                    ),
                    onPaste: k.useCallback(
                      (w) => {
                        !d &&
                          ce.hasEditableTarget(m, w.target) &&
                          !kt(w, x.onPaste) &&
                          (!wn || tA(w.nativeEvent) || ua) &&
                          (w.preventDefault(), ce.insertData(m, w.clipboardData));
                      },
                      [d, m, x.onPaste],
                    ),
                  },
                ),
                Oe.createElement(ny, {
                  decorations: he,
                  node: m,
                  renderElement: g,
                  renderChunk: h,
                  renderPlaceholder: B,
                  renderLeaf: E,
                  renderText: A,
                }),
              ),
            ),
          ),
        ),
      )
    );
  }),
  ry = (n) => {
    var { attributes: u, children: r } = n;
    return Oe.createElement('span', Tu({}, u), r, Ht && Oe.createElement('br', null));
  },
  ly = () => [],
  iy = (n, u) => {
    var r = !!n.selection && I.isBackward(n.selection),
      l = u.cloneRange();
    if ((l.collapse(r), l.getBoundingClientRect)) {
      var s = l.startContainer.parentElement,
        c = l.getBoundingClientRect(),
        D = c.width === 0 && c.height === 0 && c.x === 0 && c.y === 0;
      if (D) {
        var d = s.getBoundingClientRect(),
          g = d.width > 0 || d.height > 0;
        if (g) return;
      }
      ((s.getBoundingClientRect = l.getBoundingClientRect.bind(l)),
        WE(s, { scrollMode: 'if-needed' }),
        delete s.getBoundingClientRect);
    }
  },
  kt = (n, u) => {
    if (!u) return !1;
    var r = u(n);
    return r ?? (n.isDefaultPrevented() || n.isPropagationStopped());
  },
  Pr = (n) =>
    Nn(n.target) &&
    (n.target instanceof HTMLInputElement || n.target instanceof HTMLTextAreaElement),
  sy = (n, u) => {
    if (!u) return !1;
    var r = u(n);
    return r ?? n.defaultPrevented;
  },
  Kh = (n, u) => {
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
  fy = k.createContext(!1),
  zg = parseInt(Oe.version.split('.')[0], 10),
  oy = ['editor', 'children', 'onChange', 'onSelectionChange', 'onValueChange', 'initialValue'],
  cy = (n) => {
    var {
        editor: u,
        children: r,
        onChange: l,
        onSelectionChange: s,
        onValueChange: c,
        initialValue: D,
      } = n,
      d = Ki(n, oy);
    Oe.useState(() => {
      if (!T.isNodeList(D))
        throw new Error(
          '[Slate] initialValue is invalid! Expected a list of elements but got: '.concat(
            Bt.stringify(D),
          ),
        );
      if (!C.isEditor(u))
        throw new Error('[Slate] editor is invalid! You passed: '.concat(Bt.stringify(u)));
      ((u.children = D), Object.assign(u, d));
    });
    var { selectorContext: g, onChange: h } = ZB(),
      E = k.useCallback(() => {
        (l && l(u.children),
          s && u.operations.find((F) => F.type === 'set_selection') && s(u.selection),
          c && u.operations.find((F) => F.type !== 'set_selection') && c(u.children),
          h());
      }, [u, h, l, s, c]);
    k.useEffect(
      () => (
        Go.set(u, E),
        () => {
          Go.set(u, () => {});
        }
      ),
      [u, E],
    );
    var [A, B] = k.useState(ce.isFocused(u));
    return (
      k.useEffect(() => {
        B(ce.isFocused(u));
      }, [u]),
      tn(() => {
        var F = () => B(ce.isFocused(u));
        return zg >= 17
          ? (document.addEventListener('focusin', F),
            document.addEventListener('focusout', F),
            () => {
              (document.removeEventListener('focusin', F),
                document.removeEventListener('focusout', F));
            })
          : (document.addEventListener('focus', F, !0),
            document.addEventListener('blur', F, !0),
            () => {
              (document.removeEventListener('focus', F, !0),
                document.removeEventListener('blur', F, !0));
            });
      }, [u]),
      Oe.createElement(
        ic.Provider,
        { value: g },
        Oe.createElement(lc.Provider, { value: u }, Oe.createElement(fy.Provider, { value: A }, r)),
      )
    );
  },
  dy = function (u) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'x-slate-fragment',
      l = u;
    l = FA(l, r);
    var { onChange: s, apply: c, insertText: D } = l;
    return (
      (l.getChunkSize = () => null),
      Ht && (l.insertText = (d, g) => (Wu.delete(l), D(d, g))),
      (l.onChange = (d) => {
        var g = zg < 18 ? nB.unstable_batchedUpdates : (h) => h();
        g(() => {
          s(d);
        });
      }),
      (l.apply = (d) => {
        if (d.type === 'move_node') {
          var g = T.parent(l, d.path),
            h = !!l.getChunkSize(g);
          if (h) {
            var E = T.get(l, d.path),
              A = xg(l, g),
              B = ce.findKey(l, E);
            A.movedNodeKeys.add(B);
          }
        }
        c(d);
      }),
      l
    );
  };
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */ function Qh(n) {
  return Object.prototype.toString.call(n) === '[object Object]';
}
function Dy(n) {
  var u, r;
  return Qh(n) === !1
    ? !1
    : ((u = n.constructor),
      u === void 0
        ? !0
        : ((r = u.prototype), !(Qh(r) === !1 || r.hasOwnProperty('isPrototypeOf') === !1)));
}
var vy = {
    isHistory(n) {
      return (
        Dy(n) &&
        Array.isArray(n.redos) &&
        Array.isArray(n.undos) &&
        (n.redos.length === 0 || jn.isOperationList(n.redos[0].operations)) &&
        (n.undos.length === 0 || jn.isOperationList(n.undos[0].operations))
      );
    },
  },
  Lo = new WeakMap(),
  ea = new WeakMap(),
  Li = new WeakMap(),
  wu = {
    isHistoryEditor(n) {
      return vy.isHistory(n.history) && C.isEditor(n);
    },
    isMerging(n) {
      return ea.get(n);
    },
    isSplittingOnce(n) {
      return Li.get(n);
    },
    setSplittingOnce(n, u) {
      Li.set(n, u);
    },
    isSaving(n) {
      return Lo.get(n);
    },
    redo(n) {
      n.redo();
    },
    undo(n) {
      n.undo();
    },
    withMerging(n, u) {
      var r = wu.isMerging(n);
      (ea.set(n, !0), u(), ea.set(n, r));
    },
    withNewBatch(n, u) {
      var r = wu.isMerging(n);
      (ea.set(n, !0), Li.set(n, !0), u(), ea.set(n, r), Li.delete(n));
    },
    withoutMerging(n, u) {
      var r = wu.isMerging(n);
      (ea.set(n, !1), u(), ea.set(n, r));
    },
    withoutSaving(n, u) {
      var r = wu.isSaving(n);
      Lo.set(n, !1);
      try {
        u();
      } finally {
        Lo.set(n, r);
      }
    },
  },
  hy = (n) => {
    var u = n,
      { apply: r } = u;
    return (
      (u.history = { undos: [], redos: [] }),
      (u.redo = () => {
        var { history: l } = u,
          { redos: s } = l;
        if (s.length > 0) {
          var c = s[s.length - 1];
          (c.selectionBefore && re.setSelection(u, c.selectionBefore),
            wu.withoutSaving(u, () => {
              C.withoutNormalizing(u, () => {
                for (var D of c.operations) u.apply(D);
              });
            }),
            l.redos.pop(),
            u.writeHistory('undos', c));
        }
      }),
      (u.undo = () => {
        var { history: l } = u,
          { undos: s } = l;
        if (s.length > 0) {
          var c = s[s.length - 1];
          (wu.withoutSaving(u, () => {
            C.withoutNormalizing(u, () => {
              var D = c.operations.map(jn.inverse).reverse();
              for (var d of D) u.apply(d);
              c.selectionBefore && re.setSelection(u, c.selectionBefore);
            });
          }),
            u.writeHistory('redos', c),
            l.undos.pop());
        }
      }),
      (u.apply = (l) => {
        var { operations: s, history: c } = u,
          { undos: D } = c,
          d = D[D.length - 1],
          g = d && d.operations[d.operations.length - 1],
          h = wu.isSaving(u),
          E = wu.isMerging(u);
        if ((h == null && (h = my(l)), h)) {
          if (
            (E == null && (d == null ? (E = !1) : s.length !== 0 ? (E = !0) : (E = gy(l, g))),
            wu.isSplittingOnce(u) && ((E = !1), wu.setSplittingOnce(u, void 0)),
            d && E)
          )
            d.operations.push(l);
          else {
            var A = { operations: [l], selectionBefore: u.selection };
            u.writeHistory('undos', A);
          }
          for (; D.length > 100;) D.shift();
          c.redos = [];
        }
        r(l);
      }),
      (u.writeHistory = (l, s) => {
        u.history[l].push(s);
      }),
      u
    );
  },
  gy = (n, u) =>
    !!(
      (u &&
        n.type === 'insert_text' &&
        u.type === 'insert_text' &&
        n.offset === u.offset + u.text.length &&
        S.equals(n.path, u.path)) ||
      (u &&
        n.type === 'remove_text' &&
        u.type === 'remove_text' &&
        n.offset + n.text.length === u.offset &&
        S.equals(n.path, u.path))
    ),
  my = (n, u) => n.type !== 'set_selection';
const jt = [];
for (let n = 0; n < 256; ++n) jt.push((n + 256).toString(16).slice(1));
function Cy(n, u = 0) {
  return (
    jt[n[u + 0]] +
    jt[n[u + 1]] +
    jt[n[u + 2]] +
    jt[n[u + 3]] +
    '-' +
    jt[n[u + 4]] +
    jt[n[u + 5]] +
    '-' +
    jt[n[u + 6]] +
    jt[n[u + 7]] +
    '-' +
    jt[n[u + 8]] +
    jt[n[u + 9]] +
    '-' +
    jt[n[u + 10]] +
    jt[n[u + 11]] +
    jt[n[u + 12]] +
    jt[n[u + 13]] +
    jt[n[u + 14]] +
    jt[n[u + 15]]
  ).toLowerCase();
}
const py = new Uint8Array(16);
function Ey() {
  return crypto.getRandomValues(py);
}
function xu(n, u, r) {
  return crypto.randomUUID ? crypto.randomUUID() : Ay(n);
}
function Ay(n, u, r) {
  var s;
  n = n || {};
  const l = n.random ?? ((s = n.rng) == null ? void 0 : s.call(n)) ?? Ey();
  if (l.length < 16) throw new Error('Random bytes length must be >= 16');
  return ((l[6] = (l[6] & 15) | 64), (l[8] = (l[8] & 63) | 128), Cy(l));
}
const By = (n, u) => {
    yy(n, u) ? n.removeMark(u) : n.addMark(u, !0);
  },
  yy = (n, u) => {
    const r = n.marks;
    return r ? r[u] === !0 : !1;
  },
  Hi = { BOLD: 'bold', ITALIC: 'italic', UNDERLINE: 'underline', CODE: 'code' },
  Fe = {
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
  by = (n, u) => {
    const r = Fy(n, u);
    re.setNodes(
      n,
      { type: r ? Fe.PARAGRAPH : u },
      { match: (l) => Pa.isElement(l) && n.isBlock(l) },
    );
  },
  Fy = (n, u) => {
    const { selection: r } = n;
    return r
      ? Array.from(
          n.nodes({
            at: n.unhangRange(r),
            match: (s) => !s.isEditor && Pa.isElement(s) && s.type === u,
          }),
        ).length > 0
      : !1;
  },
  un = ({ type: n, pluginId: u, children: r }) =>
    X.jsx('div', {
      'data-plugin-id': u,
      'data-block-type': n,
      style: { position: 'relative' },
      children: r,
    }),
  Sy = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.PARAGRAPH,
      pluginId: r,
      children: X.jsx('p', { ...n, style: { margin: '8px 0', lineHeight: '1.8' }, children: u }),
    }),
  Oy = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.HEADING_ONE,
      pluginId: r,
      children: X.jsx('h1', {
        ...n,
        style: { fontSize: '24px', fontWeight: 'bold', margin: '16px 0 8px' },
        children: u,
      }),
    }),
  xy = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.HEADING_TWO,
      pluginId: r,
      children: X.jsx('h2', {
        ...n,
        style: { fontSize: '20px', fontWeight: 'bold', margin: '14px 0 8px' },
        children: u,
      }),
    }),
  Ty = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.HEADING_THREE,
      pluginId: r,
      children: X.jsx('h3', {
        ...n,
        style: { fontSize: '18px', fontWeight: 'bold', margin: '12px 0 8px' },
        children: u,
      }),
    }),
  wy = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.BLOCKQUOTE,
      pluginId: r,
      children: X.jsx('blockquote', {
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
  My = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.CODE_BLOCK,
      pluginId: r,
      children: X.jsx('pre', {
        ...n,
        style: {
          margin: '12px 0',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          overflowX: 'auto',
        },
        children: X.jsx('code', {
          style: { fontFamily: 'monospace', fontSize: '14px', color: '#333' },
          children: u,
        }),
      }),
    }),
  Ry = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.BULLETED_LIST,
      pluginId: r,
      children: X.jsx('ul', {
        ...n,
        style: { margin: '8px 0', paddingLeft: '24px', listStyleType: 'disc' },
        children: u,
      }),
    }),
  jy = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.NUMBERED_LIST,
      pluginId: r,
      children: X.jsx('ol', { ...n, style: { margin: '8px 0', paddingLeft: '24px' }, children: u }),
    }),
  zy = ({ attributes: n, children: u, pluginId: r }) =>
    X.jsx(un, {
      type: Fe.LIST_ITEM,
      pluginId: r,
      children: X.jsx('li', { ...n, style: { margin: '4px 0' }, children: u }),
    }),
  Ny = ({ attributes: n, children: u, leaf: r }) => {
    let l = u;
    return (
      r.bold && (l = X.jsx('strong', { children: l })),
      r.italic && (l = X.jsx('em', { children: l })),
      r.underline && (l = X.jsx('u', { children: l })),
      r.code &&
        (l = X.jsx('code', {
          style: {
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '2px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
          },
          children: l,
        })),
      X.jsx('span', { ...n, children: l })
    );
  },
  Ng = k.createContext(null),
  Ly = ({ children: n }) => {
    const [u, r] = k.useState(!1),
      [l, s] = k.useState({ x: 0, y: 0 }),
      [c, D] = k.useState(null),
      [d, g] = k.useState(!1),
      [h, E] = k.useState(null),
      A = k.useRef(null),
      B = k.useRef(!1);
    k.useEffect(() => {
      B.current = d;
    }, [d]);
    const F = k.useCallback((V, x, m) => {
        (A.current && clearTimeout(A.current), D(V), s({ x, y: m }), r(!0));
      }, []),
      M = k.useCallback(() => {
        (A.current && clearTimeout(A.current),
          (A.current = window.setTimeout(() => {
            B.current || (r(!1), D(null));
          }, 200)));
      }, []),
      z = k.useCallback(() => {
        (A.current && clearTimeout(A.current), r(!1), D(null));
      }, []);
    return X.jsx(Ng.Provider, {
      value: {
        visible: u,
        position: l,
        targetId: c,
        hoveringMenu: d,
        activeDocbarId: h,
        openMenu: F,
        closeMenu: M,
        forceCloseMenu: z,
        setHoveringMenu: g,
        setActiveDocbarId: E,
      },
      children: n,
    });
  },
  Lg = () => {
    const n = k.useContext(Ng);
    if (!n) throw new Error('useMenu must be used within a MenuProvider');
    return n;
  },
  Hg = k.createContext(null),
  Hy = ({ children: n }) => {
    const [u, r] = k.useState(!1);
    return (
      k.useEffect(() => {
        const l = () => {
          const s = window.getSelection();
          s && !s.isCollapsed ? r(!0) : r(!1);
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
      X.jsx(Hg.Provider, { value: { hasSelection: u }, children: n })
    );
  },
  Uy = () => {
    const n = k.useContext(Hg);
    if (!n) throw new Error('useSelection must be used within a SelectionProvider');
    return n;
  },
  qy = () => {
    const { visible: n, position: u, closeMenu: r, setHoveringMenu: l } = Lg(),
      s = k.useRef(null),
      c = k.useCallback(() => {
        if (!s.current) return;
        const d = s.current,
          g = d.getBoundingClientRect(),
          h = window.innerHeight,
          E = h - 40;
        if (
          (g.height > E
            ? ((d.style.maxHeight = `${E}px`), (d.style.overflowY = 'auto'))
            : ((d.style.maxHeight = 'none'), (d.style.overflowY = 'visible')),
          g.bottom > h)
        ) {
          const A = h - g.height - 20;
          A >= 0 && (d.style.top = `${A}px`);
        }
      }, []);
    k.useEffect(() => {
      n &&
        requestAnimationFrame(() => {
          c();
        });
    }, [n, u, c]);
    const D = (d) => {
      (console.log('Menu action:', d), r());
    };
    return n
      ? X.jsxs(X.Fragment, {
          children: [
            X.jsx('div', {
              style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 },
              onClick: r,
            }),
            X.jsxs('div', {
              ref: s,
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
              onClick: (d) => d.stopPropagation(),
              onMouseEnter: () => l(!0),
              onMouseLeave: () => l(!1),
              children: [
                X.jsxs('div', {
                  style: { padding: '4px', display: 'flex', flexWrap: 'wrap', gap: '2px' },
                  children: [
                    X.jsx('button', {
                      onClick: () => D('text'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#40a9ff'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = '#1890ff'),
                      children: 'T',
                    }),
                    X.jsx('button', {
                      onClick: () => D('h1'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: 'H1',
                    }),
                    X.jsx('button', {
                      onClick: () => D('h2'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: 'H2',
                    }),
                    X.jsx('button', {
                      onClick: () => D('h3'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: 'H3',
                    }),
                    X.jsx('button', {
                      onClick: () => D('numbered-list'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: '≡',
                    }),
                    X.jsx('button', {
                      onClick: () => D('bulleted-list'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: '≡',
                    }),
                  ],
                }),
                X.jsx('div', { style: { height: '1px', backgroundColor: '#e8e8e8' } }),
                X.jsxs('div', {
                  style: { padding: '4px', display: 'flex', flexWrap: 'wrap', gap: '2px' },
                  children: [
                    X.jsx('button', {
                      onClick: () => D('checkbox'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: '☐',
                    }),
                    X.jsx('button', {
                      onClick: () => D('code'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                    }),
                    X.jsx('button', {
                      onClick: () => D('quote'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: '"',
                    }),
                    X.jsx('button', {
                      onClick: () => D('code-block'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: '</>',
                    }),
                    X.jsx('button', {
                      onClick: () => D('link'),
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
                      onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                      onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                      children: '🔗',
                    }),
                  ],
                }),
                X.jsx('div', { style: { height: '1px', backgroundColor: '#e8e8e8' } }),
                X.jsxs('button', {
                  onClick: () => D('indent'),
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
                  onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    X.jsx('span', { style: { fontSize: '14px' }, children: '☰' }),
                    X.jsx('span', { children: '缩进和对齐' }),
                    X.jsx('span', {
                      style: { marginLeft: 'auto', fontSize: '12px', color: '#999' },
                      children: '›',
                    }),
                  ],
                }),
                X.jsxs('button', {
                  onClick: () => D('color'),
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
                  onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    X.jsx('span', { style: { fontSize: '14px' }, children: '🎨' }),
                    X.jsx('span', { children: '颜色' }),
                    X.jsx('span', {
                      style: { marginLeft: 'auto', fontSize: '12px', color: '#999' },
                      children: '›',
                    }),
                  ],
                }),
                X.jsx('div', { style: { height: '1px', backgroundColor: '#e8e8e8' } }),
                X.jsxs('button', {
                  onClick: () => D('comment'),
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
                  onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    X.jsx('span', { style: { fontSize: '14px' }, children: '💬' }),
                    X.jsx('span', { children: '评论' }),
                  ],
                }),
                X.jsxs('button', {
                  onClick: () => D('cut'),
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
                  onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    X.jsx('span', { style: { fontSize: '14px' }, children: '✂' }),
                    X.jsx('span', { children: '剪切' }),
                  ],
                }),
                X.jsxs('button', {
                  onClick: () => D('copy'),
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
                  onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    X.jsx('span', { style: { fontSize: '14px' }, children: '📋' }),
                    X.jsx('span', { children: '复制' }),
                  ],
                }),
                X.jsxs('button', {
                  onClick: () => D('delete'),
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
                  onMouseEnter: (d) => (d.currentTarget.style.backgroundColor = '#f5f5f5'),
                  onMouseLeave: (d) => (d.currentTarget.style.backgroundColor = 'transparent'),
                  children: [
                    X.jsx('span', { style: { fontSize: '14px' }, children: '🗑' }),
                    X.jsx('span', { children: '删除' }),
                  ],
                }),
              ],
            }),
          ],
        })
      : null;
  },
  Ug = k.createContext(null),
  ky = ({ children: n }) => {
    const [u, r] = k.useState(null),
      l = k.useRef(null);
    return (
      k.useEffect(() => {
        const s = (c) => {
          const D = c.target;
          if ((l.current && clearTimeout(l.current), !!D.closest('[data-docbar-area]'))) return;
          const g = D.closest('[data-plugin-id]');
          if (g) {
            const h = g.getAttribute('data-plugin-id'),
              E = g.getAttribute('data-block-type');
            if (h && E) {
              const A = g.getBoundingClientRect();
              r({ id: h, type: E, rect: A });
              return;
            }
          }
          l.current = window.setTimeout(() => {
            r(null);
          }, 300);
        };
        return (
          document.addEventListener('mousemove', s),
          () => {
            (document.removeEventListener('mousemove', s), l.current && clearTimeout(l.current));
          }
        );
      }, []),
      X.jsx(Ug.Provider, { value: { activeElement: u }, children: n })
    );
  },
  _y = () => {
    const n = k.useContext(Ug);
    if (!n) throw new Error('useDocBar must be used within a DocBarProvider');
    return n;
  },
  Gy = (n) => {
    switch (n) {
      case Fe.HEADING_ONE:
      case Fe.HEADING_TWO:
      case Fe.HEADING_THREE:
        return 'H';
      case Fe.BLOCKQUOTE:
        return '"';
      case Fe.CODE_BLOCK:
        return '&lt;/&gt;';
      case Fe.BULLETED_LIST:
      case Fe.NUMBERED_LIST:
      case Fe.LIST_ITEM:
        return '☰';
      default:
        return 'T';
    }
  },
  Yy = (n) => {
    switch (n) {
      case Fe.HEADING_ONE:
      case Fe.HEADING_TWO:
      case Fe.HEADING_THREE:
        return '#1890ff';
      case Fe.BLOCKQUOTE:
        return '#faad14';
      case Fe.CODE_BLOCK:
        return '#722ed1';
      case Fe.BULLETED_LIST:
      case Fe.NUMBERED_LIST:
      case Fe.LIST_ITEM:
        return '#52c41a';
      default:
        return '#999';
    }
  },
  Vy = () => {
    const { activeElement: n } = _y(),
      { openMenu: u, closeMenu: r, hoveringMenu: l } = Lg(),
      { hasSelection: s } = Uy(),
      [c, D] = k.useState(!1),
      d = k.useRef(null),
      g = k.useRef(null);
    (k.useEffect(
      () => () => {
        d.current && clearTimeout(d.current);
      },
      [],
    ),
      k.useEffect(() => {
        s && (D(!1), r());
      }, [s, r]),
      k.useEffect(() => {
        n && (g.current = n);
      }, [n]));
    const h = k.useCallback(
        (F) => {
          var z;
          (d.current && clearTimeout(d.current), D(!0));
          const M = F.currentTarget.getBoundingClientRect();
          u(((z = g.current) == null ? void 0 : z.id) || '', M.left + M.width + 8, M.top);
        },
        [u],
      ),
      E = k.useCallback(() => {
        D(!1);
      }, []);
    k.useEffect(
      () => (
        !n &&
          !c &&
          !l &&
          (d.current = window.setTimeout(() => {
            r();
          }, 200)),
        () => {
          d.current && clearTimeout(d.current);
        }
      ),
      [n, c, l, r],
    );
    const A = (n || c || l) && !s,
      B = n || g.current;
    return !A || !B
      ? null
      : X.jsxs('div', {
          'data-docbar-area': !0,
          style: {
            position: 'fixed',
            left: B.rect.left - 52,
            top: B.rect.top + 4,
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            zIndex: 1e3,
            pointerEvents: 'auto',
          },
          onMouseEnter: h,
          onMouseLeave: E,
          children: [
            X.jsx('div', {
              style: {
                width: '24px',
                height: '24px',
                border: 'none',
                background: '#fff',
                borderRadius: '4px 0 0 4px',
                cursor: 'pointer',
                fontSize: '12px',
                color: Yy(B.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: '0',
              },
              children: Gy(B.type),
            }),
            X.jsx('div', {
              style: {
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '10px',
                cursor: 'move',
                borderRadius: '0 4px 4px 0',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.15s ease',
              },
              children: '⋮⋮',
            }),
          ],
        });
  };
function Xy() {
  const n = Rg(),
    [u, r] = k.useState(!1),
    [l, s] = k.useState({ x: 0, y: 0 }),
    [c, D] = k.useState(null),
    d = k.useRef(null),
    g = k.useCallback(() => {
      const A = window.getSelection();
      if (!A || A.isCollapsed) {
        r(!1);
        return;
      }
      const F = A.getRangeAt(0).getBoundingClientRect(),
        M = F.left + F.width / 2 - 180,
        z = F.top - 44;
      (s({ x: Math.max(20, Math.min(M, window.innerWidth - 380)), y: Math.max(20, z) }), r(!0));
    }, []);
  if (
    (k.useEffect(() => {
      const A = () => {
          (d.current && clearTimeout(d.current),
            (d.current = window.setTimeout(() => {
              g();
            }, 50)));
        },
        B = () => {
          const M = window.getSelection();
          (!M || M.isCollapsed) && r(!1);
        },
        F = (M) => {
          M.target.closest('.float-bar') || (r(!1), D(null));
        };
      return (
        document.addEventListener('mouseup', A),
        document.addEventListener('selectionchange', B),
        document.addEventListener('click', F),
        () => {
          (document.removeEventListener('mouseup', A),
            document.removeEventListener('selectionchange', B),
            document.removeEventListener('click', F),
            d.current && clearTimeout(d.current));
        }
      );
    }, [g]),
    !u)
  )
    return null;
  const h = (A, B) => {
      const F = window.getSelection();
      (F && !F.isCollapsed && (B ? By(n, A) : by(n, A)), D(null));
    },
    E = ({ icon: A, label: B, onClick: F, hasDropdown: M }) =>
      X.jsxs('button', {
        onClick: F,
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
        onMouseEnter: (z) => (z.currentTarget.style.backgroundColor = '#f5f5f5'),
        onMouseLeave: (z) => (z.currentTarget.style.backgroundColor = 'transparent'),
        children: [
          A,
          B && X.jsx('span', { style: { fontSize: '12px' }, children: B }),
          M && X.jsx('span', { style: { fontSize: '10px', color: '#999' }, children: '▼' }),
        ],
      });
  return X.jsx('div', {
    className: 'float-bar',
    children: X.jsxs('div', {
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
        X.jsxs('div', {
          style: { position: 'relative' },
          children: [
            X.jsx(E, {
              icon: 'T',
              onClick: () => D(c === 'text' ? null : 'text'),
              hasDropdown: !0,
            }),
            c === 'text' &&
              X.jsxs('div', {
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
                  X.jsx('div', {
                    style: {
                      padding: '4px 8px',
                      fontSize: '12px',
                      color: '#999',
                      fontWeight: '600',
                    },
                    children: '标题',
                  }),
                  X.jsx('button', {
                    onClick: () => {
                      (h(Fe.HEADING_ONE, !1), D(null));
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
                    onMouseEnter: (A) => (A.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: 'H1 标题',
                  }),
                  X.jsx('button', {
                    onClick: () => {
                      (h(Fe.HEADING_TWO, !1), D(null));
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
                    onMouseEnter: (A) => (A.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: 'H2 标题',
                  }),
                  X.jsx('button', {
                    onClick: () => {
                      (h(Fe.HEADING_THREE, !1), D(null));
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
                    onMouseEnter: (A) => (A.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: 'H3 标题',
                  }),
                  X.jsx('div', {
                    style: { height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' },
                  }),
                  X.jsx('button', {
                    onClick: () => {
                      (h(Fe.PARAGRAPH, !1), D(null));
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
                    onMouseEnter: (A) => (A.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: '正文',
                  }),
                ],
              }),
          ],
        }),
        X.jsxs('div', {
          style: { position: 'relative' },
          children: [
            X.jsx(E, {
              icon: '☰',
              onClick: () => D(c === 'list' ? null : 'list'),
              hasDropdown: !0,
            }),
            c === 'list' &&
              X.jsxs('div', {
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
                  X.jsx('button', {
                    onClick: () => {
                      (h(Fe.BULLETED_LIST, !1), D(null));
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
                    onMouseEnter: (A) => (A.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: '• 无序列表',
                  }),
                  X.jsx('button', {
                    onClick: () => {
                      (h(Fe.NUMBERED_LIST, !1), D(null));
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
                    onMouseEnter: (A) => (A.currentTarget.style.backgroundColor = '#f5f5f5'),
                    children: '1. 有序列表',
                  }),
                ],
              }),
          ],
        }),
        X.jsx('div', {
          style: { width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' },
        }),
        X.jsx(E, {
          icon: X.jsx('span', { style: { fontWeight: 'bold' }, children: 'B' }),
          onClick: () => h(Hi.BOLD, !0),
        }),
        X.jsx(E, {
          icon: X.jsx('span', { style: { fontStyle: 'italic' }, children: 'I' }),
          onClick: () => h(Hi.ITALIC, !0),
        }),
        X.jsx(E, {
          icon: X.jsx('span', { style: { textDecoration: 'underline' }, children: 'U' }),
          onClick: () => h(Hi.UNDERLINE, !0),
        }),
        X.jsx('div', {
          style: { width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' },
        }),
        X.jsx(E, { icon: '{', onClick: () => h(Hi.CODE, !0) }),
        X.jsx(E, { icon: '“', onClick: () => h(Fe.BLOCKQUOTE, !1) }),
        X.jsx(E, { icon: '</>', onClick: () => h(Fe.CODE_BLOCK, !1) }),
        X.jsx('div', {
          style: { width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' },
        }),
        X.jsx(E, { icon: '🔗', onClick: () => {} }),
        X.jsx(E, { icon: '💬', onClick: () => {} }),
      ],
    }),
  });
}
const Ky = [
    { type: Fe.HEADING_ONE, id: xu(), children: [{ text: '欢迎使用文档编辑器' }] },
    {
      type: Fe.PARAGRAPH,
      id: xu(),
      style: { lineHeight: '1.8' },
      attrs: { customData: 'intro-content' },
      children: [
        {
          text: '这是一个基于 Slate 构建的文档编辑器。支持富文本编辑，包括标题、段落、列表、引用等功能。',
        },
      ],
    },
    { type: Fe.HEADING_TWO, id: xu(), children: [{ text: '主要功能' }] },
    {
      type: Fe.PARAGRAPH,
      id: xu(),
      children: [
        {
          text: '支持多种标题级别、粗体斜体下划线格式化、有序列表和无序列表、代码块和行内代码、引用块等功能。',
        },
      ],
    },
    { type: Fe.HEADING_TWO, id: xu(), children: [{ text: '引用示例' }] },
    {
      type: Fe.BLOCKQUOTE,
      id: xu(),
      attrs: { cite: 'https://example.com' },
      children: [{ text: '这是一段引用文字。引用功能可以用来强调重要内容或引用他人观点。' }],
    },
    { type: Fe.HEADING_TWO, id: xu(), children: [{ text: '代码示例' }] },
    {
      type: Fe.CODE_BLOCK,
      id: xu(),
      attrs: { language: 'javascript' },
      children: [{ text: 'console.log("Hello, World!");' }],
    },
    { type: Fe.HEADING_THREE, id: xu(), children: [{ text: '小标题示例' }] },
    {
      type: Fe.PARAGRAPH,
      id: xu(),
      children: [
        {
          text: '你可以使用工具栏中的按钮来格式化文本。选中文字后点击相应的格式按钮即可应用样式。',
        },
      ],
    },
  ],
  Qy = ({ element: n, attributes: u, children: r }) => {
    const l = n;
    switch (l.type) {
      case Fe.HEADING_ONE:
        return X.jsx(Oy, { attributes: u, children: r, pluginId: l.id });
      case Fe.HEADING_TWO:
        return X.jsx(xy, { attributes: u, children: r, pluginId: l.id });
      case Fe.HEADING_THREE:
        return X.jsx(Ty, { attributes: u, children: r, pluginId: l.id });
      case Fe.BLOCKQUOTE:
        return X.jsx(wy, { attributes: u, children: r, pluginId: l.id });
      case Fe.CODE_BLOCK:
        return X.jsx(My, { attributes: u, children: r, pluginId: l.id });
      case Fe.LIST_ITEM:
        return X.jsx(zy, { attributes: u, children: r, pluginId: l.id });
      case Fe.NUMBERED_LIST:
        return X.jsx(jy, { attributes: u, children: r, pluginId: l.id });
      case Fe.BULLETED_LIST:
        return X.jsx(Ry, { attributes: u, children: r, pluginId: l.id });
      default:
        return X.jsx(Sy, { attributes: u, children: r, pluginId: l.id });
    }
  },
  Zy = (n) => X.jsx(Ny, { ...n });
function Py() {
  const n = k.useMemo(() => hy(dy(ME())), []);
  return X.jsx(cy, {
    editor: n,
    initialValue: Ky,
    children: X.jsx(Hy, {
      children: X.jsxs(Ly, {
        children: [
          X.jsx(Xy, {}),
          X.jsx(qy, {}),
          X.jsxs(ky, {
            children: [
              X.jsx(Vy, {}),
              X.jsx('div', {
                style: {
                  maxWidth: '800px',
                  margin: '0 auto',
                  padding: '40px 48px 40px 72px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  minHeight: '500px',
                },
                children: X.jsx(ay, {
                  renderElement: Qy,
                  renderLeaf: Zy,
                  placeholder: '开始编写文档...',
                  style: { minHeight: '500px', outline: 'none' },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
function Jy() {
  return X.jsx('div', {
    style: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' },
    children: X.jsx(Py, {}),
  });
}
iC.createRoot(document.getElementById('root')).render(
  X.jsx(k.StrictMode, { children: X.jsx(Jy, {}) }),
);
