import { createContext, useContext, useState, useEffect } from "react";
import { useNotifications } from "./NotificationContext";

const RentalsContext = createContext(null);

const INITIAL_RENTALS = [
  {
    id: "r1",
    equipmentName: "Excavator",
    customerName: "Arsh",
    startDate: "2025-06-7",
    endDate: "2025-06-14",
    status: "Rented",
  },
  {
    id: "r2",
    equipmentName: "Concrete Mixer",
    customerName: "Kavya",
    startDate: "2025-07-20",
    endDate: "2025-07-25",
    status: "Reserved",
  },
];

export const RentalsProvider = ({ children }) => {
  const [rentals, setRentals] = useState([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const storedRentals = localStorage.getItem("rentals");
    if (storedRentals) {
      setRentals(JSON.parse(storedRentals));
    } else {
      setRentals(INITIAL_RENTALS);
      localStorage.setItem("rentals", JSON.stringify(INITIAL_RENTALS));
    }
  }, []);

  const addRental = (newRental) => {
    const rentalWithId = {
      ...newRental,
      id: `r${Date.now()}`,
    };
    const updatedRentals = [...rentals, rentalWithId];
    setRentals(updatedRentals);
    localStorage.setItem("rentals", JSON.stringify(updatedRentals));

    addNotification({
      type: "info",
      message: `New rental created for ${rentalWithId.equipmentName} for Customer named ${rentalWithId.customerName}`,
    });

    return rentalWithId;
  };

  const updateRental = (id, updatedData) => {
    const updatedRentals = rentals.map((rental) => {
      if (rental.id === id) {
        if (rental.status !== "Returned" && updatedData.status === "Returned") {
          addNotification({
            type: "success",
            message: `Rental for ${rental.equipmentName} has been returned by ${rental.customerName}`,
          });
        }
        return { ...rental, ...updatedData };
      }
      return rental;
    });
    setRentals(updatedRentals);
    localStorage.setItem("rentals", JSON.stringify(updatedRentals));
  };

  const deleteRental = (id) => {
    const updatedRentals = rentals.filter((rental) => rental.id !== id);
    setRentals(updatedRentals);
    localStorage.setItem("rentals", JSON.stringify(updatedRentals));
  };

  const getRentalById = (id) => {
    return rentals.find((rental) => rental.id === id);
  };

  const getRentalsByEquipmentId = (equipmentId) => {
    return rentals.filter((rental) => rental.equipmentId === equipmentId);
  };

  const getRentalsByCustomerId = (customerId) => {
    return rentals.filter((rental) => rental.customerId === customerId);
  };

  const getActiveRentals = () => {
    return rentals.filter((rental) => rental.status === "Active");
  };

  const value = {
    rentals,
    addRental,
    updateRental,
    deleteRental,
    getRentalById,
    getRentalsByEquipmentId,
    getRentalsByCustomerId,
    getActiveRentals,
  };

  return (
    <RentalsContext.Provider value={value}>{children}</RentalsContext.Provider>
  );
};

export const useRentals = () => {
  const context = useContext(RentalsContext);
  if (!context) {
    throw new Error("useRentals must be used within a RentalsProvider");
  }
  return context;
};
