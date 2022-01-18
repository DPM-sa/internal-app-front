export const toStringCumplesArr = (arr) => {
    let formatted = arr.map(usuario => usuario.nombre+' '+usuario.apellido);
    return formatted;
}