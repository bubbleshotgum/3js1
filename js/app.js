import * as THREE from "../node_modules/three/build/three.module.js"

import { SmoothControls } from "./SmoothControls.js"
import { CustomPass } from "./CustomPass.js"
import { SVGLoader } from "../node_modules/three/examples/jsm/loaders/SVGLoader.js"

// ДЕКЛАРАЦИЯ КОНСТАНТ
const container = document.getElementById('container')

const ASIMPTOTE = 40
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({alpha: true})
renderer.setPixelRatio(window.devicePixelRatio)

const controls = new SmoothControls(camera)
controls.setTranslate(false, false, true)
controls.maxPos = ASIMPTOTE + 12

scene.background = new THREE.Color(0xffffff)
renderer.setSize( window.innerWidth, window.innerHeight )
container.appendChild( renderer.domElement )

const tLoader = new THREE.TextureLoader()
const sLoader = new SVGLoader()

// ПРИНИМАЕТ НА ВХОД JSON ИЗ БЭКА
const PATH_TO_FILES = "../assets/pictures/"
const assets = [
	"asset1.png",
	"asset2.jpeg",
	"asset3.jpg",
	"asset4.jpg",
	"drop1.png",
	"drop2.png"
]

// ИНИЦИАЛИЗАЦИЯ ОБЪЕКТОВ
let logo = null
tLoader.load(PATH_TO_FILES + 'currEx.svg', texture => {
	logo = new THREE.Mesh(
		new THREE.PlaneGeometry(14, 4, 16, 16),
		new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			//opacity: .5
		})
	)
	logo.position.z = ASIMPTOTE
	scene.add(logo)
})

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight
	renderer.setSize( window.innerWidth, window.innerHeight )
	camera.updateProjectionMatrix
})

// sLoader.load(PATH_TO_FILES + 'currEx.svg', svg => {
// 	const paths = svg.paths
// 	const group = new THREE.Group()
// 	for ( let i = 0; i < paths.length; i ++ ) {

// 		const path = paths[ i ];

// 		const material = new THREE.MeshBasicMaterial( {
// 			color: path.color,
// 			side: THREE.DoubleSide,
// 			depthWrite: false
// 		} );
		
// 		const shapes = SVGLoader.createShapes( path );

// 		for ( let j = 0; j < shapes.length; j ++ ) {
// 			const shape = shapes[ j ]
// 			const geometry = new THREE.ShapeGeometry( shape )
// 			const mesh = new THREE.Mesh( geometry, material )
// 			group.add( mesh )
// 			scene.add(group)
// 		}
// 	}
// })

let assetsTextures = assets.map(asset => tLoader.load(PATH_TO_FILES + asset)),
	assetsObjects = [],
	progresses = assets.map(() => Math.max(.3, Math.random() / 2))

const geometry = new THREE.PlaneGeometry(12, 12, 12, 12)
const material = new THREE.ShaderMaterial({
	extensions: {
		derivatives: "#extension GL_OES_standard_derivatives : enable"
	},
	side: THREE.DoubleSide,
	uniforms: {
		time: { value: 0 },
		progress: { value: 0 },
		scale: { value: .3 },
		modifier: { value: 1 },
		uTexture: { value: assetsTextures[0] },
		resolution: { value: new THREE.Vector4() }
	},
	vertexShader: CustomPass.vertexShader,
	fragmentShader: CustomPass.fragmentShader
})

assetsTextures.forEach( (texture, index) => {
	let m = material.clone()
	m.uniforms.uTexture.value = texture
	m.uniforms.modifier.value = Math.min(.2, Math.random() + .1)
	m.uniforms.scale.value = Math.max(.75, Math.random() * 1.2)
	let obj = new THREE.Mesh(geometry, m)
	scene.add(obj)
	assetsObjects.push(obj)
	obj.position.set(
		Math.random() * ASIMPTOTE * Math.cos(index) * 2 * (Math.random() > .5 ? 1 : -1),
		Math.random() * ASIMPTOTE / 4 * (Math.random() > .5 ? 1 : -1),
		Math.max(
			ASIMPTOTE * (1 - 2 * Math.random() / 5) / 1.5 - 15,
			controls.minPos
		)
	)
})

camera.position.z = controls.maxPos
controls.embark()

let time = 0
let STATE = "initial"

function animate() {
	requestAnimationFrame( animate )
	switch(STATE)
	{
		case "initial":
			assetsObjects.forEach(obj => {
				obj.material.uniforms.progress.value = 0
			})
			if(camera.position.z <= ASIMPTOTE)
				STATE = "distort"
			break
		case "distort":
			time += .01
			material.uniforms.time.value = time
			assetsObjects.forEach((obj, index) => {
				obj.material.uniforms.progress.value = progresses[index]
				obj.material.uniforms.time.value = time
			})
			if(camera.position.z >= ASIMPTOTE)
				STATE = "initial"
			break
	}
	controls.update()
	renderer.render(scene, camera)
}
requestAnimationFrame(animate)
