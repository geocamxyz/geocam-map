var O = typeof window < "u";
const B = {
  Promise: O ? window.Promise : void 0
};
var D = "4.25", T = "next";
function z(e) {
  if (e.toLowerCase() === T)
    return T;
  var t = e && e.match(/^(\d)\.(\d+)/);
  return t && {
    major: parseInt(t[1], 10),
    minor: parseInt(t[2], 10)
  };
}
function j(e) {
  return e === void 0 && (e = D), "https://js.arcgis.com/".concat(e, "/");
}
function _(e) {
  e === void 0 && (e = D);
  var t = j(e), o = z(e);
  if (o !== T && o.major === 3) {
    var n = o.minor <= 10 ? "js/" : "";
    return "".concat(t).concat(n, "esri/css/esri.css");
  } else
    return "".concat(t, "esri/themes/light/main.css");
}
function X(e) {
  var t = document.createElement("link");
  return t.rel = "stylesheet", t.href = e, t;
}
function Z(e, t) {
  if (t) {
    var o = document.querySelector(t);
    o.parentNode.insertBefore(e, o);
  } else
    document.head.appendChild(e);
}
function Q(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function Y(e) {
  return !e || z(e) ? _(e) : e;
}
function ee(e, t) {
  var o = Y(e), n = Q(o);
  return n || (n = X(o), Z(n, t)), n;
}
var te = {};
function ne(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function R(e, t, o) {
  var n;
  o && (n = oe(e, o));
  var p = function() {
    t(e), e.removeEventListener("load", p, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", p, !1);
}
function oe(e, t) {
  var o = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", o, !1);
  };
  return e.addEventListener("error", o, !1), o;
}
function V() {
  return document.querySelector("script[data-esri-loader]");
}
function W() {
  var e = window.require;
  return e && e.on;
}
function ae(e) {
  e === void 0 && (e = {});
  var t = {};
  [te, e].forEach(function(p) {
    for (var d in p)
      Object.prototype.hasOwnProperty.call(p, d) && (t[d] = p[d]);
  });
  var o = t.version, n = t.url || j(o);
  return new B.Promise(function(p, d) {
    var a = V();
    if (a) {
      var y = a.getAttribute("src");
      y !== n ? d(new Error("The ArcGIS API for JavaScript is already loaded (".concat(y, ")."))) : W() ? p(a) : R(a, p, d);
    } else if (W())
      d(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var E = t.css;
      if (E) {
        var u = E === !0;
        ee(u ? o : E, t.insertCssBefore);
      }
      a = ne(n), R(a, function() {
        a.setAttribute("data-esri-loader", "loaded"), p(a);
      }, d), document.body.appendChild(a);
    }
  });
}
function $(e) {
  return new B.Promise(function(t, o) {
    var n = window.require.on("error", o);
    window.require(e, function() {
      for (var p = [], d = 0; d < arguments.length; d++)
        p[d] = arguments[d];
      n.remove(), t(p);
    });
  });
}
function re(e, t) {
  if (t === void 0 && (t = {}), W())
    return $(e);
  var o = V(), n = o && o.getAttribute("src");
  return !t.url && n && (t.url = n), ae(t).then(function() {
    return $(e);
  });
}
async function se(e, t) {
  const o = {
    version: "4.26",
    css: !0
  };
  let n;
  const p = 2, d = [{ name: "Zoom" }], a = [
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
        expanded: (u, L, C, w) => {
          w.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (u, L, C, w) => {
          u === "measuring" ? w.view.emit("clickable", !1) : u !== "measuring" && L === "measuring" && w.view.emit("clickable", !0), console.log("viewmodel state change", u, w);
        }
      }
    }
  ], y = d ? d.map((u) => u.class ? u.class : `esri/widgets/${u.name}`) : [], E = a ? a.map((u) => u.class ? u.class : `esri/widgets/${u.name}`) : [];
  return await re(
    [
      "esri/identity/IdentityManager",
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
    ([
      u,
      L,
      C,
      w,
      U,
      H,
      J,
      K,
      ...q
    ]) => {
      window.ARCGIS_TOKEN && u.registerToken({
        server: window.ARCGIS_SERVER,
        token: window.ARCGIS_TOKEN
      });
      const k = new URLSearchParams(window.location.search), A = k.get("cell"), S = t || k.get("webmapid");
      let h, I;
      if (S) {
        const r = {
          id: S
        };
        if (S.startsWith("http")) {
          const c = S.split("/");
          r.id = c.pop();
          const l = c.join("/"), f = new H({
            url: l
          });
          r.portal = f;
        }
        h = new L({
          portalItem: r
        });
      } else
        h = new L({
          basemap: "satellite"
        });
      if (A) {
        const r = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${A}/FeatureServer/0`;
        console.log("shots url is", r), I = new U({
          url: r,
          definitionExpression: "mod(id,100) = 0"
          // start with agressive simplifaction - view should get scale change early on to override this
        }), h.add(I);
        const c = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${A}/FeatureServer/1`;
        console.log("points features url is", c);
        const l = new U({
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
        h.add(l);
      }
      k.get("zoom") || I && I.when((r) => {
        const c = {
          xmin: -5e-3,
          ymin: -5e-3,
          xmax: 5e-3,
          ymax: 5e-3
        }, l = Object.keys(c), f = {};
        for (let i = 0; i < l.length; i++)
          f[l[i]] = parseFloat(r.fullExtent[l[i]]) + c[l[i]];
        n.extent = f;
      });
      const G = async (r) => {
        try {
          if (!r)
            return null;
          await r.load();
          const c = r.baseLayers.toArray();
          await Promise.all(c.map((m) => m.load().catch(() => null)));
          const l = c.find(
            (m) => m.tileInfo && m.tileInfo.lods && m.tileInfo.lods.length
          );
          if (!l)
            return null;
          const f = l.tileInfo.lods.map((m) => m.clone());
          let i = f[f.length - 1];
          for (; i.scale / 2 >= p; )
            i = new J({
              level: i.level + 1,
              scale: i.scale / 2,
              resolution: i.resolution / 2
            }), f.push(i);
          return f.length > l.tileInfo.lods.length ? f : null;
        } catch (c) {
          return console.warn("Could not extend basemap zoom levels", c), null;
        }
      };
      h.load().then(async () => {
        const r = await G(h.basemap);
        n = new C({
          container: e,
          map: h,
          ...r ? { constraints: { lods: r } } : {},
          ui: {
            components: ["attribution"]
          }
        }), K.watch(
          () => n.map && n.map.basemap,
          async (i) => {
            const m = await G(i);
            n.map && n.map.basemap === i && (n.constraints.lods = m);
          }
        );
        const c = document.getElementsByTagName(
          "geocam-viewer-arcgis-map"
        )[0];
        c && c.link && (console.log("map linking to connector", n), c.link(n));
        const l = function(i) {
          return i.layers.items.map((m) => m.layers ? l(m) : m);
        }, f = function(i) {
          return l(i).flat();
        };
        n.when(async () => {
          window.mv = n;
          let i = [], m = !1;
          const N = f(n.map);
          for (let g = 0; g < N.length; g++) {
            const s = N[g];
            if (await n.whenLayerView(s), s.editingEnabled && (m = !0), s.fields) {
              const b = s.fields.map((v) => v.name);
              i.push({ layer: s, searchFields: b });
            }
          }
          const F = [];
          y.forEach((g, s) => {
            const b = q[s], v = new b({
              view: n,
              container: document.createElement("div"),
              ...d[s].options
            });
            F.push(v);
          }), E.forEach((g, s) => {
            if (g === "esri/widgets/Editor" && !m)
              return;
            g === "esri/widgets/Search" && (a[s].options = a[s].options || {}, a[s].options.sources = a[s].options.sources || i);
            const b = q[s + y.length], v = new b({
              view: n,
              container: document.createElement("div"),
              ...a[s].options
            });
            console.log("loaded widget", {
              view: n,
              container: document.createElement("div"),
              ...a[s].options
            });
            const M = new w({
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
              expandIconClass: a[s].icon,
              expandTooltip: a[s].tooltip
            });
            a[s].watchWidgetFor && Object.keys(a[s].watchWidgetFor).forEach((x) => {
              v.watch(
                x,
                (...P) => a[s].watchWidgetFor[x].apply(v, P)
              );
            }), a[s].watchExpandFor && Object.keys(a[s].watchExpandFor).forEach((x) => {
              M.watch(
                x,
                (...P) => a[s].watchExpandFor[x].apply(M, P)
              );
            }), F.push(M);
          }), n.ui.add(F, "top-right"), console.log("All widgets added");
        });
      }).catch((r) => {
        var l, f;
        const c = r && r.message ? (r == null ? void 0 : r.message) + `
` + ((f = (l = r == null ? void 0 : r.details) == null ? void 0 : l.error) == null ? void 0 : f.message) : "An unknown erro occurred trying to load the map.";
        alert(c), console.error("Error loading map:", c);
      });
    }
  ), n;
}
class ie extends HTMLElement {
  constructor() {
    super(), console.log("Map init");
  }
  connectedCallback() {
    console.log("Map connected");
    const t = this, o = t.getAttribute("webmapid");
    se(t, o);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", ie);
export {
  ie as GeocamMap
};
