import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useEquipment } from "../contexts/EquipmentContext";
import { useAuth } from "../contexts/AuthContext";
import { useRentals } from "../contexts/RentalsContext";
import MainLayout from "../components/Layout/MainLayout";

const categories = [
  "Heavy Machinery",
  "Construction",
  "Power Tools",
  "Safety Equipment",
  "Other",
];

const conditions = ["Excellent", "Good", "Fair", "Poor"];
const statuses = ["Available", "Rented", "Maintenance", "Out of Service"];

export default function EquipmentPage() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } =
    useEquipment();
  const { user } = useAuth();
  const { rentals } = useRentals();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    condition: "",
    status: "",
  });
  const [detailItem, setDetailItem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setFormData({
      name: "",
      category: "",
      condition: "",
      status: "",
    });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      condition: item.condition,
      status: item.status,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateEquipment(editItem.id, formData);
    } else {
      addEquipment(formData);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      deleteEquipment(id);
    }
  };

  const handleViewDetails = (item) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setDetailItem(null);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "condition", headerName: "Condition", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "viewDetails",
      headerName: "View Details",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewDetails(params.row)}
        >
          View Details
        </Button>
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
      <Box sx={{ height: 600, width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Equipment Management
          </Typography>
          {(user?.role === "Admin" || user?.role === "Staff") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Add Equipment
            </Button>
          )}
        </Box>

        <DataGrid
          rows={equipment}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />

        {(user?.role === "Admin" || user?.role === "Staff") && (
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {editItem ? "Edit Equipment" : "Add New Equipment"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TextField
                select
                margin="dense"
                label="Category"
                fullWidth
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                margin="dense"
                label="Condition"
                fullWidth
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
              >
                {conditions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                margin="dense"
                label="Status"
                fullWidth
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                {statuses.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editItem ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        )}

      //detail page 
        <Dialog
          open={detailOpen}
          onClose={handleDetailClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Equipment Details</DialogTitle>
          <DialogContent>
            {detailItem && (
              <Box>
                <Typography variant="h6">{detailItem.name}</Typography>
                <Typography>Category: {detailItem.category}</Typography>
                <Typography>Condition: {detailItem.condition}</Typography>
                <Typography>Status: {detailItem.status}</Typography>
                <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                  Rental History:
                </Typography>
                {rentals.filter((r) => r.equipmentId === detailItem.id)
                  .length === 0 ? (
                  <Typography>No rental history.</Typography>
                ) : (
                  <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                    {rentals
                      .filter((r) => r.equipmentId === detailItem.id)
                      .map((rental) => (
                        <Box
                          key={rental.id}
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #eee",
                            borderRadius: 1,
                          }}
                        >
                          <Typography>
                            Customer: {rental.customerName}
                          </Typography>
                          <Typography>Status: {rental.status}</Typography>
                          <Typography>
                            From: {rental.startDate} To: {rental.endDate}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </MainLayout>
  );
}
