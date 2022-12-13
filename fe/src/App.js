import "./css/main.css";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./Footer";
// import { Header } from "./Header";  // possibly get rid of this
import { Sidebar } from "./components/Sidebar";
import { ScenarioOverview } from "./ScenarioOverview";
import { ScenarioInput } from "./ScenarioInput";
import { ScenarioOutput } from "./ScenarioOutput";

function App() {
    return (
        <>
            {/* <Header /> // possibly get rid of this */}
            <Sidebar />
            <Routes>
                <Route path="/" element={<ScenarioOverview />} />
                <Route path="/input/:scenario_id" element={<ScenarioInput />} />
                <Route path="/input" element={<ScenarioInput />} />
                <Route path="/scenarios/:scenario_id" element={<ScenarioOutput />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
