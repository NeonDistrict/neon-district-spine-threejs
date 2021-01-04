export class SpineDrone {

  constructor(assetManager, skeletonFile, drone, rarity, identifier) {
    this.skeletonFile = skeletonFile;
    this.atlasFile = this.skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas") + "?" + identifier;

    this.assetManager = assetManager;
    this.assetManager.loadText(this.skeletonFile);
    this.assetManager.loadTextureAtlas(this.atlasFile);

    this.drone = drone;
    this.rarity = rarity;

    // We save some images to replace them if they were overwritten
    this.DRONE_ATTACHMENT = "Drone/Sml1H/Blkpartnerrevelatorz17/001_Blkpartnerrevelatorz17DroneSml1H_Ultrarare";

    // The above needs to load BEFORE we can assetManager.get them
  }

  setDrone(drone, rarity) {
    this.drone = drone;
    this.rarity = rarity;
  }

  createMesh(xShift, yShift, flipX, scale) {
    // Load the texture atlas using name.atlas and name.png from the AssetManager.
    // The function passed to TextureAtlas is used to resolve relative paths.
    this.atlas = this.assetManager.get(this.atlasFile);
    this.skeleton = this.assetManager.get(this.skeletonFile);

    // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
    this.atlasLoader = new spine.AtlasAttachmentLoader(this.atlas);

    // Create a SkeletonJson instance for parsing the .json file.
    let skeletonJson = new spine.SkeletonJson(this.atlasLoader);

    // Set the scale to apply during parsing, parse the file, and create a new skeleton.
    skeletonJson.scale = scale;
    this.skeletonData = skeletonJson.readSkeletonData(this.skeleton);

    // Create a SkeletonMesh from the data and attach it to the scene
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData, function(parameters) {
      parameters.depthTest = false;
    });

    this.skeletonMesh.state.setAnimation(0, 'DroneSml_Idle_001', true);
    this.skeletonMesh.skeleton.setSkinByName('default');
    this.skeletonMesh.skeleton.scaleX = (flipX) ? -1 : 1;
    this.skeletonMesh.skeleton.x = xShift;
    this.skeletonMesh.skeleton.y = yShift;

    return this.skeletonMesh;
  }

  setAnimation(animation) {
    this.skeletonMesh.state.setAnimation(0, animation, true);
  }

  loadDroneImage() {
    // Load the texture
    let path = "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/" + this.drone + "/" + this.rarity + ".png";

    // Get the image and create the canvas for this character
    this.createCanvas();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = (function() {
      let slot = this.skeletonMesh.skeleton.findSlot(this.DRONE_ATTACHMENT);
      if (!slot) {
        console.error("Slot not found:", this.DRONE_ATTACHMENT);
        return;
      }

      if (!slot.attachment) {
        console.error("Slot attachment not found:", this.DRONE_ATTACHMENT);
        return;
      }

      // Resize appropriately
      let sourceRatio = img.width / img.height;
      let destRatio = slot.attachment.region.width / slot.attachment.region.height;

      let sourceHeight = img.height, sourceWidth = img.width;
      if (sourceRatio < destRatio) {
        sourceWidth = img.width * destRatio;
      } else if (sourceRatio > destRatio) {
        sourceHeight = img.height / destRatio;
      }

      this.ctx.drawImage(
        img,
        4,
        4,
        sourceWidth - 8,
        sourceHeight - 8,
        slot.attachment.region.x,
        slot.attachment.region.y,
        slot.attachment.region.width,
        slot.attachment.region.height
      );

      // Wipe outline & Render
      this.wipeOutline(slot);
      this.renderTexture();

    }).bind(this);
    img.onerror = (function() {
      console.error("Could not load Drone image:", path);
    }).bind(this)
    img.src = path;
  }

  clearTexture() {
    if (!this.canvas) {
      return;
    }

    // Assume same size
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  wipeOutline(slot) {
    this.ctx.clearRect(
      slot.attachment.region.x,
      slot.attachment.region.y,
      slot.attachment.region.width,
      2
    );

    this.ctx.clearRect(
      slot.attachment.region.x,
      slot.attachment.region.y,
      2,
      slot.attachment.region.height
    );

    this.ctx.clearRect(
      slot.attachment.region.x + slot.attachment.region.width - 2,
      slot.attachment.region.y,
      2,
      slot.attachment.region.height
    );

    this.ctx.clearRect(
      slot.attachment.region.x,
      slot.attachment.region.y + slot.attachment.region.height - 2,
      slot.attachment.region.width,
      2
    );
  }

  renderTexture() {
    if (!this.ctx) return;

    let spineTexture = new spine.threejs.ThreeJsTexture(
      this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    );

    // NOTICE: THE DEFAULT EXPORT FROM SPINE IS LINEAR,LINEAR
    spineTexture.setFilters(spine.TextureFilter.MipMapLinearNearest, spine.TextureFilter.Linear);

    for (let _slot of this.skeletonMesh.skeleton.slots) {
      if (!_slot.attachment) continue;
      _slot.attachment.region.texture = spineTexture;
    }
  }

  createCanvas() {
    if (!this.canvas) {
      let img = this.skeletonMesh.skeleton.getAttachmentByName(this.DRONE_ATTACHMENT, this.DRONE_ATTACHMENT).region.texture.getImage();
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = img.width;
      this.canvas.height = img.height;
    }
  }
}
