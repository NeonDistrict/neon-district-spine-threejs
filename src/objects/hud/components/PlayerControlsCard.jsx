import React, { Component } from "react";
import lstyle from "../../../styles/hud.scss";

export class PlayerControlsCard extends Component {

  render() {
    console.log("** Rendering the Player Controls Card **");

    let styles = [lstyle.card];
    let wrapperStyle = [lstyle.cardSelectionWrapper, this.props.selected ? lstyle.selected : ''].join(' ');

    if (!this.props.card || !this.props.card.hasOwnProperty('cardId')) {
      return (
        <div className={lstyle.cardSelectionWrapper}>
          <div className={styles}>
            <h3>Empty Card Slot</h3>
            <p>Missing Weapon Equipment</p>
          </div>
        </div>
      );
    }

    let card = this.props.card;
    styles.push(lstyle[card.type.toLowerCase() + 'Card']);

    return (
      <div className={wrapperStyle} onClick={this.props.callback}>
        <div className={styles.join(' ')}>
          <h3>{card.name}</h3>
          <p>{card.effects}</p>
        </div>
      </div>
    );
  }

}
