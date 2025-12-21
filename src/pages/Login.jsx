import "../styles/global.css";
import "../styles/components.css";
import "../styles/auth.css";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔥 CHANGE: email -> identifier
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(identifier, password);

    const role = JSON.parse(localStorage.getItem("user")).role;
    navigate(role === "ADMIN" ? "/admin" : "/customer");
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2>Login</h2>

        {/* 🔥 Email OR Mobile Number */}
        <input
          className="input"
          placeholder="Email or Mobile Number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleSubmit}>
          Login
        </button>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
