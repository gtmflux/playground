import React from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import CaseStudies from "./components/CaseStudies";
import WorkflowDiagrams from "./components/WorkflowDiagrams";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App bg-zinc-950">
      <Navigation />
      <Hero />
      <CaseStudies />
      <WorkflowDiagrams />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
