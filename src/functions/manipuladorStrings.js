function centralizarString(str, tamanho) {

    if (str.length === tamanho ) {
        return str; // Retorna a string original se já tiver 6 caracteres
    }

    const espacosAntes = Math.floor((tamanho - str.length) / 2);
    console.log(espacosAntes)
    const espacosDepois = (tamanho - str.length - espacosAntes);
    console.log(espacosDepois)
    const stringCentralizada = '  '.repeat(espacosAntes) + str + '  '.repeat(espacosDepois);

    return stringCentralizada;
}

module.exports = {centralizarString};