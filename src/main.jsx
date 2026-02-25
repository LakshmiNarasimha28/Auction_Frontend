
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/approutes";
import ReactDOM from "react-dom/client";


ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
);
