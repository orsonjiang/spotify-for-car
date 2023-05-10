import { useEffect, useState } from "react";
import auth from "../../../../api/authApi";
import DEFAULT_PROFILE from "../../../../assets/default_profile.jpeg";

const SettingsView = () => {
    const [user, setUser] = useState({});

    const setNullUser = () => {
        setUser({
            displayName: null,
            url: null,
            picture_url: null,
        });
    };

    useEffect(() => {
        const fetchUrl = async () => {
            const response = await auth.getProfile();
            setUser(response.data.user);
        };

        fetchUrl().catch(setNullUser);
    }, [user.displayName, user.url, user.picture_url]);

    const handleShare = (url) => {
        navigator.share({
            url: url
        })
    }

    let content;
    const profile = user.picture_url || DEFAULT_PROFILE;

    if (user.displayName === null) {
        content = (
            <div className="px-32">
                Oh no! It seems like there was in issue authenticating you. The
                app is currently whitelist only so if you haven't contacted me
                at orsonjiang@gmail.com you probably don't have access. Feel
                free to reach out!
            </div>
        );
    } else {
        const url = `${import.meta.env.VITE_CLIENT_URL}/${user.url}`;
        content = (
            <div>
                <img
                    src={profile}
                    alt="Profile Picture"
                    className="m-8 mx-auto h-48 w-48 rounded-full object-scale-down"
                />
                <div className="m-8 text-3xl">{user.displayName}</div>
                <div className="flex justify-center gap-4">
                    <button className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 duration-150 hover:bg-green-500 active:bg-green-700" onClick={() => handleShare(url)}>
                        Share Room
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {content}
        </div>
    );
};

export default SettingsView;
