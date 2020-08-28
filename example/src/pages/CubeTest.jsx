import React, { Component } from "react";
import { ThreeJSCubeTest } from "neon-district-spine-threejs";

export default class CubeTest extends Component {
  render() {
    return <ThreeJSCubeTest
			width={400}
			height={400}
			position={{'y':0,'z':0}}
			color="red"
		/>;
  }
}
