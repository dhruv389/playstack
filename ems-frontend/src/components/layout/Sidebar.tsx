import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Network,
  UserCircle,
  X,
  Orbit,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles: ('Super Admin' | 'HR Manager' | 'Employee')[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutGrid size={18} />, roles: ['Super Admin', 'HR Manager', 'Employee'] },
  { label: 'Employees', to: '/employees', icon: <Users size={18} />, roles: ['Super Admin', 'HR Manager'] },
  { label: 'Organization', to: '/organization', icon: <Network size={18} />, roles: ['Super Admin', 'HR Manager', 'Employee'] },
  { label: 'My Profile', to: '/profile', icon: <UserCircle size={18} />, roles: ['Super Admin', 'HR Manager', 'Employee'] },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-default bg-surface transition-transform duration-200 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 text-white">
              <Orbit size={18} />
            </div>
            <span className="font-display text-lg font-semibold text-primary">Orbit</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-tertiary hover:bg-surface-2 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent-500/10 text-accent-500'
                    : 'text-secondary hover:bg-surface-2 hover:text-primary'
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl border border-subtle bg-surface-2 p-4">
          <p className="font-display text-xs font-semibold text-primary">Signed in as</p>
          <p className="mt-1 text-xs text-secondary">{user?.role}</p>
        </div>
      </aside>
    </>
  );
}
