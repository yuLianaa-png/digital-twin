//simulacion hardware

// (JSON)
// formato exacto que ESP32 deberá enviar y recibir
let estadoInvernadero = {
    telemetria: {
        bateria: 100,
        humedades: [65, 100, 55, 60],
        nutricion: [41, 60, 58, 100]
    },
    actuadores: {
        riego: false,
        abono: false,
        luces: [false, false, false, false]
    }
};

// Referencias del DOM
const elementoBateria = document.getElementById("bat-val");

const elementoHumedad = [
    document.getElementById("hum-z1"),
    document.getElementById("hum-z2"),
    document.getElementById("hum-z3"),
    document.getElementById("hum-z4")
];
const elementoNutricion = [
    document.getElementById("nut-z1"),
    document.getElementById("nut-z2"),
    document.getElementById("nut-z3"),
    document.getElementById("nut-z4")
];

const btnWater = document.getElementById("btn-water");
const btnFert = document.getElementById("btn-fert");
const btnLight = document.getElementById("btn-light");
const botonesZonasLuces = [
    document.getElementById("btn-luz-z1"),
    document.getElementById("btn-luz-z2"),
    document.getElementById("btn-luz-z3"),
    document.getElementById("btn-luz-z4")
];

// simula recibir un mensaje por WebSocket
function procesarMensajeESP32(datosReales) {
    // actualiza bateria
    elementoBateria.innerText = Math.floor(datosReales.telemetria.bateria) + "%";
    elementoBateria.style.color = datosReales.telemetria.bateria <= 20 ? "red" : (datosReales.telemetria.bateria <= 50 ? "orange" : "");

    for (let i = 0; i < datosReales.telemetria.humedades.length; i++) {
        // actualiza humedad por zonas
        let hum = datosReales.telemetria.humedades[i];
        elementoHumedad[i].innerText = hum + "%";
        elementoHumedad[i].className = hum <= 47 ? "text-orange-400 font-mono font-bold" : "text-blue-300 font-mono";
        
        //actualiza nutricion por zona
        let nut = datosReales.telemetria.nutricion[i];

        if(nut <= 30){
            elementoNutricion[i].innerHTML = nut + "% <span title='Nutrición crítica'>⚠️</span>";
            elementoNutricion[i].className = "text-red-400 font-mono font-bold animate-pulse";

        }else{
            elementoNutricion[i].innerText = nut + "%";
            elementoNutricion[i].className = "text-green-400 font-mono";
        }
    }

    // actualiza interfaz y 3d de las bombas
    if (window.Controlador3D) {
        window.Controlador3D.setEstadoBomba('riego', datosReales.actuadores.riego);
        window.Controlador3D.setEstadoBomba('abono', datosReales.actuadores.abono);
    }
    
    //Botón Riego
    btnWater.innerText = datosReales.actuadores.riego ? "Detener Riego" : "Activar Riego";
    btnWater.className = datosReales.actuadores.riego 
        ? "bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 w-64 py-3.5 rounded-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all active:scale-95 text-left pl-6 text-white border border-red-500/30 tracking-wide" 
        : "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 w-64 py-3.5 rounded-xl font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all active:scale-95 text-left pl-6 text-white border border-blue-500/30 tracking-wide";

    //Botón Abono
    btnFert.innerText = datosReales.actuadores.abono ? "Detener Abono" : "Activar Abono";
    btnFert.className = datosReales.actuadores.abono 
        ? "bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 w-64 py-3.5 rounded-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all active:scale-95 text-left pl-6 text-white border border-red-500/30 tracking-wide" 
        : "bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 w-64 py-3.5 rounded-xl font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all active:scale-95 text-left pl-6 text-white border border-green-500/30 tracking-wide";

    //Botones de Luces por Zona
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
}

// simula envios de comandos a la esp32
function enviarComandoAlESP32() {
    //aqui debera ir WebSocket: socket.send(JSON.stringify(estadoInvernadero.actuadores))
    procesarMensajeESP32(estadoInvernadero); // autoactualiza para simulación
}

// evento botones
btnWater.addEventListener("click", () =>{
    estadoInvernadero.actuadores.riego = !estadoInvernadero.actuadores.riego;

    if(!estadoInvernadero.actuadores.riego && estadoInvernadero.actuadores.abono){
        estadoInvernadero.actuadores.abono = false;
    }
    enviarComandoAlESP32();
});

btnFert.addEventListener("click", () => {
    estadoInvernadero.actuadores.abono = !estadoInvernadero.actuadores.abono

    if(estadoInvernadero.actuadores.abono && estadoInvernadero.actuadores.riego){
        estadoInvernadero.actuadores.riego = true;
    }
    enviarComandoAlESP32();
});

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

// reemplaza la lectura de los sensores del esp32, mientras
setInterval(() => {
    //bateria
    let consumo = 0;
    if(estadoInvernadero.actuadores.riego) consumo += 2;
    if(estadoInvernadero.actuadores.abono) consumo += 2;

    let lucesEncendidas = estadoInvernadero.actuadores.luces.filter(luz => luz === true).length;
    consumo += lucesEncendidas * 1;

    if(consumo > 0){
        estadoInvernadero.telemetria.bateria -= consumo;
        if(estadoInvernadero.telemetria.bateria < 0) estadoInvernadero.telemetria.bateria = 0;
    } else {
        estadoInvernadero.telemetria.bateria += 2;
        if (estadoInvernadero.telemetria.bateria > 100) estadoInvernadero.telemetria.bateria = 100;
    }


    let todasAlMaximo = true;
    for (let i = 0; i < estadoInvernadero.telemetria.humedades.length; i++) {
        //humedad
        if (estadoInvernadero.actuadores.riego) {
            if (estadoInvernadero.telemetria.humedades[i] < 100) {
                estadoInvernadero.telemetria.humedades[i] += Math.floor(Math.random() * 7) + 1;
                if (estadoInvernadero.telemetria.humedades[i] > 100) estadoInvernadero.telemetria.humedades[i] = 100;
            }
        } else {
            if (estadoInvernadero.telemetria.humedades[i] > 0) {
                estadoInvernadero.telemetria.humedades[i] -= Math.floor(Math.random() * 2);
            }
        }

        if (estadoInvernadero.telemetria.humedades[i] < 100) todasAlMaximo = false;
        
        //riego automatico
        if (!estadoInvernadero.actuadores.riego && estadoInvernadero.telemetria.humedades[i] <= 40) {
            estadoInvernadero.actuadores.riego = true;
        }

        //nutricion
        if (estadoInvernadero.actuadores.abono && estadoInvernadero.actuadores.riego) {
            if (estadoInvernadero.telemetria.nutricion[i] < 100) {
                estadoInvernadero.telemetria.nutricion[i] += Math.floor(Math.random() * 4) + 1;
                if (estadoInvernadero.telemetria.nutricion[i] > 100) estadoInvernadero.telemetria.nutricion[i] = 100;
            }
        } else {
            if (estadoInvernadero.telemetria.nutricion[i] > 0 && Math.random() > 0.6) {
                estadoInvernadero.telemetria.nutricion[i] -= 1;
            }
        }
    }

    //apaga riego al llegar a 100%
    if (todasAlMaximo && estadoInvernadero.actuadores.riego) {
        estadoInvernadero.actuadores.riego = false;
        if (estadoInvernadero.actuadores.abono) {
            estadoInvernadero.actuadores.abono = false;
        }
    }

    // refresca la vista con los nuevos datos simulados
    procesarMensajeESP32(estadoInvernadero);

}, 4000);

// se ejecuta una vez al inicio para pintar el estado por defecto
procesarMensajeESP32(estadoInvernadero);