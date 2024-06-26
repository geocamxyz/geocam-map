var j = typeof window < "u";
const T = {
  Promise: j ? window.Promise : void 0
};
var $ = "4.25", P = "next";
function B(e) {
  if (e.toLowerCase() === P)
    return P;
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
  var t = N(e), r = B(e);
  if (r !== P && r.major === 3) {
    var n = r.minor <= 10 ? "js/" : "";
    return "".concat(t).concat(n, "esri/css/esri.css");
  } else
    return "".concat(t, "esri/themes/light/main.css");
}
function R(e) {
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
function V(e) {
  return !e || B(e) ? z(e) : e;
}
function X(e, t) {
  var r = V(e), n = J(r);
  return n || (n = R(r), H(n, t)), n;
}
var Z = {};
function K(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function U(e, t, r) {
  var n;
  r && (n = Q(e, r));
  var i = function() {
    t(e), e.removeEventListener("load", i, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", i, !1);
}
function Q(e, t) {
  var r = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", r, !1);
  };
  return e.addEventListener("error", r, !1), r;
}
function D() {
  return document.querySelector("script[data-esri-loader]");
}
function W() {
  var e = window.require;
  return e && e.on;
}
function Y(e) {
  e === void 0 && (e = {});
  var t = {};
  [Z, e].forEach(function(i) {
    for (var o in i)
      Object.prototype.hasOwnProperty.call(i, o) && (t[o] = i[o]);
  });
  var r = t.version, n = t.url || N(r);
  return new T.Promise(function(i, o) {
    var d = D();
    if (d) {
      var g = d.getAttribute("src");
      g !== n ? o(new Error("The ArcGIS API for JavaScript is already loaded (".concat(g, ")."))) : W() ? i(d) : U(d, i, o);
    } else if (W())
      o(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var s = t.css;
      if (s) {
        var h = s === !0;
        X(h ? r : s, t.insertCssBefore);
      }
      d = K(n), U(d, function() {
        d.setAttribute("data-esri-loader", "loaded"), i(d);
      }, o), document.body.appendChild(d);
    }
  });
}
function q(e) {
  return new T.Promise(function(t, r) {
    var n = window.require.on("error", r);
    window.require(e, function() {
      for (var i = [], o = 0; o < arguments.length; o++)
        i[o] = arguments[o];
      n.remove(), t(i);
    });
  });
}
function O(e, t) {
  if (t === void 0 && (t = {}), W())
    return q(e);
  var r = D(), n = r && r.getAttribute("src");
  return !t.url && n && (t.url = n), Y(t).then(function() {
    return q(e);
  });
}
async function _(e, t) {
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
        expanded: (s, h, x, f) => {
          f.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (s, h, x, f) => {
          s === "measuring" ? f.view.emit("clickable", !1) : s !== "measuring" && h === "measuring" && f.view.emit("clickable", !0), console.log("viewmodel state change", s, f);
        }
      }
    }
  ], d = i ? i.map((s) => s.class ? s.class : `esri/widgets/${s.name}`) : [], g = o ? o.map((s) => s.class ? s.class : `esri/widgets/${s.name}`) : [];
  return await O(
    [
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer"
    ].concat(d).concat(g),
    r
  ).then(([s, h, x, f, ...A]) => {
    const S = new URLSearchParams(window.location.search), F = S.get("cell"), L = t || S.get("webmapid");
    let v, b;
    if (L) {
      const c = {
        id: L
      };
      if (L.startsWith("http")) {
        const l = L.split("/");
        c.id = l.pop();
        const m = l.join("/"), p = new Portal({
          url: m
        });
        c.portal = p;
      }
      v = new s({
        portalItem: c
      });
    } else
      v = new s({
        basemap: "satellite"
      });
    if (F) {
      const c = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${F}/FeatureServer/0`;
      console.log("shots url is", c), b = new f({
        url: c,
        definitionExpression: "mod(id,100) = 0"
        // start with agressive simplifaction - view should get scale change early on to override this
      }), v.add(b);
      const l = `${document.location.protocol}//${document.location.host.startsWith("localhost") ? "localhost:3092" : document.location.host}/arcgis/rest/services/${F}/FeatureServer/1`;
      console.log("points features url is", l);
      const m = new f({
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
      }, m = Object.keys(l), p = {};
      for (let u = 0; u < m.length; u++)
        p[m[u]] = parseFloat(c.fullExtent[m[u]]) + l[m[u]];
      n.extent = p;
    }), n = new h({
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
    const M = function(c) {
      return c.layers.items.map((l) => l.layers ? M(l) : l);
    }, G = function(c) {
      return M(c).flat();
    };
    n.when(async () => {
      window.mv = n;
      let c = [], l = !1;
      const m = G(n.map);
      for (let u = 0; u < m.length; u++) {
        const a = m[u];
        if (await n.whenLayerView(a), a.editingEnabled && (l = !0), a.fields) {
          const y = a.fields.map((w) => w.name);
          c.push({ layer: a, searchFields: y });
        }
      }
      const p = [];
      d.forEach((u, a) => {
        const y = A[a], w = new y({
          view: n,
          container: document.createElement("div"),
          ...i[a].options
        });
        p.push(w);
      }), g.forEach((u, a) => {
        if (u === "esri/widgets/Editor" && !l)
          return;
        u === "esri/widgets/Search" && (o[a].options = o[a].options || {}, o[a].options.sources = o[a].options.sources || c);
        const y = A[a + d.length], w = new y({
          view: n,
          container: document.createElement("div"),
          ...o[a].options
        });
        console.log("loaded widget", {
          view: n,
          container: document.createElement("div"),
          ...o[a].options
        });
        const C = new x({
          view: n,
          group: "expands",
          autoCollapse: !0,
          content: w,
          expandIconClass: o[a].icon
        });
        o[a].watchWidgetFor && Object.keys(o[a].watchWidgetFor).forEach((E) => {
          w.watch(
            E,
            (...I) => o[a].watchWidgetFor[E].apply(w, I)
          );
        }), o[a].watchExpandFor && Object.keys(o[a].watchExpandFor).forEach((E) => {
          C.watch(
            E,
            (...I) => o[a].watchExpandFor[E].apply(C, I)
          );
        }), p.push(C);
      }), n.ui.add(p, "top-right"), console.log("All widgets added");
    });
  }), n;
}
class ee extends HTMLElement {
  constructor() {
    super(), console.log("Map init");
  }
  connectedCallback() {
    console.log("Map connected");
    const t = this, r = t.getAttribute("webmapid");
    _(t, r);
  }
  disconnectedCallback() {
    console.log("labe disconnected");
  }
}
window.customElements.define("geocam-map", ee);
export {
  ee as GeocamMap
};
