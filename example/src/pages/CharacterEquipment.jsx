import React, { Component } from "react";
import { NDCharacterEquipment } from "neon-district-spine-threejs";
import EquipmentSets from "../data/EquipmentSets.jsx";

export default class CharacterEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'animation'   : 'BladeMed_BaseAtk_001',
      'gender'      : 'male',
      'head-suit'   : 'none',
      'head-rarity' : 'common',
      'body-suit'   : 'none',
      'body-rarity' : 'common',
      'arms-suit'   : 'none',
      'arms-rarity' : 'common',
      'legs-suit'   : 'none',
      'legs-rarity' : 'common'
    };
  }

  componentDidMount() {
    document.getElementsByName("char-equip-gender")[0].checked = true;
    document.getElementsByName("char-equip-head-rarity")[0].checked = true;
    document.getElementsByName("char-equip-body-rarity")[0].checked = true;
    document.getElementsByName("char-equip-arms-rarity")[0].checked = true;
    document.getElementsByName("char-equip-legs-rarity")[0].checked = true;
    document.getElementsByName("char-equip-all-rarity")[0].checked = true;
  }

  updateState(allCheck) {
    if (allCheck === 'all') {
      document.getElementById("char-equip-head").value = document.getElementById("char-equip-all").value;
      document.getElementById("char-equip-body").value = document.getElementById("char-equip-all").value;
      document.getElementById("char-equip-arms").value = document.getElementById("char-equip-all").value;
      document.getElementById("char-equip-legs").value = document.getElementById("char-equip-all").value;

      let els = document.getElementsByName("char-equip-all-rarity");
      for (let id in els) {
        document.getElementsByName("char-equip-head-rarity")[id].checked = els[id].checked;
        document.getElementsByName("char-equip-body-rarity")[id].checked = els[id].checked;
        document.getElementsByName("char-equip-arms-rarity")[id].checked = els[id].checked;
        document.getElementsByName("char-equip-legs-rarity")[id].checked = els[id].checked;
      }
    }

    let ids = {
      "animation"   : "char-equip-animation",
      "gender"      : "char-equip-gender",
      "head-suit"   : "char-equip-head",
      "head-rarity" : "char-equip-head-rarity",
      "body-suit"   : "char-equip-body",
      "body-rarity" : "char-equip-body-rarity",
      "arms-suit"   : "char-equip-arms",
      "arms-rarity" : "char-equip-arms-rarity",
      "legs-suit"   : "char-equip-legs",
      "legs-rarity" : "char-equip-legs-rarity"
    };

    let values = {};
    for (let id in ids) {
      let el = document.getElementById(ids[id]);
      let value = el.value;
      if (id === 'gender' || id.indexOf('rarity') !== -1) {
        let els = document.getElementsByName(ids[id]);
        for (let el of els) {
          if (el.checked) {
            value = el.value;
          }
        }
      }

      values[id] = value;
    }

    // Re-render
    this.setState(values);
  }

  orderSets() {
    let suits = {
      "none" : {
        "name" : "None",
        "slug" : "none",
        "rarity" : []
      }
    };
    for (let set of EquipmentSets.sets) {
      if (!suits.hasOwnProperty(set[0])) {
        suits[set[0]] = {
          'slug'     : set[0],
          'name'     : set[2],
          'rarities' : []
        };
      }

      suits[set[0]].rarities.push(set[1]);
    }

    return suits;
  }

  generateSuitSelects(field, suits) {
    let options = [];
    for (let slug in suits) {
      options.push(
        <option name={"char-equip-" + field} value={slug}>{suits[slug].name}</option>
      );
    }

    return (
      <div>
        <select name={"char-equip-" + field} id={"char-equip-" + field} onChange={this.updateState.bind(this, field)}>
          {options}
        </select>
        {this.backForwardButtons("char-equip-" + field)}
      </div>
    );
  }

  generateRarityRadios(field) {
    return (
      <div className={"char-equip-rarity-inputs"} id={"char-equip-" + field + "-rarity"}>
        <label>
          C <input type="radio" name={"char-equip-" + field + "-rarity"} value="common" onChange={this.updateState.bind(this)} />
        </label>
        <label>
          U <input type="radio" name={"char-equip-" + field + "-rarity"} value="uncommon" onChange={this.updateState.bind(this)} />
        </label>
        <label>
          R <input type="radio" name={"char-equip-" + field + "-rarity"} value="rare" onChange={this.updateState.bind(this)} />
        </label>
        <label>
          UR <input type="radio" name={"char-equip-" + field + "-rarity"} value="ultrarare" onChange={this.updateState.bind(this)} />
        </label>
        <label>
          L <input type="radio" name={"char-equip-" + field + "-rarity"} value="legendary" onChange={this.updateState.bind(this)} />
        </label>
      </div>
    );
  }

  prevOption(id) {
    let e = document.getElementById(id);
    let index = (e.selectedIndex-1)%e.options.length;
    if (index < 0) index = e.options.length-1;
    e.value = e.options[index].value;
    this.updateState()
  }

  nextOption(id) {
    let e = document.getElementById(id);
    e.value = e.options[(e.selectedIndex+1)%e.options.length].value;
    this.updateState()
  }

  backForwardButtons(id) {
    return (
      <span>
        <span className="arrow" onClick={this.prevOption.bind(this, id)}>&#8592;</span>
        <span className="arrow" onClick={this.nextOption.bind(this, id)}>&#8594;</span>
      </span>
    );
  }

  generateAnimationSelects(field) {
    return (
      <div>
        <select name={"char-equip-animation"} id={"char-equip-animation"} onChange={this.updateState.bind(this)}>>
          {EquipmentSets.animations.map((anim) => <option name={"char-equip-animation"} value={anim}>{anim}</option>)}
        </select>
        {this.backForwardButtons("char-equip-animation")}
      </div>
    );
  }

  generateGenderRadios() {
    return (
      <div className={"char-equip-gender-inputs"} id={"char-equip-gender"}>
        <label>
          Male <input type="radio" name={"char-equip-gender"} value="male" onChange={this.updateState.bind(this)} />
        </label>
        <label>
          Female <input type="radio" name={"char-equip-gender"} value="female" onChange={this.updateState.bind(this)} />
        </label>
      </div>
    );
  }

  render() {
    let suits = this.orderSets();

    return (
      <div className="char-equip">
        <div style={{"width":680,"height":600}}>
          <NDCharacterEquipment
            baseUrl="./spine-assets/"
            width={680}
            height={600}
            animation={this.state.animation}
            gender={this.state.gender}
            head={this.state["head-suit"]}
            headRarity={this.state["head-rarity"]}
            body={this.state["body-suit"]}
            bodyRarity={this.state["body-rarity"]}
            arms={this.state["arms-suit"]}
            armsRarity={this.state["arms-rarity"]}
            legs={this.state["legs-suit"]}
            legsRarity={this.state["legs-rarity"]}
          />
        </div>
        <div className="char-equip-options">
          <h3>Animation / Weapon & Gender</h3>
          {this.generateAnimationSelects()}
          {this.generateGenderRadios()}
          <hr />
          <h3>Head</h3>
          {this.generateSuitSelects("head", suits)}
          {this.generateRarityRadios("head")}
          <h3>Body</h3>
          {this.generateSuitSelects("body", suits)}
          {this.generateRarityRadios("body")}
          <h3>Arms</h3>
          {this.generateSuitSelects("arms", suits)}
          {this.generateRarityRadios("arms")}
          <h3>Legs</h3>
          {this.generateSuitSelects("legs", suits)}
          {this.generateRarityRadios("legs")}
          <hr />
          <h3>Full Outfit</h3>
          {this.generateSuitSelects("all", suits)}
          {this.generateRarityRadios("all")}
        </div>
      </div>
    );
  }
}
