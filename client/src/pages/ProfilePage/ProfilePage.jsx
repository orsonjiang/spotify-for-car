import { useEffect, useState } from "react";
import auth from "../../api/authApi";

const ProfilePage = () => {
    const [user, setUser] = useState("");

    useEffect(() => {
        const fetchUrl = async () => {
            const response = await auth.getProfile();
            setUser(response.data.user);
        };

        fetchUrl().catch(console.error);
    }, [user.displayName, user.url]);

    const url = `${import.meta.env.VITE_CLIENT_URL}/${user.url}`;

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
                <div className="m-16 text-5xl">Spotify for Car</div>
                <div className="px-32">Oh no! It seems like there was in issue authenticating you. The app is currently whitelist only so if you have contacted me at orsonjiang@gmail.com you probably don't have access. Feel free to reach out!</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
            <div className="m-16 text-5xl">Spotify for Car</div>
            <div>Welcome {user.displayName}</div>
            <div className="px-32 break-all">
                URL: <a href={url}>{url}</a>
            </div>
        </div>
    );
};

export default ProfilePage;
