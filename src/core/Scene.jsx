import React, { Component } from "react";
import ReactDOM from "react-dom";

export class Scene extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.init();
    this.mounted = true;
  }

  init() {
    // Three.JS Variables
    this.DPI      = 2.0;
    this.width    = null;
    this.height   = null;
    this.camera   = null;
    this.scene    = null;
    this.renderer = null;
    this.canvas   = null;
    this.context  = null;
    this.rootMesh = null;
  }

  componentDidMount() {
    this.createScene();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.init();
  }

  defaultCameraPosition() {
    return {"x":0,"y":200,"z":400};
  }

  createScene() {
    // create the THREE.JS camera, scene and renderer (WebGL)
    let parentDomElement = ReactDOM.findDOMNode(this);
    this.width  = (this.props.width  || parentDomElement.innerWidth) * this.DPI;
    this.height = (this.props.height || parentDomElement.innerHeight) * this.DPI;

    this.camera = new THREE.PerspectiveCamera(
      this.props.fov  || 75,
      this.width / this.height,
      this.props.near || 1,
      this.props.far  || 3000
    );

    let defaultPos = this.defaultCameraPosition();

    this.camera.position.x = this.props.position && 
      this.props.position.hasOwnProperty('x') ? this.props.position.x : defaultPos.x;
    this.camera.position.y = this.props.position && 
      this.props.position.hasOwnProperty('y') ? this.props.position.y : defaultPos.y;
    this.camera.position.z = this.props.position && 
      this.props.position.hasOwnProperty('z') ? this.props.position.z : defaultPos.z;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.width, this.height);

    parentDomElement.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;
    this.context = this.renderer.getContext();

    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.width = this.width / this.DPI + 'px';
    this.canvas.style.height = this.height / this.DPI + 'px';
  }

  getScreenWorldPosition() {
    if (!this.rootMesh) {
      return null;
    }

    let vector = new THREE.Vector3();

    let widthHalf = 0.5 * this.canvas.width;
    let heightHalf = 0.5 * this.canvas.height;

    this.rootMesh.updateMatrixWorld();
    vector.setFromMatrixPosition(this.rootMesh.matrixWorld);
    vector.project(this.camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    let vHeight = 0, vWidth = 0, fraction = {};
    let box = new THREE.Box3().setFromObject(this.rootMesh);
    let size = box.getSize(new THREE.Vector3());

    // Determine the object's relative size from the camera
    if (size.x > 0) {
      // Field of view, vertical
      let vFOV = THREE.MathUtils.degToRad(this.camera.fov);

      // Visible Height from the distance from the screen
      let vHeightFromDistance = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
      let vWidthFromDistance = vHeightFromDistance * this.camera.aspect;

      // Fraction of the visible height made up by the object
      fraction = {
        height: size.y / vHeightFromDistance,
        width: size.x / vWidthFromDistance
      };

      // Unsure I need these?
      vHeight = fraction.height * size.y;
      vWidth = fraction.width * size.x;

      // Switch up the fraction to focus on the canvas
      fraction = {
        height: this.canvas.height / (vHeightFromDistance * 2),
        width: this.canvas.width / (vWidthFromDistance * 2)
      };
    }

    return { 
      x: vector.x,
      y: vector.y,
      fraction: fraction,
      height: vHeight,
      width: vWidth
    };
  }

  render() {
    return <div />;
  }
}
