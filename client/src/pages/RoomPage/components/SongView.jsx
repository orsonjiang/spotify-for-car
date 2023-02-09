import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setQueue } from "../../../actions/index";
import store from "../../../store";
import api from "../../../api/api";
import SongCard from "./SongCard";

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

    let CurrentView = "";
    if (queueData.currentSong) {
        CurrentView = (
            <div>
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Song</div>
                    {<SongCard song={queueData.currentSong} />}
                </div>
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Queue</div>
                    <ul>
                        {queueData.queue.map((song) => {
                            return (<SongCard key={"queue-" + song.id} song={song} />);
                        })}
                    </ul>
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
