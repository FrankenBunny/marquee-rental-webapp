import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import Button from "../Button/Button";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-links">
          <Button variant="primary" label="Home" onClick={() => navigate("/")} />
          <Button variant="primary" label="New Entry" onClick={() => navigate("/create")} />
          <Button variant="primary" label="New Rentable" onClick={() => navigate("createRentable")} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
