import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import routesConfig from "./routes/routesConfig";

function App() {
  return (
    <Router>
      <Layout>
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
