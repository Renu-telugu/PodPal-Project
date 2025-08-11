import { useNavigate } from "react-router-dom";
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  NavSection,
  NavTitle,
  NavLink,
  Grid,
  PodcastCard,
  PodcastImage,
  PodcastTitle,
  PodcastCreator,
  SectionTitle,
  UploadButton,
} from "../styles/DashboardStyles";

// Temporary SVG icon for upload (you can replace with a proper icon library)
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - replace with real data later
  const recentPodcasts = [
    {
      id: 1,
      title: "Tech Talk Weekly",
      creator: "TechGeeks",
      image: "https://placehold.co/400",
    },
    {
      id: 2,
      title: "True Crime Stories",
      creator: "Mystery Channel",
      image: "https://placehold.co/400",
    },
    {
      id: 3,
      title: "Health & Wellness",
      creator: "Wellness Hub",
      image: "https://placehold.co/400",
    },
    {
      id: 1,
      title: "Tech Talk Weekly",
      creator: "TechGeeks",
      image: "https://placehold.co/400",
    },
    {
      id: 2,
      title: "True Crime Stories",
      creator: "Mystery Channel",
      image: "https://placehold.co/400",
    },
    {
      id: 3,
      title: "Health & Wellness",
      creator: "Wellness Hub",
      image: "https://placehold.co/400",
    },
    // Add more podcasts as needed
  ];

  const handleUpload = () => {
    // Navigate to the upload podcast page
    navigate("/upload");
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <NavSection>
          <NavTitle>LIBRARY</NavTitle>
          <NavLink to="/dashboard/downloads">Downloads</NavLink>
          <NavLink to="/dashboard/your-episodes">Your Episodes</NavLink>
          <NavLink to="/dashboard/liked">Liked Podcasts</NavLink>
        </NavSection>
        <NavSection>
          <NavTitle>YOUR PLAYLISTS</NavTitle>
          <NavLink to="/dashboard/playlist/1">Morning Coffee</NavLink>
          <NavLink to="/dashboard/playlist/2">Tech News</NavLink>
          <NavLink to="/dashboard/playlist/3">Bedtime Stories</NavLink>
        </NavSection>

        {/* Upload Button in Sidebar */}
        <UploadButton onClick={handleUpload}>
          <UploadIcon />
          Upload Podcast
        </UploadButton>
      </Sidebar>

      <MainContent>
        <SectionTitle>Recently Played</SectionTitle>
        <Grid>
          {recentPodcasts.map((podcast) => (
            <PodcastCard key={podcast.id}>
              <PodcastImage src={podcast.image} alt={podcast.title} />
              <PodcastTitle>{podcast.title}</PodcastTitle>
              <PodcastCreator>{podcast.creator}</PodcastCreator>
            </PodcastCard>
          ))}
        </Grid>

        <SectionTitle style={{ marginTop: "2rem" }}>
          Your Top Podcasts
        </SectionTitle>
        <Grid>
          {recentPodcasts.map((podcast) => (
            <PodcastCard key={podcast.id}>
              <PodcastImage src={podcast.image} alt={podcast.title} />
              <PodcastTitle>{podcast.title}</PodcastTitle>
              <PodcastCreator>{podcast.creator}</PodcastCreator>
            </PodcastCard>
          ))}
        </Grid>

        {/* Placeholder for Upload Modal */}
        {/* {showUploadModal && (
          <div style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: '#282828', 
            padding: '2rem', 
            borderRadius: '8px',
            color: 'white'
          }}>
            <h2>Upload Podcast</h2>
            <p>Upload functionality coming soon!</p>
            <button 
              onClick={() => setShowUploadModal(false)}
              style={{ 
                backgroundColor: '#1DB954', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px',
                marginTop: '1rem'
              }}
            >
              Close
            </button>
          </div>
        )} */}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
