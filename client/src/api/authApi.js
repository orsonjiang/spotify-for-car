import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`
})

const getProfile = () => api.get(`/profile`);
const getLibrary = () => api.get(`/myLibrary`);
const getPlaylist = (id) => api.get(`/myPlaylist/${id}`);

const apis = {
	getProfile,
	getLibrary,
	getPlaylist,
};

export default apis;