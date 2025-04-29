import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantVoting from './pages/RestaurantVoting';
import Ranking from './pages/Ranking';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute allowedRoles={['socio']}>
              <Restaurants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vote/:restaurantId"
          element={
            <ProtectedRoute allowedRoles={['socio']}>
              <RestaurantVoting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
