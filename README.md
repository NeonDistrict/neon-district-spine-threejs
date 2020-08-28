# Neon District Spine Three.JS Modules

Animation packages for Neon District Portal.

## Install

```bash
npm install --save https://github.com/NeonDistrict/neon-district-spine-threejs
```

### Include THREE and spine-ts in project

Spine-ts does not have an NPM module we can use, so we need to import it directly. However, it requires that THREE is in globals, and I've not found a way to do this wrapped inside the module, because imports are async and namespaced, and rollup doesn't inject packages into global namespace, so we need to manually include THREE and spine at the root of the parent project.

In the `<head>`, include `THREE` and `spine-ts`:
```html
<script src="./vendor/three.min.js"></script>
<script src="./vendor/spine-threejs.js"></script>
```

## Usage

TBD, hoping for something like:

```jsx
import CharacterEquipment, { CharacterLoadout } from "neon-district-spine-threejs";
```

## Credit

Took the code basis of this package from [colored-heading](https://github.com/skolhustick/colored-heading/).
