import { combineReducers } from "redux";
import queue from "./queue";
import search from "./search";

export default combineReducers({
	queue,
	search
});