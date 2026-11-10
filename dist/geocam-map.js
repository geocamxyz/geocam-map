var V = typeof window < "u";
const $ = {
  Promise: V ? window.Promise : void 0
};
var N = "4.25", T = "next";
function B(e) {
  if (e.toLowerCase() === T)
    return T;
  var t = e && e.match(/^(\d)\.(\d+)/);
  return t && {
    major: parseInt(t[1], 10),
    minor: parseInt(t[2], 10)
  };
}
function D(e) {
  return e === void 0 && (e = N), "https://js.arcgis.com/".concat(e, "/");
}
function H(e) {
  e === void 0 && (e = N);
  var t = D(e), o = B(e);
  if (o !== T && o.major === 3) {
    var n = o.minor <= 10 ? "js/" : "";
    return "".concat(t).concat(n, "esri/css/esri.css");
  } else
    return "".concat(t, "esri/themes/light/main.css");
}
function J(e) {
  var t = document.createElement("link");
  return t.rel = "stylesheet", t.href = e, t;
}
function K(e, t) {
  if (t) {
    var o = document.querySelector(t);
    o.parentNode.insertBefore(e, o);
  } else
    document.head.appendChild(e);
}
function X(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function Z(e) {
  return !e || B(e) ? H(e) : e;
}
function _(e, t) {
  var o = Z(e), n = X(o);
  return n || (n = J(o), K(n, t)), n;
}
var Q = {};
function Y(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function q(e, t, o) {
  var n;
  o && (n = ee(e, o));
  var l = function() {
    t(e), e.removeEventListener("load", l, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", l, !1);
}
function ee(e, t) {
  var o = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", o, !1);
  };
  return e.addEventListener("error", o, !1), o;
}
function O() {
  return document.querySelector("script[data-esri-loader]");
}
function W() {
  var e = window.require;
  return e && e.on;
}
function te(e) {
  e === void 0 && (e = {});
  var t = {};
  [Q, e].forEach(function(l) {
    for (var i in l)
      Object.prototype.hasOwnProperty.call(l, i) && (t[i] = l[i]);
  });
  var o = t.version, n = t.url || D(o);
  return new $.Promise(function(l, i) {
    var r = O();
    if (r) {
      var h = r.getAttribute("src");
      h !== n ? i(new Error("The ArcGIS API for JavaScript is already loaded (".concat(h, ")."))) : W() ? l(r) : q(r, l, i);
    } else if (W())
      i(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var v = t.css;
      if (v) {
        var c = v === !0;
        _(c ? o : v, t.insertCssBefore);
      }
      r = Y(n), q(r, function() {
        r.setAttribute("data-esri-loader", "loaded"), l(r);
      }, i), document.body.appendChild(r);
    }
  });
}
function G(e) {
  return new $.Promise(function(t, o) {
    var n = window.require.on("error", o);
    window.require(e, function() {
      for (var l = [], i = 0; i < arguments.length; i++)
        l[i] = arguments[i];
      n.remove(), t(l);
    });
  });
}
function ne(e, t) {
  if (t === void 0 && (t = {}), W())
    return G(e);
  var o = O(), n = o && o.getAttribute("src");
  return !t.url && n && (t.url = n), te(t).then(function() {
    return G(e);
  });
}
async function oe(e, t) {
  const o = {
    version: "4.26",
    css: !0
  };
  let n;
  const l = 28, i = [{ name: "Zoom" }], r = [
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
        expanded: (c, E, k, f) => {
          f.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (c, E, k, f) => {
          c === "measuring" ? f.view.emit("clickable", !1) : c !== "measuring" && E === "measuring" && f.view.emit("clickable", !0), console.log("viewmodel state change", c, f);
        }
      }
    }
  ], h = i ? i.map((c) => c.class ? c.class : `esri/widgets/${c.name}`) : [], v = r ? r.map((c) => c.class ? c.class : `esri/widgets/${c.name}`) : [];
  return await ne(
    [
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer",
      "esri/portal/Portal",
      "esri/layers/support/TileInfo"
    ].concat(h).concat(v),
    o
  ).then(
    ([
      c,
      E,
      k,
      f,
      P,
      j,
      z,
      ...R
    ]) => {
      window.ARCGIS_TOKEN && c.registerToken({
        server: window.ARCGIS_SERVER,
        token: window.ARCGIS_TOKEN
      });
      const C = new URLSearchParams(window.location.search), I = C.get("cell"), x = t || C.get("webmapid");
      let y, S;
      if (x) {
        const s = {
          id: x
        };
        if (x.startsWith("http")) {
          const d = x.split("/");
          s.id = d.pop();
          const m = d.join("/"), u = new j({
            url: m
          });
          s.portal = u;
        }
        y = new E({
          portalItem: s
        });
      } else
        y = new E({
          basemap: "satellite"
        });
      if (I) {
        const s = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${I}/FeatureServer/0`;
        console.log("shots url is", s), S = new P({
          url: s,
          definitionExpression: "mod(id,100) = 0"
          // start with agressive simplifaction - view should get scale change early on to override this
        }), y.add(S);
        const d = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${I}/FeatureServer/1`;
        console.log("points features url is", d);
        const m = new P({
          url: d,
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
        y.add(m);
      }
      C.get("zoom") || S && S.when((s) => {
        const d = {
          xmin: -5e-3,
          ymin: -5e-3,
          xmax: 5e-3,
          ymax: 5e-3
        }, m = Object.keys(d), u = {};
        for (let p = 0; p < m.length; p++)
          u[m[p]] = parseFloat(s.fullExtent[m[p]]) + d[m[p]];
        n.extent = u;
      }), y.load().then(() => {
        n = new k({
          container: e,
          map: y,
          ui: {
            components: ["attribution"]
          }
        }), n.when(() => {
          n.spatialReference && n.spatialReference.isWebMercator && (n.constraints.lods = z.create({
            numLODs: l + 1
          }).lods);
        });
        const s = document.getElementsByTagName(
          "geocam-viewer-arcgis-map"
        )[0];
        s && s.link && (console.log("map linking to connector", n), s.link(n));
        const d = function(u) {
          return u.layers.items.map((p) => p.layers ? d(p) : p);
        }, m = function(u) {
          return d(u).flat();
        };
        n.when(async () => {
          window.mv = n;
          let u = [], p = !1;
          const U = m(n.map);
          for (let w = 0; w < U.length; w++) {
            const a = U[w];
            if (await n.whenLayerView(a), a.editingEnabled && (p = !0), a.fields) {
              const L = a.fields.map((g) => g.name);
              u.push({ layer: a, searchFields: L });
            }
          }
          const A = [];
          h.forEach((w, a) => {
            const L = R[a], g = new L({
              view: n,
              container: document.createElement("div"),
              ...i[a].options
            });
            A.push(g);
          }), v.forEach((w, a) => {
            if (w === "esri/widgets/Editor" && !p)
              return;
            w === "esri/widgets/Search" && (r[a].options = r[a].options || {}, r[a].options.sources = r[a].options.sources || u);
            const L = R[a + h.length], g = new L({
              view: n,
              container: document.createElement("div"),
              ...r[a].options
            });
            console.log("loaded widget", {
              view: n,
              container: document.createElement("div"),
              ...r[a].options
            });
            const F = new f({
              view: n,
              group: "expands",
              // autoCollapse closes the panel whenever the viewpoint updates,
              // which assumes the only thing that moves the map is the user.
              // This map moves itself — the field-of-view marker tracks the
              // current shot — so a panel could be shut while you are working
              // in it. `group` still keeps only one open at a time, which is
              // the part that was actually wanted.
              autoCollapse: !1,
              content: g,
              expandIconClass: r[a].icon,
              expandTooltip: r[a].tooltip
            });
            r[a].watchWidgetFor && Object.keys(r[a].watchWidgetFor).forEach((b) => {
              g.watch(
                b,
                (...M) => r[a].watchWidgetFor[b].apply(g, M)
              );
            }), r[a].watchExpandFor && Object.keys(r[a].watchExpandFor).forEach((b) => {
              F.watch(
                b,
                (...M) => r[a].watchExpandFor[b].apply(F, M)
              );
            }), A.push(F);
          }), n.ui.add(A, "top-right"), console.log("All widgets added");
        });
      }).catch((s) => {
        var m, u;
        const d = s && s.message ? (s == null ? void 0 : s.message) + `
` + ((u = (m = s == null ? void 0 : s.details) == null ? void 0 : m.error) == null ? void 0 : u.message) : "An unknown erro occurred trying to load the map.";
        alert(d), console.error("Error loading map:", d);
      });
    }
  ), n;
}
class re extends HTMLElement {
  constructor() {
    super(), console.log("Map init");
  }
  connectedCallback() {
    console.log("Map connected");
    const t = this, o = t.getAttribute("webmapid");
    oe(t, o);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", re);
export {
  re as GeocamMap
};
