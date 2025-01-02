import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    
    // Fetch student profile and courses
    axios
      .get(`http://127.0.0.1:5000/student/profile/${studentId}`)
      .then((response) => {
        setStudent(response.data.student);
        setEnrolledCourses(response.data.enrolled_courses);
      })
      .catch((error) => console.error("Error fetching student profile:", error));

    axios
      .get("http://127.0.0.1:5000/courses")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const handleEnroll = (courseId) => {
    const studentId = localStorage.getItem("studentId");

    axios
      .post("http://127.0.0.1:5000/student/enroll", {
        student_id: studentId,
        course_id: courseId,
      })
      .then((response) => {
        setEnrolledCourses([...enrolledCourses, response.data]);
      })
      .catch((error) => console.error("Error enrolling in course:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    navigate("/login");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>

      {/* Student Profile */}
      {student && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Student Profile</Typography>
          <Typography>Name: {student.name}</Typography>
          <Typography>Email: {student.email}</Typography>
          <Typography>Age: {student.age}</Typography>
          <Typography>Gender: {student.gender}</Typography>
          <Typography>Phone: {student.phone}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate(`/profile/edit/${student._id}`)}
            sx={{ mt: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      )}

      {/* Enrolled Courses */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Enrolled Courses
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Course ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrolledCourses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.course_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Available Courses */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Available Courses
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Course ID</TableCell>
                <TableCell>Enroll</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.course_id}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleEnroll(course.course_id)}
                    >
                      Enroll
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Logout Button */}
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 3 }}>
        Logout
      </Button>
    </Container>
  );
};

export default StudentDashboard;
