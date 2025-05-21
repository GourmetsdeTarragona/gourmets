import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantVoting from './pages/RestaurantVoting';
import Ranking from './pages/Ranking';
import Explorar from './pages/Explorar'; // ✅ Nueva pantalla para invitados

import AdminDashboard from './pages/AdminDashboard';
import RegisterUser from './pages/RegisterUser';
import CreateRestaurant from './pages/CreateRestaurant';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminRestaurantDetail from './pages/AdminRestaurantDetail';

import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/explorar" element={<Explore />} /> {/* ✅ Nueva ruta para invitados */}

          {/* Rutas protegidas para socios */}
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

          {/* Rutas protegidas para administradores */}
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
          <Route
            path="/admin/restaurante/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRestaurantDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

