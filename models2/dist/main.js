// var THREE = window.THREE = require('three');
// require('three/examples/js/loaders/GLTFLoader');
console.log("ABCD");

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 50000);
camera.position.set(0, 0, 250);
camera.lookAt(0, 0, 0);

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var ambient = new THREE.AmbientLight( 0xffffff );
ambient.position.set(1428, 750, 2111);
scene.add( ambient );

var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 1428, 2050, 2111 ).normalize();
scene.add( directionalLight );

let pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(1428, 750, 2111);
scene.add(pointLight);

createCube(0, 0, 2000, 5000, 5000, 1);
createCube(2000, 0, 0, 1, 5000, 5000);
createCube(0, 2000, 0, 5000, 1, 5000);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.25;

controls.update();

let loader = new THREE.GLTFLoader();

loader.load('scene.gltf', (gltf)=>{
    scene.add(gltf.scene);
}, 
(xhr)=>{
    console.log( (xhr.loaded/xhr.total * 100) + '% Loaded.' );
}, 
(error)=>{
    console.log(`Error in loading- ${error}`);
})

renderer.render(scene,camera);

function render(){
    window.requestAnimationFrame(render);

    controls.update();
    // console.log(camera.position);
    renderer.render(scene, camera);
}
render();


function createCube(x, y, z, h, w, d){
    let geom = new THREE.BoxGeometry(h, w, d);
    let material = new THREE.MeshBasicMaterial({color:0xff0000});
    let cube = new THREE.Mesh(geom, material);
    cube.position.set(x, y, z);
    scene.add(cube);
}