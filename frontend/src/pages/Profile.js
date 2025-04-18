import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/channel/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChannel(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching channel details"
        );
      }
    };

    fetchChannel();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{channel.name}</h1>
      <p>{channel.description || "No description available"}</p>
      <h2>Uploads</h2>
      <ul>
        {channel.uploads.map((podcast) => (
          <li key={podcast._id}>{podcast.title}</li>
        ))}
      </ul>
      <h2>Subscribers</h2>
      <ul>
        {channel.subscribers.map((subscriber) => (
          <li key={subscriber._id}>{subscriber.name}</li>
        ))}
      </ul>
      <h2>Likes</h2>
      <ul>
        {channel.likes.map((likedPodcast) => (
          <li key={likedPodcast._id}>{likedPodcast.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
