// Shown when the Spotify login fails (the OAuth callback redirects here). Same copy as the old ErrorPage.
export default function ErrorPage() {
    return (
        <div className="">
            <div>
                <h1 className="m-16 text-5xl">Spotify for Car</h1>
            </div>
            <div className="mx-10">
                <span>Oh no! It seems like there was an issue authenticating you.</span>
                <br />
                <br />
                <span>
                    {" "}
                    The app is currently whitelist only so if you haven&apos;t contacted me at orsonjiang@gmail.com
                    you probably don&apos;t have access. Feel free to reach out!
                </span>
            </div>
        </div>
    );
}
