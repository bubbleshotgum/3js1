/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/SmoothControls.js":
/*!******************************!*\
  !*** ./js/SmoothControls.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SmoothControls\": () => (/* binding */ SmoothControls)\n/* harmony export */ });\nclass SmoothControls {\n\n\tconstructor( object, autoEmbarkOnInit=false, scale=false, translate=true) {\n\t\tconst scope = this\n\t\tthis.object = object\n\t\tthis.embarked = false\n\t\tthis.transformSpeed = 1.2\n\t\tthis.dynamicDampingFactor = 0.1\n\t\t//READONLY------------------------\n\t\tthis.translateX = translate\n\t\tthis.translateY = translate\n\t\tthis.translateZ = translate\n\t\tthis.translate = [translate, translate, translate]\n\t\tthis.scaleX = scale\n\t\tthis.scaleY = scale\n\t\tthis.scaleZ = scale\n\t\tthis.scale = [scale, scale, scale]\n\t\t//--------------------------------\n\t\tthis.minPos = 1\n\t\tthis.maxPos = Infinity\n\t\tthis.minScale = 1\n\t\tthis.maxScale = 2\n\n\t\tlet _translateStart = 0\n\n\t\tthis.update = function () {\n\t\t\tconst coords = [\"x\", \"y\", \"z\"]\n            let factor = 1.0 - _translateStart * scope.transformSpeed\n            if ( factor !== 1.0 && factor > 0.0 ) {\n\t\t\t\tfor(let i = 0; i < 3; i++)\n\t\t\t\t{\n\t\t\t\t\tif(scope.scale[i])\n\t\t\t\t\tscope.object.scale[coords[i]] = \n\t\t\t\t\t\tscope.object.scale[coords[i]] / factor > scope.minScale\n\t\t\t\t\t\t&& scope.object.scale[coords[i]] / factor < scope.maxScale ?\n\t\t\t\t\t\tscope.object.scale[coords[i]] / factor : \n\t\t\t\t\t\tscope.object.scale[coords[i]] / factor < scope.maxScale ? scope.minScale : scope.maxScale\n\t\t\t\t\tif(scope.translate[i])\n\t\t\t\t\tscope.object.position[coords[i]] = \n\t\t\t\t\tscope.object.position[coords[i]] * factor > scope.minPos \n\t\t\t\t\t\t&& scope.object.position[coords[i]] * factor < scope.maxPos ?\n\t\t\t\t\t\tscope.object.position[coords[i]] * factor : \n\t\t\t\t\t\tscope.object.position[coords[i]] * factor < scope.maxPos ? scope.minPos : scope.maxPos\n\t\t\t\t}\n                _translateStart -= _translateStart * scope.dynamicDampingFactor\n\t\t\t}\n\t\t}\n\n\t\tfunction onMouseWheel( event ) {\n\t\t\tevent.preventDefault()\n            _translateStart += event.deltaY * 0.00025\n\t\t}\n\t\tthis.setScale = function(x, y, z) {\n\t\t\tscope.scaleX = x\n\t\t\tscope.scaleY = y\n\t\t\tscope.scaleZ = z\n\t\t\tscope.scale = [x, y, z]\n\t\t}\n\t\tthis.setTranslate = function(x, y, z) {\n\t\t\tscope.translateX = x\n\t\t\tscope.translateY = y\n\t\t\tscope.translateZ = z\n\t\t\tscope.translate = [x, y, z]\n\t\t} \n\t\tthis.dispose = function() {\n\t\t\twindow.removeEventListener( 'wheel', onMouseWheel )\n\t\t\tthis.embarked = false\n\t\t}\n\t\tthis.embark = function() {\n\t\t\twindow.addEventListener( 'wheel', onMouseWheel, { passive: false } )\n\t\t\tthis.embarked = true\n\t\t}\n\n\t\tif(autoEmbarkOnInit)\n\t\t\tthis.embark()\n\t\tthis.update()\n\t}\n}\n\n\n\n//# sourceURL=webpack:///./js/SmoothControls.js?");

/***/ }),

/***/ "./js/app.js":
/*!*******************!*\
  !*** ./js/app.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _SmoothControls_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SmoothControls.js */ \"./js/SmoothControls.js\");\n/* harmony import */ var _three_module_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./three.module.js */ \"./js/three.module.js\");\n\n\n\nconst ASIMPTOTE = 100\nconst scene = new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.Scene()\nconst camera = new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )\nconst renderer = new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer({alpha: true})\nconst controls = new _SmoothControls_js__WEBPACK_IMPORTED_MODULE_0__.SmoothControls(camera)\ncontrols.setTranslate(false, false, true)\ncontrols.maxPos = ASIMPTOTE + 6\n\nscene.background = new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.Color(0xffffff)\nrenderer.setSize( window.innerWidth, window.innerHeight )\ndocument.body.appendChild( renderer.domElement )\n\nconst tLoader = new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.TextureLoader()\nconst PATH_TO_PIXTURES = \"../assets/pictures/\"\nlet assetsTextures = [\n\t\ttLoader.load(PATH_TO_PIXTURES + 'asset1.png'),\n\t\ttLoader.load(PATH_TO_PIXTURES + 'asset2.jpeg')\n\t],\n\tdropsTextures = [\n\t\ttLoader.load(PATH_TO_PIXTURES + 'drop1.png'),\n\t\ttLoader.load(PATH_TO_PIXTURES + 'drop2.png')\n\t],\n\tlogoTexture = tLoader.load(PATH_TO_PIXTURES + 'logo.png')\n\nlet assetsObjects = [],\n\tdrops = [],\n\tdropControls = [],\n\n\tlogo = new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.Mesh(\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.CircleBufferGeometry(1.8, 32),\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({map: logoTexture})\n\t),\n\tlogoBackground = new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.Mesh(\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry(window.innerWidth, window.innerHeight),\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({color: 0xffffff})\n\t),\n\tlogoScaler = new _SmoothControls_js__WEBPACK_IMPORTED_MODULE_0__.SmoothControls(logo, true)\nlogo.position.z = ASIMPTOTE\nlogoBackground.position.z = ASIMPTOTE -.0005\nlogoScaler.setTranslate(false, false, false)\nlogoScaler.setScale(true, true, false)\nlogoScaler.maxScale = 2\nscene.add(logo)\nscene.add(logoBackground)\n\n\nfor(let i = 0; i < 6; i++)\n{\n\tdrops.push(new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.Mesh(\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.CircleGeometry(.9, 32),\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({map: dropsTextures[i % dropsTextures.length]})\n\t))\n\tdrops[i].position.set(\n\t\t2.5 * Math.cos((i + 1) * Math.PI / 3) + (i + 1) / 6,\n\t\t3 * Math.sin((i + 1) * Math.PI / 3) - (i + 1) / 6,\n\t\tASIMPTOTE -0.0001\n\t)\n\tdropControls.push(new _SmoothControls_js__WEBPACK_IMPORTED_MODULE_0__.SmoothControls(drops[i]))\n\tdropControls[i].setTranslate(true, true, false)\n\tdropControls[i].minPos = 0\n\tdropControls[i].maxPos = Math.max(\n\t\tdrops[i].position.x,\n\t\tdrops[i].position.y\n\t)\n\tscene.add(drops[i])\n}\n\nfor(let i = 0; i < 40; i++)\n{\n\tlet dice = Math.floor(Math.random() * assetsTextures.length)\n\tassetsObjects.push(new _three_module_js__WEBPACK_IMPORTED_MODULE_1__.Mesh(\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry(10, 10),\n\t\tnew _three_module_js__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({map: assetsTextures[dice]})\n\t))\n\tassetsObjects[i].position.set(\n\t\t(Math.random() * 80 + 10) * (Math.random() > 0.5 ? 1 : -1),\n\t\t(Math.random() * 80 + 10) * (Math.random() > 0.5 ? 1 : -1),\n\t\tASIMPTOTE-Math.random() * 200 - 20\n\t)\n\tscene.add(assetsObjects[i])\n}\n\ncamera.position.z = controls.maxPos\n\n/*\nconst loader = new GLTFLoader()\nloader.load(\n\t'./dropMainLogo.gltf',\n\tgltf => {\n\t\tscene.add( gltf.scene )\n\n\t},\n\txhr => {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )},\n\terror => {console.log( 'An error happened:' + error )}\n)\n*/\n\nlet STATE = \"initial\"\n\nfunction animate() {\n\tswitch(STATE)\n\t{\n\t\tcase \"initial\":\n\t\t\tdropControls.forEach(control => {\n\t\t\t\tif (! control.embarked)\n\t\t\t\t\tcontrol.embark()\n\t\t\t\tcontrol.update()\n\t\t\t})\n\t\t\tif(! logoScaler.embarked)\n\t\t\t\tlogoScaler.embark()\n\t\t\tlogoScaler.update()\n\t\t\tif(logo.scale.x === logoScaler.maxScale) {\n\t\t\t\tdrops.forEach(drop => {\n\t\t\t\t\tscene.remove(drop)\n\t\t\t\t})\n\t\t\t\tdropControls.forEach(control => {\n\t\t\t\t\tcontrol.dispose\n\t\t\t\t})\n\t\t\t\tlogoScaler.dispose\n\t\t\t\tdrops.length = dropControls.length = 0\n\t\t\t\tSTATE = \"zoom\"\n\t\t\t}\n\t\t\tbreak\n\t\tcase \"zoom\":\n\t\t\tif(!controls.embarked)\n\t\t\t\tcontrols.embark()\n\t\t\tcontrols.update()\n\t\t\tif(camera.position.z <= ASIMPTOTE)\n\t\t\t\tassetsObjects.forEach(asset => {\n\t\t\t\t\tif(asset.position.z < ASIMPTOTE-1)\n\t\t\t\t\t\tasset.position.z += .05\n\t\t\t\t})\n\t\t\tbreak\n\t}\n\trequestAnimationFrame( animate )\n\trenderer.render( scene, camera )\n}\nrequestAnimationFrame(animate)\n\n\n//# sourceURL=webpack:///./js/app.js?");

/***/ }),

/***/ "./js/three.module.js":
/*!****************************!*\
  !*** ./js/three.module.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/app.js");
/******/ 	
/******/ })()
;