//import {GLTFLoader} from "./GLTFLoader.js"
import { SmoothControls } from "./SmoothControls.js"
import { TextGeometry } from "./TextGeometry.js"
import { FontLoader } from "./FontLoader.js"

const ASIMPTOTE = 100
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({alpha: true})
const controls = new SmoothControls(camera, renderer.domElement)
controls.translateX = controls.translateY = false
controls.maxPos = ASIMPTOTE + 5

scene.background = new THREE.Color(0xffffff)
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const tLoader = new THREE.TextureLoader()
let assetsTextures = [
		tLoader.load('asset1.png'),
		tLoader.load('asset2.jpeg')
	],
	dropsTextures = [
		tLoader.load('drop1.png'),
		tLoader.load('drop2.png')
	],
	logoTexture = tLoader.load('logo.png')

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
	logoScaler = new SmoothControls(logo, renderer.domElement)
logo.position.z = ASIMPTOTE
logoBackground.position.z = ASIMPTOTE -.0005
logoScaler.translateX = logoScaler.translateY = logoScaler.translateZ = false
logoScaler.scaleX = logoScaler.scaleY = true
logoScaler.maxScale = 2
scene.add(logo)
scene.add(logoBackground)

/*
const fontLoader = new FontLoader()
fontLoader.load(
	"font.json",
	function(font) {
		const text = new THREE.Mesh(
			new TextGeometry(
				"MISSIONS", {
					font: font,
					size: 1,
					height: 0,
					curveSegments: 100
				}),
			new THREE.MeshBasicMaterial({color: 0}))
		scene.add(text)
	},
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	function ( err ) {
		console.log( 'An error happened:', err );
	}
)
*/

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
	dropControls.push(new SmoothControls(drops[i], renderer.domElement))
	dropControls[i].translateZ = false
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
				control.update()
				console.log(control.object.position)
			})
			logoScaler.update()
			if(logo.scale.x === logoScaler.maxScale)
			{
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
