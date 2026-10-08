//simulacion hardware

// (JSON)
// formato exacto que ESP32 deberá enviar y recibir
let estadoInvernadero = {
    telemetria: {
        bateria: 100,
        humedades: [65, 100, 55, 60],
        nutricion: [41, 60, 58, 100],
        tanqueAgua: 100,
        tanqueAbono: 100,
    },
    actuadores: {
        valvulasAgua: [false, false],
        valvulasAbono: [false, false],
        luces: [false, false, false, false]
    },
    anomalias: {
        fugaLinea1: false
    }
};

// REFERENCIAS DEL DOM
const elementoBateria = document.getElementById("bat-val");
const nivelAguaTxt = document.getElementById("nivel-agua");
const nivelAbonoTxt = document.getElementById("nivel-abono");
const caudalAguaTxt = document.getElementById("caudal-agua");
const caudalAbonoTxt = document.getElementById("caudal-abono");

// Botones de Válvulas
const btnValvulaA1 = document.getElementById("btn-valvula-a1");
const btnValvulaA2 = document.getElementById("btn-valvula-a2");
const btnValvulaF1 = document.getElementById("btn-valvula-f1");
const btnValvulaF2 = document.getElementById("btn-valvula-f2");

//BOTON FUGA
const btnFugaA1 = document.getElementById("btn-fuga-a1");
btnFugaA1.addEventListener("click", () => {
    estadoInvernadero.anomalias.fugaLinea1 = !estadoInvernadero.anomalias.fugaLinea1;
    btnFugaA1.innerText = estadoInvernadero.anomalias.fugaLinea1 ? "🔧 Reparar Rotura Línea 1" : "🚨 Provocar Rotura Línea 1";
    btnFugaA1.className = estadoInvernadero.anomalias.fugaLinea1
        ? "w-full bg-green-700 hover:bg-green-600 border border-green-500 text-white text-xs font-bold py-1.5 rounded-lg transition-all active:scale-95 text-center mt-2"
        : "w-full bg-red-900/40 hover:bg-red-800 border border-red-500/50 text-white text-xs font-bold py-1.5 rounded-lg transition-all active:scale-95 text-center mt-2 opacity-80";
    enviarComandoAlESP32();
});

const elementoHumedad = [
    document.getElementById("hum-z1"), document.getElementById("hum-z2"),
    document.getElementById("hum-z3"), document.getElementById("hum-z4")
];
const elementoNutricion = [
    document.getElementById("nut-z1"), document.getElementById("nut-z2"),
    document.getElementById("nut-z3"), document.getElementById("nut-z4")
];

const btnLight = document.getElementById("btn-light");
const botonesZonasLuces = [
    document.getElementById("btn-luz-z1"), document.getElementById("btn-luz-z2"),
    document.getElementById("btn-luz-z3"), document.getElementById("btn-luz-z4")
];

// PROCESAMIENTO DE DATOS VISUALES
function procesarMensajeESP32(datosReales) {
    // --- BATERÍA ---
    elementoBateria.innerText = Math.floor(datosReales.telemetria.bateria) + "%";
    elementoBateria.style.color = datosReales.telemetria.bateria <= 20 ? "red" : (datosReales.telemetria.bateria <= 50 ? "orange" : "");

    // --- ZONAS (Humedad y Nutrición) ---
    for (let i = 0; i < datosReales.telemetria.humedades.length; i++) {
        let hum = datosReales.telemetria.humedades[i];
        elementoHumedad[i].innerText = hum + "%";
        elementoHumedad[i].className = hum <= 47 ? "text-orange-400 font-mono font-bold" : "text-blue-300 font-mono";
        
        let nut = datosReales.telemetria.nutricion[i];
        if(nut <= 30){
            elementoNutricion[i].innerHTML = nut + "% <span title='Nutrición crítica'>⚠️</span>";
            elementoNutricion[i].className = "text-red-400 font-mono font-bold animate-pulse";
        }else{
            elementoNutricion[i].innerText = nut + "%";
            elementoNutricion[i].className = "text-green-400 font-mono";
        }
    }

    // --- CONTROL DE AGUA PURA (Válvulas 1 y 2) ---
    let valvulasAguaActivas = 0;
    
    if (datosReales.actuadores.valvulasAgua[0]) {
        btnValvulaA1.innerText = "🟢 Válvula 1 (Abierta)";
        btnValvulaA1.className = "w-full bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all active:scale-95 text-left pl-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
        valvulasAguaActivas++;
    } else {
        btnValvulaA1.innerText = "⭕ Válvula 1 (Cerrada)";
        btnValvulaA1.className = "w-full bg-gray-800 hover:bg-blue-900 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4";
    }

    if (datosReales.actuadores.valvulasAgua[1]) {
        btnValvulaA2.innerText = "🟢 Válvula 2 (Abierta)";
        btnValvulaA2.className = "w-full bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all active:scale-95 text-left pl-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
        valvulasAguaActivas++;
    } else {
        btnValvulaA2.innerText = "⭕ Válvula 2 (Cerrada)";
        btnValvulaA2.className = "w-full bg-gray-800 hover:bg-blue-900 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4";
    }
    caudalAguaTxt.innerText = (valvulasAguaActivas * 15) + " L/m";

    // --- CONTROL DE FERTIRRIGACIÓN (Válvulas 3 y 4) ---
    let valvulasAbonoActivas = 0;

    if (datosReales.actuadores.valvulasAbono[0]) {
        btnValvulaF1.innerText = "🟢 Válvula 3 (Abierta)";
        btnValvulaF1.className = "w-full bg-green-600 hover:bg-green-500 border border-green-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all active:scale-95 text-left pl-4 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
        valvulasAbonoActivas++;
    } else {
        btnValvulaF1.innerText = "⭕ Válvula 3 (Cerrada)";
        btnValvulaF1.className = "w-full bg-gray-800 hover:bg-green-900 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4";
    }

    if (datosReales.actuadores.valvulasAbono[1]) {
        btnValvulaF2.innerText = "🟢 Válvula 4 (Abierta)";
        btnValvulaF2.className = "w-full bg-green-600 hover:bg-green-500 border border-green-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all active:scale-95 text-left pl-4 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
        valvulasAbonoActivas++;
    } else {
        btnValvulaF2.innerText = "⭕ Válvula 4 (Cerrada)";
        btnValvulaF2.className = "w-full bg-gray-800 hover:bg-green-900 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4";
    }
    caudalAbonoTxt.innerText = (valvulasAbonoActivas * 10) + " L/m";

    if (window.Controlador3D) {
        window.Controlador3D.setEstadoValvula('agua', 0, datosReales.actuadores.valvulasAgua[0]);
        window.Controlador3D.setEstadoValvula('agua', 1, datosReales.actuadores.valvulasAgua[1]);
        window.Controlador3D.setEstadoValvula('abono', 0, datosReales.actuadores.valvulasAbono[0]);
        window.Controlador3D.setEstadoValvula('abono', 1, datosReales.actuadores.valvulasAbono[1]);


        let bombaAguaEncendida = datosReales.actuadores.valvulasAgua[0] || datosReales.actuadores.valvulasAgua[1];
        let bombaAbonoEncendida = datosReales.actuadores.valvulasAbono[0] || datosReales.actuadores.valvulasAbono[1];

        window.Controlador3D.setEstadoValvula('motor_agua', null, bombaAguaEncendida);
        window.Controlador3D.setEstadoValvula('motor_abono', null, bombaAbonoEncendida);
    }

    // --- LUCES ---
    for (let i = 0; i < datosReales.actuadores.luces.length; i++) {
        let luzEncendida = datosReales.actuadores.luces[i];
        if (window.Controlador3D) window.Controlador3D.setEstadoLuz(i, luzEncendida);
        
        botonesZonasLuces[i].innerText = luzEncendida ? "Apagar" : "Encender Luz";
        botonesZonasLuces[i].className = luzEncendida 
            ? "bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(234,179,8,0.5)] border border-yellow-400" 
            : "bg-gray-700 hover:bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors border border-gray-600";
    }

    let todasLasLucesEncendidas = !datosReales.actuadores.luces.includes(false);
    if (todasLasLucesEncendidas) {
        btnLight.innerText = "Apagar Luces";
        btnLight.className = "bg-red-600 hover:bg-red-500 w-64 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] transition-all active:scale-95 text-left pl-6 text-white";
    } else {
        btnLight.innerText = "Prender Luces";
        btnLight.className = "bg-yellow-600 hover:bg-yellow-500 w-64 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.8)] transition-all active:scale-95 text-left pl-6 text-white";
    }

    // --- TANQUES NIVEL VISUAL ---
    let nAgua = Math.floor(datosReales.telemetria.tanqueAgua);
    nivelAguaTxt.innerText = nAgua + "%";
    nivelAguaTxt.className = nAgua <= 20 ? "font-mono font-bold text-red-400 text-sm ml-1 animate-pulse" : "font-mono font-bold text-blue-400 text-sm ml-1";

    let nAbono = Math.floor(datosReales.telemetria.tanqueAbono);
    nivelAbonoTxt.innerText = nAbono + "%";
    nivelAbonoTxt.className = nAbono <= 20 ? "font-mono font-bold text-red-400 text-sm ml-1 animate-pulse" : "font-mono font-bold text-green-400 text-sm ml-1";

    //PANEL ALERTAS
    if (window.actualizarAlertas) window.actualizarAlertas(datosReales);
}

// EVENTOS DE BOTONES
function enviarComandoAlESP32() {
    procesarMensajeESP32(estadoInvernadero); 
}

btnValvulaA1.addEventListener('click', () => { estadoInvernadero.actuadores.valvulasAgua[0] = !estadoInvernadero.actuadores.valvulasAgua[0]; enviarComandoAlESP32(); });
btnValvulaA2.addEventListener('click', () => { estadoInvernadero.actuadores.valvulasAgua[1] = !estadoInvernadero.actuadores.valvulasAgua[1]; enviarComandoAlESP32(); });
btnValvulaF1.addEventListener('click', () => { estadoInvernadero.actuadores.valvulasAbono[0] = !estadoInvernadero.actuadores.valvulasAbono[0]; enviarComandoAlESP32(); });
btnValvulaF2.addEventListener('click', () => { estadoInvernadero.actuadores.valvulasAbono[1] = !estadoInvernadero.actuadores.valvulasAbono[1]; enviarComandoAlESP32(); });

btnLight.addEventListener("click", () => {
    let prenderTodas = estadoInvernadero.actuadores.luces.includes(false);
    estadoInvernadero.actuadores.luces = [prenderTodas, prenderTodas, prenderTodas, prenderTodas];
    enviarComandoAlESP32();
});

for (let i = 0; i < botonesZonasLuces.length; i++) {
    botonesZonasLuces[i].addEventListener("click", () => {
        estadoInvernadero.actuadores.luces[i] = !estadoInvernadero.actuadores.luces[i];
        enviarComandoAlESP32();
    });
}

// SIMULACIÓN (REEMPLAZA AL ESP32 TEMPORALMENTE)
setInterval(() => {
    let vAguaAbiertas = estadoInvernadero.actuadores.valvulasAgua.filter(Boolean).length;
    let vAbonoAbiertas = estadoInvernadero.actuadores.valvulasAbono.filter(Boolean).length;
    let lucesEncendidas = estadoInvernadero.actuadores.luces.filter(Boolean).length;

    // --- BATERÍA ---
    let consumo = (vAguaAbiertas * 1) + (vAbonoAbiertas * 1) + (lucesEncendidas * 0.5);
    if(consumo > 0){
        estadoInvernadero.telemetria.bateria -= consumo;
        if(estadoInvernadero.telemetria.bateria < 0) estadoInvernadero.telemetria.bateria = 0;
    } else {
        estadoInvernadero.telemetria.bateria = Math.min(100, estadoInvernadero.telemetria.bateria + 2);
    }

    // --- TANQUES ---
    if (vAguaAbiertas > 0) {
        let drenaje = 0.5 * vAguaAbiertas;
        
        if (estadoInvernadero.anomalias.fugaLinea1 && estadoInvernadero.actuadores.valvulasAgua[0]) {
            drenaje = 4.0; 
        }
        estadoInvernadero.telemetria.tanqueAgua -= drenaje;
        if (estadoInvernadero.telemetria.tanqueAgua <= 0) {
            estadoInvernadero.telemetria.tanqueAgua = 0;
            estadoInvernadero.actuadores.valvulasAgua = [false, false]; 
        }
    }
    if (vAbonoAbiertas > 0) {
        estadoInvernadero.telemetria.tanqueAbono -= (0.3 * vAbonoAbiertas);
        if (estadoInvernadero.telemetria.tanqueAbono <= 0) {
            estadoInvernadero.telemetria.tanqueAbono = 0;
            estadoInvernadero.actuadores.valvulasAbono = [false, false]; 
        }
    }

    // --- HUMEDAD Y NUTRICIÓN ---
    //sectores superiores
    for(let i = 0; i <= 1; i++){
        let recibeAgua = estadoInvernadero.actuadores.valvulasAgua[0];
        let recibeAbono = estadoInvernadero.actuadores.valvulasAbono[0];

        if (estadoInvernadero.anomalias.fugaLinea1) {
            recibeAgua = false; 
        }

        if(recibeAgua || recibeAbono){
            estadoInvernadero.telemetria.humedades[i] = Math.min(100, estadoInvernadero.telemetria.humedades[i] + (recibeAgua ? 5 : 4));
        }else{
            estadoInvernadero.telemetria.humedades[i] = Math.max(0, estadoInvernadero.telemetria.humedades[i] - 1);
        }

        if(recibeAbono){
            estadoInvernadero.telemetria.nutricion[i] = Math.min(100, estadoInvernadero.telemetria.nutricion[i] + 2);
        }else{
            estadoInvernadero.telemetria.nutricion[i] = Math.max(0, Math.random() > 0.6 ? estadoInvernadero.telemetria.nutricion[i] - 1 : estadoInvernadero.telemetria.nutricion[i]);
        }
    }

    for(let i = 2; i <= 3; i++){
        let recibeAgua = estadoInvernadero.actuadores.valvulasAgua[1];
        let recibeAbono = estadoInvernadero.actuadores.valvulasAbono[1];

        if(recibeAgua || recibeAbono){
            estadoInvernadero.telemetria.humedades[i] = Math.min(100, estadoInvernadero.telemetria.humedades[i] + (recibeAgua ? 5 : 4));
        }else{
            estadoInvernadero.telemetria.humedades[i] = Math.max(0, estadoInvernadero.telemetria.humedades[i] - 1);
        }

        if(recibeAbono){
            estadoInvernadero.telemetria.nutricion[i] = Math.min(100, estadoInvernadero.telemetria.nutricion[i] + 2);
        }else{
            estadoInvernadero.telemetria.nutricion[i] = Math.max(0, Math.random() > 0.6 ? estadoInvernadero.telemetria.nutricion[i] - 1 : estadoInvernadero.telemetria.nutricion[i]);
        }
    }

    //SISTEMA ANTI SOBRERIEGO Y ANTI SOBRENUTRICIÓN
    //zona 1 y 2 (superior)
    if(estadoInvernadero.telemetria.humedades[0] >= 100 || estadoInvernadero.telemetria.humedades[1] >= 100){
        estadoInvernadero.actuadores.valvulasAgua[0] = false;
        estadoInvernadero.actuadores.valvulasAbono[0] = false;
    }
    if(estadoInvernadero.telemetria.nutricion[0] >= 100 || estadoInvernadero.telemetria.nutricion[1] >= 100){
        estadoInvernadero.actuadores.valvulasAbono[0] = false;
    }

    //zona 2 y 3 (inferior)
    if(estadoInvernadero.telemetria.humedades[2] >= 100 || estadoInvernadero.telemetria.humedades[3] >= 100){
        estadoInvernadero.actuadores.valvulasAgua[1] = false;
        estadoInvernadero.actuadores.valvulasAbono[1] = false;
    }
    if(estadoInvernadero.telemetria.nutricion[2] >= 100 || estadoInvernadero.telemetria.nutricion[3] >= 100){
        estadoInvernadero.actuadores.valvulasAbono[1] = false;
    }

    procesarMensajeESP32(estadoInvernadero);

}, 4000);

procesarMensajeESP32(estadoInvernadero);