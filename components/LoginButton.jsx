"use client";

import { usePathname } from "next/navigation";

// Full-page link to the Spotify OAuth flow; after login the callback returns to the current path.
const LoginButton = () => {
    const pathname = usePathname();
    const query = new URLSearchParams({ location: pathname || "/" }).toString();

    return (
        <a
            href={`/api/auth/login?${query}`}
            className="inline-block rounded-full bg-green-600 px-8 py-4 text-lg text-white duration-150 hover:bg-green-500 active:bg-green-700"
        >
            Login
        </a>
    );
};

export default LoginButton;
