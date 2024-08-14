import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import VerifyMail from "./pages/VerifyEmailPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContainer = styled.div`
  font-family: "Arial", sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/verify/:id" element={<VerifyMail />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;
