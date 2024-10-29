import {Routes, Route} from 'react-router-dom'
import MainBoard from './pages/MainBoard';
import './css/Global.css'
import Admin from './pages/Admin';
import ProtectedRoute from './pages/components/ProtectedRoute';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route index element={<MainBoard />} />

      <Route path='admin'>
          <Route index element={
              <ProtectedRoute requiredRole='admin'>
                <Admin />
              </ProtectedRoute>
            } />
      </Route>

      <Route path='forbidden'>
          <Route index element={<Forbidden />} />
      </Route>

      <Route path='*' element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
