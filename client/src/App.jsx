import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteWrapper from "./pages/components/SiteWrapper";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RoomPage from "./pages/RoomPage/RoomPage";

function App() {
    return (
        <BrowserRouter>
            <SiteWrapper content={
                <Routes>
                    <Route exact path="/" element={<HomePage/>} />
                    <Route exact path="/profile" element={<ProfilePage/>} />
                    <Route exact path="/:roomId" element={<RoomPage/>} />
                </Routes>
            } />
        </BrowserRouter>
    );
}

export default App;
