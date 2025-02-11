# Geocam Map
Geocam map web component - convenience component for loading an arcgis map which can be connected to [geocamxyz/geocam-viewer](https://github.com/geocamxyz/geocam-vewier) web component via the - [geocamxyz/connector-arcgis-map](https://github.com/geocamxyz/connector-arcgis-map) web component

### NPM Installation:
```
npm install 'https://gitpkg.now.sh/geocamxyz/geocam-map/src?v2.0.3'
```
or for a particual commit version:
```
npm install 'https://gitpkg.now.sh/geocamxyz/geocam-map/src?564ef82'
```
### Import Map (External Loading):
```
https://cdn.jsdelivr.net/gh/geocamxyz/geocam-map@v2.0.3/dist/geocam-map.js
```
or for a particual commit version:
```
https://cdn.jsdelivr.net/gh/geocamxyz/geocam-map@564ef82/dist/geocam-map.js
```

### Usage:
The .js file can be imported into your .html file using the below code (This can be ignored if your using the NPM package).
```
 <script type="module" src="https://cdn.jsdelivr.net/gh/geocamxyz/geocam-map@2.0.3/dist/geocam-map.js"></script>
 ```

 Or with an importmap
 ```
<script type="importmap">
      {
        "imports": {
          "geocam-map": "https://cdn.jsdelivr.net/gh/geocamxyz/geocam-map@2.0.3/dist/geocam-map.js"
        }
      }
    </script>
```
The map can then be imported via a module script or using the npm package and using the below import statement.
```
import "geocam-map"
```
### Setup:
The module generates a custom  &lt;geocam-map> html tag which can be used to display geocam captured shots.
```
 <geocam-map webmapid="9d9a2271c967432d9215ab6bc00cc5a5"></geocam-map>
```

The following attributes define the shot and view to display:
- webmapid="9d9a2271c967432d9215ab6bc00cc5a5" *id of base arcgis webmap to display over which the geocam manager features layers will be added.  This can be left blank for a default satellite map.  When using arcgis enterprise you need to include the reference to the portal first eg: https://enterprise/portal/9d9a2271c967432d9215ab6bc00cc5a5*

To dsiplay the map correctly you need to use css to make sure the element appears on screen with a height as well as a width.

A full implementation of the map including all the plugins would look like this:
```
  <geocam-viewer>
    <geocam-viewer-orbit-controls></geocam-viewer-orbit-controls>
    <geocam-viewer-compass-needle></geocam-viewer-compass-needle>
    <geocam-viewer-label></geocam-viewer-label>
    <geocam-viewer-url-fragments
      params="fov,facing,horizon,shot,sli,visible,left,top,width,height,mode,autorotate,autobrightness,zoom,center"></geocam-viewer-url-fragments>
    <geocam-viewer-loading-indicator></geocam-viewer-loading-indicator>
    <geocam-viewer-screen-shot></geocam-viewer-screen-shot>
    <geocam-viewer-prev-next-control></geocam-viewer-prev-next-control>
    <geocam-viewer-arcgis-map
      src="http://localhost:3092/arcgis/rest/services/0wlsvpg/FeatureServer"></geocam-viewer-arcgis-map>
    <geocam-viewer-multiview-window target="map"></geocam-viewer-multiview-window>
  </geocam-viewer>
  <geocam-map id="map"> </geocam-map>

```