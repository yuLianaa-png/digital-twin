//hardware
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
        fugaDetectada: false
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
    estadoInvernadero.anomalias.fugaDetectada = !estadoInvernadero.anomalias.fugaDetectada;
    btnFugaA1.innerText = estadoInvernadero.anomalias.fugaDetectada ? "🔧 Reparar Rotura" : "🚨 Provocar Rotura";
    btnFugaA1.className = estadoInvernadero.anomalias.fugaDetectada
        ? "w-full bg-green-700 hover:bg-green-600 border border-green-500 text-white text-xs font-bold py-1.5 rounded-lg transition-all active:scale-95 text-center mt-2"
        : "w-full bg-red-900/40 hover:bg-red-800 border border-red-500/50 text-white text-xs font-bold py-1.5 rounded-lg transition-all active:scale-95 text-center mt-2 opacity-80";
    enviarComandoAlESP32();
});

const elementoHumedadGrupo = [document.getElementById("hum-g1"), document.getElementById("hum-g2")];
const elementoNutricionGrupo = [document.getElementById("nut-g1"), document.getElementById("nut-g2")];

const btnLight = document.getElementById("btn-light");
const botonesZonasLuces = [
    document.getElementById("btn-luz-z1"), document.getElementById("btn-luz-z2"),
    document.getElementById("btn-luz-z3"), document.getElementById("btn-luz-z4")
];

// PROCESAMIENTO DE DATOS VISUALES
function procesarMensajeESP32(datosReales) {
    //BATERÍA
    elementoBateria.innerText = Math.floor(datosReales.telemetria.bateria) + "%";
    elementoBateria.style.color = datosReales.telemetria.bateria <= 20 ? "red" : (datosReales.telemetria.bateria <= 50 ? "orange" : "");

    //ZONAS (Humedad y Nutrición)
    let valoresHum = [datosReales.telemetria.humedades[0], datosReales.telemetria.humedades[2]];
    let valoresNut = [datosReales.telemetria.nutricion[0], datosReales.telemetria.nutricion[2]];

    for (let i = 0; i < 2; i++) {
        let hum = valoresHum[i];
        elementoHumedadGrupo[i].innerText = hum + "%";
        elementoHumedadGrupo[i].className = hum <= 30 ? "text-red-400 font-mono font-bold animate-pulse" : "text-blue-300 font-mono font-bold";
        
        let nut = valoresNut[i];
        if(nut <= 30){
            elementoNutricionGrupo[i].innerHTML = nut + "% <span title='Nutrición crítica'>⚠️</span>";
            elementoNutricionGrupo[i].className = "text-red-400 font-mono font-bold animate-pulse";
        }else{
            elementoNutricionGrupo[i].innerText = nut + "%";
            elementoNutricionGrupo[i].className = "text-green-400 font-mono font-bold";
        }
    }

    //CONTROL DE AGUA PURA (grupo 1)
    let valvulasAguaActivas = 0;
    
    if (datosReales.actuadores.valvulasAgua[0]) {
        btnValvulaA1.innerText = "🔵 Agua G. Superior (Abierta)";
        btnValvulaA1.className = "w-full bg-blue-600 border border-blue-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-default";
        valvulasAguaActivas++;
    } else {
        btnValvulaA1.innerText = "⭕ Agua G. Superior (Cerrada)";
        btnValvulaA1.className = "w-full bg-gray-800 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 cursor-default";
    }

    if (datosReales.actuadores.valvulasAgua[1]) {
        btnValvulaA2.innerText = "🔵 Agua G. Inferior (Abierta)";
        btnValvulaA2.className = "w-full bg-blue-600 border border-blue-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-default";
        valvulasAguaActivas++;
    } else {
        btnValvulaA2.innerText = "⭕ Agua G. Inferior (Cerrada)";
        btnValvulaA2.className = "w-full bg-gray-800 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 cursor-default";
    }
    caudalAguaTxt.innerText = (valvulasAguaActivas * 15) + " L/m";

    //CONTROL DE FERTIRRIGACIÓN (grupo 2)
    let valvulasAbonoActivas = 0;

    if (datosReales.actuadores.valvulasAbono[0]) {
        btnValvulaF1.innerText = "🟢 Abono G. Superior (Inyectando)";
        btnValvulaF1.className = "w-full bg-green-600 border border-green-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 shadow-[0_0_15px_rgba(34,197,94,0.5)] cursor-default";
        valvulasAbonoActivas++;
    } else {
        btnValvulaF1.innerText = "⭕ Abono G. Superior (Cerrado)";
        btnValvulaF1.className = "w-full bg-gray-800 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 cursor-default";
    }

    if (datosReales.actuadores.valvulasAbono[1]) {
        btnValvulaF2.innerText = "🟢 Abono G. Inferior (Inyectando)";
        btnValvulaF2.className = "w-full bg-green-600 border border-green-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 shadow-[0_0_15px_rgba(34,197,94,0.5)] cursor-default";
        valvulasAbonoActivas++;
    } else {
        btnValvulaF2.innerText = "⭕ Abono G. Inferior (Cerrado)";
        btnValvulaF2.className = "w-full bg-gray-800 border border-gray-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all text-left pl-4 cursor-default";
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

    //LUCES
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

    //TANQUES NIVEL VISUAL 
    let nAgua = Math.floor(datosReales.telemetria.tanqueAgua);
    nivelAguaTxt.innerText = nAgua + "%";
    nivelAguaTxt.className = nAgua <= 20 ? "font-mono font-bold text-red-400 text-sm ml-1 animate-pulse" : "font-mono font-bold text-blue-400 text-sm ml-1";

    let nAbono = Math.floor(datosReales.telemetria.tanqueAbono);
    nivelAbonoTxt.innerText = nAbono + "%";
    nivelAbonoTxt.className = nAbono <= 20 ? "font-mono font-bold text-red-400 text-sm ml-1 animate-pulse" : "font-mono font-bold text-green-400 text-sm ml-1";

    if (datosReales.anomalias.fugaDetectada) {
        btnFugaA1.innerText = "🔧 Reparar Rotura";
        btnFugaA1.className = "w-full bg-green-700 hover:bg-green-600 border border-green-500 text-white text-xs font-bold py-1.5 rounded-lg transition-all active:scale-95 text-center mt-2";
    } else {
        btnFugaA1.innerText = "🚨 Provocar Rotura";
        btnFugaA1.className = "w-full bg-red-900/40 hover:bg-red-800 border border-red-500/50 text-white text-xs font-bold py-1.5 rounded-lg transition-all active:scale-95 text-center mt-2 opacity-80";
    }

    //PANEL ALERTAS
    if (window.actualizarAlertas) window.actualizarAlertas(datosReales);
}

// EVENTOS DE BOTONES
btnFugaA1.addEventListener("click", () => {
    console.log("Enviando orden de fuga...");
    clienteMQTT.publish("yuki/invernadero/comandos", "f");
});

// Botón Maestro de Luces
btnLight.addEventListener("click", () => {
    console.log("Enviando orden a todas las luces...");
    clienteMQTT.publish("yuki/invernadero/comandos", "t");
});

// Botones individuales de cada Zona
for (let i = 0; i < botonesZonasLuces.length; i++) {
    botonesZonasLuces[i].addEventListener("click", () => {
        let comandoZona = (i + 1).toString();
        console.log("Enviando orden a luz zona:", comandoZona);
        clienteMQTT.publish("yuki/invernadero/comandos", comandoZona);
    });
}

//fertirriego
btnValvulaF1.addEventListener("click", () => {
    console.log("Ordenando inyección de abono Grupo Superior...");
    clienteMQTT.publish("yuki/invernadero/comandos", "a");
});

btnValvulaF2.addEventListener("click", () => {
    console.log("Ordenando inyección de abono Grupo Inferior...");
    clienteMQTT.publish("yuki/invernadero/comandos", "b");
});

//CONEXIÓN MQTT
const clienteMQTT = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

clienteMQTT.on('connect', () => {
    console.log("🟢 Gemelo Digital conectado al Broker MQTT");
    //escuchar la telemetría del ESP32
    clienteMQTT.subscribe("yuki/invernadero/telemetria");
});

clienteMQTT.on('message', (topic, mensaje) => {
    if (topic === "yuki/invernadero/telemetria") {
        let jsonString = mensaje.toString();
        console.log("📥 Telemetría recibida del ESP32:", jsonString);

        let datosReales = JSON.parse(mensaje.toString());
        procesarMensajeESP32(datosReales); 
    }
});