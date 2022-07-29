# Conversor De Divisas

La página se centra en cargar de un archivo diferentes divisas, para luego mediante imputs, utilice una API (https://exchangeratesapi.io/) para calcular la conversion. A su vez, la página muestra un gráfico con los valores de la moneda a convertir en el periódo de un año. La página cuenta con almacenamiento en LocalStorage donde es posible mantener cinco conversiones recientes.

## Inicializacion

* generarDivisas() : Utilizando un Fetch se toman los datos del archivo monedas.json para luego ser cargadas como option en los select principales.
* cargarConversionesRecientes() : Mediante un operador OR toma los datos guardados en LocalStorage, si no es el caso, se mantiene vacío.
* mostrarConversionesRecientes() : Se toman los cinco divs de clase "conversion-reciente" y mediante un bucle For se guardan las conversiones recientes en cada uno.

## Conversion de Divisas

La función convertirNumero() se encarga de tomar los códigos de cada moneda seleccionada, a la vez de tomar la cantidad a convertir. Si este último no es un número, o si está vacío, indicará un error, de lo contrario, generará un nuevo objeto Conversion con los datos obtenidos. Este objeto cuenta con un método en el que realiza un Fetch a la API exchangerates, en donde enviando los datos de ambas monedas y la cantidad, se devuelve el resultado de la conversión. Este resultado se guarda como atributo de la misma conversión, además de mostrarse en pantalla como resultado. Luego, se ejecuta la funcion asignarHorario(), en donde se toman los datos actuales (Hora y Fecha) de la conversión, esta se guarda también como un atributo de la conversión.

guardarConversion(conversion) toma como parámetro la última conversión realizada y la guarda en primer lugar en el array conversionesRecientes[]. Si este array contiene mas de cinco elementos, se utiliza pop() y luego se guarda en el localStorage. Luego, se vuelve a ejecutar la función mostrarConversionesRecientes() para refrescar en pantalla las últimas cinco conversiones realizadas.

## TimeSeries

![Screenshot - 29_07_2022 , 20_18_34](https://user-images.githubusercontent.com/73026956/181859689-2544f150-b528-4b06-a685-417435aee142.png)

Antes de terminar con la conversión, se ejecuta iniciarTimeSerie(conversion) en donde, mediante otro Fetch, se solicitan datos a la API sobre el registro de la moneda seleccionada en el periodo de un año. Luego, se crea una tabla con los datos dados por el Fetch y, si la diferencia entre el primer valor menos el último valor es negativa, el esquema será verde, de lo contrario, será rojo.
