import {Routes, Route} from 'react-router-dom'
import MainBoard from './pages/MainBoard';
import './css/Global.css'
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route index element={<MainBoard />} />

      <Route path='admin'>
        <Route index element={<Admin />} />
      </Route>

      <Route path='login'>
        <Route index element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
