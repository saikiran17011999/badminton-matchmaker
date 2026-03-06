import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import EventSetup from './pages/EventSetup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <EventProvider>
        <Routes>
          <Route path="/" element={<EventSetup />} />
          <Route path="/event/:eventId" element={<Dashboard />} />
        </Routes>
      </EventProvider>
    </BrowserRouter>
  );
}

export default App;
