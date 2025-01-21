import { Route, Routes } from "react-router-dom";

import MetaTag from "./libs/MetaTag";
import HomePage from "./pages/Home";

const App = () => (
  <Routes>
    <Route
      path={`/frontend/`}
      element={
        <div>
          <MetaTag title="Home - Morphle lens" />
          <HomePage />
        </div>
      }
    />
    <Route
      path={`/`}
      element={
        <div>
          <MetaTag title="Home - Morphle lens" />
          <HomePage />
        </div>
      }
    />
  </Routes>
);

export default App;
