const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 7); //posicion: x=0 (esta en el centro), y=5 (altura), z=5 (distancia de la camara)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10); //posicion: x=10 (derecha), y=20 (altura), z=10 (distancia de la camara)
scene.add(directionalLight);

//creacion lamparas y funcionamiento de la luz virtual
window.lucesZonas = [];

function crearLampara(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const lampara = new THREE.Mesh(geometry, material);
    lampara.position.set(x, y, z);
    scene.add(lampara);

    const luz = new THREE.PointLight(0xff00ff, 0, 0.8); //intensidad inicial 0
    luz.position.set(x, y, z);
    scene.add(luz);

    const lamparaTotal = {fisica: lampara, luz: luz};
    window.lucesZonas.push(lamparaTotal);
}

//las 4 lamparas
crearLampara(-0.3, 0.5, -0.3); //zona 1 - derecha arriba
crearLampara(0.3, 0.5, -0.3); //zona 2 - derecha abajo
crearLampara(-0.3, 0.5, 0.3); //zona 3 - izquierda arriba
crearLampara(0.3, 0.5, 0.3); //zona 4 - izquierda abajo

//bombas de agua
window.bombas = [];

function crearBomba(x, y, z) {
    const geometry = new THREE.CylinderGeometry(0.20, 0.20, 0.42, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x224455 });
    const bomba = new THREE.Mesh(geometry, material);
    bomba.position.set(x, y, z);
    scene.add(bomba);

    window.bombas.push(bomba);
}

crearBomba(-1.0, 0.1, -1.2); //bomba 1
crearBomba(-0.5, 0.1, -1.2); //bomba 2
crearBomba(0.0, 0.1, -1.2); //bomba 3
crearBomba(0.5, 0.1, -1.2); //bomba 4


//carga del modelo 3D
const loader = new THREE.GLTFLoader();
loader.load('invernadero.glb', function(gltf){
    const model = gltf.scene;
    model.rotation.y = Math.PI / 5.2;
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    controls.target.copy(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.set(center.x + (maxDim * 0.8), center.y + (maxDim / 2), center.z + (maxDim * 0.6));
    controls.update();

}, undefined, function(error){
    console.error(error);
});

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();