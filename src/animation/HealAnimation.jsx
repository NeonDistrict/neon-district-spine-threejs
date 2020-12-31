import { Animation } from './Animation.jsx';

export class HealAnimation extends Animation {

  run(event) {
    // Find the units
    let invokers = this.getInvokers(event);
    let targets = this.getTargets(event);

    // Invokers
    for (let _invoker of invokers) {
      if (_invoker.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playAnimation(_invoker, 'heal');
      this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
      this.playEffect(_invoker.nftId, 'healing-invoker-2', 0.0);
      this.playSound('abilities', 'nanomed_injection-1', 0.0);
    }

    // Determine which animation to use
    let healAnimation = 'healing-target-1';
    if (targets.length > 1) {
      // Use a smaller, briefer animation to reduce load
      healAnimation = 'healing-target-3';
    }

    // Targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
      this.playEffect(_target.nftId, healAnimation, 0.0);
    }
  }

}
