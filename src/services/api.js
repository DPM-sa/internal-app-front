import { http } from "./config";

export const getSliders = async () => {
    return await http.get('sliders');
}

export const getCumples = async () => {
    return await http.get('cumples');
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