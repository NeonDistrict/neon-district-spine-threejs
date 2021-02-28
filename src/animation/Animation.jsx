import ANIMATIONS from '../data/animations.js';
import ANIMATIONS_DRONES from '../data/animationsDrones.js';

export class Animation {

  constructor(characters, effects, soundManager) {
    this.characters = characters;
    this.effects = effects;
    this.soundManager = soundManager;

    this.PLAY_SOUND = true;
    this.PLAY_EFFECTS = true;
  }

  run(event) {
    // Fill in for each animation
  }

  playSound(category, tag, delay = 0.0) {
    if (!this.PLAY_SOUND) {
      console.debug("Not playing sound");
      return;
    }

    if (this.soundManager.hasSound(category, tag)) {
      if (delay > 0.001) {
        setTimeout(this.playSoundCall.bind(this, category, tag), delay * 1000);
      } else {
        this.playSoundCall(category, tag);
      }
    } else {
      console.error("Sound not found in playSound:", category, tag);
    }
  }

  playSoundCall(category, tag) {
    if (this.soundManager.hasSound(category, tag)) {
      this.soundManager.play(category, tag);
    } else {
      console.error("Sound not found in playSoundCall:", category, tag);
    }
  }

  // Play on Delay or Play Immediately
  playEffect(index, effectKey, delay = 0.001) {
    if (!this.PLAY_EFFECTS) {
      console.debug("Not playing effects");
      return;
    }

    if (this.effects.hasOwnProperty(index)) {
      if (delay > 0.001) {
        setTimeout(this.playEffectCall.bind(this, index, effectKey), delay * 1000);
      } else {
        this.playEffectCall(index, effectKey);
      }
    } else {
      console.error("Effect index not found in playEffect:", index);
    }
  }

  playEffectCall(index, effectKey) {
    if (this.effects.hasOwnProperty(index)) {
      this.effects[index].setKey(effectKey);
      this.effects[index].setLoop(false);
      this.effects[index].play();
    } else {
      console.error("Effect index not found in playEffectCall:", index);
    }
  }

  getInvokers(event) {
    return this.characters.filter(_char => event.invokerIds.indexOf(_char.unitId) !== -1);
  }

  getTargets(event) {
    return this.characters.filter(_char => event.targetIds.indexOf(_char.unitId) !== -1);
  }

  getStatChanges(unitId, statChanges) {
    if (statChanges && statChanges.hasOwnProperty(unitId)) {
      return statChanges[unitId];
    }

    return {};
  }

  determineWeaponAnimationType(character) {
    try {
      return character.pose.split('_')[0];
    } catch(ex) {
      console.error("Can not determine weapon animation type.");
      console.error(ex);
    }
  }

  playAnimation(character, action, delay = 0.001, resumeIdle = true) {
    // Depending on the action, may do something different
    // If the character has a drone, some actions are dupliated or only performed on the drone
    if (character.drone && (action === 'baseAtk' || action === 'pwdAtk')) {
      this.animateDrone(character, action, delay, resumeIdle);
    } else if (character.drone && action !== 'death') {
      this.animateDrone(character, action, delay, resumeIdle);
      this.animateCharacter(character, action, delay, resumeIdle);
    } else {
      this.animateCharacter(character, action, delay, resumeIdle);
    }
  }

  animateCharacter(character, action, delay = 0.001, resumeIdle = true) {
    let weapon = this.determineWeaponAnimationType(character);
    let nextAnimation = ANIMATIONS[weapon][action];
    let idleAnimation = ANIMATIONS[weapon].baseIdle;

    if (nextAnimation) {
      character.spine.skeletonMesh.state.clearTracks();
      character.spine.skeletonMesh.state.setAnimation(0, idleAnimation, true);
      character.spine.skeletonMesh.state.addAnimation(0, nextAnimation, false, delay);

      if (resumeIdle) {
        character.spine.skeletonMesh.state.addAnimation(0, idleAnimation, true, 1.2);
      }
    }
  }

  animateDrone(character, action, delay = 0.001, resumeIdle = true) {
    let nextAnimation = ANIMATIONS_DRONES['DroneSml'][action];
    let idleAnimation = ANIMATIONS_DRONES['DroneSml'].baseIdle;

    if (nextAnimation) {
      character.drone.skeletonMesh.state.clearTracks();
      character.drone.skeletonMesh.state.setAnimation(0, idleAnimation, true);
      character.drone.skeletonMesh.state.addAnimation(0, nextAnimation, false, delay);

      if (resumeIdle) {
        character.drone.skeletonMesh.state.addAnimation(0, idleAnimation, true, 1.2);
      }
    }
  }

  playStatChangeAnimation(unit, statChanges) {
    //console.log("Need to show stat change animation");
    //console.log(unit);
    //console.log(statChanges);
  }

}
