import { Animation } from './Animation.jsx';

export class PoisonEffectAnimation extends Animation {

  run(event) {
    // Find the units
    let targets = this.getTargets(event);

    // Targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playAnimation(_target, 'baseHit', 0.9, true);
      this.playEffect(_target.nftId, 'poison-target-1', 0.0);
      this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
      this.playSound('combat', 'damage-flesh-blunt-sml-1', 0.0);
    }
  }

}
