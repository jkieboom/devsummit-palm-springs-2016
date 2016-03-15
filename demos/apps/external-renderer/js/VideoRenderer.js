define([
  "esri/core/declare",
  "esri/views/3d/externalRenderers"
], function(
  declare,
  externalRenderers
) {
  var THREE = window.THREE;

  var VideoRenderer = declare([], {
    constructor: function(view, videoUrl, position, rotation) {
      var p = [position.x, position.y, position.z];

      this.view = view;
      this.video = video;
      this.origin = [0, 0, 0];
      this.rotation = rotation;

      this.origin = externalRenderers.toRenderCoordinates(view, p, 0, this.origin, 0, 1);

      var video = document.createElement("video");
      video.style.display = "none";

      video.autoplay = true;
      video.loop = true;
      video.src = videoUrl;

      video.pause();

      document.body.appendChild(video);

      this.videoElement = video;
    },

    destroy: function() {
      document.body.removeChild(this.videoElement);
      this.videoElement = null;
      this.playing = false;
    },

    play: function() {
      this.playing = true;
      this.videoElement.play();
    },

    pause: function() {
      this.playing = false;
      this.videoElement.pause();
    },

    intersects: function(x, y) {
      x = (x / this.view.width) * 2 - 1;
      y = ((this.view.height - y) / this.view.height) * 2 - 1;

      var mouse = new THREE.Vector2(x, y);
      var raycaster = new THREE.Raycaster();

      raycaster.setFromCamera(mouse, this.camera);
      
      return raycaster.intersectObject(this.videoMesh).length !== 0;
    },

    setup: function() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera();

      this._setupScene();

      this.playing = false;
    },

    _setupScene: function() {
      this.directionalLight = new THREE.DirectionalLight();
      this.scene.add(this.directionalLight);

      this.ambientLight = new THREE.AmbientLight();
      this.scene.add(this.ambientLight);

      var p1 = new THREE.BoxGeometry(1, 1, 20);
      var p2 = new THREE.BoxGeometry(1, 1, 20);

      var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
      
      var m1 = new THREE.Mesh(p1, material);
      var m2 = new THREE.Mesh(p2, material);

      m1.translateX(-15);
      m1.translateZ(10);

      m2.translateX(15);
      m2.translateZ(10);

      var videoGeometry = new THREE.BufferGeometry();

      var videoVertices = new Float32Array([
         15, 0, 5,
        -15, 0, 5,
        -15, 0, 20,

         15, 0, 5,
        -15, 0, 20,
         15, 0, 20
      ]);

      var videoUvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,

        0, 0,
        1, 1,
        0, 1
      ]);

      var videoBackside = new THREE.BufferGeometry();
      videoBackside.addAttribute("position", new THREE.BufferAttribute(new Float32Array([
         15, 0, 5,
        -15, 0, 20,
        -15, 0, 5,

         15, 0, 5,
         15, 0, 20,
        -15, 0, 20
      ]), 3));

      var videoBacksideMesh = new THREE.Mesh(videoBackside, new THREE.MeshBasicMaterial({ color: 0x000000 }));

      var videoTexture = new THREE.Texture(this.videoElement);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      var videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

      videoGeometry.addAttribute("position", new THREE.BufferAttribute(videoVertices, 3));
      videoGeometry.addAttribute("uv", new THREE.BufferAttribute(videoUvs, 2));

      var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
      var obj = new THREE.Object3D();

      obj.add(m1);
      obj.add(m2);
      obj.add(videoMesh);
      obj.add(videoBacksideMesh);

      obj.rotateZ(this.rotation);

      this.videoTexture = videoTexture;
      this.videoMesh = videoMesh;

      this.scene.add(obj);
    },

    render: function(context, renderer) {
      this._updateCamera(context);
      this._updateMaterial();
      this._updateLight(context);

      renderer.render(this.scene, this.camera);
    },

    _updateLight: function(context) {
      var direction = context.sunLight.direction;
      var diffuse = context.sunLight.diffuse;

      this.directionalLight.color.setRGB(diffuse.color[0], diffuse.color[1], diffuse.color[2]);
      this.directionalLight.intensity = diffuse.intensity;
      this.directionalLight.position.set(direction[0], direction[1], direction[2]);

      var ambient = context.sunLight.ambient;
      this.ambientLight.color.setRGB(ambient.color[0], ambient.color[1], ambient.color[2]);
      this.ambientLight.intensity = ambient.intensity;
    },

    _updateMaterial: function() {
      if (this.playing) {
        this.videoTexture.needsUpdate = true;
      }
    },

    _updateCamera: function(context) {
      var c = context.camera;

      this.camera.projectionMatrix.fromArray(c.projectionMatrix);

      var o = this.origin;

      this.camera.position.set(c.eye[0] - o[0], c.eye[1] - o[1], c.eye[2] - o[2]);
      this.camera.up.set(c.up[0], c.up[1], c.up[2]);
      this.camera.lookAt(new THREE.Vector3(c.center[0] - o[0], c.center[1] - o[1], c.center[2] - o[2]));
    },
  });

  return VideoRenderer;
});
