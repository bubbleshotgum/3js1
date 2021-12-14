import * as THREE from "../node_modules/three/build/three.module.js"

import { SmoothControls } from "./SmoothControls.js"

import { FontLoader } from "../node_modules/three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "../node_modules/three/examples/jsm/geometries/TextGeometry.js"

import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js'
import { CustomPass } from "./CustomPass.js"

var fragment = require("../shader/fragment.glsl")
var vertex = require("../shader/vertex.glsl")


// ДЕКЛАРАЦИЯ КОНСТАНТ
const container = document.getElementById('container')

const ASIMPTOTE = 40
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({alpha: true})
renderer.setPixelRatio(window.devicePixelRatio)
const composer = new EffectComposer( renderer )
composer.setPixelRatio(renderer.getPixelRatio())
composer.addPass( new RenderPass( scene, camera ) )

const controls = new SmoothControls(camera)
controls.setTranslate(false, false, true)
controls.maxPos = ASIMPTOTE + 12

scene.background = new THREE.Color(0xffffff)
renderer.setSize( window.innerWidth, window.innerHeight )
composer.setSize( window.innerWidth, window.innerHeight )
container.appendChild( renderer.domElement )

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
const TEXT_SIZE = 5
loader.load("blacklight.json", function ( font ) {
	const currExText = new THREE.Mesh(
			new TextGeometry("Current\nExhibition", {
			font: font,
			size: TEXT_SIZE,
			height: 0,
			curveSegments: 64
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
		Math.random() * ASIMPTOTE / 1.5 * (Math.random() > .5 ? 1 : -1),
		Math.random() * ASIMPTOTE / 4 * (Math.random() > .5 ? 1 : -1),
		Math.max(
			ASIMPTOTE * (1 - 2 * Math.random() / 5) / 1.5 - 15,
			controls.minPos
		)
	)
})

camera.position.z = controls.maxPos
controls.embark()

let time = 0, 
	effect1 = new ShaderPass( CustomPass )
effect1.uniforms[ 'time' ].value = 0
effect1.uniforms[ 'scale' ].value = 2.5
effect1.uniforms[ 'progress' ].value = 0

composer.addPass( effect1 )
//composer.addPass( effect2 )
let STATE = "initial"

function animate() {
	requestAnimationFrame( animate )
	switch(STATE)
	{
		case "initial":
			effect1.uniforms[ 'progress' ].value = 0
			if(camera.position.z <= ASIMPTOTE)
				STATE = "distort"
			break
		case "distort":
			time += .01
			effect1.uniforms[ 'time' ].value = time
			effect1.uniforms[ 'progress' ].value = .05
			material.uniforms.time.value = time
			if(camera.position.z >= ASIMPTOTE)
				STATE = "initial"
			break
	}
	controls.update()
	composer.render()
}
requestAnimationFrame(animate)
