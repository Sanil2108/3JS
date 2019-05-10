function init(){
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1 ,1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.append(renderer.domElement);

    function update(){
    	window.requestAnimationFrame(update);
    }
}

init();
