import ANIMATIONS from '../data/animations.js';

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
    if (statChanges.hasOwnProperty(unitId)) {
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

  playStatChangeAnimation(unit, statChanges) {
    console.log(unit);
    console.log(statChanges);
  }

}
