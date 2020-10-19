import { ActiveAnimationEvent } from './ActiveAnimationEvent.jsx';
import { DamageAnimation } from './DamageAnimation.jsx';

export class AnimationController {

  constructor(characters, effects) {
    this.characters = characters;
    this.effects = effects;

    this.activeAnimationEvent = new ActiveAnimationEvent();

    this.eventAnimations = {
      'DamageEvent' : new DamageAnimation(this.characters, this.effects)//,
      //'KnockoutEvent' : new KnockoutAnimation(this.characters, this.effects)
    };

    this.primaryEvents = ['BattleCompleteEvent', 'CoinFlipEvent', 'DamageEvent'];
    this.KnockoutEventName = 'KnockoutEvent';
  }

  getActiveAnimationEventObject() {
    return this.activeAnimationEvent;
  }

  run(block, callback) {
    // Parse the events for the major event
    let primaryEvent = this.getPrimaryEvent(block.battleEvents);
    let secondaryEvents = this.getSecondaryEvents(block.battleEvents);

    // Run the event
    this.runEvent(primaryEvent, secondaryEvents);

    // Emit the event for UI updates
    // CALLBACK IS CALLED INDIRECTLY USING EVENTS IN HERE
    this.activeAnimationEvent.enqueue(block, primaryEvent, secondaryEvents);
  }

  update(delta) {
    this.activeAnimationEvent.update(delta);
  }

  runEvent(event, secondaryEvents) {
    if (this.eventAnimations.hasOwnProperty(event.name)) {
      this.eventAnimations[event.name].run(event, this.determineKnockoutEvent(secondaryEvents));
    }
  }

  getPrimaryEvent(events) {
    let primaryEvents = events.filter((_event) => this.primaryEvents.indexOf(_event.name) !== -1);
    return (primaryEvents.length) ? primaryEvents[0] : {};
  }

  getSecondaryEvents(events) {
    return events.filter((_event) => this.primaryEvents.indexOf(_event.name) === -1);
  }

  determineKnockoutEvent(events) {
    return (events.filter((_event) => _event.name === this.KnockoutEventName)).length > 0;
  }

}
