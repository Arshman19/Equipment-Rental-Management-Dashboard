Here check out the [Live Demo!](https://arshman19.github.io/Equipment-Rental-Management-Dashboard/)



A React-based dashboard for managing equipment inventory, rental orders, and maintenance records, designed for technical assignment requirements. The app features user authentication (simulated), CRUD operations, a calendar view, notifications, KPIs, and localStorage-based persistence.

---

## 🚀 Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/arshman19/Equipment-Rental-Management-Dashboard.git
   cd Equipment-Rental-Management-Dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```
   Ensure the `homepage` field in `package.json` is set to your GitHub Pages URL.

---

## 🏗️ Architecture Overview

- **React (JavaScript, Create React App):** Main framework for building the SPA.
- **Material-UI (MUI):** For UI components and theming.
- **Context API:** For global state management (authentication, equipment, rentals, maintenance, notifications, theme).
- **localStorage:** For persisting data between sessions.
- **Routing:** Managed with `react-router-dom` (using `HashRouter` for GitHub Pages compatibility).

### **Key Folders & Files**

- `src/contexts/`: Context providers for Auth, Equipment, Rentals, Maintenance, Notifications, and Theme.
- `src/components/`: Reusable UI components, organized by feature (Dashboard, Layout, Rentals, Maintenance, Notifications, Feedback).
- `src/pages/`: Main page components for Dashboard, Equipment, Rentals, Maintenance, and Login.
- `src/components/Layout/MainLayout.js`: App shell with navigation and layout.
- `src/components/Dashboard/`: KPI cards and charts for the dashboard.
- `public/`: Static assets, manifest, and favicon.

### **Main Providers Hierarchy**

```jsx
<ThemeProvider>
  <AuthProvider>
    <NotificationProvider>
      <EquipmentProvider>
        <RentalsProvider>
          <MaintenanceProvider>
            <Router>{/* Routes */}</Router>
          </MaintenanceProvider>
        </RentalsProvider>
      </EquipmentProvider>
    </NotificationProvider>
  </AuthProvider>
</ThemeProvider>
```

### **Routing**

- `/login`: Login page (simulated authentication)
- `/`: Dashboard (KPIs, charts)
- `/equipment`: Equipment inventory management
- `/rentals`: Rental orders and calendar view
- `/maintenance`: Maintenance records

---

## ⚙️ Technical Decisions

- **No TypeScript:** The project uses JavaScript for simplicity and speed.
- **Material-UI:** Chosen for rapid UI development and built-in theming.
- **Context API over Redux:** Context is sufficient for the app's state needs and keeps dependencies minimal.
- **localStorage:** Used for persistence to avoid backend complexity.
- **HashRouter:** Used instead of BrowserRouter to ensure routing works on GitHub Pages.
- **Component Organization:** Features are separated into folders for maintainability.
- **Theme Toggle:** Implemented via a custom ThemeContext and MUI theming.
- **Notification System:** Built with a NotificationContext and a NotificationCenter component.

---

## 🐞 Known Issues & Limitations

- **Blank Screen on GitHub Pages:** If you see a blank screen after deployment, check the browser console for JavaScript errors. Common causes:
  - Incorrect `homepage` in `package.json`
  - Build errors or missing files
  - Routing issues (HashRouter is required for GitHub Pages)
- **PWA Warnings:** The browser may warn about missing PWA screenshots or favicon sizes. These do not affect core functionality.
- **No Real Backend:** All data is stored in localStorage; refreshing or clearing browser storage will reset the app.


---

## 📚 Further Improvements

- Add real authentication and backend integration.
- Implement automated tests.
- Enhance accessibility and mobile responsiveness.
- Add user roles and permissions.



