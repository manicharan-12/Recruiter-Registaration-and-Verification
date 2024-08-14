// client/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Title = styled.h1`
  color: #1877f2;
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &.register {
    background-color: #42b72a;
    color: white;

    &:hover {
      background-color: #36a420;
    }
  }

  &.login {
    background-color: #1877f2;
    color: white;

    &:hover {
      background-color: #166fe5;
    }
  }
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Title>Welcome to Recruiter Portal</Title>
      <ButtonContainer>
        <StyledLink to="/register" className="register">Register</StyledLink>
        <StyledLink to="/login" className="login">Login</StyledLink>
      </ButtonContainer>
    </HomeContainer>
  );
};

export default HomePage;