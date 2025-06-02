import { Box, Typography, Paper } from "@mui/material";
import MainLayout from "../components/Layout/MainLayout";
import KPICards from "../components/Dashboard/KPICards";
import DashboardCharts from "../components/Dashboard/DashboardCharts";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Welcome Message */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.role}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of our equipment rental management system
          </Typography>
        </Paper>

        
        <Box sx={{ mb: 3 }}>
          <KPICards />
        </Box>

        
        <Box>
          <DashboardCharts />
        </Box>
      </Box>
    </MainLayout>
  );
}
