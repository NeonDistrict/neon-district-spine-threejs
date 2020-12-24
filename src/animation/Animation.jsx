import ANIMATIONS from '../data/animations.js';
import ANIMATIONS_DRONES from '../data/animationsDrones.js';

export class Animation {

  constructor(characters, effects) {
    this.characters = characters;
    this.effects = effects;
  }

  run(event) {
    // Fill in for each animation
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
