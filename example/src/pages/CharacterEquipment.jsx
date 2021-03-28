import React, { Component } from "react";
import { NDCharacterEquipment } from "neon-district-spine-threejs";
import EquipmentSets from "../data/EquipmentSets.jsx";

export default class CharacterEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'animation'     : 'Unarmed_BasicIdle_001',
      'gender'        : 'male',
      'skin-tone'     : 1,
      'head-suit'     : '',
      'head-rarity'   : 'common',
      'body-suit'     : '',
      'body-rarity'   : 'common',
      'arms-suit'     : '',
      'arms-rarity'   : 'common',
      'legs-suit'     : '',
      'legs-rarity'   : 'common',
      'weapon'        : '',
      'weapon-rarity' : 'common'
    };
  }

  componentDidMount() {
    document.getElementById("char-equip-animation").value = 'Unarmed_BasicIdle_001';
    document.getElementsByName("char-equip-gender")[0].checked = true;
    document.getElementsByName("char-equip-skin-tone")[0].checked = true;
    document.getElementsByName("char-equip-head-rarity")[0].checked = true;
    document.getElementsByName("char-equip-body-rarity")[0].checked = true;
    document.getElementsByName("char-equip-arms-rarity")[0].checked = true;
    document.getElementsByName("char-equip-legs-rarity")[0].checked = true;
    document.getElementsByName("char-equip-weapon-rarity")[0].checked = true;
    document.getElementsByName("char-equip-all-rarity")[0].checked = true;
  }

  updateState(id) {
    if (id && id.indexOf('all') !== -1) {
      document.getElementById("char-equip-head").value = document.getElementById("char-equip-all").value;
      document.getElementById("char-equip-body").value = document.getElementById("char-equip-all").value;
      document.getElementById("char-equip-arms").value = document.getElementById("char-equip-all").value;
      document.getElementById("char-equip-legs").value = document.getElementById("char-equip-all").value;

      let els = document.getElementsByName("char-equip-all-rarity");
      for (let _idx = 0; _idx < els.length; _idx++) {
        document.getElementsByName("char-equip-head-rarity")[_idx].checked = els[_idx].checked;
        document.getElementsByName("char-equip-body-rarity")[_idx].checked = els[_idx].checked;
        document.getElementsByName("char-equip-arms-rarity")[_idx].checked = els[_idx].checked;
        document.getElementsByName("char-equip-legs-rarity")[_idx].checked = els[_idx].checked;
      }
    }

    let ids = {
      "animation"     : "char-equip-animation",
      "gender"        : "char-equip-gender",
      "skin-tone"     : "char-equip-skin-tone",
      "head-suit"     : "char-equip-head",
      "head-rarity"   : "char-equip-head-rarity",
      "body-suit"     : "char-equip-body",
      "body-rarity"   : "char-equip-body-rarity",
      "arms-suit"     : "char-equip-arms",
      "arms-rarity"   : "char-equip-arms-rarity",
      "legs-suit"     : "char-equip-legs",
      "legs-rarity"   : "char-equip-legs-rarity",
      "weapon"        : "char-equip-weapon",
      "weapon-rarity" : "char-equip-weapon-rarity",
      "all-suit"      : "char-equip-all",
      "all-rarity"    : "char-equip-all-rarity"
    };

    for (let _idx in ids) {
      let el = document.getElementById(ids[_idx]);
      let value = el.value;

      // Update available rarities for suits
      if (_idx.indexOf('-suit') !== -1 && this.suits.hasOwnProperty(value)) {
        let availableRarities = this.suits[value].rarities;
        let els = document.getElementsByName(ids[_idx.replace('-suit','-rarity')]);

        let checkFirst = false;
        for (let el of els) {
          if (availableRarities.indexOf(el.value) === -1) {
            el.disabled = true;
            if (el.checked) checkFirst = true;
            el.checked = false;
          } else {
            el.disabled = false;
          }
        }

        // Check the first one if needed
        if (checkFirst) {
          for (let el of els) {
            if (!el.disabled) {
              el.checked = true;
              break;
            }
          }
        }
      }

      // Update available rarities for weapon
      if (_idx === 'weapon' && this.weapons.hasOwnProperty(value)) {
        let availableRarities = this.weapons[value].rarities;
        let els = document.getElementsByName(ids[_idx  + '-rarity']);

        let checkFirst = false;
        for (let el of els) {
          if (availableRarities.indexOf(el.value) === -1) {
            el.disabled = true;
            if (el.checked) checkFirst = true;
            el.checked = false;
          } else {
            el.disabled = false;
          }
        }

        // Check the first one if needed
        if (checkFirst) {
          for (let el of els) {
            if (!el.disabled) {
              el.checked = true;
              break;
            }
          }
        }
      }
    }

    let values = {};
    for (let id in ids) {
      let el = document.getElementById(ids[id]);
      let value = el.value;
      if (id === 'gender' || id.indexOf('rarity') !== -1 || id === 'skin-tone') {
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
        "slug" : "",
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

  orderWeapons() {
    let weapons = {
      "none" : {
        "name" : "Unarmed",
        "slug" : "",
        "rarity" : []
      }
    };
    for (let set of EquipmentSets.weapons) {
      if (!weapons.hasOwnProperty(set[0])) {
        weapons[set[0]] = {
          'slug'     : set[0],
          'name'     : set[2],
          'rarities' : []
        };
      }

      weapons[set[0]].rarities.push(set[1]);
    }

    return weapons;
  }

  generateSuitSelects(field, suits) {
    let options = [];
    for (let key in suits) {
      options.push(
        <option name={"char-equip-" + field} value={suits[key].slug}>{suits[key].name}</option>
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

  generateWeaponSelects(weapons) {
    let options = [];
    for (let key in weapons) {
      options.push(
        <option name={"char-equip-weapon"} value={weapons[key].slug}>{weapons[key].name}</option>
      );
    }

    return (
      <div>
        <select name={"char-equip-weapon"} id={"char-equip-weapon"} onChange={this.updateState.bind(this, 'weapon')}>
          {options}
        </select>
        {this.backForwardButtons("char-equip-weapon")}
      </div>
    );
  }

  generateRarityRadios(field) {
    return (
      <div className={"char-equip-rarity-inputs"} id={"char-equip-" + field + "-rarity"}>
        <label>
          C <input type="radio" name={"char-equip-" + field + "-rarity"} value="Common" onChange={this.updateState.bind(this, field)} />
        </label>
        <label>
          U <input type="radio" name={"char-equip-" + field + "-rarity"} value="Uncommon" onChange={this.updateState.bind(this, field)} />
        </label>
        <label>
          R <input type="radio" name={"char-equip-" + field + "-rarity"} value="Rare" onChange={this.updateState.bind(this, field)} />
        </label>
        <label>
          UR <input type="radio" name={"char-equip-" + field + "-rarity"} value="Ultra Rare" onChange={this.updateState.bind(this, field)} />
        </label>
        <label>
          L <input type="radio" name={"char-equip-" + field + "-rarity"} value="Legendary" onChange={this.updateState.bind(this, field)} />
        </label>
      </div>
    );
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

  generateAnimationSelects(field) {
    return (
      <div>
        <select name={"char-equip-animation"} id={"char-equip-animation"} onChange={this.updateState.bind(this, field)}>>
          {EquipmentSets.animations.map((anim) => <option name={"char-equip-animation"} value={anim}>{anim}</option>)}
        </select>
        {this.backForwardButtons("char-equip-animation")}
      </div>
    );
  }

  generateGenderSkinToneRadios() {
    return (
      <div className={"char-equip-gender-inputs"}>
        <span id={"char-equip-gender"}>
          <label>
            Male <input type="radio" name={"char-equip-gender"} value="male" onChange={this.updateState.bind(this, "char-equip-gender")} />
          </label>
          <label>
            Female <input type="radio" name={"char-equip-gender"} value="female" onChange={this.updateState.bind(this, "char-equip-gender")} />
          </label>
        </span>
        <span className={"char-equip-gender-inputs"} id={"char-equip-skin-tone"}>
          <label>
            1 <input type="radio" name={"char-equip-skin-tone"} value={1} onChange={this.updateState.bind(this, "char-equip-skin-tone")} />
          </label>
          <label>
            4 <input type="radio" name={"char-equip-skin-tone"} value={4} onChange={this.updateState.bind(this, "char-equip-skin-tone")} />
          </label>
          <label>
            5 <input type="radio" name={"char-equip-skin-tone"} value={5} onChange={this.updateState.bind(this, "char-equip-skin-tone")} />
          </label>
          <label>
            6 <input type="radio" name={"char-equip-skin-tone"} value={6} onChange={this.updateState.bind(this, "char-equip-skin-tone")} />
          </label>
        </span>
      </div>
    );
  }

  toRaritySlug(rarity) {
    return {
      "Common" : "common",
      "Uncommon" : "uncommon",
      "Rare" : "rare",
      "Ultra Rare" : "ultrarare",
      "Legendary" : "legendary"
    }[rarity];
  }

  render() {
    this.suits = this.orderSets();
    this.weapons = this.orderWeapons();

    return (
      <div className="char-equip">
        <div style={{"width":680,"height":700}}>
          <NDCharacterEquipment
            baseUrl={"https://neon-district-season-one.s3.amazonaws.com/"}
            jsonFile={'nfts/ai-practice/ai-practice-blkorigindemon-female-4-0-spine.json'}
            width={680}
            height={700}
            animation={this.state.animation}
            gender={this.state.gender}
            skinTone={this.state["skin-tone"]}
            head={this.state["head-suit"]}
            headRarity={this.toRaritySlug(this.state["head-rarity"])}
            body={this.state["body-suit"]}
            bodyRarity={this.toRaritySlug(this.state["body-rarity"])}
            arms={this.state["arms-suit"]}
            armsRarity={this.toRaritySlug(this.state["arms-rarity"])}
            legs={this.state["legs-suit"]}
            legsRarity={this.toRaritySlug(this.state["legs-rarity"])}
            weapon={this.state["weapon"]}
            weaponRarity={this.toRaritySlug(this.state["weapon-rarity"])}
          />
        </div>
        <div className="char-equip-options">
          <h3>Animation / Weapon & Gender</h3>
          {this.generateAnimationSelects()}
          {this.generateGenderSkinToneRadios()}
          <hr />
          <h3>Weapon</h3>
          {this.generateWeaponSelects(this.weapons)}
          {this.generateRarityRadios("weapon")}
          <hr />
          <h3>Head</h3>
          {this.generateSuitSelects("head", this.suits)}
          {this.generateRarityRadios("head")}
          <h3>Body</h3>
          {this.generateSuitSelects("body", this.suits)}
          {this.generateRarityRadios("body")}
          <h3>Arms</h3>
          {this.generateSuitSelects("arms", this.suits)}
          {this.generateRarityRadios("arms")}
          <h3>Legs</h3>
          {this.generateSuitSelects("legs", this.suits)}
          {this.generateRarityRadios("legs")}
          <hr />
          <h3>Full Outfit</h3>
          {this.generateSuitSelects("all", this.suits)}
          {this.generateRarityRadios("all")}
        </div>
      </div>
    );
  }
}
