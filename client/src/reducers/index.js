import { combineReducers } from "redux";
import library from "./library";
import queue from "./queue";
import room from "./room";
import search from "./search";
import user from "./user";
import view from "./view";

export default combineReducers({
	library,
	queue,
	room,
	search,
	user,
	view,
});