import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification, resetNotifications } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = login(email, password);
    if (success) {
      const welcomeNotification = [
        {
          id: `n${Date.now()}`,
          type: "info",
          message: "Welcome to Equipment Rental Management System",
          read: false,
          timestamp: new Date().toISOString(),
        },
      ];
      resetNotifications(welcomeNotification);
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            ENTNT Equipment Rental
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Sign In
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Demo Credentials:
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Admin: admin@entnt.in / admin123
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Staff: staff@entnt.in / staff123
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Customer: customer@entnt.in / cust123
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Customer (Arsh): arsh@entnt.in / arsh123
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
