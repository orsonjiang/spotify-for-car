
import { useSelector } from 'react-redux';

import DEFAULT_PROFILE from '../../../assets/default_profile.jpeg';

const Navbar = () => {
    const roomDetails = useSelector((state) => state.room)

    return (
        <div className='my-12'>
            <div className="m-4 flex content-center justify-center gap-12 align-middle">
                <div className="mx-2 flex items-center gap-x-3">
                    <img
                        src={roomDetails.picture_url || DEFAULT_PROFILE}
                        className="h-16 w-16 rounded-full"
                    />
                    <div>
                        <span className="block text-3xl">{roomDetails.displayName || "Someone"}'s Room</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
