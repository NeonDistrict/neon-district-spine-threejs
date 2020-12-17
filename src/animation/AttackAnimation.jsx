import { Animation } from './Animation.jsx';

export class AttackAnimation extends Animation {

  run(event) {
    // Find the units
    let invokers = this.getInvokers(event);

    // Run the attack animations for invokers
    for (let _invoker of invokers) {
      this.playAnimation(_invoker, 'baseAtk');
      this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
    }
  }

}
