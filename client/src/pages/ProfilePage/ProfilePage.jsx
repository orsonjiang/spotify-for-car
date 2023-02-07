import { useEffect, useState } from "react";
import auth from "../../api/authApi";

const ProfilePage = () => {
	const [user, setUser] = useState("");

	useEffect(() => {
		const fetchUrl = async () => {
			const response = await auth.getProfile();
			console.log(response.data.user)
			setUser(response.data.user)
		}

		fetchUrl().catch(console.error)

	}, [user.displayName, user.url])

	const url = `http://localhost:5173/${user.url}`

    return (
        <div className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
            <div className="m-16 text-5xl">Spotify for Car</div>
			<div>Welcome {user.displayName}</div>
			<div>URL: <a href={url}>{url}</a></div>
        </div>
    );
};

export default ProfilePage;
