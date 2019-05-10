import {scene, camera} from "./init"
import {findXY, startPlaying, stopPlaying, playing} from './update'

let cameraPositionDiv;
let intersectionDiv;
let playButton;

let planetOptionsCloseImage;

function showCameraPosition(){
    let ACCURACY = 2;
    let tempX = parseInt(camera.position.x * 10**ACCURACY)/10**ACCURACY
    let tempY = parseInt(camera.position.y * 10**ACCURACY)/10**ACCURACY
    let tempZ = parseInt(camera.position.z * 10**ACCURACY)/10**ACCURACY
    cameraPositionDiv.innerHTML = `Camera position - ${tempX}, ${tempY}, ${tempZ}<br>Camera effective FOV - ${camera.getEffectiveFOV()}deg`;
}

function drawAxis(x, y, z, color){
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(x, y, z));

    let material = new THREE.LineBasicMaterial({ color });

    let line = new THREE.Line(geometry, material);

    scene.add(line);
}

function drawAxes(){
    let DISTANCE = 1;
    drawAxis(DISTANCE, 0, 0, 0xff0000);
    drawAxis(0, DISTANCE, 0, 0x00ff00);
    drawAxis(0, 0, DISTANCE, 0x0000ff);
}

let optionsOn = false;

function showOptions(planet){
    if(optionsOn){
        hideOptions();
    }
    optionsOn = true;

    let optionsDivParent = document.getElementById("planetOptions");
    optionsDivParent.style.visibility = "visible";

    let optionsDiv = document.getElementById("planetOptionsContent");
    optionsDiv.style.visibility = "visible";

    let densityAdjusterLabel = document.createElement("p");
    densityAdjusterLabel.innerHTML = "Density - ";
    optionsDiv.appendChild(densityAdjusterLabel);

    let densityAdjuster = document.createElement("input");  
    densityAdjuster.setAttribute("type", "number");
    densityAdjuster.setAttribute("value", planet.density);
    densityAdjuster.onchange = ()=>{
        planet.density = densityAdjuster.value; 
    }
    optionsDiv.appendChild(densityAdjuster);

    let velocityLabel = document.createElement("p");
    velocityLabel.innerHTML = "Initial velocity";
    optionsDiv.appendChild(velocityLabel);

    let initialVelocityX = document.createElement("input");
    initialVelocityX.setAttribute("type", "number");
    initialVelocityX.setAttribute("value", planet.vector.x)
    initialVelocityX.onchange = ()=>{
        planet.vector.x = Number(initialVelocityX.value);
    }
    optionsDiv.appendChild(initialVelocityX);

    let initialVelocityY = document.createElement("input");
    initialVelocityY.setAttribute("type", "number");
    initialVelocityY.setAttribute("value", planet.vector.y)
    initialVelocityY.onchange = ()=>{
        planet.vector.y = Number(initialVelocityY.value);
    }
    optionsDiv.appendChild(initialVelocityY);

    let initialVelocityZ = document.createElement("input");
    initialVelocityZ.setAttribute("type", "number");
    initialVelocityZ.setAttribute("value", planet.vector.z)
    initialVelocityZ.onchange = ()=>{
        planet.vector.z = Number(initialVelocityZ.value);
    }
    optionsDiv.appendChild(initialVelocityZ);

    let positionLabel = document.createElement("p");
    positionLabel.innerHTML = "Position"
    optionsDiv.appendChild(positionLabel);

    let xPosition = document.createElement("input");
    xPosition.setAttribute("type", "number");
    xPosition.setAttribute("value", planet.sphere.position.x);
    xPosition.onchange = ()=>{
        planet.setPositionX( Number(xPosition.value) );
    }
    optionsDiv.appendChild(xPosition);

    let yPosition = document.createElement("input");
    yPosition.setAttribute("type", "number");
    yPosition.setAttribute("value", planet.sphere.position.y);
    yPosition.onchange = ()=>{
        planet.setPositionY(Number(yPosition.value));
    }
    optionsDiv.appendChild(yPosition);

    let zPosition = document.createElement("input");
    zPosition.setAttribute("type", "number");
    zPosition.setAttribute("value", planet.sphere.position.z);
    zPosition.onchange = ()=>{
        planet.setPositionZ(Number(zPosition.value));
    }
    optionsDiv.appendChild(zPosition);
}

function hideOptions(){
    optionsOn = false;

    let optionsDivParent = document.getElementById("planetOptions");
    optionsDivParent.style.visibility = "hidden";

    let optionsDiv = document.getElementById("planetOptionsContent");
    optionsDiv.style.visibility = "hidden";

    optionsDiv.innerHTML = "";
}

function drawGrid(){
    let GRID_LINES = 11;
    let GRID_LINES_SIZE = 10;
    let GRID_LINES_DIST = 1;
    for(let i=0;i<GRID_LINES;i++){
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-(GRID_LINES_SIZE*GRID_LINES_DIST)/2, 0, (i-5)*GRID_LINES_DIST));
        geometry.vertices.push(new THREE.Vector3( (GRID_LINES_SIZE*GRID_LINES_DIST)/2, 0, (i-5)*GRID_LINES_DIST));

        let material;
        if(i==parseInt(GRID_LINES/2)){
            material = new THREE.LineBasicMaterial({ color : 0xff0000 });
        }else{
            material = new THREE.LineBasicMaterial({ color : 0xcccccc });
        }

        let line = new THREE.Line(geometry, material);

        scene.add(line);
    }

    for(let i=0;i<GRID_LINES;i++){
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3((i-5)*GRID_LINES_DIST, 0, -(GRID_LINES_SIZE*GRID_LINES_DIST)/2));
        geometry.vertices.push(new THREE.Vector3((i-5)*GRID_LINES_DIST, 0,  (GRID_LINES_SIZE*GRID_LINES_DIST)/2));

        let material;
        if(i==parseInt(GRID_LINES/2)){
            material = new THREE.LineBasicMaterial({ color : 0x0000ff });
        }else{
            material = new THREE.LineBasicMaterial({ color : 0xcccccc });
        }

        let line = new THREE.Line(geometry, material);

        scene.add(line);
   }

}

function onWindowLoad(){
    try{
        cameraPositionDiv = document.getElementById("cameraPosition");
        intersectionDiv = document.getElementById("intersection");
        planetOptionsCloseImage = document.getElementById("planetOptionsClose");
        playButton = document.getElementById("playButton");

        console.log(playButton);

        playButton.onclick = ()=>{
            if(playing){
                stopPlaying();
                playButton.setAttribute("src", "./img/play.png");
            }else{
                playButton.setAttribute("src", "./img/pause.png");
                startPlaying();
            }
        }

        planetOptionsCloseImage.onclick = ()=>{
            hideOptions();
        }

        drawAxes();
        drawGrid();
        updateXY();
    }catch(e){
        console.log(e);
    }
}

function onClick(){
    updateXY();
}

function updateXY(){
    let intersection;
    intersection = findXY(camera.position.x, camera.position.y, camera.position.z);
    try{
        intersectionDiv.innerHTML = `Intersection at <br>${intersection.x}, ${intersection.y}, ${intersection.z}`
    }catch(e){
        console.log(e);
    }
    return intersection;
}

export {onWindowLoad, showCameraPosition, onClick, showOptions}