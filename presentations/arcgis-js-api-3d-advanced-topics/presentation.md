<!-- .slide: data-background="images/title.png" -->

<div style="padding-top: 300px"/>

# Web 3D with the ArcGIS API for JavaScript
## _Advanced topics_

<br>

Jesse van den Kieboom, ESRI R&amp;D Center Zürich

Simon Reinhard, ESRI R&amp;D Center Zürich

Yann Cabon, ESRI Redlands

---

<!-- .slide: data-background="images/bg-5.png" -->
## IMPORTANT NOTICE:
<br><br>
**All demonstrations and embedded samples are written against<br>
the upcoming 4.0 release and (most) will not work against 4.0beta3!!!**
<br><br>
- View online:
  - Presentation: http://jkieboom.github.io/devsummit-palm-springs-2016/presentations/arcgis-js-api-3d-advanced-topics/#/
  - External webgl rendering demo: https://jkieboom.github.io/devsummit-palm-springs-2016/demos/apps/external-renderer/

---

<!-- .slide: data-background="images/bg-4.png" -->

## Table of contents

1. 4.0 API foundations
1. Working with the SceneView
1. Show case: Building a custom 3D application
1. Sneak preview: highlighting in 3D

---

<!-- .slide: data-background="images/bg-4.png" -->

## 4.0 API foundations

---

<!-- .slide: data-background="images/bg-6.png" -->

## 4.0 API foundations

<img src="./images/platform.png" style="max-height: 500px"/>

---

<!-- .slide: data-background="images/bg-6.png" -->

## 4.0 API foundations &mdash; Accessor

- Focus on properties and property notification
- “Auto-casting” of property types, implicitly calls constructor of corresponding
  property type

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">view.watch("center", (value) => {
  // Called whenever the center property value has changed
  console.log("center set to:", value.longitude, value.latitude);
});

// Auto-cast allows omitting constructing a new Point instance
view.center = {
  x: -116.54,
  y: 33.83
};</code></pre>
  <svg data-play-frame="frame-auto-cast" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-auto-cast" data-src="./snippets/auto-cast.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## 4.0 API foundations &mdash; Accessor

- Unified object construction
- See also [Working with properties (developers.arcgis.com)](https://developers.arcgis.com/javascript/beta/guide/working-with-props/index.html)

```js
var view = new SceneView({
  map: new Map({
    basemap: "topo"
  }),

  extent: {
    xmin: -180, xmax: 180, ymin: -90, ymax: 90,
    spatialReference: 120100
  },

  environment: {
    lighting: {
      date: "Sun Mar 15 2015 18:00:00 GMT-8"
    }
  }
});
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## 4.0 API foundations &mdash; Promises

- As a rule, everything that may be asynchronous will return a `Promise`
- Certain classes _are_ promises themselves ([`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html), [`MapView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-MapView.html), [`Layer`](https://developers.arcgis.com/javascript/beta/api-reference/esri-layers-Layer.html))
- `Promises` are chainable s.t. you can write sequential asynchronous code

```js
view
    .then(() => {
      // View is ready to be interacted with, load the layer
      return layer.load();
    })

    .then(() => {
      // Layer is now loaded, project extent using geometry service
      return geometryService.project([layer.fullExtent]);
    })

    .then((projected) => {
      // Extent has been projected, we can now go to it
      return view.goTo(projected[0]);
    })

    .then(() => {
      // Here the gotTo animation has finished
    });
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## 4.0 API foundation &mdash; Promises

- See also [Working with promises (developers.arcgis.com)](https://developers.arcgis.com/javascript/beta/guide/working-with-promises/index.html)
- Tutorial on [Dojo promises](http://dojotoolkit.org/documentation/tutorials/1.10/promises/index.html)

---

<!-- .slide: data-background="images/bg-4.png" -->

## Working with the SceneView

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the SceneView

- Start with a 2D map/view, replace **[`MapView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-MapView.html)** with [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html)

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">view = new MapView({
  container: "viewDiv",

  map: new Map({
    basemap: "streets",

    layers: [new FeatureLayer(
      "...Alcoholic Spending.../FeatureServer/0"
    )]
  })
});</code></pre>
  </div>
  <div class="snippet-preview">
    <iframe data-src="./snippets/setup-3d-view-mapview.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the SceneView

- Start with a 2D map/view, replace [`MapView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-MapView.html) with **[`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html)**

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">view = new SceneView({
  container: "viewDiv",

  map: new Map({
    basemap: "streets",

    layers: [new FeatureLayer(
      "...Alcoholic Spending.../FeatureServer/0"
    )]
  })
});</code></pre>
  </div>
  <div class="snippet-preview">
    <iframe data-src="./snippets/setup-3d-view-sceneview.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the SceneView

- Unified 2D and 3D data model (the [`Map`](https://developers.arcgis.com/javascript/beta/api-reference/esri-Map.html)), [`Layer`](https://developers.arcgis.com/javascript/beta/api-reference/esri-layers-Layer.html), [`Renderer`](https://developers.arcgis.com/javascript/beta/api-reference/esri-renderers-Renderer.html) and [`Symbol`](https://developers.arcgis.com/javascript/beta/api-reference/esri-symbols-Symbol.html)
- Common [`View`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-View.html) subclass between 2D and 3D
- Makes it easy (boring!) to transition to 3D
- However, to exploit 3D, you need to learn certain 3D concepts

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html)

```ts
class SceneView {
  // Camera specifies the view
  camera: Camera;

  // Previously called animateTo in beta3
  goTo(...);
  
  // Settings that affect constraints (e.g. navigation constraints)
  constraints: SceneViewConstraints;

  // Padding on the view
  padding: { top: number, right: number, bottom: number, left: number };

  // Quality profile (upcoming in 4.0 (not in beta3))
  qualityProfile: string;

  // Converting coordinate systems
  toScreen(mapPoint: Point): ScreenPoint;
  toMap(screenPoint: ScreenPoint): Point;
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`esri/Camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-Camera.html)

- Primary specification of the view is the [`Camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-Camera.html)

```ts
class Camera {
  // The position of the camera eye in 3D space (`x`, `y` + `z` elevation)
  position: Point;

  // The heading angle (towards north in degrees, [0, 360]°)
  heading: number;

  // The tilt angle ([0, 180]°, with 0° straight down, 90° horizontal)
  tilt: number;
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`esri/Camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-Camera.html)

- [`SceneView.camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#camera) is a **value** object

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">var camera = view.camera;

// Increment the heading of the camera by 5 degrees
camera.heading += 5;

// Set the modified camera on the view
view.camera = camera;</code></pre>
  <svg data-play-frame="frame-heading-increment" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-heading-increment" data-src="./snippets/setup-3d-view-camera-heading-increment.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#animateTo)

- `goTo(target[, options])`
- Simple interface to go to a specific view
- Animates by default, can be disabled in options `{ animate: false }`
- Returns a `Promise` which resolves when the animation has finished<br><br>
- A number of diffent targets are supported: `Camera`, `Geometry`, `Geometry[]`, `Graphic`, `Graphic[]`
- Besides target, allows specifying desired `scale`, `position`, `heading` and `tilt`

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#animateTo)

- Rotate the view to closest multiple of 30°

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">var h = view.camera.heading;

// Set the heading of the view to
// the closest multiple of 30 degrees
var heading = Math.floor(h / 30) * 30 + 30;

// go to heading preserves view.center
view.goTo({
  heading: heading
});
</code></pre>
  <svg data-play-frame="frame-goto-heading" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-goto-heading" data-src="./snippets/setup-3d-view-goto-heading.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#animateTo)

- Rotate the **camera!** to closest multiple of 30°

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">var h = view.camera.heading;

// Set the heading of the view to
// the closest multiple of 30 degrees
var heading = Math.floor(h / 30) * 30 + 30;

// go to heading while preserving camera position
view.goTo({
  position: view.camera.position,
  heading: heading
});
</code></pre>
  <svg data-play-frame="frame-goto-heading-position" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-goto-heading-position" data-src="./snippets/setup-3d-view-goto-heading-position.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#animatoTo)

- View a set of graphics at a certain scale, heading and tilt

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">// Specify the target, as well as
// additional settings to further define the view
view.goTo({

  // The target is a set of graphics which should be
  // brought into view
  target: view.graphics

  // Additionally, set at which scale, heading and tilt
  // these graphics should be viewed
  scale: 5000,
  heading: 30,
  tilt: 60
});
</code></pre>
  <svg data-play-frame="frame-goto-graphics" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-goto-graphics" data-src="./snippets/setup-3d-view-goto-graphics.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#animateTo)

- User defined continuous animations

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">var scale = view.scale;
var center = view.center.clone();

Scheduler.addFrameTask({
  update: function(ev) {
    var pt = new Point({
      x: center.longitude + ev.spendInTask / 1000 * 20,
      y: center.latitude
    });

    view.goTo({
      target: pt,
      scale: scale
    });
  }
});
</code></pre>
  <svg data-play-frame="frame-goto-custom" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-goto-custom" data-src="./snippets/setup-3d-view-goto-custom.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`altitude`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#constraints)

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">// The minimum and maximum allowed
// altitude (camera.position.z) of the camera.
view.constraints.altitude = {
  min: 100000,
  max: 100000000
};
</code></pre>
  <svg data-play-frame="frame-constraints-altitude" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-constraints-altitude" data-src="./snippets/setup-3d-view-constraints-altitude.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`clipDistance`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#constraints)

- `clipDistance` directly sets the WebGL clipping near and far planes
- May be used when automatic determination of clipping planes is insufficient

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">// Set the clip distance near/far
// clipping planes to override the default
// clipping plane heuristics
view.constraints.clipDistance = {
  near: 55000,
  far: 550000000
};
</code></pre>
  <svg data-play-frame="frame-constraints-clip-distance" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-constraints-clip-distance" data-src="./snippets/setup-3d-view-constraints-clip-distance.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`padding`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#padding)

- Can be used to focus on a subsection of the view
- Primarily affects ui and navigation

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">// Set the padding to account
// for the space taken up by the sidebar and header
view.padding = {
  top: 30,
  left: 150
};
</code></pre>
  <svg data-play-frame="frame-padding" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-padding" data-src="./snippets/setup-3d-view-padding.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; qualityProfile

- New in 4.0 (not in beta3)
- Affects: Map resolution, scene level detail, anti-aliasing
- Introduced to increase performance on certain platforms
- Defaults to `"low"` for Safari and IE11, `"high"` anywhere else

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; qualityProfile

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">
var map = new Map({
  basemap: "hybrid"
});

viewHigh = new SceneView({
  map: map,
  qualityProfile: "high"
});

viewLow = new SceneView({
  map: map,
  qualityProfile: "low"
});
</code></pre>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-quality-profile" data-src="./snippets/setup-3d-view-quality-profile.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`toMap`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#toMap)/[`toScreen`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#toScreen)

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">view = new SceneView({
  map: new Map({
    basemap: "satellite"
  })
});

for (var x = 1; x <= 2; x++) {
  for (var y = 1; y <= 2; y++) {
    var px = x &lowast; (view.width / 3);
    var py = y &lowast; (view.height / 3);

    view.graphics.add(view.toMap(px, py), symbol);
  }
}

view.watch("camera", () => {
  console.log(view.graphics.map((graphic) => {
    var pt = view.toScreen(graphic.geometry);

    return "[" + pt.x + ", " + pt.y + "]";
  }).join(", "));
});
</code></pre>
  <svg data-play-frame="frame-to-map" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-to-map" data-src="./snippets/setup-3d-view-to-map.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-4.png" -->

## Show case: Building a custom 3D application

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Showing combination of various features of the API
  - Query task to query features
  - Geometry engine to process geometry
  - Custom graphics layer to automatically generate graphics in a region

  - New: Integrated external webgl rendering

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- External webgl renderering
  - Enrich your 3D application using customized rendering
  - Enhanced visualization beyond the capabilities of the (current) API
  - Rendering of custom data

```ts
module externalRenderers {
  add(view: SceneView, renderer: ExternalRenderer);
  remove(view: SceneView, renderer: ExternalRenderer);

  toRenderCoordinates(view: SceneView, src: number[], srcStart: number, dest: number[], destStart: number, count: number);
  fromRenderCoordinates(view: SceneView, src: number[], srcStart: number, dest: number[], destStart: number, count: number);

  requestRender(view: SceneView);
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

```ts
interface ExternalRenderer {
  setup?(context: RenderContext): void;
  dispose?(context: RenderContext): void;

  render?(context: RenderContext): void;
  renderTransparent?(context: RenderContext): void;
}

interface RenderContext {
  gl: WebGLRenderingContext;

  camera: {
    eye: number[];
    center: number[];
    up: number[];
  };

  sunLight: {
    direction: number[];
    diffuse: { color: number[]; intensity; number };
    ambient: { color: number[]; intensity; number };
  };
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

<br><br><br><br>
**[Demo time!](../../demos/apps/external-renderer)**

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Steps
  1. Getting the lake outline data
  1. Preparing the data for rendering
  1. Integrating threejs to render custom geometries
  1. Bonus: rendering the forest

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 1: getting the data
- Use [`QueryTask`](https://developers.arcgis.com/javascript/beta/api-reference/esri-tasks-QueryTask.html) and [`Query`](https://developers.arcgis.com/javascript/beta/api-reference/esri-tasks-support-Query.html) to query the lake contour from a `FeatureServer`

```js
var task = new QueryTask({
  url: ".../Public/Lakes/FeatureServer/1"
});

var query = new Query();

query.returnGeometry = true;
query.where = "NAME='Clifton Forge Reservoir'";
query.outSpatialReference = view.spatialReference;

task.execute(query).then(results => {
  var polygon = results.features[0].geometry;
});
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 2: preparing the polygon for rendering
- To nicely align with terrain, need to first tesselate polygon into triangles

<img src="./images/lake-outline.svg"/>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 2: preparing the polygon for rendering
- To nicely align with terrain, need to first tesselate polygon into triangles

<img src="./images/lake-outline-grid.svg"/>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 2: preparing the polygon for rendering
- To nicely align with terrain, need to first tesselate polygon into triangles
- Determine if cell is completely inside or outside using [`polygon.contains(pt)`](https://developers.arcgis.com/javascript/beta/api-reference/esri-geometry-Polygon.html#contains)
- If not, then compute triangles for the area of the cell covered by the polygon

<img src="./images/lake-outline-partial.svg"/>

How?

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 2: preparing the polygon for rendering

<br>
[`esri/geometry/geometryEngine`](https://developers.arcgis.com/javascript/beta/api-reference/esri-geometry-geometryEngine.html)!!
<br><br>

- Idea: use [`geometryEngine.intersect(polygon, cell): Polygon`](https://developers.arcgis.com/javascript/beta/api-reference/esri-geometry-geometryEngine.html#intersect)

<img src="./images/lake-outline-intersected.svg"/>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 2: preparing the polygon for rendering
- Then, triangulate polygon, e.g. with [earcut](https://github.com/mapbox/earcut)
- Finally, use `externalRenderers.toRenderCoordinates` to transform coordinates from the view spatial reference to the internal rendering coordinates

<img src="./images/lake-outline-tesselated.svg"/>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 2: preparing the polygon for rendering

<img height="500px" src="./images/lake-tesselated.png"/>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 3: Integrating the external renderer

- We use [threejs](http://threejs.org) in this demo (http://threejs.org)
  - Popular, easy to use middleware library for webgl rendering
- What we need:
  1. Setting up the threejs camera
  1. Setting up the threejs lighting
  1. Rendering our custom visualizations

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 3.1: Setting up the threejs camera
- threejs uses a very similar camera definition, easy to setup

```js
render(ctx: RenderContext) {
  var threeCam = new THREE.PerspectiveCamera();
  var c = ctx.camera;

  threeCam.projectionMatrix.fromArray(c.projectionMatrix);

  threeCam.position.set(c.eye[0], c.eye[1], c.eye[2]);
  threeCam.up.set(c.up[0], c.up[1], c.up[2]);

  threeCam.lookAt(new THREE.Vector3(c.center[0], c.center[1], c.center[2]));
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 3.1: Setting up the threejs camera
- Simple enough, but there is a problem: numeric precision
  - Rendering is done in world (meter) coordinate system
  - Absolute coordinates get very large, but relative distances are very small
  - WebGL coordinates are 32 bits floating point numbers, hence: poor precision<br><br>
  - Solution: local origins

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 3.1: Setting up the threejs camera
- Local origins
  - Pick some new origin close to your geometry to be rendered (e.g. center)
  - Store coordinates relative to this origin
  - When rendering, offset the camera to be at this new origin and render

```js
render(ctx: RenderContext) {
  var threeCam = new THREE.PerspectiveCamera();
  var c = ctx.camera;

  var o = this.localOrigin;

  threeCam.projectionMatrix.fromArray(c.projectionMatrix);

  threeCam.position.set(c.eye[0] - o[0], c.eye[1] - o[1], c.eye[2] - o[2]);
  threeCam.up.set(c.up[0], c.up[1], c.up[2]);

  threeCam.lookAt(new THREE.Vector3(c.center[0] - o[0], c.center[1] - o[1], c.center[2] - o[2]));
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 3.2: Setting up the threejs lighting
- Basic threejs lighting model similar to our lighting model
- Directional sun based lighting, ambient and diffuse colors

```js
render(ctx: RenderContext) {
  var direction = ctx.sunLight.direction;
  var diffuse = ctx.sunLight.diffuse;

  this.directionalLight.color.setRGB(diffuse.color[0], diffuse.color[1], diffuse.color[2]);
  this.directionalLight.intensity = diffuse.intensity;
  this.directionalLight.position.set(direction[0], direction[1], direction[2]);

  var ambient = context.sunLight.ambient;
  this.ambientLight.color.setRGB(ambient.color[0], ambient.color[1], ambient.color[2]);
  this.ambientLight.intensity = ambient.intensity;
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 3.3: Render!

```js
render(ctx: RenderContext) {
  this.threeRenderer.render(this.threeScene, this.threeCamera);
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application

- Step 4: Bonus, rendering the forest
- Use [`geometryEngine.buffer`](https://developers.arcgis.com/javascript/beta/api-reference/esri-geometry-geometryEngine.html#buffer) to generate a ring around the shore of the lake
- Use [`geometryEngine.densify`](https://developers.arcgis.com/javascript/beta/api-reference/esri-geometry-geometryEngine.html#densify) to get regularly spaced points around the shore
- [`GraphicsLayer`](https://developers.arcgis.com/javascript/beta/api-reference/esri-layers-GraphicsLayer.html) subclass to generate trees at vertices of polygon

<img src="./images/lake-outline-forest.svg"/>

---

<!-- .slide: data-background="images/bg-6.png" -->

## Show case: Building a custom 3D application &mdash; Summary

- Excited to see your ideas for customized 3D application rendering
- External rendering will be made available in 4.0 as a lab (for you to experiment with)
- We are planning to release helper utilities for integrating popular libraries
such as threejs on github.com/ESRI

<img height="300px" src="./images/external-rendering.png"/>

---

<!-- .slide: data-background="images/bg-4.png" -->

## Sneak preview: highlighting in 3D

---

<!-- .slide: data-background="images/bg-6.png" -->

## Sneak preview: highlighting in 3D

- API for highlighting features, graphics, objects, buildings, etc.
- May be used for selection, highlighting feature for which popup is shown, etc.
- **NOTE**: this is a preview, target is > 4.0

```ts
class LayerView {
  highlight(graphic | feature | query, highlightOptions);
}
```

---

<!-- .slide: data-background="images/bg-6.png" -->

## Sneak preview: highlighting in 3D

<br><br><br>

**Demo time!**

---

<!-- .slide: data-background="images/bg-4.png" -->

## Summary

- Get started with 3D GIS on the web, replace [`MapView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-MapView.html) with [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html)!
- Let us know about your applications, ideas, questions, issues
- More technical details on how we render globe, atmosphere, etc: _An Insight into Esri's 3D Engine in the Browser_ (10:30, Mesquite C, Simon Reinhard)
- Visit us in the showcase area still today (3D GIS and JS)

---

<!-- .slide: data-background="images/end.png" -->
