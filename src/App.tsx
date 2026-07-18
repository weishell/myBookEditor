import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from '@/components/Editor';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
