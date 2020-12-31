import { SoundClip } from "./SoundClip.jsx";

import SOUNDEFFECTS from "../data/soundEffects.js";

export class SoundManager {
  constructor(tag) {
    this.sounds = {};
  }

  hasSound(tag) {
    return this.sounds.hasOwnProperty(tag);
  }

  play(tag) {
    if (this.hasSound(tag)) {
      this.sounds[tag].play();
    }
  }
}
