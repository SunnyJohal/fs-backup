/* eslint-disable */
!(function(t, e) {
  'function' == typeof define && define.amd
    ? define(e)
    : 'object' == typeof exports
      ? (module.exports = e(require, exports, module))
      : (t.ScrollReveal = e());
})(this, function(t, e, i) {
  return (
    function() {
      var t, e, i;
      this.ScrollReveal = (function() {
        function n(i) {
          return window == this
            ? new n(i)
            : ((e = this),
              (e.tools = new t()),
              e.tools.extend(e.defaults, i || {}),
              e.supported() ||
                console.log('ScrollReveal is not supported in this browser.'),
              (e.store = { elements: {}, containers: [] }),
              (e.history = []),
              (e.counter = 0),
              (e.initialized = !1),
              e);
        }
        function o(t, i) {
          t.config
            ? (t.config = e.tools.extendClone(t.config, i))
            : (t.config = e.tools.extendClone(e.defaults, i)),
            'top' === t.config.origin || 'bottom' === t.config.origin
              ? (t.config.axis = 'Y')
              : (t.config.axis = 'X'),
            ('top' === t.config.origin || 'left' === t.config.origin) &&
              (t.config.distance = '-' + t.config.distance);
        }
        function r(t) {
          function e(e) {
            parseInt(i.distance) &&
              ((e.initial += ' translate' + i.axis + '(' + i.distance + ')'),
              (e.target += ' translate' + i.axis + '(0)')),
              i.scale &&
                ((e.initial += ' scale(' + i.scale + ')'),
                (e.target += ' scale(1)')),
              i.rotate.x &&
                ((e.initial += ' rotateX(' + i.rotate.x + 'deg)'),
                (e.target += ' rotateX(0)')),
              i.rotate.y &&
                ((e.initial += ' rotateY(' + i.rotate.y + 'deg)'),
                (e.target += ' rotateY(0)')),
              i.rotate.z &&
                ((e.initial += ' rotateZ(' + i.rotate.z + 'deg)'),
                (e.target += ' rotateZ(0)')),
              (e.initial += '; opacity: ' + i.opacity + ';'),
              (e.target += '; opacity: ' + t.styles.computed.opacity + ';');
          }
          var i = t.config,
            n = window.getComputedStyle(t.domEl);
          t.styles ||
            ((t.styles = { transition: {}, transform: {}, computed: {} }),
            (t.styles.inline = t.domEl.getAttribute('style') || ''),
            (t.styles.inline += '; visibility: visible; '),
            (t.styles.computed.opacity = n.opacity),
            n.transition && 'all 0s ease 0s' != n.transition
              ? (t.styles.computed.transition = n.transition + ', ')
              : (t.styles.computed.transition = '')),
            (t.styles.transition.instant =
              '-webkit-transition: ' +
              t.styles.computed.transition +
              '-webkit-transform ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' 0s, opacity ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' 0s; transition: ' +
              t.styles.computed.transition +
              'transform ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' 0s, opacity ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' 0s; '),
            (t.styles.transition.delayed =
              '-webkit-transition: ' +
              t.styles.computed.transition +
              '-webkit-transform ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' ' +
              i.delay / 1e3 +
              's, opacity ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' ' +
              i.delay / 1e3 +
              's; transition: ' +
              t.styles.computed.transition +
              'transform ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' ' +
              i.delay / 1e3 +
              's, opacity ' +
              i.duration / 1e3 +
              's ' +
              i.easing +
              ' ' +
              i.delay / 1e3 +
              's; '),
            (t.styles.transform.initial = ' -webkit-transform:'),
            (t.styles.transform.target = ' -webkit-transform:'),
            e(t.styles.transform),
            (t.styles.transform.initial += 'transform:'),
            (t.styles.transform.target += 'transform:'),
            e(t.styles.transform);
        }
        function s(t) {
          var i = t.config.container;
          i &&
            -1 == e.store.containers.indexOf(i) &&
            e.store.containers.push(t.config.container),
            (e.store.elements[t.id] = t);
        }
        function a(t, i) {
          var n = { selector: t, config: i };
          e.history.push(n);
        }
        function l() {
          if (e.supported()) {
            f();
            for (var t = 0; t < e.store.containers.length; t++)
              e.store.containers[t].addEventListener('scroll', c),
                e.store.containers[t].addEventListener('resize', c);
            e.initialized ||
              (window.addEventListener('scroll', c),
              window.addEventListener('resize', c),
              (e.initialized = !0));
          }
          return e;
        }
        function c() {
          i(f);
        }
        function f() {
          function t(t, e) {
            var i = 0,
              n = 0,
              o = 'after';
            switch (t) {
              case 'reveal':
                (n = e.config.duration + e.config.delay), (o += 'Reveal');
                break;
              case 'reset':
                (n = e.config.duration), (o += 'Reset');
            }
            return (
              e.timer &&
                ((i = Math.abs(e.timer.started - new Date())),
                window.clearTimeout(e.timer.clock)),
              (e.timer = { started: new Date() }),
              (e.timer.clock = window.setTimeout(function() {
                e.config[o](e.domEl), (e.timer = null);
              }, n - i)),
              'reveal' === t ? (e.revealed = !0) : (e.revealed = !1)
            );
          }
          var i, n;
          e.tools.forOwn(e.store.elements, function(o) {
            return (
              (i = e.store.elements[o]),
              (n = m(i)),
              !n || i.revealed || i.disabled
                ? void (
                    !n &&
                    i.config.reset &&
                    i.revealed &&
                    !i.disabled &&
                    (i.domEl.setAttribute(
                      'style',
                      i.styles.inline +
                        i.styles.transform.initial +
                        i.styles.transition.instant
                    ),
                    t('reset', i))
                  )
                : ('always' === i.config.useDelay ||
                  ('onload' === i.config.useDelay && !e.initialized) ||
                  ('once' === i.config.useDelay && !i.seen)
                    ? i.domEl.setAttribute(
                        'style',
                        i.styles.inline +
                          i.styles.transform.target +
                          i.styles.transition.delayed
                      )
                    : i.domEl.setAttribute(
                        'style',
                        i.styles.inline +
                          i.styles.transform.target +
                          i.styles.transition.instant
                      ),
                  t('reveal', i),
                  (i.seen = !0))
            );
          });
        }
        function d(t) {
          t || (t = window.document.documentElement);
          var e = t.clientWidth,
            i = t.clientHeight;
          return { width: e, height: i };
        }
        function u(t) {
          if (t) {
            var e = y(t);
            return { x: t.scrollLeft + e.left, y: t.scrollTop + e.top };
          }
          return { x: window.pageXOffset, y: window.pageYOffset };
        }
        function y(t) {
          var e = 0,
            i = 0,
            n = t.offsetHeight,
            o = t.offsetWidth;
          do
            isNaN(t.offsetTop) || (e += t.offsetTop),
              isNaN(t.offsetLeft) || (i += t.offsetLeft);
          while ((t = t.offsetParent));
          return { top: e, left: i, height: n, width: o };
        }
        function m(t) {
          function e() {
            var e = c + a * s,
              i = f + l * s,
              n = m - a * s,
              d = g - l * s,
              u = r.y + t.config.viewOffset.top,
              y = r.x + t.config.viewOffset.left,
              p = r.y - t.config.viewOffset.bottom + o.height,
              w = r.x - t.config.viewOffset.right + o.width;
            return p > e && n > u && i > y && w > d;
          }
          function i() {
            return 'fixed' === window.getComputedStyle(t.domEl).position;
          }
          var n = y(t.domEl),
            o = d(t.config.container),
            r = u(t.config.container),
            s = t.config.viewFactor,
            a = n.height,
            l = n.width,
            c = n.top,
            f = n.left,
            m = c + a,
            g = f + l;
          return e() || i();
        }
        return (
          (n.prototype.defaults = {
            origin: 'bottom',
            distance: '20px',
            duration: 500,
            delay: 0,
            rotate: { x: 0, y: 0, z: 0 },
            opacity: 0,
            scale: 0.9,
            easing: 'cubic-bezier( 0.6, 0.2, 0.1, 1 )',
            container: null,
            mobile: !0,
            reset: !1,
            useDelay: 'always',
            viewFactor: 0.2,
            viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
            afterReveal: function(t) {},
            afterReset: function(t) {}
          }),
          (n.prototype.supported = function() {
            var t = document.documentElement.style;
            return ('WebkitTransition' in t && 'WebkitTransform' in t) ||
              ('transition' in t && 'transform' in t)
              ? !0
              : !1;
          }),
          (n.prototype.reveal = function(t, i, n) {
            var c, f, d, u;
            if (
              ((f =
                i && i.container
                  ? i.container
                  : e.defaults.container
                    ? e.defaults.container
                    : window.document.documentElement),
              (c = Array.prototype.slice.call(f.querySelectorAll(t))),
              !c.length)
            )
              return (
                console.log("reveal('" + t + "') failed: no elements found."), e
              );
            for (var y = 0; y < c.length; y++)
              (u = c[y].getAttribute('data-sr-id')),
                u
                  ? (d = e.store.elements[u])
                  : ((d = {
                      id: ++e.counter,
                      domEl: c[y],
                      seen: !1,
                      revealed: !1
                    }),
                    d.domEl.setAttribute('data-sr-id', d.id)),
                o(d, i || {}),
                r(d),
                s(d),
                (e.tools.isMobile() && !d.config.mobile) || !e.supported()
                  ? (d.domEl.setAttribute('style', d.styles.inline),
                    (d.disabled = !0))
                  : d.revealed ||
                    d.domEl.setAttribute(
                      'style',
                      d.styles.inline + d.styles.transform.initial
                    );
            return (
              !n &&
                e.supported() &&
                (a(t, i),
                e.initTimeout && window.clearTimeout(e.initTimeout),
                (e.initTimeout = window.setTimeout(l, 0))),
              e
            );
          }),
          (n.prototype.sync = function() {
            if (e.history.length && e.supported()) {
              for (var t = 0; t < e.history.length; t++) {
                var i = e.history[t];
                e.reveal(i.selector, i.config, !0);
              }
              l();
            } else console.log('sync() failed: no reveals found.');
            return e;
          }),
          n
        );
      })();
      var t = (function() {
          function t() {}
          return (
            (t.prototype.isObject = function(t) {
              return (
                null !== t && 'object' == typeof t && t.constructor == Object
              );
            }),
            (t.prototype.forOwn = function(t, e) {
              if (!this.isObject(t))
                throw new TypeError(
                  "Expected 'object', but received '" + typeof t + "'."
                );
              for (var i in t) t.hasOwnProperty(i) && e(i);
            }),
            (t.prototype.extend = function(t, e) {
              return (
                this.forOwn(
                  e,
                  function(i) {
                    this.isObject(e[i])
                      ? ((t[i] && this.isObject(t[i])) || (t[i] = {}),
                        this.extend(t[i], e[i]))
                      : (t[i] = e[i]);
                  }.bind(this)
                ),
                t
              );
            }),
            (t.prototype.extendClone = function(t, e) {
              return this.extend(this.extend({}, t), e);
            }),
            (t.prototype.isMobile = function() {
              return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              );
            }),
            t
          );
        })(),
        i =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame;
    }.call(this),
    this.ScrollReveal
  );
});
