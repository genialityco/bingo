import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NewBingoContextProvider } from "./pages/customizeBingoView/context/NewBingoContext.jsx";
import { LoadingProvider } from "./context/LoadingContext";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <LoadingProvider>
    <AuthProvider>
      <NewBingoContextProvider>
        <App />
      </NewBingoContextProvider>
    </AuthProvider>
  </LoadingProvider>
  </React.StrictMode>
);
