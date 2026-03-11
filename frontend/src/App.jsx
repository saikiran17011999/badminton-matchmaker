import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import EventSetup from './pages/EventSetup';
import Dashboard from './pages/Dashboard';
import TimerPage from './pages/TimerPage';
import FeedbackPage from './pages/FeedbackPage';
import CombosPage from './pages/CombosPage';

function App() {
  return (
    <BrowserRouter>
      <EventProvider>
        <Routes>
          <Route path="/" element={<EventSetup />} />
          <Route path="/event/:eventId" element={<Dashboard />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/combos" element={<CombosPage />} />
        </Routes>
      </EventProvider>
    </BrowserRouter>
  );
}

export default App;
