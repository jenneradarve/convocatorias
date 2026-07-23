const preguntas = [
{
titulo:"Usuario de Discord",
pregunta:"Usuario de Discord:",
min:1
},
{
titulo:"Usuario de Roblox",
pregunta:"Usuario de Roblox:",
min:1
},
{
titulo:"Edad (Real)",
pregunta:"Edad (Real):",
min:1
},
{
titulo:"Pases de ERLC",
pregunta:"¿Tienes el pase de personalización y Detective en ERLC?",
min:1
},
{
titulo:"Experiencia LEA",
pregunta:"¿Has pertenecido anteriormente a una agencia LEA? ¿Cuál?",
min:20
},
{
titulo:"Conocimientos ICE",
pregunta:"¿Qué conocimientos tienes sobre ICE, HSI o ERO?",
min:20
},
{
titulo:"¿Qué es ICE?",
pregunta:"¿Qué significa ICE para ti?",
min:1
},
{
titulo:"HSI vs ERO",
pregunta:"¿Cuál es la diferencia entre HSI y ERO?",
min:1
},
{
titulo:"Compañero incumple normativa",
pregunta:"¿Qué harías si un compañero incumple la normativa durante un operativo?",
min:20
},
{
titulo:"Ciudadano no coopera",
pregunta:"¿Cómo actuarías ante un ciudadano que no coopera?",
min:20
},
{
titulo:"Sospechoso huye",
pregunta:"Durante un operativo un sospechoso huye. ¿Cómo procederías?",
min:20
},
{
titulo:"Orden ilegal",
pregunta:"Un superior te da una orden que contradice la normativa. ¿Qué harías?",
min:20
},
{
titulo:"Conflicto entre agentes",
pregunta:"¿Cómo resolverías un conflicto entre dos agentes?",
min:20
},
{
titulo:"¿Por qué ICE?",
pregunta:"¿Por qué deseas unirte a ICE?",
min:20
},
{
titulo:"Aporte",
pregunta:"¿Qué puedes aportar al departamento?",
min:20
},
{
titulo:"Consentimiento",
pregunta:"¿Autorizas el tratamiento de datos y declaras que toda la información es verdadera?",
min:1
}
];

const formularios = new Map();

module.exports = {
preguntas,

crear(id){
formularios.set(id,{paso:0,respuestas:[]});
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
return preguntas[formularios.get(id).paso].pregunta;
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
},

validar(id,respuesta){
const paso=formularios.get(id).paso;
return respuesta.trim().split(/\s+/).length>=preguntas[paso].min;
}

};
