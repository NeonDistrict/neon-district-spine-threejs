import React from "react";
import { HUDComponent } from './core/HUDComponent.jsx';
import lstyle from "../../styles/hud.scss";

export class VersionDisplay extends HUDComponent {

  render() {
    console.log("** Rendering the Version Display **");

    return (
      <h5 className={lstyle.versionDisplayWrapper}>
        Neon District Combat Engine<br />
        <small>Alpha - Version 0.5.0</small>
      </h5>
    );
  }

}
