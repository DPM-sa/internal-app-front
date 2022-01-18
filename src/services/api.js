import { http } from "./config";

export const getSliders = async () => {
    return await http.get('sliders');
}

export const getCumples = async () => {
    return await http.get('cumples');
}
