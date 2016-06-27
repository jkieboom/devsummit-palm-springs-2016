define([
  "esri/layers/GraphicsLayer",
  "esri/geometry/Polygon",
  "esri/geometry/Point",
  "esri/geometry/geometryEngine",
  "esri/Graphic",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/ObjectSymbol3DLayer"
], function(
  GraphicsLayer,
  Polygon, Point, geometryEngine,
  Graphic,
  PointSymbol3D,
  ObjectSymbol3DLayer
) {
  var ForestLayer = GraphicsLayer.createSubclass({
    classMetadata: {
      properties: {
        plantContour: {
          type: Polygon
        },

        seed: {
          value: 15
        },

        plantEvery: {
          value: 10
        },

        plantDistance: {
          value: 50
        },

        plantRadius: {
          value: 40
        },

        minimumDistance: {
          value: 0.5
        },

        plantInsideOnly: {
          type: Polygon
        }
      }
    },

    constructor: function() {
      var treeStyleUrl = "http://static.arcgis.com/arcgis/styleItems/RealisticTrees";

      var trees = [
        "AbiesBalsamea",
        "AlnusRubra",
        "CasuarinaEquisetifolia",
        "SequoiadendronGiganteum",
        "SequoiaSempervirens"
      ];

      this.treeSymbols = trees.map(function(treeName) {
        return new PointSymbol3D(new ObjectSymbol3DLayer({
          resource: {
            href: treeStyleUrl + "/web/resource/" + treeName + ".json"
          },

          width: 5,
          height: 15
        }));
      });
    },

    initialize: function() {
      this.watch(["seed", "plantEvery", "plantDistance", "plantRadius"], this.update.bind(this));

      this.update();
    },

    update: function() {
      this._currentSeed = this.seed;

      this.removeAll();

      var buffered = geometryEngine.densify(geometryEngine.buffer(this.plantContour, this.plantDistance), this.plantEvery);

      // Plant trees around buffered polygon
      var ring = buffered.rings[0];

      var pts = [];
      var i, j;

      for (i = 0; i < ring.length; i++) {
        var center = ring[i];
        var n = Math.round(this._random() * 2 + 1);

        for (j = 0; j < n; j++) {
          var dx = this._random() * this.plantRadius * 2 - this.plantRadius;
          var dy = this._random() * this.plantRadius * 2 - this.plantRadius;

          var pt = [center[0] + dx, center[1] + dy];

          if (!this.plantInsideOnly || this.plantInsideOnly.contains(new Point({
            x: pt[0],
            y: pt[1],
            spatialReference: this.plantContour.spatialReference
          }))) {
            pts.push([center[0] + dx, center[1] + dy]);
          }
        }
      }

      var pushing = true;
      var npushed = 0;

      while (pushing && npushed < 5) {
        pushing = false;

        for (i = 0; i < pts.length; i++) {
          for (j = 0; j < pts.length; j++) {
            if (i === j) {
              continue;
            }

            var d = [pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]];
            var dist = Math.sqrt(d[0] * d[0] + d[1] * d[1]);

            if (dist < this.minimumDistance) {
              var dd = (this.minimumDistance - dist) / 2;

              pts[i] = [pts[i][0] + d[0] / dist * dd, pts[i][1] - d[1] / dist * dd];
              pts[j] = [pts[j][0] - d[0] / dist * dd, pts[j][1] + d[1] / dist * dd];

              pushing = true;
            }
          }
        }

        npushed++;
      }

      for (i = 0; i < pts.length; i++) {
        var treeIndex = Math.round(this._random() * (this.treeSymbols.length - 1));

        var graphic = new Graphic({
          geometry: new Point({
            x: pts[i][0],
            y: pts[i][1],
            spatialReference: this.plantContour.spatialReference
          }),

          symbol: this.treeSymbols[treeIndex]
        });

        this.add(graphic);
      }
    },

    _random: function() {
      var x = Math.sin(this._currentSeed++) * 10000;
      return x - Math.floor(x);
    }
  });

  return ForestLayer;
});
