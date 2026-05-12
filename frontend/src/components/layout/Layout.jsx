import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="layout">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="content">
        <header className="topbar">
          <button type="button" className="ghost mobile-only" onClick={() => setOpen(true)}>
            ☰
          </button>
          <h1>E-Commerce Dashboard</h1>
          <button type="button" className="ghost" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
