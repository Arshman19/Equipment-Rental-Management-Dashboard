import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useRentals } from "../../contexts/RentalsContext";
import { useState } from "react";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function RentalCalendar() {
  const { rentals } = useRentals();
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rentalsOnDate, setRentalsOnDate] = useState([]);

  // rentals to calendar events
  const events = rentals.map((rental) => ({
    id: rental.id,
    title: `${rental.equipmentName} - ${rental.customerName}`,
    start: new Date(rental.startDate),
    end: new Date(rental.endDate),
    resource: rental,
  }));

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: "#1976d2",
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };


    switch (event.resource.status) {
      case "Reserved":
        style.backgroundColor = "#ff9800";
        break;
      case "Active":
        style.backgroundColor = "#4caf50";
        break;
      case "Completed":
        style.backgroundColor = "#9e9e9e";
        break;
      case "Cancelled":
        style.backgroundColor = "#f44336";
        break;
      default:
        break;
    }

    return {
      style,
    };
  };

  const handleSelectSlot = (slotInfo) => {
    const clickedDate = slotInfo.start;
  
    const filtered = rentals.filter((rental) => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      
      return clickedDate >= start && clickedDate <= end;
    });
    setSelectedDate(clickedDate);
    setRentalsOnDate(filtered);
    setOpenDialog(true);
  };

  return (
    <Paper sx={{ p: 2, height: "calc(100vh - 200px)" }}>
      <Typography variant="h6" gutterBottom>
        Rental Calendar
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={(event) => `
          Equipment: ${event.resource.equipmentName}
          Customer: ${event.resource.customerName}
          Status: ${event.resource.status}
        `}
        views={["month", "week"]}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Rentals on {selectedDate ? selectedDate.toDateString() : ""}
        </DialogTitle>
        <DialogContent>
          {rentalsOnDate.length === 0 ? (
            <Typography>No rentals scheduled on this day.</Typography>
          ) : (
            <List>
              {rentalsOnDate.map((rental) => (
                <ListItem key={rental.id}>
                  <ListItemText
                    primary={`${rental.equipmentName} - ${rental.customerName}`}
                    secondary={`Status: ${rental.status} | ${rental.startDate} to ${rental.endDate}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
