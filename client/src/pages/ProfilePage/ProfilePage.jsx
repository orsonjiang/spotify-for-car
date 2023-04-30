import { useEffect, useState } from 'react';
import auth from '../../api/authApi';

const ProfilePage = () => {
    const [user, setUser] = useState({});

    const setNullUser = () => {
        setUser({
            displayName: null,
            url: null
        })
    }

    useEffect(() => {
        const fetchUrl = async () => {
            const response = await auth.getProfile();
            setUser(response.data.user);
        };

        fetchUrl().catch(setNullUser);
    }, [user.displayName, user.url]);

    let content;

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
                <div>Welcome {user.displayName}</div>
                <div className="break-all px-32">
                    URL: <a href={url}>{url}</a>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="m-16 text-5xl">Spotify for Car</div>
            {content}
        </div>
    );
};

export default ProfilePage;
