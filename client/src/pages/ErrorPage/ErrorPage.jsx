const ErrorPage = () => {
    return (
        <div className="">
            <div>
                <h1 className="m-16 text-5xl">Spotify for Car</h1>
            </div>
            <div className="mx-10">
                <span>Oh no! It seems like there was an issue authenticating you.</span>
                <br />
                <br />
                <span> The app is currently whitelist only so if you haven't contacted me
                at orsonjiang@gmail.com you probably don't have access. Feel
                free to reach out!</span>
            </div>
        </div>
    );
};

export default ErrorPage;