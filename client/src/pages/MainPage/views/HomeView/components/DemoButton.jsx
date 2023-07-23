const DemoButton = () => {
    return (
        <a href={`${import.meta.env.VITE_CLIENT_URL}/demo`}>
            <button className="rounded-full bg-green-600 px-4 py-2.5 text-white duration-150 hover:bg-green-500 active:bg-green-700 text-sm">
                Demo Room
            </button>
        </a>
    );
};

export default DemoButton;
