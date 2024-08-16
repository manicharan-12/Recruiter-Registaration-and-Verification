// client/src/components/VerifyMail.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { ThreeDots } from 'react-loader-spinner';

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
  const [loading, setLoading] = useState(true); // Loading state for API call
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const verifyEmail = async () => {
      setLoading(true); // Start loading
      try {
        const response = await api.get(`/recruiters/verify/${id}`);
        if (isMounted) {
          setMessage(
            "Your email has been verified successfully. Please wait for the admin Approval. Redirecting to the login page."
          );
          setError(false);
        }
      } catch (error) {
        if (isMounted) {
          setMessage(
            "Verification failed. Invalid or expired verification link."
          );
          setError(true);
        }
      } finally {
        setLoading(false); // End loading
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
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
      {loading ? (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#1877f2"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
          visible={true}
        />
      ) : error ? (
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
