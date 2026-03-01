import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/axios";
import { AuthContext } from "../../context/AuthContext.js";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/login", form);
      
      if (res.data.data.user) {
        setUser(res.data.data.user);
        setSuccess("Login successful! Loading...");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
            >
              Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-center text-lg">Sign in to your account to continue</p>
          </div>
        
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}
        
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              <span className="font-semibold">Success:</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 font-semibold text-lg transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                Create one
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 space-y-2">
            <p>
              <a href="#" className="hover:text-gray-700 transition">Privacy Policy</a> · {" "}
              <a href="#" className="hover:text-gray-700 transition">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
