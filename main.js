const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

//controlador centralizado para modificar el 3D desde fuera
window.Controlador3D = {
    luces: [],
    bombas: {},
    mangueras: {},
    
    setEstadoLuz: function(index, encendida) {
        if (this.luces[index]) {
            this.luces[index].luz.intensity = encendida ? 3 : 0; // Intensidad subida a 3
            this.luces[index].fisica.material.color.setHex(encendida ? 0xff00ff : 0x555555);
        }
    },
    
    setEstadoBomba: function(tipo, encendida) {
        if (!this.bombas) this.bombas = {};
        if (!this.mangueras) this.mangueras = {};

        const colorEncendida = tipo === 'riego' ? 0x00aaff : 0x22cc44;
        const colorApagado = 0x224455;
        const colorFinal = encendida ? colorEncendida : colorApagado;

        if (this.bombas[tipo]) {
            this.bombas[tipo].material.color.setHex(colorFinal);
        }

        if(this.mangueras[tipo]){
            this.mangueras[tipo].material.color.setHex(colorFinal);
            this.mangueras[tipo].material.emissive.setHex(encendida ? colorFinal : 0x000000);
            this.mangueras[tipo].material.emissiveIntensity = encendida ? 0.6 : 0;
        }
    }
};

// cargar modelo
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

// lamparas 
function crearLampara(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const lampara = new THREE.Mesh(geometry, material);
    lampara.position.set(x, y, z);
    scene.add(lampara);

    const luz = new THREE.PointLight(0xff00ff, 0, 0.8);
    luz.position.set(x, y, z);
    scene.add(luz);

    // guardar referencia en el controlador
    window.Controlador3D.luces.push({fisica: lampara, luz: luz});
}

crearLampara(-0.3, 0.5, -0.3); // zona 1
crearLampara(0.3, 0.5, -0.3);  // zona 2
crearLampara(-0.3, 0.5, 0.3);  // zona 3
crearLampara(0.3, 0.5, 0.3);   // zona 4

// bombas
function crearBomba(x, y, z, tipo) {
    const geometry = new THREE.CylinderGeometry(0.20, 0.20, 0.42, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x224455 });
    const bomba = new THREE.Mesh(geometry, material);
    bomba.position.set(x, y, z);
    scene.add(bomba);

    window.Controlador3D.bombas[tipo] = bomba;
}

crearBomba(-0.3, 0.1, -1.2, 'riego'); 
crearBomba(0.3, 0.1, -1.2, 'abono');

//mangueras
function crearManguera(puntos, tipo) {
    const curva = new THREE.CatmullRomCurve3(puntos);
    const geometry = new THREE.TubeGeometry(curva, 30, 0.015, 8, false);
    const material = new THREE.MeshStandardMaterial({ color: 0x224455, roughness: 0.4, metalness: 0.1 });
    const manguera = new THREE.Mesh(geometry, material);
    scene.add(manguera);

    if (!window.Controlador3D.mangueras) window.Controlador3D.mangueras = {};
    window.Controlador3D.mangueras[tipo] = manguera;
    return manguera;
}

//manguera abono
const puntosAbono = [
    new THREE.Vector3(0.3, 0.15, -1.15),
    new THREE.Vector3(0.3, 0.02, -1.05),
    new THREE.Vector3(0.15, 0.02, -0.9),
    new THREE.Vector3(0.0, 0.02, -0.8)
];
crearManguera(puntosAbono, 'abono');

//manguera agua
const puntosAgua = [
    new THREE.Vector3(-0.3, 0.15, -1.15),
    new THREE.Vector3(-0.3, 0.02, -1.05),
    new THREE.Vector3(-0.15, 0.02, -0.9),
    new THREE.Vector3(0.0, 0.02, -0.8),
    new THREE.Vector3(0.0, 0.02, -0.75),
    new THREE.Vector3(0.0, -0.1, -0.65)
];
crearManguera(puntosAgua, 'riego');