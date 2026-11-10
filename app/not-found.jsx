import Link from "next/link";

import LoadingView from "@/components/LoadingView";

export default function NotFound() {
    return (
        <div>
            <div className="mb-20">
                <LoadingView />
                <div className="text-lg">This page could not be found.</div>
                <div className="my-8">
                    <Link
                        href="/"
                        className="inline-block rounded-full bg-green-600 px-4 py-2.5 text-sm text-white duration-150 hover:bg-green-500 active:bg-green-700"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
