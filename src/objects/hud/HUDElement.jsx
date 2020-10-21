export class HUDElement {

  constructor(obj = {}) {
    this.context = obj.context;
    this.center = {x:obj.x, y:obj.y};
    this.width = obj.width;
    this.height = obj.height;
    this.size = {width:obj.width, height:obj.height};
    this.teams = obj.teams;
    this.unit = obj.unit;
    this.activeAnimEvt = obj.activeAnimEvt;
    this.hudLocked = false;
    this.playerSelections = null;

    window.addEventListener('clickableRegionsLocked', this.handleHUDLocked.bind(this));
    window.addEventListener('clickableRegionsUnlocked', this.handleHUDUnlocked.bind(this));
  }

  setPlayerSelectionsObject(playerSelections) {
    this.playerSelections = playerSelections;
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

  roundRect(x, y, width, height, radius, fill, stroke) {
      if (typeof stroke == 'undefined') {
          stroke = true;
      }
      if (typeof radius === 'undefined') {
          radius = 5;
      }
      if (typeof radius === 'number') {
          radius = {tl: radius, tr: radius, br: radius, bl: radius};
      } else {
          var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
          for (var side in defaultRadius) {
              radius[side] = radius[side] || defaultRadius[side];
          }
      }

      this.context.beginPath();
      this.context.moveTo(x + radius.tl, y);
      this.context.lineTo(x + width - radius.tr, y);
      this.context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      this.context.lineTo(x + width, y + height - radius.br);
      this.context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      this.context.lineTo(x + radius.bl, y + height);
      this.context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      this.context.lineTo(x, y + radius.tl);
      this.context.quadraticCurveTo(x, y, x + radius.tl, y);
      this.context.closePath();

      if (fill) {
          this.context.fill();
      }
      if (stroke) {
          this.context.stroke();
      }
  }

  getLines(text, maxWidth) {
    if (!text) {
      return [];
    }

    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = this.context.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

}
