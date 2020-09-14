import React, { Component } from "react";
import { NDCombatTest } from "neon-district-spine-threejs";

export default class CombatTest extends Component {
  render() {
    return (
      <div style={{"width":960,"height":540}}>
        <NDCombatTest
          baseUrl="./spine-output/"
          width={960}
          height={540}
        />
      </div>
    );
  }
}
