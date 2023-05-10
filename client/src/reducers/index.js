import { combineReducers } from "redux";
import queue from "./queue";
import search from "./search";
import view from "./view";

export default combineReducers({
	queue,
	search,
	view,
});