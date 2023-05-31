import { useSelector } from 'react-redux';

import store from '../../../store';
import { setView, setPlaylist } from '../../../actions';
import {
    VIEW_QUEUE,
    VIEW_SEARCH,
    VIEW_LIBRARY,
    VIEW_SETTINGS,
} from '../../../constants/viewTypes';

const BottomNavbar = () => {
    const { playlist } = useSelector((state) => state.library);
    const { globalView } = useSelector((state) => state.view);

    const handleClearPlaylist = () => {
        store.dispatch(setPlaylist([]));
    };

    const generateButtonClass = (view) => (globalView === view ? " text-green-600 dark:text-green-500" : " text-gray-500 dark:text-gray-400");

    const queueButtonClass = generateButtonClass(VIEW_QUEUE);
    const searchButtonClass = generateButtonClass(VIEW_SEARCH)
    const libraryButtonClass = generateButtonClass(VIEW_LIBRARY);
    const settingButtonClass = generateButtonClass(VIEW_SETTINGS);

    let content = (
        <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
            <button
                type="button"
                className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => store.dispatch(setView(VIEW_QUEUE))}
            >
                <svg
                    className={"mb-1 h-6 w-6" + queueButtonClass}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                    />
                </svg>
                <span className={"text-sm" + queueButtonClass}>
                    Queue
                </span>
            </button>
            <button
                type="button"
                className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => store.dispatch(setView(VIEW_SEARCH))}
            >
                <svg
                    className={"mb-1 h-6 w-6" + searchButtonClass}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
                <span className={"text-sm" + searchButtonClass}>
                    Search
                </span>
            </button>
            <button
                type="button"
                className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => store.dispatch(setView(VIEW_LIBRARY))}
            >
                <svg
                    className={"mb-1 h-6 w-6" + libraryButtonClass}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    ></path>
                </svg>
                <span className={"whitespace-nowrap text-sm" + libraryButtonClass}>
                    My Library
                </span>
            </button>
            <button
                type="button"
                className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => store.dispatch(setView(VIEW_SETTINGS))}
            >
                <svg
                    className={"mb-1 h-6 w-6" + settingButtonClass}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                </svg>
                <span className={"whitespace-nowrap text-sm" + settingButtonClass}>
                    Settings
                </span>
            </button>
        </div>
    );

    if (playlist.name) {
        content = (
            <div className="mx-auto grid h-full max-w-lg grid-cols-1 font-medium">
                <button
                    type="button"
                    className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={handleClearPlaylist}
                >
                    <svg
                        className="mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                    <span className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        My Library
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
            {content}
        </div>
    );
};

export default BottomNavbar;
