import { AttackAnimation } from './AttackAnimation.jsx';
import { DamageAnimation } from './DamageAnimation.jsx';
import { KnockoutAnimation } from './KnockoutAnimation.jsx';

export class ActiveAnimationEvent {

  constructor(characters, effects, primaryEvents) {
    this.animationEndTime = 0;
    this.addtlMilliseconds = 3000;

    this.queue = [];

    this.currentEventName = null;
    this.currentStatChanges = {};
    this.currentStatusEffectChanges = {};

    this.characters = characters;

    // Animation Events
    this.primaryEvents = primaryEvents;

    this.eventAnimations = {
      'AttackEvent'        : new AttackAnimation(characters, effects),
      'CounterAttackEvent' : new AttackAnimation(characters, effects),
      'DamageEvent'        : new DamageAnimation(characters, effects),
      'KnockoutEvent'      : new KnockoutAnimation(characters, effects)
    };
    this.KnockoutEventName = 'KnockoutEvent';
  }

  enqueue(block, primaryEvent, secondaryEvents) {
    this.queue.push({block, primaryEvent, secondaryEvents});
  }

  dequeue() {
    if (this.queue.length === 0) {
      // End the animation cycle
      if (this.currentEventName !== null) {
        window.dispatchEvent(
          new CustomEvent("eventBlockComplete")
        );
      }

      this.currentEventName = null;
      this.currentStatChanges = {};
      this.currentStatusEffectChanges = {};
      return;
    }

    // Get next event in the queue
    let obj = this.queue.shift();

    // Run the events
    let characterToAnimation = this.runEvent(obj.primaryEvent, obj.secondaryEvents);
    this.getLatestStatChanges({'battleEvents':[obj.primaryEvent,...obj.secondaryEvents]});
    this.getLatestStatusEffectChanges({'battleEvents':[obj.primaryEvent,...obj.secondaryEvents]});

    // Determine how long to run the animation for
    this.currentEventName = obj.primaryEvent.name;
    this.animationEndTime = Date.now() + this.calculateAdditionalMS(characterToAnimation);
  }

  calculateAdditionalMS(characterToAnimation) {
    // Default amount
    let addtlMilliseconds = this.addtlMilliseconds;

    for (let characterUuid in characterToAnimation) {
      if (characterToAnimation[characterUuid].name === 'AttackEvent') {
        for (let character of this.characters) {
          if (character.unitId === characterUuid && character.drone) {
            addtlMilliseconds += 2000;
          }
        }
      }
    }

    return addtlMilliseconds;
  }

  runEvent(primaryEvent, secondaryEvents) {
    // For each secondary event, handle cases where we want to do one animation over the other
    let characterToAnimation = {};
    for (let secondaryEvent of secondaryEvents) {
      if (!this.eventAnimations.hasOwnProperty(secondaryEvent.name)) {
        continue;
      }

      for (let _unitId of secondaryEvent.targetIds) {
        // Knockout event takes precedence always
        if (characterToAnimation.hasOwnProperty(_unitId) && characterToAnimation[_unitId].name === this.KnockoutEventName) {
          continue;
        }

        characterToAnimation[_unitId] = secondaryEvent;
      }

      // Default to the invoker performing the attack animation if the primary event
      // doesn't fall into pre-defined animations & damage is done to a target
      if (secondaryEvent.name === 'DamageEvent' || secondaryEvent.name === 'KnockoutEvent') {
        for (let _unitId of secondaryEvent.invokerIds) {
          // Knockout event takes precedence always
          if (characterToAnimation.hasOwnProperty(_unitId) && characterToAnimation[_unitId].name === this.KnockoutEventName) {
            continue;
          }

          characterToAnimation[_unitId] = {...secondaryEvent, 'name':'AttackEvent'};
        }
      }
    }

    // Get the primary event for the invoker
    for (let _unitId of primaryEvent.invokerIds) {
      // Knockout event takes precedence always
      if (characterToAnimation.hasOwnProperty(_unitId) && characterToAnimation[_unitId].name === this.KnockoutEventName) {
        continue;
      }

      if (this.eventAnimations.hasOwnProperty(primaryEvent.name)) {
        characterToAnimation[_unitId] = primaryEvent;
      }
    }

    // For each event, kick off
    for (let _unitId in characterToAnimation) {
      console.log(_unitId, characterToAnimation[_unitId].name);
      let _event = characterToAnimation[_unitId];
      if (this.eventAnimations.hasOwnProperty(_event.name)) {
        this.eventAnimations[_event.name].run(_event);
      }
    }

    return characterToAnimation;
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
    return Math.max((this.animationEndTime - Date.now()) / this.addtlMilliseconds, 0.0);
  }

}
