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
  TextField,
  Tab,
  Tabs,
} from "@mui/material";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [newCourse, setNewCourse] = useState({ name: "", course_id: "", description: "", duration: 0 });

  useEffect(() => {
    // Fetch data from the backend
    axios
      .get("http://127.0.0.1:5000/admin/dashboard")
      .then((response) => {
        setStudents(response.data.students);
        setCourses(response.data.courses);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddCourse = () => {
    axios
      .post("http://127.0.0.1:5000/admin/add_course", newCourse)
      .then((response) => {
        setCourses([...courses, response.data]);
        setNewCourse({ name: "", course_id: "", description: "", duration: 0 });
      })
      .catch((error) => console.error("Error adding course:", error));
  };

  const handleEnroll = (studentId, courseId) => {
    axios
      .post("http://127.0.0.1:5000/enroll", { student_id: studentId, course_id: courseId })
      .then((response) => {
        console.log("Student enrolled successfully", response);
      })
      .catch((error) => console.error("Error enrolling student:", error));
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin dashboard tabs">
        <Tab label="Students" />
        <Tab label="Courses" />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>Student List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Enroll</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.address}</TableCell>
                    <TableCell>
                      {courses.map((course) => (
                        <Button key={course.course_id} onClick={() => handleEnroll(student._id, course.course_id)}>
                          Enroll in {course.name}
                        </Button>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>Course List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Course ID</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Duration (days)</TableCell>
                  <TableCell>Enrollment Count</TableCell>
                  <TableCell>Enrolled Students</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.course_id}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>{course.enrollment_count}</TableCell>
                    <TableCell>
                      {course.enrolled_students?.map((student) => (
                        <div key={student.email}>{student.name} ({student.email})</div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Admin Add Course Form */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>Add New Course</Typography>
        <TextField
          label="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Course ID"
          value={newCourse.course_id}
          onChange={(e) => setNewCourse({ ...newCourse, course_id: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Duration (days)"
          type="number"
          value={newCourse.duration}
          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAddCourse}>Add Course</Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
