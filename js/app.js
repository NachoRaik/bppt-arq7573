const express = require('express')
const app = express()
const port = 3000

const serverNumber = Math.floor(Math.random()*100)
var nRequests = 0

app.get('/', (req, res) => {
	nRequests++
	res.status(200)
	res.send('Ok node '+ serverNumber)
});

app.get('/timeout', (req, res) => {
  setTimeout(() => {
	nRequests++
  	res.status(200)
    res.send('Ok node timeout '+ serverNumber);
  }, 10000)
});

app.get('/intensive', (req, res) => {
	nRequests++
	for (var i = 0; i <= 10000; i++) {
		100*100
		for (var j = 0; j <= 10000; j++) {
     			100*100
   		}
	}
	res.status(200)
	res.send('Ok node intensive '+ serverNumber)
});

app.get('/count', (req, res) => {
	res.status(200)
	res.send('Count = '+ nRequests)
});

app.listen(port, () => console.log(`Escuchando en puerto ${port}!`))
