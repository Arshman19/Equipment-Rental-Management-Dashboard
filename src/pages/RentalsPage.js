import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Tab,
  Tabs,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import MainLayout from "../components/Layout/MainLayout";
import RentalCalendar from "../components/Rentals/RentalCalendar";
import RentalForm from "../components/Rentals/RentalForm";
import { useRentals } from "../contexts/RentalsContext";
import { useAuth } from "../contexts/AuthContext";
import { useEquipment } from "../contexts/EquipmentContext";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ height: "100%" }}>
      {value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
    </div>
  );
}

const rentalStatuses = ["Reserved", "Rented", "Returned"];

export default function RentalsPage() {
  const { rentals, addRental, updateRental, deleteRental } = useRentals();
  const { user } = useAuth();
  const { equipment } = useEquipment();
  const [tabValue, setTabValue] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");

  // Dynamically get unique customer names and equipment names from rentals
  const customerOptions = useMemo(() => {
    const names = rentals.map((r) => r.customerName).filter(Boolean);
    return Array.from(new Set(names));
  }, [rentals]);
  const equipmentOptions = useMemo(() => {
    const names = rentals.map((r) => r.equipmentName).filter(Boolean);
    return Array.from(new Set(names));
  }, [rentals]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenForm = () => {
    setSelectedRental(null);
    setOpenForm(true);
  };

  const handleEdit = (rental) => {
    setSelectedRental(rental);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this rental?")) {
      deleteRental(id);
    }
  };

  const handleSubmit = (formData) => {
    if (selectedRental) {
      updateRental(selectedRental.id, formData);
    } else {
      addRental(formData);
    }
    setOpenForm(false);
  };

  let filteredRentals =
    user?.role === "Customer"
      ? rentals.filter(
          (rental) =>
            (rental.customerId && rental.customerId === user.id) ||
            (rental.customerName &&
              user.name &&
              rental.customerName.toLowerCase() === user.name.toLowerCase())
        )
      : rentals;
  if (statusFilter) {
    filteredRentals = filteredRentals.filter((r) => r.status === statusFilter);
  }
  if (customerFilter) {
    filteredRentals = filteredRentals.filter(
      (r) => r.customerName === customerFilter
    );
  }
  if (equipmentFilter) {
    filteredRentals = filteredRentals.filter(
      (r) => r.equipmentName === equipmentFilter
    );
  }

  const handleStatusChange = (id, newStatus) => {
    updateRental(id, { status: newStatus });
  };

  const columns = [
    { field: "equipmentName", headerName: "Equipment", flex: 1 },
    { field: "customerName", headerName: "Customer", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) =>
        user?.role === "Admin" || user?.role === "Staff" ? (
          <select
            value={params.value}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            style={{ width: "100%" }}
          >
            {rentalStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          params.value
        ),
    },
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

  return (
    <MainLayout>
      <Box sx={{ height: "calc(100vh - 100px)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" component="h1">
            Rental Management
          </Typography>
          {(user?.role === "Admin" || user?.role === "Staff") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              New Rental
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: 8 }}
          >
            <option value="">All Statuses</option>
            {rentalStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            style={{ padding: 8 }}
          >
            <option value="">All Customers</option>
            {customerOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            style={{ padding: 8 }}
          >
            <option value="">All Equipment</option>
            {equipmentOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Box>

        <Paper sx={{ width: "100%", height: "calc(100% - 50px)" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Calendar View" />
            <Tab label="List View" />
          </Tabs>

          <Box sx={{ height: "calc(100% - 48px)", p: 2 }}>
            <TabPanel value={tabValue} index={0}>
              <RentalCalendar />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <DataGrid
                rows={filteredRentals}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              />
            </TabPanel>
          </Box>
        </Paper>

        {(user?.role === "Admin" || user?.role === "Staff") && (
          <RentalForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            onSubmit={handleSubmit}
            initialData={selectedRental}
          />
        )}
      </Box>
    </MainLayout>
  );
}
