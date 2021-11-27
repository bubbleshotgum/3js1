import { SmoothControls } from "./SmoothControls.js"
import * as THREE from "./three.module.js"

const ASIMPTOTE = 100
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({alpha: true})
const controls = new SmoothControls(camera)
controls.setTranslate(false, false, true)
controls.maxPos = ASIMPTOTE + 6

scene.background = new THREE.Color(0xffffff)
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const tLoader = new THREE.TextureLoader()
const PATH_TO_PIXTURES = "../assets/pictures/"
let assetsTextures = [
		tLoader.load(PATH_TO_PIXTURES + 'asset1.png'),
		tLoader.load(PATH_TO_PIXTURES + 'asset2.jpeg')
	],
	dropsTextures = [
		tLoader.load(PATH_TO_PIXTURES + 'drop1.png'),
		tLoader.load(PATH_TO_PIXTURES + 'drop2.png')
	],
	logoTexture = tLoader.load(PATH_TO_PIXTURES + 'logo.png')

let assetsObjects = [],
	drops = [],
	dropControls = [],

	logo = new THREE.Mesh(
		new THREE.CircleBufferGeometry(1.8, 32),
		new THREE.MeshBasicMaterial({map: logoTexture})
	),
	logoBackground = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight),
		new THREE.MeshBasicMaterial({color: 0xffffff})
	),
	logoScaler = new SmoothControls(logo, true)
logo.position.z = ASIMPTOTE
logoBackground.position.z = ASIMPTOTE -.0005
logoScaler.setTranslate(false, false, false)
logoScaler.setScale(true, true, false)
logoScaler.maxScale = 2
scene.add(logo)
scene.add(logoBackground)


for(let i = 0; i < 6; i++)
{
	drops.push(new THREE.Mesh(
		new THREE.CircleGeometry(.9, 32),
		new THREE.MeshBasicMaterial({map: dropsTextures[i % dropsTextures.length]})
	))
	drops[i].position.set(
		2.5 * Math.cos((i + 1) * Math.PI / 3) + (i + 1) / 6,
		3 * Math.sin((i + 1) * Math.PI / 3) - (i + 1) / 6,
		ASIMPTOTE -0.0001
	)
	dropControls.push(new SmoothControls(drops[i]))
	dropControls[i].setTranslate(true, true, false)
	dropControls[i].minPos = 0
	dropControls[i].maxPos = Math.max(
		drops[i].position.x,
		drops[i].position.y
	)
	scene.add(drops[i])
}

for(let i = 0; i < 40; i++)
{
	let dice = Math.floor(Math.random() * assetsTextures.length)
	assetsObjects.push(new THREE.Mesh(
		new THREE.PlaneBufferGeometry(10, 10),
		new THREE.MeshBasicMaterial({map: assetsTextures[dice]})
	))
	assetsObjects[i].position.set(
		(Math.random() * 80 + 10) * (Math.random() > 0.5 ? 1 : -1),
		(Math.random() * 80 + 10) * (Math.random() > 0.5 ? 1 : -1),
		ASIMPTOTE-Math.random() * 200 - 20
	)
	scene.add(assetsObjects[i])
}

camera.position.z = controls.maxPos

/*
const loader = new GLTFLoader()
loader.load(
	'./dropMainLogo.gltf',
	gltf => {
		scene.add( gltf.scene )

	},
	xhr => {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )},
	error => {console.log( 'An error happened:' + error )}
)
*/

let STATE = "initial"

function animate() {
	switch(STATE)
	{
		case "initial":
			dropControls.forEach(control => {
				if (! control.embarked)
					control.embark()
				control.update()
			})
			if(! logoScaler.embarked)
				logoScaler.embark()
			logoScaler.update()
			if(logo.scale.x === logoScaler.maxScale) {
				drops.forEach(drop => {
					scene.remove(drop)
				})
				dropControls.forEach(control => {
					control.dispose
				})
				logoScaler.dispose
				drops.length = dropControls.length = 0
				STATE = "zoom"
			}
			break
		case "zoom":
			if(!controls.embarked)
				controls.embark()
			controls.update()
			if(camera.position.z <= ASIMPTOTE)
				assetsObjects.forEach(asset => {
					if(asset.position.z < ASIMPTOTE-1)
						asset.position.z += .05
				})
			break
	}
	requestAnimationFrame( animate )
	renderer.render( scene, camera )
}
requestAnimationFrame(animate)
