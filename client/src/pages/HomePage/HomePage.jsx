const HomePage = () => {
    return (
        <div>
            <h1 className="m-16 text-5xl">Spotify for Car</h1>
            <a href={`${import.meta.env.VITE_SERVER_URL}/auth/login`}>
                <button className="rounded-full bg-green-600 px-6 py-3.5 text-white duration-150 hover:bg-green-500 active:bg-green-700">
                    Login
                </button>
            </a>
        </div>
    );
};

export default HomePage;
