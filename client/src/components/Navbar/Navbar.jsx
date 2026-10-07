import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-blue-200"
        >
          OcuVision AI
        </Link>


        {/* Navigation Links */}
        <ul className="flex items-center gap-8 font-medium">

          <li>
            <Link
              to="/"
              className="hover:text-blue-200"
            >
              Home
            </Link>
          </li>


          <li>
            <a
              href="/#about"
              className="hover:text-blue-200"
            >
              About
            </a>
          </li>


          <li>
            <a
              href="/#services"
              className="hover:text-blue-200"
            >
              Services
            </a>
          </li>


          <li>
            <Link
              to="/predict"
              className="hover:text-blue-200"
            >
              Predict
            </Link>
          </li>


          <li>
            <Link
              to="/history"
              className="hover:text-blue-200"
            >
              History
            </Link>
          </li>


          <li>
            <Link
              to="/dashboard"
              className="hover:text-blue-200"
            >
              Dashboard
            </Link>
          </li>


          <li>
            <Link
              to="/login"
              className="hover:text-blue-200"
            >
              Login
            </Link>
          </li>

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;