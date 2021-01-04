import { SoundClip } from "./SoundClip.jsx";

import SOUNDEFFECTS from "../data/soundEffects.js";

export class SoundManager {

  constructor() {
    this.activeSounds = [];
  }

  hasSound(category, tag) {
    return SOUNDEFFECTS.hasOwnProperty(category) && SOUNDEFFECTS[category].hasOwnProperty(tag);
  }

  play(category, tag, volume, loop = false) {
    if (this.hasSound(category, tag)) {
      let sound = new SoundClip(SOUNDEFFECTS[category][tag].path, volume, loop);
      sound.play();
      this.activeSounds.push(sound);
      return sound;
    }
  }

  cleanUpAudio() {
    for (let sound of this.activeSounds) {
      sound.cleanUpAudio();
    }
    this.activeSounds = [];
  }
}
