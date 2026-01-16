var z = typeof window < "u";
const $ = {
  Promise: z ? window.Promise : void 0
};
var G = "4.25", M = "next";
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
  return e === void 0 && (e = G), "https://js.arcgis.com/".concat(e, "/");
}
function V(e) {
  e === void 0 && (e = G);
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
function j(e) {
  return !e || N(e) ? V(e) : e;
}
function X(e, t) {
  var a = j(e), n = K(a);
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
function P() {
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
  return new $.Promise(function(c, o) {
    var u = D();
    if (u) {
      var E = u.getAttribute("src");
      E !== n ? o(new Error("The ArcGIS API for JavaScript is already loaded (".concat(E, ")."))) : P() ? c(u) : q(u, c, o);
    } else if (P())
      o(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var r = t.css;
      if (r) {
        var w = r === !0;
        X(w ? a : r, t.insertCssBefore);
      }
      u = _(n), q(u, function() {
        u.setAttribute("data-esri-loader", "loaded"), c(u);
      }, o), document.body.appendChild(u);
    }
  });
}
function R(e) {
  return new $.Promise(function(t, a) {
    var n = window.require.on("error", a);
    window.require(e, function() {
      for (var c = [], o = 0; o < arguments.length; o++)
        c[o] = arguments[o];
      n.remove(), t(c);
    });
  });
}
function O(e, t) {
  if (t === void 0 && (t = {}), P())
    return R(e);
  var a = D(), n = a && a.getAttribute("src");
  return !t.url && n && (t.url = n), Y(t).then(function() {
    return R(e);
  });
}
async function ee(e, t) {
  const a = {
    version: "4.26",
    css: !0
  };
  let n;
  const c = [{ name: "Zoom" }], o = [
    {
      name: "Search",
      icon: "esri-icon-search",
      options: { includeDefaultSources: !0 }
    },
    { name: "BasemapGallery", icon: "esri-icon-basemap" },
    { name: "LayerList", icon: "esri-icon-layer-list" },
    { name: "Legend", icon: "esri-icon-feature-layer" },
    { name: "Editor", icon: "esri-icon-edit" },
    {
      name: "DistanceMeasurement2D",
      icon: "esri-icon-measure",
      watchExpandFor: {
        expanded: (r, w, y, m) => {
          m.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (r, w, y, m) => {
          r === "measuring" ? m.view.emit("clickable", !1) : r !== "measuring" && w === "measuring" && m.view.emit("clickable", !0), console.log("viewmodel state change", r, m);
        }
      }
    },
    {
      name: "AreaMeasurement2D",
      icon: "esri-icon-measure-area",
      watchExpandFor: {
        expanded: (r, w, y, m) => {
          m.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (r, w, y, m) => {
          r === "measuring" ? m.view.emit("clickable", !1) : r !== "measuring" && w === "measuring" && m.view.emit("clickable", !0), console.log("viewmodel state change", r, m);
        }
      }
    }
  ], u = c ? c.map((r) => r.class ? r.class : `esri/widgets/${r.name}`) : [], E = o ? o.map((r) => r.class ? r.class : `esri/widgets/${r.name}`) : [];
  return await O(
    [
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer"
    ].concat(u).concat(E),
    a
  ).then(
    ([
      r,
      w,
      y,
      m,
      W,
      ...T
    ]) => {
      window.ARCGIS_TOKEN && r.registerToken({
        server: window.ARCGIS_SERVER,
        token: window.ARCGIS_TOKEN
      });
      const k = new URLSearchParams(window.location.search), C = k.get("cell"), b = t || k.get("webmapid");
      let v, S;
      if (b) {
        const s = {
          id: b
        };
        if (b.startsWith("http")) {
          const l = b.split("/");
          s.id = l.pop();
          const f = l.join("/"), d = new Portal({
            url: f
          });
          s.portal = d;
        }
        v = new w({
          portalItem: s
        });
      } else
        v = new w({
          basemap: "satellite"
        });
      if (C) {
        const s = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/0`;
        console.log("shots url is", s), S = new W({
          url: s,
          definitionExpression: "mod(id,100) = 0"
          // start with agressive simplifaction - view should get scale change early on to override this
        }), v.add(S);
        const l = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/1`;
        console.log("points features url is", l);
        const f = new W({
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
        v.add(f);
      }
      k.get("zoom") || S && S.when((s) => {
        const l = {
          xmin: -5e-3,
          ymin: -5e-3,
          xmax: 5e-3,
          ymax: 5e-3
        }, f = Object.keys(l), d = {};
        for (let p = 0; p < f.length; p++)
          d[f[p]] = parseFloat(s.fullExtent[f[p]]) + l[f[p]];
        n.extent = d;
      }), v.load().then(() => {
        n = new y({
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
        }, f = function(d) {
          return l(d).flat();
        };
        n.when(async () => {
          window.mv = n;
          let d = [], p = !1;
          const U = f(n.map);
          for (let g = 0; g < U.length; g++) {
            const i = U[g];
            if (await n.whenLayerView(i), i.editingEnabled && (p = !0), i.fields) {
              const L = i.fields.map((h) => h.name);
              d.push({ layer: i, searchFields: L });
            }
          }
          const F = [];
          u.forEach((g, i) => {
            const L = T[i], h = new L({
              view: n,
              container: document.createElement("div"),
              ...c[i].options
            });
            F.push(h);
          }), E.forEach((g, i) => {
            if (g === "esri/widgets/Editor" && !p)
              return;
            g === "esri/widgets/Search" && (o[i].options = o[i].options || {}, o[i].options.sources = o[i].options.sources || d);
            const L = T[i + u.length], h = new L({
              view: n,
              container: document.createElement("div"),
              ...o[i].options
            });
            console.log("loaded widget", {
              view: n,
              container: document.createElement("div"),
              ...o[i].options
            });
            const A = new m({
              view: n,
              group: "expands",
              autoCollapse: !0,
              content: h,
              expandIconClass: o[i].icon
            });
            o[i].watchWidgetFor && Object.keys(o[i].watchWidgetFor).forEach((x) => {
              h.watch(
                x,
                (...I) => o[i].watchWidgetFor[x].apply(h, I)
              );
            }), o[i].watchExpandFor && Object.keys(o[i].watchExpandFor).forEach((x) => {
              A.watch(
                x,
                (...I) => o[i].watchExpandFor[x].apply(A, I)
              );
            }), F.push(A);
          }), n.ui.add(F, "top-right"), console.log("All widgets added");
        });
      }).catch((s) => {
        var f, d;
        const l = s && s.message ? (s == null ? void 0 : s.message) + `
` + ((d = (f = s == null ? void 0 : s.details) == null ? void 0 : f.error) == null ? void 0 : d.message) : "An unknown erro occurred trying to load the map.";
        alert(l), console.error("Error loading map:", l);
      });
    }
  ), n;
}
class te extends HTMLElement {
  constructor() {
    super(), console.log("Map init");
  }
  connectedCallback() {
    console.log("Map connected");
    const t = this, a = t.getAttribute("webmapid");
    ee(t, a);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", te);
export {
  te as GeocamMap
};
