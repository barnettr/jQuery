/*! qTip2 v2.0.0 | http://craigsworks.com/projects/qtip2/ | Licensed MIT, GPL */
(function (a, b, c) {
    (function (a) {
        "use strict", typeof define == "function" && define.amd ? define(["jquery"], a) : jQuery && !jQuery.fn.qtip && a(jQuery)
    })(function (d) {
        function I(a) {
            var b = function (a) {
                return a === g || "object" != typeof a
            }, c = function (a) {
                return !d.isFunction(a) && (!a && !a.attr || a.length < 1 || "object" == typeof a && !a.jquery)
            };
            if (!a || "object" != typeof a) return f;
            b(a.metadata) && (a.metadata = {
                type: a.metadata
            });
            if ("content" in a) {
                if (b(a.content) || a.content.jquery) a.content = {
                    text: a.content
                };
                c(a.content.text || f) && (a.content.text = f), "title" in a.content && (b(a.content.title) && (a.content.title = {
                    text: a.content.title
                }), c(a.content.title.text || f) && (a.content.title.text = f))
            }
            return "position" in a && b(a.position) && (a.position = {
                my: a.position,
                at: a.position
            }), "show" in a && b(a.show) && (a.show = a.show.jquery ? {
                target: a.show
            } : {
                event: a.show
            }), "hide" in a && b(a.hide) && (a.hide = a.hide.jquery ? {
                target: a.hide
            } : {
                event: a.hide
            }), "style" in a && b(a.style) && (a.style = {
                classes: a.style
            }), d.each(u, function () {
                this.sanitize && this.sanitize(a)
            }), a
        }
        function J(h, i, q, r) {
            function Q(a) {
                var b = 0,
                    c, d = i,
                    e = a.split(".");
                while (d = d[e[b++]]) b < e.length && (c = d);
                return [c || i, e.pop()]
            }
            function R(a, b, c) {
                var e = d.Event("tooltip" + a);
                return e.originalEvent = (c ? d.extend({}, c) : g) || P.event || g, M.trigger(e, [s].concat(b || [])), !e.isDefaultPrevented()
            }
            function S() {
                var a = i.style.widget;
                M.toggleClass("ui-helper-reset " + y, a).toggleClass(B, i.style.def && !a), O.content && O.content.toggleClass(y + "-content", a), O.titlebar && O.titlebar.toggleClass(y + "-header", a), O.button && O.button.toggleClass(x + "-icon", !a)
            }
            function T(a) {
                O.title && (O.titlebar.remove(), O.titlebar = O.title = O.button = g, a !== f && s.reposition())
            }
            function U() {
                var a = i.content.title.button,
                    b = typeof a == "string",
                    c = b ? a : "Close tooltip";
                O.button && O.button.remove(), a.jquery ? O.button = a : O.button = d("<a />", {
                    "class": "ui-state-default ui-tooltip-close " + (i.style.widget ? "" : x + "-icon"),
                    title: c,
                    "aria-label": c
                }).prepend(d("<span />", {
                    "class": "ui-icon ui-icon-close",
                    html: "&times;"
                })), O.button.appendTo(O.titlebar).attr("role", "button").click(function (a) {
                    return M.hasClass(z) || s.hide(a), f
                }), s.redraw()
            }
            function V() {
                var a = J + "-title";
                O.titlebar && T(), O.titlebar = d("<div />", {
                    "class": x + "-titlebar " + (i.style.widget ? "ui-widget-header" : "")
                }).append(O.title = d("<div />", {
                    id: a,
                    "class": x + "-title",
                    "aria-atomic": e
                })).insertBefore(O.content).delegate(".ui-tooltip-close", "mousedown keydown mouseup keyup mouseout", function (a) {
                    d(this).toggleClass("ui-state-active ui-state-focus", a.type.substr(-4) === "down")
                }).delegate(".ui-tooltip-close", "mouseover mouseout", function (a) {
                    d(this).toggleClass("ui-state-hover", a.type === "mouseover")
                }), i.content.title.button ? U() : s.rendered && s.redraw()
            }
            function W(a) {
                var b = O.button,
                    c = O.title;
                if (!s.rendered) return f;
                a ? (c || V(), U()) : b.remove()
            }
            function X(a, b) {
                var c = O.title;
                if (!s.rendered || !a) return f;
                d.isFunction(a) && (a = a.call(h, P.event, s));
                if (a === f || !a && a !== "") return T(f);
                a.jquery && a.length > 0 ? c.empty().append(a.css({
                    display: "block"
                })) : c.html(a), s.redraw(), b !== f && s.rendered && M[0].offsetWidth > 0 && s.reposition(P.event)
            }
            function Y(a, b) {
                function g(a) {
                    function i(c) {
                        c && (delete h[c.src], clearTimeout(s.timers.img[c.src]), d(c).unbind(N)), d.isEmptyObject(h) && (s.redraw(), b !== f && s.reposition(P.event), a())
                    }
                    var g, h = {};
                    if ((g = e.find("img[src]:not([height]):not([width])")).length === 0) return i();
                    g.each(function (a, b) {
                        if (h[b.src] !== c) return;
                        var e = 0,
                            f = 3;
                        (function g() {
                            if (b.height || b.width || e > f) return i(b);
                            e += 1, s.timers.img[b.src] = setTimeout(g, 700)
                        })(), d(b).bind("error" + N + " load" + N, function () {
                            i(this)
                        }), h[b.src] = b
                    })
                }
                var e = O.content;
                return !s.rendered || !a ? f : (d.isFunction(a) && (a = a.call(h, P.event, s) || ""), a.jquery && a.length > 0 ? e.empty().append(a.css({
                    display: "block"
                })) : e.html(a), s.rendered < 0 ? M.queue("fx", g) : (L = 0, g(d.noop)), s)
            }
            function Z() {
                function l(a) {
                    if (M.hasClass(z)) return f;
                    clearTimeout(s.timers.show), clearTimeout(s.timers.hide);
                    var b = function () {
                        s.toggle(e, a)
                    };
                    i.show.delay > 0 ? s.timers.show = setTimeout(b, i.show.delay) : b()
                }
                function m(a) {
                    if (M.hasClass(z) || K || L) return f;
                    var b = d(a.relatedTarget || a.target),
                        e = b.closest(A)[0] === M[0],
                        h = b[0] === g.show[0];
                    clearTimeout(s.timers.show), clearTimeout(s.timers.hide);
                    if (c.target === "mouse" && e || i.hide.fixed && /mouse(out|leave|move)/.test(a.type) && (e || h)) {
                        try {
                            a.preventDefault(), a.stopImmediatePropagation()
                        } catch (j) {}
                        return
                    }
                    i.hide.delay > 0 ? s.timers.hide = setTimeout(function () {
                        s.hide(a)
                    }, i.hide.delay) : s.hide(a)
                }
                function n(a) {
                    if (M.hasClass(z)) return f;
                    clearTimeout(s.timers.inactive), s.timers.inactive = setTimeout(function () {
                        s.hide(a)
                    }, i.hide.inactive)
                }
                function o(a) {
                    s.rendered && M[0].offsetWidth > 0 && s.reposition(a)
                }
                var c = i.position,
                    g = {
                        show: i.show.target,
                        hide: i.hide.target,
                        viewport: d(c.viewport),
                        document: d(b),
                        body: d(b.body),
                        window: d(a)
                    }, j = {
                        show: d.trim("" + i.show.event).split(" "),
                        hide: d.trim("" + i.hide.event).split(" ")
                    }, k = d.browser.msie && parseInt(d.browser.version, 10) === 6;
                M.bind("mouseenter" + N + " mouseleave" + N, function (a) {
                    var b = a.type === "mouseenter";
                    b && s.focus(a), M.toggleClass(D, b)
                }), /mouse(out|leave)/i.test(i.hide.event) && i.hide.leave === "window" && g.window.bind("mouseout" + N + " blur" + N, function (a) {
                    !/select|option/.test(a.target.nodeName) && !a.relatedTarget && s.hide(a)
                }), i.hide.fixed ? (g.hide = g.hide.add(M), M.bind("mouseover" + N, function () {
                    M.hasClass(z) || clearTimeout(s.timers.hide)
                })) : /mouse(over|enter)/i.test(i.show.event) && g.hide.bind("mouseleave" + N, function (a) {
                    clearTimeout(s.timers.show)
                }), ("" + i.hide.event).indexOf("unfocus") > -1 && c.container.closest("html").bind("mousedown" + N, function (a) {
                    var b = d(a.target),
                        c = s.rendered && !M.hasClass(z) && M[0].offsetWidth > 0,
                        e = b.parents(A).filter(M[0]).length > 0;
                    b[0] !== h[0] && b[0] !== M[0] && !e && !h.has(b[0]).length && !b.attr("disabled") && s.hide(a)
                }), "number" == typeof i.hide.inactive && (g.show.bind("qtip-" + q + "-inactive", n), d.each(t.inactiveEvents, function (a, b) {
                    g.hide.add(O.tooltip).bind(b + N + "-inactive", n)
                })), d.each(j.hide, function (a, b) {
                    var c = d.inArray(b, j.show),
                        e = d(g.hide);
                    c > -1 && e.add(g.show).length === e.length || b === "unfocus" ? (g.show.bind(b + N, function (a) {
                        M[0].offsetWidth > 0 ? m(a) : l(a)
                    }), delete j.show[c]) : g.hide.bind(b + N, m)
                }), d.each(j.show, function (a, b) {
                    g.show.bind(b + N, l)
                }), "number" == typeof i.hide.distance && g.show.add(M).bind("mousemove" + N, function (a) {
                    var b = P.origin || {}, c = i.hide.distance,
                        d = Math.abs;
                    (d(a.pageX - b.pageX) >= c || d(a.pageY - b.pageY) >= c) && s.hide(a)
                }), c.target === "mouse" && (g.show.bind("mousemove" + N, function (a) {
                    v = {
                        pageX: a.pageX,
                        pageY: a.pageY,
                        type: "mousemove"
                    }
                }), c.adjust.mouse && (i.hide.event && (M.bind("mouseleave" + N, function (a) {
                    (a.relatedTarget || a.target) !== g.show[0] && s.hide(a)
                }), O.target.bind("mouseenter" + N + " mouseleave" + N, function (a) {
                    P.onTarget = a.type === "mouseenter"
                })), g.document.bind("mousemove" + N, function (a) {
                    s.rendered && P.onTarget && !M.hasClass(z) && M[0].offsetWidth > 0 && s.reposition(a || v)
                }))), (c.adjust.resize || g.viewport.length) && (d.event.special.resize ? g.viewport : g.window).bind("resize" + N, o), (g.viewport.length || k && M.css("position") === "fixed") && g.viewport.bind("scroll" + N, o)
            }
            function _() {
                var c = [i.show.target[0], i.hide.target[0], s.rendered && O.tooltip[0], i.position.container[0], i.position.viewport[0], i.position.container.closest("html")[0], a, b];
                s.rendered ? d([]).pushStack(d.grep(c, function (a) {
                    return typeof a == "object"
                })).unbind(N) : i.show.target.unbind(N + "-create")
            }
            var s = this,
                E = b.body,
                J = x + "-" + q,
                K = 0,
                L = 0,
                M = d(),
                N = ".qtip-" + q,
                O, P;
            s.id = q, s.rendered = f, s.destroyed = f, s.elements = O = {
                target: h
            }, s.timers = {
                img: {}
            }, s.options = i, s.checks = {}, s.plugins = {}, s.cache = P = {
                event: {},
                target: d(),
                disabled: f,
                attr: r,
                onTarget: f,
                lastClass: ""
            }, s.checks.builtin = {
                "^id$": function (a, b, c) {
                    var g = c === e ? t.nextid : c,
                        h = x + "-" + g;
                    g !== f && g.length > 0 && !d("#" + h).length && (M[0].id = h, O.content[0].id = h + "-content", O.title[0].id = h + "-title")
                },
                "^content.text$": function (a, b, c) {
                    Y(c)
                },
                "^content.title.text$": function (a, b, c) {
                    if (!c) return T();
                    !O.title && c && V(), X(c)
                },
                "^content.title.button$": function (a, b, c) {
                    W(c)
                },
                "^position.(my|at)$": function (a, b, c) {
                    "string" == typeof c && (a[b] = new u.Corner(c))
                },
                "^position.container$": function (a, b, c) {
                    s.rendered && M.appendTo(c)
                },
                "^show.ready$": function () {
                    s.rendered ? s.toggle(e) : s.render(1)
                },
                "^style.classes$": function (a, b, c) {
                    M.attr("class", x + " qtip " + c)
                },
                "^style.widget|content.title": S,
                "^events.(render|show|move|hide|focus|blur)$": function (a, b, c) {
                    M[(d.isFunction(c) ? "" : "un") + "bind"]("tooltip" + b, c)
                },
                "^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)": function () {
                    var a = i.position;
                    M.attr("tracking", a.target === "mouse" && a.adjust.mouse), _(), Z()
                }
            }, d.extend(s, {
                render: function (a) {
                    if (s.rendered) return s;
                    var b = i.content.text,
                        c = i.content.title.text,
                        g = i.position;
                    return d.attr(h[0], "aria-describedby", J), M = O.tooltip = d("<div/>", {
                        id: J,
                        "class": x + " qtip " + B + " " + i.style.classes + " " + x + "-pos-" + i.position.my.abbrev(),
                        width: i.style.width || "",
                        height: i.style.height || "",
                        tracking: g.target === "mouse" && g.adjust.mouse,
                        role: "alert",
                        "aria-live": "polite",
                        "aria-atomic": f,
                        "aria-describedby": J + "-content",
                        "aria-hidden": e
                    }).toggleClass(z, P.disabled).data("qtip", s).appendTo(i.position.container).append(O.content = d("<div />", {
                        "class": x + "-content",
                        id: J + "-content",
                        "aria-atomic": e
                    })), s.rendered = -1, L = 1, K = 1, c && (V(), d.isFunction(c) || X(c, f)), d.isFunction(b) || Y(b, f), s.rendered = e, S(), d.each(i.events, function (a, b) {
                        d.isFunction(b) && M.bind(a === "toggle" ? "tooltipshow tooltiphide" : "tooltip" + a, b)
                    }), d.each(u, function () {
                        this.initialize === "render" && this(s)
                    }), Z(), M.queue("fx", function (b) {
                        R("render"), L = 0, K = 0, s.redraw(), (i.show.ready || a) && s.toggle(e, P.event, f), b()
                    }), s
                },
                get: function (a) {
                    var b, c;
                    switch (a.toLowerCase()) {
                        case "dimensions":
                            b = {
                                height: M.outerHeight(),
                                width: M.outerWidth()
                            };
                            break;
                        case "offset":
                            b = u.offset(M, i.position.container);
                            break;
                        default:
                            c = Q(a.toLowerCase()), b = c[0][c[1]], b = b.precedance ? b.string() : b
                    }
                    return b
                },
                set: function (a, b) {
                    function n(a, b) {
                        var c, d, e;
                        for (c in l) for (d in l[c]) if (e = (new RegExp(d, "i")).exec(a)) b.push(e), l[c][d].apply(s, b)
                    }
                    var c = /^position\.(my|at|adjust|target|container)|style|content|show\.ready/i,
                        h = /^content\.(title|attr)|style/i,
                        j = f,
                        k = f,
                        l = s.checks,
                        m;
                    return "string" == typeof a ? (m = a, a = {}, a[m] = b) : a = d.extend(e, {}, a), d.each(a, function (b, e) {
                        var f = Q(b.toLowerCase()),
                            g;
                        g = f[0][f[1]], f[0][f[1]] = "object" == typeof e && e.nodeType ? d(e) : e, a[b] = [f[0], f[1], e, g], j = c.test(b) || j, k = h.test(b) || k
                    }), I(i), K = L = 1, d.each(a, n), K = L = 0, s.rendered && M[0].offsetWidth > 0 && (j && s.reposition(i.position.target === "mouse" ? g : P.event), k && s.redraw()), s
                },
                toggle: function (a, c) {
                    function t() {
                        a ? (d.browser.msie && M[0].style.removeAttribute("filter"), M.css("overflow", ""), "string" == typeof h.autofocus && d(h.autofocus, M).focus(), h.target.trigger("qtip-" + q + "-inactive")) : M.css({
                            display: "",
                            visibility: "",
                            opacity: "",
                            left: "",
                            top: ""
                        }), R(a ? "visible" : "hidden")
                    }
                    if (!s.rendered) return a ? s.render(1) : s;
                    var g = a ? "show" : "hide",
                        h = i[g],
                        j = i[a ? "hide" : "show"],
                        k = i.position,
                        l = i.content,
                        m = M[0].offsetWidth > 0,
                        n = a || h.target.length === 1,
                        o = !c || h.target.length < 2 || P.target[0] === c.target,
                        p, r;
                    (typeof a).search("boolean|number") && (a = !m);
                    if (!M.is(":animated") && m === a && o) return s;
                    if (c) {
                        if (/over|enter/.test(c.type) && /out|leave/.test(P.event.type) && i.show.target.add(c.target).length === i.show.target.length && M.has(c.relatedTarget).length) return s;
                        P.event = d.extend({}, c)
                    }
                    return R(g, [90]) ? (d.attr(M[0], "aria-hidden", !a), a ? (P.origin = d.extend({}, v), s.focus(c), d.isFunction(l.text) && Y(l.text, f), d.isFunction(l.title.text) && X(l.title.text, f), !G && k.target === "mouse" && k.adjust.mouse && (d(b).bind("mousemove.qtip", function (a) {
                        v = {
                            pageX: a.pageX,
                            pageY: a.pageY,
                            type: "mousemove"
                        }
                    }), G = e), s.reposition(c, arguments[2]), !h.solo || d(A, h.solo).not(M).qtip("hide", d.Event("tooltipsolo"))) : (clearTimeout(s.timers.show), delete P.origin, G && !d(A + '[tracking="true"]:visible', h.solo).not(M).length && (d(b).unbind("mousemove.qtip"), G = f), s.blur(c)), h.effect === f || n === f ? (M[g](), t.call(M)) : d.isFunction(h.effect) ? (M.stop(1, 1), h.effect.call(M, s), M.queue("fx", function (a) {
                        t(), a()
                    })) : M.fadeTo(90, a ? 1 : 0, t), a && h.target.trigger("qtip-" + q + "-inactive"), s) : s
                },
                show: function (a) {
                    return s.toggle(e, a)
                },
                hide: function (a) {
                    return s.toggle(f, a)
                },
                focus: function (a) {
                    if (!s.rendered) return s;
                    var b = d(A),
                        c = parseInt(M[0].style.zIndex, 10),
                        e = t.zindex + b.length,
                        f = d.extend({}, a),
                        g;
                    return M.hasClass(C) || R("focus", [e], f) && (c !== e && (b.each(function () {
                        this.style.zIndex > c && (this.style.zIndex = this.style.zIndex - 1)
                    }), b.filter("." + C).qtip("blur", f)), M.addClass(C)[0].style.zIndex = e), s
                },
                blur: function (a) {
                    return M.removeClass(C), R("blur", [M.css("zIndex")], a), s
                },
                reposition: function (c, e) {
                    if (!s.rendered || K) return s;
                    K = 1;
                    var g = i.position.target,
                        h = i.position,
                        j = h.my,
                        k = h.at,
                        q = h.adjust,
                        r = q.method.split(" "),
                        t = M.outerWidth(),
                        w = M.outerHeight(),
                        x = 0,
                        y = 0,
                        z = M.css("position") === "fixed",
                        A = h.viewport,
                        B = {
                            left: 0,
                            top: 0
                        }, C = h.container,
                        D = M[0].offsetWidth > 0,
                        E, F, G;
                    if (d.isArray(g) && g.length === 2) k = {
                        x: m,
                        y: l
                    }, B = {
                        left: g[0],
                        top: g[1]
                    };
                    else if (g === "mouse" && (c && c.pageX || P.event.pageX)) k = {
                        x: m,
                        y: l
                    }, c = (c && (c.type === "resize" || c.type === "scroll") ? P.event : c && c.pageX && c.type === "mousemove" ? c : v && v.pageX && (q.mouse || !c || !c.pageX) ? {
                        pageX: v.pageX,
                        pageY: v.pageY
                    } : !q.mouse && P.origin && P.origin.pageX && i.show.distance ? P.origin : c) || c || P.event || v || {}, B = {
                        top: c.pageY,
                        left: c.pageX
                    };
                    else {
                        g === "event" && c && c.target && c.type !== "scroll" && c.type !== "resize" ? P.target = d(c.target) : g !== "event" && (P.target = d(g.jquery ? g : O.target)), g = P.target, g = d(g).eq(0);
                        if (g.length === 0) return s;
                        g[0] === b || g[0] === a ? (x = u.iOS ? a.innerWidth : g.width(), y = u.iOS ? a.innerHeight : g.height(), g[0] === a && (B = {
                            top: (A || g).scrollTop(),
                            left: (A || g).scrollLeft()
                        })) : u.imagemap && g.is("area") ? E = u.imagemap(s, g, k, u.viewport ? r : f) : u.svg && typeof g[0].xmlbase == "string" ? E = u.svg(s, g, k, u.viewport ? r : f) : (x = g.outerWidth(), y = g.outerHeight(), B = u.offset(g, C)), E && (x = E.width, y = E.height, F = E.offset, B = E.position);
                        if (u.iOS > 3.1 && u.iOS < 4.1 || u.iOS >= 4.3 && u.iOS < 4.33 || !u.iOS && z) G = d(a), B.left -= G.scrollLeft(), B.top -= G.scrollTop();
                        B.left += k.x === o ? x : k.x === p ? x / 2 : 0, B.top += k.y === n ? y : k.y === p ? y / 2 : 0
                    }
                    return B.left += q.x + (j.x === o ? -t : j.x === p ? -t / 2 : 0), B.top += q.y + (j.y === n ? -w : j.y === p ? -w / 2 : 0), u.viewport ? (B.adjusted = u.viewport(s, B, h, x, y, t, w), F && B.adjusted.left && (B.left += F.left), F && B.adjusted.top && (B.top += F.top)) : B.adjusted = {
                        left: 0,
                        top: 0
                    }, R("move", [B, A.elem || A], c) ? (delete B.adjusted, e === f || !D || isNaN(B.left) || isNaN(B.top) || g === "mouse" || !d.isFunction(h.effect) ? M.css(B) : d.isFunction(h.effect) && (h.effect.call(M, s, d.extend({}, B)), M.queue(function (a) {
                        d(this).css({
                            opacity: "",
                            height: ""
                        }), d.browser.msie && this.style.removeAttribute("filter"), a()
                    })), K = 0, s) : s
                },
                redraw: function () {
                    if (s.rendered < 1 || L) return s;
                    var a = i.style,
                        b = i.position.container,
                        c, d, e, f;
                    return L = 1, R("redraw"), a.height && M.css(k, a.height), a.width ? M.css(j, a.width) : (M.css(j, "").appendTo(H), d = M.width(), d % 2 < 1 && (d += 1), e = M.css("max-width") || "", f = M.css("min-width") || "", c = (e + f).indexOf("%") > -1 ? b.width() / 100 : 0, e = (e.indexOf("%") > -1 ? c : 1) * parseInt(e, 10) || d, f = (f.indexOf("%") > -1 ? c : 1) * parseInt(f, 10) || 0, d = e + f ? Math.min(Math.max(d, f), e) : d, M.css(j, Math.round(d)).appendTo(b)), R("redrawn"), L = 0, s
                },
                disable: function (a) {
                    return "boolean" != typeof a && (a = !M.hasClass(z) && !P.disabled), s.rendered ? (M.toggleClass(z, a), d.attr(M[0], "aria-disabled", a)) : P.disabled = !! a, s
                },
                enable: function () {
                    return s.disable(f)
                },
                destroy: function () {
                    var a = h[0],
                        b = d.attr(a, F),
                        c = h.data("qtip");
                    s.destroyed = e, s.rendered && (M.stop(1, 0).remove(), d.each(s.plugins, function () {
                        this.destroy && this.destroy()
                    })), clearTimeout(s.timers.show), clearTimeout(s.timers.hide), _();
                    if (!c || s === c) d.removeData(a, "qtip"), i.suppress && b && (d.attr(a, "title", b), h.removeAttr(F)), h.removeAttr("aria-describedby");
                    return h.unbind(".qtip-" + q), delete w[s.id], h
                }
            })
        }
        function K(a, c) {
            var h, i, j, k, l, m = d(this),
                n = d(b.body),
                o = this === b ? n : m,
                p = m.metadata ? m.metadata(c.metadata) : g,
                q = c.metadata.type === "html5" && p ? p[c.metadata.name] : g,
                r = m.data(c.metadata.name || "qtipopts");
            try {
                r = typeof r == "string" ? d.parseJSON(r) : r
            } catch (s) {}
            k = d.extend(e, {}, t.defaults, c, typeof r == "object" ? I(r) : g, I(q || p)), i = k.position, k.id = a;
            if ("boolean" == typeof k.content.text) {
                j = m.attr(k.content.attr);
                if (k.content.attr !== f && j) k.content.text = j;
                else return f
            }
            i.container.length || (i.container = n), i.target === f && (i.target = o), k.show.target === f && (k.show.target = o), k.show.solo === e && (k.show.solo = i.container.closest("body")), k.hide.target === f && (k.hide.target = o), k.position.viewport === e && (k.position.viewport = i.container), i.container = i.container.eq(0), i.at = new u.Corner(i.at), i.my = new u.Corner(i.my);
            if (d.data(this, "qtip")) if (k.overwrite) m.qtip("destroy");
            else if (k.overwrite === f) return f;
            return k.suppress && (l = d.attr(this, "title")) && d(this).removeAttr("title").attr(F, l).attr("title", ""), h = new J(m, k, a, !! j), d.data(this, "qtip", h), m.bind("remove.qtip-" + a + " removeqtip.qtip-" + a, function () {
                h.destroy()
            }), h
        }
        function L(a) {
            var b = this,
                c = a.elements.tooltip,
                g = a.options.content.ajax,
                h = t.defaults.content.ajax,
                i = ".qtip-ajax",
                j = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                k = e,
                l = f,
                m;
            a.checks.ajax = {
                "^content.ajax": function (a, d, e) {
                    d === "ajax" && (g = e), d === "once" ? b.init() : g && g.url ? b.load() : c.unbind(i)
                }
            }, d.extend(b, {
                init: function () {
                    return g && g.url && c.unbind(i)[g.once ? "one" : "bind"]("tooltipshow" + i, b.load), b
                },
                load: function (c) {
                    function r() {
                        var b;
                        if (a.destroyed) return;
                        k = f, p && (l = e, a.show(c.originalEvent)), (b = h.complete || g.complete) && d.isFunction(b) && b.apply(g.context || a, arguments)
                    }
                    function s(b, c, e) {
                        var f;
                        if (a.destroyed) return;
                        o && "string" == typeof b && (b = d("<div/>").append(b.replace(j, "")).find(o)), (f = h.success || g.success) && d.isFunction(f) ? f.call(g.context || a, b, c, e) : a.set("content.text", b)
                    }
                    function t(b, c, d) {
                        if (a.destroyed || b.status === 0) return;
                        a.set("content.text", c + ": " + d)
                    }
                    if (l) {
                        l = f;
                        return
                    }
                    var i = g.url.lastIndexOf(" "),
                        n = g.url,
                        o, p = !g.loading && k;
                    if (p) try {
                        c.preventDefault()
                    } catch (q) {} else if (c && c.isDefaultPrevented()) return b;
                    m && m.abort && m.abort(), i > -1 && (o = n.substr(i), n = n.substr(0, i)), m = d.ajax(d.extend({
                        error: h.error || t,
                        context: a
                    }, g, {
                        url: n,
                        success: s,
                        complete: r
                    }))
                },
                destroy: function () {
                    m && m.abort && m.abort(), a.destroyed = e
                }
            }), b.init()
        }
        function M(a, b, c) {
            var d = Math.ceil(b / 2),
                e = Math.ceil(c / 2),
                f = {
                    bottomright: [
                        [0, 0],
                        [b, c],
                        [b, 0]
                    ],
                    bottomleft: [
                        [0, 0],
                        [b, 0],
                        [0, c]
                    ],
                    topright: [
                        [0, c],
                        [b, 0],
                        [b, c]
                    ],
                    topleft: [
                        [0, 0],
                        [0, c],
                        [b, c]
                    ],
                    topcenter: [
                        [0, c],
                        [d, 0],
                        [b, c]
                    ],
                    bottomcenter: [
                        [0, 0],
                        [b, 0],
                        [d, c]
                    ],
                    rightcenter: [
                        [0, 0],
                        [b, e],
                        [0, c]
                    ],
                    leftcenter: [
                        [b, 0],
                        [b, c],
                        [0, e]
                    ]
                };
            return f.lefttop = f.bottomright, f.righttop = f.bottomleft, f.leftbottom = f.topright, f.rightbottom = f.topleft, f[a.string()]
        }
        function N(a, b) {
            function D(a) {
                var b = v.is(":visible");
                v.show(), a(), v.toggle(b)
            }
            function E() {
                x.width = r.height, x.height = r.width
            }
            function F() {
                x.width = r.width, x.height = r.height
            }
            function G(b, d, g, j) {
                if (!t.tip) return;
                var k = q.corner.clone(),
                    u = g.adjusted,
                    v = a.options.position.adjust.method.split(" "),
                    x = v[0],
                    y = v[1] || v[0],
                    z = {
                        left: f,
                        top: f,
                        x: 0,
                        y: 0
                    }, A, B = {}, C;
                q.corner.fixed !== e && (x === s && k.precedance === h && u.left && k.y !== p ? k.precedance = k.precedance === h ? i : h : x !== s && u.left && (k.x = k.x === p ? u.left > 0 ? m : o : k.x === m ? o : m), y === s && k.precedance === i && u.top && k.x !== p ? k.precedance = k.precedance === i ? h : i : y !== s && u.top && (k.y = k.y === p ? u.top > 0 ? l : n : k.y === l ? n : l), k.string() !== w.corner.string() && (w.top !== u.top || w.left !== u.left) && q.update(k, f)), A = q.position(k, u), A[k.x] += I(k, k.x), A[k.y] += I(k, k.y), A.right !== c && (A.left = -A.right), A.bottom !== c && (A.top = -A.bottom), A.user = Math.max(0, r.offset);
                if (z.left = x === s && !! u.left) k.x === p ? B["margin-left"] = z.x = A["margin-left"] - u.left : (C = A.right !== c ? [u.left, -A.left] : [-u.left, A.left], (z.x = Math.max(C[0], C[1])) > C[0] && (g.left -= u.left, z.left = f), B[A.right !== c ? o : m] = z.x);
                if (z.top = y === s && !! u.top) k.y === p ? B["margin-top"] = z.y = A["margin-top"] - u.top : (C = A.bottom !== c ? [u.top, -A.top] : [-u.top, A.top], (z.y = Math.max(C[0], C[1])) > C[0] && (g.top -= u.top, z.top = f), B[A.bottom !== c ? n : l] = z.y);
                t.tip.css(B).toggle(!(z.x && z.y || k.x === p && z.y || k.y === p && z.x)), g.left -= A.left.charAt ? A.user : x !== s || z.top || !z.left && !z.top ? A.left : 0, g.top -= A.top.charAt ? A.user : y !== s || z.left || !z.left && !z.top ? A.top : 0, w.left = u.left, w.top = u.top, w.corner = k.clone()
            }
            function H() {
                var b = r.corner,
                    c = a.options.position,
                    d = c.at,
                    g = c.my.string ? c.my.string() : c.my;
                return b === f || g === f && d === f ? f : (b === e ? q.corner = new u.Corner(g) : b.string || (q.corner = new u.Corner(b), q.corner.fixed = e), w.corner = new u.Corner(q.corner.string()), q.corner.string() !== "centercenter")
            }
            function I(a, b, c) {
                b = b ? b : a[a.precedance];
                var d = t.titlebar && a.y === l,
                    e = d ? t.titlebar : v,
                    f = "border-" + b + "-width",
                    g = function (a) {
                        return parseInt(a.css(f), 10)
                    }, h;
                return D(function () {
                    h = (c ? g(c) : g(t.content) || g(e) || g(v)) || 0
                }), h
            }
            function J(a) {
                var b = t.titlebar && a.y === l,
                    c = b ? t.titlebar : t.content,
                    e = d.browser.mozilla,
                    f = e ? "-moz-" : d.browser.webkit ? "-webkit-" : "",
                    g = "border-radius-" + a.y + a.x,
                    h = "border-" + a.y + "-" + a.x + "-radius",
                    i = function (a) {
                        return parseInt(c.css(a), 10) || parseInt(v.css(a), 10)
                    }, j;
                return D(function () {
                    j = i(h) || i(f + h) || i(f + g) || i(g) || 0
                }), j
            }
            function K(a) {
                function z(a, b, c) {
                    var d = a.css(b) || n;
                    return c && d === a.css(c) ? f : j.test(d) ? f : d
                }
                var b, c, g, h = t.tip.css("cssText", ""),
                    i = a || q.corner,
                    j = /rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i,
                    k = "border-" + i[i.precedance] + "-color",
                    m = "background-color",
                    n = "transparent",
                    o = " !important",
                    s = t.titlebar,
                    u = s && (i.y === l || i.y === p && h.position().top + x.height / 2 + r.offset < s.outerHeight(e)),
                    w = u ? s : t.content;
                D(function () {
                    y.fill = z(h, m) || z(w, m) || z(t.content, m) || z(v, m) || h.css(m), y.border = z(h, k, "color") || z(w, k, "color") || z(t.content, k, "color") || z(v, k, "color") || v.css(k), d("*", h).add(h).css("cssText", m + ":" + n + o + ";border:0" + o + ";")
                })
            }
            function L(a) {
                var b = a.precedance === i,
                    c = x[b ? j : k],
                    d = x[b ? k : j],
                    e = a.string().indexOf(p) > -1,
                    f = c * (e ? .5 : 1),
                    g = Math.pow,
                    h = Math.round,
                    l, m, n, o = Math.sqrt(g(f, 2) + g(d, 2)),
                    q = [z / f * o, z / d * o];
                return q[2] = Math.sqrt(g(q[0], 2) - g(z, 2)), q[3] = Math.sqrt(g(q[1], 2) - g(z, 2)), l = o + q[2] + q[3] + (e ? 0 : q[0]), m = l / o, n = [h(m * d), h(m * c)], {
                    height: n[b ? 0 : 1],
                    width: n[b ? 1 : 0]
                }
            }
            function N(a, b, c) {
                return "<qvml:" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="qtip-vml" ' + (b || "") + ' style="behavior: url(#default#VML); ' + (c || "") + '" />'
            }
            var q = this,
                r = a.options.style.tip,
                t = a.elements,
                v = t.tooltip,
                w = {
                    top: 0,
                    left: 0
                }, x = {
                    width: r.width,
                    height: r.height
                }, y = {}, z = r.border || 0,
                A = ".qtip-tip",
                B = !! (d("<canvas />")[0] || {}).getContext,
                C;
            q.corner = g, q.mimic = g, q.border = z, q.offset = r.offset, q.size = x, a.checks.tip = {
                "^position.my|style.tip.(corner|mimic|border)$": function () {
                    q.init() || q.destroy(), a.reposition()
                },
                "^style.tip.(height|width)$": function () {
                    x = {
                        width: r.width,
                        height: r.height
                    }, q.create(), q.update(), a.reposition()
                },
                "^content.title.text|style.(classes|widget)$": function () {
                    t.tip && t.tip.length && q.update()
                }
            }, d.extend(q, {
                init: function () {
                    var a = H() && (B || d.browser.msie);
                    return a && (q.create(), q.update(), v.unbind(A).bind("tooltipmove" + A, G), B || v.bind("tooltipredraw tooltipredrawn", function (a) {
                        a.type === "tooltipredraw" ? (C = t.tip.html(), t.tip.html("")) : t.tip.html(C)
                    })), a
                },
                create: function () {
                    var a = x.width,
                        b = x.height,
                        c;
                    t.tip && t.tip.remove(), t.tip = d("<div />", {
                        "class": "ui-tooltip-tip"
                    }).css({
                        width: a,
                        height: b
                    }).prependTo(v), B ? d("<canvas />").appendTo(t.tip)[0].getContext("2d").save() : (c = N("shape", 'coordorigin="0,0"', "position:absolute;"), t.tip.html(c + c), d("*", t.tip).bind("click mousedown", function (a) {
                        a.stopPropagation()
                    }))
                },
                update: function (a, b) {
                    var c = t.tip,
                        j = c.children(),
                        k = x.width,
                        s = x.height,
                        A = r.mimic,
                        C = Math.round,
                        D, G, H, J, O;
                    a || (a = w.corner || q.corner), A === f ? A = a : (A = new u.Corner(A), A.precedance = a.precedance, A.x === "inherit" ? A.x = a.x : A.y === "inherit" ? A.y = a.y : A.x === A.y && (A[a.precedance] = a[a.precedance])), D = A.precedance, a.precedance === h ? E() : F(), t.tip.css({
                        width: k = x.width,
                        height: s = x.height
                    }), K(a), y.border !== "transparent" ? (z = I(a, g), r.border === 0 && z > 0 && (y.fill = y.border), q.border = z = r.border !== e ? r.border : z) : q.border = z = 0, H = M(A, k, s), q.size = O = L(a), c.css(O), a.precedance === i ? J = [C(A.x === m ? z : A.x === o ? O.width - k - z : (O.width - k) / 2), C(A.y === l ? O.height - s : 0)] : J = [C(A.x === m ? O.width - k : 0), C(A.y === l ? z : A.y === n ? O.height - s - z : (O.height - s) / 2)], B ? (j.attr(O), G = j[0].getContext("2d"), G.restore(), G.save(), G.clearRect(0, 0, 3e3, 3e3), G.fillStyle = y.fill, G.strokeStyle = y.border, G.lineWidth = z * 2, G.lineJoin = "miter", G.miterLimit = 100, G.translate(J[0], J[1]), G.beginPath(), G.moveTo(H[0][0], H[0][1]), G.lineTo(H[1][0], H[1][1]), G.lineTo(H[2][0], H[2][1]), G.closePath(), z && (v.css("background-clip") === "border-box" && (G.strokeStyle = y.fill, G.stroke()), G.strokeStyle = y.border, G.stroke()), G.fill()) : (H = "m" + H[0][0] + "," + H[0][1] + " l" + H[1][0] + "," + H[1][1] + " " + H[2][0] + "," + H[2][1] + " xe", J[2] = z && /^(r|b)/i.test(a.string()) ? parseFloat(d.browser.version, 10) === 8 ? 2 : 1 : 0, j.css({
                        coordsize: k + z + " " + (s + z),
                        antialias: "" + (A.string().indexOf(p) > -1),
                        left: J[0],
                        top: J[1],
                        width: k + z,
                        height: s + z
                    }).each(function (a) {
                        var b = d(this);
                        b[b.prop ? "prop" : "attr"]({
                            coordsize: k + z + " " + (s + z),
                            path: H,
                            fillcolor: y.fill,
                            filled: !! a,
                            stroked: !a
                        }).toggle( !! z || !! a), !a && b.html() === "" && b.html(N("stroke", 'weight="' + z * 2 + 'px" color="' + y.border + '" miterlimit="1000" joinstyle="miter"'))
                    })), b !== f && q.position(a)
                },
                position: function (a) {
                    var b = t.tip,
                        c = {}, e = Math.max(0, r.offset),
                        g, n, o;
                    return r.corner === f || !b ? f : (a = a || q.corner, g = a.precedance, n = L(a), o = [a.x, a.y], g === h && o.reverse(), d.each(o, function (b, d) {
                        var f, h, o;
                        d === p ? (f = g === i ? m : l, c[f] = "50%", c["margin-" + f] = -Math.round(n[g === i ? j : k] / 2) + e) : (f = I(a, d), h = I(a, d, t.content), o = J(a), c[d] = b ? h : e + (o > f ? o : -f))
                    }), c[a[g]] -= n[g === h ? j : k], b.css({
                        top: "",
                        bottom: "",
                        left: "",
                        right: "",
                        margin: ""
                    }).css(c), c)
                },
                destroy: function () {
                    t.tip && t.tip.remove(), t.tip = !1, v.unbind(A)
                }
            }), q.init()
        }
        function O(c) {
            function s() {
                q = d(p, j).not("[disabled]").map(function () {
                    return typeof this.focus == "function" ? this : null
                })
            }
            function t(a) {
                q.length < 1 && a.length ? a.not("body").blur() : q.first().focus()
            }
            function v(a) {
                var b = d(a.target),
                    c = b.closest(".qtip"),
                    e;
                e = c.length < 1 ? f : parseInt(c[0].style.zIndex, 10) > parseInt(j[0].style.zIndex, 10), !e && d(a.target).closest(A)[0] !== j[0] && t(b)
            }
            var g = this,
                h = c.options.show.modal,
                i = c.elements,
                j = i.tooltip,
                k = "#qtip-overlay",
                l = ".qtipmodal",
                m = l + c.id,
                n = "is-modal-qtip",
                o = d(b.body),
                p = u.modal.focusable.join(","),
                q = {}, r;
            c.checks.modal = {
                "^show.modal.(on|blur)$": function () {
                    g.init(), i.overlay.toggle(j.is(":visible"))
                },
                "^content.text$": function () {
                    s()
                }
            }, d.extend(g, {
                init: function () {
                    return h.on ? (r = g.create(), j.attr(n, e).css("z-index", u.modal.zindex + d(A + "[" + n + "]").length).unbind(l).unbind(m).bind("tooltipshow" + l + " tooltiphide" + l, function (a, b, c) {
                        var e = a.originalEvent;
                        if (a.target === j[0]) if (e && a.type === "tooltiphide" && /mouse(leave|enter)/.test(e.type) && d(e.relatedTarget).closest(r[0]).length) try {
                            a.preventDefault()
                        } catch (f) {} else(!e || e && !e.solo) && g[a.type.replace("tooltip", "")](a, c)
                    }).bind("tooltipfocus" + l, function (a) {
                        if (a.isDefaultPrevented() || a.target !== j[0]) return;
                        var b = d(A).filter("[" + n + "]"),
                            c = u.modal.zindex + b.length,
                            e = parseInt(j[0].style.zIndex, 10);
                        r[0].style.zIndex = c - 2, b.each(function () {
                            this.style.zIndex > e && (this.style.zIndex -= 1)
                        }), b.end().filter("." + C).qtip("blur", a.originalEvent), j.addClass(C)[0].style.zIndex = c;
                        try {
                            a.preventDefault()
                        } catch (f) {}
                    }).bind("tooltiphide" + l, function (a) {
                        a.target === j[0] && d("[" + n + "]").filter(":visible").not(j).last().qtip("focus", a)
                    }), h.escape && d(b).unbind(m).bind("keydown" + m, function (a) {
                        a.keyCode === 27 && j.hasClass(C) && c.hide(a)
                    }), h.blur && i.overlay.unbind(m).bind("click" + m, function (a) {
                        j.hasClass(C) && c.hide(a)
                    }), s(), g) : g
                },
                create: function () {
                    function c() {
                        r.css({
                            height: d(a).height(),
                            width: d(a).width()
                        })
                    }
                    var b = d(k);
                    return b.length ? i.overlay = b.insertAfter(d(A).last()) : (r = i.overlay = d("<div />", {
                        id: k.substr(1),
                        html: "<div></div>",
                        mousedown: function () {
                            return f
                        }
                    }).hide().insertAfter(d(A).last()), d(a).unbind(l).bind("resize" + l, c), c(), r)
                },
                toggle: function (a, b, c) {
                    if (a && a.isDefaultPrevented()) return g;
                    var i = h.effect,
                        k = b ? "show" : "hide",
                        l = r.is(":visible"),
                        p = d("[" + n + "]").filter(":visible").not(j),
                        q;
                    return r || (r = g.create()), r.is(":animated") && l === b || !b && p.length ? g : (b ? (r.css({
                        left: 0,
                        top: 0
                    }), r.toggleClass("blurs", h.blur), h.stealfocus !== f && (o.bind("focusin" + m, v), t(d("body :focus")))) : o.unbind("focusin" + m), r.stop(e, f), d.isFunction(i) ? i.call(r, b) : i === f ? r[k]() : r.fadeTo(parseInt(c, 10) || 90, b ? 1 : 0, function () {
                        b || d(this).hide()
                    }), b || r.queue(function (a) {
                        r.css({
                            left: "",
                            top: ""
                        }), a()
                    }), g)
                },
                show: function (a, b) {
                    return g.toggle(a, e, b)
                },
                hide: function (a, b) {
                    return g.toggle(a, f, b)
                },
                destroy: function () {
                    var a = r;
                    return a && (a = d("[" + n + "]").not(j).length < 1, a ? (i.overlay.remove(), d(b).unbind(l)) : i.overlay.unbind(l + c.id), o.undelegate("*", "focusin" + m)), j.removeAttr(n).unbind(l)
                }
            }), g.init()
        }
        function P(a) {
            var b = this,
                c = a.elements,
                e = c.tooltip,
                f = ".bgiframe-" + a.id;
            d.extend(b, {
                init: function () {
                    c.bgiframe = d('<iframe class="ui-tooltip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';"  style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0); -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";"></iframe>'), c.bgiframe.appendTo(e), e.bind("tooltipmove" + f, b.adjust)
                },
                adjust: function () {
                    var b = a.get("dimensions"),
                        d = a.plugins.tip,
                        f = c.tip,
                        g, h;
                    h = parseInt(e.css("border-left-width"), 10) || 0, h = {
                        left: -h,
                        top: -h
                    }, d && f && (g = d.corner.precedance === "x" ? ["width", "left"] : ["height", "top"], h[g[1]] -= f[g[0]]()), c.bgiframe.css(h).css(b)
                },
                destroy: function () {
                    c.bgiframe.remove(), e.unbind(f)
                }
            }), b.init()
        }
        var e = !0,
            f = !1,
            g = null,
            h = "x",
            i = "y",
            j = "width",
            k = "height",
            l = "top",
            m = "left",
            n = "bottom",
            o = "right",
            p = "center",
            q = "flip",
            r = "flipinvert",
            s = "shift",
            t, u, v, w = {}, x = "ui-tooltip",
            y = "ui-widget",
            z = "ui-state-disabled",
            A = "div.qtip." + x,
            B = x + "-default",
            C = x + "-focus",
            D = x + "-hover",
            E = "_replacedByqTip",
            F = "oldtitle",
            G, H;
        H = d("<div/>", {
            id: "qtip-rcontainer"
        }), d(function () {
            H.appendTo(b.body)
        }), t = d.fn.qtip = function (a, b, h) {
            var i = ("" + a).toLowerCase(),
                j = g,
                k = d.makeArray(arguments).slice(1),
                l = k[k.length - 1],
                m = this[0] ? d.data(this[0], "qtip") : g;
            if (!arguments.length && m || i === "api") return m;
            if ("string" == typeof a) return this.each(function () {
                var a = d.data(this, "qtip");
                if (!a) return e;
                l && l.timeStamp && (a.cache.event = l);
                if (i !== "option" && i !== "options" || !b) a[i] && a[i].apply(a[i], k);
                else if (d.isPlainObject(b) || h !== c) a.set(b, h);
                else return j = a.get(b), f
            }), j !== g ? j : this;
            if ("object" == typeof a || !arguments.length) return m = I(d.extend(e, {}, a)), t.bind.call(this, m, l)
        }, t.bind = function (a, b) {
            return this.each(function (g) {
                function n(a) {
                    function b() {
                        l.render(typeof a == "object" || h.show.ready), i.show.add(i.hide).unbind(k)
                    }
                    if (l.cache.disabled) return f;
                    l.cache.event = d.extend({}, a), l.cache.target = a ? d(a.target) : [c], h.show.delay > 0 ? (clearTimeout(l.timers.show), l.timers.show = setTimeout(b, h.show.delay), j.show !== j.hide && i.hide.bind(j.hide, function () {
                        clearTimeout(l.timers.show)
                    })) : b()
                }
                var h, i, j, k, l, m;
                m = d.isArray(a.id) ? a.id[g] : a.id, m = !m || m === f || m.length < 1 || w[m] ? t.nextid++ : w[m] = m, k = ".qtip-" + m + "-create", l = K.call(this, m, a);
                if (l === f) return e;
                h = l.options, d.each(u, function () {
                    this.initialize === "initialize" && this(l)
                }), i = {
                    show: h.show.target,
                    hide: h.hide.target
                }, j = {
                    show: d.trim("" + h.show.event).replace(/ /g, k + " ") + k,
                    hide: d.trim("" + h.hide.event).replace(/ /g, k + " ") + k
                }, /mouse(over|enter)/i.test(j.show) && !/mouse(out|leave)/i.test(j.hide) && (j.hide += " mouseleave" + k), i.show.bind("mousemove" + k, function (a) {
                    v = {
                        pageX: a.pageX,
                        pageY: a.pageY,
                        type: "mousemove"
                    }, l.cache.onTarget = e
                }), i.show.bind(j.show, n), (h.show.ready || h.prerender) && n(b)
            })
        }, u = t.plugins = {
            Corner: function (a) {
                a = ("" + a).replace(/([A-Z])/, " $1").replace(/middle/gi, p).toLowerCase(), this.x = (a.match(/left|right/i) || a.match(/center/) || ["inherit"])[0].toLowerCase(), this.y = (a.match(/top|bottom|center/i) || ["inherit"])[0].toLowerCase();
                var b = a.charAt(0);
                this.precedance = b === "t" || b === "b" ? i : h, this.string = function () {
                    return this.precedance === i ? this.y + this.x : this.x + this.y
                }, this.abbrev = function () {
                    var a = this.x.substr(0, 1),
                        b = this.y.substr(0, 1);
                    return a === b ? a : this.precedance === i ? b + a : a + b
                }, this.invertx = function (a) {
                    this.x = this.x === m ? o : this.x === o ? m : a || this.x
                }, this.inverty = function (a) {
                    this.y = this.y === l ? n : this.y === n ? l : a || this.y
                }, this.clone = function () {
                    return {
                        x: this.x,
                        y: this.y,
                        precedance: this.precedance,
                        string: this.string,
                        abbrev: this.abbrev,
                        clone: this.clone,
                        invertx: this.invertx,
                        inverty: this.inverty
                    }
                }
            },
            offset: function (a, b) {
                function j(a, b) {
                    c.left += b * a.scrollLeft(), c.top += b * a.scrollTop()
                }
                var c = a.offset(),
                    e = a.closest("body")[0],
                    f = b,
                    g, h, i;
                if (f) {
                    do f.css("position") !== "static" && (h = f.position(), c.left -= h.left + (parseInt(f.css("borderLeftWidth"), 10) || 0) + (parseInt(f.css("marginLeft"), 10) || 0), c.top -= h.top + (parseInt(f.css("borderTopWidth"), 10) || 0) + (parseInt(f.css("marginTop"), 10) || 0), !g && (i = f.css("overflow")) !== "hidden" && i !== "visible" && (g = f));
                    while ((f = d(f[0].offsetParent)).length);
                    g && g[0] !== e && j(g, 1)
                }
                return c
            },
            iOS: parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || f,
            fn: {
                attr: function (a, b) {
                    if (this.length) {
                        var c = this[0],
                            e = "title",
                            f = d.data(c, "qtip");
                        if (a === e && f && "object" == typeof f && f.options.suppress) return arguments.length < 2 ? d.attr(c, F) : (f && f.options.content.attr === e && f.cache.attr && f.set("content.text", b), this.attr(F, b))
                    }
                    return d.fn["attr" + E].apply(this, arguments)
                },
                clone: function (a) {
                    var b = d([]),
                        c = "title",
                        e = d.fn["clone" + E].apply(this, arguments);
                    return a || e.filter("[" + F + "]").attr("title", function () {
                        return d.attr(this, F)
                    }).removeAttr(F), e
                }
            }
        }, d.each(u.fn, function (a, b) {
            if (!b || d.fn[a + E]) return e;
            var c = d.fn[a + E] = d.fn[a];
            d.fn[a] = function () {
                return b.apply(this, arguments) || c.apply(this, arguments)
            }
        }), d.ui || (d["cleanData" + E] = d.cleanData, d.cleanData = function (a) {
            for (var b = 0, e;
            (e = a[b]) !== c; b++) try {
                d(e).triggerHandler("removeqtip")
            } catch (f) {}
            d["cleanData" + E](a)
        }), t.version = "@VERSION", t.nextid = 0, t.inactiveEvents = "click dblclick mousedown mouseup mousemove mouseleave mouseenter".split(" "), t.zindex = 15e3, t.defaults = {
            prerender: f,
            id: f,
            overwrite: e,
            suppress: e,
            content: {
                text: e,
                attr: "title",
                title: {
                    text: f,
                    button: f
                }
            },
            position: {
                my: "top left",
                at: "bottom right",
                target: f,
                container: f,
                viewport: f,
                adjust: {
                    x: 0,
                    y: 0,
                    mouse: e,
                    resize: e,
                    method: "flip flip"
                },
                effect: function (a, b, c) {
                    d(this).animate(b, {
                        duration: 200,
                        queue: f
                    })
                }
            },
            show: {
                target: f,
                event: "mouseenter",
                effect: e,
                delay: 90,
                solo: f,
                ready: f,
                autofocus: f
            },
            hide: {
                target: f,
                event: "mouseleave",
                effect: e,
                delay: 0,
                fixed: f,
                inactive: f,
                leave: "window",
                distance: f
            },
            style: {
                classes: "",
                widget: f,
                width: f,
                height: f,
                def: e
            },
            events: {
                render: g,
                move: g,
                show: g,
                hide: g,
                toggle: g,
                visible: g,
                hidden: g,
                focus: g,
                blur: g
            }
        }, u.svg = function (a, c, e, f) {
            var g = d(b),
                h = c[0],
                i = {
                    width: 0,
                    height: 0,
                    position: {
                        top: 1e10,
                        left: 1e10
                    }
                }, j, k, l, m, n;
            while (!h.getBBox) h = h.parentNode;
            if (h.getBBox && h.parentNode) {
                j = h.getBBox(), k = h.getScreenCTM(), l = h.farthestViewportElement || h;
                if (!l.createSVGPoint) return i;
                m = l.createSVGPoint(), m.x = j.x, m.y = j.y, n = m.matrixTransform(k), i.position.left = n.x, i.position.top = n.y, m.x += j.width, m.y += j.height, n = m.matrixTransform(k), i.width = n.x - i.position.left, i.height = n.y - i.position.top, i.position.left += g.scrollLeft(), i.position.top += g.scrollTop()
            }
            return i
        }, u.ajax = function (a) {
            var b = a.plugins.ajax;
            return "object" == typeof b ? b : a.plugins.ajax = new L(a)
        }, u.ajax.initialize = "render", u.ajax.sanitize = function (a) {
            var b = a.content,
                c;
            b && "ajax" in b && (c = b.ajax, typeof c != "object" && (c = a.content.ajax = {
                url: c
            }), "boolean" != typeof c.once && c.once && (c.once = !! c.once))
        }, d.extend(e, t.defaults, {
            content: {
                ajax: {
                    loading: e,
                    once: e
                }
            }
        }), u.tip = function (a) {
            var b = a.plugins.tip;
            return "object" == typeof b ? b : a.plugins.tip = new N(a)
        }, u.tip.initialize = "render", u.tip.sanitize = function (a) {
            var b = a.style,
                c;
            b && "tip" in b && (c = a.style.tip, typeof c != "object" && (a.style.tip = {
                corner: c
            }), /string|boolean/i.test(typeof c.corner) || (c.corner = e), typeof c.width != "number" && delete c.width, typeof c.height != "number" && delete c.height, typeof c.border != "number" && c.border !== e && delete c.border, typeof c.offset != "number" && delete c.offset)
        }, d.extend(e, t.defaults, {
            style: {
                tip: {
                    corner: e,
                    mimic: f,
                    width: 6,
                    height: 6,
                    border: e,
                    offset: 0
                }
            }
        }), u.modal = function (a) {
            var b = a.plugins.modal;
            return "object" == typeof b ? b : a.plugins.modal = new O(a)
        }, u.modal.initialize = "render", u.modal.sanitize = function (a) {
            a.show && (typeof a.show.modal != "object" ? a.show.modal = {
                on: !! a.show.modal
            } : typeof a.show.modal.on == "undefined" && (a.show.modal.on = e))
        }, u.modal.zindex = t.zindex - 200, u.modal.focusable = ["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"], d.extend(e, t.defaults, {
            show: {
                modal: {
                    on: f,
                    effect: e,
                    blur: e,
                    stealfocus: e,
                    escape: e
                }
            }
        }), u.viewport = function (c, d, e, f, g, q, t) {
            function L(a, b, c, e, f, g, h, i, j) {
                var k = d[f],
                    l = w[a],
                    m = y[a],
                    n = c === s,
                    o = -E.offset[f] + D.offset[f] + D["scroll" + f],
                    q = l === f ? j : l === g ? -j : -j / 2,
                    t = m === f ? i : m === g ? -i : -i / 2,
                    u = G && G.size ? G.size[h] || 0 : 0,
                    v = G && G.corner && G.corner.precedance === a && !n ? u : 0,
                    x = o - k + v,
                    z = k + j - D[h] - o + v,
                    A = q - (w.precedance === a || l === w[b] ? t : 0) - (m === p ? i / 2 : 0);
                return n ? (v = G && G.corner && G.corner.precedance === b ? u : 0, A = (l === f ? 1 : -1) * q - v, d[f] += x > 0 ? x : z > 0 ? -z : 0, d[f] = Math.max(-E.offset[f] + D.offset[f] + (v && G.corner[a] === p ? G.offset : 0), k - A, Math.min(Math.max(-E.offset[f] + D.offset[f] + D[h], k + A), d[f]))) : (e *= c === r ? 2 : 0, x > 0 && (l !== f || z > 0) ? (d[f] -= A + e, J["invert" + a](f)) : z > 0 && (l !== g || x > 0) && (d[f] -= (l === p ? -A : A) + e, J["invert" + a](g)), d[f] < o && -d[f] > z && (d[f] = k, J = w.clone())), d[f] - k
            }
            var u = e.target,
                v = c.elements.tooltip,
                w = e.my,
                y = e.at,
                z = e.adjust,
                A = z.method.split(" "),
                B = A[0],
                C = A[1] || A[0],
                D = e.viewport,
                E = e.container,
                F = c.cache,
                G = c.plugins.tip,
                H = {
                    left: 0,
                    top: 0
                }, I, J, K;
            if (!D.jquery || u[0] === a || u[0] === b.body || z.method === "none") return H;
            I = v.css("position") === "fixed", D = {
                elem: D,
                height: D[(D[0] === a ? "h" : "outerH") + "eight"](),
                width: D[(D[0] === a ? "w" : "outerW") + "idth"](),
                scrollleft: I ? 0 : D.scrollLeft(),
                scrolltop: I ? 0 : D.scrollTop(),
                offset: D.offset() || {
                    left: 0,
                    top: 0
                }
            }, E = {
                elem: E,
                scrollLeft: E.scrollLeft(),
                scrollTop: E.scrollTop(),
                offset: E.offset() || {
                    left: 0,
                    top: 0
                }
            };
            if (B !== "shift" || C !== "shift") J = w.clone();
            return H = {
                left: B !== "none" ? L(h, i, B, z.x, m, o, j, f, q) : 0,
                top: C !== "none" ? L(i, h, C, z.y, l, n, k, g, t) : 0
            }, J && F.lastClass !== (K = x + "-pos-" + J.abbrev()) && v.removeClass(c.cache.lastClass).addClass(c.cache.lastClass = K), H
        }, u.imagemap = function (a, b, c, e) {
            function v(a, b, c) {
                var d = 0,
                    e = 1,
                    f = 1,
                    g = 0,
                    h = 0,
                    i = a.width,
                    j = a.height;
                while (i > 0 && j > 0 && e > 0 && f > 0) {
                    i = Math.floor(i / 2), j = Math.floor(j / 2), c.x === m ? e = i : c.x === o ? e = a.width - i : e += Math.floor(i / 2), c.y === l ? f = j : c.y === n ? f = a.height - j : f += Math.floor(j / 2), d = b.length;
                    while (d--) {
                        if (b.length < 2) break;
                        g = b[d][0] - a.position.left, h = b[d][1] - a.position.top, (c.x === m && g >= e || c.x === o && g <= e || c.x === p && (g < e || g > a.width - e) || c.y === l && h >= f || c.y === n && h <= f || c.y === p && (h < f || h > a.height - f)) && b.splice(d, 1)
                    }
                }
                return {
                    left: b[0][0],
                    top: b[0][1]
                }
            }
            b.jquery || (b = d(b));
            var f = a.cache.areas = {}, g = (b[0].shape || b.attr("shape")).toLowerCase(),
                h = b[0].coords || b.attr("coords"),
                i = h.split(","),
                j = [],
                k = d('img[usemap="#' + b.parent("map").attr("name") + '"]'),
                q = k.offset(),
                r = {
                    width: 0,
                    height: 0,
                    position: {
                        top: 1e10,
                        right: 0,
                        bottom: 0,
                        left: 1e10
                    }
                }, s = 0,
                t = 0,
                u;
            q.left += Math.ceil((k.outerWidth() - k.width()) / 2), q.top += Math.ceil((k.outerHeight() - k.height()) / 2);
            if (g === "poly") {
                s = i.length;
                while (s--) t = [parseInt(i[--s], 10), parseInt(i[s + 1], 10)], t[0] > r.position.right && (r.position.right = t[0]), t[0] < r.position.left && (r.position.left = t[0]), t[1] > r.position.bottom && (r.position.bottom = t[1]), t[1] < r.position.top && (r.position.top = t[1]), j.push(t)
            } else {
                s = -1;
                while (s++ < i.length) j.push(parseInt(i[s], 10))
            }
            switch (g) {
                case "rect":
                    r = {
                        width: Math.abs(j[2] - j[0]),
                        height: Math.abs(j[3] - j[1]),
                        position: {
                            left: Math.min(j[0], j[2]),
                            top: Math.min(j[1], j[3])
                        }
                    };
                    break;
                case "circle":
                    r = {
                        width: j[2] + 2,
                        height: j[2] + 2,
                        position: {
                            left: j[0],
                            top: j[1]
                        }
                    };
                    break;
                case "poly":
                    r.width = Math.abs(r.position.right - r.position.left), r.height = Math.abs(r.position.bottom - r.position.top), c.abbrev() === "c" ? r.position = {
                        left: r.position.left + r.width / 2,
                        top: r.position.top + r.height / 2
                    } : (f[c + h] || (r.position = v(r, j.slice(), c), e && (e[0] === "flip" || e[1] === "flip") && (r.offset = v(r, j.slice(), {
                        x: c.x === m ? o : c.x === o ? m : p,
                        y: c.y === l ? n : c.y === n ? l : p
                    }), r.offset.left -= r.position.left, r.offset.top -= r.position.top), f[c + h] = r), r = f[c + h]), r.width = r.height = 0
            }
            return r.position.left += q.left, r.position.top += q.top, r
        }, u.bgiframe = function (a) {
            var b = d.browser,
                c = a.plugins.bgiframe;
            return d("select, object").length < 1 || !b.msie || ("" + b.version).charAt(0) !== "6" ? f : "object" == typeof c ? c : a.plugins.bgiframe = new P(a)
        }, u.bgiframe.initialize = "render"
    })
})(window, document);