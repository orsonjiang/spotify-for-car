import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import LoadingView from './views/LoadingView/LoadingView';
import HomeView from './views/HomeView/HomeView';
import QueueView from './views/QueueView/QueueView';
import SearchView from './views/SearchView/SearchView';
import LibraryView from './views/LibraryView/LibraryView';
import SettingsView from './views/SettingsView/SettingsView';

import BottomNavbar from './components/BottomNavbar';

import {
    VIEW_LOADING,
    VIEW_HOME,
    VIEW_QUEUE,
    VIEW_SEARCH,
    VIEW_LIBRARY,
    VIEW_SETTINGS,
} from '../../constants/viewTypes';

import store from '../../store';
import { setView, setAlert, setRoom, setUser } from '../../actions';
import {
    fetchQueue,
    fetchRoomDetails,
    fetchUser,
    fetchLibrary,
} from '../../helpers/fetch';
import { LOADING_VIEW } from '../../constants/alertTypes';

import demoRoom from "../../fixtures/room.json";
import demoUser from "../../fixtures/user.json";

const MainPage = () => {
    const roomId = useParams()['*'];
    const { user } = useSelector((state) => state.user);
    const { displayName } = useSelector((state) => state.room);
    const { globalView } = useSelector((state) => state.view);

    useEffect(() => {
        /* Demo Routines */
        if (roomId === "demo") {
            store.dispatch(setView(VIEW_QUEUE));
            store.dispatch(setRoom(demoRoom));
            store.dispatch(setUser(demoUser));
            return;
        }
        
        /* Regular Routines */
        if (user.displayName === "") {
            fetchUser().then(fetchLibrary());
        }

        if (roomId !== "" && displayName === "") {
            fetchRoomDetails(roomId);
            fetchQueue(roomId);
        }

        if (globalView === VIEW_HOME && roomId !== "") {
            store.dispatch(setView(VIEW_LOADING));
            store.dispatch(setAlert("Room Loading", "Attempting to find room.", LOADING_VIEW))
        } else if (globalView === VIEW_LOADING && displayName !== "" && displayName != null) {
            store.dispatch(setView(VIEW_QUEUE));
        }
    }, [displayName]);

    let view;
    let isBottomNavbar = true;

    switch (globalView) {
        case VIEW_LOADING:
            view = <LoadingView />;
            isBottomNavbar = false;
            break;
        case VIEW_HOME:
            view = <HomeView />;
            isBottomNavbar = false;
            break;
        case VIEW_QUEUE:
            view = <QueueView />;
            break;
        case VIEW_SEARCH:
            view = <SearchView />;
            break;
        case VIEW_LIBRARY:
            view = <LibraryView />;
            break;
        case VIEW_SETTINGS:
            view = <SettingsView />;
            break;
        default:
            break;
    }

    return (
        <div>
            <div className="mb-20">{view}</div>
            {isBottomNavbar ? <BottomNavbar /> : ""}
        </div>
    );
};

export default MainPage;
