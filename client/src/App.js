import {Routes, Route} from 'react-router-dom'
import MainBoard from './pages/MainBoard';
import './css/Global.css'
import Admin from './pages/Admin';
import ProtectedRoute from './pages/components/ProtectedRoute';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';
import VerifiedEmail from './pages/VerifiedEmail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColorProvider } from './utils/context/ColorContext';

function App() {
  return (
    <>
      <ToastContainer/>
      <Routes>
        
        <Route index element={
          <ColorProvider>
            <MainBoard />          
          </ColorProvider>
          } />

        <Route path="/verify" element={<VerifiedEmail />} />

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
    </>
  );
}

export default App;
