function init(){
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1 ,1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    let controls = new THREE.OrbitControls(camera);

    camera.position.set(400, 400, 400);
    controls.update();

    document.body.append(renderer.domElement);

    let ambient = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambient);

    let selectedMaterial = new THREE.MeshBasicMaterial({color : 0xffff00});

    let loader = new THREE.GLTFLoader();
    loader.load(
    	'./models/scene.gltf',
    	(gltf)=>{
    		scene.add(gltf.scene);

    		// console.log("Information about gltf")
    		// console.log(gltf.scene);
    		// console.log(Object.keys(gltf.scene));
    		// console.log(gltf.scene.constructor());

    		gltf.scene.traverse(
    			function ( child ) {
    				if(child.isMesh && i){
	                	console.log(child);
	                	child.material = selectedMaterial;
    				}
			    }
		    );
    	},
    	(xhr)=>{
    		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    	},
    	(error)=>{
    		console.log(error);
    	}
    )

    function update(){
    	window.requestAnimationFrame(update);

    	renderer.render(scene, camera);
    }

    update();
}

init();