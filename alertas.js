const listaAlertas = document.getElementById('lista-alertas');

//MEMORIA
let telemetriaPrevia = null;
let contadorSospechaFuga = 0;

//ANALISIS FUGA
window.actualizarAlertas = function(datos){
    let alertas = [];

   if(telemetriaPrevia){
        let consumoAgua = telemetriaPrevia.tanqueAgua - datos.telemetria.tanqueAgua;
        let humedadEstancada = (datos.telemetria.humedades[0] <= telemetriaPrevia.humedades[0]) && (datos.telemetria.humedades[1] <= telemetriaPrevia.humedades[1]);

        if(datos.actuadores.valvulasAgua[0] && consumoAgua > 2.0 && humedadEstancada){
            contadorSospechaFuga++;
        }else{
            contadorSospechaFuga = 0;
        }

        if(contadorSospechaFuga >= 2){
            alertas.push(`[SISTEMA HIDRAULICO] 🔴 CRÍTICO: Caída de presion anómala detectada. Pérdida masiva de causal sin absorción en suelo. Evaluar posible rotura en Línea 1`)
        }
   }

   //FALLA PRTESION O CORTE DE FLUJO
   if (datos.telemetria.tanqueAgua === 0) {
        alertas.push(`[SISTEMA HIDRÁULICO] 🔴 CRÍTICO: Corte en el flujo de riego. Presión cero en red de agua.`);
    }
    if (datos.telemetria.tanqueAbono === 0) {
        alertas.push(`[SISTEMA HIDRÁULICO] 🔴 CRÍTICO: Falla de presión en red de fertirrigación. Flujo interrumpido.`);
    }

    //UMBRALES ANOMALOS
   if(datos.telemetria.bateria <= 20){
        alertas.push(`[NODOS LORA] Umbral anómalo: Batería crítica en estacion de campo (${Math.floor(datos.telemetria.bateria)}%). Reemplazar batería a la brevedad.`);
   }
   if(datos.telemetria.tanqueAgua <= 15){
        alertas.push(`[ESTANQUES] Umbral anómalo: Reserva de agua baja (${Math.floor(datos.telemetria.tanqueAgua)}%). Reponer agua a la brevedad.`);
   }
   if(datos.telemetria.tanqueAbono <= 15){
        alertas.push(`[ESTANQUES] Umbral anómalo: Reserva de fertirriego baja (${Math.floor(datos.telemetria.tanqueAbono)}%). Reponer fertilizante a la brevedad.`);
   }

   //DESVIACION NIVELES OPTIMOS DE HUMEDAD
   datos.telemetria.humedades.forEach((hum, i) => {
        if(hum < 30){
            alertas.push(`[ZONA ${i+1}] Sequía severa. Nivel bajo el optimo (${hum}%).`);
        } else if(hum >= 100){
            alertas.push(`[ZONA ${i+1}] Saturación de suelo (100%). Riesgo de asfixia, no regar más.`);
        }
   });

   //ACTUALIZACION DOM
   if(alertas.length === 0){
        listaAlertas.innerHTML = `<li class="text-green-400">✔️ Enlace LoRa OK. Sistemas operando sin desviaciones.</li>`;
        listaAlertas.parentElement.classList.replace('border-red-500/50', 'border-green-500/30');
        listaAlertas.parentElement.classList.replace('shadow-[0_0_20px_rgba(239,68,68,0.2)]', 'shadow-[0_0_20px_rgba(34,197,94,0.1)]');
   } else {
        listaAlertas.innerHTML = alertas.map(a => `<li class="text-red-300">⚠️ ${a}</li>`).join('');
        listaAlertas.parentElement.classList.replace('border-green-500/30', 'border-red-500/50');
        listaAlertas.parentElement.classList.replace('shadow-[0_0_20px_rgba(34,197,94,0.1)]', 'shadow-[0_0_20px_rgba(239,68,68,0.2)]');
   }

   //GUARDAR
   telemetriaPrevia = {
        tanqueAgua: datos.telemetria.tanqueAgua,
        humedades: [...datos.telemetria.humedades]
   };

};