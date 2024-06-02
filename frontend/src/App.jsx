import React from "react";
import { CustomLoading } from "./components/CustomLoading";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DialogForName } from "./components/DialogForName";
import routesConfig from "./routes/routesConfig";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, userName, loading } = useAuth();

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <Router>
      <Layout>
        <CustomLoading />
        {!user && !userName && <DialogForName />}
        <Routes>
          {routesConfig.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
              exact={route.exact}
            />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
