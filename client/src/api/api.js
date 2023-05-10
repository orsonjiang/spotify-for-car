import axios from "axios";
import qs from "query-string";

axios.defaults.withCredentials = true;

const api = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}/api`
})

const getRoom = (id) => api.get(`/${id}/details`);
const getQueue = (id) => api.get(`/${id}/queue`);
const search = (id, text) => api.get(`/${id}/search?` + qs.stringify({
	q: text
}));
const addToQueue = (id, trackId) => api.post(`/${id}/add?` + qs.stringify({
	id: trackId
}));
const getLibrary = () => api.get(`/myLibrary`);
const getPlaylist = (id) => api.get(`/myPlaylist/${id}`);

const apis = {
	getRoom,
	getQueue,
	search,
	addToQueue,
	getLibrary,
	getPlaylist,
};

export default apis;