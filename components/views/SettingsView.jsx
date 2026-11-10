"use client";

import { usePathname } from "next/navigation";

import { useAlert } from "../AlertProvider";
import { DEFAULT_PROFILE, SUCCESS_VIEW } from "../constants";
import LoginButton from "../LoginButton";
import RoomHeader from "../RoomHeader";
import { useRoom } from "../RoomProvider";

// /<room>/settings: login prompt, the owner's Share Room view, or a "not the owner" notice.
const SettingsView = () => {
    const { room, viewer, isDemo } = useRoom();
    const { showAlert } = useAlert();
    const pathname = usePathname() || "/";

    const handleShare = async () => {
        const url = `${window.location.origin}/${encodeURIComponent(viewer.url)}`;
        if (navigator.share) {
            try {
                await navigator.share({ url });
            } catch {
                // Share sheet dismissed.
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            showAlert("Share Success", "The URL to this room has been copied to your clipboard!", SUCCESS_VIEW);
        } catch {
            // Clipboard unavailable (e.g. insecure context).
        }
    };

    let content;
    if (!viewer) {
        content = (
            <div>
                <RoomHeader />
                <div className="text-lg">Login to manage this room.</div>
                <div className="my-8">
                    <LoginButton />
                </div>
            </div>
        );
    } else if (room.ownerId === viewer.id) {
        content = (
            <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={viewer.pictureUrl || DEFAULT_PROFILE}
                    alt="Profile Picture"
                    className="m-8 mx-auto h-48 w-48 rounded-full object-scale-down"
                />
                <div className="m-8 text-3xl">{viewer.displayName}</div>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 duration-150 hover:bg-green-500 active:bg-green-700"
                        onClick={handleShare}
                    >
                        Share Room
                    </button>
                </div>
            </div>
        );
    } else {
        content = (
            <div>
                <RoomHeader />
                <div className="text-lg">You, {viewer.displayName}, are not the owner of this room.</div>
            </div>
        );
    }

    return (
        <div>
            {content}
            {viewer && !isDemo ? (
                <div className="my-8">
                    <a
                        href={`/api/auth/logout?${new URLSearchParams({ location: pathname })}`}
                        className="text-sm text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Log out
                    </a>
                </div>
            ) : null}
        </div>
    );
};

export default SettingsView;
