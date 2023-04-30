import { useParams } from "react-router-dom";
import Header from "../components/Header";
import SongView from "./components/SongView";
import SongSearch from "./components/SongSearch";

const RoomPage = () => {
    const { roomId } = useParams();

    return (
        <div>
            <Header />
            <div>Room {roomId}</div>
            <SongSearch />
            <SongView />
        </div>
    );
};

export default RoomPage;
