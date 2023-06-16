import store from "../store";
import { setAlert, clearAlert } from "../actions";
import { sleep } from "./utils";

export const runAlert = async (title, message, type, duration) => {
	store.dispatch(setAlert(title, message, type));
	sleep(duration)
	store.dispatch(clearAlert());
};