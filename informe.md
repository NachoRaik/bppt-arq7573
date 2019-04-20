<body>
	<h1>
		Informe de Perf Testing<br>
		Arquitectura de Software
	</h1>
	<div class="introduccion">
		<p>
			Comenzamos este informe detallando un poco la informacion inicial
		</p>
	</div>
	<div>
		<h3>Caso Load Test Basico</h3>
		<p>
			En una primera instancia decidimos hacer correr...
		</p>
		<img src="js/data/Node Load Test/requestsPorSegundo.png">
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
		<h3>Caso Load Test Node Timeout</h3>
		<p>
			En el load test de Node timeout
		</p>
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
		<h3>Caso Load Test Node Intensive</h3>
		<p>
			En el load test de Node intensive
		</p>
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
		<img src="js/data/Node Intensive Load Test/medianResponseTime.png">
	</div>
</body>