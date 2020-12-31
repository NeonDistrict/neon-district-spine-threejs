export class SoundClip {
  constructor(path, preload = 'none', volume = 0.5, loop = false) {
    // Constants
    this.SOUND_EFFECTS_ROOT_SRC = "https://neon-district-season-one.s3.amazonaws.com/sound-effects/";

    // Load the file
    this.audio = new Audio(this.SOUND_EFFECTS_ROOT_SRC + path);
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = this.parsePreload(preload);

    // Set defaults
    this.setLoop(loop);
    this.setVolume(volume);
  }

  parsePreload(preload) {
    if (['none','metadata','auto'].indexOf(preload) === -1) {
      console.error("Invalid audio preload value:", preload);
      return 'none';
    }

    return preload;
  }

  setVolume(volume) {
    this.audio.volume = Math.max(Math.min(volume, 1.0), 0.0);
  }

  setLoop(loop) {
    this.audio.loop = Boolean(loop);
  }

  play() {
    this.audio.play();
  }

  stop() {
    this.audio.pause();
  }
}
