import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Header from "/Users/royhce/type-game/src/header.jsx";
import Home from "/Users/royhce/type-game/src/Home.jsx";

function App() {
  
  return (
    <Router>
      <Header />
      <Home/>
    </Router>
  )
}

export default App
