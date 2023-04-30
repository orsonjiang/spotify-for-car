const HomePage = () => {
    return (
        <div>
            <h1 className="m-16 text-5xl">Spotify for Car</h1>
            <a
                href={`${import.meta.env.VITE_SERVER_URL}/auth/login`}
                className="rounded-lg border border-transparent bg-zinc-200 px-6 py-4 font-bold hover:border-green-500 dark:bg-stone-900 duration-75"
            >
                Login
            </a>
        </div>
    );
};

export default HomePage;
