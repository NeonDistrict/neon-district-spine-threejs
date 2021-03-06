import { Animation } from './Animation.jsx';

export class CardReplaceAnimation extends Animation {

  run(event) {
    // Find the units
    let invokers = this.getInvokers(event);
    let targets = this.getTargets(event);

    /*
      Currently not finished, need to determine buff / debuff, and runs into other animations (damage / attack);
    */

    // Determine if this is a buff or debuff
    console.log(event.statChanges);

    // Invokers
    for (let _invoker of invokers) {
      if (_invoker.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playAnimation(_invoker, 'buff');
      this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
      //this.playEffect(_invoker.nftId, 'buff-invoker', 0.0);
      //this.playSound('abilities', 'buff-1', 0.0);
    }

    // Targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
      //this.playEffect(_target.nftId, 'buff-target', 0.0);
    }
  }

}
