import { Route, Routes } from "react-router-dom";


import { MintContextProvider } from "./context/MintPageContext";
import Mint from "./Mint";

import PageNotFound from "./PageNotFound";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
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
