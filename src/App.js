import { Routes, Route } from "react-router-dom";

import HomePage from "./Home";

import { MintContextProvider } from "./context/MintPageContext";
import Mint from "./Mint";

import PageNotFound from "./PageNotFound";

const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/mint/:chainName/:contractAddress"
                    element={
                        <MintContextProvider>
                            <Mint />
                        </MintContextProvider>
                    }
                />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
};

export default App;
