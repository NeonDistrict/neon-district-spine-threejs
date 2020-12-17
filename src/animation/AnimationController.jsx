import { ActiveAnimationEvent } from './ActiveAnimationEvent.jsx';

export class AnimationController {

  constructor(characters, effects) {
    //this.primaryEvents = ['BattleCompleteEvent', 'CoinFlipEvent', 'DamageEvent'];
    this.primaryEvents = ['BattleCompleteEvent', 'CoinFlipEvent', 'AttackEvent', 'CardPlayEvent'];

    this.activeAnimationEvent = new ActiveAnimationEvent(characters, effects, this.primaryEvents);
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
