import React from "react";
import { HUDComponent } from "./core/HUDComponent.jsx";

import { Text } from "pizza-juice";

export class VersionDisplay extends HUDComponent {
  render() {
    console.log("** Rendering the Version Display **");

    return (
      <Text>
        Neon District Combat Engine
        <br />
        <small>Alpha - Version 0.5.1</small>
      </Text>
    );
  }
}
