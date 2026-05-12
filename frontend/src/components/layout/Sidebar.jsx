import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const links = [
    { to: '/', label: 'Dashboard', roles: ['admin', 'customer'] },
    { to: '/products', label: 'Products', roles: ['admin'] },
    { to: '/orders', label: 'Orders', roles: ['admin', 'customer'] },
    { to: '/customers', label: 'Customers', roles: ['admin'] },
  ].filter((item) => item.roles.includes(user?.role));

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <strong>Analytics</strong>
        <button type="button" className="ghost mobile-only" onClick={onClose}>
          ✕
        </button>
      </div>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} onClick={onClose}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="danger" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
