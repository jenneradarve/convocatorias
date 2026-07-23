function detectarIA(texto) {

    const patrones = [
        "como inteligencia artificial",
        "en conclusión",
        "en resumen",
        "es importante destacar",
        "es importante señalar",
        "además",
        "por otro lado",
        "finalmente",
        "por lo tanto",
        "en definitiva"
    ];

    let puntuacion = 0;

    const contenido = texto.toLowerCase();

    for (const patron of patrones) {

        if (contenido.includes(patron)) {
            puntuacion++;
        }

    }

    if (texto.split(/\s+/).length > 180) puntuacion++;

    if ((texto.match(/,/g) || []).length > 8) puntuacion++;

    return puntuacion >= 2;

}

module.exports = detectarIA;
