import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setQueue } from "../../../actions/index";
import store from "../../../store";
import api from "../../../api/api";

const SongView = () => {
    const { roomId } = useParams();
    const queueData = useSelector((state) => state.queue);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        let queue = await api.getQueue(roomId);
        store.dispatch(setQueue(queue.data));
    };

    const getSongCard = (song) => {
        let className = "flex bg-zinc-100 dark:bg-zinc-900 rounded-xl m-2";
        if (song.id == store.lastAdded) {
            className += " border border-blue-600";
        }

        return (
            <li key={song.id} className={className}>
                <img
                    className={"m-2 h-12 w-12"}
                    src={song.album.images[0].url}
                />
                <div className="mt-2 flex flex-col text-left">
                    <p className="text-base font-normal">{song.name}</p>
                    <p className="text-sm font-light">
                        {song.album.artists[0].name}
                    </p>
                </div>
            </li>
        );
    };

    let CurrentView = "";
    if (queueData && queueData.currently_playing) {
        CurrentView = (
            <div>
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Song</div>
                    {getSongCard(queueData.currently_playing)}
                </div>
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Queue</div>
                    <ul>{queueData.queue.map(getSongCard)}</ul>
                </div>
            </div>
        );
    } else {
        CurrentView = <div>No song playing.</div>;
    }

    return (
        <div>
            <div className="mt-16 mb-2 text-4xl">Song View</div>
            <button className="mb-4" onClick={fetchQueue}>
                Reload Songs
            </button>
            {CurrentView}
        </div>
    );
};

export default SongView;
