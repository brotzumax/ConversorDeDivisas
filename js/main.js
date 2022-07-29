let lblResultado = document.getElementById("lblResultadoConversion");
let btnConvertir = document.getElementById("btnConvertir");
let btnReversa = document.getElementById("btnReversa");
let sctDivisaPorConvertir = document.getElementById("divisaPorConvertir");
let sctDivisaAConvertir = document.getElementById("divisaAConvertir");

const DateTime = luxon.DateTime;
let conversionesRecientes;
let tablaCreada = false;

//CONVERSOR
class Conversion {
    constructor(unidadPorConvertir, cantidadPorConvertir, unidadAConvertir, resultado, horarioConversion) {
        this.unidadPorConvertir = unidadPorConvertir;
        this.cantidadPorConvertir = cantidadPorConvertir;
        this.unidadAConvertir = unidadAConvertir;
        this.resultado = resultado;
        this.horarioConversion = horarioConversion;
    }

    mostrarResultado() {
        let resultadoExpandido = `${this.cantidadPorConvertir} ${this.unidadPorConvertir} = ${this.resultado} ${this.unidadAConvertir}`;
        return resultadoExpandido;
    }

    asignarHorario() {
        const horarioActual = DateTime.now();
        let hora = horarioActual.toLocaleString(DateTime.TIME_24_SIMPLE);
        let fecha = horarioActual.toLocaleString(DateTime.DATE_SHORT);

        this.horarioConversion = `${hora} - ${fecha}`;
    }

    async calcularConversion() {
        let myHeaders = new Headers();
        myHeaders.append("apikey", "vsi3J3Nd3h8tLZSnmZSEBHTqnAMR4brU");

        let requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        try {
            const resp = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${this.unidadAConvertir}&from=${this.unidadPorConvertir}&amount=${this.cantidadPorConvertir}`, requestOptions);
            const data = await resp.json();

            this.resultado = data.result.toFixed(2);

            lblResultado.innerText = this.mostrarResultado();
            this.asignarHorario();
        } catch (error) {
            console.log(error);
            lblResultado = "Error de divisas";
        }
    }
}

async function generarDivisas() {
    const monedas = [];
    try {
        const resp = await fetch("../monedas.json");
        const data = await resp.json();
        data.sort();

        for (let moneda in data) {
            let nuevaMoneda = document.createElement("option");
            nuevaMoneda.value = data[moneda].Codigo;
            nuevaMoneda.innerText = data[moneda].Nombre;
            sctDivisaPorConvertir.append(nuevaMoneda);
        }

        sctDivisaAConvertir.innerHTML = sctDivisaPorConvertir.innerHTML;
    } catch (error) {
        console.log(error);
    }
}

function cargarConversionesRecientes() {
    conversionesRecientes = JSON.parse(localStorage.getItem("ConversionesRecientes")) || []; //Operador OR
}

function generarConversionesRecientes() {
    for (let i = 0; i < 5; i++) {
        let nuevaConversion = document.createElement("div");
        nuevaConversion.classList.add("conversion-reciente");
        document.getElementById("conversiones-recientes").append(nuevaConversion);
    }
}

function mostrarConversionesRecientes() {
    let conversionesRecientesHTML = document.getElementsByClassName("conversion-reciente");
    for (let i = 0; i < conversionesRecientes.length; i++) {
        let conversionCargada = new Conversion(conversionesRecientes[i].unidadPorConvertir, conversionesRecientes[i].cantidadPorConvertir, conversionesRecientes[i].unidadAConvertir, conversionesRecientes[i].resultado, conversionesRecientes[i].horarioConversion);
        let conversion = `
            <div class="resultado-conversion">${conversionCargada.mostrarResultado()}</div>
            <div class="horario-conversion">${conversionCargada.horarioConversion}</div>
        `;
        conversionesRecientesHTML[i].innerHTML = conversion;
    }
}

function guardarConversion(conversion) {
    conversionesRecientes.unshift(conversion);
    conversionesRecientes.length > 5 && conversionesRecientes.pop();
    localStorage.setItem("ConversionesRecientes", JSON.stringify(conversionesRecientes));
}

async function convertirNumero() {
    let codigoPorConvertir = sctDivisaPorConvertir.value;
    let codigoAConvertir = sctDivisaAConvertir.value;
    let cantidadPorConvertir = document.getElementById("cantidadPorConvertir").value;

    if (!isNaN(cantidadPorConvertir) && cantidadPorConvertir != "") {
        const nuevaConversion = new Conversion(codigoPorConvertir, cantidadPorConvertir, codigoAConvertir);
        await nuevaConversion.calcularConversion();
        console.log("Despues de calcular: ");
        console.log(nuevaConversion);
        guardarConversion(nuevaConversion);
        mostrarConversionesRecientes();
        await iniciarTimeSerie(nuevaConversion);
    } else {
        lblResultado.innerText = "Ingrese un número válido"
    }
}


//TIMESERIES
async function iniciarTimeSerie(conversion) {
    const timeSerie = await solicitarDatos(conversion);
    crearTabla(timeSerie, conversion);
}

async function solicitarDatos(conversion) {
    let fechaFinal = DateTime.now();
    let fechaInicial = fechaFinal;
    fechaFinal = fechaFinal.toISODate();
    fechaInicial = fechaInicial.minus({ years: 1 }).toISODate();

    let myHeaders = new Headers();
    myHeaders.append("apikey", "vsi3J3Nd3h8tLZSnmZSEBHTqnAMR4brU");

    let requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    try {
        const resp = await fetch(`https://api.apilayer.com/exchangerates_data/timeseries?start_date=${fechaInicial}&end_date=${fechaFinal}&base=${conversion.unidadPorConvertir}&symbols=${conversion.unidadAConvertir}`, requestOptions);
        const data = await resp.json();
        const timeserie = data.rates;
        return timeserie;
    } catch (error) {
        console.log(error);
    }
}

function crearTabla(datos, conversion) {
    const labels = Object.keys(datos);
    valores = obtenerValoresMoneda(datos);
    let color;
    if(valores[0] < valores[valores.length-1]){
        color = 'rgb(0, 153, 0)';
    }else{
        color = 'rgb(255, 0, 0)';
    }

    const data = {
        labels: labels,
        datasets: [{
            label: conversion.unidadAConvertir,
            backgroundColor: color,
            borderColor: color,
            data: valores,
            pointRadius: 0,
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    if (!tablaCreada) {
        myChart = new Chart(document.getElementById('myChart'), config);
        tablaCreada = true;
    }else{
        myChart.destroy();
        myChart = new Chart(document.getElementById('myChart'), config);
    }

}

function obtenerValoresMoneda(datos) {
    const valores = [];
    const unidad = Object.entries(datos);

    for (let i = 0; i < Object.values(datos).length; i++) {
        valor = Object.values(unidad[i][1]);
        valores.push(valor[0]);
    }

    return valores;
}

function revertirDivisas(){
    let valorAuxiliar = sctDivisaAConvertir.value;
    sctDivisaAConvertir.value = sctDivisaPorConvertir.value;
    sctDivisaPorConvertir.value = valorAuxiliar;
}


//EJECUCION
generarDivisas();
cargarConversionesRecientes();
generarConversionesRecientes();
mostrarConversionesRecientes();
btnConvertir.addEventListener("click", convertirNumero);
btnReversa.addEventListener("click", revertirDivisas);