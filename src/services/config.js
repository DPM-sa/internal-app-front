import axios from 'axios';
import { getToken } from "../utils/auth-helper.js";


// const API_URL = process.env.REACT_APP_API_URL
const API_URL = 'https://internal-app-dpm.herokuapp.com/'

const getInstance = () => {
	const token = getToken();

	let params = {
		baseURL: API_URL,
		headers: {
			'Content-Type': 'application/json',
			"token": `${token}`
		}
	};

	const _httpInstancia = axios.create(params);

	_httpInstancia.interceptors.response.use(
		response => response,
		error => {
			if (error.response.status === 401) {
				window.location = "/";
			} else {
				return Promise.reject(error);
			}
		}
	);

	return _httpInstancia;
}

const http = getInstance();

export {
	http
};