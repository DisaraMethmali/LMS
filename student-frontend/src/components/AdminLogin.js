import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { orange } from "@mui/material/colors";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Both email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/admin/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, role } = response.data;

      if (role !== "admin") {
        setMessage("Access denied. This login is for administrators only.");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", token);
      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      if (!error.response) {
        setMessage("Network error. Please try again later.");
      } else {
        setMessage(error.response?.data?.message || "An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        width: { xs: 300, sm: 400 },
        margin: "auto",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Admin Login
      </Typography>

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 0 }}
        />
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          sx={{ marginLeft: -6 }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Box>

      {message && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          {message}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          marginTop: 3,
          backgroundColor: orange[500],
          "&:hover": {
            backgroundColor: orange[700],
          },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
      </Button>
    </Box>
  );
};

export default AdminLogin;
