import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppShell';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Book } from './pages/Book';
import { Confirmation } from './pages/Confirmation';
import { Admin } from './pages/Admin';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Catalog />} />
        <Route path="/book/:eventTypeId" element={<Book />} />
        <Route path="/book/:eventTypeId/confirm" element={<Confirmation />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AppLayout>
  );
}

export default App;