/**
 * Requirement:
 *   Because spine-ts does not have an NPM module we can use, we need to import it directly.
 *   However, it requires that THREE is in globals, and I've not found a way to do this,
 *   because imports are async and namespaced, and rollup doesn't inject packages into global
 *   namespace, so we need to manually include THREE and spine at the root of the parent project.
 *
 */

import { ColoredHeadingOne, ColoredHeadingTwo } from './Test.jsx';
import { CubeTest } from './combat/CubeTest.jsx';
import { CombatTest } from './combat/CombatTest.jsx';

export {
  ColoredHeadingOne,
  ColoredHeadingTwo,
  CombatTest as NDCombatTest,
  CubeTest as ThreeJSCubeTest
};
