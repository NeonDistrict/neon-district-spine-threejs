'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactDOM = _interopDefault(require('react-dom'));
var pizzaJuice = require('pizza-juice');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var axios = require('axios');

var Api = function () {
  function Api(_endpoint) {
    classCallCheck(this, Api);

    this.endpoint = _endpoint;

    if (window.location.href.indexOf('nds1-preview-tool') !== -1) {
      this.endpoint = 'http://3.212.225.158:5003';
    }
  }

  createClass(Api, [{
    key: 'req',
    value: function req(url, data, callback) {
      var error = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : console.error;

      return axios.post(url, data).then(callback).catch(error);
    }
  }, {
    key: 'getBattle',
    value: function getBattle(data, callback, error) {
      return this.req(this.endpoint + '/api/combat/get', data, callback, error);
    }
  }, {
    key: 'runBattle',
    value: function runBattle(data, callback, error) {
      return this.req(this.endpoint + '/api/combat/run', data, callback, error);
    }
  }]);
  return Api;
}();

var Scene = function (_Component) {
  inherits(Scene, _Component);

  function Scene(props) {
    classCallCheck(this, Scene);

    var _this = possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this, props));

    _this.state = {};
    _this.init();
    _this.mounted = true;
    return _this;
  }

  createClass(Scene, [{
    key: "init",
    value: function init() {
      // Three.JS Variables
      this.DPI = 2.0;
      this.width = null;
      this.height = null;
      this.camera = null;
      this.scene = null;
      this.renderer = null;
      this.canvas = null;
      this.context = null;
      this.rootMesh = null;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createScene();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      this.init();
    }
  }, {
    key: "defaultCameraPosition",
    value: function defaultCameraPosition() {
      return { "x": 0, "y": 200, "z": 400 };
    }
  }, {
    key: "createScene",
    value: function createScene() {
      // create the THREE.JS camera, scene and renderer (WebGL)
      var parentDomElement = ReactDOM.findDOMNode(this);
      this.width = (this.props.width || parentDomElement.innerWidth) * this.DPI;
      this.height = (this.props.height || parentDomElement.innerHeight) * this.DPI;

      this.camera = new THREE.PerspectiveCamera(this.props.fov || 75, this.width / this.height, this.props.near || 1, this.props.far || 3000);

      var defaultPos = this.defaultCameraPosition();

      this.camera.position.x = this.props.position && this.props.position.hasOwnProperty('x') ? this.props.position.x : defaultPos.x;
      this.camera.position.y = this.props.position && this.props.position.hasOwnProperty('y') ? this.props.position.y : defaultPos.y;
      this.camera.position.z = this.props.position && this.props.position.hasOwnProperty('z') ? this.props.position.z : defaultPos.z;

      this.scene = new THREE.Scene();

      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(this.width, this.height);

      parentDomElement.appendChild(this.renderer.domElement);
      this.canvas = this.renderer.domElement;
      this.context = this.renderer.getContext();

      //this.canvas.style.imageRendering = 'pixelated';
      this.canvas.style.width = this.width / this.DPI + 'px';
      this.canvas.style.height = this.height / this.DPI + 'px';
    }
  }, {
    key: "getScreenWorldPosition",
    value: function getScreenWorldPosition() {
      if (!this.rootMesh) {
        return null;
      }

      var vector = new THREE.Vector3();

      var widthHalf = 0.5 * this.canvas.width;
      var heightHalf = 0.5 * this.canvas.height;

      this.rootMesh.updateMatrixWorld();
      vector.setFromMatrixPosition(this.rootMesh.matrixWorld);
      vector.project(this.camera);

      vector.x = vector.x * widthHalf + widthHalf;
      vector.y = -(vector.y * heightHalf) + heightHalf;

      var vHeight = 0,
          vWidth = 0,
          fraction = {};
      var box = new THREE.Box3().setFromObject(this.rootMesh);
      var size = box.getSize(new THREE.Vector3());

      // Determine the object's relative size from the camera
      if (size.x > 0) {
        // Field of view, vertical
        var vFOV = THREE.MathUtils.degToRad(this.camera.fov);

        // Visible Height from the distance from the screen
        var vHeightFromDistance = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
        var vWidthFromDistance = vHeightFromDistance * this.camera.aspect;

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
  }, {
    key: "render",
    value: function render() {
      return React__default.createElement("div", null);
    }
  }]);
  return Scene;
}(React.Component);

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".loader_loader__395vI {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  width: 200px;\n  height: 200px;\n  border-radius: 100px;\n  border: 4px solid rgba(255, 255, 255, 0.1);\n  -webkit-mask: linear-gradient(rgba(0, 0, 0, 0.1), #000000 90%);\n  transform-origin: 50% 60%;\n  transform: perspective(200px) rotateX(66deg);\n  animation: loader_spinner-wiggle__3M6AM 1.2s infinite;\n}\n\n.loader_loader__395vI canvas {\n  display: none;\n}\n\n.loader_loader__395vI:before,\n.loader_loader__395vI:after {\n  content: \"\";\n  position: absolute;\n  margin: -4px;\n  box-sizing: inherit;\n  width: inherit;\n  height: inherit;\n  border-radius: inherit;\n  opacity: .05;\n  border: inherit;\n  border-color: transparent;\n  animation: loader_spinner-spin__1lI9E 1.2s cubic-bezier(0.6, 0.2, 0, 0.8) infinite, loader_spinner-fade__3Myst 1.2s linear infinite;\n}\n\n.loader_loader__395vI:before {\n  border-top-color: #66e6ff;\n}\n\n.loader_loader__395vI:after {\n  border-top-color: #f0db75;\n  animation-delay: 0.3s;\n}\n\n@keyframes loader_spinner-spin__1lI9E {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes loader_spinner-fade__3Myst {\n  20% {\n    opacity: .1;\n  }\n  40% {\n    opacity: 1;\n  }\n  60% {\n    opacity: .1;\n  }\n}";
var lstyle = { "loader": "loader_loader__395vI", "spinner-wiggle": "loader_spinner-wiggle__3M6AM", "spinner-spin": "loader_spinner-spin__1lI9E", "spinner-fade": "loader_spinner-fade__3Myst" };
styleInject(css);

var SpineScene = function (_Scene) {
  inherits(SpineScene, _Scene);

  function SpineScene(props) {
    classCallCheck(this, SpineScene);

    // Create the asset manager
    var _this = possibleConstructorReturn(this, (SpineScene.__proto__ || Object.getPrototypeOf(SpineScene)).call(this, props));

    _this.baseUrl = props.baseUrl || "https://neon-district-season-one.s3.amazonaws.com/";
    _this.createAssetManager(_this.baseUrl);

    // Define the spine output directory
    _this.spineOutputDirectory = _this.determineSpineOutputDirectory();
    console.log('Pulling spine output from', _this.spineOutputDirectory);

    _this.state = {
      isLoading: true
    };
    return _this;
  }

  createClass(SpineScene, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      get(SpineScene.prototype.__proto__ || Object.getPrototypeOf(SpineScene.prototype), "componentDidMount", this).call(this, arguments);
    }
  }, {
    key: "determineSpineOutputDirectory",
    value: function determineSpineOutputDirectory() {
      if (window.location.href.indexOf('https://portal.neondistrict.io') === 0 || window.location.href.indexOf('https://rc.portal.neondistrict.io') === 0) {
        return 'spine-output';
      }

      return 'spine-output-staging';
    }
  }, {
    key: "createAssetManager",
    value: function createAssetManager(baseUrl) {
      this.assetManager = new spine.threejs.AssetManager(baseUrl);
    }
  }, {
    key: "preloadAsset",
    value: function preloadAsset(skeletonFile, atlasFile) {
      if (!this.assetManager) {
        throw "Spine Asset Manager is not initialized.";
      }

      this.assetManager.loadText(skeletonFile);
      this.assetManager.loadTextureAtlas(atlasFile);
    }
  }, {
    key: "setSkeletons",
    value: function setSkeletons(skeletons) {
      this.skeletons = skeletons;
    }
  }, {
    key: "load",
    value: function load() {
      if (!this.mounted) {
        return;
      }

      if (this.assetManager.isLoadingComplete()) {

        // Create the root mesh to apply all other objects
        this.rootMesh = new THREE.Mesh();
        this.scene.add(this.rootMesh);

        // Load all provided skeletons in order
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.skeletons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var skeleton = _step.value;

            this.rootMesh.add(skeleton);
          }

          // Request first animation frame
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.lastFrameTime = Date.now() / 1000;
        requestAnimationFrame(this.animate.bind(this));
      } else requestAnimationFrame(this.load.bind(this));
    }
  }, {
    key: "animate",
    value: function animate() {
      if (!this.mounted) {
        return;
      }

      // calculate delta time for animation purposes
      var now = Date.now() / 1000;
      var delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      // make sure nothing is loading
      var isLoading = false;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.skeletons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var skeleton = _step2.value;

          if (skeleton.assetLoadingCount > 0) {
            isLoading = true;
            this.setState({ 'isLoading': true });
            break;
          }
        }

        // Render the animation
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (!isLoading) {
        // update the animation
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.skeletons[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _skeleton = _step3.value;

            _skeleton.update(delta);
          }

          // render the scene
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        this.renderer.autoClear = true;
        this.renderer.render(this.scene, this.camera);

        // render any additional scenes
        this.renderer.autoClear = false;
        this.renderAdditionalScenes(delta);
      }

      // if we're still loading, done
      if (this.state.isLoading && !isLoading) {
        this.setState({ 'isLoading': false });
      }

      requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: "renderAdditionalScenes",
    value: function renderAdditionalScenes(delta) {
      // Do nothing, just exist
    }
  }, {
    key: "render",
    value: function render() {
      var classes = lstyle.loader;
      if (!this.state.isLoading) {
        classes = "";
      }

      return React__default.createElement("div", { className: classes });
    }
  }]);
  return SpineScene;
}(Scene);

var visualEffects = {
  "V1": {
    "hit-target-1": {
      "Tag": "hit-target-1",
      "Filename": "Blood_1.webm",
      "Blending": "AdditiveBlending",
      "X Position": 20,
      "Y Position": 150,
      "Width": 739,
      "Height": 754,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 1,
      "Opacity": 1,
      "Flip X": true,
      "Flip Y": false
    },
    "hit-target-2": {
      "Tag": "hit-target-2",
      "Filename": "Blood_2.webm",
      "Blending": "AdditiveBlending",
      "X Position": 280,
      "Y Position": 120,
      "Width": 1657,
      "Height": 708,
      "Rotation": 0.1,
      "Scale": 0.6,
      "Speed": 1,
      "Opacity": 0.9,
      "Flip X": true,
      "Flip Y": false
    },
    "hit-target-3": {
      "Tag": "hit-target-3",
      "Filename": "Blood_3.webm",
      "Blending": "AdditiveBlending",
      "X Position": 80,
      "Y Position": 150,
      "Width": 668,
      "Height": 711,
      "Rotation": -0.4,
      "Scale": 0.8,
      "Speed": 2.7,
      "Opacity": 1,
      "Flip X": true,
      "Flip Y": false
    },
    "hit-target-4": {
      "Tag": "hit-target-4",
      "Filename": "Blood_4.webm",
      "Blending": "AdditiveBlending",
      "X Position": 130,
      "Y Position": 130,
      "Width": 668,
      "Height": 711,
      "Rotation": 1.5,
      "Scale": 1,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": true,
      "Flip Y": false
    },
    "hit-target-5": {
      "Tag": "hit-target-5",
      "Filename": "Blood_5.webm",
      "Blending": "AdditiveBlending",
      "X Position": 280,
      "Y Position": 130,
      "Width": 668,
      "Height": 711,
      "Rotation": 1.55,
      "Scale": 1,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": true
    },
    "buff-invoker": {
      "Tag": "buff-invoker",
      "Filename": "Buff_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 0,
      "Y Position": 150,
      "Width": 458,
      "Height": 736,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "buff-target": {
      "Tag": "buff-target",
      "Filename": "Buff_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -10,
      "Y Position": 150,
      "Width": 652,
      "Height": 668,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "cleanse-target": {
      "Tag": "cleanse-target",
      "Filename": "Cleanse_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 160,
      "Y Position": 150,
      "Width": 427,
      "Height": 272,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "counter-invoker": {
      "Tag": "counter-invoker",
      "Filename": "CounterAttack_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 20,
      "Y Position": 225,
      "Width": 594,
      "Height": 541,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "counter-target": {
      "Tag": "counter-target",
      "Filename": "CounterAttack_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 20,
      "Y Position": 150,
      "Width": 594,
      "Height": 541,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "debuff-invoker": {
      "Tag": "debuff-invoker",
      "Filename": "DeBuff_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 0,
      "Y Position": 180,
      "Width": 497,
      "Height": 856,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "debuff-target": {
      "Tag": "debuff-target",
      "Filename": "DeBuff_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -10,
      "Y Position": 180,
      "Width": 872,
      "Height": 856,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 1.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "downvote-target-old": {
      "Tag": "downvote-target-old",
      "Filename": "Downvote_old.webm",
      "Blending": "AdditiveBlending",
      "X Position": 230,
      "Y Position": 65,
      "Width": 872,
      "Height": 856,
      "Rotation": 0,
      "Scale": 0.4,
      "Speed": 1.8,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "downvote-target": {
      "Tag": "downvote-target",
      "Filename": "Downvote_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 100,
      "Y Position": 180,
      "Width": 309,
      "Height": 597,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1.8,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "hack-target": {
      "Tag": "hack-target",
      "Filename": "Hack_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -10,
      "Y Position": 150,
      "Width": 309,
      "Height": 597,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1.8,
      "Opacity": 0.9,
      "Flip X": false,
      "Flip Y": false
    },
    "healing-invoker-1": {
      "Tag": "healing-invoker-1",
      "Filename": "Healing_Invoker_1.webm",
      "Blending": "AdditiveBlending",
      "X Position": 15,
      "Y Position": 70,
      "Width": 510,
      "Height": 900,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1.5,
      "Opacity": 0.9,
      "Flip X": false,
      "Flip Y": false
    },
    "healing-invoker-2": {
      "Tag": "healing-invoker-2",
      "Filename": "Healing_Invoker_2.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 130,
      "Width": 510,
      "Height": 900,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.5,
      "Opacity": 0.9,
      "Flip X": false,
      "Flip Y": false
    },
    "healing-invoker-3": {
      "Tag": "healing-invoker-3",
      "Filename": "Healing_Invoker_3.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 220,
      "Width": 535,
      "Height": 1000,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1.5,
      "Opacity": 0.9,
      "Flip X": false,
      "Flip Y": false
    },
    "healing-invoker-4": {
      "Tag": "healing-invoker-4",
      "Filename": "Healing_Invoker_4.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 150,
      "Width": 479,
      "Height": 414,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 1,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "healing-target-1": {
      "Tag": "healing-target-1",
      "Filename": "Healing_Target_1.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 150,
      "Width": 773,
      "Height": 767,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 2.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "healing-target-2": {
      "Tag": "healing-target-2",
      "Filename": "Healing_Target_2.webm",
      "Blending": "AdditiveBlending",
      "X Position": 40,
      "Y Position": 150,
      "Width": 968,
      "Height": 841,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 2.2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "healing-target-3": {
      "Tag": "healing-target-3",
      "Filename": "Healing_Target_3.webm",
      "Blending": "AdditiveBlending",
      "X Position": -20,
      "Y Position": 150,
      "Width": 309,
      "Height": 299,
      "Rotation": 0,
      "Scale": 1,
      "Speed": 2.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "interact-invoker": {
      "Tag": "interact-invoker",
      "Filename": "Interact_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 150,
      "Y Position": 80,
      "Width": 309,
      "Height": 299,
      "Rotation": 0,
      "Scale": 1,
      "Speed": 1.7,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "interact-target": {
      "Tag": "interact-target",
      "Filename": "Interact_target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 150,
      "Y Position": 120,
      "Width": 445,
      "Height": 479,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.7,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "knockout-target": {
      "Tag": "knockout-target",
      "Filename": "KnockOut_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 5,
      "Y Position": 220,
      "Width": 646,
      "Height": 541,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 1.7,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "melee-recoil-low-target": {
      "Tag": "melee-recoil-low-target",
      "Filename": "MeleeRecoil_Low_Target_Orange.webm",
      "Blending": "AdditiveBlending",
      "X Position": 0,
      "Y Position": 0,
      "Width": 248,
      "Height": 266,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "poison-target-1": {
      "Tag": "poison-target-1",
      "Filename": "Poison1_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 0,
      "Y Position": 100,
      "Width": 535,
      "Height": 566,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "poison-target-1-2": {
      "Tag": "poison-target-1-2",
      "Filename": "Poison1_Target_v2.webm",
      "Blending": "AdditiveBlending",
      "X Position": 15,
      "Y Position": 100,
      "Width": 535,
      "Height": 566,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 2.5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "poison-target-2": {
      "Tag": "poison-target-2",
      "Filename": "Poison2_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -25,
      "Y Position": 100,
      "Width": 825,
      "Height": 1080,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "regeneration-target": {
      "Tag": "regeneration-target",
      "Filename": "Regeneration_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -20,
      "Y Position": 100,
      "Width": 1181,
      "Height": 1000,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 2,
      "Opacity": 0.7,
      "Flip X": false,
      "Flip Y": false
    },
    "shield-invoker": {
      "Tag": "shield-invoker",
      "Filename": "Shield_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": -20,
      "Y Position": 50,
      "Width": 486,
      "Height": 421,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.5,
      "Opacity": 0.8,
      "Flip X": false,
      "Flip Y": false
    },
    "shield-target": {
      "Tag": "shield-target",
      "Filename": "Shield_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 135,
      "Y Position": 110,
      "Width": 486,
      "Height": 421,
      "Rotation": 0,
      "Scale": 1,
      "Speed": 2,
      "Opacity": 0.9,
      "Flip X": true,
      "Flip Y": false
    },
    "stat-boost-invoker": {
      "Tag": "stat-boost-invoker",
      "Filename": "Stats_Boost_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 320,
      "Width": 334,
      "Height": 356,
      "Rotation": 0,
      "Scale": 0.75,
      "Speed": 1.5,
      "Opacity": 0.9,
      "Flip X": true,
      "Flip Y": false
    },
    "stat-break-invoker": {
      "Tag": "stat-break-invoker",
      "Filename": "Stats_Break_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 320,
      "Width": 334,
      "Height": 356,
      "Rotation": 0,
      "Scale": 0.75,
      "Speed": 1.5,
      "Opacity": 0.9,
      "Flip X": true,
      "Flip Y": false
    },
    "stat-boost-target": {
      "Tag": "stat-boost-target",
      "Filename": "Stats_Boost_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 110,
      "Width": 590,
      "Height": 643,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "stat-break-target": {
      "Tag": "stat-break-target",
      "Filename": "Stats_Break_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 110,
      "Width": 590,
      "Height": 643,
      "Rotation": 0,
      "Scale": 0.65,
      "Speed": 1.3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "strip-target": {
      "Tag": "strip-target",
      "Filename": "Strip_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -20,
      "Y Position": 160,
      "Width": 567,
      "Height": 773,
      "Rotation": 0,
      "Scale": 0.65,
      "Speed": 1.3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "subvert-target": {
      "Tag": "subvert-target",
      "Filename": "Subvert_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": -20,
      "Y Position": 160,
      "Width": 504,
      "Height": 736,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 1,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "taunt-invoker": {
      "Tag": "taunt-invoker",
      "Filename": "Taunt_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 150,
      "Y Position": 100,
      "Width": 606,
      "Height": 541,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1,
      "Opacity": 0.75,
      "Flip X": false,
      "Flip Y": false
    },
    "taunt-target": {
      "Tag": "taunt-target",
      "Filename": "Taunt_target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 15,
      "Y Position": 255,
      "Width": 606,
      "Height": 498,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1,
      "Opacity": 0.75,
      "Flip X": false,
      "Flip Y": false
    },
    "ticks-gain": {
      "Tag": "ticks-gain",
      "Filename": "Ticks_Gain.webm",
      "Blending": "AdditiveBlending",
      "X Position": -20,
      "Y Position": 180,
      "Width": 567,
      "Height": 900,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.2,
      "Opacity": 0.8,
      "Flip X": false,
      "Flip Y": false
    },
    "ticks-lose": {
      "Tag": "ticks-lose",
      "Filename": "Ticks_lose.webm",
      "Blending": "AdditiveBlending",
      "X Position": -20,
      "Y Position": 120,
      "Width": 500,
      "Height": 1000,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.2,
      "Opacity": 0.9,
      "Flip X": false,
      "Flip Y": false
    },
    "upvote-target": {
      "Tag": "upvote-target",
      "Filename": "UpVote_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 100,
      "Y Position": 120,
      "Width": 309,
      "Height": 597,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1.3,
      "Opacity": 0.9,
      "Flip X": false,
      "Flip Y": false
    },
    "victory": {
      "Tag": "victory",
      "Filename": "VictoryParticles.webm",
      "Blending": "AdditiveBlending",
      "X Position": 150,
      "Y Position": 150,
      "Width": 1051,
      "Height": 779,
      "Rotation": 0,
      "Scale": 1,
      "Speed": 2,
      "Opacity": 0.9,
      "Flip X": false,
      "Flip Y": false
    },
    "blade-med-invoker-1": {
      "Tag": "blade-med-invoker-1",
      "Filename": "BladeMed_Normal1_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 100,
      "Y Position": 150,
      "Width": 769,
      "Height": 655,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "blade-med-invoker-2": {
      "Tag": "blade-med-invoker-2",
      "Filename": "BladeMed_Normal2_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 80,
      "Y Position": 150,
      "Width": 769,
      "Height": 655,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "console-blk-invoker-1": {
      "Tag": "console-blk-invoker-1",
      "Filename": "Console_BLK_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 120,
      "Width": 359,
      "Height": 594,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "console-blk-invoker-2": {
      "Tag": "console-blk-invoker-2",
      "Filename": "Console_BLK_Invoker_Normal2.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 120,
      "Width": 361,
      "Height": 575,
      "Rotation": 0,
      "Scale": 0.7,
      "Speed": 1,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "console-blk-target-1": {
      "Tag": "console-blk-target-1",
      "Filename": "Console_BLK_Target_Normal1.webm",
      "Blending": "AdditiveBlending",
      "X Position": -15,
      "Y Position": 120,
      "Width": 538,
      "Height": 498,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 1.3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "console-blk-target-2": {
      "Tag": "console-blk-target-2",
      "Filename": "Console_BLK_Target_Normal2.webm",
      "Blending": "AdditiveBlending",
      "X Position": 10,
      "Y Position": 120,
      "Width": 523,
      "Height": 746,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 1.3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "drone-2": {
      "Tag": "drone-2",
      "Filename": "Drone_Normal2.webm",
      "Blending": "AdditiveBlending",
      "X Position": 250,
      "Y Position": 80,
      "Width": 1169,
      "Height": 827,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 4,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "dual-blade-med-invoker-1": {
      "Tag": "dual-blade-med-invoker-1",
      "Filename": "DualBladeMed_Normal1_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 90,
      "Y Position": 150,
      "Width": 754,
      "Height": 625,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 4,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "dual-blade-med-invoker-2": {
      "Tag": "dual-blade-med-invoker-2",
      "Filename": "DualBladeMed_Normal2_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 90,
      "Y Position": 150,
      "Width": 754,
      "Height": 625,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 5,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    },
    "melee-recoil-big-target": {
      "Tag": "melee-recoil-big-target",
      "Filename": "MeleeRecoil_Big_Target_Orange.webm",
      "Blending": "AdditiveBlending",
      "X Position": 0,
      "Y Position": 0,
      "Width": 603,
      "Height": 600,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "melee-recoil-med-target": {
      "Tag": "melee-recoil-med-target",
      "Filename": "MeleeRecoil_Med_Target_Orange.webm",
      "Blending": "AdditiveBlending",
      "X Position": 0,
      "Y Position": 0,
      "Width": 365,
      "Height": 353,
      "Rotation": 0,
      "Scale": 0.8,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "melee-recoil-slash-med-target": {
      "Tag": "melee-recoil-slash-med-target",
      "Filename": "MeleeRecoil_SlashMed_Target_Orange.webm",
      "Blending": "AdditiveBlending",
      "X Position": 0,
      "Y Position": 0,
      "Width": 603,
      "Height": 600,
      "Rotation": 0,
      "Scale": 1,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "muzzle-flash-energy-med-1": {
      "Tag": "muzzle-flash-energy-med-1",
      "Filename": "MuzzleFlash_EnergyMedNormal1.webm",
      "Blending": "AdditiveBlending",
      "X Position": 350,
      "Y Position": 90,
      "Width": 1425,
      "Height": 510,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them roughly"
    },
    "muzzle-flash-energy-med-2": {
      "Tag": "muzzle-flash-energy-med-2",
      "Filename": "MuzzleFlash_EnergyMedNormal2.webm",
      "Blending": "AdditiveBlending",
      "X Position": 330,
      "Y Position": 90,
      "Width": 1313,
      "Height": 706,
      "Rotation": 0,
      "Scale": 0.5,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them roughly"
    },
    "muzzle-flash-pistol-med-1": {
      "Tag": "muzzle-flash-pistol-med-1",
      "Filename": "MuzzleFlash_PistolMedNormal1_Invoker_Orange_OneShot.webm",
      "Blending": "AdditiveBlending",
      "X Position": 150,
      "Y Position": 195,
      "Width": 550,
      "Height": 482,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "muzzle-flash-pistol-med-2": {
      "Tag": "muzzle-flash-pistol-med-2",
      "Filename": "MuzzleFlash_PistolMedNormal2_Invoker_Orange_sustained.webm",
      "Blending": "AdditiveBlending",
      "X Position": 150,
      "Y Position": 195,
      "Width": 550,
      "Height": 482,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "muzzle-flash-rifle-med-1": {
      "Tag": "muzzle-flash-rifle-med-1",
      "Filename": "MuzzleFlash_RifleMedNormal1_Invoker_Orange_OneShot.webm",
      "Blending": "AdditiveBlending",
      "X Position": 170,
      "Y Position": 150,
      "Width": 550,
      "Height": 482,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "muzzle-flash-rifle-med-1-brief": {
      "Tag": "muzzle-flash-rifle-med-1",
      "Filename": "MuzzleFlash_PistolMedNormal1_Invoker_Orange_OneShot.webm",
      "Blending": "AdditiveBlending",
      "X Position": 170,
      "Y Position": 150,
      "Width": 550,
      "Height": 482,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "muzzle-flash-rifle-med-2": {
      "Tag": "muzzle-flash-rifle-med-2",
      "Filename": "MuzzleFlash_RifleMedNormal2_Invoker_Orange_Sustained.webm",
      "Blending": "AdditiveBlending",
      "X Position": 150,
      "Y Position": 140,
      "Width": 550,
      "Height": 482,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "muzzle-flash-shotgun-med-1": {
      "Tag": "muzzle-flash-shotgun-med-1",
      "Filename": "MuzzleFlash_ShotgunMedNormal2_Invoker_Pinks_Sustained.webm",
      "Blending": "AdditiveBlending",
      "X Position": 140,
      "Y Position": 130,
      "Width": 550,
      "Height": 482,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 3,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false,
      "Note": "these positions need to be relative to the weapon tip. I placed them at 0.0"
    },
    "returning-normal-target-1": {
      "Tag": "returning-normal-target-1",
      "Filename": "Returning_Normal1_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 70,
      "Y Position": 110,
      "Width": 511,
      "Height": 619,
      "Rotation": 0.3,
      "Scale": 0.6,
      "Speed": 3,
      "Opacity": 1,
      "Flip X": true,
      "Flip Y": false
    },
    "returning-normal-target-2": {
      "Tag": "returning-normal-target-2",
      "Filename": "Returning_Normal2_Target.webm",
      "Blending": "AdditiveBlending",
      "X Position": 70,
      "Y Position": 150,
      "Width": 511,
      "Height": 619,
      "Rotation": -1.9,
      "Scale": 0.6,
      "Speed": 5,
      "Opacity": 1,
      "Flip X": true,
      "Flip Y": false
    },
    "thrust-med-invoker-2": {
      "Tag": "thrust-med-invoker-2",
      "Filename": "ThrustMed_Normal2_Invoker.webm",
      "Blending": "AdditiveBlending",
      "X Position": 190,
      "Y Position": 190,
      "Width": 754,
      "Height": 625,
      "Rotation": 0,
      "Scale": 0.6,
      "Speed": 2,
      "Opacity": 1,
      "Flip X": false,
      "Flip Y": false
    }
  }
};

var VideoTexture = function () {
  function VideoTexture(scene) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, VideoTexture);

    if (!scene) {
      throw "Scene required for VideoTexture";
    }

    this.scene = scene;
    this.src = null;
    this.key = null;

    // Constants
    this.VISUAL_EFFECTS_ROOT_SRC = "https://neon-district-season-one.s3.amazonaws.com/visual-effects/V1_reformat/";

    // Init & Defaults
    this.width = 1;
    this.height = 1;
    this.x_pos = 0;
    this.y_pos = 100;
    this.loop = false;
    this.blend = "NormalBlending";
    this.rotation = 0;
    this.opacity = 1.0;
    this.speed = 1.0;
    this.scale = 1.0;
    this.flipX = 1.0;
    this.flipY = 1.0;
    this.unit = {};

    if (options && (typeof options === "undefined" ? "undefined" : _typeof(options)) === 'object') {
      for (var option in options) {
        if (options.hasOwnProperty(option) && this.hasOwnProperty(option)) {
          this[option] = options[option];
        }
      }
    }
  }

  createClass(VideoTexture, [{
    key: "createEffect",
    value: function createEffect() {
      this.texture = new THREE.VideoTexture(this.video);
      this.texture.format = THREE.RGBAFormat;

      var geometry = new THREE.PlaneGeometry(1, 1);
      var material = new THREE.MeshBasicMaterial({
        map: this.texture,
        transparent: true
      });
      material.blending = THREE[this.blend];

      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
      this.mesh.position.set(this.x_pos, this.y_pos, 1);
      this.mesh.scale.set(this.width, this.height, 1);
      this.mesh.material.map.wrapS = THREE.RepeatWrapping;
      this.mesh.material.map.wrapT = THREE.RepeatWrapping;
      this.mesh.material.side = THREE.DoubleSide;
    }
  }, {
    key: "setLoop",
    value: function setLoop(loop) {
      this.video.loop = !!loop;
    }
  }, {
    key: "getKey",
    value: function getKey() {
      return this.key;
    }
  }, {
    key: "cleanUpAfterVideo",
    value: function cleanUpAfterVideo() {
      if (this.video && this.video.pause) {
        // Clear the source
        this.video.pause();
        this.video.removeAttribute('src'); // empty source
        this.video.load();

        // Remove from three.js
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);

        // Remove from the DOM
        this.video.remove();
      }
    }
  }, {
    key: "setKey",
    value: function setKey(key) {
      var _this = this;

      // Get parameters from key
      var params = this.getParametersFromKey(key);
      if (!params) {
        console.error("Could not determine parameters for effects key:", key);
        return;
      }

      // Handle any prior videos
      if (this.video) {
        this.cleanUpAfterVideo();
      }

      // Create the element
      this.video = document.createElement('video');
      this.video.autoplay = false;
      this.video.crossOrigin = "anonymous";
      this.video.onended = function () {
        if (_this.video) {
          _this.cleanUpAfterVideo();
        }
      }.bind(this);

      // Now create itself
      this.createEffect();

      // Save the key
      this.key = key;

      // Set all parameters
      // Note, set orientation prior to rotation
      this.setSize(params.Width, params.Height, params.Scale);
      this.setPosition(params["X Position"], params["Y Position"]);
      this.setOrientation(params["Flip X"], params["Flip Y"]);
      this.setRotation(params.Rotation);
      this.setOpacity(params.Opacity);
      this.setBlendMode(params.Blending);

      // Set the source
      var src = this.VISUAL_EFFECTS_ROOT_SRC + params.Filename;
      this.setSrc(src);
      this.setPlaybackRate(params.Speed);
    }
  }, {
    key: "getParametersFromKey",
    value: function getParametersFromKey(key) {
      if (visualEffects.V1.hasOwnProperty(key)) {
        return visualEffects.V1[key];
      }
    }
  }, {
    key: "getSrc",
    value: function getSrc() {
      return this.src;
    }
  }, {
    key: "setSrc",
    value: function setSrc(src) {
      // Set the new source
      this.src = src;
      this.video.src = src;
      this.video.load();
    }
  }, {
    key: "play",
    value: function play() {
      this.video.play();
    }
  }, {
    key: "setPosition",
    value: function setPosition(x_pos, y_pos) {
      this.x_pos = this.getUnitMod('x_pos') + x_pos * this.getUnitMod('scale');
      this.y_pos = this.getUnitMod('y_pos') + y_pos * this.getUnitMod('scale');

      // X position needs to be offset to the right if we're flipping X
      if (this.unit.hasOwnProperty('flipX') && this.unit.flipX) {
        this.x_pos = this.getUnitMod('x_pos') - x_pos * this.getUnitMod('scale');
      }

      this.mesh.position.set(this.x_pos, this.y_pos, 1);
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;

      this.width = width * scale * this.getUnitMod('scale');
      this.height = height * scale * this.getUnitMod('scale');
      this.mesh.scale.set(this.width, this.height, 1);
    }
  }, {
    key: "setRotation",
    value: function setRotation() {
      var rot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.0;

      this.mesh.rotation.z -= rot;
    }
  }, {
    key: "setOpacity",
    value: function setOpacity() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;

      this.mesh.material.opacity = opacity;
    }
  }, {
    key: "setPlaybackRate",
    value: function setPlaybackRate() {
      var rate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;

      this.video.playbackRate = rate;
    }
  }, {
    key: "setBlendMode",
    value: function setBlendMode() {
      var blend = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'NormalBlending';

      var validBlendModes = ["NoBlending", "NormalBlending", "AdditiveBlending", "SubtractiveBlending", "MultiplyBlending"];

      if (THREE.hasOwnProperty(blend) && validBlendModes.indexOf(blend) !== -1) {
        this.mesh.material.blending = THREE[blend];
      }
    }
  }, {
    key: "getUnitMod",
    value: function getUnitMod(key) {
      if (!this.hasOwnProperty('unit') || !this.unit.hasOwnProperty(key)) {
        if (key === 'scale') {
          return 1;
        } else if (key === 'flipX' || key === 'flipY') {
          return false;
        } else {
          return 0;
        }
      }

      return this.unit[key];
    }
  }, {
    key: "setOrientation",
    value: function setOrientation() {
      var flipX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var flipY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      flipX = Boolean(flipX ^ this.getUnitMod('flipX'));
      flipY = Boolean(flipY ^ this.getUnitMod('flipY'));

      /*
      if (flipX) {
        this.mesh.material.map.repeat.x = -1;
      } else {
        this.mesh.material.map.repeat.x = 1;
      }
       if (flipY) {
        this.mesh.material.map.repeat.y = - 1;
      } else {
        this.mesh.material.map.repeat.y = 1;
      }
      */

      if (flipX && flipY) {
        this.mesh.rotation.z = Math.PI; // Rotate X by 180 degrees
        this.mesh.rotation.x = 0; // Don't flip Y, already accounted for
      } else if (flipX && !flipY) {
        // Done
        this.mesh.rotation.z = Math.PI; // Rotate X by 180 degrees
        this.mesh.rotation.x = Math.PI; // Flip Y so that top stays top
      } else if (!flipX && flipY) {
        this.mesh.rotation.z = 0;
        this.mesh.rotation.x = Math.PI; // Flip Y
      } else {
        // Done
        this.mesh.rotation.z = 0; // Do not rotate X at all
        this.mesh.rotation.x = 0; // No need to flip to account for anything
      }
    }
  }]);
  return VideoTexture;
}();

var weaponsToAnimations = {
	"blkoriginheater": "EnergySml",
	"blkoriginpulsarv16": "EnergyMed",
	"blkorigintantomm": "BladeSml",
	"blkorigingladiusmm": "BladeMed",
	"blkoriginwonderball": "Unarmed", // "DroneSml",
	"blkoriginnightsticks": "DualMeleeMed",
	"blkoriginwristbox": "ConsoleSml",
	"blkoriginselector": "PistolSml",
	"blkoriginsawdisc": "ReturningLrg",
	"blkoriginpepperap": "RifleSml",
	"blkoriginsaltas": "RifleMed",
	"blkoriginruiner": "ThrustingSml",
	"blkkama": "DualMeleeSml",
	"blkflechette": "PistolSml",
	"blkribbonar": "RifleSml",
	"blkwristcomp": "ConsoleSml",
	"blksonicbayonet": "ThrustingSml",
	"blknanoknife": "BladeSml",
	"blkpenetrator": "RifleMed",
	"blkbluebolt": "EnergySml",
	"blkchakram": "ReturningMed",
	"blknanoninjato": "BladeMed",
	"blkcranberry": "ConsoleSml",
	"blkeradicator": "EnergyMed",
	"blkcaselesspistol": "PistolSml",
	"blkprotectionorb": "Unarmed", // "DroneSml",
	"blktwintanto": "DualMeleeMed",
	"blkhellbringer": "ReturningLrg",
	"blkplasmaspear": "Unarmed", //"ThrustingLrg",
	"blkpartnerrevelatorz17": "Unarmed", // "DroneSml",
	"blkspecialdeathknightsword": "BladeXXL",
	"blkdoublecross": "DualMeleeMed",
	"blkarbitrator": "RifleMed",
	"blkhandcannon": "PistolSml",
	"blkglassshard": "BladeSml",
	"blkrustytrusty": "BladeSml" //,
	//"blkblastshield"             : "ShieldSml"
};

var animations = {
	"BladeMed": {
		"baseAtk": "BladeMed_BaseAtk_001",
		"baseHit": "BladeMed_BaseHit_001",
		"baseIdle": "BladeMed_BaseIdle_001",
		"buff": "BladeMed_Buff_001",
		"death": "BladeMed_Death_001",
		"heal": "BladeMed_Heal_001",
		"pwdAtk": "BladeMed_PoweredAtk_101",
		"rez": "BladeMed_Rez_001",
		"taunt": "BladeMed_Taunt_001"
	},
	"BladeSml": {
		"baseAtk": "BladeSml_BaseAtk_001",
		"baseHit": "BladeSml_BaseHit_001",
		"baseIdle": "BladeSml_BaseIdle_001",
		"buff": "BladeSml_Buff_001",
		"death": "BladeSml_Death_001",
		"heal": "BladeSml_Heal_001",
		"pwdAtk": "BladeSml_PoweredAtk_101",
		"rez": "BladeSml_Rez_001",
		"taunt": "BladeSml_Taunt_001"
	},
	"BladeXXL": {
		"baseAtk": "BladeXXL_BaseAtk_001",
		"baseHit": "BladeXXL_BaseHit_001",
		"baseIdle": "BladeXXL_BaseIdle_001",
		"buff": "BladeXXL_Buff_001",
		"death": "BladeXXL_Death_001",
		"heal": "BladeXXL_Heal_001",
		"pwdAtk": "BladeXXL_PoweredAtk_101",
		"rez": "BladeXXL_Rez_001",
		"taunt": "BladeXXL_Taunt_001"
	},
	"ConsoleMed": {
		"baseAtk": "ConsoleMed_BasicAtk_001",
		"baseHit": "ConsoleMed_BasicHit_001",
		"baseIdle": "ConsoleMed_BasicIdle_001",
		"buff": "ConsoleMed_Buff_001",
		"death": "ConsoleMed_Death_001",
		"heal": "ConsoleMed_Heal_001",
		"pwdAtk": "ConsoleMed_PoweredAtk_101",
		"rez": "ConsoleMed_Rez_001",
		"taunt": "ConsoleMed_Taunt_001"
	},
	"ConsoleSml": {
		"baseAtk": "ConsoleSml_BasicAtk_001",
		"baseHit": "ConsoleSml_BasicHit_001",
		"baseIdle": "ConsoleSml_BasicIdle_001",
		"buff": "ConsoleSml_Buff_001",
		"death": "ConsoleSml_Death_001",
		"heal": "ConsoleSml_Heal_001",
		"pwdAtk": "ConsoleSml_PoweredAtk_101",
		"rez": "ConsoleSml_Rez_001",
		"taunt": "ConsoleSml_Taunt_001"
	},
	"DualMeleeMed": {
		"baseAtk": "DualMeleeMed_BaseAtk_001",
		"baseHit": "DualMeleeMed_BasicHit_001",
		"baseIdle": "DualMeleeMed_BasicIdle_001",
		"buff": "DualMeleeMed_Buff_001",
		"death": "DualMeleeMed_Death_001",
		"heal": "DualMeleeMed_Heal_001",
		"pwdAtk": "DualMeleeMed_PoweredAtk_101",
		"rez": "DualMeleeMed_Rez_001"
	},
	"DualMeleeSml": {
		"baseAtk": "DualMeleeSml_BaseAtk_001",
		"baseHit": "DualMeleeSml_BasicHit_001",
		"baseIdle": "DualMeleeSml_BasicIdle_001",
		"buff": "DualMeleeSml_Buff_001",
		"death": "DualMeleeSml_Death_001",
		"heal": "DualMeleeSml_Heal_001",
		"pwdAtk": "DualMeleeSml_PoweredAtk_101",
		"rez": "DualMeleeSml_Rez_001",
		"taunt": "DualMeleeSml_Taunt_001"
	},
	"DualRangedMed": {
		"baseAtk": "DualRangedMed_BaseAtk_001",
		"baseHit": "DualRangedMed_BasicHit_001",
		"baseIdle": "DualRangedMed_BasicIdle_001",
		"buff": "DualRangedMed_Buff_001",
		"death": "DualRangedMed_Death_001",
		"heal": "DualRangedMed_Heal_001",
		"pwdAtk": "DualRangedMed_PoweredAtk_101",
		"rez": "DualRangedMed_Rez_001",
		"taunt": "DualRangedMed_Taunt_001"
	},
	"DualRangedSml": {
		"baseAtk": "DualRangedSml_BaseAtk_001",
		"baseHit": "DualRangedSml_BasicHit_001",
		"baseIdle": "DualRangedSml_BasicIdle_001",
		"buff": "DualRangedSml_Buff_001",
		"death": "DualRangedSml_Death_001",
		"heal": "DualRangedSml_Heal_001",
		"pwdAtk": "DualRangedSml_PoweredAtk_101",
		"rez": "DualRangedSml_Rez_001",
		"taunt": "DualRangedSml_Taunt_001"
	},
	"EnergyMed": {
		"baseAtk": "EnergyMed_BasicAtk_001",
		"baseHit": "EnergyMed_BasicHit_001",
		"baseIdle": "EnergyMed_BasicIdle_001",
		"buff": "EnergyMed_Buff_001",
		"death": "EnergyMed_Death_001",
		"heal": "EnergyMed_Heal_001",
		"pwdAtk": "EnergyMed_PoweredAtk_101",
		"rez": "EnergyMed_Rez_001",
		"taunt": "EnergyMed_Taunt_001"
	},
	"EnergySml": {
		"baseAtk": "EnergySml_BasicAtk_001",
		"baseHit": "EnergySml_BasicHit_001",
		"baseIdle": "EnergySml_BasicIdle_001",
		"buff": "EnergySml_Buff_001",
		"death": "EnergySml_Death_001",
		"heal": "EnergySml_Heal_001",
		"pwdAtk": "EnergySml_PoweredAtk_101",
		"rez": "EnergySml_Rez_001",
		"taunt": "EnergySml_Taunt_001"
	},
	"PistolMed": {
		"baseAtk": "PistolMed_BasicAtk_001",
		"baseHit": "PistolMed_BasicHit_001",
		"baseIdle": "PistolMed_BasicIdle_001",
		"buff": "PistolMed_Buff_001",
		"death": "PistolMed_Death_001",
		"heal": "PistolMed_Heal_001",
		"pwdAtk": "PistolMed_PoweredAtk_101",
		"rez": "PistolMed_Rez_001",
		"taunt": "PistolMed_Taunt_001"
	},
	"PistolSml": {
		"baseAtk": "PistolSml_BasicAtk_001",
		"baseHit": "PistolSml_BasicHit_001",
		"baseIdle": "PistolSml_BasicIdle_001",
		"buff": "PistolSml_Buff_001",
		"death": "PistolSml_Death_001",
		"heal": "PistolSml_Heal_001",
		"pwdAtk": "PistolSml_PoweredAtk_101",
		"rez": "PistolSml_Rez_001",
		"taunt": "PistolSml_Taunt_001"
	},
	"ReturningLrg": {
		"baseAtk": "ReturningLrg_BasicAtk_001",
		"baseHit": "ReturningLrg_BasicHit_001",
		"baseIdle": "ReturningLrg_BasicIdle_001",
		"buff": "ReturningLrg_Buff_001",
		"death": "ReturningLrg_Death_001",
		"heal": "ReturningLrg_Heal_001",
		"pwdAtk": "ReturningLrg_PoweredAtk_101",
		"rez": "ReturningLrg_Rez_001",
		"taunt": "ReturningLrg_Taunt_001"
	},
	"ReturningMed": {
		"baseAtk": "ReturningMed_BasicAtk_001",
		"baseHit": "ReturningMed_BasicHit_001",
		"baseIdle": "ReturningMed_BasicIdle_001",
		"buff": "ReturningMed_Buff_001",
		"death": "ReturningMed_Death_001",
		"heal": "ReturningMed_Heal_001",
		"pwdAtk": "ReturningMed_PoweredAtk_101",
		"rez": "ReturningMed_Rez_001",
		"taunt": "ReturningMed_Taunt_001"
	},
	"RifleMed": {
		"baseAtk": "RifleMed_BasicAtk_001",
		"baseHit": "RifleMed_BasicHit_001",
		"baseIdle": "RifleMed_BasicIdle_001",
		"buff": "RifleMed_Buff_001",
		"death": "RifleMed_Death_001",
		"heal": "RifleMed_Heal_001",
		"pwdAtk": "RifleMed_PoweredAtk_101",
		"rez": "RifleMed_Rez_001",
		"taunt": "RifleMed_Taunt_001"
	},
	"RifleSml": {
		"baseAtk": "RifleSml_BasicAtk_001",
		"baseHit": "RifleSml_BasicHit_001",
		"baseIdle": "RifleSml_BasicIdle_001",
		"buff": "RifleSml_Buff_001",
		"death": "RifleSml_Death_001",
		"heal": "RifleSml_Heal_001",
		"pwdAtk": "RifleSml_PoweredAtk_101",
		"rez": "RifleSml_Rez_001",
		"taunt": "RifleSml_Taunt_001"
	},
	"ThrustingLrg": {
		"baseAtk": "ThrustingLrg_BaseAtk_001",
		"baseHit": "ThrustingLrg_BaseHit_001",
		"baseIdle": "ThrustingLrg_BaseIdle_001",
		"buff": "ThrustingLrg_Buff_001",
		"death": "ThrustingLrg_Death_001",
		"heal": "ThrustingLrg_Heal_001",
		"pwdAtk": "ThrustingLrg_PoweredAtk_001",
		"rez": "ThrustingLrg_Rez_001",
		"taunt": "ThrustingLrg_Taunt_001"
	},
	"ThrustingMed": {
		"baseAtk": "ThrustingMed_BaseAtk_001",
		"baseHit": "ThrustingMed_BaseHit_001",
		"baseIdle": "ThrustingMed_BaseIdle_001",
		"buff": "ThrustingMed_Buff_001",
		"death": "ThrustingMed_Death_001",
		"heal": "ThrustingMed_Heal_001",
		"pwdAtk": "ThrustingMed_PoweredAtk_101",
		"rez": "ThrustingMed_Rez_001",
		"taunt": "ThrustingMed_Taunt_001"
	},
	"ThrustingSml": {
		"baseAtk": "ThrustingSml_BaseAtk_001",
		"baseHit": "ThrustingSml_BaseHit_001",
		"baseIdle": "ThrustingSml_BaseIdle_001",
		"buff": "ThrustingSml_Buff_001",
		"death": "ThrustingSml_Death_001",
		"heal": "ThrustingSml_Heal_001",
		"pwdAtk": "ThrustingSml_PoweredAtk_101",
		"rez": "ThrustingSml_Rez_001",
		"taunt": "ThrustingSml_Taunt_001"
	},
	"Unarmed": {
		"baseAtk": "Unarmed_BasicAtk_001",
		"baseHit": "Unarmed_BasicHit_001",
		"baseIdle": "Unarmed_BasicIdle_001",
		"buff": "Unarmed_Buff_001",
		"death": "Unarmed_Death_001",
		"heal": "Unarmed_Heal_001",
		"pwdAtk": "Unarmed_PoweredAtk_101",
		"rez": "Unarmed_Rez_001",
		"taunt": "Unarmed_Taunt_001"
	}
};

var CanvasColorApplication = function () {
  function CanvasColorApplication() {
    classCallCheck(this, CanvasColorApplication);
  }

  createClass(CanvasColorApplication, [{
    key: 'getCanvas',
    value: function getCanvas(sourceCanvas) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
      return { canvas: canvas, ctx: ctx };
    }
  }, {
    key: 'colorCanvas',
    value: function colorCanvas(sourceCanvas, sourceImage, skinTone, gender) {
      if (!sourceCanvas) {
        return;
      }

      // Desired color
      var rgb_dest = void 0;
      if (skinTone === 4) {
        rgb_dest = [192, 142, 104]; // Tone IV
      } else if (skinTone === 5) {
        rgb_dest = [156, 99, 61]; // Tone V
      } else if (skinTone === 6) {
        rgb_dest = [89, 69, 57]; // Tone VI
      } else {
        // The default image already has the lightest skin tone
        var _getCanvas = this.getCanvas(sourceCanvas),
            _canvas = _getCanvas.canvas,
            _ctx = _getCanvas.ctx;

        _ctx.putImageData(sourceImage, 0, 0);
        return { canvas: _canvas, ctx: _ctx };
      }

      // Base color
      var rgb_origin = void 0,
          rgb_shadow = void 0;
      if (gender === 'male') {
        rgb_origin = [186, 166, 158]; // Base Color for Male
        rgb_shadow = [112, 112, 107]; // Shadow Color for Male
      } else if (gender === 'female') {
        rgb_origin = [202, 176, 166]; // Base Color for Female
        rgb_shadow = [123, 121, 116]; // Shadow Color for Female
      }

      var rgb_diff = [Math.abs(rgb_origin[0] - rgb_dest[0]), Math.abs(rgb_origin[1] - rgb_dest[1]), Math.abs(rgb_origin[2] - rgb_dest[2])];

      var MAGIC_BASE_COLOR_GAP_MULT = 3;

      var _getCanvas2 = this.getCanvas(sourceCanvas),
          canvas = _getCanvas2.canvas,
          ctx = _getCanvas2.ctx;

      // Clear everything


      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get the body image, use the original default image
      ctx.putImageData(sourceImage, 0, 0);

      // Create the cutout canvas
      var cutout = this.getCanvas(sourceCanvas);
      cutout.ctx.drawImage(canvas, 0, 0);

      // Apply the cutout
      cutout.ctx.globalCompositeOperation = 'source-in';
      cutout.ctx.fillStyle = 'rgb(' + rgb_diff.join(',') + ')';
      cutout.ctx.fillRect(0, 0, cutout.canvas.width, cutout.canvas.height);
      cutout.ctx.globalCompositeOperation = 'source-over';

      // Cut out all of the black & white pixels
      var rgb_base_diff = [Math.abs(rgb_origin[0] - rgb_shadow[0]), Math.abs(rgb_origin[1] - rgb_shadow[1]), Math.abs(rgb_origin[2] - rgb_shadow[2])];

      var rgb_midpoint = [rgb_origin[0] - rgb_base_diff[0] / 2, rgb_origin[1] - rgb_base_diff[1] / 2, rgb_origin[2] - rgb_base_diff[2] / 2];

      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imgData.data;
      var rgb_removed = [];
      for (var color_i = 0; color_i < data.length; color_i += 4) {
        var red = data[color_i];
        var green = data[color_i + 1];
        var blue = data[color_i + 2];
        var alpha = data[color_i + 3];

        // If the color difference is vastly outside of this expected range, then save
        if (Math.abs(red - rgb_midpoint[0]) < MAGIC_BASE_COLOR_GAP_MULT * rgb_base_diff[0] / 2 && Math.abs(green - rgb_midpoint[1]) < MAGIC_BASE_COLOR_GAP_MULT * rgb_base_diff[1] / 2 && Math.abs(blue - rgb_midpoint[2]) < MAGIC_BASE_COLOR_GAP_MULT * rgb_base_diff[2] / 2) {
          rgb_removed.push(0, 0, 0, 0);
        } else {
          rgb_removed.push(red, green, blue, alpha);
        }
      }

      // Apply the transformation to the original canvas
      ctx.globalCompositeOperation = 'difference';
      ctx.drawImage(cutout.canvas, 0, 0);

      // Replace the outline
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (var _color_i = 0; _color_i < imgData.data.length; _color_i += 4) {
        var _red = rgb_removed[_color_i];
        var _green = rgb_removed[_color_i + 1];
        var _blue = rgb_removed[_color_i + 2];
        var _alpha = rgb_removed[_color_i + 3];

        // If the color difference is vastly outside of this expected range, then save
        if (_alpha !== 0) {
          imgData.data[_color_i] = _red;
          imgData.data[_color_i + 1] = _green;
          imgData.data[_color_i + 2] = _blue;
          imgData.data[_color_i + 3] = _alpha;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      {
        // Try to color the outline to tint the lighter areas
        // Set up the outline canvas
        var outline = this.getCanvas(sourceCanvas);
        var outlineImgData = outline.ctx.getImageData(0, 0, outline.canvas.width, outline.canvas.height);
        for (var _color_i2 = 0; _color_i2 < outlineImgData.data.length; _color_i2 += 4) {
          var _red2 = rgb_removed[_color_i2];
          var _green2 = rgb_removed[_color_i2 + 1];
          var _blue2 = rgb_removed[_color_i2 + 2];
          var _alpha2 = rgb_removed[_color_i2 + 3];

          // If the color difference is vastly outside of this expected range, then save
          if (_alpha2 !== 0) {
            if (_red2 + _green2 + _blue2 <= 200 * 3) {
              outlineImgData.data[_color_i2] = _red2;
              outlineImgData.data[_color_i2 + 1] = _green2;
              outlineImgData.data[_color_i2 + 2] = _blue2;
              outlineImgData.data[_color_i2 + 3] = _alpha2;
            }
          }
        }
        outline.ctx.putImageData(outlineImgData, 0, 0);

        // Apply color to the outline canvas for grey areas
        outline.ctx.globalCompositeOperation = 'source-in';
        outline.ctx.fillStyle = 'rgb(' + rgb_diff.join(',') + ')';
        outline.ctx.fillRect(0, 0, outline.canvas.width, outline.canvas.height);
        outline.ctx.globalCompositeOperation = 'source-over';

        // Apply the transformation to the original canvas
        ctx.globalCompositeOperation = 'color-burn';
        ctx.drawImage(outline.canvas, 0, 0);
      }

      // Return the new image
      return { canvas: canvas, ctx: ctx };
    }
  }]);
  return CanvasColorApplication;
}();

var SpineCharacter = function () {

  // Resources
  // https://rawgit.com/EsotericSoftware/spine-runtimes/3.8/spine-ts/webgl/demos/skins.js
  // http://en.esotericsoftware.com/spine-runtime-skins
  // http://esotericsoftware.com/forum/spine-ts-change-region-on-an-attachment-during-runtime-14299
  // https://www.html5gamedevs.com/topic/45964-esoteric-spine-changing-art-of-a-slot-with-multiple-attachment-regions/

  function SpineCharacter(assetManager, skeletonFile, identifier, atlasFile) {
    classCallCheck(this, SpineCharacter);

    this.skeletonFile = skeletonFile;

    if (atlasFile) {
      this.atlasFile = atlasFile;
    } else {
      this.atlasFile = this.skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas") + "?" + identifier;
    }

    console.log("Loading skeletonFile", skeletonFile, "for", identifier);
    console.log("Loading atlasFile", this.atlasFile, "for", identifier);

    this.assetManager = assetManager;
    this.assetManager.loadText(this.skeletonFile);
    this.assetManager.loadTextureAtlas(this.atlasFile);

    // We save some images to replace them if they were overwritten
    this.defaultImage = null;
    this.skinImageData = null;
    this.skinTone = 1;
    this.gender = 'male';

    this.assetToSlotMapping = {
      //"HandsPistolGripB",
      "handsreleasegripb": "HandsReleaseGripB",
      "handscarrygrip": "HandsCarryGrip",
      "handspointgripb": "HandsPointGripB",
      "handscradlegripb": "HandsCradleGripB",
      "handspolegripb": "HandsPoleGripB",
      "handsbasegripb": "HandsBaseGripB",
      "backarm": "Back Arm",
      "armaccessb": "Arm AccessB",
      "torsobg": "TorsoBG",
      "backlegbot": "Back Leg Bot",
      "backlegtop": "Back Leg Top",
      "shoesb": "ShoesB",
      "legaccessb": "Leg AccessB",
      "torsobot": "Torsobot",
      "frontlegbot": "Front LegBot",
      "frontlegtop": "Front LegTop",
      "shoes": "Shoes",
      "legaccess": "Leg Access",
      "torsotop": "Torsotop",
      "headbot": "HeadBot",
      "hairextra": "Hair Extra",
      "hair": "Hair",
      "headtop": "HeadTop",
      "handstriggergrip": "HandsTriggerGrip",
      "handsbackgrip": "HandsBackGrip",
      "handsrestinggrip": "HandsRestingGrip",
      "handsreleasegrip": "HandsReleaseGrip",
      "handsbasegrip": "HandsBaseGrip",
      "frontarm": "Front Arm",
      "armaccess": "Arm Access",
      "shoulders": "Shoulders"
    };

    this.weaponsMapping = {
      "BladeMed": "Blade Med 1H",
      "BladeSml": "BladeSml 1H",
      "BladeXXL": "Blade XXL 2H",
      "ConsoleSml": "", // "Console Sml 1H", showing up as "Console Med 1H",
      "DroneSml": "",
      "DualMeleeMed": ["DualmeleeMed1B", "Dualmelee Med 1H"],
      "DualMeleeSml": ["DualmeleeSml1B", "Dualmelee Sml 1H"],
      "EnergyMed": "Energy Med 2H",
      "EnergySml": "Energy Sml 1H",
      "PistolSml": "DualrangedSml1B", //, "Pistol Sml 1H",
      "ReturningLrg": "Returning Lrg 1H",
      "ReturningMed": "Returning Med 1H",
      "RifleMed": "Rifle Med 2H",
      "RifleSml": "Rifle Sml 2H",
      "ThrustingLrg": "", //"Thrusting Lrg 2H",
      "ThrustingSml": "Thrusting Sml 1H"
    };

    this.parts = {
      "head": ["headbot", "hairextra", "hair", "headtop"],
      "body": ["torsobg", "torsobot", "torsotop", "shoulders"],
      "arms": ["handsreleasegripb", "handscarrygrip", "handspointgripb", "handscradlegripb", "handspolegripb", "handsbasegripb", "handstriggergrip", "handsbackgrip", "handsrestinggrip", "handsreleasegrip", "handsbasegrip", "backarm", "armaccessb", "frontarm", "armaccess"],
      "legs": ["backlegbot", "shoesb", "backlegtop", "legaccessb", "frontlegbot", "shoes", "frontlegtop", "legaccess"],
      "all": ["backarm", "torsobg", "handsbasegripb", "armaccessb", "backlegbot", "shoesb", "backlegtop", "legaccessb", "torsobot", "frontlegbot", "shoes", "frontlegtop", "torsotop", "legaccess", "headbot", "hairextra", "hair", "headtop", "frontarm", "handsbasegrip", "armaccess", "shoulders"]
    };

    this.skinParts = ["HandsBackGrip", "HandsBaseGrip", "HandsBaseGripB", "HandsCarryGrip", "HandsCradleGripB", "HandsPistolGripB", "HandsPointGripB", "HandsPoleGripB", "HandsReleaseGrip", "HandsReleaseGripB", "HandsRestingGrip", "HandsTriggerGrip", "Back Arm Base", "Front Arm Base", "Head Base", "Front Leg Base", "Back Leg Base", "Torso Base"];

    this.skinTones = [1, 4, 5, 6];

    // The above needs to load BEFORE we can assetManager.get them
  }

  createClass(SpineCharacter, [{
    key: "createMesh",
    value: function createMesh(skin, animation, xShift, yShift, flipX, scale) {
      // Load the texture atlas using name.atlas and name.png from the AssetManager.
      // The function passed to TextureAtlas is used to resolve relative paths.
      this.atlas = this.assetManager.get(this.atlasFile);
      this.skeleton = this.assetManager.get(this.skeletonFile);

      // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
      this.atlasLoader = new spine.AtlasAttachmentLoader(this.atlas);

      // Create a SkeletonJson instance for parsing the .json file.
      var skeletonJson = new spine.SkeletonJson(this.atlasLoader);

      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      skeletonJson.scale = scale;
      this.skeletonData = skeletonJson.readSkeletonData(this.skeleton);

      // Create a SkeletonMesh from the data and attach it to the scene
      this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData, function (parameters) {
        parameters.depthTest = false;
      });

      if (skin === 'Male') this.gender = 'male';else if (skin === 'Female') this.gender = 'female';

      this.skeletonMesh.state.setAnimation(0, animation, true);
      this.skeletonMesh.skeleton.setSkinByName(skin);
      this.skeletonMesh.skeleton.scaleX = flipX ? -1 : 1;
      this.skeletonMesh.skeleton.x = xShift;
      this.skeletonMesh.skeleton.y = yShift;

      /**
       * Custom Parameters
       **/
      this.skeletonMesh.assetLoadingCount = 0;

      return this.skeletonMesh;
    }
  }, {
    key: "isValidSlot",
    value: function isValidSlot(slot) {
      return ['head', 'body', 'arms', 'legs', 'weapon'].indexOf(slot) !== -1;
    }
  }, {
    key: "partBelongsToSlot",
    value: function partBelongsToSlot(slot, part) {
      if (this.parts.hasOwnProperty(slot)) {
        return this.parts[slot].indexOf(part) !== -1;
      }

      return false;
    }
  }, {
    key: "setAnimation",
    value: function setAnimation(animation) {
      this.skeletonMesh.state.setAnimation(0, animation, true);
    }
  }, {
    key: "setSkin",
    value: function setSkin(skin) {
      if (skin === 'Male') this.gender = 'male';else if (skin === 'Female') this.gender = 'female';

      this.skeletonMesh.skeleton.setSkinByName(skin);
    }
  }, {
    key: "setSkinTone",
    value: function setSkinTone(skinTone) {
      skinTone = parseInt(skinTone, 10);
      var parsedSkinTone = this.parseSkinTone(skinTone);
      if (parsedSkinTone !== this.skinTone) {
        this.skinTone = parsedSkinTone;
        this.createSkinTone();
        this.renderSkinTone();
      }
    }
  }, {
    key: "parseSkinTone",
    value: function parseSkinTone(skinTone) {
      // Find next value
      if (this.skinTones.indexOf(skinTone) !== -1) {
        return skinTone;
      }

      // Otherwise return previous value
      return this.skinTone;
    }
  }, {
    key: "createSkinTone",
    value: function createSkinTone() {
      // Get the default canvas and color it
      var res = this.colorCanvas();
      if (!res) {
        return;
      }

      var colorCanvas = res.canvas;
      var colorCtx = res.ctx;

      var imageData = colorCtx.getImageData(0, 0, colorCanvas.width, colorCanvas.height);
      this.skinImageData = imageData;
    }
  }, {
    key: "renderSkinTone",
    value: function renderSkinTone() {
      if (!this.skinImageData) {
        return;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.skinParts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var name = _step.value;

          var slot = this.skeletonMesh.skeleton.findSlot(name);
          if (!slot || !slot.attachment) {
            continue;
          }

          // From one to the other
          this.ctx.putImageData(this.skinImageData, 0, 0, slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, slot.attachment.region.height);
        }

        // Now re-render
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.resetTexture();
    }
  }, {
    key: "colorCanvas",
    value: function colorCanvas() {
      if (!this.canvas || !this.defaultImage) {
        return;
      }

      var cca = new CanvasColorApplication();
      return cca.colorCanvas(this.canvas, this.defaultImage, this.skinTone || 1, this.gender || 'male');
    }
  }, {
    key: "loadGear",
    value: function loadGear(slot, jsonPath) {
      var _gender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'female';

      var _this = this;

      var _rarity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'common';

      var _variant = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '000';

      if (!this.isValidSlot(slot) && slot !== 'all') throw "Invalid slot: " + slot;

      if (!jsonPath) {
        console.log("Notice: no JSON path provided -- clearing part.");

        // Clear out this part
        if (this.parts.hasOwnProperty(slot)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.parts[slot][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var part = _step2.value;

              this.clearTexture(this.assetToSlotMapping[part]);

              if (part.indexOf('hand') !== -1) {
                this.validateImage("HandsBaseGrip");
                this.validateImage("HandsBaseGripB");
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        this.renderTexture();

        if (slot === 'weapon') {
          this.skeletonMesh.state.setAnimation(0, animations['Unarmed'].baseIdle, true);
        }

        return;
      }

      var jsonPathOriginal = jsonPath;
      if (jsonPath.indexOf('http') !== 0) {
        //jsonPath = "assetOutput/" + jsonPath + "/" + jsonPath + ".json";
        jsonPath = "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/" + jsonPath + "/" + jsonPath + ".json";
      }

      // Weapon case
      if (slot === 'weapon' && weaponsToAnimations.hasOwnProperty(jsonPathOriginal)) {
        return this.loadWeapon(jsonPathOriginal, jsonPath, _rarity, _variant);
      }

      this.loadJson(jsonPath, function (response) {
        var config = JSON.parse(response);
        for (var gender in config) {
          if (gender !== _gender) continue;
          for (var rarity in config[gender]) {
            if (rarity !== _rarity) continue;

            if (!_this.parts.hasOwnProperty(slot)) {
              continue;
            }

            // Here, we should be rendering in order as defined by parts
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = _this.parts[slot][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _part = _step3.value;

                if (!config[gender][rarity].hasOwnProperty(_part)) {
                  continue;
                }

                // Wipe that area clean
                _this.clearTexture(_this.assetToSlotMapping[_part]);

                // Avoid null values
                if (!config[gender][rarity][_part]) {
                  // If hands, restore
                  if (_part.indexOf('hand') !== -1) {
                    _this.validateImage("HandsBaseGrip");
                    _this.validateImage("HandsBaseGripB");
                  }

                  continue;
                }

                // Load the texture
                var url = jsonPath.substr(0, jsonPath.lastIndexOf('/')) + "/" + gender + "/" + rarity + "/" + _part + ".png";
                if (_variant !== '000') {
                  url = jsonPath.substr(0, jsonPath.lastIndexOf('/')) + "/" + _variant + "/" + gender + "/" + rarity + "/" + _part + ".png";
                }

                _this.loadTexture(url, _this.assetToSlotMapping[_part]);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            break;
          }
          break;
        }
      }.bind(this));
    }
  }, {
    key: "loadWeapon",
    value: function loadWeapon(key, jsonPath, rarity) {
      var _variant = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "000";

      var part = weaponsToAnimations[key];
      if (this.weaponsMapping.hasOwnProperty(part)) {
        // First, change the animation to that idle area
        if (animations.hasOwnProperty(part)) {
          this.skeletonMesh.state.setAnimation(0, animations[part].baseIdle, true);
        } else {
          this.skeletonMesh.state.setAnimation(0, animations['Unarmed'].baseIdle, true);
        }

        var weapons = this.weaponsMapping[part];
        if (!Array.isArray(weapons)) {
          weapons = [weapons];
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = weapons[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var weaponPart = _step4.value;

            if (weaponPart.length === 0) {
              continue;
            } else {
              if (this.isSlotAvailable(weaponPart)) {
                console.log("Weapon Part Found");
                this.loadWeaponImage(weaponPart, jsonPath, rarity, _variant);
              } else {
                console.log("Weapon Part Not Found");
                setTimeout(this.loadWeaponImage.bind(this, weaponPart, jsonPath, rarity, _variant), 1);
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      } else {
        this.skeletonMesh.state.setAnimation(0, animations['Unarmed'].baseIdle, true);
      }
    }
  }, {
    key: "loadWeaponImage",
    value: function loadWeaponImage(weaponPart, jsonPath, rarity) {
      var _variant = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "000";

      // Wipe that area clean
      this.clearTexture(weaponPart);

      // Load the texture
      var url = jsonPath.substr(0, jsonPath.lastIndexOf('/')) + "/" + rarity + ".png";
      if (_variant !== '000') {
        url = jsonPath.substr(0, jsonPath.lastIndexOf('/')) + "/" + _variant + "/" + rarity + ".png";
      }
      this.loadTexture(url, weaponPart);
    }
  }, {
    key: "isSlotAvailable",
    value: function isSlotAvailable(name) {
      var slot = this.skeletonMesh.skeleton.findSlot(name);
      return slot && slot.attachment;
    }
  }, {
    key: "loadFullOutfit",
    value: function loadFullOutfit(jsonPath) {
      var _gender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'female';

      var _rarity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'common';

      var _variant = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '000';

      this.loadGear('all', jsonPath, _gender, _rarity, _variant);
    }
  }, {
    key: "loadJson",
    value: function loadJson(url, callback) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          callback.call(this, xhr.response);
        }
      };

      xhr.open('GET', url, true);
      xhr.send('');
    }
  }, {
    key: "clearTexture",
    value: function clearTexture(name) {
      if (!this.canvas) {
        return;
      }

      var slot = this.skeletonMesh.skeleton.findSlot(name);
      if (!slot) {
        console.error("Slot not found:", name);
        return;
      }

      if (!slot.attachment) {
        console.error("Clear Texture: Slot attachment not found:", name);
        return;
      }

      // Assume same size
      this.ctx.clearRect(slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, slot.attachment.region.height);
    }
  }, {
    key: "validateImage",
    value: function validateImage(name) {
      if (!this.canvas || !this.defaultImage) {
        return;
      }

      var defaults$$1 = ["HandsBaseGripB", "HandsBaseGrip"];
      if (defaults$$1.indexOf(name) !== -1) {
        var slot = this.skeletonMesh.skeleton.findSlot(name);
        if (!slot || !slot.attachment) {
          return;
        }

        var imageData = this.ctx.getImageData(slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, slot.attachment.region.height);

        var totalNumber = 0;
        var numberOfZeroes = 0;
        for (var i = 0; i < imageData.data.length; i += 4) {
          totalNumber++;
          if (imageData.data[i + 3] === 0) {
            numberOfZeroes++;
          }
        }

        if (numberOfZeroes / totalNumber > 0.95) {
          this.ctx.putImageData(this.defaultImage, 0, 0, slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, slot.attachment.region.height);
        }
      }
    }
  }, {
    key: "wipeOutline",
    value: function wipeOutline(slot) {
      this.ctx.clearRect(slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, 2);

      this.ctx.clearRect(slot.attachment.region.x, slot.attachment.region.y, 2, slot.attachment.region.height);

      this.ctx.clearRect(slot.attachment.region.x + slot.attachment.region.width - 2, slot.attachment.region.y, 2, slot.attachment.region.height);

      this.ctx.clearRect(slot.attachment.region.x, slot.attachment.region.y + slot.attachment.region.height - 2, slot.attachment.region.width, 2);
    }
  }, {
    key: "loadTexture",
    value: function loadTexture(path, name) {
      // Start loading
      this.skeletonMesh.assetLoadingCount++;

      // Get the image and create the canvas for this character
      this.createCanvas();

      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        this.skeletonMesh.assetLoadingCount--;

        var slot = this.skeletonMesh.skeleton.findSlot(name);
        if (!slot) {
          console.error("Slot not found:", name);
          return;
        }

        if (!slot.attachment) {
          console.error("Load Texture: Slot attachment not found:", name);
          if (this.skeletonMesh.assetLoadingCount <= 0) {
            this.renderSkinTone();
          }

          return;
        }

        // First, hands must always be underlying the applied image
        if (["HandsBaseGrip", "HandsBaseGripB"].indexOf(name) !== -1) {
          this.ctx.putImageData(this.defaultImage, 0, 0, slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, slot.attachment.region.height);
        }

        // Assume same size
        this.ctx.drawImage(img, slot.attachment.region.x, slot.attachment.region.y);

        // Wipe outline
        this.wipeOutline(slot);

        // Auto-resize
        /*
        this.ctx.drawImage(
          img,
          slot.attachment.region.x,
          slot.attachment.region.y,
          slot.attachment.region.width,
          slot.attachment.region.height
        );
        */

        /*
        // Auto-resize and auto-crop, causes issues
         let sourceRatio = img.width / img.height;
        let destRatio = slot.attachment.region.width / slot.attachment.region.height;
         let sourceHeight = img.height, sourceWidth = img.width;
        if (sourceRatio > destRatio) {
          sourceWidth = img.width * destRatio;
        } else if (sourceRatio < destRatio) {
          sourceHeight = img.height / destRatio;
        }
         this.ctx.drawImage(
          img,
          0,
          0,
          sourceWidth,
          sourceHeight,
          slot.attachment.region.x,
          slot.attachment.region.y,
          slot.attachment.region.width,
          slot.attachment.region.height
        );
        */

        this.validateImage(name);
        this.renderTexture.call(this);
      }.bind(this);
      img.onerror = function () {
        this.skeletonMesh.assetLoadingCount--;
        this.renderTexture.call(this);
      }.bind(this);
      img.src = path;
    }
  }, {
    key: "renderTexture",
    value: function renderTexture() {
      if (this.skeletonMesh.assetLoadingCount === 0) {
        this.resetTexture();
        this.renderSkinTone();
      }
    }
  }, {
    key: "resetTexture",
    value: function resetTexture() {
      if (!this.ctx) return;

      var spineTexture = new spine.threejs.ThreeJsTexture(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));

      // NOTICE: THE DEFAULT EXPORT FROM SPINE IS LINEAR,LINEAR
      spineTexture.setFilters(spine.TextureFilter.MipMapLinearNearest, spine.TextureFilter.Linear);

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.skeletonMesh.skeleton.slots[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _slot = _step5.value;

          if (!_slot.attachment) continue;
          _slot.attachment.region.texture = spineTexture;
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "createCanvas",
    value: function createCanvas() {
      if (!this.canvas) {
        var img = this.skeletonMesh.skeleton.getAttachmentByName("Torso Base", "Torso Base").region.texture.getImage();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        this.defaultImage = this.ctx.getImageData(0, 0, img.width, img.height);
      }
    }
  }, {
    key: "debug",
    value: function debug() {
      //console.log("Debug turned off for SpineCharacter");
      /*
      let atlas = this.atlasLoader.atlas;
      for (let region of atlas.regions) {
        console.log("Region Name:", region.name);
      }
       for (let animation of this.skeletonData.animations) {
        console.log("Animation Name:", animation.name);
      }
       let skins = this.skeletonMesh.skeleton.data.skins;
      for (let skin of skins) {
        console.log("Skin Name:", skin.name);
      }
      let obj = {};
      let attachments = this.skeletonMesh.skeleton.skin.getAttachments();
      for (let attachment of attachments) {
        if (!attachment.attachment || !attachment.attachment.region) continue;
        obj[attachment.name] = {
          x      : attachment.attachment.region.x,
          y      : attachment.attachment.region.y,
          height : attachment.attachment.region.height,
          width  : attachment.attachment.region.width,
        };
      }
      console.log(JSON.stringify(obj));
        for (let slot of this.skeletonMesh.skeleton.slots) {
        if (!slot.attachment) {
          //console.log("Absent Slot Name:", slot.data.name);
        } else {
          console.log(slot.data.name);
        }
      }
        //console.log(this.skeletonMesh)
      //debugger;
       // Updating the Spine associated files
      //this.listAttachments();
      //this.listAnimations();
       /*
      let obj = {};
      let attachments = this.skeletonMesh.skeleton.skin.getAttachments();
      for (let attachment of attachments) {
        if (!attachment.attachment || !attachment.attachment.region) continue;
        obj[attachment.name] = {
          x      : attachment.attachment.region.x,
          y      : attachment.attachment.region.y,
          height : attachment.attachment.region.height,
          width  : attachment.attachment.region.width,
        };
      }
      console.log(JSON.stringify(obj));
      */

    }
  }, {
    key: "listAttachments",
    value: function listAttachments() {
      var obj = {},
          all_obj = {};
      var skins = this.skeletonMesh.skeleton.data.skins;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = skins[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var skin = _step6.value;

          if (!skin.attachments || typeof skin.name !== 'string') continue;
          obj[skin.name.toLowerCase()] = {};
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = skin.attachments[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var attachment_objects = _step7.value;

              for (var key in attachment_objects) {
                var attachment = attachment_objects[key];
                obj[skin.name.toLowerCase()][key] = {
                  x: attachment.region.x,
                  y: attachment.region.y,
                  height: attachment.region.height,
                  width: attachment.region.width
                };
                all_obj[key] = {
                  x: attachment.region.x,
                  y: attachment.region.y,
                  height: attachment.region.height,
                  width: attachment.region.width
                };
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      console.log(JSON.stringify(obj));
      console.log(JSON.stringify(all_obj));
    }
  }, {
    key: "listAnimations",
    value: function listAnimations() {
      var animations$$1 = {},
          animationList = [];
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.skeletonData.animations[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var animation = _step8.value;

          animationList.push(animation.name);

          if (animation.name.indexOf('[') === 0) {
            continue;
          }

          var re = new RegExp("^([^_]*)_(.*)$");
          var matches = re.exec(animation.name);
          if (!matches || matches.length < 3) {
            console.error("Could not parse animation:", animation.name);
            continue;
          }

          var animationName = matches[1];
          var animationType = matches[2];
          //let animationNumber = matches[3];

          if (!animations$$1.hasOwnProperty(animationName)) {
            animations$$1[animationName] = {};
          }

          var parsedType = this.parseAnimationType(animationType);
          if (!parsedType) {
            console.error("Could not parse animation type:", animationType);
            continue;
          }

          if (!animations$$1[animationName].hasOwnProperty(parsedType)) {
            animations$$1[animationName][parsedType] = animation.name;
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      console.log(JSON.stringify(animationList));
      console.log(JSON.stringify(animations$$1));
    }
  }, {
    key: "parseAnimationType",
    value: function parseAnimationType(type) {
      if (type.indexOf('PoweredAtk') !== -1) {
        return 'pwdAtk';
      } else if (type.indexOf('Atk') !== -1) {
        return 'baseAtk';
      } else if (type.indexOf('Hit') !== -1) {
        return 'baseHit';
      } else if (type.indexOf('Idle') !== -1) {
        return 'baseIdle';
      } else if (type.indexOf('Buff') !== -1) {
        return 'buff';
      } else if (type.indexOf('Death') !== -1) {
        return 'death';
      } else if (type.indexOf('Heal') !== -1) {
        return 'heal';
      } else if (type.indexOf('Rez') !== -1) {
        return 'rez';
      } else if (type.indexOf('Taunt') !== -1) {
        return 'taunt';
      } else {
        return null;
      }
    }
  }]);
  return SpineCharacter;
}();

var SpineDrone = function () {
  function SpineDrone(assetManager, skeletonFile, drone, rarity, identifier) {
    classCallCheck(this, SpineDrone);

    this.skeletonFile = skeletonFile;
    this.atlasFile = this.skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas") + "?" + identifier;

    this.assetManager = assetManager;
    this.assetManager.loadText(this.skeletonFile);
    this.assetManager.loadTextureAtlas(this.atlasFile);

    this.drone = drone;
    this.rarity = rarity;

    // We save some images to replace them if they were overwritten
    this.DRONE_ATTACHMENT = "Drone/Sml1H/Blkpartnerrevelatorz17/001_Blkpartnerrevelatorz17DroneSml1H_Ultrarare";

    // The above needs to load BEFORE we can assetManager.get them
  }

  createClass(SpineDrone, [{
    key: "setDrone",
    value: function setDrone(drone, rarity) {
      this.drone = drone;
      this.rarity = rarity;
    }
  }, {
    key: "createMesh",
    value: function createMesh(xShift, yShift, flipX, scale) {
      // Load the texture atlas using name.atlas and name.png from the AssetManager.
      // The function passed to TextureAtlas is used to resolve relative paths.
      this.atlas = this.assetManager.get(this.atlasFile);
      this.skeleton = this.assetManager.get(this.skeletonFile);

      // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
      this.atlasLoader = new spine.AtlasAttachmentLoader(this.atlas);

      // Create a SkeletonJson instance for parsing the .json file.
      var skeletonJson = new spine.SkeletonJson(this.atlasLoader);

      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      skeletonJson.scale = scale;
      this.skeletonData = skeletonJson.readSkeletonData(this.skeleton);

      // Create a SkeletonMesh from the data and attach it to the scene
      this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData, function (parameters) {
        parameters.depthTest = false;
      });

      this.skeletonMesh.state.setAnimation(0, 'DroneSml_Idle_001', true);
      this.skeletonMesh.skeleton.setSkinByName('default');
      this.skeletonMesh.skeleton.scaleX = flipX ? -1 : 1;
      this.skeletonMesh.skeleton.x = xShift;
      this.skeletonMesh.skeleton.y = yShift;

      return this.skeletonMesh;
    }
  }, {
    key: "setAnimation",
    value: function setAnimation(animation) {
      this.skeletonMesh.state.setAnimation(0, animation, true);
    }
  }, {
    key: "loadDroneImage",
    value: function loadDroneImage() {
      // Load the texture
      var path = "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/" + this.drone + "/" + this.rarity + ".png";

      // Get the image and create the canvas for this character
      this.createCanvas();

      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        var slot = this.skeletonMesh.skeleton.findSlot(this.DRONE_ATTACHMENT);
        if (!slot) {
          console.error("Slot not found:", this.DRONE_ATTACHMENT);
          return;
        }

        if (!slot.attachment) {
          console.error("Slot attachment not found:", this.DRONE_ATTACHMENT);
          return;
        }

        // Resize appropriately
        var sourceRatio = img.width / img.height;
        var destRatio = slot.attachment.region.width / slot.attachment.region.height;

        var sourceHeight = img.height,
            sourceWidth = img.width;
        if (sourceRatio < destRatio) {
          sourceWidth = img.width * destRatio;
        } else if (sourceRatio > destRatio) {
          sourceHeight = img.height / destRatio;
        }

        this.ctx.drawImage(img, 4, 4, sourceWidth - 8, sourceHeight - 8, slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, slot.attachment.region.height);

        // Wipe outline & Render
        this.wipeOutline(slot);
        this.renderTexture();
      }.bind(this);
      img.onerror = function () {
        console.error("Could not load Drone image:", path);
      }.bind(this);
      img.src = path;
    }
  }, {
    key: "clearTexture",
    value: function clearTexture() {
      if (!this.canvas) {
        return;
      }

      // Assume same size
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "wipeOutline",
    value: function wipeOutline(slot) {
      this.ctx.clearRect(slot.attachment.region.x, slot.attachment.region.y, slot.attachment.region.width, 2);

      this.ctx.clearRect(slot.attachment.region.x, slot.attachment.region.y, 2, slot.attachment.region.height);

      this.ctx.clearRect(slot.attachment.region.x + slot.attachment.region.width - 2, slot.attachment.region.y, 2, slot.attachment.region.height);

      this.ctx.clearRect(slot.attachment.region.x, slot.attachment.region.y + slot.attachment.region.height - 2, slot.attachment.region.width, 2);
    }
  }, {
    key: "renderTexture",
    value: function renderTexture() {
      if (!this.ctx) return;

      var spineTexture = new spine.threejs.ThreeJsTexture(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));

      // NOTICE: THE DEFAULT EXPORT FROM SPINE IS LINEAR,LINEAR
      spineTexture.setFilters(spine.TextureFilter.MipMapLinearNearest, spine.TextureFilter.Linear);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.skeletonMesh.skeleton.slots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _slot = _step.value;

          if (!_slot.attachment) continue;
          _slot.attachment.region.texture = spineTexture;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "createCanvas",
    value: function createCanvas() {
      if (!this.canvas) {
        var img = this.skeletonMesh.skeleton.getAttachmentByName(this.DRONE_ATTACHMENT, this.DRONE_ATTACHMENT).region.texture.getImage();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = img.width;
        this.canvas.height = img.height;
      }
    }
  }]);
  return SpineDrone;
}();

var SpineBackground = function () {
  function SpineBackground(assetManager, skeletonFile) {
    var animation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "animation";
    classCallCheck(this, SpineBackground);

    this.skeletonFile = skeletonFile;
    this.atlasFile = this.skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas");

    this.assetManager = assetManager;
    this.assetManager.loadText(this.skeletonFile);
    this.assetManager.loadTextureAtlas(this.atlasFile);

    this.animation = animation || "animation";
  }

  createClass(SpineBackground, [{
    key: "createMesh",
    value: function createMesh() {
      var _scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.3;

      var _y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -120;

      // Load the texture atlas using name.atlas and name.png from the AssetManager.
      // The function passed to TextureAtlas is used to resolve relative paths.
      var atlas = this.assetManager.get(this.atlasFile);
      var skeleton = this.assetManager.get(this.skeletonFile);

      // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
      var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

      // Create a SkeletonJson instance for parsing the .json file.
      var skeletonJson = new spine.SkeletonJson(atlasLoader);

      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      skeletonJson.scale = _scale;
      var skeletonData = skeletonJson.readSkeletonData(skeleton);

      // Create a SkeletonMesh from the data and attach it to the scene
      var skeletonMesh = new spine.threejs.SkeletonMesh(skeletonData, function (parameters) {
        parameters.depthTest = false;
      });

      skeletonMesh.state.setAnimation(0, this.animation, true);
      skeletonMesh.skeleton.y = _y;
      return skeletonMesh;
    }
  }]);
  return SpineBackground;
}();

var backgrounds = {
	"corp-lobby-int-night-001": {
		"key": "S0_CorporatelobbyInteriorNight_001",
		"features": {
			"Midground": "S0_CorporatelobbyInteriorNight_001_SkeletonData",
			"Paralax1": "S0_CorporatelobbyInteriorNight_001_SkeletonData"
		}
	},
	"corp-office-int-night-001": {
		"key": "S0_CorporateofficeInteriorNight_001",
		"features": {
			"Midground": "S0_CorporateofficeInteriorNight_001_SkeletonData",
			"Paralax1": "S0_CorporateofficeInteriorNight_001_SkeletonData"
		}
	},
	"hideout-int-001": {
		"key": "S0_HideoutInterior_001",
		"features": {
			"Midground": "S0_HideoutInterior_001"
		}
	},
	"metro-tracks-int-001": {
		"key": "S0_MetrostationInterior_001",
		"features": {
			"Midground": "S0_MetrostationInterior_001_SkeletonData",
			"Paralax1": "S0_MetrostationInterior_001_SkeletonData"
		}
	},
	"metro-tracks-int-red-alert-001": {
		"key": "S0_MetrostationredalertInterior_001",
		"features": {
			"Midground": "S0_MetrostationredalertInterior_001_SkeletonData",
			"Paralax1": "S0_MetrostationredalertInterior_001_SkeletonData"
		}
	},
	"metro-steps-int-001": {
		"key": "S0_MetrostationInterior_002",
		"features": {
			"Midground": "S0_MetrostationInterior_002_SkeletonData"
		}
	},
	"shenju-alley-night-001": {
		"key": "S0_ShenjuAlleywayNight_001",
		"features": {
			"Foregound": "S0_ShenjuAlleywayNight_001_SkeletonData",
			"Midground": "S0_ShenjuAlleywayNight_001_SkeletonData",
			"Paralax1": "S0_ShenjuAlleywayNight_001_SkeletonData",
			"Paralax2": "S0_ShenjuAlleywayNight_001_SkeletonData"
		},
		"animation": "Idle"
	},
	"shenju-street-day-001": {
		"key": "S0_StreetsceneDay_001",
		"features": {
			"Midground": "S0_StreetsceneDay_001_SkeletonData",
			"Paralax1": "S0_StreetsceneDay_001_SkeletonData",
			"Paralax2": "S0_StreetsceneDay_001_SkeletonData"
		}
	},
	"training-room-001": {
		"key": "S0_Trainingroom_001",
		"features": {
			"Foregound": "S0_Trainingroom_001_SkeletonData",
			"Midground": "S0_Trainingroom_001_SkeletonData",
			"Paralax1": "S0_Trainingroom_001_SkeletonData",
			"Paralax2": "S0_Trainingroom_001_SkeletonData"
		}
	},
	"zero-day-ext-night-001": {
		"key": "S0_ZerodayExteriorNight_001",
		"features": {
			"Foregound": "S0_ZerodayExteriorNight_001_SkeletonData",
			"Midground": "S0_ZerodayExteriorNight_001_SkeletonData",
			"Paralax1": "S0_ZerodayExteriorNight_001_SkeletonData"
		}
	},
	"zero-day-int-001": {
		"key": "S0_ZerodayInterior_001",
		"features": {
			"Foregound": "S0_ZerodayInterior_001_SkeletonData",
			"Midground": "S0_ZerodayInterior_001_SkeletonData"
		}
	},
	"almond-uncontrolled-lobby-001": {
		"key": "SA_AlmondestateUncontrolledLobby_001",
		"features": "SA_AlmondestateUncontrolledLobby"
	},
	"almond-uncontrolled-overlook-ext-001": {
		"key": "SA_AlmondestateUncontrolledOverlookexterior_001",
		"features": "SA_AlmondestateUncontrolledOverlookexterior"
	},
	"almond-uncontrolled-res-corridor-001": {
		"key": "SA_AlmondestateUncontrolledResidentialcorridor_001",
		"features": "SA_AlmondestateUncontrolledResidentialcorridor"
	},
	"quarter-leatherheadz-unchained-bar-001": {
		"key": "SA_QuarterLeatherheadzUnchainedbar_001",
		"features": "SA_QuarterLeatherheadzUnchainedbar"
	},
	"quarter-leatherheadz-unchained-bar-ext-001": {
		"key": "SA_QuarterLeatherheadzUnchainedbarexterior_001",
		"features": "SA_QuarterLeatherheadzUnchainedexterior"
	},
	"quarter-vice-deepdive-ext-001": {
		"key": "SA_QuarterVicesquadDeepdiveexterior_001",
		"features": "SA_QuarterVicesquadDeepdiveexterior"
	},
	"quarter-vice-deepdive-lobby-001": {
		"key": "SA_QuarterVicesquadDeepdivelobby_001",
		"features": "SA_QuarterVicesquadDeepdivelobby"
	},
	"quarter-vice-deepdive-stacks-001": {
		"key": "SA_QuarterVicesquadDeepdivestacks_001",
		"features": "SA_QuarterVicesquadDeepdivestacks"
	},
	"shenju-uncontrolled-zion-shop-001": {
		"key": "SA_ShenjuUncontrolledZionsshop_001",
		"features": "SA_ShenjuUncontrolledZionsshop"
	},
	"shenju-uncontrolled-zion-shop-ext-001": {
		"key": "SA_ShenjuUncontrolledZionsshopexterior_001",
		"features": "SA_ShenjuUncontrolledZionsshopexterior"
	}
};

var drones = {
	"blkoriginwonderball": "DroneSml",
	"blkprotectionorb": "DroneSml",
	"blkpartnerrevelatorz17": "DroneSml"
};

var Stage = function (_SpineScene) {
  inherits(Stage, _SpineScene);

  function Stage(props) {
    classCallCheck(this, Stage);

    var _this = possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this, props));

    _this.characters = [];
    _this.background;
    _this.effects = {};

    // Internal
    _this._backgrounds = [];
    return _this;
  }

  createClass(Stage, [{
    key: "getScale",
    value: function getScale(value, position) {
      if (typeof value === 'string' && value === 'character') {
        switch (position) {
          // Back
          case 0:
          case 2:
          case 4:
          case 6:
            return 0.12;
          // Front
          case 1:
          case 3:
          case 5:
          case 7:
            return 0.148;
          // Center
          case 9:
            return 0.134;
          case -1:
            return 0.15;
          default:
            throw 'Invalid combat position for scale';
        }
      } else if (typeof value === 'string' && value === 'drone') {
        switch (position) {
          // Back
          case 0:
          case 2:
          case 4:
          case 6:
            return 0.132;
          // Front
          case 1:
          case 3:
          case 5:
          case 7:
            return 0.145;
          // Center
          case 9:
            return 0.134;
          case -1:
            return 0.15;
          default:
            throw 'Invalid combat position for scale';
        }
      } else {
        return value;
      }
    }
  }, {
    key: "getPosition",
    value: function getPosition(index) {
      // xShift, yShift, flipX
      //return [70, 40, false]

      switch (index) {
        case -1:
          return [0, -50, false];
        // Left Front Top
        case 0:
          return [-100, 40, false];
        // Left Front Bottom
        case 1:
          return [-200, -30, false];
        // Left Back Top
        case 2:
          return [-300, 40, false];
        // Left Back Bottom
        case 3:
          return [-400, -30, false];
        // Right Front Top
        case 4:
          return [100, 40, true];
        // Right Front Bottom
        case 5:
          return [200, -30, true];
        // Right Back Top
        case 6:
          return [300, 40, true];
        // Right Back Bottom
        case 7:
          return [400, -30, true];
        // Left Center
        case 8:
          return [-250, 0, true];
        // Right Center
        case 9:
          return [250, 0, true];
        // Left Front Center
        case 10:
          return [-175, 0, true];
        // Right Front Center
        case 11:
          return [175, 0, true];
        // Left Back Center
        case 12:
          return [-385, 0, true];
        // Right Back Center
        case 13:
          return [385, 0, true];
        default:
          throw 'Invalid combat position for position';
      }
    }
  }, {
    key: "defaultCameraPosition",
    value: function defaultCameraPosition() {
      return { "x": 0, "y": 120, "z": 400 };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      get(Stage.prototype.__proto__ || Object.getPrototypeOf(Stage.prototype), "componentDidMount", this).call(this, arguments);

      // Construct all skeletons for characters and backgrounds
      this.constructCharacters();
      this.constructBackgrounds();
      this.constructEffects();

      // Begin the animation
      requestAnimationFrame(this.loadSkeletons.bind(this));
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps) {
      if (nextProps.effectTest && _typeof(nextProps.effectTest) === 'object' && nextProps.effectTest.hasOwnProperty('src') && nextProps.effectTest.src) {
        // Scale and size
        var scale = nextProps.effectTest.scale;
        var size = nextProps.effectTest.size;
        if (size && (typeof size === "undefined" ? "undefined" : _typeof(size)) === 'object' && size.hasOwnProperty('width') && size.hasOwnProperty('height')) {
          this.effects.vfx0.setSize(size.width, size.height, scale);
        }

        // Position
        var pos = nextProps.effectTest.pos;
        if (pos && (typeof pos === "undefined" ? "undefined" : _typeof(pos)) === 'object' && pos.hasOwnProperty('x_pos') && pos.hasOwnProperty('y_pos')) {
          this.effects.vfx0.setPosition(pos.x_pos, pos.y_pos);
        }

        // Rotation
        if (nextProps.effectTest.hasOwnProperty('rotation')) {
          this.effects.vfx0.setRotation(nextProps.effectTest.rotation);
        }

        // Opacity
        if (nextProps.effectTest.hasOwnProperty('opacity')) {
          this.effects.vfx0.setOpacity(nextProps.effectTest.opacity);
        }

        // Speed
        if (nextProps.effectTest.hasOwnProperty('speed')) {
          this.effects.vfx0.setPlaybackRate(nextProps.effectTest.speed);
        }

        // Flip XY
        if (nextProps.effectTest.hasOwnProperty('flipX') || nextProps.effectTest.hasOwnProperty('flipY')) {
          this.effects.vfx0.setOrientation(nextProps.effectTest.flipX || false, nextProps.effectTest.flipY || false);
        }

        // Blend Mode
        if (nextProps.effectTest.hasOwnProperty('blend')) {
          this.effects.vfx0.setBlendMode(nextProps.effectTest.blend);
        }

        // Source
        if (nextProps.effectTest.src != this.effects.vfx0.getSrc()) {
          console.log("Setting src:", nextProps.effectTest.src, this.effects.vfx0.getSrc(), nextProps.effectTest.src != this.effects.vfx0.getSrc());
          this.effects.vfx0.setSrc(nextProps.effectTest.src);
          this.effects.vfx0.setLoop(true);
          this.effects.vfx0.play();
        }
      }

      if (nextProps.effectTest && _typeof(nextProps.effectTest) === 'object' && nextProps.effectTest.hasOwnProperty('effectKey') && nextProps.effectTest.effectKey) {
        var index = "vfx0";
        if (nextProps.effectTest.hasOwnProperty('effectIndex')) {
          index = String(nextProps.effectTest.effectIndex);
          console.log("using index", index);
        }

        console.log("Setting effect key:", nextProps.effectTest.effectKey, this.effects[index].getKey(), nextProps.effectTest.effectKey != this.effects[index].getKey());
        this.effects[index].setKey(nextProps.effectTest.effectKey);
        this.effects[index].setLoop(true);
        this.effects[index].play();
      }
    }
  }, {
    key: "constructEffects",
    value: function constructEffects() {
      // Create the necessary effect planes
      this.effects = {
        'vfx0': new VideoTexture(this.scene)
      };

      // Pull the base scaling, position, and flip data
      var positionBase = this.getPosition(-1);
      var scaleBase = this.getScale('character', -1);

      for (var index in this.characters) {
        // Choose the key
        var key = this.characters[index].hasOwnProperty('nftId') ? this.characters[index].nftId : String(index);

        // Pull the scaling, position, and flip data
        var position = this.getPosition(this.characters[index].position);
        var scale = this.getScale(this.characters[index].scale, this.characters[index].position);

        // Get the ratios
        var scaleRatio = scale / scaleBase;
        var xPos = position[0] - positionBase[0];
        var yPos = position[1] - positionBase[1];
        var flipX = position[2];

        this.effects[key] = new VideoTexture(this.scene, {
          'unit': {
            'scale': scaleRatio,
            'x_pos': xPos,
            'y_pos': yPos,
            'flipX': flipX
          }
        });
      }
    }
  }, {
    key: "deriveIdlePoseFromWeaponType",
    value: function deriveIdlePoseFromWeaponType(weaponType) {
      weaponType = weaponType.split('-')[0];
      if (weaponsToAnimations.hasOwnProperty(weaponType)) {
        if (animations.hasOwnProperty(weaponsToAnimations[weaponType])) {
          return animations[weaponsToAnimations[weaponType]].baseIdle;
        } else {
          console.warn("Animation does not exist for Weapon Type (" + weaponType + ") Animation:", weaponsToAnimations[weaponType]);
        }
      } else {
        console.warn("Weapon type does not exist in WEAPONS_TO_ANIMATIONS:", weaponType);
      }
    }
  }, {
    key: "constructCharacters",
    value: function constructCharacters() {
      // Preload all skeleton & atlas files
      for (var index in this.characters) {

        // Determine the skeleton
        var skeleton = this.spineOutputDirectory + "/character/MediumMaleHeavySkinTest.json";
        if (this.characters[index].hasOwnProperty('jsonFile') && this.characters[index].jsonFile.indexOf('.json') !== -1) {
          skeleton = this.characters[index].jsonFile;
        }

        // If a weapon type is provided, derive the pose
        if (!this.characters[index].pose && this.characters[index].weapon) {
          this.characters[index].pose = this.deriveIdlePoseFromWeaponType(this.characters[index].weapon);
        }

        // If no pose is provided, default to unarmed
        if (!this.characters[index].pose) {
          this.characters[index].pose = animations['Unarmed'].baseIdle;
        }

        // Store the weapon type to the character from the pose
        this.characters[index].weaponAnimationType = this.characters[index].pose.split('_')[0];

        // Allow for overriding the skeleton
        if (this.characters[index].hasOwnProperty('skeleton')) {
          skeleton = this.characters[index].skeleton;
        }

        // Create the Spine object
        this.characters[index].spine = new SpineCharacter(this.assetManager, skeleton, index, this.characters[index].atlasFile);

        // Create the Drone object if needed
        if (this.characters[index].hasOwnProperty('weapon') && this.isDroneWeapon(this.characters[index].weapon)) {
          var weapon = this.characters[index].weapon.split('-');

          this.characters[index].drone = new SpineDrone(this.assetManager, this.spineOutputDirectory + "/weapons/Blkpartnerdrone.json", weapon[0], weapon[1], index);
        }
      }
    }
  }, {
    key: "isDroneWeapon",
    value: function isDroneWeapon() {
      var weapon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      return drones.hasOwnProperty(weapon.split('-')[0]);
    }
  }, {
    key: "constructBackgrounds",
    value: function constructBackgrounds() {
      if (backgrounds.hasOwnProperty(this.background)) {
        var key = backgrounds[this.background].key;
        var features = backgrounds[this.background].features;
        var animation = backgrounds[this.background].animation;

        if (typeof features === 'string') {
          this._backgrounds.push(new SpineBackground(this.assetManager, this.spineOutputDirectory + "/backgrounds/" + key + "/" + features + ".json", animation));
        } else {
          var _arr = ["Paralax2", "Paralax1", "Midground", "Foreground"];

          for (var _i = 0; _i < _arr.length; _i++) {
            var _feature = _arr[_i];
            if (!features.hasOwnProperty(_feature)) continue;
            this._backgrounds.push(new SpineBackground(this.assetManager, this.spineOutputDirectory + "/backgrounds/" + key + "/" + _feature + "/" + features[_feature] + ".json", animation));
          }
        }

        return;
      }

      console.error("Could not find background " + this.background + " in backgrounds list.");
    }
  }, {
    key: "loadSkeletons",
    value: function loadSkeletons(atlasFile, skeletonFile) {
      var _this2 = this;

      if (this.assetManager.isLoadingComplete()) {
        // Create all skeletons
        var skeletons = [];

        // For each background feature, add skeleton
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this._backgrounds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _bg = _step.value;

            skeletons.push(_bg.createMesh());
          }

          // Construct the drawing order
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.characters.sort(function (a, b) {
          return _this2.getPosition(a.position)[1] < _this2.getPosition(b.position)[1] ? 1 : -1;
        }.bind(this));

        // Add to the internal list
        for (var index in this.characters) {
          var _characters$index$spi;

          // Drone spine
          if (this.characters[index].drone) {
            var _characters$index$dro;

            var dronePosition = this.getPosition(this.characters[index].position);
            dronePosition[1] -= 300; // Lower the drone

            skeletons.push((_characters$index$dro = this.characters[index].drone).createMesh.apply(_characters$index$dro, toConsumableArray(dronePosition).concat([this.getScale('drone', this.characters[index].position)])));

            this.characters[index].drone.loadDroneImage();
          }

          // Character spine
          skeletons.push((_characters$index$spi = this.characters[index].spine).createMesh.apply(_characters$index$spi, [this.characters[index].skin, this.characters[index].pose].concat(toConsumableArray(this.getPosition(this.characters[index].position)), [this.getScale(this.characters[index].scale, this.characters[index].position)])));

          if (this.characters[index].hasOwnProperty('outfit')) {
            // Outfit URL
            var tag = this.characters[index].outfit[1].toLowerCase();
            var url = "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/" + tag + "/" + tag + ".json";

            this.characters[index].spine.loadFullOutfit(url, this.characters[index].outfit[0].toLowerCase(), this.characters[index].outfit[2].toLowerCase(), this.characters[index].outfit.length >= 4 ? this.characters[index].outfit[3].toLowerCase() : '000');
          }
        }

        this.setSkeletons(skeletons);

        requestAnimationFrame(this.load.bind(this));
      } else requestAnimationFrame(this.loadSkeletons.bind(this));
    }
  }, {
    key: "getUnitPosition",
    value: function getUnitPosition(character) {
      var screen = this.getScreenWorldPosition();

      if (!screen || !character) {
        console.log("Null character or screen within Stage::getUnitPosition");
        return null;
      }

      var position = this.getPosition(character.position);
      var scale = this.getScale('character', character.position);
      var skeletonData = character.spine.skeletonData;

      var bbox = {
        x1: screen.x + (position[0] - scale * (skeletonData.width * 1 / 2)) * screen.fraction.width * this.DPI,
        y1: screen.y + (-position[1] - scale * skeletonData.height) * screen.fraction.height * this.DPI,
        x2: screen.x + (position[0] + scale * (skeletonData.width * 1 / 2)) * screen.fraction.width * this.DPI,
        y2: screen.y + (-position[1] + scale * skeletonData.height) * screen.fraction.height * this.DPI
      };

      var feet = {
        x: screen.x + position[0] * screen.fraction.width * this.DPI,
        y: screen.y - position[1] * screen.fraction.height * this.DPI
      };

      var above = {
        x: (bbox.x1 + bbox.x2) / 2 + (bbox.x2 - bbox.x1) / 2 * (bbox.x1 > this.canvas.width / 2 ? 0.25 : -0.25),
        y: bbox.y1 * 9 / 8
      };

      return {
        feet: feet,
        above: above,
        bbox: bbox,
        target: {
          x: bbox.x1 + (bbox.x2 - bbox.x1) * 1 / 2 * (bbox.x1 > this.canvas.width / 2 ? 0.75 : 0.25),
          y: bbox.y1 + (bbox.y2 - bbox.y1) * 3 / 32,
          width: (bbox.x2 - bbox.x1) * 1 / 2,
          height: (bbox.y2 - bbox.y1) * 3 / 8
        }
      };
    }

    //getUnitPositionExperiment() {
    // PULL THE SCREEN CODE FROM THE ABOVE FUNCTION
    //let _offset = (function() {
    //  let values = [];
    //  return {
    //    'set' : (a, b) => values.push(a, b),
    //    'get' : () => values
    //  };
    //})();
    //let _size = (function() {
    //  let values = [];
    //  return {
    //    'set' : (a, b) => values.push(a, b),
    //    'get' : () => values
    //  };
    //})();
    //skeleton.getBounds(_offset, _size)
    //let offset = _offset.get();
    //let size = _size.get();
    //bbox : {
    //  x1: ( offset[0] - size[0] * 1 / 2) * this.DPI * screen.fraction,
    //  y1: ( offset[1] - size[1] * 1 / 2) * this.DPI * screen.fraction,
    //  x2: ( offset[0] + size[0] * 1 / 2) * this.DPI * screen.fraction,
    //  y2: ( offset[1] + size[1] * 1 / 2) * this.DPI * screen.fraction
    //}
    //}

  }]);
  return Stage;
}(SpineScene);

var ActiveAnimationEvent = function () {
  function ActiveAnimationEvent(characters, effects, primaryEvents, eventAnimations) {
    classCallCheck(this, ActiveAnimationEvent);

    this.animationEndTime = 0;
    this.addtlMilliseconds = 3000;

    this.queue = [];

    this.currentEventIndex = 0;
    this.currentEventName = null;
    this.currentStatChanges = {};
    this.currentStatusEffectChanges = {};

    this.characters = characters;

    // Animation Events
    this.primaryEvents = primaryEvents;
    this.eventAnimations = eventAnimations;
    this.KnockoutEventName = 'KnockoutEvent';
  }

  createClass(ActiveAnimationEvent, [{
    key: 'enqueue',
    value: function enqueue(block, primaryEvent, secondaryEvents) {
      this.queue.push({ block: block, primaryEvent: primaryEvent, secondaryEvents: secondaryEvents });
    }
  }, {
    key: 'dequeue',
    value: function dequeue() {
      if (this.queue.length === 0) {
        // End the animation cycle
        if (this.currentEventName !== null) {
          window.dispatchEvent(new CustomEvent("eventBlockComplete"));
        }

        this.currentEventName = null;
        this.currentStatChanges = {};
        this.currentStatusEffectChanges = {};
        return;
      }

      // Get next event in the queue
      var obj = this.queue.shift();

      // Run the events
      var characterToAnimation = this.runEvent(obj.primaryEvent, obj.secondaryEvents);
      this.getLatestStatChanges({ 'battleEvents': [obj.primaryEvent].concat(toConsumableArray(obj.secondaryEvents)) });
      this.getLatestStatusEffectChanges({ 'battleEvents': [obj.primaryEvent].concat(toConsumableArray(obj.secondaryEvents)) });

      // Determine how long to run the animation for
      this.currentEventIndex++;
      this.currentEventName = obj.primaryEvent.name;
      this.currentInvokers = this.collectInvokers([obj.primaryEvent].concat(toConsumableArray(obj.secondaryEvents)));
      this.animationEndTime = Date.now() + this.calculateAdditionalMS(characterToAnimation);
    }
  }, {
    key: 'collectInvokers',
    value: function collectInvokers(events) {
      var invokers = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var evt = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = evt.invokerIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var invokerId = _step2.value;

              if (invokers.indexOf(invokerId) === -1) {
                invokers.push(invokerId);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return invokers;
    }
  }, {
    key: 'isInvoker',
    value: function isInvoker(unitId) {
      return this.currentInvokers && this.currentInvokers.length > 0 && this.currentInvokers.indexOf(unitId) !== -1;
    }
  }, {
    key: 'getCurrentEventIndex',
    value: function getCurrentEventIndex() {
      return this.currentEventIndex;
    }
  }, {
    key: 'calculateAdditionalMS',
    value: function calculateAdditionalMS(characterToAnimation) {
      // Default amount
      var addtlMilliseconds = this.addtlMilliseconds;

      for (var characterUuid in characterToAnimation) {
        if (characterToAnimation[characterUuid].name === 'AttackEvent') {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this.characters[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var character = _step3.value;

              if (character.unitId === characterUuid && character.drone) {
                addtlMilliseconds += 2000;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }

      return addtlMilliseconds;
    }
  }, {
    key: 'runEvent',
    value: function runEvent(primaryEvent, secondaryEvents) {
      // For each secondary event, handle cases where we want to do one animation over the other
      var characterToAnimation = {};
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = secondaryEvents[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var secondaryEvent = _step4.value;

          if (!this.eventAnimations.hasOwnProperty(secondaryEvent.name)) {
            continue;
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = secondaryEvent.targetIds[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var _unitId3 = _step6.value;

              // Knockout event takes precedence always
              if (characterToAnimation.hasOwnProperty(_unitId3) && characterToAnimation[_unitId3].name === this.KnockoutEventName) {
                continue;
              }

              characterToAnimation[_unitId3] = secondaryEvent;
            }

            // Default to the invoker performing the attack animation if the primary event
            // doesn't fall into pre-defined animations & damage is done to a target
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          if (secondaryEvent.name === 'DamageEvent' || secondaryEvent.name === 'ShieldBlockEvent' || secondaryEvent.name === 'KnockoutEvent') {
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = secondaryEvent.invokerIds[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _unitId4 = _step7.value;

                // Knockout event takes precedence always
                if (characterToAnimation.hasOwnProperty(_unitId4) && characterToAnimation[_unitId4].name === this.KnockoutEventName) {
                  continue;
                }

                characterToAnimation[_unitId4] = _extends({}, secondaryEvent, { 'name': 'AttackEvent' });
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }
          }
        }

        // Get the primary event for the invoker
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = primaryEvent.invokerIds[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _unitId = _step5.value;

          // Knockout event takes precedence always
          if (characterToAnimation.hasOwnProperty(_unitId) && characterToAnimation[_unitId].name === this.KnockoutEventName) {
            continue;
          }

          if (this.eventAnimations.hasOwnProperty(primaryEvent.name)) {
            characterToAnimation[_unitId] = primaryEvent;
          }
        }

        // For each event, kick off
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      for (var _unitId2 in characterToAnimation) {
        console.log(_unitId2, characterToAnimation[_unitId2].name);
        var _event = characterToAnimation[_unitId2];
        if (this.eventAnimations.hasOwnProperty(_event.name)) {
          this.eventAnimations[_event.name].run(_event);
        }
      }

      if (primaryEvent.name === 'BattleCompleteEvent') {
        this.eventAnimations[primaryEvent.name].run(primaryEvent);
      }

      return characterToAnimation;
    }
  }, {
    key: 'getLatestStatChanges',
    value: function getLatestStatChanges(block) {
      this.currentStatChanges = {};
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = block.battleEvents[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _event = _step8.value;

          if (!_event.statChanges) continue;
          for (var _unitId in _event.statChanges) {

            // If this unit is not defined, create the structure for it
            if (!this.currentStatChanges.hasOwnProperty(_unitId)) {
              this.currentStatChanges[_unitId] = {};
            }

            // Store the stat change
            for (var _statChange in _event.statChanges[_unitId]) {

              // If this stat change isn't currently stored, default
              if (!this.currentStatChanges[_unitId][_statChange]) {
                this.currentStatChanges[_unitId][_statChange] = {
                  start: _event.statChanges[_unitId][_statChange].start,
                  end: _event.statChanges[_unitId][_statChange].end,
                  delta: 0
                };
              }

              // Append stat change
              this.currentStatChanges[_unitId][_statChange].delta += _event.statChanges[_unitId][_statChange].delta;
            }
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }
  }, {
    key: 'getLatestStatusEffectChanges',
    value: function getLatestStatusEffectChanges(block) {
      this.currentStatusEffectChanges = {};
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = block.battleEvents[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var _event = _step9.value;

          if (!_event.statusEffects) continue;
          for (var _unitId in _event.statusEffects) {
            if (!this.currentStatusEffectChanges.hasOwnProperty(_unitId)) {
              this.currentStatusEffectChanges[_unitId] = {};
            }
            for (var _statusEffectChange in _event.statusEffects[_unitId]) {
              if (!this.currentStatusEffectChanges[_unitId][_statusEffectChange]) {
                this.currentStatusEffectChanges[_unitId][_statusEffectChange] = 0;
              }
              this.currentStatusEffectChanges[_unitId][_statusEffectChange] += _event.statusEffects[_unitId][_statusEffectChange];
            }
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.animationEndTime <= Date.now()) {
        this.dequeue();
      }
    }
  }, {
    key: 'activeStatChange',
    value: function activeStatChange(unitId, stat) {
      // Get the stat changes
      if (this.currentStatChanges.hasOwnProperty(unitId) && this.currentStatChanges[unitId].hasOwnProperty(stat)) {
        return this.currentStatChanges[unitId][stat];
      }

      return false;
    }
  }, {
    key: 'hasActiveStatChange',
    value: function hasActiveStatChange(unitId) {
      return this.currentStatChanges.hasOwnProperty(unitId);
    }
  }, {
    key: 'getActiveStatChanges',
    value: function getActiveStatChanges(unitId) {
      return this.currentStatChanges.hasOwnProperty(unitId) && this.currentStatChanges[unitId];
    }
  }, {
    key: 'activeStatusEffectChange',
    value: function activeStatusEffectChange(unitId, stat) {
      // Get the stat changes
      if (this.currentStatusEffectChanges.hasOwnProperty(unitId) && this.currentStatusEffectChanges[unitId].hasOwnProperty(stat)) {
        return this.currentStatusEffectChanges[unitId][stat];
      }

      return false;
    }
  }, {
    key: 'hasActiveStatusEffectChange',
    value: function hasActiveStatusEffectChange(unitId) {
      return this.currentStatusEffectChanges.hasOwnProperty(unitId);
    }
  }, {
    key: 'getActiveStatusEffectChanges',
    value: function getActiveStatusEffectChanges(unitId) {
      return this.currentStatusEffectChanges.hasOwnProperty(unitId) && this.currentStatusEffectChanges[unitId];
    }
  }, {
    key: 'getCurrentEventName',
    value: function getCurrentEventName() {
      return this.currentEventName;
    }
  }, {
    key: 'currentTimeDelta',
    value: function currentTimeDelta() {
      return Math.max((this.animationEndTime - Date.now()) / this.addtlMilliseconds, 0.0);
    }
  }]);
  return ActiveAnimationEvent;
}();

var animationsDrones = {
	"DroneSml": {
		"baseAtk": "DroneSml_BaseAtk_001",
		"baseIdle": "DroneSml_Idle_001",
		"death": "DroneSml_Death_001",
		"pwdAtk": "DroneSml_PoweredAtk_001"
	}
};

var Animation = function () {
  function Animation(characters, effects, soundManager) {
    classCallCheck(this, Animation);

    this.characters = characters;
    this.effects = effects;
    this.soundManager = soundManager;

    this.PLAY_SOUND = true;
    this.PLAY_EFFECTS = true;
  }

  createClass(Animation, [{
    key: 'run',
    value: function run(event) {
      // Fill in for each animation
    }
  }, {
    key: 'playSound',
    value: function playSound(category, tag) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;

      if (!this.PLAY_SOUND) {
        console.debug("Not playing sound");
        return;
      }

      if (this.soundManager.hasSound(category, tag)) {
        if (delay > 0.001) {
          setTimeout(this.playSoundCall.bind(this, category, tag), delay * 1000);
        } else {
          this.playSoundCall(category, tag);
        }
      } else {
        console.error("Sound not found in playSound:", category, tag);
      }
    }
  }, {
    key: 'playSoundCall',
    value: function playSoundCall(category, tag) {
      if (this.soundManager.hasSound(category, tag)) {
        this.soundManager.play(category, tag);
      } else {
        console.error("Sound not found in playSoundCall:", category, tag);
      }
    }

    // Play on Delay or Play Immediately

  }, {
    key: 'playEffect',
    value: function playEffect(index, effectKey) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.001;

      if (!this.PLAY_EFFECTS) {
        console.debug("Not playing effects");
        return;
      }

      if (this.effects.hasOwnProperty(index)) {
        if (delay > 0.001) {
          setTimeout(this.playEffectCall.bind(this, index, effectKey), delay * 1000);
        } else {
          this.playEffectCall(index, effectKey);
        }
      } else {
        console.error("Effect index not found in playEffect:", index);
      }
    }
  }, {
    key: 'playEffectCall',
    value: function playEffectCall(index, effectKey) {
      if (this.effects.hasOwnProperty(index)) {
        this.effects[index].setKey(effectKey);
        this.effects[index].setLoop(false);
        this.effects[index].play();
      } else {
        console.error("Effect index not found in playEffectCall:", index);
      }
    }
  }, {
    key: 'getInvokers',
    value: function getInvokers(event) {
      return this.characters.filter(function (_char) {
        return event.invokerIds.indexOf(_char.unitId) !== -1;
      });
    }
  }, {
    key: 'getTargets',
    value: function getTargets(event) {
      return this.characters.filter(function (_char) {
        return event.targetIds.indexOf(_char.unitId) !== -1;
      });
    }
  }, {
    key: 'getStatChanges',
    value: function getStatChanges(unitId, statChanges) {
      if (statChanges && statChanges.hasOwnProperty(unitId)) {
        return statChanges[unitId];
      }

      return {};
    }
  }, {
    key: 'determineWeaponAnimationType',
    value: function determineWeaponAnimationType(character) {
      try {
        return character.pose.split('_')[0];
      } catch (ex) {
        console.error("Can not determine weapon animation type.");
        console.error(ex);
      }
    }
  }, {
    key: 'playAnimation',
    value: function playAnimation(character, action) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.001;
      var resumeIdle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      // Depending on the action, may do something different
      // If the character has a drone, some actions are dupliated or only performed on the drone
      if (character.drone && (action === 'baseAtk' || action === 'pwdAtk')) {
        this.animateDrone(character, action, delay, resumeIdle);
      } else if (character.drone && action !== 'death') {
        this.animateDrone(character, action, delay, resumeIdle);
        this.animateCharacter(character, action, delay, resumeIdle);
      } else {
        this.animateCharacter(character, action, delay, resumeIdle);
      }
    }
  }, {
    key: 'animateCharacter',
    value: function animateCharacter(character, action) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.001;
      var resumeIdle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var weapon = this.determineWeaponAnimationType(character);
      var nextAnimation = animations[weapon][action];
      var idleAnimation = animations[weapon].baseIdle;

      if (nextAnimation) {
        character.spine.skeletonMesh.state.clearTracks();
        character.spine.skeletonMesh.state.setAnimation(0, idleAnimation, true);
        character.spine.skeletonMesh.state.addAnimation(0, nextAnimation, false, delay);

        if (resumeIdle) {
          character.spine.skeletonMesh.state.addAnimation(0, idleAnimation, true, 1.2);
        }
      }
    }
  }, {
    key: 'animateDrone',
    value: function animateDrone(character, action) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.001;
      var resumeIdle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var nextAnimation = animationsDrones['DroneSml'][action];
      var idleAnimation = animationsDrones['DroneSml'].baseIdle;

      if (nextAnimation) {
        character.drone.skeletonMesh.state.clearTracks();
        character.drone.skeletonMesh.state.setAnimation(0, idleAnimation, true);
        character.drone.skeletonMesh.state.addAnimation(0, nextAnimation, false, delay);

        if (resumeIdle) {
          character.drone.skeletonMesh.state.addAnimation(0, idleAnimation, true, 1.2);
        }
      }
    }
  }, {
    key: 'playStatChangeAnimation',
    value: function playStatChangeAnimation(unit, statChanges) {
      //console.log("Need to show stat change animation");
      //console.log(unit);
      //console.log(statChanges);
    }
  }]);
  return Animation;
}();

var weaponAnimationsToEffects = {
	"BladeMed": "blade-med-invoker-1",
	"BladeSml": "blade-med-invoker-1",
	"BladeXXL": "blade-med-invoker-1",
	"ConsoleSml": "console-blk-invoker-1",
	"DroneSml": "drone-2",
	"DualMeleeMed": "dual-blade-med-invoker-1",
	"DualMeleeSml": "dual-blade-med-invoker-1",
	"EnergyMed": "muzzle-flash-shotgun-med-1", //"muzzle-flash-energy-med-2",
	"EnergySml": "muzzle-flash-pistol-med-1", //"muzzle-flash-shotgun-med-1", //"muzzle-flash-energy-med-2",
	"PistolSml": "muzzle-flash-pistol-med-1",
	//"ReturningLrg" : "returning-normal-target-1",
	//"ReturningMed" : "returning-normal-target-1",
	"RifleMed": "muzzle-flash-rifle-med-1-brief",
	"RifleSml": "muzzle-flash-rifle-med-1",
	"ThrustingLrg": "thrust-med-invoker-2",
	"ThrustingSml": "thrust-med-invoker-2"
};

var weaponAnimationsToSound = {
	"BladeMed": {
		"baseAtk": "BladeMed-baseAtk-3",
		"impact": "damage-flesh-sharp-med-1"
	},
	"BladeSml": {
		"baseAtk": "BladeSml-baseAtk-3",
		"impact": "damage-flesh-sharp-sml-1"
	},
	"BladeXXL": {
		"baseAtk": "BladeXXL-baseAtk-3",
		"impact": "damage-flesh-sharp-lrg-1"
	},
	"ConsoleSml": {
		"baseAtk": "ConsoleSml-baseAtk-3",
		"impact": "damage-forcefield-sml-1"
	},
	"DroneSml": {
		"baseAtk": "DroneSml-baseAtk-3",
		"impact": "damage-forcefield-lrg-1"
	},
	"DualMeleeMed": {
		"baseAtk": "DualMeleeMed-baseAtk-3",
		"impact": "damage-flesh-sharp-med-1"
	},
	"DualMeleeSml": {
		"baseAtk": "DualMeleeSml-baseAtk-3",
		"impact": "damage-flesh-sharp-sml-1"
	},
	"EnergyMed": {
		"baseAtk": "EnergyMed-baseAtk-3",
		"impact": "damage-flesh-ranged-sml-1"
	},
	"EnergySml": {
		"baseAtk": "EnergySml-baseAtk-3",
		"impact": "damage-flesh-ranged-sml-1"
	},
	"PistolSml": {
		"baseAtk": "PistolSml-baseAtk-3",
		"impact": "damage-flesh-ranged-sml-1"
	},
	"ReturningLrg": {
		"baseAtk": "ReturningLrg-baseAtk-3",
		"impact": "damage-flesh-ranged-sml-1"
	},
	"ReturningMed": {
		"baseAtk": "ReturningMed-baseAtk-3",
		"impact": "damage-flesh-ranged-sml-1"
	},
	"RifleMed": {
		"baseAtk": "RifleMed-baseAtk-3",
		"impact": "damage-flesh-ranged-sml-1"
	},
	"RifleSml": {
		"baseAtk": "RifleSml-baseAtk-3",
		"impact": "damage-flesh-ranged-sml-1"
	},
	"ThrustingLrg": {
		"baseAtk": "ThrustingLrg-baseAtk-3",
		"impact": "damage-flesh-sharp-lrg-1"
	},
	"ThrustingSml": {
		"baseAtk": "ThrustingSml-baseAtk-3",
		"impact": "damage-flesh-sharp-sml-1"
	},
	"Unarmed": {
		"baseAtk": "Unarmed-baseAtk-1",
		"impact": "damage-flesh-blunt-sml-1"
	}
};

var AttackAnimation = function (_Animation) {
  inherits(AttackAnimation, _Animation);

  function AttackAnimation() {
    classCallCheck(this, AttackAnimation);
    return possibleConstructorReturn(this, (AttackAnimation.__proto__ || Object.getPrototypeOf(AttackAnimation)).apply(this, arguments));
  }

  createClass(AttackAnimation, [{
    key: "run",
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);

      // Run the attack animations for invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          this.playAnimation(_invoker, 'baseAtk');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));

          // Determine which effect we play for which weapon type
          var weaponAnimationType = _invoker.weaponAnimationType;

          // Drones
          if (_invoker.drone) {
            weaponAnimationType = 'DroneSml';
          }

          // Get the effect
          if (weaponAnimationsToEffects.hasOwnProperty(weaponAnimationType)) {
            var delay = 0.25;
            if (weaponAnimationType === "EnergySml") {
              delay = 0.85;
            } else if (weaponAnimationType.indexOf("Blade") !== -1 || weaponAnimationType.indexOf("DualMelee") !== -1) {
              delay = 0.5;
            }

            this.playEffect(_invoker.nftId, weaponAnimationsToEffects[weaponAnimationType], delay);

            if (weaponAnimationsToSound.hasOwnProperty(weaponAnimationType) && weaponAnimationsToSound[weaponAnimationType].hasOwnProperty('baseAtk')) {
              this.playSound('weapons', weaponAnimationsToSound[weaponAnimationType].baseAtk, delay);
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return AttackAnimation;
}(Animation);

var BattleCompleteAnimation = function (_Animation) {
  inherits(BattleCompleteAnimation, _Animation);

  function BattleCompleteAnimation() {
    classCallCheck(this, BattleCompleteAnimation);
    return possibleConstructorReturn(this, (BattleCompleteAnimation.__proto__ || Object.getPrototypeOf(BattleCompleteAnimation)).apply(this, arguments));
  }

  createClass(BattleCompleteAnimation, [{
    key: 'run',
    value: function run(event) {
      this.playEffect('vfx0', 'victory', 0.25);
    }
  }]);
  return BattleCompleteAnimation;
}(Animation);

var BoostAnimation = function (_Animation) {
  inherits(BoostAnimation, _Animation);

  function BoostAnimation() {
    classCallCheck(this, BoostAnimation);
    return possibleConstructorReturn(this, (BoostAnimation.__proto__ || Object.getPrototypeOf(BoostAnimation)).apply(this, arguments));
  }

  createClass(BoostAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'statboost-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'stat-boost-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'stat-boost-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return BoostAnimation;
}(Animation);

var BreakAnimation = function (_Animation) {
  inherits(BreakAnimation, _Animation);

  function BreakAnimation() {
    classCallCheck(this, BreakAnimation);
    return possibleConstructorReturn(this, (BreakAnimation.__proto__ || Object.getPrototypeOf(BreakAnimation)).apply(this, arguments));
  }

  createClass(BreakAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'statbreak-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'stat-break-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'stat-break-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return BreakAnimation;
}(Animation);

var CardReplaceAnimation = function (_Animation) {
  inherits(CardReplaceAnimation, _Animation);

  function CardReplaceAnimation() {
    classCallCheck(this, CardReplaceAnimation);
    return possibleConstructorReturn(this, (CardReplaceAnimation.__proto__ || Object.getPrototypeOf(CardReplaceAnimation)).apply(this, arguments));
  }

  createClass(CardReplaceAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      /*
        Currently not finished, need to determine buff / debuff, and runs into other animations (damage / attack);
      */

      // Determine if this is a buff or debuff
      console.log(event.statChanges);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          //this.playEffect(_invoker.nftId, 'buff-invoker', 0.0);
          //this.playSound('abilities', 'buff-1', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          //this.playEffect(_target.nftId, 'buff-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return CardReplaceAnimation;
}(Animation);

var CleanseAnimation = function (_Animation) {
  inherits(CleanseAnimation, _Animation);

  function CleanseAnimation() {
    classCallCheck(this, CleanseAnimation);
    return possibleConstructorReturn(this, (CleanseAnimation.__proto__ || Object.getPrototypeOf(CleanseAnimation)).apply(this, arguments));
  }

  createClass(CleanseAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'cleanse-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'stat-boost-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'cleanse-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return CleanseAnimation;
}(Animation);

var CounterBoostAnimation = function (_Animation) {
  inherits(CounterBoostAnimation, _Animation);

  function CounterBoostAnimation() {
    classCallCheck(this, CounterBoostAnimation);
    return possibleConstructorReturn(this, (CounterBoostAnimation.__proto__ || Object.getPrototypeOf(CounterBoostAnimation)).apply(this, arguments));
  }

  createClass(CounterBoostAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'counterattack-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'counter-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'counter-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return CounterBoostAnimation;
}(Animation);

var DamageAnimation = function (_Animation) {
  inherits(DamageAnimation, _Animation);

  function DamageAnimation() {
    classCallCheck(this, DamageAnimation);
    return possibleConstructorReturn(this, (DamageAnimation.__proto__ || Object.getPrototypeOf(DamageAnimation)).apply(this, arguments));
  }

  createClass(DamageAnimation, [{
    key: 'run',
    value: function run(event) {

      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Get the weapon used for the attack
      var weaponAnimationType = void 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          weaponAnimationType = _invoker.weaponAnimationType;

          // Drones
          if (_invoker.drone) {
            weaponAnimationType = 'DroneSml';
          }
        }

        // Run the hit reaction for targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_target, 'baseHit', 0.9, true);
          this.playEffect(_target.nftId, 'hit-target-1', 0.9);

          if (weaponAnimationsToSound.hasOwnProperty(weaponAnimationType) && weaponAnimationsToSound[weaponAnimationType].hasOwnProperty('impact')) {
            this.playSound('combat', weaponAnimationsToSound[weaponAnimationType].impact, 0.9);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return DamageAnimation;
}(Animation);

var HealAnimation = function (_Animation) {
  inherits(HealAnimation, _Animation);

  function HealAnimation() {
    classCallCheck(this, HealAnimation);
    return possibleConstructorReturn(this, (HealAnimation.__proto__ || Object.getPrototypeOf(HealAnimation)).apply(this, arguments));
  }

  createClass(HealAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'heal');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'nanomed_injection-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'healing-invoker-2', 0.0);
        }

        // Determine which animation to use
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var healAnimation = 'healing-target-1';
      if (targets.length > 1) {
        // Use a smaller, briefer animation to reduce load
        healAnimation = 'healing-target-3';
      }

      // Targets
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, healAnimation, 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return HealAnimation;
}(Animation);

var KnockoutAnimation = function (_Animation) {
  inherits(KnockoutAnimation, _Animation);

  function KnockoutAnimation() {
    classCallCheck(this, KnockoutAnimation);
    return possibleConstructorReturn(this, (KnockoutAnimation.__proto__ || Object.getPrototypeOf(KnockoutAnimation)).apply(this, arguments));
  }

  createClass(KnockoutAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var targets = this.getTargets(event);

      // Run the hit reaction for targets
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _target = _step.value;

          _target.knockoutAnimationPlayed = true;
          this.playAnimation(_target, 'death', 0.9, false);
          this.playEffect(_target.nftId, 'knockout-target', 0.75);
          this.playSound('combat', 'knockout-player-2', 0.75);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return KnockoutAnimation;
}(Animation);

var PoisonAnimation = function (_Animation) {
  inherits(PoisonAnimation, _Animation);

  function PoisonAnimation() {
    classCallCheck(this, PoisonAnimation);
    return possibleConstructorReturn(this, (PoisonAnimation.__proto__ || Object.getPrototypeOf(PoisonAnimation)).apply(this, arguments));
  }

  createClass(PoisonAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'poison-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'stat-break-invoker', 0.2);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'poison-target-2', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return PoisonAnimation;
}(Animation);

var PoisonEffectAnimation = function (_Animation) {
  inherits(PoisonEffectAnimation, _Animation);

  function PoisonEffectAnimation() {
    classCallCheck(this, PoisonEffectAnimation);
    return possibleConstructorReturn(this, (PoisonEffectAnimation.__proto__ || Object.getPrototypeOf(PoisonEffectAnimation)).apply(this, arguments));
  }

  createClass(PoisonEffectAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var targets = this.getTargets(event);

      // Targets
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _target = _step.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_target, 'baseHit', 0.9, true);
          this.playEffect(_target.nftId, 'poison-target-1', 0.0);
          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playSound('combat', 'damage-flesh-blunt-sml-1', 0.0);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return PoisonEffectAnimation;
}(Animation);

var RegenerateAnimation = function (_Animation) {
  inherits(RegenerateAnimation, _Animation);

  function RegenerateAnimation() {
    classCallCheck(this, RegenerateAnimation);
    return possibleConstructorReturn(this, (RegenerateAnimation.__proto__ || Object.getPrototypeOf(RegenerateAnimation)).apply(this, arguments));
  }

  createClass(RegenerateAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'heal');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'regeneration-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'stat-boost-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'regeneration-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return RegenerateAnimation;
}(Animation);

var RegenerateEffectAnimation = function (_Animation) {
  inherits(RegenerateEffectAnimation, _Animation);

  function RegenerateEffectAnimation() {
    classCallCheck(this, RegenerateEffectAnimation);
    return possibleConstructorReturn(this, (RegenerateEffectAnimation.__proto__ || Object.getPrototypeOf(RegenerateEffectAnimation)).apply(this, arguments));
  }

  createClass(RegenerateEffectAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var targets = this.getTargets(event);

      // Targets
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _target = _step.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playEffect(_target.nftId, 'regeneration-target', 0.0);
          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playSound('abilities', 'regeneration-1', 0.0);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return RegenerateEffectAnimation;
}(Animation);

var StripAnimation = function (_Animation) {
  inherits(StripAnimation, _Animation);

  function StripAnimation() {
    classCallCheck(this, StripAnimation);
    return possibleConstructorReturn(this, (StripAnimation.__proto__ || Object.getPrototypeOf(StripAnimation)).apply(this, arguments));
  }

  createClass(StripAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'strip-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'stat-break-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'strip-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return StripAnimation;
}(Animation);

var ShieldAnimation = function (_Animation) {
  inherits(ShieldAnimation, _Animation);

  function ShieldAnimation() {
    classCallCheck(this, ShieldAnimation);
    return possibleConstructorReturn(this, (ShieldAnimation.__proto__ || Object.getPrototypeOf(ShieldAnimation)).apply(this, arguments));
  }

  createClass(ShieldAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'stat-boost-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'shield-invoker', 0.0);
          this.playSound('abilities', 'forcefield_on-1', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return ShieldAnimation;
}(Animation);

var ShieldBlockAnimation = function (_Animation) {
  inherits(ShieldBlockAnimation, _Animation);

  function ShieldBlockAnimation() {
    classCallCheck(this, ShieldBlockAnimation);
    return possibleConstructorReturn(this, (ShieldBlockAnimation.__proto__ || Object.getPrototypeOf(ShieldBlockAnimation)).apply(this, arguments));
  }

  createClass(ShieldBlockAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var targets = this.getTargets(event);

      // Run the hit reaction for targets
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _target = _step.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playEffect(_target.nftId, 'shield-target', 0.9);
          this.playSound('combat', 'disarm-forcefield-1', 0.0);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return ShieldBlockAnimation;
}(Animation);

var StatChangeAnimation = function (_Animation) {
  inherits(StatChangeAnimation, _Animation);

  function StatChangeAnimation() {
    classCallCheck(this, StatChangeAnimation);
    return possibleConstructorReturn(this, (StatChangeAnimation.__proto__ || Object.getPrototypeOf(StatChangeAnimation)).apply(this, arguments));
  }

  createClass(StatChangeAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      /*
        Currently not finished, need to determine buff / debuff, and runs into other animations (damage / attack);
      */

      // Determine if this is a buff or debuff
      console.log(event.statChanges);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'buff');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playEffect(_invoker.nftId, 'buff-invoker', 0.0);
          this.playSound('abilities', 'buff-1', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'buff-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return StatChangeAnimation;
}(Animation);

var TauntAnimation = function (_Animation) {
  inherits(TauntAnimation, _Animation);

  function TauntAnimation() {
    classCallCheck(this, TauntAnimation);
    return possibleConstructorReturn(this, (TauntAnimation.__proto__ || Object.getPrototypeOf(TauntAnimation)).apply(this, arguments));
  }

  createClass(TauntAnimation, [{
    key: 'run',
    value: function run(event) {
      // Find the units
      var invokers = this.getInvokers(event);
      var targets = this.getTargets(event);

      // Invokers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = invokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _invoker = _step.value;

          if (_invoker.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playAnimation(_invoker, 'taunt');
          this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));
          this.playSound('abilities', 'taunt-1', 0.0);

          // Skip if also a target
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _target2 = _step3.value;

              if (_target2.nftId === _invoker.nftId) {
                continue;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.playEffect(_invoker.nftId, 'taunt-invoker', 0.0);
        }

        // Targets
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _target = _step2.value;

          if (_target.knockoutAnimationPlayed === true) {
            continue;
          }

          this.playStatChangeAnimation(_target, this.getStatChanges(_target.unitId, event.statChanges));
          this.playEffect(_target.nftId, 'taunt-target', 0.0);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return TauntAnimation;
}(Animation);

var AnimationController = function () {
  function AnimationController(characters, effects, soundManager) {
    classCallCheck(this, AnimationController);

    this.primaryEvents = ['AttackEvent', 'BattleCompleteEvent', 'BoostEvent', 'BreakEvent', 'CardPlayEvent', 'CardReplaceEvent', 'CleanseEvent', 'CoinFlipEvent', 'CounterAttackEvent', 'CounterBoostEvent', 'HealEvent', 'PoisonEvent', 'PoisonEffectEvent', 'RegenerateEvent', 'RegenerateEffectEvent', 'ShieldEvent',
    //'StatChangeAnimation',
    'StripEvent', 'TauntEvent'];

    var eventAnimations = {
      'AttackEvent': new AttackAnimation(characters, effects, soundManager),
      'BattleCompleteEvent': new BattleCompleteAnimation(characters, effects, soundManager),
      'BoostEvent': new BoostAnimation(characters, effects, soundManager),
      'BreakEvent': new BreakAnimation(characters, effects, soundManager),
      'CardReplaceEvent': new CardReplaceAnimation(characters, effects, soundManager),
      'CleanseEvent': new CleanseAnimation(characters, effects, soundManager),
      'CounterAttackEvent': new AttackAnimation(characters, effects, soundManager),
      'CounterBoostEvent': new CounterBoostAnimation(characters, effects, soundManager),
      'DamageEvent': new DamageAnimation(characters, effects, soundManager),
      'HealEvent': new HealAnimation(characters, effects, soundManager),
      'KnockoutEvent': new KnockoutAnimation(characters, effects, soundManager),
      'PoisonEvent': new PoisonAnimation(characters, effects, soundManager),
      'PoisonEffectEvent': new PoisonEffectAnimation(characters, effects, soundManager),
      'RegenerateEvent': new RegenerateAnimation(characters, effects, soundManager),
      'RegenerateEffectEvent': new RegenerateEffectAnimation(characters, effects, soundManager),
      'StripEvent': new StripAnimation(characters, effects, soundManager),
      'ShieldEvent': new ShieldAnimation(characters, effects, soundManager),
      'ShieldBlockEvent': new ShieldBlockAnimation(characters, effects, soundManager),
      //'StatChangeEvent'       : new StatChangeAnimation(characters, effects, soundManager),
      'TauntEvent': new TauntAnimation(characters, effects, soundManager)
    };

    this.activeAnimationEvent = new ActiveAnimationEvent(characters, effects, this.primaryEvents, eventAnimations);
  }

  createClass(AnimationController, [{
    key: 'getActiveAnimationEventObject',
    value: function getActiveAnimationEventObject() {
      return this.activeAnimationEvent;
    }
  }, {
    key: 'run',
    value: function run(block, callback) {
      // Break up the events into sections
      var battleEventSegments = this.segmentEvents(block.battleEvents);

      // For each segment of events, enqueue
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = battleEventSegments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eventSegment = _step.value;

          // Parse the events for the major event
          var primaryEvent = this.getPrimaryEvent(eventSegment);
          var secondaryEvents = this.getSecondaryEvents(eventSegment);

          // Emit the event for UI updates
          // CALLBACK IS CALLED INDIRECTLY USING EVENTS IN HERE
          this.activeAnimationEvent.enqueue(block, primaryEvent, secondaryEvents);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'update',
    value: function update(delta) {
      this.activeAnimationEvent.update(delta);
    }
  }, {
    key: 'segmentEvents',
    value: function segmentEvents(_battleEventsOriginal) {
      // Operate on a copy
      var battleEvents = JSON.parse(JSON.stringify(_battleEventsOriginal));

      // Break up into segments
      var segments = [],
          activeSegment = [];
      for (var idx in battleEvents) {
        if (this.primaryEvents.indexOf(battleEvents[idx].name) !== -1) {
          // If the active segment has events, push onto segments
          if (this.hasPrimaryEvent(activeSegment)) {
            segments.push(activeSegment);
          }

          // Create new active segment
          activeSegment = [battleEvents[idx]];
        } else {
          activeSegment.push(battleEvents[idx]);
        }
      }

      // Append last active segment
      if (activeSegment.length > 0) {
        segments.push(activeSegment);
      }

      return segments;
    }
  }, {
    key: 'hasPrimaryEvent',
    value: function hasPrimaryEvent(events) {
      var _this = this;

      var primaryEvents = events.filter(function (_event) {
        return _this.primaryEvents.indexOf(_event.name) !== -1;
      });
      return primaryEvents.length > 0;
    }
  }, {
    key: 'getPrimaryEvent',
    value: function getPrimaryEvent(events) {
      var _this2 = this;

      var primaryEvents = events.filter(function (_event) {
        return _this2.primaryEvents.indexOf(_event.name) !== -1;
      });
      return primaryEvents.length ? primaryEvents[0] : {};
    }
  }, {
    key: 'getSecondaryEvents',
    value: function getSecondaryEvents(events) {
      var _this3 = this;

      return events.filter(function (_event) {
        return _this3.primaryEvents.indexOf(_event.name) === -1;
      });
    }
  }]);
  return AnimationController;
}();

var SoundClip = function () {
  function SoundClip(path) {
    var volume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.25;
    var loop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var preload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'auto';
    classCallCheck(this, SoundClip);

    // Constants
    this.SOUND_EFFECTS_ROOT_SRC = "https://neon-district-season-one.s3.amazonaws.com/sound-effects/";

    // Keep track of values
    this.path = path;

    // Load the file
    this.audio = new Audio(this.SOUND_EFFECTS_ROOT_SRC + path);
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = this.parsePreload(preload);
    this.audio.onended = this.cleanUpAudio.bind(this);

    // Set defaults
    this.setLoop(loop);
    this.setVolume(volume);
  }

  createClass(SoundClip, [{
    key: "getPath",
    value: function getPath() {
      return this.path;
    }
  }, {
    key: "cleanUpAudio",
    value: function cleanUpAudio() {
      if (this.audio) {
        // Clear the source
        this.audio.pause();
        this.audio.removeAttribute('src'); // empty source
        this.audio.load();

        // Remove from the DOM
        this.audio.remove();
      }
    }
  }, {
    key: "parsePreload",
    value: function parsePreload(preload) {
      if (['none', 'metadata', 'auto'].indexOf(preload) === -1) {
        console.error("Invalid audio preload value:", preload);
        return 'none';
      }

      return preload;
    }
  }, {
    key: "setVolume",
    value: function setVolume(volume) {
      this.audio.volume = Math.max(Math.min(volume, 1.0), 0.0);
    }
  }, {
    key: "setLoop",
    value: function setLoop(loop) {
      this.audio.loop = Boolean(loop);
    }
  }, {
    key: "play",
    value: function play() {
      this.audio.play();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.audio.pause();
    }
  }]);
  return SoundClip;
}();

var soundEffects = {
  "music": {
    "aspire-combat-intro": {
      "tag": "aspire-combat-intro",
      "location": "aspire",
      "type": "combat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_aspire_combat_intro.mp3"
    },
    "aspire-combat-loop": {
      "tag": "aspire-combat-loop",
      "location": "aspire",
      "type": "combat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_aspire_combat_loop.mp3"
    },
    "aspire-combat-victory": {
      "tag": "aspire-combat-victory",
      "location": "aspire",
      "type": "combat",
      "placement": "victory",
      "path": "music/season_1/music_combat_quarter_aspire_combat_victory.mp3"
    },
    "aspire-precombat-intro": {
      "tag": "aspire-precombat-intro",
      "location": "aspire",
      "type": "precombat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_aspire_precombat_intro.mp3"
    },
    "aspire-precombat-loop": {
      "tag": "aspire-precombat-loop",
      "location": "aspire",
      "type": "precombat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_aspire_precombat_loop.mp3"
    },
    "jejune-combat-intro": {
      "tag": "jejune-combat-intro",
      "location": "jejune",
      "type": "combat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_jejune_combat_intro.mp3"
    },
    "jejune-combat-loop": {
      "tag": "jejune-combat-loop",
      "location": "jejune",
      "type": "combat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_jejune_combat_loop.mp3"
    },
    "jejune-combat-victory": {
      "tag": "jejune-combat-victory",
      "location": "jejune",
      "type": "combat",
      "placement": "victory",
      "path": "music/season_1/music_combat_quarter_jejune_combat_victory.mp3"
    },
    "jejune-precombat-intro": {
      "tag": "jejune-precombat-intro",
      "location": "jejune",
      "type": "precombat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_jejune_precombat_intro.mp3"
    },
    "jejune-precombat-loop": {
      "tag": "jejune-precombat-loop",
      "location": "jejune",
      "type": "precombat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_jejune_precombat_loop.mp3"
    },
    "leatherheadz-combat-intro": {
      "tag": "leatherheadz-combat-intro",
      "location": "leatherheadz",
      "type": "combat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_leatherheadz_combat_intro.mp3"
    },
    "leatherheadz-combat-loop": {
      "tag": "leatherheadz-combat-loop",
      "location": "leatherheadz",
      "type": "combat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_leatherheadz_combat_loop.mp3"
    },
    "leatherheadz-combat-victory": {
      "tag": "leatherheadz-combat-victory",
      "location": "leatherheadz",
      "type": "combat",
      "placement": "victory",
      "path": "music/season_1/music_combat_quarter_leatherheadz_combat_victory.mp3"
    },
    "leatherheadz-precombat-intro": {
      "tag": "leatherheadz-precombat-intro",
      "location": "leatherheadz",
      "type": "precombat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_leatherheadz_precombat_intro.mp3"
    },
    "leatherheadz-precombat-loop": {
      "tag": "leatherheadz-precombat-loop",
      "location": "leatherheadz",
      "type": "precombat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_leatherheadz_precombat_loop.mp3"
    },
    "mimir-combat-intro": {
      "tag": "mimir-combat-intro",
      "location": "mimir",
      "type": "combat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_mimir_combat_intro.mp3"
    },
    "mimir-combat-loop": {
      "tag": "mimir-combat-loop",
      "location": "mimir",
      "type": "combat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_mimir_combat_loop.mp3"
    },
    "mimir-combat-victory": {
      "tag": "mimir-combat-victory",
      "location": "mimir",
      "type": "combat",
      "placement": "victory",
      "path": "music/season_1/music_combat_quarter_mimir_combat_victory.mp3"
    },
    "mimir-precombat-intro": {
      "tag": "mimir-precombat-intro",
      "location": "mimir",
      "type": "precombat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_mimir_precombat_intro.mp3"
    },
    "mimir-precombat-loop": {
      "tag": "mimir-precombat-loop",
      "location": "mimir",
      "type": "precombat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_mimir_precombat_loop.mp3"
    },
    "shenju-combat-intro": {
      "tag": "shenju-combat-intro",
      "location": "shenju",
      "type": "combat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_shenju_combat_intro.mp3"
    },
    "shenju-combat-loop": {
      "tag": "shenju-combat-loop",
      "location": "shenju",
      "type": "combat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_shenju_combat_loop.mp3"
    },
    "shenju-combat-victory": {
      "tag": "shenju-combat-victory",
      "location": "shenju",
      "type": "combat",
      "placement": "victory",
      "path": "music/season_1/music_combat_quarter_shenju_combat_victory.mp3"
    },
    "shenju-precombat-intro": {
      "tag": "shenju-precombat-intro",
      "location": "shenju",
      "type": "precombat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_shenju_precombat_intro.mp3"
    },
    "shenju-precombat-loop": {
      "tag": "shenju-precombat-loop",
      "location": "shenju",
      "type": "precombat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_shenju_precombat_loop.mp3"
    },
    "vicesquad-combat-intro": {
      "tag": "vicesquad-combat-intro",
      "location": "vicesquad",
      "type": "combat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_vicesquad_combat_intro.mp3"
    },
    "vicesquad-combat-loop": {
      "tag": "vicesquad-combat-loop",
      "location": "vicesquad",
      "type": "combat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_vicesquad_combat_loop.mp3"
    },
    "vicesquad-combat-victory": {
      "tag": "vicesquad-combat-victory",
      "location": "vicesquad",
      "type": "combat",
      "placement": "victory",
      "path": "music/season_1/music_combat_quarter_vicesquad_combat_victory.mp3"
    },
    "vicesquad-precombat-intro": {
      "tag": "vicesquad-precombat-intro",
      "location": "vicesquad",
      "type": "precombat",
      "placement": "intro",
      "path": "music/season_1/music_combat_quarter_vicesquad_precombat_intro.mp3"
    },
    "vicesquad-precombat-loop": {
      "tag": "vicesquad-precombat-loop",
      "location": "vicesquad",
      "type": "precombat",
      "placement": "loop",
      "path": "music/season_1/music_combat_quarter_vicesquad_precombat_loop.mp3"
    },
    "bt-laurel-canyon-loop": {
      "tag": "bt-laurel-canyon-loop",
      "location": "general",
      "type": "combat",
      "placement": "loop",
      "path": "music/bt/3._Laurel_Canyon_Night_Drive_Mastered.wav"
    },
    "bt-laurel-canyon-night-loop": {
      "tag": "bt-laurel-canyon-night-loop",
      "location": "general",
      "type": "combat",
      "placement": "loop",
      "path": "music/bt/3._Laurel_Canyon_Night_Drive_Night_Mode.wav"
    },
    "bt-laurel-canyon-lunar-loop": {
      "tag": "bt-laurel-canyon-lunar-loop",
      "location": "general",
      "type": "combat",
      "placement": "loop",
      "path": "music/bt/3._Laurel_Canyon_Night_Drive_Lunar_Mode_v2.wav"
    }
  },
  "weapons": {
    "BladeMed-baseAtk-1": {
      "tag": "BladeMed-baseAtk-1",
      "slug": "BladeMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_blade_med_base_atk_basic_001_01.mp3"
    },
    "BladeMed-baseAtk-2": {
      "tag": "BladeMed-baseAtk-2",
      "slug": "BladeMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_blade_med_base_atk_basic_001_02.mp3"
    },
    "BladeMed-baseAtk-3": {
      "tag": "BladeMed-baseAtk-3",
      "slug": "BladeMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_blade_med_base_atk_basic_001_03.mp3"
    },
    "BladeMed-pwdAtk-1": {
      "tag": "BladeMed-pwdAtk-1",
      "slug": "BladeMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_blade_med_base_atk_powered_101_01.mp3"
    },
    "BladeMed-pwdAtk-2": {
      "tag": "BladeMed-pwdAtk-2",
      "slug": "BladeMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_blade_med_base_atk_powered_101_02.mp3"
    },
    "BladeMed-pwdAtk-3": {
      "tag": "BladeMed-pwdAtk-3",
      "slug": "BladeMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_blade_med_base_atk_powered_101_03.mp3"
    },
    "BladeSml-baseAtk-1": {
      "tag": "BladeSml-baseAtk-1",
      "slug": "BladeSml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_blade_sml_base_atk_basic_001_01.mp3"
    },
    "BladeSml-baseAtk-2": {
      "tag": "BladeSml-baseAtk-2",
      "slug": "BladeSml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_blade_sml_base_atk_basic_001_02.mp3"
    },
    "BladeSml-baseAtk-3": {
      "tag": "BladeSml-baseAtk-3",
      "slug": "BladeSml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_blade_sml_base_atk_basic_001_03.mp3"
    },
    "BladeSml-pwdAtk-1": {
      "tag": "BladeSml-pwdAtk-1",
      "slug": "BladeSml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_blade_sml_base_atk_powered_101_01.mp3"
    },
    "BladeSml-pwdAtk-2": {
      "tag": "BladeSml-pwdAtk-2",
      "slug": "BladeSml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_blade_sml_base_atk_powered_101_02.mp3"
    },
    "BladeSml-pwdAtk-3": {
      "tag": "BladeSml-pwdAtk-3",
      "slug": "BladeSml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_blade_sml_base_atk_powered_101_03.mp3"
    },
    "BladeXXL-baseAtk-1": {
      "tag": "BladeXXL-baseAtk-1",
      "slug": "BladeXXL",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_blade_xxl_base_atk_basic_001_01.mp3"
    },
    "BladeXXL-baseAtk-2": {
      "tag": "BladeXXL-baseAtk-2",
      "slug": "BladeXXL",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_blade_xxl_base_atk_basic_001_02.mp3"
    },
    "BladeXXL-baseAtk-3": {
      "tag": "BladeXXL-baseAtk-3",
      "slug": "BladeXXL",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_blade_xxl_base_atk_basic_001_03.mp3"
    },
    "BladeXXL-pwdAtk-1": {
      "tag": "BladeXXL-pwdAtk-1",
      "slug": "BladeXXL",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_blade_xxl_base_atk_powered_101_01.mp3"
    },
    "BladeXXL-pwdAtk-2": {
      "tag": "BladeXXL-pwdAtk-2",
      "slug": "BladeXXL",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_blade_xxl_base_atk_powered_101_02.mp3"
    },
    "BladeXXL-pwdAtk-3": {
      "tag": "BladeXXL-pwdAtk-3",
      "slug": "BladeXXL",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_blade_xxl_base_atk_powered_101_03.mp3"
    },
    "ConsoleMed-baseAtk-1": {
      "tag": "ConsoleMed-baseAtk-1",
      "slug": "ConsoleMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_console_med_base_atk_basic_001_01.mp3"
    },
    "ConsoleMed-baseAtk-2": {
      "tag": "ConsoleMed-baseAtk-2",
      "slug": "ConsoleMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_console_med_base_atk_basic_001_02.mp3"
    },
    "ConsoleMed-baseAtk-3": {
      "tag": "ConsoleMed-baseAtk-3",
      "slug": "ConsoleMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_console_med_base_atk_basic_001_03.mp3"
    },
    "ConsoleMed-pwdAtk-1": {
      "tag": "ConsoleMed-pwdAtk-1",
      "slug": "ConsoleMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_console_med_base_atk_powered_101_01.mp3"
    },
    "ConsoleMed-pwdAtk-2": {
      "tag": "ConsoleMed-pwdAtk-2",
      "slug": "ConsoleMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_console_med_base_atk_powered_101_02.mp3"
    },
    "ConsoleMed-pwdAtk-3": {
      "tag": "ConsoleMed-pwdAtk-3",
      "slug": "ConsoleMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_console_med_base_atk_powered_101_03.mp3"
    },
    "ConsoleSml-baseAtk-1": {
      "tag": "ConsoleSml-baseAtk-1",
      "slug": "ConsoleSml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_console_sml_base_atk_basic_001_01.mp3"
    },
    "ConsoleSml-baseAtk-2": {
      "tag": "ConsoleSml-baseAtk-2",
      "slug": "ConsoleSml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_console_sml_base_atk_basic_001_02.mp3"
    },
    "ConsoleSml-baseAtk-3": {
      "tag": "ConsoleSml-baseAtk-3",
      "slug": "ConsoleSml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_console_sml_base_atk_basic_001_03.mp3"
    },
    "ConsoleSml-pwdAtk-1": {
      "tag": "ConsoleSml-pwdAtk-1",
      "slug": "ConsoleSml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_console_sml_base_atk_powered_101_01.mp3"
    },
    "ConsoleSml-pwdAtk-2": {
      "tag": "ConsoleSml-pwdAtk-2",
      "slug": "ConsoleSml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_console_sml_base_atk_powered_101_02.mp3"
    },
    "ConsoleSml-pwdAtk-3": {
      "tag": "ConsoleSml-pwdAtk-3",
      "slug": "ConsoleSml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_console_sml_base_atk_powered_101_03.mp3"
    },
    "DualMeleeMed-baseAtk-1": {
      "tag": "DualMeleeMed-baseAtk-1",
      "slug": "DualMeleeMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualmelee_med_base_atk_basic_001_01.mp3"
    },
    "DualMeleeMed-baseAtk-2": {
      "tag": "DualMeleeMed-baseAtk-2",
      "slug": "DualMeleeMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualmelee_med_base_atk_basic_001_02.mp3"
    },
    "DualMeleeMed-baseAtk-3": {
      "tag": "DualMeleeMed-baseAtk-3",
      "slug": "DualMeleeMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualmelee_med_base_atk_basic_001_03.mp3"
    },
    "DualMeleeMed-pwdAtk-1": {
      "tag": "DualMeleeMed-pwdAtk-1",
      "slug": "DualMeleeMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualmelee_med_base_atk_powered_101_01.mp3"
    },
    "DualMeleeMed-pwdAtk-2": {
      "tag": "DualMeleeMed-pwdAtk-2",
      "slug": "DualMeleeMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualmelee_med_base_atk_powered_101_02.mp3"
    },
    "DualMeleeMed-pwdAtk-3": {
      "tag": "DualMeleeMed-pwdAtk-3",
      "slug": "DualMeleeMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualmelee_med_base_atk_powered_101_03.mp3"
    },
    "DualMeleeSml-baseAtk-1": {
      "tag": "DualMeleeSml-baseAtk-1",
      "slug": "DualMeleeSml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualmelee_sml_base_atk_basic_001_01.mp3"
    },
    "DualMeleeSml-baseAtk-2": {
      "tag": "DualMeleeSml-baseAtk-2",
      "slug": "DualMeleeSml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualmelee_sml_base_atk_basic_001_02.mp3"
    },
    "DualMeleeSml-baseAtk-3": {
      "tag": "DualMeleeSml-baseAtk-3",
      "slug": "DualMeleeSml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualmelee_sml_base_atk_basic_001_03.mp3"
    },
    "DualMeleeSml-pwdAtk-1": {
      "tag": "DualMeleeSml-pwdAtk-1",
      "slug": "DualMeleeSml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualmelee_sml_base_atk_powered_101_01.mp3"
    },
    "DualMeleeSml-pwdAtk-2": {
      "tag": "DualMeleeSml-pwdAtk-2",
      "slug": "DualMeleeSml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualmelee_sml_base_atk_powered_101_02.mp3"
    },
    "DualMeleeSml-pwdAtk-3": {
      "tag": "DualMeleeSml-pwdAtk-3",
      "slug": "DualMeleeSml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualmelee_sml_base_atk_powered_101_03.mp3"
    },
    "DualRangedMed-baseAtk-1": {
      "tag": "DualRangedMed-baseAtk-1",
      "slug": "DualRangedMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualranged_med_base_atk_basic_001_01.mp3"
    },
    "DualRangedMed-baseAtk-2": {
      "tag": "DualRangedMed-baseAtk-2",
      "slug": "DualRangedMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualranged_med_base_atk_basic_001_02.mp3"
    },
    "DualRangedMed-baseAtk-3": {
      "tag": "DualRangedMed-baseAtk-3",
      "slug": "DualRangedMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualranged_med_base_atk_basic_001_03.mp3"
    },
    "DualRangedMed-pwdAtk-1": {
      "tag": "DualRangedMed-pwdAtk-1",
      "slug": "DualRangedMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualranged_med_base_atk_powered_101_01.mp3"
    },
    "DualRangedMed-pwdAtk-2": {
      "tag": "DualRangedMed-pwdAtk-2",
      "slug": "DualRangedMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualranged_med_base_atk_powered_101_02.mp3"
    },
    "DualRangedMed-pwdAtk-3": {
      "tag": "DualRangedMed-pwdAtk-3",
      "slug": "DualRangedMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualranged_med_base_atk_powered_101_03.mp3"
    },
    "DualRangedSml-baseAtk-1": {
      "tag": "DualRangedSml-baseAtk-1",
      "slug": "DualRangedSml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualranged_sml_base_atk_basic_001_01.mp3"
    },
    "DualRangedSml-baseAtk-2": {
      "tag": "DualRangedSml-baseAtk-2",
      "slug": "DualRangedSml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualranged_sml_base_atk_basic_001_02.mp3"
    },
    "DualRangedSml-baseAtk-3": {
      "tag": "DualRangedSml-baseAtk-3",
      "slug": "DualRangedSml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualranged_sml_base_atk_basic_001_03.mp3"
    },
    "DualRangedSml-pwdAtk-1": {
      "tag": "DualRangedSml-pwdAtk-1",
      "slug": "DualRangedSml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_dualranged_sml_base_atk_powered_101_01.mp3"
    },
    "DualRangedSml-pwdAtk-2": {
      "tag": "DualRangedSml-pwdAtk-2",
      "slug": "DualRangedSml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_dualranged_sml_base_atk_powered_101_02.mp3"
    },
    "DualRangedSml-pwdAtk-3": {
      "tag": "DualRangedSml-pwdAtk-3",
      "slug": "DualRangedSml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_dualranged_sml_base_atk_powered_101_03.mp3"
    },
    "EnergyMed-baseAtk-1": {
      "tag": "EnergyMed-baseAtk-1",
      "slug": "EnergyMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_energy_med_base_atk_basic_001_01.mp3"
    },
    "EnergyMed-baseAtk-2": {
      "tag": "EnergyMed-baseAtk-2",
      "slug": "EnergyMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_energy_med_base_atk_basic_001_02.mp3"
    },
    "EnergyMed-baseAtk-3": {
      "tag": "EnergyMed-baseAtk-3",
      "slug": "EnergyMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_energy_med_base_atk_basic_001_03.mp3"
    },
    "EnergyMed-pwdAtk-1": {
      "tag": "EnergyMed-pwdAtk-1",
      "slug": "EnergyMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_energy_med_base_atk_powered_101_01.mp3"
    },
    "EnergyMed-pwdAtk-2": {
      "tag": "EnergyMed-pwdAtk-2",
      "slug": "EnergyMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_energy_med_base_atk_powered_101_02.mp3"
    },
    "EnergyMed-pwdAtk-3": {
      "tag": "EnergyMed-pwdAtk-3",
      "slug": "EnergyMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_energy_med_base_atk_powered_101_03.mp3"
    },
    "EnergySml-baseAtk-1": {
      "tag": "EnergySml-baseAtk-1",
      "slug": "EnergySml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_energy_sml_base_atk_basic_001_01.mp3"
    },
    "EnergySml-baseAtk-2": {
      "tag": "EnergySml-baseAtk-2",
      "slug": "EnergySml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_energy_sml_base_atk_basic_001_02.mp3"
    },
    "EnergySml-baseAtk-3": {
      "tag": "EnergySml-baseAtk-3",
      "slug": "EnergySml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_energy_sml_base_atk_basic_001_03.mp3"
    },
    "EnergySml-pwdAtk-1": {
      "tag": "EnergySml-pwdAtk-1",
      "slug": "EnergySml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_energy_sml_base_atk_powered_101_01.mp3"
    },
    "EnergySml-pwdAtk-2": {
      "tag": "EnergySml-pwdAtk-2",
      "slug": "EnergySml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_energy_sml_base_atk_powered_101_02.mp3"
    },
    "EnergySml-pwdAtk-3": {
      "tag": "EnergySml-pwdAtk-3",
      "slug": "EnergySml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_energy_sml_base_atk_powered_101_03.mp3"
    },
    "PistolMed-baseAtk-1": {
      "tag": "PistolMed-baseAtk-1",
      "slug": "PistolMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_pistol_med_base_atk_basic_001_01.mp3"
    },
    "PistolMed-baseAtk-2": {
      "tag": "PistolMed-baseAtk-2",
      "slug": "PistolMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_pistol_med_base_atk_basic_001_02.mp3"
    },
    "PistolMed-baseAtk-3": {
      "tag": "PistolMed-baseAtk-3",
      "slug": "PistolMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_pistol_med_base_atk_basic_001_03.mp3"
    },
    "PistolMed-baseAtk-4": {
      "tag": "PistolMed-baseAtk-4",
      "slug": "PistolMed",
      "type": "baseAtk",
      "version": 4,
      "path": "weapons/sfx_combat_pistol_med_base_atk_basic_001_04.mp3"
    },
    "PistolMed-pwdAtk-1": {
      "tag": "PistolMed-pwdAtk-1",
      "slug": "PistolMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_pistol_med_base_atk_powered_101_01.mp3"
    },
    "PistolMed-pwdAtk-2": {
      "tag": "PistolMed-pwdAtk-2",
      "slug": "PistolMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_pistol_med_base_atk_powered_101_02.mp3"
    },
    "PistolMed-pwdAtk-3": {
      "tag": "PistolMed-pwdAtk-3",
      "slug": "PistolMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_pistol_med_base_atk_powered_101_03.mp3"
    },
    "PistolSml-baseAtk-1": {
      "tag": "PistolSml-baseAtk-1",
      "slug": "PistolSml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_pistol_sml_base_atk_basic_001_01.mp3"
    },
    "PistolSml-baseAtk-2": {
      "tag": "PistolSml-baseAtk-2",
      "slug": "PistolSml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_pistol_sml_base_atk_basic_001_02.mp3"
    },
    "PistolSml-baseAtk-3": {
      "tag": "PistolSml-baseAtk-3",
      "slug": "PistolSml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_pistol_sml_base_atk_basic_001_03.mp3"
    },
    "PistolSml-pwdAtk-1": {
      "tag": "PistolSml-pwdAtk-1",
      "slug": "PistolSml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_pistol_sml_base_atk_powered_101_01.mp3"
    },
    "PistolSml-pwdAtk-2": {
      "tag": "PistolSml-pwdAtk-2",
      "slug": "PistolSml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_pistol_sml_base_atk_powered_101_02.mp3"
    },
    "PistolSml-pwdAtk-3": {
      "tag": "PistolSml-pwdAtk-3",
      "slug": "PistolSml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_pistol_sml_base_atk_powered_101_03.mp3"
    },
    "ReturningLrg-baseAtk-1": {
      "tag": "ReturningLrg-baseAtk-1",
      "slug": "ReturningLrg",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_returning_lrg_base_atk_basic_001_01.mp3"
    },
    "ReturningLrg-baseAtk-2": {
      "tag": "ReturningLrg-baseAtk-2",
      "slug": "ReturningLrg",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_returning_lrg_base_atk_basic_001_02.mp3"
    },
    "ReturningLrg-baseAtk-3": {
      "tag": "ReturningLrg-baseAtk-3",
      "slug": "ReturningLrg",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_returning_lrg_base_atk_basic_001_03.mp3"
    },
    "ReturningLrg-pwdAtk-1": {
      "tag": "ReturningLrg-pwdAtk-1",
      "slug": "ReturningLrg",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_returning_lrg_base_atk_powered_101_01.mp3"
    },
    "ReturningLrg-pwdAtk-2": {
      "tag": "ReturningLrg-pwdAtk-2",
      "slug": "ReturningLrg",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_returning_lrg_base_atk_powered_101_02.mp3"
    },
    "ReturningLrg-pwdAtk-3": {
      "tag": "ReturningLrg-pwdAtk-3",
      "slug": "ReturningLrg",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_returning_lrg_base_atk_powered_101_03.mp3"
    },
    "ReturningMed-baseAtk-1": {
      "tag": "ReturningMed-baseAtk-1",
      "slug": "ReturningMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_returning_med_base_atk_basic_001_01.mp3"
    },
    "ReturningMed-baseAtk-2": {
      "tag": "ReturningMed-baseAtk-2",
      "slug": "ReturningMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_returning_med_base_atk_basic_001_02.mp3"
    },
    "ReturningMed-baseAtk-3": {
      "tag": "ReturningMed-baseAtk-3",
      "slug": "ReturningMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_returning_med_base_atk_basic_001_03.mp3"
    },
    "ReturningMed-pwdAtk-1": {
      "tag": "ReturningMed-pwdAtk-1",
      "slug": "ReturningMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_returning_med_base_atk_powered_101_01.mp3"
    },
    "ReturningMed-pwdAtk-2": {
      "tag": "ReturningMed-pwdAtk-2",
      "slug": "ReturningMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_returning_med_base_atk_powered_101_02.mp3"
    },
    "ReturningMed-pwdAtk-3": {
      "tag": "ReturningMed-pwdAtk-3",
      "slug": "ReturningMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_returning_med_base_atk_powered_101_03.mp3"
    },
    "RifleMed-baseAtk-1": {
      "tag": "RifleMed-baseAtk-1",
      "slug": "RifleMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_rifle_med_base_atk_basic_001_01.mp3"
    },
    "RifleMed-baseAtk-2": {
      "tag": "RifleMed-baseAtk-2",
      "slug": "RifleMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_rifle_med_base_atk_basic_001_02.mp3"
    },
    "RifleMed-baseAtk-3": {
      "tag": "RifleMed-baseAtk-3",
      "slug": "RifleMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_rifle_med_base_atk_basic_001_03.mp3"
    },
    "RifleMed-baseAtk-4": {
      "tag": "RifleMed-baseAtk-4",
      "slug": "RifleMed",
      "type": "baseAtk",
      "version": 4,
      "path": "weapons/sfx_combat_rifle_med_base_atk_basic_001_04.mp3"
    },
    "RifleMed-pwdAtk-1": {
      "tag": "RifleMed-pwdAtk-1",
      "slug": "RifleMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_rifle_med_base_atk_powered_101_01.mp3"
    },
    "RifleMed-pwdAtk-2": {
      "tag": "RifleMed-pwdAtk-2",
      "slug": "RifleMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_rifle_med_base_atk_powered_101_02.mp3"
    },
    "RifleMed-pwdAtk-3": {
      "tag": "RifleMed-pwdAtk-3",
      "slug": "RifleMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_rifle_med_base_atk_powered_101_03.mp3"
    },
    "RifleSml-baseAtk-1": {
      "tag": "RifleSml-baseAtk-1",
      "slug": "RifleSml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_rifle_sml_base_atk_basic_001_01.mp3"
    },
    "RifleSml-baseAtk-2": {
      "tag": "RifleSml-baseAtk-2",
      "slug": "RifleSml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_rifle_sml_base_atk_basic_001_02.mp3"
    },
    "RifleSml-baseAtk-3": {
      "tag": "RifleSml-baseAtk-3",
      "slug": "RifleSml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_rifle_sml_base_atk_basic_001_03.mp3"
    },
    "RifleSml-pwdAtk-1": {
      "tag": "RifleSml-pwdAtk-1",
      "slug": "RifleSml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_rifle_sml_base_atk_powered_101_01.mp3"
    },
    "RifleSml-pwdAtk-2": {
      "tag": "RifleSml-pwdAtk-2",
      "slug": "RifleSml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_rifle_sml_base_atk_powered_101_02.mp3"
    },
    "RifleSml-pwdAtk-3": {
      "tag": "RifleSml-pwdAtk-3",
      "slug": "RifleSml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_rifle_sml_base_atk_powered_101_03.mp3"
    },
    "ThrustingLrg-baseAtk-1": {
      "tag": "ThrustingLrg-baseAtk-1",
      "slug": "ThrustingLrg",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_thrust_med_base_atk_basic_001_01.mp3"
    },
    "ThrustingLrg-baseAtk-2": {
      "tag": "ThrustingLrg-baseAtk-2",
      "slug": "ThrustingLrg",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_thrust_med_base_atk_basic_001_02.mp3"
    },
    "ThrustingLrg-baseAtk-3": {
      "tag": "ThrustingLrg-baseAtk-3",
      "slug": "ThrustingLrg",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_thrust_med_base_atk_basic_001_03.mp3"
    },
    "ThrustingLrg-pwdAtk-1": {
      "tag": "ThrustingLrg-pwdAtk-1",
      "slug": "ThrustingLrg",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_thrust_med_base_atk_powered_101_01.mp3"
    },
    "ThrustingLrg-pwdAtk-2": {
      "tag": "ThrustingLrg-pwdAtk-2",
      "slug": "ThrustingLrg",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_thrust_med_base_atk_powered_101_02.mp3"
    },
    "ThrustingLrg-pwdAtk-3": {
      "tag": "ThrustingLrg-pwdAtk-3",
      "slug": "ThrustingLrg",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_thrust_med_base_atk_powered_101_03.mp3"
    },
    "ThrustingMed-baseAtk-1": {
      "tag": "ThrustingMed-baseAtk-1",
      "slug": "ThrustingMed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_thrust_med_base_atk_basic_001_01.mp3"
    },
    "ThrustingMed-baseAtk-2": {
      "tag": "ThrustingMed-baseAtk-2",
      "slug": "ThrustingMed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_thrust_med_base_atk_basic_001_02.mp3"
    },
    "ThrustingMed-baseAtk-3": {
      "tag": "ThrustingMed-baseAtk-3",
      "slug": "ThrustingMed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_thrust_med_base_atk_basic_001_03.mp3"
    },
    "ThrustingMed-pwdAtk-1": {
      "tag": "ThrustingMed-pwdAtk-1",
      "slug": "ThrustingMed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_thrust_med_base_atk_powered_101_01.mp3"
    },
    "ThrustingMed-pwdAtk-2": {
      "tag": "ThrustingMed-pwdAtk-2",
      "slug": "ThrustingMed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_thrust_med_base_atk_powered_101_02.mp3"
    },
    "ThrustingMed-pwdAtk-3": {
      "tag": "ThrustingMed-pwdAtk-3",
      "slug": "ThrustingMed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_thrust_med_base_atk_powered_101_03.mp3"
    },
    "ThrustingSml-baseAtk-1": {
      "tag": "ThrustingSml-baseAtk-1",
      "slug": "ThrustingSml",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_thrust_sml_base_atk_basic_001_01.mp3"
    },
    "ThrustingSml-baseAtk-2": {
      "tag": "ThrustingSml-baseAtk-2",
      "slug": "ThrustingSml",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_thrust_sml_base_atk_basic_001_02.mp3"
    },
    "ThrustingSml-baseAtk-3": {
      "tag": "ThrustingSml-baseAtk-3",
      "slug": "ThrustingSml",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_thrust_sml_base_atk_basic_001_03.mp3"
    },
    "ThrustingSml-pwdAtk-1": {
      "tag": "ThrustingSml-pwdAtk-1",
      "slug": "ThrustingSml",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_thrust_sml_base_atk_powered_101_01.mp3"
    },
    "ThrustingSml-pwdAtk-2": {
      "tag": "ThrustingSml-pwdAtk-2",
      "slug": "ThrustingSml",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_thrust_sml_base_atk_powered_101_02.mp3"
    },
    "ThrustingSml-pwdAtk-3": {
      "tag": "ThrustingSml-pwdAtk-3",
      "slug": "ThrustingSml",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_thrust_sml_base_atk_powered_101_03.mp3"
    },
    "Unarmed-baseAtk-1": {
      "tag": "Unarmed-baseAtk-1",
      "slug": "Unarmed",
      "type": "baseAtk",
      "version": 1,
      "path": "weapons/sfx_combat_unarmed_base_atk_basic_001_01.mp3"
    },
    "Unarmed-baseAtk-2": {
      "tag": "Unarmed-baseAtk-2",
      "slug": "Unarmed",
      "type": "baseAtk",
      "version": 2,
      "path": "weapons/sfx_combat_unarmed_base_atk_basic_001_02.mp3"
    },
    "Unarmed-baseAtk-3": {
      "tag": "Unarmed-baseAtk-3",
      "slug": "Unarmed",
      "type": "baseAtk",
      "version": 3,
      "path": "weapons/sfx_combat_unarmed_base_atk_basic_001_03.mp3"
    },
    "Unarmed-pwdAtk-1": {
      "tag": "Unarmed-pwdAtk-1",
      "slug": "Unarmed",
      "type": "pwdAtk",
      "version": 1,
      "path": "weapons/sfx_combat_unarmed_base_atk_powered_101_01.mp3"
    },
    "Unarmed-pwdAtk-2": {
      "tag": "Unarmed-pwdAtk-2",
      "slug": "Unarmed",
      "type": "pwdAtk",
      "version": 2,
      "path": "weapons/sfx_combat_unarmed_base_atk_powered_101_02.mp3"
    },
    "Unarmed-pwdAtk-3": {
      "tag": "Unarmed-pwdAtk-3",
      "slug": "Unarmed",
      "type": "pwdAtk",
      "version": 3,
      "path": "weapons/sfx_combat_unarmed_base_atk_powered_101_03.mp3"
    }
  },
  "abilities": {
    "buff-1": {
      "tag": "buff-1",
      "type": "buff",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_buff_01.mp3"
    },
    "cleanse-1": {
      "tag": "cleanse-1",
      "type": "cleanse",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_cleanse_01.mp3"
    },
    "counterattack-1": {
      "tag": "counterattack-1",
      "type": "counterattack",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_counterattack_01.mp3"
    },
    "debuff-1": {
      "tag": "debuff-1",
      "type": "debuff",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_debuff_01.mp3"
    },
    "downvote-1": {
      "tag": "downvote-1",
      "type": "downvote",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_downvote_01.mp3"
    },
    "forcefield_active_loop-1": {
      "tag": "forcefield_active_loop-1",
      "type": "forcefield_active_loop",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_forcefield_active_loop_01.mp3"
    },
    "forcefield_on-1": {
      "tag": "forcefield_on-1",
      "type": "forcefield_on",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_forcefield_on_01.mp3"
    },
    "forcefield_on-2": {
      "tag": "forcefield_on-2",
      "type": "forcefield_on",
      "version": 2,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_forcefield_on_02.mp3"
    },
    "forcefield_on-3": {
      "tag": "forcefield_on-3",
      "type": "forcefield_on",
      "version": 3,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_forcefield_on_03.mp3"
    },
    "hack-1": {
      "tag": "hack-1",
      "type": "hack",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_hack_01.mp3"
    },
    "interact-1": {
      "tag": "interact-1",
      "type": "interact",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_interact_01.mp3"
    },
    "nanomed_injection-1": {
      "tag": "nanomed_injection-1",
      "type": "nanomed_injection",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_nanomed_injection_01.mp3"
    },
    "nanomed_shower-1": {
      "tag": "nanomed_shower-1",
      "type": "nanomed_shower",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_nanomed_shower_01.mp3"
    },
    "nanomed_storm-1": {
      "tag": "nanomed_storm-1",
      "type": "nanomed_storm",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_nanomed_storm_01.mp3"
    },
    "poison-1": {
      "tag": "poison-1",
      "type": "poison",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_poison_01.mp3"
    },
    "regeneration-1": {
      "tag": "regeneration-1",
      "type": "regeneration",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_regeneration_01.mp3"
    },
    "resurrect-1": {
      "tag": "resurrect-1",
      "type": "resurrect",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_doc_resurrect_01.mp3"
    },
    "sharegeneral-1": {
      "tag": "sharegeneral-1",
      "type": "sharegeneral",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_sharegeneral_01.mp3"
    },
    "skillboost-1": {
      "tag": "skillboost-1",
      "type": "skillboost",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_skillboost_01.mp3"
    },
    "skillbuff-1": {
      "tag": "skillbuff-1",
      "type": "skillbuff",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_skillbuff_01.mp3"
    },
    "slowdown-1": {
      "tag": "slowdown-1",
      "type": "slowdown",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_slowdown_01.mp3"
    },
    "speedup-1": {
      "tag": "speedup-1",
      "type": "speedup",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_speedup_01.mp3"
    },
    "statboost-1": {
      "tag": "statboost-1",
      "type": "statboost",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_statboost_01.mp3"
    },
    "statbreak-1": {
      "tag": "statbreak-1",
      "type": "statbreak",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_statbreak_01.mp3"
    },
    "strip-1": {
      "tag": "strip-1",
      "type": "strip",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_strip_01.mp3"
    },
    "subvert-1": {
      "tag": "subvert-1",
      "type": "subvert",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_subvert_01.mp3"
    },
    "taunt-1": {
      "tag": "taunt-1",
      "type": "taunt",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_taunt_01.mp3"
    },
    "upvote-1": {
      "tag": "upvote-1",
      "type": "upvote",
      "version": 1,
      "path": "sfx/combat/abilities/shared/sfx_combat_abilities_upvote_01.mp3"
    }
  },
  "combat": {
    "battle-start-1": {
      "tag": "battle-start-1",
      "type": "battle-start",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_battle_start_01.mp3"
    },
    "char-select-1": {
      "tag": "char-select-1",
      "type": "char-select",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_char_select_01.mp3"
    },
    "enemy-incoming-1": {
      "tag": "enemy-incoming-1",
      "type": "enemy-incoming",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_enemy_incoming_01.mp3"
    },
    "icons-appear-1": {
      "tag": "icons-appear-1",
      "type": "icons-appear",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_icons_appear_01.mp3"
    },
    "icons-appear-2": {
      "tag": "icons-appear-2",
      "type": "icons-appear",
      "version": 2,
      "path": "sfx/ui/combat/sfx_ui_combat_icons_appear_02.mp3"
    },
    "icons-appear-3": {
      "tag": "icons-appear-3",
      "type": "icons-appear",
      "version": 3,
      "path": "sfx/ui/combat/sfx_ui_combat_icons_appear_03.mp3"
    },
    "next-battle-button-1": {
      "tag": "next-battle-button-1",
      "type": "next-battle-button",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_next_battle_button_01.mp3"
    },
    "player-turn-1": {
      "tag": "player-turn-1",
      "type": "player-turn",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_player_turn_01.mp3"
    },
    "skill-cancel-1": {
      "tag": "skill-cancel-1",
      "type": "skill-cancel",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_skill_cancel_01.mp3"
    },
    "skill-confirm-1": {
      "tag": "skill-confirm-1",
      "type": "skill-confirm",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_skill_confirm_01.mp3"
    },
    "skill-confirm-2": {
      "tag": "skill-confirm-2",
      "type": "skill-confirm",
      "version": 2,
      "path": "sfx/ui/combat/sfx_ui_combat_skill_confirm_02.mp3"
    },
    "skill-confirm-3": {
      "tag": "skill-confirm-3",
      "type": "skill-confirm",
      "version": 3,
      "path": "sfx/ui/combat/sfx_ui_combat_skill_confirm_03.mp3"
    },
    "skill-select-1": {
      "tag": "skill-select-1",
      "type": "skill-select",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_skill_select_01.mp3"
    },
    "victory-screen-enter-1": {
      "tag": "victory-screen-enter-1",
      "type": "victory-screen-enter",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_victory_screen_enter_01.mp3"
    },
    "victory-screen-text-1": {
      "tag": "victory-screen-text-1",
      "type": "victory-screen-text",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_victory_screen_text_01.mp3"
    },
    "zoom-in-1": {
      "tag": "zoom-in-1",
      "type": "zoom-in",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_in_01.mp3"
    },
    "zoom-in-2": {
      "tag": "zoom-in-2",
      "type": "zoom-in",
      "version": 2,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_in_02.mp3"
    },
    "zoom-in-3": {
      "tag": "zoom-in-3",
      "type": "zoom-in",
      "version": 3,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_in_03.mp3"
    },
    "zoom-in-4": {
      "tag": "zoom-in-4",
      "type": "zoom-in",
      "version": 4,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_in_04.mp3"
    },
    "zoom-in-5": {
      "tag": "zoom-in-5",
      "type": "zoom-in",
      "version": 5,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_in_05.mp3"
    },
    "zoom-in-dramatic-1": {
      "tag": "zoom-in-dramatic-1",
      "type": "zoom-in-dramatic",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_in_dramatic_01.mp3"
    },
    "zoom-out-1": {
      "tag": "zoom-out-1",
      "type": "zoom-out",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_out_01.mp3"
    },
    "zoom-out-2": {
      "tag": "zoom-out-2",
      "type": "zoom-out",
      "version": 2,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_out_02.mp3"
    },
    "zoom-out-3": {
      "tag": "zoom-out-3",
      "type": "zoom-out",
      "version": 3,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_out_03.mp3"
    },
    "zoom-out-4": {
      "tag": "zoom-out-4",
      "type": "zoom-out",
      "version": 4,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_out_04.mp3"
    },
    "zoom-out-dramatic-1": {
      "tag": "zoom-out-dramatic-1",
      "type": "zoom-out-dramatic",
      "version": 1,
      "path": "sfx/ui/combat/sfx_ui_combat_zoom_out_dramatic_01.mp3"
    },
    "human-cloth-death-lrg-wepspin-1": {
      "tag": "human-cloth-death-lrg-wepspin-1",
      "type": "human-cloth-death-lrg-wepspin",
      "version": 1,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_death_lrg_wepspin_01.mp3"
    },
    "human-cloth-death-med-basic-1": {
      "tag": "human-cloth-death-med-basic-1",
      "type": "human-cloth-death-med-basic",
      "version": 1,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_death_med_basic_01.mp3"
    },
    "human-cloth-palm-up-1": {
      "tag": "human-cloth-palm-up-1",
      "type": "human-cloth-palm-up",
      "version": 1,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_palm_up_01.mp3"
    },
    "human-cloth-palm-up-2": {
      "tag": "human-cloth-palm-up-2",
      "type": "human-cloth-palm-up",
      "version": 2,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_palm_up_02.mp3"
    },
    "human-cloth-palm-up-3": {
      "tag": "human-cloth-palm-up-3",
      "type": "human-cloth-palm-up",
      "version": 3,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_palm_up_03.mp3"
    },
    "human-cloth-point-1": {
      "tag": "human-cloth-point-1",
      "type": "human-cloth-point",
      "version": 1,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_point_01.mp3"
    },
    "human-cloth-point-2": {
      "tag": "human-cloth-point-2",
      "type": "human-cloth-point",
      "version": 2,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_point_02.mp3"
    },
    "human-cloth-point-3": {
      "tag": "human-cloth-point-3",
      "type": "human-cloth-point",
      "version": 3,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_point_03.mp3"
    },
    "human-cloth-return-1": {
      "tag": "human-cloth-return-1",
      "type": "human-cloth-return",
      "version": 1,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_return_01.mp3"
    },
    "human-cloth-return-2": {
      "tag": "human-cloth-return-2",
      "type": "human-cloth-return",
      "version": 2,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_return_02.mp3"
    },
    "human-cloth-return-3": {
      "tag": "human-cloth-return-3",
      "type": "human-cloth-return",
      "version": 3,
      "path": "sfx/combat/foley/sfx_combat_foley_human_cloth_return_03.mp3"
    },
    "damage-explosion-lrg-1": {
      "tag": "damage-explosion-lrg-1",
      "type": "damage-explosion-lrg",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_explosion_lrg_01.mp3"
    },
    "damage-flesh-blunt-lrg-1": {
      "tag": "damage-flesh-blunt-lrg-1",
      "type": "damage-flesh-blunt-lrg",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_lrg_01.mp3"
    },
    "damage-flesh-blunt-lrg-2": {
      "tag": "damage-flesh-blunt-lrg-2",
      "type": "damage-flesh-blunt-lrg",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_lrg_02.mp3"
    },
    "damage-flesh-blunt-lrg-3": {
      "tag": "damage-flesh-blunt-lrg-3",
      "type": "damage-flesh-blunt-lrg",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_lrg_03.mp3"
    },
    "damage-flesh-blunt-med-1": {
      "tag": "damage-flesh-blunt-med-1",
      "type": "damage-flesh-blunt-med",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_med_01.mp3"
    },
    "damage-flesh-blunt-med-2": {
      "tag": "damage-flesh-blunt-med-2",
      "type": "damage-flesh-blunt-med",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_med_02.mp3"
    },
    "damage-flesh-blunt-med-3": {
      "tag": "damage-flesh-blunt-med-3",
      "type": "damage-flesh-blunt-med",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_med_03.mp3"
    },
    "damage-flesh-blunt-sml-1": {
      "tag": "damage-flesh-blunt-sml-1",
      "type": "damage-flesh-blunt-sml",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_sml_01.mp3"
    },
    "damage-flesh-blunt-sml-2": {
      "tag": "damage-flesh-blunt-sml-2",
      "type": "damage-flesh-blunt-sml",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_sml_02.mp3"
    },
    "damage-flesh-blunt-sml-3": {
      "tag": "damage-flesh-blunt-sml-3",
      "type": "damage-flesh-blunt-sml",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_blunt_sml_03.mp3"
    },
    "damage-flesh-ranged-sml-1": {
      "tag": "damage-flesh-ranged-sml-1",
      "type": "damage-flesh-ranged-sml",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_ranged_sml_01.mp3"
    },
    "damage-flesh-ranged-sml-2": {
      "tag": "damage-flesh-ranged-sml-2",
      "type": "damage-flesh-ranged-sml",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_ranged_sml_02.mp3"
    },
    "damage-flesh-ranged-sml-3": {
      "tag": "damage-flesh-ranged-sml-3",
      "type": "damage-flesh-ranged-sml",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_ranged_sml_03.mp3"
    },
    "damage-flesh-ranged-sml-4": {
      "tag": "damage-flesh-ranged-sml-4",
      "type": "damage-flesh-ranged-sml",
      "version": 4,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_ranged_sml_04.mp3"
    },
    "damage-flesh-sharp-long-1": {
      "tag": "damage-flesh-sharp-long-1",
      "type": "damage-flesh-sharp-long",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_long_01.mp3"
    },
    "damage-flesh-sharp-long-2": {
      "tag": "damage-flesh-sharp-long-2",
      "type": "damage-flesh-sharp-long",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_long_02.mp3"
    },
    "damage-flesh-sharp-long-3": {
      "tag": "damage-flesh-sharp-long-3",
      "type": "damage-flesh-sharp-long",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_long_03.mp3"
    },
    "damage-flesh-sharp-lrg-1": {
      "tag": "damage-flesh-sharp-lrg-1",
      "type": "damage-flesh-sharp-lrg",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_lrg_01.mp3"
    },
    "damage-flesh-sharp-lrg-2": {
      "tag": "damage-flesh-sharp-lrg-2",
      "type": "damage-flesh-sharp-lrg",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_lrg_02.mp3"
    },
    "damage-flesh-sharp-lrg-3": {
      "tag": "damage-flesh-sharp-lrg-3",
      "type": "damage-flesh-sharp-lrg",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_lrg_03.mp3"
    },
    "damage-flesh-sharp-med-1": {
      "tag": "damage-flesh-sharp-med-1",
      "type": "damage-flesh-sharp-med",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_med_01.mp3"
    },
    "damage-flesh-sharp-med-2": {
      "tag": "damage-flesh-sharp-med-2",
      "type": "damage-flesh-sharp-med",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_med_02.mp3"
    },
    "damage-flesh-sharp-med-3": {
      "tag": "damage-flesh-sharp-med-3",
      "type": "damage-flesh-sharp-med",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_med_03.mp3"
    },
    "damage-flesh-sharp-sml-1": {
      "tag": "damage-flesh-sharp-sml-1",
      "type": "damage-flesh-sharp-sml",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_sml_01.mp3"
    },
    "damage-flesh-sharp-sml-2": {
      "tag": "damage-flesh-sharp-sml-2",
      "type": "damage-flesh-sharp-sml",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_sml_02.mp3"
    },
    "damage-flesh-sharp-sml-3": {
      "tag": "damage-flesh-sharp-sml-3",
      "type": "damage-flesh-sharp-sml",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_flesh_sharp_sml_03.mp3"
    },
    "damage-forcefield-explos-lrg-1": {
      "tag": "damage-forcefield-explos-lrg-1",
      "type": "damage-forcefield-explos-lrg",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_explos_lrg_01.mp3"
    },
    "damage-forcefield-lrg-1": {
      "tag": "damage-forcefield-lrg-1",
      "type": "damage-forcefield-lrg",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_lrg_01.mp3"
    },
    "damage-forcefield-lrg-2": {
      "tag": "damage-forcefield-lrg-2",
      "type": "damage-forcefield-lrg",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_lrg_02.mp3"
    },
    "damage-forcefield-lrg-3": {
      "tag": "damage-forcefield-lrg-3",
      "type": "damage-forcefield-lrg",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_lrg_03.mp3"
    },
    "damage-forcefield-med-1": {
      "tag": "damage-forcefield-med-1",
      "type": "damage-forcefield-med",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_med_01.mp3"
    },
    "damage-forcefield-med-2": {
      "tag": "damage-forcefield-med-2",
      "type": "damage-forcefield-med",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_med_02.mp3"
    },
    "damage-forcefield-med-3": {
      "tag": "damage-forcefield-med-3",
      "type": "damage-forcefield-med",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_med_03.mp3"
    },
    "damage-forcefield-med-4": {
      "tag": "damage-forcefield-med-4",
      "type": "damage-forcefield-med",
      "version": 4,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_med_04.mp3"
    },
    "damage-forcefield-sml-1": {
      "tag": "damage-forcefield-sml-1",
      "type": "damage-forcefield-sml",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_sml_01.mp3"
    },
    "damage-forcefield-sml-2": {
      "tag": "damage-forcefield-sml-2",
      "type": "damage-forcefield-sml",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_sml_02.mp3"
    },
    "damage-forcefield-sml-3": {
      "tag": "damage-forcefield-sml-3",
      "type": "damage-forcefield-sml",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_sml_03.mp3"
    },
    "damage-forcefield-sml-4": {
      "tag": "damage-forcefield-sml-4",
      "type": "damage-forcefield-sml",
      "version": 4,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_forcefield_snl_04.mp3"
    },
    "damage-interact-1": {
      "tag": "damage-interact-1",
      "type": "damage-interact",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_interact_01.mp3"
    },
    "damage-interact-2": {
      "tag": "damage-interact-2",
      "type": "damage-interact",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_interact_02.mp3"
    },
    "damage-interact-3": {
      "tag": "damage-interact-3",
      "type": "damage-interact",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_interact_03.mp3"
    },
    "damage-metal-lrg-1": {
      "tag": "damage-metal-lrg-1",
      "type": "damage-metal-lrg",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_lrg_01.mp3"
    },
    "damage-metal-lrg-2": {
      "tag": "damage-metal-lrg-2",
      "type": "damage-metal-lrg",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_lrg_02.mp3"
    },
    "damage-metal-lrg-3": {
      "tag": "damage-metal-lrg-3",
      "type": "damage-metal-lrg",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_lrg_03.mp3"
    },
    "damage-metal-med-1": {
      "tag": "damage-metal-med-1",
      "type": "damage-metal-med",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_med_01.mp3"
    },
    "damage-metal-med-2": {
      "tag": "damage-metal-med-2",
      "type": "damage-metal-med",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_med_02.mp3"
    },
    "damage-metal-med-3": {
      "tag": "damage-metal-med-3",
      "type": "damage-metal-med",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_med_03.mp3"
    },
    "damage-metal-med-4": {
      "tag": "damage-metal-med-4",
      "type": "damage-metal-med",
      "version": 4,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_med_04.mp3"
    },
    "damage-metal-sml-1": {
      "tag": "damage-metal-sml-1",
      "type": "damage-metal-sml",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_sml_01.mp3"
    },
    "damage-metal-sml-2": {
      "tag": "damage-metal-sml-2",
      "type": "damage-metal-sml",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_sml_02.mp3"
    },
    "damage-metal-sml-3": {
      "tag": "damage-metal-sml-3",
      "type": "damage-metal-sml",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_sml_03.mp3"
    },
    "damage-metal-sml-4": {
      "tag": "damage-metal-sml-4",
      "type": "damage-metal-sml",
      "version": 4,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_sml_04.mp3"
    },
    "damage-metal-sml-5": {
      "tag": "damage-metal-sml-5",
      "type": "damage-metal-sml",
      "version": 5,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_sml_05.mp3"
    },
    "damage-metal-sml-6": {
      "tag": "damage-metal-sml-6",
      "type": "damage-metal-sml",
      "version": 6,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_sml_06.mp3"
    },
    "damage-metal-sml-7": {
      "tag": "damage-metal-sml-7",
      "type": "damage-metal-sml",
      "version": 7,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_metal_sml_07.mp3"
    },
    "damage-shield-any-1": {
      "tag": "damage-shield-any-1",
      "type": "damage-shield-any",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_shield_any_01.mp3"
    },
    "damage-shield-any-2": {
      "tag": "damage-shield-any-2",
      "type": "damage-shield-any",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_shield_any_02.mp3"
    },
    "damage-shield-any-3": {
      "tag": "damage-shield-any-3",
      "type": "damage-shield-any",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_damage_shield_any_03.mp3"
    },
    "disarm-forcefield-1": {
      "tag": "disarm-forcefield-1",
      "type": "disarm-forcefield",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_disarm_forcefield_01.mp3"
    },
    "disarm-forcefield-2": {
      "tag": "disarm-forcefield-2",
      "type": "disarm-forcefield",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_disarm_forcefield_02.mp3"
    },
    "disarm-forcefield-3": {
      "tag": "disarm-forcefield-3",
      "type": "disarm-forcefield",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_disarm_forcefield_03.mp3"
    },
    "knockout-player-1": {
      "tag": "knockout-player-1",
      "type": "knockout-player",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_gen_knockout_player_01.mp3"
    },
    "knockout-player-2": {
      "tag": "knockout-player-2",
      "type": "knockout-player",
      "version": 2,
      "path": "sfx/combat/impacts/sfx_combat_gen_knockout_player_02.mp3"
    },
    "knockout-player-3": {
      "tag": "knockout-player-3",
      "type": "knockout-player",
      "version": 3,
      "path": "sfx/combat/impacts/sfx_combat_gen_knockout_player_03.mp3"
    },
    "hero-death-impact-1": {
      "tag": "hero-death-impact-1",
      "type": "hero-death-impact",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_general_hero_death_impact_01.mp3"
    },
    "hero-death-impact-v2-1": {
      "tag": "hero-death-impact-v2-1",
      "type": "hero-death-impact-v2",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_general_hero_death_impact_v2_01.mp3"
    },
    "hero-death-tumble-1": {
      "tag": "hero-death-tumble-1",
      "type": "hero-death-tumble",
      "version": 1,
      "path": "sfx/combat/impacts/sfx_combat_general_hero_death_tumble_01.mp3"
    }
  },
  "unused": {
    "music/season_0/music_and_sfx_season_0_ending_cinematic_v2.mp3": {
      "path": "music/season_0/music_and_sfx_season_0_ending_cinematic_v2.mp3"
    },
    "music/season_0/music_and_sfx_season_0_opening_cinematic_v8.mp3": {
      "path": "music/season_0/music_and_sfx_season_0_opening_cinematic_v8.mp3"
    },
    "music/season_0/music_and_sfx_season_0_opening_interstitial_01.mp3": {
      "path": "music/season_0/music_and_sfx_season_0_opening_interstitial_01.mp3"
    },
    "music/season_0/music_combat_B_v2.mp3": {
      "path": "music/season_0/music_combat_B_v2.mp3"
    },
    "music/season_0/music_combat_boss_A_loop.mp3": {
      "path": "music/season_0/music_combat_boss_A_loop.mp3"
    },
    "music/season_0/music_combat_boss_A_victory.mp3": {
      "path": "music/season_0/music_combat_boss_A_victory.mp3"
    },
    "music/season_0/music_combat_C_loss_01.mp3": {
      "path": "music/season_0/music_combat_C_loss_01.mp3"
    },
    "music/season_0/music_combat_C_main.mp3": {
      "path": "music/season_0/music_combat_C_main.mp3"
    },
    "music/season_0/music_combat_C_victory.mp3": {
      "path": "music/season_0/music_combat_C_victory.mp3"
    },
    "music/season_0/music_combat_opening_v3.mp3": {
      "path": "music/season_0/music_combat_opening_v3.mp3"
    },
    "music/season_0/music_combat_opening_v3_intro.mp3": {
      "path": "music/season_0/music_combat_opening_v3_intro.mp3"
    },
    "music/shared/music_apartment_all.mp3": {
      "path": "music/shared/music_apartment_all.mp3"
    },
    "music/shared/music_apartment_main_loop_01.mp3": {
      "path": "music/shared/music_apartment_main_loop_01.mp3"
    },
    "music/shared/music_combat_transition_generic.mp3": {
      "path": "music/shared/music_combat_transition_generic.mp3"
    },
    "music/shared/music_demo_day_video_interstitial_v2_single_hit_only.mp3": {
      "path": "music/shared/music_demo_day_video_interstitial_v2_single_hit_only.mp3"
    },
    "music/shared/music_dialogue_B_v3_intro.mp3": {
      "path": "music/shared/music_dialogue_B_v3_intro.mp3"
    },
    "music/shared/music_dialogue_B_v3_loop.mp3": {
      "path": "music/shared/music_dialogue_B_v3_loop.mp3"
    },
    "music/shared/music_dialogue_opening_A_v3.mp3": {
      "path": "music/shared/music_dialogue_opening_A_v3.mp3"
    },
    "music/shared/music_logo_opening.mp3": {
      "path": "music/shared/music_logo_opening.mp3"
    },
    "sfx/amb/sfx_amb_alley_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_alley_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_01.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_02.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_02.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_03.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_03.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_04.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_04.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_05.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_05.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_06.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_06.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_07.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_07.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_08.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_lightbuzz_os_08.mp3"
    },
    "sfx/amb/sfx_amb_apartmentstairs_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_apartmentstairs_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_club_lightflicker_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_club_lightflicker_os_01.mp3"
    },
    "sfx/amb/sfx_amb_club_lightflicker_os_02.mp3": {
      "path": "sfx/amb/sfx_amb_club_lightflicker_os_02.mp3"
    },
    "sfx/amb/sfx_amb_club_lightflicker_os_03.mp3": {
      "path": "sfx/amb/sfx_amb_club_lightflicker_os_03.mp3"
    },
    "sfx/amb/sfx_amb_club_lightflicker_os_04.mp3": {
      "path": "sfx/amb/sfx_amb_club_lightflicker_os_04.mp3"
    },
    "sfx/amb/sfx_amb_club_lightflicker_os_05.mp3": {
      "path": "sfx/amb/sfx_amb_club_lightflicker_os_05.mp3"
    },
    "sfx/amb/sfx_amb_club_lightflicker_os_06.mp3": {
      "path": "sfx/amb/sfx_amb_club_lightflicker_os_06.mp3"
    },
    "sfx/amb/sfx_amb_club_lightflicker_os_07.mp3": {
      "path": "sfx/amb/sfx_amb_club_lightflicker_os_07.mp3"
    },
    "sfx/amb/sfx_amb_club_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_club_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_club_outside_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_club_outside_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_corporatelobby_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_corporatelobby_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_executivesuite_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_executivesuite_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_executivesuite_ship_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_executivesuite_ship_os_01.mp3"
    },
    "sfx/amb/sfx_amb_hideout_exterior_afternoon_birds_01.mp3": {
      "path": "sfx/amb/sfx_amb_hideout_exterior_afternoon_birds_01.mp3"
    },
    "sfx/amb/sfx_amb_hideout_exterior_dusk_01.mp3": {
      "path": "sfx/amb/sfx_amb_hideout_exterior_dusk_01.mp3"
    },
    "sfx/amb/sfx_amb_hideout_exterior_fog_01.mp3": {
      "path": "sfx/amb/sfx_amb_hideout_exterior_fog_01.mp3"
    },
    "sfx/amb/sfx_amb_hideout_exterior_night_01.mp3": {
      "path": "sfx/amb/sfx_amb_hideout_exterior_night_01.mp3"
    },
    "sfx/amb/sfx_amb_hideout_exterior_rain_01.mp3": {
      "path": "sfx/amb/sfx_amb_hideout_exterior_rain_01.mp3"
    },
    "sfx/amb/sfx_amb_hideout_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_hideout_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_crane_long_01.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_crane_long_01.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_crane_long_02.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_crane_long_02.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_crane_short_01.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_crane_short_01.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_general_ship_01.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_general_ship_01.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_general_ship_02.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_general_ship_02.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_general_ship_03.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_general_ship_03.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_general_ship_04.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_general_ship_04.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_general_ship_05.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_general_ship_05.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_general_ship_06.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_general_ship_06.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_police_ship_01.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_police_ship_01.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_siren_01.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_siren_01.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_siren_02.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_siren_02.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_siren_03.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_siren_03.mp3"
    },
    "sfx/amb/sfx_amb_rooftop_os_siren_04.mp3": {
      "path": "sfx/amb/sfx_amb_rooftop_os_siren_04.mp3"
    },
    "sfx/amb/sfx_amb_street_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_street_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_diagonal_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_diagonal_os_01.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_01.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_02.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_02.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_03.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_03.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_04.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_04.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_05.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_05.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_06.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_06.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_07.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_07.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_08.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_08.mp3"
    },
    "sfx/amb/sfx_amb_street_ship_standard_os_09.mp3": {
      "path": "sfx/amb/sfx_amb_street_ship_standard_os_09.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_01.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_02.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_02.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_03.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_03.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_04.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_04.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_05.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_05.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_06.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_06.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_07.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_07.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_08.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_lightflicker_os_08.mp3"
    },
    "sfx/amb/sfx_amb_subwaystairs_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystairs_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_subwaystation_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystation_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_subwaystation_securitycam_left_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystation_securitycam_left_os_01.mp3"
    },
    "sfx/amb/sfx_amb_subwaystation_securitycam_right_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystation_securitycam_right_os_01.mp3"
    },
    "sfx/amb/sfx_amb_subwaystation_train_os_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystation_train_os_01.mp3"
    },
    "sfx/amb/sfx_amb_subwaystationred_loop_alert_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystationred_loop_alert_01.mp3"
    },
    "sfx/amb/sfx_amb_subwaystationred_loop_rain_01.mp3": {
      "path": "sfx/amb/sfx_amb_subwaystationred_loop_rain_01.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_loop_01.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_loop_01.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_01.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_01.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_02.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_02.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_03.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_03.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_04.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_04.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_05.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_05.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_06.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_06.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_07.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_07.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_08.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_08.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_09.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_09.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_10.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_10.mp3"
    },
    "sfx/amb/sfx_amb_trainingroom_os_metalcreak_11.mp3": {
      "path": "sfx/amb/sfx_amb_trainingroom_os_metalcreak_11.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_attackbuff_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_attackbuff_01.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_demon_power_up_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_demon_power_up_01.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_heal_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_heal_01.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_return_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_return_01.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_return_02.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_return_02.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_return_03.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_return_03.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_start_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_start_01.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_start_02.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_start_02.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_start_03.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interact_start_03.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interaction_generic_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_interaction_generic_01.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_jack_destroy_turret_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_jack_destroy_turret_01.mp3"
    },
    "sfx/combat/abilities/currently_unused/sfx_combat_abilities_jack_disarm_shield_01.mp3": {
      "path": "sfx/combat/abilities/currently_unused/sfx_combat_abilities_jack_disarm_shield_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_adjudicator_atk_basic_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_adjudicator_atk_basic_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_adjudicator_atk_basic_02.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_adjudicator_atk_basic_02.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_adjudicator_atk_basic_03.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_adjudicator_atk_basic_03.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_adjudicator_death_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_adjudicator_death_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_adjudicator_hurt_lrg_foley_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_adjudicator_hurt_lrg_foley_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_adjudicator_hurt_sml_foley_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_adjudicator_hurt_sml_foley_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_chainsaw_atk_basic_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_chainsaw_atk_basic_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_chainsaw_atk_basic_02.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_chainsaw_atk_basic_02.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_chainsaw_atk_basic_03.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_chainsaw_atk_basic_03.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_chainsaw_death_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_chainsaw_death_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_chainsaw_hurt_lrg_foley_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_chainsaw_hurt_lrg_foley_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_chainsaw_hurt_sml_foley_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_chainsaw_hurt_sml_foley_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_shield_atk_basic_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_shield_atk_basic_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_shield_atk_basic_02.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_shield_atk_basic_02.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_shield_atk_basic_03.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_shield_atk_basic_03.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_shield_death_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_shield_death_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_basic_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_basic_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_basic_02.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_basic_02.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_basic_03.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_basic_03.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_topsmack_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_atk_topsmack_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_death_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_cog_potato_weapon_death_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_genius_atk_crush_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_genius_atk_crush_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_genius_death_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_genius_death_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_ab_summonturret_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_ab_summonturret_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_ab_summonturret_spawn_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_ab_summonturret_spawn_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_appear_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_appear_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_atk_gundown_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_atk_gundown_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_atk_gundown_impact_flesh_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_atk_gundown_impact_flesh_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_atk_multiattack_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_atk_multiattack_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_death_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_death_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_hurt_foley_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_hurt_foley_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_hurt_vo_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_hurt_vo_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_idle_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_idle_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_tentacle_baus_shield_active_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_tentacle_baus_shield_active_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_turret_corp_atk_mowdown_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_turret_corp_atk_mowdown_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_turret_junkbot_atk_basic_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_turret_junkbot_atk_basic_01.mp3"
    },
    "sfx/combat/enemies/sfx_enemies_turret_junkbot_death_01.mp3": {
      "path": "sfx/combat/enemies/sfx_enemies_turret_junkbot_death_01.mp3"
    },
    "sfx/combat/environmental/sfx_environ_ceresvitastation_deploy_01.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_ceresvitastation_deploy_01.mp3"
    },
    "sfx/combat/environmental/sfx_environ_ceresvitastation_turn_off_01.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_ceresvitastation_turn_off_01.mp3"
    },
    "sfx/combat/environmental/sfx_environ_ceresvitastation_turn_on_01.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_ceresvitastation_turn_on_01.mp3"
    },
    "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_01.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_01.mp3"
    },
    "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_02.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_02.mp3"
    },
    "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_03.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_03.mp3"
    },
    "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_04.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_04.mp3"
    },
    "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_05.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_armed_alarm_05.mp3"
    },
    "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_arming_01.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_arming_01.mp3"
    },
    "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_explosion_01.mp3": {
      "path": "sfx/combat/environmental/sfx_environ_yumeexplosivedevice_explosion_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_axe_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_axe_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_crowbar_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_crowbar_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_knife_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_knife_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_punch_raw_base_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_punch_raw_base_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_punch_raw_base_atk_basic_02.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_punch_raw_base_atk_basic_02.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_punch_raw_base_atk_basic_03.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_punch_raw_base_atk_basic_03.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_ab_skill_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_ab_skill_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_atk_basic_02.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_atk_basic_02.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_atk_basic_03.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_riot_shield_atk_basic_03.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_taser_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_taser_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_taser_atk_basic_02.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_taser_atk_basic_02.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_taser_atk_basic_03.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_taser_atk_basic_03.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_hit_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_hit_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_hit_02.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_hit_02.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_hit_03.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_hit_03.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_start_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_start_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_start_02.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_start_02.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_start_03.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_cross_slash_start_03.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_double_tap_start_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_double_tap_start_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_double_tap_start_02.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_double_tap_start_02.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_double_tap_start_03.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_double_tap_start_03.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_stab_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_stab_01.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_stab_02.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_stab_02.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_stab_03.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_stab_03.mp3"
    },
    "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_takedown_01.mp3": {
      "path": "sfx/combat/weapons/melee/sfx_combat_melee_twinblades_atk_takedown_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_crossbow_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_crossbow_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_cowboy_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_cowboy_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_standard_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_standard_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_standard_atk_basic_02.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_standard_atk_basic_02.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_standard_atk_basic_03.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_pistol_standard_atk_basic_03.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_basic_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_basic_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_basic_blocked_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_basic_blocked_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_basic_hit_metal_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_basic_hit_metal_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_mortar_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_square_atk_mortar_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_doubleshot_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_doubleshot_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_quickburst_01.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_quickburst_01.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_quickburst_02.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_quickburst_02.mp3"
    },
    "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_quickburst_03.mp3": {
      "path": "sfx/combat/weapons/ranged/sfx_combat_ranged_rifle_standard_atk_quickburst_03.mp3"
    },
    "sfx/misc/sfx_trailer_logo_hit_01.mp3": {
      "path": "sfx/misc/sfx_trailer_logo_hit_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_map_battle_start_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_map_battle_start_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_map_location_open_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_map_location_open_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_map_open_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_map_open_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_close_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_close_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_equipment_inv_open_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_equipment_inv_open_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_open_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_open_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_party_character_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_party_character_01.mp3"
    },
    "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_party_navigate_01.mp3": {
      "path": "sfx/ui/apartment_prototype/sfx_ui_apartment_terminal_party_navigate_01.mp3"
    },
    "sfx/ui/combat/sfx_ui_inv_auto_equip_01.mp3": {
      "path": "sfx/ui/combat/sfx_ui_inv_auto_equip_01.mp3"
    },
    "sfx/ui/combat/sfx_ui_inv_char_select_01.mp3": {
      "path": "sfx/ui/combat/sfx_ui_inv_char_select_01.mp3"
    },
    "sfx/ui/combat/sfx_ui_inv_remove_all_01.mp3": {
      "path": "sfx/ui/combat/sfx_ui_inv_remove_all_01.mp3"
    },
    "sfx/ui/combat/sfx_ui_inv_return_to_hideout_01.mp3": {
      "path": "sfx/ui/combat/sfx_ui_inv_return_to_hideout_01.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_nylon_01.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_nylon_01.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_nylon_02.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_nylon_02.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_01.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_01.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_02.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_02.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_03.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_03.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_04.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_soldier_04.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_zipper_01.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_zipper_01.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_zipper_02.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_zipper_02.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_zipper_03.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_armor_zipper_03.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_01.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_01.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_02.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_02.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_03.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_03.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_04.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_04.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_05.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_05.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_06.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_equip_weapon_06.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_unequip_armor_01.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_unequip_armor_01.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_unequip_armor_02.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_unequip_armor_02.mp3"
    },
    "sfx/ui/inventory/sfx_ui_apartment_terminal_unequip_armor_03.mp3": {
      "path": "sfx/ui/inventory/sfx_ui_apartment_terminal_unequip_armor_03.mp3"
    },
    "sfx/ui/shared/sfx_ui_gen_settings_close_01.mp3": {
      "path": "sfx/ui/shared/sfx_ui_gen_settings_close_01.mp3"
    },
    "sfx/ui/shared/sfx_ui_gen_settings_loop_01.mp3": {
      "path": "sfx/ui/shared/sfx_ui_gen_settings_loop_01.mp3"
    },
    "sfx/ui/shared/sfx_ui_gen_settings_open_01.mp3": {
      "path": "sfx/ui/shared/sfx_ui_gen_settings_open_01.mp3"
    },
    "sfx/ui/shared/sfx_ui_gen_settings_os_01.mp3": {
      "path": "sfx/ui/shared/sfx_ui_gen_settings_os_01.mp3"
    },
    "sfx/ui/shared/sfx_ui_gen_settings_os_02.mp3": {
      "path": "sfx/ui/shared/sfx_ui_gen_settings_os_02.mp3"
    },
    "sfx/ui/shared/sfx_ui_gen_settings_os_03.mp3": {
      "path": "sfx/ui/shared/sfx_ui_gen_settings_os_03.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_001_01.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_001_01.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_001_02.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_001_02.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_001_03.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_001_03.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_101_01.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_101_01.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_101_02.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_101_02.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_101_03.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_101_03.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_201_01.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_201_01.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_201_02.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_201_02.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_201_03.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_201_03.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_301_01.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_301_01.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_301_02.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_301_02.mp3"
    },
    "weapons/sfx_combat_foley_human_cloth_death_301_03.mp3": {
      "path": "weapons/sfx_combat_foley_human_cloth_death_301_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_09.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_09.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_large_10.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_large_10.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_09.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_09.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_10.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_10.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_11.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_11.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_medium_12.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_medium_12.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_ranged_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_attack_shield_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_attack_shield_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_09.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_09.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_10.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_10.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_buff_11.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_buff_11.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_large_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_large_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_large_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_large_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_large_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_large_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_large_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_large_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_large_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_large_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_large_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_large_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_large_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_large_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_medium_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_medium_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_medium_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_medium_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_medium_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_medium_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_medium_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_medium_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_medium_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_medium_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_soft_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_soft_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_soft_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_soft_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_soft_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_soft_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_soft_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_soft_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_soft_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_soft_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_death_soft_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_death_soft_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_interact_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_environmental_object_success_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_09.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_09.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_10.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_10.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_11.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_11.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_large_12.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_large_12.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_09.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_medium_09.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_09.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_09.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_hurt_small_10.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_hurt_small_10.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_06.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_06.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_07.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_07.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_08.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_08.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_09.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_kill_enemy_09.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_recover_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_recover_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_recover_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_recover_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_recover_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_recover_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_recover_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_recover_04.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_recover_05.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_recover_05.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_taunt_01.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_taunt_01.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_taunt_02.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_taunt_02.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_taunt_03.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_taunt_03.mp3"
    },
    "vo/combat_emotes/chance/vo_combat_chance_taunt_04.mp3": {
      "path": "vo/combat_emotes/chance/vo_combat_chance_taunt_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_10.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_10.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_large_11.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_large_11.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_medium_10.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_medium_10.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_10.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_10.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_11.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_11.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_12.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_12.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_13.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_ranged_13.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_shield_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_shield_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_shield_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_shield_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_shield_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_shield_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_shield_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_shield_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_shield_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_shield_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_attack_shield_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_attack_shield_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_10.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_10.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_buff_11.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_buff_11.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_large_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_large_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_large_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_large_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_large_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_large_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_large_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_large_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_large_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_large_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_medium_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_medium_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_medium_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_medium_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_medium_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_medium_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_medium_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_medium_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_soft_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_soft_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_soft_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_soft_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_soft_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_soft_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_death_soft_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_death_soft_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_interact_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_environmental_object_success_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_10.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_10.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_11.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_11.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_large_12.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_large_12.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_medium_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_10.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_10.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_hurt_small_11.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_hurt_small_11.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_kill_enemy_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_recover_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_recover_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_recover_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_recover_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_recover_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_recover_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_recover_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_recover_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_recover_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_recover_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_recover_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_recover_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_recover_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_recover_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_01.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_01.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_02.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_02.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_03.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_03.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_04.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_04.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_05.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_05.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_06.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_06.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_07.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_07.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_08.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_08.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_09.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_09.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_10.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_10.mp3"
    },
    "vo/combat_emotes/friction/vo_combat_friction_taunt_11.mp3": {
      "path": "vo/combat_emotes/friction/vo_combat_friction_taunt_11.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_06.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_06.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_07.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_07.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_08.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_08.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_09.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_09.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_10.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_10.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_11.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_11.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_large_12.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_large_12.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_medium_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_medium_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_medium_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_medium_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_medium_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_medium_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_medium_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_medium_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_medium_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_medium_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_medium_06.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_medium_06.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_medium_07.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_medium_07.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_06.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_06.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_07.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_07.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_08.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_08.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_09.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_09.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_rare_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_rare_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_rare_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_ranged_rare_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_shield_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_shield_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_shield_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_shield_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_shield_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_shield_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_attack_shield_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_attack_shield_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_buff_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_buff_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_buff_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_buff_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_buff_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_buff_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_buff_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_buff_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_buff_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_buff_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_large_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_large_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_large_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_large_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_large_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_large_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_large_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_large_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_medium_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_medium_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_medium_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_medium_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_medium_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_medium_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_medium_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_medium_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_soft_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_soft_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_soft_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_soft_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_death_soft_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_death_soft_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_06.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_06.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_07.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_07.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_08.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_08.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_large_09.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_large_09.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_06.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_06.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_07.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_07.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_hurt_small_08.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_hurt_small_08.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_06.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_kill_enemy_06.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_recover_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_recover_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_recover_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_recover_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_recover_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_recover_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_recover_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_recover_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_recover_05.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_recover_05.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_taunt_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_taunt_01.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_taunt_02.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_taunt_02.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_taunt_03.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_taunt_03.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_taunt_04.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_taunt_04.mp3"
    },
    "vo/combat_emotes/routine/vo_combat_routine_taunt_rare_01.mp3": {
      "path": "vo/combat_emotes/routine/vo_combat_routine_taunt_rare_01.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0011_0010_hacker.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0011_0010_hacker.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0011_0020_hacker.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0011_0020_hacker.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0041_0010_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0041_0010_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0041_0020_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0041_0020_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0041_0030_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0041_0030_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0042_0010_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0042_0010_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0042_0020_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0042_0020_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0042_0030_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0042_0030_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0042_0040_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0042_0040_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0043_0010_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0043_0010_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0043_0020_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0043_0020_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0043_0030_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0043_0030_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0043_0031_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0043_0031_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0043_0032_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0043_0032_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0043_0040_SZAS.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0043_0040_SZAS.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0061_0010_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0061_0010_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0061_0020_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0061_0020_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0061_0030_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0061_0030_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0061_0040_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0061_0040_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0062_0010_hacker.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0062_0010_hacker.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0062_0020_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0062_0020_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0062_0030_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0062_0030_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0062_0040_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0062_0040_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0071_0010_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0071_0010_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0071_0011_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0071_0011_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0071_0030_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0071_0030_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0071_0040_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0071_0040_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0071_0050_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0071_0050_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0071_0060_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0071_0060_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0072_0010_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0072_0010_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0072_0020_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0072_0020_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0072_0030_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0072_0030_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0072_0040_chance.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0072_0040_chance.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0072_0050_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0072_0050_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0072_0060_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0072_0060_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0010_bighitter1.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0010_bighitter1.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0020_bighitter2.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0020_bighitter2.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0030_chance.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0030_chance.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0040_chance.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0040_chance.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0050_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0050_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0060_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0060_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0070_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0070_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0080_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0080_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0073_0090_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0073_0090_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0082_0010_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0082_0010_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0082_0020_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0082_0020_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0082_0030_friction.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0082_0030_friction.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0082_0040_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0082_0040_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0082_0050_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0082_0050_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0082_0060_friction.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0082_0060_friction.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0082_0070_chance.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0082_0070_chance.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0083_0010_corpgenius.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0083_0010_corpgenius.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0083_0020_corpgenius.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0083_0020_corpgenius.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0083_0030_corpgenius.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0083_0030_corpgenius.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0083_0040_eternity.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0083_0040_eternity.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0083_0050_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0083_0050_routine.mp3"
    },
    "vo/season_0/combat_dialogue/vo_0084_0010_routine.mp3": {
      "path": "vo/season_0/combat_dialogue/vo_0084_0010_routine.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0030_hideout_intro.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0030_hideout_intro.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0040_tat_training.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0040_tat_training.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0050_player_registration.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0050_player_registration.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0060_mission_start.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0060_mission_start.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0070_adding_routine.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0070_adding_routine.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0080_gearing_up_adding_friction.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0080_gearing_up_adding_friction.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0080_gearing_up_adding_friction_page_1.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0080_gearing_up_adding_friction_page_1.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0080_gearing_up_adding_friction_page_2.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0080_gearing_up_adding_friction_page_2.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0081_gearing_up_adding_friction_post_inventory.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0081_gearing_up_adding_friction_post_inventory.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_no_PS.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_no_PS.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_PS_01.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_PS_01.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_PS_02.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_PS_02.mp3"
    },
    "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_PS_03.mp3": {
      "path": "vo/season_0/interstitials/vo_season_0_0100_note_from_eternity_PS_03.mp3"
    }
  }
};

var ALL_MUSIC_OPTIONS = [{
  key: 'aspire-combat-loop',
  name: 'ND Combat Theme',
  volume: 0.15
}, {
  key: 'bt-laurel-canyon-loop',
  name: 'Laurel Canyon Night Drive (Day) - BT',
  volume: 0.70
}, {
  key: 'bt-laurel-canyon-night-loop',
  name: 'Laurel Canyon Night Drive (Night) - BT',
  volume: 0.70
}, {
  key: 'bt-laurel-canyon-lunar-loop',
  name: 'Laurel Canyon Night Drive (Lunar) - BT',
  volume: 0.70
}];

var SoundManager = function () {
  function SoundManager(perks) {
    classCallCheck(this, SoundManager);

    this.activeSounds = [];

    this.musicOptions = [ALL_MUSIC_OPTIONS[0]];

    if (perks && Array.isArray(perks) && perks.length) {
      for (var perkIdx = 0; perkIdx < perks.length; perkIdx++) {
        for (var idx = 1; idx < ALL_MUSIC_OPTIONS.length; idx++) {
          if (ALL_MUSIC_OPTIONS[idx].key === perks[perkIdx]) {
            this.musicOptions.push(ALL_MUSIC_OPTIONS[idx]);
          }
        }
      }
    }
  }

  createClass(SoundManager, [{
    key: "getMusicOptions",
    value: function getMusicOptions() {
      return [].concat(toConsumableArray(this.musicOptions));
    }
  }, {
    key: "hasSound",
    value: function hasSound(category, tag) {
      return soundEffects.hasOwnProperty(category) && soundEffects[category].hasOwnProperty(tag);
    }
  }, {
    key: "play",
    value: function play(category, tag, volume) {
      var loop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (this.hasSound(category, tag)) {
        var sound = new SoundClip(soundEffects[category][tag].path, volume, loop);
        sound.play();
        this.activeSounds.push(sound);
        return sound;
      }
    }
  }, {
    key: "stop",
    value: function stop(category, tag) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.activeSounds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var sound = _step.value;

          if (sound.getPath() === soundEffects[category][tag].path) {
            sound.stop();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "cleanUpAudio",
    value: function cleanUpAudio() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.activeSounds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var sound = _step2.value;

          sound.cleanUpAudio();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.activeSounds = [];
    }
  }]);
  return SoundManager;
}();

var CombatScene = function (_Stage) {
  inherits(CombatScene, _Stage);

  function CombatScene(props) {
    classCallCheck(this, CombatScene);

    var _this = possibleConstructorReturn(this, (CombatScene.__proto__ || Object.getPrototypeOf(CombatScene)).call(this, props));

    _this.background = props.background;
    _this.characters = props.characters || [];

    // Specifically for effects tests
    _this.effectTest = props.effectTest;

    // Sounds
    _this.soundManager = new SoundManager(props.perks && props.perks.music);

    // Internal objects
    _this.animationController = null;
    return _this;
  }

  createClass(CombatScene, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      get(CombatScene.prototype.__proto__ || Object.getPrototypeOf(CombatScene.prototype), "componentDidMount", this).call(this, arguments);

      // Initialize the animation controller
      this.animationController = new AnimationController(this.characters, this.effects, this.soundManager);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      get(CombatScene.prototype.__proto__ || Object.getPrototypeOf(CombatScene.prototype), "componentWillUnmount", this).call(this, arguments);

      console.log("Clean up videos.");
      for (var key in this.effects) {
        this.effects[key].cleanUpAfterVideo();
      }

      console.log("Clean up audio.");
      this.soundManager.cleanUpAudio();
    }
  }, {
    key: "renderAdditionalScenes",
    value: function renderAdditionalScenes(delta) {
      // Render the game HUD
      if (this.userInterface) {
        this.animationController.update(delta);
        this.userInterface.update(delta);
      }
    }
  }, {
    key: "runAnimationEventCycle",
    value: function runAnimationEventCycle(block, callback) {
      this.animationController.run(block, callback);
    }
  }]);
  return CombatScene;
}(Stage);

var HUDComponent = function (_Component) {
  inherits(HUDComponent, _Component);

  function HUDComponent(props) {
    classCallCheck(this, HUDComponent);

    var _this = possibleConstructorReturn(this, (HUDComponent.__proto__ || Object.getPrototypeOf(HUDComponent)).call(this, props));

    _this.activeAnimEvt = props.activeAnimEvt;
    _this.hudLocked = true;
    _this.battleComplete = false;
    _this.battleCompleteWinner = null;
    _this.playerSelections = null;
    _this.needsUpdate = true;

    window.addEventListener('clickableRegionsLocked', _this.handleHUDLocked.bind(_this));
    window.addEventListener('clickableRegionsUnlocked', _this.handleHUDUnlocked.bind(_this));
    window.addEventListener('battleComplete', _this.handleBattleComplete.bind(_this));
    return _this;
  }

  createClass(HUDComponent, [{
    key: 'getActivePlayer',
    value: function getActivePlayer() {
      if (!this.props.units || this.props.units.length === 0) {
        return {};
      }

      return this.props.units.reduce(function (acc, curr) {
        if (!acc) return curr;
        if (curr.stats.HEALTH <= 0) return acc;
        if (acc.state === 'UNCONSCIOUS') return curr;
        if (acc.ticks < curr.ticks) return acc;
        if (acc.ticks == curr.ticks) {
          if (acc.lastTurnOrder < curr.lastTurnOrder) return acc;
          return curr;
        }
        return curr;
      });
    }
  }, {
    key: 'getTarget',
    value: function getTarget() {
      for (var _idx in this.props.units) {
        if (this.props.units[_idx].unitId === this.props.playerSelections.getTarget()) {
          return this.props.units[_idx];
        }
      }
    }
  }, {
    key: 'setPlayerSelectionsObject',
    value: function setPlayerSelectionsObject(playerSelections) {
      this.playerSelections = playerSelections;
    }
  }, {
    key: 'handleHUDLocked',
    value: function handleHUDLocked() {
      this.hudLocked = true;
    }
  }, {
    key: 'handleHUDUnlocked',
    value: function handleHUDUnlocked() {
      this.hudLocked = false;
    }
  }, {
    key: 'handleBattleComplete',
    value: function handleBattleComplete(e) {
      this.battleComplete = true;
      if (e && e.detail && e.detail.winner) {
        this.battleCompleteWinner = e.detail.winner;
      }
    }
  }, {
    key: 'preUpdate',
    value: function preUpdate(delta) {
      return this.needsUpdate;
    }
  }, {
    key: 'update',
    value: function update(delta) {
      // Placeholder
    }
  }, {
    key: 'roundRect',
    value: function roundRect(x, y, width, height, radius, fill, stroke) {
      if (typeof stroke == 'undefined') {
        stroke = true;
      }
      if (typeof radius === 'undefined') {
        radius = 5;
      }
      if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }

      this.context.beginPath();
      this.context.moveTo(x + radius.tl, y);
      this.context.lineTo(x + width - radius.tr, y);
      this.context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      this.context.lineTo(x + width, y + height - radius.br);
      this.context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      this.context.lineTo(x + radius.bl, y + height);
      this.context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      this.context.lineTo(x, y + radius.tl);
      this.context.quadraticCurveTo(x, y, x + radius.tl, y);
      this.context.closePath();

      if (stroke) {
        this.context.stroke();
      }

      if (fill) {
        this.context.fill();
      }
    }
  }, {
    key: 'getLines',
    value: function getLines(text, maxWidth) {
      if (!text || typeof text !== 'string') {
        return [];
      }

      var words = text.split(" ");
      var lines = [];
      var currentLine = words[0];

      for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = this.context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }
  }, {
    key: 'getTypePrimaryColor',
    value: function getTypePrimaryColor(type) {
      switch (type) {
        case 'ABILITY':
          return HUDSTYLES.colors.green;
        case 'ATTACK':
          return HUDSTYLES.colors.red;
        case 'EFFECT':
          return HUDSTYLES.colors.yellow;
        case 'INTERACT':
          return HUDSTYLES.colors.neonBlue;
        default:
          return HUDSTYLES.colors.darkGray;
      }
    }
  }, {
    key: 'getTypeDesaturatedPrimaryColor',
    value: function getTypeDesaturatedPrimaryColor(type) {
      switch (type) {
        case 'ABILITY':
          return HUDSTYLES.colors.desaturatedGreen;
        case 'ATTACK':
          return HUDSTYLES.colors.desaturatedRed;
        case 'EFFECT':
          return HUDSTYLES.colors.desaturatedYellow;
        case 'INTERACT':
          return HUDSTYLES.colors.desaturatedNeonBlue;
        default:
          return HUDSTYLES.colors.halfGray;
      }
    }
  }, {
    key: 'getTypeTransparentPrimaryColor',
    value: function getTypeTransparentPrimaryColor(type) {
      switch (type) {
        case 'ABILITY':
          return HUDSTYLES.colors.transparentGreen;
        case 'ATTACK':
          return HUDSTYLES.colors.transparentRed;
        case 'EFFECT':
          return HUDSTYLES.colors.transparentYellow;
        case 'INTERACT':
          return HUDSTYLES.colors.transparentNeonBlue;
        default:
          return HUDSTYLES.colors.darkGray;
      }
    }
  }]);
  return HUDComponent;
}(React.Component);

var css$1 = "/* Card Specific */\n@import url(\"https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600&display=swap\");\n.hud_playerControlsWrapper__3GT6K .hud_playerRegion__11Rie {\n  order: 1;\n  flex: 9;\n  margin: 6px 18px;\n  padding: 0; }\n  .hud_playerControlsWrapper__3GT6K .hud_playerRegion__11Rie .hud_topBorder__3WDI3 {\n    margin: 12px 0 0 0;\n    border-bottom: 2px solid #252525; }\n  .hud_playerControlsWrapper__3GT6K .hud_playerRegion__11Rie.hud_bottomBorder__2q21C {\n    border-bottom: 2px solid #252525; }\n  .hud_playerControlsWrapper__3GT6K .hud_playerRegion__11Rie .hud_playerControls__3HUbk {\n    margin: 0px 0px 6px 0px;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    justify-content: space-evenly;\n    align-items: stretch; }\n    .hud_playerControlsWrapper__3GT6K .hud_playerRegion__11Rie .hud_playerControls__3HUbk .hud_activeCharacter__3xgL5 {\n      flex-basis: 17.5%;\n      padding: 3px; }\n    .hud_playerControlsWrapper__3GT6K .hud_playerRegion__11Rie .hud_playerControls__3HUbk .hud_defaultSelections__3Lz70 {\n      background-color: #252525;\n      padding: 5px;\n      margin: 3px;\n      flex-basis: 20%; }\n    .hud_playerControlsWrapper__3GT6K .hud_playerRegion__11Rie .hud_playerControls__3HUbk .hud_cardWrapper__3rHTR {\n      background-color: #252525;\n      padding: 5px;\n      margin: 3px;\n      flex-basis: 62.5%;\n      display: flex;\n      flex-direction: row;\n      flex-wrap: nowrap;\n      justify-content: space-around;\n      align-items: stretch; }\n\n.hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB {\n  margin: 5px;\n  padding: 6px;\n  width: calc(100% - 22px);\n  height: calc(100% - 22px); }\n  .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB:hover {\n    box-shadow: 0px 0px 4px 1px rgba(255, 255, 255, 0.3);\n    border-radius: 6px; }\n  .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB.hud_selected__2SqTV {\n    border-radius: 6px;\n    box-shadow: 0px 0px 4px 1px #ffffff; }\n  .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN {\n    width: calc(100% - 12px);\n    height: calc(100% - 12px);\n    border-radius: 4px;\n    box-shadow: 0px 0px 6px 1px #000000;\n    padding: 2px;\n    font: 7pt kozuka-gothic-pr6n-bold;\n    text-transform: none;\n    text-shadow: none;\n    text-align: center; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_baseAttack__Ji92f {\n      border: 1px solid #ff002f;\n      width: calc(100% - 6px);\n      height: calc(100% - 6px); }\n      .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_baseAttack__Ji92f .hud_baseAttackImg__yJAr6 {\n        position: relative;\n        top: 17.5%;\n        width: 40%; }\n      .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_baseAttack__Ji92f .hud_baseAttackTitle__2DVHo {\n        position: relative;\n        top: 12.5%;\n        text-transform: uppercase;\n        font-size: 150%;\n        color: #ff002f; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_attackCard__1hj4X {\n      border: 4px solid #ff002f; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_abilityCard__3s7S7 {\n      border: 4px solid #40be90; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_effectCard__1HmI7 {\n      border: 4px solid #F4D360; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_interactCard__3zXVb {\n      border: 4px solid #50F7E1;\n      color: #888888; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_fillerCard__3fykV {\n      border: 4px solid #252525;\n      color: #888888; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN.hud_backCard__1ZmCn {\n      border: 4px solid #812B88;\n      background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/nd-logo.png\");\n      background-position: center center;\n      background-size: 75%;\n      background-repeat: no-repeat; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN div.hud_cardTopRow__1RKQZ {\n      display: flex;\n      flex-direction: row;\n      flex-wrap: nowrap;\n      justify-content: space-evenly;\n      align-items: stretch; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTitle__1aAQu {\n      padding: 0;\n      margin: 0;\n      text-align: center;\n      line-height: 1.5em;\n      flex-basis: 65%;\n      font-size: 1.2em; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti {\n      display: block;\n      position: relative;\n      top: 0;\n      right: 3px;\n      text-align: center;\n      font-size: 125%;\n      padding: 0;\n      padding: 0;\n      margin: 0;\n      flex-basis: 15%; }\n      .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti .hud_cardTicksNumber__HqIbn {\n        display: block;\n        margin: 0;\n        position: absolute;\n        top: -3px;\n        right: 2px; }\n      .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti hr.hud_cardTicksLine__1d3F9 {\n        position: absolute;\n        top: 12px;\n        right: -1px;\n        width: 18px; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti hr.hud_cardTicksLine__1d3F9.hud_baseAttack__Ji92f {\n          border: 1px solid #ff002f; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti hr.hud_cardTicksLine__1d3F9.hud_attackCard__1hj4X {\n          border: 1px solid #ff002f; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti hr.hud_cardTicksLine__1d3F9.hud_abilityCard__3s7S7 {\n          border: 1px solid #40be90; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti hr.hud_cardTicksLine__1d3F9.hud_effectCard__1HmI7 {\n          border: 1px solid #F4D360; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti hr.hud_cardTicksLine__1d3F9.hud_interactCard__3zXVb {\n          border: 1px solid #0AF5F7; }\n      .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardTicks__jtgti .hud_cardTicksLabel__3KYhe {\n        position: absolute;\n        top: 17px;\n        right: -1px;\n        padding: 0;\n        margin: 0;\n        font-size: 75%;\n        text-transform: uppercase; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardEffects__27Jy7,\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN .hud_cardExploits__DxOhq {\n      margin: 15px 2px;\n      text-align: center;\n      font: 7.5pt kozuka-gothic-pr6n;\n      line-height: 1.5em; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN div.hud_cardTypeWrapper__H2bi3 {\n      flex-basis: 15%; }\n      .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN div.hud_cardTypeWrapper__H2bi3 span.hud_cardType__3uliB {\n        position: relative;\n        top: 0;\n        left: 3px;\n        display: block;\n        width: 20px;\n        height: 20px; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN div.hud_cardTypeWrapper__H2bi3 span.hud_cardType__3uliB.hud_abilityCardType__2sWzR {\n          background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Hack.png\");\n          background-size: 20px 20px; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN div.hud_cardTypeWrapper__H2bi3 span.hud_cardType__3uliB.hud_attackCardType__3sXYd {\n          background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Attack.png\");\n          background-size: 20px 20px; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN div.hud_cardTypeWrapper__H2bi3 span.hud_cardType__3uliB.hud_effectCardType__1mwKr {\n          background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Effect.png\");\n          background-size: 20px 20px; }\n        .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_card__2ADHN div.hud_cardTypeWrapper__H2bi3 span.hud_cardType__3uliB.hud_interactCardType__Cz02d {\n          background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Interact.png\");\n          background-size: 20px 20px; }\n  .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_replaceButtonWrapper__1ncGD {\n    z-index: 100;\n    display: block;\n    position: relative;\n    width: 26px;\n    height: 26px;\n    left: calc(50% - 13px);\n    bottom: 13px;\n    padding: 0px;\n    margin: 0px;\n    border-radius: 13px;\n    background-color: #FF365C;\n    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.5);\n    transition: all 0.3s ease;\n    overflow: hidden;\n    white-space: nowrap;\n    cursor: pointer; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_replaceButtonWrapper__1ncGD .hud_replaceButton__ac8H_ {\n      display: inline-block;\n      width: 26px;\n      height: 26px;\n      padding: 0px;\n      margin: 0px;\n      box-sizing: border-box;\n      border-width: 3px;\n      border-style: solid;\n      border-color: #FF365C;\n      border-radius: 100%;\n      background: -webkit-linear-gradient(-45deg, transparent 0%, transparent 46%, white 46%, white 56%, transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%, white 46%, white 56%, transparent 56%, transparent 100%);\n      background-color: #FF365C;\n      box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.5);\n      transition: all 0.3s ease; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_replaceButtonWrapper__1ncGD .hud_replaceText__1fvG4 {\n      display: none;\n      position: relative;\n      top: calc(50% - 1em);\n      right: 0.5em; }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_replaceButtonWrapper__1ncGD:hover {\n      width: 50%;\n      left: calc(25%); }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_replaceButtonWrapper__1ncGD:hover .hud_replaceButton__ac8H_ {\n      transform: rotate(90deg); }\n    .hud_playerControlsWrapper__3GT6K .hud_cardSelectionWrapper__33CGB .hud_replaceButtonWrapper__1ncGD:hover .hud_replaceText__1fvG4 {\n      float: right;\n      display: inline; }\n\n.hud_playerControlsWrapper__3GT6K .hud_targetRegion__RW2NY {\n  order: 2;\n  flex: 4;\n  margin: 6px 18px;\n  padding: 0; }\n  .hud_playerControlsWrapper__3GT6K .hud_targetRegion__RW2NY .hud_topBorder__3WDI3 {\n    margin: 12px 0 0 0;\n    border-bottom: 2px solid #FF365C; }\n  .hud_playerControlsWrapper__3GT6K .hud_targetRegion__RW2NY.hud_bottomBorder__2q21C {\n    border-bottom: 2px solid #FF365C; }\n\n.hud_playerControlsWrapper__3GT6K .hud_targetControls__2Fokg {\n  margin: 0px 0px 6px 0px;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-evenly;\n  align-items: stretch; }\n  .hud_playerControlsWrapper__3GT6K .hud_targetControls__2Fokg .hud_activeCharacter__3xgL5 {\n    flex-basis: 35%;\n    padding: 3px; }\n\n.hud_playerControlsWrapper__3GT6K .hud_characterProfile__1ItNY {\n  height: 100%;\n  display: block;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  align-items: stretch;\n  /* Hack to hide the white border around an img without a src */ }\n  .hud_playerControlsWrapper__3GT6K .hud_characterProfile__1ItNY img {\n    width: 100%;\n    border: 0px;\n    display: block; }\n    .hud_playerControlsWrapper__3GT6K .hud_characterProfile__1ItNY img.hud_flipHorizontal__3B7-Y {\n      transform: scaleX(-1); }\n    .hud_playerControlsWrapper__3GT6K .hud_characterProfile__1ItNY img.hud_playerProfile__1ga3L {\n      background: linear-gradient(180deg, #242424, #3f5858); }\n    .hud_playerControlsWrapper__3GT6K .hud_characterProfile__1ItNY img.hud_targetProfile__1naJ4 {\n      background: linear-gradient(180deg, #242424, #4f2830); }\n  .hud_playerControlsWrapper__3GT6K .hud_characterProfile__1ItNY img:not([src]) {\n    content: url(\"data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"); }\n  .hud_playerControlsWrapper__3GT6K .hud_characterProfile__1ItNY .hud_characterName__Z2ptE {\n    max-width: 100%;\n    padding: 4px 8px;\n    border: 1px solid white;\n    background-color: #252525; }\n\n.hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL {\n  flex: 3;\n  padding: 3px;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: nowrap;\n  justify-content: center;\n  align-items: stretch; }\n  .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetCharacterStats__2LFD5 {\n    padding: 8px 8px; }\n    .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetCharacterStats__2LFD5 .hud_targetCharacterStatsHeader__4eH4p {\n      color: #0AF5F7;\n      font-size: 8pt;\n      font-style: italic;\n      text-shadow: 0px 0px 10px #0AF5F7;\n      padding: 0 8px;\n      border-bottom: 2px solid #888888; }\n    .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetCharacterStats__2LFD5 .hud_targetCharacterStatsBody__C3a3m {\n      padding: 8px;\n      display: flex;\n      flex-direction: row;\n      flex-wrap: wrap;\n      justify-content: center;\n      align-items: center;\n      text-align: center;\n      text-shadow: 0px 0px 0px; }\n      .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetCharacterStats__2LFD5 .hud_targetCharacterStatsBody__C3a3m .hud_attribute__3_UeU {\n        flex-basis: 25%; }\n        .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetCharacterStats__2LFD5 .hud_targetCharacterStatsBody__C3a3m .hud_attribute__3_UeU .hud_attributeValue___oCWu {\n          font-size: 10pt;\n          text-align: center; }\n        .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetCharacterStats__2LFD5 .hud_targetCharacterStatsBody__C3a3m .hud_attribute__3_UeU .hud_attributeName__3e_QQ {\n          font-size: 7pt;\n          color: #888888; }\n  .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetButtons__1RWCm {\n    width: 100%; }\n    .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetButtons__1RWCm .hud_confirmButton__cmqyU {\n      float: right;\n      font: 10pt kozuka-gothic-pr6n-bold;\n      text-transform: uppercase;\n      color: white;\n      padding: 4px 16px;\n      border: 1px solid white;\n      background-color: #252525; }\n      .hud_playerControlsWrapper__3GT6K .hud_targetCharacterControls__3hdxL .hud_targetButtons__1RWCm .hud_confirmButton__cmqyU:disabled {\n        border: 1px solid #888888;\n        color: #888888; }\n\n.hud_healthBarOuter__1iu6U {\n  display: block;\n  position: absolute;\n  width: 80px;\n  height: 5px;\n  background-color: rgba(255, 0, 47, 0.4); }\n  .hud_healthBarOuter__1iu6U .hud_healthBarFill__3acmn {\n    background-color: #FF365C;\n    overflow: hidden;\n    position: relative;\n    height: 100%;\n    display: block; }\n\n.hud_statusEffects__3zSJh {\n  display: block;\n  position: absolute; }\n  .hud_statusEffects__3zSJh .hud_statusEffect__hrtcE {\n    height: 16px;\n    width: 16px;\n    display: none;\n    margin: 0px 2px; }\n    .hud_statusEffects__3zSJh .hud_statusEffect__hrtcE.hud_visible__2C7zr {\n      display: inline-block; }\n    .hud_statusEffects__3zSJh .hud_statusEffect__hrtcE.hud_statusEffectPoison__C7EVN {\n      background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Poison.png\");\n      background-size: contain;\n      background-position: center;\n      background-repeat: no-repeat; }\n    .hud_statusEffects__3zSJh .hud_statusEffect__hrtcE.hud_statusEffectRegenerate__2A2UV {\n      background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Regeneration.png\");\n      background-size: contain;\n      background-position: center;\n      background-repeat: no-repeat; }\n    .hud_statusEffects__3zSJh .hud_statusEffect__hrtcE.hud_statusEffectShield__1EGEs {\n      background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Shield.png\");\n      background-size: contain;\n      background-position: center;\n      background-repeat: no-repeat; }\n    .hud_statusEffects__3zSJh .hud_statusEffect__hrtcE.hud_statusEffectTaunt__3bHct {\n      background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Taunt.png\");\n      background-size: contain;\n      background-position: center;\n      background-repeat: no-repeat; }\n    .hud_statusEffects__3zSJh .hud_statusEffect__hrtcE.hud_statusEffectCounterattack__xmv_- {\n      background: url(\"https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Counterattack.png\");\n      background-size: contain;\n      background-position: center;\n      background-repeat: no-repeat; }\n\n.hud_unitStatusUpdates__2ZXFS {\n  display: block;\n  position: absolute;\n  font: 12pt kozuka-gothic-pr6n-bold;\n  color: white;\n  text-align: center;\n  text-shadow: 0px 0px 2px #000000;\n  cursor: default; }\n  .hud_unitStatusUpdates__2ZXFS .hud_unitStatusUpdateTicks__1bYCt {\n    color: #50F7E1; }\n  .hud_unitStatusUpdates__2ZXFS .hud_unitStatusUpdateRed__3NLp- {\n    color: #FF365C; }\n  .hud_unitStatusUpdates__2ZXFS .hud_unitStatusUpdateGreen__39qLj {\n    color: #46C59C; }\n\n.hud_targetCharacterStats__2LFD5 .hud_statusEffects__3zSJh {\n  right: 30px; }\n\n.hud_characterTicksRingOuter__2syJr {\n  display: block;\n  position: absolute; }\n  .hud_characterTicksRingOuter__2syJr .hud_characterTicksRingBackfill__2opC0 {\n    stroke: rgba(255, 94, 124, 0.2); }\n  .hud_characterTicksRingOuter__2syJr .hud_characterTicksRingFill__2mOTu {\n    stroke: \"#FF5E7C\"; }\n\n.hud_turnOrderDisplay__2XwBO {\n  box-sizing: unset;\n  display: block;\n  position: absolute;\n  top: 10px;\n  margin: auto;\n  max-width: 100%;\n  cursor: default; }\n  .hud_turnOrderDisplay__2XwBO .hud_unitTurnOrderPortrait__2Byr5 {\n    display: inline-block;\n    position: relative;\n    top: 0;\n    -webkit-clip-path: polygon(12.5% 0, 100% 0, 87.5% 100%, 0% 100%);\n    clip-path: polygon(12.5% 0, 100% 0, 87.5% 100%, 0% 100%);\n    width: 80px;\n    height: 80px;\n    background-color: #252525; }\n    .hud_turnOrderDisplay__2XwBO .hud_unitTurnOrderPortrait__2Byr5 .hud_unitTurnOrderPortraitImage__3_rcM {\n      width: 100%;\n      height: 100%;\n      display: block;\n      background-size: 90% 90%;\n      background-position: bottom center;\n      background-repeat: no-repeat; }\n      .hud_turnOrderDisplay__2XwBO .hud_unitTurnOrderPortrait__2Byr5 .hud_unitTurnOrderPortraitImage__3_rcM.hud_flipHorizontal__3B7-Y {\n        transform: scaleX(-1); }\n    .hud_turnOrderDisplay__2XwBO .hud_unitTurnOrderPortrait__2Byr5 .hud_unitTurnOrderTicks__3xRL5 {\n      position: absolute;\n      top: 3px;\n      right: 0px;\n      text-align: right;\n      color: #0AF5F7;\n      font-size: 9pt;\n      text-shadow: 0px 0px 10px #0AF5F7;\n      padding: 0 8px; }\n\n.hud_errorDisplay__3wfwP {\n  display: block;\n  position: absolute;\n  bottom: 33%;\n  right: 2%;\n  width: 300px;\n  height: 60px;\n  cursor: default;\n  background: #252525;\n  border: 3px solid #FF365C;\n  border-radius: 8px;\n  font: 10pt kozuka-gothic-pr6n-bold;\n  text-align: center;\n  padding: 10px;\n  line-height: 1.5em;\n  opacity: 0; }\n  .hud_errorDisplay__3wfwP.hud_playAnimation__A7xhU {\n    animation: hud_fade-in-and-out__1F6yx 3s; }\n\n@keyframes hud_fade-in-and-out__1F6yx {\n  0% {\n    opacity: 0; }\n  15% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n.hud_versionDisplayWrapper__3REyP {\n  font: 7.5pt kozuka-gothic-pr6n-bold;\n  text-transform: uppercase;\n  padding: 0px;\n  margin: 5px;\n  opacity: 0.5;\n  cursor: default;\n  line-height: 1.5em; }\n\n.hud_settingsDisplayWrapper__13L8U {\n  font: 7.5pt kozuka-gothic-pr6n-bold;\n  opacity: 0.5;\n  cursor: default;\n  line-height: 2.5em;\n  position: absolute;\n  top: 0;\n  right: 0; }\n\n.hud_settingsDisplayWrapper__13L8U > .hud_settingSet__2axlJ {\n  font-size: 12pt;\n  margin: 5px;\n  padding: 1px;\n  background-color: grey;\n  border-radius: 0.25rem; }\n\n.hud_settingSet__2axlJ {\n  align-items: stretch;\n  box-sizing: border-box;\n  color: #212529;\n  display: flex;\n  flex-wrap: wrap;\n  line-height: 24px;\n  position: relative;\n  text-align: left;\n  text-size-adjust: 100%;\n  -webkit-box-align: stretch;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }\n\n.hud_settingSetGroupPrepend__1xMuN {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #212529;\n  text-align: left;\n  box-sizing: border-box;\n  display: flex;\n  margin-right: -1px; }\n\n.hud_settingSetGroupButton__2-85s {\n  display: inline-block;\n  font-size: 14pt;\n  font-weight: 400;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  border: 1px solid transparent;\n  line-height: 1.5;\n  border-radius: 0.25rem;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n  color: #6c757d;\n  background-color: transparent;\n  background-image: none;\n  border-color: #6c757d;\n  -webkit-appearance: button;\n  position: relative;\n  z-index: 2;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  cursor: pointer; }\n\n.hud_settingSetGroupSelect__3_Q6p {\n  font-size: 10pt;\n  font-family: kozuka-gothic-pr6n-bold;\n  box-sizing: border-box;\n  margin: 0;\n  width: 300px;\n  text-transform: none;\n  display: inline-block;\n  padding: 0 0.75rem;\n  line-height: 1.5;\n  color: #495057;\n  vertical-align: middle;\n  background: #fff url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E\") no-repeat right 0.75rem center;\n  background-size: 8px 10px;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n  appearance: none;\n  position: relative;\n  -webkit-box-flex: 1;\n  flex: 1 1 auto;\n  margin-bottom: 0;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0; }\n";
var lstyle$1 = { "playerControlsWrapper": "hud_playerControlsWrapper__3GT6K", "playerRegion": "hud_playerRegion__11Rie", "topBorder": "hud_topBorder__3WDI3", "bottomBorder": "hud_bottomBorder__2q21C", "playerControls": "hud_playerControls__3HUbk", "activeCharacter": "hud_activeCharacter__3xgL5", "defaultSelections": "hud_defaultSelections__3Lz70", "cardWrapper": "hud_cardWrapper__3rHTR", "cardSelectionWrapper": "hud_cardSelectionWrapper__33CGB", "selected": "hud_selected__2SqTV", "card": "hud_card__2ADHN", "baseAttack": "hud_baseAttack__Ji92f", "baseAttackImg": "hud_baseAttackImg__yJAr6", "baseAttackTitle": "hud_baseAttackTitle__2DVHo", "attackCard": "hud_attackCard__1hj4X", "abilityCard": "hud_abilityCard__3s7S7", "effectCard": "hud_effectCard__1HmI7", "interactCard": "hud_interactCard__3zXVb", "fillerCard": "hud_fillerCard__3fykV", "backCard": "hud_backCard__1ZmCn", "cardTopRow": "hud_cardTopRow__1RKQZ", "cardTitle": "hud_cardTitle__1aAQu", "cardTicks": "hud_cardTicks__jtgti", "cardTicksNumber": "hud_cardTicksNumber__HqIbn", "cardTicksLine": "hud_cardTicksLine__1d3F9", "cardTicksLabel": "hud_cardTicksLabel__3KYhe", "cardEffects": "hud_cardEffects__27Jy7", "cardExploits": "hud_cardExploits__DxOhq", "cardTypeWrapper": "hud_cardTypeWrapper__H2bi3", "cardType": "hud_cardType__3uliB", "abilityCardType": "hud_abilityCardType__2sWzR", "attackCardType": "hud_attackCardType__3sXYd", "effectCardType": "hud_effectCardType__1mwKr", "interactCardType": "hud_interactCardType__Cz02d", "replaceButtonWrapper": "hud_replaceButtonWrapper__1ncGD", "replaceButton": "hud_replaceButton__ac8H_", "replaceText": "hud_replaceText__1fvG4", "targetRegion": "hud_targetRegion__RW2NY", "targetControls": "hud_targetControls__2Fokg", "characterProfile": "hud_characterProfile__1ItNY", "flipHorizontal": "hud_flipHorizontal__3B7-Y", "playerProfile": "hud_playerProfile__1ga3L", "targetProfile": "hud_targetProfile__1naJ4", "characterName": "hud_characterName__Z2ptE", "targetCharacterControls": "hud_targetCharacterControls__3hdxL", "targetCharacterStats": "hud_targetCharacterStats__2LFD5", "targetCharacterStatsHeader": "hud_targetCharacterStatsHeader__4eH4p", "targetCharacterStatsBody": "hud_targetCharacterStatsBody__C3a3m", "attribute": "hud_attribute__3_UeU", "attributeValue": "hud_attributeValue___oCWu", "attributeName": "hud_attributeName__3e_QQ", "targetButtons": "hud_targetButtons__1RWCm", "confirmButton": "hud_confirmButton__cmqyU", "healthBarOuter": "hud_healthBarOuter__1iu6U", "healthBarFill": "hud_healthBarFill__3acmn", "statusEffects": "hud_statusEffects__3zSJh", "statusEffect": "hud_statusEffect__hrtcE", "visible": "hud_visible__2C7zr", "statusEffectPoison": "hud_statusEffectPoison__C7EVN", "statusEffectRegenerate": "hud_statusEffectRegenerate__2A2UV", "statusEffectShield": "hud_statusEffectShield__1EGEs", "statusEffectTaunt": "hud_statusEffectTaunt__3bHct", "statusEffectCounterattack": "hud_statusEffectCounterattack__xmv_-", "unitStatusUpdates": "hud_unitStatusUpdates__2ZXFS", "unitStatusUpdateTicks": "hud_unitStatusUpdateTicks__1bYCt", "unitStatusUpdateRed": "hud_unitStatusUpdateRed__3NLp-", "unitStatusUpdateGreen": "hud_unitStatusUpdateGreen__39qLj", "characterTicksRingOuter": "hud_characterTicksRingOuter__2syJr", "characterTicksRingBackfill": "hud_characterTicksRingBackfill__2opC0", "characterTicksRingFill": "hud_characterTicksRingFill__2mOTu", "turnOrderDisplay": "hud_turnOrderDisplay__2XwBO", "unitTurnOrderPortrait": "hud_unitTurnOrderPortrait__2Byr5", "unitTurnOrderPortraitImage": "hud_unitTurnOrderPortraitImage__3_rcM", "unitTurnOrderTicks": "hud_unitTurnOrderTicks__3xRL5", "errorDisplay": "hud_errorDisplay__3wfwP", "playAnimation": "hud_playAnimation__A7xhU", "fade-in-and-out": "hud_fade-in-and-out__1F6yx", "versionDisplayWrapper": "hud_versionDisplayWrapper__3REyP", "settingsDisplayWrapper": "hud_settingsDisplayWrapper__13L8U", "settingSet": "hud_settingSet__2axlJ", "settingSetGroupPrepend": "hud_settingSetGroupPrepend__1xMuN", "settingSetGroupButton": "hud_settingSetGroupButton__2-85s", "settingSetGroupSelect": "hud_settingSetGroupSelect__3_Q6p" };
styleInject(css$1);

var StatusWrapper = pizzaJuice.styled(pizzaJuice.Box, {
  fontSize: "$md",
  textAlign: "center",
  py: "$1",
  px: "$2",
  fontFamily: "'Titillium Web', sans-serif",
  opacity: "0.8",
  animation: "fadeIn 0.5s ease-in-out",
  "-webkit-animation": "fadeIn 0.5s ease-in-out",
  "-moz-animation": "fadeIn 0.5s ease-in-out",
  "-o-animation": "fadeIn 0.5s ease-in-out",
  "-ms-animation": "fadeIn 0.5s ease-in-out",

  variants: {
    status: {
      ticks: {
        background: "$yellow-900",
        border: "1px solid $yellow-500",
        color: "$yellow-500"
      },
      positive: {
        background: "$green-900",
        border: "1px solid $green-500",
        color: "$green-500"
      },
      negative: {
        background: "$red-900",
        border: "1px solid $red-500",
        color: "$red-500"
      }
    }
  }
});

var StatusCard = function StatusCard(_ref) {
  var children = _ref.children,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? "ticks" : _ref$type;

  return React__default.createElement(
    StatusWrapper,
    { status: type },
    children
  );
};

var HEALTH_BAR_WIDTH = 64;
var TICKS_RADIUS = 12;
var TICKS_STROKE_WIDTH = 3;

var CharacterStatuses = function (_HUDComponent) {
  inherits(CharacterStatuses, _HUDComponent);

  function CharacterStatuses() {
    classCallCheck(this, CharacterStatuses);
    return possibleConstructorReturn(this, (CharacterStatuses.__proto__ || Object.getPrototypeOf(CharacterStatuses)).apply(this, arguments));
  }

  createClass(CharacterStatuses, [{
    key: "getHealthPosition",
    value: function getHealthPosition(unit) {
      var health = unit.stats.HEALTH;

      if (this.props.activeAnimEvt && this.props.activeAnimEvt.activeStatChange(unit.unitId, "HEALTH") !== false) {
        var healthStatChange = this.props.activeAnimEvt.activeStatChange(unit.unitId, "HEALTH");
        var animDelta = this.props.activeAnimEvt.currentTimeDelta();

        health = healthStatChange.end;

        //(
        //healthStatChange.start + healthStatChange.delta //* Math.max(Math.min(1.0 - animDelta * 2.0, 1.0), 0.0)
        //);

        // Update this unit's health
        unit.stats.HEALTH = health;
      }

      return Math.max(Math.min(health / unit.statsMax.HEALTH, 1.0), 0.0);
    }
  }, {
    key: "polarToCartesian",
    value: function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    }
  }, {
    key: "describeArc",
    value: function describeArc(x, y, radius, startAngle, endAngle) {
      var start = this.polarToCartesian(x, y, radius, endAngle);
      var end = this.polarToCartesian(x, y, radius, startAngle);

      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      var d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");

      return d;
    }
  }, {
    key: "getUnitStatusUpdates",
    value: function getUnitStatusUpdates(unit) {
      var updates = [];

      if (this.activeAnimEvt.getCurrentEventName() === "CardReplaceEvent" && this.activeAnimEvt.isInvoker(unit.unitId)) {
        updates.push(React__default.createElement(
          StatusCard,
          { type: "ticks" },
          "REPLACE CARD"
        ));
      }

      if ((this.activeAnimEvt.hasActiveStatChange(unit.unitId) || this.activeAnimEvt.hasActiveStatusEffectChange(unit.unitId)) && unit.knockoutAnimationPlayed !== true) {
        var statChanges = this.activeAnimEvt.getActiveStatChanges(unit.unitId);
        var statusEffectChanges = this.activeAnimEvt.getActiveStatusEffectChanges(unit.unitId);

        var changes = [statChanges];
        for (var _arrIdx in changes) {
          var _arr = changes[_arrIdx];
          for (var _stat in _arr) {
            if (!_arr.hasOwnProperty(_stat)) continue;
            var value = _arr[_stat].delta;

            if (_stat === "TICKS") {
              value = (value < 0 ? "-" : "+") + Math.abs(value).toFixed(0);
            } else {
              value = (value < 0 ? "-" : "+") + Math.abs(value).toFixed(2);
            }
            //let delta = this.activeAnimEvt.currentTimeDelta();

            var type = _stat === "TICKS" ? "ticks" : value < 0 ? "negative" : "positive";

            updates.push(React__default.createElement(
              StatusCard,
              { type: type },
              _stat,
              ": ",
              value
            ));
          }
        }

        changes = [statusEffectChanges];
        for (var _arrIdx2 in changes) {
          var _arr2 = changes[_arrIdx2];
          for (var _stat2 in _arr2) {
            if (!_arr2.hasOwnProperty(_stat2)) continue;
            var _value = _arr2[_stat2];
            //let delta = this.activeAnimEvt.currentTimeDelta();

            var charValue = "";
            for (var valueCounter = 0; valueCounter < Math.abs(_value); valueCounter++) {
              charValue += _value > 0 ? String.fromCharCode(0x2191) : String.fromCharCode(0x2193);
            }

            var _type = _stat2 === "TAUNT" || _stat2 === "POISON" ? "negative" : "positive";

            if (_stat2 === "TAUNT" || _stat2 === "SHIELD") {
              updates.push(React__default.createElement(
                StatusCard,
                { type: _type },
                _stat2
              ));
            } else {
              updates.push(React__default.createElement(
                StatusCard,
                { type: _type },
                _stat2,
                " ",
                charValue
              ));
            }
          }
        }
      }

      return updates;
    }
  }, {
    key: "render",
    value: function render() {
      console.log("** Rendering the Character Status Displays **");

      var units = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.unitSelectionFields.getUnits()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var unit = _step.value;

          var percHealthRemaining = this.getHealthPosition(unit) * 100;
          var ticksRemaining = unit.ticks;
          var enemy = unit.team === "two";

          if (unit.state === "UNCONSCIOUS") {
            percHealthRemaining = 0;
            ticksRemaining = 0;
          }

          var unitStatusUpdates = this.getUnitStatusUpdates(unit);

          var statusEffectChanges = this.props.activeAnimEvt.getActiveStatusEffectChanges(unit.unitId);
          var hasPoison = statusEffectChanges.POISON > 0 || unit.statusEffects.POISON > 0;
          var hasRegenerate = statusEffectChanges.REGENERATE > 0 || unit.statusEffects.REGENERATE > 0;
          var hasShield = statusEffectChanges.SHIELD > 0 || unit.statusEffects.SHIELD > 0;
          var hasTaunt = statusEffectChanges.TAUNT > 0 || unit.statusEffects.TAUNT > 0;
          var hasCounterattack = statusEffectChanges.COUNTERATTACK > 0 || unit.statusEffects.COUNTERATTACK > 0;

          units.push(React__default.createElement(
            "div",
            null,
            React__default.createElement(
              "div",
              {
                style: {
                  top: unit.position.above.y / 2 - 25,
                  left: (unit.position.above.x - HEALTH_BAR_WIDTH) / 2 - 5
                },
                className: lstyle$1.statusEffects
              },
              React__default.createElement("span", {
                className: [lstyle$1.statusEffect, lstyle$1.statusEffectPoison, hasPoison ? lstyle$1.visible : ""].join(" ")
              }),
              React__default.createElement("span", {
                className: [lstyle$1.statusEffect, lstyle$1.statusEffectRegenerate, hasRegenerate ? lstyle$1.visible : ""].join(" ")
              }),
              React__default.createElement("span", {
                className: [lstyle$1.statusEffect, lstyle$1.statusEffectShield, hasShield ? lstyle$1.visible : ""].join(" ")
              }),
              React__default.createElement("span", {
                className: [lstyle$1.statusEffect, lstyle$1.statusEffectTaunt, hasTaunt ? lstyle$1.visible : ""].join(" ")
              }),
              React__default.createElement("span", {
                className: [lstyle$1.statusEffect, lstyle$1.statusEffectCounterattack, hasCounterattack ? lstyle$1.visible : ""].join(" ")
              })
            ),
            React__default.createElement(
              pizzaJuice.Box,
              {
                style: {
                  top: unit.position.above.y / 2,
                  left: (unit.position.above.x - HEALTH_BAR_WIDTH) / 2
                },
                css: {
                  position: "absolute",
                  w: 80,
                  h: 5
                }
              },
              React__default.createElement(pizzaJuice.Box, {
                as: "span",
                css: {
                  w: Math.round(percHealthRemaining) + "%",
                  bg: enemy ? "$red-500" : "$green-500",
                  position: "relative",
                  h: "100%"
                }
              })
            ),
            React__default.createElement(
              pizzaJuice.Box,
              {
                as: "svg",
                css: {
                  position: "absolute",
                  h: TICKS_RADIUS * 2,
                  w: TICKS_RADIUS * 2,
                  top: unit.position.above.y / 2 + 8,
                  left: enemy ? unit.position.above.x / 2 + 26 : unit.position.above.x / 2 - (HEALTH_BAR_WIDTH - 32)
                }
              },
              React__default.createElement(pizzaJuice.Box, {
                as: "circle",
                "stroke-width": TICKS_STROKE_WIDTH,
                fill: "transparent",
                r: TICKS_RADIUS - TICKS_STROKE_WIDTH,
                cx: TICKS_RADIUS,
                cy: TICKS_RADIUS,
                css: {
                  stroke: enemy ? "rgba(255, 94, 124, 0.2)" : "rgba(140, 190, 114, 0.2)"
                }
              }),
              React__default.createElement(pizzaJuice.Box, {
                as: "path",
                d: this.describeArc(TICKS_RADIUS, TICKS_RADIUS, TICKS_RADIUS - TICKS_STROKE_WIDTH, 0, 360 * ticksRemaining / 100),
                fill: "transparent",
                "stroke-width": TICKS_STROKE_WIDTH,
                css: {
                  stroke: enemy ? "$red-500" : "$green-500"
                }
              })
            ),
            React__default.createElement(
              "div",
              {
                style: {
                  top: unit.position.above.y / 2 + 100,
                  left: (unit.position.above.x - HEALTH_BAR_WIDTH) / 2
                },
                className: lstyle$1.unitStatusUpdates
              },
              unitStatusUpdates
            )
          ));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return React__default.createElement(
        "div",
        null,
        units
      );
    }
  }]);
  return CharacterStatuses;
}(HUDComponent);

var ErrorDisplay = function (_HUDComponent) {
  inherits(ErrorDisplay, _HUDComponent);

  function ErrorDisplay() {
    classCallCheck(this, ErrorDisplay);
    return possibleConstructorReturn(this, (ErrorDisplay.__proto__ || Object.getPrototypeOf(ErrorDisplay)).apply(this, arguments));
  }

  createClass(ErrorDisplay, [{
    key: "restartAnimation",
    value: function restartAnimation(event) {
      event.target.classList.remove(lstyle$1.playAnimation);
      void event.target.offsetWidth;
    }
  }, {
    key: "render",
    value: function render() {
      console.log("** Rendering the Error Display **");

      return React__default.createElement(
        "div",
        { className: [lstyle$1.errorDisplay, this.props.error ? lstyle$1.playAnimation : ""].join(' '), onAnimationEnd: this.restartAnimation },
        this.props.error
      );
    }
  }]);
  return ErrorDisplay;
}(HUDComponent);

var BattleEndContainer = pizzaJuice.styled(pizzaJuice.Box, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  background: "rgba(0,0,0,0.7)",
  width: "100%",
  height: "100%",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 8,
  textAlign: "center",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8.5px)",
  "-webkit-backdrop-filter": "blur(8.5px)"
});

var BattleEndTitle = pizzaJuice.styled(pizzaJuice.Text, {
  mb: "$4",

  variants: {
    win: {
      true: {
        color: "$green-500"
      },
      false: {
        color: "$red-500"
      }
    }
  }
});

var BattleComplete = function BattleComplete(_ref) {
  var winner = _ref.winner,
      owner = _ref.owner;
  var isOwner = owner[winner].isOwner;

  var winnerText = winner === "one" ? "YOU WON" : "YOU LOSE";

  return React__default.createElement(
    BattleEndContainer,
    null,
    React__default.createElement(
      pizzaJuice.Text,
      { css: { mb: "$2" } },
      "GAME OVER"
    ),
    React__default.createElement(
      BattleEndTitle,
      {
        as: "p",
        weight: "bold",
        textAlign: "center",
        win: isOwner,
        css: {
          fontSize: "4.5rem"
        }
      },
      winnerText
    ),
    React__default.createElement(
      pizzaJuice.Stack,
      null,
      React__default.createElement(
        pizzaJuice.Button,
        { as: "a", variant: "outlined" },
        "Play Again"
      ),
      React__default.createElement(
        pizzaJuice.Button,
        null,
        "Back to Dashboard"
      )
    )
  );
};

var AttackIcon = function AttackIcon() {
  return React__default.createElement(
    "svg",
    {
      width: "22",
      height: "22",
      viewBox: "0 0 22 22",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    React__default.createElement("path", {
      d: "M10.8127 2.375C5.94578 2.375 2 6.32051 2 11.1875C2 16.0545 5.94578 20 10.8127 20C15.6796 20 19.625 16.0545 19.625 11.1875C19.625 6.32051 15.6796 2.375 10.8127 2.375ZM10.8127 18.9281C6.53768 18.9281 3.07221 15.4626 3.07221 11.1875C3.07221 6.91242 6.53768 3.44689 10.8127 3.44689C15.0877 3.44689 18.5528 6.91242 18.5528 11.1875C18.5528 15.4626 15.0884 18.9281 10.8127 18.9281Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M11.3383 9.5H10.2868V10.6617H9.125V11.7132H10.2868V12.875H11.3383V11.7132H12.5V10.6617H11.3383V9.5Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M6.36952 11.3916C6.40578 11.3845 6.43891 11.3601 6.46286 11.323C6.48681 11.2859 6.5 11.2385 6.5 11.1895C6.5 11.1405 6.48681 11.0931 6.46286 11.056C6.43891 11.0189 6.40578 10.9945 6.36952 10.9874L0.674849 9.87716C0.653157 9.87291 0.631032 9.87495 0.609984 9.88316C0.588936 9.89136 0.569466 9.90554 0.552878 9.92471C0.536289 9.94389 0.52297 9.96761 0.513847 9.99428C0.504725 10.021 0.500002 10.0499 0.5 10.0793V12.2959C0.500016 12.3251 0.504732 12.354 0.513816 12.3806C0.522899 12.4072 0.536141 12.4309 0.552655 12.45C0.569169 12.4692 0.588571 12.4834 0.609539 12.4917C0.630507 12.4999 0.652555 12.5021 0.674197 12.498L1.53606 12.3338L6.36952 11.3916Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M15.2566 10.9827C15.2201 10.9895 15.1867 11.0137 15.1625 11.0509C15.1383 11.0881 15.125 11.1357 15.125 11.185C15.125 11.2343 15.1383 11.282 15.1625 11.3192C15.1867 11.3564 15.2201 11.3806 15.2566 11.3874L19.3593 12.1864L20.0891 12.3297L20.9505 12.4978C20.9722 12.5021 20.9943 12.5 21.0153 12.4918C21.0363 12.4836 21.0558 12.4695 21.0724 12.4503C21.0889 12.4311 21.1022 12.4073 21.1113 12.3807C21.1204 12.354 21.125 12.325 21.125 12.2957V10.0792C21.125 10.0499 21.1203 10.021 21.1112 9.99443C21.1021 9.96782 21.0889 9.94414 21.0724 9.92497C21.0558 9.90581 21.0364 9.89162 21.0155 9.88335C20.9945 9.87508 20.9725 9.87291 20.9508 9.87703L20.0891 10.0413L19.3593 10.1842L15.2566 10.9827Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M11.017 15.6316C11.0102 15.5951 10.986 15.5617 10.9488 15.5375C10.9116 15.5133 10.864 15.5 10.8147 15.5C10.7654 15.5 10.7178 15.5133 10.6806 15.5375C10.6434 15.5617 10.6192 15.5951 10.6124 15.6316L9.81354 19.7343L9.67024 20.4641L9.50209 21.3252C9.49791 21.3469 9.50002 21.369 9.50828 21.3901C9.51654 21.4111 9.53076 21.4306 9.54996 21.4471C9.56917 21.4637 9.59293 21.477 9.61962 21.4861C9.64631 21.4953 9.67531 21.5 9.70465 21.5H11.9209C11.9501 21.5 11.979 21.4953 12.0056 21.4862C12.0322 21.4771 12.0559 21.4639 12.075 21.4474C12.0942 21.4308 12.1084 21.4114 12.1167 21.3905C12.1249 21.3695 12.1271 21.3475 12.123 21.3258L11.9592 20.4641L11.8159 19.7343L11.017 15.6316Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M10.6084 6.74454C10.6155 6.78079 10.6399 6.81393 10.677 6.83788C10.7141 6.86183 10.7614 6.875 10.8105 6.875C10.8595 6.875 10.9069 6.86183 10.944 6.83788C10.9811 6.81393 11.0054 6.78079 11.0126 6.74454L12.1228 1.04985C12.1271 1.02816 12.125 1.00603 12.1168 0.984985C12.1086 0.963936 12.0945 0.944451 12.0753 0.927862C12.0561 0.911273 12.0324 0.89797 12.0057 0.888848C11.9791 0.879725 11.9501 0.875002 11.9207 0.875H9.70459C9.67531 0.874969 9.64636 0.879641 9.61971 0.888704C9.59305 0.897768 9.5693 0.911008 9.5501 0.927528C9.53089 0.944048 9.51666 0.963453 9.50837 0.984444C9.50008 1.00544 9.49791 1.02753 9.50203 1.0492L9.66624 1.91104L10.6084 6.74454Z",
      fill: "white"
    })
  );
};

var InteractIcon = function InteractIcon() {
  return React__default.createElement(
    "svg",
    {
      width: "19",
      height: "22",
      viewBox: "0 0 19 22",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    React__default.createElement("path", {
      d: "M3.59996 9.94324C4.30072 9.94324 5.00148 9.94325 5.70224 9.94324C6.08231 9.94324 6.3555 9.77992 6.54553 9.46494C7.24629 8.27503 7.94704 7.07345 8.6478 5.88354C8.94473 5.37025 9.45546 5.23026 9.97806 5.53357C10.1681 5.63856 10.37 5.74356 10.56 5.86022C10.9876 6.11686 11.1302 6.64182 10.8689 7.06179C10.1681 8.26337 9.46734 9.46494 8.74283 10.6665C8.51716 11.0398 8.51716 11.3898 8.74283 11.7631C9.44358 12.9297 10.1206 14.1079 10.8095 15.2745C11.1064 15.7761 10.9758 16.2778 10.465 16.5694C10.2987 16.6627 10.1443 16.7561 9.97806 16.8494C9.46733 17.141 8.95662 17.001 8.65968 16.4994C7.95893 15.2978 7.24629 14.1079 6.54553 12.9064C6.3555 12.5914 6.08232 12.4281 5.71412 12.4281C4.30073 12.4281 2.87545 12.4281 1.46206 12.4281C0.891947 12.4281 0.5 12.0547 0.5 11.4831C0.5 11.2615 0.5 11.0398 0.5 10.8298C0.5 10.3399 0.903824 9.95491 1.40267 9.95491C2.13906 9.94324 2.86357 9.94325 3.59996 9.94324Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M13.6839 7.625C13.8226 7.67194 13.9613 7.6954 14.0885 7.76581C14.2966 7.87141 14.5046 8.00048 14.7011 8.11782C15.1057 8.37597 15.2444 8.88052 15.0132 9.30293C14.7936 9.71362 14.5624 10.1126 14.3197 10.5115C14.1116 10.8518 14.1116 11.1921 14.3197 11.5441C14.5393 11.9078 14.7358 12.2833 14.9554 12.6471C15.2329 13.1399 15.1057 13.6562 14.6202 13.9378C14.4468 14.0434 14.2619 14.149 14.0885 14.2546C13.6377 14.501 13.1291 14.3602 12.8748 13.9143C12.424 13.1282 11.9732 12.3303 11.5224 11.5324C11.3259 11.1921 11.3259 10.8753 11.5224 10.535C11.9847 9.72535 12.4355 8.92745 12.8979 8.11782C13.0713 7.81274 13.3372 7.6602 13.6839 7.625Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M2.80575 7.25C2.33994 7.25 1.87413 7.25 1.40833 7.25C0.884291 7.25 0.5 6.86954 0.5 6.35073C0.5 6.1432 0.5 5.93567 0.5 5.72815C0.5 5.23239 0.884289 4.85193 1.38503 4.8404C1.85084 4.8404 2.30501 4.8404 2.77082 4.8404C3.14346 4.8404 3.4113 4.67899 3.58598 4.3677C3.80724 3.98724 4.04014 3.59525 4.2614 3.21479C4.52924 2.75362 5.05328 2.61527 5.51908 2.89197C5.69376 2.99573 5.88009 3.08796 6.05477 3.20325C6.49729 3.46842 6.62538 3.97571 6.36919 4.41382C5.90338 5.20933 5.44922 5.99332 4.98341 6.78883C4.79708 7.10012 4.52925 7.25 4.1566 7.25C3.71408 7.25 3.25991 7.25 2.80575 7.25Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M2.78822 14.7518C3.25284 14.7518 3.70583 14.7518 4.17044 14.7518C4.53052 14.7518 4.80929 14.9009 4.98352 15.2104C5.44813 16.0014 5.92436 16.8038 6.37736 17.6062C6.62128 18.0304 6.49352 18.5233 6.06375 18.787C5.86629 18.9131 5.65721 19.0277 5.44813 19.1424C5.02998 19.3716 4.5073 19.2226 4.26337 18.8099C4.03107 18.4202 3.81037 18.0304 3.57807 17.6406C3.39222 17.3311 3.12507 17.1706 2.76499 17.1706C2.31199 17.1706 1.87061 17.1706 1.41761 17.1706C0.871694 17.1706 0.5 16.8038 0.5 16.2536C0.5 16.0472 0.5 15.8409 0.5 15.6345C0.5 15.1531 0.883306 14.7748 1.37115 14.7748C1.84738 14.7404 2.31199 14.7518 2.78822 14.7518Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M17.8967 12.125C17.4076 12.125 17 11.7148 17 11.2109C17 10.6953 17.4193 10.25 17.9317 10.25C18.4324 10.25 18.875 10.6953 18.875 11.1875C18.8634 11.6914 18.4092 12.125 17.8967 12.125Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M0.5 20.5625C0.5 20.039 0.901782 19.625 1.42532 19.625C1.94886 19.625 2.375 20.039 2.375 20.5625C2.375 21.0739 1.94886 21.5 1.42532 21.5C0.913958 21.5 0.5 21.086 0.5 20.5625Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M0.5 1.4375C0.5 0.913962 0.913958 0.5 1.42532 0.5C1.93668 0.5 2.375 0.926137 2.375 1.4375C2.375 1.96104 1.94886 2.375 1.42532 2.375C0.913958 2.375 0.5 1.96104 0.5 1.4375Z",
      fill: "white"
    })
  );
};

var AbilityIcon = function AbilityIcon() {
  return React__default.createElement(
    "svg",
    {
      width: "22",
      height: "22",
      viewBox: "0 0 22 22",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    React__default.createElement("path", {
      d: "M15.0119 10.9151C14.7983 9.83672 14.2061 9.21745 13.1963 9.05729C11.7107 8.81172 10.2252 8.60886 8.74935 8.33125C6.27345 7.86146 4.02086 6.7724 1.81682 5.52318C1.53524 5.36302 1.26338 5.21354 0.875 5C1.14686 6.49479 1.84594 7.51979 2.88485 8.3099C5.04035 9.94349 7.48713 10.6802 10.0601 11.0219C12.6623 11.3635 12.6428 11.3742 13.3516 14.0862C13.7012 15.4102 14.0701 16.7341 14.507 18.026C15.0508 19.6276 16.1577 20.375 17.75 20.375C17.0703 18.3464 16.3518 16.3604 15.7401 14.3424C15.41 13.232 15.2353 12.0576 15.0119 10.9151Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M10.4219 12.6332C6.87976 12.2171 3.49418 11.289 0.5 8.75C0.685913 10.2115 1.23387 11.225 2.10473 12.0784C3.65074 13.5827 5.50987 14.2867 7.55492 14.5534C7.79954 14.5855 8.04416 14.6068 8.28879 14.6495C10.0109 14.9588 9.96201 14.9908 10.4415 16.7404C10.7252 17.7859 11.1851 18.8207 11.7429 19.7381C12.3006 20.6449 13.191 21.125 14.375 21.125C12.6822 19.0127 12.3495 16.4524 11.7918 13.988C11.5961 13.1346 11.2243 12.7292 10.4219 12.6332Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M7.57004 16.2226C5.80496 15.9856 4.06897 15.6302 2.50754 14.6394C1.85776 14.2301 1.23707 13.767 0.5 13.25C0.936422 14.8763 1.75108 16.061 3.10884 16.6426C4.24353 17.1165 5.44612 17.4289 6.62931 17.7196C7.30819 17.8812 7.70582 18.1505 7.91918 18.9367C8.29741 20.3368 9.12177 21.3492 10.625 21.5C9.4903 20.326 9.13147 18.7967 8.83082 17.235C8.68535 16.4811 8.18103 16.298 7.57004 16.2226Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M19.1972 10.9217C18.8117 9.67997 18.6239 8.37461 18.367 7.10109C18.1297 5.90185 17.4478 5.21203 16.3013 5.021C14.6113 4.75568 12.9113 4.52221 11.2311 4.21444C8.40446 3.69442 5.5778 2.47396 3.06741 1.0837C2.75114 0.913894 2.43487 0.744092 2 0.5C2.30639 2.1768 3.10694 3.32297 4.29295 4.19321C6.74404 6.00798 9.78814 6.84638 12.7334 7.21783C15.6984 7.59988 15.6787 7.6105 16.4792 10.6457C16.8746 12.1209 17.6455 13.7765 18.1495 15.2198C18.7722 17.0133 19.4344 18.0534 21.5 17.6713C20.7192 15.4108 19.8989 13.1928 19.1972 10.9217Z",
      fill: "white"
    })
  );
};

var EffectIcon = function EffectIcon() {
  return React__default.createElement(
    "svg",
    {
      width: "20",
      height: "20",
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    React__default.createElement("path", {
      d: "M8.3509 19.7473C9.03358 19.3938 9.6653 19.0835 10.2872 18.7374C10.5115 18.6129 10.7546 18.4702 10.8992 18.2577C11.0816 17.9905 11.0142 17.4055 9.98734 17.1499C9.42543 17.0387 8.85038 16.9947 8.28436 16.901C5.72782 16.486 3.47689 15.4495 1.84045 13.3649C0.767559 11.9998 0.299291 10.3659 0.25 8.60579C0.388835 8.91035 0.512071 9.2232 0.670622 9.51863C0.936791 10.0165 1.18815 10.5269 1.51429 10.9825C1.89629 11.5152 2.76957 11.5219 2.82297 9.72276C2.66688 7.63735 3.37583 5.80584 4.39286 4.06731C5.80914 1.64747 9.95613 0.268257 11.0372 0.25C10.5558 0.480698 10.0843 0.689007 9.62916 0.930493C9.29914 1.09811 8.98534 1.29649 8.69182 1.52302C8.16934 1.94209 8.21864 2.4209 8.86353 2.63335C9.45173 2.8267 10.09 2.89558 10.7127 2.94952C13.542 3.19848 15.9359 4.32044 17.7637 6.54195C18.6994 7.6805 19.4068 9.89037 19.3739 11.3783C19.2753 11.1625 19.2277 11.0464 19.1718 10.9401C18.8514 10.3161 18.545 9.68291 18.1983 9.0738C18.0455 8.80493 17.8048 8.43981 17.4729 8.5925C16.7508 8.92444 16.6769 10.5509 16.6054 11.1949C16.3105 13.8504 15.2836 16.1441 13.2964 17.9416C12.1413 18.9822 9.83373 19.8029 8.3509 19.7473ZM5.63993 6.61249C5.00205 7.42744 4.61772 8.41513 4.53554 9.45071C4.45337 10.4863 4.67703 11.5233 5.17825 12.4304C5.67947 13.3376 6.43574 14.0743 7.35142 14.5473C8.2671 15.0203 9.30107 15.2085 10.3226 15.0879C11.3441 14.9673 12.3073 14.5435 13.0903 13.8699C13.8734 13.1964 14.4412 12.3035 14.7218 11.304C15.0025 10.3045 14.9835 9.2434 14.6672 8.25485C14.3508 7.26629 13.7515 6.39471 12.9448 5.75027C12.4092 5.32189 11.7953 5.00436 11.1382 4.81583C10.481 4.62731 9.79351 4.57149 9.11499 4.65157C8.43647 4.73164 7.78025 4.94603 7.18383 5.2825C6.5874 5.61897 6.06249 6.07094 5.6391 6.61249H5.63993Z",
      fill: "white"
    }),
    React__default.createElement("path", {
      d: "M11.9696 11.8715C11.5998 12.3349 11.1009 12.6783 10.536 12.8583C9.97114 13.0384 9.36558 13.047 8.79579 12.8831C8.22601 12.7192 7.71755 12.3902 7.33463 11.9376C6.95171 11.4849 6.7115 10.929 6.64432 10.3399C6.57715 9.75086 6.68601 9.1551 6.95718 8.62787C7.22836 8.10063 7.64967 7.66554 8.16793 7.37759C8.68619 7.08963 9.27816 6.96171 9.86908 7.00995C10.46 7.05819 11.0234 7.28042 11.4881 7.64862C11.7976 7.89385 12.0556 8.19777 12.2474 8.54294C12.4392 8.88812 12.5609 9.26775 12.6057 9.66008C12.6504 10.0524 12.6173 10.4497 12.5081 10.8292C12.399 11.2087 12.216 11.5629 11.9696 11.8715Z",
      fill: "white"
    })
  );
};

var NdLogo = function NdLogo() {
  return React__default.createElement(
    "svg",
    {
      width: "120",
      height: "64",
      viewBox: "0 0 120 64",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    React__default.createElement("path", {
      d: "M3.58052 35.3569C2.63112 35.3576 1.72081 35.7351 1.04948 36.4064C0.378153 37.0777 0.000697318 37.988 0 38.9374V60.2362C0 61.1858 0.377232 62.0966 1.04871 62.768C1.72019 63.4395 2.63091 63.8168 3.58052 63.8168C4.53013 63.8168 5.44085 63.4395 6.11233 62.768C6.7838 62.0966 7.16104 61.1858 7.16104 60.2362V38.9374C7.16278 38.4667 7.07135 38.0004 6.89203 37.5652C6.71271 37.13 6.44903 36.7346 6.11621 36.4017C5.78338 36.0689 5.38797 35.8052 4.95278 35.6259C4.51758 35.4466 4.05121 35.3552 3.58052 35.3569Z",
      fill: "url(#paint0_linear_413_556)"
    }),
    React__default.createElement("path", {
      d: "M120 14.0581L106.125 0.183594H56.4721V51.6009L7.37165 2.5004C6.69625 1.85519 5.79516 1.49993 4.86116 1.51061C3.92716 1.52128 3.03443 1.89706 2.37395 2.55754C1.71347 3.21802 1.33769 4.11075 1.32701 5.04475C1.31633 5.97875 1.6716 6.87984 2.31681 7.55525L57.5252 62.7373C58.0259 63.2363 58.6631 63.5759 59.3565 63.7134C60.0499 63.8508 60.7685 63.7799 61.4217 63.5096C62.0749 63.2393 62.6334 62.7818 63.027 62.1946C63.4205 61.6074 63.6314 60.9168 63.6332 60.2099V7.3183H103.15L112.839 17.0068V56.6294H84.6687L91.8034 63.7641H119.974L120 14.0581Z",
      fill: "url(#paint1_linear_413_556)"
    }),
    React__default.createElement(
      "defs",
      null,
      React__default.createElement(
        "linearGradient",
        {
          id: "paint0_linear_413_556",
          x1: "-7.71103e-07",
          y1: "63.8957",
          x2: "120.053",
          y2: "0.183588",
          gradientUnits: "userSpaceOnUse"
        },
        React__default.createElement("stop", { stopColor: "#11EEF1" }),
        React__default.createElement("stop", { offset: "1", stopColor: "#F70835" })
      ),
      React__default.createElement(
        "linearGradient",
        {
          id: "paint1_linear_413_556",
          x1: "-7.71103e-07",
          y1: "63.8957",
          x2: "120.053",
          y2: "0.183588",
          gradientUnits: "userSpaceOnUse"
        },
        React__default.createElement("stop", { stopColor: "#11EEF1" }),
        React__default.createElement("stop", { offset: "1", stopColor: "#F70835" })
      )
    )
  );
};

var Wrapper = pizzaJuice.styled("div", {
  d: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  bg: "$grey-900",

  w: 198,
  p: "$4",

  $$innerBorder: "inset 0px 0px 0px 2px rgb($$color)",
  boxShadow: "$$innerBorder",

  transition: "all 0.22s ease-in-out",

  variants: {
    variant: {
      attack: {
        $$color: "233, 50, 58"
      },
      ability: {
        $$color: "102, 186, 147"
      },
      effect: {
        $$color: "239, 211, 114"
      },
      interact: {
        $$color: "131, 244, 225"
      }
    },

    selected: {
      true: {
        boxShadow: "$$innerBorder, 0px 4px 38px 20px rgba($$color, 0.25)",
        transform: "translateY(-15px)"
      },
      false: {}
    }
  }
});

var PlayerControlsCard = function (_HUDComponent) {
  inherits(PlayerControlsCard, _HUDComponent);

  function PlayerControlsCard() {
    classCallCheck(this, PlayerControlsCard);
    return possibleConstructorReturn(this, (PlayerControlsCard.__proto__ || Object.getPrototypeOf(PlayerControlsCard)).apply(this, arguments));
  }

  createClass(PlayerControlsCard, [{
    key: "isValidCard",
    value: function isValidCard(card) {
      return card && card.type && ["attack", "ability", "effect", "interact"].indexOf(card.type.toLowerCase()) >= 0;
    }
  }, {
    key: "render",
    value: function render() {
      console.log("** Rendering the Player Controls Card **");

      var card = this.props.card;

      var iconMap = {
        attack: React__default.createElement(AttackIcon, null),
        interact: React__default.createElement(InteractIcon, null),
        ability: React__default.createElement(AbilityIcon, null),
        effect: React__default.createElement(EffectIcon, null)
      };

      var styles = [lstyle$1.card];

      if (!this.props.baseAttack && this.hudLocked) {
        return React__default.createElement(
          pizzaJuice.Flex,
          {
            align: "center",
            justify: "center",
            css: {
              w: 198,
              bg: "$grey-900",
              p: "$4",
              // FIXME: It should be inner shadow.
              border: "2px solid",
              borderImage: "linear-gradient(74.28deg, #11EEF1, #F70835) 1"
            }
          },
          React__default.createElement(NdLogo, null)
        );
      }

      var cardType = card.type.toLowerCase();

      if (!this.isValidCard(card)) {
        // Get the specific card type for styles
        styles.push(lstyle$1.fillerCard);

        // TODO: Design for missing card
        return React__default.createElement(
          "div",
          { className: lstyle$1.cardSelectionWrapper },
          React__default.createElement(
            "div",
            { className: styles.join(" ") },
            React__default.createElement(
              "h3",
              { className: lstyle$1.cardTitle },
              "Empty Card Slot"
            ),
            React__default.createElement(
              "p",
              null,
              "Missing Weapon Equipment"
            )
          )
        );
      }

      // Disallow selecting certain types
      var disallowSelect = ["interact", "effect"].indexOf(cardType) !== -1;

      return React__default.createElement(
        Wrapper,
        {
          variant: cardType,
          selected: this.props.selected,
          onClick: disallowSelect ? function () {} : this.props.callback
        },
        React__default.createElement(
          pizzaJuice.Flex,
          { direction: "column", gap: 1 },
          React__default.createElement(
            pizzaJuice.Text,
            { size: "sm", weight: "medium" },
            card.name
          ),
          React__default.createElement(pizzaJuice.Divider, { css: { $$color: "$colors$white" } }),
          React__default.createElement(
            pizzaJuice.Flex,
            { direction: "column", gap: 2 },
            React__default.createElement(
              pizzaJuice.Text,
              { size: "sm", transform: "normal", css: { color: "$grey-400" } },
              card.effects
            ),
            card.exploits && React__default.createElement(
              pizzaJuice.Text,
              { size: "sm", transform: "normal", css: { color: "$pink-500" } },
              card.exploits
            ),
            card.replace && React__default.createElement(
              pizzaJuice.Button,
              {
                onClick: this.props.replaceCallback,
                css: { alignSelf: "center" }
              },
              "Replace"
            )
          )
        ),
        React__default.createElement(
          pizzaJuice.Flex,
          { justify: "between", align: "center" },
          React__default.createElement(
            pizzaJuice.Flex,
            { gap: 2, align: "center" },
            iconMap[cardType],
            React__default.createElement(
              pizzaJuice.Text,
              { size: "sm", weight: "medium" },
              cardType
            )
          ),
          React__default.createElement(
            pizzaJuice.Box,
            { css: { br: "$full", bg: "$grey-700", p: "$1" } },
            React__default.createElement(
              pizzaJuice.Text,
              { size: "xs", weight: "medium" },
              card.tickCost
            )
          )
        )
      );
    }
  }]);
  return PlayerControlsCard;
}(HUDComponent);

var _styled;

var Wrapper$1 = pizzaJuice.styled("div", {
  position: "relative",

  /**
   * Variants
   */
  variants: {
    /**
     * Active variant
     */
    active: {
      true: {
        bs: "0 0 0 1px $colors$pink-500"
      }
    }
  }
});

var Overlay = pizzaJuice.styled("div", {
  position: "absolute",
  top: 0,
  size: "$full",
  d: "flex",
  flexDirection: "column",
  justify: "space-between"
});

var Top = pizzaJuice.styled("div", {
  d: "flex",
  flexDirection: "column",

  p: "$3",
  pb: "0"
});

var Typename = pizzaJuice.styled("div", (_styled = {
  maxW: "66%",

  fontWeight: "$medium",
  color: "$pink-500",
  letterSpacing: "0.05em",
  textTransform: "uppercase"
}, defineProperty(_styled, "color", "$white"), defineProperty(_styled, "fontSize", "$md"), defineProperty(_styled, "lineHeight", "24px"), _styled));

var Character = function Character(_ref) {
  var _ref$active = _ref.active,
      active = _ref$active === undefined ? false : _ref$active,
      character = _ref.character,
      enemy = _ref.enemy,
      _ref$size = _ref.size,
      size = _ref$size === undefined ? 198 : _ref$size,
      css = _ref.css;

  var emptyCharacterImg = "https://neon-district-cdn.s3.amazonaws.com/empty-state/no-character.png";

  // FIXME: Connect character data to this component
  var type = character && character.type;

  var emptyMessage = enemy ? "Select your target" : "Empty";

  return React__default.createElement(
    Wrapper$1,
    { active: active, css: css },
    React__default.createElement(pizzaJuice.Image
    // FIXME: add .? later
    , { src: character && character.headImgSrc || emptyCharacterImg,
      alt: character && character.name || emptyMessage,
      css: _extends({
        h: size,
        filter: "brightness(33%)"
      }, enemy && { transform: "scaleX(-1)" })
    }),
    React__default.createElement(
      Overlay,
      null,
      React__default.createElement(
        Top,
        null,
        React__default.createElement(
          Typename,
          null,
          type || emptyMessage
        )
      )
    )
  );
};

var PlayerControlsCharacter = function (_HUDComponent) {
  inherits(PlayerControlsCharacter, _HUDComponent);

  function PlayerControlsCharacter() {
    classCallCheck(this, PlayerControlsCharacter);
    return possibleConstructorReturn(this, (PlayerControlsCharacter.__proto__ || Object.getPrototypeOf(PlayerControlsCharacter)).apply(this, arguments));
  }

  createClass(PlayerControlsCharacter, [{
    key: "render",
    value: function render() {
      console.log("** Rendering the Player Controls Character **");

      return React__default.createElement(
        pizzaJuice.Box,
        {
          css: {
            bg: "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 53.85%, rgba(0, 0, 0, 0) 100%)"
          }
        },
        React__default.createElement(Character, {
          character: this.props.character,
          alt: this.props.character.metadata && this.props.character.metadata.name
        })
      );
    }
  }]);
  return PlayerControlsCharacter;
}(HUDComponent);

var Neutral = function Neutral(props) {
  return React__default.createElement(
    "svg",
    _extends({
      width: "16px",
      height: "16px",
      viewBox: "0 0 10 12",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    React__default.createElement("path", {
      d: "M9.85718 6L0.857178 11.1962L0.857178 0.803848L9.85718 6Z",
      fill: "currentColor"
    })
  );
};

var Stat = function Stat(_ref) {
  var label = _ref.label,
      value = _ref.value;

  return React__default.createElement(
    pizzaJuice.Flex,
    { direction: "column", gap: 1 },
    React__default.createElement(
      pizzaJuice.Flex,
      { align: "center", justify: "between", css: { flex: 1 } },
      React__default.createElement(
        pizzaJuice.Text,
        { size: "sm", weight: "medium", css: { color: "$grey-400", w: "22px" } },
        label
      ),
      React__default.createElement(
        pizzaJuice.Box,
        { css: { color: "$grey-700" } },
        React__default.createElement(Neutral, { width: "9" })
      ),
      React__default.createElement(
        pizzaJuice.Text,
        { weight: "medium", size: "sm", textAlign: "right" },
        value
      )
    ),
    React__default.createElement(pizzaJuice.Box, { css: { h: 1, w: "$full", bg: "$grey-700" } })
  );
};

var TargetCharacterControls = function (_HUDComponent) {
  inherits(TargetCharacterControls, _HUDComponent);

  function TargetCharacterControls() {
    classCallCheck(this, TargetCharacterControls);
    return possibleConstructorReturn(this, (TargetCharacterControls.__proto__ || Object.getPrototypeOf(TargetCharacterControls)).apply(this, arguments));
  }

  createClass(TargetCharacterControls, [{
    key: "render",
    value: function render() {
      console.log("** Rendering the Target Character Controls **");

      var stats = this.props.character && this.props.character.stats;

      // TODO: Status effects
      // let statusEffectChanges = this.props.activeAnimEvt && this.props.activeAnimEvt.getActiveStatusEffectChanges(unit.unitId);
      // let hasPoison        = (statusEffectChanges && statusEffectChanges.POISON > 0) || (targetUnit && targetUnit.statusEffects.POISON > 0);
      // let hasRegenerate    = (statusEffectChanges && statusEffectChanges.REGENERATE > 0) || (targetUnit && targetUnit.statusEffects.REGENERATE > 0);
      // let hasShield        = (statusEffectChanges && statusEffectChanges.SHIELD > 0) || (targetUnit && targetUnit.statusEffects.SHIELD > 0);
      // let hasTaunt         = (statusEffectChanges && statusEffectChanges.TAUNT > 0) || (targetUnit && targetUnit.statusEffects.TAUNT > 0);
      // let hasCounterattack = (statusEffectChanges && statusEffectChanges.COUNTERATTACK > 0) || (targetUnit && targetUnit.statusEffects.COUNTERATTACK > 0);

      return React__default.createElement(
        pizzaJuice.Flex,
        { gap: 2 },
        React__default.createElement(
          pizzaJuice.Box,
          {
            css: {
              bg: "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 53.85%, rgba(0, 0, 0, 0) 100%)"
            }
          },
          React__default.createElement(Character, { character: this.props.targetCharacter, enemy: true })
        ),
        React__default.createElement(
          pizzaJuice.Flex,
          { direction: "column", justify: "between", css: { flex: 1 } },
          React__default.createElement(
            pizzaJuice.Grid,
            { columns: 2, gapX: 4, gapY: 1 },
            React__default.createElement(Stat, { label: "HP", value: stats && stats.HEALTH || 0 }),
            React__default.createElement(Stat, { label: "STL", value: stats && stats.STEALTH || 0 }),
            React__default.createElement(Stat, { label: "ATK", value: stats && stats.ATTACK || 0 }),
            React__default.createElement(Stat, { label: "MEC", value: stats && stats.MECH || 0 }),
            React__default.createElement(Stat, { label: "DEF", value: stats && stats.DEFENSE || 0 }),
            React__default.createElement(Stat, { label: "TAC", value: stats && stats.TACTICS || 0 }),
            React__default.createElement(Stat, { label: "NAN", value: stats && stats.NANO || 0 }),
            React__default.createElement(Stat, { label: "HAC ", value: stats && stats.HACKING || 0 })
          ),
          React__default.createElement(
            pizzaJuice.Button,
            {
              onClick: this.props.confirmCallback,
              disabled: this.hudLocked
            },
            "Confirm"
          )
        )
      );
    }
  }]);
  return TargetCharacterControls;
}(HUDComponent);

var PlayerControlsDisplay = function (_HUDComponent) {
  inherits(PlayerControlsDisplay, _HUDComponent);

  function PlayerControlsDisplay(props) {
    classCallCheck(this, PlayerControlsDisplay);

    var _this = possibleConstructorReturn(this, (PlayerControlsDisplay.__proto__ || Object.getPrototypeOf(PlayerControlsDisplay)).call(this, props));

    _this.state = {
      selectedAction: null,
      selectedTarget: null,
      activeCharacter: null,
      battleComplete: false,
      winner: null,
      owner: null
    };

    _this.confirmAction = props.confirmAction;

    window.addEventListener("battleComplete", function (_ref) {
      var detail = _ref.detail;

      _this.setState({
        battleComplete: true,
        winner: detail.winner,
        owner: detail.owner
      });
    });
    return _this;
  }

  createClass(PlayerControlsDisplay, [{
    key: "chooseOption",
    value: function chooseOption(option) {
      if (this.state.selectedAction !== option) {
        if (this.props.playerSelections && this.props.playerSelections.validateActionSelect(option)) {
          this.props.playerSelections.setAction(option);
        }
        this.setState({ selectedAction: option });
      }
    }
  }, {
    key: "chooseReplaceOption",
    value: function chooseReplaceOption(target) {
      // Remove visuals
      this.setState(defineProperty({ selectedAction: null }, "selectedAction", null));

      // Select replace and the correct card target
      if (this.props.playerSelections && this.props.playerSelections.validateActionSelect("replace")) {
        this.props.playerSelections.setAction("replace");

        if (this.props.playerSelections && this.props.playerSelections.validateTargetSelect(target)) {
          this.props.playerSelections.setTarget(target);

          // Submit the action
          this.confirmAction();
        }
      }
    }
  }, {
    key: "chooseTarget",
    value: function chooseTarget(option) {
      if (this.props.playerSelections && this.props.playerSelections.validateTargetSelect(option)) {
        this.props.playerSelections.setTarget(option);
        this.setState({ selectedTarget: option });
      }
    }
  }, {
    key: "confirmActionCapture",
    value: function confirmActionCapture() {
      this.setState(defineProperty({ selectedAction: null }, "selectedAction", null));
      this.confirmAction();
    }
  }, {
    key: "render",
    value: function render() {
      console.log("** Rendering the Player Controls Display **");

      var activeCharacter = this.getActivePlayer();
      var targetCharacter = this.getTarget();

      return React__default.createElement(
        pizzaJuice.Flex
        // className={lstyle.playerControlsWrapper}
        ,
        { align: "center",
          gap: 4,
          css: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            w: "$full"
          }
        },
        this.state.battleComplete && React__default.createElement(BattleComplete, { winner: this.state.winner, owner: this.state.owner }),
        React__default.createElement(
          pizzaJuice.Flex,
          {
            direction: "column",
            gap: 2,
            css: {
              bg: "rgba(14, 14, 14, 0.8)",
              pt: "$4",
              pb: "$6",
              px: "$4"
            }
          },
          React__default.createElement(
            pizzaJuice.Text,
            { weight: "medium", css: { color: "$pink-500" } },
            "Player"
          ),
          React__default.createElement(
            pizzaJuice.Box,
            null,
            React__default.createElement(pizzaJuice.Box, { css: { h: 1, w: "$full", bg: "$grey-700" } }),
            React__default.createElement(pizzaJuice.Box, { css: { h: 2, w: "18%", bg: "$grey-700" } })
          ),
          React__default.createElement(
            pizzaJuice.Flex,
            { gap: 1, css: { h: 198, w: "$full" } },
            React__default.createElement(PlayerControlsCharacter, {
              character: activeCharacter,
              isTarget: false
            }),
            React__default.createElement(PlayerControlsCard, {
              card: {
                name: "Base Attack",
                type: "ATTACK",
                tickCost: 40
              },
              callback: this.chooseOption.bind(this, "attack"),
              selected: this.state.selectedAction === "attack",
              baseAttack: true
            }),
            React__default.createElement(PlayerControlsCard, {
              card: this.props.playerSelections && this.props.playerSelections.getCard(0) || {},
              callback: this.chooseOption.bind(this, "card0"),
              replaceCallback: this.chooseReplaceOption.bind(this, "card0"),
              selected: this.state.selectedAction === "card0"
            }),
            React__default.createElement(PlayerControlsCard, {
              card: this.props.playerSelections && this.props.playerSelections.getCard(1) || {},
              callback: this.chooseOption.bind(this, "card1"),
              replaceCallback: this.chooseReplaceOption.bind(this, "card1"),
              selected: this.state.selectedAction === "card1"
            }),
            React__default.createElement(PlayerControlsCard, {
              card: this.props.playerSelections && this.props.playerSelections.getCard(2) || {},
              callback: this.chooseOption.bind(this, "card2"),
              replaceCallback: this.chooseReplaceOption.bind(this, "card2"),
              selected: this.state.selectedAction === "card2"
            })
          )
        ),
        React__default.createElement(
          pizzaJuice.Flex,
          {
            direction: "column",
            gap: 2,
            css: {
              w: "33%",
              bg: "rgba(14, 14, 14, 0.8)",
              pt: "$4",
              pb: "$6",
              px: "$4"
            }
          },
          React__default.createElement(
            pizzaJuice.Text,
            { weight: "medium", css: { color: "$pink-500" } },
            targetCharacter ? "Target" : "Select your Target"
          ),
          React__default.createElement(
            pizzaJuice.Box,
            null,
            React__default.createElement(pizzaJuice.Box, { css: { h: 1, w: "$full", bg: "$grey-700" } }),
            React__default.createElement(pizzaJuice.Box, { css: { h: 2, w: "18%", bg: "$grey-700" } })
          ),
          React__default.createElement(TargetCharacterControls, {
            activeAnimEvt: this.props.activeAnimEvt,
            targetCharacter: targetCharacter,
            confirmCallback: this.confirmActionCapture.bind(this)
          })
        )
      );
    }
  }]);
  return PlayerControlsDisplay;
}(HUDComponent);

var PlayerTargetMap = function (_HUDComponent) {
  inherits(PlayerTargetMap, _HUDComponent);

  function PlayerTargetMap() {
    classCallCheck(this, PlayerTargetMap);
    return possibleConstructorReturn(this, (PlayerTargetMap.__proto__ || Object.getPrototypeOf(PlayerTargetMap)).apply(this, arguments));
  }

  createClass(PlayerTargetMap, [{
    key: "selectTargetCallback",
    value: function selectTargetCallback(target) {
      if (this.props.playerSelections.validateTargetSelect(target)) {
        this.props.playerSelections.setTarget(target);
      }
    }
  }, {
    key: "render",
    value: function render() {
      console.log("** Rendering the Player Target Map **");

      var targets = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.unitSelectionFields.getRegions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var region = _step.value;

          var coords = region.region.join(',');
          targets.push(React__default.createElement("div", { style: {
              display: 'block',
              position: 'absolute',
              top: region.region[1],
              left: region.region[0],
              height: region.region[3] - region.region[1],
              width: region.region[2] - region.region[0],
              backgroundColor: 'rgba(255,255,255,0.0)'
            }, onClick: this.selectTargetCallback.bind(this, region.target) }));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return React__default.createElement(
        "div",
        null,
        targets
      );
    }
  }]);
  return PlayerTargetMap;
}(HUDComponent);

var SettingsDisplay = function (_HUDComponent) {
  inherits(SettingsDisplay, _HUDComponent);

  function SettingsDisplay(props) {
    classCallCheck(this, SettingsDisplay);

    var _this = possibleConstructorReturn(this, (SettingsDisplay.__proto__ || Object.getPrototypeOf(SettingsDisplay)).call(this, props));

    _this.soundManager = props.soundManager;

    _this.musicOptions = _this.soundManager.getMusicOptions();

    _this.state = {
      audioPlaying: true
    };
    return _this;
  }

  createClass(SettingsDisplay, [{
    key: "toggleAudio",
    value: function toggleAudio() {
      var currentAudioKey = document.getElementById('currentPlayingAudio').value;

      var audioOption = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.musicOptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var option = _step.value;

          if (currentAudioKey === option.key) {
            audioOption = option;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (this.soundManager.hasSound('music', audioOption.key)) {
        if (this.state.audioPlaying) {
          // Currently on, going to stop it
          this.soundManager.stop('music', audioOption.key);
        } else if (!this.state.audioPlaying) {
          // Currently off, going to play it
          this.soundManager.play('music', audioOption.key, audioOption.volume, true);
        }
      }

      this.setState({ audioPlaying: !this.state.audioPlaying });
    }
  }, {
    key: "changeMusic",
    value: function changeMusic(evt) {
      // Turn off all existing music
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.musicOptions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var option = _step2.value;

          if (this.soundManager.hasSound('music', option.key) && evt.target.value !== option.key) {
            this.soundManager.stop('music', option.key);
          } else if (this.soundManager.hasSound('music', option.key) && evt.target.value === option.key && this.state.audioPlaying) {
            this.soundManager.play('music', option.key, option.volume, true);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      console.log("** Rendering the Settings Display **");

      var options = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.musicOptions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var option = _step3.value;

          options.push(React__default.createElement(
            "option",
            { value: option.key },
            option.name
          ));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var displaySelectStyle = {};
      if (this.musicOptions.length <= 1) {
        displaySelectStyle = { 'display': 'none' };
      }

      return React__default.createElement(
        "div",
        { className: lstyle$1.settingsDisplayWrapper },
        React__default.createElement(
          "div",
          { className: lstyle$1.settingSet },
          React__default.createElement(
            "div",
            { className: lstyle$1.settingSetGroupPrepend },
            React__default.createElement(
              "button",
              {
                className: lstyle$1.settingSetGroupButton,
                type: "button",
                onClick: this.toggleAudio.bind(this)
              },
              this.state.audioPlaying ? '🔈' : '🔇'
            ),
            React__default.createElement(
              "select",
              {
                className: lstyle$1.settingSetGroupSelect,
                onChange: this.changeMusic.bind(this),
                id: "currentPlayingAudio",
                style: displaySelectStyle
              },
              options
            )
          )
        )
      );
    }
  }]);
  return SettingsDisplay;
}(HUDComponent);

var Wrapper$2 = pizzaJuice.styled("div", {
  d: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",

  size: 74,

  bg: "rgba(0, 0, 0, 0.77)",

  variants: {
    active: {
      true: {
        border: "2px solid $$baseColor"
      },
      false: {
        border: "2px solid $grey-900"
      }
    },
    enemy: {
      true: { $$baseColor: "$colors$red-500" },
      false: {
        $$baseColor: "$colors$green-500"
      }
    }
  }
});

var Overlay$1 = pizzaJuice.styled("div", {
  position: "absolute",
  top: 0,

  size: "$full",
  d: "flex",
  flexDirection: "column",
  justify: "space-between"
});

var Top$1 = pizzaJuice.styled("div", {
  d: "flex",
  flexDirection: "column",

  px: "$1"
});

var Below = pizzaJuice.styled("div", {
  w: 16,
  h: 5,
  bg: "$$baseColor",

  // TODO: damn, diagonal lines in CSS is hard huh?
  variants: {
    enemy: {
      true: { $$baseColor: "$colors$red-500" },
      false: {
        $$baseColor: "$colors$green-500"
      }
    }
  }
});

var CharacterPortrait = function CharacterPortrait(_ref) {
  var character = _ref.character,
      active = _ref.active,
      enemy = _ref.enemy;

  var emptyCharacterImg = "https://neon-district-cdn.s3.amazonaws.com/empty-state/no-character.png";

  var tick = character && character.tick;
  var src = character && character.headImgSrc;

  return React__default.createElement(
    pizzaJuice.Box,
    {
      css: _extends({}, enemy && { transform: "scaleX(-1)" })
    },
    React__default.createElement(
      Wrapper$2,
      { active: active, enemy: enemy },
      React__default.createElement(pizzaJuice.Image, { src: src || emptyCharacterImg, css: {} }),
      React__default.createElement(
        Overlay$1,
        null,
        React__default.createElement(
          Top$1,
          null,
          React__default.createElement(
            pizzaJuice.Text,
            { weight: "medium" },
            tick || 0
          )
        )
      )
    ),
    React__default.createElement(Below, { enemy: enemy })
  );
};

var TurnOrderDisplay = function (_HUDComponent) {
  inherits(TurnOrderDisplay, _HUDComponent);

  function TurnOrderDisplay() {
    classCallCheck(this, TurnOrderDisplay);
    return possibleConstructorReturn(this, (TurnOrderDisplay.__proto__ || Object.getPrototypeOf(TurnOrderDisplay)).apply(this, arguments));
  }

  createClass(TurnOrderDisplay, [{
    key: "constructPortraitOrder",
    value: function constructPortraitOrder() {
      if (!this.units || this.units.length === 0) {
        if (!this.props.teams || !this.props.teams.hasOwnProperty("one") || !this.props.teams.hasOwnProperty("two")) {
          return;
        }

        this.units = [];
        var _arr = [this.props.teams.one, this.props.teams.two];
        for (var _i = 0; _i < _arr.length; _i++) {
          var _team = _arr[_i];
          for (var _prop in _team) {
            this.units.push(_team[_prop]);
          }
        }
      }

      this.units.sort(function (_a, _b) {
        if (_a.stats.HEALTH <= 0 && _b.stats.HEALTH <= 0) {
          if (_a.lastTurnOrder < _b.lastTurnOrder) {
            return -1;
          }
          return 1;
        } else if (_a.stats.HEALTH <= 0) {
          return 1;
        } else if (_b.stats.HEALTH <= 0) {
          return -1;
        }

        if (_a.ticks < _b.ticks) {
          return -1;
        } else if (_b.ticks < _a.ticks) {
          return 1;
        } else {
          if (_a.lastTurnOrder < _b.lastTurnOrder) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      this.constructPortraitOrder();

      if (!this.units || this.units.length === 0) {
        return "";
      }

      var portraits = [];
      for (var idx = 0; idx < this.units.length; idx++) {
        if (this.units[idx].state !== "AWAKE") {
          portraits.push(React__default.createElement(
            pizzaJuice.Box,
            {
              css: {
                position: "relative",
                top: 0,
                width: 80,
                height: 80
              }
            },
            React__default.createElement(CharacterPortrait, {
              character: this.units[idx],
              enemy: this.units[idx].team === "two",
              active: idx === 0
            })
          ));
        } else {
          portraits.push(React__default.createElement(
            pizzaJuice.Box,
            {
              css: {
                position: "relative",
                top: 0,
                width: 80,
                height: 80
              }
            },
            React__default.createElement(CharacterPortrait, {
              character: this.units[idx],
              enemy: this.units[idx].team === "two",
              active: idx === 0
            })
          ));
        }
      }

      /**
       **/

      return React__default.createElement(
        pizzaJuice.Flex,
        {
          gap: 4,
          css: {
            position: "absolute",
            top: 0,
            left: "calc(50% - " + 40 * this.units.length + "px)"
          }
        },
        portraits
      );
    }
  }]);
  return TurnOrderDisplay;
}(HUDComponent);

var VersionDisplay = function (_HUDComponent) {
  inherits(VersionDisplay, _HUDComponent);

  function VersionDisplay() {
    classCallCheck(this, VersionDisplay);
    return possibleConstructorReturn(this, (VersionDisplay.__proto__ || Object.getPrototypeOf(VersionDisplay)).apply(this, arguments));
  }

  createClass(VersionDisplay, [{
    key: "render",
    value: function render() {
      console.log("** Rendering the Version Display **");

      return React__default.createElement(
        pizzaJuice.Text,
        null,
        "Neon District Combat Engine",
        React__default.createElement("br", null),
        React__default.createElement(
          "small",
          null,
          "Alpha - Version 0.5.1"
        )
      );
    }
  }]);
  return VersionDisplay;
}(HUDComponent);

var UnitSelectionFields = function () {
  function UnitSelectionFields(obj) {
    classCallCheck(this, UnitSelectionFields);

    this.getUnitPosition = obj.getUnitPosition;
    this.units = [];
    this.regions = [];
  }

  createClass(UnitSelectionFields, [{
    key: 'setTeams',
    value: function setTeams(teams) {
      this.teams = teams;
      this.units = [];
      if (!this.teams || !this.teams.hasOwnProperty('one') || !this.teams.hasOwnProperty('two')) {
        return;
      }

      var _arr = [this.teams.one, this.teams.two];
      for (var _i = 0; _i < _arr.length; _i++) {
        var _team = _arr[_i];
        for (var _prop in _team) {
          this.units.push(_team[_prop]);
        }
      }
    }
  }, {
    key: 'registerTargetRegions',
    value: function registerTargetRegions() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.units[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var unit = _step.value;

          var position = this.getUnitPosition(unit.character);
          if (!position) {
            continue;
          }

          var region = [Math.round(position.target.x / 2.0), Math.round(position.target.y / 2.0), Math.round((position.target.x + position.target.width) / 2.0), Math.round((position.target.y + position.target.height) / 2.0)];

          this.regions.push({
            target: unit.unitId,
            region: region
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'getRegions',
    value: function getRegions() {
      return this.regions;
    }
  }, {
    key: 'getUnits',
    value: function getUnits() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.units[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var unit = _step2.value;

          if (!unit.hasOwnProperty('position')) {
            unit.position = this.getUnitPosition(unit.character);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this.units;
    }
  }]);
  return UnitSelectionFields;
}();

//import { UnitStatusDisplay } from "./hud/UnitStatusDisplay.jsx";
//import { ScreenCanvasOverlay } from "./hud/ScreenCanvasOverlay.jsx";

var CombatHUD = function () {
  function CombatHUD(renderer, soundManager, activeAnimEvt, getUnitPosition, confirmAction) {
    var _this = this;

    classCallCheck(this, CombatHUD);

    this.renderer = renderer;
    this.soundManager = soundManager;
    this.parentCanvas = this.renderer.domElement;
    this.activeAnimEvt = activeAnimEvt;
    this.getUnitPosition = getUnitPosition;
    this.confirmAction = confirmAction;

    // Create the HUD canvas
    this.div = document.createElement("div");
    this.div.width = this.parentCanvas.width;
    this.div.height = this.parentCanvas.height;

    // Set up the DIV
    this.parentCanvas.parentNode.appendChild(this.div);
    this.div.style.width = this.parentCanvas.style.width;
    this.div.style.height = this.parentCanvas.style.height;
    this.parentCanvas.parentNode.position = "relative";
    this.parentCanvas.style.position = "absolute";
    this.div.style.position = "absolute";

    // Set up the unit target regions
    this.unitSelectionFields = new UnitSelectionFields({
      getUnitPosition: this.getUnitPosition
    });
    this.target = null;

    // Teams & units
    this.teams = null;
    this.units = null;
    this.currentEventIndexCached = null;

    window.addEventListener("clickableRegionsLocked", function () {
      _this.needsUpdate = true;
    });
    window.addEventListener("clickableRegionsUnlocked", function () {
      _this.needsUpdate = true;
    });

    // Needs update
    this.needsUpdate = true;
  }

  createClass(CombatHUD, [{
    key: "setTeams",
    value: function setTeams(teams) {
      this.teams = teams;
      this.translateTeamsToUnits(teams);
      this.needsUpdate = true;
      this.unitSelectionFields.setTeams(teams);
    }
  }, {
    key: "translateTeamsToUnits",
    value: function translateTeamsToUnits(teams) {
      if (!this.units || this.units.length === 0) {
        if (!teams || !teams.hasOwnProperty("one") || !teams.hasOwnProperty("two")) {
          return;
        }

        this.units = [];
        var _arr = [teams.one, teams.two];
        for (var _i = 0; _i < _arr.length; _i++) {
          var _team = _arr[_i];
          for (var _prop in _team) {
            this.units.push(_team[_prop]);
          }
        }
      }
    }
  }, {
    key: "registerTargetRegions",
    value: function registerTargetRegions() {
      this.unitSelectionFields.registerTargetRegions();
    }
  }, {
    key: "setPlayerSelectionsObject",
    value: function setPlayerSelectionsObject(playerSelections) {
      this.playerSelections = playerSelections;
      this.needsUpdate = true;
    }
  }, {
    key: "setError",
    value: function setError(err) {
      this.error = err;
      this.needsUpdate = true;
    }
  }, {
    key: "invalidate",
    value: function invalidate() {
      this.needsUpdate = true;
    }
  }, {
    key: "update",
    value: function update(delta) {
      if (this.playerSelections.getTarget() !== this.target) {
        this.target = this.playerSelections.getTarget();
        this.needsUpdate = true;
      }

      if (this.activeAnimEvt.getCurrentEventIndex() !== this.currentEventIndexCached) {
        this.currentEventIndexCached = this.activeAnimEvt.getCurrentEventIndex();
        this.needsUpdate = true;
      }

      if (!this.needsUpdate) {
        return;
      }
      this.needsUpdate = false;

      console.log("** Rendering the Entire HUD **");

      var cssReset = pizzaJuice.globalCss({
        "*, *:before, *:after": {
          boxSizing: "border-box"
        }
      });

      cssReset();

      ReactDOM.render(React__default.createElement(
        pizzaJuice.Box,
        {
          css: {
            font: "7.5px 'titillium Web', sans-serif",
            textTransform: "uppercase",
            margin: 0
          }
        },
        React__default.createElement(
          pizzaJuice.Flex,
          { justify: "between" },
          React__default.createElement(VersionDisplay, null),
          React__default.createElement(SettingsDisplay, { soundManager: this.soundManager }),
          React__default.createElement(TurnOrderDisplay, { teams: this.teams, units: this.units })
        ),
        React__default.createElement(PlayerTargetMap, {
          unitSelectionFields: this.unitSelectionFields,
          playerSelections: this.playerSelections
        }),
        React__default.createElement(CharacterStatuses, {
          unitSelectionFields: this.unitSelectionFields,
          playerSelections: this.playerSelections,
          activeAnimEvt: this.activeAnimEvt
        }),
        React__default.createElement(PlayerControlsDisplay, {
          confirmAction: this.confirmAction,
          teams: this.teams,
          units: this.units,
          playerSelections: this.playerSelections
        }),
        React__default.createElement(ErrorDisplay, { error: this.error })
      ), this.div);
    }
  }]);
  return CombatHUD;
}();

var PlayerSelections = function () {
  function PlayerSelections(_characters) {
    classCallCheck(this, PlayerSelections);

    this.characters = _characters;
    this.clear();
  }

  createClass(PlayerSelections, [{
    key: 'clear',
    value: function clear() {
      this.action = null;
      this.target = null;
      this.cards = [{}, {}, {}];
      this.taunted = false;
      this.taunter = null;
    }
  }, {
    key: 'hasSelections',
    value: function hasSelections() {
      return this.cards && this.cards.length && Object.keys(this.cards[0]).length > 0 && this.cards[0].constructor === Object;
    }
  }, {
    key: 'setCards',
    value: function setCards(_cards) {
      this.cards = JSON.parse(JSON.stringify(_cards));
    }
  }, {
    key: 'getCards',
    value: function getCards() {
      return this.cards;
    }
  }, {
    key: 'getCard',
    value: function getCard(_cardIdx) {
      if (this.cards.length > _cardIdx && _cardIdx >= 0) {
        return this.cards[_cardIdx];
      }
      return false;
    }
  }, {
    key: 'validateActionSelect',
    value: function validateActionSelect(_option) {
      if (['attack', 'card0', 'card1', 'card2', 'replace'].indexOf(_option) === -1) {
        return false;
      }

      if (_option === 'attack' || _option === 'replace') {
        return true;
      }

      var cardIdx = _option.replace(/^card/, '');
      var card = this.getCard(cardIdx);

      // Disallow selecting effects, fillers, or interacts
      if (!card || !card.hasOwnProperty('type') || card.type.toLowerCase() === 'effect' || card.type.toLowerCase() === 'filler' || card.type.toLowerCase() === 'interact') {
        return false;
      }

      // If taunted, disallow selecting anything except attacks
      if (this.isTaunted() && card.type.toLowerCase() !== 'attack') {
        return false;
      }

      return true;
    }
  }, {
    key: 'setAction',
    value: function setAction(_option) {
      if (['attack', 'card0', 'card1', 'card2', 'replace'].indexOf(_option) !== -1) {
        this.action = _option;
      }
    }
  }, {
    key: 'getAction',
    value: function getAction() {
      return this.action;
    }
  }, {
    key: 'validateTargetSelect',
    value: function validateTargetSelect(_target) {
      _target = _target.replace(/target-/, '');

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.characters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var char = _step.value;

          if (char.unit.unitId === _target && char.unit.state === 'UNCONSCIOUS') {
            return false;
          }

          if (this.isTaunted() && this.getTaunter() !== _target) {
            return false;
          }
        }

        // Must be updated to consider actual targets for the given action
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!_target) {
        return false;
      }

      return true;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(_target) {
      _target = _target.replace(/target-/, '');

      this.target = _target;
    }
  }, {
    key: 'getTarget',
    value: function getTarget() {
      return this.target;
    }
  }, {
    key: 'isTaunted',
    value: function isTaunted() {
      return this.taunted;
    }
  }, {
    key: 'setTaunter',
    value: function setTaunter(taunter) {
      this.taunter = taunter;
      this.taunted = !!taunter;
    }
  }, {
    key: 'getTaunter',
    value: function getTaunter() {
      return this.taunter;
    }
  }]);
  return PlayerSelections;
}();

var socketIOClient = require('socket.io-client');

var Socket = function () {
  function Socket(_endpoint, _channel) {
    classCallCheck(this, Socket);

    this.socket = socketIOClient(_endpoint + "/combat", {
      withCredentials: true
    });
    this.connectToChannel(_channel);
  }

  createClass(Socket, [{
    key: 'connectToChannel',
    value: function connectToChannel(channel) {
      this.socket.emit('join', channel);
    }
  }, {
    key: 'setGetResponse',
    value: function setGetResponse(callback) {
      this.socket.on("getResponse", callback);
    }
  }, {
    key: 'setOptionsResponse',
    value: function setOptionsResponse(callback) {
      this.socket.on("optionsResponse", callback);
    }
  }, {
    key: 'get',
    value: function get$$1(channel, data) {
      this.socket.emit("get", channel);
    }
  }, {
    key: 'create',
    value: function create(teamId, data) {
      this.socket.emit("create", teamId, data);
    }
  }, {
    key: 'run',
    value: function run(channel, data) {
      this.socket.emit("run", channel, data);
    }
  }]);
  return Socket;
}();

var CombatAnalysis = function () {
  function CombatAnalysis() {
    classCallCheck(this, CombatAnalysis);
  }

  createClass(CombatAnalysis, null, [{
    key: "hasTaunt",
    value: function hasTaunt(unit) {
      return unit && unit.statusEffects.TAUNT > 0 && unit.statusEffectTargets.TAUNT;
    }
  }, {
    key: "getTaunter",
    value: function getTaunter(unit) {
      if (this.hasTaunt(unit)) {
        return unit.statusEffectTargets.TAUNT;
      }
    }
  }]);
  return CombatAnalysis;
}();

var CombatPlayer = function (_CombatScene) {
  inherits(CombatPlayer, _CombatScene);

  function CombatPlayer(props) {
    classCallCheck(this, CombatPlayer);

    var _this = possibleConstructorReturn(this, (CombatPlayer.__proto__ || Object.getPrototypeOf(CombatPlayer)).call(this, props));

    _this.state = {
      owner: null
    };

    // Keep track of combat information
    _this.combatApi = props.combatApi;
    _this.combatSocket = props.combatSocket;
    _this.battleId = props.battleId;
    _this.playback = props.hasOwnProperty("playback") ? props.playback : true;
    _this.teamId = props.teamId;
    _this.createOptions = props.createOptions;
    _this.perks = props.perks;

    _this.nextTeam;
    _this.nextUnit;

    // API for combat calls
    if (_this.combatApi) {
      _this.api = new Api(_this.combatApi);
    } else if (_this.combatSocket) {
      _this.socket = new Socket(_this.combatSocket, _this.battleId);
      _this.socket.setGetResponse(_this.getCombatResponse.bind(_this));
      _this.socket.setOptionsResponse(_this.getOptionsResponse.bind(_this));
    }

    // Keep track of the UI
    _this.userInterface = null;

    // Music
    _this.combatMusic = null;

    // Player Selections
    _this.playerSelections = new PlayerSelections(_this.characters);

    // Keeping track of events that have been played,
    // current state, and events to play
    _this.teams = null;

    // Keep track of events
    _this.lastRenderedEventBlockUuid = null;
    _this.eventBlocksIds = [];
    _this.eventBlocks = [];
    _this.battleComplete = false;

    // Keep track of clickable regions & ability to use them
    _this.clickableRegions = {};
    _this.clickLock = true;

    // Monitor changes to clickable regions
    window.addEventListener("registerClickableRegion", _this.handleClickableRegion.bind(_this));
    window.addEventListener("unregisterClickableRegion", _this.handleRemoveClickableRegion.bind(_this));
    window.addEventListener("lockClickableRegions", _this.lockClickableRegions.bind(_this));
    window.addEventListener("unlockClickableRegions", _this.unlockClickableRegions.bind(_this));
    window.addEventListener("eventBlockComplete", _this.moveToNextEventBlock.bind(_this));
    return _this;
  }

  createClass(CombatPlayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      get(CombatPlayer.prototype.__proto__ || Object.getPrototypeOf(CombatPlayer.prototype), "componentDidMount", this).call(this, arguments);

      // Initialize with the background music
      if (this.soundManager.hasSound("music", "aspire-combat-loop")) {
        this.combatMusic = this.soundManager.play("music", "aspire-combat-loop", 0.15, true);
      }

      // Draw Game UI elements
      this.userInterface = new CombatHUD(this.renderer, this.soundManager, this.animationController.getActiveAnimationEventObject(), this.getUnitPosition.bind(this), this.confirmAction.bind(this));

      // Update the HUD to use the player selection object
      this.userInterface.setPlayerSelectionsObject(this.playerSelections);

      // Pull the initial battle state
      if (this.battleId && this.battleId !== "practice" && this.battleId !== "test") {
        if (this.api) {
          this.getCombatApi();
        } else if (this.socket) {
          this.getCombatSocket();
        }
      } else if (this.battleId && (this.battleId === "practice" || this.battleId === "test")) {
        if (this.api) {
          this.createCombatApi();
        } else if (this.socket) {
          this.createCombatSocket();
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (get(CombatPlayer.prototype.__proto__ || Object.getPrototypeOf(CombatPlayer.prototype), "hasOwnProperty", this).call(this, "componentDidUpdate")) {
        get(CombatPlayer.prototype.__proto__ || Object.getPrototypeOf(CombatPlayer.prototype), "componentDidUpdate", this).call(this, arguments);
      }

      console.log("Component Did Update call");

      if (!this.battleComplete) {
        if (this.playerSelections.hasSelections()) {
          this.unlockClickableRegions();
        }

        this.userInterface.registerTargetRegions();
        this.userInterface.invalidate();
      }
    }
  }, {
    key: "handleClickableRegion",
    value: function handleClickableRegion(e) {
      this.clickableRegions[e.detail.option] = e.detail.region;
    }
  }, {
    key: "handleRemoveClickableRegion",
    value: function handleRemoveClickableRegion(e) {
      if (this.clickableRegions.hasOwnProperty(e.detail.option)) {
        delete this.clickableRegions[e.detail.option];
      }
    }
  }, {
    key: "clickableRegionsLocked",
    value: function clickableRegionsLocked() {
      return this.clickLock || this.battleComplete;
    }
  }, {
    key: "lockClickableRegions",
    value: function lockClickableRegions() {
      console.log("Clickable regions are locked");

      // Alert the HUD
      window.dispatchEvent(new CustomEvent("clickableRegionsLocked", {}));

      this.clickLock = true;
    }
  }, {
    key: "unlockClickableRegions",
    value: function unlockClickableRegions(e) {
      if (e && e.detail && e.detail.event === "BattleCompleteEvent" || this.battleComplete) {
        console.log("Battle completed, will not unlock clickable regions");
        return;
      }

      console.log("Clickable regions are unlocked");

      // Alert the HUD
      window.dispatchEvent(new CustomEvent("clickableRegionsUnlocked", {}));

      this.clickLock = false;
    }
  }, {
    key: "confirmAction",
    value: function confirmAction() {
      // Pull the action and target
      var action = this.playerSelections.getAction();
      var target = this.playerSelections.getTarget();

      // If the action or target is invalid, disallow
      if (action === false || action === null) {
        return;
      }

      if (target === null) {
        target = "none";
      }

      // Lock the HUD
      this.lockClickableRegions();

      // Run combat
      if (this.api) {
        this.runCombatApi(action, target);
      } else if (this.socket) {
        this.runCombatSocket(action, target);
      }
    }
  }, {
    key: "getCombatApi",
    value: function getCombatApi() {
      if (!this.battleId) {
        console.log("No battle ID provided.");
        return;
      }

      this.api.getBattle({
        battleId: this.battleId
      }, this.getCombatResponse.bind(this), this.handleErrorResponse.bind(this));
    }
  }, {
    key: "createCombatApi",
    value: function createCombatApi() {
      if (!this.teamId) {
        console.log("No team ID provided.");
        return;
      }

      this.api.createBattle({
        teamId: this.teamId,
        createOptions: this.createOptions
      }, this.getCombatResponse.bind(this), this.handleErrorResponse.bind(this));
    }
  }, {
    key: "runCombatApi",
    value: function runCombatApi(action, target) {
      if (!this.battleId) {
        console.log("No battle ID provided.");
        return;
      }

      this.playerSelections.clear();

      this.api.runBattle({
        battleId: this.battleId,
        action: action,
        target: target
      }, this.getCombatResponse.bind(this), this.handleErrorResponse.bind(this));
    }
  }, {
    key: "getCombatSocket",
    value: function getCombatSocket() {
      if (!this.battleId) {
        console.log("No battle ID provided.");
        return;
      }

      this.socket.get(this.battleId);
    }
  }, {
    key: "createCombatSocket",
    value: function createCombatSocket() {
      if (!this.teamId) {
        console.log("No team ID provided.");
        return;
      }

      this.socket.create(this.teamId, this.createOptions);
    }
  }, {
    key: "runCombatSocket",
    value: function runCombatSocket(action, target) {
      if (!this.battleId) {
        console.log("No battle ID provided.");
        return;
      }

      this.playerSelections.clear();

      this.socket.run(this.battleId, { action: action, target: target });
    }
  }, {
    key: "getCombatResponse",
    value: function getCombatResponse(response) {
      // Verify the response is valid
      if (!response || !response.data || !response.data.hasOwnProperty("data") || !response.data.hasOwnProperty("status") || response.data.status !== 200) {
        console.error("Could not retrieve battle information:");
        console.error(response.data);
        return;
      }

      // Pull the data out
      var data = response.data.data;

      if (data.error) {
        console.log("Error:", data.error);
        this.userInterface.setError(data.error);
      } else {
        this.userInterface.setError(null);
      }

      // Handle any preparation work if needed
      if (this.battleId != data.battleId) {
        console.warn("Setting new Battle ID (" + data.battleId + ") from previous (" + this.battleId + ")");

        // Update the battle ID
        this.battleId = data.battleId;

        // May need to listen to new channel
        if (this.socket) {
          this.socket.connectToChannel(this.battleId);
        }

        this.setState({ owner: data.owner });
        // Emit event for any front-end to capture data
        window.dispatchEvent(new CustomEvent("getBattleInformation", {
          detail: {
            battleId: data.battleId
          }
        }));

        // Pass off to the controller
        if (this.playback) {
          this.updateBattleEvents(data);
        } else {
          this.setLatestBattleEvents(data);
        }
      } else {
        // First load, so skip playback if requested
        if (!this.teams && !this.playback) {
          this.setLatestBattleEvents(data);
        } else {
          this.updateBattleEvents(data);
        }
      }
    }
  }, {
    key: "getOptionsResponse",
    value: function getOptionsResponse(response) {
      // Verify the response is valid
      if (!response || !response.data || !response.data.hasOwnProperty("data") || !response.data.hasOwnProperty("status") || response.data.status !== 200) {
        console.error("Could not retrieve battle information:");
        console.error(response.data);
        return;
      }

      // Pull the data out
      var data = response.data.data;

      // Pass off to the controller
      this.playerSelections.clear();

      // Set the latest options for the player
      if (data.options && data.options.length) {
        this.playerSelections.setCards(data.options);
      }

      // If we received an error back but still have selections, unlock
      if (!this.battleComplete && this.playerSelections.hasSelections() && data.hasOwnProperty("error")) {
        this.unlockClickableRegions();
      }

      this.userInterface.invalidate();
    }
  }, {
    key: "handleErrorResponse",
    value: function handleErrorResponse(error) {
      console.error("error");
      console.error(error);
      this.playerSelections.clear();
      this.unlockClickableRegions();
    }
  }, {
    key: "updateBattleEvents",
    value: function updateBattleEvents(data) {
      // Set any initial information
      if (!this.teams && data.teams) {
        if (this.playback && data.hasOwnProperty("events") && data.events && Array.isArray(data.events) && data.events.length > 0 && data.events[0].hasOwnProperty("teams")) {
          // If we're playing back, we need the team state at the first event we're playing back
          this.setTeams(data.events[0].teams);
        } else {
          // If we're not playing back, set the latest team data
          this.setTeams(data.teams);
        }
      } else if (data.teams) {
        this.updateTeams(data.teams);
      }

      // Set the latest options for the player
      if (data.options && data.options.length) {
        this.playerSelections.setCards(data.options);
      }

      this.nextTeam = data.nextTeam;
      this.nextUnit = data.nextUnit;

      // Determine if we have new events to render
      var hasNewEvents = false;
      if (data.hasOwnProperty("events")) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _block = _step.value;

            if (this.eventBlocksIds.indexOf(_block.uuid) === -1) {
              // Add event blocks to the record
              this.eventBlocksIds.push(_block.uuid);
              this.eventBlocks.push(_block);
              hasNewEvents = true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (hasNewEvents) {
        this.renderEventBlocks();
      } else if (!this.battleComplete) {
        if (this.playerSelections.hasSelections()) {
          this.unlockClickableRegions();
        }
      }
    }
  }, {
    key: "setLatestBattleEvents",
    value: function setLatestBattleEvents(data) {
      // Set any initial information
      if (!this.teams && data.teams) {
        this.setTeams(data.teams);
      } else if (data.teams) {
        this.updateTeams(data.teams);
      }

      // Set the latest options for the player
      if (data.options && data.options.length) {
        this.playerSelections.setCards(data.options);
      }

      // Determine if we have new events to render
      var last_block_uuid = void 0;
      if (data.hasOwnProperty("events")) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = data.events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _block = _step2.value;

            if (this.eventBlocksIds.indexOf(_block.uuid) === -1) {
              // Add event blocks to the record
              last_block_uuid = _block.uuid;
              this.eventBlocksIds.push(_block.uuid);
              this.eventBlocks.push(_block);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      this.lastRenderedEventBlockUuid = last_block_uuid;
      this.renderEventBlocks();
      if (!this.battleComplete) {
        if (this.playerSelections.hasSelections()) {
          this.unlockClickableRegions();
        }
      }
    }
  }, {
    key: "setTeams",
    value: function setTeams(teams) {
      this.teams = teams;

      // Update all characters to include their UUIDs
      // Update all team members to link back to their character
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.characters[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _character = _step3.value;
          var _arr = ["one", "two"];

          for (var _i = 0; _i < _arr.length; _i++) {
            var _teamIdx = _arr[_i];
            var _team = this.teams[_teamIdx];
            for (var _unitIdx in _team) {
              var _unit = _team[_unitIdx];
              if (_unit.metadata.nftId === _character.nftId) {
                // Set matching information
                _character.unitId = _unit.unitId;
                _character.unit = _unit;
                _unit.character = _character;

                // Pull in the head image
                this.loadHeadImage(_unit);
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.userInterface.setTeams(this.teams);
    }
  }, {
    key: "getNftUrlRoot",
    value: function getNftUrlRoot(_unit) {
      var urlRoot = "https://neon-district-season-one.s3.amazonaws.com/nfts/";
      if (_unit && (typeof _unit === "undefined" ? "undefined" : _typeof(_unit)) === "object" && _unit.hasOwnProperty("character") && _unit.character.hasOwnProperty("nftId") && _unit.character.nftId.indexOf("ai-practice") === 0) {
        return urlRoot + "ai-practice/";
      }

      if (window.location.href.indexOf("https://portal.neondistrict.io") === 0 || window.location.href.indexOf("https://rc.portal.neondistrict.io") === 0) {
        return urlRoot + "mainnet/";
      } else {
        return urlRoot + "testnet/";
      }
    }
  }, {
    key: "loadHeadImage",
    value: function loadHeadImage(_unit) {
      /**
      This is not at all how I'd like to handle this, but the following does not work with S3:
        _unit.headImg = new Image();
        _unit.headImg.crossOrigin = "anonymous";
       Because sometimes, when caching is used, some images will not come back with the necessary origin headers,
      and the images aren't loaded.
       Furthermore, not setting crossOrigin breaks the canvas: "Tainted canvases may not be loaded."
       And setting use-credentials just breaks everything.
       So instead we need to force S3 to always return the origin header.
      **/

      /*
      // Old method
      _unit.headImg = new Image();
      _unit.headImg.crossOrigin = "anonymous";
      _unit.headImg.addEventListener('load', (function() {
        _unit.headImgLoaded = true;
      }).bind(this));
      _unit.headImg.addEventListener('error', (function() {
        console.error("Unable to load image for", _unit);
      }).bind(this));
      */

      var urlRoot = this.getNftUrlRoot(_unit);
      var src = urlRoot + _unit.metadata.nftId + "-headshot.png";
      _unit.headImgSrc = src;

      /*
      const options = {
        cache: 'no-cache',
        //mode: 'cors'
        //credentials: 'same-origin'
      };
       fetch(src, options)
        .then(res => res.blob())
        .then(blob => {
          _unit.headImg = new Image();
          _unit.headImg.crossOrigin = "anonymous";
          _unit.headImg.addEventListener('load', (function() {
            _unit.headImgLoaded = true;
          }).bind(this));
          _unit.headImg.src = URL.createObjectURL(blob);
      });
      */
    }
  }, {
    key: "updateTeams",
    value: function updateTeams(teams) {
      var _arr2 = ["one", "two"];

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var _teamIdx = _arr2[_i2];
        for (var _unitIdx in this.teams[_teamIdx]) {
          var _unit = this.teams[_teamIdx][_unitIdx];

          if (teams && teams.hasOwnProperty(_teamIdx) && teams[_teamIdx].hasOwnProperty(_unitIdx)) {
            var _unitUpdate = teams[_teamIdx][_unitIdx];

            // Update all stats
            if (_unitUpdate.hasOwnProperty("ticks")) {
              _unit.ticks = _unitUpdate.ticks;
            }

            if (_unitUpdate.hasOwnProperty("lastTurnOrder")) {
              _unit.lastTurnOrder = _unitUpdate.lastTurnOrder;
            }

            if (_unitUpdate.hasOwnProperty("stats")) {
              for (var _prop in _unitUpdate.stats) {
                if (_prop !== "HEALTH") {
                  _unit.stats[_prop] = _unitUpdate.stats[_prop];
                }
              }
            }

            if (_unitUpdate.hasOwnProperty("state")) {
              _unit.state = _unitUpdate.state;
            }

            if (_unitUpdate.hasOwnProperty("statsMax")) {
              for (var _prop2 in _unitUpdate.statsMax) {
                _unit.statsMax[_prop2] = _unitUpdate.statsMax[_prop2];
              }
            }

            if (_unitUpdate.hasOwnProperty("statusEffects")) {
              for (var _prop3 in _unitUpdate.statusEffects) {
                _unit.statusEffects[_prop3] = _unitUpdate.statusEffects[_prop3];
              }
            }
          }
        }
      }

      this.userInterface.invalidate();
    }
  }, {
    key: "renderEventBlocks",
    value: function renderEventBlocks() {
      // Get the next block
      var nextIndex = 1 + this.eventBlocksIds.indexOf(this.lastRenderedEventBlockUuid);

      // If this block is beyond the last block, then we're done
      if (nextIndex >= this.eventBlocks.length) {
        this.postAnimationCleanup();
        return;
      }

      // Pull the block, register the animation events
      var block = this.eventBlocks[nextIndex];

      // Update the teams
      if (block.teams) {
        this.updateTeams(block.teams);
      }

      // If the battle is complete, we need to know this
      this.checkBattleComplete(block);

      // Perform the animation cycle
      this.runAnimationEventCycle(block);
    }
  }, {
    key: "moveToNextEventBlock",
    value: function moveToNextEventBlock() {
      // When we're done, update the last rendered event block, and render the next block
      if (1 + this.eventBlocksIds.indexOf(this.lastRenderedEventBlockUuid) < this.eventBlocks.length) {
        this.lastRenderedEventBlockUuid = this.eventBlocks[1 + this.eventBlocksIds.indexOf(this.lastRenderedEventBlockUuid)].uuid;
      }

      this.renderEventBlocks();
    }
  }, {
    key: "checkBattleComplete",
    value: function checkBattleComplete(block) {
      if (block.battleEvents.filter(function (_evt) {
        return _evt.name === "BattleCompleteEvent";
      }).length > 0) {
        var winner = void 0;
        for (var idx = 0; idx < block.battleEvents.length; idx++) {
          var event = block.battleEvents[idx];
          if (event.name === "BattleCompleteEvent") {
            winner = event.winner;
          }
        }

        // Alert the HUD
        window.dispatchEvent(new CustomEvent("battleComplete", {
          detail: {
            winner: winner,
            owner: this.state.owner
          }
        }));

        console.log("Battle is completed");
        this.battleComplete = true;

        // Play victory music
        this.combatMusic.stop();
        if (this.soundManager.hasSound("music", "aspire-combat-loop")) {
          this.combatMusic = this.soundManager.play("music", "aspire-combat-victory", 0.15, false);
        }
      }
    }
  }, {
    key: "postAnimationCleanup",
    value: function postAnimationCleanup() {
      if (!this.battleComplete) {
        if (this.playerSelections.hasSelections() && CombatAnalysis.hasTaunt(this.nextUnit)) {
          var taunter = CombatAnalysis.getTaunter(this.nextUnit);

          // Make sure that the card selected is a valid choice
          if (this.playerSelections.validateTargetSelect(taunter)) {
            // Set the taunter as the default target
            this.playerSelections.setTarget(taunter);
            this.playerSelections.setTaunter(taunter);
          }
        }

        if (this.playerSelections.hasSelections()) {
          this.unlockClickableRegions();
        }
      }
    }
  }]);
  return CombatPlayer;
}(CombatScene);

var CharacterEquipment = function (_SpineScene) {
  inherits(CharacterEquipment, _SpineScene);

  function CharacterEquipment(props) {
    classCallCheck(this, CharacterEquipment);
    return possibleConstructorReturn(this, (CharacterEquipment.__proto__ || Object.getPrototypeOf(CharacterEquipment)).call(this, props));
  }

  createClass(CharacterEquipment, [{
    key: "defaultCameraPosition",
    value: function defaultCameraPosition() {
      return { "x": 0, "y": 150, "z": 200 };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      get(CharacterEquipment.prototype.__proto__ || Object.getPrototypeOf(CharacterEquipment.prototype), "componentDidMount", this).call(this, arguments);

      // Drones
      var drone = ["", ""];
      if (this.isDroneWeapon(this.props["weapon"])) {
        drone = [this.props["weapon"], this.props["weaponRarity"]];
      }

      // Preload all skeleton & atlas files
      this.character = new SpineCharacter(this.assetManager, this.props.jsonFile || "spine-output/character/MediumMaleHeavySkinTest.json");
      this.drone = new SpineDrone(this.assetManager, "spine-output/weapons/Blkpartnerdrone.json", drone[0], drone[1], -1);

      // Begin the animation
      requestAnimationFrame(this.loadSkeletons.bind(this));
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps) {
      for (var _prop in nextProps) {
        if (this.props[_prop] !== nextProps[_prop]) {
          if (_prop === 'animation') {
            this.character.setAnimation(nextProps[_prop]);
          } else if (_prop === 'skinTone') {
            this.character.setSkinTone(nextProps["skinTone"]);
          } else if (_prop === 'gender') {
            this.character.setSkin(nextProps["gender"] === 'male' ? 'Male' : 'Female');
            this.character.loadGear("head", nextProps["head"], nextProps["gender"], nextProps["headRarity"], nextProps["headVariant"]);
            this.character.loadGear("body", nextProps["body"], nextProps["gender"], nextProps["bodyRarity"], nextProps["bodyVariant"]);
            this.character.loadGear("arms", nextProps["arms"], nextProps["gender"], nextProps["armsRarity"], nextProps["armsVariant"]);
            this.character.loadGear("legs", nextProps["legs"], nextProps["gender"], nextProps["legsRarity"], nextProps["legsVariant"]);
          } else if (_prop.indexOf("head") !== -1) {
            this.character.loadGear("head", nextProps["head"], nextProps["gender"], nextProps["headRarity"], nextProps["headVariant"]);
          } else if (_prop.indexOf("body") !== -1) {
            this.character.loadGear("body", nextProps["body"], nextProps["gender"], nextProps["bodyRarity"], nextProps["bodyVariant"]);
          } else if (_prop.indexOf("arms") !== -1) {
            this.character.loadGear("arms", nextProps["arms"], nextProps["gender"], nextProps["armsRarity"], nextProps["armsVariant"]);
          } else if (_prop.indexOf("legs") !== -1) {
            this.character.loadGear("legs", nextProps["legs"], nextProps["gender"], nextProps["legsRarity"], nextProps["legsVariant"]);
          } else if (_prop.indexOf("weapon") !== -1) {
            this.character.loadGear("weapon", nextProps["weapon"], nextProps["gender"], nextProps["weaponRarity"], nextProps["weaponVariant"]);

            // Create the Drone object if needed
            if (nextProps["weapon"] && this.isDroneWeapon(nextProps["weapon"])) {
              this.drone.setDrone(nextProps["weapon"], nextProps["weaponRarity"]);
              this.drone.clearTexture();
              this.drone.loadDroneImage();
            } else {
              this.drone.clearTexture();
              this.drone.renderTexture();
            }
          }
        }
      }
    }
  }, {
    key: "isDroneWeapon",
    value: function isDroneWeapon() {
      var weapon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      return drones.hasOwnProperty(weapon);
    }
  }, {
    key: "loadSkeletons",
    value: function loadSkeletons(atlasFile, skeletonFile) {
      if (this.assetManager.isLoadingComplete()) {

        this.setSkeletons([this.drone.createMesh(-20, -300, false, 0.132), this.character.createMesh(this.props.gender === 'male' ? 'Male' : 'Female', this.props.animation, 0, 40, false, 0.12)]);

        // Create the character's canvas before loading gear
        this.character.createCanvas();

        // Set all available parts
        var _arr = ["head", "body", "arms", "legs", "weapon"];
        for (var _i = 0; _i < _arr.length; _i++) {
          var part = _arr[_i];
          if (!this.props.skipPart || !Array.isArray(this.props.skipPart) || this.props.skipPart.indexOf(part) === -1) {
            this.character.loadGear(part, this.props[part], this.props.gender, this.props[part + "Rarity"], this.props[part + "Variant"]);
          }
        }

        // Set the skin tone
        if (!this.props.skipSkinTone) {
          this.character.setSkinTone(this.props.skinTone);
        }

        // Hide drone
        this.drone.createCanvas();
        this.drone.clearTexture();
        this.drone.renderTexture();

        // Load drone image if possible
        if (this.drone.drone && this.drone.rarity) {
          this.drone.loadDroneImage();
        }

        requestAnimationFrame(this.load.bind(this));
      } else requestAnimationFrame(this.loadSkeletons.bind(this));
    }
  }]);
  return CharacterEquipment;
}(SpineScene);

/**
 * Requirement:
 *   Because spine-ts does not have an NPM module we can use, we need to import it directly.
 *   However, it requires that THREE is in globals, and I've not found a way to do this,
 *   because imports are async and namespaced, and rollup doesn't inject packages into global
 *   namespace, so we need to manually include THREE and spine at the root of the parent project.
 *
 */

exports.NDCombatScene = CombatScene;
exports.NDCombatPlayer = CombatPlayer;
exports.NDCharacterEquipment = CharacterEquipment;
//# sourceMappingURL=index.js.map
