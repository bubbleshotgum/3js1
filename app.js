const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({alpha: true})
//scene.background = new THREE.Color(0x99aa99)
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let dropGeometry = new THREE.PlaneBufferGeometry(4, 4)

const tLoader = new THREE.TextureLoader()
let textures = [
	tLoader.load('logo.jpeg'),
	tLoader.load('drop1.jpeg'),
	tLoader.load('drop2.jpeg')]
let drop = []
for(let i = 0; i < 10; i++)
{
	let dice = Math.floor(Math.random() * textures.length)
	let material = new THREE.MeshBasicMaterial({map: textures[dice]})
	drop.push(new THREE.Mesh(dropGeometry, material))
	drop[i].position.x = Math.random() * 10
	drop[i].position.y = Math.random() * 10
	drop[i].position.z = -Math.random() * 50
	//drop[i].rotation.y = Math.random()
	//drop[i].rotation.x = Math.random()
	scene.add(drop[i])
}

let light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)
camera.position.z = 5
function animate() {
	requestAnimationFrame( animate )
	renderer.render( scene, camera )
}
requestAnimationFrame(animate)


function animateScroll(event) {
	camera.position.z -= event.deltaY * 0.015
	console.log(camera.position.z)
}
window.addEventListener('wheel', animateScroll)
