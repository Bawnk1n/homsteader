import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool,
  logout: PropTypes.func,
};

export function NavBar(props) {
  const navigate = useNavigate();
  return (
    <div id="nav">
      <div className="side-by-side">
        <Link to="/" className="nav-item">
          My Garden
        </Link>
        <Link to="/plan/" className="nav-item">
          My Plan
        </Link>
        <p className="nav-item">nav item 3</p>
      </div>
      <div>
        {props.isAuthenticated && (
          <button onClick={props.logout} className="mybtn border-radius">
            Logout
          </button>
        )}
        {!props.isAuthenticated && (
          <button onClick={() => navigate("/login/")} className="mybtn">
            Login
          </button>
        )}
      </div>
    </div>
  );
}
