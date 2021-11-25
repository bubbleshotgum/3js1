const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({alpha: true})
//scene.background = new THREE.Color(0x99aa99)
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let dropGeometry = new THREE.PlaneBufferGeometry(8, 8)

const tLoader = new THREE.TextureLoader()
let dropTextures = [
	tLoader.load('drop1.jpeg'),
	tLoader.load('drop2.jpeg'),
	tLoader.load('asset1.jpeg'),
	tLoader.load('asset2.jpeg')
],
	logoTexture = tLoader.load('logo.jpeg')
let drop = [],
	logo = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(50, 50),
		new THREE.MeshBasicMaterial({map: logoTexture})
	),
	logoBackground = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight),
		new THREE.MeshBasicMaterial({color: scene.background})
	)
logoBackground.position.z = -.001
scene.add(logo)
scene.add(logoBackground)
for(let i = 0; i < 20; i++)
{
	let dice = Math.floor(Math.random() * dropTextures.length)
	let material = new THREE.MeshBasicMaterial({map: dropTextures[dice]})
	drop.push(new THREE.Mesh(dropGeometry, material))
	drop[i].position.x = (Math.random() * 80 + 10) * (Math.random() > 0.5 ? 1 : -1)
	drop[i].position.y = (Math.random() * 80 + 10) * (Math.random() > 0.5 ? 1 : -1)
	drop[i].position.z = -Math.random() * 100 - 20
	scene.add(drop[i])
}

//let light = new THREE.AmbientLight(0xffffff, 1)
//scene.add(light)
const initialCameraZPos = 35
camera.position.z = initialCameraZPos
function animate() {
	if(camera.position.z <= 0)
		drop.forEach(drop_ => {
			if(drop_.position.z < 0)
				drop_.position.z += .018
		})
	requestAnimationFrame( animate )
	renderer.render( scene, camera )
}
requestAnimationFrame(animate)


function animateScroll(event) {
	if(camera.position.z <= initialCameraZPos || event.deltaY > 0)
		camera.position.z = camera.position.z - event.deltaY * 0.015 > initialCameraZPos ? initialCameraZPos : camera.position.z - event.deltaY * 0.015
	//console.log(camera.position.z)
}
window.addEventListener('wheel', animateScroll)
