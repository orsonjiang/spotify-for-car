import { combineReducers } from "redux";
import queue from "./queue";
import room from "./room";
import search from "./search";
import view from "./view";

export default combineReducers({
	queue,
	room,
	search,
	view,
});