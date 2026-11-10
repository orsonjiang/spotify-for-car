import LoginButton from "./LoginButton";

// "My Library" prompt for viewers who are not logged in.
const LibraryLogin = () => {
    return (
        <div>
            <div className="mx-16">
                <div className="m-8 text-3xl">My Library</div>
                <div className="text-lg">Login to add songs from your library.</div>
                <div className="my-8">
                    <LoginButton />
                </div>
            </div>
        </div>
    );
};

export default LibraryLogin;
