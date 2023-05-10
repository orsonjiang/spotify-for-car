import store from '../../../store';
import { setView } from '../../../actions';
import {
    VIEW_QUEUE,
    VIEW_SEARCH,
    VIEW_LIBRARY,
    VIEW_SETTINGS,
} from '../../../constants/view-types';

const BottomNavbar = () => {
    return (
        <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
            <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
                <button
                    type="button"
                    className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => store.dispatch(setView(VIEW_QUEUE))}
                >
                    <svg
                        className="mb-1 h-6 w-6 text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500"
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
                    <span className="text-sm text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500">
                        Queue
                    </span>
                </button>
                <button
                    type="button"
                    className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => store.dispatch(setView(VIEW_SEARCH))}
                >
                    <svg
                        className="mb-1 h-6 w-6 text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500"
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
                    <span className="text-sm text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500">
                        Search
                    </span>
                </button>
                <button
                    type="button"
                    className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => store.dispatch(setView(VIEW_LIBRARY))}
                >
                    <svg
                        className="mb-1 h-6 w-6 text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500"
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
                    <span className="whitespace-nowrap text-sm text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500">
                        My Library
                    </span>
                </button>
                <button
                    type="button"
                    className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => store.dispatch(setView(VIEW_SETTINGS))}
                >
                    <svg
                        className="mb-1 h-6 w-6 text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                    </svg>
                    <span className="text-sm text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-500 whitespace-nowrap">
                          Settings
                    </span>
                </button>
            </div>
        </div>
    );
};

export default BottomNavbar;