
import './index.css'
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/notificationContext.jsx";
import AppRoutes from "./routes/approutes";
import ReactDOM from "react-dom/client";


ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
);
