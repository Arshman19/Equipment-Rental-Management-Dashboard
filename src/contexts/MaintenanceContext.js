import { createContext, useContext, useState, useEffect } from "react";
import { useNotifications } from "./NotificationContext";

const MaintenanceContext = createContext(null);


const INITIAL_MAINTENANCE = [
  {
    id: "m1",
  
    equipmentName: "Excavator",
    date: "2025-05-20",
    type: "Routine Check",
  
    notes: "No issues found",

  },
  
  {
    id: "m2",
    equipmentName: "Concrete Pump",
    date: "2025-06-12",
    type: "Emergency Repair",
    notes: "Leakage in the hydraulic system",
  },
  {
    id: "m3",
    equipmentName: "Safety Helmet",
    date: "2025-07-10",
    type: "Routine Check",
    notes: "No issues found",
  },
];

export const MaintenanceProvider = ({ children }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
  
    const storedRecords = localStorage.getItem("maintenanceRecords");
    if (storedRecords) {
      setMaintenanceRecords(JSON.parse(storedRecords));
    } else {
      setMaintenanceRecords(INITIAL_MAINTENANCE);
      localStorage.setItem(
        "maintenanceRecords",
        JSON.stringify(INITIAL_MAINTENANCE)
      );
    }
  }, []);

  const addMaintenanceRecord = (newRecord) => {
    const recordWithId = {
      ...newRecord,
      id: `m${Date.now()}`,
    };
    const updatedRecords = [...maintenanceRecords, recordWithId];
    setMaintenanceRecords(updatedRecords);
    localStorage.setItem("maintenanceRecords", JSON.stringify(updatedRecords));

    
    if (recordWithId.status === "Scheduled") {
      addNotification({
        type: "info",
        message: `Maintenance scheduled for ${recordWithId.equipmentName} on ${recordWithId.date}`,
      });
    }

    return recordWithId;
  };

  const updateMaintenanceRecord = (id, updatedData) => {
    const updatedRecords = maintenanceRecords.map((record) => {
      if (record.id === id) {
        
        if (
          record.status !== "Scheduled" &&
          updatedData.status === "Scheduled"
        ) {
          addNotification({
            type: "info",
            message: `Maintenance rescheduled for ${record.equipmentName} on ${
              updatedData.date || record.date
            }`,
          });
        }
        return { ...record, ...updatedData };
      }
      return record;
    });
    setMaintenanceRecords(updatedRecords);
    localStorage.setItem("maintenanceRecords", JSON.stringify(updatedRecords));
  };

  const deleteMaintenanceRecord = (id) => {
    const updatedRecords = maintenanceRecords.filter(
      (record) => record.id !== id
    );
    setMaintenanceRecords(updatedRecords);
    localStorage.setItem("maintenanceRecords", JSON.stringify(updatedRecords));
  };

  const getMaintenanceById = (id) => {
    return maintenanceRecords.find((record) => record.id === id);
  };

  const getMaintenanceByEquipmentId = (equipmentId) => {
    return maintenanceRecords.filter(
      (record) => record.equipmentId === equipmentId
    );
  };

  const getUpcomingMaintenance = () => {
    const today = new Date();
    return maintenanceRecords.filter((record) => {
      const maintenanceDate = new Date(record.date);
      return maintenanceDate >= today;
    });
  };

  const value = {
    maintenanceRecords,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    getMaintenanceById,
    getMaintenanceByEquipmentId,
    getUpcomingMaintenance,
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
};
