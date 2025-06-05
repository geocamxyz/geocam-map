var j = typeof window < "u";
const R = {
  Promise: j ? window.Promise : void 0
};
var $ = "4.25", A = "next";
function G(e) {
  if (e.toLowerCase() === A)
    return A;
  var t = e && e.match(/^(\d)\.(\d+)/);
  return t && {
    major: parseInt(t[1], 10),
    minor: parseInt(t[2], 10)
  };
}
function N(e) {
  return e === void 0 && (e = $), "https://js.arcgis.com/".concat(e, "/");
}
function z(e) {
  e === void 0 && (e = $);
  var t = N(e), o = G(e);
  if (o !== A && o.major === 3) {
    var n = o.minor <= 10 ? "js/" : "";
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
    var o = document.querySelector(t);
    o.parentNode.insertBefore(e, o);
  } else
    document.head.appendChild(e);
}
function J(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function K(e) {
  return !e || G(e) ? z(e) : e;
}
function O(e, t) {
  var o = K(e), n = J(o);
  return n || (n = V(o), H(n, t)), n;
}
var X = {};
function Z(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function U(e, t, o) {
  var n;
  o && (n = _(e, o));
  var s = function() {
    t(e), e.removeEventListener("load", s, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", s, !1);
}
function _(e, t) {
  var o = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", o, !1);
  };
  return e.addEventListener("error", o, !1), o;
}
function B() {
  return document.querySelector("script[data-esri-loader]");
}
function M() {
  var e = window.require;
  return e && e.on;
}
function Q(e) {
  e === void 0 && (e = {});
  var t = {};
  [X, e].forEach(function(s) {
    for (var r in s)
      Object.prototype.hasOwnProperty.call(s, r) && (t[r] = s[r]);
  });
  var o = t.version, n = t.url || N(o);
  return new R.Promise(function(s, r) {
    var d = B();
    if (d) {
      var g = d.getAttribute("src");
      g !== n ? r(new Error("The ArcGIS API for JavaScript is already loaded (".concat(g, ")."))) : M() ? s(d) : U(d, s, r);
    } else if (M())
      r(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = t.css;
      if (i) {
        var p = i === !0;
        O(p ? o : i, t.insertCssBefore);
      }
      d = Z(n), U(d, function() {
        d.setAttribute("data-esri-loader", "loaded"), s(d);
      }, r), document.body.appendChild(d);
    }
  });
}
function q(e) {
  return new R.Promise(function(t, o) {
    var n = window.require.on("error", o);
    window.require(e, function() {
      for (var s = [], r = 0; r < arguments.length; r++)
        s[r] = arguments[r];
      n.remove(), t(s);
    });
  });
}
function Y(e, t) {
  if (t === void 0 && (t = {}), M())
    return q(e);
  var o = B(), n = o && o.getAttribute("src");
  return !t.url && n && (t.url = n), Q(t).then(function() {
    return q(e);
  });
}
async function ee(e, t) {
  const o = {
    version: "4.26",
    css: !0
  };
  let n;
  const s = [{ name: "Zoom" }], r = [
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
        expanded: (i, p, x, w) => {
          w.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, p, x, w) => {
          i === "measuring" ? w.view.emit("clickable", !1) : i !== "measuring" && p === "measuring" && w.view.emit("clickable", !0), console.log("viewmodel state change", i, w);
        }
      }
    }
  ], d = s ? s.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], g = r ? r.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await Y(
    [
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer"
    ].concat(d).concat(g),
    o
  ).then(([i, p, x, w, P, ...T]) => {
    window.ARCGIS_TOKEN && i.registerToken({
      server: window.ARCGIS_SERVER,
      token: window.ARCGIS_TOKEN
    });
    const S = new URLSearchParams(window.location.search), C = S.get("cell"), L = t || S.get("webmapid");
    let v, b;
    if (L) {
      const c = {
        id: L
      };
      if (L.startsWith("http")) {
        const l = L.split("/");
        c.id = l.pop();
        const m = l.join("/"), f = new Portal({
          url: m
        });
        c.portal = f;
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
      console.log("shots url is", c), b = new P({
        url: c,
        definitionExpression: "mod(id,100) = 0"
        // start with agressive simplifaction - view should get scale change early on to override this
      }), v.add(b);
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
    S.get("zoom") || b && b.when((c) => {
      const l = {
        xmin: -5e-3,
        ymin: -5e-3,
        xmax: 5e-3,
        ymax: 5e-3
      }, m = Object.keys(l), f = {};
      for (let u = 0; u < m.length; u++)
        f[m[u]] = parseFloat(c.fullExtent[m[u]]) + l[m[u]];
      n.extent = f;
    }), n = new x({
      container: e,
      map: v,
      ui: {
        components: ["attribution"]
      }
    });
    const k = document.getElementsByTagName(
      "geocam-viewer-arcgis-map"
    )[0];
    k && k.link && (console.log("map linking to connector", n), k.link(n));
    const W = function(c) {
      return c.layers.items.map((l) => l.layers ? W(l) : l);
    }, D = function(c) {
      return W(c).flat();
    };
    n.when(async () => {
      window.mv = n;
      let c = [], l = !1;
      const m = D(n.map);
      for (let u = 0; u < m.length; u++) {
        const a = m[u];
        if (await n.whenLayerView(a), a.editingEnabled && (l = !0), a.fields) {
          const E = a.fields.map((h) => h.name);
          c.push({ layer: a, searchFields: E });
        }
      }
      const f = [];
      d.forEach((u, a) => {
        const E = T[a], h = new E({
          view: n,
          container: document.createElement("div"),
          ...s[a].options
        });
        f.push(h);
      }), g.forEach((u, a) => {
        if (u === "esri/widgets/Editor" && !l)
          return;
        u === "esri/widgets/Search" && (r[a].options = r[a].options || {}, r[a].options.sources = r[a].options.sources || c);
        const E = T[a + d.length], h = new E({
          view: n,
          container: document.createElement("div"),
          ...r[a].options
        });
        console.log("loaded widget", {
          view: n,
          container: document.createElement("div"),
          ...r[a].options
        });
        const F = new w({
          view: n,
          group: "expands",
          autoCollapse: !0,
          content: h,
          expandIconClass: r[a].icon
        });
        r[a].watchWidgetFor && Object.keys(r[a].watchWidgetFor).forEach((y) => {
          h.watch(
            y,
            (...I) => r[a].watchWidgetFor[y].apply(h, I)
          );
        }), r[a].watchExpandFor && Object.keys(r[a].watchExpandFor).forEach((y) => {
          F.watch(
            y,
            (...I) => r[a].watchExpandFor[y].apply(F, I)
          );
        }), f.push(F);
      }), n.ui.add(f, "top-right"), console.log("All widgets added");
    });
  }), n;
}
class te extends HTMLElement {
  constructor() {
    super(), console.log("Map init");
  }
  connectedCallback() {
    console.log("Map connected");
    const t = this, o = t.getAttribute("webmapid");
    ee(t, o);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", te);
export {
  te as GeocamMap
};
