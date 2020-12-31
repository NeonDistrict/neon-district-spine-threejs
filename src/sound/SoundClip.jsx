export class SoundClip {
  constructor(path, volume = 0.25, loop = false, preload = 'auto') {
    // Constants
    this.SOUND_EFFECTS_ROOT_SRC = "https://neon-district-season-one.s3.amazonaws.com/sound-effects/";

    // Load the file
    this.audio = new Audio(this.SOUND_EFFECTS_ROOT_SRC + path);
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = this.parsePreload(preload);
    this.audio.onended = (() => {
      if (this.audio) {
        // Clear the source
        this.audio.pause();
        this.audio.removeAttribute('src'); // empty source
        this.audio.load();

        // Remove from the DOM
        this.audio.remove();
      }
    }).bind(this);

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
