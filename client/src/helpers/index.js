import api from "../api/api";
import store from "../store";
import { setRoom, setQueue } from "../actions";

export const fetchRoomDetails = async (roomId) => {
	let details = await api.getRoom(roomId)
	store.dispatch(setRoom(details.data));
};

export const fetchQueue = async (roomId) => {
	let queue = await api.getQueue(roomId);
	store.dispatch(setQueue(queue.data));
};