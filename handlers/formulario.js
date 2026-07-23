const preguntas = [
{
pregunta:"Usuario de Discord:",
min:1
},
{
pregunta:"Usuario de Roblox:",
min:1
},
{
pregunta:"Edad (Real):",
min:1
},
{
pregunta:"¿Tienes el pase de personalización y Detective en ERLC?",
min:1
},
{
pregunta:"¿Has pertenecido anteriormente a una LEA? ¿Cuál?",
min:20
},
{
pregunta:"¿Qué conocimientos tienes sobre ICE, HSI o ERO?",
min:20
},
{
pregunta:"¿Qué significa ICE para ti?",
min:1
},
{
pregunta:"¿Cuál es la diferencia entre HSI y ERO?",
min:1
},
{
pregunta:"¿Qué harías si un compañero incumple la normativa durante un operativo?",
min:20
},
{
pregunta:"¿Cómo actuarías ante un ciudadano que no coopera?",
min:20
},
{
pregunta:"Durante un operativo un sospechoso huye. ¿Cómo procederías?",
min:20
},
{
pregunta:"Un superior te da una orden que contradice la normativa. ¿Qué harías?",
min:20
},
{
pregunta:"¿Cómo resolverías un conflicto entre dos agentes?",
min:20
},
{
pregunta:"¿Por qué deseas unirte a ICE?",
min:20
},
{
pregunta:"¿Qué puedes aportar al departamento?",
min:20
},
{
pregunta:"¿Autorizas el tratamiento de datos y declaras que toda la información es verdadera?",
min:1
}
];

const formularios=new Map();

module.exports={

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

const minimo=preguntas[paso].min;

return respuesta.trim().split(/\s+/).length>=minimo;

}

};
