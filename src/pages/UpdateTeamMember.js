import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, gql } from '@apollo/client';
import './css/UpdateTeamMember.css'; 
import Footer from '../components/Footer';

// GraphQL Mutation to update a user
const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      name
      role
      enterRole
      bio
      photo
    }
  }
`;

// GraphQL Query to fetch user data by id
const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      name
      role
      enterRole
      bio
      photo
    }
  }
`;

const UpdateTeamMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    enterRole: '',
    bio: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the user ID from URL params

  // Query hook to fetch user data by ID
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: parseInt(id) },
  });

  // Mutation hook to update the user
  const [updateUser] = useMutation(UPDATE_USER);

  // Populate form with the fetched data
  useEffect(() => {
    if (data && data.user) {
      setFormData({
        name: data.user.name,
        role: data.user.role,
        enterRole: data.user.enterRole,
        bio: data.user.bio,
        photo: data.user.photo, // Assuming photo is a URL or base64 string
      });
    }
  }, [data]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle photo upload and convert to base64 string
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file); // This converts the image to a base64 string
    }
  };

  // Validate form fields
  const validateForm = () => {
    const { name, role, enterRole, bio } = formData;
    let errorMessages = {};

    if (!name) errorMessages.name = 'Name is required.';
    if (!role) errorMessages.role = 'Role is required.';
    if (!enterRole) errorMessages.enterRole = 'Enter Role is required.';
    if (!bio) errorMessages.bio = 'Bio is required.';

    setErrors(errorMessages);
    return Object.keys(errorMessages).length === 0;
  };

  // Handle save action (update user data)
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) return;

    const { name, role, enterRole, bio, photo } = formData;

    const updateUserInput = {
      name,
      role,
      enterRole,
      bio,
      photo, // Send photo as a base64 string (or null if no photo is selected)
    };

    try {
      // Execute the mutation to update the user
      const response = await updateUser({
        variables: {
          id: parseInt(id), // Ensure the id is passed as an integer
          updateUserInput,
        },
      });

      if (response.data.updateUser) {
        setSuccess(true);
        setFormData({ name: '', role: '', enterRole: '', bio: '', photo: null });
        setTimeout(() => navigate('/'), 1000); // Redirect after success
      }
    } catch (error) {
      setErrors({ server: error.message });
      setSuccess(false);
    }
  };

  // Handle cancel action (navigate away without saving)
  const handleCancel = () => {
    setFormData({ name: '', role: '', enterRole: '', bio: '', photo: null });
    setErrors({});
    setSuccess(false);
    navigate('/');
  };

  // If the data is still loading, show a loading message
  if (loading) return <div>Loading...</div>;

  // If there was an error fetching the user data, show an error message
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSave} id="team_member_form" className="form-content">
        <h1 className="title">Update Team Member</h1>
  
        {errors.server && <div className="error">{errors.server}</div>}
  
        {/* Form fields */}
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
          <label htmlFor="enterRole">Enter Role</label>
          <input
            type="text"
            id="enterRole"
            name="enterRole"
            className="input"
            value={formData.enterRole}
            onChange={handleInputChange}
            placeholder="Enter Enter Role"
            required
          />
          {errors.enterRole && <div className="error">{errors.enterRole}</div>}
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
        </div>
  
        {/* Form group for buttons placed below the form fields */}
        <div className="form-group">
          <div className="button-group">
            <button type="submit" className="action-button">Save</button>
            <button type="button" onClick={handleCancel} className="action-button">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
};  
export default UpdateTeamMember;
