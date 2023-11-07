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
          Garden
        </Link>
        <p className="nav-item">|</p>
        <Link to="/plan/" className="nav-item">
          Plan
        </Link>
      </div>
      {props.username && (
        <p id="signedInAs">
          <small>signed in as {props.username}</small>
        </p>
      )}
      <div>
        {props.isAuthenticated && (
          <div id="user-info">
            <button
              onClick={() => {
                props.logout(), navigate("/login");
              }}
              className="mybtn border-radius smaller"
            >
              Logout
            </button>
          </div>
        )}
        {!props.isAuthenticated && (
          <button
            onClick={() => navigate("/login/")}
            className="mybtn border-radius"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
