import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Scene } from "./Scene.jsx";
import lstyle from "../styles/loader.css";

export class SpineScene extends Scene {
  constructor(props) {
    super(props);

    // Create the asset manager
    this.baseUrl = props.baseUrl || "https://neon-district-season-one.s3.amazonaws.com/";
    this.createAssetManager(this.baseUrl);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    super.componentDidMount(arguments);
  }

  createAssetManager(baseUrl) {
    this.assetManager = new spine.threejs.AssetManager(baseUrl);
  }

  preloadAsset(skeletonFile, atlasFile) {
    if (!this.assetManager) {
      throw "Spine Asset Manager is not initialized.";
    }

    this.assetManager.loadText(skeletonFile);
    this.assetManager.loadTextureAtlas(atlasFile);
  }

  setSkeletons(skeletons) {
    this.skeletons = skeletons;
  }

  load() {
    if (!this.mounted) {
      return;
    }

    if (this.assetManager.isLoadingComplete()) {

      // Create the root mesh to apply all other objects
      this.rootMesh = new THREE.Mesh();
      this.scene.add(this.rootMesh);

      // Load all provided skeletons in order
      for (let skeleton of this.skeletons) {
        this.rootMesh.add(skeleton);
      }

      // Request first animation frame
      this.lastFrameTime = Date.now() / 1000;
      requestAnimationFrame(this.animate.bind(this));
    } else requestAnimationFrame(this.load.bind(this));
  }

  animate() {
    if (!this.mounted) {
      return;
    }

    // calculate delta time for animation purposes
    let now = Date.now() / 1000;
    let delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // make sure nothing is loading
    let isLoading = false;
    for (let skeleton of this.skeletons) {
      if (skeleton.assetLoadingCount > 0) {
        isLoading = true;
        this.setState({'isLoading' : true});
        break;
      }
    }

    // Render the animation
    if (!isLoading) {
      // update the animation
      for (let skeleton of this.skeletons) {
        skeleton.update(delta);
      }

      // render the scene
      this.renderer.autoClear = true;
      this.renderer.render(this.scene, this.camera);

      // render any additional scenes
      this.renderer.autoClear = false;
      this.renderAdditionalScenes(delta);
    }

    // if we're still loading, done
    if (this.state.isLoading && !isLoading) {
      this.setState({'isLoading' : false});
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  renderAdditionalScenes(delta) {
    // Do nothing, just exist
  }

  render() {
    let classes = lstyle.loader;
    if (!this.state.isLoading) {
      classes = "";
    }

    return <div className={classes} />;
  }
}
