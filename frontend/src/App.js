import {Routes, Route} from 'react-router-dom'
import MainBoard from './pages/MainBoard';
import './css/Global.css'

function App() {
  return (
    <Routes>
      <Route index element={<MainBoard />} />
    </Routes>
  );
}

export default App;
