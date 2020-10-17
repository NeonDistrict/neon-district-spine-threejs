import "../styles/game-ui.css";

export class CombatUI {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
  }

  test() {
    console.log(this.canvas.getContext('webgl2'));
    this.context.font = '68px kozuka-gothic-pr6n';
    this.context.fillStyle = 'orangered';
    this.context.textBaseline = 'top';
    console.log(this.canvas.getContext('webgl2'));
    this.context.fillText('Keyboard Cat', 100, 270);
  }

}
