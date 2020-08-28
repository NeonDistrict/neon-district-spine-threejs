import React, { Component } from "react";
import { NDCombatTest } from "neon-district-spine-threejs";

export default class CombatTest extends Component {
  render() {
    return (
      <div style={{"width":640,"height":480}}>
        <NDCombatTest
          baseUrl="./spine-assets/"
          width={640}
          height={480}
        />
      </div>
    );
  }
}
