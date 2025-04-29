import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Header from "./header.jsx";
import Home from "./Home.jsx";

function App() {
  
  return (
    <Router>
      <Header />
      <Home/>
    </Router>
  )
}

export default App
