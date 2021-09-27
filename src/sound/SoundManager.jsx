import { SoundClip } from "./SoundClip.jsx";

import SOUNDEFFECTS from "../data/soundEffects.js";

const ALL_MUSIC_OPTIONS = [{
  key : 'aspire-combat-loop',
  name: 'ND Combat Theme',
  volume: 0.15
},{
  key : 'bt-laurel-canyon-loop',
  name: 'Laurel Canyon Night Drive (Day) - BT',
  volume: 0.70,
},{
  key : 'bt-laurel-canyon-night-loop',
  name: 'Laurel Canyon Night Drive (Night) - BT',
  volume: 0.70
},{
  key : 'bt-laurel-canyon-lunar-loop',
  name: 'Laurel Canyon Night Drive (Lunar) - BT',
  volume: 0.70
}];

export class SoundManager {

  constructor(perks) {
    this.activeSounds = [];

    this.musicOptions = [
      ALL_MUSIC_OPTIONS[0]
    ];

    if (perks && Array.isArray(perks) && perks.length) {
      for (let perkIdx = 0; perkIdx < perks.length; perkIdx++) {
        for (let idx = 1; idx < ALL_MUSIC_OPTIONS.length; idx++) {
          if (ALL_MUSIC_OPTIONS[idx].key === perks[perkIdx]) {
            this.musicOptions.push(ALL_MUSIC_OPTIONS[idx]);
          }
        }
      }
    }
  }

  getMusicOptions() {
    return [...this.musicOptions];
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

  stop(category, tag) {
    for (let sound of this.activeSounds) {
      if (sound.getPath() === SOUNDEFFECTS[category][tag].path) {
        sound.stop();
      }
    }
  }

  cleanUpAudio() {
    for (let sound of this.activeSounds) {
      sound.cleanUpAudio();
    }
    this.activeSounds = [];
  }
}
