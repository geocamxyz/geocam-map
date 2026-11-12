var J = typeof window < "u";
const O = {
  Promise: J ? window.Promise : void 0
};
var $ = "4.25", U = "next";
function q(e) {
  if (e.toLowerCase() === U)
    return U;
  var t = e && e.match(/^(\d)\.(\d+)/);
  return t && {
    major: parseInt(t[1], 10),
    minor: parseInt(t[2], 10)
  };
}
function N(e) {
  return e === void 0 && (e = $), "https://js.arcgis.com/".concat(e, "/");
}
function X(e) {
  e === void 0 && (e = $);
  var t = N(e), o = q(e);
  if (o !== U && o.major === 3) {
    var n = o.minor <= 10 ? "js/" : "";
    return "".concat(t).concat(n, "esri/css/esri.css");
  } else
    return "".concat(t, "esri/themes/light/main.css");
}
function Z(e) {
  var t = document.createElement("link");
  return t.rel = "stylesheet", t.href = e, t;
}
function Q(e, t) {
  if (t) {
    var o = document.querySelector(t);
    o.parentNode.insertBefore(e, o);
  } else
    document.head.appendChild(e);
}
function Y(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function ee(e) {
  return !e || q(e) ? X(e) : e;
}
function te(e, t) {
  var o = ee(e), n = Y(o);
  return n || (n = Z(o), Q(n, t)), n;
}
var ne = {};
function oe(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function B(e, t, o) {
  var n;
  o && (n = re(e, o));
  var p = function() {
    t(e), e.removeEventListener("load", p, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", p, !1);
}
function re(e, t) {
  var o = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", o, !1);
  };
  return e.addEventListener("error", o, !1), o;
}
function H() {
  return document.querySelector("script[data-esri-loader]");
}
function _() {
  var e = window.require;
  return e && e.on;
}
function ae(e) {
  e === void 0 && (e = {});
  var t = {};
  [ne, e].forEach(function(p) {
    for (var l in p)
      Object.prototype.hasOwnProperty.call(p, l) && (t[l] = p[l]);
  });
  var o = t.version, n = t.url || N(o);
  return new O.Promise(function(p, l) {
    var r = H();
    if (r) {
      var y = r.getAttribute("src");
      y !== n ? l(new Error("The ArcGIS API for JavaScript is already loaded (".concat(y, ")."))) : _() ? p(r) : B(r, p, l);
    } else if (_())
      l(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var E = t.css;
      if (E) {
        var d = E === !0;
        te(d ? o : E, t.insertCssBefore);
      }
      r = oe(n), B(r, function() {
        r.setAttribute("data-esri-loader", "loaded"), p(r);
      }, l), document.body.appendChild(r);
    }
  });
}
function D(e) {
  return new O.Promise(function(t, o) {
    var n = window.require.on("error", o);
    window.require(e, function() {
      for (var p = [], l = 0; l < arguments.length; l++)
        p[l] = arguments[l];
      n.remove(), t(p);
    });
  });
}
function se(e, t) {
  if (t === void 0 && (t = {}), _())
    return D(e);
  var o = H(), n = o && o.getAttribute("src");
  return !t.url && n && (t.url = n), ae(t).then(function() {
    return D(e);
  });
}
const ie = async function(e, t) {
  if (window.ARCGIS_TOKEN) {
    e.registerToken({
      server: window.ARCGIS_SERVER,
      token: window.ARCGIS_TOKEN
    });
    return;
  }
  if (!window.ARCGIS_APP_ID) return;
  if (!window.ARCGIS_OAUTH_CALLBACK) {
    console.warn(
      "ARCGIS_APP_ID is set but ARCGIS_OAUTH_CALLBACK is not — skipping ArcGIS OAuth setup"
    );
    return;
  }
  const o = window.ARCGIS_PORTAL_URL || window.ARCGIS_SERVER || "https://www.arcgis.com";
  try {
    e.registerOAuthInfos([
      new t({
        appId: window.ARCGIS_APP_ID,
        portalUrl: o,
        popup: !0,
        popupCallbackUrl: window.ARCGIS_OAUTH_CALLBACK
      })
    ]), await e.checkSignInStatus(`${o}/sharing`);
  } catch {
  }
};
async function ce(e, t) {
  const o = {
    version: "4.26",
    css: !0
  };
  let n;
  const p = 2, l = [{ name: "Zoom" }], r = [
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
        expanded: (d, S, I, w) => {
          w.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (d, S, I, w) => {
          d === "measuring" ? w.view.emit("clickable", !1) : d !== "measuring" && S === "measuring" && w.view.emit("clickable", !0), console.log("viewmodel state change", d, w);
        }
      }
    }
  ], y = l ? l.map((d) => d.class ? d.class : `esri/widgets/${d.name}`) : [], E = r ? r.map((d) => d.class ? d.class : `esri/widgets/${d.name}`) : [];
  return await se(
    [
      "esri/identity/IdentityManager",
      "esri/identity/OAuthInfo",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer",
      "esri/portal/Portal",
      "esri/layers/support/LOD",
      "esri/core/reactiveUtils"
    ].concat(y).concat(E),
    o
  ).then(
    async ([
      d,
      S,
      I,
      w,
      K,
      T,
      z,
      V,
      j,
      ...F
    ]) => {
      await ie(d, S);
      const x = new URLSearchParams(window.location.search), k = x.get("cell"), C = t || x.get("webmapid");
      let h, b;
      if (C) {
        const i = {
          id: C
        };
        if (C.startsWith("http")) {
          const c = C.split("/");
          i.id = c.pop();
          const m = c.join("/"), f = new z({
            url: m
          });
          i.portal = f;
        }
        h = new I({
          portalItem: i
        });
      } else
        h = new I({
          basemap: "satellite"
        });
      if (k) {
        const i = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${k}/FeatureServer/0`;
        console.log("shots url is", i), b = new T({
          url: i,
          definitionExpression: "mod(id,100) = 0"
          // start with agressive simplifaction - view should get scale change early on to override this
        }), h.add(b);
        const c = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${k}/FeatureServer/1`;
        console.log("points features url is", c);
        const m = new T({
          url: c,
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
        h.add(m);
      }
      x.get("zoom") || b && b.when((i) => {
        const c = {
          xmin: -5e-3,
          ymin: -5e-3,
          xmax: 5e-3,
          ymax: 5e-3
        }, m = Object.keys(c), f = {};
        for (let s = 0; s < m.length; s++)
          f[m[s]] = parseFloat(i.fullExtent[m[s]]) + c[m[s]];
        n.extent = f;
      });
      const M = async (i) => {
        try {
          if (!i) return null;
          await i.load();
          const c = i.baseLayers.toArray();
          await Promise.all(c.map((u) => u.load().catch(() => null)));
          const m = c.find(
            (u) => u.tileInfo && u.tileInfo.lods && u.tileInfo.lods.length
          );
          if (!m) return null;
          const f = m.tileInfo.lods.map((u) => u.clone());
          let s = f[f.length - 1];
          for (; s.scale / 2 >= p; )
            s = new V({
              level: s.level + 1,
              scale: s.scale / 2,
              resolution: s.resolution / 2
            }), f.push(s);
          return f.length > m.tileInfo.lods.length ? f : null;
        } catch (c) {
          return console.warn("Could not extend basemap zoom levels", c), null;
        }
      };
      h.load().then(async () => {
        const i = await M(h.basemap);
        n = new w({
          container: e,
          map: h,
          ...i ? { constraints: { lods: i } } : {},
          ui: {
            components: ["attribution"]
          }
        }), j.watch(
          () => n.map && n.map.basemap,
          async (s) => {
            const u = await M(s);
            n.map && n.map.basemap === s && (n.constraints.lods = u);
          }
        );
        const c = document.getElementsByTagName(
          "geocam-viewer-arcgis-map"
        )[0];
        c && c.link && (console.log("map linking to connector", n), c.link(n));
        const m = function(s) {
          return s.layers.items.map((u) => u.layers ? m(u) : u);
        }, f = function(s) {
          return m(s).flat();
        };
        n.when(async () => {
          window.mv = n;
          let s = [], u = !1;
          const W = f(n.map);
          for (let g = 0; g < W.length; g++) {
            const a = W[g];
            if (await n.whenLayerView(a), a.editingEnabled && (u = !0), a.fields) {
              const L = a.fields.map((v) => v.name);
              s.push({ layer: a, searchFields: L });
            }
          }
          const R = [];
          y.forEach((g, a) => {
            const L = F[a], v = new L({
              view: n,
              container: document.createElement("div"),
              ...l[a].options
            });
            R.push(v);
          }), E.forEach((g, a) => {
            if (g === "esri/widgets/Editor" && !u) return;
            g === "esri/widgets/Search" && (r[a].options = r[a].options || {}, r[a].options.sources = r[a].options.sources || s);
            const L = F[a + y.length], v = new L({
              view: n,
              container: document.createElement("div"),
              ...r[a].options
            });
            console.log("loaded widget", {
              view: n,
              container: document.createElement("div"),
              ...r[a].options
            });
            const P = new K({
              view: n,
              group: "expands",
              // autoCollapse closes the panel whenever the viewpoint updates,
              // which assumes the only thing that moves the map is the user.
              // This map moves itself — the field-of-view marker tracks the
              // current shot — so a panel could be shut while you are working
              // in it. `group` still keeps only one open at a time, which is
              // the part that was actually wanted.
              autoCollapse: !1,
              content: v,
              expandIconClass: r[a].icon,
              expandTooltip: r[a].tooltip
            });
            r[a].watchWidgetFor && Object.keys(r[a].watchWidgetFor).forEach((A) => {
              v.watch(
                A,
                (...G) => r[a].watchWidgetFor[A].apply(v, G)
              );
            }), r[a].watchExpandFor && Object.keys(r[a].watchExpandFor).forEach((A) => {
              P.watch(
                A,
                (...G) => r[a].watchExpandFor[A].apply(P, G)
              );
            }), R.push(P);
          }), n.ui.add(R, "top-right"), console.log("All widgets added");
        });
      }).catch((i) => {
        const c = i && i.message ? i?.message + `
` + i?.details?.error?.message : "An unknown erro occurred trying to load the map.";
        alert(c), console.error("Error loading map:", c);
      });
    }
  ), n;
}
class le extends HTMLElement {
  constructor() {
    super(), console.log("Map init");
  }
  connectedCallback() {
    console.log("Map connected");
    const t = this, o = t.getAttribute("webmapid");
    ce(t, o);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", le);
export {
  le as GeocamMap
};
