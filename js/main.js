let lblResultado = document.getElementById("lblResultadoConversion");
let btnConvertir = document.getElementById("btnConvertir");

const divisas = [];
const DateTime = luxon.DateTime;
let conversionesRecientes;
let horariosRecientes;

class Divisa {
    constructor(nombre, abreviatura, simbolo, valorRelativo) {
        this.nombre = nombre;
        this.abreviatura = abreviatura;
        this.simbolo = simbolo;
        this.valorRelativo = valorRelativo;
    }
}

function GenerarDivisas() {
    divisas.push(new Divisa("Dólar", "USD", "$", 1));
    divisas.push(new Divisa("Euro", "EUR", "€", 0.98));
    divisas.push(new Divisa("Libra Esterlina", "GBP", "£", 0.83));
    divisas.push(new Divisa("Peso Argentino", "ARS", "$", 126.74));
}

function CargarConversionesRecientes() {
    conversionesRecientes = JSON.parse(localStorage.getItem("ConversionesRecientes")) || []; //Operador OR
    horariosRecientes = JSON.parse(localStorage.getItem("HorariosRecientes")) || [];
}

function GenerarConversionesRecientes() {
    for (let i = 0; i < 5; i++) {
        let nuevaConversion = document.createElement("div");
        nuevaConversion.classList.add("conversion-reciente");
        document.getElementById("conversiones-recientes").append(nuevaConversion);
    }
    MostrarConversionesRecientes();
}

function MostrarConversionesRecientes() {
    let conversionesRecientesHTML = document.getElementsByClassName("conversion-reciente");
    for (let i = 0; i < conversionesRecientes.length; i++) {
        conversionesRecientesHTML[i].innerHTML = `<div class="resultado-conversion">${conversionesRecientes[i]}</div><div class="horario-conversion">${horariosRecientes[i]}</div>`;
    }
}

function CalcularConversion(divisaPorConvertir, valor, divisaAConvertir) {
    let resultado;
    resultado = (valor / divisaPorConvertir.valorRelativo) * divisaAConvertir.valorRelativo;
    return resultado;
}

function GuardarResultadoActual(resultadoActual) {
    conversionesRecientes.unshift(resultadoActual);
}

function GuardarHorarioActual(horarioActual) {
    let hora = horarioActual.toLocaleString(DateTime.TIME_24_SIMPLE);
    let fecha = horarioActual.toLocaleString(DateTime.DATE_SHORT);

    horario = `${hora} - ${fecha}`;
    horariosRecientes.unshift(horario);
}

function ConvertirNumero() {
    let cantidadAConvertir = document.getElementById("cantidadAConvertir").value;
    let divisaPorConvertir = document.getElementById("divisaPorConvertir");
    let divisaAConvertir = document.getElementById("divisaAConvertir");

    let resultadoConversion;
    let unidadPorConvertir = divisaPorConvertir.value;
    let unidadAConvertir = divisaAConvertir.value;

    if (!isNaN(cantidadAConvertir) && cantidadAConvertir != "") {
        resultadoConversion = CalcularConversion(divisas[divisaPorConvertir.selectedIndex], cantidadAConvertir, divisas[divisaAConvertir.selectedIndex]).toFixed(2);
        lblResultado.innerText = (`${cantidadAConvertir} ${unidadPorConvertir} = ${resultadoConversion} ${unidadAConvertir}`);
        GuardarResultadoActual(lblResultado.innerText);
        GuardarHorarioActual(DateTime.now());
        conversionesRecientes.length > 5 && conversionesRecientes.pop(); //Operador AND 
        horariosRecientes.length > 5 && horariosRecientes.pop();
        MostrarConversionesRecientes();
        localStorage.setItem("ConversionesRecientes", JSON.stringify(conversionesRecientes));
        localStorage.setItem("HorariosRecientes", JSON.stringify(horariosRecientes));
    } else {
        lblResultado.innerText = "Ingrese un número válido"
    }
}

GenerarDivisas();
CargarConversionesRecientes();
GenerarConversionesRecientes();
btnConvertir.addEventListener("click", ConvertirNumero);