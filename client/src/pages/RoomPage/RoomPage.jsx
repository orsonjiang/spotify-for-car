import { useParams } from "react-router-dom";
import SongView from "./components/SongView";
import SongSearch from "./components/SongSearch";

const RoomPage = () => {
    const { roomId } = useParams();

    return (
        <div>
            <div className="m-16 text-5xl">Spotify for Car</div>
            <div>Room {roomId}</div>
            <SongSearch />
            <SongView />
        </div>
    );
};

export default RoomPage;
