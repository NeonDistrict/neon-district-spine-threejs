export class SpineCharacter {

  // Resources
  // https://rawgit.com/EsotericSoftware/spine-runtimes/3.8/spine-ts/webgl/demos/skins.js
  // http://en.esotericsoftware.com/spine-runtime-skins
  // http://esotericsoftware.com/forum/spine-ts-change-region-on-an-attachment-during-runtime-14299
  // https://www.html5gamedevs.com/topic/45964-esoteric-spine-changing-art-of-a-slot-with-multiple-attachment-regions/

  constructor(assetManager, skeletonFile, identifier) {
    this.skeletonFile = skeletonFile;
    this.atlasFile = this.skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas");
    this.atlasFile += "?" + identifier;

    this.assetManager = assetManager;
    this.assetManager.loadText(this.skeletonFile);
    this.assetManager.loadTextureAtlas(this.atlasFile);

    this.assetToSlotMapping = {
      "handsbasegripb" : "HandsBaseGripB",
      "backarm" : "Back Arm",
      "armaccessb" : "Arm AccessB",
      "torsobg" : "TorsoBG",
      "backlegbot" : "Back Leg Bot",
      "shoesb" : "ShoesB",
      "backlegtop" : "Back Leg Top",
      "legaccessb" : "Leg AccessB",
      "torsobot" : "Torsobot",
      "frontlegbot" : "Front LegBot",
      "shoes" : "Shoes",
      "frontlegtop" : "Front LegTop",
      "legaccess" : "Leg Access",
      "torsotop" : "Torsotop",
      "headbot" : "HeadBot",
      "hairextra" : "Hair Extra",
      "hair" : "Hair",
      "headtop" : "HeadTop",
      "frontarm" : "Front Arm",
      "armaccess" : "Arm Access",
      "handsbasegrip" : "HandsBaseGrip",
      "shoulders" : "Shoulders"
    };

    // The above needs to load BEFORE we can assetManager.get them
  }

  createMesh(skin, animation, xShift, yShift, scale, flipX) {
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

    this.skeletonMesh.state.setAnimation(0, animation, true);
    this.skeletonMesh.skeleton.setSkinByName(skin);
    this.skeletonMesh.skeleton.scaleX = (flipX) ? -1 : 1;
    this.skeletonMesh.skeleton.x = xShift;
    this.skeletonMesh.skeleton.y = yShift;

    return this.skeletonMesh;
  }

  loadFullOutfit(jsonPath, _gender = 'female', _rarity = 'common') {
    this.loadJson(jsonPath, ((response) => {
      let config = JSON.parse(response);
      for (let gender in config) {
        if (gender !== _gender) continue;
        for (let rarity in config[gender]) {
          if (rarity !== _rarity) continue;
          for (let part in config[gender][rarity]) {
            if (!config[gender][rarity][part]) continue;
            let url = jsonPath.substr(0, jsonPath.lastIndexOf('/')) + "/" + gender + "/" + rarity + "/" + part + ".png";
            this.loadTexture(url, this.assetToSlotMapping[part]);
          }
          break;
        }
        break;
      }
    }).bind(this))
  }

  loadJson(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback.call(this, xhr.response);
      }
    }

    xhr.open('GET', url, true);
    xhr.send('');
  }

  loadTexture(path, name) {
    // Get the image and create the canvas for this character
    this.createCanvas();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = (function() {
      let slot = this.skeletonMesh.skeleton.findSlot(name);
      if (!slot) {
        console.error("Slot not found:", name);
        return;
      }

      if (!slot.attachment) {
        console.error("Slot attachment not found:", name);
        return;
      }

      this.ctx.drawImage(img, slot.attachment.region.x, slot.attachment.region.y);
      let spineTexture = new spine.threejs.ThreeJsTexture(this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height));
      slot.attachment.region.texture = spineTexture;
    }).bind(this);
    img.src = path;
  }

  createCanvas() {
    if (!this.canvas) {
      let img = this.skeletonMesh.skeleton.getAttachmentByName("Torso Base", "Torso Base").region.texture.getImage();
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0);
    }
  }

  loadTextureImageTest(path) {
    // Get the image and create the canvas for this character
    this.createCanvas();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = (function() {
      this.ctx.drawImage(img, 893, 3518);
      let spineTexture = new spine.threejs.ThreeJsTexture(this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height));
      this.skeletonMesh.skeleton.getAttachmentByName("Torso Base", "Torso Base").region.texture = spineTexture;
    }).bind(this);
    img.src = path;
  }

  debug() {
    let atlas = this.atlasLoader.atlas;
    for (let region of atlas.regions) {
      console.log("Region Name:", region.name);
    }

    for (let animation of this.skeletonData.animations) {
      console.log("Animation Name:", animation.name);
    }

    let skins = this.skeletonMesh.skeleton.data.skins;
    for (let skin of skins) {
      console.log("Skin Name:", skin.name);
    }

    let attachments = this.skeletonMesh.skeleton.skin.getAttachments();
    for (let attachment of attachments) {
      console.log("Attachment Name:", attachment.name);
    }

    for (let slot of this.skeletonMesh.skeleton.slots) {
      console.log("Slot Name:", slot.data.name);
    }
  }
}
