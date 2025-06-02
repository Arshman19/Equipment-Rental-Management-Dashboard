import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useEquipment } from "../../contexts/EquipmentContext";
import { useAuth } from "../../contexts/AuthContext";

const rentalStatuses = ["Reserved", "Rented", "Returned"];

export default function RentalForm({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const { equipment } = useEquipment();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    equipmentId: "",
    customerId: user?.role === "Customer" ? user.id : "",
    customerName: user?.role === "Customer" ? user.name : "",
    startDate: "",
    endDate: "",
    status: "Reserved",
    equipmentName: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "equipmentId") {
        const selectedEquipment = equipment.find((eq) => eq.id === value);
        return {
          ...prev,
          [name]: value,
          equipmentName: selectedEquipment ? selectedEquipment.name : "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  
  const availableEquipment = equipment.filter(
    (eq) => eq.status === "Available" || eq.id === initialData?.equipmentId
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Rental" : "Create New Rental"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Equipment"
                name="equipmentId"
                value={formData.equipmentId}
                onChange={handleChange}
                required
              >
                {availableEquipment.map((eq) => (
                  <MenuItem key={eq.id} value={eq.id}>
                    {eq.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {user?.role !== "Customer" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {(user?.role === "Admin" || user?.role === "Staff") && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {rentalStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
