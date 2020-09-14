import React, { Component } from "react";
import { Stage } from "../core/Stage.jsx";

export class CombatScene extends Stage {
  constructor(props) {
    super(props);
    this.background = props.background;
    this.characters = props.characters || [];
  }
}
