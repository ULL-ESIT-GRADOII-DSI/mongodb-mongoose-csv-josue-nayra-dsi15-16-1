"use strict";

var express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

//Conexión con MongoDB
const util = require('util');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Practica9');
const TablaSchema = mongoose.Schema({
    "entrada_actual": String,
    "nombre": String,
    "descripcion": String
});
const Tabla = mongoose.model("Tabla",TablaSchema);
//Ejemplos por defecto
let ejemplo1 = new Tabla(
{
    entrada_actual: '"producto", "precio"\n "cam", "4,3" \n"libro de O\'Reilly", "7,2"',
    nombre: "Ejemplo1",
    descripcion: "Primer ejemplo para que el usuario cargue en la app"
});
let p1 = ejemplo1.save(function(err)
{
    if(err)
    {
        console.log(`Hubieron errores:\n${err}`); return err; 
    }
    else
    {
        console.log(`Saved: ${ejemplo1}`);
    }
});
let ejemplo2 = new Tabla(
{
    entrada_actual: '"producto","precio","fecha"\n "camisa","4,3","14/01"\n "libro de O\'Reilly", "7,2","13/02"',
    nombre: "Ejemplo2",
    descripcion: "Segundo ejemplo para que el usuario cargue en la app"
});
let p2 = ejemplo2.save(function(err)
{
    if(err)
    {
        console.log(`Hubieron errores:\n${err}`); return err; 
    }
    else
    {
        console.log(`Saved: ${ejemplo2}`);
    }
});
let ejemplo3 = new Tabla(
{
    entrada_actual: '"edad",  "sueldo",  "peso"\n  ,"6000€","90Kg"\n47,       "3000€",  "100Kg"',
    nombre: "Ejemplo3",
    descripcion: "Tercer ejemplo para que el usuario cargue en la app"
});
let p3 = ejemplo3.save(function(err)
{
    if(err)
    {
        console.log(`Hubieron errores:\n${err}`); return err; 
    }
    else
    {
        console.log(`Saved: ${ejemplo3}`);
    }
});


app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate.js');

app.get('/', (request, response) => {     
  //console.log("Accediendo a index");
    response.render('index', {title: "Comma Separated Values (CSV) Analyzer with Ajax" , autor1: "Maria Nayra Rodriguez Perez", autor2: "Josue Toledo Castro"});
});

app.get('/csv', (request, response) => {
    response.send({ "rows": calculate(request.query.input) });
});

app.get('/guardar_tabla',(request, response) => { 
    console.log("Guardar tabla..."); 
    console.log("Datos: nombre_tabla->"+request.query.nombre);
    let t1 = new Tabla({entrada_actual: request.query.input, nombre: request.query.nombre});
    let p1 = t1.save(function(err)
    {
        if(err)
        {
            console.log(`Hubieron errores:\n${err}`); return err; 
        }
        else
        {
            console.log(`Saved: ${t4}`);
        }
    });

    //Nos aseguramos de que todos los registros se han salvado

    Promise.all([p1]).then( (value) => {
        console.log(util.inspect(value, {depth: null}));
    });
});

app.get('/cargar_datos',(request,response) => {
    console.log("Cargar_datos => data: "+request.query.boton_name);
    Tabla.find({nombre: request.query.boton_name},function(err,data){
        response.send(data); //Servidor envia datos a csv.js
    });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
