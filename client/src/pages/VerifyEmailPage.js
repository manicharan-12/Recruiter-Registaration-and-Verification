import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import api from '../services/api';

const VerifyEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const VerifyEmailMessage = styled.h2`
  color: #1877f2;
  text-align: center;
`;

const ErrorMessage = styled.h2`
  color: #d9534f;
  text-align: center;
`;

const CountdownText = styled.p`
  color: #555;
  text-align: center;
  margin-top: 10px;
`;

const VerifyMail = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Add a flag to track if the component is still mounted

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/recruiters/verify/${id}`);
        if (isMounted) {
          setMessage("Your email has been verified successfully. Redirecting to the login page.");
          setError(false);
        }
      } catch (error) {
        if (isMounted) {
          setMessage("Verification failed. Invalid or expired verification link.");
          setError(true);
        }
      }
    };

    verifyEmail();

    return () => {
      isMounted = false; // Cleanup function to prevent setting state if the component is unmounted
    };
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0 && !error) {
      navigate("/login");
    }

    return () => clearInterval(timer);
  }, [countdown, navigate, error]);

  return (
    <VerifyEmailContainer>
      {error ? (
        <ErrorMessage>{message}</ErrorMessage>
      ) : (
        <>
          <VerifyEmailMessage>{message}</VerifyEmailMessage>
          <CountdownText>Redirecting in {countdown} seconds...</CountdownText>
        </>
      )}
    </VerifyEmailContainer>
  );
};

export default VerifyMail;
