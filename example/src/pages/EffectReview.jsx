import React, { Component } from "react";
import { NDCombatScene } from "neon-district-spine-threejs";
import Backgrounds from "../data/Backgrounds.jsx";

export default class EffectReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'background' : 'training-room-001',
      'effectSrc'  : null
    };

    this.characters = [
      {
        'position' : 1,
        'scale'    : 'character',
        'skin'     : 'Female',
        'pose'     : 'BladeSml_BaseIdle_001',
        'outfit'   : ['female', 'natoshi', 'legendary']
      },
      {
        'position' : 5,
        'scale'    : 'character',
        'skin'     : 'Male',
        'pose'     : 'EnergyMed_BasicIdle_001',
        'outfit'   : ['male', 'blkorigingenius', 'common']
      }
    ];
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
      <span style={{"margin":"0px 5px 0 0"}}>
        <select name={"background-selection"} id={"background-selection"} onChange={this.updateState.bind(this, field)}>>
          {Backgrounds.backgrounds.map((key) => <option name={"background-selection"} value={key}>{key}</option>)}
        </select>
        {this.backForwardButtons("background-selection")}
      </span>
    );
  }

  generateEffectOptions() {
    return (
      <span>
        <input style={{"margin":"0px 5px"}} type="file" accept="video/webm" onChange={this.handleVideoTextureUpload.bind(this)} />
        <label style={{"margin":"0px 5px"}} for="xPosVfx0">
          X:
          <input type="number" style={{width: "3em"}} placeholder="0" name="xPosVfx0" onChange={this.changeXPos.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} for="yPosVfx0">
          Y:
          <input type="number" style={{width: "3em"}} placeholder="125" name="yPosVfx0" onChange={this.changeYPos.bind(this)} />
        </label>

        <label style={{"margin":"0px 5px"}} for="widthVfx0">
          Width:
          <input type="number" style={{width: "3em"}} placeholder="200" name="widthVfx0" onChange={this.changeWidth.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} for="heightVfx0">
          Height:
          <input type="number" style={{width: "3em"}} placeholder="400" name="heightVfx0" onChange={this.changeHeight.bind(this)} />
        </label>
      </span>
    );
  }

  handleVideoTextureUpload(event) {
    try {
      if (event && event.target && event.target.files && event.target.files.length) {
        let file = event.target.files[0];
        this.setState({
          'effectSrc' : window.URL.createObjectURL(file)
        });
      }
    } catch (ex) {
      alert("Could not find valid file");
    }
  }

  changeXPos(event) {
    try {
      if (event && event.target && event.target.value) {
        this.setState({
          'effectXPos' : event.target.value
        });
      }
    } catch (_) {}
  }

  changeYPos(event) {
    try {
      if (event && event.target && event.target.value) {
        this.setState({
          'effectYPos' : event.target.value
        });
      }
    } catch (_) {}
  }

  changeWidth(event) {
    try {
      if (event && event.target && event.target.value) {
        this.setState({
          'effectWidth' : event.target.value
        });
      }
    } catch (_) {}
  }

  changeHeight(event) {
    try {
      if (event && event.target && event.target.value) {
        this.setState({
          'effectHeight' : event.target.value
        });
      }
    } catch (_) {}
  }

  render() {
    // NOTE: We use `key` to force creating a new component, it must change
    let key = this.state.background;

    return (
      <div className="background-review">
        <div style={{"width":1024,"height":600}}>
          <NDCombatScene
            width={1024}
            height={600}
            characters={this.characters}
            background={this.state.background}
            effectTest={{
              'src'  : this.state.effectSrc,
              'size' : {'width' : this.state.effectWidth || 200, 'height' : this.state.effectHeight || 400},
              'pos'  : {'x_pos' : this.state.effectXPos || 0, 'y_pos' : this.state.effectYPos || 125}
            }}
            key={key}
          />
        </div>
        <div className="background-options">
          {this.generateBackgroundSelects()}
          {this.generateEffectOptions()}
        </div>
      </div>
    );
  }
}
