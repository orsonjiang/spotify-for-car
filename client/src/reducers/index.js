import { combineReducers } from "redux";
import alert from "./alert";
import library from "./library";
import queue from "./queue";
import room from "./room";
import search from "./search";
import user from "./user";
import view from "./view";

export default combineReducers({
	alert,
	library,
	queue,
	room,
	search,
	user,
	view,
});