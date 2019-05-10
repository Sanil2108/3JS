let THREE = require('three');

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

let lineMaterial = new THREE.LineBasicMaterial({color:0x0000ff});

let geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 10, 0));
geometry.vertices.push(new THREE.Vector3(10, 0, 0));

let line = new THREE.Line(geometry, lineMaterial);

scene.add(line);

renderer.render(scene, camera);

function animate(){
    requestAnimationFrame(animate);
    // line.rotation.x += 0.1;
    // line.rotation.y += 0.1;
    line.rotation.z += 0.1;
    renderer.render(scene, camera);
}

animate();
