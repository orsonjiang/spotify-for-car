import qs from 'query-string';
import { useLocation } from 'react-router-dom';

const LoginButton = () => {
    const location = useLocation();
    const queryString = qs.stringify({location: location.pathname});
    
    return (
        <a href={`${import.meta.env.VITE_SERVER_URL}/auth/login?${queryString}`}>
            <button className="rounded-full bg-green-600 px-6 py-3.5 text-white duration-150 hover:bg-green-500 active:bg-green-700">
                Login
            </button>
        </a>
    );
};

export default LoginButton;
