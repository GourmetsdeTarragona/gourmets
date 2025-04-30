import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantVoting from './pages/RestaurantVoting';
import Ranking from './pages/Ranking';
import AdminDashboard from './pages/AdminDashboard';
import RegisterUser from './pages/RegisterUser';
import CreateRestaurant from './pages/CreateRestaurant';
import AdminRestaurants from './pages/AdminRestaurants';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
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
          <Route
            path="/admin/register-user"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RegisterUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-restaurant"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateRestaurant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurantes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRestaurants />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
