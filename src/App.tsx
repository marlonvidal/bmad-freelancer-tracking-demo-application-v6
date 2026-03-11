import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Board from './pages/Board';
import Revenue from './pages/Revenue';
import Settings from './pages/Settings';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
