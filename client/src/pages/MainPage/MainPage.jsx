import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';

import HomeView from "./views/HomeView/HomeView";
import QueueView from "./views/QueueView/QueueView";
import SearchView from "./views/SearchView/SearchView";
import LibraryView from './views/LibraryView/LibraryView';
import SettingsView from "./views/SettingsView/SettingsView";

import BottomNavbar from "./components/BottomNavbar";

import {
	VIEW_HOME,
	VIEW_QUEUE,
	VIEW_SEARCH,
	VIEW_LIBRARY,
	VIEW_SETTINGS,
} from "../../constants/view-types";

import store from "../../store";
import { setView } from "../../actions";
import { fetchQueue, fetchRoomDetails, fetchUser, fetchLibrary } from '../../helpers/fetch';

const MainPage = () => {
    const roomId = useParams()['*'];
    const { globalView } = useSelector((state) => state.view);

    useEffect(() => {
        fetchRoomDetails(roomId);
        fetchQueue(roomId);
        fetchUser().then(fetchLibrary());
    }, []);

    let view;

    if (roomId && globalView == VIEW_HOME) {
        store.dispatch(setView(VIEW_QUEUE));
    }

    switch (globalView) {
        case VIEW_HOME:
            return <HomeView />;
        case VIEW_QUEUE:
            view = <QueueView />
            break;
        case VIEW_SEARCH:
            view = <SearchView />
            break;
        case VIEW_LIBRARY:
            view = <LibraryView />
            break;
        case VIEW_SETTINGS:
            view = <SettingsView />
            break;
        default:
            break;
    }

    return (
        <div>
            <div className='mb-20'>
                {view}
            </div>
            <BottomNavbar />
        </div>
    );
};

export default MainPage;
