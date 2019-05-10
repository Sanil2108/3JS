let THREE = require('three');

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight, false );
document.body.appendChild( renderer.domElement );

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();

window.onresize=()=>{
    console.log(`Resizing ${window.innerWidth}`);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateMatrix();
}