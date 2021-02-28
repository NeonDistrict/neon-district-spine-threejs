import React, { Component } from "react";
import lstyle from "../../styles/hud.scss";

export class ErrorDisplay extends Component {

  restartAnimation(event) {
    event.target.classList.remove(lstyle.playAnimation);
    void event.target.offsetWidth;
  }

  render() {
    console.log("** Rendering the Error Display **");

    return (
      <div className={[lstyle.errorDisplay, (this.props.error ? lstyle.playAnimation : "")].join(' ')} onAnimationEnd={this.restartAnimation}>
        {this.props.error}
      </div>
    );
  }

}
