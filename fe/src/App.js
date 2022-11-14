import "./css/main.css";
import "./css/primereact.css";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScenarioOverview } from "./ScenarioOverview";
import { ScenarioInput } from "./ScenarioInput";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<ScenarioOverview />} />
                <Route path="/input" element={<ScenarioInput />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
