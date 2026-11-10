import { LOADING_VIEW } from "@/components/constants";
import StickyAlert from "@/components/StickyAlert";

export default function PlaylistLoading() {
    return (
        <StickyAlert
            title="Playlist Loading"
            message="If you have a lot of songs in your playlist, this might take a second."
            type={LOADING_VIEW}
        />
    );
}
