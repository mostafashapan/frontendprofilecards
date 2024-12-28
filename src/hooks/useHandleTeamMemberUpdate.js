import { useState } from 'react';

const useHandleTeamMemberUpdate = (teamMembers, setTeamMembers) => {
  const [checkedMembers, setCheckedMembers] = useState([]);
  const [updateData, setUpdateData] = useState({
    role: '',
    name: '',
    bio: '',
    photo: ''
  });

  // Handle checkbox changes, track selected team members
  const handleCheckboxChange = (id, isChecked) => {
    setCheckedMembers(prev =>
      isChecked ? [...prev, id] : prev.filter(memberId => memberId !== id)
    );
  };

  // Handle update of selected team member
  const handleUpdate = async () => {
    if (checkedMembers.length === 0 || !updateData) {
      return;
    }

    try {
      // Create an array of fetch promises to update each selected team member
      const requests = checkedMembers.map(id =>
        fetch(`${process.env.REACT_APP_API_URL}/teamMembers/${encodeURIComponent(id)}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),  // Pass the updated team member data here
        })
      );

      // Wait for all requests to complete
      const responses = await Promise.all(requests);

      // Check if all responses are OK
      const allSuccessful = responses.every(response => response.ok);

      if (allSuccessful) {
        // If all requests are successful, update the UI
        alert('Team members updated successfully!');
        setCheckedMembers([]);  // Reset the checked members state
        setUpdateData({
          role: '',
          name: '',
          bio: '',
          photo: ''
        });  // Reset the update form
      } else {
        // Handle errors if some requests failed
        const errorMessages = await Promise.all(responses.map(response => 
          response.ok ? null : response.json().then(err => err.error || 'Unknown error')
        ));
        console.error('Error updating team members:', errorMessages.filter(msg => msg));
      }
    } catch (error) {
      console.error('Error updating team members:', error);
    }
  };

  return { checkedMembers, handleCheckboxChange, handleUpdate, setUpdateData, updateData };
};

export default useHandleTeamMemberUpdate;
