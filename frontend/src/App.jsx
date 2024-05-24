import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { DialogForName } from "./components/DialogForName";
import routesConfig from "./routes/routesConfig";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <DialogForName />
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
    </AuthProvider>
  );
}

export default App;
