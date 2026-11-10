"use client";

import { DEFAULT_PROFILE } from "./constants";
import { useRoom } from "./RoomProvider";

// "<owner>'s Room" header with the owner's picture (old MainPage/components/Navbar.jsx).
const RoomHeader = () => {
    const { room } = useRoom();

    return (
        <div className="my-12">
            <div className="m-4 flex content-center justify-center gap-12 align-middle">
                <div className="mx-2 flex items-center gap-x-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={room.pictureUrl || DEFAULT_PROFILE} alt="" className="h-16 w-16 rounded-full" />
                    <div>
                        <span className="block text-3xl">{room.displayName || "Someone"}&apos;s Room</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomHeader;
