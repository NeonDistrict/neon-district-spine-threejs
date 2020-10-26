import ANIMATIONS from '../data/animations.js';

export class ActiveAnimationEvent {

  constructor(characters, effects) {
    this.animationEndTime = 0;
    this.addtlSeconds = 3000;

    this.queue = [];

    this.currentEventName = null;
    this.currentStatChanges = {};
    this.currentStatusEffectChanges = {};
  }

  enqueue(block, primaryEvent, secondEvent) {
    this.queue.push({block, primaryEvent, secondEvent});
  }

  dequeue() {
    if (this.queue.length === 0) {
      // End the animation cycle
      if (this.currentEventName !== null) {
        window.dispatchEvent(
          new CustomEvent("unlockClickableRegions", {
            'detail' : {
              'event' : this.currentEventName
            }
          })
        );
      }

      this.currentEventName = null;
      this.currentStatChanges = {};
      this.currentStatusEffectChanges = {};
      return;
    }

    let obj = this.queue.shift();
    this.currentEventName = obj.primaryEvent.name;
    this.animationEndTime = Date.now() + this.addtlSeconds;
    this.getLatestStatChanges(obj.block);
    this.getLatestStatusEffectChanges(obj.block);
  }

  getLatestStatChanges(block) {
    this.currentStatChanges = {};
    for (let _event of block.battleEvents) {
      if (!_event.statChanges) continue;
      for (let _unitId in _event.statChanges) {
        if (!this.currentStatChanges.hasOwnProperty(_unitId)) {
          this.currentStatChanges[_unitId] = {};
        }
        for (let _statChange in _event.statChanges[_unitId]) {
          if (!this.currentStatChanges[_unitId][_statChange]) {
            this.currentStatChanges[_unitId][_statChange] = 0;
          }
          this.currentStatChanges[_unitId][_statChange] += _event.statChanges[_unitId][_statChange]
        }
      }
    }
  }

  getLatestStatusEffectChanges(block) {
    this.currentStatusEffectChanges = {};
    for (let _event of block.battleEvents) {
      if (!_event.statusEffects) continue;
      for (let _unitId in _event.statusEffects) {
        if (!this.currentStatusEffectChanges.hasOwnProperty(_unitId)) {
          this.currentStatusEffectChanges[_unitId] = {};
        }
        for (let _statusEffectChange in _event.statusEffects[_unitId]) {
          if (!this.currentStatusEffectChanges[_unitId][_statusEffectChange]) {
            this.currentStatusEffectChanges[_unitId][_statusEffectChange] = 0;
          }
          this.currentStatusEffectChanges[_unitId][_statusEffectChange] += _event.statusEffects[_unitId][_statusEffectChange]
        }
      }
    }
  }

  update() {
    if (this.animationEndTime <= Date.now()) {
      this.dequeue();
    }
  }

  activeStatChange(unitId, stat) {
    // Get the stat changes
    if (
      this.currentStatChanges.hasOwnProperty(unitId) &&
      this.currentStatChanges[unitId].hasOwnProperty(stat)
    ) {
      return this.currentStatChanges[unitId][stat];
    }

    return false;
  }

  hasActiveStatChange(unitId) {
    return this.currentStatChanges.hasOwnProperty(unitId);
  }

  getActiveStatChanges(unitId) {
    return this.currentStatChanges.hasOwnProperty(unitId) && this.currentStatChanges[unitId];
  }

  activeStatusEffectChange(unitId, stat) {
    // Get the stat changes
    if (
      this.currentStatusEffectChanges.hasOwnProperty(unitId) &&
      this.currentStatusEffectChanges[unitId].hasOwnProperty(stat)
    ) {
      return this.currentStatusEffectChanges[unitId][stat];
    }

    return false;
  }

  hasActiveStatusEffectChange(unitId) {
    return this.currentStatusEffectChanges.hasOwnProperty(unitId);
  }

  getActiveStatusEffectChanges(unitId) {
    return this.currentStatusEffectChanges.hasOwnProperty(unitId) && this.currentStatusEffectChanges[unitId];
  }

  currentTimeDelta() {
    return Math.max((this.animationEndTime - Date.now()) / this.addtlSeconds, 0.0);
  }

}
