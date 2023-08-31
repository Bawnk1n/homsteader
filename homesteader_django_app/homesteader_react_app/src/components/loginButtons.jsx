import { Link } from "react-router-dom";

export function LoginButtons() {
  return (
    <div id="loginbuttons">
      <Link to="/login" className="mybtn">
        Login
      </Link>
      <Link to="/register" className="mybtn">
        Register
      </Link>
    </div>
  );
}
