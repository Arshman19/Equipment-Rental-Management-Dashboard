

import { useState } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNotifications } from "../../contexts/NotificationContext";

export default function NotificationCenter() {
  const {
    notifications,
    dismissNotification,
    clearAllNotifications,
    getUnreadCount,
  } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDismiss = (id) => {
    dismissNotification(id);
  };

  const open = Boolean(anchorEl);
  const unreadCount = getUnreadCount();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ width: 360, maxHeight: 500 }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Notifications</Typography>
            {notifications.length > 0 && (
              <Button size="small" onClick={clearAllNotifications}>
                Mark all as read
              </Button>
            )}
          </Box>
          <Divider />
          <List sx={{ maxHeight: 400, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.read ? "transparent" : "action.hover",
                  }}
                  secondaryAction={
                    !notification.read && (
                      <IconButton
                        edge="end"
                        aria-label="dismiss"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={formatTimestamp(notification.timestamp)}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>
    </>
  );
}
