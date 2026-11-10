// Alert types (same values as the old client/src/constants/alertTypes.js).
export const LOADING_VIEW = "LOADING_VIEW";
export const ERROR_VIEW = "ERROR_VIEW";
export const SUCCESS_VIEW = "SUCCESS_VIEW";
export const WARNING_VIEW = "WARNING_VIEW";
export const MISC_VIEW = "MISC_VIEW";

export const DEMO_ROOM_URL = "demo";
export const DEFAULT_PROFILE = "/images/default-profile.jpeg";
export const QUEUE_POLL_MS = 2000;
export const SEARCH_DEBOUNCE_MS = 250;

export const CONNECTION_ISSUE_TITLE = "Connection Issue";
export const CONNECTION_ISSUE_MESSAGE =
    "There is an issue with our servers. Please sit tight while we rectify the problem.";

// `/<room>` plus optional extra path segments, each URL-encoded.
export const roomPath = (roomUrl, ...segments) =>
    "/" + [roomUrl, ...segments].map((segment) => encodeURIComponent(segment)).join("/");
