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
    this.width    = null;
    this.height   = null;
    this.camera   = null;
    this.scene    = null;
    this.renderer = null;
    this.canvas   = null;
    this.context  = null;
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
    this.width  = this.props.width  || parentDomElement.innerWidth;
    this.height = this.props.height || parentDomElement.innerHeight;

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
  }

  render() {
    return <div />;
  }
}
