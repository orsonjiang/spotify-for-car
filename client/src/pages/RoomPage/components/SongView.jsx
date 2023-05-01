import { useSelector } from 'react-redux';

import SongCard from './SongCard';

const SongView = () => {
    const queueData = useSelector((state) => state.queue);

    let i = 0;

    let CurrentView = '';
    if (queueData.currentSong) {
        CurrentView = (
            <div className="m-auto max-w-lg flex-col justify-center">
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Song</div>
                    {<SongCard song={queueData.currentSong} />}
                </div>
                <div>
                    <div className="mt-4 mb-2 text-3xl">Current Queue</div>
                    <ul>
                        {queueData.queue.map((song) => {
                            return (
                                <SongCard
                                    key={'queue-' + song.id + '-' + i++}
                                    song={song}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    } else if (queueData.currentSong === undefined) {
        CurrentView = <div></div>;
    } else {
        CurrentView = <div>No song playing.</div>;
    }

    return <div>{CurrentView}</div>;
};

export default SongView;
