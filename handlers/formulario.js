const preguntas = [

"## Sección Información\n\n**1. Usuario de Discord:**",

"**2. Usuario de Roblox:**",

"**3. Edad (Real):**",

"**4. ¿Tienes el pase de personalización y Detective en ERLC?**",

"## Experiencia\n\n**5. ¿Has pertenecido anteriormente a una agencia LEA? ¿Cuál?**",

"**6. ¿Qué conocimientos tienes sobre ICE, HSI o ERO?**",

"## Conocimientos\n\n**7. ¿Qué significa ICE para ti?**",

"**8. ¿Cuál es la diferencia entre HSI y ERO?**",

"**9. ¿Qué harías si un compañero incumple la normativa durante un operativo?**",

"**10. ¿Cómo actuarías ante un ciudadano que no coopera?**",

"## Situaciones Hipotéticas\n\n**11. Durante un operativo un sospechoso huye. ¿Cómo procederías?**",

"**12. Un superior te da una orden que contradice la normativa. ¿Qué harías?**",

"**13. ¿Cómo resolverías un conflicto entre dos agentes?**",

"## Compromiso\n\n**14. ¿Por qué deseas unirte a ICE?**",

"**15. ¿Qué puedes aportar al departamento?**",

"**16. ¿Autorizas el tratamiento de datos y declaras que toda la información es verdadera?**"

];

const formularios = new Map();

module.exports = {

crear(usuario){

formularios.set(usuario,{
paso:0,
respuestas:[]
});

},

existe(usuario){

return formularios.has(usuario);

},

obtener(usuario){

return formularios.get(usuario);

},

eliminar(usuario){

formularios.delete(usuario);

},

pregunta(numero){

return preguntas[numero];

},

total(){

return preguntas.length;

}

};
