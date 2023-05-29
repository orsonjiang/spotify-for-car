import AlbumCover from "../../../../components/AlbumCover";

const PlaylistCard = (props) => {
	const { playlist, onClick } = props; 

	let className = "flex bg-zinc-200 dark:bg-zinc-900 rounded-xl m-2";

	return (
		<li key={playlist.id} className={className} onClick={onClick ? () => onClick(playlist.id) : undefined}>
			<AlbumCover album={playlist}/>
			<div className="mt-2 flex flex-col text-left">
				<p className="text-base font-normal">{playlist.name}</p>
				<p className="text-sm font-light">
					{playlist.owner.display_name}
				</p>
			</div>
		</li>
	);
};

export default PlaylistCard;