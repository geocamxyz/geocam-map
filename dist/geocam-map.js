var j = typeof window < "u";
const $ = {
  Promise: j ? window.Promise : void 0
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
function z(e) {
  e === void 0 && (e = G);
  var t = B(e), r = N(e);
  if (r !== M && r.major === 3) {
    var n = r.minor <= 10 ? "js/" : "";
    return "".concat(t).concat(n, "esri/css/esri.css");
  } else
    return "".concat(t, "esri/themes/light/main.css");
}
function V(e) {
  var t = document.createElement("link");
  return t.rel = "stylesheet", t.href = e, t;
}
function H(e, t) {
  if (t) {
    var r = document.querySelector(t);
    r.parentNode.insertBefore(e, r);
  } else
    document.head.appendChild(e);
}
function J(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function K(e) {
  return !e || N(e) ? z(e) : e;
}
function O(e, t) {
  var r = K(e), n = J(r);
  return n || (n = V(r), H(n, t)), n;
}
var X = {};
function Z(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function q(e, t, r) {
  var n;
  r && (n = _(e, r));
  var i = function() {
    t(e), e.removeEventListener("load", i, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", i, !1);
}
function _(e, t) {
  var r = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", r, !1);
  };
  return e.addEventListener("error", r, !1), r;
}
function D() {
  return document.querySelector("script[data-esri-loader]");
}
function P() {
  var e = window.require;
  return e && e.on;
}
function Q(e) {
  e === void 0 && (e = {});
  var t = {};
  [X, e].forEach(function(i) {
    for (var o in i)
      Object.prototype.hasOwnProperty.call(i, o) && (t[o] = i[o]);
  });
  var r = t.version, n = t.url || B(r);
  return new $.Promise(function(i, o) {
    var d = D();
    if (d) {
      var E = d.getAttribute("src");
      E !== n ? o(new Error("The ArcGIS API for JavaScript is already loaded (".concat(E, ")."))) : P() ? i(d) : q(d, i, o);
    } else if (P())
      o(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var s = t.css;
      if (s) {
        var p = s === !0;
        O(p ? r : s, t.insertCssBefore);
      }
      d = Z(n), q(d, function() {
        d.setAttribute("data-esri-loader", "loaded"), i(d);
      }, o), document.body.appendChild(d);
    }
  });
}
function R(e) {
  return new $.Promise(function(t, r) {
    var n = window.require.on("error", r);
    window.require(e, function() {
      for (var i = [], o = 0; o < arguments.length; o++)
        i[o] = arguments[o];
      n.remove(), t(i);
    });
  });
}
function Y(e, t) {
  if (t === void 0 && (t = {}), P())
    return R(e);
  var r = D(), n = r && r.getAttribute("src");
  return !t.url && n && (t.url = n), Q(t).then(function() {
    return R(e);
  });
}
async function ee(e, t) {
  const r = {
    version: "4.26",
    css: !0
  };
  let n;
  const i = [{ name: "Zoom" }], o = [
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
        expanded: (s, p, S, w) => {
          w.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (s, p, S, w) => {
          s === "measuring" ? w.view.emit("clickable", !1) : s !== "measuring" && p === "measuring" && w.view.emit("clickable", !0), console.log("viewmodel state change", s, w);
        }
      }
    }
  ], d = i ? i.map((s) => s.class ? s.class : `esri/widgets/${s.name}`) : [], E = o ? o.map((s) => s.class ? s.class : `esri/widgets/${s.name}`) : [];
  return await Y(
    [
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer"
    ].concat(d).concat(E),
    r
  ).then(
    ([
      s,
      p,
      S,
      w,
      T,
      ...W
    ]) => {
      window.ARCGIS_TOKEN && s.registerToken({
        server: window.ARCGIS_SERVER,
        token: window.ARCGIS_TOKEN
      });
      const k = new URLSearchParams(window.location.search), C = k.get("cell"), b = t || k.get("webmapid");
      let v, x;
      if (b) {
        const c = {
          id: b
        };
        if (b.startsWith("http")) {
          const l = b.split("/");
          c.id = l.pop();
          const f = l.join("/"), m = new Portal({
            url: f
          });
          c.portal = m;
        }
        v = new p({
          portalItem: c
        });
      } else
        v = new p({
          basemap: "satellite"
        });
      if (C) {
        const c = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/0`;
        console.log("shots url is", c), x = new T({
          url: c,
          definitionExpression: "mod(id,100) = 0"
          // start with agressive simplifaction - view should get scale change early on to override this
        }), v.add(x);
        const l = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/1`;
        console.log("points features url is", l);
        const f = new T({
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
      k.get("zoom") || x && x.when((c) => {
        const l = {
          xmin: -5e-3,
          ymin: -5e-3,
          xmax: 5e-3,
          ymax: 5e-3
        }, f = Object.keys(l), m = {};
        for (let u = 0; u < f.length; u++)
          m[f[u]] = parseFloat(c.fullExtent[f[u]]) + l[f[u]];
        n.extent = m;
      }), v.load().then(() => {
        n = new S({
          container: e,
          map: v,
          ui: {
            components: ["attribution"]
          }
        });
        const c = document.getElementsByTagName(
          "geocam-viewer-arcgis-map"
        )[0];
        c && c.link && (console.log("map linking to connector", n), c.link(n));
        const l = function(m) {
          return m.layers.items.map((u) => u.layers ? l(u) : u);
        }, f = function(m) {
          return l(m).flat();
        };
        n.when(async () => {
          window.mv = n;
          let m = [], u = !1;
          const U = f(n.map);
          for (let g = 0; g < U.length; g++) {
            const a = U[g];
            if (await n.whenLayerView(a), a.editingEnabled && (u = !0), a.fields) {
              const y = a.fields.map((h) => h.name);
              m.push({ layer: a, searchFields: y });
            }
          }
          const F = [];
          d.forEach((g, a) => {
            const y = W[a], h = new y({
              view: n,
              container: document.createElement("div"),
              ...i[a].options
            });
            F.push(h);
          }), E.forEach((g, a) => {
            if (g === "esri/widgets/Editor" && !u) return;
            g === "esri/widgets/Search" && (o[a].options = o[a].options || {}, o[a].options.sources = o[a].options.sources || m);
            const y = W[a + d.length], h = new y({
              view: n,
              container: document.createElement("div"),
              ...o[a].options
            });
            console.log("loaded widget", {
              view: n,
              container: document.createElement("div"),
              ...o[a].options
            });
            const I = new w({
              view: n,
              group: "expands",
              autoCollapse: !0,
              content: h,
              expandIconClass: o[a].icon
            });
            o[a].watchWidgetFor && Object.keys(o[a].watchWidgetFor).forEach((L) => {
              h.watch(
                L,
                (...A) => o[a].watchWidgetFor[L].apply(h, A)
              );
            }), o[a].watchExpandFor && Object.keys(o[a].watchExpandFor).forEach((L) => {
              I.watch(
                L,
                (...A) => o[a].watchExpandFor[L].apply(I, A)
              );
            }), F.push(I);
          }), n.ui.add(F, "top-right"), console.log("All widgets added");
        });
      }).catch((c) => {
        const l = c && c.message ? c?.message + `
` + c?.details?.error?.message : "An unknown erro occurred trying to load the map.";
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
    const t = this, r = t.getAttribute("webmapid");
    ee(t, r);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", te);
export {
  te as GeocamMap
};
