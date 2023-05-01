import { useEffect, useState } from 'react';
import Header from '../components/Header';
import auth from '../../api/authApi';
import DEFAULT_PROFILE from '../../assets/default_profile.jpeg';

const ProfilePage = () => {
    const [user, setUser] = useState({});

    const setNullUser = () => {
        setUser({
            displayName: null,
            url: null,
        });
    };

    useEffect(() => {
        const fetchUrl = async () => {
            const response = await auth.getProfile();
            setUser(response.data.user);
        };

        fetchUrl().catch(setNullUser);
    }, [user.displayName, user.url]);

    let content;
    const profile = user.profile || DEFAULT_PROFILE;

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
                    <a href={url}>
                        <button className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 duration-150 hover:bg-green-500 active:bg-green-700">
                            Open Room
                        </button>
                    </a>

                    <button
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 duration-150 hover:bg-green-500 active:bg-green-700"
                        onClick={() => navigator.clipboard.writeText(url)}
                    >
                        Copy Room Link
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 115.77 122.88"
                            className="h-4 w-4"
                            fill="currentColor"
                            fillRule="evenodd"
                        >
                            <g>
                                <path
                                    class="st0"
                                    d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"
                                />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            {content}
        </div>
    );
};

export default ProfilePage;
