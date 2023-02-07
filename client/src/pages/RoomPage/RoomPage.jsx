import { useParams } from "react-router-dom";

const RoomPage = () => {
	const { roomId } = useParams();

    return (
        <div className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
            <div className="m-16 text-5xl">Spotify for Car</div>
			<div>Room {roomId}</div>
        </div>
    );
};

export default RoomPage;
