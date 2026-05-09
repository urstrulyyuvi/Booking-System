import { Link, useLocation } from 'react-router-dom';
import { FiCalendar, FiUsers, FiBookOpen } from 'react-icons/fi';
function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
          <FiCalendar className="brand-icon" />
          <span>Expert<span className="brand-accent">Book</span></span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/')}><FiUsers /> <span>Experts</span></Link>
          <Link to="/my-bookings" className={isActive('/my-bookings')}><FiBookOpen /> <span>My Bookings</span></Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
