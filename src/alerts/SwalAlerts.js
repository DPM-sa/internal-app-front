import Swal from 'sweetalert2';

export const activar = (text) => {
    return Swal.fire({
        title: `Deseas activar este ${text}?`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Activar',
        cancelButtonText:
            'Cancelar'
    })
};

export const eliminar = (text) => {
    return Swal.fire({
        title: `Deseas eliminar este ${text}?`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Eliminar',
        cancelButtonText:
            'Cancelar'
    })
};

export const desactivar = (text) => {
    return Swal.fire({
        title: `Deseas desactivar este ${text}?`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Inactivar',
        cancelButtonText:
            'Cancelar'
    })
};
