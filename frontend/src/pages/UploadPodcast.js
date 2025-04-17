import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const UploadContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #282828;
  color: white;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background-color: #404040;
  border: none;
  color: white;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  background-color: #404040;
  border: none;
  color: white;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: #1DB954;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background-color: #1ED760;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #FF4757;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #1DB954;
  margin-bottom: 1rem;
`;

const UploadPodcast = () => {
  const [podcastData, setPodcastData] = useState({
    title: '',
    description: '',
    genre: 'Other',
    audioFile: null,
    coverImage: null
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPodcastData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous errors
    setError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPodcastData(prev => ({
      ...prev,
      [name]: files[0]
    }));
    // Clear any previous errors
    setError('');
  };

  const validateForm = () => {
    if (!podcastData.title) {
      setError('Please provide a podcast title');
      return false;
    }
    if (!podcastData.description) {
      setError('Please provide a podcast description');
      return false;
    }
    if (!podcastData.audioFile) {
      setError('Please upload an audio file');
      return false;
    }
    if (!podcastData.coverImage) {
      setError('Please upload a cover image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous messages
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Create FormData for file uploads
    const formData = new FormData();
    formData.append('title', podcastData.title);
    formData.append('description', podcastData.description);
    formData.append('genre', podcastData.genre);
    formData.append('audioFile', podcastData.audioFile);
    formData.append('coverImage', podcastData.coverImage);

    try {
      setIsUploading(true);
      const response = await axios.post('/api/podcasts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Handle successful upload
      setSuccess('Podcast uploaded successfully!');
      
      // Reset form
      setPodcastData({
        title: '',
        description: '',
        genre: 'Other',
        audioFile: null,
        coverImage: null
      });

      // Clear file inputs
      e.target.reset();
    } catch (error) {
      // Handle upload error
      console.error('Upload failed', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
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
          <Input 
            as="textarea" 
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
            <option value="Technology">Technology</option>
            <option value="News">News</option>
            <option value="Comedy">Comedy</option>
            <option value="Education">Education</option>
            <option value="Sports">Sports</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="True Crime">True Crime</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
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

        <SubmitButton 
          type="submit" 
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Podcast'}
        </SubmitButton>
      </form>
    </UploadContainer>
  );
};

export default UploadPodcast;