import React, { Component } from "react";
import lstyle from "../../styles/hud.scss";

export class VersionDisplay extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log("SAFETY - RENDER");

    return (
      <h5 className={lstyle.versionDisplayWrapper}>
        Neon District Combat Engine<br />
        <small>Version 0.5.0</small>
      </h5>
    );
  }

}
