import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import { EquipmentProvider } from "./contexts/EquipmentContext";
import { RentalsProvider } from "./contexts/RentalsContext";
import { MaintenanceProvider } from "./contexts/MaintenanceContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

//pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EquipmentPage from "./pages/EquipmentPage";
import RentalsPage from "./pages/RentalsPage";
import MaintenancePage from "./pages/MaintenancePage";

// theme ka code
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});


const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <EquipmentProvider>
            <RentalsProvider>
              <MaintenanceProvider>
                <Router>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/equipment"
                      element={
                        <ProtectedRoute>
                          <EquipmentPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/rentals"
                      element={
                        <ProtectedRoute>
                          <RentalsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/maintenance"
                      element={
                        <ProtectedRoute>
                          <MaintenancePage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Router>
              </MaintenanceProvider>
            </RentalsProvider>
          </EquipmentProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
