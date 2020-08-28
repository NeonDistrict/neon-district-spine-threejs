/**
 * Requirement:
 *   Because spine-ts does not have an NPM module we can use, we need to import it directly.
 *   However, it requires that THREE is in globals, and I've not found a way to do this,
 *   because imports are async and namespaced, and rollup doesn't inject packages into global
 *   namespace, so we need to manually include THREE and spine at the root of the parent project.
 *
 */

// Tests
import { ColoredHeadingOne, ColoredHeadingTwo } from './test/ColoredHeadingTest.jsx';
import { CubeTest } from './test/CubeTest.jsx';

// Modules
import { CombatTest } from './combat/CombatTest.jsx';
import { CharacterEquipment } from './equipment/CharacterEquipment.jsx';

export {
  ColoredHeadingOne,
  ColoredHeadingTwo,
  CombatTest as NDCombatTest,
  CharacterEquipment as NDCharacterEquipment,
  CubeTest as ThreeJSCubeTest
};
