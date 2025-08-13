import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreatePage from "./pages/Create/CreatePage";
import UserDashboard from "./pages/Users/UserDashboard";
import "./App.css";
import CreateRentablePage from "./pages/Create/CreateRentablePage";
import TestComponent from "./components/Test/TestComponent"; // <--- import it

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/createRentable" element={<CreateRentablePage />} />
          <Route path="/test" element={<TestComponent />} /> {/* <--- route for testing */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
