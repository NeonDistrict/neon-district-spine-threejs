import React, { Component } from "react";
import { NDCombatScene } from "neon-district-spine-threejs";
import Backgrounds from "../data/Backgrounds.jsx";

export default class BackgroundReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'background' : 'training-room-001'
    };
  }

  componentDidMount() {
    document.getElementById("background-selection").value = 'training-room-001';
  }

  updateState(id) {
    let el = document.getElementById("background-selection");
    this.setState({'background' : el.value});
  }

  prevOption(id) {
    let e = document.getElementById(id);
    let index = (e.selectedIndex-1)%e.options.length;
    if (index < 0) index = e.options.length-1;
    e.value = e.options[index].value;
    this.updateState(id)
  }

  nextOption(id) {
    let e = document.getElementById(id);
    e.value = e.options[(e.selectedIndex+1)%e.options.length].value;
    this.updateState(id)
  }

  backForwardButtons(id) {
    return (
      <span>
        <span className="arrow" onClick={this.prevOption.bind(this, id)}>&#8592;</span>
        <span className="arrow" onClick={this.nextOption.bind(this, id)}>&#8594;</span>
      </span>
    );
  }

  generateBackgroundSelects(field) {
    return (
      <div>
        <select name={"background-selection"} id={"background-selection"} onChange={this.updateState.bind(this, field)}>>
          {Backgrounds.backgrounds.map((key) => <option name={"background-selection"} value={key}>{key}</option>)}
        </select>
        {this.backForwardButtons("background-selection")}
      </div>
    );
  }

  render() {
    return (
      <div className="background-review">
        <div style={{"width":1024,"height":600}}>
          <NDCombatScene
            width={1024}
            height={600}
            background={this.state.background}
            key={this.state.background/* we use this to force creating a new component */}
          />
        </div>
        <div className="background-options">
          {this.generateBackgroundSelects()}
        </div>
      </div>
    );
  }
}
