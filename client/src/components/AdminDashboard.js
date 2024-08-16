// client/src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../services/api";
import Cookies from "js-cookie";
import { ThreeDots } from 'react-loader-spinner';

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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f0f2f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SortSelect = styled.select`
  margin-bottom: 1rem;
`;

const NewRecruitersBadge = styled.span`
  background-color: #dc3545;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.active ? "#1877f2" : "#f0f2f5")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const AdminDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [newRecruitersCount, setNewRecruitersCount] = useState(0);
  const [activeTab, setActiveTab] = useState("verify");
  const [loading, setLoading] = useState(false); // Loading state for API calls

  useEffect(() => {
    return () => {
      recruiters.forEach((recruiter) => {
        recruiter.verificationDocuments.forEach((doc) => {
          const url = getViewableUrl(doc.data, doc.contentType);
          if (url) URL.revokeObjectURL(url);
        });
      });
    };
  }, [recruiters]);

  useEffect(() => {
    fetchRecruiters();
    fetchNewRecruitersCount();
    const interval = setInterval(fetchNewRecruitersCount, 60000);
    return () => clearInterval(interval);
  }, [currentPage, sortBy, sortOrder, activeTab]);

  const fetchRecruiters = async () => {
    setLoading(true); // Start loading
    try {
      const endpoint =
        activeTab === "verify"
          ? "/recruiters/admin/unverified-recruiters"
          : "/recruiters/admin/unverified-documents";
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        params: { page: currentPage, sortBy, sortOrder },
      });
      setRecruiters(response.data.recruiters);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      alert("Error fetching recruiters: " + error.response.data.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchNewRecruitersCount = async () => {
    try {
      const response = await api.get("/recruiters/admin/new-recruiter-count", {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      setNewRecruitersCount(response.data.count);
    } catch (error) {
      console.error("Error fetching new recruiter count:", error);
    }
  };

  const handleApprove = async (recruiterId) => {
    setLoading(true); // Start loading
    try {
      await api.put(
        `/recruiters/admin/approve/${recruiterId}`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      fetchRecruiters();
    } catch (error) {
      alert("Error approving recruiter: " + error.response.data.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleVerifyDocuments = async (recruiterId) => {
    setLoading(true); // Start loading
    try {
      const response = await api.put(
        `/recruiters/admin/verify-documents/${recruiterId}`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      console.log(response);

      fetchRecruiters();
    } catch (error) {
      alert("Error verifying documents: " + error.response.data.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleReject = async (recruiterId) => {
    const reason = prompt("Please enter a reason for rejection:");
    if (reason) {
      setLoading(true); // Start loading
      try {
        await api.put(
          `/recruiters/admin/reject/${recruiterId}`,
          { reason },
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        fetchRecruiters();
      } catch (error) {
        alert("Error rejecting recruiter: " + error.response.data.message);
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const getViewableUrl = (data, contentType) => {
    try {
      const binaryString = atob(data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to create Blob URL:", error);
      return null;
    }
  };

  const renderRecruiterItem = (recruiter) => (
    <RecruiterItem key={recruiter._id}>
      <h3>
        {recruiter.fullName} - {recruiter.companyName}
      </h3>
      <p>Email: {recruiter.email}</p>
      <p>Job Title: {recruiter.jobTitle}</p>
      <p>Company Website: {recruiter.companyWebsite}</p>
      {activeTab === "documents" && (
        <>
          <h4>Verification Documents:</h4>
          <DocumentList>
            {recruiter.verificationDocuments.map((doc, index) => (
              <DocumentItem key={index}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = getViewableUrl(doc.data, doc.contentType);
                    if (url) {
                      window.open(url, "_blank");
                    }
                  }}
                >
                  {doc.name}
                </a>
              </DocumentItem>
            ))}
          </DocumentList>
        </>
      )}
      <div>
        {activeTab === "verify" ? (
          <>
            <ApproveButton onClick={() => handleApprove(recruiter._id)}>
              Approve
            </ApproveButton>
            <button onClick={() => handleReject(recruiter._id)}>
              Reject
            </button>
          </>
        ) : (
          <VerifyDocumentsButton
            onClick={() => handleVerifyDocuments(recruiter._id)}
          >
            Verify Documents
          </VerifyDocumentsButton>
        )}
      </div>
    </RecruiterItem>
  );

  return (
    <AdminDashboardContainer>
      <Title>
        Admin Dashboard{" "}
        {newRecruitersCount > 0 && (
          <NewRecruitersBadge>{newRecruitersCount} new</NewRecruitersBadge>
        )}
      </Title>
      <TabContainer>
        <Tab
          active={activeTab === "verify"}
          onClick={() => setActiveTab("verify")}
        >
          Verify Recruiters
        </Tab>
        <Tab
          active={activeTab === "documents"}
          onClick={() => setActiveTab("documents")}
        >
          Verify Documents
        </Tab>
      </TabContainer>
      <SortSelect onChange={(e) => setSortBy(e.target.value)}>
        <option value="createdAt">Sort by Date</option>
        <option value="fullName">Sort by Name</option>
        <option value="companyName">Sort by Company</option>
      </SortSelect>
      <SortSelect onChange={(e) => setSortOrder(e.target.value)}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </SortSelect>
      {loading ? (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#007bff"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
          visible={true}
        />
      ) : (
        <RecruiterList>{recruiters.map(renderRecruiterItem)}</RecruiterList>
      )}
      <Pagination>
        <PageButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </PageButton>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <PageButton
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </PageButton>
      </Pagination>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;
