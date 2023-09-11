import { Link, useNavigate } from "react-router-dom";

export function NavBar(props) {
  const navigate = useNavigate();
  return (
    <div id="nav">
      <div className="side-by-side">
        <p className="nav-item">nav item 1</p>
        <p className="nav-item">nav item 3</p>
        <p className="nav-item">nav item 2</p>
      </div>
      <div>
        {props.isAuthenticated && (
          <button onClick={props.logout} className="mybtn">
            Logout
          </button>
        )}
        {!props.isAuthenticated && (
          <button onClick={() => navigate("/login")} className="mybtn">
            Login
          </button>
        )}
      </div>
    </div>
  );
}
