export class VideoTexture {
  constructor(scene, src = null, options = {}) {
    if (!scene) {
      throw `Scene required for VideoTexture`;
    }

    this.scene  = scene;
    this.src    = src || null;

    // Init & Defaults
    this.width  = 1;
    this.height = 1;
    this.x_pos  = 0;
    this.y_pos  = 100;
    this.loop   = true;

    if (options && typeof options === 'object') {
      if (options.hasOwnProperty('width')) {
        this.width = options.width;
      }

      if (options.hasOwnProperty('height')) {
        this.height = options.height;
      }

      if (options.hasOwnProperty('x_pos')) {
        this.x_pos = options.x_pos;
      }

      if (options.hasOwnProperty('y_pos')) {
        this.y_pos = options.y_pos;
      }

      if (options.hasOwnProperty('loop')) {
        this.loop = options.loop;
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
      transparent: true
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.mesh.position.set(this.x_pos, this.y_pos, 1);
    this.mesh.scale.set(this.width, this.height, 1);
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

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.mesh.scale.set(width, height, 1);
  }
}
