import { Animation } from './Animation.jsx';

export class DamageAnimation extends Animation {

  run(event, isKnockout = false) {
    // Find the units
    let invokers = this.getInvokers(event);
    let targets = this.getTargets(event);

    // Run the attack animations for invokers
    for (let _invoker of invokers) {
      this.playAnimation(_invoker, 'baseAtk');
      this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
    }

    // Determine target reaction
    let targetReaction = (isKnockout) ? 'death' : 'baseHit';

    // Run the hit reaction for targets
    for (let _target of targets) {
      this.playAnimation(_target, targetReaction, 0.9, targetReaction !== 'death');
    }
  }

}
