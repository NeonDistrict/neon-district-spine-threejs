import { TurnOrderDisplay } from "./hud/TurnOrderDisplay.jsx";
import { PlayerControlsDisplay } from "./hud/PlayerControlsDisplay.jsx";
import { UnitStatusDisplay } from "./hud/UnitStatusDisplay.jsx";
import { VersionDisplay } from "./hud/VersionDisplay.jsx";

export class CombatHUD {
  constructor(renderer, activeAnimEvt, getUnitPosition) {
    this.renderer = renderer;
    this.parentCanvas = this.renderer.domElement;
    this.activeAnimEvt = activeAnimEvt;
    this.getUnitPosition = getUnitPosition;

    // Create the HUD canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.parentCanvas.width;
    this.canvas.height = this.parentCanvas.height;
    this.canvas.style.imageRendering = 'crisp-edges'; // Not sure this works
    this.context = this.canvas.getContext('2d');

    // Keep track of any other important values
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.texture = null;

    // Load in required fonts
    this.fontsLoaded = false;
    this.loadFonts();

    // Regions of the HUD
    this.turnOrderDisplay = new TurnOrderDisplay({
      'context'       : this.context,
      'x'             : this.width / 2,
      'y'             : 0,
      'width'         : this.width,
      'height'        : this.height,
      'activeAnimEvt' : this.activeAnimEvt
    });

    // Regions of the HUD
    this.playerControlsDisplay = new PlayerControlsDisplay({
      'context'       : this.context,
      'x'             : this.width / 2,
      'y'             : this.height,
      'width'         : this.width,
      'height'        : this.height,
      'activeAnimEvt' : this.activeAnimEvt
    });

    this.unitStatusDisplay = new UnitStatusDisplay({
      'context'         : this.context,
      'x'               : this.width / 2,
      'y'               : 0,
      'width'           : this.width,
      'height'          : this.height,
      'activeAnimEvt'   : this.activeAnimEvt,
      'getUnitPosition' : this.getUnitPosition
    });

    this.versionDisplay = new VersionDisplay({
      'context'         : this.context,
      'x'               : 0,
      'y'               : 0
    });
  }

  setTeams(teams) {
    this.teams = teams;
    this.playerControlsDisplay.setTeams(teams);
    this.turnOrderDisplay.setTeams(teams);
    this.unitStatusDisplay.setTeams(teams);
  }

  setPlayerSelectionsObject(playerSelections) {
    this.playerSelections = playerSelections;
    this.playerControlsDisplay.setPlayerSelectionsObject(playerSelections);
  }

  update(delta) {
    if (!this.fontsLoaded) {
      return;
    }

    this.context.clearRect(0, 0, this.width, this.height);

    this.versionDisplay.update();
    this.turnOrderDisplay.update();
    this.playerControlsDisplay.update();
    this.unitStatusDisplay.update();

    this.texture.needsUpdate = true;
  }

  render() {
    // Create the camera and set the viewport to match the screen dimensions.
    let camera = new THREE.OrthographicCamera(-this.width/2, this.width/2, this.height/2, -this.height/2, 0, 30);

    // Create also a custom scene for HUD.
    let scene = new THREE.Scene();

    // Create texture from rendered graphics.
    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;

    // Create HUD material.
    let material = new THREE.MeshBasicMaterial({map: this.texture});
    material.transparent = true;
    material.needsUpdate = true;

    // Create plane to render the HUD. This plane fill the whole screen.
    let plane = new THREE.PlaneGeometry(this.width, this.height);
    let mesh = new THREE.Mesh(plane, material);
    scene.add(mesh);

    return {
      camera,
      scene
    };
  }

  loadFonts() {
    document.fonts.add(new FontFace(
      'kozuka-gothic-pr6n',
      'url(https://neon-district-season-one.s3.amazonaws.com/fonts/KOZGOPR6N-REGULAR.OTF)',
      {
        'family' : 'kozuka-gothic-pr6n',
        'weight' : 'normal'
      }
    ));
    document.fonts.add(new FontFace(
      'kozuka-gothic-pr6n-lighter',
      'url(https://neon-district-season-one.s3.amazonaws.com/fonts/KOZGOPR6N-LIGHT.OTF)',
      {
        'family' : 'kozuka-gothic-pr6n',
        'weight' : 'lighter'
      }
    ));
    document.fonts.add(new FontFace(
      'kozuka-gothic-pr6n-bold',
      'url(https://neon-district-season-one.s3.amazonaws.com/fonts/KOZGOPR6N-BOLD.OTF)',
      {
        'family' : 'kozuka-gothic-pr6n',
        'weight' : 'bold'
      }
    ));
    document.fonts.add(new FontFace(
      'kozuka-gothic-pr6n-bolder',
      'url(https://neon-district-season-one.s3.amazonaws.com/fonts/KOZGOPR6N-HEAVY.OTF)',
      {
        'family' : 'kozuka-gothic-pr6n',
        'weight' : 'bolder'
      }
    ));

    document.fonts.ready.then((font) => {
      this.fontsLoaded = true;
    });
  }

}
