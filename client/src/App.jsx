import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteWrapper from "./pages/components/SiteWrapper";

import MainPage from "./pages/MainPage/MainPage";

function App() {
    return (
        <BrowserRouter>
            <SiteWrapper content={
                <Routes>
                    <Route path="/*" element={<MainPage/>} />
                </Routes>
            } />
        </BrowserRouter>
    );
}

export default App;
