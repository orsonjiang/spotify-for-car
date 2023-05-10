import { useSelector } from "react-redux";

const SongCard = (props) => {
	const { song, onClick } = props; 
	const addedSong = useSelector((state) => state.search.addedSong);

	let className = "flex bg-zinc-200 dark:bg-zinc-900 rounded-xl m-2";
	if (song.id == addedSong) {
		className += " border border-blue-600";
	}
	console.log(song.album.artists)

	return (
		<li key={song.id} className={className} onClick={onClick ? () => onClick(song.id) : undefined}>
			<img
				className={"m-2 h-12 w-12"}
				src={song.album.images[0].url}
			/>
			<div className="mt-2 flex flex-col text-left">
				<p className="text-base font-normal">{song.name}</p>
				<p className="text-sm font-light">
					{song.album.artists.map(artist => artist.name).join(", ")}
				</p>
			</div>
		</li>
	);
};

export default SongCard;