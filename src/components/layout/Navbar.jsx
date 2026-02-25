import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h2 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
            🏆 Auction Hub
          </h2>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-lg font-semibold">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition font-semibold"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
