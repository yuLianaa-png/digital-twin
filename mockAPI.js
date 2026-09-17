//simulacion hardware

//bateria %
let bateria = 100;
const elementoBateria = document.getElementById("bat-val");

setInterval(() => {
    if (bateria > 0){
        bateria -= 1;
        elementoBateria.innerText = bateria + "%";

        if (bateria <= 20) {
            elementoBateria.style.color = "red";
    }else if (bateria <= 50) {
        elementoBateria.style.color = "orange";
    }
}
}, 5000);

const btnWater = document.getElementById("btn-water");
const btnFert = document.getElementById("btn-fert");
const btnLight = document.getElementById("btn-light");

let riegoActivo = false;
let abonoActivo = false;
let luzActiva = false;

//botones riego
const btnRiegoZ1 = document.getElementById('btn-riego-z1');
const btnRiegoZ2 = document.getElementById('btn-riego-z2');
const btnRiegoZ3 = document.getElementById('btn-riego-z3');
const btnRiegoZ4 = document.getElementById('btn-riego-z4');

const botonesZonasRiego = [btnRiegoZ1, btnRiegoZ2, btnRiegoZ3, btnRiegoZ4];

let estadoRiego = [false, false, false, false];

for (let i = 0; i < botonesZonasRiego.length; i++) {
    botonesZonasRiego[i].addEventListener("click", () => {
        estadoRiego[i] = !estadoRiego[i];

        if (estadoRiego[i]) {
            botonesZonasRiego[i].innerText = "Detener Riego";
            botonesZonasRiego[i].classList.replace('bg-gray-600', 'bg-blue-600');
            
            if (window.bombas && window.bombas[i]) {
                window.bombas[i].material.color.setHex(0x00aaff); // Bomba encendida
            }
        } else {
            botonesZonasRiego[i].innerText = "Regar";
            botonesZonasRiego[i].classList.replace('bg-blue-600', 'bg-gray-600');
            
            if (window.bombas && window.bombas[i]) {
                window.bombas[i].material.color.setHex(0x224455); // Bomba apagada
            }
        }
    });
}

//boton riego general
btnWater.addEventListener("click", () => {

    riegoActivo = !riegoActivo;
    if (riegoActivo) {
        btnWater.innerText = "Detener Riego";
        btnWater.classList.replace('bg-blue-600', 'bg-red-600');
        btnWater.classList.replace('hover:bg-blue-500', 'hover:bg-red-500');
        
        for (let i = 0; i < 4; i++) {
            estadoRiego[i] = true;
            botonesZonasRiego[i].innerText = "Detener Riego";
            botonesZonasRiego[i].classList.replace('bg-gray-600', 'bg-blue-600');
            if(window.bombas && window.bombas[i]) {
                window.bombas[i].material.color.setHex(0x00aaff);
            }
        }

    } else {
        btnWater.innerText = "Activar Riego";
        btnWater.classList.replace('bg-red-600', 'bg-blue-600');
        btnWater.classList.replace('hover:bg-red-500', 'hover:bg-blue-500');
        for (let i = 0; i < 4; i++) {
            estadoRiego[i] = false;
            botonesZonasRiego[i].innerText = "Regar";
            botonesZonasRiego[i].classList.replace('bg-blue-600', 'bg-gray-600');
            if(window.bombas && window.bombas[i]) {
                window.bombas[i].material.color.setHex(0x224455);
            }
        }
    }
});

//humedad suelo %
let humedadZonas = [65, 100, 55, 60];

const elementoHumedad = [
    document.getElementById("hum-z1"),
    document.getElementById("hum-z2"),
    document.getElementById("hum-z3"),
    document.getElementById("hum-z4")
];

setInterval(() => {
    for (let i = 0; i < humedadZonas.length; i++) {
        if (estadoRiego[i]) {
            if(humedadZonas[i] < 100) {
                humedadZonas[i] += Math.floor(Math.random() * 7) + 1; //incremento aleatorio entre 1 y 7
                if (humedadZonas[i] >= 100) {
                    humedadZonas[i] = 100;
                    botonesZonasRiego[i].click(); //detener riego si llega a 100%
                }
            }
        }else{
            if(humedadZonas[i] > 0) {
                humedadZonas[i] -= Math.floor(Math.random() * 2);
            }
        }

        elementoHumedad[i].innerText = humedadZonas[i] + "%";

        if (humedadZonas[i] <= 47) {
            elementoHumedad[i].className = "text-orange-400 font-mono font-bold";
            if (!estadoRiego[i] && humedadZonas[i] <= 40) {
                botonesZonasRiego[i].click(); //activar riego si la humedad es baja y no está regando
            }
        } else {
            elementoHumedad[i].className = "text-blue-300 font-mono";
        }

    }
}, 4000);

//botones abono
/*
let nivelTanqueAbono = 100; 
let nutrientesZonas = [40, 45, 35, 50]; 
let estadoAbono = [false, false, false, false]

const btnAbonoZ1 = document.getElementById("btn-abono-z1");
const btnAbonoZ2 = document.getElementById("btn-abono-z2");
const btnAbonoZ3 = document.getElementById("btn-abono-z3");
const btnAbonoZ4 = document.getElementById("btn-abono-z4");

const botonesZonasAbono = [btnAbonoZ1, btnAbonoZ2, btnAbonoZ3, btnAbonoZ4];

for (let i = 0; i < botonesAbonoZonas.length; i++) {
    botonesAbonoZonas[i].addEventListener("click", () => {
        // 1. Invertimos el estado de la zona correspondiente
        estadoAbono[i] = !estadoAbono[i];

        // 2. Cambiamos el texto y el color del botón
        if (estadoAbono[i]) {
            botonesAbonoZonas[i].innerText = "Detener Abono";
            // Usamos verde para diferenciarlo del azul del agua
            botonesAbonoZonas[i].classList.replace('bg-gray-600', 'bg-green-600'); 
        } else {
            botonesAbonoZonas[i].innerText = "Abonar";
            botonesAbonoZonas[i].classList.replace('bg-green-600', 'bg-gray-600');
        }
    });
}*/

//boton abono
btnFert.addEventListener("click", () => {
    abonoActivo = !abonoActivo;
    if (abonoActivo) {
        btnFert.innerText = "Detener Abono";
        btnFert.classList.replace('bg-green-600', 'bg-red-600');
        btnFert.classList.replace('hover:bg-green-500', 'hover:bg-red-500');
        console.log("Bomba de abonado activado");
    } else {
        btnFert.innerText = "Activar Abono";
        btnFert.classList.replace('bg-red-600', 'bg-green-600');
        btnFert.classList.replace('hover:bg-red-500', 'hover:bg-green-500');
        console.log("Bomba de abonado desactivado");
    }
});

//botenes luz por zona
const btnLuZ1 = document.getElementById("btn-luz-z1");
const btnLuZ2 = document.getElementById("btn-luz-z2");
const btnLuZ3 = document.getElementById("btn-luz-z3");
const btnLuZ4 = document.getElementById("btn-luz-z4");
const botonesZonasLuces = [btnLuZ1, btnLuZ2, btnLuZ3, btnLuZ4];

let estadoLuces = [false, false, false, false];

for (let i = 0; i < botonesZonasLuces.length; i++) {
    botonesZonasLuces[i].addEventListener("click", () => {
        // 1. Invertir el estado de la luz específica
        estadoLuces[i] = !estadoLuces[i];

        // 2. Lógica visual y 3D
        if (estadoLuces[i]) {
            botonesZonasLuces[i].innerText = "Apagar Luz";
            botonesZonasLuces[i].classList.replace('bg-gray-600', 'bg-yellow-500');
            
            if (window.lucesZonas && window.lucesZonas[i]) {
                window.lucesZonas[i].luz.intensity = 2; // encender la luz virtual
                window.lucesZonas[i].fisica.material.color.setHex(0xff00ff); // color magenta
            }
        } else {
            botonesZonasLuces[i].innerText = "Encender Luz";
            botonesZonasLuces[i].classList.replace('bg-yellow-500', 'bg-gray-600');
            
            if (window.lucesZonas && window.lucesZonas[i]) {
                window.lucesZonas[i].luz.intensity = 0; // apagar la luz virtual
                window.lucesZonas[i].fisica.material.color.setHex(0x555555); // color gris
            }
        }
    });
}

//boton luz general
btnLight.addEventListener("click", () => {
    luzActiva = !luzActiva;

    if (luzActiva) {
        btnLight.innerText = "Apagar Luz";
        btnLight.classList.replace('bg-yellow-600', 'bg-red-600');
        btnLight.classList.replace('hover:bg-yellow-500', 'hover:bg-red-500');
        btnLight.classList.replace('text-gray-900', 'text-white');

        for (let i = 0; i < 4; i++) {
            estadoLuces[i] = true;
            botonesZonasLuces[i].innerText = "Apagar Luz";
            botonesZonasLuces[i].classList.replace('bg-gray-600', 'bg-yellow-500');

            if (window.lucesZonas && window.lucesZonas[i]) {
                window.lucesZonas[i].luz.intensity = 2; //encender la luz virtual
                window.lucesZonas[i].fisica.material.color.setHex(0xff00ff); //cambiar color de la lampara a magenta
            }
        }

    } else {
        btnLight.innerText = "Prender Luz";
        btnLight.classList.replace('bg-red-600', 'bg-yellow-600');
        btnLight.classList.replace('hover:bg-red-500', 'hover:bg-yellow-500');
        btnLight.classList.replace('text-white', 'text-gray-900');

        for (let i = 0; i < 4; i++) {
            estadoLuces[i] = false;
            botonesZonasLuces[i].innerText = "Encender Luz";
            botonesZonasLuces[i].classList.replace('bg-yellow-500', 'bg-gray-600');

            if (window.lucesZonas && window.lucesZonas[i]) {
                window.lucesZonas[i].luz.intensity = 0; //apagar la luz virtual
                window.lucesZonas[i].fisica.material.color.setHex(0x555555); //cambiar color de la lampara a gris
            }
        }
    }
});
