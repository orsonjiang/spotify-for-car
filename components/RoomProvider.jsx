"use client";

import { createContext, use, useCallback, useMemo, useReducer, useState } from "react";

import { addTrackToQueue } from "@/lib/actions";
import { useAlert } from "./AlertProvider";
import {
    CONNECTION_ISSUE_MESSAGE,
    CONNECTION_ISSUE_TITLE,
    DEMO_ROOM_URL,
    ERROR_VIEW,
    SUCCESS_VIEW,
} from "./constants";

const RoomContext = createContext(null);

// `demoIndex` mirrors the old reducers/demo.js: each demo add is inserted at an index that starts at 0 and
// increments per add, so added songs play "next" in the order they were added.
function queueReducer(state, action) {
    switch (action.type) {
        case "set":
            return { ...state, queue: action.queue };
        case "demoAdd": {
            const current = state.queue ?? { currentSong: null, queue: [] };
            return {
                demoIndex: state.demoIndex + 1,
                queue: {
                    ...current,
                    queue: [
                        ...current.queue.slice(0, state.demoIndex),
                        action.track,
                        ...current.queue.slice(state.demoIndex),
                    ],
                },
            };
        }
        default:
            return state;
    }
}

const ADD_ERROR_MESSAGES = {
    add_failed: "Make sure Spotify is playing on the room owner's device.",
    room_not_found: "The room does not exist. Try visiting another room.",
};

// Room-level client state that must survive navigation between the room's tabs (it is mounted by
// app/[room]/layout.jsx): the room, the viewer, the queue (including the client-only demo queue) and the
// most recently added song (highlighted with a blue border).
export function RoomProvider({ room, viewer, initialQueue, children }) {
    const { showAlert } = useAlert();
    const isDemo = room.url === DEMO_ROOM_URL;
    const [{ queue }, dispatch] = useReducer(queueReducer, { demoIndex: 0, queue: initialQueue ?? null });
    const [addedSong, setAddedSong] = useState("");

    const setQueue = useCallback((next) => dispatch({ type: "set", queue: next }), []);

    // Adds a track to the room's queue. Resolves to true on success.
    const addSong = useCallback(
        async (track) => {
            const added = () => {
                showAlert("Song Added", `${track.name} has been added to the queue!`, SUCCESS_VIEW);
                setAddedSong(track.id);
            };

            if (isDemo) {
                added();
                dispatch({ type: "demoAdd", track });
                return true;
            }

            let result;
            try {
                result = await addTrackToQueue(room.url, track.id);
            } catch {
                showAlert(CONNECTION_ISSUE_TITLE, CONNECTION_ISSUE_MESSAGE, ERROR_VIEW);
                return false;
            }

            if (!result?.ok) {
                const reason = ADD_ERROR_MESSAGES[result?.error] ?? "Please try again.";
                showAlert("Song Not Added", `${track.name} could not be added to the queue. ${reason}`, ERROR_VIEW);
                return false;
            }

            added();
            if (result.queue) setQueue(result.queue);
            return true;
        },
        [isDemo, room.url, setQueue, showAlert]
    );

    const value = useMemo(
        () => ({ room, viewer, isDemo, queue, setQueue, addedSong, addSong }),
        [room, viewer, isDemo, queue, setQueue, addedSong, addSong]
    );

    return <RoomContext value={value}>{children}</RoomContext>;
}

export function useRoom() {
    const value = use(RoomContext);
    if (!value) throw new Error("useRoom must be used inside <RoomProvider>");
    return value;
}
