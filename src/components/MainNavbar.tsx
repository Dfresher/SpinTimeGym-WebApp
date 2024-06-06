function Navbar() {
  return (
    <>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link disabled logo" href="#">
            Spin Time Gym
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" aria-current="page" href="#">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Add member
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Find member
          </a>
        </li>
      </ul>
    </>
  );
}

export default Navbar();
