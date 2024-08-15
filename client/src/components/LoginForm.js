import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Cookies from "js-cookie";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ErrorMessage = styled.span`
  color: #e41e3f;
  font-size: 0.85rem;
`;

const Button = styled.button`
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #166fe5;
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  font-size: 0.9rem;

  a {
    color: #1877f2;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [encryptedOTP, setEncryptedOTP] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async ({ email }) => {
    try {
      const response = await api.post("/recruiters/login", { email });
      setEncryptedOTP(response.data.encryptedOTP);
      setOtpSent(true);
      alert(response.data.message);
    } catch (error) {
      alert("Error sending OTP: " + error.response.data.message);
    }
  };

  const handleVerifyOTP = async ({ email, otp }) => {
    try {
      const response = await api.post("/recruiters/verify-otp", {
        email,
        otp,
        encryptedOTP,
      });
      Cookies.set("token", response.data.token, { expires: 1, path: "/" });
      alert(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      alert("Error verifying OTP: " + error.response.data.message);
    }
  };

  return (
    <FormContainer
      onSubmit={handleSubmit(otpSent ? handleVerifyOTP : handleSendOTP)}
    >
      <Input
        type="email"
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      {otpSent && (
        <Input
          type="text"
          placeholder="Enter OTP"
          {...register("otp", { required: "OTP is required" })}
        />
      )}
      {errors.otp && <ErrorMessage>{errors.otp.message}</ErrorMessage>}

      <Button type="submit">{otpSent ? "Verify OTP" : "Send OTP"}</Button>
      <RegisterLink>
        Haven't registered yet? <Link to="/register">Register now</Link>
      </RegisterLink>
    </FormContainer>
  );
};

export default LoginForm;
