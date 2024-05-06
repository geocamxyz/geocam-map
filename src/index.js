import { map } from "./lib/map.js";

export class GeocamMap extends HTMLElement {
  constructor() {
    super();
    // this.yaw = this.getAttribute('yaw') || 0;
    console.log("Map init");
  }

  connectedCallback() {
    console.log("Map connected");
    const node = this;
    const webmapid = node.getAttribute("data-webmapid");
    map(node, webmapid);
  }

  disconnectedCallback() {
    console.log("labe disconnected");
    // Clean up the viewer
  }
}

window.customElements.define("geocam-map", GeocamMap);
