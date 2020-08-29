import React, { Component } from "react";
import { NDCombatTest } from "neon-district-spine-threejs";

export default class CombatTest extends Component {
  render() {
    return (
      <div style={{"width":800,"height":640}}>
        <NDCombatTest
          baseUrl="./spine-assets/"
          width={800}
          height={640}
          position={{"y":200,"z":300}}
        />
      </div>
    );
  }
}
