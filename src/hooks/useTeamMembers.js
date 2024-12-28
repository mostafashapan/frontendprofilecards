import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/UpdateTeamMember.css'; // Assuming you have a separate CSS file for the team member form
import { useQuery, useMutation, gql } from '@apollo/client';
import Footer from '../components/Footer';

// GraphQL Query to fetch a team member by ID
const GET_TEAM_MEMBER = gql`
  query getTeamMember($id: Int!) {
    user(id: $id) {
      id
      name
      role
      bio
      photo
    }
  }
`;

// GraphQL Mutation to update the team member
const UPDATE_TEAM_MEMBER = gql`
  mutation updateTeamMember($id: Int!, $name: String!, $role: String!, $bio: String!, $photo: Upload) {
    updateUser(
      id: $id,
      updateUserInput: { name: $name, role: $role, bio: $bio, photo: $photo }
    ) {
      id
      name
      role
      bio
      photo
    }
  }
`;

const UpdateTeamMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo: null, // To store the uploaded image file
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the team member ID from the URL

  // Fetch the team member data if editing (based on the id in the URL)
  const { data, loading, error } = useQuery(GET_TEAM_MEMBER, {
    variables: { id: parseInt(id) },
    skip: !id, // Skip query if there is no id
  });

  // Fetch the data when it is loaded
  useEffect(() => {
    if (data && data.user) {
      setFormData({
        name: data.user.name,
        role: data.user.role,
        bio: data.user.bio,
        photo: null, // Don't update photo here
      });
    }
  }, [data]);

  // Mutation hook for updating team member data
  const [updateTeamMember] = useMutation(UPDATE_TEAM_MEMBER, {
    onCompleted: () => {
      setSuccess(true);
      setFormData({
        name: '',
        role: '',
        bio: '',
        photo: null,
      });
      setErrors({});
      setTimeout(() => navigate('/'), 1000); // Redirect after successful update
    },
    onError: (error) => {
      setErrors({ server: error.message });
      setSuccess(false);
    },
  });

  // Synchronous form validation
  const validateForm = () => {
    const { name, role, bio } = formData;
    let errorMessages = {};

    if (!name) errorMessages.name = 'Name is required.';
    if (!role) errorMessages.role = 'Role is required.';
    if (!bio) errorMessages.bio = 'Bio is required.';

    setErrors(errorMessages);
    return Object.keys(errorMessages).length === 0;
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({ ...prevFormData, photo: file }));
    }
  };

  // Handle save action with asynchronous network request
  const handleSave = async (event) => {
    event.preventDefault();

    // Validate the form
    if (!validateForm()) return;

    const { name, role, bio, photo } = formData;

    // If there's a photo, append it to the request payload
    const variables = { id: parseInt(id), name, role, bio, photo };

    try {
      // Call the mutation with the form data
      await updateTeamMember({ variables });
    } catch (error) {
      setErrors({ server: error.message });
      setSuccess(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      photo: null,
    });
    setErrors({});
    setSuccess(false);
    navigate('/'); // Navigate to the team list page
  };

  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>Error fetching team member: {error.message}</p>; // Error state

  return (
    <>
      <div className="form-wrapper">
        <form onSubmit={handleSave} id="team_member_form" className="form-content">
          <h1 className="title">Update Team Member</h1>

          {errors.server && <div className="error">{errors.server}</div>}

          <div className="form-group">
            <div className="button-group">
              <button type="submit" className="action-button">Save</button>
              <button type="button" onClick={handleCancel} className="action-button">Cancel</button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
              required
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              className="input"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Enter Role"
              required
            />
            {errors.role && <div className="error">{errors.role}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className="input"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Enter Bio"
              required
            />
            {errors.bio && <div className="error">{errors.bio}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="photo">Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              className="input"
              onChange={handlePhotoChange}
            />
            {errors.photo && <div className="error">{errors.photo}</div>}
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateTeamMember;
