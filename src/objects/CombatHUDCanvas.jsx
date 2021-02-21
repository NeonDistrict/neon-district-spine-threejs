import { TurnOrderDisplay } from "./hud/TurnOrderDisplay.jsx";
import { PlayerControlsDisplay } from "./hud/PlayerControlsDisplay.jsx";
import { UnitStatusDisplay } from "./hud/UnitStatusDisplay.jsx";
import { VersionDisplay } from "./hud/VersionDisplay.jsx";
import { ErrorDisplay } from "./hud/ErrorDisplay.jsx";
import { ScreenCanvasOverlay } from "./hud/ScreenCanvasOverlay.jsx";

export class CombatHUDCanvas {
  constructor(renderer, activeAnimEvt, getUnitPosition) {
    this.renderer = renderer;
    this.parentCanvas = this.renderer.domElement;
    this.activeAnimEvt = activeAnimEvt;
    this.getUnitPosition = getUnitPosition;

    // Create the HUD canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.parentCanvas.width;
    this.canvas.height = this.parentCanvas.height;
    this.context = this.canvas.getContext('2d');

    // add a canvas element over the WebGl canvas element
    this.parentCanvas.parentNode.appendChild(this.canvas);
    this.canvas.style.width = this.parentCanvas.style.width;
    this.canvas.style.height = this.parentCanvas.style.height;
    this.parentCanvas.parentNode.position = "relative";
    this.parentCanvas.style.position = "absolute";
    this.canvas.style.position = "absolute";
    // prevent the new canvas on top from capturing all mouse events
    this.canvas.style.pointerEvents = "none";

    // Keep track of any other important values
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.texture = null;

    // Debug
    this.updateTracker = 0;

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
      'context' : this.context,
      'x'       : 0,
      'y'       : 0
    });

    this.screenCanvasOverlay = new ScreenCanvasOverlay({
      'context' : this.context,
      'x'       : 0,
      'y'       : 0,
      'width'   : this.width,
      'height'  : this.height
    });

    this.errorDisplay = new ErrorDisplay({
      'context' : this.context,
      'x'       : this.width - 400,
      'y'       : this.height / 2 + 200,
      'width'   : 400,
      'height'  : 150,
    });
  }

  setTeams(teams) {
    this.teams = teams;
    this.playerControlsDisplay.setTeams(teams);
    this.turnOrderDisplay.setTeams(teams);
    this.unitStatusDisplay.setTeams(teams);
  }

  invalidate() {
    this.playerControlsDisplay.needsUpdate = true;
    this.turnOrderDisplay.needsUpdate = true;
    this.unitStatusDisplay.needsUpdate = true;
  }

  setPlayerSelectionsObject(playerSelections) {
    this.playerSelections = playerSelections;
    this.playerControlsDisplay.setPlayerSelectionsObject(playerSelections);
  }

  setError(err) {
    this.errorDisplay.setError(err);
  }

  update(delta) {
    if (!this.fontsLoaded) {
      return;
    }

    let needsUpdate = false;

    if (this.errorDisplay.preUpdate(delta)) {needsUpdate=true;}
    if (this.turnOrderDisplay.preUpdate(delta)) {needsUpdate=true;}
    if (this.playerControlsDisplay.preUpdate(delta)) {needsUpdate=true;}
    if (this.unitStatusDisplay.preUpdate(delta)) {needsUpdate=true;}
    if (this.screenCanvasOverlay.preUpdate(delta)) {needsUpdate=true;}

    if (needsUpdate) {
      this.versionDisplay.update(delta);
      this.errorDisplay.update(delta);
      this.unitStatusDisplay.update(delta);
      this.playerControlsDisplay.update(delta);
      this.turnOrderDisplay.update(delta);
      this.screenCanvasOverlay.update(delta);
    }
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
