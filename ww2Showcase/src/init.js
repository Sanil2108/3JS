import {init as uiInit} from './ui.js'

let camera, scene, renderer;
let controls;
let loader;

let currentModel;
let currentComponents = [];

let spotlight;

let raycaster;  
let mouse;
let unNormalizedMouse;

let currentToolTip;
let selectedIndex;

let names = [
    'Hind',
    'Spitfire',
    'Special Forces'
];

let selectedMaterial;

let properties = [
    {
        size: 0.3,
        location: './models/hind/scene.gltf',
        componentsLocation: './models/hind/properties.json',
    },
    {
        size: 1,
        location: './models/spitfire/scene.gltf',
        componentsLocation: './models/spitfire/properties.json'
    },
    {
        size: 10000,
        location: './models/specialForces/scene.gltf',
    }
]

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000);
    camera.position.set(400, 400, 400);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    unNormalizedMouse = new THREE.Vector2();

    controls = new THREE.OrbitControls(camera);
    // controls.autoRotate = true;
    //    controls.enablePan = false;

    controls.update();

    selectedMaterial = new THREE.MeshPhongMaterial({color : 0xffff00});
    selectedMaterial.opacity = 0.5;

    let cubeMaterials = [
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/wallpaper/front.png"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/wallpaper/back.png"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/wallpaper/up.png"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/wallpaper/down.png"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/wallpaper/right.png"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/wallpaper/left.png"), side: THREE.DoubleSide })
    ]
    let geometry = new THREE.CubeGeometry(10000, 10000, 10000);
    let cube = new THREE.Mesh(geometry, cubeMaterials);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    spotlight = new THREE.SpotLight(0xffffff, 5, 100000);
    spotlight.position.set(400, 400, 400);
    spotlight.castShadow = true;
    scene.add(spotlight);

    document.body.appendChild(renderer.domElement);

    renderer.render(scene, camera);

    registerEventListeners();

    update();

    loadModel('Spitfire');
    let properties = loadProperties('Spitfire')

    uiInit();
}

function loadProperties(name) {
    let client = new XMLHttpRequest();
    let currentModelProperties = properties[names.indexOf(name)]
    client.open('GET', currentModelProperties.componentsLocation);
    client.onreadystatechange = function () {
        if(client.readyState != 4){
            return;
        }
        let json = JSON.parse(client.responseText);
        for (let component of json.components) {
            console.log("Loading " + component.name + " from " + component.location);
            if (!loader) {
                loader = new THREE.GLTFLoader();
            }
            loader.load(
                component.location,
                (gltf) => {
                    scene.add(gltf.scene);
                    gltf.scene.scale.set(
                        currentModelProperties.size,
                        currentModelProperties.size,
                        currentModelProperties.size);

                    let meshAndMaterials = getMeshesAndMaterials (gltf.scene);
                    currentComponents.push(
                        {
                            meshes : meshAndMaterials[0],
                            materials : meshAndMaterials[1],
                            description : component.description,
                            model : gltf.scene,
                            name : component.name
                        }
                    );
                    gltf.scene.traverse(
                        (child)=>{
                            child.name = component.name;
                        }
                    );
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% of '+ component.name + ' loaded');
                },
                (error) => {
                    console.log(error);
                }
            );
        }
        
    }
    client.send();
}

function getMeshesAndMaterials(model){
    let tempObjects = []
    let tempMeshes = []
    let tempMaterials = []
    if(model.children.length > 0){
        for(let i=0;i<model.children.length;i++){
            tempObjects.push(model.children[i]);
            if(model.children[i].isMesh){
                tempMeshes.append(model.children[i]);
                tempMaterials.append(model.children[i].material);
            }
        }
    }
    while(tempObjects.length > 0){
        let temp = tempObjects[0];
        if(temp.children.length > 0){
            for(let j=0;j<temp.children.length;j++){
                tempObjects.push(temp.children[j])
                if(temp.children[j].isMesh){
                    tempMeshes.push(temp.children[j]);

                    let tempMaterial = temp.children[j].material;
                    tempMaterial = Object.assign(tempMaterial, temp.children[j].material);
                    tempMaterials.push(tempMaterial);
                }
            }

        }
        tempObjects.splice( tempObjects.indexOf(temp), 1);
    }
    return [tempMeshes, tempMaterials]
}

function loadModel(name) {
    if (currentModel) {
        scene.remove(currentModel);
        if(currentComponents.length > 0){
            scene.remove(currentComponents[i].model);
                for(let i=0;i<currentComponents.length;i++){
            }
        }
        currentComponents = [];
    }
    if (!loader) {
        loader = new THREE.GLTFLoader();
    }
    let i = names.indexOf(name);
    let currentModelProperties = properties[i];
    loader.load(
        currentModelProperties.location,
        (gltf) => {
            currentModel = gltf.scene;
            gltf.scene.scale.set(
                currentModelProperties.size,
                currentModelProperties.size,
                currentModelProperties.size);
            if (currentModelProperties.offset) {
                gltf.scene.position.x += currentModelProperties.offset.x;
            }
            // scene.add(gltf.scene);

        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
    );
}

function registerEventListeners() {
    window.onresize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    window.onmousemove = ()=>{
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        unNormalizedMouse.x = event.clientX;
        unNormalizedMouse.y = event.clientY;
    }

    let selector = document.getElementById("planeSelectorSelector");
    selector.addEventListener("select", (detail) => {
        let planeSelected = detail.detail.selected;
        loadModel(planeSelected);
    })
}

function addToolTip(x, y, text){
    if(currentToolTip){
        return;
    }
    let element = document.createElement("div");
    element.className = "tooltip";
    element.textContent = text;
    element.style.left = x + "px";
    element.style.top = y + "px";
    document.body.append(element);
    currentToolTip = element;
}

function componentHovered(index){
    for(let i=0;i<currentComponents[index].meshes.length;i++){
        currentComponents[index].meshes[i].material = selectedMaterial;
    }
}

function removeComponentHover(index){
    for(let i=0;i<currentComponents[index].meshes.length;i++){
        currentComponents[index].meshes[i].material = currentComponents[index].materials[i];
    }
}

function updateComponents(){
    let mousePointer = false;
    for(let i=0;i<currentComponents.length;i++){
        let intersects = raycaster.intersectObjects(currentComponents[i].model.children, true);
        if(intersects && intersects[0] ){
            if(selectedIndex != i){
                addToolTip(unNormalizedMouse.x, unNormalizedMouse.y, currentComponents[i].name);
            }
            componentHovered(i);
            mousePointer = true;
            selectedIndex = i;
        }else{
            if(selectedIndex == i){
                selectedIndex = null;
                document.body.removeChild(currentToolTip);
                currentToolTip = null;
            }
            removeComponentHover(i);
        }
    }
    if(mousePointer){
        document.body.style.cursor = "pointer";
    }else{
        document.body.style.cursor = "auto";
    }
}

function update() {
    window.requestAnimationFrame(update);

    controls.update();

    raycaster.setFromCamera(mouse, camera);

    updateComponents();

    spotlight.position.x = camera.position.x;
    spotlight.position.y = camera.position.y;
    spotlight.position.z = camera.position.z;

    renderer.render(scene, camera);
}

init();