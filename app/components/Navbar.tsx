import { NavLink } from 'remix';
import { ClientOnly } from 'remix-utils';

import DarkModeSwitch from '~/components/DarkModeSwitch';

const routes = [
  { to: '/app/questions', title: 'Lista pytań' },
  { to: '/app/random', title: 'Losowe pytanie' },
  { to: '/app/exam', title: 'Egzamin' },
];

const Navbar = () => {

  return (
    <div className="shadow flex px-4 dark:bg-surface-dp2 transition duration-500">
      {routes.map((route) => (
        <NavLink
          key={`navlink-${route.to}`}
          to={route.to}
          className={({ isActive }) =>
            `m-4 ${isActive ? 'text-blue-400 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50'}`
          }
        >
          {route.title}
        </NavLink>
      ))}
      <div className="flex flex-1" />
      <ClientOnly fallback={null}>
        <DarkModeSwitch />
      </ClientOnly>
    </div>
  );
};

export default Navbar;
