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
    manguerasAgua: [],
    manguerasAbono: [],
    bombas: {},
    
    setEstadoLuz: function(index, encendida) {
        if (this.luces[index]) {
            this.luces[index].luz.intensity = encendida ? 3 : 0; 
            this.luces[index].fisica.material.color.setHex(encendida ? 0xff00ff : 0x555555);
        }
    },
    
    setEstadoValvula: function(tipo, linea, encendida) {
        const colorAgua = 0x00aaff;
        const colorAbono = 0x22cc44;
        const apagadoAgua = 0x114455;
        const apagadoAbono = 0x115522;

        if (tipo === 'agua' && this.manguerasAgua[linea]) {
            let manguera = this.manguerasAgua[linea];
            manguera.material.color.setHex(encendida ? colorAgua : apagadoAgua);
            manguera.material.emissive.setHex(encendida ? colorAgua : 0x000000);
            manguera.material.emissiveIntensity = encendida ? 0.6 : 0;
        }
        if (tipo === 'abono' && this.manguerasAbono[linea]) {
            let manguera = this.manguerasAbono[linea];
            manguera.material.color.setHex(encendida ? colorAbono : apagadoAbono);
            manguera.material.emissive.setHex(encendida ? colorAbono : 0x000000);
            manguera.material.emissiveIntensity = encendida ? 0.6 : 0;
        }

        // 2. Iluminar motores usando los comandos especiales
        if (tipo === 'motor_agua' && this.bombas['riego']) {
            this.bombas['riego'].material.color.setHex(encendida ? colorAgua : apagadoAgua);
            this.bombas['riego'].material.emissive.setHex(encendida ? colorAgua : 0x000000);
            this.bombas['riego'].material.emissiveIntensity = encendida ? 0.6 : 0;
        }
        if (tipo === 'motor_abono' && this.bombas['abono']) {
            this.bombas['abono'].material.color.setHex(encendida ? colorAbono : apagadoAbono);
            this.bombas['abono'].material.emissive.setHex(encendida ? colorAbono : 0x000000);
            this.bombas['abono'].material.emissiveIntensity = encendida ? 0.6 : 0;
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
crearLampara(-0.3, 0.5, 0.3);  // zona 2

crearLampara(0.3, 0.5, -0.3);  // zona 3
crearLampara(0.3, 0.5, 0.3);   // zona 4

// bombas
function crearBomba(x, y, z, tipo) {
    const geometry = new THREE.CylinderGeometry(0.20, 0.20, 0.42, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x224455, roughness: 0.4 });
    const bomba = new THREE.Mesh(geometry, material);
    bomba.position.set(x, y, z);
    scene.add(bomba);

    if(!window.Controlador3D.bombas) window.Controlador3D.bombas = {};
    window.Controlador3D.bombas[tipo] = bomba;
}

crearBomba(-0.3, 0.1, -1.2, 'riego'); 
crearBomba(0.3, 0.1, -1.2, 'abono');

//mangueras
const P = (x, z, y = -0.05) => new THREE.Vector3(x, y, z);
 
// Borde derecho del invernadero (donde terminan las mangueras). Ajusta si hace falta.
const BORDE_Z = -0.66;
 
function crearManguera(puntos) {
    const curva = new THREE.CatmullRomCurve3(puntos, false, 'centripetal');
    const geometry = new THREE.TubeGeometry(curva, 120, 0.012, 8, false);
    const material = new THREE.MeshStandardMaterial({ color: 0x224455, roughness: 0.4, metalness: 0.1 });
    const manguera = new THREE.Mesh(geometry, material);
    scene.add(manguera);
    return manguera;
}
 
// Línea 1 (AGUA, arriba)
window.Controlador3D.manguerasAgua[0] = crearManguera([
    P(-0.30, -1.18, 0.12), P(-0.31, -0.92), P(-0.32, -0.78), P(-0.32, BORDE_Z)
]);
 
// Línea 2 (AGUA, abajo)
window.Controlador3D.manguerasAgua[1] = crearManguera([
    P(-0.12, -1.18, 0.12), P(-0.07, -0.93), P(0.04, -0.85), P(0.12, -0.78),
    P(0.23, -0.75), P(0.29, BORDE_Z)
]);
 
// Línea 3 (ABONO, arriba)
window.Controlador3D.manguerasAbono[0] = crearManguera([
    P(0.20, -1.18, 0.10), P(0.07, -0.95, 0.02), P(-0.03, -0.86),
    P(-0.14, -0.76), P(-0.24, -0.68), P(-0.25, BORDE_Z)
]);
 
// Línea 4 (ABONO, abajo)
window.Controlador3D.manguerasAbono[1] = crearManguera([
    P(0.30, -1.18, 0.12), P(0.31, -0.92), P(0.33, -0.78), P(0.35, BORDE_Z)
]);