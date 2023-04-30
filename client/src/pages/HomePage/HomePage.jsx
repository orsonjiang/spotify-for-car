const HomePage = () => {
    return (
        <div>
            <h1 className="m-16 text-5xl">Spotify for Car</h1>
            <a href={`${import.meta.env.VITE_SERVER_URL}/auth/login`} className="">
                Login
            </a>
        </div>
    );
};

export default HomePage;
