const listaAlertas = document.getElementById('lista-alertas');

window.actualizarAlertas = function(datos){
    let alertas = [];

    //ALERTA DE FUGA DESDE EL HARDWARE
    if(datos.anomalias.fugaDetectada){
        alertas.push(`[SISTEMA HIDRÁULICO] 🔴 CRÍTICO: Fuga detectada por la IA del microcontrolador. Cierre automático de válvulas activado.`);
    }

    //FALLA DE PRESION EN ESTANQUES
    if (datos.telemetria.tanqueAgua === 0) {
        alertas.push(`[SISTEMA HIDRÁULICO] 🔴 CRÍTICO: Corte en el flujo de riego. Presión cero en red de agua.`);
    }
    if (datos.telemetria.tanqueAbono === 0) {
        alertas.push(`[SISTEMA HIDRÁULICO] 🔴 CRÍTICO: Falla de presión en red de fertirrigación. Flujo interrumpido.`);
    }

    //UMBRALES ANOMALOS
    if(datos.telemetria.bateria <= 20){
        alertas.push(`[NODOS LORA] Umbral anómalo: Batería crítica en estación de campo (${Math.floor(datos.telemetria.bateria)}%).`);
    }
    if(datos.telemetria.tanqueAgua > 0 && datos.telemetria.tanqueAgua <= 15){
        alertas.push(`[ESTANQUES] Umbral anómalo: Reserva de agua baja (${Math.floor(datos.telemetria.tanqueAgua)}%).`);
    }
    if(datos.telemetria.tanqueAbono > 0 && datos.telemetria.tanqueAbono <= 15){
        alertas.push(`[ESTANQUES] Umbral anómalo: Reserva de fertirriego baja (${Math.floor(datos.telemetria.tanqueAbono)}%).`);
    }

    //DESVIACION NIVELES OPTIMOS DE HUMEDAD
    datos.telemetria.humedades.forEach((hum, i) => {
        if(hum < 30){
            alertas.push(`[ZONA ${i+1}] Sequía severa. Nivel bajo el óptimo (${hum}%).`);
        } else if(hum >= 100){
            alertas.push(`[ZONA ${i+1}] Saturación de suelo (100%). Riesgo de asfixia, no regar más.`);
        }
    });

    //ACTUALIZACIÓN DOM
    if(alertas.length === 0){
        listaAlertas.innerHTML = `<li class="text-green-400">✔️ Enlace LoRa OK. Sistemas operando sin desviaciones.</li>`;
        listaAlertas.parentElement.classList.replace('border-red-500/50', 'border-green-500/30');
        listaAlertas.parentElement.classList.replace('shadow-[0_0_20px_rgba(239,68,68,0.2)]', 'shadow-[0_0_20px_rgba(34,197,94,0.1)]');
    } else {
        listaAlertas.innerHTML = alertas.map(a => `<li class="text-red-300">⚠️ ${a}</li>`).join('');
        listaAlertas.parentElement.classList.replace('border-green-500/30', 'border-red-500/50');
        listaAlertas.parentElement.classList.replace('shadow-[0_0_20px_rgba(34,197,94,0.1)]', 'shadow-[0_0_20px_rgba(239,68,68,0.2)]');
    }
};