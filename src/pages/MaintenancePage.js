import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import MainLayout from "../components/Layout/MainLayout";
import MaintenanceForm from "../components/Maintenance/MaintenanceForm";
import { useMaintenance } from "../contexts/MaintenanceContext";
import { useAuth } from "../contexts/AuthContext";

export default function MaintenancePage() {
  const {
    maintenanceRecords,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    getUpcomingMaintenance,
  } = useMaintenance();
  const [openForm, setOpenForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { user } = useAuth();

  const handleOpenForm = () => {
    setSelectedRecord(null);
    setOpenForm(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this maintenance record?")
    ) {
      deleteMaintenanceRecord(id);
    }
  };

  const handleSubmit = (formData) => {
    if (selectedRecord) {
      updateMaintenanceRecord(selectedRecord.id, formData);
    } else {
      addMaintenanceRecord(formData);
    }
    setOpenForm(false);
  };

  const columns = [
    { field: "equipmentName", headerName: "Equipment Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "type", headerName: "Type of maintenance", flex: 1 },
    { field: "notes", headerName: "Notes", flex: 2 },
    ...(user?.role === "Admin" || user?.role === "Staff"
      ? [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
              <Box>
                <IconButton
                  onClick={() => handleEdit(params.row)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(params.row.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ),
          },
        ]
      : []),
  ];

  
  const upcomingMaintenance = getUpcomingMaintenance();

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Maintenance Management
          </Typography>
          {(user?.role === "Admin" || user?.role === "Staff") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              New Maintenance Record
            </Button>
          )}
        </Box>

        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Maintenance
                </Typography>
                <Grid container spacing={2}>
                  {upcomingMaintenance.map((record) => (
                    <Grid item xs={12} sm={6} md={4} key={record.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <BuildIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            {record.equipmentName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Date: {record.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type of maintenance: {record.type}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={maintenanceRecords}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Box>
        </Paper>

        {(user?.role === "Admin" || user?.role === "Staff") && (
          <MaintenanceForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            onSubmit={handleSubmit}
            initialData={selectedRecord}
          />
        )}
      </Box>
    </MainLayout>
  );
}
