"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { roomPath } from "./constants";
import { useRoom } from "./RoomProvider";

const LINK_CLASS =
    "group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-zinc-800";
const ACTIVE_CLASS = " text-green-600 dark:text-green-500";
const INACTIVE_CLASS = " text-gray-500 dark:text-gray-400";

const QueueIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const LibraryIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"></path>
    </svg>
);

const SettingsIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
    </svg>
);

const BackIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const TABS = [
    { segment: "", label: "Queue", Icon: QueueIcon, labelClass: "text-sm" },
    { segment: "search", label: "Search", Icon: SearchIcon, labelClass: "text-sm" },
    { segment: "library", label: "My Library", Icon: LibraryIcon, labelClass: "whitespace-nowrap text-sm" },
    { segment: "settings", label: "Settings", Icon: SettingsIcon, labelClass: "whitespace-nowrap text-sm" },
];

// Fixed bottom tab bar for a room (old MainPage/components/BottomNavbar.jsx). The active tab comes from the URL:
// /<room>, /<room>/search, /<room>/library, /<room>/settings. On /<room>/library/<playlistId> it shows a single
// "My Library" back link instead.
const BottomNavbar = () => {
    const { room } = useRoom();
    const pathname = usePathname() ?? "";
    // ["<room>", "<tab>"?, "<playlistId>"?]
    const [, tab = "", playlistId] = pathname.split("/").filter(Boolean);

    let content;
    if (tab === "library" && playlistId) {
        content = (
            <div className="mx-auto grid h-full max-w-lg grid-cols-1 font-medium">
                <Link href={roomPath(room.url, "library")} className={LINK_CLASS}>
                    <BackIcon className={"mb-1 h-6 w-6" + INACTIVE_CLASS} />
                    <span className={"whitespace-nowrap text-sm" + INACTIVE_CLASS}>My Library</span>
                </Link>
            </div>
        );
    } else {
        content = (
            <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
                {TABS.map(({ segment, label, Icon, labelClass }) => {
                    const isActive = tab === segment;
                    const colorClass = isActive ? ACTIVE_CLASS : INACTIVE_CLASS;
                    const href = segment ? roomPath(room.url, segment) : roomPath(room.url);
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={LINK_CLASS}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Icon className={"mb-1 h-6 w-6" + colorClass} />
                            <span className={labelClass + colorClass}>{label}</span>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <nav className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            {content}
        </nav>
    );
};

export default BottomNavbar;
