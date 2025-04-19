import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  padding: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ active }) => (active ? "#7c3aed" : "#e5e7eb")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) => (active ? "#6b21a8" : "#d1d5db")};
  }
`;

const PodcastList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PodcastItem = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #6b7280;
`;

const MyLibrary = () => {
  const [activeTab, setActiveTab] = useState("liked");
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let endpoint = "";

        if (activeTab === "liked") {
          endpoint = "/api/general-podcasts/liked"; // Replace with your backend route for liked podcasts
        } else if (activeTab === "saved") {
          endpoint = "/api/general-podcasts/saved"; // Replace with your backend route for saved podcasts
        }

        if (endpoint) {
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPodcasts(response.data.podcasts || []);
        } else {
          setPodcasts([]);
        }
      } catch (error) {
        console.error(
          "Error fetching podcasts:",
          error.response || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [activeTab]);

  return (
    <Container>
      <h2>My Library</h2>
      <Tabs>
        <Tab
          active={activeTab === "liked"}
          onClick={() => setActiveTab("liked")}
        >
          Liked
        </Tab>
        <Tab
          active={activeTab === "saved"}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </Tab>
        <Tab
          active={activeTab === "downloaded"}
          onClick={() => setActiveTab("downloaded")}
        >
          Downloaded
        </Tab>
      </Tabs>

      {loading ? (
        <p>Loading...</p>
      ) : podcasts.length > 0 ? (
        <PodcastList>
          {podcasts.map((podcast) => (
            <PodcastItem key={podcast._id}>
              <div>
                <h3>{podcast.title}</h3>
                <p>{podcast.description}</p>
              </div>
              <button
                onClick={() => console.log(`Play podcast ${podcast._id}`)}
              >
                Play
              </button>
            </PodcastItem>
          ))}
        </PodcastList>
      ) : (
        <EmptyState>
          {activeTab === "liked" && <p>You haven't liked any podcasts yet.</p>}
          {activeTab === "saved" && <p>You haven't saved any podcasts yet.</p>}
          {activeTab === "downloaded" && (
            <p>No downloaded podcasts available.</p>
          )}
        </EmptyState>
      )}
    </Container>
  );
};

export default MyLibrary;
