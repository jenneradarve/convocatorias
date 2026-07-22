let convocatoriaAbierta = false;

module.exports = {

abrir() {
convocatoriaAbierta = true;
},

cerrar() {
convocatoriaAbierta = false;
},

estaAbierta() {
return convocatoriaAbierta;
}

};
