import LoginButton from '../../components/LoginButton';

const HomeView = () => {
    return (
        <div className="flex-col">
            <div>
                <h1 className="m-16 text-5xl">Spotify for Car</h1>
            </div>
            <div className="my-2">
                <LoginButton />
            </div>
        </div>
    );
};

export default HomeView;