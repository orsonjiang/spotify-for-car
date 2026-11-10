"use client";

import { useEffect, useRef } from "react";

import { fetchQueue } from "@/lib/actions";
import { useAlert } from "../AlertProvider";
import {
    CONNECTION_ISSUE_MESSAGE,
    CONNECTION_ISSUE_TITLE,
    ERROR_VIEW,
    QUEUE_POLL_MS,
} from "../constants";
import RoomHeader from "../RoomHeader";
import { useRoom } from "../RoomProvider";
import SongCard from "../SongCard";

// /<room>: current song + upcoming queue. Outside the demo the queue is polled every 2 s while this route is
// visible: the effect is cleaned up when <Activity> hides the route after a navigation and re-runs (polling right
// away) when it is shown again.
const QueueView = () => {
    const { room, isDemo, queue, setQueue } = useRoom();
    const { showAlert } = useAlert();
    const hasPolled = useRef(false);

    useEffect(() => {
        if (isDemo) return;

        let active = true;
        let timer;

        const poll = async () => {
            try {
                const next = await fetchQueue(room.url);
                if (active && next) setQueue(next);
            } catch {
                if (active) showAlert(CONNECTION_ISSUE_TITLE, CONNECTION_ISSUE_MESSAGE, ERROR_VIEW);
            }
            // Schedule the next poll after this one settles (Server Actions run one at a time per client).
            if (active) timer = setTimeout(poll, QUEUE_POLL_MS);
        };

        // The server-rendered queue is fresh on first mount; when re-shown, refresh immediately.
        timer = setTimeout(poll, hasPolled.current ? 0 : QUEUE_POLL_MS);
        hasPolled.current = true;

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [isDemo, room.url, setQueue, showAlert]);

    let content;
    if (queue?.currentSong) {
        content = (
            <div className="m-auto max-w-lg flex-col justify-center">
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Song</div>
                    <ul>
                        <SongCard song={queue.currentSong} />
                    </ul>
                </div>
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Queue</div>
                    <ul>
                        {queue.queue.map((song, i) => (
                            <SongCard key={`queue-${song.id}-${i}`} song={song} />
                        ))}
                    </ul>
                </div>
            </div>
        );
    } else if (!queue) {
        // Queue not loaded (yet).
        content = <div></div>;
    } else {
        content = <div>No song playing.</div>;
    }

    return (
        <div>
            <RoomHeader />
            {content}
        </div>
    );
};

export default QueueView;
