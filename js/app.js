import { SmoothControls } from "./SmoothControls.js"
import { CustomPass } from "./CustomPass.js"

import * as THREE from "../node_modules/three/build/three.module.js"
import { FontLoader } from "../node_modules/three/examples/jsm/loaders/FontLoader.js"
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js'
import { TextGeometry } from "../node_modules/three/examples/jsm/geometries/TextGeometry.js"

var fragment = require("../shader/fragment.glsl")
var vertex = require("../shader/vertex.glsl")


// ДЕКЛАРАЦИЯ КОНСТАНТ
const ASIMPTOTE = 30
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({alpha: true})
renderer.setPixelRatio(window.devicePixelRatio)
const composer = new EffectComposer( renderer )
composer.addPass( new RenderPass( scene, camera ) )

const controls = new SmoothControls(camera)
controls.setTranslate(false, false, true)
controls.maxPos = ASIMPTOTE + 12

scene.background = new THREE.Color(0xffffff)
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const tLoader = new THREE.TextureLoader()

// ПРИНИМАЕТ НА ВХОД JSON ИЗ БЭКА
const PATH_TO_FILES = "../assets/pictures/"
const assets = [
	"asset1.png",
	"asset2.jpeg",
	"drop1.png",
	"drop2.png"
]

// ИНИЦИАЛИЗАЦИЯ ОБЪЕКТОВ

const loader = new FontLoader();
const TEXT_SIZE = 3
loader.load("node_modules/three/examples/fonts/helvetiker_regular.typeface.json", function ( font ) {
	const currExText = new THREE.Mesh(
			new TextGeometry("Current\nExhibition", {
			font: font,
			size: TEXT_SIZE,
			height: 0,
			curveSegments: 500
		}),
		new THREE.MeshBasicMaterial({ color: 0 })
	)
	currExText.position.x -= TEXT_SIZE * 2.5
	currExText.position.y += TEXT_SIZE * .7
	currExText.position.z = ASIMPTOTE
	scene.add(currExText)
} )
let assetsTextures = assets.map(asset => tLoader.load(PATH_TO_FILES + asset))
let assetsObjects = []

const geometry = new THREE.PlaneGeometry(4, 4, 12, 12)
const material = new THREE.ShaderMaterial({
	extensions: {
		derivatives: "#extension GL_OES_standard_derivatives : enable"
	},
	side: THREE.DoubleSide,
	uniforms: {
		time: { value: 0 },
		uTexture: { value: assetsTextures[0] },
		resolution: { value: new THREE.Vector4() }
	},
	vertexShader: vertex,
	fragmentShader: fragment
})

assetsTextures.forEach( texture => {
	let m = material.clone()
	m.uniforms.uTexture.value = texture
	let obj = new THREE.Mesh(geometry, m)
	scene.add(obj)
	assetsObjects.push(obj)
	obj.position.set(
		Math.random() * ASIMPTOTE / 5 * (Math.random() > .5 ? 1 : -1),
		Math.random() * ASIMPTOTE / 5 * (Math.random() > .5 ? 1 : -1),
		ASIMPTOTE * (1 - Math.random())
	)
})

camera.position.z = controls.maxPos
controls.embark()

let time = 0, effect1 = new ShaderPass( CustomPass )
effect1.uniforms[ 'scale' ].value = 1
composer.addPass( effect1 )

let STATE = "initial"

function animate() {
	switch(STATE)
	{
		case "initial":
			effect1.uniforms[ 'progress' ].value = 0
			effect1.uniforms[ 'time' ].value = 0
			if(camera.position.z <= ASIMPTOTE)
				STATE = "distort"
			break
		case "distort":
			time += .01
			effect1.uniforms[ 'progress' ].value = .05
			effect1.uniforms[ 'time' ].value = time
			material.uniforms.time.value = time
			if(camera.position.z >= ASIMPTOTE)
				STATE = "initial"
			break
	}
	controls.update()
	composer.render()
	requestAnimationFrame( animate )
}
requestAnimationFrame(animate)
