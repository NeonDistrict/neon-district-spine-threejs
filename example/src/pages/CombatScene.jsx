import React, { Component } from "react";
import { NDCombatScene } from "neon-district-spine-threejs";

export default class CombatScene extends Component {
  render() {
    return (
      <div style={{"width":960,"height":540}}>
        <NDCombatScene
          baseUrl="./spine-assets/"
          width={960}
          height={540}
        />
      </div>
    );
  }
}
