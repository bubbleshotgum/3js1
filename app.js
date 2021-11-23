const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const tLoader = new THREE.TextureLoader()
const dropTexture1 = tLoader.load('./assets/pictures/drop1.jpeg') 
const dropTexture2 = tLoader.load('./assets/pictures/drop2.jpeg') 

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 10 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

const material = new THREE.MeshStandardMaterial({color: 0xcccccc});

material.normalMap = Math.random() > 0.5 ? dropTexture1 : dropTexture2

const geometry = new THREE.SphereBufferGeometry(1.5, 64, 64)
const line = new THREE.Mesh( geometry, material );
scene.add( line );
renderer.render( scene, camera );