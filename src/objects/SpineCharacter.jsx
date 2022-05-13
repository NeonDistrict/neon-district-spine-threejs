const sprite_sheeter_url = 'http://50.16.64.96';
const content_delivery_url = 'https://neon-district-cdn.s3.amazonaws.com/';

export class SpineCharacter {
    constructor(scale, gender, skin_tone, gear) {
        this.scale = scale;
        this.gender = gender;
        this.skin_tone = skin_tone;
        this.gear = gear;
    };

    async load (offset_x, offset_y, flip_x) {
        const asset_request_parts = [];
        asset_request_parts.push(sprite_sheeter_url + '/asset_urls?rig=human');
        asset_request_parts.push(`scale=${this.scale}`);
        asset_request_parts.push(`skin_tone=${this.skin_tone}`);
        asset_request_parts.push(`gender=${this.gender}`);
        asset_request_parts.push(`head_slug_name=${this.gear.head ? this.gear.head.slug_name : null}`);
        asset_request_parts.push(`head_rarity=${this.gear.head ? this.gear.head.rarity : null}`);
        asset_request_parts.push(`head_variant=${this.gear.head ? this.gear.head.variant : null}`);
        asset_request_parts.push(`body_slug_name=${this.gear.body ? this.gear.body.slug_name : null}`);
        asset_request_parts.push(`body_rarity=${this.gear.body ? this.gear.body.rarity : null}`);
        asset_request_parts.push(`body_variant=${this.gear.body ? this.gear.body.variant : null}`);
        asset_request_parts.push(`arms_slug_name=${this.gear.arms ? this.gear.arms.slug_name : null}`);
        asset_request_parts.push(`arms_rarity=${this.gear.arms ? this.gear.arms.rarity : null}`);
        asset_request_parts.push(`arms_variant=${this.gear.arms ? this.gear.arms.variant : null}`);
        asset_request_parts.push(`legs_slug_name=${this.gear.legs ? this.gear.legs.slug_name : null}`);
        asset_request_parts.push(`legs_rarity=${this.gear.legs ? this.gear.legs.rarity : null}`);
        asset_request_parts.push(`legs_variant=${this.gear.legs ? this.gear.legs.variant : null}`);
        asset_request_parts.push(`weapon_slug_name=${this.gear.weapon ? this.gear.weapon.slug_name : null}`);
        asset_request_parts.push(`weapon_rarity=${this.gear.weapon ? this.gear.weapon.rarity : null}`);
        asset_request_parts.push(`weapon_variant=${this.gear.weapon ? this.gear.weapon.variant : null}`);
        const asset_request = asset_request_parts.join('&');
        this.assets = await download.json(asset_request);

        // download the spine atlas and json files and create the texture atlas
        this.atlas_file = await download.text(`${content_delivery_url}spine_export/human/${this.gender}/${this.scale}/Med_Biped_MF_V_01.atlas`);
        this.spine_json_file = await download.json(`${content_delivery_url}spine_export/human/${this.gender}/Med_Biped_MF_V_01.json`);
        this.skeleton_atlas = new spine.TextureAtlas(this.atlas_file);

        // download all the sprite sheets, loading them into textures, and associating those textures with the spine atlas pages
        this.sprite_sheet_infos = [];
        for (let sprite_sheet_index = 0; sprite_sheet_index < sprite_sheet_urls.length; sprite_sheet_index++) {
            const sprite_sheet_url = this.sprite_sheet_urls[sprite_sheet_index];
            const sprite_sheet = await download.image(sprite_sheet_url);
            const sprite_sheet_texture = new spine.GLTexture(this.gl, sprite_sheet);
            this.sprite_sheet_infos.push({
                sprite_sheet_url: sprite_sheet_url,
                sprite_sheet: sprite_sheet,
                sprite_sheet_texture: sprite_sheet_texture
            });
            this.skeleton_atlas.pages[sprite_sheet_index].setTexture(sprite_sheet_texture);
        }

        // create the skeleton and animation setup for the character
        this.atlas_loader = new spine.AtlasAttachmentLoader(this.skeleton_atlas);
        this.skeleton_json = new spine.SkeletonJson(this.atlas_loader);
        this.skeleton_data = this.skeleton_json.readSkeletonData(this.spine_json_file);
        this.skeleton = new spine.Skeleton(this.skeleton_data);
        this.skin_name = this.gender_to_spine_skin_name(this.gender);
        this.skeleton.setSkinByName(this.skin_name);
        this.animation_state_data = new spine.AnimationStateData(this.skeleton);
        this.animation_state = new spine.AnimationState(this.animation_state_data);
        this.animation_state.pause = false;

        // create a skeleton_mesh from the data and return it so it can be attached to the scene
        this.skeleton_mesh = new spine.threejs.SkeletonMesh(this.skeleton_data, (options)  => {
            options.depthTest = false;
        });
        if (flip_x) {
            this.skeleton_mesh.skeleton.scaleX = -1
        }
        this.skeleton_mesh.skeleton.scaleY = -1
        this.skeleton_mesh.skeleton.x = offset_x;
        this.skeleton_mesh.skeleton.y = offset_y;
        return this.skeleton_mesh;
    };

    gender_to_spine_skin_name (gender) {
        switch (gender.toLowerCase()) {
            case 'male':
                return 'Male';
            case 'female':
                return 'Female';
            default:
                throw new Error('Unexpected gender, must be one of "male" or "female"');
        }
    };

    animate (animation_names) {
        // all animations will play once, then the final animation will loop, ie. [attack_anim, idle_anim], or [hit_anim, death_idle_anim], or even just [idle_anim]
        for (let animation_index = 0; animation_index < animation_names.length; animation_index++) {
            const animation_name = animation_names[animation_index];
            const loop = animation_index === animation_names.length - 1;
            if (animation_index === 0) {
                this.animation_state.setAnimation(0, animation_name, loop);
            } else {
                this.animation_state.addAnimation(0, animation_name, loop);
            }
        }

        // prime animation to first frame
        this.animation_state.update(0)
    };

    pause_animations () {
        this.animation_state.pause = true;
    };

    play_animations () {
        this.animation_state.pause = false;
    };

    set_animation_jog (percent) {
        const animation_track = this.animation_state.tracks[0];
        animation_track.trackTime = animation_track.animation.duration * percent;
    };

    get_animation_jog () {
        // note trackTime will increase forever but wraps around so wrapped_jog of 2.0 is the start of the
        // second animation play through, so need to remove the value before the decimal to provide a 0->1
        const animation_track = this.animation_state.tracks[0];
        const wrapped_jog = animation_track.trackTime / animation_track.animation.duration;
        return wrapped_jog - Math.floor(wrapped_jog);
    };

    get_animation_list () {
        return this.skeleton_data.animations.map((animation) => { return animation.name; });
    };

    update (delta_time) {
        this.animation_state.update(this.animation_state.pause ? 0 : delta_time);
        this.animation_state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();
    };
};
