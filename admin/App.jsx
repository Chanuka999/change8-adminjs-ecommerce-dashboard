import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import About from "./about";
import Contact from "./contact";
import Register from "./register";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/pages/About" element={<About />} />
      <Route path="/admin/pages/Contact" element={<Contact />} />
      <Route path="/admin/register" element={<Register />} />
      {/* Add more routes as needed */}
    </Routes>
  </BrowserRouter>
);

export default App;
