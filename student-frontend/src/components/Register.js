import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Grid, Container } from "@mui/material";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^(0\d{9})$/.test(phone)) {
      errors.phone =
        "Invalid phone number format (starts with 0, followed by 9 digits)";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "Password must contain at least 8 characters, one letter, one number, and one special character";
    }
    if (!age.trim()) {
      errors.age = "Age is required";
    } else if (isNaN(age) || age <= 0) {
      errors.age = "Age must be a valid positive number";
    }
    if (!gender.trim()) {
      errors.gender = "Gender is required";
    }
    if (!address.trim()) {
      errors.address = "Address is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData = {
      name,
      email,
      password,
      age,
      gender,
      phone,
      address,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/student/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error occurred during registration";
      setMessage(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Age"
              type="number"
              fullWidth
              variant="outlined"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              error={Boolean(errors.age)}
              helperText={errors.age}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Gender"
              fullWidth
              variant="outlined"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              error={Boolean(errors.gender)}
              helperText={errors.gender}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={Boolean(errors.address)}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
      {message && (
        <Typography variant="body2" color="error" align="center" mt={2}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Register;
