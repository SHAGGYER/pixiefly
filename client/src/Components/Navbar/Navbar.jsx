import React, { useContext } from 'react';
import Logo from '../../Images/logo.svg';
import { useHistory, Link } from 'react-router-dom';
import AppContext from '../../Contexts/AppContext';
import './Navbar.css';
import NavbarSubmenu from './Submenu/NavbarSubmenu';

export default function () {
  const history = useHistory();
  const { user, logout } = useContext(AppContext);

  const userItems = [
    {
      title: 'Logout',
      onClick: () => logout(),
    },
  ];

  return (
    <header className="text-gray-700 body-font bg-gray-400">
      <div className="container mx-auto flex flex-wrap p-2 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900">
          <img src={Logo} className="h-16" />
        </a>
        {!user && (
          <>
            <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
              <Link to="/" className="mr-5 hover:text-gray-900">
                Start
              </Link>
            </nav>
            <button
              onClick={() => history.push('/auth/login')}
              className="inline-flex items-center bg-gray-200 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0"
            >
              Log Ind
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </>
        )}
        {user && (
          <div className="ml-auto flex">
            <NavbarSubmenu title="Konto" items={userItems} />
          </div>
        )}
      </div>
    </header>
  );
}
