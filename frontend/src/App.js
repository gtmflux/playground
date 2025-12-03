import React from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import QuickFacts from "./components/QuickFacts";
import HowIWork from "./components/HowIWork";
import CoreSkills from "./components/CoreSkills";
import WorkflowDiagrams from "./components/WorkflowDiagrams";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
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

export default App;
