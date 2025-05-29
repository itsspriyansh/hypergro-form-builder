import { Links, Meta, Outlet, Scripts, Link } from "@remix-run/react";
import "./app.css";

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <title>Form Builder</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Hypergro Form Builder</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><Link to="/builder" className="hover:underline">Builder</Link></li>
                <li><Link to="/forms" className="hover:underline">My Forms</Link></li>
                <li><Link to="/templates" className="hover:underline">Templates</Link></li>
              </ul>
            </nav>
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
