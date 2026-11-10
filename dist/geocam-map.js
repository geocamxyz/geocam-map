var z = typeof window < "u";
const R = {
  Promise: z ? window.Promise : void 0
};
var $ = "4.25", M = "next";
function N(e) {
  if (e.toLowerCase() === M)
    return M;
  var t = e && e.match(/^(\d)\.(\d+)/);
  return t && {
    major: parseInt(t[1], 10),
    minor: parseInt(t[2], 10)
  };
}
function B(e) {
  return e === void 0 && (e = $), "https://js.arcgis.com/".concat(e, "/");
}
function V(e) {
  e === void 0 && (e = $);
  var t = B(e), a = N(e);
  if (a !== M && a.major === 3) {
    var n = a.minor <= 10 ? "js/" : "";
    return "".concat(t).concat(n, "esri/css/esri.css");
  } else
    return "".concat(t, "esri/themes/light/main.css");
}
function H(e) {
  var t = document.createElement("link");
  return t.rel = "stylesheet", t.href = e, t;
}
function J(e, t) {
  if (t) {
    var a = document.querySelector(t);
    a.parentNode.insertBefore(e, a);
  } else
    document.head.appendChild(e);
}
function K(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function O(e) {
  return !e || N(e) ? V(e) : e;
}
function X(e, t) {
  var a = O(e), n = K(a);
  return n || (n = H(a), J(n, t)), n;
}
var Z = {};
function _(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function q(e, t, a) {
  var n;
  a && (n = Q(e, a));
  var c = function() {
    t(e), e.removeEventListener("load", c, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", c, !1);
}
function Q(e, t) {
  var a = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", a, !1);
  };
  return e.addEventListener("error", a, !1), a;
}
function D() {
  return document.querySelector("script[data-esri-loader]");
}
function T() {
  var e = window.require;
  return e && e.on;
}
function Y(e) {
  e === void 0 && (e = {});
  var t = {};
  [Z, e].forEach(function(c) {
    for (var o in c)
      Object.prototype.hasOwnProperty.call(c, o) && (t[o] = c[o]);
  });
  var a = t.version, n = t.url || B(a);
  return new R.Promise(function(c, o) {
    var u = D();
    if (u) {
      var E = u.getAttribute("src");
      E !== n ? o(new Error("The ArcGIS API for JavaScript is already loaded (".concat(E, ")."))) : T() ? c(u) : q(u, c, o);
    } else if (T())
      o(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = t.css;
      if (i) {
        var f = i === !0;
        X(f ? a : i, t.insertCssBefore);
      }
      u = _(n), q(u, function() {
        u.setAttribute("data-esri-loader", "loaded"), c(u);
      }, o), document.body.appendChild(u);
    }
  });
}
function G(e) {
  return new R.Promise(function(t, a) {
    var n = window.require.on("error", a);
    window.require(e, function() {
      for (var c = [], o = 0; o < arguments.length; o++)
        c[o] = arguments[o];
      n.remove(), t(c);
    });
  });
}
function ee(e, t) {
  if (t === void 0 && (t = {}), T())
    return G(e);
  var a = D(), n = a && a.getAttribute("src");
  return !t.url && n && (t.url = n), Y(t).then(function() {
    return G(e);
  });
}
async function te(e, t) {
  const a = {
    version: "4.26",
    css: !0
  };
  let n;
  const c = [{ name: "Zoom" }], o = [
    {
      name: "Search",
      icon: "esri-icon-search",
      options: { includeDefaultSources: !0 },
      tooltip: "Search"
    },
    { name: "BasemapGallery", icon: "esri-icon-basemap", tooltip: "Basemap Gallery" },
    { name: "LayerList", icon: "esri-icon-layer-list", tooltip: "Layer List" },
    { name: "Legend", icon: "esri-icon-feature-layer", tooltip: "Legend" },
    { name: "Editor", icon: "esri-icon-edit", tooltip: "Editor" },
    {
      name: "DistanceMeasurement2D",
      icon: "esri-icon-measure",
      tooltip: "Distance Measurement",
      watchExpandFor: {
        expanded: (i, f, S, w) => {
          w.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, f, S, w) => {
          i === "measuring" ? w.view.emit("clickable", !1) : i !== "measuring" && f === "measuring" && w.view.emit("clickable", !0), console.log("viewmodel state change", i, w);
        }
      }
    }
  ], u = c ? c.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], E = o ? o.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await ee(
    [
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer",
      "esri/portal/Portal"
    ].concat(u).concat(E),
    a
  ).then(
    ([
      i,
      f,
      S,
      w,
      P,
      j,
      ...W
    ]) => {
      window.ARCGIS_TOKEN && i.registerToken({
        server: window.ARCGIS_SERVER,
        token: window.ARCGIS_TOKEN
      });
      const k = new URLSearchParams(window.location.search), C = k.get("cell"), b = t || k.get("webmapid");
      let v, x;
      if (b) {
        const s = {
          id: b
        };
        if (b.startsWith("http")) {
          const l = b.split("/");
          s.id = l.pop();
          const m = l.join("/"), d = new j({
            url: m
          });
          s.portal = d;
        }
        v = new f({
          portalItem: s
        });
      } else
        v = new f({
          basemap: "satellite"
        });
      if (C) {
        const s = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/0`;
        console.log("shots url is", s), x = new P({
          url: s,
          definitionExpression: "mod(id,100) = 0"
          // start with agressive simplifaction - view should get scale change early on to override this
        }), v.add(x);
        const l = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/1`;
        console.log("points features url is", l);
        const m = new P({
          url: l,
          popupEnabled: !0,
          popupTemplate: {
            title: "{reference}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "embed",
                    label: "content"
                  }
                ]
              }
            ]
          }
        });
        v.add(m);
      }
      k.get("zoom") || x && x.when((s) => {
        const l = {
          xmin: -5e-3,
          ymin: -5e-3,
          xmax: 5e-3,
          ymax: 5e-3
        }, m = Object.keys(l), d = {};
        for (let p = 0; p < m.length; p++)
          d[m[p]] = parseFloat(s.fullExtent[m[p]]) + l[m[p]];
        n.extent = d;
      }), v.load().then(() => {
        n = new S({
          container: e,
          map: v,
          ui: {
            components: ["attribution"]
          }
        });
        const s = document.getElementsByTagName(
          "geocam-viewer-arcgis-map"
        )[0];
        s && s.link && (console.log("map linking to connector", n), s.link(n));
        const l = function(d) {
          return d.layers.items.map((p) => p.layers ? l(p) : p);
        }, m = function(d) {
          return l(d).flat();
        };
        n.when(async () => {
          window.mv = n;
          let d = [], p = !1;
          const U = m(n.map);
          for (let g = 0; g < U.length; g++) {
            const r = U[g];
            if (await n.whenLayerView(r), r.editingEnabled && (p = !0), r.fields) {
              const y = r.fields.map((h) => h.name);
              d.push({ layer: r, searchFields: y });
            }
          }
          const F = [];
          u.forEach((g, r) => {
            const y = W[r], h = new y({
              view: n,
              container: document.createElement("div"),
              ...c[r].options
            });
            F.push(h);
          }), E.forEach((g, r) => {
            if (g === "esri/widgets/Editor" && !p)
              return;
            g === "esri/widgets/Search" && (o[r].options = o[r].options || {}, o[r].options.sources = o[r].options.sources || d);
            const y = W[r + u.length], h = new y({
              view: n,
              container: document.createElement("div"),
              ...o[r].options
            });
            console.log("loaded widget", {
              view: n,
              container: document.createElement("div"),
              ...o[r].options
            });
            const I = new w({
              view: n,
              group: "expands",
              // autoCollapse closes the panel whenever the viewpoint updates,
              // which assumes the only thing that moves the map is the user.
              // This map moves itself — the field-of-view marker tracks the
              // current shot — so a panel could be shut while you are working
              // in it. `group` still keeps only one open at a time, which is
              // the part that was actually wanted.
              autoCollapse: !1,
              content: h,
              expandIconClass: o[r].icon,
              expandTooltip: o[r].tooltip
            });
            o[r].watchWidgetFor && Object.keys(o[r].watchWidgetFor).forEach((L) => {
              h.watch(
                L,
                (...A) => o[r].watchWidgetFor[L].apply(h, A)
              );
            }), o[r].watchExpandFor && Object.keys(o[r].watchExpandFor).forEach((L) => {
              I.watch(
                L,
                (...A) => o[r].watchExpandFor[L].apply(I, A)
              );
            }), F.push(I);
          }), n.ui.add(F, "top-right"), console.log("All widgets added");
        });
      }).catch((s) => {
        var m, d;
        const l = s && s.message ? (s == null ? void 0 : s.message) + `
` + ((d = (m = s == null ? void 0 : s.details) == null ? void 0 : m.error) == null ? void 0 : d.message) : "An unknown erro occurred trying to load the map.";
        alert(l), console.error("Error loading map:", l);
      });
    }
  ), n;
}
class ne extends HTMLElement {
  constructor() {
    super(), console.log("Map init");
  }
  connectedCallback() {
    console.log("Map connected");
    const t = this, a = t.getAttribute("webmapid");
    te(t, a);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", ne);
export {
  ne as GeocamMap
};
