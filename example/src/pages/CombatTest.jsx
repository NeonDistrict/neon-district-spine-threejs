import React, { Component } from "react";
import { NDCombatTest } from "neon-district-spine-threejs";

export default class CombatTest extends Component {
  render() {
    return <NDCombatTest
			width={400}
			height={400}
			position={{'y':0,'z':0}}
		/>;
  }
}
