import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Scene } from "./Scene.jsx";
import lstyle from "../styles/loader.css";

export class SpineScene extends Scene {
  constructor(props) {
    super(props);

    // Create the asset manager
    this.baseUrl = props.baseUrl;
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
    if (this.assetManager.isLoadingComplete()) {

      // Create the root mesh to apply all other objects
      let mesh = new THREE.Mesh();
      this.scene.add(mesh);

      // Load all provided skeletons in order
      for (let skeleton of this.skeletons) {
        mesh.add(skeleton);
      }

      // Request first animation frame
      this.lastFrameTime = Date.now() / 1000;
      requestAnimationFrame(this.animate.bind(this));
    } else requestAnimationFrame(this.load.bind(this));
  }

  animate() {
    // calculate delta time for animation purposes
    let now = Date.now() / 1000;
    let delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // update the animation
    for (let skeleton of this.skeletons) {
      skeleton.update(delta);
    }

    // render the scene
    this.renderer.render(this.scene, this.camera);

    // if we're still loading, done
    if (this.state.isLoading) {
      this.setState({'isLoading' : false});
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    let classes = lstyle.loader;
    if (!this.state.isLoading) {
      classes = "";
    }

    return <div className={classes} />;
  }
}
