import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Link from "./pages/Link";
import RedirectLink from "./pages/RedirectLink";
import AppLayout from "./layout/AppLayout";
import UrlProvider from "./context";
import RequiredAuth from "./components/ui/require-auth";

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/dashboard",
          element: <RequiredAuth><Dashboard /></RequiredAuth>
        },
        {
          path: "/link/:id",
          element: <RequiredAuth><Link /></RequiredAuth>
        },
        {
          path: "/:id",
          element: <RedirectLink />,
        },
      ],
    },
  ]);

  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
