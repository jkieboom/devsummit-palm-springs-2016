define([
  "require",
  "./LakeRenderer",
  "./ForestLayer",
  "./VideoRenderer",
  "./THREERenderer",

  "./data/pointsWithElevation",

  "esri/Map",
  "esri/config",

  "esri/core/Accessor",
  "esri/core/promiseUtils",

  "esri/geometry/Point",
  "esri/geometry/Polygon",
  "esri/geometry/SpatialReference",

  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",

  "esri/views/SceneView"
], function(
  require,
  LakeRenderer, ForestLayer, VideoRenderer, THREERenderer,
  pointsWithElevation,
  Map, esriConfig,
  Accessor, promiseUtils,
  Point, Polygon, SpatialReference,
  QueryTask, Query,
  SceneView
) {
  var ExternalRendererApp = Accessor.createSubclass({
    properties: {
      simulatedWaterEnabled: {
        value: true
      },

      waterVelocity: {
        value: 0.2
      },

      waveSize: {
        value: 0.2
      },

      ready: {
        value: false
      },

      readyCallback: {}
    },

    initialize: function() {
      esriConfig.geometryServiceUrl = "//utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer";

      this.view = new SceneView({
        map: new Map({
          basemap: "satellite",
          ground: "world-elevation"
        }),

        ui: {
          components: ["attribution"]
        },

        viewingMode: "local",

        clippingArea: {
          xmin: -17726316.83237367,
          ymin: 2105891.749821895,
          xmax: -6004974.011198254,
          ymax: 11146460.423022442,
          spatialReference: 102100
        }
      });

      this.view.on("click", this._onViewClick.bind(this));

      this._setupLakes();

      this.view.then(function() {
        this.view._stage.setRenderParams({ idleSuspend: false });
        this._activateLake(this.lakes[0]);
      }.bind(this));
    },

    _activateLake: function(lake) {
      if (this.currentLake) {
        this.view.map.remove(this.currentLake.layer);

        if (this.threeRenderer) {
          this.threeRenderer.destroy();
          this.threeRenderer = null;
        }

        if (this.currentLake.renderer) {
          this.currentLake.renderer.destroy();
          this.currentLake.renderer = null;
        }

        if (this.currentVideoRenderer) {
          this.currentVideoRenderer.destroy();
          this.currentVideoRenderer = null;
        }
      }

      var task = new QueryTask({
        url: "https://vafwis.dgif.virginia.gov/arcgis/rest/services/Public/Lakes/FeatureServer/1"
      });

      var query = new Query();

      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "NAME='" + lake.name + "'";
      query.outSpatialReference = this.view.spatialReference;

      this.view.goTo(lake.cameras[0]);

      var queryPromise = task.execute(query);

      this.threeRenderer = new THREERenderer(this.view);

      if (lake.video) {
        this.currentVideoRenderer = new VideoRenderer(this.view, lake.video.url, lake.video.position, lake.video.rotation);
        this.threeRenderer.add(this.currentVideoRenderer);
      }

      var info = document.getElementById("lake-information");
      info.innerHTML = "<h1>" + lake.name + "</h1><p>" + lake.description + "</p>";

      var lakeFeature;
      this.currentLake = {};

      queryPromise
        .then(function(results) {
          lakeFeature = results.features[0];

          this.currentLake.forest = new ForestLayer({
            plantContour: lakeFeature.geometry.clone(),
            plantInsideOnly: lake.treeConstraint
          });

          this.view.map.add(this.currentLake.forest);

          // Wait some time for the terrain to load in
          return promiseUtils.after(3000);
        }.bind(this))
        
        .then(function() {
          this.currentLake.renderer = this._createLakeRenderer(lake, lakeFeature);
          this.threeRenderer.add(this.currentLake.renderer);

          setTimeout(function() {
            var elem = document.getElementById("splash");
            elem.classList.add("hide");

            this.view.goTo(lake.cameras[1]);

            setTimeout(function() {
              this.readyCallback();
            }.bind(this), 450);
          }.bind(this), 1000);
        }.bind(this));
    },

    _createLakeRenderer: function(lake, lakeFeature) {
      var elevationSampler = function(x, y, zoff) {
        // Note: in the future we will expose a way to sample the elevation
        // directly from the elevation service, for now we have the elevation
        // data hard-coded in place (since the feature service does not have z-values)

        var closestElev;
        var closestDistance;

        // simply use elevation from closest point
        for (var i = 1; i < pointsWithElevation.length; i++) {
          var pt = pointsWithElevation[i];
          var dx = pt[0] - x;
          var dy = pt[1] - y;

          var d = Math.sqrt(dx * dx + dy * dy);

          if (closestElev === undefined || d < closestDistance) {
            closestDistance = d;
            closestElev = pt[2];
          }
        }

        return closestElev + (zoff || 0);
      };

      return new LakeRenderer(this.view, lakeFeature.geometry.clone(), elevationSampler);
    },

    _setupLakes: function() {
      this.lakes = [{
        name: "Clifton Forge Reservoir",
        treeConstraint: new Polygon({
          rings: [[
            [-8887992.197828185, 4558498.812739541],
            [-8887600.761285178, 4558113.885218928],
            [-8887726.769470854, 4558061.553485904],
            [-8888151.836018862, 4558381.589409679],
            [-8887992.197828185, 4558498.812739541]
          ]],

          spatialReference: SpatialReference.WebMercator
        }),

        description: "Clifton Forge Reservoir is a 9 acre impoundment that serves as the water supply for the town of Clifton Forge. It is nestled in a gorge above the town and is surrounded by National Forest land. Although it is stocked with trout eight times a year, the lake is also provides good largemouth bass and channel catfish angling. Panfish are in short supply, but efforts are being made to reestablish sunfish stocks (see regulations for fishing hours, license requirements and limits).",

        video: {
          position: new Point({
            x: -8887669.020522693,
            y: 4558130.969099816,
            z: 427.3622851346304,

            spatialReference: SpatialReference.WebMercator
          }),

          rotation: -0.6,

          url: require.toUrl("./movies/webscene-authoring.mp4")
        },

        cameras: [{
          position: {
            x: -8886956.003525361,
            y: 4558148.304863748,
            z: 691.7899877827357,

            spatialReference: SpatialReference.WebMercator
          },

          heading: 273.6752209851488,
          tilt: 72.0111159485314
        }, {
          position: {
            x: -8887539.262131624,
            y: 4558169.905272015,
            z: 439.8383293038204,

            spatialReference: SpatialReference.WebMercator
          },

          heading: 255.55999999629358,
          tilt: 85.46000000025376
        }]
      }];
    },

    _simulatedWaterEnabledSetter: function(v) {
      if (this.currentLake) {
        this.currentLake.renderer.enabled = !!v;
      }

      return !!v;
    },

    _waterVelocitySetter: function(v) {
      if (this.currentLake) {
        this.currentLake.renderer.velocity = v;
      }

      return v;
    },

    _waveSizeSetter: function(v) {
      if (this.currentLake) {
        this.currentLake.renderer.waveSize = v;
      }

      return v;
    },

    _onViewClick: function(ev) {
      var vr = this.currentVideoRenderer;

      if (!vr) {
        return;
      }

      if (vr.intersects(ev.screenPoint.x, ev.screenPoint.y)) {
        if (vr.playing) {
          vr.pause();
        } else {
          vr.play();
        }
      }
    }
  });

  return ExternalRendererApp;
});
