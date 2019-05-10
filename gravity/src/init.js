import {onWindowLoad as uiWindowLoad, onClick as uiClick, showOptions} from './ui.js'
import {onKeyPress as updateKeyPress} from './update'
import {render} from "./update.js"
import {planets, Planet, planetSpheres} from './planet'

let ZOOM = 45;
let MIN = 0.1;
let FAR = 10000;
let ASPECT = window.innerWidth/window.innerHeight;
let CAMERA_POSITION_X = -4;
let CAMERA_POSITION_Y = 7;
let CAMERA_POSITION_Z = 4;

let camera;
let scene;
let renderer;
let controls;

let raycaster;
let mouse;


function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(ZOOM, ASPECT, MIN, FAR);
    camera.position.set(CAMERA_POSITION_X, CAMERA_POSITION_Y, CAMERA_POSITION_Z);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.update();

    renderer.render(scene, camera);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(0, 0);

    registerEventListeners();
}

function isIntersecting(raycaster, object){
    let intersects = raycaster.intersectObject(object, false);
    return intersects.length > 0;
}

let dragging = false;
let whatIsBeingDragged = null;
let planetBeingDragged = null;

let oldProjection = 0;
let oldPosition = 0;

function registerEventListeners(){
    // Event listeners
    window.onresize = ()=>{
        ASPECT = window.innerWidth / window.innerHeight;
        camera.aspect = ASPECT;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    window.onmousemove = (event)=>{
        // let intersection = intersectionWithTheXZPlane();
        
        if(dragging){
            if(whatIsBeingDragged == "x"){
                let intersection = intersectionWithTheXZPlane();
                planets[planetBeingDragged].setPositionX(oldPosition + intersection.intersectionX - oldProjection);
            }else if(whatIsBeingDragged == "y"){
                let intersection = intersectionWithTheYZPlane();
                planets[planetBeingDragged].setPositionY(oldPosition + intersection.intersectionY - oldProjection);
            }else{
                let intersection = intersectionWithTheYZPlane();
                planets[planetBeingDragged].setPositionZ(oldPosition + intersection.intersectionZ - oldProjection);
            }
        }

        // event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    // window.onmousemove = (event)=>{
    //     let a = new THREE.Vector3( event.clientX, event.clientY, -1 ).unproject( camera );
    //     console.log(a.x, a.y, a.z);
    // }

    // window.ondrag = (event)=>{
    //     console.log("a");
        
    // }



    window.onmousedown = ()=>{
        if(checkIfMouseOnTopOfCursor()){
            controls.enabled = false;
            dragging = true;
            if(whatIsBeingDragged == "x"){
                oldProjection = intersectionWithTheXZPlane().intersectionX;
            }else if(whatIsBeingDragged == "y"){
                oldProjection = intersectionWithTheYZPlane().intersectionY;
            }else{
                oldProjection = intersectionWithTheYZPlane().intersectionZ;
            }
        }else{
            let planet = checkIfMouseOnTopOfPlanet();
            if(planet){
                showOptions(planet);
            }else{

                controls.enabled = true;
            }
        }
    }

    window.onmouseup = ()=>{
        dragging = false;
    }

    window.onclick = ()=>{
        uiClick();
    }

    window.onkeypress = (event)=>{
        updateKeyPress(event);
    }

    window.onload = () => {

        uiWindowLoad();

        render();
    }

}

// function intersectionWithTheXYPlane(){
//     raycaster.setFromCamera(mouse.clone(), camera);

//     let origin = raycaster.ray.origin;
//     let direction = raycaster.ray.direction;

//     let intersectionX = ((-origin.z * direction.x)/direction.z) + origin.x;
//     let intersectionY = ((-origin.z * direction.y)/direction.z) + origin.y;

//     return{
//         intersectionX,
//         intersectionY
//     }
// }

function intersectionWithTheYZPlane(x, y, z){
    raycaster.setFromCamera(mouse.clone(), camera);

    let origin = raycaster.ray.origin;
    let direction = raycaster.ray.direction;

    let intersectionY = ((-origin.x * direction.y)/direction.x) + origin.y;
    let intersectionZ = ((-origin.x * direction.z)/direction.x) + origin.z;

    // console.log(intersectionY, intersectionZ);

    return{
        intersectionY,
        intersectionZ
    }
}

function intersectionWithTheXZPlane(){
    raycaster.setFromCamera(mouse.clone(), camera);

    let origin = raycaster.ray.origin;
    let direction = raycaster.ray.direction;

    let intersectionX = ((-origin.y * direction.x)/direction.y) + origin.x;
    let intersectionZ = ((-origin.y * direction.z)/direction.y) + origin.z;

    return{
        intersectionX,
        intersectionZ
    }
}

function checkIfMouseOnTopOfPlanet(){
    raycaster.setFromCamera(mouse, camera);
    for(let i=0;i<planets.length;i++){
        if(isIntersecting(raycaster, planets[i].sphere)){
            return planets[i];
        }
    }

    return null;
}

function checkIfMouseOnTopOfCursor(){
    raycaster.setFromCamera(mouse, camera);
    for(let i = 0;i<planetSpheres.length;i++){
        if(isIntersecting(raycaster, planets[i].xCursor)){
            whatIsBeingDragged = "x";
            planetBeingDragged = i;
            oldPosition = planets[planetBeingDragged].sphere.position.x;
            return true;
        }else if(isIntersecting(raycaster, planets[i].yCursor)){
            whatIsBeingDragged = "y";
            planetBeingDragged = i;
            oldPosition = planets[planetBeingDragged].sphere.position.y;
            return true;
        }else if(isIntersecting(raycaster, planets[i].zCursor)){
            whatIsBeingDragged = "z";
            planetBeingDragged = i;
            oldPosition = planets[planetBeingDragged].sphere.position.z;
            return true;
        }
    }
    return false;
}

init();

export {camera, scene, renderer, controls}
