// var THREE = window.THREE = require('three');
// require('three/examples/js/loaders/GLTFLoader');

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(105, window.innerWidth/window.innerHeight, 1, 5000);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// var ambient = new THREE.AmbientLight( 0x444444 );
// scene.add( ambient );

// var directionalLight = new THREE.DirectionalLight( 0xffeedd );
// directionalLight.position.set( 0, 0, 1 ).normalize();
// scene.add( directionalLight );

// let manager = new THREE.LoadingManager( ()=>{} );
let loader = new THREE.OBJLoader();

console.log("ABCD");

loader.load(
    'car.obj',
    (obj)=>{
        console.log("Loaded");
        scene.add(obj);
    },
    (xhr)=>{
        console.log( (xhr.loaded / xhr.total * 100) + '% Loaded.');
    },
    (error)=>{
        console.log('Error ' + error);
    }
)


renderer.render(scene,camera);

// let loader = new THREE.GLTFLoader();

// loader.load('scene.gltf', (gltf)=>{
//     gltf
//     scene.add(gltf.scene);
// }, undefined, (error)=>{
//     console.log(`Error - ${error}`);
// })


function render(){
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();