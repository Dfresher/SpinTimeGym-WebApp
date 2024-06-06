interface NavbarProps {
  onAddMemberClick: () => void;
}

function Navbar({ onAddMemberClick }: NavbarProps) {
  return (
    <nav className="navbar custom-nav">
      <div className="custom-brand disabled">Spin Time Gym</div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link" aria-current="page" href="#">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={onAddMemberClick}>
            Add Member
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Find Member
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
