import { createContext, useContext, useState, useEffect } from "react";

const EquipmentContext = createContext(null);


const INITIAL_EQUIPMENT = [
  {
    id: "eq1",
    name: "Excavator",
    category: "Heavy Machinery",
    condition: "Good",
    status: "Available",
  },
  {
    id: "eq2",
    name: "Concrete Mixer",
    category: "Construction",
    condition: "Excellent",
    status: "Rented",
  },
  {
    id: "eq3",
    name: "Power Drill",
    category: "Power Tools",
    condition: "Fair",
    status: "Available",
  },
    {
      id: "eq4",
      name: "Safety Helmet",
      category: "Safety Equipment",
      condition: "Excellent",
      status: "Available",
    },
    {
      id: "eq5",
      name: "Concrete Pump",
      category: "Construction",
      condition: "Good",
      status: "Out of Service",
    },
];

export const EquipmentProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    
    const storedEquipment = localStorage.getItem("equipment");
    if (storedEquipment) {
      setEquipment(JSON.parse(storedEquipment));
    } else {
      setEquipment(INITIAL_EQUIPMENT);
      localStorage.setItem("equipment", JSON.stringify(INITIAL_EQUIPMENT));
    }
  }, []);

  const addEquipment = (newEquipment) => {
    const equipmentWithId = {
      ...newEquipment,
      id: `eq${Date.now()}`, 
    };
    const updatedEquipment = [...equipment, equipmentWithId];
    setEquipment(updatedEquipment);
    localStorage.setItem("equipment", JSON.stringify(updatedEquipment));
    return equipmentWithId;
  };

  const updateEquipment = (id, updatedData) => {
    const updatedEquipment = equipment.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    setEquipment(updatedEquipment);
    localStorage.setItem("equipment", JSON.stringify(updatedEquipment));
  };

  const deleteEquipment = (id) => {
    const updatedEquipment = equipment.filter((item) => item.id !== id);
    setEquipment(updatedEquipment);
    localStorage.setItem("equipment", JSON.stringify(updatedEquipment));
  };

  const getEquipmentById = (id) => {
    return equipment.find((item) => item.id === id);
  };

  const value = {
    equipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentById,
  };

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useEquipment must be used within an EquipmentProvider");
  }
  return context;
};
