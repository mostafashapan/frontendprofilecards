import React, { useState, useEffect } from 'react';
import './css/TeamSectionForm.css';

const TeamSectionForm = () => {
  // State for team members
  const [teamMembers, setTeamMembers] = useState([]);

  // State for form data
  const [formData, setFormData] = useState({
    photo: '',
    name: '',
    role: '',
    bio: ''
  });

  // Fetch team members from the API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team-members');
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []); // Empty array means this runs only once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.bio) {
      alert('Please fill out all fields.');
      return;
    }

    // Create a new team member object
    const newMember = {
      photo: formData.photo,
      name: formData.name,
      role: formData.role,
      bio: formData.bio
    };

    try {
      // Send POST request to add the new member to the database
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember)
      });

      if (response.ok) {
        const addedMember = await response.json();
        setTeamMembers([...teamMembers, addedMember]); // Update the team members state with the new member
        setFormData({ photo: '', name: '', role: '', bio: '' }); // Reset the form after successful submission
      } else {
        alert('Failed to add new team member');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  return (
    <div className="team-section-form">
      <h2>Add a New Team Member</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
          />
        </div>

        {/* Role input */}
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Enter role"
          />
        </div>

        {/* Bio input */}
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Enter bio"
          />
        </div>

        {/* Photo input */}
        <div className="form-group">
          <label htmlFor="photo">Photo:</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>

        <button type="submit" className="submit-btn">Add Team Member</button>
      </form>

      {/* Display added team members */}
      <div className="team-members">
        <h3>Current Team Members</h3>
        <div className="team-profiles">
          {teamMembers.map((member, index) => (
            <div key={index} className="profile-card">
              <img src={member.photo} alt={member.name} className="profile-photo" />
              <h4 className="name">{member.name}</h4>
              <p className="role">{member.role}</p>
              <p className="bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSectionForm;
