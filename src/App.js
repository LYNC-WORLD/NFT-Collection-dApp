import { Routes, Route, useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MintContextProvider } from "./context/MintPageContext";
import Mint from "./Mint";

const App = () => {
    const navigate = useNavigate();

    return (
        <div className="app">
            <Routes>
                <Route
                    path="/mint/:chainName/:contractAddress"
                    element={
                        <MintContextProvider>
                            <Mint />
                        </MintContextProvider>
                    }
                />
                <Route
                    path="*"
                    element={<h1>404: Page Not Found! Please Go Back!</h1>}
                />
            </Routes>
            <ToastContainer />
        </div>
    );
};

export default App;
