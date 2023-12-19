import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <div className="main-bg-gradient">
    <div
      className={
        "base-container pt-[6%] pb-20"
        + " md:pt-0 md:pb-0"
      }
    >
      <div className="shadow-md bg-white">
        <RouterProvider router={router} />
      </div>
    </div>
  </div>;
}

export default App;
