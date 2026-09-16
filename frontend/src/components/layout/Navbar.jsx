import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../common/Avatar.jsx';
import { IconLogOut } from '../common/icons.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur sm:px-6">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
          C
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-slate-900">
          Collab Docs
        </span>
      </Link>
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar name={user.name} size="sm" />
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <IconLogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      )}
    </header>
  );
}
