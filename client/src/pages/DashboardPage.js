import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DocumentUpload from "../components/DocumentUpload";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeMessage = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const StatusMessage = styled.p`
  background-color: ${(props) => (props.verified ? "#d4edda" : "#fff3cd")};
  color: ${(props) => (props.verified ? "#155724" : "#856404")};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LogoutButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1877f2;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #166fe5;
  }
`;

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/recruiters/profile", {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const logoutButton = () => {
    Cookies.remove("token");
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <LogoutButtonContainer>
        <Button onClick={logoutButton}>Logout</Button>
      </LogoutButtonContainer>
      <WelcomeMessage>Welcome, {profile.fullName}!</WelcomeMessage>
      {!profile.isDocumentVerified && (
        <>
          <StatusMessage>
            Your documents are pending verification.
          </StatusMessage>
          <DocumentUpload onUploadSuccess={fetchProfile} />
        </>
      )}
      {profile.isDocumentVerified && (
        <StatusMessage verified>
          Your documents have been verified.
        </StatusMessage>
      )}
    </DashboardContainer>
  );
};

export default DashboardPage;
