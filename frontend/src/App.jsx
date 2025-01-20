import { Route, Routes } from "react-router-dom";

import MetaTag from "./libs/MetaTag";
import HomePage from "./pages/Home";

const App = () => {
  const APP_ROUTES = [
    {
      path: "",
      element: <HomePage />,
      metaTitle: "Home - Morphle lens",
    },
  ];

  return (
    <Routes>
      {APP_ROUTES.map((routesData) => (
        <Route
          key={routesData.path}
          path={`/frontend/${routesData.path}`}
          element={
            <div>
              <MetaTag title={routesData.metaTitle} />
              {routesData.element}
            </div>
          }
        />
      ))}
    </Routes>
  );
};

export default App;
