import {
    LOADING_VIEW,
    ERROR_VIEW,
    SUCCESS_VIEW,
    WARNING_VIEW,
    MISC_VIEW,
} from "./constants";

const TYPE_CLASSES = {
    [LOADING_VIEW]: "text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800",
    [ERROR_VIEW]: "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800",
    [SUCCESS_VIEW]: "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800",
    [WARNING_VIEW]: "text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-800",
    [MISC_VIEW]: "text-gray-800 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-800",
};

const InfoIcon = () => (
    <svg aria-hidden="true" className="mr-3 inline h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
    </svg>
);

const LoadingIcon = () => (
    <svg
        aria-hidden="true"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
        className="mr-3 inline h-5 w-5 shrink-0"
    >
        <path
            fill="currentColor"
            d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        >
            <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="1s"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite"
            />
        </path>
    </svg>
);

// Presentational alert banner (same markup/classes as the old client/src/pages/components/Alert.jsx).
// State lives in AlertProvider.
const Alert = ({ title, message, type }) => {
    const className =
        "max-w-lg mx-auto absolute inset-x-1 top-1 z-10 flex p-4 text-sm border rounded-lg " +
        (TYPE_CLASSES[type] ?? "");

    return (
        <div className={className} role={type === ERROR_VIEW ? "alert" : "status"}>
            {type === LOADING_VIEW ? <LoadingIcon /> : <InfoIcon />}
            <div className="inline text-left">
                <div className="font-medium">{title}</div>
                {message}
            </div>
        </div>
    );
};

export default Alert;
