import { useSelector } from 'react-redux';

import Navbar from "../../components/Navbar";
import LoginButton from '../../components/LoginButton';

import DEFAULT_PROFILE from '../../../../assets/default-profile.jpeg';

const SettingsView = () => {
    const { user } = useSelector((state) => state.user);
    const { owner_id } = useSelector((state) => state.room);

    const handleShare = (url) => {
        navigator.share({
            url: url,
        });
    };

    let content;
    const profile = user.picture_url || DEFAULT_PROFILE;

    if (user.displayName === "") {
        content = (
            <div>
                <Navbar />
                <div className="text-lg">Login to manage this room.</div>
                <div className='my-8'>
                    <LoginButton />
                </div>
            </div>
        );
    } else if (owner_id == user.id) {
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
                    <button
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 duration-150 hover:bg-green-500 active:bg-green-700"
                        onClick={() => handleShare(url)}
                    >
                        Share Room
                    </button>
                </div>
            </div>
        );
    } else {
        content = (
            <div>
                <Navbar />
                <div className="text-lg">You, {user.displayName}, are not the owner of this room.</div>
            </div>
        );
    }

    return <div>{content}</div>;
};

export default SettingsView;
