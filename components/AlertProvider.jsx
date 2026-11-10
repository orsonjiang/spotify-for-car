"use client";

import { createContext, use, useCallback, useMemo, useRef, useState } from "react";

import Alert from "./Alert";

const AlertContext = createContext(null);

// Replaces the old redux `alert` slice + helpers/alert.js. One alert is visible at a time; a newer alert replaces
// the current one. Each alert gets an id so a delayed or component-scoped clear never removes a newer alert.
export function AlertProvider({ children }) {
    const [alert, setAlertState] = useState(null);
    const nextId = useRef(0);
    const timer = useRef(null);

    // Sticky alert (stays until cleared). Returns its id.
    const setAlert = useCallback((title, message, type) => {
        clearTimeout(timer.current);
        const id = ++nextId.current;
        setAlertState({ id, title, message, type });
        return id;
    }, []);

    // Clears the alert with this id (or whatever is showing when called without an id).
    const clearAlert = useCallback((id) => {
        setAlertState((current) => (id === undefined || current?.id === id ? null : current));
    }, []);

    // Alert that hides itself after `ms` (default 4 s, like the old runAlert). Returns its id.
    const showAlert = useCallback(
        (title, message, type, ms = 4000) => {
            const id = setAlert(title, message, type);
            timer.current = setTimeout(() => clearAlert(id), ms);
            return id;
        },
        [setAlert, clearAlert]
    );

    const api = useMemo(() => ({ showAlert, setAlert, clearAlert }), [showAlert, setAlert, clearAlert]);

    return (
        <AlertContext value={api}>
            {alert ? <Alert title={alert.title} message={alert.message} type={alert.type} /> : null}
            {children}
        </AlertContext>
    );
}

export function useAlert() {
    const api = use(AlertContext);
    if (!api) throw new Error("useAlert must be used inside <AlertProvider>");
    return api;
}
