import { loadModules } from "esri-loader";

export async function map(node, webmapid) {
  const esriLoaderOptions = {
    version: "4.26",
    css: true,
  };

  let view;

  const widgets = [{ name: "Zoom" }];
  const expands = [
    {
      name: "Search",
      icon: "esri-icon-search",
      options: { includeDefaultSources: true },
    },
    { name: "BasemapGallery", icon: "esri-icon-basemap" },
    { name: "LayerList", icon: "esri-icon-layer-list" },
    { name: "Legend", icon: "esri-icon-feature-layer" },
    { name: "Editor", icon: "esri-icon-edit" },
    {
      name: "DistanceMeasurement2D",
      icon: "esri-icon-measure",
      watchExpandFor: {
        expanded: (nV, oV, expProp, expObj) => {
          expObj.content.viewModel.clear();
        },
      },
      watchWidgetFor: {
        "viewModel.state": (nV, oV, expProp, expObj) => {
          if (nV === "measuring") {
            expObj.view.emit("clickable", false);
          } else if (nV !== "measuring" && oV === "measuring") {
            expObj.view.emit("clickable", true);
          }
          console.log("viewmodel state change", nV, expObj);
        },
      },
    },
    {
      name: "AreaMeasurement2D",
      icon: "esri-icon-measure-area",
      watchExpandFor: {
        expanded: (nV, oV, expProp, expObj) => {
          expObj.content.viewModel.clear();
        },
      },
      watchWidgetFor: {
        "viewModel.state": (nV, oV, expProp, expObj) => {
          if (nV === "measuring") {
            expObj.view.emit("clickable", false);
          } else if (nV !== "measuring" && oV === "measuring") {
            expObj.view.emit("clickable", true);
          }
          console.log("viewmodel state change", nV, expObj);
        },
      },
    },
  ];

  const widgetList = widgets
    ? widgets.map((w) => (w.class ? w.class : `esri/widgets/${w.name}`))
    : [];
  const expandList = expands
    ? expands.map((w) => (w.class ? w.class : `esri/widgets/${w.name}`))
    : [];

  await loadModules(
    [
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Expand",
      "esri/layers/FeatureLayer",
    ]
      .concat(widgetList)
      .concat(expandList),
    esriLoaderOptions
  ).then(
    ([
      IdentityManager,
      EsriMap,
      MapView,
      Expand,
      FeatureLayer,
      ...widgetArray
    ]) => {
      if (window.ARCGIS_TOKEN) {
        IdentityManager.registerToken({
          server: window.ARCGIS_SERVER,
          token: window.ARCGIS_TOKEN,
        });
      }
      const params = new URLSearchParams(window.location.search);
      const cell = params.get("cell");
      const webmapId = webmapid || params.get("webmapid");
      let map;
      let shotsLayer;

      if (webmapId) {
        const portalItem = {
          id: webmapId,
        };

        if (webmapId.startsWith("http")) {
          const parts = webmapId.split("/");
          portalItem.id = parts.pop();
          const portalUrl = parts.join("/");
          const portal = new Portal({
            url: portalUrl,
          });
          portalItem.portal = portal;
        }

        map = new EsriMap({
          portalItem,
        });
      } else {
        map = new EsriMap({
          basemap: "satellite",
        });
      }

      if (cell) {
        const shotsUrl = `${document.location.protocol}//${
          document.location.host.startsWith("localhost")
            ? "localhost:3092"
            : document.location.host
        }/arcgis/rest/services/${cell}/FeatureServer/0`;
        console.log("shots url is", shotsUrl);
        shotsLayer = new FeatureLayer({
          url: shotsUrl,
          definitionExpression: "mod(id,100) = 0", // start with agressive simplifaction - view should get scale change early on to override this
        });
        map.add(shotsLayer);

        const pointFeaturesUrl = `${document.location.protocol}//${
          document.location.host.startsWith("localhost")
            ? "localhost:3092"
            : document.location.host
        }/arcgis/rest/services/${cell}/FeatureServer/1`;
        console.log("points features url is", pointFeaturesUrl);
        const pointsFeaturesLayer = new FeatureLayer({
          url: pointFeaturesUrl,
          popupEnabled: true,
          popupTemplate: {
            title: "{reference}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "embed",
                    label: "content",
                  },
                ],
              },
            ],
          },
        });
        map.add(pointsFeaturesLayer);
      }

      const zoom = params.get("zoom");
      // if there is a zoom parameter then we should have center as well otherwise fit the extent
      if (!zoom) {
        if (shotsLayer)
          shotsLayer.when((layer) => {
            const buffer = {
              xmin: -0.005,
              ymin: -0.005,
              xmax: 0.005,
              ymax: 0.005,
            };
            const props = Object.keys(buffer);
            const extent = {};
            for (let i = 0; i < props.length; i++) {
              extent[props[i]] =
                parseFloat(layer.fullExtent[props[i]]) + buffer[props[i]];
            }
            view.extent = extent;
          });
      }

      map.load().then(() => {
        view = new MapView({
          container: node,
          map: map,
          ui: {
            components: ["attribution"],
          },
        });

        const connector = document.getElementsByTagName(
          "geocam-viewer-arcgis-map"
        )[0];
        if (connector && connector.link) {
          console.log("map linking to connector", view);
          connector.link(view);
        }

        const destructureLayers = function (obj) {
          return obj.layers.items.map((l) => {
            return l.layers ? destructureLayers(l) : l;
          });
        };

        const ungroupLayers = function (obj) {
          return destructureLayers(obj).flat();
        };

        view.when(async () => {
          window.mv = view;
          let allLayers = [];
          let hasEditableLayers = false;
          const layers = ungroupLayers(view.map);
          for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            await view.whenLayerView(layer);
            if (layer.editingEnabled) hasEditableLayers = true;
            if (layer.fields) {
              const fieldNames = layer.fields.map((f) => f.name);
              allLayers.push({ layer, searchFields: fieldNames });
            }
          }

          const allWidgets = [];

          widgetList.forEach((w, i) => {
            const loadedWidget = widgetArray[i];
            const widget = new loadedWidget({
              view: view,
              container: document.createElement("div"),
              ...widgets[i].options,
            });
            allWidgets.push(widget);
          });

          expandList.forEach((w, i) => {
            if (w === "esri/widgets/Editor" && !hasEditableLayers) return;
            if (w === "esri/widgets/Search") {
              expands[i].options = expands[i].options || {};
              expands[i].options.sources =
                expands[i].options.sources || allLayers;
            }
            const loadedWidget = widgetArray[i + widgetList.length];
            const widget = new loadedWidget({
              view: view,
              container: document.createElement("div"),
              ...expands[i].options,
            });
            console.log("loaded widget", {
              view: view,
              container: document.createElement("div"),
              ...expands[i].options,
            });
            const expand = new Expand({
              view: view,
              group: "expands",
              autoCollapse: true,
              content: widget,
              expandIconClass: expands[i].icon,
            });
            if (expands[i].watchWidgetFor) {
              Object.keys(expands[i].watchWidgetFor).forEach((prop) => {
                // for some reason widget is null here even if assign to temp var so using this doesn't work
                widget.watch(prop, (...args) =>
                  expands[i].watchWidgetFor[prop].apply(widget, args)
                );
              });
            }
            if (expands[i].watchExpandFor) {
              Object.keys(expands[i].watchExpandFor).forEach((prop) => {
                // for some reason widget is null here even if assign to temp var so using this doesn't work
                expand.watch(prop, (...args) =>
                  expands[i].watchExpandFor[prop].apply(expand, args)
                );
              });
            }
            // expand.watch("expanded", setActiveExpand);
            allWidgets.push(expand);
          });

          view.ui.add(allWidgets, "top-right");
          console.log("All widgets added");
        });
      }).catch((error) => {
        const msg = error && error.message ? error?.message + "\n" + error?.details?.error?.message : "An unknown erro occurred trying to load the map.";
        alert(msg);
        console.error("Error loading map:", msg);
      });
    }
  );

  return view;
}
