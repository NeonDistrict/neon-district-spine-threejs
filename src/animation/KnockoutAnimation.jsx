import { Animation } from './Animation.jsx';

export class KnockoutAnimation extends Animation {

  run(event) {
    // Find the units
    let targets = this.getTargets(event);

    // Run the hit reaction for targets
    for (let _target of targets) {
      _target.knockoutAnimationPlayed = true;
      this.playAnimation(_target, 'death', 0.9, false);
    }
  }

}
