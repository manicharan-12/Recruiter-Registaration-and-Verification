// client/src/pages/LoginPage.js
import React from "react";
import styled from "styled-components";
import LoginForm from "../components/LoginForm";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginTitle = styled.h2`
  color: #1877f2;
  margin-bottom: 2rem;
`;

const LoginPage = () => {
  return (
    <LoginContainer>
      <LoginTitle>Login</LoginTitle>
      <LoginForm />
    </LoginContainer>
  );
};

export default LoginPage;
