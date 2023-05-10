const ErrorPage = () => {
    return (
        <div className="flex-col">
            <div>
                <h1 className="m-16 text-5xl">Spotify for Car</h1>
            </div>
            <div className="px-32">
                Oh no! It seems like there was in issue authenticating you. The
                app is currently whitelist only so if you haven't contacted me
                at orsonjiang@gmail.com you probably don't have access. Feel
                free to reach out!
            </div>
        </div>
    );
};

export default ErrorPage;