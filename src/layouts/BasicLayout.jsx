import React from "react";
import { Outlet } from "react-router-dom";  // import Outlet
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

export default function BasicLayout() {
  return (
    
    <>
      <Navbar />
      <main>
        <Outlet />  {/* This renders the matched child route */}
      </main>
      <Footer />
    </>
  );
}
