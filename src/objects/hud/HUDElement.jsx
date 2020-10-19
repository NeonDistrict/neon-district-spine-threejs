export class HUDElement {

  constructor(obj = {}) {
    this.context = obj.context;
    this.center = {x:obj.x, y:obj.y};
    this.width = obj.width;
    this.height = obj.height;
    this.size = {width:obj.width, height:obj.height};
    this.teams = obj.teams;
    this.activeAnimEvt = obj.activeAnimEvt;
    this.hudLocked = false;

    window.addEventListener('clickableRegionsLocked', this.handleHUDLocked.bind(this));
    window.addEventListener('clickableRegionsUnlocked', this.handleHUDUnlocked.bind(this));
  }

  handleHUDLocked() {
    this.hudLocked = true;
  }

  handleHUDUnlocked() {
    this.hudLocked = false;
  }

  update(delta) {
    // Placeholder
  }

}
