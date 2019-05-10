import {renderer, controls, scene, camera} from "./init"
import {showCameraPosition} from "./ui"
import { drawPlanet, updatePlanets } from "./planet";

let playing = false;

function findXY(clientX, clientY, clientZ){
    let vec1 = new THREE.Vector3().unproject(camera);
    let vec2 = new THREE.Vector3(clientX, clientY, clientZ);

    // Get direction vector
    let vecd = new THREE.Vector3(
        vec2.x - vec1.x,
        vec2.y - vec1.y,
        vec2.z - vec1.z
    );

    let newZ = (-clientY * vecd.z)/vecd.y + clientZ;
    let newX = (-clientY * vecd.x)/vecd.y + clientX;

    return {
        x:newX,
        y:0,
        z:newZ
    }
}

function onKeyPress(event){
    if(event.key == 'a'){
        let intersection = findXY(camera.position.x, camera.position.y, camera.position.z);
        drawPlanet(intersection.x, intersection.y, intersection.z, 0.2, 0x800080);
    }
}

function stopPlaying(){
    playing = false;
}

function startPlaying(){
    playing = true;
}

function render(){
    renderer.render(scene, camera);
    controls.update();

    showCameraPosition();

    window.requestAnimationFrame(render);

    if(playing){
        updatePlanets();
    }
}

export {render, findXY, onKeyPress, startPlaying, playing, stopPlaying}