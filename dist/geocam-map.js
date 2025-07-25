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
  var c = function() {
    t(e), e.removeEventListener("load", c, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", c, !1);
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
  [X, e].forEach(function(c) {
    for (var o in c)
      Object.prototype.hasOwnProperty.call(c, o) && (t[o] = c[o]);
  });
  var r = t.version, n = t.url || B(r);
  return new $.Promise(function(c, o) {
    var u = D();
    if (u) {
      var E = u.getAttribute("src");
      E !== n ? o(new Error("The ArcGIS API for JavaScript is already loaded (".concat(E, ")."))) : P() ? c(u) : q(u, c, o);
    } else if (P())
      o(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = t.css;
      if (i) {
        var p = i === !0;
        O(p ? r : i, t.insertCssBefore);
      }
      u = Z(n), q(u, function() {
        u.setAttribute("data-esri-loader", "loaded"), c(u);
      }, o), document.body.appendChild(u);
    }
  });
}
function R(e) {
  return new $.Promise(function(t, r) {
    var n = window.require.on("error", r);
    window.require(e, function() {
      for (var c = [], o = 0; o < arguments.length; o++)
        c[o] = arguments[o];
      n.remove(), t(c);
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
        expanded: (i, p, S, w) => {
          w.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, p, S, w) => {
          i === "measuring" ? w.view.emit("clickable", !1) : i !== "measuring" && p === "measuring" && w.view.emit("clickable", !0), console.log("viewmodel state change", i, w);
        }
      }
    }
  ], u = c ? c.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], E = o ? o.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await Y(
    [
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer"
    ].concat(u).concat(E),
    r
  ).then(
    ([
      i,
      p,
      S,
      w,
      T,
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
          const m = l.join("/"), d = new Portal({
            url: m
          });
          s.portal = d;
        }
        v = new p({
          portalItem: s
        });
      } else
        v = new p({
          basemap: "satellite"
        });
      if (C) {
        const s = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/0`;
        console.log("shots url is", s), x = new T({
          url: s,
          definitionExpression: "mod(id,100) = 0"
          // start with agressive simplifaction - view should get scale change early on to override this
        }), v.add(x);
        const l = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${C}/FeatureServer/1`;
        console.log("points features url is", l);
        const m = new T({
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
        for (let f = 0; f < m.length; f++)
          d[m[f]] = parseFloat(s.fullExtent[m[f]]) + l[m[f]];
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
          return d.layers.items.map((f) => f.layers ? l(f) : f);
        }, m = function(d) {
          return l(d).flat();
        };
        n.when(async () => {
          window.mv = n;
          let d = [], f = !1;
          const U = m(n.map);
          for (let g = 0; g < U.length; g++) {
            const a = U[g];
            if (await n.whenLayerView(a), a.editingEnabled && (f = !0), a.fields) {
              const y = a.fields.map((h) => h.name);
              d.push({ layer: a, searchFields: y });
            }
          }
          const F = [];
          u.forEach((g, a) => {
            const y = W[a], h = new y({
              view: n,
              container: document.createElement("div"),
              ...c[a].options
            });
            F.push(h);
          }), E.forEach((g, a) => {
            if (g === "esri/widgets/Editor" && !f)
              return;
            g === "esri/widgets/Search" && (o[a].options = o[a].options || {}, o[a].options.sources = o[a].options.sources || d);
            const y = W[a + u.length], h = new y({
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
      }).catch((s) => {
        var m, d;
        const l = s && s.message ? (s == null ? void 0 : s.message) + `
` + ((d = (m = s == null ? void 0 : s.details) == null ? void 0 : m.error) == null ? void 0 : d.message) : "An unknown erro occurred trying to load the map.";
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
