import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const UploadContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  color: ${(props) => props.theme.colors.text};
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.accent};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
  border-radius: 4px;
  margin-top: 0.5rem;
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.accent};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
  border-radius: 4px;
  margin-top: 0.5rem;
  resize: vertical;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.accent};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: ${(props) => props.theme.colors.success};
  margin-bottom: 1rem;
`;

const UploadPodcast = () => {
  const { user } = useAuth();
  const [podcastData, setPodcastData] = useState({
    title: "",
    description: "",
    genre: "Other",
    audioFile: null,
    coverImage: null,
    language: "English",
    explicit: false,
    tags: "",
    publishDate: new Date(),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log("UploadPodcast Component Mounted");
    return () => {
      console.log("UploadPodcast Component Unmounted");
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input Changed: ${name} = ${value}`);
    setPodcastData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(`File Selected: ${name}`, files[0]);
    setPodcastData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    setError("");
  };

  const validateForm = () => {
    console.log("Validating Form", podcastData);
    if (!podcastData.title) {
      setError("Please provide a podcast title");
      return false;
    }
    if (!podcastData.description) {
      setError("Please provide a podcast description");
      return false;
    }
    if (!podcastData.audioFile) {
      setError("Please upload an audio file");
      return false;
    }
    if (!podcastData.coverImage) {
      setError("Please upload a cover image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", podcastData.title);
    formData.append("description", podcastData.description);
    formData.append("genre", podcastData.genre);
    formData.append("language", podcastData.language);
    formData.append("explicit", podcastData.explicit);
    formData.append("tags", podcastData.tags);
    formData.append("publishDate", podcastData.publishDate);
    formData.append("audioFile", podcastData.audioFile);
    formData.append("coverImage", podcastData.coverImage);

    console.log("FormData:", Object.fromEntries(formData));

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      console.log("JWT Token:", localStorage.getItem("token"));
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      };

      const response = await axios.post(
        "/api/podcasts/upload",
        formData,
        config
      );
      console.log("Upload Response:", response.data);
      alert("Podcast uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Error uploading podcast. Please try again."
      );
    }
  };

  return (
    <UploadContainer>
      <h2>Upload Podcast</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Podcast Title</label>
          <Input
            type="text"
            name="title"
            value={podcastData.title}
            onChange={handleInputChange}
            placeholder="Enter podcast title"
          />
        </FormGroup>

        <FormGroup>
          <label>Description</label>
          <Textarea
            name="description"
            value={podcastData.description}
            onChange={handleInputChange}
            placeholder="Describe your podcast"
            rows="4"
          />
        </FormGroup>

        <FormGroup>
          <label>Genre</label>
          <Select
            name="genre"
            value={podcastData.genre}
            onChange={handleInputChange}
          >
            <option value="Other">Other</option>
            <option value="Technology">Technology</option>
            <option value="News">News</option>
            <option value="Comedy">Comedy</option>
            <option value="Education">Education</option>
            <option value="Sports">Sports</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Audio File</label>
          <Input
            type="file"
            name="audioFile"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </FormGroup>

        <FormGroup>
          <label>Cover Image</label>
          <Input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
          />
        </FormGroup>

        <FormGroup>
          <label>Language</label>
          <Select
            name="language"
            value={podcastData.language}
            onChange={handleInputChange}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Tags (comma-separated)</label>
          <Input
            type="text"
            name="tags"
            value={podcastData.tags}
            onChange={handleInputChange}
            placeholder="Enter tags separated by commas"
          />
        </FormGroup>

        <FormGroup>
          <label>
            <Input
              type="checkbox"
              name="explicit"
              checked={podcastData.explicit}
              onChange={(e) =>
                setPodcastData((prev) => ({
                  ...prev,
                  explicit: e.target.checked,
                }))
              }
            />
            Explicit Content
          </label>
        </FormGroup>

        <SubmitButton type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Podcast"}
        </SubmitButton>
      </form>
    </UploadContainer>
  );
};

export default UploadPodcast;
