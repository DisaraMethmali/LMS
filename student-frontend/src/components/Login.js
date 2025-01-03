import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button, TextField, Box, Typography, Checkbox, FormControlLabel, CircularProgress, IconButton } from "@mui/material";
import { orange, blue } from "@mui/material/colors";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Both email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/student/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      dispatch({ type: "LOGIN", payload: response.data });

      setMessage("Login successful!");

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate(`/student/profile/${email}`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
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
        width: 400,
        margin: "auto",
        backgroundColor: "white",
       
      }}
    >
      {/* Login Header */}
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Login
      </Typography>

      {/* Email Field */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Password Field with Show Password Toggle */}
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
          sx={{ marginLeft: -6}}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Box>

      {/* Error Message */}
      {message && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          {message}
        </Typography>
      )}

      {/* Remember Me and Forgot Password */}
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label="Remember me"
        />
        <Typography variant="body2" color="primary">
          <a href="/forgotpassword" style={{ textDecoration: "none" }}>Forgot Password?</a>
        </Typography>
      </Box>

      {/* Sign In Button */}
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

      {/* Social Login Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
  <Button
    variant="outlined"
    color="primary"
    sx={{
      borderColor: "transparent",  // Makes the border transparent
      color: blue[500],
      "&:hover": {
        backgroundColor: "transparent",  // Keeps the background transparent on hover
      },
      marginRight: 2,
    }}
  >
   

          {/* Google SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" viewBox="0 0 512 512">
            <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" />
            <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" />
            <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" />
            <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" />
            <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.051-84.051c0-54.27-88.712-118.545-218.496-63.075l60 60c45.953-21.152 94.573 43.516 121.72 76.52 4.269 3.34 4.697 5.67 2.484 8.904z" />
          </svg>
        </Button>
      </Box>

      {/* Registration Link */}
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Are you not registered?{" "}
        <a href="/register" style={{ textDecoration: "none", color: blue[500] }}>
          Sign up here
        </a>
      </Typography>
    </Box>
  );
};

export default Login;


