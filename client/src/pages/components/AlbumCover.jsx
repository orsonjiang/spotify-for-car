const AlbumCover = (props) => {
    const { album } = props;

    if (album.images.length) {
		return (
			<img className={'m-2 h-12 w-12'} src={album.images[0].url}/>
		)
	} else {
		return (
			<div className="m-2 flex h-12 w-12 items-center justify-center bg-[#282828]">
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					className={'h-6 w-6'}
					fill="#7f7f7f"
				>
					<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path>
					<path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path>
				</svg >
			</div >
		)
	}
};

export default AlbumCover;