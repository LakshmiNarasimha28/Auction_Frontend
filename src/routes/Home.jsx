import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="py-12">
      <div className="text-center">
        {user ? (
          <>
            <h1 className="text-4xl font-bold mb-4">Welcome, {user.name}! 👋</h1>
            <p className="text-lg text-gray-600">
              You are logged in to Auction Hub. Start exploring auctions!
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">Welcome to Auction Hub</h1>
            <p className="text-lg text-gray-600 mb-8">
              Please login or register to get started
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                Login
              </a>
              <a href="/register" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                Register
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
