import moment from "moment";

export const sortGreatest = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            if (arr[i].nombre.toLowerCase() > arr[j].nombre.toLowerCase()) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            };
        };
    };
    return arr;
};

export const reverseUsers = (arr) => {
    return arr.sort((a, b) => {
        return new Date(b.date).getTime()
            - new Date(a.date).getTime()
    })
}

export const orderUsers = (arr) => {
    return arr.sort((a, b) => {
        return new Date(a.date).getTime()
            - new Date(b.date).getTime()
    })
}

export const formatImportes = (importe) => {
    try {
        var _importe = importe.toFixed(2);
        return _importe;
    } catch {
        return importe;
    }
};

export const formatFecha = (fecha) => {
    try {
        var _fecha = fecha.substring(0, 10);
        var arr = _fecha.split("-");
        return arr[2] + "/" + arr[1] + "/" + arr[0];
    } catch {
        return fecha;
    }
}


export const validarFechaLimite = (fecha) => {
    let current_date = moment();
    let limitDate = moment(fecha);
    return limitDate.isAfter(current_date)
}


export const validarHoraLimite = (horaLimite, fecha) => {
    let current_time = moment().format('HH:mma')
    current_time = moment(current_time, 'HH:mma')
    let limitTime = moment(horaLimite, 'HH:mma')

    if (validarFechaLimite(fecha)) {
        return true
    } else {
        return limitTime.isAfter(current_time)
    }
}