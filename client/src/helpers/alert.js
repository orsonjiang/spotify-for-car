import store from "../store";
import { setAlert, clearAlert } from "../actions";
import { sleep } from "./utils";

export const runAlert = async (title, message, type, duration) => {
	if (!duration) duration = 4000;

	store.dispatch(setAlert(title, message, type));
	await sleep(duration)
	store.dispatch(clearAlert());
};