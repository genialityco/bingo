import React from "react";
import { useAuth } from "../context/AuthContext";
import { DialogForName } from "./DialogForName";
import { Header } from "./Header";

export const Layout = ({ children }) => {

  return (
    <div className="min-w-full">
      <Header />
      <main>{children}</main>
    </div>
  );
};
