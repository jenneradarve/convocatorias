const preguntas = [
"Usuario de Discord:",
"Usuario de Roblox:",
"Edad (Real):",
"¿Tienes el pase de personalización y Detective en ERLC?",
"¿Has pertenecido anteriormente a una LEA? ¿Cuál?",
"¿Qué conocimientos tienes sobre ICE, HSI o ERO?",
"¿Qué significa ICE para ti?",
"¿Cuál es la diferencia entre HSI y ERO?",
"¿Qué harías si un compañero incumple la normativa durante un operativo?",
"¿Cómo actuarías ante un ciudadano que no coopera?",
"Durante un operativo un sospechoso huye. ¿Cómo procederías?",
"Un superior te da una orden que contradice la normativa. ¿Qué harías?",
"¿Cómo resolverías un conflicto entre dos agentes?",
"¿Por qué deseas unirte a ICE?",
"¿Qué puedes aportar al departamento?",
"¿Autorizas el tratamiento de datos y declaras que toda la información es verdadera?"
];

const formularios = new Map();

module.exports = {

crear(id){

formularios.set(id,{
paso:0,
respuestas:[]
});

},

existe(id){

return formularios.has(id);

},

obtener(id){

return formularios.get(id);

},

eliminar(id){

formularios.delete(id);

},

pregunta(id){

return preguntas[formularios.get(id).paso];

},

guardar(id,respuesta){

const datos=formularios.get(id);

datos.respuestas.push(respuesta);

datos.paso++;

},

terminado(id){

return formularios.get(id).paso>=preguntas.length;

},

respuestas(id){

return formularios.get(id).respuestas;

}

};
