import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client'; // Apollo Client hooks
import './css/TeamSection.css';

// GraphQL Query to get all users (team members)
const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      name
      role
      bio
      photo
    }
  }
`;

// GraphQL Mutation to delete multiple users by their IDs
const DELETE_USERS = gql`
  mutation deleteUsers($ids: [Int!]!) {
    deleteUsers(ids: $ids)
  }
`;

function TeamSectioncard() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS); // Fetch data with useQuery and include refetch
  const [deleteUsers] = useMutation(DELETE_USERS); // Use the mutation hook for deletion

  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [checkedMembers, setCheckedMembers] = useState([]);

  // Handle mass deletion of users
  const handleDelete = async () => {
    const idsToDelete = checkedMembers.map((index) => Number(data.getAllUsers[index].id)); // Ensure the IDs are numbers
    console.log('IDs to delete:', idsToDelete);

    if (idsToDelete.length === 0) {
      return; // If no users are selected, do nothing
    }

    try {
      const { data: deleteData } = await deleteUsers({ variables: { ids: idsToDelete } });

      if (deleteData.deleteUsers) {
        await refetch(); // Refetch the updated list of users
        setCheckedMembers([]); // Reset checked members after deletion
      }
    } catch (err) {
      console.error('Error deleting users:', err);
    }
  };

  // Handle checkbox change for mass selection
  const handleCheckboxChange = (index, isChecked) => {
    if (isChecked) {
      setCheckedMembers([...checkedMembers, index]);
    } else {
      setCheckedMembers(checkedMembers.filter((i) => i !== index));
    }
  };

  // Handle selection for edit
  const handleSelectForEdit = (index) => {
    setSelectedForEdit(index);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching team members: {error.message}</p>;

  return (
    <div className="team-section">
      {/* Action Buttons */}
      <div className="action-buttons">
        <Link to="/AddTeamMember" className="add-team-member-button">
          ADD
        </Link>
        <button className="delete-all-button" onClick={handleDelete}>
          MASS DELETE
        </button>

        {selectedForEdit !== null && (
          <Link to={`/UpdateTeamMember/${data.getAllUsers[selectedForEdit].id}`} className="edit-team-member-button">
            Edit Selected Member
          </Link>
        )}
      </div>

      {/* Display each team member's profile */}
      {data.getAllUsers.map((member, index) => (
        <div key={index} className="profile-card">
          <img src={member.photo} alt={member.name} className="profile-photo" />
          <h2 className="name">{member.name}</h2>
          <p className="role">{member.role}</p>
          <p className="bio">{member.bio}</p>

          <div className="checkbox-container">
            {/* Checkbox for mass delete */}
            <input
              type="checkbox"
              checked={checkedMembers.includes(index)}
              onChange={(e) => handleCheckboxChange(index, e.target.checked)}
              aria-label={`Select ${member.name} for mass delete`}
            />

            {/* Checkbox for editing */}
            <input
              type="checkbox"
              checked={selectedForEdit === index}
              onChange={() => handleSelectForEdit(index)}
              aria-label={`Select ${member.name} for editing`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamSectioncard;
