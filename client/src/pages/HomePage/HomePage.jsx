const HomePage = () => {
    return (
        <div className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
            <h1 className="m-16 text-5xl">Spotify for Car</h1>
            <a href="http://localhost:4000/auth/login" className="">
                Login
            </a>
        </div>
    );
};

export default HomePage;
