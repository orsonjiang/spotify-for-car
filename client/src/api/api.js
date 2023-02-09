import axios from "axios";
import qs from "query-string";

axios.defaults.withCredentials = true;

const api = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}/api`
})

const getQueue = (id) => api.get(`/${id}/queue`);
const search = (id, text) => api.get(`/${id}/search?` + qs.stringify({
	q: text
}));
const addToQueue = (id, trackId) => api.post(`/${id}/add?` + qs.stringify({
	id: trackId
}));

const apis = {
	getQueue,
	search,
	addToQueue,
};

export default apis;