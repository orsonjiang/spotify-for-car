import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`
})

const getProfile = () => api.get(`/profile`);

const apis = {
	getProfile,
};

export default apis;