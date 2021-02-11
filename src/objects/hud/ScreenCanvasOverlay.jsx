import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class ScreenCanvasOverlay extends HUDElement {

  constructor(obj) {
    super(obj);
    this.opacityDelta = 0.0;
  }

  handleBattleComplete(e) {
    super.handleBattleComplete(e)
    this.needsUpdate = true;
  }

  update(delta) {
    if (this.battleComplete) {
      this.context.clearRect(
        0,
        0,
        this.width,
        this.height
      );

      // Empty Bottom Gradiant
      let gradient = this.context.createLinearGradient(0, this.height * 2/3, 0, this.height);
      gradient.addColorStop(0, 'rgba(0,0,0,0.0)');
      gradient.addColorStop(0.2, 'rgba(0,0,0,1.0)');
      gradient.addColorStop(1.0, 'rgba(0,0,0,1.0)');
      this.context.fillStyle = gradient;
      this.context.fillRect(0, this.height * 2/3, this.width, this.height * 1/3);

      if (this.opacityDelta < 0.65) {
        this.opacityDelta += delta / 5;
      }
      else {
        this.needsUpdate = false;
      }

      this.context.fillStyle = `rgba(0,0,0,${this.opacityDelta})`;
      this.context.rect(0, 0, this.width, this.height);
      this.context.fill();

      this.context.fillStyle = HUDSTYLES.colors.neonBlue;
      this.context.strokeStyle = HUDSTYLES.colors.neonBlue;

      this.context.shadowColor = HUDSTYLES.colors.neonBlue;
      this.context.shadowBlur = 4;

      this.context.font = '64pt "kozuka-gothic-pr6n-bold"';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'bottom';

      this.context.fillText(
        "Winner: " + (this.battleCompleteWinner === 'one' ? 'Player One' : 'Player Two'),
        this.width/2,
        this.height/2
      );
      this.context.shadowBlur = 0;
    }
    else {
      this.needsUpdate = false;
    }
  }

}
