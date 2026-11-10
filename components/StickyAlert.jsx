"use client";

import { useEffect } from "react";

import { useAlert } from "./AlertProvider";

// Shows a sticky alert while mounted and visible (e.g. inside a Suspense/loading fallback, or for the unknown-room
// error). The alert is cleared when this unmounts or is hidden by <Activity> after a navigation.
export default function StickyAlert({ title, message, type }) {
    const { setAlert, clearAlert } = useAlert();

    useEffect(() => {
        const id = setAlert(title, message, type);
        return () => clearAlert(id);
    }, [title, message, type, setAlert, clearAlert]);

    return null;
}
