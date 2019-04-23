# Arquitectura de Software: Informe de Performance Testing

Comenzaremos este informe detallando las bases del proyecto llevado a cabo. En este trabajo práctico nos planteamos el objetivo de analizar atributos de calidad de un sistema dummy el cual tiene unos pocos endpoints. A través de herramientas como Artillery, Graphite, Grafana, y CAdvisor generaremos y recopilaremos información de forma tal que podamos llevar a cabo un análisis seguido de una reflexión final de las conclusiones obtenidas. Nuestro sistema dummy tendrá dos servidores, uno en Node.js y otro en Python (el cual utilizara Flask y Gunicorn para funcionar como servidor).

## Load Test

Para el caso del load test primero seguimos un esquema muy simple de "Phases". Primero habría una rampa de requests subiendo de 5 a 30 en 60 segundos para simular un comienzo estable y luego mantuvimos la cantidad de requests por segundo en 30 los siguientes dos minutos. Este esquema se repitió en todos los otros casos de load test.

<div class="schemeImg">
	<img class="phasesScheme" src="py/data/Python Load Test/requestsPorSegundo.png">
</div>
	
### Node: Ping

En el caso del Ping hay dos particularidades importantes a notar, la cantidad de requests pendientes es bastante estable a través de los periodos de 10 segundos. El otro hecho a notar muy importante es que el tiempo de respuesta tiene una varianza muy alta con respecto a los otros dos endpoints. En cuanto al uso de la memoria y el procesador no se ve algo muy extraño, el uso de los procesadores se mantiene bastante constante a travez de toda la experiencia y la memoria tambien.
	
<div>
	<table>
	<tr>
		<td><img src="js/data/Node Load Test/pendingRequests.png"></td>
		<td><img src="js/data/Node Load Test/responseTime.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Load Test/usoDeProcesador.png"></td>
		<td><img src="js/data/Node Load Test/usoDeMemoria.png"></td>
	</tr>
	</table>
</div>

### Python: Ping

En este caso, se puede observar que el comportamiento es similar al obtenido con Node. Esto se debe principalmente a que se trata de un caso en el cual no hay una sobrecarga de requests y en la cual no se realizan operaciones que permitan que el asincronismo de Node marque una diferencia por sobre Python. De esta forma, el comportamiento de ambos es similar.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Load Test/pendingRequests.png"></td>
		<td><img src="py/data/Python Load Test/responseTime.png"></td>
	</tr>
	</table>
</div>

### Node: Timeout

En el load test de Node timeout esta la particularidad muy importante a notar, esta es que el response time tiene una varianza muy pequeña, casi no hay diferencia entre los tiempos medios y los mas altos. La cantidad pending requests es constante, siempre se mantiene en 300 en la fase constante. En cuanto al uso de memoria se puede ver también cómo es más gradual en este caso. Lo más curioso de este endpoint es como el timeout parece ordenar las ejecuciones del servidor manteniendo un servidor con poca variabilidad. Aunque en el caso del ping la variabilidad no era extremadamente alta, quizás para un servicio que necesite respuestas en tiempo constante esta información es muy útil. Este comportamiento se puede justificar debido manejo asincrónico de I/O que hace Node.

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Timeout Load Test/pendingRequests.png"></td>
		<td><img src="js/data/Node Timeout Load Test/responseTime.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Timeout Load Test/usoDeProcesador.png"></td>
		<td><img src="js/data/Node Timeout Load Test/usoDeMemoria.png"></td>
	</tr>
	</table>
</div>

### Python: Timeout

En este caso, se puede observar que a medida que va recibiendo requests estos se van acumulando en pendientes, ya que debe realizar el timeout. Al mismo tiempo se produce un incremento en el tiempo de respuesta, así como también en algunos errores (principalmente debido a que no puedo procesar todos los requests). En la terminal se pueden observar logs de nginx como el siguiente:

```
nginx_1     | 172.18.0.1 - - [20/Apr/2019:22:40:57 +0000] "GET /gunicorn/timeout HTTP/1.1" 504 167 "-" "Artillery (https://artillery.io)" "-"
nginx_1     | 2019/04/20 22:40:57 [alert] 6#6: 1024 worker_connections are not enough
```

En este caso, sí se puede observar una diferencia con Node, ya que Node puede aprovechar el asincronismo, mientras que Python debe procesar los requests sincrónicamente.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Timeout Load Test/pendingRequestsComparisonHeavy.png"></td>
		<td><img src="py/data/Python Timeout Load Test/responseTimeHeavy.png"></td>
	</tr>
	</table>
</div>

Además, se puede observar que suparados los 3 mins de duración del periodo de envío de requests se comienzan a disminuir los requests pendientes. Esto puede deberse a que queda una ventana en la cual no se reciben requests (por lo que no se acumulan pendientes) y se siguen resolviendo los pendientes.

Haciendo uso de un timeout menor (de 0.1s en lugar de 5s), se puede observar que aumenta la cantidad de requests completados y disminuye la cantidad de errores, así como también se disminuye el tiempo de respuesta en general. Es claro, que a medida que se disminuye el timeout se comenzarán a completar más requests ya que se podrán ir respondiendo cada uno más rápido (acercándose cada vez más al comportamiento de Ping).

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Timeout Load Test/pendingRequestsComparison.png"></td>
		<td><img src="py/data/Python Timeout Load Test/responseTime.png"></td>
	</tr>
	</table>
</div>

### Node: Intensive

En el load test de Node intensive podemos ver que al igual que en el caso del Ping la cantidad de requests que están pendientes siempre se mantiene bastante bajo, y en cuanto al response time podemos ver también una varianza mucho menor, aunque haya ocasionalmente algunos disparos hacia arriba por lo general se mantienen bastante juntas las dos curvas. 

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Intensive Load Test/pendingRequests.png"></td>
		<td><img src="js/data/Node Intensive Load Test/responseTime.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Intensive Load Test/usoDeProcesador.png"></td>
		<td><img src="js/data/Node Intensive Load Test/usoDeMemoria.png"></td>
	</tr>
	</table>
</div>

Sin embargo, si se incrementa el procesamiento realizado en el endpoint se comienza a ver un comportamiento más similar al obtenido con timeout en Python. Si bien al comienzo (durante la rampa inicial) se mantiene un tiempo de respuesta bajo y pocos requests pendientes, luego se comienzan a acumular requests pendientes (aunque no al mismo nivel que ocurría en el timeout con Python) y se observan algunos errores reportados. 

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Intensive Load Test/pendingRequestsComparisonHeavy.png"></td>
		<td><img src="js/data/Node Intensive Load Test/responseTimeHeavy.png"></td>
	</tr>
	</table>
</div>

En este caso también se observa que luego del tiempo de emisión de requests comienzan a disminuir los requests pendientes.

### Python: Intensive

En el caso de Python, se observan resultados similares a los obtenidos en Node. En condiciones normales, con un procesamiento bajo, se observa un tiempo de respuesta bajo y pocos requests pendientes. Pero cuando se incrementa el procesamiento, comienza a aumentar el tiempo de respuesta y los requests pendientes.

Para este caso, como Node no puede hacer aprovechamiento del asincronismo, no se observan diferencias cualitativas entre el comportamiento de Node y el de Python.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Intensive Load Test/pendingRequests.png"></td>
		<td><img src="py/data/Python Intensive Load Test/responseTime.png"></td>
	</tr>
	<tr>
		<td><img src="py/data/Python Intensive Load Test/pendingRequestsComparison.png"></td>
	</tr>
	</table>
</div>

Para casos con mayor procesamiento:

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Intensive Load Test/pendingRequestsHeavy.png"></td>
		<td><img src="py/data/Python Intensive Load Test/responseTimeHeavy.png"></td>
	</tr>
	<tr>
		<td><img src="py/data/Python Intensive Load Test/pendingRequestsComparisonHeavy.png"></td>
	</tr>
	</table>
</div>

## Stress Test

En estas pruebas simulamos un uso más intensivo de lo común para el servidor, para esto simulamos 80 usuarios activos por segundo, un total de 4800 requests por minuto. Mantuvimos más o menos las mismas "_Phases_" que en la prueba anterior, con la diferencia de que esta vez subimos hasta 80. Este esquema se repitió en todos los casos menos en el último, donde probamos un escenario donde quisimos poner al límite al servidor que mas capacidad deberia soportar (Ping) a ver cual era el resultado.

<img class="phasesScheme" src="py/data/Python Stress Test/requestsPorSegundo.png">

### Node: Ping

En este endpoint pudimos ver un comportamiento similar al del escenario anterior, aunque los tiempos fueron por lo general más altos lo cual era de esperarse. Las curvas tuvieron un comportamiento similar, mientras que el tiempo medio se mantenía dentro de los parámetros, los tiempos máximos eran más erráticos. En cuanto al estado de los requests a medida que pasaba el tiempo también podemos ver un comportamiento similar. En resumidas palabras sucedió lo que se esperaba, mismo patrón de comportamiento pero con números más altos.

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Stress Test/responseTimeComparison.png"></td>
		<td><img src="js/data/Node Stress Test/responseTime.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Stress Test/pendingRequests.png"></td>
		<td><img src="js/data/Node Stress Test/pendingRequestsComparison.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Stress Test/usoDeProcesador.png"></td>
		<td><img src="js/data/Node Stress Test/usoDeMemoria.png"></td>
	</tr>
	</table>
</div>

### Python: Ping

Para este caso, ocurrió lo mismo que para Node. Se mantuvo el comportamiento que para el caso de Load Test, con valores superiores (como se esperaba).

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Stress Test/pendingRequestsComparison.png"></td>
		<td><img src="py/data/Python Stress Test/responseTime.png"></td>
	</tr>
	</table>
</div>

### Node: Timeout

Con el endpoint de timeout podemos ver también un comportamiento similar en cuanto a los tiempos de respuesta los cuales se mantuvieron todos bastante parecidos, lo cual fortalecería nuestra teoría de que el timeout funciona como un ordenador de los requests y hace que tengan un tiempo de respuesta constante. Por otro lado hubo varios requests que presentaron errores ECONNRESET, que indica que la conexión se cerró abruptamente, esto lo podríamos llegar a adjudicar al overhead del timeout, pero luego de buscar en internet parece ser que la implementación del setTimeout de Node es bastante eficiente y no debería haber problema con el timeout.

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Timeout Stress Test/pendingRequests.png"></td>
		<td><img src="js/data/Node Timeout Stress Test/responseTime.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Timeout Stress Test/usoDeProcesador.png"></td>
		<td><img src="js/data/Node Timeout Stress Test/usoDeMemoria.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Timeout Stress Test/artilleryFeedback.png"></td>
	</tr>
	</table>
</div>

### Python: Timeout

Al igual que para Ping, el comportamiento es similar al obtenido para el Load test, con la diferencia esperable de que los valores son más altos de request con error y pendientes son más altos.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Timeout Stress Test/pendingRequestsComparison.png"></td>
		<td><img src="py/data/Python Timeout Stress Test/responseTime.png"></td>
	</tr>
	</table>
</div>

### Node: Intensive

Para este endpoint podemos ver que el patrón de comportamiento cambió bastante, no mantuvo una varianza baja, como en el caso del Load Test. Podemos ver igualmente que los valores no crecieron mucho, sino que crecieron como mucho un 50%, en cuanto al resto de las mediciones no hay nada muy importante a notar. 

Para el Stress Test no se realizó la prueba de incrementar el procesamiento, pero se esperaría que nuevamente se produzca una aumento de los requests pendientes y que se produzcan algunos errores.

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Intensive Stress Test/responseTimeComparison.png"></td>
		<td><img src="js/data/Node Intensive Stress Test/responseTime.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Intensive Stress Test/pendingRequests.png"></td>
		<td><img src="js/data/Node Intensive Stress Test/usoDeMemoria.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Intensive Stress Test/usoDeProcesador.png"></td>
	</tr>
	</table>
</div>

### Python: Intensive

Como se puede ver, en este caso los resultados fueron similares a los obtenidos en el Load Test.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Intensive Stress Test/pendingRequestsComparison.png"></td>
		<td><img src="py/data/Python Intensive Stress Test/responseTime.png"></td>
	</tr>
	</table>
</div>

Con mayor procesamiento:

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Intensive Stress Test/pendingRequestsComparisonHeavy.png"></td>
		<td><img src="py/data/Python Intensive Stress Test/responseTimeHeavy.png"></td>
	</tr>
	</table>
</div>

## Heavy Stress Test

Para este último caso probamos el endpoint Ping con 400 requests por segundo. 



### Node: Ping

Lamentablemente artillery no puedo generar tantas como quisimos, y esto lo podemos ver primero por la irregularidad de lo que debería ser la meseta de request en la imagen de "Scenarios Launched", en su punto más alto variaba desde 1200 requests cada 10 segundos y 1800. El escenario terminó durando 8 minutos (5 más de lo esperado). En cuanto al tiempo de respuesta podemos ver un comportamiento similar a todos los que probamos el endpoint Ping, hay una varianza muy alta en los tiempos de respuesta. 

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Heavy Stress Test/requestsPorSegundo.png"></td>
		<td><img src="js/data/Node Heavy Stress Test/pendingRequests.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Heavy Stress Test/responseTime.png"></td>
		<td><img src="js/data/Node Heavy Stress Test/artilleryFeedbackGeneral.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Heavy Stress Test/usoDeProcesador.png"></td>
		<td><img src="js/data/Node Heavy Stress Test/usoDeMemoria.png"></td>
	</tr>
	</table>
</div>

### Python: Ping

Al igual que en Node se puede observar que el comportamiento fue similar al de las otras pruebas con Ping. Asimismo, también se observa la irregularidad mencionada previamente en la meseta. En cuanto al tiempo de respuesta, salvo por un pico en 4s, se mantuvo bajo.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Heavy Stress Test/requestsPorSegundo.png"></td>
		<td><img src="py/data/Python Heavy Stress Test/pendingRequestsComparison.png"></td>
	</tr>
	<tr>
		<td><img src="py/data/Python Heavy Stress Test/responseTime.png"></td>
	</tr>	
	</table>
</div>

## Spike Test

En este último escenario decidimos probar el comportamiento del servidor cuando la cantidad de requests por segundo aumenta una forma no esperada, casi exponencial. Para esto creamos una rampa de 5 requests a 400 requests en 20 segundos, a ver cual era el comportamiento que habría en cada uno de los endpoints de los servidores.

<img class="phasesScheme" src="py/data/Python Spike Test/requestsPorSegundo.png">

### Node: Ping

Este fue uno de los escenarios mas extraño de los que probamos. Podemos ver que aunque los tiempos de respuesta tuvieron una gran separación entre los tiempos medios y los tiempos máximos, la diferencia se mantuvo constante. Puede ser que esto se deba a la duración del escenario ya que duró sólo 20 segundos, pero no tenía sentido subir la cantidad de requests (el límite para estos lo encontramos en el escenario pasado y pudimos ver que estaba cerca de 1500 cada 10 segundos).

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Spike Test/pendingRequestsComparison.png"></td>
		<td><img src="js/data/Node Spike Test/pendingRequests.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Spike Test/responseTime.png"></td>
		<td><img src="js/data/Node Spike Test/usoDeMemoria.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Spike Test/usoDeProcesador.png"></td>
	</tr>
	</table>
</div>

### Python: Ping

En este caso, se puede observar también que el comportamiento no difiere mucho de los otros casos de Ping. 

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Spike Test/pendingRequestsComparison.png"></td>
		<td><img src="py/data/Python Spike Test/responseTime.png"></td>
	</tr>
	</table>
</div>

### Node: Timeout

Como era de esperarse al igual que en el caso del Stress Test un determinado número de requests fallaron en el caso del timeout, pero el patrón de comportamiento fue similar.

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Timeout Spike Test/responseTime.png"></td>
		<td><img src="js/data/Node Timeout Spike Test/pendingRequests.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Timeout Spike Test/usoDeProcesador.png"></td>
		<td><img src="js/data/Node Timeout Spike Test/usoDeMemoria.png"></td>
	</tr>
	</table>
</div>

### Python: Timeout

Se puede observar que la curva de estado de los requests es similar a la obtenida con Node, se acumula una gran cantidad de requests pendientes, sin embargo, es importante observar que la cantidad de requests completados en promedio es mucho menor a la obtenida en Node. Este es otro claro ejemplo del manejo asincrónico de Node.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Timeout Spike Test/pendingRequestsComparison.png"></td>
		<td><img src="py/data/Python Timeout Spike Test/responseTime.png"></td>
	</tr>
	</table>
</div>

### Node: Intensive

Por último en el caso del endpoint Intensive, tuvimos un comportamiento muy similar al del endpoint Ping el resto de los parámetros arrojaron resultados bastante similares. 

<div>
	<table>
	<tr>
		<td><img src="js/data/Node Intensive Spike Test/pendingRequestsComparison.png"></td>
		<td><img src="js/data/Node Intensive Spike Test/pendingRequests.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Intensive Spike Test/responseTime.png"></td>
		<td><img src="js/data/Node Intensive Spike Test/usoDeMemoria.png"></td>
	</tr>
	<tr>
		<td><img src="js/data/Node Intensive Spike Test/usoDeProcesador.png"></td>
	</tr>
	</table>
</div>

### Python: Intensive

En este caso también tuvimos un comportamiento similar a los previamente observados. 
Al aumentar el procesamiento realizado, se observa un comportamiento similar al obtenido con Timeout.

<div>
	<table>
	<tr>
		<td><img src="py/data/Python Intensive Spike Test/pendingRequestsComparison.png"></td>
		<td><img src="py/data/Python Intensive Spike Test/responseTime.png"></td>
	</tr>
	</table>
</div>
