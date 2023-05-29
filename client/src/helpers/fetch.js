import api from "../api/api";
import auth from "../api/authApi";
import store from "../store";
import { setRoom, setQueue, setUser, setLibrary } from "../actions";

export const fetchRoomDetails = async (roomId) => {
	let details = await api.getRoom(roomId)
	store.dispatch(setRoom(details.data));
};

export const fetchQueue = async (roomId) => {
	let queue = await api.getQueue(roomId);
	store.dispatch(setQueue(queue.data));
};

export const fetchUser = async () => {
	const response = await auth.getProfile();
	store.dispatch(setUser(response.data.user));
};

export const fetchLibrary = async () => {
	const res = await api.getLibrary();
	store.dispatch(setLibrary(res.data.items));
}