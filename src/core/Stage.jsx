import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { VideoTexture } from "../core/VideoTexture.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineDrone } from "../objects/SpineDrone.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";
import BACKGROUNDS from "../data/backgrounds.js";
import WEAPONS_TO_ANIMATIONS from "../data/weaponsToAnimations.js";
import ANIMATIONS from "../data/animations.js";
import DRONES from "../data/drones.js";


const screen_placements = {
  character: {
    '-1': { offset_x:    0, offset_y: -50, scale: 0.150, flip_x: false },  // unknown?
    '0':  { offset_x: -100, offset_y:  40, scale: 0.120, flip_x: false }, // left front top
    '1':  { offset_x: -200, offset_y: -30, scale: 0.148, flip_x: false }, // left front bottom
    '2':  { offset_x: -300, offset_y:  40, scale: 0.120, flip_x: false }, // left back top
    '3':  { offset_x: -400, offset_y: -30, scale: 0.148, flip_x: false }, // left back bottom
    '4':  { offset_x:  100, offset_y:  40, scale: 0.120, flip_x:  true }, // right front top
    '5':  { offset_x:  200, offset_y: -30, scale: 0.148, flip_x:  true }, // right front bottom
    '6':  { offset_x:  300, offset_y:  40, scale: 0.120, flip_x:  true }, // right back top
    '7':  { offset_x:  400, offset_y: -30, scale: 0.148, flip_x:  true }, // right back bottom
    '8':  { offset_x: -250, offset_y:   0, scale:  null, flip_x:  true }, // left center
    '9':  { offset_x:  250, offset_y:   0, scale: 0.134, flip_x:  true }, // right center
    '10': { offset_x: -175, offset_y:   0, scale:  null, flip_x:  true }, // left front center
    '11': { offset_x:  175, offset_y:   0, scale:  null, flip_x:  true }, // right front center
    '12': { offset_x: -385, offset_y:   0, scale:  null, flip_x:  true }, // left back center
    '13': { offset_x:  385, offset_y:   0, scale:  null, flip_x:  true }, // right back center
  },
  drone: {
    '-1': { offset_x:    0, offset_y: -50, scale: 0.150, flip_x: false },  // unknown?
    '0':  { offset_x: -100, offset_y:  40, scale: 0.132, flip_x: false }, // left front top
    '1':  { offset_x: -200, offset_y: -30, scale: 0.145, flip_x: false }, // left front bottom
    '2':  { offset_x: -300, offset_y:  40, scale: 0.132, flip_x: false }, // left back top
    '3':  { offset_x: -400, offset_y: -30, scale: 0.145, flip_x: false }, // left back bottom
    '4':  { offset_x:  100, offset_y:  40, scale: 0.132, flip_x:  true }, // right front top
    '5':  { offset_x:  200, offset_y: -30, scale: 0.145, flip_x:  true }, // right front bottom
    '6':  { offset_x:  300, offset_y:  40, scale: 0.132, flip_x:  true }, // right back top
    '7':  { offset_x:  400, offset_y: -30, scale: 0.145, flip_x:  true }, // right back bottom
    '8':  { offset_x: -250, offset_y:   0, scale:  null, flip_x:  true }, // left center
    '9':  { offset_x:  250, offset_y:   0, scale: 0.134, flip_x:  true }, // right center
    '10': { offset_x: -175, offset_y:   0, scale:  null, flip_x:  true }, // left front center
    '11': { offset_x:  175, offset_y:   0, scale:  null, flip_x:  true }, // right front center
    '12': { offset_x: -385, offset_y:   0, scale:  null, flip_x:  true }, // left back center
    '13': { offset_x:  385, offset_y:   0, scale:  null, flip_x:  true }, // right back center
  }
};

export class Stage extends SpineScene {
    constructor (props) {
        super(props);
        this.characters = [];
        this.background;
        this.effects = {};
        this._backgrounds = [];
    };

    defaultCameraPosition () {
        return {
            x: 0,
            y: 120,
            z: 400
        };
    };

    componentDidMount () {
        super.componentDidMount(arguments);
        this.constructCharacters();
        this.constructBackgrounds();
        this.constructEffects();
        requestAnimationFrame(this.loadSkeletons.bind(this)); // todo
    };

    componentWillUpdate (nextProps) {
        if (!nextProps.hasOwnProperty('effectTest')) {
            return;
        }
        const effect_test = nextProps.effectTest;
        if (effect_test.hasOwnProperty('size') && effect_test.hasOwnProperty('scale')) {
            this.effects.vfx0.setSize(effect_test.size.width, effect_test.size.height, effect_test.scale);
        }
        if (effect_test.hasOwnProperty('pos')) {
            this.effects.vfx0.setPosition(effect_test.pos.x_pos, effect_test.pos.y_pos);
        }
        if (effect_test.hasOwnProperty('rotation')) {
            this.effects.vfx0.setRotation(effect_test.rotation);
        }
        if (effect_test.hasOwnProperty('opacity')) {
            this.effects.vfx0.setOpacity(effect_test.opacity);
        }
        if (effect_test.hasOwnProperty('speed')) {
            this.effects.vfx0.setPlaybackRate(effect_test.speed);
        }
        if (effect_test.hasOwnProperty('flipX') || effect_test.hasOwnProperty('flipY')) {
            this.effects.vfx0.setOrientation(effect_test.flipX || false, effect_test.flipY || false);
        }
        if (effect_test.hasOwnProperty('blend')) {
            this.effects.vfx0.setBlendMode(effect_test.blend);
        }
        if (effect_test.src !== this.effects.vfx0.getSrc()) {
            console.log("Setting src:", effect_test.src, this.effects.vfx0.getSrc(), effect_test.src !== this.effects.vfx0.getSrc());
            this.effects.vfx0.setSrc(effect_test.src);
            this.effects.vfx0.setLoop(true);
            this.effects.vfx0.play();
        }

        if (effect_test.hasOwnProperty('effectKey')) {
            let index = "vfx0";
            if (effect_test.hasOwnProperty('effectIndex')) {
                index = String(effect_test.effectIndex);
                console.log("using index", index);
            }

            console.log("Setting effect key:", effect_test.effectKey, this.effects[index].getKey(), effect_test.effectKey !== this.effects[index].getKey());
            this.effects[index].setKey(effect_test.effectKey);
            this.effects[index].setLoop(true);
            this.effects[index].play();
        };
    };

    constructEffects () {
        this.effects = {
            'vfx0': new VideoTexture(this.scene)
        };
        const effect_placement = screen_placements.character['-1'];
        for (let character_index in this.characters) {
            const character = this.characters[character_index];
            const key = character.hasOwnProperty('nftId') ? character.nftId : String(character_index);
            const character_placement = screen_placements.character[character.position];
            this.effects[key] = new VideoTexture(this.scene, {
                unit: {
                    scale: character_placement.scale / effect_placement.scale,
                    x_pos: character_placement.offset_x - effect_placement.offset_x,
                    y_pos: character_placement.offset_y - effect_placement.offset_y,
                    flipX: character_placement.flip_x
                }
            });
        }
    };

    deriveIdlePoseFromWeaponType (weaponType) {
        weaponType = weaponType.split('-')[0];
        if (WEAPONS_TO_ANIMATIONS.hasOwnProperty(weaponType)) {
            if (ANIMATIONS.hasOwnProperty(WEAPONS_TO_ANIMATIONS[weaponType])) {
                return ANIMATIONS[WEAPONS_TO_ANIMATIONS[weaponType]].baseIdle;
            } else {
                console.warn("Animation does not exist for Weapon Type (" + weaponType + ") Animation:", WEAPONS_TO_ANIMATIONS[weaponType]);
            }
        } else {
            console.warn("Weapon type does not exist in WEAPONS_TO_ANIMATIONS:", weaponType);
        }
    }

    constructCharacters () {
        for (let character_index in this.characters) {
            const character = this.characters[character_index];
            const spine_character = new SpineCharacter(null, character.gender, character.skin_tone, character.gear);
            character.spine = spine_character;
            if (character.hasOwnProperty('weapon') && this.isDroneWeapon(character.weapon)) {
                let weapon = character.weapon.split('-');
                const spine_drone = new SpineDrone(this.assetManager, this.spineOutputDirectory + "/weapons/Blkpartnerdrone.json", weapon[0], weapon[1], index);
                character.drone = spine_drone;
            }
        }
    }

    isDroneWeapon(weapon = "") {
        return DRONES.hasOwnProperty(weapon.split('-')[0]);
    }

    constructBackgrounds () {
        if (BACKGROUNDS.hasOwnProperty(this.background)) {
            const key = BACKGROUNDS[this.background].key;
            const features = BACKGROUNDS[this.background].features;
            const animation = BACKGROUNDS[this.background].animation;
            if (typeof features === 'string') {
                const spine_background = new SpineBackground(this.assetManager, this.spineOutputDirectory + "/backgrounds/" + key + "/" + features + ".json", animation);
                this._backgrounds.push(spine_background);
            } else {
                for (let _feature of ["Paralax2", "Paralax1", "Midground", "Foreground"]) {
                    if (!features.hasOwnProperty(_feature)) {
                        continue;
                    }
                    const spine_background = new SpineBackground(this.assetManager, this.spineOutputDirectory + "/backgrounds/" + key + "/" + _feature + "/" + features[_feature] + ".json", animation);
                    this._backgrounds.push(spine_background);
                }
            }
            return;
        }
        console.error(`Could not find background ${this.background} in backgrounds list.`);
    };

    async loadSkeletons () {
        if (this.assetManager.isLoadingComplete()) {
            let skeletons = [];
            for (let _bg of this._backgrounds) {
                skeletons.push(_bg.createMesh());
            }

            // sort characters by draw order
            this.characters.sort(((a, b) => {
                const placement_a = screen_placements.character[a.position];
                const placement_b = screen_placements.character[b.position];
                return placement_a.offset_y < placement_b.offset_y ? 1 : -1;
            }).bind(this))

            // create meshes
            for (const character of this.characters) {
                // drone spine
                if (character.drone) {
                    const drone_placement = screen_placements.drone[character.position];
                    drone_placement.offset_y -= 300; // lower the drone todo why isnt this in the lookup?
                    const drone_mesh = character.drone.createMesh(drone_placement.offset_x, drone_placement.offset_y, drone_placement.flip_x, drone_placement.scale);
                    skeletons.push(drone_mesh);
                    character.drone.loadDroneImage();
                }

                // character spine
                const character_placement = screen_placements.character[character.position];
                const spine_character = character.spine;
                const skeleton_mesh = await spine_character.load(character_placement.offset_x, character_placement.offset_y, character_placement.flip_x);
                spine_character.animate(['Human_Unarmed1H_BasicIdle_001']); // todo get proper idle
                skeletons.push(skeleton_mesh);
            }

            this.setSkeletons(skeletons);
            requestAnimationFrame(this.load.bind(this));
        } else {
            requestAnimationFrame(this.loadSkeletons.bind(this));
        }
    };

    getUnitPosition(character) {
        const screen = this.getScreenWorldPosition();
        if (!screen || !character) {
            console.log("Null character or screen within Stage::getUnitPosition");
            return null;
        }

        const unit_placement = screen_placements.character[character.position];
        const skeletonData = character.spine.skeletonData;
        const bbox = {
            x1: screen.x + ( unit_placement.offset_x - unit_placement.scale * (skeletonData.width * 1 / 2)) * (screen.fraction.width)  * this.DPI,
            y1: screen.y + (-unit_placement.offset_y - unit_placement.scale * (skeletonData.height))         * (screen.fraction.height) * this.DPI,
            x2: screen.x + ( unit_placement.offset_x + unit_placement.scale * (skeletonData.width * 1 / 2)) * (screen.fraction.width)  * this.DPI,
            y2: screen.y + (-unit_placement.offset_y + unit_placement.scale * (skeletonData.height))         * (screen.fraction.height) * this.DPI
        };
        const feet = {
            x: screen.x + unit_placement.offset_x * screen.fraction.width  * this.DPI,
            y: screen.y - unit_placement.offset_y * screen.fraction.height * this.DPI
        };
        const above = {
            x: (bbox.x1 + bbox.x2) / 2 + (bbox.x2 - bbox.x1) / 2 * (bbox.x1 > this.canvas.width / 2 ? 0.25 : -0.25),
            y: bbox.y1 * 9 / 8
        };

        return {
            feet: feet,
            above: above,
            bbox: bbox,
            target: {
                x: bbox.x1 + (bbox.x2 - bbox.x1) * 1 / 2 * (bbox.x1 > this.canvas.width / 2 ? 0.75 : 0.25),
                y: bbox.y1 + (bbox.y2 - bbox.y1) * 3 / 32,
                width: (bbox.x2 - bbox.x1) * 1 / 2,
                height: (bbox.y2 - bbox.y1) * 3 / 8,
            }
        };
    };
}
