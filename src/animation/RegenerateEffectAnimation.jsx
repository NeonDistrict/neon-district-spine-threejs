import { Animation } from './Animation.jsx';

export class RegenerateEffectAnimation extends Animation {

  run(event) {
    // Find the units
    let targets = this.getTargets(event);

    // Targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playEffect(_target.nftId, 'regeneration-target', 0.0);
      this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
      this.playSound('abilities', 'regeneration-1', 0.0);
    }
  }

}
