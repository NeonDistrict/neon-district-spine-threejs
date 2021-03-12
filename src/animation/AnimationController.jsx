import { ActiveAnimationEvent } from './ActiveAnimationEvent.jsx';
import { AttackAnimation } from './AttackAnimation.jsx';
import { BattleCompleteAnimation } from './BattleCompleteAnimation.jsx';
import { BoostAnimation } from './BoostAnimation.jsx';
import { BreakAnimation } from './BreakAnimation.jsx';
import { CardReplaceAnimation } from './CardReplaceAnimation.jsx';
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

  constructor(characters, effects, soundManager) {
    this.primaryEvents = [
      'AttackEvent',
      'BattleCompleteEvent',
      'BoostEvent',
      'BreakEvent',
      'CardPlayEvent',
      'CardReplaceEvent',
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
      'AttackEvent'           : new AttackAnimation(characters, effects, soundManager),
      'BattleCompleteEvent'   : new BattleCompleteAnimation(characters, effects, soundManager),
      'BoostEvent'            : new BoostAnimation(characters, effects, soundManager),
      'BreakEvent'            : new BreakAnimation(characters, effects, soundManager),
      'CardReplaceEvent'      : new CardReplaceAnimation(characters, effects, soundManager),
      'CleanseEvent'          : new CleanseAnimation(characters, effects, soundManager),
      'CounterAttackEvent'    : new AttackAnimation(characters, effects, soundManager),
      'CounterBoostEvent'     : new CounterBoostAnimation(characters, effects, soundManager),
      'DamageEvent'           : new DamageAnimation(characters, effects, soundManager),
      'HealEvent'             : new HealAnimation(characters, effects, soundManager),
      'KnockoutEvent'         : new KnockoutAnimation(characters, effects, soundManager),
      'PoisonEvent'           : new PoisonAnimation(characters, effects, soundManager),
      'PoisonEffectEvent'     : new PoisonEffectAnimation(characters, effects, soundManager),
      'RegenerateEvent'       : new RegenerateAnimation(characters, effects, soundManager),
      'RegenerateEffectEvent' : new RegenerateEffectAnimation(characters, effects, soundManager),
      'StripEvent'            : new StripAnimation(characters, effects, soundManager),
      'ShieldEvent'           : new ShieldAnimation(characters, effects, soundManager),
      'ShieldBlockEvent'      : new ShieldBlockAnimation(characters, effects, soundManager),
      //'StatChangeEvent'       : new StatChangeAnimation(characters, effects, soundManager),
      'TauntEvent'            : new TauntAnimation(characters, effects, soundManager)
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
