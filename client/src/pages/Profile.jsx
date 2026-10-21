// pages/Profile.jsx
// A simple protected page — fetches the logged-in user's data from a private API route

/*import { useState, useEffect } from 'react';
import API from '../api/axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the token we stored during login
        const storedUser = JSON.parse(localStorage.getItem('user'));

        // Attach it as an Authorization header for this specific request
        const { data } = await API.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });

        setProfile(data);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!profile) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <p><span className="font-medium">Name:</span> {profile.name}</p>
      <p><span className="font-medium">Email:</span> {profile.email}</p>
      <p><span className="font-medium">Role:</span> {profile.role}</p>
    </div>
  );
};

export default Profile;*/
// pages/Profile.jsx

import { useState, useEffect } from 'react';
import API from '../api/axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // No more manually building headers — the interceptor handles it now
        const { data } = await API.get('/auth/me');
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!profile) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <p><span className="font-medium">Name:</span> {profile.name}</p>
      <p><span className="font-medium">Email:</span> {profile.email}</p>
      <p><span className="font-medium">Role:</span> {profile.role}</p>
    </div>
  );
};

export default Profile;