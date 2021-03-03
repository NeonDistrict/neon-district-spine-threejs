import React from "react";
import { HUDComponent } from './core/HUDComponent.jsx';
import lstyle from "../../styles/hud.scss";

export class ErrorDisplay extends HUDComponent {

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
