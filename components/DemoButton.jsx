import Link from "next/link";

const DemoButton = () => {
    return (
        <Link
            href="/demo"
            className="inline-block rounded-full bg-green-600 px-4 py-2.5 text-sm text-white duration-150 hover:bg-green-500 active:bg-green-700"
        >
            Demo Room
        </Link>
    );
};

export default DemoButton;
