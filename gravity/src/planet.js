import {scene} from './init'

let PLANET_AXES_LENGTH = 0.2;
let CURSOR_HEIGHT = 0.25;

let G = 6.67/10;

let planets = []
let planetSpheres = []

class Planet{
    constructor(x, y, z, radius, color, sphere){
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.color = color;
        this.sphere = sphere;
        this.vector = new THREE.Vector3();
        this.density = 1;
        this.volume = 1.33 * Math.PI * (this.radius ** 3);
        this.mass = this.density * this.volume;
    }

    setCursors(xCursor, yCursor, zCursor){
        this.xCursor = xCursor;
        this.yCursor = yCursor;
        this.zCursor = zCursor;
    }

    setCursorLines(lineX, lineY, lineZ){
        this.cursorLineX = lineX;
        this.cursorLineY = lineY;
        this.cursorLineZ = lineZ;
    }

    setPositionX(newX){
        // newX = newX - this.radius - PLANET_AXES_LENGTH;

        this.sphere.position.x = newX;
        this.yCursor.position.x = newX;
        this.xCursor.position.x = newX + PLANET_AXES_LENGTH + this.radius;
        this.zCursor.position.x = newX;

        this.cursorLineX.geometry.vertices[0].x = newX;
        this.cursorLineX.geometry.vertices[1].x = newX + PLANET_AXES_LENGTH + this.radius;
        this.cursorLineX.geometry.verticesNeedUpdate = true;

        this.cursorLineY.geometry.vertices[0].x = newX;
        this.cursorLineY.geometry.vertices[1].x = newX;
        this.cursorLineY.geometry.verticesNeedUpdate = true;


        this.cursorLineZ.geometry.vertices[0].x = newX;
        this.cursorLineZ.geometry.vertices[1].x = newX;
        this.cursorLineZ.geometry.verticesNeedUpdate = true;
    }

    setPositionY(newY){
        // newY = newY - this.radius - PLANET_AXES_LENGTH;

        this.sphere.position.y = newY;
        this.yCursor.position.y = newY + PLANET_AXES_LENGTH +this.radius;
        this.xCursor.position.y = newY;
        this.zCursor.position.y = newY;
                
        this.cursorLineX.geometry.vertices[0].y = newY;
        this.cursorLineX.geometry.vertices[1].y = newY;
        this.cursorLineX.geometry.verticesNeedUpdate = true;

        this.cursorLineY.geometry.vertices[0].y = newY;
        this.cursorLineY.geometry.vertices[1].y = newY + PLANET_AXES_LENGTH + this.radius;
        this.cursorLineY.geometry.verticesNeedUpdate = true;


        this.cursorLineZ.geometry.vertices[0].y = newY;
        this.cursorLineZ.geometry.vertices[1].y = newY;
        this.cursorLineZ.geometry.verticesNeedUpdate = true;
    }

    setPositionZ(newZ){
        // newX = newX - this.radius - PLANET_AXES_LENGTH;

        this.sphere.position.z = newZ;
        this.yCursor.position.z = newZ;
        this.xCursor.position.z = newZ;
        this.zCursor.position.z = newZ + PLANET_AXES_LENGTH + this.radius;
                
        this.cursorLineX.geometry.vertices[0].z = newZ;
        this.cursorLineX.geometry.vertices[1].z = newZ;
        this.cursorLineX.geometry.verticesNeedUpdate = true;

        this.cursorLineY.geometry.vertices[0].z = newZ;
        this.cursorLineY.geometry.vertices[1].z = newZ;
        this.cursorLineY.geometry.verticesNeedUpdate = true;


        this.cursorLineZ.geometry.vertices[0].z = newZ;
        this.cursorLineZ.geometry.vertices[1].z = newZ  + PLANET_AXES_LENGTH + this.radius;
        this.cursorLineZ.geometry.verticesNeedUpdate = true;
    }

    update(){
        this.sphere.position.x += this.vector.x;
        this.sphere.position.y += this.vector.y;
        this.sphere.position.z += this.vector.z;
    }

    applyGravity(movingVector){
        this.sphere.position.x += movingVector.x;
        this.sphere.position.y += movingVector.y;
        this.sphere.position.z += movingVector.z;
    }

    calculateGravity(planets){
        let movingVector = new THREE.Vector3();

        for(let i=0;i<planets.length;i++){
            if(this == planets[i]){
                continue;
            }
            let tempX = planets[i].sphere.position.x - this.sphere.position.x;
            let tempY = planets[i].sphere.position.y - this.sphere.position.y;
            let tempZ = planets[i].sphere.position.z - this.sphere.position.z;
            let div = Math.sqrt( (tempX**2 + tempY**2 + tempZ**2) );
            tempX /= div;
            tempY /= div;
            tempZ /= div;


            let distance = ( (planets[i].sphere.position.x - this.sphere.position.x)**2 +
                                 (planets[i].sphere.position.y - this.sphere.position.y)**2 +
                                 (planets[i].sphere.position.z - this.sphere.position.z)**2 );
            distance = Math.sqrt(distance);

            let force = G * (this.mass * planets[i].mass)/ (distance ** 2 );

            // console.log(planets[i].mass);

            movingVector.x += tempX * force;
            movingVector.y += tempY * force;
            movingVector.z += tempZ * force;
        }

        // console.log(movingVector.x, movingVector.y, movingVector.z);
        movingVector.x += this.vector.x;
        movingVector.y += this.vector.y;
        movingVector.z += this.vector.z;


        return movingVector;
    }
};

function movePlanets(planets){
    let movingVectors = [];
    for(let i=0;i<planets.length;i++){
        movingVectors.push(
            planets[i].calculateGravity(planets)
        );
    }
    for(let i=0;i<planets.length;i++){
        planets[i].applyGravity(
            movingVectors[i]
        );
    }
}

function drawPlanet(x, y, z, radius, color){
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshBasicMaterial({color});
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);

    let p = new Planet(x, y, z, radius, color, sphere);
    drawAxesOfPlanet(p);
    planets.push(p);

    planetSpheres.push(sphere);
}

function drawAxesOfPlanet(planet){
    let xCursorAndLine = drawAxisOfPlanet(planet, 0xff0000, planet.radius + PLANET_AXES_LENGTH, 0, 0);
    let yCursorAndLine = drawAxisOfPlanet(planet, 0x00ff00, 0, planet.radius + PLANET_AXES_LENGTH, 0);
    let zCursorAndLine = drawAxisOfPlanet(planet, 0x0000ff, 0, 0, planet.radius + PLANET_AXES_LENGTH);

    planet.setCursors(xCursorAndLine.cone, yCursorAndLine.cone, zCursorAndLine.cone);
    planet.setCursorLines(xCursorAndLine.line, yCursorAndLine.line, zCursorAndLine.line);

}

function drawAxisOfPlanet(planet, color, increaseX, increaseY, increaseZ){
    let material = new THREE.LineBasicMaterial({color});
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(planet.x , planet.y, planet.z));
    geometry.vertices.push(new THREE.Vector3(planet.x + increaseX, planet.y + increaseY, planet.z + increaseZ));
    let line = new THREE.Line(geometry, material);
    scene.add(line);

    let coneGeometry = new THREE.ConeGeometry(0.05 * planet.radius , CURSOR_HEIGHT * planet.radius, 32);
    let coneMaterial = new THREE.MeshBasicMaterial({color});
    let cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.x = planet.x + increaseX;
    cone.position.y = planet.y + increaseY;
    cone.position.z = planet.z + increaseZ;
    if(increaseX>0){
        cone.rotateZ(-Math.PI/2);
    }else if(increaseZ>0){
        cone.rotateX(Math.PI/2);
    }
    scene.add(cone);

    return {cone, line};
}

function updatePlanets(){
    for(let i = 0;i<planets.length; i++){
        drawAxesOfPlanet(planets[i]);
        movePlanets(planets);
        planets[i].update();
    }
}

export {drawPlanet, planets, Planet, planetSpheres, updatePlanets }
