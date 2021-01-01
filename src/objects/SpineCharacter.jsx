export class SpineCharacter {

  // Resources
  // https://rawgit.com/EsotericSoftware/spine-runtimes/3.8/spine-ts/webgl/demos/skins.js
  // http://en.esotericsoftware.com/spine-runtime-skins
  // http://esotericsoftware.com/forum/spine-ts-change-region-on-an-attachment-during-runtime-14299
  // https://www.html5gamedevs.com/topic/45964-esoteric-spine-changing-art-of-a-slot-with-multiple-attachment-regions/

  constructor(assetManager, skeletonFile, identifier, atlasFile) {
    this.skeletonFile = skeletonFile;

    if (atlasFile) {
      this.atlasFile = atlasFile;
    } else {
      this.atlasFile = this.skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas") + "?" + identifier;
    }

    console.log("Loading skeletonFile", skeletonFile, "for", identifier);
    console.log("Loading atlasFile", this.atlasFile, "for", identifier);

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
      "backlegtop" : "Back Leg Top",
      "shoesb" : "ShoesB",
      "legaccessb" : "Leg AccessB",
      "torsobot" : "Torsobot",
      "frontlegbot" : "Front LegBot",
      "frontlegtop" : "Front LegTop",
      "shoes" : "Shoes",
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

    this.parts = {
      "head" : ["headbot","hairextra","hair","headtop"],
      "body" : ["torsobg","torsobot","torsotop","shoulders"],
      "arms" : ["handsreleasegripb","handscarrygrip","handspointgripb","handscradlegripb","handspolegripb","handsbasegripb","handstriggergrip","handsbackgrip","handsrestinggrip","handsreleasegrip","handsbasegrip","backarm","armaccessb","frontarm","armaccess"],
      "legs" : ["backlegbot","shoesb","backlegtop","legaccessb","frontlegbot","shoes","frontlegtop","legaccess"],
      "all"  : ["backarm","torsobg","handsbasegripb","armaccessb","backlegbot","shoesb","backlegtop","legaccessb","torsobot","frontlegbot","shoes","frontlegtop","torsotop","legaccess","headbot","hairextra","hair","headtop","frontarm","handsbasegrip","armaccess","shoulders"]
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
    if (this.parts.hasOwnProperty(slot)) {
      return this.parts[slot].indexOf(part) !== -1;
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
      console.log("Notice: no JSON path provided -- clearing part.");

      // Clear out this part
      if (this.parts.hasOwnProperty(slot)) {
        for (let part of this.parts[slot]) {
          this.clearTexture(this.assetToSlotMapping[part]);

          if (part.indexOf('hand') !== -1) {
            this.validateImage("HandsBaseGrip");
            this.validateImage("HandsBaseGripB");
          }
        }
      }

      this.renderTexture();

      return;
    }

    if (jsonPath.indexOf('http') !== 0) {
      //jsonPath = "assetOutput/" + jsonPath + "/" + jsonPath + ".json";
      jsonPath = "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/" + jsonPath + "/" + jsonPath + ".json";
    }

    this.loadJson(jsonPath, ((response) => {
      let config = JSON.parse(response);
      for (let gender in config) {
        if (gender !== _gender) continue;
        for (let rarity in config[gender]) {
          if (rarity !== _rarity) continue;

          if (!this.parts.hasOwnProperty(slot)) {
            continue;
          }

          // Here, we should be rendering in order as defined by parts
          for (let part of this.parts[slot]) {
            if (!config[gender][rarity].hasOwnProperty(part)) {
              continue;
            }

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

      // First, hands must always be underlying the applied image
      if (["HandsBaseGrip", "HandsBaseGripB"].indexOf(name) !== -1) {
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
      this.renderTexture.call(this);
    }).bind(this);
    img.onerror = (function() {
      this.skeletonMesh.assetLoadingCount--;
      this.renderTexture.call(this);
    }).bind(this)
    img.src = path;
  }

  renderTexture() {
    if (this.skeletonMesh.assetLoadingCount === 0) {
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
    //console.log("Debug turned off for SpineCharacter");
    /*
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
    let obj = {};
    let attachments = this.skeletonMesh.skeleton.skin.getAttachments();
    for (let attachment of attachments) {
      if (!attachment.attachment || !attachment.attachment.region) continue;
      obj[attachment.name] = {
        x      : attachment.attachment.region.x,
        y      : attachment.attachment.region.y,
        height : attachment.attachment.region.height,
        width  : attachment.attachment.region.width,
      };
    }
    console.log(JSON.stringify(obj));

    for (let slot of this.skeletonMesh.skeleton.slots) {
      console.log("Slot Name:", slot.data.name);
    }
    */

    //console.log(this.skeletonMesh)
    //debugger;

    // Updating the Spine associated files
    //this.listAttachments();
    //this.listAnimations();

    /*
    let obj = {};
    let attachments = this.skeletonMesh.skeleton.skin.getAttachments();
    for (let attachment of attachments) {
      if (!attachment.attachment || !attachment.attachment.region) continue;
      obj[attachment.name] = {
        x      : attachment.attachment.region.x,
        y      : attachment.attachment.region.y,
        height : attachment.attachment.region.height,
        width  : attachment.attachment.region.width,
      };
    }
    console.log(JSON.stringify(obj));
    */

  }

  listAttachments() {
    let obj = {}, all_obj = {};
    let skins = this.skeletonMesh.skeleton.data.skins;
    for (let skin of skins) {
      if (!skin.attachments || typeof skin.name !== 'string') continue;
      obj[skin.name.toLowerCase()] = {};
      for (let attachment_objects of skin.attachments) {
        for (let key in attachment_objects) {
          let attachment = attachment_objects[key];
          obj[skin.name.toLowerCase()][key] = {
            x      : attachment.region.x,
            y      : attachment.region.y,
            height : attachment.region.height,
            width  : attachment.region.width,
          }
          all_obj[key] = {
            x      : attachment.region.x,
            y      : attachment.region.y,
            height : attachment.region.height,
            width  : attachment.region.width,
          };
        }
      }
    }
    console.log(JSON.stringify(obj));
    console.log(JSON.stringify(all_obj));
  }

  listAnimations() {
    let animations = {}, animationList = [];
    for (let animation of this.skeletonData.animations) {
      animationList.push(animation.name);

      if (animation.name.indexOf('[') === 0) {
        continue;
      }

      let re = new RegExp(`^([^\_]*)_(.*)$`);
      let matches = re.exec(animation.name);
      if (!matches || matches.length < 3) {
        console.error("Could not parse animation:", animation.name);
        continue;
      }

      let animationName = matches[1];
      let animationType = matches[2];
      //let animationNumber = matches[3];

      if (!animations.hasOwnProperty(animationName)) {
        animations[animationName] = {};
      }

      let parsedType = this.parseAnimationType(animationType);
      if (!parsedType) {
        console.error("Could not parse animation type:", animationType);
        continue;
      }

      if (!animations[animationName].hasOwnProperty(parsedType)) {
        animations[animationName][parsedType] = animation.name;
      }
    }
    console.log(JSON.stringify(animationList));
    console.log(JSON.stringify(animations));
  }

  parseAnimationType(type) {
    if (type.indexOf('PoweredAtk') !== -1) {
      return 'pwdAtk';
    } else if (type.indexOf('Atk') !== -1) {
      return 'baseAtk';
    } else if (type.indexOf('Hit') !== -1) {
      return 'baseHit';
    } else if (type.indexOf('Idle') !== -1) {
      return 'baseIdle';
    } else if (type.indexOf('Buff') !== -1) {
      return 'buff';
    } else if (type.indexOf('Death') !== -1) {
      return 'death';
    } else if (type.indexOf('Heal') !== -1) {
      return 'heal';
    } else if (type.indexOf('Rez') !== -1) {
      return 'rez';
    } else if (type.indexOf('Taunt') !== -1) {
      return 'taunt';
    } else {
      return null;
    }
  }
}
