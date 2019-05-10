let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls( camera , renderer.domElement);
controls.update();
controls.enableDamping = true;
controls.dampingFactor = 0.25;

let geom = new THREE.BoxGeometry(1, 1, 1, 2, 3, 3);
let material = new THREE.MeshBasicMaterial({color:0x0000ff});
let cube = new THREE.Mesh(geom, material);
scene.add(cube);

let ambientLight = new THREE.AmbientLight(0x222222);
ambientLight.position.set(1, 1, 1);
scene.add(ambientLight);

let light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

renderer.render(scene, camera);

function update(){
    window.requestAnimationFrame(update);

    controls.update();

    renderer.render(scene, camera);
}
update();