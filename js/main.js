let lblResultado = document.getElementById("lblResultadoConversion");
let btnConvertir = document.getElementById("btnConvertir");

const divisas = [];

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

function CalcularConversion(divisaPorConvertir, valor, divisaAConvertir) {
    let resultado;
    resultado = (valor / divisaPorConvertir.valorRelativo) * divisaAConvertir.valorRelativo;
    return resultado;
}

function ConvertirNumero(){
    let cantidadAConvertir = document.getElementById("cantidadAConvertir").value;
    let divisaPorConvertir = document.getElementById("divisaPorConvertir");
    let divisaAConvertir = document.getElementById("divisaAConvertir");

    let resultadoConversion;
    let unidadPorConvertir = divisaPorConvertir.value;
    let unidadAConvertir = divisaAConvertir.value;

    if(!isNaN(cantidadAConvertir) && cantidadAConvertir != ""){
        resultadoConversion = CalcularConversion(divisas[divisaPorConvertir.selectedIndex], cantidadAConvertir, divisas[divisaAConvertir.selectedIndex]).toFixed(2);
        lblResultado.innerText = (`${cantidadAConvertir} ${unidadPorConvertir} = ${resultadoConversion} ${unidadAConvertir}`);
    } else {
        lblResultado.innerText = "Ingrese un número válido"
    }
}

GenerarDivisas();
btnConvertir.addEventListener("click", ConvertirNumero);