import React from "react";
import { Header } from "./Header";

export const Layout = ({ children }) => {
  return (
    <div className="min-w-full">
      <Header />
      <main>{children}</main>
    </ div>
  );
};
