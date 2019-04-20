<style>
img{
	max-width: 100%;
	max-height:25 0px
}
.phasesScheme{
	display:inline;
  	width: 50%;
}
.test-intro{
	margin-bottom:3em;
	display:block;
}
.introduccion{
	font-size:18px;
	width:95%;
	font-family: calibri;

}
.title{
	text-align:center;
	text-decoration:underline;
	padding-top:0;
	margin-top: 0;
	text-shadow: 3px 2px #679FB8;
}
h1{
	line-height:1;
	font-size:50px;
}
.testName{
	padding-left:1.8em;
	margin-top:-0.8em;
	text-decoration:underline;
	font-size:30px
}
.testDescriptorBox{
	width:50%;
	float:left;
	vertical-align:middle;
}
.caseDescriptorBox{
	width:90%;
	text-align:center;
	display: block;
  	margin-left: auto;
	margin-right: auto;
}
p{
}
.testDescriptor{
	display:inline;
	font-size:15px;
	vertical-align:center;
}
</style>
<div>
	<div class="title">
		<h1>
			Informe de Perf Testing<br>
			Arquitectura de Software
		</h1>
	</div>
	<div style="text-align:center;">
		<p class="introduccion">
			Comenzaremos este informe detallando las bases del proyecto llevado a cabo. En este trabajo practico nos planteamos el objetivo de analizar atributos de calidad de un sistema dummy el cual tiene unos pocos endpoints. A travez de herramientas como Artillery, Graphite, Grafana, y CAdvisor generaremos y recopilaremos informacion de forma tal que podamos llevar a cabo un analisis seguido de una reflexion final de las conclusiones obtenidas. Nuestro sistema dummy tendra dos servidores, uno en Node.js y otro en Python (el cual utilizara Flask y Gunicorn para funcionar como servidor).
		</p>
	</div>
	<div class="test-intro"  style="display:block">
		<div class="testDescriptorBox">
		<h2 class="testName">Load test</h2>
			<p class="testDescriptor">
				Para el caso del load test primero seguimos un esquema muy simple de "Phases".  Primero habria una rampa de requests subiendo de 5 a 30 en 60 segundos para simular un comienzo estable y luevo mantuvimos la cantidad de requests por segundo en 30 los siguientes dos minutos. Este esquema se repitio en todos los otros casos de load test
			</p>
		</div>
		<div class="schemeImg">
		<img class="phasesScheme" src="js/data/Node Load Test/requestsPorSegundo.png">
		</div>
	</div>
	<div>
	<h2>Caso Load Test Ping</h2>
		<div class="caseDescriptorBox">
		<p>
			En el caso del Ping hay dos particularidades importantes a notar, la cantidad de requests pendientes es bastante estable a travez de los periodos de 10 segundos. El otro hecho a notar muy importante es que el tiempo de respuesta tiene una varianza muy alta con respecto a los otros dos endpoints. En cuanto al uso de la memoria y el procesador no se ve algo muy extraño, el uso de los procesadores se mantiene bastante constante a travez de toda la experiencia y la memoria tambien
		</p>
		</div>
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
	<br>
	<br>
	<div>
		<h2>Caso Load Test Node Timeout</h2>
		<div class="caseDescriptorBox">
			<p>
				En el load test de Node timeout esta la particularidad muy importante a notar, esta es que el response time tiene una varianza muy pequeña, casi no hay diferencia entre los tiempos medios y los mas altos. La cantidad pending requests es constante, siempre se mantiene en 300 en la fase constante. En cuanto al uso de memoria se puede ver tambien como es mas gradual en este caso. Lo mas curioso de este endpoint es como el timeout parece ordenar las ejecuciones del servidor manteniendo un servidor con poca variablidad. Aunque en el caso del ping la variablidad no era extremadamente alta, quizas para un servicio que necesite respuestas en tiempo constante esta informacion es muy util
			</p>
		</div>
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
	<br>
	<br>
	<div>
		<h2>Caso Load Test Node Intensive</h2>
		<div class="caseDescriptorBox">
			<p>
				En el load test de Node intensive podemos ver que al igual que en el caso del Ping la cantidad de requests que estan pendientes siempre se mantiene bastante bajo, y en cuanto al response time podemos ver tambien una varianza mucho menor, aunque haya ocacionalmente algunos disparos hacia arriba por lo general se mantienen bastante juntas las dos curvas.
			</p>
		</div>
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
	<br><br><br>
	<div class="test-intro"  style="display:block">
		<div class="testDescriptorBox">
		<h2 class="testName">Stress Test</h2>
			<p class="testDescriptor">
				En estas pruebas simulamos un uso mas intensivo de lo comun para el servidor, para esto simulamos 80 usuarios activos por segundo, un total de 4800 requests por minuto. Mantuvimos masomenos las mismas "Phases" que en la prueba anterior, con la diferencia de que esta vez subimos hasta 80. Este esquema se repitio en todos los casos menos en el ultimo, donde probamos un escenario donde quizimos poner al limite al servidor que mas capacidad deberia soportar (Ping) a ver cual era el resultado.
			</p>
		</div>
		<div>
		<br><br>
		<img class="phasesScheme" src="js/data/Node Stress Test/requestsPorSegundo.png">
		</div>
	</div>
	<br>
	<div>
	<h2>Caso Stress Test Ping</h2>
		<div class="caseDescriptorBox">
		<p>
			En este endpoint pudimos ver un comporamiento similar al del escenario anterior, aunque los tiempos fueron por lo general mas altos lo cual era de esperarse la curvas tuvieron un comportamiento similar, mientras que el tiemp medio se mantenia dentro de los parametros bajo los tiempos mas altos eran mas erraticos. En cuanto al estado de los requests a medida que pasaba el tiempo tambien podemos ver un comporamiento similar. En resumidas palabras sucedio lo que se esperaba, mismo patron de comportamiento pero con numeros mas altos
		</p>
		</div>
		<table>
		<tr>
			<td><img src="js/data/Node Stress Test/responseTimeComparison.png"></td>
			<td><img src="js/data/Node Stress Test/responseTime.png"></td>
		</tr>
		<tr>
			<td><img src="js/data/Node Stress Test/pendingRequests.png"></td>
			<td><img src="js/data/Node Stress Test/pendingRequestsCOmparison.png"></td>
		</tr>
		<tr>
			<td><img src="js/data/Node Stress Test/usoDeProcesador.png"></td>
			<td><img src="js/data/Node Stress Test/usoDeMemoria.png"></td>
		</tr>
		</table>
	</div>
	<br>
	<br>
	<div>
	<h2>Caso Stress Test Timeout</h2>
		<div class="caseDescriptorBox">
		<p>
			Con el endpoint de timeout podemos ver tambien un comporamiento similar en cuanto a los tiempos de respuesta los cuales se mantuvideron todos bastante parecidos, lo cual fortaleceria nuestra teoria de que el timeout funciona como un ordenador de los requests y hace que tengan un tiempo de respuesta constante. Por otro lado hubo varios requests que presentaron errores ECONNRESET, que indica que la conexion se cerro abruptamente, esto lo podriamos llegar a adjudicar al overhead del timeout, pero luego de buscar en internet parece ser que la implementacion del setTimeout de Node es bastante eficiente y no deberia haber problema con el timeout.
		</p>
		</div>
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
	<br>
	<br>
	<div>
	<h2>Caso Stress Test Intensive</h2>
		<div class="caseDescriptorBox">
		<p>
			Para este endpoint podemos ver que el patron de comportamiento cambio bastante, no mantuvo una varianza baja, como en el caso del Load Test. Podemos ver igualmente que los valores no crecieron mucho, sino que crecieron como mucho un 50%, en cuanto al resto de las mediciones no hay nada muy importante a notar.
		</p>
		</div>
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
	<br>
	<br>
	<div>
	<h2>Caso Heavy Stress Test Ping</h2>
		<div class="caseDescriptorBox">
		<p>
			Para este ultimo caso probamos el endpoint Ping con 400 requests por segundo. Lamentablemente artillery no puedo generar tantas como quisimos, y esto lo podemos ver primero por la irregularidad de lo que deberia ser la meseta de request en la imagen de "Scenarios Launched", en su punto mas alto variaba desde 1200 requests cada 10 segundos y 1800. El escenario termino durando 8 minutos (5 mas de lo esperado). En cuanto al tiempo de respuesta podemos ver un comportamiento similar a todos los que probamos el endpoint Ping, hay una varianza muy alta en los tiempos de respuesta.
		</p>
		</div>
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
	<br><br><br>
	<div class="test-intro" style="display:block">
		<div class="testDescriptorBox">
		<h2 class="testName">Spike test</h2>
			<p class="testDescriptor">
				En este ultimo escenario decidimos probar el comportamiento del servidor cuando la cantidad de requests por segundo aumenta una forma no esperada, casi exponencial. Para esto creamos una rampa de 5 requests a 400 requests en 20 segundos, a ver cual era el comportamiento que habria en cada uno de los endpoints del servidor de Node.
			</p>
		</div>
		<img class="phasesScheme" src="js/data/Node Spike Test/requestsPorSegundo.png">
	</div>
	<div>
	<h2>Caso Spike Test Ping</h2>
		<div class="caseDescriptorBox">
		<p>
			Este fue el escenario mas extraño de todos los que probamos. podemos ver que aunque los tiempos de respuesta tuvieron una gran separacion entre los tiempos medios y los tiempos maximos, la diferencia se mantuvo constante. Puede ser que esto se deba a la duracion del escenario ya que duro solo 20 segundos, pero no tenia sentido subir la cantidad de requests el limite para estos lo encontramos en el escenario pasado y pudimos ver que estaba cerca de 1500 cada 10 segundos.
		</p>
		</div>
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
	<br>
	<br>
	<div>
	<h2>Caso Spike Test Timeout</h2>
		<div class="caseDescriptorBox">
		<p>
			Como era de esperarse al igual que en el caso del Stress Test un determinado numero de requests fallaron en el caso del timeout, pero el patron de comportamiento fue similar
		</p>
		</div>
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
	<br>
	<br>
	<div>
	<h2>Caso Spike Test Intensive</h2>
		<div class="caseDescriptorBox">
		<p>
			Por ultimos en el caso del endpoint Intensive, tuvimos un comportamiento muy similar al del enpoint Ping el resto de los parametros arrojaron resultados bastante similares.
		</p>
		</div>
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
	<br>
	<br>
</div>