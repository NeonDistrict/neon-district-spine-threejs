import React, { Component } from "react";
import lstyle from "../../styles/hud.scss";

export class PlayerTargetMap extends Component {

  selectTargetCallback(target) {
    if (this.props.playerSelections.validateTargetSelect(target)) {
      this.props.playerSelections.setTarget(target);
    }
  }

  render() {
    console.log("** Rendering the Player Target Map **");

    let targets = [];
    for (let region of this.props.unitSelectionFields.getRegions()) {
      let coords = region.region.join(',');
      targets.push(<div style={{
        display:'block',
        position:'absolute',
        top:region.region[1],
        left:region.region[0],
        height:region.region[3]-region.region[1],
        width:region.region[2]-region.region[0],
        backgroundColor:'rgba(255,255,255,0.0)'
      }} onClick={this.selectTargetCallback.bind(this, region.target)}></div>)
    }

    return (
      <div>
        {targets}
      </div>
    );
  }

}
