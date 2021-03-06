import { HUDElement } from './HUDElement.jsx';

export class VersionDisplay extends HUDElement {

  constructor(obj) {
    super(obj);
  }

  update(delta) {
    if (!this.needsUpdate) {
      return;
    }

    this.context.clearRect(
      0,
      0,
      400,
      100
    );

    this.context.fillStyle = `rgba(255,255,255,0.5)`;

    this.context.shadowColor = `rgba(255,255,255,0.25)`;
    this.context.shadowBlur = 4;

    this.context.font = '14pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';

    this.context.fillText(
      "Neon District Combat Engine",
      this.center.x + 10,
      this.center.y + 10
    );

    this.context.fillText(
      "Pre-Alpha - Build v.0.4.2",
      this.center.x + 10,
      this.center.y + 10 + 28
    );

    this.context.shadowBlur = 0;

    this.needsUpdate = false;
  }

}
