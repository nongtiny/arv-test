import { createBrowserRouter } from 'react-router-dom';
import { IndexPage } from '../pages/index';
import { lazyLoad } from '../helpers/lazyLoad';

const LazyUserPage = lazyLoad('../pages/user', 'UserPage');

export const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <IndexPage />
  },
  {
    path: 'user/:userId',
    element: <LazyUserPage />
  }
]);
//   <Route
//     path="/"
//     element={<MainLayout />}
//   >
//     <Route
//       index
//       element={<IndexPage />}
//     />
//     <Route
//       path=":userId"
//       element={<LazyUserPage />}
//     />
//   </Route>
// );