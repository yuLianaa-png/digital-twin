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

btnRiegoZ1.addEventListener("click", () => {
    estadoRiego[0] = !estadoRiego[0];

    if (estadoRiego[0]) {
        btnRiegoZ1.innerText = "Detener Riego";
        btnRiegoZ1.classList.replace('bg-gray-600', 'bg-blue-600');
        if(window.bombas && window.bombas[0]) {
            window.bombas[0].material.color.setHex(0x00aaff);
        }
    } else {
        btnRiegoZ1.innerText = "Regar";
        btnRiegoZ1.classList.replace('bg-blue-600', 'bg-gray-600');
        if(window.bombas && window.bombas[0]) {
            window.bombas[0].material.color.setHex(0x224455);
        }
    }
});

btnRiegoZ2.addEventListener("click", () => {
    estadoRiego[1] = !estadoRiego[1];

    if (estadoRiego[1]) {
        btnRiegoZ2.innerText = "Detener Riego";
        btnRiegoZ2.classList.replace('bg-gray-600', 'bg-blue-600');
        if(window.bombas && window.bombas[1]) {
            window.bombas[1].material.color.setHex(0x00aaff);
        }
    } else {
        btnRiegoZ2.innerText = "Regar";
        btnRiegoZ2.classList.replace('bg-blue-600', 'bg-gray-600');
        if(window.bombas && window.bombas[1]) {
            window.bombas[1].material.color.setHex(0x224455);
        }
    }
});

btnRiegoZ3.addEventListener("click", () => {
    estadoRiego[2] = !estadoRiego[2];

    if (estadoRiego[2]) {
        btnRiegoZ3.innerText = "Detener Riego";
        btnRiegoZ3.classList.replace('bg-gray-600', 'bg-blue-600');
        if(window.bombas && window.bombas[2]) {
            window.bombas[2].material.color.setHex(0x00aaff);
        }
    } else {
        btnRiegoZ3.innerText = "Regar";
        btnRiegoZ3.classList.replace('bg-blue-600', 'bg-gray-600');
        if(window.bombas && window.bombas[2]) {
            window.bombas[2].material.color.setHex(0x224455);
        }
    }
});

btnRiegoZ4.addEventListener("click", () => {
    estadoRiego[3] = !estadoRiego[3];

    if (estadoRiego[3]) {
        btnRiegoZ4.innerText = "Detener Riego";
        btnRiegoZ4.classList.replace('bg-gray-600', 'bg-blue-600');
        if(window.bombas && window.bombas[3]) {
            window.bombas[3].material.color.setHex(0x00aaff);
        }
    } else {
        btnRiegoZ4.innerText = "Regar";
        btnRiegoZ4.classList.replace('bg-blue-600', 'bg-gray-600');
        if(window.bombas && window.bombas[3]) {
            window.bombas[3].material.color.setHex(0x224455);
        }
    }
});

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
let nivelTanqueAbono = 100; 
let nutrientesZonas = [40, 45, 35, 50]; 

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
}

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

let estadoLuces = [false, false, false, false];

btnLuZ1.addEventListener("click", () => {
    estadoLuces[0] = !estadoLuces[0];

    if (estadoLuces[0]) {
        btnLuZ1.innerText = "Apagar Luz";
        btnLuZ1.classList.replace('bg-gray-600', 'bg-yellow-500');

        if (window.lucesZonas && window.lucesZonas[0]) {
            window.lucesZonas[0].luz.intensity = 2; //encender la luz virtual de la zona 1
            window.lucesZonas[0].fisica.material.color.setHex(0xff00ff); //cambiar color de la lampara a magenta
        }

    }else{
        btnLuZ1.innerText = "Encender Luz";
        btnLuZ1.classList.replace('bg-yellow-500', 'bg-gray-600');

        if (window.lucesZonas && window.lucesZonas[0]) {
            window.lucesZonas[0].luz.intensity = 0; //apagar la luz virtual de la zona 1
            window.lucesZonas[0].fisica.material.color.setHex(0x555555); //cambiar color de la lampara a gris
        }
    }  
});

btnLuZ2.addEventListener("click", () => {
    estadoLuces[1] = !estadoLuces[1];

    if (estadoLuces[1]) {
        btnLuZ2.innerText = "Apagar Luz";
        btnLuZ2.classList.replace('bg-gray-600', 'bg-yellow-500');

        if (window.lucesZonas && window.lucesZonas[1]) {
            window.lucesZonas[1].luz.intensity = 2; //encender la luz virtual de la zona 2
            window.lucesZonas[1].fisica.material.color.setHex(0xff00ff); //cambiar color de la lampara a magenta
        }

    }else{
        btnLuZ2.innerText = "Encender Luz";
        btnLuZ2.classList.replace('bg-yellow-500', 'bg-gray-600');

        if (window.lucesZonas && window.lucesZonas[1]) {
            window.lucesZonas[1].luz.intensity = 0; //apagar la luz virtual de la zona 2
            window.lucesZonas[1].fisica.material.color.setHex(0x555555); //cambiar color de la lampara a gris
        }
    }  
});

btnLuZ3.addEventListener("click", () => {
    estadoLuces[2] = !estadoLuces[2];

    if (estadoLuces[2]) {
        btnLuZ3.innerText = "Apagar Luz";
        btnLuZ3.classList.replace('bg-gray-600', 'bg-yellow-500');

        if (window.lucesZonas && window.lucesZonas[2]) {
            window.lucesZonas[2].luz.intensity = 2; //encender la luz virtual de la zona 3
            window.lucesZonas[2].fisica.material.color.setHex(0xff00ff); //cambiar color de la lampara a magenta
        }

    }else{
        btnLuZ3.innerText = "Encender Luz";
        btnLuZ3.classList.replace('bg-yellow-500', 'bg-gray-600');

        if (window.lucesZonas && window.lucesZonas[2]) {
            window.lucesZonas[2].luz.intensity = 0; //apagar la luz virtual de la zona 3
            window.lucesZonas[2].fisica.material.color.setHex(0x555555); //cambiar color de la lampara a gris
        }
    }  
});

btnLuZ4.addEventListener("click", () => {
    estadoLuces[3] = !estadoLuces[3];

    if (estadoLuces[3]) {
        btnLuZ4.innerText = "Apagar Luz";
        btnLuZ4.classList.replace('bg-gray-600', 'bg-yellow-500');

        if (window.lucesZonas && window.lucesZonas[3]) {
            window.lucesZonas[3].luz.intensity = 2; //encender la luz virtual de la zona 4
            window.lucesZonas[3].fisica.material.color.setHex(0xff00ff); //cambiar color de la lampara a magenta
        }

    }else{
        btnLuZ4.innerText = "Encender Luz";
        btnLuZ4.classList.replace('bg-yellow-500', 'bg-gray-600');

        if (window.lucesZonas && window.lucesZonas[3]) {
            window.lucesZonas[3].luz.intensity = 0; //apagar la luz virtual de la zona 4
            window.lucesZonas[3].fisica.material.color.setHex(0x555555); //cambiar color de la lampara a gris
        }
    }  
});

//boton luz general
btnLight.addEventListener("click", () => {
    luzActiva = !luzActiva;
    const botonesZonasLuces = [btnLuZ1, btnLuZ2, btnLuZ3, btnLuZ4];

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
