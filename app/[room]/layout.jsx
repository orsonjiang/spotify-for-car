import { Suspense } from "react";

import BottomNavbar from "@/components/BottomNavbar";
import { ERROR_VIEW, LOADING_VIEW } from "@/components/constants";
import LoadingView from "@/components/LoadingView";
import { RoomProvider } from "@/components/RoomProvider";
import StickyAlert from "@/components/StickyAlert";
import { getRoom, getRoomQueue, getViewer } from "@/lib/data";

// Shared by every tab of a room (/<room>, /search, /library, /library/<id>, /settings). Layouts stay mounted
// across those navigations, so the RoomProvider state (queue, demo queue, added-song highlight) persists.
//
// Cache Components: the room/viewer/queue lookups need `params`, cookies and the DB, so they run inside this
// <Suspense>. Its fallback (the old LoadingView + "Room Loading" alert) is the route's prerendered static shell.
export default function RoomLayout({ children, params }) {
    return (
        <Suspense fallback={<RoomLoading />}>
            <Room params={params}>{children}</Room>
        </Suspense>
    );
}

async function Room({ params, children }) {
    const { room: roomUrl } = await params;
    const [room, viewer, queue] = await Promise.all([
        getRoom(roomUrl),
        getViewer(roomUrl),
        getRoomQueue(roomUrl),
    ]);

    if (!room) {
        return (
            <div>
                <div className="mb-20">
                    <LoadingView />
                </div>
                <StickyAlert
                    title="Error Loading Room"
                    message="The room does not exist. Try visiting another room."
                    type={ERROR_VIEW}
                />
            </div>
        );
    }

    return (
        <RoomProvider room={room} viewer={viewer} initialQueue={queue}>
            <div>
                <div className="mb-20">{children}</div>
                <BottomNavbar />
            </div>
        </RoomProvider>
    );
}

function RoomLoading() {
    return (
        <div>
            <div className="mb-20">
                <LoadingView />
            </div>
            <StickyAlert title="Room Loading" message="Attempting to find room." type={LOADING_VIEW} />
        </div>
    );
}
