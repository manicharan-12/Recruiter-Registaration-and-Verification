import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import Cookies from 'js-cookie';

const AdminDashboardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1877f2;
  margin-bottom: 1rem;
`;

const RecruiterList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const RecruiterItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const DocumentList = styled.ul`
  list-style-type: none;
  padding-left: 20px;
`;

const DocumentItem = styled.li`
  margin: 0.5rem 0;
`;

const ApproveButton = styled.button`
  background-color: #42b72a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #36a420;
  }
`;

const VerifyDocumentsButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const AdminDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await api.get('/recruiters/admin/recruiters', {
        headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
      });
      setRecruiters(response.data);
    } catch (error) {
      alert('Error fetching recruiters: ' + error.response.data.message);
    }
  };

  const handleApprove = async (recruiterId) => {
    try {
      await api.put(`/recruiters/admin/approve/${recruiterId}`, {}, {
        headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
      });
      fetchRecruiters();
    } catch (error) {
      alert('Error approving recruiter: ' + error.response.data.message);
    }
  };

  const handleVerifyDocuments = async (recruiterId) => {
    try {
      await api.put(`/recruiters/admin/verify-documents/${recruiterId}`, {}, {
        headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
      });
      fetchRecruiters();
    } catch (error) {
      alert('Error verifying documents: ' + error.response.data.message);
    }
  };

  const getViewableUrl = (data, contentType) => {
    try {
      // Check if data is a valid base64 string
      if (!data || typeof data !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(data)) {
        console.error("Invalid base64 string:", data);
        return null;
      }
  
      // Add padding if necessary
      if (data.length % 4 !== 0) {
        data += '='.repeat(4 - (data.length % 4));
      }
  
      // Decode base64 string
      const binaryString = atob(data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to decode base64 string:", error);
      return null;
    }
  };
  

  return (
    <AdminDashboardContainer>
      <Title>Pending Approvals</Title>
      <RecruiterList>
        {recruiters.map((recruiter) => (
          <RecruiterItem key={recruiter._id}>
            <span>{recruiter.fullName} - {recruiter.companyName}</span>
            <DocumentList>
              {recruiter.verificationDocuments.map((doc, index) => (
                <DocumentItem key={index}>
                  {/* Ensure that the link opens in a new tab */}
                  <a href={getViewableUrl(doc.data, doc.contentType)} target="_blank" rel="noopener noreferrer">
                    {doc.name}
                  </a>
                </DocumentItem>
              ))}
            </DocumentList>
            <ApproveButton onClick={() => handleApprove(recruiter._id)}>
              Approve
            </ApproveButton>
            <VerifyDocumentsButton onClick={() => handleVerifyDocuments(recruiter._id)}>
              Verify Documents
            </VerifyDocumentsButton>
          </RecruiterItem>
        ))}
      </RecruiterList>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;