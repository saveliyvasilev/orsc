import "./css/main.css";
import "./css/primereact.css";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScenarioOverview } from "./ScenarioOverview";
import { ScenarioInput } from "./ScenarioInput";
import { ScenarioOutput } from "./ScenarioOutput";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<ScenarioOverview />} />
                <Route path="/input" element={<ScenarioInput />} />
                <Route path="/scenarios/:queryId" element={<ScenarioOutput />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
