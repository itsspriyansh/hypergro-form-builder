import { Links, Meta, Outlet, Scripts, Link } from "@remix-run/react";
import "./app.css";
import {
  MdDashboard,
  MdOutlineInsertDriveFile,
} from "react-icons/md";
import { IoCreate } from "react-icons/io5";

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <title>Hypergro Form Builder</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 border-b-2 z-30 border-b-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex justify-between w-full space-x-8">
                <Link
                  to="/"
                  className="flex items-center space-x-2 font-bold text-xl text-blue-600"
                >
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>HyperGro Forms</span>
                </Link>

                <nav className="flex space-x-1">
                  <Link
                    to="/create"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center"
                  >
                    <IoCreate className="mr-1.5 h-5 w-5 text-gray-500" />
                    Create Form
                  </Link>
                  <Link
                    to="/forms"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center"
                  >
                    <MdOutlineInsertDriveFile className="mr-1.5 h-5 w-5 text-gray-500" />
                    My Forms
                  </Link>
                  <Link
                    to="/templates"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center"
                  >
                    <MdDashboard className="mr-1.5 h-5 w-5 text-gray-500" />
                    Templates
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="h-[calc(100vh-64px)]">
          <Outlet />
        </main>

        <Scripts />
      </body>
    </html>
  );
}
