import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, ChevronDown, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';

export function Header({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-default bg-surface/80 px-4 py-3.5 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-secondary hover:bg-surface-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg font-semibold text-primary sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2.5 text-secondary hover:bg-surface-2 hover:text-primary focus-ring transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-surface-2 focus-ring transition-colors"
          >
            <Avatar src={user?.profileImage} name={user?.name ?? ''} size="sm" />
            <span className="hidden text-sm font-medium text-primary sm:block">{user?.name.split(' ')[0]}</span>
            <ChevronDown size={14} className="hidden text-tertiary sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 animate-slide-up rounded-xl border border-default bg-surface p-1.5 shadow-xl">
              <div className="px-3 py-2 border-b border-subtle mb-1">
                <p className="text-sm font-medium text-primary truncate">{user?.name}</p>
                <p className="text-xs text-secondary truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary"
              >
                <UserCircle size={16} />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger-500 hover:bg-danger-500/10"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
