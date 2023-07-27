import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import LIKED_SONGS from "../../../../assets/liked-songs.png"
import { LOADING_VIEW, SUCCESS_VIEW } from '../../../../constants/alertTypes';
import { runAlert } from "../../../../helpers/alert";
import { setAddedSong, setQueue, setPlaylist, addPlaylistCache, setAlert, clearAlert } from '../../../../actions';
import store from '../../../../store';
import api from "../../../../api/api";
import auth from '../../../../api/authApi';
import PlaylistCard from './components/PlaylistCard';
import SongCard from '../../components/SongCard';
import LoginButton from '../../components/LoginButton';

const LibraryView = () => {
    const roomId = useParams()['*']

    const { user } = useSelector((state) => state.user);
    const { library, playlist, playlistCache } = useSelector((state) => state.library);

    const fullLibrary = [{
        id: "liked",
        images: [
            {
                url: LIKED_SONGS
            }
        ],
        name: "Liked Songs",
        owner: {
            display_name: "You"
        }
    }].concat(library);


    const handleSetPlaylist = async (id) => {
        let data;

        if (playlistCache[id] != null) {
            data = playlistCache[id];
        } else {
            store.dispatch(setAlert("Playlist Loading", "If you have a lot of songs in your playlist, this might take a second.", LOADING_VIEW))
            const res = await auth.getPlaylist(id);
            data = res.data;
            store.dispatch(clearAlert());
            store.dispatch(addPlaylistCache(id, res.data));
        }
        store.dispatch(
            setPlaylist({
                name: id === "liked" ? "Liked Songs" : fullLibrary.filter((playlist) => playlist.id == id)[0].name,
                songs: data,
            })
        );
        
    };

    const handleAddSong = async (song) => {
        const trackId = song.id;
        const trackName = song.name;
        let addSong = await api.addToQueue(roomId, trackId);
        if (addSong.status == 200) {
            runAlert("Song Added", `${trackName} has been added to the queue!`, SUCCESS_VIEW);
            store.dispatch(setAddedSong(trackId));
            let queue = await api.getQueue(roomId);
            store.dispatch(setQueue(queue.data));
        }
    };

    let i = 0;
    let content = '';
    if (user.displayName === '') {
        content = (
            <div className="mx-16">
                <div className="m-8 text-3xl">My Library</div>
                <div className="text-lg">
                    Login to add songs from your library.
                </div>
                <div className="my-8">
                    <LoginButton />
                </div>
            </div>
        );
    } else if (playlist.name) {
        content = (
            <div className="flex-col">
                <div>
                    <div className="my-8 mx-auto self-center text-3xl">
                        {playlist.name}
                    </div>
                    <div className="m-auto max-w-lg">
                        <ul>
                            {playlist.songs.map((song) => {
                                return (
                                    <SongCard
                                        key={
                                            'queue-' + song.track.id + '-' + i++
                                        }
                                        song={song.track}
                                        onClick={handleAddSong}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else if (fullLibrary.length) {
        content = (
            <div className="m-auto max-w-lg flex-col justify-center">
                <div>
                    <div className="m-8 text-3xl">My Library</div>
                    <ul>
                        {fullLibrary.map((playlist) => {
                            return (
                                <PlaylistCard
                                    id={playlist.id}
                                    key={'playlist-' + playlist.id + '-' + i++}
                                    playlist={playlist}
                                    onClick={handleSetPlaylist}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    } else {
        content = <div className="m-8 text-3xl">My Library</div>;
    }

    return <div>{content}</div>;
};

export default LibraryView;
