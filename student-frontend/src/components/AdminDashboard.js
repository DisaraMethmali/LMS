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
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTheme } from "@mui/material/styles";

// Theme customization
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2", // Blue
    },
    secondary: {
      main: "#FF6F00", // Orange
    },
    background: {
      default: "#f5f5f5", // Light background
    },
    text: {
      primary: "#333333", // Dark text for readability
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontWeight: "bold",
    },
    body1: {
      fontSize: "16px",
    },
  },
});

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [course, setCourse] = useState({
    name: "",
    course_id: "",
    description: "",
    duration: 0,
  });
  const [openSidebar, setOpenSidebar] = useState(true); // Sidebar open state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend
    axios
      .get("http://127.0.0.1:5000/admin/dashboard")
      .then((response) => {
        setStudents(response.data.students);
        setCourses(response.data.courses);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddCourse = async () => {
    const data = {
      course_id: course.course_id,
      name: course.name,
      description: course.description,
      duration: course.duration,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/admin/addcourse",
        data
      );
      setCourses((prevCourses) => [...prevCourses, response.data.course]);
      setCourse({ name: "", course_id: "", description: "", duration: 0 });
    } catch (error) {
      console.error("Error adding course:", error);
    }
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
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Drawer
          open={openSidebar}
          variant="persistent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              backgroundColor: "#1976D2",
              color: "#ffffff",
              borderRight: "none",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", bgcolor: "#1565C0" }}>
            <Typography variant="h6">Admin Panel</Typography>
          </Box>
          <List>
            <ListItem button onClick={() => setActiveTab(0)}>
              <DashboardIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => setActiveTab(1)}>
              <SchoolIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Courses" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ExitToAppIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#f5f5f5",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setOpenSidebar(!openSidebar)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Admin Dashboard
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ mt: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {activeTab === 0 && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Dashboard Overview
                    </Typography>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                      <Box textAlign="center" sx={{ flex: 1 }}>
                        <Typography variant="h6">Total Students</Typography>
                        <Typography variant="h4">{students.length}</Typography>
                      </Box>
                      <Box textAlign="center" sx={{ flex: 1 }}>
                        <Typography variant="h6">Total Courses</Typography>
                        <Typography variant="h4">{courses.length}</Typography>
                      </Box>
                      <Box textAlign="center" sx={{ flex: 1 }}>
                        <Typography variant="h6">Total Enrollments</Typography>
                        <Typography variant="h4">
                          {courses.reduce((acc, course) => acc + course.enrollment_count, 0)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="h5" gutterBottom>
                      Student List
                    </Typography>
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
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
                            <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.age}</TableCell>
                              <TableCell>{student.gender}</TableCell>
                              <TableCell>{student.phone}</TableCell>
                              <TableCell>{student.address}</TableCell>
                              <TableCell>
                                {courses.map((course) => (
                                  <Button
                                    key={course.course_id}
                                    variant="outlined"
                                    onClick={() => handleEnroll(student._id, course.course_id)}
                                    sx={{ marginRight: 1 }}
                                  >
                                    Enroll in {course.name}
                                  </Button>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                {activeTab === 1 && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Course List
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Course</InputLabel>
                      <Select
                        value={course.course_id}
                        label="Course"
                        onChange={(e) => setCourse({ ...course, course_id: e.target.value })}
                      >
                        {courses.map((course) => (
                          <MenuItem key={course.course_id} value={course.course_id}>
                            {course.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="h6" gutterBottom>
                      Add New Course
                    </Typography>
                    <TextField
                      label="Course Name"
                      value={course.name}
                      onChange={(e) => setCourse({ ...course, name: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Course ID"
                      value={course.course_id}
                      onChange={(e) => setCourse({ ...course, course_id: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Description"
                      value={course.description}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Duration (days)"
                      type="number"
                      value={course.duration}
                      onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleAddCourse}>
                      Add Course
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
