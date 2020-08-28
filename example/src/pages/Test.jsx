import React, { Component } from "react";
import { ColoredHeadingOne, ColoredHeadingTwo } from "neon-district-spine-threejs";

export default class Test extends Component {
  render() {
    return (
      <div>

        <ColoredHeadingOne
          text="Testing imported package from root"
          color={"#ff7db6"}
        />

        {/* Our other component */}
        <ColoredHeadingTwo
          text="Testing imported package from root"
          color={"#87d3e6"}
        />

      </div>

    )
  }
}
