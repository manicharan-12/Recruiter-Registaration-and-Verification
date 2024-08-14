// client/src/pages/RegistrationPage.js
import React from 'react';
import styled from 'styled-components';
import RegistrationForm from '../components/RegistrationForm';

const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 2rem;
`;

const RegistrationTitle = styled.h2`
  color: #1877f2;
  margin-bottom: 2rem;
`;

const RegistrationPage = () => {
  return (
    <RegistrationContainer>
      <RegistrationTitle>Register as a Recruiter</RegistrationTitle>
      <RegistrationForm />
    </RegistrationContainer>
  );
};

export default RegistrationPage;