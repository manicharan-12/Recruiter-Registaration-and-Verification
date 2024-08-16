// client/src/components/RegistrationForm.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ThreeDots } from 'react-loader-spinner';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const LoginLink = styled.p`
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

const RegistrationForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false); // Loading state for API call
  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await api.post("/recruiters/register", data);
      alert(response.data.message);
    } catch (error) {
      alert("Error registering: " + error.response.data.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Full Name"
        {...register("fullName", { required: "Full Name is required" })}
      />
      {errors.fullName && (
        <ErrorMessage>{errors.fullName.message}</ErrorMessage>
      )}

      <Input
        type="text"
        placeholder="Company Name"
        {...register("companyName", { required: "Company Name is required" })}
      />
      {errors.companyName && (
        <ErrorMessage>{errors.companyName.message}</ErrorMessage>
      )}

      <Input
        type="email"
        placeholder="Official Email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

      <Input
        type="text"
        placeholder="Job Title"
        {...register("jobTitle", { required: "Job Title is required" })}
      />
      {errors.jobTitle && (
        <ErrorMessage>{errors.jobTitle.message}</ErrorMessage>
      )}

      <Input
        type="tel"
        placeholder="Contact Number"
        {...register("contactNumber", {
          required: "Contact Number is required",
        })}
      />
      {errors.contactNumber && (
        <ErrorMessage>{errors.contactNumber.message}</ErrorMessage>
      )}

      <Input
        type="url"
        placeholder="Company Website"
        {...register("companyWebsite", {
          required: "Company Website is required",
        })}
      />
      {errors.companyWebsite && (
        <ErrorMessage>{errors.companyWebsite.message}</ErrorMessage>
      )}

      <Input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && (
        <ErrorMessage>{errors.password.message}</ErrorMessage>
      )}

      <Input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: (value) => value === password || "Passwords don't match",
        })}
      />
      {errors.confirmPassword && (
        <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
      )}

      <CheckboxContainer>
        <input
          type="checkbox"
          {...register("agreedToTerms", {
            required: "You must agree to the terms and conditions",
          })}
        />
        I agree to the terms and conditions
      </CheckboxContainer>
      {errors.agreedToTerms && (
        <ErrorMessage>{errors.agreedToTerms.message}</ErrorMessage>
      )}

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
      ) : (
        <Button type="submit">Register</Button>
      )}

      <LoginLink>
        Already registered? <Link to="/login">Login here</Link>
      </LoginLink>
    </FormContainer>
  );
};

export default RegistrationForm;
