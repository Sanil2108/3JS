// var THREE = window.THREE = require('three');
// require('three/examples/js/loaders/GLTFLoader');

console.log("ABCD");

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(105, window.innerWidth/window.innerHeight, 1, 5000);
camera.position.set(-448, 252, 43);
camera.lookAt(0, 0, 0);

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// var ambient = new THREE.AmbientLight( 0x444444 );
// scene.add( ambient );

// var directionalLight = new THREE.DirectionalLight( 0xffeedd );
// directionalLight.position.set( 0, 0, 1 ).normalize();
// scene.add( directionalLight );

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.25;

controls.update();

let pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(-448, 252, 43);
scene.add(pointLight)




// let manager = new THREE.LoadingManager( ()=>{} );
// let loader = new THREE.OBJLoader();


// loader.load(
//     'car.obj',
//     (obj)=>{
//         console.log("Loaded");
//         scene.add(obj);
//     },
//     (xhr)=>{
//         console.log( (xhr.loaded / xhr.total * 100) + '% Loaded.');
//     },
//     (error)=>{
//         console.log('Error ' + error);
//     }
// )


addCube(0, 0, 0, 1000, 1, 1000);

let loader = new THREE.GLTFLoader();

loader.load(
	'models/scene.gltf',
	function ( gltf ) {

		scene.add( gltf.scene );

	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	function ( error ) {

        console.log(`Error - ${error}`);

	}
);

renderer.render(scene,camera);

function render(){
    window.requestAnimationFrame(render);

    // console.log(camera.position);

    controls.update();
    renderer.render(scene, camera);
}
render();

function addCube(x, y, z, w, h, d){
    let geom = new THREE.BoxGeometry(w, h, d);
    let material = new THREE.MeshBasicMaterial({color:0xaaaaaa});
    let cube = new THREE.Mesh(geom, material);
    cube.position.set(x, y, z);
    scene.add(cube);
}