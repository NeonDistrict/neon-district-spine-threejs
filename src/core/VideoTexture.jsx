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
    this.VISUAL_EFFECTS_ROOT_SRC = "https://neon-district-season-one.s3.amazonaws.com/visual-effects/V1_reformat/";

    // Init & Defaults
    this.width    = 1;
    this.height   = 1;
    this.x_pos    = 0;
    this.y_pos    = 100;
    this.loop     = false;
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
        }
      }
    }

    // Create the element
    this.video = document.createElement('video');
    this.video.autoplay = false;
    this.video.crossOrigin = "anonymous";
    this.video.onended = (() => {
      // Restart current video, pause
      this.video.pause();
      this.video.currentTime = 0;
    }).bind(this);

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

    // Handle any prior videos
    this.video.pause();

    // Set all parameters
    // Note, set orientation prior to rotation
    this.setSize(params.Width, params.Height, params.Scale);
    this.setPosition(params["X Position"], params["Y Position"]);
    this.setOrientation(params["Flip X"], params["Flip Y"]);
    this.setRotation(params.Rotation);
    this.setOpacity(params.Opacity);
    this.setBlendMode(params.Blending);

    // Set the source
    let src = this.VISUAL_EFFECTS_ROOT_SRC + params.Filename;
    this.setSrc(src);
    this.setPlaybackRate(params.Speed);
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
    // Set the new source
    this.src = src;
    this.video.src = src;
    this.video.load();
  }

  play() {
    this.video.play();
  }

  setPosition(x_pos, y_pos) {
    this.x_pos = this.getUnitMod('x_pos') + x_pos * this.getUnitMod('scale');
    this.y_pos = this.getUnitMod('y_pos') + y_pos * this.getUnitMod('scale');

    // X position needs to be offset to the right if we're flipping X
    if (this.unit.hasOwnProperty('flipX') && this.unit.flipX) {
      this.x_pos = this.getUnitMod('x_pos') - x_pos * this.getUnitMod('scale');
    }

    this.mesh.position.set(this.x_pos, this.y_pos, 1);
  }

  setSize(width, height, scale = 1.0) {
    this.width = width * scale * this.getUnitMod('scale');
    this.height = height * scale * this.getUnitMod('scale');
    this.mesh.scale.set(this.width, this.height, 1);
  }

  setRotation(rot = 0.0) {
    this.mesh.rotation.z -= rot;
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
      } else if (key === 'flipX' || key === 'flipY') {
        return false;
      } else {
        return 0;
      }
    }

    return this.unit[key];
  }

  setOrientation(flipX = false, flipY = false) {
    flipX = Boolean(flipX ^ this.getUnitMod('flipX'));
    flipY = Boolean(flipY ^ this.getUnitMod('flipY'));

    /*
    if (flipX) {
      this.mesh.material.map.repeat.x = -1;
    } else {
      this.mesh.material.map.repeat.x = 1;
    }

    if (flipY) {
      this.mesh.material.map.repeat.y = - 1;
    } else {
      this.mesh.material.map.repeat.y = 1;
    }
    */

    if (flipX && flipY) {
      this.mesh.rotation.z = Math.PI; // Rotate X by 180 degrees
      this.mesh.rotation.x = 0; // Don't flip Y, already accounted for
    } else if (flipX && !flipY) {
      // Done
      this.mesh.rotation.z = Math.PI; // Rotate X by 180 degrees
      this.mesh.rotation.x = Math.PI; // Flip Y so that top stays top
    } else if (!flipX && flipY) {
      this.mesh.rotation.z = 0;
      this.mesh.rotation.x = Math.PI; // Flip Y
    } else {
      // Done
      this.mesh.rotation.z = 0; // Do not rotate X at all
      this.mesh.rotation.x = 0; // No need to flip to account for anything
    }
  }
}
