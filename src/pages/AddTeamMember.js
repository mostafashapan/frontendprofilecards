import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client'; // Apollo useMutation hook
import gql from 'graphql-tag'; // For GraphQL mutations
import './css/AddTeamMember.css';
import Footer from '../components/Footer';

// GraphQL Mutation to add a team member
const ADD_TEAM_MEMBER_MUTATION = gql`
  mutation addUser($addUserInput: AddUserInput!) {
    addUser(addUserInput: $addUserInput) {
      id
      name
      role
      bio
      photo
    }
  }
`;

const AddTeamMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    enterRole: '', // Add this field to track the enterRole
    bio: '',
    photo: null, // To store the uploaded image file or URL
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Apollo mutation hook
  const [addTeamMember] = useMutation(ADD_TEAM_MEMBER_MUTATION);

  // Synchronous form validation
  const validateForm = () => {
    const { name, role, bio, enterRole } = formData;
    let errorMessages = {};

    if (!name) errorMessages.name = 'Name is required.';
    if (!role) errorMessages.role = 'Role is required.';
    if (!enterRole) errorMessages.enterRole = 'Enter role is required.'; // Add validation for enterRole
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

  // Handle save action with GraphQL mutation
  const handleSave = async (event) => {
    event.preventDefault();

    // Validate the form
    if (!validateForm()) return;

    const { name, role, bio, photo, enterRole } = formData;

    // Create the mutation input
    const addUserInput = {
      name,
      role,
      bio,
      enterRole, // Include enterRole in the mutation input
      photo: typeof photo === 'string' ? photo : null,  // If URL-based photo, pass it directly
    };

    if (photo instanceof File) {
      // Handle file upload for photo
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', photo);

      try {
        // Upload the file here (you will need to replace this URL with your actual upload endpoint)
        const response = await fetch('your_file_upload_endpoint', {
          method: 'POST',
          body: formDataForUpload,
        });

        if (response.ok) {
          const result = await response.json();
          addUserInput.photo = result.imageUrl; // Assume the server returns the image URL
        } else {
          throw new Error('Error uploading file');
        }
      } catch (error) {
        setErrors({ server: error.message });
        return;
      }
    }

    // Call the GraphQL mutation
    try {
      const { data } = await addTeamMember({
        variables: { addUserInput },
      });

      if (data.addUser) {
        setSuccess(true);
        setFormData({
          name: '',
          role: '',
          enterRole: '', // Clear enterRole field after success
          bio: '',
          photo: null,
        });
        setErrors({});
        setTimeout(() => navigate('/'), 1000); // Redirect after a short delay
      }
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
      enterRole: '', // Clear enterRole field on cancel
      bio: '',
      photo: null,
    });
    setErrors({});
    setSuccess(false);
    navigate('/'); // Navigate to the team list page
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSave} id="team_member_form" className="form-content">
        <h1 className="title">Add Team Member</h1>

        {errors.server && <div className="error">{errors.server}</div>}

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
            placeholder="Enter Role Description"
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
          <div>Or provide a URL for the photo</div>
          <input
            type="text"
            id="photoUrl"
            name="photoUrl"
            className="input"
            onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.value }))}
            placeholder="Enter Photo URL"
          />
        </div>

        {/* Wrap buttons under the form */}
        <div className="form-group button-group">
          <button type="submit" className="action-button">Save</button>
          <button type="button" onClick={handleCancel} className="action-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddTeamMember;
