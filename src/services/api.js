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

export const newViandaPOST = async (data) => {
    return await http.post(`/vianda`, data)
}

export const getViandasbyComedorId = async (id) => {
    return await http.get(`/vianda/comedor/${id}`)
}

export const getReservasDiarias = async (id) => {
    return await http.get(`/comedor/${id}/reservas`)
}

export const getInformesMensuales = async (id) => {
    return await http.get(`/`) //TODO: falta crear el endpoint en backend
}

