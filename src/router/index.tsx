import { createBrowserRouter } from 'react-router-dom';
import { IndexPage } from '../pages/index';

export const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <IndexPage />
  },
  {
    path: 'user/:userId',
    async lazy() {
      const { UserPage, loadUser } = await import("../pages/user");
      return {
        loader: loadUser,
        Component: UserPage
      };
    },
  }
]);