import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const USERS = [
  {
    id: "1",
    role: "Admin",
    email: "admin@entnt.in",
    password: "admin123",
    name: "Admin",
  },
  {
    id: "2",
    role: "Staff",
    email: "staff@entnt.in",
    password: "staff123",
    name: "Staff",
  },
  {
    id: "3",
    role: "Customer",
    email: "customer@entnt.in",
    password: "cust123",
    name: "Pranav",
  },
  {
    id: "4",
    role: "Customer",
    email: "arsh@entnt.in",
    password: "arsh123",
    name: "Arsh",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    const foundUser = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const userInfo = { ...foundUser };
      delete userInfo.password;
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
