import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login'
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageBooks from './pages/Admin/ManageBooks';
import ManageStudents from './pages/Admin/ManageStudents';
import ReturnBooks from './pages/Admin/ReturnBooks';
import StudentDashboard from './pages/Student/StudentDashboard';
import IssueBooks from './pages/Admin/IssueBooks';
import ProtectedRoute from './components/ProtectedRoute';
import MyBooks from './pages/Student/MyBooks';
import History from './pages/Student/History';
import Profile from './pages/Student/Profile';

function App() {

  return (
      <Routes>
    
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>} />
        <Route path="/managebooks" element={<ProtectedRoute role='admin'><ManageBooks /></ProtectedRoute>} />
        <Route path="/managestudents" element={<ProtectedRoute role='admin'><ManageStudents /></ProtectedRoute>} />
        <Route path="/issue" element={<ProtectedRoute role='admin'><IssueBooks /></ProtectedRoute>} />
        <Route path="/returnbook" element={<ProtectedRoute role='admin'><ReturnBooks /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute role='student'><StudentDashboard /></ProtectedRoute>} />
        <Route path="/mybooks" element={<ProtectedRoute role='student'><MyBooks /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute role='student'><History /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role='student'><Profile /></ProtectedRoute>} />
            
      </Routes>
       ) ;
}

      export default App
