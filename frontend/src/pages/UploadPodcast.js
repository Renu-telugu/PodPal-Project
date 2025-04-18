import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { FaUpload, FaMusic, FaImage, FaExclamationCircle } from "react-icons/fa";

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const UploadContainer = styled.div`
  background-color: ${(props) => props.theme.colors?.card || '#ffffff'};
  color: ${(props) => props.theme.colors?.text || '#1a202c'};
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const UploadHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors?.border || '#e2e8f0'};
  
  h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
  }
  
  p {
    margin: 0.5rem 0 0 0;
    color: ${(props) => props.theme.colors?.textLight || '#718096'};
  }
`;

const FormContainer = styled.div`
  padding: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${(props) => props.theme.colors?.border || '#e2e8f0'};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .required {
    color: ${(props) => props.theme.colors?.error || '#ef4444'};
    margin-left: 0.25rem;
  }
  
  .optional {
    font-size: 0.8rem;
    color: ${(props) => props.theme.colors?.textLight || '#718096'};
    margin-left: 0.5rem;
    font-weight: normal;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.colors?.background || '#f8fafc'};
  border: 1px solid ${(props) => props.theme.colors?.border || '#e2e8f0'};
  color: ${(props) => props.theme.colors?.text || '#1a202c'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.2)'};
  }
  
  &::placeholder {
    color: ${(props) => props.theme.colors?.textLight || '#718096'};
  }
  
  &:disabled {
    background-color: ${(props) => props.theme.colors?.backgroundLight || '#f1f5f9'};
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.colors?.background || '#f8fafc'};
  border: 1px solid ${(props) => props.theme.colors?.border || '#e2e8f0'};
  color: ${(props) => props.theme.colors?.text || '#1a202c'};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.2)'};
  }
  
  &::placeholder {
    color: ${(props) => props.theme.colors?.textLight || '#718096'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.colors?.background || '#f8fafc'};
  border: 1px solid ${(props) => props.theme.colors?.border || '#e2e8f0'};
  color: ${(props) => props.theme.colors?.text || '#1a202c'};
  border-radius: 8px;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.2)'};
  }
`;

const FileUploadContainer = styled.div`
  border: 2px dashed ${(props) => props.theme.colors?.border || '#e2e8f0'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background-color: ${(props) => props.theme.colors?.background || '#f8fafc'};
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  
  &:hover {
    border-color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
  }
`;

const FileUploadIcon = styled.div`
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
  margin-bottom: 1rem;
`;

const FileUploadText = styled.div`
  color: ${(props) => props.theme.colors?.text || '#1a202c'};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FileUploadHint = styled.div`
  color: ${(props) => props.theme.colors?.textLight || '#718096'};
  font-size: 0.875rem;
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.1)'};
  border-radius: 8px;
  
  .file-name {
    flex-grow: 1;
    margin-left: 0.5rem;
  }
  
  .file-size {
    color: ${(props) => props.theme.colors?.textLight || '#718096'};
    font-size: 0.875rem;
  }
`;

const PreviewImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AudioPreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  
  audio {
    width: 100%;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  input[type="checkbox"] {
    margin-right: 0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }
  
  label {
    cursor: pointer;
    margin-bottom: 0;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  background-color: ${(props) => props.theme.colors?.primaryLight || 'rgba(124, 58, 237, 0.1)'};
  color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  
  button {
    background: none;
    border: none;
    color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
    margin-left: 0.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    font-size: 0.75rem;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${(props) => props.theme.colors?.text || '#1a202c'};
  border: 1px solid ${(props) => props.theme.colors?.border || '#e2e8f0'};
  
  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors?.backgroundLight || '#f1f5f9'};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${(props) => props.theme.colors?.primary || '#7c3aed'};
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors?.primaryDark || '#6025c0'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors?.error || '#ef4444'};
  background-color: ${(props) => props.theme.colors?.errorLight || 'rgba(239, 68, 68, 0.1)'};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: ${(props) => props.theme.colors?.success || '#10b981'};
  background-color: ${(props) => props.theme.colors?.successLight || 'rgba(16, 185, 129, 0.1)'};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Array of podcast genres
const PODCAST_GENRES = [
  "Art",
  "Business",
  "Comedy",
  "Education",
  "Fiction",
  "Government",
  "Health & Fitness",
  "History",
  "Kids & Family",
  "Leisure",
  "Music",
  "News",
  "Religion & Spirituality",
  "Science",
  "Society & Culture",
  "Sports",
  "Technology",
  "True Crime",
  "TV & Film",
  "Other"
];

// Array of languages
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Russian",
  "Italian",
  "Dutch",
  "Swedish",
  "Other"
];

const UploadPodcast = () => {
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  const [podcastData, setPodcastData] = useState({
    title: "",
    description: "",
    genre: "",
    audioFile: null,
    coverImage: null,
    language: "English",
    explicit: false,
    tags: [],
    tagInput: "",
    duration: "0:00"
  });

  const [audioPreview, setAudioPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPodcastData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPodcastData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Simple direct functions to trigger file inputs
  const triggerAudioFileInput = () => {
    audioInputRef.current.click();
  };

  const triggerImageFileInput = () => {
    imageInputRef.current.click();
  };

  // Handle audio file selection
  const handleAudioChange = (e) => {
    console.log("Audio file selected", e.target.files);
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('audio/')) {
      setError("Please select a valid audio file");
      return;
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("Audio file size should be less than 50MB");
      return;
    }

    setPodcastData((prev) => ({
      ...prev,
      audioFile: file,
    }));

    // Create audio preview URL
    const audioUrl = URL.createObjectURL(file);
    setAudioPreview(audioUrl);

    // Get audio duration when loaded
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      setPodcastData(prev => ({
        ...prev,
        duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
      }));
    });

    setError("");
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    console.log("Image file selected", e.target.files);
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size should be less than 5MB");
      return;
    }

    setPodcastData((prev) => ({
      ...prev,
      coverImage: file,
    }));

    // Create image preview URL
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    setError("");
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setPodcastData((prev) => ({
      ...prev,
      tagInput: e.target.value,
    }));
  };

  // Add tag when Enter key is pressed
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && podcastData.tagInput.trim()) {
      e.preventDefault();
      if (podcastData.tags.includes(podcastData.tagInput.trim())) {
        return; // Don't add duplicate tags
      }
      
      setPodcastData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setPodcastData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate form before submission
  const validateForm = () => {
    if (!podcastData.title.trim()) {
      setError("Please provide a podcast title");
      return false;
    }
    if (!podcastData.description.trim()) {
      setError("Please provide a podcast description");
      return false;
    }
    if (!podcastData.genre) {
      setError("Please select a genre");
      return false;
    }
    if (!podcastData.audioFile) {
      setError("Please upload an audio file");
      triggerAudioFileInput(); // Open the file selection dialog
      return false;
    }
    if (!podcastData.coverImage) {
      setError("Please upload a cover image");
      triggerImageFileInput(); // Open the file selection dialog
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUploading(true);
    setError("");
    
    try {
      // Debug current token and auth state
      console.log("Current user state:", user);
      console.log("Token in localStorage:", localStorage.getItem("token"));
      console.log("Audio file:", podcastData.audioFile);
      console.log("Cover image:", podcastData.coverImage);
      
      // Create FormData to send files and form data
      const formData = new FormData();
      
      // Add text fields
      formData.append("title", podcastData.title);
      formData.append("description", podcastData.description);
      formData.append("genre", podcastData.genre);
      formData.append("language", podcastData.language);
      formData.append("explicit", podcastData.explicit);
      
      // Add tags as comma-separated string
      if (podcastData.tags.length > 0) {
        formData.append("tags", podcastData.tags.join(","));
      }
      
      // Add files - log to verify they're being added correctly
      if (podcastData.audioFile) {
        formData.append("audioFile", podcastData.audioFile);
        console.log("Added audio file to form data:", podcastData.audioFile.name);
      } else {
        console.error("No audio file available to upload");
      }
      
      if (podcastData.coverImage) {
        formData.append("coverImage", podcastData.coverImage);
        console.log("Added cover image to form data:", podcastData.coverImage.name);
      } else {
        console.error("No cover image available to upload");
      }
      
      // Get auth token directly from localStorage
      const token = localStorage.getItem("token");
      
      // Get the user data from localStorage to ensure we link to the correct user
      const userData = localStorage.getItem("user");
      console.log("User data from localStorage:", userData);
      
      if (!token) {
        setError("Authentication required. Please log in again.");
        console.error("No token found in localStorage");
        setIsUploading(false);
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        
        return;
      }
      
      console.log("Making API call to: /api/podcasts/upload with token starting with:", 
                 token.substring(0, 15) + "...");
      
      // Headers with both authentication and user data
      const headers = {
        "Authorization": `Bearer ${token}`
      };
      
      // Add user data to headers if available
      if (userData) {
        headers["X-User-Data"] = userData;
      }
      
      // Call the API with the token and user data properly formatted
      const response = await fetch("/api/podcasts/upload", {
        method: "POST",
        headers: headers,
        body: formData,
      });
      
      // Log response status
      console.log("Response status:", response.status);
      
      // Check if we need to handle redirect before trying to parse JSON
      if (response.status === 401 || response.status === 403) {
        console.error("Authentication failed:", response.status);
        
        // Try to get error details if available
        let errorMessage = "Your session has expired. Please log in again.";
        try {
          const errorData = await response.json();
          console.error("Auth error details:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Could not parse error response", jsonError);
        }
        
        setError(errorMessage);
        
        // Clear any existing tokens since they're invalid
        localStorage.removeItem("token");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        
        return;
      }
      
      // Parse JSON response for successful responses
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload podcast");
      }
      
      // Show success message
      setSuccess("Podcast uploaded successfully!");
      
      // Redirect to my podcasts after 2 seconds
      setTimeout(() => {
        navigate("/user/my-podcasts");
      }, 2000);
      
    } catch (error) {
      console.error("Upload Error:", error);
      setError(error.message || "An error occurred while uploading your podcast. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel upload and return to previous page
  const handleCancel = () => {
    navigate(-1);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Revoke URLs to avoid memory leaks
      if (audioPreview) URL.revokeObjectURL(audioPreview);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [audioPreview, imagePreview]);

  return (
    <PageContainer>
      <UploadContainer>
        <UploadHeader>
          <h1>Upload New Podcast</h1>
          <p>Share your voice with the world. Fill in the details below to upload your podcast.</p>
        </UploadHeader>
        
        <FormContainer>
          {error && (
            <ErrorMessage>
              <FaExclamationCircle />
              {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              {success}
            </SuccessMessage>
          )}
          
          {/* Authentication Debug Info */}
          <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Authentication Debug</h3>
            <p>Current token status: {localStorage.getItem('token') ? 'Token exists' : 'No token'}</p>
            <p>Token value: {localStorage.getItem('token') ? localStorage.getItem('token').substring(0, 15) + '...' : 'N/A'}</p>
            
            <div style={{ marginTop: '10px' }}>
              <h4>Manual Authentication</h4>
              <p>If you're experiencing authentication issues, you can:</p>
              <ol>
                <li>Make sure you are logged in - check that you see a token value above</li>
                <li>Try logging out and back in if you don't see a token</li>
                <li>Try refreshing the page to reload your authentication state</li>
              </ol>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <FormSection>
              <h3>Basic Information</h3>
              <FormGrid>
                <FormGroup>
                  <label>
                    Podcast Title
                    <span className="required">*</span>
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={podcastData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a catchy and descriptive title"
                    maxLength={100}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <label>
                    Genre
                    <span className="required">*</span>
                  </label>
                  <Select
                    name="genre"
                    value={podcastData.genre}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select a genre</option>
                    {PODCAST_GENRES.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormGrid>
              
              <FormGroup>
                <label>
                  Description
                  <span className="required">*</span>
                </label>
                <Textarea
                  name="description"
                  value={podcastData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your podcast in detail. What is it about? Who is it for?"
                  rows="4"
                  required
                />
              </FormGroup>
              
              <FormGrid>
                <FormGroup>
                  <label>
                    Language
                    <span className="required">*</span>
                  </label>
                  <Select
                    name="language"
                    value={podcastData.language}
                    onChange={handleInputChange}
                    required
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <label>
                    Tags
                    <span className="optional">(optional)</span>
                  </label>
                  <Input
                    type="text"
                    name="tagInput"
                    value={podcastData.tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Enter tags and press Enter"
                  />
                  
                  {podcastData.tags.length > 0 && (
                    <TagContainer>
                      {podcastData.tags.map((tag) => (
                        <Tag key={tag}>
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)}>×</button>
                        </Tag>
                      ))}
                    </TagContainer>
                  )}
                </FormGroup>
              </FormGrid>
              
              <CheckboxContainer>
                <Input
                  type="checkbox"
                  id="explicit"
                  name="explicit"
                  checked={podcastData.explicit}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="explicit">
                  This podcast contains explicit content
                </label>
              </CheckboxContainer>
            </FormSection>
            
            <FormSection>
              <h3>Media Files</h3>
              <FormGrid>
                <FormGroup>
                  <label>
                    Audio File
                    <span className="required">*</span>
                  </label>
                  
                  {/* Hidden file input */}
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    style={{ display: 'none' }}
                  />
                  
                  {/* Custom button to trigger file selection */}
                  <FileUploadContainer onClick={triggerAudioFileInput}>
                    <FileUploadIcon>
                      <FaMusic />
                    </FileUploadIcon>
                    <FileUploadText>
                      {podcastData.audioFile ? "Change audio file" : "Upload audio file"}
                    </FileUploadText>
                    <FileUploadHint>
                      MP3, WAV, M4A (max. 50MB)
                    </FileUploadHint>
                  </FileUploadContainer>
                  
                  {/* Native button alternative */}
                  <button 
                    type="button"
                    onClick={triggerAudioFileInput}
                    style={{
                      marginTop: '10px',
                      padding: '8px 15px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%'
                    }}
                  >
                    <FaMusic /> {podcastData.audioFile ? "Change Audio File" : "Select Audio File"}
                  </button>
                  
                  {podcastData.audioFile && (
                    <>
                      <SelectedFile>
                        <FaMusic />
                        <span className="file-name">{podcastData.audioFile.name}</span>
                        <span className="file-size">{formatFileSize(podcastData.audioFile.size)}</span>
                      </SelectedFile>
                      
                      {audioPreview && (
                        <AudioPreview>
                          <audio controls src={audioPreview} />
                        </AudioPreview>
                      )}
                    </>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <label>
                    Cover Image
                    <span className="required">*</span>
                  </label>
                  
                  {/* Hidden file input */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  
                  {/* Custom button to trigger file selection */}
                  <FileUploadContainer onClick={triggerImageFileInput}>
                    <FileUploadIcon>
                      <FaImage />
                    </FileUploadIcon>
                    <FileUploadText>
                      {podcastData.coverImage ? "Change cover image" : "Upload cover image"}
                    </FileUploadText>
                    <FileUploadHint>
                      JPG, PNG, WEBP (max. 5MB, square images recommended)
                    </FileUploadHint>
                  </FileUploadContainer>
                  
                  {/* Native button alternative */}
                  <button 
                    type="button"
                    onClick={triggerImageFileInput}
                    style={{
                      marginTop: '10px',
                      padding: '8px 15px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%'
                    }}
                  >
                    <FaImage /> {podcastData.coverImage ? "Change Cover Image" : "Select Cover Image"}
                  </button>
                  
                  {podcastData.coverImage && (
                    <>
                      <SelectedFile>
                        <FaImage />
                        <span className="file-name">{podcastData.coverImage.name}</span>
                        <span className="file-size">{formatFileSize(podcastData.coverImage.size)}</span>
                      </SelectedFile>
                      
                      {imagePreview && (
                        <PreviewImage>
                          <img src={imagePreview} alt="Cover Preview" />
                        </PreviewImage>
                      )}
                    </>
                  )}
                </FormGroup>
              </FormGrid>
            </FormSection>
            
            <FormActions>
              <CancelButton type="button" onClick={handleCancel}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Podcast"}
                {!isUploading && <FaUpload />}
              </SubmitButton>
            </FormActions>
          </form>
        </FormContainer>
      </UploadContainer>
    </PageContainer>
  );
};

export default UploadPodcast;
