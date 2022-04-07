import { http } from "./config";

export const getSliders = async () => {
    return await http.get('sliders');
}

export const getCumples = async () => {
    return await http.get('cumples');
}


//USUARIOS
export const getAllUsers = async () => {
    return await http.get(`/allusuarios`)
}

export const getUser = async (id) => {
    return await http.get(`/usuario/${id}`)
}

export const editUser = async (data, id) => {
    return await http.put(`/usuario/${id}`, data)
}

export const newUserPOST = async (data) => {
    return await http.post(`/usuario`, data)
}

export const deleteUser = async (id) => {
    return await http.delete(`/usuario/${id}`)
}


//Comedores
export const getComedores = async () => {
    return await http.get(`/comedor`)
}

export const newComedorPOST = async (data) => {
    return await http.post(`/comedor`, data)
}

export const getComedor = async (id) => {
    return await http.get(`/comedor/${id}`)
}

export const editComedor = async (data, id) => {
    return await http.put(`/comedor/${id}`, data)
}




// Viandas
export const getViandasbyComedorId = async (id) => {
    return await http.get(`/vianda/comedor/${id}`)
}

export const getViandabyId = async (id) => {
    return await http.get(`/vianda/${id}`)
}

export const editViandabyId = async (data, id) => {
    return await http.put(`/vianda/${id}`, data)
}

export const newViandaPOST = async (data) => {
    return await http.post(`/vianda`, data)
}



// Reservas
export const getReservasDiarias = async (id) => {
    return await http.get(`/comedor/${id}/reservas`)
}

export const getInformesMensuales = async (id) => {
    return await http.get(`/comedor/informes/mensuales`)
}

export const newReservaVianda = async (data) => {
    return await http.post(`/comedor/${data.comedorId}/reservas`, data)
}

export const getReservasUsuario = async (id) => {
    return await http.get(`/comedor/reservas/usuario`)
}

export const cancelarReserva = async (id) => {
    return await http.put(`/comedor/reserva/cancelar`, { idreserva: id })
}



//Sala de reunions
export const getSalas = async () => {
    return await http.get(`/sala`)
}
export const newSalaPOST = async(data) => {
    return await http.post(`/sala`, data)
}
export const getSala = async (id) => {
    return await http.get(`/sala/${id}`)
}
export const editSala = async (data, id) => {
    return await http.put(`/sala/${id}`, data)
}

export const newReservaSala = async (data) => {
    return await http.post(`/sala/${data.salaId}/reservas`, data)
}

//Reuniones

export const getReunionesReservasUsuario = async () => {
    return await http.get(`/sala/reservas/usuario`)
}

export const getReservasbySalaId = async (id) => {
    return await http.get(`/sala/${id}/reservas`)
}

export const cancelarReservaSala = async (data) => {
    return await http.put(`/sala/reserva/cancelar`, { ...data, idreserva: data._id })
}

export const getDisponibilidadSala = async (salaId, date) => {
    return await http.get(`/sala/disponibilidad/${salaId}/${date}`)
}

export const getReunion = async (id) => {
    return await http.get(`/sala/reunion/${id}`)
}

export const editReunion = async (data, id) => {
    return await http.put(`/sala/reunion/${id}`, data)
}

export const deleteSala = async (id) => {
    return await http.delete(`/sala/${id}`)
}

export const eliminarReservaSala = async (id) => {
    return await http.delete(`/sala/reuniones/${id}`)
}