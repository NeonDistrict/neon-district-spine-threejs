const LOADING_IDENTIFIER = "loading...";

export class ImageCache {

  constructor() {
    this.imageLinks = {
      'ABILITY'       : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Hack.png",
      'ATTACK'        : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Attack.png",
      'EFFECT'        : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Effect.png",
      'INTERACT'      : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Interact.png",
      'TAUNT'         : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Taunt.png",
      'SHIELD'        : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Shield.png",
      'POISON'        : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Poison.png",
      'REGENERATE'    : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Regeneration.png",
      'COUNTERATTACK' : "https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Counterattack.png",
      'NDLOGO'        : "https://neon-district-season-one.s3.amazonaws.com/assets/nd-logo.png"
    };
    if (!window.ndCombatImageCache) {
      window.ndCombatImageCache = {};
    }
  }

  pullImages() {
    for (let _key in this.imageLinks) {
      if (window.ndCombatImageCache.hasOwnProperty(_key)) {
        continue;
      }

      window.ndCombatImageCache[_key] = LOADING_IDENTIFIER;

      this._pullImage(_key, this.imageLinks[_key]);
    }
  }

  _pullImage(_name, _url) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = (function() {
      window.ndCombatImageCache[_name] = img;
      this.emitImagesLoaded();
    }).bind(this);
    img.onerror = (function() {
      console.error("Could not load image for", _name, "at URL:" + _url);
      delete window.ndCombatImageCache[_name];
    }).bind(this)
    img.src = _url;
  }

  getImage(_name) {
    if (window.ndCombatImageCache.hasOwnProperty(_name)) {
      return window.ndCombatImageCache[_name];
    }

    return null;
  }

  emitImagesLoaded() {
    let stillLoading = false;
    for (let _key in window.ndCombatImageCache) {
      if (window.ndCombatImageCache[_key] === LOADING_IDENTIFIER) {
        stillLoading = true;
      }
    }
    if (!stillLoading) {
      console.log("Done loading image cache");
    }
  }

}
