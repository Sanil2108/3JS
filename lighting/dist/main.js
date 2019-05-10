let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

let geom = new THREE.BoxGeometry(1, 1, 1);
let materials = [
    new THREE.MeshPhongMaterial( {color : 0xffff00}),
    new THREE.MeshPhongMaterial( {color : 0xffff00} ),
    new THREE.MeshPhongMaterial( {color : 0xffff00} ),
    new THREE.MeshPhongMaterial( {color : 0xffff00} ),
    new THREE.MeshPhongMaterial( {color : 0xffff00} ),
    new THREE.MeshPhongMaterial( {color : 0xff0000} ),
]
let material = new THREE.MeshPhongMaterial( {color : 0xffff00} );
let cube = new THREE.Mesh(geom, material);
scene.add(cube);

let roomMaterials = [
    new THREE.MeshPhongMaterial( {color : 0xaaaaaa, side:THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {color : 0xaaaaaa, side:THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {color : 0xaaaaaa, side:THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {color : 0xaaaaaa, side:THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {color : 0xaaaaaa, side:THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {color : 0xaaaaaa, side:THREE.DoubleSide} ),
]
let roomGeometry = new THREE.BoxGeometry(10, 10, 10);
let room = new THREE.Mesh(roomGeometry, roomMaterials);
room.position.set(0, 0, 0);
scene.add(room);

let ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

let pointLight = new THREE.PointLight(0x00ff00, 5, 10);
pointLight.position.set(1, 1, 1);
scene.add(pointLight);

let pointLight2 = new THREE.PointLight(0xff0000, 1, 10);
pointLight2.position.set(-1, -1, -1);
// scene.add(pointLight2);

let directionLight = new THREE.DirectionalLight(0xffffff, 1)
directionLight.position.set(1, 1, 1);
// scene.add(directionLight);

let spotlight = new THREE.SpotLight(0xffffff, 3);
spotlight.position.set(1, 1, 1);
scene.add(spotlight);

renderer.render(scene, camera);

update();

function update(){
    window.requestAnimationFrame(update);

    controls.update();
    renderer.render(scene, camera);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
}