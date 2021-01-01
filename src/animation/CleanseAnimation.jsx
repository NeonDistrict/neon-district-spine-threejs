import { Animation } from './Animation.jsx';

export class CleanseAnimation extends Animation {

  run(event) {
    // Find the units
    let invokers = this.getInvokers(event);
    let targets = this.getTargets(event);

    // Invokers
    for (let _invoker of invokers) {
      if (_invoker.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playAnimation(_invoker, 'buff');
      this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
      this.playSound('abilities', 'cleanse-1', 0.0);

      // Skip if also a target
      for (let _target of targets) {
        if (_target.nftId === _invoker.nftId) {
          continue;
        }
      }

      this.playEffect(_invoker.nftId, 'stat-boost-invoker', 0.0);
    }

    // Targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
      this.playEffect(_target.nftId, 'cleanse-target', 0.0);
    }
  }

}
