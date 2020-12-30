import { ActiveAnimationEvent } from './ActiveAnimationEvent.jsx';
import { AttackAnimation } from './AttackAnimation.jsx';
import { BattleCompleteAnimation } from './BattleCompleteAnimation.jsx';
import { BoostAnimation } from './BoostAnimation.jsx';
import { BreakAnimation } from './BreakAnimation.jsx';
import { CleanseAnimation } from './CleanseAnimation.jsx';
import { CounterBoostAnimation } from './CounterBoostAnimation.jsx';
import { DamageAnimation } from './DamageAnimation.jsx';
import { HealAnimation } from './HealAnimation.jsx';
import { KnockoutAnimation } from './KnockoutAnimation.jsx';
import { PoisonAnimation } from './PoisonAnimation.jsx';
import { PoisonEffectAnimation } from './PoisonEffectAnimation.jsx';
import { RegenerateAnimation } from './RegenerateAnimation.jsx';
import { RegenerateEffectAnimation } from './RegenerateEffectAnimation.jsx';
import { StripAnimation } from './StripAnimation.jsx';
import { ShieldAnimation } from './ShieldAnimation.jsx';
import { ShieldBlockAnimation } from './ShieldBlockAnimation.jsx';
import { StatChangeAnimation } from './StatChangeAnimation.jsx';
import { TauntAnimation } from './TauntAnimation.jsx';

export class AnimationController {

  constructor(characters, effects) {
    this.primaryEvents = [
      'AttackEvent',
      'BattleCompleteEvent',
      'BoostEvent',
      'BreakEvent',
      'CardPlayEvent',
      'CleanseEvent',
      'CoinFlipEvent',
      'CounterAttackEvent',
      'CounterBoostEvent',
      'HealEvent',
      'PoisonEvent',
      'PoisonEffectEvent',
      'RegenerateEvent',
      'RegenerateEffectEvent',
      'ShieldEvent',
      //'StatChangeAnimation',
      'StripEvent',
      'TauntEvent'
    ];

    const eventAnimations = {
      'AttackEvent'           : new AttackAnimation(characters, effects),
      'BattleCompleteEvent'   : new BattleCompleteAnimation(characters, effects),
      'BoostEvent'            : new BoostAnimation(characters, effects),
      'BreakEvent'            : new BreakAnimation(characters, effects),
      'CleanseEvent'          : new CleanseAnimation(characters, effects),
      'CounterAttackEvent'    : new AttackAnimation(characters, effects),
      'CounterBoostEvent'     : new CounterBoostAnimation(characters, effects),
      'DamageEvent'           : new DamageAnimation(characters, effects),
      'HealEvent'             : new HealAnimation(characters, effects),
      'KnockoutEvent'         : new KnockoutAnimation(characters, effects),
      'PoisonEvent'           : new PoisonAnimation(characters, effects),
      'PoisonEffectEvent'     : new PoisonEffectAnimation(characters, effects),
      'RegenerateEvent'       : new RegenerateAnimation(characters, effects),
      'RegenerateEffectEvent' : new RegenerateEffectAnimation(characters, effects),
      'StripEvent'            : new StripAnimation(characters, effects),
      'ShieldEvent'           : new ShieldAnimation(characters, effects),
      'ShieldBlockEvent'      : new ShieldBlockAnimation(characters, effects),
      //'StatChangeEvent'       : new StatChangeAnimation(characters, effects),
      'TauntEvent'            : new TauntAnimation(characters, effects)
    };

    this.activeAnimationEvent = new ActiveAnimationEvent(characters, effects, this.primaryEvents, eventAnimations);
  }

  getActiveAnimationEventObject() {
    return this.activeAnimationEvent;
  }

  run(block, callback) {
    // Break up the events into sections
    let battleEventSegments = this.segmentEvents(block.battleEvents);

    // For each segment of events, enqueue
    for (let eventSegment of battleEventSegments) {
      // Parse the events for the major event
      let primaryEvent = this.getPrimaryEvent(eventSegment);
      let secondaryEvents = this.getSecondaryEvents(eventSegment);

      // Emit the event for UI updates
      // CALLBACK IS CALLED INDIRECTLY USING EVENTS IN HERE
      this.activeAnimationEvent.enqueue(block, primaryEvent, secondaryEvents);
    }
  }

  update(delta) {
    this.activeAnimationEvent.update(delta);
  }

  segmentEvents(_battleEventsOriginal) {
    // Operate on a copy
    let battleEvents = JSON.parse(JSON.stringify(_battleEventsOriginal));

    // Break up into segments
    let segments = [], activeSegment = [];
    for (let idx in battleEvents) {
      if (this.primaryEvents.indexOf(battleEvents[idx].name) !== -1) {
        // If the active segment has events, push onto segments
        if (this.hasPrimaryEvent(activeSegment)) {
          segments.push(activeSegment);
        }

        // Create new active segment
        activeSegment = [battleEvents[idx]];
      } else {
        activeSegment.push(battleEvents[idx]);
      }
    }

    // Append last active segment
    if (activeSegment.length > 0) {
      segments.push(activeSegment);
    }

    return segments;
  }

  hasPrimaryEvent(events) {
    let primaryEvents = events.filter((_event) => this.primaryEvents.indexOf(_event.name) !== -1);
    return primaryEvents.length > 0;
  }

  getPrimaryEvent(events) {
    let primaryEvents = events.filter((_event) => this.primaryEvents.indexOf(_event.name) !== -1);
    return (primaryEvents.length) ? primaryEvents[0] : {};
  }

  getSecondaryEvents(events) {
    return events.filter((_event) => this.primaryEvents.indexOf(_event.name) === -1);
  }

}
