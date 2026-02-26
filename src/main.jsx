
import './index.css'
import { AuthProvider } from "./context/AuthContext.jsx";
import AppRoutes from "./routes/approutes";
import ReactDOM from "react-dom/client";


ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
);
