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

    // We save some images to replace them if they were overwritten
    this.defaultImage = null;

    this.assetToSlotMapping = {
      //"HandsPistolGripB",
      "handsreleasegripb" : "HandsReleaseGripB",
      "handscarrygrip" : "HandsCarryGrip",
      "handspointgripb" : "HandsPointGripB",
      "handscradlegripb" : "HandsCradleGripB",
      "handspolegripb" : "HandsPoleGripB",
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
      "handstriggergrip" : "HandsTriggerGrip",
      "handsbackgrip" : "HandsBackGrip",
      "handsrestinggrip" : "HandsRestingGrip",
      "handsreleasegrip" : "HandsReleaseGrip",
      "handsbasegrip" : "HandsBaseGrip",
      "frontarm" : "Front Arm",
      "armaccess" : "Arm Access",
      "shoulders" : "Shoulders"
    };

    // The above needs to load BEFORE we can assetManager.get them
  }

  createMesh(skin, animation, xShift, yShift, flipX, scale) {
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

    /**
     * Custom Parameters
     **/
    this.skeletonMesh.assetLoadingCount = 0;

    return this.skeletonMesh;
  }

  isValidSlot(slot) {
    return ['head','body','arms','legs','weapon'].indexOf(slot) !== -1;
  }

  partBelongsToSlot(slot, part) {
    let parts = {
      "head" : ["headbot","hairextra","hair","headtop"],
      "body" : ["torsobg","torsobot","torsotop","shoulders"],
      "arms" : ["handsreleasegripb","handscarrygrip","handspointgripb","handscradlegripb","handspolegripb","handsbasegripb","handstriggergrip","handsbackgrip","handsrestinggrip","handsreleasegrip","handsbasegrip","backarm","armaccessb","frontarm","armaccess"],
      "legs" : ["backlegbot","shoesb","backlegtop","legaccessb","frontlegbot","shoes","frontlegtop","legaccess"]
    };

    if (parts.hasOwnProperty(slot)) {
      return parts[slot].indexOf(part) !== -1;
    }

    return false;
  }

  setAnimation(animation) {
    this.skeletonMesh.state.setAnimation(0, animation, true);
  }

  setSkin(skin) {
    this.skeletonMesh.skeleton.setSkinByName(skin);
  }

  loadGear(slot, jsonPath, _gender = 'female', _rarity = 'common') {
    if (!this.isValidSlot(slot) && slot !== 'all')
      throw `Invalid slot: ${slot}`;

    if (!jsonPath) {
      console.log("Notice: no JSON path provided.");
      return;
    }

    if (jsonPath.indexOf('http') !== 0) {
      jsonPath = "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/" + jsonPath + "/" + jsonPath + ".json";
    }

    this.loadJson(jsonPath, ((response) => {
      let config = JSON.parse(response);
      for (let gender in config) {
        if (gender !== _gender) continue;
        for (let rarity in config[gender]) {
          if (rarity !== _rarity) continue;
          for (let part in config[gender][rarity]) {
            // Only display parts that matter
            if (slot !== 'all' && !this.partBelongsToSlot(slot, part)) continue;

            // Wipe that area clean
            this.clearTexture(this.assetToSlotMapping[part]);

            // Avoid null values
            if (!config[gender][rarity][part]) {
              // If hands, restore
              if (part.indexOf('hand') !== -1) {
                this.validateImage("HandsBaseGrip");
                this.validateImage("HandsBaseGripB");
              }

              continue;
            }

            // Load the texture
            let url = jsonPath.substr(0, jsonPath.lastIndexOf('/')) + "/" + gender + "/" + rarity + "/" + part + ".png";
            this.loadTexture(url, this.assetToSlotMapping[part]);
          }
          break;
        }
        break;
      }
    }).bind(this))
  }

  loadFullOutfit(jsonPath, _gender = 'female', _rarity = 'common') {
    this.loadGear('all', jsonPath, _gender, _rarity);
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

  clearTexture(name) {
    if (!this.canvas) {
      return;
    }

    let slot = this.skeletonMesh.skeleton.findSlot(name);
    if (!slot) {
      console.error("Slot not found:", name);
      return;
    }

    if (!slot.attachment) {
      console.error("Slot attachment not found:", name);
      return;
    }

    // Assume same size
    this.ctx.clearRect(
      slot.attachment.region.x,
      slot.attachment.region.y,
      slot.attachment.region.width,
      slot.attachment.region.height
    );
  }

  validateImage(name) {
    if (!this.canvas || !this.defaultImage) {
      return;
    }

    let defaults = ["HandsBaseGripB","HandsBaseGrip"];
    if (defaults.indexOf(name) !== -1) {
      let slot = this.skeletonMesh.skeleton.findSlot(name);
      if (!slot || !slot.attachment) {
        return;
      }

      let imageData = this.ctx.getImageData(
        slot.attachment.region.x,
        slot.attachment.region.y,
        slot.attachment.region.width,
        slot.attachment.region.height
      );

      let totalNumber = 0;
      let numberOfZeroes = 0;
      for (let i = 0; i < imageData.data.length; i+=4) {
        totalNumber++;
        if (imageData.data[i+3] === 0) {
          numberOfZeroes++;
        }
      }

      if (numberOfZeroes / totalNumber > 0.95) {
        this.ctx.putImageData(
          this.defaultImage,
          0,
          0,
          slot.attachment.region.x,
          slot.attachment.region.y,
          slot.attachment.region.width,
          slot.attachment.region.height
        );
      }
    }

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

  loadTexture(path, name) {
    // Start loading
    this.skeletonMesh.assetLoadingCount++;

    // Get the image and create the canvas for this character
    this.createCanvas();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = (function() {
      this.skeletonMesh.assetLoadingCount--;

      let slot = this.skeletonMesh.skeleton.findSlot(name);
      if (!slot) {
        console.error("Slot not found:", name);
        return;
      }

      if (!slot.attachment) {
        console.error("Slot attachment not found:", name);
        return;
      }

      // Assume same size
      this.ctx.drawImage(
        img,
        slot.attachment.region.x,
        slot.attachment.region.y
      );

      // Wipe outline
      this.wipeOutline(slot);

      // Auto-resize
      /*
      this.ctx.drawImage(
        img,
        slot.attachment.region.x,
        slot.attachment.region.y,
        slot.attachment.region.width,
        slot.attachment.region.height
      );
      */

      /*
      // Auto-resize and auto-crop, causes issues

      let sourceRatio = img.width / img.height;
      let destRatio = slot.attachment.region.width / slot.attachment.region.height;

      let sourceHeight = img.height, sourceWidth = img.width;
      if (sourceRatio > destRatio) {
        sourceWidth = img.width * destRatio;
      } else if (sourceRatio < destRatio) {
        sourceHeight = img.height / destRatio;
      }

      this.ctx.drawImage(
        img,
        0,
        0,
        sourceWidth,
        sourceHeight,
        slot.attachment.region.x,
        slot.attachment.region.y,
        slot.attachment.region.width,
        slot.attachment.region.height
      );
      */

      this.validateImage(name);
      renderTexture.call(this);
    }).bind(this);
    img.onerror = (function() {
      this.skeletonMesh.assetLoadingCount--;
      renderTexture.call(this);
    }).bind(this)
    img.src = path;

    function renderTexture() {
      if (this.skeletonMesh.assetLoadingCount === 0) {
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
    }
  }

  createCanvas() {
    if (!this.canvas) {
      let img = this.skeletonMesh.skeleton.getAttachmentByName("Torso Base", "Torso Base").region.texture.getImage();
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0);
      this.defaultImage = this.ctx.getImageData(0, 0, img.width, img.height);
    }
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
