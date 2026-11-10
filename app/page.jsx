import DemoButton from "@/components/DemoButton";
import Faq from "@/components/Faq";
import LoginButton from "@/components/LoginButton";

// Home (old HomeView).
export default function HomePage() {
    return (
        <div>
            <div className="mb-20">
                <div className="mx-4 flex-col">
                    <div className="my-32">
                        <h1 className="my-16 text-5xl">Spotify for Car</h1>
                        <div className="my-2">
                            <LoginButton />
                        </div>
                    </div>
                    <div className="my-32">
                        <h2 className="my-6 text-3xl font-medium">FAQ</h2>

                        <Faq
                            question="What is Spotify for Car?"
                            answer="Spotify for Car is a web application that allows a group of users to control music from a central output device while utilizing their personal devices."
                        />
                        <Faq
                            question="Is the app Public?"
                            answer="Due to Spotify API limitations, the app is currently not public. If you'd like to see what the app does, there is a demo room below that allows you to explore! Some functionality is expected to be limited."
                            content={<DemoButton />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
