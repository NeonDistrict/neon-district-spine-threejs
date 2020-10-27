export class VideoTexture {
  constructor(scene, src = null, options = {}) {
    if (!scene) {
      throw `Scene required for VideoTexture`;
    }

    this.scene  = scene;
    this.src    = src || null;

    // Init & Defaults
    this.width    = 1;
    this.height   = 1;
    this.x_pos    = 0;
    this.y_pos    = 100;
    this.loop     = true;
    this.blend    = "NormalBlending";
    this.rotation = 0;
    this.opacity  = 1.0;
    this.speed    = 1.0;
    this.scale    = 1.0;
    this.flipX    = 1.0;
    this.flipY    = 1.0;

    if (options && typeof options === 'object') {
      for (let option in options) {
        if (options.hasOwnProperty(option) && this.hasOwnProperty(option)) {
          this[option] = options[option];
        }
      }
    }

    // Create the element
    this.video = document.createElement('video');
  }

  createEffect() {
    this.texture = new THREE.VideoTexture(this.video);
    this.texture.format = THREE.RGBAFormat;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
    });
    material.blending = THREE[this.blend];

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.mesh.position.set(this.x_pos, this.y_pos, 1);
    this.mesh.scale.set(this.width, this.height, 1);
    this.mesh.material.map.wrapS = THREE.RepeatWrapping;
    this.mesh.material.map.wrapT = THREE.RepeatWrapping;
  }

  setLoop(loop) {
    this.video.loop = !!loop;
  }

  getSrc() {
    return this.src;
  }

  setSrc(src) {
    this.src = src;
    this.video.src = src;
    this.video.load();
  }

  play() {
    this.video.play();
  }

  setPosition(x_pos, y_pos) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.mesh.position.set(x_pos, y_pos, 1);
  }

  setSize(width, height, scale = 1.0) {
    this.width = width * scale;
    this.height = height * scale;
    this.mesh.scale.set(this.width, this.height, 1);
  }

  setRotation(rot = 0.0) {
    this.mesh.rotation.z = rot;
  }

  setOpacity(opacity = 1.0) {
    this.mesh.material.opacity = opacity;
  }

  setPlaybackRate(rate = 1.0) {
    this.video.playbackRate = rate;
  }

  setBlendMode(blend = 'NormalBlending') {
    let validBlendModes = [
      "NoBlending",
      "NormalBlending",
      "AdditiveBlending",
      "SubtractiveBlending",
      "MultiplyBlending"
    ];

    if (THREE.hasOwnProperty(blend) && validBlendModes.indexOf(blend) !== -1) {
      this.mesh.material.blending = THREE[blend];
    }
  }

  setFlipX(flipX = false) {
    if (flipX) {
      this.mesh.material.map.repeat.x = - 1;
    } else {
      this.mesh.material.map.repeat.x = 1;
    }
  }

  setFlipY(flipY = false) {
    if (flipY) {
      this.mesh.material.map.repeat.y = - 1;
    } else {
      this.mesh.material.map.repeat.y = 1;
    }
  }
}
