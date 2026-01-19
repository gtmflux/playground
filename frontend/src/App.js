import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import QuickFacts from "./components/QuickFacts";
import HowIWork from "./components/HowIWork";
import CoreSkills from "./components/CoreSkills";
import WorkflowDiagrams from "./components/WorkflowDiagrams";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";

function PortfolioPage() {
  return (
    <div className="App bg-zinc-950">
      <Navigation />
      <Hero />
      <QuickFacts />
      <CoreSkills />
      <WorkflowDiagrams />
      <HowIWork />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
