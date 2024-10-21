import {Routes, Route} from 'react-router-dom'
import Board from './pages/Board';
import './css/Global.css'

function App() {
  return (
    <Routes>
      <Route index element={<Board />} />
    </Routes>
  );
}

export default App;
