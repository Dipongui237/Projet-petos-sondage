import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UsersIcon, ClipboardListIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import ResponsesView from '../components/admin/ResponsesView';
import QuestionEditor from '../components/admin/QuestionEditor';
export default function Admin() {
  const {
    currentUser,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!currentUser?.isAdmin) {
    return null; // This should be handled by AdminRoute
  }
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const navItems = [{
    path: '/admin/users',
    label: 'Utilisateurs',
    icon: <UsersIcon className="mr-3 h-5 w-5" />
  }, {
    path: '/admin/responses',
    label: 'Réponses',
    icon: <ClipboardListIcon className="mr-3 h-5 w-5" />
  }, {
    path: '/admin/questions',
    label: 'Questions',
    icon: <SettingsIcon className="mr-3 h-5 w-5" />
  }];
  return <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 flex z-40 lg:hidden`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}>
              <span className="sr-only">Fermer le menu</span>
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto bg-green-900">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`${location.pathname === item.path ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-base font-medium rounded-md`} onClick={() => setSidebarOpen(false)}>
                  {item.icon}
                  {item.label}
                </Link>)}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {currentUser.name}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  Administrateur
                </p>
              </div>
              <button onClick={handleLogout} className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500">
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navItems.map(item => <Link key={item.path} to={item.path} className={`${location.pathname === item.path ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                    {item.icon}
                    {item.label}
                  </Link>)}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {currentUser.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    Administrateur
                  </p>
                </div>
                <button onClick={handleLogout} className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500">
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Ouvrir le menu</span>
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<Navigate to="/admin/responses" replace />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/responses" element={<ResponsesView />} />
                <Route path="/questions" element={<QuestionEditor />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>;
}
function Navigate({
  to
}: {
  to: string;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}