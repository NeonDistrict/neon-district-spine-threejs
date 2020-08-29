import React, { Component } from "react";
import { NDCharacterEquipment } from "neon-district-spine-threejs";

export default class CharacterEquipment extends Component {
  render() {
    return (
      <div style={{"width":800,"height":640}}>
        <NDCharacterEquipment
          baseUrl="./spine-assets/"
          width={800}
          height={640}
        />
      </div>
    );
  }
}
