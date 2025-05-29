import React from "react";
import { Link } from "@remix-run/react";

export default function PageLayout({ children, title, description, actions }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {(title || description || actions) && (
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fadeIn">
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
              </div>

              {actions && (
                <div className="mt-4 sm:mt-0 flex space-x-3">{actions}</div>
              )}
            </div>
          )}

          <div className="animate-fadeIn">{children}</div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center text-gray-500 text-sm">
            <span>© 2023 HyperGro Forms</span>
            <span className="mx-2">•</span>
            <Link
              to="/privacy"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Privacy
            </Link>
            <span className="mx-2">•</span>
            <Link
              to="/terms"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
