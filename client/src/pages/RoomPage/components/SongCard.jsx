import { useSelector } from "react-redux";

const SongCard = (props) => {
	const { song } = props; 
	const lastAdded = useSelector((state) => state.lastAdded);

	let className = "flex bg-zinc-100 dark:bg-zinc-900 rounded-xl m-2";
	if (song.id == lastAdded) {
		className += " border border-blue-600";
	}

	return (
		<li key={song.id} className={className}>
			<img
				className={"m-2 h-12 w-12"}
				src={song.album.images[0].url}
			/>
			<div className="mt-2 flex flex-col text-left">
				<p className="text-base font-normal">{song.name}</p>
				<p className="text-sm font-light">
					{song.album.artists[0].name}
				</p>
			</div>
		</li>
	);
};

export default SongCard;