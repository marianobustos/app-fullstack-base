//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var utils = require('./mysql-connector');

// to parse application/json
app.use(express.json());

app.use(express.urlencoded({extended:true}));

// to serve static files
app.use(express.static('/home/node/app/static/'));

//Ejercicio 3
var datos = require('./datos.json');
const { json } = require('express');


//Ejercicio 4
app.get('/devices/', function(req, res) {
    //res.send(datos);
    //console.log(datos);
    //console.log("GET");
    res.json(datos);
});

//Ejercicio 5
//Espera una consulta al endpoint EJ /devices/1
//Parámetro id = el id del dispositivo a buscar
// devuelve el dispositivo con el id que viene del parametro
app.get('/devices/:id', function(req, res) {
    let datosFiltrados = datos.filter(item => item.id == req.params.id);

    res.json(datosFiltrados[0]);
});

//Ejercicio 6
//Espera recibir {id:1,state:1/0} , impacta el cambio y lo devuelve
/* app.post('/devices/', function(req, res) {
    let datosFiltrados = datos.filter(item => item.id == req.body.id);
    if (datosFiltrados.length > 0) {
        datosFiltrados[0].state = req.body.state;
    }
    //res.json(datosFiltrados);
    res.send("Todo ok");
}); */

/* Metodo post para visualizar los dispositivos registrados */
app.post('/devices/:id', function(req, res) {
    //console.log(datos);
    let datosActualizados = datos;
    const index = datosActualizados.findIndex(item=> parseInt(item.id) == parseInt(req.params.id));
    console.log(index);
    if(index > -1){
        datosActualizados[index] = {...req.body};
        console.log("Datos Actualizados en backend");
        console.log(req.body);
        datos=datosActualizados;
    }
    res.json(datos);
});

app.delete('/devices/:id', function(req, res) {
    //console.log("id recibido: " + req.params.id);
    let datosFiltrados = datos.filter(item => item.id != req.params.id);
    datos = datosFiltrados;
    //console.log(datos);
    res.status(200).json(datosFiltrados);
});

app.put('/devices/', function(req, res) {
    const newid = datos[datos.length-1].id+1;
    const {id,...allbody}=req.body;
    const newData = {...allbody,id:newid}
    datos.push({...newData});
    //console.log(datos);
    res.status(200).json(datos);
});

//=======[ Main module code ]==================================================
app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================