import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreateRentablePage from "./pages/Create/CreateRentablePage";
import UserDashboard from "./pages/Users/UserDashboard";
import ViewPage from "./pages/View/ViewPage";
import EditPage from "./pages/Edit/EditPage";
import PartPage from "./pages/Edit/PartPage";
import "./App.css";
import AddPartPage from "./pages/Edit/AddPartPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/create" element={<CreateRentablePage />} />
          <Route path="/view/:id" element={<ViewPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/rentable/:id/parts" element={<PartPage />} />
          <Route path="/rentable/:id/add-part" element={<AddPartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
