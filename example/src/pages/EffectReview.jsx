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
        'position' : -1,
        'scale'    : 'character',
        'skin'     : 'Female',
        'pose'     : 'BladeSml_BaseIdle_001',
        'outfit'   : ['female', 'natoshi', 'legendary']
      }
    ];

    this.blendModes = [
      "NoBlending",
      "NormalBlending",
      "AdditiveBlending",
      "SubtractiveBlending",
      "MultiplyBlending"
    ];
  }

  componentDidMount() {
    document.getElementById("background-selection").value = 'training-room-001';
    document.getElementById('effect-blend-mode').value = 'NormalBlending';
    document.getElementById('xPosVfx0').value = 0;
    document.getElementById('yPosVfx0').value = 125;
    document.getElementById('widthVfx0').value = 200;
    document.getElementById('heightVfx0').value = 400;
    document.getElementById('rotationVfx0').value = 0;
    document.getElementById('scaleVfx0').value = 1.0;
    document.getElementById('speedVfx0').value = 1.0;
    document.getElementById('opacityVfx0').value = 1.0;
  }

  updateState(id) {
    let el = document.getElementById("background-selection");
    this.setState({'background' : el.value});
  }

  updateBlendMode(id) {
    let el = document.getElementById("effect-blend-mode");
    this.setState({'effectBlendMode' : el.value});
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

  getVideoSettings() {
    let settings = "";
    let files = document.getElementById('effect-video').files;
    if (files && files.length) {
      settings += document.getElementById('effect-video').files[0].name + "\t";
    } else {
      settings += "UNTITLED\t";
    }
    settings += document.getElementById('effect-blend-mode').value + "\t";
    settings += document.getElementById('xPosVfx0').value + "\t";
    settings += document.getElementById('yPosVfx0').value + "\t";
    settings += document.getElementById('widthVfx0').value + "\t";
    settings += document.getElementById('heightVfx0').value + "\t";
    settings += document.getElementById('rotationVfx0').value + "\t";
    settings += document.getElementById('scaleVfx0').value + "\t";
    settings += document.getElementById('speedVfx0').value + "\t";
    settings += document.getElementById('opacityVfx0').value + "\t";
    settings += document.getElementById('flipXVfx0').checked + "\t";
    settings += document.getElementById('flipYVfx0').checked;
    return settings;
  }

  copySettings() {
    // Construct it
    let copySettings = document.getElementById('copySettings');
    copySettings.value = this.getVideoSettings();

    // Copy it
    copySettings.select();
    document.execCommand("copy");
  }

  generateFileUpload() {
    return (
      <span>
        <input style={{"margin":"0px 5px"}} id={"effect-video"} type="file" accept="video/webm" onChange={this.handleVideoTextureUpload.bind(this)} />
        <select name={"effect-blend-mode"} id={"effect-blend-mode"} onChange={this.updateBlendMode.bind(this)}>>
          {this.blendModes.map((key) => <option name={"effect-blend-mode"} value={key}>{key}</option>)}
        </select>
        <button style={{"margin":"0px 5px"}} onClick={this.copySettings.bind(this)}>
          Copy Settings to Clipboard
        </button>
      </span>
    );
  }

  generateEffectOptions() {
    return (
      <span style={{"padding":"6px 0px"}}>
        <label style={{"margin":"0px 5px"}} htmlFor="xPosVfx0">
          X:
          <input type="number" style={{width: "3em"}} placeholder="0" id="xPosVfx0" name="xPosVfx0" onChange={this.changeXPos.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} htmlFor="yPosVfx0">
          Y:
          <input type="number" style={{width: "3em"}} placeholder="125" id="yPosVfx0" name="yPosVfx0" onChange={this.changeYPos.bind(this)} />
        </label>

        <label style={{"margin":"0px 5px"}} htmlFor="widthVfx0">
          Width:
          <input type="number" style={{width: "3em"}} placeholder="200" id="widthVfx0" name="widthVfx0" onChange={this.changeWidth.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} htmlFor="heightVfx0">
          Height:
          <input type="number" style={{width: "3em"}} placeholder="400" id="heightVfx0" name="heightVfx0" onChange={this.changeHeight.bind(this)} />
        </label>

        <label style={{"margin":"0px 5px"}} htmlFor="rotationVfx0">
          Rotation (Rad):
          <input type="number" style={{width: "3em"}} placeholder="0" step="0.01" id="rotationVfx0" name="rotationVfx0" onChange={this.changeRotation.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} htmlFor="scaleVfx0">
          Scale:
          <input type="number" style={{width: "3em"}} placeholder="1.0" step="0.01" id="scaleVfx0" name="scaleVfx0" onChange={this.changeScale.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} htmlFor="speedVfx0">
          Speed:
          <input type="number" style={{width: "3em"}} placeholder="1.0" step="0.01" id="speedVfx0" name="speedVfx0" onChange={this.changeSpeed.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} htmlFor="speedVfx0">
          Opacity:
          <input type="number" style={{width: "3em"}} placeholder="1.0" step="0.01" min="0.0" max="1.0" id="opacityVfx0" name="opacityVfx0" onChange={this.changeOpacity.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} htmlFor="speedVfx0">
          Flip X:
          <input type="checkbox" id="flipXVfx0" name="flipXVfx0" onChange={this.changeFlipX.bind(this)} />
        </label>
        <label style={{"margin":"0px 5px"}} htmlFor="speedVfx0">
          Flip Y:
          <input type="checkbox" id="flipYVfx0" name="flipYVfx0" onChange={this.changeFlipY.bind(this)} />
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
      if (event && event.target) {
        this.setState({
          'effectXPos' : event.target.value
        });
      }
    } catch (_) {}
  }

  changeYPos(event) {
    try {
      if (event && event.target) {
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

  changeRotation(event) {
    try {
      if (event && event.target) {
        this.setState({
          'effectRotation' : event.target.value
        });
      }
    } catch (_) {}
  }

  changeScale(event) {
    try {
      if (event && event.target && event.target.value) {
        this.setState({
          'effectScale' : event.target.value
        });
      }
    } catch (_) {}
  }

  changeSpeed(event) {
    try {
      if (event && event.target && event.target.value) {
        this.setState({
          'effectSpeed' : event.target.value
        });
      }
    } catch (_) {}
  }

  changeFlipX(event) {
    try {
      if (event && event.target) {
        this.setState({
          'effectFlipX' : event.target.checked
        });
      }
    } catch (_) {}
  }

  changeFlipY(event) {
    try {
      if (event && event.target) {
        this.setState({
          'effectFlipY' : event.target.checked
        });
      }
    } catch (_) {}
  }

  changeOpacity(event) {
    try {
      if (event && event.target && event.target.value) {
        this.setState({
          'effectOpacity' : event.target.value
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
              'src'      : this.state.effectSrc,
              'size'     : {'width' : this.state.effectWidth || 200, 'height' : this.state.effectHeight || 400},
              'pos'      : {'x_pos' : this.state.effectXPos || 0, 'y_pos' : this.state.effectYPos || 125},
              'scale'    : this.state.effectScale || 1.0,
              'rotation' : this.state.effectRotation || 0.0,
              'opacity'  : this.state.effectOpacity || 1.0,
              'speed'    : this.state.effectSpeed || 1.0,
              'blend'    : this.state.effectBlendMode || 'NormalBlending',
              'flipX'    : this.state.effectFlipX || false,
              'flipY'    : this.state.effectFlipY || false
            }}
            key={key}
          />
        </div>
        <div className="background-options">
          {this.generateBackgroundSelects()}
          {this.generateFileUpload()}
          <br />
          {this.generateEffectOptions()}
          <br />
          <input type="text" id="copySettings" />
        </div>
      </div>
    );
  }
}
