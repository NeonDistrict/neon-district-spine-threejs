import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class ErrorDisplay extends HUDElement {

  constructor(obj) {
    super(obj);
    this.error = "";
    this.errorTime = 3;
    this.errorTimeout = 3;
    this.needsUpdate = false;
  }

  setError(err) {
    this.error = err;
    this.errorTimeout = 0;
    this.needsUpdate = true;
  }

  update(delta) {
    if (this.errorTimeout >= this.errorTime) {
      this.needsUpdate = false;
      return;
    }
    this.errorTimeout += delta;

    let opacity = 1.0 - this.errorTimeout / (this.errorTime * 1.5);

    this.context.shadowBlur = 0;
    this.context.strokeStyle = `rgba(0,0,0,${opacity})`;
    this.context.fillStyle = `rgba(50,50,50,${opacity})`;
    this.roundRect(
      this.center.x - this.width / 2,
      this.center.y - this.height / 2,
      this.width,
      this.height,
      4, true, true
    );

    this.context.strokeStyle = `rgba(255,0,47,${opacity})`;
    this.context.fillStyle = `rgba(255,0,47,${opacity})`;

    this.context.font = '22pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    let errorLines = this.getLines(this.error || "", this.width * 7/8);
    for (let _idx = 0; _idx < errorLines.length; _idx++) {
      this.context.fillText(
        errorLines[_idx],
        this.center.x,
        this.center.y - this.height / 2 + 30 * _idx + 15
      );
    }

    this.context.shadowBlur = 0;
  }

}
