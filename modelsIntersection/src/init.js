function init(){
    let model;
    let currentGroup;
    let mouse, raycaster;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(400, 400, 400);

    raycaster = new THREE.Raycaster();

    mouse = new THREE.Vector2();
    window.onmousemove = (event)=>{
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let controls = new THREE.OrbitControls(camera);
    controls.update();

    let ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    let loader = new THREE.GLTFLoader();
    loader.load(
        './models/scene.gltf',
        (gltf)=>{
            // currentGroup = new THREE.Group();
            scene.add(gltf.scene);
            camera.lookAt(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.y);

            gltf.scene.traverse( (child)=>{
                child.name = "main";
            } );
            model = gltf.scene;
        },
        (xhr)=>{
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        (error)=>{
            console.log(error);
        }
    );

    function animate(){
        window.requestAnimationFrame(animate);

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(model.children, true);
        if(intersects && intersects[0]){
            console.log(intersects[0].object.name);
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

init();