import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setQueue } from "../../actions";
import api from "../../api/api";
import store from "../../store";

const RoomPage = () => {
	const { roomId } = useParams();

    useEffect(() => {
        fetchQueue();
    }, []);


    const fetchQueue = async () => {
        let queue = await api.getQueue(roomId);
        store.dispatch(setQueue(queue.data));
    }

    let queue = "";
    const queueData = useSelector((state) => state.queue);

    if (queueData) {
        queue = (
            <div>
                <h3 className="text-3xl mt-4 mb-2">Current Queue</h3>
                <ul>
                    {queueData.queue.map((track) => {
                        let cardClassName =
                            "flex bg-zinc-100 dark:bg-zinc-900 rounded-xl m-2";

                        if (track.id == store.lastAdded)
                            cardClassName += " border border-blue-600";

                        return (
                            <li key={track.id} className={cardClassName}>
                                <img
                                    className={"m-2 w-12 h-12"}
                                    src={track.album.images[0].url}
                                />
                                <div className="flex flex-col text-left mt-2">
                                    <p className="text-base font-normal">
                                        {track.name}
                                    </p>
                                    <p className="text-sm font-light">
                                        {track.album.artists[0].name}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    } else {
        queue = <h4>No song playing.</h4>;
    }

    return (
        <div className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
            <div className="m-16 text-5xl">Spotify for Car</div>
			<div>Room {roomId}</div>

            <h2 className="text-4xl mt-16 mb-2">Song View</h2>
            <button className="mb-4" onClick={fetchQueue}>
                Reload Songs
            </button>
            {queue}
        </div>
    );
};

export default RoomPage;
