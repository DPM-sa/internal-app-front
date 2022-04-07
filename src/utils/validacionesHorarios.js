import moment from "moment";

export const gethoraMomentFormat = (hora) => {
    return hora && hora.substring(0, 2) == '12' ? moment(hora + 'pm', 'HH:mma') : moment(hora + 'am', 'HH:mma')
}

export const isBetween = (horainicio, horafin, horaUser) => {
    return horaUser.isBetween(horainicio, horafin)
}

export const isBefore = (horaLimite, horaUser) => {
    return horaUser.isBefore(horaLimite)
}

export const isAfter = (horaLimite, horaUser) => {
    return horaUser.isAfter(horaLimite)
}

export const validarDisponibilidad = async (hora, arrayReservas) => {
    let ocupados = await arrayReservas.map(reserva => {
        return isBetween(gethoraMomentFormat(reserva.horainicio), gethoraMomentFormat(reserva.horafin), hora)
            ? true : false
    })
    return !ocupados.includes(true)
}


export const validarSihayReservasIntermedias = async (horainicio, horafin, arrayReservas) => {
    let ocupados = await arrayReservas.map(reserva => {
        return isBefore(gethoraMomentFormat(reserva.horainicio), gethoraMomentFormat(horainicio)) &&
            isAfter(gethoraMomentFormat(reserva.horafin), gethoraMomentFormat(horafin))
            ? true : false
    })
    return !ocupados.includes(true)
}