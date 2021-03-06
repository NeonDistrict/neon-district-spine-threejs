/**
 * Requirement:
 *   Because spine-ts does not have an NPM module we can use, we need to import it directly.
 *   However, it requires that THREE is in globals, and I've not found a way to do this,
 *   because imports are async and namespaced, and rollup doesn't inject packages into global
 *   namespace, so we need to manually include THREE and spine at the root of the parent project.
 *
 */


// Modules
import { CombatScene } from './combat/CombatScene.jsx';
import { CombatPlayer } from './combat/CombatPlayer.jsx';
import { CharacterEquipment } from './equipment/CharacterEquipment.jsx';

export {
  CombatScene as NDCombatScene,
  CombatPlayer as NDCombatPlayer,
  CharacterEquipment as NDCharacterEquipment
};
