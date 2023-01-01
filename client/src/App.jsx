import { useState } from 'react';
import api, { searchSongs } from './api';

function App() {
  const [store, setStore] = useState({
    songsLoaded: false,
    currentSong: undefined,
    queue: [],
    songs: [],
    searchText: ''
  });

  const handleGetQueue = () => {
    async function asyncfunction() {
      let response = await api.getCurrentQueue();
      setStore({
        ...store,
        songsLoaded: true,
        currentSong: response.data.currently_playing,
        queue: response.data.queue
      });
    }
    asyncfunction();
  };

  const handleSearch = () => {
    async function asyncfunction() {
      let response = await api.searchSongs(store.searchText);
      setStore({
        ...store,
        searchText: '',
        songs: response.data.tracks.items
      });
    }
    asyncfunction();
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Enter') {
      handleSearch();
    }
  };

  const handleUpdateText = (event) => {
    setStore({
      ...store,
      searchText: event.target.value
    });
  };

  const handleAddSong = (event) => {
    const id = event.target.id;
    async function asyncfunction() {
      try {
        let response = await api.addSongToQueue(id);
        if (response.status == 204) {
          response = await api.getCurrentQueue();
          setStore({
            ...store,
            songsLoaded: true,
            songs: [],
            currentSong: response.data.currently_playing,
            queue: response.data.queue
          });
        }
      } catch {
        setStore({
          ...store,
          songsLoaded: true,
          songs: []
        });
      }
    }
    asyncfunction();
  };

  let songs = '';
  if (store.songs.length) {
    songs = (
      <ul>
        {store.songs.map((track) => (
          <li
            key={track.id}
            id={track.id}
            className={'song-card'}
            onClick={handleAddSong}
          >
            {track.name} by {track.album.artists[0].name}
          </li>
        ))}
      </ul>
    );
  }

  let queue = '';
  if (store.currentSong) {
    queue = (
      <div>
        <h3>Current Song</h3>
        <ul>
          <li key={store.currentSong.id}>{store.currentSong.name}</li>
        </ul>
        <h3>Current Queue</h3>
        <ul>
          {store.queue.map((track) => (
            <li key={track.id} className={'queue-card'}>
              {track.name} by {track.album.artists[0].name}
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (store.songsLoaded) {
    queue = <h4>No song playing.</h4>;
  }

  let queueLabel = store.songsLoaded ? 'Reload Songs' : 'Load Songs';

  return (
    <div className="App">
      <h1>Spotify for Car</h1>
      <h2>Song Search</h2>
      <input
        type="text"
        id="ssearch"
        onChange={handleUpdateText}
        onKeyDown={handleKeyDown}
        value={store.searchText}
      ></input>
      <button onClick={handleSearch}>Search</button>
      {songs}

      <h2>Song View</h2>
      <button onClick={handleGetQueue}>{queueLabel}</button>
      {queue}
    </div>
  );
}

export default App;
