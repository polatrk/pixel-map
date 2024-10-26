import {Routes, Route} from 'react-router-dom'
import MainBoard from './pages/MainBoard';
import './css/Global.css'
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route index element={<MainBoard />} />

      <Route path='admin'>
        <Route index element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
