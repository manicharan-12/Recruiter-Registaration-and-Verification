// client/src/components/DocumentUpload.js
import React, { useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import Cookies from "js-cookie";

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const UploadButton = styled.button`
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #166fe5;
  }
`;

const DocumentUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await api.post(
        "/recruiters/upload-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      alert(response.data.message);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      alert("Error uploading documents: " + error.response.data.message);
    }
  };

  return (
    <UploadForm onSubmit={handleSubmit}>
      <FileInput type="file" multiple onChange={handleFileChange} />
      <UploadButton type="submit">Upload Documents</UploadButton>
    </UploadForm>
  );
};

export default DocumentUpload;
