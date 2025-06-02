import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  Inventory as InventoryIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useEquipment } from "../../contexts/EquipmentContext";
import { useMaintenance } from "../../contexts/MaintenanceContext";
import { useRentals } from "../../contexts/RentalsContext";

export default function KPICards() {
  const { equipment } = useEquipment();
  const { maintenanceRecords } = useMaintenance();
  const { rentals } = useRentals();

  // kpis ki calculation
  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(
    (item) => item.status === "Available"
  ).length;
  const maintenanceEquipment = maintenanceRecords.length;
  const rentedEquipment = rentals.filter((r) => r.status === "Rented").length;

  // Overdue rentals: endDate < today and not returned
  const today = new Date();
  const overdueRentals = rentals.filter((r) => {
    const end = new Date(r.endDate);
    return end < today && r.status !== "Returned";
  }).length;

  // Upcoming maintenance: date >= today
  const upcomingMaintenance = maintenanceRecords.filter((m) => {
    const date = new Date(m.date);
    return date >= today;
  }).length;

  const kpiData = [
    {
      title: "Total Equipment",
      value: totalEquipment,
      icon: <InventoryIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      color: "#1976d2",
    },
    {
      title: "Available Equipment",
      value: availableEquipment,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#2e7d32" }} />,
      color: "#2e7d32",
    },
    {
      title: "Upcoming Maintenance",
      value: upcomingMaintenance,
      icon: <BuildIcon sx={{ fontSize: 40, color: "#ed6c02" }} />,
      color: "#ed6c02",
    },
    {
      title: "Overdue Rentals",
      value: overdueRentals,
      icon: <WarningIcon sx={{ fontSize: 40, color: "#9c27b0" }} />,
      color: "#9c27b0",
    },
  ];

  return (
    <Grid container spacing={3}>
      {kpiData.map((kpi, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {kpi.title}
                  </Typography>
                </Box>
                {kpi.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
