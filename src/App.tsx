import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import './App.css';

function App() {

  return <div className="main-bg-gradient">
    <div className="base-container">
      <div className="shadow-md bg-white">
        <RouterProvider router={router} />
      </div>
    </div>
  </div>;
}

export default App;
