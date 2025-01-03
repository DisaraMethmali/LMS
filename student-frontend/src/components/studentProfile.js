import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";

const StudentProfile = () => {
  const { email } = useParams();
  const { user, isLoading } = useAuthContext();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      // Clear previous errors
      setError("");
      
      // Wait for auth to be ready
      if (isLoading) {
        return;
      }

      // Redirect if no user
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/student/profile/${email}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            // Add timeout and credentials
            timeout: 10000,
            withCredentials: true
          }
        );

        if (response.data) {
          setStudent(response.data);
        } else {
          setError('No data received from server');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response) {
          // Server responded with error
          if (err.response.status === 401) {
            setError('Please login again');
            navigate('/login');
          } else if (err.response.status === 404) {
            setError('Student not found');
          } else {
            setError(err.response.data?.message || 'Server error occurred');
          }
        } else if (err.request) {
          // Request made but no response
          setError('Unable to reach server. Please check your connection.');
        } else {
          // Something else went wrong
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user, isLoading, email, navigate]);

  // Loading state while waiting for auth
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Please log in to view this profile.</Alert>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Loading state while fetching data
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // No student data
  if (!student) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No student data found.</Alert>
      </Box>
    );
  }

  // Render student profile
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Student Profile
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong> {student.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {student.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Age:</strong> {student.age}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Gender:</strong> {student.gender}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Phone:</strong> {student.phone}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Address:</strong> {student.address}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentProfile;