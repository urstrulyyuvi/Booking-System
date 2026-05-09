import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext.jsx';
import Navbar from './components/Navbar.jsx';
import ExpertListing from './pages/ExpertListing.jsx';
import ExpertDetail from './pages/ExpertDetail.jsx';
import BookingForm from './pages/BookingForm.jsx';
import MyBookings from './pages/MyBookings.jsx';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ExpertListing />} />
              <Route path="/experts/:id" element={<ExpertDetail />} />
              <Route path="/book/:id" element={<BookingForm />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
