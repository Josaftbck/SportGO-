import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LOG/Login';
import DashboardApp from './components/DashboardApp';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirección de "/" a "/login" */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login público */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard protegido */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
