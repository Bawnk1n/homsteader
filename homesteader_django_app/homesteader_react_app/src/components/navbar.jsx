export function NavBar(props) {
  return (
    <div id="nav">
      <div className="side-by-side">
        <p className="nav-item">nav item 1</p>
        <p className="nav-item">nav item 3</p>
        <p className="nav-item">nav item 2</p>
      </div>
      <div>
        <button onClick={props.logout} className="mybtn">
          Logout
        </button>
      </div>
    </div>
  );
}
