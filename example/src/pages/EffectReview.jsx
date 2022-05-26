import { NDCombatScene } from "neon-district-spine-threejs";
import React, { Component } from "react";
import Backgrounds from "../data/Backgrounds.jsx";
import VisualEffects from "../data/VisualEffects.jsx";

export default class EffectReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      background: "training-room-001",
      visualEffect: ""
    };

    this.characters = [
      {
        position: 0,
        scale: "character",
        skin: "Male",
        pose: "RifleSml_BasicIdle_001"
        //'outfit'   : ['male', 'plasmabearssuit', 'legendary']
      },
      {
        position: 1,
        scale: "character",
        skin: "Female",
        pose: "BladeSml_BaseIdle_001"
        //'outfit'   : ['female', 'natoshi', 'legendary']
      },
      {
        position: 2,
        scale: "character",
        skin: "Female",
        pose: "BladeSml_BaseIdle_001"
        //'outfit'   : ['female', 'natoshi', 'legendary']
      },
      {
        position: 3,
        scale: "character",
        skin: "Female",
        pose: "BladeSml_BaseIdle_001"
        //'outfit'   : ['female', 'natoshi', 'legendary']
      },
      {
        position: 4,
        scale: "character",
        skin: "Female",
        pose: "BladeSml_BaseIdle_001"
        //'outfit'   : ['female', 'natoshi', 'legendary']
      },
      {
        position: 5,
        scale: "character",
        skin: "Male",
        pose: "RifleSml_BasicIdle_001"
        //'outfit'   : ['male', 'plasmabearssuit', 'legendary']
      },
      {
        position: 6,
        scale: "character",
        skin: "Male",
        pose: "RifleSml_BasicIdle_001"
        //'outfit'   : ['male', 'plasmabearssuit', 'legendary']
      },
      {
        position: 7,
        scale: "character",
        skin: "Male",
        pose: "RifleSml_BasicIdle_001"
        //'outfit'   : ['male', 'plasmabearssuit', 'legendary']
      }
    ];
  }

  componentDidMount() {
    document.getElementById("background-selection").value = "training-room-001";
    document.getElementById("visual-effect").value = "";
  }

  updateState(id, key) {
    let el = document.getElementById(id);
    this.setState({ [key]: el.value });
  }

  prevOption(id, key) {
    let e = document.getElementById(id);
    let index = (e.selectedIndex - 1) % e.options.length;
    if (index < 0) index = e.options.length - 1;
    e.value = e.options[index].value;
    this.updateState(id, key);
  }

  nextOption(id, key) {
    let e = document.getElementById(id);
    e.value = e.options[(e.selectedIndex + 1) % e.options.length].value;
    this.updateState(id, key);
  }

  backForwardButtons(id, key) {
    return (
      <span>
        <span className="arrow" onClick={this.prevOption.bind(this, id, key)}>
          &#8592;
        </span>
        <span className="arrow" onClick={this.nextOption.bind(this, id, key)}>
          &#8594;
        </span>
      </span>
    );
  }

  generateBackgroundSelects() {
    return (
      <span style={{ margin: "0px 5px 0 0" }}>
        <select
          name={"background-selection"}
          id={"background-selection"}
          onChange={this.updateState.bind(
            this,
            "background-selection",
            "background"
          )}
        >
          {Backgrounds.backgrounds.map(key => (
            <option name={"background-selection"} value={key}>
              {key}
            </option>
          ))}
        </select>
        {this.backForwardButtons("background-selection", "background")}
      </span>
    );
  }

  generateVisualEffectsSelects() {
    return (
      <span style={{ margin: "0px 5px 0 0" }}>
        <select
          name={"visual-effect"}
          id={"visual-effect"}
          onChange={this.updateState.bind(
            this,
            "visual-effect",
            "visualEffect"
          )}
        >
          {VisualEffects["visual-effects"].map(key => (
            <option name={"visual-effect"} value={key}>
              {key}
            </option>
          ))}
        </select>
        {this.backForwardButtons("visual-effect", "visualEffect")}
      </span>
    );
  }

  render() {
    // NOTE: We use `key` to force creating a new component, it must change
    let key = this.state.background;

    return (
      <div className="background-review">
        <div style={{ width: 1280, height: 768 }}>
          <NDCombatScene
            width={1280}
            height={768}
            characters={this.characters}
            background={this.state.background}
            effectTest={{
              effectKey: this.state.visualEffect,
              effectIndex: "0"
            }}
            key={key}
          />
        </div>
        <div className="background-options">
          {this.generateBackgroundSelects()}
          {this.generateVisualEffectsSelects()}
        </div>
      </div>
    );
  }
}
