import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
	baseURL: "http://localhost:4000/auth"
})

const getProfile = () => api.get(`/profile`);

const apis = {
	getProfile,
};

export default apis;