import React from "react";

import { Box } from "pizza-juice";

import { Character } from "../character/index.jsx";
import { HUDComponent } from "../../core/HUDComponent.jsx";

export class PlayerControlsCharacter extends HUDComponent {
  render() {
    console.log("** Rendering the Player Controls Character **");

    return (
      <Box
        css={{
          bg:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 53.85%, rgba(0, 0, 0, 0) 100%)"
        }}
      >
        <Character
          character={this.props.character}
          alt={
            this.props.character.metadata && this.props.character.metadata.name
          }
        />
      </Box>
    );
  }
}
