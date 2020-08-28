import React, { Component } from "react";
import * as THREE from "three";
import { Scene } from "./Scene.jsx";

export class CubeTest extends Scene {
	constructor(props) {
		super(props);

		this.color = props.color || "green";
   		this.cube = null;
	}

	componentDidMount() {
		super.componentDidMount(arguments);

		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: this.color } );
		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add(this.cube);
		this.camera.position.z = 5;
		this.animate.call(this);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.cube.rotation.x += 0.01;
		this.cube.rotation.y += 0.01;
		this.renderer.render(this.scene, this.camera);
	}
}
