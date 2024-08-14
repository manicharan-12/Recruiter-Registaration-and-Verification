// client/src/pages/AdminDashboardPage.js
import React from 'react';
import styled from 'styled-components';
import AdminDashboard from '../components/AdminDashboard';

const AdminDashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const AdminDashboardPage = () => {
  return (
    <AdminDashboardContainer>
      <h1>Admin Dashboard</h1>
      <AdminDashboard />
    </AdminDashboardContainer>
  );
};

export default AdminDashboardPage;