import VISUALEFFECTS from "../data/visualEffects.js";

export class VideoTexture {
  constructor(scene, options = {}) {
    if (!scene) {
      throw `Scene required for VideoTexture`;
    }

    this.scene  = scene;
    this.src    = null;
    this.key    = null;

    // Constants
    this.VISUAL_EFFECTS_ROOT_SRC = "https://neon-district-season-one.s3.amazonaws.com/visual-effects/V1/";

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
    this.unit     = {};

    if (options && typeof options === 'object') {
      for (let option in options) {
        if (options.hasOwnProperty(option) && this.hasOwnProperty(option)) {
          this[option] = options[option];
          console.log(option, this[option]);
        }
      }
    }

    // Create the element
    this.video = document.createElement('video');
    this.video.crossOrigin = "anonymous";

    // Now create itself
    this.createEffect();
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
    this.mesh.material.side = THREE.DoubleSide;
  }

  setLoop(loop) {
    this.video.loop = !!loop;
  }

  getKey() {
    return this.key;
  }

  setKey(key) {
    // Get parameters from key
    let params = this.getParametersFromKey(key);
    if (!params) {
      console.error("Could not determine parameters for effects key:", key);
      return;
    }

    // Save the key
    this.key = key;

    // Set all parameters
    this.setSize(params.Width, params.Height, params.Scale);
    this.setPosition(params["X Position"], params["Y Position"]);
    this.setRotation(params.Rotation);
    this.setOpacity(params.Opacity);
    this.setPlaybackRate(params.Speed);
    this.setFlipX(params["Flip X"]);
    this.setFlipY(params["Flip Y"]);
    this.setBlendMode(params.Blending);

    // Set the source
    let src = this.VISUAL_EFFECTS_ROOT_SRC + params.Filename;
    this.setSrc(src);
  }

  getParametersFromKey(key) {
    if (VISUALEFFECTS.V1.hasOwnProperty(key)) {
      return VISUALEFFECTS.V1[key];
    }
  }

  getSrc() {
    return this.src;
  }

  setSrc(src) {
    // Clear the current source
    this.video.pause();
    this.video.removeAttribute('src'); // empty source
    this.video.load();

    // Set the new source
    this.src = src;
    this.video.src = src;
    this.video.load();
  }

  play() {
    this.video.play();
  }

  setPosition(x_pos, y_pos) {
    this.x_pos = x_pos + this.getUnitMod('x_pos');
    this.y_pos = (y_pos + this.getUnitMod('y_pos') + 50) * this.getUnitMod('scale') - 50;
    this.mesh.position.set(this.x_pos, this.y_pos, 1);
  }

  setSize(width, height, scale = 1.0) {
    this.width = width * scale * this.getUnitMod('scale');
    this.height = height * scale * this.getUnitMod('scale');
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

  getUnitMod(key) {
    if (!this.hasOwnProperty('unit') || !this.unit.hasOwnProperty(key)) {
      if (key === 'scale') {
        return 1;
      } else if (key === 'flipX') {
        return false;
      } else {
        return 0;
      }
    }

    return this.unit[key];
  }

  setFlipX(flipX = false) {
    flipX = Boolean(flipX ^ this.getUnitMod('flipX'));

    if (flipX) {
      this.mesh.rotation.z = Math.PI * 3 / 2;
      //this.mesh.material.map.repeat.x = -1;
    } else {
      this.mesh.rotation.z = 0;
      //this.mesh.material.map.repeat.x = 1;
    }
  }

  setFlipY(flipY = false) {
    if (flipY) {
      this.mesh.rotation.z = Math.PI / 2;
      //this.mesh.material.map.repeat.y = - 1;
    } else {
      this.mesh.rotation.z = Math.PI * 3 / 2;
      //this.mesh.material.map.repeat.y = 1;
    }
  }
}
