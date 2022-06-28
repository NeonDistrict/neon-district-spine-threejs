import React from "react";

import { Flex } from "pizza-juice";

import { Button } from "./components/pizza-juice/button/index.jsx";
import { HUDComponent } from "./core/HUDComponent.jsx";

import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { AiTwotoneSetting } from "react-icons/ai";

import lstyle from "../../styles/hud.scss";

export class SettingsDisplay extends HUDComponent {
  constructor(props) {
    super(props);

    this.soundManager = props.soundManager;

    this.musicOptions = this.soundManager.getMusicOptions();

    this.handleClick = this.toggleAudio.bind(this);

    this.state = {
      audioPlaying: true
    };
  }

  toggleAudio() {
    let currentAudioKey = document.getElementById("currentPlayingAudio").value;

    let audioOption = {};
    for (let option of this.musicOptions) {
      if (currentAudioKey === option.key) {
        audioOption = option;
      }
    }

    if (this.soundManager.hasSound("music", audioOption.key)) {
      if (this.state.audioPlaying) {
        // Currently on, going to stop it
        this.soundManager.stop("music", audioOption.key);
      } else if (!this.state.audioPlaying) {
        // Currently off, going to play it
        this.soundManager.play(
          "music",
          audioOption.key,
          audioOption.volume,
          true
        );
      }
    }

    this.setState({ audioPlaying: !this.state.audioPlaying });
  }

  changeMusic(evt) {
    // Turn off all existing music
    for (let option of this.musicOptions) {
      if (
        this.soundManager.hasSound("music", option.key) &&
        evt.target.value !== option.key
      ) {
        this.soundManager.stop("music", option.key);
      } else if (
        this.soundManager.hasSound("music", option.key) &&
        evt.target.value === option.key &&
        this.state.audioPlaying
      ) {
        this.soundManager.play("music", option.key, option.volume, true);
      }
    }
  }

  render() {
    console.log("** Rendering the Settings Display **");

    let options = [];
    for (let option of this.musicOptions) {
      options.push(<option value={option.key}>{option.name}</option>);
    }

    let displaySelectStyle = {};
    if (this.musicOptions.length <= 1) {
      displaySelectStyle = { display: "none" };
    }

    return (
      <Flex align="center" gap={2} css={{ p: "$2" }}>
        <select
          className={lstyle.settingSetGroupSelect}
          onChange={this.changeMusic.bind(this)}
          id="currentPlayingAudio"
          style={displaySelectStyle}
        >
          {options}
        </select>
        <Button
          color={this.state.audioPlaying ? "primary" : "secondary"}
          onClick={this.handleClick}
        >
          {this.state.audioPlaying ? (
            <MdVolumeUp size={18} />
          ) : (
            <MdVolumeOff size={18} />
          )}
        </Button>

        <Button color="secondary">
          <AiTwotoneSetting size={18} />
        </Button>
      </Flex>
    );
  }
}
